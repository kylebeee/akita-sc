import { DualStakePluginSDK } from 'akita-sdk/wallet';
import { DualStakePluginFactory } from '../../../smart_contracts/artifacts/arc58/plugins/dual-stake/DualStakePluginClient';
import { FixtureAndAccount } from '../../types';

type DeployParams = FixtureAndAccount & {
  args?: {
    registry?: bigint;
  }
}

export const deployDualStakePlugin = async ({ fixture, sender, signer, args }: DeployParams): Promise<DualStakePluginSDK> => {
  const { algorand } = fixture.context;

  const factoryClient = algorand.client.getTypedAppFactory(
    DualStakePluginFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const registry = args?.registry ?? 0n;

  const { appClient: client } = await factoryClient.send.create.create({
    args: {
      registry,
    }
  })

  console.log('DualStakePlugin deployed with appId:', client.appId);

  return new DualStakePluginSDK({ algorand, factoryParams: { appId: client.appId } });
};
