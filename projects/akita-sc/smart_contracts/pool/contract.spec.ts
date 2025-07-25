import { Config } from '@algorandfoundation/algokit-utils'
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import algosdk from 'algosdk'
import { beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { PoolClient, PoolFactory } from '../artifacts/pool/PoolClient'
import { PoolFactoryClient } from '../artifacts/pool/PoolFactoryClient'
import { DEFAULT_MIN_POOL_CREATION_FEE } from '../utils/defaults'


const calcNewPoolCost = (creationFee: bigint, appCreatorsMBR: bigint) => {
  return Number(
    creationFee +
    300_000n + // 300k microAlgo for program pages
    (28_500n * 13n) +
    (50_000n * 8n) +
    100_000n + // account min balance
    appCreatorsMBR
  )
}

describe('Staking Pool Contract', () => {
  let factoryID: bigint
  let poolID: bigint
  let deployer: algosdk.Address & TransactionSignerAccount & algosdk.Account
  let creator: algosdk.Address & TransactionSignerAccount & algosdk.Account

  const localnet = algorandFixture()
  beforeAll(async () => {
    Config.configure({
      debug: true,
      // traceAll: true,
    })
    registerDebugEventHandlers()
  })
  beforeEach(localnet.newScope)

  test('deploy', async () => {
    const { testAccount } = localnet.context
    deployer = testAccount

    const factory = localnet.algorand.client.getTypedAppFactory(PoolFactory, {
      defaultSender: testAccount,
      defaultSigner: testAccount.signer,
    })

    const { appClient } = await factory.deploy({ onSchemaBreak: 'append' })

    factoryID = appClient.appId

    // fund app
    const dispenser = await localnet.algorand.account.dispenserFromEnvironment();
    await localnet.context.algorand.account.ensureFunded(appClient.appAddress, dispenser, (0).microAlgos())
  })

  test('create a new pool', async () => {
    const { testAccount } = localnet.context
    creator = testAccount

    const dispenser = await localnet.algorand.account.dispenserFromEnvironment();

    const txnCount = 1
    const itxnCount = 2
    const suggestedParams = await localnet.algorand.getSuggestedParams()

    const client = localnet.algorand.client.getTypedAppClientById(PoolFactoryClient, {
      appId: factoryID,
      defaultSender: testAccount,
      defaultSigner: testAccount.signer,
    })

    let accountInfo = await client.algorand.account.getInformation(client.appAddress)
    expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

    const creationFee = DEFAULT_MIN_POOL_CREATION_FEE
    const amount = calcNewPoolCost(creationFee, 22_100n)

    const feeCoverage = (txnCount + itxnCount) * Number(suggestedParams.minFee)
    console.log(`Funding petition with amount: ${amount}, fee coverage: ${feeCoverage}`)
    const minFundingAmount = amount + feeCoverage

    await localnet.context.algorand.account.ensureFunded(testAccount.addr, dispenser, minFundingAmount.microAlgos())

    const result = await client.send.newPool({
      args: {
        payment: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          sender: testAccount.addr,
          receiver: client.appAddress,
          amount,
          suggestedParams,
        }),
        title: 'Test Pool',
        type: 20n, // soft TODO: create frontend enums for this
        marketplace: testAccount.addr.toString(),
        stakeKey: {
          address: testAccount.addr.toString(),
          name: 'MyPool'
        },
        minimumStakeAmount: 0,
        gateId: 0,
        maxEntries: 0,
      },
      extraFee: (itxnCount * Number(suggestedParams.minFee)).microAlgos(), // 2 extra fee for the asset creation & deployer payment
    })

    expect(result.return).toBeDefined()

    accountInfo = await client.algorand.account.getInformation(client.appAddress)
    expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)

    poolID = result.return || 0n
  })

  // test.skip('fail to add description without coverage', async () => {

  //   const client = localnet.algorand.client.getTypedAppClientById(PetitionsClient, {
  //     appId: appID,
  //     defaultSender: petitionCreator,
  //     defaultSigner: petitionCreator.signer,
  //   })

  //   await expect(client.send.addPetitionDescription({
  //     args: {
  //       petitionId: petitionID,
  //       description: extendedDescription,
  //       append: false,
  //     }
  //   })).rejects.toThrow()
  // })

  // test.skip('add coverage', async () => {
  //   const dispenser = await localnet.algorand.account.dispenserFromEnvironment()
  //   const suggestedParams = await localnet.algorand.getSuggestedParams()

  //   // explicitly fund from a different account than the petition creator
  //   // this showcases that adding coverage can be covered by any account
  //   const client = localnet.algorand.client.getTypedAppClientById(PetitionsClient, {
  //     appId: appID,
  //     defaultSender: deployer,
  //     defaultSigner: deployer.signer,
  //   })

  //   console.log(`Adding coverage for petition ${petitionID} with description length: ${extendedDescription.length}`)
  //   const mbrIncrease = (extendedDescription.length * 400) - (description.length * 400) // Calculate the increase in MBR based on the new description length
  //   const feeCoverage = Number(suggestedParams.minFee)
  //   const totalAmount = mbrIncrease + feeCoverage

  //   await localnet.context.algorand.account.ensureFunded(deployer.addr, dispenser, totalAmount.microAlgos())

  //   await expect(client.send.addCoverage({
  //     args: {
  //       payment: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
  //         sender: deployer.addr,
  //         receiver: client.appAddress,
  //         amount: mbrIncrease,
  //         suggestedParams,
  //       }),
  //       petitionId: petitionID,
  //     }
  //   })).resolves.not.toThrow()
  // })

  // test.skip('max out the size', async () => {
  //   const dispenser = await localnet.algorand.account.dispenserFromEnvironment()
  //   const suggestedParams = await localnet.algorand.getSuggestedParams()

  //   const chunkSize = 2033 // should be 2035 but i think algokit is adding 2 bytes for encoding the string
  //   let chunkedDescription = []
  //   for (let i = 0; i < extendedDescription.length; i += chunkSize) {
  //     chunkedDescription.push(extendedDescription.slice(i, i + chunkSize))
  //   }

  //   expect(chunkedDescription.length).toBeGreaterThan(0)
  //   expect(chunkedDescription.length).toBeLessThanOrEqual(16)

  //   const totalAmount = Number(suggestedParams.minFee) * chunkedDescription.length
  //   await localnet.context.algorand.account.ensureFunded(petitionCreator.addr, dispenser, totalAmount.microAlgos())

  //   const client = localnet.algorand.client.getTypedAppClientById(PetitionsClient, {
  //     appId: appID,
  //     defaultSender: petitionCreator,
  //     defaultSigner: petitionCreator.signer,
  //   })

  //   const group = client.newGroup()

  //   chunkedDescription.map((chunk, index) => {
  //     console.log(`Adding chunk ${index + 1}/${chunkedDescription.length} with length: ${chunk.length}, encoded length: ${Buffer.from(chunk).length}`)
  //     group.addPetitionDescription({
  //       args: {
  //         petitionId: petitionID,
  //         description: chunk,
  //         append: index > 0, // Append for all but the first chunk
  //       },
  //       note: `Chunk ${index + 1}/${chunkedDescription.length}`,
  //     })
  //   })

  //   await expect(group.send()).resolves.not.toThrow()

  //   const encodedUpdatedDescription = await client.state.box.descriptions.value(petitionID)
  //   expect(encodedUpdatedDescription).toBeDefined()
  //   const updatedDescription = new TextDecoder().decode(encodedUpdatedDescription)
  //   expect(updatedDescription).toBe(extendedDescription)
  // })

  // test.skip('finalize the petition', async () => {
  //   const dispenser = await localnet.algorand.account.dispenserFromEnvironment()
  //   await localnet.context.algorand.account.ensureFunded(petitionCreator.addr, dispenser, (1000).microAlgos())

  //   const client = localnet.algorand.client.getTypedAppClientById(PetitionsClient, {
  //     appId: appID,
  //     defaultSender: petitionCreator,
  //     defaultSigner: petitionCreator.signer,
  //   })

  //   const petition = await client.state.box.petition.value(petitionID)
  //   expect(petition).toBeDefined()

  //   await expect(client.send.finalizePetition({
  //     args: {
  //       petitionId: petitionID,
  //     }
  //   })).resolves.not.toThrow()
  // })

  // test.skip('sign a petition', async () => {
  //   const { testAccount } = localnet.context

  //   const dispenser = await localnet.algorand.account.dispenserFromEnvironment();

  //   const txnCount = 3
  //   const itxnCount = 3
  //   const suggestedParams = await localnet.algorand.getSuggestedParams()

  //   const client = localnet.algorand.client.getTypedAppClientById(PetitionsClient, {
  //     appId: appID,
  //     defaultSender: testAccount,
  //     defaultSigner: testAccount.signer,
  //   })

  //   const signingFee = await client.state.global.signingFee() || 0n
  //   const tokenCostFee = await client.state.global.tokenCostFee() || 0n
  //   const tokenPurchaseCount = 100
  //   const amount = Number(signingFee) + (Number(tokenCostFee) * tokenPurchaseCount)

  //   const feeCoverage = (txnCount + itxnCount) * Number(suggestedParams.minFee)
  //   console.log(`Funding petition with amount: ${amount}, fee coverage: ${feeCoverage}`)
  //   const minFundingAmount = amount + feeCoverage

  //   await localnet.context.algorand.account.ensureFunded(testAccount.addr, dispenser, minFundingAmount.microAlgos())

  //   const petition = await client.state.box.petition.value(petitionID)

  //   expect(petition).toBeDefined()
  //   expect(petition?.title).toBe(title)
  //   expect(petition?.token).toBeGreaterThan(0n)

  //   const assetIndex = petition?.token!

  //   const result = await client
  //     .newGroup()
  //     .addTransaction(
  //       algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
  //         sender: testAccount.addr,
  //         receiver: testAccount.addr,
  //         assetIndex,
  //         amount: 0,
  //         suggestedParams
  //       })
  //     )
  //     .signPetition({
  //       args: {
  //         payment: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
  //           sender: testAccount.addr,
  //           receiver: client.appAddress,
  //           amount, // signing fee
  //           suggestedParams: await localnet.algorand.getSuggestedParams(),
  //         }),
  //         petitionId: petitionID,
  //         count: BigInt(tokenPurchaseCount),
  //       },
  //       extraFee: (itxnCount * Number(suggestedParams.minFee)).microAlgos(), // 3 extra fee for [deployer, petition creator, tokens to caller]
  //     })
  //     .send()

  //   console.log('Sign petition result:', result)
  //   expect(result.returns).toBeDefined()
  // })
})
