import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import { createSoapClient } from "./libts/soap";
import { Client } from "./libts/client";

@Injectable()
export class SOAPService {

  constructor() { }

  createClient(wsdlDef: string, options: any = {}): Promise<Client> {
    return createSoapClient(wsdlDef, options);
  }
}