import { User } from 'src/app/services/user';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-new-report',
    templateUrl: './new-report.component.html',
    styleUrls: ['./new-report.component.scss']
})
export class NewReportComponent implements OnInit {
    data: any = [{ APP_ICON: 'fa-home', content_name: 'AAA', APP_NAME: 'VVVV' }];
    personalInfo: any;
    constructor(private router: Router) { }

    ngOnInit(): void {
        this.personalInfo = User.Current;
    }
    onSelectPer() {
        this.router.navigate(["/mobile/issue-online/1"]);
    }
    onSelectloPer() {
        this.router.navigate(["/mobile/issue-online/2"]);
    }
}
