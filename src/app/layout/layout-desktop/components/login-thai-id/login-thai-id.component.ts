import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { finalize, switchMap } from "rxjs/operators";
import { ThaiIDService } from "src/app/services/thai-id.service";
import { CookieStorage } from "src/app/common/cookie";
import { IAccessToken, UserService } from "src/app/services/user.service";
import { UserSettingService } from "src/app/services/user-setting.service";
import { DeviceDetectorService } from "ngx-device-detector";
import Swal from "sweetalert2";
import { User } from "src/app/services/user";
import { getSessionCookie } from "src/app/common/helper";

@Component({
    selector: "app-login-thai-id",
    templateUrl: "./login-thai-id.component.html",
    styleUrls: ["./login-thai-id.component.scss"],
})
export class LoginThaiIDComponent implements OnInit {
    htmlqrcode: any;
    _userInfo: any;
    _isLoading = true;
    isRemember = false;
    deviceInfo = null;

    constructor(
        private userServ: UserService,
        private userSetting: UserSettingService,
        private deviceService: DeviceDetectorService,

        private thaiidservice: ThaiIDService,
        private _jwtServ: JwtHelperService,
        private route: ActivatedRoute,
        private router: Router
    ) { }
    // url = 'https://imauth.bora.dopa.go.th/api/v1/oauth2/auth/?response_type=code&client_id=WGYyT3lGeGo3c0Z6SEZSbTBRVktaN1VZbUZaVTJwWno&redirect_uri=https://citizenuat.thaipoliceonline.com/login/thaiD&scope=pid%20th_fullname%20dob%20openid&state=af0ifjsldkj';
    url =
        "https://imauth.bora.dopa.go.th/api/v1/oauth2/auth/?response_type=code&client_id=RVJKZXRZWWR5NGIyTE1aYWl0aWFCUDRWYUZPU3lqWTk&redirect_uri=https://thaipoliceonline.go.th/login/thaiD&scope=pid%20th_fullname%20dob%20openid&state=af0ifjsldkj";

    async ngOnInit(): Promise<void> {
        this.route.queryParams.subscribe((params) => {
            if (params.icli) {
                localStorage.setItem('icli', params.icli);
            }
            const paramValue = params.code;
            if (paramValue) {
                // Perform your logic based on the parameter value
                const param = {
                    code: paramValue,
                    url_redirect: "https://thaipoliceonline.go.th/login/thaiD",
                };
                this.thaiidservice
                    .thaiIdgettokenGDCC(param)
                    .subscribe((res) => {
                        if (!res.IsSuccess) {
                            Swal.fire({
                                title: "ผิดพลาด!",
                                text: `${res.Message}`,
                                // text: 'ไม่พบข้อมูลของท่านในระบบกรมการปกครอง',
                                icon: "warning",
                                confirmButtonText: "ตกลง",
                            }).then((_) => {
                                if (_.isConfirmed) {
                                    this._isLoading = false;
                                    window.location.href = this.url;
                                }
                            });
                            return;
                        } else {
                            this._userInfo = this._jwtServ.decodeToken(
                                res.Value.id_token
                            );
                            this.Login(res.Value.id_token);
                        }
                    });
            } else {
                window.location.href = this.url;
            }
        });
        // const token = "eyJhbGciOiJFUzI1NiIsImtpZCI6IkZZQ1ZGY2wyK0dYM2tTTFA0UFlXWGcvcW42OD0iLCJ0eXAiOiJKV1QifQ.eyJhdF9oYXNoIjoiWEUyTXV6YUItWmlIX3JXai0tRHM1ZyIsImF1ZCI6IjAzYzgxODIwLTFiOTYtNDdhNS1iMDVmLTljNzdhNTU3NTFmNyIsImV4cCI6MTcwNDQzODc2MywiaWF0IjoxNzA0NDM3ODYzLCJpc3MiOiJodHRwczovL2ltYXV0aC5ib3JhLmRvcGEuZ28udGgiLCJzdWIiOiIxNDExMTAwMzAxNDMxIiwicGlkIjoiMTQxMTEwMDMwMTQzMSIsInRoX2Z1bGxuYW1lIjoi4LiZ4Liy4LiiIOC4reC4uOC5gOC4l-C4mSDguKHguLHguYjguIfguKHguLnguKUiLCJkb2IiOiIyNTM5MDkxMiJ9.pUrzzAuiXhuXQPPRzOtNPzZFZDo4sSlZGgZPu7gBP6iYqcrkGTRRm82MWeVmtAPmspaE39zeo2_PbYie3-gOfA";
        // this._userInfo = this._jwtServ.decodeToken(token);

        // console.log(this._userInfo);
    }

    Login(token) {
        if (token) {
            this._isLoading = true;
            this.userSetting.userSetting.location_name = undefined;
            // this.userSetting.Save();
            this.userServ
                .authenticateThaiID(token)
                .pipe(finalize(() => (this._isLoading = false)))
                .subscribe((u) => {
                    console.log("u work:", u);
                    if (u) {
                        if (this.isRemember) {
                            CookieStorage.assignSetting({
                                RememberLogin: true,
                            });
                        }

                        CookieStorage.accessToken = {
                            Token: u.Token,
                            RefreshToken: u.RefreshToken,
                        } as IAccessToken;
                        if(getSessionCookie()){
                            console.log("to page-suspention");
                            this.router.navigate(["page-suspention"]);
                            return;
                        }
                        if (localStorage.getItem('icli') === 'al') {
                            localStorage.removeItem('icli');
                            this.userServ.getTokenCypherVac(User.Current.UserId).toPromise().then((res) => {
                                window.location.href = `https://cybervaccinated.thaipoliceonline.go.th?redirecthas=${res}`;
                            });
                            return;
                        } else if (localStorage.getItem('icli') === 'landing') {
                            localStorage.removeItem('icli');
                            this.router.navigate(["/"]);
                        } else if (localStorage.getItem('icli') === 'cyber-eye') {
                            localStorage.removeItem('icli');
                            if(User?.Current?.CyberEyeStatus != "Y"){
                                this.userServ.UpdateSeniorFlag(User.Current.UserId,"Cyber").subscribe(() => {
                                this.userServ.UpdateSeniorFlagAzure(User.Current.UserId,"Cyber").subscribe(() => {
                                    User.Current.CyberEyeStatus = "Y";
                                    this.router.navigate(['/']);
                                    return;
                                });
                            });
                            }
                            this.router.navigate(["/"]);
                        }else if (localStorage.getItem('icli') === 'cyber-cat') {
                            localStorage.removeItem('icli');
                            if(User?.Current?.Age > 18 || User?.Current?.Age == null){
                                Swal.fire({
                                    title: 'อายุของท่านไม่ตรงเกณฑ์ที่กำหนด',
                                    text: 'ท่านต้องมีอายุไม่เกิน 18 ปี เพื่อเข้าใช้งาน Cyber Cat',
                                    icon: 'error',
                                    confirmButtonText: 'ตกลง'
                                });
                                this.router.navigate(['/']);
                                 return;
                            }else if(User?.Current?.CyberCatStatus != "Y"){
                                this.userServ.UpdateSeniorFlag(User.Current.UserId,"CyberCat").subscribe(() => {
                                this.userServ.UpdateSeniorFlagAzure(User.Current.UserId,"CyberCat").subscribe(() => {
                                    User.Current.CyberCatStatus = "Y";
                                    this.router.navigate(['/']);
                                    return;
                                });
                            });
                            }
                            this.router.navigate(["/"]);
                        }else {
                            this.CheckDeviceMode();
                        }
                    } else {
                        Swal.fire({
                            title: "ผิดพลาด!",
                            text: "ไม่พบข้อมูลของท่านในระบบ",
                            icon: "warning",
                            confirmButtonText: "ตกลง",
                        }).then((_) => {
                            if (_.isConfirmed) {
                                this._isLoading = false;
                                window.location.href =
                                    "https://thaipoliceonline.go.th/login/thaiD";
                            }
                        });
                    }
                });
        } else {
        }
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
}
