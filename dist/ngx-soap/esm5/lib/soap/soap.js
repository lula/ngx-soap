/*
 * Copyright (c) 2011 Vinay Pulim <vinay@milewise.com>
 * MIT Licensed
 */
import { __awaiter, __generator } from "tslib";
import * as wsdl from './wsdl';
import { security } from './security/security';
import { Client } from './client';
export { Client } from './client';
export { security } from './security/security';
export { passwordDigest } from './utils';
export var WSDL = wsdl.WSDL;
var cache = {}; // TODO some caching?
var getFromCache = function (url, options) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // console.log('Getting from cache', url);
        // console.log('Cache', cache)
        if (cache[url]) {
            // console.log('Found in cache', url);
            return [2 /*return*/, cache[url]];
        }
        else {
            return [2 /*return*/, wsdl.open_wsdl(url, options).then(function (wsdl) {
                    cache[url] = wsdl;
                    return wsdl;
                })];
        }
        return [2 /*return*/];
    });
}); };
function _requestWSDL(url, options) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (options.disableCache === true) {
                return [2 /*return*/, wsdl.open_wsdl(url, options)];
            }
            else {
                return [2 /*return*/, getFromCache(url, options)];
            }
            return [2 /*return*/];
        });
    });
}
export function createClient(url, options, endpoint) {
    return __awaiter(this, void 0, void 0, function () {
        var wsdl, client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof options === 'undefined') {
                        options = {};
                    }
                    // console.log("createClient", options)
                    endpoint = options.endpoint || endpoint;
                    return [4 /*yield*/, _requestWSDL(url, options)];
                case 1:
                    wsdl = _a.sent();
                    client = new Client(wsdl, endpoint, options);
                    return [2 /*return*/, client];
            }
        });
    });
}
export var BasicAuthSecurity = security.BasicAuthSecurity;
export var NTLMSecurity = security.NTLMSecurity;
export var WSSecurity = security.WSSecurity;
// export const WSSecurityCert = security.WSSecurityCert;
export var BearerSecurity = security.BearerSecurity;
// export const ClientSSLSecurity = security.ClientSSLSecurity;
// export const ClientSSLSecurityPFX = security.ClientSSLSecurityPFX;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29hcC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb2FwLyIsInNvdXJjZXMiOlsibGliL3NvYXAvc29hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7O0FBRUgsT0FBTyxLQUFLLElBQUksTUFBTSxRQUFRLENBQUM7QUFDL0IsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDbEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNsQyxPQUFPLEVBQUUsUUFBUSxFQUFHLE1BQU0scUJBQXFCLENBQUM7QUFFaEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUN4QyxNQUFNLENBQUMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUU5QixJQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxxQkFBcUI7QUFFdkMsSUFBTSxZQUFZLEdBQUcsVUFBTyxHQUFHLEVBQUUsT0FBTzs7UUFDdEMsMENBQTBDO1FBQzFDLDhCQUE4QjtRQUM5QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNkLHNDQUFzQztZQUN0QyxzQkFBTyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUM7U0FDbkI7YUFBTTtZQUNMLHNCQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUk7b0JBQzNDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7b0JBQ2xCLE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUMsQ0FBQyxFQUFBO1NBQ0g7OztLQUNGLENBQUM7QUFFRixTQUFlLFlBQVksQ0FBQyxHQUFHLEVBQUUsT0FBTzs7O1lBQ3RDLElBQUksT0FBTyxDQUFDLFlBQVksS0FBSyxJQUFJLEVBQUU7Z0JBQ2pDLHNCQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxFQUFDO2FBQ3JDO2lCQUFNO2dCQUNMLHNCQUFPLFlBQVksQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEVBQUM7YUFDbkM7Ozs7Q0FFRjtBQUVELE1BQU0sVUFBZ0IsWUFBWSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsUUFBUTs7Ozs7O29CQUN2RCxJQUFJLE9BQU8sT0FBTyxLQUFLLFdBQVcsRUFBRTt3QkFDbEMsT0FBTyxHQUFHLEVBQUUsQ0FBQztxQkFDZDtvQkFDRCx1Q0FBdUM7b0JBQ3ZDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQztvQkFFM0IscUJBQU0sWUFBWSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsRUFBQTs7b0JBQXZDLElBQUksR0FBRyxTQUFnQztvQkFDdkMsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7b0JBQ25ELHNCQUFPLE1BQU0sRUFBQzs7OztDQUNmO0FBRUQsTUFBTSxDQUFDLElBQU0saUJBQWlCLEdBQUcsUUFBUSxDQUFDLGlCQUFpQixDQUFDO0FBQzVELE1BQU0sQ0FBQyxJQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDO0FBQ2xELE1BQU0sQ0FBQyxJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDO0FBQzlDLHlEQUF5RDtBQUN6RCxNQUFNLENBQUMsSUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQztBQUN0RCwrREFBK0Q7QUFDL0QscUVBQXFFIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogQ29weXJpZ2h0IChjKSAyMDExIFZpbmF5IFB1bGltIDx2aW5heUBtaWxld2lzZS5jb20+XHJcbiAqIE1JVCBMaWNlbnNlZFxyXG4gKi9cclxuXHJcbmltcG9ydCAqIGFzIHdzZGwgZnJvbSAnLi93c2RsJztcclxuaW1wb3J0IHsgc2VjdXJpdHkgfSBmcm9tICcuL3NlY3VyaXR5L3NlY3VyaXR5JztcclxuaW1wb3J0IHsgQ2xpZW50IH0gZnJvbSAnLi9jbGllbnQnO1xyXG5leHBvcnQgeyBDbGllbnQgfSBmcm9tICcuL2NsaWVudCc7XHJcbmV4cG9ydCB7IHNlY3VyaXR5ICB9IGZyb20gJy4vc2VjdXJpdHkvc2VjdXJpdHknO1xyXG5cclxuZXhwb3J0IHsgcGFzc3dvcmREaWdlc3QgfSBmcm9tICcuL3V0aWxzJ1xyXG5leHBvcnQgY29uc3QgV1NETCA9IHdzZGwuV1NETDtcclxuXHJcbmNvbnN0IGNhY2hlID0ge307IC8vIFRPRE8gc29tZSBjYWNoaW5nP1xyXG5cclxuY29uc3QgZ2V0RnJvbUNhY2hlID0gYXN5bmMgKHVybCwgb3B0aW9ucykgPT4ge1xyXG4gIC8vIGNvbnNvbGUubG9nKCdHZXR0aW5nIGZyb20gY2FjaGUnLCB1cmwpO1xyXG4gIC8vIGNvbnNvbGUubG9nKCdDYWNoZScsIGNhY2hlKVxyXG4gIGlmIChjYWNoZVt1cmxdKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnRm91bmQgaW4gY2FjaGUnLCB1cmwpO1xyXG4gICAgcmV0dXJuIGNhY2hlW3VybF07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB3c2RsLm9wZW5fd3NkbCh1cmwsIG9wdGlvbnMpLnRoZW4od3NkbCA9PiB7XHJcbiAgICAgIGNhY2hlW3VybF0gPSB3c2RsO1xyXG4gICAgICByZXR1cm4gd3NkbDtcclxuICAgIH0pXHJcbiAgfVxyXG59O1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gX3JlcXVlc3RXU0RMKHVybCwgb3B0aW9ucykge1xyXG4gIGlmIChvcHRpb25zLmRpc2FibGVDYWNoZSA9PT0gdHJ1ZSkge1xyXG4gICAgcmV0dXJuIHdzZGwub3Blbl93c2RsKHVybCwgb3B0aW9ucyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBnZXRGcm9tQ2FjaGUodXJsLCBvcHRpb25zKTtcclxuICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlQ2xpZW50KHVybCwgb3B0aW9ucywgZW5kcG9pbnQpOiBQcm9taXNlPGFueT4ge1xyXG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIG9wdGlvbnMgPSB7fTtcclxuICB9XHJcbiAgLy8gY29uc29sZS5sb2coXCJjcmVhdGVDbGllbnRcIiwgb3B0aW9ucylcclxuICBlbmRwb2ludCA9IG9wdGlvbnMuZW5kcG9pbnQgfHwgZW5kcG9pbnQ7XHJcbiAgXHJcbiAgY29uc3Qgd3NkbCA9IGF3YWl0IF9yZXF1ZXN0V1NETCh1cmwsIG9wdGlvbnMpO1xyXG4gIGNvbnN0IGNsaWVudCA9IG5ldyBDbGllbnQod3NkbCwgZW5kcG9pbnQsIG9wdGlvbnMpO1xyXG4gIHJldHVybiBjbGllbnQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBCYXNpY0F1dGhTZWN1cml0eSA9IHNlY3VyaXR5LkJhc2ljQXV0aFNlY3VyaXR5O1xyXG5leHBvcnQgY29uc3QgTlRMTVNlY3VyaXR5ID0gc2VjdXJpdHkuTlRMTVNlY3VyaXR5O1xyXG5leHBvcnQgY29uc3QgV1NTZWN1cml0eSA9IHNlY3VyaXR5LldTU2VjdXJpdHk7XHJcbi8vIGV4cG9ydCBjb25zdCBXU1NlY3VyaXR5Q2VydCA9IHNlY3VyaXR5LldTU2VjdXJpdHlDZXJ0O1xyXG5leHBvcnQgY29uc3QgQmVhcmVyU2VjdXJpdHkgPSBzZWN1cml0eS5CZWFyZXJTZWN1cml0eTtcclxuLy8gZXhwb3J0IGNvbnN0IENsaWVudFNTTFNlY3VyaXR5ID0gc2VjdXJpdHkuQ2xpZW50U1NMU2VjdXJpdHk7XHJcbi8vIGV4cG9ydCBjb25zdCBDbGllbnRTU0xTZWN1cml0eVBGWCA9IHNlY3VyaXR5LkNsaWVudFNTTFNlY3VyaXR5UEZYO1xyXG4iXX0=