/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/*
 * Copyright (c) 2011 Vinay Pulim <vinay@milewise.com>
 * MIT Licensed
 */
import * as assert from 'assert';
// import * as events from 'events';
// import * as util from 'util';
import { findPrefix } from './utils';
import * as _ from 'lodash';
import uuid4 from 'uuid/v4';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';
/** @type {?} */
const nonIdentifierChars = /[^a-z$_0-9]/i;
/** @type {?} */
export const Client = (/**
 * @param {?} wsdl
 * @param {?} endpoint
 * @param {?} options
 * @return {?}
 */
function (wsdl, endpoint, options) {
    // events.EventEmitter.call(this);
    options = options || {};
    this.wsdl = wsdl;
    this._initializeOptions(options);
    this._initializeServices(endpoint);
    this.httpClient = (/** @type {?} */ (options.httpClient));
    /** @type {?} */
    const promiseOptions = { multiArgs: true };
    if (options.overridePromiseSuffix) {
        promiseOptions.suffix = options.overridePromiseSuffix;
    }
    Promise.all([this, promiseOptions]);
});
// util.inherits(Client, events.EventEmitter);
Client.prototype.addSoapHeader = (/**
 * @param {?} soapHeader
 * @param {?} name
 * @param {?} namespace
 * @param {?} xmlns
 * @return {?}
 */
function (soapHeader, name, namespace, xmlns) {
    if (!this.soapHeaders) {
        this.soapHeaders = [];
    }
    if (typeof soapHeader === 'object') {
        soapHeader = this.wsdl.objectToXML(soapHeader, name, namespace, xmlns, true);
    }
    return this.soapHeaders.push(soapHeader) - 1;
});
Client.prototype.changeSoapHeader = (/**
 * @param {?} index
 * @param {?} soapHeader
 * @param {?} name
 * @param {?} namespace
 * @param {?} xmlns
 * @return {?}
 */
function (index, soapHeader, name, namespace, xmlns) {
    if (!this.soapHeaders) {
        this.soapHeaders = [];
    }
    if (typeof soapHeader === 'object') {
        soapHeader = this.wsdl.objectToXML(soapHeader, name, namespace, xmlns, true);
    }
    this.soapHeaders[index] = soapHeader;
});
Client.prototype.getSoapHeaders = (/**
 * @return {?}
 */
function () {
    return this.soapHeaders;
});
Client.prototype.clearSoapHeaders = (/**
 * @return {?}
 */
function () {
    this.soapHeaders = null;
});
Client.prototype.addHttpHeader = (/**
 * @param {?} name
 * @param {?} value
 * @return {?}
 */
function (name, value) {
    if (!this.httpHeaders) {
        this.httpHeaders = {};
    }
    this.httpHeaders[name] = value;
});
Client.prototype.getHttpHeaders = (/**
 * @return {?}
 */
function () {
    return this.httpHeaders;
});
Client.prototype.clearHttpHeaders = (/**
 * @return {?}
 */
function () {
    this.httpHeaders = {};
});
Client.prototype.addBodyAttribute = (/**
 * @param {?} bodyAttribute
 * @param {?} name
 * @param {?} namespace
 * @param {?} xmlns
 * @return {?}
 */
function (bodyAttribute, name, namespace, xmlns) {
    if (!this.bodyAttributes) {
        this.bodyAttributes = [];
    }
    if (typeof bodyAttribute === 'object') {
        /** @type {?} */
        let composition = '';
        Object.getOwnPropertyNames(bodyAttribute).forEach((/**
         * @param {?} prop
         * @param {?} idx
         * @param {?} array
         * @return {?}
         */
        function (prop, idx, array) {
            composition += ' ' + prop + '="' + bodyAttribute[prop] + '"';
        }));
        bodyAttribute = composition;
    }
    if (bodyAttribute.substr(0, 1) !== ' ')
        bodyAttribute = ' ' + bodyAttribute;
    this.bodyAttributes.push(bodyAttribute);
});
Client.prototype.getBodyAttributes = (/**
 * @return {?}
 */
function () {
    return this.bodyAttributes;
});
Client.prototype.clearBodyAttributes = (/**
 * @return {?}
 */
function () {
    this.bodyAttributes = null;
});
Client.prototype.setEndpoint = (/**
 * @param {?} endpoint
 * @return {?}
 */
function (endpoint) {
    this.endpoint = endpoint;
    this._initializeServices(endpoint);
});
Client.prototype.describe = (/**
 * @return {?}
 */
function () {
    /** @type {?} */
    const types = this.wsdl.definitions.types;
    return this.wsdl.describeServices();
});
Client.prototype.setSecurity = (/**
 * @param {?} security
 * @return {?}
 */
function (security) {
    this.security = security;
});
Client.prototype.setSOAPAction = (/**
 * @param {?} SOAPAction
 * @return {?}
 */
function (SOAPAction) {
    this.SOAPAction = SOAPAction;
});
Client.prototype._initializeServices = (/**
 * @param {?} endpoint
 * @return {?}
 */
function (endpoint) {
    /** @type {?} */
    const definitions = this.wsdl.definitions;
    /** @type {?} */
    const services = definitions.services;
    for (const name in services) {
        this[name] = this._defineService(services[name], endpoint);
    }
});
Client.prototype._initializeOptions = (/**
 * @param {?} options
 * @return {?}
 */
function (options) {
    this.streamAllowed = options.stream;
    this.normalizeNames = options.normalizeNames;
    this.wsdl.options.attributesKey = options.attributesKey || 'attributes';
    this.wsdl.options.envelopeKey = options.envelopeKey || 'soap';
    this.wsdl.options.preserveWhitespace = !!options.preserveWhitespace;
    if (options.ignoredNamespaces !== undefined) {
        if (options.ignoredNamespaces.override !== undefined) {
            if (options.ignoredNamespaces.override === true) {
                if (options.ignoredNamespaces.namespaces !== undefined) {
                    this.wsdl.options.ignoredNamespaces = options.ignoredNamespaces.namespaces;
                }
            }
        }
    }
    if (options.overrideRootElement !== undefined) {
        this.wsdl.options.overrideRootElement = options.overrideRootElement;
    }
    this.wsdl.options.forceSoap12Headers = !!options.forceSoap12Headers;
});
Client.prototype._defineService = (/**
 * @param {?} service
 * @param {?} endpoint
 * @return {?}
 */
function (service, endpoint) {
    /** @type {?} */
    const ports = service.ports;
    /** @type {?} */
    const def = {};
    for (const name in ports) {
        def[name] = this._definePort(ports[name], endpoint ? endpoint : ports[name].location);
    }
    return def;
});
Client.prototype._definePort = (/**
 * @param {?} port
 * @param {?} endpoint
 * @return {?}
 */
function (port, endpoint) {
    /** @type {?} */
    const location = endpoint;
    /** @type {?} */
    const binding = port.binding;
    /** @type {?} */
    const methods = binding.methods;
    /** @type {?} */
    const def = {};
    for (const name in methods) {
        def[name] = this._defineMethod(methods[name], location);
        /** @type {?} */
        const methodName = this.normalizeNames ? name.replace(nonIdentifierChars, '_') : name;
        this[methodName] = def[name];
    }
    return def;
});
Client.prototype._defineMethod = (/**
 * @param {?} method
 * @param {?} location
 * @return {?}
 */
function (method, location) {
    /** @type {?} */
    const self = this;
    /** @type {?} */
    let temp = null;
    return (/**
     * @param {?} args
     * @param {?} options
     * @param {?} extraHeaders
     * @return {?}
     */
    function (args, options, extraHeaders) {
        return self._invoke(method, args, location, options, extraHeaders);
    });
});
Client.prototype._invoke = (/**
 * @param {?} method
 * @param {?} args
 * @param {?} location
 * @param {?} options
 * @param {?} extraHeaders
 * @return {?}
 */
function (method, args, location, options, extraHeaders) {
    /** @type {?} */
    let self = this;
    /** @type {?} */
    let name = method.$name;
    /** @type {?} */
    let input = method.input;
    /** @type {?} */
    let output = method.output;
    /** @type {?} */
    let style = method.style;
    /** @type {?} */
    let defs = this.wsdl.definitions;
    /** @type {?} */
    let envelopeKey = this.wsdl.options.envelopeKey;
    /** @type {?} */
    let ns = defs.$targetNamespace;
    /** @type {?} */
    let encoding = '';
    /** @type {?} */
    let message = '';
    /** @type {?} */
    let xml = null;
    /** @type {?} */
    let req = null;
    /** @type {?} */
    let soapAction = null;
    /** @type {?} */
    let alias = findPrefix(defs.xmlns, ns);
    /** @type {?} */
    let headers = {
        "Content-Type": "text/xml; charset=utf-8"
    };
    /** @type {?} */
    let xmlnsSoap = "xmlns:" + envelopeKey + "=\"http://schemas.xmlsoap.org/soap/envelope/\"";
    if (this.wsdl.options.forceSoap12Headers) {
        headers["Content-Type"] = "application/soap+xml; charset=utf-8";
        xmlnsSoap = "xmlns:" + envelopeKey + "=\"http://www.w3.org/2003/05/soap-envelope\"";
    }
    if (this.SOAPAction) {
        soapAction = this.SOAPAction;
    }
    else if (method.soapAction !== undefined && method.soapAction !== null) {
        soapAction = method.soapAction;
    }
    else {
        soapAction = ((ns.lastIndexOf("/") !== ns.length - 1) ? ns + "/" : ns) + name;
    }
    if (!this.wsdl.options.forceSoap12Headers) {
        headers.SOAPAction = '"' + soapAction + '"';
    }
    options = options || {};
    //Add extra headers
    for (const header in this.httpHeaders) {
        headers[header] = this.httpHeaders[header];
    }
    for (const attr in extraHeaders) {
        headers[attr] = extraHeaders[attr];
    }
    // Allow the security object to add headers
    if (self.security && self.security.addHeaders)
        self.security.addHeaders(headers);
    if (self.security && self.security.addOptions)
        self.security.addOptions(options);
    if ((style === 'rpc') && ((input.parts || input.name === "element") || args === null)) {
        assert.ok(!style || style === 'rpc', 'invalid message definition for document style binding');
        message = self.wsdl.objectToRpcXML(name, args, alias, ns, (input.name !== "element"));
        (method.inputSoap === 'encoded') && (encoding = 'soap:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" ');
    }
    else {
        assert.ok(!style || style === 'document', 'invalid message definition for rpc style binding');
        // pass `input.$lookupType` if `input.$type` could not be found
        message = self.wsdl.objectToDocumentXML(input.$name, args, input.targetNSAlias, input.targetNamespace, (input.$type || input.$lookupType));
    }
    xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
        "<" + envelopeKey + ":Envelope " +
        xmlnsSoap + " " +
        "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
        encoding +
        this.wsdl.xmlnsInEnvelope + '>' +
        ((self.soapHeaders || self.security) ?
            ("<" + envelopeKey + ":Header>" +
                (self.soapHeaders ? self.soapHeaders.join("\n") : "") +
                (self.security && !self.security.postProcess ? self.security.toXML() : "") +
                "</" + envelopeKey + ":Header>")
            :
                '') +
        "<" + envelopeKey + ":Body" +
        (self.bodyAttributes ? self.bodyAttributes.join(' ') : '') +
        (self.security && self.security.postProcess ? ' Id="_0"' : '') +
        ">" +
        message +
        "</" + envelopeKey + ":Body>" +
        "</" + envelopeKey + ":Envelope>";
    if (self.security && self.security.postProcess) {
        xml = self.security.postProcess(xml, envelopeKey);
    }
    if (options && options.postProcess) {
        xml = options.postProcess(xml);
    }
    self.lastMessage = message;
    self.lastRequest = xml;
    self.lastEndpoint = location;
    /** @type {?} */
    const eid = options.exchangeId || uuid4();
    // self.emit('message', message, eid);
    // self.emit('request', xml, eid);
    /** @type {?} */
    const tryJSONparse = (/**
     * @param {?} body
     * @return {?}
     */
    function (body) {
        try {
            return JSON.parse(body);
        }
        catch (err) {
            return undefined;
        }
    });
    //console.log('url:', location)
    return ((/** @type {?} */ (self.httpClient))).post(location, xml, {
        headers: headers,
        responseType: 'text', observe: 'response'
    }).pipe(map((/**
     * @param {?} response
     * @return {?}
     */
    (response) => {
        self.lastResponse = response.body;
        self.lastResponseHeaders = response && response.headers;
        // self.lastElapsedTime = response && response.elapsedTime;
        // self.emit('response', response.body, response, eid);
        //console.log('responce body before sync', response.body);
        return parseSync(response.body, response);
    })));
    /**
     * @param {?} body
     * @param {?} response
     * @return {?}
     */
    function parseSync(body, response) {
        /** @type {?} */
        let obj;
        try {
            obj = self.wsdl.xmlToObject(body);
            //console.log('parsed body',obj);
        }
        catch (error) {
            //  When the output element cannot be looked up in the wsdl and the body is JSON
            //  instead of sending the error, we pass the body in the response.
            if (!output || !output.$lookupTypes) {
                // debug('Response element is not present. Unable to convert response xml to json.');
                //  If the response is JSON then return it as-is.
                /** @type {?} */
                const json = _.isObject(body) ? body : tryJSONparse(body);
                if (json) {
                    return { err: null, response, responseBody: json, header: undefined, xml };
                }
            }
            error.response = response;
            error.body = body;
            // self.emit('soapError', error, eid);
            throw error;
        }
        return finish(obj, body, response);
    }
    /**
     * @param {?} obj
     * @param {?} responseBody
     * @param {?} response
     * @return {?}
     */
    function finish(obj, responseBody, response) {
        /** @type {?} */
        let result = null;
        if (!output) {
            // one-way, no output expected
            return { err: null, response: null, responseBody, header: obj.Header, xml };
        }
        // If it's not HTML and Soap Body is empty
        if (!obj.html && !obj.Body) {
            return { err: null, obj, responseBody, header: obj.Header, xml };
        }
        if (typeof obj.Body !== 'object') {
            /** @type {?} */
            const error = new Error('Cannot parse response');
            error.response = response;
            error.body = responseBody;
            return { err: error, obj, responseBody, header: undefined, xml };
        }
        result = obj.Body[output.$name];
        // RPC/literal response body may contain elements with added suffixes I.E.
        // 'Response', or 'Output', or 'Out'
        // This doesn't necessarily equal the ouput message name. See WSDL 1.1 Section 2.4.5
        if (!result) {
            result = obj.Body[output.$name.replace(/(?:Out(?:put)?|Response)$/, '')];
        }
        if (!result) {
            ['Response', 'Out', 'Output'].forEach((/**
             * @param {?} term
             * @return {?}
             */
            function (term) {
                if (obj.Body.hasOwnProperty(name + term)) {
                    return result = obj.Body[name + term];
                }
            }));
        }
        return { err: null, result, responseBody, header: obj.Header, xml };
    }
});
Client.prototype.call = (/**
 * @param {?} method
 * @param {?} body
 * @param {?=} options
 * @param {?=} extraHeaders
 * @return {?}
 */
function (method, body, options, extraHeaders) {
    if (!this[method]) {
        return throwError(`Method ${method} not found`);
    }
    return ((/** @type {?} */ (this[method]))).call(this, body, options, extraHeaders);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXNvYXAvIiwic291cmNlcyI6WyJsaWIvc29hcC9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFNQSxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQzs7O0FBR2pDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDckMsT0FBTyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxLQUFLLE1BQU0sU0FBUyxDQUFDO0FBQzVCLE9BQU8sRUFBYyxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDOUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOztNQUUvQixrQkFBa0IsR0FBRyxjQUFjOztBQUV6QyxNQUFNLE9BQU8sTUFBTTs7Ozs7O0FBQUcsVUFBUyxJQUFJLEVBQUUsUUFBUSxFQUFFLE9BQU87SUFDcEQsa0NBQWtDO0lBQ2xDLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO0lBQ3hCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ2pCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxtQkFBQSxPQUFPLENBQUMsVUFBVSxFQUFjLENBQUM7O1VBQzdDLGNBQWMsR0FBUSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUU7SUFDL0MsSUFBSSxPQUFPLENBQUMscUJBQXFCLEVBQUU7UUFDakMsY0FBYyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUM7S0FDdkQ7SUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7QUFDdEMsQ0FBQyxDQUFBOztBQUdELE1BQU0sQ0FBQyxTQUFTLENBQUMs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LEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLE9BQU87Ozs7WUFBQyxVQUFVLElBQUk7Z0JBQ2xELElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFO29CQUN4QyxPQUFPLE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztpQkFDdkM7WUFDSCxDQUFDLEVBQUMsQ0FBQztTQUNKO1FBRUQsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUN0RSxDQUFDO0FBQ0gsQ0FBQyxDQUFBLENBQUM7QUFFRixNQUFNLENBQUMsU0FBUyxDQUFDLElBQUk7Ozs7Ozs7QUFBRyxVQUFVLE1BQWMsRUFBRSxJQUFTLEVBQUUsT0FBYSxFQUFFLFlBQWtCO0lBQzVGLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDakIsT0FBTyxVQUFVLENBQUMsVUFBVSxNQUFNLFlBQVksQ0FBQyxDQUFDO0tBQ2pEO0lBRUQsT0FBTyxDQUFDLG1CQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBQSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQzFFLENBQUMsQ0FBQSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxMSBWaW5heSBQdWxpbSA8dmluYXlAbWlsZXdpc2UuY29tPlxuICogTUlUIExpY2Vuc2VkXG4gKi9cblxuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cFJlc3BvbnNlIH3CoGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCAqIGFzIGFzc2VydCBmcm9tICdhc3NlcnQnO1xuLy8gaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gJ2V2ZW50cyc7XG4vLyBpbXBvcnQgKiBhcyB1dGlsIGZyb20gJ3V0aWwnO1xuaW1wb3J0IHsgZmluZFByZWZpeCB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHV1aWQ0IGZyb20gJ3V1aWQvdjQnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5jb25zdCBub25JZGVudGlmaWVyQ2hhcnMgPSAvW15hLXokXzAtOV0vaTtcblxuZXhwb3J0IGNvbnN0IENsaWVudCA9IGZ1bmN0aW9uKHdzZGwsIGVuZHBvaW50LCBvcHRpb25zKSB7XG4gIC8vIGV2ZW50cy5FdmVudEVtaXR0ZXIuY2FsbCh0aGlzKTtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHRoaXMud3NkbCA9IHdzZGw7XG4gIHRoaXMuX2luaXRpYWxpemVPcHRpb25zKG9wdGlvbnMpO1xuICB0aGlzLl9pbml0aWFsaXplU2VydmljZXMoZW5kcG9pbnQpO1xuICB0aGlzLmh0dHBDbGllbnQgPSBvcHRpb25zLmh0dHBDbGllbnQgYXMgSHR0cENsaWVudDtcbiAgY29uc3QgcHJvbWlzZU9wdGlvbnM6IGFueSA9IHsgbXVsdGlBcmdzOiB0cnVlIH07XG4gIGlmIChvcHRpb25zLm92ZXJyaWRlUHJvbWlzZVN1ZmZpeCkge1xuICAgIHByb21pc2VPcHRpb25zLnN1ZmZpeCA9IG9wdGlvbnMub3ZlcnJpZGVQcm9taXNlU3VmZml4O1xuICB9XG4gIFByb21pc2UuYWxsKFt0aGlzLCBwcm9taXNlT3B0aW9uc10pO1xufTtcbi8vIHV0aWwuaW5oZXJpdHMoQ2xpZW50LCBldmVudHMuRXZlbnRFbWl0dGVyKTtcblxuQ2xpZW50LnByb3RvdHlwZS5hZGRTb2FwSGVhZGVyID0gZnVuY3Rpb24oc29hcEhlYWRlciwgbmFtZSwgbmFtZXNwYWNlLCB4bWxucykge1xuICBpZiAoIXRoaXMuc29hcEhlYWRlcnMpIHtcbiAgICB0aGlzLnNvYXBIZWFkZXJzID0gW107XG4gIH1cbiAgaWYgKHR5cGVvZiBzb2FwSGVhZGVyID09PSAnb2JqZWN0Jykge1xuICAgIHNvYXBIZWFkZXIgPSB0aGlzLndzZGwub2JqZWN0VG9YTUwoc29hcEhlYWRlciwgbmFtZSwgbmFtZXNwYWNlLCB4bWxucywgdHJ1ZSk7XG4gIH1cbiAgcmV0dXJuIHRoaXMuc29hcEhlYWRlcnMucHVzaChzb2FwSGVhZGVyKSAtIDE7XG59O1xuXG5DbGllbnQucHJvdG90eXBlLmNoYW5nZVNvYXBIZWFkZXIgPSBmdW5jdGlvbihpbmRleCwgc29hcEhlYWRlciwgbmFtZSwgbmFtZXNwYWNlLCB4bWxucykge1xuICBpZiAoIXRoaXMuc29hcEhlYWRlcnMpIHtcbiAgICB0aGlzLnNvYXBIZWFkZXJzID0gW107XG4gIH1cbiAgaWYgKHR5cGVvZiBzb2FwSGVhZGVyID09PSAnb2JqZWN0Jykge1xuICAgIHNvYXBIZWFkZXIgPSB0aGlzLndzZGwub2JqZWN0VG9YTUwoc29hcEhlYWRlciwgbmFtZSwgbmFtZXNwYWNlLCB4bWxucywgdHJ1ZSk7XG4gIH1cbiAgdGhpcy5zb2FwSGVhZGVyc1tpbmRleF0gPSBzb2FwSGVhZGVyO1xufTtcblxuQ2xpZW50LnByb3RvdHlwZS5nZXRTb2FwSGVhZGVycyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5zb2FwSGVhZGVycztcbn07XG5cbkNsaWVudC5wcm90b3R5cGUuY2xlYXJTb2FwSGVhZGVycyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnNvYXBIZWFkZXJzID0gbnVsbDtcbn07XG5cbkNsaWVudC5wcm90b3R5cGUuYWRkSHR0cEhlYWRlciA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIGlmICghdGhpcy5odHRwSGVhZGVycykge1xuICAgIHRoaXMuaHR0cEhlYWRlcnMgPSB7fTtcbiAgfVxuICB0aGlzLmh0dHBIZWFkZXJzW25hbWVdID0gdmFsdWU7XG59O1xuXG5DbGllbnQucHJvdG90eXBlLmdldEh0dHBIZWFkZXJzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmh0dHBIZWFkZXJzO1xufTtcblxuQ2xpZW50LnByb3RvdHlwZS5jbGVhckh0dHBIZWFkZXJzID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuaHR0cEhlYWRlcnMgPSB7fTtcbn07XG5cblxuQ2xpZW50LnByb3RvdHlwZS5hZGRCb2R5QXR0cmlidXRlID0gZnVuY3Rpb24oYm9keUF0dHJpYnV0ZSwgbmFtZSwgbmFtZXNwYWNlLCB4bWxucykge1xuICBpZiAoIXRoaXMuYm9keUF0dHJpYnV0ZXMpIHtcbiAgICB0aGlzLmJvZHlBdHRyaWJ1dGVzID0gW107XG4gIH1cbiAgaWYgKHR5cGVvZiBib2R5QXR0cmlidXRlID09PSAnb2JqZWN0Jykge1xuICAgIGxldCBjb21wb3NpdGlvbiA9ICcnO1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGJvZHlBdHRyaWJ1dGUpLmZvckVhY2goZnVuY3Rpb24ocHJvcCwgaWR4LCBhcnJheSkge1xuICAgICAgY29tcG9zaXRpb24gKz0gJyAnICsgcHJvcCArICc9XCInICsgYm9keUF0dHJpYnV0ZVtwcm9wXSArICdcIic7XG4gICAgfSk7XG4gICAgYm9keUF0dHJpYnV0ZSA9IGNvbXBvc2l0aW9uO1xuICB9XG4gIGlmIChib2R5QXR0cmlidXRlLnN1YnN0cigwLCAxKSAhPT0gJyAnKSBib2R5QXR0cmlidXRlID0gJyAnICsgYm9keUF0dHJpYnV0ZTtcbiAgdGhpcy5ib2R5QXR0cmlidXRlcy5wdXNoKGJvZHlBdHRyaWJ1dGUpO1xufTtcblxuQ2xpZW50LnByb3RvdHlwZS5nZXRCb2R5QXR0cmlidXRlcyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5ib2R5QXR0cmlidXRlcztcbn07XG5cbkNsaWVudC5wcm90b3R5cGUuY2xlYXJCb2R5QXR0cmlidXRlcyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmJvZHlBdHRyaWJ1dGVzID0gbnVsbDtcbn07XG5cbkNsaWVudC5wcm90b3R5cGUuc2V0RW5kcG9pbnQgPSBmdW5jdGlvbihlbmRwb2ludCkge1xuICB0aGlzLmVuZHBvaW50ID0gZW5kcG9pbnQ7XG4gIHRoaXMuX2luaXRpYWxpemVTZXJ2aWNlcyhlbmRwb2ludCk7XG59O1xuXG5DbGllbnQucHJvdG90eXBlLmRlc2NyaWJlID0gZnVuY3Rpb24oKSB7XG4gIGNvbnN0IHR5cGVzID0gdGhpcy53c2RsLmRlZmluaXRpb25zLnR5cGVzO1xuICByZXR1cm4gdGhpcy53c2RsLmRlc2NyaWJlU2VydmljZXMoKTtcbn07XG5cbkNsaWVudC5wcm90b3R5cGUuc2V0U2VjdXJpdHkgPSBmdW5jdGlvbihzZWN1cml0eSkge1xuICB0aGlzLnNlY3VyaXR5ID0gc2VjdXJpdHk7XG59O1xuXG5DbGllbnQucHJvdG90eXBlLnNldFNPQVBBY3Rpb24gPSBmdW5jdGlvbihTT0FQQWN0aW9uKSB7XG4gIHRoaXMuU09BUEFjdGlvbiA9IFNPQVBBY3Rpb247XG59O1xuXG5DbGllbnQucHJvdG90eXBlLl9pbml0aWFsaXplU2VydmljZXMgPSBmdW5jdGlvbihlbmRwb2ludCkge1xuICBjb25zdCBkZWZpbml0aW9ucyA9IHRoaXMud3NkbC5kZWZpbml0aW9ucyxcbiAgICBzZXJ2aWNlcyA9IGRlZmluaXRpb25zLnNlcnZpY2VzO1xuICBmb3IgKGNvbnN0IG5hbWUgaW4gc2VydmljZXMpIHtcbiAgICB0aGlzW25hbWVdID0gdGhpcy5fZGVmaW5lU2VydmljZShzZXJ2aWNlc1tuYW1lXSwgZW5kcG9pbnQpO1xuICB9XG59O1xuXG5DbGllbnQucHJvdG90eXBlLl9pbml0aWFsaXplT3B0aW9ucyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgdGhpcy5zdHJlYW1BbGxvd2VkID0gb3B0aW9ucy5zdHJlYW07XG4gIHRoaXMubm9ybWFsaXplTmFtZXMgPSBvcHRpb25zLm5vcm1hbGl6ZU5hbWVzO1xuICB0aGlzLndzZGwub3B0aW9ucy5hdHRyaWJ1dGVzS2V5ID0gb3B0aW9ucy5hdHRyaWJ1dGVzS2V5IHx8ICdhdHRyaWJ1dGVzJztcbiAgdGhpcy53c2RsLm9wdGlvbnMuZW52ZWxvcGVLZXkgPSBvcHRpb25zLmVudmVsb3BlS2V5IHx8ICdzb2FwJztcbiAgdGhpcy53c2RsLm9wdGlvbnMucHJlc2VydmVXaGl0ZXNwYWNlID0gISFvcHRpb25zLnByZXNlcnZlV2hpdGVzcGFjZTtcbiAgaWYob3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWYob3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcy5vdmVycmlkZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZihvcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzLm92ZXJyaWRlID09PSB0cnVlKSB7XG4gICAgICAgIGlmKG9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMubmFtZXNwYWNlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhpcy53c2RsLm9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMgPSBvcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzLm5hbWVzcGFjZXM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYob3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLndzZGwub3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50ID0gb3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50O1xuICB9XG4gIHRoaXMud3NkbC5vcHRpb25zLmZvcmNlU29hcDEySGVhZGVycyA9ICEhb3B0aW9ucy5mb3JjZVNvYXAxMkhlYWRlcnM7XG59O1xuXG5DbGllbnQucHJvdG90eXBlLl9kZWZpbmVTZXJ2aWNlID0gZnVuY3Rpb24oc2VydmljZSwgZW5kcG9pbnQpIHtcbiAgY29uc3QgcG9ydHMgPSBzZXJ2aWNlLnBvcnRzLFxuICAgIGRlZiA9IHt9O1xuICBmb3IgKGNvbnN0IG5hbWUgaW4gcG9ydHMpIHtcbiAgICBkZWZbbmFtZV0gPSB0aGlzLl9kZWZpbmVQb3J0KHBvcnRzW25hbWVdLCBlbmRwb2ludCA/IGVuZHBvaW50IDogcG9ydHNbbmFtZV0ubG9jYXRpb24pO1xuICB9XG4gIHJldHVybiBkZWY7XG59O1xuXG5DbGllbnQucHJvdG90eXBlLl9kZWZpbmVQb3J0ID0gZnVuY3Rpb24ocG9ydCwgZW5kcG9pbnQpIHtcbiAgY29uc3QgbG9jYXRpb24gPSBlbmRwb2ludCxcbiAgICBiaW5kaW5nID0gcG9ydC5iaW5kaW5nLFxuICAgIG1ldGhvZHMgPSBiaW5kaW5nLm1ldGhvZHMsXG4gICAgZGVmID0ge307XG4gIGZvciAoY29uc3QgbmFtZSBpbiBtZXRob2RzKSB7XG4gICAgZGVmW25hbWVdID0gdGhpcy5fZGVmaW5lTWV0aG9kKG1ldGhvZHNbbmFtZV0sIGxvY2F0aW9uKTtcbiAgICBjb25zdCBtZXRob2ROYW1lID0gdGhpcy5ub3JtYWxpemVOYW1lcyA/IG5hbWUucmVwbGFjZShub25JZGVudGlmaWVyQ2hhcnMsICdfJykgOiBuYW1lO1xuICAgIHRoaXNbbWV0aG9kTmFtZV0gPSBkZWZbbmFtZV07XG4gIH1cbiAgcmV0dXJuIGRlZjtcbn07XG5cbkNsaWVudC5wcm90b3R5cGUuX2RlZmluZU1ldGhvZCA9IGZ1bmN0aW9uKG1ldGhvZCwgbG9jYXRpb24pIHtcbiAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gIGxldCB0ZW1wID0gbnVsbDtcbiAgcmV0dXJuIGZ1bmN0aW9uKGFyZ3MsIG9wdGlvbnMsIGV4dHJhSGVhZGVycyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHNlbGYuX2ludm9rZShtZXRob2QsIGFyZ3MsIGxvY2F0aW9uLCBvcHRpb25zLCBleHRyYUhlYWRlcnMpO1xuICB9O1xufTtcblxuQ2xpZW50LnByb3RvdHlwZS5faW52b2tlID0gZnVuY3Rpb24obWV0aG9kLCBhcmdzLCBsb2NhdGlvbiwgb3B0aW9ucywgZXh0cmFIZWFkZXJzKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgbGV0IHNlbGYgPSB0aGlzLFxuICAgIG5hbWUgPSBtZXRob2QuJG5hbWUsXG4gICAgaW5wdXQgPSBtZXRob2QuaW5wdXQsXG4gICAgb3V0cHV0ID0gbWV0aG9kLm91dHB1dCxcbiAgICBzdHlsZSA9IG1ldGhvZC5zdHlsZSxcbiAgICBkZWZzID0gdGhpcy53c2RsLmRlZmluaXRpb25zLFxuICAgIGVudmVsb3BlS2V5ID0gdGhpcy53c2RsLm9wdGlvbnMuZW52ZWxvcGVLZXksXG4gICAgbnMgPSBkZWZzLiR0YXJnZXROYW1lc3BhY2UsXG4gICAgZW5jb2RpbmcgPSAnJyxcbiAgICBtZXNzYWdlID0gJycsXG4gICAgeG1sID0gbnVsbCxcbiAgICByZXEgPSBudWxsLFxuICAgIHNvYXBBY3Rpb24gPSBudWxsLFxuICAgIGFsaWFzID0gZmluZFByZWZpeChkZWZzLnhtbG5zLCBucyksXG4gICAgaGVhZGVyczogYW55ID0ge1xuICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJ0ZXh0L3htbDsgY2hhcnNldD11dGYtOFwiXG4gICAgfSxcbiAgICB4bWxuc1NvYXAgPSBcInhtbG5zOlwiICsgZW52ZWxvcGVLZXkgKyBcIj1cXFwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbnZlbG9wZS9cXFwiXCI7XG5cbiAgaWYgKHRoaXMud3NkbC5vcHRpb25zLmZvcmNlU29hcDEySGVhZGVycykge1xuICAgIGhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl0gPSBcImFwcGxpY2F0aW9uL3NvYXAreG1sOyBjaGFyc2V0PXV0Zi04XCI7XG4gICAgeG1sbnNTb2FwID0gXCJ4bWxuczpcIiArIGVudmVsb3BlS2V5ICsgXCI9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDMvMDUvc29hcC1lbnZlbG9wZVxcXCJcIjtcbiAgfVxuXG4gIGlmICh0aGlzLlNPQVBBY3Rpb24pIHtcbiAgICBzb2FwQWN0aW9uID0gdGhpcy5TT0FQQWN0aW9uO1xuICB9IGVsc2UgaWYgKG1ldGhvZC5zb2FwQWN0aW9uICE9PSB1bmRlZmluZWQgJiYgbWV0aG9kLnNvYXBBY3Rpb24gIT09IG51bGwpIHtcbiAgICBzb2FwQWN0aW9uID0gbWV0aG9kLnNvYXBBY3Rpb247XG4gIH0gZWxzZSB7XG4gICAgc29hcEFjdGlvbiA9ICgobnMubGFzdEluZGV4T2YoXCIvXCIpICE9PSBucy5sZW5ndGggLSAxKSA/IG5zICsgXCIvXCIgOiBucykgKyBuYW1lO1xuICB9XG5cbiAgaWYgKCF0aGlzLndzZGwub3B0aW9ucy5mb3JjZVNvYXAxMkhlYWRlcnMpIHtcbiAgICBoZWFkZXJzLlNPQVBBY3Rpb24gPSAnXCInICsgc29hcEFjdGlvbiArICdcIic7XG4gIH1cblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAvL0FkZCBleHRyYSBoZWFkZXJzXG4gIGZvciAoY29uc3QgaGVhZGVyIGluIHRoaXMuaHR0cEhlYWRlcnMgKSB7IGhlYWRlcnNbaGVhZGVyXSA9IHRoaXMuaHR0cEhlYWRlcnNbaGVhZGVyXTsgIH1cbiAgZm9yIChjb25zdCBhdHRyIGluIGV4dHJhSGVhZGVycykgeyBoZWFkZXJzW2F0dHJdID0gZXh0cmFIZWFkZXJzW2F0dHJdOyB9XG5cbiAgLy8gQWxsb3cgdGhlIHNlY3VyaXR5IG9iamVjdCB0byBhZGQgaGVhZGVyc1xuICBpZiAoc2VsZi5zZWN1cml0eSAmJiBzZWxmLnNlY3VyaXR5LmFkZEhlYWRlcnMpXG4gICAgc2VsZi5zZWN1cml0eS5hZGRIZWFkZXJzKGhlYWRlcnMpO1xuICBpZiAoc2VsZi5zZWN1cml0eSAmJiBzZWxmLnNlY3VyaXR5LmFkZE9wdGlvbnMpXG4gICAgc2VsZi5zZWN1cml0eS5hZGRPcHRpb25zKG9wdGlvbnMpO1xuXG4gIGlmICgoc3R5bGUgPT09ICdycGMnKSYmICggKCBpbnB1dC5wYXJ0cyB8fCBpbnB1dC5uYW1lPT09XCJlbGVtZW50XCIgKSB8fCBhcmdzID09PSBudWxsKSApIHtcbiAgICBhc3NlcnQub2soIXN0eWxlIHx8IHN0eWxlID09PSAncnBjJywgJ2ludmFsaWQgbWVzc2FnZSBkZWZpbml0aW9uIGZvciBkb2N1bWVudCBzdHlsZSBiaW5kaW5nJyk7XG4gICAgbWVzc2FnZSA9IHNlbGYud3NkbC5vYmplY3RUb1JwY1hNTChuYW1lLCBhcmdzLCBhbGlhcywgbnMsKGlucHV0Lm5hbWUhPT1cImVsZW1lbnRcIiApKTtcbiAgICAobWV0aG9kLmlucHV0U29hcCA9PT0gJ2VuY29kZWQnKSAmJiAoZW5jb2RpbmcgPSAnc29hcDplbmNvZGluZ1N0eWxlPVwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbmNvZGluZy9cIiAnKTtcbiAgfSBlbHNlIHtcbiAgICBhc3NlcnQub2soIXN0eWxlIHx8IHN0eWxlID09PSAnZG9jdW1lbnQnLCAnaW52YWxpZCBtZXNzYWdlIGRlZmluaXRpb24gZm9yIHJwYyBzdHlsZSBiaW5kaW5nJyk7XG4gICAgLy8gcGFzcyBgaW5wdXQuJGxvb2t1cFR5cGVgIGlmIGBpbnB1dC4kdHlwZWAgY291bGQgbm90IGJlIGZvdW5kXG4gICAgbWVzc2FnZSA9IHNlbGYud3NkbC5vYmplY3RUb0RvY3VtZW50WE1MKGlucHV0LiRuYW1lLCBhcmdzLCBpbnB1dC50YXJnZXROU0FsaWFzLCBpbnB1dC50YXJnZXROYW1lc3BhY2UsIChpbnB1dC4kdHlwZSB8fCBpbnB1dC4kbG9va3VwVHlwZSkpO1xuICB9XG4gIHhtbCA9IFwiPD94bWwgdmVyc2lvbj1cXFwiMS4wXFxcIiBlbmNvZGluZz1cXFwidXRmLThcXFwiPz5cIiArXG4gICAgXCI8XCIgKyBlbnZlbG9wZUtleSArIFwiOkVudmVsb3BlIFwiICtcbiAgICB4bWxuc1NvYXAgKyBcIiBcIiArXG4gICAgXCJ4bWxuczp4c2k9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlXFxcIiBcIiArXG4gICAgZW5jb2RpbmcgK1xuICAgIHRoaXMud3NkbC54bWxuc0luRW52ZWxvcGUgKyAnPicgK1xuICAgICgoc2VsZi5zb2FwSGVhZGVycyB8fCBzZWxmLnNlY3VyaXR5KSA/XG4gICAgICAoXG4gICAgICAgIFwiPFwiICsgZW52ZWxvcGVLZXkgKyBcIjpIZWFkZXI+XCIgK1xuICAgICAgICAoc2VsZi5zb2FwSGVhZGVycyA/IHNlbGYuc29hcEhlYWRlcnMuam9pbihcIlxcblwiKSA6IFwiXCIpICtcbiAgICAgICAgKHNlbGYuc2VjdXJpdHkgJiYgIXNlbGYuc2VjdXJpdHkucG9zdFByb2Nlc3MgPyBzZWxmLnNlY3VyaXR5LnRvWE1MKCkgOiBcIlwiKSArXG4gICAgICAgIFwiPC9cIiArIGVudmVsb3BlS2V5ICsgXCI6SGVhZGVyPlwiXG4gICAgICApXG4gICAgICA6XG4gICAgICAgICcnXG4gICAgICApICtcbiAgICBcIjxcIiArIGVudmVsb3BlS2V5ICsgXCI6Qm9keVwiICtcbiAgICAoc2VsZi5ib2R5QXR0cmlidXRlcyA/IHNlbGYuYm9keUF0dHJpYnV0ZXMuam9pbignICcpIDogJycpICtcbiAgICAoc2VsZi5zZWN1cml0eSAmJiBzZWxmLnNlY3VyaXR5LnBvc3RQcm9jZXNzID8gJyBJZD1cIl8wXCInIDogJycpICtcbiAgICBcIj5cIiArXG4gICAgbWVzc2FnZSArXG4gICAgXCI8L1wiICsgZW52ZWxvcGVLZXkgKyBcIjpCb2R5PlwiICtcbiAgICBcIjwvXCIgKyBlbnZlbG9wZUtleSArIFwiOkVudmVsb3BlPlwiO1xuXG4gIGlmKHNlbGYuc2VjdXJpdHkgJiYgc2VsZi5zZWN1cml0eS5wb3N0UHJvY2Vzcyl7XG4gICAgeG1sID0gc2VsZi5zZWN1cml0eS5wb3N0UHJvY2Vzcyh4bWwsIGVudmVsb3BlS2V5KTtcbiAgfVxuXG4gIGlmKG9wdGlvbnMgJiYgb3B0aW9ucy5wb3N0UHJvY2Vzcyl7XG4gICAgeG1sID0gb3B0aW9ucy5wb3N0UHJvY2Vzcyh4bWwpO1xuICB9XG5cbiAgc2VsZi5sYXN0TWVzc2FnZSA9IG1lc3NhZ2U7XG4gIHNlbGYubGFzdFJlcXVlc3QgPSB4bWw7XG4gIHNlbGYubGFzdEVuZHBvaW50ID0gbG9jYXRpb247XG5cbiAgY29uc3QgZWlkID0gb3B0aW9ucy5leGNoYW5nZUlkIHx8IHV1aWQ0KCk7XG5cbiAgLy8gc2VsZi5lbWl0KCdtZXNzYWdlJywgbWVzc2FnZSwgZWlkKTtcbiAgLy8gc2VsZi5lbWl0KCdyZXF1ZXN0JywgeG1sLCBlaWQpO1xuXG4gIGNvbnN0IHRyeUpTT05wYXJzZSA9IGZ1bmN0aW9uKGJvZHkpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoYm9keSk7XG4gICAgfVxuICAgIGNhdGNoKGVycikge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH07XG5cbiAgLy9jb25zb2xlLmxvZygndXJsOicsIGxvY2F0aW9uKVxuICBcbiAgcmV0dXJuICg8SHR0cENsaWVudD5zZWxmLmh0dHBDbGllbnQpLnBvc3QobG9jYXRpb24sIHhtbCwge1xuICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgcmVzcG9uc2VUeXBlOiAndGV4dCcsIG9ic2VydmU6ICdyZXNwb25zZScgfSkucGlwZShcbiAgICBtYXAoKHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8YW55PikgPT4ge1xuICAgICAgc2VsZi5sYXN0UmVzcG9uc2UgPSByZXNwb25zZS5ib2R5O1xuICAgICAgc2VsZi5sYXN0UmVzcG9uc2VIZWFkZXJzID0gcmVzcG9uc2UgJiYgcmVzcG9uc2UuaGVhZGVycztcbiAgICAgIC8vIHNlbGYubGFzdEVsYXBzZWRUaW1lID0gcmVzcG9uc2UgJiYgcmVzcG9uc2UuZWxhcHNlZFRpbWU7XG4gICAgICAvLyBzZWxmLmVtaXQoJ3Jlc3BvbnNlJywgcmVzcG9uc2UuYm9keSwgcmVzcG9uc2UsIGVpZCk7XG4gICAgICAvL2NvbnNvbGUubG9nKCdyZXNwb25jZSBib2R5IGJlZm9yZSBzeW5jJywgcmVzcG9uc2UuYm9keSk7XG4gICAgICByZXR1cm4gcGFyc2VTeW5jKHJlc3BvbnNlLmJvZHksIHJlc3BvbnNlKVxuICAgIH0pXG4gICk7XG5cbiAgZnVuY3Rpb24gcGFyc2VTeW5jKGJvZHksIHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8YW55Pikge1xuICAgIGxldCBvYmo7XG4gICAgdHJ5IHtcbiAgICAgIG9iaiA9IHNlbGYud3NkbC54bWxUb09iamVjdChib2R5KTtcbiAgICAgIC8vY29uc29sZS5sb2coJ3BhcnNlZCBib2R5JyxvYmopO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyAgV2hlbiB0aGUgb3V0cHV0IGVsZW1lbnQgY2Fubm90IGJlIGxvb2tlZCB1cCBpbiB0aGUgd3NkbCBhbmQgdGhlIGJvZHkgaXMgSlNPTlxuICAgICAgLy8gIGluc3RlYWQgb2Ygc2VuZGluZyB0aGUgZXJyb3IsIHdlIHBhc3MgdGhlIGJvZHkgaW4gdGhlIHJlc3BvbnNlLlxuICAgICAgaWYoIW91dHB1dCB8fCAhb3V0cHV0LiRsb29rdXBUeXBlcykge1xuICAgICAgICAvLyBkZWJ1ZygnUmVzcG9uc2UgZWxlbWVudCBpcyBub3QgcHJlc2VudC4gVW5hYmxlIHRvIGNvbnZlcnQgcmVzcG9uc2UgeG1sIHRvIGpzb24uJyk7XG4gICAgICAgIC8vICBJZiB0aGUgcmVzcG9uc2UgaXMgSlNPTiB0aGVuIHJldHVybiBpdCBhcy1pcy5cbiAgICAgICAgY29uc3QganNvbiA9IF8uaXNPYmplY3QoYm9keSkgPyBib2R5IDogdHJ5SlNPTnBhcnNlKGJvZHkpO1xuICAgICAgICBpZiAoanNvbikge1xuICAgICAgICAgIHJldHVybiB7IGVycjogbnVsbCwgcmVzcG9uc2UsIHJlc3BvbnNlQm9keToganNvbiwgaGVhZGVyOiB1bmRlZmluZWQsIHhtbCB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICAgICAgZXJyb3IuYm9keSA9IGJvZHk7XG4gICAgICAvLyBzZWxmLmVtaXQoJ3NvYXBFcnJvcicsIGVycm9yLCBlaWQpO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICAgIHJldHVybiBmaW5pc2gob2JqLCBib2R5LCByZXNwb25zZSk7XG4gIH1cblxuICBmdW5jdGlvbiBmaW5pc2gob2JqLCByZXNwb25zZUJvZHksIHJlc3BvbnNlKSB7XG4gICAgbGV0IHJlc3VsdCA9IG51bGw7XG5cbiAgICBpZiAoIW91dHB1dCl7XG4gICAgICAvLyBvbmUtd2F5LCBubyBvdXRwdXQgZXhwZWN0ZWRcbiAgICAgIHJldHVybiB7IGVycjogbnVsbCwgcmVzcG9uc2U6IG51bGwsIHJlc3BvbnNlQm9keSwgaGVhZGVyOiBvYmouSGVhZGVyLCB4bWwgfTtcbiAgICB9XG5cbiAgICAvLyBJZiBpdCdzIG5vdCBIVE1MIGFuZCBTb2FwIEJvZHkgaXMgZW1wdHlcbiAgICBpZiAoIW9iai5odG1sICYmICFvYmouQm9keSkge1xuICAgICAgcmV0dXJuICB7IGVycjogbnVsbCwgb2JqLCByZXNwb25zZUJvZHksIGhlYWRlcjogb2JqLkhlYWRlciwgeG1sIH07IFxuICAgIH1cblxuICAgIGlmKCB0eXBlb2Ygb2JqLkJvZHkgIT09ICdvYmplY3QnICkge1xuICAgICAgY29uc3QgZXJyb3I6IGFueSA9IG5ldyBFcnJvcignQ2Fubm90IHBhcnNlIHJlc3BvbnNlJyk7XG4gICAgICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICAgICAgZXJyb3IuYm9keSA9IHJlc3BvbnNlQm9keTtcbiAgICAgIHJldHVybiB7IGVycjogZXJyb3IsIG9iaiwgcmVzcG9uc2VCb2R5LCBoZWFkZXI6IHVuZGVmaW5lZCwgeG1sIH07IFxuICAgIH1cblxuICAgIHJlc3VsdCA9IG9iai5Cb2R5W291dHB1dC4kbmFtZV07XG4gICAgLy8gUlBDL2xpdGVyYWwgcmVzcG9uc2UgYm9keSBtYXkgY29udGFpbiBlbGVtZW50cyB3aXRoIGFkZGVkIHN1ZmZpeGVzIEkuRS5cbiAgICAvLyAnUmVzcG9uc2UnLCBvciAnT3V0cHV0Jywgb3IgJ091dCdcbiAgICAvLyBUaGlzIGRvZXNuJ3QgbmVjZXNzYXJpbHkgZXF1YWwgdGhlIG91cHV0IG1lc3NhZ2UgbmFtZS4gU2VlIFdTREwgMS4xIFNlY3Rpb24gMi40LjVcbiAgICBpZighcmVzdWx0KXtcbiAgICAgIHJlc3VsdCA9IG9iai5Cb2R5W291dHB1dC4kbmFtZS5yZXBsYWNlKC8oPzpPdXQoPzpwdXQpP3xSZXNwb25zZSkkLywgJycpXTtcbiAgICB9XG4gICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgIFsnUmVzcG9uc2UnLCAnT3V0JywgJ091dHB1dCddLmZvckVhY2goZnVuY3Rpb24gKHRlcm0pIHtcbiAgICAgICAgaWYgKG9iai5Cb2R5Lmhhc093blByb3BlcnR5KG5hbWUgKyB0ZXJtKSkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQgPSBvYmouQm9keVtuYW1lICsgdGVybV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4geyBlcnI6IG51bGwsIHJlc3VsdCwgcmVzcG9uc2VCb2R5LCBoZWFkZXI6IG9iai5IZWFkZXIsIHhtbCB9OyBcbiAgfVxufTtcblxuQ2xpZW50LnByb3RvdHlwZS5jYWxsID0gZnVuY3Rpb24gKG1ldGhvZDogc3RyaW5nLCBib2R5OiBhbnksIG9wdGlvbnM/OiBhbnksIGV4dHJhSGVhZGVycz86IGFueSk6IE9ic2VydmFibGU8YW55PiB7XG4gIGlmICghdGhpc1ttZXRob2RdKSB7XG4gICAgcmV0dXJuIHRocm93RXJyb3IoYE1ldGhvZCAke21ldGhvZH0gbm90IGZvdW5kYCk7XG4gIH1cblxuICByZXR1cm4gKDxGdW5jdGlvbj50aGlzW21ldGhvZF0pLmNhbGwodGhpcywgYm9keSwgb3B0aW9ucywgZXh0cmFIZWFkZXJzKTtcbn1cbiJdfQ==