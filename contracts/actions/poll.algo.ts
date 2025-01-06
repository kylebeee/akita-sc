import { Contract } from '@algorandfoundation/tealscript';
import { AkitaAppIDsAkitaSocialImpactPlugin, AkitaAppIDsGate } from '../../utils/constants';
import { Gate } from '../gates/gate.algo';
import { AkitaSocialImpact } from '../arc58/plugins/social/impact.algo';

const errs = {
    BAD_DEPLOYER: 'Must be deployed by an application',
    INVALID_END_TIME: 'End time must be in the future',
    INVALID_POLL_TYPE: 'Invalid poll type',
    INVALID_OPTION_COUNT: 'Invalid number of options, must be between 2 and 5',
    INVALID_MAX_SELECTION: 'Invalid maximum selection',
    POLL_ENDED: 'Poll has ended',
    POLL_ACTIVE: 'Poll is still active',
    PLUGIN_NOT_AUTH_ADDR: 'This plugin does not have control of the account',
    ALREADY_VOTED: 'User has already voted',
    INVALID_VOTE: 'Invalid vote args',
    INVALID_VOTE_COUNT: 'Invalid number of vote args',
    INVALID_VOTE_OPTION: 'Invalid vote option',
    FAILED_GATE: 'Failed gate check',
}

export type PollType = uint64;
export const SingleChoice: PollType = 0;
export const MultipleChoice: PollType = 1;
export const SingleChoiceImpact: PollType = 2;
export const MultipleChoiceImpact: PollType = 3;

export class Poll extends Contract {
    programVersion = 10;

    /** The type of poll: SingleChoice, MultipleChoice, SingleChoiceImpact or MultipleChoiceImpact */
    type = GlobalStateKey<uint64>({ key: 'type' });
    /** the gate id to be used for filtering who can interact with this poll */
    gateID = GlobalStateKey<uint64>({ key: 'gate_id' });
    /** the time the poll ends as a unix timestamp */
    endTime = GlobalStateKey<uint64>({ key: 'end_time' });
    /** the number of options in the poll */
    optionCount = GlobalStateKey<uint64>({ key: 'option_count' });
    /** the maximum number of selections in a multiple choice poll */
    maxSelected = GlobalStateKey<uint64>({ key: 'max_selected' });
    /** the number of boxes created during the poll */
    boxCount = GlobalStateKey<uint64>({ key: 'box_count' });
    /** the question being asked */
    question = GlobalStateKey<string>({ key: 'question' });

    /** the options and vote counts of the poll */
    optionOne = GlobalStateKey<string>({ key: 'option_one' });
    votesOne = GlobalStateKey<uint64>({ key: 'votes_one' });

    optionTwo = GlobalStateKey<string>({ key: 'option_two' });
    votesTwo = GlobalStateKey<uint64>({ key: 'votes_two' });

    optionThree = GlobalStateKey<string>({ key: 'option_three' });
    votesThree = GlobalStateKey<uint64>({ key: 'votes_three' });

    optionFour = GlobalStateKey<string>({ key: 'option_four' });
    votesFour = GlobalStateKey<uint64>({ key: 'votes_four' });

    optionFive = GlobalStateKey<string>({ key: 'option_five' });
    votesFive = GlobalStateKey<uint64>({ key: 'votes_five' });

    /**
     * A map of addresses to empty bytes to track who has voted
     * 
     * 
    */
    votes = BoxMap<Address, bytes<0>>();

    private controls(address: Address): boolean {
        return address.authAddr === this.app.address;
    }

    private gate(args: bytes[]): boolean {
        return sendMethodCall<typeof Gate.prototype.check, boolean>({
            applicationID: AppID.fromUint64(AkitaAppIDsGate),
            methodArgs: [
                this.gateID.value,
                args,
            ],
            fee: 0
        });
    }

    private getUserImpact(user: Address): uint64 {
        return sendMethodCall<typeof AkitaSocialImpact.prototype.getUserImpact, uint64>({
            applicationID: AppID.fromUint64(AkitaAppIDsAkitaSocialImpactPlugin),
            methodArgs: [ user ],
            fee: 0,
        });
    }

    createApplication(
        type: PollType,
        gateID: uint64,
        endTime: uint64,
        maxSelected: uint64,
        question: string,
        options: string[],
    ): void {
        assert(globals.callerApplicationID !== AppID.fromUint64(0), errs.BAD_DEPLOYER);
        assert(globals.latestTimestamp < endTime, errs.INVALID_END_TIME);
        assert(type < 4, errs.INVALID_POLL_TYPE);

        this.type.value = type;
        this.gateID.value = gateID;
        this.endTime.value = endTime;
        this.question.value = question;

        assert(options.length >= 2 && options.length <= 5, errs.INVALID_OPTION_COUNT);

        if (type === MultipleChoice || type === MultipleChoiceImpact) {
            assert(maxSelected >= 2 && maxSelected <= (options.length - 1), errs.INVALID_MAX_SELECTION);
            this.maxSelected.value = maxSelected;
        }

        this.optionCount.value = options.length;
        this.boxCount.value = 0;

        this.optionOne.value = options[0];
        this.optionTwo.value = options[1];

        if (options.length >= 3) {
            this.optionThree.value = options[2];
        }

        if (options.length >= 4) {
            this.optionFour.value = options[3];
        }

        if (options.length >= 5) {
            this.optionFive.value = options[4];
        }
    }

    vote(sender: AppID, rekeyBack: boolean, votes: uint64[], args: bytes[]): void {
        assert(globals.latestTimestamp <= this.endTime.value, errs.POLL_ENDED);
        assert(this.controls(sender.address), errs.PLUGIN_NOT_AUTH_ADDR);
        assert(!this.votes(sender.address).exists, errs.ALREADY_VOTED);
        assert(votes.length <= 5 && votes.length >= 1, errs.INVALID_VOTE);
        assert(this.gate(args), errs.FAILED_GATE);

        sendPayment({
            sender: sender.address,
            receiver: this.app.address,
            amount: 15_300,
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
        });

        let impact = 1;
        if (this.type.value === SingleChoiceImpact || this.type.value === MultipleChoiceImpact) {
            impact = this.getUserImpact(sender.address);
        }

        if (this.type.value === SingleChoice || this.type.value === SingleChoiceImpact) {
            assert(votes.length === 1, errs.INVALID_VOTE_COUNT);

            if (votes[0] === 0) {
                this.votesOne.value += 1;
            } else if (votes[0] === 1) {
                this.votesTwo.value += 1;
            } else if (votes[0] === 2) {
                this.votesThree.value += 1;
            } else if (votes[0] === 3) {
                this.votesFour.value += 1;
            } else if (votes[0] === 4) {
                this.votesFive.value += 1;
            }
        } else {
            assert(votes.length <= this.maxSelected.value, errs.INVALID_VOTE_COUNT);

            for (let i = 0; i < votes.length; i += 1) {
                assert(votes[i] <= (this.optionCount.value - 1), errs.INVALID_VOTE_OPTION);

                if (votes[i] === 0) {
                    this.votesOne.value += impact;
                } else if (votes[i] === 1) {
                    this.votesTwo.value += impact;
                } else if (votes[i] === 2) {
                    this.votesThree.value += impact;
                } else if (votes[i] === 3) {
                    this.votesFour.value += impact;
                } else if (votes[i] === 4) {
                    this.votesFive.value += impact;
                }
            }
        }

        this.votes(sender.address).create();
        this.boxCount.value += 1;
    }

    deleteBoxes(address: Address): void {
        assert(globals.latestTimestamp > this.endTime.value, errs.POLL_ACTIVE);
        this.votes(address).delete();
        this.boxCount.value -= 1;
    }
}