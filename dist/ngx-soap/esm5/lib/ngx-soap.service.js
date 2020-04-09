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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNvYXAuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb2FwLyIsInNvdXJjZXMiOlsibGliL25neC1zb2FwLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUMzQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7OztBQWVsRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sMEJBQTBCLENBQUE7QUFFbkQ7SUFLRSx3QkFBb0IsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtJQUFJLENBQUM7Ozs7Ozs7SUFFekMscUNBQVk7Ozs7OztJQUFaLFVBQWEsT0FBZSxFQUFFLE9BQWlCLEVBQUUsUUFBaUI7UUFBcEMsd0JBQUEsRUFBQSxZQUFpQjtRQUM3QyxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDL0IsT0FBTyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBRTtJQUNuRCxDQUFDOztnQkFWRixVQUFVLFNBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzs7O2dCQW5CUSxVQUFVOzs7eUJBRm5CO0NBOEJDLEFBWEQsSUFXQztTQVJZLGNBQWM7Ozs7OztJQUViLDhCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSAnLi9zb2FwL3NvYXAnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBDbGllbnQgfSBmcm9tICcuL3NvYXAvaW50ZXJmYWNlcyc7XHJcblxyXG5leHBvcnQge1xyXG4gIENsaWVudCxcclxuICBXU0RMLFxyXG4gIElTb2FwTWV0aG9kLFxyXG4gIElTb2FwTWV0aG9kUmVzcG9uc2UsXHJcbiAgQmFzaWNBdXRoU2VjdXJpdHksXHJcbiAgQmVhcmVyU2VjdXJpdHksXHJcbiAgLy8gV1NTZWN1cml0eUNlcnQsXHJcbiAgV1NTZWN1cml0eSxcclxuICBOVExNU2VjdXJpdHlcclxufSBmcm9tICcuL3NvYXAvaW50ZXJmYWNlcyc7XHJcblxyXG5leHBvcnQgeyBzZWN1cml0eSB9IGZyb20gJy4vc29hcC9zZWN1cml0eS9zZWN1cml0eSdcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIE5neFNvYXBTZXJ2aWNlIHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7IH1cclxuXHJcbiAgY3JlYXRlQ2xpZW50KHdzZGxVcmw6IHN0cmluZywgb3B0aW9uczogYW55ID0ge30sIGVuZHBvaW50Pzogc3RyaW5nKTogUHJvbWlzZTxDbGllbnQ+IHtcclxuICAgIG9wdGlvbnMuaHR0cENsaWVudCA9IHRoaXMuaHR0cDtcclxuICAgIHJldHVybiBjcmVhdGVDbGllbnQod3NkbFVybCwgb3B0aW9ucywgZW5kcG9pbnQpIDtcclxuICB9XHJcbn1cclxuIl19