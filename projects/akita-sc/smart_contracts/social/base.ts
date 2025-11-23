import { Account, Application, Asset, bytes, Contract, Global, uint64 } from "@algorandfoundation/algorand-typescript";
import { abiCall, methodSelector } from "@algorandfoundation/algorand-typescript/arc4";
import { BoxCostPerByte } from "../utils/constants";
import { getAkitaAssets, getOtherAppList, getPluginAppList } from "../utils/functions";
import { ActionsMBR, BannedMBR, BlocksMBR, FollowsMBR, MetaMBR, MinPayWallMBR, MinPostsMBR, ModeratorsMBR, PayWallPayOptionSize, ReactionlistMBR, ReactionsMBR, TipSendTypeARC58, TipSendTypeARC59, TipSendTypeDirect, VotelistMBR, VotesMBR } from "./constants";
import { AkitaSocialMBRData, tipMBRInfo, ViewPayWallValue } from "./types";

// CONTRACT IMPORTS
import type { AbstractedAccount } from "../arc58/account/contract.algo";
import type { OptInPlugin } from "../arc58/plugins/optin/contract.algo";
import type { AssetInbox } from "../utils/types/asset-inbox";

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

  protected payWallMbr(paywall: ViewPayWallValue): uint64 {
    return MinPayWallMBR + (
      BoxCostPerByte * (
        PayWallPayOptionSize * (paywall.agentPayInfo.length + paywall.userPayInfo.length)
      )
    )
  }

  protected canCallArc58OptIn(akitaDAO: Application, appId: Application): boolean {
    return abiCall<typeof AbstractedAccount.prototype.arc58_canCall>({
      appId,
      args: [
        getPluginAppList(akitaDAO).optin,
        true,
        Global.zeroAddress,
        '',
        methodSelector<typeof OptInPlugin.prototype.optIn>()
      ]
    }).returnValue
  }

  protected checkTipMbrRequirements(akitaDAO: Application, creator: Account, wallet: Application): tipMBRInfo {
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

    if (wallet.id !== 0) {
      const canCallArc58OptIn = this.canCallArc58OptIn(akitaDAO, wallet)
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

    const arc59 = abiCall<typeof AssetInbox.prototype.arc59_getSendAssetInfo>({
      appId: assetInbox,
      args: [
        creator,
        akta.id,
      ]
    }).returnValue

    return {
      type: TipSendTypeARC59,
      arc59,
      arc58: 0
    }
  }
}