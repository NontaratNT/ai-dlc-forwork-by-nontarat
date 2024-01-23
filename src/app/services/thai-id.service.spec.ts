import { TestBed } from '@angular/core/testing';

import { ThaiIDService } from './thai-id.service';

describe('ThaiIDService', () => {
  let service: ThaiIDService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThaiIDService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
