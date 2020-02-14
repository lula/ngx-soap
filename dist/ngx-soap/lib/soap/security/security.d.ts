import { BasicAuthSecurity } from './BasicAuthSecurity';
import { WSSecurity } from './WSSecurity';
import { BearerSecurity } from './BearerSecurity';
import { NTLMSecurity } from './NTLMSecurity';
export declare const security: {
    BasicAuthSecurity: typeof BasicAuthSecurity;
    BearerSecurity: typeof BearerSecurity;
    WSSecurity: typeof WSSecurity;
    NTLMSecurity: typeof NTLMSecurity;
};
