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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3NkbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb2FwLyIsInNvdXJjZXMiOlsibGliL3NvYXAvd3NkbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQU9BLFlBQVksQ0FBQztBQUViLE9BQU8sS0FBSyxHQUFHLE1BQU0sS0FBSyxDQUFDO0FBRTNCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFPLGFBQWEsQ0FBQztBQUNoRCxPQUFPLEtBQUssQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEtBQUssS0FBSyxNQUFNLFNBQVMsQ0FBQztBQUNqQyxPQUFPLEtBQUssR0FBRyxNQUFNLEtBQUssQ0FBQztBQUMzQixPQUFPLEVBQUUsRUFBRSxJQUFJLE1BQU0sRUFBRSxNQUFNLFFBQVEsQ0FBQzs7TUFFaEMsUUFBUSxHQUFHLENBQUMsQ0FBUyxFQUFVLEVBQUU7SUFDckMsMERBQTBEO0lBQzFELGdEQUFnRDtJQUNoRCxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssTUFBTSxFQUFFO1FBQzlCLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNuQjtJQUVELE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQzs7O0lBS0csVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVOztJQUM3QixVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVU7O0lBRTdCLFVBQVUsR0FBRztJQUNmLE1BQU0sRUFBRSxDQUFDO0lBQ1QsT0FBTyxFQUFFLENBQUM7SUFDVixPQUFPLEVBQUUsQ0FBQztJQUNWLEtBQUssRUFBRSxDQUFDO0lBQ1IsTUFBTSxFQUFFLENBQUM7SUFDVCxPQUFPLEVBQUUsQ0FBQztJQUNWLElBQUksRUFBRSxDQUFDO0lBQ1AsR0FBRyxFQUFFLENBQUM7SUFDTixJQUFJLEVBQUUsQ0FBQztJQUNQLEtBQUssRUFBRSxDQUFDO0lBQ1IsZUFBZSxFQUFFLENBQUM7SUFDbEIsa0JBQWtCLEVBQUUsQ0FB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RyxFQUFFLE9BQU87O1FBQzFDLHVDQUF1QztRQUN2Qyx3QkFBd0I7UUFDeEIsa0JBQWtCO1FBQ2xCLElBQUk7Ozs7Ozs7WUFHQSxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsSUFBSSxFQUFFOztZQUNyQyxlQUFlLEdBQUcsT0FBTyxDQUFDLFlBQVk7O1lBQ3RDLGVBQWUsR0FBRyxPQUFPLENBQUMsWUFBWTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztjQW1DcEMsVUFBVSxHQUFlLE9BQU8sQ0FBQyxVQUFVOztjQUMzQyxPQUFPLEdBQUcsTUFBTSxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRTs7Y0FDekUsT0FBTyxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTs7a0JBQ3RDLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQztZQUM1QyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1lBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDO1FBQ0YsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogQ29weXJpZ2h0IChjKSAyMDExIFZpbmF5IFB1bGltIDx2aW5heUBtaWxld2lzZS5jb20+XHJcbiAqIE1JVCBMaWNlbnNlZFxyXG4gKlxyXG4gKi9cclxuLypqc2hpbnQgcHJvdG86dHJ1ZSovXHJcblxyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCAqIGFzIHNheCBmcm9tICdzYXgnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBOYW1lc3BhY2VDb250ZXh0IH0gwqBmcm9tICcuL25zY29udGV4dCc7XHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnLi91dGlscyc7XHJcbmltcG9ydCAqIGFzIHVybCBmcm9tICd1cmwnO1xyXG5pbXBvcnQgeyBvayBhcyBhc3NlcnQgfSBmcm9tICdhc3NlcnQnO1xyXG5cclxuY29uc3Qgc3RyaXBCb20gPSAoeDogc3RyaW5nKTogc3RyaW5nID0+IHtcclxuICAvLyBDYXRjaGVzIEVGQkJCRiAoVVRGLTggQk9NKSBiZWNhdXNlIHRoZSBidWZmZXItdG8tc3RyaW5nXHJcbiAgLy8gY29udmVyc2lvbiB0cmFuc2xhdGVzIGl0IHRvIEZFRkYgKFVURi0xNiBCT00pXHJcbiAgaWYgKHguY2hhckNvZGVBdCgwKSA9PT0gMHhGRUZGKSB7XHJcbiAgICByZXR1cm4geC5zbGljZSgxKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB4O1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5sZXQgVE5TX1BSRUZJWCA9IHV0aWxzLlROU19QUkVGSVg7XHJcbmxldCBmaW5kUHJlZml4ID0gdXRpbHMuZmluZFByZWZpeDtcclxuXHJcbmxldCBQcmltaXRpdmVzID0ge1xyXG4gIHN0cmluZzogMSxcclxuICBib29sZWFuOiAxLFxyXG4gIGRlY2ltYWw6IDEsXHJcbiAgZmxvYXQ6IDEsXHJcbiAgZG91YmxlOiAxLFxyXG4gIGFueVR5cGU6IDEsXHJcbiAgYnl0ZTogMSxcclxuICBpbnQ6IDEsXHJcbiAgbG9uZzogMSxcclxuICBzaG9ydDogMSxcclxuICBuZWdhdGl2ZUludGVnZXI6IDEsXHJcbiAgbm9uTmVnYXRpdmVJbnRlZ2VyOiAxLFxyXG4gIHBvc2l0aXZlSW50ZWdlcjogMSxcclxuICBub25Qb3NpdGl2ZUludGVnZXI6IDEsXHJcbiAgdW5zaWduZWRCeXRlOiAxLFxyXG4gIHVuc2lnbmVkSW50OiAxLFxyXG4gIHVuc2lnbmVkTG9uZzogMSxcclxuICB1bnNpZ25lZFNob3J0OiAxLFxyXG4gIGR1cmF0aW9uOiAwLFxyXG4gIGRhdGVUaW1lOiAwLFxyXG4gIHRpbWU6IDAsXHJcbiAgZGF0ZTogMCxcclxuICBnWWVhck1vbnRoOiAwLFxyXG4gIGdZZWFyOiAwLFxyXG4gIGdNb250aERheTogMCxcclxuICBnRGF5OiAwLFxyXG4gIGdNb250aDogMCxcclxuICBoZXhCaW5hcnk6IDAsXHJcbiAgYmFzZTY0QmluYXJ5OiAwLFxyXG4gIGFueVVSSTogMCxcclxuICBRTmFtZTogMCxcclxuICBOT1RBVElPTjogMFxyXG59O1xyXG5cclxuZnVuY3Rpb24gc3BsaXRRTmFtZShuc05hbWUpIHtcclxuICBsZXQgaSA9IHR5cGVvZiBuc05hbWUgPT09ICdzdHJpbmcnID8gbnNOYW1lLmluZGV4T2YoJzonKSA6IC0xO1xyXG4gIHJldHVybiBpIDwgMCA/IHsgcHJlZml4OiBUTlNfUFJFRklYLCBuYW1lOiBuc05hbWUgfSA6XHJcbiAgICB7IHByZWZpeDogbnNOYW1lLnN1YnN0cmluZygwLCBpKSwgbmFtZTogbnNOYW1lLnN1YnN0cmluZyhpICsgMSkgfTtcclxufVxyXG5cclxuZnVuY3Rpb24geG1sRXNjYXBlKG9iaikge1xyXG4gIGlmICh0eXBlb2YgKG9iaikgPT09ICdzdHJpbmcnKSB7XHJcbiAgICBpZiAob2JqLnN1YnN0cigwLCA5KSA9PT0gJzwhW0NEQVRBWycgJiYgb2JqLnN1YnN0cigtMykgPT09IFwiXV0+XCIpIHtcclxuICAgICAgcmV0dXJuIG9iajtcclxuICAgIH1cclxuICAgIHJldHVybiBvYmpcclxuICAgICAgLnJlcGxhY2UoLyYvZywgJyZhbXA7JylcclxuICAgICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxyXG4gICAgICAucmVwbGFjZSgvPi9nLCAnJmd0OycpXHJcbiAgICAgIC5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7JylcclxuICAgICAgLnJlcGxhY2UoLycvZywgJyZhcG9zOycpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG9iajtcclxufVxyXG5cclxubGV0IHRyaW1MZWZ0ID0gL15bXFxzXFx4QTBdKy87XHJcbmxldCB0cmltUmlnaHQgPSAvW1xcc1xceEEwXSskLztcclxuXHJcbmZ1bmN0aW9uIHRyaW0odGV4dCkge1xyXG4gIHJldHVybiB0ZXh0LnJlcGxhY2UodHJpbUxlZnQsICcnKS5yZXBsYWNlKHRyaW1SaWdodCwgJycpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkZWVwTWVyZ2UoZGVzdGluYXRpb24sIHNvdXJjZSkge1xyXG4gIHJldHVybiBfLm1lcmdlV2l0aChkZXN0aW5hdGlvbiB8fCB7fSwgc291cmNlLCBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgcmV0dXJuIF8uaXNBcnJheShhKSA/IGEuY29uY2F0KGIpIDogdW5kZWZpbmVkO1xyXG4gIH0pO1xyXG59XHJcblxyXG5sZXQgRWxlbWVudDogYW55ID0gZnVuY3Rpb24gKG5zTmFtZSwgYXR0cnMsIG9wdGlvbnMpIHtcclxuICBsZXQgcGFydHMgPSBzcGxpdFFOYW1lKG5zTmFtZSk7XHJcblxyXG4gIHRoaXMubnNOYW1lID0gbnNOYW1lO1xyXG4gIHRoaXMucHJlZml4ID0gcGFydHMucHJlZml4O1xyXG4gIHRoaXMubmFtZSA9IHBhcnRzLm5hbWU7XHJcbiAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gIHRoaXMueG1sbnMgPSB7fTtcclxuXHJcbiAgdGhpcy5faW5pdGlhbGl6ZU9wdGlvbnMob3B0aW9ucyk7XHJcblxyXG4gIGZvciAobGV0IGtleSBpbiBhdHRycykge1xyXG4gICAgbGV0IG1hdGNoID0gL154bWxuczo/KC4qKSQvLmV4ZWMoa2V5KTtcclxuICAgIGlmIChtYXRjaCkge1xyXG4gICAgICB0aGlzLnhtbG5zW21hdGNoWzFdID8gbWF0Y2hbMV0gOiBUTlNfUFJFRklYXSA9IGF0dHJzW2tleV07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgaWYgKGtleSA9PT0gJ3ZhbHVlJykge1xyXG4gICAgICAgIHRoaXNbdGhpcy52YWx1ZUtleV0gPSBhdHRyc1trZXldO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXNbJyQnICsga2V5XSA9IGF0dHJzW2tleV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgaWYgKHRoaXMuJHRhcmdldE5hbWVzcGFjZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAvLyBBZGQgdGFyZ2V0TmFtZXNwYWNlIHRvIHRoZSBtYXBwaW5nXHJcbiAgICB0aGlzLnhtbG5zW1ROU19QUkVGSVhdID0gdGhpcy4kdGFyZ2V0TmFtZXNwYWNlO1xyXG4gIH1cclxufTtcclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLl9pbml0aWFsaXplT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgaWYgKG9wdGlvbnMpIHtcclxuICAgIHRoaXMudmFsdWVLZXkgPSBvcHRpb25zLnZhbHVlS2V5IHx8ICckdmFsdWUnO1xyXG4gICAgdGhpcy54bWxLZXkgPSBvcHRpb25zLnhtbEtleSB8fCAnJHhtbCc7XHJcbiAgICB0aGlzLmlnbm9yZWROYW1lc3BhY2VzID0gb3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcyB8fCBbXTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy52YWx1ZUtleSA9ICckdmFsdWUnO1xyXG4gICAgdGhpcy54bWxLZXkgPSAnJHhtbCc7XHJcbiAgICB0aGlzLmlnbm9yZWROYW1lc3BhY2VzID0gW107XHJcbiAgfVxyXG59O1xyXG5cclxuRWxlbWVudC5wcm90b3R5cGUuZGVsZXRlRml4ZWRBdHRycyA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLmNoaWxkcmVuICYmIHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09PSAwICYmIGRlbGV0ZSB0aGlzLmNoaWxkcmVuO1xyXG4gIHRoaXMueG1sbnMgJiYgT2JqZWN0LmtleXModGhpcy54bWxucykubGVuZ3RoID09PSAwICYmIGRlbGV0ZSB0aGlzLnhtbG5zO1xyXG4gIGRlbGV0ZSB0aGlzLm5zTmFtZTtcclxuICBkZWxldGUgdGhpcy5wcmVmaXg7XHJcbiAgZGVsZXRlIHRoaXMubmFtZTtcclxufTtcclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLmFsbG93ZWRDaGlsZHJlbiA9IFtdO1xyXG5cclxuRWxlbWVudC5wcm90b3R5cGUuc3RhcnRFbGVtZW50ID0gZnVuY3Rpb24gKHN0YWNrLCBuc05hbWUsIGF0dHJzLCBvcHRpb25zKSB7XHJcbiAgaWYgKCF0aGlzLmFsbG93ZWRDaGlsZHJlbikge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgbGV0IENoaWxkQ2xhc3MgPSB0aGlzLmFsbG93ZWRDaGlsZHJlbltzcGxpdFFOYW1lKG5zTmFtZSkubmFtZV0sXHJcbiAgICBlbGVtZW50ID0gbnVsbDtcclxuXHJcbiAgaWYgKENoaWxkQ2xhc3MpIHtcclxuICAgIHN0YWNrLnB1c2gobmV3IENoaWxkQ2xhc3MobnNOYW1lLCBhdHRycywgb3B0aW9ucykpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMudW5leHBlY3RlZChuc05hbWUpO1xyXG4gIH1cclxuXHJcbn07XHJcblxyXG5FbGVtZW50LnByb3RvdHlwZS5lbmRFbGVtZW50ID0gZnVuY3Rpb24gKHN0YWNrLCBuc05hbWUpIHtcclxuICBpZiAodGhpcy5uc05hbWUgPT09IG5zTmFtZSkge1xyXG4gICAgaWYgKHN0YWNrLmxlbmd0aCA8IDIpXHJcbiAgICAgIHJldHVybjtcclxuICAgIGxldCBwYXJlbnQgPSBzdGFja1tzdGFjay5sZW5ndGggLSAyXTtcclxuICAgIGlmICh0aGlzICE9PSBzdGFja1swXSkge1xyXG4gICAgICBfLmRlZmF1bHRzRGVlcChzdGFja1swXS54bWxucywgdGhpcy54bWxucyk7XHJcbiAgICAgIC8vIGRlbGV0ZSB0aGlzLnhtbG5zO1xyXG4gICAgICBwYXJlbnQuY2hpbGRyZW4ucHVzaCh0aGlzKTtcclxuICAgICAgcGFyZW50LmFkZENoaWxkKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgc3RhY2sucG9wKCk7XHJcbiAgfVxyXG59O1xyXG5cclxuRWxlbWVudC5wcm90b3R5cGUuYWRkQ2hpbGQgPSBmdW5jdGlvbiAoY2hpbGQpIHtcclxuICByZXR1cm47XHJcbn07XHJcblxyXG5FbGVtZW50LnByb3RvdHlwZS51bmV4cGVjdGVkID0gZnVuY3Rpb24gKG5hbWUpIHtcclxuICB0aHJvdyBuZXcgRXJyb3IoJ0ZvdW5kIHVuZXhwZWN0ZWQgZWxlbWVudCAoJyArIG5hbWUgKyAnKSBpbnNpZGUgJyArIHRoaXMubnNOYW1lKTtcclxufTtcclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLmRlc2NyaXB0aW9uID0gZnVuY3Rpb24gKGRlZmluaXRpb25zKSB7XHJcbiAgcmV0dXJuIHRoaXMuJG5hbWUgfHwgdGhpcy5uYW1lO1xyXG59O1xyXG5cclxuRWxlbWVudC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxufTtcclxuXHJcbkVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IHJvb3QgPSB0aGlzO1xyXG4gIGxldCBzdWJFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcm9vdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfTtcclxuICAvLyBpbmhlcml0cyhzdWJFbGVtZW50LCByb290KTtcclxuICBzdWJFbGVtZW50LnByb3RvdHlwZS5fX3Byb3RvX18gPSByb290LnByb3RvdHlwZTtcclxuICByZXR1cm4gc3ViRWxlbWVudDtcclxufTtcclxuXHJcblxyXG5sZXQgRWxlbWVudEVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XHJcbmxldCBBbnlFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xyXG5sZXQgSW5wdXRFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xyXG5sZXQgT3V0cHV0RWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcclxubGV0IFNpbXBsZVR5cGVFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xyXG5sZXQgUmVzdHJpY3Rpb25FbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xyXG5sZXQgRXh0ZW5zaW9uRWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcclxubGV0IENob2ljZUVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XHJcbmxldCBFbnVtZXJhdGlvbkVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XHJcbmxldCBDb21wbGV4VHlwZUVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XHJcbmxldCBDb21wbGV4Q29udGVudEVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XHJcbmxldCBTaW1wbGVDb250ZW50RWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcclxubGV0IFNlcXVlbmNlRWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcclxubGV0IEFsbEVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XHJcbmxldCBNZXNzYWdlRWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcclxubGV0IERvY3VtZW50YXRpb25FbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xyXG5cclxubGV0IFNjaGVtYUVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XHJcbmxldCBUeXBlc0VsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XHJcbmxldCBPcGVyYXRpb25FbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xyXG5sZXQgUG9ydFR5cGVFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xyXG5sZXQgQmluZGluZ0VsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XHJcbmxldCBQb3J0RWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcclxubGV0IFNlcnZpY2VFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xyXG5sZXQgRGVmaW5pdGlvbnNFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xyXG5cclxubGV0IEVsZW1lbnRUeXBlTWFwID0ge1xyXG4gIHR5cGVzOiBbVHlwZXNFbGVtZW50LCAnc2NoZW1hIGRvY3VtZW50YXRpb24nXSxcclxuICBzY2hlbWE6IFtTY2hlbWFFbGVtZW50LCAnZWxlbWVudCBjb21wbGV4VHlwZSBzaW1wbGVUeXBlIGluY2x1ZGUgaW1wb3J0J10sXHJcbiAgZWxlbWVudDogW0VsZW1lbnRFbGVtZW50LCAnYW5ub3RhdGlvbiBjb21wbGV4VHlwZSddLFxyXG4gIGFueTogW0FueUVsZW1lbnQsICcnXSxcclxuICBzaW1wbGVUeXBlOiBbU2ltcGxlVHlwZUVsZW1lbnQsICdyZXN0cmljdGlvbiddLFxyXG4gIHJlc3RyaWN0aW9uOiBbUmVzdHJpY3Rpb25FbGVtZW50LCAnZW51bWVyYXRpb24gYWxsIGNob2ljZSBzZXF1ZW5jZSddLFxyXG4gIGV4dGVuc2lvbjogW0V4dGVuc2lvbkVsZW1lbnQsICdhbGwgc2VxdWVuY2UgY2hvaWNlJ10sXHJcbiAgY2hvaWNlOiBbQ2hvaWNlRWxlbWVudCwgJ2VsZW1lbnQgc2VxdWVuY2UgY2hvaWNlIGFueSddLFxyXG4gIC8vIGdyb3VwOiBbR3JvdXBFbGVtZW50LCAnZWxlbWVudCBncm91cCddLFxyXG4gIGVudW1lcmF0aW9uOiBbRW51bWVyYXRpb25FbGVtZW50LCAnJ10sXHJcbiAgY29tcGxleFR5cGU6IFtDb21wbGV4VHlwZUVsZW1lbnQsICdhbm5vdGF0aW9uIHNlcXVlbmNlIGFsbCBjb21wbGV4Q29udGVudCBzaW1wbGVDb250ZW50IGNob2ljZSddLFxyXG4gIGNvbXBsZXhDb250ZW50OiBbQ29tcGxleENvbnRlbnRFbGVtZW50LCAnZXh0ZW5zaW9uJ10sXHJcbiAgc2ltcGxlQ29udGVudDogW1NpbXBsZUNvbnRlbnRFbGVtZW50LCAnZXh0ZW5zaW9uJ10sXHJcbiAgc2VxdWVuY2U6IFtTZXF1ZW5jZUVsZW1lbnQsICdlbGVtZW50IHNlcXVlbmNlIGNob2ljZSBhbnknXSxcclxuICBhbGw6IFtBbGxFbGVtZW50LCAnZWxlbWVudCBjaG9pY2UnXSxcclxuXHJcbiAgc2VydmljZTogW1NlcnZpY2VFbGVtZW50LCAncG9ydCBkb2N1bWVudGF0aW9uJ10sXHJcbiAgcG9ydDogW1BvcnRFbGVtZW50LCAnYWRkcmVzcyBkb2N1bWVudGF0aW9uJ10sXHJcbiAgYmluZGluZzogW0JpbmRpbmdFbGVtZW50LCAnX2JpbmRpbmcgU2VjdXJpdHlTcGVjIG9wZXJhdGlvbiBkb2N1bWVudGF0aW9uJ10sXHJcbiAgcG9ydFR5cGU6IFtQb3J0VHlwZUVsZW1lbnQsICdvcGVyYXRpb24gZG9jdW1lbnRhdGlvbiddLFxyXG4gIG1lc3NhZ2U6IFtNZXNzYWdlRWxlbWVudCwgJ3BhcnQgZG9jdW1lbnRhdGlvbiddLFxyXG4gIG9wZXJhdGlvbjogW09wZXJhdGlvbkVsZW1lbnQsICdkb2N1bWVudGF0aW9uIGlucHV0IG91dHB1dCBmYXVsdCBfb3BlcmF0aW9uJ10sXHJcbiAgaW5wdXQ6IFtJbnB1dEVsZW1lbnQsICdib2R5IFNlY3VyaXR5U3BlY1JlZiBkb2N1bWVudGF0aW9uIGhlYWRlciddLFxyXG4gIG91dHB1dDogW091dHB1dEVsZW1lbnQsICdib2R5IFNlY3VyaXR5U3BlY1JlZiBkb2N1bWVudGF0aW9uIGhlYWRlciddLFxyXG4gIGZhdWx0OiBbRWxlbWVudCwgJ19mYXVsdCBkb2N1bWVudGF0aW9uJ10sXHJcbiAgZGVmaW5pdGlvbnM6IFtEZWZpbml0aW9uc0VsZW1lbnQsICd0eXBlcyBtZXNzYWdlIHBvcnRUeXBlIGJpbmRpbmcgc2VydmljZSBpbXBvcnQgZG9jdW1lbnRhdGlvbiddLFxyXG4gIGRvY3VtZW50YXRpb246IFtEb2N1bWVudGF0aW9uRWxlbWVudCwgJyddXHJcbn07XHJcblxyXG5mdW5jdGlvbiBtYXBFbGVtZW50VHlwZXModHlwZXMpIHtcclxuICBsZXQgcnRuID0ge307XHJcbiAgdHlwZXMgPSB0eXBlcy5zcGxpdCgnICcpO1xyXG4gIHR5cGVzLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgIHJ0blt0eXBlLnJlcGxhY2UoL15fLywgJycpXSA9IChFbGVtZW50VHlwZU1hcFt0eXBlXSB8fCBbRWxlbWVudF0pWzBdO1xyXG4gIH0pO1xyXG4gIHJldHVybiBydG47XHJcbn1cclxuXHJcbmZvciAobGV0IG4gaW4gRWxlbWVudFR5cGVNYXApIHtcclxuICBsZXQgdiA9IEVsZW1lbnRUeXBlTWFwW25dO1xyXG4gIHZbMF0ucHJvdG90eXBlLmFsbG93ZWRDaGlsZHJlbiA9IG1hcEVsZW1lbnRUeXBlcyh2WzFdKTtcclxufVxyXG5cclxuTWVzc2FnZUVsZW1lbnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5lbGVtZW50ID0gbnVsbDtcclxuICB0aGlzLnBhcnRzID0gbnVsbDtcclxufTtcclxuXHJcblNjaGVtYUVsZW1lbnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5jb21wbGV4VHlwZXMgPSB7fTtcclxuICB0aGlzLnR5cGVzID0ge307XHJcbiAgdGhpcy5lbGVtZW50cyA9IHt9O1xyXG4gIHRoaXMuaW5jbHVkZXMgPSBbXTtcclxufTtcclxuXHJcblR5cGVzRWxlbWVudC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLnNjaGVtYXMgPSB7fTtcclxufTtcclxuXHJcbk9wZXJhdGlvbkVsZW1lbnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5pbnB1dCA9IG51bGw7XHJcbiAgdGhpcy5vdXRwdXQgPSBudWxsO1xyXG4gIHRoaXMuaW5wdXRTb2FwID0gbnVsbDtcclxuICB0aGlzLm91dHB1dFNvYXAgPSBudWxsO1xyXG4gIHRoaXMuc3R5bGUgPSAnJztcclxuICB0aGlzLnNvYXBBY3Rpb24gPSAnJztcclxufTtcclxuXHJcblBvcnRUeXBlRWxlbWVudC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLm1ldGhvZHMgPSB7fTtcclxufTtcclxuXHJcbkJpbmRpbmdFbGVtZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMudHJhbnNwb3J0ID0gJyc7XHJcbiAgdGhpcy5zdHlsZSA9ICcnO1xyXG4gIHRoaXMubWV0aG9kcyA9IHt9O1xyXG59O1xyXG5cclxuUG9ydEVsZW1lbnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5sb2NhdGlvbiA9IG51bGw7XHJcbn07XHJcblxyXG5TZXJ2aWNlRWxlbWVudC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLnBvcnRzID0ge307XHJcbn07XHJcblxyXG5EZWZpbml0aW9uc0VsZW1lbnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKHRoaXMubmFtZSAhPT0gJ2RlZmluaXRpb25zJykgdGhpcy51bmV4cGVjdGVkKHRoaXMubnNOYW1lKTtcclxuICB0aGlzLm1lc3NhZ2VzID0ge307XHJcbiAgdGhpcy5wb3J0VHlwZXMgPSB7fTtcclxuICB0aGlzLmJpbmRpbmdzID0ge307XHJcbiAgdGhpcy5zZXJ2aWNlcyA9IHt9O1xyXG4gIHRoaXMuc2NoZW1hcyA9IHt9O1xyXG59O1xyXG5cclxuRG9jdW1lbnRhdGlvbkVsZW1lbnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbn07XHJcblxyXG5TY2hlbWFFbGVtZW50LnByb3RvdHlwZS5tZXJnZSA9IGZ1bmN0aW9uIChzb3VyY2UpIHtcclxuICBhc3NlcnQoc291cmNlIGluc3RhbmNlb2YgU2NoZW1hRWxlbWVudCk7XHJcbiAgaWYgKHRoaXMuJHRhcmdldE5hbWVzcGFjZSA9PT0gc291cmNlLiR0YXJnZXROYW1lc3BhY2UpIHtcclxuICAgIF8ubWVyZ2UodGhpcy5jb21wbGV4VHlwZXMsIHNvdXJjZS5jb21wbGV4VHlwZXMpO1xyXG4gICAgXy5tZXJnZSh0aGlzLnR5cGVzLCBzb3VyY2UudHlwZXMpO1xyXG4gICAgXy5tZXJnZSh0aGlzLmVsZW1lbnRzLCBzb3VyY2UuZWxlbWVudHMpO1xyXG4gICAgXy5tZXJnZSh0aGlzLnhtbG5zLCBzb3VyY2UueG1sbnMpO1xyXG4gIH1cclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcblxyXG5TY2hlbWFFbGVtZW50LnByb3RvdHlwZS5hZGRDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZCkge1xyXG4gIGlmIChjaGlsZC4kbmFtZSBpbiBQcmltaXRpdmVzKVxyXG4gICAgcmV0dXJuO1xyXG4gIGlmIChjaGlsZC5uYW1lID09PSAnaW5jbHVkZScgfHwgY2hpbGQubmFtZSA9PT0gJ2ltcG9ydCcpIHtcclxuICAgIGxldCBsb2NhdGlvbiA9IGNoaWxkLiRzY2hlbWFMb2NhdGlvbiB8fCBjaGlsZC4kbG9jYXRpb247XHJcbiAgICBpZiAobG9jYXRpb24pIHtcclxuICAgICAgdGhpcy5pbmNsdWRlcy5wdXNoKHtcclxuICAgICAgICBuYW1lc3BhY2U6IGNoaWxkLiRuYW1lc3BhY2UgfHwgY2hpbGQuJHRhcmdldE5hbWVzcGFjZSB8fCB0aGlzLiR0YXJnZXROYW1lc3BhY2UsXHJcbiAgICAgICAgbG9jYXRpb246IGxvY2F0aW9uXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlIGlmIChjaGlsZC5uYW1lID09PSAnY29tcGxleFR5cGUnKSB7XHJcbiAgICB0aGlzLmNvbXBsZXhUeXBlc1tjaGlsZC4kbmFtZV0gPSBjaGlsZDtcclxuICB9XHJcbiAgZWxzZSBpZiAoY2hpbGQubmFtZSA9PT0gJ2VsZW1lbnQnKSB7XHJcbiAgICB0aGlzLmVsZW1lbnRzW2NoaWxkLiRuYW1lXSA9IGNoaWxkO1xyXG4gIH1cclxuICBlbHNlIGlmIChjaGlsZC4kbmFtZSkge1xyXG4gICAgdGhpcy50eXBlc1tjaGlsZC4kbmFtZV0gPSBjaGlsZDtcclxuICB9XHJcbiAgdGhpcy5jaGlsZHJlbi5wb3AoKTtcclxuICAvLyBjaGlsZC5kZWxldGVGaXhlZEF0dHJzKCk7XHJcbn07XHJcbi8vZml4IzMyNVxyXG5UeXBlc0VsZW1lbnQucHJvdG90eXBlLmFkZENoaWxkID0gZnVuY3Rpb24gKGNoaWxkKSB7XHJcbiAgYXNzZXJ0KGNoaWxkIGluc3RhbmNlb2YgU2NoZW1hRWxlbWVudCk7XHJcblxyXG4gIGxldCB0YXJnZXROYW1lc3BhY2UgPSBjaGlsZC4kdGFyZ2V0TmFtZXNwYWNlO1xyXG5cclxuICBpZiAoIXRoaXMuc2NoZW1hcy5oYXNPd25Qcm9wZXJ0eSh0YXJnZXROYW1lc3BhY2UpKSB7XHJcbiAgICB0aGlzLnNjaGVtYXNbdGFyZ2V0TmFtZXNwYWNlXSA9IGNoaWxkO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdUYXJnZXQtTmFtZXNwYWNlIFwiJyArIHRhcmdldE5hbWVzcGFjZSArICdcIiBhbHJlYWR5IGluIHVzZSBieSBhbm90aGVyIFNjaGVtYSEnKTtcclxuICB9XHJcbn07XHJcblxyXG5JbnB1dEVsZW1lbnQucHJvdG90eXBlLmFkZENoaWxkID0gZnVuY3Rpb24gKGNoaWxkKSB7XHJcbiAgaWYgKGNoaWxkLm5hbWUgPT09ICdib2R5Jykge1xyXG4gICAgdGhpcy51c2UgPSBjaGlsZC4kdXNlO1xyXG4gICAgaWYgKHRoaXMudXNlID09PSAnZW5jb2RlZCcpIHtcclxuICAgICAgdGhpcy5lbmNvZGluZ1N0eWxlID0gY2hpbGQuJGVuY29kaW5nU3R5bGU7XHJcbiAgICB9XHJcbiAgICB0aGlzLmNoaWxkcmVuLnBvcCgpO1xyXG4gIH1cclxufTtcclxuXHJcbk91dHB1dEVsZW1lbnQucHJvdG90eXBlLmFkZENoaWxkID0gZnVuY3Rpb24gKGNoaWxkKSB7XHJcbiAgaWYgKGNoaWxkLm5hbWUgPT09ICdib2R5Jykge1xyXG4gICAgdGhpcy51c2UgPSBjaGlsZC4kdXNlO1xyXG4gICAgaWYgKHRoaXMudXNlID09PSAnZW5jb2RlZCcpIHtcclxuICAgICAgdGhpcy5lbmNvZGluZ1N0eWxlID0gY2hpbGQuJGVuY29kaW5nU3R5bGU7XHJcbiAgICB9XHJcbiAgICB0aGlzLmNoaWxkcmVuLnBvcCgpO1xyXG4gIH1cclxufTtcclxuXHJcbk9wZXJhdGlvbkVsZW1lbnQucHJvdG90eXBlLmFkZENoaWxkID0gZnVuY3Rpb24gKGNoaWxkKSB7XHJcbiAgaWYgKGNoaWxkLm5hbWUgPT09ICdvcGVyYXRpb24nKSB7XHJcbiAgICB0aGlzLnNvYXBBY3Rpb24gPSBjaGlsZC4kc29hcEFjdGlvbiB8fCAnJztcclxuICAgIHRoaXMuc3R5bGUgPSBjaGlsZC4kc3R5bGUgfHwgJyc7XHJcbiAgICB0aGlzLmNoaWxkcmVuLnBvcCgpO1xyXG4gIH1cclxufTtcclxuXHJcbkJpbmRpbmdFbGVtZW50LnByb3RvdHlwZS5hZGRDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZCkge1xyXG4gIGlmIChjaGlsZC5uYW1lID09PSAnYmluZGluZycpIHtcclxuICAgIHRoaXMudHJhbnNwb3J0ID0gY2hpbGQuJHRyYW5zcG9ydDtcclxuICAgIHRoaXMuc3R5bGUgPSBjaGlsZC4kc3R5bGU7XHJcbiAgICB0aGlzLmNoaWxkcmVuLnBvcCgpO1xyXG4gIH1cclxufTtcclxuXHJcblBvcnRFbGVtZW50LnByb3RvdHlwZS5hZGRDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZCkge1xyXG4gIGlmIChjaGlsZC5uYW1lID09PSAnYWRkcmVzcycgJiYgdHlwZW9mIChjaGlsZC4kbG9jYXRpb24pICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgdGhpcy5sb2NhdGlvbiA9IGNoaWxkLiRsb2NhdGlvbjtcclxuICB9XHJcbn07XHJcblxyXG5EZWZpbml0aW9uc0VsZW1lbnQucHJvdG90eXBlLmFkZENoaWxkID0gZnVuY3Rpb24gKGNoaWxkKSB7XHJcbiAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gIGlmIChjaGlsZCBpbnN0YW5jZW9mIFR5cGVzRWxlbWVudCkge1xyXG4gICAgLy8gTWVyZ2UgdHlwZXMuc2NoZW1hcyBpbnRvIGRlZmluaXRpb25zLnNjaGVtYXNcclxuICAgIF8ubWVyZ2Uoc2VsZi5zY2hlbWFzLCBjaGlsZC5zY2hlbWFzKTtcclxuICB9XHJcbiAgZWxzZSBpZiAoY2hpbGQgaW5zdGFuY2VvZiBNZXNzYWdlRWxlbWVudCkge1xyXG4gICAgc2VsZi5tZXNzYWdlc1tjaGlsZC4kbmFtZV0gPSBjaGlsZDtcclxuICB9XHJcbiAgZWxzZSBpZiAoY2hpbGQubmFtZSA9PT0gJ2ltcG9ydCcpIHtcclxuICAgIHNlbGYuc2NoZW1hc1tjaGlsZC4kbmFtZXNwYWNlXSA9IG5ldyBTY2hlbWFFbGVtZW50KGNoaWxkLiRuYW1lc3BhY2UsIHt9KTtcclxuICAgIHNlbGYuc2NoZW1hc1tjaGlsZC4kbmFtZXNwYWNlXS5hZGRDaGlsZChjaGlsZCk7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKGNoaWxkIGluc3RhbmNlb2YgUG9ydFR5cGVFbGVtZW50KSB7XHJcbiAgICBzZWxmLnBvcnRUeXBlc1tjaGlsZC4kbmFtZV0gPSBjaGlsZDtcclxuICB9XHJcbiAgZWxzZSBpZiAoY2hpbGQgaW5zdGFuY2VvZiBCaW5kaW5nRWxlbWVudCkge1xyXG4gICAgaWYgKGNoaWxkLnRyYW5zcG9ydCA9PT0gJ2h0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3NvYXAvaHR0cCcgfHxcclxuICAgICAgY2hpbGQudHJhbnNwb3J0ID09PSAnaHR0cDovL3d3dy53My5vcmcvMjAwMy8wNS9zb2FwL2JpbmRpbmdzL0hUVFAvJylcclxuICAgICAgc2VsZi5iaW5kaW5nc1tjaGlsZC4kbmFtZV0gPSBjaGlsZDtcclxuICB9XHJcbiAgZWxzZSBpZiAoY2hpbGQgaW5zdGFuY2VvZiBTZXJ2aWNlRWxlbWVudCkge1xyXG4gICAgc2VsZi5zZXJ2aWNlc1tjaGlsZC4kbmFtZV0gPSBjaGlsZDtcclxuICB9XHJcbiAgZWxzZSBpZiAoY2hpbGQgaW5zdGFuY2VvZiBEb2N1bWVudGF0aW9uRWxlbWVudCkge1xyXG4gIH1cclxuICB0aGlzLmNoaWxkcmVuLnBvcCgpO1xyXG59O1xyXG5cclxuTWVzc2FnZUVsZW1lbnQucHJvdG90eXBlLnBvc3RQcm9jZXNzID0gZnVuY3Rpb24gKGRlZmluaXRpb25zKSB7XHJcbiAgbGV0IHBhcnQgPSBudWxsO1xyXG4gIGxldCBjaGlsZCA9IHVuZGVmaW5lZDtcclxuICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuIHx8IFtdO1xyXG4gIGxldCBucyA9IHVuZGVmaW5lZDtcclxuICBsZXQgbnNOYW1lID0gdW5kZWZpbmVkO1xyXG4gIGxldCBpID0gdW5kZWZpbmVkO1xyXG4gIGxldCB0eXBlID0gdW5kZWZpbmVkO1xyXG5cclxuICBmb3IgKGkgaW4gY2hpbGRyZW4pIHtcclxuICAgIGlmICgoY2hpbGQgPSBjaGlsZHJlbltpXSkubmFtZSA9PT0gJ3BhcnQnKSB7XHJcbiAgICAgIHBhcnQgPSBjaGlsZDtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAoIXBhcnQpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIGlmIChwYXJ0LiRlbGVtZW50KSB7XHJcbiAgICBsZXQgbG9va3VwVHlwZXMgPSBbXSxcclxuICAgICAgZWxlbWVudENoaWxkcmVuO1xyXG5cclxuICAgIGRlbGV0ZSB0aGlzLnBhcnRzO1xyXG5cclxuICAgIG5zTmFtZSA9IHNwbGl0UU5hbWUocGFydC4kZWxlbWVudCk7XHJcbiAgICBucyA9IG5zTmFtZS5wcmVmaXg7XHJcbiAgICBsZXQgc2NoZW1hID0gZGVmaW5pdGlvbnMuc2NoZW1hc1tkZWZpbml0aW9ucy54bWxuc1tuc11dO1xyXG4gICAgdGhpcy5lbGVtZW50ID0gc2NoZW1hLmVsZW1lbnRzW25zTmFtZS5uYW1lXTtcclxuICAgIGlmICghdGhpcy5lbGVtZW50KSB7XHJcbiAgICAgIC8vIGRlYnVnKG5zTmFtZS5uYW1lICsgXCIgaXMgbm90IHByZXNlbnQgaW4gd3NkbCBhbmQgY2Fubm90IGJlIHByb2Nlc3NlZCBjb3JyZWN0bHkuXCIpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLmVsZW1lbnQudGFyZ2V0TlNBbGlhcyA9IG5zO1xyXG4gICAgdGhpcy5lbGVtZW50LnRhcmdldE5hbWVzcGFjZSA9IGRlZmluaXRpb25zLnhtbG5zW25zXTtcclxuXHJcbiAgICAvLyBzZXQgdGhlIG9wdGlvbmFsICRsb29rdXBUeXBlIHRvIGJlIHVzZWQgd2l0aGluIGBjbGllbnQjX2ludm9rZSgpYCB3aGVuXHJcbiAgICAvLyBjYWxsaW5nIGB3c2RsI29iamVjdFRvRG9jdW1lbnRYTUwoKVxyXG4gICAgdGhpcy5lbGVtZW50LiRsb29rdXBUeXBlID0gcGFydC4kZWxlbWVudDtcclxuXHJcbiAgICBlbGVtZW50Q2hpbGRyZW4gPSB0aGlzLmVsZW1lbnQuY2hpbGRyZW47XHJcblxyXG4gICAgLy8gZ2V0IGFsbCBuZXN0ZWQgbG9va3VwIHR5cGVzIChvbmx5IGNvbXBsZXggdHlwZXMgYXJlIGZvbGxvd2VkKVxyXG4gICAgaWYgKGVsZW1lbnRDaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBlbGVtZW50Q2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsb29rdXBUeXBlcy5wdXNoKHRoaXMuX2dldE5lc3RlZExvb2t1cFR5cGVTdHJpbmcoZWxlbWVudENoaWxkcmVuW2ldKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBpZiBuZXN0ZWQgbG9va3VwIHR5cGVzIHdoZXJlIGZvdW5kLCBwcmVwYXJlIHRoZW0gZm9yIGZ1cnRlciB1c2FnZVxyXG4gICAgaWYgKGxvb2t1cFR5cGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgbG9va3VwVHlwZXMgPSBsb29rdXBUeXBlcy5cclxuICAgICAgICBqb2luKCdfJykuXHJcbiAgICAgICAgc3BsaXQoJ18nKS5cclxuICAgICAgICBmaWx0ZXIoZnVuY3Rpb24gcmVtb3ZlRW1wdHlMb29rdXBUeXBlcyh0eXBlKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHlwZSAhPT0gJ14nO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgbGV0IHNjaGVtYVhtbG5zID0gZGVmaW5pdGlvbnMuc2NoZW1hc1t0aGlzLmVsZW1lbnQudGFyZ2V0TmFtZXNwYWNlXS54bWxucztcclxuXHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsb29rdXBUeXBlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxvb2t1cFR5cGVzW2ldID0gdGhpcy5fY3JlYXRlTG9va3VwVHlwZU9iamVjdChsb29rdXBUeXBlc1tpXSwgc2NoZW1hWG1sbnMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5lbGVtZW50LiRsb29rdXBUeXBlcyA9IGxvb2t1cFR5cGVzO1xyXG5cclxuICAgIGlmICh0aGlzLmVsZW1lbnQuJHR5cGUpIHtcclxuICAgICAgdHlwZSA9IHNwbGl0UU5hbWUodGhpcy5lbGVtZW50LiR0eXBlKTtcclxuICAgICAgbGV0IHR5cGVOcyA9IHNjaGVtYS54bWxucyAmJiBzY2hlbWEueG1sbnNbdHlwZS5wcmVmaXhdIHx8IGRlZmluaXRpb25zLnhtbG5zW3R5cGUucHJlZml4XTtcclxuXHJcbiAgICAgIGlmICh0eXBlTnMpIHtcclxuICAgICAgICBpZiAodHlwZS5uYW1lIGluIFByaW1pdGl2ZXMpIHtcclxuICAgICAgICAgIC8vIHRoaXMuZWxlbWVudCA9IHRoaXMuZWxlbWVudC4kdHlwZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAvLyBmaXJzdCBjaGVjayBsb2NhbCBtYXBwaW5nIG9mIG5zIGFsaWFzIHRvIG5hbWVzcGFjZVxyXG4gICAgICAgICAgc2NoZW1hID0gZGVmaW5pdGlvbnMuc2NoZW1hc1t0eXBlTnNdO1xyXG4gICAgICAgICAgbGV0IGN0eXBlID0gc2NoZW1hLmNvbXBsZXhUeXBlc1t0eXBlLm5hbWVdIHx8IHNjaGVtYS50eXBlc1t0eXBlLm5hbWVdIHx8IHNjaGVtYS5lbGVtZW50c1t0eXBlLm5hbWVdO1xyXG5cclxuXHJcbiAgICAgICAgICBpZiAoY3R5cGUpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJ0cyA9IGN0eXBlLmRlc2NyaXB0aW9uKGRlZmluaXRpb25zLCBzY2hlbWEueG1sbnMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGxldCBtZXRob2QgPSB0aGlzLmVsZW1lbnQuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMsIHNjaGVtYS54bWxucyk7XHJcbiAgICAgIHRoaXMucGFydHMgPSBtZXRob2RbbnNOYW1lLm5hbWVdO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB0aGlzLmNoaWxkcmVuLnNwbGljZSgwLCAxKTtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gcnBjIGVuY29kaW5nXHJcbiAgICB0aGlzLnBhcnRzID0ge307XHJcbiAgICBkZWxldGUgdGhpcy5lbGVtZW50O1xyXG4gICAgZm9yIChpID0gMDsgcGFydCA9IHRoaXMuY2hpbGRyZW5baV07IGkrKykge1xyXG4gICAgICBpZiAocGFydC5uYW1lID09PSAnZG9jdW1lbnRhdGlvbicpIHtcclxuICAgICAgICAvLyA8d3NkbDpkb2N1bWVudGF0aW9uIGNhbiBiZSBwcmVzZW50IHVuZGVyIDx3c2RsOm1lc3NhZ2U+XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuICAgICAgYXNzZXJ0KHBhcnQubmFtZSA9PT0gJ3BhcnQnLCAnRXhwZWN0ZWQgcGFydCBlbGVtZW50Jyk7XHJcbiAgICAgIG5zTmFtZSA9IHNwbGl0UU5hbWUocGFydC4kdHlwZSk7XHJcbiAgICAgIG5zID0gZGVmaW5pdGlvbnMueG1sbnNbbnNOYW1lLnByZWZpeF07XHJcbiAgICAgIHR5cGUgPSBuc05hbWUubmFtZTtcclxuICAgICAgbGV0IHNjaGVtYURlZmluaXRpb24gPSBkZWZpbml0aW9ucy5zY2hlbWFzW25zXTtcclxuICAgICAgaWYgKHR5cGVvZiBzY2hlbWFEZWZpbml0aW9uICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHRoaXMucGFydHNbcGFydC4kbmFtZV0gPSBkZWZpbml0aW9ucy5zY2hlbWFzW25zXS50eXBlc1t0eXBlXSB8fCBkZWZpbml0aW9ucy5zY2hlbWFzW25zXS5jb21wbGV4VHlwZXNbdHlwZV07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5wYXJ0c1twYXJ0LiRuYW1lXSA9IHBhcnQuJHR5cGU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5wYXJ0c1twYXJ0LiRuYW1lXSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICB0aGlzLnBhcnRzW3BhcnQuJG5hbWVdLnByZWZpeCA9IG5zTmFtZS5wcmVmaXg7XHJcbiAgICAgICAgdGhpcy5wYXJ0c1twYXJ0LiRuYW1lXS54bWxucyA9IG5zO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpLS0sIDEpO1xyXG4gICAgfVxyXG4gIH1cclxuICB0aGlzLmRlbGV0ZUZpeGVkQXR0cnMoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUYWtlcyBhIGdpdmVuIG5hbWVzcGFjZWQgU3RyaW5nKGZvciBleGFtcGxlOiAnYWxpYXM6cHJvcGVydHknKSBhbmQgY3JlYXRlcyBhIGxvb2t1cFR5cGVcclxuICogb2JqZWN0IGZvciBmdXJ0aGVyIHVzZSBpbiBhcyBmaXJzdCAobG9va3VwKSBgcGFyYW1ldGVyVHlwZU9iamAgd2l0aGluIHRoZSBgb2JqZWN0VG9YTUxgXHJcbiAqIG1ldGhvZCBhbmQgcHJvdmlkZXMgYW4gZW50cnkgcG9pbnQgZm9yIHRoZSBhbHJlYWR5IGV4aXN0aW5nIGNvZGUgaW4gYGZpbmRDaGlsZFNjaGVtYU9iamVjdGAuXHJcbiAqXHJcbiAqIEBtZXRob2QgX2NyZWF0ZUxvb2t1cFR5cGVPYmplY3RcclxuICogQHBhcmFtIHtTdHJpbmd9ICAgICAgICAgICAgbnNTdHJpbmcgICAgICAgICAgVGhlIE5TIFN0cmluZyAoZm9yIGV4YW1wbGUgXCJhbGlhczp0eXBlXCIpLlxyXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICAgICB4bWxucyAgICAgICBUaGUgZnVsbHkgcGFyc2VkIGB3c2RsYCBkZWZpbml0aW9ucyBvYmplY3QgKGluY2x1ZGluZyBhbGwgc2NoZW1hcykuXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5NZXNzYWdlRWxlbWVudC5wcm90b3R5cGUuX2NyZWF0ZUxvb2t1cFR5cGVPYmplY3QgPSBmdW5jdGlvbiAobnNTdHJpbmcsIHhtbG5zKSB7XHJcbiAgbGV0IHNwbGl0dGVkTlNTdHJpbmcgPSBzcGxpdFFOYW1lKG5zU3RyaW5nKSxcclxuICAgIG5zQWxpYXMgPSBzcGxpdHRlZE5TU3RyaW5nLnByZWZpeCxcclxuICAgIHNwbGl0dGVkTmFtZSA9IHNwbGl0dGVkTlNTdHJpbmcubmFtZS5zcGxpdCgnIycpLFxyXG4gICAgdHlwZSA9IHNwbGl0dGVkTmFtZVswXSxcclxuICAgIG5hbWUgPSBzcGxpdHRlZE5hbWVbMV0sXHJcbiAgICBsb29rdXBUeXBlT2JqOiBhbnkgPSB7fTtcclxuXHJcbiAgbG9va3VwVHlwZU9iai4kbmFtZXNwYWNlID0geG1sbnNbbnNBbGlhc107XHJcbiAgbG9va3VwVHlwZU9iai4kdHlwZSA9IG5zQWxpYXMgKyAnOicgKyB0eXBlO1xyXG4gIGxvb2t1cFR5cGVPYmouJG5hbWUgPSBuYW1lO1xyXG5cclxuICByZXR1cm4gbG9va3VwVHlwZU9iajtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBJdGVyYXRlcyB0aHJvdWdoIHRoZSBlbGVtZW50IGFuZCBldmVyeSBuZXN0ZWQgY2hpbGQgdG8gZmluZCBhbnkgZGVmaW5lZCBgJHR5cGVgXHJcbiAqIHByb3BlcnR5IGFuZCByZXR1cm5zIGl0IGluIGEgdW5kZXJzY29yZSAoJ18nKSBzZXBhcmF0ZWQgU3RyaW5nICh1c2luZyAnXicgYXMgZGVmYXVsdFxyXG4gKiB2YWx1ZSBpZiBubyBgJHR5cGVgIHByb3BlcnR5IHdhcyBmb3VuZCkuXHJcbiAqXHJcbiAqIEBtZXRob2QgX2dldE5lc3RlZExvb2t1cFR5cGVTdHJpbmdcclxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgICAgZWxlbWVudCAgICAgICAgIFRoZSBlbGVtZW50IHdoaWNoIChwcm9iYWJseSkgY29udGFpbnMgbmVzdGVkIGAkdHlwZWAgdmFsdWVzLlxyXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuTWVzc2FnZUVsZW1lbnQucHJvdG90eXBlLl9nZXROZXN0ZWRMb29rdXBUeXBlU3RyaW5nID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICBsZXQgcmVzb2x2ZWRUeXBlID0gJ14nLFxyXG4gICAgZXhjbHVkZWQgPSB0aGlzLmlnbm9yZWROYW1lc3BhY2VzLmNvbmNhdCgneHMnKTsgLy8gZG8gbm90IHByb2Nlc3MgJHR5cGUgdmFsdWVzIHdpY2ggc3RhcnQgd2l0aFxyXG5cclxuICBpZiAoZWxlbWVudC5oYXNPd25Qcm9wZXJ0eSgnJHR5cGUnKSAmJiB0eXBlb2YgZWxlbWVudC4kdHlwZSA9PT0gJ3N0cmluZycpIHtcclxuICAgIGlmIChleGNsdWRlZC5pbmRleE9mKGVsZW1lbnQuJHR5cGUuc3BsaXQoJzonKVswXSkgPT09IC0xKSB7XHJcbiAgICAgIHJlc29sdmVkVHlwZSArPSAoJ18nICsgZWxlbWVudC4kdHlwZSArICcjJyArIGVsZW1lbnQuJG5hbWUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKGVsZW1lbnQuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgbGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIGVsZW1lbnQuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcclxuICAgICAgbGV0IHJlc29sdmVkQ2hpbGRUeXBlID0gc2VsZi5fZ2V0TmVzdGVkTG9va3VwVHlwZVN0cmluZyhjaGlsZCkucmVwbGFjZSgvXFxeXy8sICcnKTtcclxuXHJcbiAgICAgIGlmIChyZXNvbHZlZENoaWxkVHlwZSAmJiB0eXBlb2YgcmVzb2x2ZWRDaGlsZFR5cGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgcmVzb2x2ZWRUeXBlICs9ICgnXycgKyByZXNvbHZlZENoaWxkVHlwZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc29sdmVkVHlwZTtcclxufTtcclxuXHJcbk9wZXJhdGlvbkVsZW1lbnQucHJvdG90eXBlLnBvc3RQcm9jZXNzID0gZnVuY3Rpb24gKGRlZmluaXRpb25zLCB0YWcpIHtcclxuICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xyXG4gIGZvciAobGV0IGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBjaGlsZHJlbltpXTsgaSsrKSB7XHJcbiAgICBpZiAoY2hpbGQubmFtZSAhPT0gJ2lucHV0JyAmJiBjaGlsZC5uYW1lICE9PSAnb3V0cHV0JylcclxuICAgICAgY29udGludWU7XHJcbiAgICBpZiAodGFnID09PSAnYmluZGluZycpIHtcclxuICAgICAgdGhpc1tjaGlsZC5uYW1lXSA9IGNoaWxkO1xyXG4gICAgICBjaGlsZHJlbi5zcGxpY2UoaS0tLCAxKTtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcbiAgICBsZXQgbWVzc2FnZU5hbWUgPSBzcGxpdFFOYW1lKGNoaWxkLiRtZXNzYWdlKS5uYW1lO1xyXG4gICAgbGV0IG1lc3NhZ2UgPSBkZWZpbml0aW9ucy5tZXNzYWdlc1ttZXNzYWdlTmFtZV07XHJcbiAgICBtZXNzYWdlLnBvc3RQcm9jZXNzKGRlZmluaXRpb25zKTtcclxuICAgIGlmIChtZXNzYWdlLmVsZW1lbnQpIHtcclxuICAgICAgZGVmaW5pdGlvbnMubWVzc2FnZXNbbWVzc2FnZS5lbGVtZW50LiRuYW1lXSA9IG1lc3NhZ2U7XHJcbiAgICAgIHRoaXNbY2hpbGQubmFtZV0gPSBtZXNzYWdlLmVsZW1lbnQ7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhpc1tjaGlsZC5uYW1lXSA9IG1lc3NhZ2U7XHJcbiAgICB9XHJcbiAgICBjaGlsZHJlbi5zcGxpY2UoaS0tLCAxKTtcclxuICB9XHJcbiAgdGhpcy5kZWxldGVGaXhlZEF0dHJzKCk7XHJcbn07XHJcblxyXG5Qb3J0VHlwZUVsZW1lbnQucHJvdG90eXBlLnBvc3RQcm9jZXNzID0gZnVuY3Rpb24gKGRlZmluaXRpb25zKSB7XHJcbiAgbGV0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcclxuICBpZiAodHlwZW9mIGNoaWxkcmVuID09PSAndW5kZWZpbmVkJylcclxuICAgIHJldHVybjtcclxuICBmb3IgKGxldCBpID0gMCwgY2hpbGQ7IGNoaWxkID0gY2hpbGRyZW5baV07IGkrKykge1xyXG4gICAgaWYgKGNoaWxkLm5hbWUgIT09ICdvcGVyYXRpb24nKVxyXG4gICAgICBjb250aW51ZTtcclxuICAgIGNoaWxkLnBvc3RQcm9jZXNzKGRlZmluaXRpb25zLCAncG9ydFR5cGUnKTtcclxuICAgIHRoaXMubWV0aG9kc1tjaGlsZC4kbmFtZV0gPSBjaGlsZDtcclxuICAgIGNoaWxkcmVuLnNwbGljZShpLS0sIDEpO1xyXG4gIH1cclxuICBkZWxldGUgdGhpcy4kbmFtZTtcclxuICB0aGlzLmRlbGV0ZUZpeGVkQXR0cnMoKTtcclxufTtcclxuXHJcbkJpbmRpbmdFbGVtZW50LnByb3RvdHlwZS5wb3N0UHJvY2VzcyA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucykge1xyXG4gIGxldCB0eXBlID0gc3BsaXRRTmFtZSh0aGlzLiR0eXBlKS5uYW1lLFxyXG4gICAgcG9ydFR5cGUgPSBkZWZpbml0aW9ucy5wb3J0VHlwZXNbdHlwZV0sXHJcbiAgICBzdHlsZSA9IHRoaXMuc3R5bGUsXHJcbiAgICBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XHJcbiAgaWYgKHBvcnRUeXBlKSB7XHJcbiAgICBwb3J0VHlwZS5wb3N0UHJvY2VzcyhkZWZpbml0aW9ucyk7XHJcbiAgICB0aGlzLm1ldGhvZHMgPSBwb3J0VHlwZS5tZXRob2RzO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBjaGlsZHJlbltpXTsgaSsrKSB7XHJcbiAgICAgIGlmIChjaGlsZC5uYW1lICE9PSAnb3BlcmF0aW9uJylcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgY2hpbGQucG9zdFByb2Nlc3MoZGVmaW5pdGlvbnMsICdiaW5kaW5nJyk7XHJcbiAgICAgIGNoaWxkcmVuLnNwbGljZShpLS0sIDEpO1xyXG4gICAgICBjaGlsZC5zdHlsZSB8fCAoY2hpbGQuc3R5bGUgPSBzdHlsZSk7XHJcbiAgICAgIGxldCBtZXRob2QgPSB0aGlzLm1ldGhvZHNbY2hpbGQuJG5hbWVdO1xyXG5cclxuICAgICAgaWYgKG1ldGhvZCkge1xyXG4gICAgICAgIG1ldGhvZC5zdHlsZSA9IGNoaWxkLnN0eWxlO1xyXG4gICAgICAgIG1ldGhvZC5zb2FwQWN0aW9uID0gY2hpbGQuc29hcEFjdGlvbjtcclxuICAgICAgICBtZXRob2QuaW5wdXRTb2FwID0gY2hpbGQuaW5wdXQgfHwgbnVsbDtcclxuICAgICAgICBtZXRob2Qub3V0cHV0U29hcCA9IGNoaWxkLm91dHB1dCB8fCBudWxsO1xyXG4gICAgICAgIG1ldGhvZC5pbnB1dFNvYXAgJiYgbWV0aG9kLmlucHV0U29hcC5kZWxldGVGaXhlZEF0dHJzKCk7XHJcbiAgICAgICAgbWV0aG9kLm91dHB1dFNvYXAgJiYgbWV0aG9kLm91dHB1dFNvYXAuZGVsZXRlRml4ZWRBdHRycygpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGRlbGV0ZSB0aGlzLiRuYW1lO1xyXG4gIGRlbGV0ZSB0aGlzLiR0eXBlO1xyXG4gIHRoaXMuZGVsZXRlRml4ZWRBdHRycygpO1xyXG59O1xyXG5cclxuU2VydmljZUVsZW1lbnQucHJvdG90eXBlLnBvc3RQcm9jZXNzID0gZnVuY3Rpb24gKGRlZmluaXRpb25zKSB7XHJcbiAgbGV0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbixcclxuICAgIGJpbmRpbmdzID0gZGVmaW5pdGlvbnMuYmluZGluZ3M7XHJcbiAgaWYgKGNoaWxkcmVuICYmIGNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuICAgIGZvciAobGV0IGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBjaGlsZHJlbltpXTsgaSsrKSB7XHJcbiAgICAgIGlmIChjaGlsZC5uYW1lICE9PSAncG9ydCcpXHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIGxldCBiaW5kaW5nTmFtZSA9IHNwbGl0UU5hbWUoY2hpbGQuJGJpbmRpbmcpLm5hbWU7XHJcbiAgICAgIGxldCBiaW5kaW5nID0gYmluZGluZ3NbYmluZGluZ05hbWVdO1xyXG4gICAgICBpZiAoYmluZGluZykge1xyXG4gICAgICAgIGJpbmRpbmcucG9zdFByb2Nlc3MoZGVmaW5pdGlvbnMpO1xyXG4gICAgICAgIHRoaXMucG9ydHNbY2hpbGQuJG5hbWVdID0ge1xyXG4gICAgICAgICAgbG9jYXRpb246IGNoaWxkLmxvY2F0aW9uLFxyXG4gICAgICAgICAgYmluZGluZzogYmluZGluZ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2hpbGRyZW4uc3BsaWNlKGktLSwgMSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgZGVsZXRlIHRoaXMuJG5hbWU7XHJcbiAgdGhpcy5kZWxldGVGaXhlZEF0dHJzKCk7XHJcbn07XHJcblxyXG5cclxuU2ltcGxlVHlwZUVsZW1lbnQucHJvdG90eXBlLmRlc2NyaXB0aW9uID0gZnVuY3Rpb24gKGRlZmluaXRpb25zKSB7XHJcbiAgbGV0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcclxuICBmb3IgKGxldCBpID0gMCwgY2hpbGQ7IGNoaWxkID0gY2hpbGRyZW5baV07IGkrKykge1xyXG4gICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgUmVzdHJpY3Rpb25FbGVtZW50KVxyXG4gICAgICByZXR1cm4gdGhpcy4kbmFtZSArIFwifFwiICsgY2hpbGQuZGVzY3JpcHRpb24oKTtcclxuICB9XHJcbiAgcmV0dXJuIHt9O1xyXG59O1xyXG5cclxuUmVzdHJpY3Rpb25FbGVtZW50LnByb3RvdHlwZS5kZXNjcmlwdGlvbiA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucywgeG1sbnMpIHtcclxuICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xyXG4gIGxldCBkZXNjO1xyXG4gIGZvciAobGV0IGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBjaGlsZHJlbltpXTsgaSsrKSB7XHJcbiAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBTZXF1ZW5jZUVsZW1lbnQgfHxcclxuICAgICAgY2hpbGQgaW5zdGFuY2VvZiBDaG9pY2VFbGVtZW50KSB7XHJcbiAgICAgIGRlc2MgPSBjaGlsZC5kZXNjcmlwdGlvbihkZWZpbml0aW9ucywgeG1sbnMpO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKGRlc2MgJiYgdGhpcy4kYmFzZSkge1xyXG4gICAgbGV0IHR5cGUgPSBzcGxpdFFOYW1lKHRoaXMuJGJhc2UpLFxyXG4gICAgICB0eXBlTmFtZSA9IHR5cGUubmFtZSxcclxuICAgICAgbnMgPSB4bWxucyAmJiB4bWxuc1t0eXBlLnByZWZpeF0gfHwgZGVmaW5pdGlvbnMueG1sbnNbdHlwZS5wcmVmaXhdLFxyXG4gICAgICBzY2hlbWEgPSBkZWZpbml0aW9ucy5zY2hlbWFzW25zXSxcclxuICAgICAgdHlwZUVsZW1lbnQgPSBzY2hlbWEgJiYgKHNjaGVtYS5jb21wbGV4VHlwZXNbdHlwZU5hbWVdIHx8IHNjaGVtYS50eXBlc1t0eXBlTmFtZV0gfHwgc2NoZW1hLmVsZW1lbnRzW3R5cGVOYW1lXSk7XHJcblxyXG4gICAgZGVzYy5nZXRCYXNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdHlwZUVsZW1lbnQuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMsIHNjaGVtYS54bWxucyk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGRlc2M7XHJcbiAgfVxyXG5cclxuICAvLyB0aGVuIHNpbXBsZSBlbGVtZW50XHJcbiAgbGV0IGJhc2UgPSB0aGlzLiRiYXNlID8gdGhpcy4kYmFzZSArIFwifFwiIDogXCJcIjtcclxuICByZXR1cm4gYmFzZSArIHRoaXMuY2hpbGRyZW4ubWFwKGZ1bmN0aW9uIChjaGlsZCkge1xyXG4gICAgcmV0dXJuIGNoaWxkLmRlc2NyaXB0aW9uKCk7XHJcbiAgfSkuam9pbihcIixcIik7XHJcbn07XHJcblxyXG5FeHRlbnNpb25FbGVtZW50LnByb3RvdHlwZS5kZXNjcmlwdGlvbiA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucywgeG1sbnMpIHtcclxuICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xyXG4gIGxldCBkZXNjID0ge307XHJcbiAgZm9yIChsZXQgaSA9IDAsIGNoaWxkOyBjaGlsZCA9IGNoaWxkcmVuW2ldOyBpKyspIHtcclxuICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIFNlcXVlbmNlRWxlbWVudCB8fFxyXG4gICAgICBjaGlsZCBpbnN0YW5jZW9mIENob2ljZUVsZW1lbnQpIHtcclxuICAgICAgZGVzYyA9IGNoaWxkLmRlc2NyaXB0aW9uKGRlZmluaXRpb25zLCB4bWxucyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmICh0aGlzLiRiYXNlKSB7XHJcbiAgICBsZXQgdHlwZSA9IHNwbGl0UU5hbWUodGhpcy4kYmFzZSksXHJcbiAgICAgIHR5cGVOYW1lID0gdHlwZS5uYW1lLFxyXG4gICAgICBucyA9IHhtbG5zICYmIHhtbG5zW3R5cGUucHJlZml4XSB8fCBkZWZpbml0aW9ucy54bWxuc1t0eXBlLnByZWZpeF0sXHJcbiAgICAgIHNjaGVtYSA9IGRlZmluaXRpb25zLnNjaGVtYXNbbnNdO1xyXG5cclxuICAgIGlmICh0eXBlTmFtZSBpbiBQcmltaXRpdmVzKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRiYXNlO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGxldCB0eXBlRWxlbWVudCA9IHNjaGVtYSAmJiAoc2NoZW1hLmNvbXBsZXhUeXBlc1t0eXBlTmFtZV0gfHxcclxuICAgICAgICBzY2hlbWEudHlwZXNbdHlwZU5hbWVdIHx8IHNjaGVtYS5lbGVtZW50c1t0eXBlTmFtZV0pO1xyXG5cclxuICAgICAgaWYgKHR5cGVFbGVtZW50KSB7XHJcbiAgICAgICAgbGV0IGJhc2UgPSB0eXBlRWxlbWVudC5kZXNjcmlwdGlvbihkZWZpbml0aW9ucywgc2NoZW1hLnhtbG5zKTtcclxuICAgICAgICBkZXNjID0gXy5kZWZhdWx0c0RlZXAoYmFzZSwgZGVzYyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGRlc2M7XHJcbn07XHJcblxyXG5FbnVtZXJhdGlvbkVsZW1lbnQucHJvdG90eXBlLmRlc2NyaXB0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiB0aGlzW3RoaXMudmFsdWVLZXldO1xyXG59O1xyXG5cclxuQ29tcGxleFR5cGVFbGVtZW50LnByb3RvdHlwZS5kZXNjcmlwdGlvbiA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucywgeG1sbnMpIHtcclxuICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuIHx8IFtdO1xyXG4gIGZvciAobGV0IGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBjaGlsZHJlbltpXTsgaSsrKSB7XHJcbiAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBDaG9pY2VFbGVtZW50IHx8XHJcbiAgICAgIGNoaWxkIGluc3RhbmNlb2YgU2VxdWVuY2VFbGVtZW50IHx8XHJcbiAgICAgIGNoaWxkIGluc3RhbmNlb2YgQWxsRWxlbWVudCB8fFxyXG4gICAgICBjaGlsZCBpbnN0YW5jZW9mIFNpbXBsZUNvbnRlbnRFbGVtZW50IHx8XHJcbiAgICAgIGNoaWxkIGluc3RhbmNlb2YgQ29tcGxleENvbnRlbnRFbGVtZW50KSB7XHJcblxyXG4gICAgICByZXR1cm4gY2hpbGQuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMsIHhtbG5zKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHt9O1xyXG59O1xyXG5cclxuQ29tcGxleENvbnRlbnRFbGVtZW50LnByb3RvdHlwZS5kZXNjcmlwdGlvbiA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucywgeG1sbnMpIHtcclxuICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xyXG4gIGZvciAobGV0IGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBjaGlsZHJlbltpXTsgaSsrKSB7XHJcbiAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBFeHRlbnNpb25FbGVtZW50KSB7XHJcbiAgICAgIHJldHVybiBjaGlsZC5kZXNjcmlwdGlvbihkZWZpbml0aW9ucywgeG1sbnMpO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4ge307XHJcbn07XHJcblxyXG5TaW1wbGVDb250ZW50RWxlbWVudC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoZGVmaW5pdGlvbnMsIHhtbG5zKSB7XHJcbiAgbGV0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcclxuICBmb3IgKGxldCBpID0gMCwgY2hpbGQ7IGNoaWxkID0gY2hpbGRyZW5baV07IGkrKykge1xyXG4gICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgRXh0ZW5zaW9uRWxlbWVudCkge1xyXG4gICAgICByZXR1cm4gY2hpbGQuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMsIHhtbG5zKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHt9O1xyXG59O1xyXG5cclxuRWxlbWVudEVsZW1lbnQucHJvdG90eXBlLmRlc2NyaXB0aW9uID0gZnVuY3Rpb24gKGRlZmluaXRpb25zLCB4bWxucykge1xyXG4gIGxldCBlbGVtZW50ID0ge30sXHJcbiAgICBuYW1lID0gdGhpcy4kbmFtZTtcclxuICBsZXQgaXNNYW55ID0gIXRoaXMuJG1heE9jY3VycyA/IGZhbHNlIDogKGlzTmFOKHRoaXMuJG1heE9jY3VycykgPyAodGhpcy4kbWF4T2NjdXJzID09PSAndW5ib3VuZGVkJykgOiAodGhpcy4kbWF4T2NjdXJzID4gMSkpO1xyXG4gIGlmICh0aGlzLiRtaW5PY2N1cnMgIT09IHRoaXMuJG1heE9jY3VycyAmJiBpc01hbnkpIHtcclxuICAgIG5hbWUgKz0gJ1tdJztcclxuICB9XHJcblxyXG4gIGlmICh4bWxucyAmJiB4bWxuc1tUTlNfUFJFRklYXSkge1xyXG4gICAgdGhpcy4kdGFyZ2V0TmFtZXNwYWNlID0geG1sbnNbVE5TX1BSRUZJWF07XHJcbiAgfVxyXG4gIGxldCB0eXBlID0gdGhpcy4kdHlwZSB8fCB0aGlzLiRyZWY7XHJcbiAgaWYgKHR5cGUpIHtcclxuICAgIHR5cGUgPSBzcGxpdFFOYW1lKHR5cGUpO1xyXG4gICAgbGV0IHR5cGVOYW1lID0gdHlwZS5uYW1lLFxyXG4gICAgICBucyA9IHhtbG5zICYmIHhtbG5zW3R5cGUucHJlZml4XSB8fCBkZWZpbml0aW9ucy54bWxuc1t0eXBlLnByZWZpeF0sXHJcbiAgICAgIHNjaGVtYSA9IGRlZmluaXRpb25zLnNjaGVtYXNbbnNdLFxyXG4gICAgICB0eXBlRWxlbWVudCA9IHNjaGVtYSAmJiAodGhpcy4kdHlwZSA/IHNjaGVtYS5jb21wbGV4VHlwZXNbdHlwZU5hbWVdIHx8IHNjaGVtYS50eXBlc1t0eXBlTmFtZV0gOiBzY2hlbWEuZWxlbWVudHNbdHlwZU5hbWVdKTtcclxuXHJcbiAgICBpZiAobnMgJiYgZGVmaW5pdGlvbnMuc2NoZW1hc1tuc10pIHtcclxuICAgICAgeG1sbnMgPSBkZWZpbml0aW9ucy5zY2hlbWFzW25zXS54bWxucztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZUVsZW1lbnQgJiYgISh0eXBlTmFtZSBpbiBQcmltaXRpdmVzKSkge1xyXG5cclxuICAgICAgaWYgKCEodHlwZU5hbWUgaW4gZGVmaW5pdGlvbnMuZGVzY3JpcHRpb25zLnR5cGVzKSkge1xyXG5cclxuICAgICAgICBsZXQgZWxlbTogYW55ID0ge307XHJcbiAgICAgICAgZGVmaW5pdGlvbnMuZGVzY3JpcHRpb25zLnR5cGVzW3R5cGVOYW1lXSA9IGVsZW07XHJcbiAgICAgICAgbGV0IGRlc2NyaXB0aW9uID0gdHlwZUVsZW1lbnQuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMsIHhtbG5zKTtcclxuICAgICAgICBpZiAodHlwZW9mIGRlc2NyaXB0aW9uID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgZWxlbSA9IGRlc2NyaXB0aW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIE9iamVjdC5rZXlzKGRlc2NyaXB0aW9uKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgZWxlbVtrZXldID0gZGVzY3JpcHRpb25ba2V5XTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuJHJlZikge1xyXG4gICAgICAgICAgZWxlbWVudCA9IGVsZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgZWxlbWVudFtuYW1lXSA9IGVsZW07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGVsZW0gPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICBlbGVtLnRhcmdldE5TQWxpYXMgPSB0eXBlLnByZWZpeDtcclxuICAgICAgICAgIGVsZW0udGFyZ2V0TmFtZXNwYWNlID0gbnM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkZWZpbml0aW9ucy5kZXNjcmlwdGlvbnMudHlwZXNbdHlwZU5hbWVdID0gZWxlbTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBpZiAodGhpcy4kcmVmKSB7XHJcbiAgICAgICAgICBlbGVtZW50ID0gZGVmaW5pdGlvbnMuZGVzY3JpcHRpb25zLnR5cGVzW3R5cGVOYW1lXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBlbGVtZW50W25hbWVdID0gZGVmaW5pdGlvbnMuZGVzY3JpcHRpb25zLnR5cGVzW3R5cGVOYW1lXTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgZWxlbWVudFtuYW1lXSA9IHRoaXMuJHR5cGU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgbGV0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcclxuICAgIGVsZW1lbnRbbmFtZV0gPSB7fTtcclxuICAgIGZvciAobGV0IGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBjaGlsZHJlbltpXTsgaSsrKSB7XHJcbiAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIENvbXBsZXhUeXBlRWxlbWVudCkge1xyXG4gICAgICAgIGVsZW1lbnRbbmFtZV0gPSBjaGlsZC5kZXNjcmlwdGlvbihkZWZpbml0aW9ucywgeG1sbnMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBlbGVtZW50O1xyXG59O1xyXG5cclxuQWxsRWxlbWVudC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPVxyXG4gIFNlcXVlbmNlRWxlbWVudC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoZGVmaW5pdGlvbnMsIHhtbG5zKSB7XHJcbiAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xyXG4gICAgbGV0IHNlcXVlbmNlID0ge307XHJcbiAgICBmb3IgKGxldCBpID0gMCwgY2hpbGQ7IGNoaWxkID0gY2hpbGRyZW5baV07IGkrKykge1xyXG4gICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBBbnlFbGVtZW50KSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IGRlc2NyaXB0aW9uID0gY2hpbGQuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMsIHhtbG5zKTtcclxuICAgICAgZm9yIChsZXQga2V5IGluIGRlc2NyaXB0aW9uKSB7XHJcbiAgICAgICAgc2VxdWVuY2Vba2V5XSA9IGRlc2NyaXB0aW9uW2tleV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBzZXF1ZW5jZTtcclxuICB9O1xyXG5cclxuQ2hvaWNlRWxlbWVudC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoZGVmaW5pdGlvbnMsIHhtbG5zKSB7XHJcbiAgbGV0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcclxuICBsZXQgY2hvaWNlID0ge307XHJcbiAgZm9yIChsZXQgaSA9IDAsIGNoaWxkOyBjaGlsZCA9IGNoaWxkcmVuW2ldOyBpKyspIHtcclxuICAgIGxldCBkZXNjcmlwdGlvbiA9IGNoaWxkLmRlc2NyaXB0aW9uKGRlZmluaXRpb25zLCB4bWxucyk7XHJcbiAgICBmb3IgKGxldCBrZXkgaW4gZGVzY3JpcHRpb24pIHtcclxuICAgICAgY2hvaWNlW2tleV0gPSBkZXNjcmlwdGlvbltrZXldO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gY2hvaWNlO1xyXG59O1xyXG5cclxuTWVzc2FnZUVsZW1lbnQucHJvdG90eXBlLmRlc2NyaXB0aW9uID0gZnVuY3Rpb24gKGRlZmluaXRpb25zKSB7XHJcbiAgaWYgKHRoaXMuZWxlbWVudCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudCAmJiB0aGlzLmVsZW1lbnQuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMpO1xyXG4gIH1cclxuICBsZXQgZGVzYyA9IHt9O1xyXG4gIGRlc2NbdGhpcy4kbmFtZV0gPSB0aGlzLnBhcnRzO1xyXG4gIHJldHVybiBkZXNjO1xyXG59O1xyXG5cclxuUG9ydFR5cGVFbGVtZW50LnByb3RvdHlwZS5kZXNjcmlwdGlvbiA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucykge1xyXG4gIGxldCBtZXRob2RzID0ge307XHJcbiAgZm9yIChsZXQgbmFtZSBpbiB0aGlzLm1ldGhvZHMpIHtcclxuICAgIGxldCBtZXRob2QgPSB0aGlzLm1ldGhvZHNbbmFtZV07XHJcbiAgICBtZXRob2RzW25hbWVdID0gbWV0aG9kLmRlc2NyaXB0aW9uKGRlZmluaXRpb25zKTtcclxuICB9XHJcbiAgcmV0dXJuIG1ldGhvZHM7XHJcbn07XHJcblxyXG5PcGVyYXRpb25FbGVtZW50LnByb3RvdHlwZS5kZXNjcmlwdGlvbiA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucykge1xyXG4gIGxldCBpbnB1dERlc2MgPSB0aGlzLmlucHV0ID8gdGhpcy5pbnB1dC5kZXNjcmlwdGlvbihkZWZpbml0aW9ucykgOiBudWxsO1xyXG4gIGxldCBvdXRwdXREZXNjID0gdGhpcy5vdXRwdXQgPyB0aGlzLm91dHB1dC5kZXNjcmlwdGlvbihkZWZpbml0aW9ucykgOiBudWxsO1xyXG4gIHJldHVybiB7XHJcbiAgICBpbnB1dDogaW5wdXREZXNjICYmIGlucHV0RGVzY1tPYmplY3Qua2V5cyhpbnB1dERlc2MpWzBdXSxcclxuICAgIG91dHB1dDogb3V0cHV0RGVzYyAmJiBvdXRwdXREZXNjW09iamVjdC5rZXlzKG91dHB1dERlc2MpWzBdXVxyXG4gIH07XHJcbn07XHJcblxyXG5CaW5kaW5nRWxlbWVudC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoZGVmaW5pdGlvbnMpIHtcclxuICBsZXQgbWV0aG9kcyA9IHt9O1xyXG4gIGZvciAobGV0IG5hbWUgaW4gdGhpcy5tZXRob2RzKSB7XHJcbiAgICBsZXQgbWV0aG9kID0gdGhpcy5tZXRob2RzW25hbWVdO1xyXG4gICAgbWV0aG9kc1tuYW1lXSA9IG1ldGhvZC5kZXNjcmlwdGlvbihkZWZpbml0aW9ucyk7XHJcbiAgfVxyXG4gIHJldHVybiBtZXRob2RzO1xyXG59O1xyXG5cclxuU2VydmljZUVsZW1lbnQucHJvdG90eXBlLmRlc2NyaXB0aW9uID0gZnVuY3Rpb24gKGRlZmluaXRpb25zKSB7XHJcbiAgbGV0IHBvcnRzID0ge307XHJcbiAgZm9yIChsZXQgbmFtZSBpbiB0aGlzLnBvcnRzKSB7XHJcbiAgICBsZXQgcG9ydCA9IHRoaXMucG9ydHNbbmFtZV07XHJcbiAgICBwb3J0c1tuYW1lXSA9IHBvcnQuYmluZGluZy5kZXNjcmlwdGlvbihkZWZpbml0aW9ucyk7XHJcbiAgfVxyXG4gIHJldHVybiBwb3J0cztcclxufTtcclxuXHJcbmV4cG9ydCBsZXQgV1NETCA9IGZ1bmN0aW9uIChkZWZpbml0aW9uLCB1cmksIG9wdGlvbnMpIHtcclxuICBsZXQgc2VsZiA9IHRoaXMsXHJcbiAgICBmcm9tRnVuYztcclxuXHJcbiAgdGhpcy51cmkgPSB1cmk7XHJcbiAgdGhpcy5jYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcclxuICB9O1xyXG4gIHRoaXMuX2luY2x1ZGVzV3NkbCA9IFtdO1xyXG5cclxuICAvLyBpbml0aWFsaXplIFdTREwgY2FjaGVcclxuICB0aGlzLldTRExfQ0FDSEUgPSAob3B0aW9ucyB8fCB7fSkuV1NETF9DQUNIRSB8fCB7fTtcclxuXHJcbiAgdGhpcy5faW5pdGlhbGl6ZU9wdGlvbnMob3B0aW9ucyk7XHJcblxyXG4gIGlmICh0eXBlb2YgZGVmaW5pdGlvbiA9PT0gJ3N0cmluZycpIHtcclxuICAgIGRlZmluaXRpb24gPSBzdHJpcEJvbShkZWZpbml0aW9uKTtcclxuICAgIGZyb21GdW5jID0gdGhpcy5fZnJvbVhNTDtcclxuICB9XHJcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluaXRpb24gPT09ICdvYmplY3QnKSB7XHJcbiAgICBmcm9tRnVuYyA9IHRoaXMuX2Zyb21TZXJ2aWNlcztcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1dTREwgbGV0cnVjdG9yIHRha2VzIGVpdGhlciBhbiBYTUwgc3RyaW5nIG9yIHNlcnZpY2UgZGVmaW5pdGlvbicpO1xyXG4gIH1cclxuXHJcbiAgUHJvbWlzZS5yZXNvbHZlKHRydWUpLnRoZW4oKCkgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgZnJvbUZ1bmMuY2FsbChzZWxmLCBkZWZpbml0aW9uKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soZS5tZXNzYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLnByb2Nlc3NJbmNsdWRlcygpLnRoZW4oKCkgPT4ge1xyXG4gICAgICBzZWxmLmRlZmluaXRpb25zLmRlbGV0ZUZpeGVkQXR0cnMoKTtcclxuICAgICAgbGV0IHNlcnZpY2VzID0gc2VsZi5zZXJ2aWNlcyA9IHNlbGYuZGVmaW5pdGlvbnMuc2VydmljZXM7XHJcbiAgICAgIGlmIChzZXJ2aWNlcykge1xyXG4gICAgICAgIGZvciAoY29uc3QgbmFtZSBpbiBzZXJ2aWNlcykge1xyXG4gICAgICAgICAgc2VydmljZXNbbmFtZV0ucG9zdFByb2Nlc3Moc2VsZi5kZWZpbml0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGxldCBjb21wbGV4VHlwZXMgPSBzZWxmLmRlZmluaXRpb25zLmNvbXBsZXhUeXBlcztcclxuICAgICAgaWYgKGNvbXBsZXhUeXBlcykge1xyXG4gICAgICAgIGZvciAoY29uc3QgbmFtZSBpbiBjb21wbGV4VHlwZXMpIHtcclxuICAgICAgICAgIGNvbXBsZXhUeXBlc1tuYW1lXS5kZWxldGVGaXhlZEF0dHJzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBmb3IgZG9jdW1lbnQgc3R5bGUsIGZvciBldmVyeSBiaW5kaW5nLCBwcmVwYXJlIGlucHV0IG1lc3NhZ2UgZWxlbWVudCBuYW1lIHRvIChtZXRob2ROYW1lLCBvdXRwdXQgbWVzc2FnZSBlbGVtZW50IG5hbWUpIG1hcHBpbmdcclxuICAgICAgbGV0IGJpbmRpbmdzID0gc2VsZi5kZWZpbml0aW9ucy5iaW5kaW5ncztcclxuICAgICAgZm9yIChsZXQgYmluZGluZ05hbWUgaW4gYmluZGluZ3MpIHtcclxuICAgICAgICBsZXQgYmluZGluZyA9IGJpbmRpbmdzW2JpbmRpbmdOYW1lXTtcclxuICAgICAgICBpZiAodHlwZW9mIGJpbmRpbmcuc3R5bGUgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICBiaW5kaW5nLnN0eWxlID0gJ2RvY3VtZW50JztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGJpbmRpbmcuc3R5bGUgIT09ICdkb2N1bWVudCcpXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICBsZXQgbWV0aG9kcyA9IGJpbmRpbmcubWV0aG9kcztcclxuICAgICAgICBsZXQgdG9wRWxzID0gYmluZGluZy50b3BFbGVtZW50cyA9IHt9O1xyXG4gICAgICAgIGZvciAobGV0IG1ldGhvZE5hbWUgaW4gbWV0aG9kcykge1xyXG4gICAgICAgICAgaWYgKG1ldGhvZHNbbWV0aG9kTmFtZV0uaW5wdXQpIHtcclxuICAgICAgICAgICAgbGV0IGlucHV0TmFtZSA9IG1ldGhvZHNbbWV0aG9kTmFtZV0uaW5wdXQuJG5hbWU7XHJcbiAgICAgICAgICAgIGxldCBvdXRwdXROYW1lID0gXCJcIjtcclxuICAgICAgICAgICAgaWYgKG1ldGhvZHNbbWV0aG9kTmFtZV0ub3V0cHV0KVxyXG4gICAgICAgICAgICAgIG91dHB1dE5hbWUgPSBtZXRob2RzW21ldGhvZE5hbWVdLm91dHB1dC4kbmFtZTtcclxuICAgICAgICAgICAgdG9wRWxzW2lucHV0TmFtZV0gPSB7IFwibWV0aG9kTmFtZVwiOiBtZXRob2ROYW1lLCBcIm91dHB1dE5hbWVcIjogb3V0cHV0TmFtZSB9O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gcHJlcGFyZSBzb2FwIGVudmVsb3BlIHhtbG5zIGRlZmluaXRpb24gc3RyaW5nXHJcbiAgICAgIHNlbGYueG1sbnNJbkVudmVsb3BlID0gc2VsZi5feG1sbnNNYXAoKTtcclxuICAgICAgc2VsZi5jYWxsYmFjayhudWxsLCBzZWxmKTtcclxuICAgIH0pLmNhdGNoKGVyciA9PiBzZWxmLmNhbGxiYWNrKGVycikpO1xyXG5cclxuICB9KTtcclxuXHJcbiAgLy8gcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpIHtcclxuICAvLyAgIHRyeSB7XHJcbiAgLy8gICAgIGZyb21GdW5jLmNhbGwoc2VsZiwgZGVmaW5pdGlvbik7XHJcbiAgLy8gICB9IGNhdGNoIChlKSB7XHJcbiAgLy8gICAgIHJldHVybiBzZWxmLmNhbGxiYWNrKGUubWVzc2FnZSk7XHJcbiAgLy8gICB9XHJcblxyXG4gIC8vICAgc2VsZi5wcm9jZXNzSW5jbHVkZXMoZnVuY3Rpb24oZXJyKSB7XHJcbiAgLy8gICAgIGxldCBuYW1lO1xyXG4gIC8vICAgICBpZiAoZXJyKSB7XHJcbiAgLy8gICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soZXJyKTtcclxuICAvLyAgICAgfVxyXG5cclxuICAvLyAgICAgc2VsZi5kZWZpbml0aW9ucy5kZWxldGVGaXhlZEF0dHJzKCk7XHJcbiAgLy8gICAgIGxldCBzZXJ2aWNlcyA9IHNlbGYuc2VydmljZXMgPSBzZWxmLmRlZmluaXRpb25zLnNlcnZpY2VzO1xyXG4gIC8vICAgICBpZiAoc2VydmljZXMpIHtcclxuICAvLyAgICAgICBmb3IgKG5hbWUgaW4gc2VydmljZXMpIHtcclxuICAvLyAgICAgICAgIHNlcnZpY2VzW25hbWVdLnBvc3RQcm9jZXNzKHNlbGYuZGVmaW5pdGlvbnMpO1xyXG4gIC8vICAgICAgIH1cclxuICAvLyAgICAgfVxyXG4gIC8vICAgICBsZXQgY29tcGxleFR5cGVzID0gc2VsZi5kZWZpbml0aW9ucy5jb21wbGV4VHlwZXM7XHJcbiAgLy8gICAgIGlmIChjb21wbGV4VHlwZXMpIHtcclxuICAvLyAgICAgICBmb3IgKG5hbWUgaW4gY29tcGxleFR5cGVzKSB7XHJcbiAgLy8gICAgICAgICBjb21wbGV4VHlwZXNbbmFtZV0uZGVsZXRlRml4ZWRBdHRycygpO1xyXG4gIC8vICAgICAgIH1cclxuICAvLyAgICAgfVxyXG5cclxuICAvLyAgICAgLy8gZm9yIGRvY3VtZW50IHN0eWxlLCBmb3IgZXZlcnkgYmluZGluZywgcHJlcGFyZSBpbnB1dCBtZXNzYWdlIGVsZW1lbnQgbmFtZSB0byAobWV0aG9kTmFtZSwgb3V0cHV0IG1lc3NhZ2UgZWxlbWVudCBuYW1lKSBtYXBwaW5nXHJcbiAgLy8gICAgIGxldCBiaW5kaW5ncyA9IHNlbGYuZGVmaW5pdGlvbnMuYmluZGluZ3M7XHJcbiAgLy8gICAgIGZvciAobGV0IGJpbmRpbmdOYW1lIGluIGJpbmRpbmdzKSB7XHJcbiAgLy8gICAgICAgbGV0IGJpbmRpbmcgPSBiaW5kaW5nc1tiaW5kaW5nTmFtZV07XHJcbiAgLy8gICAgICAgaWYgKHR5cGVvZiBiaW5kaW5nLnN0eWxlID09PSAndW5kZWZpbmVkJykge1xyXG4gIC8vICAgICAgICAgYmluZGluZy5zdHlsZSA9ICdkb2N1bWVudCc7XHJcbiAgLy8gICAgICAgfVxyXG4gIC8vICAgICAgIGlmIChiaW5kaW5nLnN0eWxlICE9PSAnZG9jdW1lbnQnKVxyXG4gIC8vICAgICAgICAgY29udGludWU7XHJcbiAgLy8gICAgICAgbGV0IG1ldGhvZHMgPSBiaW5kaW5nLm1ldGhvZHM7XHJcbiAgLy8gICAgICAgbGV0IHRvcEVscyA9IGJpbmRpbmcudG9wRWxlbWVudHMgPSB7fTtcclxuICAvLyAgICAgICBmb3IgKGxldCBtZXRob2ROYW1lIGluIG1ldGhvZHMpIHtcclxuICAvLyAgICAgICAgIGlmIChtZXRob2RzW21ldGhvZE5hbWVdLmlucHV0KSB7XHJcbiAgLy8gICAgICAgICAgIGxldCBpbnB1dE5hbWUgPSBtZXRob2RzW21ldGhvZE5hbWVdLmlucHV0LiRuYW1lO1xyXG4gIC8vICAgICAgICAgICBsZXQgb3V0cHV0TmFtZT1cIlwiO1xyXG4gIC8vICAgICAgICAgICBpZihtZXRob2RzW21ldGhvZE5hbWVdLm91dHB1dCApXHJcbiAgLy8gICAgICAgICAgICAgb3V0cHV0TmFtZSA9IG1ldGhvZHNbbWV0aG9kTmFtZV0ub3V0cHV0LiRuYW1lO1xyXG4gIC8vICAgICAgICAgICB0b3BFbHNbaW5wdXROYW1lXSA9IHtcIm1ldGhvZE5hbWVcIjogbWV0aG9kTmFtZSwgXCJvdXRwdXROYW1lXCI6IG91dHB1dE5hbWV9O1xyXG4gIC8vICAgICAgICAgfVxyXG4gIC8vICAgICAgIH1cclxuICAvLyAgICAgfVxyXG5cclxuICAvLyAgICAgLy8gcHJlcGFyZSBzb2FwIGVudmVsb3BlIHhtbG5zIGRlZmluaXRpb24gc3RyaW5nXHJcbiAgLy8gICAgIHNlbGYueG1sbnNJbkVudmVsb3BlID0gc2VsZi5feG1sbnNNYXAoKTtcclxuXHJcbiAgLy8gICAgIHNlbGYuY2FsbGJhY2soZXJyLCBzZWxmKTtcclxuICAvLyAgIH0pO1xyXG5cclxuICAvLyB9KTtcclxufTtcclxuXHJcbldTREwucHJvdG90eXBlLmlnbm9yZWROYW1lc3BhY2VzID0gWyd0bnMnLCAndGFyZ2V0TmFtZXNwYWNlJywgJ3R5cGVkTmFtZXNwYWNlJ107XHJcblxyXG5XU0RMLnByb3RvdHlwZS5pZ25vcmVCYXNlTmFtZVNwYWNlcyA9IGZhbHNlO1xyXG5cclxuV1NETC5wcm90b3R5cGUudmFsdWVLZXkgPSAnJHZhbHVlJztcclxuV1NETC5wcm90b3R5cGUueG1sS2V5ID0gJyR4bWwnO1xyXG5cclxuV1NETC5wcm90b3R5cGUuX2luaXRpYWxpemVPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICB0aGlzLl9vcmlnaW5hbElnbm9yZWROYW1lc3BhY2VzID0gKG9wdGlvbnMgfHwge30pLmlnbm9yZWROYW1lc3BhY2VzO1xyXG4gIHRoaXMub3B0aW9ucyA9IHt9O1xyXG5cclxuICBsZXQgaWdub3JlZE5hbWVzcGFjZXMgPSBvcHRpb25zID8gb3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcyA6IG51bGw7XHJcblxyXG4gIGlmIChpZ25vcmVkTmFtZXNwYWNlcyAmJlxyXG4gICAgKEFycmF5LmlzQXJyYXkoaWdub3JlZE5hbWVzcGFjZXMubmFtZXNwYWNlcykgfHwgdHlwZW9mIGlnbm9yZWROYW1lc3BhY2VzLm5hbWVzcGFjZXMgPT09ICdzdHJpbmcnKSkge1xyXG4gICAgaWYgKGlnbm9yZWROYW1lc3BhY2VzLm92ZXJyaWRlKSB7XHJcbiAgICAgIHRoaXMub3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcyA9IGlnbm9yZWROYW1lc3BhY2VzLm5hbWVzcGFjZXM7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLm9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMgPSB0aGlzLmlnbm9yZWROYW1lc3BhY2VzLmNvbmNhdChpZ25vcmVkTmFtZXNwYWNlcy5uYW1lc3BhY2VzKTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5vcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzID0gdGhpcy5pZ25vcmVkTmFtZXNwYWNlcztcclxuICB9XHJcblxyXG4gIHRoaXMub3B0aW9ucy52YWx1ZUtleSA9IG9wdGlvbnMudmFsdWVLZXkgfHwgdGhpcy52YWx1ZUtleTtcclxuICB0aGlzLm9wdGlvbnMueG1sS2V5ID0gb3B0aW9ucy54bWxLZXkgfHwgdGhpcy54bWxLZXk7XHJcbiAgaWYgKG9wdGlvbnMuZXNjYXBlWE1MICE9PSB1bmRlZmluZWQpIHtcclxuICAgIHRoaXMub3B0aW9ucy5lc2NhcGVYTUwgPSBvcHRpb25zLmVzY2FwZVhNTDtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5vcHRpb25zLmVzY2FwZVhNTCA9IHRydWU7XHJcbiAgfVxyXG4gIGlmIChvcHRpb25zLnJldHVybkZhdWx0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgIHRoaXMub3B0aW9ucy5yZXR1cm5GYXVsdCA9IG9wdGlvbnMucmV0dXJuRmF1bHQ7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRoaXMub3B0aW9ucy5yZXR1cm5GYXVsdCA9IGZhbHNlO1xyXG4gIH1cclxuICB0aGlzLm9wdGlvbnMuaGFuZGxlTmlsQXNOdWxsID0gISFvcHRpb25zLmhhbmRsZU5pbEFzTnVsbDtcclxuXHJcbiAgaWYgKG9wdGlvbnMubmFtZXNwYWNlQXJyYXlFbGVtZW50cyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICB0aGlzLm9wdGlvbnMubmFtZXNwYWNlQXJyYXlFbGVtZW50cyA9IG9wdGlvbnMubmFtZXNwYWNlQXJyYXlFbGVtZW50cztcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5vcHRpb25zLm5hbWVzcGFjZUFycmF5RWxlbWVudHMgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLy8gQWxsb3cgYW55IHJlcXVlc3QgaGVhZGVycyB0byBrZWVwIHBhc3NpbmcgdGhyb3VnaFxyXG4gIHRoaXMub3B0aW9ucy53c2RsX2hlYWRlcnMgPSBvcHRpb25zLndzZGxfaGVhZGVycztcclxuICB0aGlzLm9wdGlvbnMud3NkbF9vcHRpb25zID0gb3B0aW9ucy53c2RsX29wdGlvbnM7XHJcbiAgaWYgKG9wdGlvbnMuaHR0cENsaWVudCkge1xyXG4gICAgdGhpcy5vcHRpb25zLmh0dHBDbGllbnQgPSBvcHRpb25zLmh0dHBDbGllbnQ7XHJcbiAgfVxyXG5cclxuICAvLyBUaGUgc3VwcGxpZWQgcmVxdWVzdC1vYmplY3Qgc2hvdWxkIGJlIHBhc3NlZCB0aHJvdWdoXHJcbiAgaWYgKG9wdGlvbnMucmVxdWVzdCkge1xyXG4gICAgdGhpcy5vcHRpb25zLnJlcXVlc3QgPSBvcHRpb25zLnJlcXVlc3Q7XHJcbiAgfVxyXG5cclxuICBsZXQgaWdub3JlQmFzZU5hbWVTcGFjZXMgPSBvcHRpb25zID8gb3B0aW9ucy5pZ25vcmVCYXNlTmFtZVNwYWNlcyA6IG51bGw7XHJcbiAgaWYgKGlnbm9yZUJhc2VOYW1lU3BhY2VzICE9PSBudWxsICYmIHR5cGVvZiBpZ25vcmVCYXNlTmFtZVNwYWNlcyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIHRoaXMub3B0aW9ucy5pZ25vcmVCYXNlTmFtZVNwYWNlcyA9IGlnbm9yZUJhc2VOYW1lU3BhY2VzO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLm9wdGlvbnMuaWdub3JlQmFzZU5hbWVTcGFjZXMgPSB0aGlzLmlnbm9yZUJhc2VOYW1lU3BhY2VzO1xyXG4gIH1cclxuXHJcbiAgLy8gV29ya3Mgb25seSBpbiBjbGllbnRcclxuICB0aGlzLm9wdGlvbnMuZm9yY2VTb2FwMTJIZWFkZXJzID0gb3B0aW9ucy5mb3JjZVNvYXAxMkhlYWRlcnM7XHJcbiAgdGhpcy5vcHRpb25zLmN1c3RvbURlc2VyaWFsaXplciA9IG9wdGlvbnMuY3VzdG9tRGVzZXJpYWxpemVyO1xyXG5cclxuICBpZiAob3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50ICE9PSB1bmRlZmluZWQpIHtcclxuICAgIHRoaXMub3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50ID0gb3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgdGhpcy5vcHRpb25zLnVzZUVtcHR5VGFnID0gISFvcHRpb25zLnVzZUVtcHR5VGFnO1xyXG59O1xyXG5cclxuV1NETC5wcm90b3R5cGUub25SZWFkeSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gIGlmIChjYWxsYmFjaylcclxuICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcclxufTtcclxuXHJcbldTREwucHJvdG90eXBlLl9wcm9jZXNzTmV4dEluY2x1ZGUgPSBhc3luYyBmdW5jdGlvbiAoaW5jbHVkZXMpIHtcclxuICBsZXQgc2VsZiA9IHRoaXMsXHJcbiAgICBpbmNsdWRlID0gaW5jbHVkZXMuc2hpZnQoKSxcclxuICAgIG9wdGlvbnM7XHJcblxyXG4gIGlmICghaW5jbHVkZSlcclxuICAgIHJldHVybjsgLy8gY2FsbGJhY2soKTtcclxuXHJcbiAgbGV0IGluY2x1ZGVQYXRoO1xyXG4gIGlmICghL15odHRwcz86Ly50ZXN0KHNlbGYudXJpKSAmJiAhL15odHRwcz86Ly50ZXN0KGluY2x1ZGUubG9jYXRpb24pKSB7XHJcbiAgICAvLyBpbmNsdWRlUGF0aCA9IHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUoc2VsZi51cmkpLCBpbmNsdWRlLmxvY2F0aW9uKTtcclxuICB9IGVsc2Uge1xyXG4gICAgaW5jbHVkZVBhdGggPSB1cmwucmVzb2x2ZShzZWxmLnVyaSB8fCAnJywgaW5jbHVkZS5sb2NhdGlvbik7XHJcbiAgfVxyXG5cclxuICBvcHRpb25zID0gXy5hc3NpZ24oe30sIHRoaXMub3B0aW9ucyk7XHJcbiAgLy8gZm9sbG93IHN1cHBsaWVkIGlnbm9yZWROYW1lc3BhY2VzIG9wdGlvblxyXG4gIG9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMgPSB0aGlzLl9vcmlnaW5hbElnbm9yZWROYW1lc3BhY2VzIHx8IHRoaXMub3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcztcclxuICBvcHRpb25zLldTRExfQ0FDSEUgPSB0aGlzLldTRExfQ0FDSEU7XHJcblxyXG4gIGNvbnN0IHdzZGwgPSBhd2FpdCBvcGVuX3dzZGxfcmVjdXJzaXZlKGluY2x1ZGVQYXRoLCBvcHRpb25zKVxyXG4gIHNlbGYuX2luY2x1ZGVzV3NkbC5wdXNoKHdzZGwpO1xyXG5cclxuICBpZiAod3NkbC5kZWZpbml0aW9ucyBpbnN0YW5jZW9mIERlZmluaXRpb25zRWxlbWVudCkge1xyXG4gICAgXy5tZXJnZVdpdGgoc2VsZi5kZWZpbml0aW9ucywgd3NkbC5kZWZpbml0aW9ucywgZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgcmV0dXJuIChhIGluc3RhbmNlb2YgU2NoZW1hRWxlbWVudCkgPyBhLm1lcmdlKGIpIDogdW5kZWZpbmVkO1xyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHNlbGYuZGVmaW5pdGlvbnMuc2NoZW1hc1tpbmNsdWRlLm5hbWVzcGFjZSB8fCB3c2RsLmRlZmluaXRpb25zLiR0YXJnZXROYW1lc3BhY2VdID0gZGVlcE1lcmdlKHNlbGYuZGVmaW5pdGlvbnMuc2NoZW1hc1tpbmNsdWRlLm5hbWVzcGFjZSB8fCB3c2RsLmRlZmluaXRpb25zLiR0YXJnZXROYW1lc3BhY2VdLCB3c2RsLmRlZmluaXRpb25zKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBzZWxmLl9wcm9jZXNzTmV4dEluY2x1ZGUoaW5jbHVkZXMpO1xyXG5cclxuICAvLyBvcGVuX3dzZGxfcmVjdXJzaXZlKGluY2x1ZGVQYXRoLCBvcHRpb25zLCBmdW5jdGlvbihlcnIsIHdzZGwpIHtcclxuICAvLyAgIGlmIChlcnIpIHtcclxuICAvLyAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XHJcbiAgLy8gICB9XHJcblxyXG4gIC8vICAgc2VsZi5faW5jbHVkZXNXc2RsLnB1c2god3NkbCk7XHJcblxyXG4gIC8vICAgaWYgKHdzZGwuZGVmaW5pdGlvbnMgaW5zdGFuY2VvZiBEZWZpbml0aW9uc0VsZW1lbnQpIHtcclxuICAvLyAgICAgXy5tZXJnZVdpdGgoc2VsZi5kZWZpbml0aW9ucywgd3NkbC5kZWZpbml0aW9ucywgZnVuY3Rpb24oYSxiKSB7XHJcbiAgLy8gICAgICAgcmV0dXJuIChhIGluc3RhbmNlb2YgU2NoZW1hRWxlbWVudCkgPyBhLm1lcmdlKGIpIDogdW5kZWZpbmVkO1xyXG4gIC8vICAgICB9KTtcclxuICAvLyAgIH0gZWxzZSB7XHJcbiAgLy8gICAgIHNlbGYuZGVmaW5pdGlvbnMuc2NoZW1hc1tpbmNsdWRlLm5hbWVzcGFjZSB8fCB3c2RsLmRlZmluaXRpb25zLiR0YXJnZXROYW1lc3BhY2VdID0gZGVlcE1lcmdlKHNlbGYuZGVmaW5pdGlvbnMuc2NoZW1hc1tpbmNsdWRlLm5hbWVzcGFjZSB8fCB3c2RsLmRlZmluaXRpb25zLiR0YXJnZXROYW1lc3BhY2VdLCB3c2RsLmRlZmluaXRpb25zKTtcclxuICAvLyAgIH1cclxuICAvLyAgIHNlbGYuX3Byb2Nlc3NOZXh0SW5jbHVkZShpbmNsdWRlcywgZnVuY3Rpb24oZXJyKSB7XHJcbiAgLy8gICAgIGNhbGxiYWNrKGVycik7XHJcbiAgLy8gICB9KTtcclxuICAvLyB9KTtcclxufTtcclxuXHJcbldTREwucHJvdG90eXBlLnByb2Nlc3NJbmNsdWRlcyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICBsZXQgc2NoZW1hcyA9IHRoaXMuZGVmaW5pdGlvbnMuc2NoZW1hcyxcclxuICAgIGluY2x1ZGVzID0gW107XHJcblxyXG4gIGZvciAobGV0IG5zIGluIHNjaGVtYXMpIHtcclxuICAgIGxldCBzY2hlbWEgPSBzY2hlbWFzW25zXTtcclxuICAgIGluY2x1ZGVzID0gaW5jbHVkZXMuY29uY2F0KHNjaGVtYS5pbmNsdWRlcyB8fCBbXSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcy5fcHJvY2Vzc05leHRJbmNsdWRlKGluY2x1ZGVzKTtcclxufTtcclxuXHJcbldTREwucHJvdG90eXBlLmRlc2NyaWJlU2VydmljZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IHNlcnZpY2VzID0ge307XHJcbiAgZm9yIChsZXQgbmFtZSBpbiB0aGlzLnNlcnZpY2VzKSB7XHJcbiAgICBsZXQgc2VydmljZSA9IHRoaXMuc2VydmljZXNbbmFtZV07XHJcbiAgICBzZXJ2aWNlc1tuYW1lXSA9IHNlcnZpY2UuZGVzY3JpcHRpb24odGhpcy5kZWZpbml0aW9ucyk7XHJcbiAgfVxyXG4gIHJldHVybiBzZXJ2aWNlcztcclxufTtcclxuXHJcbldTREwucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiB0aGlzLnhtbCB8fCAnJztcclxufTtcclxuXHJcbldTREwucHJvdG90eXBlLnhtbFRvT2JqZWN0ID0gZnVuY3Rpb24gKHhtbCwgY2FsbGJhY2spIHtcclxuICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgbGV0IHAgPSB0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicgPyB7fSA6IHNheC5wYXJzZXIodHJ1ZSk7XHJcbiAgbGV0IG9iamVjdE5hbWUgPSBudWxsO1xyXG4gIGxldCByb290OiBhbnkgPSB7fTtcclxuICBsZXQgc2NoZW1hID0ge307XHJcbiAgLypsZXQgc2NoZW1hID0ge1xyXG4gICAgRW52ZWxvcGU6IHtcclxuICAgICAgSGVhZGVyOiB7XHJcbiAgICAgICAgU2VjdXJpdHk6IHtcclxuICAgICAgICAgIFVzZXJuYW1lVG9rZW46IHtcclxuICAgICAgICAgICAgVXNlcm5hbWU6ICdzdHJpbmcnLFxyXG4gICAgICAgICAgICBQYXNzd29yZDogJ3N0cmluZydcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIEJvZHk6IHtcclxuICAgICAgICBGYXVsdDoge1xyXG4gICAgICAgICAgZmF1bHRjb2RlOiAnc3RyaW5nJyxcclxuICAgICAgICAgIGZhdWx0c3RyaW5nOiAnc3RyaW5nJyxcclxuICAgICAgICAgIGRldGFpbDogJ3N0cmluZydcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9OyovXHJcbiAgaWYoIXRoaXMub3B0aW9ucy5mb3JjZVNvYXAxMkhlYWRlcnMpe1xyXG4gICAgc2NoZW1hID17XHJcbiAgICAgIEVudmVsb3BlOiB7XHJcbiAgICAgICAgSGVhZGVyOiB7XHJcbiAgICAgICAgICBTZWN1cml0eToge1xyXG4gICAgICAgICAgICBVc2VybmFtZVRva2VuOiB7XHJcbiAgICAgICAgICAgICAgVXNlcm5hbWU6J3N0cmluZycsXHJcbiAgICAgICAgICAgICAgUGFzc3dvcmQ6J3N0cmluZydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgQm9keTp7XHJcbiAgICAgICAgICBGYXVsdDoge1xyXG4gICAgICAgICAgICBmYXVsdGNvZGU6ICdzdHJpbmcnLFxyXG4gICAgICAgICAgICBmYXVsdHN0cmluZzogJ3N0cmluZycsXHJcbiAgICAgICAgICAgIGRldGFpbDonc3RyaW5nJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBzY2hlbWEgPSB7XHJcbiAgICAgIEVudmVsb3BlOiB7XHJcbiAgICAgICAgSGVhZGVyOiB7XHJcbiAgICAgICAgICBTZWN1cml0eToge1xyXG4gICAgICAgICAgICBVc2VybmFtZVRva2VuOiB7XHJcbiAgICAgICAgICAgICAgVXNlcm5hbWU6ICdzdHJpbmcnLFxyXG4gICAgICAgICAgICAgIFBhc3N3b3JkOiAnc3RyaW5nJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBCb2R5OiB7XHJcbiAgICAgICAgICBDb2RlOiB7XHJcbiAgICAgICAgICAgIFZhbHVlOiAnc3RyaW5nJyxcclxuICAgICAgICAgICAgU3ViY29kZTpcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgVmFsdWU6ICdzdHJpbmcnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgUmVhc29uOiB7VGV4dDogJ3N0cmluZyd9LFxyXG4gICAgICAgICAgc3RhdHVzQ29kZTogJ251bWJlcicsXHJcbiAgICAgICAgICBEZXRhaWw6ICdvYmplY3QnXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuICB9XHJcbiAgICAgIGxldCBzdGFjazogYW55W10gPSBbeyBuYW1lOiBudWxsLCBvYmplY3Q6IHJvb3QsIHNjaGVtYTogc2NoZW1hIH1dO1xyXG4gIGxldCB4bWxuczogYW55ID0ge307XHJcblxyXG4gIGxldCByZWZzID0ge30sIGlkOyAvLyB7aWQ6e2hyZWZzOltdLG9iajp9LCAuLi59XHJcblxyXG4gIHAub25vcGVudGFnID0gZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgIGxldCBuc05hbWUgPSBub2RlLm5hbWU7XHJcbiAgICBsZXQgYXR0cnM6IGFueSA9IG5vZGUuYXR0cmlidXRlcztcclxuICAgIGxldCBuYW1lID0gc3BsaXRRTmFtZShuc05hbWUpLm5hbWUsXHJcbiAgICAgIGF0dHJpYnV0ZU5hbWUsXHJcbiAgICAgIHRvcCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdLFxyXG4gICAgICB0b3BTY2hlbWEgPSB0b3Auc2NoZW1hLFxyXG4gICAgICBlbGVtZW50QXR0cmlidXRlcyA9IHt9LFxyXG4gICAgICBoYXNOb25YbWxuc0F0dHJpYnV0ZSA9IGZhbHNlLFxyXG4gICAgICBoYXNOaWxBdHRyaWJ1dGUgPSBmYWxzZSxcclxuICAgICAgb2JqID0ge307XHJcbiAgICBsZXQgb3JpZ2luYWxOYW1lID0gbmFtZTtcclxuXHJcbiAgICBpZiAoIW9iamVjdE5hbWUgJiYgdG9wLm5hbWUgPT09ICdCb2R5JyAmJiBuYW1lICE9PSAnRmF1bHQnKSB7XHJcbiAgICAgIGxldCBtZXNzYWdlID0gc2VsZi5kZWZpbml0aW9ucy5tZXNzYWdlc1tuYW1lXTtcclxuICAgICAgLy8gU3VwcG9ydCBSUEMvbGl0ZXJhbCBtZXNzYWdlcyB3aGVyZSByZXNwb25zZSBib2R5IGNvbnRhaW5zIG9uZSBlbGVtZW50IG5hbWVkXHJcbiAgICAgIC8vIGFmdGVyIHRoZSBvcGVyYXRpb24gKyAnUmVzcG9uc2UnLiBTZWUgaHR0cDovL3d3dy53My5vcmcvVFIvd3NkbCNfbmFtZXNcclxuICAgICAgaWYgKCFtZXNzYWdlKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIC8vIERldGVybWluZSBpZiB0aGlzIGlzIHJlcXVlc3Qgb3IgcmVzcG9uc2VcclxuICAgICAgICAgIGxldCBpc0lucHV0ID0gZmFsc2U7XHJcbiAgICAgICAgICBsZXQgaXNPdXRwdXQgPSBmYWxzZTtcclxuICAgICAgICAgIGlmICgoL1Jlc3BvbnNlJC8pLnRlc3QobmFtZSkpIHtcclxuICAgICAgICAgICAgaXNPdXRwdXQgPSB0cnVlO1xyXG4gICAgICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9SZXNwb25zZSQvLCAnJyk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKCgvUmVxdWVzdCQvKS50ZXN0KG5hbWUpKSB7XHJcbiAgICAgICAgICAgIGlzSW5wdXQgPSB0cnVlO1xyXG4gICAgICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9SZXF1ZXN0JC8sICcnKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoKC9Tb2xpY2l0JC8pLnRlc3QobmFtZSkpIHtcclxuICAgICAgICAgICAgaXNJbnB1dCA9IHRydWU7XHJcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1NvbGljaXQkLywgJycpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gTG9vayB1cCB0aGUgYXBwcm9wcmlhdGUgbWVzc2FnZSBhcyBnaXZlbiBpbiB0aGUgcG9ydFR5cGUncyBvcGVyYXRpb25zXHJcbiAgICAgICAgICBsZXQgcG9ydFR5cGVzID0gc2VsZi5kZWZpbml0aW9ucy5wb3J0VHlwZXM7XHJcbiAgICAgICAgICBsZXQgcG9ydFR5cGVOYW1lcyA9IE9iamVjdC5rZXlzKHBvcnRUeXBlcyk7XHJcbiAgICAgICAgICAvLyBDdXJyZW50bHkgdGhpcyBzdXBwb3J0cyBvbmx5IG9uZSBwb3J0VHlwZSBkZWZpbml0aW9uLlxyXG4gICAgICAgICAgbGV0IHBvcnRUeXBlID0gcG9ydFR5cGVzW3BvcnRUeXBlTmFtZXNbMF1dO1xyXG4gICAgICAgICAgaWYgKGlzSW5wdXQpIHtcclxuICAgICAgICAgICAgbmFtZSA9IHBvcnRUeXBlLm1ldGhvZHNbbmFtZV0uaW5wdXQuJG5hbWU7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBuYW1lID0gcG9ydFR5cGUubWV0aG9kc1tuYW1lXS5vdXRwdXQuJG5hbWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBtZXNzYWdlID0gc2VsZi5kZWZpbml0aW9ucy5tZXNzYWdlc1tuYW1lXTtcclxuICAgICAgICAgIC8vICdjYWNoZScgdGhpcyBhbGlhcyB0byBzcGVlZCBmdXR1cmUgbG9va3Vwc1xyXG4gICAgICAgICAgc2VsZi5kZWZpbml0aW9ucy5tZXNzYWdlc1tvcmlnaW5hbE5hbWVdID0gc2VsZi5kZWZpbml0aW9ucy5tZXNzYWdlc1tuYW1lXTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnJldHVybkZhdWx0KSB7XHJcbiAgICAgICAgICAgIHAub25lcnJvcihlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRvcFNjaGVtYSA9IG1lc3NhZ2UuZGVzY3JpcHRpb24oc2VsZi5kZWZpbml0aW9ucyk7XHJcbiAgICAgIG9iamVjdE5hbWUgPSBvcmlnaW5hbE5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGF0dHJzLmhyZWYpIHtcclxuICAgICAgaWQgPSBhdHRycy5ocmVmLnN1YnN0cigxKTtcclxuICAgICAgaWYgKCFyZWZzW2lkXSkge1xyXG4gICAgICAgIHJlZnNbaWRdID0geyBocmVmczogW10sIG9iajogbnVsbCB9O1xyXG4gICAgICB9XHJcbiAgICAgIHJlZnNbaWRdLmhyZWZzLnB1c2goeyBwYXI6IHRvcC5vYmplY3QsIGtleTogbmFtZSwgb2JqOiBvYmogfSk7XHJcbiAgICB9XHJcbiAgICBpZiAoaWQgPSBhdHRycy5pZCkge1xyXG4gICAgICBpZiAoIXJlZnNbaWRdKSB7XHJcbiAgICAgICAgcmVmc1tpZF0gPSB7IGhyZWZzOiBbXSwgb2JqOiBudWxsIH07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL0hhbmRsZSBlbGVtZW50IGF0dHJpYnV0ZXNcclxuICAgIGZvciAoYXR0cmlidXRlTmFtZSBpbiBhdHRycykge1xyXG4gICAgICBpZiAoL154bWxuczp8XnhtbG5zJC8udGVzdChhdHRyaWJ1dGVOYW1lKSkge1xyXG4gICAgICAgIHhtbG5zW3NwbGl0UU5hbWUoYXR0cmlidXRlTmFtZSkubmFtZV0gPSBhdHRyc1thdHRyaWJ1dGVOYW1lXTtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgICBoYXNOb25YbWxuc0F0dHJpYnV0ZSA9IHRydWU7XHJcbiAgICAgIGVsZW1lbnRBdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID0gYXR0cnNbYXR0cmlidXRlTmFtZV07XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChhdHRyaWJ1dGVOYW1lIGluIGVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIGxldCByZXMgPSBzcGxpdFFOYW1lKGF0dHJpYnV0ZU5hbWUpO1xyXG4gICAgICBpZiAocmVzLm5hbWUgPT09ICduaWwnICYmIHhtbG5zW3Jlcy5wcmVmaXhdID09PSAnaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UnICYmIGVsZW1lbnRBdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdICYmXHJcbiAgICAgICAgKGVsZW1lbnRBdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdLnRvTG93ZXJDYXNlKCkgPT09ICd0cnVlJyB8fCBlbGVtZW50QXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSA9PT0gJzEnKVxyXG4gICAgICApIHtcclxuICAgICAgICBoYXNOaWxBdHRyaWJ1dGUgPSB0cnVlO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGhhc05vblhtbG5zQXR0cmlidXRlKSB7XHJcbiAgICAgIG9ialtzZWxmLm9wdGlvbnMuYXR0cmlidXRlc0tleV0gPSBlbGVtZW50QXR0cmlidXRlcztcclxuICAgIH1cclxuXHJcbiAgICAvLyBQaWNrIHVwIHRoZSBzY2hlbWEgZm9yIHRoZSB0eXBlIHNwZWNpZmllZCBpbiBlbGVtZW50J3MgeHNpOnR5cGUgYXR0cmlidXRlLlxyXG4gICAgbGV0IHhzaVR5cGVTY2hlbWE7XHJcbiAgICBsZXQgeHNpVHlwZSA9IGVsZW1lbnRBdHRyaWJ1dGVzWyd4c2k6dHlwZSddO1xyXG4gICAgaWYgKHhzaVR5cGUpIHtcclxuICAgICAgbGV0IHR5cGUgPSBzcGxpdFFOYW1lKHhzaVR5cGUpO1xyXG4gICAgICBsZXQgdHlwZVVSSTtcclxuICAgICAgaWYgKHR5cGUucHJlZml4ID09PSBUTlNfUFJFRklYKSB7XHJcbiAgICAgICAgLy8gSW4gY2FzZSBvZiB4c2k6dHlwZSA9IFwiTXlUeXBlXCJcclxuICAgICAgICB0eXBlVVJJID0geG1sbnNbdHlwZS5wcmVmaXhdIHx8IHhtbG5zLnhtbG5zO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHR5cGVVUkkgPSB4bWxuc1t0eXBlLnByZWZpeF07XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHR5cGVEZWYgPSBzZWxmLmZpbmRTY2hlbWFPYmplY3QodHlwZVVSSSwgdHlwZS5uYW1lKTtcclxuICAgICAgaWYgKHR5cGVEZWYpIHtcclxuICAgICAgICB4c2lUeXBlU2NoZW1hID0gdHlwZURlZi5kZXNjcmlwdGlvbihzZWxmLmRlZmluaXRpb25zKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0b3BTY2hlbWEgJiYgdG9wU2NoZW1hW25hbWUgKyAnW10nXSkge1xyXG4gICAgICBuYW1lID0gbmFtZSArICdbXSc7XHJcbiAgICB9XHJcbiAgICBzdGFjay5wdXNoKHtcclxuICAgICAgbmFtZTogb3JpZ2luYWxOYW1lLFxyXG4gICAgICBvYmplY3Q6IG9iaixcclxuICAgICAgc2NoZW1hOiAoeHNpVHlwZVNjaGVtYSB8fCAodG9wU2NoZW1hICYmIHRvcFNjaGVtYVtuYW1lXSkpLFxyXG4gICAgICBpZDogYXR0cnMuaWQsXHJcbiAgICAgIG5pbDogaGFzTmlsQXR0cmlidXRlXHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBwLm9uY2xvc2V0YWcgPSBmdW5jdGlvbiAobnNOYW1lKSB7XHJcbiAgICBsZXQgY3VyOiBhbnkgPSBzdGFjay5wb3AoKSxcclxuICAgICAgb2JqID0gY3VyLm9iamVjdCxcclxuICAgICAgdG9wID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV0sXHJcbiAgICAgIHRvcE9iamVjdCA9IHRvcC5vYmplY3QsXHJcbiAgICAgIHRvcFNjaGVtYSA9IHRvcC5zY2hlbWEsXHJcbiAgICAgIG5hbWUgPSBzcGxpdFFOYW1lKG5zTmFtZSkubmFtZTtcclxuXHJcbiAgICBpZiAodHlwZW9mIGN1ci5zY2hlbWEgPT09ICdzdHJpbmcnICYmIChjdXIuc2NoZW1hID09PSAnc3RyaW5nJyB8fCAoPHN0cmluZz5jdXIuc2NoZW1hKS5zcGxpdCgnOicpWzFdID09PSAnc3RyaW5nJykpIHtcclxuICAgICAgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID09PSAwKSBvYmogPSBjdXIub2JqZWN0ID0gJyc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGN1ci5uaWwgPT09IHRydWUpIHtcclxuICAgICAgaWYgKHNlbGYub3B0aW9ucy5oYW5kbGVOaWxBc051bGwpIHtcclxuICAgICAgICBvYmogPSBudWxsO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChfLmlzUGxhaW5PYmplY3Qob2JqKSAmJiAhT2JqZWN0LmtleXMob2JqKS5sZW5ndGgpIHtcclxuICAgICAgb2JqID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodG9wU2NoZW1hICYmIHRvcFNjaGVtYVtuYW1lICsgJ1tdJ10pIHtcclxuICAgICAgaWYgKCF0b3BPYmplY3RbbmFtZV0pIHtcclxuICAgICAgICB0b3BPYmplY3RbbmFtZV0gPSBbXTtcclxuICAgICAgfVxyXG4gICAgICB0b3BPYmplY3RbbmFtZV0ucHVzaChvYmopO1xyXG4gICAgfSBlbHNlIGlmIChuYW1lIGluIHRvcE9iamVjdCkge1xyXG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkodG9wT2JqZWN0W25hbWVdKSkge1xyXG4gICAgICAgIHRvcE9iamVjdFtuYW1lXSA9IFt0b3BPYmplY3RbbmFtZV1dO1xyXG4gICAgICB9XHJcbiAgICAgIHRvcE9iamVjdFtuYW1lXS5wdXNoKG9iaik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0b3BPYmplY3RbbmFtZV0gPSBvYmo7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGN1ci5pZCkge1xyXG4gICAgICByZWZzW2N1ci5pZF0ub2JqID0gb2JqO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHAub25jZGF0YSA9IGZ1bmN0aW9uICh0ZXh0KSB7XHJcbiAgICBsZXQgb3JpZ2luYWxUZXh0ID0gdGV4dDtcclxuICAgIHRleHQgPSB0cmltKHRleHQpO1xyXG4gICAgaWYgKCF0ZXh0Lmxlbmd0aCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKC88XFw/eG1sW1xcc1xcU10rXFw/Pi8udGVzdCh0ZXh0KSkge1xyXG4gICAgICBsZXQgdG9wID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XHJcbiAgICAgIGxldCB2YWx1ZSA9IHNlbGYueG1sVG9PYmplY3QodGV4dCk7XHJcbiAgICAgIGlmICh0b3Aub2JqZWN0W3NlbGYub3B0aW9ucy5hdHRyaWJ1dGVzS2V5XSkge1xyXG4gICAgICAgIHRvcC5vYmplY3Rbc2VsZi5vcHRpb25zLnZhbHVlS2V5XSA9IHZhbHVlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRvcC5vYmplY3QgPSB2YWx1ZTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcC5vbnRleHQob3JpZ2luYWxUZXh0KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBwLm9uZXJyb3IgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgcC5yZXN1bWUoKTtcclxuICAgIHRocm93IHtcclxuICAgICAgRmF1bHQ6IHtcclxuICAgICAgICBmYXVsdGNvZGU6IDUwMCxcclxuICAgICAgICBmYXVsdHN0cmluZzogJ0ludmFsaWQgWE1MJyxcclxuICAgICAgICBkZXRhaWw6IG5ldyBFcnJvcihlKS5tZXNzYWdlLFxyXG4gICAgICAgIHN0YXR1c0NvZGU6IDUwMFxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH07XHJcblxyXG4gIHAub250ZXh0ID0gZnVuY3Rpb24gKHRleHQpIHtcclxuICAgIGxldCBvcmlnaW5hbFRleHQgPSB0ZXh0O1xyXG4gICAgdGV4dCA9IHRyaW0odGV4dCk7XHJcbiAgICBpZiAoIXRleHQubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgdG9wID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XHJcbiAgICBsZXQgbmFtZSA9IHNwbGl0UU5hbWUodG9wLnNjaGVtYSkubmFtZSxcclxuICAgICAgdmFsdWU7XHJcbiAgICBpZiAoc2VsZi5vcHRpb25zICYmIHNlbGYub3B0aW9ucy5jdXN0b21EZXNlcmlhbGl6ZXIgJiYgc2VsZi5vcHRpb25zLmN1c3RvbURlc2VyaWFsaXplcltuYW1lXSkge1xyXG4gICAgICB2YWx1ZSA9IHNlbGYub3B0aW9ucy5jdXN0b21EZXNlcmlhbGl6ZXJbbmFtZV0odGV4dCwgdG9wKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBpZiAobmFtZSA9PT0gJ2ludCcgfHwgbmFtZSA9PT0gJ2ludGVnZXInKSB7XHJcbiAgICAgICAgdmFsdWUgPSBwYXJzZUludCh0ZXh0LCAxMCk7XHJcbiAgICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gJ2Jvb2wnIHx8IG5hbWUgPT09ICdib29sZWFuJykge1xyXG4gICAgICAgIHZhbHVlID0gdGV4dC50b0xvd2VyQ2FzZSgpID09PSAndHJ1ZScgfHwgdGV4dCA9PT0gJzEnO1xyXG4gICAgICB9IGVsc2UgaWYgKG5hbWUgPT09ICdkYXRlVGltZScgfHwgbmFtZSA9PT0gJ2RhdGUnKSB7XHJcbiAgICAgICAgdmFsdWUgPSBuZXcgRGF0ZSh0ZXh0KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnByZXNlcnZlV2hpdGVzcGFjZSkge1xyXG4gICAgICAgICAgdGV4dCA9IG9yaWdpbmFsVGV4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaGFuZGxlIHN0cmluZyBvciBvdGhlciB0eXBlc1xyXG4gICAgICAgIGlmICh0eXBlb2YgdG9wLm9iamVjdCAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgIHZhbHVlID0gdGV4dDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdmFsdWUgPSB0b3Aub2JqZWN0ICsgdGV4dDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodG9wLm9iamVjdFtzZWxmLm9wdGlvbnMuYXR0cmlidXRlc0tleV0pIHtcclxuICAgICAgdG9wLm9iamVjdFtzZWxmLm9wdGlvbnMudmFsdWVLZXldID0gdmFsdWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0b3Aub2JqZWN0ID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgLy8gd2UgYmUgc3RyZWFtaW5nXHJcbiAgICBsZXQgc2F4U3RyZWFtID0gc2F4LmNyZWF0ZVN0cmVhbSh0cnVlKTtcclxuICAgIHNheFN0cmVhbS5vbignb3BlbnRhZycsIHAub25vcGVudGFnKTtcclxuICAgIHNheFN0cmVhbS5vbignY2xvc2V0YWcnLCBwLm9uY2xvc2V0YWcpO1xyXG4gICAgc2F4U3RyZWFtLm9uKCdjZGF0YScsIHAub25jZGF0YSk7XHJcbiAgICBzYXhTdHJlYW0ub24oJ3RleHQnLCBwLm9udGV4dCk7XHJcbiAgICB4bWwucGlwZShzYXhTdHJlYW0pXHJcbiAgICAgIC5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyKTtcclxuICAgICAgfSlcclxuICAgICAgLm9uKCdlbmQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGV0IHI7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIHIgPSBmaW5pc2goKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHIpO1xyXG4gICAgICB9KTtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgcC53cml0ZSh4bWwpLmNsb3NlKCk7XHJcblxyXG4gIHJldHVybiBmaW5pc2goKTtcclxuXHJcbiAgZnVuY3Rpb24gZmluaXNoKCkge1xyXG4gICAgLy8gTXVsdGlSZWYgc3VwcG9ydDogbWVyZ2Ugb2JqZWN0cyBpbnN0ZWFkIG9mIHJlcGxhY2luZ1xyXG4gICAgZm9yIChsZXQgbiBpbiByZWZzKSB7XHJcbiAgICAgIGxldCByZWYgPSByZWZzW25dO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlZi5ocmVmcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIF8uYXNzaWduKHJlZi5ocmVmc1tpXS5vYmosIHJlZi5vYmopO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJvb3QuRW52ZWxvcGUpIHtcclxuICAgICAgbGV0IGJvZHkgPSByb290LkVudmVsb3BlLkJvZHk7XHJcbiAgICAgIGxldCBlcnJvcjogYW55O1xyXG4gICAgICBpZiAoYm9keSAmJiBib2R5LkZhdWx0KSB7XHJcbiAgICAgICAgaWYoIWJvZHkuRmF1bHQuQ29kZSkge1xyXG4gICAgICAgICAgbGV0IGNvZGUgPSBib2R5LkZhdWx0LmZhdWx0Y29kZSAmJiBib2R5LkZhdWx0LmZhdWx0Y29kZS4kdmFsdWU7XHJcbiAgICAgICAgICBsZXQgc3RyaW5nID0gYm9keS5GYXVsdC5mYXVsdHN0cmluZyAmJiBib2R5LkZhdWx0LmZhdWx0c3RyaW5nLiR2YWx1ZTtcclxuICAgICAgICAgIGxldCBkZXRhaWwgPSBib2R5LkZhdWx0LmRldGFpbCAmJiBib2R5LkZhdWx0LmRldGFpbC4kdmFsdWU7XHJcblxyXG4gICAgICAgICAgY29kZSA9IGNvZGUgfHwgYm9keS5GYXVsdC5mYXVsdGNvZGU7XHJcbiAgICAgICAgICBzdHJpbmcgPSBzdHJpbmcgfHwgYm9keS5GYXVsdC5mYXVsdHN0cmluZztcclxuICAgICAgICAgIGRldGFpbCA9IGRldGFpbCB8fCBib2R5LkZhdWx0LmRldGFpbDtcclxuXHJcbiAgICAgICAgICBsZXQgZXJyb3I6IGFueSA9IG5ldyBFcnJvcihjb2RlICsgJzogJyArIHN0cmluZyArIChkZXRhaWwgPyAnOiAnICsgZGV0YWlsIDogJycpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IGNvZGUgPSBib2R5LkZhdWx0LkNvZGUuVmFsdWU7XHJcbiAgICAgICAgICBsZXQgc3RyaW5nID0gYm9keS5GYXVsdC5SZWFzb24uVGV4dC4kdmFsdWU7XHJcbiAgICAgICAgICBsZXQgZGV0YWlsID0gYm9keS5GYXVsdC5EZXRhaWwuaW5mbztcclxuICAgICAgICAgIGVycm9yID0gbmV3IEVycm9yKGNvZGUgKyAnOiAnICsgc3RyaW5nICsgKGRldGFpbCA/ICc6ICcgKyBkZXRhaWwgOiAnJykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXJyb3Iucm9vdCA9IHJvb3Q7XHJcbiAgICAgICAgdGhyb3cgYm9keS5GYXVsdDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcm9vdC5FbnZlbG9wZTtcclxuICAgIH1cclxuICAgIHJldHVybiByb290O1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBMb29rIHVwIGEgWFNEIHR5cGUgb3IgZWxlbWVudCBieSBuYW1lc3BhY2UgVVJJIGFuZCBuYW1lXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBuc1VSSSBOYW1lc3BhY2UgVVJJXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBxbmFtZSBMb2NhbCBvciBxdWFsaWZpZWQgbmFtZVxyXG4gKiBAcmV0dXJucyB7Kn0gVGhlIFhTRCB0eXBlL2VsZW1lbnQgZGVmaW5pdGlvblxyXG4gKi9cclxuV1NETC5wcm90b3R5cGUuZmluZFNjaGVtYU9iamVjdCA9IGZ1bmN0aW9uIChuc1VSSSwgcW5hbWUpIHtcclxuICBpZiAoIW5zVVJJIHx8ICFxbmFtZSkge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBsZXQgZGVmID0gbnVsbDtcclxuXHJcbiAgaWYgKHRoaXMuZGVmaW5pdGlvbnMuc2NoZW1hcykge1xyXG4gICAgbGV0IHNjaGVtYSA9IHRoaXMuZGVmaW5pdGlvbnMuc2NoZW1hc1tuc1VSSV07XHJcbiAgICBpZiAoc2NoZW1hKSB7XHJcbiAgICAgIGlmIChxbmFtZS5pbmRleE9mKCc6JykgIT09IC0xKSB7XHJcbiAgICAgICAgcW5hbWUgPSBxbmFtZS5zdWJzdHJpbmcocW5hbWUuaW5kZXhPZignOicpICsgMSwgcW5hbWUubGVuZ3RoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gaWYgdGhlIGNsaWVudCBwYXNzZWQgYW4gaW5wdXQgZWxlbWVudCB3aGljaCBoYXMgYSBgJGxvb2t1cFR5cGVgIHByb3BlcnR5IGluc3RlYWQgb2YgYCR0eXBlYFxyXG4gICAgICAvLyB0aGUgYGRlZmAgaXMgZm91bmQgaW4gYHNjaGVtYS5lbGVtZW50c2AuXHJcbiAgICAgIGRlZiA9IHNjaGVtYS5jb21wbGV4VHlwZXNbcW5hbWVdIHx8IHNjaGVtYS50eXBlc1txbmFtZV0gfHwgc2NoZW1hLmVsZW1lbnRzW3FuYW1lXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBkZWY7XHJcbn07XHJcblxyXG4vKipcclxuICogQ3JlYXRlIGRvY3VtZW50IHN0eWxlIHhtbCBzdHJpbmcgZnJvbSB0aGUgcGFyYW1ldGVyc1xyXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxyXG4gKiBAcGFyYW0geyp9IHBhcmFtc1xyXG4gKiBAcGFyYW0ge1N0cmluZ30gbnNQcmVmaXhcclxuICogQHBhcmFtIHtTdHJpbmd9IG5zVVJJXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXHJcbiAqL1xyXG5XU0RMLnByb3RvdHlwZS5vYmplY3RUb0RvY3VtZW50WE1MID0gZnVuY3Rpb24gKG5hbWUsIHBhcmFtcywgbnNQcmVmaXgsIG5zVVJJLCB0eXBlKSB7XHJcbiAgLy9JZiB1c2VyIHN1cHBsaWVzIFhNTCBhbHJlYWR5LCBqdXN0IHVzZSB0aGF0LiAgWE1MIERlY2xhcmF0aW9uIHNob3VsZCBub3QgYmUgcHJlc2VudC5cclxuICBpZiAocGFyYW1zICYmIHBhcmFtcy5feG1sKSB7XHJcbiAgICByZXR1cm4gcGFyYW1zLl94bWw7XHJcbiAgfVxyXG4gIGxldCBhcmdzID0ge307XHJcbiAgYXJnc1tuYW1lXSA9IHBhcmFtcztcclxuICBsZXQgcGFyYW1ldGVyVHlwZU9iaiA9IHR5cGUgPyB0aGlzLmZpbmRTY2hlbWFPYmplY3QobnNVUkksIHR5cGUpIDogbnVsbDtcclxuICByZXR1cm4gdGhpcy5vYmplY3RUb1hNTChhcmdzLCBudWxsLCBuc1ByZWZpeCwgbnNVUkksIHRydWUsIG51bGwsIHBhcmFtZXRlclR5cGVPYmopO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBSUEMgc3R5bGUgeG1sIHN0cmluZyBmcm9tIHRoZSBwYXJhbWV0ZXJzXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXHJcbiAqIEBwYXJhbSB7Kn0gcGFyYW1zXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBuc1ByZWZpeFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gbnNVUklcclxuICogQHJldHVybnMge3N0cmluZ31cclxuICovXHJcbldTREwucHJvdG90eXBlLm9iamVjdFRvUnBjWE1MID0gZnVuY3Rpb24gKG5hbWUsIHBhcmFtcywgbnNQcmVmaXgsIG5zVVJJLCBpc1BhcnRzKSB7XHJcbiAgbGV0IHBhcnRzID0gW107XHJcbiAgbGV0IGRlZnMgPSB0aGlzLmRlZmluaXRpb25zO1xyXG4gIGxldCBuc0F0dHJOYW1lID0gJ194bWxucyc7XHJcblxyXG4gIG5zUHJlZml4ID0gbnNQcmVmaXggfHwgZmluZFByZWZpeChkZWZzLnhtbG5zLCBuc1VSSSk7XHJcblxyXG4gIG5zVVJJID0gbnNVUkkgfHwgZGVmcy54bWxuc1tuc1ByZWZpeF07XHJcbiAgbnNQcmVmaXggPSBuc1ByZWZpeCA9PT0gVE5TX1BSRUZJWCA/ICcnIDogKG5zUHJlZml4ICsgJzonKTtcclxuXHJcbiAgcGFydHMucHVzaChbJzwnLCBuc1ByZWZpeCwgbmFtZSwgJz4nXS5qb2luKCcnKSk7XHJcblxyXG4gIGZvciAobGV0IGtleSBpbiBwYXJhbXMpIHtcclxuICAgIGlmICghcGFyYW1zLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcbiAgICBpZiAoa2V5ICE9PSBuc0F0dHJOYW1lKSB7XHJcbiAgICAgIGxldCB2YWx1ZSA9IHBhcmFtc1trZXldO1xyXG4gICAgICBsZXQgcHJlZml4ZWRLZXkgPSAoaXNQYXJ0cyA/ICcnIDogbnNQcmVmaXgpICsga2V5O1xyXG4gICAgICBsZXQgYXR0cmlidXRlcyA9IFtdO1xyXG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZS5oYXNPd25Qcm9wZXJ0eSh0aGlzLm9wdGlvbnMuYXR0cmlidXRlc0tleSkpIHtcclxuICAgICAgICBsZXQgYXR0cnMgPSB2YWx1ZVt0aGlzLm9wdGlvbnMuYXR0cmlidXRlc0tleV07XHJcbiAgICAgICAgZm9yIChsZXQgbiBpbiBhdHRycykge1xyXG4gICAgICAgICAgYXR0cmlidXRlcy5wdXNoKCcgJyArIG4gKyAnPScgKyAnXCInICsgYXR0cnNbbl0gKyAnXCInKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcGFydHMucHVzaChbJzwnLCBwcmVmaXhlZEtleV0uY29uY2F0KGF0dHJpYnV0ZXMpLmNvbmNhdCgnPicpLmpvaW4oJycpKTtcclxuICAgICAgcGFydHMucHVzaCgodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JykgPyB0aGlzLm9iamVjdFRvWE1MKHZhbHVlLCBrZXksIG5zUHJlZml4LCBuc1VSSSkgOiB4bWxFc2NhcGUodmFsdWUpKTtcclxuICAgICAgcGFydHMucHVzaChbJzwvJywgcHJlZml4ZWRLZXksICc+J10uam9pbignJykpO1xyXG4gICAgfVxyXG4gIH1cclxuICBwYXJ0cy5wdXNoKFsnPC8nLCBuc1ByZWZpeCwgbmFtZSwgJz4nXS5qb2luKCcnKSk7XHJcbiAgcmV0dXJuIHBhcnRzLmpvaW4oJycpO1xyXG59O1xyXG5cclxuXHJcbmZ1bmN0aW9uIGFwcGVuZENvbG9uKG5zKSB7XHJcbiAgcmV0dXJuIChucyAmJiBucy5jaGFyQXQobnMubGVuZ3RoIC0gMSkgIT09ICc6JykgPyBucyArICc6JyA6IG5zO1xyXG59XHJcblxyXG5mdW5jdGlvbiBub0NvbG9uTmFtZVNwYWNlKG5zKSB7XHJcbiAgcmV0dXJuIChucyAmJiBucy5jaGFyQXQobnMubGVuZ3RoIC0gMSkgPT09ICc6JykgPyBucy5zdWJzdHJpbmcoMCwgbnMubGVuZ3RoIC0gMSkgOiBucztcclxufVxyXG5cclxuV1NETC5wcm90b3R5cGUuaXNJZ25vcmVkTmFtZVNwYWNlID0gZnVuY3Rpb24gKG5zKSB7XHJcbiAgcmV0dXJuIHRoaXMub3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcy5pbmRleE9mKG5zKSA+IC0xO1xyXG59O1xyXG5cclxuV1NETC5wcm90b3R5cGUuZmlsdGVyT3V0SWdub3JlZE5hbWVTcGFjZSA9IGZ1bmN0aW9uIChucykge1xyXG4gIGxldCBuYW1lc3BhY2UgPSBub0NvbG9uTmFtZVNwYWNlKG5zKTtcclxuICByZXR1cm4gdGhpcy5pc0lnbm9yZWROYW1lU3BhY2UobmFtZXNwYWNlKSA/ICcnIDogbmFtZXNwYWNlO1xyXG59O1xyXG5cclxuXHJcblxyXG4vKipcclxuICogQ29udmVydCBhbiBvYmplY3QgdG8gWE1MLiAgVGhpcyBpcyBhIHJlY3Vyc2l2ZSBtZXRob2QgYXMgaXQgY2FsbHMgaXRzZWxmLlxyXG4gKlxyXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIHRoZSBvYmplY3QgdG8gY29udmVydC5cclxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgdGhlIG5hbWUgb2YgdGhlIGVsZW1lbnQgKGlmIHRoZSBvYmplY3QgYmVpbmcgdHJhdmVyc2VkIGlzXHJcbiAqIGFuIGVsZW1lbnQpLlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gbnNQcmVmaXggdGhlIG5hbWVzcGFjZSBwcmVmaXggb2YgdGhlIG9iamVjdCBJLkUuIHhzZC5cclxuICogQHBhcmFtIHtTdHJpbmd9IG5zVVJJIHRoZSBmdWxsIG5hbWVzcGFjZSBvZiB0aGUgb2JqZWN0IEkuRS4gaHR0cDovL3czLm9yZy9zY2hlbWEuXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNGaXJzdCB3aGV0aGVyIG9yIG5vdCB0aGlzIGlzIHRoZSBmaXJzdCBpdGVtIGJlaW5nIHRyYXZlcnNlZC5cclxuICogQHBhcmFtIHs/fSB4bWxuc0F0dHJcclxuICogQHBhcmFtIHs/fSBwYXJhbWV0ZXJUeXBlT2JqZWN0XHJcbiAqIEBwYXJhbSB7TmFtZXNwYWNlQ29udGV4dH0gbnNDb250ZXh0IE5hbWVzcGFjZSBjb250ZXh0XHJcbiAqL1xyXG5XU0RMLnByb3RvdHlwZS5vYmplY3RUb1hNTCA9IGZ1bmN0aW9uIChvYmosIG5hbWUsIG5zUHJlZml4LCBuc1VSSSwgaXNGaXJzdCwgeG1sbnNBdHRyLCBzY2hlbWFPYmplY3QsIG5zQ29udGV4dCkge1xyXG4gIGxldCBzZWxmID0gdGhpcztcclxuICBsZXQgc2NoZW1hID0gdGhpcy5kZWZpbml0aW9ucy5zY2hlbWFzW25zVVJJXTtcclxuXHJcbiAgbGV0IHBhcmVudE5zUHJlZml4ID0gbnNQcmVmaXggPyBuc1ByZWZpeC5wYXJlbnQgOiB1bmRlZmluZWQ7XHJcbiAgaWYgKHR5cGVvZiBwYXJlbnROc1ByZWZpeCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIC8vd2UgZ290IHRoZSBwYXJlbnROc1ByZWZpeCBmb3Igb3VyIGFycmF5LiBzZXR0aW5nIHRoZSBuYW1lc3BhY2UtbGV0aWFibGUgYmFjayB0byB0aGUgY3VycmVudCBuYW1lc3BhY2Ugc3RyaW5nXHJcbiAgICBuc1ByZWZpeCA9IG5zUHJlZml4LmN1cnJlbnQ7XHJcbiAgfVxyXG5cclxuICBwYXJlbnROc1ByZWZpeCA9IG5vQ29sb25OYW1lU3BhY2UocGFyZW50TnNQcmVmaXgpO1xyXG4gIGlmICh0aGlzLmlzSWdub3JlZE5hbWVTcGFjZShwYXJlbnROc1ByZWZpeCkpIHtcclxuICAgIHBhcmVudE5zUHJlZml4ID0gJyc7XHJcbiAgfVxyXG5cclxuICBsZXQgc29hcEhlYWRlciA9ICFzY2hlbWE7XHJcbiAgbGV0IHF1YWxpZmllZCA9IHNjaGVtYSAmJiBzY2hlbWEuJGVsZW1lbnRGb3JtRGVmYXVsdCA9PT0gJ3F1YWxpZmllZCc7XHJcbiAgbGV0IHBhcnRzID0gW107XHJcbiAgbGV0IHByZWZpeE5hbWVzcGFjZSA9IChuc1ByZWZpeCB8fCBxdWFsaWZpZWQpICYmIG5zUHJlZml4ICE9PSBUTlNfUFJFRklYO1xyXG5cclxuICBsZXQgeG1sbnNBdHRyaWIgPSAnJztcclxuICBpZiAobnNVUkkgJiYgaXNGaXJzdCkge1xyXG4gICAgaWYgKHNlbGYub3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50ICYmIHNlbGYub3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50LnhtbG5zQXR0cmlidXRlcykge1xyXG4gICAgICBzZWxmLm9wdGlvbnMub3ZlcnJpZGVSb290RWxlbWVudC54bWxuc0F0dHJpYnV0ZXMuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XHJcbiAgICAgICAgeG1sbnNBdHRyaWIgKz0gJyAnICsgYXR0cmlidXRlLm5hbWUgKyAnPVwiJyArIGF0dHJpYnV0ZS52YWx1ZSArICdcIic7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHByZWZpeE5hbWVzcGFjZSAmJiAhdGhpcy5pc0lnbm9yZWROYW1lU3BhY2UobnNQcmVmaXgpKSB7XHJcbiAgICAgICAgLy8gcmVzb2x2ZSB0aGUgcHJlZml4IG5hbWVzcGFjZVxyXG4gICAgICAgIHhtbG5zQXR0cmliICs9ICcgeG1sbnM6JyArIG5zUHJlZml4ICsgJz1cIicgKyBuc1VSSSArICdcIic7XHJcbiAgICAgIH1cclxuICAgICAgLy8gb25seSBhZGQgZGVmYXVsdCBuYW1lc3BhY2UgaWYgdGhlIHNjaGVtYSBlbGVtZW50Rm9ybURlZmF1bHQgaXMgcXVhbGlmaWVkXHJcbiAgICAgIGlmIChxdWFsaWZpZWQgfHwgc29hcEhlYWRlcikgeG1sbnNBdHRyaWIgKz0gJyB4bWxucz1cIicgKyBuc1VSSSArICdcIic7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAoIW5zQ29udGV4dCkge1xyXG4gICAgbnNDb250ZXh0ID0gbmV3IE5hbWVzcGFjZUNvbnRleHQoKTtcclxuICAgIG5zQ29udGV4dC5kZWNsYXJlTmFtZXNwYWNlKG5zUHJlZml4LCBuc1VSSSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIG5zQ29udGV4dC5wdXNoQ29udGV4dCgpO1xyXG4gIH1cclxuXHJcbiAgLy8gZXhwbGljaXRseSB1c2UgeG1sbnMgYXR0cmlidXRlIGlmIGF2YWlsYWJsZVxyXG4gIGlmICh4bWxuc0F0dHIgJiYgIShzZWxmLm9wdGlvbnMub3ZlcnJpZGVSb290RWxlbWVudCAmJiBzZWxmLm9wdGlvbnMub3ZlcnJpZGVSb290RWxlbWVudC54bWxuc0F0dHJpYnV0ZXMpKSB7XHJcbiAgICB4bWxuc0F0dHJpYiA9IHhtbG5zQXR0cjtcclxuICB9XHJcblxyXG4gIGxldCBucyA9ICcnO1xyXG5cclxuICBpZiAoc2VsZi5vcHRpb25zLm92ZXJyaWRlUm9vdEVsZW1lbnQgJiYgaXNGaXJzdCkge1xyXG4gICAgbnMgPSBzZWxmLm9wdGlvbnMub3ZlcnJpZGVSb290RWxlbWVudC5uYW1lc3BhY2U7XHJcbiAgfSBlbHNlIGlmIChwcmVmaXhOYW1lc3BhY2UgJiYgKHF1YWxpZmllZCB8fCBpc0ZpcnN0IHx8IHNvYXBIZWFkZXIpICYmICF0aGlzLmlzSWdub3JlZE5hbWVTcGFjZShuc1ByZWZpeCkpIHtcclxuICAgIG5zID0gbnNQcmVmaXg7XHJcbiAgfVxyXG5cclxuICBsZXQgaSwgbjtcclxuICAvLyBzdGFydCBidWlsZGluZyBvdXQgWE1MIHN0cmluZy5cclxuICBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XHJcbiAgICBmb3IgKGkgPSAwLCBuID0gb2JqLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICBsZXQgaXRlbSA9IG9ialtpXTtcclxuICAgICAgbGV0IGFycmF5QXR0ciA9IHNlbGYucHJvY2Vzc0F0dHJpYnV0ZXMoaXRlbSwgbnNDb250ZXh0KSxcclxuICAgICAgICBjb3JyZWN0T3V0ZXJOc1ByZWZpeCA9IHBhcmVudE5zUHJlZml4IHx8IG5zOyAvL3VzaW5nIHRoZSBwYXJlbnQgbmFtZXNwYWNlIHByZWZpeCBpZiBnaXZlblxyXG5cclxuICAgICAgbGV0IGJvZHkgPSBzZWxmLm9iamVjdFRvWE1MKGl0ZW0sIG5hbWUsIG5zUHJlZml4LCBuc1VSSSwgZmFsc2UsIG51bGwsIHNjaGVtYU9iamVjdCwgbnNDb250ZXh0KTtcclxuXHJcbiAgICAgIGxldCBvcGVuaW5nVGFnUGFydHMgPSBbJzwnLCBhcHBlbmRDb2xvbihjb3JyZWN0T3V0ZXJOc1ByZWZpeCksIG5hbWUsIGFycmF5QXR0ciwgeG1sbnNBdHRyaWJdO1xyXG5cclxuICAgICAgaWYgKGJvZHkgPT09ICcnICYmIHNlbGYub3B0aW9ucy51c2VFbXB0eVRhZykge1xyXG4gICAgICAgIC8vIFVzZSBlbXB0eSAoc2VsZi1jbG9zaW5nKSB0YWdzIGlmIG5vIGNvbnRlbnRzXHJcbiAgICAgICAgb3BlbmluZ1RhZ1BhcnRzLnB1c2goJyAvPicpO1xyXG4gICAgICAgIHBhcnRzLnB1c2gob3BlbmluZ1RhZ1BhcnRzLmpvaW4oJycpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvcGVuaW5nVGFnUGFydHMucHVzaCgnPicpO1xyXG4gICAgICAgIGlmIChzZWxmLm9wdGlvbnMubmFtZXNwYWNlQXJyYXlFbGVtZW50cyB8fCBpID09PSAwKSB7XHJcbiAgICAgICAgICBwYXJ0cy5wdXNoKG9wZW5pbmdUYWdQYXJ0cy5qb2luKCcnKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhcnRzLnB1c2goYm9keSk7XHJcbiAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5uYW1lc3BhY2VBcnJheUVsZW1lbnRzIHx8IGkgPT09IG4gLSAxKSB7XHJcbiAgICAgICAgICBwYXJ0cy5wdXNoKFsnPC8nLCBhcHBlbmRDb2xvbihjb3JyZWN0T3V0ZXJOc1ByZWZpeCksIG5hbWUsICc+J10uam9pbignJykpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpIHtcclxuICAgIGZvciAobmFtZSBpbiBvYmopIHtcclxuICAgICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkobmFtZSkpIGNvbnRpbnVlO1xyXG4gICAgICAvL2Rvbid0IHByb2Nlc3MgYXR0cmlidXRlcyBhcyBlbGVtZW50XHJcbiAgICAgIGlmIChuYW1lID09PSBzZWxmLm9wdGlvbnMuYXR0cmlidXRlc0tleSkge1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcbiAgICAgIC8vSXRzIHRoZSB2YWx1ZSBvZiBhIHhtbCBvYmplY3QuIFJldHVybiBpdCBkaXJlY3RseS5cclxuICAgICAgaWYgKG5hbWUgPT09IHNlbGYub3B0aW9ucy54bWxLZXkpIHtcclxuICAgICAgICBuc0NvbnRleHQucG9wQ29udGV4dCgpO1xyXG4gICAgICAgIHJldHVybiBvYmpbbmFtZV07XHJcbiAgICAgIH1cclxuICAgICAgLy9JdHMgdGhlIHZhbHVlIG9mIGFuIGl0ZW0uIFJldHVybiBpdCBkaXJlY3RseS5cclxuICAgICAgaWYgKG5hbWUgPT09IHNlbGYub3B0aW9ucy52YWx1ZUtleSkge1xyXG4gICAgICAgIG5zQ29udGV4dC5wb3BDb250ZXh0KCk7XHJcbiAgICAgICAgcmV0dXJuIHhtbEVzY2FwZShvYmpbbmFtZV0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgY2hpbGQgPSBvYmpbbmFtZV07XHJcbiAgICAgIGlmICh0eXBlb2YgY2hpbGQgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBhdHRyID0gc2VsZi5wcm9jZXNzQXR0cmlidXRlcyhjaGlsZCwgbnNDb250ZXh0KTtcclxuXHJcbiAgICAgIGxldCB2YWx1ZSA9ICcnO1xyXG4gICAgICBsZXQgbm9uU3ViTmFtZVNwYWNlID0gJyc7XHJcbiAgICAgIGxldCBlbXB0eU5vblN1Yk5hbWVTcGFjZSA9IGZhbHNlO1xyXG5cclxuICAgICAgbGV0IG5hbWVXaXRoTnNSZWdleCA9IC9eKFteOl0rKTooW146XSspJC8uZXhlYyhuYW1lKTtcclxuICAgICAgaWYgKG5hbWVXaXRoTnNSZWdleCkge1xyXG4gICAgICAgIG5vblN1Yk5hbWVTcGFjZSA9IG5hbWVXaXRoTnNSZWdleFsxXSArICc6JztcclxuICAgICAgICBuYW1lID0gbmFtZVdpdGhOc1JlZ2V4WzJdO1xyXG4gICAgICB9IGVsc2UgaWYgKG5hbWVbMF0gPT09ICc6Jykge1xyXG4gICAgICAgIGVtcHR5Tm9uU3ViTmFtZVNwYWNlID0gdHJ1ZTtcclxuICAgICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpc0ZpcnN0KSB7XHJcbiAgICAgICAgdmFsdWUgPSBzZWxmLm9iamVjdFRvWE1MKGNoaWxkLCBuYW1lLCBuc1ByZWZpeCwgbnNVUkksIGZhbHNlLCBudWxsLCBzY2hlbWFPYmplY3QsIG5zQ29udGV4dCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIGlmIChzZWxmLmRlZmluaXRpb25zLnNjaGVtYXMpIHtcclxuICAgICAgICAgIGlmIChzY2hlbWEpIHtcclxuICAgICAgICAgICAgbGV0IGNoaWxkU2NoZW1hT2JqZWN0ID0gc2VsZi5maW5kQ2hpbGRTY2hlbWFPYmplY3Qoc2NoZW1hT2JqZWN0LCBuYW1lKTtcclxuICAgICAgICAgICAgLy9maW5kIHN1YiBuYW1lc3BhY2UgaWYgbm90IGEgcHJpbWl0aXZlXHJcbiAgICAgICAgICAgIGlmIChjaGlsZFNjaGVtYU9iamVjdCAmJlxyXG4gICAgICAgICAgICAgICgoY2hpbGRTY2hlbWFPYmplY3QuJHR5cGUgJiYgKGNoaWxkU2NoZW1hT2JqZWN0LiR0eXBlLmluZGV4T2YoJ3hzZDonKSA9PT0gLTEpKSB8fFxyXG4gICAgICAgICAgICAgICAgY2hpbGRTY2hlbWFPYmplY3QuJHJlZiB8fCBjaGlsZFNjaGVtYU9iamVjdC4kbmFtZSkpIHtcclxuICAgICAgICAgICAgICAvKmlmIHRoZSBiYXNlIG5hbWUgc3BhY2Ugb2YgdGhlIGNoaWxkcmVuIGlzIG5vdCBpbiB0aGUgaW5nb3JlZFNjaGVtYU5hbXNwYWNlcyB3ZSB1c2UgaXQuXHJcbiAgICAgICAgICAgICAgIFRoaXMgaXMgYmVjYXVzZSBpbiBzb21lIHNlcnZpY2VzIHRoZSBjaGlsZCBub2RlcyBkbyBub3QgbmVlZCB0aGUgYmFzZU5hbWVTcGFjZS5cclxuICAgICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgICAgbGV0IGNoaWxkTnNQcmVmaXg6IGFueSA9ICcnO1xyXG4gICAgICAgICAgICAgIGxldCBjaGlsZE5hbWUgPSAnJztcclxuICAgICAgICAgICAgICBsZXQgY2hpbGROc1VSSTtcclxuICAgICAgICAgICAgICBsZXQgY2hpbGRYbWxuc0F0dHJpYiA9ICcnO1xyXG5cclxuICAgICAgICAgICAgICBsZXQgZWxlbWVudFFOYW1lID0gY2hpbGRTY2hlbWFPYmplY3QuJHJlZiB8fCBjaGlsZFNjaGVtYU9iamVjdC4kbmFtZTtcclxuICAgICAgICAgICAgICBpZiAoZWxlbWVudFFOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50UU5hbWUgPSBzcGxpdFFOYW1lKGVsZW1lbnRRTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZE5hbWUgPSBlbGVtZW50UU5hbWUubmFtZTtcclxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50UU5hbWUucHJlZml4ID09PSBUTlNfUFJFRklYKSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vIExvY2FsIGVsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgY2hpbGROc1VSSSA9IGNoaWxkU2NoZW1hT2JqZWN0LiR0YXJnZXROYW1lc3BhY2U7XHJcbiAgICAgICAgICAgICAgICAgIGNoaWxkTnNQcmVmaXggPSBuc0NvbnRleHQucmVnaXN0ZXJOYW1lc3BhY2UoY2hpbGROc1VSSSk7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzSWdub3JlZE5hbWVTcGFjZShjaGlsZE5zUHJlZml4KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkTnNQcmVmaXggPSBuc1ByZWZpeDtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgY2hpbGROc1ByZWZpeCA9IGVsZW1lbnRRTmFtZS5wcmVmaXg7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzSWdub3JlZE5hbWVTcGFjZShjaGlsZE5zUHJlZml4KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkTnNQcmVmaXggPSBuc1ByZWZpeDtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBjaGlsZE5zVVJJID0gc2NoZW1hLnhtbG5zW2NoaWxkTnNQcmVmaXhdIHx8IHNlbGYuZGVmaW5pdGlvbnMueG1sbnNbY2hpbGROc1ByZWZpeF07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHVucXVhbGlmaWVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBxdWFsaWZpY2F0aW9uIGZvcm0gZm9yIGxvY2FsIGVsZW1lbnRzXHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGRTY2hlbWFPYmplY3QuJG5hbWUgJiYgY2hpbGRTY2hlbWFPYmplY3QudGFyZ2V0TmFtZXNwYWNlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkU2NoZW1hT2JqZWN0LiRmb3JtID09PSAndW5xdWFsaWZpZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdW5xdWFsaWZpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkU2NoZW1hT2JqZWN0LiRmb3JtID09PSAncXVhbGlmaWVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHVucXVhbGlmaWVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdW5xdWFsaWZpZWQgPSBzY2hlbWEuJGVsZW1lbnRGb3JtRGVmYXVsdCAhPT0gJ3F1YWxpZmllZCc7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh1bnF1YWxpZmllZCkge1xyXG4gICAgICAgICAgICAgICAgICBjaGlsZE5zUHJlZml4ID0gJyc7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkTnNVUkkgJiYgY2hpbGROc1ByZWZpeCkge1xyXG4gICAgICAgICAgICAgICAgICBpZiAobnNDb250ZXh0LmRlY2xhcmVOYW1lc3BhY2UoY2hpbGROc1ByZWZpeCwgY2hpbGROc1VSSSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZFhtbG5zQXR0cmliID0gJyB4bWxuczonICsgY2hpbGROc1ByZWZpeCArICc9XCInICsgY2hpbGROc1VSSSArICdcIic7XHJcbiAgICAgICAgICAgICAgICAgICAgeG1sbnNBdHRyaWIgKz0gY2hpbGRYbWxuc0F0dHJpYjtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgbGV0IHJlc29sdmVkQ2hpbGRTY2hlbWFPYmplY3Q7XHJcbiAgICAgICAgICAgICAgaWYgKGNoaWxkU2NoZW1hT2JqZWN0LiR0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHlwZVFOYW1lID0gc3BsaXRRTmFtZShjaGlsZFNjaGVtYU9iamVjdC4kdHlwZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHlwZVByZWZpeCA9IHR5cGVRTmFtZS5wcmVmaXg7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHlwZVVSSSA9IHNjaGVtYS54bWxuc1t0eXBlUHJlZml4XSB8fCBzZWxmLmRlZmluaXRpb25zLnhtbG5zW3R5cGVQcmVmaXhdO1xyXG4gICAgICAgICAgICAgICAgY2hpbGROc1VSSSA9IHR5cGVVUkk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZVVSSSAhPT0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hJyAmJiB0eXBlUHJlZml4ICE9PSBUTlNfUFJFRklYKSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vIEFkZCB0aGUgcHJlZml4L25hbWVzcGFjZSBtYXBwaW5nLCBidXQgbm90IGRlY2xhcmUgaXRcclxuICAgICAgICAgICAgICAgICAgbnNDb250ZXh0LmFkZE5hbWVzcGFjZSh0eXBlUHJlZml4LCB0eXBlVVJJKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc29sdmVkQ2hpbGRTY2hlbWFPYmplY3QgPVxyXG4gICAgICAgICAgICAgICAgICBzZWxmLmZpbmRTY2hlbWFUeXBlKHR5cGVRTmFtZS5uYW1lLCB0eXBlVVJJKSB8fCBjaGlsZFNjaGVtYU9iamVjdDtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZWRDaGlsZFNjaGVtYU9iamVjdCA9XHJcbiAgICAgICAgICAgICAgICAgIHNlbGYuZmluZFNjaGVtYU9iamVjdChjaGlsZE5zVVJJLCBjaGlsZE5hbWUpIHx8IGNoaWxkU2NoZW1hT2JqZWN0O1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgaWYgKGNoaWxkU2NoZW1hT2JqZWN0LiRiYXNlTmFtZVNwYWNlICYmIHRoaXMub3B0aW9ucy5pZ25vcmVCYXNlTmFtZVNwYWNlcykge1xyXG4gICAgICAgICAgICAgICAgY2hpbGROc1ByZWZpeCA9IG5zUHJlZml4O1xyXG4gICAgICAgICAgICAgICAgY2hpbGROc1VSSSA9IG5zVVJJO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5pZ25vcmVCYXNlTmFtZVNwYWNlcykge1xyXG4gICAgICAgICAgICAgICAgY2hpbGROc1ByZWZpeCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgY2hpbGROc1VSSSA9ICcnO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgbnMgPSBjaGlsZE5zUHJlZml4O1xyXG5cclxuICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZCkpIHtcclxuICAgICAgICAgICAgICAgIC8vZm9yIGFycmF5cywgd2UgbmVlZCB0byByZW1lbWJlciB0aGUgY3VycmVudCBuYW1lc3BhY2VcclxuICAgICAgICAgICAgICAgIGNoaWxkTnNQcmVmaXggPSB7XHJcbiAgICAgICAgICAgICAgICAgIGN1cnJlbnQ6IGNoaWxkTnNQcmVmaXgsXHJcbiAgICAgICAgICAgICAgICAgIHBhcmVudDogbnNcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vcGFyZW50IChhcnJheSkgYWxyZWFkeSBnb3QgdGhlIG5hbWVzcGFjZVxyXG4gICAgICAgICAgICAgICAgY2hpbGRYbWxuc0F0dHJpYiA9IG51bGw7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICB2YWx1ZSA9IHNlbGYub2JqZWN0VG9YTUwoY2hpbGQsIG5hbWUsIGNoaWxkTnNQcmVmaXgsIGNoaWxkTnNVUkksXHJcbiAgICAgICAgICAgICAgICBmYWxzZSwgY2hpbGRYbWxuc0F0dHJpYiwgcmVzb2x2ZWRDaGlsZFNjaGVtYU9iamVjdCwgbnNDb250ZXh0KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvYmpbc2VsZi5vcHRpb25zLmF0dHJpYnV0ZXNLZXldICYmIG9ialtzZWxmLm9wdGlvbnMuYXR0cmlidXRlc0tleV0ueHNpX3R5cGUpIHtcclxuICAgICAgICAgICAgICAvL2lmIHBhcmVudCBvYmplY3QgaGFzIGNvbXBsZXggdHlwZSBkZWZpbmVkIGFuZCBjaGlsZCBub3QgZm91bmQgaW4gcGFyZW50XHJcbiAgICAgICAgICAgICAgbGV0IGNvbXBsZXRlQ2hpbGRQYXJhbVR5cGVPYmplY3QgPSBzZWxmLmZpbmRDaGlsZFNjaGVtYU9iamVjdChcclxuICAgICAgICAgICAgICAgIG9ialtzZWxmLm9wdGlvbnMuYXR0cmlidXRlc0tleV0ueHNpX3R5cGUudHlwZSxcclxuICAgICAgICAgICAgICAgIG9ialtzZWxmLm9wdGlvbnMuYXR0cmlidXRlc0tleV0ueHNpX3R5cGUueG1sbnMpO1xyXG5cclxuICAgICAgICAgICAgICBub25TdWJOYW1lU3BhY2UgPSBvYmpbc2VsZi5vcHRpb25zLmF0dHJpYnV0ZXNLZXldLnhzaV90eXBlLnByZWZpeDtcclxuICAgICAgICAgICAgICBuc0NvbnRleHQuYWRkTmFtZXNwYWNlKG9ialtzZWxmLm9wdGlvbnMuYXR0cmlidXRlc0tleV0ueHNpX3R5cGUucHJlZml4LFxyXG4gICAgICAgICAgICAgICAgb2JqW3NlbGYub3B0aW9ucy5hdHRyaWJ1dGVzS2V5XS54c2lfdHlwZS54bWxucyk7XHJcbiAgICAgICAgICAgICAgdmFsdWUgPSBzZWxmLm9iamVjdFRvWE1MKGNoaWxkLCBuYW1lLCBvYmpbc2VsZi5vcHRpb25zLmF0dHJpYnV0ZXNLZXldLnhzaV90eXBlLnByZWZpeCxcclxuICAgICAgICAgICAgICAgIG9ialtzZWxmLm9wdGlvbnMuYXR0cmlidXRlc0tleV0ueHNpX3R5cGUueG1sbnMsIGZhbHNlLCBudWxsLCBudWxsLCBuc0NvbnRleHQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNoaWxkKSkge1xyXG4gICAgICAgICAgICAgICAgbmFtZSA9IG5vblN1Yk5hbWVTcGFjZSArIG5hbWU7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICB2YWx1ZSA9IHNlbGYub2JqZWN0VG9YTUwoY2hpbGQsIG5hbWUsIG5zUHJlZml4LCBuc1VSSSwgZmFsc2UsIG51bGwsIG51bGwsIG5zQ29udGV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gc2VsZi5vYmplY3RUb1hNTChjaGlsZCwgbmFtZSwgbnNQcmVmaXgsIG5zVVJJLCBmYWxzZSwgbnVsbCwgbnVsbCwgbnNDb250ZXh0KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG5zID0gbm9Db2xvbk5hbWVTcGFjZShucyk7XHJcbiAgICAgIGlmIChwcmVmaXhOYW1lc3BhY2UgJiYgIXF1YWxpZmllZCAmJiBpc0ZpcnN0ICYmICFzZWxmLm9wdGlvbnMub3ZlcnJpZGVSb290RWxlbWVudCkge1xyXG4gICAgICAgIG5zID0gbnNQcmVmaXg7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0lnbm9yZWROYW1lU3BhY2UobnMpKSB7XHJcbiAgICAgICAgbnMgPSAnJztcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IHVzZUVtcHR5VGFnID0gIXZhbHVlICYmIHNlbGYub3B0aW9ucy51c2VFbXB0eVRhZztcclxuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGNoaWxkKSkge1xyXG4gICAgICAgIC8vIHN0YXJ0IHRhZ1xyXG4gICAgICAgIHBhcnRzLnB1c2goWyc8JywgZW1wdHlOb25TdWJOYW1lU3BhY2UgPyAnJyA6IGFwcGVuZENvbG9uKG5vblN1Yk5hbWVTcGFjZSB8fCBucyksIG5hbWUsIGF0dHIsIHhtbG5zQXR0cmliLFxyXG4gICAgICAgICAgKGNoaWxkID09PSBudWxsID8gJyB4c2k6bmlsPVwidHJ1ZVwiJyA6ICcnKSxcclxuICAgICAgICAgIHVzZUVtcHR5VGFnID8gJyAvPicgOiAnPidcclxuICAgICAgICBdLmpvaW4oJycpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCF1c2VFbXB0eVRhZykge1xyXG4gICAgICAgIHBhcnRzLnB1c2godmFsdWUpO1xyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShjaGlsZCkpIHtcclxuICAgICAgICAgIC8vIGVuZCB0YWdcclxuICAgICAgICAgIHBhcnRzLnB1c2goWyc8LycsIGVtcHR5Tm9uU3ViTmFtZVNwYWNlID8gJycgOiBhcHBlbmRDb2xvbihub25TdWJOYW1lU3BhY2UgfHwgbnMpLCBuYW1lLCAnPiddLmpvaW4oJycpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9IGVsc2UgaWYgKG9iaiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBwYXJ0cy5wdXNoKChzZWxmLm9wdGlvbnMuZXNjYXBlWE1MKSA/IHhtbEVzY2FwZShvYmopIDogb2JqKTtcclxuICB9XHJcbiAgbnNDb250ZXh0LnBvcENvbnRleHQoKTtcclxuICByZXR1cm4gcGFydHMuam9pbignJyk7XHJcbn07XHJcblxyXG5XU0RMLnByb3RvdHlwZS5wcm9jZXNzQXR0cmlidXRlcyA9IGZ1bmN0aW9uIChjaGlsZCwgbnNDb250ZXh0KSB7XHJcbiAgbGV0IGF0dHIgPSAnJztcclxuXHJcbiAgaWYgKGNoaWxkID09PSBudWxsKSB7XHJcbiAgICBjaGlsZCA9IFtdO1xyXG4gIH1cclxuXHJcbiAgbGV0IGF0dHJPYmogPSBjaGlsZFt0aGlzLm9wdGlvbnMuYXR0cmlidXRlc0tleV07XHJcbiAgaWYgKGF0dHJPYmogJiYgYXR0ck9iai54c2lfdHlwZSkge1xyXG4gICAgbGV0IHhzaVR5cGUgPSBhdHRyT2JqLnhzaV90eXBlO1xyXG5cclxuICAgIGxldCBwcmVmaXggPSB4c2lUeXBlLnByZWZpeCB8fCB4c2lUeXBlLm5hbWVzcGFjZTtcclxuICAgIC8vIEdlbmVyYXRlIGEgbmV3IG5hbWVzcGFjZSBmb3IgY29tcGxleCBleHRlbnNpb24gaWYgb25lIG5vdCBwcm92aWRlZFxyXG4gICAgaWYgKCFwcmVmaXgpIHtcclxuICAgICAgcHJlZml4ID0gbnNDb250ZXh0LnJlZ2lzdGVyTmFtZXNwYWNlKHhzaVR5cGUueG1sbnMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbnNDb250ZXh0LmRlY2xhcmVOYW1lc3BhY2UocHJlZml4LCB4c2lUeXBlLnhtbG5zKTtcclxuICAgIH1cclxuICAgIHhzaVR5cGUucHJlZml4ID0gcHJlZml4O1xyXG4gIH1cclxuXHJcblxyXG4gIGlmIChhdHRyT2JqKSB7XHJcbiAgICBmb3IgKGxldCBhdHRyS2V5IGluIGF0dHJPYmopIHtcclxuICAgICAgLy9oYW5kbGUgY29tcGxleCBleHRlbnNpb24gc2VwYXJhdGVseVxyXG4gICAgICBpZiAoYXR0cktleSA9PT0gJ3hzaV90eXBlJykge1xyXG4gICAgICAgIGxldCBhdHRyVmFsdWUgPSBhdHRyT2JqW2F0dHJLZXldO1xyXG4gICAgICAgIGF0dHIgKz0gJyB4c2k6dHlwZT1cIicgKyBhdHRyVmFsdWUucHJlZml4ICsgJzonICsgYXR0clZhbHVlLnR5cGUgKyAnXCInO1xyXG4gICAgICAgIGF0dHIgKz0gJyB4bWxuczonICsgYXR0clZhbHVlLnByZWZpeCArICc9XCInICsgYXR0clZhbHVlLnhtbG5zICsgJ1wiJztcclxuXHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYXR0ciArPSAnICcgKyBhdHRyS2V5ICsgJz1cIicgKyB4bWxFc2NhcGUoYXR0ck9ialthdHRyS2V5XSkgKyAnXCInO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYXR0cjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBMb29rIHVwIGEgc2NoZW1hIHR5cGUgZGVmaW5pdGlvblxyXG4gKiBAcGFyYW0gbmFtZVxyXG4gKiBAcGFyYW0gbnNVUklcclxuICogQHJldHVybnMgeyp9XHJcbiAqL1xyXG5XU0RMLnByb3RvdHlwZS5maW5kU2NoZW1hVHlwZSA9IGZ1bmN0aW9uIChuYW1lLCBuc1VSSSkge1xyXG4gIGlmICghdGhpcy5kZWZpbml0aW9ucy5zY2hlbWFzIHx8ICFuYW1lIHx8ICFuc1VSSSkge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBsZXQgc2NoZW1hID0gdGhpcy5kZWZpbml0aW9ucy5zY2hlbWFzW25zVVJJXTtcclxuICBpZiAoIXNjaGVtYSB8fCAhc2NoZW1hLmNvbXBsZXhUeXBlcykge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gc2NoZW1hLmNvbXBsZXhUeXBlc1tuYW1lXTtcclxufTtcclxuXHJcbldTREwucHJvdG90eXBlLmZpbmRDaGlsZFNjaGVtYU9iamVjdCA9IGZ1bmN0aW9uIChwYXJhbWV0ZXJUeXBlT2JqLCBjaGlsZE5hbWUsIGJhY2t0cmFjZSkge1xyXG4gIGlmICghcGFyYW1ldGVyVHlwZU9iaiB8fCAhY2hpbGROYW1lKSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIGlmICghYmFja3RyYWNlKSB7XHJcbiAgICBiYWNrdHJhY2UgPSBbXTtcclxuICB9XHJcblxyXG4gIGlmIChiYWNrdHJhY2UuaW5kZXhPZihwYXJhbWV0ZXJUeXBlT2JqKSA+PSAwKSB7XHJcbiAgICAvLyBXZSd2ZSByZWN1cnNlZCBiYWNrIHRvIG91cnNlbHZlczsgYnJlYWsuXHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9IGVsc2Uge1xyXG4gICAgYmFja3RyYWNlID0gYmFja3RyYWNlLmNvbmNhdChbcGFyYW1ldGVyVHlwZU9ial0pO1xyXG4gIH1cclxuXHJcbiAgbGV0IGZvdW5kID0gbnVsbCxcclxuICAgIGkgPSAwLFxyXG4gICAgY2hpbGQsXHJcbiAgICByZWY7XHJcblxyXG4gIGlmIChBcnJheS5pc0FycmF5KHBhcmFtZXRlclR5cGVPYmouJGxvb2t1cFR5cGVzKSAmJiBwYXJhbWV0ZXJUeXBlT2JqLiRsb29rdXBUeXBlcy5sZW5ndGgpIHtcclxuICAgIGxldCB0eXBlcyA9IHBhcmFtZXRlclR5cGVPYmouJGxvb2t1cFR5cGVzO1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCB0eXBlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgdHlwZU9iaiA9IHR5cGVzW2ldO1xyXG5cclxuICAgICAgaWYgKHR5cGVPYmouJG5hbWUgPT09IGNoaWxkTmFtZSkge1xyXG4gICAgICAgIGZvdW5kID0gdHlwZU9iajtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbGV0IG9iamVjdCA9IHBhcmFtZXRlclR5cGVPYmo7XHJcbiAgaWYgKG9iamVjdC4kbmFtZSA9PT0gY2hpbGROYW1lICYmIG9iamVjdC5uYW1lID09PSAnZWxlbWVudCcpIHtcclxuICAgIHJldHVybiBvYmplY3Q7XHJcbiAgfVxyXG4gIGlmIChvYmplY3QuJHJlZikge1xyXG4gICAgcmVmID0gc3BsaXRRTmFtZShvYmplY3QuJHJlZik7XHJcbiAgICBpZiAocmVmLm5hbWUgPT09IGNoaWxkTmFtZSkge1xyXG4gICAgICByZXR1cm4gb2JqZWN0O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbGV0IGNoaWxkTnNVUkk7XHJcblxyXG4gIC8vIHdhbnQgdG8gYXZvaWQgdW5lY2Vzc2FyeSByZWN1cnNpb24gdG8gaW1wcm92ZSBwZXJmb3JtYW5jZVxyXG4gIGlmIChvYmplY3QuJHR5cGUgJiYgYmFja3RyYWNlLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgbGV0IHR5cGVJbmZvID0gc3BsaXRRTmFtZShvYmplY3QuJHR5cGUpO1xyXG4gICAgaWYgKHR5cGVJbmZvLnByZWZpeCA9PT0gVE5TX1BSRUZJWCkge1xyXG4gICAgICBjaGlsZE5zVVJJID0gcGFyYW1ldGVyVHlwZU9iai4kdGFyZ2V0TmFtZXNwYWNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2hpbGROc1VSSSA9IHRoaXMuZGVmaW5pdGlvbnMueG1sbnNbdHlwZUluZm8ucHJlZml4XTtcclxuICAgIH1cclxuICAgIGxldCB0eXBlRGVmID0gdGhpcy5maW5kU2NoZW1hVHlwZSh0eXBlSW5mby5uYW1lLCBjaGlsZE5zVVJJKTtcclxuICAgIGlmICh0eXBlRGVmKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmZpbmRDaGlsZFNjaGVtYU9iamVjdCh0eXBlRGVmLCBjaGlsZE5hbWUsIGJhY2t0cmFjZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAob2JqZWN0LmNoaWxkcmVuKSB7XHJcbiAgICBmb3IgKGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBvYmplY3QuY2hpbGRyZW5baV07IGkrKykge1xyXG4gICAgICBmb3VuZCA9IHRoaXMuZmluZENoaWxkU2NoZW1hT2JqZWN0KGNoaWxkLCBjaGlsZE5hbWUsIGJhY2t0cmFjZSk7XHJcbiAgICAgIGlmIChmb3VuZCkge1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoY2hpbGQuJGJhc2UpIHtcclxuICAgICAgICBsZXQgYmFzZVFOYW1lID0gc3BsaXRRTmFtZShjaGlsZC4kYmFzZSk7XHJcbiAgICAgICAgbGV0IGNoaWxkTmFtZVNwYWNlID0gYmFzZVFOYW1lLnByZWZpeCA9PT0gVE5TX1BSRUZJWCA/ICcnIDogYmFzZVFOYW1lLnByZWZpeDtcclxuICAgICAgICBjaGlsZE5zVVJJID0gY2hpbGQueG1sbnNbYmFzZVFOYW1lLnByZWZpeF0gfHwgdGhpcy5kZWZpbml0aW9ucy54bWxuc1tiYXNlUU5hbWUucHJlZml4XTtcclxuXHJcbiAgICAgICAgbGV0IGZvdW5kQmFzZSA9IHRoaXMuZmluZFNjaGVtYVR5cGUoYmFzZVFOYW1lLm5hbWUsIGNoaWxkTnNVUkkpO1xyXG5cclxuICAgICAgICBpZiAoZm91bmRCYXNlKSB7XHJcbiAgICAgICAgICBmb3VuZCA9IHRoaXMuZmluZENoaWxkU2NoZW1hT2JqZWN0KGZvdW5kQmFzZSwgY2hpbGROYW1lLCBiYWNrdHJhY2UpO1xyXG5cclxuICAgICAgICAgIGlmIChmb3VuZCkge1xyXG4gICAgICAgICAgICBmb3VuZC4kYmFzZU5hbWVTcGFjZSA9IGNoaWxkTmFtZVNwYWNlO1xyXG4gICAgICAgICAgICBmb3VuZC4kdHlwZSA9IGNoaWxkTmFtZVNwYWNlICsgJzonICsgY2hpbGROYW1lO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBpZiAoIWZvdW5kICYmIG9iamVjdC4kbmFtZSA9PT0gY2hpbGROYW1lKSB7XHJcbiAgICByZXR1cm4gb2JqZWN0O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZvdW5kO1xyXG59O1xyXG5cclxuV1NETC5wcm90b3R5cGUuX3BhcnNlID0gZnVuY3Rpb24gKHhtbCkge1xyXG4gIGxldCBzZWxmID0gdGhpcyxcclxuICAgIHAgPSBzYXgucGFyc2VyKHRydWUpLFxyXG4gICAgc3RhY2sgPSBbXSxcclxuICAgIHJvb3QgPSBudWxsLFxyXG4gICAgdHlwZXMgPSBudWxsLFxyXG4gICAgc2NoZW1hID0gbnVsbCxcclxuICAgIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XHJcblxyXG4gIHAub25vcGVudGFnID0gZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgIGxldCBuc05hbWUgPSBub2RlLm5hbWU7XHJcbiAgICBsZXQgYXR0cnMgPSBub2RlLmF0dHJpYnV0ZXM7XHJcblxyXG4gICAgbGV0IHRvcCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xyXG4gICAgbGV0IG5hbWU7XHJcbiAgICBpZiAodG9wKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgdG9wLnN0YXJ0RWxlbWVudChzdGFjaywgbnNOYW1lLCBhdHRycywgb3B0aW9ucyk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnN0cmljdCkge1xyXG4gICAgICAgICAgdGhyb3cgZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc3RhY2sucHVzaChuZXcgRWxlbWVudChuc05hbWUsIGF0dHJzLCBvcHRpb25zKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuYW1lID0gc3BsaXRRTmFtZShuc05hbWUpLm5hbWU7XHJcbiAgICAgIGlmIChuYW1lID09PSAnZGVmaW5pdGlvbnMnKSB7XHJcbiAgICAgICAgcm9vdCA9IG5ldyBEZWZpbml0aW9uc0VsZW1lbnQobnNOYW1lLCBhdHRycywgb3B0aW9ucyk7XHJcbiAgICAgICAgc3RhY2sucHVzaChyb290KTtcclxuICAgICAgfSBlbHNlIGlmIChuYW1lID09PSAnc2NoZW1hJykge1xyXG4gICAgICAgIC8vIFNoaW0gYSBzdHJ1Y3R1cmUgaW4gaGVyZSB0byBhbGxvdyB0aGUgcHJvcGVyIG9iamVjdHMgdG8gYmUgY3JlYXRlZCB3aGVuIG1lcmdpbmcgYmFjay5cclxuICAgICAgICByb290ID0gbmV3IERlZmluaXRpb25zRWxlbWVudCgnZGVmaW5pdGlvbnMnLCB7fSwge30pO1xyXG4gICAgICAgIHR5cGVzID0gbmV3IFR5cGVzRWxlbWVudCgndHlwZXMnLCB7fSwge30pO1xyXG4gICAgICAgIHNjaGVtYSA9IG5ldyBTY2hlbWFFbGVtZW50KG5zTmFtZSwgYXR0cnMsIG9wdGlvbnMpO1xyXG4gICAgICAgIHR5cGVzLmFkZENoaWxkKHNjaGVtYSk7XHJcbiAgICAgICAgcm9vdC5hZGRDaGlsZCh0eXBlcyk7XHJcbiAgICAgICAgc3RhY2sucHVzaChzY2hlbWEpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5leHBlY3RlZCByb290IGVsZW1lbnQgb2YgV1NETCBvciBpbmNsdWRlJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICBwLm9uY2xvc2V0YWcgPSBmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgbGV0IHRvcCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xyXG4gICAgYXNzZXJ0KHRvcCwgJ1VubWF0Y2hlZCBjbG9zZSB0YWc6ICcgKyBuYW1lKTtcclxuXHJcbiAgICB0b3AuZW5kRWxlbWVudChzdGFjaywgbmFtZSk7XHJcbiAgfTtcclxuXHJcbiAgcC53cml0ZSh4bWwpLmNsb3NlKCk7XHJcblxyXG4gIHJldHVybiByb290O1xyXG59O1xyXG5cclxuV1NETC5wcm90b3R5cGUuX2Zyb21YTUwgPSBmdW5jdGlvbiAoeG1sKSB7XHJcbiAgdGhpcy5kZWZpbml0aW9ucyA9IHRoaXMuX3BhcnNlKHhtbCk7XHJcbiAgdGhpcy5kZWZpbml0aW9ucy5kZXNjcmlwdGlvbnMgPSB7XHJcbiAgICB0eXBlczoge31cclxuICB9O1xyXG4gIHRoaXMueG1sID0geG1sO1xyXG59O1xyXG5cclxuV1NETC5wcm90b3R5cGUuX2Zyb21TZXJ2aWNlcyA9IGZ1bmN0aW9uIChzZXJ2aWNlcykge1xyXG5cclxufTtcclxuXHJcblxyXG5cclxuV1NETC5wcm90b3R5cGUuX3htbG5zTWFwID0gZnVuY3Rpb24gKCkge1xyXG4gIGxldCB4bWxucyA9IHRoaXMuZGVmaW5pdGlvbnMueG1sbnM7XHJcbiAgbGV0IHN0ciA9ICcnO1xyXG4gIGZvciAobGV0IGFsaWFzIGluIHhtbG5zKSB7XHJcbiAgICBpZiAoYWxpYXMgPT09ICcnIHx8IGFsaWFzID09PSBUTlNfUFJFRklYKSB7XHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfVxyXG4gICAgbGV0IG5zID0geG1sbnNbYWxpYXNdO1xyXG4gICAgc3dpdGNoIChucykge1xyXG4gICAgICBjYXNlIFwiaHR0cDovL3htbC5hcGFjaGUub3JnL3htbC1zb2FwXCI6IC8vIGFwYWNoZXNvYXBcclxuICAgICAgY2FzZSBcImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzZGwvXCI6IC8vIHdzZGxcclxuICAgICAgY2FzZSBcImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzZGwvc29hcC9cIjogLy8gd3NkbHNvYXBcclxuICAgICAgY2FzZSBcImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzZGwvc29hcDEyL1wiOiAvLyB3c2Rsc29hcDEyXHJcbiAgICAgIGNhc2UgXCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy9zb2FwL2VuY29kaW5nL1wiOiAvLyBzb2FwZW5jXHJcbiAgICAgIGNhc2UgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYVwiOiAvLyB4c2RcclxuICAgICAgICBjb250aW51ZTtcclxuICAgIH1cclxuICAgIGlmICh+bnMuaW5kZXhPZignaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvJykpIHtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcbiAgICBpZiAofm5zLmluZGV4T2YoJ2h0dHA6Ly93d3cudzMub3JnLycpKSB7XHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfVxyXG4gICAgaWYgKH5ucy5pbmRleE9mKCdodHRwOi8veG1sLmFwYWNoZS5vcmcvJykpIHtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcbiAgICBzdHIgKz0gJyB4bWxuczonICsgYWxpYXMgKyAnPVwiJyArIG5zICsgJ1wiJztcclxuICB9XHJcbiAgcmV0dXJuIHN0cjtcclxufTtcclxuXHJcbi8qXHJcbiAqIEhhdmUgYW5vdGhlciBmdW5jdGlvbiB0byBsb2FkIHByZXZpb3VzIFdTRExzIGFzIHdlXHJcbiAqIGRvbid0IHdhbnQgdGhpcyB0byBiZSBpbnZva2VkIGV4dGVybmFsbHkgKGV4cGVjdCBmb3IgdGVzdHMpXHJcbiAqIFRoaXMgd2lsbCBhdHRlbXB0IHRvIGZpeCBjaXJjdWxhciBkZXBlbmRlbmNpZXMgd2l0aCBYU0QgZmlsZXMsXHJcbiAqIEdpdmVuXHJcbiAqIC0gZmlsZS53c2RsXHJcbiAqICAgLSB4czppbXBvcnQgbmFtZXNwYWNlPVwiQVwiIHNjaGVtYUxvY2F0aW9uOiBBLnhzZFxyXG4gKiAtIEEueHNkXHJcbiAqICAgLSB4czppbXBvcnQgbmFtZXNwYWNlPVwiQlwiIHNjaGVtYUxvY2F0aW9uOiBCLnhzZFxyXG4gKiAtIEIueHNkXHJcbiAqICAgLSB4czppbXBvcnQgbmFtZXNwYWNlPVwiQVwiIHNjaGVtYUxvY2F0aW9uOiBBLnhzZFxyXG4gKiBmaWxlLndzZGwgd2lsbCBzdGFydCBsb2FkaW5nLCBpbXBvcnQgQSwgdGhlbiBBIHdpbGwgaW1wb3J0IEIsIHdoaWNoIHdpbGwgdGhlbiBpbXBvcnQgQVxyXG4gKiBCZWNhdXNlIEEgaGFzIGFscmVhZHkgc3RhcnRlZCB0byBsb2FkIHByZXZpb3VzbHkgaXQgd2lsbCBiZSByZXR1cm5lZCByaWdodCBhd2F5IGFuZFxyXG4gKiBoYXZlIGFuIGludGVybmFsIGNpcmN1bGFyIHJlZmVyZW5jZVxyXG4gKiBCIHdvdWxkIHRoZW4gY29tcGxldGUgbG9hZGluZywgdGhlbiBBLCB0aGVuIGZpbGUud3NkbFxyXG4gKiBCeSB0aGUgdGltZSBmaWxlIEEgc3RhcnRzIHByb2Nlc3NpbmcgaXRzIGluY2x1ZGVzIGl0cyBkZWZpbml0aW9ucyB3aWxsIGJlIGFscmVhZHkgbG9hZGVkLFxyXG4gKiB0aGlzIGlzIHRoZSBvbmx5IHRoaW5nIHRoYXQgQiB3aWxsIGRlcGVuZCBvbiB3aGVuIFwib3BlbmluZ1wiIEFcclxuICovXHJcbmZ1bmN0aW9uIG9wZW5fd3NkbF9yZWN1cnNpdmUodXJpLCBvcHRpb25zKTogUHJvbWlzZTxhbnk+IHtcclxuICBsZXQgZnJvbUNhY2hlLFxyXG4gICAgV1NETF9DQUNIRTtcclxuXHJcbiAgLy8gaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgLy8gICBjYWxsYmFjayA9IG9wdGlvbnM7XHJcbiAgLy8gICBvcHRpb25zID0ge307XHJcbiAgLy8gfVxyXG5cclxuICBXU0RMX0NBQ0hFID0gb3B0aW9ucy5XU0RMX0NBQ0hFO1xyXG5cclxuICBpZiAoZnJvbUNhY2hlID0gV1NETF9DQUNIRVt1cmldKSB7XHJcbiAgICAvLyByZXR1cm4gY2FsbGJhY2suY2FsbChmcm9tQ2FjaGUsIG51bGwsIGZyb21DYWNoZSk7XHJcbiAgICByZXR1cm4gZnJvbUNhY2hlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG9wZW5fd3NkbCh1cmksIG9wdGlvbnMpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gb3Blbl93c2RsKHVyaSwgb3B0aW9ucyk6IFByb21pc2U8YW55PiB7XHJcbiAgLy8gaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgLy8gICBjYWxsYmFjayA9IG9wdGlvbnM7XHJcbiAgLy8gICBvcHRpb25zID0ge307XHJcbiAgLy8gfVxyXG5cclxuICAvLyBpbml0aWFsaXplIGNhY2hlIHdoZW4gY2FsbGluZyBvcGVuX3dzZGwgZGlyZWN0bHlcclxuICBsZXQgV1NETF9DQUNIRSA9IG9wdGlvbnMuV1NETF9DQUNIRSB8fCB7fTtcclxuICBsZXQgcmVxdWVzdF9oZWFkZXJzID0gb3B0aW9ucy53c2RsX2hlYWRlcnM7XHJcbiAgbGV0IHJlcXVlc3Rfb3B0aW9ucyA9IG9wdGlvbnMud3NkbF9vcHRpb25zO1xyXG5cclxuICAvLyBsZXQgd3NkbDtcclxuICAvLyBpZiAoIS9eaHR0cHM/Oi8udGVzdCh1cmkpKSB7XHJcbiAgLy8gICAvLyBkZWJ1ZygnUmVhZGluZyBmaWxlOiAlcycsIHVyaSk7XHJcbiAgLy8gICAvLyBmcy5yZWFkRmlsZSh1cmksICd1dGY4JywgZnVuY3Rpb24oZXJyLCBkZWZpbml0aW9uKSB7XHJcbiAgLy8gICAvLyAgIGlmIChlcnIpIHtcclxuICAvLyAgIC8vICAgICBjYWxsYmFjayhlcnIpO1xyXG4gIC8vICAgLy8gICB9XHJcbiAgLy8gICAvLyAgIGVsc2Uge1xyXG4gIC8vICAgLy8gICAgIHdzZGwgPSBuZXcgV1NETChkZWZpbml0aW9uLCB1cmksIG9wdGlvbnMpO1xyXG4gIC8vICAgLy8gICAgIFdTRExfQ0FDSEVbIHVyaSBdID0gd3NkbDtcclxuICAvLyAgIC8vICAgICB3c2RsLldTRExfQ0FDSEUgPSBXU0RMX0NBQ0hFO1xyXG4gIC8vICAgLy8gICAgIHdzZGwub25SZWFkeShjYWxsYmFjayk7XHJcbiAgLy8gICAvLyAgIH1cclxuICAvLyAgIC8vIH0pO1xyXG4gIC8vIH1cclxuICAvLyBlbHNlIHtcclxuICAvLyAgIGRlYnVnKCdSZWFkaW5nIHVybDogJXMnLCB1cmkpO1xyXG4gIC8vICAgbGV0IGh0dHBDbGllbnQgPSBvcHRpb25zLmh0dHBDbGllbnQgfHwgbmV3IEh0dHBDbGllbnQob3B0aW9ucyk7XHJcbiAgLy8gICBodHRwQ2xpZW50LnJlcXVlc3QodXJpLCBudWxsIC8qIG9wdGlvbnMgKi8sIGZ1bmN0aW9uKGVyciwgcmVzcG9uc2UsIGRlZmluaXRpb24pIHtcclxuICAvLyAgICAgaWYgKGVycikge1xyXG4gIC8vICAgICAgIGNhbGxiYWNrKGVycik7XHJcbiAgLy8gICAgIH0gZWxzZSBpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9PT0gMjAwKSB7XHJcbiAgLy8gICAgICAgd3NkbCA9IG5ldyBXU0RMKGRlZmluaXRpb24sIHVyaSwgb3B0aW9ucyk7XHJcbiAgLy8gICAgICAgV1NETF9DQUNIRVsgdXJpIF0gPSB3c2RsO1xyXG4gIC8vICAgICAgIHdzZGwuV1NETF9DQUNIRSA9IFdTRExfQ0FDSEU7XHJcbiAgLy8gICAgICAgd3NkbC5vblJlYWR5KGNhbGxiYWNrKTtcclxuICAvLyAgICAgfSBlbHNlIHtcclxuICAvLyAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoJ0ludmFsaWQgV1NETCBVUkw6ICcgKyB1cmkgKyBcIlxcblxcblxcciBDb2RlOiBcIiArIHJlc3BvbnNlLnN0YXR1c0NvZGUgKyBcIlxcblxcblxcciBSZXNwb25zZSBCb2R5OiBcIiArIHJlc3BvbnNlLmJvZHkpKTtcclxuICAvLyAgICAgfVxyXG4gIC8vICAgfSwgcmVxdWVzdF9oZWFkZXJzLCByZXF1ZXN0X29wdGlvbnMpO1xyXG4gIC8vIH1cclxuICAvLyByZXR1cm4gd3NkbDtcclxuXHJcbiAgY29uc3QgaHR0cENsaWVudDogSHR0cENsaWVudCA9IG9wdGlvbnMuaHR0cENsaWVudDtcclxuICBjb25zdCB3c2RsRGVmID0gYXdhaXQgaHR0cENsaWVudC5nZXQodXJpLCB7IHJlc3BvbnNlVHlwZTogJ3RleHQnIH0pLnRvUHJvbWlzZSgpO1xyXG4gIGNvbnN0IHdzZGxPYmogPSBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgY29uc3Qgd3NkbCA9IG5ldyBXU0RMKHdzZGxEZWYsIHVyaSwgb3B0aW9ucyk7XHJcbiAgICBXU0RMX0NBQ0hFW3VyaV0gPSB3c2RsO1xyXG4gICAgd3NkbC5XU0RMX0NBQ0hFID0gV1NETF9DQUNIRTtcclxuICAgIHdzZGwub25SZWFkeShyZXNvbHZlKHdzZGwpKTtcclxuICB9KTtcclxuICByZXR1cm4gd3NkbE9iajtcclxufVxyXG4iXX0=