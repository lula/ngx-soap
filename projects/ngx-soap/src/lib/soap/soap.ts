/*
 * Copyright (c) 2011 Vinay Pulim <vinay@milewise.com>
 * MIT Licensed
 */

import * as wsdl from './wsdl';
import { security } from './security/security';
import { Client } from './client';
export { Client } from './client';
export { security  } from './security/security';

export { passwordDigest } from './utils'
export const WSDL = wsdl.WSDL;

const cache = {}; // TODO some caching?

const getFromCache = async (url, options) => {
  console.log('Getting from cache', url);
  if (cache[url]) {
    console.log('Found in cache', url);
    return cache[url];
  } else {
    return wsdl.open_wsdl(url, options)
  }
};

function _requestWSDL(url, options) {
  if (options.disableCache === true) {
    return wsdl.open_wsdl(url, options);
  } else {
    return getFromCache(url, options);
  }

}

export async function createClient(url, options, endpoint): Promise<any> {
  if (typeof options === 'undefined') {
    options = {};
  }
  console.log("createClient", options)
  endpoint = options.endpoint || endpoint;
  
  const wsdl = await _requestWSDL(url, options);
  const client = new Client(wsdl, endpoint, options);
  return client;
}

export const BasicAuthSecurity = security.BasicAuthSecurity;
export const NTLMSecurity = security.NTLMSecurity;
export const WSSecurity = security.WSSecurity;
// export const WSSecurityCert = security.WSSecurityCert;
export const BearerSecurity = security.BearerSecurity;
// export const ClientSSLSecurity = security.ClientSSLSecurity;
// export const ClientSSLSecurityPFX = security.ClientSSLSecurityPFX;
