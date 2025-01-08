import { LogicSig } from '@algorandfoundation/tealscript';

export class Ed25519Passkey extends LogicSig {
  programVersion = 10;

  PK = TemplateVar<bytes32>();
  Y = TemplateVar<bytes32>();

  logic(
    authData: bytes,
    cdOne: bytes,
    cdTwo: bytes,
    cdThree: bytes,
    sig: bytes32,
  ): void {
    const h = sha256(authData + sha256(cdOne + cdTwo + cdThree));

    if (this.txnGroup.length > 1) {
      assert(globals.groupID === base64Decode("URLEncoding", cdTwo));
    } else {
      assert(this.txn.txID === base64Decode("URLEncoding", cdTwo));
    }

    assert(ed25519Verify(h, sig, this.PK));
  }
}