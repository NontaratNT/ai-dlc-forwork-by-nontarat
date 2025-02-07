import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxFrameThridMobileComponent } from './box-frame-thrid-mobile.component';

describe('BoxFrameThridMobileComponent', () => {
  let component: BoxFrameThridMobileComponent;
  let fixture: ComponentFixture<BoxFrameThridMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxFrameThridMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxFrameThridMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
