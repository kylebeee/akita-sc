import { classes } from "polytype";
import { FactoryContract } from "../utils/base-contracts/factory";
import { BasePool } from "./base";
import { abimethod, Account, Application, assert, assertMatch, Global, gtxn, itxn, Txn, uint64 } from "@algorandfoundation/algorand-typescript";
import { StakingType } from "../staking/types";
import { abiCall, compileArc4 } from "@algorandfoundation/algorand-typescript/arc4";
import { RootKey } from "../meta-merkles/types";
import { Pool } from "./contract.algo";
import { getFunder, getStakingFees, getWalletIDUsingAkitaDAO, referrerOrZeroAddress, sendReferralPayment } from "../utils/functions";
import { GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MAX_PROGRAM_PAGES } from "../utils/constants";
import { ERR_NOT_CREATOR } from "./errors";
// import { MinDisbursementsMBR, UserAllocationMBR } from "../rewards/constants";

export class PoolFactory extends classes(
  BasePool,
  FactoryContract
) {
  // GLOBAL STATE ---------------------------------------------------------------------------------
  // BOXES ----------------------------------------------------------------------------------------
  // PRIVATE METHODS ------------------------------------------------------------------------------
  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, childVersion: string, akitaDAO: uint64): void {
    this.version.value = version
    this.childContractVersion.value = childVersion
    this.akitaDAO.value = Application(akitaDAO)
  }

  setEscrow(escrow: uint64): void {
    assert(this.akitaDAO.value.address === Txn.sender, ERR_NOT_CREATOR)
    this.akitaDAOEscrow.value = Application(escrow)
  }

  // POOL FACTORY METHODS -------------------------------------------------------------------------

  newPool(
    payment: gtxn.PaymentTxn,
    title: string,
    type: StakingType,
    marketplace: Account,
    stakeKey: RootKey,
    minimumStakeAmount: uint64,
    gateID: uint64,
    maxEntries: uint64,
  ): uint64 {

    const { creationFee } = getStakingFees(this.akitaDAO.value)

    const pool = compileArc4(Pool)

    const childMBR: uint64 = (
      MAX_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * pool.globalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * pool.globalBytes) +
      Global.minBalance
    )

    let leftover: uint64 = creationFee
    let referralCost: uint64 = 0
    if (creationFee > 0) {
      const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
      const referrer = referrerOrZeroAddress(wallet);
      ({ leftover, cost: referralCost } = sendReferralPayment(this.akitaDAO.value, referrer, 0, creationFee))
    }

    const totalMBR: uint64 = (
      creationFee +
      childMBR +
      referralCost
    )

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: totalMBR,
      }
    )

    itxn
      .payment({
        receiver: this.akitaDAOEscrow.value.address,
        amount: leftover,
      })
      .submit()

    const newPoolApp = pool.call
      .create({
        args: [
          title,
          type,
          Txn.sender,
          { account: payment.sender, amount: childMBR },
          marketplace,
          stakeKey,
          minimumStakeAmount,
          gateID,
          maxEntries,
          this.akitaDAO.value.id,
        ],
      })
      .itxn
      .createdApp

    pool.call.init({ appId: newPoolApp.id })

    return newPoolApp.id
  }

  deletePool(appId: Application): void {
    assert(appId.creator === Global.currentApplicationAddress, ERR_NOT_CREATOR)

    const { account: receiver, amount } = getFunder(appId)

    abiCall<typeof Pool.prototype.delete>({
      appId,
      args: [Txn.sender],
    })

    itxn
      .payment({ receiver, amount })
      .submit()
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------
}
