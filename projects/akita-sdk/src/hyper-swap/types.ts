import { MaybeSigner } from "../types";
import {
  HyperSwapArgs,
} from '../generated/HyperSwapClient';

// HyperSwap Types
type ContractArgs = HyperSwapArgs["obj"];

export type OfferParams = MaybeSigner & Omit<
  ContractArgs['offer(pay,byte[32],uint64,byte[32],uint64,uint64)void'],
  'payment'
>;

export type AcceptParams = MaybeSigner & Omit<
  ContractArgs['accept(pay,uint64,byte[32][])void'],
  'mbrPayment'
>;

type BaseEscrowParams = MaybeSigner & {
  /** The offer ID */
  id: bigint | number;
  /** The receiver address */
  receiver: string;
  /** The amount to escrow */
  amount: bigint | number;
  /** Merkle proof */
  proof: Uint8Array[];
};

export type EscrowParams = BaseEscrowParams & (
  | {
      /** Whether escrowing ASA (true) or ALGO (false/undefined) */
      isAsa?: false;
    }
  | {
      /** Whether escrowing ASA (true) or ALGO (false/undefined) */
      isAsa: true;
      /** The asset ID to escrow (required when isAsa is true) */
      asset: bigint | number;
    }
);

export type DisburseParams = MaybeSigner & ContractArgs['disburse(uint64,uint64,address,uint64,uint64)void'];

export type CancelParams = MaybeSigner & ContractArgs['cancel(uint64,byte[32][])void'];

export type WithdrawParams = MaybeSigner & ContractArgs['withdraw(uint64,address,uint64,uint64,byte[32][])void'];

export type OptInParams = MaybeSigner & Omit<
  ContractArgs['optIn(pay,uint64)void'],
  'payment'
>;

export type GetOfferParams = {
  id: bigint | number;
};

// Offer states
export enum OfferState {
  Offered = 10,
  Escrowing = 20,
  Disbursing = 30,
  Completed = 40,
  Cancelled = 50,
  CancelCompleted = 60,
}

export type OfferValue = {
  state: number;
  root: Uint8Array;
  leaves: bigint;
  escrowed: bigint;
  participantsRoot: Uint8Array;
  participantsLeaves: bigint;
  acceptances: bigint;
  expiration: bigint;
};

export type HyperSwapMbrData = {
  offers: bigint;
  participants: bigint;
  hashes: bigint;
  mm: {
    root: bigint;
    data: bigint;
  };
};

