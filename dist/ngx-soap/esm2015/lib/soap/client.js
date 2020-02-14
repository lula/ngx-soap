/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
const nonIdentifierChars = /[^a-z$_0-9]/i;
/** @type {?} */
export const Client = function (wsdl, endpoint, options) {
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
        let composition = '';
        Object.getOwnPropertyNames(bodyAttribute).forEach(function (prop, idx, array) {
            composition += ' ' + prop + '="' + bodyAttribute[prop] + '"';
        });
        bodyAttribute = composition;
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
    const types = this.wsdl.definitions.types;
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
    const definitions = this.wsdl.definitions;
    /** @type {?} */
    const services = definitions.services;
    for (const name in services) {
        this[name] = this._defineService(services[name], endpoint);
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
    const ports = service.ports;
    /** @type {?} */
    const def = {};
    for (const name in ports) {
        def[name] = this._definePort(ports[name], endpoint ? endpoint : ports[name].location);
    }
    return def;
};
Client.prototype._definePort = function (port, endpoint) {
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
};
Client.prototype._defineMethod = function (method, location) {
    /** @type {?} */
    const self = this;
    /** @type {?} */
    let temp = null;
    return function (args, options, extraHeaders) {
        return self._invoke(method, args, location, options, extraHeaders);
    };
};
Client.prototype._invoke = function (method, args, location, options, extraHeaders) {
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
        'Content-Type': 'text/xml; charset=utf-8'
    };
    /** @type {?} */
    let xmlnsSoap = 'xmlns:' + envelopeKey + '="http://schemas.xmlsoap.org/soap/envelope/"';
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
    const tryJSONparse = function (body) {
        try {
            return JSON.parse(body);
        }
        catch (err) {
            return undefined;
        }
    };
    return from(SoapAttachment.fromFormFiles(options.attachments)).pipe(map((soapAttachments) => {
        if (!soapAttachments.length) {
            return xml;
        }
        if (options.forceMTOM || soapAttachments.length > 0) {
            /** @type {?} */
            const start = uuid4();
            /** @type {?} */
            const boundry = uuid4();
            /** @type {?} */
            let action = null;
            if (headers['Content-Type'].indexOf('action') > -1) {
                for (const ct of headers['Content-Type'].split('; ')) {
                    if (ct.indexOf('action') > -1) {
                        action = ct;
                    }
                }
            }
            headers['Content-Type'] =
                'multipart/related; type="application/xop+xml"; start="<' + start + '>"; start-info="text/xml"; boundary="' + boundry + '"';
            if (action) {
                headers['Content-Type'] = headers['Content-Type'] + '; ' + action;
            }
            /** @type {?} */
            const multipart = [
                {
                    'Content-Type': 'application/xop+xml; charset=UTF-8; type="text/xml"',
                    'Content-ID': '<' + start + '>',
                    body: xml
                }
            ];
            soapAttachments.forEach((attachment) => {
                multipart.push({
                    'Content-Type': attachment.mimetype + ';',
                    'Content-Transfer-Encoding': 'binary',
                    'Content-ID': '<' + (attachment.contentId || attachment.name) + '>',
                    'Content-Disposition': 'attachment; name="' + attachment.name + '"; filename="' + attachment.name + '"',
                    body: attachment.body
                });
            });
            return new Multipart().build(multipart, boundry);
        }
    }), flatMap((body) => ((/** @type {?} */ (self.httpClient)))
        .post(location, body, {
        headers: headers,
        responseType: 'text',
        observe: 'response'
    })
        .pipe(map((response) => {
        self.lastResponse = response.body;
        self.lastResponseHeaders = response && response.headers;
        return parseSync(response.body, response);
    }))));
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
            ['Response', 'Out', 'Output'].forEach(function (term) {
                if (obj.Body.hasOwnProperty(name + term)) {
                    return (result = obj.Body[name + term]);
                }
            });
        }
        return { err: null, result, responseBody, header: obj.Header, xml };
    }
};
Client.prototype.call = function (method, body, options, extraHeaders) {
    if (!this[method]) {
        return throwError(`Method ${method} not found`);
    }
    return ((/** @type {?} */ (this[method]))).call(this, body, options, extraHeaders);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXNvYXAvIiwic291cmNlcyI6WyJsaWIvc29hcC9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFNQSxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUNqQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ3JDLE9BQU8sS0FBSyxDQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzVCLE9BQU8sS0FBSyxNQUFNLFNBQVMsQ0FBQztBQUM1QixPQUFPLEVBQUUsSUFBSSxFQUFjLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNwRCxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtCQUFrQixDQUFDOztNQUU1QyxrQkFBa0IsR0FBRyxjQUFjOztBQUV6QyxNQUFNLE9BQU8sTUFBTSxHQUFHLFVBQVMsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPO0lBQ2xELE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO0lBQ3hCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ2pCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxtQkFBQSxPQUFPLENBQUMsVUFBVSxFQUFjLENBQUM7O1VBQzdDLGNBQWMsR0FBUSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUU7SUFDL0MsSUFBSSxPQUFPLENBQUMscUJBQXFCLEVBQUU7UUFDL0IsY0FBYyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUM7S0FDekQ7SUFDRCxPQUFPLENBQUMsR0FB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d2lzZS5jb20+XG4gKiBNSVQgTGljZW5zZWRcbiAqL1xuXG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwUmVzcG9uc2UgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgKiBhcyBhc3NlcnQgZnJvbSAnYXNzZXJ0JztcbmltcG9ydCB7IGZpbmRQcmVmaXggfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB1dWlkNCBmcm9tICd1dWlkL3Y0JztcbmltcG9ydCB7IGZyb20sIE9ic2VydmFibGUsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZsYXRNYXAsIG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IE11bHRpcGFydCB9IGZyb20gJy4vbXVsdGlwYXJ0JztcbmltcG9ydCB7IFNvYXBBdHRhY2htZW50IH0gZnJvbSAnLi9zb2FwQXR0YWNobWVudCc7XG5cbmNvbnN0IG5vbklkZW50aWZpZXJDaGFycyA9IC9bXmEteiRfMC05XS9pO1xuXG5leHBvcnQgY29uc3QgQ2xpZW50ID0gZnVuY3Rpb24od3NkbCwgZW5kcG9pbnQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLndzZGwgPSB3c2RsO1xuICAgIHRoaXMuX2luaXRpYWxpemVPcHRpb25zKG9wdGlvbnMpO1xuICAgIHRoaXMuX2luaXRpYWxpemVTZXJ2aWNlcyhlbmRwb2ludCk7XG4gICAgdGhpcy5odHRwQ2xpZW50ID0gb3B0aW9ucy5odHRwQ2xpZW50IGFzIEh0dHBDbGllbnQ7XG4gICAgY29uc3QgcHJvbWlzZU9wdGlvbnM6IGFueSA9IHsgbXVsdGlBcmdzOiB0cnVlIH07XG4gICAgaWYgKG9wdGlvbnMub3ZlcnJpZGVQcm9taXNlU3VmZml4KSB7XG4gICAgICAgIHByb21pc2VPcHRpb25zLnN1ZmZpeCA9IG9wdGlvbnMub3ZlcnJpZGVQcm9taXNlU3VmZml4O1xuICAgIH1cbiAgICBQcm9taXNlLmFsbChbdGhpcywgcHJvbWlzZU9wdGlvbnNdKTtcbn07XG5cbkNsaWVudC5wcm90b3R5cGUuYWRkU29hcEhlYWRlciA9IGZ1bmN0aW9uKHNvYXBIZWFkZXIsIG5hbWUsIG5hbWVzcGFjZSwgeG1sbnMpIHtcbiAgICBpZiAoIXRoaXMuc29hcEhlYWRlcnMpIHtcbiAgICAgICAgdGhpcy5zb2FwSGVhZGVycyA9IFtdO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHNvYXBIZWFkZXIgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHNvYXBIZWFkZXIgPSB0aGlzLndzZGwub2JqZWN0VG9YTUwoc29hcEhlYWRlciwgbmFtZSwgbmFtZXNwYWNlLCB4bWxucywgdHJ1ZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNvYXBIZWFkZXJzLnB1c2goc29hcEhlYWRlcikgLSAxO1xufTtcblxuQ2xpZW50LnByb3RvdHlwZS5jaGFuZ2VTb2FwSGVhZGVyID0gZnVuY3Rpb24oaW5kZXgsIHNvYXBIZWFkZXIsIG5hbWUsIG5hbWVzcGFjZSwgeG1sbnMpIHtcbiAgICBpZiAoIXRoaXMuc29hcEhlYWRlcnMpIHtcbiAgICAgICAgdGhpcy5zb2FwSGVhZGVycyA9IFtdO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHNvYXBIZWFkZXIgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHNvYXBIZWFkZXIgPSB0aGlzLndzZGwub2JqZWN0VG9YTUwoc29hcEhlYWRlciwgbmFtZSwgbmFtZXNwYWNlLCB4bWxucywgdHJ1ZSk7XG4gICAgfVxuICAgIHRoaXMuc29hcEhlYWRlcnNbaW5kZXhdID0gc29hcEhlYWRlcjtcbn07XG5cbkNsaWVudC5wcm90b3R5cGUuZ2V0U29hcEhlYWRlcnMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zb2FwSGVhZGVycztcbn07XG5cbkNsaWVudC5wcm90b3R5cGUuY2xlYXJTb2FwSGVhZGVycyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc29hcEhlYWRlcnMgPSBudWxsO1xufTtcblxuQ2xpZW50LnByb3RvdHlwZS5hZGRIdHRwSGVhZGVyID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICBpZiAoIXRoaXMuaHR0cEhlYWRlcnMpIHtcbiAgICAgICAgdGhpcy5odHRwSGVhZGVycyA9IHt9O1xuICAgIH1cbiAgICB0aGlzLmh0dHBIZWFkZXJzW25hbWVdID0gdmFsdWU7XG59O1xuXG5DbGllbnQucHJvdG90eXBlLmdldEh0dHBIZWFkZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaHR0cEhlYWRlcnM7XG59O1xuXG5DbGllbnQucHJvdG90eXBlLmNsZWFySHR0cEhlYWRlcnMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmh0dHBIZWFkZXJzID0ge307XG59O1xuXG5DbGllbnQucHJvdG90eXBlLmFkZEJvZHlBdHRyaWJ1dGUgPSBmdW5jdGlvbihib2R5QXR0cmlidXRlLCBuYW1lLCBuYW1lc3BhY2UsIHhtbG5zKSB7XG4gICAgaWYgKCF0aGlzLmJvZHlBdHRyaWJ1dGVzKSB7XG4gICAgICAgIHRoaXMuYm9keUF0dHJpYnV0ZXMgPSBbXTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBib2R5QXR0cmlidXRlID09PSAnb2JqZWN0Jykge1xuICAgICAgICBsZXQgY29tcG9zaXRpb24gPSAnJztcbiAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYm9keUF0dHJpYnV0ZSkuZm9yRWFjaChmdW5jdGlvbihwcm9wLCBpZHgsIGFycmF5KSB7XG4gICAgICAgICAgICBjb21wb3NpdGlvbiArPSAnICcgKyBwcm9wICsgJz1cIicgKyBib2R5QXR0cmlidXRlW3Byb3BdICsgJ1wiJztcbiAgICAgICAgfSk7XG4gICAgICAgIGJvZHlBdHRyaWJ1dGUgPSBjb21wb3NpdGlvbjtcbiAgICB9XG4gICAgaWYgKGJvZHlBdHRyaWJ1dGUuc3Vic3RyKDAsIDEpICE9PSAnICcpIGJvZHlBdHRyaWJ1dGUgPSAnICcgKyBib2R5QXR0cmlidXRlO1xuICAgIHRoaXMuYm9keUF0dHJpYnV0ZXMucHVzaChib2R5QXR0cmlidXRlKTtcbn07XG5cbkNsaWVudC5wcm90b3R5cGUuZ2V0Qm9keUF0dHJpYnV0ZXMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5ib2R5QXR0cmlidXRlcztcbn07XG5cbkNsaWVudC5wcm90b3R5cGUuY2xlYXJCb2R5QXR0cmlidXRlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYm9keUF0dHJpYnV0ZXMgPSBudWxsO1xufTtcblxuQ2xpZW50LnByb3RvdHlwZS5zZXRFbmRwb2ludCA9IGZ1bmN0aW9uKGVuZHBvaW50KSB7XG4gICAgdGhpcy5lbmRwb2ludCA9IGVuZHBvaW50O1xuICAgIHRoaXMuX2luaXRpYWxpemVTZXJ2aWNlcyhlbmRwb2ludCk7XG59O1xuXG5DbGllbnQucHJvdG90eXBlLmRlc2NyaWJlID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgdHlwZXMgPSB0aGlzLndzZGwuZGVmaW5pdGlvbnMudHlwZXM7XG4gICAgcmV0dXJuIHRoaXMud3NkbC5kZXNjcmliZVNlcnZpY2VzKCk7XG59O1xuXG5DbGllbnQucHJvdG90eXBlLnNldFNlY3VyaXR5ID0gZnVuY3Rpb24oc2VjdXJpdHkpIHtcbiAgICB0aGlzLnNlY3VyaXR5ID0gc2VjdXJpdHk7XG59O1xuXG5DbGllbnQucHJvdG90eXBlLnNldFNPQVBBY3Rpb24gPSBmdW5jdGlvbihTT0FQQWN0aW9uKSB7XG4gICAgdGhpcy5TT0FQQWN0aW9uID0gU09BUEFjdGlvbjtcbn07XG5cbkNsaWVudC5wcm90b3R5cGUuX2luaXRpYWxpemVTZXJ2aWNlcyA9IGZ1bmN0aW9uKGVuZHBvaW50KSB7XG4gICAgY29uc3QgZGVmaW5pdGlvbnMgPSB0aGlzLndzZGwuZGVmaW5pdGlvbnMsXG4gICAgICAgIHNlcnZpY2VzID0gZGVmaW5pdGlvbnMuc2VydmljZXM7XG4gICAgZm9yIChjb25zdCBuYW1lIGluIHNlcnZpY2VzKSB7XG4gICAgICAgIHRoaXNbbmFtZV0gPSB0aGlzLl9kZWZpbmVTZXJ2aWNlKHNlcnZpY2VzW25hbWVdLCBlbmRwb2ludCk7XG4gICAgfVxufTtcblxuQ2xpZW50LnByb3RvdHlwZS5faW5pdGlhbGl6ZU9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdGhpcy5zdHJlYW1BbGxvd2VkID0gb3B0aW9ucy5zdHJlYW07XG4gICAgdGhpcy5ub3JtYWxpemVOYW1lcyA9IG9wdGlvbnMubm9ybWFsaXplTmFtZXM7XG4gICAgdGhpcy53c2RsLm9wdGlvbnMuYXR0cmlidXRlc0tleSA9IG9wdGlvbnMuYXR0cmlidXRlc0tleSB8fCAnYXR0cmlidXRlcyc7XG4gICAgdGhpcy53c2RsLm9wdGlvbnMuZW52ZWxvcGVLZXkgPSBvcHRpb25zLmVudmVsb3BlS2V5IHx8ICdzb2FwJztcbiAgICB0aGlzLndzZGwub3B0aW9ucy5wcmVzZXJ2ZVdoaXRlc3BhY2UgPSAhIW9wdGlvbnMucHJlc2VydmVXaGl0ZXNwYWNlO1xuICAgIGlmIChvcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMub3ZlcnJpZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMub3ZlcnJpZGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcy5uYW1lc3BhY2VzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53c2RsLm9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMgPSBvcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzLm5hbWVzcGFjZXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChvcHRpb25zLm92ZXJyaWRlUm9vdEVsZW1lbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLndzZGwub3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50ID0gb3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50O1xuICAgIH1cbiAgICB0aGlzLndzZGwub3B0aW9ucy5mb3JjZVNvYXAxMkhlYWRlcnMgPSAhIW9wdGlvbnMuZm9yY2VTb2FwMTJIZWFkZXJzO1xufTtcblxuQ2xpZW50LnByb3RvdHlwZS5fZGVmaW5lU2VydmljZSA9IGZ1bmN0aW9uKHNlcnZpY2UsIGVuZHBvaW50KSB7XG4gICAgY29uc3QgcG9ydHMgPSBzZXJ2aWNlLnBvcnRzLFxuICAgICAgICBkZWYgPSB7fTtcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gcG9ydHMpIHtcbiAgICAgICAgZGVmW25hbWVdID0gdGhpcy5fZGVmaW5lUG9ydChwb3J0c1tuYW1lXSwgZW5kcG9pbnQgPyBlbmRwb2ludCA6IHBvcnRzW25hbWVdLmxvY2F0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlZjtcbn07XG5cbkNsaWVudC5wcm90b3R5cGUuX2RlZmluZVBvcnQgPSBmdW5jdGlvbihwb3J0LCBlbmRwb2ludCkge1xuICAgIGNvbnN0IGxvY2F0aW9uID0gZW5kcG9pbnQsXG4gICAgICAgIGJpbmRpbmcgPSBwb3J0LmJpbmRpbmcsXG4gICAgICAgIG1ldGhvZHMgPSBiaW5kaW5nLm1ldGhvZHMsXG4gICAgICAgIGRlZiA9IHt9O1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiBtZXRob2RzKSB7XG4gICAgICAgIGRlZltuYW1lXSA9IHRoaXMuX2RlZmluZU1ldGhvZChtZXRob2RzW25hbWVdLCBsb2NhdGlvbik7XG4gICAgICAgIGNvbnN0IG1ldGhvZE5hbWUgPSB0aGlzLm5vcm1hbGl6ZU5hbWVzID8gbmFtZS5yZXBsYWNlKG5vbklkZW50aWZpZXJDaGFycywgJ18nKSA6IG5hbWU7XG4gICAgICAgIHRoaXNbbWV0aG9kTmFtZV0gPSBkZWZbbmFtZV07XG4gICAgfVxuICAgIHJldHVybiBkZWY7XG59O1xuXG5DbGllbnQucHJvdG90eXBlLl9kZWZpbmVNZXRob2QgPSBmdW5jdGlvbihtZXRob2QsIGxvY2F0aW9uKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgbGV0IHRlbXAgPSBudWxsO1xuICAgIHJldHVybiBmdW5jdGlvbihhcmdzLCBvcHRpb25zLCBleHRyYUhlYWRlcnMpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICByZXR1cm4gc2VsZi5faW52b2tlKG1ldGhvZCwgYXJncywgbG9jYXRpb24sIG9wdGlvbnMsIGV4dHJhSGVhZGVycyk7XG4gICAgfTtcbn07XG5cbkNsaWVudC5wcm90b3R5cGUuX2ludm9rZSA9IGZ1bmN0aW9uKG1ldGhvZCwgYXJncywgbG9jYXRpb24sIG9wdGlvbnMsIGV4dHJhSGVhZGVycyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgbGV0IHNlbGYgPSB0aGlzLFxuICAgICAgICBuYW1lID0gbWV0aG9kLiRuYW1lLFxuICAgICAgICBpbnB1dCA9IG1ldGhvZC5pbnB1dCxcbiAgICAgICAgb3V0cHV0ID0gbWV0aG9kLm91dHB1dCxcbiAgICAgICAgc3R5bGUgPSBtZXRob2Quc3R5bGUsXG4gICAgICAgIGRlZnMgPSB0aGlzLndzZGwuZGVmaW5pdGlvbnMsXG4gICAgICAgIGVudmVsb3BlS2V5ID0gdGhpcy53c2RsLm9wdGlvbnMuZW52ZWxvcGVLZXksXG4gICAgICAgIG5zID0gZGVmcy4kdGFyZ2V0TmFtZXNwYWNlLFxuICAgICAgICBlbmNvZGluZyA9ICcnLFxuICAgICAgICBtZXNzYWdlID0gJycsXG4gICAgICAgIHhtbCA9IG51bGwsXG4gICAgICAgIHJlcSA9IG51bGwsXG4gICAgICAgIHNvYXBBY3Rpb24gPSBudWxsLFxuICAgICAgICBhbGlhcyA9IGZpbmRQcmVmaXgoZGVmcy54bWxucywgbnMpLFxuICAgICAgICBoZWFkZXJzOiBhbnkgPSB7XG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ3RleHQveG1sOyBjaGFyc2V0PXV0Zi04J1xuICAgICAgICB9LFxuICAgICAgICB4bWxuc1NvYXAgPSAneG1sbnM6JyArIGVudmVsb3BlS2V5ICsgJz1cImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3NvYXAvZW52ZWxvcGUvXCInO1xuXG4gICAgaWYgKHRoaXMud3NkbC5vcHRpb25zLmZvcmNlU29hcDEySGVhZGVycykge1xuICAgICAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi9zb2FwK3htbDsgY2hhcnNldD11dGYtOCc7XG4gICAgICAgIHhtbG5zU29hcCA9ICd4bWxuczonICsgZW52ZWxvcGVLZXkgKyAnPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMy8wNS9zb2FwLWVudmVsb3BlXCInO1xuICAgIH1cblxuICAgIGlmICh0aGlzLlNPQVBBY3Rpb24pIHtcbiAgICAgICAgc29hcEFjdGlvbiA9IHRoaXMuU09BUEFjdGlvbjtcbiAgICB9IGVsc2UgaWYgKG1ldGhvZC5zb2FwQWN0aW9uICE9PSB1bmRlZmluZWQgJiYgbWV0aG9kLnNvYXBBY3Rpb24gIT09IG51bGwpIHtcbiAgICAgICAgc29hcEFjdGlvbiA9IG1ldGhvZC5zb2FwQWN0aW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNvYXBBY3Rpb24gPSAobnMubGFzdEluZGV4T2YoJy8nKSAhPT0gbnMubGVuZ3RoIC0gMSA/IG5zICsgJy8nIDogbnMpICsgbmFtZTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMud3NkbC5vcHRpb25zLmZvcmNlU29hcDEySGVhZGVycykge1xuICAgICAgICBoZWFkZXJzLlNPQVBBY3Rpb24gPSAnXCInICsgc29hcEFjdGlvbiArICdcIic7XG4gICAgfVxuXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAvL0FkZCBleHRyYSBoZWFkZXJzXG4gICAgZm9yIChjb25zdCBoZWFkZXIgaW4gdGhpcy5odHRwSGVhZGVycykge1xuICAgICAgICBoZWFkZXJzW2hlYWRlcl0gPSB0aGlzLmh0dHBIZWFkZXJzW2hlYWRlcl07XG4gICAgfVxuICAgIGZvciAoY29uc3QgYXR0ciBpbiBleHRyYUhlYWRlcnMpIHtcbiAgICAgICAgaGVhZGVyc1thdHRyXSA9IGV4dHJhSGVhZGVyc1thdHRyXTtcbiAgICB9XG5cbiAgICAvLyBBbGxvdyB0aGUgc2VjdXJpdHkgb2JqZWN0IHRvIGFkZCBoZWFkZXJzXG4gICAgaWYgKHNlbGYuc2VjdXJpdHkgJiYgc2VsZi5zZWN1cml0eS5hZGRIZWFkZXJzKSBzZWxmLnNlY3VyaXR5LmFkZEhlYWRlcnMoaGVhZGVycyk7XG4gICAgaWYgKHNlbGYuc2VjdXJpdHkgJiYgc2VsZi5zZWN1cml0eS5hZGRPcHRpb25zKSBzZWxmLnNlY3VyaXR5LmFkZE9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICBpZiAoc3R5bGUgPT09ICdycGMnICYmIChpbnB1dC5wYXJ0cyB8fCBpbnB1dC5uYW1lID09PSAnZWxlbWVudCcgfHwgYXJncyA9PT0gbnVsbCkpIHtcbiAgICAgICAgYXNzZXJ0Lm9rKCFzdHlsZSB8fCBzdHlsZSA9PT0gJ3JwYycsICdpbnZhbGlkIG1lc3NhZ2UgZGVmaW5pdGlvbiBmb3IgZG9jdW1lbnQgc3R5bGUgYmluZGluZycpO1xuICAgICAgICBtZXNzYWdlID0gc2VsZi53c2RsLm9iamVjdFRvUnBjWE1MKG5hbWUsIGFyZ3MsIGFsaWFzLCBucywgaW5wdXQubmFtZSAhPT0gJ2VsZW1lbnQnKTtcbiAgICAgICAgbWV0aG9kLmlucHV0U29hcCA9PT0gJ2VuY29kZWQnICYmIChlbmNvZGluZyA9ICdzb2FwOmVuY29kaW5nU3R5bGU9XCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy9zb2FwL2VuY29kaW5nL1wiICcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGFzc2VydC5vayghc3R5bGUgfHwgc3R5bGUgPT09ICdkb2N1bWVudCcsICdpbnZhbGlkIG1lc3NhZ2UgZGVmaW5pdGlvbiBmb3IgcnBjIHN0eWxlIGJpbmRpbmcnKTtcbiAgICAgICAgLy8gcGFzcyBgaW5wdXQuJGxvb2t1cFR5cGVgIGlmIGBpbnB1dC4kdHlwZWAgY291bGQgbm90IGJlIGZvdW5kXG4gICAgICAgIG1lc3NhZ2UgPSBzZWxmLndzZGwub2JqZWN0VG9Eb2N1bWVudFhNTChpbnB1dC4kbmFtZSwgYXJncywgaW5wdXQudGFyZ2V0TlNBbGlhcywgaW5wdXQudGFyZ2V0TmFtZXNwYWNlLCBpbnB1dC4kdHlwZSB8fCBpbnB1dC4kbG9va3VwVHlwZSk7XG4gICAgfVxuICAgIHhtbCA9XG4gICAgICAgICc8P3htbCB2ZXJzaW9uPVwiMS4wXCIgZW5jb2Rpbmc9XCJ1dGYtOFwiPz4nICtcbiAgICAgICAgJzwnICtcbiAgICAgICAgZW52ZWxvcGVLZXkgK1xuICAgICAgICAnOkVudmVsb3BlICcgK1xuICAgICAgICB4bWxuc1NvYXAgK1xuICAgICAgICAnICcgK1xuICAgICAgICAneG1sbnM6eHNpPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2VcIiAnICtcbiAgICAgICAgZW5jb2RpbmcgK1xuICAgICAgICB0aGlzLndzZGwueG1sbnNJbkVudmVsb3BlICtcbiAgICAgICAgJz4nICtcbiAgICAgICAgKHNlbGYuc29hcEhlYWRlcnMgfHwgc2VsZi5zZWN1cml0eVxuICAgICAgICAgICAgPyAnPCcgK1xuICAgICAgICAgICAgICBlbnZlbG9wZUtleSArXG4gICAgICAgICAgICAgICc6SGVhZGVyPicgK1xuICAgICAgICAgICAgICAoc2VsZi5zb2FwSGVhZGVycyA/IHNlbGYuc29hcEhlYWRlcnMuam9pbignXFxuJykgOiAnJykgK1xuICAgICAgICAgICAgICAoc2VsZi5zZWN1cml0eSAmJiAhc2VsZi5zZWN1cml0eS5wb3N0UHJvY2VzcyA/IHNlbGYuc2VjdXJpdHkudG9YTUwoKSA6ICcnKSArXG4gICAgICAgICAgICAgICc8LycgK1xuICAgICAgICAgICAgICBlbnZlbG9wZUtleSArXG4gICAgICAgICAgICAgICc6SGVhZGVyPidcbiAgICAgICAgICAgIDogJycpICtcbiAgICAgICAgJzwnICtcbiAgICAgICAgZW52ZWxvcGVLZXkgK1xuICAgICAgICAnOkJvZHknICtcbiAgICAgICAgKHNlbGYuYm9keUF0dHJpYnV0ZXMgPyBzZWxmLmJvZHlBdHRyaWJ1dGVzLmpvaW4oJyAnKSA6ICcnKSArXG4gICAgICAgIChzZWxmLnNlY3VyaXR5ICYmIHNlbGYuc2VjdXJpdHkucG9zdFByb2Nlc3MgPyAnIElkPVwiXzBcIicgOiAnJykgK1xuICAgICAgICAnPicgK1xuICAgICAgICBtZXNzYWdlICtcbiAgICAgICAgJzwvJyArXG4gICAgICAgIGVudmVsb3BlS2V5ICtcbiAgICAgICAgJzpCb2R5PicgK1xuICAgICAgICAnPC8nICtcbiAgICAgICAgZW52ZWxvcGVLZXkgK1xuICAgICAgICAnOkVudmVsb3BlPic7XG5cbiAgICBpZiAoc2VsZi5zZWN1cml0eSAmJiBzZWxmLnNlY3VyaXR5LnBvc3RQcm9jZXNzKSB7XG4gICAgICAgIHhtbCA9IHNlbGYuc2VjdXJpdHkucG9zdFByb2Nlc3MoeG1sLCBlbnZlbG9wZUtleSk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5wb3N0UHJvY2Vzcykge1xuICAgICAgICB4bWwgPSBvcHRpb25zLnBvc3RQcm9jZXNzKHhtbCk7XG4gICAgfVxuXG4gICAgc2VsZi5sYXN0TWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgc2VsZi5sYXN0UmVxdWVzdCA9IHhtbDtcbiAgICBzZWxmLmxhc3RFbmRwb2ludCA9IGxvY2F0aW9uO1xuXG4gICAgY29uc3QgdHJ5SlNPTnBhcnNlID0gZnVuY3Rpb24oYm9keSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoYm9keSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gZnJvbShTb2FwQXR0YWNobWVudC5mcm9tRm9ybUZpbGVzKG9wdGlvbnMuYXR0YWNobWVudHMpKS5waXBlKFxuICAgICAgICBtYXAoKHNvYXBBdHRhY2htZW50czogU29hcEF0dGFjaG1lbnRbXSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFzb2FwQXR0YWNobWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHhtbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZm9yY2VNVE9NIHx8IHNvYXBBdHRhY2htZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSB1dWlkNCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJvdW5kcnkgPSB1dWlkNCgpO1xuICAgICAgICAgICAgICAgIGxldCBhY3Rpb24gPSBudWxsO1xuICAgICAgICAgICAgICAgIGlmIChoZWFkZXJzWydDb250ZW50LVR5cGUnXS5pbmRleE9mKCdhY3Rpb24nKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgY3Qgb2YgaGVhZGVyc1snQ29udGVudC1UeXBlJ10uc3BsaXQoJzsgJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdC5pbmRleE9mKCdhY3Rpb24nKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uID0gY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9XG4gICAgICAgICAgICAgICAgICAgICdtdWx0aXBhcnQvcmVsYXRlZDsgdHlwZT1cImFwcGxpY2F0aW9uL3hvcCt4bWxcIjsgc3RhcnQ9XCI8JyArIHN0YXJ0ICsgJz5cIjsgc3RhcnQtaW5mbz1cInRleHQveG1sXCI7IGJvdW5kYXJ5PVwiJyArIGJvdW5kcnkgKyAnXCInO1xuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSBoZWFkZXJzWydDb250ZW50LVR5cGUnXSArICc7ICcgKyBhY3Rpb247XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgbXVsdGlwYXJ0OiBhbnlbXSA9IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94b3AreG1sOyBjaGFyc2V0PVVURi04OyB0eXBlPVwidGV4dC94bWxcIicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1JRCc6ICc8JyArIHN0YXJ0ICsgJz4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9keTogeG1sXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICAgICAgc29hcEF0dGFjaG1lbnRzLmZvckVhY2goKGF0dGFjaG1lbnQ6IFNvYXBBdHRhY2htZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIG11bHRpcGFydC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiBhdHRhY2htZW50Lm1pbWV0eXBlICsgJzsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHJhbnNmZXItRW5jb2RpbmcnOiAnYmluYXJ5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdDb250ZW50LUlEJzogJzwnICsgKGF0dGFjaG1lbnQuY29udGVudElkIHx8IGF0dGFjaG1lbnQubmFtZSkgKyAnPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1EaXNwb3NpdGlvbic6ICdhdHRhY2htZW50OyBuYW1lPVwiJyArIGF0dGFjaG1lbnQubmFtZSArICdcIjsgZmlsZW5hbWU9XCInICsgYXR0YWNobWVudC5uYW1lICsgJ1wiJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IGF0dGFjaG1lbnQuYm9keVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTXVsdGlwYXJ0KCkuYnVpbGQobXVsdGlwYXJ0LCBib3VuZHJ5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSksXG4gICAgICAgIGZsYXRNYXAoKGJvZHk6IGFueSkgPT5cbiAgICAgICAgICAgICg8SHR0cENsaWVudD5zZWxmLmh0dHBDbGllbnQpXG4gICAgICAgICAgICAgICAgLnBvc3QobG9jYXRpb24sIGJvZHksIHtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VUeXBlOiAndGV4dCcsXG4gICAgICAgICAgICAgICAgICAgIG9ic2VydmU6ICdyZXNwb25zZSdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgICAgICBtYXAoKHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8YW55PikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sYXN0UmVzcG9uc2UgPSByZXNwb25zZS5ib2R5O1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sYXN0UmVzcG9uc2VIZWFkZXJzID0gcmVzcG9uc2UgJiYgcmVzcG9uc2UuaGVhZGVycztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZVN5bmMocmVzcG9uc2UuYm9keSwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICk7XG5cbiAgICBmdW5jdGlvbiBwYXJzZVN5bmMoYm9keSwgcmVzcG9uc2U6IEh0dHBSZXNwb25zZTxhbnk+KSB7XG4gICAgICAgIGxldCBvYmo7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBvYmogPSBzZWxmLndzZGwueG1sVG9PYmplY3QoYm9keSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAvLyAgV2hlbiB0aGUgb3V0cHV0IGVsZW1lbnQgY2Fubm90IGJlIGxvb2tlZCB1cCBpbiB0aGUgd3NkbCBhbmQgdGhlIGJvZHkgaXMgSlNPTlxuICAgICAgICAgICAgLy8gIGluc3RlYWQgb2Ygc2VuZGluZyB0aGUgZXJyb3IsIHdlIHBhc3MgdGhlIGJvZHkgaW4gdGhlIHJlc3BvbnNlLlxuICAgICAgICAgICAgaWYgKCFvdXRwdXQgfHwgIW91dHB1dC4kbG9va3VwVHlwZXMpIHtcbiAgICAgICAgICAgICAgICAvLyBkZWJ1ZygnUmVzcG9uc2UgZWxlbWVudCBpcyBub3QgcHJlc2VudC4gVW5hYmxlIHRvIGNvbnZlcnQgcmVzcG9uc2UgeG1sIHRvIGpzb24uJyk7XG4gICAgICAgICAgICAgICAgLy8gIElmIHRoZSByZXNwb25zZSBpcyBKU09OIHRoZW4gcmV0dXJuIGl0IGFzLWlzLlxuICAgICAgICAgICAgICAgIGNvbnN0IGpzb24gPSBfLmlzT2JqZWN0KGJvZHkpID8gYm9keSA6IHRyeUpTT05wYXJzZShib2R5KTtcbiAgICAgICAgICAgICAgICBpZiAoanNvbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBlcnI6IG51bGwsIHJlc3BvbnNlLCByZXNwb25zZUJvZHk6IGpzb24sIGhlYWRlcjogdW5kZWZpbmVkLCB4bWwgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgZXJyb3IuYm9keSA9IGJvZHk7XG4gICAgICAgICAgICAvLyBzZWxmLmVtaXQoJ3NvYXBFcnJvcicsIGVycm9yLCBlaWQpO1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpbmlzaChvYmosIGJvZHksIHJlc3BvbnNlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5pc2gob2JqLCByZXNwb25zZUJvZHksIHJlc3BvbnNlKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBudWxsO1xuXG4gICAgICAgIGlmICghb3V0cHV0KSB7XG4gICAgICAgICAgICAvLyBvbmUtd2F5LCBubyBvdXRwdXQgZXhwZWN0ZWRcbiAgICAgICAgICAgIHJldHVybiB7IGVycjogbnVsbCwgcmVzcG9uc2U6IG51bGwsIHJlc3BvbnNlQm9keSwgaGVhZGVyOiBvYmouSGVhZGVyLCB4bWwgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIGl0J3Mgbm90IEhUTUwgYW5kIFNvYXAgQm9keSBpcyBlbXB0eVxuICAgICAgICBpZiAoIW9iai5odG1sICYmICFvYmouQm9keSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgZXJyOiBudWxsLCBvYmosIHJlc3BvbnNlQm9keSwgaGVhZGVyOiBvYmouSGVhZGVyLCB4bWwgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqLkJvZHkgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBjb25zdCBlcnJvcjogYW55ID0gbmV3IEVycm9yKCdDYW5ub3QgcGFyc2UgcmVzcG9uc2UnKTtcbiAgICAgICAgICAgIGVycm9yLnJlc3BvbnNlID0gcmVzcG9uc2U7XG4gICAgICAgICAgICBlcnJvci5ib2R5ID0gcmVzcG9uc2VCb2R5O1xuICAgICAgICAgICAgcmV0dXJuIHsgZXJyOiBlcnJvciwgb2JqLCByZXNwb25zZUJvZHksIGhlYWRlcjogdW5kZWZpbmVkLCB4bWwgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdCA9IG9iai5Cb2R5W291dHB1dC4kbmFtZV07XG4gICAgICAgIC8vIFJQQy9saXRlcmFsIHJlc3BvbnNlIGJvZHkgbWF5IGNvbnRhaW4gZWxlbWVudHMgd2l0aCBhZGRlZCBzdWZmaXhlcyBJLkUuXG4gICAgICAgIC8vICdSZXNwb25zZScsIG9yICdPdXRwdXQnLCBvciAnT3V0J1xuICAgICAgICAvLyBUaGlzIGRvZXNuJ3QgbmVjZXNzYXJpbHkgZXF1YWwgdGhlIG91cHV0IG1lc3NhZ2UgbmFtZS4gU2VlIFdTREwgMS4xIFNlY3Rpb24gMi40LjVcbiAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IG9iai5Cb2R5W291dHB1dC4kbmFtZS5yZXBsYWNlKC8oPzpPdXQoPzpwdXQpP3xSZXNwb25zZSkkLywgJycpXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgWydSZXNwb25zZScsICdPdXQnLCAnT3V0cHV0J10uZm9yRWFjaChmdW5jdGlvbih0ZXJtKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iai5Cb2R5Lmhhc093blByb3BlcnR5KG5hbWUgKyB0ZXJtKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKHJlc3VsdCA9IG9iai5Cb2R5W25hbWUgKyB0ZXJtXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBlcnI6IG51bGwsIHJlc3VsdCwgcmVzcG9uc2VCb2R5LCBoZWFkZXI6IG9iai5IZWFkZXIsIHhtbCB9O1xuICAgIH1cbn07XG5cbkNsaWVudC5wcm90b3R5cGUuY2FsbCA9IGZ1bmN0aW9uKG1ldGhvZDogc3RyaW5nLCBib2R5OiBhbnksIG9wdGlvbnM/OiBhbnksIGV4dHJhSGVhZGVycz86IGFueSk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgaWYgKCF0aGlzW21ldGhvZF0pIHtcbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoYE1ldGhvZCAke21ldGhvZH0gbm90IGZvdW5kYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuICg8RnVuY3Rpb24+dGhpc1ttZXRob2RdKS5jYWxsKHRoaXMsIGJvZHksIG9wdGlvbnMsIGV4dHJhSGVhZGVycyk7XG59O1xuIl19