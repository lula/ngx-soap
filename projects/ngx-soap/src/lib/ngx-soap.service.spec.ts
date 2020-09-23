import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { ISoapMethodResponse } from 'ngx-soap/ngx-soap';
import { NgxSoapService } from './ngx-soap.service';
import { NgxSoapModule } from './ngx-soap.module';


const PROXIED_CALCULATOR_WSDL = `<?xml version="1.0" encoding="utf-8"?>
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
            <soap:address location="/calculator/calculator.asmx" />
        </wsdl:port>
        <wsdl:port name="CalculatorSoap12" binding="tns:CalculatorSoap12">
            <soap12:address location="/calculator/calculator.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>`;

let service: NgxSoapService;
let httpMock: HttpTestingController;

describe('NgxSoapService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule, NgxSoapModule],
            providers: [NgxSoapService]
        });
        service = TestBed.inject(NgxSoapService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should create client from calculator.wsdl', () => {
        service.createClient('/calculator.wsdl', { disableCache: true })
            .then(client => {
                expect(client).toBeTruthy();
                client.call('Add', { intA: 3, intB: 2 }, { exchangeId: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000' })
            })
            .catch(err => console.log('Error', err));

        const req = httpMock.expectOne('/calculator.wsdl');
        expect(req.request.method).toBe("GET");
        req.flush(PROXIED_CALCULATOR_WSDL);
    });

    it('should create client from calculator.wsdl', () => {
        service.createClient('/calculator.wsdl', { disableCache: true })
            .then(client => expect(client).toBeTruthy())
            .catch(err => console.log('Error', err));

        let req = httpMock.expectOne('/calculator.wsdl');
        req.flush(PROXIED_CALCULATOR_WSDL);
        httpMock.verify();
    });

    it('3 + 2 should be equal to 5', () => {
        service.createClient('/calculator.wsdl', { disableCache: true })
            .then(client => {
                client.call('Add', {
                    intA: 3,
                    intB: 2
                }, { exchangeId: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000' }).subscribe((soapResponse: ISoapMethodResponse) => {
                    expect(soapResponse.result.AddResult).toBe(5);
                }, err => console.error(err));

                let req = httpMock.expectOne('/calculator/calculator.asmx');
                let res = {
                    headers: {},
                    body: ``
                };
                req.flush('<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><soap:Body><AddResponse xmlns="http://tempuri.org/"><AddResult>5</AddResult></AddResponse></soap:Body></soap:Envelope>');
                httpMock.verify();
            })
            .catch(err => console.log('Error', err));

        let req = httpMock.expectOne('/calculator.wsdl');
        expect(req.request.method).toBe("GET");
        req.flush(PROXIED_CALCULATOR_WSDL);
    });

    it('should raise an error when calling a missing operation', () => {
        service
            .createClient('/calculator.wsdl', { disableCache: true })
            .then(client => {
                const method = 'NonExistingMethod';
                client
                    .call(method, {}, { exchangeId: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000' })
                    .subscribe(() => { }, err => expect(err).toBe(`Method ${method} not found`));
            });

        const req = httpMock.expectOne('/calculator.wsdl');
        expect(req.request.method).toBe("GET");
        req.flush(PROXIED_CALCULATOR_WSDL);
    });
});
