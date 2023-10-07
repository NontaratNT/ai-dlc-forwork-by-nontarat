import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "app-page1",
    templateUrl: "./page1.component.html",
    styleUrls: ["./page1.component.scss"],
})
export class Page1Component implements OnInit {
    constructor(private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {
        window.location.href = "https://officer.thaipoliceonline.com/pct-in/";
    }
}
