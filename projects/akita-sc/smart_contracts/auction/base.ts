
import { Contract } from "@algorandfoundation/algorand-typescript";
import { AuctionMBRData } from "./types";

export class BaseAuction extends Contract {
  protected mbr(): AuctionMBRData {
    return {
      bids: 34_900,
      weights: 13_113_300,
      bidsByAddress: 18_500,
      locations: 18_900,
    }
  }
}