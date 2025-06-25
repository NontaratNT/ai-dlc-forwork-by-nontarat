import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatOfficerDetailComponent } from './chat-officer-detail.component';

describe('ChatOfficerDetailComponent', () => {
  let component: ChatOfficerDetailComponent;
  let fixture: ComponentFixture<ChatOfficerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatOfficerDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatOfficerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
