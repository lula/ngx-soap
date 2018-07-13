# ngx-soap

Simple SOAP client for Angular 6 based on amazing [node-soap](https://github.com/vpulim/node-soap).

Project has been recreated from scratch with Angualr 6 CLI.

## npm

1. install ngx-soap and dependencies

    `npm install --save ngx-soap buffer concat-stream core-js crypto-browserify events lodash sax stream uuid'`
2. Add NgxSoapModule to your app module like:
    ```
    import { NgxSoapModule } from 'ngx-soap';
    ...
        @NgModule({
            imports: [ NgxSoapModule, ... ]
        ...
    ```

## Local tests

1. `git clone -b angular6-cli-ilb https://github.com/lula/ngx-soap.git`
2. `cd ngx-soap && npm install`
3. `ng build ngx-soap`
4. `ng serve`

See example app under `src/app`