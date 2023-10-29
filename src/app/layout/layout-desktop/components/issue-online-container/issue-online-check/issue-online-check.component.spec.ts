import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueOnlineCheckComponent } from './issue-online-check.component';

describe('IssueOnlineCheckComponent', () => {
  let component: IssueOnlineCheckComponent;
  let fixture: ComponentFixture<IssueOnlineCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueOnlineCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueOnlineCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
