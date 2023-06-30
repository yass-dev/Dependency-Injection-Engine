import {Type} from "../../utils/types/type";
import 'reflect-metadata';
import {ReflectMetadataConstants} from "../../utils/constants/reflect-metadata.constants";
import {InjectedParameterMetadata} from "../../utils/types/injected-parameter-metadata";
import {ForwardReference} from "../../utils/types/forward-reference";

export function Inject(clazz: Type | ForwardReference): Function {
    return (target: Type, propertyKey?: string, parameterIndex?: number) => {
        if (parameterIndex !== undefined) {
            const targetInjectedParameters: InjectedParameterMetadata[] = Reflect.getMetadata(ReflectMetadataConstants.SELF_INJECTED_PARAMETERS_METADATA, target) || [];
            targetInjectedParameters.push({
                type: clazz,
                index: parameterIndex
            });
            Reflect.defineMetadata(ReflectMetadataConstants.SELF_INJECTED_PARAMETERS_METADATA, targetInjectedParameters, target);
        }
    }
}
