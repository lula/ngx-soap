/*
 * Copyright (c) 2011 Vinay Pulim <vinay@milewise.com>
 * MIT Licensed
 */
import { __awaiter } from "tslib";
import * as wsdl from './wsdl';
import { security } from './security/security';
import { Client } from './client';
export { Client } from './client';
export { security } from './security/security';
export { passwordDigest } from './utils';
export const WSDL = wsdl.WSDL;
const cache = {}; // TODO some caching?
const getFromCache = (url, options) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('Getting from cache', url);
    // console.log('Cache', cache)
    if (cache[url]) {
        // console.log('Found in cache', url);
        return cache[url];
    }
    else {
        return wsdl.open_wsdl(url, options).then(wsdl => {
            cache[url] = wsdl;
            return wsdl;
        });
    }
});
function _requestWSDL(url, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (options.disableCache === true) {
            return wsdl.open_wsdl(url, options);
        }
        else {
            return getFromCache(url, options);
        }
    });
}
export function createClient(url, options, endpoint) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof options === 'undefined') {
            options = {};
        }
        // console.log("createClient", options)
        endpoint = options.endpoint || endpoint;
        const wsdl = yield _requestWSDL(url, options);
        const client = new Client(wsdl, endpoint, options);
        return client;
    });
}
export const BasicAuthSecurity = security.BasicAuthSecurity;
export const NTLMSecurity = security.NTLMSecurity;
export const WSSecurity = security.WSSecurity;
// export const WSSecurityCert = security.WSSecurityCert;
export const BearerSecurity = security.BearerSecurity;
// export const ClientSSLSecurity = security.ClientSSLSecurity;
// export const ClientSSLSecurityPFX = security.ClientSSLSecurityPFX;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29hcC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb2FwLyIsInNvdXJjZXMiOlsibGliL3NvYXAvc29hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7O0FBRUgsT0FBTyxLQUFLLElBQUksTUFBTSxRQUFRLENBQUM7QUFDL0IsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDbEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNsQyxPQUFPLEVBQUUsUUFBUSxFQUFHLE1BQU0scUJBQXFCLENBQUM7QUFFaEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUN4QyxNQUFNLENBQUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUU5QixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxxQkFBcUI7QUFFdkMsTUFBTSxZQUFZLEdBQUcsQ0FBTyxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUU7SUFDMUMsMENBQTBDO0lBQzFDLDhCQUE4QjtJQUM5QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNkLHNDQUFzQztRQUN0QyxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNuQjtTQUFNO1FBQ0wsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDOUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNsQixPQUFPLElBQUksQ0FBQztRQUNkLENBQUMsQ0FBQyxDQUFBO0tBQ0g7QUFDSCxDQUFDLENBQUEsQ0FBQztBQUVGLFNBQWUsWUFBWSxDQUFDLEdBQUcsRUFBRSxPQUFPOztRQUN0QyxJQUFJLE9BQU8sQ0FBQyxZQUFZLEtBQUssSUFBSSxFQUFFO1lBQ2pDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDckM7YUFBTTtZQUNMLE9BQU8sWUFBWSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUNuQztJQUVILENBQUM7Q0FBQTtBQUVELE1BQU0sVUFBZ0IsWUFBWSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsUUFBUTs7UUFDdkQsSUFBSSxPQUFPLE9BQU8sS0FBSyxXQUFXLEVBQUU7WUFDbEMsT0FBTyxHQUFHLEVBQUUsQ0FBQztTQUNkO1FBQ0QsdUNBQXVDO1FBQ3ZDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQztRQUV4QyxNQUFNLElBQUksR0FBRyxNQUFNLFlBQVksQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDOUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNuRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0NBQUE7QUFFRCxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxRQUFRLENBQUMsaUJBQWlCLENBQUM7QUFDNUQsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUM7QUFDbEQsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUM7QUFDOUMseURBQXlEO0FBQ3pELE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDO0FBQ3RELCtEQUErRDtBQUMvRCxxRUFBcUUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTEgVmluYXkgUHVsaW0gPHZpbmF5QG1pbGV3aXNlLmNvbT5cclxuICogTUlUIExpY2Vuc2VkXHJcbiAqL1xyXG5cclxuaW1wb3J0ICogYXMgd3NkbCBmcm9tICcuL3dzZGwnO1xyXG5pbXBvcnQgeyBzZWN1cml0eSB9IGZyb20gJy4vc2VjdXJpdHkvc2VjdXJpdHknO1xyXG5pbXBvcnQgeyBDbGllbnQgfSBmcm9tICcuL2NsaWVudCc7XHJcbmV4cG9ydCB7IENsaWVudCB9IGZyb20gJy4vY2xpZW50JztcclxuZXhwb3J0IHsgc2VjdXJpdHkgIH0gZnJvbSAnLi9zZWN1cml0eS9zZWN1cml0eSc7XHJcblxyXG5leHBvcnQgeyBwYXNzd29yZERpZ2VzdCB9IGZyb20gJy4vdXRpbHMnXHJcbmV4cG9ydCBjb25zdCBXU0RMID0gd3NkbC5XU0RMO1xyXG5cclxuY29uc3QgY2FjaGUgPSB7fTsgLy8gVE9ETyBzb21lIGNhY2hpbmc/XHJcblxyXG5jb25zdCBnZXRGcm9tQ2FjaGUgPSBhc3luYyAodXJsLCBvcHRpb25zKSA9PiB7XHJcbiAgLy8gY29uc29sZS5sb2coJ0dldHRpbmcgZnJvbSBjYWNoZScsIHVybCk7XHJcbiAgLy8gY29uc29sZS5sb2coJ0NhY2hlJywgY2FjaGUpXHJcbiAgaWYgKGNhY2hlW3VybF0pIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdGb3VuZCBpbiBjYWNoZScsIHVybCk7XHJcbiAgICByZXR1cm4gY2FjaGVbdXJsXTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHdzZGwub3Blbl93c2RsKHVybCwgb3B0aW9ucykudGhlbih3c2RsID0+IHtcclxuICAgICAgY2FjaGVbdXJsXSA9IHdzZGw7XHJcbiAgICAgIHJldHVybiB3c2RsO1xyXG4gICAgfSlcclxuICB9XHJcbn07XHJcblxyXG5hc3luYyBmdW5jdGlvbiBfcmVxdWVzdFdTREwodXJsLCBvcHRpb25zKSB7XHJcbiAgaWYgKG9wdGlvbnMuZGlzYWJsZUNhY2hlID09PSB0cnVlKSB7XHJcbiAgICByZXR1cm4gd3NkbC5vcGVuX3dzZGwodXJsLCBvcHRpb25zKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGdldEZyb21DYWNoZSh1cmwsIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVDbGllbnQodXJsLCBvcHRpb25zLCBlbmRwb2ludCk6IFByb21pc2U8YW55PiB7XHJcbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgb3B0aW9ucyA9IHt9O1xyXG4gIH1cclxuICAvLyBjb25zb2xlLmxvZyhcImNyZWF0ZUNsaWVudFwiLCBvcHRpb25zKVxyXG4gIGVuZHBvaW50ID0gb3B0aW9ucy5lbmRwb2ludCB8fCBlbmRwb2ludDtcclxuICBcclxuICBjb25zdCB3c2RsID0gYXdhaXQgX3JlcXVlc3RXU0RMKHVybCwgb3B0aW9ucyk7XHJcbiAgY29uc3QgY2xpZW50ID0gbmV3IENsaWVudCh3c2RsLCBlbmRwb2ludCwgb3B0aW9ucyk7XHJcbiAgcmV0dXJuIGNsaWVudDtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IEJhc2ljQXV0aFNlY3VyaXR5ID0gc2VjdXJpdHkuQmFzaWNBdXRoU2VjdXJpdHk7XHJcbmV4cG9ydCBjb25zdCBOVExNU2VjdXJpdHkgPSBzZWN1cml0eS5OVExNU2VjdXJpdHk7XHJcbmV4cG9ydCBjb25zdCBXU1NlY3VyaXR5ID0gc2VjdXJpdHkuV1NTZWN1cml0eTtcclxuLy8gZXhwb3J0IGNvbnN0IFdTU2VjdXJpdHlDZXJ0ID0gc2VjdXJpdHkuV1NTZWN1cml0eUNlcnQ7XHJcbmV4cG9ydCBjb25zdCBCZWFyZXJTZWN1cml0eSA9IHNlY3VyaXR5LkJlYXJlclNlY3VyaXR5O1xyXG4vLyBleHBvcnQgY29uc3QgQ2xpZW50U1NMU2VjdXJpdHkgPSBzZWN1cml0eS5DbGllbnRTU0xTZWN1cml0eTtcclxuLy8gZXhwb3J0IGNvbnN0IENsaWVudFNTTFNlY3VyaXR5UEZYID0gc2VjdXJpdHkuQ2xpZW50U1NMU2VjdXJpdHlQRlg7XHJcbiJdfQ==