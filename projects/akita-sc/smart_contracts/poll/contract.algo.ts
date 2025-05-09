import {
    Account,
    arc4,
    assert,
    BoxMap,
    GlobalState,
    gtxn,
    itxn,
    uint64,
} from '@algorandfoundation/algorand-typescript'
import { classes } from 'polytype'
import { abimethod, Address, StaticBytes } from '@algorandfoundation/algorand-typescript/arc4'
import { Global, Txn } from '@algorandfoundation/algorand-typescript/op'
import { ContractWithGate } from '../utils/base-contracts/gate'
import {
    PollGlobalStateKeyBoxCount,
    PollGlobalStateKeyEndTime,
    PollGlobalStateKeyGateID,
    PollGlobalStateKeyMaxSelected,
    PollGlobalStateKeyOptionCount,
    PollGlobalStateKeyOptionFive,
    PollGlobalStateKeyOptionFour,
    PollGlobalStateKeyOptionOne,
    PollGlobalStateKeyOptionThree,
    PollGlobalStateKeyOptionTwo,
    PollGlobalStateKeyQuestion,
    PollGlobalStateKeyType,
    PollGlobalStateKeyVotesFive,
    PollGlobalStateKeyVotesFour,
    PollGlobalStateKeyVotesOne,
    PollGlobalStateKeyVotesThree,
    PollGlobalStateKeyVotesTwo,
} from './constants'
import { AkitaBaseContract } from '../utils/base-contracts/base'
import { MultipleChoice, MultipleChoiceImpact, PollType, SingleChoice, SingleChoiceImpact } from './types'
import {
    ERR_ALREADY_VOTED,
    ERR_BAD_DEPLOYER,
    ERR_FAILED_GATE,
    ERR_INVALID_END_TIME,
    ERR_INVALID_MAX_SELECTION,
    ERR_INVALID_OPTION_COUNT,
    ERR_INVALID_POLL_TYPE,
    ERR_INVALID_VOTE,
    ERR_INVALID_VOTE_COUNT,
    ERR_INVALID_VOTE_OPTION,
    ERR_POLL_ACTIVE,
    ERR_POLL_ENDED,
} from './errors'
import { GateArgs } from '../utils/types/gates'
import { ERR_INVALID_PAYMENT_AMOUNT, ERR_INVALID_PAYMENT_RECEIVER } from '../utils/errors'

export class Poll extends classes(AkitaBaseContract, ContractWithGate) {
    /** The type of poll: SingleChoice, MultipleChoice, SingleChoiceImpact or MultipleChoiceImpact */
    type = GlobalState<arc4.UintN8>({ key: PollGlobalStateKeyType })
    /** the gate id to be used for filtering who can interact with this poll */
    gateID = GlobalState<uint64>({ key: PollGlobalStateKeyGateID })
    /** the time the poll ends as a unix timestamp */
    endTime = GlobalState<uint64>({ key: PollGlobalStateKeyEndTime })
    /** the number of options in the poll */
    optionCount = GlobalState<uint64>({ key: PollGlobalStateKeyOptionCount })
    /** the maximum number of selections in a multiple choice poll */
    maxSelected = GlobalState<uint64>({ key: PollGlobalStateKeyMaxSelected })
    /** the number of boxes created during the poll */
    boxCount = GlobalState<uint64>({ key: PollGlobalStateKeyBoxCount })
    /** the question being asked */
    question = GlobalState<string>({ key: PollGlobalStateKeyQuestion })
    /** the options and vote counts of the poll */
    optionOne = GlobalState<string>({ key: PollGlobalStateKeyOptionOne })
    optionTwo = GlobalState<string>({ key: PollGlobalStateKeyOptionTwo })
    optionThree = GlobalState<string>({ key: PollGlobalStateKeyOptionThree })
    optionFour = GlobalState<string>({ key: PollGlobalStateKeyOptionFour })
    optionFive = GlobalState<string>({ key: PollGlobalStateKeyOptionFive })

    votesOne = GlobalState<uint64>({ key: PollGlobalStateKeyVotesOne })
    votesTwo = GlobalState<uint64>({ key: PollGlobalStateKeyVotesTwo })
    votesThree = GlobalState<uint64>({ key: PollGlobalStateKeyVotesThree })
    votesFour = GlobalState<uint64>({ key: PollGlobalStateKeyVotesFour })
    votesFive = GlobalState<uint64>({ key: PollGlobalStateKeyVotesFive })

    /** A map of addresses to empty bytes to track who has voted */
    votes = BoxMap<Account, StaticBytes<0>>({ keyPrefix: '' })

    private mbr(): uint64 {
        return 15_300
    }

    @abimethod({ onCreate: 'require' })
    createApplication(
        type: PollType,
        endTime: uint64,
        maxSelected: uint64,
        question: string,
        options: string[],
        gateID: uint64
    ): void {
        assert(Global.callerApplicationId !== 0, ERR_BAD_DEPLOYER)
        assert(Global.latestTimestamp < endTime, ERR_INVALID_END_TIME)
        assert(type.native < 4, ERR_INVALID_POLL_TYPE)

        this.type.value = type
        this.gateID.value = gateID
        this.endTime.value = endTime
        this.question.value = question

        assert(options.length >= 2 && options.length <= 5, ERR_INVALID_OPTION_COUNT)

        if (type === MultipleChoice || type === MultipleChoiceImpact) {
            assert(maxSelected >= 2 && maxSelected <= options.length - 1, ERR_INVALID_MAX_SELECTION)
            this.maxSelected.value = maxSelected
        }

        this.optionCount.value = options.length
        this.boxCount.value = 0

        this.optionOne.value = options[0]
        this.optionTwo.value = options[1]

        if (options.length >= 3) {
            this.optionThree.value = options[2]
        }

        if (options.length >= 4) {
            this.optionFour.value = options[3]
        }

        if (options.length >= 5) {
            this.optionFive.value = options[4]
        }
    }

    vote(payment: gtxn.PaymentTxn, votes: uint64[], args: GateArgs): void {
        assert(Global.latestTimestamp <= this.endTime.value, ERR_POLL_ENDED)
        const arc4Sender = new Address(Txn.sender)
        assert(!this.votes(Txn.sender).exists, ERR_ALREADY_VOTED)
        assert(votes.length <= 5 && votes.length >= 1, ERR_INVALID_VOTE)
        assert(this.gate(arc4Sender, this.gateID.value, args), ERR_FAILED_GATE)

        assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
        assert(payment.amount === this.mbr(), ERR_INVALID_PAYMENT_AMOUNT)

        let impact: uint64 = 1
        if (this.type.value === SingleChoiceImpact || this.type.value === MultipleChoiceImpact) {
            impact = this.getUserImpact(Txn.sender)
        }

        if (this.type.value === SingleChoice || this.type.value === SingleChoiceImpact) {
            assert(votes.length === 1, ERR_INVALID_VOTE_COUNT)

            if (votes[0] === 0) {
                this.votesOne.value += 1
            } else if (votes[0] === 1) {
                this.votesTwo.value += 1
            } else if (votes[0] === 2) {
                this.votesThree.value += 1
            } else if (votes[0] === 3) {
                this.votesFour.value += 1
            } else if (votes[0] === 4) {
                this.votesFive.value += 1
            }
        } else {
            assert(votes.length <= this.maxSelected.value, ERR_INVALID_VOTE_COUNT)

            for (let i: uint64 = 0; i < votes.length; i += 1) {
                assert(votes[i] <= this.optionCount.value - 1, ERR_INVALID_VOTE_OPTION)

                if (votes[i] === 0) {
                    this.votesOne.value += impact
                } else if (votes[i] === 1) {
                    this.votesTwo.value += impact
                } else if (votes[i] === 2) {
                    this.votesThree.value += impact
                } else if (votes[i] === 3) {
                    this.votesFour.value += impact
                } else if (votes[i] === 4) {
                    this.votesFive.value += impact
                }
            }
        }

        this.votes(Txn.sender).value = new arc4.StaticBytes<0>()
        this.boxCount.value += 1
    }

    deleteBoxes(address: Address): void {
        assert(Global.latestTimestamp > this.endTime.value, ERR_POLL_ACTIVE)

        this.votes(address.native).delete()

        itxn.payment({
            receiver: address.native,
            amount: this.mbr(),
            note: 'MBR refund for poll vote',
        }).submit()

        this.boxCount.value -= 1
    }
}
