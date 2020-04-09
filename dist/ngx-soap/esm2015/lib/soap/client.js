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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXNvYXAvIiwic291cmNlcyI6WyJsaWIvc29hcC9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFNQSxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUNqQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ3JDLE9BQU8sS0FBSyxDQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzVCLE9BQU8sS0FBSyxNQUFNLFNBQVMsQ0FBQztBQUM1QixPQUFPLEVBQUUsSUFBSSxFQUFjLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNwRCxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtCQUFrQixDQUFDOztNQUU1QyxrQkFBa0IsR0FBRyxjQUFjOztBQUV6QyxNQUFNLE9BQU8sTUFBTSxHQUFHLFVBQVMsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPO0lBQ2xELE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO0lBQ3hCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ2pCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxtQkFBQSxPQUFPLENBQUMsVUFBVSxFQUFjLENBQUM7O1VBQzdDLGNBQWMsR0FBUSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUU7SUFDL0MsSUFBSSxPQUFPLENBQUMscUJBQXFCLEVBQUU7UUFDL0IsY0FBYyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUM7S0FDekQ7SUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxHQUFHLFVBQVMsVUFBVSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsS0FBSztJQUN4RSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtRQUNuQixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztLQUN6QjtJQUNELElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFO1FBQ2hDLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDaEY7SUFDRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqRCxDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixHQUFHLFVBQVMsS0FBSyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUs7SUFDbEYsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7UUFDbkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7S0FDekI7SUFDRCxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtRQUNoQyxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ2hGO0lBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxVQUFVLENBQUM7QUFDekMsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEdBQUc7SUFDOUIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0FBQzVCLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEdBQUc7SUFDaEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDNUIsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEdBQUcsVUFBUyxJQUFJLEVBQUUsS0FBSztJQUNqRCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtRQUNuQixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztLQUN6QjtJQUNELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ25DLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxHQUFHO0lBQzlCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztBQUM1QixDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixHQUFHO0lBQ2hDLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQzFCLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEdBQUcsVUFBUyxhQUFhLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLO0lBQzlFLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO1FBQ3RCLElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO0tBQzVCO0lBQ0QsSUFBSSxPQUFPLGFBQWEsS0FBSyxRQUFRLEVBQUU7O1lBQy9CLFdBQVcsR0FBRyxFQUFFO1FBQ3BCLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBUyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUs7WUFDdkUsV0FBVyxJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDakUsQ0FBQyxDQUFDLENBQUM7UUFDSCxhQUFhLEdBQUcsV0FBVyxDQUFDO0tBQy9CO0lBQ0QsSUFBSSxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHO1FBQUUsYUFBYSxHQUFHLEdBQUcsR0FBRyxhQUFhLENBQUM7SUFDNUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDNUMsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsR0FBRztJQUNqQyxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7QUFDL0IsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsR0FBRztJQUNuQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztBQUMvQixDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxVQUFTLFFBQVE7SUFDNUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDekIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZDLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHOztVQUNsQixLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSztJQUN6QyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztBQUN4QyxDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxVQUFTLFFBQVE7SUFDNUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFDN0IsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEdBQUcsVUFBUyxVQUFVO0lBQ2hELElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQ2pDLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEdBQUcsVUFBUyxRQUFROztVQUM5QyxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXOztVQUNyQyxRQUFRLEdBQUcsV0FBVyxDQUFDLFFBQVE7SUFDbkMsS0FBSyxNQUFNLElBQUksSUFBSSxRQUFRLEVBQUU7UUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQzlEO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsR0FBRyxVQUFTLE9BQU87SUFDbEQsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQ3BDLElBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQztJQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLGFBQWEsSUFBSSxZQUFZLENBQUM7SUFDeEUsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLElBQUksTUFBTSxDQUFDO0lBQzlELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUM7SUFDcEUsSUFBSSxPQUFPLENBQUMsaUJBQWlCLEtBQUssU0FBUyxFQUFFO1FBQ3pDLElBQUksT0FBTyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUU7WUFDbEQsSUFBSSxPQUFPLENBQUMsaUJBQWlCLENBQUMsUUFBUSxLQUFLLElBQUksRUFBRTtnQkFDN0MsSUFBSSxPQUFPLENBQUMsaUJBQWlCLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRTtvQkFDcEQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQztpQkFDOUU7YUFDSjtTQUNKO0tBQ0o7SUFDRCxJQUFJLE9BQU8sQ0FBQyxtQkFBbUIsS0FBSyxTQUFTLEVBQUU7UUFDM0MsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDO0tBQ3ZFO0lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztBQUN4RSxDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsR0FBRyxVQUFTLE9BQU8sRUFBRSxRQUFROztVQUNsRCxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUs7O1VBQ3ZCLEdBQUcsR0FBRyxFQUFFO0lBQ1osS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7UUFDdEIsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDekY7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFVBQVMsSUFBSSxFQUFFLFFBQVE7O1VBQzVDLFFBQVEsR0FBRyxRQUFROztVQUNyQixPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU87O1VBQ3RCLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTzs7VUFDekIsR0FBRyxHQUFHLEVBQUU7SUFDWixLQUFLLE1BQU0sSUFBSSxJQUFJLE9BQU8sRUFBRTtRQUN4QixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7O2NBQ2xELFVBQVUsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO1FBQ3JGLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDaEM7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxHQUFHLFVBQVMsTUFBTSxFQUFFLFFBQVE7O1VBQ2hELElBQUksR0FBRyxJQUFJOztRQUNiLElBQUksR0FBRyxJQUFJO0lBQ2YsT0FBTyxVQUFTLElBQUksRUFBRSxPQUFPLEVBQUUsWUFBWTtRQUN2QyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ3ZFLENBQUMsQ0FBQztBQUNOLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFVBQVMsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFlBQVk7O1FBQ3pFLElBQUksR0FBRyxJQUFJOztRQUNYLElBQUksR0FBRyxNQUFNLENBQUMsS0FBSzs7UUFDbkIsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLOztRQUNwQixNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU07O1FBQ3RCLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSzs7UUFDcEIsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVzs7UUFDNUIsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVc7O1FBQzNDLEVBQUUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCOztRQUMxQixRQUFRLEdBQUcsRUFBRTs7UUFDYixPQUFPLEdBQUcsRUFBRTs7UUFDWixHQUFHLEdBQUcsSUFBSTs7UUFDVixHQUFHLEdBQUcsSUFBSTs7UUFDVixVQUFVLEdBQUcsSUFBSTs7UUFDakIsS0FBSyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQzs7UUFDbEMsT0FBTyxHQUFRO1FBQ1gsY0FBYyxFQUFFLHlCQUF5QjtLQUM1Qzs7UUFDRCxTQUFTLEdBQUcsUUFBUSxHQUFHLFdBQVcsR0FBRyw4Q0FBOEM7SUFFdkYsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRTtRQUN0QyxPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUcscUNBQXFDLENBQUM7UUFDaEUsU0FBUyxHQUFHLFFBQVEsR0FBRyxXQUFXLEdBQUcsNENBQTRDLENBQUM7S0FDckY7SUFFRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7UUFDakIsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7S0FDaEM7U0FBTSxJQUFJLE1BQU0sQ0FBQyxVQUFVLEtBQUssU0FBUyxJQUFJLE1BQU0sQ0FBQyxVQUFVLEtBQUssSUFBSSxFQUFFO1FBQ3RFLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO0tBQ2xDO1NBQU07UUFDSCxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7S0FDL0U7SUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUU7UUFDdkMsT0FBTyxDQUFDLFVBQVUsR0FBRyxHQUFHLEdBQUcsVUFBVSxHQUFHLEdBQUcsQ0FBQztLQUMvQztJQUVELE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO0lBRXhCLG1CQUFtQjtJQUNuQixLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7UUFDbkMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDOUM7SUFDRCxLQUFLLE1BQU0sSUFBSSxJQUFJLFlBQVksRUFBRTtRQUM3QixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3RDO0lBRUQsMkNBQTJDO0lBQzNDLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVU7UUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqRixJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVO1FBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFakYsSUFBSSxLQUFLLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7UUFDL0UsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxLQUFLLEtBQUssS0FBSyxFQUFFLHVEQUF1RCxDQUFDLENBQUM7UUFDOUYsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDO1FBQ3BGLE1BQU0sQ0FBQyxTQUFTLEtBQUssU0FBUyxJQUFJLENBQUMsUUFBUSxHQUFHLGlFQUFpRSxDQUFDLENBQUM7S0FDcEg7U0FBTTtRQUNILE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksS0FBSyxLQUFLLFVBQVUsRUFBRSxrREFBa0QsQ0FBQyxDQUFDO1FBQzlGLCtEQUErRDtRQUMvRCxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDNUk7SUFDRCxHQUFHO1FBQ0Msd0NBQXdDO1lBQ3hDLEdBQUc7WUFDSCxXQUFXO1lBQ1gsWUFBWTtZQUNaLFNBQVM7WUFDVCxHQUFHO1lBQ0gsd0RBQXdEO1lBQ3hELFFBQVE7WUFDUixJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWU7WUFDekIsR0FBRztZQUNILENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsUUFBUTtnQkFDOUIsQ0FBQyxDQUFDLEdBQUc7b0JBQ0gsV0FBVztvQkFDWCxVQUFVO29CQUNWLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFDckQsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFDMUUsSUFBSTtvQkFDSixXQUFXO29CQUNYLFVBQVU7Z0JBQ1osQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUNULEdBQUc7WUFDSCxXQUFXO1lBQ1gsT0FBTztZQUNQLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUMxRCxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQzlELEdBQUc7WUFDSCxPQUFPO1lBQ1AsSUFBSTtZQUNKLFdBQVc7WUFDWCxRQUFRO1lBQ1IsSUFBSTtZQUNKLFdBQVc7WUFDWCxZQUFZLENBQUM7SUFFakIsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFO1FBQzVDLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUM7S0FDckQ7SUFFRCxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsV0FBVyxFQUFFO1FBQ2hDLEdBQUcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2xDO0lBRUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7SUFDM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7SUFDdkIsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUM7O1VBRXZCLFlBQVksR0FBRyxVQUFTLElBQUk7UUFDOUIsSUFBSTtZQUNBLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMzQjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsT0FBTyxTQUFTLENBQUM7U0FDcEI7SUFDTCxDQUFDO0lBRUQsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQy9ELEdBQUcsQ0FBQyxDQUFDLGVBQWlDLEVBQUUsRUFBRTtRQUN0QyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRTtZQUN6QixPQUFPLEdBQUcsQ0FBQztTQUNkO1FBRUQsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFOztrQkFDM0MsS0FBSyxHQUFHLEtBQUssRUFBRTs7a0JBQ2YsT0FBTyxHQUFHLEtBQUssRUFBRTs7Z0JBQ25CLE1BQU0sR0FBRyxJQUFJO1lBQ2pCLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtnQkFDaEQsS0FBSyxNQUFNLEVBQUUsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNsRCxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7d0JBQzNCLE1BQU0sR0FBRyxFQUFFLENBQUM7cUJBQ2Y7aUJBQ0o7YUFDSjtZQUVELE9BQU8sQ0FBQyxjQUFjLENBQUM7Z0JBQ25CLHlEQUF5RCxHQUFHLEtBQUssR0FBRyx1Q0FBdUMsR0FBRyxPQUFPLEdBQUcsR0FBRyxDQUFDO1lBQ2hJLElBQUksTUFBTSxFQUFFO2dCQUNSLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQzthQUNyRTs7a0JBRUssU0FBUyxHQUFVO2dCQUNyQjtvQkFDSSxjQUFjLEVBQUUscURBQXFEO29CQUNyRSxZQUFZLEVBQUUsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHO29CQUMvQixJQUFJLEVBQUUsR0FBRztpQkFDWjthQUNKO1lBRUQsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQTBCLEVBQUUsRUFBRTtnQkFDbkQsU0FBUyxDQUFDLElBQUksQ0FBQztvQkFDWCxjQUFjLEVBQUUsVUFBVSxDQUFDLFFBQVEsR0FBRyxHQUFHO29CQUN6QywyQkFBMkIsRUFBRSxRQUFRO29CQUNyQyxZQUFZLEVBQUUsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLFNBQVMsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRztvQkFDbkUscUJBQXFCLEVBQUUsb0JBQW9CLEdBQUcsVUFBVSxDQUFDLElBQUksR0FBRyxlQUFlLEdBQUcsVUFBVSxDQUFDLElBQUksR0FBRyxHQUFHO29CQUN2RyxJQUFJLEVBQUUsVUFBVSxDQUFDLElBQUk7aUJBQ3hCLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1lBRUgsT0FBTyxJQUFJLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDcEQ7SUFDTCxDQUFDLENBQUMsRUFDRixPQUFPLENBQUMsQ0FBQyxJQUFTLEVBQUUsRUFBRSxDQUNsQixDQUFDLG1CQUFZLElBQUksQ0FBQyxVQUFVLEVBQUEsQ0FBQztTQUN4QixJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRTtRQUNsQixPQUFPLEVBQUUsT0FBTztRQUNoQixZQUFZLEVBQUUsTUFBTTtRQUNwQixPQUFPLEVBQUUsVUFBVTtLQUN0QixDQUFDO1NBQ0QsSUFBSSxDQUNELEdBQUcsQ0FBQyxDQUFDLFFBQTJCLEVBQUUsRUFBRTtRQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFDbEMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLFFBQVEsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDO1FBQ3hELE9BQU8sU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDOUMsQ0FBQyxDQUFDLENBQ0wsQ0FDUixDQUNKLENBQUM7Ozs7OztJQUVGLFNBQVMsU0FBUyxDQUFDLElBQUksRUFBRSxRQUEyQjs7WUFDNUMsR0FBRztRQUNQLElBQUk7WUFDQSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDckM7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNaLGdGQUFnRjtZQUNoRixtRUFBbUU7WUFDbkUsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7Ozs7c0JBRzNCLElBQUksR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7Z0JBQ3pELElBQUksSUFBSSxFQUFFO29CQUNOLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUM7aUJBQzlFO2FBQ0o7WUFDRCxLQUFLLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztZQUMxQixLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNsQixzQ0FBc0M7WUFDdEMsTUFBTSxLQUFLLENBQUM7U0FDZjtRQUNELE9BQU8sTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdkMsQ0FBQzs7Ozs7OztJQUVELFNBQVMsTUFBTSxDQUFDLEdBQUcsRUFBRSxZQUFZLEVBQUUsUUFBUTs7WUFDbkMsTUFBTSxHQUFHLElBQUk7UUFFakIsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNULDhCQUE4QjtZQUM5QixPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQztTQUMvRTtRQUVELDBDQUEwQztRQUMxQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7WUFDeEIsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQztTQUNwRTtRQUVELElBQUksT0FBTyxHQUFHLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTs7a0JBQ3hCLEtBQUssR0FBUSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQztZQUNyRCxLQUFLLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztZQUMxQixLQUFLLENBQUMsSUFBSSxHQUFHLFlBQVksQ0FBQztZQUMxQixPQUFPLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUM7U0FDcEU7UUFFRCxNQUFNLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsMEVBQTBFO1FBQzFFLG9DQUFvQztRQUNwQyxvRkFBb0Y7UUFDcEYsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNULE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLDJCQUEyQixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDNUU7UUFDRCxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1QsQ0FBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFTLElBQUk7Z0JBQy9DLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFO29CQUN0QyxPQUFPLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7aUJBQzNDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7U0FDTjtRQUVELE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDeEUsQ0FBQztBQUNMLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFVBQVMsTUFBYyxFQUFFLElBQVMsRUFBRSxPQUFhLEVBQUUsWUFBa0I7SUFDekYsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNmLE9BQU8sVUFBVSxDQUFDLFVBQVUsTUFBTSxZQUFZLENBQUMsQ0FBQztLQUNuRDtJQUVELE9BQU8sQ0FBQyxtQkFBVSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztBQUM1RSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTEgVmluYXkgUHVsaW0gPHZpbmF5QG1pbGV3aXNlLmNvbT5cclxuICogTUlUIExpY2Vuc2VkXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cFJlc3BvbnNlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgKiBhcyBhc3NlcnQgZnJvbSAnYXNzZXJ0JztcclxuaW1wb3J0IHsgZmluZFByZWZpeCB9IGZyb20gJy4vdXRpbHMnO1xyXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB1dWlkNCBmcm9tICd1dWlkL3Y0JztcclxuaW1wb3J0IHsgZnJvbSwgT2JzZXJ2YWJsZSwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBmbGF0TWFwLCBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IE11bHRpcGFydCB9IGZyb20gJy4vbXVsdGlwYXJ0JztcclxuaW1wb3J0IHsgU29hcEF0dGFjaG1lbnQgfSBmcm9tICcuL3NvYXBBdHRhY2htZW50JztcclxuXHJcbmNvbnN0IG5vbklkZW50aWZpZXJDaGFycyA9IC9bXmEteiRfMC05XS9pO1xyXG5cclxuZXhwb3J0IGNvbnN0IENsaWVudCA9IGZ1bmN0aW9uKHdzZGwsIGVuZHBvaW50LCBvcHRpb25zKSB7XHJcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgIHRoaXMud3NkbCA9IHdzZGw7XHJcbiAgICB0aGlzLl9pbml0aWFsaXplT3B0aW9ucyhvcHRpb25zKTtcclxuICAgIHRoaXMuX2luaXRpYWxpemVTZXJ2aWNlcyhlbmRwb2ludCk7XHJcbiAgICB0aGlzLmh0dHBDbGllbnQgPSBvcHRpb25zLmh0dHBDbGllbnQgYXMgSHR0cENsaWVudDtcclxuICAgIGNvbnN0IHByb21pc2VPcHRpb25zOiBhbnkgPSB7IG11bHRpQXJnczogdHJ1ZSB9O1xyXG4gICAgaWYgKG9wdGlvbnMub3ZlcnJpZGVQcm9taXNlU3VmZml4KSB7XHJcbiAgICAgICAgcHJvbWlzZU9wdGlvbnMuc3VmZml4ID0gb3B0aW9ucy5vdmVycmlkZVByb21pc2VTdWZmaXg7XHJcbiAgICB9XHJcbiAgICBQcm9taXNlLmFsbChbdGhpcywgcHJvbWlzZU9wdGlvbnNdKTtcclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuYWRkU29hcEhlYWRlciA9IGZ1bmN0aW9uKHNvYXBIZWFkZXIsIG5hbWUsIG5hbWVzcGFjZSwgeG1sbnMpIHtcclxuICAgIGlmICghdGhpcy5zb2FwSGVhZGVycykge1xyXG4gICAgICAgIHRoaXMuc29hcEhlYWRlcnMgPSBbXTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2Ygc29hcEhlYWRlciA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICBzb2FwSGVhZGVyID0gdGhpcy53c2RsLm9iamVjdFRvWE1MKHNvYXBIZWFkZXIsIG5hbWUsIG5hbWVzcGFjZSwgeG1sbnMsIHRydWUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuc29hcEhlYWRlcnMucHVzaChzb2FwSGVhZGVyKSAtIDE7XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLmNoYW5nZVNvYXBIZWFkZXIgPSBmdW5jdGlvbihpbmRleCwgc29hcEhlYWRlciwgbmFtZSwgbmFtZXNwYWNlLCB4bWxucykge1xyXG4gICAgaWYgKCF0aGlzLnNvYXBIZWFkZXJzKSB7XHJcbiAgICAgICAgdGhpcy5zb2FwSGVhZGVycyA9IFtdO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBzb2FwSGVhZGVyID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIHNvYXBIZWFkZXIgPSB0aGlzLndzZGwub2JqZWN0VG9YTUwoc29hcEhlYWRlciwgbmFtZSwgbmFtZXNwYWNlLCB4bWxucywgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnNvYXBIZWFkZXJzW2luZGV4XSA9IHNvYXBIZWFkZXI7XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLmdldFNvYXBIZWFkZXJzID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zb2FwSGVhZGVycztcclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuY2xlYXJTb2FwSGVhZGVycyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5zb2FwSGVhZGVycyA9IG51bGw7XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLmFkZEh0dHBIZWFkZXIgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xyXG4gICAgaWYgKCF0aGlzLmh0dHBIZWFkZXJzKSB7XHJcbiAgICAgICAgdGhpcy5odHRwSGVhZGVycyA9IHt9O1xyXG4gICAgfVxyXG4gICAgdGhpcy5odHRwSGVhZGVyc1tuYW1lXSA9IHZhbHVlO1xyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5nZXRIdHRwSGVhZGVycyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cEhlYWRlcnM7XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLmNsZWFySHR0cEhlYWRlcnMgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuaHR0cEhlYWRlcnMgPSB7fTtcclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuYWRkQm9keUF0dHJpYnV0ZSA9IGZ1bmN0aW9uKGJvZHlBdHRyaWJ1dGUsIG5hbWUsIG5hbWVzcGFjZSwgeG1sbnMpIHtcclxuICAgIGlmICghdGhpcy5ib2R5QXR0cmlidXRlcykge1xyXG4gICAgICAgIHRoaXMuYm9keUF0dHJpYnV0ZXMgPSBbXTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgYm9keUF0dHJpYnV0ZSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICBsZXQgY29tcG9zaXRpb24gPSAnJztcclxuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhib2R5QXR0cmlidXRlKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3AsIGlkeCwgYXJyYXkpIHtcclxuICAgICAgICAgICAgY29tcG9zaXRpb24gKz0gJyAnICsgcHJvcCArICc9XCInICsgYm9keUF0dHJpYnV0ZVtwcm9wXSArICdcIic7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYm9keUF0dHJpYnV0ZSA9IGNvbXBvc2l0aW9uO1xyXG4gICAgfVxyXG4gICAgaWYgKGJvZHlBdHRyaWJ1dGUuc3Vic3RyKDAsIDEpICE9PSAnICcpIGJvZHlBdHRyaWJ1dGUgPSAnICcgKyBib2R5QXR0cmlidXRlO1xyXG4gICAgdGhpcy5ib2R5QXR0cmlidXRlcy5wdXNoKGJvZHlBdHRyaWJ1dGUpO1xyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5nZXRCb2R5QXR0cmlidXRlcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYm9keUF0dHJpYnV0ZXM7XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLmNsZWFyQm9keUF0dHJpYnV0ZXMgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuYm9keUF0dHJpYnV0ZXMgPSBudWxsO1xyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5zZXRFbmRwb2ludCA9IGZ1bmN0aW9uKGVuZHBvaW50KSB7XHJcbiAgICB0aGlzLmVuZHBvaW50ID0gZW5kcG9pbnQ7XHJcbiAgICB0aGlzLl9pbml0aWFsaXplU2VydmljZXMoZW5kcG9pbnQpO1xyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5kZXNjcmliZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgdHlwZXMgPSB0aGlzLndzZGwuZGVmaW5pdGlvbnMudHlwZXM7XHJcbiAgICByZXR1cm4gdGhpcy53c2RsLmRlc2NyaWJlU2VydmljZXMoKTtcclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuc2V0U2VjdXJpdHkgPSBmdW5jdGlvbihzZWN1cml0eSkge1xyXG4gICAgdGhpcy5zZWN1cml0eSA9IHNlY3VyaXR5O1xyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5zZXRTT0FQQWN0aW9uID0gZnVuY3Rpb24oU09BUEFjdGlvbikge1xyXG4gICAgdGhpcy5TT0FQQWN0aW9uID0gU09BUEFjdGlvbjtcclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuX2luaXRpYWxpemVTZXJ2aWNlcyA9IGZ1bmN0aW9uKGVuZHBvaW50KSB7XHJcbiAgICBjb25zdCBkZWZpbml0aW9ucyA9IHRoaXMud3NkbC5kZWZpbml0aW9ucyxcclxuICAgICAgICBzZXJ2aWNlcyA9IGRlZmluaXRpb25zLnNlcnZpY2VzO1xyXG4gICAgZm9yIChjb25zdCBuYW1lIGluIHNlcnZpY2VzKSB7XHJcbiAgICAgICAgdGhpc1tuYW1lXSA9IHRoaXMuX2RlZmluZVNlcnZpY2Uoc2VydmljZXNbbmFtZV0sIGVuZHBvaW50KTtcclxuICAgIH1cclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuX2luaXRpYWxpemVPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG4gICAgdGhpcy5zdHJlYW1BbGxvd2VkID0gb3B0aW9ucy5zdHJlYW07XHJcbiAgICB0aGlzLm5vcm1hbGl6ZU5hbWVzID0gb3B0aW9ucy5ub3JtYWxpemVOYW1lcztcclxuICAgIHRoaXMud3NkbC5vcHRpb25zLmF0dHJpYnV0ZXNLZXkgPSBvcHRpb25zLmF0dHJpYnV0ZXNLZXkgfHwgJ2F0dHJpYnV0ZXMnO1xyXG4gICAgdGhpcy53c2RsLm9wdGlvbnMuZW52ZWxvcGVLZXkgPSBvcHRpb25zLmVudmVsb3BlS2V5IHx8ICdzb2FwJztcclxuICAgIHRoaXMud3NkbC5vcHRpb25zLnByZXNlcnZlV2hpdGVzcGFjZSA9ICEhb3B0aW9ucy5wcmVzZXJ2ZVdoaXRlc3BhY2U7XHJcbiAgICBpZiAob3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMub3ZlcnJpZGUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcy5vdmVycmlkZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMubmFtZXNwYWNlcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53c2RsLm9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMgPSBvcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzLm5hbWVzcGFjZXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAob3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLndzZGwub3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50ID0gb3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50O1xyXG4gICAgfVxyXG4gICAgdGhpcy53c2RsLm9wdGlvbnMuZm9yY2VTb2FwMTJIZWFkZXJzID0gISFvcHRpb25zLmZvcmNlU29hcDEySGVhZGVycztcclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuX2RlZmluZVNlcnZpY2UgPSBmdW5jdGlvbihzZXJ2aWNlLCBlbmRwb2ludCkge1xyXG4gICAgY29uc3QgcG9ydHMgPSBzZXJ2aWNlLnBvcnRzLFxyXG4gICAgICAgIGRlZiA9IHt9O1xyXG4gICAgZm9yIChjb25zdCBuYW1lIGluIHBvcnRzKSB7XHJcbiAgICAgICAgZGVmW25hbWVdID0gdGhpcy5fZGVmaW5lUG9ydChwb3J0c1tuYW1lXSwgZW5kcG9pbnQgPyBlbmRwb2ludCA6IHBvcnRzW25hbWVdLmxvY2F0aW9uKTtcclxuICAgIH1cclxuICAgIHJldHVybiBkZWY7XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLl9kZWZpbmVQb3J0ID0gZnVuY3Rpb24ocG9ydCwgZW5kcG9pbnQpIHtcclxuICAgIGNvbnN0IGxvY2F0aW9uID0gZW5kcG9pbnQsXHJcbiAgICAgICAgYmluZGluZyA9IHBvcnQuYmluZGluZyxcclxuICAgICAgICBtZXRob2RzID0gYmluZGluZy5tZXRob2RzLFxyXG4gICAgICAgIGRlZiA9IHt9O1xyXG4gICAgZm9yIChjb25zdCBuYW1lIGluIG1ldGhvZHMpIHtcclxuICAgICAgICBkZWZbbmFtZV0gPSB0aGlzLl9kZWZpbmVNZXRob2QobWV0aG9kc1tuYW1lXSwgbG9jYXRpb24pO1xyXG4gICAgICAgIGNvbnN0IG1ldGhvZE5hbWUgPSB0aGlzLm5vcm1hbGl6ZU5hbWVzID8gbmFtZS5yZXBsYWNlKG5vbklkZW50aWZpZXJDaGFycywgJ18nKSA6IG5hbWU7XHJcbiAgICAgICAgdGhpc1ttZXRob2ROYW1lXSA9IGRlZltuYW1lXTtcclxuICAgIH1cclxuICAgIHJldHVybiBkZWY7XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLl9kZWZpbmVNZXRob2QgPSBmdW5jdGlvbihtZXRob2QsIGxvY2F0aW9uKSB7XHJcbiAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgIGxldCB0ZW1wID0gbnVsbDtcclxuICAgIHJldHVybiBmdW5jdGlvbihhcmdzLCBvcHRpb25zLCBleHRyYUhlYWRlcnMpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBzZWxmLl9pbnZva2UobWV0aG9kLCBhcmdzLCBsb2NhdGlvbiwgb3B0aW9ucywgZXh0cmFIZWFkZXJzKTtcclxuICAgIH07XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLl9pbnZva2UgPSBmdW5jdGlvbihtZXRob2QsIGFyZ3MsIGxvY2F0aW9uLCBvcHRpb25zLCBleHRyYUhlYWRlcnMpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHNlbGYgPSB0aGlzLFxyXG4gICAgICAgIG5hbWUgPSBtZXRob2QuJG5hbWUsXHJcbiAgICAgICAgaW5wdXQgPSBtZXRob2QuaW5wdXQsXHJcbiAgICAgICAgb3V0cHV0ID0gbWV0aG9kLm91dHB1dCxcclxuICAgICAgICBzdHlsZSA9IG1ldGhvZC5zdHlsZSxcclxuICAgICAgICBkZWZzID0gdGhpcy53c2RsLmRlZmluaXRpb25zLFxyXG4gICAgICAgIGVudmVsb3BlS2V5ID0gdGhpcy53c2RsLm9wdGlvbnMuZW52ZWxvcGVLZXksXHJcbiAgICAgICAgbnMgPSBkZWZzLiR0YXJnZXROYW1lc3BhY2UsXHJcbiAgICAgICAgZW5jb2RpbmcgPSAnJyxcclxuICAgICAgICBtZXNzYWdlID0gJycsXHJcbiAgICAgICAgeG1sID0gbnVsbCxcclxuICAgICAgICByZXEgPSBudWxsLFxyXG4gICAgICAgIHNvYXBBY3Rpb24gPSBudWxsLFxyXG4gICAgICAgIGFsaWFzID0gZmluZFByZWZpeChkZWZzLnhtbG5zLCBucyksXHJcbiAgICAgICAgaGVhZGVyczogYW55ID0ge1xyXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ3RleHQveG1sOyBjaGFyc2V0PXV0Zi04J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgeG1sbnNTb2FwID0gJ3htbG5zOicgKyBlbnZlbG9wZUtleSArICc9XCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy9zb2FwL2VudmVsb3BlL1wiJztcclxuXHJcbiAgICBpZiAodGhpcy53c2RsLm9wdGlvbnMuZm9yY2VTb2FwMTJIZWFkZXJzKSB7XHJcbiAgICAgICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24vc29hcCt4bWw7IGNoYXJzZXQ9dXRmLTgnO1xyXG4gICAgICAgIHhtbG5zU29hcCA9ICd4bWxuczonICsgZW52ZWxvcGVLZXkgKyAnPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMy8wNS9zb2FwLWVudmVsb3BlXCInO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLlNPQVBBY3Rpb24pIHtcclxuICAgICAgICBzb2FwQWN0aW9uID0gdGhpcy5TT0FQQWN0aW9uO1xyXG4gICAgfSBlbHNlIGlmIChtZXRob2Quc29hcEFjdGlvbiAhPT0gdW5kZWZpbmVkICYmIG1ldGhvZC5zb2FwQWN0aW9uICE9PSBudWxsKSB7XHJcbiAgICAgICAgc29hcEFjdGlvbiA9IG1ldGhvZC5zb2FwQWN0aW9uO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBzb2FwQWN0aW9uID0gKG5zLmxhc3RJbmRleE9mKCcvJykgIT09IG5zLmxlbmd0aCAtIDEgPyBucyArICcvJyA6IG5zKSArIG5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLndzZGwub3B0aW9ucy5mb3JjZVNvYXAxMkhlYWRlcnMpIHtcclxuICAgICAgICBoZWFkZXJzLlNPQVBBY3Rpb24gPSAnXCInICsgc29hcEFjdGlvbiArICdcIic7XHJcbiAgICB9XHJcblxyXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblxyXG4gICAgLy9BZGQgZXh0cmEgaGVhZGVyc1xyXG4gICAgZm9yIChjb25zdCBoZWFkZXIgaW4gdGhpcy5odHRwSGVhZGVycykge1xyXG4gICAgICAgIGhlYWRlcnNbaGVhZGVyXSA9IHRoaXMuaHR0cEhlYWRlcnNbaGVhZGVyXTtcclxuICAgIH1cclxuICAgIGZvciAoY29uc3QgYXR0ciBpbiBleHRyYUhlYWRlcnMpIHtcclxuICAgICAgICBoZWFkZXJzW2F0dHJdID0gZXh0cmFIZWFkZXJzW2F0dHJdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEFsbG93IHRoZSBzZWN1cml0eSBvYmplY3QgdG8gYWRkIGhlYWRlcnNcclxuICAgIGlmIChzZWxmLnNlY3VyaXR5ICYmIHNlbGYuc2VjdXJpdHkuYWRkSGVhZGVycykgc2VsZi5zZWN1cml0eS5hZGRIZWFkZXJzKGhlYWRlcnMpO1xyXG4gICAgaWYgKHNlbGYuc2VjdXJpdHkgJiYgc2VsZi5zZWN1cml0eS5hZGRPcHRpb25zKSBzZWxmLnNlY3VyaXR5LmFkZE9wdGlvbnMob3B0aW9ucyk7XHJcblxyXG4gICAgaWYgKHN0eWxlID09PSAncnBjJyAmJiAoaW5wdXQucGFydHMgfHwgaW5wdXQubmFtZSA9PT0gJ2VsZW1lbnQnIHx8IGFyZ3MgPT09IG51bGwpKSB7XHJcbiAgICAgICAgYXNzZXJ0Lm9rKCFzdHlsZSB8fCBzdHlsZSA9PT0gJ3JwYycsICdpbnZhbGlkIG1lc3NhZ2UgZGVmaW5pdGlvbiBmb3IgZG9jdW1lbnQgc3R5bGUgYmluZGluZycpO1xyXG4gICAgICAgIG1lc3NhZ2UgPSBzZWxmLndzZGwub2JqZWN0VG9ScGNYTUwobmFtZSwgYXJncywgYWxpYXMsIG5zLCBpbnB1dC5uYW1lICE9PSAnZWxlbWVudCcpO1xyXG4gICAgICAgIG1ldGhvZC5pbnB1dFNvYXAgPT09ICdlbmNvZGVkJyAmJiAoZW5jb2RpbmcgPSAnc29hcDplbmNvZGluZ1N0eWxlPVwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbmNvZGluZy9cIiAnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYXNzZXJ0Lm9rKCFzdHlsZSB8fCBzdHlsZSA9PT0gJ2RvY3VtZW50JywgJ2ludmFsaWQgbWVzc2FnZSBkZWZpbml0aW9uIGZvciBycGMgc3R5bGUgYmluZGluZycpO1xyXG4gICAgICAgIC8vIHBhc3MgYGlucHV0LiRsb29rdXBUeXBlYCBpZiBgaW5wdXQuJHR5cGVgIGNvdWxkIG5vdCBiZSBmb3VuZFxyXG4gICAgICAgIG1lc3NhZ2UgPSBzZWxmLndzZGwub2JqZWN0VG9Eb2N1bWVudFhNTChpbnB1dC4kbmFtZSwgYXJncywgaW5wdXQudGFyZ2V0TlNBbGlhcywgaW5wdXQudGFyZ2V0TmFtZXNwYWNlLCBpbnB1dC4kdHlwZSB8fCBpbnB1dC4kbG9va3VwVHlwZSk7XHJcbiAgICB9XHJcbiAgICB4bWwgPVxyXG4gICAgICAgICc8P3htbCB2ZXJzaW9uPVwiMS4wXCIgZW5jb2Rpbmc9XCJ1dGYtOFwiPz4nICtcclxuICAgICAgICAnPCcgK1xyXG4gICAgICAgIGVudmVsb3BlS2V5ICtcclxuICAgICAgICAnOkVudmVsb3BlICcgK1xyXG4gICAgICAgIHhtbG5zU29hcCArXHJcbiAgICAgICAgJyAnICtcclxuICAgICAgICAneG1sbnM6eHNpPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2VcIiAnICtcclxuICAgICAgICBlbmNvZGluZyArXHJcbiAgICAgICAgdGhpcy53c2RsLnhtbG5zSW5FbnZlbG9wZSArXHJcbiAgICAgICAgJz4nICtcclxuICAgICAgICAoc2VsZi5zb2FwSGVhZGVycyB8fCBzZWxmLnNlY3VyaXR5XHJcbiAgICAgICAgICAgID8gJzwnICtcclxuICAgICAgICAgICAgICBlbnZlbG9wZUtleSArXHJcbiAgICAgICAgICAgICAgJzpIZWFkZXI+JyArXHJcbiAgICAgICAgICAgICAgKHNlbGYuc29hcEhlYWRlcnMgPyBzZWxmLnNvYXBIZWFkZXJzLmpvaW4oJ1xcbicpIDogJycpICtcclxuICAgICAgICAgICAgICAoc2VsZi5zZWN1cml0eSAmJiAhc2VsZi5zZWN1cml0eS5wb3N0UHJvY2VzcyA/IHNlbGYuc2VjdXJpdHkudG9YTUwoKSA6ICcnKSArXHJcbiAgICAgICAgICAgICAgJzwvJyArXHJcbiAgICAgICAgICAgICAgZW52ZWxvcGVLZXkgK1xyXG4gICAgICAgICAgICAgICc6SGVhZGVyPidcclxuICAgICAgICAgICAgOiAnJykgK1xyXG4gICAgICAgICc8JyArXHJcbiAgICAgICAgZW52ZWxvcGVLZXkgK1xyXG4gICAgICAgICc6Qm9keScgK1xyXG4gICAgICAgIChzZWxmLmJvZHlBdHRyaWJ1dGVzID8gc2VsZi5ib2R5QXR0cmlidXRlcy5qb2luKCcgJykgOiAnJykgK1xyXG4gICAgICAgIChzZWxmLnNlY3VyaXR5ICYmIHNlbGYuc2VjdXJpdHkucG9zdFByb2Nlc3MgPyAnIElkPVwiXzBcIicgOiAnJykgK1xyXG4gICAgICAgICc+JyArXHJcbiAgICAgICAgbWVzc2FnZSArXHJcbiAgICAgICAgJzwvJyArXHJcbiAgICAgICAgZW52ZWxvcGVLZXkgK1xyXG4gICAgICAgICc6Qm9keT4nICtcclxuICAgICAgICAnPC8nICtcclxuICAgICAgICBlbnZlbG9wZUtleSArXHJcbiAgICAgICAgJzpFbnZlbG9wZT4nO1xyXG5cclxuICAgIGlmIChzZWxmLnNlY3VyaXR5ICYmIHNlbGYuc2VjdXJpdHkucG9zdFByb2Nlc3MpIHtcclxuICAgICAgICB4bWwgPSBzZWxmLnNlY3VyaXR5LnBvc3RQcm9jZXNzKHhtbCwgZW52ZWxvcGVLZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMucG9zdFByb2Nlc3MpIHtcclxuICAgICAgICB4bWwgPSBvcHRpb25zLnBvc3RQcm9jZXNzKHhtbCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5sYXN0TWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICBzZWxmLmxhc3RSZXF1ZXN0ID0geG1sO1xyXG4gICAgc2VsZi5sYXN0RW5kcG9pbnQgPSBsb2NhdGlvbjtcclxuXHJcbiAgICBjb25zdCB0cnlKU09OcGFyc2UgPSBmdW5jdGlvbihib2R5KSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoYm9keSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZnJvbShTb2FwQXR0YWNobWVudC5mcm9tRm9ybUZpbGVzKG9wdGlvbnMuYXR0YWNobWVudHMpKS5waXBlKFxyXG4gICAgICAgIG1hcCgoc29hcEF0dGFjaG1lbnRzOiBTb2FwQXR0YWNobWVudFtdKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghc29hcEF0dGFjaG1lbnRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHhtbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZm9yY2VNVE9NIHx8IHNvYXBBdHRhY2htZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFydCA9IHV1aWQ0KCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBib3VuZHJ5ID0gdXVpZDQoKTtcclxuICAgICAgICAgICAgICAgIGxldCBhY3Rpb24gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYgKGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddLmluZGV4T2YoJ2FjdGlvbicpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGN0IG9mIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddLnNwbGl0KCc7ICcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdC5pbmRleE9mKCdhY3Rpb24nKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb24gPSBjdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9XHJcbiAgICAgICAgICAgICAgICAgICAgJ211bHRpcGFydC9yZWxhdGVkOyB0eXBlPVwiYXBwbGljYXRpb24veG9wK3htbFwiOyBzdGFydD1cIjwnICsgc3RhcnQgKyAnPlwiOyBzdGFydC1pbmZvPVwidGV4dC94bWxcIjsgYm91bmRhcnk9XCInICsgYm91bmRyeSArICdcIic7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSBoZWFkZXJzWydDb250ZW50LVR5cGUnXSArICc7ICcgKyBhY3Rpb247XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbXVsdGlwYXJ0OiBhbnlbXSA9IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veG9wK3htbDsgY2hhcnNldD1VVEYtODsgdHlwZT1cInRleHQveG1sXCInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1JRCc6ICc8JyArIHN0YXJ0ICsgJz4nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5OiB4bWxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgICAgIHNvYXBBdHRhY2htZW50cy5mb3JFYWNoKChhdHRhY2htZW50OiBTb2FwQXR0YWNobWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG11bHRpcGFydC5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6IGF0dGFjaG1lbnQubWltZXR5cGUgKyAnOycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdDb250ZW50LVRyYW5zZmVyLUVuY29kaW5nJzogJ2JpbmFyeScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdDb250ZW50LUlEJzogJzwnICsgKGF0dGFjaG1lbnQuY29udGVudElkIHx8IGF0dGFjaG1lbnQubmFtZSkgKyAnPicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdDb250ZW50LURpc3Bvc2l0aW9uJzogJ2F0dGFjaG1lbnQ7IG5hbWU9XCInICsgYXR0YWNobWVudC5uYW1lICsgJ1wiOyBmaWxlbmFtZT1cIicgKyBhdHRhY2htZW50Lm5hbWUgKyAnXCInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5OiBhdHRhY2htZW50LmJvZHlcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTXVsdGlwYXJ0KCkuYnVpbGQobXVsdGlwYXJ0LCBib3VuZHJ5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGZsYXRNYXAoKGJvZHk6IGFueSkgPT5cclxuICAgICAgICAgICAgKDxIdHRwQ2xpZW50PnNlbGYuaHR0cENsaWVudClcclxuICAgICAgICAgICAgICAgIC5wb3N0KGxvY2F0aW9uLCBib2R5LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZVR5cGU6ICd0ZXh0JyxcclxuICAgICAgICAgICAgICAgICAgICBvYnNlcnZlOiAncmVzcG9uc2UnXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnBpcGUoXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwKChyZXNwb25zZTogSHR0cFJlc3BvbnNlPGFueT4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sYXN0UmVzcG9uc2UgPSByZXNwb25zZS5ib2R5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmxhc3RSZXNwb25zZUhlYWRlcnMgPSByZXNwb25zZSAmJiByZXNwb25zZS5oZWFkZXJzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VTeW5jKHJlc3BvbnNlLmJvZHksIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgIClcclxuICAgICk7XHJcblxyXG4gICAgZnVuY3Rpb24gcGFyc2VTeW5jKGJvZHksIHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8YW55Pikge1xyXG4gICAgICAgIGxldCBvYmo7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgb2JqID0gc2VsZi53c2RsLnhtbFRvT2JqZWN0KGJvZHkpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIC8vICBXaGVuIHRoZSBvdXRwdXQgZWxlbWVudCBjYW5ub3QgYmUgbG9va2VkIHVwIGluIHRoZSB3c2RsIGFuZCB0aGUgYm9keSBpcyBKU09OXHJcbiAgICAgICAgICAgIC8vICBpbnN0ZWFkIG9mIHNlbmRpbmcgdGhlIGVycm9yLCB3ZSBwYXNzIHRoZSBib2R5IGluIHRoZSByZXNwb25zZS5cclxuICAgICAgICAgICAgaWYgKCFvdXRwdXQgfHwgIW91dHB1dC4kbG9va3VwVHlwZXMpIHtcclxuICAgICAgICAgICAgICAgIC8vIGRlYnVnKCdSZXNwb25zZSBlbGVtZW50IGlzIG5vdCBwcmVzZW50LiBVbmFibGUgdG8gY29udmVydCByZXNwb25zZSB4bWwgdG8ganNvbi4nKTtcclxuICAgICAgICAgICAgICAgIC8vICBJZiB0aGUgcmVzcG9uc2UgaXMgSlNPTiB0aGVuIHJldHVybiBpdCBhcy1pcy5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGpzb24gPSBfLmlzT2JqZWN0KGJvZHkpID8gYm9keSA6IHRyeUpTT05wYXJzZShib2R5KTtcclxuICAgICAgICAgICAgICAgIGlmIChqc29uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgZXJyOiBudWxsLCByZXNwb25zZSwgcmVzcG9uc2VCb2R5OiBqc29uLCBoZWFkZXI6IHVuZGVmaW5lZCwgeG1sIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgZXJyb3IuYm9keSA9IGJvZHk7XHJcbiAgICAgICAgICAgIC8vIHNlbGYuZW1pdCgnc29hcEVycm9yJywgZXJyb3IsIGVpZCk7XHJcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmluaXNoKG9iaiwgYm9keSwgcmVzcG9uc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGZpbmlzaChvYmosIHJlc3BvbnNlQm9keSwgcmVzcG9uc2UpIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKCFvdXRwdXQpIHtcclxuICAgICAgICAgICAgLy8gb25lLXdheSwgbm8gb3V0cHV0IGV4cGVjdGVkXHJcbiAgICAgICAgICAgIHJldHVybiB7IGVycjogbnVsbCwgcmVzcG9uc2U6IG51bGwsIHJlc3BvbnNlQm9keSwgaGVhZGVyOiBvYmouSGVhZGVyLCB4bWwgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIElmIGl0J3Mgbm90IEhUTUwgYW5kIFNvYXAgQm9keSBpcyBlbXB0eVxyXG4gICAgICAgIGlmICghb2JqLmh0bWwgJiYgIW9iai5Cb2R5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGVycjogbnVsbCwgb2JqLCByZXNwb25zZUJvZHksIGhlYWRlcjogb2JqLkhlYWRlciwgeG1sIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIG9iai5Cb2R5ICE9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvcjogYW55ID0gbmV3IEVycm9yKCdDYW5ub3QgcGFyc2UgcmVzcG9uc2UnKTtcclxuICAgICAgICAgICAgZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgZXJyb3IuYm9keSA9IHJlc3BvbnNlQm9keTtcclxuICAgICAgICAgICAgcmV0dXJuIHsgZXJyOiBlcnJvciwgb2JqLCByZXNwb25zZUJvZHksIGhlYWRlcjogdW5kZWZpbmVkLCB4bWwgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlc3VsdCA9IG9iai5Cb2R5W291dHB1dC4kbmFtZV07XHJcbiAgICAgICAgLy8gUlBDL2xpdGVyYWwgcmVzcG9uc2UgYm9keSBtYXkgY29udGFpbiBlbGVtZW50cyB3aXRoIGFkZGVkIHN1ZmZpeGVzIEkuRS5cclxuICAgICAgICAvLyAnUmVzcG9uc2UnLCBvciAnT3V0cHV0Jywgb3IgJ091dCdcclxuICAgICAgICAvLyBUaGlzIGRvZXNuJ3QgbmVjZXNzYXJpbHkgZXF1YWwgdGhlIG91cHV0IG1lc3NhZ2UgbmFtZS4gU2VlIFdTREwgMS4xIFNlY3Rpb24gMi40LjVcclxuICAgICAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBvYmouQm9keVtvdXRwdXQuJG5hbWUucmVwbGFjZSgvKD86T3V0KD86cHV0KT98UmVzcG9uc2UpJC8sICcnKV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcmVzdWx0KSB7XHJcbiAgICAgICAgICAgIFsnUmVzcG9uc2UnLCAnT3V0JywgJ091dHB1dCddLmZvckVhY2goZnVuY3Rpb24odGVybSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9iai5Cb2R5Lmhhc093blByb3BlcnR5KG5hbWUgKyB0ZXJtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAocmVzdWx0ID0gb2JqLkJvZHlbbmFtZSArIHRlcm1dKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4geyBlcnI6IG51bGwsIHJlc3VsdCwgcmVzcG9uc2VCb2R5LCBoZWFkZXI6IG9iai5IZWFkZXIsIHhtbCB9O1xyXG4gICAgfVxyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5jYWxsID0gZnVuY3Rpb24obWV0aG9kOiBzdHJpbmcsIGJvZHk6IGFueSwgb3B0aW9ucz86IGFueSwgZXh0cmFIZWFkZXJzPzogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGlmICghdGhpc1ttZXRob2RdKSB7XHJcbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoYE1ldGhvZCAke21ldGhvZH0gbm90IGZvdW5kYCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICg8RnVuY3Rpb24+dGhpc1ttZXRob2RdKS5jYWxsKHRoaXMsIGJvZHksIG9wdGlvbnMsIGV4dHJhSGVhZGVycyk7XHJcbn07XHJcbiJdfQ==