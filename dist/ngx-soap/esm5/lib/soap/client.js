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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXNvYXAvIiwic291cmNlcyI6WyJsaWIvc29hcC9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBTUEsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFDakMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUNyQyxPQUFPLEtBQUssQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEtBQUssTUFBTSxTQUFTLENBQUM7QUFDNUIsT0FBTyxFQUFFLElBQUksRUFBYyxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQzs7SUFFNUMsa0JBQWtCLEdBQUcsY0FBYzs7QUFFekMsTUFBTSxLQUFPLE1BQU0sR0FBRyxVQUFTLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTztJQUNsRCxPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNqQixJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25DLElBQUksQ0FBQyxVQUFVLEdBQUcsbUJBQUEsT0FBTyxDQUFDLFVBQVUsRUFBYyxDQUFDOztRQUM3QyxjQUFjLEdBQVEsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFO0lBQy9DLElBQUksT0FBTyxDQUFDLHFCQUFxQixFQUFFO1FBQy9CLGNBQWMsQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDO0tBQ3pEO0lBQ0QsT0FBTyxDQUFDLEdB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QUFDNUUsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogQ29weXJpZ2h0IChjKSAyMDExIFZpbmF5IFB1bGltIDx2aW5heUBtaWxld2lzZS5jb20+XHJcbiAqIE1JVCBMaWNlbnNlZFxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBSZXNwb25zZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0ICogYXMgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XHJcbmltcG9ydCB7IGZpbmRQcmVmaXggfSBmcm9tICcuL3V0aWxzJztcclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgdXVpZDQgZnJvbSAndXVpZC92NCc7XHJcbmltcG9ydCB7IGZyb20sIE9ic2VydmFibGUsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgZmxhdE1hcCwgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBNdWx0aXBhcnQgfSBmcm9tICcuL211bHRpcGFydCc7XHJcbmltcG9ydCB7IFNvYXBBdHRhY2htZW50IH0gZnJvbSAnLi9zb2FwQXR0YWNobWVudCc7XHJcblxyXG5jb25zdCBub25JZGVudGlmaWVyQ2hhcnMgPSAvW15hLXokXzAtOV0vaTtcclxuXHJcbmV4cG9ydCBjb25zdCBDbGllbnQgPSBmdW5jdGlvbih3c2RsLCBlbmRwb2ludCwgb3B0aW9ucykge1xyXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgICB0aGlzLndzZGwgPSB3c2RsO1xyXG4gICAgdGhpcy5faW5pdGlhbGl6ZU9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICB0aGlzLl9pbml0aWFsaXplU2VydmljZXMoZW5kcG9pbnQpO1xyXG4gICAgdGhpcy5odHRwQ2xpZW50ID0gb3B0aW9ucy5odHRwQ2xpZW50IGFzIEh0dHBDbGllbnQ7XHJcbiAgICBjb25zdCBwcm9taXNlT3B0aW9uczogYW55ID0geyBtdWx0aUFyZ3M6IHRydWUgfTtcclxuICAgIGlmIChvcHRpb25zLm92ZXJyaWRlUHJvbWlzZVN1ZmZpeCkge1xyXG4gICAgICAgIHByb21pc2VPcHRpb25zLnN1ZmZpeCA9IG9wdGlvbnMub3ZlcnJpZGVQcm9taXNlU3VmZml4O1xyXG4gICAgfVxyXG4gICAgUHJvbWlzZS5hbGwoW3RoaXMsIHByb21pc2VPcHRpb25zXSk7XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLmFkZFNvYXBIZWFkZXIgPSBmdW5jdGlvbihzb2FwSGVhZGVyLCBuYW1lLCBuYW1lc3BhY2UsIHhtbG5zKSB7XHJcbiAgICBpZiAoIXRoaXMuc29hcEhlYWRlcnMpIHtcclxuICAgICAgICB0aGlzLnNvYXBIZWFkZXJzID0gW107XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIHNvYXBIZWFkZXIgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgc29hcEhlYWRlciA9IHRoaXMud3NkbC5vYmplY3RUb1hNTChzb2FwSGVhZGVyLCBuYW1lLCBuYW1lc3BhY2UsIHhtbG5zLCB0cnVlKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLnNvYXBIZWFkZXJzLnB1c2goc29hcEhlYWRlcikgLSAxO1xyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5jaGFuZ2VTb2FwSGVhZGVyID0gZnVuY3Rpb24oaW5kZXgsIHNvYXBIZWFkZXIsIG5hbWUsIG5hbWVzcGFjZSwgeG1sbnMpIHtcclxuICAgIGlmICghdGhpcy5zb2FwSGVhZGVycykge1xyXG4gICAgICAgIHRoaXMuc29hcEhlYWRlcnMgPSBbXTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2Ygc29hcEhlYWRlciA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICBzb2FwSGVhZGVyID0gdGhpcy53c2RsLm9iamVjdFRvWE1MKHNvYXBIZWFkZXIsIG5hbWUsIG5hbWVzcGFjZSwgeG1sbnMsIHRydWUpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zb2FwSGVhZGVyc1tpbmRleF0gPSBzb2FwSGVhZGVyO1xyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5nZXRTb2FwSGVhZGVycyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc29hcEhlYWRlcnM7XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLmNsZWFyU29hcEhlYWRlcnMgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuc29hcEhlYWRlcnMgPSBudWxsO1xyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5hZGRIdHRwSGVhZGVyID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcclxuICAgIGlmICghdGhpcy5odHRwSGVhZGVycykge1xyXG4gICAgICAgIHRoaXMuaHR0cEhlYWRlcnMgPSB7fTtcclxuICAgIH1cclxuICAgIHRoaXMuaHR0cEhlYWRlcnNbbmFtZV0gPSB2YWx1ZTtcclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuZ2V0SHR0cEhlYWRlcnMgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHBIZWFkZXJzO1xyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5jbGVhckh0dHBIZWFkZXJzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmh0dHBIZWFkZXJzID0ge307XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLmFkZEJvZHlBdHRyaWJ1dGUgPSBmdW5jdGlvbihib2R5QXR0cmlidXRlLCBuYW1lLCBuYW1lc3BhY2UsIHhtbG5zKSB7XHJcbiAgICBpZiAoIXRoaXMuYm9keUF0dHJpYnV0ZXMpIHtcclxuICAgICAgICB0aGlzLmJvZHlBdHRyaWJ1dGVzID0gW107XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIGJvZHlBdHRyaWJ1dGUgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgbGV0IGNvbXBvc2l0aW9uID0gJyc7XHJcbiAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYm9keUF0dHJpYnV0ZSkuZm9yRWFjaChmdW5jdGlvbihwcm9wLCBpZHgsIGFycmF5KSB7XHJcbiAgICAgICAgICAgIGNvbXBvc2l0aW9uICs9ICcgJyArIHByb3AgKyAnPVwiJyArIGJvZHlBdHRyaWJ1dGVbcHJvcF0gKyAnXCInO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJvZHlBdHRyaWJ1dGUgPSBjb21wb3NpdGlvbjtcclxuICAgIH1cclxuICAgIGlmIChib2R5QXR0cmlidXRlLnN1YnN0cigwLCAxKSAhPT0gJyAnKSBib2R5QXR0cmlidXRlID0gJyAnICsgYm9keUF0dHJpYnV0ZTtcclxuICAgIHRoaXMuYm9keUF0dHJpYnV0ZXMucHVzaChib2R5QXR0cmlidXRlKTtcclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuZ2V0Qm9keUF0dHJpYnV0ZXMgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmJvZHlBdHRyaWJ1dGVzO1xyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5jbGVhckJvZHlBdHRyaWJ1dGVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmJvZHlBdHRyaWJ1dGVzID0gbnVsbDtcclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuc2V0RW5kcG9pbnQgPSBmdW5jdGlvbihlbmRwb2ludCkge1xyXG4gICAgdGhpcy5lbmRwb2ludCA9IGVuZHBvaW50O1xyXG4gICAgdGhpcy5faW5pdGlhbGl6ZVNlcnZpY2VzKGVuZHBvaW50KTtcclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuZGVzY3JpYmUgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IHR5cGVzID0gdGhpcy53c2RsLmRlZmluaXRpb25zLnR5cGVzO1xyXG4gICAgcmV0dXJuIHRoaXMud3NkbC5kZXNjcmliZVNlcnZpY2VzKCk7XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLnNldFNlY3VyaXR5ID0gZnVuY3Rpb24oc2VjdXJpdHkpIHtcclxuICAgIHRoaXMuc2VjdXJpdHkgPSBzZWN1cml0eTtcclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuc2V0U09BUEFjdGlvbiA9IGZ1bmN0aW9uKFNPQVBBY3Rpb24pIHtcclxuICAgIHRoaXMuU09BUEFjdGlvbiA9IFNPQVBBY3Rpb247XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLl9pbml0aWFsaXplU2VydmljZXMgPSBmdW5jdGlvbihlbmRwb2ludCkge1xyXG4gICAgY29uc3QgZGVmaW5pdGlvbnMgPSB0aGlzLndzZGwuZGVmaW5pdGlvbnMsXHJcbiAgICAgICAgc2VydmljZXMgPSBkZWZpbml0aW9ucy5zZXJ2aWNlcztcclxuICAgIGZvciAoY29uc3QgbmFtZSBpbiBzZXJ2aWNlcykge1xyXG4gICAgICAgIHRoaXNbbmFtZV0gPSB0aGlzLl9kZWZpbmVTZXJ2aWNlKHNlcnZpY2VzW25hbWVdLCBlbmRwb2ludCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLl9pbml0aWFsaXplT3B0aW9ucyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuc3RyZWFtQWxsb3dlZCA9IG9wdGlvbnMuc3RyZWFtO1xyXG4gICAgdGhpcy5ub3JtYWxpemVOYW1lcyA9IG9wdGlvbnMubm9ybWFsaXplTmFtZXM7XHJcbiAgICB0aGlzLndzZGwub3B0aW9ucy5hdHRyaWJ1dGVzS2V5ID0gb3B0aW9ucy5hdHRyaWJ1dGVzS2V5IHx8ICdhdHRyaWJ1dGVzJztcclxuICAgIHRoaXMud3NkbC5vcHRpb25zLmVudmVsb3BlS2V5ID0gb3B0aW9ucy5lbnZlbG9wZUtleSB8fCAnc29hcCc7XHJcbiAgICB0aGlzLndzZGwub3B0aW9ucy5wcmVzZXJ2ZVdoaXRlc3BhY2UgPSAhIW9wdGlvbnMucHJlc2VydmVXaGl0ZXNwYWNlO1xyXG4gICAgaWYgKG9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmIChvcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzLm92ZXJyaWRlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMub3ZlcnJpZGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzLm5hbWVzcGFjZXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud3NkbC5vcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzID0gb3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcy5uYW1lc3BhY2VzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKG9wdGlvbnMub3ZlcnJpZGVSb290RWxlbWVudCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy53c2RsLm9wdGlvbnMub3ZlcnJpZGVSb290RWxlbWVudCA9IG9wdGlvbnMub3ZlcnJpZGVSb290RWxlbWVudDtcclxuICAgIH1cclxuICAgIHRoaXMud3NkbC5vcHRpb25zLmZvcmNlU29hcDEySGVhZGVycyA9ICEhb3B0aW9ucy5mb3JjZVNvYXAxMkhlYWRlcnM7XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLl9kZWZpbmVTZXJ2aWNlID0gZnVuY3Rpb24oc2VydmljZSwgZW5kcG9pbnQpIHtcclxuICAgIGNvbnN0IHBvcnRzID0gc2VydmljZS5wb3J0cyxcclxuICAgICAgICBkZWYgPSB7fTtcclxuICAgIGZvciAoY29uc3QgbmFtZSBpbiBwb3J0cykge1xyXG4gICAgICAgIGRlZltuYW1lXSA9IHRoaXMuX2RlZmluZVBvcnQocG9ydHNbbmFtZV0sIGVuZHBvaW50ID8gZW5kcG9pbnQgOiBwb3J0c1tuYW1lXS5sb2NhdGlvbik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGVmO1xyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5fZGVmaW5lUG9ydCA9IGZ1bmN0aW9uKHBvcnQsIGVuZHBvaW50KSB7XHJcbiAgICBjb25zdCBsb2NhdGlvbiA9IGVuZHBvaW50LFxyXG4gICAgICAgIGJpbmRpbmcgPSBwb3J0LmJpbmRpbmcsXHJcbiAgICAgICAgbWV0aG9kcyA9IGJpbmRpbmcubWV0aG9kcyxcclxuICAgICAgICBkZWYgPSB7fTtcclxuICAgIGZvciAoY29uc3QgbmFtZSBpbiBtZXRob2RzKSB7XHJcbiAgICAgICAgZGVmW25hbWVdID0gdGhpcy5fZGVmaW5lTWV0aG9kKG1ldGhvZHNbbmFtZV0sIGxvY2F0aW9uKTtcclxuICAgICAgICBjb25zdCBtZXRob2ROYW1lID0gdGhpcy5ub3JtYWxpemVOYW1lcyA/IG5hbWUucmVwbGFjZShub25JZGVudGlmaWVyQ2hhcnMsICdfJykgOiBuYW1lO1xyXG4gICAgICAgIHRoaXNbbWV0aG9kTmFtZV0gPSBkZWZbbmFtZV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGVmO1xyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5fZGVmaW5lTWV0aG9kID0gZnVuY3Rpb24obWV0aG9kLCBsb2NhdGlvbikge1xyXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICBsZXQgdGVtcCA9IG51bGw7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oYXJncywgb3B0aW9ucywgZXh0cmFIZWFkZXJzKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gc2VsZi5faW52b2tlKG1ldGhvZCwgYXJncywgbG9jYXRpb24sIG9wdGlvbnMsIGV4dHJhSGVhZGVycyk7XHJcbiAgICB9O1xyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5faW52b2tlID0gZnVuY3Rpb24obWV0aG9kLCBhcmdzLCBsb2NhdGlvbiwgb3B0aW9ucywgZXh0cmFIZWFkZXJzKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCBzZWxmID0gdGhpcyxcclxuICAgICAgICBuYW1lID0gbWV0aG9kLiRuYW1lLFxyXG4gICAgICAgIGlucHV0ID0gbWV0aG9kLmlucHV0LFxyXG4gICAgICAgIG91dHB1dCA9IG1ldGhvZC5vdXRwdXQsXHJcbiAgICAgICAgc3R5bGUgPSBtZXRob2Quc3R5bGUsXHJcbiAgICAgICAgZGVmcyA9IHRoaXMud3NkbC5kZWZpbml0aW9ucyxcclxuICAgICAgICBlbnZlbG9wZUtleSA9IHRoaXMud3NkbC5vcHRpb25zLmVudmVsb3BlS2V5LFxyXG4gICAgICAgIG5zID0gZGVmcy4kdGFyZ2V0TmFtZXNwYWNlLFxyXG4gICAgICAgIGVuY29kaW5nID0gJycsXHJcbiAgICAgICAgbWVzc2FnZSA9ICcnLFxyXG4gICAgICAgIHhtbCA9IG51bGwsXHJcbiAgICAgICAgcmVxID0gbnVsbCxcclxuICAgICAgICBzb2FwQWN0aW9uID0gbnVsbCxcclxuICAgICAgICBhbGlhcyA9IGZpbmRQcmVmaXgoZGVmcy54bWxucywgbnMpLFxyXG4gICAgICAgIGhlYWRlcnM6IGFueSA9IHtcclxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3htbDsgY2hhcnNldD11dGYtOCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHhtbG5zU29hcCA9ICd4bWxuczonICsgZW52ZWxvcGVLZXkgKyAnPVwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbnZlbG9wZS9cIic7XHJcblxyXG4gICAgaWYgKHRoaXMud3NkbC5vcHRpb25zLmZvcmNlU29hcDEySGVhZGVycykge1xyXG4gICAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL3NvYXAreG1sOyBjaGFyc2V0PXV0Zi04JztcclxuICAgICAgICB4bWxuc1NvYXAgPSAneG1sbnM6JyArIGVudmVsb3BlS2V5ICsgJz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDMvMDUvc29hcC1lbnZlbG9wZVwiJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5TT0FQQWN0aW9uKSB7XHJcbiAgICAgICAgc29hcEFjdGlvbiA9IHRoaXMuU09BUEFjdGlvbjtcclxuICAgIH0gZWxzZSBpZiAobWV0aG9kLnNvYXBBY3Rpb24gIT09IHVuZGVmaW5lZCAmJiBtZXRob2Quc29hcEFjdGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICAgIHNvYXBBY3Rpb24gPSBtZXRob2Quc29hcEFjdGlvbjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc29hcEFjdGlvbiA9IChucy5sYXN0SW5kZXhPZignLycpICE9PSBucy5sZW5ndGggLSAxID8gbnMgKyAnLycgOiBucykgKyBuYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghdGhpcy53c2RsLm9wdGlvbnMuZm9yY2VTb2FwMTJIZWFkZXJzKSB7XHJcbiAgICAgICAgaGVhZGVycy5TT0FQQWN0aW9uID0gJ1wiJyArIHNvYXBBY3Rpb24gKyAnXCInO1xyXG4gICAgfVxyXG5cclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAgIC8vQWRkIGV4dHJhIGhlYWRlcnNcclxuICAgIGZvciAoY29uc3QgaGVhZGVyIGluIHRoaXMuaHR0cEhlYWRlcnMpIHtcclxuICAgICAgICBoZWFkZXJzW2hlYWRlcl0gPSB0aGlzLmh0dHBIZWFkZXJzW2hlYWRlcl07XHJcbiAgICB9XHJcbiAgICBmb3IgKGNvbnN0IGF0dHIgaW4gZXh0cmFIZWFkZXJzKSB7XHJcbiAgICAgICAgaGVhZGVyc1thdHRyXSA9IGV4dHJhSGVhZGVyc1thdHRyXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBBbGxvdyB0aGUgc2VjdXJpdHkgb2JqZWN0IHRvIGFkZCBoZWFkZXJzXHJcbiAgICBpZiAoc2VsZi5zZWN1cml0eSAmJiBzZWxmLnNlY3VyaXR5LmFkZEhlYWRlcnMpIHNlbGYuc2VjdXJpdHkuYWRkSGVhZGVycyhoZWFkZXJzKTtcclxuICAgIGlmIChzZWxmLnNlY3VyaXR5ICYmIHNlbGYuc2VjdXJpdHkuYWRkT3B0aW9ucykgc2VsZi5zZWN1cml0eS5hZGRPcHRpb25zKG9wdGlvbnMpO1xyXG5cclxuICAgIGlmIChzdHlsZSA9PT0gJ3JwYycgJiYgKGlucHV0LnBhcnRzIHx8IGlucHV0Lm5hbWUgPT09ICdlbGVtZW50JyB8fCBhcmdzID09PSBudWxsKSkge1xyXG4gICAgICAgIGFzc2VydC5vayghc3R5bGUgfHwgc3R5bGUgPT09ICdycGMnLCAnaW52YWxpZCBtZXNzYWdlIGRlZmluaXRpb24gZm9yIGRvY3VtZW50IHN0eWxlIGJpbmRpbmcnKTtcclxuICAgICAgICBtZXNzYWdlID0gc2VsZi53c2RsLm9iamVjdFRvUnBjWE1MKG5hbWUsIGFyZ3MsIGFsaWFzLCBucywgaW5wdXQubmFtZSAhPT0gJ2VsZW1lbnQnKTtcclxuICAgICAgICBtZXRob2QuaW5wdXRTb2FwID09PSAnZW5jb2RlZCcgJiYgKGVuY29kaW5nID0gJ3NvYXA6ZW5jb2RpbmdTdHlsZT1cImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3NvYXAvZW5jb2RpbmcvXCIgJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFzc2VydC5vayghc3R5bGUgfHwgc3R5bGUgPT09ICdkb2N1bWVudCcsICdpbnZhbGlkIG1lc3NhZ2UgZGVmaW5pdGlvbiBmb3IgcnBjIHN0eWxlIGJpbmRpbmcnKTtcclxuICAgICAgICAvLyBwYXNzIGBpbnB1dC4kbG9va3VwVHlwZWAgaWYgYGlucHV0LiR0eXBlYCBjb3VsZCBub3QgYmUgZm91bmRcclxuICAgICAgICBtZXNzYWdlID0gc2VsZi53c2RsLm9iamVjdFRvRG9jdW1lbnRYTUwoaW5wdXQuJG5hbWUsIGFyZ3MsIGlucHV0LnRhcmdldE5TQWxpYXMsIGlucHV0LnRhcmdldE5hbWVzcGFjZSwgaW5wdXQuJHR5cGUgfHwgaW5wdXQuJGxvb2t1cFR5cGUpO1xyXG4gICAgfVxyXG4gICAgeG1sID1cclxuICAgICAgICAnPD94bWwgdmVyc2lvbj1cIjEuMFwiIGVuY29kaW5nPVwidXRmLThcIj8+JyArXHJcbiAgICAgICAgJzwnICtcclxuICAgICAgICBlbnZlbG9wZUtleSArXHJcbiAgICAgICAgJzpFbnZlbG9wZSAnICtcclxuICAgICAgICB4bWxuc1NvYXAgK1xyXG4gICAgICAgICcgJyArXHJcbiAgICAgICAgJ3htbG5zOnhzaT1cImh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlXCIgJyArXHJcbiAgICAgICAgZW5jb2RpbmcgK1xyXG4gICAgICAgIHRoaXMud3NkbC54bWxuc0luRW52ZWxvcGUgK1xyXG4gICAgICAgICc+JyArXHJcbiAgICAgICAgKHNlbGYuc29hcEhlYWRlcnMgfHwgc2VsZi5zZWN1cml0eVxyXG4gICAgICAgICAgICA/ICc8JyArXHJcbiAgICAgICAgICAgICAgZW52ZWxvcGVLZXkgK1xyXG4gICAgICAgICAgICAgICc6SGVhZGVyPicgK1xyXG4gICAgICAgICAgICAgIChzZWxmLnNvYXBIZWFkZXJzID8gc2VsZi5zb2FwSGVhZGVycy5qb2luKCdcXG4nKSA6ICcnKSArXHJcbiAgICAgICAgICAgICAgKHNlbGYuc2VjdXJpdHkgJiYgIXNlbGYuc2VjdXJpdHkucG9zdFByb2Nlc3MgPyBzZWxmLnNlY3VyaXR5LnRvWE1MKCkgOiAnJykgK1xyXG4gICAgICAgICAgICAgICc8LycgK1xyXG4gICAgICAgICAgICAgIGVudmVsb3BlS2V5ICtcclxuICAgICAgICAgICAgICAnOkhlYWRlcj4nXHJcbiAgICAgICAgICAgIDogJycpICtcclxuICAgICAgICAnPCcgK1xyXG4gICAgICAgIGVudmVsb3BlS2V5ICtcclxuICAgICAgICAnOkJvZHknICtcclxuICAgICAgICAoc2VsZi5ib2R5QXR0cmlidXRlcyA/IHNlbGYuYm9keUF0dHJpYnV0ZXMuam9pbignICcpIDogJycpICtcclxuICAgICAgICAoc2VsZi5zZWN1cml0eSAmJiBzZWxmLnNlY3VyaXR5LnBvc3RQcm9jZXNzID8gJyBJZD1cIl8wXCInIDogJycpICtcclxuICAgICAgICAnPicgK1xyXG4gICAgICAgIG1lc3NhZ2UgK1xyXG4gICAgICAgICc8LycgK1xyXG4gICAgICAgIGVudmVsb3BlS2V5ICtcclxuICAgICAgICAnOkJvZHk+JyArXHJcbiAgICAgICAgJzwvJyArXHJcbiAgICAgICAgZW52ZWxvcGVLZXkgK1xyXG4gICAgICAgICc6RW52ZWxvcGU+JztcclxuXHJcbiAgICBpZiAoc2VsZi5zZWN1cml0eSAmJiBzZWxmLnNlY3VyaXR5LnBvc3RQcm9jZXNzKSB7XHJcbiAgICAgICAgeG1sID0gc2VsZi5zZWN1cml0eS5wb3N0UHJvY2Vzcyh4bWwsIGVudmVsb3BlS2V5KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnBvc3RQcm9jZXNzKSB7XHJcbiAgICAgICAgeG1sID0gb3B0aW9ucy5wb3N0UHJvY2Vzcyh4bWwpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYubGFzdE1lc3NhZ2UgPSBtZXNzYWdlO1xyXG4gICAgc2VsZi5sYXN0UmVxdWVzdCA9IHhtbDtcclxuICAgIHNlbGYubGFzdEVuZHBvaW50ID0gbG9jYXRpb247XHJcblxyXG4gICAgY29uc3QgdHJ5SlNPTnBhcnNlID0gZnVuY3Rpb24oYm9keSkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKGJvZHkpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGZyb20oU29hcEF0dGFjaG1lbnQuZnJvbUZvcm1GaWxlcyhvcHRpb25zLmF0dGFjaG1lbnRzKSkucGlwZShcclxuICAgICAgICBtYXAoKHNvYXBBdHRhY2htZW50czogU29hcEF0dGFjaG1lbnRbXSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXNvYXBBdHRhY2htZW50cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB4bWw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmZvcmNlTVRPTSB8fCBzb2FwQXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSB1dWlkNCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYm91bmRyeSA9IHV1aWQ0KCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYWN0aW9uID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmIChoZWFkZXJzWydDb250ZW50LVR5cGUnXS5pbmRleE9mKCdhY3Rpb24nKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBjdCBvZiBoZWFkZXJzWydDb250ZW50LVR5cGUnXS5zcGxpdCgnOyAnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3QuaW5kZXhPZignYWN0aW9uJykgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uID0gY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPVxyXG4gICAgICAgICAgICAgICAgICAgICdtdWx0aXBhcnQvcmVsYXRlZDsgdHlwZT1cImFwcGxpY2F0aW9uL3hvcCt4bWxcIjsgc3RhcnQ9XCI8JyArIHN0YXJ0ICsgJz5cIjsgc3RhcnQtaW5mbz1cInRleHQveG1sXCI7IGJvdW5kYXJ5PVwiJyArIGJvdW5kcnkgKyAnXCInO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gaGVhZGVyc1snQ29udGVudC1UeXBlJ10gKyAnOyAnICsgYWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IG11bHRpcGFydDogYW55W10gPSBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3hvcCt4bWw7IGNoYXJzZXQ9VVRGLTg7IHR5cGU9XCJ0ZXh0L3htbFwiJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtSUQnOiAnPCcgKyBzdGFydCArICc+JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9keTogeG1sXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgICAgICBzb2FwQXR0YWNobWVudHMuZm9yRWFjaCgoYXR0YWNobWVudDogU29hcEF0dGFjaG1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBtdWx0aXBhcnQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiBhdHRhY2htZW50Lm1pbWV0eXBlICsgJzsnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UcmFuc2Zlci1FbmNvZGluZyc6ICdiaW5hcnknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1JRCc6ICc8JyArIChhdHRhY2htZW50LmNvbnRlbnRJZCB8fCBhdHRhY2htZW50Lm5hbWUpICsgJz4nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1EaXNwb3NpdGlvbic6ICdhdHRhY2htZW50OyBuYW1lPVwiJyArIGF0dGFjaG1lbnQubmFtZSArICdcIjsgZmlsZW5hbWU9XCInICsgYXR0YWNobWVudC5uYW1lICsgJ1wiJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9keTogYXR0YWNobWVudC5ib2R5XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IE11bHRpcGFydCgpLmJ1aWxkKG11bHRpcGFydCwgYm91bmRyeSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuICAgICAgICBmbGF0TWFwKChib2R5OiBhbnkpID0+XHJcbiAgICAgICAgICAgICg8SHR0cENsaWVudD5zZWxmLmh0dHBDbGllbnQpXHJcbiAgICAgICAgICAgICAgICAucG9zdChsb2NhdGlvbiwgYm9keSwge1xyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VUeXBlOiAndGV4dCcsXHJcbiAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZTogJ3Jlc3BvbnNlJ1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5waXBlKFxyXG4gICAgICAgICAgICAgICAgICAgIG1hcCgocmVzcG9uc2U6IEh0dHBSZXNwb25zZTxhbnk+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubGFzdFJlc3BvbnNlID0gcmVzcG9uc2UuYm9keTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sYXN0UmVzcG9uc2VIZWFkZXJzID0gcmVzcG9uc2UgJiYgcmVzcG9uc2UuaGVhZGVycztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlU3luYyhyZXNwb25zZS5ib2R5LCByZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICApXHJcbiAgICApO1xyXG5cclxuICAgIGZ1bmN0aW9uIHBhcnNlU3luYyhib2R5LCByZXNwb25zZTogSHR0cFJlc3BvbnNlPGFueT4pIHtcclxuICAgICAgICBsZXQgb2JqO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIG9iaiA9IHNlbGYud3NkbC54bWxUb09iamVjdChib2R5KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAvLyAgV2hlbiB0aGUgb3V0cHV0IGVsZW1lbnQgY2Fubm90IGJlIGxvb2tlZCB1cCBpbiB0aGUgd3NkbCBhbmQgdGhlIGJvZHkgaXMgSlNPTlxyXG4gICAgICAgICAgICAvLyAgaW5zdGVhZCBvZiBzZW5kaW5nIHRoZSBlcnJvciwgd2UgcGFzcyB0aGUgYm9keSBpbiB0aGUgcmVzcG9uc2UuXHJcbiAgICAgICAgICAgIGlmICghb3V0cHV0IHx8ICFvdXRwdXQuJGxvb2t1cFR5cGVzKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBkZWJ1ZygnUmVzcG9uc2UgZWxlbWVudCBpcyBub3QgcHJlc2VudC4gVW5hYmxlIHRvIGNvbnZlcnQgcmVzcG9uc2UgeG1sIHRvIGpzb24uJyk7XHJcbiAgICAgICAgICAgICAgICAvLyAgSWYgdGhlIHJlc3BvbnNlIGlzIEpTT04gdGhlbiByZXR1cm4gaXQgYXMtaXMuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBqc29uID0gXy5pc09iamVjdChib2R5KSA/IGJvZHkgOiB0cnlKU09OcGFyc2UoYm9keSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoanNvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGVycjogbnVsbCwgcmVzcG9uc2UsIHJlc3BvbnNlQm9keToganNvbiwgaGVhZGVyOiB1bmRlZmluZWQsIHhtbCB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVycm9yLnJlc3BvbnNlID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgIGVycm9yLmJvZHkgPSBib2R5O1xyXG4gICAgICAgICAgICAvLyBzZWxmLmVtaXQoJ3NvYXBFcnJvcicsIGVycm9yLCBlaWQpO1xyXG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZpbmlzaChvYmosIGJvZHksIHJlc3BvbnNlKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBmaW5pc2gob2JqLCByZXNwb25zZUJvZHksIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmICghb3V0cHV0KSB7XHJcbiAgICAgICAgICAgIC8vIG9uZS13YXksIG5vIG91dHB1dCBleHBlY3RlZFxyXG4gICAgICAgICAgICByZXR1cm4geyBlcnI6IG51bGwsIHJlc3BvbnNlOiBudWxsLCByZXNwb25zZUJvZHksIGhlYWRlcjogb2JqLkhlYWRlciwgeG1sIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJZiBpdCdzIG5vdCBIVE1MIGFuZCBTb2FwIEJvZHkgaXMgZW1wdHlcclxuICAgICAgICBpZiAoIW9iai5odG1sICYmICFvYmouQm9keSkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBlcnI6IG51bGwsIG9iaiwgcmVzcG9uc2VCb2R5LCBoZWFkZXI6IG9iai5IZWFkZXIsIHhtbCB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBvYmouQm9keSAhPT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgY29uc3QgZXJyb3I6IGFueSA9IG5ldyBFcnJvcignQ2Fubm90IHBhcnNlIHJlc3BvbnNlJyk7XHJcbiAgICAgICAgICAgIGVycm9yLnJlc3BvbnNlID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgIGVycm9yLmJvZHkgPSByZXNwb25zZUJvZHk7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGVycjogZXJyb3IsIG9iaiwgcmVzcG9uc2VCb2R5LCBoZWFkZXI6IHVuZGVmaW5lZCwgeG1sIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXN1bHQgPSBvYmouQm9keVtvdXRwdXQuJG5hbWVdO1xyXG4gICAgICAgIC8vIFJQQy9saXRlcmFsIHJlc3BvbnNlIGJvZHkgbWF5IGNvbnRhaW4gZWxlbWVudHMgd2l0aCBhZGRlZCBzdWZmaXhlcyBJLkUuXHJcbiAgICAgICAgLy8gJ1Jlc3BvbnNlJywgb3IgJ091dHB1dCcsIG9yICdPdXQnXHJcbiAgICAgICAgLy8gVGhpcyBkb2Vzbid0IG5lY2Vzc2FyaWx5IGVxdWFsIHRoZSBvdXB1dCBtZXNzYWdlIG5hbWUuIFNlZSBXU0RMIDEuMSBTZWN0aW9uIDIuNC41XHJcbiAgICAgICAgaWYgKCFyZXN1bHQpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gb2JqLkJvZHlbb3V0cHV0LiRuYW1lLnJlcGxhY2UoLyg/Ok91dCg/OnB1dCk/fFJlc3BvbnNlKSQvLCAnJyldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICAgICAgICBbJ1Jlc3BvbnNlJywgJ091dCcsICdPdXRwdXQnXS5mb3JFYWNoKGZ1bmN0aW9uKHRlcm0pIHtcclxuICAgICAgICAgICAgICAgIGlmIChvYmouQm9keS5oYXNPd25Qcm9wZXJ0eShuYW1lICsgdGVybSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKHJlc3VsdCA9IG9iai5Cb2R5W25hbWUgKyB0ZXJtXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHsgZXJyOiBudWxsLCByZXN1bHQsIHJlc3BvbnNlQm9keSwgaGVhZGVyOiBvYmouSGVhZGVyLCB4bWwgfTtcclxuICAgIH1cclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuY2FsbCA9IGZ1bmN0aW9uKG1ldGhvZDogc3RyaW5nLCBib2R5OiBhbnksIG9wdGlvbnM/OiBhbnksIGV4dHJhSGVhZGVycz86IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBpZiAoIXRoaXNbbWV0aG9kXSkge1xyXG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGBNZXRob2QgJHttZXRob2R9IG5vdCBmb3VuZGApO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAoPEZ1bmN0aW9uPnRoaXNbbWV0aG9kXSkuY2FsbCh0aGlzLCBib2R5LCBvcHRpb25zLCBleHRyYUhlYWRlcnMpO1xyXG59O1xyXG4iXX0=