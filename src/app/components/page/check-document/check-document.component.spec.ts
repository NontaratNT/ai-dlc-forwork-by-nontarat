import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckDocumentComponent } from './check-document.component';

describe('CheckDocumentComponent', () => {
  let component: CheckDocumentComponent;
  let fixture: ComponentFixture<CheckDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
