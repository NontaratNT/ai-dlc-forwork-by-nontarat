import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchNewCaseTypeMobileComponent } from './search-new-case-type-mobile.component';

describe('SearchNewCaseTypeMobileComponent', () => {
  let component: SearchNewCaseTypeMobileComponent;
  let fixture: ComponentFixture<SearchNewCaseTypeMobileComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchNewCaseTypeMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchNewCaseTypeMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
