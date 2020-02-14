/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import sha1 from 'crypto-js/sha1';
import Base64 from 'crypto-js/enc-base64';
import { Buffer } from 'buffer';
/** @type {?} */
export const passwordDigest = (/**
 * @param {?} nonce
 * @param {?} created
 * @param {?} password
 * @return {?}
 */
function passwordDigest(nonce, created, password) {
    /** @type {?} */
    const rawNonce = new Buffer(nonce || '', 'base64').toString('binary');
    return Base64.stringify(sha1(rawNonce + created + password, ''));
});
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
export const findPrefix = (/**
 * @param {?} xmlnsMapping
 * @param {?} nsURI
 * @return {?}
 */
function (xmlnsMapping, nsURI) {
    for (const n in xmlnsMapping) {
        if (n === TNS_PREFIX) {
            continue;
        }
        if (xmlnsMapping[n] === nsURI) {
            return n;
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtc29hcC8iLCJzb3VyY2VzIjpbImxpYi9zb2FwL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLElBQUksTUFBTSxnQkFBZ0IsQ0FBQztBQUNsQyxPQUFPLE1BQU0sTUFBTSxzQkFBc0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sUUFBUSxDQUFDOztBQUVoQyxNQUFNLE9BQU8sY0FBYzs7Ozs7O0FBQUcsU0FBUyxjQUFjLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFROztVQUN0RSxRQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxJQUFJLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO0lBQ3JFLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sR0FBRyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNuRSxDQUFDLENBQUE7O0FBRUQsTUFBTSxPQUFPLFVBQVUsR0FBRyxTQUFTOzs7Ozs7Ozs7QUFRbkMsTUFBTSxPQUFPLFVBQVU7Ozs7O0FBQUcsVUFBUyxZQUFZLEVBQUUsS0FBSztJQUNwRCxLQUFLLE1BQU0sQ0FBQyxJQUFJLFlBQVksRUFBRTtRQUM1QixJQUFJLENBQUMsS0FBSyxVQUFVLEVBQUU7WUFBRSxTQUFTO1NBQUU7UUFDbkMsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxFQUFFO1lBQzdCLE9BQU8sQ0FBQyxDQUFDO1NBQ1Y7S0FDRjtBQUNILENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzaGExIGZyb20gJ2NyeXB0by1qcy9zaGExJztcbmltcG9ydCBCYXNlNjQgZnJvbSAnY3J5cHRvLWpzL2VuYy1iYXNlNjQnO1xuaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSAnYnVmZmVyJztcblxuZXhwb3J0IGNvbnN0IHBhc3N3b3JkRGlnZXN0ID0gZnVuY3Rpb24gcGFzc3dvcmREaWdlc3Qobm9uY2UsIGNyZWF0ZWQsIHBhc3N3b3JkKSB7XG4gIGNvbnN0IHJhd05vbmNlID0gbmV3IEJ1ZmZlcihub25jZSB8fCAnJywgJ2Jhc2U2NCcpLnRvU3RyaW5nKCdiaW5hcnknKTtcbiAgcmV0dXJuIEJhc2U2NC5zdHJpbmdpZnkoc2hhMShyYXdOb25jZSArIGNyZWF0ZWQgKyBwYXNzd29yZCwgJycpKTtcbn07XG5cbmV4cG9ydCBjb25zdCBUTlNfUFJFRklYID0gJ19fdG5zX18nOyAvLyBQcmVmaXggZm9yIHRhcmdldE5hbWVzcGFjZVxuXG4vKipcbiAqIEZpbmQgYSBrZXkgZnJvbSBhbiBvYmplY3QgYmFzZWQgb24gdGhlIHZhbHVlXG4gKiBAcGFyYW0gIE5hbWVzcGFjZSBwcmVmaXgvdXJpIG1hcHBpbmdcbiAqIEBwYXJhbSAgbnNVUkkgdmFsdWVcbiAqIEByZXR1cm5zICBUaGUgbWF0Y2hpbmcga2V5XG4gKi9cbmV4cG9ydCBjb25zdCBmaW5kUHJlZml4ID0gZnVuY3Rpb24oeG1sbnNNYXBwaW5nLCBuc1VSSSkge1xuICBmb3IgKGNvbnN0IG4gaW4geG1sbnNNYXBwaW5nKSB7XG4gICAgaWYgKG4gPT09IFROU19QUkVGSVgpIHsgY29udGludWU7IH1cbiAgICBpZiAoeG1sbnNNYXBwaW5nW25dID09PSBuc1VSSSkge1xuICAgICAgcmV0dXJuIG47XG4gICAgfVxuICB9XG59O1xuIl19