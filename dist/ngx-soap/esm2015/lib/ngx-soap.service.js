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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNvYXAuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb2FwLyIsInNvdXJjZXMiOlsibGliL25neC1zb2FwLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUMzQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7OztBQWVsRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sMEJBQTBCLENBQUE7QUFLbkQsTUFBTSxPQUFPLGNBQWM7Ozs7SUFFekIsWUFBb0IsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtJQUFJLENBQUM7Ozs7Ozs7SUFFekMsWUFBWSxDQUFDLE9BQWUsRUFBRSxVQUFlLEVBQUUsRUFBRSxRQUFpQjtRQUNoRSxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDL0IsT0FBTyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBRTtJQUNuRCxDQUFDOzs7WUFWRixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7Ozs7WUFuQlEsVUFBVTs7Ozs7Ozs7SUFzQkwsOEJBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSAnLi9zb2FwL3NvYXAnO1xuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IENsaWVudCB9IGZyb20gJy4vc29hcC9pbnRlcmZhY2VzJztcblxuZXhwb3J0IHtcbiAgQ2xpZW50LFxuICBXU0RMLFxuICBJU29hcE1ldGhvZCxcbiAgSVNvYXBNZXRob2RSZXNwb25zZSxcbiAgQmFzaWNBdXRoU2VjdXJpdHksXG4gIEJlYXJlclNlY3VyaXR5LFxuICAvLyBXU1NlY3VyaXR5Q2VydCxcbiAgV1NTZWN1cml0eSxcbiAgTlRMTVNlY3VyaXR5XG59IGZyb20gJy4vc29hcC9pbnRlcmZhY2VzJztcblxuZXhwb3J0IHsgc2VjdXJpdHkgfSBmcm9tICcuL3NvYXAvc2VjdXJpdHkvc2VjdXJpdHknXG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE5neFNvYXBTZXJ2aWNlIHtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHsgfVxuXG4gIGNyZWF0ZUNsaWVudCh3c2RsVXJsOiBzdHJpbmcsIG9wdGlvbnM6IGFueSA9IHt9LCBlbmRwb2ludD86IHN0cmluZyk6IFByb21pc2U8Q2xpZW50PiB7XG4gICAgb3B0aW9ucy5odHRwQ2xpZW50ID0gdGhpcy5odHRwO1xuICAgIHJldHVybiBjcmVhdGVDbGllbnQod3NkbFVybCwgb3B0aW9ucywgZW5kcG9pbnQpIDtcbiAgfVxufVxuIl19