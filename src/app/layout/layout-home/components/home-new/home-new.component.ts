import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { User } from 'src/app/services/user';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-home-new',
    templateUrl: './home-new.component.html',
    styleUrls: ['./home-new.component.scss'],
    providers: [DatePipe]
})
export class HomeNewComponent implements OnInit {
    _isLoading = false;
    deviceInfo = null;
    hasSession = false;
    showpopupweb = false;
    popupVisible = false;
    popupStart = false;

    isfullScreen : any
    width : any
    isUrl = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private _loginServ: LoginService,
        private deviceService: DeviceDetectorService,private datePipe: DatePipe) { }

    ngOnInit(): void {
        const user = User.Current ?? undefined;
        if (user){
            this.hasSession = true;
        }
        this.isUrl = window.location.href.includes(".com") && !window.location.href.includes("uat") ?  true: false;
        if(this.isUrl){
            // window.location.href = "https://thaipoliceonline.go.th/";
        }
        // this.checkdatetimepopup();

        this.width = window.innerWidth;
        if(this.width < 1100){
            this.isfullScreen = true;
        }
        (window as any).addEventListener('resize', () => {
            this.width = window.innerWidth;
            if(this.width < 1100){
                this.isfullScreen = true;
            }else{
                this.isfullScreen = false;
            }
        });
    }
    OnIssueOnline() {
        // this.popupVisible = true;
        this.CheckDeviceMode();
    }
    CheckDeviceMode() {
        this.deviceInfo = this.deviceService.getDeviceInfo();
        const isMobile = this.deviceService.isMobile();
        if (isMobile) {
            this.router.navigate(["/mobile/track-status?openExternalBrowser=1"]);
        }else{
            this.router.navigate(["/main/issue-online/1"]);
        }
    }
    TelLink(href) {
        const downloadLink = document.createElement("a");
        downloadLink.href = href;
        downloadLink.click();
    }
    RedirectUrl(url){
        this.router.navigate([url]);
    }
    OpenManual(){
        window.open("https://officer.thaipoliceonline.com/resource/manual.pdf");
    }
    RedirectExternal(href) {
        window.location.href = href;
    }

    closepopup(){
        this.showpopupweb = false;
    }
    checkdatetimepopup(){

        const datenow  = this.datePipe.transform(Date.now(), 'yyyy-MM-dd hh:mm:ss');
        const dateOne = new Date(datenow)
        const dateTwo = new Date('2022-10-30 06:00:00')
        if(dateOne.toISOString() > dateTwo.toISOString()){
            this.showpopupweb = false;
         }else{
            this.showpopupweb = false;
         }
    }
    closePopupWarning(){
        this.popupVisible = false;
        this.CheckDeviceMode();
    }
    closePopup(){
        this.popupStart = false;
        window.location.href = "https://thaipoliceonline.go.th/";
    }
}

