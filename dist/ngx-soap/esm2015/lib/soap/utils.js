/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import sha1 from 'crypto-js/sha1';
import Base64 from 'crypto-js/enc-base64';
import { Buffer } from 'buffer';
/** @type {?} */
export const passwordDigest = function passwordDigest(nonce, created, password) {
    /** @type {?} */
    const rawNonce = new Buffer(nonce || '', 'base64').toString('binary');
    return Base64.stringify(sha1(rawNonce + created + password, ''));
};
/** @type {?} */
export const TNS_PREFIX = '__tns__';
// Prefix for targetNamespace
/**
 * Find a key from an object based on the value
 * \@param Namespace prefix/uri mapping
 * \@param nsURI value
 * \@return The matching key
 * @type {?}
 */
export const findPrefix = function (xmlnsMapping, nsURI) {
    for (const n in xmlnsMapping) {
        if (n === TNS_PREFIX) {
            continue;
        }
        if (xmlnsMapping[n] === nsURI) {
            return n;
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtc29hcC8iLCJzb3VyY2VzIjpbImxpYi9zb2FwL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLElBQUksTUFBTSxnQkFBZ0IsQ0FBQztBQUNsQyxPQUFPLE1BQU0sTUFBTSxzQkFBc0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sUUFBUSxDQUFDOztBQUVoQyxNQUFNLE9BQU8sY0FBYyxHQUFHLFNBQVMsY0FBYyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUTs7VUFDdEUsUUFBUSxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssSUFBSSxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztJQUNyRSxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLEdBQUcsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkUsQ0FBQzs7QUFFRCxNQUFNLE9BQU8sVUFBVSxHQUFHLFNBQVM7Ozs7Ozs7OztBQVFuQyxNQUFNLE9BQU8sVUFBVSxHQUFHLFVBQVMsWUFBWSxFQUFFLEtBQUs7SUFDcEQsS0FBSyxNQUFNLENBQUMsSUFBSSxZQUFZLEVBQUU7UUFDNUIsSUFBSSxDQUFDLEtBQUssVUFBVSxFQUFFO1lBQUUsU0FBUztTQUFFO1FBQ25DLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssRUFBRTtZQUM3QixPQUFPLENBQUMsQ0FBQztTQUNWO0tBQ0Y7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNoYTEgZnJvbSAnY3J5cHRvLWpzL3NoYTEnO1xuaW1wb3J0IEJhc2U2NCBmcm9tICdjcnlwdG8tanMvZW5jLWJhc2U2NCc7XG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tICdidWZmZXInO1xuXG5leHBvcnQgY29uc3QgcGFzc3dvcmREaWdlc3QgPSBmdW5jdGlvbiBwYXNzd29yZERpZ2VzdChub25jZSwgY3JlYXRlZCwgcGFzc3dvcmQpIHtcbiAgY29uc3QgcmF3Tm9uY2UgPSBuZXcgQnVmZmVyKG5vbmNlIHx8ICcnLCAnYmFzZTY0JykudG9TdHJpbmcoJ2JpbmFyeScpO1xuICByZXR1cm4gQmFzZTY0LnN0cmluZ2lmeShzaGExKHJhd05vbmNlICsgY3JlYXRlZCArIHBhc3N3b3JkLCAnJykpO1xufTtcblxuZXhwb3J0IGNvbnN0IFROU19QUkVGSVggPSAnX190bnNfXyc7IC8vIFByZWZpeCBmb3IgdGFyZ2V0TmFtZXNwYWNlXG5cbi8qKlxuICogRmluZCBhIGtleSBmcm9tIGFuIG9iamVjdCBiYXNlZCBvbiB0aGUgdmFsdWVcbiAqIEBwYXJhbSAgTmFtZXNwYWNlIHByZWZpeC91cmkgbWFwcGluZ1xuICogQHBhcmFtICBuc1VSSSB2YWx1ZVxuICogQHJldHVybnMgIFRoZSBtYXRjaGluZyBrZXlcbiAqL1xuZXhwb3J0IGNvbnN0IGZpbmRQcmVmaXggPSBmdW5jdGlvbih4bWxuc01hcHBpbmcsIG5zVVJJKSB7XG4gIGZvciAoY29uc3QgbiBpbiB4bWxuc01hcHBpbmcpIHtcbiAgICBpZiAobiA9PT0gVE5TX1BSRUZJWCkgeyBjb250aW51ZTsgfVxuICAgIGlmICh4bWxuc01hcHBpbmdbbl0gPT09IG5zVVJJKSB7XG4gICAgICByZXR1cm4gbjtcbiAgICB9XG4gIH1cbn07XG4iXX0=