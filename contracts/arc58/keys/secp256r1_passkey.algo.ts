import { LogicSig } from '@algorandfoundation/tealscript';

export class Secp256r1Passkey extends LogicSig {
  programVersion = 10;

  X = TemplateVar<bytes32>();
  Y = TemplateVar<bytes32>();

  logic(
    authData: bytes,
    cdOne: bytes,
    cdTwo: bytes,
    cdThree: bytes,
    sSig: bytes32,
    rSig: bytes32
  ): void {

    const c = sha256(cdOne + cdTwo + cdThree);
    const h = sha256(authData + c);

    if (this.txnGroup.length > 1) {
      assert(globals.groupID === base64Decode("URLEncoding", cdTwo));
    } else {
      assert(this.txn.txID === base64Decode("URLEncoding", cdTwo));
    }

    assert(ecdsaVerify("Secp256r1", h, sSig, rSig, this.X, this.Y));
  }
}
