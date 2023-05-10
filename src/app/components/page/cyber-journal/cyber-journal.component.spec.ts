import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberJournalComponent } from './cyber-journal.component';

describe('CyberJournalComponent', () => {
  let component: CyberJournalComponent;
  let fixture: ComponentFixture<CyberJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyberJournalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyberJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
