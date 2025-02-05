import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-main-home',
    templateUrl: './main-home.component.html',
    styleUrls: ['./main-home.component.scss']
})
export class MainHomeComponent implements OnInit {

    constructor(private router: Router,) { }

    ngOnInit(): void {
    }

    openLink(link: string) {
        this.router.navigate([link], { queryParams: { icli: 'landing' } });
    }

}
