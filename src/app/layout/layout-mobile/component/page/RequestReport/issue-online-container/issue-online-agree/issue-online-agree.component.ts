import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxFormComponent } from "devextreme-angular";
import { PersonalService } from "src/app/services/personal.service";
import { User } from "src/app/services/user";
import { UserSettingService } from "src/app/services/user-setting.service";
import Swal from 'sweetalert2';
import { IssueOnlineContainerComponent } from "../issue-online-container.component";

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
        private userSetting: UserSettingService,
        private router: Router,
        private servicePersonal: PersonalService,
    ) { }
    ngOnInit(): void {
        const userId = User.Current.PersonalId;
        this.servicePersonal
            .GetPersonalById(userId)
            .subscribe((_) => {
                this.setDefaultData();

            });
    }
    setDefaultData() {
        // this.formData = {
        //     done: true,
        //     done1: true,
        //     done2: true,
        //     done3: true,
        //     done4: true,
        //     done5: true
        // };
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
    Back(e) {
        this.router.navigate([`/mobile/issue`]);
        this.mainConponent.numCount = this.mainConponent.indexTab - 1;
        this.userSetting.userSetting.tabIndex = this.mainConponent.numCount;
    }
    SubmitForm(e) {
        // if (!this.formAgree.instance.validate().isValid) {
        //     Swal.fire({
        //         title: 'ผิดพลาด!',
        //         text: 'กรุณากรอกข้อมูลให้ครบ',
        //         icon: 'warning',
        //         confirmButtonText: 'Ok'
        //     }).then(() => {});
        //     return;
        // }
        // this.mainConponent.MergeObj(this.formData);
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
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            this.mainConponent.numCount = this.mainConponent.indexTab + 1;
            this.userSetting.userSetting.issue_status = true;
            this.userSetting.userSetting.tabIndex = this.mainConponent.numCount;
        }
      
    }


}
