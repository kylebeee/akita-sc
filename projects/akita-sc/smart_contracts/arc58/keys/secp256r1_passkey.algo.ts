import { assert, bytes, LogicSig, op, TemplateVar } from '@algorandfoundation/algorand-typescript'
import { decodeArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { base64Decode, ecdsaVerify, Global, sha256, Txn } from '@algorandfoundation/algorand-typescript/op'

const X = TemplateVar<bytes<32>>('X')
const Y = TemplateVar<bytes<32>>('Y')

export class Secp256r1Passkey extends LogicSig {

    program() {
        const authData = op.arg(0)
        const cdOne = op.arg(1)
        const cdTwo = op.arg(2)
        const cdThree = op.arg(3)
        const sSig = op.arg(4).toFixed({ length: 32 })
        const rSig = op.arg(5).toFixed({ length: 32 })

        const h = sha256(authData.concat(sha256(cdOne.concat(cdTwo).concat(cdThree))))

        if (Global.groupSize > 1) {
            assert(Global.groupId === base64Decode(op.Base64.URLEncoding, cdTwo))
        } else {
            assert(Txn.txId === base64Decode(op.Base64.URLEncoding, cdTwo))
        }

        return ecdsaVerify(op.Ecdsa.Secp256r1, h, sSig, rSig, X, Y)
    }
}
