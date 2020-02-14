/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { createClient } from './soap/soap';
import { HttpClient } from '@angular/common/http';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export { security } from './soap/security/security';
var NgxSoapService = /** @class */ (function () {
    function NgxSoapService(http) {
        this.http = http;
    }
    /**
     * @param {?} wsdlUrl
     * @param {?=} options
     * @param {?=} endpoint
     * @return {?}
     */
    NgxSoapService.prototype.createClient = /**
     * @param {?} wsdlUrl
     * @param {?=} options
     * @param {?=} endpoint
     * @return {?}
     */
    function (wsdlUrl, options, endpoint) {
        if (options === void 0) { options = {}; }
        options.httpClient = this.http;
        return createClient(wsdlUrl, options, endpoint);
    };
    NgxSoapService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    NgxSoapService.ctorParameters = function () { return [
        { type: HttpClient }
    ]; };
    /** @nocollapse */ NgxSoapService.ngInjectableDef = i0.defineInjectable({ factory: function NgxSoapService_Factory() { return new NgxSoapService(i0.inject(i1.HttpClient)); }, token: NgxSoapService, providedIn: "root" });
    return NgxSoapService;
}());
export { NgxSoapService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    NgxSoapService.prototype.http;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNvYXAuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb2FwLyIsInNvdXJjZXMiOlsibGliL25neC1zb2FwLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUMzQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7OztBQWVsRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sMEJBQTBCLENBQUE7QUFFbkQ7SUFLRSx3QkFBb0IsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtJQUFJLENBQUM7Ozs7Ozs7SUFFekMscUNBQVk7Ozs7OztJQUFaLFVBQWEsT0FBZSxFQUFFLE9BQWlCLEVBQUUsUUFBaUI7UUFBcEMsd0JBQUEsRUFBQSxZQUFpQjtRQUM3QyxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDL0IsT0FBTyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBRTtJQUNuRCxDQUFDOztnQkFWRixVQUFVLFNBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzs7O2dCQW5CUSxVQUFVOzs7eUJBRm5CO0NBOEJDLEFBWEQsSUFXQztTQVJZLGNBQWM7Ozs7OztJQUViLDhCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGNyZWF0ZUNsaWVudCB9IGZyb20gJy4vc29hcC9zb2FwJztcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBDbGllbnQgfSBmcm9tICcuL3NvYXAvaW50ZXJmYWNlcyc7XG5cbmV4cG9ydCB7XG4gIENsaWVudCxcbiAgV1NETCxcbiAgSVNvYXBNZXRob2QsXG4gIElTb2FwTWV0aG9kUmVzcG9uc2UsXG4gIEJhc2ljQXV0aFNlY3VyaXR5LFxuICBCZWFyZXJTZWN1cml0eSxcbiAgLy8gV1NTZWN1cml0eUNlcnQsXG4gIFdTU2VjdXJpdHksXG4gIE5UTE1TZWN1cml0eVxufSBmcm9tICcuL3NvYXAvaW50ZXJmYWNlcyc7XG5cbmV4cG9ydCB7IHNlY3VyaXR5IH0gZnJvbSAnLi9zb2FwL3NlY3VyaXR5L3NlY3VyaXR5J1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBOZ3hTb2FwU2VydmljZSB7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7IH1cblxuICBjcmVhdGVDbGllbnQod3NkbFVybDogc3RyaW5nLCBvcHRpb25zOiBhbnkgPSB7fSwgZW5kcG9pbnQ/OiBzdHJpbmcpOiBQcm9taXNlPENsaWVudD4ge1xuICAgIG9wdGlvbnMuaHR0cENsaWVudCA9IHRoaXMuaHR0cDtcbiAgICByZXR1cm4gY3JlYXRlQ2xpZW50KHdzZGxVcmwsIG9wdGlvbnMsIGVuZHBvaW50KSA7XG4gIH1cbn1cbiJdfQ==