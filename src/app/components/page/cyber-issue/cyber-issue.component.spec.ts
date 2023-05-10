import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberIssueComponent } from './cyber-issue.component';

describe('CyberIssueComponent', () => {
  let component: CyberIssueComponent;
  let fixture: ComponentFixture<CyberIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyberIssueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyberIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
