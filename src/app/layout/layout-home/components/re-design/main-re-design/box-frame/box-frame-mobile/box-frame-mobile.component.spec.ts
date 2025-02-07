import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxFrameMobileComponent } from './box-frame-mobile.component';

describe('BoxFrameMobileComponent', () => {
  let component: BoxFrameMobileComponent;
  let fixture: ComponentFixture<BoxFrameMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxFrameMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxFrameMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
