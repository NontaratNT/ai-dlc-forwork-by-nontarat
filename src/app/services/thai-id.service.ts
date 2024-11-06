import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpStatusResultValue, req } from 'share-ui';
import { OnlineCaseInfo } from "../common/@type/online-case";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CookieStorage } from '../common/cookie';
import { EFORM_REQUEST, EformRequestFactory } from 'eform-share';
@Injectable({
  providedIn: 'root'
})
export class ThaiIDService {

  private apiUrl = 'https://imauth.bora.dopa.go.th/api/v1/oauth2/auth/';
  constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory, private http: HttpClient) { }

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
    return  this.http.post<any>(`${environment.config.baseConfig.urlgdcceform}/LoginThaiID/gettokenext`, param);
  }

  public thaiIdgettoken(param: any): Observable<any> {
    return this._req<any>().api('LoginThaiID/create-user-thaiId')
      .body(param)
      .disableCriticalDialogError().post();
  }
}
