import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../services/user';
import { IAccessToken, UserService } from '../services/user.service';
import { CookieStorage } from '../common/cookie';

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {
    constructor(private router: Router, private jwt: JwtHelperService, private userServ: UserService) {

    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
    {
        const accessToken: IAccessToken = CookieStorage.accessToken;
        if ( accessToken && !this.jwt.isTokenExpired(accessToken.Token)) {
            if(state.url === "/login?icli=al"){
                this.userServ.getTokenCypherVac(User.Current.UserId).toPromise().then((res) => {
                    window.location.href = `https://bt-cyber-vaccine.demotoday.net?redirecthas=${res}`;
                });
                return false;
            }
            this.router.navigate(["/home"], {replaceUrl: true});
            return false;
        }
        User.Clear();
        return true;
    }
}
