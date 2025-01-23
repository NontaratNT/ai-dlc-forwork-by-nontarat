import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainReDesignComponent } from './main-re-design.component';

describe('MainReDesignComponent', () => {
  let component: MainReDesignComponent;
  let fixture: ComponentFixture<MainReDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainReDesignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainReDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
