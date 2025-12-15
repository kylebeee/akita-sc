import { MaybeSigner } from "../types";
import {
  EscrowArgs,
} from '../generated/EscrowClient';
import { EscrowFactoryArgs } from '../generated/EscrowFactoryClient';

// Factory Types
type FactoryContractArgs = EscrowFactoryArgs["obj"];

export type NewEscrowParams = MaybeSigner;

export type RegisterParams = MaybeSigner & Omit<
  FactoryContractArgs['register(pay,uint64)void'],
  'payment'
>;

export type DeleteEscrowParams = MaybeSigner & FactoryContractArgs['delete(uint64)void'];

export type ExistsParams = FactoryContractArgs['exists(address)bool'];

export type GetParams = FactoryContractArgs['get(address)byte[]'];

export type GetListParams = FactoryContractArgs['getList(address[])byte[][]'];

// Individual Escrow Types
type EscrowContractArgs = EscrowArgs["obj"];

export type RekeyParams = MaybeSigner & EscrowContractArgs['rekey(address)void'];

