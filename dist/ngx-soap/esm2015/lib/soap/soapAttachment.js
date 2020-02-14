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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29hcEF0dGFjaG1lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtc29hcC8iLCJzb3VyY2VzIjpbImxpYi9zb2FwL3NvYXBBdHRhY2htZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxNQUFNLE9BQU8sY0FBYzs7Ozs7OztJQUV6QixZQUNTLFFBQWdCLEVBQ2hCLFNBQWlCLEVBQ2pCLElBQVksRUFDWixJQUFTO1FBSFQsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUNoQixjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ2pCLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWixTQUFJLEdBQUosSUFBSSxDQUFLO0lBR2xCLENBQUM7Ozs7O0lBRUQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUEyQixFQUFFO1FBQ2hELElBQUksS0FBSyxZQUFZLFFBQVEsRUFBRTtZQUM3QixLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMzQjs7Y0FFSyxRQUFRLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQVMsRUFBRSxFQUFFO1lBQ3ZDLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBUyxPQUFPOztzQkFDM0IsTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFO2dCQUMvQixNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQy9CLE1BQU0sQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDOzswQkFDbkIsV0FBVyxHQUFHLENBQUMsbUJBQUEsQ0FBQyxDQUFDLE1BQU0sRUFBTyxDQUFDLENBQUMsTUFBTTs7MEJBQ3RDLEtBQUssR0FBRyxJQUFJLFVBQVUsQ0FBQyxXQUFXLENBQUM7OzBCQUNuQyxVQUFVLEdBQUcsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUM7b0JBQy9GLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDdEIsQ0FBQyxDQUFBO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUM7UUFFSCxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUIsQ0FBQztDQUVGOzs7SUE3Qkcsa0NBQXVCOztJQUN2QixtQ0FBd0I7O0lBQ3hCLDhCQUFtQjs7SUFDbkIsOEJBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIFNvYXBBdHRhY2htZW50IHtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgbWltZXR5cGU6IHN0cmluZyxcbiAgICBwdWJsaWMgY29udGVudElkOiBzdHJpbmcsXG4gICAgcHVibGljIG5hbWU6IHN0cmluZyxcbiAgICBwdWJsaWMgYm9keTogYW55XG4gICkge1xuXG4gIH1cblxuICBzdGF0aWMgZnJvbUZvcm1GaWxlcyhmaWxlczogRmlsZUxpc3QgfCBGaWxlW10gPSBbXSk6IFByb21pc2U8YW55PiB7XG4gICAgaWYgKGZpbGVzIGluc3RhbmNlb2YgRmlsZUxpc3QpIHtcbiAgICAgIGZpbGVzID0gQXJyYXkuZnJvbShmaWxlcyk7XG4gICAgfVxuXG4gICAgY29uc3QgcHJvbWlzZXMgPSBmaWxlcy5tYXAoKGZpbGU6IGFueSkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGZpbGUpO1xuICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBjb25zdCBhcnJheUJ1ZmZlciA9IChlLnRhcmdldCBhcyBhbnkpLnJlc3VsdDtcbiAgICAgICAgICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KGFycmF5QnVmZmVyKTtcbiAgICAgICAgICBjb25zdCBhdHRhY2htZW50ID0gbmV3IFNvYXBBdHRhY2htZW50KGZpbGUudHlwZSwgZmlsZS5jb250ZW50SWQgfHwgZmlsZS5uYW1lLCBmaWxlLm5hbWUsIGJ5dGVzKTtcbiAgICAgICAgICByZXNvbHZlKGF0dGFjaG1lbnQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgfVxuXG59XG4iXX0=