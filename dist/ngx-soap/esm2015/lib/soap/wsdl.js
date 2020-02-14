/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
/*
 * Copyright (c) 2011 Vinay Pulim <vinay@milewise.com>
 * MIT Licensed
 *
 */
/*jshint proto:true*/
"use strict";
import * as sax from 'sax';
import { NamespaceContext } from './nscontext';
import * as _ from 'lodash';
import * as utils from './utils';
import * as url from 'url';
import { ok as assert } from 'assert';
/** @type {?} */
const stripBom = (x) => {
    // Catches EFBBBF (UTF-8 BOM) because the buffer-to-string
    // conversion translates it to FEFF (UTF-16 BOM)
    if (x.charCodeAt(0) === 0xFEFF) {
        return x.slice(1);
    }
    return x;
};
const ɵ0 = stripBom;
/** @type {?} */
let TNS_PREFIX = utils.TNS_PREFIX;
/** @type {?} */
let findPrefix = utils.findPrefix;
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
    return i < 0 ? { prefix: TNS_PREFIX, name: nsName } :
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
    return _.mergeWith(destination || {}, source, function (a, b) {
        return _.isArray(a) ? a.concat(b) : undefined;
    });
}
/** @type {?} */
let Element = function (nsName, attrs, options) {
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
};
const ɵ1 = Element;
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
Element.prototype.allowedChildren = [];
Element.prototype.startElement = function (stack, nsName, attrs, options) {
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
};
Element.prototype.endElement = function (stack, nsName) {
    if (this.nsName === nsName) {
        if (stack.length < 2)
            return;
        /** @type {?} */
        let parent = stack[stack.length - 2];
        if (this !== stack[0]) {
            _.defaultsDeep(stack[0].xmlns, this.xmlns);
            // delete this.xmlns;
            parent.children.push(this);
            parent.addChild(this);
        }
        stack.pop();
    }
};
Element.prototype.addChild = function (child) {
    return;
};
Element.prototype.unexpected = function (name) {
    throw new Error('Found unexpected element (' + name + ') inside ' + this.nsName);
};
Element.prototype.description = function (definitions) {
    return this.$name || this.name;
};
Element.prototype.init = function () {
};
Element.createSubClass = function () {
    /** @type {?} */
    let root = this;
    /** @type {?} */
    let subElement = function () {
        root.apply(this, arguments);
        this.init();
    };
    // inherits(subElement, root);
    subElement.prototype.__proto__ = root.prototype;
    return subElement;
};
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
    types.forEach(function (type) {
        rtn[type.replace(/^_/, '')] = (ElementTypeMap[type] || [Element])[0];
    });
    return rtn;
}
for (let n in ElementTypeMap) {
    /** @type {?} */
    let v = ElementTypeMap[n];
    v[0].prototype.allowedChildren = mapElementTypes(v[1]);
}
MessageElement.prototype.init = function () {
    this.element = null;
    this.parts = null;
};
SchemaElement.prototype.init = function () {
    this.complexTypes = {};
    this.types = {};
    this.elements = {};
    this.includes = [];
};
TypesElement.prototype.init = function () {
    this.schemas = {};
};
OperationElement.prototype.init = function () {
    this.input = null;
    this.output = null;
    this.inputSoap = null;
    this.outputSoap = null;
    this.style = '';
    this.soapAction = '';
};
PortTypeElement.prototype.init = function () {
    this.methods = {};
};
BindingElement.prototype.init = function () {
    this.transport = '';
    this.style = '';
    this.methods = {};
};
PortElement.prototype.init = function () {
    this.location = null;
};
ServiceElement.prototype.init = function () {
    this.ports = {};
};
DefinitionsElement.prototype.init = function () {
    if (this.name !== 'definitions')
        this.unexpected(this.nsName);
    this.messages = {};
    this.portTypes = {};
    this.bindings = {};
    this.services = {};
    this.schemas = {};
};
DocumentationElement.prototype.init = function () {
};
SchemaElement.prototype.merge = function (source) {
    assert(source instanceof SchemaElement);
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
};
//fix#325
TypesElement.prototype.addChild = function (child) {
    assert(child instanceof SchemaElement);
    /** @type {?} */
    let targetNamespace = child.$targetNamespace;
    if (!this.schemas.hasOwnProperty(targetNamespace)) {
        this.schemas[targetNamespace] = child;
    }
    else {
        console.error('Target-Namespace "' + targetNamespace + '" already in use by another Schema!');
    }
};
InputElement.prototype.addChild = function (child) {
    if (child.name === 'body') {
        this.use = child.$use;
        if (this.use === 'encoded') {
            this.encodingStyle = child.$encodingStyle;
        }
        this.children.pop();
    }
};
OutputElement.prototype.addChild = function (child) {
    if (child.name === 'body') {
        this.use = child.$use;
        if (this.use === 'encoded') {
            this.encodingStyle = child.$encodingStyle;
        }
        this.children.pop();
    }
};
OperationElement.prototype.addChild = function (child) {
    if (child.name === 'operation') {
        this.soapAction = child.$soapAction || '';
        this.style = child.$style || '';
        this.children.pop();
    }
};
BindingElement.prototype.addChild = function (child) {
    if (child.name === 'binding') {
        this.transport = child.$transport;
        this.style = child.$style;
        this.children.pop();
    }
};
PortElement.prototype.addChild = function (child) {
    if (child.name === 'address' && typeof (child.$location) !== 'undefined') {
        this.location = child.$location;
    }
};
DefinitionsElement.prototype.addChild = function (child) {
    /** @type {?} */
    let self = this;
    if (child instanceof TypesElement) {
        // Merge types.schemas into definitions.schemas
        _.merge(self.schemas, child.schemas);
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
};
MessageElement.prototype.postProcess = function (definitions) {
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
                filter(function removeEmptyLookupTypes(type) {
                return type !== '^';
            });
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
            assert(part.name === 'part', 'Expected part element');
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
};
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
MessageElement.prototype._createLookupTypeObject = function (nsString, xmlns) {
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
};
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
MessageElement.prototype._getNestedLookupTypeString = function (element) {
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
        element.children.forEach(function (child) {
            /** @type {?} */
            let resolvedChildType = self._getNestedLookupTypeString(child).replace(/\^_/, '');
            if (resolvedChildType && typeof resolvedChildType === 'string') {
                resolvedType += ('_' + resolvedChildType);
            }
        });
    }
    return resolvedType;
};
OperationElement.prototype.postProcess = function (definitions, tag) {
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
};
PortTypeElement.prototype.postProcess = function (definitions) {
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
};
BindingElement.prototype.postProcess = function (definitions) {
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
};
ServiceElement.prototype.postProcess = function (definitions) {
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
};
SimpleTypeElement.prototype.description = function (definitions) {
    /** @type {?} */
    let children = this.children;
    for (let i = 0, child; child = children[i]; i++) {
        if (child instanceof RestrictionElement)
            return this.$name + "|" + child.description();
    }
    return {};
};
RestrictionElement.prototype.description = function (definitions, xmlns) {
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
        desc.getBase = function () {
            return typeElement.description(definitions, schema.xmlns);
        };
        return desc;
    }
    // then simple element
    /** @type {?} */
    let base = this.$base ? this.$base + "|" : "";
    return base + this.children.map(function (child) {
        return child.description();
    }).join(",");
};
ExtensionElement.prototype.description = function (definitions, xmlns) {
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
                desc = _.defaultsDeep(base, desc);
            }
        }
    }
    return desc;
};
EnumerationElement.prototype.description = function () {
    return this[this.valueKey];
};
ComplexTypeElement.prototype.description = function (definitions, xmlns) {
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
};
ComplexContentElement.prototype.description = function (definitions, xmlns) {
    /** @type {?} */
    let children = this.children;
    for (let i = 0, child; child = children[i]; i++) {
        if (child instanceof ExtensionElement) {
            return child.description(definitions, xmlns);
        }
    }
    return {};
};
SimpleContentElement.prototype.description = function (definitions, xmlns) {
    /** @type {?} */
    let children = this.children;
    for (let i = 0, child; child = children[i]; i++) {
        if (child instanceof ExtensionElement) {
            return child.description(definitions, xmlns);
        }
    }
    return {};
};
ElementElement.prototype.description = function (definitions, xmlns) {
    /** @type {?} */
    let element = {};
    /** @type {?} */
    let name = this.$name;
    /** @type {?} */
    let isMany = !this.$maxOccurs ? false : (isNaN(this.$maxOccurs) ? (this.$maxOccurs === 'unbounded') : (this.$maxOccurs > 1));
    if (this.$minOccurs !== this.$maxOccurs && isMany) {
        name += '[]';
    }
    if (xmlns && xmlns[TNS_PREFIX]) {
        this.$targetNamespace = xmlns[TNS_PREFIX];
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
};
AllElement.prototype.description =
    SequenceElement.prototype.description = function (definitions, xmlns) {
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
    };
ChoiceElement.prototype.description = function (definitions, xmlns) {
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
};
MessageElement.prototype.description = function (definitions) {
    if (this.element) {
        return this.element && this.element.description(definitions);
    }
    /** @type {?} */
    let desc = {};
    desc[this.$name] = this.parts;
    return desc;
};
PortTypeElement.prototype.description = function (definitions) {
    /** @type {?} */
    let methods = {};
    for (let name in this.methods) {
        /** @type {?} */
        let method = this.methods[name];
        methods[name] = method.description(definitions);
    }
    return methods;
};
OperationElement.prototype.description = function (definitions) {
    /** @type {?} */
    let inputDesc = this.input ? this.input.description(definitions) : null;
    /** @type {?} */
    let outputDesc = this.output ? this.output.description(definitions) : null;
    return {
        input: inputDesc && inputDesc[Object.keys(inputDesc)[0]],
        output: outputDesc && outputDesc[Object.keys(outputDesc)[0]]
    };
};
BindingElement.prototype.description = function (definitions) {
    /** @type {?} */
    let methods = {};
    for (let name in this.methods) {
        /** @type {?} */
        let method = this.methods[name];
        methods[name] = method.description(definitions);
    }
    return methods;
};
ServiceElement.prototype.description = function (definitions) {
    /** @type {?} */
    let ports = {};
    for (let name in this.ports) {
        /** @type {?} */
        let port = this.ports[name];
        ports[name] = port.binding.description(definitions);
    }
    return ports;
};
/** @type {?} */
export let WSDL = function (definition, uri, options) {
    /** @type {?} */
    let self = this;
    /** @type {?} */
    let fromFunc;
    this.uri = uri;
    this.callback = function () {
    };
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
    Promise.resolve(true).then(() => {
        try {
            fromFunc.call(self, definition);
        }
        catch (e) {
            return self.callback(e.message);
        }
        self.processIncludes().then(() => {
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
        }).catch(err => self.callback(err));
    });
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
};
WSDL.prototype.ignoredNamespaces = ['tns', 'targetNamespace', 'typedNamespace'];
WSDL.prototype.ignoreBaseNameSpaces = false;
WSDL.prototype.valueKey = '$value';
WSDL.prototype.xmlKey = '$xml';
WSDL.prototype._initializeOptions = function (options) {
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
};
WSDL.prototype.onReady = function (callback) {
    if (callback)
        this.callback = callback;
};
WSDL.prototype._processNextInclude = function (includes) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
            includePath = url.resolve(self.uri || '', include.location);
        }
        options = _.assign({}, this.options);
        // follow supplied ignoredNamespaces option
        options.ignoredNamespaces = this._originalIgnoredNamespaces || this.options.ignoredNamespaces;
        options.WSDL_CACHE = this.WSDL_CACHE;
        /** @type {?} */
        const wsdl = yield open_wsdl_recursive(includePath, options);
        self._includesWsdl.push(wsdl);
        if (wsdl.definitions instanceof DefinitionsElement) {
            _.mergeWith(self.definitions, wsdl.definitions, function (a, b) {
                return (a instanceof SchemaElement) ? a.merge(b) : undefined;
            });
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
};
WSDL.prototype.processIncludes = function () {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
};
WSDL.prototype.describeServices = function () {
    /** @type {?} */
    let services = {};
    for (let name in this.services) {
        /** @type {?} */
        let service = this.services[name];
        services[name] = service.description(this.definitions);
    }
    return services;
};
WSDL.prototype.toXML = function () {
    return this.xml || '';
};
WSDL.prototype.xmlToObject = function (xml, callback) {
    /** @type {?} */
    let self = this;
    /** @type {?} */
    let p = typeof callback === 'function' ? {} : sax.parser(true);
    /** @type {?} */
    let objectName = null;
    /** @type {?} */
    let root = {};
    /** @type {?} */
    let schema = {};
    /*let schema = {
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
    };*/
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
    /** @type {?} */
    let stack = [{ name: null, object: root, schema: schema }];
    /** @type {?} */
    let xmlns = {};
    /** @type {?} */
    let refs = {};
    /** @type {?} */
    let id;
    p.onopentag = function (node) {
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
            if (type.prefix === TNS_PREFIX) {
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
    };
    p.onclosetag = function (nsName) {
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
    };
    p.onerror = function (e) {
        p.resume();
        throw {
            Fault: {
                faultcode: 500,
                faultstring: 'Invalid XML',
                detail: new Error(e).message,
                statusCode: 500
            }
        };
    };
    p.ontext = function (text) {
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
    };
    if (typeof callback === 'function') {
        // we be streaming
        /** @type {?} */
        let saxStream = sax.createStream(true);
        saxStream.on('opentag', p.onopentag);
        saxStream.on('closetag', p.onclosetag);
        saxStream.on('cdata', p.oncdata);
        saxStream.on('text', p.ontext);
        xml.pipe(saxStream)
            .on('error', function (err) {
            callback(err);
        })
            .on('end', function () {
            /** @type {?} */
            let r;
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
    /**
     * @return {?}
     */
    function finish() {
        // MultiRef support: merge objects instead of replacing
        for (let n in refs) {
            /** @type {?} */
            let ref = refs[n];
            for (let i = 0; i < ref.hrefs.length; i++) {
                _.assign(ref.hrefs[i].obj, ref.obj);
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
                    /** @type {?} */
                    let error = new Error(code + ': ' + string + (detail ? ': ' + detail : ''));
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
};
/**
 * Look up a XSD type or element by namespace URI and name
 * @param {String} nsURI Namespace URI
 * @param {String} qname Local or qualified name
 * @returns {*} The XSD type/element definition
 */
WSDL.prototype.findSchemaObject = function (nsURI, qname) {
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
};
/**
 * Create RPC style xml string from the parameters
 * @param {String} name
 * @param {*} params
 * @param {String} nsPrefix
 * @param {String} nsURI
 * @returns {string}
 */
WSDL.prototype.objectToRpcXML = function (name, params, nsPrefix, nsURI, isParts) {
    /** @type {?} */
    let parts = [];
    /** @type {?} */
    let defs = this.definitions;
    /** @type {?} */
    let nsAttrName = '_xmlns';
    nsPrefix = nsPrefix || findPrefix(defs.xmlns, nsURI);
    nsURI = nsURI || defs.xmlns[nsPrefix];
    nsPrefix = nsPrefix === TNS_PREFIX ? '' : (nsPrefix + ':');
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
};
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
WSDL.prototype.isIgnoredNameSpace = function (ns) {
    return this.options.ignoredNamespaces.indexOf(ns) > -1;
};
WSDL.prototype.filterOutIgnoredNameSpace = function (ns) {
    /** @type {?} */
    let namespace = noColonNameSpace(ns);
    return this.isIgnoredNameSpace(namespace) ? '' : namespace;
};
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
WSDL.prototype.objectToXML = function (obj, name, nsPrefix, nsURI, isFirst, xmlnsAttr, schemaObject, nsContext) {
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
    let prefixNamespace = (nsPrefix || qualified) && nsPrefix !== TNS_PREFIX;
    /** @type {?} */
    let xmlnsAttrib = '';
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
};
WSDL.prototype.processAttributes = function (child, nsContext) {
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
};
/**
 * Look up a schema type definition
 * @param name
 * @param nsURI
 * @returns {*}
 */
WSDL.prototype.findSchemaType = function (name, nsURI) {
    if (!this.definitions.schemas || !name || !nsURI) {
        return null;
    }
    /** @type {?} */
    let schema = this.definitions.schemas[nsURI];
    if (!schema || !schema.complexTypes) {
        return null;
    }
    return schema.complexTypes[name];
};
WSDL.prototype.findChildSchemaObject = function (parameterTypeObj, childName, backtrace) {
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
        if (typeInfo.prefix === TNS_PREFIX) {
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
                let childNameSpace = baseQName.prefix === TNS_PREFIX ? '' : baseQName.prefix;
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
};
WSDL.prototype._parse = function (xml) {
    /** @type {?} */
    let self = this;
    /** @type {?} */
    let p = sax.parser(true);
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
    p.onopentag = function (node) {
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
    };
    p.onclosetag = function (name) {
        /** @type {?} */
        let top = stack[stack.length - 1];
        assert(top, 'Unmatched close tag: ' + name);
        top.endElement(stack, name);
    };
    p.write(xml).close();
    return root;
};
WSDL.prototype._fromXML = function (xml) {
    this.definitions = this._parse(xml);
    this.definitions.descriptions = {
        types: {}
    };
    this.xml = xml;
};
WSDL.prototype._fromServices = function (services) {
};
WSDL.prototype._xmlnsMap = function () {
    /** @type {?} */
    let xmlns = this.definitions.xmlns;
    /** @type {?} */
    let str = '';
    for (let alias in xmlns) {
        if (alias === '' || alias === TNS_PREFIX) {
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
};
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
export function open_wsdl(uri, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        /** @type {?} */
        const httpClient = options.httpClient;
        /** @type {?} */
        const wsdlDef = yield httpClient.get(uri, { responseType: 'text' }).toPromise();
        /** @type {?} */
        const wsdlObj = yield new Promise((resolve) => {
            /** @type {?} */
            const wsdl = new WSDL(wsdlDef, uri, options);
            WSDL_CACHE[uri] = wsdl;
            wsdl.WSDL_CACHE = WSDL_CACHE;
            wsdl.onReady(resolve(wsdl));
        });
        return wsdlObj;
    });
}
export { ɵ0, ɵ1 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3NkbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb2FwLyIsInNvdXJjZXMiOlsibGliL3NvYXAvd3NkbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQU9BLFlBQVksQ0FBQztBQUViLE9BQU8sS0FBSyxHQUFHLE1BQU0sS0FBSyxDQUFDO0FBRTNCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFPLGFBQWEsQ0FBQztBQUNoRCxPQUFPLEtBQUssQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEtBQUssS0FBSyxNQUFNLFNBQVMsQ0FBQztBQUNqQyxPQUFPLEtBQUssR0FBRyxNQUFNLEtBQUssQ0FBQztBQUMzQixPQUFPLEVBQUUsRUFBRSxJQUFJLE1BQU0sRUFBRSxNQUFNLFFBQVEsQ0FBQzs7TUFFaEMsUUFBUSxHQUFHLENBQUMsQ0FBUyxFQUFVLEVBQUU7SUFDckMsMERBQTBEO0lBQzFELGdEQUFnRDtJQUNoRCxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssTUFBTSxFQUFFO1FBQzlCLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNuQjtJQUVELE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQzs7O0lBS0csVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVOztJQUM3QixVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVU7O0lBRTdCLFVBQVUsR0FBRztJQUNmLE1BQU0sRUFBRSxDQUFDO0lBQ1QsT0FBTyxFQUFFLENBQUM7SUFDVixPQUFPLEVBQUUsQ0FBQztJQUNWLEtBQUssRUFBRSxDQUFDO0lBQ1IsTUFBTSxFQUFFLENBQUM7SUFDVCxPQUFPLEVBQUUsQ0FBQztJQUNWLElBQUksRUFBRSxDQUFDO0lBQ1AsR0FBRyxFQUFFLENBQUM7SUFDTixJQUFJLEVBQUUsQ0FBQztJQUNQLEtBQUssRUFBRSxDQUFDO0lBQ1IsZUFBZSxFQUFFLENBQUM7SUFDbEIsa0JBQWtCLEVBQUUsQ0FB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RyxFQUFFLE9BQU87O1FBQzFDLHVDQUF1QztRQUN2Qyx3QkFBd0I7UUFDeEIsa0JBQWtCO1FBQ2xCLElBQUk7Ozs7Ozs7WUFHQSxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsSUFBSSxFQUFFOztZQUNyQyxlQUFlLEdBQUcsT0FBTyxDQUFDLFlBQVk7O1lBQ3RDLGVBQWUsR0FBRyxPQUFPLENBQUMsWUFBWTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztjQW1DcEMsVUFBVSxHQUFlLE9BQU8sQ0FBQyxVQUFVOztjQUMzQyxPQUFPLEdBQUcsTUFBTSxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRTs7Y0FDekUsT0FBTyxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTs7a0JBQ3RDLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQztZQUM1QyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1lBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDO1FBQ0YsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxMSBWaW5heSBQdWxpbSA8dmluYXlAbWlsZXdpc2UuY29tPlxuICogTUlUIExpY2Vuc2VkXG4gKlxuICovXG4vKmpzaGludCBwcm90bzp0cnVlKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCAqIGFzIHNheCBmcm9tICdzYXgnO1xuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IE5hbWVzcGFjZUNvbnRleHQgfSDCoGZyb20gJy4vbnNjb250ZXh0JztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0ICogYXMgdXJsIGZyb20gJ3VybCc7XG5pbXBvcnQgeyBvayBhcyBhc3NlcnQgfSBmcm9tICdhc3NlcnQnO1xuXG5jb25zdCBzdHJpcEJvbSA9ICh4OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAvLyBDYXRjaGVzIEVGQkJCRiAoVVRGLTggQk9NKSBiZWNhdXNlIHRoZSBidWZmZXItdG8tc3RyaW5nXG4gIC8vIGNvbnZlcnNpb24gdHJhbnNsYXRlcyBpdCB0byBGRUZGIChVVEYtMTYgQk9NKVxuICBpZiAoeC5jaGFyQ29kZUF0KDApID09PSAweEZFRkYpIHtcbiAgICByZXR1cm4geC5zbGljZSgxKTtcbiAgfVxuXG4gIHJldHVybiB4O1xufVxuXG5cblxuXG5sZXQgVE5TX1BSRUZJWCA9IHV0aWxzLlROU19QUkVGSVg7XG5sZXQgZmluZFByZWZpeCA9IHV0aWxzLmZpbmRQcmVmaXg7XG5cbmxldCBQcmltaXRpdmVzID0ge1xuICBzdHJpbmc6IDEsXG4gIGJvb2xlYW46IDEsXG4gIGRlY2ltYWw6IDEsXG4gIGZsb2F0OiAxLFxuICBkb3VibGU6IDEsXG4gIGFueVR5cGU6IDEsXG4gIGJ5dGU6IDEsXG4gIGludDogMSxcbiAgbG9uZzogMSxcbiAgc2hvcnQ6IDEsXG4gIG5lZ2F0aXZlSW50ZWdlcjogMSxcbiAgbm9uTmVnYXRpdmVJbnRlZ2VyOiAxLFxuICBwb3NpdGl2ZUludGVnZXI6IDEsXG4gIG5vblBvc2l0aXZlSW50ZWdlcjogMSxcbiAgdW5zaWduZWRCeXRlOiAxLFxuICB1bnNpZ25lZEludDogMSxcbiAgdW5zaWduZWRMb25nOiAxLFxuICB1bnNpZ25lZFNob3J0OiAxLFxuICBkdXJhdGlvbjogMCxcbiAgZGF0ZVRpbWU6IDAsXG4gIHRpbWU6IDAsXG4gIGRhdGU6IDAsXG4gIGdZZWFyTW9udGg6IDAsXG4gIGdZZWFyOiAwLFxuICBnTW9udGhEYXk6IDAsXG4gIGdEYXk6IDAsXG4gIGdNb250aDogMCxcbiAgaGV4QmluYXJ5OiAwLFxuICBiYXNlNjRCaW5hcnk6IDAsXG4gIGFueVVSSTogMCxcbiAgUU5hbWU6IDAsXG4gIE5PVEFUSU9OOiAwXG59O1xuXG5mdW5jdGlvbiBzcGxpdFFOYW1lKG5zTmFtZSkge1xuICBsZXQgaSA9IHR5cGVvZiBuc05hbWUgPT09ICdzdHJpbmcnID8gbnNOYW1lLmluZGV4T2YoJzonKSA6IC0xO1xuICByZXR1cm4gaSA8IDAgPyB7IHByZWZpeDogVE5TX1BSRUZJWCwgbmFtZTogbnNOYW1lIH0gOlxuICAgIHsgcHJlZml4OiBuc05hbWUuc3Vic3RyaW5nKDAsIGkpLCBuYW1lOiBuc05hbWUuc3Vic3RyaW5nKGkgKyAxKSB9O1xufVxuXG5mdW5jdGlvbiB4bWxFc2NhcGUob2JqKSB7XG4gIGlmICh0eXBlb2YgKG9iaikgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKG9iai5zdWJzdHIoMCwgOSkgPT09ICc8IVtDREFUQVsnICYmIG9iai5zdWJzdHIoLTMpID09PSBcIl1dPlwiKSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICByZXR1cm4gb2JqXG4gICAgICAucmVwbGFjZSgvJi9nLCAnJmFtcDsnKVxuICAgICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKVxuICAgICAgLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKVxuICAgICAgLnJlcGxhY2UoLycvZywgJyZhcG9zOycpO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxubGV0IHRyaW1MZWZ0ID0gL15bXFxzXFx4QTBdKy87XG5sZXQgdHJpbVJpZ2h0ID0gL1tcXHNcXHhBMF0rJC87XG5cbmZ1bmN0aW9uIHRyaW0odGV4dCkge1xuICByZXR1cm4gdGV4dC5yZXBsYWNlKHRyaW1MZWZ0LCAnJykucmVwbGFjZSh0cmltUmlnaHQsICcnKTtcbn1cblxuZnVuY3Rpb24gZGVlcE1lcmdlKGRlc3RpbmF0aW9uLCBzb3VyY2UpIHtcbiAgcmV0dXJuIF8ubWVyZ2VXaXRoKGRlc3RpbmF0aW9uIHx8IHt9LCBzb3VyY2UsIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIF8uaXNBcnJheShhKSA/IGEuY29uY2F0KGIpIDogdW5kZWZpbmVkO1xuICB9KTtcbn1cblxubGV0IEVsZW1lbnQ6IGFueSA9IGZ1bmN0aW9uIChuc05hbWUsIGF0dHJzLCBvcHRpb25zKSB7XG4gIGxldCBwYXJ0cyA9IHNwbGl0UU5hbWUobnNOYW1lKTtcblxuICB0aGlzLm5zTmFtZSA9IG5zTmFtZTtcbiAgdGhpcy5wcmVmaXggPSBwYXJ0cy5wcmVmaXg7XG4gIHRoaXMubmFtZSA9IHBhcnRzLm5hbWU7XG4gIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgdGhpcy54bWxucyA9IHt9O1xuXG4gIHRoaXMuX2luaXRpYWxpemVPcHRpb25zKG9wdGlvbnMpO1xuXG4gIGZvciAobGV0IGtleSBpbiBhdHRycykge1xuICAgIGxldCBtYXRjaCA9IC9eeG1sbnM6PyguKikkLy5leGVjKGtleSk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICB0aGlzLnhtbG5zW21hdGNoWzFdID8gbWF0Y2hbMV0gOiBUTlNfUFJFRklYXSA9IGF0dHJzW2tleV07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYgKGtleSA9PT0gJ3ZhbHVlJykge1xuICAgICAgICB0aGlzW3RoaXMudmFsdWVLZXldID0gYXR0cnNba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNbJyQnICsga2V5XSA9IGF0dHJzW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmICh0aGlzLiR0YXJnZXROYW1lc3BhY2UgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIEFkZCB0YXJnZXROYW1lc3BhY2UgdG8gdGhlIG1hcHBpbmdcbiAgICB0aGlzLnhtbG5zW1ROU19QUkVGSVhdID0gdGhpcy4kdGFyZ2V0TmFtZXNwYWNlO1xuICB9XG59O1xuXG5FbGVtZW50LnByb3RvdHlwZS5faW5pdGlhbGl6ZU9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICBpZiAob3B0aW9ucykge1xuICAgIHRoaXMudmFsdWVLZXkgPSBvcHRpb25zLnZhbHVlS2V5IHx8ICckdmFsdWUnO1xuICAgIHRoaXMueG1sS2V5ID0gb3B0aW9ucy54bWxLZXkgfHwgJyR4bWwnO1xuICAgIHRoaXMuaWdub3JlZE5hbWVzcGFjZXMgPSBvcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzIHx8IFtdO1xuICB9IGVsc2Uge1xuICAgIHRoaXMudmFsdWVLZXkgPSAnJHZhbHVlJztcbiAgICB0aGlzLnhtbEtleSA9ICckeG1sJztcbiAgICB0aGlzLmlnbm9yZWROYW1lc3BhY2VzID0gW107XG4gIH1cbn07XG5cbkVsZW1lbnQucHJvdG90eXBlLmRlbGV0ZUZpeGVkQXR0cnMgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuY2hpbGRyZW4gJiYgdGhpcy5jaGlsZHJlbi5sZW5ndGggPT09IDAgJiYgZGVsZXRlIHRoaXMuY2hpbGRyZW47XG4gIHRoaXMueG1sbnMgJiYgT2JqZWN0LmtleXModGhpcy54bWxucykubGVuZ3RoID09PSAwICYmIGRlbGV0ZSB0aGlzLnhtbG5zO1xuICBkZWxldGUgdGhpcy5uc05hbWU7XG4gIGRlbGV0ZSB0aGlzLnByZWZpeDtcbiAgZGVsZXRlIHRoaXMubmFtZTtcbn07XG5cbkVsZW1lbnQucHJvdG90eXBlLmFsbG93ZWRDaGlsZHJlbiA9IFtdO1xuXG5FbGVtZW50LnByb3RvdHlwZS5zdGFydEVsZW1lbnQgPSBmdW5jdGlvbiAoc3RhY2ssIG5zTmFtZSwgYXR0cnMsIG9wdGlvbnMpIHtcbiAgaWYgKCF0aGlzLmFsbG93ZWRDaGlsZHJlbikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCBDaGlsZENsYXNzID0gdGhpcy5hbGxvd2VkQ2hpbGRyZW5bc3BsaXRRTmFtZShuc05hbWUpLm5hbWVdLFxuICAgIGVsZW1lbnQgPSBudWxsO1xuXG4gIGlmIChDaGlsZENsYXNzKSB7XG4gICAgc3RhY2sucHVzaChuZXcgQ2hpbGRDbGFzcyhuc05hbWUsIGF0dHJzLCBvcHRpb25zKSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdGhpcy51bmV4cGVjdGVkKG5zTmFtZSk7XG4gIH1cblxufTtcblxuRWxlbWVudC5wcm90b3R5cGUuZW5kRWxlbWVudCA9IGZ1bmN0aW9uIChzdGFjaywgbnNOYW1lKSB7XG4gIGlmICh0aGlzLm5zTmFtZSA9PT0gbnNOYW1lKSB7XG4gICAgaWYgKHN0YWNrLmxlbmd0aCA8IDIpXG4gICAgICByZXR1cm47XG4gICAgbGV0IHBhcmVudCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDJdO1xuICAgIGlmICh0aGlzICE9PSBzdGFja1swXSkge1xuICAgICAgXy5kZWZhdWx0c0RlZXAoc3RhY2tbMF0ueG1sbnMsIHRoaXMueG1sbnMpO1xuICAgICAgLy8gZGVsZXRlIHRoaXMueG1sbnM7XG4gICAgICBwYXJlbnQuY2hpbGRyZW4ucHVzaCh0aGlzKTtcbiAgICAgIHBhcmVudC5hZGRDaGlsZCh0aGlzKTtcbiAgICB9XG4gICAgc3RhY2sucG9wKCk7XG4gIH1cbn07XG5cbkVsZW1lbnQucHJvdG90eXBlLmFkZENoaWxkID0gZnVuY3Rpb24gKGNoaWxkKSB7XG4gIHJldHVybjtcbn07XG5cbkVsZW1lbnQucHJvdG90eXBlLnVuZXhwZWN0ZWQgPSBmdW5jdGlvbiAobmFtZSkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ0ZvdW5kIHVuZXhwZWN0ZWQgZWxlbWVudCAoJyArIG5hbWUgKyAnKSBpbnNpZGUgJyArIHRoaXMubnNOYW1lKTtcbn07XG5cbkVsZW1lbnQucHJvdG90eXBlLmRlc2NyaXB0aW9uID0gZnVuY3Rpb24gKGRlZmluaXRpb25zKSB7XG4gIHJldHVybiB0aGlzLiRuYW1lIHx8IHRoaXMubmFtZTtcbn07XG5cbkVsZW1lbnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG59O1xuXG5FbGVtZW50LmNyZWF0ZVN1YkNsYXNzID0gZnVuY3Rpb24gKCkge1xuICBsZXQgcm9vdCA9IHRoaXM7XG4gIGxldCBzdWJFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHJvb3QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfTtcbiAgLy8gaW5oZXJpdHMoc3ViRWxlbWVudCwgcm9vdCk7XG4gIHN1YkVsZW1lbnQucHJvdG90eXBlLl9fcHJvdG9fXyA9IHJvb3QucHJvdG90eXBlO1xuICByZXR1cm4gc3ViRWxlbWVudDtcbn07XG5cblxubGV0IEVsZW1lbnRFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IEFueUVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XG5sZXQgSW5wdXRFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IE91dHB1dEVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XG5sZXQgU2ltcGxlVHlwZUVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XG5sZXQgUmVzdHJpY3Rpb25FbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IEV4dGVuc2lvbkVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XG5sZXQgQ2hvaWNlRWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcbmxldCBFbnVtZXJhdGlvbkVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XG5sZXQgQ29tcGxleFR5cGVFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IENvbXBsZXhDb250ZW50RWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcbmxldCBTaW1wbGVDb250ZW50RWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcbmxldCBTZXF1ZW5jZUVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XG5sZXQgQWxsRWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcbmxldCBNZXNzYWdlRWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcbmxldCBEb2N1bWVudGF0aW9uRWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcblxubGV0IFNjaGVtYUVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XG5sZXQgVHlwZXNFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IE9wZXJhdGlvbkVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XG5sZXQgUG9ydFR5cGVFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IEJpbmRpbmdFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IFBvcnRFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IFNlcnZpY2VFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IERlZmluaXRpb25zRWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcblxubGV0IEVsZW1lbnRUeXBlTWFwID0ge1xuICB0eXBlczogW1R5cGVzRWxlbWVudCwgJ3NjaGVtYSBkb2N1bWVudGF0aW9uJ10sXG4gIHNjaGVtYTogW1NjaGVtYUVsZW1lbnQsICdlbGVtZW50IGNvbXBsZXhUeXBlIHNpbXBsZVR5cGUgaW5jbHVkZSBpbXBvcnQnXSxcbiAgZWxlbWVudDogW0VsZW1lbnRFbGVtZW50LCAnYW5ub3RhdGlvbiBjb21wbGV4VHlwZSddLFxuICBhbnk6IFtBbnlFbGVtZW50LCAnJ10sXG4gIHNpbXBsZVR5cGU6IFtTaW1wbGVUeXBlRWxlbWVudCwgJ3Jlc3RyaWN0aW9uJ10sXG4gIHJlc3RyaWN0aW9uOiBbUmVzdHJpY3Rpb25FbGVtZW50LCAnZW51bWVyYXRpb24gYWxsIGNob2ljZSBzZXF1ZW5jZSddLFxuICBleHRlbnNpb246IFtFeHRlbnNpb25FbGVtZW50LCAnYWxsIHNlcXVlbmNlIGNob2ljZSddLFxuICBjaG9pY2U6IFtDaG9pY2VFbGVtZW50LCAnZWxlbWVudCBzZXF1ZW5jZSBjaG9pY2UgYW55J10sXG4gIC8vIGdyb3VwOiBbR3JvdXBFbGVtZW50LCAnZWxlbWVudCBncm91cCddLFxuICBlbnVtZXJhdGlvbjogW0VudW1lcmF0aW9uRWxlbWVudCwgJyddLFxuICBjb21wbGV4VHlwZTogW0NvbXBsZXhUeXBlRWxlbWVudCwgJ2Fubm90YXRpb24gc2VxdWVuY2UgYWxsIGNvbXBsZXhDb250ZW50IHNpbXBsZUNvbnRlbnQgY2hvaWNlJ10sXG4gIGNvbXBsZXhDb250ZW50OiBbQ29tcGxleENvbnRlbnRFbGVtZW50LCAnZXh0ZW5zaW9uJ10sXG4gIHNpbXBsZUNvbnRlbnQ6IFtTaW1wbGVDb250ZW50RWxlbWVudCwgJ2V4dGVuc2lvbiddLFxuICBzZXF1ZW5jZTogW1NlcXVlbmNlRWxlbWVudCwgJ2VsZW1lbnQgc2VxdWVuY2UgY2hvaWNlIGFueSddLFxuICBhbGw6IFtBbGxFbGVtZW50LCAnZWxlbWVudCBjaG9pY2UnXSxcblxuICBzZXJ2aWNlOiBbU2VydmljZUVsZW1lbnQsICdwb3J0IGRvY3VtZW50YXRpb24nXSxcbiAgcG9ydDogW1BvcnRFbGVtZW50LCAnYWRkcmVzcyBkb2N1bWVudGF0aW9uJ10sXG4gIGJpbmRpbmc6IFtCaW5kaW5nRWxlbWVudCwgJ19iaW5kaW5nIFNlY3VyaXR5U3BlYyBvcGVyYXRpb24gZG9jdW1lbnRhdGlvbiddLFxuICBwb3J0VHlwZTogW1BvcnRUeXBlRWxlbWVudCwgJ29wZXJhdGlvbiBkb2N1bWVudGF0aW9uJ10sXG4gIG1lc3NhZ2U6IFtNZXNzYWdlRWxlbWVudCwgJ3BhcnQgZG9jdW1lbnRhdGlvbiddLFxuICBvcGVyYXRpb246IFtPcGVyYXRpb25FbGVtZW50LCAnZG9jdW1lbnRhdGlvbiBpbnB1dCBvdXRwdXQgZmF1bHQgX29wZXJhdGlvbiddLFxuICBpbnB1dDogW0lucHV0RWxlbWVudCwgJ2JvZHkgU2VjdXJpdHlTcGVjUmVmIGRvY3VtZW50YXRpb24gaGVhZGVyJ10sXG4gIG91dHB1dDogW091dHB1dEVsZW1lbnQsICdib2R5IFNlY3VyaXR5U3BlY1JlZiBkb2N1bWVudGF0aW9uIGhlYWRlciddLFxuICBmYXVsdDogW0VsZW1lbnQsICdfZmF1bHQgZG9jdW1lbnRhdGlvbiddLFxuICBkZWZpbml0aW9uczogW0RlZmluaXRpb25zRWxlbWVudCwgJ3R5cGVzIG1lc3NhZ2UgcG9ydFR5cGUgYmluZGluZyBzZXJ2aWNlIGltcG9ydCBkb2N1bWVudGF0aW9uJ10sXG4gIGRvY3VtZW50YXRpb246IFtEb2N1bWVudGF0aW9uRWxlbWVudCwgJyddXG59O1xuXG5mdW5jdGlvbiBtYXBFbGVtZW50VHlwZXModHlwZXMpIHtcbiAgbGV0IHJ0biA9IHt9O1xuICB0eXBlcyA9IHR5cGVzLnNwbGl0KCcgJyk7XG4gIHR5cGVzLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcbiAgICBydG5bdHlwZS5yZXBsYWNlKC9eXy8sICcnKV0gPSAoRWxlbWVudFR5cGVNYXBbdHlwZV0gfHwgW0VsZW1lbnRdKVswXTtcbiAgfSk7XG4gIHJldHVybiBydG47XG59XG5cbmZvciAobGV0IG4gaW4gRWxlbWVudFR5cGVNYXApIHtcbiAgbGV0IHYgPSBFbGVtZW50VHlwZU1hcFtuXTtcbiAgdlswXS5wcm90b3R5cGUuYWxsb3dlZENoaWxkcmVuID0gbWFwRWxlbWVudFR5cGVzKHZbMV0pO1xufVxuXG5NZXNzYWdlRWxlbWVudC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5lbGVtZW50ID0gbnVsbDtcbiAgdGhpcy5wYXJ0cyA9IG51bGw7XG59O1xuXG5TY2hlbWFFbGVtZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmNvbXBsZXhUeXBlcyA9IHt9O1xuICB0aGlzLnR5cGVzID0ge307XG4gIHRoaXMuZWxlbWVudHMgPSB7fTtcbiAgdGhpcy5pbmNsdWRlcyA9IFtdO1xufTtcblxuVHlwZXNFbGVtZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLnNjaGVtYXMgPSB7fTtcbn07XG5cbk9wZXJhdGlvbkVsZW1lbnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuaW5wdXQgPSBudWxsO1xuICB0aGlzLm91dHB1dCA9IG51bGw7XG4gIHRoaXMuaW5wdXRTb2FwID0gbnVsbDtcbiAgdGhpcy5vdXRwdXRTb2FwID0gbnVsbDtcbiAgdGhpcy5zdHlsZSA9ICcnO1xuICB0aGlzLnNvYXBBY3Rpb24gPSAnJztcbn07XG5cblBvcnRUeXBlRWxlbWVudC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5tZXRob2RzID0ge307XG59O1xuXG5CaW5kaW5nRWxlbWVudC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy50cmFuc3BvcnQgPSAnJztcbiAgdGhpcy5zdHlsZSA9ICcnO1xuICB0aGlzLm1ldGhvZHMgPSB7fTtcbn07XG5cblBvcnRFbGVtZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmxvY2F0aW9uID0gbnVsbDtcbn07XG5cblNlcnZpY2VFbGVtZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLnBvcnRzID0ge307XG59O1xuXG5EZWZpbml0aW9uc0VsZW1lbnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLm5hbWUgIT09ICdkZWZpbml0aW9ucycpIHRoaXMudW5leHBlY3RlZCh0aGlzLm5zTmFtZSk7XG4gIHRoaXMubWVzc2FnZXMgPSB7fTtcbiAgdGhpcy5wb3J0VHlwZXMgPSB7fTtcbiAgdGhpcy5iaW5kaW5ncyA9IHt9O1xuICB0aGlzLnNlcnZpY2VzID0ge307XG4gIHRoaXMuc2NoZW1hcyA9IHt9O1xufTtcblxuRG9jdW1lbnRhdGlvbkVsZW1lbnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG59O1xuXG5TY2hlbWFFbGVtZW50LnByb3RvdHlwZS5tZXJnZSA9IGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgYXNzZXJ0KHNvdXJjZSBpbnN0YW5jZW9mIFNjaGVtYUVsZW1lbnQpO1xuICBpZiAodGhpcy4kdGFyZ2V0TmFtZXNwYWNlID09PSBzb3VyY2UuJHRhcmdldE5hbWVzcGFjZSkge1xuICAgIF8ubWVyZ2UodGhpcy5jb21wbGV4VHlwZXMsIHNvdXJjZS5jb21wbGV4VHlwZXMpO1xuICAgIF8ubWVyZ2UodGhpcy50eXBlcywgc291cmNlLnR5cGVzKTtcbiAgICBfLm1lcmdlKHRoaXMuZWxlbWVudHMsIHNvdXJjZS5lbGVtZW50cyk7XG4gICAgXy5tZXJnZSh0aGlzLnhtbG5zLCBzb3VyY2UueG1sbnMpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG5TY2hlbWFFbGVtZW50LnByb3RvdHlwZS5hZGRDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZCkge1xuICBpZiAoY2hpbGQuJG5hbWUgaW4gUHJpbWl0aXZlcylcbiAgICByZXR1cm47XG4gIGlmIChjaGlsZC5uYW1lID09PSAnaW5jbHVkZScgfHwgY2hpbGQubmFtZSA9PT0gJ2ltcG9ydCcpIHtcbiAgICBsZXQgbG9jYXRpb24gPSBjaGlsZC4kc2NoZW1hTG9jYXRpb24gfHwgY2hpbGQuJGxvY2F0aW9uO1xuICAgIGlmIChsb2NhdGlvbikge1xuICAgICAgdGhpcy5pbmNsdWRlcy5wdXNoKHtcbiAgICAgICAgbmFtZXNwYWNlOiBjaGlsZC4kbmFtZXNwYWNlIHx8IGNoaWxkLiR0YXJnZXROYW1lc3BhY2UgfHwgdGhpcy4kdGFyZ2V0TmFtZXNwYWNlLFxuICAgICAgICBsb2NhdGlvbjogbG9jYXRpb25cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBlbHNlIGlmIChjaGlsZC5uYW1lID09PSAnY29tcGxleFR5cGUnKSB7XG4gICAgdGhpcy5jb21wbGV4VHlwZXNbY2hpbGQuJG5hbWVdID0gY2hpbGQ7XG4gIH1cbiAgZWxzZSBpZiAoY2hpbGQubmFtZSA9PT0gJ2VsZW1lbnQnKSB7XG4gICAgdGhpcy5lbGVtZW50c1tjaGlsZC4kbmFtZV0gPSBjaGlsZDtcbiAgfVxuICBlbHNlIGlmIChjaGlsZC4kbmFtZSkge1xuICAgIHRoaXMudHlwZXNbY2hpbGQuJG5hbWVdID0gY2hpbGQ7XG4gIH1cbiAgdGhpcy5jaGlsZHJlbi5wb3AoKTtcbiAgLy8gY2hpbGQuZGVsZXRlRml4ZWRBdHRycygpO1xufTtcbi8vZml4IzMyNVxuVHlwZXNFbGVtZW50LnByb3RvdHlwZS5hZGRDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZCkge1xuICBhc3NlcnQoY2hpbGQgaW5zdGFuY2VvZiBTY2hlbWFFbGVtZW50KTtcblxuICBsZXQgdGFyZ2V0TmFtZXNwYWNlID0gY2hpbGQuJHRhcmdldE5hbWVzcGFjZTtcblxuICBpZiAoIXRoaXMuc2NoZW1hcy5oYXNPd25Qcm9wZXJ0eSh0YXJnZXROYW1lc3BhY2UpKSB7XG4gICAgdGhpcy5zY2hlbWFzW3RhcmdldE5hbWVzcGFjZV0gPSBjaGlsZDtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmVycm9yKCdUYXJnZXQtTmFtZXNwYWNlIFwiJyArIHRhcmdldE5hbWVzcGFjZSArICdcIiBhbHJlYWR5IGluIHVzZSBieSBhbm90aGVyIFNjaGVtYSEnKTtcbiAgfVxufTtcblxuSW5wdXRFbGVtZW50LnByb3RvdHlwZS5hZGRDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZCkge1xuICBpZiAoY2hpbGQubmFtZSA9PT0gJ2JvZHknKSB7XG4gICAgdGhpcy51c2UgPSBjaGlsZC4kdXNlO1xuICAgIGlmICh0aGlzLnVzZSA9PT0gJ2VuY29kZWQnKSB7XG4gICAgICB0aGlzLmVuY29kaW5nU3R5bGUgPSBjaGlsZC4kZW5jb2RpbmdTdHlsZTtcbiAgICB9XG4gICAgdGhpcy5jaGlsZHJlbi5wb3AoKTtcbiAgfVxufTtcblxuT3V0cHV0RWxlbWVudC5wcm90b3R5cGUuYWRkQ2hpbGQgPSBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgaWYgKGNoaWxkLm5hbWUgPT09ICdib2R5Jykge1xuICAgIHRoaXMudXNlID0gY2hpbGQuJHVzZTtcbiAgICBpZiAodGhpcy51c2UgPT09ICdlbmNvZGVkJykge1xuICAgICAgdGhpcy5lbmNvZGluZ1N0eWxlID0gY2hpbGQuJGVuY29kaW5nU3R5bGU7XG4gICAgfVxuICAgIHRoaXMuY2hpbGRyZW4ucG9wKCk7XG4gIH1cbn07XG5cbk9wZXJhdGlvbkVsZW1lbnQucHJvdG90eXBlLmFkZENoaWxkID0gZnVuY3Rpb24gKGNoaWxkKSB7XG4gIGlmIChjaGlsZC5uYW1lID09PSAnb3BlcmF0aW9uJykge1xuICAgIHRoaXMuc29hcEFjdGlvbiA9IGNoaWxkLiRzb2FwQWN0aW9uIHx8ICcnO1xuICAgIHRoaXMuc3R5bGUgPSBjaGlsZC4kc3R5bGUgfHwgJyc7XG4gICAgdGhpcy5jaGlsZHJlbi5wb3AoKTtcbiAgfVxufTtcblxuQmluZGluZ0VsZW1lbnQucHJvdG90eXBlLmFkZENoaWxkID0gZnVuY3Rpb24gKGNoaWxkKSB7XG4gIGlmIChjaGlsZC5uYW1lID09PSAnYmluZGluZycpIHtcbiAgICB0aGlzLnRyYW5zcG9ydCA9IGNoaWxkLiR0cmFuc3BvcnQ7XG4gICAgdGhpcy5zdHlsZSA9IGNoaWxkLiRzdHlsZTtcbiAgICB0aGlzLmNoaWxkcmVuLnBvcCgpO1xuICB9XG59O1xuXG5Qb3J0RWxlbWVudC5wcm90b3R5cGUuYWRkQ2hpbGQgPSBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgaWYgKGNoaWxkLm5hbWUgPT09ICdhZGRyZXNzJyAmJiB0eXBlb2YgKGNoaWxkLiRsb2NhdGlvbikgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgdGhpcy5sb2NhdGlvbiA9IGNoaWxkLiRsb2NhdGlvbjtcbiAgfVxufTtcblxuRGVmaW5pdGlvbnNFbGVtZW50LnByb3RvdHlwZS5hZGRDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZCkge1xuICBsZXQgc2VsZiA9IHRoaXM7XG4gIGlmIChjaGlsZCBpbnN0YW5jZW9mIFR5cGVzRWxlbWVudCkge1xuICAgIC8vIE1lcmdlIHR5cGVzLnNjaGVtYXMgaW50byBkZWZpbml0aW9ucy5zY2hlbWFzXG4gICAgXy5tZXJnZShzZWxmLnNjaGVtYXMsIGNoaWxkLnNjaGVtYXMpO1xuICB9XG4gIGVsc2UgaWYgKGNoaWxkIGluc3RhbmNlb2YgTWVzc2FnZUVsZW1lbnQpIHtcbiAgICBzZWxmLm1lc3NhZ2VzW2NoaWxkLiRuYW1lXSA9IGNoaWxkO1xuICB9XG4gIGVsc2UgaWYgKGNoaWxkLm5hbWUgPT09ICdpbXBvcnQnKSB7XG4gICAgc2VsZi5zY2hlbWFzW2NoaWxkLiRuYW1lc3BhY2VdID0gbmV3IFNjaGVtYUVsZW1lbnQoY2hpbGQuJG5hbWVzcGFjZSwge30pO1xuICAgIHNlbGYuc2NoZW1hc1tjaGlsZC4kbmFtZXNwYWNlXS5hZGRDaGlsZChjaGlsZCk7XG4gIH1cbiAgZWxzZSBpZiAoY2hpbGQgaW5zdGFuY2VvZiBQb3J0VHlwZUVsZW1lbnQpIHtcbiAgICBzZWxmLnBvcnRUeXBlc1tjaGlsZC4kbmFtZV0gPSBjaGlsZDtcbiAgfVxuICBlbHNlIGlmIChjaGlsZCBpbnN0YW5jZW9mIEJpbmRpbmdFbGVtZW50KSB7XG4gICAgaWYgKGNoaWxkLnRyYW5zcG9ydCA9PT0gJ2h0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3NvYXAvaHR0cCcgfHxcbiAgICAgIGNoaWxkLnRyYW5zcG9ydCA9PT0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDMvMDUvc29hcC9iaW5kaW5ncy9IVFRQLycpXG4gICAgICBzZWxmLmJpbmRpbmdzW2NoaWxkLiRuYW1lXSA9IGNoaWxkO1xuICB9XG4gIGVsc2UgaWYgKGNoaWxkIGluc3RhbmNlb2YgU2VydmljZUVsZW1lbnQpIHtcbiAgICBzZWxmLnNlcnZpY2VzW2NoaWxkLiRuYW1lXSA9IGNoaWxkO1xuICB9XG4gIGVsc2UgaWYgKGNoaWxkIGluc3RhbmNlb2YgRG9jdW1lbnRhdGlvbkVsZW1lbnQpIHtcbiAgfVxuICB0aGlzLmNoaWxkcmVuLnBvcCgpO1xufTtcblxuTWVzc2FnZUVsZW1lbnQucHJvdG90eXBlLnBvc3RQcm9jZXNzID0gZnVuY3Rpb24gKGRlZmluaXRpb25zKSB7XG4gIGxldCBwYXJ0ID0gbnVsbDtcbiAgbGV0IGNoaWxkID0gdW5kZWZpbmVkO1xuICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuIHx8IFtdO1xuICBsZXQgbnMgPSB1bmRlZmluZWQ7XG4gIGxldCBuc05hbWUgPSB1bmRlZmluZWQ7XG4gIGxldCBpID0gdW5kZWZpbmVkO1xuICBsZXQgdHlwZSA9IHVuZGVmaW5lZDtcblxuICBmb3IgKGkgaW4gY2hpbGRyZW4pIHtcbiAgICBpZiAoKGNoaWxkID0gY2hpbGRyZW5baV0pLm5hbWUgPT09ICdwYXJ0Jykge1xuICAgICAgcGFydCA9IGNoaWxkO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFwYXJ0KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHBhcnQuJGVsZW1lbnQpIHtcbiAgICBsZXQgbG9va3VwVHlwZXMgPSBbXSxcbiAgICAgIGVsZW1lbnRDaGlsZHJlbjtcblxuICAgIGRlbGV0ZSB0aGlzLnBhcnRzO1xuXG4gICAgbnNOYW1lID0gc3BsaXRRTmFtZShwYXJ0LiRlbGVtZW50KTtcbiAgICBucyA9IG5zTmFtZS5wcmVmaXg7XG4gICAgbGV0IHNjaGVtYSA9IGRlZmluaXRpb25zLnNjaGVtYXNbZGVmaW5pdGlvbnMueG1sbnNbbnNdXTtcbiAgICB0aGlzLmVsZW1lbnQgPSBzY2hlbWEuZWxlbWVudHNbbnNOYW1lLm5hbWVdO1xuICAgIGlmICghdGhpcy5lbGVtZW50KSB7XG4gICAgICAvLyBkZWJ1Zyhuc05hbWUubmFtZSArIFwiIGlzIG5vdCBwcmVzZW50IGluIHdzZGwgYW5kIGNhbm5vdCBiZSBwcm9jZXNzZWQgY29ycmVjdGx5LlwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5lbGVtZW50LnRhcmdldE5TQWxpYXMgPSBucztcbiAgICB0aGlzLmVsZW1lbnQudGFyZ2V0TmFtZXNwYWNlID0gZGVmaW5pdGlvbnMueG1sbnNbbnNdO1xuXG4gICAgLy8gc2V0IHRoZSBvcHRpb25hbCAkbG9va3VwVHlwZSB0byBiZSB1c2VkIHdpdGhpbiBgY2xpZW50I19pbnZva2UoKWAgd2hlblxuICAgIC8vIGNhbGxpbmcgYHdzZGwjb2JqZWN0VG9Eb2N1bWVudFhNTCgpXG4gICAgdGhpcy5lbGVtZW50LiRsb29rdXBUeXBlID0gcGFydC4kZWxlbWVudDtcblxuICAgIGVsZW1lbnRDaGlsZHJlbiA9IHRoaXMuZWxlbWVudC5jaGlsZHJlbjtcblxuICAgIC8vIGdldCBhbGwgbmVzdGVkIGxvb2t1cCB0eXBlcyAob25seSBjb21wbGV4IHR5cGVzIGFyZSBmb2xsb3dlZClcbiAgICBpZiAoZWxlbWVudENoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBlbGVtZW50Q2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbG9va3VwVHlwZXMucHVzaCh0aGlzLl9nZXROZXN0ZWRMb29rdXBUeXBlU3RyaW5nKGVsZW1lbnRDaGlsZHJlbltpXSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGlmIG5lc3RlZCBsb29rdXAgdHlwZXMgd2hlcmUgZm91bmQsIHByZXBhcmUgdGhlbSBmb3IgZnVydGVyIHVzYWdlXG4gICAgaWYgKGxvb2t1cFR5cGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxvb2t1cFR5cGVzID0gbG9va3VwVHlwZXMuXG4gICAgICAgIGpvaW4oJ18nKS5cbiAgICAgICAgc3BsaXQoJ18nKS5cbiAgICAgICAgZmlsdGVyKGZ1bmN0aW9uIHJlbW92ZUVtcHR5TG9va3VwVHlwZXModHlwZSkge1xuICAgICAgICAgIHJldHVybiB0eXBlICE9PSAnXic7XG4gICAgICAgIH0pO1xuXG4gICAgICBsZXQgc2NoZW1hWG1sbnMgPSBkZWZpbml0aW9ucy5zY2hlbWFzW3RoaXMuZWxlbWVudC50YXJnZXROYW1lc3BhY2VdLnhtbG5zO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbG9va3VwVHlwZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbG9va3VwVHlwZXNbaV0gPSB0aGlzLl9jcmVhdGVMb29rdXBUeXBlT2JqZWN0KGxvb2t1cFR5cGVzW2ldLCBzY2hlbWFYbWxucyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5lbGVtZW50LiRsb29rdXBUeXBlcyA9IGxvb2t1cFR5cGVzO1xuXG4gICAgaWYgKHRoaXMuZWxlbWVudC4kdHlwZSkge1xuICAgICAgdHlwZSA9IHNwbGl0UU5hbWUodGhpcy5lbGVtZW50LiR0eXBlKTtcbiAgICAgIGxldCB0eXBlTnMgPSBzY2hlbWEueG1sbnMgJiYgc2NoZW1hLnhtbG5zW3R5cGUucHJlZml4XSB8fCBkZWZpbml0aW9ucy54bWxuc1t0eXBlLnByZWZpeF07XG5cbiAgICAgIGlmICh0eXBlTnMpIHtcbiAgICAgICAgaWYgKHR5cGUubmFtZSBpbiBQcmltaXRpdmVzKSB7XG4gICAgICAgICAgLy8gdGhpcy5lbGVtZW50ID0gdGhpcy5lbGVtZW50LiR0eXBlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIC8vIGZpcnN0IGNoZWNrIGxvY2FsIG1hcHBpbmcgb2YgbnMgYWxpYXMgdG8gbmFtZXNwYWNlXG4gICAgICAgICAgc2NoZW1hID0gZGVmaW5pdGlvbnMuc2NoZW1hc1t0eXBlTnNdO1xuICAgICAgICAgIGxldCBjdHlwZSA9IHNjaGVtYS5jb21wbGV4VHlwZXNbdHlwZS5uYW1lXSB8fCBzY2hlbWEudHlwZXNbdHlwZS5uYW1lXSB8fCBzY2hlbWEuZWxlbWVudHNbdHlwZS5uYW1lXTtcblxuXG4gICAgICAgICAgaWYgKGN0eXBlKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnRzID0gY3R5cGUuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMsIHNjaGVtYS54bWxucyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbGV0IG1ldGhvZCA9IHRoaXMuZWxlbWVudC5kZXNjcmlwdGlvbihkZWZpbml0aW9ucywgc2NoZW1hLnhtbG5zKTtcbiAgICAgIHRoaXMucGFydHMgPSBtZXRob2RbbnNOYW1lLm5hbWVdO1xuICAgIH1cblxuXG4gICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoMCwgMSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gcnBjIGVuY29kaW5nXG4gICAgdGhpcy5wYXJ0cyA9IHt9O1xuICAgIGRlbGV0ZSB0aGlzLmVsZW1lbnQ7XG4gICAgZm9yIChpID0gMDsgcGFydCA9IHRoaXMuY2hpbGRyZW5baV07IGkrKykge1xuICAgICAgaWYgKHBhcnQubmFtZSA9PT0gJ2RvY3VtZW50YXRpb24nKSB7XG4gICAgICAgIC8vIDx3c2RsOmRvY3VtZW50YXRpb24gY2FuIGJlIHByZXNlbnQgdW5kZXIgPHdzZGw6bWVzc2FnZT5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBhc3NlcnQocGFydC5uYW1lID09PSAncGFydCcsICdFeHBlY3RlZCBwYXJ0IGVsZW1lbnQnKTtcbiAgICAgIG5zTmFtZSA9IHNwbGl0UU5hbWUocGFydC4kdHlwZSk7XG4gICAgICBucyA9IGRlZmluaXRpb25zLnhtbG5zW25zTmFtZS5wcmVmaXhdO1xuICAgICAgdHlwZSA9IG5zTmFtZS5uYW1lO1xuICAgICAgbGV0IHNjaGVtYURlZmluaXRpb24gPSBkZWZpbml0aW9ucy5zY2hlbWFzW25zXTtcbiAgICAgIGlmICh0eXBlb2Ygc2NoZW1hRGVmaW5pdGlvbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5wYXJ0c1twYXJ0LiRuYW1lXSA9IGRlZmluaXRpb25zLnNjaGVtYXNbbnNdLnR5cGVzW3R5cGVdIHx8IGRlZmluaXRpb25zLnNjaGVtYXNbbnNdLmNvbXBsZXhUeXBlc1t0eXBlXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucGFydHNbcGFydC4kbmFtZV0gPSBwYXJ0LiR0eXBlO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHRoaXMucGFydHNbcGFydC4kbmFtZV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHRoaXMucGFydHNbcGFydC4kbmFtZV0ucHJlZml4ID0gbnNOYW1lLnByZWZpeDtcbiAgICAgICAgdGhpcy5wYXJ0c1twYXJ0LiRuYW1lXS54bWxucyA9IG5zO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpLS0sIDEpO1xuICAgIH1cbiAgfVxuICB0aGlzLmRlbGV0ZUZpeGVkQXR0cnMoKTtcbn07XG5cbi8qKlxuICogVGFrZXMgYSBnaXZlbiBuYW1lc3BhY2VkIFN0cmluZyhmb3IgZXhhbXBsZTogJ2FsaWFzOnByb3BlcnR5JykgYW5kIGNyZWF0ZXMgYSBsb29rdXBUeXBlXG4gKiBvYmplY3QgZm9yIGZ1cnRoZXIgdXNlIGluIGFzIGZpcnN0IChsb29rdXApIGBwYXJhbWV0ZXJUeXBlT2JqYCB3aXRoaW4gdGhlIGBvYmplY3RUb1hNTGBcbiAqIG1ldGhvZCBhbmQgcHJvdmlkZXMgYW4gZW50cnkgcG9pbnQgZm9yIHRoZSBhbHJlYWR5IGV4aXN0aW5nIGNvZGUgaW4gYGZpbmRDaGlsZFNjaGVtYU9iamVjdGAuXG4gKlxuICogQG1ldGhvZCBfY3JlYXRlTG9va3VwVHlwZU9iamVjdFxuICogQHBhcmFtIHtTdHJpbmd9ICAgICAgICAgICAgbnNTdHJpbmcgICAgICAgICAgVGhlIE5TIFN0cmluZyAoZm9yIGV4YW1wbGUgXCJhbGlhczp0eXBlXCIpLlxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgICAgeG1sbnMgICAgICAgVGhlIGZ1bGx5IHBhcnNlZCBgd3NkbGAgZGVmaW5pdGlvbnMgb2JqZWN0IChpbmNsdWRpbmcgYWxsIHNjaGVtYXMpLlxuICogQHJldHVybnMge09iamVjdH1cbiAqIEBwcml2YXRlXG4gKi9cbk1lc3NhZ2VFbGVtZW50LnByb3RvdHlwZS5fY3JlYXRlTG9va3VwVHlwZU9iamVjdCA9IGZ1bmN0aW9uIChuc1N0cmluZywgeG1sbnMpIHtcbiAgbGV0IHNwbGl0dGVkTlNTdHJpbmcgPSBzcGxpdFFOYW1lKG5zU3RyaW5nKSxcbiAgICBuc0FsaWFzID0gc3BsaXR0ZWROU1N0cmluZy5wcmVmaXgsXG4gICAgc3BsaXR0ZWROYW1lID0gc3BsaXR0ZWROU1N0cmluZy5uYW1lLnNwbGl0KCcjJyksXG4gICAgdHlwZSA9IHNwbGl0dGVkTmFtZVswXSxcbiAgICBuYW1lID0gc3BsaXR0ZWROYW1lWzFdLFxuICAgIGxvb2t1cFR5cGVPYmo6IGFueSA9IHt9O1xuXG4gIGxvb2t1cFR5cGVPYmouJG5hbWVzcGFjZSA9IHhtbG5zW25zQWxpYXNdO1xuICBsb29rdXBUeXBlT2JqLiR0eXBlID0gbnNBbGlhcyArICc6JyArIHR5cGU7XG4gIGxvb2t1cFR5cGVPYmouJG5hbWUgPSBuYW1lO1xuXG4gIHJldHVybiBsb29rdXBUeXBlT2JqO1xufTtcblxuLyoqXG4gKiBJdGVyYXRlcyB0aHJvdWdoIHRoZSBlbGVtZW50IGFuZCBldmVyeSBuZXN0ZWQgY2hpbGQgdG8gZmluZCBhbnkgZGVmaW5lZCBgJHR5cGVgXG4gKiBwcm9wZXJ0eSBhbmQgcmV0dXJucyBpdCBpbiBhIHVuZGVyc2NvcmUgKCdfJykgc2VwYXJhdGVkIFN0cmluZyAodXNpbmcgJ14nIGFzIGRlZmF1bHRcbiAqIHZhbHVlIGlmIG5vIGAkdHlwZWAgcHJvcGVydHkgd2FzIGZvdW5kKS5cbiAqXG4gKiBAbWV0aG9kIF9nZXROZXN0ZWRMb29rdXBUeXBlU3RyaW5nXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICAgICBlbGVtZW50ICAgICAgICAgVGhlIGVsZW1lbnQgd2hpY2ggKHByb2JhYmx5KSBjb250YWlucyBuZXN0ZWQgYCR0eXBlYCB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICogQHByaXZhdGVcbiAqL1xuTWVzc2FnZUVsZW1lbnQucHJvdG90eXBlLl9nZXROZXN0ZWRMb29rdXBUeXBlU3RyaW5nID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgbGV0IHJlc29sdmVkVHlwZSA9ICdeJyxcbiAgICBleGNsdWRlZCA9IHRoaXMuaWdub3JlZE5hbWVzcGFjZXMuY29uY2F0KCd4cycpOyAvLyBkbyBub3QgcHJvY2VzcyAkdHlwZSB2YWx1ZXMgd2ljaCBzdGFydCB3aXRoXG5cbiAgaWYgKGVsZW1lbnQuaGFzT3duUHJvcGVydHkoJyR0eXBlJykgJiYgdHlwZW9mIGVsZW1lbnQuJHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKGV4Y2x1ZGVkLmluZGV4T2YoZWxlbWVudC4kdHlwZS5zcGxpdCgnOicpWzBdKSA9PT0gLTEpIHtcbiAgICAgIHJlc29sdmVkVHlwZSArPSAoJ18nICsgZWxlbWVudC4kdHlwZSArICcjJyArIGVsZW1lbnQuJG5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChlbGVtZW50LmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICBlbGVtZW50LmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICBsZXQgcmVzb2x2ZWRDaGlsZFR5cGUgPSBzZWxmLl9nZXROZXN0ZWRMb29rdXBUeXBlU3RyaW5nKGNoaWxkKS5yZXBsYWNlKC9cXF5fLywgJycpO1xuXG4gICAgICBpZiAocmVzb2x2ZWRDaGlsZFR5cGUgJiYgdHlwZW9mIHJlc29sdmVkQ2hpbGRUeXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXNvbHZlZFR5cGUgKz0gKCdfJyArIHJlc29sdmVkQ2hpbGRUeXBlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiByZXNvbHZlZFR5cGU7XG59O1xuXG5PcGVyYXRpb25FbGVtZW50LnByb3RvdHlwZS5wb3N0UHJvY2VzcyA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucywgdGFnKSB7XG4gIGxldCBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG4gIGZvciAobGV0IGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBjaGlsZHJlbltpXTsgaSsrKSB7XG4gICAgaWYgKGNoaWxkLm5hbWUgIT09ICdpbnB1dCcgJiYgY2hpbGQubmFtZSAhPT0gJ291dHB1dCcpXG4gICAgICBjb250aW51ZTtcbiAgICBpZiAodGFnID09PSAnYmluZGluZycpIHtcbiAgICAgIHRoaXNbY2hpbGQubmFtZV0gPSBjaGlsZDtcbiAgICAgIGNoaWxkcmVuLnNwbGljZShpLS0sIDEpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGxldCBtZXNzYWdlTmFtZSA9IHNwbGl0UU5hbWUoY2hpbGQuJG1lc3NhZ2UpLm5hbWU7XG4gICAgbGV0IG1lc3NhZ2UgPSBkZWZpbml0aW9ucy5tZXNzYWdlc1ttZXNzYWdlTmFtZV07XG4gICAgbWVzc2FnZS5wb3N0UHJvY2VzcyhkZWZpbml0aW9ucyk7XG4gICAgaWYgKG1lc3NhZ2UuZWxlbWVudCkge1xuICAgICAgZGVmaW5pdGlvbnMubWVzc2FnZXNbbWVzc2FnZS5lbGVtZW50LiRuYW1lXSA9IG1lc3NhZ2U7XG4gICAgICB0aGlzW2NoaWxkLm5hbWVdID0gbWVzc2FnZS5lbGVtZW50O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXNbY2hpbGQubmFtZV0gPSBtZXNzYWdlO1xuICAgIH1cbiAgICBjaGlsZHJlbi5zcGxpY2UoaS0tLCAxKTtcbiAgfVxuICB0aGlzLmRlbGV0ZUZpeGVkQXR0cnMoKTtcbn07XG5cblBvcnRUeXBlRWxlbWVudC5wcm90b3R5cGUucG9zdFByb2Nlc3MgPSBmdW5jdGlvbiAoZGVmaW5pdGlvbnMpIHtcbiAgbGV0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcbiAgaWYgKHR5cGVvZiBjaGlsZHJlbiA9PT0gJ3VuZGVmaW5lZCcpXG4gICAgcmV0dXJuO1xuICBmb3IgKGxldCBpID0gMCwgY2hpbGQ7IGNoaWxkID0gY2hpbGRyZW5baV07IGkrKykge1xuICAgIGlmIChjaGlsZC5uYW1lICE9PSAnb3BlcmF0aW9uJylcbiAgICAgIGNvbnRpbnVlO1xuICAgIGNoaWxkLnBvc3RQcm9jZXNzKGRlZmluaXRpb25zLCAncG9ydFR5cGUnKTtcbiAgICB0aGlzLm1ldGhvZHNbY2hpbGQuJG5hbWVdID0gY2hpbGQ7XG4gICAgY2hpbGRyZW4uc3BsaWNlKGktLSwgMSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuJG5hbWU7XG4gIHRoaXMuZGVsZXRlRml4ZWRBdHRycygpO1xufTtcblxuQmluZGluZ0VsZW1lbnQucHJvdG90eXBlLnBvc3RQcm9jZXNzID0gZnVuY3Rpb24gKGRlZmluaXRpb25zKSB7XG4gIGxldCB0eXBlID0gc3BsaXRRTmFtZSh0aGlzLiR0eXBlKS5uYW1lLFxuICAgIHBvcnRUeXBlID0gZGVmaW5pdGlvbnMucG9ydFR5cGVzW3R5cGVdLFxuICAgIHN0eWxlID0gdGhpcy5zdHlsZSxcbiAgICBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG4gIGlmIChwb3J0VHlwZSkge1xuICAgIHBvcnRUeXBlLnBvc3RQcm9jZXNzKGRlZmluaXRpb25zKTtcbiAgICB0aGlzLm1ldGhvZHMgPSBwb3J0VHlwZS5tZXRob2RzO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGNoaWxkOyBjaGlsZCA9IGNoaWxkcmVuW2ldOyBpKyspIHtcbiAgICAgIGlmIChjaGlsZC5uYW1lICE9PSAnb3BlcmF0aW9uJylcbiAgICAgICAgY29udGludWU7XG4gICAgICBjaGlsZC5wb3N0UHJvY2VzcyhkZWZpbml0aW9ucywgJ2JpbmRpbmcnKTtcbiAgICAgIGNoaWxkcmVuLnNwbGljZShpLS0sIDEpO1xuICAgICAgY2hpbGQuc3R5bGUgfHwgKGNoaWxkLnN0eWxlID0gc3R5bGUpO1xuICAgICAgbGV0IG1ldGhvZCA9IHRoaXMubWV0aG9kc1tjaGlsZC4kbmFtZV07XG5cbiAgICAgIGlmIChtZXRob2QpIHtcbiAgICAgICAgbWV0aG9kLnN0eWxlID0gY2hpbGQuc3R5bGU7XG4gICAgICAgIG1ldGhvZC5zb2FwQWN0aW9uID0gY2hpbGQuc29hcEFjdGlvbjtcbiAgICAgICAgbWV0aG9kLmlucHV0U29hcCA9IGNoaWxkLmlucHV0IHx8IG51bGw7XG4gICAgICAgIG1ldGhvZC5vdXRwdXRTb2FwID0gY2hpbGQub3V0cHV0IHx8IG51bGw7XG4gICAgICAgIG1ldGhvZC5pbnB1dFNvYXAgJiYgbWV0aG9kLmlucHV0U29hcC5kZWxldGVGaXhlZEF0dHJzKCk7XG4gICAgICAgIG1ldGhvZC5vdXRwdXRTb2FwICYmIG1ldGhvZC5vdXRwdXRTb2FwLmRlbGV0ZUZpeGVkQXR0cnMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZGVsZXRlIHRoaXMuJG5hbWU7XG4gIGRlbGV0ZSB0aGlzLiR0eXBlO1xuICB0aGlzLmRlbGV0ZUZpeGVkQXR0cnMoKTtcbn07XG5cblNlcnZpY2VFbGVtZW50LnByb3RvdHlwZS5wb3N0UHJvY2VzcyA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucykge1xuICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuLFxuICAgIGJpbmRpbmdzID0gZGVmaW5pdGlvbnMuYmluZGluZ3M7XG4gIGlmIChjaGlsZHJlbiAmJiBjaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGNoaWxkOyBjaGlsZCA9IGNoaWxkcmVuW2ldOyBpKyspIHtcbiAgICAgIGlmIChjaGlsZC5uYW1lICE9PSAncG9ydCcpXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgbGV0IGJpbmRpbmdOYW1lID0gc3BsaXRRTmFtZShjaGlsZC4kYmluZGluZykubmFtZTtcbiAgICAgIGxldCBiaW5kaW5nID0gYmluZGluZ3NbYmluZGluZ05hbWVdO1xuICAgICAgaWYgKGJpbmRpbmcpIHtcbiAgICAgICAgYmluZGluZy5wb3N0UHJvY2VzcyhkZWZpbml0aW9ucyk7XG4gICAgICAgIHRoaXMucG9ydHNbY2hpbGQuJG5hbWVdID0ge1xuICAgICAgICAgIGxvY2F0aW9uOiBjaGlsZC5sb2NhdGlvbixcbiAgICAgICAgICBiaW5kaW5nOiBiaW5kaW5nXG4gICAgICAgIH07XG4gICAgICAgIGNoaWxkcmVuLnNwbGljZShpLS0sIDEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBkZWxldGUgdGhpcy4kbmFtZTtcbiAgdGhpcy5kZWxldGVGaXhlZEF0dHJzKCk7XG59O1xuXG5cblNpbXBsZVR5cGVFbGVtZW50LnByb3RvdHlwZS5kZXNjcmlwdGlvbiA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucykge1xuICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xuICBmb3IgKGxldCBpID0gMCwgY2hpbGQ7IGNoaWxkID0gY2hpbGRyZW5baV07IGkrKykge1xuICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIFJlc3RyaWN0aW9uRWxlbWVudClcbiAgICAgIHJldHVybiB0aGlzLiRuYW1lICsgXCJ8XCIgKyBjaGlsZC5kZXNjcmlwdGlvbigpO1xuICB9XG4gIHJldHVybiB7fTtcbn07XG5cblJlc3RyaWN0aW9uRWxlbWVudC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoZGVmaW5pdGlvbnMsIHhtbG5zKSB7XG4gIGxldCBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG4gIGxldCBkZXNjO1xuICBmb3IgKGxldCBpID0gMCwgY2hpbGQ7IGNoaWxkID0gY2hpbGRyZW5baV07IGkrKykge1xuICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIFNlcXVlbmNlRWxlbWVudCB8fFxuICAgICAgY2hpbGQgaW5zdGFuY2VvZiBDaG9pY2VFbGVtZW50KSB7XG4gICAgICBkZXNjID0gY2hpbGQuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMsIHhtbG5zKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBpZiAoZGVzYyAmJiB0aGlzLiRiYXNlKSB7XG4gICAgbGV0IHR5cGUgPSBzcGxpdFFOYW1lKHRoaXMuJGJhc2UpLFxuICAgICAgdHlwZU5hbWUgPSB0eXBlLm5hbWUsXG4gICAgICBucyA9IHhtbG5zICYmIHhtbG5zW3R5cGUucHJlZml4XSB8fCBkZWZpbml0aW9ucy54bWxuc1t0eXBlLnByZWZpeF0sXG4gICAgICBzY2hlbWEgPSBkZWZpbml0aW9ucy5zY2hlbWFzW25zXSxcbiAgICAgIHR5cGVFbGVtZW50ID0gc2NoZW1hICYmIChzY2hlbWEuY29tcGxleFR5cGVzW3R5cGVOYW1lXSB8fCBzY2hlbWEudHlwZXNbdHlwZU5hbWVdIHx8IHNjaGVtYS5lbGVtZW50c1t0eXBlTmFtZV0pO1xuXG4gICAgZGVzYy5nZXRCYXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHR5cGVFbGVtZW50LmRlc2NyaXB0aW9uKGRlZmluaXRpb25zLCBzY2hlbWEueG1sbnMpO1xuICAgIH07XG4gICAgcmV0dXJuIGRlc2M7XG4gIH1cblxuICAvLyB0aGVuIHNpbXBsZSBlbGVtZW50XG4gIGxldCBiYXNlID0gdGhpcy4kYmFzZSA/IHRoaXMuJGJhc2UgKyBcInxcIiA6IFwiXCI7XG4gIHJldHVybiBiYXNlICsgdGhpcy5jaGlsZHJlbi5tYXAoZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgcmV0dXJuIGNoaWxkLmRlc2NyaXB0aW9uKCk7XG4gIH0pLmpvaW4oXCIsXCIpO1xufTtcblxuRXh0ZW5zaW9uRWxlbWVudC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoZGVmaW5pdGlvbnMsIHhtbG5zKSB7XG4gIGxldCBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG4gIGxldCBkZXNjID0ge307XG4gIGZvciAobGV0IGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBjaGlsZHJlbltpXTsgaSsrKSB7XG4gICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgU2VxdWVuY2VFbGVtZW50IHx8XG4gICAgICBjaGlsZCBpbnN0YW5jZW9mIENob2ljZUVsZW1lbnQpIHtcbiAgICAgIGRlc2MgPSBjaGlsZC5kZXNjcmlwdGlvbihkZWZpbml0aW9ucywgeG1sbnMpO1xuICAgIH1cbiAgfVxuICBpZiAodGhpcy4kYmFzZSkge1xuICAgIGxldCB0eXBlID0gc3BsaXRRTmFtZSh0aGlzLiRiYXNlKSxcbiAgICAgIHR5cGVOYW1lID0gdHlwZS5uYW1lLFxuICAgICAgbnMgPSB4bWxucyAmJiB4bWxuc1t0eXBlLnByZWZpeF0gfHwgZGVmaW5pdGlvbnMueG1sbnNbdHlwZS5wcmVmaXhdLFxuICAgICAgc2NoZW1hID0gZGVmaW5pdGlvbnMuc2NoZW1hc1tuc107XG5cbiAgICBpZiAodHlwZU5hbWUgaW4gUHJpbWl0aXZlcykge1xuICAgICAgcmV0dXJuIHRoaXMuJGJhc2U7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbGV0IHR5cGVFbGVtZW50ID0gc2NoZW1hICYmIChzY2hlbWEuY29tcGxleFR5cGVzW3R5cGVOYW1lXSB8fFxuICAgICAgICBzY2hlbWEudHlwZXNbdHlwZU5hbWVdIHx8IHNjaGVtYS5lbGVtZW50c1t0eXBlTmFtZV0pO1xuXG4gICAgICBpZiAodHlwZUVsZW1lbnQpIHtcbiAgICAgICAgbGV0IGJhc2UgPSB0eXBlRWxlbWVudC5kZXNjcmlwdGlvbihkZWZpbml0aW9ucywgc2NoZW1hLnhtbG5zKTtcbiAgICAgICAgZGVzYyA9IF8uZGVmYXVsdHNEZWVwKGJhc2UsIGRlc2MpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZGVzYztcbn07XG5cbkVudW1lcmF0aW9uRWxlbWVudC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzW3RoaXMudmFsdWVLZXldO1xufTtcblxuQ29tcGxleFR5cGVFbGVtZW50LnByb3RvdHlwZS5kZXNjcmlwdGlvbiA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucywgeG1sbnMpIHtcbiAgbGV0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbiB8fCBbXTtcbiAgZm9yIChsZXQgaSA9IDAsIGNoaWxkOyBjaGlsZCA9IGNoaWxkcmVuW2ldOyBpKyspIHtcbiAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBDaG9pY2VFbGVtZW50IHx8XG4gICAgICBjaGlsZCBpbnN0YW5jZW9mIFNlcXVlbmNlRWxlbWVudCB8fFxuICAgICAgY2hpbGQgaW5zdGFuY2VvZiBBbGxFbGVtZW50IHx8XG4gICAgICBjaGlsZCBpbnN0YW5jZW9mIFNpbXBsZUNvbnRlbnRFbGVtZW50IHx8XG4gICAgICBjaGlsZCBpbnN0YW5jZW9mIENvbXBsZXhDb250ZW50RWxlbWVudCkge1xuXG4gICAgICByZXR1cm4gY2hpbGQuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMsIHhtbG5zKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHt9O1xufTtcblxuQ29tcGxleENvbnRlbnRFbGVtZW50LnByb3RvdHlwZS5kZXNjcmlwdGlvbiA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucywgeG1sbnMpIHtcbiAgbGV0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcbiAgZm9yIChsZXQgaSA9IDAsIGNoaWxkOyBjaGlsZCA9IGNoaWxkcmVuW2ldOyBpKyspIHtcbiAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBFeHRlbnNpb25FbGVtZW50KSB7XG4gICAgICByZXR1cm4gY2hpbGQuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMsIHhtbG5zKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHt9O1xufTtcblxuU2ltcGxlQ29udGVudEVsZW1lbnQucHJvdG90eXBlLmRlc2NyaXB0aW9uID0gZnVuY3Rpb24gKGRlZmluaXRpb25zLCB4bWxucykge1xuICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xuICBmb3IgKGxldCBpID0gMCwgY2hpbGQ7IGNoaWxkID0gY2hpbGRyZW5baV07IGkrKykge1xuICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIEV4dGVuc2lvbkVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBjaGlsZC5kZXNjcmlwdGlvbihkZWZpbml0aW9ucywgeG1sbnMpO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge307XG59O1xuXG5FbGVtZW50RWxlbWVudC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoZGVmaW5pdGlvbnMsIHhtbG5zKSB7XG4gIGxldCBlbGVtZW50ID0ge30sXG4gICAgbmFtZSA9IHRoaXMuJG5hbWU7XG4gIGxldCBpc01hbnkgPSAhdGhpcy4kbWF4T2NjdXJzID8gZmFsc2UgOiAoaXNOYU4odGhpcy4kbWF4T2NjdXJzKSA/ICh0aGlzLiRtYXhPY2N1cnMgPT09ICd1bmJvdW5kZWQnKSA6ICh0aGlzLiRtYXhPY2N1cnMgPiAxKSk7XG4gIGlmICh0aGlzLiRtaW5PY2N1cnMgIT09IHRoaXMuJG1heE9jY3VycyAmJiBpc01hbnkpIHtcbiAgICBuYW1lICs9ICdbXSc7XG4gIH1cblxuICBpZiAoeG1sbnMgJiYgeG1sbnNbVE5TX1BSRUZJWF0pIHtcbiAgICB0aGlzLiR0YXJnZXROYW1lc3BhY2UgPSB4bWxuc1tUTlNfUFJFRklYXTtcbiAgfVxuICBsZXQgdHlwZSA9IHRoaXMuJHR5cGUgfHwgdGhpcy4kcmVmO1xuICBpZiAodHlwZSkge1xuICAgIHR5cGUgPSBzcGxpdFFOYW1lKHR5cGUpO1xuICAgIGxldCB0eXBlTmFtZSA9IHR5cGUubmFtZSxcbiAgICAgIG5zID0geG1sbnMgJiYgeG1sbnNbdHlwZS5wcmVmaXhdIHx8IGRlZmluaXRpb25zLnhtbG5zW3R5cGUucHJlZml4XSxcbiAgICAgIHNjaGVtYSA9IGRlZmluaXRpb25zLnNjaGVtYXNbbnNdLFxuICAgICAgdHlwZUVsZW1lbnQgPSBzY2hlbWEgJiYgKHRoaXMuJHR5cGUgPyBzY2hlbWEuY29tcGxleFR5cGVzW3R5cGVOYW1lXSB8fCBzY2hlbWEudHlwZXNbdHlwZU5hbWVdIDogc2NoZW1hLmVsZW1lbnRzW3R5cGVOYW1lXSk7XG5cbiAgICBpZiAobnMgJiYgZGVmaW5pdGlvbnMuc2NoZW1hc1tuc10pIHtcbiAgICAgIHhtbG5zID0gZGVmaW5pdGlvbnMuc2NoZW1hc1tuc10ueG1sbnM7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVFbGVtZW50ICYmICEodHlwZU5hbWUgaW4gUHJpbWl0aXZlcykpIHtcblxuICAgICAgaWYgKCEodHlwZU5hbWUgaW4gZGVmaW5pdGlvbnMuZGVzY3JpcHRpb25zLnR5cGVzKSkge1xuXG4gICAgICAgIGxldCBlbGVtOiBhbnkgPSB7fTtcbiAgICAgICAgZGVmaW5pdGlvbnMuZGVzY3JpcHRpb25zLnR5cGVzW3R5cGVOYW1lXSA9IGVsZW07XG4gICAgICAgIGxldCBkZXNjcmlwdGlvbiA9IHR5cGVFbGVtZW50LmRlc2NyaXB0aW9uKGRlZmluaXRpb25zLCB4bWxucyk7XG4gICAgICAgIGlmICh0eXBlb2YgZGVzY3JpcHRpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgZWxlbSA9IGRlc2NyaXB0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIE9iamVjdC5rZXlzKGRlc2NyaXB0aW9uKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIGVsZW1ba2V5XSA9IGRlc2NyaXB0aW9uW2tleV07XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy4kcmVmKSB7XG4gICAgICAgICAgZWxlbWVudCA9IGVsZW07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZWxlbWVudFtuYW1lXSA9IGVsZW07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGVsZW0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgZWxlbS50YXJnZXROU0FsaWFzID0gdHlwZS5wcmVmaXg7XG4gICAgICAgICAgZWxlbS50YXJnZXROYW1lc3BhY2UgPSBucztcbiAgICAgICAgfVxuXG4gICAgICAgIGRlZmluaXRpb25zLmRlc2NyaXB0aW9ucy50eXBlc1t0eXBlTmFtZV0gPSBlbGVtO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLiRyZWYpIHtcbiAgICAgICAgICBlbGVtZW50ID0gZGVmaW5pdGlvbnMuZGVzY3JpcHRpb25zLnR5cGVzW3R5cGVOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBlbGVtZW50W25hbWVdID0gZGVmaW5pdGlvbnMuZGVzY3JpcHRpb25zLnR5cGVzW3R5cGVOYW1lXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZWxlbWVudFtuYW1lXSA9IHRoaXMuJHR5cGU7XG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIGxldCBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG4gICAgZWxlbWVudFtuYW1lXSA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBjaGlsZHJlbltpXTsgaSsrKSB7XG4gICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBDb21wbGV4VHlwZUVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudFtuYW1lXSA9IGNoaWxkLmRlc2NyaXB0aW9uKGRlZmluaXRpb25zLCB4bWxucyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBlbGVtZW50O1xufTtcblxuQWxsRWxlbWVudC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPVxuICBTZXF1ZW5jZUVsZW1lbnQucHJvdG90eXBlLmRlc2NyaXB0aW9uID0gZnVuY3Rpb24gKGRlZmluaXRpb25zLCB4bWxucykge1xuICAgIGxldCBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG4gICAgbGV0IHNlcXVlbmNlID0ge307XG4gICAgZm9yIChsZXQgaSA9IDAsIGNoaWxkOyBjaGlsZCA9IGNoaWxkcmVuW2ldOyBpKyspIHtcbiAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIEFueUVsZW1lbnQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBsZXQgZGVzY3JpcHRpb24gPSBjaGlsZC5kZXNjcmlwdGlvbihkZWZpbml0aW9ucywgeG1sbnMpO1xuICAgICAgZm9yIChsZXQga2V5IGluIGRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHNlcXVlbmNlW2tleV0gPSBkZXNjcmlwdGlvbltrZXldO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc2VxdWVuY2U7XG4gIH07XG5cbkNob2ljZUVsZW1lbnQucHJvdG90eXBlLmRlc2NyaXB0aW9uID0gZnVuY3Rpb24gKGRlZmluaXRpb25zLCB4bWxucykge1xuICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xuICBsZXQgY2hvaWNlID0ge307XG4gIGZvciAobGV0IGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBjaGlsZHJlbltpXTsgaSsrKSB7XG4gICAgbGV0IGRlc2NyaXB0aW9uID0gY2hpbGQuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMsIHhtbG5zKTtcbiAgICBmb3IgKGxldCBrZXkgaW4gZGVzY3JpcHRpb24pIHtcbiAgICAgIGNob2ljZVtrZXldID0gZGVzY3JpcHRpb25ba2V5XTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNob2ljZTtcbn07XG5cbk1lc3NhZ2VFbGVtZW50LnByb3RvdHlwZS5kZXNjcmlwdGlvbiA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucykge1xuICBpZiAodGhpcy5lbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudCAmJiB0aGlzLmVsZW1lbnQuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMpO1xuICB9XG4gIGxldCBkZXNjID0ge307XG4gIGRlc2NbdGhpcy4kbmFtZV0gPSB0aGlzLnBhcnRzO1xuICByZXR1cm4gZGVzYztcbn07XG5cblBvcnRUeXBlRWxlbWVudC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoZGVmaW5pdGlvbnMpIHtcbiAgbGV0IG1ldGhvZHMgPSB7fTtcbiAgZm9yIChsZXQgbmFtZSBpbiB0aGlzLm1ldGhvZHMpIHtcbiAgICBsZXQgbWV0aG9kID0gdGhpcy5tZXRob2RzW25hbWVdO1xuICAgIG1ldGhvZHNbbmFtZV0gPSBtZXRob2QuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTtcblxuT3BlcmF0aW9uRWxlbWVudC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoZGVmaW5pdGlvbnMpIHtcbiAgbGV0IGlucHV0RGVzYyA9IHRoaXMuaW5wdXQgPyB0aGlzLmlucHV0LmRlc2NyaXB0aW9uKGRlZmluaXRpb25zKSA6IG51bGw7XG4gIGxldCBvdXRwdXREZXNjID0gdGhpcy5vdXRwdXQgPyB0aGlzLm91dHB1dC5kZXNjcmlwdGlvbihkZWZpbml0aW9ucykgOiBudWxsO1xuICByZXR1cm4ge1xuICAgIGlucHV0OiBpbnB1dERlc2MgJiYgaW5wdXREZXNjW09iamVjdC5rZXlzKGlucHV0RGVzYylbMF1dLFxuICAgIG91dHB1dDogb3V0cHV0RGVzYyAmJiBvdXRwdXREZXNjW09iamVjdC5rZXlzKG91dHB1dERlc2MpWzBdXVxuICB9O1xufTtcblxuQmluZGluZ0VsZW1lbnQucHJvdG90eXBlLmRlc2NyaXB0aW9uID0gZnVuY3Rpb24gKGRlZmluaXRpb25zKSB7XG4gIGxldCBtZXRob2RzID0ge307XG4gIGZvciAobGV0IG5hbWUgaW4gdGhpcy5tZXRob2RzKSB7XG4gICAgbGV0IG1ldGhvZCA9IHRoaXMubWV0aG9kc1tuYW1lXTtcbiAgICBtZXRob2RzW25hbWVdID0gbWV0aG9kLmRlc2NyaXB0aW9uKGRlZmluaXRpb25zKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07XG5cblNlcnZpY2VFbGVtZW50LnByb3RvdHlwZS5kZXNjcmlwdGlvbiA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucykge1xuICBsZXQgcG9ydHMgPSB7fTtcbiAgZm9yIChsZXQgbmFtZSBpbiB0aGlzLnBvcnRzKSB7XG4gICAgbGV0IHBvcnQgPSB0aGlzLnBvcnRzW25hbWVdO1xuICAgIHBvcnRzW25hbWVdID0gcG9ydC5iaW5kaW5nLmRlc2NyaXB0aW9uKGRlZmluaXRpb25zKTtcbiAgfVxuICByZXR1cm4gcG9ydHM7XG59O1xuXG5leHBvcnQgbGV0IFdTREwgPSBmdW5jdGlvbiAoZGVmaW5pdGlvbiwgdXJpLCBvcHRpb25zKSB7XG4gIGxldCBzZWxmID0gdGhpcyxcbiAgICBmcm9tRnVuYztcblxuICB0aGlzLnVyaSA9IHVyaTtcbiAgdGhpcy5jYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgfTtcbiAgdGhpcy5faW5jbHVkZXNXc2RsID0gW107XG5cbiAgLy8gaW5pdGlhbGl6ZSBXU0RMIGNhY2hlXG4gIHRoaXMuV1NETF9DQUNIRSA9IChvcHRpb25zIHx8IHt9KS5XU0RMX0NBQ0hFIHx8IHt9O1xuXG4gIHRoaXMuX2luaXRpYWxpemVPcHRpb25zKG9wdGlvbnMpO1xuXG4gIGlmICh0eXBlb2YgZGVmaW5pdGlvbiA9PT0gJ3N0cmluZycpIHtcbiAgICBkZWZpbml0aW9uID0gc3RyaXBCb20oZGVmaW5pdGlvbik7XG4gICAgZnJvbUZ1bmMgPSB0aGlzLl9mcm9tWE1MO1xuICB9XG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbml0aW9uID09PSAnb2JqZWN0Jykge1xuICAgIGZyb21GdW5jID0gdGhpcy5fZnJvbVNlcnZpY2VzO1xuICB9XG4gIGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignV1NETCBsZXRydWN0b3IgdGFrZXMgZWl0aGVyIGFuIFhNTCBzdHJpbmcgb3Igc2VydmljZSBkZWZpbml0aW9uJyk7XG4gIH1cblxuICBQcm9taXNlLnJlc29sdmUodHJ1ZSkudGhlbigoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGZyb21GdW5jLmNhbGwoc2VsZiwgZGVmaW5pdGlvbik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soZS5tZXNzYWdlKTtcbiAgICB9XG5cbiAgICBzZWxmLnByb2Nlc3NJbmNsdWRlcygpLnRoZW4oKCkgPT4ge1xuICAgICAgc2VsZi5kZWZpbml0aW9ucy5kZWxldGVGaXhlZEF0dHJzKCk7XG4gICAgICBsZXQgc2VydmljZXMgPSBzZWxmLnNlcnZpY2VzID0gc2VsZi5kZWZpbml0aW9ucy5zZXJ2aWNlcztcbiAgICAgIGlmIChzZXJ2aWNlcykge1xuICAgICAgICBmb3IgKGNvbnN0IG5hbWUgaW4gc2VydmljZXMpIHtcbiAgICAgICAgICBzZXJ2aWNlc1tuYW1lXS5wb3N0UHJvY2VzcyhzZWxmLmRlZmluaXRpb25zKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGV0IGNvbXBsZXhUeXBlcyA9IHNlbGYuZGVmaW5pdGlvbnMuY29tcGxleFR5cGVzO1xuICAgICAgaWYgKGNvbXBsZXhUeXBlcykge1xuICAgICAgICBmb3IgKGNvbnN0IG5hbWUgaW4gY29tcGxleFR5cGVzKSB7XG4gICAgICAgICAgY29tcGxleFR5cGVzW25hbWVdLmRlbGV0ZUZpeGVkQXR0cnMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBmb3IgZG9jdW1lbnQgc3R5bGUsIGZvciBldmVyeSBiaW5kaW5nLCBwcmVwYXJlIGlucHV0IG1lc3NhZ2UgZWxlbWVudCBuYW1lIHRvIChtZXRob2ROYW1lLCBvdXRwdXQgbWVzc2FnZSBlbGVtZW50IG5hbWUpIG1hcHBpbmdcbiAgICAgIGxldCBiaW5kaW5ncyA9IHNlbGYuZGVmaW5pdGlvbnMuYmluZGluZ3M7XG4gICAgICBmb3IgKGxldCBiaW5kaW5nTmFtZSBpbiBiaW5kaW5ncykge1xuICAgICAgICBsZXQgYmluZGluZyA9IGJpbmRpbmdzW2JpbmRpbmdOYW1lXTtcbiAgICAgICAgaWYgKHR5cGVvZiBiaW5kaW5nLnN0eWxlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGJpbmRpbmcuc3R5bGUgPSAnZG9jdW1lbnQnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiaW5kaW5nLnN0eWxlICE9PSAnZG9jdW1lbnQnKVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBsZXQgbWV0aG9kcyA9IGJpbmRpbmcubWV0aG9kcztcbiAgICAgICAgbGV0IHRvcEVscyA9IGJpbmRpbmcudG9wRWxlbWVudHMgPSB7fTtcbiAgICAgICAgZm9yIChsZXQgbWV0aG9kTmFtZSBpbiBtZXRob2RzKSB7XG4gICAgICAgICAgaWYgKG1ldGhvZHNbbWV0aG9kTmFtZV0uaW5wdXQpIHtcbiAgICAgICAgICAgIGxldCBpbnB1dE5hbWUgPSBtZXRob2RzW21ldGhvZE5hbWVdLmlucHV0LiRuYW1lO1xuICAgICAgICAgICAgbGV0IG91dHB1dE5hbWUgPSBcIlwiO1xuICAgICAgICAgICAgaWYgKG1ldGhvZHNbbWV0aG9kTmFtZV0ub3V0cHV0KVxuICAgICAgICAgICAgICBvdXRwdXROYW1lID0gbWV0aG9kc1ttZXRob2ROYW1lXS5vdXRwdXQuJG5hbWU7XG4gICAgICAgICAgICB0b3BFbHNbaW5wdXROYW1lXSA9IHsgXCJtZXRob2ROYW1lXCI6IG1ldGhvZE5hbWUsIFwib3V0cHV0TmFtZVwiOiBvdXRwdXROYW1lIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHByZXBhcmUgc29hcCBlbnZlbG9wZSB4bWxucyBkZWZpbml0aW9uIHN0cmluZ1xuICAgICAgc2VsZi54bWxuc0luRW52ZWxvcGUgPSBzZWxmLl94bWxuc01hcCgpO1xuICAgICAgc2VsZi5jYWxsYmFjayhudWxsLCBzZWxmKTtcbiAgICB9KS5jYXRjaChlcnIgPT4gc2VsZi5jYWxsYmFjayhlcnIpKTtcblxuICB9KTtcblxuICAvLyBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCkge1xuICAvLyAgIHRyeSB7XG4gIC8vICAgICBmcm9tRnVuYy5jYWxsKHNlbGYsIGRlZmluaXRpb24pO1xuICAvLyAgIH0gY2F0Y2ggKGUpIHtcbiAgLy8gICAgIHJldHVybiBzZWxmLmNhbGxiYWNrKGUubWVzc2FnZSk7XG4gIC8vICAgfVxuXG4gIC8vICAgc2VsZi5wcm9jZXNzSW5jbHVkZXMoZnVuY3Rpb24oZXJyKSB7XG4gIC8vICAgICBsZXQgbmFtZTtcbiAgLy8gICAgIGlmIChlcnIpIHtcbiAgLy8gICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soZXJyKTtcbiAgLy8gICAgIH1cblxuICAvLyAgICAgc2VsZi5kZWZpbml0aW9ucy5kZWxldGVGaXhlZEF0dHJzKCk7XG4gIC8vICAgICBsZXQgc2VydmljZXMgPSBzZWxmLnNlcnZpY2VzID0gc2VsZi5kZWZpbml0aW9ucy5zZXJ2aWNlcztcbiAgLy8gICAgIGlmIChzZXJ2aWNlcykge1xuICAvLyAgICAgICBmb3IgKG5hbWUgaW4gc2VydmljZXMpIHtcbiAgLy8gICAgICAgICBzZXJ2aWNlc1tuYW1lXS5wb3N0UHJvY2VzcyhzZWxmLmRlZmluaXRpb25zKTtcbiAgLy8gICAgICAgfVxuICAvLyAgICAgfVxuICAvLyAgICAgbGV0IGNvbXBsZXhUeXBlcyA9IHNlbGYuZGVmaW5pdGlvbnMuY29tcGxleFR5cGVzO1xuICAvLyAgICAgaWYgKGNvbXBsZXhUeXBlcykge1xuICAvLyAgICAgICBmb3IgKG5hbWUgaW4gY29tcGxleFR5cGVzKSB7XG4gIC8vICAgICAgICAgY29tcGxleFR5cGVzW25hbWVdLmRlbGV0ZUZpeGVkQXR0cnMoKTtcbiAgLy8gICAgICAgfVxuICAvLyAgICAgfVxuXG4gIC8vICAgICAvLyBmb3IgZG9jdW1lbnQgc3R5bGUsIGZvciBldmVyeSBiaW5kaW5nLCBwcmVwYXJlIGlucHV0IG1lc3NhZ2UgZWxlbWVudCBuYW1lIHRvIChtZXRob2ROYW1lLCBvdXRwdXQgbWVzc2FnZSBlbGVtZW50IG5hbWUpIG1hcHBpbmdcbiAgLy8gICAgIGxldCBiaW5kaW5ncyA9IHNlbGYuZGVmaW5pdGlvbnMuYmluZGluZ3M7XG4gIC8vICAgICBmb3IgKGxldCBiaW5kaW5nTmFtZSBpbiBiaW5kaW5ncykge1xuICAvLyAgICAgICBsZXQgYmluZGluZyA9IGJpbmRpbmdzW2JpbmRpbmdOYW1lXTtcbiAgLy8gICAgICAgaWYgKHR5cGVvZiBiaW5kaW5nLnN0eWxlID09PSAndW5kZWZpbmVkJykge1xuICAvLyAgICAgICAgIGJpbmRpbmcuc3R5bGUgPSAnZG9jdW1lbnQnO1xuICAvLyAgICAgICB9XG4gIC8vICAgICAgIGlmIChiaW5kaW5nLnN0eWxlICE9PSAnZG9jdW1lbnQnKVxuICAvLyAgICAgICAgIGNvbnRpbnVlO1xuICAvLyAgICAgICBsZXQgbWV0aG9kcyA9IGJpbmRpbmcubWV0aG9kcztcbiAgLy8gICAgICAgbGV0IHRvcEVscyA9IGJpbmRpbmcudG9wRWxlbWVudHMgPSB7fTtcbiAgLy8gICAgICAgZm9yIChsZXQgbWV0aG9kTmFtZSBpbiBtZXRob2RzKSB7XG4gIC8vICAgICAgICAgaWYgKG1ldGhvZHNbbWV0aG9kTmFtZV0uaW5wdXQpIHtcbiAgLy8gICAgICAgICAgIGxldCBpbnB1dE5hbWUgPSBtZXRob2RzW21ldGhvZE5hbWVdLmlucHV0LiRuYW1lO1xuICAvLyAgICAgICAgICAgbGV0IG91dHB1dE5hbWU9XCJcIjtcbiAgLy8gICAgICAgICAgIGlmKG1ldGhvZHNbbWV0aG9kTmFtZV0ub3V0cHV0IClcbiAgLy8gICAgICAgICAgICAgb3V0cHV0TmFtZSA9IG1ldGhvZHNbbWV0aG9kTmFtZV0ub3V0cHV0LiRuYW1lO1xuICAvLyAgICAgICAgICAgdG9wRWxzW2lucHV0TmFtZV0gPSB7XCJtZXRob2ROYW1lXCI6IG1ldGhvZE5hbWUsIFwib3V0cHV0TmFtZVwiOiBvdXRwdXROYW1lfTtcbiAgLy8gICAgICAgICB9XG4gIC8vICAgICAgIH1cbiAgLy8gICAgIH1cblxuICAvLyAgICAgLy8gcHJlcGFyZSBzb2FwIGVudmVsb3BlIHhtbG5zIGRlZmluaXRpb24gc3RyaW5nXG4gIC8vICAgICBzZWxmLnhtbG5zSW5FbnZlbG9wZSA9IHNlbGYuX3htbG5zTWFwKCk7XG5cbiAgLy8gICAgIHNlbGYuY2FsbGJhY2soZXJyLCBzZWxmKTtcbiAgLy8gICB9KTtcblxuICAvLyB9KTtcbn07XG5cbldTREwucHJvdG90eXBlLmlnbm9yZWROYW1lc3BhY2VzID0gWyd0bnMnLCAndGFyZ2V0TmFtZXNwYWNlJywgJ3R5cGVkTmFtZXNwYWNlJ107XG5cbldTREwucHJvdG90eXBlLmlnbm9yZUJhc2VOYW1lU3BhY2VzID0gZmFsc2U7XG5cbldTREwucHJvdG90eXBlLnZhbHVlS2V5ID0gJyR2YWx1ZSc7XG5XU0RMLnByb3RvdHlwZS54bWxLZXkgPSAnJHhtbCc7XG5cbldTREwucHJvdG90eXBlLl9pbml0aWFsaXplT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHRoaXMuX29yaWdpbmFsSWdub3JlZE5hbWVzcGFjZXMgPSAob3B0aW9ucyB8fCB7fSkuaWdub3JlZE5hbWVzcGFjZXM7XG4gIHRoaXMub3B0aW9ucyA9IHt9O1xuXG4gIGxldCBpZ25vcmVkTmFtZXNwYWNlcyA9IG9wdGlvbnMgPyBvcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzIDogbnVsbDtcblxuICBpZiAoaWdub3JlZE5hbWVzcGFjZXMgJiZcbiAgICAoQXJyYXkuaXNBcnJheShpZ25vcmVkTmFtZXNwYWNlcy5uYW1lc3BhY2VzKSB8fCB0eXBlb2YgaWdub3JlZE5hbWVzcGFjZXMubmFtZXNwYWNlcyA9PT0gJ3N0cmluZycpKSB7XG4gICAgaWYgKGlnbm9yZWROYW1lc3BhY2VzLm92ZXJyaWRlKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMgPSBpZ25vcmVkTmFtZXNwYWNlcy5uYW1lc3BhY2VzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMgPSB0aGlzLmlnbm9yZWROYW1lc3BhY2VzLmNvbmNhdChpZ25vcmVkTmFtZXNwYWNlcy5uYW1lc3BhY2VzKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5vcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzID0gdGhpcy5pZ25vcmVkTmFtZXNwYWNlcztcbiAgfVxuXG4gIHRoaXMub3B0aW9ucy52YWx1ZUtleSA9IG9wdGlvbnMudmFsdWVLZXkgfHwgdGhpcy52YWx1ZUtleTtcbiAgdGhpcy5vcHRpb25zLnhtbEtleSA9IG9wdGlvbnMueG1sS2V5IHx8IHRoaXMueG1sS2V5O1xuICBpZiAob3B0aW9ucy5lc2NhcGVYTUwgIT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMub3B0aW9ucy5lc2NhcGVYTUwgPSBvcHRpb25zLmVzY2FwZVhNTDtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm9wdGlvbnMuZXNjYXBlWE1MID0gdHJ1ZTtcbiAgfVxuICBpZiAob3B0aW9ucy5yZXR1cm5GYXVsdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5vcHRpb25zLnJldHVybkZhdWx0ID0gb3B0aW9ucy5yZXR1cm5GYXVsdDtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm9wdGlvbnMucmV0dXJuRmF1bHQgPSBmYWxzZTtcbiAgfVxuICB0aGlzLm9wdGlvbnMuaGFuZGxlTmlsQXNOdWxsID0gISFvcHRpb25zLmhhbmRsZU5pbEFzTnVsbDtcblxuICBpZiAob3B0aW9ucy5uYW1lc3BhY2VBcnJheUVsZW1lbnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLm9wdGlvbnMubmFtZXNwYWNlQXJyYXlFbGVtZW50cyA9IG9wdGlvbnMubmFtZXNwYWNlQXJyYXlFbGVtZW50cztcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm9wdGlvbnMubmFtZXNwYWNlQXJyYXlFbGVtZW50cyA9IHRydWU7XG4gIH1cblxuICAvLyBBbGxvdyBhbnkgcmVxdWVzdCBoZWFkZXJzIHRvIGtlZXAgcGFzc2luZyB0aHJvdWdoXG4gIHRoaXMub3B0aW9ucy53c2RsX2hlYWRlcnMgPSBvcHRpb25zLndzZGxfaGVhZGVycztcbiAgdGhpcy5vcHRpb25zLndzZGxfb3B0aW9ucyA9IG9wdGlvbnMud3NkbF9vcHRpb25zO1xuICBpZiAob3B0aW9ucy5odHRwQ2xpZW50KSB7XG4gICAgdGhpcy5vcHRpb25zLmh0dHBDbGllbnQgPSBvcHRpb25zLmh0dHBDbGllbnQ7XG4gIH1cblxuICAvLyBUaGUgc3VwcGxpZWQgcmVxdWVzdC1vYmplY3Qgc2hvdWxkIGJlIHBhc3NlZCB0aHJvdWdoXG4gIGlmIChvcHRpb25zLnJlcXVlc3QpIHtcbiAgICB0aGlzLm9wdGlvbnMucmVxdWVzdCA9IG9wdGlvbnMucmVxdWVzdDtcbiAgfVxuXG4gIGxldCBpZ25vcmVCYXNlTmFtZVNwYWNlcyA9IG9wdGlvbnMgPyBvcHRpb25zLmlnbm9yZUJhc2VOYW1lU3BhY2VzIDogbnVsbDtcbiAgaWYgKGlnbm9yZUJhc2VOYW1lU3BhY2VzICE9PSBudWxsICYmIHR5cGVvZiBpZ25vcmVCYXNlTmFtZVNwYWNlcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0aGlzLm9wdGlvbnMuaWdub3JlQmFzZU5hbWVTcGFjZXMgPSBpZ25vcmVCYXNlTmFtZVNwYWNlcztcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm9wdGlvbnMuaWdub3JlQmFzZU5hbWVTcGFjZXMgPSB0aGlzLmlnbm9yZUJhc2VOYW1lU3BhY2VzO1xuICB9XG5cbiAgLy8gV29ya3Mgb25seSBpbiBjbGllbnRcbiAgdGhpcy5vcHRpb25zLmZvcmNlU29hcDEySGVhZGVycyA9IG9wdGlvbnMuZm9yY2VTb2FwMTJIZWFkZXJzO1xuICB0aGlzLm9wdGlvbnMuY3VzdG9tRGVzZXJpYWxpemVyID0gb3B0aW9ucy5jdXN0b21EZXNlcmlhbGl6ZXI7XG5cbiAgaWYgKG9wdGlvbnMub3ZlcnJpZGVSb290RWxlbWVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5vcHRpb25zLm92ZXJyaWRlUm9vdEVsZW1lbnQgPSBvcHRpb25zLm92ZXJyaWRlUm9vdEVsZW1lbnQ7XG4gIH1cblxuICB0aGlzLm9wdGlvbnMudXNlRW1wdHlUYWcgPSAhIW9wdGlvbnMudXNlRW1wdHlUYWc7XG59O1xuXG5XU0RMLnByb3RvdHlwZS5vblJlYWR5ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIGlmIChjYWxsYmFjaylcbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG59O1xuXG5XU0RMLnByb3RvdHlwZS5fcHJvY2Vzc05leHRJbmNsdWRlID0gYXN5bmMgZnVuY3Rpb24gKGluY2x1ZGVzKSB7XG4gIGxldCBzZWxmID0gdGhpcyxcbiAgICBpbmNsdWRlID0gaW5jbHVkZXMuc2hpZnQoKSxcbiAgICBvcHRpb25zO1xuXG4gIGlmICghaW5jbHVkZSlcbiAgICByZXR1cm47IC8vIGNhbGxiYWNrKCk7XG5cbiAgbGV0IGluY2x1ZGVQYXRoO1xuICBpZiAoIS9eaHR0cHM/Oi8udGVzdChzZWxmLnVyaSkgJiYgIS9eaHR0cHM/Oi8udGVzdChpbmNsdWRlLmxvY2F0aW9uKSkge1xuICAgIC8vIGluY2x1ZGVQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShzZWxmLnVyaSksIGluY2x1ZGUubG9jYXRpb24pO1xuICB9IGVsc2Uge1xuICAgIGluY2x1ZGVQYXRoID0gdXJsLnJlc29sdmUoc2VsZi51cmkgfHwgJycsIGluY2x1ZGUubG9jYXRpb24pO1xuICB9XG5cbiAgb3B0aW9ucyA9IF8uYXNzaWduKHt9LCB0aGlzLm9wdGlvbnMpO1xuICAvLyBmb2xsb3cgc3VwcGxpZWQgaWdub3JlZE5hbWVzcGFjZXMgb3B0aW9uXG4gIG9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMgPSB0aGlzLl9vcmlnaW5hbElnbm9yZWROYW1lc3BhY2VzIHx8IHRoaXMub3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcztcbiAgb3B0aW9ucy5XU0RMX0NBQ0hFID0gdGhpcy5XU0RMX0NBQ0hFO1xuXG4gIGNvbnN0IHdzZGwgPSBhd2FpdCBvcGVuX3dzZGxfcmVjdXJzaXZlKGluY2x1ZGVQYXRoLCBvcHRpb25zKVxuICBzZWxmLl9pbmNsdWRlc1dzZGwucHVzaCh3c2RsKTtcblxuICBpZiAod3NkbC5kZWZpbml0aW9ucyBpbnN0YW5jZW9mIERlZmluaXRpb25zRWxlbWVudCkge1xuICAgIF8ubWVyZ2VXaXRoKHNlbGYuZGVmaW5pdGlvbnMsIHdzZGwuZGVmaW5pdGlvbnMsIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICByZXR1cm4gKGEgaW5zdGFuY2VvZiBTY2hlbWFFbGVtZW50KSA/IGEubWVyZ2UoYikgOiB1bmRlZmluZWQ7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5kZWZpbml0aW9ucy5zY2hlbWFzW2luY2x1ZGUubmFtZXNwYWNlIHx8IHdzZGwuZGVmaW5pdGlvbnMuJHRhcmdldE5hbWVzcGFjZV0gPSBkZWVwTWVyZ2Uoc2VsZi5kZWZpbml0aW9ucy5zY2hlbWFzW2luY2x1ZGUubmFtZXNwYWNlIHx8IHdzZGwuZGVmaW5pdGlvbnMuJHRhcmdldE5hbWVzcGFjZV0sIHdzZGwuZGVmaW5pdGlvbnMpO1xuICB9XG5cbiAgcmV0dXJuIHNlbGYuX3Byb2Nlc3NOZXh0SW5jbHVkZShpbmNsdWRlcyk7XG5cbiAgLy8gb3Blbl93c2RsX3JlY3Vyc2l2ZShpbmNsdWRlUGF0aCwgb3B0aW9ucywgZnVuY3Rpb24oZXJyLCB3c2RsKSB7XG4gIC8vICAgaWYgKGVycikge1xuICAvLyAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gIC8vICAgfVxuXG4gIC8vICAgc2VsZi5faW5jbHVkZXNXc2RsLnB1c2god3NkbCk7XG5cbiAgLy8gICBpZiAod3NkbC5kZWZpbml0aW9ucyBpbnN0YW5jZW9mIERlZmluaXRpb25zRWxlbWVudCkge1xuICAvLyAgICAgXy5tZXJnZVdpdGgoc2VsZi5kZWZpbml0aW9ucywgd3NkbC5kZWZpbml0aW9ucywgZnVuY3Rpb24oYSxiKSB7XG4gIC8vICAgICAgIHJldHVybiAoYSBpbnN0YW5jZW9mIFNjaGVtYUVsZW1lbnQpID8gYS5tZXJnZShiKSA6IHVuZGVmaW5lZDtcbiAgLy8gICAgIH0pO1xuICAvLyAgIH0gZWxzZSB7XG4gIC8vICAgICBzZWxmLmRlZmluaXRpb25zLnNjaGVtYXNbaW5jbHVkZS5uYW1lc3BhY2UgfHwgd3NkbC5kZWZpbml0aW9ucy4kdGFyZ2V0TmFtZXNwYWNlXSA9IGRlZXBNZXJnZShzZWxmLmRlZmluaXRpb25zLnNjaGVtYXNbaW5jbHVkZS5uYW1lc3BhY2UgfHwgd3NkbC5kZWZpbml0aW9ucy4kdGFyZ2V0TmFtZXNwYWNlXSwgd3NkbC5kZWZpbml0aW9ucyk7XG4gIC8vICAgfVxuICAvLyAgIHNlbGYuX3Byb2Nlc3NOZXh0SW5jbHVkZShpbmNsdWRlcywgZnVuY3Rpb24oZXJyKSB7XG4gIC8vICAgICBjYWxsYmFjayhlcnIpO1xuICAvLyAgIH0pO1xuICAvLyB9KTtcbn07XG5cbldTREwucHJvdG90eXBlLnByb2Nlc3NJbmNsdWRlcyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgbGV0IHNjaGVtYXMgPSB0aGlzLmRlZmluaXRpb25zLnNjaGVtYXMsXG4gICAgaW5jbHVkZXMgPSBbXTtcblxuICBmb3IgKGxldCBucyBpbiBzY2hlbWFzKSB7XG4gICAgbGV0IHNjaGVtYSA9IHNjaGVtYXNbbnNdO1xuICAgIGluY2x1ZGVzID0gaW5jbHVkZXMuY29uY2F0KHNjaGVtYS5pbmNsdWRlcyB8fCBbXSk7XG4gIH1cblxuICByZXR1cm4gdGhpcy5fcHJvY2Vzc05leHRJbmNsdWRlKGluY2x1ZGVzKTtcbn07XG5cbldTREwucHJvdG90eXBlLmRlc2NyaWJlU2VydmljZXMgPSBmdW5jdGlvbiAoKSB7XG4gIGxldCBzZXJ2aWNlcyA9IHt9O1xuICBmb3IgKGxldCBuYW1lIGluIHRoaXMuc2VydmljZXMpIHtcbiAgICBsZXQgc2VydmljZSA9IHRoaXMuc2VydmljZXNbbmFtZV07XG4gICAgc2VydmljZXNbbmFtZV0gPSBzZXJ2aWNlLmRlc2NyaXB0aW9uKHRoaXMuZGVmaW5pdGlvbnMpO1xuICB9XG4gIHJldHVybiBzZXJ2aWNlcztcbn07XG5cbldTREwucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy54bWwgfHwgJyc7XG59O1xuXG5XU0RMLnByb3RvdHlwZS54bWxUb09iamVjdCA9IGZ1bmN0aW9uICh4bWwsIGNhbGxiYWNrKSB7XG4gIGxldCBzZWxmID0gdGhpcztcbiAgbGV0IHAgPSB0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicgPyB7fSA6IHNheC5wYXJzZXIodHJ1ZSk7XG4gIGxldCBvYmplY3ROYW1lID0gbnVsbDtcbiAgbGV0IHJvb3Q6IGFueSA9IHt9O1xuICBsZXQgc2NoZW1hID0ge307XG4gIC8qbGV0IHNjaGVtYSA9IHtcbiAgICBFbnZlbG9wZToge1xuICAgICAgSGVhZGVyOiB7XG4gICAgICAgIFNlY3VyaXR5OiB7XG4gICAgICAgICAgVXNlcm5hbWVUb2tlbjoge1xuICAgICAgICAgICAgVXNlcm5hbWU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgUGFzc3dvcmQ6ICdzdHJpbmcnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgQm9keToge1xuICAgICAgICBGYXVsdDoge1xuICAgICAgICAgIGZhdWx0Y29kZTogJ3N0cmluZycsXG4gICAgICAgICAgZmF1bHRzdHJpbmc6ICdzdHJpbmcnLFxuICAgICAgICAgIGRldGFpbDogJ3N0cmluZydcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTsqL1xuICBpZighdGhpcy5vcHRpb25zLmZvcmNlU29hcDEySGVhZGVycyl7XG4gICAgc2NoZW1hID17XG4gICAgICBFbnZlbG9wZToge1xuICAgICAgICBIZWFkZXI6IHtcbiAgICAgICAgICBTZWN1cml0eToge1xuICAgICAgICAgICAgVXNlcm5hbWVUb2tlbjoge1xuICAgICAgICAgICAgICBVc2VybmFtZTonc3RyaW5nJyxcbiAgICAgICAgICAgICAgUGFzc3dvcmQ6J3N0cmluZydcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIEJvZHk6e1xuICAgICAgICAgIEZhdWx0OiB7XG4gICAgICAgICAgICBmYXVsdGNvZGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgZmF1bHRzdHJpbmc6ICdzdHJpbmcnLFxuICAgICAgICAgICAgZGV0YWlsOidzdHJpbmcnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHNjaGVtYSA9IHtcbiAgICAgIEVudmVsb3BlOiB7XG4gICAgICAgIEhlYWRlcjoge1xuICAgICAgICAgIFNlY3VyaXR5OiB7XG4gICAgICAgICAgICBVc2VybmFtZVRva2VuOiB7XG4gICAgICAgICAgICAgIFVzZXJuYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgUGFzc3dvcmQ6ICdzdHJpbmcnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBCb2R5OiB7XG4gICAgICAgICAgQ29kZToge1xuICAgICAgICAgICAgVmFsdWU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgU3ViY29kZTpcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBWYWx1ZTogJ3N0cmluZydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBSZWFzb246IHtUZXh0OiAnc3RyaW5nJ30sXG4gICAgICAgICAgc3RhdHVzQ29kZTogJ251bWJlcicsXG4gICAgICAgICAgRGV0YWlsOiAnb2JqZWN0J1xuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgIH1cbiAgfVxuICAgICAgbGV0IHN0YWNrOiBhbnlbXSA9IFt7IG5hbWU6IG51bGwsIG9iamVjdDogcm9vdCwgc2NoZW1hOiBzY2hlbWEgfV07XG4gIGxldCB4bWxuczogYW55ID0ge307XG5cbiAgbGV0IHJlZnMgPSB7fSwgaWQ7IC8vIHtpZDp7aHJlZnM6W10sb2JqOn0sIC4uLn1cblxuICBwLm9ub3BlbnRhZyA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgbGV0IG5zTmFtZSA9IG5vZGUubmFtZTtcbiAgICBsZXQgYXR0cnM6IGFueSA9IG5vZGUuYXR0cmlidXRlcztcbiAgICBsZXQgbmFtZSA9IHNwbGl0UU5hbWUobnNOYW1lKS5uYW1lLFxuICAgICAgYXR0cmlidXRlTmFtZSxcbiAgICAgIHRvcCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdLFxuICAgICAgdG9wU2NoZW1hID0gdG9wLnNjaGVtYSxcbiAgICAgIGVsZW1lbnRBdHRyaWJ1dGVzID0ge30sXG4gICAgICBoYXNOb25YbWxuc0F0dHJpYnV0ZSA9IGZhbHNlLFxuICAgICAgaGFzTmlsQXR0cmlidXRlID0gZmFsc2UsXG4gICAgICBvYmogPSB7fTtcbiAgICBsZXQgb3JpZ2luYWxOYW1lID0gbmFtZTtcblxuICAgIGlmICghb2JqZWN0TmFtZSAmJiB0b3AubmFtZSA9PT0gJ0JvZHknICYmIG5hbWUgIT09ICdGYXVsdCcpIHtcbiAgICAgIGxldCBtZXNzYWdlID0gc2VsZi5kZWZpbml0aW9ucy5tZXNzYWdlc1tuYW1lXTtcbiAgICAgIC8vIFN1cHBvcnQgUlBDL2xpdGVyYWwgbWVzc2FnZXMgd2hlcmUgcmVzcG9uc2UgYm9keSBjb250YWlucyBvbmUgZWxlbWVudCBuYW1lZFxuICAgICAgLy8gYWZ0ZXIgdGhlIG9wZXJhdGlvbiArICdSZXNwb25zZScuIFNlZSBodHRwOi8vd3d3LnczLm9yZy9UUi93c2RsI19uYW1lc1xuICAgICAgaWYgKCFtZXNzYWdlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gRGV0ZXJtaW5lIGlmIHRoaXMgaXMgcmVxdWVzdCBvciByZXNwb25zZVxuICAgICAgICAgIGxldCBpc0lucHV0ID0gZmFsc2U7XG4gICAgICAgICAgbGV0IGlzT3V0cHV0ID0gZmFsc2U7XG4gICAgICAgICAgaWYgKCgvUmVzcG9uc2UkLykudGVzdChuYW1lKSkge1xuICAgICAgICAgICAgaXNPdXRwdXQgPSB0cnVlO1xuICAgICAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvUmVzcG9uc2UkLywgJycpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoKC9SZXF1ZXN0JC8pLnRlc3QobmFtZSkpIHtcbiAgICAgICAgICAgIGlzSW5wdXQgPSB0cnVlO1xuICAgICAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvUmVxdWVzdCQvLCAnJyk7XG4gICAgICAgICAgfSBlbHNlIGlmICgoL1NvbGljaXQkLykudGVzdChuYW1lKSkge1xuICAgICAgICAgICAgaXNJbnB1dCA9IHRydWU7XG4gICAgICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9Tb2xpY2l0JC8sICcnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gTG9vayB1cCB0aGUgYXBwcm9wcmlhdGUgbWVzc2FnZSBhcyBnaXZlbiBpbiB0aGUgcG9ydFR5cGUncyBvcGVyYXRpb25zXG4gICAgICAgICAgbGV0IHBvcnRUeXBlcyA9IHNlbGYuZGVmaW5pdGlvbnMucG9ydFR5cGVzO1xuICAgICAgICAgIGxldCBwb3J0VHlwZU5hbWVzID0gT2JqZWN0LmtleXMocG9ydFR5cGVzKTtcbiAgICAgICAgICAvLyBDdXJyZW50bHkgdGhpcyBzdXBwb3J0cyBvbmx5IG9uZSBwb3J0VHlwZSBkZWZpbml0aW9uLlxuICAgICAgICAgIGxldCBwb3J0VHlwZSA9IHBvcnRUeXBlc1twb3J0VHlwZU5hbWVzWzBdXTtcbiAgICAgICAgICBpZiAoaXNJbnB1dCkge1xuICAgICAgICAgICAgbmFtZSA9IHBvcnRUeXBlLm1ldGhvZHNbbmFtZV0uaW5wdXQuJG5hbWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5hbWUgPSBwb3J0VHlwZS5tZXRob2RzW25hbWVdLm91dHB1dC4kbmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbWVzc2FnZSA9IHNlbGYuZGVmaW5pdGlvbnMubWVzc2FnZXNbbmFtZV07XG4gICAgICAgICAgLy8gJ2NhY2hlJyB0aGlzIGFsaWFzIHRvIHNwZWVkIGZ1dHVyZSBsb29rdXBzXG4gICAgICAgICAgc2VsZi5kZWZpbml0aW9ucy5tZXNzYWdlc1tvcmlnaW5hbE5hbWVdID0gc2VsZi5kZWZpbml0aW9ucy5tZXNzYWdlc1tuYW1lXTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMucmV0dXJuRmF1bHQpIHtcbiAgICAgICAgICAgIHAub25lcnJvcihlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdG9wU2NoZW1hID0gbWVzc2FnZS5kZXNjcmlwdGlvbihzZWxmLmRlZmluaXRpb25zKTtcbiAgICAgIG9iamVjdE5hbWUgPSBvcmlnaW5hbE5hbWU7XG4gICAgfVxuXG4gICAgaWYgKGF0dHJzLmhyZWYpIHtcbiAgICAgIGlkID0gYXR0cnMuaHJlZi5zdWJzdHIoMSk7XG4gICAgICBpZiAoIXJlZnNbaWRdKSB7XG4gICAgICAgIHJlZnNbaWRdID0geyBocmVmczogW10sIG9iajogbnVsbCB9O1xuICAgICAgfVxuICAgICAgcmVmc1tpZF0uaHJlZnMucHVzaCh7IHBhcjogdG9wLm9iamVjdCwga2V5OiBuYW1lLCBvYmo6IG9iaiB9KTtcbiAgICB9XG4gICAgaWYgKGlkID0gYXR0cnMuaWQpIHtcbiAgICAgIGlmICghcmVmc1tpZF0pIHtcbiAgICAgICAgcmVmc1tpZF0gPSB7IGhyZWZzOiBbXSwgb2JqOiBudWxsIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9IYW5kbGUgZWxlbWVudCBhdHRyaWJ1dGVzXG4gICAgZm9yIChhdHRyaWJ1dGVOYW1lIGluIGF0dHJzKSB7XG4gICAgICBpZiAoL154bWxuczp8XnhtbG5zJC8udGVzdChhdHRyaWJ1dGVOYW1lKSkge1xuICAgICAgICB4bWxuc1tzcGxpdFFOYW1lKGF0dHJpYnV0ZU5hbWUpLm5hbWVdID0gYXR0cnNbYXR0cmlidXRlTmFtZV07XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaGFzTm9uWG1sbnNBdHRyaWJ1dGUgPSB0cnVlO1xuICAgICAgZWxlbWVudEF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPSBhdHRyc1thdHRyaWJ1dGVOYW1lXTtcbiAgICB9XG5cbiAgICBmb3IgKGF0dHJpYnV0ZU5hbWUgaW4gZWxlbWVudEF0dHJpYnV0ZXMpIHtcbiAgICAgIGxldCByZXMgPSBzcGxpdFFOYW1lKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgaWYgKHJlcy5uYW1lID09PSAnbmlsJyAmJiB4bWxuc1tyZXMucHJlZml4XSA9PT0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlJyAmJiBlbGVtZW50QXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSAmJlxuICAgICAgICAoZWxlbWVudEF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0udG9Mb3dlckNhc2UoKSA9PT0gJ3RydWUnIHx8IGVsZW1lbnRBdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID09PSAnMScpXG4gICAgICApIHtcbiAgICAgICAgaGFzTmlsQXR0cmlidXRlID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhhc05vblhtbG5zQXR0cmlidXRlKSB7XG4gICAgICBvYmpbc2VsZi5vcHRpb25zLmF0dHJpYnV0ZXNLZXldID0gZWxlbWVudEF0dHJpYnV0ZXM7XG4gICAgfVxuXG4gICAgLy8gUGljayB1cCB0aGUgc2NoZW1hIGZvciB0aGUgdHlwZSBzcGVjaWZpZWQgaW4gZWxlbWVudCdzIHhzaTp0eXBlIGF0dHJpYnV0ZS5cbiAgICBsZXQgeHNpVHlwZVNjaGVtYTtcbiAgICBsZXQgeHNpVHlwZSA9IGVsZW1lbnRBdHRyaWJ1dGVzWyd4c2k6dHlwZSddO1xuICAgIGlmICh4c2lUeXBlKSB7XG4gICAgICBsZXQgdHlwZSA9IHNwbGl0UU5hbWUoeHNpVHlwZSk7XG4gICAgICBsZXQgdHlwZVVSSTtcbiAgICAgIGlmICh0eXBlLnByZWZpeCA9PT0gVE5TX1BSRUZJWCkge1xuICAgICAgICAvLyBJbiBjYXNlIG9mIHhzaTp0eXBlID0gXCJNeVR5cGVcIlxuICAgICAgICB0eXBlVVJJID0geG1sbnNbdHlwZS5wcmVmaXhdIHx8IHhtbG5zLnhtbG5zO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHlwZVVSSSA9IHhtbG5zW3R5cGUucHJlZml4XTtcbiAgICAgIH1cbiAgICAgIGxldCB0eXBlRGVmID0gc2VsZi5maW5kU2NoZW1hT2JqZWN0KHR5cGVVUkksIHR5cGUubmFtZSk7XG4gICAgICBpZiAodHlwZURlZikge1xuICAgICAgICB4c2lUeXBlU2NoZW1hID0gdHlwZURlZi5kZXNjcmlwdGlvbihzZWxmLmRlZmluaXRpb25zKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodG9wU2NoZW1hICYmIHRvcFNjaGVtYVtuYW1lICsgJ1tdJ10pIHtcbiAgICAgIG5hbWUgPSBuYW1lICsgJ1tdJztcbiAgICB9XG4gICAgc3RhY2sucHVzaCh7XG4gICAgICBuYW1lOiBvcmlnaW5hbE5hbWUsXG4gICAgICBvYmplY3Q6IG9iaixcbiAgICAgIHNjaGVtYTogKHhzaVR5cGVTY2hlbWEgfHwgKHRvcFNjaGVtYSAmJiB0b3BTY2hlbWFbbmFtZV0pKSxcbiAgICAgIGlkOiBhdHRycy5pZCxcbiAgICAgIG5pbDogaGFzTmlsQXR0cmlidXRlXG4gICAgfSk7XG4gIH07XG5cbiAgcC5vbmNsb3NldGFnID0gZnVuY3Rpb24gKG5zTmFtZSkge1xuICAgIGxldCBjdXI6IGFueSA9IHN0YWNrLnBvcCgpLFxuICAgICAgb2JqID0gY3VyLm9iamVjdCxcbiAgICAgIHRvcCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdLFxuICAgICAgdG9wT2JqZWN0ID0gdG9wLm9iamVjdCxcbiAgICAgIHRvcFNjaGVtYSA9IHRvcC5zY2hlbWEsXG4gICAgICBuYW1lID0gc3BsaXRRTmFtZShuc05hbWUpLm5hbWU7XG5cbiAgICBpZiAodHlwZW9mIGN1ci5zY2hlbWEgPT09ICdzdHJpbmcnICYmIChjdXIuc2NoZW1hID09PSAnc3RyaW5nJyB8fCAoPHN0cmluZz5jdXIuc2NoZW1hKS5zcGxpdCgnOicpWzFdID09PSAnc3RyaW5nJykpIHtcbiAgICAgIGlmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA9PT0gMCkgb2JqID0gY3VyLm9iamVjdCA9ICcnO1xuICAgIH1cblxuICAgIGlmIChjdXIubmlsID09PSB0cnVlKSB7XG4gICAgICBpZiAoc2VsZi5vcHRpb25zLmhhbmRsZU5pbEFzTnVsbCkge1xuICAgICAgICBvYmogPSBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChfLmlzUGxhaW5PYmplY3Qob2JqKSAmJiAhT2JqZWN0LmtleXMob2JqKS5sZW5ndGgpIHtcbiAgICAgIG9iaiA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRvcFNjaGVtYSAmJiB0b3BTY2hlbWFbbmFtZSArICdbXSddKSB7XG4gICAgICBpZiAoIXRvcE9iamVjdFtuYW1lXSkge1xuICAgICAgICB0b3BPYmplY3RbbmFtZV0gPSBbXTtcbiAgICAgIH1cbiAgICAgIHRvcE9iamVjdFtuYW1lXS5wdXNoKG9iaik7XG4gICAgfSBlbHNlIGlmIChuYW1lIGluIHRvcE9iamVjdCkge1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHRvcE9iamVjdFtuYW1lXSkpIHtcbiAgICAgICAgdG9wT2JqZWN0W25hbWVdID0gW3RvcE9iamVjdFtuYW1lXV07XG4gICAgICB9XG4gICAgICB0b3BPYmplY3RbbmFtZV0ucHVzaChvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB0b3BPYmplY3RbbmFtZV0gPSBvYmo7XG4gICAgfVxuXG4gICAgaWYgKGN1ci5pZCkge1xuICAgICAgcmVmc1tjdXIuaWRdLm9iaiA9IG9iajtcbiAgICB9XG4gIH07XG5cbiAgcC5vbmNkYXRhID0gZnVuY3Rpb24gKHRleHQpIHtcbiAgICBsZXQgb3JpZ2luYWxUZXh0ID0gdGV4dDtcbiAgICB0ZXh0ID0gdHJpbSh0ZXh0KTtcbiAgICBpZiAoIXRleHQubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKC88XFw/eG1sW1xcc1xcU10rXFw/Pi8udGVzdCh0ZXh0KSkge1xuICAgICAgbGV0IHRvcCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgICAgbGV0IHZhbHVlID0gc2VsZi54bWxUb09iamVjdCh0ZXh0KTtcbiAgICAgIGlmICh0b3Aub2JqZWN0W3NlbGYub3B0aW9ucy5hdHRyaWJ1dGVzS2V5XSkge1xuICAgICAgICB0b3Aub2JqZWN0W3NlbGYub3B0aW9ucy52YWx1ZUtleV0gPSB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRvcC5vYmplY3QgPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcC5vbnRleHQob3JpZ2luYWxUZXh0KTtcbiAgICB9XG4gIH07XG5cbiAgcC5vbmVycm9yID0gZnVuY3Rpb24gKGUpIHtcbiAgICBwLnJlc3VtZSgpO1xuICAgIHRocm93IHtcbiAgICAgIEZhdWx0OiB7XG4gICAgICAgIGZhdWx0Y29kZTogNTAwLFxuICAgICAgICBmYXVsdHN0cmluZzogJ0ludmFsaWQgWE1MJyxcbiAgICAgICAgZGV0YWlsOiBuZXcgRXJyb3IoZSkubWVzc2FnZSxcbiAgICAgICAgc3RhdHVzQ29kZTogNTAwXG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICBwLm9udGV4dCA9IGZ1bmN0aW9uICh0ZXh0KSB7XG4gICAgbGV0IG9yaWdpbmFsVGV4dCA9IHRleHQ7XG4gICAgdGV4dCA9IHRyaW0odGV4dCk7XG4gICAgaWYgKCF0ZXh0Lmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCB0b3AgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICBsZXQgbmFtZSA9IHNwbGl0UU5hbWUodG9wLnNjaGVtYSkubmFtZSxcbiAgICAgIHZhbHVlO1xuICAgIGlmIChzZWxmLm9wdGlvbnMgJiYgc2VsZi5vcHRpb25zLmN1c3RvbURlc2VyaWFsaXplciAmJiBzZWxmLm9wdGlvbnMuY3VzdG9tRGVzZXJpYWxpemVyW25hbWVdKSB7XG4gICAgICB2YWx1ZSA9IHNlbGYub3B0aW9ucy5jdXN0b21EZXNlcmlhbGl6ZXJbbmFtZV0odGV4dCwgdG9wKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpZiAobmFtZSA9PT0gJ2ludCcgfHwgbmFtZSA9PT0gJ2ludGVnZXInKSB7XG4gICAgICAgIHZhbHVlID0gcGFyc2VJbnQodGV4dCwgMTApO1xuICAgICAgfSBlbHNlIGlmIChuYW1lID09PSAnYm9vbCcgfHwgbmFtZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHZhbHVlID0gdGV4dC50b0xvd2VyQ2FzZSgpID09PSAndHJ1ZScgfHwgdGV4dCA9PT0gJzEnO1xuICAgICAgfSBlbHNlIGlmIChuYW1lID09PSAnZGF0ZVRpbWUnIHx8IG5hbWUgPT09ICdkYXRlJykge1xuICAgICAgICB2YWx1ZSA9IG5ldyBEYXRlKHRleHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5wcmVzZXJ2ZVdoaXRlc3BhY2UpIHtcbiAgICAgICAgICB0ZXh0ID0gb3JpZ2luYWxUZXh0O1xuICAgICAgICB9XG4gICAgICAgIC8vIGhhbmRsZSBzdHJpbmcgb3Igb3RoZXIgdHlwZXNcbiAgICAgICAgaWYgKHR5cGVvZiB0b3Aub2JqZWN0ICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIHZhbHVlID0gdGV4dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IHRvcC5vYmplY3QgKyB0ZXh0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRvcC5vYmplY3Rbc2VsZi5vcHRpb25zLmF0dHJpYnV0ZXNLZXldKSB7XG4gICAgICB0b3Aub2JqZWN0W3NlbGYub3B0aW9ucy52YWx1ZUtleV0gPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdG9wLm9iamVjdCA9IHZhbHVlO1xuICAgIH1cbiAgfTtcblxuICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gd2UgYmUgc3RyZWFtaW5nXG4gICAgbGV0IHNheFN0cmVhbSA9IHNheC5jcmVhdGVTdHJlYW0odHJ1ZSk7XG4gICAgc2F4U3RyZWFtLm9uKCdvcGVudGFnJywgcC5vbm9wZW50YWcpO1xuICAgIHNheFN0cmVhbS5vbignY2xvc2V0YWcnLCBwLm9uY2xvc2V0YWcpO1xuICAgIHNheFN0cmVhbS5vbignY2RhdGEnLCBwLm9uY2RhdGEpO1xuICAgIHNheFN0cmVhbS5vbigndGV4dCcsIHAub250ZXh0KTtcbiAgICB4bWwucGlwZShzYXhTdHJlYW0pXG4gICAgICAub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgfSlcbiAgICAgIC5vbignZW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgcjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByID0gZmluaXNoKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZSk7XG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcik7XG4gICAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cbiAgcC53cml0ZSh4bWwpLmNsb3NlKCk7XG5cbiAgcmV0dXJuIGZpbmlzaCgpO1xuXG4gIGZ1bmN0aW9uIGZpbmlzaCgpIHtcbiAgICAvLyBNdWx0aVJlZiBzdXBwb3J0OiBtZXJnZSBvYmplY3RzIGluc3RlYWQgb2YgcmVwbGFjaW5nXG4gICAgZm9yIChsZXQgbiBpbiByZWZzKSB7XG4gICAgICBsZXQgcmVmID0gcmVmc1tuXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVmLmhyZWZzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIF8uYXNzaWduKHJlZi5ocmVmc1tpXS5vYmosIHJlZi5vYmopO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyb290LkVudmVsb3BlKSB7XG4gICAgICBsZXQgYm9keSA9IHJvb3QuRW52ZWxvcGUuQm9keTtcbiAgICAgIGxldCBlcnJvcjogYW55O1xuICAgICAgaWYgKGJvZHkgJiYgYm9keS5GYXVsdCkge1xuICAgICAgICBpZighYm9keS5GYXVsdC5Db2RlKSB7XG4gICAgICAgICAgbGV0IGNvZGUgPSBib2R5LkZhdWx0LmZhdWx0Y29kZSAmJiBib2R5LkZhdWx0LmZhdWx0Y29kZS4kdmFsdWU7XG4gICAgICAgICAgbGV0IHN0cmluZyA9IGJvZHkuRmF1bHQuZmF1bHRzdHJpbmcgJiYgYm9keS5GYXVsdC5mYXVsdHN0cmluZy4kdmFsdWU7XG4gICAgICAgICAgbGV0IGRldGFpbCA9IGJvZHkuRmF1bHQuZGV0YWlsICYmIGJvZHkuRmF1bHQuZGV0YWlsLiR2YWx1ZTtcblxuICAgICAgICAgIGNvZGUgPSBjb2RlIHx8IGJvZHkuRmF1bHQuZmF1bHRjb2RlO1xuICAgICAgICAgIHN0cmluZyA9IHN0cmluZyB8fCBib2R5LkZhdWx0LmZhdWx0c3RyaW5nO1xuICAgICAgICAgIGRldGFpbCA9IGRldGFpbCB8fCBib2R5LkZhdWx0LmRldGFpbDtcblxuICAgICAgICAgIGxldCBlcnJvcjogYW55ID0gbmV3IEVycm9yKGNvZGUgKyAnOiAnICsgc3RyaW5nICsgKGRldGFpbCA/ICc6ICcgKyBkZXRhaWwgOiAnJykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxldCBjb2RlID0gYm9keS5GYXVsdC5Db2RlLlZhbHVlO1xuICAgICAgICAgIGxldCBzdHJpbmcgPSBib2R5LkZhdWx0LlJlYXNvbi5UZXh0LiR2YWx1ZTtcbiAgICAgICAgICBsZXQgZGV0YWlsID0gYm9keS5GYXVsdC5EZXRhaWwuaW5mbztcbiAgICAgICAgICBlcnJvciA9IG5ldyBFcnJvcihjb2RlICsgJzogJyArIHN0cmluZyArIChkZXRhaWwgPyAnOiAnICsgZGV0YWlsIDogJycpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVycm9yLnJvb3QgPSByb290O1xuICAgICAgICB0aHJvdyBib2R5LkZhdWx0O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJvb3QuRW52ZWxvcGU7XG4gICAgfVxuICAgIHJldHVybiByb290O1xuICB9XG59O1xuXG4vKipcbiAqIExvb2sgdXAgYSBYU0QgdHlwZSBvciBlbGVtZW50IGJ5IG5hbWVzcGFjZSBVUkkgYW5kIG5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSBuc1VSSSBOYW1lc3BhY2UgVVJJXG4gKiBAcGFyYW0ge1N0cmluZ30gcW5hbWUgTG9jYWwgb3IgcXVhbGlmaWVkIG5hbWVcbiAqIEByZXR1cm5zIHsqfSBUaGUgWFNEIHR5cGUvZWxlbWVudCBkZWZpbml0aW9uXG4gKi9cbldTREwucHJvdG90eXBlLmZpbmRTY2hlbWFPYmplY3QgPSBmdW5jdGlvbiAobnNVUkksIHFuYW1lKSB7XG4gIGlmICghbnNVUkkgfHwgIXFuYW1lKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBsZXQgZGVmID0gbnVsbDtcblxuICBpZiAodGhpcy5kZWZpbml0aW9ucy5zY2hlbWFzKSB7XG4gICAgbGV0IHNjaGVtYSA9IHRoaXMuZGVmaW5pdGlvbnMuc2NoZW1hc1tuc1VSSV07XG4gICAgaWYgKHNjaGVtYSkge1xuICAgICAgaWYgKHFuYW1lLmluZGV4T2YoJzonKSAhPT0gLTEpIHtcbiAgICAgICAgcW5hbWUgPSBxbmFtZS5zdWJzdHJpbmcocW5hbWUuaW5kZXhPZignOicpICsgMSwgcW5hbWUubGVuZ3RoKTtcbiAgICAgIH1cblxuICAgICAgLy8gaWYgdGhlIGNsaWVudCBwYXNzZWQgYW4gaW5wdXQgZWxlbWVudCB3aGljaCBoYXMgYSBgJGxvb2t1cFR5cGVgIHByb3BlcnR5IGluc3RlYWQgb2YgYCR0eXBlYFxuICAgICAgLy8gdGhlIGBkZWZgIGlzIGZvdW5kIGluIGBzY2hlbWEuZWxlbWVudHNgLlxuICAgICAgZGVmID0gc2NoZW1hLmNvbXBsZXhUeXBlc1txbmFtZV0gfHwgc2NoZW1hLnR5cGVzW3FuYW1lXSB8fCBzY2hlbWEuZWxlbWVudHNbcW5hbWVdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkZWY7XG59O1xuXG4vKipcbiAqIENyZWF0ZSBkb2N1bWVudCBzdHlsZSB4bWwgc3RyaW5nIGZyb20gdGhlIHBhcmFtZXRlcnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0geyp9IHBhcmFtc1xuICogQHBhcmFtIHtTdHJpbmd9IG5zUHJlZml4XG4gKiBAcGFyYW0ge1N0cmluZ30gbnNVUklcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKi9cbldTREwucHJvdG90eXBlLm9iamVjdFRvRG9jdW1lbnRYTUwgPSBmdW5jdGlvbiAobmFtZSwgcGFyYW1zLCBuc1ByZWZpeCwgbnNVUkksIHR5cGUpIHtcbiAgLy9JZiB1c2VyIHN1cHBsaWVzIFhNTCBhbHJlYWR5LCBqdXN0IHVzZSB0aGF0LiAgWE1MIERlY2xhcmF0aW9uIHNob3VsZCBub3QgYmUgcHJlc2VudC5cbiAgaWYgKHBhcmFtcyAmJiBwYXJhbXMuX3htbCkge1xuICAgIHJldHVybiBwYXJhbXMuX3htbDtcbiAgfVxuICBsZXQgYXJncyA9IHt9O1xuICBhcmdzW25hbWVdID0gcGFyYW1zO1xuICBsZXQgcGFyYW1ldGVyVHlwZU9iaiA9IHR5cGUgPyB0aGlzLmZpbmRTY2hlbWFPYmplY3QobnNVUkksIHR5cGUpIDogbnVsbDtcbiAgcmV0dXJuIHRoaXMub2JqZWN0VG9YTUwoYXJncywgbnVsbCwgbnNQcmVmaXgsIG5zVVJJLCB0cnVlLCBudWxsLCBwYXJhbWV0ZXJUeXBlT2JqKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIFJQQyBzdHlsZSB4bWwgc3RyaW5nIGZyb20gdGhlIHBhcmFtZXRlcnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0geyp9IHBhcmFtc1xuICogQHBhcmFtIHtTdHJpbmd9IG5zUHJlZml4XG4gKiBAcGFyYW0ge1N0cmluZ30gbnNVUklcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbldTREwucHJvdG90eXBlLm9iamVjdFRvUnBjWE1MID0gZnVuY3Rpb24gKG5hbWUsIHBhcmFtcywgbnNQcmVmaXgsIG5zVVJJLCBpc1BhcnRzKSB7XG4gIGxldCBwYXJ0cyA9IFtdO1xuICBsZXQgZGVmcyA9IHRoaXMuZGVmaW5pdGlvbnM7XG4gIGxldCBuc0F0dHJOYW1lID0gJ194bWxucyc7XG5cbiAgbnNQcmVmaXggPSBuc1ByZWZpeCB8fCBmaW5kUHJlZml4KGRlZnMueG1sbnMsIG5zVVJJKTtcblxuICBuc1VSSSA9IG5zVVJJIHx8IGRlZnMueG1sbnNbbnNQcmVmaXhdO1xuICBuc1ByZWZpeCA9IG5zUHJlZml4ID09PSBUTlNfUFJFRklYID8gJycgOiAobnNQcmVmaXggKyAnOicpO1xuXG4gIHBhcnRzLnB1c2goWyc8JywgbnNQcmVmaXgsIG5hbWUsICc+J10uam9pbignJykpO1xuXG4gIGZvciAobGV0IGtleSBpbiBwYXJhbXMpIHtcbiAgICBpZiAoIXBhcmFtcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKGtleSAhPT0gbnNBdHRyTmFtZSkge1xuICAgICAgbGV0IHZhbHVlID0gcGFyYW1zW2tleV07XG4gICAgICBsZXQgcHJlZml4ZWRLZXkgPSAoaXNQYXJ0cyA/ICcnIDogbnNQcmVmaXgpICsga2V5O1xuICAgICAgbGV0IGF0dHJpYnV0ZXMgPSBbXTtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlLmhhc093blByb3BlcnR5KHRoaXMub3B0aW9ucy5hdHRyaWJ1dGVzS2V5KSkge1xuICAgICAgICBsZXQgYXR0cnMgPSB2YWx1ZVt0aGlzLm9wdGlvbnMuYXR0cmlidXRlc0tleV07XG4gICAgICAgIGZvciAobGV0IG4gaW4gYXR0cnMpIHtcbiAgICAgICAgICBhdHRyaWJ1dGVzLnB1c2goJyAnICsgbiArICc9JyArICdcIicgKyBhdHRyc1tuXSArICdcIicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBwYXJ0cy5wdXNoKFsnPCcsIHByZWZpeGVkS2V5XS5jb25jYXQoYXR0cmlidXRlcykuY29uY2F0KCc+Jykuam9pbignJykpO1xuICAgICAgcGFydHMucHVzaCgodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JykgPyB0aGlzLm9iamVjdFRvWE1MKHZhbHVlLCBrZXksIG5zUHJlZml4LCBuc1VSSSkgOiB4bWxFc2NhcGUodmFsdWUpKTtcbiAgICAgIHBhcnRzLnB1c2goWyc8LycsIHByZWZpeGVkS2V5LCAnPiddLmpvaW4oJycpKTtcbiAgICB9XG4gIH1cbiAgcGFydHMucHVzaChbJzwvJywgbnNQcmVmaXgsIG5hbWUsICc+J10uam9pbignJykpO1xuICByZXR1cm4gcGFydHMuam9pbignJyk7XG59O1xuXG5cbmZ1bmN0aW9uIGFwcGVuZENvbG9uKG5zKSB7XG4gIHJldHVybiAobnMgJiYgbnMuY2hhckF0KG5zLmxlbmd0aCAtIDEpICE9PSAnOicpID8gbnMgKyAnOicgOiBucztcbn1cblxuZnVuY3Rpb24gbm9Db2xvbk5hbWVTcGFjZShucykge1xuICByZXR1cm4gKG5zICYmIG5zLmNoYXJBdChucy5sZW5ndGggLSAxKSA9PT0gJzonKSA/IG5zLnN1YnN0cmluZygwLCBucy5sZW5ndGggLSAxKSA6IG5zO1xufVxuXG5XU0RMLnByb3RvdHlwZS5pc0lnbm9yZWROYW1lU3BhY2UgPSBmdW5jdGlvbiAobnMpIHtcbiAgcmV0dXJuIHRoaXMub3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcy5pbmRleE9mKG5zKSA+IC0xO1xufTtcblxuV1NETC5wcm90b3R5cGUuZmlsdGVyT3V0SWdub3JlZE5hbWVTcGFjZSA9IGZ1bmN0aW9uIChucykge1xuICBsZXQgbmFtZXNwYWNlID0gbm9Db2xvbk5hbWVTcGFjZShucyk7XG4gIHJldHVybiB0aGlzLmlzSWdub3JlZE5hbWVTcGFjZShuYW1lc3BhY2UpID8gJycgOiBuYW1lc3BhY2U7XG59O1xuXG5cblxuLyoqXG4gKiBDb252ZXJ0IGFuIG9iamVjdCB0byBYTUwuICBUaGlzIGlzIGEgcmVjdXJzaXZlIG1ldGhvZCBhcyBpdCBjYWxscyBpdHNlbGYuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiB0aGUgb2JqZWN0IHRvIGNvbnZlcnQuXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSB0aGUgbmFtZSBvZiB0aGUgZWxlbWVudCAoaWYgdGhlIG9iamVjdCBiZWluZyB0cmF2ZXJzZWQgaXNcbiAqIGFuIGVsZW1lbnQpLlxuICogQHBhcmFtIHtTdHJpbmd9IG5zUHJlZml4IHRoZSBuYW1lc3BhY2UgcHJlZml4IG9mIHRoZSBvYmplY3QgSS5FLiB4c2QuXG4gKiBAcGFyYW0ge1N0cmluZ30gbnNVUkkgdGhlIGZ1bGwgbmFtZXNwYWNlIG9mIHRoZSBvYmplY3QgSS5FLiBodHRwOi8vdzMub3JnL3NjaGVtYS5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNGaXJzdCB3aGV0aGVyIG9yIG5vdCB0aGlzIGlzIHRoZSBmaXJzdCBpdGVtIGJlaW5nIHRyYXZlcnNlZC5cbiAqIEBwYXJhbSB7P30geG1sbnNBdHRyXG4gKiBAcGFyYW0gez99IHBhcmFtZXRlclR5cGVPYmplY3RcbiAqIEBwYXJhbSB7TmFtZXNwYWNlQ29udGV4dH0gbnNDb250ZXh0IE5hbWVzcGFjZSBjb250ZXh0XG4gKi9cbldTREwucHJvdG90eXBlLm9iamVjdFRvWE1MID0gZnVuY3Rpb24gKG9iaiwgbmFtZSwgbnNQcmVmaXgsIG5zVVJJLCBpc0ZpcnN0LCB4bWxuc0F0dHIsIHNjaGVtYU9iamVjdCwgbnNDb250ZXh0KSB7XG4gIGxldCBzZWxmID0gdGhpcztcbiAgbGV0IHNjaGVtYSA9IHRoaXMuZGVmaW5pdGlvbnMuc2NoZW1hc1tuc1VSSV07XG5cbiAgbGV0IHBhcmVudE5zUHJlZml4ID0gbnNQcmVmaXggPyBuc1ByZWZpeC5wYXJlbnQgOiB1bmRlZmluZWQ7XG4gIGlmICh0eXBlb2YgcGFyZW50TnNQcmVmaXggIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy93ZSBnb3QgdGhlIHBhcmVudE5zUHJlZml4IGZvciBvdXIgYXJyYXkuIHNldHRpbmcgdGhlIG5hbWVzcGFjZS1sZXRpYWJsZSBiYWNrIHRvIHRoZSBjdXJyZW50IG5hbWVzcGFjZSBzdHJpbmdcbiAgICBuc1ByZWZpeCA9IG5zUHJlZml4LmN1cnJlbnQ7XG4gIH1cblxuICBwYXJlbnROc1ByZWZpeCA9IG5vQ29sb25OYW1lU3BhY2UocGFyZW50TnNQcmVmaXgpO1xuICBpZiAodGhpcy5pc0lnbm9yZWROYW1lU3BhY2UocGFyZW50TnNQcmVmaXgpKSB7XG4gICAgcGFyZW50TnNQcmVmaXggPSAnJztcbiAgfVxuXG4gIGxldCBzb2FwSGVhZGVyID0gIXNjaGVtYTtcbiAgbGV0IHF1YWxpZmllZCA9IHNjaGVtYSAmJiBzY2hlbWEuJGVsZW1lbnRGb3JtRGVmYXVsdCA9PT0gJ3F1YWxpZmllZCc7XG4gIGxldCBwYXJ0cyA9IFtdO1xuICBsZXQgcHJlZml4TmFtZXNwYWNlID0gKG5zUHJlZml4IHx8IHF1YWxpZmllZCkgJiYgbnNQcmVmaXggIT09IFROU19QUkVGSVg7XG5cbiAgbGV0IHhtbG5zQXR0cmliID0gJyc7XG4gIGlmIChuc1VSSSAmJiBpc0ZpcnN0KSB7XG4gICAgaWYgKHNlbGYub3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50ICYmIHNlbGYub3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50LnhtbG5zQXR0cmlidXRlcykge1xuICAgICAgc2VsZi5vcHRpb25zLm92ZXJyaWRlUm9vdEVsZW1lbnQueG1sbnNBdHRyaWJ1dGVzLmZvckVhY2goZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICB4bWxuc0F0dHJpYiArPSAnICcgKyBhdHRyaWJ1dGUubmFtZSArICc9XCInICsgYXR0cmlidXRlLnZhbHVlICsgJ1wiJztcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocHJlZml4TmFtZXNwYWNlICYmICF0aGlzLmlzSWdub3JlZE5hbWVTcGFjZShuc1ByZWZpeCkpIHtcbiAgICAgICAgLy8gcmVzb2x2ZSB0aGUgcHJlZml4IG5hbWVzcGFjZVxuICAgICAgICB4bWxuc0F0dHJpYiArPSAnIHhtbG5zOicgKyBuc1ByZWZpeCArICc9XCInICsgbnNVUkkgKyAnXCInO1xuICAgICAgfVxuICAgICAgLy8gb25seSBhZGQgZGVmYXVsdCBuYW1lc3BhY2UgaWYgdGhlIHNjaGVtYSBlbGVtZW50Rm9ybURlZmF1bHQgaXMgcXVhbGlmaWVkXG4gICAgICBpZiAocXVhbGlmaWVkIHx8IHNvYXBIZWFkZXIpIHhtbG5zQXR0cmliICs9ICcgeG1sbnM9XCInICsgbnNVUkkgKyAnXCInO1xuICAgIH1cbiAgfVxuXG4gIGlmICghbnNDb250ZXh0KSB7XG4gICAgbnNDb250ZXh0ID0gbmV3IE5hbWVzcGFjZUNvbnRleHQoKTtcbiAgICBuc0NvbnRleHQuZGVjbGFyZU5hbWVzcGFjZShuc1ByZWZpeCwgbnNVUkkpO1xuICB9IGVsc2Uge1xuICAgIG5zQ29udGV4dC5wdXNoQ29udGV4dCgpO1xuICB9XG5cbiAgLy8gZXhwbGljaXRseSB1c2UgeG1sbnMgYXR0cmlidXRlIGlmIGF2YWlsYWJsZVxuICBpZiAoeG1sbnNBdHRyICYmICEoc2VsZi5vcHRpb25zLm92ZXJyaWRlUm9vdEVsZW1lbnQgJiYgc2VsZi5vcHRpb25zLm92ZXJyaWRlUm9vdEVsZW1lbnQueG1sbnNBdHRyaWJ1dGVzKSkge1xuICAgIHhtbG5zQXR0cmliID0geG1sbnNBdHRyO1xuICB9XG5cbiAgbGV0IG5zID0gJyc7XG5cbiAgaWYgKHNlbGYub3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50ICYmIGlzRmlyc3QpIHtcbiAgICBucyA9IHNlbGYub3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50Lm5hbWVzcGFjZTtcbiAgfSBlbHNlIGlmIChwcmVmaXhOYW1lc3BhY2UgJiYgKHF1YWxpZmllZCB8fCBpc0ZpcnN0IHx8IHNvYXBIZWFkZXIpICYmICF0aGlzLmlzSWdub3JlZE5hbWVTcGFjZShuc1ByZWZpeCkpIHtcbiAgICBucyA9IG5zUHJlZml4O1xuICB9XG5cbiAgbGV0IGksIG47XG4gIC8vIHN0YXJ0IGJ1aWxkaW5nIG91dCBYTUwgc3RyaW5nLlxuICBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgZm9yIChpID0gMCwgbiA9IG9iai5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgIGxldCBpdGVtID0gb2JqW2ldO1xuICAgICAgbGV0IGFycmF5QXR0ciA9IHNlbGYucHJvY2Vzc0F0dHJpYnV0ZXMoaXRlbSwgbnNDb250ZXh0KSxcbiAgICAgICAgY29ycmVjdE91dGVyTnNQcmVmaXggPSBwYXJlbnROc1ByZWZpeCB8fCBuczsgLy91c2luZyB0aGUgcGFyZW50IG5hbWVzcGFjZSBwcmVmaXggaWYgZ2l2ZW5cblxuICAgICAgbGV0IGJvZHkgPSBzZWxmLm9iamVjdFRvWE1MKGl0ZW0sIG5hbWUsIG5zUHJlZml4LCBuc1VSSSwgZmFsc2UsIG51bGwsIHNjaGVtYU9iamVjdCwgbnNDb250ZXh0KTtcblxuICAgICAgbGV0IG9wZW5pbmdUYWdQYXJ0cyA9IFsnPCcsIGFwcGVuZENvbG9uKGNvcnJlY3RPdXRlck5zUHJlZml4KSwgbmFtZSwgYXJyYXlBdHRyLCB4bWxuc0F0dHJpYl07XG5cbiAgICAgIGlmIChib2R5ID09PSAnJyAmJiBzZWxmLm9wdGlvbnMudXNlRW1wdHlUYWcpIHtcbiAgICAgICAgLy8gVXNlIGVtcHR5IChzZWxmLWNsb3NpbmcpIHRhZ3MgaWYgbm8gY29udGVudHNcbiAgICAgICAgb3BlbmluZ1RhZ1BhcnRzLnB1c2goJyAvPicpO1xuICAgICAgICBwYXJ0cy5wdXNoKG9wZW5pbmdUYWdQYXJ0cy5qb2luKCcnKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcGVuaW5nVGFnUGFydHMucHVzaCgnPicpO1xuICAgICAgICBpZiAoc2VsZi5vcHRpb25zLm5hbWVzcGFjZUFycmF5RWxlbWVudHMgfHwgaSA9PT0gMCkge1xuICAgICAgICAgIHBhcnRzLnB1c2gob3BlbmluZ1RhZ1BhcnRzLmpvaW4oJycpKTtcbiAgICAgICAgfVxuICAgICAgICBwYXJ0cy5wdXNoKGJvZHkpO1xuICAgICAgICBpZiAoc2VsZi5vcHRpb25zLm5hbWVzcGFjZUFycmF5RWxlbWVudHMgfHwgaSA9PT0gbiAtIDEpIHtcbiAgICAgICAgICBwYXJ0cy5wdXNoKFsnPC8nLCBhcHBlbmRDb2xvbihjb3JyZWN0T3V0ZXJOc1ByZWZpeCksIG5hbWUsICc+J10uam9pbignJykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgZm9yIChuYW1lIGluIG9iaikge1xuICAgICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkobmFtZSkpIGNvbnRpbnVlO1xuICAgICAgLy9kb24ndCBwcm9jZXNzIGF0dHJpYnV0ZXMgYXMgZWxlbWVudFxuICAgICAgaWYgKG5hbWUgPT09IHNlbGYub3B0aW9ucy5hdHRyaWJ1dGVzS2V5KSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy9JdHMgdGhlIHZhbHVlIG9mIGEgeG1sIG9iamVjdC4gUmV0dXJuIGl0IGRpcmVjdGx5LlxuICAgICAgaWYgKG5hbWUgPT09IHNlbGYub3B0aW9ucy54bWxLZXkpIHtcbiAgICAgICAgbnNDb250ZXh0LnBvcENvbnRleHQoKTtcbiAgICAgICAgcmV0dXJuIG9ialtuYW1lXTtcbiAgICAgIH1cbiAgICAgIC8vSXRzIHRoZSB2YWx1ZSBvZiBhbiBpdGVtLiBSZXR1cm4gaXQgZGlyZWN0bHkuXG4gICAgICBpZiAobmFtZSA9PT0gc2VsZi5vcHRpb25zLnZhbHVlS2V5KSB7XG4gICAgICAgIG5zQ29udGV4dC5wb3BDb250ZXh0KCk7XG4gICAgICAgIHJldHVybiB4bWxFc2NhcGUob2JqW25hbWVdKTtcbiAgICAgIH1cblxuICAgICAgbGV0IGNoaWxkID0gb2JqW25hbWVdO1xuICAgICAgaWYgKHR5cGVvZiBjaGlsZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBhdHRyID0gc2VsZi5wcm9jZXNzQXR0cmlidXRlcyhjaGlsZCwgbnNDb250ZXh0KTtcblxuICAgICAgbGV0IHZhbHVlID0gJyc7XG4gICAgICBsZXQgbm9uU3ViTmFtZVNwYWNlID0gJyc7XG4gICAgICBsZXQgZW1wdHlOb25TdWJOYW1lU3BhY2UgPSBmYWxzZTtcblxuICAgICAgbGV0IG5hbWVXaXRoTnNSZWdleCA9IC9eKFteOl0rKTooW146XSspJC8uZXhlYyhuYW1lKTtcbiAgICAgIGlmIChuYW1lV2l0aE5zUmVnZXgpIHtcbiAgICAgICAgbm9uU3ViTmFtZVNwYWNlID0gbmFtZVdpdGhOc1JlZ2V4WzFdICsgJzonO1xuICAgICAgICBuYW1lID0gbmFtZVdpdGhOc1JlZ2V4WzJdO1xuICAgICAgfSBlbHNlIGlmIChuYW1lWzBdID09PSAnOicpIHtcbiAgICAgICAgZW1wdHlOb25TdWJOYW1lU3BhY2UgPSB0cnVlO1xuICAgICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0ZpcnN0KSB7XG4gICAgICAgIHZhbHVlID0gc2VsZi5vYmplY3RUb1hNTChjaGlsZCwgbmFtZSwgbnNQcmVmaXgsIG5zVVJJLCBmYWxzZSwgbnVsbCwgc2NoZW1hT2JqZWN0LCBuc0NvbnRleHQpO1xuICAgICAgfSBlbHNlIHtcblxuICAgICAgICBpZiAoc2VsZi5kZWZpbml0aW9ucy5zY2hlbWFzKSB7XG4gICAgICAgICAgaWYgKHNjaGVtYSkge1xuICAgICAgICAgICAgbGV0IGNoaWxkU2NoZW1hT2JqZWN0ID0gc2VsZi5maW5kQ2hpbGRTY2hlbWFPYmplY3Qoc2NoZW1hT2JqZWN0LCBuYW1lKTtcbiAgICAgICAgICAgIC8vZmluZCBzdWIgbmFtZXNwYWNlIGlmIG5vdCBhIHByaW1pdGl2ZVxuICAgICAgICAgICAgaWYgKGNoaWxkU2NoZW1hT2JqZWN0ICYmXG4gICAgICAgICAgICAgICgoY2hpbGRTY2hlbWFPYmplY3QuJHR5cGUgJiYgKGNoaWxkU2NoZW1hT2JqZWN0LiR0eXBlLmluZGV4T2YoJ3hzZDonKSA9PT0gLTEpKSB8fFxuICAgICAgICAgICAgICAgIGNoaWxkU2NoZW1hT2JqZWN0LiRyZWYgfHwgY2hpbGRTY2hlbWFPYmplY3QuJG5hbWUpKSB7XG4gICAgICAgICAgICAgIC8qaWYgdGhlIGJhc2UgbmFtZSBzcGFjZSBvZiB0aGUgY2hpbGRyZW4gaXMgbm90IGluIHRoZSBpbmdvcmVkU2NoZW1hTmFtc3BhY2VzIHdlIHVzZSBpdC5cbiAgICAgICAgICAgICAgIFRoaXMgaXMgYmVjYXVzZSBpbiBzb21lIHNlcnZpY2VzIHRoZSBjaGlsZCBub2RlcyBkbyBub3QgbmVlZCB0aGUgYmFzZU5hbWVTcGFjZS5cbiAgICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgICAgbGV0IGNoaWxkTnNQcmVmaXg6IGFueSA9ICcnO1xuICAgICAgICAgICAgICBsZXQgY2hpbGROYW1lID0gJyc7XG4gICAgICAgICAgICAgIGxldCBjaGlsZE5zVVJJO1xuICAgICAgICAgICAgICBsZXQgY2hpbGRYbWxuc0F0dHJpYiA9ICcnO1xuXG4gICAgICAgICAgICAgIGxldCBlbGVtZW50UU5hbWUgPSBjaGlsZFNjaGVtYU9iamVjdC4kcmVmIHx8IGNoaWxkU2NoZW1hT2JqZWN0LiRuYW1lO1xuICAgICAgICAgICAgICBpZiAoZWxlbWVudFFOYW1lKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudFFOYW1lID0gc3BsaXRRTmFtZShlbGVtZW50UU5hbWUpO1xuICAgICAgICAgICAgICAgIGNoaWxkTmFtZSA9IGVsZW1lbnRRTmFtZS5uYW1lO1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50UU5hbWUucHJlZml4ID09PSBUTlNfUFJFRklYKSB7XG4gICAgICAgICAgICAgICAgICAvLyBMb2NhbCBlbGVtZW50XG4gICAgICAgICAgICAgICAgICBjaGlsZE5zVVJJID0gY2hpbGRTY2hlbWFPYmplY3QuJHRhcmdldE5hbWVzcGFjZTtcbiAgICAgICAgICAgICAgICAgIGNoaWxkTnNQcmVmaXggPSBuc0NvbnRleHQucmVnaXN0ZXJOYW1lc3BhY2UoY2hpbGROc1VSSSk7XG4gICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0lnbm9yZWROYW1lU3BhY2UoY2hpbGROc1ByZWZpeCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGROc1ByZWZpeCA9IG5zUHJlZml4O1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBjaGlsZE5zUHJlZml4ID0gZWxlbWVudFFOYW1lLnByZWZpeDtcbiAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzSWdub3JlZE5hbWVTcGFjZShjaGlsZE5zUHJlZml4KSkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZE5zUHJlZml4ID0gbnNQcmVmaXg7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjaGlsZE5zVVJJID0gc2NoZW1hLnhtbG5zW2NoaWxkTnNQcmVmaXhdIHx8IHNlbGYuZGVmaW5pdGlvbnMueG1sbnNbY2hpbGROc1ByZWZpeF07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IHVucXVhbGlmaWVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgcXVhbGlmaWNhdGlvbiBmb3JtIGZvciBsb2NhbCBlbGVtZW50c1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZFNjaGVtYU9iamVjdC4kbmFtZSAmJiBjaGlsZFNjaGVtYU9iamVjdC50YXJnZXROYW1lc3BhY2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkU2NoZW1hT2JqZWN0LiRmb3JtID09PSAndW5xdWFsaWZpZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHVucXVhbGlmaWVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGRTY2hlbWFPYmplY3QuJGZvcm0gPT09ICdxdWFsaWZpZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHVucXVhbGlmaWVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB1bnF1YWxpZmllZCA9IHNjaGVtYS4kZWxlbWVudEZvcm1EZWZhdWx0ICE9PSAncXVhbGlmaWVkJztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHVucXVhbGlmaWVkKSB7XG4gICAgICAgICAgICAgICAgICBjaGlsZE5zUHJlZml4ID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkTnNVUkkgJiYgY2hpbGROc1ByZWZpeCkge1xuICAgICAgICAgICAgICAgICAgaWYgKG5zQ29udGV4dC5kZWNsYXJlTmFtZXNwYWNlKGNoaWxkTnNQcmVmaXgsIGNoaWxkTnNVUkkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkWG1sbnNBdHRyaWIgPSAnIHhtbG5zOicgKyBjaGlsZE5zUHJlZml4ICsgJz1cIicgKyBjaGlsZE5zVVJJICsgJ1wiJztcbiAgICAgICAgICAgICAgICAgICAgeG1sbnNBdHRyaWIgKz0gY2hpbGRYbWxuc0F0dHJpYjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBsZXQgcmVzb2x2ZWRDaGlsZFNjaGVtYU9iamVjdDtcbiAgICAgICAgICAgICAgaWYgKGNoaWxkU2NoZW1hT2JqZWN0LiR0eXBlKSB7XG4gICAgICAgICAgICAgICAgbGV0IHR5cGVRTmFtZSA9IHNwbGl0UU5hbWUoY2hpbGRTY2hlbWFPYmplY3QuJHR5cGUpO1xuICAgICAgICAgICAgICAgIGxldCB0eXBlUHJlZml4ID0gdHlwZVFOYW1lLnByZWZpeDtcbiAgICAgICAgICAgICAgICBsZXQgdHlwZVVSSSA9IHNjaGVtYS54bWxuc1t0eXBlUHJlZml4XSB8fCBzZWxmLmRlZmluaXRpb25zLnhtbG5zW3R5cGVQcmVmaXhdO1xuICAgICAgICAgICAgICAgIGNoaWxkTnNVUkkgPSB0eXBlVVJJO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlVVJJICE9PSAnaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEnICYmIHR5cGVQcmVmaXggIT09IFROU19QUkVGSVgpIHtcbiAgICAgICAgICAgICAgICAgIC8vIEFkZCB0aGUgcHJlZml4L25hbWVzcGFjZSBtYXBwaW5nLCBidXQgbm90IGRlY2xhcmUgaXRcbiAgICAgICAgICAgICAgICAgIG5zQ29udGV4dC5hZGROYW1lc3BhY2UodHlwZVByZWZpeCwgdHlwZVVSSSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc29sdmVkQ2hpbGRTY2hlbWFPYmplY3QgPVxuICAgICAgICAgICAgICAgICAgc2VsZi5maW5kU2NoZW1hVHlwZSh0eXBlUU5hbWUubmFtZSwgdHlwZVVSSSkgfHwgY2hpbGRTY2hlbWFPYmplY3Q7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZWRDaGlsZFNjaGVtYU9iamVjdCA9XG4gICAgICAgICAgICAgICAgICBzZWxmLmZpbmRTY2hlbWFPYmplY3QoY2hpbGROc1VSSSwgY2hpbGROYW1lKSB8fCBjaGlsZFNjaGVtYU9iamVjdDtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChjaGlsZFNjaGVtYU9iamVjdC4kYmFzZU5hbWVTcGFjZSAmJiB0aGlzLm9wdGlvbnMuaWdub3JlQmFzZU5hbWVTcGFjZXMpIHtcbiAgICAgICAgICAgICAgICBjaGlsZE5zUHJlZml4ID0gbnNQcmVmaXg7XG4gICAgICAgICAgICAgICAgY2hpbGROc1VSSSA9IG5zVVJJO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5pZ25vcmVCYXNlTmFtZVNwYWNlcykge1xuICAgICAgICAgICAgICAgIGNoaWxkTnNQcmVmaXggPSAnJztcbiAgICAgICAgICAgICAgICBjaGlsZE5zVVJJID0gJyc7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBucyA9IGNoaWxkTnNQcmVmaXg7XG5cbiAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGQpKSB7XG4gICAgICAgICAgICAgICAgLy9mb3IgYXJyYXlzLCB3ZSBuZWVkIHRvIHJlbWVtYmVyIHRoZSBjdXJyZW50IG5hbWVzcGFjZVxuICAgICAgICAgICAgICAgIGNoaWxkTnNQcmVmaXggPSB7XG4gICAgICAgICAgICAgICAgICBjdXJyZW50OiBjaGlsZE5zUHJlZml4LFxuICAgICAgICAgICAgICAgICAgcGFyZW50OiBuc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy9wYXJlbnQgKGFycmF5KSBhbHJlYWR5IGdvdCB0aGUgbmFtZXNwYWNlXG4gICAgICAgICAgICAgICAgY2hpbGRYbWxuc0F0dHJpYiA9IG51bGw7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB2YWx1ZSA9IHNlbGYub2JqZWN0VG9YTUwoY2hpbGQsIG5hbWUsIGNoaWxkTnNQcmVmaXgsIGNoaWxkTnNVUkksXG4gICAgICAgICAgICAgICAgZmFsc2UsIGNoaWxkWG1sbnNBdHRyaWIsIHJlc29sdmVkQ2hpbGRTY2hlbWFPYmplY3QsIG5zQ29udGV4dCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9ialtzZWxmLm9wdGlvbnMuYXR0cmlidXRlc0tleV0gJiYgb2JqW3NlbGYub3B0aW9ucy5hdHRyaWJ1dGVzS2V5XS54c2lfdHlwZSkge1xuICAgICAgICAgICAgICAvL2lmIHBhcmVudCBvYmplY3QgaGFzIGNvbXBsZXggdHlwZSBkZWZpbmVkIGFuZCBjaGlsZCBub3QgZm91bmQgaW4gcGFyZW50XG4gICAgICAgICAgICAgIGxldCBjb21wbGV0ZUNoaWxkUGFyYW1UeXBlT2JqZWN0ID0gc2VsZi5maW5kQ2hpbGRTY2hlbWFPYmplY3QoXG4gICAgICAgICAgICAgICAgb2JqW3NlbGYub3B0aW9ucy5hdHRyaWJ1dGVzS2V5XS54c2lfdHlwZS50eXBlLFxuICAgICAgICAgICAgICAgIG9ialtzZWxmLm9wdGlvbnMuYXR0cmlidXRlc0tleV0ueHNpX3R5cGUueG1sbnMpO1xuXG4gICAgICAgICAgICAgIG5vblN1Yk5hbWVTcGFjZSA9IG9ialtzZWxmLm9wdGlvbnMuYXR0cmlidXRlc0tleV0ueHNpX3R5cGUucHJlZml4O1xuICAgICAgICAgICAgICBuc0NvbnRleHQuYWRkTmFtZXNwYWNlKG9ialtzZWxmLm9wdGlvbnMuYXR0cmlidXRlc0tleV0ueHNpX3R5cGUucHJlZml4LFxuICAgICAgICAgICAgICAgIG9ialtzZWxmLm9wdGlvbnMuYXR0cmlidXRlc0tleV0ueHNpX3R5cGUueG1sbnMpO1xuICAgICAgICAgICAgICB2YWx1ZSA9IHNlbGYub2JqZWN0VG9YTUwoY2hpbGQsIG5hbWUsIG9ialtzZWxmLm9wdGlvbnMuYXR0cmlidXRlc0tleV0ueHNpX3R5cGUucHJlZml4LFxuICAgICAgICAgICAgICAgIG9ialtzZWxmLm9wdGlvbnMuYXR0cmlidXRlc0tleV0ueHNpX3R5cGUueG1sbnMsIGZhbHNlLCBudWxsLCBudWxsLCBuc0NvbnRleHQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGQpKSB7XG4gICAgICAgICAgICAgICAgbmFtZSA9IG5vblN1Yk5hbWVTcGFjZSArIG5hbWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB2YWx1ZSA9IHNlbGYub2JqZWN0VG9YTUwoY2hpbGQsIG5hbWUsIG5zUHJlZml4LCBuc1VSSSwgZmFsc2UsIG51bGwsIG51bGwsIG5zQ29udGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gc2VsZi5vYmplY3RUb1hNTChjaGlsZCwgbmFtZSwgbnNQcmVmaXgsIG5zVVJJLCBmYWxzZSwgbnVsbCwgbnVsbCwgbnNDb250ZXh0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbnMgPSBub0NvbG9uTmFtZVNwYWNlKG5zKTtcbiAgICAgIGlmIChwcmVmaXhOYW1lc3BhY2UgJiYgIXF1YWxpZmllZCAmJiBpc0ZpcnN0ICYmICFzZWxmLm9wdGlvbnMub3ZlcnJpZGVSb290RWxlbWVudCkge1xuICAgICAgICBucyA9IG5zUHJlZml4O1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzSWdub3JlZE5hbWVTcGFjZShucykpIHtcbiAgICAgICAgbnMgPSAnJztcbiAgICAgIH1cblxuICAgICAgbGV0IHVzZUVtcHR5VGFnID0gIXZhbHVlICYmIHNlbGYub3B0aW9ucy51c2VFbXB0eVRhZztcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShjaGlsZCkpIHtcbiAgICAgICAgLy8gc3RhcnQgdGFnXG4gICAgICAgIHBhcnRzLnB1c2goWyc8JywgZW1wdHlOb25TdWJOYW1lU3BhY2UgPyAnJyA6IGFwcGVuZENvbG9uKG5vblN1Yk5hbWVTcGFjZSB8fCBucyksIG5hbWUsIGF0dHIsIHhtbG5zQXR0cmliLFxuICAgICAgICAgIChjaGlsZCA9PT0gbnVsbCA/ICcgeHNpOm5pbD1cInRydWVcIicgOiAnJyksXG4gICAgICAgICAgdXNlRW1wdHlUYWcgPyAnIC8+JyA6ICc+J1xuICAgICAgICBdLmpvaW4oJycpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF1c2VFbXB0eVRhZykge1xuICAgICAgICBwYXJ0cy5wdXNoKHZhbHVlKTtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGNoaWxkKSkge1xuICAgICAgICAgIC8vIGVuZCB0YWdcbiAgICAgICAgICBwYXJ0cy5wdXNoKFsnPC8nLCBlbXB0eU5vblN1Yk5hbWVTcGFjZSA/ICcnIDogYXBwZW5kQ29sb24obm9uU3ViTmFtZVNwYWNlIHx8IG5zKSwgbmFtZSwgJz4nXS5qb2luKCcnKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAob2JqICE9PSB1bmRlZmluZWQpIHtcbiAgICBwYXJ0cy5wdXNoKChzZWxmLm9wdGlvbnMuZXNjYXBlWE1MKSA/IHhtbEVzY2FwZShvYmopIDogb2JqKTtcbiAgfVxuICBuc0NvbnRleHQucG9wQ29udGV4dCgpO1xuICByZXR1cm4gcGFydHMuam9pbignJyk7XG59O1xuXG5XU0RMLnByb3RvdHlwZS5wcm9jZXNzQXR0cmlidXRlcyA9IGZ1bmN0aW9uIChjaGlsZCwgbnNDb250ZXh0KSB7XG4gIGxldCBhdHRyID0gJyc7XG5cbiAgaWYgKGNoaWxkID09PSBudWxsKSB7XG4gICAgY2hpbGQgPSBbXTtcbiAgfVxuXG4gIGxldCBhdHRyT2JqID0gY2hpbGRbdGhpcy5vcHRpb25zLmF0dHJpYnV0ZXNLZXldO1xuICBpZiAoYXR0ck9iaiAmJiBhdHRyT2JqLnhzaV90eXBlKSB7XG4gICAgbGV0IHhzaVR5cGUgPSBhdHRyT2JqLnhzaV90eXBlO1xuXG4gICAgbGV0IHByZWZpeCA9IHhzaVR5cGUucHJlZml4IHx8IHhzaVR5cGUubmFtZXNwYWNlO1xuICAgIC8vIEdlbmVyYXRlIGEgbmV3IG5hbWVzcGFjZSBmb3IgY29tcGxleCBleHRlbnNpb24gaWYgb25lIG5vdCBwcm92aWRlZFxuICAgIGlmICghcHJlZml4KSB7XG4gICAgICBwcmVmaXggPSBuc0NvbnRleHQucmVnaXN0ZXJOYW1lc3BhY2UoeHNpVHlwZS54bWxucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5zQ29udGV4dC5kZWNsYXJlTmFtZXNwYWNlKHByZWZpeCwgeHNpVHlwZS54bWxucyk7XG4gICAgfVxuICAgIHhzaVR5cGUucHJlZml4ID0gcHJlZml4O1xuICB9XG5cblxuICBpZiAoYXR0ck9iaikge1xuICAgIGZvciAobGV0IGF0dHJLZXkgaW4gYXR0ck9iaikge1xuICAgICAgLy9oYW5kbGUgY29tcGxleCBleHRlbnNpb24gc2VwYXJhdGVseVxuICAgICAgaWYgKGF0dHJLZXkgPT09ICd4c2lfdHlwZScpIHtcbiAgICAgICAgbGV0IGF0dHJWYWx1ZSA9IGF0dHJPYmpbYXR0cktleV07XG4gICAgICAgIGF0dHIgKz0gJyB4c2k6dHlwZT1cIicgKyBhdHRyVmFsdWUucHJlZml4ICsgJzonICsgYXR0clZhbHVlLnR5cGUgKyAnXCInO1xuICAgICAgICBhdHRyICs9ICcgeG1sbnM6JyArIGF0dHJWYWx1ZS5wcmVmaXggKyAnPVwiJyArIGF0dHJWYWx1ZS54bWxucyArICdcIic7XG5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdHRyICs9ICcgJyArIGF0dHJLZXkgKyAnPVwiJyArIHhtbEVzY2FwZShhdHRyT2JqW2F0dHJLZXldKSArICdcIic7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGF0dHI7XG59O1xuXG4vKipcbiAqIExvb2sgdXAgYSBzY2hlbWEgdHlwZSBkZWZpbml0aW9uXG4gKiBAcGFyYW0gbmFtZVxuICogQHBhcmFtIG5zVVJJXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuV1NETC5wcm90b3R5cGUuZmluZFNjaGVtYVR5cGUgPSBmdW5jdGlvbiAobmFtZSwgbnNVUkkpIHtcbiAgaWYgKCF0aGlzLmRlZmluaXRpb25zLnNjaGVtYXMgfHwgIW5hbWUgfHwgIW5zVVJJKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBsZXQgc2NoZW1hID0gdGhpcy5kZWZpbml0aW9ucy5zY2hlbWFzW25zVVJJXTtcbiAgaWYgKCFzY2hlbWEgfHwgIXNjaGVtYS5jb21wbGV4VHlwZXMpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBzY2hlbWEuY29tcGxleFR5cGVzW25hbWVdO1xufTtcblxuV1NETC5wcm90b3R5cGUuZmluZENoaWxkU2NoZW1hT2JqZWN0ID0gZnVuY3Rpb24gKHBhcmFtZXRlclR5cGVPYmosIGNoaWxkTmFtZSwgYmFja3RyYWNlKSB7XG4gIGlmICghcGFyYW1ldGVyVHlwZU9iaiB8fCAhY2hpbGROYW1lKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoIWJhY2t0cmFjZSkge1xuICAgIGJhY2t0cmFjZSA9IFtdO1xuICB9XG5cbiAgaWYgKGJhY2t0cmFjZS5pbmRleE9mKHBhcmFtZXRlclR5cGVPYmopID49IDApIHtcbiAgICAvLyBXZSd2ZSByZWN1cnNlZCBiYWNrIHRvIG91cnNlbHZlczsgYnJlYWsuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0gZWxzZSB7XG4gICAgYmFja3RyYWNlID0gYmFja3RyYWNlLmNvbmNhdChbcGFyYW1ldGVyVHlwZU9ial0pO1xuICB9XG5cbiAgbGV0IGZvdW5kID0gbnVsbCxcbiAgICBpID0gMCxcbiAgICBjaGlsZCxcbiAgICByZWY7XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkocGFyYW1ldGVyVHlwZU9iai4kbG9va3VwVHlwZXMpICYmIHBhcmFtZXRlclR5cGVPYmouJGxvb2t1cFR5cGVzLmxlbmd0aCkge1xuICAgIGxldCB0eXBlcyA9IHBhcmFtZXRlclR5cGVPYmouJGxvb2t1cFR5cGVzO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IHR5cGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgdHlwZU9iaiA9IHR5cGVzW2ldO1xuXG4gICAgICBpZiAodHlwZU9iai4kbmFtZSA9PT0gY2hpbGROYW1lKSB7XG4gICAgICAgIGZvdW5kID0gdHlwZU9iajtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbGV0IG9iamVjdCA9IHBhcmFtZXRlclR5cGVPYmo7XG4gIGlmIChvYmplY3QuJG5hbWUgPT09IGNoaWxkTmFtZSAmJiBvYmplY3QubmFtZSA9PT0gJ2VsZW1lbnQnKSB7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuICBpZiAob2JqZWN0LiRyZWYpIHtcbiAgICByZWYgPSBzcGxpdFFOYW1lKG9iamVjdC4kcmVmKTtcbiAgICBpZiAocmVmLm5hbWUgPT09IGNoaWxkTmFtZSkge1xuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG4gIH1cblxuICBsZXQgY2hpbGROc1VSSTtcblxuICAvLyB3YW50IHRvIGF2b2lkIHVuZWNlc3NhcnkgcmVjdXJzaW9uIHRvIGltcHJvdmUgcGVyZm9ybWFuY2VcbiAgaWYgKG9iamVjdC4kdHlwZSAmJiBiYWNrdHJhY2UubGVuZ3RoID09PSAxKSB7XG4gICAgbGV0IHR5cGVJbmZvID0gc3BsaXRRTmFtZShvYmplY3QuJHR5cGUpO1xuICAgIGlmICh0eXBlSW5mby5wcmVmaXggPT09IFROU19QUkVGSVgpIHtcbiAgICAgIGNoaWxkTnNVUkkgPSBwYXJhbWV0ZXJUeXBlT2JqLiR0YXJnZXROYW1lc3BhY2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNoaWxkTnNVUkkgPSB0aGlzLmRlZmluaXRpb25zLnhtbG5zW3R5cGVJbmZvLnByZWZpeF07XG4gICAgfVxuICAgIGxldCB0eXBlRGVmID0gdGhpcy5maW5kU2NoZW1hVHlwZSh0eXBlSW5mby5uYW1lLCBjaGlsZE5zVVJJKTtcbiAgICBpZiAodHlwZURlZikge1xuICAgICAgcmV0dXJuIHRoaXMuZmluZENoaWxkU2NoZW1hT2JqZWN0KHR5cGVEZWYsIGNoaWxkTmFtZSwgYmFja3RyYWNlKTtcbiAgICB9XG4gIH1cblxuICBpZiAob2JqZWN0LmNoaWxkcmVuKSB7XG4gICAgZm9yIChpID0gMCwgY2hpbGQ7IGNoaWxkID0gb2JqZWN0LmNoaWxkcmVuW2ldOyBpKyspIHtcbiAgICAgIGZvdW5kID0gdGhpcy5maW5kQ2hpbGRTY2hlbWFPYmplY3QoY2hpbGQsIGNoaWxkTmFtZSwgYmFja3RyYWNlKTtcbiAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgaWYgKGNoaWxkLiRiYXNlKSB7XG4gICAgICAgIGxldCBiYXNlUU5hbWUgPSBzcGxpdFFOYW1lKGNoaWxkLiRiYXNlKTtcbiAgICAgICAgbGV0IGNoaWxkTmFtZVNwYWNlID0gYmFzZVFOYW1lLnByZWZpeCA9PT0gVE5TX1BSRUZJWCA/ICcnIDogYmFzZVFOYW1lLnByZWZpeDtcbiAgICAgICAgY2hpbGROc1VSSSA9IGNoaWxkLnhtbG5zW2Jhc2VRTmFtZS5wcmVmaXhdIHx8IHRoaXMuZGVmaW5pdGlvbnMueG1sbnNbYmFzZVFOYW1lLnByZWZpeF07XG5cbiAgICAgICAgbGV0IGZvdW5kQmFzZSA9IHRoaXMuZmluZFNjaGVtYVR5cGUoYmFzZVFOYW1lLm5hbWUsIGNoaWxkTnNVUkkpO1xuXG4gICAgICAgIGlmIChmb3VuZEJhc2UpIHtcbiAgICAgICAgICBmb3VuZCA9IHRoaXMuZmluZENoaWxkU2NoZW1hT2JqZWN0KGZvdW5kQmFzZSwgY2hpbGROYW1lLCBiYWNrdHJhY2UpO1xuXG4gICAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICBmb3VuZC4kYmFzZU5hbWVTcGFjZSA9IGNoaWxkTmFtZVNwYWNlO1xuICAgICAgICAgICAgZm91bmQuJHR5cGUgPSBjaGlsZE5hbWVTcGFjZSArICc6JyArIGNoaWxkTmFtZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgaWYgKCFmb3VuZCAmJiBvYmplY3QuJG5hbWUgPT09IGNoaWxkTmFtZSkge1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICByZXR1cm4gZm91bmQ7XG59O1xuXG5XU0RMLnByb3RvdHlwZS5fcGFyc2UgPSBmdW5jdGlvbiAoeG1sKSB7XG4gIGxldCBzZWxmID0gdGhpcyxcbiAgICBwID0gc2F4LnBhcnNlcih0cnVlKSxcbiAgICBzdGFjayA9IFtdLFxuICAgIHJvb3QgPSBudWxsLFxuICAgIHR5cGVzID0gbnVsbCxcbiAgICBzY2hlbWEgPSBudWxsLFxuICAgIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG5cbiAgcC5vbm9wZW50YWcgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgIGxldCBuc05hbWUgPSBub2RlLm5hbWU7XG4gICAgbGV0IGF0dHJzID0gbm9kZS5hdHRyaWJ1dGVzO1xuXG4gICAgbGV0IHRvcCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgIGxldCBuYW1lO1xuICAgIGlmICh0b3ApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRvcC5zdGFydEVsZW1lbnQoc3RhY2ssIG5zTmFtZSwgYXR0cnMsIG9wdGlvbnMpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnN0cmljdCkge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RhY2sucHVzaChuZXcgRWxlbWVudChuc05hbWUsIGF0dHJzLCBvcHRpb25zKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IHNwbGl0UU5hbWUobnNOYW1lKS5uYW1lO1xuICAgICAgaWYgKG5hbWUgPT09ICdkZWZpbml0aW9ucycpIHtcbiAgICAgICAgcm9vdCA9IG5ldyBEZWZpbml0aW9uc0VsZW1lbnQobnNOYW1lLCBhdHRycywgb3B0aW9ucyk7XG4gICAgICAgIHN0YWNrLnB1c2gocm9vdCk7XG4gICAgICB9IGVsc2UgaWYgKG5hbWUgPT09ICdzY2hlbWEnKSB7XG4gICAgICAgIC8vIFNoaW0gYSBzdHJ1Y3R1cmUgaW4gaGVyZSB0byBhbGxvdyB0aGUgcHJvcGVyIG9iamVjdHMgdG8gYmUgY3JlYXRlZCB3aGVuIG1lcmdpbmcgYmFjay5cbiAgICAgICAgcm9vdCA9IG5ldyBEZWZpbml0aW9uc0VsZW1lbnQoJ2RlZmluaXRpb25zJywge30sIHt9KTtcbiAgICAgICAgdHlwZXMgPSBuZXcgVHlwZXNFbGVtZW50KCd0eXBlcycsIHt9LCB7fSk7XG4gICAgICAgIHNjaGVtYSA9IG5ldyBTY2hlbWFFbGVtZW50KG5zTmFtZSwgYXR0cnMsIG9wdGlvbnMpO1xuICAgICAgICB0eXBlcy5hZGRDaGlsZChzY2hlbWEpO1xuICAgICAgICByb290LmFkZENoaWxkKHR5cGVzKTtcbiAgICAgICAgc3RhY2sucHVzaChzY2hlbWEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmV4cGVjdGVkIHJvb3QgZWxlbWVudCBvZiBXU0RMIG9yIGluY2x1ZGUnKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgcC5vbmNsb3NldGFnID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBsZXQgdG9wID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgYXNzZXJ0KHRvcCwgJ1VubWF0Y2hlZCBjbG9zZSB0YWc6ICcgKyBuYW1lKTtcblxuICAgIHRvcC5lbmRFbGVtZW50KHN0YWNrLCBuYW1lKTtcbiAgfTtcblxuICBwLndyaXRlKHhtbCkuY2xvc2UoKTtcblxuICByZXR1cm4gcm9vdDtcbn07XG5cbldTREwucHJvdG90eXBlLl9mcm9tWE1MID0gZnVuY3Rpb24gKHhtbCkge1xuICB0aGlzLmRlZmluaXRpb25zID0gdGhpcy5fcGFyc2UoeG1sKTtcbiAgdGhpcy5kZWZpbml0aW9ucy5kZXNjcmlwdGlvbnMgPSB7XG4gICAgdHlwZXM6IHt9XG4gIH07XG4gIHRoaXMueG1sID0geG1sO1xufTtcblxuV1NETC5wcm90b3R5cGUuX2Zyb21TZXJ2aWNlcyA9IGZ1bmN0aW9uIChzZXJ2aWNlcykge1xuXG59O1xuXG5cblxuV1NETC5wcm90b3R5cGUuX3htbG5zTWFwID0gZnVuY3Rpb24gKCkge1xuICBsZXQgeG1sbnMgPSB0aGlzLmRlZmluaXRpb25zLnhtbG5zO1xuICBsZXQgc3RyID0gJyc7XG4gIGZvciAobGV0IGFsaWFzIGluIHhtbG5zKSB7XG4gICAgaWYgKGFsaWFzID09PSAnJyB8fCBhbGlhcyA9PT0gVE5TX1BSRUZJWCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGxldCBucyA9IHhtbG5zW2FsaWFzXTtcbiAgICBzd2l0Y2ggKG5zKSB7XG4gICAgICBjYXNlIFwiaHR0cDovL3htbC5hcGFjaGUub3JnL3htbC1zb2FwXCI6IC8vIGFwYWNoZXNvYXBcbiAgICAgIGNhc2UgXCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93c2RsL1wiOiAvLyB3c2RsXG4gICAgICBjYXNlIFwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3NkbC9zb2FwL1wiOiAvLyB3c2Rsc29hcFxuICAgICAgY2FzZSBcImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzZGwvc29hcDEyL1wiOiAvLyB3c2Rsc29hcDEyXG4gICAgICBjYXNlIFwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbmNvZGluZy9cIjogLy8gc29hcGVuY1xuICAgICAgY2FzZSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hXCI6IC8vIHhzZFxuICAgICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKH5ucy5pbmRleE9mKCdodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy8nKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmICh+bnMuaW5kZXhPZignaHR0cDovL3d3dy53My5vcmcvJykpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAofm5zLmluZGV4T2YoJ2h0dHA6Ly94bWwuYXBhY2hlLm9yZy8nKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHN0ciArPSAnIHhtbG5zOicgKyBhbGlhcyArICc9XCInICsgbnMgKyAnXCInO1xuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG4vKlxuICogSGF2ZSBhbm90aGVyIGZ1bmN0aW9uIHRvIGxvYWQgcHJldmlvdXMgV1NETHMgYXMgd2VcbiAqIGRvbid0IHdhbnQgdGhpcyB0byBiZSBpbnZva2VkIGV4dGVybmFsbHkgKGV4cGVjdCBmb3IgdGVzdHMpXG4gKiBUaGlzIHdpbGwgYXR0ZW1wdCB0byBmaXggY2lyY3VsYXIgZGVwZW5kZW5jaWVzIHdpdGggWFNEIGZpbGVzLFxuICogR2l2ZW5cbiAqIC0gZmlsZS53c2RsXG4gKiAgIC0geHM6aW1wb3J0IG5hbWVzcGFjZT1cIkFcIiBzY2hlbWFMb2NhdGlvbjogQS54c2RcbiAqIC0gQS54c2RcbiAqICAgLSB4czppbXBvcnQgbmFtZXNwYWNlPVwiQlwiIHNjaGVtYUxvY2F0aW9uOiBCLnhzZFxuICogLSBCLnhzZFxuICogICAtIHhzOmltcG9ydCBuYW1lc3BhY2U9XCJBXCIgc2NoZW1hTG9jYXRpb246IEEueHNkXG4gKiBmaWxlLndzZGwgd2lsbCBzdGFydCBsb2FkaW5nLCBpbXBvcnQgQSwgdGhlbiBBIHdpbGwgaW1wb3J0IEIsIHdoaWNoIHdpbGwgdGhlbiBpbXBvcnQgQVxuICogQmVjYXVzZSBBIGhhcyBhbHJlYWR5IHN0YXJ0ZWQgdG8gbG9hZCBwcmV2aW91c2x5IGl0IHdpbGwgYmUgcmV0dXJuZWQgcmlnaHQgYXdheSBhbmRcbiAqIGhhdmUgYW4gaW50ZXJuYWwgY2lyY3VsYXIgcmVmZXJlbmNlXG4gKiBCIHdvdWxkIHRoZW4gY29tcGxldGUgbG9hZGluZywgdGhlbiBBLCB0aGVuIGZpbGUud3NkbFxuICogQnkgdGhlIHRpbWUgZmlsZSBBIHN0YXJ0cyBwcm9jZXNzaW5nIGl0cyBpbmNsdWRlcyBpdHMgZGVmaW5pdGlvbnMgd2lsbCBiZSBhbHJlYWR5IGxvYWRlZCxcbiAqIHRoaXMgaXMgdGhlIG9ubHkgdGhpbmcgdGhhdCBCIHdpbGwgZGVwZW5kIG9uIHdoZW4gXCJvcGVuaW5nXCIgQVxuICovXG5mdW5jdGlvbiBvcGVuX3dzZGxfcmVjdXJzaXZlKHVyaSwgb3B0aW9ucyk6IFByb21pc2U8YW55PiB7XG4gIGxldCBmcm9tQ2FjaGUsXG4gICAgV1NETF9DQUNIRTtcblxuICAvLyBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gICBjYWxsYmFjayA9IG9wdGlvbnM7XG4gIC8vICAgb3B0aW9ucyA9IHt9O1xuICAvLyB9XG5cbiAgV1NETF9DQUNIRSA9IG9wdGlvbnMuV1NETF9DQUNIRTtcblxuICBpZiAoZnJvbUNhY2hlID0gV1NETF9DQUNIRVt1cmldKSB7XG4gICAgLy8gcmV0dXJuIGNhbGxiYWNrLmNhbGwoZnJvbUNhY2hlLCBudWxsLCBmcm9tQ2FjaGUpO1xuICAgIHJldHVybiBmcm9tQ2FjaGU7XG4gIH1cblxuICByZXR1cm4gb3Blbl93c2RsKHVyaSwgb3B0aW9ucyk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBvcGVuX3dzZGwodXJpLCBvcHRpb25zKTogUHJvbWlzZTxhbnk+IHtcbiAgLy8gaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vICAgY2FsbGJhY2sgPSBvcHRpb25zO1xuICAvLyAgIG9wdGlvbnMgPSB7fTtcbiAgLy8gfVxuXG4gIC8vIGluaXRpYWxpemUgY2FjaGUgd2hlbiBjYWxsaW5nIG9wZW5fd3NkbCBkaXJlY3RseVxuICBsZXQgV1NETF9DQUNIRSA9IG9wdGlvbnMuV1NETF9DQUNIRSB8fCB7fTtcbiAgbGV0IHJlcXVlc3RfaGVhZGVycyA9IG9wdGlvbnMud3NkbF9oZWFkZXJzO1xuICBsZXQgcmVxdWVzdF9vcHRpb25zID0gb3B0aW9ucy53c2RsX29wdGlvbnM7XG5cbiAgLy8gbGV0IHdzZGw7XG4gIC8vIGlmICghL15odHRwcz86Ly50ZXN0KHVyaSkpIHtcbiAgLy8gICAvLyBkZWJ1ZygnUmVhZGluZyBmaWxlOiAlcycsIHVyaSk7XG4gIC8vICAgLy8gZnMucmVhZEZpbGUodXJpLCAndXRmOCcsIGZ1bmN0aW9uKGVyciwgZGVmaW5pdGlvbikge1xuICAvLyAgIC8vICAgaWYgKGVycikge1xuICAvLyAgIC8vICAgICBjYWxsYmFjayhlcnIpO1xuICAvLyAgIC8vICAgfVxuICAvLyAgIC8vICAgZWxzZSB7XG4gIC8vICAgLy8gICAgIHdzZGwgPSBuZXcgV1NETChkZWZpbml0aW9uLCB1cmksIG9wdGlvbnMpO1xuICAvLyAgIC8vICAgICBXU0RMX0NBQ0hFWyB1cmkgXSA9IHdzZGw7XG4gIC8vICAgLy8gICAgIHdzZGwuV1NETF9DQUNIRSA9IFdTRExfQ0FDSEU7XG4gIC8vICAgLy8gICAgIHdzZGwub25SZWFkeShjYWxsYmFjayk7XG4gIC8vICAgLy8gICB9XG4gIC8vICAgLy8gfSk7XG4gIC8vIH1cbiAgLy8gZWxzZSB7XG4gIC8vICAgZGVidWcoJ1JlYWRpbmcgdXJsOiAlcycsIHVyaSk7XG4gIC8vICAgbGV0IGh0dHBDbGllbnQgPSBvcHRpb25zLmh0dHBDbGllbnQgfHwgbmV3IEh0dHBDbGllbnQob3B0aW9ucyk7XG4gIC8vICAgaHR0cENsaWVudC5yZXF1ZXN0KHVyaSwgbnVsbCAvKiBvcHRpb25zICovLCBmdW5jdGlvbihlcnIsIHJlc3BvbnNlLCBkZWZpbml0aW9uKSB7XG4gIC8vICAgICBpZiAoZXJyKSB7XG4gIC8vICAgICAgIGNhbGxiYWNrKGVycik7XG4gIC8vICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlICYmIHJlc3BvbnNlLnN0YXR1c0NvZGUgPT09IDIwMCkge1xuICAvLyAgICAgICB3c2RsID0gbmV3IFdTREwoZGVmaW5pdGlvbiwgdXJpLCBvcHRpb25zKTtcbiAgLy8gICAgICAgV1NETF9DQUNIRVsgdXJpIF0gPSB3c2RsO1xuICAvLyAgICAgICB3c2RsLldTRExfQ0FDSEUgPSBXU0RMX0NBQ0hFO1xuICAvLyAgICAgICB3c2RsLm9uUmVhZHkoY2FsbGJhY2spO1xuICAvLyAgICAgfSBlbHNlIHtcbiAgLy8gICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCdJbnZhbGlkIFdTREwgVVJMOiAnICsgdXJpICsgXCJcXG5cXG5cXHIgQ29kZTogXCIgKyByZXNwb25zZS5zdGF0dXNDb2RlICsgXCJcXG5cXG5cXHIgUmVzcG9uc2UgQm9keTogXCIgKyByZXNwb25zZS5ib2R5KSk7XG4gIC8vICAgICB9XG4gIC8vICAgfSwgcmVxdWVzdF9oZWFkZXJzLCByZXF1ZXN0X29wdGlvbnMpO1xuICAvLyB9XG4gIC8vIHJldHVybiB3c2RsO1xuXG4gIGNvbnN0IGh0dHBDbGllbnQ6IEh0dHBDbGllbnQgPSBvcHRpb25zLmh0dHBDbGllbnQ7XG4gIGNvbnN0IHdzZGxEZWYgPSBhd2FpdCBodHRwQ2xpZW50LmdldCh1cmksIHsgcmVzcG9uc2VUeXBlOiAndGV4dCcgfSkudG9Qcm9taXNlKCk7XG4gIGNvbnN0IHdzZGxPYmogPSBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGNvbnN0IHdzZGwgPSBuZXcgV1NETCh3c2RsRGVmLCB1cmksIG9wdGlvbnMpO1xuICAgIFdTRExfQ0FDSEVbdXJpXSA9IHdzZGw7XG4gICAgd3NkbC5XU0RMX0NBQ0hFID0gV1NETF9DQUNIRTtcbiAgICB3c2RsLm9uUmVhZHkocmVzb2x2ZSh3c2RsKSk7XG4gIH0pO1xuICByZXR1cm4gd3NkbE9iajtcbn1cbiJdfQ==