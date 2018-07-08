// import { createHash } from 'crypto-browserify';
import { Buffer } from 'buffer';

// export const passwordDigest = function passwordDigest(nonce, created, password) {
//   // digest = base64 ( sha1 ( nonce + created + password ) )
//   const pwHash = createHash('sha1');
//   const rawNonce = new Buffer(nonce || '', 'base64').toString('binary');
//   pwHash.update(rawNonce + created + password);
//   return pwHash.digest('base64');
// };


export const TNS_PREFIX = '__tns__'; // Prefix for targetNamespace

/**
 * Find a key from an object based on the value
 * @param  Namespace prefix/uri mapping
 * @param  nsURI value
 * @returns  The matching key
 */
export const findPrefix = function(xmlnsMapping, nsURI) {
  for (const n in xmlnsMapping) {
    if (n === TNS_PREFIX) { continue; }
    if (xmlnsMapping[n] === nsURI) {
      return n;
    }
  }
};
