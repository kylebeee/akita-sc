import { microAlgo } from "@algorandfoundation/algokit-utils";
import { AlgorandClient } from "@algorandfoundation/algokit-utils/types/algorand-client";
import algosdk, { makeEmptyTransactionSigner } from "algosdk";
import { AppFactoryAppClientParams } from "@algorandfoundation/algokit-utils/types/app-factory";
import { DEFAULT_READER, DEFAULT_SEND_PARAMS } from "../constants";
import { ENV_VAR_NAMES, resolveAppIdWithClient, getAppIdFromEnv, detectNetworkFromClient, AkitaNetwork } from "../config";
import { OptionalAppIdFactoryParams } from "../types";
import {
  AkitaDaoClient,
  AkitaDaoFactory,
  SocialFees,
  AkitaAssets,
} from '../generated/AkitaDAOClient';
import {
  AkitaSocialClient,
  AkitaSocialFactory,
  AkitaSocialMbrData,
  MetaValue,
  PostValue,
  TipMbrInfo,
  ViewPayWallValue,
  VoteListValue,
} from '../generated/AkitaSocialClient';
import {
  AkitaSocialGraphClient,
  AkitaSocialGraphFactory,
} from '../generated/AkitaSocialGraphClient';
import {
  AkitaSocialImpactClient,
  AkitaSocialImpactFactory,
  MetaValue as ImpactMetaValue,
} from '../generated/AkitaSocialImpactClient';

import {AkitaSocialModerationClient, AkitaSocialModerationFactory} from '../generated/AkitaSocialModerationClient'
import { ExpandedSendParams, ExpandedSendParamsWithSigner, GroupReturn, hasSenderSigner, MaybeSigner } from "../types";
import {
  BlockArgs,
  CreatePayWallArgs,
  DeleteVoteArgs,
  EditPostArgs,
  FollowArgs,
  InvertVoteArgs,
  InitMetaArgs,
  PostArgs,
  PostRef,
  ReactArgs,
  RefType,
  ReplyArgs,
  SocialSDKParams,
  UnfollowArgs,
  UpdateMetaArgs,
  VoteArgs,
} from "./types";

// Re-export DAO types for external use
export type { SocialFees, AkitaAssets };
import {
  AMENDMENT_MBR,
  BLOCKS_MBR,
  BOX_COST_PER_BYTE,
  CID_LENGTH,
  EDIT_BACK_REF_MBR,
  FOLLOWS_MBR,
  IMPACT_META_MBR,
  META_MBR,
  MIN_POSTS_MBR,
  REACTIONS_MBR,
  REACTIONLIST_MBR,
  VOTELIST_MBR,
  VOTES_MBR,
  MODERATORS_MBR,
  BANNED_MBR,
  ACTIONS_MBR,
  MIN_PAYWALL_MBR,
  PAYWALL_PAY_OPTION_SIZE,
  TIP_SEND_TYPE_DIRECT,
  TIP_SEND_TYPE_ARC58,
  TIP_SEND_TYPE_ARC59,
} from "./constants";
import { AppReturn } from "@algorandfoundation/algokit-utils/types/app";

export * from './types';
export * from './constants';

// ============================================================================
// Social SDK - Unified interface for Social, Graph, and Impact contracts
// ============================================================================

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

export class SocialSDK {
  // Core clients for each contract
  public socialClient: AkitaSocialClient;
  public graphClient: AkitaSocialGraphClient;
  public impactClient: AkitaSocialImpactClient;
  public moderationClient: AkitaSocialModerationClient;

  // DAO client for reading config (lightweight - only used for state reads)
  // Optional: only created when daoAppId is provided
  private daoClient: AkitaDaoClient | null = null;

  // App IDs for easy access
  public socialAppId: bigint;
  public graphAppId: bigint;
  public impactAppId: bigint;
  public moderationAppId: bigint;
  public daoAppId: bigint | undefined;

  // Shared properties
  public algorand: AlgorandClient;
  public readerAccount: string;
  public sendParams: ExpandedSendParams;
  public ipfsUrl: string;
  
  /** The detected network for this SDK instance */
  public network: AkitaNetwork;

  // Cached DAO data (to avoid repeated calls)
  private _socialFees: SocialFees | null = null;
  private _akitaAssets: AkitaAssets | null = null;

  constructor({
    algorand,
    daoAppId,
    socialFactoryParams = {},
    graphFactoryParams = {},
    impactFactoryParams = {},
    moderationFactoryParams = {},
    readerAccount = DEFAULT_READER,
    sendParams = DEFAULT_SEND_PARAMS,
    ipfsUrl = '',
  }: SocialSDKConstructorParams) {
    this.algorand = algorand;
    this.network = detectNetworkFromClient(algorand);
    this.daoAppId = daoAppId ?? getAppIdFromEnv(ENV_VAR_NAMES.DAO_APP_ID);
    this.readerAccount = readerAccount;
    this.sendParams = { ...sendParams };
    this.ipfsUrl = ipfsUrl;

    // Apply factory default sender/signer to sendParams
    if (socialFactoryParams.defaultSender) {
      this.sendParams.sender = socialFactoryParams.defaultSender;
    }
    if (socialFactoryParams.defaultSigner) {
      this.sendParams.signer = socialFactoryParams.defaultSigner;
    }

    // Resolve app IDs from params, environment, or network config
    const resolvedSocialAppId = resolveAppIdWithClient(algorand, socialFactoryParams.appId, ENV_VAR_NAMES.SOCIAL_APP_ID, 'SocialSDK.social');
    const resolvedGraphAppId = resolveAppIdWithClient(algorand, graphFactoryParams.appId, ENV_VAR_NAMES.SOCIAL_GRAPH_APP_ID, 'SocialSDK.graph');
    const resolvedImpactAppId = resolveAppIdWithClient(algorand, impactFactoryParams.appId, ENV_VAR_NAMES.SOCIAL_IMPACT_APP_ID, 'SocialSDK.impact');
    const resolvedModerationAppId = resolveAppIdWithClient(algorand, moderationFactoryParams.appId, ENV_VAR_NAMES.SOCIAL_MODERATION_APP_ID, 'SocialSDK.moderation');

    // Initialize all clients with resolved app IDs
    this.socialClient = new AkitaSocialFactory({ algorand }).getAppClientById({
      ...socialFactoryParams,
      appId: resolvedSocialAppId,
    });
    this.graphClient = new AkitaSocialGraphFactory({ algorand }).getAppClientById({
      ...graphFactoryParams,
      appId: resolvedGraphAppId,
    });
    this.impactClient = new AkitaSocialImpactFactory({ algorand }).getAppClientById({
      ...impactFactoryParams,
      appId: resolvedImpactAppId,
    });
    this.moderationClient = new AkitaSocialModerationFactory({ algorand }).getAppClientById({
      ...moderationFactoryParams,
      appId: resolvedModerationAppId,
    });

    // Only create DAO client when a valid daoAppId is provided
    if (this.daoAppId !== undefined && this.daoAppId > 0n) {
      this.daoClient = new AkitaDaoFactory({ algorand }).getAppClientById({ appId: this.daoAppId });
    }

    this.socialAppId = this.socialClient.appId;
    this.graphAppId = this.graphClient.appId;
    this.impactAppId = this.impactClient.appId;
    this.moderationAppId = this.moderationClient.appId;
  }

  // ============================================================================
  // Blockchain Utilities
  // ============================================================================

  /**
   * Get the latest timestamp from the blockchain.
   * This is useful when creating posts/replies since the contract validates
   * that the provided timestamp is not too far from Global.latestTimestamp.
   * 
   * @returns The latest block timestamp as a bigint (unix seconds)
   */
  async getBlockchainTimestamp(): Promise<bigint> {
    const status = await this.algorand.client.algod.status().do();
    const block = await this.algorand.client.algod.block(status.lastRound).do();
    return BigInt(block.block.header.timestamp);
  }

  // ============================================================================
  // Configuration Methods
  // ============================================================================

  setReaderAccount(readerAccount: string): void {
    this.readerAccount = readerAccount;
  }

  setSendParams(sendParams: ExpandedSendParams): void {
    this.sendParams = sendParams;
  }

  private getSendParams({ sender, signer }: MaybeSigner = {}): ExpandedSendParams {
    return {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer }),
    };
  }

  private getRequiredSendParams(params: MaybeSigner = {}): ExpandedSendParamsWithSigner {
    const sendParams = this.getSendParams(params);
    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at SDK instantiation');
    }
    return sendParams;
  }

  protected getReaderSendParams({ sender }: { sender?: string } = {}): ExpandedSendParams {
    return {
      ...this.sendParams,
      ...(sender !== undefined ? { sender } : { sender: this.readerAccount }),
      signer: makeEmptyTransactionSigner()
    };
  }

  // ============================================================================
  // Post Key Methods - Deterministic key derivation for posts
  // ============================================================================

  /**
   * Generate a random 24-byte nonce for post key derivation
   * The contract will combine this with the chain timestamp to derive the full key.
   * @returns A random 24-byte Uint8Array
   */
  static generatePostNonce(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(24));
  }

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
  computePostKey(creatorAddress: string, timestamp: bigint | number, nonce: Uint8Array): Uint8Array {
    const { decodeAddress } = require('algosdk');
    const addressBytes = decodeAddress(creatorAddress).publicKey;
    
    // Convert timestamp to 8-byte big-endian
    const timestampBytes = new Uint8Array(8);
    const ts = BigInt(timestamp);
    for (let i = 7; i >= 0; i--) {
      timestampBytes[i] = Number(ts >> BigInt((7 - i) * 8) & 0xFFn);
    }
    
    // Concatenate: creator (32) + timestamp (8) + nonce (24) = 64 bytes
    const combined = new Uint8Array(addressBytes.length + 8 + nonce.length);
    combined.set(addressBytes, 0);
    combined.set(timestampBytes, addressBytes.length);
    combined.set(nonce, addressBytes.length + 8);
    
    return this.sha256(combined);
  }

  /**
   * Compute the deterministic key for external content (Twitter, Farcaster, etc.)
   * The key is sha256(platformPrefix + externalId)
   * 
   * @param platform - The platform identifier (e.g., "twitter", "farcaster")
   * @param externalId - The external content identifier (e.g., tweet ID, cast hash)
   * @returns The 32-byte external ref key
   */
  static computeExternalRefKey(platform: string, externalId: string): Uint8Array {
    const combined = new TextEncoder().encode(`${platform}:${externalId}`);
    return SocialSDK.sha256Static(combined);
  }

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
  computeEditKey(creatorAddress: string, originalKey: Uint8Array, newCid: Uint8Array): Uint8Array {
    const { decodeAddress } = require('algosdk');
    const addressBytes = decodeAddress(creatorAddress).publicKey;
    
    // Concatenate: creator address + original key + new CID
    const combined = new Uint8Array(addressBytes.length + originalKey.length + newCid.length);
    combined.set(addressBytes, 0);
    combined.set(originalKey, addressBytes.length);
    combined.set(newCid, addressBytes.length + originalKey.length);
    
    return this.sha256(combined);
  }

  /**
   * Internal sha256 helper using Web Crypto API (sync wrapper)
   * Note: This is a synchronous approximation - for production, consider using
   * a proper crypto library like @noble/hashes
   */
  private sha256(data: Uint8Array): Uint8Array {
    // Use algosdk's built-in sha256 if available, otherwise fallback
    // For now, we'll use a simple implementation
    return SocialSDK.sha256Static(data);
  }

  /**
   * Static sha256 helper
   * Uses Web Crypto API synchronously (via SubtleCrypto workaround)
   */
  private static sha256Static(data: Uint8Array): Uint8Array {
    // This requires a synchronous sha256 implementation
    // We'll use the algosdk encoding utilities or a polyfill
    // For production, recommend using @noble/hashes/sha256
    
    // Simple implementation using built-in if available
    if (typeof globalThis !== 'undefined' && 'crypto' in globalThis) {
      // Use synchronous approach - this is a simplified version
      // In production, use @noble/hashes or similar
      const { sha256 } = require('@noble/hashes/sha256');
      return sha256(data);
    }
    
    throw new Error('No sha256 implementation available - install @noble/hashes');
  }

  // ============================================================================
  // DAO Config Methods - Fetch social fees and AKTA asset ID from DAO
  // ============================================================================

  /**
   * Get social fees from the DAO config (cached after first call)
   * @returns Social fees including postFee, reactFee, impactTaxMin, impactTaxMax
   * @throws Error if daoAppId was not provided during SDK construction
   */
  async getSocialFees(): Promise<SocialFees> {
    if (this._socialFees) {
      return this._socialFees;
    }
    if (!this.daoClient) {
      throw new Error('DAO client not available - daoAppId must be provided during SDK construction to fetch social fees');
    }
    const fees = await this.daoClient.state.global.socialFees();
    if (!fees) {
      throw new Error('Failed to fetch social fees from DAO');
    }
    this._socialFees = fees;
    return fees;
  }

  /**
   * Get AKTA asset info from the DAO config (cached after first call)
   * @returns Akita assets including akta and bones asset IDs
   * @throws Error if daoAppId was not provided during SDK construction
   */
  async getAkitaAssets(): Promise<AkitaAssets> {
    if (this._akitaAssets) {
      return this._akitaAssets;
    }
    if (!this.daoClient) {
      throw new Error('DAO client not available - daoAppId must be provided during SDK construction to fetch akita assets');
    }
    const assets = await this.daoClient.state.global.akitaAssets();
    if (!assets) {
      throw new Error('Failed to fetch akita assets from DAO');
    }
    this._akitaAssets = assets;
    return assets;
  }

  /**
   * Clear cached DAO config (call this if fees change)
   */
  clearCache(): void {
    this._socialFees = null;
    this._akitaAssets = null;
  }

  // ============================================================================
  // Contract MBR Methods - Call contract directly for MBR calculations
  // ============================================================================

  /**
   * Get MBR values from the contract for various box types
   * @param ref - Optional reference bytes (empty for default MBR values)
   * @returns MBR data for all social box types
   */
  async getMbr({ sender, signer, ref = new Uint8Array() }: MaybeSigner & { ref?: Uint8Array }): Promise<AkitaSocialMbrData> {
    const sendParams = this.getSendParams({ sender, signer });
    const result = await this.socialClient.send.mbr({
      ...sendParams,
      args: { ref },
    });
    return result.return!;
  }

  /**
   * Check tip MBR requirements for sending tips to a recipient
   * This determines if the recipient can receive tips directly, via ARC-58, or ARC-59
   * @param creator - The address of the tip recipient
   * @param wallet - The wallet app ID of the recipient (0 if none)
   * @returns Tip MBR info including type and additional MBR needed
   */
  async checkTipMbrRequirements({
    sender,
    signer,
    creator,
    wallet = 0n,
  }: MaybeSigner & { creator: string; wallet?: bigint | number }): Promise<TipMbrInfo> {
    const sendParams = this.getSendParams({ sender, signer });
    const result = await this.socialClient.send.checkTipMbrRequirements({
      ...sendParams,
      args: {
        akitaDao: this.daoAppId ?? 0n,
        creator,
        wallet: BigInt(wallet),
      },
    });
    return result.return!;
  }

  /**
   * Calculate the extra MBR needed for tip delivery based on recipient wallet type
   * @param tipMbrInfo - The tip MBR info from checkTipMbrRequirements
   * @returns Extra MBR amount in microAlgos
   */
  calculateTipExtraMbr(tipMbrInfo: TipMbrInfo): bigint {
    if (tipMbrInfo.type === TIP_SEND_TYPE_ARC58) {
      return tipMbrInfo.arc58;
    }
    return 0n;
  }

  // ============================================================================
  // MBR Calculation Methods (Static calculations)
  // ============================================================================

  /**
   * Calculate the MBR required for a post
   * Formula: posts + votes + votelist
   * Where posts = MinPostsMBR + (BoxCostPerByte * cid.length)
   * 
   * @param cidLength - Length of the CID (default 36 for IPFS CIDv1)
   * @param isAmendment - Whether this is an edit/amendment (adds extra MBR)
   * @returns MBR in microAlgos
   */
  calculatePostMBR(cidLength: number = CID_LENGTH, isAmendment: boolean = false): bigint {
    const postsMbr = MIN_POSTS_MBR + (BOX_COST_PER_BYTE * BigInt(cidLength));
    let total = postsMbr + VOTES_MBR + VOTELIST_MBR;
    if (isAmendment) {
      // For edits: amendment MBR (marking original) + edit back-ref MBR (back-pointer in edit)
      total += AMENDMENT_MBR + EDIT_BACK_REF_MBR;
    }
    return total;
  }

  /**
   * Calculate the MBR required for a reply
   * Same as post, but may include extra MBR for creating empty post for reference
   * 
   * @param cidLength - Length of the CID (default 36 for IPFS CIDv1)
   * @param isAmendment - Whether this is an edit/amendment
   * @param needsEmptyPost - Whether an empty post needs to be created for the reference
   * @returns MBR in microAlgos
   */
  calculateReplyMBR(cidLength: number = CID_LENGTH, isAmendment: boolean = false, needsEmptyPost: boolean = false): bigint {
    let total = this.calculatePostMBR(cidLength, isAmendment);
    if (needsEmptyPost) {
      // Empty post has 0 CID length but still needs posts + votes MBR
      total += MIN_POSTS_MBR + VOTES_MBR;
    }
    return total;
  }

  /**
   * Calculate the MBR required for a vote
   * Formula: votelist (+ extra if creating empty post for reference)
   * 
   * @param needsEmptyPost - Whether an empty post needs to be created for the reference
   * @returns MBR in microAlgos
   */
  calculateVoteMBR(needsEmptyPost: boolean = false): bigint {
    let total = VOTELIST_MBR;
    if (needsEmptyPost) {
      total += MIN_POSTS_MBR + VOTES_MBR;
    }
    return total;
  }

  /**
   * Calculate the MBR required for a reaction
   * Formula: reactionlist (+ reactions if first reaction with this NFT)
   * 
   * @param isFirstReactionWithNFT - Whether this is the first reaction with this specific NFT
   * @param needsEmptyPost - Whether an empty post needs to be created for the reference
   * @returns MBR in microAlgos
   */
  calculateReactMBR(isFirstReactionWithNFT: boolean = true, needsEmptyPost: boolean = false): bigint {
    let total = REACTIONLIST_MBR;
    if (isFirstReactionWithNFT) {
      total += REACTIONS_MBR;
    }
    if (needsEmptyPost) {
      total += MIN_POSTS_MBR + VOTES_MBR;
    }
    return total;
  }

  /**
   * Calculate the MBR required for a follow
   * @returns MBR in microAlgos
   */
  calculateFollowMBR(): bigint {
    return FOLLOWS_MBR;
  }

  /**
   * Calculate the MBR required for a block
   * @returns MBR in microAlgos
   */
  calculateBlockMBR(): bigint {
    return BLOCKS_MBR;
  }

  /**
   * Calculate the MBR required for initializing meta
   * Includes META_MBR for the social contract + IMPACT_META_MBR for the impact contract
   * @returns MBR in microAlgos
   */
  calculateMetaMBR(): bigint {
    return META_MBR + IMPACT_META_MBR;
  }

  /**
   * Calculate the MBR required for a paywall
   * Formula: MinPayWallMBR + (BoxCostPerByte * PayWallPayOptionSize * totalOptions)
   * 
   * @param userOptionsCount - Number of user pay options
   * @param agentOptionsCount - Number of agent pay options
   * @returns MBR in microAlgos
   */
  calculatePayWallMBR(userOptionsCount: number, agentOptionsCount: number): bigint {
    const totalOptions = userOptionsCount + agentOptionsCount;
    return MIN_PAYWALL_MBR + (BOX_COST_PER_BYTE * PAYWALL_PAY_OPTION_SIZE * BigInt(totalOptions));
  }

  /**
   * Calculate the MBR required for adding a moderator
   * @returns MBR in microAlgos
   */
  calculateModeratorMBR(): bigint {
    return MODERATORS_MBR;
  }

  /**
   * Calculate the MBR required for banning a user
   * @returns MBR in microAlgos
   */
  calculateBanMBR(): bigint {
    return BANNED_MBR;
  }

  /**
   * Calculate the MBR required for adding an action
   * @returns MBR in microAlgos
   */
  calculateActionMBR(): bigint {
    return ACTIONS_MBR;
  }

  // ============================================================================
  // READ METHODS - Social Contract
  // ============================================================================

  /**
   * Check if an account is banned
   */
  async isBanned({ sender, signer, account }: MaybeSigner & { account: string }): Promise<boolean> {
    const sendParams = this.getSendParams({ sender, signer });
    return await this.socialClient.isBanned({ ...sendParams, args: { account } });
  }

  /**
   * Get user's social impact score from the Social contract
   */
  async getUserSocialImpact({ sender, signer, user }: MaybeSigner & { user: string }): Promise<bigint> {
    const sendParams = this.getSendParams({ sender, signer });
    return await this.socialClient.getUserSocialImpact({ ...sendParams, args: { user } });
  }

  /**
   * Get moderator metadata for a user
   */
  async getModeratorMeta({ sender, signer, user }: MaybeSigner & { user: string }): Promise<{ exists: boolean; lastActive: bigint }> {
    const sendParams = this.getSendParams({ sender, signer });
    return await this.moderationClient.moderatorMeta({ ...sendParams, args: { user } });
  }

  /**
   * Get user metadata from the Social contract
   */
  async getMeta({ sender, signer, user }: MaybeSigner & { user: string }): Promise<MetaValue> {
    const sendParams = this.getSendParams({ sender, signer });
    return await this.socialClient.getMeta({ ...sendParams, args: { user } });
  }

  /**
   * Get a post by reference
   */
  async getPost({ sender, signer, ref }: MaybeSigner & { ref: PostRef }): Promise<PostValue> {
    const sendParams = this.getSendParams({ sender, signer });
    return await this.socialClient.getPost({ ...sendParams, args: { ref } });
  }

  /**
   * Get a post and its creator's metadata
   * This is a convenience method that fetches both post and creator meta in sequence
   */
  async getPostAndCreatorMeta({ sender, signer, ref }: MaybeSigner & { ref: PostRef }): Promise<{ post: PostValue; meta: MetaValue }> {
    const sendParams = this.getSendParams({ sender, signer });
    const post = await this.socialClient.getPost({ ...sendParams, args: { ref } });
    const meta = await this.socialClient.getMeta({ ...sendParams, args: { user: post.creator } });
    return { post, meta };
  }

  /**
   * Get vote data for a post reference (returns impact and direction of vote)
   */
  async getVote({ sender, signer, account, ref }: MaybeSigner & { account: string; ref: PostRef }): Promise<VoteListValue> {
    const sendParams = this.getSendParams({ sender, signer });
    return await this.socialClient.getVote({ ...sendParams, args: { account, ref } });
  }

  /**
   * Get vote data for multiple post references at once
   * Returns an array of VoteListValue in the same order as the input refs
   * For posts the user hasn't voted on, returns { impact: 0n, isUp: false }
   * This method is more efficient than calling getVote multiple times and won't error on missing votes
   */
  async getVotes({ sender, signer, keys }: MaybeSigner & { keys: { account: string; ref: PostRef }[] }): Promise<VoteListValue[]> {
    const sendParams = this.getSendParams({ sender, signer });
    const result = await this.socialClient.getVotes({ ...sendParams, args: { keys: keys.map(({ account, ref }) => [account, ref]) } });
    // Transform tuples [impact, isUp] to VoteListValue objects
    return result.map(([impact, isUp]) => ({ impact, isUp }));
  }


  // ============================================================================
  // READ METHODS - Graph Contract
  // ============================================================================

  /**
   * Check if a user is blocked by another user
   */
  async isBlocked({ sender, signer, user, blocked }: MaybeSigner & { user: string; blocked: string }): Promise<boolean> {
    const sendParams = this.getSendParams({ sender, signer });
    return await this.graphClient.isBlocked({ ...sendParams, args: { user, blocked } });
  }

  /**
   * Check if one account is following another
   * @param follower - The account that may be following
   * @param user - The account that may be followed
   */
  async isFollowing({ sender, signer, follower, user }: MaybeSigner & { follower: string; user: string }): Promise<boolean> {
    const sendParams = this.getReaderSendParams();
    return await this.graphClient.isFollowing({ ...sendParams, args: { follower, user } });
  }

  /**
   * Get the follow index for a follower-user pair
   * @param follower - The account that is following
   * @param user - The account that is followed
   */
  async getFollowIndex({ sender, signer, follower, user }: MaybeSigner & { follower: string; user: string }): Promise<bigint> {
    const sendParams = this.getSendParams({ sender, signer });
    return await this.graphClient.getFollowIndex({ ...sendParams, args: { follower, user } });
  }

  // ============================================================================
  // READ METHODS - Impact Contract
  // ============================================================================

  /**
   * Get user impact score (including social impact)
   */
  async getUserImpact({ sender, signer, address }: MaybeSigner & { address: string }): Promise<bigint> {
    const sendParams = this.getSendParams({ sender, signer });
    return await this.impactClient.getUserImpact({ ...sendParams, args: { address } });
  }

  /**
   * Get user impact score (excluding social impact)
   */
  async getUserImpactWithoutSocial({ sender, signer, address }: MaybeSigner & { address: string }): Promise<bigint> {
    const sendParams = this.getSendParams({ sender, signer });
    return await this.impactClient.getUserImpactWithoutSocial({ ...sendParams, args: { address } });
  }

  /**
   * Get impact metadata for a user
   */
  async getImpactMeta({ sender, signer, user }: MaybeSigner & { user: string }): Promise<ImpactMetaValue> {
    const sendParams = this.getSendParams({ sender, signer });
    return await this.impactClient.getMeta({ ...sendParams, args: { user } });
  }

  async init({
    sender,
    signer,
  }: MaybeSigner = {}): Promise<GroupReturn> {

    const sendParams = this.getRequiredSendParams({ sender, signer });
    const group = this.socialClient.newGroup();

    group.init({
      ...sendParams,
      args: [],
      maxFee: (10_000).microAlgos(),
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: (1_000).microAlgos()
    });

    return await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
  }

  // ============================================================================
  // WRITE METHODS - Meta Operations
  // ============================================================================

  /**
   * Initialize meta for a user (required before using social features)
   */
  async initMeta({
    sender,
    signer,
    user,
    automated = false,
    subscriptionIndex = 0n,
    nfd = 0n,
    akitaNFT = 0n,
  }: InitMetaArgs): Promise<bigint> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    const mbrAmount = this.calculateMetaMBR();

    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrAmount),
      receiver: this.socialClient.appAddress,
    });

    const result = await this.socialClient.send.initMeta({
      ...sendParams,
      args: {
        mbrPayment,
        user: user ?? sendParams.sender.toString(),
        automated,
        subscriptionIndex,
        nfd,
        akitaNft: akitaNFT,
      },
    });

    return result.return!;
  }

  /**
   * Update meta settings for the sender
   */
  async updateMeta({
    sender,
    signer,
    followGateId = 0n,
    addressGateId = 0n,
    subscriptionIndex = 0n,
    nfd = 0n,
    akitaNFT = 0n,
    defaultPayWallId = 0n,
  }: UpdateMetaArgs): Promise<void> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    await this.socialClient.send.updateMeta({
      ...sendParams,
      args: {
        followGateId,
        addressGateId,
        subscriptionIndex,
        nfd,
        akitaNft: akitaNFT,
        defaultPayWallId,
      },
    });
  }

  // ============================================================================
  // WRITE METHODS - Post Operations
  // ============================================================================

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
  async post({
    sender,
    signer,
    timestamp: providedTimestamp,
    nonce: providedNonce,
    cid,
    gateId = 0n,
    usePayWall = false,
    payWallId = 0n,
  }: PostArgs): Promise<{ postKey: Uint8Array; timestamp: bigint; nonce: Uint8Array }> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    // Fetch fees, assets, and blockchain timestamp in parallel
    const [socialFees, akitaAssets, blockchainTimestamp] = await Promise.all([
      this.getSocialFees(),
      this.getAkitaAssets(),
      providedTimestamp ? Promise.resolve(BigInt(providedTimestamp)) : this.getBlockchainTimestamp(),
    ]);

    // Use provided timestamp or blockchain timestamp
    const timestamp = BigInt(providedTimestamp ?? blockchainTimestamp);
    
    // Auto-generate 24-byte nonce if not provided
    const nonce = providedNonce ?? SocialSDK.generatePostNonce();

    // Compute the deterministic post key
    const creatorAddress = sendParams.sender.toString();
    const postKey = this.computePostKey(creatorAddress, timestamp, nonce);

    const mbrAmount = this.calculatePostMBR(cid.length, false);

    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrAmount),
      receiver: this.socialClient.appAddress,
    });

    // AKTA tip transfer (required by contract - validates postFee)
    const tipTxn = this.algorand.createTransaction.assetTransfer({
      ...sendParams,
      amount: socialFees.postFee,
      assetId: akitaAssets.akta,
      receiver: this.socialClient.appAddress,
    });

    const group = this.socialClient.newGroup();

    group.post({
      ...sendParams,
      args: {
        mbrPayment,
        tip: tipTxn,
        timestamp,
        nonce,
        cid,
        gateId,
        usePayWall,
        payWallId,
      },
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: (1_000).microAlgos(),
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: (1_000).microAlgos(),
      note: '1'
    });

    await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });

    return { postKey, timestamp, nonce };
  }

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
  async editPost({
    sender,
    signer,
    cid,
    amendment,
  }: EditPostArgs): Promise<Uint8Array> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    // Compute the deterministic edit key from: creator + originalKey + newCID
    const postKey = this.computeEditKey(sendParams.sender.toString(), amendment, cid);

    // Fetch fees and assets from DAO
    const [socialFees, akitaAssets] = await Promise.all([
      this.getSocialFees(),
      this.getAkitaAssets(),
    ]);

    const mbrAmount = this.calculatePostMBR(cid.length, true);

    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrAmount),
      receiver: this.socialClient.appAddress,
    });

    const tipTxn = this.algorand.createTransaction.assetTransfer({
      ...sendParams,
      amount: socialFees.postFee,
      assetId: akitaAssets.akta,
      receiver: this.socialClient.appAddress,
    });

    await this.socialClient.send.editPost({
      ...sendParams,
      args: {
        mbrPayment,
        tip: tipTxn,
        cid,
        amendment,
      },
    });

    return postKey;
  }

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
  async reply({
    sender,
    signer,
    timestamp: providedTimestamp,
    nonce: providedNonce,
    cid,
    ref,
    refType,
    gateId = 0n,
    usePayWall = false,
    payWallId = 0n,
    gateTxn,
  }: ReplyArgs): Promise<{ replyKey: Uint8Array; timestamp: bigint; nonce: Uint8Array }> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    // Fetch fees, assets, and blockchain timestamp in parallel
    const [socialFees, akitaAssets, blockchainTimestamp] = await Promise.all([
      this.getSocialFees(),
      this.getAkitaAssets(),
      providedTimestamp ? Promise.resolve(BigInt(providedTimestamp)) : this.getBlockchainTimestamp(),
    ]);

    // Use provided timestamp or blockchain timestamp
    const timestamp = BigInt(providedTimestamp ?? blockchainTimestamp);

    // Auto-generate 24-byte nonce if not provided
    const nonce = providedNonce ?? SocialSDK.generatePostNonce();

    // Compute the deterministic reply key
    const creatorAddress = sendParams.sender.toString();
    const replyKey = this.computePostKey(creatorAddress, timestamp, nonce);

    // Note: May need extra MBR for empty post creation - caller should use calculateReplyMBR()
    const mbrAmount = this.calculateReplyMBR(cid.length, false, false);

    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrAmount),
      receiver: this.socialClient.appAddress,
    });

    const tipTxn = this.algorand.createTransaction.assetTransfer({
      ...sendParams,
      amount: socialFees.reactFee,
      assetId: akitaAssets.akta,
      receiver: this.socialClient.appAddress,
    });

    const group = this.socialClient.newGroup();

    if (gateTxn) {
      group.gatedReply({
        ...sendParams,
        args: {
          mbrPayment,
          tip: tipTxn,
          gateTxn,
          timestamp,
          nonce,
          cid,
          ref,
          type: refType,
          gateId,
          usePayWall,
          payWallId,
        },
      });
    } else {
      group.reply({
        ...sendParams,
        args: {
          mbrPayment,
          tip: tipTxn,
          timestamp,
          nonce,
          cid,
          ref,
          type: refType,
          gateId,
          usePayWall,
          payWallId,
        },
      });
    }
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: (1_000).microAlgos(),
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: (1_000).microAlgos(),
      note: '1'
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: (1_000).microAlgos(),
      note: '2'
    });

    await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });

    return { replyKey, timestamp, nonce };
  }

  // ============================================================================
  // WRITE METHODS - Vote Operations
  // ============================================================================

  /**
   * Vote on a post (upvote or downvote)
   * 
   * @param args - Vote arguments including reference and vote direction
   * 
   * Automatically calculates:
   * - MBR: votelist + potential tip delivery MBR (ARC-58/ARC-59) for upvotes
   * - Tip: reactFee in AKTA from DAO social fees
   */
  async vote({
    sender,
    signer,
    ref,
    refType,
    isUp,
  }: VoteArgs): Promise<void> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    // Fetch fees and assets from DAO
    const [socialFees, akitaAssets] = await Promise.all([
      this.getSocialFees(),
      this.getAkitaAssets(),
    ]);

    const mbrAmount = this.calculateVoteMBR(false);

    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrAmount),
      receiver: this.socialClient.appAddress,
    });

    const tipTxn = this.algorand.createTransaction.assetTransfer({
      ...sendParams,
      amount: socialFees.reactFee,
      assetId: akitaAssets.akta,
      receiver: this.socialClient.appAddress,
    });

    const group = this.socialClient.newGroup();

    group.vote({
      ...sendParams,
      args: {
        mbrPayment,
        tip: tipTxn,
        ref,
        type: refType,
        isUp,
      },
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: (1_000).microAlgos(),
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: (1_000).microAlgos(),
      note: '1'
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: (1_000).microAlgos(),
      note: '2'
    });

    await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
  }

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
  async invertVote({
    sender,
    signer,
    ref,
  }: InvertVoteArgs): Promise<void> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    // Fetch fees and assets from DAO
    const [socialFees, akitaAssets] = await Promise.all([
      this.getSocialFees(),
      this.getAkitaAssets(),
    ]);

    // No MBR for inverting, just the payment transaction structure
    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(0),
      receiver: this.socialClient.appAddress,
    });

    // Tip is required when inverting the vote
    const tipTxn = this.algorand.createTransaction.assetTransfer({
      ...sendParams,
      amount: socialFees.reactFee,
      assetId: akitaAssets.akta,
      receiver: this.socialClient.appAddress,
    });

    const group = this.socialClient.newGroup();

    group.editVote({
      ...sendParams,
      args: {
        mbrPayment,
        tip: tipTxn,
        ref,
        flip: true,
      },
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: (1_000).microAlgos(),
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: (1_000).microAlgos(),
      note: '1'
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: (1_000).microAlgos(),
      note: '2'
    });

    await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
  }

  /**
   * Delete an existing vote (undo the vote entirely)
   * 
   * @param args - Delete vote arguments including the post reference
   * 
   * Refunds the MBR for the vote box storage.
   */
  async deleteVote({
    sender,
    signer,
    ref,
  }: DeleteVoteArgs): Promise<void> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    // Fetch assets from DAO for the tip transaction structure
    const akitaAssets = await this.getAkitaAssets();

    // No MBR for deleting
    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(0),
      receiver: this.socialClient.appAddress,
    });

    // No tip required when deleting
    const tipTxn = this.algorand.createTransaction.assetTransfer({
      ...sendParams,
      amount: 0n,
      assetId: akitaAssets.akta,
      receiver: this.socialClient.appAddress,
    });

    const group = this.socialClient.newGroup();

    group.editVote({
      ...sendParams,
      args: {
        mbrPayment,
        tip: tipTxn,
        ref,
        flip: false,
      },
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: (1_000).microAlgos(),
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: (1_000).microAlgos(),
      note: '1'
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: (1_000).microAlgos(),
      note: '2'
    });

    await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
  }

  // ============================================================================
  // WRITE METHODS - Reaction Operations
  // ============================================================================

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
  async react({
    sender,
    signer,
    ref,
    refType,
    nft,
    gateTxn,
  }: ReactArgs): Promise<void> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    // Fetch fees and assets from DAO
    const [socialFees, akitaAssets] = await Promise.all([
      this.getSocialFees(),
      this.getAkitaAssets(),
    ]);

    // Assume first reaction with NFT for safety - caller can use calculateReactMBR() for precise amount
    const mbrAmount = this.calculateReactMBR(true, false);

    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrAmount),
      receiver: this.socialClient.appAddress,
    });

    const tipTxn = this.algorand.createTransaction.assetTransfer({
      ...sendParams,
      amount: socialFees.reactFee,
      assetId: akitaAssets.akta,
      receiver: this.socialClient.appAddress,
    });

    const group = this.socialClient.newGroup();

    if (gateTxn) {
      group.gatedReact({
        ...sendParams,
        args: {
          mbrPayment,
          tip: tipTxn,
          gateTxn,
          ref,
          type: refType,
          nft,
        },
      });
    } else {
      group.react({
        ...sendParams,
        args: {
          mbrPayment,
          tip: tipTxn,
          ref,
          type: refType,
          nft,
        },
      });
    }
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: (1_000).microAlgos(),
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: (1_000).microAlgos(),
      note: '1'
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: (1_000).microAlgos(),
      note: '2'
    });

    await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
  }

  /**
   * Delete a reaction from a post
   */
  async deleteReaction({
    sender,
    signer,
    ref,
    nft,
  }: MaybeSigner & { ref: PostRef; nft: bigint | number }): Promise<void> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    const group = this.socialClient.newGroup();

    group.deleteReaction({
      ...sendParams,
      args: { ref, nft },
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: (1_000).microAlgos(),
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: (1_000).microAlgos(),
      note: '1'
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: (1_000).microAlgos(),
      note: '2'
    });

    await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
  }

  // ============================================================================
  // READ METHODS - Reactions
  // ============================================================================

  /**
   * Get all reactions for a post
   * 
   * @param ref - The 32-byte post reference
   * @param userAddress - Optional user address to check which NFTs they've reacted with
   * @returns Object containing reactions array and set of NFT IDs the user has reacted with
   */
  async getPostReactions({
    ref,
    userAddress,
  }: {
    ref: PostRef;
    userAddress?: string;
  }): Promise<{ reactions: Array<{ nftId: bigint; count: bigint }>; userReactedNfts: Set<bigint> }> {
    const appId = this.socialAppId;
    const reactions: Array<{ nftId: bigint; count: bigint }> = [];
    const userReactedNfts = new Set<bigint>();

    try {
      // Get all boxes for the social app
      const boxesResponse = await this.algorand.client.algod.getApplicationBoxes(Number(appId)).do();
      
      // Reaction box prefix is 'r' (ASCII 114)
      const reactionPrefix = new Uint8Array([114]); // 'r'
      
      // Reaction list box prefix is 'e' (ASCII 101) - for checking user reactions
      const reactionListPrefix = new Uint8Array([101]); // 'e'
      
      // Process each box
      for (const box of boxesResponse.boxes) {
        const boxName = box.name;
        
        // Check if this is a reactions box (prefix 'r' + ref + NFT)
        // Box name should be: 1 byte prefix + 32 byte ref + 8 byte NFT = 41 bytes
        if (boxName.length === 41 && boxName[0] === reactionPrefix[0]) {
          // Extract the ref from bytes 1-33
          const boxRef = boxName.slice(1, 33);
          
          // Check if this box is for our post
          if (this.compareBytes(boxRef, ref)) {
            // Extract NFT ID from bytes 33-41 (8 bytes, big-endian uint64)
            const nftIdBytes = boxName.slice(33, 41);
            const nftId = this.bytesToBigInt(nftIdBytes);
            
            // Read the box value to get the count
            try {
              const boxValue = await this.algorand.client.algod.getApplicationBoxByName(Number(appId), boxName).do();
              const count = this.bytesToBigInt(boxValue.value);
              reactions.push({ nftId, count });
            } catch {
              // Box read failed, skip this reaction
            }
          }
        }
        
        // Check if user has reacted (if userAddress provided)
        // Reaction list box: 'e' + user (16 bytes) + ref (16 bytes) + NFT (8 bytes) = 41 bytes
        if (userAddress && boxName.length === 41 && boxName[0] === reactionListPrefix[0]) {
          // Extract user address bytes (first 16 bytes of address decoded)
          const userBytes = this.addressToBytes16(userAddress);
          const boxUserBytes = boxName.slice(1, 17);
          
          // Extract ref bytes (next 16 bytes - truncated ref)
          const boxRefBytes = boxName.slice(17, 33);
          const refFirst16 = ref.slice(0, 16);
          
          // Check if this is a reaction by our user on our post
          if (this.compareBytes(boxUserBytes, userBytes) && this.compareBytes(boxRefBytes, refFirst16)) {
            // Extract NFT ID from bytes 33-41
            const nftIdBytes = boxName.slice(33, 41);
            const nftId = this.bytesToBigInt(nftIdBytes);
            userReactedNfts.add(nftId);
          }
        }
      }
    } catch (error) {
      // If box reading fails entirely, return empty results
      console.error('Failed to fetch post reactions:', error);
    }

    return { reactions, userReactedNfts };
  }

  /**
   * Compare two Uint8Arrays for equality
   */
  private compareBytes(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  /**
   * Convert Uint8Array to bigint (big-endian)
   */
  private bytesToBigInt(bytes: Uint8Array): bigint {
    let result = 0n;
    for (const byte of bytes) {
      result = (result << 8n) | BigInt(byte);
    }
    return result;
  }

  /**
   * Convert address to first 16 bytes for reaction list lookup
   */
  private addressToBytes16(address: string): Uint8Array {
    const decoded = algosdk.decodeAddress(address);
    return decoded.publicKey.slice(0, 16);
  }

  // ============================================================================
  // WRITE METHODS - Graph Operations (follows/blocks)
  // ============================================================================

  /**
   * Follow a user
   * 
   * @param args - Follow arguments
   * 
   * Required MBR: Use calculateFollowMBR() to get the exact amount
   */
  async follow({
    sender,
    signer,
    address,
    gateTxn,
  }: FollowArgs): Promise<void> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    const mbrAmount = this.calculateFollowMBR();

    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrAmount),
      receiver: this.graphClient.appAddress,
    });

    if (gateTxn) {
      await this.graphClient.send.gatedFollow({
        ...sendParams,
        args: {
          mbrPayment,
          gateTxn,
          address,
        },
      });
    } else {
      await this.graphClient.send.follow({
        ...sendParams,
        args: {
          mbrPayment,
          address,
        },
      });
    }
  }

  /**
   * Unfollow a user
   */
  async unfollow({
    sender,
    signer,
    address,
  }: UnfollowArgs): Promise<void> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    await this.graphClient.send.unfollow({
      ...sendParams,
      args: { address },
    });
  }

  /**
   * Block a user
   * 
   * @param args - Block arguments
   * 
   * Required MBR: Use calculateBlockMBR() to get the exact amount
   */
  async block({
    sender,
    signer,
    address,
  }: BlockArgs): Promise<void> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    const mbrAmount = this.calculateBlockMBR();

    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrAmount),
      receiver: this.graphClient.appAddress,
    });

    await this.graphClient.send.block({
      ...sendParams,
      args: {
        mbrPayment,
        address,
      },
    });
  }

  /**
   * Unblock a user
   */
  async unblock({
    sender,
    signer,
    address,
  }: MaybeSigner & { address: string }): Promise<void> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    await this.graphClient.send.unblock({
      ...sendParams,
      args: { address },
    });
  }

  // ============================================================================
  // WRITE METHODS - PayWall Operations
  // ============================================================================

  /**
   * Create a paywall configuration
   * 
   * @param args - PayWall arguments with user and agent payment options
   * 
   * Required MBR: Use calculatePayWallMBR() to get the exact amount
   */
  async createPayWall({
    sender,
    signer,
    userPayInfo,
    agentPayInfo,
  }: CreatePayWallArgs): Promise<bigint> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    const mbrAmount = this.calculatePayWallMBR(userPayInfo.length, agentPayInfo.length);

    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrAmount),
      receiver: this.socialClient.appAddress,
    });

    // ViewPayWallValue expects tuples [type, assetOrSubId, amount][]
    const payWall: ViewPayWallValue = {
      userPayInfo: userPayInfo.map(opt => [
        opt.type,
        BigInt(opt.assetOrSubId),
        BigInt(opt.amount),
      ] as [number, bigint, bigint]),
      agentPayInfo: agentPayInfo.map(opt => [
        opt.type,
        BigInt(opt.assetOrSubId),
        BigInt(opt.amount),
      ] as [number, bigint, bigint]),
    };

    const result = await this.socialClient.send.createPayWall({
      ...sendParams,
      args: {
        mbrPayment,
        payWall,
      },
    });

    return result.return!;
  }

  // ============================================================================
  // WRITE METHODS - Moderation Operations (DAO-only)
  // ============================================================================

  /**
   * Add a moderator (requires DAO wallet sender)
   * 
   * Required MBR: Use calculateModeratorMBR() to get the exact amount
   */
  async addModerator({
    sender,
    signer,
    address,
  }: MaybeSigner & { address: string }): Promise<void> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    const mbrAmount = this.calculateModeratorMBR();

    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrAmount),
      receiver: this.moderationClient.appAddress,
    });

    await this.moderationClient.send.addModerator({
      ...sendParams,
      args: {
        mbrPayment,
        address,
      },
    });
  }

  /**
   * Remove a moderator (requires DAO wallet sender)
   */
  async removeModerator({
    sender,
    signer,
    address,
  }: MaybeSigner & { address: string }): Promise<void> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    await this.moderationClient.send.removeModerator({
      ...sendParams,
      args: { address },
    });
  }

  /**
   * Ban a user (requires moderator)
   * 
   * Required MBR: Use calculateBanMBR() to get the exact amount
   */
  async ban({
    sender,
    signer,
    address,
    expiration,
  }: MaybeSigner & { address: string; expiration: bigint | number }): Promise<void> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    const mbrAmount = this.calculateBanMBR();

    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrAmount),
      receiver: this.moderationClient.appAddress,
    });

    await this.moderationClient.send.ban({
      ...sendParams,
      args: {
        mbrPayment,
        address,
        expiration,
      },
    });
  }

  /**
   * Unban a user (requires moderator)
   */
  async unban({
    sender,
    signer,
    address,
  }: MaybeSigner & { address: string }): Promise<void> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    await this.moderationClient.send.unban({
      ...sendParams,
      args: { address },
    });
  }

  /**
   * Flag a post as against content policy (requires moderator)
   */
  async flagPost({
    sender,
    signer,
    ref,
  }: MaybeSigner & { ref: PostRef }): Promise<void> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    await this.moderationClient.send.flagPost({
      ...sendParams,
      args: { ref },
    });
  }

  /**
   * Unflag a post (requires moderator)
   */
  async unflagPost({
    sender,
    signer,
    ref,
  }: MaybeSigner & { ref: PostRef }): Promise<void> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    await this.moderationClient.send.unflagPost({
      ...sendParams,
      args: { ref },
    });
  }

  // ============================================================================
  // WRITE METHODS - Action Operations (DAO-only)
  // ============================================================================

  /**
   * Add a new action type (requires DAO wallet sender)
   * 
   * Required MBR: Use calculateActionMBR() to get the exact amount
   */
  async addAction({
    sender,
    signer,
    actionAppId,
    content,
  }: MaybeSigner & { actionAppId: bigint | number; content: Uint8Array }): Promise<void> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    const mbrAmount = this.calculateActionMBR();

    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrAmount),
      receiver: this.moderationClient.appAddress,
    });

    await this.moderationClient.send.addAction({
      ...sendParams,
      args: {
        mbrPayment,
        actionAppId,
        content,
      },
    });
  }

  /**
   * Remove an action type (requires DAO wallet sender)
   */
  async removeAction({
    sender,
    signer,
    actionAppId,
  }: MaybeSigner & { actionAppId: bigint | number }): Promise<void> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    await this.moderationClient.send.removeAction({
      ...sendParams,
      args: { actionAppId },
    });
  }
}

// Re-export the RefType enum for convenience
export { RefType };
