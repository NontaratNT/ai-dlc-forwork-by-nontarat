import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxFrameSecondComponent } from './box-frame-second.component';

describe('BoxFrameSecondComponent', () => {
  let component: BoxFrameSecondComponent;
  let fixture: ComponentFixture<BoxFrameSecondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxFrameSecondComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxFrameSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
