import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityBoxComponent } from './security-box.component';

describe('SecurityBoxComponent', () => {
  let component: SecurityBoxComponent;
  let fixture: ComponentFixture<SecurityBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecurityBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
