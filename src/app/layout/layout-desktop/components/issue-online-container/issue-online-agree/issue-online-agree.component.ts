import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxFormComponent } from "devextreme-angular";
import { PersonalService } from "src/app/services/personal.service";
import { User } from "src/app/services/user";
import Swal from 'sweetalert2';
import { IssueOnlineContainerComponent } from "../issue-online-container.component";
import * as moment from 'moment';
import { IssueOnlineService } from "src/app/services/issue-online.service";

@Component({
    selector: "app-issue-online-agree",
    templateUrl: "./issue-online-agree.component.html",
    styleUrls: ["./issue-online-agree.component.scss"],
})
export class IssueOnlineAgreeComponent implements OnInit {
    @ViewChild('formAgree', { static: false }) formAgree: DxFormComponent;
    public mainConponent: IssueOnlineContainerComponent;
    formData: any = {};
    issueOnline: any;
    formBankref: any = {};
    _dataSourcebankref: any = [];

    popupConsentVisible: boolean = false;
    submission = {} as any;
    _isShow: boolean = false;
    _isShow2: boolean = false;
    ways = [ { id: 2, text: 'ยังไม่ได้แจ้งธนาคาร' },{ id: 1, text: 'ดำเนินการแจ้งธนาคาร' }];

    constructor(
        private router: Router,
        private servicePersonal: PersonalService,
        private _issueOnlineService: IssueOnlineService
    ) { }
    ngOnInit(): void {
        const userId = User.Current.PersonalId;
        // this.servicePersonal
        //     .GetPersonalById(userId)
        //     .subscribe((_) => {
        //         this.setDefaultData();

        //     });

        this.setDefaultData();






    }
    setDefaultData() {
        this.formData = {
            done: false,
            done1: false,
            done2: false,
            done3: false,
            done4: false,
            done5: false,
            done6:false
        };

           //เก็บค่าที่ส่งมาจากแจ้งเตือนใหม่ไว้ในนี้นะครับ
           this._issueOnlineService.issueOnline$.subscribe(value => {
            this.issueOnline = value;
            this.formBankref = value;
        });
    }
    Back(e) {
        localStorage.removeItem("form-blessing");
        localStorage.removeItem("form-informer");
        localStorage.removeItem("form-event");
        localStorage.removeItem("form-damage");
        localStorage.removeItem("form-index");
        this.router.navigate([`/main/task-list`]);
    }
    SubmitForm(e) {
        if (!this.formAgree.instance.validate().isValid) {
            Swal.fire({
                title: 'ผิดพลาด!',
                text: 'กรุณาเลือกการยินยอมให้ครบทุกข้อ',
                icon: 'warning',
                confirmButtonText: 'Ok'
            }).then(() => { });
            return;
        } else {
            // this.mainConponent.formDataAll.formAgree = {};
            // this.mainConponent.formDataAll.formAgree = this.formData;
            // this.mainConponent.formDataInsert = this.formData;
            this.mainConponent.formDataBankref = this._dataSourcebankref;//this.formBankref;
            // console.log(this.mainConponent.formDataInsert);
            this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);

        }
        // this.mainConponent.MergeObj(this.formData);
    }

    Addbankref(){
        this.popupConsentVisible = true;
    }
    onSkip(e){
        this.popupConsentVisible = false;
    }

    onsave(e){
        this.submission.ways = 1;
        this._dataSourcebankref.push(this.submission);

        this.submission = {};
        this.popupConsentVisible = false;
    }

    onWaysValueChanged(event: any) {
        let val = event.value;
        switch (val) {
            case 1:
                this._isShow = true;
                this._isShow2 = false;
                break;
            case 2:
                this._isShow = false;
                this._isShow2 = true;
                break;
        }
    }

    onclosepopundepending(e){
        this._isShow2 = false;
    }

}
