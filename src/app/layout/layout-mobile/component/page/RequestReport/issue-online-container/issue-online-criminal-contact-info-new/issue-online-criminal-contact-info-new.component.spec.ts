import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueOnlineCriminalContactInfoNewComponent } from './issue-online-criminal-contact-info-new.component';

describe('IssueOnlineCriminalContactInfoNewComponent', () => {
  let component: IssueOnlineCriminalContactInfoNewComponent;
  let fixture: ComponentFixture<IssueOnlineCriminalContactInfoNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueOnlineCriminalContactInfoNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueOnlineCriminalContactInfoNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
