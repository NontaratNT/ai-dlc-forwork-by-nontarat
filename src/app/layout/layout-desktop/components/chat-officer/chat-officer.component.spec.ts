import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatOfficerComponent } from './chat-officer.component';

describe('ChatOfficerComponent', () => {
  let component: ChatOfficerComponent;
  let fixture: ComponentFixture<ChatOfficerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatOfficerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
