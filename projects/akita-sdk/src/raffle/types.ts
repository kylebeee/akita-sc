import { MaybeSigner } from "../types";
import {
  RaffleArgs,
  RaffleState,
  EntryData,
  FunderInfo,
} from '../generated/RaffleClient';
import { RaffleFactoryArgs } from '../generated/RaffleFactoryClient';

// Re-export types from generated clients for convenience
export { RaffleState, EntryData, FunderInfo };

/**
 * Entry data combined with the ticket count from the weights boxmap.
 * This provides a convenient way to get all entry information in one call.
 */
export type EntryWithTickets = EntryData & {
  /** The entry ID (index) in the raffle */
  entryId: bigint;
  /** The number of tickets (weight) this entry has */
  ticketCount: bigint;
};

// Factory Types
type FactoryContractArgs = RaffleFactoryArgs["obj"];

export type NewRaffleParams = MaybeSigner & Omit<
  FactoryContractArgs['newRaffle(pay,axfer,uint64,uint64,uint64,uint64,uint64,uint64,address,string,byte[32][],uint64)uint64'],
  'payment' | 'assetXfer'
> & {
  /** The asset ID to transfer as the prize */
  prizeAsset: bigint | number;
  /** The amount of the prize asset to transfer */
  prizeAmount: bigint | number;
};

export type NewPrizeBoxRaffleParams = MaybeSigner & Omit<
  FactoryContractArgs['newPrizeBoxRaffle(pay,uint64,uint64,uint64,uint64,uint64,uint64,uint64,address,uint64)uint64'],
  'payment'
>;

export type DeleteRaffleParams = MaybeSigner & FactoryContractArgs['deleteRaffle(uint64)void'];

// Individual Raffle Types
type RaffleContractArgs = RaffleArgs["obj"];

export type InitRaffleParams = MaybeSigner & Omit<
  RaffleContractArgs['init(pay,uint64)void'],
  'payment'
>;

type BaseEnterParams = MaybeSigner & {
  /** The amount of tickets to enter with */
  amount: bigint | number;
  /** Marketplace address for referrals */
  marketplace: string;
  /** Optional merkle proofs for gated raffles */
  proofs?: Uint8Array[];
};

export type EnterParams = BaseEnterParams & (
  | {
      /** Whether paying with ASA (true) or ALGO (false/undefined) */
      isAsa?: false;
    }
  | {
      /** Whether paying with ASA (true) or ALGO (false/undefined) */
      isAsa: true;
      /** The ticket asset ID (required when isAsa is true) */
      ticketAsset: bigint | number;
    }
);

type BaseAddParams = MaybeSigner & {
  /** Additional tickets to add */
  amount: bigint | number;
  /** Optional merkle proofs for gated raffles */
  proofs?: Uint8Array[];
};

export type AddParams = BaseAddParams & (
  | {
      /** Whether paying with ASA (true) or ALGO (false/undefined) */
      isAsa?: false;
    }
  | {
      /** Whether paying with ASA (true) or ALGO (false/undefined) */
      isAsa: true;
      /** The ticket asset ID (required when isAsa is true) */
      ticketAsset: bigint | number;
    }
);

export type RefundMBRParams = MaybeSigner & RaffleContractArgs['refundMBR(uint64)void'];

export type FindWinnerParams = MaybeSigner & RaffleContractArgs['findWinner(uint64)void'];

export type ClaimPrizeParams = MaybeSigner;

export type ClearWeightsBoxesParams = MaybeSigner;

export type RaffleParams = MaybeSigner;

export type GetEntryParams = {
  /** The entry ID to look up */
  entryId: bigint | number;
};

export type IsEnteredParams = {
  /** The address to check */
  address: string;
};

export type GetEntryByAddressParams = {
  /** The address to look up */
  address: string;
};

export type GetEntryWithTicketsParams = {
  /** The entry ID to look up */
  entryId: bigint | number;
};

export type GetEntryWithTicketsByAddressParams = {
  /** The address to look up */
  address: string;
};

export type RaffleMbrData = {
  entries: bigint;
  weights: bigint;
  entriesByAddress: bigint;
};


