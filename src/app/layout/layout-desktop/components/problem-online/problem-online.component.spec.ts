import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemOnlineComponent } from './problem-online.component';

describe('ProblemOnlineComponent', () => {
  let component: ProblemOnlineComponent;
  let fixture: ComponentFixture<ProblemOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProblemOnlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
