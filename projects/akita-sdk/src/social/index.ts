import { BaseSDK } from "../base";
import { AkitaSocialClient, AkitaSocialFactory } from '../generated/AkitaSocialClient'
import { NewContractSDKParams } from "../types";

export class AkitaSocialSDK extends BaseSDK<AkitaSocialClient> {

  private ipfsUrl: string;

  constructor(params: NewContractSDKParams & { ipfsUrl: string }) {
    super({ factory: AkitaSocialFactory, ...params });
    this.ipfsUrl = params.ipfsUrl;
  }

  
}