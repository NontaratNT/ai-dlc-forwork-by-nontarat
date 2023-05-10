import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachFileOfficerComponent } from './attach-file-officer.component';

describe('AttachFileOfficerComponent', () => {
  let component: AttachFileOfficerComponent;
  let fixture: ComponentFixture<AttachFileOfficerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachFileOfficerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachFileOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
