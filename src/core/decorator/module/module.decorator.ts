import {Type} from "../../utils/types/type";
import {ModuleMetadata} from "../../module/module-metadata";
import 'reflect-metadata';
import {ReflectMetadataConstants} from "../../utils/constants/reflect-metadata.constants";

export function Module(metadata: ModuleMetadata) {
    return (target: Type) => {
        Reflect.defineMetadata(ReflectMetadataConstants.SELF_MODULE_METADATA, metadata, target);
    };
}
