import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueOnlineBlessingComponent } from './issue-online-blessing.component';

describe('IssueOnlineBlessingComponent', () => {
  let component: IssueOnlineBlessingComponent;
  let fixture: ComponentFixture<IssueOnlineBlessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueOnlineBlessingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueOnlineBlessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
