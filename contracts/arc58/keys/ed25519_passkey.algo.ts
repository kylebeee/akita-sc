import { bytes, LogicSig, op, TemplateVar } from "@algorandfoundation/algorand-typescript"
import { decodeArc4, StaticBytes } from "@algorandfoundation/algorand-typescript/arc4"
import { sha256 } from "@algorandfoundation/algorand-typescript/op"


export class Ed25519Passkey extends LogicSig {
    
    PK = TemplateVar<StaticBytes<32>>('PK')

    program() {
        const authData = decodeArc4<bytes>(op.arg(0))


        authData: bytes, cdOne: bytes, cdTwo: bytes, cdThree: bytes, sig: StaticBytes<32>

        const h = sha256(authData.concat(sha256(cdOne.concat(cdTwo).concat(cdThree))))

        // if (this.txnGroup.length > 1) {
        //     assert(globals.groupID === base64Decode('URLEncoding', cdTwo))
        // } else {
        //     assert(this.txn.txID === base64Decode('URLEncoding', cdTwo))
        // }

        // assert(ed25519Verify(h, sig, this.PK))

        return true
    }
}
