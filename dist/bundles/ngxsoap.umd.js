(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/http'), require('rxjs/add/operator/map')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/http', 'rxjs/add/operator/map'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.ngxsoap = global.ng.ngxsoap || {}),global.ng.core,global.ng.http));
}(this, (function (exports,_angular_core,_angular_http) { 'use strict';

/*
 * Copyright (c) 2011 Vinay Pulim <vinay@milewise.com>
 * MIT Licensed
 */
var Client = require('./client').Client;
var Server = require('./server').Server;
var HttpClient = require('./http');
var security = require('./security');
var passwordDigest = require('./utils').passwordDigest;
var wsdl = require('./wsdl');
var WSDL = require('./wsdl').WSDL;
function createCache() {
    var cache = {};
    return function (key, load, callback) {
        if (!cache[key]) {
            load(function (err, result) {
                if (err) {
                    return callback(err);
                }
                cache[key] = result;
                callback(null, result);
            });
        }
        else {
            process.nextTick(function () {
                callback(null, cache[key]);
            });
        }
    };
}
var getFromCache = createCache();
function _requestWSDL(url, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }
    var openWsdl = wsdl.open_wsdl.bind(null, url, options);
    if (options.disableCache === true) {
        openWsdl(callback);
    }
    else {
        getFromCache(url, openWsdl, callback);
    }
}
function createClient(url, options, callback, endpoint) {
    if (typeof options === 'function') {
        endpoint = callback;
        callback = options;
        options = {};
    }
    endpoint = options.endpoint || endpoint;
    _requestWSDL(url, options, function (err, wsdl) {
        callback(err, wsdl && new Client(wsdl, endpoint, options));
    });
}
function listen(server, pathOrOptions, services, xml) {
    var options = {}, path = pathOrOptions, uri = null;
    if (typeof pathOrOptions === 'object') {
        options = pathOrOptions;
        path = options.path;
        services = options.services;
        xml = options.xml;
        uri = options.uri;
    }
    var wsdl = new WSDL(xml || services, uri, options);
    return new Server(server, path, services, wsdl, options);
}
exports.security = security;
exports.BasicAuthSecurity = security.BasicAuthSecurity;
exports.WSSecurity = security.WSSecurity;
exports.WSSecurityCert = security.WSSecurityCert;
exports.ClientSSLSecurity = security.ClientSSLSecurity;
exports.ClientSSLSecurityPFX = security.ClientSSLSecurityPFX;
exports.BearerSecurity = security.BearerSecurity;
exports.createClient = createClient;
exports.passwordDigest = passwordDigest;
exports.listen = listen;
exports.WSDL = WSDL;
// Export Client and Server to allow customization
exports.Server = Server;
exports.Client = Client;
exports.HttpClient = HttpClient;
var soap = {
    createClient: createClient
};

var SOAPService = (function () {
    function SOAPService(http) {
        this.http = http;
    }
    SOAPService.prototype.call = function (url, options) {
        if (options === void 0) { options = {}; }
        return new Promise(function (resolve, reject) {
            try {
                soap.createClient(url, options, function (err, client) {
                    if (err)
                        reject("Error" + err);
                    else
                        resolve("Working!" + client);
                });
            }
            catch (e) {
                reject(e);
            }
        });
    };
    return SOAPService;
}());
// call(url: string, options: any = {}): Observable<any> {
//   return this.getWsdl(url, options);
// }
// getWsdl(url: string, options: any = {}): Observable<any> {
//   options.headers = new Headers();
//   options.headers.append("Content-Type", "text/xml");
//   return this.http.get(url, options).map(response => console.log(response.text()));
// }
SOAPService.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
SOAPService.ctorParameters = function () { return [
    { type: _angular_http.Http, },
]; };

var NgxSoapModule = (function () {
    function NgxSoapModule() {
    }
    return NgxSoapModule;
}());
NgxSoapModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [_angular_http.HttpModule],
                providers: [SOAPService]
            },] },
];
/** @nocollapse */
NgxSoapModule.ctorParameters = function () { return []; };

exports.NgxSoapModule = NgxSoapModule;
exports.SOAPService = SOAPService;

Object.defineProperty(exports, '__esModule', { value: true });

})));
