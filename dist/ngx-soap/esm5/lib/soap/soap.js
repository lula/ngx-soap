var _this = this;
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
/*
 * Copyright (c) 2011 Vinay Pulim <vinay@milewise.com>
 * MIT Licensed
 */
import * as wsdl from './wsdl';
import { security } from './security/security';
import { Client } from './client';
export { Client } from './client';
export { security } from './security/security';
export { passwordDigest } from './utils';
/** @type {?} */
export var WSDL = wsdl.WSDL;
/** @type {?} */
var cache = {};
// TODO some caching?
/** @type {?} */
var getFromCache = function (url, options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
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
var ɵ0 = getFromCache;
/**
 * @param {?} url
 * @param {?} options
 * @return {?}
 */
function _requestWSDL(url, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
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
/**
 * @param {?} url
 * @param {?} options
 * @param {?} endpoint
 * @return {?}
 */
export function createClient(url, options, endpoint) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var wsdl, client;
        return tslib_1.__generator(this, function (_a) {
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
/** @type {?} */
export var BasicAuthSecurity = security.BasicAuthSecurity;
/** @type {?} */
export var NTLMSecurity = security.NTLMSecurity;
/** @type {?} */
export var WSSecurity = security.WSSecurity;
// export const WSSecurityCert = security.WSSecurityCert;
/** @type {?} */
export var BearerSecurity = security.BearerSecurity;
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29hcC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb2FwLyIsInNvdXJjZXMiOlsibGliL3NvYXAvc29hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLQSxpQkFxREE7Ozs7Ozs7Ozs7QUFyREEsT0FBTyxLQUFLLElBQUksTUFBTSxRQUFRLENBQUM7QUFDL0IsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDbEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNsQyxPQUFPLEVBQUUsUUFBUSxFQUFHLE1BQU0scUJBQXFCLENBQUM7QUFFaEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLFNBQVMsQ0FBQTs7QUFDeEMsTUFBTSxLQUFPLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSTs7SUFFdkIsS0FBSyxHQUFHLEVBQUU7OztJQUVWLFlBQVksR0FBRyxVQUFPLEdBQUcsRUFBRSxPQUFPOztRQUN0QywwQ0FBMEM7UUFDMUMsOEJBQThCO1FBQzlCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2Qsc0NBQXNDO1lBQ3RDLHNCQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBQztTQUNuQjthQUFNO1lBQ0wsc0JBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSTtvQkFDM0MsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztvQkFDbEIsT0FBTyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQyxDQUFDLEVBQUE7U0FDSDs7O0tBQ0Y7Ozs7Ozs7QUFFRCxTQUFlLFlBQVksQ0FBQyxHQUFHLEVBQUUsT0FBTzs7O1lBQ3RDLElBQUksT0FBTyxDQUFDLFlBQVksS0FBSyxJQUFJLEVBQUU7Z0JBQ2pDLHNCQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxFQUFDO2FBQ3JDO2lCQUFNO2dCQUNMLHNCQUFPLFlBQVksQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEVBQUM7YUFDbkM7Ozs7Q0FFRjs7Ozs7OztBQUVELE1BQU0sVUFBZ0IsWUFBWSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsUUFBUTs7Ozs7O29CQUN2RCxJQUFJLE9BQU8sT0FBTyxLQUFLLFdBQVcsRUFBRTt3QkFDbEMsT0FBTyxHQUFHLEVBQUUsQ0FBQztxQkFDZDtvQkFDRCx1Q0FBdUM7b0JBQ3ZDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQztvQkFFM0IscUJBQU0sWUFBWSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsRUFBQTs7b0JBQXZDLElBQUksR0FBRyxTQUFnQztvQkFDdkMsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDO29CQUNsRCxzQkFBTyxNQUFNLEVBQUM7Ozs7Q0FDZjs7QUFFRCxNQUFNLEtBQU8saUJBQWlCLEdBQUcsUUFBUSxDQUFDLGlCQUFpQjs7QUFDM0QsTUFBTSxLQUFPLFlBQVksR0FBRyxRQUFRLENBQUMsWUFBWTs7QUFDakQsTUFBTSxLQUFPLFVBQVUsR0FBRyxRQUFRLENBQUMsVUFBVTs7O0FBRTdDLE1BQU0sS0FBTyxjQUFjLEdBQUcsUUFBUSxDQUFDLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDExIFZpbmF5IFB1bGltIDx2aW5heUBtaWxld2lzZS5jb20+XG4gKiBNSVQgTGljZW5zZWRcbiAqL1xuXG5pbXBvcnQgKiBhcyB3c2RsIGZyb20gJy4vd3NkbCc7XG5pbXBvcnQgeyBzZWN1cml0eSB9IGZyb20gJy4vc2VjdXJpdHkvc2VjdXJpdHknO1xuaW1wb3J0IHsgQ2xpZW50IH0gZnJvbSAnLi9jbGllbnQnO1xuZXhwb3J0IHsgQ2xpZW50IH0gZnJvbSAnLi9jbGllbnQnO1xuZXhwb3J0IHsgc2VjdXJpdHkgIH0gZnJvbSAnLi9zZWN1cml0eS9zZWN1cml0eSc7XG5cbmV4cG9ydCB7IHBhc3N3b3JkRGlnZXN0IH0gZnJvbSAnLi91dGlscydcbmV4cG9ydCBjb25zdCBXU0RMID0gd3NkbC5XU0RMO1xuXG5jb25zdCBjYWNoZSA9IHt9OyAvLyBUT0RPIHNvbWUgY2FjaGluZz9cblxuY29uc3QgZ2V0RnJvbUNhY2hlID0gYXN5bmMgKHVybCwgb3B0aW9ucykgPT4ge1xuICAvLyBjb25zb2xlLmxvZygnR2V0dGluZyBmcm9tIGNhY2hlJywgdXJsKTtcbiAgLy8gY29uc29sZS5sb2coJ0NhY2hlJywgY2FjaGUpXG4gIGlmIChjYWNoZVt1cmxdKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ0ZvdW5kIGluIGNhY2hlJywgdXJsKTtcbiAgICByZXR1cm4gY2FjaGVbdXJsXTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gd3NkbC5vcGVuX3dzZGwodXJsLCBvcHRpb25zKS50aGVuKHdzZGwgPT4ge1xuICAgICAgY2FjaGVbdXJsXSA9IHdzZGw7XG4gICAgICByZXR1cm4gd3NkbDtcbiAgICB9KVxuICB9XG59O1xuXG5hc3luYyBmdW5jdGlvbiBfcmVxdWVzdFdTREwodXJsLCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zLmRpc2FibGVDYWNoZSA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiB3c2RsLm9wZW5fd3NkbCh1cmwsIG9wdGlvbnMpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBnZXRGcm9tQ2FjaGUodXJsLCBvcHRpb25zKTtcbiAgfVxuXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVDbGllbnQodXJsLCBvcHRpb25zLCBlbmRwb2ludCk6IFByb21pc2U8YW55PiB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgLy8gY29uc29sZS5sb2coXCJjcmVhdGVDbGllbnRcIiwgb3B0aW9ucylcbiAgZW5kcG9pbnQgPSBvcHRpb25zLmVuZHBvaW50IHx8IGVuZHBvaW50O1xuICBcbiAgY29uc3Qgd3NkbCA9IGF3YWl0IF9yZXF1ZXN0V1NETCh1cmwsIG9wdGlvbnMpO1xuICBjb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50KHdzZGwsIGVuZHBvaW50LCBvcHRpb25zKTtcbiAgcmV0dXJuIGNsaWVudDtcbn1cblxuZXhwb3J0IGNvbnN0IEJhc2ljQXV0aFNlY3VyaXR5ID0gc2VjdXJpdHkuQmFzaWNBdXRoU2VjdXJpdHk7XG5leHBvcnQgY29uc3QgTlRMTVNlY3VyaXR5ID0gc2VjdXJpdHkuTlRMTVNlY3VyaXR5O1xuZXhwb3J0IGNvbnN0IFdTU2VjdXJpdHkgPSBzZWN1cml0eS5XU1NlY3VyaXR5O1xuLy8gZXhwb3J0IGNvbnN0IFdTU2VjdXJpdHlDZXJ0ID0gc2VjdXJpdHkuV1NTZWN1cml0eUNlcnQ7XG5leHBvcnQgY29uc3QgQmVhcmVyU2VjdXJpdHkgPSBzZWN1cml0eS5CZWFyZXJTZWN1cml0eTtcbi8vIGV4cG9ydCBjb25zdCBDbGllbnRTU0xTZWN1cml0eSA9IHNlY3VyaXR5LkNsaWVudFNTTFNlY3VyaXR5O1xuLy8gZXhwb3J0IGNvbnN0IENsaWVudFNTTFNlY3VyaXR5UEZYID0gc2VjdXJpdHkuQ2xpZW50U1NMU2VjdXJpdHlQRlg7XG4iXX0=