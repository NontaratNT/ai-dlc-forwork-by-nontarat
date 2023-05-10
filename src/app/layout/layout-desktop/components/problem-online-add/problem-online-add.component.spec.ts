import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemOnlineAddComponent } from './problem-online-add.component';

describe('ProblemOnlineAddComponent', () => {
  let component: ProblemOnlineAddComponent;
  let fixture: ComponentFixture<ProblemOnlineAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProblemOnlineAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemOnlineAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
