import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseTypeNewContainerComponent } from './case-type-new-container.component';

describe('CaseTypeNewContainerComponent', () => {
  let component: CaseTypeNewContainerComponent;
  let fixture: ComponentFixture<CaseTypeNewContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseTypeNewContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseTypeNewContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
