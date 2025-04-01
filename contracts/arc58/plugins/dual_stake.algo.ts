import { Contract } from '@algorandfoundation/tealscript'
import { DualStake } from '../../../utils/types/dual_stake'

export class DualStakePlugin extends Contract {
    programVersion = 10

    appID = GlobalStateKey<AppID>({ key: 'appID' })

    createApplication(appID: AppID): void {
        this.appID.value = appID
    }

    registerOnline(
        sender: AppID,
        rekeyBack: boolean,
        selectionKey: bytes,
        votingKey: bytes,
        spKey: bytes,
        firstRound: uint64,
        lastRound: uint64,
        keyDilution: uint64
    ): void {
        sendMethodCall<typeof DualStake.prototype.register_online, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [selectionKey, votingKey, spKey, firstRound, lastRound, keyDilution],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    registerOffline(sender: AppID, rekeyBack: boolean, address: Address): void {
        sendMethodCall<typeof DualStake.prototype.register_offline, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [address],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    initStorage(sender: AppID, rekeyBack: boolean): void {
        sendMethodCall<typeof DualStake.prototype.init_storage, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    withdrawPlatformFees(sender: AppID, rekeyBack: boolean, amt: uint64): void {
        sendMethodCall<typeof DualStake.prototype.withdraw_platform_fees, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [amt],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    mint(sender: AppID, rekeyBack: boolean): void {
        sendMethodCall<typeof DualStake.prototype.mint, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    burn(sender: AppID, rekeyBack: boolean): void {
        sendMethodCall<typeof DualStake.prototype.burn, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    nullun(sender: AppID, rekeyBack: boolean): void {
        sendMethodCall<typeof DualStake.prototype.nullun, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    createAsset(sender: AppID, rekeyBack: boolean, lstAsaName: bytes, lstUnitName: bytes): void {
        sendMethodCall<typeof DualStake.prototype.create_asset, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [lstAsaName, lstUnitName],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    configure(
        sender: AppID,
        rekeyBack: boolean,
        lstAsaName: bytes,
        lstUnitName: bytes,
        asaID: uint64,
        lpType: bytes,
        lpID: bytes,
        platformFeeBps: uint64,
        noderunnerFeeBps: uint64,
        adminAddr: Address,
        noderunnerAddr: Address
    ): void {
        sendMethodCall<typeof DualStake.prototype.configure, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [
                lstAsaName,
                lstUnitName,
                asaID,
                lpType,
                lpID,
                platformFeeBps,
                noderunnerFeeBps,
                adminAddr,
                noderunnerAddr,
            ],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    changeAdmin1(sender: AppID, rekeyBack: boolean, newAdmin: Address): void {
        sendMethodCall<typeof DualStake.prototype.change_admin_1, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [newAdmin],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    changeAdmin2(sender: AppID, rekeyBack: boolean): void {
        sendMethodCall<typeof DualStake.prototype.change_admin_2, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    changeNoderunner(sender: AppID, rekeyBack: boolean, newNoderunner: Address): void {
        sendMethodCall<typeof DualStake.prototype.change_noderunner, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [newNoderunner],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    changeFeeAddr(sender: AppID, rekeyBack: boolean, newFeeAddr: Address): void {
        sendMethodCall<typeof DualStake.prototype.change_feeaddr, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [newFeeAddr],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }
}
