"use strict";
/**
 * Social System MBR Constants (in microAlgos)
 * Base MBR formula: 2500 + (400 * (key_size + value_size))
 *
 * From contract constants.ts:
 * - BoxCostPerByte = 400
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIP_SEND_TYPE_ARC58 = exports.TIP_SEND_TYPE_ARC59 = exports.TIP_SEND_TYPE_DIRECT = exports.TIP_ACTION_REACT = exports.TIP_ACTION_POST = exports.POST_TYPE_EDIT_REPLY = exports.POST_TYPE_EDIT_POST = exports.POST_TYPE_REPLY = exports.POST_TYPE_POST = exports.REF_TYPE_EXTERNAL = exports.REPLY_TYPE_APP = exports.REPLY_TYPE_ADDRESS = exports.REPLY_TYPE_ASSET = exports.REPLY_TYPE_POST = exports.POST_REF_LENGTH = exports.CID_LENGTH = exports.MAX_TIMESTAMP_DRIFT_SECONDS = exports.TWO_YEARS_SECONDS = exports.ONE_YEAR_SECONDS = exports.ONE_MONTH_SECONDS = exports.ONE_WEEK_SECONDS = exports.ONE_DAY_SECONDS = exports.REACT_NEW_NFT_MBR = exports.REACT_BASE_MBR = exports.VOTE_BASE_MBR = exports.REPLY_BASE_MBR = exports.POST_BASE_MBR = exports.SUBSCRIPTION_STATE_MODIFIER_MBR = exports.IMPACT_META_MBR = exports.PAYWALL_PAY_OPTION_SIZE = exports.EDIT_BACK_REF_MBR = exports.AMENDMENT_MBR = exports.ACTIONS_MBR = exports.BANNED_MBR = exports.MODERATORS_MBR = exports.META_MBR = exports.REACTIONLIST_MBR = exports.REACTIONS_MBR = exports.VOTELIST_MBR = exports.VOTES_MBR = exports.MIN_PAYWALL_MBR = exports.MIN_POSTS_MBR = exports.BLOCKS_MBR = exports.FOLLOWS_MBR = exports.BOX_COST_PER_BYTE = void 0;
// Box cost per byte (standard Algorand value)
exports.BOX_COST_PER_BYTE = 400n;
// ============================================================================
// Social Contract MBR values (from contract)
// ============================================================================
/** Follows box MBR: 31,700 microAlgo */
exports.FOLLOWS_MBR = 31700n;
/** Blocks box MBR: 15,700 microAlgo */
exports.BLOCKS_MBR = 15700n;
/** Minimum posts box MBR: 40,100 microAlgo (add 400 * ref.length for total) */
exports.MIN_POSTS_MBR = 40100n;
/** Minimum paywall MBR: 5,200 microAlgo */
exports.MIN_PAYWALL_MBR = 5200n;
/** Votes box MBR: 19,300 microAlgo */
exports.VOTES_MBR = 19300n;
/** Vote list box MBR: 19,300 microAlgo */
exports.VOTELIST_MBR = 19300n;
/** Reactions box MBR: 22,100 microAlgo */
exports.REACTIONS_MBR = 22100n;
/** Reaction list box MBR: 18,900 microAlgo */
exports.REACTIONLIST_MBR = 18900n;
/** Meta box MBR: 45,300 microAlgo */
exports.META_MBR = 45300n;
/** Moderators box MBR: 18,900 microAlgo */
exports.MODERATORS_MBR = 18900n;
/** Banned box MBR: 18,900 microAlgo */
exports.BANNED_MBR = 18900n;
/** Actions box MBR: 29,700 microAlgo */
exports.ACTIONS_MBR = 29700n;
/** Amendment MBR (for marking original as amended): 13,200 microAlgo (400 * 33 = 'a' + nextEditKey) */
exports.AMENDMENT_MBR = 13200n;
/** Edit back-reference MBR (for edit posts): 13,200 microAlgo (400 * 33 = 'e' + originalKey) */
exports.EDIT_BACK_REF_MBR = 13200n;
/** PayWall pay option size: 17 bytes each */
exports.PAYWALL_PAY_OPTION_SIZE = 17n;
// ============================================================================
// Impact Contract MBR values
// ============================================================================
/** Impact meta box MBR: 31,700 microAlgo */
exports.IMPACT_META_MBR = 31700n;
/** Subscription state modifier MBR: 9,300 microAlgo */
exports.SUBSCRIPTION_STATE_MODIFIER_MBR = 9300n;
// ============================================================================
// Calculated MBR for common operations
// ============================================================================
/**
 * Post MBR: posts + votes + votelist
 * = 40,100 + (400 * 36) + 19,300 + 19,300 = 93,100 microAlgo (for 36-byte CID)
 */
exports.POST_BASE_MBR = exports.MIN_POSTS_MBR + exports.VOTES_MBR + exports.VOTELIST_MBR;
/**
 * Reply MBR: Same as post (may need extra for empty post creation)
 */
exports.REPLY_BASE_MBR = exports.POST_BASE_MBR;
/**
 * Vote MBR: votelist only
 * For upvotes, additional payment needed for tip to creator
 */
exports.VOTE_BASE_MBR = exports.VOTELIST_MBR;
/**
 * React MBR: reactionlist (+ reactions if first reaction with this NFT)
 */
exports.REACT_BASE_MBR = exports.REACTIONLIST_MBR;
exports.REACT_NEW_NFT_MBR = exports.REACTIONLIST_MBR + exports.REACTIONS_MBR;
// ============================================================================
// Time constants (matching contract)
// ============================================================================
exports.ONE_DAY_SECONDS = 86400n;
exports.ONE_WEEK_SECONDS = 604800n;
exports.ONE_MONTH_SECONDS = 2592000n;
exports.ONE_YEAR_SECONDS = 31536000n;
exports.TWO_YEARS_SECONDS = 63072000n;
/** Maximum allowed drift for user-provided timestamps (60 seconds) */
exports.MAX_TIMESTAMP_DRIFT_SECONDS = 60n;
// ============================================================================
// Content sizes
// ============================================================================
/** CID length (IPFS CIDv1) */
exports.CID_LENGTH = 36;
/** Post reference length (32-byte hash) */
exports.POST_REF_LENGTH = 32;
// ============================================================================
// RefType constants (matching contract)
// ============================================================================
exports.REPLY_TYPE_POST = 10;
exports.REPLY_TYPE_ASSET = 20;
exports.REPLY_TYPE_ADDRESS = 30;
exports.REPLY_TYPE_APP = 40;
exports.REF_TYPE_EXTERNAL = 50;
// ============================================================================
// PostType constants (matching contract)
// ============================================================================
exports.POST_TYPE_POST = 0; // Top-level post
exports.POST_TYPE_REPLY = 1; // Reply/comment
exports.POST_TYPE_EDIT_POST = 2; // Edit of a top-level post
exports.POST_TYPE_EDIT_REPLY = 3; // Edit of a reply
// ============================================================================
// Tip action types
// ============================================================================
exports.TIP_ACTION_POST = 10;
exports.TIP_ACTION_REACT = 20;
// ============================================================================
// Tip send types
// ============================================================================
exports.TIP_SEND_TYPE_DIRECT = 10;
exports.TIP_SEND_TYPE_ARC59 = 20;
exports.TIP_SEND_TYPE_ARC58 = 30;
//# sourceMappingURL=constants.js.map