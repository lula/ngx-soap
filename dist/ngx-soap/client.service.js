import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Client } from "../libts/client";
var ClientService = (function () {
    function ClientService(http) {
        this.http = http;
    }
    ClientService.prototype.createWithDefinition = function (wsdl, endpoint, options) {
        if (options === void 0) { options = {}; }
        return new Promise(function (resolve) { return resolve(new Client(wsdl, endpoint, options)); });
    };
    return ClientService;
}());
export { ClientService };
ClientService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ClientService.ctorParameters = function () { return [
    { type: Http, },
]; };
//# sourceMappingURL=client.service.js.map