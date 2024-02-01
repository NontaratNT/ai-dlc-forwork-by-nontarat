import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import 'rxjs/add/operator/map';
// eslint-disable-next-line no-restricted-imports
import {Observable} from 'rxjs/Rx';

@Injectable({
    providedIn: 'root'
})
export class RecaptchaService {
    constructor(
        private http: HttpClient,
    ) { }
    public postCheckRecapcha(response: string): Observable<boolean>{
        const body = new HttpParams()
            .set(`secret`, environment.config.recaptcha.secretKey)
            .set(`response`, response);
        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded','Access-Control-Allow-Origin': '*' });

        return this.http.post(`/`, body.toString(), { headers, observe: 'response' })
            .map((res: HttpResponse<IResponseCheck>) => res.ok)
            .catch((err: any) => Observable.of(false));

    }
}
export interface IResponseCheck {
    success: boolean;
    error_codes: any;
    challenge_ts: any;
    hostname: string;
    score: any;
    action: string;
}

