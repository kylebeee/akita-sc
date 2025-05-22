import { describe, test, beforeAll, beforeEach } from '@jest/globals'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import * as algokit from '@algorandfoundation/algokit-utils'
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk'
import { StandardMerkleTree } from '@joe-p/merkle-tree'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { HexString } from '@joe-p/merkle-tree/dist/bytes'
import { MetaMerklesClient, MetaMerklesFactory } from '../artifacts/meta-merkles/MetaMerklesClient'

const fixture = algorandFixture()
algokit.Config.configure({ populateAppCallResources: true })

describe('MetaMerkles', () => {
  let suggestedParams: algosdk.SuggestedParams
  let metaMerklesAppAddress: string
  let metaMerklesClient: MetaMerklesClient
  let bobsAccount: algosdk.Account & TransactionSignerAccount
  let treeValues: number[]
  let tree: StandardMerkleTree<any>

  beforeEach(fixture.beforeEach)

  beforeAll(async () => {
    await fixture.beforeEach()
    const { algod, testAccount } = fixture.context
    const { algorand } = fixture
    const dispenser = await algorand.account.dispenserFromEnvironment()
    bobsAccount = testAccount

    treeValues = [0, 1, 2]
    tree = StandardMerkleTree.of(treeValues, 'uint64', { hashFunction: 'sha256' })

    await algorand.account.ensureFunded(bobsAccount.addr, dispenser, algokit.algos(1000))

    suggestedParams = await algod.getTransactionParams().do()

    const minter = new MetaMerklesFactory({
      defaultSender: bobsAccount.addr,
      defaultSigner: makeBasicAccountTransactionSigner(bobsAccount),
      algorand,
    })

    const results = await minter.send.create.create()

    metaMerklesClient = results.appClient

    metaMerklesAppAddress = metaMerklesClient.appAddress.toString()

    // await metaMerklesClient.send.addSchema({
    //     args: {
    //         payment: await algorand.createTransaction.payment({
    //             sender: bobsAccount.addr,
    //             signer: makeBasicAccountTransactionSigner(bobsAccount),
    //             receiver: metaMerklesAppAddress,
    //             amount: (100).algo(),
    //         }),
    //         desc: 'Unspecified',
    //     },
    // })

    // await metaMerklesClient.send.addSchema({
    //     args: {
    //         payment: await algorand.createTransaction.payment({
    //             sender: bobsAccount.addr,
    //             signer: makeBasicAccountTransactionSigner(bobsAccount),
    //             receiver: metaMerklesAppAddress,
    //             amount: (100).algo(),
    //         }),
    //         desc: 'String',
    //     },
    // })

    // await metaMerklesClient.send.addSchema({
    //     args: {
    //         payment: await algorand.createTransaction.payment({
    //             sender: bobsAccount.addr,
    //             signer: makeBasicAccountTransactionSigner(bobsAccount),
    //             receiver: metaMerklesAppAddress,
    //             amount: (100).algo(),
    //         }),
    //         desc: 'Uint64',
    //     },
    // })

    // await metaMerklesClient.send.addSchema({
    //     args: {
    //         payment: await algorand.createTransaction.payment({
    //             sender: bobsAccount.addr,
    //             signer: makeBasicAccountTransactionSigner(bobsAccount),
    //             receiver: metaMerklesAppAddress,
    //             amount: (100).algo(),
    //         }),
    //         desc: 'DoubleUint64',
    //     },
    // })

    await metaMerklesClient.send.addType({
      args: {
        payment: await algorand.createTransaction.payment({
          sender: bobsAccount.addr,
          signer: makeBasicAccountTransactionSigner(bobsAccount),
          receiver: metaMerklesAppAddress,
          amount: (100).algo(),
        }),
        description: 'Unspecified',
        schemaList: []
      },
    })

    await metaMerklesClient.send.addType({
      args: {
        payment: await algorand.createTransaction.payment({
          sender: bobsAccount.addr,
          signer: makeBasicAccountTransactionSigner(bobsAccount),
          receiver: metaMerklesAppAddress,
          amount: (100).algo(),
        }),
        description: 'Collection',
        schemaList: [3],
      },
    })

    await metaMerklesClient.send.addType({
      args: {
        payment: await algorand.createTransaction.payment({
          sender: bobsAccount.addr,
          signer: makeBasicAccountTransactionSigner(bobsAccount),
          receiver: metaMerklesAppAddress,
          amount: (100).algo(),
        }),
        description: 'Trait',
        schemaList: [3],
      },
    })

    await metaMerklesClient.send.addType({
      args: {
        payment: await algorand.createTransaction.payment({
          sender: bobsAccount.addr,
          signer: makeBasicAccountTransactionSigner(bobsAccount),
          receiver: metaMerklesAppAddress,
          amount: (100).algo(),
        }),
        description: 'Trade',
        schemaList: [16, 16, 3, 3],
      },
    })
  })

  describe('Metamerkles program', () => {
    /** The boxes to pass to app calls */
    test('Addroot', async () => {
      console.log(bobsAccount.addr)
      console.log('Merkle Root:', tree.render())
      console.log(JSON.stringify(tree.dump()))
      console.log(Buffer.from(tree.root.slice(2), 'hex').length)

      const rootCosts = (await metaMerklesClient.send.rootCosts({ args: { name: 'meh' } })).return!

      await metaMerklesClient.send.addRoot({
        sender: bobsAccount.addr,
        args: {
          payment: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            sender: bobsAccount.addr,
            receiver: metaMerklesAppAddress,
            amount: rootCosts,
            suggestedParams,
          }),
          name: 'meh',
          root: Buffer.from(tree.root.slice(2), 'hex'),
          type: 1,
        },
      })
    })

    test('AddData', async () => {
      const key = 'royalty'
      const value = '5'

      const dataCosts = (await metaMerklesClient.send.dataCosts({ args: { name: 'meh', key: 'royalty', value: '5000' } })).return!

      await metaMerklesClient.send.addData({
        sender: bobsAccount.addr,
        args: {
          payment: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            sender: bobsAccount.addr,
            receiver: metaMerklesAppAddress,
            amount: dataCosts,
            suggestedParams,
          }),
          name: 'meh',
          key: 'royalty',
          value: '5000',
        },
      })
    })

    test('VerifiedRead', async () => {
      let p: HexString[] = []
      for (const [i, v] of tree.entries()) {
        if (v === 0) {
          p = tree.getProof(i)
        }
      }

      const fee = algokit.microAlgos(algokit.ALGORAND_MIN_TX_FEE.microAlgos * BigInt(p.length + 2))

      const leaf = Buffer.from(tree.leafHash(0).slice(2), 'hex')
      const proof = p.map((n) => Buffer.from(n.slice(2), 'hex'))

      const response = await metaMerklesClient.send.verifiedRead({
        sender: bobsAccount.addr,
        args: {
          address: bobsAccount.addr.toString(),
          name: 'meh',
          leaf,
          proof,
          key: 'royalty',
          type: 2,
        },
        extraFee: fee,
      })

      console.log(response)
    })

    test('updateRoot', async () => { })
  })
})
