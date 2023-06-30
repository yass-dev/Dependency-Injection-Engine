import {Type} from "./type";
import {ForwardReference} from "./forward-reference";

export type InjectedParameterMetadata = {
    type: Type | ForwardReference,
    index: number;
}
