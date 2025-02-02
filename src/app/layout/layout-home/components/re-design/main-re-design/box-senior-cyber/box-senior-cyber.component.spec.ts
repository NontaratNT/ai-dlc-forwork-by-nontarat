import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxSeniorCyberComponent } from './box-senior-cyber.component';

describe('BoxSeniorCyberComponent', () => {
  let component: BoxSeniorCyberComponent;
  let fixture: ComponentFixture<BoxSeniorCyberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxSeniorCyberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxSeniorCyberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
