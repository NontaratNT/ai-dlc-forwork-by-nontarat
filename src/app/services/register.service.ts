import { Inject, Injectable } from '@angular/core';
import { HttpStatusResult, IPagingResult, HttpStatusResultValue } from 'share-ui';
import { Observable } from 'rxjs';
import { req } from 'share-ui';
import { IUserRegisterInfo } from '../common/@type/register';
import { EformRequestFactory, EFORM_REQUEST } from 'eform-share';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
@Injectable({
    providedIn: 'root'
})
export class RegisterService {

    constructor(private http: HttpClient,private userServ: UserService) { }

    public getById(registerId: number): Observable<IUserRegisterInfo> {
        return req<IUserRegisterInfo>(`CmsRegister/${registerId}`)
            .disableCriticalDialogError().get();
    }

    public getUserRegister(registerUser: string, requestIal: number): Observable<IUserRegisterInfo> {
        return req<IUserRegisterInfo>("CmsRegister")
            .queryString({ RegisterUsername: registerUser , RequestIal: requestIal})
            .disableCriticalDialogError().get();
    }

    public postRegister(param: FormData): Observable<HttpStatusResult> {
        return req<HttpStatusResult>('user/register')
            .body(param)
            .useSystemResult()
            .disableCriticalDialogError().post();
    }

    public registerBefore(param: FormData): Observable<HttpStatusResult> {
        return req<HttpStatusResult>('user/register/before-otp')
            .body(param)
            .useSystemResult()
            .disableCriticalDialogError().post();
    }

    public registerBeforegdcc(param: FormData): Observable<any>{
   

        return  this.http.post<HttpStatusResult>(`${environment.config.baseConfig.urlgdcc}/user/register/before-otp`, param);

    }

    public postRegisterMQ(param: FormData): Observable<HttpStatusResult> {
        return req<HttpStatusResult>('user/register/mq')
            .body(param)
            .useSystemResult()
            .disableCriticalDialogError().post();
    }

    public sendSMS(username: string, tel: string): Observable<HttpStatusResult> {
        return req<HttpStatusResult>('user/register/send-sms')
            .body({Username:username, Tel:tel})
            .useSystemResult()
            .disableCriticalDialogError().post();
    }

    public sendSMSgdcc(username: string, tel: string): Observable<any>{
   

        return  this.http.post<HttpStatusResult>(`${environment.config.baseConfig.urlgdcc}/user/register/send-sms`, {Username:username, Tel:tel});

    }

    public postReSend(username: string,email: string): Observable<HttpStatusResult> {
        return req<HttpStatusResult>('user/register/send-activate')
            .body({Username:username, Email:email})
            .useSystemResult()
            .disableCriticalDialogError().post();
    }
    
    public postReSendgdcc(username: string,email: string): Observable<any>{
   

        return  this.http.post<HttpStatusResult>(`${environment.config.baseConfig.urlgdcc}/user/register/send-activate`, {Username:username, Email:email});

    }
    public postActive(username: string,otp: string): Observable<HttpStatusResult> {
        return req<HttpStatusResult>('user/register/activate')
            .body({Username:username,OTP:otp})
            .useSystemResult()
            .disableCriticalDialogError().post();
    }

    public postActiveMQ(username: string,otp: string): Observable<HttpStatusResult> {
        return req<HttpStatusResult>('user/register/activate/mq')
            .body({Username:username,OTP:otp})
            .useSystemResult()
            .disableCriticalDialogError().post();
    }

    public postActiveMQgdcc(username: string,otp: string): Observable<any>{
   

        return  this.http.post<HttpStatusResult>(`${environment.config.baseConfig.urlgdcc}/user/register/activate/mq`, {Username:username,OTP:otp});

    }

    public forgetSMS(tel: string): Observable<HttpStatusResult> {
        return req<HttpStatusResult>('user/forget-password/send-sms')
            .body({Tel:tel})
            .useSystemResult()
            .disableCriticalDialogError().post();
    }

    public forgetSMSConfirm(tel: string, otp: string): Observable<HttpStatusResultValue<string>> {
        return req('user/forget-password/sms-confirm')
            .body({Tel:tel,OTP:otp})
            .useSystemResult<HttpStatusResultValue<string>>()
            .disableCriticalDialogError().post();
    }
}
export interface IRegister {
    TITLE_ID?: number;
    PERSONAL_FNAME_THA?: string;
    PERSONAL_LNAME_THA?: string;
    PERSONAL_TEL_NO?: string;
    PERSONAL_BIRTH_DATE: any;
    PERSONAL_BIRTH_DATE_CHECK_API?: string;
    PERSONAL_CITIZEN_NUMBER: string;
    PERSONAL_LASER_NUMBER: string;
    REGISTER_USER_NAME?: string;
    PERSONAL_EMAIL?: string;
    NEW_PASSWORD?: string;
    FRONT_PPD_PICTURE: any;
    TYPE_CYBER: any;
    CYBER_STATUS: any;
}
export interface IActive {
    EMAIL?: string;
    OTP?: string;
}
export interface IReSend {
    Email?: string;
}
