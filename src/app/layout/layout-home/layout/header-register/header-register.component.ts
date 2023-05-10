import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header-register',
    templateUrl: './header-register.component.html',
    styleUrls: ['./header-register.component.scss']
})
export class HeaderRegisterComponent implements OnInit {

    constructor(
        private _router: Router,
    ) { }

    ngOnInit(): void {
    }
    RedirectUrl(url){
        this._router.navigate([url]);
    }
}
