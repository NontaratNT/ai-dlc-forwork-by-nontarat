import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ForgetPasswordComponent } from "../forget-password/forget-password.component";
import { DxMultiViewComponent } from "devextreme-angular";
import { IAccessToken, UserService } from "src/app/services/user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize, switchMap } from "rxjs/operators";
import { Dialog } from "share-ui";
import { SocialAuthService } from "angularx-social-login";
import {
    FacebookLoginProvider,
    GoogleLoginProvider,
} from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { LoginService } from "src/app/services/login.service";
import { CookieStorage } from "src/app/common/cookie";
import { AppService } from "src/app/app.service";
import Swal from "sweetalert2";
import { AppComponent } from "src/app/app.component";
import { DeviceDetectorService } from "ngx-device-detector";
import { UserSettingService } from "src/app/services/user-setting.service";
import { FreezeAccountService } from "src/app/services/bpm-freeze-account.service";
import { User } from '../../../../services/user';

declare let $: any;
@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
    usersocial!: SocialUser;
    loggedIn!: boolean;
    _isLoading = false;
    isRemember = false;
    type_register = "";
    deviceInfo = null;
    popupVisible = true;
    submission = {} as any;
    ways = [
        { id: 1, text: "ดำเนินการแล้ว" },
        { id: 2, text: "ยังไม่ได้ดำเนินการ" },
    ];
    scopeWays1: boolean;
    scopeWays2: boolean;
    _isShow = false;
    _isShow2 = false;
    isUrl = false;
    popupConsentVisible = false;
    constructor(
        private userServ: UserService,
        private _dialog: Dialog,
        private router: Router,
        private routerAc: ActivatedRoute,
        private userSetting: UserSettingService,
        private authService: SocialAuthService,
        private loginServ: LoginService,
        private appServ: AppService,
        private deviceService: DeviceDetectorService,
        private freezeAccountService: FreezeAccountService
    ) {
        appServ.hideHeader = true;
        appServ.hideFooter = true;
        this.submission = {} as any;
    }

    ngOnInit(): void {
        this.isUrl =
            window.location.href.includes(".com") &&
            !window.location.href.includes("uat")
                ? true
                : false;
        if (this.isUrl) {
            window.location.href = "https://thaipoliceonline.go.th/login";
        }
        this.getIPAddress();
        // const nodesjs = new NodesJs({
        //     id: 'nodes',
        //     width: window.innerWidth,
        //     height: window.innerHeight,
        //     particleSize: 2,
        //     lineSize: 1,
        //     particleColor: [255, 255, 255, 0.3],
        //     lineColor: [255, 255, 255],
        //     backgroundFrom: [10, 25, 100],
        //     backgroundTo: [10, 25, 100],
        //     backgroundDuration: 3000,
        //     nobg: false,
        //     // eslint-disable-next-line id-blacklist
        //     number: window.hasOwnProperty('orientation') ? 30 : 30,
        //     speed: 20,
        //     pointerCircleRadius: 100
        // });
    }
    CheckDeviceMode() {
        this.deviceInfo = this.deviceService.getDeviceInfo();
        const isMobile = this.deviceService.isMobile();
        const isTablet = this.deviceService.isTablet();
        const isDesktopDevice = this.deviceService.isDesktop();
        if (isMobile) {
            // location.reload();
            this.router
                .navigateByUrl("/", { skipLocationChange: true })
                .then(() => {
                    this.router.navigate([
                        "/mobile/track-status?openExternalBrowser=1",
                    ]);
                });
        } else {
            this.router.navigate(["/main/task-list"]);
        }
    }
    ngOnDestroy(): void {
        this.appServ.hideHeader = false;
        this.appServ.hideFooter = false;
    }
    SelectRegister() {
        // this.multiView.selectedIndex = 1;
        this.router.navigate(["register"]);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        // this.onSkip(event);
        // this.popupConsentVisible = true;
    }
    SelectForget() {
        // this.multiView.selectedIndex = 1;
        this.router.navigate(["forget-password"]);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    Login(usename, password) {
        if (usename && password) {
            this._isLoading = true;
            this.userSetting.userSetting.location_name = undefined;
            // this.userSetting.Save();
            this.userServ
                .authenticate(usename, password, 1.1)
                .pipe(finalize(() => (this._isLoading = false)))
                .subscribe((u) => {
                    if (u) {
                        this.routerAc.queryParams.subscribe((params) => {
                            if (params.icli) {
                                if (this.isRemember) {
                                    CookieStorage.assignSetting({
                                        RememberLogin: true,
                                    });
                                }
    
                                CookieStorage.accessToken = {
                                    Token: u.Token,
                                    RefreshToken: u.RefreshToken,
                                } as IAccessToken;
                                if(params.icli === "al"){
                                    this.userServ.getTokenCypherVac(User.Current.UserId).toPromise().then((res) => {
                                        window.location.href = `https://cybervaccinated.thaipoliceonline.go.th?redirecthas=${res}`;
                                    });
                                }else if(params.icli === "landing"){
                                    if(User.Current.Age >= 60){
                                        this._isLoading = false;
                                        // get localStorage name 'questionnaireForm'
                                        const questionnaireForm = JSON.parse(localStorage.getItem('questionnaireForm'));
                                        this.userServ.SaveQuestion(questionnaireForm).subscribe(_ => {});
                                        if(User.Current.SeniorStatus === "Y"){
                                            this.router.navigate(["/senior-cyber-police"]);
                                        }else{
                                            Swal.fire({
                                                title: "แจ้งเตือน!",
                                                text: "ท่านต้องการเข้าร่วม Senior Cyber Club ใช่หรือไม่",
                                                icon: "warning",
                                                confirmButtonText: "ตกลง",
                                                cancelButtonText: "ยกเลิก",
                                                showCancelButton: true,
                                            }).then((_) => {
                                                if (_.isConfirmed) {
                                                    this.userServ.UpdateSeniorFlag(User.Current.UserId).pipe(
                                                        switchMap(() => this.userServ.UpdateSeniorFlagAzure(User.Current.UserId))
                                                    ).subscribe({
                                                        next: () => this.router.navigate(["/senior-cyber-police"]),
                                                        error: err => this.router.navigate(["/senior-cyber-police"])
                                                    });
                                                } else {
                                                    this.router.navigate(["/"]);
                                                }
                                                
                                            });
                                        }
                                    }else{
                                        Swal.fire({
                                            title: "ขออภัย!",
                                            text: "อายุของท่านยังไม่ถึงเกณฑ์ที่กำหนด",
                                            icon: "warning",
                                            confirmButtonText: "ตกลง",
                                        }).then(() => {
                                            this._isLoading = false;
                                            this.router.navigate(["/"]);
                                        });
                                    }
                                }
                                
                                return;
                            }
                            if (this.isRemember) {
                                CookieStorage.assignSetting({
                                    RememberLogin: true,
                                });
                            }

                            CookieStorage.accessToken = {
                                Token: u.Token,
                                RefreshToken: u.RefreshToken,
                            } as IAccessToken;

                            // this.router.navigate([this.loginServ._successLoginRedirectTo]);
                            this.CheckDeviceMode();
                        });
                    }
                });
        } else {
            // this._dialog.info("ไม่ถูกต้อง", "กรุณากรอก 'ชื่อผู้ใช้' และ 'รหัสผ่าน'").then(() => this._isLoading = false);
            Swal.fire({
                title: "ไม่ถูกต้อง!",
                text: "กรุณากรอก ชื่อผู้ใช้ และ รหัสผ่าน",
                icon: "warning",
                confirmButtonText: "ตกลง",
            }).then(() => {
                this._isLoading = false;
            });
        }
    }

    LogInWithGoogle() {
        this.type_register = "Google";
        this._isLoading = true;
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
        this.authService.authState.subscribe((user) => {
            this.usersocial = user;
            this.loggedIn = user != null;
            if (this.usersocial) {
                let name = this.usersocial.email.substring(
                    0,
                    this.usersocial.email.lastIndexOf("@")
                );
                if (name.indexOf(".") !== -1) {
                    name = this.usersocial.email.substring(
                        0,
                        name.indexOf(".")
                    );
                }
                this.userServ
                    .authenticate(name, "1234", 1.1)
                    .pipe(finalize(() => (this._isLoading = false)))
                    .subscribe((r) => {
                        if (r) {
                            window.location.reload();
                        } else {
                            // this._dialog.info("แจ้งเตือน", "กรุณาลงทะเบียนด้วย Google ก่อน !!!").then(() => window.location.reload());
                            Swal.fire({
                                title: "แจ้งเตือน!",
                                text: "กรุณาลงทะเบียนด้วย Google ก่อน !!!",
                                icon: "warning",
                                confirmButtonText: "ตกลง",
                            }).then(() => {
                                window.location.reload();
                            });
                        }
                    });
                this._isLoading = false;
            } else {
                // this._dialog.info("แจ้งเตือน", "อีเมล หรือ รหัสผ่านไม่ถูกต้อง กรุณาใส่ใหม่อีกครั้งหรือกดลืมรหัสผ่าน  !!!!")
                //     .then(() => this._isLoading = false);
                Swal.fire({
                    title: "แจ้งเตือน!",
                    text: "อีเมล หรือ รหัสผ่านไม่ถูกต้อง กรุณาใส่ใหม่อีกครั้งหรือกดลืมรหัสผ่าน !!!",
                    icon: "warning",
                    confirmButtonText: "ตกลง",
                }).then(() => {
                    this._isLoading = false;
                });
            }
        });
    }
    relode() {
        window.location.reload();
    }
    LogInWithFB() {
        this.type_register = "Facebook";
        this._isLoading = true;
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
        this.authService.authState.subscribe((user) => {
            this.usersocial = user;
            this.loggedIn = user != null;
            if (this.usersocial) {
                let name = this.usersocial.email.substring(
                    0,
                    this.usersocial.email.lastIndexOf("@")
                );
                if (name.indexOf(".") !== -1) {
                    name = this.usersocial.email.substring(
                        0,
                        name.indexOf(".")
                    );
                }
                this.userServ
                    .authenticate(name, "1234", 1.1)
                    .pipe(finalize(() => (this._isLoading = false)))
                    .subscribe((r) => {
                        if (r) {
                            window.location.reload();
                        } else {
                            // this._dialog.info("แจ้งเตือน", "กรุณาลงทะเบียนด้วย Facebook ก่อน !!!").then(() => window.location.reload());
                            Swal.fire({
                                title: "แจ้งเตือน!",
                                text: "กรุณาลงทะเบียนด้วย Facebook ก่อน !!!",
                                icon: "warning",
                                confirmButtonText: "ตกลง",
                            }).then(() => {
                                window.location.reload();
                            });
                        }
                    });
                this._isLoading = false;
            } else {
                // this._dialog.info("แจ้งเตือน", "อีเมล หรือ รหัสผ่านไม่ถูกต้อง กรุณาใส่ใหม่อีกครั้งหรือกดลืมรหัสผ่าน  !!!!")
                //     .then(() => this._isLoading = false);
                Swal.fire({
                    title: "แจ้งเตือน!",
                    text: "อีเมล หรือ รหัสผ่านไม่ถูกต้อง กรุณาใส่ใหม่อีกครั้งหรือกดลืมรหัสผ่าน !!!",
                    icon: "warning",
                    confirmButtonText: "ตกลง",
                }).then(() => {
                    this._isLoading = false;
                });
            }
        });
    }

    onRegister(event: any) {
        console.clear();
        console.log(event);
        console.log(this.submission);
        this._isLoading = true;
        if (this._isShow2) {
            Swal.fire({
                title: "แจ้งเตือน!",
                text: "ระบบจะนำท่านไปสู่ขั้นตอนลงทะเบียนยืนยันตัวตน!!!",
                icon: "warning",
                confirmButtonText: "ตกลง",
            }).then(() => {
                this._isLoading = false;
                this.router.navigate(["register"]);
                document.body.scrollTop =
                    document.documentElement.scrollTop = 0;
            });
        } else {
            try {
                this.freezeAccountService
                    .post(this.submission)
                    .subscribe((_) => {
                        Swal.fire({
                            title: "แจ้งเตือน!",
                            text: "ดำเนินการบันทึกข้อมูลเรียบร้อย ระบบจะนำท่านไปสู่ขั้นตอนลงทะเบียนยืนยันตัวตน!!!",
                            icon: "success",
                            confirmButtonText: "ตกลง",
                        }).then(() => {
                            this._isLoading = false;
                            this.router.navigate(["register"]);
                            document.body.scrollTop =
                                document.documentElement.scrollTop = 0;
                        });
                    });
            } catch (error) {
            } finally {
                setTimeout(() => {
                    this._isLoading = false;
                }, 2000);
            }
        }
    }

    onWaysValueChanged(event: any) {
        console.log(event);
        const val = event.value;
        switch (val) {
        case 1:
            this._isShow = true;
            this._isShow2 = false;
            break;
        case 2:
            this._isShow = false;
            this._isShow2 = true;
            break;
        }
    }

    onSkip(event: any) {
        this._isLoading = true;

        setTimeout(() => {
            this._isLoading = false;
            this.router.navigate(["register"]);
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }, 2000);
    }

    loginThaiID() {
        this.routerAc.queryParams.subscribe((params) => {
            if(params.icli){
                localStorage.setItem('icli', params.icli);
                this.router.navigate(["login/thaiD"], { queryParams: { icli: params.icli } });
            }else{
                this.router.navigate(["login/thaiD"]);
            }
        });
        
    }
    getIPAddress() {
        try {
            $.getJSON("https://api.ipify.org?format=json", function(data) {
                sessionStorage.setItem("ip_address", data.ip);
            });
        } catch {}
    }
}
