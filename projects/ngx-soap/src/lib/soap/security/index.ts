"use strict";

import { BasicAuthSecurity } from './BasicAuthSecurity';
import { WSSecurity } from './WSSecurity';
// import { WSSecurityCert } from './WSSecurityCert';
import { BearerSecurity } from './BearerSecurity';
import { NTLMSecurity } from './NTLMSecurity';

export const security = { 
  BasicAuthSecurity,
  BearerSecurity,
  WSSecurity,
  // WSSecurityCert,
  NTLMSecurity,
  // ClientSSLSecurity,
  // ClientSSLSecurityPFX
};