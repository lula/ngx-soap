import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import { createSoapClient } from "./libts/soap";
import { Client, ClientOptions} from "./libts/client";
import { HttpClient } from '@angular/common/http';

export interface OperationResponse {
  status?: number,
  xml?: string,
  json?: any
}

export interface RequestOptions {
  proxy?: {
    address: string,
    path: string
  };
}

@Injectable()
export class SOAPService {
  
  constructor(private http: HttpClient) { }

  createClient(wsdlDef: string, options?: ClientOptions): Client {
    return createSoapClient(wsdlDef);
  }

}