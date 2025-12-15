# Akita Smart Contracts

A comprehensive suite of Algorand smart contracts powering the Akita ecosystem — built with [Puya Ts](https://github.com/algorandfoundation/puya-ts) and [AlgoKit](https://github.com/algorandfoundation/algokit-cli).

## Overview

Akita is a modular smart contract platform featuring ARC-58 abstracted accounts, a plugin architecture for extensible wallet functionality, and a rich ecosystem of DeFi, social, and community engagement primitives.

---

## Architecture

### Core Components

| Component | Description |
|-----------|-------------|
| **ARC-58 Abstracted Accounts** | Smart contract wallets with plugin-based extensibility |
| **DAO** | Decentralized governance and administrative control |
| **Plugin System** | Modular functionality that can be attached to abstracted accounts |
| **Gate System** | Composable access control with pluggable sub-gates |

---

## System Modules

### 🔐 ARC-58 Abstracted Accounts

Smart contract wallets implementing ARC-58 standard with support for:
- Multi-key authentication (Ed25519, secp256r1 passkeys)
- Plugin-based extensibility
- Factory pattern for wallet deployment

### 🏛️ DAO

Decentralized autonomous organization contract for:
- Governance and voting
- Administrative operations
- Protocol parameter management

### 💰 Staking

Flexible staking system with:
- **Staking Contract** — Core staking logic with time-weighted rewards
- **Staking Pool Factory** — Deploy isolated staking pools with custom parameters

### 🔄 Subscriptions

Recurring payment and membership system:
- Subscription tiers and streaks
- Service declaration & parameter locking
- Subscription-gated access control

### 🎁 Rewards

Free public good for token distribution:
- Group distributions
- Claimable rewards w/ expirations

### 🌐 Social

Decentralized social primitives:
- **Social Contract** — Core social interactions
- **Social Graph** — On-chain follow/follower relationships
- **Social Impact** — Reputation and engagement scoring
- **Social Moderation** — Community moderation tools

### 🛒 Marketplace

NFT and ASA marketplace:
- Listing creation and management
- Buy/sell operations
- Double-sided marketplace incentivizing site integration

### 🔨 Auctions

Auction system with factory pattern:
- Bid fees for weighted raffle mechanics
- Double-sided marketplace incentivizing site integration
- Multi-dapp participation support

### 🎟️ Raffles

Verifiable random raffles:

- Tickets in any ASA
- VRF-based winner selection
- Double-sided marketplace incentivizing site integration

### 📊 Polls

On-chain voting and polling:
- Multiple choice polls
- Time-bounded voting
- Gate-restricted participation

### 📦 Prize Boxes

Bundle assets for sale, auction, or raffle as a single package.

### 🚪 Gates

Composable access control system with 16 sub-gates:

| Sub-Gate | Purpose |
|----------|---------|
| `akitaReferrerGate` | Akita referrer verification |
| `assetGate` | ASA holding requirements |
| `merkleAddressGate` | Merkle proof address allowlist |
| `merkleAssetGate` | Merkle proof asset allowlist |
| `nfdGate` | NFD ownership verification |
| `nfdRootGate` | NFD root ownership verification |
| `pollGate` | Poll participation requirements |
| `socialActivityGate` | Social activity thresholds |
| `socialFollowerCountGate` | Follower count requirements |
| `socialFollowerIndexGate` | Follower index verification |
| `socialImpactGate` | Social impact score thresholds |
| `socialModeratorGate` | Moderator role verification |
| `stakingAmountGate` | Staking amount requirements |
| `stakingPowerGate` | Staking power thresholds |
| `subscriptionGate` | Active subscription verification |
| `subscriptionStreakGate` | Subscription streak requirements |

### 🔄 HyperSwap

Peer-to-peer swap engine supporting practically limitless unique assets and parties in a simulated atomic transaction group.

### 🌳 Meta Merkles

On-chain metadata contract using merkle roots as namespaces for efficient metadata about sets of assets, addresses, apps, and more. Ingestible by other contracts for composable data verification.

---

## Plugins

Wallet plugins extend abstracted account functionality:

| Plugin | Description |
|--------|-------------|
| `optInPlugin` | ASA opt-in operations |
| `payPlugin` | Payment operations |
| `asaMintPlugin` | ASA creation and minting |
| `auctionPlugin` | Auction interactions |
| `daoPlugin` | DAO interactions |
| `dualStakePlugin` | Dual token staking |
| `gatePlugin` | Gate verification |
| `hyperSwapPlugin` | P2P multi-party swaps |
| `marketplacePlugin` | Marketplace operations |
| `nfdPlugin` | NFD operations |
| `paySiloPlugin` | Pay silo interactions |
| `paySiloFactoryPlugin` | Pay silo deployment |
| `pollPlugin` | Poll voting |
| `rafflePlugin` | Raffle participation |
| `revenueManagerPlugin` | Revenue distribution |
| `rewardsPlugin` | Reward claiming |
| `socialPlugin` | Social interactions |
| `stakingPlugin` | Staking operations |
| `stakingPoolPlugin` | Staking pool interactions |
| `subscriptionsPlugin` | Subscription management |
| `updatePlugin` | Contract updates |

---

## Deployment

### Core Contracts

| Contract | Testnet | Mainnet |
|----------|---------|---------|
| `dao` | `751971739` | `3368388956` |
| `wallet` | `751972058` | `3368395481` |
| `walletFactory` | `751971757` | `3368389117` |
| `escrowFactory` | `751967076` | `3368388829` |

### DeFi Contracts

| Contract | Testnet | Mainnet |
|----------|---------|---------|
| `staking` | `751971819` | `3368393172` |
| `stakingPoolFactory` | `751971794` | `3368391029` |
| `subscriptions` | `751971779` | `3368389628` |
| `rewards` | `751971741` | `3368388985` |
| `hyperSwap` | `751971956` | `3368394471` |
| `marketplace` | `751971922` | `3368394180` |
| `auctionFactory` | `751971901` | `3368393933` |

### Community Contracts

| Contract | Testnet | Mainnet |
|----------|---------|---------|
| `social` | `751971872` | `3368393551` |
| `socialGraph` | `751971844` | `3368393480` |
| `socialImpact` | `751971843` | `3368393419` |
| `socialModeration` | `751971873` | `3368393629` |
| `pollFactory` | `751971931` | `3368394268` |
| `raffleFactory` | `751971928` | `3368394210` |
| `prizeBoxFactory` | `751971937` | `3368394289` |

### Infrastructure Contracts

| Contract | Testnet | Mainnet |
|----------|---------|---------|
| `gate` | `751971953` | `3368394436` |
| `metaMerkles` | `751971947` | `3368394372` |

### Plugins

| Plugin | Testnet | Mainnet |
|--------|---------|---------|
| `optInPlugin` | `751968346` | `3368398585` |
| `payPlugin` | `751968379` | `3368399056` |
| `asaMintPlugin` | `751968373` | `3368398964` |
| `auctionPlugin` | `751972301` | `3368399217` |
| `daoPlugin` | `751972311` | `3368399317` |
| `dualStakePlugin` | `751972317` | `3368399386` |
| `gatePlugin` | `751972318` | `3368399411` |
| `hyperSwapPlugin` | `751972295` | `3368399121` |
| `marketplacePlugin` | `751968424` | `3368399474` |
| `nfdPlugin` | `751972324` | `3368399559` |
| `paySiloPlugin` | `751972334` | `3368399670` |
| `paySiloFactoryPlugin` | `751968441` | `3368399704` |
| `pollPlugin` | `751972340` | `3368399770` |
| `rafflePlugin` | `751972341` | `3368399868` |
| `revenueManagerPlugin` | `751972084` | `3368395771` |
| `rewardsPlugin` | `751972347` | `3368399956` |
| `socialPlugin` | `751972357` | `3368400007` |
| `stakingPlugin` | `751972363` | `3368400044` |
| `stakingPoolPlugin` | `751972365` | `3368400148` |
| `subscriptionsPlugin` | `751968395` | `3368399152` |
| `updatePlugin` | `751972139` | `3368396455` |

### Sub-Gates

| Sub-Gate | Testnet | Mainnet |
|----------|---------|---------|
| `akitaReferrerGate` | `751971962` | `3368394596` |
| `assetGate` | `751971964` | `3368394608` |
| `merkleAddressGate` | `751971975` | `3368394591` |
| `merkleAssetGate` | `751971967` | `3368394598` |
| `nfdGate` | `751971977` | `3368394599` |
| `nfdRootGate` | `751971966` | `3368394594` |
| `pollGate` | `751971963` | `3368394595` |
| `socialActivityGate` | `751971965` | `3368394606` |
| `socialFollowerCountGate` | `751971970` | `3368394601` |
| `socialFollowerIndexGate` | `751971969` | `3368394597` |
| `socialImpactGate` | `751971971` | `3368394605` |
| `socialModeratorGate` | `751971972` | `3368394602` |
| `stakingAmountGate` | `751971968` | `3368394603` |
| `stakingPowerGate` | `751971973` | `3368394600` |
| `subscriptionGate` | `751971974` | `3368394593` |
| `subscriptionStreakGate` | `751971976` | `3368394607` |

### Assets

| Asset | Testnet | Mainnet |
|-------|---------|---------|
| `AKITA` | — | `523683256` |
| `BONES` | `751973254` | `3368406527` |

### External Dependencies

| Contract | Testnet | Mainnet |
|----------|---------|---------|
| VRF Beacon | `600011887` | `1615566206` |
| NFD Registry | `84366825` | `760937186` |
| Asset Inbox | `643020148` | `2449590623` |
| Akita NFD | — | `765902356` |

---

## SDK

The `akita-sdk` package provides modular TypeScript bindings — import only what you need:

| Package | Import |
|---------|--------|
| Auction | `akita-sdk/auction` |
| DAO | `akita-sdk/dao` |
| Escrow | `akita-sdk/escrow` |
| Gates | `akita-sdk/gates` |
| HyperSwap | `akita-sdk/hyper-swap` |
| Marketplace | `akita-sdk/marketplace` |
| Meta Merkles | `akita-sdk/meta-merkles` |
| Poll | `akita-sdk/poll` |
| Prize Box | `akita-sdk/prize-box` |
| Raffle | `akita-sdk/raffle` |
| Rewards | `akita-sdk/rewards` |
| Social | `akita-sdk/social` |
| Staking | `akita-sdk/staking` |
| Staking Pool | `akita-sdk/staking-pool` |
| Subscriptions | `akita-sdk/subscriptions` |
| Wallet | `akita-sdk/wallet` |

```typescript
// Import specific modules
import { WalletClient } from 'akita-sdk/wallet';
import { StakingClient } from 'akita-sdk/staking';
import { SubscriptionsClient } from 'akita-sdk/subscriptions';
```

See [`projects/akita-sdk`](./projects/akita-sdk) for full documentation.

---

## License

MIT
