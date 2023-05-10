import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/services/user';
import Swal from 'sweetalert2';
import { UserSettingService } from 'src/app/services/user-setting.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
    selector: 'app-header-main',
    templateUrl: './header-main.component.html',
    styleUrls: ['./header-main.component.scss']
})
export class HeaderMainComponent implements OnInit {
    constructor(
        private _router: Router,
        private userSetting: UserSettingService,
        private _loginServ: LoginService,

    ) { }

    ngOnInit(): void {

    }
    RedirectUrl(url){
        this._router.navigate([url]);
    }
}
