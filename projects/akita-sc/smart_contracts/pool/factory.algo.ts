import { classes } from "polytype";
import { ServiceFactoryContract } from "../utils/base-contracts/factory";
import { BasePool } from "./base";
import { abimethod, Application, assert, assertMatch, Global, gtxn, itxn, Txn, uint64 } from "@algorandfoundation/algorand-typescript";
import { StakingType } from "../staking/types";
import { abiCall, Address, compileArc4 } from "@algorandfoundation/algorand-typescript/arc4";
import { RootKey } from "../meta-merkles/types";
import { Pool } from "./contract.algo";
import { fmbr, getStakingFees } from "../utils/functions";
import { GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MAX_PROGRAM_PAGES } from "../utils/constants";
import { ERR_NOT_CREATOR } from "./errors";
import { PoolFactoryInterface } from "../utils/types/pool";

export class PoolFactory extends classes(
  BasePool,
  ServiceFactoryContract
) implements PoolFactoryInterface {
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
    marketplace: Address,
    stakeKey: RootKey,
    minimumStakeAmount: uint64,
    gateID: uint64,
    maxEntries: uint64,
  ): uint64 {

    const fcosts = fmbr()
    const { creationFee } = getStakingFees(this.akitaDAO.value)

    const pool = compileArc4(Pool)

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: (
          creationFee +
          MAX_PROGRAM_PAGES +
          (GLOBAL_STATE_KEY_UINT_COST * pool.globalUints) +
          (GLOBAL_STATE_KEY_BYTES_COST * pool.globalBytes) +
          Global.minBalance +
          fcosts.appCreators
        ),
      }
    )

    itxn
      .payment({
        receiver: this.akitaDAOEscrow.value.address,
        amount: creationFee,
      })
      .submit()

    const newPoolApp = pool.call
      .create({
        args: [
          title,
          type,
          new Address(Txn.sender),
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

    return newPoolApp.id
  }

  deletePool(poolID: uint64): void {
    assert(Application(poolID).creator === Global.currentApplicationAddress, ERR_NOT_CREATOR)

    abiCall(
      Pool.prototype.delete,
      {
        appId: Application(poolID),
        args: [ new Address(Txn.sender) ],
      }
    )
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------
}
