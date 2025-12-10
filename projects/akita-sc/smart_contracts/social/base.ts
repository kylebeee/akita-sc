import { Account, Application, Asset, bytes, Contract, Global, uint64 } from "@algorandfoundation/algorand-typescript";
import { abiCall, methodSelector } from "@algorandfoundation/algorand-typescript/arc4";
import { BoxCostPerByte } from "../utils/constants";
import { getAkitaAssets, getPluginAppList } from "../utils/functions";
import { ActionsMBR, BannedMBR, BlocksMBR, FollowsMBR, MetaMBR, MinPayWallMBR, MinPostsMBR, ModeratorsMBR, PayWallPayOptionSize, ReactionlistMBR, ReactionsMBR, TipSendTypeARC58, TipSendTypeDirect, VotelistMBR, VotesMBR } from "./constants";
import { AkitaSocialMBRData, tipMBRInfo, ViewPayWallValue } from "./types";

// CONTRACT IMPORTS
import type { AbstractedAccount } from "../arc58/account/contract.algo";
import type { OptInPlugin } from "../arc58/plugins/optin/contract.algo";

export class BaseSocial extends Contract {

  mbr(ref: bytes): AkitaSocialMBRData {
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

  payWallMbr(paywall: ViewPayWallValue): uint64 {
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

  checkTipMbrRequirements(akitaDAO: Application, creator: Account, wallet: Application): tipMBRInfo {
    const akta = Asset(getAkitaAssets(akitaDAO).akta)

    if (!creator.isOptedIn(akta) && wallet.id !== 0) {
      const canCallArc58OptIn = this.canCallArc58OptIn(akitaDAO, wallet)
      if (canCallArc58OptIn) {
        return {
          type: TipSendTypeARC58,
          arc58: Global.assetOptInMinBalance
        }
      }
    }

    return {
      type: TipSendTypeDirect,
      arc58: 0
    }
  }
}