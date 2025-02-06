import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityServiceMobileComponent } from './security-service-mobile.component';

describe('SecurityServiceMobileComponent', () => {
  let component: SecurityServiceMobileComponent;
  let fixture: ComponentFixture<SecurityServiceMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecurityServiceMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityServiceMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
