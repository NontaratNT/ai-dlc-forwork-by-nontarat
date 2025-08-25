import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcpbOnlineComplainValidateComponent } from './ocpb-online-complain-validate.component';

describe('OcpbOnlineComplainValidateComponent', () => {
  let component: OcpbOnlineComplainValidateComponent;
  let fixture: ComponentFixture<OcpbOnlineComplainValidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcpbOnlineComplainValidateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcpbOnlineComplainValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
