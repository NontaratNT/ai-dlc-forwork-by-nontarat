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


@Injectable({
    providedIn: 'root'
})
export class UserService {
    private _userInfo: IUserProfile;
    constructor(
        private jwtHelper: JwtHelperService,
        @Inject(EFORM_REQUEST) private _req: EformRequestFactory,
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

    public authenticateThaiID(username: string, password: string, aal: number): Observable<IAccessToken> {
        return this._req<IAccessToken>("LoginThaiID/auth/thaiid")
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
        return this._req<string>('VacchineCyber/EndcryptData')
            .body({ Data: userId })
            .disableCriticalDialogError()
            .post();
    }

    private createProfile(accressToken: string): IUserProfile {
        const payload: IUserProfile = this.jwtHelper.decodeToken(accressToken);
        payload.UserId = +payload.UserId;
        payload.UserType = +payload.UserType;
        payload.UserIal = +payload.UserIal;
        payload.PersonalType = +payload.PersonalType;
        payload.LastAccessDateTime = new Date(payload.LastAccessDateTime);
        payload.PersonalId = +payload.PersonalId;
        payload.OrganizeId = +payload.OrganizeId;
        payload.OrganizeLevel = +payload.OrganizeLevel;
        payload.OrganizeRootId = +payload.OrganizeRootId;
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
}

export interface IAccessToken {
    Token: string;
    RefreshToken: string;
}
export interface IUserSetting {
    location_name: string;
    issue_status: boolean;
    tabIndex: number;
    iconVisible: boolean;
}
