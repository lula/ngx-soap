# ngx-soap

Simple SOAP client for Angular 6/7 based on amazing [node-soap](https://github.com/vpulim/node-soap).

Project has been recreated from scratch with Angualr 6 CLI.

## npm

1. install ngx-soap and dependencies

    `npm install --save ngx-soap`

    `npm install --save buffer concat-stream core-js crypto-js events lodash sax stream uuid`

2. Add NgxSoapModule to your app module

    ```
    import { NgxSoapModule } from 'ngx-soap';
    ...
        @NgModule({
            imports: [ ..., NgxSoapModule, ... ]
        ...
    ```
    
3. Inject NgxSoapService in your component:

    ```
    ...
    import { NgxSoapService, Client, ISoapMethodResponse } from 'ngx-soap';
    ...
    
    @Component({
      selector: 'app-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.css']
    })
    export class AppComponent {
        client: Client;
        intA = 2;
        intB = 3;
        
        constructor(private soap: NgxSoapService) {
            this.soap.createClient('assets/calculator.wsdl').subscribe(client => this.client = client);
        }
        
        sum() {
            const body = {
              intA: this.intA,
              intB: this.intB
            };
            (<any>this.client).Add(body).subscribe((res: ISoapMethodResponse) => this.message = res.result.AddResult);
        }
    }
    ```


## Local development

1. `git clone -b angular6-cli-ilb https://github.com/lula/ngx-soap.git`
2. `cd ngx-soap && npm install`
3. `ng build ngx-soap`
4. `ng test ngx-soap`
5. `ng serve --proxy-config proxy.conf.json`

See example app under `src/app`
