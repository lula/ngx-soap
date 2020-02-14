import { Injectable, ɵɵdefineInjectable, ɵɵinject, NgModule } from '@angular/core';
import { __awaiter } from 'tslib';
import { parser, createStream } from 'sax';
import { resolve } from 'url';
import { ok } from 'assert';
import { mergeWith, isArray, defaultsDeep, merge, assign, isPlainObject, isObject } from 'lodash';
import sha1 from 'crypto-js/sha1';
import Base64 from 'crypto-js/enc-base64';
import { Buffer } from 'buffer';
import uuid4 from 'uuid/v4';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpClientModule } from '@angular/common/http';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
'use strict';
class NamespaceScope {
    /**
     * @param {?} parent
     */
    constructor(parent) {
        this.getNamespaceURI = (/**
         * @param {?} prefix
         * @param {?} localOnly
         * @return {?}
         */
        function (prefix, localOnly) {
            switch (prefix) {
                case 'xml':
                    return 'http://www.w3.org/XML/1998/namespace';
                case 'xmlns':
                    return 'http://www.w3.org/2000/xmlns/';
                default:
                    /** @type {?} */
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
        });
        this.getNamespaceMapping = (/**
         * @param {?} prefix
         * @return {?}
         */
        function (prefix) {
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
                    /** @type {?} */
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
        });
        this.getPrefix = (/**
         * @param {?} nsUri
         * @param {?} localOnly
         * @return {?}
         */
        function (nsUri, localOnly) {
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
        });
        if (!(this instanceof NamespaceScope)) {
            return new NamespaceScope(parent);
        }
        this.parent = parent;
        this.namespaces = {};
    }
}
if (false) {
    /** @type {?} */
    NamespaceScope.prototype.parent;
    /** @type {?} */
    NamespaceScope.prototype.namespaces;
    /** @type {?} */
    NamespaceScope.prototype.getNamespaceURI;
    /** @type {?} */
    NamespaceScope.prototype.getNamespaceMapping;
    /** @type {?} */
    NamespaceScope.prototype.getPrefix;
}
class NamespaceContext {
    constructor() {
        this.addNamespace = (/**
         * @param {?} prefix
         * @param {?} nsUri
         * @param {?} localOnly
         * @return {?}
         */
        function (prefix, nsUri, localOnly) {
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
        });
        this.pushContext = (/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var scope = new NamespaceScope(this.currentScope);
            this.scopes.push(scope);
            this.currentScope = scope;
            return scope;
        });
        this.popContext = (/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var scope = this.scopes.pop();
            if (scope) {
                this.currentScope = scope.parent;
            }
            else {
                this.currentScope = null;
            }
            return scope;
        });
        this.getNamespaceURI = (/**
         * @param {?} prefix
         * @param {?} localOnly
         * @return {?}
         */
        function (prefix, localOnly) {
            return this.currentScope && this.currentScope.getNamespaceURI(prefix, localOnly);
        });
        this.getPrefix = (/**
         * @param {?} nsUri
         * @param {?} localOnly
         * @return {?}
         */
        function (nsUri, localOnly) {
            return this.currentScope && this.currentScope.getPrefix(nsUri, localOnly);
        });
        this.registerNamespace = (/**
         * @param {?} nsUri
         * @return {?}
         */
        function (nsUri) {
            /** @type {?} */
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
        });
        this.declareNamespace = (/**
         * @param {?} prefix
         * @param {?} nsUri
         * @return {?}
         */
        function (prefix, nsUri) {
            if (this.currentScope) {
                /** @type {?} */
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
        });
        if (!(this instanceof NamespaceContext)) {
            return new NamespaceContext();
        }
        this.scopes = [];
        this.pushContext();
        this.prefixCount = 0;
    }
}
if (false) {
    /** @type {?} */
    NamespaceContext.prototype.scopes;
    /** @type {?} */
    NamespaceContext.prototype.prefixCount;
    /** @type {?} */
    NamespaceContext.prototype.addNamespace;
    /** @type {?} */
    NamespaceContext.prototype.pushContext;
    /** @type {?} */
    NamespaceContext.prototype.popContext;
    /** @type {?} */
    NamespaceContext.prototype.getNamespaceURI;
    /** @type {?} */
    NamespaceContext.prototype.getPrefix;
    /** @type {?} */
    NamespaceContext.prototype.registerNamespace;
    /** @type {?} */
    NamespaceContext.prototype.declareNamespace;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const passwordDigest = (/**
 * @param {?} nonce
 * @param {?} created
 * @param {?} password
 * @return {?}
 */
function passwordDigest(nonce, created, password) {
    /** @type {?} */
    const rawNonce = new Buffer(nonce || '', 'base64').toString('binary');
    return Base64.stringify(sha1(rawNonce + created + password, ''));
});
/** @type {?} */
const TNS_PREFIX = '__tns__';
// Prefix for targetNamespace
/**
 * Find a key from an object based on the value
 * \@param Namespace prefix/uri mapping
 * \@param nsURI value
 * \@return The matching key
 * @type {?}
 */
const findPrefix = (/**
 * @param {?} xmlnsMapping
 * @param {?} nsURI
 * @return {?}
 */
function (xmlnsMapping, nsURI) {
    for (const n in xmlnsMapping) {
        if (n === TNS_PREFIX) {
            continue;
        }
        if (xmlnsMapping[n] === nsURI) {
            return n;
        }
    }
});

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/*
 * Copyright (c) 2011 Vinay Pulim <vinay@milewise.com>
 * MIT Licensed
 *
 */
/*jshint proto:true*/
"use strict";
// import stripBom from 'strip-bom';
/** @type {?} */
const stripBom = (/**
 * @param {?} x
 * @return {?}
 */
(x) => {
    // Catches EFBBBF (UTF-8 BOM) because the buffer-to-string
    // conversion translates it to FEFF (UTF-16 BOM)
    if (x.charCodeAt(0) === 0xFEFF) {
        return x.slice(1);
    }
    return x;
});
const ɵ0 = stripBom;
/** @type {?} */
let TNS_PREFIX$1 = TNS_PREFIX;
/** @type {?} */
let findPrefix$1 = findPrefix;
/** @type {?} */
let Primitives = {
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
/**
 * @param {?} nsName
 * @return {?}
 */
function splitQName(nsName) {
    /** @type {?} */
    let i = typeof nsName === 'string' ? nsName.indexOf(':') : -1;
    return i < 0 ? { prefix: TNS_PREFIX$1, name: nsName } :
        { prefix: nsName.substring(0, i), name: nsName.substring(i + 1) };
}
/**
 * @param {?} obj
 * @return {?}
 */
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
/** @type {?} */
let trimLeft = /^[\s\xA0]+/;
/** @type {?} */
let trimRight = /[\s\xA0]+$/;
/**
 * @param {?} text
 * @return {?}
 */
function trim(text) {
    return text.replace(trimLeft, '').replace(trimRight, '');
}
/**
 * @param {?} destination
 * @param {?} source
 * @return {?}
 */
function deepMerge(destination, source) {
    return mergeWith(destination || {}, source, (/**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    function (a, b) {
        return isArray(a) ? a.concat(b) : undefined;
    }));
}
/** @type {?} */
let Element = (/**
 * @param {?} nsName
 * @param {?} attrs
 * @param {?} options
 * @return {?}
 */
function (nsName, attrs, options) {
    /** @type {?} */
    let parts = splitQName(nsName);
    this.nsName = nsName;
    this.prefix = parts.prefix;
    this.name = parts.name;
    this.children = [];
    this.xmlns = {};
    this._initializeOptions(options);
    for (let key in attrs) {
        /** @type {?} */
        let match = /^xmlns:?(.*)$/.exec(key);
        if (match) {
            this.xmlns[match[1] ? match[1] : TNS_PREFIX$1] = attrs[key];
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
        this.xmlns[TNS_PREFIX$1] = this.$targetNamespace;
    }
});
const ɵ1 = Element;
Element.prototype._initializeOptions = (/**
 * @param {?} options
 * @return {?}
 */
function (options) {
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
});
Element.prototype.deleteFixedAttrs = (/**
 * @return {?}
 */
function () {
    this.children && this.children.length === 0 && delete this.children;
    this.xmlns && Object.keys(this.xmlns).length === 0 && delete this.xmlns;
    delete this.nsName;
    delete this.prefix;
    delete this.name;
});
Element.prototype.allowedChildren = [];
Element.prototype.startElement = (/**
 * @param {?} stack
 * @param {?} nsName
 * @param {?} attrs
 * @param {?} options
 * @return {?}
 */
function (stack, nsName, attrs, options) {
    if (!this.allowedChildren) {
        return;
    }
    /** @type {?} */
    let ChildClass = this.allowedChildren[splitQName(nsName).name];
    /** @type {?} */
    let element = null;
    if (ChildClass) {
        stack.push(new ChildClass(nsName, attrs, options));
    }
    else {
        this.unexpected(nsName);
    }
});
Element.prototype.endElement = (/**
 * @param {?} stack
 * @param {?} nsName
 * @return {?}
 */
function (stack, nsName) {
    if (this.nsName === nsName) {
        if (stack.length < 2)
            return;
        /** @type {?} */
        let parent = stack[stack.length - 2];
        if (this !== stack[0]) {
            defaultsDeep(stack[0].xmlns, this.xmlns);
            // delete this.xmlns;
            parent.children.push(this);
            parent.addChild(this);
        }
        stack.pop();
    }
});
Element.prototype.addChild = (/**
 * @param {?} child
 * @return {?}
 */
function (child) {
    return;
});
Element.prototype.unexpected = (/**
 * @param {?} name
 * @return {?}
 */
function (name) {
    throw new Error('Found unexpected element (' + name + ') inside ' + this.nsName);
});
Element.prototype.description = (/**
 * @param {?} definitions
 * @return {?}
 */
function (definitions) {
    return this.$name || this.name;
});
Element.prototype.init = (/**
 * @return {?}
 */
function () {
});
Element.createSubClass = (/**
 * @return {?}
 */
function () {
    /** @type {?} */
    let root = this;
    /** @type {?} */
    let subElement = (/**
     * @return {?}
     */
    function () {
        root.apply(this, arguments);
        this.init();
    });
    // inherits(subElement, root);
    subElement.prototype.__proto__ = root.prototype;
    return subElement;
});
/** @type {?} */
let ElementElement = Element.createSubClass();
/** @type {?} */
let AnyElement = Element.createSubClass();
/** @type {?} */
let InputElement = Element.createSubClass();
/** @type {?} */
let OutputElement = Element.createSubClass();
/** @type {?} */
let SimpleTypeElement = Element.createSubClass();
/** @type {?} */
let RestrictionElement = Element.createSubClass();
/** @type {?} */
let ExtensionElement = Element.createSubClass();
/** @type {?} */
let ChoiceElement = Element.createSubClass();
/** @type {?} */
let EnumerationElement = Element.createSubClass();
/** @type {?} */
let ComplexTypeElement = Element.createSubClass();
/** @type {?} */
let ComplexContentElement = Element.createSubClass();
/** @type {?} */
let SimpleContentElement = Element.createSubClass();
/** @type {?} */
let SequenceElement = Element.createSubClass();
/** @type {?} */
let AllElement = Element.createSubClass();
/** @type {?} */
let MessageElement = Element.createSubClass();
/** @type {?} */
let DocumentationElement = Element.createSubClass();
/** @type {?} */
let SchemaElement = Element.createSubClass();
/** @type {?} */
let TypesElement = Element.createSubClass();
/** @type {?} */
let OperationElement = Element.createSubClass();
/** @type {?} */
let PortTypeElement = Element.createSubClass();
/** @type {?} */
let BindingElement = Element.createSubClass();
/** @type {?} */
let PortElement = Element.createSubClass();
/** @type {?} */
let ServiceElement = Element.createSubClass();
/** @type {?} */
let DefinitionsElement = Element.createSubClass();
/** @type {?} */
let ElementTypeMap = {
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
/**
 * @param {?} types
 * @return {?}
 */
function mapElementTypes(types) {
    /** @type {?} */
    let rtn = {};
    types = types.split(' ');
    types.forEach((/**
     * @param {?} type
     * @return {?}
     */
    function (type) {
        rtn[type.replace(/^_/, '')] = (ElementTypeMap[type] || [Element])[0];
    }));
    return rtn;
}
for (let n in ElementTypeMap) {
    /** @type {?} */
    let v = ElementTypeMap[n];
    v[0].prototype.allowedChildren = mapElementTypes(v[1]);
}
MessageElement.prototype.init = (/**
 * @return {?}
 */
function () {
    this.element = null;
    this.parts = null;
});
SchemaElement.prototype.init = (/**
 * @return {?}
 */
function () {
    this.complexTypes = {};
    this.types = {};
    this.elements = {};
    this.includes = [];
});
TypesElement.prototype.init = (/**
 * @return {?}
 */
function () {
    this.schemas = {};
});
OperationElement.prototype.init = (/**
 * @return {?}
 */
function () {
    this.input = null;
    this.output = null;
    this.inputSoap = null;
    this.outputSoap = null;
    this.style = '';
    this.soapAction = '';
});
PortTypeElement.prototype.init = (/**
 * @return {?}
 */
function () {
    this.methods = {};
});
BindingElement.prototype.init = (/**
 * @return {?}
 */
function () {
    this.transport = '';
    this.style = '';
    this.methods = {};
});
PortElement.prototype.init = (/**
 * @return {?}
 */
function () {
    this.location = null;
});
ServiceElement.prototype.init = (/**
 * @return {?}
 */
function () {
    this.ports = {};
});
DefinitionsElement.prototype.init = (/**
 * @return {?}
 */
function () {
    if (this.name !== 'definitions')
        this.unexpected(this.nsName);
    this.messages = {};
    this.portTypes = {};
    this.bindings = {};
    this.services = {};
    this.schemas = {};
});
DocumentationElement.prototype.init = (/**
 * @return {?}
 */
function () {
});
SchemaElement.prototype.merge = (/**
 * @param {?} source
 * @return {?}
 */
function (source) {
    ok(source instanceof SchemaElement);
    if (this.$targetNamespace === source.$targetNamespace) {
        merge(this.complexTypes, source.complexTypes);
        merge(this.types, source.types);
        merge(this.elements, source.elements);
        merge(this.xmlns, source.xmlns);
    }
    return this;
});
SchemaElement.prototype.addChild = (/**
 * @param {?} child
 * @return {?}
 */
function (child) {
    if (child.$name in Primitives)
        return;
    if (child.name === 'include' || child.name === 'import') {
        /** @type {?} */
        let location = child.$schemaLocation || child.$location;
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
    // child.deleteFixedAttrs();
});
//fix#325
TypesElement.prototype.addChild = (/**
 * @param {?} child
 * @return {?}
 */
function (child) {
    ok(child instanceof SchemaElement);
    /** @type {?} */
    let targetNamespace = child.$targetNamespace;
    if (!this.schemas.hasOwnProperty(targetNamespace)) {
        this.schemas[targetNamespace] = child;
    }
    else {
        console.error('Target-Namespace "' + targetNamespace + '" already in use by another Schema!');
    }
});
InputElement.prototype.addChild = (/**
 * @param {?} child
 * @return {?}
 */
function (child) {
    if (child.name === 'body') {
        this.use = child.$use;
        if (this.use === 'encoded') {
            this.encodingStyle = child.$encodingStyle;
        }
        this.children.pop();
    }
});
OutputElement.prototype.addChild = (/**
 * @param {?} child
 * @return {?}
 */
function (child) {
    if (child.name === 'body') {
        this.use = child.$use;
        if (this.use === 'encoded') {
            this.encodingStyle = child.$encodingStyle;
        }
        this.children.pop();
    }
});
OperationElement.prototype.addChild = (/**
 * @param {?} child
 * @return {?}
 */
function (child) {
    if (child.name === 'operation') {
        this.soapAction = child.$soapAction || '';
        this.style = child.$style || '';
        this.children.pop();
    }
});
BindingElement.prototype.addChild = (/**
 * @param {?} child
 * @return {?}
 */
function (child) {
    if (child.name === 'binding') {
        this.transport = child.$transport;
        this.style = child.$style;
        this.children.pop();
    }
});
PortElement.prototype.addChild = (/**
 * @param {?} child
 * @return {?}
 */
function (child) {
    if (child.name === 'address' && typeof (child.$location) !== 'undefined') {
        this.location = child.$location;
    }
});
DefinitionsElement.prototype.addChild = (/**
 * @param {?} child
 * @return {?}
 */
function (child) {
    /** @type {?} */
    let self = this;
    if (child instanceof TypesElement) {
        // Merge types.schemas into definitions.schemas
        merge(self.schemas, child.schemas);
    }
    else if (child instanceof MessageElement) {
        self.messages[child.$name] = child;
    }
    else if (child.name === 'import') {
        self.schemas[child.$namespace] = new SchemaElement(child.$namespace, {});
        self.schemas[child.$namespace].addChild(child);
    }
    else if (child instanceof PortTypeElement) {
        self.portTypes[child.$name] = child;
    }
    else if (child instanceof BindingElement) {
        if (child.transport === 'http://schemas.xmlsoap.org/soap/http' ||
            child.transport === 'http://www.w3.org/2003/05/soap/bindings/HTTP/')
            self.bindings[child.$name] = child;
    }
    else if (child instanceof ServiceElement) {
        self.services[child.$name] = child;
    }
    else if (child instanceof DocumentationElement) {
    }
    this.children.pop();
});
MessageElement.prototype.postProcess = (/**
 * @param {?} definitions
 * @return {?}
 */
function (definitions) {
    /** @type {?} */
    let part = null;
    /** @type {?} */
    let child = undefined;
    /** @type {?} */
    let children = this.children || [];
    /** @type {?} */
    let ns = undefined;
    /** @type {?} */
    let nsName = undefined;
    /** @type {?} */
    let i = undefined;
    /** @type {?} */
    let type = undefined;
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
        /** @type {?} */
        let lookupTypes = [];
        /** @type {?} */
        let elementChildren;
        delete this.parts;
        nsName = splitQName(part.$element);
        ns = nsName.prefix;
        /** @type {?} */
        let schema = definitions.schemas[definitions.xmlns[ns]];
        this.element = schema.elements[nsName.name];
        if (!this.element) {
            // debug(nsName.name + " is not present in wsdl and cannot be processed correctly.");
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
                filter((/**
             * @param {?} type
             * @return {?}
             */
            function removeEmptyLookupTypes(type) {
                return type !== '^';
            }));
            /** @type {?} */
            let schemaXmlns = definitions.schemas[this.element.targetNamespace].xmlns;
            for (i = 0; i < lookupTypes.length; i++) {
                lookupTypes[i] = this._createLookupTypeObject(lookupTypes[i], schemaXmlns);
            }
        }
        this.element.$lookupTypes = lookupTypes;
        if (this.element.$type) {
            type = splitQName(this.element.$type);
            /** @type {?} */
            let typeNs = schema.xmlns && schema.xmlns[type.prefix] || definitions.xmlns[type.prefix];
            if (typeNs) {
                if (type.name in Primitives) {
                    // this.element = this.element.$type;
                }
                else {
                    // first check local mapping of ns alias to namespace
                    schema = definitions.schemas[typeNs];
                    /** @type {?} */
                    let ctype = schema.complexTypes[type.name] || schema.types[type.name] || schema.elements[type.name];
                    if (ctype) {
                        this.parts = ctype.description(definitions, schema.xmlns);
                    }
                }
            }
        }
        else {
            /** @type {?} */
            let method = this.element.description(definitions, schema.xmlns);
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
            ok(part.name === 'part', 'Expected part element');
            nsName = splitQName(part.$type);
            ns = definitions.xmlns[nsName.prefix];
            type = nsName.name;
            /** @type {?} */
            let schemaDefinition = definitions.schemas[ns];
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
});
/**
 * Takes a given namespaced String(for example: 'alias:property') and creates a lookupType
 * object for further use in as first (lookup) `parameterTypeObj` within the `objectToXML`
 * method and provides an entry point for the already existing code in `findChildSchemaObject`.
 *
 * @method _createLookupTypeObject
 * @param {String}            nsString          The NS String (for example "alias:type").
 * @param {Object}            xmlns       The fully parsed `wsdl` definitions object (including all schemas).
 * @returns {Object}
 * @private
 */
MessageElement.prototype._createLookupTypeObject = (/**
 * @param {?} nsString
 * @param {?} xmlns
 * @return {?}
 */
function (nsString, xmlns) {
    /** @type {?} */
    let splittedNSString = splitQName(nsString);
    /** @type {?} */
    let nsAlias = splittedNSString.prefix;
    /** @type {?} */
    let splittedName = splittedNSString.name.split('#');
    /** @type {?} */
    let type = splittedName[0];
    /** @type {?} */
    let name = splittedName[1];
    /** @type {?} */
    let lookupTypeObj = {};
    lookupTypeObj.$namespace = xmlns[nsAlias];
    lookupTypeObj.$type = nsAlias + ':' + type;
    lookupTypeObj.$name = name;
    return lookupTypeObj;
});
/**
 * Iterates through the element and every nested child to find any defined `$type`
 * property and returns it in a underscore ('_') separated String (using '^' as default
 * value if no `$type` property was found).
 *
 * @method _getNestedLookupTypeString
 * @param {Object}            element         The element which (probably) contains nested `$type` values.
 * @returns {String}
 * @private
 */
MessageElement.prototype._getNestedLookupTypeString = (/**
 * @param {?} element
 * @return {?}
 */
function (element) {
    /** @type {?} */
    let resolvedType = '^';
    /** @type {?} */
    let excluded = this.ignoredNamespaces.concat('xs');
    if (element.hasOwnProperty('$type') && typeof element.$type === 'string') {
        if (excluded.indexOf(element.$type.split(':')[0]) === -1) {
            resolvedType += ('_' + element.$type + '#' + element.$name);
        }
    }
    if (element.children.length > 0) {
        /** @type {?} */
        let self = this;
        element.children.forEach((/**
         * @param {?} child
         * @return {?}
         */
        function (child) {
            /** @type {?} */
            let resolvedChildType = self._getNestedLookupTypeString(child).replace(/\^_/, '');
            if (resolvedChildType && typeof resolvedChildType === 'string') {
                resolvedType += ('_' + resolvedChildType);
            }
        }));
    }
    return resolvedType;
});
OperationElement.prototype.postProcess = (/**
 * @param {?} definitions
 * @param {?} tag
 * @return {?}
 */
function (definitions, tag) {
    /** @type {?} */
    let children = this.children;
    for (let i = 0, child; child = children[i]; i++) {
        if (child.name !== 'input' && child.name !== 'output')
            continue;
        if (tag === 'binding') {
            this[child.name] = child;
            children.splice(i--, 1);
            continue;
        }
        /** @type {?} */
        let messageName = splitQName(child.$message).name;
        /** @type {?} */
        let message = definitions.messages[messageName];
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
});
PortTypeElement.prototype.postProcess = (/**
 * @param {?} definitions
 * @return {?}
 */
function (definitions) {
    /** @type {?} */
    let children = this.children;
    if (typeof children === 'undefined')
        return;
    for (let i = 0, child; child = children[i]; i++) {
        if (child.name !== 'operation')
            continue;
        child.postProcess(definitions, 'portType');
        this.methods[child.$name] = child;
        children.splice(i--, 1);
    }
    delete this.$name;
    this.deleteFixedAttrs();
});
BindingElement.prototype.postProcess = (/**
 * @param {?} definitions
 * @return {?}
 */
function (definitions) {
    /** @type {?} */
    let type = splitQName(this.$type).name;
    /** @type {?} */
    let portType = definitions.portTypes[type];
    /** @type {?} */
    let style = this.style;
    /** @type {?} */
    let children = this.children;
    if (portType) {
        portType.postProcess(definitions);
        this.methods = portType.methods;
        for (let i = 0, child; child = children[i]; i++) {
            if (child.name !== 'operation')
                continue;
            child.postProcess(definitions, 'binding');
            children.splice(i--, 1);
            child.style || (child.style = style);
            /** @type {?} */
            let method = this.methods[child.$name];
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
});
ServiceElement.prototype.postProcess = (/**
 * @param {?} definitions
 * @return {?}
 */
function (definitions) {
    /** @type {?} */
    let children = this.children;
    /** @type {?} */
    let bindings = definitions.bindings;
    if (children && children.length > 0) {
        for (let i = 0, child; child = children[i]; i++) {
            if (child.name !== 'port')
                continue;
            /** @type {?} */
            let bindingName = splitQName(child.$binding).name;
            /** @type {?} */
            let binding = bindings[bindingName];
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
});
SimpleTypeElement.prototype.description = (/**
 * @param {?} definitions
 * @return {?}
 */
function (definitions) {
    /** @type {?} */
    let children = this.children;
    for (let i = 0, child; child = children[i]; i++) {
        if (child instanceof RestrictionElement)
            return this.$name + "|" + child.description();
    }
    return {};
});
RestrictionElement.prototype.description = (/**
 * @param {?} definitions
 * @param {?} xmlns
 * @return {?}
 */
function (definitions, xmlns) {
    /** @type {?} */
    let children = this.children;
    /** @type {?} */
    let desc;
    for (let i = 0, child; child = children[i]; i++) {
        if (child instanceof SequenceElement ||
            child instanceof ChoiceElement) {
            desc = child.description(definitions, xmlns);
            break;
        }
    }
    if (desc && this.$base) {
        /** @type {?} */
        let type = splitQName(this.$base);
        /** @type {?} */
        let typeName = type.name;
        /** @type {?} */
        let ns = xmlns && xmlns[type.prefix] || definitions.xmlns[type.prefix];
        /** @type {?} */
        let schema = definitions.schemas[ns];
        /** @type {?} */
        let typeElement = schema && (schema.complexTypes[typeName] || schema.types[typeName] || schema.elements[typeName]);
        desc.getBase = (/**
         * @return {?}
         */
        function () {
            return typeElement.description(definitions, schema.xmlns);
        });
        return desc;
    }
    // then simple element
    /** @type {?} */
    let base = this.$base ? this.$base + "|" : "";
    return base + this.children.map((/**
     * @param {?} child
     * @return {?}
     */
    function (child) {
        return child.description();
    })).join(",");
});
ExtensionElement.prototype.description = (/**
 * @param {?} definitions
 * @param {?} xmlns
 * @return {?}
 */
function (definitions, xmlns) {
    /** @type {?} */
    let children = this.children;
    /** @type {?} */
    let desc = {};
    for (let i = 0, child; child = children[i]; i++) {
        if (child instanceof SequenceElement ||
            child instanceof ChoiceElement) {
            desc = child.description(definitions, xmlns);
        }
    }
    if (this.$base) {
        /** @type {?} */
        let type = splitQName(this.$base);
        /** @type {?} */
        let typeName = type.name;
        /** @type {?} */
        let ns = xmlns && xmlns[type.prefix] || definitions.xmlns[type.prefix];
        /** @type {?} */
        let schema = definitions.schemas[ns];
        if (typeName in Primitives) {
            return this.$base;
        }
        else {
            /** @type {?} */
            let typeElement = schema && (schema.complexTypes[typeName] ||
                schema.types[typeName] || schema.elements[typeName]);
            if (typeElement) {
                /** @type {?} */
                let base = typeElement.description(definitions, schema.xmlns);
                desc = defaultsDeep(base, desc);
            }
        }
    }
    return desc;
});
EnumerationElement.prototype.description = (/**
 * @return {?}
 */
function () {
    return this[this.valueKey];
});
ComplexTypeElement.prototype.description = (/**
 * @param {?} definitions
 * @param {?} xmlns
 * @return {?}
 */
function (definitions, xmlns) {
    /** @type {?} */
    let children = this.children || [];
    for (let i = 0, child; child = children[i]; i++) {
        if (child instanceof ChoiceElement ||
            child instanceof SequenceElement ||
            child instanceof AllElement ||
            child instanceof SimpleContentElement ||
            child instanceof ComplexContentElement) {
            return child.description(definitions, xmlns);
        }
    }
    return {};
});
ComplexContentElement.prototype.description = (/**
 * @param {?} definitions
 * @param {?} xmlns
 * @return {?}
 */
function (definitions, xmlns) {
    /** @type {?} */
    let children = this.children;
    for (let i = 0, child; child = children[i]; i++) {
        if (child instanceof ExtensionElement) {
            return child.description(definitions, xmlns);
        }
    }
    return {};
});
SimpleContentElement.prototype.description = (/**
 * @param {?} definitions
 * @param {?} xmlns
 * @return {?}
 */
function (definitions, xmlns) {
    /** @type {?} */
    let children = this.children;
    for (let i = 0, child; child = children[i]; i++) {
        if (child instanceof ExtensionElement) {
            return child.description(definitions, xmlns);
        }
    }
    return {};
});
ElementElement.prototype.description = (/**
 * @param {?} definitions
 * @param {?} xmlns
 * @return {?}
 */
function (definitions, xmlns) {
    /** @type {?} */
    let element = {};
    /** @type {?} */
    let name = this.$name;
    /** @type {?} */
    let isMany = !this.$maxOccurs ? false : (isNaN(this.$maxOccurs) ? (this.$maxOccurs === 'unbounded') : (this.$maxOccurs > 1));
    if (this.$minOccurs !== this.$maxOccurs && isMany) {
        name += '[]';
    }
    if (xmlns && xmlns[TNS_PREFIX$1]) {
        this.$targetNamespace = xmlns[TNS_PREFIX$1];
    }
    /** @type {?} */
    let type = this.$type || this.$ref;
    if (type) {
        type = splitQName(type);
        /** @type {?} */
        let typeName = type.name;
        /** @type {?} */
        let ns = xmlns && xmlns[type.prefix] || definitions.xmlns[type.prefix];
        /** @type {?} */
        let schema = definitions.schemas[ns];
        /** @type {?} */
        let typeElement = schema && (this.$type ? schema.complexTypes[typeName] || schema.types[typeName] : schema.elements[typeName]);
        if (ns && definitions.schemas[ns]) {
            xmlns = definitions.schemas[ns].xmlns;
        }
        if (typeElement && !(typeName in Primitives)) {
            if (!(typeName in definitions.descriptions.types)) {
                /** @type {?} */
                let elem = {};
                definitions.descriptions.types[typeName] = elem;
                /** @type {?} */
                let description = typeElement.description(definitions, xmlns);
                if (typeof description === 'string') {
                    elem = description;
                }
                else {
                    Object.keys(description).forEach((/**
                     * @param {?} key
                     * @return {?}
                     */
                    function (key) {
                        elem[key] = description[key];
                    }));
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
        /** @type {?} */
        let children = this.children;
        element[name] = {};
        for (let i = 0, child; child = children[i]; i++) {
            if (child instanceof ComplexTypeElement) {
                element[name] = child.description(definitions, xmlns);
            }
        }
    }
    return element;
});
AllElement.prototype.description =
    SequenceElement.prototype.description = (/**
     * @param {?} definitions
     * @param {?} xmlns
     * @return {?}
     */
    function (definitions, xmlns) {
        /** @type {?} */
        let children = this.children;
        /** @type {?} */
        let sequence = {};
        for (let i = 0, child; child = children[i]; i++) {
            if (child instanceof AnyElement) {
                continue;
            }
            /** @type {?} */
            let description = child.description(definitions, xmlns);
            for (let key in description) {
                sequence[key] = description[key];
            }
        }
        return sequence;
    });
ChoiceElement.prototype.description = (/**
 * @param {?} definitions
 * @param {?} xmlns
 * @return {?}
 */
function (definitions, xmlns) {
    /** @type {?} */
    let children = this.children;
    /** @type {?} */
    let choice = {};
    for (let i = 0, child; child = children[i]; i++) {
        /** @type {?} */
        let description = child.description(definitions, xmlns);
        for (let key in description) {
            choice[key] = description[key];
        }
    }
    return choice;
});
MessageElement.prototype.description = (/**
 * @param {?} definitions
 * @return {?}
 */
function (definitions) {
    if (this.element) {
        return this.element && this.element.description(definitions);
    }
    /** @type {?} */
    let desc = {};
    desc[this.$name] = this.parts;
    return desc;
});
PortTypeElement.prototype.description = (/**
 * @param {?} definitions
 * @return {?}
 */
function (definitions) {
    /** @type {?} */
    let methods = {};
    for (let name in this.methods) {
        /** @type {?} */
        let method = this.methods[name];
        methods[name] = method.description(definitions);
    }
    return methods;
});
OperationElement.prototype.description = (/**
 * @param {?} definitions
 * @return {?}
 */
function (definitions) {
    /** @type {?} */
    let inputDesc = this.input ? this.input.description(definitions) : null;
    /** @type {?} */
    let outputDesc = this.output ? this.output.description(definitions) : null;
    return {
        input: inputDesc && inputDesc[Object.keys(inputDesc)[0]],
        output: outputDesc && outputDesc[Object.keys(outputDesc)[0]]
    };
});
BindingElement.prototype.description = (/**
 * @param {?} definitions
 * @return {?}
 */
function (definitions) {
    /** @type {?} */
    let methods = {};
    for (let name in this.methods) {
        /** @type {?} */
        let method = this.methods[name];
        methods[name] = method.description(definitions);
    }
    return methods;
});
ServiceElement.prototype.description = (/**
 * @param {?} definitions
 * @return {?}
 */
function (definitions) {
    /** @type {?} */
    let ports = {};
    for (let name in this.ports) {
        /** @type {?} */
        let port = this.ports[name];
        ports[name] = port.binding.description(definitions);
    }
    return ports;
});
/** @type {?} */
let WSDL = (/**
 * @param {?} definition
 * @param {?} uri
 * @param {?} options
 * @return {?}
 */
function (definition, uri, options) {
    /** @type {?} */
    let self = this;
    /** @type {?} */
    let fromFunc;
    this.uri = uri;
    this.callback = (/**
     * @return {?}
     */
    function () {
    });
    this._includesWsdl = [];
    // initialize WSDL cache
    this.WSDL_CACHE = (options || {}).WSDL_CACHE || {};
    this._initializeOptions(options);
    if (typeof definition === 'string') {
        definition = stripBom(definition);
        fromFunc = this._fromXML;
    }
    else if (typeof definition === 'object') {
        fromFunc = this._fromServices;
    }
    else {
        throw new Error('WSDL letructor takes either an XML string or service definition');
    }
    Promise.resolve(true).then((/**
     * @return {?}
     */
    () => {
        try {
            fromFunc.call(self, definition);
        }
        catch (e) {
            return self.callback(e.message);
        }
        self.processIncludes().then((/**
         * @return {?}
         */
        () => {
            self.definitions.deleteFixedAttrs();
            /** @type {?} */
            let services = self.services = self.definitions.services;
            if (services) {
                for (const name in services) {
                    services[name].postProcess(self.definitions);
                }
            }
            /** @type {?} */
            let complexTypes = self.definitions.complexTypes;
            if (complexTypes) {
                for (const name in complexTypes) {
                    complexTypes[name].deleteFixedAttrs();
                }
            }
            // for document style, for every binding, prepare input message element name to (methodName, output message element name) mapping
            /** @type {?} */
            let bindings = self.definitions.bindings;
            for (let bindingName in bindings) {
                /** @type {?} */
                let binding = bindings[bindingName];
                if (typeof binding.style === 'undefined') {
                    binding.style = 'document';
                }
                if (binding.style !== 'document')
                    continue;
                /** @type {?} */
                let methods = binding.methods;
                /** @type {?} */
                let topEls = binding.topElements = {};
                for (let methodName in methods) {
                    if (methods[methodName].input) {
                        /** @type {?} */
                        let inputName = methods[methodName].input.$name;
                        /** @type {?} */
                        let outputName = "";
                        if (methods[methodName].output)
                            outputName = methods[methodName].output.$name;
                        topEls[inputName] = { "methodName": methodName, "outputName": outputName };
                    }
                }
            }
            // prepare soap envelope xmlns definition string
            self.xmlnsInEnvelope = self._xmlnsMap();
            self.callback(null, self);
        })).catch((/**
         * @param {?} err
         * @return {?}
         */
        err => self.callback(err)));
    }));
    // process.nextTick(function() {
    //   try {
    //     fromFunc.call(self, definition);
    //   } catch (e) {
    //     return self.callback(e.message);
    //   }
    //   self.processIncludes(function(err) {
    //     let name;
    //     if (err) {
    //       return self.callback(err);
    //     }
    //     self.definitions.deleteFixedAttrs();
    //     let services = self.services = self.definitions.services;
    //     if (services) {
    //       for (name in services) {
    //         services[name].postProcess(self.definitions);
    //       }
    //     }
    //     let complexTypes = self.definitions.complexTypes;
    //     if (complexTypes) {
    //       for (name in complexTypes) {
    //         complexTypes[name].deleteFixedAttrs();
    //       }
    //     }
    //     // for document style, for every binding, prepare input message element name to (methodName, output message element name) mapping
    //     let bindings = self.definitions.bindings;
    //     for (let bindingName in bindings) {
    //       let binding = bindings[bindingName];
    //       if (typeof binding.style === 'undefined') {
    //         binding.style = 'document';
    //       }
    //       if (binding.style !== 'document')
    //         continue;
    //       let methods = binding.methods;
    //       let topEls = binding.topElements = {};
    //       for (let methodName in methods) {
    //         if (methods[methodName].input) {
    //           let inputName = methods[methodName].input.$name;
    //           let outputName="";
    //           if(methods[methodName].output )
    //             outputName = methods[methodName].output.$name;
    //           topEls[inputName] = {"methodName": methodName, "outputName": outputName};
    //         }
    //       }
    //     }
    //     // prepare soap envelope xmlns definition string
    //     self.xmlnsInEnvelope = self._xmlnsMap();
    //     self.callback(err, self);
    //   });
    // });
});
WSDL.prototype.ignoredNamespaces = ['tns', 'targetNamespace', 'typedNamespace'];
WSDL.prototype.ignoreBaseNameSpaces = false;
WSDL.prototype.valueKey = '$value';
WSDL.prototype.xmlKey = '$xml';
WSDL.prototype._initializeOptions = (/**
 * @param {?} options
 * @return {?}
 */
function (options) {
    this._originalIgnoredNamespaces = (options || {}).ignoredNamespaces;
    this.options = {};
    /** @type {?} */
    let ignoredNamespaces = options ? options.ignoredNamespaces : null;
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
    if (options.returnFault !== undefined) {
        this.options.returnFault = options.returnFault;
    }
    else {
        this.options.returnFault = false;
    }
    this.options.handleNilAsNull = !!options.handleNilAsNull;
    if (options.namespaceArrayElements !== undefined) {
        this.options.namespaceArrayElements = options.namespaceArrayElements;
    }
    else {
        this.options.namespaceArrayElements = true;
    }
    // Allow any request headers to keep passing through
    this.options.wsdl_headers = options.wsdl_headers;
    this.options.wsdl_options = options.wsdl_options;
    if (options.httpClient) {
        this.options.httpClient = options.httpClient;
    }
    // The supplied request-object should be passed through
    if (options.request) {
        this.options.request = options.request;
    }
    /** @type {?} */
    let ignoreBaseNameSpaces = options ? options.ignoreBaseNameSpaces : null;
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
    this.options.useEmptyTag = !!options.useEmptyTag;
});
WSDL.prototype.onReady = (/**
 * @param {?} callback
 * @return {?}
 */
function (callback) {
    if (callback)
        this.callback = callback;
});
WSDL.prototype._processNextInclude = (/**
 * @param {?} includes
 * @return {?}
 */
function (includes) {
    return __awaiter(this, void 0, void 0, function* () {
        /** @type {?} */
        let self = this;
        /** @type {?} */
        let include = includes.shift();
        /** @type {?} */
        let options;
        if (!include)
            return; // callback();
        // callback();
        /** @type {?} */
        let includePath;
        if (!/^https?:/.test(self.uri) && !/^https?:/.test(include.location)) {
            // includePath = path.resolve(path.dirname(self.uri), include.location);
        }
        else {
            includePath = resolve(self.uri || '', include.location);
        }
        options = assign({}, this.options);
        // follow supplied ignoredNamespaces option
        options.ignoredNamespaces = this._originalIgnoredNamespaces || this.options.ignoredNamespaces;
        options.WSDL_CACHE = this.WSDL_CACHE;
        /** @type {?} */
        const wsdl = yield open_wsdl_recursive(includePath, options);
        self._includesWsdl.push(wsdl);
        if (wsdl.definitions instanceof DefinitionsElement) {
            mergeWith(self.definitions, wsdl.definitions, (/**
             * @param {?} a
             * @param {?} b
             * @return {?}
             */
            function (a, b) {
                return (a instanceof SchemaElement) ? a.merge(b) : undefined;
            }));
        }
        else {
            self.definitions.schemas[include.namespace || wsdl.definitions.$targetNamespace] = deepMerge(self.definitions.schemas[include.namespace || wsdl.definitions.$targetNamespace], wsdl.definitions);
        }
        return self._processNextInclude(includes);
        // open_wsdl_recursive(includePath, options, function(err, wsdl) {
        //   if (err) {
        //     return callback(err);
        //   }
        //   self._includesWsdl.push(wsdl);
        //   if (wsdl.definitions instanceof DefinitionsElement) {
        //     _.mergeWith(self.definitions, wsdl.definitions, function(a,b) {
        //       return (a instanceof SchemaElement) ? a.merge(b) : undefined;
        //     });
        //   } else {
        //     self.definitions.schemas[include.namespace || wsdl.definitions.$targetNamespace] = deepMerge(self.definitions.schemas[include.namespace || wsdl.definitions.$targetNamespace], wsdl.definitions);
        //   }
        //   self._processNextInclude(includes, function(err) {
        //     callback(err);
        //   });
        // });
    });
});
WSDL.prototype.processIncludes = (/**
 * @return {?}
 */
function () {
    return __awaiter(this, void 0, void 0, function* () {
        /** @type {?} */
        let schemas = this.definitions.schemas;
        /** @type {?} */
        let includes = [];
        for (let ns in schemas) {
            /** @type {?} */
            let schema = schemas[ns];
            includes = includes.concat(schema.includes || []);
        }
        return this._processNextInclude(includes);
    });
});
WSDL.prototype.describeServices = (/**
 * @return {?}
 */
function () {
    /** @type {?} */
    let services = {};
    for (let name in this.services) {
        /** @type {?} */
        let service = this.services[name];
        services[name] = service.description(this.definitions);
    }
    return services;
});
WSDL.prototype.toXML = (/**
 * @return {?}
 */
function () {
    return this.xml || '';
});
WSDL.prototype.xmlToObject = (/**
 * @param {?} xml
 * @param {?} callback
 * @return {?}
 */
function (xml, callback) {
    /** @type {?} */
    let self = this;
    /** @type {?} */
    let p = typeof callback === 'function' ? {} : parser(true);
    /** @type {?} */
    let objectName = null;
    /** @type {?} */
    let root = {};
    /** @type {?} */
    let schema = {};
    if (!this.options.forceSoap12Headers) {
        schema = {
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
    }
    else {
        schema = {
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
                    Code: {
                        Value: 'string',
                        Subcode: {
                            Value: 'string'
                        }
                    },
                    Reason: { Text: 'string' },
                    statusCode: 'number',
                    Detail: 'object'
                }
            }
        };
    }
    //console.log('schema',schema);
    /** @type {?} */
    let stack = [{ name: null, object: root, schema: schema }];
    /** @type {?} */
    let xmlns = {};
    /** @type {?} */
    let refs = {};
    /** @type {?} */
    let id;
    p.onopentag = (/**
     * @param {?} node
     * @return {?}
     */
    function (node) {
        /** @type {?} */
        let nsName = node.name;
        /** @type {?} */
        let attrs = node.attributes;
        /** @type {?} */
        let name = splitQName(nsName).name;
        /** @type {?} */
        let attributeName;
        /** @type {?} */
        let top = stack[stack.length - 1];
        /** @type {?} */
        let topSchema = top.schema;
        /** @type {?} */
        let elementAttributes = {};
        /** @type {?} */
        let hasNonXmlnsAttribute = false;
        /** @type {?} */
        let hasNilAttribute = false;
        /** @type {?} */
        let obj = {};
        /** @type {?} */
        let originalName = name;
        if (!objectName && top.name === 'Body' && name !== 'Fault') {
            /** @type {?} */
            let message = self.definitions.messages[name];
            // Support RPC/literal messages where response body contains one element named
            // after the operation + 'Response'. See http://www.w3.org/TR/wsdl#_names
            if (!message) {
                try {
                    // Determine if this is request or response
                    /** @type {?} */
                    let isInput = false;
                    /** @type {?} */
                    let isOutput = false;
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
                    /** @type {?} */
                    let portTypes = self.definitions.portTypes;
                    /** @type {?} */
                    let portTypeNames = Object.keys(portTypes);
                    // Currently this supports only one portType definition.
                    /** @type {?} */
                    let portType = portTypes[portTypeNames[0]];
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
                catch (e) {
                    if (self.options.returnFault) {
                        p.onerror(e);
                    }
                }
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
            /** @type {?} */
            let res = splitQName(attributeName);
            if (res.name === 'nil' && xmlns[res.prefix] === 'http://www.w3.org/2001/XMLSchema-instance' && elementAttributes[attributeName] &&
                (elementAttributes[attributeName].toLowerCase() === 'true' || elementAttributes[attributeName] === '1')) {
                hasNilAttribute = true;
                break;
            }
        }
        if (hasNonXmlnsAttribute) {
            obj[self.options.attributesKey] = elementAttributes;
        }
        // Pick up the schema for the type specified in element's xsi:type attribute.
        /** @type {?} */
        let xsiTypeSchema;
        /** @type {?} */
        let xsiType = elementAttributes['xsi:type'];
        if (xsiType) {
            /** @type {?} */
            let type = splitQName(xsiType);
            /** @type {?} */
            let typeURI;
            if (type.prefix === TNS_PREFIX$1) {
                // In case of xsi:type = "MyType"
                typeURI = xmlns[type.prefix] || xmlns.xmlns;
            }
            else {
                typeURI = xmlns[type.prefix];
            }
            /** @type {?} */
            let typeDef = self.findSchemaObject(typeURI, type.name);
            if (typeDef) {
                xsiTypeSchema = typeDef.description(self.definitions);
            }
        }
        if (topSchema && topSchema[name + '[]']) {
            name = name + '[]';
        }
        stack.push({
            name: originalName,
            object: obj,
            schema: (xsiTypeSchema || (topSchema && topSchema[name])),
            id: attrs.id,
            nil: hasNilAttribute
        });
    });
    p.onclosetag = (/**
     * @param {?} nsName
     * @return {?}
     */
    function (nsName) {
        /** @type {?} */
        let cur = stack.pop();
        /** @type {?} */
        let obj = cur.object;
        /** @type {?} */
        let top = stack[stack.length - 1];
        /** @type {?} */
        let topObject = top.object;
        /** @type {?} */
        let topSchema = top.schema;
        /** @type {?} */
        let name = splitQName(nsName).name;
        if (typeof cur.schema === 'string' && (cur.schema === 'string' || ((/** @type {?} */ (cur.schema))).split(':')[1] === 'string')) {
            if (typeof obj === 'object' && Object.keys(obj).length === 0)
                obj = cur.object = '';
        }
        if (cur.nil === true) {
            if (self.options.handleNilAsNull) {
                obj = null;
            }
            else {
                return;
            }
        }
        if (isPlainObject(obj) && !Object.keys(obj).length) {
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
    });
    p.oncdata = (/**
     * @param {?} text
     * @return {?}
     */
    function (text) {
        /** @type {?} */
        let originalText = text;
        text = trim(text);
        if (!text.length) {
            return;
        }
        if (/<\?xml[\s\S]+\?>/.test(text)) {
            /** @type {?} */
            let top = stack[stack.length - 1];
            /** @type {?} */
            let value = self.xmlToObject(text);
            if (top.object[self.options.attributesKey]) {
                top.object[self.options.valueKey] = value;
            }
            else {
                top.object = value;
            }
        }
        else {
            p.ontext(originalText);
        }
    });
    p.onerror = (/**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        p.resume();
        throw {
            Fault: {
                faultcode: 500,
                faultstring: 'Invalid XML',
                detail: new Error(e).message,
                statusCode: 500
            }
        };
    });
    p.ontext = (/**
     * @param {?} text
     * @return {?}
     */
    function (text) {
        /** @type {?} */
        let originalText = text;
        text = trim(text);
        if (!text.length) {
            return;
        }
        /** @type {?} */
        let top = stack[stack.length - 1];
        /** @type {?} */
        let name = splitQName(top.schema).name;
        /** @type {?} */
        let value;
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
                if (self.options.preserveWhitespace) {
                    text = originalText;
                }
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
    });
    if (typeof callback === 'function') {
        // we be streaming
        /** @type {?} */
        let saxStream = createStream(true);
        saxStream.on('opentag', p.onopentag);
        saxStream.on('closetag', p.onclosetag);
        saxStream.on('cdata', p.oncdata);
        saxStream.on('text', p.ontext);
        xml.pipe(saxStream)
            .on('error', (/**
         * @param {?} err
         * @return {?}
         */
        function (err) {
            callback(err);
        }))
            .on('end', (/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            let r;
            try {
                r = finish();
            }
            catch (e) {
                return callback(e);
            }
            callback(null, r);
        }));
        return;
    }
    p.write(xml).close();
    return finish();
    /**
     * @return {?}
     */
    function finish() {
        // MultiRef support: merge objects instead of replacing
        for (let n in refs) {
            /** @type {?} */
            let ref = refs[n];
            for (let i = 0; i < ref.hrefs.length; i++) {
                assign(ref.hrefs[i].obj, ref.obj);
            }
        }
        if (root.Envelope) {
            /** @type {?} */
            let body = root.Envelope.Body;
            /** @type {?} */
            let error;
            if (body && body.Fault) {
                if (!body.Fault.Code) {
                    /** @type {?} */
                    let code = body.Fault.faultcode && body.Fault.faultcode.$value;
                    /** @type {?} */
                    let string = body.Fault.faultstring && body.Fault.faultstring.$value;
                    /** @type {?} */
                    let detail = body.Fault.detail && body.Fault.detail.$value;
                    code = code || body.Fault.faultcode;
                    string = string || body.Fault.faultstring;
                    detail = detail || body.Fault.detail;
                    error = new Error(code + ': ' + string + (detail ? ': ' + detail : ''));
                }
                else {
                    /** @type {?} */
                    let code = body.Fault.Code.Value;
                    /** @type {?} */
                    let string = body.Fault.Reason.Text.$value;
                    /** @type {?} */
                    let detail = body.Fault.Detail.info;
                    error = new Error(code + ': ' + string + (detail ? ': ' + detail : ''));
                }
                error.root = root;
                throw body.Fault;
            }
            return root.Envelope;
        }
        return root;
    }
});
/**
 * Look up a XSD type or element by namespace URI and name
 * @param {String} nsURI Namespace URI
 * @param {String} qname Local or qualified name
 * @returns {*} The XSD type/element definition
 */
WSDL.prototype.findSchemaObject = (/**
 * @param {?} nsURI
 * @param {?} qname
 * @return {?}
 */
function (nsURI, qname) {
    if (!nsURI || !qname) {
        return null;
    }
    /** @type {?} */
    let def = null;
    if (this.definitions.schemas) {
        /** @type {?} */
        let schema = this.definitions.schemas[nsURI];
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
});
/**
 * Create document style xml string from the parameters
 * @param {String} name
 * @param {*} params
 * @param {String} nsPrefix
 * @param {String} nsURI
 * @param {String} type
 */
WSDL.prototype.objectToDocumentXML = (/**
 * @param {?} name
 * @param {?} params
 * @param {?} nsPrefix
 * @param {?} nsURI
 * @param {?} type
 * @return {?}
 */
function (name, params, nsPrefix, nsURI, type) {
    //If user supplies XML already, just use that.  XML Declaration should not be present.
    if (params && params._xml) {
        return params._xml;
    }
    /** @type {?} */
    let args = {};
    args[name] = params;
    /** @type {?} */
    let parameterTypeObj = type ? this.findSchemaObject(nsURI, type) : null;
    return this.objectToXML(args, null, nsPrefix, nsURI, true, null, parameterTypeObj);
});
/**
 * Create RPC style xml string from the parameters
 * @param {String} name
 * @param {*} params
 * @param {String} nsPrefix
 * @param {String} nsURI
 * @returns {string}
 */
WSDL.prototype.objectToRpcXML = (/**
 * @param {?} name
 * @param {?} params
 * @param {?} nsPrefix
 * @param {?} nsURI
 * @param {?} isParts
 * @return {?}
 */
function (name, params, nsPrefix, nsURI, isParts) {
    /** @type {?} */
    let parts = [];
    /** @type {?} */
    let defs = this.definitions;
    /** @type {?} */
    let nsAttrName = '_xmlns';
    nsPrefix = nsPrefix || findPrefix$1(defs.xmlns, nsURI);
    nsURI = nsURI || defs.xmlns[nsPrefix];
    nsPrefix = nsPrefix === TNS_PREFIX$1 ? '' : (nsPrefix + ':');
    parts.push(['<', nsPrefix, name, '>'].join(''));
    for (let key in params) {
        if (!params.hasOwnProperty(key)) {
            continue;
        }
        if (key !== nsAttrName) {
            /** @type {?} */
            let value = params[key];
            /** @type {?} */
            let prefixedKey = (isParts ? '' : nsPrefix) + key;
            /** @type {?} */
            let attributes = [];
            if (typeof value === 'object' && value.hasOwnProperty(this.options.attributesKey)) {
                /** @type {?} */
                let attrs = value[this.options.attributesKey];
                for (let n in attrs) {
                    attributes.push(' ' + n + '=' + '"' + attrs[n] + '"');
                }
            }
            parts.push(['<', prefixedKey].concat(attributes).concat('>').join(''));
            parts.push((typeof value === 'object') ? this.objectToXML(value, key, nsPrefix, nsURI) : xmlEscape(value));
            parts.push(['</', prefixedKey, '>'].join(''));
        }
    }
    parts.push(['</', nsPrefix, name, '>'].join(''));
    return parts.join('');
});
/**
 * @param {?} ns
 * @return {?}
 */
function appendColon(ns) {
    return (ns && ns.charAt(ns.length - 1) !== ':') ? ns + ':' : ns;
}
/**
 * @param {?} ns
 * @return {?}
 */
function noColonNameSpace(ns) {
    return (ns && ns.charAt(ns.length - 1) === ':') ? ns.substring(0, ns.length - 1) : ns;
}
WSDL.prototype.isIgnoredNameSpace = (/**
 * @param {?} ns
 * @return {?}
 */
function (ns) {
    return this.options.ignoredNamespaces.indexOf(ns) > -1;
});
WSDL.prototype.filterOutIgnoredNameSpace = (/**
 * @param {?} ns
 * @return {?}
 */
function (ns) {
    /** @type {?} */
    let namespace = noColonNameSpace(ns);
    return this.isIgnoredNameSpace(namespace) ? '' : namespace;
});
/**
 * Convert an object to XML.  This is a recursive method as it calls itself.
 *
 * @param {Object} obj the object to convert.
 * @param {String} name the name of the element (if the object being traversed is
 * an element).
 * @param {String} nsPrefix the namespace prefix of the object I.E. xsd.
 * @param {String} nsURI the full namespace of the object I.E. http://w3.org/schema.
 * @param {Boolean} isFirst whether or not this is the first item being traversed.
 * @param {?} xmlnsAttr
 * @param {?} parameterTypeObject
 * @param {NamespaceContext} nsContext Namespace context
 */
WSDL.prototype.objectToXML = (/**
 * @param {?} obj
 * @param {?} name
 * @param {?} nsPrefix
 * @param {?} nsURI
 * @param {?} isFirst
 * @param {?} xmlnsAttr
 * @param {?} schemaObject
 * @param {?} nsContext
 * @return {?}
 */
function (obj, name, nsPrefix, nsURI, isFirst, xmlnsAttr, schemaObject, nsContext) {
    /** @type {?} */
    let self = this;
    /** @type {?} */
    let schema = this.definitions.schemas[nsURI];
    /** @type {?} */
    let parentNsPrefix = nsPrefix ? nsPrefix.parent : undefined;
    if (typeof parentNsPrefix !== 'undefined') {
        //we got the parentNsPrefix for our array. setting the namespace-letiable back to the current namespace string
        nsPrefix = nsPrefix.current;
    }
    parentNsPrefix = noColonNameSpace(parentNsPrefix);
    if (this.isIgnoredNameSpace(parentNsPrefix)) {
        parentNsPrefix = '';
    }
    /** @type {?} */
    let soapHeader = !schema;
    /** @type {?} */
    let qualified = schema && schema.$elementFormDefault === 'qualified';
    /** @type {?} */
    let parts = [];
    /** @type {?} */
    let prefixNamespace = (nsPrefix || qualified) && nsPrefix !== TNS_PREFIX$1;
    /** @type {?} */
    let xmlnsAttrib = '';
    if (nsURI && isFirst) {
        if (self.options.overrideRootElement && self.options.overrideRootElement.xmlnsAttributes) {
            self.options.overrideRootElement.xmlnsAttributes.forEach((/**
             * @param {?} attribute
             * @return {?}
             */
            function (attribute) {
                xmlnsAttrib += ' ' + attribute.name + '="' + attribute.value + '"';
            }));
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
    /** @type {?} */
    let ns = '';
    if (self.options.overrideRootElement && isFirst) {
        ns = self.options.overrideRootElement.namespace;
    }
    else if (prefixNamespace && (qualified || isFirst || soapHeader) && !this.isIgnoredNameSpace(nsPrefix)) {
        ns = nsPrefix;
    }
    /** @type {?} */
    let i;
    /** @type {?} */
    let n;
    // start building out XML string.
    if (Array.isArray(obj)) {
        for (i = 0, n = obj.length; i < n; i++) {
            /** @type {?} */
            let item = obj[i];
            /** @type {?} */
            let arrayAttr = self.processAttributes(item, nsContext);
            /** @type {?} */
            let correctOuterNsPrefix = parentNsPrefix || ns;
            //using the parent namespace prefix if given
            /** @type {?} */
            let body = self.objectToXML(item, name, nsPrefix, nsURI, false, null, schemaObject, nsContext);
            /** @type {?} */
            let openingTagParts = ['<', appendColon(correctOuterNsPrefix), name, arrayAttr, xmlnsAttrib];
            if (body === '' && self.options.useEmptyTag) {
                // Use empty (self-closing) tags if no contents
                openingTagParts.push(' />');
                parts.push(openingTagParts.join(''));
            }
            else {
                openingTagParts.push('>');
                if (self.options.namespaceArrayElements || i === 0) {
                    parts.push(openingTagParts.join(''));
                }
                parts.push(body);
                if (self.options.namespaceArrayElements || i === n - 1) {
                    parts.push(['</', appendColon(correctOuterNsPrefix), name, '>'].join(''));
                }
            }
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
            /** @type {?} */
            let child = obj[name];
            if (typeof child === 'undefined') {
                continue;
            }
            /** @type {?} */
            let attr = self.processAttributes(child, nsContext);
            /** @type {?} */
            let value = '';
            /** @type {?} */
            let nonSubNameSpace = '';
            /** @type {?} */
            let emptyNonSubNameSpace = false;
            /** @type {?} */
            let nameWithNsRegex = /^([^:]+):([^:]+)$/.exec(name);
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
                        /** @type {?} */
                        let childSchemaObject = self.findChildSchemaObject(schemaObject, name);
                        //find sub namespace if not a primitive
                        if (childSchemaObject &&
                            ((childSchemaObject.$type && (childSchemaObject.$type.indexOf('xsd:') === -1)) ||
                                childSchemaObject.$ref || childSchemaObject.$name)) {
                            /*if the base name space of the children is not in the ingoredSchemaNamspaces we use it.
                                           This is because in some services the child nodes do not need the baseNameSpace.
                                           */
                            /** @type {?} */
                            let childNsPrefix = '';
                            /** @type {?} */
                            let childName = '';
                            /** @type {?} */
                            let childNsURI;
                            /** @type {?} */
                            let childXmlnsAttrib = '';
                            /** @type {?} */
                            let elementQName = childSchemaObject.$ref || childSchemaObject.$name;
                            if (elementQName) {
                                elementQName = splitQName(elementQName);
                                childName = elementQName.name;
                                if (elementQName.prefix === TNS_PREFIX$1) {
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
                                /** @type {?} */
                                let unqualified = false;
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
                            /** @type {?} */
                            let resolvedChildSchemaObject;
                            if (childSchemaObject.$type) {
                                /** @type {?} */
                                let typeQName = splitQName(childSchemaObject.$type);
                                /** @type {?} */
                                let typePrefix = typeQName.prefix;
                                /** @type {?} */
                                let typeURI = schema.xmlns[typePrefix] || self.definitions.xmlns[typePrefix];
                                childNsURI = typeURI;
                                if (typeURI !== 'http://www.w3.org/2001/XMLSchema' && typePrefix !== TNS_PREFIX$1) {
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
                            /** @type {?} */
                            let completeChildParamTypeObject = self.findChildSchemaObject(obj[self.options.attributesKey].xsi_type.type, obj[self.options.attributesKey].xsi_type.xmlns);
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
            /** @type {?} */
            let useEmptyTag = !value && self.options.useEmptyTag;
            if (!Array.isArray(child)) {
                // start tag
                parts.push(['<', emptyNonSubNameSpace ? '' : appendColon(nonSubNameSpace || ns), name, attr, xmlnsAttrib,
                    (child === null ? ' xsi:nil="true"' : ''),
                    useEmptyTag ? ' />' : '>'
                ].join(''));
            }
            if (!useEmptyTag) {
                parts.push(value);
                if (!Array.isArray(child)) {
                    // end tag
                    parts.push(['</', emptyNonSubNameSpace ? '' : appendColon(nonSubNameSpace || ns), name, '>'].join(''));
                }
            }
        }
    }
    else if (obj !== undefined) {
        parts.push((self.options.escapeXML) ? xmlEscape(obj) : obj);
    }
    nsContext.popContext();
    return parts.join('');
});
WSDL.prototype.processAttributes = (/**
 * @param {?} child
 * @param {?} nsContext
 * @return {?}
 */
function (child, nsContext) {
    /** @type {?} */
    let attr = '';
    if (child === null) {
        child = [];
    }
    /** @type {?} */
    let attrObj = child[this.options.attributesKey];
    if (attrObj && attrObj.xsi_type) {
        /** @type {?} */
        let xsiType = attrObj.xsi_type;
        /** @type {?} */
        let prefix = xsiType.prefix || xsiType.namespace;
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
        for (let attrKey in attrObj) {
            //handle complex extension separately
            if (attrKey === 'xsi_type') {
                /** @type {?} */
                let attrValue = attrObj[attrKey];
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
});
/**
 * Look up a schema type definition
 * @param name
 * @param nsURI
 * @returns {*}
 */
WSDL.prototype.findSchemaType = (/**
 * @param {?} name
 * @param {?} nsURI
 * @return {?}
 */
function (name, nsURI) {
    if (!this.definitions.schemas || !name || !nsURI) {
        return null;
    }
    /** @type {?} */
    let schema = this.definitions.schemas[nsURI];
    if (!schema || !schema.complexTypes) {
        return null;
    }
    return schema.complexTypes[name];
});
WSDL.prototype.findChildSchemaObject = (/**
 * @param {?} parameterTypeObj
 * @param {?} childName
 * @param {?} backtrace
 * @return {?}
 */
function (parameterTypeObj, childName, backtrace) {
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
    /** @type {?} */
    let found = null;
    /** @type {?} */
    let i = 0;
    /** @type {?} */
    let child;
    /** @type {?} */
    let ref;
    if (Array.isArray(parameterTypeObj.$lookupTypes) && parameterTypeObj.$lookupTypes.length) {
        /** @type {?} */
        let types = parameterTypeObj.$lookupTypes;
        for (i = 0; i < types.length; i++) {
            /** @type {?} */
            let typeObj = types[i];
            if (typeObj.$name === childName) {
                found = typeObj;
                break;
            }
        }
    }
    /** @type {?} */
    let object = parameterTypeObj;
    if (object.$name === childName && object.name === 'element') {
        return object;
    }
    if (object.$ref) {
        ref = splitQName(object.$ref);
        if (ref.name === childName) {
            return object;
        }
    }
    /** @type {?} */
    let childNsURI;
    // want to avoid unecessary recursion to improve performance
    if (object.$type && backtrace.length === 1) {
        /** @type {?} */
        let typeInfo = splitQName(object.$type);
        if (typeInfo.prefix === TNS_PREFIX$1) {
            childNsURI = parameterTypeObj.$targetNamespace;
        }
        else {
            childNsURI = this.definitions.xmlns[typeInfo.prefix];
        }
        /** @type {?} */
        let typeDef = this.findSchemaType(typeInfo.name, childNsURI);
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
                /** @type {?} */
                let baseQName = splitQName(child.$base);
                /** @type {?} */
                let childNameSpace = baseQName.prefix === TNS_PREFIX$1 ? '' : baseQName.prefix;
                childNsURI = child.xmlns[baseQName.prefix] || this.definitions.xmlns[baseQName.prefix];
                /** @type {?} */
                let foundBase = this.findSchemaType(baseQName.name, childNsURI);
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
});
WSDL.prototype._parse = (/**
 * @param {?} xml
 * @return {?}
 */
function (xml) {
    /** @type {?} */
    let self = this;
    /** @type {?} */
    let p = parser(true);
    /** @type {?} */
    let stack = [];
    /** @type {?} */
    let root = null;
    /** @type {?} */
    let types = null;
    /** @type {?} */
    let schema = null;
    /** @type {?} */
    let options = self.options;
    p.onopentag = (/**
     * @param {?} node
     * @return {?}
     */
    function (node) {
        /** @type {?} */
        let nsName = node.name;
        /** @type {?} */
        let attrs = node.attributes;
        /** @type {?} */
        let top = stack[stack.length - 1];
        /** @type {?} */
        let name;
        if (top) {
            try {
                top.startElement(stack, nsName, attrs, options);
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
    });
    p.onclosetag = (/**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        /** @type {?} */
        let top = stack[stack.length - 1];
        ok(top, 'Unmatched close tag: ' + name);
        top.endElement(stack, name);
    });
    p.write(xml).close();
    return root;
});
WSDL.prototype._fromXML = (/**
 * @param {?} xml
 * @return {?}
 */
function (xml) {
    this.definitions = this._parse(xml);
    this.definitions.descriptions = {
        types: {}
    };
    this.xml = xml;
});
WSDL.prototype._fromServices = (/**
 * @param {?} services
 * @return {?}
 */
function (services) {
});
WSDL.prototype._xmlnsMap = (/**
 * @return {?}
 */
function () {
    /** @type {?} */
    let xmlns = this.definitions.xmlns;
    /** @type {?} */
    let str = '';
    for (let alias in xmlns) {
        if (alias === '' || alias === TNS_PREFIX$1) {
            continue;
        }
        /** @type {?} */
        let ns = xmlns[alias];
        switch (ns) {
            case "http://xml.apache.org/xml-soap": // apachesoap
            case "http://schemas.xmlsoap.org/wsdl/": // wsdl
            case "http://schemas.xmlsoap.org/wsdl/soap/": // wsdlsoap
            case "http://schemas.xmlsoap.org/wsdl/soap12/": // wsdlsoap12
            case "http://schemas.xmlsoap.org/soap/encoding/": // soapenc
            case "http://www.w3.org/2001/XMLSchema": // xsd
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
});
/*
 * Have another function to load previous WSDLs as we
 * don't want this to be invoked externally (expect for tests)
 * This will attempt to fix circular dependencies with XSD files,
 * Given
 * - file.wsdl
 *   - xs:import namespace="A" schemaLocation: A.xsd
 * - A.xsd
 *   - xs:import namespace="B" schemaLocation: B.xsd
 * - B.xsd
 *   - xs:import namespace="A" schemaLocation: A.xsd
 * file.wsdl will start loading, import A, then A will import B, which will then import A
 * Because A has already started to load previously it will be returned right away and
 * have an internal circular reference
 * B would then complete loading, then A, then file.wsdl
 * By the time file A starts processing its includes its definitions will be already loaded,
 * this is the only thing that B will depend on when "opening" A
 */
/**
 * @param {?} uri
 * @param {?} options
 * @return {?}
 */
function open_wsdl_recursive(uri, options) {
    /** @type {?} */
    let fromCache;
    /** @type {?} */
    let WSDL_CACHE;
    // if (typeof options === 'function') {
    //   callback = options;
    //   options = {};
    // }
    WSDL_CACHE = options.WSDL_CACHE;
    if (fromCache = WSDL_CACHE[uri]) {
        // return callback.call(fromCache, null, fromCache);
        return fromCache;
    }
    return open_wsdl(uri, options);
}
/**
 * @param {?} uri
 * @param {?} options
 * @return {?}
 */
function open_wsdl(uri, options) {
    return __awaiter(this, void 0, void 0, function* () {
        // if (typeof options === 'function') {
        //   callback = options;
        //   options = {};
        // }
        // if (typeof options === 'function') {
        //   callback = options;
        //   options = {};
        // }
        // initialize cache when calling open_wsdl directly
        /** @type {?} */
        let WSDL_CACHE = options.WSDL_CACHE || {};
        /** @type {?} */
        let request_headers = options.wsdl_headers;
        /** @type {?} */
        let request_options = options.wsdl_options;
        // let wsdl;
        // if (!/^https?:/.test(uri)) {
        //   // debug('Reading file: %s', uri);
        //   // fs.readFile(uri, 'utf8', function(err, definition) {
        //   //   if (err) {
        //   //     callback(err);
        //   //   }
        //   //   else {
        //   //     wsdl = new WSDL(definition, uri, options);
        //   //     WSDL_CACHE[ uri ] = wsdl;
        //   //     wsdl.WSDL_CACHE = WSDL_CACHE;
        //   //     wsdl.onReady(callback);
        //   //   }
        //   // });
        // }
        // else {
        //   debug('Reading url: %s', uri);
        //   let httpClient = options.httpClient || new HttpClient(options);
        //   httpClient.request(uri, null /* options */, function(err, response, definition) {
        //     if (err) {
        //       callback(err);
        //     } else if (response && response.statusCode === 200) {
        //       wsdl = new WSDL(definition, uri, options);
        //       WSDL_CACHE[ uri ] = wsdl;
        //       wsdl.WSDL_CACHE = WSDL_CACHE;
        //       wsdl.onReady(callback);
        //     } else {
        //       callback(new Error('Invalid WSDL URL: ' + uri + "\n\n\r Code: " + response.statusCode + "\n\n\r Response Body: " + response.body));
        //     }
        //   }, request_headers, request_options);
        // }
        // return wsdl;
        console.log('Reading url: %s', uri);
        /** @type {?} */
        const httpClient = options.httpClient;
        /** @type {?} */
        const wsdlDef = yield httpClient.get(uri, { responseType: 'text' }).toPromise();
        /** @type {?} */
        const wsdlObj = yield new Promise((/**
         * @param {?} resolve
         * @return {?}
         */
        (resolve) => {
            /** @type {?} */
            const wsdl = new WSDL(wsdlDef, uri, options);
            WSDL_CACHE[uri] = wsdl;
            wsdl.WSDL_CACHE = WSDL_CACHE;
            wsdl.onReady(resolve(wsdl));
        }));
        //console.log("wsdl", wsdlObj)
        return wsdlObj;
    });
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @param {?} username
 * @param {?} password
 * @param {?} defaults
 * @return {?}
 */
function BasicAuthSecurity(username, password, defaults) {
    this._username = username;
    this._password = password;
    this.defaults = {};
    merge(this.defaults, defaults);
}
BasicAuthSecurity.prototype.addHeaders = (/**
 * @param {?} headers
 * @return {?}
 */
function (headers) {
    headers.Authorization = 'Basic ' + new Buffer((this._username + ':' + this._password) || '').toString('base64');
});
BasicAuthSecurity.prototype.toXML = (/**
 * @return {?}
 */
function () {
    return '';
});
BasicAuthSecurity.prototype.addOptions = (/**
 * @param {?} options
 * @return {?}
 */
function (options) {
    merge(options, this.defaults);
});

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
"use strict";
/** @type {?} */
var validPasswordTypes = ['PasswordDigest', 'PasswordText'];
/**
 * @param {?} username
 * @param {?} password
 * @param {?} options
 * @return {?}
 */
function WSSecurity(username, password, options) {
    options = options || {};
    this._username = username;
    this._password = password;
    //must account for backward compatibility for passwordType String param as well as object options defaults: passwordType = 'PasswordText', hasTimeStamp = true   
    if (typeof options === 'string') {
        this._passwordType = options ? options : 'PasswordText';
        options = {};
    }
    else {
        this._passwordType = options.passwordType ? options.passwordType : 'PasswordText';
    }
    if (validPasswordTypes.indexOf(this._passwordType) === -1) {
        this._passwordType = 'PasswordText';
    }
    this._hasTimeStamp = options.hasTimeStamp || typeof options.hasTimeStamp === 'boolean' ? !!options.hasTimeStamp : true;
    /*jshint eqnull:true */
    if (options.hasNonce != null) {
        this._hasNonce = !!options.hasNonce;
    }
    this._hasTokenCreated = options.hasTokenCreated || typeof options.hasTokenCreated === 'boolean' ? !!options.hasTokenCreated : true;
    if (options.actor != null) {
        this._actor = options.actor;
    }
    if (options.mustUnderstand != null) {
        this._mustUnderstand = !!options.mustUnderstand;
    }
}
WSSecurity.prototype.toXML = (/**
 * @return {?}
 */
function () {
    // avoid dependency on date formatting libraries
    /**
     * @param {?} d
     * @return {?}
     */
    function getDate(d) {
        /**
         * @param {?} n
         * @return {?}
         */
        function pad(n) {
            return n < 10 ? '0' + n : n;
        }
        return d.getUTCFullYear() + '-'
            + pad(d.getUTCMonth() + 1) + '-'
            + pad(d.getUTCDate()) + 'T'
            + pad(d.getUTCHours()) + ':'
            + pad(d.getUTCMinutes()) + ':'
            + pad(d.getUTCSeconds()) + 'Z';
    }
    /** @type {?} */
    var now = new Date();
    /** @type {?} */
    var created = getDate(now);
    /** @type {?} */
    var timeStampXml = '';
    if (this._hasTimeStamp) {
        /** @type {?} */
        var expires = getDate(new Date(now.getTime() + (1000 * 600)));
        timeStampXml = "<wsu:Timestamp wsu:Id=\"Timestamp-" + created + "\">" +
            "<wsu:Created>" + created + "</wsu:Created>" +
            "<wsu:Expires>" + expires + "</wsu:Expires>" +
            "</wsu:Timestamp>";
    }
    /** @type {?} */
    var password;
    /** @type {?} */
    var nonce;
    if (this._hasNonce || this._passwordType !== 'PasswordText') {
        // nonce = base64 ( sha1 ( created + random ) )
        // var nHash = crypto.createHash('sha1');
        // nHash.update(created + Math.random());
        // nonce = nHash.digest('base64');
        nonce = Base64.stringify(sha1(created + Math.random(), ''));
    }
    if (this._passwordType === 'PasswordText') {
        password = "<wsse:Password Type=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText\">" + this._password + "</wsse:Password>";
        if (nonce) {
            password += "<wsse:Nonce EncodingType=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary\">" + nonce + "</wsse:Nonce>";
        }
    }
    else {
        password = "<wsse:Password Type=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest\">" + passwordDigest(nonce, created, this._password) + "</wsse:Password>" +
            "<wsse:Nonce EncodingType=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary\">" + nonce + "</wsse:Nonce>";
    }
    return "<wsse:Security " + (this._actor ? "soap:actor=\"" + this._actor + "\" " : "") +
        (this._mustUnderstand ? "soap:mustUnderstand=\"1\" " : "") +
        "xmlns:wsse=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\" xmlns:wsu=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\">" +
        timeStampXml +
        "<wsse:UsernameToken xmlns:wsu=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\" wsu:Id=\"SecurityToken-" + created + "\">" +
        "<wsse:Username>" + this._username + "</wsse:Username>" +
        password +
        (this._hasTokenCreated ? "<wsu:Created>" + created + "</wsu:Created>" : "") +
        "</wsse:UsernameToken>" +
        "</wsse:Security>";
});

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
"use strict";
/**
 * @param {?} token
 * @param {?} defaults
 * @return {?}
 */
function BearerSecurity(token, defaults) {
    this._token = token;
    this.defaults = {};
    merge(this.defaults, defaults);
}
BearerSecurity.prototype.addHeaders = (/**
 * @param {?} headers
 * @return {?}
 */
function (headers) {
    headers.Authorization = "Bearer " + this._token;
});
BearerSecurity.prototype.toXML = (/**
 * @return {?}
 */
function () {
    return '';
});
BearerSecurity.prototype.addOptions = (/**
 * @param {?} options
 * @return {?}
 */
function (options) {
    merge(options, this.defaults);
});

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
"use strict";
/**
 * @param {?} username
 * @param {?} password
 * @param {?} domain
 * @param {?} workstation
 * @return {?}
 */
function NTLMSecurity(username, password, domain, workstation) {
    if (typeof username === "object") {
        this.defaults = username;
        this.defaults.ntlm = true;
    }
    else {
        this.defaults = {
            ntlm: true,
            username: username,
            password: password,
            domain: domain,
            workstation: workstation
        };
    }
}
NTLMSecurity.prototype.addHeaders = (/**
 * @param {?} headers
 * @return {?}
 */
function (headers) {
    headers.Connection = 'keep-alive';
});
NTLMSecurity.prototype.toXML = (/**
 * @return {?}
 */
function () {
    return '';
});
NTLMSecurity.prototype.addOptions = (/**
 * @param {?} options
 * @return {?}
 */
function (options) {
    merge(options, this.defaults);
});

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
"use strict";
/** @type {?} */
const security = {
    BasicAuthSecurity,
    BearerSecurity,
    WSSecurity,
    // WSSecurityCert,
    NTLMSecurity,
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const nonIdentifierChars = /[^a-z$_0-9]/i;
/** @type {?} */
const Client = (/**
 * @param {?} wsdl
 * @param {?} endpoint
 * @param {?} options
 * @return {?}
 */
function (wsdl, endpoint, options) {
    // events.EventEmitter.call(this);
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
});
// util.inherits(Client, events.EventEmitter);
Client.prototype.addSoapHeader = (/**
 * @param {?} soapHeader
 * @param {?} name
 * @param {?} namespace
 * @param {?} xmlns
 * @return {?}
 */
function (soapHeader, name, namespace, xmlns) {
    if (!this.soapHeaders) {
        this.soapHeaders = [];
    }
    if (typeof soapHeader === 'object') {
        soapHeader = this.wsdl.objectToXML(soapHeader, name, namespace, xmlns, true);
    }
    return this.soapHeaders.push(soapHeader) - 1;
});
Client.prototype.changeSoapHeader = (/**
 * @param {?} index
 * @param {?} soapHeader
 * @param {?} name
 * @param {?} namespace
 * @param {?} xmlns
 * @return {?}
 */
function (index, soapHeader, name, namespace, xmlns) {
    if (!this.soapHeaders) {
        this.soapHeaders = [];
    }
    if (typeof soapHeader === 'object') {
        soapHeader = this.wsdl.objectToXML(soapHeader, name, namespace, xmlns, true);
    }
    this.soapHeaders[index] = soapHeader;
});
Client.prototype.getSoapHeaders = (/**
 * @return {?}
 */
function () {
    return this.soapHeaders;
});
Client.prototype.clearSoapHeaders = (/**
 * @return {?}
 */
function () {
    this.soapHeaders = null;
});
Client.prototype.addHttpHeader = (/**
 * @param {?} name
 * @param {?} value
 * @return {?}
 */
function (name, value) {
    if (!this.httpHeaders) {
        this.httpHeaders = {};
    }
    this.httpHeaders[name] = value;
});
Client.prototype.getHttpHeaders = (/**
 * @return {?}
 */
function () {
    return this.httpHeaders;
});
Client.prototype.clearHttpHeaders = (/**
 * @return {?}
 */
function () {
    this.httpHeaders = {};
});
Client.prototype.addBodyAttribute = (/**
 * @param {?} bodyAttribute
 * @param {?} name
 * @param {?} namespace
 * @param {?} xmlns
 * @return {?}
 */
function (bodyAttribute, name, namespace, xmlns) {
    if (!this.bodyAttributes) {
        this.bodyAttributes = [];
    }
    if (typeof bodyAttribute === 'object') {
        /** @type {?} */
        let composition = '';
        Object.getOwnPropertyNames(bodyAttribute).forEach((/**
         * @param {?} prop
         * @param {?} idx
         * @param {?} array
         * @return {?}
         */
        function (prop, idx, array) {
            composition += ' ' + prop + '="' + bodyAttribute[prop] + '"';
        }));
        bodyAttribute = composition;
    }
    if (bodyAttribute.substr(0, 1) !== ' ')
        bodyAttribute = ' ' + bodyAttribute;
    this.bodyAttributes.push(bodyAttribute);
});
Client.prototype.getBodyAttributes = (/**
 * @return {?}
 */
function () {
    return this.bodyAttributes;
});
Client.prototype.clearBodyAttributes = (/**
 * @return {?}
 */
function () {
    this.bodyAttributes = null;
});
Client.prototype.setEndpoint = (/**
 * @param {?} endpoint
 * @return {?}
 */
function (endpoint) {
    this.endpoint = endpoint;
    this._initializeServices(endpoint);
});
Client.prototype.describe = (/**
 * @return {?}
 */
function () {
    /** @type {?} */
    const types = this.wsdl.definitions.types;
    return this.wsdl.describeServices();
});
Client.prototype.setSecurity = (/**
 * @param {?} security
 * @return {?}
 */
function (security) {
    this.security = security;
});
Client.prototype.setSOAPAction = (/**
 * @param {?} SOAPAction
 * @return {?}
 */
function (SOAPAction) {
    this.SOAPAction = SOAPAction;
});
Client.prototype._initializeServices = (/**
 * @param {?} endpoint
 * @return {?}
 */
function (endpoint) {
    /** @type {?} */
    const definitions = this.wsdl.definitions;
    /** @type {?} */
    const services = definitions.services;
    for (const name in services) {
        this[name] = this._defineService(services[name], endpoint);
    }
});
Client.prototype._initializeOptions = (/**
 * @param {?} options
 * @return {?}
 */
function (options) {
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
});
Client.prototype._defineService = (/**
 * @param {?} service
 * @param {?} endpoint
 * @return {?}
 */
function (service, endpoint) {
    /** @type {?} */
    const ports = service.ports;
    /** @type {?} */
    const def = {};
    for (const name in ports) {
        def[name] = this._definePort(ports[name], endpoint ? endpoint : ports[name].location);
    }
    return def;
});
Client.prototype._definePort = (/**
 * @param {?} port
 * @param {?} endpoint
 * @return {?}
 */
function (port, endpoint) {
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
});
Client.prototype._defineMethod = (/**
 * @param {?} method
 * @param {?} location
 * @return {?}
 */
function (method, location) {
    /** @type {?} */
    const self = this;
    /** @type {?} */
    let temp = null;
    return (/**
     * @param {?} args
     * @param {?} options
     * @param {?} extraHeaders
     * @return {?}
     */
    function (args, options, extraHeaders) {
        return self._invoke(method, args, location, options, extraHeaders);
    });
});
Client.prototype._invoke = (/**
 * @param {?} method
 * @param {?} args
 * @param {?} location
 * @param {?} options
 * @param {?} extraHeaders
 * @return {?}
 */
function (method, args, location, options, extraHeaders) {
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
        "Content-Type": "text/xml; charset=utf-8"
    };
    /** @type {?} */
    let xmlnsSoap = "xmlns:" + envelopeKey + "=\"http://schemas.xmlsoap.org/soap/envelope/\"";
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
    if ((style === 'rpc') && ((input.parts || input.name === "element") || args === null)) {
        ok(!style || style === 'rpc', 'invalid message definition for document style binding');
        message = self.wsdl.objectToRpcXML(name, args, alias, ns, (input.name !== "element"));
        (method.inputSoap === 'encoded') && (encoding = 'soap:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" ');
    }
    else {
        ok(!style || style === 'document', 'invalid message definition for rpc style binding');
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
        (self.bodyAttributes ? self.bodyAttributes.join(' ') : '') +
        (self.security && self.security.postProcess ? ' Id="_0"' : '') +
        ">" +
        message +
        "</" + envelopeKey + ":Body>" +
        "</" + envelopeKey + ":Envelope>";
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
    const eid = options.exchangeId || uuid4();
    // self.emit('message', message, eid);
    // self.emit('request', xml, eid);
    /** @type {?} */
    const tryJSONparse = (/**
     * @param {?} body
     * @return {?}
     */
    function (body) {
        try {
            return JSON.parse(body);
        }
        catch (err) {
            return undefined;
        }
    });
    //console.log('url:', location)
    return ((/** @type {?} */ (self.httpClient))).post(location, xml, {
        headers: headers,
        responseType: 'text', observe: 'response'
    }).pipe(map((/**
     * @param {?} response
     * @return {?}
     */
    (response) => {
        self.lastResponse = response.body;
        self.lastResponseHeaders = response && response.headers;
        // self.lastElapsedTime = response && response.elapsedTime;
        // self.emit('response', response.body, response, eid);
        //console.log('responce body before sync', response.body);
        return parseSync(response.body, response);
    })));
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
            //console.log('parsed body',obj);
        }
        catch (error) {
            //  When the output element cannot be looked up in the wsdl and the body is JSON
            //  instead of sending the error, we pass the body in the response.
            if (!output || !output.$lookupTypes) {
                // debug('Response element is not present. Unable to convert response xml to json.');
                //  If the response is JSON then return it as-is.
                /** @type {?} */
                const json = isObject(body) ? body : tryJSONparse(body);
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
            ['Response', 'Out', 'Output'].forEach((/**
             * @param {?} term
             * @return {?}
             */
            function (term) {
                if (obj.Body.hasOwnProperty(name + term)) {
                    return result = obj.Body[name + term];
                }
            }));
        }
        return { err: null, result, responseBody, header: obj.Header, xml };
    }
});
Client.prototype.call = (/**
 * @param {?} method
 * @param {?} body
 * @param {?=} options
 * @param {?=} extraHeaders
 * @return {?}
 */
function (method, body, options, extraHeaders) {
    if (!this[method]) {
        return throwError(`Method ${method} not found`);
    }
    return ((/** @type {?} */ (this[method]))).call(this, body, options, extraHeaders);
});

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const WSDL$1 = WSDL;
/** @type {?} */
const cache = {};
// TODO some caching?
/** @type {?} */
const getFromCache = (/**
 * @param {?} url
 * @param {?} options
 * @return {?}
 */
(url, options) => __awaiter(this, void 0, void 0, function* () {
    // console.log('Getting from cache', url);
    // console.log('Cache', cache)
    if (cache[url]) {
        // console.log('Found in cache', url);
        return cache[url];
    }
    else {
        return open_wsdl(url, options).then((/**
         * @param {?} wsdl
         * @return {?}
         */
        wsdl => {
            cache[url] = wsdl;
            return wsdl;
        }));
    }
}));
const ɵ0$1 = getFromCache;
/**
 * @param {?} url
 * @param {?} options
 * @return {?}
 */
function _requestWSDL(url, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (options.disableCache === true) {
            return open_wsdl(url, options);
        }
        else {
            return getFromCache(url, options);
        }
    });
}
/**
 * @param {?} url
 * @param {?} options
 * @param {?} endpoint
 * @return {?}
 */
function createClient(url, options, endpoint) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof options === 'undefined') {
            options = {};
        }
        // console.log("createClient", options)
        endpoint = options.endpoint || endpoint;
        /** @type {?} */
        const wsdl = yield _requestWSDL(url, options);
        /** @type {?} */
        const client = new Client(wsdl, endpoint, options);
        return client;
    });
}
/** @type {?} */
const BasicAuthSecurity$1 = security.BasicAuthSecurity;
/** @type {?} */
const NTLMSecurity$1 = security.NTLMSecurity;
/** @type {?} */
const WSSecurity$1 = security.WSSecurity;
// export const WSSecurityCert = security.WSSecurityCert;
/** @type {?} */
const BearerSecurity$1 = security.BearerSecurity;

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NgxSoapService {
    /**
     * @param {?} http
     */
    constructor(http) {
        this.http = http;
    }
    /**
     * @param {?} wsdlUrl
     * @param {?=} options
     * @param {?=} endpoint
     * @return {?}
     */
    createClient(wsdlUrl, options = {}, endpoint) {
        options.httpClient = this.http;
        return createClient(wsdlUrl, options, endpoint);
    }
}
NgxSoapService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
NgxSoapService.ctorParameters = () => [
    { type: HttpClient }
];
/** @nocollapse */ NgxSoapService.ngInjectableDef = ɵɵdefineInjectable({ factory: function NgxSoapService_Factory() { return new NgxSoapService(ɵɵinject(HttpClient)); }, token: NgxSoapService, providedIn: "root" });
if (false) {
    /**
     * @type {?}
     * @private
     */
    NgxSoapService.prototype.http;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NgxSoapModule {
}
NgxSoapModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    HttpClientModule
                ],
                exports: []
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { NgxSoapModule, NgxSoapService, security, BasicAuthSecurity as ɵa, BearerSecurity as ɵb, WSSecurity as ɵc, NTLMSecurity as ɵd };
//# sourceMappingURL=ngx-soap.js.map
