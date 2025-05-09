import { bytes, Contract, uint64 } from "@algorandfoundation/algorand-typescript";
import { Address } from "@algorandfoundation/algorand-typescript/arc4";


export class DualStake extends Contract {
    /**
     * Fee admin method to send keyreg online for an escrow account
     *
     * @param selection_key
     * @param voting_key
     * @param sp_key
     * @param first_round
     * @param last_round
     * @param key_dilution
     *
     */
    register_online(
        selection_key: bytes,
        voting_key: bytes,
        sp_key: bytes,
        first_round: uint64,
        last_round: uint64,
        key_dilution: uint64
    ): void {}

    /**
     * Fee admin method to send keyreg offline for an escrow account
     *
     * @param address
     *
     */
    register_offline(address: Address): void {}

    /**
     * Admin method to init storage. this will be needed as I am reusing an existing app
     *
     */
    init_storage(): void {}

    /**
     *
     * @param amt
     *
     */
    withdraw_platform_fees(amt: uint64): void {}

    /**
     * Public method. Mint dualSTAKE lst
     * previous transaction in group must be payment in ALGO if rate != 0, 2 txns before must be payment in ASA if must_swap, swap send dualSTAKE to caller
     *
     */
    mint(): void {}

    burn(): void {}

    /**
     * Public empty method for opcode budget increase
     *
     */
    nullun(): void {}

    create_asset(lst_asa_name: bytes, lst_unit_name: bytes): void {}

    configure(
        lst_asa_name: bytes,
        lst_unit_name: bytes,
        asa_id: uint64,
        lp_type: bytes,
        lp_id: bytes,
        platform_fee_bps: uint64,
        noderunner_fee_bps: uint64,
        admin_addr: Address,
        noderunner_addr: Address
    ): void {}

    change_admin_1(new_admin: Address): void {}

    change_admin_2(): void {}

    change_noderunner(new_noderunner: Address): void {}

    change_feeaddr(new_feeaddr: Address): void {}
}
