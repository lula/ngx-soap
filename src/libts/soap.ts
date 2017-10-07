import { openWsdl } from './wsdl';
import { Client } from "./client";

export function createSoapClient(wsdl: string, options: any = {}): Promise<Client> { 
  return openWsdl(wsdl, options)
    .then(wsdl => {
      return new Client(wsdl);
    })
    .catch(err => {throw new Error(err)});
}