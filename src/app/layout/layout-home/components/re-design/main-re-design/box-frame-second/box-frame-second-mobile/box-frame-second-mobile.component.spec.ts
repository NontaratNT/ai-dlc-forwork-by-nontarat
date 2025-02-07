import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxFrameSecondMobileComponent } from './box-frame-second-mobile.component';

describe('BoxFrameSecondMobileComponent', () => {
  let component: BoxFrameSecondMobileComponent;
  let fixture: ComponentFixture<BoxFrameSecondMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxFrameSecondMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxFrameSecondMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
