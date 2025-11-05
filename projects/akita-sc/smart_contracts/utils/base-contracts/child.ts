import { GlobalState } from '@algorandfoundation/algorand-typescript'
import { Contract } from '@algorandfoundation/algorand-typescript/arc4'
import { GlobalStateKeyFunder } from '../../constants'

import { FunderInfo } from '../types/mbr'

export class ChildContract extends Contract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  funder = GlobalState<FunderInfo>({ key: GlobalStateKeyFunder })
}