import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueOnlineDamageSubComponent } from './issue-online-damage-sub.component';

describe('IssueOnlineDamageSubComponent', () => {
  let component: IssueOnlineDamageSubComponent;
  let fixture: ComponentFixture<IssueOnlineDamageSubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueOnlineDamageSubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueOnlineDamageSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
