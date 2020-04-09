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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29hcEF0dGFjaG1lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtc29hcC8iLCJzb3VyY2VzIjpbImxpYi9zb2FwL3NvYXBBdHRhY2htZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtJQUVFLHdCQUNTLFFBQWdCLEVBQ2hCLFNBQWlCLEVBQ2pCLElBQVksRUFDWixJQUFTO1FBSFQsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUNoQixjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ2pCLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWixTQUFJLEdBQUosSUFBSSxDQUFLO0lBR2xCLENBQUM7Ozs7O0lBRU0sNEJBQWE7Ozs7SUFBcEIsVUFBcUIsS0FBNkI7UUFBN0Isc0JBQUEsRUFBQSxVQUE2QjtRQUNoRCxJQUFJLEtBQUssWUFBWSxRQUFRLEVBQUU7WUFDN0IsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDM0I7O1lBRUssUUFBUSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFTO1lBQ25DLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBUyxPQUFPOztvQkFDM0IsTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFO2dCQUMvQixNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQy9CLE1BQU0sQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDOzt3QkFDbkIsV0FBVyxHQUFHLENBQUMsbUJBQUEsQ0FBQyxDQUFDLE1BQU0sRUFBTyxDQUFDLENBQUMsTUFBTTs7d0JBQ3RDLEtBQUssR0FBRyxJQUFJLFVBQVUsQ0FBQyxXQUFXLENBQUM7O3dCQUNuQyxVQUFVLEdBQUcsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUM7b0JBQy9GLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDdEIsQ0FBQyxDQUFBO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUM7UUFFSCxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVILHFCQUFDO0FBQUQsQ0FBQyxBQWhDRCxJQWdDQzs7OztJQTdCRyxrQ0FBdUI7O0lBQ3ZCLG1DQUF3Qjs7SUFDeEIsOEJBQW1COztJQUNuQiw4QkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgU29hcEF0dGFjaG1lbnQge1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHB1YmxpYyBtaW1ldHlwZTogc3RyaW5nLFxyXG4gICAgcHVibGljIGNvbnRlbnRJZDogc3RyaW5nLFxyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZyxcclxuICAgIHB1YmxpYyBib2R5OiBhbnlcclxuICApIHtcclxuXHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZnJvbUZvcm1GaWxlcyhmaWxlczogRmlsZUxpc3QgfCBGaWxlW10gPSBbXSk6IFByb21pc2U8YW55PiB7XHJcbiAgICBpZiAoZmlsZXMgaW5zdGFuY2VvZiBGaWxlTGlzdCkge1xyXG4gICAgICBmaWxlcyA9IEFycmF5LmZyb20oZmlsZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHByb21pc2VzID0gZmlsZXMubWFwKChmaWxlOiBhbnkpID0+IHtcclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcclxuICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihmaWxlKTtcclxuICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgIGNvbnN0IGFycmF5QnVmZmVyID0gKGUudGFyZ2V0IGFzIGFueSkucmVzdWx0O1xyXG4gICAgICAgICAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcik7XHJcbiAgICAgICAgICBjb25zdCBhdHRhY2htZW50ID0gbmV3IFNvYXBBdHRhY2htZW50KGZpbGUudHlwZSwgZmlsZS5jb250ZW50SWQgfHwgZmlsZS5uYW1lLCBmaWxlLm5hbWUsIGJ5dGVzKTtcclxuICAgICAgICAgIHJlc29sdmUoYXR0YWNobWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==