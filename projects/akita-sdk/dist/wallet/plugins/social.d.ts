import { BaseSDK } from "../../base";
import { AkitaSocialPluginArgs, AkitaSocialPluginClient } from "../../generated/AkitaSocialPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginSDKReturn } from "../../types";
type ContractArgs = AkitaSocialPluginArgs["obj"];
type PostArgs = (Omit<ContractArgs['post(uint64,bool,uint64,byte[24],byte[36],uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type EditPostArgs = (Omit<ContractArgs['editPost(uint64,bool,byte[36],byte[32])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type ReplyArgs = (Omit<ContractArgs['reply(uint64,bool,uint64,byte[24],byte[36],byte[],uint8,uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type GatedReplyArgs = (Omit<ContractArgs['gatedReply(uint64,bool,uint64,byte[24],byte[36],byte[],uint8,uint64,byte[][],bool,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type EditReplyArgs = (Omit<ContractArgs['editReply(uint64,bool,byte[36],byte[32])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type GatedEditReplyArgs = (Omit<ContractArgs['gatedEditReply(uint64,bool,byte[36],byte[32],byte[][])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type VoteArgs = (Omit<ContractArgs['vote(uint64,bool,byte[],uint8,bool)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type EditVoteArgs = (Omit<ContractArgs['editVote(uint64,bool,byte[32],bool)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type ReactArgs = (Omit<ContractArgs['react(uint64,bool,byte[],uint8,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type GatedReactArgs = (Omit<ContractArgs['gatedReact(uint64,bool,byte[],uint8,uint64,byte[][])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type DeleteReactionArgs = (Omit<ContractArgs['deleteReaction(uint64,bool,byte[32],uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type FollowArgs = (Omit<ContractArgs['follow(uint64,bool,address)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type GatedFollowArgs = (Omit<ContractArgs['gatedFollow(uint64,bool,address,byte[][])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type UnfollowArgs = (Omit<ContractArgs['unfollow(uint64,bool,address)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type BlockArgs = (Omit<ContractArgs['block(uint64,bool,address)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type UnblockArgs = (Omit<ContractArgs['unblock(uint64,bool,address)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type AddModeratorArgs = (Omit<ContractArgs['addModerator(uint64,bool,address)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type RemoveModeratorArgs = (Omit<ContractArgs['removeModerator(uint64,bool,address)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type BanArgs = (Omit<ContractArgs['ban(uint64,bool,address,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type UnbanArgs = (Omit<ContractArgs['unban(uint64,bool,address)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type FlagPostArgs = (Omit<ContractArgs['flagPost(uint64,bool,byte[32])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type UnflagPostArgs = (Omit<ContractArgs['unflagPost(uint64,bool,byte[32])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type AddActionArgs = (Omit<ContractArgs['addAction(uint64,bool,uint64,byte[36])void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type RemoveActionArgs = (Omit<ContractArgs['removeAction(uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type InitMetaArgs = (Omit<ContractArgs['initMeta(uint64,bool,address,bool,uint64,uint64,uint64)uint64'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
type UpdateMetaArgs = (Omit<ContractArgs['updateMeta(uint64,bool,uint64,uint64,uint64,uint64,uint64,uint64)void'], 'wallet' | 'rekeyBack'> & MaybeSigner & {
    rekeyBack?: boolean;
});
export declare class SocialPluginSDK extends BaseSDK<AkitaSocialPluginClient> {
    constructor(params: NewContractSDKParams);
    post(): PluginSDKReturn;
    post(args: PostArgs): PluginSDKReturn;
    editPost(): PluginSDKReturn;
    editPost(args: EditPostArgs): PluginSDKReturn;
    reply(): PluginSDKReturn;
    reply(args: ReplyArgs): PluginSDKReturn;
    gatedReply(): PluginSDKReturn;
    gatedReply(args: GatedReplyArgs): PluginSDKReturn;
    editReply(): PluginSDKReturn;
    editReply(args: EditReplyArgs): PluginSDKReturn;
    gatedEditReply(): PluginSDKReturn;
    gatedEditReply(args: GatedEditReplyArgs): PluginSDKReturn;
    vote(): PluginSDKReturn;
    vote(args: VoteArgs): PluginSDKReturn;
    editVote(): PluginSDKReturn;
    editVote(args: EditVoteArgs): PluginSDKReturn;
    react(): PluginSDKReturn;
    react(args: ReactArgs): PluginSDKReturn;
    gatedReact(): PluginSDKReturn;
    gatedReact(args: GatedReactArgs): PluginSDKReturn;
    deleteReaction(): PluginSDKReturn;
    deleteReaction(args: DeleteReactionArgs): PluginSDKReturn;
    follow(): PluginSDKReturn;
    follow(args: FollowArgs): PluginSDKReturn;
    gatedFollow(): PluginSDKReturn;
    gatedFollow(args: GatedFollowArgs): PluginSDKReturn;
    unfollow(): PluginSDKReturn;
    unfollow(args: UnfollowArgs): PluginSDKReturn;
    block(): PluginSDKReturn;
    block(args: BlockArgs): PluginSDKReturn;
    unblock(): PluginSDKReturn;
    unblock(args: UnblockArgs): PluginSDKReturn;
    addModerator(): PluginSDKReturn;
    addModerator(args: AddModeratorArgs): PluginSDKReturn;
    removeModerator(): PluginSDKReturn;
    removeModerator(args: RemoveModeratorArgs): PluginSDKReturn;
    ban(): PluginSDKReturn;
    ban(args: BanArgs): PluginSDKReturn;
    unban(): PluginSDKReturn;
    unban(args: UnbanArgs): PluginSDKReturn;
    flagPost(): PluginSDKReturn;
    flagPost(args: FlagPostArgs): PluginSDKReturn;
    unflagPost(): PluginSDKReturn;
    unflagPost(args: UnflagPostArgs): PluginSDKReturn;
    addAction(): PluginSDKReturn;
    addAction(args: AddActionArgs): PluginSDKReturn;
    removeAction(): PluginSDKReturn;
    removeAction(args: RemoveActionArgs): PluginSDKReturn;
    initMeta(): PluginSDKReturn;
    initMeta(args: InitMetaArgs): PluginSDKReturn;
    updateMeta(): PluginSDKReturn;
    updateMeta(args: UpdateMetaArgs): PluginSDKReturn;
}
export {};
