import { Component, OnInit } from "@angular/core";
import { User } from "src/app/services/user";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
    personalInfo: any = {};
    constructor() {}

    ngOnInit(): void {
        this.personalInfo = User.Current;
    }
}
