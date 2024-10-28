import { Select } from './../../../../../components/controls/date-time-input/date-time-input.component';
import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: "app-select-issue",
    templateUrl: "./select-issue.component.html",
    styleUrls: ["./select-issue.component.scss"],
})
export class SelectIssueComponent implements OnInit {
    constructor(private router:Router ) {}

    ngOnInit() {}


    select(selected : number){
        if(selected === 1){
            this.router.navigate(["/mobile/issue-online/1"]);
        }else{
            this.router.navigate(["/mobile/issue-online-report"]);
        }
    }

}
