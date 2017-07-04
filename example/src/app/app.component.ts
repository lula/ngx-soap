import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { SOAPService, Client } from 'ngx-soap';

@Component({
  selector: 'app-root',
  template: `
    A: <input name="intA" [(ngModel)]="intA">
    B: <input name="intA" [(ngModel)]="intB">
    <button (click)="sum()">Sum</button>

    Result: {{result}}
    <pre>{{jsonResponse | json}}</pre>
  `
})
export class AppComponent {
  intA: string;
  intB: string;
  result: string;

  constructor(
    private http: Http,
    private soap: SOAPService
  ) { }

  sum() {
    this.http.get('/assets/calculator.wsdl').subscribe(response => {
      this.soap.createClient(response.text()).then((client: Client) => {
        let input = {
          intA: this.intA,
          intB: this.intB
        };

        (client as any).Add(input, (err, wsurl: string, headers: any, xml: string) => {
          wsurl = wsurl.replace("http://www.dneonline.com", "/calculator");
          
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
}
