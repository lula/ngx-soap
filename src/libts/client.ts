import { findPrefix } from './utils'
import * as _ from 'lodash';
import * as assert from 'assert';
import * as uuid from 'uuid';
import { WSDL } from "./wsdl";
import { Buffer } from "buffer";

export interface Operation {
  url?: any;
  headers?: any;
  xml?: any ;
  error?: string;
}

export interface ClientOptions {
  attributesKey?: string;
  envelopeKey?: string;
  ignoredNamespaces?: { namespaces?: string[] | string, override?: boolean };
  // overrideRootElement?: any;
  forceSoap12Headers?: boolean;
}

export class Client {
  private endpoint: string;
  private bodyAttributes: string[] | null;
  // private lastRequestHeaders: any;
  private lastEndpoint: string;
  private lastRequest: string;
  private lastMessage: string;
  private security: any;
  private httpHeaders: { [name: string]: string } = {};
  // private streamAllowed: any;
  private SOAPAction: any;
  private soapHeaders: any;
  private wsdl: WSDL;
  
  constructor(wsdl: WSDL, options?: ClientOptions, endpoint?: string) {
    options = options || {};
    this.wsdl = wsdl;
    this._initializeOptions(options);
    this._initializeServices(endpoint);
  }

  public addSoapHeader(soapHeader: any|any[], name: string|null, namespace: any, xmlns: any) {
    if (!this.soapHeaders) {
      this.soapHeaders = [];
    }
    if (typeof soapHeader === 'object') {
      soapHeader = this.wsdl.objectToXML(soapHeader, name, namespace, xmlns, true);
    }
    return this.soapHeaders.push(soapHeader) - 1;
  }

  public changeSoapHeader(index: any, soapHeader: any, name: any, namespace: any, xmlns: any) {
    if (!this.soapHeaders) {
      this.soapHeaders = [];
    }
    if (typeof soapHeader === 'object') {
      soapHeader = this.wsdl.objectToXML(soapHeader, name, namespace, xmlns, true);
    }
    this.soapHeaders[index] = soapHeader;
  }

  public getSoapHeaders() {
    return this.soapHeaders;
  }

  public clearSoapHeaders() {
    this.soapHeaders = null;
  }

  public addHttpHeaders(headers: { [key: string]: any}) {
    headers.keys().forEach((key: string) => {
      let value: string = headers[key];
      if (value) {
        this.addHttpHeader(key, value);
      }
    });
  }

  public addHttpHeader(name: string, value: string) {
    if (!this.httpHeaders) {
      this.httpHeaders = {};
    }
    
    this.httpHeaders[name] = value;
  }

  public getHttpHeaders(): {[name: string]: string} {
    return this.httpHeaders;
  }

  public clearHttpHeaders() {
    this.httpHeaders = {};
  }

  public addBodyAttribute(bodyAttribute: any, name: string) {
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

  public getBodyAttributes() {
    return this.bodyAttributes;
  }

  public clearBodyAttributes() {
    this.bodyAttributes = null;
  }

  public setEndpoint(endpoint: any) {
    this.endpoint = endpoint;
    this._initializeServices(endpoint);
  }

  public setSecurity(security: any) {
    this.security = security;
  }

  public setSOAPAction(SOAPAction: any) {
    this.SOAPAction = SOAPAction;
  }

  public operation(name: string, body: any): Promise<Operation> {
    return new Promise((resolve, reject) => {
      let operation: Function = (this as any)[name];
      if (operation) {
        resolve(operation.call(this, body));
      } else {
        reject("Operation " + name + " not found");
      }
    });
  }

  public describe() {
    let types = this.wsdl.definitions.types;
    return this.wsdl.describeServices();
  }

  public parseResponseBody(body: string): any {
    try {
      return this.wsdl.xmlToObject(body);
    } catch (error) {
      throw new Error("Error parsing body" + error);
    }
  }

  private _initializeServices(endpoint: any) {
    let definitions = this.wsdl.definitions;
    let services = definitions.services;

    for (var name in services) {
      (this as any)[name] = this._defineService(services[name], endpoint);
    }
  }

  private _initializeOptions(options: ClientOptions = {}) {
    // this.streamAllowed = options.stream;
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

    //TODO: understand overrideRootElement
    // if (options.overrideRootElement !== undefined) {
    //   this.wsdl.options.overrideRootElement = options.overrideRootElement;
    // }
    this.wsdl.options.forceSoap12Headers = !!options.forceSoap12Headers;
  }

  private _defineService(service: any, endpoint: string) {
    let ports = service.ports;
    let def: any = {};

    for (var name in ports) {
      def[name] = this._definePort(ports[name], endpoint ? endpoint : ports[name].location);
    }
    
    return def;
  }

  private _definePort(port: any, endpoint: string) {
    let location = endpoint;
    let binding = port.binding;
    let methods = binding.methods;
    let def: any = {};

    for (var name in methods) {
      def[name] = this._defineMethod(methods[name], location);
      (this as any)[name] = def[name];
    }
    return def;
  }

  private _defineMethod(method: any, location: string) {
    var self = this;
    var temp;

    return function (args: any, callback: any, options: any, extraHeaders: any): Promise<Operation> {
      return new Promise((resolve, reject) => {
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

        self._invoke(method, args, location, function (error: any, url: any, headers: any, xml: any) {          
          if(error) { reject(error); }
          else {
            resolve({
              url: url,
              headers: headers,
              xml: xml
            })
          };
        }, options, extraHeaders);
      });
    };
  }

  private _invoke(method: any, args: any, location: string, callback: any, options?: any, extraHeaders?: any) {
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
      req: any = null,
      soapAction,
      alias = findPrefix(defs.xmlns, ns),
      headers: any = {},
      xmlnsSoap = "xmlns:" + envelopeKey + "=\"http://schemas.xmlsoap.org/soap/envelope/\"";

    headers["Content-Type"] = "text/xml; charset=utf-8";

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
    if (this.security && this.security.addOptions) self.security.addOptions(options);

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

    callback(null, location, headers, xml);
  }

}