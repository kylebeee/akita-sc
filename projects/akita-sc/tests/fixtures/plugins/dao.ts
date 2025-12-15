import { DAOPluginSDK } from 'akita-sdk/wallet';
import { AkitaDaoPluginFactory } from '../../../smart_contracts/artifacts/arc58/plugins/dao/AkitaDAOPluginClient';
import { FixtureAndAccount } from '../../types';

type DeployParams = FixtureAndAccount & {
  args: {
    daoAppId: bigint;
  }
}

export const deployDAOPlugin = async ({ fixture, sender, signer, args: { daoAppId } }: DeployParams): Promise<DAOPluginSDK> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    AkitaDaoPluginFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const { appClient: client } = await factory.send.create.create({
    args: { daoAppId }
  })

  console.log('DAOPlugin deployed with appId:', client.appId);

  return new DAOPluginSDK({ algorand, factoryParams: { appId: client.appId } });
};
