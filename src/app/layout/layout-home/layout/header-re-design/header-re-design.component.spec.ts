import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderReDesignComponent } from './header-re-design.component';

describe('HeaderReDesignComponent', () => {
  let component: HeaderReDesignComponent;
  let fixture: ComponentFixture<HeaderReDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderReDesignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderReDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
