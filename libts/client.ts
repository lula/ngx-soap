import { findPrefix } from './utils'
import * as _ from 'lodash';
import * as assert from 'assert';
import * as uuid from 'uuid';
import { WSDL } from "./wsdl";

export class Client {
  lastResponseHeaders: any;
  lastResponse: string;
  endpoint: any;
  bodyAttributes: any;
  lastRequestHeaders: any;
  lastEndpoint: any;
  lastRequest: any;
  lastMessage: string;
  security: any;
  httpHeaders: any;
  streamAllowed: any;
  SOAPAction: any;
  soapHeaders: any;
  wsdl: WSDL;

  constructor(wsdl: WSDL, endpoint?: any, options?: any) {
    options = options || {};
    this.wsdl = wsdl;
    this._initializeOptions(options);
    this._initializeServices(endpoint);
  }

  addSoapHeader(soapHeader: any, name: any, namespace: any, xmlns: any) {
    if (!this.soapHeaders) {
      this.soapHeaders = [];
    }
    if (typeof soapHeader === 'object') {
      soapHeader = this.wsdl.objectToXML(soapHeader, name, namespace, xmlns, true);
    }
    return this.soapHeaders.push(soapHeader) - 1;
  }

  changeSoapHeader(index: any, soapHeader: any, name: any, namespace: any, xmlns: any) {
    if (!this.soapHeaders) {
      this.soapHeaders = [];
    }
    if (typeof soapHeader === 'object') {
      soapHeader = this.wsdl.objectToXML(soapHeader, name, namespace, xmlns, true);
    }
    this.soapHeaders[index] = soapHeader;
  }

  getSoapHeaders() {
    return this.soapHeaders;
  }

  clearSoapHeaders() {
    this.soapHeaders = null;
  }

  addHttpHeader(name: any, value: any) {
    if (!this.httpHeaders) {
      this.httpHeaders = {};
    }
    this.httpHeaders[name] = value;
  }

  getHttpHeaders() {
    return this.httpHeaders;
  }

  clearHttpHeaders() {
    this.httpHeaders = {};
  }

  addBodyAttribute(bodyAttribute: any, name: any, namespace: any, xmlns: any) {
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
    if (bodyAttribute.substr(0, 1) !== ' ') bodyAttribute = ' ' + bodyAttribute;
    this.bodyAttributes.push(bodyAttribute);
  }

  getBodyAttributes() {
    return this.bodyAttributes;
  }

  clearBodyAttributes() {
    this.bodyAttributes = null;
  }

  setEndpoint(endpoint: any) {
    this.endpoint = endpoint;
    this._initializeServices(endpoint);
  }

  describe () {
    var types = this.wsdl.definitions.types;
    return this.wsdl.describeServices();
  }

  setSecurity(security: any) {
    this.security = security;
  }

  setSOAPAction(SOAPAction: any) {
    this.SOAPAction = SOAPAction;
  }

  private _initializeServices(endpoint: any) {
    var definitions = this.wsdl.definitions,
      services = definitions.services;
    for (var name in services) {
      (this as any)[name] = this._defineService(services[name], endpoint);
    }
  }

  private _initializeOptions(options: any = {}) {
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
  }

  private _defineService(service: any, endpoint: any) {
    var ports = service.ports,
      def: any = {};
    for (var name in ports) {
      def[name] = this._definePort(ports[name], endpoint ? endpoint : ports[name].location);
    }
    return def;
  }

  private _definePort(port: any, endpoint: any) {
    var location = endpoint,
      binding = port.binding,
      methods = binding.methods,
      def: any = {};
    for (var name in methods) {
      def[name] = this._defineMethod(methods[name], location);
      (this as any)[name] = def[name];
    }
    return def;
  }

  private _defineMethod(method: any, location: any) {
    var self = this;
    var temp;
    return function (args: any, callback: any, options: any, extraHeaders: any) {
      if (typeof args === 'function') {
        callback = args;
        args = {};
      } else if (typeof options === 'function') {
        temp = callback;
        callback = options;
        options = temp;
      } else if (typeof extraHeaders === 'function') {
        temp = callback;
        callback = extraHeaders;
        extraHeaders = options;
        options = temp;
      }
      self._invoke(method, args, location, function (error: any, result: any, raw: any, soapHeader: any) {
        callback(error, result, raw, soapHeader);
      }, options, extraHeaders);
    };
  }

  private _invoke(method: any, args: any, location: any, callback: any, options: any, extraHeaders: any) {
    var self = this,
      name = method.$name,
      input = method.input,
      output = method.output,
      style = method.style,
      defs = this.wsdl.definitions,
      envelopeKey = this.wsdl.options.envelopeKey,
      ns = defs.$targetNamespace,
      encoding = '',
      message = '',
      xml = null,
      req:any = null,
      soapAction,
      alias = findPrefix(defs.xmlns, ns),
      headers: any = {
        "Content-Type": "text/xml; charset=utf-8"
      },
      xmlnsSoap = "xmlns:" + envelopeKey + "=\"http://schemas.xmlsoap.org/soap/envelope/\"";

    if (this.wsdl.options.forceSoap12Headers) {
      headers["Content-Type"] = "application/soap+xml; charset=utf-8";
      xmlnsSoap = "xmlns:" + envelopeKey + "=\"http://www.w3.org/2003/05/soap-envelope\"";
    }

    if (this.SOAPAction) {
      soapAction = this.SOAPAction;
    } else if (method.soapAction !== undefined && method.soapAction !== null) {
      soapAction = method.soapAction;
    } else {
      soapAction = ((ns.lastIndexOf("/") !== ns.length - 1) ? ns + "/" : ns) + name;
    }

    if (!this.wsdl.options.forceSoap12Headers) {
      headers.SOAPAction = '"' + soapAction + '"';
    }

    options = options || {};

    //Add extra headers
    for (var header in this.httpHeaders) { headers[header] = this.httpHeaders[header]; }
    for (var attr in extraHeaders) { headers[attr] = extraHeaders[attr]; }

    // Allow the security object to add headers
    if (this.security && this.security.addHeaders)
      self.security.addHeaders(headers);
    if (this.security && this.security.addOptions)
      self.security.addOptions(options);

    if ((style === 'rpc') && ((input.parts || input.name === "element") || args === null)) {
      assert.ok(!style || style === 'rpc', 'invalid message definition for document style binding');
      message = self.wsdl.objectToRpcXML(name, args, alias, ns, (input.name !== "element"));
      (method.inputSoap === 'encoded') && (encoding = 'soap:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" ');
    } else {
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
        (
          "<" + envelopeKey + ":Header>" +
          (self.soapHeaders ? self.soapHeaders.join("\n") : "") +
          (self.security && !self.security.postProcess ? self.security.toXML() : "") +
          "</" + envelopeKey + ":Header>"
        )
        :
        ''
      ) +
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

    var tryJSONparse = function (body: any) {
      try {
        return JSON.parse(body);
      }
      catch (err) {
        return undefined;
      }
    };

    this.wsdl.http.post(location, xml, {}).map(response => {
      let body = response.text();
      this.lastResponse = body;
      this.lastResponseHeaders = response.headers;
      parseSync(body, response);
    });

    // if (this.streamAllowed && typeof self.httpClient.requestStream === 'function') {
    //   callback = _.once(callback);
    //   var startTime = Date.now();
    //   req = this.httpClient.requestStream(location, xml, headers, options, self);
    //   this.lastRequestHeaders = req.headers;
    //   var onError = function onError(err) {
    //     self.lastResponse = null;
    //     self.lastResponseHeaders = null;
    //     self.lastElapsedTime = null;
    //     self.emit('response', null, null, eid);

    //     callback(err);
    //   };
    //   req.on('error', onError);
    //   req.on('response', function (response) {
    //     response.on('error', onError);

    //     // When the output element cannot be looked up in the wsdl, play it safe and
    //     // don't stream
    //     if (response.statusCode !== 200 || !output || !output.$lookupTypes) {
    //       response.pipe(concatStream({ encoding: 'string' }, function (body) {
    //         self.lastResponse = body;
    //         self.lastResponseHeaders = response && response.headers;
    //         self.lastElapsedTime = Date.now() - startTime;
    //         self.emit('response', body, response, eid);

    //         return parseSync(body, response);

    //       }));
    //       return;
    //     }

    //     self.wsdl.xmlToObject(response, function (error, obj) {
    //       self.lastResponse = response;
    //       self.lastResponseHeaders = response && response.headers;
    //       self.lastElapsedTime = Date.now() - startTime;
    //       self.emit('response', '<stream>', response, eid);

    //       if (error) {
    //         error.response = response;
    //         error.body = '<stream>';
    //         self.emit('soapError', error, eid);
    //         return callback(error, response);
    //       }

    //       return finish(obj, '<stream>', response);
    //     });
    //   });
    //   return;
    // }

    // req = th.httpClient.request(location, xml, function (err, response, body) {
    //   self.lastResponse = body;
    //   self.lastResponseHeaders = response && response.headers;
    //   self.lastElapsedTime = response && response.elapsedTime;
    //   self.emit('response', body, response, eid);

    //   if (err) {
    //     callback(err);
    //   } else {
    //     return parseSync(body, response);
    //   }
    // }, headers, options, self);

    function parseSync(body: any, response: any) {
      var obj;
      try {
        obj = self.wsdl.xmlToObject(body);
      } catch (error) {
        //  When the output element cannot be looked up in the wsdl and the body is JSON
        //  instead of sending the error, we pass the body in the response.
        if (!output || !output.$lookupTypes) {
          //  If the response is JSON then return it as-is.
          var json = _.isObject(body) ? body : tryJSONparse(body);
          if (json) {
            return callback(null, response, json);
          }
        }
        error.response = response;
        error.body = body;

        return callback(error, response, body);
      }
      return finish(obj, body, response);
    }

    function finish(obj:any, body:any, response:any) {
      var result;

      if (!output) {
        // one-way, no output expected
        return callback(null, null, body, obj.Header);
      }

      if (typeof obj.Body !== 'object') {
        var error: any = new Error('Cannot parse response');
        error.response = response;
        error.body = body;
        return callback(error, obj, body);
      }

      // if Soap Body is empty
      if (!obj.Body) {
        return callback(null, obj, body, obj.Header);
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
            return result = obj.Body[name + term];
          }
        });
      }

      callback(null, result, body, obj.Header);
    }

    // Added mostly for testability, but possibly useful for debugging
    if (req && req.headers) //fixes an issue when req or req.headers is indefined
      this.lastRequestHeaders = req.headers;
  }

}