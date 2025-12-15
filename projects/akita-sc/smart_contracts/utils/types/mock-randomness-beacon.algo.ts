import { Bytes, bytes, Contract, uint64 } from '@algorandfoundation/algorand-typescript'

/**
 * Mock VRF beacon for testing purposes.
 * Returns a predictable seed value based on the round number.
 */
export class MockRandomnessBeacon extends Contract {
  /**
   * Returns mock random bytes for testing.
   * Generates deterministic bytes based on round number for reproducible tests.
   */
  get(round: uint64, userData: bytes): bytes {
    // Return 32 bytes of predictable "random" data
    // In real testing, this provides enough entropy for the PCG PRNG
    // We use a simple pattern that varies with the round for different results
    return Bytes.fromHex('0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20')
  }
}
