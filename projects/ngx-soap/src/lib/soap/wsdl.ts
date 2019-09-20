/*
 * Copyright (c) 2011 Vinay Pulim <vinay@milewise.com>
 * MIT Licensed
 *
 */
/*jshint proto:true*/

"use strict";

import * as sax from 'sax';
import { HttpClient } from '@angular/common/http';
import { NamespaceContext }  from './nscontext';

import * as url from 'url';
import { ok as assert } from 'assert';
// import stripBom from 'strip-bom';

const stripBom = (x: string): string => {
  // Catches EFBBBF (UTF-8 BOM) because the buffer-to-string
  // conversion translates it to FEFF (UTF-16 BOM)
  if (x.charCodeAt(0) === 0xFEFF) {
    return x.slice(1);
  }

  return x;
}

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

let Element: any = function (nsName, attrs, options) {
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
      } else {
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
  } else {
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

  let ChildClass = this.allowedChildren[splitQName(nsName).name],
    element = null;

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
  if (this.name !== 'definitions') this.unexpected(this.nsName);
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
  } else {
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
    let lookupTypes = [],
      elementChildren;

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
  } else {
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
      } else {
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
  let splittedNSString = splitQName(nsString),
    nsAlias = splittedNSString.prefix,
    splittedName = splittedNSString.name.split('#'),
    type = splittedName[0],
    name = splittedName[1],
    lookupTypeObj: any = {};

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
  let resolvedType = '^',
    excluded = this.ignoredNamespaces.concat('xs'); // do not process $type values wich start with

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
  let type = splitQName(this.$type).name,
    portType = definitions.portTypes[type],
    style = this.style,
    children = this.children;
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
  let children = this.children,
    bindings = definitions.bindings;
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
    let type = splitQName(this.$base),
      typeName = type.name,
      ns = xmlns && xmlns[type.prefix] || definitions.xmlns[type.prefix],
      schema = definitions.schemas[ns],
      typeElement = schema && (schema.complexTypes[typeName] || schema.types[typeName] || schema.elements[typeName]);

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
    let type = splitQName(this.$base),
      typeName = type.name,
      ns = xmlns && xmlns[type.prefix] || definitions.xmlns[type.prefix],
      schema = definitions.schemas[ns];

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
  let element = {},
    name = this.$name;
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
    let typeName = type.name,
      ns = xmlns && xmlns[type.prefix] || definitions.xmlns[type.prefix],
      schema = definitions.schemas[ns],
      typeElement = schema && (this.$type ? schema.complexTypes[typeName] || schema.types[typeName] : schema.elements[typeName]);

    if (ns && definitions.schemas[ns]) {
      xmlns = definitions.schemas[ns].xmlns;
    }

    if (typeElement && !(typeName in Primitives)) {

      if (!(typeName in definitions.descriptions.types)) {

        let elem: any = {};
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
  let self = this,
    fromFunc;

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
    } catch (e) {
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
    } else {
      this.options.ignoredNamespaces = this.ignoredNamespaces.concat(ignoredNamespaces.namespaces);
    }
  } else {
    this.options.ignoredNamespaces = this.ignoredNamespaces;
  }

  this.options.valueKey = options.valueKey || this.valueKey;
  this.options.xmlKey = options.xmlKey || this.xmlKey;
  if (options.escapeXML !== undefined) {
    this.options.escapeXML = options.escapeXML;
  } else {
    this.options.escapeXML = true;
  }
  if (options.returnFault !== undefined) {
    this.options.returnFault = options.returnFault;
  } else {
    this.options.returnFault = false;
  }
  this.options.handleNilAsNull = !!options.handleNilAsNull;

  if (options.namespaceArrayElements !== undefined) {
    this.options.namespaceArrayElements = options.namespaceArrayElements;
  } else {
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
  } else {
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

WSDL.prototype._processNextInclude = async function (includes) {
  let self = this,
    include = includes.shift(),
    options;

  if (!include)
    return; // callback();

  let includePath;
  if (!/^https?:/.test(self.uri) && !/^https?:/.test(include.location)) {
    // includePath = path.resolve(path.dirname(self.uri), include.location);
  } else {
    includePath = url.resolve(self.uri || '', include.location);
  }

  options = _.assign({}, this.options);
  // follow supplied ignoredNamespaces option
  options.ignoredNamespaces = this._originalIgnoredNamespaces || this.options.ignoredNamespaces;
  options.WSDL_CACHE = this.WSDL_CACHE;

  const wsdl = await open_wsdl_recursive(includePath, options)
  self._includesWsdl.push(wsdl);

  if (wsdl.definitions instanceof DefinitionsElement) {
    _.mergeWith(self.definitions, wsdl.definitions, function (a, b) {
      return (a instanceof SchemaElement) ? a.merge(b) : undefined;
    });
  } else {
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
};

WSDL.prototype.processIncludes = async function () {
  let schemas = this.definitions.schemas,
    includes = [];

  for (let ns in schemas) {
    let schema = schemas[ns];
    includes = includes.concat(schema.includes || []);
  }

  return this._processNextInclude(includes);
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
  let root: any = {};
  let schema={};
  if(!this.options.forceSoap12Headers){
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
  } else {
     schema ={
      Envelope: {
        Header: {
          Security: {
            UsernameToken: {
              Username: 'string',
              Password: 'string'
            }
          }
        },
        Body:{
          Code: {
            Value: 'string',
           Subcode:
            {
               Value: 'string' 
             } 
           },
           Reason: { Text: 'string'},
           statusCode: 'number',
           Detail: 'object'
         }

        }
      

    }
  }
  
  //console.log('schema',schema);
  let stack: any[] = [{ name: null, object: root, schema: schema }];
  let xmlns: any = {};

  let refs = {}, id; // {id:{hrefs:[],obj:}, ...}

  p.onopentag = function (node) {
    let nsName = node.name;
    let attrs: any = node.attributes;
    let name = splitQName(nsName).name,
      attributeName,
      top = stack[stack.length - 1],
      topSchema = top.schema,
      elementAttributes = {},
      hasNonXmlnsAttribute = false,
      hasNilAttribute = false,
      obj = {};
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
          } else if ((/Request$/).test(name)) {
            isInput = true;
            name = name.replace(/Request$/, '');
          } else if ((/Solicit$/).test(name)) {
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
          } else {
            name = portType.methods[name].output.$name;
          }
          message = self.definitions.messages[name];
          // 'cache' this alias to speed future lookups
          self.definitions.messages[originalName] = self.definitions.messages[name];
        } catch (e) {
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
        (elementAttributes[attributeName].toLowerCase() === 'true' || elementAttributes[attributeName] === '1')
      ) {
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
      } else {
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
    let cur: any = stack.pop(),
      obj = cur.object,
      top = stack[stack.length - 1],
      topObject = top.object,
      topSchema = top.schema,
      name = splitQName(nsName).name;

    if (typeof cur.schema === 'string' && (cur.schema === 'string' || (<string>cur.schema).split(':')[1] === 'string')) {
      if (typeof obj === 'object' && Object.keys(obj).length === 0) obj = cur.object = '';
    }

    if (cur.nil === true) {
      if (self.options.handleNilAsNull) {
        obj = null;
      } else {
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
    } else if (name in topObject) {
      if (!Array.isArray(topObject[name])) {
        topObject[name] = [topObject[name]];
      }
      topObject[name].push(obj);
    } else {
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
      } else {
        top.object = value;
      }
    } else {
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
    let name = splitQName(top.schema).name,
      value;
    if (self.options && self.options.customDeserializer && self.options.customDeserializer[name]) {
      value = self.options.customDeserializer[name](text, top);
    }
    else {
      if (name === 'int' || name === 'integer') {
        value = parseInt(text, 10);
      } else if (name === 'bool' || name === 'boolean') {
        value = text.toLowerCase() === 'true' || text === '1';
      } else if (name === 'dateTime' || name === 'date') {
        value = new Date(text);
      } else {
        if (self.options.preserveWhitespace) {
          text = originalText;
        }
        // handle string or other types
        if (typeof top.object !== 'string') {
          value = text;
        } else {
          value = top.object + text;
        }
      }
    }

    if (top.object[self.options.attributesKey]) {
      top.object[self.options.valueKey] = value;
    } else {
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
        } catch (e) {
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
      let error: any;
    
      if (body && body.Fault) {
        
        if(!body.Fault.Code){
        let code = body.Fault.faultcode && body.Fault.faultcode.$value;
        let string = body.Fault.faultstring && body.Fault.faultstring.$value;
        let detail = body.Fault.detail && body.Fault.detail.$value;

        code = code || body.Fault.faultcode;
        string = string || body.Fault.faultstring;
        detail = detail || body.Fault.detail;

         error = new Error(code + ': ' + string + (detail ? ': ' + detail : ''));
        }else {
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
    } else {
      if (prefixNamespace && !this.isIgnoredNameSpace(nsPrefix)) {
        // resolve the prefix namespace
        xmlnsAttrib += ' xmlns:' + nsPrefix + '="' + nsURI + '"';
      }
      // only add default namespace if the schema elementFormDefault is qualified
      if (qualified || soapHeader) xmlnsAttrib += ' xmlns="' + nsURI + '"';
    }
  }

  if (!nsContext) {
    nsContext = new NamespaceContext();
    nsContext.declareNamespace(nsPrefix, nsURI);
  } else {
    nsContext.pushContext();
  }

  // explicitly use xmlns attribute if available
  if (xmlnsAttr && !(self.options.overrideRootElement && self.options.overrideRootElement.xmlnsAttributes)) {
    xmlnsAttrib = xmlnsAttr;
  }

  let ns = '';

  if (self.options.overrideRootElement && isFirst) {
    ns = self.options.overrideRootElement.namespace;
  } else if (prefixNamespace && (qualified || isFirst || soapHeader) && !this.isIgnoredNameSpace(nsPrefix)) {
    ns = nsPrefix;
  }

  let i, n;
  // start building out XML string.
  if (Array.isArray(obj)) {
    for (i = 0, n = obj.length; i < n; i++) {
      let item = obj[i];
      let arrayAttr = self.processAttributes(item, nsContext),
        correctOuterNsPrefix = parentNsPrefix || ns; //using the parent namespace prefix if given

      let body = self.objectToXML(item, name, nsPrefix, nsURI, false, null, schemaObject, nsContext);

      let openingTagParts = ['<', appendColon(correctOuterNsPrefix), name, arrayAttr, xmlnsAttrib];

      if (body === '' && self.options.useEmptyTag) {
        // Use empty (self-closing) tags if no contents
        openingTagParts.push(' />');
        parts.push(openingTagParts.join(''));
      } else {
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
  } else if (typeof obj === 'object') {
    for (name in obj) {
      if (!obj.hasOwnProperty(name)) continue;
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
      } else if (name[0] === ':') {
        emptyNonSubNameSpace = true;
        name = name.substr(1);
      }

      if (isFirst) {
        value = self.objectToXML(child, name, nsPrefix, nsURI, false, null, schemaObject, nsContext);
      } else {

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

              let childNsPrefix: any = '';
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
                } else {
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
                  } else if (childSchemaObject.$form === 'qualified') {
                    unqualified = false;
                  } else {
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
              } else {
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
              } else {
                //parent (array) already got the namespace
                childXmlnsAttrib = null;
              }

              value = self.objectToXML(child, name, childNsPrefix, childNsURI,
                false, childXmlnsAttrib, resolvedChildSchemaObject, nsContext);
            } else if (obj[self.options.attributesKey] && obj[self.options.attributesKey].xsi_type) {
              //if parent object has complex type defined and child not found in parent
              let completeChildParamTypeObject = self.findChildSchemaObject(
                obj[self.options.attributesKey].xsi_type.type,
                obj[self.options.attributesKey].xsi_type.xmlns);

              nonSubNameSpace = obj[self.options.attributesKey].xsi_type.prefix;
              nsContext.addNamespace(obj[self.options.attributesKey].xsi_type.prefix,
                obj[self.options.attributesKey].xsi_type.xmlns);
              value = self.objectToXML(child, name, obj[self.options.attributesKey].xsi_type.prefix,
                obj[self.options.attributesKey].xsi_type.xmlns, false, null, null, nsContext);
            } else {
              if (Array.isArray(child)) {
                name = nonSubNameSpace + name;
              }

              value = self.objectToXML(child, name, nsPrefix, nsURI, false, null, null, nsContext);
            }
          } else {
            value = self.objectToXML(child, name, nsPrefix, nsURI, false, null, null, nsContext);
          }
        }
      }

      ns = noColonNameSpace(ns);
      if (prefixNamespace && !qualified && isFirst && !self.options.overrideRootElement) {
        ns = nsPrefix;
      } else if (this.isIgnoredNameSpace(ns)) {
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
  } else if (obj !== undefined) {
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
    } else {
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
      } else {
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
  } else {
    backtrace = backtrace.concat([parameterTypeObj]);
  }

  let found = null,
    i = 0,
    child,
    ref;

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
    } else {
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
  let self = this,
    p = sax.parser(true),
    stack = [],
    root = null,
    types = null,
    schema = null,
    options = self.options;

  p.onopentag = function (node) {
    let nsName = node.name;
    let attrs = node.attributes;

    let top = stack[stack.length - 1];
    let name;
    if (top) {
      try {
        top.startElement(stack, nsName, attrs, options);
      } catch (e) {
        if (self.options.strict) {
          throw e;
        } else {
          stack.push(new Element(nsName, attrs, options));
        }
      }
    } else {
      name = splitQName(nsName).name;
      if (name === 'definitions') {
        root = new DefinitionsElement(nsName, attrs, options);
        stack.push(root);
      } else if (name === 'schema') {
        // Shim a structure in here to allow the proper objects to be created when merging back.
        root = new DefinitionsElement('definitions', {}, {});
        types = new TypesElement('types', {}, {});
        schema = new SchemaElement(nsName, attrs, options);
        types.addChild(schema);
        root.addChild(types);
        stack.push(schema);
      } else {
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
function open_wsdl_recursive(uri, options): Promise<any> {
  let fromCache,
    WSDL_CACHE;

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

export async function open_wsdl(uri, options): Promise<any> {
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
  const httpClient: HttpClient = options.httpClient;
  const wsdlDef = await httpClient.get(uri, { responseType: 'text' }).toPromise();
  const wsdlObj = await new Promise((resolve) => {
    const wsdl = new WSDL(wsdlDef, uri, options);
    WSDL_CACHE[uri] = wsdl;
    wsdl.WSDL_CACHE = WSDL_CACHE;
    wsdl.onReady(resolve(wsdl));
  });
  //console.log("wsdl", wsdlObj)
  return wsdlObj;
}
