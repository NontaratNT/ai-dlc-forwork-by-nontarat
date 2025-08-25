import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxFormComponent, DxSelectBoxComponent } from "devextreme-angular";
import Swal from "sweetalert2";
import { CmsOccupationsService } from "src/app/services/cms-occupations.service";
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
import { CmsCaseTypeSubService, ICaseTypeSub } from "src/app/services/cms-case-type-sub.service";
import { FormValidatorService } from "src/app/services/form-validator.service";
import { ViewAddressComponent } from "../../view-address/view-address.component";
import { IssueOnlineService } from "src/app/services/issue-online.service";
import { OnlineCaseService } from "src/app/services/online-case.service";
import { IOrganizeInfo } from "share-ui/lib/models/organize-info.service";
import { OrgService } from "src/app/services/org.service";
import { switchMap } from "rxjs/operators";
import { DatePipe } from "@angular/common";
import { formatDate } from "devextreme/localization";

@Component({
    selector: "app-issue-online-event",
    templateUrl: "./issue-online-event.component.html",
    styleUrls: ["./issue-online-event.component.scss"]
})
export class IssueOnlineEventComponent implements OnInit {

    @ViewChild('formEvent1', { static: false }) formEvent1: DxFormComponent;
    @ViewChild('formChannel', { static: false }) formChannel: DxFormComponent;
    @ViewChild("selectCaseType", { static: false }) selectCaseType: DxSelectBoxComponent;
    @ViewChild("selectPresentProvicelocationwalkin", { static: false }) selectPresentProvicelocationWalkin: DxSelectBoxComponent;;
    @ViewChild("selectorgwalkin", { static: false }) selectorgwalkin: DxSelectBoxComponent;
    @ViewChild("selectPresentProvicelocation", { static: false }) selectPresentProvicelocation: DxSelectBoxComponent;
    @ViewChild("selectorg", { static: false }) selectorg: DxSelectBoxComponent;
    @ViewChild("formInformer3", { static: false }) formInformer3: DxFormComponent;
    @ViewChild("formInformertype1", { static: false }) formInformertype1: DxFormComponent;
    @ViewChild("formInformertype2", { static: false }) formInformertype2: DxFormComponent;
    @ViewChild("formInformertype3", { static: false }) formInformertype3: DxFormComponent;
    public mainConponent: IssueOnlineContainerComponent;
    personalInfo: any = {};
    isLoading = false;
    occupationList = [];
    formData: any = {};
    formDataChannel: any = {};
    dataLocation: any = {};
    presentAddress: any = {};
    province = [];
    bankInfoList: any = [];
    socialInfo = [];
    listCaseType = [];
    formReadOnly = false;
    formValidate = true;
    formType = "add";
    loadDateBox = false;
    minBirthDate: Date;
    maxBirthDate: Date;
    datePhone: Date;

    checkboxaddresscard = false;

    locationRender = '';
    userType = "mySelf";
    caseOpen = false;
    caseType = "";
    issueOnline: any;
    checkblessing = false;
    recovery = false;
    edit = false;

    maxDateValue: Date = new Date();

    checkboxLocationwalkin: any = {};
    formdataOrgsendcasewalkin: any = {};
    dswalkinstatuspolice: IOrganizeInfo[];
    dsorgbyarialocation: IOrganizeInfo[];
    checkboxLocation: any = {};

    channel_tel = false;
    indexEdit = 0;
    channel_data: any = [];

    walkInType = [
        { ID: 1, TEXT: "ยังไม่เคยพบ" },
        { ID: 2, TEXT: "เคยพบแล้ว" },
    ];
    radiocheckorganize1 = [{ id: 1, text: "สถานีตำรวจ" }];
    radiocheckorganize2 = [{ id: 2, text: "กองบัญชาการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี" }];
    radiocheckorganize3 = [{ id: 3, text: "กองบัญชาการตำรวจสอบสวนกลาง (ลาดพร้าว)" }];
    orgUnits = [
        {
            org_id: 3536,
            org_name: "บก.สอท.1",
            org_locations: ["ศูนย์ราชการแจ้งวัฒนะ จ.กรุงเทพฯ"],
            location_detail: "รับผิดชอบพื้นที่ของ กองบัญชาการตำรวจนครบาล (บช.น.)<br>• พื้นที่: กรุงเทพมหานคร"
        },
        {
            org_id: 3548,
            org_name: "บก.สอท.2",
            org_locations: ["เมืองทองธานี จ.นนทบุรี"],
            location_detail: "รับผิดชอบพื้นที่ของ ตำรวจภูธรภาค 1, ภาค 2 และ ภาค 7 <br> "
                + "• <b>ตำรวจภูธรภาค 1:</b> นนทบุรี, ปทุมธานี, สมุทรปราการ, พระนครศรีอยุธยา, อ่างทอง, สิงห์บุรี, ลพบุรี, ชัยนาท, สระบุรี <br> "
                + "• <b>ตำรวจภูธรภาค 2:</b> ชลบุรี, ระยอง, จันทบุรี, ตราด, ฉะเชิงเทรา, ปราจีนบุรี, สระแก้ว, นครนายก <br> "
                + "• <b>ตำรวจภูธรภาค 7:</b> นครปฐม, ราชบุรี, สุพรรณบุรี, กาญจนบุรี, สมุทรสาคร, สมุทรสงคราม, เพชรบุรี, ประจวบคีรีขันธ์"
        },
        {
            org_id: 3559,
            org_name: "บก.สอท.3",
            org_locations: ["1.ศูนย์ราชการแจ้งวัฒนะ จ.กรุงเทพฯ", "2.ถ.มิตรภาพ ต.ในเมือง อ.เมือง จ.ขอนแก่น"],
            location_detail: "รับผิดชอบพื้นที่ของ ตำรวจภูธรภาค 3 และ ภาค 4 <br> "
                + "• <b>ตำรวจภูธรภาค 3:</b> นครราชสีมา, บุรีรัมย์, สุรินทร์, ศรีสะเกษ, ชัยภูมิ <br> "
                + "• <b>ตำรวจภูธรภาค 4:</b> ขอนแก่น, มหาสารคาม, กาฬสินธุ์, ร้อยเอ็ด, อุดรธานี, หนองบัวลำภู, หนองคาย, เลย, สกลนคร, นครพนม, บึงกาฬ, มุกดาหาร"
        },
        {
            org_id: 3567,
            org_name: "บก.สอท.4",
            org_locations: ["1.ศูนย์ราชการแจ้งวัฒนะ จ.กรุงเทพฯ", "2.ต.ป่าแดด อ.เมืองเชียงใหม่ จ.เชียงใหม่"],
            location_detail: "รับผิดชอบพื้นที่ของ ตำรวจภูธรภาค 5 และ ภาค 6 <br> "
                + "• <b>ตำรวจภูธรภาค 5:</b> เชียงใหม่, เชียงราย, ลำพูน, ลำปาง, แม่ฮ่องสอน, พะเยา, แพร่, น่าน <br> "
                + "• <b>ตำรวจภูธรภาค 6:</b> พิษณุโลก, เพชรบูรณ์, พิจิตร, อุตรดิตถ์, กำแพงเพชร, สุโขทัย, ตาก, นครสวรรค์, อุทัยธานี"
        },
        {
            org_id: 3578,
            org_name: "บก.สอท.5",
            org_locations: ["1.ศูนย์ราชการแจ้งวัฒนะ จ.กรุงเทพฯ", "2.ต.บางกุ้ง อ.เมืองสุราษฎร์ธานี จ.สุราษฎร์ธานี"],
            location_detail: "รับผิดชอบพื้นที่ของ ตำรวจภูธรภาค 8 และ ภาค 9 <br> "
                + "• <b>ตำรวจภูธรภาค 8:</b> ชุมพร, สุราษฎร์ธานี, นครศรีธรรมราช, พังงา, ภูเก็ต, ระนอง, กระบี่ <br> "
                + "• <b>ตำรวจภูธรภาค 9:</b> ตรัง, พัทลุง, สงขลา, สตูล, ปัตตานี, ยะลา, นราธิวาส"
        }
    ];

    orgUnitsNew: any;
    orgUnitsNewWalkin: any;

    orgtype3 = [
        { org_id: 2541, org_name: "กองบังคับการปราบปรามการกระทำความผิดเกี่ยวกับอาชญากรรมทางเศรษฐกิจ                          (บก.ปอศ.)" },
        { org_id: 2397, org_name: "กองบังคับการปราบปรามการกระทำความผิดเกี่ยวกับการคุ้มครองผู้บริโภค                              (บก.ปคบ.)" },
        { org_id: 2614, org_name: "กองบังคับการปราบปรามการกระทำผิดเกี่ยวกับอาชญากรรมทางเทคโนโลยี กองบัญชาการตำรวจสอบสวนกลาง  (บก.ปอท.)" },
        { org_id: 2605, org_name: "กองบังคับการปราบปรามการกระทำความเกี่ยวกับการค้ามนุษย์                                      (บก.ปคม.)" },
        { org_id: 2387, org_name: 'กองบังคับการปราบปราม                                                                 (บก.ป.)' }
    ];


    provinceResponsibility = [
        { province: "กรุงเทพมหานคร", org_name: "บก.สอท.1", org_id: 3536, province_id: 10 },
        { province: "นนทบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 12 },
        { province: "ปทุมธานี", org_name: "บก.สอท.2", org_id: 3548, province_id: 13 },
        { province: "สมุทรปราการ", org_name: "บก.สอท.2", org_id: 3548, province_id: 11 },
        { province: "พระนครศรีอยุธยา", org_name: "บก.สอท.2", org_id: 3548, province_id: 14 },
        { province: "อ่างทอง", org_name: "บก.สอท.2", org_id: 3548, province_id: 15 },
        { province: "สิงห์บุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 17 },
        { province: "ลพบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 16 },
        { province: "ชัยนาท", org_name: "บก.สอท.2", org_id: 3548, province_id: 18 },
        { province: "สระบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 19 },
        { province: "ชลบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 20 },
        { province: "ระยอง", org_name: "บก.สอท.2", org_id: 3548, province_id: 21 },
        { province: "จันทบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 22 },
        { province: "ตราด", org_name: "บก.สอท.2", org_id: 3548, province_id: 23 },
        { province: "ฉะเชิงเทรา", org_name: "บก.สอท.2", org_id: 3548, province_id: 24 },
        { province: "ปราจีนบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 25 },
        { province: "สระแก้ว", org_name: "บก.สอท.2", org_id: 3548, province_id: 27 },
        { province: "นครนายก", org_name: "บก.สอท.2", org_id: 3548, province_id: 26 },
        { province: "นครปฐม", org_name: "บก.สอท.2", org_id: 3548, province_id: 73 },
        { province: "ราชบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 70 },
        { province: "สุพรรณบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 72 },
        { province: "กาญจนบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 71 },
        { province: "สมุทรสาคร", org_name: "บก.สอท.2", org_id: 3548, province_id: 74 },
        { province: "สมุทรสงคราม", org_name: "บก.สอท.2", org_id: 3548, province_id: 75 },
        { province: "เพชรบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 76 },
        { province: "ประจวบคีรีขันธ์", org_name: "บก.สอท.2", org_id: 3548, province_id: 77 },
        { province: "นครราชสีมา", org_name: "บก.สอท.3", org_id: 3559, province_id: 30 },
        { province: "บุรีรัมย์", org_name: "บก.สอท.3", org_id: 3559, province_id: 31 },
        { province: "สุรินทร์", org_name: "บก.สอท.3", org_id: 3559, province_id: 32 },
        { province: "ศรีสะเกษ", org_name: "บก.สอท.3", org_id: 3559, province_id: 33 },
        { province: "ชัยภูมิ", org_name: "บก.สอท.3", org_id: 3559, province_id: 36 },
        { province: "ขอนแก่น", org_name: "บก.สอท.3", org_id: 3559, province_id: 40 },
        { province: "มหาสารคาม", org_name: "บก.สอท.3", org_id: 3559, province_id: 44 },
        { province: "กาฬสินธุ์", org_name: "บก.สอท.3", org_id: 3559, province_id: 46 },
        { province: "ร้อยเอ็ด", org_name: "บก.สอท.3", org_id: 3559, province_id: 45 },
        { province: "อุดรธานี", org_name: "บก.สอท.3", org_id: 3559, province_id: 41 },
        { province: "หนองบัวลำภู", org_name: "บก.สอท.3", org_id: 3559, province_id: 39 },
        { province: "หนองคาย", org_name: "บก.สอท.3", org_id: 3559, province_id: 43 },
        { province: "เลย", org_name: "บก.สอท.3", org_id: 3559, province_id: 42 },
        { province: "สกลนคร", org_name: "บก.สอท.3", org_id: 3559, province_id: 47 },
        { province: "นครพนม", org_name: "บก.สอท.3", org_id: 3559, province_id: 48 },
        { province: "บึงกาฬ", org_name: "บก.สอท.3", org_id: 3559, province_id: 38 },
        { province: "มุกดาหาร", org_name: "บก.สอท.3", org_id: 3559, province_id: 49 },
        { province: "อุบลราชธานี", org_name: "บก.สอท.3", org_id: 3559, province_id: 34 },
        { province: "ยโสธร", org_name: "บก.สอท.3", org_id: 3559, province_id: 35 },
        { province: "อำนาจเจริญ", org_name: "บก.สอท.3", org_id: 3559, province_id: 37 },
        { province: "เชียงใหม่", org_name: "บก.สอท.4", org_id: 3567, province_id: 50 },
        { province: "เชียงราย", org_name: "บก.สอท.4", org_id: 3567, province_id: 57 },
        { province: "ลำพูน", org_name: "บก.สอท.4", org_id: 3567, province_id: 51 },
        { province: "ลำปาง", org_name: "บก.สอท.4", org_id: 3567, province_id: 52 },
        { province: "แม่ฮ่องสอน", org_name: "บก.สอท.4", org_id: 3567, province_id: 58 },
        { province: "พะเยา", org_name: "บก.สอท.4", org_id: 3567, province_id: 56 },
        { province: "แพร่", org_name: "บก.สอท.4", org_id: 3567, province_id: 54 },
        { province: "น่าน", org_name: "บก.สอท.4", org_id: 3567, province_id: 55 },
        { province: "พิษณุโลก", org_name: "บก.สอท.4", org_id: 3567, province_id: 65 },
        { province: "เพชรบูรณ์", org_name: "บก.สอท.4", org_id: 3567, province_id: 67 },
        { province: "พิจิตร", org_name: "บก.สอท.4", org_id: 3567, province_id: 66 },
        { province: "อุตรดิตถ์", org_name: "บก.สอท.4", org_id: 3567, province_id: 53 },
        { province: "กำแพงเพชร", org_name: "บก.สอท.4", org_id: 3567, province_id: 62 },
        { province: "สุโขทัย", org_name: "บก.สอท.4", org_id: 3567, province_id: 64 },
        { province: "ตาก", org_name: "บก.สอท.4", org_id: 3567, province_id: 63 },
        { province: "นครสวรรค์", org_name: "บก.สอท.4", org_id: 3567, province_id: 60 },
        { province: "อุทัยธานี", org_name: "บก.สอท.4", org_id: 3567, province_id: 61 },
        { province: "ชุมพร", org_name: "บก.สอท.5", org_id: 3578, province_id: 86 },
        { province: "สุราษฎร์ธานี", org_name: "บก.สอท.5", org_id: 3578, province_id: 84 },
        { province: "นครศรีธรรมราช", org_name: "บก.สอท.5", org_id: 3578, province_id: 80 },
        { province: "พังงา", org_name: "บก.สอท.5", org_id: 3578, province_id: 82 },
        { province: "ภูเก็ต", org_name: "บก.สอท.5", org_id: 3578, province_id: 83 },
        { province: "ระนอง", org_name: "บก.สอท.5", org_id: 3578, province_id: 85 },
        { province: "กระบี่", org_name: "บก.สอท.5", org_id: 3578, province_id: 81 },
        { province: "ตรัง", org_name: "บก.สอท.5", org_id: 3578, province_id: 92 },
        { province: "พัทลุง", org_name: "บก.สอท.5", org_id: 3578, province_id: 93 },
        { province: "สงขลา", org_name: "บก.สอท.5", org_id: 3578, province_id: 90 },
        { province: "สตูล", org_name: "บก.สอท.5", org_id: 3578, province_id: 91 },
        { province: "ปัตตานี", org_name: "บก.สอท.5", org_id: 3578, province_id: 94 },
        { province: "ยะลา", org_name: "บก.สอท.5", org_id: 3578, province_id: 95 },
        { province: "นราธิวาส", org_name: "บก.สอท.5", org_id: 3578, province_id: 96 }
    ];

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
    showSelectORG = false;
    isOCPB = false;

    constructor(
        private servBankInfo: BankInfoService,
        private _caseTypeSub: CmsCaseTypeSubService,
        private _formValidate: FormValidatorService,
        private _OnlineCaseService: OnlineCaseService,
        private _OrgService: OrgService,
        private datePipe: DatePipe,
    ) {

    }

    ngOnInit(): void {
        this.maxDateValue.setHours(this.maxDateValue.getHours() + 1);
        this.isLoading = true;
        this.caseOpen = false;

        this.servBankInfo.GetCaseType().pipe(
            switchMap(_ => {
                this.formData.CASE_TYPE_ID = null;
                this.listCaseType = _;
                return this._OrgService.getorgwalkinall();
            })
        ).subscribe(dsorgbyarialocation => {
            this.dsorgbyarialocation = dsorgbyarialocation;
            this.dswalkinstatuspolice = dsorgbyarialocation;
            this.SetDefaultData();
        }, error => {
            if (error.status === 500 || error.status === 524) {
                this.mainConponent.checkReload(2);
            }
        });
        this.presentAddress.disableDistrict = true;
        this.presentAddress.disableSubDistrict = true;
        this.presentAddress.disablepostcode = true;
    }
    async OnSelectCaseType(e) {
        if (e.value) {
            const data = this.selectCaseType.instance.option("selectedItem");
            if (data) {
                this.formData.CASE_TYPE_ID = data.CASE_TYPE_ID;
                this.formData.CASE_TYPE_NAME = data.CASE_TYPE_NAME;
                this.caseType = data.CASE_TYPE_DESC;
                this.caseOpen = true;
                this.channel_tel = data.CASE_TYPE_ID == 66 || data.CASE_TYPE_ID == 67 ? true : false;
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
    async SetDefaultData() {
        try {
            this.userType = this.mainConponent.userType;
            this.province = this.mainConponent.province;
            this.formData.CASE_TYPE_SUB_ID = undefined;
            if (this.mainConponent.formType === 'add') {
                localStorage.setItem("form-index", "3");
                this.locationRender = 'add';
                this.formType = "add";
                this.showSelectORG = true;
                this.formReadOnly = false;
                this.formValidate = true;
                if (localStorage.getItem("form-event")) {
                    this.formData = JSON.parse(localStorage.getItem("form-event"));
                    this.recovery = true;
                    this.channel_tel = this.formData.CASE_TYPE_ID == 66 || this.formData.CASE_TYPE_ID == 67 ? true : false;
                    if (this.channel_tel) {
                        if (localStorage.getItem("form-villain")) {
                            this.channel_data = JSON.parse(localStorage.getItem("form-villain")).CASE_CHANNEL;
                        }
                    }
                }
                if (localStorage.getItem("form-blessing")) {
                    const dataCheck = JSON.parse(localStorage.getItem("form-blessing"));
                    console.log(dataCheck);
                    if (dataCheck?.IsOCPB) {
                        this.isOCPB = true;
                        this.formData.ORG_LOCATION_ID = 1;
                        this.listCaseType = [
                            {
                                "CASE_TYPE_ID": 60,
                                "CASE_TYPE_NAME": "หลอกลวงซื้อขายสินค้าหรือบริการ ที่ไม่มีลักษณะเป็นขบวนการ",
                                "CASE_TYPE_DESC": "คดีหลอกลวงซื้อขายสินค้าหรือบริการ ที่ไม่มีลักษณะเป็นขบวนการ หมายความถึง\r\n\t\tคดีที่กระทำผิดโดยทุจริตหลอกลวงมาแต่ต้น ด้วยการประกาศ หรือโฆษณาขายสินค้าหรือบริการผ่านสื่อสังคมออนไลน์ เชิญชวนให้ผู้เสียหายเข้าซื้อสินค้าหรือใช้บริการ เมื่อผู้เสียหายชำระเงินแล้ว ปรากฏว่าไม่ได้รับสินค้าหรือบริการนั้น หรือส่งสินค้าหรือบริการให้ในลักษณะที่มีเจตนาฉ้อโกง หรือส่งสินค้าให้ไม่ตรงตามโฆษณา ทั้งในด้านแหล่งกำเนิด สภาพ คุณภาพ หรือปริมาณแห่งสินค้า หรือผลิตภัณฑ์นั้นอันเป็นเท็จ และรวมถึงการหลอกให้ผู้ขายสินค้าในระบบออนไลน์ส่งสินค้าให้ โดยมีเจตนาตั้งแต่ต้นที่จะไม่ชำระค่าสินค้านั้น",
                                "CASE_TYPE_ABBR": "หลอกลวงซื้อขายสินค้าหรือบริการ ที่ไม่มีลักษณะเป็นขบวนการ",
                                "CASE_TYPE_GROUP_ID": 1,
                                "CASE_ORG_TYPE_ID": 1
                            },
                            {
                                "CASE_TYPE_ID": 72,
                                "CASE_TYPE_NAME": "หลอกลวงซื้อขายสินค้าหรือบริการ ที่มีลักษณะเป็นขบวนการ",
                                "CASE_TYPE_DESC": "คดีหลอกลวงซื้อขายสินค้าหรือบริการ ที่มีลักษณะเป็นขบวนการ หมายความถึง\r\n\t\tคดีที่มีลักษณะการกระทำผิดตามลักษณะหลอกขายสินค้าหรือบริการ และพบความเชื่อมโยงของคนร้ายในลักษณะที่เป็นขบวนการ หรือมีผู้เสียหายเป็นจำนวนมากหลายพื้นที่ตั้งแต่ ๑๐ รายขึ้นไป",
                                "CASE_TYPE_ABBR": "หลอกลวงซื้อขายสินค้าหรือบริการ ที่มีลักษณะเป็นขบวนการ",
                                "CASE_TYPE_GROUP_ID": 13,
                                "CASE_ORG_TYPE_ID": 2
                            }
                        ];
                    }
                }
            } else {
                const _case_id = Number(sessionStorage.getItem("case_id"));
                const dataForm = await this._OnlineCaseService.getbycaseId(_case_id).toPromise();
                var _gettype = this.listCaseType.find(x => x.CASE_TYPE_ID == dataForm.CASE_TYPE_ID);
                this.showSelectORG = false;
                this.formType = "edit";
                this.formReadOnly = true;
                this.formValidate = false;
                this.formData = dataForm;
                this.formData.CASE_TYPE_ID = dataForm.CASE_TYPE_ID;
                this.formData.CASE_TYPE_NAME = _gettype.CASE_TYPE_NAME;
            }
            this.isLoading = false;
        } catch (error) {
            // console.log(error);
            this.SetDefaultData();
        }


    }

    Back(e) {
        this.mainConponent.NextIndex(this.mainConponent.indexTab - 1);
    }

    async SubmitForm(e) {
        if (this.mainConponent.formType === 'add') {
            this.formEvent1.instance.validate();
            if (!this.formEvent1.instance.validate().isValid) {
                this._formValidate.ValidateForm(this.formEvent1.instance.validate().brokenRules);
                this.mainConponent.checkValidate = true;
                return;
            }
            // console.log(this.formData.ORG_LOCATION_TYPE , " ", this.formData.ORG_LOCATION_ID);
            console.log(this.formData.ORG_LOCATION_ID);
            console.log(this.formData.ORG_LOCATION_TYPE);

            if (!this.isOCPB) {
                if (this.formData.ORG_LOCATION_TYPE == 1) {
                    if (!this.formData.ORG_LOCATION_ID) {
                        this.alertmessagecustom("กรุณาเลือกสถานี");
                        return;
                    }
                } else if (this.formData.ORG_LOCATION_TYPE == 2) {
                    if (!this.formData.ORG_LOCATION_ID) {
                        this.alertmessagecustom("กรุณาเลือกสถานี");
                        return;
                    }
                } else if (this.formData.ORG_LOCATION_TYPE == 3) {
                    if (!this.formData.ORG_LOCATION_ID) {
                        this.alertmessagecustom("กรุณาเลือกสถานี");
                        return;
                    }
                } else if (!this.formData.ORG_LOCATION_TYPE) {
                    this.alertmessagecustom("กรุณาเลือกสถานี");
                    return;
                } else {
                    if (!this.formData.ORG_LOCATION_ID) {
                        this.alertmessagecustom("กรุณาเลือกสถานี");
                        return;
                    }
                }
            }else{
                this.formData.ORG_LOCATION_ID = 1;
            }

            // console.log(this.formData);
            if (this.formData.CASE_TYPE_ID === null || this.formData.CASE_TYPE_ID === 7) {
                Swal.fire({
                    title: "ผิดพลาด!",
                    text: "กรุณาเลือกประเภทคดี",
                    icon: "warning",
                    confirmButtonText: "Ok",
                }).then(() => { });
                this.mainConponent.checkValidate = true;
                return;
            }
            this.mainConponent.checkValidate = false;
            this.mainConponent.formDataAll.formEvent = {};
            const setData = {};
            for (const key in this.formData) {
                if (this.formData[key] !== null && this.formData[key] !== undefined) {
                    setData[key] = this.formData[key];
                }
            }

            this.mainConponent.formDataAll.formVaillain = Object.assign({}, { CASE_CHANNEL: this.channel_data });
            localStorage.setItem("form-villain", JSON.stringify(Object.assign({}, { CASE_CHANNEL: this.channel_data })));

            const setDataFormAll = Object.assign({}, setData);
            this.mainConponent.formDataAll.formEvent = setDataFormAll;
            // console.log(setDataFormAll);
            localStorage.setItem("form-event", JSON.stringify(setDataFormAll));

        }
        if (e != 'tab') {
            this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
        }
    }

    OnWalkInChange(e) {
        if (e.value) {
            this.formData.IS_WALKIN_RADIO = e.value;
            this.formData.IS_WALKIN = e.value === 1 ? false : true;
        }
    }

    onvaluecheckboxlocationchangewalkin(e, type_location) {
        this.formdataOrgsendcasewalkin = {};
        if (type_location === 1) {
            this.checkboxLocationwalkin.location_type1 = e.value;
            this.checkboxLocationwalkin.location_type2 = 0;
            if (e.value === 1) {
                this.formData.WALKIN_POLICE_STATION_ID = null;
                this.formData.location_type1 = 1;
                this.formData.ORG_LOCATION_WALKIN_TYPE = 1;
            }
        } else if (type_location === 2) {
            this.checkboxLocationwalkin.location_type2 = e.value;
            this.checkboxLocationwalkin.location_type1 = e.value;
            this.formData.ORG_PROVINCE_OFFICER_ID = undefined;
            this.formData.WALKIN_POLICE_STATION = undefined;
            if (e.value === 2) {
                this.formData.WALKIN_POLICE_STATION_ID = null;
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
                this.formData.WALKIN_POLICE_STATION_ID = 2375;
                this.formData.WALKIN_POLICE_STATION = "กองบัญชาการตำรวจสอบสวนกลาง";
            }
        }
    }

    OnSelectProvicePresentlocationWalkin(e) {
        if (e.value) {
            const data =
                this.selectPresentProvicelocationWalkin.instance.option(
                    "selectedItem"
                );
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

    Onorglocationwalkin(e) {
        const data = this.selectorgwalkin.instance.option("selectedItem");
        if (data) {
            this.formData.ORG_LOCATION_WALKIN_TYPE = 1;
            this.formData.WALKIN_POLICE_STATION = data.ORGANIZE_NAME_THA;
            this.formData.ORG_PROVINCE_OFFICER_ID = Number(data.ORGANIZE_ARIA_CODE);
        } else {
            this.formData.WALKIN_POLICE_STATION = e.value;
        }
    }

    onvaluechangeorgmainwalkin(e) {
        this.formData.ORG_PROVINCE_MAP_AREA_ID = null;
        this.formData.ORG_PROVINCE_MAP_AREA_NAME = null;

        if (!e.value) return;

        // Reset all ORG_LOCATION_MAIN_WALKIN_ID fields
        this.formdataOrgsendcasewalkin[`ORG_LOCATION_MAIN_WALKIN_ID`] = null;
        this.formdataOrgsendcasewalkin[`ORG_LOCATION_MAIN_WALKIN_NAME`] = null;

        // Filter the selected organization
        const selectedData = this.orgUnits.find((r) => r.org_id === e.value);
        if (!selectedData) return;

        // Set selected values
        this.formdataOrgsendcasewalkin.ORG_LOCATION_WALKIN_TYPE = 2;
        this.formdataOrgsendcasewalkin[`ORG_LOCATION_MAIN_WALKIN_ID`] = selectedData.org_id;
        this.formdataOrgsendcasewalkin[`ORG_LOCATION_MAIN_WALKIN_NAME`] = selectedData.org_name;

        // Assign values to formData for insertion
        this.formData.ORG_LOCATION_WALKIN_TYPE = 2;
        this.formData.WALKIN_POLICE_STATION_ID = selectedData.org_id;
        this.formData.WALKIN_POLICE_STATION = selectedData.org_name;
    }

    OnSelectProviceCCIBWalkin(e, tag: DxSelectBoxComponent) {
        if (e.value) {
            const data = tag.instance.option("selectedItem");
            if (data) {
                this.formData.ORG_PROVINCE_ID_CCIB_WALKIN_ID = data.PROVINCE_ID;
                this.formData.ORG_PROVINCE_CCIB_WALKIN_NAME = data.PROVINCE_NAME_THA;
                const orgValue = this.provinceResponsibility.filter((r) => r.province_id === data.PROVINCE_ID);
                this.orgUnitsNewWalkin = this.orgUnits.filter((r) => r.org_id === orgValue[0]?.org_id);
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID = orgValue[0]?.org_id;
                this.formData.ORG_LOCATION_WALKIN_TYPE = 2;
                this.formData.WALKIN_POLICE_STATION_ID = orgValue[0]?.org_id;
                this.formData.WALKIN_POLICE_STATION = orgValue[0]?.org_name;
            } else {
                this.formData.ORG_PROVINCE_ID_CCIB_WALKIN_ID = e.value;
            }
        }
    }

    OnSelectProviceCCIB(e, tag: DxSelectBoxComponent) {
        if (e.value) {
            const data = tag.instance.option("selectedItem");
            if (data) {
                this.formData.ORG_PROVINCE_ID_CCIB_ID = data.PROVINCE_ID;
                this.formData.ORG_PROVINCE_CCIB_NAME = data.PROVINCE_NAME_THA;
                const orgValue = this.provinceResponsibility.filter((r) => r.province_id === data.PROVINCE_ID);
                this.orgUnitsNew = this.orgUnits.filter((r) => r.org_id === orgValue[0]?.org_id);
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_ID = orgValue[0]?.org_id;
                this.formData.ORG_LOCATION_TYPE = 2;
                this.formData.ORG_LOCATION_ID = orgValue[0]?.org_id;
                this.formData.ORG_LOCATION_NAME = orgValue[0]?.org_name;
            } else {
                this.formData.ORG_PROVINCE_ID_CCIB_ID = e.value;
            }
        }
    }

    onvaluechangeorgcenterwalkin(e) {
        if (e.value) {
            const data: any = this.orgtype3.filter((r) => r.org_id === e.value);
            this.formdataOrgsendcasewalkin.WALKIN_POLICE_STATION =
                data[0].org_name;
            this.formData.ORG_LOCATION_WALKIN_TYPE = 3;
            this.formData.WALKIN_POLICE_STATION_ID = 2375;
            this.formData.WALKIN_POLICE_STATION = "กองบัญชาการตำรวจสอบสวนกลาง";
        } else {
            this.formdataOrgsendcasewalkin.ORG_LOCATION_CENTER_ID = e.value;
        }
    }

    onvaluecheckboxlocationchange(e, type_location) {
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
            if (e.value == 1) {
                this.formData.ORG_LOCATION_ID = null;
                this.formData.location_type1 = 1;
                this.formData.ORG_LOCATION_TYPE = 1;
            }
        } else if (type_location == 2) {

            this.checkboxLocation.location_type2 = e.value;
            this.checkboxLocation.location_type1 = e.value;
            this.formData.ORG_PROVINCE_ID = undefined;
            this.formData.ORG_PROVINCE_LOCATION_ID = undefined;
            this.formData.ORG_PROVINCE_NAME = undefined;
            if (e.value == 2) {
                this.formData.ORG_LOCATION_ID = null;
                this.formData.location_type1 = 2;
                this.formData.ORG_LOCATION_TYPE = 2;
            }
        } else if (type_location == 3) {
            this.formData.ORG_PROVINCE_ID = undefined;
            this.formData.ORG_PROVINCE_NAME = undefined;
            this.formData.ORG_PROVINCE_LOCATION_ID = undefined;
            this.checkboxLocation.location_type3 = e.value;
            if (e.value == 3) {
                this.formData.location_type1 = 3;
                this.formData.ORG_LOCATION_TYPE = 3;
                this.formData.ORG_LOCATION_ID = 2375;
                this.formData.ORG_LOCATION_NAME = "กองบัญชาการตำรวจสอบสวนกลาง";
            }
        }
    }

    OnSelectProvicePresentlocation(e) {
        if (e.value) {
            const data =
                this.selectPresentProvicelocation.instance.option(
                    "selectedItem"
                );
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

    Onorglocation(e) {
        if (e.value) {
            const data = this.selectorg.instance.option("selectedItem");
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

    onvaluechangeorgmain(e) {
        this.formData.ORG_PROVINCE_MAP_AREA_ID = null;
        this.formData.ORG_PROVINCE_MAP_AREA_NAME = null;

        if (!e.value) return;

        // Reset all ORG_LOCATION_MAIN_ID fields dynamically
        for (let i = 1; i <= 5; i++) {
            this.formdataOrgsendcase[`ORG_LOCATION_MAIN_ID`] = null;
            this.formdataOrgsendcase[`ORG_LOCATION_MAIN_NAME`] = null;
        }

        // Get the correct dataset dynamically
        const selectedData = this.orgUnits.find((r) => r.org_id === e.value);
        if (!selectedData) return;

        // Assign values
        this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
        this.formdataOrgsendcase[`ORG_LOCATION_MAIN_ID`] = selectedData.org_id;
        this.formdataOrgsendcase[`ORG_LOCATION_MAIN_NAME`] = selectedData.org_name;

        // Insert parameters
        this.formData.ORG_LOCATION_TYPE = 2;
        this.formData.ORG_LOCATION_ID = selectedData.org_id;
        this.formData.ORG_LOCATION_NAME = selectedData.org_name;
    }


    onvaluechangeorgcenter(e) {
        if (e.value) {
            const data: any = this.orgtype3.filter((r) => r.org_id === e.value);
            this.formdataOrgsendcase.ORG_LOCATION_TYPE = 3;
            this.formdataOrgsendcase.ORG_LOCATION_CENTER_ID = data[0].org_id;
            this.formdataOrgsendcase.ORG_LOCATION_CENTER_NAME =
                data[0].org_name;

            //parame insert
            this.formData.ORG_LOCATION_TYPE = 3;
            this.formData.ORG_LOCATION_ID = 2375;
            this.formData.ORG_LOCATION_NAME = "กองบัญชาการตำรวจสอบสวนกลาง";
        } else {
            this.formdataOrgsendcase.ORG_LOCATION_CENTER_ID = e.value;
        }
    }

    alertmessagecustom(msg) {
        Swal.fire({
            title: "ผิดพลาด!",
            text: msg ?? "กรุณากรอกข้อมูล",
            icon: "warning",
            confirmButtonText: "Ok",
        }).then(() => { });
        this.mainConponent.checkValidate = true;
        return;
    }

    PhoneNumberPattern(params) {
        const makeScope = new RegExp('^[0](?=[0-9]{9,9}$)', 'g');
        return makeScope.test(params.value);
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

    OnSelectDate(e) {
        if (e.value) {
            const mydate = this.datePipe.transform(e.value, 'yyyy-MM-dd');
            const mytime = this.datePipe.transform(e.value, 'HH:mm:ss');
            this.formDataChannel.CASE_CHANNEL_PHONE_TIME = mytime;
            this.formDataChannel.CASE_CHANNEL_PHONE_DATE = mydate;
        }
    }

    cancel() {
        this.formDataChannel = {};
        this.datePhone = null;
        this.indexEdit = 0;
        this.edit = false;
    }

    addDataChannel() {
        if (!this.formChannel.instance.validate().isValid) {
            this._formValidate.ValidateForm(this.formChannel.instance.validate().brokenRules);
            return;
        } else {
            if (!this.edit) {
                if (this.formDataChannel.CASE_CHANNEL_PHONE_DATE != null) {
                    const dateStart = this.convertDate(this.formDataChannel.CASE_CHANNEL_PHONE_DATE, this.formDataChannel.CASE_CHANNEL_PHONE_TIME);
                    this.datePhone = new Date(dateStart[0], dateStart[1], dateStart[2], dateStart[3], dateStart[4], dateStart[5]);
                }
                this.channel_data.push(
                    {
                        CASE_CHANNEL_PHONE_DESTINATION: this.formDataChannel.CASE_CHANNEL_PHONE_DESTINATION,
                        CASE_CHANNEL_PHONE_DATE: this.formDataChannel.CASE_CHANNEL_PHONE_DATE,
                        CASE_CHANNEL_PHONE_TIME: this.formDataChannel.CASE_CHANNEL_PHONE_TIME,
                        CHANEL_PHONE: true,
                        DATE_PHONE: this.datePhone,
                        CHANNEL_PHONE_DOC: []
                    }
                );
            } else {
                if (this.formDataChannel.CASE_CHANNEL_PHONE_DATE != null) {
                    const dateStart = this.convertDate(this.formDataChannel.CASE_CHANNEL_PHONE_DATE, this.formDataChannel.CASE_CHANNEL_PHONE_TIME);
                    this.datePhone = new Date(dateStart[0], dateStart[1], dateStart[2], dateStart[3], dateStart[4], dateStart[5]);
                }
                this.channel_data[this.indexEdit] = {
                    CASE_CHANNEL_PHONE_DESTINATION: this.formDataChannel.CASE_CHANNEL_PHONE_DESTINATION,
                    CASE_CHANNEL_PHONE_DATE: this.formDataChannel.CASE_CHANNEL_PHONE_DATE,
                    CASE_CHANNEL_PHONE_TIME: this.formDataChannel.CASE_CHANNEL_PHONE_TIME,
                    CHANEL_PHONE: true,
                    DATE_PHONE: this.datePhone,
                    CHANNEL_PHONE_DOC: []
                }
            }
            this.formDataChannel = {};
            this.datePhone = null;
            this.edit = false;
            // console.log(this.channel_data);
            // console.log(this.channel_data[0].DATE_PHONE);
        }

    }

    convertDate(date, time) {
        const dateIN = String(date + " " + time);
        const [datePart, timePart] = dateIN.split(" ");
        const [year, month, day] = datePart.split("-");
        const [hours, minutes, seconds] = timePart.split(":");
        return [Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds)]
    }

    onEditItem(event: any, index = null) {
        this.indexEdit = index;
        const data = event.data;
        this.edit = true;
        setTimeout(() => {
            this.formDataChannel = {
                CASE_CHANNEL_PHONE_DESTINATION: data.CASE_CHANNEL_PHONE_DESTINATION,
                CASE_CHANNEL_PHONE_DATE: data.CASE_CHANNEL_PHONE_DATE,
                CASE_CHANNEL_PHONE_TIME: data.CASE_CHANNEL_PHONE_TIME,
                CHANEL_PHONE: data.CHANEL_PHONE,
                DATE_PHONE: data.DATE_PHONE,
                CHANNEL_PHONE_DOC: data.CHANNEL_PHONE_DOC
            }
            if (this.formDataChannel.CHANEL_PHONE && this.formDataChannel.CASE_CHANNEL_PHONE_DATE != null) {
                const dateStart = this.convertDate(this.formDataChannel.CASE_CHANNEL_PHONE_DATE, this.formDataChannel.CASE_CHANNEL_PHONE_TIME);
                this.datePhone = new Date(dateStart[0], dateStart[1], dateStart[2], dateStart[3], dateStart[4], dateStart[5]);
            }
        }, 200)
    }

    onDeleteItem(event: any) {
        Swal.fire({
            icon: 'warning',
            title: 'ท่านต้องการลบข้อมูลหรือไม่?',
            confirmButtonText: 'ตกลง',
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                this.channel_data.splice(event.rowIndex, 1)
            }
            return
        })
    }

    displayFormatDateTime(date) {
        return formatDate(date, 'dateShortTimeThai');
    }
}
