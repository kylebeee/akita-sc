

import { UpdateAkitaDaoPluginFactory } from '../../../smart_contracts/artifacts/arc58/plugins/update-akita-dao/UpdateAkitaDAOPluginClient';
import { FixtureAndAccount } from '../../types';
import { UpdateAkitaDAOPluginSDK } from 'akita-sdk'

type DeployParams = FixtureAndAccount

export const deployUpdateAkitaDaoPlugin = async ({ fixture, sender, signer }: DeployParams): Promise<UpdateAkitaDAOPluginSDK> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    UpdateAkitaDaoPluginFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const { appClient: client } = await factory.deploy({
    onUpdate: 'append',
    onSchemaBreak: 'append',
  })

  console.log('UpdateAkitaDaoPlugin deployed with appId:', client.appId);

  return new UpdateAkitaDAOPluginSDK({ algorand, factoryParams: { appId: client.appId } });
};