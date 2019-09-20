/*
 * Copyright (c) 2011 Vinay Pulim <vinay@milewise.com>
 * MIT Licensed
 */

import * as url from 'url';
const req = null; // require('request');
import * as httpNtlm from 'httpntlm';
import { Buffer } from 'buffer';

const VERSION = '0.0.0'; //require('../package.json').version;

/**
 * A class representing the http client
 * @param [options] Options object. It allows the customization of
 * `request` module
 *
 */
export function HttpClient(options) {
  options = options || {};
  this._request = options.request || req;
}

/**
 * Build the HTTP request (method, uri, headers, ...)
 * @param  rurl The resource url
 * @param data The payload
 * @param  exheaders Extra http headers
 * @param  exoptions Extra options
 * @returns  The http request object for the `request` module
 */
HttpClient.prototype.buildRequest = function(rurl, data, exheaders, exoptions) {
  const curl = url.parse(rurl);
  const secure = curl.protocol === 'https:';
  const host = curl.hostname;
  const port = parseInt(curl.port, 10);
  const path = [curl.pathname || '/', curl.search || '', curl.hash || ''].join('');
  const method = data ? 'POST' : 'GET';
  const headers = {
    'User-Agent': 'node-soap/' + VERSION,
    'Accept': 'text/html,application/xhtml+xml,application/xml,text/xml;q=0.9,*/*;q=0.8',
    'Accept-Encoding': 'none',
    'Accept-Charset': 'utf-8',
    'Connection': exoptions && exoptions.forever ? 'keep-alive' : 'close',
    'Host': host + (isNaN(port) ? '' : ':' + port)
  };
  const attr = null;
  const header = null;
  const mergeOptions = ['headers'];

  if (typeof data === 'string') {
    headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  exheaders = exheaders || {};
  for (const attr in exheaders) {
    headers[attr] = exheaders[attr];
  }

  const options: any = {
    uri: curl,
    method: method,
    headers: headers,
    followAllRedirects: true
  };


  options.body = data;


  exoptions = exoptions || {};
  for (const attr in exoptions) {
    if (mergeOptions.indexOf(attr) !== -1) {
      for (const header in exoptions[attr]) {
        options[attr][header] = exoptions[attr][header];
      }
    } else {
      options[attr] = exoptions[attr];
    }
  }
  //console.log('Http request: %j', options);
  return options;
};

/**
 * Handle the http response
 * @param  The req object
 * @param  res The res object
 * @param  body The http body
 * @param  The parsed body
 */
HttpClient.prototype.handleResponse = function(req, res, body) {
  //console.log('Http response body: %j', body);
  if (typeof body === 'string') {
    // Remove any extra characters that appear before or after the SOAP
    // envelope.
    const match =
      body.replace(/<!--[\s\S]*?-->/, "").match(/(?:<\?[^?]*\?>[\s]*)?<([^:]*):Envelope([\S\s]*)<\/\1:Envelope>/i);
    if (match) {
      body = match[0];
    }
  }
  return body;
};

HttpClient.prototype.request = function(rurl, data, callback, exheaders, exoptions) {
  const self = this;
  const options = self.buildRequest(rurl, data, exheaders, exoptions);
  let req = null;

  if (exoptions !== undefined && exoptions.hasOwnProperty('ntlm')) {
    // // sadly when using ntlm nothing to return
    // // Not sure if this can be handled in a cleaner way rather than an if/else,
    // // will to tidy up if I get chance later, patches welcome - insanityinside
    options.url = rurl;
    httpNtlm[options.method.toLowerCase()](options, function (err, res) {
      if (err) {
        return callback(err);
      }
      // if result is stream
      if( typeof res.body !== 'string') {
        res.body = res.body.toString();
      }
      res.body = self.handleResponse(req, res, res.body);
      callback(null, res, res.body);
    });
  } else {
    req = self._request(options, function (err, res, body) {
      if (err) {
        return callback(err);
      }
      body = self.handleResponse(req, res, body);
      callback(null, res, body);
    });
  }

  return req;
};

HttpClient.prototype.requestStream = function(rurl, data, exheaders, exoptions) {
  const self = this;
  const options = self.buildRequest(rurl, data, exheaders, exoptions);
  return self._request(options);
};

// module.exports = HttpClient;

