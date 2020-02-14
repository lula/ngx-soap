/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
export function IXmlAttribute() { }
if (false) {
    /** @type {?} */
    IXmlAttribute.prototype.name;
    /** @type {?} */
    IXmlAttribute.prototype.value;
}
/**
 * @record
 */
export function IWsdlBaseOptions() { }
if (false) {
    /** @type {?|undefined} */
    IWsdlBaseOptions.prototype.attributesKey;
    /** @type {?|undefined} */
    IWsdlBaseOptions.prototype.valueKey;
    /** @type {?|undefined} */
    IWsdlBaseOptions.prototype.xmlKey;
    /** @type {?|undefined} */
    IWsdlBaseOptions.prototype.overrideRootElement;
    /** @type {?|undefined} */
    IWsdlBaseOptions.prototype.ignoredNamespaces;
    /** @type {?|undefined} */
    IWsdlBaseOptions.prototype.ignoreBaseNameSpaces;
    /** @type {?|undefined} */
    IWsdlBaseOptions.prototype.escapeXML;
    /** @type {?|undefined} */
    IWsdlBaseOptions.prototype.returnFault;
    /** @type {?|undefined} */
    IWsdlBaseOptions.prototype.handleNilAsNull;
    /** @type {?|undefined} */
    IWsdlBaseOptions.prototype.wsdl_headers;
    /** @type {?|undefined} */
    IWsdlBaseOptions.prototype.wsdl_options;
}
/**
 * @record
 */
export function Definitions() { }
if (false) {
    /** @type {?} */
    Definitions.prototype.descriptions;
    /** @type {?} */
    Definitions.prototype.ignoredNamespaces;
    /** @type {?} */
    Definitions.prototype.messages;
    /** @type {?} */
    Definitions.prototype.portTypes;
    /** @type {?} */
    Definitions.prototype.bindings;
    /** @type {?} */
    Definitions.prototype.services;
    /** @type {?} */
    Definitions.prototype.schemas;
    /** @type {?} */
    Definitions.prototype.valueKey;
    /** @type {?} */
    Definitions.prototype.xmlKey;
    /** @type {?} */
    Definitions.prototype.xmlns;
    /* Skipping unnamed member:
    '$targetNamespace': string;*/
    /* Skipping unnamed member:
    '$name': string;*/
}
/**
 * @record
 */
export function WsdlSchemas() { }
/**
 * @record
 */
export function WsdlSchema() { }
if (false) {
    /** @type {?} */
    WsdlSchema.prototype.children;
    /** @type {?|undefined} */
    WsdlSchema.prototype.complexTypes;
    /** @type {?|undefined} */
    WsdlSchema.prototype.elements;
    /** @type {?} */
    WsdlSchema.prototype.includes;
    /** @type {?} */
    WsdlSchema.prototype.name;
    /** @type {?} */
    WsdlSchema.prototype.nsName;
    /** @type {?} */
    WsdlSchema.prototype.prefix;
    /** @type {?|undefined} */
    WsdlSchema.prototype.types;
    /** @type {?} */
    WsdlSchema.prototype.xmlns;
}
/**
 * @record
 */
export function WsdlElements() { }
/**
 * @record
 */
export function WsdlXmlns() { }
if (false) {
    /** @type {?|undefined} */
    WsdlXmlns.prototype.wsu;
    /** @type {?|undefined} */
    WsdlXmlns.prototype.wsp;
    /** @type {?|undefined} */
    WsdlXmlns.prototype.wsam;
    /** @type {?|undefined} */
    WsdlXmlns.prototype.soap;
    /** @type {?|undefined} */
    WsdlXmlns.prototype.tns;
    /** @type {?|undefined} */
    WsdlXmlns.prototype.xsd;
    /** @type {?|undefined} */
    WsdlXmlns.prototype.__tns__;
    /* Skipping unhandled member: [prop: string]: string | void;*/
}
/**
 * @record
 */
export function XsdComplexType() { }
if (false) {
    /** @type {?} */
    XsdComplexType.prototype.children;
    /** @type {?} */
    XsdComplexType.prototype.name;
    /** @type {?} */
    XsdComplexType.prototype.nsName;
    /** @type {?} */
    XsdComplexType.prototype.prefix;
    /* Skipping unnamed member:
    '$name': string;*/
    /* Skipping unhandled member: [prop: string]: any;*/
}
/**
 * @record
 */
export function XsdElementType() { }
if (false) {
    /** @type {?} */
    XsdElementType.prototype.children;
    /** @type {?} */
    XsdElementType.prototype.name;
    /** @type {?} */
    XsdElementType.prototype.nsName;
    /** @type {?} */
    XsdElementType.prototype.prefix;
    /** @type {?} */
    XsdElementType.prototype.targetNSAlias;
    /** @type {?} */
    XsdElementType.prototype.targetNamespace;
    /* Skipping unnamed member:
    '$lookupType': string;*/
    /* Skipping unnamed member:
    '$lookupTypes': any[];*/
    /* Skipping unnamed member:
    '$name': string;*/
    /* Skipping unnamed member:
    '$type': string;*/
    /* Skipping unhandled member: [prop: string]: any;*/
}
/**
 * @record
 */
export function WsdlMessages() { }
/**
 * @record
 */
export function WsdlMessage() { }
if (false) {
    /** @type {?} */
    WsdlMessage.prototype.element;
    /** @type {?} */
    WsdlMessage.prototype.parts;
    /* Skipping unnamed member:
    '$name': string;*/
}
/**
 * @record
 */
export function WsdlPortTypes() { }
/**
 * @record
 */
export function WsdlPortType() { }
if (false) {
    /** @type {?} */
    WsdlPortType.prototype.methods;
}
/**
 * @record
 */
export function WsdlBindings() { }
/**
 * @record
 */
export function WsdlBinding() { }
if (false) {
    /** @type {?} */
    WsdlBinding.prototype.methods;
    /** @type {?} */
    WsdlBinding.prototype.style;
    /** @type {?} */
    WsdlBinding.prototype.transport;
    /** @type {?} */
    WsdlBinding.prototype.topElements;
}
/**
 * @record
 */
export function WsdlServices() { }
/**
 * @record
 */
export function WsdlService() { }
if (false) {
    /** @type {?} */
    WsdlService.prototype.ports;
}
/**
 * @record
 */
export function XsdTypeBase() { }
if (false) {
    /** @type {?} */
    XsdTypeBase.prototype.ignoredNamespaces;
    /** @type {?} */
    XsdTypeBase.prototype.valueKey;
    /** @type {?} */
    XsdTypeBase.prototype.xmlKey;
    /** @type {?|undefined} */
    XsdTypeBase.prototype.xmlns;
}
/**
 * @record
 */
export function IOptions() { }
if (false) {
    /** @type {?|undefined} */
    IOptions.prototype.disableCache;
    /** @type {?|undefined} */
    IOptions.prototype.endpoint;
    /** @type {?|undefined} */
    IOptions.prototype.envelopeKey;
    /** @type {?|undefined} */
    IOptions.prototype.httpClient;
    /** @type {?|undefined} */
    IOptions.prototype.stream;
    /** @type {?|undefined} */
    IOptions.prototype.forceSoap12Headers;
    /** @type {?|undefined} */
    IOptions.prototype.customDeserializer;
    /* Skipping unhandled member: [key: string]: any;*/
}
/**
 * @record
 */
export function WSDL() { }
if (false) {
    /** @type {?} */
    WSDL.prototype.ignoredNamespaces;
    /** @type {?} */
    WSDL.prototype.ignoreBaseNameSpaces;
    /** @type {?} */
    WSDL.prototype.valueKey;
    /** @type {?} */
    WSDL.prototype.xmlKey;
    /** @type {?} */
    WSDL.prototype.xmlnsInEnvelope;
    /** @type {?} */
    WSDL.prototype.uri;
    /** @type {?} */
    WSDL.prototype.definitions;
    /**
     * @param {?} definition
     * @param {?} uri
     * @param {?=} options
     * @return {?}
     */
    WSDL.prototype.constructor = function (definition, uri, options) { };
    /**
     * @param {?} callback
     * @return {?}
     */
    WSDL.prototype.onReady = function (callback) { };
    /**
     * @param {?} callback
     * @return {?}
     */
    WSDL.prototype.processIncludes = function (callback) { };
    /**
     * @return {?}
     */
    WSDL.prototype.describeServices = function () { };
    /**
     * @return {?}
     */
    WSDL.prototype.toXML = function () { };
    /**
     * @param {?} xml
     * @param {?=} callback
     * @return {?}
     */
    WSDL.prototype.xmlToObject = function (xml, callback) { };
    /**
     * @param {?} nsURI
     * @param {?} qname
     * @return {?}
     */
    WSDL.prototype.findSchemaObject = function (nsURI, qname) { };
    /**
     * @param {?} name
     * @param {?} params
     * @param {?=} nsPrefix
     * @param {?=} nsURI
     * @param {?=} type
     * @return {?}
     */
    WSDL.prototype.objectToDocumentXML = function (name, params, nsPrefix, nsURI, type) { };
    /**
     * @param {?} name
     * @param {?} params
     * @param {?=} nsPrefix
     * @param {?=} nsURI
     * @param {?=} isParts
     * @return {?}
     */
    WSDL.prototype.objectToRpcXML = function (name, params, nsPrefix, nsURI, isParts) { };
    /**
     * @param {?} ns
     * @return {?}
     */
    WSDL.prototype.isIgnoredNameSpace = function (ns) { };
    /**
     * @param {?} ns
     * @return {?}
     */
    WSDL.prototype.filterOutIgnoredNameSpace = function (ns) { };
    /**
     * @param {?} obj
     * @param {?} name
     * @param {?=} nsPrefix
     * @param {?=} nsURI
     * @param {?=} isFirst
     * @param {?=} xmlnsAttr
     * @param {?=} schemaObject
     * @param {?=} nsContext
     * @return {?}
     */
    WSDL.prototype.objectToXML = function (obj, name, nsPrefix, nsURI, isFirst, xmlnsAttr, schemaObject, nsContext) { };
    /**
     * @param {?} child
     * @param {?} nsContext
     * @return {?}
     */
    WSDL.prototype.processAttributes = function (child, nsContext) { };
    /**
     * @param {?} name
     * @param {?} nsURI
     * @return {?}
     */
    WSDL.prototype.findSchemaType = function (name, nsURI) { };
    /**
     * @param {?} parameterTypeObj
     * @param {?} childName
     * @param {?=} backtrace
     * @return {?}
     */
    WSDL.prototype.findChildSchemaObject = function (parameterTypeObj, childName, backtrace) { };
}
/**
 * @record
 */
export function Client() { }
if (false) {
    /** @type {?} */
    Client.prototype.wsdl;
    /* Skipping unhandled member: [method: string]: ISoapMethod | WSDL | Function;*/
    /**
     * @param {?} wsdl
     * @param {?=} endpoint
     * @param {?=} options
     * @return {?}
     */
    Client.prototype.constructor = function (wsdl, endpoint, options) { };
    /**
     * @param {?} bodyAttribute
     * @param {?=} name
     * @param {?=} namespace
     * @param {?=} xmlns
     * @return {?}
     */
    Client.prototype.addBodyAttribute = function (bodyAttribute, name, namespace, xmlns) { };
    /**
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    Client.prototype.addHttpHeader = function (name, value) { };
    /**
     * @param {?} soapHeader
     * @param {?=} name
     * @param {?=} namespace
     * @param {?=} xmlns
     * @return {?}
     */
    Client.prototype.addSoapHeader = function (soapHeader, name, namespace, xmlns) { };
    /**
     * @param {?} index
     * @param {?} soapHeader
     * @param {?=} name
     * @param {?=} namespace
     * @param {?=} xmlns
     * @return {?}
     */
    Client.prototype.changeSoapHeader = function (index, soapHeader, name, namespace, xmlns) { };
    /**
     * @return {?}
     */
    Client.prototype.clearBodyAttributes = function () { };
    /**
     * @return {?}
     */
    Client.prototype.clearHttpHeaders = function () { };
    /**
     * @return {?}
     */
    Client.prototype.clearSoapHeaders = function () { };
    /**
     * @return {?}
     */
    Client.prototype.describe = function () { };
    /**
     * @return {?}
     */
    Client.prototype.getBodyAttributes = function () { };
    /**
     * @return {?}
     */
    Client.prototype.getHttpHeaders = function () { };
    /**
     * @return {?}
     */
    Client.prototype.getSoapHeaders = function () { };
    /**
     * @param {?} endpoint
     * @return {?}
     */
    Client.prototype.setEndpoint = function (endpoint) { };
    /**
     * @param {?} action
     * @return {?}
     */
    Client.prototype.setSOAPAction = function (action) { };
    /**
     * @param {?} security
     * @return {?}
     */
    Client.prototype.setSecurity = function (security) { };
    /**
     * @param {?} method
     * @param {?} body
     * @param {?=} options
     * @param {?=} extraHeaders
     * @return {?}
     */
    Client.prototype.call = function (method, body, options, extraHeaders) { };
}
/**
 * @record
 */
export function ISoapMethod() { }
/**
 * @record
 */
export function ISoapMethodResponse() { }
if (false) {
    /** @type {?} */
    ISoapMethodResponse.prototype.err;
    /** @type {?} */
    ISoapMethodResponse.prototype.header;
    /** @type {?} */
    ISoapMethodResponse.prototype.responseBody;
    /** @type {?} */
    ISoapMethodResponse.prototype.xml;
    /** @type {?} */
    ISoapMethodResponse.prototype.result;
}
/**
 * @record
 */
export function ISecurity() { }
if (false) {
    /**
     * @param {?} options
     * @return {?}
     */
    ISecurity.prototype.addOptions = function (options) { };
    /**
     * @return {?}
     */
    ISecurity.prototype.toXML = function () { };
}
/**
 * @record
 */
export function BasicAuthSecurity() { }
if (false) {
    /**
     * @param {?} username
     * @param {?} password
     * @param {?=} defaults
     * @return {?}
     */
    BasicAuthSecurity.prototype.constructor = function (username, password, defaults) { };
    /**
     * @param {?} headers
     * @return {?}
     */
    BasicAuthSecurity.prototype.addHeaders = function (headers) { };
    /**
     * @param {?} options
     * @return {?}
     */
    BasicAuthSecurity.prototype.addOptions = function (options) { };
    /**
     * @return {?}
     */
    BasicAuthSecurity.prototype.toXML = function () { };
}
/**
 * @record
 */
export function BearerSecurity() { }
if (false) {
    /**
     * @param {?} token
     * @param {?=} defaults
     * @return {?}
     */
    BearerSecurity.prototype.constructor = function (token, defaults) { };
    /**
     * @param {?} headers
     * @return {?}
     */
    BearerSecurity.prototype.addHeaders = function (headers) { };
    /**
     * @param {?} options
     * @return {?}
     */
    BearerSecurity.prototype.addOptions = function (options) { };
    /**
     * @return {?}
     */
    BearerSecurity.prototype.toXML = function () { };
}
/**
 * @record
 */
export function WSSecurity() { }
if (false) {
    /**
     * @param {?} username
     * @param {?} password
     * @param {?=} options
     * @return {?}
     */
    WSSecurity.prototype.constructor = function (username, password, options) { };
    /**
     * @param {?} options
     * @return {?}
     */
    WSSecurity.prototype.addOptions = function (options) { };
    /**
     * @return {?}
     */
    WSSecurity.prototype.toXML = function () { };
}
/**
 * @record
 */
export function WSSecurityCert() { }
if (false) {
    /**
     * @param {?} privatePEM
     * @param {?} publicP12PEM
     * @param {?} password
     * @return {?}
     */
    WSSecurityCert.prototype.constructor = function (privatePEM, publicP12PEM, password) { };
    /**
     * @param {?} options
     * @return {?}
     */
    WSSecurityCert.prototype.addOptions = function (options) { };
    /**
     * @return {?}
     */
    WSSecurityCert.prototype.toXML = function () { };
}
/**
 * @record
 */
export function NTLMSecurity() { }
if (false) {
    /**
     * @param {?} username
     * @param {?} password
     * @param {?} domain
     * @param {?} workstation
     * @return {?}
     */
    NTLMSecurity.prototype.constructor = function (username, password, domain, workstation) { };
    /**
     * @param {?} headers
     * @return {?}
     */
    NTLMSecurity.prototype.addHeaders = function (headers) { };
    /**
     * @param {?} options
     * @return {?}
     */
    NTLMSecurity.prototype.addOptions = function (options) { };
    /**
     * @return {?}
     */
    NTLMSecurity.prototype.toXML = function () { };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb2FwLyIsInNvdXJjZXMiOlsibGliL3NvYXAvaW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBSUEsbUNBR0M7OztJQUZHLDZCQUFhOztJQUNiLDhCQUFjOzs7OztBQUdsQixzQ0FZQzs7O0lBWEcseUNBQXVCOztJQUN2QixvQ0FBa0I7O0lBQ2xCLGtDQUFnQjs7SUFDaEIsK0NBQWdGOztJQUNoRiw2Q0FBd0Y7O0lBQ3hGLGdEQUErQjs7SUFDL0IscUNBQW9COztJQUNwQix1Q0FBc0I7O0lBQ3RCLDJDQUEwQjs7SUFDMUIsd0NBQXNDOztJQUN0Qyx3Q0FBc0M7Ozs7O0FBRzFDLGlDQWFDOzs7SUFaRyxtQ0FBcUI7O0lBQ3JCLHdDQUE0Qjs7SUFDNUIsK0JBQXVCOztJQUN2QixnQ0FBeUI7O0lBQ3pCLCtCQUF1Qjs7SUFDdkIsK0JBQXVCOztJQUN2Qiw4QkFBcUI7O0lBQ3JCLCtCQUFpQjs7SUFDakIsNkJBQWU7O0lBQ2YsNEJBQWlCOzs7Ozs7Ozs7QUFNckIsaUNBRUM7Ozs7QUFDRCxnQ0FVQzs7O0lBVEcsOEJBQWdCOztJQUNoQixrQ0FBNEI7O0lBQzVCLDhCQUF3Qjs7SUFDeEIsOEJBQWdCOztJQUNoQiwwQkFBYTs7SUFDYiw0QkFBZTs7SUFDZiw0QkFBZTs7SUFDZiwyQkFBcUI7O0lBQ3JCLDJCQUFpQjs7Ozs7QUFFckIsa0NBRUM7Ozs7QUFHRCwrQkFTQzs7O0lBUkcsd0JBQWE7O0lBQ2Isd0JBQWE7O0lBQ2IseUJBQWM7O0lBQ2QseUJBQWM7O0lBQ2Qsd0JBQWE7O0lBQ2Isd0JBQWE7O0lBQ2IsNEJBQWlCOzs7Ozs7QUFJckIsb0NBT0M7OztJQU5HLGtDQUE4Qjs7SUFDOUIsOEJBQWE7O0lBQ2IsZ0NBQWU7O0lBQ2YsZ0NBQWU7Ozs7Ozs7O0FBS25CLG9DQVlDOzs7SUFYRyxrQ0FBOEI7O0lBQzlCLDhCQUFhOztJQUNiLGdDQUFlOztJQUNmLGdDQUFlOztJQUNmLHVDQUFzQjs7SUFDdEIseUNBQXdCOzs7Ozs7Ozs7Ozs7OztBQVE1QixrQ0FFQzs7OztBQUNELGlDQUlDOzs7SUFIRyw4QkFBb0I7O0lBQ3BCLDRCQUErQjs7Ozs7OztBQUluQyxtQ0FFQzs7OztBQUNELGtDQUVDOzs7SUFERywrQkFBdUM7Ozs7O0FBRzNDLGtDQUVDOzs7O0FBQ0QsaUNBS0M7OztJQUpHLDhCQUFzQjs7SUFDdEIsNEJBQWM7O0lBQ2QsZ0NBQWtCOztJQUNsQixrQ0FBbUM7Ozs7O0FBR3ZDLGtDQUVDOzs7O0FBQ0QsaUNBRUM7OztJQURHLDRCQUE2Qjs7Ozs7QUFHakMsaUNBS0M7OztJQUpHLHdDQUE0Qjs7SUFDNUIsK0JBQWlCOztJQUNqQiw2QkFBZTs7SUFDZiw0QkFBa0I7Ozs7O0FBR3RCLDhCQVdDOzs7SUFWRyxnQ0FBdUI7O0lBQ3ZCLDRCQUFrQjs7SUFDbEIsK0JBQXFCOztJQUNyQiw4QkFBd0I7O0lBRXhCLDBCQUFpQjs7SUFFakIsc0NBQTZCOztJQUM3QixzQ0FBeUI7Ozs7OztBQUk3QiwwQkF1QkM7OztJQXJCRyxpQ0FBNEI7O0lBQzVCLG9DQUE4Qjs7SUFDOUIsd0JBQWlCOztJQUNqQixzQkFBZTs7SUFDZiwrQkFBd0I7O0lBZXhCLG1CQUFZOztJQUNaLDJCQUF5Qjs7Ozs7OztJQXJCekIscUVBQThEOzs7OztJQU05RCxpREFBNkM7Ozs7O0lBQzdDLHlEQUFxRDs7OztJQUNyRCxrREFBeUM7Ozs7SUFDekMsdUNBQWdCOzs7Ozs7SUFDaEIsMERBQXVFOzs7Ozs7SUFDdkUsOERBQThFOzs7Ozs7Ozs7SUFDOUUsd0ZBQXNHOzs7Ozs7Ozs7SUFDdEcsc0ZBQW9HOzs7OztJQUNwRyxzREFBd0M7Ozs7O0lBQ3hDLDZEQUE4Qzs7Ozs7Ozs7Ozs7O0lBQzlDLG9IQUFxSjs7Ozs7O0lBQ3JKLG1FQUFzRDs7Ozs7O0lBQ3RELDJEQUEyQzs7Ozs7OztJQUMzQyw2RkFBbUY7Ozs7O0FBS3ZGLDRCQW1CQzs7O0lBSEcsc0JBQVc7Ozs7Ozs7O0lBZlgsc0VBQStEOzs7Ozs7OztJQUMvRCx5RkFBOEY7Ozs7OztJQUM5Riw0REFBOEM7Ozs7Ozs7O0lBQzlDLG1GQUF1Rjs7Ozs7Ozs7O0lBQ3ZGLDZGQUEwRzs7OztJQUMxRyx1REFBNEI7Ozs7SUFDNUIsb0RBQXlCOzs7O0lBQ3pCLG9EQUF5Qjs7OztJQUN6Qiw0Q0FBZ0I7Ozs7SUFDaEIscURBQTJCOzs7O0lBQzNCLGtEQUF5Qzs7OztJQUN6QyxrREFBMkI7Ozs7O0lBQzNCLHVEQUFvQzs7Ozs7SUFDcEMsdURBQW9DOzs7OztJQUNwQyx1REFBdUM7Ozs7Ozs7O0lBR3ZDLDJFQUFvRzs7Ozs7QUFHeEcsaUNBRUM7Ozs7QUFFRCx5Q0FNQzs7O0lBTEcsa0NBQVM7O0lBQ1QscUNBQVk7O0lBQ1osMkNBQXFCOztJQUNyQixrQ0FBWTs7SUFDWixxQ0FBWTs7Ozs7QUFHaEIsK0JBR0M7Ozs7OztJQUZHLHdEQUErQjs7OztJQUMvQiw0Q0FBZ0I7Ozs7O0FBR3BCLHVDQUtDOzs7Ozs7OztJQUpHLHNGQUFnRTs7Ozs7SUFDaEUsZ0VBQStCOzs7OztJQUMvQixnRUFBK0I7Ozs7SUFDL0Isb0RBQWdCOzs7OztBQUdwQixvQ0FLQzs7Ozs7OztJQUpHLHNFQUEyQzs7Ozs7SUFDM0MsNkRBQStCOzs7OztJQUMvQiw2REFBK0I7Ozs7SUFDL0IsaURBQWdCOzs7OztBQUdwQixnQ0FJQzs7Ozs7Ozs7SUFIRyw4RUFBK0Q7Ozs7O0lBQy9ELHlEQUErQjs7OztJQUMvQiw2Q0FBZ0I7Ozs7O0FBR3BCLG9DQUlDOzs7Ozs7OztJQUhHLHlGQUErRDs7Ozs7SUFDL0QsNkRBQStCOzs7O0lBQy9CLGlEQUFnQjs7Ozs7QUFHcEIsa0NBS0M7Ozs7Ozs7OztJQUpHLDRGQUE2RTs7Ozs7SUFDN0UsMkRBQStCOzs7OztJQUMvQiwyREFBK0I7Ozs7SUFDL0IsK0NBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVhtbEF0dHJpYnV0ZSB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIHZhbHVlOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVdzZGxCYXNlT3B0aW9ucyB7XG4gICAgYXR0cmlidXRlc0tleT86IHN0cmluZztcbiAgICB2YWx1ZUtleT86IHN0cmluZztcbiAgICB4bWxLZXk/OiBzdHJpbmc7XG4gICAgb3ZlcnJpZGVSb290RWxlbWVudD86IHsgbmFtZXNwYWNlOiBzdHJpbmc7IHhtbG5zQXR0cmlidXRlcz86IElYbWxBdHRyaWJ1dGVbXTsgfTtcbiAgICBpZ25vcmVkTmFtZXNwYWNlcz86IGJvb2xlYW4gfCBzdHJpbmdbXSB8IHsgbmFtZXNwYWNlcz86IHN0cmluZ1tdOyBvdmVycmlkZT86IGJvb2xlYW47IH07XG4gICAgaWdub3JlQmFzZU5hbWVTcGFjZXM/OiBib29sZWFuO1xuICAgIGVzY2FwZVhNTD86IGJvb2xlYW47XG4gICAgcmV0dXJuRmF1bHQ/OiBib29sZWFuO1xuICAgIGhhbmRsZU5pbEFzTnVsbD86IGJvb2xlYW47XG4gICAgd3NkbF9oZWFkZXJzPzogeyBba2V5OiBzdHJpbmddOiBhbnkgfTtcbiAgICB3c2RsX29wdGlvbnM/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERlZmluaXRpb25zIHtcbiAgICBkZXNjcmlwdGlvbnM6IG9iamVjdDtcbiAgICBpZ25vcmVkTmFtZXNwYWNlczogc3RyaW5nW107XG4gICAgbWVzc2FnZXM6IFdzZGxNZXNzYWdlcztcbiAgICBwb3J0VHlwZXM6IFdzZGxQb3J0VHlwZXM7XG4gICAgYmluZGluZ3M6IFdzZGxCaW5kaW5ncztcbiAgICBzZXJ2aWNlczogV3NkbFNlcnZpY2VzO1xuICAgIHNjaGVtYXM6IFdzZGxTY2hlbWFzO1xuICAgIHZhbHVlS2V5OiBzdHJpbmc7XG4gICAgeG1sS2V5OiBzdHJpbmc7XG4gICAgeG1sbnM6IFdzZGxYbWxucztcbiAgICAnJHRhcmdldE5hbWVzcGFjZSc6IHN0cmluZztcbiAgICAnJG5hbWUnOiBzdHJpbmc7XG59XG5cblxuZXhwb3J0IGludGVyZmFjZSBXc2RsU2NoZW1hcyB7XG4gICAgW3Byb3A6IHN0cmluZ106IFdzZGxTY2hlbWE7XG59XG5leHBvcnQgaW50ZXJmYWNlIFdzZGxTY2hlbWEgZXh0ZW5kcyBYc2RUeXBlQmFzZSB7XG4gICAgY2hpbGRyZW46IGFueVtdO1xuICAgIGNvbXBsZXhUeXBlcz86IFdzZGxFbGVtZW50cztcbiAgICBlbGVtZW50cz86IFdzZGxFbGVtZW50cztcbiAgICBpbmNsdWRlczogYW55W107XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIG5zTmFtZTogc3RyaW5nO1xuICAgIHByZWZpeDogc3RyaW5nO1xuICAgIHR5cGVzPzogV3NkbEVsZW1lbnRzO1xuICAgIHhtbG5zOiBXc2RsWG1sbnM7XG59XG5leHBvcnQgaW50ZXJmYWNlIFdzZGxFbGVtZW50cyB7XG4gICAgW3Byb3A6IHN0cmluZ106IFhzZEVsZW1lbnQ7XG59XG5leHBvcnQgdHlwZSBYc2RFbGVtZW50ID0gWHNkRWxlbWVudFR5cGUgfCBYc2RDb21wbGV4VHlwZTtcblxuZXhwb3J0IGludGVyZmFjZSBXc2RsWG1sbnMge1xuICAgIHdzdT86IHN0cmluZztcbiAgICB3c3A/OiBzdHJpbmc7XG4gICAgd3NhbT86IHN0cmluZztcbiAgICBzb2FwPzogc3RyaW5nO1xuICAgIHRucz86IHN0cmluZztcbiAgICB4c2Q/OiBzdHJpbmc7XG4gICAgX190bnNfXz86IHN0cmluZztcbiAgICBbcHJvcDogc3RyaW5nXTogc3RyaW5nIHwgdm9pZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBYc2RDb21wbGV4VHlwZSBleHRlbmRzIFhzZFR5cGVCYXNlIHtcbiAgICBjaGlsZHJlbjogWHNkRWxlbWVudFtdIHwgdm9pZDtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgbnNOYW1lOiBzdHJpbmc7XG4gICAgcHJlZml4OiBzdHJpbmc7XG4gICAgJyRuYW1lJzogc3RyaW5nO1xuICAgIFtwcm9wOiBzdHJpbmddOiBhbnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgWHNkRWxlbWVudFR5cGUgZXh0ZW5kcyBYc2RUeXBlQmFzZSB7XG4gICAgY2hpbGRyZW46IFhzZEVsZW1lbnRbXSB8IHZvaWQ7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIG5zTmFtZTogc3RyaW5nO1xuICAgIHByZWZpeDogc3RyaW5nO1xuICAgIHRhcmdldE5TQWxpYXM6IHN0cmluZztcbiAgICB0YXJnZXROYW1lc3BhY2U6IHN0cmluZztcbiAgICAnJGxvb2t1cFR5cGUnOiBzdHJpbmc7XG4gICAgJyRsb29rdXBUeXBlcyc6IGFueVtdO1xuICAgICckbmFtZSc6IHN0cmluZztcbiAgICAnJHR5cGUnOiBzdHJpbmc7XG4gICAgW3Byb3A6IHN0cmluZ106IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBXc2RsTWVzc2FnZXMge1xuICAgIFtwcm9wOiBzdHJpbmddOiBXc2RsTWVzc2FnZTtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgV3NkbE1lc3NhZ2UgZXh0ZW5kcyBYc2RUeXBlQmFzZSB7XG4gICAgZWxlbWVudDogWHNkRWxlbWVudDtcbiAgICBwYXJ0czogeyBbcHJvcDogc3RyaW5nXTogYW55IH07XG4gICAgJyRuYW1lJzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdzZGxQb3J0VHlwZXMge1xuICAgIFtwcm9wOiBzdHJpbmddOiBXc2RsUG9ydFR5cGU7XG59XG5leHBvcnQgaW50ZXJmYWNlIFdzZGxQb3J0VHlwZSBleHRlbmRzIFhzZFR5cGVCYXNlIHtcbiAgICBtZXRob2RzOiB7IFtwcm9wOiBzdHJpbmddOiBYc2RFbGVtZW50IH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBXc2RsQmluZGluZ3Mge1xuICAgIFtwcm9wOiBzdHJpbmddOiBXc2RsQmluZGluZztcbn1cbmV4cG9ydCBpbnRlcmZhY2UgV3NkbEJpbmRpbmcgZXh0ZW5kcyBYc2RUeXBlQmFzZSB7XG4gICAgbWV0aG9kczogV3NkbEVsZW1lbnRzO1xuICAgIHN0eWxlOiBzdHJpbmc7XG4gICAgdHJhbnNwb3J0OiBzdHJpbmc7XG4gICAgdG9wRWxlbWVudHM6IHtbcHJvcDogc3RyaW5nXTogYW55fTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBXc2RsU2VydmljZXMge1xuICAgIFtwcm9wOiBzdHJpbmddOiBXc2RsU2VydmljZTtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgV3NkbFNlcnZpY2UgZXh0ZW5kcyBYc2RUeXBlQmFzZSB7XG4gICAgcG9ydHM6IHtbcHJvcDogc3RyaW5nXTogYW55fTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBYc2RUeXBlQmFzZSB7XG4gICAgaWdub3JlZE5hbWVzcGFjZXM6IHN0cmluZ1tdO1xuICAgIHZhbHVlS2V5OiBzdHJpbmc7XG4gICAgeG1sS2V5OiBzdHJpbmc7XG4gICAgeG1sbnM/OiBXc2RsWG1sbnMsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnMgZXh0ZW5kcyBJV3NkbEJhc2VPcHRpb25zIHtcbiAgICBkaXNhYmxlQ2FjaGU/OiBib29sZWFuO1xuICAgIGVuZHBvaW50Pzogc3RyaW5nO1xuICAgIGVudmVsb3BlS2V5Pzogc3RyaW5nO1xuICAgIGh0dHBDbGllbnQ/OiBIdHRwQ2xpZW50O1xuICAgIC8vIHJlcXVlc3Q/OiAob3B0aW9uczogYW55LCBjYWxsYmFjaz86IChlcnJvcjogYW55LCByZXM6IGFueSwgYm9keTogYW55KSA9PiB2b2lkKSA9PiB2b2lkO1xuICAgIHN0cmVhbT86IGJvb2xlYW47XG4gICAgLy8gd3NkbCBvcHRpb25zIHRoYXQgb25seSB3b3JrIGZvciBjbGllbnRcbiAgICBmb3JjZVNvYXAxMkhlYWRlcnM/OiBib29sZWFuO1xuICAgIGN1c3RvbURlc2VyaWFsaXplcj86IGFueTtcbiAgICBba2V5OiBzdHJpbmddOiBhbnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgV1NETCB7XG4gICAgY29uc3RydWN0b3IoZGVmaW5pdGlvbjogYW55LCB1cmk6IHN0cmluZywgb3B0aW9ucz86IElPcHRpb25zKTtcbiAgICBpZ25vcmVkTmFtZXNwYWNlczogc3RyaW5nW107XG4gICAgaWdub3JlQmFzZU5hbWVTcGFjZXM6IGJvb2xlYW47XG4gICAgdmFsdWVLZXk6IHN0cmluZztcbiAgICB4bWxLZXk6IHN0cmluZztcbiAgICB4bWxuc0luRW52ZWxvcGU6IHN0cmluZztcbiAgICBvblJlYWR5KGNhbGxiYWNrOiAoZXJyOkVycm9yKSA9PiB2b2lkKTogdm9pZDtcbiAgICBwcm9jZXNzSW5jbHVkZXMoY2FsbGJhY2s6IChlcnI6RXJyb3IpID0+IHZvaWQpOiB2b2lkO1xuICAgIGRlc2NyaWJlU2VydmljZXMoKTogeyBbazogc3RyaW5nXTogYW55IH07XG4gICAgdG9YTUwoKTogc3RyaW5nO1xuICAgIHhtbFRvT2JqZWN0KHhtbDogYW55LCBjYWxsYmFjaz86IChlcnI6RXJyb3IsIHJlc3VsdDphbnkpID0+IHZvaWQpOiBhbnk7XG4gICAgZmluZFNjaGVtYU9iamVjdChuc1VSSTogc3RyaW5nLCBxbmFtZTogc3RyaW5nKTogWHNkRWxlbWVudCB8IG51bGwgfCB1bmRlZmluZWQ7XG4gICAgb2JqZWN0VG9Eb2N1bWVudFhNTChuYW1lOiBzdHJpbmcsIHBhcmFtczogYW55LCBuc1ByZWZpeD86IHN0cmluZywgbnNVUkk/OiBzdHJpbmcsIHR5cGU/OiBzdHJpbmcpOiBhbnk7XG4gICAgb2JqZWN0VG9ScGNYTUwobmFtZTogc3RyaW5nLCBwYXJhbXM6IGFueSwgbnNQcmVmaXg/OiBzdHJpbmcsIG5zVVJJPzogc3RyaW5nLCBpc1BhcnRzPzogYW55KTogc3RyaW5nO1xuICAgIGlzSWdub3JlZE5hbWVTcGFjZShuczogc3RyaW5nKTogYm9vbGVhbjtcbiAgICBmaWx0ZXJPdXRJZ25vcmVkTmFtZVNwYWNlKG5zOiBzdHJpbmcpOiBzdHJpbmc7XG4gICAgb2JqZWN0VG9YTUwob2JqOiBhbnksIG5hbWU6IHN0cmluZywgbnNQcmVmaXg/OiBhbnksIG5zVVJJPzogc3RyaW5nLCBpc0ZpcnN0PzogYm9vbGVhbiwgeG1sbnNBdHRyPzogYW55LCBzY2hlbWFPYmplY3Q/OiBhbnksIG5zQ29udGV4dD86IGFueSk6IHN0cmluZztcbiAgICBwcm9jZXNzQXR0cmlidXRlcyhjaGlsZDogYW55LCBuc0NvbnRleHQ6IGFueSk6IHN0cmluZztcbiAgICBmaW5kU2NoZW1hVHlwZShuYW1lOiBhbnksIG5zVVJJOiBhbnkpOiBhbnk7XG4gICAgZmluZENoaWxkU2NoZW1hT2JqZWN0KHBhcmFtZXRlclR5cGVPYmo6IGFueSwgY2hpbGROYW1lOiBhbnksIGJhY2t0cmFjZT86IGFueSk6IGFueTtcbiAgICB1cmk6IHN0cmluZztcbiAgICBkZWZpbml0aW9uczogRGVmaW5pdGlvbnM7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xpZW50IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgICBjb25zdHJ1Y3Rvcih3c2RsOiBXU0RMLCBlbmRwb2ludD86IHN0cmluZywgb3B0aW9ucz86IElPcHRpb25zKTtcbiAgICBhZGRCb2R5QXR0cmlidXRlKGJvZHlBdHRyaWJ1dGU6IGFueSwgbmFtZT86IHN0cmluZywgbmFtZXNwYWNlPzogc3RyaW5nLCB4bWxucz86IHN0cmluZyk6IHZvaWQ7XG4gICAgYWRkSHR0cEhlYWRlcihuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkO1xuICAgIGFkZFNvYXBIZWFkZXIoc29hcEhlYWRlcjogYW55LCBuYW1lPzogc3RyaW5nLCBuYW1lc3BhY2U/OiBhbnksIHhtbG5zPzogc3RyaW5nKTogbnVtYmVyO1xuICAgIGNoYW5nZVNvYXBIZWFkZXIoaW5kZXg6IG51bWJlciwgc29hcEhlYWRlcjogYW55LCBuYW1lPzogc3RyaW5nLCBuYW1lc3BhY2U/OiBzdHJpbmcsIHhtbG5zPzogc3RyaW5nKTogdm9pZDtcbiAgICBjbGVhckJvZHlBdHRyaWJ1dGVzKCk6IHZvaWQ7XG4gICAgY2xlYXJIdHRwSGVhZGVycygpOiB2b2lkO1xuICAgIGNsZWFyU29hcEhlYWRlcnMoKTogdm9pZDtcbiAgICBkZXNjcmliZSgpOiBhbnk7XG4gICAgZ2V0Qm9keUF0dHJpYnV0ZXMoKTogYW55W107XG4gICAgZ2V0SHR0cEhlYWRlcnMoKTogeyBbazpzdHJpbmddOiBzdHJpbmcgfTtcbiAgICBnZXRTb2FwSGVhZGVycygpOiBzdHJpbmdbXTtcbiAgICBzZXRFbmRwb2ludChlbmRwb2ludDogc3RyaW5nKTogdm9pZDtcbiAgICBzZXRTT0FQQWN0aW9uKGFjdGlvbjogc3RyaW5nKTogdm9pZDtcbiAgICBzZXRTZWN1cml0eShzZWN1cml0eTogSVNlY3VyaXR5KTogdm9pZDtcbiAgICB3c2RsOiBXU0RMO1xuICAgIFttZXRob2Q6IHN0cmluZ106IElTb2FwTWV0aG9kIHwgV1NETCB8IEZ1bmN0aW9uO1xuICAgIGNhbGwobWV0aG9kOiBzdHJpbmcsIGJvZHk6IGFueSwgb3B0aW9ucz86IGFueSwgZXh0cmFIZWFkZXJzPzogYW55KTogT2JzZXJ2YWJsZTxJU29hcE1ldGhvZFJlc3BvbnNlPjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJU29hcE1ldGhvZCB7XG4gICAgKGFyZ3M6IGFueSwgb3B0aW9ucz86IGFueSwgZXh0cmFIZWFkZXJzPzogYW55KTogT2JzZXJ2YWJsZTxJU29hcE1ldGhvZFJlc3BvbnNlPjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJU29hcE1ldGhvZFJlc3BvbnNlIHtcbiAgICBlcnI6IGFueSxcbiAgICBoZWFkZXI6IGFueSxcbiAgICByZXNwb25zZUJvZHk6IHN0cmluZyxcbiAgICB4bWw6IHN0cmluZztcbiAgICByZXN1bHQ6IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJU2VjdXJpdHkge1xuICAgIGFkZE9wdGlvbnMob3B0aW9uczogYW55KTogdm9pZDtcbiAgICB0b1hNTCgpOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmFzaWNBdXRoU2VjdXJpdHkgZXh0ZW5kcyBJU2VjdXJpdHkge1xuICAgIGNvbnN0cnVjdG9yKHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIGRlZmF1bHRzPzogYW55KTtcbiAgICBhZGRIZWFkZXJzKGhlYWRlcnM6IGFueSk6IHZvaWQ7XG4gICAgYWRkT3B0aW9ucyhvcHRpb25zOiBhbnkpOiB2b2lkO1xuICAgIHRvWE1MKCk6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCZWFyZXJTZWN1cml0eSBleHRlbmRzIElTZWN1cml0eSB7XG4gICAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZywgZGVmYXVsdHM/OiBhbnkpO1xuICAgIGFkZEhlYWRlcnMoaGVhZGVyczogYW55KTogdm9pZDtcbiAgICBhZGRPcHRpb25zKG9wdGlvbnM6IGFueSk6IHZvaWQ7XG4gICAgdG9YTUwoKTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdTU2VjdXJpdHkgZXh0ZW5kcyBJU2VjdXJpdHkge1xuICAgIGNvbnN0cnVjdG9yKHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIG9wdGlvbnM/OiBhbnkpO1xuICAgIGFkZE9wdGlvbnMob3B0aW9uczogYW55KTogdm9pZDtcbiAgICB0b1hNTCgpOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgV1NTZWN1cml0eUNlcnQgZXh0ZW5kcyBJU2VjdXJpdHkge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGVQRU06IGFueSwgcHVibGljUDEyUEVNOiBhbnksIHBhc3N3b3JkOiBhbnkpO1xuICAgIGFkZE9wdGlvbnMob3B0aW9uczogYW55KTogdm9pZDtcbiAgICB0b1hNTCgpOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTlRMTVNlY3VyaXR5IGV4dGVuZHMgSVNlY3VyaXR5IHtcbiAgICBjb25zdHJ1Y3Rvcih1c2VybmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nLCBkb21haW46IHN0cmluZywgd29ya3N0YXRpb24pO1xuICAgIGFkZEhlYWRlcnMoaGVhZGVyczogYW55KTogdm9pZDtcbiAgICBhZGRPcHRpb25zKG9wdGlvbnM6IGFueSk6IHZvaWQ7XG4gICAgdG9YTUwoKTogc3RyaW5nO1xufVxuIl19