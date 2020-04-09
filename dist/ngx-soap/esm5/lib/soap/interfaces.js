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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb2FwLyIsInNvdXJjZXMiOlsibGliL3NvYXAvaW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBSUEsbUNBR0M7OztJQUZHLDZCQUFhOztJQUNiLDhCQUFjOzs7OztBQUdsQixzQ0FZQzs7O0lBWEcseUNBQXVCOztJQUN2QixvQ0FBa0I7O0lBQ2xCLGtDQUFnQjs7SUFDaEIsK0NBQWdGOztJQUNoRiw2Q0FBd0Y7O0lBQ3hGLGdEQUErQjs7SUFDL0IscUNBQW9COztJQUNwQix1Q0FBc0I7O0lBQ3RCLDJDQUEwQjs7SUFDMUIsd0NBQXNDOztJQUN0Qyx3Q0FBc0M7Ozs7O0FBRzFDLGlDQWFDOzs7SUFaRyxtQ0FBcUI7O0lBQ3JCLHdDQUE0Qjs7SUFDNUIsK0JBQXVCOztJQUN2QixnQ0FBeUI7O0lBQ3pCLCtCQUF1Qjs7SUFDdkIsK0JBQXVCOztJQUN2Qiw4QkFBcUI7O0lBQ3JCLCtCQUFpQjs7SUFDakIsNkJBQWU7O0lBQ2YsNEJBQWlCOzs7Ozs7Ozs7QUFNckIsaUNBRUM7Ozs7QUFDRCxnQ0FVQzs7O0lBVEcsOEJBQWdCOztJQUNoQixrQ0FBNEI7O0lBQzVCLDhCQUF3Qjs7SUFDeEIsOEJBQWdCOztJQUNoQiwwQkFBYTs7SUFDYiw0QkFBZTs7SUFDZiw0QkFBZTs7SUFDZiwyQkFBcUI7O0lBQ3JCLDJCQUFpQjs7Ozs7QUFFckIsa0NBRUM7Ozs7QUFHRCwrQkFTQzs7O0lBUkcsd0JBQWE7O0lBQ2Isd0JBQWE7O0lBQ2IseUJBQWM7O0lBQ2QseUJBQWM7O0lBQ2Qsd0JBQWE7O0lBQ2Isd0JBQWE7O0lBQ2IsNEJBQWlCOzs7Ozs7QUFJckIsb0NBT0M7OztJQU5HLGtDQUE4Qjs7SUFDOUIsOEJBQWE7O0lBQ2IsZ0NBQWU7O0lBQ2YsZ0NBQWU7Ozs7Ozs7O0FBS25CLG9DQVlDOzs7SUFYRyxrQ0FBOEI7O0lBQzlCLDhCQUFhOztJQUNiLGdDQUFlOztJQUNmLGdDQUFlOztJQUNmLHVDQUFzQjs7SUFDdEIseUNBQXdCOzs7Ozs7Ozs7Ozs7OztBQVE1QixrQ0FFQzs7OztBQUNELGlDQUlDOzs7SUFIRyw4QkFBb0I7O0lBQ3BCLDRCQUErQjs7Ozs7OztBQUluQyxtQ0FFQzs7OztBQUNELGtDQUVDOzs7SUFERywrQkFBdUM7Ozs7O0FBRzNDLGtDQUVDOzs7O0FBQ0QsaUNBS0M7OztJQUpHLDhCQUFzQjs7SUFDdEIsNEJBQWM7O0lBQ2QsZ0NBQWtCOztJQUNsQixrQ0FBbUM7Ozs7O0FBR3ZDLGtDQUVDOzs7O0FBQ0QsaUNBRUM7OztJQURHLDRCQUE2Qjs7Ozs7QUFHakMsaUNBS0M7OztJQUpHLHdDQUE0Qjs7SUFDNUIsK0JBQWlCOztJQUNqQiw2QkFBZTs7SUFDZiw0QkFBa0I7Ozs7O0FBR3RCLDhCQVdDOzs7SUFWRyxnQ0FBdUI7O0lBQ3ZCLDRCQUFrQjs7SUFDbEIsK0JBQXFCOztJQUNyQiw4QkFBd0I7O0lBRXhCLDBCQUFpQjs7SUFFakIsc0NBQTZCOztJQUM3QixzQ0FBeUI7Ozs7OztBQUk3QiwwQkF1QkM7OztJQXJCRyxpQ0FBNEI7O0lBQzVCLG9DQUE4Qjs7SUFDOUIsd0JBQWlCOztJQUNqQixzQkFBZTs7SUFDZiwrQkFBd0I7O0lBZXhCLG1CQUFZOztJQUNaLDJCQUF5Qjs7Ozs7OztJQXJCekIscUVBQThEOzs7OztJQU05RCxpREFBNkM7Ozs7O0lBQzdDLHlEQUFxRDs7OztJQUNyRCxrREFBeUM7Ozs7SUFDekMsdUNBQWdCOzs7Ozs7SUFDaEIsMERBQXVFOzs7Ozs7SUFDdkUsOERBQThFOzs7Ozs7Ozs7SUFDOUUsd0ZBQXNHOzs7Ozs7Ozs7SUFDdEcsc0ZBQW9HOzs7OztJQUNwRyxzREFBd0M7Ozs7O0lBQ3hDLDZEQUE4Qzs7Ozs7Ozs7Ozs7O0lBQzlDLG9IQUFxSjs7Ozs7O0lBQ3JKLG1FQUFzRDs7Ozs7O0lBQ3RELDJEQUEyQzs7Ozs7OztJQUMzQyw2RkFBbUY7Ozs7O0FBS3ZGLDRCQW1CQzs7O0lBSEcsc0JBQVc7Ozs7Ozs7O0lBZlgsc0VBQStEOzs7Ozs7OztJQUMvRCx5RkFBOEY7Ozs7OztJQUM5Riw0REFBOEM7Ozs7Ozs7O0lBQzlDLG1GQUF1Rjs7Ozs7Ozs7O0lBQ3ZGLDZGQUEwRzs7OztJQUMxRyx1REFBNEI7Ozs7SUFDNUIsb0RBQXlCOzs7O0lBQ3pCLG9EQUF5Qjs7OztJQUN6Qiw0Q0FBZ0I7Ozs7SUFDaEIscURBQTJCOzs7O0lBQzNCLGtEQUF5Qzs7OztJQUN6QyxrREFBMkI7Ozs7O0lBQzNCLHVEQUFvQzs7Ozs7SUFDcEMsdURBQW9DOzs7OztJQUNwQyx1REFBdUM7Ozs7Ozs7O0lBR3ZDLDJFQUFvRzs7Ozs7QUFHeEcsaUNBRUM7Ozs7QUFFRCx5Q0FNQzs7O0lBTEcsa0NBQVM7O0lBQ1QscUNBQVk7O0lBQ1osMkNBQXFCOztJQUNyQixrQ0FBWTs7SUFDWixxQ0FBWTs7Ozs7QUFHaEIsK0JBR0M7Ozs7OztJQUZHLHdEQUErQjs7OztJQUMvQiw0Q0FBZ0I7Ozs7O0FBR3BCLHVDQUtDOzs7Ozs7OztJQUpHLHNGQUFnRTs7Ozs7SUFDaEUsZ0VBQStCOzs7OztJQUMvQixnRUFBK0I7Ozs7SUFDL0Isb0RBQWdCOzs7OztBQUdwQixvQ0FLQzs7Ozs7OztJQUpHLHNFQUEyQzs7Ozs7SUFDM0MsNkRBQStCOzs7OztJQUMvQiw2REFBK0I7Ozs7SUFDL0IsaURBQWdCOzs7OztBQUdwQixnQ0FJQzs7Ozs7Ozs7SUFIRyw4RUFBK0Q7Ozs7O0lBQy9ELHlEQUErQjs7OztJQUMvQiw2Q0FBZ0I7Ozs7O0FBR3BCLG9DQUlDOzs7Ozs7OztJQUhHLHlGQUErRDs7Ozs7SUFDL0QsNkRBQStCOzs7O0lBQy9CLGlEQUFnQjs7Ozs7QUFHcEIsa0NBS0M7Ozs7Ozs7OztJQUpHLDRGQUE2RTs7Ozs7SUFDN0UsMkRBQStCOzs7OztJQUMvQiwyREFBK0I7Ozs7SUFDL0IsK0NBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJWG1sQXR0cmlidXRlIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHZhbHVlOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVdzZGxCYXNlT3B0aW9ucyB7XHJcbiAgICBhdHRyaWJ1dGVzS2V5Pzogc3RyaW5nO1xyXG4gICAgdmFsdWVLZXk/OiBzdHJpbmc7XHJcbiAgICB4bWxLZXk/OiBzdHJpbmc7XHJcbiAgICBvdmVycmlkZVJvb3RFbGVtZW50PzogeyBuYW1lc3BhY2U6IHN0cmluZzsgeG1sbnNBdHRyaWJ1dGVzPzogSVhtbEF0dHJpYnV0ZVtdOyB9O1xyXG4gICAgaWdub3JlZE5hbWVzcGFjZXM/OiBib29sZWFuIHwgc3RyaW5nW10gfCB7IG5hbWVzcGFjZXM/OiBzdHJpbmdbXTsgb3ZlcnJpZGU/OiBib29sZWFuOyB9O1xyXG4gICAgaWdub3JlQmFzZU5hbWVTcGFjZXM/OiBib29sZWFuO1xyXG4gICAgZXNjYXBlWE1MPzogYm9vbGVhbjtcclxuICAgIHJldHVybkZhdWx0PzogYm9vbGVhbjtcclxuICAgIGhhbmRsZU5pbEFzTnVsbD86IGJvb2xlYW47XHJcbiAgICB3c2RsX2hlYWRlcnM/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9O1xyXG4gICAgd3NkbF9vcHRpb25zPzogeyBba2V5OiBzdHJpbmddOiBhbnkgfTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBEZWZpbml0aW9ucyB7XHJcbiAgICBkZXNjcmlwdGlvbnM6IG9iamVjdDtcclxuICAgIGlnbm9yZWROYW1lc3BhY2VzOiBzdHJpbmdbXTtcclxuICAgIG1lc3NhZ2VzOiBXc2RsTWVzc2FnZXM7XHJcbiAgICBwb3J0VHlwZXM6IFdzZGxQb3J0VHlwZXM7XHJcbiAgICBiaW5kaW5nczogV3NkbEJpbmRpbmdzO1xyXG4gICAgc2VydmljZXM6IFdzZGxTZXJ2aWNlcztcclxuICAgIHNjaGVtYXM6IFdzZGxTY2hlbWFzO1xyXG4gICAgdmFsdWVLZXk6IHN0cmluZztcclxuICAgIHhtbEtleTogc3RyaW5nO1xyXG4gICAgeG1sbnM6IFdzZGxYbWxucztcclxuICAgICckdGFyZ2V0TmFtZXNwYWNlJzogc3RyaW5nO1xyXG4gICAgJyRuYW1lJzogc3RyaW5nO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBXc2RsU2NoZW1hcyB7XHJcbiAgICBbcHJvcDogc3RyaW5nXTogV3NkbFNjaGVtYTtcclxufVxyXG5leHBvcnQgaW50ZXJmYWNlIFdzZGxTY2hlbWEgZXh0ZW5kcyBYc2RUeXBlQmFzZSB7XHJcbiAgICBjaGlsZHJlbjogYW55W107XHJcbiAgICBjb21wbGV4VHlwZXM/OiBXc2RsRWxlbWVudHM7XHJcbiAgICBlbGVtZW50cz86IFdzZGxFbGVtZW50cztcclxuICAgIGluY2x1ZGVzOiBhbnlbXTtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIG5zTmFtZTogc3RyaW5nO1xyXG4gICAgcHJlZml4OiBzdHJpbmc7XHJcbiAgICB0eXBlcz86IFdzZGxFbGVtZW50cztcclxuICAgIHhtbG5zOiBXc2RsWG1sbnM7XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBXc2RsRWxlbWVudHMge1xyXG4gICAgW3Byb3A6IHN0cmluZ106IFhzZEVsZW1lbnQ7XHJcbn1cclxuZXhwb3J0IHR5cGUgWHNkRWxlbWVudCA9IFhzZEVsZW1lbnRUeXBlIHwgWHNkQ29tcGxleFR5cGU7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFdzZGxYbWxucyB7XHJcbiAgICB3c3U/OiBzdHJpbmc7XHJcbiAgICB3c3A/OiBzdHJpbmc7XHJcbiAgICB3c2FtPzogc3RyaW5nO1xyXG4gICAgc29hcD86IHN0cmluZztcclxuICAgIHRucz86IHN0cmluZztcclxuICAgIHhzZD86IHN0cmluZztcclxuICAgIF9fdG5zX18/OiBzdHJpbmc7XHJcbiAgICBbcHJvcDogc3RyaW5nXTogc3RyaW5nIHwgdm9pZDtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBYc2RDb21wbGV4VHlwZSBleHRlbmRzIFhzZFR5cGVCYXNlIHtcclxuICAgIGNoaWxkcmVuOiBYc2RFbGVtZW50W10gfCB2b2lkO1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgbnNOYW1lOiBzdHJpbmc7XHJcbiAgICBwcmVmaXg6IHN0cmluZztcclxuICAgICckbmFtZSc6IHN0cmluZztcclxuICAgIFtwcm9wOiBzdHJpbmddOiBhbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgWHNkRWxlbWVudFR5cGUgZXh0ZW5kcyBYc2RUeXBlQmFzZSB7XHJcbiAgICBjaGlsZHJlbjogWHNkRWxlbWVudFtdIHwgdm9pZDtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIG5zTmFtZTogc3RyaW5nO1xyXG4gICAgcHJlZml4OiBzdHJpbmc7XHJcbiAgICB0YXJnZXROU0FsaWFzOiBzdHJpbmc7XHJcbiAgICB0YXJnZXROYW1lc3BhY2U6IHN0cmluZztcclxuICAgICckbG9va3VwVHlwZSc6IHN0cmluZztcclxuICAgICckbG9va3VwVHlwZXMnOiBhbnlbXTtcclxuICAgICckbmFtZSc6IHN0cmluZztcclxuICAgICckdHlwZSc6IHN0cmluZztcclxuICAgIFtwcm9wOiBzdHJpbmddOiBhbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgV3NkbE1lc3NhZ2VzIHtcclxuICAgIFtwcm9wOiBzdHJpbmddOiBXc2RsTWVzc2FnZTtcclxufVxyXG5leHBvcnQgaW50ZXJmYWNlIFdzZGxNZXNzYWdlIGV4dGVuZHMgWHNkVHlwZUJhc2Uge1xyXG4gICAgZWxlbWVudDogWHNkRWxlbWVudDtcclxuICAgIHBhcnRzOiB7IFtwcm9wOiBzdHJpbmddOiBhbnkgfTtcclxuICAgICckbmFtZSc6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBXc2RsUG9ydFR5cGVzIHtcclxuICAgIFtwcm9wOiBzdHJpbmddOiBXc2RsUG9ydFR5cGU7XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBXc2RsUG9ydFR5cGUgZXh0ZW5kcyBYc2RUeXBlQmFzZSB7XHJcbiAgICBtZXRob2RzOiB7IFtwcm9wOiBzdHJpbmddOiBYc2RFbGVtZW50IH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBXc2RsQmluZGluZ3Mge1xyXG4gICAgW3Byb3A6IHN0cmluZ106IFdzZGxCaW5kaW5nO1xyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgV3NkbEJpbmRpbmcgZXh0ZW5kcyBYc2RUeXBlQmFzZSB7XHJcbiAgICBtZXRob2RzOiBXc2RsRWxlbWVudHM7XHJcbiAgICBzdHlsZTogc3RyaW5nO1xyXG4gICAgdHJhbnNwb3J0OiBzdHJpbmc7XHJcbiAgICB0b3BFbGVtZW50czoge1twcm9wOiBzdHJpbmddOiBhbnl9O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFdzZGxTZXJ2aWNlcyB7XHJcbiAgICBbcHJvcDogc3RyaW5nXTogV3NkbFNlcnZpY2U7XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBXc2RsU2VydmljZSBleHRlbmRzIFhzZFR5cGVCYXNlIHtcclxuICAgIHBvcnRzOiB7W3Byb3A6IHN0cmluZ106IGFueX07XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgWHNkVHlwZUJhc2Uge1xyXG4gICAgaWdub3JlZE5hbWVzcGFjZXM6IHN0cmluZ1tdO1xyXG4gICAgdmFsdWVLZXk6IHN0cmluZztcclxuICAgIHhtbEtleTogc3RyaW5nO1xyXG4gICAgeG1sbnM/OiBXc2RsWG1sbnMsXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnMgZXh0ZW5kcyBJV3NkbEJhc2VPcHRpb25zIHtcclxuICAgIGRpc2FibGVDYWNoZT86IGJvb2xlYW47XHJcbiAgICBlbmRwb2ludD86IHN0cmluZztcclxuICAgIGVudmVsb3BlS2V5Pzogc3RyaW5nO1xyXG4gICAgaHR0cENsaWVudD86IEh0dHBDbGllbnQ7XHJcbiAgICAvLyByZXF1ZXN0PzogKG9wdGlvbnM6IGFueSwgY2FsbGJhY2s/OiAoZXJyb3I6IGFueSwgcmVzOiBhbnksIGJvZHk6IGFueSkgPT4gdm9pZCkgPT4gdm9pZDtcclxuICAgIHN0cmVhbT86IGJvb2xlYW47XHJcbiAgICAvLyB3c2RsIG9wdGlvbnMgdGhhdCBvbmx5IHdvcmsgZm9yIGNsaWVudFxyXG4gICAgZm9yY2VTb2FwMTJIZWFkZXJzPzogYm9vbGVhbjtcclxuICAgIGN1c3RvbURlc2VyaWFsaXplcj86IGFueTtcclxuICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBXU0RMIHtcclxuICAgIGNvbnN0cnVjdG9yKGRlZmluaXRpb246IGFueSwgdXJpOiBzdHJpbmcsIG9wdGlvbnM/OiBJT3B0aW9ucyk7XHJcbiAgICBpZ25vcmVkTmFtZXNwYWNlczogc3RyaW5nW107XHJcbiAgICBpZ25vcmVCYXNlTmFtZVNwYWNlczogYm9vbGVhbjtcclxuICAgIHZhbHVlS2V5OiBzdHJpbmc7XHJcbiAgICB4bWxLZXk6IHN0cmluZztcclxuICAgIHhtbG5zSW5FbnZlbG9wZTogc3RyaW5nO1xyXG4gICAgb25SZWFkeShjYWxsYmFjazogKGVycjpFcnJvcikgPT4gdm9pZCk6IHZvaWQ7XHJcbiAgICBwcm9jZXNzSW5jbHVkZXMoY2FsbGJhY2s6IChlcnI6RXJyb3IpID0+IHZvaWQpOiB2b2lkO1xyXG4gICAgZGVzY3JpYmVTZXJ2aWNlcygpOiB7IFtrOiBzdHJpbmddOiBhbnkgfTtcclxuICAgIHRvWE1MKCk6IHN0cmluZztcclxuICAgIHhtbFRvT2JqZWN0KHhtbDogYW55LCBjYWxsYmFjaz86IChlcnI6RXJyb3IsIHJlc3VsdDphbnkpID0+IHZvaWQpOiBhbnk7XHJcbiAgICBmaW5kU2NoZW1hT2JqZWN0KG5zVVJJOiBzdHJpbmcsIHFuYW1lOiBzdHJpbmcpOiBYc2RFbGVtZW50IHwgbnVsbCB8IHVuZGVmaW5lZDtcclxuICAgIG9iamVjdFRvRG9jdW1lbnRYTUwobmFtZTogc3RyaW5nLCBwYXJhbXM6IGFueSwgbnNQcmVmaXg/OiBzdHJpbmcsIG5zVVJJPzogc3RyaW5nLCB0eXBlPzogc3RyaW5nKTogYW55O1xyXG4gICAgb2JqZWN0VG9ScGNYTUwobmFtZTogc3RyaW5nLCBwYXJhbXM6IGFueSwgbnNQcmVmaXg/OiBzdHJpbmcsIG5zVVJJPzogc3RyaW5nLCBpc1BhcnRzPzogYW55KTogc3RyaW5nO1xyXG4gICAgaXNJZ25vcmVkTmFtZVNwYWNlKG5zOiBzdHJpbmcpOiBib29sZWFuO1xyXG4gICAgZmlsdGVyT3V0SWdub3JlZE5hbWVTcGFjZShuczogc3RyaW5nKTogc3RyaW5nO1xyXG4gICAgb2JqZWN0VG9YTUwob2JqOiBhbnksIG5hbWU6IHN0cmluZywgbnNQcmVmaXg/OiBhbnksIG5zVVJJPzogc3RyaW5nLCBpc0ZpcnN0PzogYm9vbGVhbiwgeG1sbnNBdHRyPzogYW55LCBzY2hlbWFPYmplY3Q/OiBhbnksIG5zQ29udGV4dD86IGFueSk6IHN0cmluZztcclxuICAgIHByb2Nlc3NBdHRyaWJ1dGVzKGNoaWxkOiBhbnksIG5zQ29udGV4dDogYW55KTogc3RyaW5nO1xyXG4gICAgZmluZFNjaGVtYVR5cGUobmFtZTogYW55LCBuc1VSSTogYW55KTogYW55O1xyXG4gICAgZmluZENoaWxkU2NoZW1hT2JqZWN0KHBhcmFtZXRlclR5cGVPYmo6IGFueSwgY2hpbGROYW1lOiBhbnksIGJhY2t0cmFjZT86IGFueSk6IGFueTtcclxuICAgIHVyaTogc3RyaW5nO1xyXG4gICAgZGVmaW5pdGlvbnM6IERlZmluaXRpb25zO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENsaWVudCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcih3c2RsOiBXU0RMLCBlbmRwb2ludD86IHN0cmluZywgb3B0aW9ucz86IElPcHRpb25zKTtcclxuICAgIGFkZEJvZHlBdHRyaWJ1dGUoYm9keUF0dHJpYnV0ZTogYW55LCBuYW1lPzogc3RyaW5nLCBuYW1lc3BhY2U/OiBzdHJpbmcsIHhtbG5zPzogc3RyaW5nKTogdm9pZDtcclxuICAgIGFkZEh0dHBIZWFkZXIobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KTogdm9pZDtcclxuICAgIGFkZFNvYXBIZWFkZXIoc29hcEhlYWRlcjogYW55LCBuYW1lPzogc3RyaW5nLCBuYW1lc3BhY2U/OiBhbnksIHhtbG5zPzogc3RyaW5nKTogbnVtYmVyO1xyXG4gICAgY2hhbmdlU29hcEhlYWRlcihpbmRleDogbnVtYmVyLCBzb2FwSGVhZGVyOiBhbnksIG5hbWU/OiBzdHJpbmcsIG5hbWVzcGFjZT86IHN0cmluZywgeG1sbnM/OiBzdHJpbmcpOiB2b2lkO1xyXG4gICAgY2xlYXJCb2R5QXR0cmlidXRlcygpOiB2b2lkO1xyXG4gICAgY2xlYXJIdHRwSGVhZGVycygpOiB2b2lkO1xyXG4gICAgY2xlYXJTb2FwSGVhZGVycygpOiB2b2lkO1xyXG4gICAgZGVzY3JpYmUoKTogYW55O1xyXG4gICAgZ2V0Qm9keUF0dHJpYnV0ZXMoKTogYW55W107XHJcbiAgICBnZXRIdHRwSGVhZGVycygpOiB7IFtrOnN0cmluZ106IHN0cmluZyB9O1xyXG4gICAgZ2V0U29hcEhlYWRlcnMoKTogc3RyaW5nW107XHJcbiAgICBzZXRFbmRwb2ludChlbmRwb2ludDogc3RyaW5nKTogdm9pZDtcclxuICAgIHNldFNPQVBBY3Rpb24oYWN0aW9uOiBzdHJpbmcpOiB2b2lkO1xyXG4gICAgc2V0U2VjdXJpdHkoc2VjdXJpdHk6IElTZWN1cml0eSk6IHZvaWQ7XHJcbiAgICB3c2RsOiBXU0RMO1xyXG4gICAgW21ldGhvZDogc3RyaW5nXTogSVNvYXBNZXRob2QgfCBXU0RMIHwgRnVuY3Rpb247XHJcbiAgICBjYWxsKG1ldGhvZDogc3RyaW5nLCBib2R5OiBhbnksIG9wdGlvbnM/OiBhbnksIGV4dHJhSGVhZGVycz86IGFueSk6IE9ic2VydmFibGU8SVNvYXBNZXRob2RSZXNwb25zZT47XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVNvYXBNZXRob2Qge1xyXG4gICAgKGFyZ3M6IGFueSwgb3B0aW9ucz86IGFueSwgZXh0cmFIZWFkZXJzPzogYW55KTogT2JzZXJ2YWJsZTxJU29hcE1ldGhvZFJlc3BvbnNlPjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU29hcE1ldGhvZFJlc3BvbnNlIHtcclxuICAgIGVycjogYW55LFxyXG4gICAgaGVhZGVyOiBhbnksXHJcbiAgICByZXNwb25zZUJvZHk6IHN0cmluZyxcclxuICAgIHhtbDogc3RyaW5nO1xyXG4gICAgcmVzdWx0OiBhbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVNlY3VyaXR5IHtcclxuICAgIGFkZE9wdGlvbnMob3B0aW9uczogYW55KTogdm9pZDtcclxuICAgIHRvWE1MKCk6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBCYXNpY0F1dGhTZWN1cml0eSBleHRlbmRzIElTZWN1cml0eSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih1c2VybmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nLCBkZWZhdWx0cz86IGFueSk7XHJcbiAgICBhZGRIZWFkZXJzKGhlYWRlcnM6IGFueSk6IHZvaWQ7XHJcbiAgICBhZGRPcHRpb25zKG9wdGlvbnM6IGFueSk6IHZvaWQ7XHJcbiAgICB0b1hNTCgpOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQmVhcmVyU2VjdXJpdHkgZXh0ZW5kcyBJU2VjdXJpdHkge1xyXG4gICAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZywgZGVmYXVsdHM/OiBhbnkpO1xyXG4gICAgYWRkSGVhZGVycyhoZWFkZXJzOiBhbnkpOiB2b2lkO1xyXG4gICAgYWRkT3B0aW9ucyhvcHRpb25zOiBhbnkpOiB2b2lkO1xyXG4gICAgdG9YTUwoKTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFdTU2VjdXJpdHkgZXh0ZW5kcyBJU2VjdXJpdHkge1xyXG4gICAgY29uc3RydWN0b3IodXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZywgb3B0aW9ucz86IGFueSk7XHJcbiAgICBhZGRPcHRpb25zKG9wdGlvbnM6IGFueSk6IHZvaWQ7XHJcbiAgICB0b1hNTCgpOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgV1NTZWN1cml0eUNlcnQgZXh0ZW5kcyBJU2VjdXJpdHkge1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZVBFTTogYW55LCBwdWJsaWNQMTJQRU06IGFueSwgcGFzc3dvcmQ6IGFueSk7XHJcbiAgICBhZGRPcHRpb25zKG9wdGlvbnM6IGFueSk6IHZvaWQ7XHJcbiAgICB0b1hNTCgpOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTlRMTVNlY3VyaXR5IGV4dGVuZHMgSVNlY3VyaXR5IHtcclxuICAgIGNvbnN0cnVjdG9yKHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIGRvbWFpbjogc3RyaW5nLCB3b3Jrc3RhdGlvbik7XHJcbiAgICBhZGRIZWFkZXJzKGhlYWRlcnM6IGFueSk6IHZvaWQ7XHJcbiAgICBhZGRPcHRpb25zKG9wdGlvbnM6IGFueSk6IHZvaWQ7XHJcbiAgICB0b1hNTCgpOiBzdHJpbmc7XHJcbn1cclxuIl19