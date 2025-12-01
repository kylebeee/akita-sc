import { Uint64 } from "@algorandfoundation/algorand-typescript/arc4";
import { arc4Heartbeat } from "./types";

export function emptyHeartbeat(): arc4Heartbeat {
    return new arc4Heartbeat({
        held: new Uint64(0),
        hard: new Uint64(0),
        lock: new Uint64(0),
        timestamp: new Uint64(0),
    })
}