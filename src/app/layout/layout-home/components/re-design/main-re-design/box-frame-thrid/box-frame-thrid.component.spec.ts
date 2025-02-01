import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxFrameThridComponent } from './box-frame-thrid.component';

describe('BoxFrameThridComponent', () => {
  let component: BoxFrameThridComponent;
  let fixture: ComponentFixture<BoxFrameThridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxFrameThridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxFrameThridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
