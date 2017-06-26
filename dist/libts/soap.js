import { openWsdl } from './wsdl';
import { Client } from "./client";
export function createSoapClient(url, http, options, endpoint) {
    if (options === void 0) { options = {}; }
    return new Promise(function (resolve, reject) {
        endpoint = options.endpoint || endpoint;
        openWsdl(url, http, options)
            .then(function (wsdl) {
            resolve(new Client(wsdl));
        })
            .catch(function (err) { return reject(err); });
        // else resolve(wsdl && new Client(wsdl, endpoint, http, options));
        // });
    });
}
//# sourceMappingURL=soap.js.map