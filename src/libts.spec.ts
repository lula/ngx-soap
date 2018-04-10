import { readFileSync, writeFileSync } from 'fs';
import { request, ClientResponse } from 'http';

import { createSoapClient } from './libts/soap';
import { Client, Operation } from './libts/client';

const wsdl = readFileSync('./spec/assets/calculator.wsdl', 'utf-8');

// describe('Client', () => {
//   var expectedClient: Client;
//   beforeEach((done: any) => {
//     createSoapClient(wsdl).then(client => {
//       expectedClient = client;
//       done();
//     }).catch(err => done());
//   });

//   it("client should be created", () => expect(expectedClient).toBeDefined());
//   it("client should be a Client", () => expect(expectedClient instanceof Client).toBeTruthy());
// });

// describe('Operation info', () => {
//   var expectedOperation: Operation;
//   beforeEach((done: any) => {
//     createSoapClient(wsdl).then(client => {
//       client.operation('Add', {
//         intA: '1',
//         intB: '2'
//       }).then(operation => {
//         expectedOperation = operation;
//         done();
//       })
//     }).catch(err => done());
//   });

//   it("Add operation should be defined", () => expect(expectedOperation).toBeDefined());
//   it("Add operation operation url should be http://www.dneonline.com/calculator.asmx", () => expect(expectedOperation.url).toBe('http://www.dneonline.com/calculator.asmx'));
// });

describe('Operation request and response parsing', () => {
  var expectedResult: number;

  let operationBody = {
    intA: '1',
    intB: '2'
  };

  let response: any;

  beforeEach((done: any) => {
    let client = createSoapClient(wsdl);
    client.operation('Add', operationBody).then(operation => {
      let protocol = (operation.url as string).split("//")[0];
      let host = (operation.url as string).split(protocol + "//")[1].split(":")[1] ?
        (operation.url as string).split(protocol + "//")[1].split(":")[0]
        :
        (operation.url as string).split(protocol + "//")[1].split('/')[0];
      let port = (operation.url as string).split("://")[1].split(":")[1] ?
        (operation.url as string).split("//")[1].split(":")[1].split("/")[0]
        :
        '';
      let path = (operation.url as string).split("://")[1].split(":")[1] ?
        (operation.url as string).split("//")[1].split(":")[1].split("/")[1]
        :
        (operation.url as string).split("//")[1].split('/')[1];

      const req = request({
        method: "POST",
        hostname: host,
        protocol: protocol,
        path: "/" + path,
        headers: operation.headers
      }, (res) => {
        response = res;
        const { statusCode } = res;
        let rawData = '';

        res.setEncoding('utf8');
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          try {
            let json: any = client.parseResponseBody(rawData);
            try {
              expectedResult = json.Body.AddResponse.AddResult;
            } catch (e) { console.log("Error", e); };
            done();
          } catch (e) {
            console.error("Error", e.message);
          }
        });
      });

      req.write(operation.xml);
      req.end();
    })
  });

  it("Status should be 200", () => expect(response.statusCode).toBe(200));
  it("1 + 2 result should be 3", () => expect(expectedResult).toBe(3));
});