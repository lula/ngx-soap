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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29hcC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb2FwLyIsInNvdXJjZXMiOlsibGliL3NvYXAvc29hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLQSxpQkFxREE7Ozs7Ozs7Ozs7QUFyREEsT0FBTyxLQUFLLElBQUksTUFBTSxRQUFRLENBQUM7QUFDL0IsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDbEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNsQyxPQUFPLEVBQUUsUUFBUSxFQUFHLE1BQU0scUJBQXFCLENBQUM7QUFFaEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLFNBQVMsQ0FBQTs7QUFDeEMsTUFBTSxLQUFPLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSTs7SUFFdkIsS0FBSyxHQUFHLEVBQUU7OztJQUVWLFlBQVksR0FBRyxVQUFPLEdBQUcsRUFBRSxPQUFPOztRQUN0QywwQ0FBMEM7UUFDMUMsOEJBQThCO1FBQzlCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2Qsc0NBQXNDO1lBQ3RDLHNCQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBQztTQUNuQjthQUFNO1lBQ0wsc0JBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSTtvQkFDM0MsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztvQkFDbEIsT0FBTyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQyxDQUFDLEVBQUE7U0FDSDs7O0tBQ0Y7Ozs7Ozs7QUFFRCxTQUFlLFlBQVksQ0FBQyxHQUFHLEVBQUUsT0FBTzs7O1lBQ3RDLElBQUksT0FBTyxDQUFDLFlBQVksS0FBSyxJQUFJLEVBQUU7Z0JBQ2pDLHNCQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxFQUFDO2FBQ3JDO2lCQUFNO2dCQUNMLHNCQUFPLFlBQVksQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEVBQUM7YUFDbkM7Ozs7Q0FFRjs7Ozs7OztBQUVELE1BQU0sVUFBZ0IsWUFBWSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsUUFBUTs7Ozs7O29CQUN2RCxJQUFJLE9BQU8sT0FBTyxLQUFLLFdBQVcsRUFBRTt3QkFDbEMsT0FBTyxHQUFHLEVBQUUsQ0FBQztxQkFDZDtvQkFDRCx1Q0FBdUM7b0JBQ3ZDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQztvQkFFM0IscUJBQU0sWUFBWSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsRUFBQTs7b0JBQXZDLElBQUksR0FBRyxTQUFnQztvQkFDdkMsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDO29CQUNsRCxzQkFBTyxNQUFNLEVBQUM7Ozs7Q0FDZjs7QUFFRCxNQUFNLEtBQU8saUJBQWlCLEdBQUcsUUFBUSxDQUFDLGlCQUFpQjs7QUFDM0QsTUFBTSxLQUFPLFlBQVksR0FBRyxRQUFRLENBQUMsWUFBWTs7QUFDakQsTUFBTSxLQUFPLFVBQVUsR0FBRyxRQUFRLENBQUMsVUFBVTs7O0FBRTdDLE1BQU0sS0FBTyxjQUFjLEdBQUcsUUFBUSxDQUFDLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTEgVmluYXkgUHVsaW0gPHZpbmF5QG1pbGV3aXNlLmNvbT5cclxuICogTUlUIExpY2Vuc2VkXHJcbiAqL1xyXG5cclxuaW1wb3J0ICogYXMgd3NkbCBmcm9tICcuL3dzZGwnO1xyXG5pbXBvcnQgeyBzZWN1cml0eSB9IGZyb20gJy4vc2VjdXJpdHkvc2VjdXJpdHknO1xyXG5pbXBvcnQgeyBDbGllbnQgfSBmcm9tICcuL2NsaWVudCc7XHJcbmV4cG9ydCB7IENsaWVudCB9IGZyb20gJy4vY2xpZW50JztcclxuZXhwb3J0IHsgc2VjdXJpdHkgIH0gZnJvbSAnLi9zZWN1cml0eS9zZWN1cml0eSc7XHJcblxyXG5leHBvcnQgeyBwYXNzd29yZERpZ2VzdCB9IGZyb20gJy4vdXRpbHMnXHJcbmV4cG9ydCBjb25zdCBXU0RMID0gd3NkbC5XU0RMO1xyXG5cclxuY29uc3QgY2FjaGUgPSB7fTsgLy8gVE9ETyBzb21lIGNhY2hpbmc/XHJcblxyXG5jb25zdCBnZXRGcm9tQ2FjaGUgPSBhc3luYyAodXJsLCBvcHRpb25zKSA9PiB7XHJcbiAgLy8gY29uc29sZS5sb2coJ0dldHRpbmcgZnJvbSBjYWNoZScsIHVybCk7XHJcbiAgLy8gY29uc29sZS5sb2coJ0NhY2hlJywgY2FjaGUpXHJcbiAgaWYgKGNhY2hlW3VybF0pIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdGb3VuZCBpbiBjYWNoZScsIHVybCk7XHJcbiAgICByZXR1cm4gY2FjaGVbdXJsXTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHdzZGwub3Blbl93c2RsKHVybCwgb3B0aW9ucykudGhlbih3c2RsID0+IHtcclxuICAgICAgY2FjaGVbdXJsXSA9IHdzZGw7XHJcbiAgICAgIHJldHVybiB3c2RsO1xyXG4gICAgfSlcclxuICB9XHJcbn07XHJcblxyXG5hc3luYyBmdW5jdGlvbiBfcmVxdWVzdFdTREwodXJsLCBvcHRpb25zKSB7XHJcbiAgaWYgKG9wdGlvbnMuZGlzYWJsZUNhY2hlID09PSB0cnVlKSB7XHJcbiAgICByZXR1cm4gd3NkbC5vcGVuX3dzZGwodXJsLCBvcHRpb25zKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGdldEZyb21DYWNoZSh1cmwsIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVDbGllbnQodXJsLCBvcHRpb25zLCBlbmRwb2ludCk6IFByb21pc2U8YW55PiB7XHJcbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgb3B0aW9ucyA9IHt9O1xyXG4gIH1cclxuICAvLyBjb25zb2xlLmxvZyhcImNyZWF0ZUNsaWVudFwiLCBvcHRpb25zKVxyXG4gIGVuZHBvaW50ID0gb3B0aW9ucy5lbmRwb2ludCB8fCBlbmRwb2ludDtcclxuICBcclxuICBjb25zdCB3c2RsID0gYXdhaXQgX3JlcXVlc3RXU0RMKHVybCwgb3B0aW9ucyk7XHJcbiAgY29uc3QgY2xpZW50ID0gbmV3IENsaWVudCh3c2RsLCBlbmRwb2ludCwgb3B0aW9ucyk7XHJcbiAgcmV0dXJuIGNsaWVudDtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IEJhc2ljQXV0aFNlY3VyaXR5ID0gc2VjdXJpdHkuQmFzaWNBdXRoU2VjdXJpdHk7XHJcbmV4cG9ydCBjb25zdCBOVExNU2VjdXJpdHkgPSBzZWN1cml0eS5OVExNU2VjdXJpdHk7XHJcbmV4cG9ydCBjb25zdCBXU1NlY3VyaXR5ID0gc2VjdXJpdHkuV1NTZWN1cml0eTtcclxuLy8gZXhwb3J0IGNvbnN0IFdTU2VjdXJpdHlDZXJ0ID0gc2VjdXJpdHkuV1NTZWN1cml0eUNlcnQ7XHJcbmV4cG9ydCBjb25zdCBCZWFyZXJTZWN1cml0eSA9IHNlY3VyaXR5LkJlYXJlclNlY3VyaXR5O1xyXG4vLyBleHBvcnQgY29uc3QgQ2xpZW50U1NMU2VjdXJpdHkgPSBzZWN1cml0eS5DbGllbnRTU0xTZWN1cml0eTtcclxuLy8gZXhwb3J0IGNvbnN0IENsaWVudFNTTFNlY3VyaXR5UEZYID0gc2VjdXJpdHkuQ2xpZW50U1NMU2VjdXJpdHlQRlg7XHJcbiJdfQ==