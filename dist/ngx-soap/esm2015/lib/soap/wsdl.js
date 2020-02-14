/*
 * Copyright (c) 2011 Vinay Pulim <vinay@milewise.com>
 * MIT Licensed
 *
 */
/*jshint proto:true*/
"use strict";
import { __awaiter } from "tslib";
import * as sax from 'sax';
import { NamespaceContext } from './nscontext';
import * as url from 'url';
import { ok as assert } from 'assert';
// import stripBom from 'strip-bom';
const stripBom = (x) => {
    // Catches EFBBBF (UTF-8 BOM) because the buffer-to-string
    // conversion translates it to FEFF (UTF-16 BOM)
    if (x.charCodeAt(0) === 0xFEFF) {
        return x.slice(1);
    }
    return x;
};
import * as _ from 'lodash';
import * as utils from './utils';
let TNS_PREFIX = utils.TNS_PREFIX;
let findPrefix = utils.findPrefix;
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
function splitQName(nsName) {
    let i = typeof nsName === 'string' ? nsName.indexOf(':') : -1;
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
let trimLeft = /^[\s\xA0]+/;
let trimRight = /[\s\xA0]+$/;
function trim(text) {
    return text.replace(trimLeft, '').replace(trimRight, '');
}
function deepMerge(destination, source) {
    return _.mergeWith(destination || {}, source, function (a, b) {
        return _.isArray(a) ? a.concat(b) : undefined;
    });
}
let Element = function (nsName, attrs, options) {
    let parts = splitQName(nsName);
    this.nsName = nsName;
    this.prefix = parts.prefix;
    this.name = parts.name;
    this.children = [];
    this.xmlns = {};
    this._initializeOptions(options);
    for (let key in attrs) {
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
    let ChildClass = this.allowedChildren[splitQName(nsName).name], element = null;
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
    let root = this;
    let subElement = function () {
        root.apply(this, arguments);
        this.init();
    };
    // inherits(subElement, root);
    subElement.prototype.__proto__ = root.prototype;
    return subElement;
};
let ElementElement = Element.createSubClass();
let AnyElement = Element.createSubClass();
let InputElement = Element.createSubClass();
let OutputElement = Element.createSubClass();
let SimpleTypeElement = Element.createSubClass();
let RestrictionElement = Element.createSubClass();
let ExtensionElement = Element.createSubClass();
let ChoiceElement = Element.createSubClass();
let EnumerationElement = Element.createSubClass();
let ComplexTypeElement = Element.createSubClass();
let ComplexContentElement = Element.createSubClass();
let SimpleContentElement = Element.createSubClass();
let SequenceElement = Element.createSubClass();
let AllElement = Element.createSubClass();
let MessageElement = Element.createSubClass();
let DocumentationElement = Element.createSubClass();
let SchemaElement = Element.createSubClass();
let TypesElement = Element.createSubClass();
let OperationElement = Element.createSubClass();
let PortTypeElement = Element.createSubClass();
let BindingElement = Element.createSubClass();
let PortElement = Element.createSubClass();
let ServiceElement = Element.createSubClass();
let DefinitionsElement = Element.createSubClass();
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
function mapElementTypes(types) {
    let rtn = {};
    types = types.split(' ');
    types.forEach(function (type) {
        rtn[type.replace(/^_/, '')] = (ElementTypeMap[type] || [Element])[0];
    });
    return rtn;
}
for (let n in ElementTypeMap) {
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
    let part = null;
    let child = undefined;
    let children = this.children || [];
    let ns = undefined;
    let nsName = undefined;
    let i = undefined;
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
        let lookupTypes = [], elementChildren;
        delete this.parts;
        nsName = splitQName(part.$element);
        ns = nsName.prefix;
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
            let schemaXmlns = definitions.schemas[this.element.targetNamespace].xmlns;
            for (i = 0; i < lookupTypes.length; i++) {
                lookupTypes[i] = this._createLookupTypeObject(lookupTypes[i], schemaXmlns);
            }
        }
        this.element.$lookupTypes = lookupTypes;
        if (this.element.$type) {
            type = splitQName(this.element.$type);
            let typeNs = schema.xmlns && schema.xmlns[type.prefix] || definitions.xmlns[type.prefix];
            if (typeNs) {
                if (type.name in Primitives) {
                    // this.element = this.element.$type;
                }
                else {
                    // first check local mapping of ns alias to namespace
                    schema = definitions.schemas[typeNs];
                    let ctype = schema.complexTypes[type.name] || schema.types[type.name] || schema.elements[type.name];
                    if (ctype) {
                        this.parts = ctype.description(definitions, schema.xmlns);
                    }
                }
            }
        }
        else {
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
    let splittedNSString = splitQName(nsString), nsAlias = splittedNSString.prefix, splittedName = splittedNSString.name.split('#'), type = splittedName[0], name = splittedName[1], lookupTypeObj = {};
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
    let resolvedType = '^', excluded = this.ignoredNamespaces.concat('xs'); // do not process $type values wich start with
    if (element.hasOwnProperty('$type') && typeof element.$type === 'string') {
        if (excluded.indexOf(element.$type.split(':')[0]) === -1) {
            resolvedType += ('_' + element.$type + '#' + element.$name);
        }
    }
    if (element.children.length > 0) {
        let self = this;
        element.children.forEach(function (child) {
            let resolvedChildType = self._getNestedLookupTypeString(child).replace(/\^_/, '');
            if (resolvedChildType && typeof resolvedChildType === 'string') {
                resolvedType += ('_' + resolvedChildType);
            }
        });
    }
    return resolvedType;
};
OperationElement.prototype.postProcess = function (definitions, tag) {
    let children = this.children;
    for (let i = 0, child; child = children[i]; i++) {
        if (child.name !== 'input' && child.name !== 'output')
            continue;
        if (tag === 'binding') {
            this[child.name] = child;
            children.splice(i--, 1);
            continue;
        }
        let messageName = splitQName(child.$message).name;
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
    let type = splitQName(this.$type).name, portType = definitions.portTypes[type], style = this.style, children = this.children;
    if (portType) {
        portType.postProcess(definitions);
        this.methods = portType.methods;
        for (let i = 0, child; child = children[i]; i++) {
            if (child.name !== 'operation')
                continue;
            child.postProcess(definitions, 'binding');
            children.splice(i--, 1);
            child.style || (child.style = style);
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
    let children = this.children, bindings = definitions.bindings;
    if (children && children.length > 0) {
        for (let i = 0, child; child = children[i]; i++) {
            if (child.name !== 'port')
                continue;
            let bindingName = splitQName(child.$binding).name;
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
    let children = this.children;
    for (let i = 0, child; child = children[i]; i++) {
        if (child instanceof RestrictionElement)
            return this.$name + "|" + child.description();
    }
    return {};
};
RestrictionElement.prototype.description = function (definitions, xmlns) {
    let children = this.children;
    let desc;
    for (let i = 0, child; child = children[i]; i++) {
        if (child instanceof SequenceElement ||
            child instanceof ChoiceElement) {
            desc = child.description(definitions, xmlns);
            break;
        }
    }
    if (desc && this.$base) {
        let type = splitQName(this.$base), typeName = type.name, ns = xmlns && xmlns[type.prefix] || definitions.xmlns[type.prefix], schema = definitions.schemas[ns], typeElement = schema && (schema.complexTypes[typeName] || schema.types[typeName] || schema.elements[typeName]);
        desc.getBase = function () {
            return typeElement.description(definitions, schema.xmlns);
        };
        return desc;
    }
    // then simple element
    let base = this.$base ? this.$base + "|" : "";
    return base + this.children.map(function (child) {
        return child.description();
    }).join(",");
};
ExtensionElement.prototype.description = function (definitions, xmlns) {
    let children = this.children;
    let desc = {};
    for (let i = 0, child; child = children[i]; i++) {
        if (child instanceof SequenceElement ||
            child instanceof ChoiceElement) {
            desc = child.description(definitions, xmlns);
        }
    }
    if (this.$base) {
        let type = splitQName(this.$base), typeName = type.name, ns = xmlns && xmlns[type.prefix] || definitions.xmlns[type.prefix], schema = definitions.schemas[ns];
        if (typeName in Primitives) {
            return this.$base;
        }
        else {
            let typeElement = schema && (schema.complexTypes[typeName] ||
                schema.types[typeName] || schema.elements[typeName]);
            if (typeElement) {
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
    let children = this.children;
    for (let i = 0, child; child = children[i]; i++) {
        if (child instanceof ExtensionElement) {
            return child.description(definitions, xmlns);
        }
    }
    return {};
};
SimpleContentElement.prototype.description = function (definitions, xmlns) {
    let children = this.children;
    for (let i = 0, child; child = children[i]; i++) {
        if (child instanceof ExtensionElement) {
            return child.description(definitions, xmlns);
        }
    }
    return {};
};
ElementElement.prototype.description = function (definitions, xmlns) {
    let element = {}, name = this.$name;
    let isMany = !this.$maxOccurs ? false : (isNaN(this.$maxOccurs) ? (this.$maxOccurs === 'unbounded') : (this.$maxOccurs > 1));
    if (this.$minOccurs !== this.$maxOccurs && isMany) {
        name += '[]';
    }
    if (xmlns && xmlns[TNS_PREFIX]) {
        this.$targetNamespace = xmlns[TNS_PREFIX];
    }
    let type = this.$type || this.$ref;
    if (type) {
        type = splitQName(type);
        let typeName = type.name, ns = xmlns && xmlns[type.prefix] || definitions.xmlns[type.prefix], schema = definitions.schemas[ns], typeElement = schema && (this.$type ? schema.complexTypes[typeName] || schema.types[typeName] : schema.elements[typeName]);
        if (ns && definitions.schemas[ns]) {
            xmlns = definitions.schemas[ns].xmlns;
        }
        if (typeElement && !(typeName in Primitives)) {
            if (!(typeName in definitions.descriptions.types)) {
                let elem = {};
                definitions.descriptions.types[typeName] = elem;
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
        let children = this.children;
        let sequence = {};
        for (let i = 0, child; child = children[i]; i++) {
            if (child instanceof AnyElement) {
                continue;
            }
            let description = child.description(definitions, xmlns);
            for (let key in description) {
                sequence[key] = description[key];
            }
        }
        return sequence;
    };
ChoiceElement.prototype.description = function (definitions, xmlns) {
    let children = this.children;
    let choice = {};
    for (let i = 0, child; child = children[i]; i++) {
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
    let desc = {};
    desc[this.$name] = this.parts;
    return desc;
};
PortTypeElement.prototype.description = function (definitions) {
    let methods = {};
    for (let name in this.methods) {
        let method = this.methods[name];
        methods[name] = method.description(definitions);
    }
    return methods;
};
OperationElement.prototype.description = function (definitions) {
    let inputDesc = this.input ? this.input.description(definitions) : null;
    let outputDesc = this.output ? this.output.description(definitions) : null;
    return {
        input: inputDesc && inputDesc[Object.keys(inputDesc)[0]],
        output: outputDesc && outputDesc[Object.keys(outputDesc)[0]]
    };
};
BindingElement.prototype.description = function (definitions) {
    let methods = {};
    for (let name in this.methods) {
        let method = this.methods[name];
        methods[name] = method.description(definitions);
    }
    return methods;
};
ServiceElement.prototype.description = function (definitions) {
    let ports = {};
    for (let name in this.ports) {
        let port = this.ports[name];
        ports[name] = port.binding.description(definitions);
    }
    return ports;
};
export let WSDL = function (definition, uri, options) {
    let self = this, fromFunc;
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
            let services = self.services = self.definitions.services;
            if (services) {
                for (const name in services) {
                    services[name].postProcess(self.definitions);
                }
            }
            let complexTypes = self.definitions.complexTypes;
            if (complexTypes) {
                for (const name in complexTypes) {
                    complexTypes[name].deleteFixedAttrs();
                }
            }
            // for document style, for every binding, prepare input message element name to (methodName, output message element name) mapping
            let bindings = self.definitions.bindings;
            for (let bindingName in bindings) {
                let binding = bindings[bindingName];
                if (typeof binding.style === 'undefined') {
                    binding.style = 'document';
                }
                if (binding.style !== 'document')
                    continue;
                let methods = binding.methods;
                let topEls = binding.topElements = {};
                for (let methodName in methods) {
                    if (methods[methodName].input) {
                        let inputName = methods[methodName].input.$name;
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
    return __awaiter(this, void 0, void 0, function* () {
        let self = this, include = includes.shift(), options;
        if (!include)
            return; // callback();
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
    return __awaiter(this, void 0, void 0, function* () {
        let schemas = this.definitions.schemas, includes = [];
        for (let ns in schemas) {
            let schema = schemas[ns];
            includes = includes.concat(schema.includes || []);
        }
        return this._processNextInclude(includes);
    });
};
WSDL.prototype.describeServices = function () {
    let services = {};
    for (let name in this.services) {
        let service = this.services[name];
        services[name] = service.description(this.definitions);
    }
    return services;
};
WSDL.prototype.toXML = function () {
    return this.xml || '';
};
WSDL.prototype.xmlToObject = function (xml, callback) {
    let self = this;
    let p = typeof callback === 'function' ? {} : sax.parser(true);
    let objectName = null;
    let root = {};
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
    let stack = [{ name: null, object: root, schema: schema }];
    let xmlns = {};
    let refs = {}, id; // {id:{hrefs:[],obj:}, ...}
    p.onopentag = function (node) {
        let nsName = node.name;
        let attrs = node.attributes;
        let name = splitQName(nsName).name, attributeName, top = stack[stack.length - 1], topSchema = top.schema, elementAttributes = {}, hasNonXmlnsAttribute = false, hasNilAttribute = false, obj = {};
        let originalName = name;
        if (!objectName && top.name === 'Body' && name !== 'Fault') {
            let message = self.definitions.messages[name];
            // Support RPC/literal messages where response body contains one element named
            // after the operation + 'Response'. See http://www.w3.org/TR/wsdl#_names
            if (!message) {
                try {
                    // Determine if this is request or response
                    let isInput = false;
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
                    let portTypes = self.definitions.portTypes;
                    let portTypeNames = Object.keys(portTypes);
                    // Currently this supports only one portType definition.
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
        let xsiTypeSchema;
        let xsiType = elementAttributes['xsi:type'];
        if (xsiType) {
            let type = splitQName(xsiType);
            let typeURI;
            if (type.prefix === TNS_PREFIX) {
                // In case of xsi:type = "MyType"
                typeURI = xmlns[type.prefix] || xmlns.xmlns;
            }
            else {
                typeURI = xmlns[type.prefix];
            }
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
        let cur = stack.pop(), obj = cur.object, top = stack[stack.length - 1], topObject = top.object, topSchema = top.schema, name = splitQName(nsName).name;
        if (typeof cur.schema === 'string' && (cur.schema === 'string' || cur.schema.split(':')[1] === 'string')) {
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
        let originalText = text;
        text = trim(text);
        if (!text.length) {
            return;
        }
        if (/<\?xml[\s\S]+\?>/.test(text)) {
            let top = stack[stack.length - 1];
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
        let originalText = text;
        text = trim(text);
        if (!text.length) {
            return;
        }
        let top = stack[stack.length - 1];
        let name = splitQName(top.schema).name, value;
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
    function finish() {
        // MultiRef support: merge objects instead of replacing
        for (let n in refs) {
            let ref = refs[n];
            for (let i = 0; i < ref.hrefs.length; i++) {
                _.assign(ref.hrefs[i].obj, ref.obj);
            }
        }
        if (root.Envelope) {
            let body = root.Envelope.Body;
            let error;
            if (body && body.Fault) {
                if (!body.Fault.Code) {
                    let code = body.Fault.faultcode && body.Fault.faultcode.$value;
                    let string = body.Fault.faultstring && body.Fault.faultstring.$value;
                    let detail = body.Fault.detail && body.Fault.detail.$value;
                    code = code || body.Fault.faultcode;
                    string = string || body.Fault.faultstring;
                    detail = detail || body.Fault.detail;
                    error = new Error(code + ': ' + string + (detail ? ': ' + detail : ''));
                }
                else {
                    let code = body.Fault.Code.Value;
                    let string = body.Fault.Reason.Text.$value;
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
    let def = null;
    if (this.definitions.schemas) {
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
    let args = {};
    args[name] = params;
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
    let parts = [];
    let defs = this.definitions;
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
            let value = params[key];
            let prefixedKey = (isParts ? '' : nsPrefix) + key;
            let attributes = [];
            if (typeof value === 'object' && value.hasOwnProperty(this.options.attributesKey)) {
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
function appendColon(ns) {
    return (ns && ns.charAt(ns.length - 1) !== ':') ? ns + ':' : ns;
}
function noColonNameSpace(ns) {
    return (ns && ns.charAt(ns.length - 1) === ':') ? ns.substring(0, ns.length - 1) : ns;
}
WSDL.prototype.isIgnoredNameSpace = function (ns) {
    return this.options.ignoredNamespaces.indexOf(ns) > -1;
};
WSDL.prototype.filterOutIgnoredNameSpace = function (ns) {
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
    let self = this;
    let schema = this.definitions.schemas[nsURI];
    let parentNsPrefix = nsPrefix ? nsPrefix.parent : undefined;
    if (typeof parentNsPrefix !== 'undefined') {
        //we got the parentNsPrefix for our array. setting the namespace-letiable back to the current namespace string
        nsPrefix = nsPrefix.current;
    }
    parentNsPrefix = noColonNameSpace(parentNsPrefix);
    if (this.isIgnoredNameSpace(parentNsPrefix)) {
        parentNsPrefix = '';
    }
    let soapHeader = !schema;
    let qualified = schema && schema.$elementFormDefault === 'qualified';
    let parts = [];
    let prefixNamespace = (nsPrefix || qualified) && nsPrefix !== TNS_PREFIX;
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
    let ns = '';
    if (self.options.overrideRootElement && isFirst) {
        ns = self.options.overrideRootElement.namespace;
    }
    else if (prefixNamespace && (qualified || isFirst || soapHeader) && !this.isIgnoredNameSpace(nsPrefix)) {
        ns = nsPrefix;
    }
    let i, n;
    // start building out XML string.
    if (Array.isArray(obj)) {
        for (i = 0, n = obj.length; i < n; i++) {
            let item = obj[i];
            let arrayAttr = self.processAttributes(item, nsContext), correctOuterNsPrefix = parentNsPrefix || ns; //using the parent namespace prefix if given
            let body = self.objectToXML(item, name, nsPrefix, nsURI, false, null, schemaObject, nsContext);
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
            let child = obj[name];
            if (typeof child === 'undefined') {
                continue;
            }
            let attr = self.processAttributes(child, nsContext);
            let value = '';
            let nonSubNameSpace = '';
            let emptyNonSubNameSpace = false;
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
                        let childSchemaObject = self.findChildSchemaObject(schemaObject, name);
                        //find sub namespace if not a primitive
                        if (childSchemaObject &&
                            ((childSchemaObject.$type && (childSchemaObject.$type.indexOf('xsd:') === -1)) ||
                                childSchemaObject.$ref || childSchemaObject.$name)) {
                            /*if the base name space of the children is not in the ingoredSchemaNamspaces we use it.
                             This is because in some services the child nodes do not need the baseNameSpace.
                             */
                            let childNsPrefix = '';
                            let childName = '';
                            let childNsURI;
                            let childXmlnsAttrib = '';
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
                            let resolvedChildSchemaObject;
                            if (childSchemaObject.$type) {
                                let typeQName = splitQName(childSchemaObject.$type);
                                let typePrefix = typeQName.prefix;
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
    let attr = '';
    if (child === null) {
        child = [];
    }
    let attrObj = child[this.options.attributesKey];
    if (attrObj && attrObj.xsi_type) {
        let xsiType = attrObj.xsi_type;
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
    let found = null, i = 0, child, ref;
    if (Array.isArray(parameterTypeObj.$lookupTypes) && parameterTypeObj.$lookupTypes.length) {
        let types = parameterTypeObj.$lookupTypes;
        for (i = 0; i < types.length; i++) {
            let typeObj = types[i];
            if (typeObj.$name === childName) {
                found = typeObj;
                break;
            }
        }
    }
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
    let childNsURI;
    // want to avoid unecessary recursion to improve performance
    if (object.$type && backtrace.length === 1) {
        let typeInfo = splitQName(object.$type);
        if (typeInfo.prefix === TNS_PREFIX) {
            childNsURI = parameterTypeObj.$targetNamespace;
        }
        else {
            childNsURI = this.definitions.xmlns[typeInfo.prefix];
        }
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
                let baseQName = splitQName(child.$base);
                let childNameSpace = baseQName.prefix === TNS_PREFIX ? '' : baseQName.prefix;
                childNsURI = child.xmlns[baseQName.prefix] || this.definitions.xmlns[baseQName.prefix];
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
    let self = this, p = sax.parser(true), stack = [], root = null, types = null, schema = null, options = self.options;
    p.onopentag = function (node) {
        let nsName = node.name;
        let attrs = node.attributes;
        let top = stack[stack.length - 1];
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
    let xmlns = this.definitions.xmlns;
    let str = '';
    for (let alias in xmlns) {
        if (alias === '' || alias === TNS_PREFIX) {
            continue;
        }
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
function open_wsdl_recursive(uri, options) {
    let fromCache, WSDL_CACHE;
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
export function open_wsdl(uri, options) {
    return __awaiter(this, void 0, void 0, function* () {
        // if (typeof options === 'function') {
        //   callback = options;
        //   options = {};
        // }
        // initialize cache when calling open_wsdl directly
        let WSDL_CACHE = options.WSDL_CACHE || {};
        let request_headers = options.wsdl_headers;
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
        const httpClient = options.httpClient;
        const wsdlDef = yield httpClient.get(uri, { responseType: 'text' }).toPromise();
        const wsdlObj = yield new Promise((resolve) => {
            const wsdl = new WSDL(wsdlDef, uri, options);
            WSDL_CACHE[uri] = wsdl;
            wsdl.WSDL_CACHE = WSDL_CACHE;
            wsdl.onReady(resolve(wsdl));
        });
        //console.log("wsdl", wsdlObj)
        return wsdlObj;
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3NkbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb2FwLyIsInNvdXJjZXMiOlsibGliL3NvYXAvd3NkbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztHQUlHO0FBQ0gscUJBQXFCO0FBRXJCLFlBQVksQ0FBQzs7QUFFYixPQUFPLEtBQUssR0FBRyxNQUFNLEtBQUssQ0FBQztBQUUzQixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTyxhQUFhLENBQUM7QUFFaEQsT0FBTyxLQUFLLEdBQUcsTUFBTSxLQUFLLENBQUM7QUFDM0IsT0FBTyxFQUFFLEVBQUUsSUFBSSxNQUFNLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDdEMsb0NBQW9DO0FBRXBDLE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBUyxFQUFVLEVBQUU7SUFDckMsMERBQTBEO0lBQzFELGdEQUFnRDtJQUNoRCxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssTUFBTSxFQUFFO1FBQzlCLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNuQjtJQUVELE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQyxDQUFBO0FBRUQsT0FBTyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxLQUFLLEtBQUssTUFBTSxTQUFTLENBQUM7QUFHakMsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztBQUNsQyxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO0FBRWxDLElBQUksVUFBVSxHQUFHO0lBQ2YsTUFBTSxFQUFFLENBQUM7SUFDVCxPQUFPLEVBQUUsQ0FBQztJQUNWLE9BQU8sRUFBRSxDQUFDO0lBQ1YsS0FBSyxFQUFFLENBQUM7SUFDUixNQUFNLEVBQUUsQ0FBQztJQUNULE9BQU8sRUFBRSxDQUFDO0lBQ1YsSUFBSSxFQUFFLENBQUM7SUFDUCxHQUFHLEVBQUUsQ0FBQztJQUNOLElBQUksRUFBRSxDQUFDO0lBQ1AsS0FBSyxFQUFFLENBQUM7SUFDUixlQUFlLEVBQUUsQ0FBQztJQUNsQixrQkFBa0IsRUFBRSxDQUFDO0lBQ3JCLGVBQWUsRUFBRSxDQUFDO0lBQ2xCLGtCQUFrQixFQUFFLENBQUM7SUFDckIsWUFBWSxFQUFFLENBQUM7SUFDZixXQUFXLEVBQUUsQ0FBQztJQUNkLFlBQVksRUFBRSxDQUFDO0lBQ2YsYUFBYSxFQUFFLENBQUM7SUFDaEIsUUFBUSxFQUFFLENBQUM7SUFDWCxRQUFRLEVBQUUsQ0FBQztJQUNYLElBQUksRUFBRSxDQUFDO0lBQ1AsSUFBSSxFQUFFLENBQUM7SUFDUCxVQUFVLEVBQUUsQ0FBQztJQUNiLEtBQUssRUFBRSxDQUFDO0lBQ1IsU0FBUyxFQUFFLENBQUM7SUFDWixJQUFJLEVBQUUsQ0FBQztJQUNQLE1BQU0sRUFBRSxDQUFDO0lBQ1QsU0FBUyxFQUFFLENBQUM7SUFDWixZQUFZLEVBQUUsQ0FBQztJQUNmLE1BQU0sRUFBRSxDQUFDO0lBQ1QsS0FBSyxFQUFFLENBQUM7SUFDUixRQUFRLEVBQUUsQ0FBQztDQUNaLENBQUM7QUFFRixTQUFTLFVBQVUsQ0FBQyxNQUFNO0lBQ3hCLElBQUksQ0FBQyxHQUFHLE9BQU8sTUFBTSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDbkQsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDdEUsQ0FBQztBQUVELFNBQVMsU0FBUyxDQUFDLEdBQUc7SUFDcEIsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUSxFQUFFO1FBQzdCLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssV0FBVyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQUU7WUFDaEUsT0FBTyxHQUFHLENBQUM7U0FDWjtRQUNELE9BQU8sR0FBRzthQUNQLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDO2FBQ3RCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO2FBQ3JCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO2FBQ3JCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDO2FBQ3ZCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDNUI7SUFFRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCxJQUFJLFFBQVEsR0FBRyxZQUFZLENBQUM7QUFDNUIsSUFBSSxTQUFTLEdBQUcsWUFBWSxDQUFDO0FBRTdCLFNBQVMsSUFBSSxDQUFDLElBQUk7SUFDaEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFFRCxTQUFTLFNBQVMsQ0FBQyxXQUFXLEVBQUUsTUFBTTtJQUNwQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxJQUFJLEVBQUUsRUFBRSxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQUUsQ0FBQztRQUMxRCxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNoRCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxJQUFJLE9BQU8sR0FBUSxVQUFVLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTztJQUNqRCxJQUFJLEtBQUssR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFL0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQzNCLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztJQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUVoQixJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFakMsS0FBSyxJQUFJLEdBQUcsSUFBSSxLQUFLLEVBQUU7UUFDckIsSUFBSSxLQUFLLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0QyxJQUFJLEtBQUssRUFBRTtZQUNULElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUMzRDthQUNJO1lBQ0gsSUFBSSxHQUFHLEtBQUssT0FBTyxFQUFFO2dCQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNsQztpQkFBTTtnQkFDTCxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUM5QjtTQUNGO0tBQ0Y7SUFDRCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsS0FBSyxTQUFTLEVBQUU7UUFDdkMscUNBQXFDO1FBQ3JDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO0tBQ2hEO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsT0FBTyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsR0FBRyxVQUFVLE9BQU87SUFDdEQsSUFBSSxPQUFPLEVBQUU7UUFDWCxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDO1FBQzdDLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUM7UUFDdkMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsSUFBSSxFQUFFLENBQUM7S0FDMUQ7U0FBTTtRQUNMLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7S0FDN0I7QUFDSCxDQUFDLENBQUM7QUFFRixPQUFPLENBQUMsU0FBUyxDQUFDLGdCQUFnQixHQUFHO0lBQ25DLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUNwRSxJQUFJLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3hFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNuQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDbkIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ25CLENBQUMsQ0FBQztBQUVGLE9BQU8sQ0FBQyxTQUFTLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztBQUV2QyxPQUFPLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxVQUFVLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU87SUFDdEUsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7UUFDekIsT0FBTztLQUNSO0lBRUQsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQzVELE9BQU8sR0FBRyxJQUFJLENBQUM7SUFFakIsSUFBSSxVQUFVLEVBQUU7UUFDZCxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztLQUNwRDtTQUNJO1FBQ0gsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN6QjtBQUVILENBQUMsQ0FBQztBQUVGLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLFVBQVUsS0FBSyxFQUFFLE1BQU07SUFDcEQsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTtRQUMxQixJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQztZQUNsQixPQUFPO1FBQ1QsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDckMsSUFBSSxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3JCLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0MscUJBQXFCO1lBQ3JCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdkI7UUFDRCxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDYjtBQUNILENBQUMsQ0FBQztBQUVGLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFVBQVUsS0FBSztJQUMxQyxPQUFPO0FBQ1QsQ0FBQyxDQUFDO0FBRUYsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsVUFBVSxJQUFJO0lBQzNDLE1BQU0sSUFBSSxLQUFLLENBQUMsNEJBQTRCLEdBQUcsSUFBSSxHQUFHLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkYsQ0FBQyxDQUFDO0FBRUYsT0FBTyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsVUFBVSxXQUFXO0lBQ25ELE9BQU8sSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ2pDLENBQUMsQ0FBQztBQUVGLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHO0FBQ3pCLENBQUMsQ0FBQztBQUVGLE9BQU8sQ0FBQyxjQUFjLEdBQUc7SUFDdkIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ2hCLElBQUksVUFBVSxHQUFHO1FBQ2YsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2QsQ0FBQyxDQUFDO0lBQ0YsOEJBQThCO0lBQzlCLFVBQVUsQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDaEQsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQyxDQUFDO0FBR0YsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQzlDLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUMxQyxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDNUMsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQzdDLElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ2pELElBQUksa0JBQWtCLEdBQUcsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ2xELElBQUksZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ2hELElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUM3QyxJQUFJLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNsRCxJQUFJLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNsRCxJQUFJLHFCQUFxQixHQUFHLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNyRCxJQUFJLG9CQUFvQixHQUFHLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNwRCxJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDL0MsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQzFDLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUM5QyxJQUFJLG9CQUFvQixHQUFHLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUVwRCxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDN0MsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQzVDLElBQUksZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ2hELElBQUksZUFBZSxHQUFHLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUMvQyxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDOUMsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQzNDLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUM5QyxJQUFJLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUVsRCxJQUFJLGNBQWMsR0FBRztJQUNuQixLQUFLLEVBQUUsQ0FBQyxZQUFZLEVBQUUsc0JBQXNCLENBQUM7SUFDN0MsTUFBTSxFQUFFLENBQUMsYUFBYSxFQUFFLCtDQUErQyxDQUFDO0lBQ3hFLE9BQU8sRUFBRSxDQUFDLGNBQWMsRUFBRSx3QkFBd0IsQ0FBQztJQUNuRCxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDO0lBQ3JCLFVBQVUsRUFBRSxDQUFDLGlCQUFpQixFQUFFLGFBQWEsQ0FBQztJQUM5QyxXQUFXLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxpQ0FBaUMsQ0FBQztJQUNwRSxTQUFTLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxxQkFBcUIsQ0FBQztJQUNwRCxNQUFNLEVBQUUsQ0FBQyxhQUFhLEVBQUUsNkJBQTZCLENBQUM7SUFDdEQsMENBQTBDO0lBQzFDLFdBQVcsRUFBRSxDQUFDLGtCQUFrQixFQUFFLEVBQUUsQ0FBQztJQUNyQyxXQUFXLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSw2REFBNkQsQ0FBQztJQUNoRyxjQUFjLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxXQUFXLENBQUM7SUFDcEQsYUFBYSxFQUFFLENBQUMsb0JBQW9CLEVBQUUsV0FBVyxDQUFDO0lBQ2xELFFBQVEsRUFBRSxDQUFDLGVBQWUsRUFBRSw2QkFBNkIsQ0FBQztJQUMxRCxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUM7SUFFbkMsT0FBTyxFQUFFLENBQUMsY0FBYyxFQUFFLG9CQUFvQixDQUFDO0lBQy9DLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSx1QkFBdUIsQ0FBQztJQUM1QyxPQUFPLEVBQUUsQ0FBQyxjQUFjLEVBQUUsK0NBQStDLENBQUM7SUFDMUUsUUFBUSxFQUFFLENBQUMsZUFBZSxFQUFFLHlCQUF5QixDQUFDO0lBQ3RELE9BQU8sRUFBRSxDQUFDLGNBQWMsRUFBRSxvQkFBb0IsQ0FBQztJQUMvQyxTQUFTLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSw2Q0FBNkMsQ0FBQztJQUM1RSxLQUFLLEVBQUUsQ0FBQyxZQUFZLEVBQUUsMkNBQTJDLENBQUM7SUFDbEUsTUFBTSxFQUFFLENBQUMsYUFBYSxFQUFFLDJDQUEyQyxDQUFDO0lBQ3BFLEtBQUssRUFBRSxDQUFDLE9BQU8sRUFBRSxzQkFBc0IsQ0FBQztJQUN4QyxXQUFXLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSw2REFBNkQsQ0FBQztJQUNoRyxhQUFhLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLENBQUM7Q0FDMUMsQ0FBQztBQUVGLFNBQVMsZUFBZSxDQUFDLEtBQUs7SUFDNUIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2IsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUk7UUFDMUIsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZFLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBRUQsS0FBSyxJQUFJLENBQUMsSUFBSSxjQUFjLEVBQUU7SUFDNUIsSUFBSSxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUN4RDtBQUVELGNBQWMsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHO0lBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLENBQUMsQ0FBQztBQUVGLGFBQWEsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHO0lBQzdCLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLENBQUMsQ0FBQztBQUVGLFlBQVksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHO0lBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLENBQUMsQ0FBQztBQUVGLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUc7SUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7SUFDdEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDaEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDdkIsQ0FBQyxDQUFDO0FBRUYsZUFBZSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUc7SUFDL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDcEIsQ0FBQyxDQUFDO0FBRUYsY0FBYyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUc7SUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDaEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDcEIsQ0FBQyxDQUFDO0FBRUYsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUc7SUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDdkIsQ0FBQyxDQUFDO0FBRUYsY0FBYyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUc7SUFDOUIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDbEIsQ0FBQyxDQUFDO0FBRUYsa0JBQWtCLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRztJQUNsQyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssYUFBYTtRQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlELElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLENBQUMsQ0FBQztBQUVGLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUc7QUFDdEMsQ0FBQyxDQUFDO0FBRUYsYUFBYSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsVUFBVSxNQUFNO0lBQzlDLE1BQU0sQ0FBQyxNQUFNLFlBQVksYUFBYSxDQUFDLENBQUM7SUFDeEMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEtBQUssTUFBTSxDQUFDLGdCQUFnQixFQUFFO1FBQ3JELENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDaEQsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDbkM7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQztBQUdGLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFVBQVUsS0FBSztJQUNoRCxJQUFJLEtBQUssQ0FBQyxLQUFLLElBQUksVUFBVTtRQUMzQixPQUFPO0lBQ1QsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtRQUN2RCxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsZUFBZSxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDeEQsSUFBSSxRQUFRLEVBQUU7WUFDWixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFDakIsU0FBUyxFQUFFLEtBQUssQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxnQkFBZ0I7Z0JBQzlFLFFBQVEsRUFBRSxRQUFRO2FBQ25CLENBQUMsQ0FBQztTQUNKO0tBQ0Y7U0FDSSxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssYUFBYSxFQUFFO1FBQ3JDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQztLQUN4QztTQUNJLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7UUFDakMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO0tBQ3BDO1NBQ0ksSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFO1FBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQztLQUNqQztJQUNELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDcEIsNEJBQTRCO0FBQzlCLENBQUMsQ0FBQztBQUNGLFNBQVM7QUFDVCxZQUFZLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxVQUFVLEtBQUs7SUFDL0MsTUFBTSxDQUFDLEtBQUssWUFBWSxhQUFhLENBQUMsQ0FBQztJQUV2QyxJQUFJLGVBQWUsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUM7SUFFN0MsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxFQUFFO1FBQ2pELElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLEdBQUcsS0FBSyxDQUFDO0tBQ3ZDO1NBQU07UUFDTCxPQUFPLENBQUMsS0FBSyxDQUFDLG9CQUFvQixHQUFHLGVBQWUsR0FBRyxxQ0FBcUMsQ0FBQyxDQUFDO0tBQy9GO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsWUFBWSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsVUFBVSxLQUFLO0lBQy9DLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7UUFDekIsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQ3RCLElBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyxTQUFTLEVBQUU7WUFDMUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDO1NBQzNDO1FBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUNyQjtBQUNILENBQUMsQ0FBQztBQUVGLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFVBQVUsS0FBSztJQUNoRCxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO1FBQ3pCLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUN0QixJQUFJLElBQUksQ0FBQyxHQUFHLEtBQUssU0FBUyxFQUFFO1lBQzFCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQztTQUMzQztRQUNELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDckI7QUFDSCxDQUFDLENBQUM7QUFFRixnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFVBQVUsS0FBSztJQUNuRCxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssV0FBVyxFQUFFO1FBQzlCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO0tBQ3JCO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsY0FBYyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsVUFBVSxLQUFLO0lBQ2pELElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7UUFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO0tBQ3JCO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsV0FBVyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsVUFBVSxLQUFLO0lBQzlDLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxTQUFTLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxXQUFXLEVBQUU7UUFDeEUsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO0tBQ2pDO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxVQUFVLEtBQUs7SUFDckQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ2hCLElBQUksS0FBSyxZQUFZLFlBQVksRUFBRTtRQUNqQywrQ0FBK0M7UUFDL0MsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUN0QztTQUNJLElBQUksS0FBSyxZQUFZLGNBQWMsRUFBRTtRQUN4QyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7S0FDcEM7U0FDSSxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO1FBQ2hDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksYUFBYSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ2hEO1NBQ0ksSUFBSSxLQUFLLFlBQVksZUFBZSxFQUFFO1FBQ3pDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQztLQUNyQztTQUNJLElBQUksS0FBSyxZQUFZLGNBQWMsRUFBRTtRQUN4QyxJQUFJLEtBQUssQ0FBQyxTQUFTLEtBQUssc0NBQXNDO1lBQzVELEtBQUssQ0FBQyxTQUFTLEtBQUssK0NBQStDO1lBQ25FLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQztLQUN0QztTQUNJLElBQUksS0FBSyxZQUFZLGNBQWMsRUFBRTtRQUN4QyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7S0FDcEM7U0FDSSxJQUFJLEtBQUssWUFBWSxvQkFBb0IsRUFBRTtLQUMvQztJQUNELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDdEIsQ0FBQyxDQUFDO0FBRUYsY0FBYyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsVUFBVSxXQUFXO0lBQzFELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztJQUNoQixJQUFJLEtBQUssR0FBRyxTQUFTLENBQUM7SUFDdEIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7SUFDbkMsSUFBSSxFQUFFLEdBQUcsU0FBUyxDQUFDO0lBQ25CLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQztJQUN2QixJQUFJLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDbEIsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDO0lBRXJCLEtBQUssQ0FBQyxJQUFJLFFBQVEsRUFBRTtRQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7WUFDekMsSUFBSSxHQUFHLEtBQUssQ0FBQztZQUNiLE1BQU07U0FDUDtLQUNGO0lBRUQsSUFBSSxDQUFDLElBQUksRUFBRTtRQUNULE9BQU87S0FDUjtJQUVELElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUNqQixJQUFJLFdBQVcsR0FBRyxFQUFFLEVBQ2xCLGVBQWUsQ0FBQztRQUVsQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7UUFFbEIsTUFBTSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbkIsSUFBSSxNQUFNLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNqQixxRkFBcUY7WUFDckYsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFckQseUVBQXlFO1FBQ3pFLHNDQUFzQztRQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBRXpDLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztRQUV4QyxnRUFBZ0U7UUFDaEUsSUFBSSxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM5QixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzNDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdkU7U0FDRjtRQUVELG9FQUFvRTtRQUNwRSxJQUFJLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzFCLFdBQVcsR0FBRyxXQUFXO2dCQUN2QixJQUFJLENBQUMsR0FBRyxDQUFDO2dCQUNULEtBQUssQ0FBQyxHQUFHLENBQUM7Z0JBQ1YsTUFBTSxDQUFDLFNBQVMsc0JBQXNCLENBQUMsSUFBSTtnQkFDekMsT0FBTyxJQUFJLEtBQUssR0FBRyxDQUFDO1lBQ3RCLENBQUMsQ0FBQyxDQUFDO1lBRUwsSUFBSSxXQUFXLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUUxRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3ZDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO2FBQzVFO1NBQ0Y7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7UUFFeEMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRTtZQUN0QixJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEMsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUV6RixJQUFJLE1BQU0sRUFBRTtnQkFDVixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksVUFBVSxFQUFFO29CQUMzQixxQ0FBcUM7aUJBQ3RDO3FCQUNJO29CQUNILHFEQUFxRDtvQkFDckQsTUFBTSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ3JDLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUdwRyxJQUFJLEtBQUssRUFBRTt3QkFDVCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDM0Q7aUJBQ0Y7YUFDRjtTQUNGO2FBQ0k7WUFDSCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2pFLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNsQztRQUdELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUM1QjtTQUFNO1FBQ0wsZUFBZTtRQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNwQixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDeEMsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLGVBQWUsRUFBRTtnQkFDakMsMERBQTBEO2dCQUMxRCxTQUFTO2FBQ1Y7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztZQUN0RCxNQUFNLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQyxFQUFFLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDbkIsSUFBSSxnQkFBZ0IsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQy9DLElBQUksT0FBTyxnQkFBZ0IsS0FBSyxXQUFXLEVBQUU7Z0JBQzNDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzVHO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDckM7WUFFRCxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssUUFBUSxFQUFFO2dCQUM5QyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDOUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQzthQUNuQztZQUVELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzlCO0tBQ0Y7SUFDRCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztBQUMxQixDQUFDLENBQUM7QUFFRjs7Ozs7Ozs7OztHQVVHO0FBQ0gsY0FBYyxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsR0FBRyxVQUFVLFFBQVEsRUFBRSxLQUFLO0lBQzFFLElBQUksZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUN6QyxPQUFPLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxFQUNqQyxZQUFZLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFDL0MsSUFBSSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFDdEIsSUFBSSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFDdEIsYUFBYSxHQUFRLEVBQUUsQ0FBQztJQUUxQixhQUFhLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxQyxhQUFhLENBQUMsS0FBSyxHQUFHLE9BQU8sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO0lBQzNDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBRTNCLE9BQU8sYUFBYSxDQUFDO0FBQ3ZCLENBQUMsQ0FBQztBQUVGOzs7Ozs7Ozs7R0FTRztBQUNILGNBQWMsQ0FBQyxTQUFTLENBQUMsMEJBQTBCLEdBQUcsVUFBVSxPQUFPO0lBQ3JFLElBQUksWUFBWSxHQUFHLEdBQUcsRUFDcEIsUUFBUSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyw4Q0FBOEM7SUFFaEcsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE9BQU8sT0FBTyxDQUFDLEtBQUssS0FBSyxRQUFRLEVBQUU7UUFDeEUsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDeEQsWUFBWSxJQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM3RDtLQUNGO0lBRUQsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDL0IsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBRWhCLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQVUsS0FBSztZQUN0QyxJQUFJLGlCQUFpQixHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRWxGLElBQUksaUJBQWlCLElBQUksT0FBTyxpQkFBaUIsS0FBSyxRQUFRLEVBQUU7Z0JBQzlELFlBQVksSUFBSSxDQUFDLEdBQUcsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDO2FBQzNDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7S0FDSjtJQUVELE9BQU8sWUFBWSxDQUFDO0FBQ3RCLENBQUMsQ0FBQztBQUVGLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsVUFBVSxXQUFXLEVBQUUsR0FBRztJQUNqRSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQzdCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQy9DLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxPQUFPLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxRQUFRO1lBQ25ELFNBQVM7UUFDWCxJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7WUFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDekIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN4QixTQUFTO1NBQ1Y7UUFDRCxJQUFJLFdBQVcsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNsRCxJQUFJLE9BQU8sR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2hELE9BQU8sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDakMsSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO1lBQ25CLFdBQVcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUM7WUFDdEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1NBQ3BDO2FBQ0k7WUFDSCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQztTQUM1QjtRQUNELFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDekI7SUFDRCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztBQUMxQixDQUFDLENBQUM7QUFFRixlQUFlLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxVQUFVLFdBQVc7SUFDM0QsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUM3QixJQUFJLE9BQU8sUUFBUSxLQUFLLFdBQVc7UUFDakMsT0FBTztJQUNULEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQy9DLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxXQUFXO1lBQzVCLFNBQVM7UUFDWCxLQUFLLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDbEMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUN6QjtJQUNELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNsQixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztBQUMxQixDQUFDLENBQUM7QUFFRixjQUFjLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxVQUFVLFdBQVc7SUFDMUQsSUFBSSxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQ3BDLFFBQVEsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUN0QyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFDbEIsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDM0IsSUFBSSxRQUFRLEVBQUU7UUFDWixRQUFRLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUVoQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMvQyxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssV0FBVztnQkFDNUIsU0FBUztZQUNYLEtBQUssQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQzFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDeEIsS0FBSyxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDckMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFdkMsSUFBSSxNQUFNLEVBQUU7Z0JBQ1YsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO2dCQUMzQixNQUFNLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7Z0JBQ3JDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUM7Z0JBQ3ZDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUM7Z0JBQ3pDLE1BQU0sQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUN4RCxNQUFNLENBQUMsVUFBVSxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQzthQUMzRDtTQUNGO0tBQ0Y7SUFDRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDbEIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ2xCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0FBQzFCLENBQUMsQ0FBQztBQUVGLGNBQWMsQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFVBQVUsV0FBVztJQUMxRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUMxQixRQUFRLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQztJQUNsQyxJQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUNuQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMvQyxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssTUFBTTtnQkFDdkIsU0FBUztZQUNYLElBQUksV0FBVyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ2xELElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNwQyxJQUFJLE9BQU8sRUFBRTtnQkFDWCxPQUFPLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNqQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRztvQkFDeEIsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO29CQUN4QixPQUFPLEVBQUUsT0FBTztpQkFDakIsQ0FBQztnQkFDRixRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ3pCO1NBQ0Y7S0FDRjtJQUNELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNsQixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztBQUMxQixDQUFDLENBQUM7QUFHRixpQkFBaUIsQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFVBQVUsV0FBVztJQUM3RCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQzdCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQy9DLElBQUksS0FBSyxZQUFZLGtCQUFrQjtZQUNyQyxPQUFPLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUNqRDtJQUNELE9BQU8sRUFBRSxDQUFDO0FBQ1osQ0FBQyxDQUFDO0FBRUYsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxVQUFVLFdBQVcsRUFBRSxLQUFLO0lBQ3JFLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDN0IsSUFBSSxJQUFJLENBQUM7SUFDVCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMvQyxJQUFJLEtBQUssWUFBWSxlQUFlO1lBQ2xDLEtBQUssWUFBWSxhQUFhLEVBQUU7WUFDaEMsSUFBSSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzdDLE1BQU07U0FDUDtLQUNGO0lBQ0QsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtRQUN0QixJQUFJLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUMvQixRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksRUFDcEIsRUFBRSxHQUFHLEtBQUssSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUNsRSxNQUFNLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFDaEMsV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFFakgsSUFBSSxDQUFDLE9BQU8sR0FBRztZQUNiLE9BQU8sV0FBVyxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVELENBQUMsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFFRCxzQkFBc0I7SUFDdEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUM5QyxPQUFPLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEtBQUs7UUFDN0MsT0FBTyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDN0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBRUYsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxVQUFVLFdBQVcsRUFBRSxLQUFLO0lBQ25FLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDN0IsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ2QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDL0MsSUFBSSxLQUFLLFlBQVksZUFBZTtZQUNsQyxLQUFLLFlBQVksYUFBYSxFQUFFO1lBQ2hDLElBQUksR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUM5QztLQUNGO0lBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1FBQ2QsSUFBSSxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFDL0IsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQ3BCLEVBQUUsR0FBRyxLQUFLLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFDbEUsTUFBTSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFbkMsSUFBSSxRQUFRLElBQUksVUFBVSxFQUFFO1lBQzFCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztTQUNuQjthQUNJO1lBQ0gsSUFBSSxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUM7Z0JBQ3hELE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBRXZELElBQUksV0FBVyxFQUFFO2dCQUNmLElBQUksSUFBSSxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDOUQsSUFBSSxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ25DO1NBQ0Y7S0FDRjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyxDQUFDO0FBRUYsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRztJQUN6QyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDN0IsQ0FBQyxDQUFDO0FBRUYsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxVQUFVLFdBQVcsRUFBRSxLQUFLO0lBQ3JFLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO0lBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQy9DLElBQUksS0FBSyxZQUFZLGFBQWE7WUFDaEMsS0FBSyxZQUFZLGVBQWU7WUFDaEMsS0FBSyxZQUFZLFVBQVU7WUFDM0IsS0FBSyxZQUFZLG9CQUFvQjtZQUNyQyxLQUFLLFlBQVkscUJBQXFCLEVBQUU7WUFFeEMsT0FBTyxLQUFLLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUM5QztLQUNGO0lBQ0QsT0FBTyxFQUFFLENBQUM7QUFDWixDQUFDLENBQUM7QUFFRixxQkFBcUIsQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFVBQVUsV0FBVyxFQUFFLEtBQUs7SUFDeEUsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUM3QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMvQyxJQUFJLEtBQUssWUFBWSxnQkFBZ0IsRUFBRTtZQUNyQyxPQUFPLEtBQUssQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzlDO0tBQ0Y7SUFDRCxPQUFPLEVBQUUsQ0FBQztBQUNaLENBQUMsQ0FBQztBQUVGLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsVUFBVSxXQUFXLEVBQUUsS0FBSztJQUN2RSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQzdCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQy9DLElBQUksS0FBSyxZQUFZLGdCQUFnQixFQUFFO1lBQ3JDLE9BQU8sS0FBSyxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDOUM7S0FDRjtJQUNELE9BQU8sRUFBRSxDQUFDO0FBQ1osQ0FBQyxDQUFDO0FBRUYsY0FBYyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsVUFBVSxXQUFXLEVBQUUsS0FBSztJQUNqRSxJQUFJLE9BQU8sR0FBRyxFQUFFLEVBQ2QsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3SCxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssSUFBSSxDQUFDLFVBQVUsSUFBSSxNQUFNLEVBQUU7UUFDakQsSUFBSSxJQUFJLElBQUksQ0FBQztLQUNkO0lBRUQsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQzlCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDM0M7SUFDRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDbkMsSUFBSSxJQUFJLEVBQUU7UUFDUixJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQ3RCLEVBQUUsR0FBRyxLQUFLLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFDbEUsTUFBTSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQ2hDLFdBQVcsR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUU3SCxJQUFJLEVBQUUsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ2pDLEtBQUssR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQztTQUN2QztRQUVELElBQUksV0FBVyxJQUFJLENBQUMsQ0FBQyxRQUFRLElBQUksVUFBVSxDQUFDLEVBQUU7WUFFNUMsSUFBSSxDQUFDLENBQUMsUUFBUSxJQUFJLFdBQVcsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBRWpELElBQUksSUFBSSxHQUFRLEVBQUUsQ0FBQztnQkFDbkIsV0FBVyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUNoRCxJQUFJLFdBQVcsR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDOUQsSUFBSSxPQUFPLFdBQVcsS0FBSyxRQUFRLEVBQUU7b0JBQ25DLElBQUksR0FBRyxXQUFXLENBQUM7aUJBQ3BCO3FCQUNJO29CQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRzt3QkFDNUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDL0IsQ0FBQyxDQUFDLENBQUM7aUJBQ0o7Z0JBRUQsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO29CQUNiLE9BQU8sR0FBRyxJQUFJLENBQUM7aUJBQ2hCO3FCQUNJO29CQUNILE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7aUJBQ3RCO2dCQUVELElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO29CQUM1QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7b0JBQ2pDLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDO2lCQUMzQjtnQkFFRCxXQUFXLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDakQ7aUJBQ0k7Z0JBQ0gsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO29CQUNiLE9BQU8sR0FBRyxXQUFXLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDcEQ7cUJBQ0k7b0JBQ0gsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLFdBQVcsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUMxRDthQUNGO1NBRUY7YUFDSTtZQUNILE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQzVCO0tBQ0Y7U0FDSTtRQUNILElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDN0IsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNuQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMvQyxJQUFJLEtBQUssWUFBWSxrQkFBa0IsRUFBRTtnQkFDdkMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQ3ZEO1NBQ0Y7S0FDRjtJQUNELE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUMsQ0FBQztBQUVGLFVBQVUsQ0FBQyxTQUFTLENBQUMsV0FBVztJQUM5QixlQUFlLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxVQUFVLFdBQVcsRUFBRSxLQUFLO1FBQ2xFLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDN0IsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQy9DLElBQUksS0FBSyxZQUFZLFVBQVUsRUFBRTtnQkFDL0IsU0FBUzthQUNWO1lBQ0QsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDeEQsS0FBSyxJQUFJLEdBQUcsSUFBSSxXQUFXLEVBQUU7Z0JBQzNCLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDbEM7U0FDRjtRQUNELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUMsQ0FBQztBQUVKLGFBQWEsQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFVBQVUsV0FBVyxFQUFFLEtBQUs7SUFDaEUsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUM3QixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDL0MsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEQsS0FBSyxJQUFJLEdBQUcsSUFBSSxXQUFXLEVBQUU7WUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNoQztLQUNGO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBRUYsY0FBYyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsVUFBVSxXQUFXO0lBQzFELElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtRQUNoQixPQUFPLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDOUQ7SUFDRCxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7SUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDOUIsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDLENBQUM7QUFFRixlQUFlLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxVQUFVLFdBQVc7SUFDM0QsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ2pCLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtRQUM3QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ2pEO0lBQ0QsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQyxDQUFDO0FBRUYsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxVQUFVLFdBQVc7SUFDNUQsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUN4RSxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQzNFLE9BQU87UUFDTCxLQUFLLEVBQUUsU0FBUyxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sRUFBRSxVQUFVLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDN0QsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVGLGNBQWMsQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFVBQVUsV0FBVztJQUMxRCxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDakIsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQzdCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDakQ7SUFDRCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDLENBQUM7QUFFRixjQUFjLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxVQUFVLFdBQVc7SUFDMUQsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ2YsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1FBQzNCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ3JEO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsSUFBSSxJQUFJLEdBQUcsVUFBVSxVQUFVLEVBQUUsR0FBRyxFQUFFLE9BQU87SUFDbEQsSUFBSSxJQUFJLEdBQUcsSUFBSSxFQUNiLFFBQVEsQ0FBQztJQUVYLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ2YsSUFBSSxDQUFDLFFBQVEsR0FBRztJQUNoQixDQUFDLENBQUM7SUFDRixJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztJQUV4Qix3QkFBd0I7SUFDeEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDO0lBRW5ELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUVqQyxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtRQUNsQyxVQUFVLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2xDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0tBQzFCO1NBQ0ksSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDdkMsUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7S0FDL0I7U0FDSTtRQUNILE1BQU0sSUFBSSxLQUFLLENBQUMsaUVBQWlFLENBQUMsQ0FBQztLQUNwRjtJQUVELE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtRQUM5QixJQUFJO1lBQ0YsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7U0FDakM7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDakM7UUFFRCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUMvQixJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDcEMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQztZQUN6RCxJQUFJLFFBQVEsRUFBRTtnQkFDWixLQUFLLE1BQU0sSUFBSSxJQUFJLFFBQVEsRUFBRTtvQkFDM0IsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQzlDO2FBQ0Y7WUFDRCxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQztZQUNqRCxJQUFJLFlBQVksRUFBRTtnQkFDaEIsS0FBSyxNQUFNLElBQUksSUFBSSxZQUFZLEVBQUU7b0JBQy9CLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2lCQUN2QzthQUNGO1lBRUQsaUlBQWlJO1lBQ2pJLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDO1lBQ3pDLEtBQUssSUFBSSxXQUFXLElBQUksUUFBUSxFQUFFO2dCQUNoQyxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3BDLElBQUksT0FBTyxPQUFPLENBQUMsS0FBSyxLQUFLLFdBQVcsRUFBRTtvQkFDeEMsT0FBTyxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUM7aUJBQzVCO2dCQUNELElBQUksT0FBTyxDQUFDLEtBQUssS0FBSyxVQUFVO29CQUM5QixTQUFTO2dCQUNYLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7Z0JBQzlCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO2dCQUN0QyxLQUFLLElBQUksVUFBVSxJQUFJLE9BQU8sRUFBRTtvQkFDOUIsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxFQUFFO3dCQUM3QixJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQzt3QkFDaEQsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO3dCQUNwQixJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNOzRCQUM1QixVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7d0JBQ2hELE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxDQUFDO3FCQUM1RTtpQkFDRjthQUNGO1lBRUQsZ0RBQWdEO1lBQ2hELElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3hDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUV0QyxDQUFDLENBQUMsQ0FBQztJQUVILGdDQUFnQztJQUNoQyxVQUFVO0lBQ1YsdUNBQXVDO0lBQ3ZDLGtCQUFrQjtJQUNsQix1Q0FBdUM7SUFDdkMsTUFBTTtJQUVOLHlDQUF5QztJQUN6QyxnQkFBZ0I7SUFDaEIsaUJBQWlCO0lBQ2pCLG1DQUFtQztJQUNuQyxRQUFRO0lBRVIsMkNBQTJDO0lBQzNDLGdFQUFnRTtJQUNoRSxzQkFBc0I7SUFDdEIsaUNBQWlDO0lBQ2pDLHdEQUF3RDtJQUN4RCxVQUFVO0lBQ1YsUUFBUTtJQUNSLHdEQUF3RDtJQUN4RCwwQkFBMEI7SUFDMUIscUNBQXFDO0lBQ3JDLGlEQUFpRDtJQUNqRCxVQUFVO0lBQ1YsUUFBUTtJQUVSLHdJQUF3STtJQUN4SSxnREFBZ0Q7SUFDaEQsMENBQTBDO0lBQzFDLDZDQUE2QztJQUM3QyxvREFBb0Q7SUFDcEQsc0NBQXNDO0lBQ3RDLFVBQVU7SUFDViwwQ0FBMEM7SUFDMUMsb0JBQW9CO0lBQ3BCLHVDQUF1QztJQUN2QywrQ0FBK0M7SUFDL0MsMENBQTBDO0lBQzFDLDJDQUEyQztJQUMzQyw2REFBNkQ7SUFDN0QsK0JBQStCO0lBQy9CLDRDQUE0QztJQUM1Qyw2REFBNkQ7SUFDN0Qsc0ZBQXNGO0lBQ3RGLFlBQVk7SUFDWixVQUFVO0lBQ1YsUUFBUTtJQUVSLHVEQUF1RDtJQUN2RCwrQ0FBK0M7SUFFL0MsZ0NBQWdDO0lBQ2hDLFFBQVE7SUFFUixNQUFNO0FBQ1IsQ0FBQyxDQUFDO0FBRUYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBRWhGLElBQUksQ0FBQyxTQUFTLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFDO0FBRTVDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUNuQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFFL0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsR0FBRyxVQUFVLE9BQU87SUFDbkQsSUFBSSxDQUFDLDBCQUEwQixHQUFHLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixDQUFDO0lBQ3BFLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBRWxCLElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUVuRSxJQUFJLGlCQUFpQjtRQUNuQixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksT0FBTyxpQkFBaUIsQ0FBQyxVQUFVLEtBQUssUUFBUSxDQUFDLEVBQUU7UUFDbkcsSUFBSSxpQkFBaUIsQ0FBQyxRQUFRLEVBQUU7WUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQyxVQUFVLENBQUM7U0FDL0Q7YUFBTTtZQUNMLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM5RjtLQUNGO1NBQU07UUFDTCxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztLQUN6RDtJQUVELElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUMxRCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDcEQsSUFBSSxPQUFPLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRTtRQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO0tBQzVDO1NBQU07UUFDTCxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7S0FDL0I7SUFDRCxJQUFJLE9BQU8sQ0FBQyxXQUFXLEtBQUssU0FBUyxFQUFFO1FBQ3JDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7S0FDaEQ7U0FBTTtRQUNMLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztLQUNsQztJQUNELElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDO0lBRXpELElBQUksT0FBTyxDQUFDLHNCQUFzQixLQUFLLFNBQVMsRUFBRTtRQUNoRCxJQUFJLENBQUMsT0FBTyxDQUFDLHNCQUFzQixHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQztLQUN0RTtTQUFNO1FBQ0wsSUFBSSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUM7S0FDNUM7SUFFRCxvREFBb0Q7SUFDcEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztJQUNqRCxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO0lBQ2pELElBQUksT0FBTyxDQUFDLFVBQVUsRUFBRTtRQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO0tBQzlDO0lBRUQsdURBQXVEO0lBQ3ZELElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtRQUNuQixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO0tBQ3hDO0lBRUQsSUFBSSxvQkFBb0IsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3pFLElBQUksb0JBQW9CLEtBQUssSUFBSSxJQUFJLE9BQU8sb0JBQW9CLEtBQUssV0FBVyxFQUFFO1FBQ2hGLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEdBQUcsb0JBQW9CLENBQUM7S0FDMUQ7U0FBTTtRQUNMLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDO0tBQy9EO0lBRUQsdUJBQXVCO0lBQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDO0lBQzdELElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDO0lBRTdELElBQUksT0FBTyxDQUFDLG1CQUFtQixLQUFLLFNBQVMsRUFBRTtRQUM3QyxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQztLQUNoRTtJQUVELElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO0FBQ25ELENBQUMsQ0FBQztBQUVGLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFVBQVUsUUFBUTtJQUN6QyxJQUFJLFFBQVE7UUFDVixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUM3QixDQUFDLENBQUM7QUFFRixJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixHQUFHLFVBQWdCLFFBQVE7O1FBQzNELElBQUksSUFBSSxHQUFHLElBQUksRUFDYixPQUFPLEdBQUcsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUMxQixPQUFPLENBQUM7UUFFVixJQUFJLENBQUMsT0FBTztZQUNWLE9BQU8sQ0FBQyxjQUFjO1FBRXhCLElBQUksV0FBVyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3BFLHdFQUF3RTtTQUN6RTthQUFNO1lBQ0wsV0FBVyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzdEO1FBRUQsT0FBTyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyQywyQ0FBMkM7UUFDM0MsT0FBTyxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQywwQkFBMEIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDO1FBQzlGLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUVyQyxNQUFNLElBQUksR0FBRyxNQUFNLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUM1RCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU5QixJQUFJLElBQUksQ0FBQyxXQUFXLFlBQVksa0JBQWtCLEVBQUU7WUFDbEQsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLEVBQUUsQ0FBQztnQkFDNUQsT0FBTyxDQUFDLENBQUMsWUFBWSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQy9ELENBQUMsQ0FBQyxDQUFDO1NBQ0o7YUFBTTtZQUNMLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDbE07UUFFRCxPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUxQyxrRUFBa0U7UUFDbEUsZUFBZTtRQUNmLDRCQUE0QjtRQUM1QixNQUFNO1FBRU4sbUNBQW1DO1FBRW5DLDBEQUEwRDtRQUMxRCxzRUFBc0U7UUFDdEUsc0VBQXNFO1FBQ3RFLFVBQVU7UUFDVixhQUFhO1FBQ2Isd01BQXdNO1FBQ3hNLE1BQU07UUFDTix1REFBdUQ7UUFDdkQscUJBQXFCO1FBQ3JCLFFBQVE7UUFDUixNQUFNO0lBQ1IsQ0FBQztDQUFBLENBQUM7QUFFRixJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsR0FBRzs7UUFDL0IsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQ3BDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFFaEIsS0FBSyxJQUFJLEVBQUUsSUFBSSxPQUFPLEVBQUU7WUFDdEIsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3pCLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDLENBQUM7U0FDbkQ7UUFFRCxPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM1QyxDQUFDO0NBQUEsQ0FBQztBQUVGLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEdBQUc7SUFDaEMsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ2xCLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUM5QixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUN4RDtJQUNELE9BQU8sUUFBUSxDQUFDO0FBQ2xCLENBQUMsQ0FBQztBQUVGLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHO0lBQ3JCLE9BQU8sSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUM7QUFDeEIsQ0FBQyxDQUFDO0FBRUYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsVUFBVSxHQUFHLEVBQUUsUUFBUTtJQUNsRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7SUFDaEIsSUFBSSxDQUFDLEdBQUcsT0FBTyxRQUFRLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0QsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQ3RCLElBQUksSUFBSSxHQUFRLEVBQUUsQ0FBQztJQUNuQixJQUFJLE1BQU0sR0FBQyxFQUFFLENBQUM7SUFDZCxJQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBQztRQUNqQyxNQUFNLEdBQUc7WUFDUixRQUFRLEVBQUU7Z0JBQ1IsTUFBTSxFQUFFO29CQUNOLFFBQVEsRUFBRTt3QkFDUixhQUFhLEVBQUU7NEJBQ2IsUUFBUSxFQUFFLFFBQVE7NEJBQ2xCLFFBQVEsRUFBRSxRQUFRO3lCQUNuQjtxQkFDRjtpQkFDRjtnQkFDRCxJQUFJLEVBQUU7b0JBQ0osS0FBSyxFQUFFO3dCQUNMLFNBQVMsRUFBRSxRQUFRO3dCQUNuQixXQUFXLEVBQUUsUUFBUTt3QkFDckIsTUFBTSxFQUFFLFFBQVE7cUJBQ2pCO2lCQUNGO2FBQ0Y7U0FDRixDQUFDO0tBQ0g7U0FBTTtRQUNKLE1BQU0sR0FBRTtZQUNQLFFBQVEsRUFBRTtnQkFDUixNQUFNLEVBQUU7b0JBQ04sUUFBUSxFQUFFO3dCQUNSLGFBQWEsRUFBRTs0QkFDYixRQUFRLEVBQUUsUUFBUTs0QkFDbEIsUUFBUSxFQUFFLFFBQVE7eUJBQ25CO3FCQUNGO2lCQUNGO2dCQUNELElBQUksRUFBQztvQkFDSCxJQUFJLEVBQUU7d0JBQ0osS0FBSyxFQUFFLFFBQVE7d0JBQ2hCLE9BQU8sRUFDTjs0QkFDRyxLQUFLLEVBQUUsUUFBUTt5QkFDaEI7cUJBQ0Y7b0JBQ0QsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBQztvQkFDekIsVUFBVSxFQUFFLFFBQVE7b0JBQ3BCLE1BQU0sRUFBRSxRQUFRO2lCQUNqQjthQUVEO1NBR0osQ0FBQTtLQUNGO0lBRUQsK0JBQStCO0lBQy9CLElBQUksS0FBSyxHQUFVLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDbEUsSUFBSSxLQUFLLEdBQVEsRUFBRSxDQUFDO0lBRXBCLElBQUksSUFBSSxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyw0QkFBNEI7SUFFL0MsQ0FBQyxDQUFDLFNBQVMsR0FBRyxVQUFVLElBQUk7UUFDMUIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN2QixJQUFJLEtBQUssR0FBUSxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ2pDLElBQUksSUFBSSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQ2hDLGFBQWEsRUFDYixHQUFHLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQzdCLFNBQVMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUN0QixpQkFBaUIsR0FBRyxFQUFFLEVBQ3RCLG9CQUFvQixHQUFHLEtBQUssRUFDNUIsZUFBZSxHQUFHLEtBQUssRUFDdkIsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNYLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQztRQUV4QixJQUFJLENBQUMsVUFBVSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxPQUFPLEVBQUU7WUFDMUQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUMsOEVBQThFO1lBQzlFLHlFQUF5RTtZQUN6RSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNaLElBQUk7b0JBQ0YsMkNBQTJDO29CQUMzQyxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUM7b0JBQ3BCLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQztvQkFDckIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDNUIsUUFBUSxHQUFHLElBQUksQ0FBQzt3QkFDaEIsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO3FCQUN0Qzt5QkFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO3dCQUNsQyxPQUFPLEdBQUcsSUFBSSxDQUFDO3dCQUNmLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQztxQkFDckM7eUJBQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDbEMsT0FBTyxHQUFHLElBQUksQ0FBQzt3QkFDZixJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7cUJBQ3JDO29CQUNELHdFQUF3RTtvQkFDeEUsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUM7b0JBQzNDLElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQzNDLHdEQUF3RDtvQkFDeEQsSUFBSSxRQUFRLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzQyxJQUFJLE9BQU8sRUFBRTt3QkFDWCxJQUFJLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO3FCQUMzQzt5QkFBTTt3QkFDTCxJQUFJLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO3FCQUM1QztvQkFDRCxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzFDLDZDQUE2QztvQkFDN0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQzNFO2dCQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUNWLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUU7d0JBQzVCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ2Q7aUJBQ0Y7YUFDRjtZQUVELFNBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNsRCxVQUFVLEdBQUcsWUFBWSxDQUFDO1NBQzNCO1FBRUQsSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFO1lBQ2QsRUFBRSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQ2IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUM7YUFDckM7WUFDRCxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7U0FDL0Q7UUFDRCxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQ2IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUM7YUFDckM7U0FDRjtRQUVELDJCQUEyQjtRQUMzQixLQUFLLGFBQWEsSUFBSSxLQUFLLEVBQUU7WUFDM0IsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUU7Z0JBQ3pDLEtBQUssQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUM3RCxTQUFTO2FBQ1Y7WUFDRCxvQkFBb0IsR0FBRyxJQUFJLENBQUM7WUFDNUIsaUJBQWlCLENBQUMsYUFBYSxDQUFDLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ3pEO1FBRUQsS0FBSyxhQUFhLElBQUksaUJBQWlCLEVBQUU7WUFDdkMsSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3BDLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSywyQ0FBMkMsSUFBSSxpQkFBaUIsQ0FBQyxhQUFhLENBQUM7Z0JBQzdILENBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssTUFBTSxJQUFJLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUN2RztnQkFDQSxlQUFlLEdBQUcsSUFBSSxDQUFDO2dCQUN2QixNQUFNO2FBQ1A7U0FDRjtRQUVELElBQUksb0JBQW9CLEVBQUU7WUFDeEIsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEdBQUcsaUJBQWlCLENBQUM7U0FDckQ7UUFFRCw2RUFBNkU7UUFDN0UsSUFBSSxhQUFhLENBQUM7UUFDbEIsSUFBSSxPQUFPLEdBQUcsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUMsSUFBSSxPQUFPLEVBQUU7WUFDWCxJQUFJLElBQUksR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDL0IsSUFBSSxPQUFPLENBQUM7WUFDWixJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssVUFBVSxFQUFFO2dCQUM5QixpQ0FBaUM7Z0JBQ2pDLE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUM7YUFDN0M7aUJBQU07Z0JBQ0wsT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDOUI7WUFDRCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4RCxJQUFJLE9BQU8sRUFBRTtnQkFDWCxhQUFhLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDdkQ7U0FDRjtRQUVELElBQUksU0FBUyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUU7WUFDdkMsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7U0FDcEI7UUFDRCxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQ1QsSUFBSSxFQUFFLFlBQVk7WUFDbEIsTUFBTSxFQUFFLEdBQUc7WUFDWCxNQUFNLEVBQUUsQ0FBQyxhQUFhLElBQUksQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDekQsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQ1osR0FBRyxFQUFFLGVBQWU7U0FDckIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDO0lBRUYsQ0FBQyxDQUFDLFVBQVUsR0FBRyxVQUFVLE1BQU07UUFDN0IsSUFBSSxHQUFHLEdBQVEsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUN4QixHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFDaEIsR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUM3QixTQUFTLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFDdEIsU0FBUyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQ3RCLElBQUksR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDO1FBRWpDLElBQUksT0FBTyxHQUFHLENBQUMsTUFBTSxLQUFLLFFBQVEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEtBQUssUUFBUSxJQUFhLEdBQUcsQ0FBQyxNQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxFQUFFO1lBQ2xILElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUM7Z0JBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1NBQ3JGO1FBRUQsSUFBSSxHQUFHLENBQUMsR0FBRyxLQUFLLElBQUksRUFBRTtZQUNwQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFO2dCQUNoQyxHQUFHLEdBQUcsSUFBSSxDQUFDO2FBQ1o7aUJBQU07Z0JBQ0wsT0FBTzthQUNSO1NBQ0Y7UUFFRCxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRTtZQUNwRCxHQUFHLEdBQUcsSUFBSSxDQUFDO1NBQ1o7UUFFRCxJQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3BCLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7YUFDdEI7WUFDRCxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzNCO2FBQU0sSUFBSSxJQUFJLElBQUksU0FBUyxFQUFFO1lBQzVCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO2dCQUNuQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUNyQztZQUNELFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDM0I7YUFBTTtZQUNMLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7U0FDdkI7UUFFRCxJQUFJLEdBQUcsQ0FBQyxFQUFFLEVBQUU7WUFDVixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7U0FDeEI7SUFDSCxDQUFDLENBQUM7SUFFRixDQUFDLENBQUMsT0FBTyxHQUFHLFVBQVUsSUFBSTtRQUN4QixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNoQixPQUFPO1NBQ1I7UUFFRCxJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNqQyxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNsQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25DLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUMxQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsS0FBSyxDQUFDO2FBQzNDO2lCQUFNO2dCQUNMLEdBQUcsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO2FBQ3BCO1NBQ0Y7YUFBTTtZQUNMLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDeEI7SUFDSCxDQUFDLENBQUM7SUFFRixDQUFDLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQztRQUNyQixDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDWCxNQUFNO1lBQ0osS0FBSyxFQUFFO2dCQUNMLFNBQVMsRUFBRSxHQUFHO2dCQUNkLFdBQVcsRUFBRSxhQUFhO2dCQUMxQixNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTztnQkFDNUIsVUFBVSxFQUFFLEdBQUc7YUFDaEI7U0FDRixDQUFDO0lBQ0osQ0FBQyxDQUFDO0lBRUYsQ0FBQyxDQUFDLE1BQU0sR0FBRyxVQUFVLElBQUk7UUFDdkIsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDaEIsT0FBTztTQUNSO1FBRUQsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbEMsSUFBSSxJQUFJLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQ3BDLEtBQUssQ0FBQztRQUNSLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDNUYsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQzFEO2FBQ0k7WUFDSCxJQUFJLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtnQkFDeEMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDNUI7aUJBQU0sSUFBSSxJQUFJLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7Z0JBQ2hELEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxHQUFHLENBQUM7YUFDdkQ7aUJBQU0sSUFBSSxJQUFJLEtBQUssVUFBVSxJQUFJLElBQUksS0FBSyxNQUFNLEVBQUU7Z0JBQ2pELEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN4QjtpQkFBTTtnQkFDTCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUU7b0JBQ25DLElBQUksR0FBRyxZQUFZLENBQUM7aUJBQ3JCO2dCQUNELCtCQUErQjtnQkFDL0IsSUFBSSxPQUFPLEdBQUcsQ0FBQyxNQUFNLEtBQUssUUFBUSxFQUFFO29CQUNsQyxLQUFLLEdBQUcsSUFBSSxDQUFDO2lCQUNkO3FCQUFNO29CQUNMLEtBQUssR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztpQkFDM0I7YUFDRjtTQUNGO1FBRUQsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDMUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQztTQUMzQzthQUFNO1lBQ0wsR0FBRyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7U0FDcEI7SUFDSCxDQUFDLENBQUM7SUFFRixJQUFJLE9BQU8sUUFBUSxLQUFLLFVBQVUsRUFBRTtRQUNsQyxrQkFBa0I7UUFDbEIsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QyxTQUFTLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDckMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3ZDLFNBQVMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqQyxTQUFTLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0IsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7YUFDaEIsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLEdBQUc7WUFDeEIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLENBQUMsQ0FBQzthQUNELEVBQUUsQ0FBQyxLQUFLLEVBQUU7WUFDVCxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUk7Z0JBQ0YsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDO2FBQ2Q7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDVixPQUFPLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNwQjtZQUNELFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEIsQ0FBQyxDQUFDLENBQUM7UUFDTCxPQUFPO0tBQ1I7SUFDRCxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBRXJCLE9BQU8sTUFBTSxFQUFFLENBQUM7SUFFaEIsU0FBUyxNQUFNO1FBQ2IsdURBQXVEO1FBQ3ZELEtBQUssSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFO1lBQ2xCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3pDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3JDO1NBQ0Y7UUFFRCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDOUIsSUFBSSxLQUFVLENBQUM7WUFFZixJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUV0QixJQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUM7b0JBQ3BCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztvQkFDL0QsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO29CQUNyRSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7b0JBRTNELElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7b0JBQ3BDLE1BQU0sR0FBRyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7b0JBQzFDLE1BQU0sR0FBRyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7b0JBRXBDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDeEU7cUJBQUs7b0JBQ0osSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO29CQUNqQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO29CQUMzQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7b0JBQ3BDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFFekU7Z0JBRUQsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQ2xCLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQzthQUNsQjtZQUNELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUN0QjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztBQUNILENBQUMsQ0FBQztBQUVGOzs7OztHQUtHO0FBQ0gsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsR0FBRyxVQUFVLEtBQUssRUFBRSxLQUFLO0lBQ3RELElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDcEIsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQztJQUVmLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUU7UUFDNUIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0MsSUFBSSxNQUFNLEVBQUU7WUFDVixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBQzdCLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUMvRDtZQUVELDhGQUE4RjtZQUM5RiwyQ0FBMkM7WUFDM0MsR0FBRyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ25GO0tBQ0Y7SUFFRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMsQ0FBQztBQUVGOzs7Ozs7O0dBT0c7QUFDSCxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixHQUFHLFVBQVUsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUk7SUFDaEYsc0ZBQXNGO0lBQ3RGLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUU7UUFDekIsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDO0tBQ3BCO0lBQ0QsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUNwQixJQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3hFLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3JGLENBQUMsQ0FBQztBQUVGOzs7Ozs7O0dBT0c7QUFDSCxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsR0FBRyxVQUFVLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPO0lBQzlFLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNmLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDNUIsSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDO0lBRTFCLFFBQVEsR0FBRyxRQUFRLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFckQsS0FBSyxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3RDLFFBQVEsR0FBRyxRQUFRLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBRTNELEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUVoRCxLQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRTtRQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUMvQixTQUFTO1NBQ1Y7UUFDRCxJQUFJLEdBQUcsS0FBSyxVQUFVLEVBQUU7WUFDdEIsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hCLElBQUksV0FBVyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUNsRCxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7WUFDcEIsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUNqRixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDOUMsS0FBSyxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUU7b0JBQ25CLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztpQkFDdkQ7YUFDRjtZQUNELEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN2RSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzNHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQy9DO0tBQ0Y7SUFDRCxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDakQsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hCLENBQUMsQ0FBQztBQUdGLFNBQVMsV0FBVyxDQUFDLEVBQUU7SUFDckIsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNsRSxDQUFDO0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxFQUFFO0lBQzFCLE9BQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDeEYsQ0FBQztBQUVELElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLEdBQUcsVUFBVSxFQUFFO0lBQzlDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDekQsQ0FBQyxDQUFDO0FBRUYsSUFBSSxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsR0FBRyxVQUFVLEVBQUU7SUFDckQsSUFBSSxTQUFTLEdBQUcsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDckMsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0FBQzdELENBQUMsQ0FBQztBQUlGOzs7Ozs7Ozs7Ozs7R0FZRztBQUNILElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFVBQVUsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFNBQVM7SUFDNUcsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ2hCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRTdDLElBQUksY0FBYyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQzVELElBQUksT0FBTyxjQUFjLEtBQUssV0FBVyxFQUFFO1FBQ3pDLDhHQUE4RztRQUM5RyxRQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQztLQUM3QjtJQUVELGNBQWMsR0FBRyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNsRCxJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsRUFBRTtRQUMzQyxjQUFjLEdBQUcsRUFBRSxDQUFDO0tBQ3JCO0lBRUQsSUFBSSxVQUFVLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDekIsSUFBSSxTQUFTLEdBQUcsTUFBTSxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsS0FBSyxXQUFXLENBQUM7SUFDckUsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ2YsSUFBSSxlQUFlLEdBQUcsQ0FBQyxRQUFRLElBQUksU0FBUyxDQUFDLElBQUksUUFBUSxLQUFLLFVBQVUsQ0FBQztJQUV6RSxJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7SUFDckIsSUFBSSxLQUFLLElBQUksT0FBTyxFQUFFO1FBQ3BCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLGVBQWUsRUFBRTtZQUN4RixJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsVUFBVSxTQUFTO2dCQUMxRSxXQUFXLElBQUksR0FBRyxHQUFHLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLFNBQVMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1lBQ3JFLENBQUMsQ0FBQyxDQUFDO1NBQ0o7YUFBTTtZQUNMLElBQUksZUFBZSxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUN6RCwrQkFBK0I7Z0JBQy9CLFdBQVcsSUFBSSxTQUFTLEdBQUcsUUFBUSxHQUFHLElBQUksR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO2FBQzFEO1lBQ0QsMkVBQTJFO1lBQzNFLElBQUksU0FBUyxJQUFJLFVBQVU7Z0JBQUUsV0FBVyxJQUFJLFVBQVUsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO1NBQ3RFO0tBQ0Y7SUFFRCxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ2QsU0FBUyxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztRQUNuQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQzdDO1NBQU07UUFDTCxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUM7S0FDekI7SUFFRCw4Q0FBOEM7SUFDOUMsSUFBSSxTQUFTLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsRUFBRTtRQUN4RyxXQUFXLEdBQUcsU0FBUyxDQUFDO0tBQ3pCO0lBRUQsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBRVosSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixJQUFJLE9BQU8sRUFBRTtRQUMvQyxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUM7S0FDakQ7U0FBTSxJQUFJLGVBQWUsSUFBSSxDQUFDLFNBQVMsSUFBSSxPQUFPLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDeEcsRUFBRSxHQUFHLFFBQVEsQ0FBQztLQUNmO0lBRUQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ1QsaUNBQWlDO0lBQ2pDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUN0QixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN0QyxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEIsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsRUFDckQsb0JBQW9CLEdBQUcsY0FBYyxJQUFJLEVBQUUsQ0FBQyxDQUFDLDRDQUE0QztZQUUzRixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQztZQUUvRixJQUFJLGVBQWUsR0FBRyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsb0JBQW9CLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBRTdGLElBQUksSUFBSSxLQUFLLEVBQUUsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRTtnQkFDM0MsK0NBQStDO2dCQUMvQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM1QixLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUN0QztpQkFBTTtnQkFDTCxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMxQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsc0JBQXNCLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDbEQsS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ3RDO2dCQUNELEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2pCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDdEQsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsb0JBQW9CLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQzNFO2FBQ0Y7U0FDRjtLQUNGO1NBQU0sSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7UUFDbEMsS0FBSyxJQUFJLElBQUksR0FBRyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQztnQkFBRSxTQUFTO1lBQ3hDLHFDQUFxQztZQUNyQyxJQUFJLElBQUksS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRTtnQkFDdkMsU0FBUzthQUNWO1lBQ0Qsb0RBQW9EO1lBQ3BELElBQUksSUFBSSxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO2dCQUNoQyxTQUFTLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ3ZCLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2xCO1lBQ0QsK0NBQStDO1lBQy9DLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO2dCQUNsQyxTQUFTLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ3ZCLE9BQU8sU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQzdCO1lBRUQsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RCLElBQUksT0FBTyxLQUFLLEtBQUssV0FBVyxFQUFFO2dCQUNoQyxTQUFTO2FBQ1Y7WUFFRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBRXBELElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNmLElBQUksZUFBZSxHQUFHLEVBQUUsQ0FBQztZQUN6QixJQUFJLG9CQUFvQixHQUFHLEtBQUssQ0FBQztZQUVqQyxJQUFJLGVBQWUsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckQsSUFBSSxlQUFlLEVBQUU7Z0JBQ25CLGVBQWUsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUMzQyxJQUFJLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzNCO2lCQUFNLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtnQkFDMUIsb0JBQW9CLEdBQUcsSUFBSSxDQUFDO2dCQUM1QixJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN2QjtZQUVELElBQUksT0FBTyxFQUFFO2dCQUNYLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQzthQUM5RjtpQkFBTTtnQkFFTCxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFO29CQUM1QixJQUFJLE1BQU0sRUFBRTt3QkFDVixJQUFJLGlCQUFpQixHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQ3ZFLHVDQUF1Qzt3QkFDdkMsSUFBSSxpQkFBaUI7NEJBQ25CLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQzVFLGlCQUFpQixDQUFDLElBQUksSUFBSSxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsRUFBRTs0QkFDdEQ7OytCQUVHOzRCQUVILElBQUksYUFBYSxHQUFRLEVBQUUsQ0FBQzs0QkFDNUIsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDOzRCQUNuQixJQUFJLFVBQVUsQ0FBQzs0QkFDZixJQUFJLGdCQUFnQixHQUFHLEVBQUUsQ0FBQzs0QkFFMUIsSUFBSSxZQUFZLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxJQUFJLGlCQUFpQixDQUFDLEtBQUssQ0FBQzs0QkFDckUsSUFBSSxZQUFZLEVBQUU7Z0NBQ2hCLFlBQVksR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7Z0NBQ3hDLFNBQVMsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDO2dDQUM5QixJQUFJLFlBQVksQ0FBQyxNQUFNLEtBQUssVUFBVSxFQUFFO29DQUN0QyxnQkFBZ0I7b0NBQ2hCLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQztvQ0FDaEQsYUFBYSxHQUFHLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQ0FDeEQsSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLEVBQUU7d0NBQzFDLGFBQWEsR0FBRyxRQUFRLENBQUM7cUNBQzFCO2lDQUNGO3FDQUFNO29DQUNMLGFBQWEsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDO29DQUNwQyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsRUFBRTt3Q0FDMUMsYUFBYSxHQUFHLFFBQVEsQ0FBQztxQ0FDMUI7b0NBQ0QsVUFBVSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7aUNBQ25GO2dDQUVELElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQztnQ0FDeEIsOENBQThDO2dDQUM5QyxJQUFJLGlCQUFpQixDQUFDLEtBQUssSUFBSSxpQkFBaUIsQ0FBQyxlQUFlLEtBQUssU0FBUyxFQUFFO29DQUM5RSxJQUFJLGlCQUFpQixDQUFDLEtBQUssS0FBSyxhQUFhLEVBQUU7d0NBQzdDLFdBQVcsR0FBRyxJQUFJLENBQUM7cUNBQ3BCO3lDQUFNLElBQUksaUJBQWlCLENBQUMsS0FBSyxLQUFLLFdBQVcsRUFBRTt3Q0FDbEQsV0FBVyxHQUFHLEtBQUssQ0FBQztxQ0FDckI7eUNBQU07d0NBQ0wsV0FBVyxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsS0FBSyxXQUFXLENBQUM7cUNBQzFEO2lDQUNGO2dDQUNELElBQUksV0FBVyxFQUFFO29DQUNmLGFBQWEsR0FBRyxFQUFFLENBQUM7aUNBQ3BCO2dDQUVELElBQUksVUFBVSxJQUFJLGFBQWEsRUFBRTtvQ0FDL0IsSUFBSSxTQUFTLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxFQUFFO3dDQUN6RCxnQkFBZ0IsR0FBRyxTQUFTLEdBQUcsYUFBYSxHQUFHLElBQUksR0FBRyxVQUFVLEdBQUcsR0FBRyxDQUFDO3dDQUN2RSxXQUFXLElBQUksZ0JBQWdCLENBQUM7cUNBQ2pDO2lDQUNGOzZCQUNGOzRCQUVELElBQUkseUJBQXlCLENBQUM7NEJBQzlCLElBQUksaUJBQWlCLENBQUMsS0FBSyxFQUFFO2dDQUMzQixJQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7Z0NBQ3BELElBQUksVUFBVSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7Z0NBQ2xDLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7Z0NBQzdFLFVBQVUsR0FBRyxPQUFPLENBQUM7Z0NBQ3JCLElBQUksT0FBTyxLQUFLLGtDQUFrQyxJQUFJLFVBQVUsS0FBSyxVQUFVLEVBQUU7b0NBQy9FLHVEQUF1RDtvQ0FDdkQsU0FBUyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7aUNBQzdDO2dDQUNELHlCQUF5QjtvQ0FDdkIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLGlCQUFpQixDQUFDOzZCQUNyRTtpQ0FBTTtnQ0FDTCx5QkFBeUI7b0NBQ3ZCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLElBQUksaUJBQWlCLENBQUM7NkJBQ3JFOzRCQUVELElBQUksaUJBQWlCLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEVBQUU7Z0NBQ3pFLGFBQWEsR0FBRyxRQUFRLENBQUM7Z0NBQ3pCLFVBQVUsR0FBRyxLQUFLLENBQUM7NkJBQ3BCOzRCQUVELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRTtnQ0FDckMsYUFBYSxHQUFHLEVBQUUsQ0FBQztnQ0FDbkIsVUFBVSxHQUFHLEVBQUUsQ0FBQzs2QkFDakI7NEJBRUQsRUFBRSxHQUFHLGFBQWEsQ0FBQzs0QkFFbkIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dDQUN4Qix1REFBdUQ7Z0NBQ3ZELGFBQWEsR0FBRztvQ0FDZCxPQUFPLEVBQUUsYUFBYTtvQ0FDdEIsTUFBTSxFQUFFLEVBQUU7aUNBQ1gsQ0FBQzs2QkFDSDtpQ0FBTTtnQ0FDTCwwQ0FBMEM7Z0NBQzFDLGdCQUFnQixHQUFHLElBQUksQ0FBQzs2QkFDekI7NEJBRUQsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUM3RCxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUseUJBQXlCLEVBQUUsU0FBUyxDQUFDLENBQUM7eUJBQ2xFOzZCQUFNLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsUUFBUSxFQUFFOzRCQUN0Rix5RUFBeUU7NEJBQ3pFLElBQUksNEJBQTRCLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUMzRCxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUM3QyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7NEJBRWxELGVBQWUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDOzRCQUNsRSxTQUFTLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQ3BFLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzs0QkFDbEQsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUNuRixHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO3lCQUNqRjs2QkFBTTs0QkFDTCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0NBQ3hCLElBQUksR0FBRyxlQUFlLEdBQUcsSUFBSSxDQUFDOzZCQUMvQjs0QkFFRCxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7eUJBQ3RGO3FCQUNGO3lCQUFNO3dCQUNMLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztxQkFDdEY7aUJBQ0Y7YUFDRjtZQUVELEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMxQixJQUFJLGVBQWUsSUFBSSxDQUFDLFNBQVMsSUFBSSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFO2dCQUNqRixFQUFFLEdBQUcsUUFBUSxDQUFDO2FBQ2Y7aUJBQU0sSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQ3RDLEVBQUUsR0FBRyxFQUFFLENBQUM7YUFDVDtZQUVELElBQUksV0FBVyxHQUFHLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO1lBQ3JELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN6QixZQUFZO2dCQUNaLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLGVBQWUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFdBQVc7b0JBQ3RHLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFDekMsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUc7aUJBQzFCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDYjtZQUVELElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ2hCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUN6QixVQUFVO29CQUNWLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLGVBQWUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ3hHO2FBQ0Y7U0FDRjtLQUNGO1NBQU0sSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO1FBQzVCLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQzdEO0lBQ0QsU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3ZCLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN4QixDQUFDLENBQUM7QUFFRixJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixHQUFHLFVBQVUsS0FBSyxFQUFFLFNBQVM7SUFDM0QsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBRWQsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO1FBQ2xCLEtBQUssR0FBRyxFQUFFLENBQUM7S0FDWjtJQUVELElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ2hELElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUU7UUFDL0IsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztRQUUvQixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUM7UUFDakQscUVBQXFFO1FBQ3JFLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDWCxNQUFNLEdBQUcsU0FBUyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNyRDthQUFNO1lBQ0wsU0FBUyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDbkQ7UUFDRCxPQUFPLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztLQUN6QjtJQUdELElBQUksT0FBTyxFQUFFO1FBQ1gsS0FBSyxJQUFJLE9BQU8sSUFBSSxPQUFPLEVBQUU7WUFDM0IscUNBQXFDO1lBQ3JDLElBQUksT0FBTyxLQUFLLFVBQVUsRUFBRTtnQkFDMUIsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNqQyxJQUFJLElBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsR0FBRyxHQUFHLFNBQVMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO2dCQUN0RSxJQUFJLElBQUksU0FBUyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHLFNBQVMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO2dCQUVwRSxTQUFTO2FBQ1Y7aUJBQU07Z0JBQ0wsSUFBSSxJQUFJLEdBQUcsR0FBRyxPQUFPLEdBQUcsSUFBSSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7YUFDbEU7U0FDRjtLQUNGO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDLENBQUM7QUFFRjs7Ozs7R0FLRztBQUNILElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxHQUFHLFVBQVUsSUFBSSxFQUFFLEtBQUs7SUFDbkQsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1FBQ2hELE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFFRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3QyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTtRQUNuQyxPQUFPLElBQUksQ0FBQztLQUNiO0lBRUQsT0FBTyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ25DLENBQUMsQ0FBQztBQUVGLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLEdBQUcsVUFBVSxnQkFBZ0IsRUFBRSxTQUFTLEVBQUUsU0FBUztJQUNyRixJQUFJLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDbkMsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVELElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDZCxTQUFTLEdBQUcsRUFBRSxDQUFDO0tBQ2hCO0lBRUQsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFO1FBQzVDLDJDQUEyQztRQUMzQyxPQUFPLElBQUksQ0FBQztLQUNiO1NBQU07UUFDTCxTQUFTLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztLQUNsRDtJQUVELElBQUksS0FBSyxHQUFHLElBQUksRUFDZCxDQUFDLEdBQUcsQ0FBQyxFQUNMLEtBQUssRUFDTCxHQUFHLENBQUM7SUFFTixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLElBQUksZ0JBQWdCLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRTtRQUN4RixJQUFJLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUM7UUFFMUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2pDLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV2QixJQUFJLE9BQU8sQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO2dCQUMvQixLQUFLLEdBQUcsT0FBTyxDQUFDO2dCQUNoQixNQUFNO2FBQ1A7U0FDRjtLQUNGO0lBRUQsSUFBSSxNQUFNLEdBQUcsZ0JBQWdCLENBQUM7SUFDOUIsSUFBSSxNQUFNLENBQUMsS0FBSyxLQUFLLFNBQVMsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtRQUMzRCxPQUFPLE1BQU0sQ0FBQztLQUNmO0lBQ0QsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFO1FBQ2YsR0FBRyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUIsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtZQUMxQixPQUFPLE1BQU0sQ0FBQztTQUNmO0tBQ0Y7SUFFRCxJQUFJLFVBQVUsQ0FBQztJQUVmLDREQUE0RDtJQUM1RCxJQUFJLE1BQU0sQ0FBQyxLQUFLLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDMUMsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssVUFBVSxFQUFFO1lBQ2xDLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQztTQUNoRDthQUFNO1lBQ0wsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN0RDtRQUNELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM3RCxJQUFJLE9BQU8sRUFBRTtZQUNYLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDbEU7S0FDRjtJQUVELElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRTtRQUNuQixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2xELEtBQUssR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNoRSxJQUFJLEtBQUssRUFBRTtnQkFDVCxNQUFNO2FBQ1A7WUFFRCxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUU7Z0JBQ2YsSUFBSSxTQUFTLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDeEMsSUFBSSxjQUFjLEdBQUcsU0FBUyxDQUFDLE1BQU0sS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztnQkFDN0UsVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFFdkYsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUVoRSxJQUFJLFNBQVMsRUFBRTtvQkFDYixLQUFLLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBRXBFLElBQUksS0FBSyxFQUFFO3dCQUNULEtBQUssQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO3dCQUN0QyxLQUFLLENBQUMsS0FBSyxHQUFHLGNBQWMsR0FBRyxHQUFHLEdBQUcsU0FBUyxDQUFDO3dCQUMvQyxNQUFNO3FCQUNQO2lCQUNGO2FBQ0Y7U0FDRjtLQUVGO0lBRUQsSUFBSSxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRTtRQUN4QyxPQUFPLE1BQU0sQ0FBQztLQUNmO0lBRUQsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDLENBQUM7QUFFRixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxVQUFVLEdBQUc7SUFDbkMsSUFBSSxJQUFJLEdBQUcsSUFBSSxFQUNiLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUNwQixLQUFLLEdBQUcsRUFBRSxFQUNWLElBQUksR0FBRyxJQUFJLEVBQ1gsS0FBSyxHQUFHLElBQUksRUFDWixNQUFNLEdBQUcsSUFBSSxFQUNiLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBRXpCLENBQUMsQ0FBQyxTQUFTLEdBQUcsVUFBVSxJQUFJO1FBQzFCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUU1QixJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNsQyxJQUFJLElBQUksQ0FBQztRQUNULElBQUksR0FBRyxFQUFFO1lBQ1AsSUFBSTtnQkFDRixHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQ2pEO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1YsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtvQkFDdkIsTUFBTSxDQUFDLENBQUM7aUJBQ1Q7cUJBQU07b0JBQ0wsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7aUJBQ2pEO2FBQ0Y7U0FDRjthQUFNO1lBQ0wsSUFBSSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDL0IsSUFBSSxJQUFJLEtBQUssYUFBYSxFQUFFO2dCQUMxQixJQUFJLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUN0RCxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2xCO2lCQUFNLElBQUksSUFBSSxLQUFLLFFBQVEsRUFBRTtnQkFDNUIsd0ZBQXdGO2dCQUN4RixJQUFJLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxhQUFhLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNyRCxLQUFLLEdBQUcsSUFBSSxZQUFZLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDMUMsTUFBTSxHQUFHLElBQUksYUFBYSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ25ELEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3JCLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDcEI7aUJBQU07Z0JBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO2FBQy9EO1NBQ0Y7SUFDSCxDQUFDLENBQUM7SUFFRixDQUFDLENBQUMsVUFBVSxHQUFHLFVBQVUsSUFBSTtRQUMzQixJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUMsR0FBRyxFQUFFLHVCQUF1QixHQUFHLElBQUksQ0FBQyxDQUFDO1FBRTVDLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUMsQ0FBQztJQUVGLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFFckIsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDLENBQUM7QUFFRixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxVQUFVLEdBQUc7SUFDckMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxHQUFHO1FBQzlCLEtBQUssRUFBRSxFQUFFO0tBQ1YsQ0FBQztJQUNGLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2pCLENBQUMsQ0FBQztBQUVGLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxHQUFHLFVBQVUsUUFBUTtBQUVqRCxDQUFDLENBQUM7QUFJRixJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRztJQUN6QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztJQUNuQyxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDYixLQUFLLElBQUksS0FBSyxJQUFJLEtBQUssRUFBRTtRQUN2QixJQUFJLEtBQUssS0FBSyxFQUFFLElBQUksS0FBSyxLQUFLLFVBQVUsRUFBRTtZQUN4QyxTQUFTO1NBQ1Y7UUFDRCxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEIsUUFBUSxFQUFFLEVBQUU7WUFDVixLQUFLLGdDQUFnQyxDQUFDLENBQUMsYUFBYTtZQUNwRCxLQUFLLGtDQUFrQyxDQUFDLENBQUMsT0FBTztZQUNoRCxLQUFLLHVDQUF1QyxDQUFDLENBQUMsV0FBVztZQUN6RCxLQUFLLHlDQUF5QyxDQUFDLENBQUMsYUFBYTtZQUM3RCxLQUFLLDJDQUEyQyxDQUFDLENBQUMsVUFBVTtZQUM1RCxLQUFLLGtDQUFrQyxFQUFFLE1BQU07Z0JBQzdDLFNBQVM7U0FDWjtRQUNELElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLDZCQUE2QixDQUFDLEVBQUU7WUFDOUMsU0FBUztTQUNWO1FBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsRUFBRTtZQUNyQyxTQUFTO1NBQ1Y7UUFDRCxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFO1lBQ3pDLFNBQVM7U0FDVjtRQUNELEdBQUcsSUFBSSxTQUFTLEdBQUcsS0FBSyxHQUFHLElBQUksR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDO0tBQzVDO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDLENBQUM7QUFFRjs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFDSCxTQUFTLG1CQUFtQixDQUFDLEdBQUcsRUFBRSxPQUFPO0lBQ3ZDLElBQUksU0FBUyxFQUNYLFVBQVUsQ0FBQztJQUViLHVDQUF1QztJQUN2Qyx3QkFBd0I7SUFDeEIsa0JBQWtCO0lBQ2xCLElBQUk7SUFFSixVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQztJQUVoQyxJQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDL0Isb0RBQW9EO1FBQ3BELE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0lBRUQsT0FBTyxTQUFTLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFFRCxNQUFNLFVBQWdCLFNBQVMsQ0FBQyxHQUFHLEVBQUUsT0FBTzs7UUFDMUMsdUNBQXVDO1FBQ3ZDLHdCQUF3QjtRQUN4QixrQkFBa0I7UUFDbEIsSUFBSTtRQUVKLG1EQUFtRDtRQUNuRCxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQztRQUMxQyxJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO1FBQzNDLElBQUksZUFBZSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7UUFFM0MsWUFBWTtRQUNaLCtCQUErQjtRQUMvQix1Q0FBdUM7UUFDdkMsNERBQTREO1FBQzVELG9CQUFvQjtRQUNwQiwwQkFBMEI7UUFDMUIsV0FBVztRQUNYLGdCQUFnQjtRQUNoQixzREFBc0Q7UUFDdEQscUNBQXFDO1FBQ3JDLHlDQUF5QztRQUN6QyxtQ0FBbUM7UUFDbkMsV0FBVztRQUNYLFdBQVc7UUFDWCxJQUFJO1FBQ0osU0FBUztRQUNULG1DQUFtQztRQUNuQyxvRUFBb0U7UUFDcEUsc0ZBQXNGO1FBQ3RGLGlCQUFpQjtRQUNqQix1QkFBdUI7UUFDdkIsNERBQTREO1FBQzVELG1EQUFtRDtRQUNuRCxrQ0FBa0M7UUFDbEMsc0NBQXNDO1FBQ3RDLGdDQUFnQztRQUNoQyxlQUFlO1FBQ2YsNElBQTRJO1FBQzVJLFFBQVE7UUFDUiwwQ0FBMEM7UUFDMUMsSUFBSTtRQUNKLGVBQWU7UUFFZixPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sVUFBVSxHQUFlLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFDbEQsTUFBTSxPQUFPLEdBQUcsTUFBTSxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hGLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUM1QyxNQUFNLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzdDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7WUFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FBQztRQUNILDhCQUE4QjtRQUM5QixPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0NBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDExIFZpbmF5IFB1bGltIDx2aW5heUBtaWxld2lzZS5jb20+XG4gKiBNSVQgTGljZW5zZWRcbiAqXG4gKi9cbi8qanNoaW50IHByb3RvOnRydWUqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0ICogYXMgc2F4IGZyb20gJ3NheCc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgTmFtZXNwYWNlQ29udGV4dCB9IMKgZnJvbSAnLi9uc2NvbnRleHQnO1xuXG5pbXBvcnQgKiBhcyB1cmwgZnJvbSAndXJsJztcbmltcG9ydCB7IG9rIGFzIGFzc2VydCB9IGZyb20gJ2Fzc2VydCc7XG4vLyBpbXBvcnQgc3RyaXBCb20gZnJvbSAnc3RyaXAtYm9tJztcblxuY29uc3Qgc3RyaXBCb20gPSAoeDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgLy8gQ2F0Y2hlcyBFRkJCQkYgKFVURi04IEJPTSkgYmVjYXVzZSB0aGUgYnVmZmVyLXRvLXN0cmluZ1xuICAvLyBjb252ZXJzaW9uIHRyYW5zbGF0ZXMgaXQgdG8gRkVGRiAoVVRGLTE2IEJPTSlcbiAgaWYgKHguY2hhckNvZGVBdCgwKSA9PT0gMHhGRUZGKSB7XG4gICAgcmV0dXJuIHguc2xpY2UoMSk7XG4gIH1cblxuICByZXR1cm4geDtcbn1cblxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnLi91dGlscyc7XG5cblxubGV0IFROU19QUkVGSVggPSB1dGlscy5UTlNfUFJFRklYO1xubGV0IGZpbmRQcmVmaXggPSB1dGlscy5maW5kUHJlZml4O1xuXG5sZXQgUHJpbWl0aXZlcyA9IHtcbiAgc3RyaW5nOiAxLFxuICBib29sZWFuOiAxLFxuICBkZWNpbWFsOiAxLFxuICBmbG9hdDogMSxcbiAgZG91YmxlOiAxLFxuICBhbnlUeXBlOiAxLFxuICBieXRlOiAxLFxuICBpbnQ6IDEsXG4gIGxvbmc6IDEsXG4gIHNob3J0OiAxLFxuICBuZWdhdGl2ZUludGVnZXI6IDEsXG4gIG5vbk5lZ2F0aXZlSW50ZWdlcjogMSxcbiAgcG9zaXRpdmVJbnRlZ2VyOiAxLFxuICBub25Qb3NpdGl2ZUludGVnZXI6IDEsXG4gIHVuc2lnbmVkQnl0ZTogMSxcbiAgdW5zaWduZWRJbnQ6IDEsXG4gIHVuc2lnbmVkTG9uZzogMSxcbiAgdW5zaWduZWRTaG9ydDogMSxcbiAgZHVyYXRpb246IDAsXG4gIGRhdGVUaW1lOiAwLFxuICB0aW1lOiAwLFxuICBkYXRlOiAwLFxuICBnWWVhck1vbnRoOiAwLFxuICBnWWVhcjogMCxcbiAgZ01vbnRoRGF5OiAwLFxuICBnRGF5OiAwLFxuICBnTW9udGg6IDAsXG4gIGhleEJpbmFyeTogMCxcbiAgYmFzZTY0QmluYXJ5OiAwLFxuICBhbnlVUkk6IDAsXG4gIFFOYW1lOiAwLFxuICBOT1RBVElPTjogMFxufTtcblxuZnVuY3Rpb24gc3BsaXRRTmFtZShuc05hbWUpIHtcbiAgbGV0IGkgPSB0eXBlb2YgbnNOYW1lID09PSAnc3RyaW5nJyA/IG5zTmFtZS5pbmRleE9mKCc6JykgOiAtMTtcbiAgcmV0dXJuIGkgPCAwID8geyBwcmVmaXg6IFROU19QUkVGSVgsIG5hbWU6IG5zTmFtZSB9IDpcbiAgICB7IHByZWZpeDogbnNOYW1lLnN1YnN0cmluZygwLCBpKSwgbmFtZTogbnNOYW1lLnN1YnN0cmluZyhpICsgMSkgfTtcbn1cblxuZnVuY3Rpb24geG1sRXNjYXBlKG9iaikge1xuICBpZiAodHlwZW9mIChvYmopID09PSAnc3RyaW5nJykge1xuICAgIGlmIChvYmouc3Vic3RyKDAsIDkpID09PSAnPCFbQ0RBVEFbJyAmJiBvYmouc3Vic3RyKC0zKSA9PT0gXCJdXT5cIikge1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgcmV0dXJuIG9ialxuICAgICAgLnJlcGxhY2UoLyYvZywgJyZhbXA7JylcbiAgICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7JylcbiAgICAgIC5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7JylcbiAgICAgIC5yZXBsYWNlKC8nL2csICcmYXBvczsnKTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbmxldCB0cmltTGVmdCA9IC9eW1xcc1xceEEwXSsvO1xubGV0IHRyaW1SaWdodCA9IC9bXFxzXFx4QTBdKyQvO1xuXG5mdW5jdGlvbiB0cmltKHRleHQpIHtcbiAgcmV0dXJuIHRleHQucmVwbGFjZSh0cmltTGVmdCwgJycpLnJlcGxhY2UodHJpbVJpZ2h0LCAnJyk7XG59XG5cbmZ1bmN0aW9uIGRlZXBNZXJnZShkZXN0aW5hdGlvbiwgc291cmNlKSB7XG4gIHJldHVybiBfLm1lcmdlV2l0aChkZXN0aW5hdGlvbiB8fCB7fSwgc291cmNlLCBmdW5jdGlvbiAoYSwgYikge1xuICAgIHJldHVybiBfLmlzQXJyYXkoYSkgPyBhLmNvbmNhdChiKSA6IHVuZGVmaW5lZDtcbiAgfSk7XG59XG5cbmxldCBFbGVtZW50OiBhbnkgPSBmdW5jdGlvbiAobnNOYW1lLCBhdHRycywgb3B0aW9ucykge1xuICBsZXQgcGFydHMgPSBzcGxpdFFOYW1lKG5zTmFtZSk7XG5cbiAgdGhpcy5uc05hbWUgPSBuc05hbWU7XG4gIHRoaXMucHJlZml4ID0gcGFydHMucHJlZml4O1xuICB0aGlzLm5hbWUgPSBwYXJ0cy5uYW1lO1xuICB0aGlzLmNoaWxkcmVuID0gW107XG4gIHRoaXMueG1sbnMgPSB7fTtcblxuICB0aGlzLl9pbml0aWFsaXplT3B0aW9ucyhvcHRpb25zKTtcblxuICBmb3IgKGxldCBrZXkgaW4gYXR0cnMpIHtcbiAgICBsZXQgbWF0Y2ggPSAvXnhtbG5zOj8oLiopJC8uZXhlYyhrZXkpO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgdGhpcy54bWxuc1ttYXRjaFsxXSA/IG1hdGNoWzFdIDogVE5TX1BSRUZJWF0gPSBhdHRyc1trZXldO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGlmIChrZXkgPT09ICd2YWx1ZScpIHtcbiAgICAgICAgdGhpc1t0aGlzLnZhbHVlS2V5XSA9IGF0dHJzW2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzWyckJyArIGtleV0gPSBhdHRyc1trZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAodGhpcy4kdGFyZ2V0TmFtZXNwYWNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBBZGQgdGFyZ2V0TmFtZXNwYWNlIHRvIHRoZSBtYXBwaW5nXG4gICAgdGhpcy54bWxuc1tUTlNfUFJFRklYXSA9IHRoaXMuJHRhcmdldE5hbWVzcGFjZTtcbiAgfVxufTtcblxuRWxlbWVudC5wcm90b3R5cGUuX2luaXRpYWxpemVPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMpIHtcbiAgICB0aGlzLnZhbHVlS2V5ID0gb3B0aW9ucy52YWx1ZUtleSB8fCAnJHZhbHVlJztcbiAgICB0aGlzLnhtbEtleSA9IG9wdGlvbnMueG1sS2V5IHx8ICckeG1sJztcbiAgICB0aGlzLmlnbm9yZWROYW1lc3BhY2VzID0gb3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcyB8fCBbXTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnZhbHVlS2V5ID0gJyR2YWx1ZSc7XG4gICAgdGhpcy54bWxLZXkgPSAnJHhtbCc7XG4gICAgdGhpcy5pZ25vcmVkTmFtZXNwYWNlcyA9IFtdO1xuICB9XG59O1xuXG5FbGVtZW50LnByb3RvdHlwZS5kZWxldGVGaXhlZEF0dHJzID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmNoaWxkcmVuICYmIHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09PSAwICYmIGRlbGV0ZSB0aGlzLmNoaWxkcmVuO1xuICB0aGlzLnhtbG5zICYmIE9iamVjdC5rZXlzKHRoaXMueG1sbnMpLmxlbmd0aCA9PT0gMCAmJiBkZWxldGUgdGhpcy54bWxucztcbiAgZGVsZXRlIHRoaXMubnNOYW1lO1xuICBkZWxldGUgdGhpcy5wcmVmaXg7XG4gIGRlbGV0ZSB0aGlzLm5hbWU7XG59O1xuXG5FbGVtZW50LnByb3RvdHlwZS5hbGxvd2VkQ2hpbGRyZW4gPSBbXTtcblxuRWxlbWVudC5wcm90b3R5cGUuc3RhcnRFbGVtZW50ID0gZnVuY3Rpb24gKHN0YWNrLCBuc05hbWUsIGF0dHJzLCBvcHRpb25zKSB7XG4gIGlmICghdGhpcy5hbGxvd2VkQ2hpbGRyZW4pIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgQ2hpbGRDbGFzcyA9IHRoaXMuYWxsb3dlZENoaWxkcmVuW3NwbGl0UU5hbWUobnNOYW1lKS5uYW1lXSxcbiAgICBlbGVtZW50ID0gbnVsbDtcblxuICBpZiAoQ2hpbGRDbGFzcykge1xuICAgIHN0YWNrLnB1c2gobmV3IENoaWxkQ2xhc3MobnNOYW1lLCBhdHRycywgb3B0aW9ucykpO1xuICB9XG4gIGVsc2Uge1xuICAgIHRoaXMudW5leHBlY3RlZChuc05hbWUpO1xuICB9XG5cbn07XG5cbkVsZW1lbnQucHJvdG90eXBlLmVuZEVsZW1lbnQgPSBmdW5jdGlvbiAoc3RhY2ssIG5zTmFtZSkge1xuICBpZiAodGhpcy5uc05hbWUgPT09IG5zTmFtZSkge1xuICAgIGlmIChzdGFjay5sZW5ndGggPCAyKVxuICAgICAgcmV0dXJuO1xuICAgIGxldCBwYXJlbnQgPSBzdGFja1tzdGFjay5sZW5ndGggLSAyXTtcbiAgICBpZiAodGhpcyAhPT0gc3RhY2tbMF0pIHtcbiAgICAgIF8uZGVmYXVsdHNEZWVwKHN0YWNrWzBdLnhtbG5zLCB0aGlzLnhtbG5zKTtcbiAgICAgIC8vIGRlbGV0ZSB0aGlzLnhtbG5zO1xuICAgICAgcGFyZW50LmNoaWxkcmVuLnB1c2godGhpcyk7XG4gICAgICBwYXJlbnQuYWRkQ2hpbGQodGhpcyk7XG4gICAgfVxuICAgIHN0YWNrLnBvcCgpO1xuICB9XG59O1xuXG5FbGVtZW50LnByb3RvdHlwZS5hZGRDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZCkge1xuICByZXR1cm47XG59O1xuXG5FbGVtZW50LnByb3RvdHlwZS51bmV4cGVjdGVkID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdGb3VuZCB1bmV4cGVjdGVkIGVsZW1lbnQgKCcgKyBuYW1lICsgJykgaW5zaWRlICcgKyB0aGlzLm5zTmFtZSk7XG59O1xuXG5FbGVtZW50LnByb3RvdHlwZS5kZXNjcmlwdGlvbiA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucykge1xuICByZXR1cm4gdGhpcy4kbmFtZSB8fCB0aGlzLm5hbWU7XG59O1xuXG5FbGVtZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xufTtcblxuRWxlbWVudC5jcmVhdGVTdWJDbGFzcyA9IGZ1bmN0aW9uICgpIHtcbiAgbGV0IHJvb3QgPSB0aGlzO1xuICBsZXQgc3ViRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICByb290LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5pbml0KCk7XG4gIH07XG4gIC8vIGluaGVyaXRzKHN1YkVsZW1lbnQsIHJvb3QpO1xuICBzdWJFbGVtZW50LnByb3RvdHlwZS5fX3Byb3RvX18gPSByb290LnByb3RvdHlwZTtcbiAgcmV0dXJuIHN1YkVsZW1lbnQ7XG59O1xuXG5cbmxldCBFbGVtZW50RWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcbmxldCBBbnlFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IElucHV0RWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcbmxldCBPdXRwdXRFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IFNpbXBsZVR5cGVFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IFJlc3RyaWN0aW9uRWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcbmxldCBFeHRlbnNpb25FbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IENob2ljZUVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XG5sZXQgRW51bWVyYXRpb25FbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IENvbXBsZXhUeXBlRWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcbmxldCBDb21wbGV4Q29udGVudEVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XG5sZXQgU2ltcGxlQ29udGVudEVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XG5sZXQgU2VxdWVuY2VFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IEFsbEVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XG5sZXQgTWVzc2FnZUVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XG5sZXQgRG9jdW1lbnRhdGlvbkVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XG5cbmxldCBTY2hlbWFFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IFR5cGVzRWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcbmxldCBPcGVyYXRpb25FbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IFBvcnRUeXBlRWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcbmxldCBCaW5kaW5nRWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcbmxldCBQb3J0RWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcbmxldCBTZXJ2aWNlRWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcbmxldCBEZWZpbml0aW9uc0VsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XG5cbmxldCBFbGVtZW50VHlwZU1hcCA9IHtcbiAgdHlwZXM6IFtUeXBlc0VsZW1lbnQsICdzY2hlbWEgZG9jdW1lbnRhdGlvbiddLFxuICBzY2hlbWE6IFtTY2hlbWFFbGVtZW50LCAnZWxlbWVudCBjb21wbGV4VHlwZSBzaW1wbGVUeXBlIGluY2x1ZGUgaW1wb3J0J10sXG4gIGVsZW1lbnQ6IFtFbGVtZW50RWxlbWVudCwgJ2Fubm90YXRpb24gY29tcGxleFR5cGUnXSxcbiAgYW55OiBbQW55RWxlbWVudCwgJyddLFxuICBzaW1wbGVUeXBlOiBbU2ltcGxlVHlwZUVsZW1lbnQsICdyZXN0cmljdGlvbiddLFxuICByZXN0cmljdGlvbjogW1Jlc3RyaWN0aW9uRWxlbWVudCwgJ2VudW1lcmF0aW9uIGFsbCBjaG9pY2Ugc2VxdWVuY2UnXSxcbiAgZXh0ZW5zaW9uOiBbRXh0ZW5zaW9uRWxlbWVudCwgJ2FsbCBzZXF1ZW5jZSBjaG9pY2UnXSxcbiAgY2hvaWNlOiBbQ2hvaWNlRWxlbWVudCwgJ2VsZW1lbnQgc2VxdWVuY2UgY2hvaWNlIGFueSddLFxuICAvLyBncm91cDogW0dyb3VwRWxlbWVudCwgJ2VsZW1lbnQgZ3JvdXAnXSxcbiAgZW51bWVyYXRpb246IFtFbnVtZXJhdGlvbkVsZW1lbnQsICcnXSxcbiAgY29tcGxleFR5cGU6IFtDb21wbGV4VHlwZUVsZW1lbnQsICdhbm5vdGF0aW9uIHNlcXVlbmNlIGFsbCBjb21wbGV4Q29udGVudCBzaW1wbGVDb250ZW50IGNob2ljZSddLFxuICBjb21wbGV4Q29udGVudDogW0NvbXBsZXhDb250ZW50RWxlbWVudCwgJ2V4dGVuc2lvbiddLFxuICBzaW1wbGVDb250ZW50OiBbU2ltcGxlQ29udGVudEVsZW1lbnQsICdleHRlbnNpb24nXSxcbiAgc2VxdWVuY2U6IFtTZXF1ZW5jZUVsZW1lbnQsICdlbGVtZW50IHNlcXVlbmNlIGNob2ljZSBhbnknXSxcbiAgYWxsOiBbQWxsRWxlbWVudCwgJ2VsZW1lbnQgY2hvaWNlJ10sXG5cbiAgc2VydmljZTogW1NlcnZpY2VFbGVtZW50LCAncG9ydCBkb2N1bWVudGF0aW9uJ10sXG4gIHBvcnQ6IFtQb3J0RWxlbWVudCwgJ2FkZHJlc3MgZG9jdW1lbnRhdGlvbiddLFxuICBiaW5kaW5nOiBbQmluZGluZ0VsZW1lbnQsICdfYmluZGluZyBTZWN1cml0eVNwZWMgb3BlcmF0aW9uIGRvY3VtZW50YXRpb24nXSxcbiAgcG9ydFR5cGU6IFtQb3J0VHlwZUVsZW1lbnQsICdvcGVyYXRpb24gZG9jdW1lbnRhdGlvbiddLFxuICBtZXNzYWdlOiBbTWVzc2FnZUVsZW1lbnQsICdwYXJ0IGRvY3VtZW50YXRpb24nXSxcbiAgb3BlcmF0aW9uOiBbT3BlcmF0aW9uRWxlbWVudCwgJ2RvY3VtZW50YXRpb24gaW5wdXQgb3V0cHV0IGZhdWx0IF9vcGVyYXRpb24nXSxcbiAgaW5wdXQ6IFtJbnB1dEVsZW1lbnQsICdib2R5IFNlY3VyaXR5U3BlY1JlZiBkb2N1bWVudGF0aW9uIGhlYWRlciddLFxuICBvdXRwdXQ6IFtPdXRwdXRFbGVtZW50LCAnYm9keSBTZWN1cml0eVNwZWNSZWYgZG9jdW1lbnRhdGlvbiBoZWFkZXInXSxcbiAgZmF1bHQ6IFtFbGVtZW50LCAnX2ZhdWx0IGRvY3VtZW50YXRpb24nXSxcbiAgZGVmaW5pdGlvbnM6IFtEZWZpbml0aW9uc0VsZW1lbnQsICd0eXBlcyBtZXNzYWdlIHBvcnRUeXBlIGJpbmRpbmcgc2VydmljZSBpbXBvcnQgZG9jdW1lbnRhdGlvbiddLFxuICBkb2N1bWVudGF0aW9uOiBbRG9jdW1lbnRhdGlvbkVsZW1lbnQsICcnXVxufTtcblxuZnVuY3Rpb24gbWFwRWxlbWVudFR5cGVzKHR5cGVzKSB7XG4gIGxldCBydG4gPSB7fTtcbiAgdHlwZXMgPSB0eXBlcy5zcGxpdCgnICcpO1xuICB0eXBlcy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgcnRuW3R5cGUucmVwbGFjZSgvXl8vLCAnJyldID0gKEVsZW1lbnRUeXBlTWFwW3R5cGVdIHx8IFtFbGVtZW50XSlbMF07XG4gIH0pO1xuICByZXR1cm4gcnRuO1xufVxuXG5mb3IgKGxldCBuIGluIEVsZW1lbnRUeXBlTWFwKSB7XG4gIGxldCB2ID0gRWxlbWVudFR5cGVNYXBbbl07XG4gIHZbMF0ucHJvdG90eXBlLmFsbG93ZWRDaGlsZHJlbiA9IG1hcEVsZW1lbnRUeXBlcyh2WzFdKTtcbn1cblxuTWVzc2FnZUVsZW1lbnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuZWxlbWVudCA9IG51bGw7XG4gIHRoaXMucGFydHMgPSBudWxsO1xufTtcblxuU2NoZW1hRWxlbWVudC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5jb21wbGV4VHlwZXMgPSB7fTtcbiAgdGhpcy50eXBlcyA9IHt9O1xuICB0aGlzLmVsZW1lbnRzID0ge307XG4gIHRoaXMuaW5jbHVkZXMgPSBbXTtcbn07XG5cblR5cGVzRWxlbWVudC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5zY2hlbWFzID0ge307XG59O1xuXG5PcGVyYXRpb25FbGVtZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmlucHV0ID0gbnVsbDtcbiAgdGhpcy5vdXRwdXQgPSBudWxsO1xuICB0aGlzLmlucHV0U29hcCA9IG51bGw7XG4gIHRoaXMub3V0cHV0U29hcCA9IG51bGw7XG4gIHRoaXMuc3R5bGUgPSAnJztcbiAgdGhpcy5zb2FwQWN0aW9uID0gJyc7XG59O1xuXG5Qb3J0VHlwZUVsZW1lbnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMubWV0aG9kcyA9IHt9O1xufTtcblxuQmluZGluZ0VsZW1lbnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMudHJhbnNwb3J0ID0gJyc7XG4gIHRoaXMuc3R5bGUgPSAnJztcbiAgdGhpcy5tZXRob2RzID0ge307XG59O1xuXG5Qb3J0RWxlbWVudC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5sb2NhdGlvbiA9IG51bGw7XG59O1xuXG5TZXJ2aWNlRWxlbWVudC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5wb3J0cyA9IHt9O1xufTtcblxuRGVmaW5pdGlvbnNFbGVtZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5uYW1lICE9PSAnZGVmaW5pdGlvbnMnKSB0aGlzLnVuZXhwZWN0ZWQodGhpcy5uc05hbWUpO1xuICB0aGlzLm1lc3NhZ2VzID0ge307XG4gIHRoaXMucG9ydFR5cGVzID0ge307XG4gIHRoaXMuYmluZGluZ3MgPSB7fTtcbiAgdGhpcy5zZXJ2aWNlcyA9IHt9O1xuICB0aGlzLnNjaGVtYXMgPSB7fTtcbn07XG5cbkRvY3VtZW50YXRpb25FbGVtZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xufTtcblxuU2NoZW1hRWxlbWVudC5wcm90b3R5cGUubWVyZ2UgPSBmdW5jdGlvbiAoc291cmNlKSB7XG4gIGFzc2VydChzb3VyY2UgaW5zdGFuY2VvZiBTY2hlbWFFbGVtZW50KTtcbiAgaWYgKHRoaXMuJHRhcmdldE5hbWVzcGFjZSA9PT0gc291cmNlLiR0YXJnZXROYW1lc3BhY2UpIHtcbiAgICBfLm1lcmdlKHRoaXMuY29tcGxleFR5cGVzLCBzb3VyY2UuY29tcGxleFR5cGVzKTtcbiAgICBfLm1lcmdlKHRoaXMudHlwZXMsIHNvdXJjZS50eXBlcyk7XG4gICAgXy5tZXJnZSh0aGlzLmVsZW1lbnRzLCBzb3VyY2UuZWxlbWVudHMpO1xuICAgIF8ubWVyZ2UodGhpcy54bWxucywgc291cmNlLnhtbG5zKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cblxuU2NoZW1hRWxlbWVudC5wcm90b3R5cGUuYWRkQ2hpbGQgPSBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgaWYgKGNoaWxkLiRuYW1lIGluIFByaW1pdGl2ZXMpXG4gICAgcmV0dXJuO1xuICBpZiAoY2hpbGQubmFtZSA9PT0gJ2luY2x1ZGUnIHx8IGNoaWxkLm5hbWUgPT09ICdpbXBvcnQnKSB7XG4gICAgbGV0IGxvY2F0aW9uID0gY2hpbGQuJHNjaGVtYUxvY2F0aW9uIHx8IGNoaWxkLiRsb2NhdGlvbjtcbiAgICBpZiAobG9jYXRpb24pIHtcbiAgICAgIHRoaXMuaW5jbHVkZXMucHVzaCh7XG4gICAgICAgIG5hbWVzcGFjZTogY2hpbGQuJG5hbWVzcGFjZSB8fCBjaGlsZC4kdGFyZ2V0TmFtZXNwYWNlIHx8IHRoaXMuJHRhcmdldE5hbWVzcGFjZSxcbiAgICAgICAgbG9jYXRpb246IGxvY2F0aW9uXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgZWxzZSBpZiAoY2hpbGQubmFtZSA9PT0gJ2NvbXBsZXhUeXBlJykge1xuICAgIHRoaXMuY29tcGxleFR5cGVzW2NoaWxkLiRuYW1lXSA9IGNoaWxkO1xuICB9XG4gIGVsc2UgaWYgKGNoaWxkLm5hbWUgPT09ICdlbGVtZW50Jykge1xuICAgIHRoaXMuZWxlbWVudHNbY2hpbGQuJG5hbWVdID0gY2hpbGQ7XG4gIH1cbiAgZWxzZSBpZiAoY2hpbGQuJG5hbWUpIHtcbiAgICB0aGlzLnR5cGVzW2NoaWxkLiRuYW1lXSA9IGNoaWxkO1xuICB9XG4gIHRoaXMuY2hpbGRyZW4ucG9wKCk7XG4gIC8vIGNoaWxkLmRlbGV0ZUZpeGVkQXR0cnMoKTtcbn07XG4vL2ZpeCMzMjVcblR5cGVzRWxlbWVudC5wcm90b3R5cGUuYWRkQ2hpbGQgPSBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgYXNzZXJ0KGNoaWxkIGluc3RhbmNlb2YgU2NoZW1hRWxlbWVudCk7XG5cbiAgbGV0IHRhcmdldE5hbWVzcGFjZSA9IGNoaWxkLiR0YXJnZXROYW1lc3BhY2U7XG5cbiAgaWYgKCF0aGlzLnNjaGVtYXMuaGFzT3duUHJvcGVydHkodGFyZ2V0TmFtZXNwYWNlKSkge1xuICAgIHRoaXMuc2NoZW1hc1t0YXJnZXROYW1lc3BhY2VdID0gY2hpbGQ7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5lcnJvcignVGFyZ2V0LU5hbWVzcGFjZSBcIicgKyB0YXJnZXROYW1lc3BhY2UgKyAnXCIgYWxyZWFkeSBpbiB1c2UgYnkgYW5vdGhlciBTY2hlbWEhJyk7XG4gIH1cbn07XG5cbklucHV0RWxlbWVudC5wcm90b3R5cGUuYWRkQ2hpbGQgPSBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgaWYgKGNoaWxkLm5hbWUgPT09ICdib2R5Jykge1xuICAgIHRoaXMudXNlID0gY2hpbGQuJHVzZTtcbiAgICBpZiAodGhpcy51c2UgPT09ICdlbmNvZGVkJykge1xuICAgICAgdGhpcy5lbmNvZGluZ1N0eWxlID0gY2hpbGQuJGVuY29kaW5nU3R5bGU7XG4gICAgfVxuICAgIHRoaXMuY2hpbGRyZW4ucG9wKCk7XG4gIH1cbn07XG5cbk91dHB1dEVsZW1lbnQucHJvdG90eXBlLmFkZENoaWxkID0gZnVuY3Rpb24gKGNoaWxkKSB7XG4gIGlmIChjaGlsZC5uYW1lID09PSAnYm9keScpIHtcbiAgICB0aGlzLnVzZSA9IGNoaWxkLiR1c2U7XG4gICAgaWYgKHRoaXMudXNlID09PSAnZW5jb2RlZCcpIHtcbiAgICAgIHRoaXMuZW5jb2RpbmdTdHlsZSA9IGNoaWxkLiRlbmNvZGluZ1N0eWxlO1xuICAgIH1cbiAgICB0aGlzLmNoaWxkcmVuLnBvcCgpO1xuICB9XG59O1xuXG5PcGVyYXRpb25FbGVtZW50LnByb3RvdHlwZS5hZGRDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZCkge1xuICBpZiAoY2hpbGQubmFtZSA9PT0gJ29wZXJhdGlvbicpIHtcbiAgICB0aGlzLnNvYXBBY3Rpb24gPSBjaGlsZC4kc29hcEFjdGlvbiB8fCAnJztcbiAgICB0aGlzLnN0eWxlID0gY2hpbGQuJHN0eWxlIHx8ICcnO1xuICAgIHRoaXMuY2hpbGRyZW4ucG9wKCk7XG4gIH1cbn07XG5cbkJpbmRpbmdFbGVtZW50LnByb3RvdHlwZS5hZGRDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZCkge1xuICBpZiAoY2hpbGQubmFtZSA9PT0gJ2JpbmRpbmcnKSB7XG4gICAgdGhpcy50cmFuc3BvcnQgPSBjaGlsZC4kdHJhbnNwb3J0O1xuICAgIHRoaXMuc3R5bGUgPSBjaGlsZC4kc3R5bGU7XG4gICAgdGhpcy5jaGlsZHJlbi5wb3AoKTtcbiAgfVxufTtcblxuUG9ydEVsZW1lbnQucHJvdG90eXBlLmFkZENoaWxkID0gZnVuY3Rpb24gKGNoaWxkKSB7XG4gIGlmIChjaGlsZC5uYW1lID09PSAnYWRkcmVzcycgJiYgdHlwZW9mIChjaGlsZC4kbG9jYXRpb24pICE9PSAndW5kZWZpbmVkJykge1xuICAgIHRoaXMubG9jYXRpb24gPSBjaGlsZC4kbG9jYXRpb247XG4gIH1cbn07XG5cbkRlZmluaXRpb25zRWxlbWVudC5wcm90b3R5cGUuYWRkQ2hpbGQgPSBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgbGV0IHNlbGYgPSB0aGlzO1xuICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBUeXBlc0VsZW1lbnQpIHtcbiAgICAvLyBNZXJnZSB0eXBlcy5zY2hlbWFzIGludG8gZGVmaW5pdGlvbnMuc2NoZW1hc1xuICAgIF8ubWVyZ2Uoc2VsZi5zY2hlbWFzLCBjaGlsZC5zY2hlbWFzKTtcbiAgfVxuICBlbHNlIGlmIChjaGlsZCBpbnN0YW5jZW9mIE1lc3NhZ2VFbGVtZW50KSB7XG4gICAgc2VsZi5tZXNzYWdlc1tjaGlsZC4kbmFtZV0gPSBjaGlsZDtcbiAgfVxuICBlbHNlIGlmIChjaGlsZC5uYW1lID09PSAnaW1wb3J0Jykge1xuICAgIHNlbGYuc2NoZW1hc1tjaGlsZC4kbmFtZXNwYWNlXSA9IG5ldyBTY2hlbWFFbGVtZW50KGNoaWxkLiRuYW1lc3BhY2UsIHt9KTtcbiAgICBzZWxmLnNjaGVtYXNbY2hpbGQuJG5hbWVzcGFjZV0uYWRkQ2hpbGQoY2hpbGQpO1xuICB9XG4gIGVsc2UgaWYgKGNoaWxkIGluc3RhbmNlb2YgUG9ydFR5cGVFbGVtZW50KSB7XG4gICAgc2VsZi5wb3J0VHlwZXNbY2hpbGQuJG5hbWVdID0gY2hpbGQ7XG4gIH1cbiAgZWxzZSBpZiAoY2hpbGQgaW5zdGFuY2VvZiBCaW5kaW5nRWxlbWVudCkge1xuICAgIGlmIChjaGlsZC50cmFuc3BvcnQgPT09ICdodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy9zb2FwL2h0dHAnIHx8XG4gICAgICBjaGlsZC50cmFuc3BvcnQgPT09ICdodHRwOi8vd3d3LnczLm9yZy8yMDAzLzA1L3NvYXAvYmluZGluZ3MvSFRUUC8nKVxuICAgICAgc2VsZi5iaW5kaW5nc1tjaGlsZC4kbmFtZV0gPSBjaGlsZDtcbiAgfVxuICBlbHNlIGlmIChjaGlsZCBpbnN0YW5jZW9mIFNlcnZpY2VFbGVtZW50KSB7XG4gICAgc2VsZi5zZXJ2aWNlc1tjaGlsZC4kbmFtZV0gPSBjaGlsZDtcbiAgfVxuICBlbHNlIGlmIChjaGlsZCBpbnN0YW5jZW9mIERvY3VtZW50YXRpb25FbGVtZW50KSB7XG4gIH1cbiAgdGhpcy5jaGlsZHJlbi5wb3AoKTtcbn07XG5cbk1lc3NhZ2VFbGVtZW50LnByb3RvdHlwZS5wb3N0UHJvY2VzcyA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucykge1xuICBsZXQgcGFydCA9IG51bGw7XG4gIGxldCBjaGlsZCA9IHVuZGVmaW5lZDtcbiAgbGV0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbiB8fCBbXTtcbiAgbGV0IG5zID0gdW5kZWZpbmVkO1xuICBsZXQgbnNOYW1lID0gdW5kZWZpbmVkO1xuICBsZXQgaSA9IHVuZGVmaW5lZDtcbiAgbGV0IHR5cGUgPSB1bmRlZmluZWQ7XG5cbiAgZm9yIChpIGluIGNoaWxkcmVuKSB7XG4gICAgaWYgKChjaGlsZCA9IGNoaWxkcmVuW2ldKS5uYW1lID09PSAncGFydCcpIHtcbiAgICAgIHBhcnQgPSBjaGlsZDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmICghcGFydCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChwYXJ0LiRlbGVtZW50KSB7XG4gICAgbGV0IGxvb2t1cFR5cGVzID0gW10sXG4gICAgICBlbGVtZW50Q2hpbGRyZW47XG5cbiAgICBkZWxldGUgdGhpcy5wYXJ0cztcblxuICAgIG5zTmFtZSA9IHNwbGl0UU5hbWUocGFydC4kZWxlbWVudCk7XG4gICAgbnMgPSBuc05hbWUucHJlZml4O1xuICAgIGxldCBzY2hlbWEgPSBkZWZpbml0aW9ucy5zY2hlbWFzW2RlZmluaXRpb25zLnhtbG5zW25zXV07XG4gICAgdGhpcy5lbGVtZW50ID0gc2NoZW1hLmVsZW1lbnRzW25zTmFtZS5uYW1lXTtcbiAgICBpZiAoIXRoaXMuZWxlbWVudCkge1xuICAgICAgLy8gZGVidWcobnNOYW1lLm5hbWUgKyBcIiBpcyBub3QgcHJlc2VudCBpbiB3c2RsIGFuZCBjYW5ub3QgYmUgcHJvY2Vzc2VkIGNvcnJlY3RseS5cIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZWxlbWVudC50YXJnZXROU0FsaWFzID0gbnM7XG4gICAgdGhpcy5lbGVtZW50LnRhcmdldE5hbWVzcGFjZSA9IGRlZmluaXRpb25zLnhtbG5zW25zXTtcblxuICAgIC8vIHNldCB0aGUgb3B0aW9uYWwgJGxvb2t1cFR5cGUgdG8gYmUgdXNlZCB3aXRoaW4gYGNsaWVudCNfaW52b2tlKClgIHdoZW5cbiAgICAvLyBjYWxsaW5nIGB3c2RsI29iamVjdFRvRG9jdW1lbnRYTUwoKVxuICAgIHRoaXMuZWxlbWVudC4kbG9va3VwVHlwZSA9IHBhcnQuJGVsZW1lbnQ7XG5cbiAgICBlbGVtZW50Q2hpbGRyZW4gPSB0aGlzLmVsZW1lbnQuY2hpbGRyZW47XG5cbiAgICAvLyBnZXQgYWxsIG5lc3RlZCBsb29rdXAgdHlwZXMgKG9ubHkgY29tcGxleCB0eXBlcyBhcmUgZm9sbG93ZWQpXG4gICAgaWYgKGVsZW1lbnRDaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgZWxlbWVudENoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxvb2t1cFR5cGVzLnB1c2godGhpcy5fZ2V0TmVzdGVkTG9va3VwVHlwZVN0cmluZyhlbGVtZW50Q2hpbGRyZW5baV0pKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBpZiBuZXN0ZWQgbG9va3VwIHR5cGVzIHdoZXJlIGZvdW5kLCBwcmVwYXJlIHRoZW0gZm9yIGZ1cnRlciB1c2FnZVxuICAgIGlmIChsb29rdXBUeXBlcy5sZW5ndGggPiAwKSB7XG4gICAgICBsb29rdXBUeXBlcyA9IGxvb2t1cFR5cGVzLlxuICAgICAgICBqb2luKCdfJykuXG4gICAgICAgIHNwbGl0KCdfJykuXG4gICAgICAgIGZpbHRlcihmdW5jdGlvbiByZW1vdmVFbXB0eUxvb2t1cFR5cGVzKHR5cGUpIHtcbiAgICAgICAgICByZXR1cm4gdHlwZSAhPT0gJ14nO1xuICAgICAgICB9KTtcblxuICAgICAgbGV0IHNjaGVtYVhtbG5zID0gZGVmaW5pdGlvbnMuc2NoZW1hc1t0aGlzLmVsZW1lbnQudGFyZ2V0TmFtZXNwYWNlXS54bWxucztcblxuICAgICAgZm9yIChpID0gMDsgaSA8IGxvb2t1cFR5cGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxvb2t1cFR5cGVzW2ldID0gdGhpcy5fY3JlYXRlTG9va3VwVHlwZU9iamVjdChsb29rdXBUeXBlc1tpXSwgc2NoZW1hWG1sbnMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZWxlbWVudC4kbG9va3VwVHlwZXMgPSBsb29rdXBUeXBlcztcblxuICAgIGlmICh0aGlzLmVsZW1lbnQuJHR5cGUpIHtcbiAgICAgIHR5cGUgPSBzcGxpdFFOYW1lKHRoaXMuZWxlbWVudC4kdHlwZSk7XG4gICAgICBsZXQgdHlwZU5zID0gc2NoZW1hLnhtbG5zICYmIHNjaGVtYS54bWxuc1t0eXBlLnByZWZpeF0gfHwgZGVmaW5pdGlvbnMueG1sbnNbdHlwZS5wcmVmaXhdO1xuXG4gICAgICBpZiAodHlwZU5zKSB7XG4gICAgICAgIGlmICh0eXBlLm5hbWUgaW4gUHJpbWl0aXZlcykge1xuICAgICAgICAgIC8vIHRoaXMuZWxlbWVudCA9IHRoaXMuZWxlbWVudC4kdHlwZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAvLyBmaXJzdCBjaGVjayBsb2NhbCBtYXBwaW5nIG9mIG5zIGFsaWFzIHRvIG5hbWVzcGFjZVxuICAgICAgICAgIHNjaGVtYSA9IGRlZmluaXRpb25zLnNjaGVtYXNbdHlwZU5zXTtcbiAgICAgICAgICBsZXQgY3R5cGUgPSBzY2hlbWEuY29tcGxleFR5cGVzW3R5cGUubmFtZV0gfHwgc2NoZW1hLnR5cGVzW3R5cGUubmFtZV0gfHwgc2NoZW1hLmVsZW1lbnRzW3R5cGUubmFtZV07XG5cblxuICAgICAgICAgIGlmIChjdHlwZSkge1xuICAgICAgICAgICAgdGhpcy5wYXJ0cyA9IGN0eXBlLmRlc2NyaXB0aW9uKGRlZmluaXRpb25zLCBzY2hlbWEueG1sbnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxldCBtZXRob2QgPSB0aGlzLmVsZW1lbnQuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMsIHNjaGVtYS54bWxucyk7XG4gICAgICB0aGlzLnBhcnRzID0gbWV0aG9kW25zTmFtZS5uYW1lXTtcbiAgICB9XG5cblxuICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKDAsIDEpO1xuICB9IGVsc2Uge1xuICAgIC8vIHJwYyBlbmNvZGluZ1xuICAgIHRoaXMucGFydHMgPSB7fTtcbiAgICBkZWxldGUgdGhpcy5lbGVtZW50O1xuICAgIGZvciAoaSA9IDA7IHBhcnQgPSB0aGlzLmNoaWxkcmVuW2ldOyBpKyspIHtcbiAgICAgIGlmIChwYXJ0Lm5hbWUgPT09ICdkb2N1bWVudGF0aW9uJykge1xuICAgICAgICAvLyA8d3NkbDpkb2N1bWVudGF0aW9uIGNhbiBiZSBwcmVzZW50IHVuZGVyIDx3c2RsOm1lc3NhZ2U+XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgYXNzZXJ0KHBhcnQubmFtZSA9PT0gJ3BhcnQnLCAnRXhwZWN0ZWQgcGFydCBlbGVtZW50Jyk7XG4gICAgICBuc05hbWUgPSBzcGxpdFFOYW1lKHBhcnQuJHR5cGUpO1xuICAgICAgbnMgPSBkZWZpbml0aW9ucy54bWxuc1tuc05hbWUucHJlZml4XTtcbiAgICAgIHR5cGUgPSBuc05hbWUubmFtZTtcbiAgICAgIGxldCBzY2hlbWFEZWZpbml0aW9uID0gZGVmaW5pdGlvbnMuc2NoZW1hc1tuc107XG4gICAgICBpZiAodHlwZW9mIHNjaGVtYURlZmluaXRpb24gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMucGFydHNbcGFydC4kbmFtZV0gPSBkZWZpbml0aW9ucy5zY2hlbWFzW25zXS50eXBlc1t0eXBlXSB8fCBkZWZpbml0aW9ucy5zY2hlbWFzW25zXS5jb21wbGV4VHlwZXNbdHlwZV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnBhcnRzW3BhcnQuJG5hbWVdID0gcGFydC4kdHlwZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiB0aGlzLnBhcnRzW3BhcnQuJG5hbWVdID09PSAnb2JqZWN0Jykge1xuICAgICAgICB0aGlzLnBhcnRzW3BhcnQuJG5hbWVdLnByZWZpeCA9IG5zTmFtZS5wcmVmaXg7XG4gICAgICAgIHRoaXMucGFydHNbcGFydC4kbmFtZV0ueG1sbnMgPSBucztcbiAgICAgIH1cblxuICAgICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoaS0tLCAxKTtcbiAgICB9XG4gIH1cbiAgdGhpcy5kZWxldGVGaXhlZEF0dHJzKCk7XG59O1xuXG4vKipcbiAqIFRha2VzIGEgZ2l2ZW4gbmFtZXNwYWNlZCBTdHJpbmcoZm9yIGV4YW1wbGU6ICdhbGlhczpwcm9wZXJ0eScpIGFuZCBjcmVhdGVzIGEgbG9va3VwVHlwZVxuICogb2JqZWN0IGZvciBmdXJ0aGVyIHVzZSBpbiBhcyBmaXJzdCAobG9va3VwKSBgcGFyYW1ldGVyVHlwZU9iamAgd2l0aGluIHRoZSBgb2JqZWN0VG9YTUxgXG4gKiBtZXRob2QgYW5kIHByb3ZpZGVzIGFuIGVudHJ5IHBvaW50IGZvciB0aGUgYWxyZWFkeSBleGlzdGluZyBjb2RlIGluIGBmaW5kQ2hpbGRTY2hlbWFPYmplY3RgLlxuICpcbiAqIEBtZXRob2QgX2NyZWF0ZUxvb2t1cFR5cGVPYmplY3RcbiAqIEBwYXJhbSB7U3RyaW5nfSAgICAgICAgICAgIG5zU3RyaW5nICAgICAgICAgIFRoZSBOUyBTdHJpbmcgKGZvciBleGFtcGxlIFwiYWxpYXM6dHlwZVwiKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgICAgIHhtbG5zICAgICAgIFRoZSBmdWxseSBwYXJzZWQgYHdzZGxgIGRlZmluaXRpb25zIG9iamVjdCAoaW5jbHVkaW5nIGFsbCBzY2hlbWFzKS5cbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKiBAcHJpdmF0ZVxuICovXG5NZXNzYWdlRWxlbWVudC5wcm90b3R5cGUuX2NyZWF0ZUxvb2t1cFR5cGVPYmplY3QgPSBmdW5jdGlvbiAobnNTdHJpbmcsIHhtbG5zKSB7XG4gIGxldCBzcGxpdHRlZE5TU3RyaW5nID0gc3BsaXRRTmFtZShuc1N0cmluZyksXG4gICAgbnNBbGlhcyA9IHNwbGl0dGVkTlNTdHJpbmcucHJlZml4LFxuICAgIHNwbGl0dGVkTmFtZSA9IHNwbGl0dGVkTlNTdHJpbmcubmFtZS5zcGxpdCgnIycpLFxuICAgIHR5cGUgPSBzcGxpdHRlZE5hbWVbMF0sXG4gICAgbmFtZSA9IHNwbGl0dGVkTmFtZVsxXSxcbiAgICBsb29rdXBUeXBlT2JqOiBhbnkgPSB7fTtcblxuICBsb29rdXBUeXBlT2JqLiRuYW1lc3BhY2UgPSB4bWxuc1tuc0FsaWFzXTtcbiAgbG9va3VwVHlwZU9iai4kdHlwZSA9IG5zQWxpYXMgKyAnOicgKyB0eXBlO1xuICBsb29rdXBUeXBlT2JqLiRuYW1lID0gbmFtZTtcblxuICByZXR1cm4gbG9va3VwVHlwZU9iajtcbn07XG5cbi8qKlxuICogSXRlcmF0ZXMgdGhyb3VnaCB0aGUgZWxlbWVudCBhbmQgZXZlcnkgbmVzdGVkIGNoaWxkIHRvIGZpbmQgYW55IGRlZmluZWQgYCR0eXBlYFxuICogcHJvcGVydHkgYW5kIHJldHVybnMgaXQgaW4gYSB1bmRlcnNjb3JlICgnXycpIHNlcGFyYXRlZCBTdHJpbmcgKHVzaW5nICdeJyBhcyBkZWZhdWx0XG4gKiB2YWx1ZSBpZiBubyBgJHR5cGVgIHByb3BlcnR5IHdhcyBmb3VuZCkuXG4gKlxuICogQG1ldGhvZCBfZ2V0TmVzdGVkTG9va3VwVHlwZVN0cmluZ1xuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgICAgZWxlbWVudCAgICAgICAgIFRoZSBlbGVtZW50IHdoaWNoIChwcm9iYWJseSkgY29udGFpbnMgbmVzdGVkIGAkdHlwZWAgdmFsdWVzLlxuICogQHJldHVybnMge1N0cmluZ31cbiAqIEBwcml2YXRlXG4gKi9cbk1lc3NhZ2VFbGVtZW50LnByb3RvdHlwZS5fZ2V0TmVzdGVkTG9va3VwVHlwZVN0cmluZyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gIGxldCByZXNvbHZlZFR5cGUgPSAnXicsXG4gICAgZXhjbHVkZWQgPSB0aGlzLmlnbm9yZWROYW1lc3BhY2VzLmNvbmNhdCgneHMnKTsgLy8gZG8gbm90IHByb2Nlc3MgJHR5cGUgdmFsdWVzIHdpY2ggc3RhcnQgd2l0aFxuXG4gIGlmIChlbGVtZW50Lmhhc093blByb3BlcnR5KCckdHlwZScpICYmIHR5cGVvZiBlbGVtZW50LiR0eXBlID09PSAnc3RyaW5nJykge1xuICAgIGlmIChleGNsdWRlZC5pbmRleE9mKGVsZW1lbnQuJHR5cGUuc3BsaXQoJzonKVswXSkgPT09IC0xKSB7XG4gICAgICByZXNvbHZlZFR5cGUgKz0gKCdfJyArIGVsZW1lbnQuJHR5cGUgKyAnIycgKyBlbGVtZW50LiRuYW1lKTtcbiAgICB9XG4gIH1cblxuICBpZiAoZWxlbWVudC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgZWxlbWVudC5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgbGV0IHJlc29sdmVkQ2hpbGRUeXBlID0gc2VsZi5fZ2V0TmVzdGVkTG9va3VwVHlwZVN0cmluZyhjaGlsZCkucmVwbGFjZSgvXFxeXy8sICcnKTtcblxuICAgICAgaWYgKHJlc29sdmVkQ2hpbGRUeXBlICYmIHR5cGVvZiByZXNvbHZlZENoaWxkVHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmVzb2x2ZWRUeXBlICs9ICgnXycgKyByZXNvbHZlZENoaWxkVHlwZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcmVzb2x2ZWRUeXBlO1xufTtcblxuT3BlcmF0aW9uRWxlbWVudC5wcm90b3R5cGUucG9zdFByb2Nlc3MgPSBmdW5jdGlvbiAoZGVmaW5pdGlvbnMsIHRhZykge1xuICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xuICBmb3IgKGxldCBpID0gMCwgY2hpbGQ7IGNoaWxkID0gY2hpbGRyZW5baV07IGkrKykge1xuICAgIGlmIChjaGlsZC5uYW1lICE9PSAnaW5wdXQnICYmIGNoaWxkLm5hbWUgIT09ICdvdXRwdXQnKVxuICAgICAgY29udGludWU7XG4gICAgaWYgKHRhZyA9PT0gJ2JpbmRpbmcnKSB7XG4gICAgICB0aGlzW2NoaWxkLm5hbWVdID0gY2hpbGQ7XG4gICAgICBjaGlsZHJlbi5zcGxpY2UoaS0tLCAxKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBsZXQgbWVzc2FnZU5hbWUgPSBzcGxpdFFOYW1lKGNoaWxkLiRtZXNzYWdlKS5uYW1lO1xuICAgIGxldCBtZXNzYWdlID0gZGVmaW5pdGlvbnMubWVzc2FnZXNbbWVzc2FnZU5hbWVdO1xuICAgIG1lc3NhZ2UucG9zdFByb2Nlc3MoZGVmaW5pdGlvbnMpO1xuICAgIGlmIChtZXNzYWdlLmVsZW1lbnQpIHtcbiAgICAgIGRlZmluaXRpb25zLm1lc3NhZ2VzW21lc3NhZ2UuZWxlbWVudC4kbmFtZV0gPSBtZXNzYWdlO1xuICAgICAgdGhpc1tjaGlsZC5uYW1lXSA9IG1lc3NhZ2UuZWxlbWVudDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzW2NoaWxkLm5hbWVdID0gbWVzc2FnZTtcbiAgICB9XG4gICAgY2hpbGRyZW4uc3BsaWNlKGktLSwgMSk7XG4gIH1cbiAgdGhpcy5kZWxldGVGaXhlZEF0dHJzKCk7XG59O1xuXG5Qb3J0VHlwZUVsZW1lbnQucHJvdG90eXBlLnBvc3RQcm9jZXNzID0gZnVuY3Rpb24gKGRlZmluaXRpb25zKSB7XG4gIGxldCBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG4gIGlmICh0eXBlb2YgY2hpbGRyZW4gPT09ICd1bmRlZmluZWQnKVxuICAgIHJldHVybjtcbiAgZm9yIChsZXQgaSA9IDAsIGNoaWxkOyBjaGlsZCA9IGNoaWxkcmVuW2ldOyBpKyspIHtcbiAgICBpZiAoY2hpbGQubmFtZSAhPT0gJ29wZXJhdGlvbicpXG4gICAgICBjb250aW51ZTtcbiAgICBjaGlsZC5wb3N0UHJvY2VzcyhkZWZpbml0aW9ucywgJ3BvcnRUeXBlJyk7XG4gICAgdGhpcy5tZXRob2RzW2NoaWxkLiRuYW1lXSA9IGNoaWxkO1xuICAgIGNoaWxkcmVuLnNwbGljZShpLS0sIDEpO1xuICB9XG4gIGRlbGV0ZSB0aGlzLiRuYW1lO1xuICB0aGlzLmRlbGV0ZUZpeGVkQXR0cnMoKTtcbn07XG5cbkJpbmRpbmdFbGVtZW50LnByb3RvdHlwZS5wb3N0UHJvY2VzcyA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucykge1xuICBsZXQgdHlwZSA9IHNwbGl0UU5hbWUodGhpcy4kdHlwZSkubmFtZSxcbiAgICBwb3J0VHlwZSA9IGRlZmluaXRpb25zLnBvcnRUeXBlc1t0eXBlXSxcbiAgICBzdHlsZSA9IHRoaXMuc3R5bGUsXG4gICAgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xuICBpZiAocG9ydFR5cGUpIHtcbiAgICBwb3J0VHlwZS5wb3N0UHJvY2VzcyhkZWZpbml0aW9ucyk7XG4gICAgdGhpcy5tZXRob2RzID0gcG9ydFR5cGUubWV0aG9kcztcblxuICAgIGZvciAobGV0IGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBjaGlsZHJlbltpXTsgaSsrKSB7XG4gICAgICBpZiAoY2hpbGQubmFtZSAhPT0gJ29wZXJhdGlvbicpXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgY2hpbGQucG9zdFByb2Nlc3MoZGVmaW5pdGlvbnMsICdiaW5kaW5nJyk7XG4gICAgICBjaGlsZHJlbi5zcGxpY2UoaS0tLCAxKTtcbiAgICAgIGNoaWxkLnN0eWxlIHx8IChjaGlsZC5zdHlsZSA9IHN0eWxlKTtcbiAgICAgIGxldCBtZXRob2QgPSB0aGlzLm1ldGhvZHNbY2hpbGQuJG5hbWVdO1xuXG4gICAgICBpZiAobWV0aG9kKSB7XG4gICAgICAgIG1ldGhvZC5zdHlsZSA9IGNoaWxkLnN0eWxlO1xuICAgICAgICBtZXRob2Quc29hcEFjdGlvbiA9IGNoaWxkLnNvYXBBY3Rpb247XG4gICAgICAgIG1ldGhvZC5pbnB1dFNvYXAgPSBjaGlsZC5pbnB1dCB8fCBudWxsO1xuICAgICAgICBtZXRob2Qub3V0cHV0U29hcCA9IGNoaWxkLm91dHB1dCB8fCBudWxsO1xuICAgICAgICBtZXRob2QuaW5wdXRTb2FwICYmIG1ldGhvZC5pbnB1dFNvYXAuZGVsZXRlRml4ZWRBdHRycygpO1xuICAgICAgICBtZXRob2Qub3V0cHV0U29hcCAmJiBtZXRob2Qub3V0cHV0U29hcC5kZWxldGVGaXhlZEF0dHJzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGRlbGV0ZSB0aGlzLiRuYW1lO1xuICBkZWxldGUgdGhpcy4kdHlwZTtcbiAgdGhpcy5kZWxldGVGaXhlZEF0dHJzKCk7XG59O1xuXG5TZXJ2aWNlRWxlbWVudC5wcm90b3R5cGUucG9zdFByb2Nlc3MgPSBmdW5jdGlvbiAoZGVmaW5pdGlvbnMpIHtcbiAgbGV0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbixcbiAgICBiaW5kaW5ncyA9IGRlZmluaXRpb25zLmJpbmRpbmdzO1xuICBpZiAoY2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgIGZvciAobGV0IGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBjaGlsZHJlbltpXTsgaSsrKSB7XG4gICAgICBpZiAoY2hpbGQubmFtZSAhPT0gJ3BvcnQnKVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIGxldCBiaW5kaW5nTmFtZSA9IHNwbGl0UU5hbWUoY2hpbGQuJGJpbmRpbmcpLm5hbWU7XG4gICAgICBsZXQgYmluZGluZyA9IGJpbmRpbmdzW2JpbmRpbmdOYW1lXTtcbiAgICAgIGlmIChiaW5kaW5nKSB7XG4gICAgICAgIGJpbmRpbmcucG9zdFByb2Nlc3MoZGVmaW5pdGlvbnMpO1xuICAgICAgICB0aGlzLnBvcnRzW2NoaWxkLiRuYW1lXSA9IHtcbiAgICAgICAgICBsb2NhdGlvbjogY2hpbGQubG9jYXRpb24sXG4gICAgICAgICAgYmluZGluZzogYmluZGluZ1xuICAgICAgICB9O1xuICAgICAgICBjaGlsZHJlbi5zcGxpY2UoaS0tLCAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZGVsZXRlIHRoaXMuJG5hbWU7XG4gIHRoaXMuZGVsZXRlRml4ZWRBdHRycygpO1xufTtcblxuXG5TaW1wbGVUeXBlRWxlbWVudC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoZGVmaW5pdGlvbnMpIHtcbiAgbGV0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcbiAgZm9yIChsZXQgaSA9IDAsIGNoaWxkOyBjaGlsZCA9IGNoaWxkcmVuW2ldOyBpKyspIHtcbiAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBSZXN0cmljdGlvbkVsZW1lbnQpXG4gICAgICByZXR1cm4gdGhpcy4kbmFtZSArIFwifFwiICsgY2hpbGQuZGVzY3JpcHRpb24oKTtcbiAgfVxuICByZXR1cm4ge307XG59O1xuXG5SZXN0cmljdGlvbkVsZW1lbnQucHJvdG90eXBlLmRlc2NyaXB0aW9uID0gZnVuY3Rpb24gKGRlZmluaXRpb25zLCB4bWxucykge1xuICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xuICBsZXQgZGVzYztcbiAgZm9yIChsZXQgaSA9IDAsIGNoaWxkOyBjaGlsZCA9IGNoaWxkcmVuW2ldOyBpKyspIHtcbiAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBTZXF1ZW5jZUVsZW1lbnQgfHxcbiAgICAgIGNoaWxkIGluc3RhbmNlb2YgQ2hvaWNlRWxlbWVudCkge1xuICAgICAgZGVzYyA9IGNoaWxkLmRlc2NyaXB0aW9uKGRlZmluaXRpb25zLCB4bWxucyk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgaWYgKGRlc2MgJiYgdGhpcy4kYmFzZSkge1xuICAgIGxldCB0eXBlID0gc3BsaXRRTmFtZSh0aGlzLiRiYXNlKSxcbiAgICAgIHR5cGVOYW1lID0gdHlwZS5uYW1lLFxuICAgICAgbnMgPSB4bWxucyAmJiB4bWxuc1t0eXBlLnByZWZpeF0gfHwgZGVmaW5pdGlvbnMueG1sbnNbdHlwZS5wcmVmaXhdLFxuICAgICAgc2NoZW1hID0gZGVmaW5pdGlvbnMuc2NoZW1hc1tuc10sXG4gICAgICB0eXBlRWxlbWVudCA9IHNjaGVtYSAmJiAoc2NoZW1hLmNvbXBsZXhUeXBlc1t0eXBlTmFtZV0gfHwgc2NoZW1hLnR5cGVzW3R5cGVOYW1lXSB8fCBzY2hlbWEuZWxlbWVudHNbdHlwZU5hbWVdKTtcblxuICAgIGRlc2MuZ2V0QmFzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0eXBlRWxlbWVudC5kZXNjcmlwdGlvbihkZWZpbml0aW9ucywgc2NoZW1hLnhtbG5zKTtcbiAgICB9O1xuICAgIHJldHVybiBkZXNjO1xuICB9XG5cbiAgLy8gdGhlbiBzaW1wbGUgZWxlbWVudFxuICBsZXQgYmFzZSA9IHRoaXMuJGJhc2UgPyB0aGlzLiRiYXNlICsgXCJ8XCIgOiBcIlwiO1xuICByZXR1cm4gYmFzZSArIHRoaXMuY2hpbGRyZW4ubWFwKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgIHJldHVybiBjaGlsZC5kZXNjcmlwdGlvbigpO1xuICB9KS5qb2luKFwiLFwiKTtcbn07XG5cbkV4dGVuc2lvbkVsZW1lbnQucHJvdG90eXBlLmRlc2NyaXB0aW9uID0gZnVuY3Rpb24gKGRlZmluaXRpb25zLCB4bWxucykge1xuICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xuICBsZXQgZGVzYyA9IHt9O1xuICBmb3IgKGxldCBpID0gMCwgY2hpbGQ7IGNoaWxkID0gY2hpbGRyZW5baV07IGkrKykge1xuICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIFNlcXVlbmNlRWxlbWVudCB8fFxuICAgICAgY2hpbGQgaW5zdGFuY2VvZiBDaG9pY2VFbGVtZW50KSB7XG4gICAgICBkZXNjID0gY2hpbGQuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMsIHhtbG5zKTtcbiAgICB9XG4gIH1cbiAgaWYgKHRoaXMuJGJhc2UpIHtcbiAgICBsZXQgdHlwZSA9IHNwbGl0UU5hbWUodGhpcy4kYmFzZSksXG4gICAgICB0eXBlTmFtZSA9IHR5cGUubmFtZSxcbiAgICAgIG5zID0geG1sbnMgJiYgeG1sbnNbdHlwZS5wcmVmaXhdIHx8IGRlZmluaXRpb25zLnhtbG5zW3R5cGUucHJlZml4XSxcbiAgICAgIHNjaGVtYSA9IGRlZmluaXRpb25zLnNjaGVtYXNbbnNdO1xuXG4gICAgaWYgKHR5cGVOYW1lIGluIFByaW1pdGl2ZXMpIHtcbiAgICAgIHJldHVybiB0aGlzLiRiYXNlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxldCB0eXBlRWxlbWVudCA9IHNjaGVtYSAmJiAoc2NoZW1hLmNvbXBsZXhUeXBlc1t0eXBlTmFtZV0gfHxcbiAgICAgICAgc2NoZW1hLnR5cGVzW3R5cGVOYW1lXSB8fCBzY2hlbWEuZWxlbWVudHNbdHlwZU5hbWVdKTtcblxuICAgICAgaWYgKHR5cGVFbGVtZW50KSB7XG4gICAgICAgIGxldCBiYXNlID0gdHlwZUVsZW1lbnQuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMsIHNjaGVtYS54bWxucyk7XG4gICAgICAgIGRlc2MgPSBfLmRlZmF1bHRzRGVlcChiYXNlLCBkZXNjKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlc2M7XG59O1xuXG5FbnVtZXJhdGlvbkVsZW1lbnQucHJvdG90eXBlLmRlc2NyaXB0aW9uID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpc1t0aGlzLnZhbHVlS2V5XTtcbn07XG5cbkNvbXBsZXhUeXBlRWxlbWVudC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoZGVmaW5pdGlvbnMsIHhtbG5zKSB7XG4gIGxldCBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW4gfHwgW107XG4gIGZvciAobGV0IGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBjaGlsZHJlbltpXTsgaSsrKSB7XG4gICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgQ2hvaWNlRWxlbWVudCB8fFxuICAgICAgY2hpbGQgaW5zdGFuY2VvZiBTZXF1ZW5jZUVsZW1lbnQgfHxcbiAgICAgIGNoaWxkIGluc3RhbmNlb2YgQWxsRWxlbWVudCB8fFxuICAgICAgY2hpbGQgaW5zdGFuY2VvZiBTaW1wbGVDb250ZW50RWxlbWVudCB8fFxuICAgICAgY2hpbGQgaW5zdGFuY2VvZiBDb21wbGV4Q29udGVudEVsZW1lbnQpIHtcblxuICAgICAgcmV0dXJuIGNoaWxkLmRlc2NyaXB0aW9uKGRlZmluaXRpb25zLCB4bWxucyk7XG4gICAgfVxuICB9XG4gIHJldHVybiB7fTtcbn07XG5cbkNvbXBsZXhDb250ZW50RWxlbWVudC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoZGVmaW5pdGlvbnMsIHhtbG5zKSB7XG4gIGxldCBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG4gIGZvciAobGV0IGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBjaGlsZHJlbltpXTsgaSsrKSB7XG4gICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgRXh0ZW5zaW9uRWxlbWVudCkge1xuICAgICAgcmV0dXJuIGNoaWxkLmRlc2NyaXB0aW9uKGRlZmluaXRpb25zLCB4bWxucyk7XG4gICAgfVxuICB9XG4gIHJldHVybiB7fTtcbn07XG5cblNpbXBsZUNvbnRlbnRFbGVtZW50LnByb3RvdHlwZS5kZXNjcmlwdGlvbiA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucywgeG1sbnMpIHtcbiAgbGV0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcbiAgZm9yIChsZXQgaSA9IDAsIGNoaWxkOyBjaGlsZCA9IGNoaWxkcmVuW2ldOyBpKyspIHtcbiAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBFeHRlbnNpb25FbGVtZW50KSB7XG4gICAgICByZXR1cm4gY2hpbGQuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMsIHhtbG5zKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHt9O1xufTtcblxuRWxlbWVudEVsZW1lbnQucHJvdG90eXBlLmRlc2NyaXB0aW9uID0gZnVuY3Rpb24gKGRlZmluaXRpb25zLCB4bWxucykge1xuICBsZXQgZWxlbWVudCA9IHt9LFxuICAgIG5hbWUgPSB0aGlzLiRuYW1lO1xuICBsZXQgaXNNYW55ID0gIXRoaXMuJG1heE9jY3VycyA/IGZhbHNlIDogKGlzTmFOKHRoaXMuJG1heE9jY3VycykgPyAodGhpcy4kbWF4T2NjdXJzID09PSAndW5ib3VuZGVkJykgOiAodGhpcy4kbWF4T2NjdXJzID4gMSkpO1xuICBpZiAodGhpcy4kbWluT2NjdXJzICE9PSB0aGlzLiRtYXhPY2N1cnMgJiYgaXNNYW55KSB7XG4gICAgbmFtZSArPSAnW10nO1xuICB9XG5cbiAgaWYgKHhtbG5zICYmIHhtbG5zW1ROU19QUkVGSVhdKSB7XG4gICAgdGhpcy4kdGFyZ2V0TmFtZXNwYWNlID0geG1sbnNbVE5TX1BSRUZJWF07XG4gIH1cbiAgbGV0IHR5cGUgPSB0aGlzLiR0eXBlIHx8IHRoaXMuJHJlZjtcbiAgaWYgKHR5cGUpIHtcbiAgICB0eXBlID0gc3BsaXRRTmFtZSh0eXBlKTtcbiAgICBsZXQgdHlwZU5hbWUgPSB0eXBlLm5hbWUsXG4gICAgICBucyA9IHhtbG5zICYmIHhtbG5zW3R5cGUucHJlZml4XSB8fCBkZWZpbml0aW9ucy54bWxuc1t0eXBlLnByZWZpeF0sXG4gICAgICBzY2hlbWEgPSBkZWZpbml0aW9ucy5zY2hlbWFzW25zXSxcbiAgICAgIHR5cGVFbGVtZW50ID0gc2NoZW1hICYmICh0aGlzLiR0eXBlID8gc2NoZW1hLmNvbXBsZXhUeXBlc1t0eXBlTmFtZV0gfHwgc2NoZW1hLnR5cGVzW3R5cGVOYW1lXSA6IHNjaGVtYS5lbGVtZW50c1t0eXBlTmFtZV0pO1xuXG4gICAgaWYgKG5zICYmIGRlZmluaXRpb25zLnNjaGVtYXNbbnNdKSB7XG4gICAgICB4bWxucyA9IGRlZmluaXRpb25zLnNjaGVtYXNbbnNdLnhtbG5zO1xuICAgIH1cblxuICAgIGlmICh0eXBlRWxlbWVudCAmJiAhKHR5cGVOYW1lIGluIFByaW1pdGl2ZXMpKSB7XG5cbiAgICAgIGlmICghKHR5cGVOYW1lIGluIGRlZmluaXRpb25zLmRlc2NyaXB0aW9ucy50eXBlcykpIHtcblxuICAgICAgICBsZXQgZWxlbTogYW55ID0ge307XG4gICAgICAgIGRlZmluaXRpb25zLmRlc2NyaXB0aW9ucy50eXBlc1t0eXBlTmFtZV0gPSBlbGVtO1xuICAgICAgICBsZXQgZGVzY3JpcHRpb24gPSB0eXBlRWxlbWVudC5kZXNjcmlwdGlvbihkZWZpbml0aW9ucywgeG1sbnMpO1xuICAgICAgICBpZiAodHlwZW9mIGRlc2NyaXB0aW9uID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGVsZW0gPSBkZXNjcmlwdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBPYmplY3Qua2V5cyhkZXNjcmlwdGlvbikuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBlbGVtW2tleV0gPSBkZXNjcmlwdGlvbltrZXldO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuJHJlZikge1xuICAgICAgICAgIGVsZW1lbnQgPSBlbGVtO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGVsZW1lbnRbbmFtZV0gPSBlbGVtO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIGVsZW0udGFyZ2V0TlNBbGlhcyA9IHR5cGUucHJlZml4O1xuICAgICAgICAgIGVsZW0udGFyZ2V0TmFtZXNwYWNlID0gbnM7XG4gICAgICAgIH1cblxuICAgICAgICBkZWZpbml0aW9ucy5kZXNjcmlwdGlvbnMudHlwZXNbdHlwZU5hbWVdID0gZWxlbTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpZiAodGhpcy4kcmVmKSB7XG4gICAgICAgICAgZWxlbWVudCA9IGRlZmluaXRpb25zLmRlc2NyaXB0aW9ucy50eXBlc1t0eXBlTmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZWxlbWVudFtuYW1lXSA9IGRlZmluaXRpb25zLmRlc2NyaXB0aW9ucy50eXBlc1t0eXBlTmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGVsZW1lbnRbbmFtZV0gPSB0aGlzLiR0eXBlO1xuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xuICAgIGVsZW1lbnRbbmFtZV0gPSB7fTtcbiAgICBmb3IgKGxldCBpID0gMCwgY2hpbGQ7IGNoaWxkID0gY2hpbGRyZW5baV07IGkrKykge1xuICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgQ29tcGxleFR5cGVFbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnRbbmFtZV0gPSBjaGlsZC5kZXNjcmlwdGlvbihkZWZpbml0aW9ucywgeG1sbnMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZWxlbWVudDtcbn07XG5cbkFsbEVsZW1lbnQucHJvdG90eXBlLmRlc2NyaXB0aW9uID1cbiAgU2VxdWVuY2VFbGVtZW50LnByb3RvdHlwZS5kZXNjcmlwdGlvbiA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucywgeG1sbnMpIHtcbiAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xuICAgIGxldCBzZXF1ZW5jZSA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBjaGlsZHJlbltpXTsgaSsrKSB7XG4gICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBBbnlFbGVtZW50KSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgbGV0IGRlc2NyaXB0aW9uID0gY2hpbGQuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMsIHhtbG5zKTtcbiAgICAgIGZvciAobGV0IGtleSBpbiBkZXNjcmlwdGlvbikge1xuICAgICAgICBzZXF1ZW5jZVtrZXldID0gZGVzY3JpcHRpb25ba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNlcXVlbmNlO1xuICB9O1xuXG5DaG9pY2VFbGVtZW50LnByb3RvdHlwZS5kZXNjcmlwdGlvbiA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucywgeG1sbnMpIHtcbiAgbGV0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcbiAgbGV0IGNob2ljZSA9IHt9O1xuICBmb3IgKGxldCBpID0gMCwgY2hpbGQ7IGNoaWxkID0gY2hpbGRyZW5baV07IGkrKykge1xuICAgIGxldCBkZXNjcmlwdGlvbiA9IGNoaWxkLmRlc2NyaXB0aW9uKGRlZmluaXRpb25zLCB4bWxucyk7XG4gICAgZm9yIChsZXQga2V5IGluIGRlc2NyaXB0aW9uKSB7XG4gICAgICBjaG9pY2Vba2V5XSA9IGRlc2NyaXB0aW9uW2tleV07XG4gICAgfVxuICB9XG4gIHJldHVybiBjaG9pY2U7XG59O1xuXG5NZXNzYWdlRWxlbWVudC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoZGVmaW5pdGlvbnMpIHtcbiAgaWYgKHRoaXMuZWxlbWVudCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQgJiYgdGhpcy5lbGVtZW50LmRlc2NyaXB0aW9uKGRlZmluaXRpb25zKTtcbiAgfVxuICBsZXQgZGVzYyA9IHt9O1xuICBkZXNjW3RoaXMuJG5hbWVdID0gdGhpcy5wYXJ0cztcbiAgcmV0dXJuIGRlc2M7XG59O1xuXG5Qb3J0VHlwZUVsZW1lbnQucHJvdG90eXBlLmRlc2NyaXB0aW9uID0gZnVuY3Rpb24gKGRlZmluaXRpb25zKSB7XG4gIGxldCBtZXRob2RzID0ge307XG4gIGZvciAobGV0IG5hbWUgaW4gdGhpcy5tZXRob2RzKSB7XG4gICAgbGV0IG1ldGhvZCA9IHRoaXMubWV0aG9kc1tuYW1lXTtcbiAgICBtZXRob2RzW25hbWVdID0gbWV0aG9kLmRlc2NyaXB0aW9uKGRlZmluaXRpb25zKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07XG5cbk9wZXJhdGlvbkVsZW1lbnQucHJvdG90eXBlLmRlc2NyaXB0aW9uID0gZnVuY3Rpb24gKGRlZmluaXRpb25zKSB7XG4gIGxldCBpbnB1dERlc2MgPSB0aGlzLmlucHV0ID8gdGhpcy5pbnB1dC5kZXNjcmlwdGlvbihkZWZpbml0aW9ucykgOiBudWxsO1xuICBsZXQgb3V0cHV0RGVzYyA9IHRoaXMub3V0cHV0ID8gdGhpcy5vdXRwdXQuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMpIDogbnVsbDtcbiAgcmV0dXJuIHtcbiAgICBpbnB1dDogaW5wdXREZXNjICYmIGlucHV0RGVzY1tPYmplY3Qua2V5cyhpbnB1dERlc2MpWzBdXSxcbiAgICBvdXRwdXQ6IG91dHB1dERlc2MgJiYgb3V0cHV0RGVzY1tPYmplY3Qua2V5cyhvdXRwdXREZXNjKVswXV1cbiAgfTtcbn07XG5cbkJpbmRpbmdFbGVtZW50LnByb3RvdHlwZS5kZXNjcmlwdGlvbiA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucykge1xuICBsZXQgbWV0aG9kcyA9IHt9O1xuICBmb3IgKGxldCBuYW1lIGluIHRoaXMubWV0aG9kcykge1xuICAgIGxldCBtZXRob2QgPSB0aGlzLm1ldGhvZHNbbmFtZV07XG4gICAgbWV0aG9kc1tuYW1lXSA9IG1ldGhvZC5kZXNjcmlwdGlvbihkZWZpbml0aW9ucyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59O1xuXG5TZXJ2aWNlRWxlbWVudC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoZGVmaW5pdGlvbnMpIHtcbiAgbGV0IHBvcnRzID0ge307XG4gIGZvciAobGV0IG5hbWUgaW4gdGhpcy5wb3J0cykge1xuICAgIGxldCBwb3J0ID0gdGhpcy5wb3J0c1tuYW1lXTtcbiAgICBwb3J0c1tuYW1lXSA9IHBvcnQuYmluZGluZy5kZXNjcmlwdGlvbihkZWZpbml0aW9ucyk7XG4gIH1cbiAgcmV0dXJuIHBvcnRzO1xufTtcblxuZXhwb3J0IGxldCBXU0RMID0gZnVuY3Rpb24gKGRlZmluaXRpb24sIHVyaSwgb3B0aW9ucykge1xuICBsZXQgc2VsZiA9IHRoaXMsXG4gICAgZnJvbUZ1bmM7XG5cbiAgdGhpcy51cmkgPSB1cmk7XG4gIHRoaXMuY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gIH07XG4gIHRoaXMuX2luY2x1ZGVzV3NkbCA9IFtdO1xuXG4gIC8vIGluaXRpYWxpemUgV1NETCBjYWNoZVxuICB0aGlzLldTRExfQ0FDSEUgPSAob3B0aW9ucyB8fCB7fSkuV1NETF9DQUNIRSB8fCB7fTtcblxuICB0aGlzLl9pbml0aWFsaXplT3B0aW9ucyhvcHRpb25zKTtcblxuICBpZiAodHlwZW9mIGRlZmluaXRpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgZGVmaW5pdGlvbiA9IHN0cmlwQm9tKGRlZmluaXRpb24pO1xuICAgIGZyb21GdW5jID0gdGhpcy5fZnJvbVhNTDtcbiAgfVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5pdGlvbiA9PT0gJ29iamVjdCcpIHtcbiAgICBmcm9tRnVuYyA9IHRoaXMuX2Zyb21TZXJ2aWNlcztcbiAgfVxuICBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1dTREwgbGV0cnVjdG9yIHRha2VzIGVpdGhlciBhbiBYTUwgc3RyaW5nIG9yIHNlcnZpY2UgZGVmaW5pdGlvbicpO1xuICB9XG5cbiAgUHJvbWlzZS5yZXNvbHZlKHRydWUpLnRoZW4oKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBmcm9tRnVuYy5jYWxsKHNlbGYsIGRlZmluaXRpb24pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBzZWxmLmNhbGxiYWNrKGUubWVzc2FnZSk7XG4gICAgfVxuXG4gICAgc2VsZi5wcm9jZXNzSW5jbHVkZXMoKS50aGVuKCgpID0+IHtcbiAgICAgIHNlbGYuZGVmaW5pdGlvbnMuZGVsZXRlRml4ZWRBdHRycygpO1xuICAgICAgbGV0IHNlcnZpY2VzID0gc2VsZi5zZXJ2aWNlcyA9IHNlbGYuZGVmaW5pdGlvbnMuc2VydmljZXM7XG4gICAgICBpZiAoc2VydmljZXMpIHtcbiAgICAgICAgZm9yIChjb25zdCBuYW1lIGluIHNlcnZpY2VzKSB7XG4gICAgICAgICAgc2VydmljZXNbbmFtZV0ucG9zdFByb2Nlc3Moc2VsZi5kZWZpbml0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBjb21wbGV4VHlwZXMgPSBzZWxmLmRlZmluaXRpb25zLmNvbXBsZXhUeXBlcztcbiAgICAgIGlmIChjb21wbGV4VHlwZXMpIHtcbiAgICAgICAgZm9yIChjb25zdCBuYW1lIGluIGNvbXBsZXhUeXBlcykge1xuICAgICAgICAgIGNvbXBsZXhUeXBlc1tuYW1lXS5kZWxldGVGaXhlZEF0dHJzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gZm9yIGRvY3VtZW50IHN0eWxlLCBmb3IgZXZlcnkgYmluZGluZywgcHJlcGFyZSBpbnB1dCBtZXNzYWdlIGVsZW1lbnQgbmFtZSB0byAobWV0aG9kTmFtZSwgb3V0cHV0IG1lc3NhZ2UgZWxlbWVudCBuYW1lKSBtYXBwaW5nXG4gICAgICBsZXQgYmluZGluZ3MgPSBzZWxmLmRlZmluaXRpb25zLmJpbmRpbmdzO1xuICAgICAgZm9yIChsZXQgYmluZGluZ05hbWUgaW4gYmluZGluZ3MpIHtcbiAgICAgICAgbGV0IGJpbmRpbmcgPSBiaW5kaW5nc1tiaW5kaW5nTmFtZV07XG4gICAgICAgIGlmICh0eXBlb2YgYmluZGluZy5zdHlsZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBiaW5kaW5nLnN0eWxlID0gJ2RvY3VtZW50JztcbiAgICAgICAgfVxuICAgICAgICBpZiAoYmluZGluZy5zdHlsZSAhPT0gJ2RvY3VtZW50JylcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgbGV0IG1ldGhvZHMgPSBiaW5kaW5nLm1ldGhvZHM7XG4gICAgICAgIGxldCB0b3BFbHMgPSBiaW5kaW5nLnRvcEVsZW1lbnRzID0ge307XG4gICAgICAgIGZvciAobGV0IG1ldGhvZE5hbWUgaW4gbWV0aG9kcykge1xuICAgICAgICAgIGlmIChtZXRob2RzW21ldGhvZE5hbWVdLmlucHV0KSB7XG4gICAgICAgICAgICBsZXQgaW5wdXROYW1lID0gbWV0aG9kc1ttZXRob2ROYW1lXS5pbnB1dC4kbmFtZTtcbiAgICAgICAgICAgIGxldCBvdXRwdXROYW1lID0gXCJcIjtcbiAgICAgICAgICAgIGlmIChtZXRob2RzW21ldGhvZE5hbWVdLm91dHB1dClcbiAgICAgICAgICAgICAgb3V0cHV0TmFtZSA9IG1ldGhvZHNbbWV0aG9kTmFtZV0ub3V0cHV0LiRuYW1lO1xuICAgICAgICAgICAgdG9wRWxzW2lucHV0TmFtZV0gPSB7IFwibWV0aG9kTmFtZVwiOiBtZXRob2ROYW1lLCBcIm91dHB1dE5hbWVcIjogb3V0cHV0TmFtZSB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBwcmVwYXJlIHNvYXAgZW52ZWxvcGUgeG1sbnMgZGVmaW5pdGlvbiBzdHJpbmdcbiAgICAgIHNlbGYueG1sbnNJbkVudmVsb3BlID0gc2VsZi5feG1sbnNNYXAoKTtcbiAgICAgIHNlbGYuY2FsbGJhY2sobnVsbCwgc2VsZik7XG4gICAgfSkuY2F0Y2goZXJyID0+IHNlbGYuY2FsbGJhY2soZXJyKSk7XG5cbiAgfSk7XG5cbiAgLy8gcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpIHtcbiAgLy8gICB0cnkge1xuICAvLyAgICAgZnJvbUZ1bmMuY2FsbChzZWxmLCBkZWZpbml0aW9uKTtcbiAgLy8gICB9IGNhdGNoIChlKSB7XG4gIC8vICAgICByZXR1cm4gc2VsZi5jYWxsYmFjayhlLm1lc3NhZ2UpO1xuICAvLyAgIH1cblxuICAvLyAgIHNlbGYucHJvY2Vzc0luY2x1ZGVzKGZ1bmN0aW9uKGVycikge1xuICAvLyAgICAgbGV0IG5hbWU7XG4gIC8vICAgICBpZiAoZXJyKSB7XG4gIC8vICAgICAgIHJldHVybiBzZWxmLmNhbGxiYWNrKGVycik7XG4gIC8vICAgICB9XG5cbiAgLy8gICAgIHNlbGYuZGVmaW5pdGlvbnMuZGVsZXRlRml4ZWRBdHRycygpO1xuICAvLyAgICAgbGV0IHNlcnZpY2VzID0gc2VsZi5zZXJ2aWNlcyA9IHNlbGYuZGVmaW5pdGlvbnMuc2VydmljZXM7XG4gIC8vICAgICBpZiAoc2VydmljZXMpIHtcbiAgLy8gICAgICAgZm9yIChuYW1lIGluIHNlcnZpY2VzKSB7XG4gIC8vICAgICAgICAgc2VydmljZXNbbmFtZV0ucG9zdFByb2Nlc3Moc2VsZi5kZWZpbml0aW9ucyk7XG4gIC8vICAgICAgIH1cbiAgLy8gICAgIH1cbiAgLy8gICAgIGxldCBjb21wbGV4VHlwZXMgPSBzZWxmLmRlZmluaXRpb25zLmNvbXBsZXhUeXBlcztcbiAgLy8gICAgIGlmIChjb21wbGV4VHlwZXMpIHtcbiAgLy8gICAgICAgZm9yIChuYW1lIGluIGNvbXBsZXhUeXBlcykge1xuICAvLyAgICAgICAgIGNvbXBsZXhUeXBlc1tuYW1lXS5kZWxldGVGaXhlZEF0dHJzKCk7XG4gIC8vICAgICAgIH1cbiAgLy8gICAgIH1cblxuICAvLyAgICAgLy8gZm9yIGRvY3VtZW50IHN0eWxlLCBmb3IgZXZlcnkgYmluZGluZywgcHJlcGFyZSBpbnB1dCBtZXNzYWdlIGVsZW1lbnQgbmFtZSB0byAobWV0aG9kTmFtZSwgb3V0cHV0IG1lc3NhZ2UgZWxlbWVudCBuYW1lKSBtYXBwaW5nXG4gIC8vICAgICBsZXQgYmluZGluZ3MgPSBzZWxmLmRlZmluaXRpb25zLmJpbmRpbmdzO1xuICAvLyAgICAgZm9yIChsZXQgYmluZGluZ05hbWUgaW4gYmluZGluZ3MpIHtcbiAgLy8gICAgICAgbGV0IGJpbmRpbmcgPSBiaW5kaW5nc1tiaW5kaW5nTmFtZV07XG4gIC8vICAgICAgIGlmICh0eXBlb2YgYmluZGluZy5zdHlsZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgLy8gICAgICAgICBiaW5kaW5nLnN0eWxlID0gJ2RvY3VtZW50JztcbiAgLy8gICAgICAgfVxuICAvLyAgICAgICBpZiAoYmluZGluZy5zdHlsZSAhPT0gJ2RvY3VtZW50JylcbiAgLy8gICAgICAgICBjb250aW51ZTtcbiAgLy8gICAgICAgbGV0IG1ldGhvZHMgPSBiaW5kaW5nLm1ldGhvZHM7XG4gIC8vICAgICAgIGxldCB0b3BFbHMgPSBiaW5kaW5nLnRvcEVsZW1lbnRzID0ge307XG4gIC8vICAgICAgIGZvciAobGV0IG1ldGhvZE5hbWUgaW4gbWV0aG9kcykge1xuICAvLyAgICAgICAgIGlmIChtZXRob2RzW21ldGhvZE5hbWVdLmlucHV0KSB7XG4gIC8vICAgICAgICAgICBsZXQgaW5wdXROYW1lID0gbWV0aG9kc1ttZXRob2ROYW1lXS5pbnB1dC4kbmFtZTtcbiAgLy8gICAgICAgICAgIGxldCBvdXRwdXROYW1lPVwiXCI7XG4gIC8vICAgICAgICAgICBpZihtZXRob2RzW21ldGhvZE5hbWVdLm91dHB1dCApXG4gIC8vICAgICAgICAgICAgIG91dHB1dE5hbWUgPSBtZXRob2RzW21ldGhvZE5hbWVdLm91dHB1dC4kbmFtZTtcbiAgLy8gICAgICAgICAgIHRvcEVsc1tpbnB1dE5hbWVdID0ge1wibWV0aG9kTmFtZVwiOiBtZXRob2ROYW1lLCBcIm91dHB1dE5hbWVcIjogb3V0cHV0TmFtZX07XG4gIC8vICAgICAgICAgfVxuICAvLyAgICAgICB9XG4gIC8vICAgICB9XG5cbiAgLy8gICAgIC8vIHByZXBhcmUgc29hcCBlbnZlbG9wZSB4bWxucyBkZWZpbml0aW9uIHN0cmluZ1xuICAvLyAgICAgc2VsZi54bWxuc0luRW52ZWxvcGUgPSBzZWxmLl94bWxuc01hcCgpO1xuXG4gIC8vICAgICBzZWxmLmNhbGxiYWNrKGVyciwgc2VsZik7XG4gIC8vICAgfSk7XG5cbiAgLy8gfSk7XG59O1xuXG5XU0RMLnByb3RvdHlwZS5pZ25vcmVkTmFtZXNwYWNlcyA9IFsndG5zJywgJ3RhcmdldE5hbWVzcGFjZScsICd0eXBlZE5hbWVzcGFjZSddO1xuXG5XU0RMLnByb3RvdHlwZS5pZ25vcmVCYXNlTmFtZVNwYWNlcyA9IGZhbHNlO1xuXG5XU0RMLnByb3RvdHlwZS52YWx1ZUtleSA9ICckdmFsdWUnO1xuV1NETC5wcm90b3R5cGUueG1sS2V5ID0gJyR4bWwnO1xuXG5XU0RMLnByb3RvdHlwZS5faW5pdGlhbGl6ZU9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB0aGlzLl9vcmlnaW5hbElnbm9yZWROYW1lc3BhY2VzID0gKG9wdGlvbnMgfHwge30pLmlnbm9yZWROYW1lc3BhY2VzO1xuICB0aGlzLm9wdGlvbnMgPSB7fTtcblxuICBsZXQgaWdub3JlZE5hbWVzcGFjZXMgPSBvcHRpb25zID8gb3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcyA6IG51bGw7XG5cbiAgaWYgKGlnbm9yZWROYW1lc3BhY2VzICYmXG4gICAgKEFycmF5LmlzQXJyYXkoaWdub3JlZE5hbWVzcGFjZXMubmFtZXNwYWNlcykgfHwgdHlwZW9mIGlnbm9yZWROYW1lc3BhY2VzLm5hbWVzcGFjZXMgPT09ICdzdHJpbmcnKSkge1xuICAgIGlmIChpZ25vcmVkTmFtZXNwYWNlcy5vdmVycmlkZSkge1xuICAgICAgdGhpcy5vcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzID0gaWdub3JlZE5hbWVzcGFjZXMubmFtZXNwYWNlcztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzID0gdGhpcy5pZ25vcmVkTmFtZXNwYWNlcy5jb25jYXQoaWdub3JlZE5hbWVzcGFjZXMubmFtZXNwYWNlcyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMub3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcyA9IHRoaXMuaWdub3JlZE5hbWVzcGFjZXM7XG4gIH1cblxuICB0aGlzLm9wdGlvbnMudmFsdWVLZXkgPSBvcHRpb25zLnZhbHVlS2V5IHx8IHRoaXMudmFsdWVLZXk7XG4gIHRoaXMub3B0aW9ucy54bWxLZXkgPSBvcHRpb25zLnhtbEtleSB8fCB0aGlzLnhtbEtleTtcbiAgaWYgKG9wdGlvbnMuZXNjYXBlWE1MICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLm9wdGlvbnMuZXNjYXBlWE1MID0gb3B0aW9ucy5lc2NhcGVYTUw7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5vcHRpb25zLmVzY2FwZVhNTCA9IHRydWU7XG4gIH1cbiAgaWYgKG9wdGlvbnMucmV0dXJuRmF1bHQgIT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMub3B0aW9ucy5yZXR1cm5GYXVsdCA9IG9wdGlvbnMucmV0dXJuRmF1bHQ7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5vcHRpb25zLnJldHVybkZhdWx0ID0gZmFsc2U7XG4gIH1cbiAgdGhpcy5vcHRpb25zLmhhbmRsZU5pbEFzTnVsbCA9ICEhb3B0aW9ucy5oYW5kbGVOaWxBc051bGw7XG5cbiAgaWYgKG9wdGlvbnMubmFtZXNwYWNlQXJyYXlFbGVtZW50cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5vcHRpb25zLm5hbWVzcGFjZUFycmF5RWxlbWVudHMgPSBvcHRpb25zLm5hbWVzcGFjZUFycmF5RWxlbWVudHM7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5vcHRpb25zLm5hbWVzcGFjZUFycmF5RWxlbWVudHMgPSB0cnVlO1xuICB9XG5cbiAgLy8gQWxsb3cgYW55IHJlcXVlc3QgaGVhZGVycyB0byBrZWVwIHBhc3NpbmcgdGhyb3VnaFxuICB0aGlzLm9wdGlvbnMud3NkbF9oZWFkZXJzID0gb3B0aW9ucy53c2RsX2hlYWRlcnM7XG4gIHRoaXMub3B0aW9ucy53c2RsX29wdGlvbnMgPSBvcHRpb25zLndzZGxfb3B0aW9ucztcbiAgaWYgKG9wdGlvbnMuaHR0cENsaWVudCkge1xuICAgIHRoaXMub3B0aW9ucy5odHRwQ2xpZW50ID0gb3B0aW9ucy5odHRwQ2xpZW50O1xuICB9XG5cbiAgLy8gVGhlIHN1cHBsaWVkIHJlcXVlc3Qtb2JqZWN0IHNob3VsZCBiZSBwYXNzZWQgdGhyb3VnaFxuICBpZiAob3B0aW9ucy5yZXF1ZXN0KSB7XG4gICAgdGhpcy5vcHRpb25zLnJlcXVlc3QgPSBvcHRpb25zLnJlcXVlc3Q7XG4gIH1cblxuICBsZXQgaWdub3JlQmFzZU5hbWVTcGFjZXMgPSBvcHRpb25zID8gb3B0aW9ucy5pZ25vcmVCYXNlTmFtZVNwYWNlcyA6IG51bGw7XG4gIGlmIChpZ25vcmVCYXNlTmFtZVNwYWNlcyAhPT0gbnVsbCAmJiB0eXBlb2YgaWdub3JlQmFzZU5hbWVTcGFjZXMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgdGhpcy5vcHRpb25zLmlnbm9yZUJhc2VOYW1lU3BhY2VzID0gaWdub3JlQmFzZU5hbWVTcGFjZXM7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5vcHRpb25zLmlnbm9yZUJhc2VOYW1lU3BhY2VzID0gdGhpcy5pZ25vcmVCYXNlTmFtZVNwYWNlcztcbiAgfVxuXG4gIC8vIFdvcmtzIG9ubHkgaW4gY2xpZW50XG4gIHRoaXMub3B0aW9ucy5mb3JjZVNvYXAxMkhlYWRlcnMgPSBvcHRpb25zLmZvcmNlU29hcDEySGVhZGVycztcbiAgdGhpcy5vcHRpb25zLmN1c3RvbURlc2VyaWFsaXplciA9IG9wdGlvbnMuY3VzdG9tRGVzZXJpYWxpemVyO1xuXG4gIGlmIChvcHRpb25zLm92ZXJyaWRlUm9vdEVsZW1lbnQgIT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMub3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50ID0gb3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50O1xuICB9XG5cbiAgdGhpcy5vcHRpb25zLnVzZUVtcHR5VGFnID0gISFvcHRpb25zLnVzZUVtcHR5VGFnO1xufTtcblxuV1NETC5wcm90b3R5cGUub25SZWFkeSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBpZiAoY2FsbGJhY2spXG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xufTtcblxuV1NETC5wcm90b3R5cGUuX3Byb2Nlc3NOZXh0SW5jbHVkZSA9IGFzeW5jIGZ1bmN0aW9uIChpbmNsdWRlcykge1xuICBsZXQgc2VsZiA9IHRoaXMsXG4gICAgaW5jbHVkZSA9IGluY2x1ZGVzLnNoaWZ0KCksXG4gICAgb3B0aW9ucztcblxuICBpZiAoIWluY2x1ZGUpXG4gICAgcmV0dXJuOyAvLyBjYWxsYmFjaygpO1xuXG4gIGxldCBpbmNsdWRlUGF0aDtcbiAgaWYgKCEvXmh0dHBzPzovLnRlc3Qoc2VsZi51cmkpICYmICEvXmh0dHBzPzovLnRlc3QoaW5jbHVkZS5sb2NhdGlvbikpIHtcbiAgICAvLyBpbmNsdWRlUGF0aCA9IHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUoc2VsZi51cmkpLCBpbmNsdWRlLmxvY2F0aW9uKTtcbiAgfSBlbHNlIHtcbiAgICBpbmNsdWRlUGF0aCA9IHVybC5yZXNvbHZlKHNlbGYudXJpIHx8ICcnLCBpbmNsdWRlLmxvY2F0aW9uKTtcbiAgfVxuXG4gIG9wdGlvbnMgPSBfLmFzc2lnbih7fSwgdGhpcy5vcHRpb25zKTtcbiAgLy8gZm9sbG93IHN1cHBsaWVkIGlnbm9yZWROYW1lc3BhY2VzIG9wdGlvblxuICBvcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzID0gdGhpcy5fb3JpZ2luYWxJZ25vcmVkTmFtZXNwYWNlcyB8fCB0aGlzLm9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXM7XG4gIG9wdGlvbnMuV1NETF9DQUNIRSA9IHRoaXMuV1NETF9DQUNIRTtcblxuICBjb25zdCB3c2RsID0gYXdhaXQgb3Blbl93c2RsX3JlY3Vyc2l2ZShpbmNsdWRlUGF0aCwgb3B0aW9ucylcbiAgc2VsZi5faW5jbHVkZXNXc2RsLnB1c2god3NkbCk7XG5cbiAgaWYgKHdzZGwuZGVmaW5pdGlvbnMgaW5zdGFuY2VvZiBEZWZpbml0aW9uc0VsZW1lbnQpIHtcbiAgICBfLm1lcmdlV2l0aChzZWxmLmRlZmluaXRpb25zLCB3c2RsLmRlZmluaXRpb25zLCBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIChhIGluc3RhbmNlb2YgU2NoZW1hRWxlbWVudCkgPyBhLm1lcmdlKGIpIDogdW5kZWZpbmVkO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHNlbGYuZGVmaW5pdGlvbnMuc2NoZW1hc1tpbmNsdWRlLm5hbWVzcGFjZSB8fCB3c2RsLmRlZmluaXRpb25zLiR0YXJnZXROYW1lc3BhY2VdID0gZGVlcE1lcmdlKHNlbGYuZGVmaW5pdGlvbnMuc2NoZW1hc1tpbmNsdWRlLm5hbWVzcGFjZSB8fCB3c2RsLmRlZmluaXRpb25zLiR0YXJnZXROYW1lc3BhY2VdLCB3c2RsLmRlZmluaXRpb25zKTtcbiAgfVxuXG4gIHJldHVybiBzZWxmLl9wcm9jZXNzTmV4dEluY2x1ZGUoaW5jbHVkZXMpO1xuXG4gIC8vIG9wZW5fd3NkbF9yZWN1cnNpdmUoaW5jbHVkZVBhdGgsIG9wdGlvbnMsIGZ1bmN0aW9uKGVyciwgd3NkbCkge1xuICAvLyAgIGlmIChlcnIpIHtcbiAgLy8gICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAvLyAgIH1cblxuICAvLyAgIHNlbGYuX2luY2x1ZGVzV3NkbC5wdXNoKHdzZGwpO1xuXG4gIC8vICAgaWYgKHdzZGwuZGVmaW5pdGlvbnMgaW5zdGFuY2VvZiBEZWZpbml0aW9uc0VsZW1lbnQpIHtcbiAgLy8gICAgIF8ubWVyZ2VXaXRoKHNlbGYuZGVmaW5pdGlvbnMsIHdzZGwuZGVmaW5pdGlvbnMsIGZ1bmN0aW9uKGEsYikge1xuICAvLyAgICAgICByZXR1cm4gKGEgaW5zdGFuY2VvZiBTY2hlbWFFbGVtZW50KSA/IGEubWVyZ2UoYikgOiB1bmRlZmluZWQ7XG4gIC8vICAgICB9KTtcbiAgLy8gICB9IGVsc2Uge1xuICAvLyAgICAgc2VsZi5kZWZpbml0aW9ucy5zY2hlbWFzW2luY2x1ZGUubmFtZXNwYWNlIHx8IHdzZGwuZGVmaW5pdGlvbnMuJHRhcmdldE5hbWVzcGFjZV0gPSBkZWVwTWVyZ2Uoc2VsZi5kZWZpbml0aW9ucy5zY2hlbWFzW2luY2x1ZGUubmFtZXNwYWNlIHx8IHdzZGwuZGVmaW5pdGlvbnMuJHRhcmdldE5hbWVzcGFjZV0sIHdzZGwuZGVmaW5pdGlvbnMpO1xuICAvLyAgIH1cbiAgLy8gICBzZWxmLl9wcm9jZXNzTmV4dEluY2x1ZGUoaW5jbHVkZXMsIGZ1bmN0aW9uKGVycikge1xuICAvLyAgICAgY2FsbGJhY2soZXJyKTtcbiAgLy8gICB9KTtcbiAgLy8gfSk7XG59O1xuXG5XU0RMLnByb3RvdHlwZS5wcm9jZXNzSW5jbHVkZXMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gIGxldCBzY2hlbWFzID0gdGhpcy5kZWZpbml0aW9ucy5zY2hlbWFzLFxuICAgIGluY2x1ZGVzID0gW107XG5cbiAgZm9yIChsZXQgbnMgaW4gc2NoZW1hcykge1xuICAgIGxldCBzY2hlbWEgPSBzY2hlbWFzW25zXTtcbiAgICBpbmNsdWRlcyA9IGluY2x1ZGVzLmNvbmNhdChzY2hlbWEuaW5jbHVkZXMgfHwgW10pO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuX3Byb2Nlc3NOZXh0SW5jbHVkZShpbmNsdWRlcyk7XG59O1xuXG5XU0RMLnByb3RvdHlwZS5kZXNjcmliZVNlcnZpY2VzID0gZnVuY3Rpb24gKCkge1xuICBsZXQgc2VydmljZXMgPSB7fTtcbiAgZm9yIChsZXQgbmFtZSBpbiB0aGlzLnNlcnZpY2VzKSB7XG4gICAgbGV0IHNlcnZpY2UgPSB0aGlzLnNlcnZpY2VzW25hbWVdO1xuICAgIHNlcnZpY2VzW25hbWVdID0gc2VydmljZS5kZXNjcmlwdGlvbih0aGlzLmRlZmluaXRpb25zKTtcbiAgfVxuICByZXR1cm4gc2VydmljZXM7XG59O1xuXG5XU0RMLnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMueG1sIHx8ICcnO1xufTtcblxuV1NETC5wcm90b3R5cGUueG1sVG9PYmplY3QgPSBmdW5jdGlvbiAoeG1sLCBjYWxsYmFjaykge1xuICBsZXQgc2VsZiA9IHRoaXM7XG4gIGxldCBwID0gdHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nID8ge30gOiBzYXgucGFyc2VyKHRydWUpO1xuICBsZXQgb2JqZWN0TmFtZSA9IG51bGw7XG4gIGxldCByb290OiBhbnkgPSB7fTtcbiAgbGV0IHNjaGVtYT17fTtcbiAgaWYoIXRoaXMub3B0aW9ucy5mb3JjZVNvYXAxMkhlYWRlcnMpe1xuICAgICBzY2hlbWEgPSB7XG4gICAgICBFbnZlbG9wZToge1xuICAgICAgICBIZWFkZXI6IHtcbiAgICAgICAgICBTZWN1cml0eToge1xuICAgICAgICAgICAgVXNlcm5hbWVUb2tlbjoge1xuICAgICAgICAgICAgICBVc2VybmFtZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgIFBhc3N3b3JkOiAnc3RyaW5nJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgQm9keToge1xuICAgICAgICAgIEZhdWx0OiB7XG4gICAgICAgICAgICBmYXVsdGNvZGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgZmF1bHRzdHJpbmc6ICdzdHJpbmcnLFxuICAgICAgICAgICAgZGV0YWlsOiAnc3RyaW5nJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgIHNjaGVtYSA9e1xuICAgICAgRW52ZWxvcGU6IHtcbiAgICAgICAgSGVhZGVyOiB7XG4gICAgICAgICAgU2VjdXJpdHk6IHtcbiAgICAgICAgICAgIFVzZXJuYW1lVG9rZW46IHtcbiAgICAgICAgICAgICAgVXNlcm5hbWU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICBQYXNzd29yZDogJ3N0cmluZydcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIEJvZHk6e1xuICAgICAgICAgIENvZGU6IHtcbiAgICAgICAgICAgIFZhbHVlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgU3ViY29kZTpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgIFZhbHVlOiAnc3RyaW5nJyBcbiAgICAgICAgICAgICB9IFxuICAgICAgICAgICB9LFxuICAgICAgICAgICBSZWFzb246IHsgVGV4dDogJ3N0cmluZyd9LFxuICAgICAgICAgICBzdGF0dXNDb2RlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgRGV0YWlsOiAnb2JqZWN0J1xuICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgIFxuXG4gICAgfVxuICB9XG4gIFxuICAvL2NvbnNvbGUubG9nKCdzY2hlbWEnLHNjaGVtYSk7XG4gIGxldCBzdGFjazogYW55W10gPSBbeyBuYW1lOiBudWxsLCBvYmplY3Q6IHJvb3QsIHNjaGVtYTogc2NoZW1hIH1dO1xuICBsZXQgeG1sbnM6IGFueSA9IHt9O1xuXG4gIGxldCByZWZzID0ge30sIGlkOyAvLyB7aWQ6e2hyZWZzOltdLG9iajp9LCAuLi59XG5cbiAgcC5vbm9wZW50YWcgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgIGxldCBuc05hbWUgPSBub2RlLm5hbWU7XG4gICAgbGV0IGF0dHJzOiBhbnkgPSBub2RlLmF0dHJpYnV0ZXM7XG4gICAgbGV0IG5hbWUgPSBzcGxpdFFOYW1lKG5zTmFtZSkubmFtZSxcbiAgICAgIGF0dHJpYnV0ZU5hbWUsXG4gICAgICB0b3AgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXSxcbiAgICAgIHRvcFNjaGVtYSA9IHRvcC5zY2hlbWEsXG4gICAgICBlbGVtZW50QXR0cmlidXRlcyA9IHt9LFxuICAgICAgaGFzTm9uWG1sbnNBdHRyaWJ1dGUgPSBmYWxzZSxcbiAgICAgIGhhc05pbEF0dHJpYnV0ZSA9IGZhbHNlLFxuICAgICAgb2JqID0ge307XG4gICAgbGV0IG9yaWdpbmFsTmFtZSA9IG5hbWU7XG5cbiAgICBpZiAoIW9iamVjdE5hbWUgJiYgdG9wLm5hbWUgPT09ICdCb2R5JyAmJiBuYW1lICE9PSAnRmF1bHQnKSB7XG4gICAgICBsZXQgbWVzc2FnZSA9IHNlbGYuZGVmaW5pdGlvbnMubWVzc2FnZXNbbmFtZV07XG4gICAgICAvLyBTdXBwb3J0IFJQQy9saXRlcmFsIG1lc3NhZ2VzIHdoZXJlIHJlc3BvbnNlIGJvZHkgY29udGFpbnMgb25lIGVsZW1lbnQgbmFtZWRcbiAgICAgIC8vIGFmdGVyIHRoZSBvcGVyYXRpb24gKyAnUmVzcG9uc2UnLiBTZWUgaHR0cDovL3d3dy53My5vcmcvVFIvd3NkbCNfbmFtZXNcbiAgICAgIGlmICghbWVzc2FnZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIERldGVybWluZSBpZiB0aGlzIGlzIHJlcXVlc3Qgb3IgcmVzcG9uc2VcbiAgICAgICAgICBsZXQgaXNJbnB1dCA9IGZhbHNlO1xuICAgICAgICAgIGxldCBpc091dHB1dCA9IGZhbHNlO1xuICAgICAgICAgIGlmICgoL1Jlc3BvbnNlJC8pLnRlc3QobmFtZSkpIHtcbiAgICAgICAgICAgIGlzT3V0cHV0ID0gdHJ1ZTtcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1Jlc3BvbnNlJC8sICcnKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCgvUmVxdWVzdCQvKS50ZXN0KG5hbWUpKSB7XG4gICAgICAgICAgICBpc0lucHV0ID0gdHJ1ZTtcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1JlcXVlc3QkLywgJycpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoKC9Tb2xpY2l0JC8pLnRlc3QobmFtZSkpIHtcbiAgICAgICAgICAgIGlzSW5wdXQgPSB0cnVlO1xuICAgICAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvU29saWNpdCQvLCAnJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIExvb2sgdXAgdGhlIGFwcHJvcHJpYXRlIG1lc3NhZ2UgYXMgZ2l2ZW4gaW4gdGhlIHBvcnRUeXBlJ3Mgb3BlcmF0aW9uc1xuICAgICAgICAgIGxldCBwb3J0VHlwZXMgPSBzZWxmLmRlZmluaXRpb25zLnBvcnRUeXBlcztcbiAgICAgICAgICBsZXQgcG9ydFR5cGVOYW1lcyA9IE9iamVjdC5rZXlzKHBvcnRUeXBlcyk7XG4gICAgICAgICAgLy8gQ3VycmVudGx5IHRoaXMgc3VwcG9ydHMgb25seSBvbmUgcG9ydFR5cGUgZGVmaW5pdGlvbi5cbiAgICAgICAgICBsZXQgcG9ydFR5cGUgPSBwb3J0VHlwZXNbcG9ydFR5cGVOYW1lc1swXV07XG4gICAgICAgICAgaWYgKGlzSW5wdXQpIHtcbiAgICAgICAgICAgIG5hbWUgPSBwb3J0VHlwZS5tZXRob2RzW25hbWVdLmlucHV0LiRuYW1lO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuYW1lID0gcG9ydFR5cGUubWV0aG9kc1tuYW1lXS5vdXRwdXQuJG5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1lc3NhZ2UgPSBzZWxmLmRlZmluaXRpb25zLm1lc3NhZ2VzW25hbWVdO1xuICAgICAgICAgIC8vICdjYWNoZScgdGhpcyBhbGlhcyB0byBzcGVlZCBmdXR1cmUgbG9va3Vwc1xuICAgICAgICAgIHNlbGYuZGVmaW5pdGlvbnMubWVzc2FnZXNbb3JpZ2luYWxOYW1lXSA9IHNlbGYuZGVmaW5pdGlvbnMubWVzc2FnZXNbbmFtZV07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnJldHVybkZhdWx0KSB7XG4gICAgICAgICAgICBwLm9uZXJyb3IoZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRvcFNjaGVtYSA9IG1lc3NhZ2UuZGVzY3JpcHRpb24oc2VsZi5kZWZpbml0aW9ucyk7XG4gICAgICBvYmplY3ROYW1lID0gb3JpZ2luYWxOYW1lO1xuICAgIH1cblxuICAgIGlmIChhdHRycy5ocmVmKSB7XG4gICAgICBpZCA9IGF0dHJzLmhyZWYuc3Vic3RyKDEpO1xuICAgICAgaWYgKCFyZWZzW2lkXSkge1xuICAgICAgICByZWZzW2lkXSA9IHsgaHJlZnM6IFtdLCBvYmo6IG51bGwgfTtcbiAgICAgIH1cbiAgICAgIHJlZnNbaWRdLmhyZWZzLnB1c2goeyBwYXI6IHRvcC5vYmplY3QsIGtleTogbmFtZSwgb2JqOiBvYmogfSk7XG4gICAgfVxuICAgIGlmIChpZCA9IGF0dHJzLmlkKSB7XG4gICAgICBpZiAoIXJlZnNbaWRdKSB7XG4gICAgICAgIHJlZnNbaWRdID0geyBocmVmczogW10sIG9iajogbnVsbCB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vSGFuZGxlIGVsZW1lbnQgYXR0cmlidXRlc1xuICAgIGZvciAoYXR0cmlidXRlTmFtZSBpbiBhdHRycykge1xuICAgICAgaWYgKC9eeG1sbnM6fF54bWxucyQvLnRlc3QoYXR0cmlidXRlTmFtZSkpIHtcbiAgICAgICAgeG1sbnNbc3BsaXRRTmFtZShhdHRyaWJ1dGVOYW1lKS5uYW1lXSA9IGF0dHJzW2F0dHJpYnV0ZU5hbWVdO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGhhc05vblhtbG5zQXR0cmlidXRlID0gdHJ1ZTtcbiAgICAgIGVsZW1lbnRBdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID0gYXR0cnNbYXR0cmlidXRlTmFtZV07XG4gICAgfVxuXG4gICAgZm9yIChhdHRyaWJ1dGVOYW1lIGluIGVsZW1lbnRBdHRyaWJ1dGVzKSB7XG4gICAgICBsZXQgcmVzID0gc3BsaXRRTmFtZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgIGlmIChyZXMubmFtZSA9PT0gJ25pbCcgJiYgeG1sbnNbcmVzLnByZWZpeF0gPT09ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZScgJiYgZWxlbWVudEF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gJiZcbiAgICAgICAgKGVsZW1lbnRBdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdLnRvTG93ZXJDYXNlKCkgPT09ICd0cnVlJyB8fCBlbGVtZW50QXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSA9PT0gJzEnKVxuICAgICAgKSB7XG4gICAgICAgIGhhc05pbEF0dHJpYnV0ZSA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoYXNOb25YbWxuc0F0dHJpYnV0ZSkge1xuICAgICAgb2JqW3NlbGYub3B0aW9ucy5hdHRyaWJ1dGVzS2V5XSA9IGVsZW1lbnRBdHRyaWJ1dGVzO1xuICAgIH1cblxuICAgIC8vIFBpY2sgdXAgdGhlIHNjaGVtYSBmb3IgdGhlIHR5cGUgc3BlY2lmaWVkIGluIGVsZW1lbnQncyB4c2k6dHlwZSBhdHRyaWJ1dGUuXG4gICAgbGV0IHhzaVR5cGVTY2hlbWE7XG4gICAgbGV0IHhzaVR5cGUgPSBlbGVtZW50QXR0cmlidXRlc1sneHNpOnR5cGUnXTtcbiAgICBpZiAoeHNpVHlwZSkge1xuICAgICAgbGV0IHR5cGUgPSBzcGxpdFFOYW1lKHhzaVR5cGUpO1xuICAgICAgbGV0IHR5cGVVUkk7XG4gICAgICBpZiAodHlwZS5wcmVmaXggPT09IFROU19QUkVGSVgpIHtcbiAgICAgICAgLy8gSW4gY2FzZSBvZiB4c2k6dHlwZSA9IFwiTXlUeXBlXCJcbiAgICAgICAgdHlwZVVSSSA9IHhtbG5zW3R5cGUucHJlZml4XSB8fCB4bWxucy54bWxucztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHR5cGVVUkkgPSB4bWxuc1t0eXBlLnByZWZpeF07XG4gICAgICB9XG4gICAgICBsZXQgdHlwZURlZiA9IHNlbGYuZmluZFNjaGVtYU9iamVjdCh0eXBlVVJJLCB0eXBlLm5hbWUpO1xuICAgICAgaWYgKHR5cGVEZWYpIHtcbiAgICAgICAgeHNpVHlwZVNjaGVtYSA9IHR5cGVEZWYuZGVzY3JpcHRpb24oc2VsZi5kZWZpbml0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRvcFNjaGVtYSAmJiB0b3BTY2hlbWFbbmFtZSArICdbXSddKSB7XG4gICAgICBuYW1lID0gbmFtZSArICdbXSc7XG4gICAgfVxuICAgIHN0YWNrLnB1c2goe1xuICAgICAgbmFtZTogb3JpZ2luYWxOYW1lLFxuICAgICAgb2JqZWN0OiBvYmosXG4gICAgICBzY2hlbWE6ICh4c2lUeXBlU2NoZW1hIHx8ICh0b3BTY2hlbWEgJiYgdG9wU2NoZW1hW25hbWVdKSksXG4gICAgICBpZDogYXR0cnMuaWQsXG4gICAgICBuaWw6IGhhc05pbEF0dHJpYnV0ZVxuICAgIH0pO1xuICB9O1xuXG4gIHAub25jbG9zZXRhZyA9IGZ1bmN0aW9uIChuc05hbWUpIHtcbiAgICBsZXQgY3VyOiBhbnkgPSBzdGFjay5wb3AoKSxcbiAgICAgIG9iaiA9IGN1ci5vYmplY3QsXG4gICAgICB0b3AgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXSxcbiAgICAgIHRvcE9iamVjdCA9IHRvcC5vYmplY3QsXG4gICAgICB0b3BTY2hlbWEgPSB0b3Auc2NoZW1hLFxuICAgICAgbmFtZSA9IHNwbGl0UU5hbWUobnNOYW1lKS5uYW1lO1xuXG4gICAgaWYgKHR5cGVvZiBjdXIuc2NoZW1hID09PSAnc3RyaW5nJyAmJiAoY3VyLnNjaGVtYSA9PT0gJ3N0cmluZycgfHwgKDxzdHJpbmc+Y3VyLnNjaGVtYSkuc3BsaXQoJzonKVsxXSA9PT0gJ3N0cmluZycpKSB7XG4gICAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT09IDApIG9iaiA9IGN1ci5vYmplY3QgPSAnJztcbiAgICB9XG5cbiAgICBpZiAoY3VyLm5pbCA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKHNlbGYub3B0aW9ucy5oYW5kbGVOaWxBc051bGwpIHtcbiAgICAgICAgb2JqID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoXy5pc1BsYWluT2JqZWN0KG9iaikgJiYgIU9iamVjdC5rZXlzKG9iaikubGVuZ3RoKSB7XG4gICAgICBvYmogPSBudWxsO1xuICAgIH1cblxuICAgIGlmICh0b3BTY2hlbWEgJiYgdG9wU2NoZW1hW25hbWUgKyAnW10nXSkge1xuICAgICAgaWYgKCF0b3BPYmplY3RbbmFtZV0pIHtcbiAgICAgICAgdG9wT2JqZWN0W25hbWVdID0gW107XG4gICAgICB9XG4gICAgICB0b3BPYmplY3RbbmFtZV0ucHVzaChvYmopO1xuICAgIH0gZWxzZSBpZiAobmFtZSBpbiB0b3BPYmplY3QpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheSh0b3BPYmplY3RbbmFtZV0pKSB7XG4gICAgICAgIHRvcE9iamVjdFtuYW1lXSA9IFt0b3BPYmplY3RbbmFtZV1dO1xuICAgICAgfVxuICAgICAgdG9wT2JqZWN0W25hbWVdLnB1c2gob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdG9wT2JqZWN0W25hbWVdID0gb2JqO1xuICAgIH1cblxuICAgIGlmIChjdXIuaWQpIHtcbiAgICAgIHJlZnNbY3VyLmlkXS5vYmogPSBvYmo7XG4gICAgfVxuICB9O1xuXG4gIHAub25jZGF0YSA9IGZ1bmN0aW9uICh0ZXh0KSB7XG4gICAgbGV0IG9yaWdpbmFsVGV4dCA9IHRleHQ7XG4gICAgdGV4dCA9IHRyaW0odGV4dCk7XG4gICAgaWYgKCF0ZXh0Lmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICgvPFxcP3htbFtcXHNcXFNdK1xcPz4vLnRlc3QodGV4dCkpIHtcbiAgICAgIGxldCB0b3AgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICAgIGxldCB2YWx1ZSA9IHNlbGYueG1sVG9PYmplY3QodGV4dCk7XG4gICAgICBpZiAodG9wLm9iamVjdFtzZWxmLm9wdGlvbnMuYXR0cmlidXRlc0tleV0pIHtcbiAgICAgICAgdG9wLm9iamVjdFtzZWxmLm9wdGlvbnMudmFsdWVLZXldID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b3Aub2JqZWN0ID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHAub250ZXh0KG9yaWdpbmFsVGV4dCk7XG4gICAgfVxuICB9O1xuXG4gIHAub25lcnJvciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgcC5yZXN1bWUoKTtcbiAgICB0aHJvdyB7XG4gICAgICBGYXVsdDoge1xuICAgICAgICBmYXVsdGNvZGU6IDUwMCxcbiAgICAgICAgZmF1bHRzdHJpbmc6ICdJbnZhbGlkIFhNTCcsXG4gICAgICAgIGRldGFpbDogbmV3IEVycm9yKGUpLm1lc3NhZ2UsXG4gICAgICAgIHN0YXR1c0NvZGU6IDUwMFxuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgcC5vbnRleHQgPSBmdW5jdGlvbiAodGV4dCkge1xuICAgIGxldCBvcmlnaW5hbFRleHQgPSB0ZXh0O1xuICAgIHRleHQgPSB0cmltKHRleHQpO1xuICAgIGlmICghdGV4dC5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgdG9wID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgbGV0IG5hbWUgPSBzcGxpdFFOYW1lKHRvcC5zY2hlbWEpLm5hbWUsXG4gICAgICB2YWx1ZTtcbiAgICBpZiAoc2VsZi5vcHRpb25zICYmIHNlbGYub3B0aW9ucy5jdXN0b21EZXNlcmlhbGl6ZXIgJiYgc2VsZi5vcHRpb25zLmN1c3RvbURlc2VyaWFsaXplcltuYW1lXSkge1xuICAgICAgdmFsdWUgPSBzZWxmLm9wdGlvbnMuY3VzdG9tRGVzZXJpYWxpemVyW25hbWVdKHRleHQsIHRvcCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYgKG5hbWUgPT09ICdpbnQnIHx8IG5hbWUgPT09ICdpbnRlZ2VyJykge1xuICAgICAgICB2YWx1ZSA9IHBhcnNlSW50KHRleHQsIDEwKTtcbiAgICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gJ2Jvb2wnIHx8IG5hbWUgPT09ICdib29sZWFuJykge1xuICAgICAgICB2YWx1ZSA9IHRleHQudG9Mb3dlckNhc2UoKSA9PT0gJ3RydWUnIHx8IHRleHQgPT09ICcxJztcbiAgICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gJ2RhdGVUaW1lJyB8fCBuYW1lID09PSAnZGF0ZScpIHtcbiAgICAgICAgdmFsdWUgPSBuZXcgRGF0ZSh0ZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzZWxmLm9wdGlvbnMucHJlc2VydmVXaGl0ZXNwYWNlKSB7XG4gICAgICAgICAgdGV4dCA9IG9yaWdpbmFsVGV4dDtcbiAgICAgICAgfVxuICAgICAgICAvLyBoYW5kbGUgc3RyaW5nIG9yIG90aGVyIHR5cGVzXG4gICAgICAgIGlmICh0eXBlb2YgdG9wLm9iamVjdCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB2YWx1ZSA9IHRleHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSB0b3Aub2JqZWN0ICsgdGV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0b3Aub2JqZWN0W3NlbGYub3B0aW9ucy5hdHRyaWJ1dGVzS2V5XSkge1xuICAgICAgdG9wLm9iamVjdFtzZWxmLm9wdGlvbnMudmFsdWVLZXldID0gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRvcC5vYmplY3QgPSB2YWx1ZTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIHdlIGJlIHN0cmVhbWluZ1xuICAgIGxldCBzYXhTdHJlYW0gPSBzYXguY3JlYXRlU3RyZWFtKHRydWUpO1xuICAgIHNheFN0cmVhbS5vbignb3BlbnRhZycsIHAub25vcGVudGFnKTtcbiAgICBzYXhTdHJlYW0ub24oJ2Nsb3NldGFnJywgcC5vbmNsb3NldGFnKTtcbiAgICBzYXhTdHJlYW0ub24oJ2NkYXRhJywgcC5vbmNkYXRhKTtcbiAgICBzYXhTdHJlYW0ub24oJ3RleHQnLCBwLm9udGV4dCk7XG4gICAgeG1sLnBpcGUoc2F4U3RyZWFtKVxuICAgICAgLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgIH0pXG4gICAgICAub24oJ2VuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHI7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgciA9IGZpbmlzaCgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGUpO1xuICAgICAgICB9XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHIpO1xuICAgICAgfSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHAud3JpdGUoeG1sKS5jbG9zZSgpO1xuXG4gIHJldHVybiBmaW5pc2goKTtcblxuICBmdW5jdGlvbiBmaW5pc2goKSB7XG4gICAgLy8gTXVsdGlSZWYgc3VwcG9ydDogbWVyZ2Ugb2JqZWN0cyBpbnN0ZWFkIG9mIHJlcGxhY2luZ1xuICAgIGZvciAobGV0IG4gaW4gcmVmcykge1xuICAgICAgbGV0IHJlZiA9IHJlZnNbbl07XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlZi5ocmVmcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBfLmFzc2lnbihyZWYuaHJlZnNbaV0ub2JqLCByZWYub2JqKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocm9vdC5FbnZlbG9wZSkge1xuICAgICAgbGV0IGJvZHkgPSByb290LkVudmVsb3BlLkJvZHk7XG4gICAgICBsZXQgZXJyb3I6IGFueTtcbiAgICBcbiAgICAgIGlmIChib2R5ICYmIGJvZHkuRmF1bHQpIHtcbiAgICAgICAgXG4gICAgICAgIGlmKCFib2R5LkZhdWx0LkNvZGUpe1xuICAgICAgICBsZXQgY29kZSA9IGJvZHkuRmF1bHQuZmF1bHRjb2RlICYmIGJvZHkuRmF1bHQuZmF1bHRjb2RlLiR2YWx1ZTtcbiAgICAgICAgbGV0IHN0cmluZyA9IGJvZHkuRmF1bHQuZmF1bHRzdHJpbmcgJiYgYm9keS5GYXVsdC5mYXVsdHN0cmluZy4kdmFsdWU7XG4gICAgICAgIGxldCBkZXRhaWwgPSBib2R5LkZhdWx0LmRldGFpbCAmJiBib2R5LkZhdWx0LmRldGFpbC4kdmFsdWU7XG5cbiAgICAgICAgY29kZSA9IGNvZGUgfHwgYm9keS5GYXVsdC5mYXVsdGNvZGU7XG4gICAgICAgIHN0cmluZyA9IHN0cmluZyB8fCBib2R5LkZhdWx0LmZhdWx0c3RyaW5nO1xuICAgICAgICBkZXRhaWwgPSBkZXRhaWwgfHwgYm9keS5GYXVsdC5kZXRhaWw7XG5cbiAgICAgICAgIGVycm9yID0gbmV3IEVycm9yKGNvZGUgKyAnOiAnICsgc3RyaW5nICsgKGRldGFpbCA/ICc6ICcgKyBkZXRhaWwgOiAnJykpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgbGV0IGNvZGUgPSBib2R5LkZhdWx0LkNvZGUuVmFsdWU7XG4gICAgICAgICAgbGV0IHN0cmluZyA9IGJvZHkuRmF1bHQuUmVhc29uLlRleHQuJHZhbHVlO1xuICAgICAgICAgIGxldCBkZXRhaWwgPSBib2R5LkZhdWx0LkRldGFpbC5pbmZvO1xuICAgICAgICAgIGVycm9yID0gbmV3IEVycm9yKGNvZGUgKyAnOiAnICsgc3RyaW5nICsgKGRldGFpbCA/ICc6ICcgKyBkZXRhaWwgOiAnJykpOyBcblxuICAgICAgICB9XG5cbiAgICAgICAgZXJyb3Iucm9vdCA9IHJvb3Q7XG4gICAgICAgIHRocm93IGJvZHkuRmF1bHQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gcm9vdC5FbnZlbG9wZTtcbiAgICB9XG4gICAgcmV0dXJuIHJvb3Q7XG4gIH1cbn07XG5cbi8qKlxuICogTG9vayB1cCBhIFhTRCB0eXBlIG9yIGVsZW1lbnQgYnkgbmFtZXNwYWNlIFVSSSBhbmQgbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IG5zVVJJIE5hbWVzcGFjZSBVUklcbiAqIEBwYXJhbSB7U3RyaW5nfSBxbmFtZSBMb2NhbCBvciBxdWFsaWZpZWQgbmFtZVxuICogQHJldHVybnMgeyp9IFRoZSBYU0QgdHlwZS9lbGVtZW50IGRlZmluaXRpb25cbiAqL1xuV1NETC5wcm90b3R5cGUuZmluZFNjaGVtYU9iamVjdCA9IGZ1bmN0aW9uIChuc1VSSSwgcW5hbWUpIHtcbiAgaWYgKCFuc1VSSSB8fCAhcW5hbWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGxldCBkZWYgPSBudWxsO1xuXG4gIGlmICh0aGlzLmRlZmluaXRpb25zLnNjaGVtYXMpIHtcbiAgICBsZXQgc2NoZW1hID0gdGhpcy5kZWZpbml0aW9ucy5zY2hlbWFzW25zVVJJXTtcbiAgICBpZiAoc2NoZW1hKSB7XG4gICAgICBpZiAocW5hbWUuaW5kZXhPZignOicpICE9PSAtMSkge1xuICAgICAgICBxbmFtZSA9IHFuYW1lLnN1YnN0cmluZyhxbmFtZS5pbmRleE9mKCc6JykgKyAxLCBxbmFtZS5sZW5ndGgpO1xuICAgICAgfVxuXG4gICAgICAvLyBpZiB0aGUgY2xpZW50IHBhc3NlZCBhbiBpbnB1dCBlbGVtZW50IHdoaWNoIGhhcyBhIGAkbG9va3VwVHlwZWAgcHJvcGVydHkgaW5zdGVhZCBvZiBgJHR5cGVgXG4gICAgICAvLyB0aGUgYGRlZmAgaXMgZm91bmQgaW4gYHNjaGVtYS5lbGVtZW50c2AuXG4gICAgICBkZWYgPSBzY2hlbWEuY29tcGxleFR5cGVzW3FuYW1lXSB8fCBzY2hlbWEudHlwZXNbcW5hbWVdIHx8IHNjaGVtYS5lbGVtZW50c1txbmFtZV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRlZjtcbn07XG5cbi8qKlxuICogQ3JlYXRlIGRvY3VtZW50IHN0eWxlIHhtbCBzdHJpbmcgZnJvbSB0aGUgcGFyYW1ldGVyc1xuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7Kn0gcGFyYW1zXG4gKiBAcGFyYW0ge1N0cmluZ30gbnNQcmVmaXhcbiAqIEBwYXJhbSB7U3RyaW5nfSBuc1VSSVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqL1xuV1NETC5wcm90b3R5cGUub2JqZWN0VG9Eb2N1bWVudFhNTCA9IGZ1bmN0aW9uIChuYW1lLCBwYXJhbXMsIG5zUHJlZml4LCBuc1VSSSwgdHlwZSkge1xuICAvL0lmIHVzZXIgc3VwcGxpZXMgWE1MIGFscmVhZHksIGp1c3QgdXNlIHRoYXQuICBYTUwgRGVjbGFyYXRpb24gc2hvdWxkIG5vdCBiZSBwcmVzZW50LlxuICBpZiAocGFyYW1zICYmIHBhcmFtcy5feG1sKSB7XG4gICAgcmV0dXJuIHBhcmFtcy5feG1sO1xuICB9XG4gIGxldCBhcmdzID0ge307XG4gIGFyZ3NbbmFtZV0gPSBwYXJhbXM7XG4gIGxldCBwYXJhbWV0ZXJUeXBlT2JqID0gdHlwZSA/IHRoaXMuZmluZFNjaGVtYU9iamVjdChuc1VSSSwgdHlwZSkgOiBudWxsO1xuICByZXR1cm4gdGhpcy5vYmplY3RUb1hNTChhcmdzLCBudWxsLCBuc1ByZWZpeCwgbnNVUkksIHRydWUsIG51bGwsIHBhcmFtZXRlclR5cGVPYmopO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgUlBDIHN0eWxlIHhtbCBzdHJpbmcgZnJvbSB0aGUgcGFyYW1ldGVyc1xuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7Kn0gcGFyYW1zXG4gKiBAcGFyYW0ge1N0cmluZ30gbnNQcmVmaXhcbiAqIEBwYXJhbSB7U3RyaW5nfSBuc1VSSVxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuV1NETC5wcm90b3R5cGUub2JqZWN0VG9ScGNYTUwgPSBmdW5jdGlvbiAobmFtZSwgcGFyYW1zLCBuc1ByZWZpeCwgbnNVUkksIGlzUGFydHMpIHtcbiAgbGV0IHBhcnRzID0gW107XG4gIGxldCBkZWZzID0gdGhpcy5kZWZpbml0aW9ucztcbiAgbGV0IG5zQXR0ck5hbWUgPSAnX3htbG5zJztcblxuICBuc1ByZWZpeCA9IG5zUHJlZml4IHx8IGZpbmRQcmVmaXgoZGVmcy54bWxucywgbnNVUkkpO1xuXG4gIG5zVVJJID0gbnNVUkkgfHwgZGVmcy54bWxuc1tuc1ByZWZpeF07XG4gIG5zUHJlZml4ID0gbnNQcmVmaXggPT09IFROU19QUkVGSVggPyAnJyA6IChuc1ByZWZpeCArICc6Jyk7XG5cbiAgcGFydHMucHVzaChbJzwnLCBuc1ByZWZpeCwgbmFtZSwgJz4nXS5qb2luKCcnKSk7XG5cbiAgZm9yIChsZXQga2V5IGluIHBhcmFtcykge1xuICAgIGlmICghcGFyYW1zLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoa2V5ICE9PSBuc0F0dHJOYW1lKSB7XG4gICAgICBsZXQgdmFsdWUgPSBwYXJhbXNba2V5XTtcbiAgICAgIGxldCBwcmVmaXhlZEtleSA9IChpc1BhcnRzID8gJycgOiBuc1ByZWZpeCkgKyBrZXk7XG4gICAgICBsZXQgYXR0cmlidXRlcyA9IFtdO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUuaGFzT3duUHJvcGVydHkodGhpcy5vcHRpb25zLmF0dHJpYnV0ZXNLZXkpKSB7XG4gICAgICAgIGxldCBhdHRycyA9IHZhbHVlW3RoaXMub3B0aW9ucy5hdHRyaWJ1dGVzS2V5XTtcbiAgICAgICAgZm9yIChsZXQgbiBpbiBhdHRycykge1xuICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaCgnICcgKyBuICsgJz0nICsgJ1wiJyArIGF0dHJzW25dICsgJ1wiJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHBhcnRzLnB1c2goWyc8JywgcHJlZml4ZWRLZXldLmNvbmNhdChhdHRyaWJ1dGVzKS5jb25jYXQoJz4nKS5qb2luKCcnKSk7XG4gICAgICBwYXJ0cy5wdXNoKCh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSA/IHRoaXMub2JqZWN0VG9YTUwodmFsdWUsIGtleSwgbnNQcmVmaXgsIG5zVVJJKSA6IHhtbEVzY2FwZSh2YWx1ZSkpO1xuICAgICAgcGFydHMucHVzaChbJzwvJywgcHJlZml4ZWRLZXksICc+J10uam9pbignJykpO1xuICAgIH1cbiAgfVxuICBwYXJ0cy5wdXNoKFsnPC8nLCBuc1ByZWZpeCwgbmFtZSwgJz4nXS5qb2luKCcnKSk7XG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKTtcbn07XG5cblxuZnVuY3Rpb24gYXBwZW5kQ29sb24obnMpIHtcbiAgcmV0dXJuIChucyAmJiBucy5jaGFyQXQobnMubGVuZ3RoIC0gMSkgIT09ICc6JykgPyBucyArICc6JyA6IG5zO1xufVxuXG5mdW5jdGlvbiBub0NvbG9uTmFtZVNwYWNlKG5zKSB7XG4gIHJldHVybiAobnMgJiYgbnMuY2hhckF0KG5zLmxlbmd0aCAtIDEpID09PSAnOicpID8gbnMuc3Vic3RyaW5nKDAsIG5zLmxlbmd0aCAtIDEpIDogbnM7XG59XG5cbldTREwucHJvdG90eXBlLmlzSWdub3JlZE5hbWVTcGFjZSA9IGZ1bmN0aW9uIChucykge1xuICByZXR1cm4gdGhpcy5vcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzLmluZGV4T2YobnMpID4gLTE7XG59O1xuXG5XU0RMLnByb3RvdHlwZS5maWx0ZXJPdXRJZ25vcmVkTmFtZVNwYWNlID0gZnVuY3Rpb24gKG5zKSB7XG4gIGxldCBuYW1lc3BhY2UgPSBub0NvbG9uTmFtZVNwYWNlKG5zKTtcbiAgcmV0dXJuIHRoaXMuaXNJZ25vcmVkTmFtZVNwYWNlKG5hbWVzcGFjZSkgPyAnJyA6IG5hbWVzcGFjZTtcbn07XG5cblxuXG4vKipcbiAqIENvbnZlcnQgYW4gb2JqZWN0IHRvIFhNTC4gIFRoaXMgaXMgYSByZWN1cnNpdmUgbWV0aG9kIGFzIGl0IGNhbGxzIGl0c2VsZi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIHRoZSBvYmplY3QgdG8gY29udmVydC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIHRoZSBuYW1lIG9mIHRoZSBlbGVtZW50IChpZiB0aGUgb2JqZWN0IGJlaW5nIHRyYXZlcnNlZCBpc1xuICogYW4gZWxlbWVudCkuXG4gKiBAcGFyYW0ge1N0cmluZ30gbnNQcmVmaXggdGhlIG5hbWVzcGFjZSBwcmVmaXggb2YgdGhlIG9iamVjdCBJLkUuIHhzZC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBuc1VSSSB0aGUgZnVsbCBuYW1lc3BhY2Ugb2YgdGhlIG9iamVjdCBJLkUuIGh0dHA6Ly93My5vcmcvc2NoZW1hLlxuICogQHBhcmFtIHtCb29sZWFufSBpc0ZpcnN0IHdoZXRoZXIgb3Igbm90IHRoaXMgaXMgdGhlIGZpcnN0IGl0ZW0gYmVpbmcgdHJhdmVyc2VkLlxuICogQHBhcmFtIHs/fSB4bWxuc0F0dHJcbiAqIEBwYXJhbSB7P30gcGFyYW1ldGVyVHlwZU9iamVjdFxuICogQHBhcmFtIHtOYW1lc3BhY2VDb250ZXh0fSBuc0NvbnRleHQgTmFtZXNwYWNlIGNvbnRleHRcbiAqL1xuV1NETC5wcm90b3R5cGUub2JqZWN0VG9YTUwgPSBmdW5jdGlvbiAob2JqLCBuYW1lLCBuc1ByZWZpeCwgbnNVUkksIGlzRmlyc3QsIHhtbG5zQXR0ciwgc2NoZW1hT2JqZWN0LCBuc0NvbnRleHQpIHtcbiAgbGV0IHNlbGYgPSB0aGlzO1xuICBsZXQgc2NoZW1hID0gdGhpcy5kZWZpbml0aW9ucy5zY2hlbWFzW25zVVJJXTtcblxuICBsZXQgcGFyZW50TnNQcmVmaXggPSBuc1ByZWZpeCA/IG5zUHJlZml4LnBhcmVudCA6IHVuZGVmaW5lZDtcbiAgaWYgKHR5cGVvZiBwYXJlbnROc1ByZWZpeCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvL3dlIGdvdCB0aGUgcGFyZW50TnNQcmVmaXggZm9yIG91ciBhcnJheS4gc2V0dGluZyB0aGUgbmFtZXNwYWNlLWxldGlhYmxlIGJhY2sgdG8gdGhlIGN1cnJlbnQgbmFtZXNwYWNlIHN0cmluZ1xuICAgIG5zUHJlZml4ID0gbnNQcmVmaXguY3VycmVudDtcbiAgfVxuXG4gIHBhcmVudE5zUHJlZml4ID0gbm9Db2xvbk5hbWVTcGFjZShwYXJlbnROc1ByZWZpeCk7XG4gIGlmICh0aGlzLmlzSWdub3JlZE5hbWVTcGFjZShwYXJlbnROc1ByZWZpeCkpIHtcbiAgICBwYXJlbnROc1ByZWZpeCA9ICcnO1xuICB9XG5cbiAgbGV0IHNvYXBIZWFkZXIgPSAhc2NoZW1hO1xuICBsZXQgcXVhbGlmaWVkID0gc2NoZW1hICYmIHNjaGVtYS4kZWxlbWVudEZvcm1EZWZhdWx0ID09PSAncXVhbGlmaWVkJztcbiAgbGV0IHBhcnRzID0gW107XG4gIGxldCBwcmVmaXhOYW1lc3BhY2UgPSAobnNQcmVmaXggfHwgcXVhbGlmaWVkKSAmJiBuc1ByZWZpeCAhPT0gVE5TX1BSRUZJWDtcblxuICBsZXQgeG1sbnNBdHRyaWIgPSAnJztcbiAgaWYgKG5zVVJJICYmIGlzRmlyc3QpIHtcbiAgICBpZiAoc2VsZi5vcHRpb25zLm92ZXJyaWRlUm9vdEVsZW1lbnQgJiYgc2VsZi5vcHRpb25zLm92ZXJyaWRlUm9vdEVsZW1lbnQueG1sbnNBdHRyaWJ1dGVzKSB7XG4gICAgICBzZWxmLm9wdGlvbnMub3ZlcnJpZGVSb290RWxlbWVudC54bWxuc0F0dHJpYnV0ZXMuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgIHhtbG5zQXR0cmliICs9ICcgJyArIGF0dHJpYnV0ZS5uYW1lICsgJz1cIicgKyBhdHRyaWJ1dGUudmFsdWUgKyAnXCInO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChwcmVmaXhOYW1lc3BhY2UgJiYgIXRoaXMuaXNJZ25vcmVkTmFtZVNwYWNlKG5zUHJlZml4KSkge1xuICAgICAgICAvLyByZXNvbHZlIHRoZSBwcmVmaXggbmFtZXNwYWNlXG4gICAgICAgIHhtbG5zQXR0cmliICs9ICcgeG1sbnM6JyArIG5zUHJlZml4ICsgJz1cIicgKyBuc1VSSSArICdcIic7XG4gICAgICB9XG4gICAgICAvLyBvbmx5IGFkZCBkZWZhdWx0IG5hbWVzcGFjZSBpZiB0aGUgc2NoZW1hIGVsZW1lbnRGb3JtRGVmYXVsdCBpcyBxdWFsaWZpZWRcbiAgICAgIGlmIChxdWFsaWZpZWQgfHwgc29hcEhlYWRlcikgeG1sbnNBdHRyaWIgKz0gJyB4bWxucz1cIicgKyBuc1VSSSArICdcIic7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFuc0NvbnRleHQpIHtcbiAgICBuc0NvbnRleHQgPSBuZXcgTmFtZXNwYWNlQ29udGV4dCgpO1xuICAgIG5zQ29udGV4dC5kZWNsYXJlTmFtZXNwYWNlKG5zUHJlZml4LCBuc1VSSSk7XG4gIH0gZWxzZSB7XG4gICAgbnNDb250ZXh0LnB1c2hDb250ZXh0KCk7XG4gIH1cblxuICAvLyBleHBsaWNpdGx5IHVzZSB4bWxucyBhdHRyaWJ1dGUgaWYgYXZhaWxhYmxlXG4gIGlmICh4bWxuc0F0dHIgJiYgIShzZWxmLm9wdGlvbnMub3ZlcnJpZGVSb290RWxlbWVudCAmJiBzZWxmLm9wdGlvbnMub3ZlcnJpZGVSb290RWxlbWVudC54bWxuc0F0dHJpYnV0ZXMpKSB7XG4gICAgeG1sbnNBdHRyaWIgPSB4bWxuc0F0dHI7XG4gIH1cblxuICBsZXQgbnMgPSAnJztcblxuICBpZiAoc2VsZi5vcHRpb25zLm92ZXJyaWRlUm9vdEVsZW1lbnQgJiYgaXNGaXJzdCkge1xuICAgIG5zID0gc2VsZi5vcHRpb25zLm92ZXJyaWRlUm9vdEVsZW1lbnQubmFtZXNwYWNlO1xuICB9IGVsc2UgaWYgKHByZWZpeE5hbWVzcGFjZSAmJiAocXVhbGlmaWVkIHx8IGlzRmlyc3QgfHwgc29hcEhlYWRlcikgJiYgIXRoaXMuaXNJZ25vcmVkTmFtZVNwYWNlKG5zUHJlZml4KSkge1xuICAgIG5zID0gbnNQcmVmaXg7XG4gIH1cblxuICBsZXQgaSwgbjtcbiAgLy8gc3RhcnQgYnVpbGRpbmcgb3V0IFhNTCBzdHJpbmcuXG4gIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICBmb3IgKGkgPSAwLCBuID0gb2JqLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgbGV0IGl0ZW0gPSBvYmpbaV07XG4gICAgICBsZXQgYXJyYXlBdHRyID0gc2VsZi5wcm9jZXNzQXR0cmlidXRlcyhpdGVtLCBuc0NvbnRleHQpLFxuICAgICAgICBjb3JyZWN0T3V0ZXJOc1ByZWZpeCA9IHBhcmVudE5zUHJlZml4IHx8IG5zOyAvL3VzaW5nIHRoZSBwYXJlbnQgbmFtZXNwYWNlIHByZWZpeCBpZiBnaXZlblxuXG4gICAgICBsZXQgYm9keSA9IHNlbGYub2JqZWN0VG9YTUwoaXRlbSwgbmFtZSwgbnNQcmVmaXgsIG5zVVJJLCBmYWxzZSwgbnVsbCwgc2NoZW1hT2JqZWN0LCBuc0NvbnRleHQpO1xuXG4gICAgICBsZXQgb3BlbmluZ1RhZ1BhcnRzID0gWyc8JywgYXBwZW5kQ29sb24oY29ycmVjdE91dGVyTnNQcmVmaXgpLCBuYW1lLCBhcnJheUF0dHIsIHhtbG5zQXR0cmliXTtcblxuICAgICAgaWYgKGJvZHkgPT09ICcnICYmIHNlbGYub3B0aW9ucy51c2VFbXB0eVRhZykge1xuICAgICAgICAvLyBVc2UgZW1wdHkgKHNlbGYtY2xvc2luZykgdGFncyBpZiBubyBjb250ZW50c1xuICAgICAgICBvcGVuaW5nVGFnUGFydHMucHVzaCgnIC8+Jyk7XG4gICAgICAgIHBhcnRzLnB1c2gob3BlbmluZ1RhZ1BhcnRzLmpvaW4oJycpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wZW5pbmdUYWdQYXJ0cy5wdXNoKCc+Jyk7XG4gICAgICAgIGlmIChzZWxmLm9wdGlvbnMubmFtZXNwYWNlQXJyYXlFbGVtZW50cyB8fCBpID09PSAwKSB7XG4gICAgICAgICAgcGFydHMucHVzaChvcGVuaW5nVGFnUGFydHMuam9pbignJykpO1xuICAgICAgICB9XG4gICAgICAgIHBhcnRzLnB1c2goYm9keSk7XG4gICAgICAgIGlmIChzZWxmLm9wdGlvbnMubmFtZXNwYWNlQXJyYXlFbGVtZW50cyB8fCBpID09PSBuIC0gMSkge1xuICAgICAgICAgIHBhcnRzLnB1c2goWyc8LycsIGFwcGVuZENvbG9uKGNvcnJlY3RPdXRlck5zUHJlZml4KSwgbmFtZSwgJz4nXS5qb2luKCcnKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpIHtcbiAgICBmb3IgKG5hbWUgaW4gb2JqKSB7XG4gICAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShuYW1lKSkgY29udGludWU7XG4gICAgICAvL2Rvbid0IHByb2Nlc3MgYXR0cmlidXRlcyBhcyBlbGVtZW50XG4gICAgICBpZiAobmFtZSA9PT0gc2VsZi5vcHRpb25zLmF0dHJpYnV0ZXNLZXkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvL0l0cyB0aGUgdmFsdWUgb2YgYSB4bWwgb2JqZWN0LiBSZXR1cm4gaXQgZGlyZWN0bHkuXG4gICAgICBpZiAobmFtZSA9PT0gc2VsZi5vcHRpb25zLnhtbEtleSkge1xuICAgICAgICBuc0NvbnRleHQucG9wQ29udGV4dCgpO1xuICAgICAgICByZXR1cm4gb2JqW25hbWVdO1xuICAgICAgfVxuICAgICAgLy9JdHMgdGhlIHZhbHVlIG9mIGFuIGl0ZW0uIFJldHVybiBpdCBkaXJlY3RseS5cbiAgICAgIGlmIChuYW1lID09PSBzZWxmLm9wdGlvbnMudmFsdWVLZXkpIHtcbiAgICAgICAgbnNDb250ZXh0LnBvcENvbnRleHQoKTtcbiAgICAgICAgcmV0dXJuIHhtbEVzY2FwZShvYmpbbmFtZV0pO1xuICAgICAgfVxuXG4gICAgICBsZXQgY2hpbGQgPSBvYmpbbmFtZV07XG4gICAgICBpZiAodHlwZW9mIGNoaWxkID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgbGV0IGF0dHIgPSBzZWxmLnByb2Nlc3NBdHRyaWJ1dGVzKGNoaWxkLCBuc0NvbnRleHQpO1xuXG4gICAgICBsZXQgdmFsdWUgPSAnJztcbiAgICAgIGxldCBub25TdWJOYW1lU3BhY2UgPSAnJztcbiAgICAgIGxldCBlbXB0eU5vblN1Yk5hbWVTcGFjZSA9IGZhbHNlO1xuXG4gICAgICBsZXQgbmFtZVdpdGhOc1JlZ2V4ID0gL14oW146XSspOihbXjpdKykkLy5leGVjKG5hbWUpO1xuICAgICAgaWYgKG5hbWVXaXRoTnNSZWdleCkge1xuICAgICAgICBub25TdWJOYW1lU3BhY2UgPSBuYW1lV2l0aE5zUmVnZXhbMV0gKyAnOic7XG4gICAgICAgIG5hbWUgPSBuYW1lV2l0aE5zUmVnZXhbMl07XG4gICAgICB9IGVsc2UgaWYgKG5hbWVbMF0gPT09ICc6Jykge1xuICAgICAgICBlbXB0eU5vblN1Yk5hbWVTcGFjZSA9IHRydWU7XG4gICAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cigxKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzRmlyc3QpIHtcbiAgICAgICAgdmFsdWUgPSBzZWxmLm9iamVjdFRvWE1MKGNoaWxkLCBuYW1lLCBuc1ByZWZpeCwgbnNVUkksIGZhbHNlLCBudWxsLCBzY2hlbWFPYmplY3QsIG5zQ29udGV4dCk7XG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIGlmIChzZWxmLmRlZmluaXRpb25zLnNjaGVtYXMpIHtcbiAgICAgICAgICBpZiAoc2NoZW1hKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGRTY2hlbWFPYmplY3QgPSBzZWxmLmZpbmRDaGlsZFNjaGVtYU9iamVjdChzY2hlbWFPYmplY3QsIG5hbWUpO1xuICAgICAgICAgICAgLy9maW5kIHN1YiBuYW1lc3BhY2UgaWYgbm90IGEgcHJpbWl0aXZlXG4gICAgICAgICAgICBpZiAoY2hpbGRTY2hlbWFPYmplY3QgJiZcbiAgICAgICAgICAgICAgKChjaGlsZFNjaGVtYU9iamVjdC4kdHlwZSAmJiAoY2hpbGRTY2hlbWFPYmplY3QuJHR5cGUuaW5kZXhPZigneHNkOicpID09PSAtMSkpIHx8XG4gICAgICAgICAgICAgICAgY2hpbGRTY2hlbWFPYmplY3QuJHJlZiB8fCBjaGlsZFNjaGVtYU9iamVjdC4kbmFtZSkpIHtcbiAgICAgICAgICAgICAgLyppZiB0aGUgYmFzZSBuYW1lIHNwYWNlIG9mIHRoZSBjaGlsZHJlbiBpcyBub3QgaW4gdGhlIGluZ29yZWRTY2hlbWFOYW1zcGFjZXMgd2UgdXNlIGl0LlxuICAgICAgICAgICAgICAgVGhpcyBpcyBiZWNhdXNlIGluIHNvbWUgc2VydmljZXMgdGhlIGNoaWxkIG5vZGVzIGRvIG5vdCBuZWVkIHRoZSBiYXNlTmFtZVNwYWNlLlxuICAgICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgICBsZXQgY2hpbGROc1ByZWZpeDogYW55ID0gJyc7XG4gICAgICAgICAgICAgIGxldCBjaGlsZE5hbWUgPSAnJztcbiAgICAgICAgICAgICAgbGV0IGNoaWxkTnNVUkk7XG4gICAgICAgICAgICAgIGxldCBjaGlsZFhtbG5zQXR0cmliID0gJyc7XG5cbiAgICAgICAgICAgICAgbGV0IGVsZW1lbnRRTmFtZSA9IGNoaWxkU2NoZW1hT2JqZWN0LiRyZWYgfHwgY2hpbGRTY2hlbWFPYmplY3QuJG5hbWU7XG4gICAgICAgICAgICAgIGlmIChlbGVtZW50UU5hbWUpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50UU5hbWUgPSBzcGxpdFFOYW1lKGVsZW1lbnRRTmFtZSk7XG4gICAgICAgICAgICAgICAgY2hpbGROYW1lID0gZWxlbWVudFFOYW1lLm5hbWU7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnRRTmFtZS5wcmVmaXggPT09IFROU19QUkVGSVgpIHtcbiAgICAgICAgICAgICAgICAgIC8vIExvY2FsIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgIGNoaWxkTnNVUkkgPSBjaGlsZFNjaGVtYU9iamVjdC4kdGFyZ2V0TmFtZXNwYWNlO1xuICAgICAgICAgICAgICAgICAgY2hpbGROc1ByZWZpeCA9IG5zQ29udGV4dC5yZWdpc3Rlck5hbWVzcGFjZShjaGlsZE5zVVJJKTtcbiAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzSWdub3JlZE5hbWVTcGFjZShjaGlsZE5zUHJlZml4KSkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZE5zUHJlZml4ID0gbnNQcmVmaXg7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGNoaWxkTnNQcmVmaXggPSBlbGVtZW50UU5hbWUucHJlZml4O1xuICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNJZ25vcmVkTmFtZVNwYWNlKGNoaWxkTnNQcmVmaXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkTnNQcmVmaXggPSBuc1ByZWZpeDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNoaWxkTnNVUkkgPSBzY2hlbWEueG1sbnNbY2hpbGROc1ByZWZpeF0gfHwgc2VsZi5kZWZpbml0aW9ucy54bWxuc1tjaGlsZE5zUHJlZml4XTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgdW5xdWFsaWZpZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBxdWFsaWZpY2F0aW9uIGZvcm0gZm9yIGxvY2FsIGVsZW1lbnRzXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkU2NoZW1hT2JqZWN0LiRuYW1lICYmIGNoaWxkU2NoZW1hT2JqZWN0LnRhcmdldE5hbWVzcGFjZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoY2hpbGRTY2hlbWFPYmplY3QuJGZvcm0gPT09ICd1bnF1YWxpZmllZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdW5xdWFsaWZpZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjaGlsZFNjaGVtYU9iamVjdC4kZm9ybSA9PT0gJ3F1YWxpZmllZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdW5xdWFsaWZpZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHVucXVhbGlmaWVkID0gc2NoZW1hLiRlbGVtZW50Rm9ybURlZmF1bHQgIT09ICdxdWFsaWZpZWQnO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodW5xdWFsaWZpZWQpIHtcbiAgICAgICAgICAgICAgICAgIGNoaWxkTnNQcmVmaXggPSAnJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoY2hpbGROc1VSSSAmJiBjaGlsZE5zUHJlZml4KSB7XG4gICAgICAgICAgICAgICAgICBpZiAobnNDb250ZXh0LmRlY2xhcmVOYW1lc3BhY2UoY2hpbGROc1ByZWZpeCwgY2hpbGROc1VSSSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRYbWxuc0F0dHJpYiA9ICcgeG1sbnM6JyArIGNoaWxkTnNQcmVmaXggKyAnPVwiJyArIGNoaWxkTnNVUkkgKyAnXCInO1xuICAgICAgICAgICAgICAgICAgICB4bWxuc0F0dHJpYiArPSBjaGlsZFhtbG5zQXR0cmliO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGxldCByZXNvbHZlZENoaWxkU2NoZW1hT2JqZWN0O1xuICAgICAgICAgICAgICBpZiAoY2hpbGRTY2hlbWFPYmplY3QuJHR5cGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgdHlwZVFOYW1lID0gc3BsaXRRTmFtZShjaGlsZFNjaGVtYU9iamVjdC4kdHlwZSk7XG4gICAgICAgICAgICAgICAgbGV0IHR5cGVQcmVmaXggPSB0eXBlUU5hbWUucHJlZml4O1xuICAgICAgICAgICAgICAgIGxldCB0eXBlVVJJID0gc2NoZW1hLnhtbG5zW3R5cGVQcmVmaXhdIHx8IHNlbGYuZGVmaW5pdGlvbnMueG1sbnNbdHlwZVByZWZpeF07XG4gICAgICAgICAgICAgICAgY2hpbGROc1VSSSA9IHR5cGVVUkk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVVUkkgIT09ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYScgJiYgdHlwZVByZWZpeCAhPT0gVE5TX1BSRUZJWCkge1xuICAgICAgICAgICAgICAgICAgLy8gQWRkIHRoZSBwcmVmaXgvbmFtZXNwYWNlIG1hcHBpbmcsIGJ1dCBub3QgZGVjbGFyZSBpdFxuICAgICAgICAgICAgICAgICAgbnNDb250ZXh0LmFkZE5hbWVzcGFjZSh0eXBlUHJlZml4LCB0eXBlVVJJKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzb2x2ZWRDaGlsZFNjaGVtYU9iamVjdCA9XG4gICAgICAgICAgICAgICAgICBzZWxmLmZpbmRTY2hlbWFUeXBlKHR5cGVRTmFtZS5uYW1lLCB0eXBlVVJJKSB8fCBjaGlsZFNjaGVtYU9iamVjdDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlZENoaWxkU2NoZW1hT2JqZWN0ID1cbiAgICAgICAgICAgICAgICAgIHNlbGYuZmluZFNjaGVtYU9iamVjdChjaGlsZE5zVVJJLCBjaGlsZE5hbWUpIHx8IGNoaWxkU2NoZW1hT2JqZWN0O1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKGNoaWxkU2NoZW1hT2JqZWN0LiRiYXNlTmFtZVNwYWNlICYmIHRoaXMub3B0aW9ucy5pZ25vcmVCYXNlTmFtZVNwYWNlcykge1xuICAgICAgICAgICAgICAgIGNoaWxkTnNQcmVmaXggPSBuc1ByZWZpeDtcbiAgICAgICAgICAgICAgICBjaGlsZE5zVVJJID0gbnNVUkk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmlnbm9yZUJhc2VOYW1lU3BhY2VzKSB7XG4gICAgICAgICAgICAgICAgY2hpbGROc1ByZWZpeCA9ICcnO1xuICAgICAgICAgICAgICAgIGNoaWxkTnNVUkkgPSAnJztcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIG5zID0gY2hpbGROc1ByZWZpeDtcblxuICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZCkpIHtcbiAgICAgICAgICAgICAgICAvL2ZvciBhcnJheXMsIHdlIG5lZWQgdG8gcmVtZW1iZXIgdGhlIGN1cnJlbnQgbmFtZXNwYWNlXG4gICAgICAgICAgICAgICAgY2hpbGROc1ByZWZpeCA9IHtcbiAgICAgICAgICAgICAgICAgIGN1cnJlbnQ6IGNoaWxkTnNQcmVmaXgsXG4gICAgICAgICAgICAgICAgICBwYXJlbnQ6IG5zXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL3BhcmVudCAoYXJyYXkpIGFscmVhZHkgZ290IHRoZSBuYW1lc3BhY2VcbiAgICAgICAgICAgICAgICBjaGlsZFhtbG5zQXR0cmliID0gbnVsbDtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhbHVlID0gc2VsZi5vYmplY3RUb1hNTChjaGlsZCwgbmFtZSwgY2hpbGROc1ByZWZpeCwgY2hpbGROc1VSSSxcbiAgICAgICAgICAgICAgICBmYWxzZSwgY2hpbGRYbWxuc0F0dHJpYiwgcmVzb2x2ZWRDaGlsZFNjaGVtYU9iamVjdCwgbnNDb250ZXh0KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob2JqW3NlbGYub3B0aW9ucy5hdHRyaWJ1dGVzS2V5XSAmJiBvYmpbc2VsZi5vcHRpb25zLmF0dHJpYnV0ZXNLZXldLnhzaV90eXBlKSB7XG4gICAgICAgICAgICAgIC8vaWYgcGFyZW50IG9iamVjdCBoYXMgY29tcGxleCB0eXBlIGRlZmluZWQgYW5kIGNoaWxkIG5vdCBmb3VuZCBpbiBwYXJlbnRcbiAgICAgICAgICAgICAgbGV0IGNvbXBsZXRlQ2hpbGRQYXJhbVR5cGVPYmplY3QgPSBzZWxmLmZpbmRDaGlsZFNjaGVtYU9iamVjdChcbiAgICAgICAgICAgICAgICBvYmpbc2VsZi5vcHRpb25zLmF0dHJpYnV0ZXNLZXldLnhzaV90eXBlLnR5cGUsXG4gICAgICAgICAgICAgICAgb2JqW3NlbGYub3B0aW9ucy5hdHRyaWJ1dGVzS2V5XS54c2lfdHlwZS54bWxucyk7XG5cbiAgICAgICAgICAgICAgbm9uU3ViTmFtZVNwYWNlID0gb2JqW3NlbGYub3B0aW9ucy5hdHRyaWJ1dGVzS2V5XS54c2lfdHlwZS5wcmVmaXg7XG4gICAgICAgICAgICAgIG5zQ29udGV4dC5hZGROYW1lc3BhY2Uob2JqW3NlbGYub3B0aW9ucy5hdHRyaWJ1dGVzS2V5XS54c2lfdHlwZS5wcmVmaXgsXG4gICAgICAgICAgICAgICAgb2JqW3NlbGYub3B0aW9ucy5hdHRyaWJ1dGVzS2V5XS54c2lfdHlwZS54bWxucyk7XG4gICAgICAgICAgICAgIHZhbHVlID0gc2VsZi5vYmplY3RUb1hNTChjaGlsZCwgbmFtZSwgb2JqW3NlbGYub3B0aW9ucy5hdHRyaWJ1dGVzS2V5XS54c2lfdHlwZS5wcmVmaXgsXG4gICAgICAgICAgICAgICAgb2JqW3NlbGYub3B0aW9ucy5hdHRyaWJ1dGVzS2V5XS54c2lfdHlwZS54bWxucywgZmFsc2UsIG51bGwsIG51bGwsIG5zQ29udGV4dCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZCkpIHtcbiAgICAgICAgICAgICAgICBuYW1lID0gbm9uU3ViTmFtZVNwYWNlICsgbmFtZTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhbHVlID0gc2VsZi5vYmplY3RUb1hNTChjaGlsZCwgbmFtZSwgbnNQcmVmaXgsIG5zVVJJLCBmYWxzZSwgbnVsbCwgbnVsbCwgbnNDb250ZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSBzZWxmLm9iamVjdFRvWE1MKGNoaWxkLCBuYW1lLCBuc1ByZWZpeCwgbnNVUkksIGZhbHNlLCBudWxsLCBudWxsLCBuc0NvbnRleHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBucyA9IG5vQ29sb25OYW1lU3BhY2UobnMpO1xuICAgICAgaWYgKHByZWZpeE5hbWVzcGFjZSAmJiAhcXVhbGlmaWVkICYmIGlzRmlyc3QgJiYgIXNlbGYub3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50KSB7XG4gICAgICAgIG5zID0gbnNQcmVmaXg7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNJZ25vcmVkTmFtZVNwYWNlKG5zKSkge1xuICAgICAgICBucyA9ICcnO1xuICAgICAgfVxuXG4gICAgICBsZXQgdXNlRW1wdHlUYWcgPSAhdmFsdWUgJiYgc2VsZi5vcHRpb25zLnVzZUVtcHR5VGFnO1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGNoaWxkKSkge1xuICAgICAgICAvLyBzdGFydCB0YWdcbiAgICAgICAgcGFydHMucHVzaChbJzwnLCBlbXB0eU5vblN1Yk5hbWVTcGFjZSA/ICcnIDogYXBwZW5kQ29sb24obm9uU3ViTmFtZVNwYWNlIHx8IG5zKSwgbmFtZSwgYXR0ciwgeG1sbnNBdHRyaWIsXG4gICAgICAgICAgKGNoaWxkID09PSBudWxsID8gJyB4c2k6bmlsPVwidHJ1ZVwiJyA6ICcnKSxcbiAgICAgICAgICB1c2VFbXB0eVRhZyA/ICcgLz4nIDogJz4nXG4gICAgICAgIF0uam9pbignJykpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXVzZUVtcHR5VGFnKSB7XG4gICAgICAgIHBhcnRzLnB1c2godmFsdWUpO1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY2hpbGQpKSB7XG4gICAgICAgICAgLy8gZW5kIHRhZ1xuICAgICAgICAgIHBhcnRzLnB1c2goWyc8LycsIGVtcHR5Tm9uU3ViTmFtZVNwYWNlID8gJycgOiBhcHBlbmRDb2xvbihub25TdWJOYW1lU3BhY2UgfHwgbnMpLCBuYW1lLCAnPiddLmpvaW4oJycpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChvYmogIT09IHVuZGVmaW5lZCkge1xuICAgIHBhcnRzLnB1c2goKHNlbGYub3B0aW9ucy5lc2NhcGVYTUwpID8geG1sRXNjYXBlKG9iaikgOiBvYmopO1xuICB9XG4gIG5zQ29udGV4dC5wb3BDb250ZXh0KCk7XG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKTtcbn07XG5cbldTREwucHJvdG90eXBlLnByb2Nlc3NBdHRyaWJ1dGVzID0gZnVuY3Rpb24gKGNoaWxkLCBuc0NvbnRleHQpIHtcbiAgbGV0IGF0dHIgPSAnJztcblxuICBpZiAoY2hpbGQgPT09IG51bGwpIHtcbiAgICBjaGlsZCA9IFtdO1xuICB9XG5cbiAgbGV0IGF0dHJPYmogPSBjaGlsZFt0aGlzLm9wdGlvbnMuYXR0cmlidXRlc0tleV07XG4gIGlmIChhdHRyT2JqICYmIGF0dHJPYmoueHNpX3R5cGUpIHtcbiAgICBsZXQgeHNpVHlwZSA9IGF0dHJPYmoueHNpX3R5cGU7XG5cbiAgICBsZXQgcHJlZml4ID0geHNpVHlwZS5wcmVmaXggfHwgeHNpVHlwZS5uYW1lc3BhY2U7XG4gICAgLy8gR2VuZXJhdGUgYSBuZXcgbmFtZXNwYWNlIGZvciBjb21wbGV4IGV4dGVuc2lvbiBpZiBvbmUgbm90IHByb3ZpZGVkXG4gICAgaWYgKCFwcmVmaXgpIHtcbiAgICAgIHByZWZpeCA9IG5zQ29udGV4dC5yZWdpc3Rlck5hbWVzcGFjZSh4c2lUeXBlLnhtbG5zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbnNDb250ZXh0LmRlY2xhcmVOYW1lc3BhY2UocHJlZml4LCB4c2lUeXBlLnhtbG5zKTtcbiAgICB9XG4gICAgeHNpVHlwZS5wcmVmaXggPSBwcmVmaXg7XG4gIH1cblxuXG4gIGlmIChhdHRyT2JqKSB7XG4gICAgZm9yIChsZXQgYXR0cktleSBpbiBhdHRyT2JqKSB7XG4gICAgICAvL2hhbmRsZSBjb21wbGV4IGV4dGVuc2lvbiBzZXBhcmF0ZWx5XG4gICAgICBpZiAoYXR0cktleSA9PT0gJ3hzaV90eXBlJykge1xuICAgICAgICBsZXQgYXR0clZhbHVlID0gYXR0ck9ialthdHRyS2V5XTtcbiAgICAgICAgYXR0ciArPSAnIHhzaTp0eXBlPVwiJyArIGF0dHJWYWx1ZS5wcmVmaXggKyAnOicgKyBhdHRyVmFsdWUudHlwZSArICdcIic7XG4gICAgICAgIGF0dHIgKz0gJyB4bWxuczonICsgYXR0clZhbHVlLnByZWZpeCArICc9XCInICsgYXR0clZhbHVlLnhtbG5zICsgJ1wiJztcblxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF0dHIgKz0gJyAnICsgYXR0cktleSArICc9XCInICsgeG1sRXNjYXBlKGF0dHJPYmpbYXR0cktleV0pICsgJ1wiJztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gYXR0cjtcbn07XG5cbi8qKlxuICogTG9vayB1cCBhIHNjaGVtYSB0eXBlIGRlZmluaXRpb25cbiAqIEBwYXJhbSBuYW1lXG4gKiBAcGFyYW0gbnNVUklcbiAqIEByZXR1cm5zIHsqfVxuICovXG5XU0RMLnByb3RvdHlwZS5maW5kU2NoZW1hVHlwZSA9IGZ1bmN0aW9uIChuYW1lLCBuc1VSSSkge1xuICBpZiAoIXRoaXMuZGVmaW5pdGlvbnMuc2NoZW1hcyB8fCAhbmFtZSB8fCAhbnNVUkkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGxldCBzY2hlbWEgPSB0aGlzLmRlZmluaXRpb25zLnNjaGVtYXNbbnNVUkldO1xuICBpZiAoIXNjaGVtYSB8fCAhc2NoZW1hLmNvbXBsZXhUeXBlcykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHNjaGVtYS5jb21wbGV4VHlwZXNbbmFtZV07XG59O1xuXG5XU0RMLnByb3RvdHlwZS5maW5kQ2hpbGRTY2hlbWFPYmplY3QgPSBmdW5jdGlvbiAocGFyYW1ldGVyVHlwZU9iaiwgY2hpbGROYW1lLCBiYWNrdHJhY2UpIHtcbiAgaWYgKCFwYXJhbWV0ZXJUeXBlT2JqIHx8ICFjaGlsZE5hbWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICghYmFja3RyYWNlKSB7XG4gICAgYmFja3RyYWNlID0gW107XG4gIH1cblxuICBpZiAoYmFja3RyYWNlLmluZGV4T2YocGFyYW1ldGVyVHlwZU9iaikgPj0gMCkge1xuICAgIC8vIFdlJ3ZlIHJlY3Vyc2VkIGJhY2sgdG8gb3Vyc2VsdmVzOyBicmVhay5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICBiYWNrdHJhY2UgPSBiYWNrdHJhY2UuY29uY2F0KFtwYXJhbWV0ZXJUeXBlT2JqXSk7XG4gIH1cblxuICBsZXQgZm91bmQgPSBudWxsLFxuICAgIGkgPSAwLFxuICAgIGNoaWxkLFxuICAgIHJlZjtcblxuICBpZiAoQXJyYXkuaXNBcnJheShwYXJhbWV0ZXJUeXBlT2JqLiRsb29rdXBUeXBlcykgJiYgcGFyYW1ldGVyVHlwZU9iai4kbG9va3VwVHlwZXMubGVuZ3RoKSB7XG4gICAgbGV0IHR5cGVzID0gcGFyYW1ldGVyVHlwZU9iai4kbG9va3VwVHlwZXM7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgdHlwZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCB0eXBlT2JqID0gdHlwZXNbaV07XG5cbiAgICAgIGlmICh0eXBlT2JqLiRuYW1lID09PSBjaGlsZE5hbWUpIHtcbiAgICAgICAgZm91bmQgPSB0eXBlT2JqO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBsZXQgb2JqZWN0ID0gcGFyYW1ldGVyVHlwZU9iajtcbiAgaWYgKG9iamVjdC4kbmFtZSA9PT0gY2hpbGROYW1lICYmIG9iamVjdC5uYW1lID09PSAnZWxlbWVudCcpIHtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG4gIGlmIChvYmplY3QuJHJlZikge1xuICAgIHJlZiA9IHNwbGl0UU5hbWUob2JqZWN0LiRyZWYpO1xuICAgIGlmIChyZWYubmFtZSA9PT0gY2hpbGROYW1lKSB7XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cbiAgfVxuXG4gIGxldCBjaGlsZE5zVVJJO1xuXG4gIC8vIHdhbnQgdG8gYXZvaWQgdW5lY2Vzc2FyeSByZWN1cnNpb24gdG8gaW1wcm92ZSBwZXJmb3JtYW5jZVxuICBpZiAob2JqZWN0LiR0eXBlICYmIGJhY2t0cmFjZS5sZW5ndGggPT09IDEpIHtcbiAgICBsZXQgdHlwZUluZm8gPSBzcGxpdFFOYW1lKG9iamVjdC4kdHlwZSk7XG4gICAgaWYgKHR5cGVJbmZvLnByZWZpeCA9PT0gVE5TX1BSRUZJWCkge1xuICAgICAgY2hpbGROc1VSSSA9IHBhcmFtZXRlclR5cGVPYmouJHRhcmdldE5hbWVzcGFjZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2hpbGROc1VSSSA9IHRoaXMuZGVmaW5pdGlvbnMueG1sbnNbdHlwZUluZm8ucHJlZml4XTtcbiAgICB9XG4gICAgbGV0IHR5cGVEZWYgPSB0aGlzLmZpbmRTY2hlbWFUeXBlKHR5cGVJbmZvLm5hbWUsIGNoaWxkTnNVUkkpO1xuICAgIGlmICh0eXBlRGVmKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kQ2hpbGRTY2hlbWFPYmplY3QodHlwZURlZiwgY2hpbGROYW1lLCBiYWNrdHJhY2UpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChvYmplY3QuY2hpbGRyZW4pIHtcbiAgICBmb3IgKGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBvYmplY3QuY2hpbGRyZW5baV07IGkrKykge1xuICAgICAgZm91bmQgPSB0aGlzLmZpbmRDaGlsZFNjaGVtYU9iamVjdChjaGlsZCwgY2hpbGROYW1lLCBiYWNrdHJhY2UpO1xuICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hpbGQuJGJhc2UpIHtcbiAgICAgICAgbGV0IGJhc2VRTmFtZSA9IHNwbGl0UU5hbWUoY2hpbGQuJGJhc2UpO1xuICAgICAgICBsZXQgY2hpbGROYW1lU3BhY2UgPSBiYXNlUU5hbWUucHJlZml4ID09PSBUTlNfUFJFRklYID8gJycgOiBiYXNlUU5hbWUucHJlZml4O1xuICAgICAgICBjaGlsZE5zVVJJID0gY2hpbGQueG1sbnNbYmFzZVFOYW1lLnByZWZpeF0gfHwgdGhpcy5kZWZpbml0aW9ucy54bWxuc1tiYXNlUU5hbWUucHJlZml4XTtcblxuICAgICAgICBsZXQgZm91bmRCYXNlID0gdGhpcy5maW5kU2NoZW1hVHlwZShiYXNlUU5hbWUubmFtZSwgY2hpbGROc1VSSSk7XG5cbiAgICAgICAgaWYgKGZvdW5kQmFzZSkge1xuICAgICAgICAgIGZvdW5kID0gdGhpcy5maW5kQ2hpbGRTY2hlbWFPYmplY3QoZm91bmRCYXNlLCBjaGlsZE5hbWUsIGJhY2t0cmFjZSk7XG5cbiAgICAgICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgICAgIGZvdW5kLiRiYXNlTmFtZVNwYWNlID0gY2hpbGROYW1lU3BhY2U7XG4gICAgICAgICAgICBmb3VuZC4kdHlwZSA9IGNoaWxkTmFtZVNwYWNlICsgJzonICsgY2hpbGROYW1lO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gIH1cblxuICBpZiAoIWZvdW5kICYmIG9iamVjdC4kbmFtZSA9PT0gY2hpbGROYW1lKSB7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuXG4gIHJldHVybiBmb3VuZDtcbn07XG5cbldTREwucHJvdG90eXBlLl9wYXJzZSA9IGZ1bmN0aW9uICh4bWwpIHtcbiAgbGV0IHNlbGYgPSB0aGlzLFxuICAgIHAgPSBzYXgucGFyc2VyKHRydWUpLFxuICAgIHN0YWNrID0gW10sXG4gICAgcm9vdCA9IG51bGwsXG4gICAgdHlwZXMgPSBudWxsLFxuICAgIHNjaGVtYSA9IG51bGwsXG4gICAgb3B0aW9ucyA9IHNlbGYub3B0aW9ucztcblxuICBwLm9ub3BlbnRhZyA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgbGV0IG5zTmFtZSA9IG5vZGUubmFtZTtcbiAgICBsZXQgYXR0cnMgPSBub2RlLmF0dHJpYnV0ZXM7XG5cbiAgICBsZXQgdG9wID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgbGV0IG5hbWU7XG4gICAgaWYgKHRvcCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdG9wLnN0YXJ0RWxlbWVudChzdGFjaywgbnNOYW1lLCBhdHRycywgb3B0aW9ucyk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChzZWxmLm9wdGlvbnMuc3RyaWN0KSB7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdGFjay5wdXNoKG5ldyBFbGVtZW50KG5zTmFtZSwgYXR0cnMsIG9wdGlvbnMpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gc3BsaXRRTmFtZShuc05hbWUpLm5hbWU7XG4gICAgICBpZiAobmFtZSA9PT0gJ2RlZmluaXRpb25zJykge1xuICAgICAgICByb290ID0gbmV3IERlZmluaXRpb25zRWxlbWVudChuc05hbWUsIGF0dHJzLCBvcHRpb25zKTtcbiAgICAgICAgc3RhY2sucHVzaChyb290KTtcbiAgICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gJ3NjaGVtYScpIHtcbiAgICAgICAgLy8gU2hpbSBhIHN0cnVjdHVyZSBpbiBoZXJlIHRvIGFsbG93IHRoZSBwcm9wZXIgb2JqZWN0cyB0byBiZSBjcmVhdGVkIHdoZW4gbWVyZ2luZyBiYWNrLlxuICAgICAgICByb290ID0gbmV3IERlZmluaXRpb25zRWxlbWVudCgnZGVmaW5pdGlvbnMnLCB7fSwge30pO1xuICAgICAgICB0eXBlcyA9IG5ldyBUeXBlc0VsZW1lbnQoJ3R5cGVzJywge30sIHt9KTtcbiAgICAgICAgc2NoZW1hID0gbmV3IFNjaGVtYUVsZW1lbnQobnNOYW1lLCBhdHRycywgb3B0aW9ucyk7XG4gICAgICAgIHR5cGVzLmFkZENoaWxkKHNjaGVtYSk7XG4gICAgICAgIHJvb3QuYWRkQ2hpbGQodHlwZXMpO1xuICAgICAgICBzdGFjay5wdXNoKHNjaGVtYSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuZXhwZWN0ZWQgcm9vdCBlbGVtZW50IG9mIFdTREwgb3IgaW5jbHVkZScpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBwLm9uY2xvc2V0YWcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIGxldCB0b3AgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICBhc3NlcnQodG9wLCAnVW5tYXRjaGVkIGNsb3NlIHRhZzogJyArIG5hbWUpO1xuXG4gICAgdG9wLmVuZEVsZW1lbnQoc3RhY2ssIG5hbWUpO1xuICB9O1xuXG4gIHAud3JpdGUoeG1sKS5jbG9zZSgpO1xuXG4gIHJldHVybiByb290O1xufTtcblxuV1NETC5wcm90b3R5cGUuX2Zyb21YTUwgPSBmdW5jdGlvbiAoeG1sKSB7XG4gIHRoaXMuZGVmaW5pdGlvbnMgPSB0aGlzLl9wYXJzZSh4bWwpO1xuICB0aGlzLmRlZmluaXRpb25zLmRlc2NyaXB0aW9ucyA9IHtcbiAgICB0eXBlczoge31cbiAgfTtcbiAgdGhpcy54bWwgPSB4bWw7XG59O1xuXG5XU0RMLnByb3RvdHlwZS5fZnJvbVNlcnZpY2VzID0gZnVuY3Rpb24gKHNlcnZpY2VzKSB7XG5cbn07XG5cblxuXG5XU0RMLnByb3RvdHlwZS5feG1sbnNNYXAgPSBmdW5jdGlvbiAoKSB7XG4gIGxldCB4bWxucyA9IHRoaXMuZGVmaW5pdGlvbnMueG1sbnM7XG4gIGxldCBzdHIgPSAnJztcbiAgZm9yIChsZXQgYWxpYXMgaW4geG1sbnMpIHtcbiAgICBpZiAoYWxpYXMgPT09ICcnIHx8IGFsaWFzID09PSBUTlNfUFJFRklYKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgbGV0IG5zID0geG1sbnNbYWxpYXNdO1xuICAgIHN3aXRjaCAobnMpIHtcbiAgICAgIGNhc2UgXCJodHRwOi8veG1sLmFwYWNoZS5vcmcveG1sLXNvYXBcIjogLy8gYXBhY2hlc29hcFxuICAgICAgY2FzZSBcImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzZGwvXCI6IC8vIHdzZGxcbiAgICAgIGNhc2UgXCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93c2RsL3NvYXAvXCI6IC8vIHdzZGxzb2FwXG4gICAgICBjYXNlIFwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3NkbC9zb2FwMTIvXCI6IC8vIHdzZGxzb2FwMTJcbiAgICAgIGNhc2UgXCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy9zb2FwL2VuY29kaW5nL1wiOiAvLyBzb2FwZW5jXG4gICAgICBjYXNlIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWFcIjogLy8geHNkXG4gICAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAofm5zLmluZGV4T2YoJ2h0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnLycpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKH5ucy5pbmRleE9mKCdodHRwOi8vd3d3LnczLm9yZy8nKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmICh+bnMuaW5kZXhPZignaHR0cDovL3htbC5hcGFjaGUub3JnLycpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgc3RyICs9ICcgeG1sbnM6JyArIGFsaWFzICsgJz1cIicgKyBucyArICdcIic7XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cbi8qXG4gKiBIYXZlIGFub3RoZXIgZnVuY3Rpb24gdG8gbG9hZCBwcmV2aW91cyBXU0RMcyBhcyB3ZVxuICogZG9uJ3Qgd2FudCB0aGlzIHRvIGJlIGludm9rZWQgZXh0ZXJuYWxseSAoZXhwZWN0IGZvciB0ZXN0cylcbiAqIFRoaXMgd2lsbCBhdHRlbXB0IHRvIGZpeCBjaXJjdWxhciBkZXBlbmRlbmNpZXMgd2l0aCBYU0QgZmlsZXMsXG4gKiBHaXZlblxuICogLSBmaWxlLndzZGxcbiAqICAgLSB4czppbXBvcnQgbmFtZXNwYWNlPVwiQVwiIHNjaGVtYUxvY2F0aW9uOiBBLnhzZFxuICogLSBBLnhzZFxuICogICAtIHhzOmltcG9ydCBuYW1lc3BhY2U9XCJCXCIgc2NoZW1hTG9jYXRpb246IEIueHNkXG4gKiAtIEIueHNkXG4gKiAgIC0geHM6aW1wb3J0IG5hbWVzcGFjZT1cIkFcIiBzY2hlbWFMb2NhdGlvbjogQS54c2RcbiAqIGZpbGUud3NkbCB3aWxsIHN0YXJ0IGxvYWRpbmcsIGltcG9ydCBBLCB0aGVuIEEgd2lsbCBpbXBvcnQgQiwgd2hpY2ggd2lsbCB0aGVuIGltcG9ydCBBXG4gKiBCZWNhdXNlIEEgaGFzIGFscmVhZHkgc3RhcnRlZCB0byBsb2FkIHByZXZpb3VzbHkgaXQgd2lsbCBiZSByZXR1cm5lZCByaWdodCBhd2F5IGFuZFxuICogaGF2ZSBhbiBpbnRlcm5hbCBjaXJjdWxhciByZWZlcmVuY2VcbiAqIEIgd291bGQgdGhlbiBjb21wbGV0ZSBsb2FkaW5nLCB0aGVuIEEsIHRoZW4gZmlsZS53c2RsXG4gKiBCeSB0aGUgdGltZSBmaWxlIEEgc3RhcnRzIHByb2Nlc3NpbmcgaXRzIGluY2x1ZGVzIGl0cyBkZWZpbml0aW9ucyB3aWxsIGJlIGFscmVhZHkgbG9hZGVkLFxuICogdGhpcyBpcyB0aGUgb25seSB0aGluZyB0aGF0IEIgd2lsbCBkZXBlbmQgb24gd2hlbiBcIm9wZW5pbmdcIiBBXG4gKi9cbmZ1bmN0aW9uIG9wZW5fd3NkbF9yZWN1cnNpdmUodXJpLCBvcHRpb25zKTogUHJvbWlzZTxhbnk+IHtcbiAgbGV0IGZyb21DYWNoZSxcbiAgICBXU0RMX0NBQ0hFO1xuXG4gIC8vIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyAgIGNhbGxiYWNrID0gb3B0aW9ucztcbiAgLy8gICBvcHRpb25zID0ge307XG4gIC8vIH1cblxuICBXU0RMX0NBQ0hFID0gb3B0aW9ucy5XU0RMX0NBQ0hFO1xuXG4gIGlmIChmcm9tQ2FjaGUgPSBXU0RMX0NBQ0hFW3VyaV0pIHtcbiAgICAvLyByZXR1cm4gY2FsbGJhY2suY2FsbChmcm9tQ2FjaGUsIG51bGwsIGZyb21DYWNoZSk7XG4gICAgcmV0dXJuIGZyb21DYWNoZTtcbiAgfVxuXG4gIHJldHVybiBvcGVuX3dzZGwodXJpLCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG9wZW5fd3NkbCh1cmksIG9wdGlvbnMpOiBQcm9taXNlPGFueT4ge1xuICAvLyBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gICBjYWxsYmFjayA9IG9wdGlvbnM7XG4gIC8vICAgb3B0aW9ucyA9IHt9O1xuICAvLyB9XG5cbiAgLy8gaW5pdGlhbGl6ZSBjYWNoZSB3aGVuIGNhbGxpbmcgb3Blbl93c2RsIGRpcmVjdGx5XG4gIGxldCBXU0RMX0NBQ0hFID0gb3B0aW9ucy5XU0RMX0NBQ0hFIHx8IHt9O1xuICBsZXQgcmVxdWVzdF9oZWFkZXJzID0gb3B0aW9ucy53c2RsX2hlYWRlcnM7XG4gIGxldCByZXF1ZXN0X29wdGlvbnMgPSBvcHRpb25zLndzZGxfb3B0aW9ucztcblxuICAvLyBsZXQgd3NkbDtcbiAgLy8gaWYgKCEvXmh0dHBzPzovLnRlc3QodXJpKSkge1xuICAvLyAgIC8vIGRlYnVnKCdSZWFkaW5nIGZpbGU6ICVzJywgdXJpKTtcbiAgLy8gICAvLyBmcy5yZWFkRmlsZSh1cmksICd1dGY4JywgZnVuY3Rpb24oZXJyLCBkZWZpbml0aW9uKSB7XG4gIC8vICAgLy8gICBpZiAoZXJyKSB7XG4gIC8vICAgLy8gICAgIGNhbGxiYWNrKGVycik7XG4gIC8vICAgLy8gICB9XG4gIC8vICAgLy8gICBlbHNlIHtcbiAgLy8gICAvLyAgICAgd3NkbCA9IG5ldyBXU0RMKGRlZmluaXRpb24sIHVyaSwgb3B0aW9ucyk7XG4gIC8vICAgLy8gICAgIFdTRExfQ0FDSEVbIHVyaSBdID0gd3NkbDtcbiAgLy8gICAvLyAgICAgd3NkbC5XU0RMX0NBQ0hFID0gV1NETF9DQUNIRTtcbiAgLy8gICAvLyAgICAgd3NkbC5vblJlYWR5KGNhbGxiYWNrKTtcbiAgLy8gICAvLyAgIH1cbiAgLy8gICAvLyB9KTtcbiAgLy8gfVxuICAvLyBlbHNlIHtcbiAgLy8gICBkZWJ1ZygnUmVhZGluZyB1cmw6ICVzJywgdXJpKTtcbiAgLy8gICBsZXQgaHR0cENsaWVudCA9IG9wdGlvbnMuaHR0cENsaWVudCB8fCBuZXcgSHR0cENsaWVudChvcHRpb25zKTtcbiAgLy8gICBodHRwQ2xpZW50LnJlcXVlc3QodXJpLCBudWxsIC8qIG9wdGlvbnMgKi8sIGZ1bmN0aW9uKGVyciwgcmVzcG9uc2UsIGRlZmluaXRpb24pIHtcbiAgLy8gICAgIGlmIChlcnIpIHtcbiAgLy8gICAgICAgY2FsbGJhY2soZXJyKTtcbiAgLy8gICAgIH0gZWxzZSBpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9PT0gMjAwKSB7XG4gIC8vICAgICAgIHdzZGwgPSBuZXcgV1NETChkZWZpbml0aW9uLCB1cmksIG9wdGlvbnMpO1xuICAvLyAgICAgICBXU0RMX0NBQ0hFWyB1cmkgXSA9IHdzZGw7XG4gIC8vICAgICAgIHdzZGwuV1NETF9DQUNIRSA9IFdTRExfQ0FDSEU7XG4gIC8vICAgICAgIHdzZGwub25SZWFkeShjYWxsYmFjayk7XG4gIC8vICAgICB9IGVsc2Uge1xuICAvLyAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoJ0ludmFsaWQgV1NETCBVUkw6ICcgKyB1cmkgKyBcIlxcblxcblxcciBDb2RlOiBcIiArIHJlc3BvbnNlLnN0YXR1c0NvZGUgKyBcIlxcblxcblxcciBSZXNwb25zZSBCb2R5OiBcIiArIHJlc3BvbnNlLmJvZHkpKTtcbiAgLy8gICAgIH1cbiAgLy8gICB9LCByZXF1ZXN0X2hlYWRlcnMsIHJlcXVlc3Rfb3B0aW9ucyk7XG4gIC8vIH1cbiAgLy8gcmV0dXJuIHdzZGw7XG5cbiAgY29uc29sZS5sb2coJ1JlYWRpbmcgdXJsOiAlcycsIHVyaSk7XG4gIGNvbnN0IGh0dHBDbGllbnQ6IEh0dHBDbGllbnQgPSBvcHRpb25zLmh0dHBDbGllbnQ7XG4gIGNvbnN0IHdzZGxEZWYgPSBhd2FpdCBodHRwQ2xpZW50LmdldCh1cmksIHsgcmVzcG9uc2VUeXBlOiAndGV4dCcgfSkudG9Qcm9taXNlKCk7XG4gIGNvbnN0IHdzZGxPYmogPSBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGNvbnN0IHdzZGwgPSBuZXcgV1NETCh3c2RsRGVmLCB1cmksIG9wdGlvbnMpO1xuICAgIFdTRExfQ0FDSEVbdXJpXSA9IHdzZGw7XG4gICAgd3NkbC5XU0RMX0NBQ0hFID0gV1NETF9DQUNIRTtcbiAgICB3c2RsLm9uUmVhZHkocmVzb2x2ZSh3c2RsKSk7XG4gIH0pO1xuICAvL2NvbnNvbGUubG9nKFwid3NkbFwiLCB3c2RsT2JqKVxuICByZXR1cm4gd3NkbE9iajtcbn1cbiJdfQ==