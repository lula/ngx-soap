import { Injectable } from '@angular/core';
import { createClient } from './soap/soap';
import { HttpClient } from '@angular/common/http';
import { Client } from './soap/interfaces';

export {
  Client,
  WSDL,
  ISoapMethod,
  ISoapMethodResponse,
  BasicAuthSecurity,
  BearerSecurity,
  // WSSecurityCert,
  WSSecurity,
  NTLMSecurity
} from './soap/interfaces';

export { security } from './soap/security/security'

@Injectable({
  providedIn: 'root'
})
export class NgxSoapService {

  constructor(private http: HttpClient) { }

  createClient(wsdlUrl: string, options: any = {}, endpoint?: string): Promise<Client> {
    options.httpClient = this.http;
    return createClient(wsdlUrl, options, endpoint) ;
  }
}
