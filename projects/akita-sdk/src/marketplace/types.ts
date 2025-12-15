import { MaybeSigner } from "../types";
import {
  MarketplaceArgs,
} from '../generated/MarketplaceClient';
import {
  ListingArgs,
  FunderInfo,
} from '../generated/ListingClient';
import { AppCallMethodCall } from "@algorandfoundation/algokit-utils/types/composer";

// Re-export types from generated clients for convenience
export { FunderInfo };

// Factory/Marketplace Types
type MarketplaceContractArgs = MarketplaceArgs["obj"];

type BaseListParams = MaybeSigner & {
  /** The price for the listing */
  price: bigint | number;
  /** The payment asset ID (0 for ALGO) */
  paymentAsset: bigint | number;
  /** Optional expiration timestamp */
  expiration: bigint | number;
  /** Optional address to reserve listing for */
  reservedFor: string;
  /** Gate app ID for gated listings (0 for none) */
  gateId: bigint | number;
  /** Marketplace address for royalties */
  marketplace: string;
};

export type ListParams = BaseListParams & (
  | {
      /** Whether listing a PrizeBox */
      isPrizeBox: true;
      /** The PrizeBox app ID */
      prizeId: bigint | number;
    }
  | {
      /** Whether listing a PrizeBox */
      isPrizeBox?: false;
      /** The asset ID to list */
      asset: bigint | number;
      /** The amount of the asset to list */
      amount: bigint | number;
      /** Name of the asset for royalties */
      name: string;
      /** Merkle proof for royalties */
      proof: Uint8Array[];
    }
);

type BasePurchaseParams = MaybeSigner & {
  /** The listing app ID */
  listingAppId: bigint | number;
  /** Marketplace address for referrals */
  marketplace: string;
  /** Optional gate transaction for gated listings */
  gateTxn?: AppCallMethodCall;
};

export type PurchaseParams = BasePurchaseParams & (
  | {
      /** Whether paying with ASA (true) or ALGO (false/undefined) */
      isAsa?: false;
    }
  | {
      /** Whether paying with ASA (true) or ALGO (false/undefined) */
      isAsa: true;
      /** The payment asset ID (required when isAsa is true) */
      paymentAsset: bigint | number;
      /** The payment amount (required when isAsa is true) */
      paymentAmount: bigint | number;
    }
);

export type DelistParams = MaybeSigner & MarketplaceContractArgs['delist(uint64)void'];

// Individual Listing Types
type ListingContractArgs = ListingArgs["obj"];

export type ChangePriceParams = MaybeSigner & ListingContractArgs['changePrice(uint64)void'];

export type ListingState = {
  prize: bigint;
  isPrizeBox: boolean;
  price: bigint;
  paymentAsset: bigint;
  expiration: bigint;
  seller: string;
  reservedFor: string;
  creatorRoyalty: bigint;
  gateId: bigint;
  marketplace: string;
  marketplaceRoyalties: bigint;
};

