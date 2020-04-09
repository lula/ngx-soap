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
    NgxSoapService.prototype.createClient = function (wsdlUrl, options, endpoint) {
        if (options === void 0) { options = {}; }
        options.httpClient = this.http;
        return createClient(wsdlUrl, options, endpoint);
    };
    NgxSoapService.ɵfac = function NgxSoapService_Factory(t) { return new (t || NgxSoapService)(i0.ɵɵinject(i1.HttpClient)); };
    NgxSoapService.ɵprov = i0.ɵɵdefineInjectable({ token: NgxSoapService, factory: NgxSoapService.ɵfac, providedIn: 'root' });
    return NgxSoapService;
}());
export { NgxSoapService };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(NgxSoapService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: i1.HttpClient }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNvYXAuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb2FwLyIsInNvdXJjZXMiOlsibGliL25neC1zb2FwLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7O0FBZWxELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQTtBQUVuRDtJQUtFLHdCQUFvQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO0lBQUksQ0FBQztJQUV6QyxxQ0FBWSxHQUFaLFVBQWEsT0FBZSxFQUFFLE9BQWlCLEVBQUUsUUFBaUI7UUFBcEMsd0JBQUEsRUFBQSxZQUFpQjtRQUM3QyxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDL0IsT0FBTyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBRTtJQUNuRCxDQUFDO2dGQVBVLGNBQWM7MERBQWQsY0FBYyxXQUFkLGNBQWMsbUJBRmIsTUFBTTt5QkFwQnBCO0NBOEJDLEFBWEQsSUFXQztTQVJZLGNBQWM7a0RBQWQsY0FBYztjQUgxQixVQUFVO2VBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IGNyZWF0ZUNsaWVudCB9IGZyb20gJy4vc29hcC9zb2FwJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgQ2xpZW50IH0gZnJvbSAnLi9zb2FwL2ludGVyZmFjZXMnO1xyXG5cclxuZXhwb3J0IHtcclxuICBDbGllbnQsXHJcbiAgV1NETCxcclxuICBJU29hcE1ldGhvZCxcclxuICBJU29hcE1ldGhvZFJlc3BvbnNlLFxyXG4gIEJhc2ljQXV0aFNlY3VyaXR5LFxyXG4gIEJlYXJlclNlY3VyaXR5LFxyXG4gIC8vIFdTU2VjdXJpdHlDZXJ0LFxyXG4gIFdTU2VjdXJpdHksXHJcbiAgTlRMTVNlY3VyaXR5XHJcbn0gZnJvbSAnLi9zb2FwL2ludGVyZmFjZXMnO1xyXG5cclxuZXhwb3J0IHsgc2VjdXJpdHkgfSBmcm9tICcuL3NvYXAvc2VjdXJpdHkvc2VjdXJpdHknXHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hTb2FwU2VydmljZSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkgeyB9XHJcblxyXG4gIGNyZWF0ZUNsaWVudCh3c2RsVXJsOiBzdHJpbmcsIG9wdGlvbnM6IGFueSA9IHt9LCBlbmRwb2ludD86IHN0cmluZyk6IFByb21pc2U8Q2xpZW50PiB7XHJcbiAgICBvcHRpb25zLmh0dHBDbGllbnQgPSB0aGlzLmh0dHA7XHJcbiAgICByZXR1cm4gY3JlYXRlQ2xpZW50KHdzZGxVcmwsIG9wdGlvbnMsIGVuZHBvaW50KSA7XHJcbiAgfVxyXG59XHJcbiJdfQ==