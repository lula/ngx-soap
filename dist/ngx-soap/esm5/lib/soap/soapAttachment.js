/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var SoapAttachment = /** @class */ (function () {
    function SoapAttachment(mimetype, contentId, name, body) {
        this.mimetype = mimetype;
        this.contentId = contentId;
        this.name = name;
        this.body = body;
    }
    /**
     * @param {?=} files
     * @return {?}
     */
    SoapAttachment.fromFormFiles = /**
     * @param {?=} files
     * @return {?}
     */
    function (files) {
        if (files === void 0) { files = []; }
        if (files instanceof FileList) {
            files = Array.from(files);
        }
        /** @type {?} */
        var promises = files.map(function (file) {
            return new Promise(function (resolve) {
                /** @type {?} */
                var reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onload = function (e) {
                    /** @type {?} */
                    var arrayBuffer = ((/** @type {?} */ (e.target))).result;
                    /** @type {?} */
                    var bytes = new Uint8Array(arrayBuffer);
                    /** @type {?} */
                    var attachment = new SoapAttachment(file.type, file.contentId || file.name, file.name, bytes);
                    resolve(attachment);
                };
            });
        });
        return Promise.all(promises);
    };
    return SoapAttachment;
}());
export { SoapAttachment };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29hcEF0dGFjaG1lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtc29hcC8iLCJzb3VyY2VzIjpbImxpYi9zb2FwL3NvYXBBdHRhY2htZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtJQUVFLHdCQUNTLFFBQWdCLEVBQ2hCLFNBQWlCLEVBQ2pCLElBQVksRUFDWixJQUFTO1FBSFQsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUNoQixjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ2pCLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWixTQUFJLEdBQUosSUFBSSxDQUFLO0lBR2xCLENBQUM7Ozs7O0lBRU0sNEJBQWE7Ozs7SUFBcEIsVUFBcUIsS0FBNkI7UUFBN0Isc0JBQUEsRUFBQSxVQUE2QjtRQUNoRCxJQUFJLEtBQUssWUFBWSxRQUFRLEVBQUU7WUFDN0IsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDM0I7O1lBRUssUUFBUSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFTO1lBQ25DLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBUyxPQUFPOztvQkFDM0IsTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFO2dCQUMvQixNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQy9CLE1BQU0sQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDOzt3QkFDbkIsV0FBVyxHQUFHLENBQUMsbUJBQUEsQ0FBQyxDQUFDLE1BQU0sRUFBTyxDQUFDLENBQUMsTUFBTTs7d0JBQ3RDLEtBQUssR0FBRyxJQUFJLFVBQVUsQ0FBQyxXQUFXLENBQUM7O3dCQUNuQyxVQUFVLEdBQUcsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUM7b0JBQy9GLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDdEIsQ0FBQyxDQUFBO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUM7UUFFSCxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVILHFCQUFDO0FBQUQsQ0FBQyxBQWhDRCxJQWdDQzs7OztJQTdCRyxrQ0FBdUI7O0lBQ3ZCLG1DQUF3Qjs7SUFDeEIsOEJBQW1COztJQUNuQiw4QkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgU29hcEF0dGFjaG1lbnQge1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBtaW1ldHlwZTogc3RyaW5nLFxuICAgIHB1YmxpYyBjb250ZW50SWQ6IHN0cmluZyxcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nLFxuICAgIHB1YmxpYyBib2R5OiBhbnlcbiAgKSB7XG5cbiAgfVxuXG4gIHN0YXRpYyBmcm9tRm9ybUZpbGVzKGZpbGVzOiBGaWxlTGlzdCB8IEZpbGVbXSA9IFtdKTogUHJvbWlzZTxhbnk+IHtcbiAgICBpZiAoZmlsZXMgaW5zdGFuY2VvZiBGaWxlTGlzdCkge1xuICAgICAgZmlsZXMgPSBBcnJheS5mcm9tKGZpbGVzKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9taXNlcyA9IGZpbGVzLm1hcCgoZmlsZTogYW55KSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoZmlsZSk7XG4gICAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGNvbnN0IGFycmF5QnVmZmVyID0gKGUudGFyZ2V0IGFzIGFueSkucmVzdWx0O1xuICAgICAgICAgIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXlCdWZmZXIpO1xuICAgICAgICAgIGNvbnN0IGF0dGFjaG1lbnQgPSBuZXcgU29hcEF0dGFjaG1lbnQoZmlsZS50eXBlLCBmaWxlLmNvbnRlbnRJZCB8fCBmaWxlLm5hbWUsIGZpbGUubmFtZSwgYnl0ZXMpO1xuICAgICAgICAgIHJlc29sdmUoYXR0YWNobWVudCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICB9XG5cbn1cbiJdfQ==