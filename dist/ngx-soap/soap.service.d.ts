import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
export declare class SOAPService {
    private http;
    constructor(http: Http);
    call(url: string, options?: any): Promise<any>;
}
