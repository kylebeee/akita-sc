
import { abimethod, Contract } from "@algorandfoundation/algorand-typescript";
import { AuctionMBRBids, AuctionMBRBidsByAddress, AuctionMBRLocations, AuctionMBRWeights } from "./constants";
import { AuctionMBRData } from "./types";

export class BaseAuction extends Contract {
  @abimethod({ readonly: true })
  mbr(): AuctionMBRData {
    return {
      bids: AuctionMBRBids,
      weights: AuctionMBRWeights,
      bidsByAddress: AuctionMBRBidsByAddress,
      locations: AuctionMBRLocations,
    }
  }
}