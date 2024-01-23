import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginThaiIDComponent } from './login-thai-id.component';

describe('LoginThaiIDComponent', () => {
  let component: LoginThaiIDComponent;
  let fixture: ComponentFixture<LoginThaiIDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginThaiIDComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginThaiIDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
