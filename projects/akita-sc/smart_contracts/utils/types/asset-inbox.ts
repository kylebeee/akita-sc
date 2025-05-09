import { Contract, Global, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'

export type arc59GetSendAssetInfoResponse = {
    itxns: uint64
    mbr: uint64
    routerOptedIn: boolean
    receiverOptedIn: boolean
    receiverAlgoNeededForClaim: uint64
}

export class AssetInbox extends Contract {
    arc59_getSendAssetInfo(receiver: Address, asset: uint64): arc59GetSendAssetInfoResponse {
        return {
            itxns: 0,
            mbr: 0,
            routerOptedIn: false,
            receiverOptedIn: false,
            receiverAlgoNeededForClaim: 0,
        }
    }

    arc59_optRouterIn(asa: uint64) {}

    arc59_sendAsset(axfer: gtxn.AssetTransferTxn, receiver: Address, additionalReceiverFunds: uint64): Address {
        return new Address(Global.zeroAddress)
    }
}
