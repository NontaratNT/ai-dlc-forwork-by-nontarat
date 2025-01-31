import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { User } from 'src/app/services/user';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { UserSettingService } from 'src/app/services/user-setting.service';

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

    isfullScreen: any;
    width: any;
    isUrl = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private _loginServ: LoginService,
        private userSetting: UserSettingService,
        private deviceService: DeviceDetectorService,private datePipe: DatePipe) { }

    ngOnInit(): void {
        const user = User.Current ?? undefined;
        if (user){
            this.hasSession = true;
        }
        this.isUrl = window.location.href.includes(".com") && !window.location.href.includes("uat") ?  true: false;
        if(this.isUrl){
            window.location.href = "https://thaipoliceonline.go.th/";
        }

        this.showpopupweb = location.pathname.includes("admin") ? false : true;
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
    logout() {
        Swal.fire({
            title: 'คุณต้องการออกจากระบบ หรือไม่?',
            text: " ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2778c4',
            cancelButtonColor: '#ce312c',
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'ตกลง'
        }).then((result) => {
            if (result.isConfirmed) {
                this._isLoading = true;

                Swal.fire({
                    title: 'สำเร็จ!',
                    text: 'คุณได้ออกจากระบบเรียบร้อย',
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                }).then(() => {
                    this.userSetting.userSetting.location_name = undefined;
                    this.userSetting.Save();
                    this._loginServ.logout();
                    location.reload();
                });

            }
        });
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
        const dateOne = new Date(datenow);
        const dateTwo = new Date('2022-10-30 06:00:00');
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
    openPopupCybercheck(){
        Swal.fire({
            title: 'แจ้งเตือน!',
            html: "ท่านสามารถโหลดแอปพลิเคชัน CyberCheck<br>ได้ที่ Google Play และ App Store",
            icon: 'warning',
            confirmButtonText: 'ตกลง'
        });
    }

    onClickBanner(){
        this.router.navigate(['/login'], { queryParams: { icli: 'al' } });
    }
}
