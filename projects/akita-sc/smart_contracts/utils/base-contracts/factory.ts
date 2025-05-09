import {
    Account,
    Application,
    arc4,
    assert,
    BoxMap,
    Bytes,
    GlobalState,
    op,
    uint64,
} from '@algorandfoundation/algorand-typescript'
import { Address, decodeArc4, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from './base'
import { PrizeBoxGlobalStateKeyOwner } from '../../prize-box/constants'
import { ERR_NOT_A_PRIZE_BOX } from '../errors'

export const BaseFactoryGlobalStateKeyChildContractVersion = 'child_contract_version'
export const BaseFactoryBoxPrefixAppCreators = 'c'

export type AppCreatorValue = {
    creatorAddress: Address
    amount: uint64
}

export class arc4AppCreatorValue extends arc4.Struct<{
    creatorAddress: Address
    amount: UintN64
}> {}

export type ServiceFactoryContractMBRData = {
    appCreators: uint64
}

export class FactoryContract extends AkitaBaseContract {
    /** the version of the child contract */
    childContractVersion = GlobalState<string>({ key: BaseFactoryGlobalStateKeyChildContractVersion })
}

export class ServiceFactoryContract extends FactoryContract {
    appCreators = BoxMap<uint64, arc4AppCreatorValue>({ keyPrefix: BaseFactoryBoxPrefixAppCreators })

    protected getAppCreator(appID: uint64): AppCreatorValue {
        return decodeArc4<AppCreatorValue>(this.appCreators(appID).value.bytes)
    }

    protected fmbr(): ServiceFactoryContractMBRData {
        return {
            appCreators: 21_700
        }
    }

    protected getPrizeBoxOwner(prizeBox: Application): Account {
        assert(prizeBox.creator === Application(super.getAkitaAppList().prizeBox).address, ERR_NOT_A_PRIZE_BOX)
        const [ownerBytes] = op.AppGlobal.getExBytes(prizeBox, Bytes(PrizeBoxGlobalStateKeyOwner))
        return new Address(ownerBytes).native
    }
}
