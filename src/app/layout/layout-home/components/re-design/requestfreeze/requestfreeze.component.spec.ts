import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestfreezeComponent } from './requestfreeze.component';

describe('RequestfreezeComponent', () => {
  let component: RequestfreezeComponent;
  let fixture: ComponentFixture<RequestfreezeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestfreezeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestfreezeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
