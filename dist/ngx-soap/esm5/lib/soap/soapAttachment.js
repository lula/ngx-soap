var SoapAttachment = /** @class */ (function () {
    function SoapAttachment(mimetype, contentId, name, body) {
        this.mimetype = mimetype;
        this.contentId = contentId;
        this.name = name;
        this.body = body;
    }
    SoapAttachment.fromFormFiles = function (files) {
        if (files === void 0) { files = []; }
        if (files instanceof FileList) {
            files = Array.from(files);
        }
        var promises = files.map(function (file) {
            return new Promise(function (resolve) {
                var reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onload = function (e) {
                    var arrayBuffer = e.target.result;
                    var bytes = new Uint8Array(arrayBuffer);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29hcEF0dGFjaG1lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtc29hcC8iLCJzb3VyY2VzIjpbImxpYi9zb2FwL3NvYXBBdHRhY2htZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBRUUsd0JBQ1MsUUFBZ0IsRUFDaEIsU0FBaUIsRUFDakIsSUFBWSxFQUNaLElBQVM7UUFIVCxhQUFRLEdBQVIsUUFBUSxDQUFRO1FBQ2hCLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFDakIsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUNaLFNBQUksR0FBSixJQUFJLENBQUs7SUFHbEIsQ0FBQztJQUVNLDRCQUFhLEdBQXBCLFVBQXFCLEtBQTZCO1FBQTdCLHNCQUFBLEVBQUEsVUFBNkI7UUFDaEQsSUFBSSxLQUFLLFlBQVksUUFBUSxFQUFFO1lBQzdCLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzNCO1FBRUQsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQVM7WUFDbkMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFTLE9BQU87Z0JBQ2pDLElBQU0sTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7Z0JBQ2hDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDL0IsTUFBTSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUM7b0JBQ3pCLElBQU0sV0FBVyxHQUFJLENBQUMsQ0FBQyxNQUFjLENBQUMsTUFBTSxDQUFDO29CQUM3QyxJQUFNLEtBQUssR0FBRyxJQUFJLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFDMUMsSUFBTSxVQUFVLEdBQUcsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDaEcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUN0QixDQUFDLENBQUE7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUosT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFSCxxQkFBQztBQUFELENBQUMsQUFoQ0QsSUFnQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgU29hcEF0dGFjaG1lbnQge1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHB1YmxpYyBtaW1ldHlwZTogc3RyaW5nLFxyXG4gICAgcHVibGljIGNvbnRlbnRJZDogc3RyaW5nLFxyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZyxcclxuICAgIHB1YmxpYyBib2R5OiBhbnlcclxuICApIHtcclxuXHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZnJvbUZvcm1GaWxlcyhmaWxlczogRmlsZUxpc3QgfCBGaWxlW10gPSBbXSk6IFByb21pc2U8YW55PiB7XHJcbiAgICBpZiAoZmlsZXMgaW5zdGFuY2VvZiBGaWxlTGlzdCkge1xyXG4gICAgICBmaWxlcyA9IEFycmF5LmZyb20oZmlsZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHByb21pc2VzID0gZmlsZXMubWFwKChmaWxlOiBhbnkpID0+IHtcclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcclxuICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihmaWxlKTtcclxuICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgIGNvbnN0IGFycmF5QnVmZmVyID0gKGUudGFyZ2V0IGFzIGFueSkucmVzdWx0O1xyXG4gICAgICAgICAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcik7XHJcbiAgICAgICAgICBjb25zdCBhdHRhY2htZW50ID0gbmV3IFNvYXBBdHRhY2htZW50KGZpbGUudHlwZSwgZmlsZS5jb250ZW50SWQgfHwgZmlsZS5uYW1lLCBmaWxlLm5hbWUsIGJ5dGVzKTtcclxuICAgICAgICAgIHJlc29sdmUoYXR0YWNobWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==