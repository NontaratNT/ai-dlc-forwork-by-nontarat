import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QapageComponent } from './qapage.component';

describe('QapageComponent', () => {
  let component: QapageComponent;
  let fixture: ComponentFixture<QapageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QapageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QapageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
