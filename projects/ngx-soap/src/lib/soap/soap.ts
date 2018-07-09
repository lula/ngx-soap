/*
 * Copyright (c) 2011 Vinay Pulim <vinay@milewise.com>
 * MIT Licensed
 */

import * as wsdl from './wsdl';
import { security } from './security';
import { Client } from './client';
export { Client } from './client';
export { security } from './security';
export const WSDL = wsdl.WSDL;
// export const passwordDigest = utils.passwordDigest;

function createCache() {
  const cache = {};
  return function (key, load, callback) {
    if (!cache[key]) {
      load(function (err, result) {
        if (err) {
          return callback(err);
        }
        cache[key] = result;
        callback(null, result);
      });
    } else {
      // process.nextTick(function () {
      //   callback(null, cache[key]);
      // });
      Promise.resolve(true).then(() => callback(null, cache[key]));
    }
  };
}
const getFromCache = createCache();

function _requestWSDL(url, options) {
  // if (typeof options === 'function') {
  //   callback = options;
  //   options = {};
  // }

  return wsdl.open_wsdl(url, options);

  // const openWsdl = wsdl.open_wsdl.bind(null, url, options);
  // if (options.disableCache === true) {
  //   openWsdl(callback);
  // } else {
  //   getFromCache(url, openWsdl, callback);
  // }
}

export async function createClient(url, options, endpoint): Promise<any> {
  // if (typeof options === 'function') {
  //   endpoint = callback;
  //   callback = options;
  //   options = {};
  // }
  if (typeof options === 'undefined') {
    options = {};
  }
  console.log("createClient", options)
  endpoint = options.endpoint || endpoint;
  // _requestWSDL(url, options, function(err, wsdl) {
  //   callback(err, wsdl && new Client(wsdl, endpoint, options));
  // });

  const wsdl = await _requestWSDL(url, options);
  const client = new Client(wsdl, endpoint, options);
  return client;
}

// export function createClientAsync(url, options, endpoint): Observable<any> {
//   if (typeof options === 'undefined') {
//     options = {};
//   }
//   console.log("createClientAsync", options)
//   return createClient(url, options, endpoint);
// }

// export function listen(server, pathOrOptions, services, xml) {
//   let options: any = {},
//     path = pathOrOptions,
//     uri = '';

//   if (typeof pathOrOptions === 'object') {
//     options = pathOrOptions;
//     path = options.path;
//     services = options.services;
//     xml = options.xml;
//     uri = options.uri;
//   }

//   const wsdl = new WSDL(xml || services, uri, options);
//   return new Server(server, path, services, wsdl, options);
// }

export const BasicAuthSecurity = security.BasicAuthSecurity;
export const NTLMSecurity = security.NTLMSecurity;
export const WSSecurity = security.WSSecurity;
export const WSSecurityCert = security.WSSecurityCert;
export const ClientSSLSecurity = security.ClientSSLSecurity;
export const ClientSSLSecurityPFX = security.ClientSSLSecurityPFX;
export const BearerSecurity = security.BearerSecurity;
