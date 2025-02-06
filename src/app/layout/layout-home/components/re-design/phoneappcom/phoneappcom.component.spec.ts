import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneappcomComponent } from './phoneappcom.component';

describe('PhoneappcomComponent', () => {
  let component: PhoneappcomComponent;
  let fixture: ComponentFixture<PhoneappcomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhoneappcomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneappcomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
