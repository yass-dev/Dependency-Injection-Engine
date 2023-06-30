import {ForwardReference} from "../types/forward-reference";

export function forwardRef(fn: () => any): ForwardReference {
    return {
        forwardRef: fn
    };
}
