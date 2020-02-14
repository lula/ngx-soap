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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29hcC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb2FwLyIsInNvdXJjZXMiOlsibGliL3NvYXAvc29hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7O0FBRUgsT0FBTyxLQUFLLElBQUksTUFBTSxRQUFRLENBQUM7QUFDL0IsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDbEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNsQyxPQUFPLEVBQUUsUUFBUSxFQUFHLE1BQU0scUJBQXFCLENBQUM7QUFFaEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUN4QyxNQUFNLENBQUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUU5QixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxxQkFBcUI7QUFFdkMsTUFBTSxZQUFZLEdBQUcsQ0FBTyxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUU7SUFDMUMsMENBQTBDO0lBQzFDLDhCQUE4QjtJQUM5QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNkLHNDQUFzQztRQUN0QyxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNuQjtTQUFNO1FBQ0wsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDOUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNsQixPQUFPLElBQUksQ0FBQztRQUNkLENBQUMsQ0FBQyxDQUFBO0tBQ0g7QUFDSCxDQUFDLENBQUEsQ0FBQztBQUVGLFNBQWUsWUFBWSxDQUFDLEdBQUcsRUFBRSxPQUFPOztRQUN0QyxJQUFJLE9BQU8sQ0FBQyxZQUFZLEtBQUssSUFBSSxFQUFFO1lBQ2pDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDckM7YUFBTTtZQUNMLE9BQU8sWUFBWSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUNuQztJQUVILENBQUM7Q0FBQTtBQUVELE1BQU0sVUFBZ0IsWUFBWSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsUUFBUTs7UUFDdkQsSUFBSSxPQUFPLE9BQU8sS0FBSyxXQUFXLEVBQUU7WUFDbEMsT0FBTyxHQUFHLEVBQUUsQ0FBQztTQUNkO1FBQ0QsdUNBQXVDO1FBQ3ZDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQztRQUV4QyxNQUFNLElBQUksR0FBRyxNQUFNLFlBQVksQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDOUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNuRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0NBQUE7QUFFRCxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxRQUFRLENBQUMsaUJBQWlCLENBQUM7QUFDNUQsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUM7QUFDbEQsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUM7QUFDOUMseURBQXlEO0FBQ3pELE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDO0FBQ3RELCtEQUErRDtBQUMvRCxxRUFBcUUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDExIFZpbmF5IFB1bGltIDx2aW5heUBtaWxld2lzZS5jb20+XG4gKiBNSVQgTGljZW5zZWRcbiAqL1xuXG5pbXBvcnQgKiBhcyB3c2RsIGZyb20gJy4vd3NkbCc7XG5pbXBvcnQgeyBzZWN1cml0eSB9IGZyb20gJy4vc2VjdXJpdHkvc2VjdXJpdHknO1xuaW1wb3J0IHsgQ2xpZW50IH0gZnJvbSAnLi9jbGllbnQnO1xuZXhwb3J0IHsgQ2xpZW50IH0gZnJvbSAnLi9jbGllbnQnO1xuZXhwb3J0IHsgc2VjdXJpdHkgIH0gZnJvbSAnLi9zZWN1cml0eS9zZWN1cml0eSc7XG5cbmV4cG9ydCB7IHBhc3N3b3JkRGlnZXN0IH0gZnJvbSAnLi91dGlscydcbmV4cG9ydCBjb25zdCBXU0RMID0gd3NkbC5XU0RMO1xuXG5jb25zdCBjYWNoZSA9IHt9OyAvLyBUT0RPIHNvbWUgY2FjaGluZz9cblxuY29uc3QgZ2V0RnJvbUNhY2hlID0gYXN5bmMgKHVybCwgb3B0aW9ucykgPT4ge1xuICAvLyBjb25zb2xlLmxvZygnR2V0dGluZyBmcm9tIGNhY2hlJywgdXJsKTtcbiAgLy8gY29uc29sZS5sb2coJ0NhY2hlJywgY2FjaGUpXG4gIGlmIChjYWNoZVt1cmxdKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ0ZvdW5kIGluIGNhY2hlJywgdXJsKTtcbiAgICByZXR1cm4gY2FjaGVbdXJsXTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gd3NkbC5vcGVuX3dzZGwodXJsLCBvcHRpb25zKS50aGVuKHdzZGwgPT4ge1xuICAgICAgY2FjaGVbdXJsXSA9IHdzZGw7XG4gICAgICByZXR1cm4gd3NkbDtcbiAgICB9KVxuICB9XG59O1xuXG5hc3luYyBmdW5jdGlvbiBfcmVxdWVzdFdTREwodXJsLCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zLmRpc2FibGVDYWNoZSA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiB3c2RsLm9wZW5fd3NkbCh1cmwsIG9wdGlvbnMpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBnZXRGcm9tQ2FjaGUodXJsLCBvcHRpb25zKTtcbiAgfVxuXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVDbGllbnQodXJsLCBvcHRpb25zLCBlbmRwb2ludCk6IFByb21pc2U8YW55PiB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgLy8gY29uc29sZS5sb2coXCJjcmVhdGVDbGllbnRcIiwgb3B0aW9ucylcbiAgZW5kcG9pbnQgPSBvcHRpb25zLmVuZHBvaW50IHx8IGVuZHBvaW50O1xuICBcbiAgY29uc3Qgd3NkbCA9IGF3YWl0IF9yZXF1ZXN0V1NETCh1cmwsIG9wdGlvbnMpO1xuICBjb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50KHdzZGwsIGVuZHBvaW50LCBvcHRpb25zKTtcbiAgcmV0dXJuIGNsaWVudDtcbn1cblxuZXhwb3J0IGNvbnN0IEJhc2ljQXV0aFNlY3VyaXR5ID0gc2VjdXJpdHkuQmFzaWNBdXRoU2VjdXJpdHk7XG5leHBvcnQgY29uc3QgTlRMTVNlY3VyaXR5ID0gc2VjdXJpdHkuTlRMTVNlY3VyaXR5O1xuZXhwb3J0IGNvbnN0IFdTU2VjdXJpdHkgPSBzZWN1cml0eS5XU1NlY3VyaXR5O1xuLy8gZXhwb3J0IGNvbnN0IFdTU2VjdXJpdHlDZXJ0ID0gc2VjdXJpdHkuV1NTZWN1cml0eUNlcnQ7XG5leHBvcnQgY29uc3QgQmVhcmVyU2VjdXJpdHkgPSBzZWN1cml0eS5CZWFyZXJTZWN1cml0eTtcbi8vIGV4cG9ydCBjb25zdCBDbGllbnRTU0xTZWN1cml0eSA9IHNlY3VyaXR5LkNsaWVudFNTTFNlY3VyaXR5O1xuLy8gZXhwb3J0IGNvbnN0IENsaWVudFNTTFNlY3VyaXR5UEZYID0gc2VjdXJpdHkuQ2xpZW50U1NMU2VjdXJpdHlQRlg7XG4iXX0=