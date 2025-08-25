import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcpbOnlineComplainDamageComponent } from './ocpb-online-complain-damage.component';

describe('OcpbOnlineComplainDamageComponent', () => {
  let component: OcpbOnlineComplainDamageComponent;
  let fixture: ComponentFixture<OcpbOnlineComplainDamageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcpbOnlineComplainDamageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcpbOnlineComplainDamageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
