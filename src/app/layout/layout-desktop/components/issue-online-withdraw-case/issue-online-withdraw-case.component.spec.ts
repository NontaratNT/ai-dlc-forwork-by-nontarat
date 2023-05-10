import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueOnlineWithdrawCaseComponent } from './issue-online-withdraw-case.component';

describe('IssueOnlineWithdrawCaseComponent', () => {
  let component: IssueOnlineWithdrawCaseComponent;
  let fixture: ComponentFixture<IssueOnlineWithdrawCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueOnlineWithdrawCaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueOnlineWithdrawCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
