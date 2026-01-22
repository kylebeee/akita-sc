import { AlgorandClient } from "@algorandfoundation/algokit-utils/types/algorand-client";
import { AkitaNetwork } from "../config";
import { OptionalAppIdFactoryParams } from "../types";
import { SocialFees, AkitaAssets } from '../generated/AkitaDAOClient';
import { AkitaSocialClient, AkitaSocialMbrData, MetaValue, PostValue, TipMbrInfo, VoteListValue } from '../generated/AkitaSocialClient';
import { AkitaSocialGraphClient } from '../generated/AkitaSocialGraphClient';
import { AkitaSocialImpactClient, MetaValue as ImpactMetaValue } from '../generated/AkitaSocialImpactClient';
import { AkitaSocialModerationClient } from '../generated/AkitaSocialModerationClient';
import { ExpandedSendParams, GroupReturn, MaybeSigner } from "../types";
import { BlockArgs, CreatePayWallArgs, DeleteVoteArgs, EditPostArgs, FollowArgs, InvertVoteArgs, InitMetaArgs, PostArgs, PostRef, ReactArgs, RefType, ReplyArgs, UnfollowArgs, UpdateMetaArgs, VoteArgs } from "./types";
export type { SocialFees, AkitaAssets };
export * from './types';
export * from './constants';
export type SocialSDKConstructorParams = {
    algorand: AlgorandClient;
    /** The Akita DAO app ID for fetching social fees and AKTA asset ID (optional for standalone tests) */
    daoAppId?: bigint;
    /** Factory params with optional appId - will resolve from environment if not provided */
    socialFactoryParams?: OptionalAppIdFactoryParams;
    graphFactoryParams?: OptionalAppIdFactoryParams;
    impactFactoryParams?: OptionalAppIdFactoryParams;
    moderationFactoryParams?: OptionalAppIdFactoryParams;
    readerAccount?: string;
    sendParams?: ExpandedSendParams;
    ipfsUrl?: string;
};
export declare class SocialSDK {
    socialClient: AkitaSocialClient;
    graphClient: AkitaSocialGraphClient;
    impactClient: AkitaSocialImpactClient;
    moderationClient: AkitaSocialModerationClient;
    private daoClient;
    socialAppId: bigint;
    graphAppId: bigint;
    impactAppId: bigint;
    moderationAppId: bigint;
    daoAppId: bigint | undefined;
    algorand: AlgorandClient;
    readerAccount: string;
    sendParams: ExpandedSendParams;
    ipfsUrl: string;
    /** The detected network for this SDK instance */
    network: AkitaNetwork;
    private _socialFees;
    private _akitaAssets;
    constructor({ algorand, daoAppId, socialFactoryParams, graphFactoryParams, impactFactoryParams, moderationFactoryParams, readerAccount, sendParams, ipfsUrl, }: SocialSDKConstructorParams);
    /**
     * Get the latest timestamp from the blockchain.
     * This is useful when creating posts/replies since the contract validates
     * that the provided timestamp is not too far from Global.latestTimestamp.
     *
     * @returns The latest block timestamp as a bigint (unix seconds)
     */
    getBlockchainTimestamp(): Promise<bigint>;
    setReaderAccount(readerAccount: string): void;
    setSendParams(sendParams: ExpandedSendParams): void;
    private getSendParams;
    private getRequiredSendParams;
    /**
     * Generate a random 24-byte nonce for post key derivation
     * The contract will combine this with the chain timestamp to derive the full key.
     * @returns A random 24-byte Uint8Array
     */
    static generatePostNonce(): Uint8Array;
    /**
     * Compute the deterministic post key from creator address, timestamp, and nonce
     * The key is sha256(creatorAddressBytes + timestamp + nonce)
     *
     * Note: The timestamp used by the contract is Global.latestTimestamp at execution time.
     * This method allows estimating the key for a given timestamp.
     *
     * @param creatorAddress - The Algorand address of the post creator
     * @param timestamp - The timestamp (unix seconds) - use current time to estimate
     * @param nonce - A 24-byte nonce (use generatePostNonce() or provide your own)
     * @returns The 32-byte post key
     */
    computePostKey(creatorAddress: string, timestamp: bigint | number, nonce: Uint8Array): Uint8Array;
    /**
     * Compute the deterministic key for external content (Twitter, Farcaster, etc.)
     * The key is sha256(platformPrefix + externalId)
     *
     * @param platform - The platform identifier (e.g., "twitter", "farcaster")
     * @param externalId - The external content identifier (e.g., tweet ID, cast hash)
     * @returns The 32-byte external ref key
     */
    static computeExternalRefKey(platform: string, externalId: string): Uint8Array;
    /**
     * Compute the deterministic key for an edit
     * The key is sha256(creatorAddressBytes + originalPostKey + newCID)
     *
     * This cryptographically links the edit to its original and makes same edits idempotent.
     *
     * @param creatorAddress - The Algorand address of the edit creator
     * @param originalKey - The 32-byte key of the post being edited
     * @param newCid - The CID of the new content
     * @returns The 32-byte edit key
     */
    computeEditKey(creatorAddress: string, originalKey: Uint8Array, newCid: Uint8Array): Uint8Array;
    /**
     * Internal sha256 helper using Web Crypto API (sync wrapper)
     * Note: This is a synchronous approximation - for production, consider using
     * a proper crypto library like @noble/hashes
     */
    private sha256;
    /**
     * Static sha256 helper
     * Uses Web Crypto API synchronously (via SubtleCrypto workaround)
     */
    private static sha256Static;
    /**
     * Get social fees from the DAO config (cached after first call)
     * @returns Social fees including postFee, reactFee, impactTaxMin, impactTaxMax
     * @throws Error if daoAppId was not provided during SDK construction
     */
    getSocialFees(): Promise<SocialFees>;
    /**
     * Get AKTA asset info from the DAO config (cached after first call)
     * @returns Akita assets including akta and bones asset IDs
     * @throws Error if daoAppId was not provided during SDK construction
     */
    getAkitaAssets(): Promise<AkitaAssets>;
    /**
     * Clear cached DAO config (call this if fees change)
     */
    clearCache(): void;
    /**
     * Get MBR values from the contract for various box types
     * @param ref - Optional reference bytes (empty for default MBR values)
     * @returns MBR data for all social box types
     */
    getMbr({ sender, signer, ref }: MaybeSigner & {
        ref?: Uint8Array;
    }): Promise<AkitaSocialMbrData>;
    /**
     * Check tip MBR requirements for sending tips to a recipient
     * This determines if the recipient can receive tips directly, via ARC-58, or ARC-59
     * @param creator - The address of the tip recipient
     * @param wallet - The wallet app ID of the recipient (0 if none)
     * @returns Tip MBR info including type and additional MBR needed
     */
    checkTipMbrRequirements({ sender, signer, creator, wallet, }: MaybeSigner & {
        creator: string;
        wallet?: bigint | number;
    }): Promise<TipMbrInfo>;
    /**
     * Calculate the extra MBR needed for tip delivery based on recipient wallet type
     * @param tipMbrInfo - The tip MBR info from checkTipMbrRequirements
     * @returns Extra MBR amount in microAlgos
     */
    calculateTipExtraMbr(tipMbrInfo: TipMbrInfo): bigint;
    /**
     * Calculate the MBR required for a post
     * Formula: posts + votes + votelist
     * Where posts = MinPostsMBR + (BoxCostPerByte * cid.length)
     *
     * @param cidLength - Length of the CID (default 36 for IPFS CIDv1)
     * @param isAmendment - Whether this is an edit/amendment (adds extra MBR)
     * @returns MBR in microAlgos
     */
    calculatePostMBR(cidLength?: number, isAmendment?: boolean): bigint;
    /**
     * Calculate the MBR required for a reply
     * Same as post, but may include extra MBR for creating empty post for reference
     *
     * @param cidLength - Length of the CID (default 36 for IPFS CIDv1)
     * @param isAmendment - Whether this is an edit/amendment
     * @param needsEmptyPost - Whether an empty post needs to be created for the reference
     * @returns MBR in microAlgos
     */
    calculateReplyMBR(cidLength?: number, isAmendment?: boolean, needsEmptyPost?: boolean): bigint;
    /**
     * Calculate the MBR required for a vote
     * Formula: votelist (+ extra if creating empty post for reference)
     *
     * @param needsEmptyPost - Whether an empty post needs to be created for the reference
     * @returns MBR in microAlgos
     */
    calculateVoteMBR(needsEmptyPost?: boolean): bigint;
    /**
     * Calculate the MBR required for a reaction
     * Formula: reactionlist (+ reactions if first reaction with this NFT)
     *
     * @param isFirstReactionWithNFT - Whether this is the first reaction with this specific NFT
     * @param needsEmptyPost - Whether an empty post needs to be created for the reference
     * @returns MBR in microAlgos
     */
    calculateReactMBR(isFirstReactionWithNFT?: boolean, needsEmptyPost?: boolean): bigint;
    /**
     * Calculate the MBR required for a follow
     * @returns MBR in microAlgos
     */
    calculateFollowMBR(): bigint;
    /**
     * Calculate the MBR required for a block
     * @returns MBR in microAlgos
     */
    calculateBlockMBR(): bigint;
    /**
     * Calculate the MBR required for initializing meta
     * Includes META_MBR for the social contract + IMPACT_META_MBR for the impact contract
     * @returns MBR in microAlgos
     */
    calculateMetaMBR(): bigint;
    /**
     * Calculate the MBR required for a paywall
     * Formula: MinPayWallMBR + (BoxCostPerByte * PayWallPayOptionSize * totalOptions)
     *
     * @param userOptionsCount - Number of user pay options
     * @param agentOptionsCount - Number of agent pay options
     * @returns MBR in microAlgos
     */
    calculatePayWallMBR(userOptionsCount: number, agentOptionsCount: number): bigint;
    /**
     * Calculate the MBR required for adding a moderator
     * @returns MBR in microAlgos
     */
    calculateModeratorMBR(): bigint;
    /**
     * Calculate the MBR required for banning a user
     * @returns MBR in microAlgos
     */
    calculateBanMBR(): bigint;
    /**
     * Calculate the MBR required for adding an action
     * @returns MBR in microAlgos
     */
    calculateActionMBR(): bigint;
    /**
     * Check if an account is banned
     */
    isBanned({ sender, signer, account }: MaybeSigner & {
        account: string;
    }): Promise<boolean>;
    /**
     * Get user's social impact score from the Social contract
     */
    getUserSocialImpact({ sender, signer, user }: MaybeSigner & {
        user: string;
    }): Promise<bigint>;
    /**
     * Get moderator metadata for a user
     */
    getModeratorMeta({ sender, signer, user }: MaybeSigner & {
        user: string;
    }): Promise<{
        exists: boolean;
        lastActive: bigint;
    }>;
    /**
     * Get user metadata from the Social contract
     */
    getMeta({ sender, signer, user }: MaybeSigner & {
        user: string;
    }): Promise<MetaValue>;
    /**
     * Get a post by reference
     */
    getPost({ sender, signer, ref }: MaybeSigner & {
        ref: PostRef;
    }): Promise<PostValue>;
    /**
     * Get a post and its creator's metadata
     * This is a convenience method that fetches both post and creator meta in sequence
     */
    getPostAndCreatorMeta({ sender, signer, ref }: MaybeSigner & {
        ref: PostRef;
    }): Promise<{
        post: PostValue;
        meta: MetaValue;
    }>;
    /**
     * Get vote data for a post reference (returns impact and direction of vote)
     */
    getVote({ sender, signer, ref }: MaybeSigner & {
        ref: PostRef;
    }): Promise<VoteListValue>;
    /**
     * Get vote data for multiple post references at once
     * Returns an array of VoteListValue in the same order as the input refs
     * For posts the user hasn't voted on, returns { impact: 0n, isUp: false }
     * This method is more efficient than calling getVote multiple times and won't error on missing votes
     */
    getVotes({ sender, signer, refs }: MaybeSigner & {
        refs: PostRef[];
    }): Promise<VoteListValue[]>;
    /**
     * Get post metadata including reaction status
     */
    getPostMeta({ sender, signer, ref, nft }: MaybeSigner & {
        ref: PostRef;
        nft: bigint | number;
    }): Promise<any>;
    /**
     * Check if a user is blocked by another user
     */
    isBlocked({ sender, signer, user, blocked }: MaybeSigner & {
        user: string;
        blocked: string;
    }): Promise<boolean>;
    /**
     * Check if one account is following another
     * @param follower - The account that may be following
     * @param user - The account that may be followed
     */
    isFollowing({ sender, signer, follower, user }: MaybeSigner & {
        follower: string;
        user: string;
    }): Promise<boolean>;
    /**
     * Get the follow index for a follower-user pair
     * @param follower - The account that is following
     * @param user - The account that is followed
     */
    getFollowIndex({ sender, signer, follower, user }: MaybeSigner & {
        follower: string;
        user: string;
    }): Promise<bigint>;
    /**
     * Get user impact score (including social impact)
     */
    getUserImpact({ sender, signer, address }: MaybeSigner & {
        address: string;
    }): Promise<bigint>;
    /**
     * Get user impact score (excluding social impact)
     */
    getUserImpactWithoutSocial({ sender, signer, address }: MaybeSigner & {
        address: string;
    }): Promise<bigint>;
    /**
     * Get impact metadata for a user
     */
    getImpactMeta({ sender, signer, user }: MaybeSigner & {
        user: string;
    }): Promise<ImpactMetaValue>;
    init({ sender, signer, }?: MaybeSigner): Promise<GroupReturn>;
    /**
     * Initialize meta for a user (required before using social features)
     */
    initMeta({ sender, signer, user, automated, subscriptionIndex, nfd, akitaNFT, }: InitMetaArgs): Promise<bigint>;
    /**
     * Update meta settings for the sender
     */
    updateMeta({ sender, signer, followGateId, addressGateId, subscriptionIndex, nfd, akitaNFT, defaultPayWallId, }: UpdateMetaArgs): Promise<void>;
    /**
     * Create a new post
     *
     * @param args - Post arguments including optional timestamp, nonce and CID
     * @returns The post key, timestamp, and nonce used
     *
     * Automatically calculates:
     * - MBR: posts + votes + votelist
     * - Tip: postFee in AKTA from DAO social fees
     *
     * The post key is derived as sha256(creator + timestamp + nonce).
     * The timestamp is validated by the contract to be within 60 seconds of chain time.
     */
    post({ sender, signer, timestamp: providedTimestamp, nonce: providedNonce, cid, gateId, usePayWall, payWallId, }: PostArgs): Promise<{
        postKey: Uint8Array;
        timestamp: bigint;
        nonce: Uint8Array;
    }>;
    /**
     * Edit an existing post (creates an amendment)
     *
     * @param args - Edit post arguments including new CID and amendment reference
     * @returns The deterministic post key for the edited post (derived from creator + original + CID)
     *
     * Automatically calculates:
     * - MBR: posts + votes + votelist + amendment + edit back-ref
     * - Tip: postFee in AKTA from DAO social fees
     *
     * The edit key is derived as sha256(creator + originalPostKey + newCID), making edits
     * cryptographically linked to their original and idempotent (same edit = same key).
     */
    editPost({ sender, signer, cid, amendment, }: EditPostArgs): Promise<Uint8Array>;
    /**
     * Reply to a post or comment
     *
     * @param args - Reply arguments including optional timestamp, nonce, CID and reference
     * @returns The reply key, timestamp, and nonce used
     *
     * Automatically calculates:
     * - MBR: reply base + potential tip delivery MBR (ARC-58/ARC-59)
     * - Tip: reactFee in AKTA from DAO social fees
     *
     * Note: Replies validate tips using TipActionReact (reactFee), not postFee
     */
    reply({ sender, signer, timestamp: providedTimestamp, nonce: providedNonce, cid, ref, refType, gateId, usePayWall, payWallId, gateTxn, }: ReplyArgs): Promise<{
        replyKey: Uint8Array;
        timestamp: bigint;
        nonce: Uint8Array;
    }>;
    /**
     * Vote on a post (upvote or downvote)
     *
     * @param args - Vote arguments including reference and vote direction
     *
     * Automatically calculates:
     * - MBR: votelist + potential tip delivery MBR (ARC-58/ARC-59) for upvotes
     * - Tip: reactFee in AKTA from DAO social fees
     */
    vote({ sender, signer, ref, refType, isUp, }: VoteArgs): Promise<void>;
    /**
     * Edit an existing vote (undo or flip)
     *
     * @param args - Edit vote arguments
     *
     * Note: If flip=false, the vote is removed and MBR is refunded.
     * If flip=true, reactFee is charged.
     */
    /**
     * Invert an existing vote (upvote becomes downvote, or vice versa)
     *
     * @param args - Invert vote arguments including the post reference
     *
     * Automatically calculates tip fee from DAO social fees.
     */
    invertVote({ sender, signer, ref, }: InvertVoteArgs): Promise<void>;
    /**
     * Delete an existing vote (undo the vote entirely)
     *
     * @param args - Delete vote arguments including the post reference
     *
     * Refunds the MBR for the vote box storage.
     */
    deleteVote({ sender, signer, ref, }: DeleteVoteArgs): Promise<void>;
    /**
     * React to a post with an NFT
     *
     * @param args - React arguments including reference and NFT
     *
     * Automatically calculates:
     * - MBR: reaction boxes + potential tip delivery MBR (ARC-58/ARC-59)
     * - Tip: reactFee in AKTA from DAO social fees
     *
     * Note: MBR is higher if this is the first reaction with this specific NFT on the post
     */
    react({ sender, signer, ref, refType, nft, gateTxn, }: ReactArgs): Promise<void>;
    /**
     * Delete a reaction from a post
     */
    deleteReaction({ sender, signer, ref, nft, }: MaybeSigner & {
        ref: PostRef;
        nft: bigint | number;
    }): Promise<void>;
    /**
     * Follow a user
     *
     * @param args - Follow arguments
     *
     * Required MBR: Use calculateFollowMBR() to get the exact amount
     */
    follow({ sender, signer, address, gateTxn, }: FollowArgs): Promise<void>;
    /**
     * Unfollow a user
     */
    unfollow({ sender, signer, address, }: UnfollowArgs): Promise<void>;
    /**
     * Block a user
     *
     * @param args - Block arguments
     *
     * Required MBR: Use calculateBlockMBR() to get the exact amount
     */
    block({ sender, signer, address, }: BlockArgs): Promise<void>;
    /**
     * Unblock a user
     */
    unblock({ sender, signer, address, }: MaybeSigner & {
        address: string;
    }): Promise<void>;
    /**
     * Create a paywall configuration
     *
     * @param args - PayWall arguments with user and agent payment options
     *
     * Required MBR: Use calculatePayWallMBR() to get the exact amount
     */
    createPayWall({ sender, signer, userPayInfo, agentPayInfo, }: CreatePayWallArgs): Promise<bigint>;
    /**
     * Add a moderator (requires DAO wallet sender)
     *
     * Required MBR: Use calculateModeratorMBR() to get the exact amount
     */
    addModerator({ sender, signer, address, }: MaybeSigner & {
        address: string;
    }): Promise<void>;
    /**
     * Remove a moderator (requires DAO wallet sender)
     */
    removeModerator({ sender, signer, address, }: MaybeSigner & {
        address: string;
    }): Promise<void>;
    /**
     * Ban a user (requires moderator)
     *
     * Required MBR: Use calculateBanMBR() to get the exact amount
     */
    ban({ sender, signer, address, expiration, }: MaybeSigner & {
        address: string;
        expiration: bigint | number;
    }): Promise<void>;
    /**
     * Unban a user (requires moderator)
     */
    unban({ sender, signer, address, }: MaybeSigner & {
        address: string;
    }): Promise<void>;
    /**
     * Flag a post as against content policy (requires moderator)
     */
    flagPost({ sender, signer, ref, }: MaybeSigner & {
        ref: PostRef;
    }): Promise<void>;
    /**
     * Unflag a post (requires moderator)
     */
    unflagPost({ sender, signer, ref, }: MaybeSigner & {
        ref: PostRef;
    }): Promise<void>;
    /**
     * Add a new action type (requires DAO wallet sender)
     *
     * Required MBR: Use calculateActionMBR() to get the exact amount
     */
    addAction({ sender, signer, actionAppId, content, }: MaybeSigner & {
        actionAppId: bigint | number;
        content: Uint8Array;
    }): Promise<void>;
    /**
     * Remove an action type (requires DAO wallet sender)
     */
    removeAction({ sender, signer, actionAppId, }: MaybeSigner & {
        actionAppId: bigint | number;
    }): Promise<void>;
}
export { RefType };
