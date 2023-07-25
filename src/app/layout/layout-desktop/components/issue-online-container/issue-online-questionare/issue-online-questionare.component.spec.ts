import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueOnlineQuestionareComponent } from './issue-online-questionare.component';

describe('IssueOnlineQuestionareComponent', () => {
  let component: IssueOnlineQuestionareComponent;
  let fixture: ComponentFixture<IssueOnlineQuestionareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueOnlineQuestionareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueOnlineQuestionareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
