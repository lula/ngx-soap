import 'rxjs/add/operator/map';
import { Client } from "./libts/client";
export declare class SOAPService {
    constructor();
    createClient(wsdlDef: string, options?: any): Promise<Client>;
}
