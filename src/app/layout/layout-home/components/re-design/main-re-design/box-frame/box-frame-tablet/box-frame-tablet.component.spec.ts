import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxFrameTabletComponent } from './box-frame-tablet.component';

describe('BoxFrameTabletComponent', () => {
  let component: BoxFrameTabletComponent;
  let fixture: ComponentFixture<BoxFrameTabletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxFrameTabletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxFrameTabletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
