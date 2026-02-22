/**
 * Social System MBR Constants (in microAlgos)
 * Base MBR formula: 2500 + (400 * (key_size + value_size))
 *
 * From contract constants.ts:
 * - BoxCostPerByte = 400
 */
export declare const BOX_COST_PER_BYTE = 400n;
/** Follows box MBR: 31,700 microAlgo */
export declare const FOLLOWS_MBR = 31700n;
/** Blocks box MBR: 15,700 microAlgo */
export declare const BLOCKS_MBR = 15700n;
/** Minimum posts box MBR: 40,100 microAlgo (add 400 * ref.length for total) */
export declare const MIN_POSTS_MBR = 40100n;
/** Minimum paywall MBR: 5,200 microAlgo */
export declare const MIN_PAYWALL_MBR = 5200n;
/** Votes box MBR: 19,300 microAlgo */
export declare const VOTES_MBR = 19300n;
/** Vote list box MBR: 19,300 microAlgo */
export declare const VOTELIST_MBR = 19300n;
/** Reactions box MBR: 22,100 microAlgo */
export declare const REACTIONS_MBR = 22100n;
/** Reaction list box MBR: 18,900 microAlgo */
export declare const REACTIONLIST_MBR = 18900n;
/** Meta box MBR: 45,300 microAlgo */
export declare const META_MBR = 45300n;
/** Moderators box MBR: 18,900 microAlgo */
export declare const MODERATORS_MBR = 18900n;
/** Banned box MBR: 18,900 microAlgo */
export declare const BANNED_MBR = 18900n;
/** Actions box MBR: 29,700 microAlgo */
export declare const ACTIONS_MBR = 29700n;
/** Amendment MBR (for marking original as amended): 13,200 microAlgo (400 * 33 = 'a' + nextEditKey) */
export declare const AMENDMENT_MBR = 13200n;
/** Edit back-reference MBR (for edit posts): 13,200 microAlgo (400 * 33 = 'e' + originalKey) */
export declare const EDIT_BACK_REF_MBR = 13200n;
/** PayWall pay option size: 17 bytes each */
export declare const PAYWALL_PAY_OPTION_SIZE = 17n;
/** Impact meta box MBR: 31,700 microAlgo */
export declare const IMPACT_META_MBR = 31700n;
/** Subscription state modifier MBR: 9,300 microAlgo */
export declare const SUBSCRIPTION_STATE_MODIFIER_MBR = 9300n;
/**
 * Post MBR: posts + votes + votelist
 * = 40,100 + (400 * 36) + 19,300 + 19,300 = 93,100 microAlgo (for 36-byte CID)
 */
export declare const POST_BASE_MBR: bigint;
/**
 * Reply MBR: Same as post (may need extra for empty post creation)
 */
export declare const REPLY_BASE_MBR: bigint;
/**
 * Vote MBR: votelist only
 * For upvotes, additional payment needed for tip to creator
 */
export declare const VOTE_BASE_MBR = 19300n;
/**
 * React MBR: reactionlist (+ reactions if first reaction with this NFT)
 */
export declare const REACT_BASE_MBR = 18900n;
export declare const REACT_NEW_NFT_MBR: bigint;
export declare const ONE_DAY_SECONDS = 86400n;
export declare const ONE_WEEK_SECONDS = 604800n;
export declare const ONE_MONTH_SECONDS = 2592000n;
export declare const ONE_YEAR_SECONDS = 31536000n;
export declare const TWO_YEARS_SECONDS = 63072000n;
/** Maximum allowed drift for user-provided timestamps (60 seconds) */
export declare const MAX_TIMESTAMP_DRIFT_SECONDS = 60n;
/** CID length (IPFS CIDv1) */
export declare const CID_LENGTH = 36;
/** Post reference length (32-byte hash) */
export declare const POST_REF_LENGTH = 32;
export declare const REPLY_TYPE_POST = 10;
export declare const REPLY_TYPE_ASSET = 20;
export declare const REPLY_TYPE_ADDRESS = 30;
export declare const REPLY_TYPE_APP = 40;
export declare const REF_TYPE_EXTERNAL = 50;
export declare const POST_TYPE_POST = 0;
export declare const POST_TYPE_REPLY = 1;
export declare const POST_TYPE_EDIT_POST = 2;
export declare const POST_TYPE_EDIT_REPLY = 3;
export declare const TIP_ACTION_POST = 10;
export declare const TIP_ACTION_REACT = 20;
export declare const TIP_SEND_TYPE_DIRECT = 10;
export declare const TIP_SEND_TYPE_ARC59 = 20;
export declare const TIP_SEND_TYPE_ARC58 = 30;
