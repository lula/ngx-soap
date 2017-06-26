import { findPrefix } from './utils';
import { WSDL, openWsdl } from './wsdl';
import { Client } from "./client";
import { Http } from "@angular/http";

export function createSoapClient(url: any, http: Http, options:any = {}, endpoint?:any): Promise<any> {
  return new Promise((resolve, reject) => {
    endpoint = options.endpoint || endpoint;
    openWsdl(url, http, options)
      .then(wsdl => {
        resolve(new Client(wsdl));
      })
      .catch(err => reject(err));
    
      // else resolve(wsdl && new Client(wsdl, endpoint, http, options));
    // });
  });
}