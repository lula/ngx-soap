/*
 * Copyright (c) 2011 Vinay Pulim <vinay@milewise.com>
 * MIT Licensed
 *
 */
/*jshint proto:true*/
"use strict";
import { __awaiter, __generator } from "tslib";
import * as sax from 'sax';
import { NamespaceContext } from './nscontext';
import * as url from 'url';
import { ok as assert } from 'assert';
// import stripBom from 'strip-bom';
var stripBom = function (x) {
    // Catches EFBBBF (UTF-8 BOM) because the buffer-to-string
    // conversion translates it to FEFF (UTF-16 BOM)
    if (x.charCodeAt(0) === 0xFEFF) {
        return x.slice(1);
    }
    return x;
};
import * as _ from 'lodash';
import * as utils from './utils';
var TNS_PREFIX = utils.TNS_PREFIX;
var findPrefix = utils.findPrefix;
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
function splitQName(nsName) {
    var i = typeof nsName === 'string' ? nsName.indexOf(':') : -1;
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
var trimLeft = /^[\s\xA0]+/;
var trimRight = /[\s\xA0]+$/;
function trim(text) {
    return text.replace(trimLeft, '').replace(trimRight, '');
}
function deepMerge(destination, source) {
    return _.mergeWith(destination || {}, source, function (a, b) {
        return _.isArray(a) ? a.concat(b) : undefined;
    });
}
var Element = function (nsName, attrs, options) {
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
    var ChildClass = this.allowedChildren[splitQName(nsName).name], element = null;
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
        var parent_1 = stack[stack.length - 2];
        if (this !== stack[0]) {
            _.defaultsDeep(stack[0].xmlns, this.xmlns);
            // delete this.xmlns;
            parent_1.children.push(this);
            parent_1.addChild(this);
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
    var root = this;
    var subElement = function () {
        root.apply(this, arguments);
        this.init();
    };
    // inherits(subElement, root);
    subElement.prototype.__proto__ = root.prototype;
    return subElement;
};
var ElementElement = Element.createSubClass();
var AnyElement = Element.createSubClass();
var InputElement = Element.createSubClass();
var OutputElement = Element.createSubClass();
var SimpleTypeElement = Element.createSubClass();
var RestrictionElement = Element.createSubClass();
var ExtensionElement = Element.createSubClass();
var ChoiceElement = Element.createSubClass();
var EnumerationElement = Element.createSubClass();
var ComplexTypeElement = Element.createSubClass();
var ComplexContentElement = Element.createSubClass();
var SimpleContentElement = Element.createSubClass();
var SequenceElement = Element.createSubClass();
var AllElement = Element.createSubClass();
var MessageElement = Element.createSubClass();
var DocumentationElement = Element.createSubClass();
var SchemaElement = Element.createSubClass();
var TypesElement = Element.createSubClass();
var OperationElement = Element.createSubClass();
var PortTypeElement = Element.createSubClass();
var BindingElement = Element.createSubClass();
var PortElement = Element.createSubClass();
var ServiceElement = Element.createSubClass();
var DefinitionsElement = Element.createSubClass();
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
function mapElementTypes(types) {
    var rtn = {};
    types = types.split(' ');
    types.forEach(function (type) {
        rtn[type.replace(/^_/, '')] = (ElementTypeMap[type] || [Element])[0];
    });
    return rtn;
}
for (var n in ElementTypeMap) {
    var v = ElementTypeMap[n];
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
        var location_1 = child.$schemaLocation || child.$location;
        if (location_1) {
            this.includes.push({
                namespace: child.$namespace || child.$targetNamespace || this.$targetNamespace,
                location: location_1
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
    var targetNamespace = child.$targetNamespace;
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
    var self = this;
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
    var part = null;
    var child = undefined;
    var children = this.children || [];
    var ns = undefined;
    var nsName = undefined;
    var i = undefined;
    var type = undefined;
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
        var lookupTypes = [], elementChildren = void 0;
        delete this.parts;
        nsName = splitQName(part.$element);
        ns = nsName.prefix;
        var schema = definitions.schemas[definitions.xmlns[ns]];
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
            assert(part.name === 'part', 'Expected part element');
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
    var splittedNSString = splitQName(nsString), nsAlias = splittedNSString.prefix, splittedName = splittedNSString.name.split('#'), type = splittedName[0], name = splittedName[1], lookupTypeObj = {};
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
    var resolvedType = '^', excluded = this.ignoredNamespaces.concat('xs'); // do not process $type values wich start with
    if (element.hasOwnProperty('$type') && typeof element.$type === 'string') {
        if (excluded.indexOf(element.$type.split(':')[0]) === -1) {
            resolvedType += ('_' + element.$type + '#' + element.$name);
        }
    }
    if (element.children.length > 0) {
        var self_1 = this;
        element.children.forEach(function (child) {
            var resolvedChildType = self_1._getNestedLookupTypeString(child).replace(/\^_/, '');
            if (resolvedChildType && typeof resolvedChildType === 'string') {
                resolvedType += ('_' + resolvedChildType);
            }
        });
    }
    return resolvedType;
};
OperationElement.prototype.postProcess = function (definitions, tag) {
    var children = this.children;
    for (var i = 0, child = void 0; child = children[i]; i++) {
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
PortTypeElement.prototype.postProcess = function (definitions) {
    var children = this.children;
    if (typeof children === 'undefined')
        return;
    for (var i = 0, child = void 0; child = children[i]; i++) {
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
    var type = splitQName(this.$type).name, portType = definitions.portTypes[type], style = this.style, children = this.children;
    if (portType) {
        portType.postProcess(definitions);
        this.methods = portType.methods;
        for (var i = 0, child = void 0; child = children[i]; i++) {
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
ServiceElement.prototype.postProcess = function (definitions) {
    var children = this.children, bindings = definitions.bindings;
    if (children && children.length > 0) {
        for (var i = 0, child = void 0; child = children[i]; i++) {
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
SimpleTypeElement.prototype.description = function (definitions) {
    var children = this.children;
    for (var i = 0, child = void 0; child = children[i]; i++) {
        if (child instanceof RestrictionElement)
            return this.$name + "|" + child.description();
    }
    return {};
};
RestrictionElement.prototype.description = function (definitions, xmlns) {
    var children = this.children;
    var desc;
    for (var i = 0, child = void 0; child = children[i]; i++) {
        if (child instanceof SequenceElement ||
            child instanceof ChoiceElement) {
            desc = child.description(definitions, xmlns);
            break;
        }
    }
    if (desc && this.$base) {
        var type = splitQName(this.$base), typeName = type.name, ns = xmlns && xmlns[type.prefix] || definitions.xmlns[type.prefix], schema_1 = definitions.schemas[ns], typeElement_1 = schema_1 && (schema_1.complexTypes[typeName] || schema_1.types[typeName] || schema_1.elements[typeName]);
        desc.getBase = function () {
            return typeElement_1.description(definitions, schema_1.xmlns);
        };
        return desc;
    }
    // then simple element
    var base = this.$base ? this.$base + "|" : "";
    return base + this.children.map(function (child) {
        return child.description();
    }).join(",");
};
ExtensionElement.prototype.description = function (definitions, xmlns) {
    var children = this.children;
    var desc = {};
    for (var i = 0, child = void 0; child = children[i]; i++) {
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
EnumerationElement.prototype.description = function () {
    return this[this.valueKey];
};
ComplexTypeElement.prototype.description = function (definitions, xmlns) {
    var children = this.children || [];
    for (var i = 0, child = void 0; child = children[i]; i++) {
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
    var children = this.children;
    for (var i = 0, child = void 0; child = children[i]; i++) {
        if (child instanceof ExtensionElement) {
            return child.description(definitions, xmlns);
        }
    }
    return {};
};
SimpleContentElement.prototype.description = function (definitions, xmlns) {
    var children = this.children;
    for (var i = 0, child = void 0; child = children[i]; i++) {
        if (child instanceof ExtensionElement) {
            return child.description(definitions, xmlns);
        }
    }
    return {};
};
ElementElement.prototype.description = function (definitions, xmlns) {
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
                var elem_1 = {};
                definitions.descriptions.types[typeName] = elem_1;
                var description_1 = typeElement.description(definitions, xmlns);
                if (typeof description_1 === 'string') {
                    elem_1 = description_1;
                }
                else {
                    Object.keys(description_1).forEach(function (key) {
                        elem_1[key] = description_1[key];
                    });
                }
                if (this.$ref) {
                    element = elem_1;
                }
                else {
                    element[name] = elem_1;
                }
                if (typeof elem_1 === 'object') {
                    elem_1.targetNSAlias = type.prefix;
                    elem_1.targetNamespace = ns;
                }
                definitions.descriptions.types[typeName] = elem_1;
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
        for (var i = 0, child = void 0; child = children[i]; i++) {
            if (child instanceof ComplexTypeElement) {
                element[name] = child.description(definitions, xmlns);
            }
        }
    }
    return element;
};
AllElement.prototype.description =
    SequenceElement.prototype.description = function (definitions, xmlns) {
        var children = this.children;
        var sequence = {};
        for (var i = 0, child = void 0; child = children[i]; i++) {
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
ChoiceElement.prototype.description = function (definitions, xmlns) {
    var children = this.children;
    var choice = {};
    for (var i = 0, child = void 0; child = children[i]; i++) {
        var description = child.description(definitions, xmlns);
        for (var key in description) {
            choice[key] = description[key];
        }
    }
    return choice;
};
MessageElement.prototype.description = function (definitions) {
    if (this.element) {
        return this.element && this.element.description(definitions);
    }
    var desc = {};
    desc[this.$name] = this.parts;
    return desc;
};
PortTypeElement.prototype.description = function (definitions) {
    var methods = {};
    for (var name_1 in this.methods) {
        var method = this.methods[name_1];
        methods[name_1] = method.description(definitions);
    }
    return methods;
};
OperationElement.prototype.description = function (definitions) {
    var inputDesc = this.input ? this.input.description(definitions) : null;
    var outputDesc = this.output ? this.output.description(definitions) : null;
    return {
        input: inputDesc && inputDesc[Object.keys(inputDesc)[0]],
        output: outputDesc && outputDesc[Object.keys(outputDesc)[0]]
    };
};
BindingElement.prototype.description = function (definitions) {
    var methods = {};
    for (var name_2 in this.methods) {
        var method = this.methods[name_2];
        methods[name_2] = method.description(definitions);
    }
    return methods;
};
ServiceElement.prototype.description = function (definitions) {
    var ports = {};
    for (var name_3 in this.ports) {
        var port = this.ports[name_3];
        ports[name_3] = port.binding.description(definitions);
    }
    return ports;
};
export var WSDL = function (definition, uri, options) {
    var self = this, fromFunc;
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
    Promise.resolve(true).then(function () {
        try {
            fromFunc.call(self, definition);
        }
        catch (e) {
            return self.callback(e.message);
        }
        self.processIncludes().then(function () {
            self.definitions.deleteFixedAttrs();
            var services = self.services = self.definitions.services;
            if (services) {
                for (var name_4 in services) {
                    services[name_4].postProcess(self.definitions);
                }
            }
            var complexTypes = self.definitions.complexTypes;
            if (complexTypes) {
                for (var name_5 in complexTypes) {
                    complexTypes[name_5].deleteFixedAttrs();
                }
            }
            // for document style, for every binding, prepare input message element name to (methodName, output message element name) mapping
            var bindings = self.definitions.bindings;
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
            // prepare soap envelope xmlns definition string
            self.xmlnsInEnvelope = self._xmlnsMap();
            self.callback(null, self);
        }).catch(function (err) { return self.callback(err); });
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
    this.options.useEmptyTag = !!options.useEmptyTag;
};
WSDL.prototype.onReady = function (callback) {
    if (callback)
        this.callback = callback;
};
WSDL.prototype._processNextInclude = function (includes) {
    return __awaiter(this, void 0, void 0, function () {
        var self, include, options, includePath, wsdl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    self = this, include = includes.shift();
                    if (!include)
                        return [2 /*return*/]; // callback();
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
                    return [4 /*yield*/, open_wsdl_recursive(includePath, options)];
                case 1:
                    wsdl = _a.sent();
                    self._includesWsdl.push(wsdl);
                    if (wsdl.definitions instanceof DefinitionsElement) {
                        _.mergeWith(self.definitions, wsdl.definitions, function (a, b) {
                            return (a instanceof SchemaElement) ? a.merge(b) : undefined;
                        });
                    }
                    else {
                        self.definitions.schemas[include.namespace || wsdl.definitions.$targetNamespace] = deepMerge(self.definitions.schemas[include.namespace || wsdl.definitions.$targetNamespace], wsdl.definitions);
                    }
                    return [2 /*return*/, self._processNextInclude(includes)];
            }
        });
    });
};
WSDL.prototype.processIncludes = function () {
    return __awaiter(this, void 0, void 0, function () {
        var schemas, includes, ns, schema;
        return __generator(this, function (_a) {
            schemas = this.definitions.schemas, includes = [];
            for (ns in schemas) {
                schema = schemas[ns];
                includes = includes.concat(schema.includes || []);
            }
            return [2 /*return*/, this._processNextInclude(includes)];
        });
    });
};
WSDL.prototype.describeServices = function () {
    var services = {};
    for (var name_6 in this.services) {
        var service = this.services[name_6];
        services[name_6] = service.description(this.definitions);
    }
    return services;
};
WSDL.prototype.toXML = function () {
    return this.xml || '';
};
WSDL.prototype.xmlToObject = function (xml, callback) {
    var self = this;
    var p = typeof callback === 'function' ? {} : sax.parser(true);
    var objectName = null;
    var root = {};
    var schema = {};
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
                try {
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
            var res = splitQName(attributeName);
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
        var xsiTypeSchema;
        var xsiType = elementAttributes['xsi:type'];
        if (xsiType) {
            var type = splitQName(xsiType);
            var typeURI = void 0;
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
        stack.push({
            name: originalName,
            object: obj,
            schema: (xsiTypeSchema || (topSchema && topSchema[name])),
            id: attrs.id,
            nil: hasNilAttribute
        });
    };
    p.onclosetag = function (nsName) {
        var cur = stack.pop(), obj = cur.object, top = stack[stack.length - 1], topObject = top.object, topSchema = top.schema, name = splitQName(nsName).name;
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
        var originalText = text;
        text = trim(text);
        if (!text.length) {
            return;
        }
        if (/<\?xml[\s\S]+\?>/.test(text)) {
            var top_1 = stack[stack.length - 1];
            var value = self.xmlToObject(text);
            if (top_1.object[self.options.attributesKey]) {
                top_1.object[self.options.valueKey] = value;
            }
            else {
                top_1.object = value;
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
        var originalText = text;
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
        var saxStream = sax.createStream(true);
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
            var error = void 0;
            if (body && body.Fault) {
                if (!body.Fault.Code) {
                    var code = body.Fault.faultcode && body.Fault.faultcode.$value;
                    var string = body.Fault.faultstring && body.Fault.faultstring.$value;
                    var detail = body.Fault.detail && body.Fault.detail.$value;
                    code = code || body.Fault.faultcode;
                    string = string || body.Fault.faultstring;
                    detail = detail || body.Fault.detail;
                    error = new Error(code + ': ' + string + (detail ? ': ' + detail : ''));
                }
                else {
                    var code = body.Fault.Code.Value;
                    var string = body.Fault.Reason.Text.$value;
                    var detail = body.Fault.Detail.info;
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
    var args = {};
    args[name] = params;
    var parameterTypeObj = type ? this.findSchemaObject(nsURI, type) : null;
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
            var attributes = [];
            if (typeof value === 'object' && value.hasOwnProperty(this.options.attributesKey)) {
                var attrs = value[this.options.attributesKey];
                for (var n in attrs) {
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
    var namespace = noColonNameSpace(ns);
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
    var self = this;
    var schema = this.definitions.schemas[nsURI];
    var parentNsPrefix = nsPrefix ? nsPrefix.parent : undefined;
    if (typeof parentNsPrefix !== 'undefined') {
        //we got the parentNsPrefix for our array. setting the namespace-letiable back to the current namespace string
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
            var body = self.objectToXML(item, name, nsPrefix, nsURI, false, null, schemaObject, nsContext);
            var openingTagParts = ['<', appendColon(correctOuterNsPrefix), name, arrayAttr, xmlnsAttrib];
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
                            var childNsURI = void 0;
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
                            var resolvedChildSchemaObject = void 0;
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
            var useEmptyTag = !value && self.options.useEmptyTag;
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
    var schema = this.definitions.schemas[nsURI];
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
    // want to avoid unecessary recursion to improve performance
    if (object.$type && backtrace.length === 1) {
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
                childNsURI = child.xmlns[baseQName.prefix] || this.definitions.xmlns[baseQName.prefix];
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
WSDL.prototype._parse = function (xml) {
    var self = this, p = sax.parser(true), stack = [], root = null, types = null, schema = null, options = self.options;
    p.onopentag = function (node) {
        var nsName = node.name;
        var attrs = node.attributes;
        var top = stack[stack.length - 1];
        var name;
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
        var top = stack[stack.length - 1];
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
    var fromCache, WSDL_CACHE;
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
    return __awaiter(this, void 0, void 0, function () {
        var WSDL_CACHE, request_headers, request_options, httpClient, wsdlDef, wsdlObj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    WSDL_CACHE = options.WSDL_CACHE || {};
                    request_headers = options.wsdl_headers;
                    request_options = options.wsdl_options;
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
                    httpClient = options.httpClient;
                    return [4 /*yield*/, httpClient.get(uri, { responseType: 'text' }).toPromise()];
                case 1:
                    wsdlDef = _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var wsdl = new WSDL(wsdlDef, uri, options);
                            WSDL_CACHE[uri] = wsdl;
                            wsdl.WSDL_CACHE = WSDL_CACHE;
                            wsdl.onReady(resolve(wsdl));
                        })];
                case 2:
                    wsdlObj = _a.sent();
                    //console.log("wsdl", wsdlObj)
                    return [2 /*return*/, wsdlObj];
            }
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3NkbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb2FwLyIsInNvdXJjZXMiOlsibGliL3NvYXAvd3NkbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztHQUlHO0FBQ0gscUJBQXFCO0FBRXJCLFlBQVksQ0FBQzs7QUFFYixPQUFPLEtBQUssR0FBRyxNQUFNLEtBQUssQ0FBQztBQUUzQixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTyxhQUFhLENBQUM7QUFFaEQsT0FBTyxLQUFLLEdBQUcsTUFBTSxLQUFLLENBQUM7QUFDM0IsT0FBTyxFQUFFLEVBQUUsSUFBSSxNQUFNLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDdEMsb0NBQW9DO0FBRXBDLElBQU0sUUFBUSxHQUFHLFVBQUMsQ0FBUztJQUN6QiwwREFBMEQ7SUFDMUQsZ0RBQWdEO0lBQ2hELElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxNQUFNLEVBQUU7UUFDOUIsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ25CO0lBRUQsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDLENBQUE7QUFFRCxPQUFPLEtBQUssQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEtBQUssS0FBSyxNQUFNLFNBQVMsQ0FBQztBQUdqQyxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO0FBQ2xDLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7QUFFbEMsSUFBSSxVQUFVLEdBQUc7SUFDZixNQUFNLEVBQUUsQ0FBQztJQUNULE9BQU8sRUFBRSxDQUFDO0lBQ1YsT0FBTyxFQUFFLENBQUM7SUFDVixLQUFLLEVBQUUsQ0FBQztJQUNSLE1BQU0sRUFBRSxDQUFDO0lBQ1QsT0FBTyxFQUFFLENBQUM7SUFDVixJQUFJLEVBQUUsQ0FBQztJQUNQLEdBQUcsRUFBRSxDQUFDO0lBQ04sSUFBSSxFQUFFLENBQUM7SUFDUCxLQUFLLEVB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QyxpQkFBaUIsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDOUIsVUFBVSxHQUFlLE9BQU8sQ0FBQyxVQUFVLENBQUM7b0JBQ2xDLHFCQUFNLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUE7O29CQUF6RSxPQUFPLEdBQUcsU0FBK0Q7b0JBQy9ELHFCQUFNLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTzs0QkFDeEMsSUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQzs0QkFDN0MsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQzs0QkFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7NEJBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQzlCLENBQUMsQ0FBQyxFQUFBOztvQkFMSSxPQUFPLEdBQUcsU0FLZDtvQkFDRiw4QkFBOEI7b0JBQzlCLHNCQUFPLE9BQU8sRUFBQzs7OztDQUNoQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTEgVmluYXkgUHVsaW0gPHZpbmF5QG1pbGV3aXNlLmNvbT5cbiAqIE1JVCBMaWNlbnNlZFxuICpcbiAqL1xuLypqc2hpbnQgcHJvdG86dHJ1ZSovXG5cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgKiBhcyBzYXggZnJvbSAnc2F4JztcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBOYW1lc3BhY2VDb250ZXh0IH0gwqBmcm9tICcuL25zY29udGV4dCc7XG5cbmltcG9ydCAqIGFzIHVybCBmcm9tICd1cmwnO1xuaW1wb3J0IHsgb2sgYXMgYXNzZXJ0IH0gZnJvbSAnYXNzZXJ0Jztcbi8vIGltcG9ydCBzdHJpcEJvbSBmcm9tICdzdHJpcC1ib20nO1xuXG5jb25zdCBzdHJpcEJvbSA9ICh4OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAvLyBDYXRjaGVzIEVGQkJCRiAoVVRGLTggQk9NKSBiZWNhdXNlIHRoZSBidWZmZXItdG8tc3RyaW5nXG4gIC8vIGNvbnZlcnNpb24gdHJhbnNsYXRlcyBpdCB0byBGRUZGIChVVEYtMTYgQk9NKVxuICBpZiAoeC5jaGFyQ29kZUF0KDApID09PSAweEZFRkYpIHtcbiAgICByZXR1cm4geC5zbGljZSgxKTtcbiAgfVxuXG4gIHJldHVybiB4O1xufVxuXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuL3V0aWxzJztcblxuXG5sZXQgVE5TX1BSRUZJWCA9IHV0aWxzLlROU19QUkVGSVg7XG5sZXQgZmluZFByZWZpeCA9IHV0aWxzLmZpbmRQcmVmaXg7XG5cbmxldCBQcmltaXRpdmVzID0ge1xuICBzdHJpbmc6IDEsXG4gIGJvb2xlYW46IDEsXG4gIGRlY2ltYWw6IDEsXG4gIGZsb2F0OiAxLFxuICBkb3VibGU6IDEsXG4gIGFueVR5cGU6IDEsXG4gIGJ5dGU6IDEsXG4gIGludDogMSxcbiAgbG9uZzogMSxcbiAgc2hvcnQ6IDEsXG4gIG5lZ2F0aXZlSW50ZWdlcjogMSxcbiAgbm9uTmVnYXRpdmVJbnRlZ2VyOiAxLFxuICBwb3NpdGl2ZUludGVnZXI6IDEsXG4gIG5vblBvc2l0aXZlSW50ZWdlcjogMSxcbiAgdW5zaWduZWRCeXRlOiAxLFxuICB1bnNpZ25lZEludDogMSxcbiAgdW5zaWduZWRMb25nOiAxLFxuICB1bnNpZ25lZFNob3J0OiAxLFxuICBkdXJhdGlvbjogMCxcbiAgZGF0ZVRpbWU6IDAsXG4gIHRpbWU6IDAsXG4gIGRhdGU6IDAsXG4gIGdZZWFyTW9udGg6IDAsXG4gIGdZZWFyOiAwLFxuICBnTW9udGhEYXk6IDAsXG4gIGdEYXk6IDAsXG4gIGdNb250aDogMCxcbiAgaGV4QmluYXJ5OiAwLFxuICBiYXNlNjRCaW5hcnk6IDAsXG4gIGFueVVSSTogMCxcbiAgUU5hbWU6IDAsXG4gIE5PVEFUSU9OOiAwXG59O1xuXG5mdW5jdGlvbiBzcGxpdFFOYW1lKG5zTmFtZSkge1xuICBsZXQgaSA9IHR5cGVvZiBuc05hbWUgPT09ICdzdHJpbmcnID8gbnNOYW1lLmluZGV4T2YoJzonKSA6IC0xO1xuICByZXR1cm4gaSA8IDAgPyB7IHByZWZpeDogVE5TX1BSRUZJWCwgbmFtZTogbnNOYW1lIH0gOlxuICAgIHsgcHJlZml4OiBuc05hbWUuc3Vic3RyaW5nKDAsIGkpLCBuYW1lOiBuc05hbWUuc3Vic3RyaW5nKGkgKyAxKSB9O1xufVxuXG5mdW5jdGlvbiB4bWxFc2NhcGUob2JqKSB7XG4gIGlmICh0eXBlb2YgKG9iaikgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKG9iai5zdWJzdHIoMCwgOSkgPT09ICc8IVtDREFUQVsnICYmIG9iai5zdWJzdHIoLTMpID09PSBcIl1dPlwiKSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICByZXR1cm4gb2JqXG4gICAgICAucmVwbGFjZSgvJi9nLCAnJmFtcDsnKVxuICAgICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKVxuICAgICAgLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKVxuICAgICAgLnJlcGxhY2UoLycvZywgJyZhcG9zOycpO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxubGV0IHRyaW1MZWZ0ID0gL15bXFxzXFx4QTBdKy87XG5sZXQgdHJpbVJpZ2h0ID0gL1tcXHNcXHhBMF0rJC87XG5cbmZ1bmN0aW9uIHRyaW0odGV4dCkge1xuICByZXR1cm4gdGV4dC5yZXBsYWNlKHRyaW1MZWZ0LCAnJykucmVwbGFjZSh0cmltUmlnaHQsICcnKTtcbn1cblxuZnVuY3Rpb24gZGVlcE1lcmdlKGRlc3RpbmF0aW9uLCBzb3VyY2UpIHtcbiAgcmV0dXJuIF8ubWVyZ2VXaXRoKGRlc3RpbmF0aW9uIHx8IHt9LCBzb3VyY2UsIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIF8uaXNBcnJheShhKSA/IGEuY29uY2F0KGIpIDogdW5kZWZpbmVkO1xuICB9KTtcbn1cblxubGV0IEVsZW1lbnQ6IGFueSA9IGZ1bmN0aW9uIChuc05hbWUsIGF0dHJzLCBvcHRpb25zKSB7XG4gIGxldCBwYXJ0cyA9IHNwbGl0UU5hbWUobnNOYW1lKTtcblxuICB0aGlzLm5zTmFtZSA9IG5zTmFtZTtcbiAgdGhpcy5wcmVmaXggPSBwYXJ0cy5wcmVmaXg7XG4gIHRoaXMubmFtZSA9IHBhcnRzLm5hbWU7XG4gIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgdGhpcy54bWxucyA9IHt9O1xuXG4gIHRoaXMuX2luaXRpYWxpemVPcHRpb25zKG9wdGlvbnMpO1xuXG4gIGZvciAobGV0IGtleSBpbiBhdHRycykge1xuICAgIGxldCBtYXRjaCA9IC9eeG1sbnM6PyguKikkLy5leGVjKGtleSk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICB0aGlzLnhtbG5zW21hdGNoWzFdID8gbWF0Y2hbMV0gOiBUTlNfUFJFRklYXSA9IGF0dHJzW2tleV07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYgKGtleSA9PT0gJ3ZhbHVlJykge1xuICAgICAgICB0aGlzW3RoaXMudmFsdWVLZXldID0gYXR0cnNba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNbJyQnICsga2V5XSA9IGF0dHJzW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmICh0aGlzLiR0YXJnZXROYW1lc3BhY2UgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIEFkZCB0YXJnZXROYW1lc3BhY2UgdG8gdGhlIG1hcHBpbmdcbiAgICB0aGlzLnhtbG5zW1ROU19QUkVGSVhdID0gdGhpcy4kdGFyZ2V0TmFtZXNwYWNlO1xuICB9XG59O1xuXG5FbGVtZW50LnByb3RvdHlwZS5faW5pdGlhbGl6ZU9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICBpZiAob3B0aW9ucykge1xuICAgIHRoaXMudmFsdWVLZXkgPSBvcHRpb25zLnZhbHVlS2V5IHx8ICckdmFsdWUnO1xuICAgIHRoaXMueG1sS2V5ID0gb3B0aW9ucy54bWxLZXkgfHwgJyR4bWwnO1xuICAgIHRoaXMuaWdub3JlZE5hbWVzcGFjZXMgPSBvcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzIHx8IFtdO1xuICB9IGVsc2Uge1xuICAgIHRoaXMudmFsdWVLZXkgPSAnJHZhbHVlJztcbiAgICB0aGlzLnhtbEtleSA9ICckeG1sJztcbiAgICB0aGlzLmlnbm9yZWROYW1lc3BhY2VzID0gW107XG4gIH1cbn07XG5cbkVsZW1lbnQucHJvdG90eXBlLmRlbGV0ZUZpeGVkQXR0cnMgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuY2hpbGRyZW4gJiYgdGhpcy5jaGlsZHJlbi5sZW5ndGggPT09IDAgJiYgZGVsZXRlIHRoaXMuY2hpbGRyZW47XG4gIHRoaXMueG1sbnMgJiYgT2JqZWN0LmtleXModGhpcy54bWxucykubGVuZ3RoID09PSAwICYmIGRlbGV0ZSB0aGlzLnhtbG5zO1xuICBkZWxldGUgdGhpcy5uc05hbWU7XG4gIGRlbGV0ZSB0aGlzLnByZWZpeDtcbiAgZGVsZXRlIHRoaXMubmFtZTtcbn07XG5cbkVsZW1lbnQucHJvdG90eXBlLmFsbG93ZWRDaGlsZHJlbiA9IFtdO1xuXG5FbGVtZW50LnByb3RvdHlwZS5zdGFydEVsZW1lbnQgPSBmdW5jdGlvbiAoc3RhY2ssIG5zTmFtZSwgYXR0cnMsIG9wdGlvbnMpIHtcbiAgaWYgKCF0aGlzLmFsbG93ZWRDaGlsZHJlbikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCBDaGlsZENsYXNzID0gdGhpcy5hbGxvd2VkQ2hpbGRyZW5bc3BsaXRRTmFtZShuc05hbWUpLm5hbWVdLFxuICAgIGVsZW1lbnQgPSBudWxsO1xuXG4gIGlmIChDaGlsZENsYXNzKSB7XG4gICAgc3RhY2sucHVzaChuZXcgQ2hpbGRDbGFzcyhuc05hbWUsIGF0dHJzLCBvcHRpb25zKSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdGhpcy51bmV4cGVjdGVkKG5zTmFtZSk7XG4gIH1cblxufTtcblxuRWxlbWVudC5wcm90b3R5cGUuZW5kRWxlbWVudCA9IGZ1bmN0aW9uIChzdGFjaywgbnNOYW1lKSB7XG4gIGlmICh0aGlzLm5zTmFtZSA9PT0gbnNOYW1lKSB7XG4gICAgaWYgKHN0YWNrLmxlbmd0aCA8IDIpXG4gICAgICByZXR1cm47XG4gICAgbGV0IHBhcmVudCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDJdO1xuICAgIGlmICh0aGlzICE9PSBzdGFja1swXSkge1xuICAgICAgXy5kZWZhdWx0c0RlZXAoc3RhY2tbMF0ueG1sbnMsIHRoaXMueG1sbnMpO1xuICAgICAgLy8gZGVsZXRlIHRoaXMueG1sbnM7XG4gICAgICBwYXJlbnQuY2hpbGRyZW4ucHVzaCh0aGlzKTtcbiAgICAgIHBhcmVudC5hZGRDaGlsZCh0aGlzKTtcbiAgICB9XG4gICAgc3RhY2sucG9wKCk7XG4gIH1cbn07XG5cbkVsZW1lbnQucHJvdG90eXBlLmFkZENoaWxkID0gZnVuY3Rpb24gKGNoaWxkKSB7XG4gIHJldHVybjtcbn07XG5cbkVsZW1lbnQucHJvdG90eXBlLnVuZXhwZWN0ZWQgPSBmdW5jdGlvbiAobmFtZSkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ0ZvdW5kIHVuZXhwZWN0ZWQgZWxlbWVudCAoJyArIG5hbWUgKyAnKSBpbnNpZGUgJyArIHRoaXMubnNOYW1lKTtcbn07XG5cbkVsZW1lbnQucHJvdG90eXBlLmRlc2NyaXB0aW9uID0gZnVuY3Rpb24gKGRlZmluaXRpb25zKSB7XG4gIHJldHVybiB0aGlzLiRuYW1lIHx8IHRoaXMubmFtZTtcbn07XG5cbkVsZW1lbnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG59O1xuXG5FbGVtZW50LmNyZWF0ZVN1YkNsYXNzID0gZnVuY3Rpb24gKCkge1xuICBsZXQgcm9vdCA9IHRoaXM7XG4gIGxldCBzdWJFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHJvb3QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfTtcbiAgLy8gaW5oZXJpdHMoc3ViRWxlbWVudCwgcm9vdCk7XG4gIHN1YkVsZW1lbnQucHJvdG90eXBlLl9fcHJvdG9fXyA9IHJvb3QucHJvdG90eXBlO1xuICByZXR1cm4gc3ViRWxlbWVudDtcbn07XG5cblxubGV0IEVsZW1lbnRFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IEFueUVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XG5sZXQgSW5wdXRFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IE91dHB1dEVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XG5sZXQgU2ltcGxlVHlwZUVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XG5sZXQgUmVzdHJpY3Rpb25FbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IEV4dGVuc2lvbkVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XG5sZXQgQ2hvaWNlRWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcbmxldCBFbnVtZXJhdGlvbkVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XG5sZXQgQ29tcGxleFR5cGVFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IENvbXBsZXhDb250ZW50RWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcbmxldCBTaW1wbGVDb250ZW50RWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcbmxldCBTZXF1ZW5jZUVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XG5sZXQgQWxsRWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcbmxldCBNZXNzYWdlRWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcbmxldCBEb2N1bWVudGF0aW9uRWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcblxubGV0IFNjaGVtYUVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XG5sZXQgVHlwZXNFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IE9wZXJhdGlvbkVsZW1lbnQgPSBFbGVtZW50LmNyZWF0ZVN1YkNsYXNzKCk7XG5sZXQgUG9ydFR5cGVFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IEJpbmRpbmdFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IFBvcnRFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IFNlcnZpY2VFbGVtZW50ID0gRWxlbWVudC5jcmVhdGVTdWJDbGFzcygpO1xubGV0IERlZmluaXRpb25zRWxlbWVudCA9IEVsZW1lbnQuY3JlYXRlU3ViQ2xhc3MoKTtcblxubGV0IEVsZW1lbnRUeXBlTWFwID0ge1xuICB0eXBlczogW1R5cGVzRWxlbWVudCwgJ3NjaGVtYSBkb2N1bWVudGF0aW9uJ10sXG4gIHNjaGVtYTogW1NjaGVtYUVsZW1lbnQsICdlbGVtZW50IGNvbXBsZXhUeXBlIHNpbXBsZVR5cGUgaW5jbHVkZSBpbXBvcnQnXSxcbiAgZWxlbWVudDogW0VsZW1lbnRFbGVtZW50LCAnYW5ub3RhdGlvbiBjb21wbGV4VHlwZSddLFxuICBhbnk6IFtBbnlFbGVtZW50LCAnJ10sXG4gIHNpbXBsZVR5cGU6IFtTaW1wbGVUeXBlRWxlbWVudCwgJ3Jlc3RyaWN0aW9uJ10sXG4gIHJlc3RyaWN0aW9uOiBbUmVzdHJpY3Rpb25FbGVtZW50LCAnZW51bWVyYXRpb24gYWxsIGNob2ljZSBzZXF1ZW5jZSddLFxuICBleHRlbnNpb246IFtFeHRlbnNpb25FbGVtZW50LCAnYWxsIHNlcXVlbmNlIGNob2ljZSddLFxuICBjaG9pY2U6IFtDaG9pY2VFbGVtZW50LCAnZWxlbWVudCBzZXF1ZW5jZSBjaG9pY2UgYW55J10sXG4gIC8vIGdyb3VwOiBbR3JvdXBFbGVtZW50LCAnZWxlbWVudCBncm91cCddLFxuICBlbnVtZXJhdGlvbjogW0VudW1lcmF0aW9uRWxlbWVudCwgJyddLFxuICBjb21wbGV4VHlwZTogW0NvbXBsZXhUeXBlRWxlbWVudCwgJ2Fubm90YXRpb24gc2VxdWVuY2UgYWxsIGNvbXBsZXhDb250ZW50IHNpbXBsZUNvbnRlbnQgY2hvaWNlJ10sXG4gIGNvbXBsZXhDb250ZW50OiBbQ29tcGxleENvbnRlbnRFbGVtZW50LCAnZXh0ZW5zaW9uJ10sXG4gIHNpbXBsZUNvbnRlbnQ6IFtTaW1wbGVDb250ZW50RWxlbWVudCwgJ2V4dGVuc2lvbiddLFxuICBzZXF1ZW5jZTogW1NlcXVlbmNlRWxlbWVudCwgJ2VsZW1lbnQgc2VxdWVuY2UgY2hvaWNlIGFueSddLFxuICBhbGw6IFtBbGxFbGVtZW50LCAnZWxlbWVudCBjaG9pY2UnXSxcblxuICBzZXJ2aWNlOiBbU2VydmljZUVsZW1lbnQsICdwb3J0IGRvY3VtZW50YXRpb24nXSxcbiAgcG9ydDogW1BvcnRFbGVtZW50LCAnYWRkcmVzcyBkb2N1bWVudGF0aW9uJ10sXG4gIGJpbmRpbmc6IFtCaW5kaW5nRWxlbWVudCwgJ19iaW5kaW5nIFNlY3VyaXR5U3BlYyBvcGVyYXRpb24gZG9jdW1lbnRhdGlvbiddLFxuICBwb3J0VHlwZTogW1BvcnRUeXBlRWxlbWVudCwgJ29wZXJhdGlvbiBkb2N1bWVudGF0aW9uJ10sXG4gIG1lc3NhZ2U6IFtNZXNzYWdlRWxlbWVudCwgJ3BhcnQgZG9jdW1lbnRhdGlvbiddLFxuICBvcGVyYXRpb246IFtPcGVyYXRpb25FbGVtZW50LCAnZG9jdW1lbnRhdGlvbiBpbnB1dCBvdXRwdXQgZmF1bHQgX29wZXJhdGlvbiddLFxuICBpbnB1dDogW0lucHV0RWxlbWVudCwgJ2JvZHkgU2VjdXJpdHlTcGVjUmVmIGRvY3VtZW50YXRpb24gaGVhZGVyJ10sXG4gIG91dHB1dDogW091dHB1dEVsZW1lbnQsICdib2R5IFNlY3VyaXR5U3BlY1JlZiBkb2N1bWVudGF0aW9uIGhlYWRlciddLFxuICBmYXVsdDogW0VsZW1lbnQsICdfZmF1bHQgZG9jdW1lbnRhdGlvbiddLFxuICBkZWZpbml0aW9uczogW0RlZmluaXRpb25zRWxlbWVudCwgJ3R5cGVzIG1lc3NhZ2UgcG9ydFR5cGUgYmluZGluZyBzZXJ2aWNlIGltcG9ydCBkb2N1bWVudGF0aW9uJ10sXG4gIGRvY3VtZW50YXRpb246IFtEb2N1bWVudGF0aW9uRWxlbWVudCwgJyddXG59O1xuXG5mdW5jdGlvbiBtYXBFbGVtZW50VHlwZXModHlwZXMpIHtcbiAgbGV0IHJ0biA9IHt9O1xuICB0eXBlcyA9IHR5cGVzLnNwbGl0KCcgJyk7XG4gIHR5cGVzLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcbiAgICBydG5bdHlwZS5yZXBsYWNlKC9eXy8sICcnKV0gPSAoRWxlbWVudFR5cGVNYXBbdHlwZV0gfHwgW0VsZW1lbnRdKVswXTtcbiAgfSk7XG4gIHJldHVybiBydG47XG59XG5cbmZvciAobGV0IG4gaW4gRWxlbWVudFR5cGVNYXApIHtcbiAgbGV0IHYgPSBFbGVtZW50VHlwZU1hcFtuXTtcbiAgdlswXS5wcm90b3R5cGUuYWxsb3dlZENoaWxkcmVuID0gbWFwRWxlbWVudFR5cGVzKHZbMV0pO1xufVxuXG5NZXNzYWdlRWxlbWVudC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5lbGVtZW50ID0gbnVsbDtcbiAgdGhpcy5wYXJ0cyA9IG51bGw7XG59O1xuXG5TY2hlbWFFbGVtZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmNvbXBsZXhUeXBlcyA9IHt9O1xuICB0aGlzLnR5cGVzID0ge307XG4gIHRoaXMuZWxlbWVudHMgPSB7fTtcbiAgdGhpcy5pbmNsdWRlcyA9IFtdO1xufTtcblxuVHlwZXNFbGVtZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLnNjaGVtYXMgPSB7fTtcbn07XG5cbk9wZXJhdGlvbkVsZW1lbnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuaW5wdXQgPSBudWxsO1xuICB0aGlzLm91dHB1dCA9IG51bGw7XG4gIHRoaXMuaW5wdXRTb2FwID0gbnVsbDtcbiAgdGhpcy5vdXRwdXRTb2FwID0gbnVsbDtcbiAgdGhpcy5zdHlsZSA9ICcnO1xuICB0aGlzLnNvYXBBY3Rpb24gPSAnJztcbn07XG5cblBvcnRUeXBlRWxlbWVudC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5tZXRob2RzID0ge307XG59O1xuXG5CaW5kaW5nRWxlbWVudC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy50cmFuc3BvcnQgPSAnJztcbiAgdGhpcy5zdHlsZSA9ICcnO1xuICB0aGlzLm1ldGhvZHMgPSB7fTtcbn07XG5cblBvcnRFbGVtZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmxvY2F0aW9uID0gbnVsbDtcbn07XG5cblNlcnZpY2VFbGVtZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLnBvcnRzID0ge307XG59O1xuXG5EZWZpbml0aW9uc0VsZW1lbnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLm5hbWUgIT09ICdkZWZpbml0aW9ucycpIHRoaXMudW5leHBlY3RlZCh0aGlzLm5zTmFtZSk7XG4gIHRoaXMubWVzc2FnZXMgPSB7fTtcbiAgdGhpcy5wb3J0VHlwZXMgPSB7fTtcbiAgdGhpcy5iaW5kaW5ncyA9IHt9O1xuICB0aGlzLnNlcnZpY2VzID0ge307XG4gIHRoaXMuc2NoZW1hcyA9IHt9O1xufTtcblxuRG9jdW1lbnRhdGlvbkVsZW1lbnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG59O1xuXG5TY2hlbWFFbGVtZW50LnByb3RvdHlwZS5tZXJnZSA9IGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgYXNzZXJ0KHNvdXJjZSBpbnN0YW5jZW9mIFNjaGVtYUVsZW1lbnQpO1xuICBpZiAodGhpcy4kdGFyZ2V0TmFtZXNwYWNlID09PSBzb3VyY2UuJHRhcmdldE5hbWVzcGFjZSkge1xuICAgIF8ubWVyZ2UodGhpcy5jb21wbGV4VHlwZXMsIHNvdXJjZS5jb21wbGV4VHlwZXMpO1xuICAgIF8ubWVyZ2UodGhpcy50eXBlcywgc291cmNlLnR5cGVzKTtcbiAgICBfLm1lcmdlKHRoaXMuZWxlbWVudHMsIHNvdXJjZS5lbGVtZW50cyk7XG4gICAgXy5tZXJnZSh0aGlzLnhtbG5zLCBzb3VyY2UueG1sbnMpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG5TY2hlbWFFbGVtZW50LnByb3RvdHlwZS5hZGRDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZCkge1xuICBpZiAoY2hpbGQuJG5hbWUgaW4gUHJpbWl0aXZlcylcbiAgICByZXR1cm47XG4gIGlmIChjaGlsZC5uYW1lID09PSAnaW5jbHVkZScgfHwgY2hpbGQubmFtZSA9PT0gJ2ltcG9ydCcpIHtcbiAgICBsZXQgbG9jYXRpb24gPSBjaGlsZC4kc2NoZW1hTG9jYXRpb24gfHwgY2hpbGQuJGxvY2F0aW9uO1xuICAgIGlmIChsb2NhdGlvbikge1xuICAgICAgdGhpcy5pbmNsdWRlcy5wdXNoKHtcbiAgICAgICAgbmFtZXNwYWNlOiBjaGlsZC4kbmFtZXNwYWNlIHx8IGNoaWxkLiR0YXJnZXROYW1lc3BhY2UgfHwgdGhpcy4kdGFyZ2V0TmFtZXNwYWNlLFxuICAgICAgICBsb2NhdGlvbjogbG9jYXRpb25cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBlbHNlIGlmIChjaGlsZC5uYW1lID09PSAnY29tcGxleFR5cGUnKSB7XG4gICAgdGhpcy5jb21wbGV4VHlwZXNbY2hpbGQuJG5hbWVdID0gY2hpbGQ7XG4gIH1cbiAgZWxzZSBpZiAoY2hpbGQubmFtZSA9PT0gJ2VsZW1lbnQnKSB7XG4gICAgdGhpcy5lbGVtZW50c1tjaGlsZC4kbmFtZV0gPSBjaGlsZDtcbiAgfVxuICBlbHNlIGlmIChjaGlsZC4kbmFtZSkge1xuICAgIHRoaXMudHlwZXNbY2hpbGQuJG5hbWVdID0gY2hpbGQ7XG4gIH1cbiAgdGhpcy5jaGlsZHJlbi5wb3AoKTtcbiAgLy8gY2hpbGQuZGVsZXRlRml4ZWRBdHRycygpO1xufTtcbi8vZml4IzMyNVxuVHlwZXNFbGVtZW50LnByb3RvdHlwZS5hZGRDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZCkge1xuICBhc3NlcnQoY2hpbGQgaW5zdGFuY2VvZiBTY2hlbWFFbGVtZW50KTtcblxuICBsZXQgdGFyZ2V0TmFtZXNwYWNlID0gY2hpbGQuJHRhcmdldE5hbWVzcGFjZTtcblxuICBpZiAoIXRoaXMuc2NoZW1hcy5oYXNPd25Qcm9wZXJ0eSh0YXJnZXROYW1lc3BhY2UpKSB7XG4gICAgdGhpcy5zY2hlbWFzW3RhcmdldE5hbWVzcGFjZV0gPSBjaGlsZDtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmVycm9yKCdUYXJnZXQtTmFtZXNwYWNlIFwiJyArIHRhcmdldE5hbWVzcGFjZSArICdcIiBhbHJlYWR5IGluIHVzZSBieSBhbm90aGVyIFNjaGVtYSEnKTtcbiAgfVxufTtcblxuSW5wdXRFbGVtZW50LnByb3RvdHlwZS5hZGRDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZCkge1xuICBpZiAoY2hpbGQubmFtZSA9PT0gJ2JvZHknKSB7XG4gICAgdGhpcy51c2UgPSBjaGlsZC4kdXNlO1xuICAgIGlmICh0aGlzLnVzZSA9PT0gJ2VuY29kZWQnKSB7XG4gICAgICB0aGlzLmVuY29kaW5nU3R5bGUgPSBjaGlsZC4kZW5jb2RpbmdTdHlsZTtcbiAgICB9XG4gICAgdGhpcy5jaGlsZHJlbi5wb3AoKTtcbiAgfVxufTtcblxuT3V0cHV0RWxlbWVudC5wcm90b3R5cGUuYWRkQ2hpbGQgPSBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgaWYgKGNoaWxkLm5hbWUgPT09ICdib2R5Jykge1xuICAgIHRoaXMudXNlID0gY2hpbGQuJHVzZTtcbiAgICBpZiAodGhpcy51c2UgPT09ICdlbmNvZGVkJykge1xuICAgICAgdGhpcy5lbmNvZGluZ1N0eWxlID0gY2hpbGQuJGVuY29kaW5nU3R5bGU7XG4gICAgfVxuICAgIHRoaXMuY2hpbGRyZW4ucG9wKCk7XG4gIH1cbn07XG5cbk9wZXJhdGlvbkVsZW1lbnQucHJvdG90eXBlLmFkZENoaWxkID0gZnVuY3Rpb24gKGNoaWxkKSB7XG4gIGlmIChjaGlsZC5uYW1lID09PSAnb3BlcmF0aW9uJykge1xuICAgIHRoaXMuc29hcEFjdGlvbiA9IGNoaWxkLiRzb2FwQWN0aW9uIHx8ICcnO1xuICAgIHRoaXMuc3R5bGUgPSBjaGlsZC4kc3R5bGUgfHwgJyc7XG4gICAgdGhpcy5jaGlsZHJlbi5wb3AoKTtcbiAgfVxufTtcblxuQmluZGluZ0VsZW1lbnQucHJvdG90eXBlLmFkZENoaWxkID0gZnVuY3Rpb24gKGNoaWxkKSB7XG4gIGlmIChjaGlsZC5uYW1lID09PSAnYmluZGluZycpIHtcbiAgICB0aGlzLnRyYW5zcG9ydCA9IGNoaWxkLiR0cmFuc3BvcnQ7XG4gICAgdGhpcy5zdHlsZSA9IGNoaWxkLiRzdHlsZTtcbiAgICB0aGlzLmNoaWxkcmVuLnBvcCgpO1xuICB9XG59O1xuXG5Qb3J0RWxlbWVudC5wcm90b3R5cGUuYWRkQ2hpbGQgPSBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgaWYgKGNoaWxkLm5hbWUgPT09ICdhZGRyZXNzJyAmJiB0eXBlb2YgKGNoaWxkLiRsb2NhdGlvbikgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgdGhpcy5sb2NhdGlvbiA9IGNoaWxkLiRsb2NhdGlvbjtcbiAgfVxufTtcblxuRGVmaW5pdGlvbnNFbGVtZW50LnByb3RvdHlwZS5hZGRDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZCkge1xuICBsZXQgc2VsZiA9IHRoaXM7XG4gIGlmIChjaGlsZCBpbnN0YW5jZW9mIFR5cGVzRWxlbWVudCkge1xuICAgIC8vIE1lcmdlIHR5cGVzLnNjaGVtYXMgaW50byBkZWZpbml0aW9ucy5zY2hlbWFzXG4gICAgXy5tZXJnZShzZWxmLnNjaGVtYXMsIGNoaWxkLnNjaGVtYXMpO1xuICB9XG4gIGVsc2UgaWYgKGNoaWxkIGluc3RhbmNlb2YgTWVzc2FnZUVsZW1lbnQpIHtcbiAgICBzZWxmLm1lc3NhZ2VzW2NoaWxkLiRuYW1lXSA9IGNoaWxkO1xuICB9XG4gIGVsc2UgaWYgKGNoaWxkLm5hbWUgPT09ICdpbXBvcnQnKSB7XG4gICAgc2VsZi5zY2hlbWFzW2NoaWxkLiRuYW1lc3BhY2VdID0gbmV3IFNjaGVtYUVsZW1lbnQoY2hpbGQuJG5hbWVzcGFjZSwge30pO1xuICAgIHNlbGYuc2NoZW1hc1tjaGlsZC4kbmFtZXNwYWNlXS5hZGRDaGlsZChjaGlsZCk7XG4gIH1cbiAgZWxzZSBpZiAoY2hpbGQgaW5zdGFuY2VvZiBQb3J0VHlwZUVsZW1lbnQpIHtcbiAgICBzZWxmLnBvcnRUeXBlc1tjaGlsZC4kbmFtZV0gPSBjaGlsZDtcbiAgfVxuICBlbHNlIGlmIChjaGlsZCBpbnN0YW5jZW9mIEJpbmRpbmdFbGVtZW50KSB7XG4gICAgaWYgKGNoaWxkLnRyYW5zcG9ydCA9PT0gJ2h0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3NvYXAvaHR0cCcgfHxcbiAgICAgIGNoaWxkLnRyYW5zcG9ydCA9PT0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDMvMDUvc29hcC9iaW5kaW5ncy9IVFRQLycpXG4gICAgICBzZWxmLmJpbmRpbmdzW2NoaWxkLiRuYW1lXSA9IGNoaWxkO1xuICB9XG4gIGVsc2UgaWYgKGNoaWxkIGluc3RhbmNlb2YgU2VydmljZUVsZW1lbnQpIHtcbiAgICBzZWxmLnNlcnZpY2VzW2NoaWxkLiRuYW1lXSA9IGNoaWxkO1xuICB9XG4gIGVsc2UgaWYgKGNoaWxkIGluc3RhbmNlb2YgRG9jdW1lbnRhdGlvbkVsZW1lbnQpIHtcbiAgfVxuICB0aGlzLmNoaWxkcmVuLnBvcCgpO1xufTtcblxuTWVzc2FnZUVsZW1lbnQucHJvdG90eXBlLnBvc3RQcm9jZXNzID0gZnVuY3Rpb24gKGRlZmluaXRpb25zKSB7XG4gIGxldCBwYXJ0ID0gbnVsbDtcbiAgbGV0IGNoaWxkID0gdW5kZWZpbmVkO1xuICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuIHx8IFtdO1xuICBsZXQgbnMgPSB1bmRlZmluZWQ7XG4gIGxldCBuc05hbWUgPSB1bmRlZmluZWQ7XG4gIGxldCBpID0gdW5kZWZpbmVkO1xuICBsZXQgdHlwZSA9IHVuZGVmaW5lZDtcblxuICBmb3IgKGkgaW4gY2hpbGRyZW4pIHtcbiAgICBpZiAoKGNoaWxkID0gY2hpbGRyZW5baV0pLm5hbWUgPT09ICdwYXJ0Jykge1xuICAgICAgcGFydCA9IGNoaWxkO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFwYXJ0KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHBhcnQuJGVsZW1lbnQpIHtcbiAgICBsZXQgbG9va3VwVHlwZXMgPSBbXSxcbiAgICAgIGVsZW1lbnRDaGlsZHJlbjtcblxuICAgIGRlbGV0ZSB0aGlzLnBhcnRzO1xuXG4gICAgbnNOYW1lID0gc3BsaXRRTmFtZShwYXJ0LiRlbGVtZW50KTtcbiAgICBucyA9IG5zTmFtZS5wcmVmaXg7XG4gICAgbGV0IHNjaGVtYSA9IGRlZmluaXRpb25zLnNjaGVtYXNbZGVmaW5pdGlvbnMueG1sbnNbbnNdXTtcbiAgICB0aGlzLmVsZW1lbnQgPSBzY2hlbWEuZWxlbWVudHNbbnNOYW1lLm5hbWVdO1xuICAgIGlmICghdGhpcy5lbGVtZW50KSB7XG4gICAgICAvLyBkZWJ1Zyhuc05hbWUubmFtZSArIFwiIGlzIG5vdCBwcmVzZW50IGluIHdzZGwgYW5kIGNhbm5vdCBiZSBwcm9jZXNzZWQgY29ycmVjdGx5LlwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5lbGVtZW50LnRhcmdldE5TQWxpYXMgPSBucztcbiAgICB0aGlzLmVsZW1lbnQudGFyZ2V0TmFtZXNwYWNlID0gZGVmaW5pdGlvbnMueG1sbnNbbnNdO1xuXG4gICAgLy8gc2V0IHRoZSBvcHRpb25hbCAkbG9va3VwVHlwZSB0byBiZSB1c2VkIHdpdGhpbiBgY2xpZW50I19pbnZva2UoKWAgd2hlblxuICAgIC8vIGNhbGxpbmcgYHdzZGwjb2JqZWN0VG9Eb2N1bWVudFhNTCgpXG4gICAgdGhpcy5lbGVtZW50LiRsb29rdXBUeXBlID0gcGFydC4kZWxlbWVudDtcblxuICAgIGVsZW1lbnRDaGlsZHJlbiA9IHRoaXMuZWxlbWVudC5jaGlsZHJlbjtcblxuICAgIC8vIGdldCBhbGwgbmVzdGVkIGxvb2t1cCB0eXBlcyAob25seSBjb21wbGV4IHR5cGVzIGFyZSBmb2xsb3dlZClcbiAgICBpZiAoZWxlbWVudENoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBlbGVtZW50Q2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbG9va3VwVHlwZXMucHVzaCh0aGlzLl9nZXROZXN0ZWRMb29rdXBUeXBlU3RyaW5nKGVsZW1lbnRDaGlsZHJlbltpXSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGlmIG5lc3RlZCBsb29rdXAgdHlwZXMgd2hlcmUgZm91bmQsIHByZXBhcmUgdGhlbSBmb3IgZnVydGVyIHVzYWdlXG4gICAgaWYgKGxvb2t1cFR5cGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxvb2t1cFR5cGVzID0gbG9va3VwVHlwZXMuXG4gICAgICAgIGpvaW4oJ18nKS5cbiAgICAgICAgc3BsaXQoJ18nKS5cbiAgICAgICAgZmlsdGVyKGZ1bmN0aW9uIHJlbW92ZUVtcHR5TG9va3VwVHlwZXModHlwZSkge1xuICAgICAgICAgIHJldHVybiB0eXBlICE9PSAnXic7XG4gICAgICAgIH0pO1xuXG4gICAgICBsZXQgc2NoZW1hWG1sbnMgPSBkZWZpbml0aW9ucy5zY2hlbWFzW3RoaXMuZWxlbWVudC50YXJnZXROYW1lc3BhY2VdLnhtbG5zO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbG9va3VwVHlwZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbG9va3VwVHlwZXNbaV0gPSB0aGlzLl9jcmVhdGVMb29rdXBUeXBlT2JqZWN0KGxvb2t1cFR5cGVzW2ldLCBzY2hlbWFYbWxucyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5lbGVtZW50LiRsb29rdXBUeXBlcyA9IGxvb2t1cFR5cGVzO1xuXG4gICAgaWYgKHRoaXMuZWxlbWVudC4kdHlwZSkge1xuICAgICAgdHlwZSA9IHNwbGl0UU5hbWUodGhpcy5lbGVtZW50LiR0eXBlKTtcbiAgICAgIGxldCB0eXBlTnMgPSBzY2hlbWEueG1sbnMgJiYgc2NoZW1hLnhtbG5zW3R5cGUucHJlZml4XSB8fCBkZWZpbml0aW9ucy54bWxuc1t0eXBlLnByZWZpeF07XG5cbiAgICAgIGlmICh0eXBlTnMpIHtcbiAgICAgICAgaWYgKHR5cGUubmFtZSBpbiBQcmltaXRpdmVzKSB7XG4gICAgICAgICAgLy8gdGhpcy5lbGVtZW50ID0gdGhpcy5lbGVtZW50LiR0eXBlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIC8vIGZpcnN0IGNoZWNrIGxvY2FsIG1hcHBpbmcgb2YgbnMgYWxpYXMgdG8gbmFtZXNwYWNlXG4gICAgICAgICAgc2NoZW1hID0gZGVmaW5pdGlvbnMuc2NoZW1hc1t0eXBlTnNdO1xuICAgICAgICAgIGxldCBjdHlwZSA9IHNjaGVtYS5jb21wbGV4VHlwZXNbdHlwZS5uYW1lXSB8fCBzY2hlbWEudHlwZXNbdHlwZS5uYW1lXSB8fCBzY2hlbWEuZWxlbWVudHNbdHlwZS5uYW1lXTtcblxuXG4gICAgICAgICAgaWYgKGN0eXBlKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnRzID0gY3R5cGUuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMsIHNjaGVtYS54bWxucyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbGV0IG1ldGhvZCA9IHRoaXMuZWxlbWVudC5kZXNjcmlwdGlvbihkZWZpbml0aW9ucywgc2NoZW1hLnhtbG5zKTtcbiAgICAgIHRoaXMucGFydHMgPSBtZXRob2RbbnNOYW1lLm5hbWVdO1xuICAgIH1cblxuXG4gICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoMCwgMSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gcnBjIGVuY29kaW5nXG4gICAgdGhpcy5wYXJ0cyA9IHt9O1xuICAgIGRlbGV0ZSB0aGlzLmVsZW1lbnQ7XG4gICAgZm9yIChpID0gMDsgcGFydCA9IHRoaXMuY2hpbGRyZW5baV07IGkrKykge1xuICAgICAgaWYgKHBhcnQubmFtZSA9PT0gJ2RvY3VtZW50YXRpb24nKSB7XG4gICAgICAgIC8vIDx3c2RsOmRvY3VtZW50YXRpb24gY2FuIGJlIHByZXNlbnQgdW5kZXIgPHdzZGw6bWVzc2FnZT5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBhc3NlcnQocGFydC5uYW1lID09PSAncGFydCcsICdFeHBlY3RlZCBwYXJ0IGVsZW1lbnQnKTtcbiAgICAgIG5zTmFtZSA9IHNwbGl0UU5hbWUocGFydC4kdHlwZSk7XG4gICAgICBucyA9IGRlZmluaXRpb25zLnhtbG5zW25zTmFtZS5wcmVmaXhdO1xuICAgICAgdHlwZSA9IG5zTmFtZS5uYW1lO1xuICAgICAgbGV0IHNjaGVtYURlZmluaXRpb24gPSBkZWZpbml0aW9ucy5zY2hlbWFzW25zXTtcbiAgICAgIGlmICh0eXBlb2Ygc2NoZW1hRGVmaW5pdGlvbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5wYXJ0c1twYXJ0LiRuYW1lXSA9IGRlZmluaXRpb25zLnNjaGVtYXNbbnNdLnR5cGVzW3R5cGVdIHx8IGRlZmluaXRpb25zLnNjaGVtYXNbbnNdLmNvbXBsZXhUeXBlc1t0eXBlXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucGFydHNbcGFydC4kbmFtZV0gPSBwYXJ0LiR0eXBlO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHRoaXMucGFydHNbcGFydC4kbmFtZV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHRoaXMucGFydHNbcGFydC4kbmFtZV0ucHJlZml4ID0gbnNOYW1lLnByZWZpeDtcbiAgICAgICAgdGhpcy5wYXJ0c1twYXJ0LiRuYW1lXS54bWxucyA9IG5zO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpLS0sIDEpO1xuICAgIH1cbiAgfVxuICB0aGlzLmRlbGV0ZUZpeGVkQXR0cnMoKTtcbn07XG5cbi8qKlxuICogVGFrZXMgYSBnaXZlbiBuYW1lc3BhY2VkIFN0cmluZyhmb3IgZXhhbXBsZTogJ2FsaWFzOnByb3BlcnR5JykgYW5kIGNyZWF0ZXMgYSBsb29rdXBUeXBlXG4gKiBvYmplY3QgZm9yIGZ1cnRoZXIgdXNlIGluIGFzIGZpcnN0IChsb29rdXApIGBwYXJhbWV0ZXJUeXBlT2JqYCB3aXRoaW4gdGhlIGBvYmplY3RUb1hNTGBcbiAqIG1ldGhvZCBhbmQgcHJvdmlkZXMgYW4gZW50cnkgcG9pbnQgZm9yIHRoZSBhbHJlYWR5IGV4aXN0aW5nIGNvZGUgaW4gYGZpbmRDaGlsZFNjaGVtYU9iamVjdGAuXG4gKlxuICogQG1ldGhvZCBfY3JlYXRlTG9va3VwVHlwZU9iamVjdFxuICogQHBhcmFtIHtTdHJpbmd9ICAgICAgICAgICAgbnNTdHJpbmcgICAgICAgICAgVGhlIE5TIFN0cmluZyAoZm9yIGV4YW1wbGUgXCJhbGlhczp0eXBlXCIpLlxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgICAgeG1sbnMgICAgICAgVGhlIGZ1bGx5IHBhcnNlZCBgd3NkbGAgZGVmaW5pdGlvbnMgb2JqZWN0IChpbmNsdWRpbmcgYWxsIHNjaGVtYXMpLlxuICogQHJldHVybnMge09iamVjdH1cbiAqIEBwcml2YXRlXG4gKi9cbk1lc3NhZ2VFbGVtZW50LnByb3RvdHlwZS5fY3JlYXRlTG9va3VwVHlwZU9iamVjdCA9IGZ1bmN0aW9uIChuc1N0cmluZywgeG1sbnMpIHtcbiAgbGV0IHNwbGl0dGVkTlNTdHJpbmcgPSBzcGxpdFFOYW1lKG5zU3RyaW5nKSxcbiAgICBuc0FsaWFzID0gc3BsaXR0ZWROU1N0cmluZy5wcmVmaXgsXG4gICAgc3BsaXR0ZWROYW1lID0gc3BsaXR0ZWROU1N0cmluZy5uYW1lLnNwbGl0KCcjJyksXG4gICAgdHlwZSA9IHNwbGl0dGVkTmFtZVswXSxcbiAgICBuYW1lID0gc3BsaXR0ZWROYW1lWzFdLFxuICAgIGxvb2t1cFR5cGVPYmo6IGFueSA9IHt9O1xuXG4gIGxvb2t1cFR5cGVPYmouJG5hbWVzcGFjZSA9IHhtbG5zW25zQWxpYXNdO1xuICBsb29rdXBUeXBlT2JqLiR0eXBlID0gbnNBbGlhcyArICc6JyArIHR5cGU7XG4gIGxvb2t1cFR5cGVPYmouJG5hbWUgPSBuYW1lO1xuXG4gIHJldHVybiBsb29rdXBUeXBlT2JqO1xufTtcblxuLyoqXG4gKiBJdGVyYXRlcyB0aHJvdWdoIHRoZSBlbGVtZW50IGFuZCBldmVyeSBuZXN0ZWQgY2hpbGQgdG8gZmluZCBhbnkgZGVmaW5lZCBgJHR5cGVgXG4gKiBwcm9wZXJ0eSBhbmQgcmV0dXJucyBpdCBpbiBhIHVuZGVyc2NvcmUgKCdfJykgc2VwYXJhdGVkIFN0cmluZyAodXNpbmcgJ14nIGFzIGRlZmF1bHRcbiAqIHZhbHVlIGlmIG5vIGAkdHlwZWAgcHJvcGVydHkgd2FzIGZvdW5kKS5cbiAqXG4gKiBAbWV0aG9kIF9nZXROZXN0ZWRMb29rdXBUeXBlU3RyaW5nXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICAgICBlbGVtZW50ICAgICAgICAgVGhlIGVsZW1lbnQgd2hpY2ggKHByb2JhYmx5KSBjb250YWlucyBuZXN0ZWQgYCR0eXBlYCB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICogQHByaXZhdGVcbiAqL1xuTWVzc2FnZUVsZW1lbnQucHJvdG90eXBlLl9nZXROZXN0ZWRMb29rdXBUeXBlU3RyaW5nID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgbGV0IHJlc29sdmVkVHlwZSA9ICdeJyxcbiAgICBleGNsdWRlZCA9IHRoaXMuaWdub3JlZE5hbWVzcGFjZXMuY29uY2F0KCd4cycpOyAvLyBkbyBub3QgcHJvY2VzcyAkdHlwZSB2YWx1ZXMgd2ljaCBzdGFydCB3aXRoXG5cbiAgaWYgKGVsZW1lbnQuaGFzT3duUHJvcGVydHkoJyR0eXBlJykgJiYgdHlwZW9mIGVsZW1lbnQuJHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKGV4Y2x1ZGVkLmluZGV4T2YoZWxlbWVudC4kdHlwZS5zcGxpdCgnOicpWzBdKSA9PT0gLTEpIHtcbiAgICAgIHJlc29sdmVkVHlwZSArPSAoJ18nICsgZWxlbWVudC4kdHlwZSArICcjJyArIGVsZW1lbnQuJG5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChlbGVtZW50LmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICBlbGVtZW50LmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICBsZXQgcmVzb2x2ZWRDaGlsZFR5cGUgPSBzZWxmLl9nZXROZXN0ZWRMb29rdXBUeXBlU3RyaW5nKGNoaWxkKS5yZXBsYWNlKC9cXF5fLywgJycpO1xuXG4gICAgICBpZiAocmVzb2x2ZWRDaGlsZFR5cGUgJiYgdHlwZW9mIHJlc29sdmVkQ2hpbGRUeXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXNvbHZlZFR5cGUgKz0gKCdfJyArIHJlc29sdmVkQ2hpbGRUeXBlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiByZXNvbHZlZFR5cGU7XG59O1xuXG5PcGVyYXRpb25FbGVtZW50LnByb3RvdHlwZS5wb3N0UHJvY2VzcyA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucywgdGFnKSB7XG4gIGxldCBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG4gIGZvciAobGV0IGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBjaGlsZHJlbltpXTsgaSsrKSB7XG4gICAgaWYgKGNoaWxkLm5hbWUgIT09ICdpbnB1dCcgJiYgY2hpbGQubmFtZSAhPT0gJ291dHB1dCcpXG4gICAgICBjb250aW51ZTtcbiAgICBpZiAodGFnID09PSAnYmluZGluZycpIHtcbiAgICAgIHRoaXNbY2hpbGQubmFtZV0gPSBjaGlsZDtcbiAgICAgIGNoaWxkcmVuLnNwbGljZShpLS0sIDEpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGxldCBtZXNzYWdlTmFtZSA9IHNwbGl0UU5hbWUoY2hpbGQuJG1lc3NhZ2UpLm5hbWU7XG4gICAgbGV0IG1lc3NhZ2UgPSBkZWZpbml0aW9ucy5tZXNzYWdlc1ttZXNzYWdlTmFtZV07XG4gICAgbWVzc2FnZS5wb3N0UHJvY2VzcyhkZWZpbml0aW9ucyk7XG4gICAgaWYgKG1lc3NhZ2UuZWxlbWVudCkge1xuICAgICAgZGVmaW5pdGlvbnMubWVzc2FnZXNbbWVzc2FnZS5lbGVtZW50LiRuYW1lXSA9IG1lc3NhZ2U7XG4gICAgICB0aGlzW2NoaWxkLm5hbWVdID0gbWVzc2FnZS5lbGVtZW50O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXNbY2hpbGQubmFtZV0gPSBtZXNzYWdlO1xuICAgIH1cbiAgICBjaGlsZHJlbi5zcGxpY2UoaS0tLCAxKTtcbiAgfVxuICB0aGlzLmRlbGV0ZUZpeGVkQXR0cnMoKTtcbn07XG5cblBvcnRUeXBlRWxlbWVudC5wcm90b3R5cGUucG9zdFByb2Nlc3MgPSBmdW5jdGlvbiAoZGVmaW5pdGlvbnMpIHtcbiAgbGV0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcbiAgaWYgKHR5cGVvZiBjaGlsZHJlbiA9PT0gJ3VuZGVmaW5lZCcpXG4gICAgcmV0dXJuO1xuICBmb3IgKGxldCBpID0gMCwgY2hpbGQ7IGNoaWxkID0gY2hpbGRyZW5baV07IGkrKykge1xuICAgIGlmIChjaGlsZC5uYW1lICE9PSAnb3BlcmF0aW9uJylcbiAgICAgIGNvbnRpbnVlO1xuICAgIGNoaWxkLnBvc3RQcm9jZXNzKGRlZmluaXRpb25zLCAncG9ydFR5cGUnKTtcbiAgICB0aGlzLm1ldGhvZHNbY2hpbGQuJG5hbWVdID0gY2hpbGQ7XG4gICAgY2hpbGRyZW4uc3BsaWNlKGktLSwgMSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuJG5hbWU7XG4gIHRoaXMuZGVsZXRlRml4ZWRBdHRycygpO1xufTtcblxuQmluZGluZ0VsZW1lbnQucHJvdG90eXBlLnBvc3RQcm9jZXNzID0gZnVuY3Rpb24gKGRlZmluaXRpb25zKSB7XG4gIGxldCB0eXBlID0gc3BsaXRRTmFtZSh0aGlzLiR0eXBlKS5uYW1lLFxuICAgIHBvcnRUeXBlID0gZGVmaW5pdGlvbnMucG9ydFR5cGVzW3R5cGVdLFxuICAgIHN0eWxlID0gdGhpcy5zdHlsZSxcbiAgICBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG4gIGlmIChwb3J0VHlwZSkge1xuICAgIHBvcnRUeXBlLnBvc3RQcm9jZXNzKGRlZmluaXRpb25zKTtcbiAgICB0aGlzLm1ldGhvZHMgPSBwb3J0VHlwZS5tZXRob2RzO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGNoaWxkOyBjaGlsZCA9IGNoaWxkcmVuW2ldOyBpKyspIHtcbiAgICAgIGlmIChjaGlsZC5uYW1lICE9PSAnb3BlcmF0aW9uJylcbiAgICAgICAgY29udGludWU7XG4gICAgICBjaGlsZC5wb3N0UHJvY2VzcyhkZWZpbml0aW9ucywgJ2JpbmRpbmcnKTtcbiAgICAgIGNoaWxkcmVuLnNwbGljZShpLS0sIDEpO1xuICAgICAgY2hpbGQuc3R5bGUgfHwgKGNoaWxkLnN0eWxlID0gc3R5bGUpO1xuICAgICAgbGV0IG1ldGhvZCA9IHRoaXMubWV0aG9kc1tjaGlsZC4kbmFtZV07XG5cbiAgICAgIGlmIChtZXRob2QpIHtcbiAgICAgICAgbWV0aG9kLnN0eWxlID0gY2hpbGQuc3R5bGU7XG4gICAgICAgIG1ldGhvZC5zb2FwQWN0aW9uID0gY2hpbGQuc29hcEFjdGlvbjtcbiAgICAgICAgbWV0aG9kLmlucHV0U29hcCA9IGNoaWxkLmlucHV0IHx8IG51bGw7XG4gICAgICAgIG1ldGhvZC5vdXRwdXRTb2FwID0gY2hpbGQub3V0cHV0IHx8IG51bGw7XG4gICAgICAgIG1ldGhvZC5pbnB1dFNvYXAgJiYgbWV0aG9kLmlucHV0U29hcC5kZWxldGVGaXhlZEF0dHJzKCk7XG4gICAgICAgIG1ldGhvZC5vdXRwdXRTb2FwICYmIG1ldGhvZC5vdXRwdXRTb2FwLmRlbGV0ZUZpeGVkQXR0cnMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZGVsZXRlIHRoaXMuJG5hbWU7XG4gIGRlbGV0ZSB0aGlzLiR0eXBlO1xuICB0aGlzLmRlbGV0ZUZpeGVkQXR0cnMoKTtcbn07XG5cblNlcnZpY2VFbGVtZW50LnByb3RvdHlwZS5wb3N0UHJvY2VzcyA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucykge1xuICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuLFxuICAgIGJpbmRpbmdzID0gZGVmaW5pdGlvbnMuYmluZGluZ3M7XG4gIGlmIChjaGlsZHJlbiAmJiBjaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGNoaWxkOyBjaGlsZCA9IGNoaWxkcmVuW2ldOyBpKyspIHtcbiAgICAgIGlmIChjaGlsZC5uYW1lICE9PSAncG9ydCcpXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgbGV0IGJpbmRpbmdOYW1lID0gc3BsaXRRTmFtZShjaGlsZC4kYmluZGluZykubmFtZTtcbiAgICAgIGxldCBiaW5kaW5nID0gYmluZGluZ3NbYmluZGluZ05hbWVdO1xuICAgICAgaWYgKGJpbmRpbmcpIHtcbiAgICAgICAgYmluZGluZy5wb3N0UHJvY2VzcyhkZWZpbml0aW9ucyk7XG4gICAgICAgIHRoaXMucG9ydHNbY2hpbGQuJG5hbWVdID0ge1xuICAgICAgICAgIGxvY2F0aW9uOiBjaGlsZC5sb2NhdGlvbixcbiAgICAgICAgICBiaW5kaW5nOiBiaW5kaW5nXG4gICAgICAgIH07XG4gICAgICAgIGNoaWxkcmVuLnNwbGljZShpLS0sIDEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBkZWxldGUgdGhpcy4kbmFtZTtcbiAgdGhpcy5kZWxldGVGaXhlZEF0dHJzKCk7XG59O1xuXG5cblNpbXBsZVR5cGVFbGVtZW50LnByb3RvdHlwZS5kZXNjcmlwdGlvbiA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucykge1xuICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xuICBmb3IgKGxldCBpID0gMCwgY2hpbGQ7IGNoaWxkID0gY2hpbGRyZW5baV07IGkrKykge1xuICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIFJlc3RyaWN0aW9uRWxlbWVudClcbiAgICAgIHJldHVybiB0aGlzLiRuYW1lICsgXCJ8XCIgKyBjaGlsZC5kZXNjcmlwdGlvbigpO1xuICB9XG4gIHJldHVybiB7fTtcbn07XG5cblJlc3RyaWN0aW9uRWxlbWVudC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoZGVmaW5pdGlvbnMsIHhtbG5zKSB7XG4gIGxldCBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG4gIGxldCBkZXNjO1xuICBmb3IgKGxldCBpID0gMCwgY2hpbGQ7IGNoaWxkID0gY2hpbGRyZW5baV07IGkrKykge1xuICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIFNlcXVlbmNlRWxlbWVudCB8fFxuICAgICAgY2hpbGQgaW5zdGFuY2VvZiBDaG9pY2VFbGVtZW50KSB7XG4gICAgICBkZXNjID0gY2hpbGQuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMsIHhtbG5zKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBpZiAoZGVzYyAmJiB0aGlzLiRiYXNlKSB7XG4gICAgbGV0IHR5cGUgPSBzcGxpdFFOYW1lKHRoaXMuJGJhc2UpLFxuICAgICAgdHlwZU5hbWUgPSB0eXBlLm5hbWUsXG4gICAgICBucyA9IHhtbG5zICYmIHhtbG5zW3R5cGUucHJlZml4XSB8fCBkZWZpbml0aW9ucy54bWxuc1t0eXBlLnByZWZpeF0sXG4gICAgICBzY2hlbWEgPSBkZWZpbml0aW9ucy5zY2hlbWFzW25zXSxcbiAgICAgIHR5cGVFbGVtZW50ID0gc2NoZW1hICYmIChzY2hlbWEuY29tcGxleFR5cGVzW3R5cGVOYW1lXSB8fCBzY2hlbWEudHlwZXNbdHlwZU5hbWVdIHx8IHNjaGVtYS5lbGVtZW50c1t0eXBlTmFtZV0pO1xuXG4gICAgZGVzYy5nZXRCYXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHR5cGVFbGVtZW50LmRlc2NyaXB0aW9uKGRlZmluaXRpb25zLCBzY2hlbWEueG1sbnMpO1xuICAgIH07XG4gICAgcmV0dXJuIGRlc2M7XG4gIH1cblxuICAvLyB0aGVuIHNpbXBsZSBlbGVtZW50XG4gIGxldCBiYXNlID0gdGhpcy4kYmFzZSA/IHRoaXMuJGJhc2UgKyBcInxcIiA6IFwiXCI7XG4gIHJldHVybiBiYXNlICsgdGhpcy5jaGlsZHJlbi5tYXAoZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgcmV0dXJuIGNoaWxkLmRlc2NyaXB0aW9uKCk7XG4gIH0pLmpvaW4oXCIsXCIpO1xufTtcblxuRXh0ZW5zaW9uRWxlbWVudC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoZGVmaW5pdGlvbnMsIHhtbG5zKSB7XG4gIGxldCBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG4gIGxldCBkZXNjID0ge307XG4gIGZvciAobGV0IGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBjaGlsZHJlbltpXTsgaSsrKSB7XG4gICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgU2VxdWVuY2VFbGVtZW50IHx8XG4gICAgICBjaGlsZCBpbnN0YW5jZW9mIENob2ljZUVsZW1lbnQpIHtcbiAgICAgIGRlc2MgPSBjaGlsZC5kZXNjcmlwdGlvbihkZWZpbml0aW9ucywgeG1sbnMpO1xuICAgIH1cbiAgfVxuICBpZiAodGhpcy4kYmFzZSkge1xuICAgIGxldCB0eXBlID0gc3BsaXRRTmFtZSh0aGlzLiRiYXNlKSxcbiAgICAgIHR5cGVOYW1lID0gdHlwZS5uYW1lLFxuICAgICAgbnMgPSB4bWxucyAmJiB4bWxuc1t0eXBlLnByZWZpeF0gfHwgZGVmaW5pdGlvbnMueG1sbnNbdHlwZS5wcmVmaXhdLFxuICAgICAgc2NoZW1hID0gZGVmaW5pdGlvbnMuc2NoZW1hc1tuc107XG5cbiAgICBpZiAodHlwZU5hbWUgaW4gUHJpbWl0aXZlcykge1xuICAgICAgcmV0dXJuIHRoaXMuJGJhc2U7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbGV0IHR5cGVFbGVtZW50ID0gc2NoZW1hICYmIChzY2hlbWEuY29tcGxleFR5cGVzW3R5cGVOYW1lXSB8fFxuICAgICAgICBzY2hlbWEudHlwZXNbdHlwZU5hbWVdIHx8IHNjaGVtYS5lbGVtZW50c1t0eXBlTmFtZV0pO1xuXG4gICAgICBpZiAodHlwZUVsZW1lbnQpIHtcbiAgICAgICAgbGV0IGJhc2UgPSB0eXBlRWxlbWVudC5kZXNjcmlwdGlvbihkZWZpbml0aW9ucywgc2NoZW1hLnhtbG5zKTtcbiAgICAgICAgZGVzYyA9IF8uZGVmYXVsdHNEZWVwKGJhc2UsIGRlc2MpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZGVzYztcbn07XG5cbkVudW1lcmF0aW9uRWxlbWVudC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzW3RoaXMudmFsdWVLZXldO1xufTtcblxuQ29tcGxleFR5cGVFbGVtZW50LnByb3RvdHlwZS5kZXNjcmlwdGlvbiA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucywgeG1sbnMpIHtcbiAgbGV0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbiB8fCBbXTtcbiAgZm9yIChsZXQgaSA9IDAsIGNoaWxkOyBjaGlsZCA9IGNoaWxkcmVuW2ldOyBpKyspIHtcbiAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBDaG9pY2VFbGVtZW50IHx8XG4gICAgICBjaGlsZCBpbnN0YW5jZW9mIFNlcXVlbmNlRWxlbWVudCB8fFxuICAgICAgY2hpbGQgaW5zdGFuY2VvZiBBbGxFbGVtZW50IHx8XG4gICAgICBjaGlsZCBpbnN0YW5jZW9mIFNpbXBsZUNvbnRlbnRFbGVtZW50IHx8XG4gICAgICBjaGlsZCBpbnN0YW5jZW9mIENvbXBsZXhDb250ZW50RWxlbWVudCkge1xuXG4gICAgICByZXR1cm4gY2hpbGQuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMsIHhtbG5zKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHt9O1xufTtcblxuQ29tcGxleENvbnRlbnRFbGVtZW50LnByb3RvdHlwZS5kZXNjcmlwdGlvbiA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucywgeG1sbnMpIHtcbiAgbGV0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcbiAgZm9yIChsZXQgaSA9IDAsIGNoaWxkOyBjaGlsZCA9IGNoaWxkcmVuW2ldOyBpKyspIHtcbiAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBFeHRlbnNpb25FbGVtZW50KSB7XG4gICAgICByZXR1cm4gY2hpbGQuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMsIHhtbG5zKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHt9O1xufTtcblxuU2ltcGxlQ29udGVudEVsZW1lbnQucHJvdG90eXBlLmRlc2NyaXB0aW9uID0gZnVuY3Rpb24gKGRlZmluaXRpb25zLCB4bWxucykge1xuICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xuICBmb3IgKGxldCBpID0gMCwgY2hpbGQ7IGNoaWxkID0gY2hpbGRyZW5baV07IGkrKykge1xuICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIEV4dGVuc2lvbkVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBjaGlsZC5kZXNjcmlwdGlvbihkZWZpbml0aW9ucywgeG1sbnMpO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge307XG59O1xuXG5FbGVtZW50RWxlbWVudC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoZGVmaW5pdGlvbnMsIHhtbG5zKSB7XG4gIGxldCBlbGVtZW50ID0ge30sXG4gICAgbmFtZSA9IHRoaXMuJG5hbWU7XG4gIGxldCBpc01hbnkgPSAhdGhpcy4kbWF4T2NjdXJzID8gZmFsc2UgOiAoaXNOYU4odGhpcy4kbWF4T2NjdXJzKSA/ICh0aGlzLiRtYXhPY2N1cnMgPT09ICd1bmJvdW5kZWQnKSA6ICh0aGlzLiRtYXhPY2N1cnMgPiAxKSk7XG4gIGlmICh0aGlzLiRtaW5PY2N1cnMgIT09IHRoaXMuJG1heE9jY3VycyAmJiBpc01hbnkpIHtcbiAgICBuYW1lICs9ICdbXSc7XG4gIH1cblxuICBpZiAoeG1sbnMgJiYgeG1sbnNbVE5TX1BSRUZJWF0pIHtcbiAgICB0aGlzLiR0YXJnZXROYW1lc3BhY2UgPSB4bWxuc1tUTlNfUFJFRklYXTtcbiAgfVxuICBsZXQgdHlwZSA9IHRoaXMuJHR5cGUgfHwgdGhpcy4kcmVmO1xuICBpZiAodHlwZSkge1xuICAgIHR5cGUgPSBzcGxpdFFOYW1lKHR5cGUpO1xuICAgIGxldCB0eXBlTmFtZSA9IHR5cGUubmFtZSxcbiAgICAgIG5zID0geG1sbnMgJiYgeG1sbnNbdHlwZS5wcmVmaXhdIHx8IGRlZmluaXRpb25zLnhtbG5zW3R5cGUucHJlZml4XSxcbiAgICAgIHNjaGVtYSA9IGRlZmluaXRpb25zLnNjaGVtYXNbbnNdLFxuICAgICAgdHlwZUVsZW1lbnQgPSBzY2hlbWEgJiYgKHRoaXMuJHR5cGUgPyBzY2hlbWEuY29tcGxleFR5cGVzW3R5cGVOYW1lXSB8fCBzY2hlbWEudHlwZXNbdHlwZU5hbWVdIDogc2NoZW1hLmVsZW1lbnRzW3R5cGVOYW1lXSk7XG5cbiAgICBpZiAobnMgJiYgZGVmaW5pdGlvbnMuc2NoZW1hc1tuc10pIHtcbiAgICAgIHhtbG5zID0gZGVmaW5pdGlvbnMuc2NoZW1hc1tuc10ueG1sbnM7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVFbGVtZW50ICYmICEodHlwZU5hbWUgaW4gUHJpbWl0aXZlcykpIHtcblxuICAgICAgaWYgKCEodHlwZU5hbWUgaW4gZGVmaW5pdGlvbnMuZGVzY3JpcHRpb25zLnR5cGVzKSkge1xuXG4gICAgICAgIGxldCBlbGVtOiBhbnkgPSB7fTtcbiAgICAgICAgZGVmaW5pdGlvbnMuZGVzY3JpcHRpb25zLnR5cGVzW3R5cGVOYW1lXSA9IGVsZW07XG4gICAgICAgIGxldCBkZXNjcmlwdGlvbiA9IHR5cGVFbGVtZW50LmRlc2NyaXB0aW9uKGRlZmluaXRpb25zLCB4bWxucyk7XG4gICAgICAgIGlmICh0eXBlb2YgZGVzY3JpcHRpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgZWxlbSA9IGRlc2NyaXB0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIE9iamVjdC5rZXlzKGRlc2NyaXB0aW9uKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIGVsZW1ba2V5XSA9IGRlc2NyaXB0aW9uW2tleV07XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy4kcmVmKSB7XG4gICAgICAgICAgZWxlbWVudCA9IGVsZW07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZWxlbWVudFtuYW1lXSA9IGVsZW07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGVsZW0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgZWxlbS50YXJnZXROU0FsaWFzID0gdHlwZS5wcmVmaXg7XG4gICAgICAgICAgZWxlbS50YXJnZXROYW1lc3BhY2UgPSBucztcbiAgICAgICAgfVxuXG4gICAgICAgIGRlZmluaXRpb25zLmRlc2NyaXB0aW9ucy50eXBlc1t0eXBlTmFtZV0gPSBlbGVtO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLiRyZWYpIHtcbiAgICAgICAgICBlbGVtZW50ID0gZGVmaW5pdGlvbnMuZGVzY3JpcHRpb25zLnR5cGVzW3R5cGVOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBlbGVtZW50W25hbWVdID0gZGVmaW5pdGlvbnMuZGVzY3JpcHRpb25zLnR5cGVzW3R5cGVOYW1lXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZWxlbWVudFtuYW1lXSA9IHRoaXMuJHR5cGU7XG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIGxldCBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG4gICAgZWxlbWVudFtuYW1lXSA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBjaGlsZHJlbltpXTsgaSsrKSB7XG4gICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBDb21wbGV4VHlwZUVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudFtuYW1lXSA9IGNoaWxkLmRlc2NyaXB0aW9uKGRlZmluaXRpb25zLCB4bWxucyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBlbGVtZW50O1xufTtcblxuQWxsRWxlbWVudC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPVxuICBTZXF1ZW5jZUVsZW1lbnQucHJvdG90eXBlLmRlc2NyaXB0aW9uID0gZnVuY3Rpb24gKGRlZmluaXRpb25zLCB4bWxucykge1xuICAgIGxldCBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG4gICAgbGV0IHNlcXVlbmNlID0ge307XG4gICAgZm9yIChsZXQgaSA9IDAsIGNoaWxkOyBjaGlsZCA9IGNoaWxkcmVuW2ldOyBpKyspIHtcbiAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIEFueUVsZW1lbnQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBsZXQgZGVzY3JpcHRpb24gPSBjaGlsZC5kZXNjcmlwdGlvbihkZWZpbml0aW9ucywgeG1sbnMpO1xuICAgICAgZm9yIChsZXQga2V5IGluIGRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHNlcXVlbmNlW2tleV0gPSBkZXNjcmlwdGlvbltrZXldO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc2VxdWVuY2U7XG4gIH07XG5cbkNob2ljZUVsZW1lbnQucHJvdG90eXBlLmRlc2NyaXB0aW9uID0gZnVuY3Rpb24gKGRlZmluaXRpb25zLCB4bWxucykge1xuICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xuICBsZXQgY2hvaWNlID0ge307XG4gIGZvciAobGV0IGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBjaGlsZHJlbltpXTsgaSsrKSB7XG4gICAgbGV0IGRlc2NyaXB0aW9uID0gY2hpbGQuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMsIHhtbG5zKTtcbiAgICBmb3IgKGxldCBrZXkgaW4gZGVzY3JpcHRpb24pIHtcbiAgICAgIGNob2ljZVtrZXldID0gZGVzY3JpcHRpb25ba2V5XTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNob2ljZTtcbn07XG5cbk1lc3NhZ2VFbGVtZW50LnByb3RvdHlwZS5kZXNjcmlwdGlvbiA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucykge1xuICBpZiAodGhpcy5lbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudCAmJiB0aGlzLmVsZW1lbnQuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMpO1xuICB9XG4gIGxldCBkZXNjID0ge307XG4gIGRlc2NbdGhpcy4kbmFtZV0gPSB0aGlzLnBhcnRzO1xuICByZXR1cm4gZGVzYztcbn07XG5cblBvcnRUeXBlRWxlbWVudC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoZGVmaW5pdGlvbnMpIHtcbiAgbGV0IG1ldGhvZHMgPSB7fTtcbiAgZm9yIChsZXQgbmFtZSBpbiB0aGlzLm1ldGhvZHMpIHtcbiAgICBsZXQgbWV0aG9kID0gdGhpcy5tZXRob2RzW25hbWVdO1xuICAgIG1ldGhvZHNbbmFtZV0gPSBtZXRob2QuZGVzY3JpcHRpb24oZGVmaW5pdGlvbnMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTtcblxuT3BlcmF0aW9uRWxlbWVudC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoZGVmaW5pdGlvbnMpIHtcbiAgbGV0IGlucHV0RGVzYyA9IHRoaXMuaW5wdXQgPyB0aGlzLmlucHV0LmRlc2NyaXB0aW9uKGRlZmluaXRpb25zKSA6IG51bGw7XG4gIGxldCBvdXRwdXREZXNjID0gdGhpcy5vdXRwdXQgPyB0aGlzLm91dHB1dC5kZXNjcmlwdGlvbihkZWZpbml0aW9ucykgOiBudWxsO1xuICByZXR1cm4ge1xuICAgIGlucHV0OiBpbnB1dERlc2MgJiYgaW5wdXREZXNjW09iamVjdC5rZXlzKGlucHV0RGVzYylbMF1dLFxuICAgIG91dHB1dDogb3V0cHV0RGVzYyAmJiBvdXRwdXREZXNjW09iamVjdC5rZXlzKG91dHB1dERlc2MpWzBdXVxuICB9O1xufTtcblxuQmluZGluZ0VsZW1lbnQucHJvdG90eXBlLmRlc2NyaXB0aW9uID0gZnVuY3Rpb24gKGRlZmluaXRpb25zKSB7XG4gIGxldCBtZXRob2RzID0ge307XG4gIGZvciAobGV0IG5hbWUgaW4gdGhpcy5tZXRob2RzKSB7XG4gICAgbGV0IG1ldGhvZCA9IHRoaXMubWV0aG9kc1tuYW1lXTtcbiAgICBtZXRob2RzW25hbWVdID0gbWV0aG9kLmRlc2NyaXB0aW9uKGRlZmluaXRpb25zKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07XG5cblNlcnZpY2VFbGVtZW50LnByb3RvdHlwZS5kZXNjcmlwdGlvbiA9IGZ1bmN0aW9uIChkZWZpbml0aW9ucykge1xuICBsZXQgcG9ydHMgPSB7fTtcbiAgZm9yIChsZXQgbmFtZSBpbiB0aGlzLnBvcnRzKSB7XG4gICAgbGV0IHBvcnQgPSB0aGlzLnBvcnRzW25hbWVdO1xuICAgIHBvcnRzW25hbWVdID0gcG9ydC5iaW5kaW5nLmRlc2NyaXB0aW9uKGRlZmluaXRpb25zKTtcbiAgfVxuICByZXR1cm4gcG9ydHM7XG59O1xuXG5leHBvcnQgbGV0IFdTREwgPSBmdW5jdGlvbiAoZGVmaW5pdGlvbiwgdXJpLCBvcHRpb25zKSB7XG4gIGxldCBzZWxmID0gdGhpcyxcbiAgICBmcm9tRnVuYztcblxuICB0aGlzLnVyaSA9IHVyaTtcbiAgdGhpcy5jYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgfTtcbiAgdGhpcy5faW5jbHVkZXNXc2RsID0gW107XG5cbiAgLy8gaW5pdGlhbGl6ZSBXU0RMIGNhY2hlXG4gIHRoaXMuV1NETF9DQUNIRSA9IChvcHRpb25zIHx8IHt9KS5XU0RMX0NBQ0hFIHx8IHt9O1xuXG4gIHRoaXMuX2luaXRpYWxpemVPcHRpb25zKG9wdGlvbnMpO1xuXG4gIGlmICh0eXBlb2YgZGVmaW5pdGlvbiA9PT0gJ3N0cmluZycpIHtcbiAgICBkZWZpbml0aW9uID0gc3RyaXBCb20oZGVmaW5pdGlvbik7XG4gICAgZnJvbUZ1bmMgPSB0aGlzLl9mcm9tWE1MO1xuICB9XG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbml0aW9uID09PSAnb2JqZWN0Jykge1xuICAgIGZyb21GdW5jID0gdGhpcy5fZnJvbVNlcnZpY2VzO1xuICB9XG4gIGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignV1NETCBsZXRydWN0b3IgdGFrZXMgZWl0aGVyIGFuIFhNTCBzdHJpbmcgb3Igc2VydmljZSBkZWZpbml0aW9uJyk7XG4gIH1cblxuICBQcm9taXNlLnJlc29sdmUodHJ1ZSkudGhlbigoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGZyb21GdW5jLmNhbGwoc2VsZiwgZGVmaW5pdGlvbik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soZS5tZXNzYWdlKTtcbiAgICB9XG5cbiAgICBzZWxmLnByb2Nlc3NJbmNsdWRlcygpLnRoZW4oKCkgPT4ge1xuICAgICAgc2VsZi5kZWZpbml0aW9ucy5kZWxldGVGaXhlZEF0dHJzKCk7XG4gICAgICBsZXQgc2VydmljZXMgPSBzZWxmLnNlcnZpY2VzID0gc2VsZi5kZWZpbml0aW9ucy5zZXJ2aWNlcztcbiAgICAgIGlmIChzZXJ2aWNlcykge1xuICAgICAgICBmb3IgKGNvbnN0IG5hbWUgaW4gc2VydmljZXMpIHtcbiAgICAgICAgICBzZXJ2aWNlc1tuYW1lXS5wb3N0UHJvY2VzcyhzZWxmLmRlZmluaXRpb25zKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGV0IGNvbXBsZXhUeXBlcyA9IHNlbGYuZGVmaW5pdGlvbnMuY29tcGxleFR5cGVzO1xuICAgICAgaWYgKGNvbXBsZXhUeXBlcykge1xuICAgICAgICBmb3IgKGNvbnN0IG5hbWUgaW4gY29tcGxleFR5cGVzKSB7XG4gICAgICAgICAgY29tcGxleFR5cGVzW25hbWVdLmRlbGV0ZUZpeGVkQXR0cnMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBmb3IgZG9jdW1lbnQgc3R5bGUsIGZvciBldmVyeSBiaW5kaW5nLCBwcmVwYXJlIGlucHV0IG1lc3NhZ2UgZWxlbWVudCBuYW1lIHRvIChtZXRob2ROYW1lLCBvdXRwdXQgbWVzc2FnZSBlbGVtZW50IG5hbWUpIG1hcHBpbmdcbiAgICAgIGxldCBiaW5kaW5ncyA9IHNlbGYuZGVmaW5pdGlvbnMuYmluZGluZ3M7XG4gICAgICBmb3IgKGxldCBiaW5kaW5nTmFtZSBpbiBiaW5kaW5ncykge1xuICAgICAgICBsZXQgYmluZGluZyA9IGJpbmRpbmdzW2JpbmRpbmdOYW1lXTtcbiAgICAgICAgaWYgKHR5cGVvZiBiaW5kaW5nLnN0eWxlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGJpbmRpbmcuc3R5bGUgPSAnZG9jdW1lbnQnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiaW5kaW5nLnN0eWxlICE9PSAnZG9jdW1lbnQnKVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBsZXQgbWV0aG9kcyA9IGJpbmRpbmcubWV0aG9kcztcbiAgICAgICAgbGV0IHRvcEVscyA9IGJpbmRpbmcudG9wRWxlbWVudHMgPSB7fTtcbiAgICAgICAgZm9yIChsZXQgbWV0aG9kTmFtZSBpbiBtZXRob2RzKSB7XG4gICAgICAgICAgaWYgKG1ldGhvZHNbbWV0aG9kTmFtZV0uaW5wdXQpIHtcbiAgICAgICAgICAgIGxldCBpbnB1dE5hbWUgPSBtZXRob2RzW21ldGhvZE5hbWVdLmlucHV0LiRuYW1lO1xuICAgICAgICAgICAgbGV0IG91dHB1dE5hbWUgPSBcIlwiO1xuICAgICAgICAgICAgaWYgKG1ldGhvZHNbbWV0aG9kTmFtZV0ub3V0cHV0KVxuICAgICAgICAgICAgICBvdXRwdXROYW1lID0gbWV0aG9kc1ttZXRob2ROYW1lXS5vdXRwdXQuJG5hbWU7XG4gICAgICAgICAgICB0b3BFbHNbaW5wdXROYW1lXSA9IHsgXCJtZXRob2ROYW1lXCI6IG1ldGhvZE5hbWUsIFwib3V0cHV0TmFtZVwiOiBvdXRwdXROYW1lIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHByZXBhcmUgc29hcCBlbnZlbG9wZSB4bWxucyBkZWZpbml0aW9uIHN0cmluZ1xuICAgICAgc2VsZi54bWxuc0luRW52ZWxvcGUgPSBzZWxmLl94bWxuc01hcCgpO1xuICAgICAgc2VsZi5jYWxsYmFjayhudWxsLCBzZWxmKTtcbiAgICB9KS5jYXRjaChlcnIgPT4gc2VsZi5jYWxsYmFjayhlcnIpKTtcblxuICB9KTtcblxuICAvLyBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCkge1xuICAvLyAgIHRyeSB7XG4gIC8vICAgICBmcm9tRnVuYy5jYWxsKHNlbGYsIGRlZmluaXRpb24pO1xuICAvLyAgIH0gY2F0Y2ggKGUpIHtcbiAgLy8gICAgIHJldHVybiBzZWxmLmNhbGxiYWNrKGUubWVzc2FnZSk7XG4gIC8vICAgfVxuXG4gIC8vICAgc2VsZi5wcm9jZXNzSW5jbHVkZXMoZnVuY3Rpb24oZXJyKSB7XG4gIC8vICAgICBsZXQgbmFtZTtcbiAgLy8gICAgIGlmIChlcnIpIHtcbiAgLy8gICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soZXJyKTtcbiAgLy8gICAgIH1cblxuICAvLyAgICAgc2VsZi5kZWZpbml0aW9ucy5kZWxldGVGaXhlZEF0dHJzKCk7XG4gIC8vICAgICBsZXQgc2VydmljZXMgPSBzZWxmLnNlcnZpY2VzID0gc2VsZi5kZWZpbml0aW9ucy5zZXJ2aWNlcztcbiAgLy8gICAgIGlmIChzZXJ2aWNlcykge1xuICAvLyAgICAgICBmb3IgKG5hbWUgaW4gc2VydmljZXMpIHtcbiAgLy8gICAgICAgICBzZXJ2aWNlc1tuYW1lXS5wb3N0UHJvY2VzcyhzZWxmLmRlZmluaXRpb25zKTtcbiAgLy8gICAgICAgfVxuICAvLyAgICAgfVxuICAvLyAgICAgbGV0IGNvbXBsZXhUeXBlcyA9IHNlbGYuZGVmaW5pdGlvbnMuY29tcGxleFR5cGVzO1xuICAvLyAgICAgaWYgKGNvbXBsZXhUeXBlcykge1xuICAvLyAgICAgICBmb3IgKG5hbWUgaW4gY29tcGxleFR5cGVzKSB7XG4gIC8vICAgICAgICAgY29tcGxleFR5cGVzW25hbWVdLmRlbGV0ZUZpeGVkQXR0cnMoKTtcbiAgLy8gICAgICAgfVxuICAvLyAgICAgfVxuXG4gIC8vICAgICAvLyBmb3IgZG9jdW1lbnQgc3R5bGUsIGZvciBldmVyeSBiaW5kaW5nLCBwcmVwYXJlIGlucHV0IG1lc3NhZ2UgZWxlbWVudCBuYW1lIHRvIChtZXRob2ROYW1lLCBvdXRwdXQgbWVzc2FnZSBlbGVtZW50IG5hbWUpIG1hcHBpbmdcbiAgLy8gICAgIGxldCBiaW5kaW5ncyA9IHNlbGYuZGVmaW5pdGlvbnMuYmluZGluZ3M7XG4gIC8vICAgICBmb3IgKGxldCBiaW5kaW5nTmFtZSBpbiBiaW5kaW5ncykge1xuICAvLyAgICAgICBsZXQgYmluZGluZyA9IGJpbmRpbmdzW2JpbmRpbmdOYW1lXTtcbiAgLy8gICAgICAgaWYgKHR5cGVvZiBiaW5kaW5nLnN0eWxlID09PSAndW5kZWZpbmVkJykge1xuICAvLyAgICAgICAgIGJpbmRpbmcuc3R5bGUgPSAnZG9jdW1lbnQnO1xuICAvLyAgICAgICB9XG4gIC8vICAgICAgIGlmIChiaW5kaW5nLnN0eWxlICE9PSAnZG9jdW1lbnQnKVxuICAvLyAgICAgICAgIGNvbnRpbnVlO1xuICAvLyAgICAgICBsZXQgbWV0aG9kcyA9IGJpbmRpbmcubWV0aG9kcztcbiAgLy8gICAgICAgbGV0IHRvcEVscyA9IGJpbmRpbmcudG9wRWxlbWVudHMgPSB7fTtcbiAgLy8gICAgICAgZm9yIChsZXQgbWV0aG9kTmFtZSBpbiBtZXRob2RzKSB7XG4gIC8vICAgICAgICAgaWYgKG1ldGhvZHNbbWV0aG9kTmFtZV0uaW5wdXQpIHtcbiAgLy8gICAgICAgICAgIGxldCBpbnB1dE5hbWUgPSBtZXRob2RzW21ldGhvZE5hbWVdLmlucHV0LiRuYW1lO1xuICAvLyAgICAgICAgICAgbGV0IG91dHB1dE5hbWU9XCJcIjtcbiAgLy8gICAgICAgICAgIGlmKG1ldGhvZHNbbWV0aG9kTmFtZV0ub3V0cHV0IClcbiAgLy8gICAgICAgICAgICAgb3V0cHV0TmFtZSA9IG1ldGhvZHNbbWV0aG9kTmFtZV0ub3V0cHV0LiRuYW1lO1xuICAvLyAgICAgICAgICAgdG9wRWxzW2lucHV0TmFtZV0gPSB7XCJtZXRob2ROYW1lXCI6IG1ldGhvZE5hbWUsIFwib3V0cHV0TmFtZVwiOiBvdXRwdXROYW1lfTtcbiAgLy8gICAgICAgICB9XG4gIC8vICAgICAgIH1cbiAgLy8gICAgIH1cblxuICAvLyAgICAgLy8gcHJlcGFyZSBzb2FwIGVudmVsb3BlIHhtbG5zIGRlZmluaXRpb24gc3RyaW5nXG4gIC8vICAgICBzZWxmLnhtbG5zSW5FbnZlbG9wZSA9IHNlbGYuX3htbG5zTWFwKCk7XG5cbiAgLy8gICAgIHNlbGYuY2FsbGJhY2soZXJyLCBzZWxmKTtcbiAgLy8gICB9KTtcblxuICAvLyB9KTtcbn07XG5cbldTREwucHJvdG90eXBlLmlnbm9yZWROYW1lc3BhY2VzID0gWyd0bnMnLCAndGFyZ2V0TmFtZXNwYWNlJywgJ3R5cGVkTmFtZXNwYWNlJ107XG5cbldTREwucHJvdG90eXBlLmlnbm9yZUJhc2VOYW1lU3BhY2VzID0gZmFsc2U7XG5cbldTREwucHJvdG90eXBlLnZhbHVlS2V5ID0gJyR2YWx1ZSc7XG5XU0RMLnByb3RvdHlwZS54bWxLZXkgPSAnJHhtbCc7XG5cbldTREwucHJvdG90eXBlLl9pbml0aWFsaXplT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHRoaXMuX29yaWdpbmFsSWdub3JlZE5hbWVzcGFjZXMgPSAob3B0aW9ucyB8fCB7fSkuaWdub3JlZE5hbWVzcGFjZXM7XG4gIHRoaXMub3B0aW9ucyA9IHt9O1xuXG4gIGxldCBpZ25vcmVkTmFtZXNwYWNlcyA9IG9wdGlvbnMgPyBvcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzIDogbnVsbDtcblxuICBpZiAoaWdub3JlZE5hbWVzcGFjZXMgJiZcbiAgICAoQXJyYXkuaXNBcnJheShpZ25vcmVkTmFtZXNwYWNlcy5uYW1lc3BhY2VzKSB8fCB0eXBlb2YgaWdub3JlZE5hbWVzcGFjZXMubmFtZXNwYWNlcyA9PT0gJ3N0cmluZycpKSB7XG4gICAgaWYgKGlnbm9yZWROYW1lc3BhY2VzLm92ZXJyaWRlKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMgPSBpZ25vcmVkTmFtZXNwYWNlcy5uYW1lc3BhY2VzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMgPSB0aGlzLmlnbm9yZWROYW1lc3BhY2VzLmNvbmNhdChpZ25vcmVkTmFtZXNwYWNlcy5uYW1lc3BhY2VzKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5vcHRpb25zLmlnbm9yZWROYW1lc3BhY2VzID0gdGhpcy5pZ25vcmVkTmFtZXNwYWNlcztcbiAgfVxuXG4gIHRoaXMub3B0aW9ucy52YWx1ZUtleSA9IG9wdGlvbnMudmFsdWVLZXkgfHwgdGhpcy52YWx1ZUtleTtcbiAgdGhpcy5vcHRpb25zLnhtbEtleSA9IG9wdGlvbnMueG1sS2V5IHx8IHRoaXMueG1sS2V5O1xuICBpZiAob3B0aW9ucy5lc2NhcGVYTUwgIT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMub3B0aW9ucy5lc2NhcGVYTUwgPSBvcHRpb25zLmVzY2FwZVhNTDtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm9wdGlvbnMuZXNjYXBlWE1MID0gdHJ1ZTtcbiAgfVxuICBpZiAob3B0aW9ucy5yZXR1cm5GYXVsdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5vcHRpb25zLnJldHVybkZhdWx0ID0gb3B0aW9ucy5yZXR1cm5GYXVsdDtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm9wdGlvbnMucmV0dXJuRmF1bHQgPSBmYWxzZTtcbiAgfVxuICB0aGlzLm9wdGlvbnMuaGFuZGxlTmlsQXNOdWxsID0gISFvcHRpb25zLmhhbmRsZU5pbEFzTnVsbDtcblxuICBpZiAob3B0aW9ucy5uYW1lc3BhY2VBcnJheUVsZW1lbnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLm9wdGlvbnMubmFtZXNwYWNlQXJyYXlFbGVtZW50cyA9IG9wdGlvbnMubmFtZXNwYWNlQXJyYXlFbGVtZW50cztcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm9wdGlvbnMubmFtZXNwYWNlQXJyYXlFbGVtZW50cyA9IHRydWU7XG4gIH1cblxuICAvLyBBbGxvdyBhbnkgcmVxdWVzdCBoZWFkZXJzIHRvIGtlZXAgcGFzc2luZyB0aHJvdWdoXG4gIHRoaXMub3B0aW9ucy53c2RsX2hlYWRlcnMgPSBvcHRpb25zLndzZGxfaGVhZGVycztcbiAgdGhpcy5vcHRpb25zLndzZGxfb3B0aW9ucyA9IG9wdGlvbnMud3NkbF9vcHRpb25zO1xuICBpZiAob3B0aW9ucy5odHRwQ2xpZW50KSB7XG4gICAgdGhpcy5vcHRpb25zLmh0dHBDbGllbnQgPSBvcHRpb25zLmh0dHBDbGllbnQ7XG4gIH1cblxuICAvLyBUaGUgc3VwcGxpZWQgcmVxdWVzdC1vYmplY3Qgc2hvdWxkIGJlIHBhc3NlZCB0aHJvdWdoXG4gIGlmIChvcHRpb25zLnJlcXVlc3QpIHtcbiAgICB0aGlzLm9wdGlvbnMucmVxdWVzdCA9IG9wdGlvbnMucmVxdWVzdDtcbiAgfVxuXG4gIGxldCBpZ25vcmVCYXNlTmFtZVNwYWNlcyA9IG9wdGlvbnMgPyBvcHRpb25zLmlnbm9yZUJhc2VOYW1lU3BhY2VzIDogbnVsbDtcbiAgaWYgKGlnbm9yZUJhc2VOYW1lU3BhY2VzICE9PSBudWxsICYmIHR5cGVvZiBpZ25vcmVCYXNlTmFtZVNwYWNlcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0aGlzLm9wdGlvbnMuaWdub3JlQmFzZU5hbWVTcGFjZXMgPSBpZ25vcmVCYXNlTmFtZVNwYWNlcztcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm9wdGlvbnMuaWdub3JlQmFzZU5hbWVTcGFjZXMgPSB0aGlzLmlnbm9yZUJhc2VOYW1lU3BhY2VzO1xuICB9XG5cbiAgLy8gV29ya3Mgb25seSBpbiBjbGllbnRcbiAgdGhpcy5vcHRpb25zLmZvcmNlU29hcDEySGVhZGVycyA9IG9wdGlvbnMuZm9yY2VTb2FwMTJIZWFkZXJzO1xuICB0aGlzLm9wdGlvbnMuY3VzdG9tRGVzZXJpYWxpemVyID0gb3B0aW9ucy5jdXN0b21EZXNlcmlhbGl6ZXI7XG5cbiAgaWYgKG9wdGlvbnMub3ZlcnJpZGVSb290RWxlbWVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5vcHRpb25zLm92ZXJyaWRlUm9vdEVsZW1lbnQgPSBvcHRpb25zLm92ZXJyaWRlUm9vdEVsZW1lbnQ7XG4gIH1cblxuICB0aGlzLm9wdGlvbnMudXNlRW1wdHlUYWcgPSAhIW9wdGlvbnMudXNlRW1wdHlUYWc7XG59O1xuXG5XU0RMLnByb3RvdHlwZS5vblJlYWR5ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIGlmIChjYWxsYmFjaylcbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG59O1xuXG5XU0RMLnByb3RvdHlwZS5fcHJvY2Vzc05leHRJbmNsdWRlID0gYXN5bmMgZnVuY3Rpb24gKGluY2x1ZGVzKSB7XG4gIGxldCBzZWxmID0gdGhpcyxcbiAgICBpbmNsdWRlID0gaW5jbHVkZXMuc2hpZnQoKSxcbiAgICBvcHRpb25zO1xuXG4gIGlmICghaW5jbHVkZSlcbiAgICByZXR1cm47IC8vIGNhbGxiYWNrKCk7XG5cbiAgbGV0IGluY2x1ZGVQYXRoO1xuICBpZiAoIS9eaHR0cHM/Oi8udGVzdChzZWxmLnVyaSkgJiYgIS9eaHR0cHM/Oi8udGVzdChpbmNsdWRlLmxvY2F0aW9uKSkge1xuICAgIC8vIGluY2x1ZGVQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShzZWxmLnVyaSksIGluY2x1ZGUubG9jYXRpb24pO1xuICB9IGVsc2Uge1xuICAgIGluY2x1ZGVQYXRoID0gdXJsLnJlc29sdmUoc2VsZi51cmkgfHwgJycsIGluY2x1ZGUubG9jYXRpb24pO1xuICB9XG5cbiAgb3B0aW9ucyA9IF8uYXNzaWduKHt9LCB0aGlzLm9wdGlvbnMpO1xuICAvLyBmb2xsb3cgc3VwcGxpZWQgaWdub3JlZE5hbWVzcGFjZXMgb3B0aW9uXG4gIG9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMgPSB0aGlzLl9vcmlnaW5hbElnbm9yZWROYW1lc3BhY2VzIHx8IHRoaXMub3B0aW9ucy5pZ25vcmVkTmFtZXNwYWNlcztcbiAgb3B0aW9ucy5XU0RMX0NBQ0hFID0gdGhpcy5XU0RMX0NBQ0hFO1xuXG4gIGNvbnN0IHdzZGwgPSBhd2FpdCBvcGVuX3dzZGxfcmVjdXJzaXZlKGluY2x1ZGVQYXRoLCBvcHRpb25zKVxuICBzZWxmLl9pbmNsdWRlc1dzZGwucHVzaCh3c2RsKTtcblxuICBpZiAod3NkbC5kZWZpbml0aW9ucyBpbnN0YW5jZW9mIERlZmluaXRpb25zRWxlbWVudCkge1xuICAgIF8ubWVyZ2VXaXRoKHNlbGYuZGVmaW5pdGlvbnMsIHdzZGwuZGVmaW5pdGlvbnMsIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICByZXR1cm4gKGEgaW5zdGFuY2VvZiBTY2hlbWFFbGVtZW50KSA/IGEubWVyZ2UoYikgOiB1bmRlZmluZWQ7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5kZWZpbml0aW9ucy5zY2hlbWFzW2luY2x1ZGUubmFtZXNwYWNlIHx8IHdzZGwuZGVmaW5pdGlvbnMuJHRhcmdldE5hbWVzcGFjZV0gPSBkZWVwTWVyZ2Uoc2VsZi5kZWZpbml0aW9ucy5zY2hlbWFzW2luY2x1ZGUubmFtZXNwYWNlIHx8IHdzZGwuZGVmaW5pdGlvbnMuJHRhcmdldE5hbWVzcGFjZV0sIHdzZGwuZGVmaW5pdGlvbnMpO1xuICB9XG5cbiAgcmV0dXJuIHNlbGYuX3Byb2Nlc3NOZXh0SW5jbHVkZShpbmNsdWRlcyk7XG5cbiAgLy8gb3Blbl93c2RsX3JlY3Vyc2l2ZShpbmNsdWRlUGF0aCwgb3B0aW9ucywgZnVuY3Rpb24oZXJyLCB3c2RsKSB7XG4gIC8vICAgaWYgKGVycikge1xuICAvLyAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gIC8vICAgfVxuXG4gIC8vICAgc2VsZi5faW5jbHVkZXNXc2RsLnB1c2god3NkbCk7XG5cbiAgLy8gICBpZiAod3NkbC5kZWZpbml0aW9ucyBpbnN0YW5jZW9mIERlZmluaXRpb25zRWxlbWVudCkge1xuICAvLyAgICAgXy5tZXJnZVdpdGgoc2VsZi5kZWZpbml0aW9ucywgd3NkbC5kZWZpbml0aW9ucywgZnVuY3Rpb24oYSxiKSB7XG4gIC8vICAgICAgIHJldHVybiAoYSBpbnN0YW5jZW9mIFNjaGVtYUVsZW1lbnQpID8gYS5tZXJnZShiKSA6IHVuZGVmaW5lZDtcbiAgLy8gICAgIH0pO1xuICAvLyAgIH0gZWxzZSB7XG4gIC8vICAgICBzZWxmLmRlZmluaXRpb25zLnNjaGVtYXNbaW5jbHVkZS5uYW1lc3BhY2UgfHwgd3NkbC5kZWZpbml0aW9ucy4kdGFyZ2V0TmFtZXNwYWNlXSA9IGRlZXBNZXJnZShzZWxmLmRlZmluaXRpb25zLnNjaGVtYXNbaW5jbHVkZS5uYW1lc3BhY2UgfHwgd3NkbC5kZWZpbml0aW9ucy4kdGFyZ2V0TmFtZXNwYWNlXSwgd3NkbC5kZWZpbml0aW9ucyk7XG4gIC8vICAgfVxuICAvLyAgIHNlbGYuX3Byb2Nlc3NOZXh0SW5jbHVkZShpbmNsdWRlcywgZnVuY3Rpb24oZXJyKSB7XG4gIC8vICAgICBjYWxsYmFjayhlcnIpO1xuICAvLyAgIH0pO1xuICAvLyB9KTtcbn07XG5cbldTREwucHJvdG90eXBlLnByb2Nlc3NJbmNsdWRlcyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgbGV0IHNjaGVtYXMgPSB0aGlzLmRlZmluaXRpb25zLnNjaGVtYXMsXG4gICAgaW5jbHVkZXMgPSBbXTtcblxuICBmb3IgKGxldCBucyBpbiBzY2hlbWFzKSB7XG4gICAgbGV0IHNjaGVtYSA9IHNjaGVtYXNbbnNdO1xuICAgIGluY2x1ZGVzID0gaW5jbHVkZXMuY29uY2F0KHNjaGVtYS5pbmNsdWRlcyB8fCBbXSk7XG4gIH1cblxuICByZXR1cm4gdGhpcy5fcHJvY2Vzc05leHRJbmNsdWRlKGluY2x1ZGVzKTtcbn07XG5cbldTREwucHJvdG90eXBlLmRlc2NyaWJlU2VydmljZXMgPSBmdW5jdGlvbiAoKSB7XG4gIGxldCBzZXJ2aWNlcyA9IHt9O1xuICBmb3IgKGxldCBuYW1lIGluIHRoaXMuc2VydmljZXMpIHtcbiAgICBsZXQgc2VydmljZSA9IHRoaXMuc2VydmljZXNbbmFtZV07XG4gICAgc2VydmljZXNbbmFtZV0gPSBzZXJ2aWNlLmRlc2NyaXB0aW9uKHRoaXMuZGVmaW5pdGlvbnMpO1xuICB9XG4gIHJldHVybiBzZXJ2aWNlcztcbn07XG5cbldTREwucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy54bWwgfHwgJyc7XG59O1xuXG5XU0RMLnByb3RvdHlwZS54bWxUb09iamVjdCA9IGZ1bmN0aW9uICh4bWwsIGNhbGxiYWNrKSB7XG4gIGxldCBzZWxmID0gdGhpcztcbiAgbGV0IHAgPSB0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicgPyB7fSA6IHNheC5wYXJzZXIodHJ1ZSk7XG4gIGxldCBvYmplY3ROYW1lID0gbnVsbDtcbiAgbGV0IHJvb3Q6IGFueSA9IHt9O1xuICBsZXQgc2NoZW1hPXt9O1xuICBpZighdGhpcy5vcHRpb25zLmZvcmNlU29hcDEySGVhZGVycyl7XG4gICAgIHNjaGVtYSA9IHtcbiAgICAgIEVudmVsb3BlOiB7XG4gICAgICAgIEhlYWRlcjoge1xuICAgICAgICAgIFNlY3VyaXR5OiB7XG4gICAgICAgICAgICBVc2VybmFtZVRva2VuOiB7XG4gICAgICAgICAgICAgIFVzZXJuYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgUGFzc3dvcmQ6ICdzdHJpbmcnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBCb2R5OiB7XG4gICAgICAgICAgRmF1bHQ6IHtcbiAgICAgICAgICAgIGZhdWx0Y29kZTogJ3N0cmluZycsXG4gICAgICAgICAgICBmYXVsdHN0cmluZzogJ3N0cmluZycsXG4gICAgICAgICAgICBkZXRhaWw6ICdzdHJpbmcnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICAgc2NoZW1hID17XG4gICAgICBFbnZlbG9wZToge1xuICAgICAgICBIZWFkZXI6IHtcbiAgICAgICAgICBTZWN1cml0eToge1xuICAgICAgICAgICAgVXNlcm5hbWVUb2tlbjoge1xuICAgICAgICAgICAgICBVc2VybmFtZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgIFBhc3N3b3JkOiAnc3RyaW5nJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgQm9keTp7XG4gICAgICAgICAgQ29kZToge1xuICAgICAgICAgICAgVmFsdWU6ICdzdHJpbmcnLFxuICAgICAgICAgICBTdWJjb2RlOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgVmFsdWU6ICdzdHJpbmcnIFxuICAgICAgICAgICAgIH0gXG4gICAgICAgICAgIH0sXG4gICAgICAgICAgIFJlYXNvbjogeyBUZXh0OiAnc3RyaW5nJ30sXG4gICAgICAgICAgIHN0YXR1c0NvZGU6ICdudW1iZXInLFxuICAgICAgICAgICBEZXRhaWw6ICdvYmplY3QnXG4gICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgXG5cbiAgICB9XG4gIH1cbiAgXG4gIC8vY29uc29sZS5sb2coJ3NjaGVtYScsc2NoZW1hKTtcbiAgbGV0IHN0YWNrOiBhbnlbXSA9IFt7IG5hbWU6IG51bGwsIG9iamVjdDogcm9vdCwgc2NoZW1hOiBzY2hlbWEgfV07XG4gIGxldCB4bWxuczogYW55ID0ge307XG5cbiAgbGV0IHJlZnMgPSB7fSwgaWQ7IC8vIHtpZDp7aHJlZnM6W10sb2JqOn0sIC4uLn1cblxuICBwLm9ub3BlbnRhZyA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgbGV0IG5zTmFtZSA9IG5vZGUubmFtZTtcbiAgICBsZXQgYXR0cnM6IGFueSA9IG5vZGUuYXR0cmlidXRlcztcbiAgICBsZXQgbmFtZSA9IHNwbGl0UU5hbWUobnNOYW1lKS5uYW1lLFxuICAgICAgYXR0cmlidXRlTmFtZSxcbiAgICAgIHRvcCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdLFxuICAgICAgdG9wU2NoZW1hID0gdG9wLnNjaGVtYSxcbiAgICAgIGVsZW1lbnRBdHRyaWJ1dGVzID0ge30sXG4gICAgICBoYXNOb25YbWxuc0F0dHJpYnV0ZSA9IGZhbHNlLFxuICAgICAgaGFzTmlsQXR0cmlidXRlID0gZmFsc2UsXG4gICAgICBvYmogPSB7fTtcbiAgICBsZXQgb3JpZ2luYWxOYW1lID0gbmFtZTtcblxuICAgIGlmICghb2JqZWN0TmFtZSAmJiB0b3AubmFtZSA9PT0gJ0JvZHknICYmIG5hbWUgIT09ICdGYXVsdCcpIHtcbiAgICAgIGxldCBtZXNzYWdlID0gc2VsZi5kZWZpbml0aW9ucy5tZXNzYWdlc1tuYW1lXTtcbiAgICAgIC8vIFN1cHBvcnQgUlBDL2xpdGVyYWwgbWVzc2FnZXMgd2hlcmUgcmVzcG9uc2UgYm9keSBjb250YWlucyBvbmUgZWxlbWVudCBuYW1lZFxuICAgICAgLy8gYWZ0ZXIgdGhlIG9wZXJhdGlvbiArICdSZXNwb25zZScuIFNlZSBodHRwOi8vd3d3LnczLm9yZy9UUi93c2RsI19uYW1lc1xuICAgICAgaWYgKCFtZXNzYWdlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gRGV0ZXJtaW5lIGlmIHRoaXMgaXMgcmVxdWVzdCBvciByZXNwb25zZVxuICAgICAgICAgIGxldCBpc0lucHV0ID0gZmFsc2U7XG4gICAgICAgICAgbGV0IGlzT3V0cHV0ID0gZmFsc2U7XG4gICAgICAgICAgaWYgKCgvUmVzcG9uc2UkLykudGVzdChuYW1lKSkge1xuICAgICAgICAgICAgaXNPdXRwdXQgPSB0cnVlO1xuICAgICAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvUmVzcG9uc2UkLywgJycpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoKC9SZXF1ZXN0JC8pLnRlc3QobmFtZSkpIHtcbiAgICAgICAgICAgIGlzSW5wdXQgPSB0cnVlO1xuICAgICAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvUmVxdWVzdCQvLCAnJyk7XG4gICAgICAgICAgfSBlbHNlIGlmICgoL1NvbGljaXQkLykudGVzdChuYW1lKSkge1xuICAgICAgICAgICAgaXNJbnB1dCA9IHRydWU7XG4gICAgICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9Tb2xpY2l0JC8sICcnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gTG9vayB1cCB0aGUgYXBwcm9wcmlhdGUgbWVzc2FnZSBhcyBnaXZlbiBpbiB0aGUgcG9ydFR5cGUncyBvcGVyYXRpb25zXG4gICAgICAgICAgbGV0IHBvcnRUeXBlcyA9IHNlbGYuZGVmaW5pdGlvbnMucG9ydFR5cGVzO1xuICAgICAgICAgIGxldCBwb3J0VHlwZU5hbWVzID0gT2JqZWN0LmtleXMocG9ydFR5cGVzKTtcbiAgICAgICAgICAvLyBDdXJyZW50bHkgdGhpcyBzdXBwb3J0cyBvbmx5IG9uZSBwb3J0VHlwZSBkZWZpbml0aW9uLlxuICAgICAgICAgIGxldCBwb3J0VHlwZSA9IHBvcnRUeXBlc1twb3J0VHlwZU5hbWVzWzBdXTtcbiAgICAgICAgICBpZiAoaXNJbnB1dCkge1xuICAgICAgICAgICAgbmFtZSA9IHBvcnRUeXBlLm1ldGhvZHNbbmFtZV0uaW5wdXQuJG5hbWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5hbWUgPSBwb3J0VHlwZS5tZXRob2RzW25hbWVdLm91dHB1dC4kbmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbWVzc2FnZSA9IHNlbGYuZGVmaW5pdGlvbnMubWVzc2FnZXNbbmFtZV07XG4gICAgICAgICAgLy8gJ2NhY2hlJyB0aGlzIGFsaWFzIHRvIHNwZWVkIGZ1dHVyZSBsb29rdXBzXG4gICAgICAgICAgc2VsZi5kZWZpbml0aW9ucy5tZXNzYWdlc1tvcmlnaW5hbE5hbWVdID0gc2VsZi5kZWZpbml0aW9ucy5tZXNzYWdlc1tuYW1lXTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMucmV0dXJuRmF1bHQpIHtcbiAgICAgICAgICAgIHAub25lcnJvcihlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdG9wU2NoZW1hID0gbWVzc2FnZS5kZXNjcmlwdGlvbihzZWxmLmRlZmluaXRpb25zKTtcbiAgICAgIG9iamVjdE5hbWUgPSBvcmlnaW5hbE5hbWU7XG4gICAgfVxuXG4gICAgaWYgKGF0dHJzLmhyZWYpIHtcbiAgICAgIGlkID0gYXR0cnMuaHJlZi5zdWJzdHIoMSk7XG4gICAgICBpZiAoIXJlZnNbaWRdKSB7XG4gICAgICAgIHJlZnNbaWRdID0geyBocmVmczogW10sIG9iajogbnVsbCB9O1xuICAgICAgfVxuICAgICAgcmVmc1tpZF0uaHJlZnMucHVzaCh7IHBhcjogdG9wLm9iamVjdCwga2V5OiBuYW1lLCBvYmo6IG9iaiB9KTtcbiAgICB9XG4gICAgaWYgKGlkID0gYXR0cnMuaWQpIHtcbiAgICAgIGlmICghcmVmc1tpZF0pIHtcbiAgICAgICAgcmVmc1tpZF0gPSB7IGhyZWZzOiBbXSwgb2JqOiBudWxsIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9IYW5kbGUgZWxlbWVudCBhdHRyaWJ1dGVzXG4gICAgZm9yIChhdHRyaWJ1dGVOYW1lIGluIGF0dHJzKSB7XG4gICAgICBpZiAoL154bWxuczp8XnhtbG5zJC8udGVzdChhdHRyaWJ1dGVOYW1lKSkge1xuICAgICAgICB4bWxuc1tzcGxpdFFOYW1lKGF0dHJpYnV0ZU5hbWUpLm5hbWVdID0gYXR0cnNbYXR0cmlidXRlTmFtZV07XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaGFzTm9uWG1sbnNBdHRyaWJ1dGUgPSB0cnVlO1xuICAgICAgZWxlbWVudEF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPSBhdHRyc1thdHRyaWJ1dGVOYW1lXTtcbiAgICB9XG5cbiAgICBmb3IgKGF0dHJpYnV0ZU5hbWUgaW4gZWxlbWVudEF0dHJpYnV0ZXMpIHtcbiAgICAgIGxldCByZXMgPSBzcGxpdFFOYW1lKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgaWYgKHJlcy5uYW1lID09PSAnbmlsJyAmJiB4bWxuc1tyZXMucHJlZml4XSA9PT0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlJyAmJiBlbGVtZW50QXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSAmJlxuICAgICAgICAoZWxlbWVudEF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0udG9Mb3dlckNhc2UoKSA9PT0gJ3RydWUnIHx8IGVsZW1lbnRBdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID09PSAnMScpXG4gICAgICApIHtcbiAgICAgICAgaGFzTmlsQXR0cmlidXRlID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhhc05vblhtbG5zQXR0cmlidXRlKSB7XG4gICAgICBvYmpbc2VsZi5vcHRpb25zLmF0dHJpYnV0ZXNLZXldID0gZWxlbWVudEF0dHJpYnV0ZXM7XG4gICAgfVxuXG4gICAgLy8gUGljayB1cCB0aGUgc2NoZW1hIGZvciB0aGUgdHlwZSBzcGVjaWZpZWQgaW4gZWxlbWVudCdzIHhzaTp0eXBlIGF0dHJpYnV0ZS5cbiAgICBsZXQgeHNpVHlwZVNjaGVtYTtcbiAgICBsZXQgeHNpVHlwZSA9IGVsZW1lbnRBdHRyaWJ1dGVzWyd4c2k6dHlwZSddO1xuICAgIGlmICh4c2lUeXBlKSB7XG4gICAgICBsZXQgdHlwZSA9IHNwbGl0UU5hbWUoeHNpVHlwZSk7XG4gICAgICBsZXQgdHlwZVVSSTtcbiAgICAgIGlmICh0eXBlLnByZWZpeCA9PT0gVE5TX1BSRUZJWCkge1xuICAgICAgICAvLyBJbiBjYXNlIG9mIHhzaTp0eXBlID0gXCJNeVR5cGVcIlxuICAgICAgICB0eXBlVVJJID0geG1sbnNbdHlwZS5wcmVmaXhdIHx8IHhtbG5zLnhtbG5zO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHlwZVVSSSA9IHhtbG5zW3R5cGUucHJlZml4XTtcbiAgICAgIH1cbiAgICAgIGxldCB0eXBlRGVmID0gc2VsZi5maW5kU2NoZW1hT2JqZWN0KHR5cGVVUkksIHR5cGUubmFtZSk7XG4gICAgICBpZiAodHlwZURlZikge1xuICAgICAgICB4c2lUeXBlU2NoZW1hID0gdHlwZURlZi5kZXNjcmlwdGlvbihzZWxmLmRlZmluaXRpb25zKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodG9wU2NoZW1hICYmIHRvcFNjaGVtYVtuYW1lICsgJ1tdJ10pIHtcbiAgICAgIG5hbWUgPSBuYW1lICsgJ1tdJztcbiAgICB9XG4gICAgc3RhY2sucHVzaCh7XG4gICAgICBuYW1lOiBvcmlnaW5hbE5hbWUsXG4gICAgICBvYmplY3Q6IG9iaixcbiAgICAgIHNjaGVtYTogKHhzaVR5cGVTY2hlbWEgfHwgKHRvcFNjaGVtYSAmJiB0b3BTY2hlbWFbbmFtZV0pKSxcbiAgICAgIGlkOiBhdHRycy5pZCxcbiAgICAgIG5pbDogaGFzTmlsQXR0cmlidXRlXG4gICAgfSk7XG4gIH07XG5cbiAgcC5vbmNsb3NldGFnID0gZnVuY3Rpb24gKG5zTmFtZSkge1xuICAgIGxldCBjdXI6IGFueSA9IHN0YWNrLnBvcCgpLFxuICAgICAgb2JqID0gY3VyLm9iamVjdCxcbiAgICAgIHRvcCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdLFxuICAgICAgdG9wT2JqZWN0ID0gdG9wLm9iamVjdCxcbiAgICAgIHRvcFNjaGVtYSA9IHRvcC5zY2hlbWEsXG4gICAgICBuYW1lID0gc3BsaXRRTmFtZShuc05hbWUpLm5hbWU7XG5cbiAgICBpZiAodHlwZW9mIGN1ci5zY2hlbWEgPT09ICdzdHJpbmcnICYmIChjdXIuc2NoZW1hID09PSAnc3RyaW5nJyB8fCAoPHN0cmluZz5jdXIuc2NoZW1hKS5zcGxpdCgnOicpWzFdID09PSAnc3RyaW5nJykpIHtcbiAgICAgIGlmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA9PT0gMCkgb2JqID0gY3VyLm9iamVjdCA9ICcnO1xuICAgIH1cblxuICAgIGlmIChjdXIubmlsID09PSB0cnVlKSB7XG4gICAgICBpZiAoc2VsZi5vcHRpb25zLmhhbmRsZU5pbEFzTnVsbCkge1xuICAgICAgICBvYmogPSBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChfLmlzUGxhaW5PYmplY3Qob2JqKSAmJiAhT2JqZWN0LmtleXMob2JqKS5sZW5ndGgpIHtcbiAgICAgIG9iaiA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRvcFNjaGVtYSAmJiB0b3BTY2hlbWFbbmFtZSArICdbXSddKSB7XG4gICAgICBpZiAoIXRvcE9iamVjdFtuYW1lXSkge1xuICAgICAgICB0b3BPYmplY3RbbmFtZV0gPSBbXTtcbiAgICAgIH1cbiAgICAgIHRvcE9iamVjdFtuYW1lXS5wdXNoKG9iaik7XG4gICAgfSBlbHNlIGlmIChuYW1lIGluIHRvcE9iamVjdCkge1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHRvcE9iamVjdFtuYW1lXSkpIHtcbiAgICAgICAgdG9wT2JqZWN0W25hbWVdID0gW3RvcE9iamVjdFtuYW1lXV07XG4gICAgICB9XG4gICAgICB0b3BPYmplY3RbbmFtZV0ucHVzaChvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB0b3BPYmplY3RbbmFtZV0gPSBvYmo7XG4gICAgfVxuXG4gICAgaWYgKGN1ci5pZCkge1xuICAgICAgcmVmc1tjdXIuaWRdLm9iaiA9IG9iajtcbiAgICB9XG4gIH07XG5cbiAgcC5vbmNkYXRhID0gZnVuY3Rpb24gKHRleHQpIHtcbiAgICBsZXQgb3JpZ2luYWxUZXh0ID0gdGV4dDtcbiAgICB0ZXh0ID0gdHJpbSh0ZXh0KTtcbiAgICBpZiAoIXRleHQubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKC88XFw/eG1sW1xcc1xcU10rXFw/Pi8udGVzdCh0ZXh0KSkge1xuICAgICAgbGV0IHRvcCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgICAgbGV0IHZhbHVlID0gc2VsZi54bWxUb09iamVjdCh0ZXh0KTtcbiAgICAgIGlmICh0b3Aub2JqZWN0W3NlbGYub3B0aW9ucy5hdHRyaWJ1dGVzS2V5XSkge1xuICAgICAgICB0b3Aub2JqZWN0W3NlbGYub3B0aW9ucy52YWx1ZUtleV0gPSB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRvcC5vYmplY3QgPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcC5vbnRleHQob3JpZ2luYWxUZXh0KTtcbiAgICB9XG4gIH07XG5cbiAgcC5vbmVycm9yID0gZnVuY3Rpb24gKGUpIHtcbiAgICBwLnJlc3VtZSgpO1xuICAgIHRocm93IHtcbiAgICAgIEZhdWx0OiB7XG4gICAgICAgIGZhdWx0Y29kZTogNTAwLFxuICAgICAgICBmYXVsdHN0cmluZzogJ0ludmFsaWQgWE1MJyxcbiAgICAgICAgZGV0YWlsOiBuZXcgRXJyb3IoZSkubWVzc2FnZSxcbiAgICAgICAgc3RhdHVzQ29kZTogNTAwXG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICBwLm9udGV4dCA9IGZ1bmN0aW9uICh0ZXh0KSB7XG4gICAgbGV0IG9yaWdpbmFsVGV4dCA9IHRleHQ7XG4gICAgdGV4dCA9IHRyaW0odGV4dCk7XG4gICAgaWYgKCF0ZXh0Lmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCB0b3AgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICBsZXQgbmFtZSA9IHNwbGl0UU5hbWUodG9wLnNjaGVtYSkubmFtZSxcbiAgICAgIHZhbHVlO1xuICAgIGlmIChzZWxmLm9wdGlvbnMgJiYgc2VsZi5vcHRpb25zLmN1c3RvbURlc2VyaWFsaXplciAmJiBzZWxmLm9wdGlvbnMuY3VzdG9tRGVzZXJpYWxpemVyW25hbWVdKSB7XG4gICAgICB2YWx1ZSA9IHNlbGYub3B0aW9ucy5jdXN0b21EZXNlcmlhbGl6ZXJbbmFtZV0odGV4dCwgdG9wKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpZiAobmFtZSA9PT0gJ2ludCcgfHwgbmFtZSA9PT0gJ2ludGVnZXInKSB7XG4gICAgICAgIHZhbHVlID0gcGFyc2VJbnQodGV4dCwgMTApO1xuICAgICAgfSBlbHNlIGlmIChuYW1lID09PSAnYm9vbCcgfHwgbmFtZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHZhbHVlID0gdGV4dC50b0xvd2VyQ2FzZSgpID09PSAndHJ1ZScgfHwgdGV4dCA9PT0gJzEnO1xuICAgICAgfSBlbHNlIGlmIChuYW1lID09PSAnZGF0ZVRpbWUnIHx8IG5hbWUgPT09ICdkYXRlJykge1xuICAgICAgICB2YWx1ZSA9IG5ldyBEYXRlKHRleHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5wcmVzZXJ2ZVdoaXRlc3BhY2UpIHtcbiAgICAgICAgICB0ZXh0ID0gb3JpZ2luYWxUZXh0O1xuICAgICAgICB9XG4gICAgICAgIC8vIGhhbmRsZSBzdHJpbmcgb3Igb3RoZXIgdHlwZXNcbiAgICAgICAgaWYgKHR5cGVvZiB0b3Aub2JqZWN0ICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIHZhbHVlID0gdGV4dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IHRvcC5vYmplY3QgKyB0ZXh0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRvcC5vYmplY3Rbc2VsZi5vcHRpb25zLmF0dHJpYnV0ZXNLZXldKSB7XG4gICAgICB0b3Aub2JqZWN0W3NlbGYub3B0aW9ucy52YWx1ZUtleV0gPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdG9wLm9iamVjdCA9IHZhbHVlO1xuICAgIH1cbiAgfTtcblxuICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gd2UgYmUgc3RyZWFtaW5nXG4gICAgbGV0IHNheFN0cmVhbSA9IHNheC5jcmVhdGVTdHJlYW0odHJ1ZSk7XG4gICAgc2F4U3RyZWFtLm9uKCdvcGVudGFnJywgcC5vbm9wZW50YWcpO1xuICAgIHNheFN0cmVhbS5vbignY2xvc2V0YWcnLCBwLm9uY2xvc2V0YWcpO1xuICAgIHNheFN0cmVhbS5vbignY2RhdGEnLCBwLm9uY2RhdGEpO1xuICAgIHNheFN0cmVhbS5vbigndGV4dCcsIHAub250ZXh0KTtcbiAgICB4bWwucGlwZShzYXhTdHJlYW0pXG4gICAgICAub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgfSlcbiAgICAgIC5vbignZW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgcjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByID0gZmluaXNoKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZSk7XG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcik7XG4gICAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cbiAgcC53cml0ZSh4bWwpLmNsb3NlKCk7XG5cbiAgcmV0dXJuIGZpbmlzaCgpO1xuXG4gIGZ1bmN0aW9uIGZpbmlzaCgpIHtcbiAgICAvLyBNdWx0aVJlZiBzdXBwb3J0OiBtZXJnZSBvYmplY3RzIGluc3RlYWQgb2YgcmVwbGFjaW5nXG4gICAgZm9yIChsZXQgbiBpbiByZWZzKSB7XG4gICAgICBsZXQgcmVmID0gcmVmc1tuXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVmLmhyZWZzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIF8uYXNzaWduKHJlZi5ocmVmc1tpXS5vYmosIHJlZi5vYmopO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyb290LkVudmVsb3BlKSB7XG4gICAgICBsZXQgYm9keSA9IHJvb3QuRW52ZWxvcGUuQm9keTtcbiAgICAgIGxldCBlcnJvcjogYW55O1xuICAgIFxuICAgICAgaWYgKGJvZHkgJiYgYm9keS5GYXVsdCkge1xuICAgICAgICBcbiAgICAgICAgaWYoIWJvZHkuRmF1bHQuQ29kZSl7XG4gICAgICAgIGxldCBjb2RlID0gYm9keS5GYXVsdC5mYXVsdGNvZGUgJiYgYm9keS5GYXVsdC5mYXVsdGNvZGUuJHZhbHVlO1xuICAgICAgICBsZXQgc3RyaW5nID0gYm9keS5GYXVsdC5mYXVsdHN0cmluZyAmJiBib2R5LkZhdWx0LmZhdWx0c3RyaW5nLiR2YWx1ZTtcbiAgICAgICAgbGV0IGRldGFpbCA9IGJvZHkuRmF1bHQuZGV0YWlsICYmIGJvZHkuRmF1bHQuZGV0YWlsLiR2YWx1ZTtcblxuICAgICAgICBjb2RlID0gY29kZSB8fCBib2R5LkZhdWx0LmZhdWx0Y29kZTtcbiAgICAgICAgc3RyaW5nID0gc3RyaW5nIHx8IGJvZHkuRmF1bHQuZmF1bHRzdHJpbmc7XG4gICAgICAgIGRldGFpbCA9IGRldGFpbCB8fCBib2R5LkZhdWx0LmRldGFpbDtcblxuICAgICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoY29kZSArICc6ICcgKyBzdHJpbmcgKyAoZGV0YWlsID8gJzogJyArIGRldGFpbCA6ICcnKSk7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICBsZXQgY29kZSA9IGJvZHkuRmF1bHQuQ29kZS5WYWx1ZTtcbiAgICAgICAgICBsZXQgc3RyaW5nID0gYm9keS5GYXVsdC5SZWFzb24uVGV4dC4kdmFsdWU7XG4gICAgICAgICAgbGV0IGRldGFpbCA9IGJvZHkuRmF1bHQuRGV0YWlsLmluZm87XG4gICAgICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoY29kZSArICc6ICcgKyBzdHJpbmcgKyAoZGV0YWlsID8gJzogJyArIGRldGFpbCA6ICcnKSk7IFxuXG4gICAgICAgIH1cblxuICAgICAgICBlcnJvci5yb290ID0gcm9vdDtcbiAgICAgICAgdGhyb3cgYm9keS5GYXVsdDtcbiAgICAgIH1cbiAgICAgIHJldHVybiByb290LkVudmVsb3BlO1xuICAgIH1cbiAgICByZXR1cm4gcm9vdDtcbiAgfVxufTtcblxuLyoqXG4gKiBMb29rIHVwIGEgWFNEIHR5cGUgb3IgZWxlbWVudCBieSBuYW1lc3BhY2UgVVJJIGFuZCBuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gbnNVUkkgTmFtZXNwYWNlIFVSSVxuICogQHBhcmFtIHtTdHJpbmd9IHFuYW1lIExvY2FsIG9yIHF1YWxpZmllZCBuYW1lXG4gKiBAcmV0dXJucyB7Kn0gVGhlIFhTRCB0eXBlL2VsZW1lbnQgZGVmaW5pdGlvblxuICovXG5XU0RMLnByb3RvdHlwZS5maW5kU2NoZW1hT2JqZWN0ID0gZnVuY3Rpb24gKG5zVVJJLCBxbmFtZSkge1xuICBpZiAoIW5zVVJJIHx8ICFxbmFtZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbGV0IGRlZiA9IG51bGw7XG5cbiAgaWYgKHRoaXMuZGVmaW5pdGlvbnMuc2NoZW1hcykge1xuICAgIGxldCBzY2hlbWEgPSB0aGlzLmRlZmluaXRpb25zLnNjaGVtYXNbbnNVUkldO1xuICAgIGlmIChzY2hlbWEpIHtcbiAgICAgIGlmIChxbmFtZS5pbmRleE9mKCc6JykgIT09IC0xKSB7XG4gICAgICAgIHFuYW1lID0gcW5hbWUuc3Vic3RyaW5nKHFuYW1lLmluZGV4T2YoJzonKSArIDEsIHFuYW1lLmxlbmd0aCk7XG4gICAgICB9XG5cbiAgICAgIC8vIGlmIHRoZSBjbGllbnQgcGFzc2VkIGFuIGlucHV0IGVsZW1lbnQgd2hpY2ggaGFzIGEgYCRsb29rdXBUeXBlYCBwcm9wZXJ0eSBpbnN0ZWFkIG9mIGAkdHlwZWBcbiAgICAgIC8vIHRoZSBgZGVmYCBpcyBmb3VuZCBpbiBgc2NoZW1hLmVsZW1lbnRzYC5cbiAgICAgIGRlZiA9IHNjaGVtYS5jb21wbGV4VHlwZXNbcW5hbWVdIHx8IHNjaGVtYS50eXBlc1txbmFtZV0gfHwgc2NoZW1hLmVsZW1lbnRzW3FuYW1lXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGVmO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgZG9jdW1lbnQgc3R5bGUgeG1sIHN0cmluZyBmcm9tIHRoZSBwYXJhbWV0ZXJzXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHBhcmFtIHsqfSBwYXJhbXNcbiAqIEBwYXJhbSB7U3RyaW5nfSBuc1ByZWZpeFxuICogQHBhcmFtIHtTdHJpbmd9IG5zVVJJXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICovXG5XU0RMLnByb3RvdHlwZS5vYmplY3RUb0RvY3VtZW50WE1MID0gZnVuY3Rpb24gKG5hbWUsIHBhcmFtcywgbnNQcmVmaXgsIG5zVVJJLCB0eXBlKSB7XG4gIC8vSWYgdXNlciBzdXBwbGllcyBYTUwgYWxyZWFkeSwganVzdCB1c2UgdGhhdC4gIFhNTCBEZWNsYXJhdGlvbiBzaG91bGQgbm90IGJlIHByZXNlbnQuXG4gIGlmIChwYXJhbXMgJiYgcGFyYW1zLl94bWwpIHtcbiAgICByZXR1cm4gcGFyYW1zLl94bWw7XG4gIH1cbiAgbGV0IGFyZ3MgPSB7fTtcbiAgYXJnc1tuYW1lXSA9IHBhcmFtcztcbiAgbGV0IHBhcmFtZXRlclR5cGVPYmogPSB0eXBlID8gdGhpcy5maW5kU2NoZW1hT2JqZWN0KG5zVVJJLCB0eXBlKSA6IG51bGw7XG4gIHJldHVybiB0aGlzLm9iamVjdFRvWE1MKGFyZ3MsIG51bGwsIG5zUHJlZml4LCBuc1VSSSwgdHJ1ZSwgbnVsbCwgcGFyYW1ldGVyVHlwZU9iaik7XG59O1xuXG4vKipcbiAqIENyZWF0ZSBSUEMgc3R5bGUgeG1sIHN0cmluZyBmcm9tIHRoZSBwYXJhbWV0ZXJzXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHBhcmFtIHsqfSBwYXJhbXNcbiAqIEBwYXJhbSB7U3RyaW5nfSBuc1ByZWZpeFxuICogQHBhcmFtIHtTdHJpbmd9IG5zVVJJXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5XU0RMLnByb3RvdHlwZS5vYmplY3RUb1JwY1hNTCA9IGZ1bmN0aW9uIChuYW1lLCBwYXJhbXMsIG5zUHJlZml4LCBuc1VSSSwgaXNQYXJ0cykge1xuICBsZXQgcGFydHMgPSBbXTtcbiAgbGV0IGRlZnMgPSB0aGlzLmRlZmluaXRpb25zO1xuICBsZXQgbnNBdHRyTmFtZSA9ICdfeG1sbnMnO1xuXG4gIG5zUHJlZml4ID0gbnNQcmVmaXggfHwgZmluZFByZWZpeChkZWZzLnhtbG5zLCBuc1VSSSk7XG5cbiAgbnNVUkkgPSBuc1VSSSB8fCBkZWZzLnhtbG5zW25zUHJlZml4XTtcbiAgbnNQcmVmaXggPSBuc1ByZWZpeCA9PT0gVE5TX1BSRUZJWCA/ICcnIDogKG5zUHJlZml4ICsgJzonKTtcblxuICBwYXJ0cy5wdXNoKFsnPCcsIG5zUHJlZml4LCBuYW1lLCAnPiddLmpvaW4oJycpKTtcblxuICBmb3IgKGxldCBrZXkgaW4gcGFyYW1zKSB7XG4gICAgaWYgKCFwYXJhbXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChrZXkgIT09IG5zQXR0ck5hbWUpIHtcbiAgICAgIGxldCB2YWx1ZSA9IHBhcmFtc1trZXldO1xuICAgICAgbGV0IHByZWZpeGVkS2V5ID0gKGlzUGFydHMgPyAnJyA6IG5zUHJlZml4KSArIGtleTtcbiAgICAgIGxldCBhdHRyaWJ1dGVzID0gW107XG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZS5oYXNPd25Qcm9wZXJ0eSh0aGlzLm9wdGlvbnMuYXR0cmlidXRlc0tleSkpIHtcbiAgICAgICAgbGV0IGF0dHJzID0gdmFsdWVbdGhpcy5vcHRpb25zLmF0dHJpYnV0ZXNLZXldO1xuICAgICAgICBmb3IgKGxldCBuIGluIGF0dHJzKSB7XG4gICAgICAgICAgYXR0cmlidXRlcy5wdXNoKCcgJyArIG4gKyAnPScgKyAnXCInICsgYXR0cnNbbl0gKyAnXCInKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcGFydHMucHVzaChbJzwnLCBwcmVmaXhlZEtleV0uY29uY2F0KGF0dHJpYnV0ZXMpLmNvbmNhdCgnPicpLmpvaW4oJycpKTtcbiAgICAgIHBhcnRzLnB1c2goKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpID8gdGhpcy5vYmplY3RUb1hNTCh2YWx1ZSwga2V5LCBuc1ByZWZpeCwgbnNVUkkpIDogeG1sRXNjYXBlKHZhbHVlKSk7XG4gICAgICBwYXJ0cy5wdXNoKFsnPC8nLCBwcmVmaXhlZEtleSwgJz4nXS5qb2luKCcnKSk7XG4gICAgfVxuICB9XG4gIHBhcnRzLnB1c2goWyc8LycsIG5zUHJlZml4LCBuYW1lLCAnPiddLmpvaW4oJycpKTtcbiAgcmV0dXJuIHBhcnRzLmpvaW4oJycpO1xufTtcblxuXG5mdW5jdGlvbiBhcHBlbmRDb2xvbihucykge1xuICByZXR1cm4gKG5zICYmIG5zLmNoYXJBdChucy5sZW5ndGggLSAxKSAhPT0gJzonKSA/IG5zICsgJzonIDogbnM7XG59XG5cbmZ1bmN0aW9uIG5vQ29sb25OYW1lU3BhY2UobnMpIHtcbiAgcmV0dXJuIChucyAmJiBucy5jaGFyQXQobnMubGVuZ3RoIC0gMSkgPT09ICc6JykgPyBucy5zdWJzdHJpbmcoMCwgbnMubGVuZ3RoIC0gMSkgOiBucztcbn1cblxuV1NETC5wcm90b3R5cGUuaXNJZ25vcmVkTmFtZVNwYWNlID0gZnVuY3Rpb24gKG5zKSB7XG4gIHJldHVybiB0aGlzLm9wdGlvbnMuaWdub3JlZE5hbWVzcGFjZXMuaW5kZXhPZihucykgPiAtMTtcbn07XG5cbldTREwucHJvdG90eXBlLmZpbHRlck91dElnbm9yZWROYW1lU3BhY2UgPSBmdW5jdGlvbiAobnMpIHtcbiAgbGV0IG5hbWVzcGFjZSA9IG5vQ29sb25OYW1lU3BhY2UobnMpO1xuICByZXR1cm4gdGhpcy5pc0lnbm9yZWROYW1lU3BhY2UobmFtZXNwYWNlKSA/ICcnIDogbmFtZXNwYWNlO1xufTtcblxuXG5cbi8qKlxuICogQ29udmVydCBhbiBvYmplY3QgdG8gWE1MLiAgVGhpcyBpcyBhIHJlY3Vyc2l2ZSBtZXRob2QgYXMgaXQgY2FsbHMgaXRzZWxmLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogdGhlIG9iamVjdCB0byBjb252ZXJ0LlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgdGhlIG5hbWUgb2YgdGhlIGVsZW1lbnQgKGlmIHRoZSBvYmplY3QgYmVpbmcgdHJhdmVyc2VkIGlzXG4gKiBhbiBlbGVtZW50KS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBuc1ByZWZpeCB0aGUgbmFtZXNwYWNlIHByZWZpeCBvZiB0aGUgb2JqZWN0IEkuRS4geHNkLlxuICogQHBhcmFtIHtTdHJpbmd9IG5zVVJJIHRoZSBmdWxsIG5hbWVzcGFjZSBvZiB0aGUgb2JqZWN0IEkuRS4gaHR0cDovL3czLm9yZy9zY2hlbWEuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlzRmlyc3Qgd2hldGhlciBvciBub3QgdGhpcyBpcyB0aGUgZmlyc3QgaXRlbSBiZWluZyB0cmF2ZXJzZWQuXG4gKiBAcGFyYW0gez99IHhtbG5zQXR0clxuICogQHBhcmFtIHs/fSBwYXJhbWV0ZXJUeXBlT2JqZWN0XG4gKiBAcGFyYW0ge05hbWVzcGFjZUNvbnRleHR9IG5zQ29udGV4dCBOYW1lc3BhY2UgY29udGV4dFxuICovXG5XU0RMLnByb3RvdHlwZS5vYmplY3RUb1hNTCA9IGZ1bmN0aW9uIChvYmosIG5hbWUsIG5zUHJlZml4LCBuc1VSSSwgaXNGaXJzdCwgeG1sbnNBdHRyLCBzY2hlbWFPYmplY3QsIG5zQ29udGV4dCkge1xuICBsZXQgc2VsZiA9IHRoaXM7XG4gIGxldCBzY2hlbWEgPSB0aGlzLmRlZmluaXRpb25zLnNjaGVtYXNbbnNVUkldO1xuXG4gIGxldCBwYXJlbnROc1ByZWZpeCA9IG5zUHJlZml4ID8gbnNQcmVmaXgucGFyZW50IDogdW5kZWZpbmVkO1xuICBpZiAodHlwZW9mIHBhcmVudE5zUHJlZml4ICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vd2UgZ290IHRoZSBwYXJlbnROc1ByZWZpeCBmb3Igb3VyIGFycmF5LiBzZXR0aW5nIHRoZSBuYW1lc3BhY2UtbGV0aWFibGUgYmFjayB0byB0aGUgY3VycmVudCBuYW1lc3BhY2Ugc3RyaW5nXG4gICAgbnNQcmVmaXggPSBuc1ByZWZpeC5jdXJyZW50O1xuICB9XG5cbiAgcGFyZW50TnNQcmVmaXggPSBub0NvbG9uTmFtZVNwYWNlKHBhcmVudE5zUHJlZml4KTtcbiAgaWYgKHRoaXMuaXNJZ25vcmVkTmFtZVNwYWNlKHBhcmVudE5zUHJlZml4KSkge1xuICAgIHBhcmVudE5zUHJlZml4ID0gJyc7XG4gIH1cblxuICBsZXQgc29hcEhlYWRlciA9ICFzY2hlbWE7XG4gIGxldCBxdWFsaWZpZWQgPSBzY2hlbWEgJiYgc2NoZW1hLiRlbGVtZW50Rm9ybURlZmF1bHQgPT09ICdxdWFsaWZpZWQnO1xuICBsZXQgcGFydHMgPSBbXTtcbiAgbGV0IHByZWZpeE5hbWVzcGFjZSA9IChuc1ByZWZpeCB8fCBxdWFsaWZpZWQpICYmIG5zUHJlZml4ICE9PSBUTlNfUFJFRklYO1xuXG4gIGxldCB4bWxuc0F0dHJpYiA9ICcnO1xuICBpZiAobnNVUkkgJiYgaXNGaXJzdCkge1xuICAgIGlmIChzZWxmLm9wdGlvbnMub3ZlcnJpZGVSb290RWxlbWVudCAmJiBzZWxmLm9wdGlvbnMub3ZlcnJpZGVSb290RWxlbWVudC54bWxuc0F0dHJpYnV0ZXMpIHtcbiAgICAgIHNlbGYub3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50LnhtbG5zQXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgeG1sbnNBdHRyaWIgKz0gJyAnICsgYXR0cmlidXRlLm5hbWUgKyAnPVwiJyArIGF0dHJpYnV0ZS52YWx1ZSArICdcIic7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHByZWZpeE5hbWVzcGFjZSAmJiAhdGhpcy5pc0lnbm9yZWROYW1lU3BhY2UobnNQcmVmaXgpKSB7XG4gICAgICAgIC8vIHJlc29sdmUgdGhlIHByZWZpeCBuYW1lc3BhY2VcbiAgICAgICAgeG1sbnNBdHRyaWIgKz0gJyB4bWxuczonICsgbnNQcmVmaXggKyAnPVwiJyArIG5zVVJJICsgJ1wiJztcbiAgICAgIH1cbiAgICAgIC8vIG9ubHkgYWRkIGRlZmF1bHQgbmFtZXNwYWNlIGlmIHRoZSBzY2hlbWEgZWxlbWVudEZvcm1EZWZhdWx0IGlzIHF1YWxpZmllZFxuICAgICAgaWYgKHF1YWxpZmllZCB8fCBzb2FwSGVhZGVyKSB4bWxuc0F0dHJpYiArPSAnIHhtbG5zPVwiJyArIG5zVVJJICsgJ1wiJztcbiAgICB9XG4gIH1cblxuICBpZiAoIW5zQ29udGV4dCkge1xuICAgIG5zQ29udGV4dCA9IG5ldyBOYW1lc3BhY2VDb250ZXh0KCk7XG4gICAgbnNDb250ZXh0LmRlY2xhcmVOYW1lc3BhY2UobnNQcmVmaXgsIG5zVVJJKTtcbiAgfSBlbHNlIHtcbiAgICBuc0NvbnRleHQucHVzaENvbnRleHQoKTtcbiAgfVxuXG4gIC8vIGV4cGxpY2l0bHkgdXNlIHhtbG5zIGF0dHJpYnV0ZSBpZiBhdmFpbGFibGVcbiAgaWYgKHhtbG5zQXR0ciAmJiAhKHNlbGYub3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50ICYmIHNlbGYub3B0aW9ucy5vdmVycmlkZVJvb3RFbGVtZW50LnhtbG5zQXR0cmlidXRlcykpIHtcbiAgICB4bWxuc0F0dHJpYiA9IHhtbG5zQXR0cjtcbiAgfVxuXG4gIGxldCBucyA9ICcnO1xuXG4gIGlmIChzZWxmLm9wdGlvbnMub3ZlcnJpZGVSb290RWxlbWVudCAmJiBpc0ZpcnN0KSB7XG4gICAgbnMgPSBzZWxmLm9wdGlvbnMub3ZlcnJpZGVSb290RWxlbWVudC5uYW1lc3BhY2U7XG4gIH0gZWxzZSBpZiAocHJlZml4TmFtZXNwYWNlICYmIChxdWFsaWZpZWQgfHwgaXNGaXJzdCB8fCBzb2FwSGVhZGVyKSAmJiAhdGhpcy5pc0lnbm9yZWROYW1lU3BhY2UobnNQcmVmaXgpKSB7XG4gICAgbnMgPSBuc1ByZWZpeDtcbiAgfVxuXG4gIGxldCBpLCBuO1xuICAvLyBzdGFydCBidWlsZGluZyBvdXQgWE1MIHN0cmluZy5cbiAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgIGZvciAoaSA9IDAsIG4gPSBvYmoubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICBsZXQgaXRlbSA9IG9ialtpXTtcbiAgICAgIGxldCBhcnJheUF0dHIgPSBzZWxmLnByb2Nlc3NBdHRyaWJ1dGVzKGl0ZW0sIG5zQ29udGV4dCksXG4gICAgICAgIGNvcnJlY3RPdXRlck5zUHJlZml4ID0gcGFyZW50TnNQcmVmaXggfHwgbnM7IC8vdXNpbmcgdGhlIHBhcmVudCBuYW1lc3BhY2UgcHJlZml4IGlmIGdpdmVuXG5cbiAgICAgIGxldCBib2R5ID0gc2VsZi5vYmplY3RUb1hNTChpdGVtLCBuYW1lLCBuc1ByZWZpeCwgbnNVUkksIGZhbHNlLCBudWxsLCBzY2hlbWFPYmplY3QsIG5zQ29udGV4dCk7XG5cbiAgICAgIGxldCBvcGVuaW5nVGFnUGFydHMgPSBbJzwnLCBhcHBlbmRDb2xvbihjb3JyZWN0T3V0ZXJOc1ByZWZpeCksIG5hbWUsIGFycmF5QXR0ciwgeG1sbnNBdHRyaWJdO1xuXG4gICAgICBpZiAoYm9keSA9PT0gJycgJiYgc2VsZi5vcHRpb25zLnVzZUVtcHR5VGFnKSB7XG4gICAgICAgIC8vIFVzZSBlbXB0eSAoc2VsZi1jbG9zaW5nKSB0YWdzIGlmIG5vIGNvbnRlbnRzXG4gICAgICAgIG9wZW5pbmdUYWdQYXJ0cy5wdXNoKCcgLz4nKTtcbiAgICAgICAgcGFydHMucHVzaChvcGVuaW5nVGFnUGFydHMuam9pbignJykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3BlbmluZ1RhZ1BhcnRzLnB1c2goJz4nKTtcbiAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5uYW1lc3BhY2VBcnJheUVsZW1lbnRzIHx8IGkgPT09IDApIHtcbiAgICAgICAgICBwYXJ0cy5wdXNoKG9wZW5pbmdUYWdQYXJ0cy5qb2luKCcnKSk7XG4gICAgICAgIH1cbiAgICAgICAgcGFydHMucHVzaChib2R5KTtcbiAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5uYW1lc3BhY2VBcnJheUVsZW1lbnRzIHx8IGkgPT09IG4gLSAxKSB7XG4gICAgICAgICAgcGFydHMucHVzaChbJzwvJywgYXBwZW5kQ29sb24oY29ycmVjdE91dGVyTnNQcmVmaXgpLCBuYW1lLCAnPiddLmpvaW4oJycpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jykge1xuICAgIGZvciAobmFtZSBpbiBvYmopIHtcbiAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KG5hbWUpKSBjb250aW51ZTtcbiAgICAgIC8vZG9uJ3QgcHJvY2VzcyBhdHRyaWJ1dGVzIGFzIGVsZW1lbnRcbiAgICAgIGlmIChuYW1lID09PSBzZWxmLm9wdGlvbnMuYXR0cmlidXRlc0tleSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIC8vSXRzIHRoZSB2YWx1ZSBvZiBhIHhtbCBvYmplY3QuIFJldHVybiBpdCBkaXJlY3RseS5cbiAgICAgIGlmIChuYW1lID09PSBzZWxmLm9wdGlvbnMueG1sS2V5KSB7XG4gICAgICAgIG5zQ29udGV4dC5wb3BDb250ZXh0KCk7XG4gICAgICAgIHJldHVybiBvYmpbbmFtZV07XG4gICAgICB9XG4gICAgICAvL0l0cyB0aGUgdmFsdWUgb2YgYW4gaXRlbS4gUmV0dXJuIGl0IGRpcmVjdGx5LlxuICAgICAgaWYgKG5hbWUgPT09IHNlbGYub3B0aW9ucy52YWx1ZUtleSkge1xuICAgICAgICBuc0NvbnRleHQucG9wQ29udGV4dCgpO1xuICAgICAgICByZXR1cm4geG1sRXNjYXBlKG9ialtuYW1lXSk7XG4gICAgICB9XG5cbiAgICAgIGxldCBjaGlsZCA9IG9ialtuYW1lXTtcbiAgICAgIGlmICh0eXBlb2YgY2hpbGQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgYXR0ciA9IHNlbGYucHJvY2Vzc0F0dHJpYnV0ZXMoY2hpbGQsIG5zQ29udGV4dCk7XG5cbiAgICAgIGxldCB2YWx1ZSA9ICcnO1xuICAgICAgbGV0IG5vblN1Yk5hbWVTcGFjZSA9ICcnO1xuICAgICAgbGV0IGVtcHR5Tm9uU3ViTmFtZVNwYWNlID0gZmFsc2U7XG5cbiAgICAgIGxldCBuYW1lV2l0aE5zUmVnZXggPSAvXihbXjpdKyk6KFteOl0rKSQvLmV4ZWMobmFtZSk7XG4gICAgICBpZiAobmFtZVdpdGhOc1JlZ2V4KSB7XG4gICAgICAgIG5vblN1Yk5hbWVTcGFjZSA9IG5hbWVXaXRoTnNSZWdleFsxXSArICc6JztcbiAgICAgICAgbmFtZSA9IG5hbWVXaXRoTnNSZWdleFsyXTtcbiAgICAgIH0gZWxzZSBpZiAobmFtZVswXSA9PT0gJzonKSB7XG4gICAgICAgIGVtcHR5Tm9uU3ViTmFtZVNwYWNlID0gdHJ1ZTtcbiAgICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNGaXJzdCkge1xuICAgICAgICB2YWx1ZSA9IHNlbGYub2JqZWN0VG9YTUwoY2hpbGQsIG5hbWUsIG5zUHJlZml4LCBuc1VSSSwgZmFsc2UsIG51bGwsIHNjaGVtYU9iamVjdCwgbnNDb250ZXh0KTtcbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgaWYgKHNlbGYuZGVmaW5pdGlvbnMuc2NoZW1hcykge1xuICAgICAgICAgIGlmIChzY2hlbWEpIHtcbiAgICAgICAgICAgIGxldCBjaGlsZFNjaGVtYU9iamVjdCA9IHNlbGYuZmluZENoaWxkU2NoZW1hT2JqZWN0KHNjaGVtYU9iamVjdCwgbmFtZSk7XG4gICAgICAgICAgICAvL2ZpbmQgc3ViIG5hbWVzcGFjZSBpZiBub3QgYSBwcmltaXRpdmVcbiAgICAgICAgICAgIGlmIChjaGlsZFNjaGVtYU9iamVjdCAmJlxuICAgICAgICAgICAgICAoKGNoaWxkU2NoZW1hT2JqZWN0LiR0eXBlICYmIChjaGlsZFNjaGVtYU9iamVjdC4kdHlwZS5pbmRleE9mKCd4c2Q6JykgPT09IC0xKSkgfHxcbiAgICAgICAgICAgICAgICBjaGlsZFNjaGVtYU9iamVjdC4kcmVmIHx8IGNoaWxkU2NoZW1hT2JqZWN0LiRuYW1lKSkge1xuICAgICAgICAgICAgICAvKmlmIHRoZSBiYXNlIG5hbWUgc3BhY2Ugb2YgdGhlIGNoaWxkcmVuIGlzIG5vdCBpbiB0aGUgaW5nb3JlZFNjaGVtYU5hbXNwYWNlcyB3ZSB1c2UgaXQuXG4gICAgICAgICAgICAgICBUaGlzIGlzIGJlY2F1c2UgaW4gc29tZSBzZXJ2aWNlcyB0aGUgY2hpbGQgbm9kZXMgZG8gbm90IG5lZWQgdGhlIGJhc2VOYW1lU3BhY2UuXG4gICAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAgIGxldCBjaGlsZE5zUHJlZml4OiBhbnkgPSAnJztcbiAgICAgICAgICAgICAgbGV0IGNoaWxkTmFtZSA9ICcnO1xuICAgICAgICAgICAgICBsZXQgY2hpbGROc1VSSTtcbiAgICAgICAgICAgICAgbGV0IGNoaWxkWG1sbnNBdHRyaWIgPSAnJztcblxuICAgICAgICAgICAgICBsZXQgZWxlbWVudFFOYW1lID0gY2hpbGRTY2hlbWFPYmplY3QuJHJlZiB8fCBjaGlsZFNjaGVtYU9iamVjdC4kbmFtZTtcbiAgICAgICAgICAgICAgaWYgKGVsZW1lbnRRTmFtZSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRRTmFtZSA9IHNwbGl0UU5hbWUoZWxlbWVudFFOYW1lKTtcbiAgICAgICAgICAgICAgICBjaGlsZE5hbWUgPSBlbGVtZW50UU5hbWUubmFtZTtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudFFOYW1lLnByZWZpeCA9PT0gVE5TX1BSRUZJWCkge1xuICAgICAgICAgICAgICAgICAgLy8gTG9jYWwgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgY2hpbGROc1VSSSA9IGNoaWxkU2NoZW1hT2JqZWN0LiR0YXJnZXROYW1lc3BhY2U7XG4gICAgICAgICAgICAgICAgICBjaGlsZE5zUHJlZml4ID0gbnNDb250ZXh0LnJlZ2lzdGVyTmFtZXNwYWNlKGNoaWxkTnNVUkkpO1xuICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNJZ25vcmVkTmFtZVNwYWNlKGNoaWxkTnNQcmVmaXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkTnNQcmVmaXggPSBuc1ByZWZpeDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgY2hpbGROc1ByZWZpeCA9IGVsZW1lbnRRTmFtZS5wcmVmaXg7XG4gICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0lnbm9yZWROYW1lU3BhY2UoY2hpbGROc1ByZWZpeCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGROc1ByZWZpeCA9IG5zUHJlZml4O1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgY2hpbGROc1VSSSA9IHNjaGVtYS54bWxuc1tjaGlsZE5zUHJlZml4XSB8fCBzZWxmLmRlZmluaXRpb25zLnhtbG5zW2NoaWxkTnNQcmVmaXhdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCB1bnF1YWxpZmllZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIC8vIENoZWNrIHF1YWxpZmljYXRpb24gZm9ybSBmb3IgbG9jYWwgZWxlbWVudHNcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGRTY2hlbWFPYmplY3QuJG5hbWUgJiYgY2hpbGRTY2hlbWFPYmplY3QudGFyZ2V0TmFtZXNwYWNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChjaGlsZFNjaGVtYU9iamVjdC4kZm9ybSA9PT0gJ3VucXVhbGlmaWVkJykge1xuICAgICAgICAgICAgICAgICAgICB1bnF1YWxpZmllZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkU2NoZW1hT2JqZWN0LiRmb3JtID09PSAncXVhbGlmaWVkJykge1xuICAgICAgICAgICAgICAgICAgICB1bnF1YWxpZmllZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdW5xdWFsaWZpZWQgPSBzY2hlbWEuJGVsZW1lbnRGb3JtRGVmYXVsdCAhPT0gJ3F1YWxpZmllZCc7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh1bnF1YWxpZmllZCkge1xuICAgICAgICAgICAgICAgICAgY2hpbGROc1ByZWZpeCA9ICcnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChjaGlsZE5zVVJJICYmIGNoaWxkTnNQcmVmaXgpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChuc0NvbnRleHQuZGVjbGFyZU5hbWVzcGFjZShjaGlsZE5zUHJlZml4LCBjaGlsZE5zVVJJKSkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZFhtbG5zQXR0cmliID0gJyB4bWxuczonICsgY2hpbGROc1ByZWZpeCArICc9XCInICsgY2hpbGROc1VSSSArICdcIic7XG4gICAgICAgICAgICAgICAgICAgIHhtbG5zQXR0cmliICs9IGNoaWxkWG1sbnNBdHRyaWI7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgbGV0IHJlc29sdmVkQ2hpbGRTY2hlbWFPYmplY3Q7XG4gICAgICAgICAgICAgIGlmIChjaGlsZFNjaGVtYU9iamVjdC4kdHlwZSkge1xuICAgICAgICAgICAgICAgIGxldCB0eXBlUU5hbWUgPSBzcGxpdFFOYW1lKGNoaWxkU2NoZW1hT2JqZWN0LiR0eXBlKTtcbiAgICAgICAgICAgICAgICBsZXQgdHlwZVByZWZpeCA9IHR5cGVRTmFtZS5wcmVmaXg7XG4gICAgICAgICAgICAgICAgbGV0IHR5cGVVUkkgPSBzY2hlbWEueG1sbnNbdHlwZVByZWZpeF0gfHwgc2VsZi5kZWZpbml0aW9ucy54bWxuc1t0eXBlUHJlZml4XTtcbiAgICAgICAgICAgICAgICBjaGlsZE5zVVJJID0gdHlwZVVSSTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZVVSSSAhPT0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hJyAmJiB0eXBlUHJlZml4ICE9PSBUTlNfUFJFRklYKSB7XG4gICAgICAgICAgICAgICAgICAvLyBBZGQgdGhlIHByZWZpeC9uYW1lc3BhY2UgbWFwcGluZywgYnV0IG5vdCBkZWNsYXJlIGl0XG4gICAgICAgICAgICAgICAgICBuc0NvbnRleHQuYWRkTmFtZXNwYWNlKHR5cGVQcmVmaXgsIHR5cGVVUkkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNvbHZlZENoaWxkU2NoZW1hT2JqZWN0ID1cbiAgICAgICAgICAgICAgICAgIHNlbGYuZmluZFNjaGVtYVR5cGUodHlwZVFOYW1lLm5hbWUsIHR5cGVVUkkpIHx8IGNoaWxkU2NoZW1hT2JqZWN0O1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc29sdmVkQ2hpbGRTY2hlbWFPYmplY3QgPVxuICAgICAgICAgICAgICAgICAgc2VsZi5maW5kU2NoZW1hT2JqZWN0KGNoaWxkTnNVUkksIGNoaWxkTmFtZSkgfHwgY2hpbGRTY2hlbWFPYmplY3Q7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoY2hpbGRTY2hlbWFPYmplY3QuJGJhc2VOYW1lU3BhY2UgJiYgdGhpcy5vcHRpb25zLmlnbm9yZUJhc2VOYW1lU3BhY2VzKSB7XG4gICAgICAgICAgICAgICAgY2hpbGROc1ByZWZpeCA9IG5zUHJlZml4O1xuICAgICAgICAgICAgICAgIGNoaWxkTnNVUkkgPSBuc1VSSTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaWdub3JlQmFzZU5hbWVTcGFjZXMpIHtcbiAgICAgICAgICAgICAgICBjaGlsZE5zUHJlZml4ID0gJyc7XG4gICAgICAgICAgICAgICAgY2hpbGROc1VSSSA9ICcnO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgbnMgPSBjaGlsZE5zUHJlZml4O1xuXG4gICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNoaWxkKSkge1xuICAgICAgICAgICAgICAgIC8vZm9yIGFycmF5cywgd2UgbmVlZCB0byByZW1lbWJlciB0aGUgY3VycmVudCBuYW1lc3BhY2VcbiAgICAgICAgICAgICAgICBjaGlsZE5zUHJlZml4ID0ge1xuICAgICAgICAgICAgICAgICAgY3VycmVudDogY2hpbGROc1ByZWZpeCxcbiAgICAgICAgICAgICAgICAgIHBhcmVudDogbnNcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vcGFyZW50IChhcnJheSkgYWxyZWFkeSBnb3QgdGhlIG5hbWVzcGFjZVxuICAgICAgICAgICAgICAgIGNoaWxkWG1sbnNBdHRyaWIgPSBudWxsO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFsdWUgPSBzZWxmLm9iamVjdFRvWE1MKGNoaWxkLCBuYW1lLCBjaGlsZE5zUHJlZml4LCBjaGlsZE5zVVJJLFxuICAgICAgICAgICAgICAgIGZhbHNlLCBjaGlsZFhtbG5zQXR0cmliLCByZXNvbHZlZENoaWxkU2NoZW1hT2JqZWN0LCBuc0NvbnRleHQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvYmpbc2VsZi5vcHRpb25zLmF0dHJpYnV0ZXNLZXldICYmIG9ialtzZWxmLm9wdGlvbnMuYXR0cmlidXRlc0tleV0ueHNpX3R5cGUpIHtcbiAgICAgICAgICAgICAgLy9pZiBwYXJlbnQgb2JqZWN0IGhhcyBjb21wbGV4IHR5cGUgZGVmaW5lZCBhbmQgY2hpbGQgbm90IGZvdW5kIGluIHBhcmVudFxuICAgICAgICAgICAgICBsZXQgY29tcGxldGVDaGlsZFBhcmFtVHlwZU9iamVjdCA9IHNlbGYuZmluZENoaWxkU2NoZW1hT2JqZWN0KFxuICAgICAgICAgICAgICAgIG9ialtzZWxmLm9wdGlvbnMuYXR0cmlidXRlc0tleV0ueHNpX3R5cGUudHlwZSxcbiAgICAgICAgICAgICAgICBvYmpbc2VsZi5vcHRpb25zLmF0dHJpYnV0ZXNLZXldLnhzaV90eXBlLnhtbG5zKTtcblxuICAgICAgICAgICAgICBub25TdWJOYW1lU3BhY2UgPSBvYmpbc2VsZi5vcHRpb25zLmF0dHJpYnV0ZXNLZXldLnhzaV90eXBlLnByZWZpeDtcbiAgICAgICAgICAgICAgbnNDb250ZXh0LmFkZE5hbWVzcGFjZShvYmpbc2VsZi5vcHRpb25zLmF0dHJpYnV0ZXNLZXldLnhzaV90eXBlLnByZWZpeCxcbiAgICAgICAgICAgICAgICBvYmpbc2VsZi5vcHRpb25zLmF0dHJpYnV0ZXNLZXldLnhzaV90eXBlLnhtbG5zKTtcbiAgICAgICAgICAgICAgdmFsdWUgPSBzZWxmLm9iamVjdFRvWE1MKGNoaWxkLCBuYW1lLCBvYmpbc2VsZi5vcHRpb25zLmF0dHJpYnV0ZXNLZXldLnhzaV90eXBlLnByZWZpeCxcbiAgICAgICAgICAgICAgICBvYmpbc2VsZi5vcHRpb25zLmF0dHJpYnV0ZXNLZXldLnhzaV90eXBlLnhtbG5zLCBmYWxzZSwgbnVsbCwgbnVsbCwgbnNDb250ZXh0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNoaWxkKSkge1xuICAgICAgICAgICAgICAgIG5hbWUgPSBub25TdWJOYW1lU3BhY2UgKyBuYW1lO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFsdWUgPSBzZWxmLm9iamVjdFRvWE1MKGNoaWxkLCBuYW1lLCBuc1ByZWZpeCwgbnNVUkksIGZhbHNlLCBudWxsLCBudWxsLCBuc0NvbnRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHNlbGYub2JqZWN0VG9YTUwoY2hpbGQsIG5hbWUsIG5zUHJlZml4LCBuc1VSSSwgZmFsc2UsIG51bGwsIG51bGwsIG5zQ29udGV4dCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG5zID0gbm9Db2xvbk5hbWVTcGFjZShucyk7XG4gICAgICBpZiAocHJlZml4TmFtZXNwYWNlICYmICFxdWFsaWZpZWQgJiYgaXNGaXJzdCAmJiAhc2VsZi5vcHRpb25zLm92ZXJyaWRlUm9vdEVsZW1lbnQpIHtcbiAgICAgICAgbnMgPSBuc1ByZWZpeDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0lnbm9yZWROYW1lU3BhY2UobnMpKSB7XG4gICAgICAgIG5zID0gJyc7XG4gICAgICB9XG5cbiAgICAgIGxldCB1c2VFbXB0eVRhZyA9ICF2YWx1ZSAmJiBzZWxmLm9wdGlvbnMudXNlRW1wdHlUYWc7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY2hpbGQpKSB7XG4gICAgICAgIC8vIHN0YXJ0IHRhZ1xuICAgICAgICBwYXJ0cy5wdXNoKFsnPCcsIGVtcHR5Tm9uU3ViTmFtZVNwYWNlID8gJycgOiBhcHBlbmRDb2xvbihub25TdWJOYW1lU3BhY2UgfHwgbnMpLCBuYW1lLCBhdHRyLCB4bWxuc0F0dHJpYixcbiAgICAgICAgICAoY2hpbGQgPT09IG51bGwgPyAnIHhzaTpuaWw9XCJ0cnVlXCInIDogJycpLFxuICAgICAgICAgIHVzZUVtcHR5VGFnID8gJyAvPicgOiAnPidcbiAgICAgICAgXS5qb2luKCcnKSk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdXNlRW1wdHlUYWcpIHtcbiAgICAgICAgcGFydHMucHVzaCh2YWx1ZSk7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShjaGlsZCkpIHtcbiAgICAgICAgICAvLyBlbmQgdGFnXG4gICAgICAgICAgcGFydHMucHVzaChbJzwvJywgZW1wdHlOb25TdWJOYW1lU3BhY2UgPyAnJyA6IGFwcGVuZENvbG9uKG5vblN1Yk5hbWVTcGFjZSB8fCBucyksIG5hbWUsICc+J10uam9pbignJykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKG9iaiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcGFydHMucHVzaCgoc2VsZi5vcHRpb25zLmVzY2FwZVhNTCkgPyB4bWxFc2NhcGUob2JqKSA6IG9iaik7XG4gIH1cbiAgbnNDb250ZXh0LnBvcENvbnRleHQoKTtcbiAgcmV0dXJuIHBhcnRzLmpvaW4oJycpO1xufTtcblxuV1NETC5wcm90b3R5cGUucHJvY2Vzc0F0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoY2hpbGQsIG5zQ29udGV4dCkge1xuICBsZXQgYXR0ciA9ICcnO1xuXG4gIGlmIChjaGlsZCA9PT0gbnVsbCkge1xuICAgIGNoaWxkID0gW107XG4gIH1cblxuICBsZXQgYXR0ck9iaiA9IGNoaWxkW3RoaXMub3B0aW9ucy5hdHRyaWJ1dGVzS2V5XTtcbiAgaWYgKGF0dHJPYmogJiYgYXR0ck9iai54c2lfdHlwZSkge1xuICAgIGxldCB4c2lUeXBlID0gYXR0ck9iai54c2lfdHlwZTtcblxuICAgIGxldCBwcmVmaXggPSB4c2lUeXBlLnByZWZpeCB8fCB4c2lUeXBlLm5hbWVzcGFjZTtcbiAgICAvLyBHZW5lcmF0ZSBhIG5ldyBuYW1lc3BhY2UgZm9yIGNvbXBsZXggZXh0ZW5zaW9uIGlmIG9uZSBub3QgcHJvdmlkZWRcbiAgICBpZiAoIXByZWZpeCkge1xuICAgICAgcHJlZml4ID0gbnNDb250ZXh0LnJlZ2lzdGVyTmFtZXNwYWNlKHhzaVR5cGUueG1sbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuc0NvbnRleHQuZGVjbGFyZU5hbWVzcGFjZShwcmVmaXgsIHhzaVR5cGUueG1sbnMpO1xuICAgIH1cbiAgICB4c2lUeXBlLnByZWZpeCA9IHByZWZpeDtcbiAgfVxuXG5cbiAgaWYgKGF0dHJPYmopIHtcbiAgICBmb3IgKGxldCBhdHRyS2V5IGluIGF0dHJPYmopIHtcbiAgICAgIC8vaGFuZGxlIGNvbXBsZXggZXh0ZW5zaW9uIHNlcGFyYXRlbHlcbiAgICAgIGlmIChhdHRyS2V5ID09PSAneHNpX3R5cGUnKSB7XG4gICAgICAgIGxldCBhdHRyVmFsdWUgPSBhdHRyT2JqW2F0dHJLZXldO1xuICAgICAgICBhdHRyICs9ICcgeHNpOnR5cGU9XCInICsgYXR0clZhbHVlLnByZWZpeCArICc6JyArIGF0dHJWYWx1ZS50eXBlICsgJ1wiJztcbiAgICAgICAgYXR0ciArPSAnIHhtbG5zOicgKyBhdHRyVmFsdWUucHJlZml4ICsgJz1cIicgKyBhdHRyVmFsdWUueG1sbnMgKyAnXCInO1xuXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXR0ciArPSAnICcgKyBhdHRyS2V5ICsgJz1cIicgKyB4bWxFc2NhcGUoYXR0ck9ialthdHRyS2V5XSkgKyAnXCInO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhdHRyO1xufTtcblxuLyoqXG4gKiBMb29rIHVwIGEgc2NoZW1hIHR5cGUgZGVmaW5pdGlvblxuICogQHBhcmFtIG5hbWVcbiAqIEBwYXJhbSBuc1VSSVxuICogQHJldHVybnMgeyp9XG4gKi9cbldTREwucHJvdG90eXBlLmZpbmRTY2hlbWFUeXBlID0gZnVuY3Rpb24gKG5hbWUsIG5zVVJJKSB7XG4gIGlmICghdGhpcy5kZWZpbml0aW9ucy5zY2hlbWFzIHx8ICFuYW1lIHx8ICFuc1VSSSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbGV0IHNjaGVtYSA9IHRoaXMuZGVmaW5pdGlvbnMuc2NoZW1hc1tuc1VSSV07XG4gIGlmICghc2NoZW1hIHx8ICFzY2hlbWEuY29tcGxleFR5cGVzKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gc2NoZW1hLmNvbXBsZXhUeXBlc1tuYW1lXTtcbn07XG5cbldTREwucHJvdG90eXBlLmZpbmRDaGlsZFNjaGVtYU9iamVjdCA9IGZ1bmN0aW9uIChwYXJhbWV0ZXJUeXBlT2JqLCBjaGlsZE5hbWUsIGJhY2t0cmFjZSkge1xuICBpZiAoIXBhcmFtZXRlclR5cGVPYmogfHwgIWNoaWxkTmFtZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKCFiYWNrdHJhY2UpIHtcbiAgICBiYWNrdHJhY2UgPSBbXTtcbiAgfVxuXG4gIGlmIChiYWNrdHJhY2UuaW5kZXhPZihwYXJhbWV0ZXJUeXBlT2JqKSA+PSAwKSB7XG4gICAgLy8gV2UndmUgcmVjdXJzZWQgYmFjayB0byBvdXJzZWx2ZXM7IGJyZWFrLlxuICAgIHJldHVybiBudWxsO1xuICB9IGVsc2Uge1xuICAgIGJhY2t0cmFjZSA9IGJhY2t0cmFjZS5jb25jYXQoW3BhcmFtZXRlclR5cGVPYmpdKTtcbiAgfVxuXG4gIGxldCBmb3VuZCA9IG51bGwsXG4gICAgaSA9IDAsXG4gICAgY2hpbGQsXG4gICAgcmVmO1xuXG4gIGlmIChBcnJheS5pc0FycmF5KHBhcmFtZXRlclR5cGVPYmouJGxvb2t1cFR5cGVzKSAmJiBwYXJhbWV0ZXJUeXBlT2JqLiRsb29rdXBUeXBlcy5sZW5ndGgpIHtcbiAgICBsZXQgdHlwZXMgPSBwYXJhbWV0ZXJUeXBlT2JqLiRsb29rdXBUeXBlcztcblxuICAgIGZvciAoaSA9IDA7IGkgPCB0eXBlcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHR5cGVPYmogPSB0eXBlc1tpXTtcblxuICAgICAgaWYgKHR5cGVPYmouJG5hbWUgPT09IGNoaWxkTmFtZSkge1xuICAgICAgICBmb3VuZCA9IHR5cGVPYmo7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGxldCBvYmplY3QgPSBwYXJhbWV0ZXJUeXBlT2JqO1xuICBpZiAob2JqZWN0LiRuYW1lID09PSBjaGlsZE5hbWUgJiYgb2JqZWN0Lm5hbWUgPT09ICdlbGVtZW50Jykge1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cbiAgaWYgKG9iamVjdC4kcmVmKSB7XG4gICAgcmVmID0gc3BsaXRRTmFtZShvYmplY3QuJHJlZik7XG4gICAgaWYgKHJlZi5uYW1lID09PSBjaGlsZE5hbWUpIHtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuICB9XG5cbiAgbGV0IGNoaWxkTnNVUkk7XG5cbiAgLy8gd2FudCB0byBhdm9pZCB1bmVjZXNzYXJ5IHJlY3Vyc2lvbiB0byBpbXByb3ZlIHBlcmZvcm1hbmNlXG4gIGlmIChvYmplY3QuJHR5cGUgJiYgYmFja3RyYWNlLmxlbmd0aCA9PT0gMSkge1xuICAgIGxldCB0eXBlSW5mbyA9IHNwbGl0UU5hbWUob2JqZWN0LiR0eXBlKTtcbiAgICBpZiAodHlwZUluZm8ucHJlZml4ID09PSBUTlNfUFJFRklYKSB7XG4gICAgICBjaGlsZE5zVVJJID0gcGFyYW1ldGVyVHlwZU9iai4kdGFyZ2V0TmFtZXNwYWNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaGlsZE5zVVJJID0gdGhpcy5kZWZpbml0aW9ucy54bWxuc1t0eXBlSW5mby5wcmVmaXhdO1xuICAgIH1cbiAgICBsZXQgdHlwZURlZiA9IHRoaXMuZmluZFNjaGVtYVR5cGUodHlwZUluZm8ubmFtZSwgY2hpbGROc1VSSSk7XG4gICAgaWYgKHR5cGVEZWYpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmRDaGlsZFNjaGVtYU9iamVjdCh0eXBlRGVmLCBjaGlsZE5hbWUsIGJhY2t0cmFjZSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKG9iamVjdC5jaGlsZHJlbikge1xuICAgIGZvciAoaSA9IDAsIGNoaWxkOyBjaGlsZCA9IG9iamVjdC5jaGlsZHJlbltpXTsgaSsrKSB7XG4gICAgICBmb3VuZCA9IHRoaXMuZmluZENoaWxkU2NoZW1hT2JqZWN0KGNoaWxkLCBjaGlsZE5hbWUsIGJhY2t0cmFjZSk7XG4gICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGlsZC4kYmFzZSkge1xuICAgICAgICBsZXQgYmFzZVFOYW1lID0gc3BsaXRRTmFtZShjaGlsZC4kYmFzZSk7XG4gICAgICAgIGxldCBjaGlsZE5hbWVTcGFjZSA9IGJhc2VRTmFtZS5wcmVmaXggPT09IFROU19QUkVGSVggPyAnJyA6IGJhc2VRTmFtZS5wcmVmaXg7XG4gICAgICAgIGNoaWxkTnNVUkkgPSBjaGlsZC54bWxuc1tiYXNlUU5hbWUucHJlZml4XSB8fCB0aGlzLmRlZmluaXRpb25zLnhtbG5zW2Jhc2VRTmFtZS5wcmVmaXhdO1xuXG4gICAgICAgIGxldCBmb3VuZEJhc2UgPSB0aGlzLmZpbmRTY2hlbWFUeXBlKGJhc2VRTmFtZS5uYW1lLCBjaGlsZE5zVVJJKTtcblxuICAgICAgICBpZiAoZm91bmRCYXNlKSB7XG4gICAgICAgICAgZm91bmQgPSB0aGlzLmZpbmRDaGlsZFNjaGVtYU9iamVjdChmb3VuZEJhc2UsIGNoaWxkTmFtZSwgYmFja3RyYWNlKTtcblxuICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgZm91bmQuJGJhc2VOYW1lU3BhY2UgPSBjaGlsZE5hbWVTcGFjZTtcbiAgICAgICAgICAgIGZvdW5kLiR0eXBlID0gY2hpbGROYW1lU3BhY2UgKyAnOicgKyBjaGlsZE5hbWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG4gIGlmICghZm91bmQgJiYgb2JqZWN0LiRuYW1lID09PSBjaGlsZE5hbWUpIHtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgcmV0dXJuIGZvdW5kO1xufTtcblxuV1NETC5wcm90b3R5cGUuX3BhcnNlID0gZnVuY3Rpb24gKHhtbCkge1xuICBsZXQgc2VsZiA9IHRoaXMsXG4gICAgcCA9IHNheC5wYXJzZXIodHJ1ZSksXG4gICAgc3RhY2sgPSBbXSxcbiAgICByb290ID0gbnVsbCxcbiAgICB0eXBlcyA9IG51bGwsXG4gICAgc2NoZW1hID0gbnVsbCxcbiAgICBvcHRpb25zID0gc2VsZi5vcHRpb25zO1xuXG4gIHAub25vcGVudGFnID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICBsZXQgbnNOYW1lID0gbm9kZS5uYW1lO1xuICAgIGxldCBhdHRycyA9IG5vZGUuYXR0cmlidXRlcztcblxuICAgIGxldCB0b3AgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICBsZXQgbmFtZTtcbiAgICBpZiAodG9wKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0b3Auc3RhcnRFbGVtZW50KHN0YWNrLCBuc05hbWUsIGF0dHJzLCBvcHRpb25zKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5zdHJpY3QpIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0YWNrLnB1c2gobmV3IEVsZW1lbnQobnNOYW1lLCBhdHRycywgb3B0aW9ucykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBzcGxpdFFOYW1lKG5zTmFtZSkubmFtZTtcbiAgICAgIGlmIChuYW1lID09PSAnZGVmaW5pdGlvbnMnKSB7XG4gICAgICAgIHJvb3QgPSBuZXcgRGVmaW5pdGlvbnNFbGVtZW50KG5zTmFtZSwgYXR0cnMsIG9wdGlvbnMpO1xuICAgICAgICBzdGFjay5wdXNoKHJvb3QpO1xuICAgICAgfSBlbHNlIGlmIChuYW1lID09PSAnc2NoZW1hJykge1xuICAgICAgICAvLyBTaGltIGEgc3RydWN0dXJlIGluIGhlcmUgdG8gYWxsb3cgdGhlIHByb3BlciBvYmplY3RzIHRvIGJlIGNyZWF0ZWQgd2hlbiBtZXJnaW5nIGJhY2suXG4gICAgICAgIHJvb3QgPSBuZXcgRGVmaW5pdGlvbnNFbGVtZW50KCdkZWZpbml0aW9ucycsIHt9LCB7fSk7XG4gICAgICAgIHR5cGVzID0gbmV3IFR5cGVzRWxlbWVudCgndHlwZXMnLCB7fSwge30pO1xuICAgICAgICBzY2hlbWEgPSBuZXcgU2NoZW1hRWxlbWVudChuc05hbWUsIGF0dHJzLCBvcHRpb25zKTtcbiAgICAgICAgdHlwZXMuYWRkQ2hpbGQoc2NoZW1hKTtcbiAgICAgICAgcm9vdC5hZGRDaGlsZCh0eXBlcyk7XG4gICAgICAgIHN0YWNrLnB1c2goc2NoZW1hKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5leHBlY3RlZCByb290IGVsZW1lbnQgb2YgV1NETCBvciBpbmNsdWRlJyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHAub25jbG9zZXRhZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgbGV0IHRvcCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgIGFzc2VydCh0b3AsICdVbm1hdGNoZWQgY2xvc2UgdGFnOiAnICsgbmFtZSk7XG5cbiAgICB0b3AuZW5kRWxlbWVudChzdGFjaywgbmFtZSk7XG4gIH07XG5cbiAgcC53cml0ZSh4bWwpLmNsb3NlKCk7XG5cbiAgcmV0dXJuIHJvb3Q7XG59O1xuXG5XU0RMLnByb3RvdHlwZS5fZnJvbVhNTCA9IGZ1bmN0aW9uICh4bWwpIHtcbiAgdGhpcy5kZWZpbml0aW9ucyA9IHRoaXMuX3BhcnNlKHhtbCk7XG4gIHRoaXMuZGVmaW5pdGlvbnMuZGVzY3JpcHRpb25zID0ge1xuICAgIHR5cGVzOiB7fVxuICB9O1xuICB0aGlzLnhtbCA9IHhtbDtcbn07XG5cbldTREwucHJvdG90eXBlLl9mcm9tU2VydmljZXMgPSBmdW5jdGlvbiAoc2VydmljZXMpIHtcblxufTtcblxuXG5cbldTREwucHJvdG90eXBlLl94bWxuc01hcCA9IGZ1bmN0aW9uICgpIHtcbiAgbGV0IHhtbG5zID0gdGhpcy5kZWZpbml0aW9ucy54bWxucztcbiAgbGV0IHN0ciA9ICcnO1xuICBmb3IgKGxldCBhbGlhcyBpbiB4bWxucykge1xuICAgIGlmIChhbGlhcyA9PT0gJycgfHwgYWxpYXMgPT09IFROU19QUkVGSVgpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBsZXQgbnMgPSB4bWxuc1thbGlhc107XG4gICAgc3dpdGNoIChucykge1xuICAgICAgY2FzZSBcImh0dHA6Ly94bWwuYXBhY2hlLm9yZy94bWwtc29hcFwiOiAvLyBhcGFjaGVzb2FwXG4gICAgICBjYXNlIFwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3NkbC9cIjogLy8gd3NkbFxuICAgICAgY2FzZSBcImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzZGwvc29hcC9cIjogLy8gd3NkbHNvYXBcbiAgICAgIGNhc2UgXCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93c2RsL3NvYXAxMi9cIjogLy8gd3NkbHNvYXAxMlxuICAgICAgY2FzZSBcImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3NvYXAvZW5jb2RpbmcvXCI6IC8vIHNvYXBlbmNcbiAgICAgIGNhc2UgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYVwiOiAvLyB4c2RcbiAgICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmICh+bnMuaW5kZXhPZignaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvJykpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAofm5zLmluZGV4T2YoJ2h0dHA6Ly93d3cudzMub3JnLycpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKH5ucy5pbmRleE9mKCdodHRwOi8veG1sLmFwYWNoZS5vcmcvJykpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBzdHIgKz0gJyB4bWxuczonICsgYWxpYXMgKyAnPVwiJyArIG5zICsgJ1wiJztcbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuLypcbiAqIEhhdmUgYW5vdGhlciBmdW5jdGlvbiB0byBsb2FkIHByZXZpb3VzIFdTRExzIGFzIHdlXG4gKiBkb24ndCB3YW50IHRoaXMgdG8gYmUgaW52b2tlZCBleHRlcm5hbGx5IChleHBlY3QgZm9yIHRlc3RzKVxuICogVGhpcyB3aWxsIGF0dGVtcHQgdG8gZml4IGNpcmN1bGFyIGRlcGVuZGVuY2llcyB3aXRoIFhTRCBmaWxlcyxcbiAqIEdpdmVuXG4gKiAtIGZpbGUud3NkbFxuICogICAtIHhzOmltcG9ydCBuYW1lc3BhY2U9XCJBXCIgc2NoZW1hTG9jYXRpb246IEEueHNkXG4gKiAtIEEueHNkXG4gKiAgIC0geHM6aW1wb3J0IG5hbWVzcGFjZT1cIkJcIiBzY2hlbWFMb2NhdGlvbjogQi54c2RcbiAqIC0gQi54c2RcbiAqICAgLSB4czppbXBvcnQgbmFtZXNwYWNlPVwiQVwiIHNjaGVtYUxvY2F0aW9uOiBBLnhzZFxuICogZmlsZS53c2RsIHdpbGwgc3RhcnQgbG9hZGluZywgaW1wb3J0IEEsIHRoZW4gQSB3aWxsIGltcG9ydCBCLCB3aGljaCB3aWxsIHRoZW4gaW1wb3J0IEFcbiAqIEJlY2F1c2UgQSBoYXMgYWxyZWFkeSBzdGFydGVkIHRvIGxvYWQgcHJldmlvdXNseSBpdCB3aWxsIGJlIHJldHVybmVkIHJpZ2h0IGF3YXkgYW5kXG4gKiBoYXZlIGFuIGludGVybmFsIGNpcmN1bGFyIHJlZmVyZW5jZVxuICogQiB3b3VsZCB0aGVuIGNvbXBsZXRlIGxvYWRpbmcsIHRoZW4gQSwgdGhlbiBmaWxlLndzZGxcbiAqIEJ5IHRoZSB0aW1lIGZpbGUgQSBzdGFydHMgcHJvY2Vzc2luZyBpdHMgaW5jbHVkZXMgaXRzIGRlZmluaXRpb25zIHdpbGwgYmUgYWxyZWFkeSBsb2FkZWQsXG4gKiB0aGlzIGlzIHRoZSBvbmx5IHRoaW5nIHRoYXQgQiB3aWxsIGRlcGVuZCBvbiB3aGVuIFwib3BlbmluZ1wiIEFcbiAqL1xuZnVuY3Rpb24gb3Blbl93c2RsX3JlY3Vyc2l2ZSh1cmksIG9wdGlvbnMpOiBQcm9taXNlPGFueT4ge1xuICBsZXQgZnJvbUNhY2hlLFxuICAgIFdTRExfQ0FDSEU7XG5cbiAgLy8gaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vICAgY2FsbGJhY2sgPSBvcHRpb25zO1xuICAvLyAgIG9wdGlvbnMgPSB7fTtcbiAgLy8gfVxuXG4gIFdTRExfQ0FDSEUgPSBvcHRpb25zLldTRExfQ0FDSEU7XG5cbiAgaWYgKGZyb21DYWNoZSA9IFdTRExfQ0FDSEVbdXJpXSkge1xuICAgIC8vIHJldHVybiBjYWxsYmFjay5jYWxsKGZyb21DYWNoZSwgbnVsbCwgZnJvbUNhY2hlKTtcbiAgICByZXR1cm4gZnJvbUNhY2hlO1xuICB9XG5cbiAgcmV0dXJuIG9wZW5fd3NkbCh1cmksIG9wdGlvbnMpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gb3Blbl93c2RsKHVyaSwgb3B0aW9ucyk6IFByb21pc2U8YW55PiB7XG4gIC8vIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyAgIGNhbGxiYWNrID0gb3B0aW9ucztcbiAgLy8gICBvcHRpb25zID0ge307XG4gIC8vIH1cblxuICAvLyBpbml0aWFsaXplIGNhY2hlIHdoZW4gY2FsbGluZyBvcGVuX3dzZGwgZGlyZWN0bHlcbiAgbGV0IFdTRExfQ0FDSEUgPSBvcHRpb25zLldTRExfQ0FDSEUgfHwge307XG4gIGxldCByZXF1ZXN0X2hlYWRlcnMgPSBvcHRpb25zLndzZGxfaGVhZGVycztcbiAgbGV0IHJlcXVlc3Rfb3B0aW9ucyA9IG9wdGlvbnMud3NkbF9vcHRpb25zO1xuXG4gIC8vIGxldCB3c2RsO1xuICAvLyBpZiAoIS9eaHR0cHM/Oi8udGVzdCh1cmkpKSB7XG4gIC8vICAgLy8gZGVidWcoJ1JlYWRpbmcgZmlsZTogJXMnLCB1cmkpO1xuICAvLyAgIC8vIGZzLnJlYWRGaWxlKHVyaSwgJ3V0ZjgnLCBmdW5jdGlvbihlcnIsIGRlZmluaXRpb24pIHtcbiAgLy8gICAvLyAgIGlmIChlcnIpIHtcbiAgLy8gICAvLyAgICAgY2FsbGJhY2soZXJyKTtcbiAgLy8gICAvLyAgIH1cbiAgLy8gICAvLyAgIGVsc2Uge1xuICAvLyAgIC8vICAgICB3c2RsID0gbmV3IFdTREwoZGVmaW5pdGlvbiwgdXJpLCBvcHRpb25zKTtcbiAgLy8gICAvLyAgICAgV1NETF9DQUNIRVsgdXJpIF0gPSB3c2RsO1xuICAvLyAgIC8vICAgICB3c2RsLldTRExfQ0FDSEUgPSBXU0RMX0NBQ0hFO1xuICAvLyAgIC8vICAgICB3c2RsLm9uUmVhZHkoY2FsbGJhY2spO1xuICAvLyAgIC8vICAgfVxuICAvLyAgIC8vIH0pO1xuICAvLyB9XG4gIC8vIGVsc2Uge1xuICAvLyAgIGRlYnVnKCdSZWFkaW5nIHVybDogJXMnLCB1cmkpO1xuICAvLyAgIGxldCBodHRwQ2xpZW50ID0gb3B0aW9ucy5odHRwQ2xpZW50IHx8IG5ldyBIdHRwQ2xpZW50KG9wdGlvbnMpO1xuICAvLyAgIGh0dHBDbGllbnQucmVxdWVzdCh1cmksIG51bGwgLyogb3B0aW9ucyAqLywgZnVuY3Rpb24oZXJyLCByZXNwb25zZSwgZGVmaW5pdGlvbikge1xuICAvLyAgICAgaWYgKGVycikge1xuICAvLyAgICAgICBjYWxsYmFjayhlcnIpO1xuICAvLyAgICAgfSBlbHNlIGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5zdGF0dXNDb2RlID09PSAyMDApIHtcbiAgLy8gICAgICAgd3NkbCA9IG5ldyBXU0RMKGRlZmluaXRpb24sIHVyaSwgb3B0aW9ucyk7XG4gIC8vICAgICAgIFdTRExfQ0FDSEVbIHVyaSBdID0gd3NkbDtcbiAgLy8gICAgICAgd3NkbC5XU0RMX0NBQ0hFID0gV1NETF9DQUNIRTtcbiAgLy8gICAgICAgd3NkbC5vblJlYWR5KGNhbGxiYWNrKTtcbiAgLy8gICAgIH0gZWxzZSB7XG4gIC8vICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcignSW52YWxpZCBXU0RMIFVSTDogJyArIHVyaSArIFwiXFxuXFxuXFxyIENvZGU6IFwiICsgcmVzcG9uc2Uuc3RhdHVzQ29kZSArIFwiXFxuXFxuXFxyIFJlc3BvbnNlIEJvZHk6IFwiICsgcmVzcG9uc2UuYm9keSkpO1xuICAvLyAgICAgfVxuICAvLyAgIH0sIHJlcXVlc3RfaGVhZGVycywgcmVxdWVzdF9vcHRpb25zKTtcbiAgLy8gfVxuICAvLyByZXR1cm4gd3NkbDtcblxuICBjb25zb2xlLmxvZygnUmVhZGluZyB1cmw6ICVzJywgdXJpKTtcbiAgY29uc3QgaHR0cENsaWVudDogSHR0cENsaWVudCA9IG9wdGlvbnMuaHR0cENsaWVudDtcbiAgY29uc3Qgd3NkbERlZiA9IGF3YWl0IGh0dHBDbGllbnQuZ2V0KHVyaSwgeyByZXNwb25zZVR5cGU6ICd0ZXh0JyB9KS50b1Byb21pc2UoKTtcbiAgY29uc3Qgd3NkbE9iaiA9IGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgY29uc3Qgd3NkbCA9IG5ldyBXU0RMKHdzZGxEZWYsIHVyaSwgb3B0aW9ucyk7XG4gICAgV1NETF9DQUNIRVt1cmldID0gd3NkbDtcbiAgICB3c2RsLldTRExfQ0FDSEUgPSBXU0RMX0NBQ0hFO1xuICAgIHdzZGwub25SZWFkeShyZXNvbHZlKHdzZGwpKTtcbiAgfSk7XG4gIC8vY29uc29sZS5sb2coXCJ3c2RsXCIsIHdzZGxPYmopXG4gIHJldHVybiB3c2RsT2JqO1xufVxuIl19