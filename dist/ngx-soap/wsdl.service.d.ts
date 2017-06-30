import { Http } from '@angular/http';
import { WSDL } from '../libts/wsdl';
export declare class WSDLService {
    private http;
    constructor(http: Http);
    openWsdl(url: any, options?: any): Promise<WSDL>;
}
