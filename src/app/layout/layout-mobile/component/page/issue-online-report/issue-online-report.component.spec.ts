import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueOnlineReportComponent } from './issue-online-report.component';

describe('IssueOnlineReportComponent', () => {
  let component: IssueOnlineReportComponent;
  let fixture: ComponentFixture<IssueOnlineReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueOnlineReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueOnlineReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
