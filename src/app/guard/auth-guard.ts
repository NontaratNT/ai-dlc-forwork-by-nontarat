import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, Router } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';
import { CookieStorage } from '../common/cookie';
import { User } from '../services/user';
import { IAccessToken, UserService } from '../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(
        private router: Router,
        private userServ: UserService
    ) {

    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const accessToken: IAccessToken = CookieStorage.accessToken;
        const remeberMe = CookieStorage.setting.RememberLogin;
        if (User.Current) {
            return true;
        }

        if (accessToken && remeberMe) {
            return new Observable<boolean>((o: Subscriber<boolean>) => {
                this.userServ.renewUser(accessToken.Token, accessToken.RefreshToken).subscribe({
                    next: (_) => {
                        if (_) {
                            CookieStorage.accessToken = ({
                                Token: _.Token,
                                RefreshToken: _.RefreshToken
                            } as IAccessToken);

                            o.next(true);
                        } else {
                            this.goToLoginPage(state);
                            o.next(false);
                        }
                    },
                    error: () => {
                        this.goToLoginPage(state);
                        o.next(false);
                    }
                });
            });
        }

        this.goToLoginPage(state);
        return false;
    }

    goToLoginPage(state: RouterStateSnapshot) {
        this.userServ.unAuthenticate();
        this.router.navigate(["/login"], {replaceUrl: true, queryParams: { redirectTo: state.url } });
    }

    canActivateChild(): boolean | Observable<boolean> | Promise<boolean> {
        return true;
    }
}
