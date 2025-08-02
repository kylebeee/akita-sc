import { AlgorandFixture } from '@algorandfoundation/algokit-utils/types/testing';
import { WithSigner } from '../../akita-sdk/src/types';

export type FixtureAndAccount = WithSigner & {
  fixture: AlgorandFixture,
}