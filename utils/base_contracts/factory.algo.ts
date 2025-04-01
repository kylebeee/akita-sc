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
import { Address, decodeArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from './base.algo'
import { PrizeBoxGlobalStateKeyOwner } from '../../contracts/prize_box/constants'
import { ERR_NOT_A_PRIZE_BOX } from '../errors'

export const BaseFactoryGlobalStateKeyChildContractVersion = 'child_contract_version'

export type AppCreatorKey = {
    address: Address
    appID: uint64
}

export class arc4AppCreatorKey extends arc4.Struct<{
    address: Address
    appID: arc4.UintN64
}> {}

export type ServiceFactoryContractMBRData = {
    appCreators: uint64
}

export class FactoryContract extends AkitaBaseContract {
    /** the version of the child contract */
    childContractVersion = GlobalState<string>({ key: BaseFactoryGlobalStateKeyChildContractVersion })
}

export class ServiceFactoryContract extends FactoryContract {
    appCreators = BoxMap<arc4AppCreatorKey, uint64>({ keyPrefix: '' })

    protected fmbr(): ServiceFactoryContractMBRData {
        return {
            appCreators: 21_700
        }
    }

    protected getPrizeBoxOwner(prizeBox: Application): Account {
        assert(prizeBox.creator === Application(super.getAppList().prizeBox).address, ERR_NOT_A_PRIZE_BOX)
        const [ownerBytes] = op.AppGlobal.getExBytes(prizeBox, Bytes(PrizeBoxGlobalStateKeyOwner))
        return new Address(ownerBytes).native
    }
}
