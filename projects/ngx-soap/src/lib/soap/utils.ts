import sha1 from 'crypto-js/sha1';
import Base64 from 'crypto-js/enc-base64';
import { Buffer } from 'buffer';

export const passwordDigest = function passwordDigest(nonce, created, password) {
  const rawNonce = new Buffer(nonce || '', 'base64').toString('binary');
  return Base64.stringify(sha1(rawNonce + created + password, ''));
};

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
