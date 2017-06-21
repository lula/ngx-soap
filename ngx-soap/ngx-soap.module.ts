import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { SOAPService } from './soap.service';

@NgModule({
  imports: [ HttpModule ],
  providers: [ SOAPService ]
})
export class NgxSoapModule { }