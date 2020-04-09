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
export class NgxSoapService {
    /**
     * @param {?} http
     */
    constructor(http) {
        this.http = http;
    }
    /**
     * @param {?} wsdlUrl
     * @param {?=} options
     * @param {?=} endpoint
     * @return {?}
     */
    createClient(wsdlUrl, options = {}, endpoint) {
        options.httpClient = this.http;
        return createClient(wsdlUrl, options, endpoint);
    }
}
NgxSoapService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
NgxSoapService.ctorParameters = () => [
    { type: HttpClient }
];
/** @nocollapse */ NgxSoapService.ngInjectableDef = i0.defineInjectable({ factory: function NgxSoapService_Factory() { return new NgxSoapService(i0.inject(i1.HttpClient)); }, token: NgxSoapService, providedIn: "root" });
if (false) {
    /**
     * @type {?}
     * @private
     */
    NgxSoapService.prototype.http;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNvYXAuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb2FwLyIsInNvdXJjZXMiOlsibGliL25neC1zb2FwLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUMzQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7OztBQWVsRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sMEJBQTBCLENBQUE7QUFLbkQsTUFBTSxPQUFPLGNBQWM7Ozs7SUFFekIsWUFBb0IsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtJQUFJLENBQUM7Ozs7Ozs7SUFFekMsWUFBWSxDQUFDLE9BQWUsRUFBRSxVQUFlLEVBQUUsRUFBRSxRQUFpQjtRQUNoRSxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDL0IsT0FBTyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBRTtJQUNuRCxDQUFDOzs7WUFWRixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7Ozs7WUFuQlEsVUFBVTs7Ozs7Ozs7SUFzQkwsOEJBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tICcuL3NvYXAvc29hcCc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IENsaWVudCB9IGZyb20gJy4vc29hcC9pbnRlcmZhY2VzJztcclxuXHJcbmV4cG9ydCB7XHJcbiAgQ2xpZW50LFxyXG4gIFdTREwsXHJcbiAgSVNvYXBNZXRob2QsXHJcbiAgSVNvYXBNZXRob2RSZXNwb25zZSxcclxuICBCYXNpY0F1dGhTZWN1cml0eSxcclxuICBCZWFyZXJTZWN1cml0eSxcclxuICAvLyBXU1NlY3VyaXR5Q2VydCxcclxuICBXU1NlY3VyaXR5LFxyXG4gIE5UTE1TZWN1cml0eVxyXG59IGZyb20gJy4vc29hcC9pbnRlcmZhY2VzJztcclxuXHJcbmV4cG9ydCB7IHNlY3VyaXR5IH0gZnJvbSAnLi9zb2FwL3NlY3VyaXR5L3NlY3VyaXR5J1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTmd4U29hcFNlcnZpY2Uge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHsgfVxyXG5cclxuICBjcmVhdGVDbGllbnQod3NkbFVybDogc3RyaW5nLCBvcHRpb25zOiBhbnkgPSB7fSwgZW5kcG9pbnQ/OiBzdHJpbmcpOiBQcm9taXNlPENsaWVudD4ge1xyXG4gICAgb3B0aW9ucy5odHRwQ2xpZW50ID0gdGhpcy5odHRwO1xyXG4gICAgcmV0dXJuIGNyZWF0ZUNsaWVudCh3c2RsVXJsLCBvcHRpb25zLCBlbmRwb2ludCkgO1xyXG4gIH1cclxufVxyXG4iXX0=