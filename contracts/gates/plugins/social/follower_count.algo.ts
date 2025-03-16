import { arc4, assert, BoxMap, bytes, GlobalState, itxn, uint64 } from "@algorandfoundation/algorand-typescript";
import { AkitaBaseContract } from "../../../../utils/base_contracts/base.algo";
import { arc4FollowerCountGateCheckParams, arc4FollowerCountRegistryInfo } from "./types";
import { GateGlobalStateKeyRegistryCursor } from "../../constants";
import { Operator } from "../../types";
import { decodeArc4, interpretAsArc4, methodSelector } from "@algorandfoundation/algorand-typescript/arc4";
import { AkitaSocialPlugin, MetaValue } from "../../../arc58/plugins/social/social.algo";
import { Equal, GreaterThan, GreaterThanOrEqualTo, LessThan, LessThanOrEqualTo, NotEqual } from "../../../../utils/operators";
import { ERR_INVALID_ARG_COUNT } from "../../errors";

export class FollowerCountGate extends AkitaBaseContract {

    registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

    registry = BoxMap<uint64, arc4FollowerCountRegistryInfo>({ keyPrefix: '' })

    private newRegistryID(): uint64 {
        const id = this.registryCursor.value
        this.registryCursor.value += 1
        return id
    }

    private followerCountGate(user: arc4.Address, op: Operator, value: uint64): boolean {

        // TODO: replace with itxn.abiCall when available
        const getMetaTxn = itxn
            .applicationCall({
                appId: super.getAppList().social,
                appArgs: [
                    methodSelector(AkitaSocialPlugin.prototype.getMeta),
                    user
                ]
            })
            .submit()

        const meta = decodeArc4<MetaValue>(getMetaTxn.lastLog)

        if (op === Equal) {
            return meta.followerCount === value;
        } else if (op === NotEqual) {
            return meta.followerCount !== value;
        } else if (op === LessThan) {
            return meta.followerCount < value;
        } else if (op === LessThanOrEqualTo) {
            return meta.followerCount <= value;
        } else if (op === GreaterThan) {
            return meta.followerCount > value;
        } else if (op === GreaterThanOrEqualTo) {
            return meta.followerCount >= value;
        }

        return false;
    }

    register(args: bytes): uint64 {
        assert(args.length === arc4FollowerCountRegistryInfo.length, ERR_INVALID_ARG_COUNT)
        const params = interpretAsArc4<arc4FollowerCountRegistryInfo>(args)
        const id = this.newRegistryID()
        this.registry(id).value = params
        return id
    }

    check(args: bytes): boolean {
        assert(args.length === arc4FollowerCountGateCheckParams.length, ERR_INVALID_ARG_COUNT);
        const params = interpretAsArc4<arc4FollowerCountGateCheckParams>(args);
        const info = this.registry(params.registryID.native).value;
        return this.followerCountGate(params.user, info.op.native, info.value.native);
    }
}