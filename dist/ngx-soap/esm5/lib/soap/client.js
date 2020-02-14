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
var nonIdentifierChars = /[^a-z$_0-9]/i;
/** @type {?} */
export var Client = (/**
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
    var promiseOptions = { multiArgs: true };
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
        var composition_1 = '';
        Object.getOwnPropertyNames(bodyAttribute).forEach((/**
         * @param {?} prop
         * @param {?} idx
         * @param {?} array
         * @return {?}
         */
        function (prop, idx, array) {
            composition_1 += ' ' + prop + '="' + bodyAttribute[prop] + '"';
        }));
        bodyAttribute = composition_1;
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
    var types = this.wsdl.definitions.types;
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
    var definitions = this.wsdl.definitions;
    /** @type {?} */
    var services = definitions.services;
    for (var name_1 in services) {
        this[name_1] = this._defineService(services[name_1], endpoint);
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
    var ports = service.ports;
    /** @type {?} */
    var def = {};
    for (var name_2 in ports) {
        def[name_2] = this._definePort(ports[name_2], endpoint ? endpoint : ports[name_2].location);
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
    var location = endpoint;
    /** @type {?} */
    var binding = port.binding;
    /** @type {?} */
    var methods = binding.methods;
    /** @type {?} */
    var def = {};
    for (var name_3 in methods) {
        def[name_3] = this._defineMethod(methods[name_3], location);
        /** @type {?} */
        var methodName = this.normalizeNames ? name_3.replace(nonIdentifierChars, '_') : name_3;
        this[methodName] = def[name_3];
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
    var self = this;
    /** @type {?} */
    var temp = null;
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
    var self = this;
    /** @type {?} */
    var name = method.$name;
    /** @type {?} */
    var input = method.input;
    /** @type {?} */
    var output = method.output;
    /** @type {?} */
    var style = method.style;
    /** @type {?} */
    var defs = this.wsdl.definitions;
    /** @type {?} */
    var envelopeKey = this.wsdl.options.envelopeKey;
    /** @type {?} */
    var ns = defs.$targetNamespace;
    /** @type {?} */
    var encoding = '';
    /** @type {?} */
    var message = '';
    /** @type {?} */
    var xml = null;
    /** @type {?} */
    var req = null;
    /** @type {?} */
    var soapAction = null;
    /** @type {?} */
    var alias = findPrefix(defs.xmlns, ns);
    /** @type {?} */
    var headers = {
        "Content-Type": "text/xml; charset=utf-8"
    };
    /** @type {?} */
    var xmlnsSoap = "xmlns:" + envelopeKey + "=\"http://schemas.xmlsoap.org/soap/envelope/\"";
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
    for (var header in this.httpHeaders) {
        headers[header] = this.httpHeaders[header];
    }
    for (var attr in extraHeaders) {
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
    var eid = options.exchangeId || uuid4();
    // self.emit('message', message, eid);
    // self.emit('request', xml, eid);
    /** @type {?} */
    var tryJSONparse = (/**
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
    function (response) {
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
        var obj;
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
                var json = _.isObject(body) ? body : tryJSONparse(body);
                if (json) {
                    return { err: null, response: response, responseBody: json, header: undefined, xml: xml };
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
        var result = null;
        if (!output) {
            // one-way, no output expected
            return { err: null, response: null, responseBody: responseBody, header: obj.Header, xml: xml };
        }
        // If it's not HTML and Soap Body is empty
        if (!obj.html && !obj.Body) {
            return { err: null, obj: obj, responseBody: responseBody, header: obj.Header, xml: xml };
        }
        if (typeof obj.Body !== 'object') {
            /** @type {?} */
            var error = new Error('Cannot parse response');
            error.response = response;
            error.body = responseBody;
            return { err: error, obj: obj, responseBody: responseBody, header: undefined, xml: xml };
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
        return { err: null, result: result, responseBody: responseBody, header: obj.Header, xml: xml };
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
        return throwError("Method " + method + " not found");
    }
    return ((/** @type {?} */ (this[method]))).call(this, body, options, extraHeaders);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXNvYXAvIiwic291cmNlcyI6WyJsaWIvc29hcC9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFNQSxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQzs7O0FBR2pDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDckMsT0FBTyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxLQUFLLE1BQU0sU0FBUyxDQUFDO0FBQzVCLE9BQU8sRUFBYyxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDOUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOztJQUUvQixrQkFBa0IsR0FBRyxjQUFjOztBQUV6QyxNQUFNLEtBQU8sTUFBTTs7Ozs7O0FBQUcsVUFBUyxJQUFJLEVBQUUsUUFBUSxFQUFFLE9BQU87SUFDcEQsa0NBQWtDO0lBQ2xDLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO0lBQ3hCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ2pCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxtQkFBQSxPQUFPLENBQUMsVUFBVSxFQUFjLENBQUM7O1FBQzdDLGNBQWMsR0FBUSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUU7SUFDL0MsSUFBSSxPQUFPLENBQUMscUJBQXFCLEVBQUU7UUFDakMsY0FBYyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUM7S0FDdkQ7SUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7QUFDdEMsQ0FBQyxDQUFBOztBQUdELE1BQU0sQ0FBQyxTQUFTLENBQUMs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O1FBQ0QsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLENBQUMsVUFBVSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxPQUFPOzs7O1lBQUMsVUFBVSxJQUFJO2dCQUNsRCxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRTtvQkFDeEMsT0FBTyxNQUFNLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7aUJBQ3ZDO1lBQ0gsQ0FBQyxFQUFDLENBQUM7U0FDSjtRQUVELE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sUUFBQSxFQUFFLFlBQVksY0FBQSxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsS0FBQSxFQUFFLENBQUM7SUFDdEUsQ0FBQztBQUNILENBQUMsQ0FBQSxDQUFDO0FBRUYsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJOzs7Ozs7O0FBQUcsVUFBVSxNQUFjLEVBQUUsSUFBUyxFQUFFLE9BQWEsRUFBRSxZQUFrQjtJQUM1RixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ2pCLE9BQU8sVUFBVSxDQUFDLFlBQVUsTUFBTSxlQUFZLENBQUMsQ0FBQztLQUNqRDtJQUVELE9BQU8sQ0FBQyxtQkFBVSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztBQUMxRSxDQUFDLENBQUEsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTEgVmluYXkgUHVsaW0gPHZpbmF5QG1pbGV3aXNlLmNvbT5cbiAqIE1JVCBMaWNlbnNlZFxuICovXG5cbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBSZXNwb25zZSB9wqBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgKiBhcyBhc3NlcnQgZnJvbSAnYXNzZXJ0Jztcbi8vIGltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdldmVudHMnO1xuLy8gaW1wb3J0ICogYXMgdXRpbCBmcm9tICd1dGlsJztcbmltcG9ydCB7IGZpbmRQcmVmaXggfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB1dWlkNCBmcm9tICd1dWlkL3Y0JztcbmltcG9ydCB7IE9ic2VydmFibGUsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuY29uc3Qgbm9uSWRlbnRpZmllckNoYXJzID0gL1teYS16JF8wLTldL2k7XG5cbmV4cG9ydCBjb25zdCBDbGllbnQgPSBmdW5jdGlvbih3c2RsLCBlbmRwb2ludCwgb3B0aW9ucykge1xuICAvLyBldmVudHMuRXZlbnRFbWl0dGVyLmNhbGwodGhpcyk7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB0aGlzLndzZGwgPSB3c2RsO1xuICB0aGlzLl9pbml0aWFsaXplT3B0aW9ucyhvcHRpb25zKTtcbiAgdGhpcy5faW5pdGlhbGl6ZVNlcnZpY2VzKGVuZHBvaW50KTtcbiAgdGhpcy5odHRwQ2xpZW50ID0gb3B0aW9ucy5odHRwQ2xpZW50IGFzIEh0dHBDbGllbnQ7XG4gIGNvbnN0IHByb21pc2VPcHRpb25zOiBhbnkgPSB7IG11bHRpQXJnczogdHJ1ZSB9O1xuICBpZiAob3B0aW9ucy5vdmVycmlkZVByb21pc2VTdWZmaXgpIHtcbiAgICBwcm9taXNlT3B0aW9ucy5zdWZmaXggPSBvcHRpb25zLm92ZXJyaWRlUHJvbWlzZVN1ZmZpeDtcbiAgfVxuICBQcm9taXNlLmFsbChbdGhpcywgcHJvbWlzZU9wdGlvbnNdKTtcbn07XG4vLyB1dGlsLmluaGVyaXRzKENsaWVudCwgZXZlbnRzLkV2ZW50RW1pdHRlcik7XG5cbkNsaWVudC5wcm90b3R5cGUuYWRkU29hcEhlYWRlciA9IGZ1bmN0aW9uKHNvYXBIZWFkZXIsIG5hbWUsIG5hbWVzcGFjZSwgeG1sbnMpIHtcbiAgaWYgKCF0aGlzLnNvYXBIZWFkZXJzKSB7XG4gICAgdGhpcy5zb2FwSGVhZGVycyA9IFtdO1xuICB9XG4gIGlmICh0eXBlb2Ygc29hcEhlYWRlciA9PT0gJ29iamVjdCcpIHtcbiAgICBzb2FwSGVhZGVyID0gdGhpcy53c2RsLm9iamVjdFRvWE1MKHNvYXBIZWFkZXIsIG5hbWUsIG5hbWVzcGFjZSwgeG1sbnMsIHRydWUpO1xuICB9XG4gIHJldHVybiB0aGlzLnNvYXBIZWFkZXJzLnB1c2goc29hcEhlYWRlcikgLSAxO1xufTtcblxuQ2xpZW50LnByb3RvdHlwZS5jaGFuZ2VTb2FwSGVhZGVyID0gZnVuY3Rpb24oaW5kZXgsIHNvYXBIZWFkZXIsIG5hbWUsIG5hbWVzcGFjZSwgeG1sbnMpIHtcbiAgaWYgKCF0aGlzLnNvYXBIZWFkZXJzKSB7XG4gICAgdGhpcy5zb2FwSGVhZGVycyA9IFtdO1xuICB9XG4gIGlmICh0eXBlb2Ygc29hcEhlYWRlciA9PT0gJ29iamVjdCcpIHtcbiAgICBzb2FwSGVhZGVyID0gdGhpcy53c2RsLm9iamVjdFRvWE1MKHNvYXBIZWFkZXIsIG5hbWUsIG5hbWVzcGFjZSwgeG1sbnMsIHRydWUpO1xuICB9XG4gIHRoaXMuc29hcEhlYWRlcnNbaW5kZXhdID0gc29hcEhlYWRlcjtcbn07XG5cbkNsaWVudC5wcm90b3R5cGUuZ2V0U29hcEhlYWRlcnMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuc29hcEhlYWRlcnM7XG59O1xuXG5DbGllbnQucHJvdG90eXBlLmNsZWFyU29hcEhlYWRlcnMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5zb2FwSGVhZGVycyA9IG51bGw7XG59O1xuXG5DbGllbnQucHJvdG90eXBlLmFkZEh0dHBIZWFkZXIgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICBpZiAoIXRoaXMuaHR0cEhlYWRlcnMpIHtcbiAgICB0aGlzLmh0dHBIZWFkZXJzID0ge307XG4gIH1cbiAgdGhpcy5odHRwSGVhZGVyc1tuYW1lXSA9IHZhbHVlO1xufTtcblxuQ2xpZW50LnByb3RvdHlwZS5nZXRIdHRwSGVhZGVycyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5odHRwSGVhZGVycztcbn07XG5cbkNsaWVudC5wcm90b3R5cGUuY2xlYXJIdHRwSGVhZGVycyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmh0dHBIZWFkZXJzID0ge307XG59O1xuXG5cbkNsaWVudC5wcm90b3R5cGUuYWRkQm9keUF0dHJpYnV0ZSA9IGZ1bmN0aW9uKGJvZHlBdHRyaWJ1dGUsIG5hbWUsIG5hbWVzcGFjZSwgeG1sbnMpIHtcbiAgaWYgKCF0aGlzLmJvZHlBdHRyaWJ1dGVzKSB7XG4gICAgdGhpcy5ib2R5QXR0cmlidXRlcyA9IFtdO1xuICB9XG4gIGlmICh0eXBlb2YgYm9keUF0dHJpYnV0ZSA9PT0gJ29iamVjdCcpIHtcbiAgICBsZXQgY29tcG9zaXRpb24gPSAnJztcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhib2R5QXR0cmlidXRlKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3AsIGlkeCwgYXJyYXkpIHtcbiAgICAgIGNvbXBvc2l0aW9uICs9ICcgJyArIHByb3AgKyAnPVwiJyArIGJvZHlBdHRyaWJ1dGVbcHJvcF0gKyAnXCInO1xuICAgIH0pO1xuICAgIGJvZHlBdHRyaWJ1dGUgPSBjb21wb3NpdGlvbjtcbiAgfVxuICBpZiAoYm9keUF0dHJpYnV0ZS5zdWJzdHIoMCwgMSkgIT09ICcgJykgYm9keUF0dHJpYnV0ZSA9ICcgJyArIGJvZHlBdHRyaWJ1dGU7XG4gIHRoaXMuYm9keUF0dHJpYnV0ZXMucHVzaChib2R5QXR0cmlidXRlKTtcbn07XG5cbkNsaWVudC5wcm90b3R5cGUuZ2V0Qm9keUF0dHJpYnV0ZXMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuYm9keUF0dHJpYnV0ZXM7XG59O1xuXG5DbGllbnQucHJvdG90eXBlLmNsZWFyQm9keUF0dHJpYnV0ZXMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5ib2R5QXR0cmlidXRlcyA9IG51bGw7XG59O1xuXG5DbGllbnQucHJvdG90eXBlLnNldEVuZHBvaW50ID0gZnVuY3Rpb24oZW5kcG9pbnQpIHtcbiAgdGhpcy5lbmRwb2ludCA9IGVuZHBvaW50O1xuICB0aGlzLl9pbml0aWFsaXplU2VydmljZXMoZW5kcG9pbnQpO1xufTtcblxuQ2xpZW50LnByb3RvdHlwZS5kZXNjcmliZSA9IGZ1bmN0aW9uKCkge1xuICBjb25zdCB0eXBlcyA9IHRoaXMud3NkbC5kZWZpbml0aW9ucy50eXBlcztcbiAgcmV0dXJuIHRoaXMud3NkbC5kZXNjcmliZVNlcnZpY2VzKCk7XG59O1xuXG5DbGllbnQucHJvdG90eXBlLnNldFNlY3VyaXR5ID0gZnVuY3Rpb24oc2VjdXJpdHkpIHtcbiAgdGhpcy5zZWN1cml0eSA9IHNlY3VyaXR5O1xufTtcblxuQ2xpZW50LnByb3RvdHlwZS5zZXRTT0FQQWN0aW9uID0gZnVuY3Rpb24oU09BUEFjdGlvbikge1xuICB0aGlzLlNPQVBBY3Rpb24gPSBTT0FQQWN0aW9uO1xufTtcblxuQ2xpZW50LnByb3RvdHlwZS5faW5pdGlhbGl6ZVNlcnZpY2VzID0gZnVuY3Rpb24oZW5kcG9pbnQpIHtcbiAgY29uc3QgZGVmaW5pdGlvbnMgPSB0aGlzLndzZGwuZGVmaW5pdGlvbnMsXG4gICAgc2VydmljZXMgPSBkZWZpbml0aW9ucy5zZXJ2aWNlcztcbiAgZm9yIChjb25zdCBuYW1lIGluIHNlcnZpY2VzKSB7XG4gICAgdGhpc1tuYW1lXSA9IHRoaXMuX2RlZmluZVNlcnZpY2Uoc2VydmljZXNbbmFtZV0sIGVuZHBvaW50KTtcbiAgfVxufTtcblxuQ2xpZW50LnByb3RvdHlwZS5faW5pdGlhbGl6ZU9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIHRoaXMuc3RyZWFtQWxsb3dlZCA9IG9wdGlvbnMuc3RyZWFtO1xuICB0aGlzLm5vcm1hbGl6ZU5hbWVzID0gb3B0aW9ucy5ub3JtYWxpemVOYW1lcztcbiAgdGhpcy53c2RsLm9wdGlvbnMuYXR0cmlidXRlc0tleSA9IG9wdGlvbnMuYXR0cmlidXRlc0tleSB8fCAnYXR0cmlidXRlcyc7XG4gIHRoaXMud3NkbC5vcHRpb25zLmVudmVsb3BlS2V5ID0gb3B0aW9ucy5lbnZlbG9wZUtleSB8fCAnc29hcCc7XG4gIHRoaXMud3NkbC5vcHRpb25zLnByZXNlcnZlV2hpdGVzcGFjZSA9ICEhb3B0aW9ucy5wcmVzZXJ2ZVdoaXRlc3BhY2U7XG4gIGlmKG9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMgIT09IHVuZGVmaW5lZCkge1xuICAgIGlmKG9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMub3ZlcnJpZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYob3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcy5vdmVycmlkZSA9PT0gdHJ1ZSkge1xuICAgICAgICBpZihvcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzLm5hbWVzcGFjZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMud3NkbC5vcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzID0gb3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcy5uYW1lc3BhY2VzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmKG9wdGlvbnMub3ZlcnJpZGVSb290RWxlbWVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy53c2RsLm9wdGlvbnMub3ZlcnJpZGVSb290RWxlbWVudCA9IG9wdGlvbnMub3ZlcnJpZGVSb290RWxlbWVudDtcbiAgfVxuICB0aGlzLndzZGwub3B0aW9ucy5mb3JjZVNvYXAxMkhlYWRlcnMgPSAhIW9wdGlvbnMuZm9yY2VTb2FwMTJIZWFkZXJzO1xufTtcblxuQ2xpZW50LnByb3RvdHlwZS5fZGVmaW5lU2VydmljZSA9IGZ1bmN0aW9uKHNlcnZpY2UsIGVuZHBvaW50KSB7XG4gIGNvbnN0IHBvcnRzID0gc2VydmljZS5wb3J0cyxcbiAgICBkZWYgPSB7fTtcbiAgZm9yIChjb25zdCBuYW1lIGluIHBvcnRzKSB7XG4gICAgZGVmW25hbWVdID0gdGhpcy5fZGVmaW5lUG9ydChwb3J0c1tuYW1lXSwgZW5kcG9pbnQgPyBlbmRwb2ludCA6IHBvcnRzW25hbWVdLmxvY2F0aW9uKTtcbiAgfVxuICByZXR1cm4gZGVmO1xufTtcblxuQ2xpZW50LnByb3RvdHlwZS5fZGVmaW5lUG9ydCA9IGZ1bmN0aW9uKHBvcnQsIGVuZHBvaW50KSB7XG4gIGNvbnN0IGxvY2F0aW9uID0gZW5kcG9pbnQsXG4gICAgYmluZGluZyA9IHBvcnQuYmluZGluZyxcbiAgICBtZXRob2RzID0gYmluZGluZy5tZXRob2RzLFxuICAgIGRlZiA9IHt9O1xuICBmb3IgKGNvbnN0IG5hbWUgaW4gbWV0aG9kcykge1xuICAgIGRlZltuYW1lXSA9IHRoaXMuX2RlZmluZU1ldGhvZChtZXRob2RzW25hbWVdLCBsb2NhdGlvbik7XG4gICAgY29uc3QgbWV0aG9kTmFtZSA9IHRoaXMubm9ybWFsaXplTmFtZXMgPyBuYW1lLnJlcGxhY2Uobm9uSWRlbnRpZmllckNoYXJzLCAnXycpIDogbmFtZTtcbiAgICB0aGlzW21ldGhvZE5hbWVdID0gZGVmW25hbWVdO1xuICB9XG4gIHJldHVybiBkZWY7XG59O1xuXG5DbGllbnQucHJvdG90eXBlLl9kZWZpbmVNZXRob2QgPSBmdW5jdGlvbihtZXRob2QsIGxvY2F0aW9uKSB7XG4gIGNvbnN0IHNlbGYgPSB0aGlzO1xuICBsZXQgdGVtcCA9IG51bGw7XG4gIHJldHVybiBmdW5jdGlvbihhcmdzLCBvcHRpb25zLCBleHRyYUhlYWRlcnMpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiBzZWxmLl9pbnZva2UobWV0aG9kLCBhcmdzLCBsb2NhdGlvbiwgb3B0aW9ucywgZXh0cmFIZWFkZXJzKTtcbiAgfTtcbn07XG5cbkNsaWVudC5wcm90b3R5cGUuX2ludm9rZSA9IGZ1bmN0aW9uKG1ldGhvZCwgYXJncywgbG9jYXRpb24sIG9wdGlvbnMsIGV4dHJhSGVhZGVycyk6IE9ic2VydmFibGU8YW55PiB7XG4gIGxldCBzZWxmID0gdGhpcyxcbiAgICBuYW1lID0gbWV0aG9kLiRuYW1lLFxuICAgIGlucHV0ID0gbWV0aG9kLmlucHV0LFxuICAgIG91dHB1dCA9IG1ldGhvZC5vdXRwdXQsXG4gICAgc3R5bGUgPSBtZXRob2Quc3R5bGUsXG4gICAgZGVmcyA9IHRoaXMud3NkbC5kZWZpbml0aW9ucyxcbiAgICBlbnZlbG9wZUtleSA9IHRoaXMud3NkbC5vcHRpb25zLmVudmVsb3BlS2V5LFxuICAgIG5zID0gZGVmcy4kdGFyZ2V0TmFtZXNwYWNlLFxuICAgIGVuY29kaW5nID0gJycsXG4gICAgbWVzc2FnZSA9ICcnLFxuICAgIHhtbCA9IG51bGwsXG4gICAgcmVxID0gbnVsbCxcbiAgICBzb2FwQWN0aW9uID0gbnVsbCxcbiAgICBhbGlhcyA9IGZpbmRQcmVmaXgoZGVmcy54bWxucywgbnMpLFxuICAgIGhlYWRlcnM6IGFueSA9IHtcbiAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwidGV4dC94bWw7IGNoYXJzZXQ9dXRmLThcIlxuICAgIH0sXG4gICAgeG1sbnNTb2FwID0gXCJ4bWxuczpcIiArIGVudmVsb3BlS2V5ICsgXCI9XFxcImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3NvYXAvZW52ZWxvcGUvXFxcIlwiO1xuXG4gIGlmICh0aGlzLndzZGwub3B0aW9ucy5mb3JjZVNvYXAxMkhlYWRlcnMpIHtcbiAgICBoZWFkZXJzW1wiQ29udGVudC1UeXBlXCJdID0gXCJhcHBsaWNhdGlvbi9zb2FwK3htbDsgY2hhcnNldD11dGYtOFwiO1xuICAgIHhtbG5zU29hcCA9IFwieG1sbnM6XCIgKyBlbnZlbG9wZUtleSArIFwiPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAzLzA1L3NvYXAtZW52ZWxvcGVcXFwiXCI7XG4gIH1cblxuICBpZiAodGhpcy5TT0FQQWN0aW9uKSB7XG4gICAgc29hcEFjdGlvbiA9IHRoaXMuU09BUEFjdGlvbjtcbiAgfSBlbHNlIGlmIChtZXRob2Quc29hcEFjdGlvbiAhPT0gdW5kZWZpbmVkICYmIG1ldGhvZC5zb2FwQWN0aW9uICE9PSBudWxsKSB7XG4gICAgc29hcEFjdGlvbiA9IG1ldGhvZC5zb2FwQWN0aW9uO1xuICB9IGVsc2Uge1xuICAgIHNvYXBBY3Rpb24gPSAoKG5zLmxhc3RJbmRleE9mKFwiL1wiKSAhPT0gbnMubGVuZ3RoIC0gMSkgPyBucyArIFwiL1wiIDogbnMpICsgbmFtZTtcbiAgfVxuXG4gIGlmICghdGhpcy53c2RsLm9wdGlvbnMuZm9yY2VTb2FwMTJIZWFkZXJzKSB7XG4gICAgaGVhZGVycy5TT0FQQWN0aW9uID0gJ1wiJyArIHNvYXBBY3Rpb24gKyAnXCInO1xuICB9XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgLy9BZGQgZXh0cmEgaGVhZGVyc1xuICBmb3IgKGNvbnN0IGhlYWRlciBpbiB0aGlzLmh0dHBIZWFkZXJzICkgeyBoZWFkZXJzW2hlYWRlcl0gPSB0aGlzLmh0dHBIZWFkZXJzW2hlYWRlcl07ICB9XG4gIGZvciAoY29uc3QgYXR0ciBpbiBleHRyYUhlYWRlcnMpIHsgaGVhZGVyc1thdHRyXSA9IGV4dHJhSGVhZGVyc1thdHRyXTsgfVxuXG4gIC8vIEFsbG93IHRoZSBzZWN1cml0eSBvYmplY3QgdG8gYWRkIGhlYWRlcnNcbiAgaWYgKHNlbGYuc2VjdXJpdHkgJiYgc2VsZi5zZWN1cml0eS5hZGRIZWFkZXJzKVxuICAgIHNlbGYuc2VjdXJpdHkuYWRkSGVhZGVycyhoZWFkZXJzKTtcbiAgaWYgKHNlbGYuc2VjdXJpdHkgJiYgc2VsZi5zZWN1cml0eS5hZGRPcHRpb25zKVxuICAgIHNlbGYuc2VjdXJpdHkuYWRkT3B0aW9ucyhvcHRpb25zKTtcblxuICBpZiAoKHN0eWxlID09PSAncnBjJykmJiAoICggaW5wdXQucGFydHMgfHwgaW5wdXQubmFtZT09PVwiZWxlbWVudFwiICkgfHwgYXJncyA9PT0gbnVsbCkgKSB7XG4gICAgYXNzZXJ0Lm9rKCFzdHlsZSB8fCBzdHlsZSA9PT0gJ3JwYycsICdpbnZhbGlkIG1lc3NhZ2UgZGVmaW5pdGlvbiBmb3IgZG9jdW1lbnQgc3R5bGUgYmluZGluZycpO1xuICAgIG1lc3NhZ2UgPSBzZWxmLndzZGwub2JqZWN0VG9ScGNYTUwobmFtZSwgYXJncywgYWxpYXMsIG5zLChpbnB1dC5uYW1lIT09XCJlbGVtZW50XCIgKSk7XG4gICAgKG1ldGhvZC5pbnB1dFNvYXAgPT09ICdlbmNvZGVkJykgJiYgKGVuY29kaW5nID0gJ3NvYXA6ZW5jb2RpbmdTdHlsZT1cImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3NvYXAvZW5jb2RpbmcvXCIgJyk7XG4gIH0gZWxzZSB7XG4gICAgYXNzZXJ0Lm9rKCFzdHlsZSB8fCBzdHlsZSA9PT0gJ2RvY3VtZW50JywgJ2ludmFsaWQgbWVzc2FnZSBkZWZpbml0aW9uIGZvciBycGMgc3R5bGUgYmluZGluZycpO1xuICAgIC8vIHBhc3MgYGlucHV0LiRsb29rdXBUeXBlYCBpZiBgaW5wdXQuJHR5cGVgIGNvdWxkIG5vdCBiZSBmb3VuZFxuICAgIG1lc3NhZ2UgPSBzZWxmLndzZGwub2JqZWN0VG9Eb2N1bWVudFhNTChpbnB1dC4kbmFtZSwgYXJncywgaW5wdXQudGFyZ2V0TlNBbGlhcywgaW5wdXQudGFyZ2V0TmFtZXNwYWNlLCAoaW5wdXQuJHR5cGUgfHwgaW5wdXQuJGxvb2t1cFR5cGUpKTtcbiAgfVxuICB4bWwgPSBcIjw/eG1sIHZlcnNpb249XFxcIjEuMFxcXCIgZW5jb2Rpbmc9XFxcInV0Zi04XFxcIj8+XCIgK1xuICAgIFwiPFwiICsgZW52ZWxvcGVLZXkgKyBcIjpFbnZlbG9wZSBcIiArXG4gICAgeG1sbnNTb2FwICsgXCIgXCIgK1xuICAgIFwieG1sbnM6eHNpPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZVxcXCIgXCIgK1xuICAgIGVuY29kaW5nICtcbiAgICB0aGlzLndzZGwueG1sbnNJbkVudmVsb3BlICsgJz4nICtcbiAgICAoKHNlbGYuc29hcEhlYWRlcnMgfHwgc2VsZi5zZWN1cml0eSkgP1xuICAgICAgKFxuICAgICAgICBcIjxcIiArIGVudmVsb3BlS2V5ICsgXCI6SGVhZGVyPlwiICtcbiAgICAgICAgKHNlbGYuc29hcEhlYWRlcnMgPyBzZWxmLnNvYXBIZWFkZXJzLmpvaW4oXCJcXG5cIikgOiBcIlwiKSArXG4gICAgICAgIChzZWxmLnNlY3VyaXR5ICYmICFzZWxmLnNlY3VyaXR5LnBvc3RQcm9jZXNzID8gc2VsZi5zZWN1cml0eS50b1hNTCgpIDogXCJcIikgK1xuICAgICAgICBcIjwvXCIgKyBlbnZlbG9wZUtleSArIFwiOkhlYWRlcj5cIlxuICAgICAgKVxuICAgICAgOlxuICAgICAgICAnJ1xuICAgICAgKSArXG4gICAgXCI8XCIgKyBlbnZlbG9wZUtleSArIFwiOkJvZHlcIiArXG4gICAgKHNlbGYuYm9keUF0dHJpYnV0ZXMgPyBzZWxmLmJvZHlBdHRyaWJ1dGVzLmpvaW4oJyAnKSA6ICcnKSArXG4gICAgKHNlbGYuc2VjdXJpdHkgJiYgc2VsZi5zZWN1cml0eS5wb3N0UHJvY2VzcyA/ICcgSWQ9XCJfMFwiJyA6ICcnKSArXG4gICAgXCI+XCIgK1xuICAgIG1lc3NhZ2UgK1xuICAgIFwiPC9cIiArIGVudmVsb3BlS2V5ICsgXCI6Qm9keT5cIiArXG4gICAgXCI8L1wiICsgZW52ZWxvcGVLZXkgKyBcIjpFbnZlbG9wZT5cIjtcblxuICBpZihzZWxmLnNlY3VyaXR5ICYmIHNlbGYuc2VjdXJpdHkucG9zdFByb2Nlc3Mpe1xuICAgIHhtbCA9IHNlbGYuc2VjdXJpdHkucG9zdFByb2Nlc3MoeG1sLCBlbnZlbG9wZUtleSk7XG4gIH1cblxuICBpZihvcHRpb25zICYmIG9wdGlvbnMucG9zdFByb2Nlc3Mpe1xuICAgIHhtbCA9IG9wdGlvbnMucG9zdFByb2Nlc3MoeG1sKTtcbiAgfVxuXG4gIHNlbGYubGFzdE1lc3NhZ2UgPSBtZXNzYWdlO1xuICBzZWxmLmxhc3RSZXF1ZXN0ID0geG1sO1xuICBzZWxmLmxhc3RFbmRwb2ludCA9IGxvY2F0aW9uO1xuXG4gIGNvbnN0IGVpZCA9IG9wdGlvbnMuZXhjaGFuZ2VJZCB8fCB1dWlkNCgpO1xuXG4gIC8vIHNlbGYuZW1pdCgnbWVzc2FnZScsIG1lc3NhZ2UsIGVpZCk7XG4gIC8vIHNlbGYuZW1pdCgncmVxdWVzdCcsIHhtbCwgZWlkKTtcblxuICBjb25zdCB0cnlKU09OcGFyc2UgPSBmdW5jdGlvbihib2R5KSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGJvZHkpO1xuICAgIH1cbiAgICBjYXRjaChlcnIpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9O1xuXG4gIC8vY29uc29sZS5sb2coJ3VybDonLCBsb2NhdGlvbilcbiAgXG4gIHJldHVybiAoPEh0dHBDbGllbnQ+c2VsZi5odHRwQ2xpZW50KS5wb3N0KGxvY2F0aW9uLCB4bWwsIHtcbiAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgIHJlc3BvbnNlVHlwZTogJ3RleHQnLCBvYnNlcnZlOiAncmVzcG9uc2UnIH0pLnBpcGUoXG4gICAgbWFwKChyZXNwb25zZTogSHR0cFJlc3BvbnNlPGFueT4pID0+IHtcbiAgICAgIHNlbGYubGFzdFJlc3BvbnNlID0gcmVzcG9uc2UuYm9keTtcbiAgICAgIHNlbGYubGFzdFJlc3BvbnNlSGVhZGVycyA9IHJlc3BvbnNlICYmIHJlc3BvbnNlLmhlYWRlcnM7XG4gICAgICAvLyBzZWxmLmxhc3RFbGFwc2VkVGltZSA9IHJlc3BvbnNlICYmIHJlc3BvbnNlLmVsYXBzZWRUaW1lO1xuICAgICAgLy8gc2VsZi5lbWl0KCdyZXNwb25zZScsIHJlc3BvbnNlLmJvZHksIHJlc3BvbnNlLCBlaWQpO1xuICAgICAgLy9jb25zb2xlLmxvZygncmVzcG9uY2UgYm9keSBiZWZvcmUgc3luYycsIHJlc3BvbnNlLmJvZHkpO1xuICAgICAgcmV0dXJuIHBhcnNlU3luYyhyZXNwb25zZS5ib2R5LCByZXNwb25zZSlcbiAgICB9KVxuICApO1xuXG4gIGZ1bmN0aW9uIHBhcnNlU3luYyhib2R5LCByZXNwb25zZTogSHR0cFJlc3BvbnNlPGFueT4pIHtcbiAgICBsZXQgb2JqO1xuICAgIHRyeSB7XG4gICAgICBvYmogPSBzZWxmLndzZGwueG1sVG9PYmplY3QoYm9keSk7XG4gICAgICAvL2NvbnNvbGUubG9nKCdwYXJzZWQgYm9keScsb2JqKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgLy8gIFdoZW4gdGhlIG91dHB1dCBlbGVtZW50IGNhbm5vdCBiZSBsb29rZWQgdXAgaW4gdGhlIHdzZGwgYW5kIHRoZSBib2R5IGlzIEpTT05cbiAgICAgIC8vICBpbnN0ZWFkIG9mIHNlbmRpbmcgdGhlIGVycm9yLCB3ZSBwYXNzIHRoZSBib2R5IGluIHRoZSByZXNwb25zZS5cbiAgICAgIGlmKCFvdXRwdXQgfHwgIW91dHB1dC4kbG9va3VwVHlwZXMpIHtcbiAgICAgICAgLy8gZGVidWcoJ1Jlc3BvbnNlIGVsZW1lbnQgaXMgbm90IHByZXNlbnQuIFVuYWJsZSB0byBjb252ZXJ0IHJlc3BvbnNlIHhtbCB0byBqc29uLicpO1xuICAgICAgICAvLyAgSWYgdGhlIHJlc3BvbnNlIGlzIEpTT04gdGhlbiByZXR1cm4gaXQgYXMtaXMuXG4gICAgICAgIGNvbnN0IGpzb24gPSBfLmlzT2JqZWN0KGJvZHkpID8gYm9keSA6IHRyeUpTT05wYXJzZShib2R5KTtcbiAgICAgICAgaWYgKGpzb24pIHtcbiAgICAgICAgICByZXR1cm4geyBlcnI6IG51bGwsIHJlc3BvbnNlLCByZXNwb25zZUJvZHk6IGpzb24sIGhlYWRlcjogdW5kZWZpbmVkLCB4bWwgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgICAgIGVycm9yLmJvZHkgPSBib2R5O1xuICAgICAgLy8gc2VsZi5lbWl0KCdzb2FwRXJyb3InLCBlcnJvciwgZWlkKTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgICByZXR1cm4gZmluaXNoKG9iaiwgYm9keSwgcmVzcG9uc2UpO1xuICB9XG5cbiAgZnVuY3Rpb24gZmluaXNoKG9iaiwgcmVzcG9uc2VCb2R5LCByZXNwb25zZSkge1xuICAgIGxldCByZXN1bHQgPSBudWxsO1xuXG4gICAgaWYgKCFvdXRwdXQpe1xuICAgICAgLy8gb25lLXdheSwgbm8gb3V0cHV0IGV4cGVjdGVkXG4gICAgICByZXR1cm4geyBlcnI6IG51bGwsIHJlc3BvbnNlOiBudWxsLCByZXNwb25zZUJvZHksIGhlYWRlcjogb2JqLkhlYWRlciwgeG1sIH07XG4gICAgfVxuXG4gICAgLy8gSWYgaXQncyBub3QgSFRNTCBhbmQgU29hcCBCb2R5IGlzIGVtcHR5XG4gICAgaWYgKCFvYmouaHRtbCAmJiAhb2JqLkJvZHkpIHtcbiAgICAgIHJldHVybiAgeyBlcnI6IG51bGwsIG9iaiwgcmVzcG9uc2VCb2R5LCBoZWFkZXI6IG9iai5IZWFkZXIsIHhtbCB9OyBcbiAgICB9XG5cbiAgICBpZiggdHlwZW9mIG9iai5Cb2R5ICE9PSAnb2JqZWN0JyApIHtcbiAgICAgIGNvbnN0IGVycm9yOiBhbnkgPSBuZXcgRXJyb3IoJ0Nhbm5vdCBwYXJzZSByZXNwb25zZScpO1xuICAgICAgZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgICAgIGVycm9yLmJvZHkgPSByZXNwb25zZUJvZHk7XG4gICAgICByZXR1cm4geyBlcnI6IGVycm9yLCBvYmosIHJlc3BvbnNlQm9keSwgaGVhZGVyOiB1bmRlZmluZWQsIHhtbCB9OyBcbiAgICB9XG5cbiAgICByZXN1bHQgPSBvYmouQm9keVtvdXRwdXQuJG5hbWVdO1xuICAgIC8vIFJQQy9saXRlcmFsIHJlc3BvbnNlIGJvZHkgbWF5IGNvbnRhaW4gZWxlbWVudHMgd2l0aCBhZGRlZCBzdWZmaXhlcyBJLkUuXG4gICAgLy8gJ1Jlc3BvbnNlJywgb3IgJ091dHB1dCcsIG9yICdPdXQnXG4gICAgLy8gVGhpcyBkb2Vzbid0IG5lY2Vzc2FyaWx5IGVxdWFsIHRoZSBvdXB1dCBtZXNzYWdlIG5hbWUuIFNlZSBXU0RMIDEuMSBTZWN0aW9uIDIuNC41XG4gICAgaWYoIXJlc3VsdCl7XG4gICAgICByZXN1bHQgPSBvYmouQm9keVtvdXRwdXQuJG5hbWUucmVwbGFjZSgvKD86T3V0KD86cHV0KT98UmVzcG9uc2UpJC8sICcnKV07XG4gICAgfVxuICAgIGlmICghcmVzdWx0KSB7XG4gICAgICBbJ1Jlc3BvbnNlJywgJ091dCcsICdPdXRwdXQnXS5mb3JFYWNoKGZ1bmN0aW9uICh0ZXJtKSB7XG4gICAgICAgIGlmIChvYmouQm9keS5oYXNPd25Qcm9wZXJ0eShuYW1lICsgdGVybSkpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0ID0gb2JqLkJvZHlbbmFtZSArIHRlcm1dO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHsgZXJyOiBudWxsLCByZXN1bHQsIHJlc3BvbnNlQm9keSwgaGVhZGVyOiBvYmouSGVhZGVyLCB4bWwgfTsgXG4gIH1cbn07XG5cbkNsaWVudC5wcm90b3R5cGUuY2FsbCA9IGZ1bmN0aW9uIChtZXRob2Q6IHN0cmluZywgYm9keTogYW55LCBvcHRpb25zPzogYW55LCBleHRyYUhlYWRlcnM/OiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xuICBpZiAoIXRoaXNbbWV0aG9kXSkge1xuICAgIHJldHVybiB0aHJvd0Vycm9yKGBNZXRob2QgJHttZXRob2R9IG5vdCBmb3VuZGApO1xuICB9XG5cbiAgcmV0dXJuICg8RnVuY3Rpb24+dGhpc1ttZXRob2RdKS5jYWxsKHRoaXMsIGJvZHksIG9wdGlvbnMsIGV4dHJhSGVhZGVycyk7XG59XG4iXX0=