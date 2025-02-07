import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectCyberTabletComponent } from './protect-cyber-tablet.component';

describe('ProtectCyberTabletComponent', () => {
  let component: ProtectCyberTabletComponent;
  let fixture: ComponentFixture<ProtectCyberTabletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProtectCyberTabletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtectCyberTabletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
