export declare class NamespaceScope {
    namespaces: any;
    parent: any;
    /**
     * Scope for XML namespaces
     * @param {NamespaceScope} [parent] Parent scope
     * @returns {NamespaceScope}
     * @constructor
     */
    constructor(parent: any);
    /**
     * Look up the namespace URI by prefix
     * @param {String} prefix Namespace prefix
     * @param {Boolean} [localOnly] Search current scope only
     * @returns {String} Namespace URI
     */
    getNamespaceURI(prefix: any, localOnly: any): any;
    getNamespaceMapping(prefix: any): any;
    /**
     * Look up the namespace prefix by URI
     * @param {String} nsUri Namespace URI
     * @param {Boolean} [localOnly] Search current scope only
     * @returns {String} Namespace prefix
     */
    getPrefix(nsUri: any, localOnly: any): any;
}
/**
 * Namespace context that manages hierarchical scopes
 * @returns {NamespaceContext}
 * @constructor
 */
export declare class NamespaceContext {
    currentScope: any;
    prefixCount: number;
    scopes: any[];
    constructor();
    /**
   * Add a prefix/URI namespace mapping
   * @param {String} prefix Namespace prefix
   * @param {String} nsUri Namespace URI
   * @param {Boolean} [localOnly] Search current scope only
   * @returns {boolean} true if the mapping is added or false if the mapping
   * already exists
   */
    addNamespace(prefix: any, nsUri: any, localOnly: any): boolean;
    /**
     * Push a scope into the context
     * @returns {NamespaceScope} The current scope
     */
    pushContext(): NamespaceScope;
    /**
   * Pop a scope out of the context
   * @returns {NamespaceScope} The removed scope
   */
    popContext(): any;
    /**
     * Look up the namespace URI by prefix
     * @param {String} prefix Namespace prefix
     * @param {Boolean} [localOnly] Search current scope only
     * @returns {String} Namespace URI
     */
    getNamespaceURI(prefix: any, localOnly: any): any;
    /**
   * Look up the namespace prefix by URI
   * @param {String} nsURI Namespace URI
   * @param {Boolean} [localOnly] Search current scope only
   * @returns {String} Namespace prefix
   */
    getPrefix(nsUri: any, localOnly: any): any;
    /**
     * Register a namespace
     * @param {String} nsUri Namespace URI
     * @returns {String} The matching or generated namespace prefix
     */
    registerNamespace: (nsUri: any) => any;
    /**
     * Declare a namespace prefix/uri mapping
     * @param {String} prefix Namespace prefix
     * @param {String} nsUri Namespace URI
     * @returns {Boolean} true if the declaration is created
     */
    declareNamespace(prefix: any, nsUri: any): boolean;
}
