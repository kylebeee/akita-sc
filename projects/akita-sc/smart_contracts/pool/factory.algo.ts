import { classes } from "polytype";
import { ServiceFactoryContract } from "../utils/base-contracts/factory";
import { BasePool } from "./base";
import { ContractWithOptIn } from "../utils/base-contracts/optin";
import { abimethod, Application, assertMatch, Global, gtxn, itxn, Txn, uint64 } from "@algorandfoundation/algorand-typescript";
import { StakingType } from "../staking/types";
import { Address, compileArc4 } from "@algorandfoundation/algorand-typescript/arc4";
import { arc4Reward } from "./types";
import { arc4RootKey } from "../meta-merkles/types";
import { Pool } from "./contract.algo";
import { fmbr, getStakingFees } from "../utils/functions";
import { AccountMinimumBalance, GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MAX_PROGRAM_PAGES } from "../utils/constants";
import { fee } from "../utils/constants";

export class PoolFactory extends classes(
  BasePool,
  ServiceFactoryContract,
  ContractWithOptIn
) {
  // GLOBAL STATE ---------------------------------------------------------------------------------
  // BOXES ----------------------------------------------------------------------------------------
  // PRIVATE METHODS ------------------------------------------------------------------------------
  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, childVersion: string, akitaDAO: uint64, escrow: uint64): void {
    this.version.value = version
    this.childContractVersion.value = childVersion
    this.akitaDAO.value = Application(akitaDAO)
    this.akitaDAOEscrow.value = Application(escrow)
  }

  // POOL FACTORY METHODS -------------------------------------------------------------------------

  newPool(
    payment: gtxn.PaymentTxn,
    title: string,
    type: StakingType,
    reward: arc4Reward,
    marketplace: Address,
    stakeKey: arc4RootKey,
    minimumStakeAmount: uint64,
    gateID: uint64,
    maxEntries: uint64,
  ): uint64 {

    const isAlgoPayment = reward.asset.native === 0
    const optinMBR: uint64 = isAlgoPayment
      ? Global.assetOptInMinBalance
      : Global.assetOptInMinBalance * 2

    const fcosts = fmbr()
    const childAppMBR: uint64 = AccountMinimumBalance + optinMBR
    const fees = getStakingFees(this.akitaDAO.value)

    const pool = compileArc4(Pool)

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: (
          fees.creationFee +
          MAX_PROGRAM_PAGES +
          (GLOBAL_STATE_KEY_UINT_COST * pool.globalUints) +
          (GLOBAL_STATE_KEY_BYTES_COST * pool.globalBytes) +
          childAppMBR +
          fcosts.appCreators
        ),
      }
    )

    itxn
      .payment({
        receiver: this.akitaDAOEscrow.value.address,
        amount: fees.creationFee,
        fee,
      })
      .submit()

    const newPoolApp = pool.call
      .create({
        args: [
          title,
          type,
          reward,
          new Address(Txn.sender),
          marketplace,
          stakeKey,
          minimumStakeAmount,
          gateID,
          maxEntries,
          this.akitaDAO.value.id,
        ],
        fee,
      })
      .itxn
      .createdApp

    return newPoolApp.id
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------
}
