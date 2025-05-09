import { classes } from "polytype";
import { ServiceFactoryContract } from "../utils/base-contracts/factory";
import { ContractWithOptIn } from "../utils/base-contracts/optin";
import { BasePool } from "./base";

export class PoolFactory extends classes(ServiceFactoryContract, ContractWithOptIn, BasePool) {
    
}
  