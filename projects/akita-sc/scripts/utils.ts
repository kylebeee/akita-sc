import { AlgorandClient, microAlgo } from '@algorandfoundation/algokit-utils'
import { SDKClient } from 'akita-sdk'
import { AkitaDaoSDK, ProposalAction } from 'akita-sdk/dao'

/**
 * Checks if an app account needs funding and returns the amount to send.
 * Adds a 10 ALGO buffer when funding is needed so we don't fund on every call.
 * Returns 0n if the account already has sufficient surplus.
 */
export async function getAppFundingNeeded(
  algorand: AlgorandClient,
  appAddress: string,
  required: bigint,
  buffer: bigint = 10_000_000n,
): Promise<bigint> {
  const info = await algorand.account.getInformation(appAddress)
  const surplus = BigInt(info.balance.microAlgos) - BigInt(info.minBalance.microAlgos)
  if (surplus >= required) return 0n
  return required - surplus + buffer
}

/**
 * Shared helper to create and execute a proposal in one step.
 * Smart-funds the DAO app account only when needed.
 */
export async function proposeAndExecute<TClient extends SDKClient>(
  algorand: AlgorandClient,
  dao: AkitaDaoSDK,
  actions: ProposalAction<TClient>[]
): Promise<bigint> {
  const info = await dao.proposalCost({ actions })
  const funding = await getAppFundingNeeded(
    algorand, dao.client.appClient.appAddress.toString(), info.total
  )
  if (funding > 0n) {
    await dao.client.appClient.fundAppAccount({ amount: microAlgo(funding) })
  }

  const { return: proposalId } = await dao.newProposal({ actions })
  if (proposalId === undefined) {
    throw new Error('Failed to create proposal')
  }

  await dao.executeProposal({ proposalId })
  return proposalId
}
