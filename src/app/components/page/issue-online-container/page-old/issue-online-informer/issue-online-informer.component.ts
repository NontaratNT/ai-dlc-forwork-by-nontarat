import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxFormComponent, DxSelectBoxComponent } from "devextreme-angular";
import Swal from "sweetalert2";
import { IssueOnlineTabComponent } from "../issue-online-tab/issue-online-tab.component";
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

@Component({
    selector: "app-issue-online-informer",
    templateUrl: "./issue-online-informer.component.html",
    styleUrls: ["./issue-online-informer.component.scss"],
})
export class IssueOnlineInformerComponent implements OnInit {
    @ViewChild("formInformer", { static: false }) formInformer: DxFormComponent;
    @ViewChild("formInformer2", { static: false }) formInformer2: DxFormComponent;
    @ViewChild("popup_form_bank", { static: false }) formBank: DxFormComponent;
    @ViewChild("popup_form_social", { static: false }) formsocial: DxFormComponent;
    @ViewChild("selectOccupation", { static: false }) selectOccupation: DxSelectBoxComponent;
    @ViewChild("selectPresentProvice", { static: false }) selectPresentProvice: DxSelectBoxComponent;
    @ViewChild("selectPresentDistrict", { static: false }) selectPresentDistrict: DxSelectBoxComponent;
    @ViewChild("selectPresentSubDistrict", { static: false }) selectPresentSubDistrict: DxSelectBoxComponent;
    @ViewChild("selectPresentPostcode", { static: false }) selectPresentPostcode: DxSelectBoxComponent;
    @ViewChild("selectWorkProvice", { static: false }) selectWorkProvice: DxSelectBoxComponent;
    @ViewChild("selectWorkDistrict", { static: false }) selectWorkDistrict: DxSelectBoxComponent;
    @ViewChild("selectWorkSubDistrict", { static: false }) selectWorkSubDistrict: DxSelectBoxComponent;
    @ViewChild("selectWorkPostcode", { static: false }) selectWorkPostcode: DxSelectBoxComponent;
    @ViewChild("selectBankTransfer", { static: false }) selectBankTransfer: DxSelectBoxComponent;
    @ViewChild("selectBankAccount", { static: false }) selectBankAccount: DxSelectBoxComponent;
    @ViewChild("selectBankOrg", { static: false }) selectBankOrg: DxSelectBoxComponent;
    @ViewChild("selectBankStation", { static: false }) selectBankStation: DxSelectBoxComponent;
    @ViewChild("selectSocial", { static: false }) selectSocial: DxSelectBoxComponent;

    public mainConponent: IssueOnlineTabComponent;
    occupationList = [];
    presentAddress: any = {};
    workAddress: any = {};
    formDataPresent: any = {};
    formDataWork: any = {};
    province = [];
    bankFormInfo: any = {};
    bankFormPopup = false;
    listBankAccount = [
        {BANK_TRANFER:"T",BANK_TRANFER_THA:"ธนาคาร"},{BANK_TRANFER:"P",BANK_TRANFER_THA:"พร้อมเพย์"},
        {BANK_TRANFER:"C",BANK_TRANFER_THA:"Cryptocurrency"},{BANK_TRANFER:"O",BANK_TRANFER_THA:"อื่น ๆ"}
    ];
    bankInfoList = [];
    bankOrgList = [];
    bankOrgStationList = [];
    socialInfo = [];
    socialPopup = false;
    personalInfo: any = {};
    formData: any = {};
    formPopup: any = {};
    formSocialHidden = true;
    formSocialLabel = "";
    popupType = 'add';
    popupIndex = 0;
    isLoading = false;
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
        this.workAddress.disableDistrict = true;
        this.workAddress.disableSubDistrict = true;
        this.workAddress.disablepostcode = true;

    }
    setPersonalData(){
        if (this.mainConponent.formType === 'add') {
            const p = this.personalInfo;
            this.formData = {
                CASE_INFORMER_FIRSTNAME: p.PERSONAL_FNAME_THA,
                CASE_INFORMER_LASTNAME: p.PERSONAL_LNAME_THA,
                CASE_INFORMER_DATE: p.PERSONAL_BIRTH_DATE,
                OCCUPATIONS_ID: this.CheckOccupation(p.OCCUPATION_ID),
                INFORMER_EMAIL:p.PERSONAL_EMAIL,
                INFORMER_TEL:p.PERSONAL_TEL_NO,
                LOCATION:[],
                CASE_INFORMER_SOCIAL:[],
            };

        }else{
            this.formData = this.mainConponent.formDataInsert;
        }
    }
    CheckNumber(event) {
        // const seperator  = '^[ก-๏\\s]+$';
        const seperator = '^([0-9])';
        const maskSeperator =  new RegExp(seperator , 'g');
        const result =maskSeperator.test(event.key);
        return result;
    }
    PasteCheckNumber(event) {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData.getData('text');
        // const seperator  = '^[ก-๏\\s]+$';
        const seperator = '^([0-9])';
        const maskSeperator =  new RegExp(seperator , 'g');
        const result =maskSeperator.test(pastedText);
        return result;
    }
    CheckOccupation(id: number = 0){
        if (id !== 0) {
            return id;
        }
        return null;
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
    OnSelectBankTransfer(e) {
        if (e.value) {
            const data = this.selectBankTransfer.instance.option("selectedItem");
            if (data) {
                this.formData.BANK_TRANFER = data.BANK_TRANFER;
                this.formData.BANK_TRANFER_THA = data.BANK_TRANFER_THA;
            }else{
                this.formData.BANK_TRANFER = e.value;
            }
        }
    }
    // ข้อมูลที่พักอาศัยปัจจุบัน ->>>Start

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
    // ข้อมูลที่พักอาศัยปัจจุบัน ->>>End
    // สถานที่ทำงาน ->>>Start
    OnSelectProviceWork(e) {
        this.workAddress.district = [];
        this.workAddress.subDistrict = [];
        this.workAddress.postcode = [];
        if (e.value) {
            const data = this.selectWorkProvice.instance.option("selectedItem");
            this.formData.WORK_PROVINCE = data.PROVINCE_ID;
            this.formData.WORK_PROVINCE_NAME_THA = data.PROVINCE_NAME_THA;
            this.workAddress.disableDistrict = false;
            this.workAddress.disableSubDistrict = true;
            this.workAddress.disablepostcode = true;
            this.serviceProvince
                .GetDistrictofProvince(e.value)
                .subscribe((_) => (this.workAddress.district = _));
        }
    }

    OnSelectDistrictWork(e) {
        this.workAddress.subDistrict = [];
        this.workAddress.postcode = [];
        if (e.value) {
            const data = this.selectWorkDistrict.instance.option("selectedItem");
            this.formData.WORK_DISTRICT_ID = data.DISTRICT_ID;
            this.formData.WORK_DISTRICT_NAME_THA = data.DISTRICT_NAME_THA;

            this.workAddress.disableSubDistrict = false;
            this.workAddress.disablepostcode = true;
            this.serviceDistrict
                .GetSubDistrictOfDistrict(e.value)
                .subscribe((_) => (this.workAddress.subDistrict = _));
        }
    }

    OnSelectSubDistrictWork(e) {
        this.workAddress.postcode = [];
        if (e.value) {
            const data = this.selectWorkSubDistrict.instance.option("selectedItem");
            this.formData.WORK_SUB_DISTRICT_ID = data.SUB_DISTRICT_ID;
            this.formData.WORK_SUB_DISTRICT_NAME_THA = data.SUB_DISTRICT_NAME_THA;

            this.workAddress.disablepostcode = false;
            this.serviceSubDistrict
                .GetPostCode(e.value)
                .subscribe((_) => (this.workAddress.postcode = _));
        }
    }

    OnSelectPostCodeWork(e) {
        if (e.value) {
            const data = this.selectWorkPostcode.instance.option("selectedItem");
            this.formData.WORK_POSTCODE_ID = data.POSTCODE_ID;
            this.formData.WORK_POSTCODE_CODE = data.POSTCODE_CODE;
        }
    }
    // สถานที่ทำงาน ->>>End

    BankAddData(){
        this.popupType = 'add';
        this.bankFormPopup = true;
        this.formPopup = {};
        this.formPopup.BANK_TRANFER ="T";
        this.formPopup.BANK_TRANFER_THA ="ธนาคาร";
    }
    BankEditData(type, data = {} as any, index = null){
        this.isLoading = true;
        this.popupType = 'edit';
        this.bankFormPopup = true;
        this.formPopup = {};
        this.popupIndex = index;
        setTimeout(()=>{
            this.formBank.instance._refresh();
            this.formPopup = data;
            this.isLoading = false;
        }, 1000);


    }
    BankDeleteData(index = null) {
        Swal.fire({
            title: 'ยืนยันการลบไฟล์?',
            text: " ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#7d7d7d',
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'ตกลง'
        }).then((result) => {
            if (result.isConfirmed) {
                this.formData.LOCATION.splice(index, 1);
            }
        });
    }
    closeBankData(){
        this.bankFormPopup = false;
        this.formPopup = {};
        this.formBank.instance._refresh();

    }
    SaveBankData(){
        if (!this.formBank.instance.validate().isValid) {
            this.ShowInvalidDialog();
            return;
        }

        // const d = this.formPopup;
        // if (this.popupType === 'add') {
        //     this.formData.LOCATION.push({
        //         DATE_BANK_TRANFER:d.DATE_BANK_TRANFER,
        //         TIME_BANK_TRANFER:d.TIME_BANK_TRANFER,
        //         BANK_TRANFER:d.BANK_TRANFER,
        //         BANK_ID:d.BANK_ID,
        //         BRANCH_BANK_TRANFER:d.BRANCH_BANK_TRANFER,
        //         BANK_LOCATION_RESPONSIBILITY:d.BANK_LOCATION_RESPONSIBILITY,
        //         BANK_NO:d.BANK_NO
        //     });

        // }else{
        //     this.formData.LOCATION[this.popupIndex] = {
        //         DATE_BANK_TRANFER:d.DATE_BANK_TRANFER,
        //         TIME_BANK_TRANFER:d.TIME_BANK_TRANFER,
        //         BANK_TRANFER:d.BANK_TRANFER,
        //         BANK_ID:d.BANK_ID,
        //         BRANCH_BANK_TRANFER:d.BRANCH_BANK_TRANFER,
        //         BANK_LOCATION_RESPONSIBILITY:d.BANK_LOCATION_RESPONSIBILITY,
        //         BANK_NO:d.BANK_NO
        //     };

        // }
        const data = this.formPopup;
        const setData = {};
        for (const key in this.formPopup) {
            if (data[key] !== null && data[key] !== undefined) {
                setData[key] = data[key];
            }
        }
        if (this.popupType === 'add') {
            this.formData.LOCATION.push(setData);
        }else{
            this.formData.LOCATION[this.popupIndex] = setData;
        }
        this.closeBankData();

    }

    OnSelectBankAccount(e) {
        this.bankOrgList = [];
        this.bankOrgStationList = [];
        if (e.value) {
            const data = this.selectBankAccount.instance.option("selectedItem");
            if (data) {
                this.formPopup.BANK_ID = data.BANK_ID;
                this.formPopup.BANK_NAME = data.BANK_NAME;
            }else{
                this.formData.BANK_ID = e.value;
            }
            this.servBankInfo
                .GetBankOrg(e.value)
                .subscribe((_) => ( this.bankOrgList = _));

        }
    }
    OnSelectBankOrg(e) {
        this.bankOrgStationList = [];
        if (e.value) {
            const data = this.selectBankOrg.instance.option("selectedItem");
            if (data) {
                this.formPopup.BRANCH_BANK_TRANFER = data.ORGANIZE_BANK_ID;
                this.formPopup.BRANCH_BANK_TRANFER_NAME = data.ASORGANIZE_BANK_BRANCH_NAME_FULL;
            }else{
                this.formData.BRANCH_BANK_TRANFER = e.value;
            }

            this.servBankInfo
                .GetBankOrgStation(e.value)
                .subscribe((_) => this.bankOrgStationList = _);

        }
    }
    OnSelectBankStation(e) {
        if (e.value) {
            const data = this.selectBankStation.instance.option("selectedItem");
            if (data) {
                this.formPopup.BANK_LOCATION_RESPONSIBILITY = data.ORGANIZE_ID;
                this.formPopup.BANK_LOCATION_RESPONSIBILITY_NAME = data.ORGANIZE_NAME_THA;
            }else{
                this.formData.BANK_LOCATION_RESPONSIBILITY = e.value;
            }
        }
    }
    SocialPopupAddData(){
        this.formSocialHidden = true;
        this.socialPopup = true;
        this.popupType = 'add';
        this.formPopup = {
            SOCIAL_ID: 1,
            SOCIAL_NAME: "LINE",
            SOCIAL_NAME_LABEL: "ชื่อ LINE ผู้แจ้งข้อมูล",
            INFORMER_SOCIAL_NAME: null,
            SOCIAL_OTHER: null,

        };

    }

    SocialEditData(type, data = {} as any, index = null){
        this.isLoading = true;
        this.popupType = 'edit';
        this.socialPopup = true;
        this.popupIndex = index;
        this.formPopup = {};
        this.formPopup = data;


        setTimeout(()=>{
            this.formsocial.instance._refresh();
            this.formPopup = data;
            this.isLoading = false;
        }, 1000);

    }
    SocialDeleteData(index = null) {
        Swal.fire({
            title: 'ยืนยันการลบไฟล์?',
            text: " ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#7d7d7d',
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'ตกลง'
        }).then((result) => {
            if (result.isConfirmed) {
                this.formData.CASE_INFORMER_SOCIAL.splice(index, 1);
            }
        });
    }
    OnSelectSocial(e) {
        const val = e.value || 0;
        const data = this.selectSocial.instance.option("selectedItem");
        this.formPopup.SOCIAL_NAME = data.SOCIAL_NAME;

        if (val !== 5){
            this.formSocialHidden = true;
            this.formPopup.SOCIAL_NAME_LABEL = `ชื่อ ${data.SOCIAL_NAME} ผู้แจ้งข้อมูล`;

        }else{
            this.formSocialHidden = false;
            this.formPopup.SOCIAL_NAME_LABEL = "ช่องทางติดต่ออื่น ๆ";

        }

    }
    closeSocialPopup(){
        this.socialPopup = false;
        this.formPopup = {};
        this.formsocial.instance._refresh();

    }
    SaveSocialPopup(){
        if (!this.formsocial.instance.validate().isValid) {
            this.ShowInvalidDialog();
            return;
        }
        const data = this.formPopup;
        const setData = {};
        for (const key in this.formPopup) {
            if (data[key] !== null && data[key] !== undefined) {
                setData[key] = data[key];
            }
        }
        if (this.popupType === 'add') {
            this.formData.CASE_INFORMER_SOCIAL.push(setData);
        }else{
            this.formData.CASE_INFORMER_SOCIAL[this.popupIndex] = setData;
        }
        this.closeSocialPopup();

    }
    ShowInvalidDialog(){
        Swal.fire({
            title: "ผิดพลาด!",
            text: "กรุณากรอกข้อมูลให้ครบ",
            icon: "warning",
            confirmButtonText: "Ok",
        }).then(() => {});
    }
    onToolbar(e) {
        e.toolbarOptions.items.unshift(
            {
                template: "addButton",
                location: "before"
            }
        );
    }
    Back(e){
        this.mainConponent.NextIndex(this.mainConponent.indexTab -1);
    }
    SubmitForm(e) {
        // console.log('this.formData',this.formData);
        if (!this.formInformer.instance.validate().isValid || !this.formInformer2.instance.validate().isValid) {
            this.ShowInvalidDialog();
            return;
        }
        this.mainConponent.MergeObj(this.formData);
        this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
    }

}
