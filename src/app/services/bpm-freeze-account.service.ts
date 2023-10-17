/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { EformRequestFactory, EFORM_REQUEST } from 'eform-share';
import { Observable } from 'rxjs';
import { req } from 'share-ui';
import { environment } from 'src/environments/environment';
import { CookieStorage } from '../common/cookie';

@Injectable({
    providedIn: 'root'
})
export class FreezeAccountService {

    constructor(private http: HttpClient) { }

    public post(param: any): Observable<any> {
        return req<any>("BpmFreezeAccount")
            .body(param)
            .disableCriticalDialogError().post();
    }

    public postgdcc(param: any): Observable<any> {
        const newHeader = new HttpHeaders({Authorization: "Bearer " + CookieStorage.accessToken});
        return  this.http.post<any>(`${environment.config.baseConfig.urlgdcc}/BpmFreezeAccount`, param);

    }
}



