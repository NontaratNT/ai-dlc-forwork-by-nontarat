import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ResizedEvent } from "angular-resize-event";
import { User } from "src/app/services/user";

@Component({
    selector: "app-dashboard-case",
    templateUrl: "./dashboard-case.component.html",
    styleUrls: ["./dashboard-case.component.scss"],
})
export class DashboardCaseComponent implements OnInit {
    personalInfo: any = {};
    displayBlockTop = "col-8";
    displayBlock = "col-6";
    blockRightClass = true;
    constructor(
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.personalInfo = User.Current;
    }
    onResized(event: ResizedEvent): void {
        if (event.newWidth > 0 && event.newWidth < 881.98) {
            this.displayBlockTop = "col-12";
            this.displayBlock = "col-12";
            this.blockRightClass = false;
        }else{
            this.displayBlockTop = "col-8";
            this.displayBlock = "col-6";
            this.blockRightClass = true;

        }
    }
    Link(userType: number){
        this.router.navigate([`/main/issue-online/${userType}`]);
        // this.router.navigateByUrl('/main/issue-online', { state: {userType} });
    }
}
