export { Client } from './client';
export { security } from './security/security';
export { passwordDigest } from './utils';
export declare const WSDL: (definition: any, uri: any, options: any) => void;
export declare function createClient(url: any, options: any, endpoint: any): Promise<any>;
export declare const BasicAuthSecurity: typeof import("./security/BasicAuthSecurity").BasicAuthSecurity;
export declare const NTLMSecurity: typeof import("./security/NTLMSecurity").NTLMSecurity;
export declare const WSSecurity: typeof import("./security/WSSecurity").WSSecurity;
export declare const BearerSecurity: typeof import("./security/BearerSecurity").BearerSecurity;
