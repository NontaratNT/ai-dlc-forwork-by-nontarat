import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { finalize } from 'rxjs/operators';
import { ThaiIDService } from 'src/app/services/thai-id.service';
import { CookieStorage } from 'src/app/common/cookie';
import { IAccessToken, UserService } from 'src/app/services/user.service';
import { UserSettingService } from 'src/app/services/user-setting.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-login-thai-id',
  templateUrl: './login-thai-id.component.html',
  styleUrls: ['./login-thai-id.component.scss']
})
export class LoginThaiIDComponent implements OnInit {

  htmlqrcode: any;
  _userInfo: any;
  _isLoading = true;
  isRemember = false;
  deviceInfo = null;

  constructor(private userServ: UserService,
     private userSetting: UserSettingService,
     private deviceService: DeviceDetectorService,

     private thaiidservice:ThaiIDService,private _jwtServ: JwtHelperService,private route: ActivatedRoute, private router: Router) { }
  url = 'https://imauth.bora.dopa.go.th/api/v1/oauth2/auth/?response_type=code&client_id=WGYyT3lGeGo3c0Z6SEZSbTBRVktaN1VZbUZaVTJwWno&redirect_uri=https://citizenuat.thaipoliceonline.com/login/thaiD&scope=pid%20th_fullname%20dob%20openid&state=af0ifjsldkj';
  async ngOnInit(): Promise<void> {


    this.route.queryParams.subscribe(params => {
      const paramValue = params['code'];
      if (paramValue) {
        // Perform your logic based on the parameter value
        const param = { 
          code: paramValue,
          url_redirect:'https://citizenuat.thaipoliceonline.com/login/thaiD'
        };
         this.thaiidservice.thaiIdgettoken(param).subscribe((res) => { 
          this._userInfo = this._jwtServ.decodeToken(res.id_token);
          // localStorage.setItem('access_token', res.access_token);
          // localStorage.setItem('_userInfo', this._userInfo);

          this.Login(this._userInfo.pid, this._userInfo.pid);
        }
        );
              }else{
                window.location.href = this.url;
              }
    });
      // const token = "eyJhbGciOiJFUzI1NiIsImtpZCI6IkZZQ1ZGY2wyK0dYM2tTTFA0UFlXWGcvcW42OD0iLCJ0eXAiOiJKV1QifQ.eyJhdF9oYXNoIjoiWEUyTXV6YUItWmlIX3JXai0tRHM1ZyIsImF1ZCI6IjAzYzgxODIwLTFiOTYtNDdhNS1iMDVmLTljNzdhNTU3NTFmNyIsImV4cCI6MTcwNDQzODc2MywiaWF0IjoxNzA0NDM3ODYzLCJpc3MiOiJodHRwczovL2ltYXV0aC5ib3JhLmRvcGEuZ28udGgiLCJzdWIiOiIxNDExMTAwMzAxNDMxIiwicGlkIjoiMTQxMTEwMDMwMTQzMSIsInRoX2Z1bGxuYW1lIjoi4LiZ4Liy4LiiIOC4reC4uOC5gOC4l-C4mSDguKHguLHguYjguIfguKHguLnguKUiLCJkb2IiOiIyNTM5MDkxMiJ9.pUrzzAuiXhuXQPPRzOtNPzZFZDo4sSlZGgZPu7gBP6iYqcrkGTRRm82MWeVmtAPmspaE39zeo2_PbYie3-gOfA";
      // this._userInfo = this._jwtServ.decodeToken(token);

      // console.log(this._userInfo);
  
   

  }

  Login(usename, password) {
    if (usename && password) {
        this._isLoading = true;
        this.userSetting.userSetting.location_name = undefined;
        // this.userSetting.Save();
        this.userServ
            .authenticateThaiID(usename, password, 1.1)
            .pipe(finalize(() => this._isLoading = false))
            .subscribe(u => {
                if (u) {
                    if (this.isRemember) {
                        CookieStorage.assignSetting({ RememberLogin: true });
                    }

                    CookieStorage.accessToken = ({
                        Token: u.Token,
                        RefreshToken: u.RefreshToken
                    } as IAccessToken);

                    // this.router.navigate([this.loginServ._successLoginRedirectTo]);
                    this.CheckDeviceMode();
                }
            });
    }
    else {
        
    }
}
CheckDeviceMode() {
  this.deviceInfo = this.deviceService.getDeviceInfo();
  const isMobile = this.deviceService.isMobile();
  const isTablet = this.deviceService.isTablet();
  const isDesktopDevice = this.deviceService.isDesktop();
  if (isMobile) {

      // location.reload();
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(["/mobile/track-status?openExternalBrowser=1"]);
      });
  } else {
      this.router.navigate(["/main/task-list"]);
  }
}

}
