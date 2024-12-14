import { Contract } from '@algorandfoundation/tealscript';
import { AkitaAppIDsGate } from '../../utils/constants';
import { Gate } from '../gates/gate.algo';

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

export class PollFactory extends Contract {
    
    // mints new Poll contracts
    mint(filterIndex: uint64, args: bytes): AppID {



        // mint a new poll contract
        return AppID.fromUint64(0)
    }
}

export type PollValue = {
    question: string;
    answers: string[];
    votes: uint64[];
}

export class Poll extends Contract {
    programVersion = 10;

    question = GlobalStateKey<string>({ key: 'q' });

    optionOne = GlobalStateKey<string>({ key: 'o1' });
    optionTwo = GlobalStateKey<string>({ key: 'o2' });
    optionThree = GlobalStateKey<string>({ key: 'o3' });
    optionFour = GlobalStateKey<string>({ key: 'o4' });
    optionFive = GlobalStateKey<string>({ key: 'o5' });

    votesOne = GlobalStateKey<uint64>({ key: 'v1' });
    votesTwo = GlobalStateKey<uint64>({ key: 'v2' });
    votesThree = GlobalStateKey<uint64>({ key: 'v3' });
    votesFour = GlobalStateKey<uint64>({ key: 'v4' });
    votesFive = GlobalStateKey<uint64>({ key: 'v5' });

    private gate(filterIndex: uint64, args: bytes[]): boolean {
        return sendMethodCall<typeof Gate.prototype.check, boolean>({
            applicationID: AppID.fromUint64(AkitaAppIDsGate),
            methodArgs: [
                filterIndex,
                args,
            ],
            fee: 0
        });
    }

    useGate(index: uint64, args: bytes[]): void {
        assert(this.gate(index, args), 'Gate check failed');
    }
}