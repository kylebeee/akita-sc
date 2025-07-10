import * as algokit from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals'
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk'
import { StakingClient, StakingFactory } from '../artifacts/staking/StakingClient'

algokit.Config.configure({ populateAppCallResources: true })

const fixture = algorandFixture()

describe('Subscription Tests', () => {
  let deployer: algosdk.Account
  /** The suggested params for transactions */
  let suggestedParams: algosdk.SuggestedParams
  /** The client for the subscription contract */
  let client: StakingClient

  beforeEach(fixture.beforeEach)

  beforeAll(async () => {
    await fixture.beforeEach()
    const { algorand, algod } = fixture.context
    const dispenser = await algorand.account.dispenserFromEnvironment()
    suggestedParams = await algorand.getSuggestedParams()
    deployer = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(100_000_000) })

    await algorand.account.ensureFunded(deployer.addr, dispenser, (100).algo())

    const minter = new StakingFactory({
      defaultSender: deployer.addr,
      defaultSigner: makeBasicAccountTransactionSigner(deployer),
      algorand,
    })

    //create(version: string, akitaDAO: uint64, escrow: uint64): void {
    const results = await minter.send.create.create({ args: { version: '0.0.1', akitaDao: 0n } })
    client = results.appClient

    client.appClient.fundAppAccount({ amount: (100_000).microAlgos() })

    console.log('Staking Address:', client.appAddress.toString())
    console.log('current version: ', await client.state.global.version())
  })

  test('balance matches min', async () => {
    let accountInfo = await client.algorand.account.getInformation(client.appAddress)
    expect(accountInfo.balance.microAlgos).toEqual(accountInfo.minBalance.microAlgos)
  })
})