import { StakingPoolFactoryFactory } from '../generated/StakingPoolFactoryClient';
import { StakingPoolSDK } from './index';
import { BaseSDK } from '../base';
import { ENV_VAR_NAMES } from '../config';
import { emptySigner } from '../constants';
import { microAlgo, microAlgos } from '@algorandfoundation/algokit-utils';
/**
 * SDK for interacting with the Staking Pool Factory contract.
 * Used to create new staking pools and manage pool templates.
 */
export class StakingPoolFactorySDK extends BaseSDK {
    constructor(params) {
        super({ factory: StakingPoolFactoryFactory, ...params }, ENV_VAR_NAMES.STAKING_POOL_FACTORY_APP_ID);
    }
    /**
     * Creates a new staking pool via the factory and returns a StakingPoolSDK instance.
     * @returns StakingPoolSDK for the newly created pool
     */
    async new({ sender, signer, title, type, marketplace, stakeKey, minimumStakeAmount, allowLateSignups = false, gateId = 0n, maxEntries = 0n }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        const poolCost = await this.cost();
        const payment = this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: microAlgo(poolCost),
            receiver: this.client.appAddress,
        });
        const group = this.client.newGroup();
        group.newPool({
            ...sendParams,
            args: {
                payment,
                title,
                type,
                marketplace,
                stakeKey,
                minimumStakeAmount,
                allowLateSignups,
                gateId,
                maxEntries
            }
        });
        // Add opUp calls to get more reference slots for impact/social contract calls
        group.opUp({
            ...sendParams,
            args: {},
            maxFee: microAlgos(1000),
        });
        group.opUp({
            ...sendParams,
            args: {},
            maxFee: microAlgos(1000),
            note: '1'
        });
        const result = await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
        // Extract appId from the newPool call result
        const appId = result.returns[0];
        if (appId === undefined) {
            throw new Error('Failed to create new staking pool');
        }
        return new StakingPoolSDK({
            algorand: this.algorand,
            factoryParams: {
                appId,
                defaultSender: sendParams.sender,
                defaultSigner: sendParams.signer
            }
        });
    }
    /**
     * Gets a StakingPoolSDK instance for an existing pool.
     * Note: Cannot be static as it requires instance properties (algorand, sendParams).
     * @param appId - The app ID of the pool
     * @returns StakingPoolSDK for the specified pool
     */
    get({ appId }) {
        return new StakingPoolSDK({
            algorand: this.algorand,
            factoryParams: {
                appId,
                defaultSender: this.sendParams.sender,
                defaultSigner: this.sendParams.signer
            }
        });
    }
    /**
     * Gets the cost to create a new staking pool.
     */
    async cost(params) {
        const sendParams = this.getSendParams({
            sender: this.readerAccount,
            signer: emptySigner,
            ...params
        });
        const cost = await this.client.newPoolCost({
            ...sendParams,
            args: {}
        });
        return cost;
    }
    /**
     * Deletes a pool created by this factory.
     */
    async deletePool({ sender, signer, appId }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.deletePool({
            ...sendParams,
            args: { appId }
        });
    }
    /**
     * Sets the escrow app ID for the factory.
     */
    async setEscrow({ sender, signer, escrow }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.setEscrow({
            ...sendParams,
            args: { escrow }
        });
    }
    /**
     * Gets MBR (Minimum Balance Requirement) data for pool operations.
     */
    async getMbr({ winningTickets }) {
        return await this.client.mbr({ args: { winningTickets } });
    }
}
/**
 * Convenience function to create a new staking pool and return the SDK.
 * Creates a factory SDK, creates the pool, and returns the pool SDK.
 */
export async function newStakingPool({ factoryParams, algorand, readerAccount, sendParams, ...poolParams }) {
    const factory = new StakingPoolFactorySDK({ factoryParams, algorand, readerAccount, sendParams });
    return await factory.new(poolParams);
}
//# sourceMappingURL=factory.js.map