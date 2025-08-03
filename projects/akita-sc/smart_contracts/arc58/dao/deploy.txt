// Step by step plans for the DAO setup

// dao contract prerequisites:
// arc58 factory, escrow factory, pay silo factory, optin plugin
// staking, rewards, pool

// 1. mint DAO contract
// 2. 'setup' the DAO so we can use its arc58 wallet
// 3. 'newEscrow' proposal to create the krby escrow account
// 4. install the optin plugin for krby escrow
// 4. 'newEscrow' proposal to create the mod escrow account
// 5. 'newEscrow' proposal to create the gov escrow account
// 4. install pay silo factory plugin to the DAO ( with execution keys )


// how could we manage to payout mods & governors through the staking pool system without tracking it in the DAO contract?
// 1. `newEscrow` proposal to create the escrow for mods
// 2. `newPool` & `addReward` proposal to create the staking pool for mods
// 2. `paySilo` plugin for making it so all the mod escrow can do are send funds to staking pool?

// so this works because: the pay silo plugin restricts the mod escrow's functionality to only be able to send funds to the staking pool, ensuring that all payouts are managed through the staking system without needing to track individual payouts in the DAO contract.