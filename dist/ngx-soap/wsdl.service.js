import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { openWsdl } from '../libts/wsdl';
var WSDLService = (function () {
    function WSDLService(http) {
        this.http = http;
    }
    WSDLService.prototype.openWsdl = function (url, options) {
        if (options === void 0) { options = {}; }
        return openWsdl(url, this.http, options);
        // .then(wsdl => {
        //   resolve(new Client(wsdl));
        // })
        // .catch(err => reject(err));
        // else resolve(wsdl && new Client(wsdl, endpoint, http, options));
        // });
    };
    return WSDLService;
}());
export { WSDLService };
WSDLService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
WSDLService.ctorParameters = function () { return [
    { type: Http, },
]; };
//# sourceMappingURL=wsdl.service.js.map