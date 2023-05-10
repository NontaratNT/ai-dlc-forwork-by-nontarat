import { Component, OnInit, ViewChild } from "@angular/core";
import { DxFormComponent } from "devextreme-angular";
import { PersonalService } from "src/app/services/personal.service";
import { User } from "src/app/services/user";
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
        if (this.mainConponent.formType === 'add') {
            this.formData = {
                done: null,
                done1: null,
                done2: null,
                done3: null,
            };
            // this.formAgree.instance._refresh();
        }
    }
    SubmitForm(e){
        if (!this.formAgree.instance.validate().isValid) {
            Swal.fire({
                title: 'ผิดพลาด!',
                text: 'กรุณากรอกข้อมูลให้ครบ',
                icon: 'warning',
                confirmButtonText: 'Ok'
            }).then(() => {});
            return;
        }
        this.mainConponent.MergeObj(this.formData);
        this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
    }


}
