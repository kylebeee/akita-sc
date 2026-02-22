/**
 * New escrows require 6 extra transactions
 * 1 payment to the escrow factory
 * 1 'mint' app call to the escrow factory
 * 1 create application call from escrow factory
 * 1 payment to the new escrow to fund it
 * 1 'rekey' app call to the new escrow
 * 1 payment from the new escrow to rekey to the arc58 account
 */
export declare const NewEscrowFeeAmount: bigint;
