import { AlgorandFixture } from '@algorandfoundation/algokit-utils/types/testing';
import { MaybeSigner } from '../../akita-sdk/src/types';

export type FixtureAndAccount = MaybeSigner & {
  fixture: AlgorandFixture,
}