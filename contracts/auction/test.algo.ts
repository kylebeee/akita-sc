import { Contract } from "@algorandfoundation/tealscript";

export type Data = {
    value: uint64
    bool: boolean
}

export class Test extends Contract {
    boxes = BoxMap<uint64, Data>({ prefix: 'a' })

    init() {
        this.boxes(0).value = { value: 0, bool: false }
    }

    doStuff(id: uint64) {
        assert(this.boxes(id).exists)
        const box = this.boxes(id).value.bool
        assert(!box)
        this.boxes(id).value.bool = true
    }
}