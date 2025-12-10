import { abimethod, Account, Application, assert, assertMatch, Global, gtxn, itxn, OnCompleteAction, Txn, uint64 } from "@algorandfoundation/algorand-typescript";
import { abiCall, compileArc4 } from "@algorandfoundation/algorand-typescript/arc4";
import { classes } from "polytype";
import { RootKey } from "../meta-merkles/types";
import { StakingType } from "../staking/types";
import { GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MAX_PROGRAM_PAGES } from "../utils/constants";
import { ERR_CONTRACT_NOT_SET } from "../utils/errors";
import { getFunder, getStakingFees, referralFee, sendReferralPayment } from "../utils/functions";
import { PoolGlobalStateBytesCount, PoolGlobalStateUintCount } from "./constants";
import { ERR_NOT_CREATOR } from "./errors";

// CONTRACT IMPORTS
import { FactoryContract } from "../utils/base-contracts/factory";
import { BaseStakingPool } from "./base";
import { StakingPool } from "./contract.algo";


export class StakingPoolFactory extends classes(BaseStakingPool, FactoryContract) {
  // GLOBAL STATE ---------------------------------------------------------------------------------
  // BOXES ----------------------------------------------------------------------------------------
  // PRIVATE METHODS ------------------------------------------------------------------------------
  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, childVersion: string, akitaDAO: Application, akitaDAOEscrow: Application): void {
    this.version.value = version
    this.childContractVersion.value = childVersion
    this.akitaDAO.value = akitaDAO
    this.akitaDAOEscrow.value = akitaDAOEscrow
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

    assert(this.boxedContract.exists, ERR_CONTRACT_NOT_SET)

    const pool = compileArc4(StakingPool)

    const childMBR: uint64 = (
      MAX_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * PoolGlobalStateUintCount) +
      (GLOBAL_STATE_KEY_BYTES_COST * PoolGlobalStateBytesCount) +
      Global.minBalance
    )

    const { creationFee } = getStakingFees(this.akitaDAO.value)
    let leftover: uint64 = creationFee
    let referralMbr: uint64 = 0
    if (creationFee > 0) {
      ({ leftover, referralMbr } = sendReferralPayment(this.akitaDAO.value, 0, creationFee))
    }

    const totalMBR: uint64 = (
      creationFee +
      childMBR +
      referralMbr
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

    // Read approval program from box storage and split into chunks
    const approvalSize = this.boxedContract.length
    const chunk1 = this.boxedContract.extract(0, 4096)
    const chunk2 = this.boxedContract.extract(4096, approvalSize - 4096)

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
          this.akitaDAO.value,
          this.akitaDAOEscrow.value
        ],
        approvalProgram: [chunk1, chunk2],
        clearStateProgram: pool.clearStateProgram,
        extraProgramPages: 3
      })
      .itxn
      .createdApp

    pool.call.init({ appId: newPoolApp.id })

    return newPoolApp.id
  }

  deletePool(appId: Application): void {
    assert(appId.creator === Global.currentApplicationAddress, ERR_NOT_CREATOR)

    const { account: receiver, amount } = getFunder(appId)

    abiCall<typeof StakingPool.prototype.delete>({
      appId,
      args: [Txn.sender],
      onCompletion: OnCompleteAction.DeleteApplication
    })

    itxn
      .payment({ receiver, amount })
      .submit()
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------

  @abimethod({ readonly: true })
  newPoolCost(): uint64 {

    const childMBR: uint64 = (
      MAX_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * PoolGlobalStateUintCount) +
      (GLOBAL_STATE_KEY_BYTES_COST * PoolGlobalStateBytesCount) +
      Global.minBalance
    )

    let referralMbr: uint64 = 0
    const { creationFee } = getStakingFees(this.akitaDAO.value)
    if (creationFee > 0) {
      referralMbr = referralFee(this.akitaDAO.value, 0)
    }

    return (
      creationFee +
      childMBR +
      referralMbr
    )
  }
}
