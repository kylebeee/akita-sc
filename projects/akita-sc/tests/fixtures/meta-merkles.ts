import { setCurrentNetwork } from 'akita-sdk';
import { MetaMerklesSDK, SchemaPart } from 'akita-sdk/meta-merkles';
import { MetaMerklesClient, MetaMerklesFactory } from '../../smart_contracts/artifacts/meta-merkles/MetaMerklesClient';
import { FixtureAndAccount } from '../types';

export type DeployMetaMerklesParams = FixtureAndAccount;

export const deployMetaMerkles = async ({
    fixture,
    sender,
    signer,
}: DeployMetaMerklesParams): Promise<{ client: MetaMerklesClient; appId: bigint; sdk: MetaMerklesSDK }> => {
    setCurrentNetwork('localnet');
    const { algorand } = fixture.context;

    const factory = algorand.client.getTypedAppFactory(MetaMerklesFactory, {
        defaultSender: sender,
        defaultSigner: signer,
    });

    const results = await factory.send.create.create({
        args: {},
    });

    const client = results.appClient;

    const sdk = new MetaMerklesSDK({
        algorand,
        factoryParams: { appId: client.appId, defaultSender: sender, defaultSigner: signer },
    });

    // Register standard types (matching MetaMerkles standalone tests)
    await sdk.addType({ description: 'Unspecified - no schema', schemaList: [] });                                                   // ID 0
    await sdk.addType({ description: 'Collection - uint64', schemaList: [SchemaPart.Uint64] });                                      // ID 1
    await sdk.addType({ description: 'Trait - uint64', schemaList: [SchemaPart.Uint64] });                                           // ID 2
    await sdk.addType({ description: 'Trade - address,address,uint64,uint64',                                                        // ID 3
        schemaList: [SchemaPart.Address, SchemaPart.Address, SchemaPart.Uint64, SchemaPart.Uint64] });
    await sdk.addType({ description: 'Whitelist - address', schemaList: [SchemaPart.Address] });                                       // ID 4
    await sdk.addType({ description: 'Addresses - address', schemaList: [SchemaPart.Address] });                                       // ID 5
    await sdk.addType({ description: 'HyperSwap - address,address,uint64,uint64,uint64',                                              // ID 6
        schemaList: [SchemaPart.Address, SchemaPart.Address, SchemaPart.Uint64, SchemaPart.Uint64, SchemaPart.Uint64] });

    return { client, appId: client.appId, sdk };
};
