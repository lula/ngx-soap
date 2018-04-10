import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SOAPService } from './soap.service';

@NgModule({
  imports: [ HttpClientModule ],
  providers: [ SOAPService ]
})
export class NgxSoapModule { }