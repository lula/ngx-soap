# ngx-soap

Simple SOAP client for Angular 4 based on amazing [node-soap](https://github.com/vpulim/node-soap) library which apparently should only work in a node ambient and not in browsers.

WSDL definitions generator is based on [json2ts](https://github.com/GregorBiswanger/json2ts), which is copied in tools/main.ts and updated a little given initial test cases I worked with.

Still at a very initial stage.

## Installation
`npm install ngx-soap`

## Usage
Let's take the following WSDL:

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
                <s:element name="Subtract">
                    <s:complexType>
                        <s:sequence>
                            <s:element minOccurs="1" maxOccurs="1" name="intA" type="s:int" />
                            <s:element minOccurs="1" maxOccurs="1" name="intB" type="s:int" />
                        </s:sequence>
                    </s:complexType>
                </s:element>
                <s:element name="SubtractResponse">
                    <s:complexType>
                        <s:sequence>
                            <s:element minOccurs="1" maxOccurs="1" name="SubtractResult" type="s:int" />
                        </s:sequence>
                    </s:complexType>
                </s:element>
                <s:element name="Multiply">
                    <s:complexType>
                        <s:sequence>
                            <s:element minOccurs="1" maxOccurs="1" name="intA" type="s:int" />
                            <s:element minOccurs="1" maxOccurs="1" name="intB" type="s:int" />
                        </s:sequence>
                    </s:complexType>
                </s:element>
                <s:element name="MultiplyResponse">
                    <s:complexType>
                        <s:sequence>
                            <s:element minOccurs="1" maxOccurs="1" name="MultiplyResult" type="s:int" />
                        </s:sequence>
                    </s:complexType>
                </s:element>
                <s:element name="Divide">
                    <s:complexType>
                        <s:sequence>
                            <s:element minOccurs="1" maxOccurs="1" name="intA" type="s:int" />
                            <s:element minOccurs="1" maxOccurs="1" name="intB" type="s:int" />
                        </s:sequence>
                    </s:complexType>
                </s:element>
                <s:element name="DivideResponse">
                    <s:complexType>
                        <s:sequence>
                            <s:element minOccurs="1" maxOccurs="1" name="DivideResult" type="s:int" />
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
        <wsdl:message name="SubtractSoapIn">
            <wsdl:part name="parameters" element="tns:Subtract" />
        </wsdl:message>
        <wsdl:message name="SubtractSoapOut">
            <wsdl:part name="parameters" element="tns:SubtractResponse" />
        </wsdl:message>
        <wsdl:message name="MultiplySoapIn">
            <wsdl:part name="parameters" element="tns:Multiply" />
        </wsdl:message>
        <wsdl:message name="MultiplySoapOut">
            <wsdl:part name="parameters" element="tns:MultiplyResponse" />
        </wsdl:message>
        <wsdl:message name="DivideSoapIn">
            <wsdl:part name="parameters" element="tns:Divide" />
        </wsdl:message>
        <wsdl:message name="DivideSoapOut">
            <wsdl:part name="parameters" element="tns:DivideResponse" />
        </wsdl:message>
        <wsdl:portType name="CalculatorSoap">
            <wsdl:operation name="Add">
                <wsdl:documentation 
                    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">Adds two integers. This is a test WebService. ©DNE Online
                </wsdl:documentation>
                <wsdl:input message="tns:AddSoapIn" />
                <wsdl:output message="tns:AddSoapOut" />
            </wsdl:operation>
            <wsdl:operation name="Subtract">
                <wsdl:input message="tns:SubtractSoapIn" />
                <wsdl:output message="tns:SubtractSoapOut" />
            </wsdl:operation>
            <wsdl:operation name="Multiply">
                <wsdl:input message="tns:MultiplySoapIn" />
                <wsdl:output message="tns:MultiplySoapOut" />
            </wsdl:operation>
            <wsdl:operation name="Divide">
                <wsdl:input message="tns:DivideSoapIn" />
                <wsdl:output message="tns:DivideSoapOut" />
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
            <wsdl:operation name="Subtract">
                <soap:operation soapAction="http://tempuri.org/Subtract" style="document" />
                <wsdl:input>
                    <soap:body use="literal" />
                </wsdl:input>
                <wsdl:output>
                    <soap:body use="literal" />
                </wsdl:output>
            </wsdl:operation>
            <wsdl:operation name="Multiply">
                <soap:operation soapAction="http://tempuri.org/Multiply" style="document" />
                <wsdl:input>
                    <soap:body use="literal" />
                </wsdl:input>
                <wsdl:output>
                    <soap:body use="literal" />
                </wsdl:output>
            </wsdl:operation>
            <wsdl:operation name="Divide">
                <soap:operation soapAction="http://tempuri.org/Divide" style="document" />
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
            <wsdl:operation name="Subtract">
                <soap12:operation soapAction="http://tempuri.org/Subtract" style="document" />
                <wsdl:input>
                    <soap12:body use="literal" />
                </wsdl:input>
                <wsdl:output>
                    <soap12:body use="literal" />
                </wsdl:output>
            </wsdl:operation>
            <wsdl:operation name="Multiply">
                <soap12:operation soapAction="http://tempuri.org/Multiply" style="document" />
                <wsdl:input>
                    <soap12:body use="literal" />
                </wsdl:input>
                <wsdl:output>
                    <soap12:body use="literal" />
                </wsdl:output>
            </wsdl:operation>
            <wsdl:operation name="Divide">
                <soap12:operation soapAction="http://tempuri.org/Divide" style="document" />
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

The WSDL exposes math operations. 

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

    import { SOAPService, Client } from 'ngx-soap';

    @Component({
      template: `
        A: <input name="intA" [(ngModel)]="intA">
        B: <input name="intA" [(ngModel)]="intB">
        Result: {{result}}
        <button (click)="sum()"></button>
        <pre>{{jsonResponse | json}}</pre>
      `
    })
    export class MyComponent {
      intA: string;
      intB: string;
      result: string;

      constructor(
        private soap: SOAPService
      ) { }

      sum() {
        this.http.get('/assets/calculator.wsdl').subscribe(response => {
          this.soap.createClient(response.text()).then((client: Client) => {
            let input = {
              intA: this.intA,
              intB: this.intB
            };

            (this.client as any).Add(input, (err, wsurl: string, headers: any, xml: string) => {
              this.http.post(wsurl, xml, { headers: headers }).subscribe(
                response => {
                  let jsonResponse = this.client.parseResponseBody(response.text());
                  this.result = jsonResponse.Body.AddResponse.AddResult;
                }
              );
          });
        });
      }
    }