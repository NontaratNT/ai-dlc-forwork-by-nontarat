import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsCyberMobileComponent } from './news-cyber-mobile.component';

describe('NewsCyberMobileComponent', () => {
  let component: NewsCyberMobileComponent;
  let fixture: ComponentFixture<NewsCyberMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsCyberMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsCyberMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
