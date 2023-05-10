import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../services/user';
import { IAccessToken } from '../services/user.service';
import { CookieStorage } from '../common/cookie';

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {
    constructor(private router: Router, private jwt: JwtHelperService) {

    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
    {
        const accessToken: IAccessToken = CookieStorage.accessToken;
        if ( accessToken && !this.jwt.isTokenExpired(accessToken.Token)) {
            this.router.navigate(["/home"], {replaceUrl: true});
            return false;
        }
        User.Clear();
        return true;
    }
}
