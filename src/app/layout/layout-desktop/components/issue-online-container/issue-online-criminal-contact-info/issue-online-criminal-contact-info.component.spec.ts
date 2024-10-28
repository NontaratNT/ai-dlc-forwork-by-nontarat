import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueOnlineCriminalContatInfoComponent } from './issue-online-criminal-contact-info.component';

describe('IssueOnlineCriminalContatInfoComponent', () => {
    let component: IssueOnlineCriminalContatInfoComponent;
    let fixture: ComponentFixture<IssueOnlineCriminalContatInfoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IssueOnlineCriminalContatInfoComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IssueOnlineCriminalContatInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
