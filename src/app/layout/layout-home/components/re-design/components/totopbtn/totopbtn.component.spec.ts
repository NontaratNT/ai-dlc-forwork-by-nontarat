import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotopbtnComponent } from './totopbtn.component';

describe('TotopbtnComponent', () => {
  let component: TotopbtnComponent;
  let fixture: ComponentFixture<TotopbtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotopbtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotopbtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
