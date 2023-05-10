import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxFormComponent } from "devextreme-angular";
import { PersonalService } from "src/app/services/personal.service";
import { User } from "src/app/services/user";
import Swal from 'sweetalert2';
import { IssueOnlineContainerComponent } from "../issue-online-container.component";
import * as moment from 'moment';

@Component({
    selector: "app-issue-online-agree",
    templateUrl: "./issue-online-agree.component.html",
    styleUrls: ["./issue-online-agree.component.scss"],
})
export class IssueOnlineAgreeComponent implements OnInit {
    @ViewChild('formAgree', { static: false }) formAgree: DxFormComponent;
    public mainConponent: IssueOnlineContainerComponent;
    formData: any = {};
    constructor(
        private router: Router,
        private servicePersonal: PersonalService,
    ) {}
    ngOnInit(): void {
        const userId = User.Current.PersonalId;
        this.servicePersonal
            .GetPersonalById(userId)
            .subscribe((_) => {
                this.setDefaultData();

            });
    }
    setDefaultData(){
        this.formData = {
            done: false,
            done1: false,
            done2: false,
            done3: false,
            done4: false,
            done5: false,
            // done6:false
        };
    }
    Back(e){
        this.router.navigate([`/main/task-list`]);
    }
    SubmitForm(e){
        if (!this.formAgree.instance.validate().isValid) {
            Swal.fire({
                title: 'ผิดพลาด!',
                text: 'กรุณาเลือกการยินยอมให้ครบทุกข้อ',
                icon: 'warning',
                confirmButtonText: 'Ok'
            }).then(() => {});
            return;
        }else{
            this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);

        }
        // this.mainConponent.MergeObj(this.formData);
    }


}
