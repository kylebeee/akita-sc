# ARC58 Wallet SDK

A TypeScript SDK for interacting with ARC58 Abstracted Accounts on the Algorand blockchain. This SDK provides a high-level interface for creating and managing smart contract wallets with plugin-based functionality, escrow management, and spending allowances.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [Creating Wallets](#creating-wallets)
- [Managing Plugins](#managing-plugins)
- [Using Plugins](#using-plugins)
- [Escrow Management](#escrow-management)
- [Allowances](#allowances)
- [Profile Management](#profile-management)
- [Advanced Features](#advanced-features)
- [Available Plugins](#available-plugins)
- [Configuration](#configuration)
- [API Reference](#api-reference)

## Installation

```bash
npm install akita-sdk
# or
pnpm add akita-sdk
```

## Quick Start

```typescript
import { AlgorandClient, microAlgo } from '@algorandfoundation/algokit-utils';
import { newWallet, PayPluginSDK, WalletSDK } from 'akita-sdk/wallet';

// Initialize Algorand client
const algorand = AlgorandClient.fromEnvironment();

// Create a new wallet
const wallet = await newWallet({
  algorand,
  factoryParams: {
    appId: WALLET_FACTORY_APP_ID,
    defaultSender: myAddress,
    defaultSigner: mySigner,
  },
  sender: myAddress,
  signer: mySigner,
  nickname: 'my_wallet',
});

// Initialize a plugin SDK
const payPlugin = new PayPluginSDK({
  factoryParams: { appId: PAY_PLUGIN_APP_ID },
  algorand,
});

// Calculate MBR and fund the wallet for plugins
const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 0n });
await wallet.client.appClient.fundAppAccount({
  amount: microAlgo(mbr.plugins + 1_000_000n) // MBR + 1 ALGO for payments
});

// Add the plugin to your wallet (global access)
await wallet.addPlugin({
  client: payPlugin,
  global: true,
});

// Send a payment through the wallet
await wallet.usePlugin({
  global: true,
  calls: [
    payPlugin.pay({
      payments: [
        { receiver: recipientAddress, amount: 1_000_000n, asset: 0n }
      ],
    }),
  ],
});
```

## Core Concepts

### Abstracted Accounts (ARC58)

ARC58 wallets are smart contract-based accounts that provide:

- **Plugin System**: Modular functionality through installable plugins
- **Escrow Management**: Isolated spending pools for different purposes
- **Allowances**: Fine-grained spending limits and rate controls
- **Execution Keys**: Pre-authorized transaction batches

### SDK Components

| Component | Description |
|-----------|-------------|
| `WalletFactorySDK` | Creates new wallet instances |
| `WalletSDK` | Main wallet interface for all operations |
| `PayPluginSDK`, etc. | Plugin-specific SDKs for transactions |

## Creating Wallets

### Using the `newWallet` Helper

The recommended approach combines creation and registration:

```typescript
import { newWallet, WalletSDK } from 'akita-sdk/wallet';

const wallet: WalletSDK = await newWallet({
  algorand,
  factoryParams: {
    appId: walletFactory.appId,
    defaultSender: sender,
    defaultSigner: signer,
  },
  readerAccount: sender,         // Account used for read-only queries
  sender: sender,
  signer: signer,
  nickname: 'test_wallet',
  admin: customAdmin,            // Optional: defaults to sender
  referrer: referrerAddress,     // Optional: for referral tracking
});

// Verify wallet was created
expect(wallet.client.appId).toBeGreaterThan(0n);

// Check wallet state
const walletState = await wallet.client.state.global.getAll();
console.log('Admin:', walletState.admin);
console.log('Nickname:', walletState.nickname);
console.log('Controlled Address:', walletState.controlledAddress);
```

### Using the Factory Directly

```typescript
import { WalletFactorySDK } from 'akita-sdk/wallet';

const factory = new WalletFactorySDK({
  factoryParams: { appId: WALLET_FACTORY_APP_ID },
  algorand,
});

// Check creation cost
const cost = await factory.cost();
console.log('Wallet creation cost:', cost, 'microAlgos');

// Create a new wallet
const wallet = await factory.new({
  sender: myAddress,
  signer: mySigner,
  nickname: 'my_wallet',
  admin: adminAddress,        // Optional: defaults to sender
  referrer: referrerAddress,  // Optional: for referral tracking
});

// Register the wallet with the escrow factory
await wallet.register({ escrow: '' });
```

### Getting an Existing Wallet

```typescript
const wallet = await factory.get({ appId: existingWalletAppId });
```

## Managing Plugins

### Funding the Wallet for Plugins

Before adding plugins, calculate and fund the minimum balance requirement:

```typescript
// Calculate MBR for plugins
const mbr = await wallet.getMbr({
  escrow: '',           // Empty string for main wallet, or escrow name
  methodCount: 0n,      // Number of method restrictions
  plugin: '',           // Plugin identifier
  groups: 0n            // Number of execution key groups
});

// Fund the wallet
await wallet.client.appClient.fundAppAccount({
  amount: microAlgo(mbr.plugins)
});
```

### Adding a Global Plugin

Global plugins can be used by anyone through the wallet:

```typescript
import { PayPluginSDK } from 'akita-sdk/wallet';

const payPlugin = new PayPluginSDK({
  factoryParams: { appId: PAY_PLUGIN_APP_ID },
  algorand,
});

// Add plugin with global access (no method restrictions)
await wallet.addPlugin({
  client: payPlugin,
  global: true,
});

// Verify plugin was added
const plugins = await wallet.getPlugins();
expect(plugins.size).toBe(1);
```

### Adding a Caller-Specific Plugin

Restrict plugin usage to a specific address:

```typescript
const mbr = await wallet.getMbr({
  escrow: '',
  methodCount: 1n,  // One method restriction
  plugin: '',
  groups: 0n
});

await wallet.client.appClient.fundAppAccount({
  amount: microAlgo(mbr.plugins)
});

await wallet.addPlugin({
  client: payPlugin,
  caller: userAddress,  // Only this address can use the plugin
  methods: [
    { name: payPlugin.pay(), cooldown: 0n }
  ]
});
```

### Adding a Plugin with Cooldown

```typescript
await wallet.addPlugin({
  client: payPlugin,
  global: true,
  cooldown: 100n,      // 100 second/round cooldown between uses
  useRounds: true,     // Use round numbers instead of timestamps
});
```

### Adding a Plugin with Method Cooldown

```typescript
await wallet.addPlugin({
  client: payPlugin,
  caller: sender,
  useRounds: true,
  methods: [
    { name: payPlugin.pay(), cooldown: 100n },  // 100 round cooldown per method
  ]
});
```

### Plugin with Expiration

```typescript
await wallet.addPlugin({
  client: payPlugin,
  global: true,
  lastValid: 0n,  // Plugin expires immediately (for testing)
});
```

### Plugin Options Reference

| Option | Type | Description |
|--------|------|-------------|
| `client` | SDK instance | The plugin SDK to install |
| `global` | `boolean` | If true, anyone can use the plugin |
| `caller` | `string` | Specific address allowed to use (if not global) |
| `name` | `string` | Optional name for easier reference |
| `methods` | `Array` | Allowed methods with cooldowns |
| `escrow` | `string` | Escrow name for spending limits |
| `allowances` | `Array` | Spending allowances (requires escrow) |
| `useRounds` | `boolean` | Use round numbers instead of timestamps |
| `useExecutionKey` | `boolean` | Require execution keys for calls |
| `coverFees` | `boolean` | Wallet covers transaction fees |
| `cooldown` | `bigint` | Plugin-level cooldown |
| `lastValid` | `bigint` | Plugin expiration round |
| `admin` | `boolean` | Grant admin privileges |

### Removing a Plugin

```typescript
await wallet.removePlugin({
  plugin: payPlugin.appId,
  caller: ALGORAND_ZERO_ADDRESS_STRING,  // For global plugins
  escrow: '',
});
```

### Querying Plugins

```typescript
// Get all plugins
const plugins = await wallet.getPlugins();

// Get a specific plugin by key
const pluginInfo = wallet.plugins.get({
  plugin: payPlugin.appId,
  caller: ALGORAND_ZERO_ADDRESS_STRING,
  escrow: ''
});

// Check plugin state
expect(pluginInfo).toBeDefined();
expect(pluginInfo.lastCalled).toBeGreaterThan(0n);
```

## Using Plugins

### Basic Payment (ALGO)

```typescript
// Fund wallet for payment
const paymentAmount = 1_000_000n; // 1 ALGO
await wallet.client.appClient.fundAppAccount({
  amount: microAlgo(paymentAmount)
});

// Send payment
const results = await wallet.usePlugin({
  global: true,
  calls: [
    payPlugin.pay({
      payments: [{
        receiver: recipientAddress,
        asset: 0n,  // 0 = ALGO
        amount: paymentAmount,
      }]
    }),
  ]
});

expect(results.txIds.length).toBeGreaterThan(0);
```

### Asset (ASA) Payment

```typescript
// First mint an asset
const mintResults = await wallet.usePlugin({
  global: true,
  calls: [
    asaMintPlugin.mint({
      assets: [{
        assetName: 'Test Token',
        unitName: 'TEST',
        total: 1_000_000_000_000n,
        decimals: 6n,
        manager: wallet.client.appAddress.toString(),
        reserve: wallet.client.appAddress.toString(),
        freeze: ALGORAND_ZERO_ADDRESS_STRING,
        clawback: ALGORAND_ZERO_ADDRESS_STRING,
        defaultFrozen: false,
        url: 'https://test.token',
      }]
    }),
  ]
});

const assetId = mintResults.returns[1][0];

// Send ASA payment
await wallet.usePlugin({
  global: true,
  calls: [
    payPlugin.pay({
      payments: [{
        receiver: recipientAddress,
        asset: assetId,
        amount: 100_000_000n,  // 100 tokens
      }]
    }),
  ]
});
```

### Multiple Payments in One Call

```typescript
await wallet.usePlugin({
  global: true,
  calls: [
    payPlugin.pay({
      payments: [
        { receiver: receiver1, asset: 0n, amount: 500_000n },
        { receiver: receiver2, asset: 0n, amount: 750_000n },
      ]
    }),
  ]
});
```

### Mixed ALGO and ASA Payments

```typescript
await wallet.usePlugin({
  global: true,
  calls: [
    payPlugin.pay({
      payments: [
        { receiver: recipient, asset: 0n, amount: 500_000n },      // ALGO
        { receiver: recipient, asset: assetId, amount: 50_000_000n }, // ASA
      ]
    }),
  ]
});
```

### Caller-Specific Plugin Usage

```typescript
// Use plugin as specific caller (not global)
await wallet.usePlugin({
  sender: userAddress,
  signer: userSigner,
  calls: [
    payPlugin.pay({
      payments: [{
        receiver: recipient,
        amount: paymentAmount,
        asset: 0n,
      }]
    })
  ]
});
```

### Minting Assets

```typescript
import { AsaMintPluginSDK } from 'akita-sdk/wallet';

const asaMintPlugin = new AsaMintPluginSDK({
  factoryParams: { appId: ASA_MINT_PLUGIN_APP_ID },
  algorand,
});

await wallet.addPlugin({ client: asaMintPlugin, global: true });

const results = await wallet.usePlugin({
  global: true,
  calls: [
    asaMintPlugin.mint({
      assets: [{
        assetName: 'Test Akita',
        unitName: 'TAKTA',
        total: 1_000_000_000_000n,
        decimals: 6n,
        manager: wallet.client.appAddress.toString(),
        reserve: wallet.client.appAddress.toString(),
        freeze: ALGORAND_ZERO_ADDRESS_STRING,
        clawback: ALGORAND_ZERO_ADDRESS_STRING,
        defaultFrozen: false,
        url: 'https://akita.community',
      }]
    }),
  ]
});

const assetId = results.returns[1][0];
expect(assetId).toBeGreaterThan(0n);
```

### Opting Into Assets

```typescript
import { OptInPluginSDK } from 'akita-sdk/wallet';

const optInPlugin = new OptInPluginSDK({
  factoryParams: { appId: OPTIN_PLUGIN_APP_ID },
  algorand,
});

await wallet.addPlugin({ client: optInPlugin, global: true });

await wallet.usePlugin({
  global: true,
  calls: [optInPlugin.optIn({ assets: [assetId] })]
});

// Verify wallet now holds the asset
const walletInfo = await algorand.account.getInformation(wallet.client.appAddress);
expect(walletInfo?.assets?.length).toBe(1);
```

## Escrow Management

Escrows are isolated spending pools within the wallet.

### Creating an Escrow with a Plugin

Escrows are auto-created when adding plugins with an escrow name:

```typescript
const escrow = 'mint_account';
const mbr = await wallet.getMbr({ escrow, methodCount: 0n, plugin: '', groups: 0n });

await wallet.client.appClient.fundAppAccount({
  amount: microAlgo(mbr.plugins + mbr.newEscrowMintCost)
});

await wallet.addPlugin({
  client: asaMintPlugin,
  global: true,
  escrow,  // Creates escrow if it doesn't exist
});

// Get escrow info
const escrowInfo = await wallet.getEscrow(escrow);
const escrowAddress = getApplicationAddress(escrowInfo.id).toString();
```

### Using Plugins with Escrow

```typescript
await wallet.usePlugin({
  escrow: 'mint_account',
  global: true,
  calls: [
    asaMintPlugin.mint({
      assets: [{
        assetName: 'Test Token',
        unitName: 'TEST',
        total: 1_000_000_000_000n,
        decimals: 6n,
        manager: escrowAddress,
        reserve: escrowAddress,
        freeze: ALGORAND_ZERO_ADDRESS_STRING,
        clawback: ALGORAND_ZERO_ADDRESS_STRING,
        defaultFrozen: false,
        url: 'https://test.token',
      }]
    }),
  ]
});
```

### Other Escrow Operations

```typescript
// Get all escrows
const escrows = await wallet.getEscrows();

// Lock/unlock an escrow
await wallet.toggleEscrowLock({ name: 'savings' });

// Opt escrow into assets
await wallet.optinEscrow({
  name: 'savings',
  assets: [assetId1, assetId2],
});

// Reclaim funds from escrow
await wallet.reclaimFunds({
  name: 'savings',
  funds: [
    [0n, 1_000_000n, false],      // [assetId, amount, closeOut]
    [assetId1, 500_000n, true],   // Close out the asset position
  ],
});
```

## Allowances

Allowances define spending limits for escrow-based plugins.

### Flat Allowance

A one-time spending limit:

```typescript
const escrow = 'flat_allowance';
const mbr = await wallet.getMbr({ escrow, methodCount: 0n, plugin: '', groups: 0n });

const asset = 0n;
const allowed = 10_000_000n;  // 10 ALGO limit

await wallet.client.appClient.fundAppAccount({
  amount: microAlgo(allowed + mbr.plugins + mbr.newEscrowMintCost + mbr.allowances)
});

await wallet.addPlugin({
  client: payPlugin,
  global: true,
  escrow,
  allowances: [{
    type: 'flat',
    asset,
    amount: allowed
  }]
});

// Use allowance with funds request
const amount = 6_000_000n;
await wallet.usePlugin({
  escrow,
  global: true,
  calls: [
    payPlugin.pay({
      payments: [{ receiver: recipient, amount, asset }]
    })
  ],
  fundsRequest: [{ amount, asset }]
});

// Check allowance state
const allowanceInfo = wallet.allowances.get({ asset, escrow });
if (isFlatAllowance(allowanceInfo)) {
  expect(allowanceInfo.spent).toEqual(amount);
}
```

### Window Allowance

Spending limit that resets periodically:

```typescript
import { isWindowAllowance } from 'akita-sdk/wallet';

const escrow = 'window_allowance';
const mbr = await wallet.getMbr({ escrow, methodCount: 0n, plugin: '', groups: 0n });

const allowed = 10_000_000n;

await wallet.client.appClient.fundAppAccount({
  amount: microAlgo((allowed * 2n) + mbr.plugins + mbr.newEscrowMintCost + mbr.allowances)
});

await wallet.addPlugin({
  client: payPlugin,
  global: true,
  escrow,
  allowances: [{
    type: 'window',
    asset: 0n,
    amount: allowed,      // 10 ALGO per window
    interval: 100n,       // 100 rounds per window
    useRounds: true
  }]
});

// First payment succeeds
await wallet.usePlugin({
  escrow,
  global: true,
  calls: [payPlugin.pay({ payments: [{ receiver, amount: 6_000_000n, asset: 0n }] })],
  fundsRequest: [{ amount: 6_000_000n, asset: 0n }]
});

// Second payment exceeds window allowance - fails
try {
  await wallet.usePlugin({
    escrow,
    global: true,
    calls: [payPlugin.pay({ payments: [{ receiver, amount: 6_000_000n, asset: 0n }] })],
    fundsRequest: [{ amount: 6_000_000n, asset: 0n }]
  });
} catch (e) {
  // ERR_ALLOWANCE_EXCEEDED
}

// After 100+ rounds, allowance resets and payment succeeds again
```

### Drip Allowance

Continuous accrual of spending power:

```typescript
import { isDripAllowance } from 'akita-sdk/wallet';

const escrow = 'drip_allowance';
const mbr = await wallet.getMbr({ escrow, methodCount: 0n, plugin: '', groups: 0n });

const max = 10_000_000n;

await wallet.client.appClient.fundAppAccount({
  amount: microAlgo((max * 2n) + mbr.plugins + mbr.newEscrowMintCost + mbr.allowances)
});

await wallet.addPlugin({
  client: payPlugin,
  global: true,
  escrow,
  allowances: [{
    type: 'drip',
    asset: 0n,
    rate: 1_000_000n,     // 1 ALGO per interval
    interval: 10n,        // Every 10 rounds
    max,                  // Maximum accumulation: 10 ALGO
    useRounds: true
  }]
});

// Spend some of the initial max allowance
await wallet.usePlugin({
  escrow,
  global: true,
  calls: [payPlugin.pay({ payments: [{ receiver, amount: 6_000_000n, asset: 0n }] })],
  fundsRequest: [{ amount: 6_000_000n, asset: 0n }]
});

// Check drip state
const allowanceInfo = wallet.allowances.get({ asset: 0n, escrow });
if (isDripAllowance(allowanceInfo)) {
  expect(allowanceInfo.lastLeftover).toEqual(max - 6_000_000n);  // 4 ALGO remaining
}

// After 20 rounds, 2 ALGO drips back (20 / 10 * 1_000_000)
// Total available: 4 ALGO + 2 ALGO = 6 ALGO
```

## Profile Management

Set wallet profile information stored on-chain:

```typescript
await wallet.setNickname({ nickname: 'alice_wallet' });
await wallet.setAvatar({ avatar: avatarAssetId });
await wallet.setBanner({ banner: bannerAssetId });
await wallet.setBio({ bio: 'My awesome wallet!' });
```

## Advanced Features

### Execution Keys (Pre-authorized Transactions)

Build and authorize transaction batches for future execution by third parties:

```typescript
// Fund wallet for execution key MBR
const mbr = await wallet.getMbr({ escrow: '', methodCount: 0n, plugin: '', groups: 2n });
const paymentAmount = 1_000_000n;

await wallet.client.appClient.fundAppAccount({
  amount: microAlgo(mbr.plugins + mbr.executions + paymentAmount)
});

// Add plugin with execution key requirement
await wallet.addPlugin({
  client: payPlugin,
  global: true,
  useExecutionKey: true,
  useRounds: true
});

// Build execution groups
const { lease, firstValid, lastValid, ids: groups, atcs } = await wallet.build.usePlugin({
  sender: executorAddress,
  signer: executorSigner,
  lease: 'my_lease',
  windowSize: 2000n,      // Valid for 2000 rounds
  global: true,
  calls: [
    payPlugin.pay({
      payments: [{
        receiver: recipient,
        amount: paymentAmount,
        asset: 0n,
      }]
    })
  ]
});

// Register the execution key
await wallet.addExecutionKey({ lease, groups, firstValid, lastValid });

// Third party can now execute the pre-built transaction
await atcs[0].submit(algorand.client.algod);

// Remove execution key when done
await wallet.removeExecutionKey({ lease });
```

### Prepared Transactions (Cost Estimation)

Preview costs before sending:

```typescript
const prepared = await wallet.prepare.usePlugin({
  global: true,
  calls: [
    payPlugin.pay({
      payments: [{ receiver: recipient, amount: 1_000_000n, asset: 0n }],
    }),
  ],
});

console.log('Network fees:', prepared.expectedCost.networkFees);
console.log('Inner txn fees:', prepared.expectedCost.innerTxnFees);
console.log('Total cost:', prepared.expectedCost.total);
console.log('Was simulated:', prepared.simulated);

// Send when ready
const result = await prepared.send();
```

### Admin Operations

```typescript
// Change wallet admin
await wallet.changeAdmin({ newAdmin: newAdminAddress });

// Get current admin
const admin = await wallet.getAdmin();

// Verify auth address is correct
await wallet.verifyAuthAddress();
```

### Querying Wallet State

```typescript
// Get all global state
const state = await wallet.getGlobalState();
console.log('Admin:', state.admin);
console.log('Nickname:', state.nickname);
console.log('Controlled Address:', state.controlledAddress);
console.log('Last User Interaction:', state.lastUserInteraction);
console.log('Factory App:', state.factoryApp);

// Get wallet balances
const balances = await wallet.balance([0n, assetId1, assetId2]);

// Get account information
const walletInfo = await algorand.account.getInformation(wallet.client.appAddress);
console.log('Balance:', walletInfo.balance.microAlgos);
console.log('Min Balance:', walletInfo.minBalance.microAlgos);
console.log('Assets:', walletInfo.assets?.length);
```

## Available Plugins

The SDK includes pre-built plugins for common operations:

| Plugin | Description |
|--------|-------------|
| `PayPluginSDK` | Send ALGO and ASA payments |
| `OptInPluginSDK` | Opt into assets |
| `AsaMintPluginSDK` | Create and configure ASAs |
| `DAOPluginSDK` | DAO governance operations |
| `SocialPluginSDK` | Social features (posts, follows) |
| `StakingPluginSDK` | Staking operations |
| `StakingPoolPluginSDK` | Staking pool interactions |
| `MarketplacePluginSDK` | NFT marketplace operations |
| `AuctionPluginSDK` | Auction operations |
| `RafflePluginSDK` | Raffle participation |
| `PollPluginSDK` | Voting and polls |
| `RewardsPluginSDK` | Rewards distribution |
| `SubscriptionsPluginSDK` | Subscription management |
| `HyperSwapPluginSDK` | Token swaps |
| `GatePluginSDK` | Access control gates |
| `NFDPluginSDK` | NFD (NFDomains) integration |

### Plugin SDK Pattern

All plugins follow a consistent pattern:

```typescript
import { SomePluginSDK } from 'akita-sdk/wallet';

const plugin = new SomePluginSDK({
  factoryParams: { appId: PLUGIN_APP_ID },
  algorand,
});

// Get method selector (for addPlugin method restrictions)
const selector = plugin.someMethod();

// Execute method (for usePlugin calls)
const call = plugin.someMethod({
  // method-specific args...
});
```

## Configuration

### Network Detection

The SDK automatically detects the network from:

1. Explicitly set network via `setCurrentNetwork()`
2. `ALGORAND_NETWORK` environment variable
3. AlgorandClient URL patterns

```typescript
import { setCurrentNetwork, getCurrentNetwork } from 'akita-sdk';

setCurrentNetwork('mainnet');
const network = getCurrentNetwork();  // 'mainnet' | 'testnet' | 'localnet'
```

### Environment Variables

Configure app IDs via environment variables:

```bash
ALGORAND_NETWORK=mainnet
WALLET_FACTORY_APP_ID=123456789
WALLET_APP_ID=123456790
PAY_PLUGIN_APP_ID=123456791
OPTIN_PLUGIN_APP_ID=123456792
```

### Network-Specific App IDs

```typescript
import { MAINNET_APP_IDS, TESTNET_APP_IDS, getNetworkAppIds } from 'akita-sdk';

const appIds = getNetworkAppIds();
console.log('Wallet Factory:', appIds.WALLET_FACTORY_APP_ID);
```

## API Reference

### WalletFactorySDK

| Method | Description |
|--------|-------------|
| `new(params)` | Create a new wallet |
| `get({ appId })` | Get existing wallet by app ID |
| `cost()` | Get wallet creation cost |

### WalletSDK

#### Core Methods
| Method | Description |
|--------|-------------|
| `register({ escrow })` | Register wallet with escrow factory |
| `verifyAuthAddress()` | Verify wallet auth address |
| `changeAdmin({ newAdmin })` | Change wallet admin |
| `getMbr(params)` | Calculate MBR requirements |

#### Plugin Management
| Method | Description |
|--------|-------------|
| `addPlugin(params)` | Install a plugin |
| `usePlugin(params)` | Execute plugin operations |
| `removePlugin(params)` | Remove a plugin |
| `getPlugins()` | Get all plugins |
| `getPluginByKey(key)` | Get plugin by key |
| `getNamedPlugins()` | Get named plugins map |
| `getPluginByName(name)` | Get plugin by name |

#### Escrow Management
| Method | Description |
|--------|-------------|
| `newEscrow({ name })` | Create new escrow |
| `getEscrows()` | Get all escrows |
| `getEscrow(name)` | Get escrow by name |
| `toggleEscrowLock({ name })` | Lock/unlock escrow |
| `optinEscrow({ name, assets })` | Opt escrow into assets |
| `reclaimFunds({ name, funds })` | Reclaim funds from escrow |

#### Allowance Management
| Method | Description |
|--------|-------------|
| `addAllowances({ escrow, allowances })` | Add spending allowances |
| `removeAllowances({ escrow, assets })` | Remove allowances |
| `getAllowances()` | Get all allowances |
| `getAllowance(key)` | Get specific allowance |

#### Profile Management
| Method | Description |
|--------|-------------|
| `setNickname({ nickname })` | Set wallet nickname |
| `setAvatar({ avatar })` | Set avatar asset ID |
| `setBanner({ banner })` | Set banner asset ID |
| `setBio({ bio })` | Set bio text |

#### Execution Keys
| Method | Description |
|--------|-------------|
| `addExecutionKey(params)` | Add execution key |
| `removeExecutionKey({ lease })` | Remove execution key |
| `getExecutions()` | Get all executions |
| `getExecution(lease)` | Get execution by lease |

#### State Queries
| Method | Description |
|--------|-------------|
| `getGlobalState()` | Get all global state |
| `getAdmin()` | Get admin address |
| `balance(assets)` | Get asset balances |

#### Advanced
| Method | Description |
|--------|-------------|
| `prepare.usePlugin(params)` | Prepare with cost estimation |
| `build.usePlugin(params)` | Build execution groups |

## Type Guards

```typescript
import { isFlatAllowance, isWindowAllowance, isDripAllowance } from 'akita-sdk/wallet';

const allowance = wallet.allowances.get({ asset: 0n, escrow: 'my_escrow' });

if (isFlatAllowance(allowance)) {
  console.log('Spent:', allowance.spent, 'of', allowance.amount);
}

if (isWindowAllowance(allowance)) {
  console.log('Spent this window:', allowance.spent);
  console.log('Window interval:', allowance.interval);
}

if (isDripAllowance(allowance)) {
  console.log('Leftover:', allowance.lastLeftover);
  console.log('Drip rate:', allowance.rate, 'per', allowance.interval);
}
```

## License

MIT
