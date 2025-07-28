import { Account, Application, Asset, bytes, Contract, Global, uint64 } from "@algorandfoundation/algorand-typescript";
import { AkitaSocialMBRData, tipMBRInfo } from "./types";
import { ActionsMBR, BannedMBR, BlocksMBR, FollowsMBR, MetaMBR, MinPostsMBR, ModeratorsMBR, ReactionlistMBR, ReactionsMBR, TipSendTypeARC58, TipSendTypeARC59, TipSendTypeDirect, VotelistMBR, VotesMBR } from "./constants";
import { abiCall, Address, methodSelector } from "@algorandfoundation/algorand-typescript/arc4";
import { AbstractedAccountInterface } from "../utils/abstract-account";
import { getAkitaAssets, getOtherAppList, getPluginAppList } from "../utils/functions";
import { OptInPluginInterface } from "../utils/types/plugins/optin";
import { AssetInbox } from "../utils/types/asset-inbox";
import { BoxCostPerByte } from "../utils/constants";

export class BaseSocial extends Contract {

  protected mbr(ref: bytes): AkitaSocialMBRData {
    return {
      follows: FollowsMBR,
      blocks: BlocksMBR,
      posts: MinPostsMBR + (BoxCostPerByte * ref.length),
      votes: VotesMBR,
      votelist: VotelistMBR,
      reactions: ReactionsMBR,
      reactionlist: ReactionlistMBR,
      meta: MetaMBR,
      moderators: ModeratorsMBR,
      banned: BannedMBR,
      actions: ActionsMBR
    }
  }

  protected canCallArc58OptIn(akitaDAO: Application, appId: Application): boolean {
    return abiCall(
      AbstractedAccountInterface.prototype.arc58_canCall,
      {
        appId,
        args: [
          getPluginAppList(akitaDAO).optin,
          true,
          new Address(Global.zeroAddress),
          '',
          methodSelector(OptInPluginInterface.prototype.optInToAsset)
        ]
      }
    ).returnValue
  }

  protected checkTipMbrRequirements(akitaDAO: Application, creator: Account, wallet: uint64): tipMBRInfo {
    const akta = Asset(getAkitaAssets(akitaDAO).akta)

    if (creator.isOptedIn(akta)) {
      return {
        type: TipSendTypeDirect,
        arc59: {
          itxns: 0,
          mbr: 0,
          routerOptedIn: false,
          receiverOptedIn: false,
          receiverAlgoNeededForClaim: 0
        },
        arc58: 0
      }
    }

    if (wallet !== 0) {
      const canCallArc58OptIn = this.canCallArc58OptIn(akitaDAO, Application(wallet))
      if (canCallArc58OptIn) {
        return {
          type: TipSendTypeARC58,
          arc59: {
            itxns: 0,
            mbr: 0,
            routerOptedIn: false,
            receiverOptedIn: false,
            receiverAlgoNeededForClaim: 0
          },
          arc58: Global.assetOptInMinBalance
        }
      }
    }

    const assetInbox = getOtherAppList(akitaDAO).assetInbox

    const arc59 = abiCall(
      AssetInbox.prototype.arc59_getSendAssetInfo,
      {
        appId: assetInbox,
        args: [
          new Address(creator),
          akta.id,
        ]
      }
    ).returnValue

    return {
      type: TipSendTypeARC59,
      arc59,
      arc58: 0
    }
  }
}