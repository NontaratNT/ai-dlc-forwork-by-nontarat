import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsCyberTabletComponent } from './news-cyber-tablet.component';

describe('NewsCyberTabletComponent', () => {
  let component: NewsCyberTabletComponent;
  let fixture: ComponentFixture<NewsCyberTabletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsCyberTabletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsCyberTabletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
