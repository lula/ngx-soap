export declare class BasicAuthSecurity {
    defaults: any;
    private _password;
    private _username;
    constructor(username: string, password: string, defaults: any);
    addHeaders(headers: any): any;
    toXML(): string;
    addOptions(options: any): void;
}
