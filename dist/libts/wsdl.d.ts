export declare function openWsdl(wsdlDef: string, options?: any): Promise<WSDL>;
export declare class WSDL {
    xml: any;
    services: any[];
    definition: any;
    definitions: any;
    _originalIgnoredNamespaces: any;
    options: any;
    _includesWsdl: any[];
    ignoredNamespaces: string[];
    ignoreBaseNameSpaces: boolean;
    valueKey: string;
    xmlKey: string;
    xmlnsInEnvelope: any;
    constructor(definition: string, options: any);
    build(): Promise<any>;
    processIncludes(): Promise<any>;
    describeServices: () => any;
    toXML(): string;
    objectToXML(obj: any, name: any, nsPrefix: any, nsURI: any, isFirst?: any, xmlnsAttr?: any, schemaObject?: any, nsContext?: any): string;
    /**
   * Create RPC style xml string from the parameters
   * @param {string} name
   * @param {*} params
   * @param {string} nsPrefix
   * @param {string} nsURI
   * @param {boolean} isParts
   * @returns {string}
   */
    objectToRpcXML(name: string, params: any, nsPrefix: any, nsURI: string, isParts: boolean): string;
    /**
   * Create document style xml string from the parameters
   * @param {String} name
   * @param {*} params
   * @param {String} nsPrefix
   * @param {String} nsURI
   * @param {String} type
   */
    objectToDocumentXML(name: string, params: any, nsPrefix: string, nsURI: string, type: string): string;
    isIgnoredNameSpace(ns: string): boolean;
    filterOutIgnoredNameSpace(ns: string): string;
    processAttributes(child: any, nsContext: any): string;
    findSchemaType(name: any, nsURI: any): any;
    findChildSchemaObject(parameterTypeObj: any, childName: any, backtrace?: any): any;
    /**
   * Look up a XSD type or element by namespace URI and name
   * @param {String} nsURI Namespace URI
   * @param {String} qname Local or qualified name
   * @returns {*} The XSD type/element definition
   */
    findSchemaObject: (nsURI: string, qname: string) => any;
    xmlToObject(xml: any, callback?: any): any;
    private _processNextInclude(includes);
    private _initializeOptions(options);
    private _fromXML(xml);
    private _parse(xml);
    private _xmlnsMap();
}
