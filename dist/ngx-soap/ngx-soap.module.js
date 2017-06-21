import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { SOAPService } from './soap.service';
var NgxSoapModule = (function () {
    function NgxSoapModule() {
    }
    return NgxSoapModule;
}());
export { NgxSoapModule };
NgxSoapModule.decorators = [
    { type: NgModule, args: [{
                imports: [HttpModule],
                providers: [SOAPService]
            },] },
];
/** @nocollapse */
NgxSoapModule.ctorParameters = function () { return []; };
//# sourceMappingURL=ngx-soap.module.js.map