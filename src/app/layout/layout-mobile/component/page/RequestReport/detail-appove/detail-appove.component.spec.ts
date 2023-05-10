import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAppoveComponent } from './detail-appove.component';

describe('DetailAppoveComponent', () => {
  let component: DetailAppoveComponent;
  let fixture: ComponentFixture<DetailAppoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailAppoveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailAppoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
