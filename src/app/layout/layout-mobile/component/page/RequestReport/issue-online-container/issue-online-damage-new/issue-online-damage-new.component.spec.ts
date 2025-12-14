import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueOnlineDamageNewComponent } from './issue-online-damage-new.component';

describe('IssueOnlineDamageNewComponent', () => {
  let component: IssueOnlineDamageNewComponent;
  let fixture: ComponentFixture<IssueOnlineDamageNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueOnlineDamageNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueOnlineDamageNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
