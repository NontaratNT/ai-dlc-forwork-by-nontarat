import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxFrameComponent } from './box-frame.component';

describe('BoxFrameComponent', () => {
  let component: BoxFrameComponent;
  let fixture: ComponentFixture<BoxFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxFrameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
