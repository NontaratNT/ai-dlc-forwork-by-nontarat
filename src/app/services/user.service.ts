import { Router } from '@angular/router';
import { Inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { req, Dialog, InternalCache } from 'share-ui';
import { User } from './user';
import { EformRequestFactory, EFORM_REQUEST } from 'eform-share';
import { CookieStorage } from '../common/cookie';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { encrypt } from '../common/helper';


@Injectable({
    providedIn: 'root'
})
export class UserService {
    private _userInfo: IUserProfile;
    constructor(
        private jwtHelper: JwtHelperService,
        @Inject(EFORM_REQUEST) private _req: EformRequestFactory,private http: HttpClient,
        private _dialog: Dialog) { }

    public authenticate(username: string, password: string, aal: number): Observable<IAccessToken> {
        return this._req<IAccessToken>("user/auth")
            .body({ UserName: username, Password: password, RequireAal: aal })
            .disableCriticalDialogError().post()
            .pipe(
                map(_ => {
                    const userInfo = this.createProfile(_.Token);
                    // if (userInfo.UserType !== 1) {
                    //     // this._dialog.error("ผิดพลาด", "คุณไม่ได้รับอนุญาตให้ดำเนินการต่อได้");
                    //     Swal.fire({
                    //         title: 'ผิดพลาด!',
                    //         text: 'คุณไม่ได้รับอนุญาตให้ดำเนินการต่อได้',
                    //         icon: 'warning',
                    //         confirmButtonText: 'ตกลง'
                    //     }).then(() => { });
                    //     return undefined;
                    // }
                    User.SetUser(userInfo);
                    return _;
                }),
                catchError(() => of(undefined))
            );
    }

    // public authenticateThaiID(token:string): Observable<IAccessToken> {
        // return this._req<IAccessToken>("LoginThaiID/auth/thaiid")
        //     .disableCriticalDialogError().post()
        //     // .setHeaders("Authorization", `Bearer ${token}`) // เพิ่ม Header
        //     // .HttpHeaders(new HttpHeaders().set("Authorization", `Bearer ${token}`))
        //     .pipe(
        //         map(_ => {
        //             const userInfo = this.createProfile(_.Token);
        //             // if (userInfo.UserType !== 1) {
        //             //     // this._dialog.error("ผิดพลาด", "คุณไม่ได้รับอนุญาตให้ดำเนินการต่อได้");
        //             //     Swal.fire({
        //             //         title: 'ผิดพลาด!',
        //             //         text: 'คุณไม่ได้รับอนุญาตให้ดำเนินการต่อได้',
        //             //         icon: 'warning',
        //             //         confirmButtonText: 'ตกลง'
        //             //     }).then(() => { });
        //             //     return undefined;
        //             // }
        //             User.SetUser(userInfo);
        //             return _;
        //         }),
        //         catchError(() => of(undefined))
        //     );
    // }
    public authenticateThaiID(token: string): Observable<IAccessToken> {
        const url = `${environment.config.eFormHost}/LoginThaiID/auth/thaiid`;
        
        // ตั้งค่า Header
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${token}`
            })
        };

        return this.http.post<any>(url, {}, httpOptions).pipe(
            map(res => {
                console.log(res);
                if (res.Value && res.Value.Token) {
                    const userInfo = this.createProfile(res.Value.Token);
                    User.SetUser(userInfo);
                    return res.Value;
                }
                return undefined;
            }),
            catchError((error) => {
                console.error('Auth Error:', error);
                return of(undefined);
            })
        );
    }

    public refreshToken(): Observable<IAccessToken> {
        return this._req<IAccessToken>("user/refresh")
            .disableDialogError()
            .body(CookieStorage.accessToken)
            .disableCriticalDialogError().post();
    }

    public renewUser(token: string, refreshToken: string): Observable<IAccessToken> {
        return this._req<IAccessToken>("user/renew")
            .body({ Token: token, RefreshToken: refreshToken })
            .disableCriticalDialogError().post()
            .pipe(
                map(_ => {
                    const userInfo = this.createProfile(_.Token);
                    // if (userInfo.UserType !== 1) {
                    //     // this._dialog.error("ผิดพลาด", "คุณไม่ได้รับอนุญาตให้ดำเนินการต่อได้");
                    //     Swal.fire({
                    //         title: 'ผิดพลาด!',
                    //         text: 'คุณไม่ได้รับอนุญาตให้ดำเนินการต่อได้',
                    //         icon: 'warning',
                    //         confirmButtonText: 'ตกลง'
                    //     }).then(() => { });
                    //     return undefined;
                    // }

                    User.SetUser(userInfo);
                    return _;
                }));
    }

    public unAuthenticate(): void {
        User.Clear();
        InternalCache.DeleteAll();
        CookieStorage.removeAccessToken();
    }

    public getTokenCypherVac(userId: number): Observable<string> {
        return this._req<string>('Officer/VacchineCyber/EndcryptData')
        // .host(environment.config.baseConfig.urlgdcceform)
            .body({ Data: userId })
            .disableCriticalDialogError()
            .post();
    }

    private createProfile(accressToken: string): IUserProfile {
        const payload: IUserProfile = this.jwtHelper.decodeToken(accressToken);
        console.log(payload);
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


    // eslint-disable-next-line @typescript-eslint/member-ordering
    public postForgetPassword(UserEmail: string): Observable<IForgetPassword> {
        return req<IForgetPassword>('user/forget-password')
            .body({ Email: UserEmail })
            .disableCriticalDialogError().post();
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    public postResetPassword(SessionId: string, UserPassword: string): Observable<IResetPassword> {
        return req<IResetPassword>('user/reset-password')
            .body({ Token: SessionId, Password: UserPassword })
            .disableCriticalDialogError().post();
    }

     public postResetPasswordForce(UserPassword: string): Observable<IResetPassword> {
        const encryptedPassword = encrypt(UserPassword);
        return this._req<IResetPassword>('User/reset-password-force')
            .body({ NewPassword: encryptedPassword })
            .disableCriticalDialogError().post();
    }


    public loginZoom(userId: number): Observable<string> {
        return this._req<string>(`User/check-senior-cyber/${userId}`)
            .disableCriticalDialogError()
            .post();
    }

    public getListQuestion(): Observable<string> {
        return this._req<string>('SeniorCyber/GetseniorChannel')
            .disableCriticalDialogError()
            .get();
    }

    public SaveQuestion(param: any): Observable<string> {
        return this._req<string>(`Officer/SeniorCyber`)
            .body(param)
            .disableCriticalDialogError()
            .post();
    }

    public UpdateSeniorFlag(userId: any,type: any): Observable<string> {
        return this._req<string>(`Officer/SeniorCyber/updateFlag/${type}/${userId}`)
        // .host(environment.config.baseConfig.urlgdcceform)
            .disableCriticalDialogError()
            .put();
    }

    public UpdateSeniorFlagAzure(userId: any,type: any): Observable<string> {
        return this._req<string>(`CmsPersonal/updateFlag/${type}/${userId}`)
            .disableCriticalDialogError()
            .put();
    }

    public getKey(username : string): Observable<any> {
        return   this._req<any>("user/challenge")
        .body({ UserName: username })
        .post()
    }
    //     public getKey(username: string): Observable<any> {
    //     return this.http.post<any>(
    //         environment.config.eFormHost + "/user/challenge",
    //         { UserName: username }
    //     );
    // }

}

export interface IForgetPassword {
    UserEmail?: string;
}
export interface IResetPassword {
    SessionId?: string;
    UserPassword?: string;
}

export interface IRegisterDataAll {
    PERSONAL_FNAME_THA: string;
    PERSONAL_LNAME_THA: string;
    PERSONAL_CITIZEN_NUMBER: string;
    PERSONAL_ID_CARD: string;
    PERSONAL_BIRTH_DATE: any;
    USER_NAME: string;
    NEW_PASSWORD: string;
    NEW_PASSWORD_AGAIN: string;
    PERSONAL_PIN_CODE: string;
    PERSONAL_EMAIL: string;
}

export interface IUserProfile {
    UserId: number;
    UserName: string;
    PersonalId: number;
    FullNameTH: string;
    FirstNameTH: string;
    LastNameTH: string;
    PositionId: number;
    CitizenNumber: string;
    // PersonalEmail: string;
    PositionNameTH: string;
    OrganizeId: number;
    OrganizeLevel: number;
    OrganizeRootId: number;
    OrganizeNameTH: string;
    ImageUrl: string;
    LastAccessDateTime: Date;
    UserType: number;
    PersonalType: number;
    UserIal: number;
    Age: number;
    SeniorStatus: string;
    CyberEyeStatus: string;
    CyberCatStatus: string;
    LatestUpdatePassword: string;
}

export interface IAccessToken {
    Token: string;
    RefreshToken: string;
    messeage?: string;
}
export interface IUserSetting {
    location_name: string;
    issue_status: boolean;
    tabIndex: number;
    iconVisible: boolean;
}
