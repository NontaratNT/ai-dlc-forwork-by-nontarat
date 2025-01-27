import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxFrameTextComponent } from './box-frame-text.component';

describe('BoxFrameTextComponent', () => {
  let component: BoxFrameTextComponent;
  let fixture: ComponentFixture<BoxFrameTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxFrameTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxFrameTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
