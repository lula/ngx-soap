import { Http } from '@angular/http';
import { WSDL } from '../libts/wsdl';
import { Client } from "../libts/client";
export declare class ClientService {
    private http;
    constructor(http: Http);
    createWithDefinition(wsdl: WSDL, endpoint?: string, options?: any): Promise<Client>;
}
