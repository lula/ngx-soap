import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
export declare class SOAPService {
    constructor();
    createClient(http: Http, url: string, options?: any): Promise<any>;
}
