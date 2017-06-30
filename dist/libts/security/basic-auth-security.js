import * as _ from 'lodash';
var BasicAuthSecurity = (function () {
    function BasicAuthSecurity(username, password, defaults) {
        this._username = username;
        this._password = password;
        this.defaults = {};
        _.merge(this.defaults, defaults);
    }
    BasicAuthSecurity.prototype.addHeaders = function (headers) {
        headers['Authorization'] = 'Basic ' + btoa(this._username + ':' + this._password);
        return headers;
    };
    BasicAuthSecurity.prototype.toXML = function () {
        return '';
    };
    BasicAuthSecurity.prototype.addOptions = function (options) {
        _.merge(options, this.defaults);
    };
    return BasicAuthSecurity;
}());
export { BasicAuthSecurity };
//# sourceMappingURL=basic-auth-security.js.map