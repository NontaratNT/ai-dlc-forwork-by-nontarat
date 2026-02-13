import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchNewCaseTypeComponent } from './search-new-case-type.component';

describe('SearchNewCaseTypeComponent', () => {
  let component: SearchNewCaseTypeComponent;
  let fixture: ComponentFixture<SearchNewCaseTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchNewCaseTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchNewCaseTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
