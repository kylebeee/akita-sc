import { Contract } from '@algorandfoundation/tealscript';
import { Gate } from '../gates/gate.algo';
import { AkitaAppIDsGate } from '../../utils/constants';

// action contracts exist to formally manage interactible social elements of akita
// they embed gate checking logic
// expose their own state variables
// and provide a generalized way to interact

// do gates need to be built into the used contract?
// or can they be built into the action contract?
// or both?

// an action should include the appID, the action name, and the arguments including the gate filter index

// pipe actions together
// meta-actions or something basically chain IFTT
// 

// current feature goals
// - polling
// - selling an NFT
// - bidding on an auction
// - subscribing
// - paying
// - participating in a staking pool
// - airdrops
// - minting an NFT
// - accepting an offer
// - swapping assets
// - shuffling NFTs

// - posts as NFT collectibles
// - posts as fungible tokens

export class Action extends Contract {

    gateIndex = GlobalStateKey<uint64>({ key: 'gate_index' });

    private gate(gateID: uint64, args: bytes[]): boolean {
        return sendMethodCall<typeof Gate.prototype.check, boolean>({
            applicationID: AppID.fromUint64(AkitaAppIDsGate),
            methodArgs: [
                gateID,
                args,
            ],
            fee: 0
        });
    }

    call(gateArgs: bytes[], args: bytes): void {
        assert(this.gate(this.gateIndex.value, gateArgs), 'Gate check failed');

    }
}
