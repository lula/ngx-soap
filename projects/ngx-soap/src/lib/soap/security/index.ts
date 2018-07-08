"use strict";

// module.exports = {
//   BasicAuthSecurity: require('./BasicAuthSecurity')
// , NTLMSecurity: require('./NTLMSecurity')
// , ClientSSLSecurity: require('./ClientSSLSecurity')
// , ClientSSLSecurityPFX: require('./ClientSSLSecurityPFX')
// , WSSecurity: require('./WSSecurity')
// , BearerSecurity: require('./BearerSecurity')
// , WSSecurityCert: require('./WSSecurityCert')
// };

import { BasicAuthSecurity } from './BasicAuthSecurity';
export const security = { 
  BasicAuthSecurity,
  NTLMSecurity: {},
  ClientSSLSecurity: {},
  ClientSSLSecurityPFX: {},
  WSSecurity: {},
  BearerSecurity: {},
  WSSecurityCert: {}
};