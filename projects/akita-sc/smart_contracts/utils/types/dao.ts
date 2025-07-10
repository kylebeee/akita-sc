import { bytes, Contract, Global, gtxn, op, uint64 } from "@algorandfoundation/algorand-typescript";
import { AkitaDAOState, ExecutionKey, Fees, ProposalAction, ProposalSettings, ProposalStatus } from "../../dao/types";
import { Address } from "@algorandfoundation/algorand-typescript/arc4";
import { CID } from "./base";
import { FundsRequest } from "../../arc58/account/types";

export class AkitaDAOInterface extends Contract {
  create(escrowFactory: uint64): void { }
  update(proposalID: uint64): void { }
  init(
    version: string,
    akta: uint64,
    contentPolicy: CID,
    minRewardsImpact: uint64,
    fees: Fees,
    proposalSettings: {
      creation: ProposalSettings,
      participation: ProposalSettings,
      approval: ProposalSettings,
      duration: ProposalSettings,
    },
    revocationAddress: Address
  ): void { }
  arc58_verifyAuthAddr(): void { }
  arc58_canCall(
    plugin: uint64,
    global: boolean,
    address: Address,
    method: bytes<4>
  ): boolean { return false; }
  arc58_rekeyToPlugin(
    plugin: uint64,
    global: boolean,
    methodOffsets: uint64[],
    fundsRequest: FundsRequest[]
  ): void { }
  arc58_rekeyToNamedPlugin(name: string, global: boolean, methodOffsets: uint64[], fundsRequest: FundsRequest[]): void { }
  newProposal(
    payment: gtxn.PaymentTxn,
    action: ProposalAction,
    cid: CID,
    data: bytes,
    status: ProposalStatus,
  ): void { }
  finalizeProposal(proposalID: uint64, args: bytes): void { }
  createDailyDisbursement(): void { }
  arc58_pluginOptinEscrow(
    plugin: uint64,
    caller: Address,
    assets: uint64[],
    mbrPayment: gtxn.PaymentTxn
  ): void { }
  optinReceiveEscrow(payment: gtxn.PaymentTxn, name: string, asset: uint64): void { }
  startEscrowDisbursement(escrow: string): void { }
  processEscrowAllocation(escrow: string, ids: uint64[]): void { }
  getState(): AkitaDAOState {
    return {
      status: 0,
      version: '',
      contentPolicy: op.bzero(36).toFixed({ length: 36 }),
      minRewardsImpact: 0,
      akitaAppList: {
        staking: 0,
        rewards: 0,
        pool: 0,
        prizeBox: 0,
        subscriptions: 0,
        gate: 0,
        auction: 0,
        hyperSwap: 0,
        raffle: 0,
        metaMerkles: 0,
        marketplace: 0,
        akitaNFD: 0
      },
      otherAppList: {
        vrfBeacon: 0,
        nfdRegistry: 0,
        assetInbox: 0
      },
      socialFees: {
        postFee: 0,
        reactFee: 0,
        impactTaxMin: 0,
        impactTaxMax: 0
      },
      stakingFees: {
        creationFee: 0,
        impactTaxMin: 0,
        impactTaxMax: 0
      },
      subscriptionFees: {
        serviceCreationFee: 0,
        paymentPercentage: 0,
        triggerPercentage: 0
      },
      nftFees: {
        marketplaceSalePercentageMin: 0, // the minimum percentage to take on an NFT sale based on user impact
        marketplaceSalePercentageMax: 0, // the maximum percentage to take on an NFT sale based on user impact
        marketplaceComposablePercentage: 0, // the percentage each side of the composable marketplace takes on an NFT sale
        marketplaceRoyaltyDefaultPercentage: 0,
        shuffleSalePercentage: 0, // the nft shuffle sale % fee
        omnigemSaleFee: 0, // omnigem sale fee
        auctionCreationFee: 0,
        auctionSaleImpactTaxMin: 0, // the minimum percentage to take on an NFT auction based on user impact
        auctionSaleImpactTaxMax: 0, // the maximum percentage to take on an NFT auction based on user impact
        auctionComposablePercentage: 0, // the percentage each side of the composable auction takes on an NFT sale
        auctionRafflePercentage: 0,
        raffleCreationFee: 0,
        raffleSaleImpactTaxMin: 0,
        raffleSaleImpactTaxMax: 0,
        raffleComposablePercentage: 0
      },
      krbyPercentage: 0,
      moderatorPercentage: 0,
      akitaAssets: {
        akta: 0,
        bones: 0,
      },
      proposalSettings: {
        creation: {
          upgradeApp: 0,
          addPlugin: 0,
          removePlugin: 0,
          addAllowance: 0,
          removeAllowance: 0,
          updateField: 0
        },
        participation: {
          upgradeApp: 0,
          addPlugin: 0,
          removePlugin: 0,
          addAllowance: 0,
          removeAllowance: 0,
          updateField: 0
        },
        approval: {
          upgradeApp: 0,
          addPlugin: 0,
          removePlugin: 0,
          addAllowance: 0,
          removeAllowance: 0,
          updateField: 0
        },
        duration: {
          upgradeApp: 0,
          addPlugin: 0,
          removePlugin: 0,
          addAllowance: 0,
          removeAllowance: 0,
          updateField: 0
        },
      },
      revocationAddress: new Address(Global.zeroAddress)
    }
  }
}