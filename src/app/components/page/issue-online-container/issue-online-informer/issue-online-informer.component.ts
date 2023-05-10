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

@Component({
    selector: "app-issue-online-informer",
    templateUrl: "./issue-online-informer.component.html",
    styleUrls: ["./issue-online-informer.component.scss"],
})
export class IssueOnlineInformerComponent implements OnInit {
    @ViewChild("selectOccupation", { static: false }) selectOccupation: DxSelectBoxComponent;
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
    bankInfoList = [];
    socialInfo = [];
    gender = [
        { GENDER_TYPE: "M", GENDER_DETAIL: "ชาย" },
        { GENDER_TYPE: "F", GENDER_DETAIL: "หญิง" },
        { GENDER_TYPE: "O", GENDER_DETAIL: "อื่น ๆ" },
    ];

    constructor(
        private router: Router,
        private servicePersonal: PersonalService,
        private serviceProvince: ProvinceService,
        private serviceDistrict: DistrictService,
        private serviceSubDistrict: SubdistrictService,
        private servOccupations: CmsOccupationsService,
        private serviceTitle: TitleService,
        private servBankInfo: BankInfoService,
    ) {

    }

    ngOnInit(): void {
        const userId = User.Current.PersonalId;
        this.servicePersonal
            .GetPersonalById(userId)
            .subscribe((_) => {
                this.personalInfo = _;
                this.setPersonalData();

                this.servOccupations
                    .getOccupations()
                    .subscribe((res) => {
                        this.occupationList = res;
                        const d = this.occupationList[0] ?? null;
                        this.formData.OCCUPATIONS_ID = d.OCCUPATIONS_ID;
                    });
            });


        this.serviceProvince
            .GetProvince()
            .subscribe((_) => (this.province = _));
        this.servBankInfo
            .GetBankInfo()
            .subscribe((_) => (this.bankInfoList = _));
        this.servBankInfo
            .GetSocialInfo()
            .subscribe((_) => (this.socialInfo = _));
        this.presentAddress.disableDistrict = true;
        this.presentAddress.disableSubDistrict = true;
        this.presentAddress.disablepostcode = true;
    }
    CheckOccupation(id: number = 0){
        if (id !== 0) {
            return id;
        }
        return null;
    }

    ShowInvalidDialog(){
        Swal.fire({
            title: "ผิดพลาด!",
            text: "กรุณากรอกข้อมูลให้ครบ",
            icon: "warning",
            confirmButtonText: "Ok",
        }).then(() => {});
    }
    setPersonalData(){
        if (this.mainConponent.formType === 'add') {
            const p = this.personalInfo;
            this.formData = {
                CASE_INFORMER_FIRSTNAME: p.PERSONAL_FNAME_THA,
                CASE_INFORMER_LASTNAME: p.PERSONAL_LNAME_THA,
                CASE_INFORMER_DATE: p.PERSONAL_BIRTH_DATE,
                OCCUPATIONS_ID: this.CheckOccupation(p.OCCUPATION_ID),
                INFORMER_GENDER:`${this.gender[0].GENDER_TYPE}`,
                INFORMER_EMAIL:p.PERSONAL_EMAIL,
                INFORMER_TEL:p.PERSONAL_TEL_NO,
                LOCATION:[],
                CASE_INFORMER_SOCIAL:[],
            };

        }else{
            this.formData = this.mainConponent.formDataInsert;
        }
    }
    ChangeRadioGender(e){
        if (e.value) {
            const d: any = this.gender.filter(r => r.GENDER_TYPE === e.value);
            // console.log('d',d);
            this.formData.INFORMER_GENDER = `${d.GENDER_TYPE}`;
            this.formData.INFORMER_GENDER_DETAIL = `${d.INFORMER_GENDER_DETAIL}`;
        }
    }
    OnSelectOccupation(e) {
        if (e.value) {
            const data = this.selectOccupation.instance.option("selectedItem");
            if (data) {
                this.formData.OCCUPATIONS_ID = data.OCCUPATIONS_ID;
                this.formData.OCCUPATIONS_NAME = data.OCCUPATIONS_NAME;
            }else{
                this.formData.OCCUPATIONS_ID = e.value;

            }

        }
    }
    OnSelectProvicePresent(e) {
        this.presentAddress.district = [];
        this.presentAddress.subDistrict = [];
        this.presentAddress.postcode = [];
        if (e.value) {
            const data = this.selectPresentProvice.instance.option("selectedItem");
            if (data) {
                this.formData.INFORMER_PROVINCE = data.PROVINCE_ID;
                this.formData.INFORMER_PROVINCE_NAME_THA = data.PROVINCE_NAME_THA;
            }else{
                this.formData.INFORMER_PROVINCE = e.value;
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
                this.formData.INFORMER_DISTRICT_ID = data.DISTRICT_ID;
                this.formData.INFORMER_DISTRICT_NAME_THA = data.DISTRICT_NAME_THA;
            }else{
                this.formData.INFORMER_DISTRICT_ID = e.value;
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
                this.formData.INFORMER_SUB_DISTRICT_ID = data.SUB_DISTRICT_ID;
                this.formData.INFORMER_SUB_DISTRICT_NAME_THA = data.SUB_DISTRICT_NAME_THA;
            }else{
                this.formData.INFORMER_SUB_DISTRICT_ID = e.value;
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
                this.formData.INFORMER_POSTCODE_ID = data.POSTCODE_ID;
                this.formData.INFORMER_POSTCODE_CODE = data.POSTCODE_CODE;
            }else{
                this.formData.INFORMER_POSTCODE_ID = e.value;
            }

        }
    }
    Back(e){
        this.mainConponent.NextIndex(this.mainConponent.indexTab -1);
    }
    SubmitForm(e) {
        // console.log('this.formData',this.formData);
        // if (!this.formInformer.instance.validate().isValid || !this.formInformer2.instance.validate().isValid) {
        //     this.ShowInvalidDialog();
        //     return;
        // }
        // this.mainConponent.MergeObj(this.formData);
        // this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
    }

}
