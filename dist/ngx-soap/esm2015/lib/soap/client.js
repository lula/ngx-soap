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
const nonIdentifierChars = /[^a-z$_0-9]/i;
export const Client = function (wsdl, endpoint, options) {
    options = options || {};
    this.wsdl = wsdl;
    this._initializeOptions(options);
    this._initializeServices(endpoint);
    this.httpClient = options.httpClient;
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
    const definitions = this.wsdl.definitions, services = definitions.services;
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
    const ports = service.ports, def = {};
    for (const name in ports) {
        def[name] = this._definePort(ports[name], endpoint ? endpoint : ports[name].location);
    }
    return def;
};
Client.prototype._definePort = function (port, endpoint) {
    const location = endpoint, binding = port.binding, methods = binding.methods, def = {};
    for (const name in methods) {
        def[name] = this._defineMethod(methods[name], location);
        const methodName = this.normalizeNames ? name.replace(nonIdentifierChars, '_') : name;
        this[methodName] = def[name];
    }
    return def;
};
Client.prototype._defineMethod = function (method, location) {
    const self = this;
    let temp = null;
    return function (args, options, extraHeaders) {
        return self._invoke(method, args, location, options, extraHeaders);
    };
};
Client.prototype._invoke = function (method, args, location, options, extraHeaders) {
    let self = this, name = method.$name, input = method.input, output = method.output, style = method.style, defs = this.wsdl.definitions, envelopeKey = this.wsdl.options.envelopeKey, ns = defs.$targetNamespace, encoding = '', message = '', xml = null, req = null, soapAction = null, alias = findPrefix(defs.xmlns, ns), headers = {
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
            const start = uuid4();
            const boundry = uuid4();
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
    }), flatMap((body) => self.httpClient
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
    function parseSync(body, response) {
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
    function finish(obj, responseBody, response) {
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
    return this[method].call(this, body, options, extraHeaders);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXNvYXAvIiwic291cmNlcyI6WyJsaWIvc29hcC9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBR0gsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFDakMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUNyQyxPQUFPLEtBQUssQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEtBQUssTUFBTSxTQUFTLENBQUM7QUFDNUIsT0FBTyxFQUFFLElBQUksRUFBYyxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUVsRCxNQUFNLGtCQUFrQixHQUFHLGNBQWMsQ0FBQztBQUUxQyxNQUFNLENBQUMsTUFBTSxNQUFNLEdBQUcsVUFBUyxJQUFJLEVBQUUsUUFBUSxFQUFFLE9BQU87SUFDbEQsT0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7SUFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDakIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2pDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUF3QixDQUFDO0lBQ25ELE1BQU0sY0FBYyxHQUFRLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO0lBQ2hELElBQUksT0FBTyxDQUFDLHFCQUFxQixFQUFFO1FBQy9CLGNBQWMsQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDO0tBQ3pEO0lB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QUFDLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQzVFLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIENvcHlyaWdodCAoYykgMjAxMSBWaW5heSBQdWxpbSA8dmluYXlAbWlsZXdpc2UuY29tPlxyXG4gKiBNSVQgTGljZW5zZWRcclxuICovXHJcblxyXG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwUmVzcG9uc2UgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCAqIGFzIGFzc2VydCBmcm9tICdhc3NlcnQnO1xyXG5pbXBvcnQgeyBmaW5kUHJlZml4IH0gZnJvbSAnLi91dGlscyc7XHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHV1aWQ0IGZyb20gJ3V1aWQvdjQnO1xyXG5pbXBvcnQgeyBmcm9tLCBPYnNlcnZhYmxlLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGZsYXRNYXAsIG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgTXVsdGlwYXJ0IH0gZnJvbSAnLi9tdWx0aXBhcnQnO1xyXG5pbXBvcnQgeyBTb2FwQXR0YWNobWVudCB9IGZyb20gJy4vc29hcEF0dGFjaG1lbnQnO1xyXG5cclxuY29uc3Qgbm9uSWRlbnRpZmllckNoYXJzID0gL1teYS16JF8wLTldL2k7XHJcblxyXG5leHBvcnQgY29uc3QgQ2xpZW50ID0gZnVuY3Rpb24od3NkbCwgZW5kcG9pbnQsIG9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgdGhpcy53c2RsID0gd3NkbDtcclxuICAgIHRoaXMuX2luaXRpYWxpemVPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgdGhpcy5faW5pdGlhbGl6ZVNlcnZpY2VzKGVuZHBvaW50KTtcclxuICAgIHRoaXMuaHR0cENsaWVudCA9IG9wdGlvbnMuaHR0cENsaWVudCBhcyBIdHRwQ2xpZW50O1xyXG4gICAgY29uc3QgcHJvbWlzZU9wdGlvbnM6IGFueSA9IHsgbXVsdGlBcmdzOiB0cnVlIH07XHJcbiAgICBpZiAob3B0aW9ucy5vdmVycmlkZVByb21pc2VTdWZmaXgpIHtcclxuICAgICAgICBwcm9taXNlT3B0aW9ucy5zdWZmaXggPSBvcHRpb25zLm92ZXJyaWRlUHJvbWlzZVN1ZmZpeDtcclxuICAgIH1cclxuICAgIFByb21pc2UuYWxsKFt0aGlzLCBwcm9taXNlT3B0aW9uc10pO1xyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5hZGRTb2FwSGVhZGVyID0gZnVuY3Rpb24oc29hcEhlYWRlciwgbmFtZSwgbmFtZXNwYWNlLCB4bWxucykge1xyXG4gICAgaWYgKCF0aGlzLnNvYXBIZWFkZXJzKSB7XHJcbiAgICAgICAgdGhpcy5zb2FwSGVhZGVycyA9IFtdO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBzb2FwSGVhZGVyID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIHNvYXBIZWFkZXIgPSB0aGlzLndzZGwub2JqZWN0VG9YTUwoc29hcEhlYWRlciwgbmFtZSwgbmFtZXNwYWNlLCB4bWxucywgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5zb2FwSGVhZGVycy5wdXNoKHNvYXBIZWFkZXIpIC0gMTtcclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuY2hhbmdlU29hcEhlYWRlciA9IGZ1bmN0aW9uKGluZGV4LCBzb2FwSGVhZGVyLCBuYW1lLCBuYW1lc3BhY2UsIHhtbG5zKSB7XHJcbiAgICBpZiAoIXRoaXMuc29hcEhlYWRlcnMpIHtcclxuICAgICAgICB0aGlzLnNvYXBIZWFkZXJzID0gW107XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIHNvYXBIZWFkZXIgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgc29hcEhlYWRlciA9IHRoaXMud3NkbC5vYmplY3RUb1hNTChzb2FwSGVhZGVyLCBuYW1lLCBuYW1lc3BhY2UsIHhtbG5zLCB0cnVlKTtcclxuICAgIH1cclxuICAgIHRoaXMuc29hcEhlYWRlcnNbaW5kZXhdID0gc29hcEhlYWRlcjtcclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuZ2V0U29hcEhlYWRlcnMgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnNvYXBIZWFkZXJzO1xyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5jbGVhclNvYXBIZWFkZXJzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLnNvYXBIZWFkZXJzID0gbnVsbDtcclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuYWRkSHR0cEhlYWRlciA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XHJcbiAgICBpZiAoIXRoaXMuaHR0cEhlYWRlcnMpIHtcclxuICAgICAgICB0aGlzLmh0dHBIZWFkZXJzID0ge307XHJcbiAgICB9XHJcbiAgICB0aGlzLmh0dHBIZWFkZXJzW25hbWVdID0gdmFsdWU7XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLmdldEh0dHBIZWFkZXJzID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwSGVhZGVycztcclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuY2xlYXJIdHRwSGVhZGVycyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5odHRwSGVhZGVycyA9IHt9O1xyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5hZGRCb2R5QXR0cmlidXRlID0gZnVuY3Rpb24oYm9keUF0dHJpYnV0ZSwgbmFtZSwgbmFtZXNwYWNlLCB4bWxucykge1xyXG4gICAgaWYgKCF0aGlzLmJvZHlBdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgdGhpcy5ib2R5QXR0cmlidXRlcyA9IFtdO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBib2R5QXR0cmlidXRlID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGxldCBjb21wb3NpdGlvbiA9ICcnO1xyXG4gICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGJvZHlBdHRyaWJ1dGUpLmZvckVhY2goZnVuY3Rpb24ocHJvcCwgaWR4LCBhcnJheSkge1xyXG4gICAgICAgICAgICBjb21wb3NpdGlvbiArPSAnICcgKyBwcm9wICsgJz1cIicgKyBib2R5QXR0cmlidXRlW3Byb3BdICsgJ1wiJztcclxuICAgICAgICB9KTtcclxuICAgICAgICBib2R5QXR0cmlidXRlID0gY29tcG9zaXRpb247XHJcbiAgICB9XHJcbiAgICBpZiAoYm9keUF0dHJpYnV0ZS5zdWJzdHIoMCwgMSkgIT09ICcgJykgYm9keUF0dHJpYnV0ZSA9ICcgJyArIGJvZHlBdHRyaWJ1dGU7XHJcbiAgICB0aGlzLmJvZHlBdHRyaWJ1dGVzLnB1c2goYm9keUF0dHJpYnV0ZSk7XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLmdldEJvZHlBdHRyaWJ1dGVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5ib2R5QXR0cmlidXRlcztcclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuY2xlYXJCb2R5QXR0cmlidXRlcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5ib2R5QXR0cmlidXRlcyA9IG51bGw7XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLnNldEVuZHBvaW50ID0gZnVuY3Rpb24oZW5kcG9pbnQpIHtcclxuICAgIHRoaXMuZW5kcG9pbnQgPSBlbmRwb2ludDtcclxuICAgIHRoaXMuX2luaXRpYWxpemVTZXJ2aWNlcyhlbmRwb2ludCk7XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLmRlc2NyaWJlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCB0eXBlcyA9IHRoaXMud3NkbC5kZWZpbml0aW9ucy50eXBlcztcclxuICAgIHJldHVybiB0aGlzLndzZGwuZGVzY3JpYmVTZXJ2aWNlcygpO1xyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5zZXRTZWN1cml0eSA9IGZ1bmN0aW9uKHNlY3VyaXR5KSB7XHJcbiAgICB0aGlzLnNlY3VyaXR5ID0gc2VjdXJpdHk7XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLnNldFNPQVBBY3Rpb24gPSBmdW5jdGlvbihTT0FQQWN0aW9uKSB7XHJcbiAgICB0aGlzLlNPQVBBY3Rpb24gPSBTT0FQQWN0aW9uO1xyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5faW5pdGlhbGl6ZVNlcnZpY2VzID0gZnVuY3Rpb24oZW5kcG9pbnQpIHtcclxuICAgIGNvbnN0IGRlZmluaXRpb25zID0gdGhpcy53c2RsLmRlZmluaXRpb25zLFxyXG4gICAgICAgIHNlcnZpY2VzID0gZGVmaW5pdGlvbnMuc2VydmljZXM7XHJcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gc2VydmljZXMpIHtcclxuICAgICAgICB0aGlzW25hbWVdID0gdGhpcy5fZGVmaW5lU2VydmljZShzZXJ2aWNlc1tuYW1lXSwgZW5kcG9pbnQpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5faW5pdGlhbGl6ZU9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcbiAgICB0aGlzLnN0cmVhbUFsbG93ZWQgPSBvcHRpb25zLnN0cmVhbTtcclxuICAgIHRoaXMubm9ybWFsaXplTmFtZXMgPSBvcHRpb25zLm5vcm1hbGl6ZU5hbWVzO1xyXG4gICAgdGhpcy53c2RsLm9wdGlvbnMuYXR0cmlidXRlc0tleSA9IG9wdGlvbnMuYXR0cmlidXRlc0tleSB8fCAnYXR0cmlidXRlcyc7XHJcbiAgICB0aGlzLndzZGwub3B0aW9ucy5lbnZlbG9wZUtleSA9IG9wdGlvbnMuZW52ZWxvcGVLZXkgfHwgJ3NvYXAnO1xyXG4gICAgdGhpcy53c2RsLm9wdGlvbnMucHJlc2VydmVXaGl0ZXNwYWNlID0gISFvcHRpb25zLnByZXNlcnZlV2hpdGVzcGFjZTtcclxuICAgIGlmIChvcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZiAob3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcy5vdmVycmlkZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzLm92ZXJyaWRlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcy5uYW1lc3BhY2VzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndzZGwub3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcyA9IG9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMubmFtZXNwYWNlcztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChvcHRpb25zLm92ZXJyaWRlUm9vdEVsZW1lbnQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMud3NkbC5vcHRpb25zLm92ZXJyaWRlUm9vdEVsZW1lbnQgPSBvcHRpb25zLm92ZXJyaWRlUm9vdEVsZW1lbnQ7XHJcbiAgICB9XHJcbiAgICB0aGlzLndzZGwub3B0aW9ucy5mb3JjZVNvYXAxMkhlYWRlcnMgPSAhIW9wdGlvbnMuZm9yY2VTb2FwMTJIZWFkZXJzO1xyXG59O1xyXG5cclxuQ2xpZW50LnByb3RvdHlwZS5fZGVmaW5lU2VydmljZSA9IGZ1bmN0aW9uKHNlcnZpY2UsIGVuZHBvaW50KSB7XHJcbiAgICBjb25zdCBwb3J0cyA9IHNlcnZpY2UucG9ydHMsXHJcbiAgICAgICAgZGVmID0ge307XHJcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gcG9ydHMpIHtcclxuICAgICAgICBkZWZbbmFtZV0gPSB0aGlzLl9kZWZpbmVQb3J0KHBvcnRzW25hbWVdLCBlbmRwb2ludCA/IGVuZHBvaW50IDogcG9ydHNbbmFtZV0ubG9jYXRpb24pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRlZjtcclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuX2RlZmluZVBvcnQgPSBmdW5jdGlvbihwb3J0LCBlbmRwb2ludCkge1xyXG4gICAgY29uc3QgbG9jYXRpb24gPSBlbmRwb2ludCxcclxuICAgICAgICBiaW5kaW5nID0gcG9ydC5iaW5kaW5nLFxyXG4gICAgICAgIG1ldGhvZHMgPSBiaW5kaW5nLm1ldGhvZHMsXHJcbiAgICAgICAgZGVmID0ge307XHJcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gbWV0aG9kcykge1xyXG4gICAgICAgIGRlZltuYW1lXSA9IHRoaXMuX2RlZmluZU1ldGhvZChtZXRob2RzW25hbWVdLCBsb2NhdGlvbik7XHJcbiAgICAgICAgY29uc3QgbWV0aG9kTmFtZSA9IHRoaXMubm9ybWFsaXplTmFtZXMgPyBuYW1lLnJlcGxhY2Uobm9uSWRlbnRpZmllckNoYXJzLCAnXycpIDogbmFtZTtcclxuICAgICAgICB0aGlzW21ldGhvZE5hbWVdID0gZGVmW25hbWVdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRlZjtcclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuX2RlZmluZU1ldGhvZCA9IGZ1bmN0aW9uKG1ldGhvZCwgbG9jYXRpb24pIHtcclxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgbGV0IHRlbXAgPSBudWxsO1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGFyZ3MsIG9wdGlvbnMsIGV4dHJhSGVhZGVycyk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIHNlbGYuX2ludm9rZShtZXRob2QsIGFyZ3MsIGxvY2F0aW9uLCBvcHRpb25zLCBleHRyYUhlYWRlcnMpO1xyXG4gICAgfTtcclxufTtcclxuXHJcbkNsaWVudC5wcm90b3R5cGUuX2ludm9rZSA9IGZ1bmN0aW9uKG1ldGhvZCwgYXJncywgbG9jYXRpb24sIG9wdGlvbnMsIGV4dHJhSGVhZGVycyk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgbmFtZSA9IG1ldGhvZC4kbmFtZSxcclxuICAgICAgICBpbnB1dCA9IG1ldGhvZC5pbnB1dCxcclxuICAgICAgICBvdXRwdXQgPSBtZXRob2Qub3V0cHV0LFxyXG4gICAgICAgIHN0eWxlID0gbWV0aG9kLnN0eWxlLFxyXG4gICAgICAgIGRlZnMgPSB0aGlzLndzZGwuZGVmaW5pdGlvbnMsXHJcbiAgICAgICAgZW52ZWxvcGVLZXkgPSB0aGlzLndzZGwub3B0aW9ucy5lbnZlbG9wZUtleSxcclxuICAgICAgICBucyA9IGRlZnMuJHRhcmdldE5hbWVzcGFjZSxcclxuICAgICAgICBlbmNvZGluZyA9ICcnLFxyXG4gICAgICAgIG1lc3NhZ2UgPSAnJyxcclxuICAgICAgICB4bWwgPSBudWxsLFxyXG4gICAgICAgIHJlcSA9IG51bGwsXHJcbiAgICAgICAgc29hcEFjdGlvbiA9IG51bGwsXHJcbiAgICAgICAgYWxpYXMgPSBmaW5kUHJlZml4KGRlZnMueG1sbnMsIG5zKSxcclxuICAgICAgICBoZWFkZXJzOiBhbnkgPSB7XHJcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAndGV4dC94bWw7IGNoYXJzZXQ9dXRmLTgnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB4bWxuc1NvYXAgPSAneG1sbnM6JyArIGVudmVsb3BlS2V5ICsgJz1cImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3NvYXAvZW52ZWxvcGUvXCInO1xyXG5cclxuICAgIGlmICh0aGlzLndzZGwub3B0aW9ucy5mb3JjZVNvYXAxMkhlYWRlcnMpIHtcclxuICAgICAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi9zb2FwK3htbDsgY2hhcnNldD11dGYtOCc7XHJcbiAgICAgICAgeG1sbnNTb2FwID0gJ3htbG5zOicgKyBlbnZlbG9wZUtleSArICc9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAzLzA1L3NvYXAtZW52ZWxvcGVcIic7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuU09BUEFjdGlvbikge1xyXG4gICAgICAgIHNvYXBBY3Rpb24gPSB0aGlzLlNPQVBBY3Rpb247XHJcbiAgICB9IGVsc2UgaWYgKG1ldGhvZC5zb2FwQWN0aW9uICE9PSB1bmRlZmluZWQgJiYgbWV0aG9kLnNvYXBBY3Rpb24gIT09IG51bGwpIHtcclxuICAgICAgICBzb2FwQWN0aW9uID0gbWV0aG9kLnNvYXBBY3Rpb247XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNvYXBBY3Rpb24gPSAobnMubGFzdEluZGV4T2YoJy8nKSAhPT0gbnMubGVuZ3RoIC0gMSA/IG5zICsgJy8nIDogbnMpICsgbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMud3NkbC5vcHRpb25zLmZvcmNlU29hcDEySGVhZGVycykge1xyXG4gICAgICAgIGhlYWRlcnMuU09BUEFjdGlvbiA9ICdcIicgKyBzb2FwQWN0aW9uICsgJ1wiJztcclxuICAgIH1cclxuXHJcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuXHJcbiAgICAvL0FkZCBleHRyYSBoZWFkZXJzXHJcbiAgICBmb3IgKGNvbnN0IGhlYWRlciBpbiB0aGlzLmh0dHBIZWFkZXJzKSB7XHJcbiAgICAgICAgaGVhZGVyc1toZWFkZXJdID0gdGhpcy5odHRwSGVhZGVyc1toZWFkZXJdO1xyXG4gICAgfVxyXG4gICAgZm9yIChjb25zdCBhdHRyIGluIGV4dHJhSGVhZGVycykge1xyXG4gICAgICAgIGhlYWRlcnNbYXR0cl0gPSBleHRyYUhlYWRlcnNbYXR0cl07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQWxsb3cgdGhlIHNlY3VyaXR5IG9iamVjdCB0byBhZGQgaGVhZGVyc1xyXG4gICAgaWYgKHNlbGYuc2VjdXJpdHkgJiYgc2VsZi5zZWN1cml0eS5hZGRIZWFkZXJzKSBzZWxmLnNlY3VyaXR5LmFkZEhlYWRlcnMoaGVhZGVycyk7XHJcbiAgICBpZiAoc2VsZi5zZWN1cml0eSAmJiBzZWxmLnNlY3VyaXR5LmFkZE9wdGlvbnMpIHNlbGYuc2VjdXJpdHkuYWRkT3B0aW9ucyhvcHRpb25zKTtcclxuXHJcbiAgICBpZiAoc3R5bGUgPT09ICdycGMnICYmIChpbnB1dC5wYXJ0cyB8fCBpbnB1dC5uYW1lID09PSAnZWxlbWVudCcgfHwgYXJncyA9PT0gbnVsbCkpIHtcclxuICAgICAgICBhc3NlcnQub2soIXN0eWxlIHx8IHN0eWxlID09PSAncnBjJywgJ2ludmFsaWQgbWVzc2FnZSBkZWZpbml0aW9uIGZvciBkb2N1bWVudCBzdHlsZSBiaW5kaW5nJyk7XHJcbiAgICAgICAgbWVzc2FnZSA9IHNlbGYud3NkbC5vYmplY3RUb1JwY1hNTChuYW1lLCBhcmdzLCBhbGlhcywgbnMsIGlucHV0Lm5hbWUgIT09ICdlbGVtZW50Jyk7XHJcbiAgICAgICAgbWV0aG9kLmlucHV0U29hcCA9PT0gJ2VuY29kZWQnICYmIChlbmNvZGluZyA9ICdzb2FwOmVuY29kaW5nU3R5bGU9XCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy9zb2FwL2VuY29kaW5nL1wiICcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBhc3NlcnQub2soIXN0eWxlIHx8IHN0eWxlID09PSAnZG9jdW1lbnQnLCAnaW52YWxpZCBtZXNzYWdlIGRlZmluaXRpb24gZm9yIHJwYyBzdHlsZSBiaW5kaW5nJyk7XHJcbiAgICAgICAgLy8gcGFzcyBgaW5wdXQuJGxvb2t1cFR5cGVgIGlmIGBpbnB1dC4kdHlwZWAgY291bGQgbm90IGJlIGZvdW5kXHJcbiAgICAgICAgbWVzc2FnZSA9IHNlbGYud3NkbC5vYmplY3RUb0RvY3VtZW50WE1MKGlucHV0LiRuYW1lLCBhcmdzLCBpbnB1dC50YXJnZXROU0FsaWFzLCBpbnB1dC50YXJnZXROYW1lc3BhY2UsIGlucHV0LiR0eXBlIHx8IGlucHV0LiRsb29rdXBUeXBlKTtcclxuICAgIH1cclxuICAgIHhtbCA9XHJcbiAgICAgICAgJzw/eG1sIHZlcnNpb249XCIxLjBcIiBlbmNvZGluZz1cInV0Zi04XCI/PicgK1xyXG4gICAgICAgICc8JyArXHJcbiAgICAgICAgZW52ZWxvcGVLZXkgK1xyXG4gICAgICAgICc6RW52ZWxvcGUgJyArXHJcbiAgICAgICAgeG1sbnNTb2FwICtcclxuICAgICAgICAnICcgK1xyXG4gICAgICAgICd4bWxuczp4c2k9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZVwiICcgK1xyXG4gICAgICAgIGVuY29kaW5nICtcclxuICAgICAgICB0aGlzLndzZGwueG1sbnNJbkVudmVsb3BlICtcclxuICAgICAgICAnPicgK1xyXG4gICAgICAgIChzZWxmLnNvYXBIZWFkZXJzIHx8IHNlbGYuc2VjdXJpdHlcclxuICAgICAgICAgICAgPyAnPCcgK1xyXG4gICAgICAgICAgICAgIGVudmVsb3BlS2V5ICtcclxuICAgICAgICAgICAgICAnOkhlYWRlcj4nICtcclxuICAgICAgICAgICAgICAoc2VsZi5zb2FwSGVhZGVycyA/IHNlbGYuc29hcEhlYWRlcnMuam9pbignXFxuJykgOiAnJykgK1xyXG4gICAgICAgICAgICAgIChzZWxmLnNlY3VyaXR5ICYmICFzZWxmLnNlY3VyaXR5LnBvc3RQcm9jZXNzID8gc2VsZi5zZWN1cml0eS50b1hNTCgpIDogJycpICtcclxuICAgICAgICAgICAgICAnPC8nICtcclxuICAgICAgICAgICAgICBlbnZlbG9wZUtleSArXHJcbiAgICAgICAgICAgICAgJzpIZWFkZXI+J1xyXG4gICAgICAgICAgICA6ICcnKSArXHJcbiAgICAgICAgJzwnICtcclxuICAgICAgICBlbnZlbG9wZUtleSArXHJcbiAgICAgICAgJzpCb2R5JyArXHJcbiAgICAgICAgKHNlbGYuYm9keUF0dHJpYnV0ZXMgPyBzZWxmLmJvZHlBdHRyaWJ1dGVzLmpvaW4oJyAnKSA6ICcnKSArXHJcbiAgICAgICAgKHNlbGYuc2VjdXJpdHkgJiYgc2VsZi5zZWN1cml0eS5wb3N0UHJvY2VzcyA/ICcgSWQ9XCJfMFwiJyA6ICcnKSArXHJcbiAgICAgICAgJz4nICtcclxuICAgICAgICBtZXNzYWdlICtcclxuICAgICAgICAnPC8nICtcclxuICAgICAgICBlbnZlbG9wZUtleSArXHJcbiAgICAgICAgJzpCb2R5PicgK1xyXG4gICAgICAgICc8LycgK1xyXG4gICAgICAgIGVudmVsb3BlS2V5ICtcclxuICAgICAgICAnOkVudmVsb3BlPic7XHJcblxyXG4gICAgaWYgKHNlbGYuc2VjdXJpdHkgJiYgc2VsZi5zZWN1cml0eS5wb3N0UHJvY2Vzcykge1xyXG4gICAgICAgIHhtbCA9IHNlbGYuc2VjdXJpdHkucG9zdFByb2Nlc3MoeG1sLCBlbnZlbG9wZUtleSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5wb3N0UHJvY2Vzcykge1xyXG4gICAgICAgIHhtbCA9IG9wdGlvbnMucG9zdFByb2Nlc3MoeG1sKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLmxhc3RNZXNzYWdlID0gbWVzc2FnZTtcclxuICAgIHNlbGYubGFzdFJlcXVlc3QgPSB4bWw7XHJcbiAgICBzZWxmLmxhc3RFbmRwb2ludCA9IGxvY2F0aW9uO1xyXG5cclxuICAgIGNvbnN0IHRyeUpTT05wYXJzZSA9IGZ1bmN0aW9uKGJvZHkpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShib2R5KTtcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBmcm9tKFNvYXBBdHRhY2htZW50LmZyb21Gb3JtRmlsZXMob3B0aW9ucy5hdHRhY2htZW50cykpLnBpcGUoXHJcbiAgICAgICAgbWFwKChzb2FwQXR0YWNobWVudHM6IFNvYXBBdHRhY2htZW50W10pID0+IHtcclxuICAgICAgICAgICAgaWYgKCFzb2FwQXR0YWNobWVudHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geG1sO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5mb3JjZU1UT00gfHwgc29hcEF0dGFjaG1lbnRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gdXVpZDQoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJvdW5kcnkgPSB1dWlkNCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFjdGlvbiA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBpZiAoaGVhZGVyc1snQ29udGVudC1UeXBlJ10uaW5kZXhPZignYWN0aW9uJykgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgY3Qgb2YgaGVhZGVyc1snQ29udGVudC1UeXBlJ10uc3BsaXQoJzsgJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN0LmluZGV4T2YoJ2FjdGlvbicpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbiA9IGN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID1cclxuICAgICAgICAgICAgICAgICAgICAnbXVsdGlwYXJ0L3JlbGF0ZWQ7IHR5cGU9XCJhcHBsaWNhdGlvbi94b3AreG1sXCI7IHN0YXJ0PVwiPCcgKyBzdGFydCArICc+XCI7IHN0YXJ0LWluZm89XCJ0ZXh0L3htbFwiOyBib3VuZGFyeT1cIicgKyBib3VuZHJ5ICsgJ1wiJztcclxuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddICsgJzsgJyArIGFjdGlvbjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBtdWx0aXBhcnQ6IGFueVtdID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94b3AreG1sOyBjaGFyc2V0PVVURi04OyB0eXBlPVwidGV4dC94bWxcIicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdDb250ZW50LUlEJzogJzwnICsgc3RhcnQgKyAnPicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IHhtbFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICAgICAgc29hcEF0dGFjaG1lbnRzLmZvckVhY2goKGF0dGFjaG1lbnQ6IFNvYXBBdHRhY2htZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlwYXJ0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogYXR0YWNobWVudC5taW1ldHlwZSArICc7JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHJhbnNmZXItRW5jb2RpbmcnOiAnYmluYXJ5JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtSUQnOiAnPCcgKyAoYXR0YWNobWVudC5jb250ZW50SWQgfHwgYXR0YWNobWVudC5uYW1lKSArICc+JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtRGlzcG9zaXRpb24nOiAnYXR0YWNobWVudDsgbmFtZT1cIicgKyBhdHRhY2htZW50Lm5hbWUgKyAnXCI7IGZpbGVuYW1lPVwiJyArIGF0dGFjaG1lbnQubmFtZSArICdcIicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IGF0dGFjaG1lbnQuYm9keVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBNdWx0aXBhcnQoKS5idWlsZChtdWx0aXBhcnQsIGJvdW5kcnkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgZmxhdE1hcCgoYm9keTogYW55KSA9PlxyXG4gICAgICAgICAgICAoPEh0dHBDbGllbnQ+c2VsZi5odHRwQ2xpZW50KVxyXG4gICAgICAgICAgICAgICAgLnBvc3QobG9jYXRpb24sIGJvZHksIHtcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlVHlwZTogJ3RleHQnLFxyXG4gICAgICAgICAgICAgICAgICAgIG9ic2VydmU6ICdyZXNwb25zZSdcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAucGlwZShcclxuICAgICAgICAgICAgICAgICAgICBtYXAoKHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8YW55PikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmxhc3RSZXNwb25zZSA9IHJlc3BvbnNlLmJvZHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubGFzdFJlc3BvbnNlSGVhZGVycyA9IHJlc3BvbnNlICYmIHJlc3BvbnNlLmhlYWRlcnM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZVN5bmMocmVzcG9uc2UuYm9keSwgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgKVxyXG4gICAgKTtcclxuXHJcbiAgICBmdW5jdGlvbiBwYXJzZVN5bmMoYm9keSwgcmVzcG9uc2U6IEh0dHBSZXNwb25zZTxhbnk+KSB7XHJcbiAgICAgICAgbGV0IG9iajtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBvYmogPSBzZWxmLndzZGwueG1sVG9PYmplY3QoYm9keSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgLy8gIFdoZW4gdGhlIG91dHB1dCBlbGVtZW50IGNhbm5vdCBiZSBsb29rZWQgdXAgaW4gdGhlIHdzZGwgYW5kIHRoZSBib2R5IGlzIEpTT05cclxuICAgICAgICAgICAgLy8gIGluc3RlYWQgb2Ygc2VuZGluZyB0aGUgZXJyb3IsIHdlIHBhc3MgdGhlIGJvZHkgaW4gdGhlIHJlc3BvbnNlLlxyXG4gICAgICAgICAgICBpZiAoIW91dHB1dCB8fCAhb3V0cHV0LiRsb29rdXBUeXBlcykge1xyXG4gICAgICAgICAgICAgICAgLy8gZGVidWcoJ1Jlc3BvbnNlIGVsZW1lbnQgaXMgbm90IHByZXNlbnQuIFVuYWJsZSB0byBjb252ZXJ0IHJlc3BvbnNlIHhtbCB0byBqc29uLicpO1xyXG4gICAgICAgICAgICAgICAgLy8gIElmIHRoZSByZXNwb25zZSBpcyBKU09OIHRoZW4gcmV0dXJuIGl0IGFzLWlzLlxyXG4gICAgICAgICAgICAgICAgY29uc3QganNvbiA9IF8uaXNPYmplY3QoYm9keSkgPyBib2R5IDogdHJ5SlNPTnBhcnNlKGJvZHkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGpzb24pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBlcnI6IG51bGwsIHJlc3BvbnNlLCByZXNwb25zZUJvZHk6IGpzb24sIGhlYWRlcjogdW5kZWZpbmVkLCB4bWwgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICBlcnJvci5ib2R5ID0gYm9keTtcclxuICAgICAgICAgICAgLy8gc2VsZi5lbWl0KCdzb2FwRXJyb3InLCBlcnJvciwgZWlkKTtcclxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmaW5pc2gob2JqLCBib2R5LCByZXNwb25zZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZmluaXNoKG9iaiwgcmVzcG9uc2VCb2R5LCByZXNwb25zZSkge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBudWxsO1xyXG5cclxuICAgICAgICBpZiAoIW91dHB1dCkge1xyXG4gICAgICAgICAgICAvLyBvbmUtd2F5LCBubyBvdXRwdXQgZXhwZWN0ZWRcclxuICAgICAgICAgICAgcmV0dXJuIHsgZXJyOiBudWxsLCByZXNwb25zZTogbnVsbCwgcmVzcG9uc2VCb2R5LCBoZWFkZXI6IG9iai5IZWFkZXIsIHhtbCB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgaXQncyBub3QgSFRNTCBhbmQgU29hcCBCb2R5IGlzIGVtcHR5XHJcbiAgICAgICAgaWYgKCFvYmouaHRtbCAmJiAhb2JqLkJvZHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgZXJyOiBudWxsLCBvYmosIHJlc3BvbnNlQm9keSwgaGVhZGVyOiBvYmouSGVhZGVyLCB4bWwgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqLkJvZHkgIT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVycm9yOiBhbnkgPSBuZXcgRXJyb3IoJ0Nhbm5vdCBwYXJzZSByZXNwb25zZScpO1xyXG4gICAgICAgICAgICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICBlcnJvci5ib2R5ID0gcmVzcG9uc2VCb2R5O1xyXG4gICAgICAgICAgICByZXR1cm4geyBlcnI6IGVycm9yLCBvYmosIHJlc3BvbnNlQm9keSwgaGVhZGVyOiB1bmRlZmluZWQsIHhtbCB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzdWx0ID0gb2JqLkJvZHlbb3V0cHV0LiRuYW1lXTtcclxuICAgICAgICAvLyBSUEMvbGl0ZXJhbCByZXNwb25zZSBib2R5IG1heSBjb250YWluIGVsZW1lbnRzIHdpdGggYWRkZWQgc3VmZml4ZXMgSS5FLlxyXG4gICAgICAgIC8vICdSZXNwb25zZScsIG9yICdPdXRwdXQnLCBvciAnT3V0J1xyXG4gICAgICAgIC8vIFRoaXMgZG9lc24ndCBuZWNlc3NhcmlseSBlcXVhbCB0aGUgb3VwdXQgbWVzc2FnZSBuYW1lLiBTZWUgV1NETCAxLjEgU2VjdGlvbiAyLjQuNVxyXG4gICAgICAgIGlmICghcmVzdWx0KSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IG9iai5Cb2R5W291dHB1dC4kbmFtZS5yZXBsYWNlKC8oPzpPdXQoPzpwdXQpP3xSZXNwb25zZSkkLywgJycpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFyZXN1bHQpIHtcclxuICAgICAgICAgICAgWydSZXNwb25zZScsICdPdXQnLCAnT3V0cHV0J10uZm9yRWFjaChmdW5jdGlvbih0ZXJtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2JqLkJvZHkuaGFzT3duUHJvcGVydHkobmFtZSArIHRlcm0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChyZXN1bHQgPSBvYmouQm9keVtuYW1lICsgdGVybV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7IGVycjogbnVsbCwgcmVzdWx0LCByZXNwb25zZUJvZHksIGhlYWRlcjogb2JqLkhlYWRlciwgeG1sIH07XHJcbiAgICB9XHJcbn07XHJcblxyXG5DbGllbnQucHJvdG90eXBlLmNhbGwgPSBmdW5jdGlvbihtZXRob2Q6IHN0cmluZywgYm9keTogYW55LCBvcHRpb25zPzogYW55LCBleHRyYUhlYWRlcnM/OiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgaWYgKCF0aGlzW21ldGhvZF0pIHtcclxuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihgTWV0aG9kICR7bWV0aG9kfSBub3QgZm91bmRgKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gKDxGdW5jdGlvbj50aGlzW21ldGhvZF0pLmNhbGwodGhpcywgYm9keSwgb3B0aW9ucywgZXh0cmFIZWFkZXJzKTtcclxufTtcclxuIl19