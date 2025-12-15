import { MetaMerklesClient, MetaMerklesFactory } from '../../smart_contracts/artifacts/meta-merkles/MetaMerklesClient';
import { FixtureAndAccount } from '../types';

export type DeployMetaMerklesParams = FixtureAndAccount;

export const deployMetaMerkles = async ({
    fixture,
    sender,
    signer,
}: DeployMetaMerklesParams): Promise<{ client: MetaMerklesClient; appId: bigint }> => {
    const { algorand } = fixture.context;

    const factory = algorand.client.getTypedAppFactory(MetaMerklesFactory, {
        defaultSender: sender,
        defaultSigner: signer,
    });

    const results = await factory.send.create.create({
        args: {},
    });

    const client = results.appClient;

    return { client, appId: client.appId };
};
