import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxFrameThridTabletComponent } from './box-frame-thrid-tablet.component';

describe('BoxFrameThridTabletComponent', () => {
  let component: BoxFrameThridTabletComponent;
  let fixture: ComponentFixture<BoxFrameThridTabletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxFrameThridTabletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxFrameThridTabletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
