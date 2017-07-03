import { openWsdl } from './wsdl';
import { Client } from "./client";

export function createSoapClient(wsdlDef: any, options:any = {}): Promise<any> { 
  return openWsdl(wsdlDef, options)
    .then(wsdl => {
      return new Client(wsdl);
    })
    .catch(err => {throw new Error(err)});
}