// import * as crypto from '                     crypto-js/sha1';
// import * as buffer from "buffer/";
// export function passwordDigest(nonce, created, password) {
//   // digest = base64 ( sha1 ( nonce + created + password ) )
//   var pwHash = crypto.createHash('sha1');
//   var rawNonce = buffer.Buffer(nonce || '', 'base64').toString('binary');
//   pwHash.update(rawNonce + created + password);
//   return pwHash.digest('base64');
// };
// import * as crypto from '                     crypto-js/sha1';
export var TNS_PREFIX = '__tns__'; // Prefix for targetNamespace
/**
 * Find a key from an object based on the value
 * @param {Object} Namespace prefix/uri mapping
 * @param {*} nsURI value
 * @returns {String} The matching key
 */
// Prefix for targetNamespace
export function findPrefix(xmlnsMapping, nsURI) {
    for (var n in xmlnsMapping) {
        if (n === TNS_PREFIX)
            continue;
        if (xmlnsMapping[n] === nsURI) {
            return n;
        }
    }
}
;
//# sourceMappingURL=utils.js.map