import * as fs from 'fs';
import * as _ from 'underscore';

import { createSoapClient } from '../src/libts/soap';
import { Client } from '../src/libts/client';

interface Json2TsOptions {
    rootObjectName?: string;
    concatChildObjName?: boolean;
    onlyConcatChildObjNameLastNum?: number
}

class Json2Ts {
    private options: Json2TsOptions = {}

    constructor(options:Json2TsOptions = {}) {
        this.options = options;

        if(this.options.rootObjectName) {
            this.options.rootObjectName = this.toUpperFirstLetter(this.options.rootObjectName);
        }
    }

    convert(content: string): string {
        let jsonContent = JSON.parse(content);

        if (_.isArray(jsonContent)) {
            return this.convertObjectToTsInterfaces(jsonContent[0], this.options.rootObjectName);
        }

        return this.convertObjectToTsInterfaces(jsonContent, this.options.rootObjectName);
    }

    private convertObjectToTsInterfaces(jsonContent: any, objectName: string = "RootObject"): string {
        let optionalKeys: string[] = [];
        let objectResult: string[] = [];

        for (let key in jsonContent) {
            if (/\d+(?!\w)/.test(key)) continue;

            let value = jsonContent[key];
            // let isKeyArray = /.*\[\]$/.test(key);

            if (_.isObject(value) && !_.isArray(value)) {
                let childObjectName = "";
                if (this.options.concatChildObjName) {
                    childObjectName = this.formatConcatChildObjectName(key, objectName);
                } else {
                    childObjectName = this.toUpperFirstLetter(key.replace('[]', ''));
                }

                objectResult.push(this.convertObjectToTsInterfaces(value, childObjectName));
                jsonContent[key] = this.removeMajority(childObjectName) + ";";
            } else if (_.isArray(value)) {
                let arrayTypes: any = this.detectMultiArrayTypes(value);

                if (this.isMultiArray(arrayTypes)) {
                    let multiArrayBrackets = this.getMultiArrayBrackets(value as any);

                    if (this.isAllEqual(arrayTypes)) {
                        jsonContent[key] = arrayTypes[0].replace("[]", multiArrayBrackets);
                    } else {
                        jsonContent[key] = "any" + multiArrayBrackets + ";";
                    }
                } else if (value.length > 0 && _.isObject(value[0])) {
                    let childObjectName = this.toUpperFirstLetter(key);
                    objectResult.push(this.convertObjectToTsInterfaces(value[0], childObjectName));
                    jsonContent[key] = this.removeMajority(childObjectName) + "[];";
                } else {
                    jsonContent[key] = arrayTypes[0];
                }

            } else if (_.isDate(value)) {
                jsonContent[key] = "Date;";
            } else if (_.isString(value)) {
                jsonContent[key] = "string;";
            } else if (_.isBoolean(value)) {
                jsonContent[key] = "boolean;";
            } else if (_.isNumber(value)) {
                jsonContent[key] = "number;";
            } else {
                jsonContent[key] = "any;";
                optionalKeys.push(key);
            }
        }

        objectName = this.toUpperFirstLetter(objectName).replace(new RegExp("-", "g"),'');
        let result = this.formatCharsToTypeScript(jsonContent, objectName, optionalKeys);

        objectResult.push(result.replace("-", ""));

        return objectResult.join("\n\n");
    }

    private detectMultiArrayTypes(value: any, valueType: string[] = []): string[] {
        if (_.isArray(value)) {
            if (value.length === 0) {
                valueType.push("any[];");
            } else if (_.isArray(value[0])) {
                for (let index = 0, length = value.length; index < length; index++) {
                    let element = value[index];

                    let valueTypeResult = this.detectMultiArrayTypes(element, valueType);
                    valueType.concat(valueTypeResult);
                }
            } else if (_.all(value, _.isString)) {
                valueType.push("string[];");
            } else if (_.all(value, _.isNumber)) {
                valueType.push("number[];");
            } else if (_.all(value, _.isBoolean)) {
                valueType.push("boolean[];");
            } else {
                valueType.push("any[];");
            }
        }

        return valueType;
    }

    private isMultiArray(arrayTypes: string[]) {
        return arrayTypes.length > 1;
    }

    private isAllEqual(array: string[]) {
        return _.all(array.slice(1), _.partial(_.isEqual, array[0]));
    }

    private getMultiArrayBrackets(content: string): string {
        let jsonString = JSON.stringify(content);
        let brackets = "";

        for (let index = 0, length = jsonString.length; index < length; index++) {
            let element = jsonString[index];

            if (element === "[") {
                brackets = brackets + "[]";
            } else {
                index = length;
            }
        }

        return brackets;
    }

    private formatCharsToTypeScript(jsonContent: any, objectName: string, optionalKeys: string[]): string {
        let result = JSON.stringify(jsonContent, null, "\t")
            .replace(new RegExp("\"", "g"), "")
            .replace(new RegExp(",", "g"), "");

        let allKeys = _.allKeys(jsonContent);

        for (let index = 0, length = allKeys.length; index < length; index++) {
            let key = allKeys[index];
            // if (_.contains(optionalKeys, key)) {
            //     result = result.replace(new RegExp(key + ":", "g"), this.toLowerFirstLetter(key) + "?:");
            // } else {
            //     result = result.replace(new RegExp(key + ":", "g"), this.toLowerFirstLetter(key) + ":");
            // }

            if (/\d+(?!\w)/.test(key)) {
                result = result.replace(new RegExp('\n\t' + key + ':.*', "g"), "");
                continue;
            }

            let formattedKey = key.replace('[]', '');
            result = result.replace(new RegExp(key.replace('[]', '\\[\\]') + ":", "g"), formattedKey + "?:");
            result = result.split('-').map(this.toUpperFirstLetter).join("");
        }

        objectName = this.removeMajority(objectName).replace('[]', '');
        
        return "export interface " + objectName + " " + result;
    }

    private removeMajority(objectName: string): string {
        if (_.last(objectName, 3).join("").toUpperCase() === "IES") {
            return objectName.substring(0, objectName.length - 3) + "y";
        } else if (_.last(objectName).toUpperCase() === "S") {
            return objectName.substring(0, objectName.length - 1);
        }

        return objectName;
    }

    private toUpperFirstLetter(text: string) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    private toLowerFirstLetter(text: string) {
        return text.charAt(0).toLowerCase() + text.slice(1);
    };

    private formatConcatChildObjectName(key: string, objectName: string): string {
        let ret = this.toUpperFirstLetter(this.toUpperFirstLetter(objectName) + "-" + this.toUpperFirstLetter(key).replace('[]', ''));
        let arr = ret.split("-");

        if(this.options.onlyConcatChildObjNameLastNum > 0) {
            arr = _.last(arr, this.options.onlyConcatChildObjNameLastNum);
        } 
        
        return arr.map(this.toUpperFirstLetter).join("-");
    } 

    isJson(stringContent): boolean {
        try {
            JSON.parse(stringContent);
        } catch (e) {
            return false;
        }
        return true;
    }
}

let handleError = () => {
    console.log("Usage: ");
    console.log("npm run getdef <wsdl_in_file> <definition_out_file>");
    process.exit();
}

let wsdFilePath = process.argv[2];
if (!wsdFilePath) {
    handleError();
}

let outFilePath = process.argv[3];
if (!wsdFilePath) {
    handleError();
}

let rootObjectName = process.argv[4] || _.last(wsdFilePath.split("/"), 1).join('').replace('.', '');

let j2t = new Json2Ts({
    rootObjectName: rootObjectName,
    concatChildObjName: true,
    onlyConcatChildObjNameLastNum: 2
});

let wsdlDef = fs.readFileSync(wsdFilePath).toString();
createSoapClient(wsdlDef)
    .then((client: Client) => {
        let descr = client.describe();
        // fs.writeFile("./test/descr.json", JSON.stringify(descr));
        fs.writeFile(outFilePath, j2t.convert(JSON.stringify(descr)));
    })
    .catch(err => { throw new Error(err) })