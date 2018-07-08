import { TestBed, inject } from '@angular/core/testing';

import { NgxSoapService } from './ngx-soap.service';

describe('NgxSoapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxSoapService]
    });
  });

  it('should be created', inject([NgxSoapService], (service: NgxSoapService) => {
    expect(service).toBeTruthy();
  }));
});
