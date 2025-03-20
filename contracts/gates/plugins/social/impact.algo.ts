import { arc4, assert, BoxMap, bytes, GlobalState, itxn, uint64 } from "@algorandfoundation/algorand-typescript";
import { AkitaBaseContract } from "../../../../utils/base_contracts/base.algo";
import { arc4ImpactGateCheckParams, arc4ImpactRegistryInfo } from "./types";
import { GateGlobalStateKeyRegistryCursor } from "../../constants";
import { Operator } from "../../types";
import { Address, decodeArc4, interpretAsArc4, methodSelector } from "@algorandfoundation/algorand-typescript/arc4";
import { AkitaSocialImpact } from "../../../arc58/plugins/social/impact.algo";
import { Equal, GreaterThan, GreaterThanOrEqualTo, LessThan, LessThanOrEqualTo, NotEqual } from "../../../../utils/operators";
import { ERR_INVALID_ARG_COUNT } from "../../errors";

export class ImpactGate extends AkitaBaseContract {

    registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

    registry = BoxMap<uint64, arc4ImpactRegistryInfo>({ keyPrefix: '' })

    private newRegistryID(): uint64 {
        const id = this.registryCursor.value
        this.registryCursor.value += 1
        return id
    }

    private impactGate(user: Address, op: Operator, value: uint64): boolean {

        // TODO: replace with itxn.abiCall when available
        const impactTxn = itxn
            .applicationCall({
                appId: super.getAppList().impact,
                appArgs: [
                    methodSelector(AkitaSocialImpact.prototype.getUserImpact),
                    user
                ]
            })
            .submit()

        const impact = decodeArc4<uint64>(impactTxn.lastLog)

        if (op === Equal) {
            return impact === value
        } else if (op === NotEqual) {
            return impact !== value
        } else if (op === LessThan) {
            return impact < value
        } else if (op === LessThanOrEqualTo) {
            return impact <= value
        } else if (op === GreaterThan) {
            return impact > value
        } else if (op === GreaterThanOrEqualTo) {
            return impact >= value
        }

        return false
    }

    register(args: bytes): uint64 {
        assert(args.length === arc4ImpactRegistryInfo.length, ERR_INVALID_ARG_COUNT)
        const params = interpretAsArc4<arc4ImpactRegistryInfo>(args)
        const id = this.newRegistryID()
        this.registry(id).value = params
        return id
    }

    check(args: bytes): boolean {
        assert(args.length === arc4ImpactGateCheckParams.length, ERR_INVALID_ARG_COUNT);
        const params = interpretAsArc4<arc4ImpactGateCheckParams>(args);
        const info = this.registry(params.registryID.native).value;
        return this.impactGate(params.user, info.op.native, info.value.native);
    }
}