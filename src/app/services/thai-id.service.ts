import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpStatusResultValue, req } from 'share-ui';
import { OnlineCaseInfo } from "../common/@type/online-case";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CookieStorage } from '../common/cookie';
import { EFORM_REQUEST, EformRequestFactory } from 'eform-share';
import { catchError, map } from 'rxjs/operators';
import { IAccessToken, IUserProfile } from './user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './user';
@Injectable({
  providedIn: 'root'
})
export class ThaiIDService {

  private apiUrl = 'https://imauth.bora.dopa.go.th/api/v1/oauth2/auth/';
  constructor(private jwtHelper: JwtHelperService, @Inject(EFORM_REQUEST) private _req: EformRequestFactory, private http: HttpClient) { }

  // Method to make the GET request
  getApiData(): Observable<any> {
    const params = {
      response_type: 'code',
      // client_id: 'WGYyT3lGeGo3c0Z6SEZSbTBRVktaN1VZbUZaVTJwWno',
      client_id: 'RVJKZXRZWWR5NGIyTE1aYWl0aWFCUDRWYUZPU3lqWTk',

      // redirect_uri: 'https://citizenuat.thaipoliceonline.com/login/thaiD',
      redirect_uri: 'https://thaipoliceonline.go.th/login/thaiD',
      scope: 'pid th_fullname dob openid',
      state: 'af0ifjsldkj',
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.get(this.apiUrl, { params, headers });
  }

  public thaiIdgettokenGDCC(param: any): Observable<any> {
    return this._req<any>('Officer/LoginThaiID/gettokenext')
                .host(environment.config.eFormHost)
                .body(param)
                .useSystemResult<HttpStatusResultValue<IAccessToken>>()
                .disableCriticalDialogError()
                .post().pipe(
                  map(res => {
                    if (res && res?.Value?.Token) {
                      const userInfo = this.createProfile(res.Value?.Token);
                      User.SetUser(userInfo);
                      return res;
                    }
                    return undefined;
                  }),
                  catchError((error) => {
                    console.error('Auth Error:', error);
                    return of(undefined);
                  })
                );
  }

  public thaiIdgettoken(param: any): Observable<any> {
    return this._req<any>().api('LoginThaiID/create-user-thaiId')
      .body(param)
      .disableCriticalDialogError().post();
  }

  private createProfile(accessToken: string): IUserProfile {
    const payload: IUserProfile = this.jwtHelper.decodeToken(accessToken);
    payload.UserId = +payload.UserId;
    payload.UserType = +payload.UserType;
    payload.UserIal = +payload.UserIal;
    payload.PersonalType = +payload.PersonalType;
    payload.LastAccessDateTime = new Date(payload.LastAccessDateTime);
    payload.PersonalId = +payload.PersonalId;
    payload.OrganizeId = +payload.OrganizeId;
    payload.OrganizeLevel = +payload.OrganizeLevel;
    payload.OrganizeRootId = +payload.OrganizeRootId;
    payload.Age = +payload.Age;
    return payload;
  }
}
