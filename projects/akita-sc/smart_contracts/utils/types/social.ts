import { bytes, Contract, gtxn, uint64 } from "@algorandfoundation/algorand-typescript";
import { Address } from "@algorandfoundation/algorand-typescript/arc4";
import { CID } from "./base";
import { ImpactMetaValue, MetaValue } from "../../social/types";

// export class AkitaSocialPluginInterface extends Contract {
//   create(version: string, akitaDAO: uint64, escrow: uint64): void { }
//   post(walletID: uint64, rekeyBack: boolean, cid: CID, gateID: uint64): void { }
//   editPost(walletID: uint64, rekeyBack: boolean, cid: CID, gateID: uint64, amendment: bytes<32>): void { }
//   gatedReplyPost(walletID: uint64, rekeyBack: boolean, cid: CID, ref: bytes<32>, gateID: uint64, gateTxn: gtxn.ApplicationCallTxn): void { }
//   replyPost(walletID: uint64, rekeyBack: boolean, cid: CID, ref: bytes<32>, gateID: uint64): void { }
//   replyAsset(walletID: uint64, rekeyBack: boolean, cid: CID, ref: uint64, gateID: uint64): void { }
//   gatedReplyAddress(walletID: uint64, rekeyBack: boolean, cid: CID, ref: Address, gateID: uint64, gateTxn: gtxn.ApplicationCallTxn): void { }
//   replyAddress(walletID: uint64, rekeyBack: boolean, cid: CID, ref: Address, gateID: uint64): void { }
//   replyApp(walletID: uint64, rekeyBack: boolean, cid: CID, ref: uint64, gateID: uint64): void { }
//   gatedEditReply(walletID: uint64, rekeyBack: boolean, cid: CID, gateID: uint64, amendment: bytes<32>, gateTxn: gtxn.ApplicationCallTxn): void { }
//   editReply(walletID: uint64, rekeyBack: boolean, cid: CID, gateID: uint64, amendment: bytes<32>): void { }
//   votePost(walletID: uint64, rekeyBack: boolean, ref: bytes<32>, isUp: boolean): void { }
//   voteAsset(walletID: uint64, rekeyBack: boolean, ref: uint64, isUp: boolean): void { }
//   voteAddress(walletID: uint64, rekeyBack: boolean, ref: Address, isUp: boolean): void { }
//   voteApp(walletID: uint64, rekeyBack: boolean, ref: uint64, isUp: boolean): void { }
//   editVote(walletID: uint64, rekeyBack: boolean, ref: bytes<32>, flip: boolean): void { }
//   gatedReactPost(walletID: uint64, rekeyBack: boolean, ref: bytes<32>, NFT: uint64, gateTxn: gtxn.ApplicationCallTxn): void { }
//   reactPost(walletID: uint64, rekeyBack: boolean, ref: bytes<32>, NFT: uint64): void { }
//   reactAsset(walletID: uint64, rekeyBack: boolean, ref: uint64, NFT: uint64): void { }
//   gatedReactAddress(walletID: uint64, rekeyBack: boolean, ref: Address, NFT: uint64, gateTxn: gtxn.ApplicationCallTxn): void { }
//   reactAddress(walletID: uint64, rekeyBack: boolean, ref: Address, NFT: uint64): void { }
//   reactApp(walletID: uint64, rekeyBack: boolean, ref: uint64, NFT: uint64): void { }
//   deleteReaction(walletID: uint64, rekeyBack: boolean, ref: bytes<32>, NFT: uint64): void { }
//   gatedFollow(walletID: uint64, rekeyBack: boolean, address: Address, gateTxn: gtxn.ApplicationCallTxn): void { }
//   follow(walletID: uint64, rekeyBack: boolean, address: Address): void { }
//   unfollow(walletID: uint64, rekeyBack: boolean, address: Address, index: uint64): void { }
//   block(walletID: uint64, rekeyBack: boolean, address: Address): void { }
//   unblock(walletID: uint64, rekeyBack: boolean, address: Address): void { }
//   addModerator(walletID: uint64, rekeyBack: boolean, address: Address): void { }
//   removeModerator(walletID: uint64, rekeyBack: boolean, address: Address): void { }
//   ban(walletID: uint64, rekeyBack: boolean, address: Address, expiration: uint64): void { }
//   flagPost(walletID: uint64, rekeyBack: boolean, ref: bytes<32>): void { }
//   unban(walletID: uint64, rekeyBack: boolean, address: Address): void { }
//   addAction(walletID: uint64, rekeyBack: boolean, actionAppID: uint64, content: CID) { }
//   removeAction(walletID: uint64, rekeyBack: boolean, actionAppID: uint64) { }
//   initMeta(walletID: uint64, rekeyBack: boolean, automated: boolean, subscriptionIndex: uint64, NFD: uint64, akitaNFT: uint64): uint64 { return 0 }
//   getUserSocialImpact(user: Address): uint64 { return 0 }
//   isFollower(user: Address, index: uint64, follower: Address): boolean { return false }
//   getMeta(user: Address): MetaValue {
//     return {
//       walletID: 0,
//       streak: 0,
//       startDate: 0,
//       lastActive: 0,
//       followerIndex: 0,
//       followerCount: 0,
//       automated: false,
//       followGateID: 0,
//       addressGateID: 0,
//     }
//   }
//   opUp(): void { }
// }

export class AkitaSocialInterface extends Contract {
  create(version: string, akitaDAO: uint64, escrow: uint64): void { }
  post(mbrPayment: gtxn.PaymentTxn, tip: gtxn.AssetTransferTxn, cid: CID, gateID: uint64): void { }
  editPost(mbrPayment: gtxn.PaymentTxn, tip: gtxn.AssetTransferTxn, cid: CID, gateID: uint64, amendment: bytes<32>): void { }
  gatedReplyPost(mbrPayment: gtxn.PaymentTxn, tip: gtxn.AssetTransferTxn, gateTxn: gtxn.ApplicationCallTxn, cid: CID, ref: bytes<32>, gateID: uint64): void { }
  replyPost(mbrPayment: gtxn.PaymentTxn, tip: gtxn.AssetTransferTxn, cid: CID, ref: bytes<32>, gateID: uint64): void { }
  replyAsset(mbrPayment: gtxn.PaymentTxn, tip: gtxn.AssetTransferTxn, cid: CID, ref: uint64, gateID: uint64): void { }
  gatedReplyAddress(mbrPayment: gtxn.PaymentTxn, tip: gtxn.AssetTransferTxn, gateTxn: gtxn.ApplicationCallTxn, cid: CID, ref: Address, gateID: uint64): void { }
  replyAddress(mbrPayment: gtxn.PaymentTxn, tip: gtxn.AssetTransferTxn, cid: CID, ref: Address, gateID: uint64): void { }
  replyApp(mbrPayment: gtxn.PaymentTxn, tip: gtxn.AssetTransferTxn, cid: CID, ref: uint64, gateID: uint64): void { }
  gatedEditReply(mbrPayment: gtxn.PaymentTxn, tip: gtxn.AssetTransferTxn, gateTxn: gtxn.ApplicationCallTxn, cid: CID, gateID: uint64, amendment: bytes<32>): void { }
  editReply(mbrPayment: gtxn.PaymentTxn, tip: gtxn.AssetTransferTxn, cid: CID, gateID: uint64, amendment: bytes<32>): void { }
  votePost(mbrPayment: gtxn.PaymentTxn, tip: gtxn.AssetTransferTxn, ref: bytes<32>, isUp: boolean): void { }
  voteAsset(mbrPayment: gtxn.PaymentTxn, tip: gtxn.AssetTransferTxn, ref: uint64, isUp: boolean): void { }
  voteAddress(mbrPayment: gtxn.PaymentTxn, tip: gtxn.AssetTransferTxn, ref: Address, isUp: boolean): void { }
  voteApp(mbrPayment: gtxn.PaymentTxn, tip: gtxn.AssetTransferTxn, ref: uint64, isUp: boolean): void { }
  editVote(mbrPayment: gtxn.PaymentTxn, tip: gtxn.AssetTransferTxn, ref: bytes<32>, flip: boolean): void { }
  gatedReactPost(mbrPayment: gtxn.PaymentTxn, tip: gtxn.AssetTransferTxn, gateTxn: gtxn.ApplicationCallTxn, ref: bytes<32>, NFT: uint64): void { }
  reactPost(mbrPayment: gtxn.PaymentTxn, tip: gtxn.AssetTransferTxn, ref: bytes<32>, NFT: uint64): void { }
  reactAsset(mbrPayment: gtxn.PaymentTxn, tip: gtxn.AssetTransferTxn, ref: uint64, NFT: uint64): void { }
  gatedReactAddress(mbrPayment: gtxn.PaymentTxn, tip: gtxn.AssetTransferTxn, gateTxn: gtxn.ApplicationCallTxn, ref: Address, NFT: uint64): void { }
  reactAddress(mbrPayment: gtxn.PaymentTxn, tip: gtxn.AssetTransferTxn, ref: Address, NFT: uint64): void { }
  reactApp(mbrPayment: gtxn.PaymentTxn, tip: gtxn.AssetTransferTxn, ref: uint64, NFT: uint64): void { }
  deleteReaction(ref: bytes<32>, NFT: uint64): void { }
  gatedFollow(mbrPayment: gtxn.PaymentTxn, gateTxn: gtxn.ApplicationCallTxn, address: Address): void { }
  follow(mbrPayment: gtxn.PaymentTxn, address: Address): void { }
  unfollow(address: Address, index: uint64): void { }
  block(mbrPayment: gtxn.PaymentTxn, address: Address): void { }
  unblock(address: Address): void { }
  addModerator(mbrPayment: gtxn.PaymentTxn, address: Address): void { }
  removeModerator(address: Address): void { }
  ban(mbrPayment: gtxn.PaymentTxn, address: Address, expiration: uint64): void { }
  flagPost(ref: bytes<32>): void { }
  unban(address: Address): void { }
  addAction(mbrPayment: gtxn.PaymentTxn, actionAppID: uint64, content: CID) { }
  removeAction(actionAppID: uint64) { }
  initMeta(mbrPayment: gtxn.PaymentTxn, user: Address, automated: boolean, subscriptionIndex: uint64, NFD: uint64, akitaNFT: uint64): uint64 { return 0 }
  getUserSocialImpact(user: Address): uint64 { return 0 }
  isFollower(user: Address, index: uint64, follower: Address): boolean { return false }
  getMeta(user: Address): MetaValue {
    return {
      initialized: false,
      wallet: 0,
      streak: 0,
      startDate: 0,
      lastActive: 0,
      followerIndex: 0,
      followerCount: 0,
      automated: false,
      followGateID: 0,
      addressGateID: 0,
    }
  }
  opUp(): void { }
}

export class AkitaSocialImpactInterface extends Contract {
  create(akitaDAO: uint64, version: string): void { }
  update(newVersion: string): void { }
  updateAkitaDAO(app: uint64): void { }
  cacheMeta(address: Address, subscriptionIndex: uint64, NFDAppID: uint64, akitaAssetID: uint64): uint64 { return 0 }
  updateSubscriptionStateModifier(payment: gtxn.PaymentTxn, subscriptionIndex: uint64, newModifier: uint64): void {}
  getUserImpactWithoutSocial(address: Address): uint64 { return 0 }
  getUserImpact(address: Address): uint64 { return 0 }
  getMeta(user: Address): ImpactMetaValue {
    return {
      subscriptionIndex: 0,
      NFD: 0,
      nfdTimeChanged: 0,
      nfdImpact: 0,
      akitaNFT: 0,
    }
  }
}