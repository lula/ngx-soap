import { Injectable } from '@angular/core';
import { createClient } from './soap/soap';
import { HttpClient } from '@angular/common/http';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export { security } from './soap/security/security';
export class NgxSoapService {
    constructor(http) {
        this.http = http;
    }
    createClient(wsdlUrl, options = {}, endpoint) {
        options.httpClient = this.http;
        return createClient(wsdlUrl, options, endpoint);
    }
}
/** @nocollapse */ NgxSoapService.ɵfac = function NgxSoapService_Factory(t) { return new (t || NgxSoapService)(i0.ɵɵinject(i1.HttpClient)); };
/** @nocollapse */ NgxSoapService.ɵprov = i0.ɵɵdefineInjectable({ token: NgxSoapService, factory: NgxSoapService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(NgxSoapService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: i1.HttpClient }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNvYXAuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb2FwLyIsInNvdXJjZXMiOlsibGliL25neC1zb2FwLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7O0FBZWxELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQTtBQUtuRCxNQUFNLE9BQU8sY0FBYztJQUV6QixZQUFvQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO0lBQUksQ0FBQztJQUV6QyxZQUFZLENBQUMsT0FBZSxFQUFFLFVBQWUsRUFBRSxFQUFFLFFBQWlCO1FBQ2hFLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUMvQixPQUFPLFlBQVksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFFO0lBQ25ELENBQUM7OzRFQVBVLGNBQWM7c0RBQWQsY0FBYyxXQUFkLGNBQWMsbUJBRmIsTUFBTTtrREFFUCxjQUFjO2NBSDFCLFVBQVU7ZUFBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGNyZWF0ZUNsaWVudCB9IGZyb20gJy4vc29hcC9zb2FwJztcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBDbGllbnQgfSBmcm9tICcuL3NvYXAvaW50ZXJmYWNlcyc7XG5cbmV4cG9ydCB7XG4gIENsaWVudCxcbiAgV1NETCxcbiAgSVNvYXBNZXRob2QsXG4gIElTb2FwTWV0aG9kUmVzcG9uc2UsXG4gIEJhc2ljQXV0aFNlY3VyaXR5LFxuICBCZWFyZXJTZWN1cml0eSxcbiAgLy8gV1NTZWN1cml0eUNlcnQsXG4gIFdTU2VjdXJpdHksXG4gIE5UTE1TZWN1cml0eVxufSBmcm9tICcuL3NvYXAvaW50ZXJmYWNlcyc7XG5cbmV4cG9ydCB7IHNlY3VyaXR5IH0gZnJvbSAnLi9zb2FwL3NlY3VyaXR5L3NlY3VyaXR5J1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBOZ3hTb2FwU2VydmljZSB7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7IH1cblxuICBjcmVhdGVDbGllbnQod3NkbFVybDogc3RyaW5nLCBvcHRpb25zOiBhbnkgPSB7fSwgZW5kcG9pbnQ/OiBzdHJpbmcpOiBQcm9taXNlPENsaWVudD4ge1xuICAgIG9wdGlvbnMuaHR0cENsaWVudCA9IHRoaXMuaHR0cDtcbiAgICByZXR1cm4gY3JlYXRlQ2xpZW50KHdzZGxVcmwsIG9wdGlvbnMsIGVuZHBvaW50KSA7XG4gIH1cbn1cbiJdfQ==