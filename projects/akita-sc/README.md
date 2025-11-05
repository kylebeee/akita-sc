# Akita Contracts

This repo is a central repository for all of Akita's main contracts

## Abstracted Account
[Abstracted Account Factory](./contracts/arc58/abstracted_account_factory.algo.ts) is the factory contract for producing new Abstracted Accounts, thus all have the same creator address.

[Abstracted Account Wallet](./contracts/arc58/abstracted_account.algo.ts) is the entry point for the Akita ecosystem. It allows us to bring the web3 experience up to par with the convenience of web2 while maintaining self-sovereignty.

## Keys
Contracts for key management of delegation for the abstracted account. We support 

[ED25519 Passkey Logic Signature](./contracts/keys/ed25519_passkey.algo.ts) account is a passkey approval smart signature account. Typically within our systems we use these as admin or access keys for the abstracted account.

[Secp256r1 Passkey Logic Signature](./contracts/keys/secp256r1_passkey.algo.ts) account is a passkey approval smart signature account. Typically within our systems we use these as admin or access keys for the abstracted account.

## Plugins

[Akita Social plugin](./contracts/arc58/plugins/social/social.algo.ts) is the core plugin for the akita social protocol.

[Akita Social Impact](./contracts/arc58/social/impact.algo.ts) is the comprises the impact system core logic for the social protocol.

[Auction Plugin](./contracts/arc58/plugins/auction.algo.ts) is the plugin for interacting with Akita auction contracts.

[Dual Stake Plugin](./contracts/arc58/plugins/dual_stake.algo.ts) is the plugin for interacting with Dual Stake contracts.

[Hyper Swap Plugin](./contracts/arc58/plugins/hyper_swap.algo.ts) is the plugin for interacting with the Hyper Swap contract.

[Marketplace Plugin](./contracts/arc58/plugins/marketplace.algo.ts) is the plugin for interacting with Akita marketplace contracts.

[NFD Plugin](./contracts/arc58/plugins/nfd.algo.ts) is a plugin for managing your NFDs.

[OptIn plugin](./contracts/arc58/plugins/optin.algo.ts) is a plugin that allows anyone to opt the abstracted account into an asset, provided they pay for the MBR.

[Raffle plugin](./contracts/arc58/plugins/raffle.algo.ts) is the plugin for interacting with Akita raffle contracts.

[Rewards plugin](./contracts/arc58/plugins/rewards.algo.ts) is the plugin for interacting with rewards distributions.

[Staking Plugin](./contracts/arc58/plugins/staking.algo.ts) is a universal time staking plugin supporting with and without locks.

[Subscription plugin](./contracts/arc58/plugins/subscription.algo.ts) is a plugin that allows someone to set up a recurring payment from the abstracted account.

## Auctions

[Auction Factory](./contracts/auction/auction_factory.algo.ts) is the factory contract for creating raffle auctions.

[Auction](./contracts/auction/auction.algo.ts) is the auction contract that facilitates each individual raffle auction.

## DAO

[Akita DAO](./contracts/dao/dao.algo.ts) is the DAO controlling the distribution of $BONES as well as managing Akita Social & default revocation app for ARC58 based Akita Wallets.

## Gates

[Main gate](./contracts//gates/gate.algo.ts) is the entrypoint contract for interacting with all other gates.

[Asset gate](./contracts/gates/asset.algo.ts) is a child contract for filtering interactions by ASA.

[Follower Count gate](./contracts/gates/follower.algo.ts) is a child contract for filtering interactions based on follower count within the Akita social protocol.

[Follower Index gate](./contracts/gates/follower_index.algo.ts) is a child contract for filtering interactions based on follower index within the Akita social protocol.

[Impact gate](./contracts/gates/impact.algo.ts) is a child contract for filtering interactions by a users impact score within the Akita social protocol.

[Merkle Address gate](./contracts/gates/merkle_address.algo.ts) is a child contract for filtering interactions by a Meta Merkle list of Addresses.

[Merkle Asset gate](./contracts/gates/merkle_asset.algo.ts) is a child contract for filtering interactions by a Meta Merkle list of Assets.

[NFD Root gate](./contracts/gates/nfd_root.algo.ts) is a child contract for filtering interactions by an NFD root.

[NFD gate](./contracts/gates/nfd.algo.ts) is a child contract for filtering interactions by NFD.

[Staking Amount gate](./contracts/gates/staking_amount.algo.ts) is a child contract for filtering interactions by a users staked amount.

[Staking Power gate](./contracts/gates/staking_power.algo.ts) is a child contract for filtering interactions by a users staking power.

[Subscription Streak gate](./contracts/gates/subscription_streak.algo.ts) is a child contract for filtering interactions by a users subscription streak.

[Subscription gate](./contracts/gates/subscription.algo.ts) is a child contract for filtering interactions by a users subscription.

## Hyper Swap

[Hyper Swap](./contracts/hyper_swap/hyper_swap.algo.ts) is a merkle tree based escrow/swap contract boasting artificial atomicity with practically unbounded list lengths.

## Marketplace

[Marketplace](./contracts/marketplace/marketplace.algo.ts) is a contract for listing NFTs for sale.

[Listing](./contracts/marketplace/listing.algo.ts) is a contract that facilitates each individual NFT up for sale.

## Meta Merkles
[Meta Merkles](./contracts/metamerkles/metamerkles.algo.ts) exists for onchain merkle tree based metadata ingestible by other contracts.

## Offer Box

[Offer Box Factory](./contracts/offer_box/offer_box_factory.algo.ts) tbd...

[Offer Box](./contracts/offer_box/offer_box.algo.ts) tbd...

## Poll

[Poll Factory](./contracts/poll/poll_factory.algo.ts) is a contract for creating polls.

[Poll](./contracts/poll/poll.algo.ts) is a contract for taking polls within an Akita protocol post.

## Pool

[Pool Factory](./contracts/pool/pool_factory.algo.ts) tbd...

[Pool](./contracts/pool/pool.algo.ts) tbd...

## Prize Box

[Prize Box Factory](./contracts/prize_box/prize_box_factory.algo.ts) is a prize box factory contract.

[Prize Box](./contracts/prize_box/prize_box.algo.ts) is a generic escrow contract for moving groups of assets between owners.

## Raffle

[Raffle Factory](./contracts/raffle/raffle_factory.algo.ts) is a factory contract for creating raffles.

[Raffle](./contracts/raffle/raffle.algo.ts) is a contract that facilitates individual raffles.

## Rewards

[Rewards](./contracts/rewards/rewards.algo.ts) is a rewards distribution contract.

## Staking

[Staking](./contracts/staking/staking.algo.ts) is a generic staking contract supporting multiple types of staking: heartbeat, soft, hard, & lock staking.

## Subscriptions

[Subscriptions](./contracts/subscriptions/subscriptions.algo.ts) is a subscription contract for sending payments at intervals.


# FACTORIES

Factory contracts are responsible for a number of things:
- creating child apps
- managing child app life cycles
- refunding 'Funders' when child apps are cleaned up & deleted

# ROLES

In the Akita universe there are a large number of accounts & user roles to manage, not all roles pertain to every interaction, contract or feature.


### Wallet
- admin: the owner of a smart wallet
- delegate: an account associated with a plugin thats allowed to invoke the functionality of an associated contract
- referrer: the funder of the smart wallet creation & recipient of referral fees

### DAO

// TODO:


### Auction


- seller: the user account selling the asset or prize box
- funder: the account that funded the creation of the child auction
- bidder: an account representing a user bidding in the auction
- listing marketplace: the account associated with the user interface the auction was created on
- buyer marketplace: the account associated with the user interface for which the winning bidder placed their bid
- creator: the creator of the asset being auctioned off for royalties
- raffle winner: the winning account of the loser raffle






# Factory Funding

When Applications are minted they require Algo to be locked up to exist on the chain. This system can be very petulant as you now have to build logic for ensuring payments match the correct amount & track accounts for refunding MBR

We must track & create managerial logic for
- asset optins
- child contracts based on the program size, & global state
- minimum account balances
- box storage


Bare minimum funders must provide enough Algo to cover
- factory & child app optins
- program MBR
- program account MBR
- arc59 MBR ( applicable when payments can be sent to a select group of recipients )
- akita dao escrow & core optin // (Global.assetOptInMinBalance * 4)
- instant referral disbursements
- box storage costs for abstracted state: VRF weights