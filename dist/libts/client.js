import { findPrefix } from './utils';
import * as assert from 'assert';
import * as uuid from 'uuid';
var Client = (function () {
    function Client(wsdl, endpoint, options) {
        this.httpHeaders = {};
        options = options || {};
        this.wsdl = wsdl;
        this._initializeOptions(options);
        this._initializeServices(endpoint);
    }
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
            var composition = '';
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
        var types = this.wsdl.definitions.types;
        return this.wsdl.describeServices();
    };
    Client.prototype.setSecurity = function (security) {
        this.security = security;
    };
    Client.prototype.setSOAPAction = function (SOAPAction) {
        this.SOAPAction = SOAPAction;
    };
    Client.prototype.parseResponseBody = function (body) {
        try {
            return this.wsdl.xmlToObject(body);
        }
        catch (error) {
            throw new Error("Error parsing body" + error);
        }
    };
    Client.prototype._initializeServices = function (endpoint) {
        var definitions = this.wsdl.definitions, services = definitions.services;
        for (var name in services) {
            this[name] = this._defineService(services[name], endpoint);
        }
    };
    Client.prototype._initializeOptions = function (options) {
        if (options === void 0) { options = {}; }
        this.streamAllowed = options.stream;
        this.wsdl.options.attributesKey = options.attributesKey || 'attributes';
        this.wsdl.options.envelopeKey = options.envelopeKey || 'soap';
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
        for (var name in ports) {
            def[name] = this._definePort(ports[name], endpoint ? endpoint : ports[name].location);
        }
        return def;
    };
    Client.prototype._definePort = function (port, endpoint) {
        var location = endpoint, binding = port.binding, methods = binding.methods, def = {};
        for (var name in methods) {
            def[name] = this._defineMethod(methods[name], location);
            this[name] = def[name];
        }
        return def;
    };
    Client.prototype._defineMethod = function (method, location) {
        var self = this;
        var temp;
        return function (args, callback, options, extraHeaders) {
            if (typeof args === 'function') {
                callback = args;
                args = {};
            }
            else if (typeof options === 'function') {
                temp = callback;
                callback = options;
                options = temp;
            }
            else if (typeof extraHeaders === 'function') {
                temp = callback;
                callback = extraHeaders;
                extraHeaders = options;
                options = temp;
            }
            // return self._invoke(method, args, location);
            self._invoke(method, args, location, function (error, result, raw, soapHeader) {
                callback(error, result, raw, soapHeader);
            }, options, extraHeaders);
        };
    };
    Client.prototype._invoke = function (method, args, location, callback, options, extraHeaders) {
        var self = this, name = method.$name, input = method.input, output = method.output, style = method.style, defs = this.wsdl.definitions, envelopeKey = this.wsdl.options.envelopeKey, ns = defs.$targetNamespace, encoding = '', message = '', xml = null, req = null, soapAction, alias = findPrefix(defs.xmlns, ns), headers = {}, xmlnsSoap = "xmlns:" + envelopeKey + "=\"http://schemas.xmlsoap.org/soap/envelope/\"";
        headers["Content-Type"] = "text/xml; charset=utf-8";
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
            headers["SOAPAction"] = '"' + soapAction + '"';
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
        if (this.security && this.security.addHeaders) {
            headers = self.security.addHeaders(headers);
        }
        if (this.security && this.security.addOptions)
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
            (this.bodyAttributes ? this.bodyAttributes.join(' ') : '') +
            (this.security && this.security.postProcess ? ' Id="_0"' : '') +
            ">" +
            message +
            "</" + envelopeKey + ":Body>" +
            "</" + envelopeKey + ":Envelope>";
        if (self.security && self.security.postProcess) {
            xml = self.security.postProcess(xml, envelopeKey);
        }
        this.lastMessage = message;
        this.lastRequest = xml;
        this.lastEndpoint = location;
        var eid = options.exchangeId || uuid.v4();
        var tryJSONparse = function (body) {
            try {
                return JSON.parse(body);
            }
            catch (err) {
                return undefined;
            }
        };
        callback(null, location, headers, xml);
    };
    return Client;
}());
export { Client };
//# sourceMappingURL=client.js.map