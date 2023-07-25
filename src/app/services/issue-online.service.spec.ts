import { TestBed } from '@angular/core/testing';

import { IssueOnlineService } from './issue-online.service';

describe('IssueOnlineService', () => {
  let service: IssueOnlineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueOnlineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
