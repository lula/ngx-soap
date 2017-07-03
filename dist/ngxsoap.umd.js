(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/http'), require('rxjs/add/operator/map'), require('lodash'), require('sax'), require('assert'), require('uuid')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/http', 'rxjs/add/operator/map', 'lodash', 'sax', 'assert', 'uuid'], factory) :
	(factory((global.ngxsoap = global.ngxsoap || {}),global.ng.core,global.ng.http,global.Rx.Observable,global._,global.sax,global.assert,global.uuid));
}(this, (function (exports,_angular_core,_angular_http,rxjs_add_operator_map,_,sax,assert,uuid) { 'use strict';

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}

// import * as crypto from '                     crypto-js/sha1';
// import * as buffer from "buffer/";
// export function passwordDigest(nonce, created, password) {
//   // digest = base64 ( sha1 ( nonce + created + password ) )
//   var pwHash = crypto.createHash('sha1');
//   var rawNonce = buffer.Buffer(nonce || '', 'base64').toString('binary');
//   pwHash.update(rawNonce + created + password);
//   return pwHash.digest('base64');
// };
// import * as crypto from '                     crypto-js/sha1';
var TNS_PREFIX = '__tns__'; // Prefix for targetNamespace
/**
 * Find a key from an object based on the value
 * @param {Object} Namespace prefix/uri mapping
 * @param {*} nsURI value
 * @returns {String} The matching key
 */
// Prefix for targetNamespace
function findPrefix(xmlnsMapping, nsURI) {
    for (var n in xmlnsMapping) {
        if (n === TNS_PREFIX)
            continue;
        if (xmlnsMapping[n] === nsURI) {
            return n;
        }
    }
}

var NamespaceScope = (function () {
    /**
     * Scope for XML namespaces
     * @param {NamespaceScope} [parent] Parent scope
     * @returns {NamespaceScope}
     * @constructor
     */
    function NamespaceScope(parent) {
        this.namespaces = {};
        if (!(this instanceof NamespaceScope)) {
            return new NamespaceScope(parent);
        }
        this.parent = parent;
        this.namespaces = {};
    }
    /**
     * Look up the namespace URI by prefix
     * @param {String} prefix Namespace prefix
     * @param {Boolean} [localOnly] Search current scope only
     * @returns {String} Namespace URI
     */
    NamespaceScope.prototype.getNamespaceURI = function (prefix, localOnly) {
        switch (prefix) {
            case 'xml':
                return 'http://www.w3.org/XML/1998/namespace';
            case 'xmlns':
                return 'http://www.w3.org/2000/xmlns/';
            default:
                var nsUri = this.namespaces[prefix];
                /*jshint -W116 */
                if (nsUri != null) {
                    return nsUri.uri;
                }
                else if (!localOnly && this.parent) {
                    return this.parent.getNamespaceURI(prefix);
                }
                else {
                    return null;
                }
        }
    };
    NamespaceScope.prototype.getNamespaceMapping = function (prefix) {
        switch (prefix) {
            case 'xml':
                return {
                    uri: 'http://www.w3.org/XML/1998/namespace',
                    prefix: 'xml',
                    declared: true
                };
            case 'xmlns':
                return {
                    uri: 'http://www.w3.org/2000/xmlns/',
                    prefix: 'xmlns',
                    declared: true
                };
            default:
                var mapping = this.namespaces[prefix];
                /*jshint -W116 */
                if (mapping != null) {
                    return mapping;
                }
                else if (this.parent) {
                    return this.parent.getNamespaceMapping(prefix);
                }
                else {
                    return null;
                }
        }
    };
    /**
     * Look up the namespace prefix by URI
     * @param {String} nsUri Namespace URI
     * @param {Boolean} [localOnly] Search current scope only
     * @returns {String} Namespace prefix
     */
    NamespaceScope.prototype.getPrefix = function (nsUri, localOnly) {
        switch (nsUri) {
            case 'http://www.w3.org/XML/1998/namespace':
                return 'xml';
            case 'http://www.w3.org/2000/xmlns/':
                return 'xmlns';
            default:
                for (var p in this.namespaces) {
                    if (this.namespaces[p].uri === nsUri) {
                        return p;
                    }
                }
                if (!localOnly && this.parent) {
                    return this.parent.getPrefix(nsUri);
                }
                else {
                    return null;
                }
        }
    };
    return NamespaceScope;
}());
/**
 * Namespace context that manages hierarchical scopes
 * @returns {NamespaceContext}
 * @constructor
 */
var NamespaceContext = (function () {
    function NamespaceContext() {
        /**
         * Register a namespace
         * @param {String} nsUri Namespace URI
         * @returns {String} The matching or generated namespace prefix
         */
        this.registerNamespace = function (nsUri) {
            var prefix = this.getPrefix(nsUri);
            if (prefix) {
                // If the namespace has already mapped to a prefix
                return prefix;
            }
            else {
                // Try to generate a unique namespace
                while (true) {
                    prefix = 'ns' + (++this.prefixCount);
                    if (!this.getNamespaceURI(prefix)) {
                        // The prefix is not used
                        break;
                    }
                }
            }
            this.addNamespace(prefix, nsUri, true);
            return prefix;
        };
        // if (!(this instanceof NamespaceContext)) {
        //   return new NamespaceContext();
        // }
        this.scopes = [];
        this.pushContext();
        this.prefixCount = 0;
    }
    /**
   * Add a prefix/URI namespace mapping
   * @param {String} prefix Namespace prefix
   * @param {String} nsUri Namespace URI
   * @param {Boolean} [localOnly] Search current scope only
   * @returns {boolean} true if the mapping is added or false if the mapping
   * already exists
   */
    NamespaceContext.prototype.addNamespace = function (prefix, nsUri, localOnly) {
        if (this.getNamespaceURI(prefix, localOnly) === nsUri) {
            return false;
        }
        if (this.currentScope) {
            this.currentScope.namespaces[prefix] = {
                uri: nsUri,
                prefix: prefix,
                declared: false
            };
            return true;
        }
        return false;
    };
    /**
     * Push a scope into the context
     * @returns {NamespaceScope} The current scope
     */
    NamespaceContext.prototype.pushContext = function () {
        var scope = new NamespaceScope(this.currentScope);
        this.scopes.push(scope);
        this.currentScope = scope;
        return scope;
    };
    /**
   * Pop a scope out of the context
   * @returns {NamespaceScope} The removed scope
   */
    NamespaceContext.prototype.popContext = function () {
        var scope = this.scopes.pop();
        if (scope) {
            this.currentScope = scope.parent;
        }
        else {
            this.currentScope = null;
        }
        return scope;
    };
    /**
     * Look up the namespace URI by prefix
     * @param {String} prefix Namespace prefix
     * @param {Boolean} [localOnly] Search current scope only
     * @returns {String} Namespace URI
     */
    NamespaceContext.prototype.getNamespaceURI = function (prefix, localOnly) {
        return this.currentScope && this.currentScope.getNamespaceURI(prefix, localOnly);
    };
    /**
   * Look up the namespace prefix by URI
   * @param {String} nsURI Namespace URI
   * @param {Boolean} [localOnly] Search current scope only
   * @returns {String} Namespace prefix
   */
    NamespaceContext.prototype.getPrefix = function (nsUri, localOnly) {
        return this.currentScope && this.currentScope.getPrefix(nsUri, localOnly);
    };
    /**
     * Declare a namespace prefix/uri mapping
     * @param {String} prefix Namespace prefix
     * @param {String} nsUri Namespace URI
     * @returns {Boolean} true if the declaration is created
     */
    NamespaceContext.prototype.declareNamespace = function (prefix, nsUri) {
        if (this.currentScope) {
            var mapping = this.currentScope.getNamespaceMapping(prefix);
            if (mapping && mapping.uri === nsUri && mapping.declared) {
                return false;
            }
            this.currentScope.namespaces[prefix] = {
                uri: nsUri,
                prefix: prefix,
                declared: true
            };
            return true;
        }
        return false;
    };
    return NamespaceContext;
}());

var stripBom = function (x) {
    // Catches EFBBBF (UTF-8 BOM) because the buffer-to-string
    // conversion translates it to FEFF (UTF-16 BOM)
    if (x.charCodeAt(0) === 0xFEFF) {
        return x.slice(1);
    }
    return x;
};
var Primitives = {
    string: 1,
    boolean: 1,
    decimal: 1,
    float: 1,
    double: 1,
    anyType: 1,
    byte: 1,
    int: 1,
    long: 1,
    short: 1,
    negativeInteger: 1,
    nonNegativeInteger: 1,
    positiveInteger: 1,
    nonPositiveInteger: 1,
    unsignedByte: 1,
    unsignedInt: 1,
    unsignedLong: 1,
    unsignedShort: 1,
    duration: 0,
    dateTime: 0,
    time: 0,
    date: 0,
    gYearMonth: 0,
    gYear: 0,
    gMonthDay: 0,
    gDay: 0,
    gMonth: 0,
    hexBinary: 0,
    base64Binary: 0,
    anyURI: 0,
    QName: 0,
    NOTATION: 0
};
var trimLeft = /^[\s\xA0]+/;
var trimRight = /[\s\xA0]+$/;
function appendColon(ns) {
    return (ns && ns.charAt(ns.length - 1) !== ':') ? ns + ':' : ns;
}
function noColonNameSpace(ns) {
    return (ns && ns.charAt(ns.length - 1) === ':') ? ns.substring(0, ns.length - 1) : ns;
}
function splitQName(nsName) {
    if (typeof nsName !== 'string')
        return {
            prefix: '',
            name: nsName
        };
    var i = nsName.indexOf(':');
    return i < 0 ? { prefix: TNS_PREFIX, name: nsName } :
        { prefix: nsName.substring(0, i), name: nsName.substring(i + 1) };
}
function xmlEscape(obj) {
    if (typeof (obj) === 'string') {
        if (obj.substr(0, 9) === '<![CDATA[' && obj.substr(-3) === "]]>") {
            return obj;
        }
        return obj
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
    return obj;
}
function trim(text) {
    return text.replace(trimLeft, '').replace(trimRight, '');
}
function openWsdl(wsdlDef, options) {
    if (options === void 0) { options = {}; }
    return new Promise(function (resolve, reject) {
        var wsdl = new WSDL(wsdlDef, options);
        resolve(wsdl.build());
        // var request_headers = options.wsdl_headers;
        // var request_options = options.wsdl_options;
        // http.get(uri).subscribe(response => {
        //   let wsdlDef = response.text();
        //   if (!wsdlDef) reject("No wsdl found at url " + uri)
        //   try {
        //     let wsdl = new WSDL(http, wsdlDef, uri, options);
        //     resolve(wsdl.build());
        //   } catch (e) {
        //     reject(e);
        //   }
        // });
    });
}
var WSDL = (function () {
    function WSDL(definition, options) {
        this.options = {};
        // uri: any;
        this.ignoredNamespaces = ['tns', 'targetNamespace', 'typedNamespace'];
        this.ignoreBaseNameSpaces = false;
        this.valueKey = '$value';
        this.xmlKey = '$xml';
        this.describeServices = function () {
            var services = {};
            for (var name in this.services) {
                var service = this.services[name];
                services[name] = service.description(this.definitions);
            }
            return services;
        };
        /**
       * Look up a XSD type or element by namespace URI and name
       * @param {String} nsURI Namespace URI
       * @param {String} qname Local or qualified name
       * @returns {*} The XSD type/element definition
       */
        this.findSchemaObject = function (nsURI, qname) {
            if (!nsURI || !qname) {
                return null;
            }
            var def = null;
            if (this.definitions.schemas) {
                var schema = this.definitions.schemas[nsURI];
                if (schema) {
                    if (qname.indexOf(':') !== -1) {
                        qname = qname.substring(qname.indexOf(':') + 1, qname.length);
                    }
                    // if the client passed an input element which has a `$lookupType` property instead of `$type`
                    // the `def` is found in `schema.elements`.
                    def = schema.complexTypes[qname] || schema.types[qname] || schema.elements[qname];
                }
            }
            return def;
        };
        this.definition = definition;
        // this.uri = uri;
        this._includesWsdl = [];
        this._initializeOptions(options);
    }
    WSDL.prototype.build = function () {
        var _this = this;
        return this._fromXML(stripBom(this.definition))
            .then(function () { return _this.processIncludes(); })
            .then(function (definitions) {
            var name;
            _this.definitions = definitions;
            _this.definitions.deleteFixedAttrs();
            var services = _this.services = _this.definitions.services;
            if (services) {
                for (name in services) {
                    services[name].postProcess(_this.definitions);
                }
            }
            var complexTypes = _this.definitions.complexTypes;
            if (complexTypes) {
                for (name in complexTypes) {
                    complexTypes[name].deleteFixedAttrs();
                }
            }
            // for document style, for every binding, prepare input message element name to (methodName, output message element name) mapping
            var bindings = _this.definitions.bindings;
            for (var bindingName in bindings) {
                var binding = bindings[bindingName];
                if (typeof binding.style === 'undefined') {
                    binding.style = 'document';
                }
                if (binding.style !== 'document')
                    continue;
                var methods = binding.methods;
                var topEls = binding.topElements = {};
                for (var methodName in methods) {
                    if (methods[methodName].input) {
                        var inputName = methods[methodName].input.$name;
                        var outputName = "";
                        if (methods[methodName].output)
                            outputName = methods[methodName].output.$name;
                        topEls[inputName] = { "methodName": methodName, "outputName": outputName };
                    }
                }
            }
            _this.xmlnsInEnvelope = _this._xmlnsMap();
            return _this;
        })
            .catch(function (err) { return console.log("Build error", err); });
    };
    WSDL.prototype.processIncludes = function () {
        var schemas = this.definitions.schemas;
        var includes = [];
        for (var ns in schemas) {
            var schema = schemas[ns];
            includes = includes.concat(schema.includes || []);
        }
        return this._processNextInclude(includes);
    };
    WSDL.prototype.toXML = function () {
        return this.xml || '';
    };
    WSDL.prototype.objectToXML = function (obj, name, nsPrefix, nsURI, isFirst, xmlnsAttr, schemaObject, nsContext) {
        if (isFirst === void 0) { isFirst = {}; }
        if (xmlnsAttr === void 0) { xmlnsAttr = {}; }
        var self = this;
        var schema = this.definitions.schemas[nsURI];
        var parentNsPrefix = nsPrefix ? nsPrefix.parent : undefined;
        if (typeof parentNsPrefix !== 'undefined') {
            //we got the parentNsPrefix for our array. setting the namespace-variable back to the current namespace string
            nsPrefix = nsPrefix.current;
        }
        parentNsPrefix = noColonNameSpace(parentNsPrefix);
        if (this.isIgnoredNameSpace(parentNsPrefix)) {
            parentNsPrefix = '';
        }
        var soapHeader = !schema;
        var qualified = schema && schema.$elementFormDefault === 'qualified';
        var parts = [];
        var prefixNamespace = (nsPrefix || qualified) && nsPrefix !== TNS_PREFIX;
        var xmlnsAttrib = '';
        if (nsURI && isFirst) {
            if (self.options.overrideRootElement && self.options.overrideRootElement.xmlnsAttributes) {
                self.options.overrideRootElement.xmlnsAttributes.forEach(function (attribute) {
                    xmlnsAttrib += ' ' + attribute.name + '="' + attribute.value + '"';
                });
            }
            else {
                if (prefixNamespace && !this.isIgnoredNameSpace(nsPrefix)) {
                    // resolve the prefix namespace
                    xmlnsAttrib += ' xmlns:' + nsPrefix + '="' + nsURI + '"';
                }
                // only add default namespace if the schema elementFormDefault is qualified
                if (qualified || soapHeader)
                    xmlnsAttrib += ' xmlns="' + nsURI + '"';
            }
        }
        if (!nsContext) {
            nsContext = new NamespaceContext();
            nsContext.declareNamespace(nsPrefix, nsURI);
        }
        else {
            nsContext.pushContext();
        }
        // explicitly use xmlns attribute if available
        if (xmlnsAttr && !(self.options.overrideRootElement && self.options.overrideRootElement.xmlnsAttributes)) {
            xmlnsAttrib = xmlnsAttr;
        }
        var ns = '';
        if (self.options.overrideRootElement && isFirst) {
            ns = self.options.overrideRootElement.namespace;
        }
        else if (prefixNamespace && (qualified || isFirst || soapHeader) && !this.isIgnoredNameSpace(nsPrefix)) {
            ns = nsPrefix;
        }
        var i, n;
        // start building out XML string.
        if (Array.isArray(obj)) {
            for (i = 0, n = obj.length; i < n; i++) {
                var item = obj[i];
                var arrayAttr = self.processAttributes(item, nsContext), correctOuterNsPrefix = parentNsPrefix || ns; //using the parent namespace prefix if given
                parts.push(['<', appendColon(correctOuterNsPrefix), name, arrayAttr, xmlnsAttrib, '>'].join(''));
                parts.push(self.objectToXML(item, name, nsPrefix, nsURI, false, null, schemaObject, nsContext));
                parts.push(['</', appendColon(correctOuterNsPrefix), name, '>'].join(''));
            }
        }
        else if (typeof obj === 'object') {
            for (name in obj) {
                if (!obj.hasOwnProperty(name))
                    continue;
                //don't process attributes as element
                if (name === self.options.attributesKey) {
                    continue;
                }
                //Its the value of a xml object. Return it directly.
                if (name === self.options.xmlKey) {
                    nsContext.popContext();
                    return obj[name];
                }
                //Its the value of an item. Return it directly.
                if (name === self.options.valueKey) {
                    nsContext.popContext();
                    return xmlEscape(obj[name]);
                }
                var child = obj[name];
                if (typeof child === 'undefined') {
                    continue;
                }
                var attr = self.processAttributes(child, nsContext);
                var value = '';
                var nonSubNameSpace = '';
                var emptyNonSubNameSpace = false;
                var nameWithNsRegex = /^([^:]+):([^:]+)$/.exec(name);
                if (nameWithNsRegex) {
                    nonSubNameSpace = nameWithNsRegex[1] + ':';
                    name = nameWithNsRegex[2];
                }
                else if (name[0] === ':') {
                    emptyNonSubNameSpace = true;
                    name = name.substr(1);
                }
                if (isFirst) {
                    value = self.objectToXML(child, name, nsPrefix, nsURI, false, null, schemaObject, nsContext);
                }
                else {
                    if (self.definitions.schemas) {
                        if (schema) {
                            var childSchemaObject = self.findChildSchemaObject(schemaObject, name);
                            //find sub namespace if not a primitive
                            if (childSchemaObject &&
                                ((childSchemaObject.$type && (childSchemaObject.$type.indexOf('xsd:') === -1)) ||
                                    childSchemaObject.$ref || childSchemaObject.$name)) {
                                /*if the base name space of the children is not in the ingoredSchemaNamspaces we use it.
                                 This is because in some services the child nodes do not need the baseNameSpace.
                                 */
                                var childNsPrefix = '';
                                var childName = '';
                                var childNsURI;
                                var childXmlnsAttrib = '';
                                var elementQName = childSchemaObject.$ref || childSchemaObject.$name;
                                if (elementQName) {
                                    elementQName = splitQName(elementQName);
                                    childName = elementQName.name;
                                    if (elementQName.prefix === TNS_PREFIX) {
                                        // Local element
                                        childNsURI = childSchemaObject.$targetNamespace;
                                        childNsPrefix = nsContext.registerNamespace(childNsURI);
                                        if (this.isIgnoredNameSpace(childNsPrefix)) {
                                            childNsPrefix = nsPrefix;
                                        }
                                    }
                                    else {
                                        childNsPrefix = elementQName.prefix;
                                        if (this.isIgnoredNameSpace(childNsPrefix)) {
                                            childNsPrefix = nsPrefix;
                                        }
                                        childNsURI = schema.xmlns[childNsPrefix] || self.definitions.xmlns[childNsPrefix];
                                    }
                                    var unqualified = false;
                                    // Check qualification form for local elements
                                    if (childSchemaObject.$name && childSchemaObject.targetNamespace === undefined) {
                                        if (childSchemaObject.$form === 'unqualified') {
                                            unqualified = true;
                                        }
                                        else if (childSchemaObject.$form === 'qualified') {
                                            unqualified = false;
                                        }
                                        else {
                                            unqualified = schema.$elementFormDefault !== 'qualified';
                                        }
                                    }
                                    if (unqualified) {
                                        childNsPrefix = '';
                                    }
                                    if (childNsURI && childNsPrefix) {
                                        if (nsContext.declareNamespace(childNsPrefix, childNsURI)) {
                                            childXmlnsAttrib = ' xmlns:' + childNsPrefix + '="' + childNsURI + '"';
                                            xmlnsAttrib += childXmlnsAttrib;
                                        }
                                    }
                                }
                                var resolvedChildSchemaObject;
                                if (childSchemaObject.$type) {
                                    var typeQName = splitQName(childSchemaObject.$type);
                                    var typePrefix = typeQName.prefix;
                                    var typeURI = schema.xmlns[typePrefix] || self.definitions.xmlns[typePrefix];
                                    childNsURI = typeURI;
                                    if (typeURI !== 'http://www.w3.org/2001/XMLSchema' && typePrefix !== TNS_PREFIX) {
                                        // Add the prefix/namespace mapping, but not declare it
                                        nsContext.addNamespace(typePrefix, typeURI);
                                    }
                                    resolvedChildSchemaObject =
                                        self.findSchemaType(typeQName.name, typeURI) || childSchemaObject;
                                }
                                else {
                                    resolvedChildSchemaObject =
                                        self.findSchemaObject(childNsURI, childName) || childSchemaObject;
                                }
                                if (childSchemaObject.$baseNameSpace && this.options.ignoreBaseNameSpaces) {
                                    childNsPrefix = nsPrefix;
                                    childNsURI = nsURI;
                                }
                                if (this.options.ignoreBaseNameSpaces) {
                                    childNsPrefix = '';
                                    childNsURI = '';
                                }
                                ns = childNsPrefix;
                                if (Array.isArray(child)) {
                                    //for arrays, we need to remember the current namespace
                                    childNsPrefix = {
                                        current: childNsPrefix,
                                        parent: ns
                                    };
                                }
                                else {
                                    //parent (array) already got the namespace
                                    childXmlnsAttrib = null;
                                }
                                value = self.objectToXML(child, name, childNsPrefix, childNsURI, false, childXmlnsAttrib, resolvedChildSchemaObject, nsContext);
                            }
                            else if (obj[self.options.attributesKey] && obj[self.options.attributesKey].xsi_type) {
                                //if parent object has complex type defined and child not found in parent
                                var completeChildParamTypeObject = self.findChildSchemaObject(obj[self.options.attributesKey].xsi_type.type, obj[self.options.attributesKey].xsi_type.xmlns);
                                nonSubNameSpace = obj[self.options.attributesKey].xsi_type.prefix;
                                nsContext.addNamespace(obj[self.options.attributesKey].xsi_type.prefix, obj[self.options.attributesKey].xsi_type.xmlns);
                                value = self.objectToXML(child, name, obj[self.options.attributesKey].xsi_type.prefix, obj[self.options.attributesKey].xsi_type.xmlns, false, null, null, nsContext);
                            }
                            else {
                                if (Array.isArray(child)) {
                                    name = nonSubNameSpace + name;
                                }
                                value = self.objectToXML(child, name, nsPrefix, nsURI, false, null, null, nsContext);
                            }
                        }
                        else {
                            value = self.objectToXML(child, name, nsPrefix, nsURI, false, null, null, nsContext);
                        }
                    }
                }
                ns = noColonNameSpace(ns);
                if (prefixNamespace && !qualified && isFirst && !self.options.overrideRootElement) {
                    ns = nsPrefix;
                }
                else if (this.isIgnoredNameSpace(ns)) {
                    ns = '';
                }
                if (!Array.isArray(child)) {
                    // start tag
                    parts.push(['<', emptyNonSubNameSpace ? '' : appendColon(nonSubNameSpace || ns), name, attr, xmlnsAttrib,
                        (child === null ? ' xsi:nil="true"' : ''), '>'].join(''));
                }
                parts.push(value);
                if (!Array.isArray(child)) {
                    // end tag
                    parts.push(['</', emptyNonSubNameSpace ? '' : appendColon(nonSubNameSpace || ns), name, '>'].join(''));
                }
            }
        }
        else if (obj !== undefined) {
            parts.push((self.options.escapeXML) ? xmlEscape(obj) : obj);
        }
        nsContext.popContext();
        return parts.join('');
    };
    /**
   * Create RPC style xml string from the parameters
   * @param {string} name
   * @param {*} params
   * @param {string} nsPrefix
   * @param {string} nsURI
   * @param {boolean} isParts
   * @returns {string}
   */
    WSDL.prototype.objectToRpcXML = function (name, params, nsPrefix, nsURI, isParts) {
        var parts = [];
        var defs = this.definitions;
        var nsAttrName = '_xmlns';
        nsPrefix = nsPrefix || findPrefix(defs.xmlns, nsURI);
        nsURI = nsURI || defs.xmlns[nsPrefix];
        nsPrefix = nsPrefix === TNS_PREFIX ? '' : (nsPrefix + ':');
        parts.push(['<', nsPrefix, name, '>'].join(''));
        for (var key in params) {
            if (!params.hasOwnProperty(key)) {
                continue;
            }
            if (key !== nsAttrName) {
                var value = params[key];
                var prefixedKey = (isParts ? '' : nsPrefix) + key;
                parts.push(['<', prefixedKey, '>'].join(''));
                parts.push((typeof value === 'object') ? this.objectToXML(value, key, nsPrefix, nsURI) : xmlEscape(value));
                parts.push(['</', prefixedKey, '>'].join(''));
            }
        }
        parts.push(['</', nsPrefix, name, '>'].join(''));
        return parts.join('');
    };
    /**
   * Create document style xml string from the parameters
   * @param {String} name
   * @param {*} params
   * @param {String} nsPrefix
   * @param {String} nsURI
   * @param {String} type
   */
    WSDL.prototype.objectToDocumentXML = function (name, params, nsPrefix, nsURI, type) {
        var args = {};
        args[name] = params;
        var parameterTypeObj = type ? this.findSchemaObject(nsURI, type) : null;
        return this.objectToXML(args, null, nsPrefix, nsURI, true, null, parameterTypeObj);
    };
    WSDL.prototype.isIgnoredNameSpace = function (ns) {
        return this.options.ignoredNamespaces.indexOf(ns) > -1;
    };
    WSDL.prototype.filterOutIgnoredNameSpace = function (ns) {
        var namespace = noColonNameSpace(ns);
        return this.isIgnoredNameSpace(namespace) ? '' : namespace;
    };
    WSDL.prototype.processAttributes = function (child, nsContext) {
        var attr = '';
        if (child === null) {
            child = [];
        }
        var attrObj = child[this.options.attributesKey];
        if (attrObj && attrObj.xsi_type) {
            var xsiType = attrObj.xsi_type;
            var prefix = xsiType.prefix || xsiType.namespace;
            // Generate a new namespace for complex extension if one not provided
            if (!prefix) {
                prefix = nsContext.registerNamespace(xsiType.xmlns);
            }
            else {
                nsContext.declareNamespace(prefix, xsiType.xmlns);
            }
            xsiType.prefix = prefix;
        }
        if (attrObj) {
            for (var attrKey in attrObj) {
                //handle complex extension separately
                if (attrKey === 'xsi_type') {
                    var attrValue = attrObj[attrKey];
                    attr += ' xsi:type="' + attrValue.prefix + ':' + attrValue.type + '"';
                    attr += ' xmlns:' + attrValue.prefix + '="' + attrValue.xmlns + '"';
                    continue;
                }
                else {
                    attr += ' ' + attrKey + '="' + xmlEscape(attrObj[attrKey]) + '"';
                }
            }
        }
        return attr;
    };
    WSDL.prototype.findSchemaType = function (name, nsURI) {
        if (!this.definitions.schemas || !name || !nsURI) {
            return null;
        }
        var schema = this.definitions.schemas[nsURI];
        if (!schema || !schema.complexTypes) {
            return null;
        }
        return schema.complexTypes[name];
    };
    WSDL.prototype.findChildSchemaObject = function (parameterTypeObj, childName, backtrace) {
        if (backtrace === void 0) { backtrace = []; }
        if (!parameterTypeObj || !childName) {
            return null;
        }
        if (!backtrace) {
            backtrace = [];
        }
        if (backtrace.indexOf(parameterTypeObj) >= 0) {
            // We've recursed back to ourselves; break.
            return null;
        }
        else {
            backtrace = backtrace.concat([parameterTypeObj]);
        }
        var found = null, i = 0, child, ref;
        if (Array.isArray(parameterTypeObj.$lookupTypes) && parameterTypeObj.$lookupTypes.length) {
            var types = parameterTypeObj.$lookupTypes;
            for (i = 0; i < types.length; i++) {
                var typeObj = types[i];
                if (typeObj.$name === childName) {
                    found = typeObj;
                    break;
                }
            }
        }
        var object = parameterTypeObj;
        if (object.$name === childName && object.name === 'element') {
            return object;
        }
        if (object.$ref) {
            ref = splitQName(object.$ref);
            if (ref.name === childName) {
                return object;
            }
        }
        var childNsURI;
        if (object.$type) {
            var typeInfo = splitQName(object.$type);
            if (typeInfo.prefix === TNS_PREFIX) {
                childNsURI = parameterTypeObj.$targetNamespace;
            }
            else {
                childNsURI = this.definitions.xmlns[typeInfo.prefix];
            }
            var typeDef = this.findSchemaType(typeInfo.name, childNsURI);
            if (typeDef) {
                return this.findChildSchemaObject(typeDef, childName, backtrace);
            }
        }
        if (object.children) {
            for (i = 0, child; child = object.children[i]; i++) {
                found = this.findChildSchemaObject(child, childName, backtrace);
                if (found) {
                    break;
                }
                if (child.$base) {
                    var baseQName = splitQName(child.$base);
                    var childNameSpace = baseQName.prefix === TNS_PREFIX ? '' : baseQName.prefix;
                    childNsURI = this.definitions.xmlns[baseQName.prefix];
                    var foundBase = this.findSchemaType(baseQName.name, childNsURI);
                    if (foundBase) {
                        found = this.findChildSchemaObject(foundBase, childName, backtrace);
                        if (found) {
                            found.$baseNameSpace = childNameSpace;
                            found.$type = childNameSpace + ':' + childName;
                            break;
                        }
                    }
                }
            }
        }
        if (!found && object.$name === childName) {
            return object;
        }
        return found;
    };
    WSDL.prototype.xmlToObject = function (xml, callback) {
        var self = this;
        // var p = typeof callback === 'function' ? {} : saxParser(true, {});
        var p = sax.parser(true, {});
        var objectName = null;
        var root = {};
        var schema = {
            Envelope: {
                Header: {
                    Security: {
                        UsernameToken: {
                            Username: 'string',
                            Password: 'string'
                        }
                    }
                },
                Body: {
                    Fault: {
                        faultcode: 'string',
                        faultstring: 'string',
                        detail: 'string'
                    }
                }
            }
        };
        var stack = [{ name: null, object: root, schema: schema }];
        var xmlns = {};
        var refs = {}, id; // {id:{hrefs:[],obj:}, ...}
        p.onopentag = function (node) {
            var nsName = node.name;
            var attrs = node.attributes;
            var name = splitQName(nsName).name, attributeName, top = stack[stack.length - 1], topSchema = top.schema, elementAttributes = {}, hasNonXmlnsAttribute = false, hasNilAttribute = false, obj = {};
            var originalName = name;
            if (!objectName && top.name === 'Body' && name !== 'Fault') {
                var message = self.definitions.messages[name];
                // Support RPC/literal messages where response body contains one element named
                // after the operation + 'Response'. See http://www.w3.org/TR/wsdl#_names
                if (!message) {
                    // Determine if this is request or response
                    var isInput = false;
                    var isOutput = false;
                    if ((/Response$/).test(name)) {
                        isOutput = true;
                        name = name.replace(/Response$/, '');
                    }
                    else if ((/Request$/).test(name)) {
                        isInput = true;
                        name = name.replace(/Request$/, '');
                    }
                    else if ((/Solicit$/).test(name)) {
                        isInput = true;
                        name = name.replace(/Solicit$/, '');
                    }
                    // Look up the appropriate message as given in the portType's operations
                    var portTypes = self.definitions.portTypes;
                    var portTypeNames = Object.keys(portTypes);
                    // Currently this supports only one portType definition.
                    var portType = portTypes[portTypeNames[0]];
                    if (isInput) {
                        name = portType.methods[name].input.$name;
                    }
                    else {
                        name = portType.methods[name].output.$name;
                    }
                    message = self.definitions.messages[name];
                    // 'cache' this alias to speed future lookups
                    self.definitions.messages[originalName] = self.definitions.messages[name];
                }
                topSchema = message.description(self.definitions);
                objectName = originalName;
            }
            if (attrs.href) {
                id = attrs.href.substr(1);
                if (!refs[id]) {
                    refs[id] = { hrefs: [], obj: null };
                }
                refs[id].hrefs.push({ par: top.object, key: name, obj: obj });
            }
            if (id = attrs.id) {
                if (!refs[id]) {
                    refs[id] = { hrefs: [], obj: null };
                }
            }
            //Handle element attributes
            for (attributeName in attrs) {
                if (/^xmlns:|^xmlns$/.test(attributeName)) {
                    xmlns[splitQName(attributeName).name] = attrs[attributeName];
                    continue;
                }
                hasNonXmlnsAttribute = true;
                elementAttributes[attributeName] = attrs[attributeName];
            }
            for (attributeName in elementAttributes) {
                var res = splitQName(attributeName);
                if (res.name === 'nil' && xmlns[res.prefix] === 'http://www.w3.org/2001/XMLSchema-instance') {
                    hasNilAttribute = true;
                    break;
                }
            }
            if (hasNonXmlnsAttribute) {
                obj[self.options.attributesKey] = elementAttributes;
            }
            // Pick up the schema for the type specified in element's xsi:type attribute.
            var xsiTypeSchema;
            var xsiType = elementAttributes['xsi:type'];
            if (xsiType) {
                var type = splitQName(xsiType);
                var typeURI;
                if (type.prefix === TNS_PREFIX) {
                    // In case of xsi:type = "MyType"
                    typeURI = xmlns[type.prefix] || xmlns.xmlns;
                }
                else {
                    typeURI = xmlns[type.prefix];
                }
                var typeDef = self.findSchemaObject(typeURI, type.name);
                if (typeDef) {
                    xsiTypeSchema = typeDef.description(self.definitions);
                }
            }
            if (topSchema && topSchema[name + '[]']) {
                name = name + '[]';
            }
            stack.push({ name: originalName, object: obj, schema: (xsiTypeSchema || (topSchema && topSchema[name])), id: attrs.id, nil: hasNilAttribute });
        };
        p.onclosetag = function (nsName) {
            var cur = stack.pop(), obj = cur.object, top = stack[stack.length - 1], topObject = top.object, topSchema = top.schema, name = splitQName(nsName).name;
            if (typeof cur.schema === 'string' && (cur.schema === 'string' || cur.schema.split(':')[1] === 'string')) {
                if (typeof obj === 'object' && Object.keys(obj).length === 0)
                    obj = cur.object = '';
            }
            if (cur.nil === true) {
                return;
            }
            if (_.isPlainObject(obj) && !Object.keys(obj).length) {
                obj = null;
            }
            if (topSchema && topSchema[name + '[]']) {
                if (!topObject[name]) {
                    topObject[name] = [];
                }
                topObject[name].push(obj);
            }
            else if (name in topObject) {
                if (!Array.isArray(topObject[name])) {
                    topObject[name] = [topObject[name]];
                }
                topObject[name].push(obj);
            }
            else {
                topObject[name] = obj;
            }
            if (cur.id) {
                refs[cur.id].obj = obj;
            }
        };
        p.oncdata = function (text) {
            text = trim(text);
            if (!text.length) {
                return;
            }
            if (/<\?xml[\s\S]+\?>/.test(text)) {
                var top = stack[stack.length - 1];
                var value = self.xmlToObject(text);
                if (top.object[self.options.attributesKey]) {
                    top.object[self.options.valueKey] = value;
                }
                else {
                    top.object = value;
                }
            }
            else {
                p.ontext(text);
            }
        };
        p.onerror = function (e) {
            p.resume();
            throw {
                Fault: {
                    faultcode: 500,
                    faultstring: 'Invalid XML',
                    detail: new Error(e.message).message,
                    statusCode: 500
                }
            };
        };
        p.ontext = function (text) {
            text = trim(text);
            if (!text.length) {
                return;
            }
            var top = stack[stack.length - 1];
            var name = splitQName(top.schema).name, value;
            if (self.options && self.options.customDeserializer && self.options.customDeserializer[name]) {
                value = self.options.customDeserializer[name](text, top);
            }
            else {
                if (name === 'int' || name === 'integer') {
                    value = parseInt(text, 10);
                }
                else if (name === 'bool' || name === 'boolean') {
                    value = text.toLowerCase() === 'true' || text === '1';
                }
                else if (name === 'dateTime' || name === 'date') {
                    value = new Date(text);
                }
                else {
                    // handle string or other types
                    if (typeof top.object !== 'string') {
                        value = text;
                    }
                    else {
                        value = top.object + text;
                    }
                }
            }
            if (top.object[self.options.attributesKey]) {
                top.object[self.options.valueKey] = value;
            }
            else {
                top.object = value;
            }
        };
        if (typeof callback === 'function') {
            // we be streaming
            var saxStream = sax.createStream(true, {});
            saxStream.on('opentag', p.onopentag);
            saxStream.on('closetag', p.onclosetag);
            saxStream.on('cdata', p.oncdata);
            saxStream.on('text', p.ontext);
            xml.pipe(saxStream)
                .on('error', function (err) {
                callback(err);
            })
                .on('end', function () {
                var r;
                try {
                    r = finish();
                }
                catch (e) {
                    return callback(e);
                }
                callback(null, r);
            });
            return;
        }
        p.write(xml).close();
        return finish();
        function finish() {
            // MultiRef support: merge objects instead of replacing
            for (var n in refs) {
                var ref = refs[n];
                for (var i = 0; i < ref.hrefs.length; i++) {
                    _.assign(ref.hrefs[i].obj, ref.obj);
                }
            }
            if (root.Envelope) {
                var body = root.Envelope.Body;
                if (body && body.Fault) {
                    var code = body.Fault && body.Fault.faultcode && body.Fault.faultcode.$value ? body.Fault.faultcode.$value : body.Fault && body.Fault.faultcode;
                    // selectn('faultcode.$value', body.Fault) || selectn('faultcode', body.Fault);
                    var string = body.Fault && body.Fault.faultstring && body.Fault.faultstring.$value ? body.Fault.faultstring.$value : body.Fault && body.Fault.faultstring;
                    // selectn('faultstring.$value', body.Fault) || selectn('faultstring', body.Fault);
                    var detail = body.Fault && body.Fault.detail && body.Fault.detail.$value ? body.Fault.detail.$value : body.Fault && body.Fault.detail && body.Fault.detail.message;
                    // selectn('detail.$value', body.Fault) || selectn('detail.message', body.Fault);
                    var error = new Error(code + ': ' + string + (detail ? ': ' + detail : ''));
                    error.root = root;
                    throw error;
                }
                return root.Envelope;
            }
            return root;
        }
    };
    WSDL.prototype._processNextInclude = function (includes) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            resolve(_this.definitions);
            // var include = includes.shift();
            // var options;
            // if (!include) { resolve(this.definitions) }
            // var includePath = resolveUrl(this.uri || '', include.location);
            // options = _.assign({}, this.options);
            // // follow supplied ignoredNamespaces option
            // options.ignoredNamespaces = this._originalIgnoredNamespaces || this.options.ignoredNamespaces;
            // return openWsdl(includePath, options)
            //   .then(wsdl => {
            //     this._includesWsdl.push(wsdl);
            //     if (wsdl.definitions instanceof DefinitionsElement) {
            //       _.merge(this.definitions, wsdl.definitions, function (a: any, b: any) {
            //         return (a instanceof SchemaElement) ? a.merge(b) : undefined;
            //       });
            //     } else {
            //       this.definitions.schemas[include.namespace || wsdl.definitions.$targetNamespace] = deepMerge(this.definitions.schemas[include.namespace || wsdl.definitions.$targetNamespace], wsdl.definitions);
            //     }
            //     return this._processNextInclude(includes);
            //   })
            //   .catch(err => reject(err));
        });
    };
    WSDL.prototype._initializeOptions = function (options) {
        this._originalIgnoredNamespaces = (options || {}).ignoredNamespaces;
        this.options = {};
        var ignoredNamespaces = options ? options.ignoredNamespaces : null;
        if (ignoredNamespaces &&
            (Array.isArray(ignoredNamespaces.namespaces) || typeof ignoredNamespaces.namespaces === 'string')) {
            if (ignoredNamespaces.override) {
                this.options.ignoredNamespaces = ignoredNamespaces.namespaces;
            }
            else {
                this.options.ignoredNamespaces = this.ignoredNamespaces.concat(ignoredNamespaces.namespaces);
            }
        }
        else {
            this.options.ignoredNamespaces = this.ignoredNamespaces;
        }
        this.options.valueKey = options.valueKey || this.valueKey;
        this.options.xmlKey = options.xmlKey || this.xmlKey;
        if (options.escapeXML !== undefined) {
            this.options.escapeXML = options.escapeXML;
        }
        else {
            this.options.escapeXML = true;
        }
        // Allow any request headers to keep passing through
        this.options.wsdl_headers = options.wsdl_headers;
        this.options.wsdl_options = options.wsdl_options;
        if (options.httpClient) {
            this.options.httpClient = options.httpClient;
        }
        // // The supplied request-object should be passed through
        // if (options.request) {
        //   this.options.request = options.request;
        // }
        var ignoreBaseNameSpaces = options ? options.ignoreBaseNameSpaces : null;
        if (ignoreBaseNameSpaces !== null && typeof ignoreBaseNameSpaces !== 'undefined') {
            this.options.ignoreBaseNameSpaces = ignoreBaseNameSpaces;
        }
        else {
            this.options.ignoreBaseNameSpaces = this.ignoreBaseNameSpaces;
        }
        // Works only in client
        this.options.forceSoap12Headers = options.forceSoap12Headers;
        this.options.customDeserializer = options.customDeserializer;
        if (options.overrideRootElement !== undefined) {
            this.options.overrideRootElement = options.overrideRootElement;
        }
    };
    WSDL.prototype._fromXML = function (xml) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.definitions = _this._parse(xml);
            _this.definitions.descriptions = {
                types: {}
            };
            _this.xml = xml;
            resolve(_this.definitions);
        });
    };
    WSDL.prototype._parse = function (xml) {
        var self = this, p = sax.parser(true, {}), stack = [], root = null, types = null, schema = null, options = self.options;
        p.onopentag = function (node) {
            var nsName = node.name;
            var attrs = node.attributes;
            var top = stack[stack.length - 1];
            var name;
            if (top) {
                try {
                    stack = top.startElement(stack, nsName, attrs, options);
                }
                catch (e) {
                    if (self.options.strict) {
                        throw e;
                    }
                    else {
                        stack.push(new Element(nsName, attrs, options));
                    }
                }
            }
            else {
                name = splitQName(nsName).name;
                if (name === 'definitions') {
                    root = new DefinitionsElement(nsName, attrs, options);
                    stack.push(root);
                }
                else if (name === 'schema') {
                    // Shim a structure in here to allow the proper objects to be created when merging back.
                    root = new DefinitionsElement('definitions', {}, {});
                    types = new TypesElement('types', {}, {});
                    schema = new SchemaElement(nsName, attrs, options);
                    types.addChild(schema);
                    root.addChild(types);
                    stack.push(schema);
                }
                else {
                    throw new Error('Unexpected root element of WSDL or include');
                }
            }
        };
        p.onclosetag = function (name) {
            var top = stack[stack.length - 1];
            // assert(top, 'Unmatched close tag: ' + name);
            stack = top.endElement(stack, name);
        };
        p.write(xml).close();
        return root;
    };
    WSDL.prototype._xmlnsMap = function () {
        var xmlns = this.definitions.xmlns;
        var str = '';
        for (var alias in xmlns) {
            if (alias === '' || alias === TNS_PREFIX) {
                continue;
            }
            var ns = xmlns[alias];
            switch (ns) {
                case "http://xml.apache.org/xml-soap": // apachesoap
                case "http://schemas.xmlsoap.org/wsdl/": // wsdl
                case "http://schemas.xmlsoap.org/wsdl/soap/": // wsdlsoap
                case "http://schemas.xmlsoap.org/wsdl/soap12/": // wsdlsoap12
                case "http://schemas.xmlsoap.org/soap/encoding/": // soapenc
                case "http://www.w3.org/2001/XMLSchema":
                    continue;
            }
            if (~ns.indexOf('http://schemas.xmlsoap.org/')) {
                continue;
            }
            if (~ns.indexOf('http://www.w3.org/')) {
                continue;
            }
            if (~ns.indexOf('http://xml.apache.org/')) {
                continue;
            }
            str += ' xmlns:' + alias + '="' + ns + '"';
        }
        return str;
    };
    return WSDL;
}());
var Element = (function () {
    function Element(nsName, attrs, options) {
        if (attrs === void 0) { attrs = {}; }
        if (options === void 0) { options = {}; }
        this.children = [];
        this.allowedChildren = {};
        this.includes = [];
        this.methods = {};
        this.ports = {};
        var parts = splitQName(nsName);
        this.nsName = nsName;
        this.prefix = parts.prefix;
        this.name = parts.name;
        this.children = [];
        this.xmlns = {};
        this._initializeOptions(options);
        for (var key in attrs) {
            var match = /^xmlns:?(.*)$/.exec(key);
            if (match) {
                this.xmlns[match[1] ? match[1] : TNS_PREFIX] = attrs[key];
            }
            else {
                if (key === 'value') {
                    this[this.valueKey] = attrs[key];
                }
                else {
                    this['$' + key] = attrs[key];
                }
            }
        }
        if (this.$targetNamespace !== undefined) {
            // Add targetNamespace to the mapping
            this.xmlns[TNS_PREFIX] = this.$targetNamespace;
        }
        // this.allowedChildren = mapElementTypes(splitQName(nsName).name);
    }
    Element.prototype._initializeOptions = function (options) {
        if (options) {
            this.valueKey = options.valueKey || '$value';
            this.xmlKey = options.xmlKey || '$xml';
            this.ignoredNamespaces = options.ignoredNamespaces || [];
        }
        else {
            this.valueKey = '$value';
            this.xmlKey = '$xml';
            this.ignoredNamespaces = [];
        }
    };
    
    Element.prototype.deleteFixedAttrs = function () {
        this.children && this.children.length === 0 && delete this.children;
        this.xmlns && Object.keys(this.xmlns).length === 0 && delete this.xmlns;
        delete this.nsName;
        delete this.prefix;
        delete this.name;
    };
    
    Element.prototype.startElement = function (stack, nsName, attrs, options) {
        // if (!this.allowedChildren) {
        //   return;
        // }
        // let ChildClass = this.allowedChildren[splitQName(nsName).name];
        // let element = null;
        // if (ChildClass) {
        //   stack.push(new ChildClass(nsName, attrs, options));
        // }
        // else {
        //   this.unexpected(nsName);
        // }
        var ChildClass = ElementTypeMap[splitQName(nsName).name][0];
        if (ChildClass) {
            stack.push(new ChildClass(nsName, attrs, options));
        }
        
        return stack;
    };
    Element.prototype.unexpected = function (name) {
        throw new Error('Found unexpected element (' + name + ') inside ' + this.nsName);
    };
    Element.prototype.endElement = function (stack, nsName) {
        if (this.nsName === nsName) {
            if (stack.length < 2)
                return;
            var parent = stack[stack.length - 2];
            if (this !== stack[0]) {
                _.defaultsDeep(stack[0].xmlns, this.xmlns);
                // delete this.xmlns;
                parent.children.push(this);
                parent.addChild(this);
            }
            stack.pop();
        }
        return stack;
    };
    Element.prototype.addChild = function (child) { return; };
    Element.prototype.description = function (definitions, xmlns) {
        if (definitions === void 0) { definitions = {}; }
        return this.$name || this.name;
    };
    Element.prototype.init = function () {
    };
    return Element;
}());
var MessageElement = (function (_super) {
    __extends(MessageElement, _super);
    function MessageElement(nsName, attrs, options) {
        if (attrs === void 0) { attrs = {}; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, nsName, attrs, options) || this;
        _this.init();
        return _this;
    }
    MessageElement.prototype.init = function () {
        this.element = null;
        this.parts = null;
    };
    MessageElement.prototype.description = function (definitions, xmlns) {
        if (definitions === void 0) { definitions = {}; }
        if (this.element) {
            return this.element && this.element.description(definitions);
        }
        var desc = {};
        desc[this.$name] = this.parts;
        return desc;
    };
    MessageElement.prototype.postProcess = function (definitions) {
        var part = null;
        var child;
        var children = this.children || [];
        var ns;
        var nsName;
        var i;
        var type;
        for (i in children) {
            if ((child = children[i]).name === 'part') {
                part = child;
                break;
            }
        }
        if (!part) {
            return;
        }
        if (part.$element) {
            var lookupTypes = [], elementChildren;
            delete this.parts;
            nsName = splitQName(part.$element);
            ns = nsName.prefix;
            var schema = definitions.schemas[definitions.xmlns[ns]];
            this.element = schema.elements[nsName.name];
            if (!this.element) {
                return;
            }
            this.element.targetNSAlias = ns;
            this.element.targetNamespace = definitions.xmlns[ns];
            // set the optional $lookupType to be used within `client#_invoke()` when
            // calling `wsdl#objectToDocumentXML()
            this.element.$lookupType = part.$element;
            elementChildren = this.element.children;
            // get all nested lookup types (only complex types are followed)
            if (elementChildren.length > 0) {
                for (i = 0; i < elementChildren.length; i++) {
                    lookupTypes.push(this._getNestedLookupTypeString(elementChildren[i]));
                }
            }
            // if nested lookup types where found, prepare them for furter usage
            if (lookupTypes.length > 0) {
                lookupTypes = lookupTypes.
                    join('_').
                    split('_').
                    filter(function removeEmptyLookupTypes(type) {
                    return type !== '^';
                });
                var schemaXmlns = definitions.schemas[this.element.targetNamespace].xmlns;
                for (i = 0; i < lookupTypes.length; i++) {
                    lookupTypes[i] = this._createLookupTypeObject(lookupTypes[i], schemaXmlns);
                }
            }
            this.element.$lookupTypes = lookupTypes;
            if (this.element.$type) {
                type = splitQName(this.element.$type);
                var typeNs = schema.xmlns && schema.xmlns[type.prefix] || definitions.xmlns[type.prefix];
                if (typeNs) {
                    if (type.name in Primitives) {
                        // this.element = this.element.$type;
                    }
                    else {
                        // first check local mapping of ns alias to namespace
                        schema = definitions.schemas[typeNs];
                        var ctype = schema.complexTypes[type.name] || schema.types[type.name] || schema.elements[type.name];
                        if (ctype) {
                            this.parts = ctype.description(definitions, schema.xmlns);
                        }
                    }
                }
            }
            else {
                var method = this.element.description(definitions, schema.xmlns);
                this.parts = method[nsName.name];
            }
            this.children.splice(0, 1);
        }
        else {
            // rpc encoding
            this.parts = {};
            delete this.element;
            for (i = 0; part = this.children[i]; i++) {
                if (part.name === 'documentation') {
                    // <wsdl:documentation can be present under <wsdl:message>
                    continue;
                }
                //assert(part.name === 'part', 'Expected part element');
                nsName = splitQName(part.$type);
                ns = definitions.xmlns[nsName.prefix];
                type = nsName.name;
                var schemaDefinition = definitions.schemas[ns];
                if (typeof schemaDefinition !== 'undefined') {
                    this.parts[part.$name] = definitions.schemas[ns].types[type] || definitions.schemas[ns].complexTypes[type];
                }
                else {
                    this.parts[part.$name] = part.$type;
                }
                if (typeof this.parts[part.$name] === 'object') {
                    this.parts[part.$name].prefix = nsName.prefix;
                    this.parts[part.$name].xmlns = ns;
                }
                this.children.splice(i--, 1);
            }
        }
        this.deleteFixedAttrs();
    };
    MessageElement.prototype._createLookupTypeObject = function (nsString, xmlns) {
        var splittedNSString = splitQName(nsString), nsAlias = splittedNSString.prefix, splittedName = splittedNSString.name.split('#'), type = splittedName[0], name = splittedName[1], lookupTypeObj = {};
        lookupTypeObj.$namespace = xmlns[nsAlias];
        lookupTypeObj.$type = nsAlias + ':' + type;
        lookupTypeObj.$name = name;
        return lookupTypeObj;
    };
    MessageElement.prototype._getNestedLookupTypeString = function (element) {
        var _this = this;
        var resolvedType = '^', excluded = this.ignoredNamespaces.concat('xs'); // do not process $type values wich start with
        if (element.hasOwnProperty('$type') && typeof element.$type === 'string') {
            if (excluded.indexOf(element.$type.split(':')[0]) === -1) {
                resolvedType += ('_' + element.$type + '#' + element.$name);
            }
        }
        if (element.children.length > 0) {
            element.children.forEach(function (child) {
                var resolvedChildType = _this._getNestedLookupTypeString(child).replace(/\^_/, '');
                if (resolvedChildType && typeof resolvedChildType === 'string') {
                    resolvedType += ('_' + resolvedChildType);
                }
            });
        }
        return resolvedType;
    };
    return MessageElement;
}(Element));
var SchemaElement = (function (_super) {
    __extends(SchemaElement, _super);
    function SchemaElement(nsName, attrs, options) {
        if (attrs === void 0) { attrs = {}; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, nsName, attrs, options) || this;
        _this.init();
        return _this;
    }
    SchemaElement.prototype.init = function () {
        this.complexTypes = {};
        this.types = {};
        this.elements = {};
        this.includes = [];
    };
    SchemaElement.prototype.merge = function (source) {
        //assert(source instanceof SchemaElement);
        if (this.$targetNamespace === source.$targetNamespace) {
            _.merge(this.complexTypes, source.complexTypes);
            _.merge(this.types, source.types);
            _.merge(this.elements, source.elements);
            _.merge(this.xmlns, source.xmlns);
        }
        return this;
    };
    SchemaElement.prototype.addChild = function (child) {
        if (child.$name in Primitives)
            return;
        if (child.name === 'include' || child.name === 'import') {
            var location = child.$schemaLocation || child.$location;
            if (location) {
                this.includes.push({
                    namespace: child.$namespace || child.$targetNamespace || this.$targetNamespace,
                    location: location
                });
            }
        }
        else if (child.name === 'complexType') {
            this.complexTypes[child.$name] = child;
        }
        else if (child.name === 'element') {
            this.elements[child.$name] = child;
        }
        else if (child.$name) {
            this.types[child.$name] = child;
        }
        this.children.pop();
    };
    return SchemaElement;
}(Element));
var TypesElement = (function (_super) {
    __extends(TypesElement, _super);
    function TypesElement(nsName, attrs, options) {
        if (attrs === void 0) { attrs = {}; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, nsName, attrs, options) || this;
        _this.init();
        return _this;
    }
    TypesElement.prototype.init = function () {
        this.schemas = {};
    };
    TypesElement.prototype.addChild = function (child) {
        //assert(child instanceof SchemaElement);
        var targetNamespace = child.$targetNamespace;
        if (!this.schemas.hasOwnProperty(targetNamespace)) {
            this.schemas[targetNamespace] = child;
        }
        else {
            console.error('Target-Namespace "' + targetNamespace + '" already in use by another Schema!');
        }
    };
    return TypesElement;
}(Element));
var ElementElement = (function (_super) {
    __extends(ElementElement, _super);
    function ElementElement(nsName, attrs, options) {
        if (attrs === void 0) { attrs = {}; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, nsName, attrs, options) || this;
        _this.init();
        return _this;
    }
    ElementElement.prototype.description = function (definitions, xmlns) {
        if (definitions === void 0) { definitions = {}; }
        var element = {}, name = this.$name;
        var isMany = !this.$maxOccurs ? false : (isNaN(this.$maxOccurs) ? (this.$maxOccurs === 'unbounded') : (this.$maxOccurs > 1));
        if (this.$minOccurs !== this.$maxOccurs && isMany) {
            name += '[]';
        }
        if (xmlns && xmlns[TNS_PREFIX]) {
            this.$targetNamespace = xmlns[TNS_PREFIX];
        }
        var type = this.$type || this.$ref;
        if (type) {
            type = splitQName(type);
            var typeName = type.name, ns = xmlns && xmlns[type.prefix] || definitions.xmlns[type.prefix], schema = definitions.schemas[ns], typeElement = schema && (this.$type ? schema.complexTypes[typeName] || schema.types[typeName] : schema.elements[typeName]);
            if (ns && definitions.schemas[ns]) {
                xmlns = definitions.schemas[ns].xmlns;
            }
            if (typeElement && !(typeName in Primitives)) {
                if (!(typeName in definitions.descriptions.types)) {
                    var elem = {};
                    definitions.descriptions.types[typeName] = elem;
                    var description = typeElement.description(definitions, xmlns);
                    if (typeof description === 'string') {
                        elem = description;
                    }
                    else {
                        Object.keys(description).forEach(function (key) {
                            elem[key] = description[key];
                        });
                    }
                    if (this.$ref) {
                        element = elem;
                    }
                    else {
                        element[name] = elem;
                    }
                    if (typeof elem === 'object') {
                        elem.targetNSAlias = type.prefix;
                        elem.targetNamespace = ns;
                    }
                    definitions.descriptions.types[typeName] = elem;
                }
                else {
                    if (this.$ref) {
                        element = definitions.descriptions.types[typeName];
                    }
                    else {
                        element[name] = definitions.descriptions.types[typeName];
                    }
                }
            }
            else {
                element[name] = this.$type;
            }
        }
        else {
            var children = this.children;
            element[name] = {};
            for (var i = 0, child; child = children[i]; i++) {
                if (child instanceof ComplexTypeElement) {
                    element[name] = child.description(definitions, xmlns);
                }
            }
        }
        return element;
    };
    return ElementElement;
}(Element));
var AnyElement = (function (_super) {
    __extends(AnyElement, _super);
    function AnyElement(nsName, attrs, options) {
        if (attrs === void 0) { attrs = {}; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, nsName, attrs, options) || this;
        _this.init();
        return _this;
    }
    AnyElement.prototype.description = function (definitions, xmlns) {
        if (definitions === void 0) { definitions = {}; }
        var children = this.children;
        var sequence = {};
        for (var i = 0, child; child = children[i]; i++) {
            if (child instanceof AnyElement) {
                continue;
            }
            var description = child.description(definitions, xmlns);
            for (var key in description) {
                sequence[key] = description[key];
            }
        }
        return sequence;
    };
    return AnyElement;
}(Element));
var InputElement = (function (_super) {
    __extends(InputElement, _super);
    function InputElement(nsName, attrs, options) {
        if (attrs === void 0) { attrs = {}; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, nsName, attrs, options) || this;
        _this.init();
        return _this;
    }
    InputElement.prototype.addChild = function (child) {
        if (child.name === 'body') {
            this.use = child.$use;
            if (this.use === 'encoded') {
                this.encodingStyle = child.$encodingStyle;
            }
            this.children.pop();
        }
    };
    return InputElement;
}(Element));
var OutputElement = (function (_super) {
    __extends(OutputElement, _super);
    function OutputElement(nsName, attrs, options) {
        if (attrs === void 0) { attrs = {}; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, nsName, attrs, options) || this;
        _this.init();
        return _this;
    }
    OutputElement.prototype.addChild = function (child) {
        if (child.name === 'body') {
            this.use = child.$use;
            if (this.use === 'encoded') {
                this.encodingStyle = child.$encodingStyle;
            }
            this.children.pop();
        }
    };
    return OutputElement;
}(Element));
var SimpleTypeElement = (function (_super) {
    __extends(SimpleTypeElement, _super);
    function SimpleTypeElement(nsName, attrs, options) {
        if (attrs === void 0) { attrs = {}; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, nsName, attrs, options) || this;
        _this.init();
        return _this;
    }
    SimpleTypeElement.prototype.description = function (definitions, xmlns) {
        if (definitions === void 0) { definitions = {}; }
        var children = this.children;
        for (var i = 0, child; child = children[i]; i++) {
            if (child instanceof RestrictionElement)
                return this.$name + "|" + child.description();
        }
        return {};
    };
    return SimpleTypeElement;
}(Element));
var RestrictionElement = (function (_super) {
    __extends(RestrictionElement, _super);
    function RestrictionElement(nsName, attrs, options) {
        if (attrs === void 0) { attrs = {}; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, nsName, attrs, options) || this;
        _this.init();
        return _this;
    }
    RestrictionElement.prototype.description = function (definitions, xmlns) {
        if (definitions === void 0) { definitions = {}; }
        var children = this.children;
        var desc;
        for (var i = 0, child; child = children[i]; i++) {
            if (child instanceof SequenceElement ||
                child instanceof ChoiceElement) {
                desc = child.description(definitions, xmlns);
                break;
            }
        }
        if (desc && this.$base) {
            var type = splitQName(this.$base), typeName = type.name, ns = xmlns && xmlns[type.prefix] || definitions.xmlns[type.prefix], schema = definitions.schemas[ns], typeElement = schema && (schema.complexTypes[typeName] || schema.types[typeName] || schema.elements[typeName]);
            desc.getBase = function () {
                return typeElement.description(definitions, schema.xmlns);
            };
            return desc;
        }
        // then simple element
        var base = this.$base ? this.$base + "|" : "";
        return base + this.children.map(function (child) {
            return child.description();
        }).join(",");
    };
    return RestrictionElement;
}(Element));
var ExtensionElement = (function (_super) {
    __extends(ExtensionElement, _super);
    function ExtensionElement(nsName, attrs, options) {
        if (attrs === void 0) { attrs = {}; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, nsName, attrs, options) || this;
        _this.init();
        return _this;
    }
    ExtensionElement.prototype.description = function (definitions, xmlns) {
        if (definitions === void 0) { definitions = {}; }
        var children = this.children;
        var desc = {};
        for (var i = 0, child; child = children[i]; i++) {
            if (child instanceof SequenceElement ||
                child instanceof ChoiceElement) {
                desc = child.description(definitions, xmlns);
            }
        }
        if (this.$base) {
            var type = splitQName(this.$base), typeName = type.name, ns = xmlns && xmlns[type.prefix] || definitions.xmlns[type.prefix], schema = definitions.schemas[ns];
            if (typeName in Primitives) {
                return this.$base;
            }
            else {
                var typeElement = schema && (schema.complexTypes[typeName] ||
                    schema.types[typeName] || schema.elements[typeName]);
                if (typeElement) {
                    var base = typeElement.description(definitions, schema.xmlns);
                    desc = _.defaultsDeep(base, desc);
                }
            }
        }
        return desc;
    };
    return ExtensionElement;
}(Element));
var ChoiceElement = (function (_super) {
    __extends(ChoiceElement, _super);
    function ChoiceElement(nsName, attrs, options) {
        if (attrs === void 0) { attrs = {}; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, nsName, attrs, options) || this;
        _this.init();
        return _this;
    }
    ChoiceElement.prototype.description = function (definitions, xmlns) {
        if (definitions === void 0) { definitions = {}; }
        var children = this.children;
        var choice = {};
        for (var i = 0, child; child = children[i]; i++) {
            var description = child.description(definitions, xmlns);
            for (var key in description) {
                choice[key] = description[key];
            }
        }
        return choice;
    };
    return ChoiceElement;
}(Element));
var EnumerationElement = (function (_super) {
    __extends(EnumerationElement, _super);
    function EnumerationElement(nsName, attrs, options) {
        if (attrs === void 0) { attrs = {}; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, nsName, attrs, options) || this;
        _this.init();
        return _this;
    }
    EnumerationElement.prototype.description = function (definitions, xmlns) {
        if (definitions === void 0) { definitions = {}; }
        return this[this.valueKey];
    };
    return EnumerationElement;
}(Element));
var ComplexTypeElement = (function (_super) {
    __extends(ComplexTypeElement, _super);
    function ComplexTypeElement(nsName, attrs, options) {
        if (attrs === void 0) { attrs = {}; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, nsName, attrs, options) || this;
        _this.init();
        return _this;
    }
    ComplexTypeElement.prototype.description = function (definitions, xmlns) {
        if (definitions === void 0) { definitions = {}; }
        var children = this.children || [];
        for (var i = 0, child; child = children[i]; i++) {
            if (child instanceof ChoiceElement ||
                child instanceof SequenceElement ||
                child instanceof AllElement ||
                child instanceof SimpleContentElement ||
                child instanceof ComplexContentElement) {
                return child.description(definitions, xmlns);
            }
        }
        return {};
    };
    return ComplexTypeElement;
}(Element));
var ComplexContentElement = (function (_super) {
    __extends(ComplexContentElement, _super);
    function ComplexContentElement(nsName, attrs, options) {
        if (attrs === void 0) { attrs = {}; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, nsName, attrs, options) || this;
        _this.init();
        return _this;
    }
    ComplexContentElement.prototype.description = function (definitions, xmlns) {
        if (definitions === void 0) { definitions = {}; }
        var children = this.children;
        for (var i = 0, child; child = children[i]; i++) {
            if (child instanceof ExtensionElement) {
                return child.description(definitions, xmlns);
            }
        }
        return {};
    };
    return ComplexContentElement;
}(Element));
var SimpleContentElement = (function (_super) {
    __extends(SimpleContentElement, _super);
    function SimpleContentElement(nsName, attrs, options) {
        if (attrs === void 0) { attrs = {}; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, nsName, attrs, options) || this;
        _this.init();
        return _this;
    }
    SimpleContentElement.prototype.description = function (definitions, xmlns) {
        if (definitions === void 0) { definitions = {}; }
        var children = this.children;
        for (var i = 0, child; child = children[i]; i++) {
            if (child instanceof ExtensionElement) {
                return child.description(definitions, xmlns);
            }
        }
        return {};
    };
    return SimpleContentElement;
}(Element));
var SequenceElement = (function (_super) {
    __extends(SequenceElement, _super);
    function SequenceElement(nsName, attrs, options) {
        if (attrs === void 0) { attrs = {}; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, nsName, attrs, options) || this;
        _this.init();
        return _this;
    }
    SequenceElement.prototype.description = function (definitions, xmlns) {
        if (definitions === void 0) { definitions = {}; }
        var children = this.children;
        var sequence = {};
        for (var i = 0, child; child = children[i]; i++) {
            if (child instanceof AnyElement) {
                continue;
            }
            var description = child.description(definitions, xmlns);
            for (var key in description) {
                sequence[key] = description[key];
            }
        }
        return sequence;
    };
    return SequenceElement;
}(Element));
var AllElement = (function (_super) {
    __extends(AllElement, _super);
    function AllElement(nsName, attrs, options) {
        if (attrs === void 0) { attrs = {}; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, nsName, attrs, options) || this;
        _this.init();
        return _this;
    }
    AllElement.prototype.description = function (definitions, xmlns) {
        if (definitions === void 0) { definitions = {}; }
        var children = this.children;
        var sequence = {};
        for (var i = 0, child; child = children[i]; i++) {
            if (child instanceof AnyElement) {
                continue;
            }
            var description = child.description(definitions, xmlns);
            for (var key in description) {
                sequence[key] = description[key];
            }
        }
        return sequence;
    };
    return AllElement;
}(Element));
var OperationElement = (function (_super) {
    __extends(OperationElement, _super);
    function OperationElement(nsName, attrs, options) {
        if (attrs === void 0) { attrs = {}; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, nsName, attrs, options) || this;
        _this.init();
        return _this;
    }
    OperationElement.prototype.init = function () {
        this.input = null;
        this.output = null;
        this.inputSoap = null;
        this.outputSoap = null;
        this.style = '';
        this.soapAction = '';
    };
    OperationElement.prototype.addChild = function (child) {
        if (child.name === 'operation') {
            this.soapAction = child.$soapAction || '';
            this.style = child.$style || '';
            this.children.pop();
        }
    };
    OperationElement.prototype.postProcess = function (definitions, tag) {
        var children = this.children;
        for (var i = 0, child; child = children[i]; i++) {
            if (child.name !== 'input' && child.name !== 'output')
                continue;
            if (tag === 'binding') {
                this[child.name] = child;
                children.splice(i--, 1);
                continue;
            }
            var messageName = splitQName(child.$message).name;
            var message = definitions.messages[messageName];
            message.postProcess(definitions);
            if (message.element) {
                definitions.messages[message.element.$name] = message;
                this[child.name] = message.element;
            }
            else {
                this[child.name] = message;
            }
            children.splice(i--, 1);
        }
        this.deleteFixedAttrs();
    };
    OperationElement.prototype.description = function (definitions, xmlns) {
        if (definitions === void 0) { definitions = {}; }
        var inputDesc = this.input ? this.input.description(definitions) : null;
        var outputDesc = this.output ? this.output.description(definitions) : null;
        return {
            input: inputDesc && inputDesc[Object.keys(inputDesc)[0]],
            output: outputDesc && outputDesc[Object.keys(outputDesc)[0]]
        };
    };
    return OperationElement;
}(Element));
var PortTypeElement = (function (_super) {
    __extends(PortTypeElement, _super);
    function PortTypeElement(nsName, attrs, options) {
        if (attrs === void 0) { attrs = {}; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, nsName, attrs, options) || this;
        _this.init();
        return _this;
    }
    PortTypeElement.prototype.init = function () {
        this.methods = {};
    };
    PortTypeElement.prototype.postProcess = function (definitions) {
        var children = this.children;
        if (typeof children === 'undefined')
            return;
        for (var i = 0, child; child = children[i]; i++) {
            if (child.name !== 'operation')
                continue;
            child.postProcess(definitions, 'portType');
            this.methods[child.$name] = child;
            children.splice(i--, 1);
        }
        delete this.$name;
        this.deleteFixedAttrs();
    };
    PortTypeElement.prototype.description = function (definitions, xmlns) {
        if (definitions === void 0) { definitions = {}; }
        var methods = {};
        for (var name in this.methods) {
            var method = this.methods[name];
            methods[name] = method.description(definitions);
        }
        return methods;
    };
    return PortTypeElement;
}(Element));
var BindingElement = (function (_super) {
    __extends(BindingElement, _super);
    function BindingElement(nsName, attrs, options) {
        if (attrs === void 0) { attrs = {}; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, nsName, attrs, options) || this;
        _this.init();
        return _this;
    }
    BindingElement.prototype.init = function () {
        this.transport = '';
        this.style = '';
        this.methods = {};
    };
    BindingElement.prototype.addChild = function (child) {
        if (child.name === 'binding') {
            this.transport = child.$transport;
            this.style = child.$style;
            this.children.pop();
        }
    };
    BindingElement.prototype.postProcess = function (definitions) {
        var type = splitQName(this.$type).name, portType = definitions.portTypes[type], style = this.style, children = this.children;
        if (portType) {
            portType.postProcess(definitions);
            this.methods = portType.methods;
            for (var i = 0, child; child = children[i]; i++) {
                if (child.name !== 'operation')
                    continue;
                child.postProcess(definitions, 'binding');
                children.splice(i--, 1);
                child.style || (child.style = style);
                var method = this.methods[child.$name];
                if (method) {
                    method.style = child.style;
                    method.soapAction = child.soapAction;
                    method.inputSoap = child.input || null;
                    method.outputSoap = child.output || null;
                    method.inputSoap && method.inputSoap.deleteFixedAttrs();
                    method.outputSoap && method.outputSoap.deleteFixedAttrs();
                }
            }
        }
        delete this.$name;
        delete this.$type;
        this.deleteFixedAttrs();
    };
    BindingElement.prototype.description = function (definitions, xmlns) {
        if (definitions === void 0) { definitions = {}; }
        var methods = {};
        for (var name in this.methods) {
            var method = this.methods[name];
            methods[name] = method.description(definitions);
        }
        return methods;
    };
    return BindingElement;
}(Element));
var PortElement = (function (_super) {
    __extends(PortElement, _super);
    function PortElement(nsName, attrs, options) {
        if (attrs === void 0) { attrs = {}; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, nsName, attrs, options) || this;
        _this.init();
        return _this;
    }
    PortElement.prototype.init = function () {
        this.location = null;
    };
    PortElement.prototype.addChild = function (child) {
        if (child.name === 'address' && typeof (child.$location) !== 'undefined') {
            this.location = child.$location;
        }
    };
    return PortElement;
}(Element));
var ServiceElement = (function (_super) {
    __extends(ServiceElement, _super);
    function ServiceElement(nsName, attrs, options) {
        if (attrs === void 0) { attrs = {}; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, nsName, attrs, options) || this;
        _this.init();
        return _this;
    }
    ServiceElement.prototype.init = function () {
        this.ports = {};
    };
    ServiceElement.prototype.postProcess = function (definitions) {
        var children = this.children, bindings = definitions.bindings;
        if (children && children.length > 0) {
            for (var i = 0, child; child = children[i]; i++) {
                if (child.name !== 'port')
                    continue;
                var bindingName = splitQName(child.$binding).name;
                var binding = bindings[bindingName];
                if (binding) {
                    binding.postProcess(definitions);
                    this.ports[child.$name] = {
                        location: child.location,
                        binding: binding
                    };
                    children.splice(i--, 1);
                }
            }
        }
        delete this.$name;
        this.deleteFixedAttrs();
    };
    ServiceElement.prototype.description = function (definitions, xmlns) {
        if (definitions === void 0) { definitions = {}; }
        var ports = {};
        for (var name in this.ports) {
            var port = this.ports[name];
            ports[name] = port.binding.description(definitions);
        }
        return ports;
    };
    return ServiceElement;
}(Element));
var DefinitionsElement = (function (_super) {
    __extends(DefinitionsElement, _super);
    function DefinitionsElement(nsName, attrs, options) {
        if (attrs === void 0) { attrs = {}; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, nsName, attrs, options) || this;
        _this.init();
        return _this;
    }
    DefinitionsElement.prototype.init = function () {
        if (this.name !== 'definitions')
            this.unexpected(this.nsName);
        this.messages = {};
        this.portTypes = {};
        this.bindings = {};
        this.services = {};
        this.schemas = {};
    };
    DefinitionsElement.prototype.addChild = function (child) {
        if (child instanceof TypesElement) {
            // Merge types.schemas into definitions.schemas
            _.merge(this.schemas, child.schemas);
        }
        else if (child instanceof MessageElement) {
            this.messages[child.$name] = child;
        }
        else if (child.name === 'import') {
            this.schemas[child.$namespace] = new SchemaElement(child.$namespace, {});
            this.schemas[child.$namespace].addChild(child);
        }
        else if (child instanceof PortTypeElement) {
            this.portTypes[child.$name] = child;
        }
        else if (child instanceof BindingElement) {
            if (child.transport === 'http://schemas.xmlsoap.org/soap/http' ||
                child.transport === 'http://www.w3.org/2003/05/soap/bindings/HTTP/')
                this.bindings[child.$name] = child;
        }
        else if (child instanceof ServiceElement) {
            this.services[child.$name] = child;
        }
        else if (child instanceof DocumentationElement) {
        }
        this.children.pop();
    };
    return DefinitionsElement;
}(Element));
var DocumentationElement = (function (_super) {
    __extends(DocumentationElement, _super);
    function DocumentationElement(nsName, attrs, options) {
        if (attrs === void 0) { attrs = {}; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, nsName, attrs, options) || this;
        _this.init();
        return _this;
    }
    return DocumentationElement;
}(Element));
var ElementTypeMap = {
    types: [TypesElement, 'schema documentation'],
    schema: [SchemaElement, 'element complexType simpleType include import'],
    element: [ElementElement, 'annotation complexType'],
    any: [AnyElement, ''],
    simpleType: [SimpleTypeElement, 'restriction'],
    restriction: [RestrictionElement, 'enumeration all choice sequence'],
    extension: [ExtensionElement, 'all sequence choice'],
    choice: [ChoiceElement, 'element sequence choice any'],
    // group: [GroupElement, 'element group'],
    enumeration: [EnumerationElement, ''],
    complexType: [ComplexTypeElement, 'annotation sequence all complexContent simpleContent choice'],
    complexContent: [ComplexContentElement, 'extension'],
    simpleContent: [SimpleContentElement, 'extension'],
    sequence: [SequenceElement, 'element sequence choice any'],
    all: [AllElement, 'element choice'],
    service: [ServiceElement, 'port documentation'],
    port: [PortElement, 'address documentation'],
    binding: [BindingElement, '_binding SecuritySpec operation documentation'],
    portType: [PortTypeElement, 'operation documentation'],
    message: [MessageElement, 'part documentation'],
    operation: [OperationElement, 'documentation input output fault _operation'],
    input: [InputElement, 'body SecuritySpecRef documentation header'],
    output: [OutputElement, 'body SecuritySpecRef documentation header'],
    fault: [Element, '_fault documentation'],
    definitions: [DefinitionsElement, 'types message portType binding service import documentation'],
    documentation: [DocumentationElement, '']
};

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

function createSoapClient(wsdlDef, options) {
    if (options === void 0) { options = {}; }
    return openWsdl(wsdlDef, options)
        .then(function (wsdl) {
        return new Client(wsdl);
    })
        .catch(function (err) { throw new Error(err); });
}

exports.SOAPService = (function () {
    function SOAPService() {
    }
    SOAPService.prototype.createClient = function (wsdlDef, options) {
        if (options === void 0) { options = {}; }
        return createSoapClient(wsdlDef, options);
    };
    return SOAPService;
}());
exports.SOAPService = __decorate([
    _angular_core.Injectable(),
    __metadata("design:paramtypes", [])
], exports.SOAPService);

exports.NgxSoapModule = (function () {
    function NgxSoapModule() {
    }
    return NgxSoapModule;
}());
exports.NgxSoapModule = __decorate([
    _angular_core.NgModule({
        imports: [_angular_http.HttpModule],
        providers: [exports.SOAPService]
    })
], exports.NgxSoapModule);

var BasicAuthSecurity = (function () {
    function BasicAuthSecurity(username, password, defaults) {
        this._username = username;
        this._password = password;
        this.defaults = {};
        _.merge(this.defaults, defaults);
    }
    BasicAuthSecurity.prototype.addHeaders = function (headers) {
        headers['Authorization'] = 'Basic ' + btoa(this._username + ':' + this._password);
        return headers;
    };
    BasicAuthSecurity.prototype.toXML = function () {
        return '';
    };
    BasicAuthSecurity.prototype.addOptions = function (options) {
        _.merge(options, this.defaults);
    };
    return BasicAuthSecurity;
}());

exports.Client = Client;
exports.BasicAuthSecurity = BasicAuthSecurity;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngxsoap.umd.js.map
