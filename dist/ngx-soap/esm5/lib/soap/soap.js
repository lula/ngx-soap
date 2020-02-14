/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var _this = this;
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
var getFromCache = (/**
 * @param {?} url
 * @param {?} options
 * @return {?}
 */
function (url, options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        // console.log('Getting from cache', url);
        // console.log('Cache', cache)
        if (cache[url]) {
            // console.log('Found in cache', url);
            return [2 /*return*/, cache[url]];
        }
        else {
            return [2 /*return*/, wsdl.open_wsdl(url, options).then((/**
                 * @param {?} wsdl
                 * @return {?}
                 */
                function (wsdl) {
                    cache[url] = wsdl;
                    return wsdl;
                }))];
        }
        return [2 /*return*/];
    });
}); });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29hcC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb2FwLyIsInNvdXJjZXMiOlsibGliL3NvYXAvc29hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBS0EsaUJBcURBOzs7Ozs7QUFyREEsT0FBTyxLQUFLLElBQUksTUFBTSxRQUFRLENBQUM7QUFDL0IsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDbEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNsQyxPQUFPLEVBQUUsUUFBUSxFQUFHLE1BQU0scUJBQXFCLENBQUM7QUFFaEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLFNBQVMsQ0FBQTs7QUFDeEMsTUFBTSxLQUFPLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSTs7SUFFdkIsS0FBSyxHQUFHLEVBQUU7OztJQUVWLFlBQVk7Ozs7O0FBQUcsVUFBTyxHQUFHLEVBQUUsT0FBTzs7UUFDdEMsMENBQTBDO1FBQzFDLDhCQUE4QjtRQUM5QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNkLHNDQUFzQztZQUN0QyxzQkFBTyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUM7U0FDbkI7YUFBTTtZQUNMLHNCQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUk7Ozs7Z0JBQUMsVUFBQSxJQUFJO29CQUMzQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO29CQUNsQixPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDLEVBQUMsRUFBQTtTQUNIOzs7S0FDRixDQUFBOzs7Ozs7O0FBRUQsU0FBZSxZQUFZLENBQUMsR0FBRyxFQUFFLE9BQU87OztZQUN0QyxJQUFJLE9BQU8sQ0FBQyxZQUFZLEtBQUssSUFBSSxFQUFFO2dCQUNqQyxzQkFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsRUFBQzthQUNyQztpQkFBTTtnQkFDTCxzQkFBTyxZQUFZLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxFQUFDO2FBQ25DOzs7O0NBRUY7Ozs7Ozs7QUFFRCxNQUFNLFVBQWdCLFlBQVksQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLFFBQVE7Ozs7OztvQkFDdkQsSUFBSSxPQUFPLE9BQU8sS0FBSyxXQUFXLEVBQUU7d0JBQ2xDLE9BQU8sR0FBRyxFQUFFLENBQUM7cUJBQ2Q7b0JBQ0QsdUNBQXVDO29CQUN2QyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUM7b0JBRTNCLHFCQUFNLFlBQVksQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEVBQUE7O29CQUF2QyxJQUFJLEdBQUcsU0FBZ0M7b0JBQ3ZDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQztvQkFDbEQsc0JBQU8sTUFBTSxFQUFDOzs7O0NBQ2Y7O0FBRUQsTUFBTSxLQUFPLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxpQkFBaUI7O0FBQzNELE1BQU0sS0FBTyxZQUFZLEdBQUcsUUFBUSxDQUFDLFlBQVk7O0FBQ2pELE1BQU0sS0FBTyxVQUFVLEdBQUcsUUFBUSxDQUFDLFVBQVU7OztBQUU3QyxNQUFNLEtBQU8sY0FBYyxHQUFHLFFBQVEsQ0FBQyxjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxMSBWaW5heSBQdWxpbSA8dmluYXlAbWlsZXdpc2UuY29tPlxuICogTUlUIExpY2Vuc2VkXG4gKi9cblxuaW1wb3J0ICogYXMgd3NkbCBmcm9tICcuL3dzZGwnO1xuaW1wb3J0IHsgc2VjdXJpdHkgfSBmcm9tICcuL3NlY3VyaXR5L3NlY3VyaXR5JztcbmltcG9ydCB7IENsaWVudCB9IGZyb20gJy4vY2xpZW50JztcbmV4cG9ydCB7IENsaWVudCB9IGZyb20gJy4vY2xpZW50JztcbmV4cG9ydCB7IHNlY3VyaXR5ICB9IGZyb20gJy4vc2VjdXJpdHkvc2VjdXJpdHknO1xuXG5leHBvcnQgeyBwYXNzd29yZERpZ2VzdCB9IGZyb20gJy4vdXRpbHMnXG5leHBvcnQgY29uc3QgV1NETCA9IHdzZGwuV1NETDtcblxuY29uc3QgY2FjaGUgPSB7fTsgLy8gVE9ETyBzb21lIGNhY2hpbmc/XG5cbmNvbnN0IGdldEZyb21DYWNoZSA9IGFzeW5jICh1cmwsIG9wdGlvbnMpID0+IHtcbiAgLy8gY29uc29sZS5sb2coJ0dldHRpbmcgZnJvbSBjYWNoZScsIHVybCk7XG4gIC8vIGNvbnNvbGUubG9nKCdDYWNoZScsIGNhY2hlKVxuICBpZiAoY2FjaGVbdXJsXSkge1xuICAgIC8vIGNvbnNvbGUubG9nKCdGb3VuZCBpbiBjYWNoZScsIHVybCk7XG4gICAgcmV0dXJuIGNhY2hlW3VybF07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHdzZGwub3Blbl93c2RsKHVybCwgb3B0aW9ucykudGhlbih3c2RsID0+IHtcbiAgICAgIGNhY2hlW3VybF0gPSB3c2RsO1xuICAgICAgcmV0dXJuIHdzZGw7XG4gICAgfSlcbiAgfVxufTtcblxuYXN5bmMgZnVuY3Rpb24gX3JlcXVlc3RXU0RMKHVybCwgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucy5kaXNhYmxlQ2FjaGUgPT09IHRydWUpIHtcbiAgICByZXR1cm4gd3NkbC5vcGVuX3dzZGwodXJsLCBvcHRpb25zKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZ2V0RnJvbUNhY2hlKHVybCwgb3B0aW9ucyk7XG4gIH1cblxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlQ2xpZW50KHVybCwgb3B0aW9ucywgZW5kcG9pbnQpOiBQcm9taXNlPGFueT4ge1xuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIC8vIGNvbnNvbGUubG9nKFwiY3JlYXRlQ2xpZW50XCIsIG9wdGlvbnMpXG4gIGVuZHBvaW50ID0gb3B0aW9ucy5lbmRwb2ludCB8fCBlbmRwb2ludDtcbiAgXG4gIGNvbnN0IHdzZGwgPSBhd2FpdCBfcmVxdWVzdFdTREwodXJsLCBvcHRpb25zKTtcbiAgY29uc3QgY2xpZW50ID0gbmV3IENsaWVudCh3c2RsLCBlbmRwb2ludCwgb3B0aW9ucyk7XG4gIHJldHVybiBjbGllbnQ7XG59XG5cbmV4cG9ydCBjb25zdCBCYXNpY0F1dGhTZWN1cml0eSA9IHNlY3VyaXR5LkJhc2ljQXV0aFNlY3VyaXR5O1xuZXhwb3J0IGNvbnN0IE5UTE1TZWN1cml0eSA9IHNlY3VyaXR5Lk5UTE1TZWN1cml0eTtcbmV4cG9ydCBjb25zdCBXU1NlY3VyaXR5ID0gc2VjdXJpdHkuV1NTZWN1cml0eTtcbi8vIGV4cG9ydCBjb25zdCBXU1NlY3VyaXR5Q2VydCA9IHNlY3VyaXR5LldTU2VjdXJpdHlDZXJ0O1xuZXhwb3J0IGNvbnN0IEJlYXJlclNlY3VyaXR5ID0gc2VjdXJpdHkuQmVhcmVyU2VjdXJpdHk7XG4vLyBleHBvcnQgY29uc3QgQ2xpZW50U1NMU2VjdXJpdHkgPSBzZWN1cml0eS5DbGllbnRTU0xTZWN1cml0eTtcbi8vIGV4cG9ydCBjb25zdCBDbGllbnRTU0xTZWN1cml0eVBGWCA9IHNlY3VyaXR5LkNsaWVudFNTTFNlY3VyaXR5UEZYO1xuIl19