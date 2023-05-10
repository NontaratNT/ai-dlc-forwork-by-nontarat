import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxFormComponent, DxRadioGroupComponent, DxSelectBoxComponent } from "devextreme-angular";
import Swal from "sweetalert2";

import {
    CmsOccupationsService,
    IOcupationsInfo,
} from "src/app/services/cms-occupations.service";
import { PersonalService } from "src/app/services/personal.service";
import { ProvinceService } from "src/app/services/province.service";
import { DistrictService } from "src/app/services/district.service";
import { SubdistrictService } from "src/app/services/subdistrict.service";
import { TitleService } from "src/app/services/title.service";
import { BankInfoService } from "src/app/services/bank-info.service";
import * as moment from 'moment';
import { User } from "src/app/services/user";
import { IssueOnlineContainerComponent } from "../issue-online-container.component";
import { ConvertDateService } from "src/app/services/convert-date.service";
import { UserSettingService } from "src/app/services/user-setting.service";
import { FormValidatorService } from "src/app/services/form-validator.service";

@Component({
    selector: "app-issue-online-event",
    templateUrl: "./issue-online-event.component.html",
    styleUrls: ["./issue-online-event.component.scss"],
})
export class IssueOnlineEventComponent implements OnInit {
    @ViewChild('formEvent1', { static: false }) formEvent1: DxFormComponent;
    @ViewChild('formEvent2', { static: false }) formEvent2: DxFormComponent;
    @ViewChild('formEvent3', { static: false }) formEvent3: DxFormComponent;
    @ViewChild("selectCaseType", { static: false }) selectCaseType: DxSelectBoxComponent;
    @ViewChild("selectPresentProvice", { static: false }) selectPresentProvice: DxSelectBoxComponent;
    @ViewChild("selectPresentDistrict", { static: false }) selectPresentDistrict: DxSelectBoxComponent;
    @ViewChild("selectPresentSubDistrict", { static: false }) selectPresentSubDistrict: DxSelectBoxComponent;
    @ViewChild("selectPresentPostcode", { static: false }) selectPresentPostcode: DxSelectBoxComponent;
    public mainConponent: IssueOnlineContainerComponent;
    personalInfo: any = {};
    isLoading = false;
    occupationList = [];
    formData: any = {};
    presentAddress: any = {};
    province = [];
    bankInfoList: any = [];
    socialInfo = [];
    icons = false;
    listCaseType = [];
    gender = [
        { GENDER_TYPE: "M", GENDER_DETAIL: "ชาย" },
        { GENDER_TYPE: "F", GENDER_DETAIL: "หญิง" },
        { GENDER_TYPE: "O", GENDER_DETAIL: "อื่น ๆ" },
    ];
    formReadOnly = false;
    formValidate = true;
    formType = "add";
    loadDateBox = false;
    minBirthDate: Date;
    maxBirthDate: Date;
    formLocation: any = {};
    formLocationLoad = false;
    formLocationTranfer: any = {};
    formLocationTranferLoad = false;
    formLocationBankVictim: any = {};
    formLocationBankVictimLoad = false;
    formLocationBankVillain: any = {};
    formLocationBankVillainLoad = false;
    locationRender = 'add';
    userType = "mySelf";
    caseOpen = false;
    caseType = "";
    constructor(
        private router: Router,
        private servicePersonal: PersonalService,
        private serviceProvince: ProvinceService,
        private serviceDistrict: DistrictService,
        private serviceSubDistrict: SubdistrictService,
        private servOccupations: CmsOccupationsService,
        private serviceTitle: TitleService,
        private servBankInfo: BankInfoService,
        private _date: ConvertDateService,
        private userSetting: UserSettingService,
        private _formValidate: FormValidatorService,


    ) {

    }

    ngOnInit(): void {
        this.isLoading = true;
        this.caseOpen = false;
        this.servBankInfo.GetCaseType().subscribe((_) => {
            this.formData.CASE_TYPE_ID = null;
            this.listCaseType = _;
            const listCase = _ ?? undefined;
            const caseFirst = listCase[0] ?? undefined;
            if (caseFirst) {
                // this.formData.CASE_TYPE_ID = caseFirst.CASE_TYPE_ID;
                this.formData.CASE_TYPE_NAME = caseFirst.CASE_TYPE_NAME;
                this.caseType = caseFirst.CASE_TYPE_DESC;
                this.caseOpen = true;

            }
            this.serviceProvince.GetProvince().subscribe((res) => (this.province = res));
            this.SetDefaultData();
        });
        this.presentAddress.disableDistrict = true;
        this.presentAddress.disableSubDistrict = true;
        this.presentAddress.disablepostcode = true;


        const coll = document.getElementsByClassName("collapsible");
        let i = 0;
        for (i = 0; i < coll.length;) {
            coll[i].addEventListener("click", function() {
                this.classList.toggle("active");
                const content = this.nextElementSibling;
                if (content.style.display === "block") {
                    content.style.display = "none";
                } else {
                    content.style.display = "block";
                }
            });
            i++;
        }
    }

    onColla() {
        const coll = document.getElementsByClassName("collapsible");
        let i = 0;
        for ( i = 0; i < coll.length;) {
            coll[i].addEventListener("click", function() {
                this.classList.toggle("active");
                const content = this.nextElementSibling;
                if (content.style.display === "block") {
                    content.style.display = "none";
                } else {
                    content.style.display = "block";
                }
            });
            i++;
        }
    }
    OnSelectCaseType(e) {
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

    ShowInvalidDialog() {
        Swal.fire({
            title: "ผิดพลาด!",
            text: "กรุณากรอกข้อมูลให้ครบ",
            icon: "warning",
            confirmButtonText: "Ok",
        }).then(() => { });
    }
    setDataLocation(d) {

        this.formLocation = d;
        this.formLocationTranfer = d;
        this.formLocationBankVictim = d;
        this.formLocationBankVillain = d;

        // setTimeout(()=>{
        this.formLocationLoad = true;
        this.formLocationTranferLoad = true;
        this.formLocationBankVictimLoad = true;
        this.formLocationBankVillainLoad = true;
        // }, 500);
    }
    async SetDefaultData() {
        this.userType = this.mainConponent.userType;
        this.bankInfoList = await this.servBankInfo.GetBankInfo().toPromise();
        this.formLocation = {};
        this.formLocationTranfer = {};
        this.formLocationBankVictim = {};
        this.formLocationBankVillain = {};
        if (this.mainConponent.formType === 'add') {
            this.locationRender = 'add';
            this.formType = "add";
            this.formReadOnly = false;
            this.formValidate = true;
            this.formLocationLoad = true;
            this.formLocationTranferLoad = true;
            this.formLocationBankVictimLoad = true;
            this.formLocationBankVillainLoad = true;
            // this.formData.CASE_LOCATION_DATE = this._date.SetDateDefault(0);

        } else {
            const dataForm = this.mainConponent.formDataInsert;
            this.formType = "edit";
            this.formReadOnly = true;
            this.formValidate = false;
            this.formData = dataForm;
            this.userType = this.formData.CASE_SELF_TYPE === 'Y' ? 'mySelf' : 'other';
            this.locationRender = 'view';
            this.setDataLocation(dataForm);
            // this.formData.CASE_LOCATION_DATE = this._date.ConvertToDateFormat(this.formData.CASE_LOCATION_DATE);
        }
        // this.minBirthDate = this._date.SetDateDefault(10,true);
        // this.maxBirthDate = this._date.SetDateDefault(0);
        // console.log('this.maxBirthDate',this.maxBirthDate);
        // this.loadDateBox = true;
        this.isLoading = false;

    }
    ChangeRadioGender(e) {
        if (e.value) {
            const d: any = this.gender.filter(r => r.GENDER_TYPE === e.value);
            // console.log('d', d);
            this.formData.INFORMER_GENDER = `${d.GENDER_TYPE}`;
            this.formData.INFORMER_GENDER_DETAIL = `${d.INFORMER_GENDER_DETAIL}`;
        }
    }

    OnSelectProvicePresent(e) {
        this.presentAddress.district = [];
        this.presentAddress.subDistrict = [];
        this.presentAddress.postcode = [];
        // console.log('e.value', e.value);
        if (e.value) {
            const data = this.selectPresentProvice.instance.option("selectedItem");
            if (data) {
                this.formData.CASE_LOCATION_PROVINCE = data.PROVINCE_ID;
                this.formData.CASE_LOCATION_PROVINCE_NAME_THA = data.PROVINCE_NAME_THA;
            } else {
                this.formData.CASE_LOCATION_PROVINCE = e.value;
            }

            this.presentAddress.disableDistrict = false;
            this.presentAddress.disableSubDistrict = true;
            this.presentAddress.disablepostcode = true;
            this.serviceProvince
                .GetDistrictofProvince(e.value)
                .subscribe((_) => (this.presentAddress.district = _));
        }
    }
    OnSelectDistrictPresent(e) {
        this.presentAddress.subDistrict = [];
        this.presentAddress.postcode = [];
        if (e.value) {
            const data = this.selectPresentDistrict.instance.option("selectedItem");
            if (data) {
                this.formData.CASE_LOCATION_DISTRICT_ID = data.DISTRICT_ID;
                this.formData.CASE_LOCATION_DISTRICT_NAME_THA = data.DISTRICT_NAME_THA;
            } else {
                this.formData.CASE_LOCATION_DISTRICT_ID = e.value;
            }


            this.presentAddress.disableSubDistrict = false;
            this.presentAddress.disablepostcode = true;
            this.serviceDistrict
                .GetSubDistrictOfDistrict(e.value)
                .subscribe((_) => (this.presentAddress.subDistrict = _));
        }
    }

    OnSelectSubDistrictPresent(e) {
        this.presentAddress.postcode = [];
        if (e.value) {
            const data = this.selectPresentSubDistrict.instance.option("selectedItem");
            if (data) {
                this.formData.CASE_LOCATION_SUB_DISTRICT_ID = data.SUB_DISTRICT_ID;
                this.formData.CASE_LOCATION_SUB_DISTRICT_NAME_THA = data.SUB_DISTRICT_NAME_THA;
            } else {
                this.formData.CASE_LOCATION_SUB_DISTRICT_ID = e.value;
            }


            this.presentAddress.disablepostcode = false;
            this.serviceSubDistrict
                .GetPostCode(e.value)
                .subscribe((_) => (this.presentAddress.postcode = _));
        }
    }

    OnSelectPostCodePresent(e) {
        if (e.value) {
            const data = this.selectPresentPostcode.instance.option("selectedItem");
            if (data) {
                this.formData.CASE_LOCATION_POSTCODE_ID = data.POSTCODE_ID;
                this.formData.CASE_LOCATION_POSTCODE_CODE = data.POSTCODE_CODE;
            } else {
                this.formData.CASE_LOCATION_POSTCODE_ID = e.value;
            }

        }
    }
    async ReplaceKeyLocation(keyAddText, data) {
        const setData = {};
        const d = data;
        for (const key in d) {
            if (d[key] !== null && d[key] !== undefined) {
                setData[`${keyAddText}_${key}`] = d[key];
            }
        }
        return setData;
    }
    Back(e) {
        this.mainConponent.NextIndex(this.mainConponent.indexTab - 1);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.mainConponent.numCount = this.mainConponent.indexTab - 1;
        this.userSetting.userSetting.tabIndex = this.mainConponent.numCount;
    }
    async SubmitForm(e) {
        if (this.mainConponent.formType === 'add') {

            // if (!this.formEvent1.instance.validate().isValid) {
            //     this.ShowInvalidDialog();
            //     return;
            // }
            this.formEvent1.instance.validate();
            if (!this.formEvent1.instance.validate().isValid){
                this._formValidate.ValidateForm(this.formEvent1.instance.validate().brokenRules);
                return;
            }
            this.mainConponent.formDataAll.formEvent = {};
            const dataLocation = await this.ReplaceKeyLocation('CASE_LOCATION', this.formLocation);
            const dataLocationTranfer = await this.ReplaceKeyLocation('CASE_LOCATION_TRANSFER', this.formLocationTranfer);
            const dataLocationBankVictim = await this.ReplaceKeyLocation('CASE_LOCATION_BANK_VICTIM', this.formLocationBankVictim);
            const dataLocationBankVillain = await this.ReplaceKeyLocation('CASE_LOCATION_BANK_VILLAIN', this.formLocationBankVillain);
            const setDataFormAll = Object.assign(
                {}, this.formData, dataLocation, dataLocationTranfer,
                dataLocationBankVictim, dataLocationBankVillain
            );

            this.mainConponent.formDataAll.formEvent = setDataFormAll;

        }
        this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
        this.mainConponent.numCount = this.mainConponent.indexTab + 1;
        this.userSetting.userSetting.tabIndex = this.mainConponent.numCount;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

}
