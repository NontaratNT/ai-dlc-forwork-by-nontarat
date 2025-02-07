import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxFrameSecondTabletComponent } from './box-frame-second-tablet.component';

describe('BoxFrameSecondTabletComponent', () => {
  let component: BoxFrameSecondTabletComponent;
  let fixture: ComponentFixture<BoxFrameSecondTabletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxFrameSecondTabletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxFrameSecondTabletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
