import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordNewComponent } from './reset-password.component';

describe('ResetPasswordNewComponent', () => {
  let component: ResetPasswordNewComponent;
  let fixture: ComponentFixture<ResetPasswordNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetPasswordNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
