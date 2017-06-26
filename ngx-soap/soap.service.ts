import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';

import { createSoapClient } from "../libts/soap";

@Injectable()
export class SOAPService {
  
  constructor() { }

  createClient(http: Http, url: string, options: any = {}): Promise<any> {
    return createSoapClient(url, http, options);
  }
}