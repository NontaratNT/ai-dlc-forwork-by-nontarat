import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterReDesignComponent } from './footer-re-design.component';

describe('FooterReDesignComponent', () => {
  let component: FooterReDesignComponent;
  let fixture: ComponentFixture<FooterReDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterReDesignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterReDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
