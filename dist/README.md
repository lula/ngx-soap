# ngx-soap

Simple SOAP client for Angular 4 based on amazing [node-soap](https://github.com/vpulim/node-soap) library which apparently should only work in a node ambient and not in browsers.

WSDL definitions generator is based on [json2ts](https://github.com/GregorBiswanger/json2ts), which is copied in tools/main.ts and updated a little given initial test cases I worked with.

Still at a very initial stage.

## Installation
`npm install ngx-soap`

## Usage
Import NgxSoapModule in yout app.module:

    import { NgxSoapModule } from 'ngx-soap';
    
    @NgModule({
      imports: [
        NgxSoapModule,
        ...
      ],
      ...
    })
    export class AppModule {}

Import SOAPService and inject it in your component:

    import { SOAPService, BasicAuthSecurity, Client } from 'ngx-soap';

    @Component({
      template: `
        <button (click)="callService()"></button>
        <pre>{{jsonResponse | json}}</pre>
      `
    })
    export class MyComponent {
      jsonResponse: any;
      constructor(
        private soap: SOAPService
      ) { }

      callService() {
        
      }
    }