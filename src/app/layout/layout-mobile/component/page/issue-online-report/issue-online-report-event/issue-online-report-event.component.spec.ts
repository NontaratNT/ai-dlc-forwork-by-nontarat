import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueOnlineReportEventComponent } from './issue-online-report-event.component';

describe('IssueOnlineReportEventComponent', () => {
  let component: IssueOnlineReportEventComponent;
  let fixture: ComponentFixture<IssueOnlineReportEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueOnlineReportEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueOnlineReportEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
