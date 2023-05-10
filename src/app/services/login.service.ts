import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    _successLoginRedirectTo = "/main/tasklist";
    constructor(private router: Router, private userServ: UserService) { }

    login(redirectTo?: string) {
        this._successLoginRedirectTo = redirectTo || this._successLoginRedirectTo;
        this.router.navigate(["/login"]);
    }

    logout(redirectTo = "/home") {
        this.userServ.unAuthenticate();
        this.router.navigate([redirectTo]);
    }
}
