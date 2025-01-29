import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationnewsComponent } from './formationnews.component';

describe('FormationnewsComponent', () => {
  let component: FormationnewsComponent;
  let fixture: ComponentFixture<FormationnewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormationnewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormationnewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
