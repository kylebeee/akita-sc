import { classes } from "polytype";
import { ServiceFactoryContract } from "../../utils/base_contracts/factory.algo";
import { ContractWithOptIn } from "../../utils/base_contracts/optin.algo";
import { BasePool } from "./base.algo";

export class PoolFactory extends classes(ServiceFactoryContract, ContractWithOptIn, BasePool) {
    
}
  