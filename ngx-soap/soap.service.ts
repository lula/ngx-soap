import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';

import * as soap from "../libts/soap";

@Injectable()
export class SOAPService {
  
  constructor(
    private http: Http
  ) { }

  call(url: string, options: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      try {

        soap.default.createClient(url, options, (err: any, client: any) => {
          if(err) reject("Error" + err)
          else resolve("Working!" + client);
        });
      } catch(e) {
        reject(e)
      }
    });
  }

  // call(url: string, options: any = {}): Observable<any> {
  //   return this.getWsdl(url, options);
  // }

  // getWsdl(url: string, options: any = {}): Observable<any> {
  //   options.headers = new Headers();
  //   options.headers.append("Content-Type", "text/xml");

  //   return this.http.get(url, options).map(response => console.log(response.text()));
  // }
}