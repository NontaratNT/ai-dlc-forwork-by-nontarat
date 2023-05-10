import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeVisibleComponent } from './home-visible.component';

describe('HomeVisibleComponent', () => {
  let component: HomeVisibleComponent;
  let fixture: ComponentFixture<HomeVisibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeVisibleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeVisibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
