import { setCurrentNetwork } from 'akita-sdk';
import { GatePluginSDK } from 'akita-sdk/wallet';
import { GatePluginFactory } from '../../../smart_contracts/artifacts/arc58/plugins/gate/GatePluginClient';
import { FixtureAndAccount } from '../../types';

type DeployParams = FixtureAndAccount & {
  args?: {
    gateAppId?: bigint;
  }
}

export const deployGatePlugin = async ({ fixture, sender, signer, args }: DeployParams): Promise<GatePluginSDK> => {
  // Ensure network is set for SDK initialization (fixtures are always localnet)
  setCurrentNetwork('localnet');
  
  const { algorand } = fixture.context;

  const factoryClient = algorand.client.getTypedAppFactory(
    GatePluginFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const gateAppId = args?.gateAppId ?? 0n;

  const { appClient: client } = await factoryClient.send.create.create({
    args: {
      gateAppId,
    }
  })

  console.log('GatePlugin deployed with appId:', client.appId);

  return new GatePluginSDK({ algorand, factoryParams: { appId: client.appId } });
};
