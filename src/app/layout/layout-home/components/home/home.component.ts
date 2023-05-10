
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { BpmMdmFlowService } from 'src/app/services/bpm-mdm-flow.service';
import { AppComponent } from 'src/app/app.component';
import { User } from 'src/app/services/user';
import { DeviceDetectorService } from 'ngx-device-detector';
declare const NodesJs: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    _isLoading = false;
    deviceInfo = null;
    loginSuccess = false;
    constructor(
        private router: Router,
        private _loginServ: LoginService,
        private deviceService: DeviceDetectorService) { }

    ngOnInit(): void {
        this.loginSuccess = (User.Current)? true : false;
    }
    OnIssueOnlineM() {
        if (User.Current) {
            // this.router.navigate(['main/issue']);
            this.CheckDeviceMode();
        } else {
            this._loginServ.login("mobile/track-status?openExternalBrowser=1");
        }
    }
    OnIssueOnline() {
        if (User.Current) {
            // this.router.navigate(['main/issue']);
            this.CheckDeviceMode();
        } else {
            this._loginServ.login("/main/issue-online/1");
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
    CheckDeviceMode() {
        this.deviceInfo = this.deviceService.getDeviceInfo();
        const isMobile = this.deviceService.isMobile();
        // const isTablet = this.deviceService.isTablet();
        // const isDesktopDevice = this.deviceService.isDesktop();
        // console.log(this.deviceInfo);
        // console.log('isMobile',isMobile);
        // console.log('isTablet',isTablet);
        // console.log('isDesktopDevice',isDesktopDevice);
        if (isMobile) {
            this.router.navigate(["/mobile/track-status?openExternalBrowser=1"]);
        }else{
            this.router.navigate(["/main/issue-online/1"]);
        }
    }
    RedirectUrl(url){
        this.router.navigate([url]);
    }
}
