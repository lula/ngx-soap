export declare var TNS_PREFIX: string;
/**
 * Find a key from an object based on the value
 * @param {Object} Namespace prefix/uri mapping
 * @param {*} nsURI value
 * @returns {String} The matching key
 */
export declare function findPrefix(xmlnsMapping: any, nsURI: any): string | undefined;
