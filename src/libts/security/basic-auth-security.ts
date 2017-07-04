import * as _ from 'lodash';

export class BasicAuthSecurity {
  defaults: any;
  
  private _password: string;
  private _username: string;
  
  constructor(username: string, password: string, defaults: any) {
    this._username = username;
    this._password = password;
    this.defaults = {};

    _.merge(this.defaults, defaults);
  }

  addHeaders(headers: any): any {
    headers['Authorization'] = 'Basic ' + btoa(this._username + ':' + this._password);
    return headers;
  }

  toXML() {
    return '';
  }

  addOptions(options: any) {
    _.merge(options, this.defaults);
  }
}
