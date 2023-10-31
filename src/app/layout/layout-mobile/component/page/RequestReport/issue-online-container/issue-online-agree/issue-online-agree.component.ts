import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxFormComponent } from "devextreme-angular";
import { PersonalService } from "src/app/services/personal.service";
import { User } from "src/app/services/user";
import { UserSettingService } from "src/app/services/user-setting.service";
import Swal from 'sweetalert2';
import { IssueOnlineContainerComponent } from "../issue-online-container.component";
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
    popupConsentVisible: boolean = false;
    submission = {} as any;
    _isShow: boolean = false;
    _isShow2: boolean = false;
    ways = [ { id: 2, text: 'ยังไม่ได้แจ้งธนาคาร' },{ id: 1, text: 'ดำเนินการแจ้งธนาคาร' }];
    _isLoading = false;
    formBankref: any = {};
    _dataSourcebankref: any = [];

    constructor(
        private userSetting: UserSettingService,
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

         //เก็บค่าที่ส่งมาจากแจ้งเตือนใหม่ไว้ในนี้นะครับ
        //  this._issueOnlineService.issueOnline$.subscribe(value => {
        //     this.formBankref = value;
        // });
        // this.formData = {
        //     done: true,
        //     done1: true,
        //     done2: true,
        //     done3: true,
        //     done4: true,
        //     done5: true
        // };

        // this.popupConsentVisible = true;
        this.formData = {
            done: false,
            done1: false,
            done2: false,
            done3: false,
            done4: false,
            done5: false,
            done6:false
        };
    }
    Back(e) {
        localStorage.removeItem("form-blessing");
        localStorage.removeItem("form-informer");
        localStorage.removeItem("form-event");
        localStorage.removeItem("form-damage");
        localStorage.removeItem("form-index");
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
            this.mainConponent.formDataBankref = this._dataSourcebankref;//this.formBankref;
            this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            this.mainConponent.numCount = this.mainConponent.indexTab + 1;
            this.userSetting.userSetting.issue_status = true;
            this.userSetting.userSetting.tabIndex = this.mainConponent.numCount;

        }

    }



    onRegister(event: any) {
        console.clear();
        // console.log("User.Current.PersonalId",User.Current.PersonalId)
        // console.log(event);
        // console.log(this.submission);
        this._isLoading = true;
        if (this._isShow2) {
            Swal.fire({
                title: 'แจ้งเตือน!',
                text: 'ระบบจะนำท่านไปสู่ขั้นตอนแจ้งเรื่องใหม่!!!',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                this._isLoading = true;
                this.popupConsentVisible = false;
            });
        }
        else {
            try {
                this.submission.CREATE_USER_ID = User.Current.PersonalId;
                this.submission.PERSONAL_ID = User.Current.PersonalId;

                this._issueOnlineService.issueOnline = this.submission;

                    Swal.fire({
                        title: 'แจ้งเตือน!',
                        text: 'ดำเนินการบันทึกข้อมูลเรียบร้อย ระบบจะนำท่านไปสู่ขั้นตอนแจ้งเรื่องใหม่!!!',
                        icon: 'success',
                        confirmButtonText: 'ตกลง'
                    }).then(() => {
                        this._isLoading = true;
                        this.popupConsentVisible = false;
                    });
            } catch (error) {

            } finally {
                setTimeout(() => {
                    this._isLoading = false;
                }, 2000);
            }
        }
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
        console.log(event);
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
