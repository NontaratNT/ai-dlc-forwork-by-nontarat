import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailnewsComponent } from './detailnews.component';

describe('DetailnewsComponent', () => {
  let component: DetailnewsComponent;
  let fixture: ComponentFixture<DetailnewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailnewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailnewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
