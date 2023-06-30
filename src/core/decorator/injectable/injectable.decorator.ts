import {ReflectMetadataConstants} from "../../utils/constants/reflect-metadata.constants";

export function Injectable() {
    return (target: any) => {
        Reflect.defineMetadata(ReflectMetadataConstants.SELF_INJECTABLE, true, target);
    };
}
