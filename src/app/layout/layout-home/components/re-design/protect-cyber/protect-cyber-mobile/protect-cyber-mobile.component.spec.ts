import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectCyberMobileComponent } from './protect-cyber-mobile.component';

describe('ProtectCyberMobileComponent', () => {
  let component: ProtectCyberMobileComponent;
  let fixture: ComponentFixture<ProtectCyberMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProtectCyberMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtectCyberMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
