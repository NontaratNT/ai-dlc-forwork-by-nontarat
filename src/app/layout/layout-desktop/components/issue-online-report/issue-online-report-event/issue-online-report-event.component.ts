import { Component, OnInit, ViewChild } from '@angular/core';
import { IssueOnlineReportComponent } from '../issue-online-report.component';
import { BankInfoService } from 'src/app/services/bank-info.service';
import { DxFormComponent, DxSelectBoxComponent } from 'devextreme-angular';
import Swal from 'sweetalert2';
import { FormValidatorService } from 'src/app/services/form-validator.service';

@Component({
    selector: 'app-issue-online-report-event',
    templateUrl: './issue-online-report-event.component.html',
    styleUrls: ['./issue-online-report-event.component.scss']
})
export class IssueOnlineReportEventComponent implements OnInit {

    public mainConponent: IssueOnlineReportComponent;
    @ViewChild("selectCaseType", { static: false }) selectCaseType: DxSelectBoxComponent;
    @ViewChild("formEvent1", { static: false }) formEvent1: DxFormComponent;
    @ViewChild("formPhone", { static: false }) formPhone: DxFormComponent;
    @ViewChild("formSms", { static: false }) formSms: DxFormComponent;
    @ViewChild("formOther", { static: false }) formOther: DxFormComponent;

    formReadOnly : false;
    formData: any = {};
    listCaseType = [];
    caseType = "";
    caseOpen = false;
    isLoading = false;
    formChannelValidate = true;
    maxDateValue:Date = new Date();

    serviceLabelID = [
        {ID:1,TEXT:"AIS"},
        {ID:2,TEXT:"TRUE"},
        {ID:3,TEXT:"DTAC"},
        {ID:4,TEXT:"NT (CAT TOT)"},
        {ID:5,TEXT:"อื่น ๆ"},
        {ID:5,TEXT:"N/A"},
    ];

    constructor(
        private servBankInfo: BankInfoService,
        private _formValidate: FormValidatorService,
    ) { }

    ngOnInit(): void {
        this.isLoading = true;
        this.maxDateValue.setHours(this.maxDateValue.getHours() + 1);
        this.servBankInfo.GetCaseType().subscribe((_) => {
            this.formData.CASE_TYPE_ID = null;
            this.listCaseType = _;
            this.formData.CRIMINAL_TEL = true;
            this.formData.CRIMINAL_SMS = false;
            this.formData.CRIMINAL_OTHER = false;
            this.isLoading = false;
          }, error => {
            if (error.status === 500 || error.status === 524) {
              this.mainConponent.checkReload(2);
            }
          });
    }

    async OnSelectCaseType(e) {
        if (e.value) {
            const data = this.selectCaseType.instance.option("selectedItem");
            if (data) {
                this.formData.CASE_TYPE_ID = data.CASE_TYPE_ID;
                this.formData.CASE_TYPE_NAME = data.CASE_TYPE_NAME;
                this.caseType = data.CASE_TYPE_DESC;
                this.caseOpen = true;
            } else {
                this.formData.CASE_TYPE_ID = e.value;
            }
        }
    }

    SelectTypeChanel(){
        this.formChannelValidate = [this.formData.CHANEL_PHONE, this.formData.CHANEL_SMS ,
            this.formData.CHANEL_LINE,].some((value) => value === true) ? false :true;
    }

    SubmitForm(e){
        console.log([this.formData.CRIMINAL_TEL,this.formData.CRIMINAL_SMS,this.formData.CRIMINAL_OTHER].some((value) => value === true));
        if(![this.formData.CRIMINAL_TEL,this.formData.CRIMINAL_SMS,this.formData.CRIMINAL_OTHER].some((value) => value === true)){
            Swal.fire({
                title: "ผิดพลาด!",
                text: "กรุณาเลือกช่องทางที่ติดต่อคนร้าย",
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => { });
            return;
        }
        if (!this.formEvent1.instance.validate().isValid) {
            this._formValidate.ValidateForm(
                this.formEvent1.instance.validate().brokenRules
            );
            return;
        }
        if(this.formData.CRIMINAL_TEL){
            if (!this.formPhone.instance.validate().isValid) {
                this._formValidate.ValidateForm(
                    this.formPhone.instance.validate().brokenRules
                );
                return;
            }
        }else{
            this.formData.CRIMINAL_TEL_ORIGIN = null;
            this.formData.CRIMINAL_TEL_PROVIDER = null;
            this.formData.CRIMINAL_TEL_DESTINATION = null;
            this.formData.CIMINAL_TEL_DATE = null;
        }
        if(this.formData.CRIMINAL_SMS){
            if (!this.formSms.instance.validate().isValid) {
                this._formValidate.ValidateForm(
                    this.formSms.instance.validate().brokenRules
                );
                return;
            }
        }else{
            this.formData.CRIMINAL_SMS_ORIGIN = null;
            this.formData.CRIMINAL_SMS_PROVIDER = null;
            this.formData.CRIMINAL_SMS_DESTINATION = null;
            this.formData.CIMINAL_SMS_DATE = null;
        }
        if(this.formData.CRIMINAL_OTHER){
            if (!this.formOther.instance.validate().isValid) {
                this._formValidate.ValidateForm(
                    this.formOther.instance.validate().brokenRules
                );
                return;
            }
        }else{
            this.formData.CRIMINAL_TYPE_SOCIAL = null;
            this.formData.CRIMINAL_SOCIAL_DETAIL = null;
        }
        let setData = {};
        const d = this.formData;
        for (const key in d) {
            if (d[key] !== null && d[key] !== undefined) {
                setData[key] = d[key];
            }
        }
        this.mainConponent.formInsert.formEvent = Object.assign({},setData);
        this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
    }

    Back(e){
        this.mainConponent.NextIndex(this.mainConponent.indexTab - 1);
    }

    selectChannel(type){
        if(type == 'phone' && this.formData.CRIMINAL_TEL){
            this.formData.CRIMINAL_TEL_PROVIDER = 'N/A';
        }
        if(type == 'sms' && this.formData.CRIMINAL_SMS){
            this.formData.CRIMINAL_SMS_PROVIDER = 'N/A';
        }
    }

}
