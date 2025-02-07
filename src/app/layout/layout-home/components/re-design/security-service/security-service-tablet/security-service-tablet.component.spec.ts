import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityServiceTabletComponent } from './security-service-tablet.component';

describe('SecurityServiceTabletComponent', () => {
  let component: SecurityServiceTabletComponent;
  let fixture: ComponentFixture<SecurityServiceTabletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecurityServiceTabletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityServiceTabletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
