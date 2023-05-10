import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-issue-online",
    templateUrl: "./issue-online.component.html",
    styleUrls: ["./issue-online.component.scss"],
})
export class IssueOnlineComponent implements OnInit {
    userType = "mySelf";
    reloadTab = false;
    constructor(
        private _activeRoute: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        // const data = history.state || undefined;
        // this.userType = data.userType || "mySelf";
        // console.log('this.userType ->>>>',data);
        // this._activeRoute.data.subscribe(_ => {
        //     // console.log('this.userType ->>>>',_);
        // });
        this._activeRoute.params.subscribe(params => {
            this.userType = params.userType === '2'?"other":"mySelf";
            this.reloadTab = true;
        });
    }
}
