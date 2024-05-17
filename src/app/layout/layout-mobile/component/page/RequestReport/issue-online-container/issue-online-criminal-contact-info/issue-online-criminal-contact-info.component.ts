import { IssueOnlineContainerComponent } from './../issue-online-container.component';
import { Component, DoCheck, OnInit, ViewChild } from '@angular/core';
import { BankInfoService } from 'src/app/services/bank-info.service';
import { DxFormComponent, DxSelectBoxComponent } from 'devextreme-angular';
import Swal from 'sweetalert2';
import { FormValidatorService } from 'src/app/services/form-validator.service';
import { DatePipe } from '@angular/common';
import { IssueOnlineService } from 'src/app/services/issue-online.service';

@Component({
    selector: 'app-issue-online-criminal-contact-info-event',
    templateUrl: './issue-online-criminal-contact-info.component.html',
    styleUrls: ['./issue-online-criminal-contact-info.component.scss']
})
export class IssueOnlineCriminalContatInfoComponent implements OnInit, DoCheck {

    public mainConponent: IssueOnlineContainerComponent;
    @ViewChild("selectCaseType", { static: false }) selectCaseType: DxSelectBoxComponent;
    @ViewChild("formEvent1", { static: false }) formEvent1: DxFormComponent;
    @ViewChild("formPhone", { static: false }) formPhone: DxFormComponent;
    @ViewChild("formSms", { static: false }) formSms: DxFormComponent;
    @ViewChild("formOther", { static: false }) formOther: DxFormComponent;

    formReadOnly: false;
    formData: any = {};
    listCaseType = [];
    caseType = "";
    caseOpen = false;
    isLoading = false;
    formChannelValidate = true;
    maxDateValue: Date = new Date();

    serviceLabelID = [
        { ID: 1, TEXT: "AIS" },
        { ID: 2, TEXT: "TRUE" },
        { ID: 3, TEXT: "DTAC" },
        { ID: 4, TEXT: "NT (CAT TOT)" },
        { ID: 5, TEXT: "อื่น ๆ" },
        { ID: 5, TEXT: "N/A" },
    ];

    socialType = [
        'LINE',
        'FACEBOOK',
        'MESSENGER',
        'INSTAGRAM',
        'WEBSITE',
        'EMAIL',
        'TELEGRAM',
        'WHATSAPP',
        'TWITTER',
        'อื่นๆ',
    ];

    appState: {
        checkOtherTel: boolean;
        checkOtherSms: boolean;
        checkOtherSocial: boolean;
    } = {
        checkOtherTel: false,
        checkOtherSms: false,
        checkOtherSocial: false
    };

    constructor(
        private servBankInfo: BankInfoService,
        private _formValidate: FormValidatorService,
        private datePipe: DatePipe,
        private issueOnlineService: IssueOnlineService
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

    ngDoCheck(): void {
        this.appState.checkOtherTel = this.formData.CRIMINAL_TEL_PROVIDER === 'อื่น ๆ' ?? false;
        if (!this.appState.checkOtherTel) {
            this.formData.CRIMINAL_TEL_PROVIDER_DETAIL = '';
        }
        this.appState.checkOtherSms = this.formData.CRIMINAL_SMS_PROVIDER === 'อื่น ๆ' ?? false;
        if (!this.appState.checkOtherSms) {
            this.formData.CRIMINAL_SMS_PROVIDER_DETAIL = '';
        }
        this.appState.checkOtherSocial = this.formData.CRIMINAL_TYPE_SOCIAL === 'อื่นๆ' ?? false;

        if(this.formData.CRIMINAL_SMS_DATE_FULL){
            this.formData.CRIMINAL_SMS_DATE = this.datePipe.transform(this.formData.CRIMINAL_SMS_DATE_FULL, 'yyyy-MM-dd');
            this.formData.CRIMINAL_SMS_TIME = this.datePipe.transform(this.formData.CRIMINAL_SMS_DATE_FULL, 'HH:mm:ss');
        }

        if(this.formData.CRIMINAL_TEL_DATE_FULL){
            this.formData.CRIMINAL_TEL_DATE = this.datePipe.transform(this.formData.CRIMINAL_TEL_DATE_FULL, 'yyyy-MM-dd');
            this.formData.CRIMINAL_TEL_TIME = this.datePipe.transform(this.formData.CRIMINAL_TEL_DATE_FULL, 'HH:mm:ss');
        }
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

    SelectTypeChanel() {
        this.formChannelValidate = [this.formData.CHANEL_PHONE, this.formData.CHANEL_SMS,
            this.formData.CHANEL_LINE,].some((value) => value === true) ? false : true;
    }

    SubmitForm(e) {
        console.log([this.formData.CRIMINAL_TEL, this.formData.CRIMINAL_SMS, this.formData.CRIMINAL_OTHER].some((value) => value === true));
        if (![this.formData.CRIMINAL_TEL, this.formData.CRIMINAL_SMS, this.formData.CRIMINAL_OTHER].some((value) => value === true)) {
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
        if (this.formData.CRIMINAL_TEL) {
            if (!this.formPhone.instance.validate().isValid) {
                this._formValidate.ValidateForm(
                    this.formPhone.instance.validate().brokenRules
                );
                return;
            }
        } else {
            this.formData.CRIMINAL_TEL_ORIGIN = null;
            this.formData.CRIMINAL_TEL_PROVIDER = null;
            this.formData.CRIMINAL_TEL_DESTINATION = null;
            this.formData.CRIMINAL_TEL_DATE_FULL = null;
            this.formData.CRIMINAL_TEL_DATE = null;
            this.formData.CRIMINAL_TEL_TIME = null;
        }
        if (this.formData.CRIMINAL_SMS) {
            if (!this.formSms.instance.validate().isValid) {
                this._formValidate.ValidateForm(
                    this.formSms.instance.validate().brokenRules
                );
                return;
            }
        } else {
            this.formData.CRIMINAL_SMS_ORIGIN = null;
            this.formData.CRIMINAL_SMS_PROVIDER = null;
            this.formData.CRIMINAL_SMS_DESTINATION = null;
            this.formData.CRIMINAL_SMS_DATE_FULL = null;
            this.formData.CRIMINAL_SMS_DATE = null;
            this.formData.CRIMINAL_SMS_TIME = null;
        }
        if (this.formData.CRIMINAL_OTHER) {
            if (!this.formOther.instance.validate().isValid) {
                this._formValidate.ValidateForm(
                    this.formOther.instance.validate().brokenRules
                );
                return;
            }
        } else {
            this.formData.CRIMINAL_TYPE_SOCIAL = null;
            this.formData.CRIMINAL_SOCIAL_TYPE_DETAIL = null;
            this.formData.CRIMINAL_SOCIAL_DETAIL = null;
        }
        const setData = {};
        const d = this.formData;
        for (const key in d) {
            if (d[key] !== null && d[key] !== undefined) {
                setData[key] = d[key];
            }
        }
        const formCaseChannel = this.issueOnlineService.craeteCaseChanel(setData);
        this.mainConponent.formDataAll.formCriminalContact = {};
        this.mainConponent.formDataAll.formCaseChannelCriminalContact = {};
        this.mainConponent.formDataAll.formCriminalContact = setData;
        this.mainConponent.formDataAll.formCaseChannelCriminalContact = formCaseChannel;
        console.log(this.formData, formCaseChannel);
        // this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
    }

    Back(e) {
        this.mainConponent.NextIndex(this.mainConponent.indexTab - 1);
    }

    selectChannel(type) {
        if (type === 'phone' && this.formData.CRIMINAL_TEL) {
            this.formData.CRIMINAL_TEL_PROVIDER = 'N/A';
        }
        if (type === 'sms' && this.formData.CRIMINAL_SMS) {
            this.formData.CRIMINAL_SMS_PROVIDER = 'N/A';
        }
    }

    CheckNumber(event) {
        // const seperator  = '^[ก-๏\\s]+$';
        const seperator = '^([0-9])';
        const maskSeperator = new RegExp(seperator, 'g');
        const result = maskSeperator.test(event.key);
        return result;
    }
    PasteCheckNumber(event) {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData.getData('text');
        // const seperator  = '^[ก-๏\\s]+$';
        const seperator = '^([0-9])';
        const maskSeperator = new RegExp(seperator, 'g');
        const result = maskSeperator.test(pastedText);
        return result;
    }

    PhoneNumberPattern(params) {
        const makeScope = new RegExp('^[0](?=[0-9]{9,9}$)', 'g');
        return makeScope.test(params.value);
    }

    CheckNumberBandit(event) {
        const seperator = '^([0-9+])+$';
        const maskSeperator = new RegExp(seperator, 'g');
        const result = maskSeperator.test(event.key);
        return result;
    }
    PasteCheckNumberBandit(event) {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData.getData('text');
        const seperator = '^([0-9+])+$';
        const maskSeperator = new RegExp(seperator, 'g');
        const result = maskSeperator.test(pastedText);
        return result;
    }

}
