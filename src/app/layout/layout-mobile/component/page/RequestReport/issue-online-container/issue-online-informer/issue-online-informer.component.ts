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
import { IssueOnlineService } from "src/app/services/issue-online.service";
import { OnlineCaseService } from "src/app/services/online-case.service";
import { switchMap } from "rxjs/operators";
import { BpmProcinstService } from "src/app/services/bpm-procinst.service";

@Component({
    selector: "app-issue-online-informer",
    templateUrl: "./issue-online-informer.component.html",
    styleUrls: ["./issue-online-informer.component.scss"],
})
export class IssueOnlineInformerComponent implements OnInit {
    @ViewChild("formInformer1", { static: false })
    formInformer1: DxFormComponent;
    @ViewChild("formInformer2", { static: false })
    formInformer2: DxFormComponent;
    @ViewChild("formInformer3", { static: false })
    formInformer3: DxFormComponent;
    @ViewChild("formInformer4", { static: false })
    formInformer4: DxFormComponent;
    @ViewChild("formInformer5", { static: false })
    formInformer5: DxFormComponent;
    @ViewChild("formInformerOther", { static: false })
    formInformerOther: DxFormComponent;
    @ViewChild("formInformeraddresspolice", { static: false })
    formInformeraddresspolice: DxFormComponent;
    @ViewChild("formInformertype2", { static: false })
    formInformertype2: DxFormComponent;
    @ViewChild("formInformertype3", { static: false })
    formInformertype3: DxFormComponent;

    @ViewChild("formInformertype1", { static: false })
    formInformertype1: DxFormComponent;

    // @ViewChild("selectPersonalRelantion", { static: false }) selectPersonalRelantion: DxSelectBoxComponent;

    @ViewChild("selectOccupation", { static: false })
    selectOccupation: DxSelectBoxComponent;
    @ViewChild("selectPresentProvice", { static: false })
    selectPresentProvice: DxSelectBoxComponent;
    @ViewChild("selectcardProvice", { static: false })
    selectcardProvice: DxSelectBoxComponent;

    @ViewChild("selectPresentDistrict", { static: false })
    selectPresentDistrict: DxSelectBoxComponent;
    @ViewChild("selectCardDistrict", { static: false })
    selectCardDistrict: DxSelectBoxComponent;

    @ViewChild("selectPresentSubDistrict", { static: false })
    selectPresentSubDistrict: DxSelectBoxComponent;
    @ViewChild("selectCardSubDistrict", { static: false })
    selectCardSubDistrict: DxSelectBoxComponent;

    @ViewChild("selectPresentPostcode", { static: false })
    selectPresentPostcode: DxSelectBoxComponent;
    @ViewChild("selectorgwalkin", { static: false })
    selectorgwalkin: DxSelectBoxComponent;
    @ViewChild("selectorg", { static: false })
    selectorg: DxSelectBoxComponent;
    @ViewChild("selectPresentProvicelocation", { static: false })
    selectPresentProvicelocation: DxSelectBoxComponent;
    @ViewChild("selectPresentProvicelocationwalkin", { static: false })
    selectPresentProvicelocationWalkin: DxSelectBoxComponent;
    @ViewChild("selectPresentProvicelocationofficer", { static: false })
    selectPresentProvicelocationofficer: DxSelectBoxComponent;

    @ViewChild("selectorgmain", { static: false })
    selectorgmain: DxSelectBoxComponent;
    @ViewChild("selectorgcenter", { static: false })
    selectorgcenter: DxSelectBoxComponent;
    @ViewChild("selectBankInfo", { static: false })
    selectBankInfo: DxSelectBoxComponent;
    @ViewChild("selectProvicemaparea", { static: false })
    selectProvicemaparea: DxSelectBoxComponent;

    @ViewChild("formInformer2address", { static: false })
    formInformer2address: DxFormComponent;

    public mainConponent: IssueOnlineContainerComponent;
    loadDateBox = false;
    minBirthDate: Date;
    maxBirthDate: Date;
    personalInfo: any = {};
    isLoading = false;
    occupationList = [];
    occupationOther = false;
    formData: any = {};
    presentAddress: any = {};
    cardAddress: any = {};
    province = [];
    bankInfoList: any = [];

    socialInfo = [];
    personalRelantion = [];
    isWalkIn = 1;
    checkboxLocation: any = {};
    checkboxLocationwalkin: any = {};
    checkboxaddresscard = false;
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
        ORG_LOCATION_CENTER_NAME: "",
    };
    formdataOrgsendcasewalkin: any = {};
    gender = [
        { GENDER_TYPE: "M", GENDER_DETAIL: "ชาย" },
        { GENDER_TYPE: "F", GENDER_DETAIL: "หญิง" },
        { GENDER_TYPE: "O", GENDER_DETAIL: "อื่น ๆ" },
    ];

    cmstitle = [
        { TITLE_ID: "นาย", TITLE_NAME: "นาย" },
        { TITLE_ID: "นาง", TITLE_NAME: "นาง" },
        { TITLE_ID: "นางสาว", TITLE_NAME: "นางสาว" },
        { TITLE_ID: "อื่นๆ", TITLE_NAME: "อื่นๆ" },
    ];
    walkInType = [
        { ID: 1, TEXT: "ยังไม่เคยพบ" },
        { ID: 2, TEXT: "เคยพบแล้ว" },
    ];

    promote = [
        { ID: "ใช่", TEXT: "ใช่" },
        { ID: "ไม่ใช่", TEXT: "ไม่ใช่" },
    ];
    datasource = [
        { ID: 1, TEXT: "โทร.1441" },
        { ID: 2, TEXT: "โทร.081-866-3000" },
        { ID: 3, TEXT: "สถานีตำรวจ (Walk in)" },
        { ID: 4, TEXT: "อื่นๆ" },
    ];

    // orgtype2 = [
    //     { org_id: 3536, org_name: "กองบังคับการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี 1-5 (ส่วนหน้า) ที่ตั้ง กรุงเทพฯ อาคารรัฐประศาสนภักดี (อาคาร B) ศูนย์ราชการฯ แจ้งวัฒนะ ชั้น 4  ถนนแจ้งวัฒนะ แขวงทุ่งสองห้อง เขตหลักสี่" },
    //     { org_id: 3548, org_name: "กองบังคับการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี 2 ที่ตั้ง จังหวัดนนทบุรี เลขที่ 904 ตำบลบ้านใหม่ อำเภอปากเกร็ด นนทบุรี 11120" },
    //     { org_id: 3559, org_name: "กองบังคับการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี 3 ที่ตั้ง จังหวัดขอนแก่น เลขที่ 102 ถนนมิตรภาพ ตำบลในเมือง อำเภอเมืองขอนแก่น" },
    //     { org_id: 3567, org_name: "กองบังคับการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี 4 ที่ตั้ง จังหวัดเชียงใหม่ เลขที่ 299 หมู่ 12 ถนนสมโภชเชียงใหม่ 700 ปี ตำบลป่าแดด อำเภอเมืองเชียงใหม่" },
    //     { org_id: 3578, org_name: "กองบังคับการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี 5 ที่ตั้ง จังหวัดสุราษฎร์ธานี เลขที่ 14 หมู่ 1 ตำบลบางกุ้ง อำเภอเมืองสุราษฎร์ธานี" }
    //   ];
    //   orgtype2_1 = [
    //     { org_id: 3536, org_name: "กองบังคับการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี 1 ที่ตั้ง  กรุงเทพฯ   อาคารรัฐประศาสนภักดี (อาคาร B) ศูนย์ราชการฯ แจ้งวัฒนะ ชั้น 4 ถนนแจ้งวัฒนะ แขวงทุ่งสองห้อง เขตหลักสี่ " },
    //   ];
    //   orgtype2_2 = [
    //     { org_id: 3548, org_name: "กองบังคับการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี 2 ที่ตั้ง จังหวัดนนทบุรี อาคารเฉลิมพระเกียรติฯ เลขที่ 904 ชั้น 19 ตำบลบ้านใหม่ อำเภอปากเกร็ด " },
    //   ];
    //   orgtype2_3 = [
    //     { org_id: 3559, org_name: "กองบังคับการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี 3 ที่ตั้ง จังหวัดขอนแก่น เลขที่ 102 ถนนมิตรภาพ ตำบลในเมือง อำเภอเมืองขอนแก่น " },
    //   ];
    //   orgtype2_4 = [
    //     { org_id: 3567, org_name: "กองบังคับการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี 4 ที่ตั้ง จังหวัดเชียงใหม่ เลขที่ 299 หมู่ 12 ถนนสมโภชเชียงใหม่ 700 ปี ตำบลป่าแดด อำเภอเมืองเชียงใหม่ " },
    //   ];
    //   orgtype2_5 = [
    //     { org_id: 3578, org_name: "กองบังคับการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี 5 ที่ตั้ง จังหวัดสุราษฎร์ธานี เลขที่ 14 หมู่ 1 ตำบลบางกุ้ง อำเภอเมืองสุราษฎร์ธานี " }
    //   ];

    orgtype2_1 = [
        { org_id: 3536, org_name: "บก.สอท.1",org_location1:"ศูนย์ราชการแจ้งวัฒนะ จ.กรุงเทพฯ"},
    ];
    orgtype2_2 = [
            { org_id: 3548, org_name: "บก.สอท.2",org_location1:"เมืองทองธานี จ.นนทบุรี"},
    ];
    orgtype2_3 = [
            { org_id: 3559, org_name: "บก.สอท.3",org_location1:"1.ศูนย์ราชการแจ้งวัฒนะ จ.กรุงเทพฯ",org_location2:"2.ถ.มิตรภาพ ต.ในเมือง อ.เมือง จ.ขอนแก่น"},
    ];
    orgtype2_4 = [
            { org_id: 3567, org_name: "บก.สอท.4",org_location1:"1.ศูนย์ราชการแจ้งวัฒนะ จ.กรุงเทพฯ",org_location2:"2.ต.ป่าแดด อ.เมืองเชียงใหม่ จ.เชียงใหม่"},
    ];
    orgtype2_5 = [
            { org_id: 3578, org_name: "บก.สอท.5",org_location1:"1.ศูนย์ราชการแจ้งวัฒนะ จ.กรุงเทพฯ",org_location2:"2.ต.บางกุ้ง อ.เมืองสุราษฎร์ธานี จ.สุราษฏร์ธานี"},
    ];
    orgtype3 = [
        { org_id: 2541, org_name: "กองบังคับการปราบปรามการกระทำความผิดเกี่ยวกับอาชญากรรมทางเศรษฐกิจ                          (บก.ปอศ.)" },
        { org_id: 2397, org_name: "กองบังคับการปราบปรามการกระทำความผิดเกี่ยวกับการคุ้มครองผู้บริโภค                              (บก.ปคบ.)" },
        { org_id: 2614, org_name: "กองบังคับการปราบปรามการกระทำผิดเกี่ยวกับอาชญากรรมทางเทคโนโลยี กองบัญชาการตำรวจสอบสวนกลาง  (บก.ปอท.)" },
        { org_id: 2605, org_name: "กองบังคับการปราบปรามการกระทำความเกี่ยวกับการค้ามนุษย์                                      (บก.ปคม.)" },
        { org_id: 2387, org_name: 'กองบังคับการปราบปราม                                                                 (บก.ป.)'},
    ];
      aria1and2 = [
        "ตำรวจภูธรภาค 1 (ชัยนาท,นนทบุรี,ปทุมธานี,พระนครศรีอยุธยา,ลพบุรี,สมุทรปราการ,สระบุรี,สิงห์บุรี,อ่างทอง)",
        "ตำรวจภูธรภาค 2 (จันทบุรี,ฉะเชิงเทรา,ชลบุรี,ตราด,นครนายก,ปราจีนบุรี,ระยอง,สระแก้ว)",
        "ตำรวจภูธรภาค 7 (กาญจนบุรี,นครปฐม,ประจวบคีรีขันธ์,เพชรบุรี,ราชบุรี,สมุทรสงคราม,สมุทรสาคร,สุพรรณบุรี)",
    ];

    aria3and4 = [
        "ตำรวจภูธรภาค 3 (ชัยภูมิ,นครราชสีมา,บุรีรัมย์,ยโสธร,ศรีสะเกษ,สุรินทร์,อำนาจเจริญ,อุบลราชธานี)",
        "ตำรวจภูธรภาค 4 (กาฬสินธุ์,ขอนแก่น,นครพนม,บึงกาฬ,มหาสารคาม,มุกดาหาร,ร้อยเอ็ด,เลย,สกลนคร,หนองคาย,หนองบัวลำภู,อุดรธานี)",
    ];

    aria5and6 = [
        "ตำรวจภูธรภาค 5 (เชียงใหม่,น่าน,พะเยา,แพร่,แม่ฮ่องสอน,ลำปาง,ลำพูน)",
        "ตำรวจภูธรภาค 6 (กำแพงเพชร,ตาก,นครสวรรค์,พิจิตร,พิษณุโลก,เพชรบูรณ์,สุโขทัย,อุตรดิตถ์,อุทัยธานี)",
    ];

    aria8and9 = [
        "ตำรวจภูธรภาค 8 (กระบี่,ชุมพร,นครศรีธรรมราช,พังงา,ภูเก็ต,ระนอง,สุราษฎร์ธานี)",
        "ตำรวจภูธรภาค 9 (ตรัง,นราธิวาส,ปัตตานี,พัทลุง,ยะลา,สงขลา,สตูล)",
    ];

    checkedRadioGender = null;
    checkradiotitle = null;
    checkothertitle = false;
    userType = "mySelf";
    formType = "add";
    formReadOnly = false;

    formValidate = true;
    invite_officer_org = "";

    dsorgbyaria: IOrganizeInfo[];
    dsorgbyarialocation: IOrganizeInfo[];
    dswalkinstatuspolice: IOrganizeInfo[];
    dsorgarea: IOrgmaparea[];
    checkerror = 0;

    checkname: any = /^[ก-๏\s]+$/;

    popupFormData: any = {};
    formbanklistarray: any = {};
    personalbanklist = [];
    indexcheckdeletebanklist: any;
    popup = false;
    checktypeeditbanklist = "add";
    datacheck: any = {};
    datacheckorganize: any = {};

    ways = [
        { id: 1, text: "เคยพบแล้ว  หรือขณะนี้กำลังแจ้งความ  หน่วยตำรวจอะไร" },
        {
            id: 2,
            text: "ยังไม่เคยพบ (ท่านสะดวกไปพบพบพนักงานสอบสวนเพื่อสอบสวนปากคำที่ใด)",
        },
    ];
    radiocheckorganize1 = [{ id: 1, text: "สถานีตำรวจ" }];
    radiocheckorganize2 = [
        { id: 2, text: "กองบัญชาการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี" },
    ];
    radiocheckorganize3 = [{ id: 3, text: "กองบัญชาการตำรวจสอบสวนกลาง (ลาดพร้าว)" }];
    checkblessings = false;
    dataForms: any = {};
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
        private _formValidate: FormValidatorService,
        private _OrgService: OrgService,
        private _issueOnlineService: IssueOnlineService,
        private _OnlineCaseService: OnlineCaseService,
        private _BpmProcinstService: BpmProcinstService,

    ) {
        this.dsorgbyaria = {} as any;
        this.dsorgbyarialocation = {} as any;
        this.dswalkinstatuspolice = {} as any;
    }

    ngOnInit(): void {
        // this.isLoading = true;
        this.presentAddress.disableDistrict = true;
        this.presentAddress.disableSubDistrict = true;
        this.presentAddress.disablepostcode = true;
        this.cardAddress.disableDistrict = true;
        this.cardAddress.disableSubDistrict = true;
        this.cardAddress.disablepostcode = true;
        const userId = User.Current.PersonalId;
        this.isLoading = true;
        this.servicePersonal.GetPersonalById(userId)
            .subscribe(personalInfo => {
            this.personalInfo = personalInfo;
            this.setPersonalData();
          }, error => {
            if (error.status === 500 || error.status === 524) {
              this.mainConponent.checkReload(2);
            }
          });

        this.DefaultCheckbox();

        // this.isLoading = false;
    }
    CheckOccupation(id: number = 0) {
        if (id !== 0) {
            return id;
        }
        return null;
    }
    DefaultCheckbox() {
        this.checkboxLocation = {
            location_type1: false,
            location_type2: false,
            location_type3: false,
        };

        this.checkboxlocationreadonly = {
            readonly_type1: false,
            readonly_type2: false,
            readonly_type3: false,
        };
    }

    onvaluecheckaddresscard(e) {
        if (e.value) {
            this.formData.CASE_INFORMER_ADDRESS_NO =
                this.formData.CASE_INFORMER_CARD_ADDRESS_NO;
            this.formData.INFORMER_PROVINCE =
                this.formData.INFORMER_CARD_PROVINCE;
            this.serviceProvince
                .GetDistrictofProvince(this.formData.INFORMER_CARD_PROVINCE)
                .subscribe((_) => {
                    this.presentAddress.district = _;
                    this.presentAddress.disableDistrict = false;

                    this.formData.INFORMER_DISTRICT_ID =
                        this.formData.INFORMER_CARD_DISTRICT_ID;
                });

            setTimeout(() => {
                this.serviceDistrict
                    .GetSubDistrictOfDistrict(
                        this.formData.INFORMER_CARD_DISTRICT_ID
                    )
                    .subscribe((_) => {
                        this.presentAddress.subDistrict = _;
                        this.presentAddress.disableSubDistrict = false;
                        this.formData.INFORMER_SUB_DISTRICT_ID =
                            this.formData.INFORMER_CARD_SUB_DISTRICT_ID;
                    });
            }, 500);
        }
    }
    onvaluecheckboxlocationchangewalkin(e,type_location){
        this.formdataOrgsendcasewalkin = {};
        // this.formData.WALKIN_POLICE_STATION = data.ORGANIZE_NAME_THA;
        // this.formData.ORG_PROVINCE_OFFICER_ID = Number(data.ORGANIZE_ARIA_CODE);
        if (type_location === 1) {
            this.checkboxLocationwalkin.location_type1 = e.value;
            this.checkboxLocationwalkin.location_type2 = 0;
            if (e.value === 1) {
                this.formData.location_type1 = 1;
                this.formData.ORG_LOCATION_WALKIN_TYPE = 1;
            }
        } else if (type_location === 2) {
            this.checkboxLocationwalkin.location_type2 = e.value;
            this.checkboxLocationwalkin.location_type1 = e.value;
            this.formData.ORG_PROVINCE_OFFICER_ID = undefined;
            this.formData.WALKIN_POLICE_STATION = undefined;
            if (e.value === 2) {
                this.formData.location_type1 = 2;
                this.formData.ORG_LOCATION_WALKIN_TYPE = 2;
            }
        } else if (type_location === 3) {
            this.formData.ORG_PROVINCE_OFFICER_ID = undefined;
            this.formData.WALKIN_POLICE_STATION = undefined;
            this.checkboxLocationwalkin.location_type3 = e.value;
            if (e.value === 3) {
                this.formData.location_type1 = 3;
                this.formData.ORG_LOCATION_WALKIN_TYPE = 3;
            }
        }
    }

    onvaluecheckboxlocationchange(e, type_location) {
        this.formData.ORG_LOCATION_ID = null;
        this.formdataOrgsendcase = {
            ORG_LOCATION_TYPE: null,
            ORG_LOCATION_ID: null,
            ORG_LOCATION_NAME: "",
            ORG_PROVINCE_ID: null,
            ORG_PROVICE_NAME: "",
            ORG_LOCATION_MAIN_ID: null,
            ORG_LOCATION_MAIN_NAME: "",
            ORG_LOCATION_CENTER_ID: null,
            ORG_LOCATION_CENTER_NAME: "",
        };
        if (type_location == 1) {
            this.checkboxLocation.location_type1 = e.value;
            this.checkboxLocation.location_type2 = 0;
            // this.checkboxLocation.location_type2 =false;
            // this.checkboxLocation.location_type3 =false;
            if (e.value == 1) {
                // this.checkboxlocationreadonly.readonly_type2 = true;
                // this.checkboxlocationreadonly.readonly_type3 = true;
                this.formData.location_type1 = 1;
                this.formData.ORG_LOCATION_TYPE = 1;
            } else {
                // this.checkboxlocationreadonly.readonly_type2 = false;
                // this.checkboxlocationreadonly.readonly_type3 = false;
            }
        } else if (type_location == 2) {
            this.checkboxLocation.location_type2 = e.value;
            this.checkboxLocation.location_type1 = e.value;
            this.formData.ORG_PROVINCE_ID = undefined;
            this.formData.ORG_PROVINCE_LOCATION_ID = undefined;
            // this.checkboxLocation.location_type1 =false;
            // this.checkboxLocation.location_type3 =false;
            if (e.value == 2) {
                // this.checkboxlocationreadonly.readonly_type1 = true;
                // this.checkboxlocationreadonly.readonly_type3 = true;
                this.formData.location_type1 = 2;
                this.formData.ORG_LOCATION_TYPE = 2;
            } else {
                // this.checkboxlocationreadonly.readonly_type1 = false;
                // this.checkboxlocationreadonly.readonly_type3 = false;
            }
        } else if (type_location == 3) {
            // this.checkboxLocation.location_type2 = false;
            // this.checkboxLocation.location_type1 =false;
            this.formData.ORG_PROVINCE_ID = undefined;
            this.formData.ORG_PROVINCE_LOCATION_ID = undefined;
            this.checkboxLocation.location_type3 = e.value;
            if (e.value == 3) {
                // this.checkboxlocationreadonly.readonly_type2 = true;
                // this.checkboxlocationreadonly.readonly_type1 = true;
                this.formData.location_type1 = 3;
                this.formData.ORG_LOCATION_TYPE = 3;
            } else {
                // this.checkboxlocationreadonly.readonly_type2 = false;
                // this.checkboxlocationreadonly.readonly_type1 = false;
            }
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
    PromoteChange(e) {
        if (e.value) {
            this.formData.IS_PROMOTE_RADIO = e.value;
        }
    }
    OnDatasourceChange(e) {
        if (e.value) {
            this.formData.DATASOURCE = e.value;
        }
    }

    async setPersonalData() {
        try{
            this.isLoading = true;
            this.userType = this.mainConponent.userType;
            this.formData = {};
            if (this.mainConponent.formType === "add") {
                if(localStorage.getItem("form-blessing")){
                    this.datacheck = JSON.parse(localStorage.getItem("form-blessing"));
                }else if(this.mainConponent.formDataAll.formBlessing){
                    this.datacheck = this.mainConponent.formDataAll.formBlessing;
                }
                localStorage.setItem("form-index","2");
                if(localStorage.getItem("form-informer")){
                    this.dataForms = JSON.parse(localStorage.getItem("form-informer"));
                    this.formData = this.dataForms;
                }else{
                    this.dataForms = this.mainConponent.formDataAll.formInformer;
                }
                this.checkblessings = this.datacheck.CHECK_BLESSING;
                // const dataforms = this.mainConponent.formDataAll.formInformer;
                this.formReadOnly = false;
                this.formValidate = true;
                this.formData.location_type1 = true; // set checkbox ให้เลือกสถานีที่จะไป
                // this.checkboxLocation.location_type1 = true;
                const p = this.personalInfo;

                this.checkedRadioGender = null;
                if (this.userType === "mySelf") {
                    this.formData.CASE_INFORMER_FIRSTNAME = this.dataForms.CASE_INFORMER_FIRSTNAME ?? p.PERSONAL_FNAME_THA ?? null;
                    this.formData.CASE_INFORMER_LASTNAME =  this.dataForms.CASE_INFORMER_LASTNAME ?? p.PERSONAL_LNAME_THA ?? null;
                    this.formData.INFORMER_EMAIL =  this.dataForms.INFORMER_EMAIL ?? p.PERSONAL_EMAIL ?? null;
                    this.formData.INFORMER_TEL = this.dataForms.INFORMER_TEL ?? p.PERSONAL_TEL_NO ?? null;
                    this.checkedRadioGender = this.dataForms.INFORMER_GENDER ?? p.PERSONAL_GENDER === 1 ? "M" : "F" ?? null;
                    this.formData.INFORMER_GENDER_DETAIL = this.dataForms.INFORMER_GENDER_DETAIL ?? null;
                    this.formData.CASE_INFORMER_CITIZEN_NUMBER = this.dataForms.CASE_INFORMER_CITIZEN_NUMBER ?? p.PERSONAL_CITIZEN_NUMBER ?? null;

                    if(this.dataForms.TITLE_ID){
                        this.formData.TITLE_ID = this.dataForms.TITLE_ID;
                        this.formData.TITLE_NAME = this.dataForms.TITLE_NAME ?? null;
                    }else{
                        if(this.personalInfo.TITLE_NAME == "นาย"){
                            this.formData.TITLE_ID = this.personalInfo.TITLE_NAME;
                        }else if(this.personalInfo.TITLE_NAME == "นาง"){
                            this.formData.TITLE_ID = this.personalInfo.TITLE_NAME;
                        }else if(this.personalInfo.TITLE_NAME == "นางสาว"){
                            this.formData.TITLE_ID = this.personalInfo.TITLE_NAME;
                        }else{
                            this.formData.TITLE_ID = "อื่นๆ";
                            this.formData.TITLE_NAME = this.personalInfo.TITLE_NAME;
                        }
                    }

                } else {
                    this.formData.CASE_INFORMER_FIRSTNAME = null;
                    this.formData.CASE_INFORMER_LASTNAME = null;
                    this.formData.INFORMER_EMAIL = null;
                    this.formData.INFORMER_TEL = null;
                    this.formData.OCCUPATION_ID =
                        this.occupationList[0].OCCUPATION_ID ?? null;
                    this.formData.OCCUPATIONS_NAME =
                        this.occupationList[0].OCCUPATIONS_NAME ?? null;
                    // this.formData.CASE_INFORMER_RELATION_ID = this.personalRelantion[0].RELATION_ID;
                    // this.formData.CASE_INFORMER_RELATION_NAME = this.personalRelantion[0].RELATION_NAME;
                    // this.formData.CASE_INFORMER_RELATION_CODE = this.personalRelantion[0].RELATION_CODE;
                    this.formData.CASE_INFORMER_DATE = this._date.SetDateDefault();
                }
            } else {
                if(!localStorage.getItem("case_id")){
                    const _inst_id = Number(localStorage.getItem("inst_id"));
                    const procinstdata = await this._BpmProcinstService.getByInstId(_inst_id).toPromise();
                    sessionStorage.setItem("case_id",procinstdata.DATA_ID);
                }
                const _case_id = Number(sessionStorage.getItem("case_id"));
                const dataForm = await this._OnlineCaseService.getbycaseId(_case_id).toPromise();

                this.checkblessings = this.datacheck.CHECK_BLESSING;

                this.formType = "edit";
                this.formReadOnly = true;
                this.formValidate = false;
                this.formData = dataForm;

                this.userType =
                    this.formData.CASE_SELF_TYPE === "Y" ? "mySelf" : "other";
                this.checkedRadioGender = null;
                this.checkedRadioGender = dataForm.CASE_INFORMER_GENDER;
                this.formData.CASE_INFORMER_DATE = this._date.ConvertToDate(
                    dataForm.CASE_INFORMER_DATE
                );
            }
            // default วันเกิด Start
            this.minBirthDate = this._date.SetDateDefault(80, true, true, true);
            this.maxBirthDate = this._date.SetDateDefault(0);
            this.loadDateBox = true;
            this.isLoading = false;
            console.log("formdata", this.formData);
        }catch (error){
            setTimeout(()=>{
                this.checkerror = this.checkerror+1;
                if(this.checkerror > 3){
                    this.router.navigate([`/mobile/issue`]).then(() => {
                        window.location.reload();
                      });
                }else{
                    this.setPersonalData();
                }
            }, 2000);
        }
    }
    ChangeRadioGender(e) {
        if (e.value) {
            const d: any = this.gender.filter((r) => r.GENDER_TYPE === e.value);
            this.formData.INFORMER_GENDER = `${d[0].GENDER_TYPE}`;
            this.formData.INFORMER_GENDER_DETAIL = `${d[0].GENDER_DETAIL}`;
        }
    }

    ChangeRadioTitle(e) {
        if (e.value) {
            setTimeout(()=>{
                if (e.value == "อื่นๆ") {
                    this.checkothertitle = true;
                    if(!this.formData.TITLE_NAME){
                        this.formData.TITLE_NAME = "";
                    }
                } else {
                    this.checkothertitle = false;
                    this.formData.TITLE_NAME = e.value;
                }
            }, 500);
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
            const isData = this.personalRelantion.filter(
                (r) => r.RELATION_ID === e.value
            );
            if (this.CheckArray(isData)) {
                this.formData.CASE_INFORMER_RELATION_ID = isData[0].RELATION_ID;
                this.formData.CASE_INFORMER_RELATION_NAME =
                    isData[0].RELATION_NAME;
                this.formData.CASE_INFORMER_RELATION_CODE =
                    isData[0].RELATION_CODE;
            }
        }
    }
    OnSelectOccupation(e) {
        if (e.value) {
            const data = this.selectOccupation.instance.option("selectedItem");
            if (data) {
                setTimeout(() => {
                    this.occupationOther = e.value == 10 ? true : false;
                }, 200);
                this.formData.OCCUPATIONS_ID = e.value;
                this.formData.OCCUPATIONS_NAME = data.OCCUPATIONS_NAME;
                if(this.formData.OCCUPATIONS_ID != 10){
                    this.formData.OCCUPATIONS_OTHER_NAME = null;
                }
            } else {
                this.formData.OCCUPATIONS_ID = e.value;
                setTimeout(() => {
                    this.occupationOther = e.value == 10 ? true : false;
                }, 200);
            }

        }
    }

    OnSelectProvicePresent(e) {
        this.presentAddress.district = [];
        this.presentAddress.subDistrict = [];
        this.presentAddress.postcode = [];
        this.presentAddress.disableDistrict = true;
        this.presentAddress.disablepostcode = true;
        this.presentAddress.disableSubDistrict = true;
        this.formData.INFORMER_DISTRICT_ID = undefined;
        this.formData.INFORMER_DISTRICT_NAME_THA = undefined;
        if (e.value) {
            const data =
                this.selectPresentProvice.instance.option("selectedItem");
            if (data) {
                this.formData.INFORMER_PROVINCE = data.PROVINCE_ID;
                this.formData.INFORMER_PROVINCE_NAME_THA =
                    data.PROVINCE_NAME_THA;
            } else {
                this.formData.INFORMER_PROVINCE = e.value;
            }

            this.serviceProvince
                .GetDistrictofProvince(e.value)
                .subscribe((_) => {
                    this.presentAddress.district = _;
                    this.presentAddress.disableDistrict = false;
                });

            this._OrgService.getorgProvince(e.value).subscribe((_) => {
                this.dsorgbyaria = _;
            });
            console.log("proviceorg", this.dsorgbyaria);
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
                this.formData.INFORMER_CARD_PROVINCE_NAME_THA =
                    data.PROVINCE_NAME_THA;
            } else {
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
    OnSelectProvicePresentlocationWalkin(e){
        if (e.value) {
            const data =
                this.selectPresentProvicelocationWalkin.instance.option(
                    "selectedItem"
                );
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
                this.formData.ORG_PROVINCE_OFFICER_ID = data.PROVINCE_ID;
                this.formData.ORG_PROVINCE_OFFICER_NAME = data.PROVINCE_NAME_THA;
            } else {
                this.formData.ORG_PROVINCE_OFFICER_ID = e.value;
            }
            this._OrgService.getorgProvince(e.value).subscribe((_) => {
                this.dswalkinstatuspolice = _;
            });
        }
    }
    OnSelectProvicePresentlocation(e) {
        if (e.value) {
            const data =
                this.selectPresentProvicelocation.instance.option(
                    "selectedItem"
                );
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
            } else {
                this.formData.ORG_PROVINCE_ID = e.value;
            }
            this._OrgService.getorgProvince(e.value).subscribe((_) => {
                this.dsorgbyarialocation = _;
            });
        }
    }

    OnSelectProvicePresentlocationofficer(e) {
        if (e.value) {
            const data =
                this.selectPresentProvicelocationofficer.instance.option(
                    "selectedItem"
                );

            if (data) {
                this.formData.ORG_PROVINCE_OFFICER_ID = data.PROVINCE_ID;
                this.formData.ORG_PROVINCE_OFFICER_NAME =
                    data.PROVINCE_NAME_THA;
            } else {
                this.formData.ORG_PROVINCE_OFFICER_ID = e.value;
            }
            this._OrgService.getorgProvince(e.value).subscribe((_) => {
                this.dsorgbyarialocation = _;
            });
        }
    }

    OnSelectDistrictPresent(e) {
        this.presentAddress.subDistrict = [];
        this.presentAddress.postcode = [];
        this.presentAddress.disableSubDistrict = true;
        this.presentAddress.disablepostcode = true;
        this.formData.INFORMER_SUB_DISTRICT_ID = undefined;
        this.formData.INFORMER_SUB_DISTRICT_NAME_THA = undefined;
        if (e.value) {
            const data =
                this.selectPresentDistrict.instance.option("selectedItem");
            if (data) {
                this.formData.INFORMER_DISTRICT_ID = data.DISTRICT_ID;
                this.formData.INFORMER_DISTRICT_NAME_THA =
                    data.DISTRICT_NAME_THA;
            } else {
                this.formData.INFORMER_DISTRICT_ID = e.value;
            }

            this.serviceDistrict
                .GetSubDistrictOfDistrict(e.value)
                .subscribe((_) => {
                    this.presentAddress.subDistrict = _;
                    this.presentAddress.disableSubDistrict = false;
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
            const data =
                this.selectCardDistrict.instance.option("selectedItem");
            if (data) {
                this.formData.INFORMER_CARD_DISTRICT_ID = data.DISTRICT_ID;
                this.formData.INFORMER_CARD_DISTRICT_NAME_THA =
                    data.DISTRICT_NAME_THA;
            } else {
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
    OnSelectSubDistrictPresent(e) {
        this.presentAddress.postcode = [];
        this.presentAddress.disablepostcode = true;

        if (e.value) {
            const data =
                this.selectPresentSubDistrict.instance.option("selectedItem");
            if (data) {
                this.formData.INFORMER_SUB_DISTRICT_ID = data.SUB_DISTRICT_ID;
                this.formData.INFORMER_SUB_DISTRICT_NAME_THA =
                    data.SUB_DISTRICT_NAME_THA;
            } else {
                this.formData.INFORMER_SUB_DISTRICT_ID = e.value;
            }

            this.serviceSubDistrict.GetPostCode(e.value).subscribe((_) => {
                this.presentAddress.postcode = _;
                this.presentAddress.disablepostcode = false;
            });
        }
    }

    OnSelectSubDistrictCard(e) {
        this.cardAddress.postcode = [];
        this.cardAddress.disablepostcode = true;

        if (e.value) {
            const data =
                this.selectCardSubDistrict.instance.option("selectedItem");
            if (data) {
                this.formData.INFORMER_CARD_SUB_DISTRICT_ID =
                    data.SUB_DISTRICT_ID;
                this.formData.INFORMER_CARD_SUB_DISTRICT_NAME_THA =
                    data.SUB_DISTRICT_NAME_THA;
            } else {
                this.formData.INFORMER_CARD_SUB_DISTRICT_ID = e.value;
            }

            this.serviceSubDistrict.GetPostCode(e.value).subscribe((_) => {
                this.cardAddress.postcode = _;
                this.cardAddress.disablepostcode = false;
            });
        }
    }
    OnSelectPostCodePresent(e) {
        if (e.value) {
            const data =
                this.selectPresentPostcode.instance.option("selectedItem");
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
        const seperator = "^([0-9])";
        const maskSeperator = new RegExp(seperator, "g");
        const result = maskSeperator.test(event.key);
        return result;
    }
    PasteCheckNumber(event) {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData.getData("text");
        // const seperator  = '^[ก-๏\\s]+$';
        const seperator = "^([0-9])";
        const maskSeperator = new RegExp(seperator, "g");
        const result = maskSeperator.test(pastedText);
        return result;
    }
    CheckNumberSlash(event) {
        const seperator = "^[0-9/]+$";
        const maskSeperator = new RegExp(seperator, "g");
        const result = maskSeperator.test(event.key);
        return result;
    }
    PasteCheckNumberSlash(event) {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData.getData("text");
        const seperator = "^[0-9/]+$";
        const maskSeperator = new RegExp(seperator, "g");
        const result = maskSeperator.test(pastedText);
        return result;
    }
    Back(e) {
        this.mainConponent.NextIndex(this.mainConponent.indexTab - 1);
    }
    BackToList(e) {
        this.router.navigate(["/main/task-list"]);
    }

    SubmitForm(e) {
        if (this.mainConponent.formType === "add") {
            this.formInformer1.instance.validate();
            if (!this.formInformer1.instance.validate().isValid) {
                this._formValidate.ValidateForm(
                    this.formInformer1.instance.validate().brokenRules
                );
                return;
            }

            this.formData.CASE_INFORMER_FIRSTNAME = this.NameSanitize(
                this.formData.CASE_INFORMER_FIRSTNAME
            );
            this.formData.CASE_INFORMER_LASTNAME = this.NameSanitize(
                this.formData.CASE_INFORMER_LASTNAME
            );
            this.formData.INFORMER_EMAIL = this.EmailSanitize(
                this.formData.INFORMER_EMAIL
            );
            this.formData.INFORMER_TEL = this.PhoneNumberSanitize(
                this.formData.INFORMER_TEL
            );
            this.mainConponent.formDataAll.formInformer = {};
            this.formData.CASE_INFORMER_DATE = this._date.ConvertToDateFormat(
                this.formData.CASE_INFORMER_DATE
            );
            if(this.formData.CASE_INFORMER_DATE == "Invalid date" || undefined || null){
                this.alertmessagecustom('กรุณาเลือกวันเดือนปีเกิด');
                return
            }
            this.formData.NEXT = true;
            const setData = {};
            for (const key in this.formData) {
                if (this.formData[key] !== null && this.formData[key] !== undefined) {
                    setData[key] = this.formData[key];
                }
            }
            this.mainConponent.formDataAll.formInformer = setData;
            localStorage.setItem("form-informer",JSON.stringify(setData));
        }
        if(e != 'tab'){
            this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
        }
    }

    alertmessagecustom(msg) {
        Swal.fire({
            title: "ผิดพลาด!",
            text: msg ?? "กรุณากรอกข้อมูล",
            icon: "warning",
            confirmButtonText: "Ok",
        }).then(() => { });
        return;
    }

    EmailValidator(event) {
        const keyAllow = new RegExp("^[a-zA-Z0-9@._-]", "g");
        const resultAllow = keyAllow.test(event.key);
        return resultAllow;
    }
    EmailPatternCharacters(params) {
        // อีเมลสามารถมีตัวอักษร (a-z), ตัวเลข (0-9) และจุด (.) ได้ แต่ต้องไม่มีเครื่องหมาย &, =, ', +, (,), <, >, * ฯลฯ
        const makeScope = new RegExp("[^a-zA-Z0-9._@-]", "g");
        const result = params.value.match(makeScope);
        return !result;
    }
    EmailPatternDot(params) {
        // จุด (.) ห้ามติดกันมากกว่า 1 จุด
        const regex = /(\.\.)/g;
        const result = params.value.match(regex);
        return !result;
    }
    EmailPatternNameLength(params) {
        // ขึ้นต้นด้วยตัวอักษร
        const makeScope = new RegExp("^[A-Za-z]", "g");
        const result = params.value.match(makeScope);
        // ชื่อผู้ใช้ให้มีความยาว 6–30 ตัว
        const strLeng = params.value.split("@");
        const checkLength = strLeng[0].length >= 6 && strLeng[0].length < 35;
        return result && checkLength;
    }
    EmailPatternAtSign(params) {
        // กรุณาใส่เครื่องหมาย @
        const makeScope = new RegExp("@+@?", "g");
        return makeScope.test(params.value);
    }

    PhoneNumberPattern(params) {
        const makeScope = new RegExp("^[0](?=[0-9]{9,9}$)", "g");
        return makeScope.test(params.value);
    }
    NamePattern(params) {
        const seperator = new RegExp("^(นาย |นางสาว |นาง )", "g");
        const matched = params.value.match(seperator);
        return !matched;
    }
    NameValidator(event) {
        const makeScope = new RegExp("^[ก-๏]", "g");
        const result = makeScope.test(event.key);
        return result;
    }
    FacebookPattern(params) {
        const makeScope = new RegExp(
            "(?:(?:http|https)://)?(?:www.)?facebook.com/"
        );
        return makeScope.test(params.value);
    }

    /* SANITIZE */
    NameSanitize(_value) {
        return _value.replace(/([^A-Za-zก-๏]|^(นาย |นางสาว |นาง ))/g, "");
    }
    EmailSanitize(_value) {
        if (_value) {
            return _value.replace(/[^a-zA-Z0-9@._-]/g, "");
        } else {
        }
    }
    PhoneNumberSanitize(_value) {
        return _value.replace(/[^0-9]/g, "");
    }

    OninviteofficerorgChange(e) {
        if (e.value) {
            this.formData.INVITE_OFFICER_ORG = e.value;

            // console.log(this.formData.INVITE_OFFICER_ORG);
        }
    }
    Onorglocationwalkin(e){
        const data = this.selectorgwalkin.instance.option("selectedItem");
        if (data) {
            this.formData.ORG_LOCATION_WALKIN_TYPE = 1;
            // this.formData.ORG_LOCATION_ID = data.ORGANIZE_ID;
            // this.formData.ORG_LOCATION_NAME = data.ORGANIZE_NAME_THA;
            // this.formData.ORG_PROVINCE_LOCATION_ID = data.ORGANIZE_ID;
            this.formData.WALKIN_POLICE_STATION = data.ORGANIZE_NAME_THA;
            this.formData.ORG_PROVINCE_OFFICER_ID = Number(data.ORGANIZE_ARIA_CODE);
        } else {
            this.formData.WALKIN_POLICE_STATION = e.value;
        }
    }
    Onorglocation(e) {
        if (e.value) {
            const data = this.selectorg.instance.option("selectedItem");

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
            } else {
                this.formData.ORG_LOCATION_ID = e.value;
            }
        }
    }

    onvaluechangeorgmainwalkin(e, type) {
        // const data = this.selectorgmain.instance.option("selectedItem");
        this.formData.ORG_PROVINCE_MAP_AREA_ID = null;
        this.formData.ORG_PROVINCE_MAP_AREA_NAME = null;

        if (e.value) {
            if (type === 1) {
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID2 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID3 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID4 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID5 = null;
                const data: any = this.orgtype2_1.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcasewalkin.ORG_LOCATION_WALKIN_TYPE = 2;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID1 = data[0].org_id;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_NAME1 =
                    data[0].org_name;

                // * parame insert
                this.formData.ORG_LOCATION_WALKIN_TYPE = 2;
                this.formData.WALKIN_POLICE_STATION_ID = data[0].org_id;
                this.formData.WALKIN_POLICE_STATION = data[0].org_name;
            }
            if (type === 2) {
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID1 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID3 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID4 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID5 = null;
                const data: any = this.orgtype2_2.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcasewalkin.ORG_LOCATION_WALKIN_TYPE = 2;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID2 = data[0].org_id;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_NAME2 =
                    data[0].org_name;

                // * parame insert
                this.formData.ORG_LOCATION_WALKIN_TYPE = 2;
                this.formData.WALKIN_POLICE_STATION_ID = data[0].org_id;
                this.formData.WALKIN_POLICE_STATION = data[0].org_name;
            } else if (type === 3) {
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID1 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID2 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID4 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID5 = null;
                const data: any = this.orgtype2_3.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcasewalkin.ORG_LOCATION_WALKIN_TYPE = 2;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID3 = data[0].org_id;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_NAME3 =
                    data[0].org_name;

                // * parame insert
                this.formData.ORG_LOCATION_WALKIN_TYPE = 2;
                this.formData.WALKIN_POLICE_STATION_ID = data[0].org_id;
                this.formData.WALKIN_POLICE_STATION = data[0].org_name;
            } else if (type === 4) {
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID1 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID2 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID3 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID5 = null;
                const data: any = this.orgtype2_4.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcasewalkin.ORG_LOCATION_WALKIN_TYPE = 2;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID4 = data[0].org_id;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_NAME4 =
                    data[0].org_name;

                // * parame insert
                this.formData.ORG_LOCATION_WALKIN_TYPE = 2;
                this.formData.WALKIN_POLICE_STATION_ID = data[0].org_id;
                this.formData.WALKIN_POLICE_STATION = data[0].org_name;
            } else if (type === 5) {
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID1 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID2 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID3 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID4 = null;
                const data: any = this.orgtype2_5.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcasewalkin.ORG_LOCATION_WALKIN_TYPE = 2;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID5 = data[0].org_id;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_NAME5 =
                    data[0].org_name;

                // * parame insert
                this.formData.ORG_LOCATION_WALKIN_TYPE = 2;
                this.formData.WALKIN_POLICE_STATION_ID = data[0].org_id;
                this.formData.WALKIN_POLICE_STATION = data[0].org_name;
            }
        }
        // else{
        //     this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID = e.value;
        // }

        // console.log(
        //     this.formData.WALKIN_POLICE_STATION_ID,
        //     this.formData.WALKIN_POLICE_STATION
        // );
        // alert(this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID);
    }

    onvaluechangeorgmain(e, type) {
        // const data = this.selectorgmain.instance.option("selectedItem");
        this.formData.ORG_PROVINCE_MAP_AREA_ID = null;
        this.formData.ORG_PROVINCE_MAP_AREA_NAME = null;

        if (e.value) {
            if (type == 1) {
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = null;
                const data: any = this.orgtype2_1.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = data[0].org_id;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_NAME1 =
                    data[0].org_name;

                //parame insert
                this.formData.ORG_LOCATION_TYPE = 2;
                this.formData.ORG_LOCATION_ID = data[0].org_id;
                this.formData.ORG_LOCATION_NAME = data[0].org_name;
            }
            if (type == 2) {
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = null;
                const data: any = this.orgtype2_2.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = data[0].org_id;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_NAME2 =
                    data[0].org_name;

                //parame insert
                this.formData.ORG_LOCATION_TYPE = 2;
                this.formData.ORG_LOCATION_ID = data[0].org_id;
                this.formData.ORG_LOCATION_NAME = data[0].org_name;
            } else if (type == 3) {
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = null;
                const data: any = this.orgtype2_3.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = data[0].org_id;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_NAME3 =
                    data[0].org_name;

                //parame insert
                this.formData.ORG_LOCATION_TYPE = 2;
                this.formData.ORG_LOCATION_ID = data[0].org_id;
                this.formData.ORG_LOCATION_NAME = data[0].org_name;
            } else if (type == 4) {
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = null;
                const data: any = this.orgtype2_4.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = data[0].org_id;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_NAME4 =
                    data[0].org_name;

                //parame insert
                this.formData.ORG_LOCATION_TYPE = 2;
                this.formData.ORG_LOCATION_ID = data[0].org_id;
                this.formData.ORG_LOCATION_NAME = data[0].org_name;
            } else if (type == 5) {
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = null;
                const data: any = this.orgtype2_5.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = data[0].org_id;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_NAME5 =
                    data[0].org_name;

                //parame insert
                this.formData.ORG_LOCATION_TYPE = 2;
                this.formData.ORG_LOCATION_ID = data[0].org_id;
                this.formData.ORG_LOCATION_NAME = data[0].org_name;
            }
        }
        // else{
        //     this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID = e.value;
        // }

        // console.log(
        //     this.formData.ORG_LOCATION_ID,
        //     this.formData.ORG_LOCATION_NAME
        // );
        // alert(this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID);
    }

    onvaluechangeorgcenterwalkin(e) {
        if (e.value) {
            const data: any = this.orgtype3.filter((r) => r.org_id === e.value);
            // console.log(data[0].org_id, data[0].org_name);
            // this.formdataOrgsendcase.ORG_LOCATION_TYPE = 3;
            // this.formdataOrgsendcase.ORG_LOCATION_CENTER_ID = data[0].org_id;
            this.formdataOrgsendcasewalkin.WALKIN_POLICE_STATION =
                data[0].org_name;

            //parame insert
            this.formData.ORG_LOCATION_WALKIN_TYPE = 3;
            this.formData.WALKIN_POLICE_STATION_ID = 2375;
            this.formData.WALKIN_POLICE_STATION = "กองบัญชาการตำรวจสอบสวนกลาง";
            // this.formData.WALKIN_POLICE_STATION_ID = data[0].org_id;
            // this.formData.WALKIN_POLICE_STATION = data[0].org_name;
        } else {
            this.formdataOrgsendcasewalkin.ORG_LOCATION_CENTER_ID = e.value;
        }
        // alert(this.formdataOrgsendcase.ORG_LOCATION_CENTER_ID);
    }

    onvaluechangeorgcenter(e) {
        if (e.value) {
            const data: any = this.orgtype3.filter((r) => r.org_id === e.value);
            // console.log(data[0].org_id, data[0].org_name);
            this.formdataOrgsendcase.ORG_LOCATION_TYPE = 3;
            this.formdataOrgsendcase.ORG_LOCATION_CENTER_ID = data[0].org_id;
            this.formdataOrgsendcase.ORG_LOCATION_CENTER_NAME =
                data[0].org_name;

            //parame insert
            this.formData.ORG_LOCATION_TYPE = 3;
            this.formData.ORG_LOCATION_ID = 2375;
            this.formData.ORG_LOCATION_NAME = "กองบัญชาการตำรวจสอบสวนกลาง";
            // console.log(this.formData);
        } else {
            this.formdataOrgsendcase.ORG_LOCATION_CENTER_ID = e.value;
        }
        // alert(this.formdataOrgsendcase.ORG_LOCATION_CENTER_ID);
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

    additemlistbank() {
        this.checktypeeditbanklist = "add";

        this.popup = true;
        this.formbanklistarray = {};
    }
    ItemDamageClose() {
        this.popup = false;
    }
    ItemDamageSave() {
        this.popup = false;
        if (this.checktypeeditbanklist == "add") {
            this.personalbanklist.push({
                PERSONAL_BANK_ID: this.formbanklistarray.PERSONAL_BANK_ID,
                PERSONAL_BANK_NAME: this.formbanklistarray.PERSONAL_BANK_NAME,
                PERSONAL_ACCOUNT_ID: this.formbanklistarray.PERSONAL_ACCOUNT_ID,
            });
            this.popupFormData = this.personalbanklist;
            this.formData.Bank_personal_list = this.personalbanklist;
        } else {
            this.popupFormData[this.indexcheckdeletebanklist].PERSONAL_BANK_ID =
                this.formbanklistarray.PERSONAL_BANK_ID;
            this.popupFormData[
                this.indexcheckdeletebanklist
            ].PERSONAL_BANK_NAME = this.formbanklistarray.PERSONAL_BANK_NAME;
            this.popupFormData[
                this.indexcheckdeletebanklist
            ].PERSONAL_ACCOUNT_ID = this.formbanklistarray.PERSONAL_ACCOUNT_ID;
        }
    }

    Editlistbank(rowindex, data) {
        this.popup = true;
        this.checktypeeditbanklist = "Edit";
        this.formbanklistarray.PERSONAL_ACCOUNT_ID = data.PERSONAL_ACCOUNT_ID;
        this.formbanklistarray.PERSONAL_BANK_ID = data.PERSONAL_BANK_ID;
        this.indexcheckdeletebanklist = rowindex;
    }

    Deletelistbank(rowindex) {
        this.personalbanklist.splice(rowindex, 1);

        this.popupFormData = this.personalbanklist;
    }

    BankNumberPattern(params) {
        const makeScopeIden = new RegExp("^([0-9]{10,15})", "g");
        return makeScopeIden.test(params.value);
    }

    OnSelectProvicemaparea(e) {
        if (e.value) {
            const data =
                this.selectProvicemaparea.instance.option("selectedItem");

            if (data) {
                this.formData.ORG_PROVINCE_MAP_AREA_ID = data.PROVINCE_ID;
                this.formData.ORG_PROVINCE_MAP_AREA_NAME =
                    data.PROVINCE_NAME_THA;
                //parame insert
                this.formData.ORG_LOCATION_TYPE = 2;
                this.formData.ORG_LOCATION_ID = data.ORG_ID;
                this.formData.ORG_LOCATION_NAME = data.ORGANIZE_FULL_NAME;
            } else {
                this.formData.ORG_PROVINCE_MAP_AREA_ID = e.value;
            }
        }
    }

    onWaysValueChanged(e) { }

    citizenPattern(params) {
        const makeScope = new RegExp(
            '^[0-9]{1}[0-9]{4}[0-9]{5}[0-9]{2}[0-9]{1}$'
        );
        return makeScope.test(params.value);
    }
}
