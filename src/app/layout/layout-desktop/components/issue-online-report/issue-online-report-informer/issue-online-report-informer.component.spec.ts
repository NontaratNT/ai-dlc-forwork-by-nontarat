import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueOnlineReportInformerComponent } from './issue-online-report-informer.component';

describe('IssueOnlineReportInformerComponent', () => {
  let component: IssueOnlineReportInformerComponent;
  let fixture: ComponentFixture<IssueOnlineReportInformerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueOnlineReportInformerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueOnlineReportInformerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
