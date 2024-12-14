import { Contract } from "@algorandfoundation/tealscript";

export interface arc59GetSendAssetInfoResponse {
    itxns: uint64;
    mbr: uint64;
    routerOptedIn: boolean;
    receiverOptedIn: boolean;
    receiverAlgoNeededForClaim: uint64;
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

    arc59_sendAsset(axfer: AssetTransferTxn, receiver: Address, additionalReceiverFunds: uint64): Address {
        return globals.zeroAddress
    }
}

