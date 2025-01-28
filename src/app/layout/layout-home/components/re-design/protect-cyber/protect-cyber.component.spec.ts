import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectCyberComponent } from './protect-cyber.component';

describe('ProtectCyberComponent', () => {
  let component: ProtectCyberComponent;
  let fixture: ComponentFixture<ProtectCyberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProtectCyberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtectCyberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
