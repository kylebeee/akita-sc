import { arc4, assert, BoxMap, bytes, Global, GlobalState, itxn, uint64 } from "@algorandfoundation/algorand-typescript";
import { AkitaBaseContract } from "../../../../utils/base_contracts/base.algo";
import { GateGlobalStateKeyRegistryCursor } from "../../constants";
import { arc4StakingAmountGateCheckParams, arc4StakingPowerRegistryInfo } from "./types";
import { decodeArc4, interpretAsArc4, methodSelector } from "@algorandfoundation/algorand-typescript/arc4";
import { Staking } from "../../../staking/staking.algo";
import { arc4StakeInfo, arc4STAKING_TYPE_LOCK, StakeValue } from "../../../staking/types";
import { Equal, GreaterThan, GreaterThanOrEqualTo, LessThan, LessThanOrEqualTo, NotEqual } from "../../../../utils/operators";
import { ERR_BAD_OPERATION, ERR_INVALID_ARG_COUNT } from "./errors";
import { ONE_DAY, ONE_YEAR_IN_DAYS } from "./constants";

export class StakingPowerGate extends AkitaBaseContract {

  registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

  registry = BoxMap<uint64, arc4StakingPowerRegistryInfo>({ keyPrefix: '' });

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  private stakingPowerGate(user: arc4.Address, op: uint64, asset: uint64, power: uint64): boolean {

    // TODO: replace with itxn.abiCall when available
    const infoTxn = itxn
      .applicationCall({
        appId: super.getAppList().staking,
        appArgs: [
          methodSelector(Staking.prototype.getInfo),
          user,
          new arc4StakeInfo({
            asset: new arc4.UintN64(asset),
            type: arc4STAKING_TYPE_LOCK,
          }),
        ],
      })
      .submit()

    const info = decodeArc4<StakeValue>(infoTxn.lastLog)

    const remainingDays = (info.expiration - Global.latestTimestamp) / ONE_DAY
    const userPower = (info.amount / ONE_YEAR_IN_DAYS) * remainingDays

    if (op === Equal) {
      return userPower === power
    } else if (op === NotEqual) {
      return userPower !== power
    } else if (op === LessThan) {
      return userPower < power
    } else if (op === LessThanOrEqualTo) {
      return userPower <= power
    } else if (op === GreaterThan) {
      return userPower > power
    } else if (op === GreaterThanOrEqualTo) {
      return userPower >= power
    }

    return false
  }

  register(args: bytes): uint64 {
    assert(args.length === arc4StakingPowerRegistryInfo.length, ERR_INVALID_ARG_COUNT)
    const params = interpretAsArc4<arc4StakingPowerRegistryInfo>(args)
    
    assert(params.op.native <= 6, ERR_BAD_OPERATION)
    const id = this.newRegistryID()
    this.registry(id).value = params
    return id
  }

  check(args: bytes): boolean {
    assert(args.length >= arc4StakingAmountGateCheckParams.length, ERR_INVALID_ARG_COUNT)
    const params = interpretAsArc4<arc4StakingAmountGateCheckParams>(args)
    const info = this.registry(params.registryID.native).value
    return this.stakingPowerGate(params.user, info.op.native, info.asset.native, info.power.native);
  }
}