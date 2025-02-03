import { TestBed } from '@angular/core/testing';

import { ServicesecService } from '../securityservice/servicesec.service';

describe('ServicesecService', () => {
  let service: ServicesecService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesecService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
