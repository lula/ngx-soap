import { HttpClient } from '@angular/common/http';
import { Client } from './soap/interfaces';
export { Client, WSDL, ISoapMethod, ISoapMethodResponse, BasicAuthSecurity, BearerSecurity, WSSecurity, NTLMSecurity } from './soap/interfaces';
export { security } from './soap/security/security';
export declare class NgxSoapService {
    private http;
    constructor(http: HttpClient);
    createClient(wsdlUrl: string, options?: any, endpoint?: string): Promise<Client>;
}
