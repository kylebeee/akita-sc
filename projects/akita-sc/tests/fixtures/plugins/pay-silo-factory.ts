import { PaySiloFactoryPluginSDK } from 'akita-sdk/wallet';
import { PaySiloFactoryPluginFactory } from '../../../smart_contracts/artifacts/arc58/plugins/pay-silo/PaySiloFactoryPluginClient';
import { FixtureAndAccount } from '../../types';

type DeployParams = FixtureAndAccount

export const deployPaySiloFactoryPlugin = async ({ fixture, sender, signer }: DeployParams): Promise<PaySiloFactoryPluginSDK> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    PaySiloFactoryPluginFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const { appClient: client } = await factory.deploy({
    onUpdate: 'append',
    onSchemaBreak: 'append',
  })

  console.log('PaySiloFactoryPlugin deployed with appId:', client.appId);

  return new PaySiloFactoryPluginSDK({ algorand, factoryParams: { appId: client.appId } });
};
