import {Type} from "../utils/types/type";
import {ModuleMetadata} from "../module/module-metadata";
import {ReflectMetadataConstants} from "../utils/constants/reflect-metadata.constants";
import {InjectedParameterMetadata} from "../utils/types/injected-parameter-metadata";
import {Dependency} from "../utils/types/dependency";
import {ForwardReference} from "../utils/types/forward-reference";
import {Instance} from "../utils/types/instance";

export class YassContainer {
    private static _providersInstances: Map<Type, Instance> = new Map<Type, Instance>();

    public static initialize(module: Type): void {
        const moduleMetadata: ModuleMetadata | undefined = Reflect.getMetadata(ReflectMetadataConstants.SELF_MODULE_METADATA, module);
        if (moduleMetadata === undefined) {
            throw new Error(`${module.name} is not a module. Make sur that you have put the @Module decorator on ${module.name} declaration.`);
        }
        this._initializeProviders(moduleMetadata.providers);
    }

    public static resolve(type: Type): Instance {
        return this._providersInstances.get(type);
    }

    private static _initializeProviders(providers: Type[]): void {
        this._createProvidersPrototypes(providers);
        this._instantiateProviders(providers);
        this._completeProvidersInitialization();
    }

    private static _completeProvidersInitialization(): void {
        this._providersInstances.forEach((providerInstance: Instance) => {
            this._callOnInitHook(providerInstance);
        });
    }

    private static _callOnInitHook(providerInstance: Instance): void {
        if (providerInstance.onInit !== undefined) {
            providerInstance.onInit();
        }
    }

    private static _createProvidersPrototypes(providers: Type[]): void {
        providers.forEach(this._createProviderPrototype.bind(this));
    }

    private static _createProviderPrototype(provider: Type): void {
        if (Reflect.getMetadata(ReflectMetadataConstants.SELF_INJECTABLE, provider) === undefined) {
            throw new Error(`Class ${provider.name} is not injectable. Make sur that you have put the @Injectable decorator on ${provider.name} declaration.`);
        }
        const instance: Instance = Object.create(provider.prototype);
        this._providersInstances.set(provider, instance);
    }

    private static _instantiateProviders(providers: Type[]): void {
        providers.forEach(this._instantiateProvider.bind(this));
    }

    private static _instantiateProvider(provider: Type): void {
        const providerDependencies: Dependency[] = this._getProviderDependencies(provider);
        const providerDependenciesInstances: Instance[] = this._getDependenciesInstances(providerDependencies);
        const currentProviderInstance: Instance = this._providersInstances.get(provider);
        this._callProviderInstanceConstructor(provider, currentProviderInstance, providerDependenciesInstances);
    }

    private static _getDependenciesInstances(dependencies: Dependency[]): Instance[] {
        return dependencies.map(this._getDependencyInstance.bind(this));
    }

    private static _getDependencyInstance(dependency: Type | ForwardReference): Instance {
        const resolvedDependency: Type = this._resolveForwardReference(dependency);
        return this._providersInstances.get(resolvedDependency);
    }

    private static _resolveForwardReference(dependency: Type | ForwardReference): Type {
        let resolvedDependency: Type | ForwardReference = dependency;
        if ((dependency as ForwardReference).forwardRef) {
            resolvedDependency = (dependency as ForwardReference).forwardRef();
        }
        return resolvedDependency as Type;
    }

    private static _getProviderDependencies(provider: Type): Dependency[] {
        const dependencies: Dependency[] = this._getConstructorDependencies(provider);
        const injectedParametersMetadata: InjectedParameterMetadata[] = this._getInjectedParametersMetadata(provider);
        injectedParametersMetadata.forEach((injectedParameterMetadata: InjectedParameterMetadata) => {
            dependencies[injectedParameterMetadata.index] = injectedParameterMetadata.type;
        });
        return dependencies;
    }

    private static _getInjectedParametersMetadata(provider: Type): InjectedParameterMetadata[] {
        return Reflect.getMetadata(ReflectMetadataConstants.SELF_INJECTED_PARAMETERS_METADATA, provider) || [];
    }

    private static _getConstructorDependencies(provider: Type): Dependency[] {
        return Reflect.getMetadata(ReflectMetadataConstants.NATIF_DESIGN_PARAM_TYPES, provider) || [];
    }

    private static _callProviderInstanceConstructor(provider: Type, currentProviderInstance: Instance, providerDependenciesInstances: Instance[]): void {
        provider.apply(currentProviderInstance, providerDependenciesInstances);
    }
}
