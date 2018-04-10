import { openWsdl, WSDLOptions } from './wsdl';
import { Client, ClientOptions } from "./client";

export function createSoapClient(wsdlDef: string, clientOptions: ClientOptions = {}): Client { 
  // TODO: to be released? Uh?
  let wsdlOptions: WSDLOptions = {};
  
  let wsdl = openWsdl(wsdlDef, wsdlOptions);
  return new Client(wsdl, clientOptions);

}