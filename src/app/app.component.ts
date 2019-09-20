import { Component, OnInit } from '@angular/core';
import { NgxSoapService, ISoapMethod, Client, ISoapMethodResponse } from 'ngx-soap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  intA: number;
  intB: number;
  loading: boolean;
  showDiagnostic: boolean;
  message: string;
  xmlResponse: string;
  jsonResponse: string;
  resultLabel: string;
  client: Client;

  constructor(private soap: NgxSoapService) {
    this.soap.createClient('https://support.arhofoms.ru/ws/disp-observation/test/', {
      forceSoap12Headers: true,
      returnFault: true
    })
      .then(client => {
        console.log('Client', client);
        this.client = client;
        const body={
          year: '2019',
          paging:{
            start: -1,
            qty: 2
          }
        };
        const header = {
          'svc-req:message-id': 'value',
          'svc-req:auth': {
            'svc-req:username': 290104,
            'svc-req:password': 290104
          }
        };
        this.client.addSoapHeader(header);
        this.client.call('GetObservations-v1',body).subscribe(
          (result:ISoapMethodResponse) => {
            console.table(result.result);
          },
          (error) => {console.warn(error);}
      )})
      .catch(err => console.warn('Error', err));
    
    
  }
  ngOnInit(){
    
  }

  /* sum() {
    this.loading = true;
    const body = {
      intA: this.intA,
      intB: this.intB
    };

    this.client.call('Add', body).subscribe(res => {
      this.xmlResponse = res.responseBody;
      this.message = res.result.AddResult;
      this.loading = false;
    }, err => console.log(err));    
  } */

}
