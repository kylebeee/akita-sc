import { Contract, uint64 } from '@algorandfoundation/algorand-typescript'

export class NFDRegistry extends Contract {
    // {
    //   "name": "isValidNfdAppId",
    //   "args": [
    //     {
    //       "name": "nfdName",
    //       "type": "string"
    //     },
    //     {
    //       "name": "nfdAppId",
    //       "type": "uint64"
    //     }
    //   ],
    //   "returns": {
    //     "type": "bool"
    //   },
    //   "actions": {
    //     "create": [],
    //     "call": [
    //       "NoOp"
    //     ]
    //   }
    // },
    isValidNfdAppId(nfdName: string, nfdAppId: uint64): boolean {
        return false
    }


}
