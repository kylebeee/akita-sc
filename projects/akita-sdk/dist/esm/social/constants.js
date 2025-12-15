/**
 * Social System MBR Constants (in microAlgos)
 * Base MBR formula: 2500 + (400 * (key_size + value_size))
 *
 * From contract constants.ts:
 * - BoxCostPerByte = 400
 */
// Box cost per byte (standard Algorand value)
export const BOX_COST_PER_BYTE = 400n;
// ============================================================================
// Social Contract MBR values (from contract)
// ============================================================================
/** Follows box MBR: 31,700 microAlgo */
export const FOLLOWS_MBR = 31700n;
/** Blocks box MBR: 15,700 microAlgo */
export const BLOCKS_MBR = 15700n;
/** Minimum posts box MBR: 40,100 microAlgo (add 400 * ref.length for total) */
export const MIN_POSTS_MBR = 40100n;
/** Minimum paywall MBR: 5,200 microAlgo */
export const MIN_PAYWALL_MBR = 5200n;
/** Votes box MBR: 19,300 microAlgo */
export const VOTES_MBR = 19300n;
/** Vote list box MBR: 19,300 microAlgo */
export const VOTELIST_MBR = 19300n;
/** Reactions box MBR: 22,100 microAlgo */
export const REACTIONS_MBR = 22100n;
/** Reaction list box MBR: 18,900 microAlgo */
export const REACTIONLIST_MBR = 18900n;
/** Meta box MBR: 45,300 microAlgo */
export const META_MBR = 45300n;
/** Moderators box MBR: 18,900 microAlgo */
export const MODERATORS_MBR = 18900n;
/** Banned box MBR: 18,900 microAlgo */
export const BANNED_MBR = 18900n;
/** Actions box MBR: 29,700 microAlgo */
export const ACTIONS_MBR = 29700n;
/** Amendment MBR (for marking original as amended): 13,200 microAlgo (400 * 33 = 'a' + nextEditKey) */
export const AMENDMENT_MBR = 13200n;
/** Edit back-reference MBR (for edit posts): 13,200 microAlgo (400 * 33 = 'e' + originalKey) */
export const EDIT_BACK_REF_MBR = 13200n;
/** PayWall pay option size: 17 bytes each */
export const PAYWALL_PAY_OPTION_SIZE = 17n;
// ============================================================================
// Impact Contract MBR values
// ============================================================================
/** Impact meta box MBR: 31,700 microAlgo */
export const IMPACT_META_MBR = 31700n;
/** Subscription state modifier MBR: 9,300 microAlgo */
export const SUBSCRIPTION_STATE_MODIFIER_MBR = 9300n;
// ============================================================================
// Calculated MBR for common operations
// ============================================================================
/**
 * Post MBR: posts + votes + votelist
 * = 40,100 + (400 * 36) + 19,300 + 19,300 = 93,100 microAlgo (for 36-byte CID)
 */
export const POST_BASE_MBR = MIN_POSTS_MBR + VOTES_MBR + VOTELIST_MBR;
/**
 * Reply MBR: Same as post (may need extra for empty post creation)
 */
export const REPLY_BASE_MBR = POST_BASE_MBR;
/**
 * Vote MBR: votelist only
 * For upvotes, additional payment needed for tip to creator
 */
export const VOTE_BASE_MBR = VOTELIST_MBR;
/**
 * React MBR: reactionlist (+ reactions if first reaction with this NFT)
 */
export const REACT_BASE_MBR = REACTIONLIST_MBR;
export const REACT_NEW_NFT_MBR = REACTIONLIST_MBR + REACTIONS_MBR;
// ============================================================================
// Time constants (matching contract)
// ============================================================================
export const ONE_DAY_SECONDS = 86400n;
export const ONE_WEEK_SECONDS = 604800n;
export const ONE_MONTH_SECONDS = 2592000n;
export const ONE_YEAR_SECONDS = 31536000n;
export const TWO_YEARS_SECONDS = 63072000n;
/** Maximum allowed drift for user-provided timestamps (60 seconds) */
export const MAX_TIMESTAMP_DRIFT_SECONDS = 60n;
// ============================================================================
// Content sizes
// ============================================================================
/** CID length (IPFS CIDv1) */
export const CID_LENGTH = 36;
/** Post reference length (32-byte hash) */
export const POST_REF_LENGTH = 32;
// ============================================================================
// RefType constants (matching contract)
// ============================================================================
export const REPLY_TYPE_POST = 10;
export const REPLY_TYPE_ASSET = 20;
export const REPLY_TYPE_ADDRESS = 30;
export const REPLY_TYPE_APP = 40;
export const REF_TYPE_EXTERNAL = 50;
// ============================================================================
// PostType constants (matching contract)
// ============================================================================
export const POST_TYPE_POST = 0; // Top-level post
export const POST_TYPE_REPLY = 1; // Reply/comment
export const POST_TYPE_EDIT_POST = 2; // Edit of a top-level post
export const POST_TYPE_EDIT_REPLY = 3; // Edit of a reply
// ============================================================================
// Tip action types
// ============================================================================
export const TIP_ACTION_POST = 10;
export const TIP_ACTION_REACT = 20;
// ============================================================================
// Tip send types
// ============================================================================
export const TIP_SEND_TYPE_DIRECT = 10;
export const TIP_SEND_TYPE_ARC59 = 20;
export const TIP_SEND_TYPE_ARC58 = 30;
//# sourceMappingURL=constants.js.map