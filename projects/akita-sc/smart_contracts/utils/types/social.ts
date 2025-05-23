import { bytes, Contract, gtxn, uint64 } from "@algorandfoundation/algorand-typescript";
import { Address } from "@algorandfoundation/algorand-typescript/arc4";
import { CID } from "./base";
import { GateArgs } from "./gates";
import { MetaValue } from "../../arc58/plugins/social/types";

export class AkitaSocialPluginInterface extends Contract {
  create(version: string, akitaDAO: uint64, escrow: uint64): void { }
  post(walletID: uint64, rekeyBack: boolean, cid: CID, gateID: uint64): void { }
  editPost(walletID: uint64, rekeyBack: boolean, cid: CID, gateID: uint64, amendment: bytes<32>): void { }
  replyPost(walletID: uint64, rekeyBack: boolean, cid: CID, ref: bytes<32>, gateID: uint64, args: GateArgs): void { }
  replyAsset(walletID: uint64, rekeyBack: boolean, cid: CID, ref: uint64, gateID: uint64): void { }
  replyAddress(walletID: uint64, rekeyBack: boolean, cid: CID, ref: Address, gateID: uint64, args: GateArgs): void { }
  replyApp(walletID: uint64, rekeyBack: boolean, cid: CID, ref: uint64, gateID: uint64): void { }
  editReply(walletID: uint64, rekeyBack: boolean, cid: CID, gateID: uint64, args: GateArgs, amendment: bytes<32>): void { }
  votePost(walletID: uint64, rekeyBack: boolean, ref: bytes<32>, isUp: boolean): void { }
  voteAsset(walletID: uint64, rekeyBack: boolean, ref: uint64, isUp: boolean): void { }
  voteAddress(walletID: uint64, rekeyBack: boolean, ref: Address, isUp: boolean): void { }
  voteApp(walletID: uint64, rekeyBack: boolean, ref: uint64, isUp: boolean): void { }
  editVote(walletID: uint64, rekeyBack: boolean, ref: bytes<32>, flip: boolean): void { }
  reactPost(walletID: uint64, rekeyBack: boolean, ref: bytes<32>, NFT: uint64, args: GateArgs): void { }
  reactAsset(walletID: uint64, rekeyBack: boolean, ref: uint64, NFT: uint64): void { }
  reactAddress(walletID: uint64, rekeyBack: boolean, ref: Address, NFT: uint64, args: GateArgs): void { }
  reactApp(walletID: uint64, rekeyBack: boolean, ref: uint64, NFT: uint64): void { }
  deleteReaction(walletID: uint64, rekeyBack: boolean, ref: bytes<32>, NFT: uint64): void { }
  follow(walletID: uint64, rekeyBack: boolean, address: Address, args: GateArgs): void { }
  unfollow(walletID: uint64, rekeyBack: boolean, address: Address, index: uint64): void { }
  block(walletID: uint64, rekeyBack: boolean, address: Address): void { }
  unblock(walletID: uint64, rekeyBack: boolean, address: Address): void { }
  addModerator(walletID: uint64, rekeyBack: boolean, address: Address): void { }
  removeModerator(walletID: uint64, rekeyBack: boolean, address: Address): void { }
  ban(walletID: uint64, rekeyBack: boolean, address: Address, expiration: uint64): void { }
  flagPost(walletID: uint64, rekeyBack: boolean, ref: bytes<32>): void { }
  unban(walletID: uint64, rekeyBack: boolean, address: Address): void { }
  addAction(walletID: uint64, rekeyBack: boolean, actionAppID: uint64, content: CID) { }
  removeAction(walletID: uint64, rekeyBack: boolean, actionAppID: uint64) { }
  initMeta(walletID: uint64, rekeyBack: boolean, automated: boolean, subscriptionIndex: uint64, NFD: uint64, akitaNFT: uint64): uint64 { return 0 }
  getUserSocialImpact(user: Address): uint64 { return 0 }
  isFollower(user: Address, index: uint64, follower: Address): boolean { return false }
  getMeta(user: Address): MetaValue {
    return {
      walletID: 0,
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
  gas(): void { }
}

export class AkitaSocialImpactInterface extends Contract {
  create(akitaDAO: uint64, version: string): void { }
  update(newVersion: string): void { }
  updateAkitaDAO(app: uint64): void { }
  cacheMeta(subscriptionIndex: uint64, NFDAppID: uint64, akitaAssetID: uint64): uint64 { return 0 }
  updateSubscriptionStateModifier(payment: gtxn.PaymentTxn, subscriptionIndex: uint64, newModifier: uint64): void {}
  getUserImpactWithoutSocial(address: Address): uint64 { return 0 }
  getUserImpact(address: Address): uint64 { return 0 }
  getMeta(user: Address): MetaValue {
    return {
      walletID: 0,
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
}