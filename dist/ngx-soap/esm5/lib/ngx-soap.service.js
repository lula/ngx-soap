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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNvYXAuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb2FwLyIsInNvdXJjZXMiOlsibGliL25neC1zb2FwLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7O0FBZWxELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQTtBQUVuRDtJQUtFLHdCQUFvQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO0lBQUksQ0FBQztJQUV6QyxxQ0FBWSxHQUFaLFVBQWEsT0FBZSxFQUFFLE9BQWlCLEVBQUUsUUFBaUI7UUFBcEMsd0JBQUEsRUFBQSxZQUFpQjtRQUM3QyxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDL0IsT0FBTyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBRTtJQUNuRCxDQUFDO2dGQVBVLGNBQWM7MERBQWQsY0FBYyxXQUFkLGNBQWMsbUJBRmIsTUFBTTt5QkFwQnBCO0NBOEJDLEFBWEQsSUFXQztTQVJZLGNBQWM7a0RBQWQsY0FBYztjQUgxQixVQUFVO2VBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tICcuL3NvYXAvc29hcCc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgQ2xpZW50IH0gZnJvbSAnLi9zb2FwL2ludGVyZmFjZXMnO1xuXG5leHBvcnQge1xuICBDbGllbnQsXG4gIFdTREwsXG4gIElTb2FwTWV0aG9kLFxuICBJU29hcE1ldGhvZFJlc3BvbnNlLFxuICBCYXNpY0F1dGhTZWN1cml0eSxcbiAgQmVhcmVyU2VjdXJpdHksXG4gIC8vIFdTU2VjdXJpdHlDZXJ0LFxuICBXU1NlY3VyaXR5LFxuICBOVExNU2VjdXJpdHlcbn0gZnJvbSAnLi9zb2FwL2ludGVyZmFjZXMnO1xuXG5leHBvcnQgeyBzZWN1cml0eSB9IGZyb20gJy4vc29hcC9zZWN1cml0eS9zZWN1cml0eSdcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTmd4U29hcFNlcnZpY2Uge1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkgeyB9XG5cbiAgY3JlYXRlQ2xpZW50KHdzZGxVcmw6IHN0cmluZywgb3B0aW9uczogYW55ID0ge30sIGVuZHBvaW50Pzogc3RyaW5nKTogUHJvbWlzZTxDbGllbnQ+IHtcbiAgICBvcHRpb25zLmh0dHBDbGllbnQgPSB0aGlzLmh0dHA7XG4gICAgcmV0dXJuIGNyZWF0ZUNsaWVudCh3c2RsVXJsLCBvcHRpb25zLCBlbmRwb2ludCkgO1xuICB9XG59XG4iXX0=