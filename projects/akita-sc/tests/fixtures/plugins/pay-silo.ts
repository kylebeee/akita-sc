import { setCurrentNetwork } from 'akita-sdk';
import { PaySiloPluginSDK } from 'akita-sdk/wallet';
import { Address } from 'algosdk';
import { PaySiloPluginFactory } from '../../../smart_contracts/artifacts/arc58/plugins/pay-silo/PaySiloPluginClient';
import { FixtureAndAccount } from '../../types';

type DeployParams = FixtureAndAccount & {
  args: {
    recipient: string | Address;
  }
}

export const deployPaySiloPlugin = async ({ fixture, sender, signer, args: { recipient } }: DeployParams): Promise<PaySiloPluginSDK> => {
  // Ensure network is set for SDK initialization (fixtures are always localnet)
  setCurrentNetwork('localnet');
  
  const { algorand } = fixture.context;

  const factoryClient = algorand.client.getTypedAppFactory(
    PaySiloPluginFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const { appClient: client } = await factoryClient.send.create.create({
    args: {
      recipient: typeof recipient === 'string' ? recipient : recipient.toString(),
    }
  })

  console.log('PaySiloPlugin deployed with appId:', client.appId);

  return new PaySiloPluginSDK({ algorand, factoryParams: { appId: client.appId } });
};
