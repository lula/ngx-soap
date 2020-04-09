/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import sha1 from 'crypto-js/sha1';
import Base64 from 'crypto-js/enc-base64';
import { Buffer } from 'buffer';
/** @type {?} */
export var passwordDigest = function passwordDigest(nonce, created, password) {
    /** @type {?} */
    var rawNonce = new Buffer(nonce || '', 'base64').toString('binary');
    return Base64.stringify(sha1(rawNonce + created + password, ''));
};
/** @type {?} */
export var TNS_PREFIX = '__tns__';
// Prefix for targetNamespace
/**
 * Find a key from an object based on the value
 * \@param Namespace prefix/uri mapping
 * \@param nsURI value
 * \@return The matching key
 * @type {?}
 */
export var findPrefix = function (xmlnsMapping, nsURI) {
    for (var n in xmlnsMapping) {
        if (n === TNS_PREFIX) {
            continue;
        }
        if (xmlnsMapping[n] === nsURI) {
            return n;
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtc29hcC8iLCJzb3VyY2VzIjpbImxpYi9zb2FwL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLElBQUksTUFBTSxnQkFBZ0IsQ0FBQztBQUNsQyxPQUFPLE1BQU0sTUFBTSxzQkFBc0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sUUFBUSxDQUFDOztBQUVoQyxNQUFNLEtBQU8sY0FBYyxHQUFHLFNBQVMsY0FBYyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUTs7UUFDdEUsUUFBUSxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssSUFBSSxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztJQUNyRSxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLEdBQUcsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkUsQ0FBQzs7QUFFRCxNQUFNLEtBQU8sVUFBVSxHQUFHLFNBQVM7Ozs7Ozs7OztBQVFuQyxNQUFNLEtBQU8sVUFBVSxHQUFHLFVBQVMsWUFBWSxFQUFFLEtBQUs7SUFDcEQsS0FBSyxJQUFNLENBQUMsSUFBSSxZQUFZLEVBQUU7UUFDNUIsSUFBSSxDQUFDLEtBQUssVUFBVSxFQUFFO1lBQUUsU0FBUztTQUFFO1FBQ25DLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssRUFBRTtZQUM3QixPQUFPLENBQUMsQ0FBQztTQUNWO0tBQ0Y7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNoYTEgZnJvbSAnY3J5cHRvLWpzL3NoYTEnO1xyXG5pbXBvcnQgQmFzZTY0IGZyb20gJ2NyeXB0by1qcy9lbmMtYmFzZTY0JztcclxuaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSAnYnVmZmVyJztcclxuXHJcbmV4cG9ydCBjb25zdCBwYXNzd29yZERpZ2VzdCA9IGZ1bmN0aW9uIHBhc3N3b3JkRGlnZXN0KG5vbmNlLCBjcmVhdGVkLCBwYXNzd29yZCkge1xyXG4gIGNvbnN0IHJhd05vbmNlID0gbmV3IEJ1ZmZlcihub25jZSB8fCAnJywgJ2Jhc2U2NCcpLnRvU3RyaW5nKCdiaW5hcnknKTtcclxuICByZXR1cm4gQmFzZTY0LnN0cmluZ2lmeShzaGExKHJhd05vbmNlICsgY3JlYXRlZCArIHBhc3N3b3JkLCAnJykpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IFROU19QUkVGSVggPSAnX190bnNfXyc7IC8vIFByZWZpeCBmb3IgdGFyZ2V0TmFtZXNwYWNlXHJcblxyXG4vKipcclxuICogRmluZCBhIGtleSBmcm9tIGFuIG9iamVjdCBiYXNlZCBvbiB0aGUgdmFsdWVcclxuICogQHBhcmFtICBOYW1lc3BhY2UgcHJlZml4L3VyaSBtYXBwaW5nXHJcbiAqIEBwYXJhbSAgbnNVUkkgdmFsdWVcclxuICogQHJldHVybnMgIFRoZSBtYXRjaGluZyBrZXlcclxuICovXHJcbmV4cG9ydCBjb25zdCBmaW5kUHJlZml4ID0gZnVuY3Rpb24oeG1sbnNNYXBwaW5nLCBuc1VSSSkge1xyXG4gIGZvciAoY29uc3QgbiBpbiB4bWxuc01hcHBpbmcpIHtcclxuICAgIGlmIChuID09PSBUTlNfUFJFRklYKSB7IGNvbnRpbnVlOyB9XHJcbiAgICBpZiAoeG1sbnNNYXBwaW5nW25dID09PSBuc1VSSSkge1xyXG4gICAgICByZXR1cm4gbjtcclxuICAgIH1cclxuICB9XHJcbn07XHJcbiJdfQ==