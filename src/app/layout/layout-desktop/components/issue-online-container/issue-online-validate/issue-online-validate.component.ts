import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { OnlineCaseService } from "src/app/services/online-case.service";
import { PersonalService } from "src/app/services/personal.service";
import { User } from "src/app/services/user";
import { IssueOnlineContainerComponent } from "../issue-online-container.component";
import Swal from "sweetalert2";
import { ConvertDateService } from "src/app/services/convert-date.service";
import { BankInfoService } from "src/app/services/bank-info.service";
import { DxSelectBoxComponent } from "devextreme-angular";
import {
    IOrganizeInfo,
    IOrgmaparea,
    OrgService,
} from "src/app/services/org.service";
import { ProvinceService } from "src/app/services/province.service";
import { environment } from "src/environments/environment";
import { formatDate } from "devextreme/localization";

@Component({
    selector: "app-issue-online-validate",
    templateUrl: "./issue-online-validate.component.html",
    styleUrls: ["./issue-online-validate.component.scss"],
})
export class IssueOnlineValidateComponent implements OnInit {
    @ViewChild("selectCaseChannel", { static: false })
    selectCaseChannel: DxSelectBoxComponent;
    @ViewChild("selectorgwalkin", { static: false })
    selectorgwalkin: DxSelectBoxComponent;
    @ViewChild("selectPresentProvicelocation", { static: false })
    selectPresentProvicelocation: DxSelectBoxComponent;
    @ViewChild("selectProvicemaparea", { static: false })
    selectProvicemaparea: DxSelectBoxComponent;

    public mainConponent: IssueOnlineContainerComponent;
    monthFulltTh = [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
    ];
    personalInfo = {};
    formData: any = {};
    isLoading = false;
    reload = true;
    userType = "mySelf";
    listDamageBank: any = [];
    listDamageBankOther: any = [];
    listMeetCriminal: any = {};
    listDamageOther: any = [];
    loadDateBox = false;
    formLocation: any = {};
    formLocationLoad = false;
    formLocationTranfer: any = {};
    formLocationTranferLoad = false;
    formLocationBankVictim: any = {};
    formLocationBankVictimLoad = false;
    formLocationBankVillain: any = {};
    formLocationBankVillainLoad = false;
    formQuestionare: any = {};
    popupCaseChannel = false;
    popupCaseChannel2 = false;
    popupIndex = 0;
    formPopup: any = {};
    listDocFile: any = [];
    listCaseChannel: any = [];
    showCaseLabelName = "";
    showcaseLabelID = "";
    showcaseCode = "";
    showcaseOption = "";
    popupViewFile = false;
    popupViewFileData: any = {};
    minBirthDate: Date;
    maxBirthDate: Date;
    popupFormData: any = {};
    promote = [
        { ID: "ไม่ได้รับ", TEXT: "ไม่ได้รับ" },
        { ID: "ได้รับ", TEXT: "ได้รับ" },
    ];
    groupquestion1_1 = [
        {
            id: "1.1",
            txt: "ซื้อของใน social (เช่น facebook twitter) โอนเงินแล้วบล๊อกเลย",
        },
        {
            id: "1.2",
            txt: "ซื้อของใน platform  (lazada,shopee) แต่ ส่งให้ไปจ่ายเงินช่องทางอื่นๆ",
        },
        {
            id: "1.3",
            txt: "ซื้อแล้ว หลายวันยังไม่ส่ง ยังติดต่อได้บ่ายเบี่ยง ผลัดวันประกันพรุ่ง",
        },
    ];
    groupquestion1_2 = [
        {
            id: "1.4",
            txt: "ซื้อแล้วส่งสินค้าอย่างอื่น (ซื้อโทรศัพท์ ส่ง สบู่)",
        },
        {
            id: "1.5",
            txt: "ซื้อของแล้วส่งสินค้าไม่ตรงสเปค (ซื้อ tv 55 นิ้ว ส่ง 50 นิ้ว)",
        },
        { id: "1.6", txt: "เคยซื้อสินค้ากันมาก่อนแล้ว และเคยได้สินค้า" },
    ];
    groupquestion2 = [
        { id: "2.1", txt: "กู้เงิน ได้เงิน เรียกเก็บดอกเบี้ยเกินอัตรา" },
        {
            id: "2.2",
            txt: "เป็นผู้ถูกรบกวนถูกแก๊งค์ปล่อยเงินกู้ โดยคนร้ายโทรมาทวงเงิน โดยที่ไม่ได้เกี่ยวข้อง",
        },
        {
            id: "2.3",
            txt: "กู้เงิน ไม่ได้เงิน หลอกให้โอนค่าธรรมเนียมเพิ่มขึ้นเรื่อยๆ",
        },
    ];
    groupquestion3 = [
        {
            id: "3.1",
            txt: "ทำกิจกรรมต่างๆ หรืออ้างว่าซื้อขายสินค้า แล้วได้เงินรางวัลเพิ่มขึ้นเรื่อยๆ แต่ไม่มีการรับส่งสินค้าจริงๆ",
        },
        {
            id: "3.2",
            txt: "แชร์ลูกโซ่ หรือชักชวนลงทุนใน แชร์ทองบ้านออมทอง หรือแชร์รูปแบบต่างๆ",
        },
    ];
    groupquestion5 = [
        {
            id: "5.1",
            txt: "อ้างเป็นหน่วยงานรัฐ  เช่น สรรพากร ตำรวจ ดีเอสไอ ปปง.",
        },
        { id: "5.2", txt: "อ้างเป็นหน่วยงานเอกชน เช่น ขนส่ง หรือพัสดุตกค้าง" },
        {
            id: "5.3",
            txt: "ข่มขู่ และหรือหลอกลวงว่าจะช่วยเหลือ  และให้โอนเงินไปให้",
        },
    ];

    // เพิ่ม หน่วยงานให้เลือก
    checkboxLocation: any = {};
    formReport: any;
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
    showSelect = false;
    dsorgbyaria: IOrganizeInfo[];
    dsorgbyarialocation: IOrganizeInfo[];
    dswalkinstatuspolice: IOrganizeInfo[];
    dsorgarea: IOrgmaparea[];
    province = [];
    checkBlessing = false;

    group1 = [
        { id: "1.1", txt: "1.1 แจ้งความเป็นหลักฐาน" },
        { id: "1.2", txt: "1.2 แจ้งความเอกสารหาย" },
        { id: "1.3", txt: "1.3 แจ้งความร้องทุกข์ ดำเนินคดี" },
    ];
    group2 = [
        { id: "2.1", txt: "2.1 ชีวิต ร่างกาย" },
        { id: "2.2", txt: "2.2 ชื่อเสียง" },
        { id: "2.3", txt: "2.3 ทรัพย์สิน" },
    ];
    group2_3 = [
        {
            id: "2.3.1",
            txt: "2.3.1 ทรัพย์สินคงรูป/กรรมสิทธิ์ในทรัพย์สิน/เงินสด",
        },
        { id: "2.3.2", txt: "2.3.2 เงินในบัญชี" },
        { id: "2.3.3", txt: "2.3.3 สกุลเงินดิจิทัล" },
    ];

    group3 = [
        { id: "3.1", txt: "3.1 ช่องทางออนไลน์/โทรศัพท์" },
        { id: "3.2", txt: "3.2 ได้พบเจอ/ทำผิดต่อหน้า" },
    ];
    ways = [
        { id: 2, text: "ยังไม่ได้แจ้งธนาคาร" },
        { id: 1, text: "ดำเนินการแจ้งธนาคาร" },
    ];

    orgtype2_1 = [
        {
            org_id: 3536,
            org_name:
                "กองบังคับการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี 1 ที่ตั้ง  กรุงเทพฯ   อาคารรัฐประศาสนภักดี (อาคาร B) ศูนย์ราชการฯ แจ้งวัฒนะ ชั้น 4 ถนนแจ้งวัฒนะ แขวงทุ่งสองห้อง เขตหลักสี่ ",
        },
    ];
    orgtype2_2 = [
        {
            org_id: 3548,
            org_name:
                "กองบังคับการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี 2 ที่ตั้ง จังหวัดนนทบุรี อาคารเฉลิมพระเกียรติฯ เลขที่ 904 ชั้น 19 ตำบลบ้านใหม่ อำเภอปากเกร็ด ",
        },
    ];
    orgtype2_3 = [
        {
            org_id: 3559,
            org_name:
                "กองบังคับการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี 3 ที่ตั้ง จังหวัดขอนแก่น เลขที่ 102 ถนนมิตรภาพ ตำบลในเมือง อำเภอเมืองขอนแก่น ",
        },
    ];
    orgtype2_4 = [
        {
            org_id: 3567,
            org_name:
                "กองบังคับการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี 4 ที่ตั้ง จังหวัดเชียงใหม่ เลขที่ 299 หมู่ 12 ถนนสมโภชเชียงใหม่ 700 ปี ตำบลป่าแดด อำเภอเมืองเชียงใหม่ ",
        },
    ];
    orgtype2_5 = [
        {
            org_id: 3578,
            org_name:
                "กองบังคับการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี 5 ที่ตั้ง จังหวัดสุราษฎร์ธานี เลขที่ 14 หมู่ 1 ตำบลบางกุ้ง อำเภอเมืองสุราษฎร์ธานี ",
        },
    ];
    orgtype3 = [
        {
            org_id: 2375,
            org_name:
                "กองบัญชาการตำรวจสอบสวนกลาง ที่ตั้ง กรุงเทพฯ ถนนพหลโยธิน แขวงจอมพล เขตจตุจักร",
        },
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

    groupQuestion1_1 = [
        {
            id: "1.1",
            txt: "ซื้อของใน social (เช่น facebook twitter) โอนเงินแล้วบล๊อกเลย",
        },
        {
            id: "1.2",
            txt: "ซื้อของใน platform  (lazada,shopee) แต่ ส่งให้ไปจ่ายเงินช่องทางอื่นๆ",
        },
        {
            id: "1.3",
            txt: "ซื้อแล้ว หลายวันยังไม่ส่ง ยังติดต่อได้บ่ายเบี่ยง ผลัดวันประกันพรุ่ง",
        },
    ];
    groupQuestion1_2 = [
        {
            id: "1.4",
            txt: "ซื้อแล้วส่งสินค้าอย่างอื่น (ซื้อโทรศัพท์ ส่ง สบู่)",
        },
        {
            id: "1.5",
            txt: "ซื้อของแล้วส่งสินค้าไม่ตรงสเปค (ซื้อ tv 55 นิ้ว ส่ง 50 นิ้ว)",
        },
        { id: "1.6", txt: "เคยซื้อสินค้ากันมาก่อนแล้ว และเคยได้สินค้า" },
    ];
    groupQuestion2 = [
        { id: "2.1", txt: "กู้เงิน ได้เงิน เรียกเก็บดอกเบี้ยเกินอัตรา" },
        {
            id: "2.2",
            txt: "เป็นผู้ถูกรบกวนถูกแก๊งค์ปล่อยเงินกู้ โดยคนร้ายโทรมาทวงเงิน โดยที่ไม่ได้เกี่ยวข้อง",
        },
        {
            id: "2.3",
            txt: "กู้เงิน ไม่ได้เงิน หลอกให้โอนค่าธรรมเนียมเพิ่มขึ้นเรื่อยๆ",
        },
    ];
    groupQuestion3 = [
        {
            id: "3.1",
            txt: "ทำกิจกรรมต่างๆ หรืออ้างว่าซื้อขายสินค้า แล้วได้เงินรางวัลเพิ่มขึ้นเรื่อยๆ แต่ไม่มีการรับส่งสินค้าจริงๆ",
        },
        {
            id: "3.2",
            txt: "แชร์ลูกโซ่ หรือชักชวนลงทุนใน แชร์ทองบ้านออมทอง หรือแชร์รูปแบบต่างๆ",
        },
    ];
    groupQuestion5 = [
        {
            id: "5.1",
            txt: "อ้างเป็นหน่วยงานรัฐ  เช่น สรรพากร ตำรวจ ดีเอสไอ ปปง.",
        },
        { id: "5.2", txt: "อ้างเป็นหน่วยงานเอกชน เช่น ขนส่ง หรือพัสดุตกค้าง" },
        {
            id: "5.3",
            txt: "ข่มขู่ และหรือหลอกลวงว่าจะช่วยเหลือ  และให้โอนเงินไปให้",
        },
    ];

    aria5and6 = [
        "ตำรวจภูธรภาค 5 (เชียงใหม่,น่าน,พะเยา,แพร่,แม่ฮ่องสอน,ลำปาง,ลำพูน)",
        "ตำรวจภูธรภาค 6 (กำแพงเพชร,ตาก,นครสวรรค์,พิจิตร,พิษณุโลก,เพชรบูรณ์,สุโขทัย,อุตรดิตถ์,อุทัยธานี)",
    ];

    aria8and9 = [
        "ตำรวจภูธรภาค 8 (กระบี่,ชุมพร,นครศรีธรรมราช,พังงา,ภูเก็ต,ระนอง,สุราษฎร์ธานี)",
        "ตำรวจภูธรภาค 9 (ตรัง,นราธิวาส,ปัตตานี,พัทลุง,ยะลา,สงขลา,สตูล)",
    ];
    formReadOnly = true;
    bankInfoList: any = [];
    mergedFrom: any = {};

    channel_tel = false;
    channel_data: any = [];

    serviceLabelID = [
        { ID: 1, TEXT: "AIS" },
        { ID: 2, TEXT: "TRUE" },
        { ID: 3, TEXT: "DTAC" },
        { ID: 4, TEXT: "NT (CAT TOT)" },
        { ID: 5, TEXT: "อื่น ๆ" },
    ];

    socialType = [
        "LINE",
        "FACEBOOK",
        "MESSENGER",
        "INSTAGRAM",
        "WEBSITE",
        "EMAIL",
        "TELEGRAM",
        "WHATSAPP",
        "TWITTER",
        "อื่นๆ",
    ];
    sessionDamage: any;

    constructor(
        private servicePersonal: PersonalService,
        private _onlineCaseServ: OnlineCaseService,
        private _router: Router,
        private _date: ConvertDateService,
        private servBankInfo: BankInfoService,
        private _OrgService: OrgService,
        private serviceProvince: ProvinceService
    ) {}

    ngOnInit(): void {
        // const userId = User.Current.PersonalId;
        // this.popupCaseChannel2 = true;
        setTimeout(async () => {
            this.minBirthDate = this._date.SetDateDefault(
                100,
                true,
                true,
                true
            );
            this.maxBirthDate = this._date.SetDateDefault(0);
            this.ReloadData();
        }, 1000);
        // this.servicePersonal
        //     .GetPersonalById(userId)
        //     .subscribe((_) => {

        //         this.minBirthDate = this._date.SetDateDefault(80, true, true, true);
        //         this.maxBirthDate = this._date.SetDateDefault(0);
        //         this.personalInfo = _;
        //         this.DefaultCheckbox();
        //         this.ReloadData();

        //     });
    }
    PromoteChange(e) {
        if (e.value) {
            this.formData.IS_PROMOTE_RADIO = e.value;
            this.showSelect = e.value == "ได้รับ" ? true : false;
        }
    }

    OnSelectProvicemaparea(e) {
        if (e.value) {
            const data =
                this.selectProvicemaparea.instance.option("selectedItem");

            if (data) {
                this.formData.ORG_PROVINCE_MAP_AREA_ID = data.PROVINCE_ID;
                this.formData.ORG_PROVINCE_MAP_AREA_NAME =
                    data.PROVINCE_NAME_THA;
                // parame insert
                this.formData.ORG_LOCATION_TYPE = 2;
                this.formData.ORG_LOCATION_ID = data.ORG_ID;
                this.formData.ORG_LOCATION_NAME = data.ORGANIZE_FULL_NAME;
            } else {
                this.formData.ORG_PROVINCE_MAP_AREA_ID = e.value;
            }
        }
    }

    async ReloadData() {
        localStorage.setItem("form-index", "6");
        this.isLoading = true;
        this.province = this.mainConponent.province;
        this.loadDateBox = false;
        this.reload = false;
        this.formLocationLoad = false;
        this.sessionDamage = await this._onlineCaseServ
            .SessionDamage({}, User.Current.PersonalId, 'get')
            .toPromise();
        this.formData = {};
        setTimeout(() => {
            this.checkEmtrySession();
            if (!localStorage.getItem("form-config")) {
                const formConfigs = {
                    FORM_CODE: "CCIB_NOTIFY_PEOPLE@0.1",
                    env: environment.config.baseConfig,
                    CASE_FLAG: "O",
                    CASE_SELF_TYPE: "Y",
                };
                localStorage.setItem(
                    "form-config",
                    JSON.stringify(formConfigs)
                );
            }
            this.mergedFrom = Object.assign(
                {},
                JSON.parse(localStorage.getItem("form-config")),
                JSON.parse(localStorage.getItem("form-blessing")),
                JSON.parse(localStorage.getItem("form-informer")),
                JSON.parse(localStorage.getItem("form-event")),
                JSON.parse(localStorage.getItem("form-villain")),
                this.sessionDamage,
                JSON.parse(localStorage.getItem("form-criminal-contact"))
            );
            this.userType = this.mainConponent.userType;
            this.formData = this.mergedFrom;
            // console.log(this.formData);
            if (this.formData.CASE_REPORT) {
                if (this.formData.CASE_REPORT.length > 0) {
                    this.formReport = this.formData.CASE_REPORT[0];
                    this.formData.CASE_CRIMINAL_CLUE_IN = this.formReport.CASE_BEHAVIOR;
                }
            }
            if (this.formData.BANK_REF) {
                this.formData.WAY = this.formData.BANK_REF.length > 0 ? 1 : 2;
            }
            this.channel_tel =
                this.formData.CASE_TYPE_ID == 66 ||
                this.formData.CASE_TYPE_ID == 67
                    ? true
                    : false;
            if (this.channel_tel) {
                if (this.formData.CASE_CHANNEL) {
                    this.channel_data = this.formData.CASE_CHANNEL;
                }
            }
            this.checkBlessing =
                this.mainConponent.formDataInsert.CHECK_BLESSING;
            this.reload = true;
            this.loadDateBox = true;
            this.isLoading = false;
            this.popupFormData = this.formData.Bank_personal_list;

            if (this.mainConponent.formType === "add") {
                this.formData.ORG_PROVINCE_LOCATION_ID = null;
                this.formData.ORG_PROVINCE_ID = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = null;
                this.formdataOrgsendcase.ORG_LOCATION_CENTER_ID = null;
                this.checkboxLocation.location_type1 = false;
                this.checkboxLocation.location_type2 = false;
                this.checkboxLocation.location_type3 = false;
                if (this.formData.CASE_ORG_TYPE_ID == 1) {
                    this.checkboxLocation.location_type1 = true;
                    this.checkboxlocationreadonly.readonly_type1 = false;
                    this.checkboxlocationreadonly.readonly_type2 = true;
                    this.checkboxlocationreadonly.readonly_type3 = true;
                } else if (this.formData.CASE_ORG_TYPE_ID == 2) {
                    this.checkboxlocationreadonly.readonly_type1 = false;
                    this.checkboxlocationreadonly.readonly_type2 = false;
                    this.checkboxlocationreadonly.readonly_type3 = true;
                } else if (this.formData.CASE_ORG_TYPE_ID == 3) {
                    this.checkboxLocation.location_type3 = true;
                    this.checkboxlocationreadonly.readonly_type1 = true;
                    this.checkboxlocationreadonly.readonly_type2 = true;
                    this.checkboxlocationreadonly.readonly_type3 = false;
                }
            }
        }, 500);
        // this.formData.CASE_INFORMER_DATE = this._date.ConvertToDateFormat(this.formData.CASE_INFORMER_DATE);
    }
    CheckStatusDamage() {
        if (
            this.formData.CASE_MONEY_TYPE1 === "Y" ||
            this.formData.CASE_MONEY_TYPE2 === "Y" ||
            this.formData.CASE_MONEY_TYPE3 === "Y" ||
            this.formData.CASE_MONEY_TYPE4 === "Y"
        ) {
            return true;
        }
        return false;
    }
    CheckStatusLeft() {
        if (
            this.formData.CASE_MONEY_TYPE1 === "Y" &&
            this.formData.CASE_MONEY_TYPE2 === "Y"
        ) {
            return "เงิน,ทรัพย์สินอื่นๆ";
        } else if (this.formData.CASE_MONEY_TYPE1 === "Y") {
            return "เงิน";
        } else if (this.formData.CASE_MONEY_TYPE2 === "Y") {
            return "เงิน";
        }
        return "";
    }
    CheckStatusRight() {
        if (
            this.formData.CASE_MONEY_TYPE3 === "Y" &&
            this.formData.CASE_MONEY_TYPE4 === "Y"
        ) {
            return "โอนเงินผ่านธนาคาร, โอนเงินด้วยวิธีอื่น";
        } else if (this.formData.CASE_MONEY_TYPE3 === "Y") {
            return "โอนเงินผ่านธนาคาร";
        } else if (this.formData.CASE_MONEY_TYPE4 === "Y") {
            return "โอนเงินด้วยเงินดิจิทัล";
        }
        return "";
    }
    CheckSammaryValue(num) {
        if (num) {
            return parseFloat(num).toFixed(2);
        }
        return 0;
    }
    ConvertDateFullMonth(date) {
        const d = new Date(date);
        const month = d.getMonth();
        const ddate = ` ${d.getDate()} `;
        const textMonthNow = ` ${this.monthFulltTh[month]}`;
        const year = d.getFullYear() + 543;
        return [ddate, " ", textMonthNow, " ", year].join("");
    }
    DownloadFile(data) {
        const linkSource = data.url;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = data.originalName;
        downloadLink.click();
    }
    CheckArray(data: any = []) {
        const countArray = data.length ?? 0;
        if (countArray > 0) {
            return true;
        }
        return false;
    }
    async CaseChannelSetDoc(data: any = []) {
        this.listDocFile = data.CHANNEL_DOC ?? [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            this.listDocFile.push(item);
        }
        return;
    }
    async CaseChannelEditData(data = {} as any, index = null) {
        this.isLoading = true;
        this.popupCaseChannel = true;
        this.popupIndex = index;
        this.formPopup = {};

        const setData = {};
        const d = data;
        for (const key in d) {
            if (d[key] !== null && d[key] !== undefined) {
                if (key === "CHANNEL_DOC") {
                    await this.CaseChannelSetDoc(d[key]);
                } else {
                    setData[key] = d[key];
                }
            }
        }
        this.formPopup = setData;
        const optionCaseChannel =
            this.listCaseChannel.filter(
                (r) => r.CHANNEL_ID === this.formPopup.CHANNEL_ID
            ) ?? null;
        const caseOption = optionCaseChannel[0] ?? null;
        this.showCaseLabelName = caseOption.CHANNEL_DETAIL1;
        this.showcaseLabelID = caseOption.CHANNEL_DETAIL2;
        this.showcaseCode = caseOption.CHANNEL_CODE;
        this.showcaseOption = caseOption.CHANNEL_OPTION_FLAG;

        this.isLoading = false;
    }
    CaseChannelclose() {
        this.popupCaseChannel = false;
        this.formPopup = {};
    }

    CaseChannelclose1() {
        this.popupCaseChannel2 = false;
    }

    onshowcheck2() {
        this.popupCaseChannel2 = true;
    }
    onsubmitcheck() {
        this.popupCaseChannel2 = false;
    }
    OnSelectCaseChannel(e) {
        if (e.value) {
            const data = this.selectCaseChannel.instance.option("selectedItem");
            if (data) {
                this.formPopup.CHANNEL_ID = data.CHANNEL_ID;
                this.formPopup.CHANNEL_NAME = data.CHANNEL_NAME;

                this.showCaseLabelName = data.CHANNEL_DETAIL1;
                this.showcaseLabelID = data.CHANNEL_DETAIL2;
                this.showcaseCode = data.CHANNEL_CODE;
                this.showcaseOption = data.CHANNEL_OPTION_FLAG;
            } else {
                this.formPopup.CHANNEL_ID = e.value;
            }
        }
    }
    PopupViewFile(data) {
        this.popupViewFile = true;
        const setData = {};
        const d = data;
        for (const key in d) {
            if (d[key] !== null && d[key] !== undefined) {
                setData[key] = d[key];
            }
        }
        this.popupViewFileData = data;
    }
    ClosePopupViewFile(e) {
        this.popupViewFile = false;
        this.popupViewFileData = {};
    }
    Back(e) {
        this.mainConponent.NextIndex(this.mainConponent.indexTab - 1);
    }
    SubmitForm(e) {
        if (
            this.formData.IS_PROMOTE_RADIO == "ได้รับ" &&
            (this.formData.PROMOTE_CHANEL == "" ||
                this.formData.PROMOTE_CHANEL == undefined ||
                this.formData.PROMOTE_CHANEL == null)
        ) {
            Swal.fire({
                title: "ผิดพลาด!",
                html: "กรุณากรอกช่องทางใด",
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => {});
            return;
        }
        this.popupCaseChannel2 = false;
        if (this.mainConponent.formType === "add") {
            this.InsertForm(e, this.formData);
        } else {
        }
    }

    alertmessagecustom(msg) {
        Swal.fire({
            title: "ผิดพลาด!",
            text: msg ?? "กรุณากรอกข้อมูล",
            icon: "warning",
            confirmButtonText: "Ok",
        }).then(() => {});
        return;
    }

    InsertForm(e, data) {
        this.isLoading = true;
        const setData = {} as any;
        for (const key in data) {
            if (
                data[key] !== null &&
                data[key] !== undefined &&
                key !== "listDamageBank" &&
                key !== "listDamageBankOther" &&
                key !== "listDamageOther" &&
                key !== "listDamageCrypto"
            ) {
                setData[key] = data[key];
            }
        }
        if (
            this.formData.CHECK_BLESSING === undefined ||
            this.formData.BLESSING_STATUS === undefined
        ) {
        }
        if (
            this.formData.CASE_INFORMER_FIRSTNAME === undefined &&
            this.formData.CASE_INFORMER_LASTNAME === undefined
        ) {
            Swal.fire({
                title: "ผิดพลาด!",
                html: "คุณกรอกข้อมูลไม่สมบูรณ์ ระบบจะพาคุณไปยังหน้าที่ยังกรอกไม่สมบูรณ์",
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => {});
            this.isLoading = false;
            this.mainConponent.SelectTabIndex(2);
            return;
        }
        if (
            this.formData.CHECK_BLESSING ||
            this.formData.BLESSING_STATUS === "Y"
        ) {
            if (
                this.formData.ORG_LOCATION_ID == 0 ||
                this.formData.ORG_LOCATION_ID == 1
            ) {
                Swal.fire({
                    title: "ผิดพลาด!",
                    html: "กรุณาเลือกสถานีที่คุณต้องการไปพบ",
                    icon: "warning",
                    confirmButtonText: "Ok",
                }).then(() => {});
                this.isLoading = false;
                this.mainConponent.SelectTabIndex(2);
                return;
            }
            if (
                this.formData.CASE_TYPE_ID === undefined ||
                this.formData.CASE_TYPE_ID === 7 ||
                this.formData.CASE_TYPE_ID === 0
            ) {
                Swal.fire({
                    title: "ผิดพลาด!",
                    text: "กรุณาเลือกประเภทคดี",
                    icon: "warning",
                    confirmButtonText: "Ok",
                }).then(() => {});
                this.isLoading = false;
                this.mainConponent.SelectTabIndex(3);
                return;
            }
            var text = "";
            if (this.formData?.ORG_PROVINCE_ID === 12) {
                text = "เพื่อความสะดวกในการติดตามและประสานงานคดี แม้ว่าท่านได้แจ้งความไว้ที่สถานีตำรวจในพื้นที่ (สภ.อ) แล้ว แต่คดีอาชญากรรมทางเทคโนโลยีทั้งหมดถูกรวบรวมและจะดำเนินการที่ **ศูนย์บริหารคดีอาชญากรรมทางเทคโนโลยี ตำรวจภูธรจังหวัดนนทบุรี (ข้างสำนักงานสลากกินแบ่งรัฐบาล)** ท่านสามารถเข้าพบหรือสอบถามความคืบหน้าคดีได้โดยตรงกับเจ้าหน้าที่ ณ ศูนย์บริหารคดีฯ ซึ่งมีทีมงานผู้เชี่ยวชาญพร้อมให้คำแนะนำและอำนวยความสะดวก" +
                " กรุณาตรวจสอบข้อมูลก่อนกดยืนยัน";
            }else{
                text =
                    "การแจ้งความออนไลน์เป็นการอำนวยความสะดวกแก่ท่านในการร้องทุกข์และแจ้งความประสงค์" +
                    "ให้อายัดเงินที่โอนเข้าไปในบัญชีคนร้ายและผู้เกี่ยวข้องโดยเร็ว " +
                    "ทันสถานการณ์ และท่านต้องไปให้ปากคำต่อพนักงานสอบสวนตามที่นัดหมาย เพื่อให้เป็นไปตามกฏหมายกำหนด" +
                    "ระบบจะส่งเรื่องไปที่หน่วยงาน " +
                    this.formData.ORG_LOCATION_NAME +
                    " กรุณาตรวจสอบข้อมูลก่อนกดยืนยัน";
            }
            Swal.fire({
                title: "ยืนยันการแจ้งเรื่องเข้าสู่ระบบ!!",
                text: text,
                icon: "warning",
                confirmButtonText: "ยืนยัน",
                showCancelButton: true,
                cancelButtonText: "กลับไปแก้ไข",
            }).then((result) => {
                if (result.isConfirmed) {
                    this._onlineCaseServ
                        .InsertDataMQ(setData)
                        .pipe(finalize(() => (this.isLoading = false)))
                        .subscribe(() => {
                            Swal.fire({
                                title: "แจ้งเรื่องสำเร็จ!",
                                text: "กรุณารอเรื่องเข้าสู่ระบบ 1-3 นาที",
                                icon: "success",
                                confirmButtonText: "ตกลง",
                            }).then(() => {
                                this.handleSuccessNavigation();
                            });
                        });
                } else {
                    this.isLoading = false;
                    // console.log();
                }
            });
        } else if (
            this.formData.CHECK_BLESSING == false ||
            this.formData.BLESSING_STATUS === "N"
        ) {
            setData.ORG_LOCATION_ID = 1;
            setData.CASE_TYPE_ID = 7;
            setData.ORG_LOCATION_NAME = "สำนักงานตำรวจแห่งชาติ";
            Swal.fire({
                title: "ยืนยันการแจ้งเรื่องเข้าสู่ระบบ!!",
                text:
                    "การแจ้งความออนไลน์เป็นการอำนวยความสะดวกแก่ท่านในการร้องทุกข์และแจ้งความประสงค์" +
                    "ให้อายัดเงินที่โอนเข้าไปในบัญชีคนร้ายและผู้เกี่ยวข้องโดยเร็ว " +
                    "ทันสถานการณ์ และท่านต้องไปให้ปากคำต่อพนักงานสอบสวนตามที่นัดหมาย เพื่อให้เป็นไปตามกฏหมายกำหนด" +
                    "ระบบจะส่งเรื่องไปที่หน่วยงานที่เกี่ยวข้อง กรุณาตรวจสอบข้อมูลก่อนกดยืนยัน",
                icon: "warning",
                confirmButtonText: "ยืนยัน",
                showCancelButton: true,
                cancelButtonText: "กลับไปแก้ไข",
            }).then((result) => {
                if (result.isConfirmed) {
                    this._onlineCaseServ
                        .InsertDataMQ(setData)
                        .pipe(finalize(() => (this.isLoading = false)))
                        .subscribe(() => {
                            Swal.fire({
                                title: "แจ้งเรื่องสำเร็จ!",
                                text: "กรุณารอเรื่องเข้าสู่ระบบ 1-3 นาที",
                                icon: "success",
                                confirmButtonText: "ตกลง",
                            }).then(() => {
                                this.handleSuccessNavigation();
                            });
                        });
                } else {
                    this.isLoading = false;
                    // console.log();
                }
            });
        } else {
            Swal.fire({
                title: "ผิดพลาด!",
                html: "คุณกรอกข้อมูลไม่สมบูรณ์ กรุณาตรวจสอบข้อมูลที่ท่านกรอกอีกครั้ง",
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => {});
            this.isLoading = false;
            this.mainConponent.SelectTabIndex(1);
            return;
        }
    }

    private handleSuccessNavigation(): void {
        this._onlineCaseServ.SessionClear(User.Current.PersonalId).subscribe(() => {
            localStorage.removeItem("form-blessing");
            localStorage.removeItem("form-informer");
            localStorage.removeItem("form-event");
            localStorage.removeItem("form-damage");
            localStorage.removeItem("form-villain");
            localStorage.removeItem("form-index");
            localStorage.removeItem("form-config");
            localStorage.removeItem("form-criminal-contact");
            this._router.navigate(["/main/task-list"]);
        });
    }

    // UpdateForm(data){
    //     this.isLoading = true;
    //     this._onlineCaseServ.UpdateData(this.mainConponent.caseId,data)
    //         .pipe(finalize(() => this.isLoading = false))
    //         .subscribe(_ => {
    //             alert('success');
    //         });
    // }
    checkEmtrySession() {
        if (!this.sessionDamage) {
            Swal.fire({
                title: 'ผิดพลาด!',
                html: 'คุณกรอกข้อมูลไม่สมบูรณ์ ระบบจะพาคุณไปยังหน้าที่ยังกรอกไม่สมบูรณ์',
                icon: 'warning',
                confirmButtonText: 'Ok',
            }).then(() => {});
            console.log("ความเสียหาย");
            this.isLoading = false;
            if (!this.sessionDamage) {
                this.mainConponent.SelectTabIndex(4);
                return;
            }
        }
        const requiredItems = [
            "form-blessing",
            "form-informer",
            "form-event",
            "form-damage",
            "form-criminal-contact",
        ];

        for (let i = 0; i < requiredItems.length; i++) {
            console.log(requiredItems[i]);
            if (!localStorage.getItem(requiredItems[i]) && requiredItems[i] != "form-damage") {
                Swal.fire({
                    title: "ผิดพลาด!",
                    html: "คุณกรอกข้อมูลไม่สมบูรณ์ ระบบจะพาคุณไปยังหน้าที่ยังกรอกไม่สมบูรณ์",
                    icon: "warning",
                    confirmButtonText: "Ok",
                }).then(() => {});
                this.isLoading = false;
                if (requiredItems[i] == "form-blessing") {
                    this.mainConponent.SelectTabIndex(0);
                } else if(requiredItems[i] == "form-damage"){

                }else {
                    this.mainConponent.SelectTabIndex(i + 2);
                }
                return;
            }
        }
    }

    displayFormatDateTime(date) {
        return formatDate(date, "dateShortTimeThai");
    }

    async openPdfInNewTabAdd(e): Promise<void> {
        const something = e.Url.split(",")[1] || e.Url;
        const fileData = atob(something);
        const blob = new Blob(
            [new Uint8Array([...fileData].map((item) => item.charCodeAt(0)))],
            { type: e.Type }
        );
        const fileUrl = URL.createObjectURL(blob);
        window.open(fileUrl, "_blank");
    }
}
