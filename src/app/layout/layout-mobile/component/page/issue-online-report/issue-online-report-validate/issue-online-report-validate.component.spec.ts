import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueOnlineReportValidateComponent } from './issue-online-report-validate.component';

describe('IssueOnlineReportValidateComponent', () => {
  let component: IssueOnlineReportValidateComponent;
  let fixture: ComponentFixture<IssueOnlineReportValidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueOnlineReportValidateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueOnlineReportValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
