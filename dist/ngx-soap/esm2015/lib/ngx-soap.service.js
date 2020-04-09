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
NgxSoapService.ɵfac = function NgxSoapService_Factory(t) { return new (t || NgxSoapService)(i0.ɵɵinject(i1.HttpClient)); };
NgxSoapService.ɵprov = i0.ɵɵdefineInjectable({ token: NgxSoapService, factory: NgxSoapService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(NgxSoapService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: i1.HttpClient }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNvYXAuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb2FwLyIsInNvdXJjZXMiOlsibGliL25neC1zb2FwLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7O0FBZWxELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQTtBQUtuRCxNQUFNLE9BQU8sY0FBYztJQUV6QixZQUFvQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO0lBQUksQ0FBQztJQUV6QyxZQUFZLENBQUMsT0FBZSxFQUFFLFVBQWUsRUFBRSxFQUFFLFFBQWlCO1FBQ2hFLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUMvQixPQUFPLFlBQVksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFFO0lBQ25ELENBQUM7OzRFQVBVLGNBQWM7c0RBQWQsY0FBYyxXQUFkLGNBQWMsbUJBRmIsTUFBTTtrREFFUCxjQUFjO2NBSDFCLFVBQVU7ZUFBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSAnLi9zb2FwL3NvYXAnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBDbGllbnQgfSBmcm9tICcuL3NvYXAvaW50ZXJmYWNlcyc7XHJcblxyXG5leHBvcnQge1xyXG4gIENsaWVudCxcclxuICBXU0RMLFxyXG4gIElTb2FwTWV0aG9kLFxyXG4gIElTb2FwTWV0aG9kUmVzcG9uc2UsXHJcbiAgQmFzaWNBdXRoU2VjdXJpdHksXHJcbiAgQmVhcmVyU2VjdXJpdHksXHJcbiAgLy8gV1NTZWN1cml0eUNlcnQsXHJcbiAgV1NTZWN1cml0eSxcclxuICBOVExNU2VjdXJpdHlcclxufSBmcm9tICcuL3NvYXAvaW50ZXJmYWNlcyc7XHJcblxyXG5leHBvcnQgeyBzZWN1cml0eSB9IGZyb20gJy4vc29hcC9zZWN1cml0eS9zZWN1cml0eSdcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIE5neFNvYXBTZXJ2aWNlIHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7IH1cclxuXHJcbiAgY3JlYXRlQ2xpZW50KHdzZGxVcmw6IHN0cmluZywgb3B0aW9uczogYW55ID0ge30sIGVuZHBvaW50Pzogc3RyaW5nKTogUHJvbWlzZTxDbGllbnQ+IHtcclxuICAgIG9wdGlvbnMuaHR0cENsaWVudCA9IHRoaXMuaHR0cDtcclxuICAgIHJldHVybiBjcmVhdGVDbGllbnQod3NkbFVybCwgb3B0aW9ucywgZW5kcG9pbnQpIDtcclxuICB9XHJcbn1cclxuIl19