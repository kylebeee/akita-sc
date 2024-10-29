# Akita Contracts

This repo is a central repository for all of Akita's main contracts

## Abstracted Account
[The Abstracted Account Factory](./contracts/arc58/abstracted_account_factory.algo.ts) is the factory contract for producing new Abstracted Accounts, thus all have the same creator address.

[The Abstracted Account Wallet](./contracts/arc58/abstracted_account.algo.ts) is the entry point for the Akita ecosystem. It allows us to bring the web3 experience up to par with the convenience of web2 while maintaining self-sovereignty.

## Keys
Contracts for key management of delegation for the abstracted account. We support 

[The Secp256r1 Passkey Logic Signature](./contracts/keys/secp256r1_passkey.algo.ts) account is a passkey approval smart signature account. Typically within our systems we use these as admin or access keys for the abstracted account.

## Plugins
[The OptIn plugin](./contracts/arc58/plugins/optin.algo.ts) is a plugin that allows anyone to opt the abstracted account into an asset, provided they pay for the MBR.

[The Subscription plugin](./contracts/arc58/plugins/subscription.algo.ts) is a plugin that allows someone to set up a recurring payment from the abstracted account.

[The Akita Social plugin](./contracts/arc58/plugins/akita_social.algo.ts) is the core plugin for the akita social protocol.

[The Staking Plugin](./contracts/arc58/plugins/staking.algo.ts) is a universal time staking plugin supporting with and without locks.

[The MBR Plugin](./contracts/arc58/plugins/mbr.algo.ts) is an artifical MBR contract where you can allow apps to lock funds in order to interact or use them.

[The Merkle Swap Plugin](./contracts/arc58/plugins/merkle_swap.algo.ts) is a merkle tree based escrow/swap contract boasting artificial atomicity with practically unbounded list lengths.

## Gates
[The Impact gate](./contracts/gates/impact.algo.ts) is a subroutine library for filtering interactions by a users impact score within the Akita social protocol.

[The Follower gate](./contracts/gates/follower.algo.ts) is a subroutine library for filtering interactions based on following within the Akita social protocol.

[The Subscription gate](./contracts/gates/subscription.algo.ts) is a subroutine library for filtering interactions by a users subscription status.

[The Staking gate](./contracts/gates/staking.algo.ts) is a subroutine library for filtering interactions by a users staking status.

[The NFD gate](./contracts/gates/nfd.algo.ts) is a subroutine library for filtering interactions by a NFDs.

[The Asset gate](./contracts/gates/asset.algo.ts) is a subroutine library for filtering interactions by ASA.

[The Collection gate](./contracts/gates/collection.algo.ts) is a subroutine library for filtering interactions by Meta Merkle based NFT collections.

[The Trait gate](./contracts/gates/trait.algo.ts) is a subroutine library for filtering interactions by Meta Merkle based NFT traits within a collection.

[The Merkle gate](./contracts/gates/merkle.algo.ts) is a subroutine library for filtering interactions by a generic Meta Merkle entry.

## Actions

[The Poll action](./contracts/actions/poll.algo.ts) is a contract template for taking polls within an Akita protocol post.

## Meta Merkles
[The Meta Merkles contract](./contracts/metamerkles/metamerkles.algo.ts) exists for onchain merkle tree based metadata ingestible by other contracts.