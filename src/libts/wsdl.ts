import * as _ from 'lodash';
import * as sax from 'sax';
import { resolve as resolveUrl } from "url";
import { TNS_PREFIX, findPrefix } from './utils';
import { NamespaceContext } from "./nscontext";

const stripBom = (x: string): string => {
  // Catches EFBBBF (UTF-8 BOM) because the buffer-to-string
  // conversion translates it to FEFF (UTF-16 BOM)
  if (x.charCodeAt(0) === 0xFEFF) {
    return x.slice(1);
  }

  return x;
}

const Primitives = {
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

const trimLeft = /^[\s\xA0]+/;
const trimRight = /[\s\xA0]+$/;

function appendColon(ns: string) {
  return (ns && ns.charAt(ns.length - 1) !== ':') ? ns + ':' : ns;
}

function noColonNameSpace(ns: string) {
  return (ns && ns.charAt(ns.length - 1) === ':') ? ns.substring(0, ns.length - 1) : ns;
}

function splitQName(nsName: string) {
  if(typeof nsName !== 'string') return {
    prefix: '',
    name: nsName
  };

  var i = nsName.indexOf(':');
  return i < 0 ? { prefix: TNS_PREFIX, name: nsName } :
    { prefix: nsName.substring(0, i), name: nsName.substring(i + 1) };
}

function xmlEscape(obj: any) {
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

function trim(text: string) {
  return text.replace(trimLeft, '').replace(trimRight, '');
}

function deepMerge(destination: any, source: any) {
  return _.merge(destination || {}, source, (a: any, b: any) => {
    return _.isArray(a) ? a.concat(b) : undefined;
  });
}

export function openWsdl(wsdlDef: string, options: any = {}): WSDL {
  let wsdl = new WSDL(wsdlDef, options);
  return wsdl.build();
}

export interface WSDLOptions {
  ignoredNamespaces?: { namespaces?: string[]|string, override?: boolean};
  valueKey?: string;
  xmlKey?: string;
  escapeXML?: boolean;
  ignoreBaseNameSpaces?: boolean;
  // forceSoap12Headers?: any;
  // customDeserializer?: any;
  // overrideRootElement?: any;
}

export class WSDL {
  xml: any;
  services: any[];
  definition: any; //WSDL definition: string or service definition
  definitions: any; //WSDLElement type?
  _originalIgnoredNamespaces: any;
  options: any = {};

  _includesWsdl: any[];
  // uri: any;
  ignoredNamespaces = ['tns', 'targetNamespace', 'typedNamespace'];
  ignoreBaseNameSpaces = false;
  valueKey = '$value';
  xmlKey = '$xml';
  xmlnsInEnvelope: any;

  constructor(definition: string, options: WSDLOptions) {
    this.definition = definition;
    // this.uri = uri;
    this._includesWsdl = [];
    this._initializeOptions(options);
  }

  build(): WSDL {
    let definitions = this._fromXML(stripBom(this.definition));

    this.processIncludes();

    var name;
    this.definitions = definitions;

    this.definitions.deleteFixedAttrs();
    var services = this.services = this.definitions.services;
    if (services) {
      for (name in services) {
        services[name].postProcess(this.definitions);
      }
    }
    var complexTypes = this.definitions.complexTypes;
    if (complexTypes) {
      for (name in complexTypes) {
        complexTypes[name].deleteFixedAttrs();
      }
    }

    // for document style, for every binding, prepare input message element name to (methodName, output message element name) mapping
    var bindings = this.definitions.bindings;
    for (var bindingName in bindings) {
      var binding = bindings[bindingName];
      if (typeof binding.style === 'undefined') {
        binding.style = 'document';
      }
      if (binding.style !== 'document') continue;
      var methods = binding.methods;
      var topEls: any = binding.topElements = {};
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

    this.xmlnsInEnvelope = this._xmlnsMap();

    return this;
  }

  

  processIncludes(): any {
    var schemas = this.definitions.schemas;
    var includes: any[] = [];

    for (var ns in schemas) {
      var schema = schemas[ns];
      includes = includes.concat(schema.includes || []);
    }

    return this._processNextInclude(includes);
  }

  describeServices = function () {
    var services: any = {};
    for (var name in this.services) {
      var service = this.services[name];
      services[name] = service.description(this.definitions);
    }
    return services;
  }

  toXML(): string {
    return this.xml || '';
  }

  objectToXML(obj: any, name: string|null, namespace: any|null, nsURI: string, isFirst: boolean = false, xmlnsAttr: any = {}, schemaObject?: any, nsContext?: any): string {
    var self = this;
    var schema = this.definitions.schemas[nsURI];

    var parentNsPrefix = namespace ? namespace.parent : undefined;
    if (typeof parentNsPrefix !== 'undefined') {
      //we got the parentNsPrefix for our array. setting the namespace-variable back to the current namespace string
      namespace = namespace.current;
    }

    parentNsPrefix = noColonNameSpace(parentNsPrefix);
    if (this.isIgnoredNameSpace(parentNsPrefix)) {
      parentNsPrefix = '';
    }

    var soapHeader = !schema;
    var qualified = schema && schema.$elementFormDefault === 'qualified';
    var parts = [];
    var prefixNamespace = (namespace || qualified) && namespace !== TNS_PREFIX;

    var xmlnsAttrib = '';
    if (nsURI && isFirst) {
      if (self.options.overrideRootElement && self.options.overrideRootElement.xmlnsAttributes) {
        self.options.overrideRootElement.xmlnsAttributes.forEach(function (attribute: any) {
          xmlnsAttrib += ' ' + attribute.name + '="' + attribute.value + '"';
        });
      } else {
        if (prefixNamespace && !this.isIgnoredNameSpace(namespace)) {
          // resolve the prefix namespace
          xmlnsAttrib += ' xmlns:' + namespace + '="' + nsURI + '"';
        }
        // only add default namespace if the schema elementFormDefault is qualified
        if (qualified || soapHeader) xmlnsAttrib += ' xmlns="' + nsURI + '"';
      }
    }

    if (!nsContext) {
      nsContext = new NamespaceContext();
      nsContext.declareNamespace(namespace, nsURI);
    } else {
      nsContext.pushContext();
    }

    // explicitly use xmlns attribute if available
    if (xmlnsAttr && !(self.options.overrideRootElement && self.options.overrideRootElement.xmlnsAttributes)) {
      xmlnsAttrib = xmlnsAttr;
    }

    var ns: any = '';

    if (self.options.overrideRootElement && isFirst) {
      ns = self.options.overrideRootElement.namespace;
    } else if (prefixNamespace && (qualified || isFirst || soapHeader) && !this.isIgnoredNameSpace(namespace)) {
      ns = namespace;
    }

    var i, n;
    // start building out XML string.
    if (Array.isArray(obj)) {
      for (i = 0, n = obj.length; i < n; i++) {
        var item = obj[i];
        var arrayAttr = self.processAttributes(item, nsContext),
          correctOuterNsPrefix = parentNsPrefix || ns; //using the parent namespace prefix if given

        parts.push(['<', appendColon(correctOuterNsPrefix), name, arrayAttr, xmlnsAttrib, '>'].join(''));
        parts.push(self.objectToXML(item, name, namespace, nsURI, false, null, schemaObject, nsContext));
        parts.push(['</', appendColon(correctOuterNsPrefix), name, '>'].join(''));
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
        } else if (name[0] === ':') {
          emptyNonSubNameSpace = true;
          name = name.substr(1);
        }

        if (isFirst) {
          value = self.objectToXML(child, name, namespace, nsURI, false, null, schemaObject, nsContext);
        } else {

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

                var childNsPrefix: any = '';
                var childName: any = '';
                var childNsURI: any;
                var childXmlnsAttrib: any = '';

                var elementQName = childSchemaObject.$ref || childSchemaObject.$name;
                if (elementQName) {
                  elementQName = splitQName(elementQName);
                  childName = elementQName.name;
                  if (elementQName.prefix === TNS_PREFIX) {
                    // Local element
                    childNsURI = childSchemaObject.$targetNamespace;
                    childNsPrefix = nsContext.registerNamespace(childNsURI);
                    if (this.isIgnoredNameSpace(childNsPrefix)) {
                      childNsPrefix = namespace;
                    }
                  } else {
                    childNsPrefix = elementQName.prefix;
                    if (this.isIgnoredNameSpace(childNsPrefix)) {
                      childNsPrefix = namespace;
                    }
                    childNsURI = schema.xmlns[childNsPrefix] || self.definitions.xmlns[childNsPrefix];
                  }

                  var unqualified = false;
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
                } else {
                  resolvedChildSchemaObject =
                    self.findSchemaObject(childNsURI, childName) || childSchemaObject;
                }

                if (childSchemaObject.$baseNameSpace && this.options.ignoreBaseNameSpaces) {
                  childNsPrefix = namespace;
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
                var completeChildParamTypeObject = self.findChildSchemaObject(
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

                value = self.objectToXML(child, name, namespace, nsURI, false, null, null, nsContext);
              }
            } else {
              value = self.objectToXML(child, name, namespace, nsURI, false, null, null, nsContext);
            }
          }
        }

        ns = noColonNameSpace(ns);
        if (prefixNamespace && !qualified && isFirst && !self.options.overrideRootElement) {
          ns = namespace;
        } else if (this.isIgnoredNameSpace(ns)) {
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
    } else if (obj !== undefined) {
      parts.push((self.options.escapeXML) ? xmlEscape(obj) : obj);
    }
    nsContext.popContext();
    return parts.join('');
  }

  /**
 * Create RPC style xml string from the parameters
 * @param {string} name
 * @param {*} params
 * @param {string} nsPrefix
 * @param {string} nsURI
 * @param {boolean} isParts
 * @returns {string}
 */
  objectToRpcXML(name: string, params: any, nsPrefix: any, nsURI: string, isParts: boolean): string {
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
  }

  /**
 * Create document style xml string from the parameters
 * @param {String} name
 * @param {*} params
 * @param {String} nsPrefix
 * @param {String} nsURI
 * @param {String} type
 */
  objectToDocumentXML(name: string, params: any, nsPrefix: string, nsURI: string, type: string) {
    var args: any = {};
    args[name] = params;
    var parameterTypeObj = type ? this.findSchemaObject(nsURI, type) : null;
    return this.objectToXML(args, null, nsPrefix, nsURI, true, null, parameterTypeObj);
  }

  isIgnoredNameSpace(ns: string) {
    return this.options.ignoredNamespaces.indexOf(ns) > -1;
  }

  filterOutIgnoredNameSpace(ns: string) {
    var namespace = noColonNameSpace(ns);
    return this.isIgnoredNameSpace(namespace) ? '' : namespace;
  }

  processAttributes(child: any, nsContext: any) {
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
      } else {
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
        } else {
          attr += ' ' + attrKey + '="' + xmlEscape(attrObj[attrKey]) + '"';
        }
      }
    }

    return attr;
  }

  findSchemaType(name: any, nsURI: any) {
    if (!this.definitions.schemas || !name || !nsURI) {
      return null;
    }

    var schema = this.definitions.schemas[nsURI];
    if (!schema || !schema.complexTypes) {
      return null;
    }

    return schema.complexTypes[name];
  }

  findChildSchemaObject(parameterTypeObj: any, childName: any, backtrace: any = []): any {
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

    var found = null,
      i = 0,
      child,
      ref;

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
      } else {
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
  }

  /**
 * Look up a XSD type or element by namespace URI and name
 * @param {String} nsURI Namespace URI
 * @param {String} qname Local or qualified name
 * @returns {*} The XSD type/element definition
 */
  findSchemaObject = function (nsURI: string, qname: string): any {
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
  }

  xmlToObject(xml: any, callback?: any) {
    var self = this;
    // var p = typeof callback === 'function' ? {} : saxParser(true, {});
    var p = sax.parser(true, {});
    var objectName: any = null;
    var root: any = {};
    var schema: any = {
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
    var stack: any[] = [{ name: null, object: root, schema: schema }];
    var xmlns: any = {};

    var refs: any = {}, id; // {id:{hrefs:[],obj:}, ...}

    p.onopentag = function (node: any) {
      var nsName = node.name;
      var attrs = node.attributes;

      var name = splitQName(nsName).name,
        attributeName,
        top = stack[stack.length - 1],
        topSchema = top.schema,
        elementAttributes: any = {},
        hasNonXmlnsAttribute = false,
        hasNilAttribute = false,
        obj: any = {};
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
          } else if ((/Request$/).test(name)) {
            isInput = true;
            name = name.replace(/Request$/, '');
          } else if ((/Solicit$/).test(name)) {
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
          } else {
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
        } else {
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
      var cur = stack.pop(),
        obj = cur.object,
        top = stack[stack.length - 1],
        topObject = top.object,
        topSchema = top.schema,
        name = splitQName(nsName).name;

      if (typeof cur.schema === 'string' && (cur.schema === 'string' || cur.schema.split(':')[1] === 'string')) {
        if (typeof obj === 'object' && Object.keys(obj).length === 0) obj = cur.object = '';
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
      text = trim(text);
      if (!text.length) {
        return;
      }

      if (/<\?xml[\s\S]+\?>/.test(text)) {
        var top = stack[stack.length - 1];
        var value = self.xmlToObject(text);
        if (top.object[self.options.attributesKey]) {
          top.object[self.options.valueKey] = value;
        } else {
          top.object = value;
        }
      } else {
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
      var name = splitQName(top.schema).name,
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
      var saxStream = sax.createStream(true, {});
      saxStream.on('opentag', p.onopentag);
      saxStream.on('closetag', p.onclosetag);
      saxStream.on('cdata', p.oncdata);
      saxStream.on('text', p.ontext);
      xml.pipe(saxStream)
        .on('error', function (err: any) {
          callback(err);
        })
        .on('end', function () {
          var r;
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
          var error: any = new Error(code + ': ' + string + (detail ? ': ' + detail : ''));
          error.root = root;
          throw error;
        }
        return root.Envelope;
      }
      return root;
    }
  }

  private _processNextInclude(includes: any[]): any {
    this.definitions
  }

  private _initializeOptions(options: WSDLOptions) {
    this._originalIgnoredNamespaces = (options || {}).ignoredNamespaces;
    this.options = {};

    var ignoredNamespaces = options ? options.ignoredNamespaces : null;

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
   
    // Allow any request headers to keep passing through
    // this.options.wsdl_headers = options.wsdl_headers;
    // this.options.wsdl_options = options.wsdl_options;
    
    // if (options.httpClient) {
    //   this.options.httpClient = options.httpClient;
    // }

    // // The supplied request-object should be passed through
    // if (options.request) {
    //   this.options.request = options.request;
    // }

    var ignoreBaseNameSpaces = options ? options.ignoreBaseNameSpaces : null;
    if (ignoreBaseNameSpaces !== null && typeof ignoreBaseNameSpaces !== 'undefined') {
      this.options.ignoreBaseNameSpaces = ignoreBaseNameSpaces;
    } else {
      this.options.ignoreBaseNameSpaces = this.ignoreBaseNameSpaces;
    }

    // Works only in client
    // this.options.forceSoap12Headers = options.forceSoap12Headers;
    // TODO: understand customDeserializer
    // this.options.customDeserializer = options.customDeserializer;

    // TODO: understand overrideRootElement
    // if (options.overrideRootElement !== undefined) {
    //   this.options.overrideRootElement = options.overrideRootElement;
    // }
  }

  private _fromXML(xml: any): any {
    this.definitions = this._parse(xml);
    this.definitions.descriptions = {
      types: {}
    };

    this.xml = xml;
    return this.definitions;
  }

  private _parse(xml: any): Element {
    let self = this,
      p = sax.parser(true, {}),
      stack: any = [],
      root: any = null,
      types = null,
      schema = null,
      options = self.options;

    p.onopentag = function (node) {
      var nsName = node.name;
      var attrs = node.attributes;

      var top = stack[stack.length - 1];
      var name;

      if (top) {
        try {
          stack = top.startElement(stack, nsName, attrs, options);
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
      var top = stack[stack.length - 1];
      // assert(top, 'Unmatched close tag: ' + name);
      stack = top.endElement(stack, name);

    };

    p.write(xml).close();
    return root;
  }

  private _xmlnsMap(): string {
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
  }
}

class Element {
  ignoredNamespaces: any;
  xmlKey: any;
  nsName: any;
  prefix: any;
  name: any;
  children: any[] = [];
  xmlns: any;
  valueKey: any;
  allowedChildren: any = {};
  $targetNamespace: any;
  $name: any;

  $maxOccurs: any;
  $minOccurs: any;
  $ref: any;
  $base: any;
  $type: any;
  schemas: any;
  messages: any;
  portTypes: any;
  bindings: any;
  services: any;
  includes: any[] = [];
  elements: any;
  types: any;
  complexTypes: any;
  element: any;
  parts: any;
  soapAction: string;
  style: string;
  outputSoap: any;
  inputSoap: any;
  output: any;
  input: any;
  methods: any = {};
  transport: string;
  location: any;
  ports: any = {};
  encodingStyle: any;
  use: any;

  constructor(nsName: any, attrs: any = {}, options: any = {}) {
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
          (this as any)[this.valueKey] = attrs[key];
        } else {
          (this as any)['$' + key] = attrs[key];
        }
      }
    }
    if (this.$targetNamespace !== undefined) {
      // Add targetNamespace to the mapping
      this.xmlns[TNS_PREFIX] = this.$targetNamespace;
    }

    // this.allowedChildren = mapElementTypes(splitQName(nsName).name);
  }

  private _initializeOptions(options: any) {
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

  deleteFixedAttrs() {
    this.children && this.children.length === 0 && delete this.children;
    this.xmlns && Object.keys(this.xmlns).length === 0 && delete this.xmlns;
    delete this.nsName;
    delete this.prefix;
    delete this.name;
  };

  startElement(stack: any, nsName: any, attrs: any, options: any) {
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

    let ChildClass = ElementTypeMap[splitQName(nsName).name][0];
    if (ChildClass) {
      stack.push(new ChildClass(nsName, attrs, options))
    };

    return stack;
  }

  unexpected(name: any) {
    throw new Error('Found unexpected element (' + name + ') inside ' + this.nsName);
  }

  endElement(stack: any, nsName: any) {
    if (this.nsName === nsName) {
      if (stack.length < 2)
        return;
      var parent: Element = stack[stack.length - 2];
      if (this !== stack[0]) {
        _.defaultsDeep(stack[0].xmlns, this.xmlns);
        // delete this.xmlns;
        parent.children.push(this);
        parent.addChild(this);
      }
      stack.pop();
    }

    return stack;
  }

  addChild(child: any) { return }

  description(definitions: any = {}, xmlns?: any): any {
    return this.$name || this.name;
  }

  init() {

  }
}

class MessageElement extends Element {
  constructor(nsName: any, attrs: any = {}, options: any = {}) {
    super(nsName, attrs, options);
    this.init();
  }

  init() {
    this.element = null;
    this.parts = null;
  }

  description(definitions: any = {}, xmlns?: any): any {
    if (this.element) {
      return this.element && this.element.description(definitions);
    }
    var desc: any = {};
    desc[this.$name] = this.parts;
    return desc;
  }

  postProcess(definitions: any) {
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
      var lookupTypes = [],
        elementChildren;

      delete this.parts;

      nsName = splitQName(part.$element);
      ns = nsName.prefix;
      var schema = definitions.schemas[definitions.xmlns[ns]];
      this.element = schema.elements[nsName.name];
      if (!this.element) { return; }
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
    } else {
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
  }

  private _createLookupTypeObject(nsString: any, xmlns: any) {
    var splittedNSString = splitQName(nsString),
      nsAlias = splittedNSString.prefix,
      splittedName = splittedNSString.name.split('#'),
      type = splittedName[0],
      name = splittedName[1],
      lookupTypeObj: any = {};

    lookupTypeObj.$namespace = xmlns[nsAlias];
    lookupTypeObj.$type = nsAlias + ':' + type;
    lookupTypeObj.$name = name;

    return lookupTypeObj;
  }

  private _getNestedLookupTypeString(element: any) {
    var resolvedType = '^',
      excluded = this.ignoredNamespaces.concat('xs'); // do not process $type values wich start with

    if (element.hasOwnProperty('$type') && typeof element.$type === 'string') {
      if (excluded.indexOf(element.$type.split(':')[0]) === -1) {
        resolvedType += ('_' + element.$type + '#' + element.$name);
      }
    }

    if (element.children.length > 0) {
      element.children.forEach((child: any) => {
        var resolvedChildType = this._getNestedLookupTypeString(child).replace(/\^_/, '');

        if (resolvedChildType && typeof resolvedChildType === 'string') {
          resolvedType += ('_' + resolvedChildType);
        }
      });
    }

    return resolvedType;
  }
}

class SchemaElement extends Element {
  constructor(nsName: any, attrs: any = {}, options: any = {}) {
    super(nsName, attrs, options);
    this.init();
  }

  init() {
    this.complexTypes = {};
    this.types = {};
    this.elements = {};
    this.includes = [];
  }

  merge(source: any): SchemaElement {
    //assert(source instanceof SchemaElement);
    if (this.$targetNamespace === source.$targetNamespace) {
      _.merge(this.complexTypes, source.complexTypes);
      _.merge(this.types, source.types);
      _.merge(this.elements, source.elements);
      _.merge(this.xmlns, source.xmlns);
    }

    return this;
  }

  addChild(child: any) {
    if (child.$name in Primitives) return;
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
  }
}

class TypesElement extends Element {
  constructor(nsName: any, attrs: any = {}, options: any = {}) {
    super(nsName, attrs, options);

    this.init();
  }

  init() {
    this.schemas = {};
  }

  addChild(child: any) {
    //assert(child instanceof SchemaElement);

    var targetNamespace = child.$targetNamespace;

    if (!this.schemas.hasOwnProperty(targetNamespace)) {
      this.schemas[targetNamespace] = child;
    } else {
      console.error('Target-Namespace "' + targetNamespace + '" already in use by another Schema!');
    }
  }
}

class ElementElement extends Element {
  constructor(nsName: any, attrs: any = {}, options: any = {}) {
    super(nsName, attrs, options);
    this.init();
  }

  description(definitions: any = {}, xmlns?: any): any {
    var element: any = {},
      name = this.$name;
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
      var typeName = type.name,
        ns = xmlns && xmlns[type.prefix] || definitions.xmlns[type.prefix],
        schema = definitions.schemas[ns],
        typeElement = schema && (this.$type ? schema.complexTypes[typeName] || schema.types[typeName] : schema.elements[typeName]);

      if (ns && definitions.schemas[ns]) {
        xmlns = definitions.schemas[ns].xmlns;
      }

      if (typeElement && !(typeName in Primitives)) {

        if (!(typeName in definitions.descriptions.types)) {

          var elem: any = {};
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
  }
}

class AnyElement extends Element {
  constructor(nsName: any, attrs: any = {}, options: any = {}) {
    super(nsName, attrs, options);

    this.init();
  }

  description(definitions: any = {}, xmlns?: any): any {
    var children = this.children;
    var sequence: any = {};
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
  }
}

class InputElement extends Element {
  constructor(nsName: any, attrs: any = {}, options: any = {}) {
    super(nsName, attrs, options);

    this.init();
  }

  addChild(child: any) {
    if (child.name === 'body') {
      this.use = child.$use;
      if (this.use === 'encoded') {
        this.encodingStyle = child.$encodingStyle;
      }
      this.children.pop();
    }
  }
}

class OutputElement extends Element {
  constructor(nsName: any, attrs: any = {}, options: any = {}) {
    super(nsName, attrs, options);

    this.init();
  }

  addChild(child: any) {
    if (child.name === 'body') {
      this.use = child.$use;
      if (this.use === 'encoded') {
        this.encodingStyle = child.$encodingStyle;
      }
      this.children.pop();
    }
  }
}

class SimpleTypeElement extends Element {
  constructor(nsName: any, attrs: any = {}, options: any = {}) {
    super(nsName, attrs, options);

    this.init();
  }

  description(definitions: any = {}, xmlns?: any): any {
    var children = this.children;
    for (var i = 0, child; child = children[i]; i++) {
      if (child instanceof RestrictionElement)
        return this.$name + "|" + child.description();
    }
    return {};
  }
}

class RestrictionElement extends Element {
  constructor(nsName: any, attrs: any = {}, options: any = {}) {
    super(nsName, attrs, options);

    this.init();
  }

  description(definitions: any = {}, xmlns?: any): any {
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
      var type = splitQName(this.$base),
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
    var base = this.$base ? this.$base + "|" : "";
    return base + this.children.map(function (child) {
      return child.description();
    }).join(",");
  }
}

class ExtensionElement extends Element {
  constructor(nsName: any, attrs: any = {}, options: any = {}) {
    super(nsName, attrs, options);

    this.init();
  }

  description(definitions: any = {}, xmlns?: any) {
    var children = this.children;
    var desc = {};
    for (var i = 0, child; child = children[i]; i++) {
      if (child instanceof SequenceElement ||
        child instanceof ChoiceElement) {
        desc = child.description(definitions, xmlns);
      }
    }
    if (this.$base) {
      var type = splitQName(this.$base),
        typeName = type.name,
        ns = xmlns && xmlns[type.prefix] || definitions.xmlns[type.prefix],
        schema = definitions.schemas[ns];

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
  }
}

class ChoiceElement extends Element {
  constructor(nsName: any, attrs: any = {}, options: any = {}) {
    super(nsName, attrs, options);

    this.init();
  }

  description(definitions: any = {}, xmlns?: any) {
    var children = this.children;
    var choice: any = {};
    for (var i = 0, child; child = children[i]; i++) {
      var description = child.description(definitions, xmlns);
      for (var key in description) {
        choice[key] = description[key];
      }
    }
    return choice;
  }
}

class EnumerationElement extends Element {
  constructor(nsName: any, attrs: any = {}, options: any = {}) {
    super(nsName, attrs, options);

    this.init();
  }

  description(definitions: any = {}, xmlns?: any): any {
    return (this as any)[this.valueKey];
  }
}

class ComplexTypeElement extends Element {
  constructor(nsName: any, attrs: any = {}, options: any = {}) {
    super(nsName, attrs, options);

    this.init();
  }

  description(definitions: any = {}, xmlns?: any): any {
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
  }
}

class ComplexContentElement extends Element {
  constructor(nsName: any, attrs: any = {}, options: any = {}) {
    super(nsName, attrs, options);

    this.init();
  }

  description(definitions: any = {}, xmlns?: any): any {
    var children = this.children;
    for (var i = 0, child; child = children[i]; i++) {
      if (child instanceof ExtensionElement) {
        return child.description(definitions, xmlns);
      }
    }
    return {};
  }
}

class SimpleContentElement extends Element {
  constructor(nsName: any, attrs: any = {}, options: any = {}) {
    super(nsName, attrs, options);

    this.init();
  }

  description(definitions: any = {}, xmlns?: any): any {
    var children = this.children;
    for (var i = 0, child; child = children[i]; i++) {
      if (child instanceof ExtensionElement) {
        return child.description(definitions, xmlns);
      }
    }
    return {};
  }
}

class SequenceElement extends Element {
  constructor(nsName: any, attrs: any = {}, options: any = {}) {
    super(nsName, attrs, options);

    this.init();
  }

  description(definitions: any = {}, xmlns?: any): any {
    var children = this.children;
    var sequence: any = {};
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
  }
}

class AllElement extends Element {
  constructor(nsName: any, attrs: any = {}, options: any = {}) {
    super(nsName, attrs, options);

    this.init();
  }

  description(definitions: any = {}, xmlns?: any): any {
    var children = this.children;
    var sequence: any = {};
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
  }
}

class OperationElement extends Element {

  constructor(nsName: any, attrs: any = {}, options: any = {}) {
    super(nsName, attrs, options);

    this.init();
  }

  init() {
    this.input = null;
    this.output = null;
    this.inputSoap = null;
    this.outputSoap = null;
    this.style = '';
    this.soapAction = '';
  }

  addChild(child: any) {
    if (child.name === 'operation') {
      this.soapAction = child.$soapAction || '';
      this.style = child.$style || '';
      this.children.pop();
    }
  }

  postProcess(definitions: any, tag: any) {
    var children = this.children;
    for (var i = 0, child; child = children[i]; i++) {
      if (child.name !== 'input' && child.name !== 'output')
        continue;
      if (tag === 'binding') {
        (this as any)[child.name] = child;
        children.splice(i--, 1);
        continue;
      }
      var messageName = splitQName(child.$message).name;
      var message = definitions.messages[messageName];
      message.postProcess(definitions);
      if (message.element) {
        definitions.messages[message.element.$name] = message;
        (this as any)[child.name] = message.element;
      }
      else {
        (this as any)[child.name] = message;
      }
      children.splice(i--, 1);
    }
    this.deleteFixedAttrs();
  }

  description(definitions: any = {}, xmlns?: any): any {
    var inputDesc = this.input ? this.input.description(definitions) : null;
    var outputDesc = this.output ? this.output.description(definitions) : null;
    return {
      input: inputDesc && inputDesc[Object.keys(inputDesc)[0]],
      output: outputDesc && outputDesc[Object.keys(outputDesc)[0]]
    }
  }
}

class PortTypeElement extends Element {
  constructor(nsName: any, attrs: any = {}, options: any = {}) {
    super(nsName, attrs, options);

    this.init();
  }

  init() {
    this.methods = {};
  }

  postProcess(definitions: any) {
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
  }

  description(definitions: any = {}, xmlns?: any): any {
    var methods: any = {};
    for (var name in this.methods) {
      var method = this.methods[name];
      methods[name] = method.description(definitions);
    }
    return methods;
  }

}

class BindingElement extends Element {
  constructor(nsName: any, attrs: any = {}, options: any = {}) {
    super(nsName, attrs, options);

    this.init();
  }

  init() {
    this.transport = '';
    this.style = '';
    this.methods = {};
  }

  addChild(child: any) {
    if (child.name === 'binding') {
      this.transport = child.$transport;
      this.style = child.$style;
      this.children.pop();
    }
  }

  postProcess(definitions: any) {
    var type = splitQName(this.$type).name,
      portType = definitions.portTypes[type],
      style = this.style,
      children = this.children;
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
  }

  description(definitions: any = {}, xmlns?: any): any {
    var methods: any = {};
    for (var name in this.methods) {
      var method = this.methods[name];
      methods[name] = method.description(definitions);
    }
    return methods;
  }
}

class PortElement extends Element {
  constructor(nsName: any, attrs: any = {}, options: any = {}) {
    super(nsName, attrs, options);

    this.init();
  }

  init() {
    this.location = null;
  }

  addChild(child: any) {
    if (child.name === 'address' && typeof (child.$location) !== 'undefined') {
      this.location = child.$location;
    }
  }
}

class ServiceElement extends Element {
  constructor(nsName: any, attrs: any = {}, options: any = {}) {
    super(nsName, attrs, options);

    this.init();
  }

  init() {
    this.ports = {};
  }

  postProcess(definitions: any) {
    var children = this.children,
      bindings = definitions.bindings;
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
  }

  description(definitions: any = {}, xmlns?: any): any {
    var ports: any = {};
    for (var name in this.ports) {
      var port = this.ports[name];
      ports[name] = port.binding.description(definitions);
    }
    return ports;
  }
}

class DefinitionsElement extends Element {
  constructor(nsName: any, attrs: any = {}, options: any = {}) {
    super(nsName, attrs, options);

    this.init();
  }

  init() {
    if (this.name !== 'definitions') this.unexpected(this.nsName);
    this.messages = {};
    this.portTypes = {};
    this.bindings = {};
    this.services = {};
    this.schemas = {};
  }

  addChild(child: any) {
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
  }
}

class DocumentationElement extends Element {
  constructor(nsName: any, attrs: any = {}, options: any = {}) {
    super(nsName, attrs, options);

    this.init();
  }
}

const ElementTypeMap: any = {
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
}