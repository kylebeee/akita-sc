# Akita Contracts

This repo is a central repository for all of Akita's main contracts

## Abstracted Account
[The Abstracted Account Factory](./contracts/arc58/abstracted_account_factory.algo.ts) is the factory contract for producing new Abstracted Accounts, thus all have the same creator address.

[The Abstracted Account Wallet](./contracts/arc58/abstracted_account.algo.ts) is the entry point for the Akita ecosystem. It allows us to bring the web3 experience up to par with the convenience of web2 while maintaining self-sovereignty.

## Keys
Contracts for key management of delegation for the abstracted account. We support 

[The Secp256r1 Passkey Logic Signature](./contracts/keys/secp256r1_passkey.algo.ts) account is a passkey approval smart signature account. Typically within our systems we use these as admin or access keys for the abstracted account.

## Plugins

[The Akita Social plugin](./contracts/arc58/plugins/akita_social.algo.ts) is the core plugin for the akita social protocol.

[The Hyper Swap Plugin](./contracts/arc58/plugins/hyper_swap.algo.ts) is a merkle tree based escrow/swap contract boasting artificial atomicity with practically unbounded list lengths.

[The NFD Plugin](./contracts/arc58/plugins/nfd.algo.ts) is a plugin for managing your NFDs

[The OptIn plugin](./contracts/arc58/plugins/optin.algo.ts) is a plugin that allows anyone to opt the abstracted account into an asset, provided they pay for the MBR.

[The Staking Plugin](./contracts/arc58/plugins/staking.algo.ts) is a universal time staking plugin supporting with and without locks.

[The Subscription plugin](./contracts/arc58/plugins/subscription.algo.ts) is a plugin that allows someone to set up a recurring payment from the abstracted account.

## DAO

[The Akita DAO](./contracts/dao/dao.algo.ts) is the DAO controlling the distribution of $BONES as well as managing Akita Social & default revocation app for ARC58 based Akita Wallets.

## Gates

[The Main gate](./contracts//gates/gate.algo.ts) is the entrypoint contract for interacting with all other gates.

[The Asset gate](./contracts/gates/asset.algo.ts) is a child contract for filtering interactions by ASA.

[The Follower Count gate](./contracts/gates/follower.algo.ts) is a child contract for filtering interactions based on follower count within the Akita social protocol.

[The Follower Index gate](./contracts/gates/follower_index.algo.ts) is a child contract for filtering interactions based on follower index within the Akita social protocol.

[The Impact gate](./contracts/gates/impact.algo.ts) is a child contract for filtering interactions by a users impact score within the Akita social protocol.

[The Merkle Address gate](./contracts/gates/merkle_address.algo.ts) is a child contract for filtering interactions by a Meta Merkle list of Addresses.

[The Merkle Asset gate](./contracts/gates/merkle_asset.algo.ts) is a child contract for filtering interactions by a Meta Merkle list of Assets.

[The NFD Root gate](./contracts/gates/nfd_root.algo.ts) is a child contract for filtering interactions by an NFD root.

[The NFD gate](./contracts/gates/nfd.algo.ts) is a child contract for filtering interactions by NFD.

[The Staking Amount gate](./contracts/gates/staking_amount.algo.ts) is a child contract for filtering interactions by a users staked amount.

[The Staking Power gate](./contracts/gates/staking_power.algo.ts) is a child contract for filtering interactions by a users staking power.

[The Subscription gate](./contracts/gates/subscription.algo.ts) is a child contract for filtering interactions by a users subscription status.

## Actions

[The Poll action](./contracts/actions/poll.algo.ts) is a contract template for taking polls within an Akita protocol post.

## Meta Merkles
[The Meta Merkles contract](./contracts/metamerkles/metamerkles.algo.ts) exists for onchain merkle tree based metadata ingestible by other contracts.