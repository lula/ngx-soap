/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
/*
 * Copyright (c) 2011 Vinay Pulim <vinay@milewise.com>
 * MIT Licensed
 */
import * as assert from 'assert';
import { findPrefix } from './utils';
import * as _ from 'lodash';
import uuid4 from 'uuid/v4';
import { from, throwError } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { Multipart } from './multipart';
import { SoapAttachment } from './soapAttachment';
/** @type {?} */
var nonIdentifierChars = /[^a-z$_0-9]/i;
/** @type {?} */
export var Client = function (wsdl, endpoint, options) {
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
};
Client.prototype.addSoapHeader = function (soapHeader, name, namespace, xmlns) {
    if (!this.soapHeaders) {
        this.soapHeaders = [];
    }
    if (typeof soapHeader === 'object') {
        soapHeader = this.wsdl.objectToXML(soapHeader, name, namespace, xmlns, true);
    }
    return this.soapHeaders.push(soapHeader) - 1;
};
Client.prototype.changeSoapHeader = function (index, soapHeader, name, namespace, xmlns) {
    if (!this.soapHeaders) {
        this.soapHeaders = [];
    }
    if (typeof soapHeader === 'object') {
        soapHeader = this.wsdl.objectToXML(soapHeader, name, namespace, xmlns, true);
    }
    this.soapHeaders[index] = soapHeader;
};
Client.prototype.getSoapHeaders = function () {
    return this.soapHeaders;
};
Client.prototype.clearSoapHeaders = function () {
    this.soapHeaders = null;
};
Client.prototype.addHttpHeader = function (name, value) {
    if (!this.httpHeaders) {
        this.httpHeaders = {};
    }
    this.httpHeaders[name] = value;
};
Client.prototype.getHttpHeaders = function () {
    return this.httpHeaders;
};
Client.prototype.clearHttpHeaders = function () {
    this.httpHeaders = {};
};
Client.prototype.addBodyAttribute = function (bodyAttribute, name, namespace, xmlns) {
    if (!this.bodyAttributes) {
        this.bodyAttributes = [];
    }
    if (typeof bodyAttribute === 'object') {
        /** @type {?} */
        var composition_1 = '';
        Object.getOwnPropertyNames(bodyAttribute).forEach(function (prop, idx, array) {
            composition_1 += ' ' + prop + '="' + bodyAttribute[prop] + '"';
        });
        bodyAttribute = composition_1;
    }
    if (bodyAttribute.substr(0, 1) !== ' ')
        bodyAttribute = ' ' + bodyAttribute;
    this.bodyAttributes.push(bodyAttribute);
};
Client.prototype.getBodyAttributes = function () {
    return this.bodyAttributes;
};
Client.prototype.clearBodyAttributes = function () {
    this.bodyAttributes = null;
};
Client.prototype.setEndpoint = function (endpoint) {
    this.endpoint = endpoint;
    this._initializeServices(endpoint);
};
Client.prototype.describe = function () {
    /** @type {?} */
    var types = this.wsdl.definitions.types;
    return this.wsdl.describeServices();
};
Client.prototype.setSecurity = function (security) {
    this.security = security;
};
Client.prototype.setSOAPAction = function (SOAPAction) {
    this.SOAPAction = SOAPAction;
};
Client.prototype._initializeServices = function (endpoint) {
    /** @type {?} */
    var definitions = this.wsdl.definitions;
    /** @type {?} */
    var services = definitions.services;
    for (var name_1 in services) {
        this[name_1] = this._defineService(services[name_1], endpoint);
    }
};
Client.prototype._initializeOptions = function (options) {
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
};
Client.prototype._defineService = function (service, endpoint) {
    /** @type {?} */
    var ports = service.ports;
    /** @type {?} */
    var def = {};
    for (var name_2 in ports) {
        def[name_2] = this._definePort(ports[name_2], endpoint ? endpoint : ports[name_2].location);
    }
    return def;
};
Client.prototype._definePort = function (port, endpoint) {
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
};
Client.prototype._defineMethod = function (method, location) {
    /** @type {?} */
    var self = this;
    /** @type {?} */
    var temp = null;
    return function (args, options, extraHeaders) {
        return self._invoke(method, args, location, options, extraHeaders);
    };
};
Client.prototype._invoke = function (method, args, location, options, extraHeaders) {
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
        'Content-Type': 'text/xml; charset=utf-8'
    };
    /** @type {?} */
    var xmlnsSoap = 'xmlns:' + envelopeKey + '="http://schemas.xmlsoap.org/soap/envelope/"';
    if (this.wsdl.options.forceSoap12Headers) {
        headers['Content-Type'] = 'application/soap+xml; charset=utf-8';
        xmlnsSoap = 'xmlns:' + envelopeKey + '="http://www.w3.org/2003/05/soap-envelope"';
    }
    if (this.SOAPAction) {
        soapAction = this.SOAPAction;
    }
    else if (method.soapAction !== undefined && method.soapAction !== null) {
        soapAction = method.soapAction;
    }
    else {
        soapAction = (ns.lastIndexOf('/') !== ns.length - 1 ? ns + '/' : ns) + name;
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
    if (style === 'rpc' && (input.parts || input.name === 'element' || args === null)) {
        assert.ok(!style || style === 'rpc', 'invalid message definition for document style binding');
        message = self.wsdl.objectToRpcXML(name, args, alias, ns, input.name !== 'element');
        method.inputSoap === 'encoded' && (encoding = 'soap:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" ');
    }
    else {
        assert.ok(!style || style === 'document', 'invalid message definition for rpc style binding');
        // pass `input.$lookupType` if `input.$type` could not be found
        message = self.wsdl.objectToDocumentXML(input.$name, args, input.targetNSAlias, input.targetNamespace, input.$type || input.$lookupType);
    }
    xml =
        '<?xml version="1.0" encoding="utf-8"?>' +
            '<' +
            envelopeKey +
            ':Envelope ' +
            xmlnsSoap +
            ' ' +
            'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
            encoding +
            this.wsdl.xmlnsInEnvelope +
            '>' +
            (self.soapHeaders || self.security
                ? '<' +
                    envelopeKey +
                    ':Header>' +
                    (self.soapHeaders ? self.soapHeaders.join('\n') : '') +
                    (self.security && !self.security.postProcess ? self.security.toXML() : '') +
                    '</' +
                    envelopeKey +
                    ':Header>'
                : '') +
            '<' +
            envelopeKey +
            ':Body' +
            (self.bodyAttributes ? self.bodyAttributes.join(' ') : '') +
            (self.security && self.security.postProcess ? ' Id="_0"' : '') +
            '>' +
            message +
            '</' +
            envelopeKey +
            ':Body>' +
            '</' +
            envelopeKey +
            ':Envelope>';
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
    var tryJSONparse = function (body) {
        try {
            return JSON.parse(body);
        }
        catch (err) {
            return undefined;
        }
    };
    return from(SoapAttachment.fromFormFiles(options.attachments)).pipe(map(function (soapAttachments) {
        var e_1, _a;
        if (!soapAttachments.length) {
            return xml;
        }
        if (options.forceMTOM || soapAttachments.length > 0) {
            /** @type {?} */
            var start = uuid4();
            /** @type {?} */
            var boundry = uuid4();
            /** @type {?} */
            var action = null;
            if (headers['Content-Type'].indexOf('action') > -1) {
                try {
                    for (var _b = tslib_1.__values(headers['Content-Type'].split('; ')), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var ct = _c.value;
                        if (ct.indexOf('action') > -1) {
                            action = ct;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            headers['Content-Type'] =
                'multipart/related; type="application/xop+xml"; start="<' + start + '>"; start-info="text/xml"; boundary="' + boundry + '"';
            if (action) {
                headers['Content-Type'] = headers['Content-Type'] + '; ' + action;
            }
            /** @type {?} */
            var multipart_1 = [
                {
                    'Content-Type': 'application/xop+xml; charset=UTF-8; type="text/xml"',
                    'Content-ID': '<' + start + '>',
                    body: xml
                }
            ];
            soapAttachments.forEach(function (attachment) {
                multipart_1.push({
                    'Content-Type': attachment.mimetype + ';',
                    'Content-Transfer-Encoding': 'binary',
                    'Content-ID': '<' + (attachment.contentId || attachment.name) + '>',
                    'Content-Disposition': 'attachment; name="' + attachment.name + '"; filename="' + attachment.name + '"',
                    body: attachment.body
                });
            });
            return new Multipart().build(multipart_1, boundry);
        }
    }), flatMap(function (body) {
        return ((/** @type {?} */ (self.httpClient)))
            .post(location, body, {
            headers: headers,
            responseType: 'text',
            observe: 'response'
        })
            .pipe(map(function (response) {
            self.lastResponse = response.body;
            self.lastResponseHeaders = response && response.headers;
            return parseSync(response.body, response);
        }));
    }));
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
            ['Response', 'Out', 'Output'].forEach(function (term) {
                if (obj.Body.hasOwnProperty(name + term)) {
                    return (result = obj.Body[name + term]);
                }
            });
        }
        return { err: null, result: result, responseBody: responseBody, header: obj.Header, xml: xml };
    }
};
Client.prototype.call = function (method, body, options, extraHeaders) {
    if (!this[method]) {
        return throwError("Method " + method + " not found");
    }
    return ((/** @type {?} */ (this[method]))).call(this, body, options, extraHeaders);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXNvYXAvIiwic291cmNlcyI6WyJsaWIvc29hcC9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBTUEsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFDakMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUNyQyxPQUFPLEtBQUssQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEtBQUssTUFBTSxTQUFTLENBQUM7QUFDNUIsT0FBTyxFQUFFLElBQUksRUFBYyxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQzs7SUFFNUMsa0JBQWtCLEdBQUcsY0FBYzs7QUFFekMsTUFBTSxLQUFPLE1BQU0sR0FBRyxVQUFTLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTztJQUNsRCxPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNqQixJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25DLElBQUksQ0FBQyxVQUFVLEdBQUcsbUJBQUEsT0FBTyxDQUFDLFVBQVUsRUFBYyxDQUFDOztRQUM3QyxjQUFjLEdBQVEsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFO0lBQy9DLElBQUksT0FBTyxDQUFDLHFCQUFxQixFQUFFO1FBQy9CLGNBQWMsQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDO0tBQ3pEO0lBQ0QsT0FBTyxDQUFDLEdB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QUFDNUUsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxMSBWaW5heSBQdWxpbSA8dmluYXlAbWlsZXdpc2UuY29tPlxuICogTUlUIExpY2Vuc2VkXG4gKi9cblxuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cFJlc3BvbnNlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0ICogYXMgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5pbXBvcnQgeyBmaW5kUHJlZml4IH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgdXVpZDQgZnJvbSAndXVpZC92NCc7XG5pbXBvcnQgeyBmcm9tLCBPYnNlcnZhYmxlLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmbGF0TWFwLCBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBNdWx0aXBhcnQgfSBmcm9tICcuL211bHRpcGFydCc7XG5pbXBvcnQgeyBTb2FwQXR0YWNobWVudCB9IGZyb20gJy4vc29hcEF0dGFjaG1lbnQnO1xuXG5jb25zdCBub25JZGVudGlmaWVyQ2hhcnMgPSAvW15hLXokXzAtOV0vaTtcblxuZXhwb3J0IGNvbnN0IENsaWVudCA9IGZ1bmN0aW9uKHdzZGwsIGVuZHBvaW50LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdGhpcy53c2RsID0gd3NkbDtcbiAgICB0aGlzLl9pbml0aWFsaXplT3B0aW9ucyhvcHRpb25zKTtcbiAgICB0aGlzLl9pbml0aWFsaXplU2VydmljZXMoZW5kcG9pbnQpO1xuICAgIHRoaXMuaHR0cENsaWVudCA9IG9wdGlvbnMuaHR0cENsaWVudCBhcyBIdHRwQ2xpZW50O1xuICAgIGNvbnN0IHByb21pc2VPcHRpb25zOiBhbnkgPSB7IG11bHRpQXJnczogdHJ1ZSB9O1xuICAgIGlmIChvcHRpb25zLm92ZXJyaWRlUHJvbWlzZVN1ZmZpeCkge1xuICAgICAgICBwcm9taXNlT3B0aW9ucy5zdWZmaXggPSBvcHRpb25zLm92ZXJyaWRlUHJvbWlzZVN1ZmZpeDtcbiAgICB9XG4gICAgUHJvbWlzZS5hbGwoW3RoaXMsIHByb21pc2VPcHRpb25zXSk7XG59O1xuXG5DbGllbnQucHJvdG90eXBlLmFkZFNvYXBIZWFkZXIgPSBmdW5jdGlvbihzb2FwSGVhZGVyLCBuYW1lLCBuYW1lc3BhY2UsIHhtbG5zKSB7XG4gICAgaWYgKCF0aGlzLnNvYXBIZWFkZXJzKSB7XG4gICAgICAgIHRoaXMuc29hcEhlYWRlcnMgPSBbXTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBzb2FwSGVhZGVyID09PSAnb2JqZWN0Jykge1xuICAgICAgICBzb2FwSGVhZGVyID0gdGhpcy53c2RsLm9iamVjdFRvWE1MKHNvYXBIZWFkZXIsIG5hbWUsIG5hbWVzcGFjZSwgeG1sbnMsIHRydWUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zb2FwSGVhZGVycy5wdXNoKHNvYXBIZWFkZXIpIC0gMTtcbn07XG5cbkNsaWVudC5wcm90b3R5cGUuY2hhbmdlU29hcEhlYWRlciA9IGZ1bmN0aW9uKGluZGV4LCBzb2FwSGVhZGVyLCBuYW1lLCBuYW1lc3BhY2UsIHhtbG5zKSB7XG4gICAgaWYgKCF0aGlzLnNvYXBIZWFkZXJzKSB7XG4gICAgICAgIHRoaXMuc29hcEhlYWRlcnMgPSBbXTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBzb2FwSGVhZGVyID09PSAnb2JqZWN0Jykge1xuICAgICAgICBzb2FwSGVhZGVyID0gdGhpcy53c2RsLm9iamVjdFRvWE1MKHNvYXBIZWFkZXIsIG5hbWUsIG5hbWVzcGFjZSwgeG1sbnMsIHRydWUpO1xuICAgIH1cbiAgICB0aGlzLnNvYXBIZWFkZXJzW2luZGV4XSA9IHNvYXBIZWFkZXI7XG59O1xuXG5DbGllbnQucHJvdG90eXBlLmdldFNvYXBIZWFkZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc29hcEhlYWRlcnM7XG59O1xuXG5DbGllbnQucHJvdG90eXBlLmNsZWFyU29hcEhlYWRlcnMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvYXBIZWFkZXJzID0gbnVsbDtcbn07XG5cbkNsaWVudC5wcm90b3R5cGUuYWRkSHR0cEhlYWRlciA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgaWYgKCF0aGlzLmh0dHBIZWFkZXJzKSB7XG4gICAgICAgIHRoaXMuaHR0cEhlYWRlcnMgPSB7fTtcbiAgICB9XG4gICAgdGhpcy5odHRwSGVhZGVyc1tuYW1lXSA9IHZhbHVlO1xufTtcblxuQ2xpZW50LnByb3RvdHlwZS5nZXRIdHRwSGVhZGVycyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmh0dHBIZWFkZXJzO1xufTtcblxuQ2xpZW50LnByb3RvdHlwZS5jbGVhckh0dHBIZWFkZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5odHRwSGVhZGVycyA9IHt9O1xufTtcblxuQ2xpZW50LnByb3RvdHlwZS5hZGRCb2R5QXR0cmlidXRlID0gZnVuY3Rpb24oYm9keUF0dHJpYnV0ZSwgbmFtZSwgbmFtZXNwYWNlLCB4bWxucykge1xuICAgIGlmICghdGhpcy5ib2R5QXR0cmlidXRlcykge1xuICAgICAgICB0aGlzLmJvZHlBdHRyaWJ1dGVzID0gW107XG4gICAgfVxuICAgIGlmICh0eXBlb2YgYm9keUF0dHJpYnV0ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbGV0IGNvbXBvc2l0aW9uID0gJyc7XG4gICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGJvZHlBdHRyaWJ1dGUpLmZvckVhY2goZnVuY3Rpb24ocHJvcCwgaWR4LCBhcnJheSkge1xuICAgICAgICAgICAgY29tcG9zaXRpb24gKz0gJyAnICsgcHJvcCArICc9XCInICsgYm9keUF0dHJpYnV0ZVtwcm9wXSArICdcIic7XG4gICAgICAgIH0pO1xuICAgICAgICBib2R5QXR0cmlidXRlID0gY29tcG9zaXRpb247XG4gICAgfVxuICAgIGlmIChib2R5QXR0cmlidXRlLnN1YnN0cigwLCAxKSAhPT0gJyAnKSBib2R5QXR0cmlidXRlID0gJyAnICsgYm9keUF0dHJpYnV0ZTtcbiAgICB0aGlzLmJvZHlBdHRyaWJ1dGVzLnB1c2goYm9keUF0dHJpYnV0ZSk7XG59O1xuXG5DbGllbnQucHJvdG90eXBlLmdldEJvZHlBdHRyaWJ1dGVzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuYm9keUF0dHJpYnV0ZXM7XG59O1xuXG5DbGllbnQucHJvdG90eXBlLmNsZWFyQm9keUF0dHJpYnV0ZXMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmJvZHlBdHRyaWJ1dGVzID0gbnVsbDtcbn07XG5cbkNsaWVudC5wcm90b3R5cGUuc2V0RW5kcG9pbnQgPSBmdW5jdGlvbihlbmRwb2ludCkge1xuICAgIHRoaXMuZW5kcG9pbnQgPSBlbmRwb2ludDtcbiAgICB0aGlzLl9pbml0aWFsaXplU2VydmljZXMoZW5kcG9pbnQpO1xufTtcblxuQ2xpZW50LnByb3RvdHlwZS5kZXNjcmliZSA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHR5cGVzID0gdGhpcy53c2RsLmRlZmluaXRpb25zLnR5cGVzO1xuICAgIHJldHVybiB0aGlzLndzZGwuZGVzY3JpYmVTZXJ2aWNlcygpO1xufTtcblxuQ2xpZW50LnByb3RvdHlwZS5zZXRTZWN1cml0eSA9IGZ1bmN0aW9uKHNlY3VyaXR5KSB7XG4gICAgdGhpcy5zZWN1cml0eSA9IHNlY3VyaXR5O1xufTtcblxuQ2xpZW50LnByb3RvdHlwZS5zZXRTT0FQQWN0aW9uID0gZnVuY3Rpb24oU09BUEFjdGlvbikge1xuICAgIHRoaXMuU09BUEFjdGlvbiA9IFNPQVBBY3Rpb247XG59O1xuXG5DbGllbnQucHJvdG90eXBlLl9pbml0aWFsaXplU2VydmljZXMgPSBmdW5jdGlvbihlbmRwb2ludCkge1xuICAgIGNvbnN0IGRlZmluaXRpb25zID0gdGhpcy53c2RsLmRlZmluaXRpb25zLFxuICAgICAgICBzZXJ2aWNlcyA9IGRlZmluaXRpb25zLnNlcnZpY2VzO1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiBzZXJ2aWNlcykge1xuICAgICAgICB0aGlzW25hbWVdID0gdGhpcy5fZGVmaW5lU2VydmljZShzZXJ2aWNlc1tuYW1lXSwgZW5kcG9pbnQpO1xuICAgIH1cbn07XG5cbkNsaWVudC5wcm90b3R5cGUuX2luaXRpYWxpemVPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHRoaXMuc3RyZWFtQWxsb3dlZCA9IG9wdGlvbnMuc3RyZWFtO1xuICAgIHRoaXMubm9ybWFsaXplTmFtZXMgPSBvcHRpb25zLm5vcm1hbGl6ZU5hbWVzO1xuICAgIHRoaXMud3NkbC5vcHRpb25zLmF0dHJpYnV0ZXNLZXkgPSBvcHRpb25zLmF0dHJpYnV0ZXNLZXkgfHwgJ2F0dHJpYnV0ZXMnO1xuICAgIHRoaXMud3NkbC5vcHRpb25zLmVudmVsb3BlS2V5ID0gb3B0aW9ucy5lbnZlbG9wZUtleSB8fCAnc29hcCc7XG4gICAgdGhpcy53c2RsLm9wdGlvbnMucHJlc2VydmVXaGl0ZXNwYWNlID0gISFvcHRpb25zLnByZXNlcnZlV2hpdGVzcGFjZTtcbiAgICBpZiAob3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzLm92ZXJyaWRlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzLm92ZXJyaWRlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMubmFtZXNwYWNlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMud3NkbC5vcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzID0gb3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcy5uYW1lc3BhY2VzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAob3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy53c2RsLm9wdGlvbnMub3ZlcnJpZGVSb290RWxlbWVudCA9IG9wdGlvbnMub3ZlcnJpZGVSb290RWxlbWVudDtcbiAgICB9XG4gICAgdGhpcy53c2RsLm9wdGlvbnMuZm9yY2VTb2FwMTJIZWFkZXJzID0gISFvcHRpb25zLmZvcmNlU29hcDEySGVhZGVycztcbn07XG5cbkNsaWVudC5wcm90b3R5cGUuX2RlZmluZVNlcnZpY2UgPSBmdW5jdGlvbihzZXJ2aWNlLCBlbmRwb2ludCkge1xuICAgIGNvbnN0IHBvcnRzID0gc2VydmljZS5wb3J0cyxcbiAgICAgICAgZGVmID0ge307XG4gICAgZm9yIChjb25zdCBuYW1lIGluIHBvcnRzKSB7XG4gICAgICAgIGRlZltuYW1lXSA9IHRoaXMuX2RlZmluZVBvcnQocG9ydHNbbmFtZV0sIGVuZHBvaW50ID8gZW5kcG9pbnQgOiBwb3J0c1tuYW1lXS5sb2NhdGlvbik7XG4gICAgfVxuICAgIHJldHVybiBkZWY7XG59O1xuXG5DbGllbnQucHJvdG90eXBlLl9kZWZpbmVQb3J0ID0gZnVuY3Rpb24ocG9ydCwgZW5kcG9pbnQpIHtcbiAgICBjb25zdCBsb2NhdGlvbiA9IGVuZHBvaW50LFxuICAgICAgICBiaW5kaW5nID0gcG9ydC5iaW5kaW5nLFxuICAgICAgICBtZXRob2RzID0gYmluZGluZy5tZXRob2RzLFxuICAgICAgICBkZWYgPSB7fTtcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gbWV0aG9kcykge1xuICAgICAgICBkZWZbbmFtZV0gPSB0aGlzLl9kZWZpbmVNZXRob2QobWV0aG9kc1tuYW1lXSwgbG9jYXRpb24pO1xuICAgICAgICBjb25zdCBtZXRob2ROYW1lID0gdGhpcy5ub3JtYWxpemVOYW1lcyA/IG5hbWUucmVwbGFjZShub25JZGVudGlmaWVyQ2hhcnMsICdfJykgOiBuYW1lO1xuICAgICAgICB0aGlzW21ldGhvZE5hbWVdID0gZGVmW25hbWVdO1xuICAgIH1cbiAgICByZXR1cm4gZGVmO1xufTtcblxuQ2xpZW50LnByb3RvdHlwZS5fZGVmaW5lTWV0aG9kID0gZnVuY3Rpb24obWV0aG9kLCBsb2NhdGlvbikge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGxldCB0ZW1wID0gbnVsbDtcbiAgICByZXR1cm4gZnVuY3Rpb24oYXJncywgb3B0aW9ucywgZXh0cmFIZWFkZXJzKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHNlbGYuX2ludm9rZShtZXRob2QsIGFyZ3MsIGxvY2F0aW9uLCBvcHRpb25zLCBleHRyYUhlYWRlcnMpO1xuICAgIH07XG59O1xuXG5DbGllbnQucHJvdG90eXBlLl9pbnZva2UgPSBmdW5jdGlvbihtZXRob2QsIGFyZ3MsIGxvY2F0aW9uLCBvcHRpb25zLCBleHRyYUhlYWRlcnMpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGxldCBzZWxmID0gdGhpcyxcbiAgICAgICAgbmFtZSA9IG1ldGhvZC4kbmFtZSxcbiAgICAgICAgaW5wdXQgPSBtZXRob2QuaW5wdXQsXG4gICAgICAgIG91dHB1dCA9IG1ldGhvZC5vdXRwdXQsXG4gICAgICAgIHN0eWxlID0gbWV0aG9kLnN0eWxlLFxuICAgICAgICBkZWZzID0gdGhpcy53c2RsLmRlZmluaXRpb25zLFxuICAgICAgICBlbnZlbG9wZUtleSA9IHRoaXMud3NkbC5vcHRpb25zLmVudmVsb3BlS2V5LFxuICAgICAgICBucyA9IGRlZnMuJHRhcmdldE5hbWVzcGFjZSxcbiAgICAgICAgZW5jb2RpbmcgPSAnJyxcbiAgICAgICAgbWVzc2FnZSA9ICcnLFxuICAgICAgICB4bWwgPSBudWxsLFxuICAgICAgICByZXEgPSBudWxsLFxuICAgICAgICBzb2FwQWN0aW9uID0gbnVsbCxcbiAgICAgICAgYWxpYXMgPSBmaW5kUHJlZml4KGRlZnMueG1sbnMsIG5zKSxcbiAgICAgICAgaGVhZGVyczogYW55ID0ge1xuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3htbDsgY2hhcnNldD11dGYtOCdcbiAgICAgICAgfSxcbiAgICAgICAgeG1sbnNTb2FwID0gJ3htbG5zOicgKyBlbnZlbG9wZUtleSArICc9XCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy9zb2FwL2VudmVsb3BlL1wiJztcblxuICAgIGlmICh0aGlzLndzZGwub3B0aW9ucy5mb3JjZVNvYXAxMkhlYWRlcnMpIHtcbiAgICAgICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24vc29hcCt4bWw7IGNoYXJzZXQ9dXRmLTgnO1xuICAgICAgICB4bWxuc1NvYXAgPSAneG1sbnM6JyArIGVudmVsb3BlS2V5ICsgJz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDMvMDUvc29hcC1lbnZlbG9wZVwiJztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5TT0FQQWN0aW9uKSB7XG4gICAgICAgIHNvYXBBY3Rpb24gPSB0aGlzLlNPQVBBY3Rpb247XG4gICAgfSBlbHNlIGlmIChtZXRob2Quc29hcEFjdGlvbiAhPT0gdW5kZWZpbmVkICYmIG1ldGhvZC5zb2FwQWN0aW9uICE9PSBudWxsKSB7XG4gICAgICAgIHNvYXBBY3Rpb24gPSBtZXRob2Quc29hcEFjdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzb2FwQWN0aW9uID0gKG5zLmxhc3RJbmRleE9mKCcvJykgIT09IG5zLmxlbmd0aCAtIDEgPyBucyArICcvJyA6IG5zKSArIG5hbWU7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLndzZGwub3B0aW9ucy5mb3JjZVNvYXAxMkhlYWRlcnMpIHtcbiAgICAgICAgaGVhZGVycy5TT0FQQWN0aW9uID0gJ1wiJyArIHNvYXBBY3Rpb24gKyAnXCInO1xuICAgIH1cblxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgLy9BZGQgZXh0cmEgaGVhZGVyc1xuICAgIGZvciAoY29uc3QgaGVhZGVyIGluIHRoaXMuaHR0cEhlYWRlcnMpIHtcbiAgICAgICAgaGVhZGVyc1toZWFkZXJdID0gdGhpcy5odHRwSGVhZGVyc1toZWFkZXJdO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGF0dHIgaW4gZXh0cmFIZWFkZXJzKSB7XG4gICAgICAgIGhlYWRlcnNbYXR0cl0gPSBleHRyYUhlYWRlcnNbYXR0cl07XG4gICAgfVxuXG4gICAgLy8gQWxsb3cgdGhlIHNlY3VyaXR5IG9iamVjdCB0byBhZGQgaGVhZGVyc1xuICAgIGlmIChzZWxmLnNlY3VyaXR5ICYmIHNlbGYuc2VjdXJpdHkuYWRkSGVhZGVycykgc2VsZi5zZWN1cml0eS5hZGRIZWFkZXJzKGhlYWRlcnMpO1xuICAgIGlmIChzZWxmLnNlY3VyaXR5ICYmIHNlbGYuc2VjdXJpdHkuYWRkT3B0aW9ucykgc2VsZi5zZWN1cml0eS5hZGRPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgaWYgKHN0eWxlID09PSAncnBjJyAmJiAoaW5wdXQucGFydHMgfHwgaW5wdXQubmFtZSA9PT0gJ2VsZW1lbnQnIHx8IGFyZ3MgPT09IG51bGwpKSB7XG4gICAgICAgIGFzc2VydC5vayghc3R5bGUgfHwgc3R5bGUgPT09ICdycGMnLCAnaW52YWxpZCBtZXNzYWdlIGRlZmluaXRpb24gZm9yIGRvY3VtZW50IHN0eWxlIGJpbmRpbmcnKTtcbiAgICAgICAgbWVzc2FnZSA9IHNlbGYud3NkbC5vYmplY3RUb1JwY1hNTChuYW1lLCBhcmdzLCBhbGlhcywgbnMsIGlucHV0Lm5hbWUgIT09ICdlbGVtZW50Jyk7XG4gICAgICAgIG1ldGhvZC5pbnB1dFNvYXAgPT09ICdlbmNvZGVkJyAmJiAoZW5jb2RpbmcgPSAnc29hcDplbmNvZGluZ1N0eWxlPVwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbmNvZGluZy9cIiAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBhc3NlcnQub2soIXN0eWxlIHx8IHN0eWxlID09PSAnZG9jdW1lbnQnLCAnaW52YWxpZCBtZXNzYWdlIGRlZmluaXRpb24gZm9yIHJwYyBzdHlsZSBiaW5kaW5nJyk7XG4gICAgICAgIC8vIHBhc3MgYGlucHV0LiRsb29rdXBUeXBlYCBpZiBgaW5wdXQuJHR5cGVgIGNvdWxkIG5vdCBiZSBmb3VuZFxuICAgICAgICBtZXNzYWdlID0gc2VsZi53c2RsLm9iamVjdFRvRG9jdW1lbnRYTUwoaW5wdXQuJG5hbWUsIGFyZ3MsIGlucHV0LnRhcmdldE5TQWxpYXMsIGlucHV0LnRhcmdldE5hbWVzcGFjZSwgaW5wdXQuJHR5cGUgfHwgaW5wdXQuJGxvb2t1cFR5cGUpO1xuICAgIH1cbiAgICB4bWwgPVxuICAgICAgICAnPD94bWwgdmVyc2lvbj1cIjEuMFwiIGVuY29kaW5nPVwidXRmLThcIj8+JyArXG4gICAgICAgICc8JyArXG4gICAgICAgIGVudmVsb3BlS2V5ICtcbiAgICAgICAgJzpFbnZlbG9wZSAnICtcbiAgICAgICAgeG1sbnNTb2FwICtcbiAgICAgICAgJyAnICtcbiAgICAgICAgJ3htbG5zOnhzaT1cImh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlXCIgJyArXG4gICAgICAgIGVuY29kaW5nICtcbiAgICAgICAgdGhpcy53c2RsLnhtbG5zSW5FbnZlbG9wZSArXG4gICAgICAgICc+JyArXG4gICAgICAgIChzZWxmLnNvYXBIZWFkZXJzIHx8IHNlbGYuc2VjdXJpdHlcbiAgICAgICAgICAgID8gJzwnICtcbiAgICAgICAgICAgICAgZW52ZWxvcGVLZXkgK1xuICAgICAgICAgICAgICAnOkhlYWRlcj4nICtcbiAgICAgICAgICAgICAgKHNlbGYuc29hcEhlYWRlcnMgPyBzZWxmLnNvYXBIZWFkZXJzLmpvaW4oJ1xcbicpIDogJycpICtcbiAgICAgICAgICAgICAgKHNlbGYuc2VjdXJpdHkgJiYgIXNlbGYuc2VjdXJpdHkucG9zdFByb2Nlc3MgPyBzZWxmLnNlY3VyaXR5LnRvWE1MKCkgOiAnJykgK1xuICAgICAgICAgICAgICAnPC8nICtcbiAgICAgICAgICAgICAgZW52ZWxvcGVLZXkgK1xuICAgICAgICAgICAgICAnOkhlYWRlcj4nXG4gICAgICAgICAgICA6ICcnKSArXG4gICAgICAgICc8JyArXG4gICAgICAgIGVudmVsb3BlS2V5ICtcbiAgICAgICAgJzpCb2R5JyArXG4gICAgICAgIChzZWxmLmJvZHlBdHRyaWJ1dGVzID8gc2VsZi5ib2R5QXR0cmlidXRlcy5qb2luKCcgJykgOiAnJykgK1xuICAgICAgICAoc2VsZi5zZWN1cml0eSAmJiBzZWxmLnNlY3VyaXR5LnBvc3RQcm9jZXNzID8gJyBJZD1cIl8wXCInIDogJycpICtcbiAgICAgICAgJz4nICtcbiAgICAgICAgbWVzc2FnZSArXG4gICAgICAgICc8LycgK1xuICAgICAgICBlbnZlbG9wZUtleSArXG4gICAgICAgICc6Qm9keT4nICtcbiAgICAgICAgJzwvJyArXG4gICAgICAgIGVudmVsb3BlS2V5ICtcbiAgICAgICAgJzpFbnZlbG9wZT4nO1xuXG4gICAgaWYgKHNlbGYuc2VjdXJpdHkgJiYgc2VsZi5zZWN1cml0eS5wb3N0UHJvY2Vzcykge1xuICAgICAgICB4bWwgPSBzZWxmLnNlY3VyaXR5LnBvc3RQcm9jZXNzKHhtbCwgZW52ZWxvcGVLZXkpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMucG9zdFByb2Nlc3MpIHtcbiAgICAgICAgeG1sID0gb3B0aW9ucy5wb3N0UHJvY2Vzcyh4bWwpO1xuICAgIH1cblxuICAgIHNlbGYubGFzdE1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIHNlbGYubGFzdFJlcXVlc3QgPSB4bWw7XG4gICAgc2VsZi5sYXN0RW5kcG9pbnQgPSBsb2NhdGlvbjtcblxuICAgIGNvbnN0IHRyeUpTT05wYXJzZSA9IGZ1bmN0aW9uKGJvZHkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKGJvZHkpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIGZyb20oU29hcEF0dGFjaG1lbnQuZnJvbUZvcm1GaWxlcyhvcHRpb25zLmF0dGFjaG1lbnRzKSkucGlwZShcbiAgICAgICAgbWFwKChzb2FwQXR0YWNobWVudHM6IFNvYXBBdHRhY2htZW50W10pID0+IHtcbiAgICAgICAgICAgIGlmICghc29hcEF0dGFjaG1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4bWw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmZvcmNlTVRPTSB8fCBzb2FwQXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gdXVpZDQoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBib3VuZHJ5ID0gdXVpZDQoKTtcbiAgICAgICAgICAgICAgICBsZXQgYWN0aW9uID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAoaGVhZGVyc1snQ29udGVudC1UeXBlJ10uaW5kZXhPZignYWN0aW9uJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGN0IG9mIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddLnNwbGl0KCc7ICcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3QuaW5kZXhPZignYWN0aW9uJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbiA9IGN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPVxuICAgICAgICAgICAgICAgICAgICAnbXVsdGlwYXJ0L3JlbGF0ZWQ7IHR5cGU9XCJhcHBsaWNhdGlvbi94b3AreG1sXCI7IHN0YXJ0PVwiPCcgKyBzdGFydCArICc+XCI7IHN0YXJ0LWluZm89XCJ0ZXh0L3htbFwiOyBib3VuZGFyeT1cIicgKyBib3VuZHJ5ICsgJ1wiJztcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gaGVhZGVyc1snQ29udGVudC1UeXBlJ10gKyAnOyAnICsgYWN0aW9uO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IG11bHRpcGFydDogYW55W10gPSBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veG9wK3htbDsgY2hhcnNldD1VVEYtODsgdHlwZT1cInRleHQveG1sXCInLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtSUQnOiAnPCcgKyBzdGFydCArICc+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IHhtbFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgICAgIHNvYXBBdHRhY2htZW50cy5mb3JFYWNoKChhdHRhY2htZW50OiBTb2FwQXR0YWNobWVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBtdWx0aXBhcnQucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogYXR0YWNobWVudC5taW1ldHlwZSArICc7JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdDb250ZW50LVRyYW5zZmVyLUVuY29kaW5nJzogJ2JpbmFyeScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1JRCc6ICc8JyArIChhdHRhY2htZW50LmNvbnRlbnRJZCB8fCBhdHRhY2htZW50Lm5hbWUpICsgJz4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtRGlzcG9zaXRpb24nOiAnYXR0YWNobWVudDsgbmFtZT1cIicgKyBhdHRhY2htZW50Lm5hbWUgKyAnXCI7IGZpbGVuYW1lPVwiJyArIGF0dGFjaG1lbnQubmFtZSArICdcIicsXG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5OiBhdHRhY2htZW50LmJvZHlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IE11bHRpcGFydCgpLmJ1aWxkKG11bHRpcGFydCwgYm91bmRyeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICBmbGF0TWFwKChib2R5OiBhbnkpID0+XG4gICAgICAgICAgICAoPEh0dHBDbGllbnQ+c2VsZi5odHRwQ2xpZW50KVxuICAgICAgICAgICAgICAgIC5wb3N0KGxvY2F0aW9uLCBib2R5LCB7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlVHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgICAgICAgICBvYnNlcnZlOiAncmVzcG9uc2UnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICAgICAgbWFwKChyZXNwb25zZTogSHR0cFJlc3BvbnNlPGFueT4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubGFzdFJlc3BvbnNlID0gcmVzcG9uc2UuYm9keTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubGFzdFJlc3BvbnNlSGVhZGVycyA9IHJlc3BvbnNlICYmIHJlc3BvbnNlLmhlYWRlcnM7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VTeW5jKHJlc3BvbnNlLmJvZHksIHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgIClcbiAgICApO1xuXG4gICAgZnVuY3Rpb24gcGFyc2VTeW5jKGJvZHksIHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8YW55Pikge1xuICAgICAgICBsZXQgb2JqO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgb2JqID0gc2VsZi53c2RsLnhtbFRvT2JqZWN0KGJvZHkpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgLy8gIFdoZW4gdGhlIG91dHB1dCBlbGVtZW50IGNhbm5vdCBiZSBsb29rZWQgdXAgaW4gdGhlIHdzZGwgYW5kIHRoZSBib2R5IGlzIEpTT05cbiAgICAgICAgICAgIC8vICBpbnN0ZWFkIG9mIHNlbmRpbmcgdGhlIGVycm9yLCB3ZSBwYXNzIHRoZSBib2R5IGluIHRoZSByZXNwb25zZS5cbiAgICAgICAgICAgIGlmICghb3V0cHV0IHx8ICFvdXRwdXQuJGxvb2t1cFR5cGVzKSB7XG4gICAgICAgICAgICAgICAgLy8gZGVidWcoJ1Jlc3BvbnNlIGVsZW1lbnQgaXMgbm90IHByZXNlbnQuIFVuYWJsZSB0byBjb252ZXJ0IHJlc3BvbnNlIHhtbCB0byBqc29uLicpO1xuICAgICAgICAgICAgICAgIC8vICBJZiB0aGUgcmVzcG9uc2UgaXMgSlNPTiB0aGVuIHJldHVybiBpdCBhcy1pcy5cbiAgICAgICAgICAgICAgICBjb25zdCBqc29uID0gXy5pc09iamVjdChib2R5KSA/IGJvZHkgOiB0cnlKU09OcGFyc2UoYm9keSk7XG4gICAgICAgICAgICAgICAgaWYgKGpzb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgZXJyOiBudWxsLCByZXNwb25zZSwgcmVzcG9uc2VCb2R5OiBqc29uLCBoZWFkZXI6IHVuZGVmaW5lZCwgeG1sIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgICAgICAgICAgIGVycm9yLmJvZHkgPSBib2R5O1xuICAgICAgICAgICAgLy8gc2VsZi5lbWl0KCdzb2FwRXJyb3InLCBlcnJvciwgZWlkKTtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaW5pc2gob2JqLCBib2R5LCByZXNwb25zZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmluaXNoKG9iaiwgcmVzcG9uc2VCb2R5LCByZXNwb25zZSkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gbnVsbDtcblxuICAgICAgICBpZiAoIW91dHB1dCkge1xuICAgICAgICAgICAgLy8gb25lLXdheSwgbm8gb3V0cHV0IGV4cGVjdGVkXG4gICAgICAgICAgICByZXR1cm4geyBlcnI6IG51bGwsIHJlc3BvbnNlOiBudWxsLCByZXNwb25zZUJvZHksIGhlYWRlcjogb2JqLkhlYWRlciwgeG1sIH07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBpdCdzIG5vdCBIVE1MIGFuZCBTb2FwIEJvZHkgaXMgZW1wdHlcbiAgICAgICAgaWYgKCFvYmouaHRtbCAmJiAhb2JqLkJvZHkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IGVycjogbnVsbCwgb2JqLCByZXNwb25zZUJvZHksIGhlYWRlcjogb2JqLkhlYWRlciwgeG1sIH07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIG9iai5Cb2R5ICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgY29uc3QgZXJyb3I6IGFueSA9IG5ldyBFcnJvcignQ2Fubm90IHBhcnNlIHJlc3BvbnNlJyk7XG4gICAgICAgICAgICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgZXJyb3IuYm9keSA9IHJlc3BvbnNlQm9keTtcbiAgICAgICAgICAgIHJldHVybiB7IGVycjogZXJyb3IsIG9iaiwgcmVzcG9uc2VCb2R5LCBoZWFkZXI6IHVuZGVmaW5lZCwgeG1sIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHQgPSBvYmouQm9keVtvdXRwdXQuJG5hbWVdO1xuICAgICAgICAvLyBSUEMvbGl0ZXJhbCByZXNwb25zZSBib2R5IG1heSBjb250YWluIGVsZW1lbnRzIHdpdGggYWRkZWQgc3VmZml4ZXMgSS5FLlxuICAgICAgICAvLyAnUmVzcG9uc2UnLCBvciAnT3V0cHV0Jywgb3IgJ091dCdcbiAgICAgICAgLy8gVGhpcyBkb2Vzbid0IG5lY2Vzc2FyaWx5IGVxdWFsIHRoZSBvdXB1dCBtZXNzYWdlIG5hbWUuIFNlZSBXU0RMIDEuMSBTZWN0aW9uIDIuNC41XG4gICAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgICAgICByZXN1bHQgPSBvYmouQm9keVtvdXRwdXQuJG5hbWUucmVwbGFjZSgvKD86T3V0KD86cHV0KT98UmVzcG9uc2UpJC8sICcnKV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgIFsnUmVzcG9uc2UnLCAnT3V0JywgJ091dHB1dCddLmZvckVhY2goZnVuY3Rpb24odGVybSkge1xuICAgICAgICAgICAgICAgIGlmIChvYmouQm9keS5oYXNPd25Qcm9wZXJ0eShuYW1lICsgdGVybSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChyZXN1bHQgPSBvYmouQm9keVtuYW1lICsgdGVybV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHsgZXJyOiBudWxsLCByZXN1bHQsIHJlc3BvbnNlQm9keSwgaGVhZGVyOiBvYmouSGVhZGVyLCB4bWwgfTtcbiAgICB9XG59O1xuXG5DbGllbnQucHJvdG90eXBlLmNhbGwgPSBmdW5jdGlvbihtZXRob2Q6IHN0cmluZywgYm9keTogYW55LCBvcHRpb25zPzogYW55LCBleHRyYUhlYWRlcnM/OiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGlmICghdGhpc1ttZXRob2RdKSB7XG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGBNZXRob2QgJHttZXRob2R9IG5vdCBmb3VuZGApO1xuICAgIH1cblxuICAgIHJldHVybiAoPEZ1bmN0aW9uPnRoaXNbbWV0aG9kXSkuY2FsbCh0aGlzLCBib2R5LCBvcHRpb25zLCBleHRyYUhlYWRlcnMpO1xufTtcbiJdfQ==