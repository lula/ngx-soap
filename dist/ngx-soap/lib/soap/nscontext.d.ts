export declare class NamespaceScope {
    parent: any;
    namespaces: any;
    constructor(parent: any);
    getNamespaceURI: (prefix: any, localOnly: any) => any;
    getNamespaceMapping: (prefix: any) => any;
    getPrefix: (nsUri: any, localOnly: any) => any;
}
export declare class NamespaceContext {
    scopes: any[];
    prefixCount: number;
    constructor();
    addNamespace: (prefix: any, nsUri: any, localOnly: any) => boolean;
    pushContext: () => NamespaceScope;
    popContext: () => any;
    getNamespaceURI: (prefix: any, localOnly: any) => any;
    getPrefix: (nsUri: any, localOnly: any) => any;
    registerNamespace: (nsUri: any) => any;
    declareNamespace: (prefix: any, nsUri: any) => boolean;
}
/**
 * Scope for XML namespaces
 * @param [parent] Parent scope
 *
 */
