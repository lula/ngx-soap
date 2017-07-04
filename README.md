# ngx-soap

Simple SOAP client for Angular 4 based on amazing [node-soap](https://github.com/vpulim/node-soap) library which apparently should only work in a node ambient and not in browsers.

WSDL definitions generator is based on [json2ts](https://github.com/GregorBiswanger/json2ts), which is copied in tools/main.ts and updated a little given initial test cases I worked with.

Still at a very initial stage.

## Installation

`npm install --save ngx-soap`

## Example

In this example the example app is created with angular cli:

`ng new example`

`cd example`

Install `ngx-soap`:

`npm install --save ngx-soap`

Import NgxSoapModule in app module:

    import { NgxSoapModule } from 'ngx-soap';
    ...
    
    @NgModule({
      imports: [
        ...,
        NgxSoapModule
      ],
      ...
    })
    export class AppModule { }


Let's use the `calculator.wsdl` definitions ([complete wsdl](http://www.dneonline.com/calculator.asmx?WSDL)):

    <?xml version="1.0" encoding="utf-8"?>
    <wsdl:definitions 
        xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
        xmlns:tm="http://microsoft.com/wsdl/mime/textMatching/" 
        xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" 
        xmlns:mime="http://schemas.xmlsoap.org/wsdl/mime/" 
        xmlns:tns="http://tempuri.org/" 
        xmlns:s="http://www.w3.org/2001/XMLSchema" 
        xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
        xmlns:http="http://schemas.xmlsoap.org/wsdl/http/" targetNamespace="http://tempuri.org/" 
        xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">
        <wsdl:types>
            <s:schema elementFormDefault="qualified" targetNamespace="http://tempuri.org/">
                <s:element name="Add">
                    <s:complexType>
                        <s:sequence>
                            <s:element minOccurs="1" maxOccurs="1" name="intA" type="s:int" />
                            <s:element minOccurs="1" maxOccurs="1" name="intB" type="s:int" />
                        </s:sequence>
                    </s:complexType>
                </s:element>
                <s:element name="AddResponse">
                    <s:complexType>
                        <s:sequence>
                            <s:element minOccurs="1" maxOccurs="1" name="AddResult" type="s:int" />
                        </s:sequence>
                    </s:complexType>
                </s:element>
            </s:schema>
        </wsdl:types>
        <wsdl:message name="AddSoapIn">
            <wsdl:part name="parameters" element="tns:Add" />
        </wsdl:message>
        <wsdl:message name="AddSoapOut">
            <wsdl:part name="parameters" element="tns:AddResponse" />
        </wsdl:message>
        <wsdl:portType name="CalculatorSoap">
            <wsdl:operation name="Add">
                <wsdl:documentation 
                    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">Adds two integers. This is a test WebService. ©DNE Online
                </wsdl:documentation>
                <wsdl:input message="tns:AddSoapIn" />
                <wsdl:output message="tns:AddSoapOut" />
            </wsdl:operation>
        </wsdl:portType>
        <wsdl:binding name="CalculatorSoap" type="tns:CalculatorSoap">
            <soap:binding transport="http://schemas.xmlsoap.org/soap/http" />
            <wsdl:operation name="Add">
                <soap:operation soapAction="http://tempuri.org/Add" style="document" />
                <wsdl:input>
                    <soap:body use="literal" />
                </wsdl:input>
                <wsdl:output>
                    <soap:body use="literal" />
                </wsdl:output>
            </wsdl:operation>
        </wsdl:binding>
        <wsdl:binding name="CalculatorSoap12" type="tns:CalculatorSoap">
            <soap12:binding transport="http://schemas.xmlsoap.org/soap/http" />
            <wsdl:operation name="Add">
                <soap12:operation soapAction="http://tempuri.org/Add" style="document" />
                <wsdl:input>
                    <soap12:body use="literal" />
                </wsdl:input>
                <wsdl:output>
                    <soap12:body use="literal" />
                </wsdl:output>
            </wsdl:operation>
        </wsdl:binding>
        <wsdl:service name="Calculator">
            <wsdl:port name="CalculatorSoap" binding="tns:CalculatorSoap">
                <soap:address location="http://www.dneonline.com/calculator.asmx" />
            </wsdl:port>
            <wsdl:port name="CalculatorSoap12" binding="tns:CalculatorSoap12">
                <soap12:address location="http://www.dneonline.com/calculator.asmx" />
            </wsdl:port>
        </wsdl:service>
    </wsdl:definitions>

The WSDL must be read by the client (e.g with an http request) and its content used with SOAPService service. In the example app the WSDL is served from `assets` folder.

Import SOAPService and inject it in your component, then: 

1. get WSDL content 
2. create the client with the WSDL content definitions
3. call the operation with a JSON input. The client operation method is created dynamically (from the WSDL), therefore it cannot be part of the typescript definitions. You can extend typescript definitions or cast the client to `any` type for instance. The operation returns a callback with the following parameters: 
    - err: error, if any
    - wsurl: operation URL from WSDL to be used in the HTTP request
    - headers: HTTP headers you may use in the HTTP request
    - xml: the input body parsed as xml text to be used in the HTTP request
4. call the operation URL from WSDL with operation parameters (wsurl, xml, headers)

        constructor( private http: Http, private soap: SOAPService) { }

        sum() {
          // get wsdl content
          this.http.get('/assets/calculator.wsdl').subscribe(response => {
          
            // create the client for the wsdl
            this.soap.createClient(response.text()).then((client: Client) => {
              let input = {
                intA: this.intA,
                intB: this.intB
              };

              // call the web service operation
              (client as any).Add(input, (err, wsurl: string, headers: any, xml: string) => {

                // to avoid CORS problems the app use a proxy (see proxy.conf.json)
                wsurl = wsurl.replace("http://www.dneonline.com", "/calculator");

                // call the web service url
                this.http.post(wsurl, xml, { headers: headers }).subscribe(
                  response => {
                    let jsonResponse = client.parseResponseBody(response.text());
                    this.result = jsonResponse.Body.AddResponse.AddResult;
                  }
                );
              });
            });
          });
        }
