export declare class SoapAttachment {
    mimetype: string;
    contentId: string;
    name: string;
    body: any;
    constructor(mimetype: string, contentId: string, name: string, body: any);
    static fromFormFiles(files?: FileList | File[]): Promise<any>;
}
