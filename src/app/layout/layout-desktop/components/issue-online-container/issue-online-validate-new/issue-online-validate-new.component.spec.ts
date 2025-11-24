import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueOnlineValidateNewComponent } from './issue-online-validate-new.component';

describe('IssueOnlineValidateNewComponent', () => {
  let component: IssueOnlineValidateNewComponent;
  let fixture: ComponentFixture<IssueOnlineValidateNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueOnlineValidateNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueOnlineValidateNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
