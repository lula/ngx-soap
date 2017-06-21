import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as soap from "../libts/soap";
var SOAPService = (function () {
    function SOAPService(http) {
        this.http = http;
    }
    SOAPService.prototype.call = function (url, options) {
        if (options === void 0) { options = {}; }
        return new Promise(function (resolve, reject) {
            try {
                soap.default.createClient(url, options, function (err, client) {
                    if (err)
                        reject("Error" + err);
                    else
                        resolve("Working!" + client);
                });
            }
            catch (e) {
                reject(e);
            }
        });
    };
    return SOAPService;
}());
export { SOAPService };
// call(url: string, options: any = {}): Observable<any> {
//   return this.getWsdl(url, options);
// }
// getWsdl(url: string, options: any = {}): Observable<any> {
//   options.headers = new Headers();
//   options.headers.append("Content-Type", "text/xml");
//   return this.http.get(url, options).map(response => console.log(response.text()));
// }
SOAPService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
SOAPService.ctorParameters = function () { return [
    { type: Http, },
]; };
//# sourceMappingURL=soap.service.js.map