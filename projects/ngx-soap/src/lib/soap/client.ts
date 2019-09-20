/*
 * Copyright (c) 2011 Vinay Pulim <vinay@milewise.com>
 * MIT Licensed
 */

import { HttpClient, HttpResponse } from '@angular/common/http';
import * as assert from 'assert';
// import * as events from 'events';
// import * as util from 'util';
import { findPrefix } from './utils';
import * as _ from 'lodash';
import uuid4 from 'uuid/v4';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

const nonIdentifierChars = /[^a-z$_0-9]/i;

export const Client = function(wsdl, endpoint, options) {
  // events.EventEmitter.call(this);
  options = options || {};
  this.wsdl = wsdl;
  this._initializeOptions(options);
  this._initializeServices(endpoint);
  this.httpClient = options.httpClient as HttpClient;
  const promiseOptions: any = { multiArgs: true };
  if (options.overridePromiseSuffix) {
    promiseOptions.suffix = options.overridePromiseSuffix;
  }
  Promise.all([this, promiseOptions]);
};
// util.inherits(Client, events.EventEmitter);

Client.prototype.addSoapHeader = function(soapHeader, name, namespace, xmlns) {
  if (!this.soapHeaders) {
    this.soapHeaders = [];
  }
  if (typeof soapHeader === 'object') {
    soapHeader = this.wsdl.objectToXML(soapHeader, name, namespace, xmlns, true);
  }
  return this.soapHeaders.push(soapHeader) - 1;
};

Client.prototype.changeSoapHeader = function(index, soapHeader, name, namespace, xmlns) {
  if (!this.soapHeaders) {
    this.soapHeaders = [];
  }
  if (typeof soapHeader === 'object') {
    soapHeader = this.wsdl.objectToXML(soapHeader, name, namespace, xmlns, true);
  }
  this.soapHeaders[index] = soapHeader;
};

Client.prototype.getSoapHeaders = function() {
  return this.soapHeaders;
};

Client.prototype.clearSoapHeaders = function() {
  this.soapHeaders = null;
};

Client.prototype.addHttpHeader = function(name, value) {
  if (!this.httpHeaders) {
    this.httpHeaders = {};
  }
  this.httpHeaders[name] = value;
};

Client.prototype.getHttpHeaders = function() {
  return this.httpHeaders;
};

Client.prototype.clearHttpHeaders = function() {
  this.httpHeaders = {};
};


Client.prototype.addBodyAttribute = function(bodyAttribute, name, namespace, xmlns) {
  if (!this.bodyAttributes) {
    this.bodyAttributes = [];
  }
  if (typeof bodyAttribute === 'object') {
    let composition = '';
    Object.getOwnPropertyNames(bodyAttribute).forEach(function(prop, idx, array) {
      composition += ' ' + prop + '="' + bodyAttribute[prop] + '"';
    });
    bodyAttribute = composition;
  }
  if (bodyAttribute.substr(0, 1) !== ' ') bodyAttribute = ' ' + bodyAttribute;
  this.bodyAttributes.push(bodyAttribute);
};

Client.prototype.getBodyAttributes = function() {
  return this.bodyAttributes;
};

Client.prototype.clearBodyAttributes = function() {
  this.bodyAttributes = null;
};

Client.prototype.setEndpoint = function(endpoint) {
  this.endpoint = endpoint;
  this._initializeServices(endpoint);
};

Client.prototype.describe = function() {
  const types = this.wsdl.definitions.types;
  return this.wsdl.describeServices();
};

Client.prototype.setSecurity = function(security) {
  this.security = security;
};

Client.prototype.setSOAPAction = function(SOAPAction) {
  this.SOAPAction = SOAPAction;
};

Client.prototype._initializeServices = function(endpoint) {
  const definitions = this.wsdl.definitions,
    services = definitions.services;
  for (const name in services) {
    this[name] = this._defineService(services[name], endpoint);
  }
};

Client.prototype._initializeOptions = function(options) {
  this.streamAllowed = options.stream;
  this.normalizeNames = options.normalizeNames;
  this.wsdl.options.attributesKey = options.attributesKey || 'attributes';
  this.wsdl.options.envelopeKey = options.envelopeKey || 'soap';
  this.wsdl.options.preserveWhitespace = !!options.preserveWhitespace;
  if(options.ignoredNamespaces !== undefined) {
    if(options.ignoredNamespaces.override !== undefined) {
      if(options.ignoredNamespaces.override === true) {
        if(options.ignoredNamespaces.namespaces !== undefined) {
          this.wsdl.options.ignoredNamespaces = options.ignoredNamespaces.namespaces;
        }
      }
    }
  }
  if(options.overrideRootElement !== undefined) {
    this.wsdl.options.overrideRootElement = options.overrideRootElement;
  }
  this.wsdl.options.forceSoap12Headers = !!options.forceSoap12Headers;
};

Client.prototype._defineService = function(service, endpoint) {
  const ports = service.ports,
    def = {};
  for (const name in ports) {
    def[name] = this._definePort(ports[name], endpoint ? endpoint : ports[name].location);
  }
  return def;
};

Client.prototype._definePort = function(port, endpoint) {
  const location = endpoint,
    binding = port.binding,
    methods = binding.methods,
    def = {};
  for (const name in methods) {
    def[name] = this._defineMethod(methods[name], location);
    const methodName = this.normalizeNames ? name.replace(nonIdentifierChars, '_') : name;
    this[methodName] = def[name];
  }
  return def;
};

Client.prototype._defineMethod = function(method, location) {
  const self = this;
  let temp = null;
  return function(args, options, extraHeaders): Observable<any> {
    return self._invoke(method, args, location, options, extraHeaders);
  };
};

Client.prototype._invoke = function(method, args, location, options, extraHeaders): Observable<any> {
  let self = this,
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
    req = null,
    soapAction = null,
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
  for (const header in this.httpHeaders ) { headers[header] = this.httpHeaders[header];  }
  for (const attr in extraHeaders) { headers[attr] = extraHeaders[attr]; }

  // Allow the security object to add headers
  if (self.security && self.security.addHeaders)
    self.security.addHeaders(headers);
  if (self.security && self.security.addOptions)
    self.security.addOptions(options);

  if ((style === 'rpc')&& ( ( input.parts || input.name==="element" ) || args === null) ) {
    assert.ok(!style || style === 'rpc', 'invalid message definition for document style binding');
    message = self.wsdl.objectToRpcXML(name, args, alias, ns,(input.name!=="element" ));
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
    (self.bodyAttributes ? self.bodyAttributes.join(' ') : '') +
    (self.security && self.security.postProcess ? ' Id="_0"' : '') +
    ">" +
    message +
    "</" + envelopeKey + ":Body>" +
    "</" + envelopeKey + ":Envelope>";

  if(self.security && self.security.postProcess){
    xml = self.security.postProcess(xml, envelopeKey);
  }

  if(options && options.postProcess){
    xml = options.postProcess(xml);
  }

  self.lastMessage = message;
  self.lastRequest = xml;
  self.lastEndpoint = location;

  const eid = options.exchangeId || uuid4();

  // self.emit('message', message, eid);
  // self.emit('request', xml, eid);

  const tryJSONparse = function(body) {
    try {
      return JSON.parse(body);
    }
    catch(err) {
      return undefined;
    }
  };

  //console.log('url:', location)
  
  return (<HttpClient>self.httpClient).post(location, xml, {
    headers: headers,
    responseType: 'text', observe: 'response' }).pipe(
    map((response: HttpResponse<any>) => {
      self.lastResponse = response.body;
      self.lastResponseHeaders = response && response.headers;
      // self.lastElapsedTime = response && response.elapsedTime;
      // self.emit('response', response.body, response, eid);
      //console.log('responce body before sync', response.body);
      return parseSync(response.body, response)
    })
  );

  function parseSync(body, response: HttpResponse<any>) {
    let obj;
    try {
      obj = self.wsdl.xmlToObject(body);
      //console.log('parsed body',obj);
    } catch (error) {
      //  When the output element cannot be looked up in the wsdl and the body is JSON
      //  instead of sending the error, we pass the body in the response.
      if(!output || !output.$lookupTypes) {
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

    if (!output){
      // one-way, no output expected
      return { err: null, response: null, responseBody, header: obj.Header, xml };
    }

    // If it's not HTML and Soap Body is empty
    if (!obj.html && !obj.Body) {
      return  { err: null, obj, responseBody, header: obj.Header, xml }; 
    }

    if( typeof obj.Body !== 'object' ) {
      const error: any = new Error('Cannot parse response');
      error.response = response;
      error.body = responseBody;
      return { err: error, obj, responseBody, header: undefined, xml }; 
    }

    result = obj.Body[output.$name];
    // RPC/literal response body may contain elements with added suffixes I.E.
    // 'Response', or 'Output', or 'Out'
    // This doesn't necessarily equal the ouput message name. See WSDL 1.1 Section 2.4.5
    if(!result){
      result = obj.Body[output.$name.replace(/(?:Out(?:put)?|Response)$/, '')];
    }
    if (!result) {
      ['Response', 'Out', 'Output'].forEach(function (term) {
        if (obj.Body.hasOwnProperty(name + term)) {
          return result = obj.Body[name + term];
        }
      });
    }
    
    return { err: null, result, responseBody, header: obj.Header, xml }; 
  }
};

Client.prototype.call = function (method: string, body: any, options?: any, extraHeaders?: any): Observable<any> {
  if (!this[method]) {
    return throwError(`Method ${method} not found`);
  }

  return (<Function>this[method]).call(this, body, options, extraHeaders);
}
