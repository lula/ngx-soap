/*
 * Copyright (c) 2011 Vinay Pulim <vinay@milewise.com>
 * MIT Licensed
 */
import { __values } from "tslib";
import * as assert from 'assert';
import { findPrefix } from './utils';
import * as _ from 'lodash';
import uuid4 from 'uuid/v4';
import { from, throwError } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { Multipart } from './multipart';
import { SoapAttachment } from './soapAttachment';
var nonIdentifierChars = /[^a-z$_0-9]/i;
export var Client = function (wsdl, endpoint, options) {
    options = options || {};
    this.wsdl = wsdl;
    this._initializeOptions(options);
    this._initializeServices(endpoint);
    this.httpClient = options.httpClient;
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
    var definitions = this.wsdl.definitions, services = definitions.services;
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
    var ports = service.ports, def = {};
    for (var name_2 in ports) {
        def[name_2] = this._definePort(ports[name_2], endpoint ? endpoint : ports[name_2].location);
    }
    return def;
};
Client.prototype._definePort = function (port, endpoint) {
    var location = endpoint, binding = port.binding, methods = binding.methods, def = {};
    for (var name_3 in methods) {
        def[name_3] = this._defineMethod(methods[name_3], location);
        var methodName = this.normalizeNames ? name_3.replace(nonIdentifierChars, '_') : name_3;
        this[methodName] = def[name_3];
    }
    return def;
};
Client.prototype._defineMethod = function (method, location) {
    var self = this;
    var temp = null;
    return function (args, options, extraHeaders) {
        return self._invoke(method, args, location, options, extraHeaders);
    };
};
Client.prototype._invoke = function (method, args, location, options, extraHeaders) {
    var self = this, name = method.$name, input = method.input, output = method.output, style = method.style, defs = this.wsdl.definitions, envelopeKey = this.wsdl.options.envelopeKey, ns = defs.$targetNamespace, encoding = '', message = '', xml = null, req = null, soapAction = null, alias = findPrefix(defs.xmlns, ns), headers = {
        'Content-Type': 'text/xml; charset=utf-8'
    }, xmlnsSoap = 'xmlns:' + envelopeKey + '="http://schemas.xmlsoap.org/soap/envelope/"';
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
            var start = uuid4();
            var boundry = uuid4();
            var action = null;
            if (headers['Content-Type'].indexOf('action') > -1) {
                try {
                    for (var _b = __values(headers['Content-Type'].split('; ')), _c = _b.next(); !_c.done; _c = _b.next()) {
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
        return self.httpClient
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
    function parseSync(body, response) {
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
    function finish(obj, responseBody, response) {
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
    return this[method].call(this, body, options, extraHeaders);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXNvYXAvIiwic291cmNlcyI6WyJsaWIvc29hcC9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOztBQUdILE9BQU8sS0FBSyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQ2pDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDckMsT0FBTyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxLQUFLLE1BQU0sU0FBUyxDQUFDO0FBQzVCLE9BQU8sRUFBRSxJQUFJLEVBQWMsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3BELE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN4QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFbEQsSUFBTSxrQkFBa0IsR0FBRyxjQUFjLENBQUM7QUFFMUMsTUFBTSxDQUFDLElBQU0sTUFBTSxHQUFHLFVBQVMsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPO0lBQ2xELE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO0lBQ3hCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ2pCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBd0IsQ0FBQztJQUNuRCxJQUFNLGNBQWMsR0FBUSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUNoRCxJQUFJLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRTtRQUMvQixjQUFjLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQztLQUN6RDtJ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TyxVQUFVLENBQUMsWUFBVSxNQUFNLGVBQVksQ0FBQyxDQUFDO0tBQ25EO0lBRUQsT0FBa0IsSUFBSSxDQUFDLE1BQU0sQ0FBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztBQUM1RSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTEgVmluYXkgUHVsaW0gPHZpbmF5QG1pbGV3aXNlLmNvbT5cclxuICogTUlUIExpY2Vuc2VkXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cFJlc3BvbnNlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgKiBhcyBhc3NlcnQgZnJvbSAnYXNzZXJ0JztcclxuaW1wb3J0IHsgZmluZFByZWZpeCB9IGZyb20gJy4vdXRpbHMnO1xyXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB1dWlkNCBmcm9tICd1dWlkL3Y0JztcclxuaW1wb3J0IHsgZnJvbSwgT2JzZXJ2YWJsZSwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBmbGF0TWFwLCBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IE11bHRpcGFydCB9IGZyb20gJy4vbXVsdGlwYXJ0JztcclxuaW1wb3J0IHsgU29hcEF0dGFjaG1lbnQgfSBmcm9tICcuL3NvYXBBdHRhY2htZW50JztcclxuXHJcbmNvbnN0IG5vbklkZW50aWZpZXJDaGFycyA9IC9bXmEteiRfMC05XS9pO1xyXG5cclxuZXhwb3J0IGNvbnN0IENsaWVudCA9IGZ1bmN0aW9uKHdzZGwsIGVuZHBvaW50LCBvcHRpb25zKSB7XHJcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgIHRoaXMud3NkbCA9IHdzZGw7XHJcbiAgICB0aGlzLl9pbml0aWFsaXplT3B0aW9ucyhvcHRpb25zKTtcclxuICAgIHRoaXMuX2luaXRpYWxpemVTZXJ2aWNlcyhlbmRwb2ludCk7XHJcbiAgICB0aGlzLmh0dHBDbGllbnQgPSBvcHRpb25zLmh0dHBDbGllbnQgYXMgSHR0cENsaWVudDtcclxuICAgIGNvbnN0IHByb21pc2VPcHRpb25zOiBhbnkgPSB7IG11bHRpQXJnczogdHJ1ZSB9O1xyXG4gICAgaWYgKG9wdGlvbnMub3ZlcnJpZGVQcm9taXNlU3VmZml4KSB7XHJcbiAgICAgICAgcHJvbWlzZU9wdGlvbnMuc3VmZml4ID0gb3B0aW9ucy5vdmVycmlkZVByb21pc2VTdWZmaXg7XHJcbiAgICB9XHJcbiAgICBQcm9taXNlLmFsbChbdGhpcywgcHJvbWlzZU9wdGlvbnNdKTtcclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuYWRkU29hcEhlYWRlciA9IGZ1bmN0aW9uKHNvYXBIZWFkZXIsIG5hbWUsIG5hbWVzcGFjZSwgeG1sbnMpIHtcclxuICAgIGlmICghdGhpcy5zb2FwSGVhZGVycykge1xyXG4gICAgICAgIHRoaXMuc29hcEhlYWRlcnMgPSBbXTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2Ygc29hcEhlYWRlciA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICBzb2FwSGVhZGVyID0gdGhpcy53c2RsLm9iamVjdFRvWE1MKHNvYXBIZWFkZXIsIG5hbWUsIG5hbWVzcGFjZSwgeG1sbnMsIHRydWUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuc29hcEhlYWRlcnMucHVzaChzb2FwSGVhZGVyKSAtIDE7XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLmNoYW5nZVNvYXBIZWFkZXIgPSBmdW5jdGlvbihpbmRleCwgc29hcEhlYWRlciwgbmFtZSwgbmFtZXNwYWNlLCB4bWxucykge1xyXG4gICAgaWYgKCF0aGlzLnNvYXBIZWFkZXJzKSB7XHJcbiAgICAgICAgdGhpcy5zb2FwSGVhZGVycyA9IFtdO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBzb2FwSGVhZGVyID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIHNvYXBIZWFkZXIgPSB0aGlzLndzZGwub2JqZWN0VG9YTUwoc29hcEhlYWRlciwgbmFtZSwgbmFtZXNwYWNlLCB4bWxucywgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnNvYXBIZWFkZXJzW2luZGV4XSA9IHNvYXBIZWFkZXI7XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLmdldFNvYXBIZWFkZXJzID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zb2FwSGVhZGVycztcclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuY2xlYXJTb2FwSGVhZGVycyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5zb2FwSGVhZGVycyA9IG51bGw7XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLmFkZEh0dHBIZWFkZXIgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xyXG4gICAgaWYgKCF0aGlzLmh0dHBIZWFkZXJzKSB7XHJcbiAgICAgICAgdGhpcy5odHRwSGVhZGVycyA9IHt9O1xyXG4gICAgfVxyXG4gICAgdGhpcy5odHRwSGVhZGVyc1tuYW1lXSA9IHZhbHVlO1xyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5nZXRIdHRwSGVhZGVycyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cEhlYWRlcnM7XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLmNsZWFySHR0cEhlYWRlcnMgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuaHR0cEhlYWRlcnMgPSB7fTtcclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuYWRkQm9keUF0dHJpYnV0ZSA9IGZ1bmN0aW9uKGJvZHlBdHRyaWJ1dGUsIG5hbWUsIG5hbWVzcGFjZSwgeG1sbnMpIHtcclxuICAgIGlmICghdGhpcy5ib2R5QXR0cmlidXRlcykge1xyXG4gICAgICAgIHRoaXMuYm9keUF0dHJpYnV0ZXMgPSBbXTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgYm9keUF0dHJpYnV0ZSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICBsZXQgY29tcG9zaXRpb24gPSAnJztcclxuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhib2R5QXR0cmlidXRlKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3AsIGlkeCwgYXJyYXkpIHtcclxuICAgICAgICAgICAgY29tcG9zaXRpb24gKz0gJyAnICsgcHJvcCArICc9XCInICsgYm9keUF0dHJpYnV0ZVtwcm9wXSArICdcIic7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYm9keUF0dHJpYnV0ZSA9IGNvbXBvc2l0aW9uO1xyXG4gICAgfVxyXG4gICAgaWYgKGJvZHlBdHRyaWJ1dGUuc3Vic3RyKDAsIDEpICE9PSAnICcpIGJvZHlBdHRyaWJ1dGUgPSAnICcgKyBib2R5QXR0cmlidXRlO1xyXG4gICAgdGhpcy5ib2R5QXR0cmlidXRlcy5wdXNoKGJvZHlBdHRyaWJ1dGUpO1xyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5nZXRCb2R5QXR0cmlidXRlcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYm9keUF0dHJpYnV0ZXM7XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLmNsZWFyQm9keUF0dHJpYnV0ZXMgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuYm9keUF0dHJpYnV0ZXMgPSBudWxsO1xyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5zZXRFbmRwb2ludCA9IGZ1bmN0aW9uKGVuZHBvaW50KSB7XHJcbiAgICB0aGlzLmVuZHBvaW50ID0gZW5kcG9pbnQ7XHJcbiAgICB0aGlzLl9pbml0aWFsaXplU2VydmljZXMoZW5kcG9pbnQpO1xyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5kZXNjcmliZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgdHlwZXMgPSB0aGlzLndzZGwuZGVmaW5pdGlvbnMudHlwZXM7XHJcbiAgICByZXR1cm4gdGhpcy53c2RsLmRlc2NyaWJlU2VydmljZXMoKTtcclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuc2V0U2VjdXJpdHkgPSBmdW5jdGlvbihzZWN1cml0eSkge1xyXG4gICAgdGhpcy5zZWN1cml0eSA9IHNlY3VyaXR5O1xyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5zZXRTT0FQQWN0aW9uID0gZnVuY3Rpb24oU09BUEFjdGlvbikge1xyXG4gICAgdGhpcy5TT0FQQWN0aW9uID0gU09BUEFjdGlvbjtcclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuX2luaXRpYWxpemVTZXJ2aWNlcyA9IGZ1bmN0aW9uKGVuZHBvaW50KSB7XHJcbiAgICBjb25zdCBkZWZpbml0aW9ucyA9IHRoaXMud3NkbC5kZWZpbml0aW9ucyxcclxuICAgICAgICBzZXJ2aWNlcyA9IGRlZmluaXRpb25zLnNlcnZpY2VzO1xyXG4gICAgZm9yIChjb25zdCBuYW1lIGluIHNlcnZpY2VzKSB7XHJcbiAgICAgICAgdGhpc1tuYW1lXSA9IHRoaXMuX2RlZmluZVNlcnZpY2Uoc2VydmljZXNbbmFtZV0sIGVuZHBvaW50KTtcclxuICAgIH1cclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuX2luaXRpYWxpemVPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG4gICAgdGhpcy5zdHJlYW1BbGxvd2VkID0gb3B0aW9ucy5zdHJlYW07XHJcbiAgICB0aGlzLm5vcm1hbGl6ZU5hbWVzID0gb3B0aW9ucy5ub3JtYWxpemVOYW1lcztcclxuICAgIHRoaXMud3NkbC5vcHRpb25zLmF0dHJpYnV0ZXNLZXkgPSBvcHRpb25zLmF0dHJpYnV0ZXNLZXkgfHwgJ2F0dHJpYnV0ZXMnO1xyXG4gICAgdGhpcy53c2RsLm9wdGlvbnMuZW52ZWxvcGVLZXkgPSBvcHRpb25zLmVudmVsb3BlS2V5IHx8ICdzb2FwJztcclxuICAgIHRoaXMud3NkbC5vcHRpb25zLnByZXNlcnZlV2hpdGVzcGFjZSA9ICEhb3B0aW9ucy5wcmVzZXJ2ZVdoaXRlc3BhY2U7XHJcbiAgICBpZiAob3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMub3ZlcnJpZGUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcy5vdmVycmlkZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMubmFtZXNwYWNlcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53c2RsLm9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMgPSBvcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzLm5hbWVzcGFjZXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAob3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLndzZGwub3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50ID0gb3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50O1xyXG4gICAgfVxyXG4gICAgdGhpcy53c2RsLm9wdGlvbnMuZm9yY2VTb2FwMTJIZWFkZXJzID0gISFvcHRpb25zLmZvcmNlU29hcDEySGVhZGVycztcclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuX2RlZmluZVNlcnZpY2UgPSBmdW5jdGlvbihzZXJ2aWNlLCBlbmRwb2ludCkge1xyXG4gICAgY29uc3QgcG9ydHMgPSBzZXJ2aWNlLnBvcnRzLFxyXG4gICAgICAgIGRlZiA9IHt9O1xyXG4gICAgZm9yIChjb25zdCBuYW1lIGluIHBvcnRzKSB7XHJcbiAgICAgICAgZGVmW25hbWVdID0gdGhpcy5fZGVmaW5lUG9ydChwb3J0c1tuYW1lXSwgZW5kcG9pbnQgPyBlbmRwb2ludCA6IHBvcnRzW25hbWVdLmxvY2F0aW9uKTtcclxuICAgIH1cclxuICAgIHJldHVybiBkZWY7XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLl9kZWZpbmVQb3J0ID0gZnVuY3Rpb24ocG9ydCwgZW5kcG9pbnQpIHtcclxuICAgIGNvbnN0IGxvY2F0aW9uID0gZW5kcG9pbnQsXHJcbiAgICAgICAgYmluZGluZyA9IHBvcnQuYmluZGluZyxcclxuICAgICAgICBtZXRob2RzID0gYmluZGluZy5tZXRob2RzLFxyXG4gICAgICAgIGRlZiA9IHt9O1xyXG4gICAgZm9yIChjb25zdCBuYW1lIGluIG1ldGhvZHMpIHtcclxuICAgICAgICBkZWZbbmFtZV0gPSB0aGlzLl9kZWZpbmVNZXRob2QobWV0aG9kc1tuYW1lXSwgbG9jYXRpb24pO1xyXG4gICAgICAgIGNvbnN0IG1ldGhvZE5hbWUgPSB0aGlzLm5vcm1hbGl6ZU5hbWVzID8gbmFtZS5yZXBsYWNlKG5vbklkZW50aWZpZXJDaGFycywgJ18nKSA6IG5hbWU7XHJcbiAgICAgICAgdGhpc1ttZXRob2ROYW1lXSA9IGRlZltuYW1lXTtcclxuICAgIH1cclxuICAgIHJldHVybiBkZWY7XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLl9kZWZpbmVNZXRob2QgPSBmdW5jdGlvbihtZXRob2QsIGxvY2F0aW9uKSB7XHJcbiAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgIGxldCB0ZW1wID0gbnVsbDtcclxuICAgIHJldHVybiBmdW5jdGlvbihhcmdzLCBvcHRpb25zLCBleHRyYUhlYWRlcnMpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBzZWxmLl9pbnZva2UobWV0aG9kLCBhcmdzLCBsb2NhdGlvbiwgb3B0aW9ucywgZXh0cmFIZWFkZXJzKTtcclxuICAgIH07XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLl9pbnZva2UgPSBmdW5jdGlvbihtZXRob2QsIGFyZ3MsIGxvY2F0aW9uLCBvcHRpb25zLCBleHRyYUhlYWRlcnMpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHNlbGYgPSB0aGlzLFxyXG4gICAgICAgIG5hbWUgPSBtZXRob2QuJG5hbWUsXHJcbiAgICAgICAgaW5wdXQgPSBtZXRob2QuaW5wdXQsXHJcbiAgICAgICAgb3V0cHV0ID0gbWV0aG9kLm91dHB1dCxcclxuICAgICAgICBzdHlsZSA9IG1ldGhvZC5zdHlsZSxcclxuICAgICAgICBkZWZzID0gdGhpcy53c2RsLmRlZmluaXRpb25zLFxyXG4gICAgICAgIGVudmVsb3BlS2V5ID0gdGhpcy53c2RsLm9wdGlvbnMuZW52ZWxvcGVLZXksXHJcbiAgICAgICAgbnMgPSBkZWZzLiR0YXJnZXROYW1lc3BhY2UsXHJcbiAgICAgICAgZW5jb2RpbmcgPSAnJyxcclxuICAgICAgICBtZXNzYWdlID0gJycsXHJcbiAgICAgICAgeG1sID0gbnVsbCxcclxuICAgICAgICByZXEgPSBudWxsLFxyXG4gICAgICAgIHNvYXBBY3Rpb24gPSBudWxsLFxyXG4gICAgICAgIGFsaWFzID0gZmluZFByZWZpeChkZWZzLnhtbG5zLCBucyksXHJcbiAgICAgICAgaGVhZGVyczogYW55ID0ge1xyXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ3RleHQveG1sOyBjaGFyc2V0PXV0Zi04J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgeG1sbnNTb2FwID0gJ3htbG5zOicgKyBlbnZlbG9wZUtleSArICc9XCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy9zb2FwL2VudmVsb3BlL1wiJztcclxuXHJcbiAgICBpZiAodGhpcy53c2RsLm9wdGlvbnMuZm9yY2VTb2FwMTJIZWFkZXJzKSB7XHJcbiAgICAgICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24vc29hcCt4bWw7IGNoYXJzZXQ9dXRmLTgnO1xyXG4gICAgICAgIHhtbG5zU29hcCA9ICd4bWxuczonICsgZW52ZWxvcGVLZXkgKyAnPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMy8wNS9zb2FwLWVudmVsb3BlXCInO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLlNPQVBBY3Rpb24pIHtcclxuICAgICAgICBzb2FwQWN0aW9uID0gdGhpcy5TT0FQQWN0aW9uO1xyXG4gICAgfSBlbHNlIGlmIChtZXRob2Quc29hcEFjdGlvbiAhPT0gdW5kZWZpbmVkICYmIG1ldGhvZC5zb2FwQWN0aW9uICE9PSBudWxsKSB7XHJcbiAgICAgICAgc29hcEFjdGlvbiA9IG1ldGhvZC5zb2FwQWN0aW9uO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBzb2FwQWN0aW9uID0gKG5zLmxhc3RJbmRleE9mKCcvJykgIT09IG5zLmxlbmd0aCAtIDEgPyBucyArICcvJyA6IG5zKSArIG5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLndzZGwub3B0aW9ucy5mb3JjZVNvYXAxMkhlYWRlcnMpIHtcclxuICAgICAgICBoZWFkZXJzLlNPQVBBY3Rpb24gPSAnXCInICsgc29hcEFjdGlvbiArICdcIic7XHJcbiAgICB9XHJcblxyXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblxyXG4gICAgLy9BZGQgZXh0cmEgaGVhZGVyc1xyXG4gICAgZm9yIChjb25zdCBoZWFkZXIgaW4gdGhpcy5odHRwSGVhZGVycykge1xyXG4gICAgICAgIGhlYWRlcnNbaGVhZGVyXSA9IHRoaXMuaHR0cEhlYWRlcnNbaGVhZGVyXTtcclxuICAgIH1cclxuICAgIGZvciAoY29uc3QgYXR0ciBpbiBleHRyYUhlYWRlcnMpIHtcclxuICAgICAgICBoZWFkZXJzW2F0dHJdID0gZXh0cmFIZWFkZXJzW2F0dHJdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEFsbG93IHRoZSBzZWN1cml0eSBvYmplY3QgdG8gYWRkIGhlYWRlcnNcclxuICAgIGlmIChzZWxmLnNlY3VyaXR5ICYmIHNlbGYuc2VjdXJpdHkuYWRkSGVhZGVycykgc2VsZi5zZWN1cml0eS5hZGRIZWFkZXJzKGhlYWRlcnMpO1xyXG4gICAgaWYgKHNlbGYuc2VjdXJpdHkgJiYgc2VsZi5zZWN1cml0eS5hZGRPcHRpb25zKSBzZWxmLnNlY3VyaXR5LmFkZE9wdGlvbnMob3B0aW9ucyk7XHJcblxyXG4gICAgaWYgKHN0eWxlID09PSAncnBjJyAmJiAoaW5wdXQucGFydHMgfHwgaW5wdXQubmFtZSA9PT0gJ2VsZW1lbnQnIHx8IGFyZ3MgPT09IG51bGwpKSB7XHJcbiAgICAgICAgYXNzZXJ0Lm9rKCFzdHlsZSB8fCBzdHlsZSA9PT0gJ3JwYycsICdpbnZhbGlkIG1lc3NhZ2UgZGVmaW5pdGlvbiBmb3IgZG9jdW1lbnQgc3R5bGUgYmluZGluZycpO1xyXG4gICAgICAgIG1lc3NhZ2UgPSBzZWxmLndzZGwub2JqZWN0VG9ScGNYTUwobmFtZSwgYXJncywgYWxpYXMsIG5zLCBpbnB1dC5uYW1lICE9PSAnZWxlbWVudCcpO1xyXG4gICAgICAgIG1ldGhvZC5pbnB1dFNvYXAgPT09ICdlbmNvZGVkJyAmJiAoZW5jb2RpbmcgPSAnc29hcDplbmNvZGluZ1N0eWxlPVwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbmNvZGluZy9cIiAnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYXNzZXJ0Lm9rKCFzdHlsZSB8fCBzdHlsZSA9PT0gJ2RvY3VtZW50JywgJ2ludmFsaWQgbWVzc2FnZSBkZWZpbml0aW9uIGZvciBycGMgc3R5bGUgYmluZGluZycpO1xyXG4gICAgICAgIC8vIHBhc3MgYGlucHV0LiRsb29rdXBUeXBlYCBpZiBgaW5wdXQuJHR5cGVgIGNvdWxkIG5vdCBiZSBmb3VuZFxyXG4gICAgICAgIG1lc3NhZ2UgPSBzZWxmLndzZGwub2JqZWN0VG9Eb2N1bWVudFhNTChpbnB1dC4kbmFtZSwgYXJncywgaW5wdXQudGFyZ2V0TlNBbGlhcywgaW5wdXQudGFyZ2V0TmFtZXNwYWNlLCBpbnB1dC4kdHlwZSB8fCBpbnB1dC4kbG9va3VwVHlwZSk7XHJcbiAgICB9XHJcbiAgICB4bWwgPVxyXG4gICAgICAgICc8P3htbCB2ZXJzaW9uPVwiMS4wXCIgZW5jb2Rpbmc9XCJ1dGYtOFwiPz4nICtcclxuICAgICAgICAnPCcgK1xyXG4gICAgICAgIGVudmVsb3BlS2V5ICtcclxuICAgICAgICAnOkVudmVsb3BlICcgK1xyXG4gICAgICAgIHhtbG5zU29hcCArXHJcbiAgICAgICAgJyAnICtcclxuICAgICAgICAneG1sbnM6eHNpPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2VcIiAnICtcclxuICAgICAgICBlbmNvZGluZyArXHJcbiAgICAgICAgdGhpcy53c2RsLnhtbG5zSW5FbnZlbG9wZSArXHJcbiAgICAgICAgJz4nICtcclxuICAgICAgICAoc2VsZi5zb2FwSGVhZGVycyB8fCBzZWxmLnNlY3VyaXR5XHJcbiAgICAgICAgICAgID8gJzwnICtcclxuICAgICAgICAgICAgICBlbnZlbG9wZUtleSArXHJcbiAgICAgICAgICAgICAgJzpIZWFkZXI+JyArXHJcbiAgICAgICAgICAgICAgKHNlbGYuc29hcEhlYWRlcnMgPyBzZWxmLnNvYXBIZWFkZXJzLmpvaW4oJ1xcbicpIDogJycpICtcclxuICAgICAgICAgICAgICAoc2VsZi5zZWN1cml0eSAmJiAhc2VsZi5zZWN1cml0eS5wb3N0UHJvY2VzcyA/IHNlbGYuc2VjdXJpdHkudG9YTUwoKSA6ICcnKSArXHJcbiAgICAgICAgICAgICAgJzwvJyArXHJcbiAgICAgICAgICAgICAgZW52ZWxvcGVLZXkgK1xyXG4gICAgICAgICAgICAgICc6SGVhZGVyPidcclxuICAgICAgICAgICAgOiAnJykgK1xyXG4gICAgICAgICc8JyArXHJcbiAgICAgICAgZW52ZWxvcGVLZXkgK1xyXG4gICAgICAgICc6Qm9keScgK1xyXG4gICAgICAgIChzZWxmLmJvZHlBdHRyaWJ1dGVzID8gc2VsZi5ib2R5QXR0cmlidXRlcy5qb2luKCcgJykgOiAnJykgK1xyXG4gICAgICAgIChzZWxmLnNlY3VyaXR5ICYmIHNlbGYuc2VjdXJpdHkucG9zdFByb2Nlc3MgPyAnIElkPVwiXzBcIicgOiAnJykgK1xyXG4gICAgICAgICc+JyArXHJcbiAgICAgICAgbWVzc2FnZSArXHJcbiAgICAgICAgJzwvJyArXHJcbiAgICAgICAgZW52ZWxvcGVLZXkgK1xyXG4gICAgICAgICc6Qm9keT4nICtcclxuICAgICAgICAnPC8nICtcclxuICAgICAgICBlbnZlbG9wZUtleSArXHJcbiAgICAgICAgJzpFbnZlbG9wZT4nO1xyXG5cclxuICAgIGlmIChzZWxmLnNlY3VyaXR5ICYmIHNlbGYuc2VjdXJpdHkucG9zdFByb2Nlc3MpIHtcclxuICAgICAgICB4bWwgPSBzZWxmLnNlY3VyaXR5LnBvc3RQcm9jZXNzKHhtbCwgZW52ZWxvcGVLZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMucG9zdFByb2Nlc3MpIHtcclxuICAgICAgICB4bWwgPSBvcHRpb25zLnBvc3RQcm9jZXNzKHhtbCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5sYXN0TWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICBzZWxmLmxhc3RSZXF1ZXN0ID0geG1sO1xyXG4gICAgc2VsZi5sYXN0RW5kcG9pbnQgPSBsb2NhdGlvbjtcclxuXHJcbiAgICBjb25zdCB0cnlKU09OcGFyc2UgPSBmdW5jdGlvbihib2R5KSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoYm9keSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZnJvbShTb2FwQXR0YWNobWVudC5mcm9tRm9ybUZpbGVzKG9wdGlvbnMuYXR0YWNobWVudHMpKS5waXBlKFxyXG4gICAgICAgIG1hcCgoc29hcEF0dGFjaG1lbnRzOiBTb2FwQXR0YWNobWVudFtdKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghc29hcEF0dGFjaG1lbnRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHhtbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZm9yY2VNVE9NIHx8IHNvYXBBdHRhY2htZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFydCA9IHV1aWQ0KCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBib3VuZHJ5ID0gdXVpZDQoKTtcclxuICAgICAgICAgICAgICAgIGxldCBhY3Rpb24gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYgKGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddLmluZGV4T2YoJ2FjdGlvbicpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGN0IG9mIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddLnNwbGl0KCc7ICcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdC5pbmRleE9mKCdhY3Rpb24nKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb24gPSBjdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9XHJcbiAgICAgICAgICAgICAgICAgICAgJ211bHRpcGFydC9yZWxhdGVkOyB0eXBlPVwiYXBwbGljYXRpb24veG9wK3htbFwiOyBzdGFydD1cIjwnICsgc3RhcnQgKyAnPlwiOyBzdGFydC1pbmZvPVwidGV4dC94bWxcIjsgYm91bmRhcnk9XCInICsgYm91bmRyeSArICdcIic7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSBoZWFkZXJzWydDb250ZW50LVR5cGUnXSArICc7ICcgKyBhY3Rpb247XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbXVsdGlwYXJ0OiBhbnlbXSA9IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veG9wK3htbDsgY2hhcnNldD1VVEYtODsgdHlwZT1cInRleHQveG1sXCInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1JRCc6ICc8JyArIHN0YXJ0ICsgJz4nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5OiB4bWxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgICAgIHNvYXBBdHRhY2htZW50cy5mb3JFYWNoKChhdHRhY2htZW50OiBTb2FwQXR0YWNobWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG11bHRpcGFydC5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6IGF0dGFjaG1lbnQubWltZXR5cGUgKyAnOycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdDb250ZW50LVRyYW5zZmVyLUVuY29kaW5nJzogJ2JpbmFyeScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdDb250ZW50LUlEJzogJzwnICsgKGF0dGFjaG1lbnQuY29udGVudElkIHx8IGF0dGFjaG1lbnQubmFtZSkgKyAnPicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdDb250ZW50LURpc3Bvc2l0aW9uJzogJ2F0dGFjaG1lbnQ7IG5hbWU9XCInICsgYXR0YWNobWVudC5uYW1lICsgJ1wiOyBmaWxlbmFtZT1cIicgKyBhdHRhY2htZW50Lm5hbWUgKyAnXCInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5OiBhdHRhY2htZW50LmJvZHlcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTXVsdGlwYXJ0KCkuYnVpbGQobXVsdGlwYXJ0LCBib3VuZHJ5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGZsYXRNYXAoKGJvZHk6IGFueSkgPT5cclxuICAgICAgICAgICAgKDxIdHRwQ2xpZW50PnNlbGYuaHR0cENsaWVudClcclxuICAgICAgICAgICAgICAgIC5wb3N0KGxvY2F0aW9uLCBib2R5LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZVR5cGU6ICd0ZXh0JyxcclxuICAgICAgICAgICAgICAgICAgICBvYnNlcnZlOiAncmVzcG9uc2UnXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnBpcGUoXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwKChyZXNwb25zZTogSHR0cFJlc3BvbnNlPGFueT4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sYXN0UmVzcG9uc2UgPSByZXNwb25zZS5ib2R5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmxhc3RSZXNwb25zZUhlYWRlcnMgPSByZXNwb25zZSAmJiByZXNwb25zZS5oZWFkZXJzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VTeW5jKHJlc3BvbnNlLmJvZHksIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgIClcclxuICAgICk7XHJcblxyXG4gICAgZnVuY3Rpb24gcGFyc2VTeW5jKGJvZHksIHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8YW55Pikge1xyXG4gICAgICAgIGxldCBvYmo7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgb2JqID0gc2VsZi53c2RsLnhtbFRvT2JqZWN0KGJvZHkpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIC8vICBXaGVuIHRoZSBvdXRwdXQgZWxlbWVudCBjYW5ub3QgYmUgbG9va2VkIHVwIGluIHRoZSB3c2RsIGFuZCB0aGUgYm9keSBpcyBKU09OXHJcbiAgICAgICAgICAgIC8vICBpbnN0ZWFkIG9mIHNlbmRpbmcgdGhlIGVycm9yLCB3ZSBwYXNzIHRoZSBib2R5IGluIHRoZSByZXNwb25zZS5cclxuICAgICAgICAgICAgaWYgKCFvdXRwdXQgfHwgIW91dHB1dC4kbG9va3VwVHlwZXMpIHtcclxuICAgICAgICAgICAgICAgIC8vIGRlYnVnKCdSZXNwb25zZSBlbGVtZW50IGlzIG5vdCBwcmVzZW50LiBVbmFibGUgdG8gY29udmVydCByZXNwb25zZSB4bWwgdG8ganNvbi4nKTtcclxuICAgICAgICAgICAgICAgIC8vICBJZiB0aGUgcmVzcG9uc2UgaXMgSlNPTiB0aGVuIHJldHVybiBpdCBhcy1pcy5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGpzb24gPSBfLmlzT2JqZWN0KGJvZHkpID8gYm9keSA6IHRyeUpTT05wYXJzZShib2R5KTtcclxuICAgICAgICAgICAgICAgIGlmIChqc29uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgZXJyOiBudWxsLCByZXNwb25zZSwgcmVzcG9uc2VCb2R5OiBqc29uLCBoZWFkZXI6IHVuZGVmaW5lZCwgeG1sIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgZXJyb3IuYm9keSA9IGJvZHk7XHJcbiAgICAgICAgICAgIC8vIHNlbGYuZW1pdCgnc29hcEVycm9yJywgZXJyb3IsIGVpZCk7XHJcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmluaXNoKG9iaiwgYm9keSwgcmVzcG9uc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGZpbmlzaChvYmosIHJlc3BvbnNlQm9keSwgcmVzcG9uc2UpIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKCFvdXRwdXQpIHtcclxuICAgICAgICAgICAgLy8gb25lLXdheSwgbm8gb3V0cHV0IGV4cGVjdGVkXHJcbiAgICAgICAgICAgIHJldHVybiB7IGVycjogbnVsbCwgcmVzcG9uc2U6IG51bGwsIHJlc3BvbnNlQm9keSwgaGVhZGVyOiBvYmouSGVhZGVyLCB4bWwgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIElmIGl0J3Mgbm90IEhUTUwgYW5kIFNvYXAgQm9keSBpcyBlbXB0eVxyXG4gICAgICAgIGlmICghb2JqLmh0bWwgJiYgIW9iai5Cb2R5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGVycjogbnVsbCwgb2JqLCByZXNwb25zZUJvZHksIGhlYWRlcjogb2JqLkhlYWRlciwgeG1sIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIG9iai5Cb2R5ICE9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvcjogYW55ID0gbmV3IEVycm9yKCdDYW5ub3QgcGFyc2UgcmVzcG9uc2UnKTtcclxuICAgICAgICAgICAgZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgZXJyb3IuYm9keSA9IHJlc3BvbnNlQm9keTtcclxuICAgICAgICAgICAgcmV0dXJuIHsgZXJyOiBlcnJvciwgb2JqLCByZXNwb25zZUJvZHksIGhlYWRlcjogdW5kZWZpbmVkLCB4bWwgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlc3VsdCA9IG9iai5Cb2R5W291dHB1dC4kbmFtZV07XHJcbiAgICAgICAgLy8gUlBDL2xpdGVyYWwgcmVzcG9uc2UgYm9keSBtYXkgY29udGFpbiBlbGVtZW50cyB3aXRoIGFkZGVkIHN1ZmZpeGVzIEkuRS5cclxuICAgICAgICAvLyAnUmVzcG9uc2UnLCBvciAnT3V0cHV0Jywgb3IgJ091dCdcclxuICAgICAgICAvLyBUaGlzIGRvZXNuJ3QgbmVjZXNzYXJpbHkgZXF1YWwgdGhlIG91cHV0IG1lc3NhZ2UgbmFtZS4gU2VlIFdTREwgMS4xIFNlY3Rpb24gMi40LjVcclxuICAgICAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBvYmouQm9keVtvdXRwdXQuJG5hbWUucmVwbGFjZSgvKD86T3V0KD86cHV0KT98UmVzcG9uc2UpJC8sICcnKV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcmVzdWx0KSB7XHJcbiAgICAgICAgICAgIFsnUmVzcG9uc2UnLCAnT3V0JywgJ091dHB1dCddLmZvckVhY2goZnVuY3Rpb24odGVybSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9iai5Cb2R5Lmhhc093blByb3BlcnR5KG5hbWUgKyB0ZXJtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAocmVzdWx0ID0gb2JqLkJvZHlbbmFtZSArIHRlcm1dKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4geyBlcnI6IG51bGwsIHJlc3VsdCwgcmVzcG9uc2VCb2R5LCBoZWFkZXI6IG9iai5IZWFkZXIsIHhtbCB9O1xyXG4gICAgfVxyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5jYWxsID0gZnVuY3Rpb24obWV0aG9kOiBzdHJpbmcsIGJvZHk6IGFueSwgb3B0aW9ucz86IGFueSwgZXh0cmFIZWFkZXJzPzogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGlmICghdGhpc1ttZXRob2RdKSB7XHJcbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoYE1ldGhvZCAke21ldGhvZH0gbm90IGZvdW5kYCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICg8RnVuY3Rpb24+dGhpc1ttZXRob2RdKS5jYWxsKHRoaXMsIGJvZHksIG9wdGlvbnMsIGV4dHJhSGVhZGVycyk7XHJcbn07XHJcbiJdfQ==