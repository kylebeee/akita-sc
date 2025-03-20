import { arc4 } from "@algorandfoundation/algorand-typescript";

export type Leaf = arc4.StaticBytes<32>

export type Proof = arc4.DynamicArray<arc4.StaticBytes<32>>