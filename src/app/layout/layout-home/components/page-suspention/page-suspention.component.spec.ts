import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSuspentionComponent } from './page-suspention.component';

describe('PageSuspentionComponent', () => {
  let component: PageSuspentionComponent;
  let fixture: ComponentFixture<PageSuspentionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageSuspentionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSuspentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
