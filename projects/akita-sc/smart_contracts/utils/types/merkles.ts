import { arc4, bytes } from '@algorandfoundation/algorand-typescript'

export type Leaf = bytes<32>

export type Proof = bytes<32>[]
