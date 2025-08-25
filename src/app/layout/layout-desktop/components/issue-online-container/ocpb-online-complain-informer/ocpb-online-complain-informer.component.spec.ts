import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcpbOnlineComplainInformerComponent } from './ocpb-online-complain-informer.component';

describe('OcpbOnlineComplainInformerComponent', () => {
  let component: OcpbOnlineComplainInformerComponent;
  let fixture: ComponentFixture<OcpbOnlineComplainInformerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcpbOnlineComplainInformerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcpbOnlineComplainInformerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
