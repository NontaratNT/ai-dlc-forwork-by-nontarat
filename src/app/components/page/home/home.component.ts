import { User } from './../../../services/user';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { BpmMdmFlowService } from 'src/app/services/bpm-mdm-flow.service';
import { AppComponent } from 'src/app/app.component';
import { DatePipe } from '@angular/common';
declare const NodesJs: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    _isLoading = false;

    constructor(private router: Router, private _loginServ: LoginService, private sss: AppComponent) { }

    ngOnInit(): void {
    }

    OnIssueOnline() {
        if (User.Current) {
            this.router.navigate(['main/cyber/issue-online']);
        } else {
            this._loginServ.login("main/cyber/issue-online");
        }
    }
    OnReportOnline() {
        if (User.Current) {
            this.router.navigate(['main/register-journal']);
        } else {
            this._loginServ.login("main/register-journal");
        }
    }
    OnElectronicDoc() {
        if (User.Current) {
            this.router.navigate(['main/doc']);
        } else {
            this._loginServ.login("main/doc");
        }
    }
    
}
