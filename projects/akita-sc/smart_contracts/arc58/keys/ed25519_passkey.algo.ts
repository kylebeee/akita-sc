import { assert, bytes, LogicSig, op, TemplateVar } from "@algorandfoundation/algorand-typescript"
import { decodeArc4 } from "@algorandfoundation/algorand-typescript/arc4"
import { base64Decode, ed25519verify, Global, sha256, Txn } from "@algorandfoundation/algorand-typescript/op"

const PK = TemplateVar<bytes>('PK')

export class Ed25519Passkey extends LogicSig {

    program() {
        const authData = decodeArc4<bytes>(op.arg(0))
        const cdOne = decodeArc4<bytes>(op.arg(1))
        const cdTwo = decodeArc4<bytes>(op.arg(2))
        const cdThree = decodeArc4<bytes>(op.arg(3))
        const sig = decodeArc4<bytes>(op.arg(4))

        const h = sha256(authData.concat(sha256(cdOne.concat(cdTwo).concat(cdThree))))

        if (Global.groupSize > 1) {
            assert(Global.groupId === base64Decode(op.Base64.URLEncoding, cdTwo))
        } else {
            assert(Txn.txId === base64Decode(op.Base64.URLEncoding, cdTwo))
        }

        return ed25519verify(h, sig, PK)
    }
}
