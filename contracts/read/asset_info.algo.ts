import { Contract } from "@algorandfoundation/tealscript";

export type AssetData = {
    id: uint64;
    name: string;
    unitName: string;
    url: string;
    decimals: uint64;
    total: uint64;
    creator: Address;
    clawback: Address;
    freeze: Address;
    defaultFrozen: boolean;
    reserve: Address;
    manager: Address;
    metadataHash: bytes32;
}

export class AssetInfo extends Contract {
    
    createApplication(): void {}

    deleteApplication(): void {}

    @abi.readonly
    getAssets(assets: AssetID[]): AssetData[] {
        const payload = [];
        for (let i = 0; i < assets.length; i++) {
            const asset = assets[i];
            payload.push({
                id: asset.id,
                name: asset.name,
                unitName: asset.unitName,
                url: asset.url,
                decimals: asset.decimals,
                total: asset.total,
                creator: asset.creator,
                clawback: asset.clawback,
                freeze: asset.freeze,
                defaultFrozen: asset.defaultFrozen,
                reserve: asset.reserve,
                manager: asset.manager,
                metadataHash: asset.metadataHash
            });
        }
        return assets;
    }
}