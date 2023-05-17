/* eslint-disable @typescript-eslint/dot-notation */
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
import { PersonalRelationService } from "src/app/services/personal-relation.service";
import { ConvertDateService } from "src/app/services/convert-date.service";
import { UserSettingService } from "src/app/services/user-setting.service";
import { FormValidatorService } from "src/app/services/form-validator.service";
import { IOrganizeInfo, IOrgmaparea, OrgService } from "src/app/services/org.service";

@Component({
    selector: "app-issue-online-informer",
    templateUrl: "./issue-online-informer.component.html",
    styleUrls: ["./issue-online-informer.component.scss"],
})
export class IssueOnlineInformerComponent implements OnInit {
    @ViewChild('formInformer1', { static: false }) formInformer1: DxFormComponent;
    @ViewChild('formInformer2', { static: false }) formInformer2: DxFormComponent;
    @ViewChild('formInformer3', { static: false }) formInformer3: DxFormComponent;
    @ViewChild('formInformer4', { static: false }) formInformer4: DxFormComponent;
    @ViewChild('formInformerOther', { static: false }) formInformerOther: DxFormComponent;
    @ViewChild("selectPersonalRelantion", { static: false }) selectPersonalRelantion: DxSelectBoxComponent;
    @ViewChild('formInformer2address', { static: false }) formInformer2address: DxFormComponent;

    @ViewChild("selectOccupation", { static: false }) selectOccupation: DxSelectBoxComponent;
    @ViewChild("selectPresentProvice", { static: false }) selectPresentProvice: DxSelectBoxComponent;
    @ViewChild("selectPresentDistrict", { static: false }) selectPresentDistrict: DxSelectBoxComponent;
    @ViewChild("selectPresentSubDistrict", { static: false }) selectPresentSubDistrict: DxSelectBoxComponent;
    @ViewChild("selectPresentPostcode", { static: false }) selectPresentPostcode: DxSelectBoxComponent;
    @ViewChild('formInformertype1', { static: false }) formInformertype1: DxFormComponent;
    @ViewChild('formInformertype2', { static: false }) formInformertype2: DxFormComponent;
    @ViewChild('formInformertype3', { static: false }) formInformertype3: DxFormComponent;
    @ViewChild("selectorgcenter", { static: false }) selectorgcenter: DxSelectBoxComponent;
    @ViewChild("selectorgwalkin", { static: false }) selectorgwalkin: DxSelectBoxComponent;
    @ViewChild("selectorgmain", { static: false }) selectorgmain: DxSelectBoxComponent;
    @ViewChild("selectPresentProvicelocation", { static: false }) selectPresentProvicelocation: DxSelectBoxComponent;
    @ViewChild("selectProvicemaparea", { static: false }) selectProvicemaparea: DxSelectBoxComponent;
    @ViewChild("selectcardProvice", { static: false }) selectcardProvice: DxSelectBoxComponent;
    @ViewChild("selectCardDistrict", { static: false }) selectCardDistrict: DxSelectBoxComponent;
    @ViewChild("selectCardSubDistrict", { static: false }) selectCardSubDistrict: DxSelectBoxComponent;
    @ViewChild("selectBankInfo", { static: false }) selectBankInfo: DxSelectBoxComponent;

    public mainConponent: IssueOnlineContainerComponent;
    loadDateBox = false;
    minBirthDate: Date;
    maxBirthDate: Date;
    personalInfo: any = {};
    isLoading = false;
    occupationList = [];
    formData: any = {};
    presentAddress: any = {};
    province = [];
    bankInfoList = [];
    socialInfo = [];
    personalRelantion = [];
    isWalkIn = 1;
    gender = [
        { GENDER_TYPE: "M", GENDER_DETAIL: "ชาย" },
        { GENDER_TYPE: "F", GENDER_DETAIL: "หญิง" },
        { GENDER_TYPE: "O", GENDER_DETAIL: "อื่น ๆ" },
    ];
    walkInType = [
        {ID:1,TEXT:"ยังไม่ได้เข้าไปยังสถานีตำรวจ"},
        {ID:2,TEXT:"เข้าไปยังสถานีตำรวจแล้ว"},
    ];
    datasource = [
        {ID:1,TEXT:"โทร.1441"},
        {ID:2,TEXT:"โทร.081-866-3000"},
        {ID:3,TEXT:"สถานีตำรวจ (Walk in)"},
        {ID:4,TEXT:"อื่นๆ"},
    ];
    checkedRadioGender = null;
    userType = "mySelf";
    formType = "add";
    formReadOnly = false;
    formValidate = true;
    checkboxlocationreadonly: any = {};

    formdataOrgsendcase: any = {

        ORG_LOCATION_TYPE: null,
        ORG_LOCATION_ID: null,
        ORG_LOCATION_NAME: "",
        ORG_PROVINCE_ID: null,
        ORG_PROVICE_NAME: "",
        ORG_LOCATION_MAIN_ID1: null,
        ORG_LOCATION_MAIN_NAME1: "",
        ORG_LOCATION_MAIN_ID2: null,
        ORG_LOCATION_MAIN_NAME2: "",
        ORG_LOCATION_MAIN_ID3: null,
        ORG_LOCATION_MAIN_NAME3: "",
        ORG_LOCATION_MAIN_ID4: null,
        ORG_LOCATION_MAIN_NAME4: "",
        ORG_LOCATION_MAIN_ID5: null,
        ORG_LOCATION_MAIN_NAME5: "",
        ORG_LOCATION_CENTER_ID: null,
        ORG_LOCATION_CENTER_NAME: ""


    };
    checkboxLocation: any = {};
    orgtype2_1 = [
        { org_id: 3536, org_name: "กองบังคับการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี 1 กองบัญชาการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี  (บก.สอท.1)" },
      ];
      orgtype2_2 = [
        { org_id: 3548, org_name: "กองบังคับการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี 2 กองบัญชาการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี  (บก.สอท.2)" },
      ];
      orgtype2_3 = [
        { org_id: 3559, org_name: "กองบังคับการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี 3 กองบัญชาการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี  (บก.สอท.3)" },
      ];
      orgtype2_4 = [
        { org_id: 3567, org_name: "กองบังคับการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี 4 กองบัญชาการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี  (บก.สอท.4)" },
      ];
      orgtype2_5 = [
        { org_id: 3578, org_name: "กองบังคับการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี 5 กองบัญชาการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี  (บก.สอท.5)" }
      ];
      orgtype3 = [
        { org_id: 2541, org_name: "กองบังคับการปราบปรามการกระทำความผิดเกี่ยวกับอาชญากรรมทางเศรษฐกิจ                          (บก.ปอศ.)" },
        { org_id: 2397, org_name: "กองบังคับการปราบปรามการกระทำความผิดเกี่ยวกับการคุ้มครองผู้บริโภค                              (บก.ปคบ.)" },
        { org_id: 2614, org_name: "กองบังคับการปราบปรามการกระทำผิดเกี่ยวกับอาชญากรรมทางเทคโนโลยี กองบัญชาการตำรวจสอบสวนกลาง  (บก.ปอท.)" },
        { org_id: 2605, org_name: "กองบังคับการปราบปรามการกระทำความเกี่ยวกับการค้ามนุษย์                                      (บก.ปคม.)" },

      ];
     aria1and2 = [
        'ตำรวจภูธรภาค 1 (ชัยนาท,นนทบุรี,ปทุมธานี,พระนครศรีอยุธยา,ลพบุรี,สมุทรปราการ,สระบุรี,สิงห์บุรี,อ่างทอง)',
        'ตำรวจภูธรภาค 2 (จันทบุรี,ฉะเชิงเทรา,ชลบุรี,ตราด,นครนายก,ปราจีนบุรี,ระยอง,สระแก้ว)',
        'ตำรวจภูธรภาค 7 (กาญจนบุรี,นครปฐม,ประจวบคีรีขันธ์,เพชรบุรี,ราชบุรี,สมุทรสงคราม,สมุทรสาคร,สุพรรณบุรี)'
    ]
    //  aria1and2 = [
    //     'ตำรวจภูธรภาค 1 (ชัยนาท)',	
    //     'ตำรวจภูธรภาค 1 (นนทบุรี)',	
    //     'ตำรวจภูธรภาค 1 (ปทุมธานี)',	
    //     'ตำรวจภูธรภาค 1 (พระนครศรีอยุธยา)',	
    //     'ตำรวจภูธรภาค 1 (ลพบุรี)',
    //     'ตำรวจภูธรภาค 1 (สมุทรปราการ)',	
    //     'ตำรวจภูธรภาค 1 (สระบุรี)',	
    //     'ตำรวจภูธรภาค 1 (สิงห์บุรี)',	
    //     'ตำรวจภูธรภาค 1 (อ่างทอง)',	
    //     'ตำรวจภูธรภาค 2 (จันทบุรี)',	
    //     'ตำรวจภูธรภาค 2 (ฉะเชิงเทรา)',	
    //     'ตำรวจภูธรภาค 2 (ชลบุรี)',	
    //     'ตำรวจภูธรภาค 2 (ตราด)',	
    //     'ตำรวจภูธรภาค 2 (นครนายก)',	
    //     'ตำรวจภูธรภาค 2 (ปราจีนบุรี)',	
    //     'ตำรวจภูธรภาค 2 (ระยอง)',	
    //     'ตำรวจภูธรภาค 2 (สระแก้ว)',	
    //     'ตำรวจภูธรภาค 7 (กาญจนบุรี)',
    //     'ตำรวจภูธรภาค 7 (นครปฐม)',
    //     'ตำรวจภูธรภาค 7 (ประจวบคีรีขันธ์)',
    //     'ตำรวจภูธรภาค 7 (เพชรบุรี)',
    //     'ตำรวจภูธรภาค 7 (ราชบุรี)',
    //     'ตำรวจภูธรภาค 7 (สมุทรสงคราม)',
    //     'ตำรวจภูธรภาค 7 (สมุทรสาคร)',
    //     'ตำรวจภูธรภาค 7 (สุพรรณบุรี)'

    
    //  ]
    aria3and4 = [
        'ตำรวจภูธรภาค 3 (ชัยภูมิ,นครราชสีมา,บุรีรัมย์,ยโสธร,ศรีสะเกษ,สุรินทร์,อำนาจเจริญ,อุบลราชธานี)',
        'ตำรวจภูธรภาค 4 (กาฬสินธุ์,ขอนแก่น,นครพนม,บึงกาฬ,มหาสารคาม,มุกดาหาร,ร้อยเอ็ด,เลย,สกลนคร,หนองคาย,หนองบัวลำภู,อุดรธานี)'
    ]
//      aria3and4 = [
//         'ตำรวจภูธรภาค 3 (ชัยภูมิ)',
// 'ตำรวจภูธรภาค 3 (นครราชสีมา)',
// 'ตำรวจภูธรภาค 3 (บุรีรัมย์)',
// 'ตำรวจภูธรภาค 3 (ยโสธร)',
// 'ตำรวจภูธรภาค 3 (ศรีสะเกษ)',
// 'ตำรวจภูธรภาค 3 (สุรินทร์)',
// 'ตำรวจภูธรภาค 3 (อำนาจเจริญ)',
// 'ตำรวจภูธรภาค 3 (อุบลราชธานี)',
// 'ตำรวจภูธรภาค 4 (กาฬสินธุ์)',
// 'ตำรวจภูธรภาค 4 (ขอนแก่น)',
// 'ตำรวจภูธรภาค 4 (นครพนม)',
// 'ตำรวจภูธรภาค 4 (บึงกาฬ)',
// 'ตำรวจภูธรภาค 4 (มหาสารคาม)',
// 'ตำรวจภูธรภาค 4 (มุกดาหาร)',
// 'ตำรวจภูธรภาค 4 (ร้อยเอ็ด)',
// 'ตำรวจภูธรภาค 4 (เลย)',
// 'ตำรวจภูธรภาค 4 (สกลนคร)',
// 'ตำรวจภูธรภาค 4 (หนองคาย)',
// 'ตำรวจภูธรภาค 4 (หนองบัวลำภู)',
// 'ตำรวจภูธรภาค 4 (อุดรธานี)'

//      ]
aria5and6=[
    'ตำรวจภูธรภาค 5 (เชียงใหม่,น่าน,พะเยา,แพร่,แม่ฮ่องสอน,ลำปาง,ลำพูน)',
    'ตำรวจภูธรภาค 6 (กำแพงเพชร,ตาก,นครสวรรค์,พิจิตร,พิษณุโลก,เพชรบูรณ์,สุโขทัย,อุตรดิตถ์,อุทัยธานี)'
]
//      aria5and6 = [
//         'ตำรวจภูธรภาค 5 (เชียงใหม่)',
// 'ตำรวจภูธรภาค 5 (น่าน)',
// 'ตำรวจภูธรภาค 5 (พะเยา)',
// 'ตำรวจภูธรภาค 5 (แพร่)',
// 'ตำรวจภูธรภาค 5 (แม่ฮ่องสอน)',
// 'ตำรวจภูธรภาค 5 (ลำปาง)',
// 'ตำรวจภูธรภาค 5 (ลำพูน)',
// 'ตำรวจภูธรภาค 6 (กำแพงเพชร)',
// 'ตำรวจภูธรภาค 6 (ตาก)',
// 'ตำรวจภูธรภาค 6 (นครสวรรค์)',
// 'ตำรวจภูธรภาค 6 (พิจิตร)',
// 'ตำรวจภูธรภาค 6 (พิษณุโลก)',
// 'ตำรวจภูธรภาค 6 (เพชรบูรณ์)',
// 'ตำรวจภูธรภาค 6 (สุโขทัย)',
// 'ตำรวจภูธรภาค 6 (อุตรดิตถ์)',
// 'ตำรวจภูธรภาค 6 (อุทัยธานี)'

//      ]
aria8and9 = [
    'ตำรวจภูธรภาค 8 (กระบี่,ชุมพร,นครศรีธรรมราช,พังงา,ภูเก็ต,ระนอง,สุราษฎร์ธานี)',
    'ตำรวจภูธรภาค 9 (ตรัง,นราธิวาส,ปัตตานี,พัทลุง,ยะลา,สงขลา,สตูล)'
]
// aria8and9 = [
//     'ตำรวจภูธรภาค 8 (กระบี่)',
//     'ตำรวจภูธรภาค 8 (ชุมพร)',
//     'ตำรวจภูธรภาค 8 (นครศรีธรรมราช)',
//     'ตำรวจภูธรภาค 8 (พังงา)',
//     'ตำรวจภูธรภาค 8 (ภูเก็ต)',
//     'ตำรวจภูธรภาค 8 (ระนอง)',
//     'ตำรวจภูธรภาค 8 (สุราษฎร์ธานี)',
//     'ตำรวจภูธรภาค 9 (ตรัง)',
//     'ตำรวจภูธรภาค 9 (นราธิวาส)',
//     'ตำรวจภูธรภาค 9 (ปัตตานี)',
//     'ตำรวจภูธรภาค 9 (พัทลุง)',
//     'ตำรวจภูธรภาค 9 (ยะลา)',
//     'ตำรวจภูธรภาค 9 (สงขลา)',
//     'ตำรวจภูธรภาค 9 (สตูล)',

// ]

dsorgbyaria:IOrganizeInfo[];
    dsorgbyarialocation:IOrganizeInfo[];
    dswalkinstatuspolice: IOrganizeInfo[];
    dsorgarea: IOrgmaparea[];

    cmstitle = [
        { TITLE_ID: "นาย", TITLE_NAME: "นาย" },
        { TITLE_ID: "นาง", TITLE_NAME: "นาง" },
        { TITLE_ID: "นางสาว", TITLE_NAME: "นางสาว" },
        { TITLE_ID: "อื่นๆ", TITLE_NAME: "อื่นๆ" },

    ];
    checkothertitle = false;
    cardAddress: any = {};
    checkboxaddresscard = false;
    promote = [
        {ID:"ใช่",TEXT:"ใช่"},
        {ID:"ไม่ใช่",TEXT:"ไม่ใช่"},
    ];
    popupFormData: any = {};
    formbanklistarray: any = {};
    personalbanklist = [];
    indexcheckdeletebanklist: any;
    popup = false;
    checktypeeditbanklist = "add";
    constructor(
        private router: Router,
        private servicePersonal: PersonalService,
        private serviceProvince: ProvinceService,
        private serviceDistrict: DistrictService,
        private serviceSubDistrict: SubdistrictService,
        private servOccupations: CmsOccupationsService,
        private serviceTitle: TitleService,
        private servBankInfo: BankInfoService,
        private serePersonalRelation: PersonalRelationService,
        private _date: ConvertDateService,
        private userSetting: UserSettingService,
        private _formValidate: FormValidatorService,
        private _OrgService: OrgService
    ) {
        this.dsorgbyaria = {} as any;
        this.dsorgbyarialocation = {} as any;
        this.dswalkinstatuspolice = {} as any;
    }

    ngOnInit(): void {
        if (this.userSetting.userSetting.tabIndex && this.formReadOnly === true) {
            this.mainConponent.numCount = this.userSetting.userSetting.tabIndex;

        }
        this.isLoading = true;
        this.presentAddress.disableDistrict = true;
        this.presentAddress.disableSubDistrict = true;
        this.presentAddress.disablepostcode = true;
        const userId = User.Current.PersonalId;
        this.servicePersonal
            .GetPersonalById(userId)
            .subscribe((_) => {

                this.personalInfo = _;
                this.setPersonalData();

                this.servOccupations
                    .getOccupations()
                    .subscribe((resOcc) => {
                        this.occupationList = resOcc;
                    });
                // this.serviceProvince
                //     .GetProvince()
                //     .subscribe((resprovince) => {
                //         this.province = resprovince;
                //         // console.log('province', this.province);
                //     });
                // this.servBankInfo
                //     .GetBankInfo()
                //     .subscribe((resBank) => (this.bankInfoList = resBank));
                // this.servBankInfo
                //     .GetSocialInfo()
                //     .subscribe((resSocial) => (this.socialInfo = resSocial));
            });


            this.DefaultCheckbox();

        // this.isLoading = false;

    }

    OnSelectBankAccount(e) {
        if (e.value) {
            const data = this.selectBankInfo.instance.option("selectedItem");
            if (data) {
                this.formbanklistarray.PERSONAL_BANK_ID = data.BANK_ID;
                this.formbanklistarray.PERSONAL_BANK_NAME = data.BANK_NAME;
            } else {
                this.formbanklistarray.PERSONAL_BANK_ID = e.value;
            }
        }
    }
    BankNumberPattern(params) {
        const makeScopeIden = new RegExp("^([0-9]{10,15})", "g");
        return makeScopeIden.test(params.value);
    }

    additemlistbank(){
        this.checktypeeditbanklist = "add";

        this.popup = true;
        this.formbanklistarray = {};
    }
    ItemDamageClose(){
        this.popup = false;
    }
    ItemDamageSave(){
        this.popup = false;
        if(this.checktypeeditbanklist == "add"){
            this.personalbanklist.push({PERSONAL_BANK_ID: this.formbanklistarray.PERSONAL_BANK_ID ,PERSONAL_BANK_NAME:this.formbanklistarray.PERSONAL_BANK_NAME,PERSONAL_ACCOUNT_ID: this.formbanklistarray.PERSONAL_ACCOUNT_ID});
            this.popupFormData =  this.personalbanklist;
            this.formData.Bank_personal_list = this.personalbanklist;
        }else{
            this.popupFormData[this.indexcheckdeletebanklist].PERSONAL_BANK_ID = this.formbanklistarray.PERSONAL_BANK_ID;
            this.popupFormData[this.indexcheckdeletebanklist].PERSONAL_BANK_NAME = this.formbanklistarray.PERSONAL_BANK_NAME;
            this.popupFormData[this.indexcheckdeletebanklist].PERSONAL_ACCOUNT_ID = this.formbanklistarray.PERSONAL_ACCOUNT_ID;
        }
 
    }

    Editlistbank(rowindex,data){
        this.popup = true;
        this.checktypeeditbanklist = "Edit";
        this.formbanklistarray.PERSONAL_ACCOUNT_ID = data.PERSONAL_ACCOUNT_ID;
        this.formbanklistarray.PERSONAL_BANK_ID = data.PERSONAL_BANK_ID;
        this.indexcheckdeletebanklist = rowindex;
    }

    Deletelistbank(rowindex){
        this.personalbanklist.splice(rowindex, 1);


         this.popupFormData = this.personalbanklist;
    }
    PromoteChange(e) {
        if (e.value) {
            this.formData.IS_PROMOTE_RADIO = e.value;
        }
    }
    onvaluecheckaddresscard(e){
        if(e.value){
            this.formData.CASE_INFORMER_ADDRESS_NO = this.formData.CASE_INFORMER_CARD_ADDRESS_NO;
            this.formData.INFORMER_PROVINCE = this.formData.INFORMER_CARD_PROVINCE;

            
            this.serviceProvince
                .GetDistrictofProvince(this.formData.INFORMER_CARD_PROVINCE)
                .subscribe((_) => {
                    this.presentAddress.district = _;
                    this.presentAddress.disableDistrict = false;

                    this.formData.INFORMER_DISTRICT_ID = this.formData.INFORMER_CARD_DISTRICT_ID;
                });
            
                setTimeout(() => {
                    this.serviceDistrict
                    .GetSubDistrictOfDistrict(this.formData.INFORMER_CARD_DISTRICT_ID)
                    .subscribe((_) => {
                        this.presentAddress.subDistrict = _;
                        this.presentAddress.disableSubDistrict = false;
                        this.formData.INFORMER_SUB_DISTRICT_ID = this.formData.INFORMER_CARD_SUB_DISTRICT_ID;
                    });
                }, 500);
               
           


            
        }
    }

    OnSelectcardProvicePresent(e) {
        this.cardAddress.district = [];
        this.cardAddress.subDistrict = [];
        this.cardAddress.postcode = [];
        this.cardAddress.disableDistrict = true;
        this.cardAddress.disablepostcode = true;
        this.cardAddress.disableSubDistrict = true;
        this.formData.INFORMER_CARD_DISTRICT_ID = undefined;
        this.formData.INFORMER_CARD_DISTRICT_NAME_THA = undefined;
        if (e.value) {
            const data = this.selectcardProvice.instance.option("selectedItem");
            if (data) {
                this.formData.INFORMER_CARD_PROVINCE = data.PROVINCE_ID;
                this.formData.INFORMER_CARD_PROVINCE_NAME_THA = data.PROVINCE_NAME_THA;
            }else{
                this.formData.INFORMER_CARD_PROVINCE = e.value;
            }



            this.serviceProvince
                .GetDistrictofProvince(e.value)
                .subscribe((_) => {
                    this.cardAddress.district = _;
                    this.cardAddress.disableDistrict = false;
                });


        }
    }


    OnSelectDistrictCard(e) {
        this.cardAddress.subDistrict = [];
        this.cardAddress.postcode = [];
        this.cardAddress.disableSubDistrict = true;
        this.cardAddress.disablepostcode = true;
        this.formData.INFORMER_CARD_SUB_DISTRICT_ID = undefined;
        this.formData.INFORMER_CARD_SUB_DISTRICT_NAME_THA = undefined;
        if (e.value) {
            const data = this.selectCardDistrict.instance.option("selectedItem");
            if (data) {
                this.formData.INFORMER_CARD_DISTRICT_ID = data.DISTRICT_ID;
                this.formData.INFORMER_CARD_DISTRICT_NAME_THA = data.DISTRICT_NAME_THA;
            }else{
                this.formData.INFORMER_CARD_DISTRICT_ID = e.value;
            }


            this.serviceDistrict
                .GetSubDistrictOfDistrict(e.value)
                .subscribe((_) => {
                    this.cardAddress.subDistrict = _;
                    this.cardAddress.disableSubDistrict = false;
                });
        }
    }
    OnSelectSubDistrictCard(e) {
        this.cardAddress.postcode = [];
        this.cardAddress.disablepostcode = true;


        if (e.value) {
            const data = this.selectCardSubDistrict.instance.option("selectedItem");
            if (data) {
                this.formData.INFORMER_CARD_SUB_DISTRICT_ID = data.SUB_DISTRICT_ID;
                this.formData.INFORMER_CARD_SUB_DISTRICT_NAME_THA = data.SUB_DISTRICT_NAME_THA;
            }else{
                this.formData.INFORMER_CARD_SUB_DISTRICT_ID = e.value;
            }


            this.serviceSubDistrict
                .GetPostCode(e.value)
                .subscribe((_) =>{
                    this.cardAddress.postcode = _;
                    this.cardAddress.disablepostcode = false;

                });
        }
    }
    ChangeRadioTitle(e){
        if (e.value) {
            if(e.value == 'อื่นๆ'){
                this.checkothertitle = true;
                this.formData.TITLE_NAME = "";
            }else{
                this.checkothertitle = false;
                this.formData.TITLE_NAME = e.value;

            }
        }
    }
    DefaultCheckbox() {
       
        this.checkboxLocation = {
            location_type1: false,
            location_type2: false,
            location_type3: false
        };

        this.checkboxlocationreadonly = {
            readonly_type1: false,
            readonly_type2: false,
            readonly_type3: false
        }
      
    }
    OnSelectProvicePresentlocation(e) {
        
        if (e.value) {
            const data = this.selectPresentProvicelocation.instance.option("selectedItem");
        //     if (data) {
        //         this.formdataOrgsendcase.ORG_PROVINCE_ID = data.PROVINCE_ID;
        //         this.formdataOrgsendcase.ORG_PROVINCE_NAME = data.PROVINCE_NAME_THA;
        //     }else{
        //         this.formData.ORG_PROVINCE_ID = e.value;
        //     }
        // this._OrgService.getorgProvince(e.value).subscribe((_)=>{
        //         this.dsorgbyarialocation = _;
        // });
        if (data) {
            this.formData.ORG_PROVINCE_ID = data.PROVINCE_ID;
            this.formData.ORG_PROVINCE_NAME = data.PROVINCE_NAME_THA;
            
        }else{
            this.formData.ORG_PROVINCE_ID = e.value;
        }
    this._OrgService.getorgProvince(e.value).subscribe((_)=>{
            this.dsorgbyarialocation = _;
    });

        }
    }

    CheckOccupation(id: number = 0) {
        if (id !== 0) {
            return id;
        }
        return null;
    }
    checkStNumber(e) {
        const elem = e.event.keyCode;
        if (elem < 47 || elem > 57) {
            e.event.preventDefault();
        }
        // console.log(e.event);
    }
    checkNumbers(e) {
        const elem = e.event.keyCode;
        if (elem < 48 || elem > 57) {
            e.event.preventDefault();
        }
    }
    ShowInvalidDialog(isText = "กรุณากรอกข้อมูลให้ครบ") {
        Swal.fire({
            title: "ผิดพลาด!",
            text: isText,
            icon: "warning",
            confirmButtonText: "Ok",
        }).then(() => { });
    }

    OnWalkInChange(e) {
        if (e.value) {
            this.formData.IS_WALKIN_RADIO = e.value;
            this.formData.IS_WALKIN = e.value === 1 ? false : true;
        }
    }

    OnDatasourceChange(e) {
        if (e.value) {
            this.formData.DATASOURCE = e.value;
        }
    }

    async setPersonalData() {

        this.dsorgbyarialocation = await this._OrgService.getorgwalkin().toPromise(); 
        this.dswalkinstatuspolice = await this._OrgService.getorgwalkin().toPromise(); 
        this.dsorgarea = await this._OrgService.getorgariaall().toPromise();
        this.bankInfoList = await this.servBankInfo.GetBankInfo().toPromise();

        this.userType = this.mainConponent.userType;
        this.formData = {};
        this.personalRelantion = await this.serePersonalRelation
            .GetRelation()
            .toPromise();
        if (this.mainConponent.formType === 'add') {
            this.formReadOnly = false;
            this.formValidate = true;
            const p = this.personalInfo;
            // console.log('personalInfo', this.personalInfo);
            this.formData = {
                CASE_INFORMER_FIRSTNAME: p.PERSONAL_FNAME_THA,
                CASE_INFORMER_LASTNAME: p.PERSONAL_LNAME_THA,
                OCCUPATIONS_ID: null,
                INFORMER_EMAIL: p.PERSONAL_EMAIL,
                INFORMER_TEL: p.PERSONAL_TEL_NO,
            };
            if (p.OCCUPATION_ID) {
                this.formData.OCCUPATIONS_ID = p.OCCUPATION_ID;
            }
            this.checkedRadioGender = null;
            if (p.PERSONAL_GENDER) {
                this.checkedRadioGender = (p.PERSONAL_GENDER === 1) ? 'M' : 'F';
            }
            if (this.userType === 'mySelf') {
                this.formData.CASE_INFORMER_DATE = this._date.ConvertToDate(p.PERSONAL_BIRTH_DATE);
                this.formData.CASE_INFORMER_ADDRESS_NO = p.PERSONAL_ADDRESS ?? "";
                this.serviceProvince.GetProvince().subscribe(async (resprovince) => {
                    this.province = resprovince;
                    if (p.PROVINCE_ID) {
                        this.formData.INFORMER_PROVINCE = p.PROVINCE_ID;
                        this.province.forEach(_pro => {
                            if (p.PROVINCE_ID === _pro.PROVINCE_ID) {
                                this.formData.INFORMER_PROVINCE_NAME_THA = _pro.PROVINCE_NAME_THA;
                            }
                        });
                        this.presentAddress.district = await this.serviceProvince
                            .GetDistrictofProvince(p.PROVINCE_ID)
                            .toPromise();
                        this.presentAddress.disableDistrict = false;
                    }


                    if (p.DISTICT_ID) {
                        this.formData.INFORMER_DISTRICT_ID = p.DISTICT_ID;
                        this.presentAddress.subDistrict = await this.serviceDistrict
                            .GetSubDistrictOfDistrict(p.DISTICT_ID)
                            .toPromise();
                        this.presentAddress.disableSubDistrict = false;
                    }
                    if (p.SUB_DISTICT_ID) {
                        this.formData.INFORMER_SUB_DISTRICT_ID = p.SUB_DISTICT_ID;
                        this.formData.INFORMER_POSTCODE_ID = p.POST_CODE;
                        this.presentAddress.postcode = await this.serviceSubDistrict
                            .GetPostCode(p.SUB_DISTICT_ID)
                            .toPromise();
                        this.presentAddress.disablepostcode = false;

                    }
                });

            } else {
                this.formData.CASE_INFORMER_FIRSTNAME = null;
                this.formData.CASE_INFORMER_LASTNAME = null;
                this.formData.INFORMER_EMAIL = null;
                this.formData.INFORMER_TEL = null;
                this.formData.OCCUPATIONS_ID = this.occupationList[0] ?? null;
                this.formData.CASE_INFORMER_RELATION_ID = this.personalRelantion[0].RELATION_ID;
                this.formData.CASE_INFORMER_RELATION_NAME = this.personalRelantion[0].RELATION_NAME;
                this.formData.CASE_INFORMER_RELATION_CODE = this.personalRelantion[0].RELATION_CODE;
                this.formData.CASE_INFORMER_DATE = this._date.SetDateDefault();

            }

        } else {
            const dataForm = this.mainConponent.formDataInsert;
            if (dataForm.INFORMER_PROVINCE) {
                this.presentAddress.district = await this.serviceProvince
                    .GetDistrictofProvince(dataForm.INFORMER_PROVINCE)
                    .toPromise();
                this.presentAddress.disableDistrict = false;

            }
            if (dataForm.INFORMER_DISTRICT_ID) {
                this.presentAddress.subDistrict = await this.serviceDistrict
                    .GetSubDistrictOfDistrict(dataForm.INFORMER_DISTRICT_ID)
                    .toPromise();
                this.presentAddress.disableSubDistrict = false;

            }
            if (dataForm.INFORMER_SUB_DISTRICT_ID) {
                this.presentAddress.postcode = await this.serviceSubDistrict
                    .GetPostCode(dataForm.INFORMER_SUB_DISTRICT_ID)
                    .toPromise();
                this.presentAddress.disablepostcode = false;

            }
            this.formType = "edit";
            this.formReadOnly = true;
            this.formValidate = false;
            this.formData = dataForm;
            this.userType = this.formData.CASE_SELF_TYPE === 'Y' ? 'mySelf' : 'other';
            this.checkedRadioGender = null;
            this.checkedRadioGender = dataForm.INFORMER_GENDER;
            // console.log('birthday->>>>', dataForm.CASE_INFORMER_DATE);
            this.formData.CASE_INFORMER_DATE = this._date.ConvertToDate(dataForm.CASE_INFORMER_DATE);

        }
        // default วันเกิด Start
        this.minBirthDate = this._date.SetDateDefault(80, true, true, true);
        this.maxBirthDate = this._date.SetDateDefault(0);
        this.loadDateBox = true;
        // default วันเกิด End
        this.isLoading = false;
        // console.log('informer UserType',this.userType);

    }
    ChangeRadioGender(e) {
        if (e.value) {
            const d: any = this.gender.filter(r => r.GENDER_TYPE === e.value);
            this.formData.INFORMER_GENDER = `${d[0].GENDER_TYPE}`;
            this.formData.INFORMER_GENDER_DETAIL = `${d[0].GENDER_DETAIL}`;
        }
    }
    CheckArray(data: any = []) {
        const countArray = data.length ?? 0;
        if (countArray > 0) {
            return true;
        }
        return false;

    }
    OnSelectRelation(e) {
        if (e.value) {
            const isData = this.personalRelantion.filter(r => r.RELATION_ID === e.value);
            if (this.CheckArray(isData)) {
                this.formData.CASE_INFORMER_RELATION_ID = isData[0].RELATION_ID;
                this.formData.CASE_INFORMER_RELATION_NAME = isData[0].RELATION_NAME;
                this.formData.CASE_INFORMER_RELATION_CODE = isData[0].RELATION_CODE;
            }
        }
    }
    OnSelectOccupation(e) {
        if (e.value) {
            const data = this.selectOccupation.instance.option("selectedItem");
            if (data) {
                this.formData.OCCUPATIONS_ID = data.OCCUPATIONS_ID;
                this.formData.OCCUPATIONS_NAME = data.OCCUPATIONS_NAME;
            } else {
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
            this.formData.INFORMER_PROVINCE = data.PROVINCE_ID;
            this.formData.INFORMER_PROVINCE_NAME_THA = data.PROVINCE_NAME_THA;

            this.presentAddress.disableDistrict = false;
            this.presentAddress.disableSubDistrict = true;
            this.presentAddress.disablepostcode = true;
            this.serviceProvince
                .GetDistrictofProvince(e.value)
                .subscribe((_) => (this.presentAddress.district = _));
        } else {
            this.presentAddress.disableDistrict = true;
            this.presentAddress.disableSubDistrict = true;
            this.presentAddress.disablepostcode = true;
            this.formData.INFORMER_DISTRICT_ID = null;
            this.formData.INFORMER_SUB_DISTRICT_ID = null;
            this.formData.INFORMER_POSTCODE_ID = null;

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
            } else {
                this.formData.INFORMER_DISTRICT_ID = e.value;
            }


            this.presentAddress.disableSubDistrict = false;
            this.presentAddress.disablepostcode = true;
            this.serviceDistrict
                .GetSubDistrictOfDistrict(e.value)
                .subscribe((_) => (this.presentAddress.subDistrict = _));
        } else {
            this.presentAddress.disableSubDistrict = true;
            this.presentAddress.disablepostcode = true;
            this.formData.INFORMER_SUB_DISTRICT_ID = null;
            this.formData.INFORMER_POSTCODE_ID = null;
        }
    }

    OnSelectSubDistrictPresent(e) {
        this.presentAddress.postcode = [];
        if (e.value) {
            const data = this.selectPresentSubDistrict.instance.option("selectedItem");
            if (data) {
                this.formData.INFORMER_SUB_DISTRICT_ID = data.SUB_DISTRICT_ID;
                this.formData.INFORMER_SUB_DISTRICT_NAME_THA = data.SUB_DISTRICT_NAME_THA;
            } else {
                this.formData.INFORMER_SUB_DISTRICT_ID = e.value;
            }


            this.presentAddress.disablepostcode = false;
            this.serviceSubDistrict
                .GetPostCode(e.value)
                .subscribe((_) => (this.presentAddress.postcode = _));
        } else {
            this.presentAddress.disablepostcode = true;
            this.formData.INFORMER_POSTCODE_ID = null;
        }
    }

    OnSelectPostCodePresent(e) {
        if (e.value) {
            const data = this.selectPresentPostcode.instance.option("selectedItem");
            if (data) {
                this.formData.INFORMER_POSTCODE_ID = data.POSTCODE_ID;
                this.formData.INFORMER_POSTCODE_CODE = data.POSTCODE_CODE;
            } else {
                this.formData.INFORMER_POSTCODE_ID = e.value;
            }

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
    Back(e) {
        this.mainConponent.NextIndex(this.mainConponent.indexTab - 1);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.mainConponent.numCount = this.mainConponent.indexTab - 1;
    }
    BackMain(e) {
        this.router.navigate(["/mobile/track-status?openExternalBrowser=1"]);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.userSetting.userSetting.tabIndex = this.mainConponent.numCount;
    }
    // SubmitForm(e) {
    //     if (this.mainConponent.formType === 'add') {
    //         if (!this.formInformer1.instance.validate().isValid) {
    //             if (this.CheckArray(this.formInformer1.instance.validate().brokenRules)) {
    //                 this.ShowInvalidDialog(this.formInformer1.instance.validate().brokenRules[0].message);
    //                 return;
    //             }
    //             this.ShowInvalidDialog();
    //             return;

    //         }
    //         if (!this.formInformer2.instance.validate().isValid) {
    //             this.ShowInvalidDialog();
    //             return;
    //         }

    //         if (this.userType === 'other' && !this.formInformerOther.instance.validate().isValid) {
    //             this.ShowInvalidDialog();
    //             return;
    //         }
    //         this.mainConponent.formDataAll.formInformer = {};
    //         this.formData.CASE_INFORMER_DATE = this._date.ConvertToDateFormat(this.formData.CASE_INFORMER_DATE);
    //         this.mainConponent.formDataAll.formInformer = this.formData;
    //         // console.log('formInfomer', this.mainConponent.formDataAll.formInformer);
    //     }
    //     this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
    //     document.body.scrollTop = document.documentElement.scrollTop = 0;
    //     this.mainConponent.numCount = this.mainConponent.indexTab + 1;
    //     this.userSetting.userSetting.tabIndex = this.mainConponent.numCount;
    // }

    SubmitForm(e) {
        if (this.mainConponent.formType === 'add') {
            this.formInformer1.instance.validate();
            this.formInformer2.instance.validate();
            this.formInformer3.instance.validate();
            this.formInformer4.instance.validate();
            this.formInformer2address.instance.validate();
             
            if(this.formData.ORG_LOCATION_TYPE == 1 ){
                if (!this.formData.ORG_LOCATION_ID){
                    this.alertmessagecustom('กรุณาเลือกสถานี');
                    return;
                }
            }else if(this.formData.ORG_LOCATION_TYPE == 2){
                if (!this.formData.ORG_LOCATION_ID){
                    this.alertmessagecustom('กรุณาเลือกสถานี');
                    return;
                }
            }else if(this.formData.ORG_LOCATION_TYPE == 3){
                if (!this.formData.ORG_LOCATION_ID){
                    this.alertmessagecustom('กรุณาเลือกสถานี');
                    return;
                }
            }else{
                if (!this.formData.ORG_LOCATION_ID){
                    this.alertmessagecustom('กรุณาเลือกสถานี');
                    return;
                }
            }
          
            if (!this.formInformer1.instance.validate().isValid){
                this._formValidate.ValidateForm(this.formInformer1.instance.validate().brokenRules);
                return;
            }

            
            if (!this.formInformer2.instance.validate().isValid){
                this._formValidate.ValidateForm(this.formInformer2.instance.validate().brokenRules);
                return;
            }
            if (!this.formInformer2address.instance.validate().isValid){
                this._formValidate.ValidateForm(this.formInformer2address.instance.validate().brokenRules);
                return;
            }

            if (!this.formInformer3.instance.validate().isValid){
                this._formValidate.ValidateForm(this.formInformer3.instance.validate().brokenRules);
                return;
            }

            if (!this.formInformer4.instance.validate().isValid){
                this._formValidate.ValidateForm(this.formInformer4.instance.validate().brokenRules);
                return;
            }

            if(this.popupFormData.length != undefined){
                
            }else{
                Swal.fire({
                    title: "ผิดพลาด!",
                    text: "กรุณากรอกข้อมูล บัญชีผู้เสียหาย",
                    icon: "warning",
                    confirmButtonText: "Ok",
                }).then(() => {});
                return;
            }
      
            this.mainConponent.formDataAll.formInformer = {};
            this.formData.CASE_INFORMER_DATE = this._date.ConvertToDateFormat(this.formData.CASE_INFORMER_DATE);
            this.mainConponent.formDataAll.formInformer = this.formData;
            // console.log('formInfomer', this.mainConponent.formDataAll.formInformer);
        }
        this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.mainConponent.numCount = this.mainConponent.indexTab + 1;
        this.userSetting.userSetting.tabIndex = this.mainConponent.numCount;
    }

    alertmessagecustom(msg){
        Swal.fire({
            title: "ผิดพลาด!",
            text: msg ?? "กรุณากรอกข้อมูล",
            icon: "warning",
            confirmButtonText: "Ok",
        }).then(() => {});
        return;
    }

    onvaluecheckboxlocationchange(e,type_location){

       
        this.formdataOrgsendcase  = {

            ORG_LOCATION_TYPE: null,
            ORG_LOCATION_ID: null,
            ORG_LOCATION_NAME: "",
            ORG_PROVINCE_ID: null,
            ORG_PROVICE_NAME: "",
            ORG_LOCATION_MAIN_ID: null,
            ORG_LOCATION_MAIN_NAME: "",
            ORG_LOCATION_CENTER_ID: null,
            ORG_LOCATION_CENTER_NAME: ""
    
    
        };
        if(type_location == 1){
            
            this.checkboxLocation.location_type1 = e.value;
            this.checkboxLocation.location_type2 =false;
            this.checkboxLocation.location_type3 =false;
            if(e.value == true){
                this.checkboxlocationreadonly.readonly_type2 = true;
                this.checkboxlocationreadonly.readonly_type3 = true;
                this.formData.location_type1 = 1;
                this.formData.ORG_LOCATION_TYPE = 1;
            }else{
                this.checkboxlocationreadonly.readonly_type2 = false;
                this.checkboxlocationreadonly.readonly_type3 = false;
            }
       
        }else if(type_location == 2){

          
            this.checkboxLocation.location_type2 = e.value;
            this.checkboxLocation.location_type1 =false;
            this.checkboxLocation.location_type3 =false;
            if(e.value == true){
                this.checkboxlocationreadonly.readonly_type1 = true;
                this.checkboxlocationreadonly.readonly_type3 = true;
                this.formData.location_type1 = 2;
                this.formData.ORG_LOCATION_TYPE = 2;
            }else{
                this.checkboxlocationreadonly.readonly_type1 = false;
                this.checkboxlocationreadonly.readonly_type3 = false;
            }
        }else if(type_location == 3){
            this.checkboxLocation.location_type2 = false;
            this.checkboxLocation.location_type1 =false;
            this.checkboxLocation.location_type3 = e.value;
            if(e.value == true){
                this.checkboxlocationreadonly.readonly_type2 = true;
                this.checkboxlocationreadonly.readonly_type1 = true;
                this.formData.location_type1 = 3;
                this.formData.ORG_LOCATION_TYPE = 3;
            }else{
                this.checkboxlocationreadonly.readonly_type2 = false;
                this.checkboxlocationreadonly.readonly_type1 = false;
            }
        }
    }

    
    Onorglocationwalkin(e){
        if (e.value) {
            const data = this.selectorgwalkin.instance.option("selectedItem");

            // if (data) {
            //     this.formdataOrgsendcase.ORG_LOCATION_TYPE = 1;
            //     this.formdataOrgsendcase.ORG_LOCATION_ID = data.ORGANIZE_ID;
            //     this.formdataOrgsendcase.ORG_LOCATION_NAME = data.ORGANIZE_NAME_THA;
            //     this.formdataOrgsendcase.ORG_PROVINCE_ID = Number(data.ORGANIZE_ARIA_CODE);

            // }else{
            //     this.formdataOrgsendcase.ORG_LOCATION_ID = e.value;
            // }
            // console.log('selectorgwalkin',data)
            if (data) {
                this.formData.ORG_LOCATION_TYPE = 1;
                this.formData.ORG_LOCATION_ID = data.ORGANIZE_ID;
                this.formData.ORG_LOCATION_NAME = data.ORGANIZE_NAME_THA;
                this.formData.ORG_PROVINCE_LOCATION_ID = data.ORGANIZE_ID;
                this.formData.ORG_PROVINCE_ID = Number(data.ORGANIZE_ARIA_CODE);

            }else{
                this.formData.ORG_LOCATION_ID = e.value;
            }
            
        }

      
    }

    onvaluechangeorgmain(e,type){
        // const data = this.selectorgmain.instance.option("selectedItem");
        this.formData.ORG_PROVINCE_MAP_AREA_ID = null;
        this.formData.ORG_PROVINCE_MAP_AREA_NAME = null;
        
            if (e.value) {
       
                if(type == 1){
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = null;
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = null;
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = null;
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = null;
                    const data: any = this.orgtype2_1.filter(r => r.org_id === e.value);
                    this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = data[0].org_id;
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_NAME1 = data[0].org_name;
    
                    //parame insert
                    this.formData.ORG_LOCATION_TYPE = 2;
                    this.formData.ORG_LOCATION_ID = data[0].org_id;
                    this.formData.ORG_LOCATION_NAME = data[0].org_name;
                }
                if(type == 2){
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = null;
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = null;
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = null;
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = null;
                    const data: any = this.orgtype2_2.filter(r => r.org_id === e.value);
                    this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = data[0].org_id;
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_NAME2 = data[0].org_name;
    
                    //parame insert
                    this.formData.ORG_LOCATION_TYPE = 2;
                    this.formData.ORG_LOCATION_ID = data[0].org_id;
                    this.formData.ORG_LOCATION_NAME = data[0].org_name;
                }else if(type == 3){
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = null;
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = null;
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = null;
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = null;
                    const data: any = this.orgtype2_3.filter(r => r.org_id === e.value);
                    this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = data[0].org_id;
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_NAME3 = data[0].org_name;
    
                    //parame insert
                    this.formData.ORG_LOCATION_TYPE = 2;
                    this.formData.ORG_LOCATION_ID = data[0].org_id;
                    this.formData.ORG_LOCATION_NAME = data[0].org_name;
                }else if(type == 4){
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = null;
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = null;
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = null;
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = null;
                    const data: any = this.orgtype2_4.filter(r => r.org_id === e.value);
                    this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = data[0].org_id;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_NAME4 = data[0].org_name;

                //parame insert
                this.formData.ORG_LOCATION_TYPE = 2;
                this.formData.ORG_LOCATION_ID = data[0].org_id;
                this.formData.ORG_LOCATION_NAME = data[0].org_name;
                }else if(type == 5){
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = null;
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = null;
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = null;
                    this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = null;
                    const data: any = this.orgtype2_5.filter(r => r.org_id === e.value);
                    this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = data[0].org_id;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_NAME5 = data[0].org_name;

                //parame insert
                this.formData.ORG_LOCATION_TYPE = 2;
                this.formData.ORG_LOCATION_ID = data[0].org_id;
                    this.formData.ORG_LOCATION_NAME = data[0].org_name;
                }
               
            }
            // else{
            //     this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID = e.value;
            // }

            console.log(this.formData.ORG_LOCATION_ID,this.formData.ORG_LOCATION_NAME);
            // alert(this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID);
    }

    onvaluechangeorgcenter(e){

        if (e.value) {
            const data: any = this.orgtype3.filter(r => r.org_id === e.value);
            console.log(data[0].org_id , data[0].org_name);
            this.formdataOrgsendcase.ORG_LOCATION_TYPE = 3;
            this.formdataOrgsendcase.ORG_LOCATION_CENTER_ID = data[0].org_id;
            this.formdataOrgsendcase.ORG_LOCATION_CENTER_NAME = data[0].org_name;

                //parame insert
                this.formData.ORG_LOCATION_TYPE = 3;
                this.formData.ORG_LOCATION_ID = data[0].org_id;
                this.formData.ORG_LOCATION_NAME = data[0].org_name;



        }else{
            this.formdataOrgsendcase.ORG_LOCATION_CENTER_ID = e.value;
        }
        // alert(this.formdataOrgsendcase.ORG_LOCATION_CENTER_ID);
}
//     onvaluechangeorgcenter(e){
        
//         if (e.value) {
//             const data: any = this.orgtype3.filter(r => r.org_id === e.value);
//             // console.log(data[0].org_id , data[0].org_name);
//             this.formdataOrgsendcase.ORG_LOCATION_TYPE = 3;
//             this.formdataOrgsendcase.ORG_LOCATION_CENTER_ID = data[0].org_id;
//             this.formdataOrgsendcase.ORG_LOCATION_CENTER_NAME = data[0].org_name;

//                 //parame insert
//                 this.formData.ORG_LOCATION_TYPE = 3;
//                 this.formData.ORG_LOCATION_ID = data.org_id;
//                 this.formData.ORG_LOCATION_NAME = data.org_name;

                

//         }else{
//             this.formdataOrgsendcase.ORG_LOCATION_CENTER_ID = e.value;
//         }
//         // alert(this.formdataOrgsendcase.ORG_LOCATION_CENTER_ID);
// }


    OnSelectProvicemaparea(e) {
        
        if (e.value) {
            const data = this.selectProvicemaparea.instance.option("selectedItem");
       
        if (data) {

            this.formData.ORG_PROVINCE_MAP_AREA_ID = data.PROVINCE_ID;
            this.formData.ORG_PROVINCE_MAP_AREA_NAME = data.PROVINCE_NAME_THA;
              //parame insert
              this.formData.ORG_LOCATION_TYPE = 2;
              this.formData.ORG_LOCATION_ID = data.ORG_ID;
              this.formData.ORG_LOCATION_NAME = data.ORGANIZE_FULL_NAME;
        }else{
            this.formData.ORG_PROVINCE_MAP_AREA_ID = e.value;
        }
  

        }
    }
}
