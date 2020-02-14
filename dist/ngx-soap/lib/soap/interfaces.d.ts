import { EventEmitter } from 'events';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface IXmlAttribute {
    name: string;
    value: string;
}
export interface IWsdlBaseOptions {
    attributesKey?: string;
    valueKey?: string;
    xmlKey?: string;
    overrideRootElement?: {
        namespace: string;
        xmlnsAttributes?: IXmlAttribute[];
    };
    ignoredNamespaces?: boolean | string[] | {
        namespaces?: string[];
        override?: boolean;
    };
    ignoreBaseNameSpaces?: boolean;
    escapeXML?: boolean;
    returnFault?: boolean;
    handleNilAsNull?: boolean;
    wsdl_headers?: {
        [key: string]: any;
    };
    wsdl_options?: {
        [key: string]: any;
    };
}
export interface Definitions {
    descriptions: object;
    ignoredNamespaces: string[];
    messages: WsdlMessages;
    portTypes: WsdlPortTypes;
    bindings: WsdlBindings;
    services: WsdlServices;
    schemas: WsdlSchemas;
    valueKey: string;
    xmlKey: string;
    xmlns: WsdlXmlns;
    '$targetNamespace': string;
    '$name': string;
}
export interface WsdlSchemas {
    [prop: string]: WsdlSchema;
}
export interface WsdlSchema extends XsdTypeBase {
    children: any[];
    complexTypes?: WsdlElements;
    elements?: WsdlElements;
    includes: any[];
    name: string;
    nsName: string;
    prefix: string;
    types?: WsdlElements;
    xmlns: WsdlXmlns;
}
export interface WsdlElements {
    [prop: string]: XsdElement;
}
export declare type XsdElement = XsdElementType | XsdComplexType;
export interface WsdlXmlns {
    wsu?: string;
    wsp?: string;
    wsam?: string;
    soap?: string;
    tns?: string;
    xsd?: string;
    __tns__?: string;
    [prop: string]: string | void;
}
export interface XsdComplexType extends XsdTypeBase {
    children: XsdElement[] | void;
    name: string;
    nsName: string;
    prefix: string;
    '$name': string;
    [prop: string]: any;
}
export interface XsdElementType extends XsdTypeBase {
    children: XsdElement[] | void;
    name: string;
    nsName: string;
    prefix: string;
    targetNSAlias: string;
    targetNamespace: string;
    '$lookupType': string;
    '$lookupTypes': any[];
    '$name': string;
    '$type': string;
    [prop: string]: any;
}
export interface WsdlMessages {
    [prop: string]: WsdlMessage;
}
export interface WsdlMessage extends XsdTypeBase {
    element: XsdElement;
    parts: {
        [prop: string]: any;
    };
    '$name': string;
}
export interface WsdlPortTypes {
    [prop: string]: WsdlPortType;
}
export interface WsdlPortType extends XsdTypeBase {
    methods: {
        [prop: string]: XsdElement;
    };
}
export interface WsdlBindings {
    [prop: string]: WsdlBinding;
}
export interface WsdlBinding extends XsdTypeBase {
    methods: WsdlElements;
    style: string;
    transport: string;
    topElements: {
        [prop: string]: any;
    };
}
export interface WsdlServices {
    [prop: string]: WsdlService;
}
export interface WsdlService extends XsdTypeBase {
    ports: {
        [prop: string]: any;
    };
}
export interface XsdTypeBase {
    ignoredNamespaces: string[];
    valueKey: string;
    xmlKey: string;
    xmlns?: WsdlXmlns;
}
export interface IOptions extends IWsdlBaseOptions {
    disableCache?: boolean;
    endpoint?: string;
    envelopeKey?: string;
    httpClient?: HttpClient;
    stream?: boolean;
    forceSoap12Headers?: boolean;
    customDeserializer?: any;
    [key: string]: any;
}
export interface WSDL {
    constructor(definition: any, uri: string, options?: IOptions): any;
    ignoredNamespaces: string[];
    ignoreBaseNameSpaces: boolean;
    valueKey: string;
    xmlKey: string;
    xmlnsInEnvelope: string;
    onReady(callback: (err: Error) => void): void;
    processIncludes(callback: (err: Error) => void): void;
    describeServices(): {
        [k: string]: any;
    };
    toXML(): string;
    xmlToObject(xml: any, callback?: (err: Error, result: any) => void): any;
    findSchemaObject(nsURI: string, qname: string): XsdElement | null | undefined;
    objectToDocumentXML(name: string, params: any, nsPrefix?: string, nsURI?: string, type?: string): any;
    objectToRpcXML(name: string, params: any, nsPrefix?: string, nsURI?: string, isParts?: any): string;
    isIgnoredNameSpace(ns: string): boolean;
    filterOutIgnoredNameSpace(ns: string): string;
    objectToXML(obj: any, name: string, nsPrefix?: any, nsURI?: string, isFirst?: boolean, xmlnsAttr?: any, schemaObject?: any, nsContext?: any): string;
    processAttributes(child: any, nsContext: any): string;
    findSchemaType(name: any, nsURI: any): any;
    findChildSchemaObject(parameterTypeObj: any, childName: any, backtrace?: any): any;
    uri: string;
    definitions: Definitions;
}
export interface Client extends EventEmitter {
    constructor(wsdl: WSDL, endpoint?: string, options?: IOptions): any;
    addBodyAttribute(bodyAttribute: any, name?: string, namespace?: string, xmlns?: string): void;
    addHttpHeader(name: string, value: any): void;
    addSoapHeader(soapHeader: any, name?: string, namespace?: any, xmlns?: string): number;
    changeSoapHeader(index: number, soapHeader: any, name?: string, namespace?: string, xmlns?: string): void;
    clearBodyAttributes(): void;
    clearHttpHeaders(): void;
    clearSoapHeaders(): void;
    describe(): any;
    getBodyAttributes(): any[];
    getHttpHeaders(): {
        [k: string]: string;
    };
    getSoapHeaders(): string[];
    setEndpoint(endpoint: string): void;
    setSOAPAction(action: string): void;
    setSecurity(security: ISecurity): void;
    wsdl: WSDL;
    [method: string]: ISoapMethod | WSDL | Function;
    call(method: string, body: any, options?: any, extraHeaders?: any): Observable<ISoapMethodResponse>;
}
export interface ISoapMethod {
    (args: any, options?: any, extraHeaders?: any): Observable<ISoapMethodResponse>;
}
export interface ISoapMethodResponse {
    err: any;
    header: any;
    responseBody: string;
    xml: string;
    result: any;
}
export interface ISecurity {
    addOptions(options: any): void;
    toXML(): string;
}
export interface BasicAuthSecurity extends ISecurity {
    constructor(username: string, password: string, defaults?: any): any;
    addHeaders(headers: any): void;
    addOptions(options: any): void;
    toXML(): string;
}
export interface BearerSecurity extends ISecurity {
    constructor(token: string, defaults?: any): any;
    addHeaders(headers: any): void;
    addOptions(options: any): void;
    toXML(): string;
}
export interface WSSecurity extends ISecurity {
    constructor(username: string, password: string, options?: any): any;
    addOptions(options: any): void;
    toXML(): string;
}
export interface WSSecurityCert extends ISecurity {
    constructor(privatePEM: any, publicP12PEM: any, password: any): any;
    addOptions(options: any): void;
    toXML(): string;
}
export interface NTLMSecurity extends ISecurity {
    constructor(username: string, password: string, domain: string, workstation: any): any;
    addHeaders(headers: any): void;
    addOptions(options: any): void;
    toXML(): string;
}
