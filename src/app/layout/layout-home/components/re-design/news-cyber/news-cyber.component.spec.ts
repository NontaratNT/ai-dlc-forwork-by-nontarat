import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsCyberComponent } from './news-cyber.component';

describe('NewsCyberComponent', () => {
  let component: NewsCyberComponent;
  let fixture: ComponentFixture<NewsCyberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsCyberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsCyberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
