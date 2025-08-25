import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcpbOnlineComplainDetailComponent } from './ocpb-online-complain-detail.component';

describe('OcpbOnlineComplainDetailComponent', () => {
  let component: OcpbOnlineComplainDetailComponent;
  let fixture: ComponentFixture<OcpbOnlineComplainDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcpbOnlineComplainDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcpbOnlineComplainDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
