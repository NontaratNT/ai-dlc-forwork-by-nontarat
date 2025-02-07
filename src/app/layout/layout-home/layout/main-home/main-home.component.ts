import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-main-home',
    templateUrl: './main-home.component.html',
    styleUrls: ['./main-home.component.scss']
})
export class MainHomeComponent implements OnInit {

    isMobile = false;
    isTablet = false;
    isDesktop = false;

    constructor(private router: Router, private breakpointObserver: BreakpointObserver) {
        this.breakpointObserver.observe([
            '(max-width: 599.98px)',  // Mobile
            '(min-width: 600px) and (max-width: 959.98px)', // Tablet (Custom)
            '(min-width: 960px)'  // Desktop
        ]).subscribe(result => {
            this.isMobile = result.breakpoints['(max-width: 599.98px)'];
            this.isTablet = result.breakpoints['(min-width: 600px) and (max-width: 959.98px)'];
            this.isDesktop = result.breakpoints['(min-width: 960px)'];

            if (this.isMobile) {
                console.log("📱 ตอนนี้คุณอยู่ในโหมด Mobile");
            } else if (this.isTablet) {
                console.log("📟 ตอนนี้ใช้งานอยู่ในโหมด Tablet");
            } else if (this.isDesktop) {
                console.log("🖥️ ตอนนี้ใช้งานอยู่ในโหมด Window");
            }
        });
    }

    ngOnInit(): void {
    }

    openLink(link: string) {
        this.router.navigate([link], { queryParams: { icli: 'landing' } });
    }

}
