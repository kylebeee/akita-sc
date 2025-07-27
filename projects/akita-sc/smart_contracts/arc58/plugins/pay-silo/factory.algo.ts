import { Application, uint64, Contract } from "@algorandfoundation/algorand-typescript";
import { Address, compileArc4 } from "@algorandfoundation/algorand-typescript/arc4";
import { getSpendingAccount, rekeyAddress } from "../../../utils/functions";
import { PaySiloPlugin } from "./contract.algo";

// OKAY SO THIS IS THE PLAN

// 1. mint DAO contract
// 2. 'setup' the DAO so we can use its arc58 wallet
// 3. install pay silo factory plugin to the DAO ( with execution keys )
// 4. mint the pay silo plugin to krby
// 5. install the pay silo plugin to the DAO for krby escrow
// 6. now any funds dumped into the pay silo plugin can b

export class PaySiloFactoryPlugin extends Contract {

  mint(
    walletID: uint64,
    rekeyBack: boolean,
    recipient: Address
  ): uint64 {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const paySilo = compileArc4(PaySiloPlugin)

    const result = paySilo.call.create({
      sender,
      args: [recipient],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })

    return result.itxn.createdApp.id
  }
}
