/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
export class SoapAttachment {
    /**
     * @param {?} mimetype
     * @param {?} contentId
     * @param {?} name
     * @param {?} body
     */
    constructor(mimetype, contentId, name, body) {
        this.mimetype = mimetype;
        this.contentId = contentId;
        this.name = name;
        this.body = body;
    }
    /**
     * @param {?=} files
     * @return {?}
     */
    static fromFormFiles(files = []) {
        if (files instanceof FileList) {
            files = Array.from(files);
        }
        /** @type {?} */
        const promises = files.map((file) => {
            return new Promise(function (resolve) {
                /** @type {?} */
                const reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onload = function (e) {
                    /** @type {?} */
                    const arrayBuffer = ((/** @type {?} */ (e.target))).result;
                    /** @type {?} */
                    const bytes = new Uint8Array(arrayBuffer);
                    /** @type {?} */
                    const attachment = new SoapAttachment(file.type, file.contentId || file.name, file.name, bytes);
                    resolve(attachment);
                };
            });
        });
        return Promise.all(promises);
    }
}
if (false) {
    /** @type {?} */
    SoapAttachment.prototype.mimetype;
    /** @type {?} */
    SoapAttachment.prototype.contentId;
    /** @type {?} */
    SoapAttachment.prototype.name;
    /** @type {?} */
    SoapAttachment.prototype.body;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29hcEF0dGFjaG1lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtc29hcC8iLCJzb3VyY2VzIjpbImxpYi9zb2FwL3NvYXBBdHRhY2htZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxNQUFNLE9BQU8sY0FBYzs7Ozs7OztJQUV6QixZQUNTLFFBQWdCLEVBQ2hCLFNBQWlCLEVBQ2pCLElBQVksRUFDWixJQUFTO1FBSFQsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUNoQixjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ2pCLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWixTQUFJLEdBQUosSUFBSSxDQUFLO0lBR2xCLENBQUM7Ozs7O0lBRUQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUEyQixFQUFFO1FBQ2hELElBQUksS0FBSyxZQUFZLFFBQVEsRUFBRTtZQUM3QixLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMzQjs7Y0FFSyxRQUFRLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQVMsRUFBRSxFQUFFO1lBQ3ZDLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBUyxPQUFPOztzQkFDM0IsTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFO2dCQUMvQixNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQy9CLE1BQU0sQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDOzswQkFDbkIsV0FBVyxHQUFHLENBQUMsbUJBQUEsQ0FBQyxDQUFDLE1BQU0sRUFBTyxDQUFDLENBQUMsTUFBTTs7MEJBQ3RDLEtBQUssR0FBRyxJQUFJLFVBQVUsQ0FBQyxXQUFXLENBQUM7OzBCQUNuQyxVQUFVLEdBQUcsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUM7b0JBQy9GLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDdEIsQ0FBQyxDQUFBO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUM7UUFFSCxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUIsQ0FBQztDQUVGOzs7SUE3Qkcsa0NBQXVCOztJQUN2QixtQ0FBd0I7O0lBQ3hCLDhCQUFtQjs7SUFDbkIsOEJBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIFNvYXBBdHRhY2htZW50IHtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwdWJsaWMgbWltZXR5cGU6IHN0cmluZyxcclxuICAgIHB1YmxpYyBjb250ZW50SWQ6IHN0cmluZyxcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcsXHJcbiAgICBwdWJsaWMgYm9keTogYW55XHJcbiAgKSB7XHJcblxyXG4gIH1cclxuXHJcbiAgc3RhdGljIGZyb21Gb3JtRmlsZXMoZmlsZXM6IEZpbGVMaXN0IHwgRmlsZVtdID0gW10pOiBQcm9taXNlPGFueT4ge1xyXG4gICAgaWYgKGZpbGVzIGluc3RhbmNlb2YgRmlsZUxpc3QpIHtcclxuICAgICAgZmlsZXMgPSBBcnJheS5mcm9tKGZpbGVzKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwcm9taXNlcyA9IGZpbGVzLm1hcCgoZmlsZTogYW55KSA9PiB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XHJcbiAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoZmlsZSk7XHJcbiAgICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICBjb25zdCBhcnJheUJ1ZmZlciA9IChlLnRhcmdldCBhcyBhbnkpLnJlc3VsdDtcclxuICAgICAgICAgIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXlCdWZmZXIpO1xyXG4gICAgICAgICAgY29uc3QgYXR0YWNobWVudCA9IG5ldyBTb2FwQXR0YWNobWVudChmaWxlLnR5cGUsIGZpbGUuY29udGVudElkIHx8IGZpbGUubmFtZSwgZmlsZS5uYW1lLCBieXRlcyk7XHJcbiAgICAgICAgICByZXNvbHZlKGF0dGFjaG1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=