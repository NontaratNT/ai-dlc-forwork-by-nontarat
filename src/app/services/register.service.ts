import { Injectable } from '@angular/core';
import { HttpStatusResult, IPagingResult, HttpStatusResultValue } from 'share-ui';
import { Observable } from 'rxjs';
import { req } from 'share-ui';
import { IUserRegisterInfo } from '../common/@type/register';

@Injectable({
    providedIn: 'root'
})
export class RegisterService {

    constructor() { }

    public getById(registerId: number): Observable<IUserRegisterInfo> {
        return req<IUserRegisterInfo>(`CmsRegister/${registerId}`)
            .get();
    }

    public getUserRegister(registerUser: string, requestIal: number): Observable<IUserRegisterInfo> {
        return req<IUserRegisterInfo>("CmsRegister")
            .queryString({ RegisterUsername: registerUser , RequestIal: requestIal})
            .get();
    }

    public postRegister(param: FormData): Observable<HttpStatusResult> {
        return req<HttpStatusResult>('user/register')
            .body(param)
            .useSystemResult()
            .post();
    }

    public registerBefore(param: FormData): Observable<HttpStatusResult> {
        return req<HttpStatusResult>('user/register/before-otp')
            .body(param)
            .useSystemResult()
            .post();
    }

    public postRegisterMQ(param: FormData): Observable<HttpStatusResult> {
        return req<HttpStatusResult>('user/register/mq')
            .body(param)
            .useSystemResult()
            .post();
    }

    public sendSMS(username: string, tel: string): Observable<HttpStatusResult> {
        return req<HttpStatusResult>('user/register/send-sms')
            .body({Username:username, Tel:tel})
            .useSystemResult()
            .post();
    }

    public postReSend(username: string,email: string): Observable<HttpStatusResult> {
        return req<HttpStatusResult>('user/register/send-activate')
            .body({Username:username, Email:email})
            .useSystemResult()
            .post();
    }
    public postActive(username: string,otp: string): Observable<HttpStatusResult> {
        return req<HttpStatusResult>('user/register/activate')
            .body({Username:username,OTP:otp})
            .useSystemResult()
            .post();
    }

    public postActiveMQ(username: string,otp: string): Observable<HttpStatusResult> {
        return req<HttpStatusResult>('user/register/activate/mq')
            .body({Username:username,OTP:otp})
            .useSystemResult()
            .post();
    }

    public forgetSMS(tel: string): Observable<HttpStatusResult> {
        return req<HttpStatusResult>('user/forget-password/send-sms')
            .body({Tel:tel})
            .useSystemResult()
            .post();
    }

    public forgetSMSConfirm(tel: string, otp: string): Observable<HttpStatusResultValue<string>> {
        return req('user/forget-password/sms-confirm')
            .body({Tel:tel,OTP:otp})
            .useSystemResult<HttpStatusResultValue<string>>()
            .post();
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
}
export interface IActive {
    EMAIL?: string;
    OTP?: string;
}
export interface IReSend {
    Email?: string;
}
