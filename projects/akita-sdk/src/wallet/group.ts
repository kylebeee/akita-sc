import type { WalletSDK } from './index'
import { AbstractedAccountArgs, AbstractedAccountComposer, PluginKey } from '../generated/AbstractedAccountClient'
import { AddAllowanceArgs, AddPluginArgs, WalletAddPluginParams, WalletUsePluginParams } from './types'
import { AllowancesToTuple } from './utils'
import { NewEscrowFeeAmount } from './constants'
import { isPluginSDKReturn, MaybeSigner, SDKClient, GroupReturn, ExpandedSendParams } from '../types'
import { MAX_UINT64 } from '../constants'
import { ALGORAND_ZERO_ADDRESS_STRING } from 'algosdk'
import { microAlgo } from '@algorandfoundation/algokit-utils'
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'
import { SendParams } from '@algorandfoundation/algokit-utils/types/transaction'
import { prepareGroupWithCost } from '../simulate/prepare'

type ContractArgs = AbstractedAccountArgs["obj"]

/**
 * Fluent composer returned by `wallet.group()` that queues wallet operations
 * and resolves them as a single atomic group at `send()` time.
 *
 * Tracks internal state like new escrow creation across operations so that
 * only the first addPlugin with a given escrow pays the NewEscrowFeeAmount.
 */
export class WalletGroupComposer {
  private wallet: WalletSDK
  private resolvers: (() => Promise<void>)[] = []
  private postProcessors: (() => Promise<void>)[] = []
  private newEscrows: Set<string> = new Set()
  /** Tracks `"escrow:asset"` keys to deduplicate allowance additions */
  private newAllowances: Set<string> = new Set()
  private group: AbstractedAccountComposer<[]>

  constructor(wallet: WalletSDK) {
    this.wallet = wallet
    this.group = wallet.client.newGroup()
  }

  private getSendParams({ sender, signer }: MaybeSigner = {}): ExpandedSendParams {
    return {
      ...this.wallet.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer }),
    }
  }

  // ---------------------------------------------------------------------------
  // Complex methods
  // ---------------------------------------------------------------------------

  addPlugin<TClient extends SDKClient>(params: WalletAddPluginParams<TClient>): this {
    this.resolvers.push(async () => {
      const {
        sender, signer, name = '', client, caller: rawCaller,
        global = false, methods = [], escrow = '', admin = false,
        delegationType = 0n, lastValid = MAX_UINT64, cooldown = 0n,
        useRounds = false, useExecutionKey = false, coverFees = false,
        canReclaim = true, defaultToEscrow = false, allowances = []
      } = params as WalletAddPluginParams<TClient> & { caller?: string; global?: boolean }

      let caller = rawCaller
      const sendParams = this.getSendParams({ sender, signer })
      const plugin = client.appId

      if (global) {
        caller = ALGORAND_ZERO_ADDRESS_STRING
      }

      // Transform methods
      let transformedMethods: [Uint8Array<ArrayBufferLike>, number | bigint][] = []
      if (methods.length > 0) {
        transformedMethods = methods.reduce<[Uint8Array<ArrayBufferLike>, number | bigint][]>(
          (acc, method) => {
            if (isPluginSDKReturn(method.name)) {
              const selectors = method.name().selectors ?? []
              selectors.forEach((selector) => acc.push([selector, method.cooldown]))
            } else {
              method.name.forEach(x => acc.push([x, method.cooldown]))
            }
            return acc
          },
          []
        )
      }

      // Check escrow — both SDK cache and this group's new escrows
      const isNewEscrow = escrow !== ''
        && !this.wallet.escrows.get(escrow)
        && !this.newEscrows.has(escrow)

      if (isNewEscrow) {
        this.newEscrows.add(escrow)
      }

      // Check if controlled address differs from app address — requires extra fee
      const controlledAddress = await this.wallet.client.state.global.controlledAddress()
      const hasExternalControlledAddress = controlledAddress !== this.wallet.client.appAddress.toString()
      const externalControlledFee = hasExternalControlledAddress ? 1000n : 0n

      const extraFee = microAlgo((isNewEscrow ? NewEscrowFeeAmount : 0n) + externalControlledFee)

      const args: AddPluginArgs = {
        plugin,
        caller: caller!,
        escrow,
        admin,
        delegationType,
        lastValid,
        cooldown,
        methods: transformedMethods,
        useRounds,
        useExecutionKey,
        coverFees,
        canReclaim,
        defaultToEscrow
      }

      if (name !== '') {
        this.group.arc58AddNamedPlugin({
          ...sendParams,
          args: { name, ...args },
          extraFee
        })
      } else {
        this.group.arc58AddPlugin({
          ...sendParams,
          args,
          extraFee
        })
      }

      if (allowances.length > 0) {
        if (escrow === '') {
          throw new Error('Allowances can only be added to plugins with an escrow')
        }
        // Deduplicate: skip allowances whose (escrow, asset) pair was already queued
        const dedupedAllowances = allowances.filter((a: AddAllowanceArgs) => {
          const key = `${escrow}:${a.asset}`
          if (this.newAllowances.has(key)) return false
          this.newAllowances.add(key)
          return true
        })
        if (dedupedAllowances.length > 0) {
          this.group.arc58AddAllowances({
            ...sendParams,
            args: {
              escrow,
              allowances: AllowancesToTuple(dedupedAllowances)
            }
          })
        }
      }

      // Queue post-processing (runs after the group is sent)
      const pluginKey: PluginKey = { plugin, caller: caller!, escrow }
      const allowanceAssets = allowances.map((a: AddAllowanceArgs) => a.asset)
      this.postProcessors.push(async () => {
        if (isNewEscrow) {
          await this.wallet.register({ sender, signer, escrow })
        }
        await this.wallet.updateCache(pluginKey, allowanceAssets).catch(error => {
          console.warn('Failed to update plugin cache:', error)
        })
      })
    })
    return this
  }

  usePlugin(params: WalletUsePluginParams): this {
    this.resolvers.push(async () => {
      const { group: tempGroup } = await this.wallet.prepareUsePlugin(params)
      const atc = (await (await tempGroup.composer()).build()).atc
      const mainComposer = await this.group.composer()
      mainComposer.addAtc(atc)
    })
    return this
  }

  // ---------------------------------------------------------------------------
  // Simple methods
  // ---------------------------------------------------------------------------

  register({ sender, signer, ...args }: ContractArgs['register(string)void'] & MaybeSigner): this {
    this.resolvers.push(async () => {
      this.group.register({ ...this.getSendParams({ sender, signer }), args })
    })
    return this
  }

  changeRevocationApp({ sender, signer, app }: MaybeSigner & { app: bigint }): this {
    this.resolvers.push(async () => {
      this.group.setRevocationApp({ ...this.getSendParams({ sender, signer }), args: { app } })
    })
    return this
  }

  setNickname({ sender, signer, nickname }: MaybeSigner & { nickname: string }): this {
    this.resolvers.push(async () => {
      this.group.setNickname({ ...this.getSendParams({ sender, signer }), args: { nickname } })
    })
    return this
  }

  setAvatar({ sender, signer, avatar }: MaybeSigner & { avatar: bigint }): this {
    this.resolvers.push(async () => {
      this.group.setAvatar({ ...this.getSendParams({ sender, signer }), args: { avatar } })
    })
    return this
  }

  setBanner({ sender, signer, banner }: MaybeSigner & { banner: bigint }): this {
    this.resolvers.push(async () => {
      this.group.setBanner({ ...this.getSendParams({ sender, signer }), args: { banner } })
    })
    return this
  }

  setBio({ sender, signer, bio }: MaybeSigner & { bio: string }): this {
    this.resolvers.push(async () => {
      this.group.setBio({ ...this.getSendParams({ sender, signer }), args: { bio } })
    })
    return this
  }

  changeAdmin({ sender, signer, newAdmin }: MaybeSigner & { newAdmin: string }): this {
    this.resolvers.push(async () => {
      this.group.arc58ChangeAdmin({ ...this.getSendParams({ sender, signer }), args: { newAdmin } })
    })
    return this
  }

  verifyAuthAddress(params?: MaybeSigner): this {
    this.resolvers.push(async () => {
      this.group.arc58VerifyAuthAddress({ ...this.getSendParams(params), args: {} })
    })
    return this
  }

  rekeyTo({ sender, signer, ...args }: MaybeSigner & ContractArgs['arc58_rekeyTo(address,bool)void']): this {
    this.resolvers.push(async () => {
      this.group.arc58RekeyTo({ ...this.getSendParams({ sender, signer }), args })
    })
    return this
  }

  canCall({ sender, signer, ...args }: ContractArgs['arc58_canCall(uint64,bool,address,string,byte[4])bool'] & MaybeSigner): this {
    this.resolvers.push(async () => {
      this.group.arc58CanCall({ ...this.getSendParams({ sender, signer }), args })
    })
    return this
  }

  removePlugin({ sender, signer, ...args }: ContractArgs['arc58_removePlugin(uint64,address,string)void'] & MaybeSigner): this {
    this.resolvers.push(async () => {
      this.group.arc58RemovePlugin({ ...this.getSendParams({ sender, signer }), args })
    })
    return this
  }

  newEscrow({ sender, signer, ...args }: ContractArgs['arc58_newEscrow(string)uint64'] & MaybeSigner): this {
    this.resolvers.push(async () => {
      this.group.arc58NewEscrow({ ...this.getSendParams({ sender, signer }), args })
      this.newEscrows.add(args.escrow)
    })
    return this
  }

  toggleEscrowLock({ sender, signer, ...args }: ContractArgs['arc58_toggleEscrowLock(string)(uint64,bool)'] & MaybeSigner): this {
    this.resolvers.push(async () => {
      this.group.arc58ToggleEscrowLock({ ...this.getSendParams({ sender, signer }), args })
    })
    return this
  }

  reclaimFunds({ sender, signer, ...args }: ContractArgs['arc58_reclaim(string,(uint64,uint64,bool)[])void'] & MaybeSigner): this {
    this.resolvers.push(async () => {
      this.group.arc58Reclaim({ ...this.getSendParams({ sender, signer }), args })
    })
    return this
  }

  optInEscrow({ sender, signer, ...args }: ContractArgs['arc58_optInEscrow(string,uint64[])void'] & MaybeSigner): this {
    this.resolvers.push(async () => {
      this.group.arc58OptInEscrow({ ...this.getSendParams({ sender, signer }), args })
    })
    return this
  }

  addAllowances({ sender, signer, escrow, allowances }: { escrow: string; allowances: AddAllowanceArgs[] } & MaybeSigner): this {
    this.resolvers.push(async () => {
      this.group.arc58AddAllowances({
        ...this.getSendParams({ sender, signer }),
        args: { escrow, allowances: AllowancesToTuple(allowances) }
      })
    })
    return this
  }

  removeAllowances({ sender, signer, ...args }: ContractArgs['arc58_removeAllowances(string,uint64[])void'] & MaybeSigner): this {
    this.resolvers.push(async () => {
      this.group.arc58RemoveAllowances({ ...this.getSendParams({ sender, signer }), args })
    })
    return this
  }

  addExecutionKey({ sender, signer, ...args }: ContractArgs['arc58_addExecutionKey(byte[32],byte[32][],uint64,uint64)void'] & MaybeSigner): this {
    this.resolvers.push(async () => {
      this.group.arc58AddExecutionKey({ ...this.getSendParams({ sender, signer }), args })
    })
    return this
  }

  removeExecutionKey({ sender, signer, ...args }: ContractArgs['arc58_removeExecutionKey(byte[32])void'] & MaybeSigner): this {
    this.resolvers.push(async () => {
      this.group.arc58RemoveExecutionKey({ ...this.getSendParams({ sender, signer }), args })
    })
    return this
  }

  // ---------------------------------------------------------------------------
  // Terminal
  // ---------------------------------------------------------------------------

  async send(params?: SendParams): Promise<GroupReturn> {
    // Resolve all queued operations (builds the atomic group)
    for (const resolver of this.resolvers) {
      await resolver()
    }

    // Build the ATC from the composed group
    const built = await (await this.group.composer()).build()
    const atc = built.atc
    const length = built.transactions.length

    // Get suggested params for fee calculation
    const suggestedParams = await this.wallet.client.algorand.getSuggestedParams()

    // Set max fees for all transactions to allow prepareGroupWithCost to work
    const maxFees = new Map<number, AlgoAmount>(
      Array.from({ length }, (_, i) => [i, microAlgo(BigInt(suggestedParams.minFee) * 272n)])
    )

    // Use prepareGroupWithCost to simulate the group, populate resources,
    // and calculate exact fees for inner transactions
    const { atc: populatedAtc } = await prepareGroupWithCost(
      atc,
      this.wallet.client.algorand.client.algod,
      {
        coverAppCallInnerTransactionFees: true,
        populateAppCallResources: true
      },
      {
        maxFees,
        suggestedParams
      }
    )

    // Strip flags already handled by prepareGroupWithCost so AlgoKit doesn't
    // try to handle them a second time (which would require maxFee on every txn)
    const { coverAppCallInnerTransactionFees, populateAppCallResources, ...sendParams } = params ?? {} as any

    // Send the prepared atomic group
    const result = await this.wallet.client.algorand.newGroup()
      .addAtc(populatedAtc)
      .send(sendParams) as unknown as GroupReturn

    // Run post-processors (register escrows, update caches)
    for (const postProcessor of this.postProcessors) {
      await postProcessor()
    }

    return result
  }
}
