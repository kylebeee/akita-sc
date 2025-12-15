import { GateSDK } from 'akita-sdk';
import { GateFactory } from '../../smart_contracts/artifacts/gates/GateClient';
import { FixtureAndAccount } from '../types';

export type DeployGateParams = FixtureAndAccount & {
    args: {
        version: string;
        akitaDao: bigint;
    };
};

export const deployGate = async ({
    fixture,
    sender,
    signer,
    args,
}: DeployGateParams): Promise<GateSDK> => {
    const { algorand } = fixture.context;

    const factory = algorand.client.getTypedAppFactory(GateFactory, {
        defaultSender: sender,
        defaultSigner: signer,
    });

    const results = await factory.send.create.create({
        args: {
            version: args.version,
            akitaDao: args.akitaDao,
        },
    });

    const client = results.appClient;

    return new GateSDK({
        algorand,
        factoryParams: { appId: client.appId },
        gateRegistry: {},
    });
};
