import { AlgorandClient } from "@algorandfoundation/algokit-utils";
import crypto from "crypto";

export class TimeWarp {
  public algorand: AlgorandClient;

  constructor(algorand: AlgorandClient) {
    this.algorand = algorand;
  }

  private async getLastRound(): Promise<bigint> {
    return (await this.algorand.client.algod.status().do()).lastRound;
  }

  private async getLatestTimestamp(): Promise<bigint> {
    const lastRound = await this.getLastRound();
    const block = await this.algorand.client.algod.block(lastRound).do();
    return block.block.header.timestamp;
  }

  async roundWarp(rounds: bigint = 0n): Promise<void> {
    this.algorand.setSuggestedParamsCacheTimeout(0);
    const dispenser = await this.algorand.account.dispenserFromEnvironment();
    let nRounds;
    if (rounds !== 0n) {
      const lastRound = await this.getLastRound();

      if (rounds < lastRound) {
        throw new Error(`Cannot warp to the past: ${rounds} < ${lastRound}`);
      }

      nRounds = rounds - lastRound;
    } else {
      nRounds = 1;
    }

    for (let i = 0; i < nRounds; i++) {
      await this.algorand.send.payment({
        sender: dispenser.addr,
        signer: dispenser.signer,
        receiver: dispenser.addr,
        amount: (0).microAlgo(),
        // adding a random note to avoid transaction duplicates
        note: new Uint8Array(crypto.randomBytes(16)),
      });
    }
  }

  async timeWarp(seconds: bigint): Promise<void> {
    const ts = (await this.getLatestTimestamp()) + seconds;
    this.algorand.setSuggestedParamsCacheTimeout(0);
    const current = await this.getLatestTimestamp();
    await this.algorand.client.algod.setBlockOffsetTimestamp(ts - current).do();
    await this.roundWarp();
    await this.algorand.client.algod.setBlockOffsetTimestamp(0).do();
  }
}