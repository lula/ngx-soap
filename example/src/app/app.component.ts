import { Component, OnInit } from '@angular/core';
import { SOAPService, Client } from 'ngx-soap';
import { Http } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  intA: string;
  intB: string;
  jsonResponse: any;
  xmlResponse: string;
  message: string;
  loading: boolean;
  resultLabel: string;
  showDiagnostic: boolean = false; 
  
  private client: Client;

  constructor(
    private http: Http,
    private soap: SOAPService
  ) { }

  ngOnInit() {
    this.http.get('/assets/calculator.wsdl').subscribe(response => {
      if (response && response.text()) {
        this.soap.createClient(response.text()).then((client: Client) => {
          this.client = client;
        });
      }
    });
  }

  sum() {
    this.clear();
    this.loading = true;
    this.checkNumbers()

    this.resultLabel = 'A + B';
    let body: CalculatorWS.Input = {
      intA: this.intA,
      intB: this.intB
    };

    this.client.operation('Add', body)
      .then(operation => {
        if(operation.error) {
          console.log('Operation error', operation.error);
          return;
        }

        let url = operation.url.replace("http://www.dneonline.com", "/calculator");
        this.http.post(url, operation.xml, { headers: operation.headers }).subscribe(
          response => {
            this.xmlResponse = response.text();
            this.jsonResponse = this.client.parseResponseBody(response.text());
            try {
              this.message = this.jsonResponse.Body.AddResponse.AddResult;
            } catch (error) { }
            this.loading = false;
          },
          err => {
            console.log("Error calling ws", err);
            this.loading = false;
          }
        );
      })
      .catch(err => console.log('Error', err));
  }

  subtract() {
    this.clear();
    this.loading = true;
    this.checkNumbers()

    this.resultLabel = 'A - B';

    let body: CalculatorWS.Input = {
      intA: this.intA,
      intB: this.intB
    };

    this.client.operation("Subtract", body)
      .then(operation => {
        let url = operation.url.replace("http://www.dneonline.com", "/calculator");
        this.http.post(url, operation.xml, { headers: operation.headers }).subscribe(
          response => {
            this.xmlResponse = response.text();
            this.jsonResponse = this.client.parseResponseBody(response.text());
            try {
              this.message = this.jsonResponse.Body.SubtractResponse.SubtractResult;
            } catch (error) { }
            this.loading = false;
          },
          err => {
            console.log("Error calling ws", err);
            this.loading = false;
          });
      })
      .catch(err => console.log("Error", err));
  }

  checkNumbers() {
    if (!+this.intA) this.intA = '0';
    if (!+this.intB) this.intB = '0';
  }

  clear() {
    this.message = undefined;
    this.jsonResponse = undefined;
    this.xmlResponse = undefined;
  }
}
