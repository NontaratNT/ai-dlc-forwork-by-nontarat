import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
    DxFormComponent,
    DxMultiViewComponent,
    DxRadioGroupComponent,
    DxScrollViewComponent,
    DxSelectBoxComponent,
} from "devextreme-angular";
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
import * as moment from "moment";
import { User } from "src/app/services/user";
import { IssueOnlineContainerComponent } from "../issue-online-container.component";
import { ResizedEvent } from "angular-resize-event";
import { ConvertDateService } from "src/app/services/convert-date.service";
import { IssueOnlineFileUploadService } from "src/app/services/issue-online-file-upload.service";
import { environment } from "src/environments/environment";
import { UserSettingService } from "src/app/services/user-setting.service";
import { DatePipe } from '@angular/common';
import { OnlineCaseService } from "src/app/services/online-case.service";
import { FileService } from "src/app/services/file.service";
import { IssueOnlineDamageSubComponent } from "../issue-online-damage-sub/issue-online-damage-sub.component";
import { FormValidatorService } from "src/app/services/form-validator.service";
@Component({
    selector: "app-issue-online-damage",
    templateUrl: "./issue-online-damage.component.html",
    styleUrls: ["./issue-online-damage.component.scss"],
})
export class IssueOnlineDamageComponent implements OnInit {
    @ViewChild("selectBankInfo", { static: false })
    selectBankInfo: DxSelectBoxComponent;
    @ViewChild("selectBankInfoOrigin", { static: false })
    selectBankInfoOrigin: DxSelectBoxComponent;
    @ViewChild("form1", { static: false }) form1: DxFormComponent;
    @ViewChild("form2", { static: false }) form2: DxFormComponent;
    @ViewChild("form3", { static: false }) form3: DxFormComponent;
    @ViewChild("formAddData", { static: false }) subForm: DxFormComponent;
    @ViewChild("formbanknew", { static: false }) formbanknew: DxFormComponent;
    @ViewChild("formbanknewCrytro", { static: false }) formbanknewCrytro: DxFormComponent;
    @ViewChild("formbanknewpopup", { static: false }) formbanknewpopup: DxFormComponent;
    @ViewChild("view_form", { static: false })
    scrollViewForm: DxScrollViewComponent;
    @ViewChild("selectWayOther", { static: false })
    selectWayOther: DxSelectBoxComponent;
    @ViewChild("UploadFileDamageList") tagsUploadFileDamageList;

    @ViewChild("selectBankInfoOriginlist", { static: false }) selectBankInfoOriginlist: DxSelectBoxComponent;
    @ViewChild("selectBankInfoOriginlistCrypto", { static: false }) selectBankInfoOriginlistCrypto: DxSelectBoxComponent;
    @ViewChild("selectdirection", { static: false }) selectdirection: DxSelectBoxComponent;

    @ViewChild("selectBankInfolist", { static: false }) selectBankInfolist: DxSelectBoxComponent;
    @ViewChild("selectBankInfolistCrypto", { static: false }) selectBankInfolistCrypto: DxSelectBoxComponent;
    @ViewChild(IssueOnlineDamageSubComponent) set damagesub(damagesub: IssueOnlineDamageSubComponent) {
        if(damagesub) {
            this.damagesubConponent = damagesub;
            this.damagesubConponent.damagemain = this;
            this.indexLocker.damagesubConponent = true;
        }
    }
    public damagesubConponent: IssueOnlineDamageSubComponent;
    public mainConponent: IssueOnlineContainerComponent;
    indexLocker: any = {};
    personalInfo: any = {};
    isLoading = false;
    occupationList = [];
    formData: any = {};
    presentAddress: any = {};
    province = [];
    bankInfoList: any = [];
    bankInfoListOrigin: any = [];
    // bankOtherList = [
    //     {  ID:"T",TEXT:"True Money" },
    //     {  ID:"P",TEXT:"Paypal" },
    //     {  ID:"O",TEXT:"อื่นๆ" },
    // ];
    bankOtherList: any = [];
    WayOtherList: any = [];
    socialInfo = [];
    popup = false;
    popupbanklist = false;
    popupbanklistvillain = false;
    reloadDataPopup = false;
    bankAccountType = [
        { ID: "villain", TEXT: "ผู้เสียหาย" },
        { ID: "sufferer", TEXT: "ผู้ต้องหา" },
    ];

    damageType = [
        { ID: 1, TEXT: "เกิดความเสียหาย" },
        { ID: 2, TEXT: "ยังไม่เกิดความเสียหาย" },
    ];
    bankTransferType = [
        { ID: "T", TEXT: "ธนาคาร" },
        { ID: "P", TEXT: "พร้อมเพย์" },
    ];
    selectNumberBankType = [
        { ID: "P", TEXT: "หมายเลขโทรศัพท์" },
        { ID: "W", TEXT: "Wallet ID" },
        { ID: "B", TEXT: "หมายเลขบัญชี" },
    ];
    bankTypeSelected = this.selectNumberBankType[0].ID;
    emailOrNumber = "N";
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
    popupBankTransferType = "T";
    popupAddData = true;
    popupsaveData = false;
    bgColorTypeTransfer = "st-sufferer-bg-last";
    checkCount = 0;
    indexIsDamage = 0;
    displayBlockTop = "col-8";
    displayBlock = "col-6";
    blockRightClass = true;
    defaultDamageType = 1;
    checkboxDamage: any = {};
    popupIndex = 0;
    popupType = "add";
    popupForm: any = {};
    popupFormData: any = {};

    popupSubFormList: any = {};
    popupSubFormData: any = {};
    popupSubFormAddOpen = false;
    popupSubFormuploadFileBuffer: any = {};
    popupSubFormuploadFileBufferStatus = false;
    popupSubFormDamageBuffer = 0;
    popupFormDataDamageBuffer = 0;
    popupRenderType = "type1";

    formType = "add";
    formReadOnly = false;
    formAddData = true;
    listDamageBank: any = [];
    listDamageCrytro: any = [];
    listDamageBankOther: any = [];
    listDamageOther: any = [];
    titlePopup = "";
    popupConfigs: any = {};
    listUploadFileWayOther: any = [];

    loadDateBox = false;
    show_value = false;

    loadDateBoxOther = false;
    minBirthDateOther: Date;
    maxBirthDateOther: Date;
    bankOtherListTypeOther = false;
    indexUploadFileDamageListAttachment = 0;

    popupViewFile = false;
    popupViewFileData: any = {};

    limitSizeBank = 0;
    limitSizeBankOther = 0;
    limitSizeOther = 0;
    bankDate: Date;
    maxDateValue: Date = new Date();
    maxSizeBuffer = 0;
    checkTypemoney = false;


    _buttonaddblank = {
        icon: "plus",
        type: "primary",
        disabled: false,
        onClick: (e) => this.onaddbanklist(e)
    };
    _buttonaddblankvillain = {
        icon: "plus",
        type: "primary",
        disabled: false,
        onClick: (e) => this.onaddbanklistvilain(e)
    };
    _buttonaddblankCrypto = {
        icon: "plus",
        type: "primary",
        disabled: false,
        onClick: (e) => this.onaddbanklist(e,"crypto")
    };
    _buttonaddblankvillainCrypto = {
        icon: "plus",
        type: "primary",
        disabled: false,
        onClick: (e) => this.onaddbanklistvilain(e,"crypto")
    };
    bankListstart: any = [
    ];
    dsdirection: any = [{ id: 1, text: 'รับเงิน' }, { id: 2, text: 'โอนเงิน' }]
    bankListend: any = [
    ];
    bankCrytroListstart: any = [];
    bankCrytroListend: any = [];
    wayStart: number;
    wayEnd: number;
    formmoney: any = {};
    formmoneySub: any = {};
    listDamageBankmoey: any = [];
    fileMoney : any;
    fileType1 : any = [];
    fileType2 : any = [];

    type1:boolean = false;
    type2:boolean = false;
    type3:boolean = false;
    type4:boolean = false;

    isAdding = true;
    editTransferData: any = {};

    listUploadFileformmoney: any = [];
    listUploadFileformCrypto: any = [];
    now: Date;
    sumvillan: any = 0.0;
    sumpersonal: any = 0.0;
    sumothermoney: any = 0.0;

    today = new Date();
    minDateValue: Date = new Date(this.today.getFullYear() - 2, this.today.getMonth(), this.today.getDate());
    
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
        private _issueFile: IssueOnlineFileUploadService,
        private datePipe: DatePipe,
        private _OnlineCaseService: OnlineCaseService,
        private _fileService :FileService,
        private _formValidate: FormValidatorService,

    ) {
        this.bankListstart = [];
        this.bankListend = [];
    }

    ngOnInit(): void {
        this.maxDateValue.setHours(this.maxDateValue.getHours() + 1);
        this.isLoading = true;
        setTimeout(async () => {
            this.SetDefaultData();
        }, 1000);
    }
    ConvertDateFullMonth(date) {
        if(date){
            const d = new Date(date);
            const month = d.getMonth();
            const ddate = ` ${d.getDate()} `;
            const textMonthNow = ` ${this.monthFulltTh[month]}`;
            const year = d.getFullYear() + 543;
            return [ddate, " ", textMonthNow, " ", year].join("");
        }else{
            return "ไม่ระบุ";
        }
    }

    ConvertDateToMomentTime(date) {
        if (date === null) {
            return "00:00";
        }
        return moment(date, "YYYY-MM-DD HH:mm:ss").format("HH:mm");
    }
    ShowInvalidDialog(myText = "กรุณากรอกข้อมูลให้ครบ") {
        Swal.fire({
            title: "ผิดพลาด!",
            text: myText,
            icon: "warning",
            confirmButtonText: "Ok",
        }).then(() => { });
    }
    async SetDefaultData() {
        try {
            const bankData = await this.servBankInfo.GetBankInfo().toPromise();
            this.bankInfoList = bankData;
            this.bankInfoListOrigin = bankData;

            this.bankOtherList = await this.servBankInfo
                .GetBankWayOtherInfo()
                .toPromise();
            this.WayOtherList = await this.servBankInfo
                .GetBankOtherInfo()
                .toPromise();
            this.listDamageBank = [];
            this.listDamageBankOther = [];
            this.listDamageOther = [];

            if (this.mainConponent.formType === "add") {
                localStorage.setItem("form-index","4");
                this.formType = "add";
                this.formReadOnly = false;
                this.formAddData = true;
                if(localStorage.getItem("form-blessing")){
                    let formCheck = JSON.parse(localStorage.getItem("form-blessing"));
                    if(formCheck.MoneyWAY == 1){
                        this.type1 = true;
                        this.checkTypemoney = true;
                        this.formData = {
                            CASE_MONEY_DAMAGE: "Y",
                            CASE_MONEY_TYPE1: "Y",
                            CASE_MONEY_TYPE2: "N",
                            CASE_MONEY_TYPE3: "N",
                            CASE_MONEY_TYPE4: "N",
                            CASE_MONEY_TYPE5: "N",
                            CASE_MONEY_DAMAGE_VALUE: 0,
                            CASE_MONEY: [],
                        };
                        this.checkboxDamage = {
                            case_type1: true,
                            case_type2: false,
                            case_type3: false,
                            case_type4: false,
                            case_type5: false,
                        };
                    }
                    else if(formCheck.MoneyWAY == 2){
                        this.type2 = true;
                        this.checkTypemoney = false;
                        this.formData = {
                            CASE_MONEY_DAMAGE: "Y",
                            CASE_MONEY_TYPE1: "N",
                            CASE_MONEY_TYPE2: "Y",
                            CASE_MONEY_TYPE3: "N",
                            CASE_MONEY_TYPE4: "N",
                            CASE_MONEY_TYPE5: "N",
                            CASE_MONEY_DAMAGE_VALUE: 0,
                            CASE_MONEY: []
                        };
                        this.checkboxDamage = {
                            case_type1: false,
                            case_type2: true,
                            case_type3: false,
                            case_type4: false,
                            case_type5: false,
                        };
                    }
                    else if(formCheck.MoneyWAY == 3){
                        this.type3 = true;
                        this.checkTypemoney = false;
                        this.checkTypemoney = false;
                        this.formData = {
                            CASE_MONEY_DAMAGE: "Y",
                            CASE_MONEY_TYPE1: "N",
                            CASE_MONEY_TYPE2: "N",
                            CASE_MONEY_TYPE3: "N",
                            CASE_MONEY_TYPE4: "N",
                            CASE_MONEY_TYPE5: "Y",
                            CASE_MONEY_DAMAGE_VALUE: 0,
                            CASE_MONEY: []
                        };
                        this.checkboxDamage = {
                            case_type1: false,
                            case_type2: false,
                            case_type3: false,
                            case_type4: false,
                            case_type5: true,
                        };
                    }
                    else if(formCheck.MoneyWAY == 4){
                        this.type4 = true;
                        this.checkTypemoney = false;
                        this.formData = {
                            CASE_MONEY_DAMAGE: "Y",
                            CASE_MONEY_TYPE1: "N",
                            CASE_MONEY_TYPE2: "N",
                            CASE_MONEY_TYPE3: "N",
                            CASE_MONEY_TYPE4: "Y",
                            CASE_MONEY_TYPE5: "N",
                            CASE_MONEY_DAMAGE_VALUE: 0,
                            CASE_MONEY: []
                        };
                        this.checkboxDamage = {
                            case_type1: false,
                            case_type2: false,
                            case_type3: false,
                            case_type4: true,
                            case_type5: false,
                        };
                    }else{
                        this.mainConponent.NextIndex(this.mainConponent.indexTab = 0);
                    }
                }else{
                    this.mainConponent.NextIndex(this.mainConponent.indexTab = 0);
                }
                if(localStorage.getItem("form-damage")){
                    this.formData = JSON.parse(localStorage.getItem("form-damage"));
                    // console.log(this.formData);
                    if (this.CheckArray(this.formData.CASE_MONEY)) {
                        await this.SetDataToListBank(this.formData.CASE_MONEY);
                    }
                    this.defaultDamageType =
                        this.formData.CASE_MONEY_DAMAGE === "Y" ? 1 : 2;
                    this.checkboxDamage = {
                        case_type1: this.CheckMoneyTypeEdit(
                            this.formData.CASE_MONEY_TYPE1,
                            "type1"
                        ),
                        case_type2: this.CheckMoneyTypeEdit(
                            this.formData.CASE_MONEY_TYPE2,
                            "type1"
                        ),
                        case_type3: this.CheckMoneyTypeEdit(
                            this.formData.CASE_MONEY_TYPE3,
                            "type1"
                        ),
                        case_type4: this.CheckMoneyTypeEdit(
                            this.formData.CASE_MONEY_TYPE4,
                            "type1"
                        ),
                        case_type5: this.CheckMoneyTypeEdit(
                            this.formData.CASE_MONEY_TYPE5,
                            "type1"
                        ),
                    };
                }
            } else {
                this.formType = "edit";
                this.formReadOnly = true;
                this.formAddData = false;
                this.DefaultCheckbox();
                this.checkTypemoney = true;
                const _case_id = Number(sessionStorage.getItem("case_id"))
                const _CASE_MONEY = await this._OnlineCaseService.Getcasemoney(_case_id).toPromise();
                var dataForm = await this._OnlineCaseService.getbycaseId(_case_id).toPromise();
                setTimeout(async () => {
                    if(dataForm){
                        if(dataForm.REPUTATION !== undefined && dataForm.REPUTATION !== null){
                            this.formData.CASE_MONEY_TYPE5 = 'Y';
                            this.checkboxDamage.case_type3 = true;
                            this.formData.REPUTATION = dataForm.REPUTATION;
                        }
                    }
                    if (this.CheckArray(_CASE_MONEY)) {
                        if(this.mainConponent.InstId){
                            this.fileMoney = await this._fileService.getCaseMoneyFile(Number(this.mainConponent.InstId)).toPromise();
                            if(this.fileMoney){
                                this.fileType1 = this.filterFilesByType(4);
                                this.fileType2 = this.filterFilesByType(21);
                            }
                        }

                        this.formData.CASE_MONEY = _CASE_MONEY;
                        this.defaultDamageType = 1;
                        let indexType1 = 0;
                        let indexType2 = 0;
                        this.formData.CASE_MONEY.forEach(element => {
                            for (const prop in element) {
                                if (element[prop] === "0001-01-01T00:00:00") {
                                   element[prop] = null;
                                }
                            }
                            if (element.CASE_MONEY_CHANNEL_TYPE == "T") {
                                element.MONNEY_DOC = [];
                                element.index = indexType1;
                                this.formData.CASE_MONEY_TYPE1 = 'Y';
                                this.checkboxDamage.case_type1 = true;
                                element.MONNEY_DOC.push(this.getFilesByIndex(this.fileType1, indexType1));
                                indexType1++;
                            }
                            if (element.CASE_MONEY_CHANNEL_TYPE == "O") {
                                element.BANK_OTHER_ATTACHMENT = [];
                                element.index = indexType2;
                                this.formData.CASE_MONEY_TYPE2 = 'Y';
                                this.checkboxDamage.case_type2 = true;
                                element.BANK_OTHER_ATTACHMENT.push(this.getFilesByIndex(this.fileType2, indexType2));
                                indexType2++;
                            }

                            this.formData.CASE_MONEY_DAMAGE_VALUE = Number(element.DAMAGE_VALUE);
                        });

                        await this.SetDataToListBank(this.formData.CASE_MONEY);
                    }else{
                        this.formData.CASE_MONEY_DAMAGE = "N";
                    }
                }, 1000);
            }

            this.isLoading = false;
        } catch (error) {
            this.SetDefaultData();
        }
    }

    filterFilesByType(type: number) {
        return this.fileMoney.filter(element => element.typeDamage === type);
    }

    getFilesByIndex(files: any[], index: number) {
        return files[index] || [];
    }

    async SetDataToListBank(data) {
        for (const item of data) {
            if (item.CASE_MONEY_CHANNEL_TYPE === "T") {
                if(item.BANK_MONEY_OTHER_NAME === "เงินดิจิทัล (Cryptocurrency)"){
                    this.formData.CASE_MONEY_TYPE4 = "Y"
                    this.checkboxDamage.case_type4 = true;
                    this.listDamageCrytro.push(item);

                }else{
                    this.formData.CASE_MONEY_TYPE1 = "Y"
                    this.checkboxDamage.case_type1 = true;
                    this.listDamageBank.push(item);
                }
                this.listDamageBank.push(item);
            } else if (item.CASE_MONEY_CHANNEL_TYPE === "P") {
                this.listDamageBankOther.push(item);
            } else if (item.CASE_MONEY_CHANNEL_TYPE === "O") {
                this.listDamageOther.push(item);
            }
        }
        return true;
    }

    async OtheWayUploadFile(uploadTag) {
        const files: any = uploadTag.files;
        if (files.length > 0) {
            this.isLoading = true;
            const fileCheck =
                await this._issueFile.CheckFileUploadAllowListSizeDialog(
                    this.maxSizeBuffer,
                    files
                );

            if (fileCheck.status) {
                this.maxSizeBuffer = fileCheck.uploadSizeAll ?? 0;
                for (const item of fileCheck.filebase64Array) {
                    this.listUploadFileWayOther.push(item);
                }
            }
            this.isLoading = false;
        }
    }
    async OtheWayFilesDropped(e) {
        const files = e;
        if (files.length > 0) {
            this.isLoading = true;
            const fileCheck =
                await this._issueFile.CheckFileUploadAllowListSizeDrop(
                    this.maxSizeBuffer,
                    files
                );

            if (fileCheck.status) {
                this.maxSizeBuffer = fileCheck.uploadSizeAll ?? 0;
                for (const item of fileCheck.filebase64Array) {
                    this.listUploadFileWayOther.push(item);
                }
            }
            this.isLoading = false;
        }
    }
    async OtheWayUploadFileConvertBase64(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            let base64File = {} as any;
            base64File = reader.result;
            const item = {
                storage: "base64",
                name: "file",
                url: base64File,
                size: file.size,
                sizeDetail: this.BytesToSize(file.size),
                type: file.type,
                originalName: file.name,
                dateNow: moment().format("YYYY-MM-DD"),
            };
            this.listUploadFileWayOther.push(item);
            return;
        };
        return;
    }
    CheckMoneyTypeEdit(data, index = null) {
        return data === "Y" ? true : false;
    }
    DefaultCheckbox() {
        this.formData = {
            CASE_MONEY_DAMAGE: "Y",
            CASE_MONEY_TYPE1: "N",
            CASE_MONEY_TYPE2: "N",
            CASE_MONEY_TYPE3: "N",
            CASE_MONEY_TYPE4: "N",
            CASE_MONEY_TYPE5: "N",
            CASE_MONEY_DAMAGE_VALUE: 0,
            CASE_MONEY: [],
        };
        this.checkboxDamage = {
            case_type1: false,
            case_type2: false,
            case_type3: false,
            case_type4: false,
            case_type5: false,
        };
    }
    onResized(event: ResizedEvent): void {
        if (event.newWidth > 0 && event.newWidth < 881.98) {
            this.displayBlockTop = "col-12";
            this.displayBlock = "col-12";
            this.blockRightClass = false;
        } else {
            this.displayBlockTop = "col-8";
            this.displayBlock = "col-6";
            this.blockRightClass = true;
        }
    }
    ChangeTabIsDamage(isDamage) {
        if (isDamage === "Y") {
            this.indexIsDamage = 1;
            this.formData.CASE_MONEY_DAMAGE = true;
        } else {
            this.formData.CASE_MONEY_DAMAGE = false;
            this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
        }
    }
    ChangeHasDamage(e) {
        if (e.value) {
            this.defaultDamageType = e.value;
            this.formData.CASE_MONEY_DAMAGE = e.value ? "Y" : "N";
            this.DefaultCheckbox();
            // Default ตอนเริ่ม Block เริ่มต้น
            if (this.mainConponent.formType === "add") {
                if (e.value === 1) {
                    const bankInfoList = this.bankInfoList[0] ?? null;
                    this.listDamageBank = [];
                    this.listDamageBankOther = [];
                    this.listDamageOther = [];
                    this.formData = {
                        CASE_MONEY_DAMAGE: "Y",
                        CASE_MONEY_TYPE1: "Y",
                        CASE_MONEY_TYPE2: "N",
                        CASE_MONEY_TYPE3: "N",
                        CASE_MONEY_TYPE4: "N",
                        CASE_MONEY_TYPE5: "N",
                        CASE_MONEY_DAMAGE_VALUE: 0,
                    };
                    this.checkboxDamage.case_type1 = true;
                } else {
                    this.formData.CASE_MONEY_DAMAGE = "N";
                    this.listDamageBank = [];
                    this.listDamageBankOther = [];
                    this.listDamageOther = [];
                }
            }
            this.limitSizeBank = 0;
            this.limitSizeBankOther = 0;
            this.limitSizeOther = 0;
            this.maxSizeBuffer = 0;
        }
    }
    ChangeMoneyType(e, type) {
        this.formData[type] = e.value ? "Y" : "N";
        if (this.mainConponent.formType === "add") {
            if (type === "CASE_MONEY_TYPE1") {
                if (e.value == false) {
                    Swal.fire({
                        title: "แจ้งเตือน!",
                        text: "ต้องการลบข้อมูลของความเสียหายประเภทเงินหรือไม่ ?",
                        icon: "warning",
                        confirmButtonText: "ตกลง",
                        showDenyButton: true,
                        denyButtonText: "ยกเลิก",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.limitSizeBank = 0;
                            this.listDamageBank = [];
                            this.formData.CASE_MONEY_TYPE3 = "N";
                            this.formData.CASE_MONEY_DAMAGE_VALUE = 0;
                        } else {
                            this.checkboxDamage.case_type1 = true;
                        }
                    });
                }
            } else if (type === "CASE_MONEY_TYPE2") {
                this.checkCount += 1;
                if (e.value == false && this.checkCount > 1) {
                    Swal.fire({
                        title: "แจ้งเตือน!",
                        text: "ต้องการลบข้อมูลที่กรอกแล้วหรือไม่?",
                        icon: "warning",
                        confirmButtonText: "ตกลง",
                        showDenyButton: true,
                        denyButtonText: "ยกเลิก",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.limitSizeOther = 0;
                            this.listDamageOther = [];
                        } else {
                            this.checkboxDamage.case_type2 = true;
                        }
                    });
                }
            } else if (type === "CASE_MONEY_TYPE3") {
                this.limitSizeBank = 0;
                this.listDamageBank = [];
            } else if (type === "CASE_MONEY_TYPE4") {
                this.checkCount += 1;
                if (e.value == false && this.checkCount > 3) {
                    Swal.fire({
                        title: "แจ้งเตือน!",
                        text: "ต้องการลบข้อมูลที่กรอกแล้วหรือไม่?",
                        icon: "warning",
                        confirmButtonText: "ตกลง",
                        showDenyButton: true,
                        denyButtonText: "ยกเลิก",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.limitSizeOther = 0;
                            this.listDamageOther = [];
                        } else {
                            this.checkboxDamage.case_type2 = true;
                        }
                    });
                }
            } else if (type === "CASE_MONEY_TYPE5") {
                this.checkCount += 1;
                if (e.value == false && this.checkCount > 2) {
                    Swal.fire({
                        title: "แจ้งเตือน!",
                        text: "ต้องการลบข้อมูลที่กรอกแล้วหรือไม่?",
                        icon: "warning",
                        confirmButtonText: "ตกลง",
                        showDenyButton: true,
                        denyButtonText: "ยกเลิก",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.formData.REPUTATION = "";
                        } else {
                            this.checkboxDamage.case_type5 = true;
                        }
                    });
                }
            }
        }
    }

    ChangeBankTranferType(e) {
        if (e.value) {
            const d: any = this.bankTransferType.filter(
                (r) => r.ID === e.value
            );
            this.popupFormData.CASE_MONEY_BANK_TRANFER = `${d[0].ID}`;
            this.popupFormData.CASE_MONEY_BANK_TRANFER_NAME = `${d[0].TEXT}`;
            this.popupConfigs.LabelBankAccount =
                d[0].ID === "T" ? "เลขบัญชี" : "เลขพร้อมเพย์";
        }

        this.bgColorTypeTransfer = e.value === "T" ? "st-sufferer-bg-last" : "";
    }
    ChangeRadioDamage(e) {
        if (e.value) {
            // console.log('ChangeRadioDamage',e.value);
            // this.openDetailBlock = e.value === 1?true:false;
        }
    }
    ItemDamageAdd(type = null) {
        this.popup = true;
        this.reloadDataPopup = true;
        this.popupType = "add";
        this.popupConfigs = {
            titlePopup:
                type === "O"
                    ? "เพิ่มรายการ"
                    : "เพิ่มรายการ (บัญชีการ รับ/โอนเงิน)",
            LabelBankAccount: "เลขบัญชี",
        };

        this.popupFormData = {};
        if (type === "T") {
            this.maxSizeBuffer = this.limitSizeBank;
            const bankTransfer = this.bankTransferType[0];
            this.popupFormData = {
                BANK_DAMAGE_VALUE: 0,
                CASE_MONEY_CHANNEL_TYPE: type,
                CASE_MONEY_BANK_TRANFER: `${bankTransfer.ID}`,
                CASE_MONEY_BANK_TRANFER_NAME: `${bankTransfer.TEXT}`,
            };
            this.popupSubFormList = [];
            this.ItemDataTable();
            this.popupFormData.TYPE_ORIGIN_ACCOUNT = this.bankAccountType[0].ID;
            this.popupFormData.TYPE_ACCOUNT = this.bankAccountType[1].ID;
        } else if (type === "P") {
            this.maxSizeBuffer = this.limitSizeBankOther;
            this.bankOtherListTypeOther = false;
            this.popupFormData = {
                BANK_DAMAGE_VALUE: 0,
                CASE_MONEY_CHANNEL_TYPE: type,
                BANK_MONEY_OTHER_ID: `${this.bankOtherList[0].TRANSFER_TYPE_CODE}`,
                BANK_MONEY_OTHER_NAME: `${this.bankOtherList[0].TRANSFER_TYPE_NAME}`,
            };
            this.ItemDataTable();
        } else if (type === "O") {
            this.maxSizeBuffer = this.limitSizeOther;
            this.listUploadFileWayOther = [];
            const WayOtherList = this.WayOtherList[0];
            this.popupFormData = {
                CASE_MONEY_CHANNEL_TYPE: type,
                CASE_MONEY_BANK_OTHER_ID: WayOtherList.BANK_OTHER_ID,
                CASE_MONEY_BANK_OTHER_NAME: WayOtherList.BANK_OTHER_NAME,
                CASE_MONEY_BANK_OTHER_CODE: WayOtherList.BANK_OTHER_CODE,
            };
            this.popupFormData.BANK_TRANSFER_DATE = this._date.SetDateDefault(0);
            this.minBirthDateOther = this._date.SetDateDefault(10, true);
            this.maxBirthDateOther = this._date.SetDateDefault(0);
            this.loadDateBoxOther = true;
        }
    }

    BytesToSize(bytes) {
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        if (bytes === 0) {
            return "0 Byte";
        }
        const data: any = Math.floor(Math.log(bytes) / Math.log(1024));
        const i = parseInt(data, 10);
        return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
    }
    uploadFile(uploadTag, index) {
        const files: FileList = uploadTag.files;
        if (files.length === 1) {
        }
    }
    filesDropped(e): void {
        const files = e;
        if (files.length === 1) {
            this.ConvertBase64(files[0].file);
        } else {
            alert("ไม่สามารถอัพโหลดไฟล์มากกว่า 1 ไฟล์ได้");
        }
    }
    OpenFileDialog(uploadTag) {
        // e.event.stopPropagation();
        uploadTag.click();
    }
    OpenFileDialogOther(uploadTag) {
        uploadTag.value = "";
        uploadTag.click();
    }
    OpenUploadFileDamageListAttachment(index, uploadTag) {
        this.indexUploadFileDamageListAttachment = index;
        uploadTag.value = "";

        uploadTag.click();
    }
    async UploadFileDamageListAttachment(uploadTag) {
        const files: FileList = uploadTag.files;
        if (files.length === 1) {
            this.isLoading = true;
            const res = await this._issueFile.CheckFileUploadAllowMaxSize(
                this.maxSizeBuffer,
                files[0]
            );
            if (res.status) {
                this.maxSizeBuffer = res.uploadSizeAll ?? 0;
                const index = this.indexUploadFileDamageListAttachment;
                this.popupSubFormList[index].BANK_DOC = res.filebase64;
            }
            this.isLoading = false;
        }
    }
    ConvertBase64AddTable(file, index) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            let base64File = {} as any;
            base64File = reader.result;
            this.popupSubFormList[index].BANK_DOC = {
                storage: "base64",
                name: "file",
                url: base64File,
                size: file.size,
                sizeDetail: this.BytesToSize(file.size),
                type: file.type,
                originalName: file.name,
            };
        };
    }
    ConvertBase64(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            let base64File = {} as any;
            base64File = reader.result;
            this.popupSubFormuploadFileBuffer = {
                storage: "base64",
                name: "file",
                url: base64File,
                size: file.size,
                sizeDetail: this.BytesToSize(file.size),
                type: file.type,
                originalName: file.name,
            };
            this.popupSubFormuploadFileBufferStatus = true;
        };
    }
    ItemDamageSubAdd() {
        this.popupSubFormAddOpen = true;
        this.popupSubFormData = {};
        this.loadDateBox = true;
        this.popupSubFormuploadFileBufferStatus = false;
        this.popupSubFormuploadFileBuffer = {};
        const countItem = this.popupSubFormList.length ?? 0;
        if (countItem === 0) {
            this.popupSubFormList = [];
        }
        setTimeout(() => {
            const hightScroll =
                this.scrollViewForm.instance.scrollHeight() ?? 0;
            this.scrollViewForm.instance.scrollBy(hightScroll);
        }, 200);
    }
    async OnloadUploadFIleList() {
        await this.delay(1000);
    }
    delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    ItemDataTable() {
        const countItem = this.popupSubFormList.length ?? 0;
        if (countItem === 0) {
            this.popupSubFormList = [];
        }

        this.popupSubFormList.push({
            BANK_TRANSFER_DATE: this._date.SetDateDefault(0),
            BANK_TRANSFER_TIME: this._date.ConvertToTimeFormat(),
        });
    }
    ItemDataTableDelete(index) {
        Swal.fire({
            title: "ยืนยันการลบข้อมูล?",
            text: " ",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#7d7d7d",
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ตกลง",
        }).then((result) => {
            if (result.isConfirmed) {
                this.maxSizeBuffer -= this.popupSubFormList[index].BANK_DOC.size ?? 0;
                this.popupSubFormList[index].BANK_DOC = null;
            }
        });
    }
    async SetDataSubFormList(data: any = []) {
        this.popupSubFormList = [];
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            this.popupSubFormList.push(item);
        }
        return;
    }
    async SetDataSubFormListOther(data: any = []) {
        this.listUploadFileWayOther = [];
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            this.listUploadFileWayOther.push(item);
        }
        return;
    }

    onresetbanklist() {
        this.isAdding = true;
        this.editTransferData = {}
        var backupformmoney = this.formmoney;
        this.formmoney = {};

        this.formmoney.BANK_LIST_ID = backupformmoney.BANK_LIST_ID
        this.formmoney.BANK_ORIGIN_LIST_ID = backupformmoney.BANK_ORIGIN_LIST_ID
        this.formmoney.BANK_TRANSFER_DATE = backupformmoney.BANK_TRANSFER_DATE
        this.formmoney.BANK_DAMAGE_VALUE_UNIT = backupformmoney.BANK_DAMAGE_VALUE_UNIT
        this.formmoney.TYPE_BANK_ID = backupformmoney.TYPE_BANK_ID

        if (this.formmoney.TYPE_BANK_ID == 1 || this.formmoney.TYPE_BANK_ID == 2) {
            this.formmoney.BANK_DAMAGE_VALUE_UNIT = "บาท";
        } else {
            this.formmoney.BANK_DAMAGE_VALUE_UNIT = "";
        }
        this.now = null;
        this.listUploadFileformmoney = [];
        this.listUploadFileformCrypto = [];
    }

    async OS_ItemDamageSubEdit(index = null, data = {} as any) {
        this.isAdding = false;
        this.editTransferData = { ...data, index }
        console.log(data);
        this.formmoney.BANK_ORIGIN_LIST_ID = data.BANK_ORIGIN_LIST_ID;
        this.formmoney.BANK_LIST_ID = data.BANK_LIST_ID;
        this.formmoney.BANK_TRANSFER_DATE = data.BANK_TRANSFER_DATE;
        this.formmoney.BANK_TRANSFER_TIME = data.BANK_TRANSFER_TIME;
        this.formmoney.BANK_DAMAGE_VALUE = data.BANK_DAMAGE_VALUE;
        this.formmoney.DIRECTION = data.DIRECTION;
        this.formmoney.BANK_REMARK = data.BANK_REMARK;
        this.formmoney.BANK_DAMAGE_VALUE_UNIT = data.BANK_DAMAGE_VALUE_UNIT;
        this.formmoney.BANK_DAMAGE_VALUE_BAHT = data.BANK_DAMAGE_VALUE_BAHT;
        this.formmoney.CASE_MONEY_CHANNEL_TYPE = "T";
        this.formmoney.MONNEY_DOC = data.MONNEY_DOC;
        if (data.MONNEY_DOC.length > 0) {
            this.listUploadFileformmoney.push(data.MONNEY_DOC[0]);
        }
        const date = this.convertDate(this.formmoney.BANK_TRANSFER_DATE, this.formmoney.BANK_TRANSFER_TIME);
        this.now = new Date(date[0], date[1], date[2], date[3], date[4], date[5]);
    }

    async ItemDamageSubEdit(index = null, data = {} as any) {
        this.popupType = "edit";
        this.popupIndex = index;
        this.popup = true;
        this.reloadDataPopup = true;
        this.popupFormData = {};
        const setData = {};
        const d = data;
        for (const key in d) {
            if (d[key] !== null && d[key] !== undefined) {
                if (key === "BANK_DETAIL") {
                    await this.SetDataSubFormList(d[key]);
                } else if (key === "BANK_OTHER_ATTACHMENT") {
                    await this.SetDataSubFormListOther(d[key]);
                } else if (key === "BANK_DAMAGE_VALUE") {
                    setData[key] = d[key] ?? 0;

                    this.popupFormDataDamageBuffer = d[key] ?? 0;
                } else {
                    setData[key] = d[key];
                }
            }
        }
        this.popupFormData = setData;
        if (this.popupFormData.CASE_MONEY_CHANNEL_TYPE === "T") {
            this.maxSizeBuffer = this.limitSizeBank;
        } else if (this.popupFormData.CASE_MONEY_CHANNEL_TYPE === "P") {
            this.maxSizeBuffer = this.limitSizeBankOther;
        } else if (this.popupFormData.CASE_MONEY_CHANNEL_TYPE === "O") {
            this.maxSizeBuffer = this.limitSizeOther;
        }
    }
    CheckArray(data: any = []) {
        if(data){
            const countArray = data.length ?? 0;
            if (countArray > 0) {
                return true;
            }
        }
        return false;
    }
    CheckSammaryValue(num) {
        if (num) {
            return parseFloat(num).toFixed(2);
        }
        return 0;
    }
    SumAllDamageValue(num, type = "sum") {
        this.calulatemoney([...this.listDamageCrytro, ...this.listDamageBank]);
    }
    SumSubDamageValue(num, type = "sum") {
        this.calulatemoney([...this.listDamageCrytro, ...this.listDamageBank]);
    }

    ItemDamageSubSave() {
        if (!this.subForm.instance.validate().isValid) {
            this.ShowInvalidDialog();
            return;
        }
        const DmValue = this.popupSubFormData.BANK_DAMAGE_VALUE ?? 0;
        const saveData = {
            BANK_TRANSFER_DATE: this._date.ConvertToDateFormat(this.popupSubFormData.BANK_TRANSFER_DATE),
            BANK_TRANSFER_TIME: this.popupSubFormData.BANK_TRANSFER_TIME,
            BANK_DAMAGE_VALUE: DmValue,
        };

        if (this.popupSubFormuploadFileBuffer) {
            const key = "BANK_DOC";
            saveData[key] = this.popupSubFormuploadFileBuffer;
        }
        this.SumSubDamageValue(DmValue, "sum");
        this.popupSubFormList.push(saveData);
        this.ItemDamageSubClose("save");
    }
    DeleteFileDocItemDamageSub(index = null) {
        Swal.fire({
            title: "ยืนยันการลบข้อมูล?",
            text: " ",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#7d7d7d",
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ตกลง",
        }).then((result) => {
            if (result.isConfirmed) {
                const damageValue =
                    this.popupSubFormList[index].BANK_DAMAGE_VALUE || 0;
                this.SumSubDamageValue(damageValue, "remove");
                this.popupSubFormList.splice(index, 1);
            }
        });
    }
    ItemDamageSubClose(type = "close") {
        this.popupSubFormAddOpen = false;
        this.popupSubFormData = {};
        this.loadDateBox = false;
        this.loadDateBox = false;
    }
    OnSelectBankAccount(e) {
        if (e.value) {
            const data = this.selectBankInfo.instance.option("selectedItem");
            if (data) {
                this.popupFormData.BANK_ID = data.BANK_ID;
                this.popupFormData.BANK_NAME = data.BANK_NAME;
            } else {
                this.popupFormData.BANK_ID = e.value;
            }
        }
    }
    OnSelectBankOther(e) {
        if (e.value) {
            const d = this.bankOtherList.filter(
                (r) => r.TRANSFER_TYPE_CODE === e.value
            );
            this.popupFormData.BANK_MONEY_OTHER_ID = d[0].TRANSFER_TYPE_CODE;
            this.popupFormData.BANK_MONEY_OTHER_NAME = d[0].TRANSFER_TYPE_NAME;
            this.popupFormData.TRANSFER_CODE = d[0].TRANSFER_CODE;
        }
    }
    OnSelectWayOther(e) {
        if (e.value) {
            const data = this.selectWayOther.instance.option("selectedItem");
            if (data) {
                this.popupFormData.CASE_MONEY_BANK_OTHER_ID =
                    data.BANK_OTHER_ID;
                this.popupFormData.CASE_MONEY_BANK_OTHER_NAME =
                    data.BANK_OTHER_NAME;
                this.popupFormData.CASE_MONEY_BANK_OTHER_CODE =
                    data.BANK_OTHER_CODE;
            } else {
                this.popupFormData.CASE_MONEY_BANK_OTHER_ID = e.value;
            }
        }
    }
    CheckString(event) {
        const seperator = "^[A-Za-zก-๏\\s]+$";
        // const seperator = '^([0-9])';
        const maskSeperator = new RegExp(seperator, "g");
        const result = maskSeperator.test(event.key);
        return result;
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
    PopupViewFile(data) {

        if (data) {
            // console.log("datafile", data);
            // console.log('data.url',data.url);
            // const splitStr = data.url.split('base64,');
            // splitStr[0] = splitStr[0] + "base64,";
            // window.open(splitStr[0] + encodeURI(splitStr[1]));
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

    }
    ClosePopupViewFile(e) {
        this.popupViewFile = false;
        this.popupViewFileData = {};
    }
    DownloadFile(data) {
        const linkSource = data.url;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = data.originalName;
        downloadLink.click();
    }
    ClearDocBuffer() {
        this.popupSubFormuploadFileBufferStatus = false;
        this.popupSubFormuploadFileBuffer = {};
    }
    ItemDamageDelete(index, type) {
        Swal.fire({
            title: "ยืนยันการลบไฟล์?",
            text: " ",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#7d7d7d",
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ตกลง",
        }).then((result) => {
            if (result.isConfirmed) {
                if (type === "T") {
                    if (
                        this.CheckArray(this.listDamageBank[index].BANK_DETAIL)
                    ) {
                        const fileSizeSum = this.ItemDamageDeleteSumFileSize(
                            this.listDamageBank[index].BANK_DETAIL
                        );
                        this.limitSizeBank -= fileSizeSum ?? 0;
                    }
                    const dmValueAll =
                        this.listDamageBank[index].BANK_DAMAGE_VALUE ?? 0;
                    this.SumAllDamageValue(dmValueAll, "remove");
                    this.listDamageBank.splice(index, 1);
                } else if (type === "P") {
                    if (
                        this.CheckArray(
                            this.listDamageBankOther[index].BANK_DETAIL
                        )
                    ) {
                        const fileSizeSum = this.ItemDamageDeleteSumFileSize(
                            this.listDamageBankOther[index].BANK_DETAIL
                        );
                        this.limitSizeBankOther -= fileSizeSum ?? 0;
                    }
                    const dmValueAll =
                        this.listDamageBankOther[index].BANK_DAMAGE_VALUE ?? 0;
                    this.SumAllDamageValue(dmValueAll, "remove");
                    this.listDamageBankOther.splice(index, 1);
                } else if (type === "O") {
                    if (
                        this.CheckArray(
                            this.listDamageOther[index].BANK_OTHER_ATTACHMENT
                        )
                    ) {
                        const fileSizeSum =
                            this.ItemDamageDeleteSumFileSizeOther(
                                this.listDamageOther[index]
                                    .BANK_OTHER_ATTACHMENT
                            );
                        this.limitSizeOther -= fileSizeSum ?? 0;
                    }
                    const dmValueAll =
                        this.listDamageOther[index].BANK_DAMAGE_VALUE ?? 0;
                    this.SumAllDamageValue(dmValueAll, "remove");
                    this.listDamageOther.splice(index, 1);
                    this.SumAllDamageValue(dmValueAll, "remove");
                }
            }
        });
    }
    ItemDamageDeleteSumFileSize(listDoc) {
        let sumSize = 0;
        for (const item of listDoc) {
            if (item.BANK_DOC) {
                sumSize += item.BANK_DOC.size;
            }
        }
        return sumSize;
    }
    ItemDamageDeleteSumFileSizeOther(listDoc) {
        let sumSize = 0;
        for (const item of listDoc) {
            sumSize += item.size;
        }
        return sumSize;
    }
    ItemDamageSubDelete(index, subIndex, type ,typeSub="") {
        Swal.fire({
            title: "ยืนยันการลบไฟล์?",
            text: " ",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#7d7d7d",
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ตกลง",
        }).then((result) => {
            if (result.isConfirmed) {
                if (type === "T") {
                    if(typeSub === 'crytro'){
                        const dmValueItem = this.listDamageCrytro[index].BANK_DAMAGE_VALUE ?? 0;
                        const numfloat = parseFloat(dmValueItem);
                        if (dmValueItem > 0) {
                            const SumAll = parseFloat(this.listDamageCrytro[index].BANK_DAMAGE_VALUE);
                            const samary: any = SumAll - numfloat;
                            this.listDamageCrytro[index].BANK_DAMAGE_VALUE = parseFloat(samary).toFixed(2);
                        }
                        if (this.listDamageCrytro[index].BANK_DOC) {
                            this.limitSizeBank -= this.listDamageCrytro[index].BANK_DOC.size ?? 0;
                        }
                        this.listDamageCrytro.splice(index, 1);
                    }else{
                        const dmValueItem = this.listDamageBank[index].BANK_DAMAGE_VALUE ?? 0;
                        const numfloat = parseFloat(dmValueItem);
                        if (dmValueItem > 0) {
                            const SumAll = parseFloat(this.listDamageBank[index].BANK_DAMAGE_VALUE);
                            const samary: any = SumAll - numfloat;
                            this.listDamageBank[index].BANK_DAMAGE_VALUE = parseFloat(samary).toFixed(2);
                        }
                        if (this.listDamageBank[index].BANK_DOC) {
                            this.limitSizeBank -= this.listDamageBank[index].BANK_DOC.size ?? 0;
                        }
                        this.listDamageBank.splice(index, 1);
                    }
                } else if (type === "P") {
                    const dmValueItem =
                        this.listDamageBankOther[index].BANK_DETAIL[subIndex]
                            .BANK_DAMAGE_VALUE ?? 0;
                    const numfloat = parseFloat(dmValueItem);
                    if (dmValueItem > 0) {
                        const SumAll = parseFloat(
                            this.listDamageBankOther[index].BANK_DAMAGE_VALUE
                        );
                        const samary: any = SumAll - numfloat;
                        this.listDamageBankOther[index].BANK_DAMAGE_VALUE =
                            parseFloat(samary).toFixed(2);
                        this.SumAllDamageValue(dmValueItem, "remove");
                    }
                    if (
                        this.listDamageBankOther[index].BANK_DETAIL[subIndex]
                            .BANK_DOC
                    ) {
                        this.limitSizeBankOther -=
                            this.listDamageBankOther[index].BANK_DETAIL[
                                subIndex
                            ].BANK_DOC.size ?? 0;
                    }
                    this.listDamageBankOther[index].BANK_DETAIL.splice(
                        subIndex,
                        1
                    );
                }

                this.calulatemoney([...this.listDamageCrytro, ...this.listDamageBank]);
            }
        });
    }
    ItemDamageSubOtherDelete(index, subIndex) {
        Swal.fire({
            title: "ยืนยันการลบไฟล์?",
            text: " ",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#7d7d7d",
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ตกลง",
        }).then((result) => {
            if (result.isConfirmed) {
                const file =
                    this.listDamageOther[index].BANK_OTHER_ATTACHMENT[subIndex];
                this.limitSizeOther -= file.size ?? 0;
                this.listDamageOther[index].BANK_OTHER_ATTACHMENT.splice(
                    subIndex,
                    1
                );
            }
        });
    }
    ItemDamageSubOtherPopupDelete(index = null) {
        Swal.fire({
            title: "ยืนยันการลบไฟล์?",
            text: " ",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#7d7d7d",
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ตกลง",
        }).then((result) => {
            if (result.isConfirmed) {
                const file = this.listUploadFileWayOther[index];
                this.maxSizeBuffer -= file.size ?? 0;
                this.listUploadFileWayOther.splice(index, 1);
            }
        });
    }
    Reset() {
        this.form1.instance._refresh();
        this.form2.instance._refresh();
        this.form3.instance._refresh();
    }
    ReplaceText(key) {
        return key.replace("POPUP_", "");
    }
    ReplaceTextEdit(key) {
        return `POPUP_${key}`;
    }




    async ItemDamageSave() {
        // console.log('= this.popupFormData->>>',this.popupFormData);
        // console.log('= this.popupFormData->>>',this.popupSubFormList);
        let checkForm = true;
        if (this.popupFormData.CASE_MONEY_CHANNEL_TYPE === "T") {
            checkForm = !this.form1.instance.validate().isValid;
        } else if (this.popupFormData.CASE_MONEY_CHANNEL_TYPE === "P") {
            checkForm = !this.form2.instance.validate().isValid;
        } else if (this.popupFormData.CASE_MONEY_CHANNEL_TYPE === "O") {
            checkForm = !this.form3.instance.validate().isValid;
        }

        if (checkForm) {
            this.ShowInvalidDialog();
            return;
        }

        if (this.popupSubFormAddOpen) {
            this.ShowInvalidDialog("กรุณาบันทึกรายการโอนเงิน");
            return;
        }
        const countItem = this.popupSubFormList.length ?? 0;

        if (countItem > 0) {
            const validateListDamage = await this.ValidateDamageTP(
                this.popupSubFormList
            );
            if (!validateListDamage) {
                this.ShowInvalidDialog("กรุณากรอกจำนวนเงิน");
                return;
            }
        }

        if (countItem > 0 && this.popupFormData.BANK_MONEY_OTHER_ID === "T") {
            const validateListDamage = await this.TRUEMONEYValidateDamageTP(
                this.popupSubFormList
            );
            if (!validateListDamage) {
                this.ShowInvalidDialog(
                    "มูลค่าความเสียหายต้องมากกว่า 100 บาทขึ้นไป"
                );
                return;
            }

            if (this.bankTypeSelected === "P") {
                this.popupFormData.BANK_MONEY_OTHER_ACCOUNT =
                    this.PhoneNumberSanitize(
                        this.popupFormData.BANK_MONEY_OTHER_ACCOUNT
                    );
            } else if (this.bankTypeSelected === "W") {
                this.popupFormData.BANK_MONEY_OTHER_ACCOUNT =
                    this.WalletIdSanitize(
                        this.popupFormData.BANK_MONEY_OTHER_ACCOUNT
                    );
            } else if (this.bankTypeSelected === "B") {
                this.popupFormData.BANK_MONEY_OTHER_ACCOUNT =
                    this.BankAccountSanitize(
                        this.popupFormData.BANK_MONEY_OTHER_ACCOUNT
                    );
            }
        }

        const typeSaveData = this.popupFormData.CASE_MONEY_CHANNEL_TYPE;
        const setData = {};
        const d = this.popupFormData;
        for (const key in d) {
            if (d[key] !== null && d[key] !== undefined) {
                setData[key] = d[key];
            }
        }
        const dmkey = "BANK_DAMAGE_VALUE";

        if (countItem > 0) {
            setData[dmkey] = await this.SummaryBankDamageTP(
                this.popupSubFormList
            );
            const setKey = "BANK_DETAIL";
            setData[setKey] = this.popupSubFormList;
        }
        if (this.popupType === "edit") {
            this.SumAllDamageValue(this.popupFormDataDamageBuffer, "remove");
            this.SumAllDamageValue(setData[dmkey], "sum");
            this.SaveEditDataByType(this.popupIndex, typeSaveData, setData);
            // this.formData.CASE_MONEY[this.popupIndex] = setData;
        } else {
            // console.log('this.popupFormData',this.popupFormData);
            // console.log('setData',setData);
            this.SumAllDamageValue(setData[dmkey], "sum");
            this.SaveAddDataByType(typeSaveData, setData);
        }

        this.SaveMaxSizeLimit(typeSaveData);
        this.ItemDamageClose();
        // console.log('formData',this.formData);
    }
    async SummaryBankDamageTP(data: any = []) {
        let sumValue = 0;
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            sumValue += item.BANK_DAMAGE_VALUE;
        }
        return sumValue;
    }
    async ValidateDamageTP(data: any = []) {
        for (const item of data) {
            if (
                item.BANK_DAMAGE_VALUE <= 0 ||
                item.BANK_DAMAGE_VALUE === undefined ||
                item.BANK_DAMAGE_VALUE === null
            ) {
                return false;
            }
        }

        return true;
    }
    async TRUEMONEYValidateDamageTP(data: any = []) {
        for (const item of data) {
            if (item.BANK_DAMAGE_VALUE < 100) {
                return false;
            }
        }

        return true;
    }

    SaveMaxSizeLimit(type) {
        if (type === "T") {
            this.limitSizeBank = this.maxSizeBuffer ?? 0;
        } else if (type === "P") {
            this.limitSizeBankOther = this.maxSizeBuffer ?? 0;
        } else if (type === "O") {
            this.limitSizeOther = this.maxSizeBuffer ?? 0;
        }
    }
    SaveAddDataByType(type, data) {
        if (type === "T") {
            this.listDamageBank.push(data);
        } else if (type === "P") {
            this.listDamageBankOther.push(data);
        } else if (type === "O") {
            if (this.CheckArray(this.listUploadFileWayOther)) {
                const setKey = "BANK_OTHER_ATTACHMENT";
                data[setKey] = this.listUploadFileWayOther;
            }
            this.listDamageOther.push(data);
            this.calulatemoney([...this.listDamageCrytro, ...this.listDamageBank]);

        }
    }
    SaveEditDataByType(index, type, data) {
        if (type === "T") {
            this.listDamageBank[index] = data;
        } else if (type === "P") {
            this.listDamageBankOther[index] = data;
        } else if (type === "O") {
            if (this.CheckArray(this.listUploadFileWayOther)) {
                const setKey = "BANK_OTHER_ATTACHMENT";
                data[setKey] = this.listUploadFileWayOther;
            }
            this.listDamageOther[index] = data;
            this.calulatemoney([...this.listDamageCrytro, ...this.listDamageBank]);
        }
    }
    ItemDamageClose() {
        this.ItemDamageSubClose();
        this.popupSubFormList = [];
        this.reloadDataPopup = false;
        this.popup = false;
        this.popupForm.formData = {};
        // this.form.instance._refresh();
    }
    MergeArray(arr1: any = [], arr2: any = [], arr3: any = []) {
        let newArry = arr1.concat(arr2);
        newArry = newArry.concat(arr3);
        return newArry;
    }
    Back(e) {
        this.mainConponent.NextIndex(this.mainConponent.indexTab - 1);
    }
    SetTextErrorInvalidListDamage(textArray) {
        let textError = "";
        const checkMoreOneItem = textArray.length > 1 ? true : false;
        for (const [key, item] of textArray.entries()) {
            if (key === 0) {
                const comma = checkMoreOneItem ? "," : "";
                textError += `<span>กรุณาเพิ่มรายละเอียด ${item + comma
                    }</span><br>`;
            } else {
                const comma = key !== textArray.length - 1 ? "," : "";
                textError += `<span style="padding-left: 5px;">${item + comma
                    }</span>`;
            }
        }
        return textError;
    }
    CheckInvalidListDamage() {
        let status = false;
        const textError = [];
        // eslint-disable-next-line prefer-const
        const form = this.formData;
        if (
            form.CASE_MONEY_TYPE1 === "Y" &&
            !this.CheckArray(this.listDamageBank)
        ) {
            textError.push("การโอนเงินผ่านธนาคาร");
            status = true;
        }

        if (
            form.CASE_MONEY_TYPE4 === "Y" &&
            !this.CheckArray(this.listDamageCrytro)
        ) {
            textError.push("การโอนเงินด้วย Cryptocurrency");
            status = true;
        }

        if (
            form.CASE_MONEY_TYPE2 === "Y" &&
            !this.CheckArray(this.listDamageOther)
        ) {
            textError.push("รายการทรัพย์สินที่เสียหาย");
            status = true;
        }

        if (status) {
            const textAlert = this.SetTextErrorInvalidListDamage(textError);
            Swal.fire({
                title: "ผิดพลาด!",
                html: `<div>${textAlert}</div>`,
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => { });
        }

        return status;
    }
    SubmitForm(e) {
        if (this.mainConponent.formType === "add") {
            const dmValue = this.formData.CASE_MONEY_DAMAGE_VALUE ?? 0;
            if (this.defaultDamageType === 1 && this.CheckInvalidListDamage()) {
                return;
            } else if (this.defaultDamageType === 1 && dmValue <= 0) {
                if (this.formData.CASE_MONEY_TYPE1 === 'Y' || this.formData.CASE_MONEY_TYPE2 === 'Y') {
                    this.ShowInvalidDialog("กรุณาเพิ่มรายละเอียดความเสียหาย");
                    return;
                } else if (this.formData.CASE_MONEY_TYPE5 === 'Y') {
                    if (this.formData.REPUTATION == '' || this.formData.REPUTATION == null) {
                        this.ShowInvalidDialog("กรุณาเพิ่มรายละเอียดชื่อเสียงที่เสียหาย");
                        return;
                    }
                } else if (this.formData.CASE_MONEY_TYPE4 === 'Y') {
                    this.ShowInvalidDialog("กรุณาเพิ่มรายละเอียดความเสียหาย");
                    return;
                }
            }
            this.mainConponent.formDataAll.DataDamageShow = {};
            this.listDamageBank = this.removeDuplicateObjects(this.listDamageBank);
            this.listDamageCrytro = this.removeDuplicateObjects(this.listDamageCrytro);
            this.calulatemoney([...this.listDamageCrytro, ...this.listDamageBank]);
            const listMoney = this.removeDuplicateObjects(this.MergeArray(
                [...this.listDamageCrytro, ...this.listDamageBank],
                this.listDamageBankOther,
                this.listDamageOther
            ));
            this.mainConponent.formDataAll.formDamage = {};
            this.mainConponent.formDataAll.formDamage = this.formData;
            this.mainConponent.formDataAll.formDamage.CASE_MONEY = listMoney;
            if (this.checkboxDamage.case_type1) {
                this.mainConponent.formDataAll.formDamage.listDamageBank = [...this.listDamageCrytro, ...this.listDamageBank];
            }
            this.mainConponent.formDataAll.formDamage.listDamageBank =this.listDamageBank;
            this.mainConponent.formDataAll.formDamage.listDamageBankOther = this.listDamageBankOther;
            this.mainConponent.formDataAll.formDamage.listDamageOther = this.listDamageOther;
            this.mainConponent.formDataAll.formDamage.listDamageCrytro = this.listDamageCrytro;
            // localStorage.setItem("form-damage",JSON.stringify(this.formData));
            // console.log(this.formData);
        }
         this.isLoading = true;
         this._OnlineCaseService.SessionDamage(this.formData, User.Current.PersonalId, "create")
         .subscribe(_ => {
             this.isLoading = false;
             if (e != 'tab') {
                 this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
             }
         });
    }

    InputConidtions(event) {
        let d = this.popupFormData.BANK_MONEY_OTHER_ID;
        if (d === "T") {
            return this.TrueMoneyValidator(event);
        } else if (d === "C") {
            return this.CyrptoValidator(event);
        } else if (d === "P") {
            return this.EmailOrNumberValidator(event);
        } else {
            return true;
        }
    }

    TrueMoneyValidator(event) {
        if (this.bankTypeSelected === "P") {
            return this.PhoneNumberValidator(event);
        } else if (this.bankTypeSelected === "W") {
            return this.WalletIdValidator(event);
        } else {
            return this.BankAccountValidator(event);
        }
    }

    /* Phone Number */
    PhoneNumberPattern(params) {
        const makeScope = new RegExp("^[0](?=[0-9]{9,9}$)", "g");
        const makeScopeIden = new RegExp("^([0-9]{13,13})", "g");
        return makeScope.test(params.value) || makeScopeIden.test(params.value)
            ? true
            : false;
    }
    BankNumberPattern(params) {
        const makeScopeIden = new RegExp("^([0-9]{10,15})", "g");
        return makeScopeIden.test(params.value);
    }

    PhoneNumberValidator(event) {
        let value = event.target.value + event.key;
        const makeScope = new RegExp("^[0-9](?=[0-9]{0,9}$)", "g");
        return makeScope.test(value);
    }
    PhoneNumberSanitize(_value) {
        if (!_value) {
            return _value;
        }
        return _value.replace(/[^0-9]/g, "");
    }

    /* Wallet Id */
    WalletIdPattern(params) {
        const makeScope = new RegExp(
            "^[a-zA-Z](?=[a-zA-Z0-9ก-๙!@#$%^&*()_+]{2,31}$)",
            "g"
        );
        return makeScope.test(params.value);
    }
    WalletIdValidator(event) {
        let value = event.target.value + event.key;
        const makeScope = new RegExp(
            "^[a-zA-Z](?=[a-zA-Z0-9ก-๙!@#$%^&*()_+]{0,31}$)",
            "g"
        );
        return makeScope.test(value);
    }
    WalletIdSanitize(_value) {
        if (!_value) {
            return _value;
        }
        return _value.replace(/[^a-zA-Z0-9ก-๙!@#$%^&*()_+]/g, "");
    }

    /* Bank Account Number */
    BankAccountPattern(params) {
        const makeScope = new RegExp("[0-9]{10,15}$", "g");
        return makeScope.test(params.value);
    }
    BankAccountValidator(event) {
        let value = event.target.value + event.key;
        const makeScope = new RegExp("^(?=[0-9]{0,15}$)", "g");
        return makeScope.test(value);
    }
    BankAccountSanitize(_value) {
        if (!_value) {
            return _value;
        }
        return _value.replace(/[^0-9]/g, "");
    }
    CyrptoPattern(params) {
        const makeScope = new RegExp("[^A-Za-z0-9]", "g");
        return !makeScope.test(params.value);
    }
    CyrptoValidator(event) {
        const makeScope = new RegExp("^[A-Za-z0-9]", "g");
        return makeScope.test(event.key);
    }
    AccountNamePattern(params) {
        const makeScope = new RegExp("[A-Za-zก-๏ ]", "g");
        const result = makeScope.test(params.value);
        return result;
    }
    AccountNameValidator(event) {
        const makeScope = new RegExp("^[A-Za-zก-๏. ]", "g");
        const result = makeScope.test(event.key);
        return result;
    }

    EmailOrNumberValidator(event) {
        const makeScope = new RegExp("^[0-9]", "g");
        const result = makeScope.test(event.key);
        if (result) {
            this.emailOrNumber = "N";
            return this.PhoneNumberValidator(event);
        } else {
            this.emailOrNumber = "E";
            return this.EmailValidator(event);
        }
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

    ChangeEntranceDestination(e) {
        let tt =
            this.bankAccountType[0].ID === e.value
                ? this.bankAccountType[1].ID
                : this.bankAccountType[0].ID;

        if (e.element.getAttribute("id") == "TYPE_ORIGIN_ACCOUNT") {
            this.popupFormData.TYPE_ACCOUNT = tt;
        } else {
            this.popupFormData.TYPE_ORIGIN_ACCOUNT = tt;
        }
    }
    OnSelectBankAccountOrigin(e) {
        if (e.value) {
            const data =
                this.selectBankInfoOrigin.instance.option("selectedItem");
            if (data) {
                this.popupFormData.BANK_ORIGIN_ID = data.BANK_ID;
                this.popupFormData.BANK_ORIGIN_NAME = data.BANK_NAME;
            } else {
                this.popupFormData.BANK_ORIGIN_ID = e.value;
            }
        }
    }

    onaddbanklist(e,type = "bank") {
        this.popupbanklist = e;
        this.damagesubConponent.SetDefaultData(type);
    }

    onaddbanklistvilain(e,type = "bank") {
        this.popupbanklistvillain = e;
        this.damagesubConponent.SetDefaultData(type);
    }

    outputdatabank(value) {
        console.log('submit ori', value);
        const typeNameMapping: Record<string, Record<number, string>> = {
            'ธนาคาร': {
                1: '(ธนาคาร ผู้ร้าย)',
                2: '(ธนาคาร ผู้เสียหาย)',
            },
            'พร้อมเพย์': {
                1: '(พร้อมเพย์ ผู้ร้าย)',
                2: '(พร้อมเพย์ ผู้เสียหาย)',
            },
            'True Money': {
                1: '(True Money ผู้ร้าย)',
                2: '(True Money ผู้เสียหาย)',
            },
            'เงินดิจิทัล (Cryptocurrency)': {
                1: '(Cryptocurrency ผู้ร้าย)',
                2: '(Cryptocurrency ผู้เสียหาย)',
            },
            'อื่นๆ': {
                1: '(อื่นๆ ผู้ร้าย)',
                2: '(อื่นๆ ผู้เสียหาย)',
            },
            'QR Code': {
                1: '(QR Code ผู้ร้าย)',
                2: '(QR Code ผู้เสียหาย)',
            },
            'Max Card': {
                1: '(Max Card ผู้ร้าย)',
                2: '(Max Card ผู้เสียหาย)',
            },
            'Paypal': {
                1: '(Paypal ผู้ร้าย)',
                2: '(Paypal ผู้เสียหาย)',
            },
        };
        console.log(value.TYPE_NAME);
        console.log(value.ways);
        const prefix = typeNameMapping[value.TYPE_NAME]?.[value.ways] || '';
        if(value.TYPE_NAME == "True Money"){
            value.TRUEMONEY_TYPE_NAME = !value.TRUEMONEY_TYPE_NAME ? value.TRUEMONEY_TYPE == "P" ? "หมายเลขโทรศัพท์" :  value.TRUEMONEY_TYPE == "W" ? "Wallet ID" : value.TRUEMONEY_TYPE == "B" ? "หมายเลขบัญชี" : "" : value.TRUEMONEY_TYPE_NAME;
        }
        if (prefix) {
            switch (value.TYPE_NAME) {
                case 'ธนาคาร':
                    value.SHOW_NAME = `${prefix}${value.BANK_ORIGIN_NAME}: ${value.BANK_ORIGIN_ACCOUNT} ${value.BANK_ORIGIN_ACCOUNT_NAME}`;
                    break;
    
                case 'พร้อมเพย์':
                    value.SHOW_NAME = `${prefix}${value.BANK_ORIGIN_ACCOUNT_PROMPAY} ${value.BANK_ORIGIN_ACCOUNT_NAME_PROMPAY}`;
                    value.BANK_ORIGIN_ACCOUNT = value.BANK_ORIGIN_ACCOUNT_PROMPAY;
                    break;
    
                case 'True Money':
                    value.SHOW_NAME = `${prefix}${value.BANK_MONEY_OTHER_ACCOUNT} ${value.BANK_ORIGIN_ACCOUNT_NAME || ''} (${value.TRUEMONEY_TYPE_NAME || ''})`;
                    value.BANK_ORIGIN_ACCOUNT = value.BANK_MONEY_OTHER_ACCOUNT;
                    break;
    
                case 'เงินดิจิทัล (Cryptocurrency)':
                case 'อื่นๆ':
                case 'QR Code':
                case 'Max Card':
                case 'Paypal':
                    value.SHOW_NAME = `${prefix}${value.BANK_MONEY_OTHER_ACCOUNT} ${value.BANK_ORIGIN_ACCOUNT_NAME || ''}`;
                    value.BANK_ORIGIN_ACCOUNT = value.BANK_MONEY_OTHER_ACCOUNT;
                    break;
    
                default:
                    break;
            }
        }
        if(value.TYPE_NAME === 'เงินดิจิทัล (Cryptocurrency)'){
            this.bankCrytroListstart.push({...value});
        }else{
            this.bankListstart.push({...value});
        }
        this.formmoney.BANK_ORIGIN_LIST_ID = value["SHOW_NAME"];
    }
    outputdatabankvillain(value) {
        console.log('submit des', value);
        const typeNameMapping: Record<string, Record<number, string>> = {
            'ธนาคาร': {
                1: '(ธนาคาร ผู้ร้าย)',
                2: '(ธนาคาร ผู้เสียหาย)',
            },
            'พร้อมเพย์': {
                1: '(พร้อมเพย์ ผู้ร้าย)',
                2: '(พร้อมเพย์ ผู้เสียหาย)',
            },
            'True Money': {
                1: '(True Money ผู้ร้าย)',
                2: '(True Money ผู้เสียหาย)',
            },
            'เงินดิจิทัล (Cryptocurrency)': {
                1: '(Cryptocurrency ผู้ร้าย)',
                2: '(Cryptocurrency ผู้เสียหาย)',
            },
            'อื่นๆ': {
                1: '(อื่นๆ ผู้ร้าย)',
                2: '(อื่นๆ ผู้เสียหาย)',
            },
            'QR Code': {
                1: '(QR Code ผู้ร้าย)',
                2: '(QR Code ผู้เสียหาย)',
            },
            'Max Card': {
                1: '(Max Card ผู้ร้าย)',
                2: '(Max Card ผู้เสียหาย)',
            },
            'Paypal': {
                1: '(Paypal ผู้ร้าย)',
                2: '(Paypal ผู้เสียหาย)',
            },
        };
        console.log(value.TYPE_NAME);
        console.log(value.ways);
        const prefix = typeNameMapping[value.TYPE_NAME]?.[value.ways] || '';
        if(value.TYPE_NAME == "True Money"){
            value.TRUEMONEY_TYPE_NAME = !value.TRUEMONEY_TYPE_NAME ? value.TRUEMONEY_TYPE == "P" ? "หมายเลขโทรศัพท์" :  value.TRUEMONEY_TYPE == "W" ? "Wallet ID" : value.TRUEMONEY_TYPE == "B" ? "หมายเลขบัญชี" : "" : value.TRUEMONEY_TYPE_NAME;
        }
        if (prefix) {
            switch (value.TYPE_NAME) {
                case 'ธนาคาร':
                    value.SHOW_NAME = `${prefix}${value.BANK_NAME}: ${value.BANK_ACCOUNT} ${value.BANK_ACCOUNT_NAME}`;
                    break;
    
                case 'พร้อมเพย์':
                    value.SHOW_NAME = `${prefix}${value.BANK_ORIGIN_ACCOUNT_PROMPAY} ${value.BANK_ORIGIN_ACCOUNT_NAME_PROMPAY}`;
                    value.BANK_ACCOUNT = value.BANK_ORIGIN_ACCOUNT_PROMPAY;
                    break;
    
                case 'True Money':
                    value.SHOW_NAME = `${prefix}${value.BANK_MONEY_OTHER_ACCOUNT} ${value.BANK_ACCOUNT_NAME || ''} (${value.TRUEMONEY_TYPE_NAME || ''})`;
                    value.BANK_ACCOUNT = value.BANK_MONEY_OTHER_ACCOUNT;
                    break;
    
                case 'เงินดิจิทัล (Cryptocurrency)':
                    case 'อื่นๆ':
                    case 'QR Code':
                    case 'Max Card':
                    case 'Paypal':
                        value.SHOW_NAME = `${prefix}${value.BANK_MONEY_OTHER_ACCOUNT} ${value.BANK_ACCOUNT_NAME || ''}`;
                        value.BANK_ACCOUNT = value.BANK_MONEY_OTHER_ACCOUNT;
                        break;
    
                default:
                    break;
            }
        }
        this.bankListend.push({...value});
        this.formmoney.BANK_LIST_ID = value["SHOW_NAME"];
    }
    onsavelistbanklist(e,type="") {
        if (this.wayStart == this.wayEnd) {
            Swal.fire({
                title: "ผิดพลาด!",
                html: "บัญชีต้นทางและปลายทางไม่ถูกต้อง" + '<br>' + "กรุณาตรวจสอบเส้นทางการทำธุรกรรมให้ถูกต้อง",
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => {
                this.formmoney.BANK_LIST_ID = null;
                this.formmoney.BANK_ORIGIN_LIST_ID = null;
            });
            return
        }
        if(type === "crytro"){
            if (this.formbanknewCrytro.instance.validate().isValid) {
                this.formmoney.BANK_ORIGIN_ACCOUNT = this.formmoneySub.BANK_ORIGIN_ACCOUNT
                this.formmoney.BANK_ORIGIN_ACCOUNT_NAME = this.formmoneySub.BANK_ORIGIN_ACCOUNT_NAME
                this.formmoney.BANK_ORIGIN_ID = this.formmoneySub.BANK_ORIGIN_ID
                this.formmoney.BANK_ORIGIN_NAME = this.formmoneySub.BANK_ORIGIN_NAME
                this.formmoney.SHOW_NAME = this.formmoneySub.SHOW_NAME
                this.formmoney.TYPE_BANK_ID = this.formmoneySub.TYPE_BANK_ID
                this.formmoney.WAYS_ORIGIN = this.formmoneySub.WAYS_ORIGIN
                this.formmoney.BANK_ORIGIN_MONEY_REMARK = this.formmoneySub.BANK_ORIGIN_MONEY_REMARK;

                this.formmoney.CASE_MONEY_CHANNEL_TYPE = this.formmoneySub.CASE_MONEY_CHANNEL_TYPE
                this.formmoney.CASE_MONEY_BANK_TRANFER = this.formmoneySub.CASE_MONEY_BANK_TRANFER
                this.formmoney.CASE_MONEY_BANK_TRANFER_NAME = this.formmoneySub.CASE_MONEY_BANK_TRANFER_NAME

                this.formmoney.BANK_MONEY_OTHER_ID = this.formmoneySub.BANK_MONEY_OTHER_ID
                this.formmoney.BANK_MONEY_OTHER_NAME = this.formmoneySub.BANK_MONEY_OTHER_NAME

                this.formmoney.BANK_ACCOUNT = this.formmoneySub.BANK_ACCOUNT
                this.formmoney.BANK_ACCOUNT_NAME = this.formmoneySub.BANK_ACCOUNT_NAME
                this.formmoney.BANK_ID = this.formmoneySub.BANK_ID
                this.formmoney.BANK_NAME = this.formmoneySub.BANK_NAME
                this.formmoney.SHOW_NAME_END = this.formmoneySub.SHOW_NAME_END
                this.formmoney.WAYS_DESTINATION = this.formmoneySub.WAYS_DESTINATION
                this.formmoney.BANK_MONEY_REMARK = this.formmoneySub.BANK_MONEY_REMARK;

                this.formmoney.CASE_MONEY_CHANNEL_TYPE = "T";
                this.formmoney.MONNEY_DOC = [];
                if (this.listUploadFileformCrypto.length > 0) {
                    this.formmoney.MONNEY_DOC.push(this.listUploadFileformCrypto[0]);
                }
                this.listDamageCrytro.push(this.formmoney);
                const backupformmoney = this.formmoney;
                this.formmoney = {};

                this.formmoney.BANK_LIST_ID = backupformmoney.BANK_LIST_ID;
                this.formmoney.BANK_ORIGIN_LIST_ID = backupformmoney.BANK_ORIGIN_LIST_ID;
                this.formmoney.BANK_TRANSFER_DATE = backupformmoney.BANK_TRANSFER_DATE;
                this.formmoney.BANK_TRANSFER_TIME = backupformmoney.BANK_TRANSFER_TIME;
                this.formmoney.BANK_DAMAGE_VALUE_UNIT = backupformmoney.BANK_DAMAGE_VALUE_UNIT;
                this.formmoney.TYPE_BANK_ID = backupformmoney.TYPE_BANK_ID;
                this.formmoney.WAYS_ORIGIN = backupformmoney.WAYS_ORIGIN;

                this.formmoney.BANK_ORIGIN_ACCOUNT = backupformmoney.BANK_ORIGIN_ACCOUNT;
                this.formmoney.BANK_ORIGIN_ACCOUNT_NAME = backupformmoney.BANK_ORIGIN_ACCOUNT_NAME;
                this.formmoney.BANK_ORIGIN_ID = backupformmoney.BANK_ORIGIN_ID;
                this.formmoney.BANK_ORIGIN_NAME = backupformmoney.BANK_ORIGIN_NAME;
                this.formmoney.SHOW_NAME = backupformmoney.SHOW_NAME;
                this.formmoney.BANK_ORIGIN_MONEY_REMARK = backupformmoney.BANK_ORIGIN_MONEY_REMARK;


                this.formmoney.BANK_ACCOUNT = backupformmoney.BANK_ACCOUNT;
                this.formmoney.BANK_ACCOUNT_NAME = backupformmoney.BANK_ACCOUNT_NAME;
                this.formmoney.BANK_ID = backupformmoney.BANK_ID;
                this.formmoney.BANK_NAME = backupformmoney.BANK_NAME;
                this.formmoney.SHOW_NAME_END = backupformmoney.SHOW_NAME_END;
                this.formmoney.WAYS_DESTINATION = backupformmoney.WAYS_DESTINATION;
                this.formmoney.BANK_MONEY_REMARK = backupformmoney.BANK_MONEY_REMARK;
                if (backupformmoney.TYPE_BANK_ID == 1) {
                    this.formmoney.CASE_MONEY_CHANNEL_TYPE = backupformmoney.TYPE_MAIN;
                    this.formmoney.CASE_MONEY_BANK_TRANFER = backupformmoney.TYPE_ID;
                    this.formmoney.CASE_MONEY_BANK_TRANFER_NAME = backupformmoney.TYPE_NAME;
                } else {
                    this.formmoney.CASE_MONEY_CHANNEL_TYPE = backupformmoney.TYPE_MAIN;
                    this.formmoney.BANK_MONEY_OTHER_ID = backupformmoney.TYPE_ID;
                    this.formmoney.BANK_MONEY_OTHER_NAME = backupformmoney.TYPE_NAME;

                }


                if (this.formmoney.TYPE_BANK_ID == 1 || this.formmoney.TYPE_BANK_ID == 2) {
                    this.formmoney.BANK_DAMAGE_VALUE_UNIT = "บาท";
                } else {
                    this.formmoney.BANK_DAMAGE_VALUE_UNIT = "";
                }


                this.listUploadFileformCrypto.splice(0, 1);
                this.calulatemoney([...this.listDamageCrytro, ...this.listDamageBank]);
                this.now = null;
            }else{
                this._formValidate.ValidateForm(
                    this.formbanknewCrytro.instance.validate().brokenRules
                );
                return;
            }
        }else{
            if (this.formbanknew.instance.validate().isValid) {
                this.formmoney.BANK_ORIGIN_ACCOUNT = this.formmoneySub.BANK_ORIGIN_ACCOUNT
                this.formmoney.BANK_ORIGIN_ACCOUNT_NAME = this.formmoneySub.BANK_ORIGIN_ACCOUNT_NAME
                this.formmoney.BANK_ORIGIN_ID = this.formmoneySub.BANK_ORIGIN_ID
                this.formmoney.BANK_ORIGIN_NAME = this.formmoneySub.BANK_ORIGIN_NAME
                this.formmoney.SHOW_NAME = this.formmoneySub.SHOW_NAME
                this.formmoney.TYPE_BANK_ID = this.formmoneySub.TYPE_BANK_ID
                this.formmoney.WAYS_ORIGIN = this.formmoneySub.WAYS_ORIGIN
                this.formmoney.BANK_ORIGIN_MONEY_REMARK = this.formmoneySub.BANK_ORIGIN_MONEY_REMARK;

                this.formmoney.CASE_MONEY_CHANNEL_TYPE = this.formmoneySub.CASE_MONEY_CHANNEL_TYPE
                this.formmoney.CASE_MONEY_BANK_TRANFER = this.formmoneySub.CASE_MONEY_BANK_TRANFER
                this.formmoney.CASE_MONEY_BANK_TRANFER_NAME = this.formmoneySub.CASE_MONEY_BANK_TRANFER_NAME

                this.formmoney.BANK_MONEY_OTHER_ID = this.formmoneySub.BANK_MONEY_OTHER_ID
                this.formmoney.BANK_MONEY_OTHER_NAME = this.formmoneySub.BANK_MONEY_OTHER_NAME

                this.formmoney.BANK_ACCOUNT = this.formmoneySub.BANK_ACCOUNT
                this.formmoney.BANK_ACCOUNT_NAME = this.formmoneySub.BANK_ACCOUNT_NAME
                this.formmoney.BANK_ID = this.formmoneySub.BANK_ID
                this.formmoney.BANK_NAME = this.formmoneySub.BANK_NAME
                this.formmoney.SHOW_NAME_END = this.formmoneySub.SHOW_NAME_END
                this.formmoney.WAYS_DESTINATION = this.formmoneySub.WAYS_DESTINATION
                this.formmoney.BANK_MONEY_REMARK = this.formmoneySub.BANK_MONEY_REMARK;

                this.formmoney.CASE_MONEY_CHANNEL_TYPE = "T";
                this.formmoney.MONNEY_DOC = [];
                if (this.listUploadFileformmoney.length > 0) {
                    this.formmoney.MONNEY_DOC.push(this.listUploadFileformmoney[0]);
                }
                this.listDamageBank.push(this.formmoney);
                const backupformmoney = this.formmoney;
                this.formmoney = {};

                this.formmoney.BANK_LIST_ID = backupformmoney.BANK_LIST_ID;
                this.formmoney.BANK_ORIGIN_LIST_ID = backupformmoney.BANK_ORIGIN_LIST_ID;
                this.formmoney.BANK_TRANSFER_DATE = backupformmoney.BANK_TRANSFER_DATE;
                this.formmoney.BANK_TRANSFER_TIME = backupformmoney.BANK_TRANSFER_TIME;
                this.formmoney.BANK_DAMAGE_VALUE_UNIT = backupformmoney.BANK_DAMAGE_VALUE_UNIT;
                this.formmoney.TYPE_BANK_ID = backupformmoney.TYPE_BANK_ID;
                this.formmoney.WAYS_ORIGIN = backupformmoney.WAYS_ORIGIN;

                this.formmoney.BANK_ORIGIN_ACCOUNT = backupformmoney.BANK_ORIGIN_ACCOUNT;
                this.formmoney.BANK_ORIGIN_ACCOUNT_NAME = backupformmoney.BANK_ORIGIN_ACCOUNT_NAME;
                this.formmoney.BANK_ORIGIN_ID = backupformmoney.BANK_ORIGIN_ID;
                this.formmoney.BANK_ORIGIN_NAME = backupformmoney.BANK_ORIGIN_NAME;
                this.formmoney.SHOW_NAME = backupformmoney.SHOW_NAME;
                this.formmoney.BANK_ORIGIN_MONEY_REMARK = backupformmoney.BANK_ORIGIN_MONEY_REMARK;


                this.formmoney.BANK_ACCOUNT = backupformmoney.BANK_ACCOUNT;
                this.formmoney.BANK_ACCOUNT_NAME = backupformmoney.BANK_ACCOUNT_NAME;
                this.formmoney.BANK_ID = backupformmoney.BANK_ID;
                this.formmoney.BANK_NAME = backupformmoney.BANK_NAME;
                this.formmoney.SHOW_NAME_END = backupformmoney.SHOW_NAME_END;
                this.formmoney.WAYS_DESTINATION = backupformmoney.WAYS_DESTINATION;
                this.formmoney.BANK_MONEY_REMARK = backupformmoney.BANK_MONEY_REMARK;
                if (backupformmoney.TYPE_BANK_ID == 1) {
                    this.formmoney.CASE_MONEY_CHANNEL_TYPE = backupformmoney.TYPE_MAIN;
                    this.formmoney.CASE_MONEY_BANK_TRANFER = backupformmoney.TYPE_ID;
                    this.formmoney.CASE_MONEY_BANK_TRANFER_NAME = backupformmoney.TYPE_NAME;
                } else {
                    this.formmoney.CASE_MONEY_CHANNEL_TYPE = backupformmoney.TYPE_MAIN;
                    this.formmoney.BANK_MONEY_OTHER_ID = backupformmoney.TYPE_ID;
                    this.formmoney.BANK_MONEY_OTHER_NAME = backupformmoney.TYPE_NAME;

                }


                if (this.formmoney.TYPE_BANK_ID == 1 || this.formmoney.TYPE_BANK_ID == 2) {
                    this.formmoney.BANK_DAMAGE_VALUE_UNIT = "บาท";
                } else {
                    this.formmoney.BANK_DAMAGE_VALUE_UNIT = "";
                }


                this.listUploadFileformmoney.splice(0, 1);
                this.calulatemoney([...this.listDamageCrytro, ...this.listDamageBank]);
                this.now = null;
            }else{
                this._formValidate.ValidateForm(
                    this.formbanknew.instance.validate().brokenRules
                );
                return;
            }
        }
    }

    calulatemoney(data) {

        const cehckorigin1 = data.filter(x => x.WAYS_ORIGIN == 1);
        const cehckorigin2 = data.filter(x => x.WAYS_ORIGIN == 2);

        this.sumvillan = 0.0;
        this.sumpersonal = 0.0;
        if (cehckorigin1) {
            cehckorigin1.forEach(element => {
                this.sumvillan = Number(this.sumvillan) + Number(element.BANK_DAMAGE_VALUE);
            });
        }
        if (cehckorigin2) {
            cehckorigin2.forEach(element => {
                this.sumpersonal = Number(this.sumpersonal) + Number(element.BANK_DAMAGE_VALUE);
            });
        }
        const summoney = this.sumpersonal - this.sumvillan;
        if (summoney < 0) {
            this.formData.CASE_MONEY_DAMAGE_VALUE = 0;
        }
        else {
            this.formData.CASE_MONEY_DAMAGE_VALUE = summoney;

        }
        this.sumothermoney = 0.0;

        if (this.listDamageOther) {
            for (let i = 0; i < this.listDamageOther.length; i++) {
                this.sumothermoney = Number(this.sumothermoney) + Number(this.listDamageOther[i].BANK_DAMAGE_VALUE);
            }
        }


        //ถ้ามีเงินทรัพย์สินความเสียหายให้เอามาบวกเพิ่ม
        if (this.sumothermoney > 0) {
            this.formData.CASE_MONEY_DAMAGE_VALUE = summoney + Number(this.sumothermoney);

        }

        if (this.formData.CASE_MONEY_DAMAGE_VALUE < 0) {
            this.formData.CASE_MONEY_DAMAGE_VALUE = 0;
        }


        // end calculate money
    }
    onEditlistbanklist(e,type="") {
        if(type === "crytro"){
            if (this.formbanknewCrytro.instance.validate().isValid) {
                this.formmoney.BANK_ORIGIN_ACCOUNT = this.formmoneySub.BANK_ORIGIN_ACCOUNT
                this.formmoney.BANK_ORIGIN_ACCOUNT_NAME = this.formmoneySub.BANK_ORIGIN_ACCOUNT_NAME
                this.formmoney.BANK_ORIGIN_ID = this.formmoneySub.BANK_ORIGIN_ID
                this.formmoney.BANK_ORIGIN_NAME = this.formmoneySub.BANK_ORIGIN_NAME
                this.formmoney.SHOW_NAME = this.formmoneySub.SHOW_NAME
                this.formmoney.TYPE_BANK_ID = this.formmoneySub.TYPE_BANK_ID
                this.formmoney.WAYS_ORIGIN = this.formmoneySub.WAYS_ORIGIN
                this.formmoney.BANK_ORIGIN_MONEY_REMARK = this.formmoneySub.BANK_ORIGIN_MONEY_REMARK;

                this.formmoney.CASE_MONEY_CHANNEL_TYPE = this.formmoneySub.CASE_MONEY_CHANNEL_TYPE
                this.formmoney.CASE_MONEY_BANK_TRANFER = this.formmoneySub.CASE_MONEY_BANK_TRANFER
                this.formmoney.CASE_MONEY_BANK_TRANFER_NAME = this.formmoneySub.CASE_MONEY_BANK_TRANFER_NAME

                this.formmoney.BANK_MONEY_OTHER_ID = this.formmoneySub.BANK_MONEY_OTHER_ID
                this.formmoney.BANK_MONEY_OTHER_NAME = this.formmoneySub.BANK_MONEY_OTHER_NAME

                this.formmoney.BANK_ACCOUNT = this.formmoneySub.BANK_ACCOUNT
                this.formmoney.BANK_ACCOUNT_NAME = this.formmoneySub.BANK_ACCOUNT_NAME
                this.formmoney.BANK_ID = this.formmoneySub.BANK_ID
                this.formmoney.BANK_NAME = this.formmoneySub.BANK_NAME
                this.formmoney.SHOW_NAME_END = this.formmoneySub.SHOW_NAME_END
                this.formmoney.WAYS_DESTINATION = this.formmoneySub.WAYS_DESTINATION
                this.formmoney.BANK_MONEY_REMARK = this.formmoneySub.BANK_MONEY_REMARK;

                this.formmoney.CASE_MONEY_CHANNEL_TYPE = "T";
                this.listDamageCrytro[this.editTransferData.index] = this.formmoney;
                this.calulatemoney([...this.listDamageCrytro, ...this.listDamageBank]);
                this.onresetbanklist()
            }
        }else{
            if (this.formbanknew.instance.validate().isValid) {

                this.formmoney.BANK_ORIGIN_ACCOUNT = this.formmoneySub.BANK_ORIGIN_ACCOUNT
                this.formmoney.BANK_ORIGIN_ACCOUNT_NAME = this.formmoneySub.BANK_ORIGIN_ACCOUNT_NAME
                this.formmoney.BANK_ORIGIN_ID = this.formmoneySub.BANK_ORIGIN_ID
                this.formmoney.BANK_ORIGIN_NAME = this.formmoneySub.BANK_ORIGIN_NAME
                this.formmoney.SHOW_NAME = this.formmoneySub.SHOW_NAME
                this.formmoney.TYPE_BANK_ID = this.formmoneySub.TYPE_BANK_ID
                this.formmoney.WAYS_ORIGIN = this.formmoneySub.WAYS_ORIGIN
                this.formmoney.BANK_ORIGIN_MONEY_REMARK = this.formmoneySub.BANK_ORIGIN_MONEY_REMARK;

                this.formmoney.CASE_MONEY_CHANNEL_TYPE = this.formmoneySub.CASE_MONEY_CHANNEL_TYPE
                this.formmoney.CASE_MONEY_BANK_TRANFER = this.formmoneySub.CASE_MONEY_BANK_TRANFER
                this.formmoney.CASE_MONEY_BANK_TRANFER_NAME = this.formmoneySub.CASE_MONEY_BANK_TRANFER_NAME

                this.formmoney.BANK_MONEY_OTHER_ID = this.formmoneySub.BANK_MONEY_OTHER_ID
                this.formmoney.BANK_MONEY_OTHER_NAME = this.formmoneySub.BANK_MONEY_OTHER_NAME

                this.formmoney.BANK_ACCOUNT = this.formmoneySub.BANK_ACCOUNT
                this.formmoney.BANK_ACCOUNT_NAME = this.formmoneySub.BANK_ACCOUNT_NAME
                this.formmoney.BANK_ID = this.formmoneySub.BANK_ID
                this.formmoney.BANK_NAME = this.formmoneySub.BANK_NAME
                this.formmoney.SHOW_NAME_END = this.formmoneySub.SHOW_NAME_END
                this.formmoney.WAYS_DESTINATION = this.formmoneySub.WAYS_DESTINATION
                this.formmoney.BANK_MONEY_REMARK = this.formmoneySub.BANK_MONEY_REMARK;

                this.formmoney.CASE_MONEY_CHANNEL_TYPE = "T";
                this.listDamageBank[this.editTransferData.index] = this.formmoney;
                this.calulatemoney([...this.listDamageCrytro, ...this.listDamageBank]);
                this.onresetbanklist()
            }
        }
    }
    onbankoriginlistchange(e,type="") {

        if (e.value) {
            if(type === "crypto"){
                const data = this.selectBankInfoOriginlistCrypto.instance.option("selectedItem");
                // console.log("orginlist", data);

                if (data) {
                    this.wayStart = data.ways;
                    this.formmoney.BANK_ORIGIN_ACCOUNT = data.BANK_ORIGIN_ACCOUNT;
                    this.formmoney.BANK_ORIGIN_ACCOUNT_NAME = data.BANK_ORIGIN_ACCOUNT_NAME;
                    this.formmoney.BANK_ORIGIN_ID = data.BANK_ORIGIN_ID;
                    this.formmoney.BANK_ORIGIN_NAME = data.BANK_ORIGIN_NAME;
                    this.formmoney.SHOW_NAME = data.SHOW_NAME;
                    this.formmoney.TYPE_BANK_ID = data.TYPE_BANK_ID;
                    this.formmoney.WAYS_ORIGIN = data.ways;
                    this.formmoney.BANK_ORIGIN_MONEY_REMARK = data.BANK_ORIGIN_MONEY_REMARK;

                    if (data.TYPE_BANK_ID == 1) {
                        this.formmoney.CASE_MONEY_CHANNEL_TYPE = data.TYPE_MAIN;
                        this.formmoney.CASE_MONEY_BANK_TRANFER = data.TYPE_ID;
                        this.formmoney.CASE_MONEY_BANK_TRANFER_NAME = data.TYPE_NAME;
                    } else {
                        this.formmoney.CASE_MONEY_CHANNEL_TYPE = data.TYPE_MAIN;
                        this.formmoney.BANK_MONEY_OTHER_ID = data.TYPE_ID;
                        this.formmoney.BANK_MONEY_OTHER_NAME = data.TYPE_NAME;

                    }

                    if (this.formmoney.TYPE_BANK_ID == 1 || this.formmoney.TYPE_BANK_ID == 2) {
                        this.formmoney.BANK_DAMAGE_VALUE_UNIT = "บาท";
                    } else {
                        this.formmoney.BANK_DAMAGE_VALUE_UNIT = "0";
                    }

                    if (this.formmoney.TYPE_BANK_ID == 4) {
                        this.show_value = true;
                    } else {
                        this.show_value = false;
                    }

                    const dataend = this.selectBankInfolistCrypto.instance.option("selectedItem");

                    if (dataend) {
                        this.formmoney.BANK_ACCOUNT = dataend.BANK_ACCOUNT;
                        this.formmoney.BANK_ACCOUNT_NAME = dataend.BANK_ACCOUNT_NAME;
                        this.formmoney.BANK_ID = dataend.BANK_ID;
                        this.formmoney.BANK_NAME = dataend.BANK_NAME;
                        this.formmoney.SHOW_NAME_END = dataend.SHOW_NAME;
                        this.formmoney.WAYS_DESTINATION = dataend.ways;
                        this.formmoney.BANK_MONEY_REMARK = dataend.BANK_MONEY_REMARK;
                    }
                    this.formmoneySub = this.formmoney;
                } else {

                }
            }else{
                const data = this.selectBankInfoOriginlist.instance.option("selectedItem");
                // console.log("orginlist", data);

                if (data) {
                    console.log("origin",data);
                    this.wayStart = data.ways;
                    this.formmoney.BANK_ORIGIN_ACCOUNT = data.BANK_ORIGIN_ACCOUNT;
                    this.formmoney.BANK_ORIGIN_ACCOUNT_NAME = data.BANK_ORIGIN_ACCOUNT_NAME;
                    this.formmoney.BANK_ORIGIN_ID = data.BANK_ORIGIN_ID;
                    this.formmoney.BANK_ORIGIN_NAME = data.BANK_ORIGIN_NAME;
                    this.formmoney.SHOW_NAME = data.SHOW_NAME;
                    this.formmoney.TYPE_BANK_ID = data.TYPE_BANK_ID;
                    this.formmoney.WAYS_ORIGIN = data.ways;
                    this.formmoney.BANK_ORIGIN_MONEY_REMARK = data.BANK_ORIGIN_MONEY_REMARK;

                    if (data.TYPE_BANK_ID == 1) {
                        this.formmoney.CASE_MONEY_CHANNEL_TYPE = data.TYPE_MAIN;
                        this.formmoney.CASE_MONEY_BANK_TRANFER = data.TYPE_ID;
                        this.formmoney.CASE_MONEY_BANK_TRANFER_NAME = data.TYPE_NAME;
                    } else {
                        this.formmoney.CASE_MONEY_CHANNEL_TYPE = data.TYPE_MAIN;
                        this.formmoney.BANK_MONEY_OTHER_ID = data.TYPE_ID;
                        this.formmoney.BANK_MONEY_OTHER_NAME = data.TYPE_NAME;

                    }

                    if (this.formmoney.TYPE_BANK_ID == 1 || this.formmoney.TYPE_BANK_ID == 2) {
                        this.formmoney.BANK_DAMAGE_VALUE_UNIT = "บาท";
                    } else {
                        this.formmoney.BANK_DAMAGE_VALUE_UNIT = "0";
                    }

                    if (this.formmoney.TYPE_BANK_ID == 4) {
                        this.show_value = true;
                    } else {
                        this.show_value = false;
                    }

                    const dataend = this.selectBankInfolist.instance.option("selectedItem");

                    if (dataend) {
                        this.formmoney.BANK_ACCOUNT = dataend.BANK_ACCOUNT;
                        this.formmoney.BANK_ACCOUNT_NAME = dataend.BANK_ACCOUNT_NAME;
                        this.formmoney.BANK_ID = dataend.BANK_ID;
                        this.formmoney.BANK_NAME = dataend.BANK_NAME;
                        this.formmoney.SHOW_NAME_END = dataend.SHOW_NAME;
                        this.formmoney.WAYS_DESTINATION = dataend.ways;
                        this.formmoney.BANK_MONEY_REMARK = dataend.BANK_MONEY_REMARK;
                    }
                    this.formmoneySub = this.formmoney;
                } else {

                }
            }


        }
    }
    onbanklistchange(e,type="") {

        if (e.value) {
            if(type === "crypto"){
                console.log("object");
                const data = this.selectBankInfolistCrypto.instance.option("selectedItem");
                // console.log("defaullist", data);
                if (data) {

                    this.wayEnd = data.ways;
                    this.formmoney.BANK_ACCOUNT = data.BANK_ACCOUNT;
                    this.formmoney.BANK_ACCOUNT_NAME = data.BANK_ACCOUNT_NAME;
                    this.formmoney.BANK_ID = data.BANK_ID;
                    this.formmoney.BANK_NAME = data.BANK_NAME;
                    this.formmoney.SHOW_NAME_END = data.SHOW_NAME;
                    this.formmoney.WAYS_DESTINATION = data.ways;
                    this.formmoney.BANK_MONEY_REMARK = data.BANK_MONEY_REMARK;

                    const dataorigin = this.selectBankInfoOriginlistCrypto.instance.option("selectedItem");

                    if (data) {
                        // console.log(data);

                        this.formmoney.BANK_ORIGIN_ACCOUNT = dataorigin.BANK_ORIGIN_ACCOUNT;
                        this.formmoney.BANK_ORIGIN_ACCOUNT_NAME = dataorigin.BANK_ORIGIN_ACCOUNT_NAME;
                        this.formmoney.BANK_ORIGIN_ID = dataorigin.BANK_ORIGIN_ID;
                        this.formmoney.BANK_ORIGIN_NAME = dataorigin.BANK_ORIGIN_NAME;
                        this.formmoney.SHOW_NAME = dataorigin.SHOW_NAME;
                        this.formmoney.TYPE_BANK_ID = dataorigin.TYPE_BANK_ID;
                        this.formmoney.WAYS_ORIGIN = dataorigin.ways;
                        this.formmoney.BANK_ORIGIN_MONEY_REMARK = dataorigin.BANK_ORIGIN_MONEY_REMARK;

                        if (dataorigin.TYPE_BANK_ID == 1) {
                            this.formmoney.CASE_MONEY_CHANNEL_TYPE = dataorigin.TYPE_MAIN;
                            this.formmoney.CASE_MONEY_BANK_TRANFER = dataorigin.TYPE_ID;
                            this.formmoney.CASE_MONEY_BANK_TRANFER_NAME = dataorigin.TYPE_NAME;
                        } else {
                            this.formmoney.CASE_MONEY_CHANNEL_TYPE = dataorigin.TYPE_MAIN;
                            this.formmoney.BANK_MONEY_OTHER_ID = dataorigin.TYPE_ID;
                            this.formmoney.BANK_MONEY_OTHER_NAME = dataorigin.TYPE_NAME;

                        }

                        if (this.formmoney.TYPE_BANK_ID == 1 || this.formmoney.TYPE_BANK_ID == 2) {
                            this.formmoney.BANK_DAMAGE_VALUE_UNIT = "บาท";
                        } else {
                            this.formmoney.BANK_DAMAGE_VALUE_UNIT = "";
                        }
                    }
                    this.formmoneySub = this.formmoney;

                    // console.log('formmoney', this.formmoney);
                } else {

                }
            }else{
                console.table(this.selectBankInfolist.instance.option("selectedItem"));
                const data = this.selectBankInfolist.instance.option("selectedItem");
                // console.log("defaullist", data);
                if (data) {
                    console.log(data);
                    this.wayEnd = data.ways;
                    this.formmoney.BANK_ACCOUNT = data.BANK_ACCOUNT;
                    this.formmoney.BANK_ACCOUNT_NAME = data.BANK_ACCOUNT_NAME;
                    this.formmoney.BANK_ID = data.BANK_ID;
                    this.formmoney.BANK_NAME = data.BANK_NAME;
                    this.formmoney.SHOW_NAME_END = data.SHOW_NAME;
                    this.formmoney.WAYS_DESTINATION = data.ways;
                    this.formmoney.BANK_MONEY_REMARK = data.BANK_MONEY_REMARK;
                    this.formmoney.TYPE_DESTINATION_BANK_ID = data.TYPE_BANK_ID;

                    const dataorigin = this.selectBankInfoOriginlist.instance.option("selectedItem");

                    if (dataorigin) {
                        // console.log(data);

                        this.formmoney.BANK_ORIGIN_ACCOUNT = dataorigin.BANK_ORIGIN_ACCOUNT;
                        this.formmoney.BANK_ORIGIN_ACCOUNT_NAME = dataorigin.BANK_ORIGIN_ACCOUNT_NAME;
                        this.formmoney.BANK_ORIGIN_ID = dataorigin.BANK_ORIGIN_ID;
                        this.formmoney.BANK_ORIGIN_NAME = dataorigin.BANK_ORIGIN_NAME;
                        this.formmoney.SHOW_NAME = dataorigin.SHOW_NAME;
                        this.formmoney.TYPE_BANK_ID = dataorigin.TYPE_BANK_ID;
                        this.formmoney.WAYS_ORIGIN = dataorigin.ways;
                        this.formmoney.BANK_ORIGIN_MONEY_REMARK = dataorigin.BANK_ORIGIN_MONEY_REMARK;

                        if (dataorigin.TYPE_BANK_ID == 1) {
                            this.formmoney.CASE_MONEY_CHANNEL_TYPE = dataorigin.TYPE_MAIN;
                            this.formmoney.CASE_MONEY_BANK_TRANFER = dataorigin.TYPE_ID;
                            this.formmoney.CASE_MONEY_BANK_TRANFER_NAME = dataorigin.TYPE_NAME;
                        } else {
                            this.formmoney.CASE_MONEY_CHANNEL_TYPE = dataorigin.TYPE_MAIN;
                            this.formmoney.BANK_MONEY_OTHER_ID = dataorigin.TYPE_ID;
                            this.formmoney.BANK_MONEY_OTHER_NAME = dataorigin.TYPE_NAME;

                        }

                        if (this.formmoney.TYPE_BANK_ID == 1 || this.formmoney.TYPE_BANK_ID == 2) {
                            this.formmoney.BANK_DAMAGE_VALUE_UNIT = "บาท";
                        } else {
                            this.formmoney.BANK_DAMAGE_VALUE_UNIT = "";
                        }
                    }
                    this.formmoneySub = this.formmoney;

                    // console.log('formmoney', this.formmoney);
                } else {

                }
            }
        }
    }
    // uploadfile money
    formmoneyOpenFileDialog(uploadTag) {
        uploadTag.value = "";
        uploadTag.click();
    }
    async formmoneyFilesDropped(e) {
        this.listUploadFileformmoney = [];
        const files = e;
        if (files.length > 0) {
            this.isLoading = true;
            const fileCheck =
                await this._issueFile.CheckFileUploadAllowListSizeDrop(
                    this.maxSizeBuffer,
                    files
                );

            if (fileCheck.status) {
                this.maxSizeBuffer = fileCheck.uploadSizeAll ?? 0;
                for (const item of fileCheck.filebase64Array) {
                    this.listUploadFileformmoney.push(item);
                }
            }
            this.isLoading = false;
        }
    }

    async formmoneyUploadFile(uploadTag,type="") {

        this.listUploadFileformmoney = [];
        const files: any = uploadTag.files;

        if (this.isAdding) {
            if (files.length > 0) {
                this.isLoading = true;
                const fileCheck =
                    await this._issueFile.CheckFileUploadAllowListSizeDialog(
                        this.maxSizeBuffer,
                        files
                    );

                if (fileCheck.status) {
                    this.maxSizeBuffer = fileCheck.uploadSizeAll ?? 0;
                    for (const item of fileCheck.filebase64Array) {
                        if(type === 'crytro'){
                            this.listUploadFileformCrypto.push(item);
                        }else{
                            this.listUploadFileformmoney.push(item);
                        }

                    }
                }
                this.isLoading = false;
            }
        } else {
            if (files.length > 0) {
                this.isLoading = true;
                const fileCheck =
                    await this._issueFile.CheckFileUploadAllowListSizeDialog(
                        this.maxSizeBuffer,
                        files
                    );

                if (fileCheck.status) {
                    this.maxSizeBuffer = fileCheck.uploadSizeAll ?? 0;
                    for (const item of fileCheck.filebase64Array) {
                        if(type === 'crytro'){
                            this.listUploadFileformCrypto.push(item);
                            this.formmoney.MONNEY_DOC = [];
                            this.formmoney.MONNEY_DOC.push(this.listUploadFileformCrypto[0]);
                        }else{
                            this.listUploadFileformmoney.push(item);
                            this.formmoney.MONNEY_DOC = [];
                            this.formmoney.MONNEY_DOC.push(this.listUploadFileformmoney[0]);
                        }

                        // console.log(this.formmoney.MONNEY_DOC);
                    }
                }

                // console.log('fileupload', this.listUploadFileformmoney);
                this.isLoading = false;
            }
        }

    }

    ItemDamageformmoneyPopupDelete(index = null,type="") {
        Swal.fire({
            title: "ยืนยันการลบข้อมูล?",
            text: " ",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#7d7d7d",
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ตกลง",
        }).then((result) => {
            if (result.isConfirmed) {
                if(type === 'crytro'){
                    const file = this.listUploadFileformCrypto[index];
                    this.maxSizeBuffer -= file.size ?? 0;
                    this.listUploadFileformCrypto.splice(index, 1);
                }else{
                    const file = this.listUploadFileformmoney[index];
                    this.maxSizeBuffer -= file.size ?? 0;
                    this.listUploadFileformmoney.splice(index, 1);
                }

            }
        });
    }
    OnSelectDate(e) {
        if (e.value) {
            const mydate = this.datePipe.transform(e.value, 'yyyy-MM-dd');
            const mytime = this.datePipe.transform(e.value, 'HH:mm:ss');
            this.formmoney.BANK_TRANSFER_TIME = mytime;
            this.formmoney.BANK_TRANSFER_DATE = mydate;
        }
    }
    convertDate(date, time) {
        const dateIN = String(date + " " + time);
        const [datePart, timePart] = dateIN.split(" ");
        const [year, month, day] = datePart.split("-");
        const [hours, minutes, seconds] = timePart.split(":");
        return [Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds)]
    }
    convertTimezone(time) {
        const timeZoneOffset = 7 * 60;
        const timeZoneOffsetMs = 7 * 60 * 60 * 1000;
        const dateWithTimeZone = new Date(time.getTime() + timeZoneOffsetMs);
        const formattedString = dateWithTimeZone.toISOString().replace("Z", `+${timeZoneOffset.toString().padStart(2, "0")}:00`);
        return formattedString;
    }

    areObjectsEqual(obj1, obj2) {
        // ดึงคีย์ทั้งหมดของ object แล้วเรียงลำดับ
        const keys1 = Object.keys(obj1).sort();
        const keys2 = Object.keys(obj2).sort();

        // ถ้าจำนวนคีย์ไม่เท่ากัน แสดงว่าไม่เหมือนกัน
        if (keys1.length !== keys2.length) return false;

        // เปรียบเทียบค่าแต่ละคีย์
        for (let key of keys1) {
            if(key != "MONNEY_DOC"){
                if (obj1[key] !== obj2[key])
                    {
                        return false;
                    }
            }
            // return false;
        }
        return true;
      }

    removeDuplicateObjects(arr) {
        // ตรวจสอบว่า array ว่างหรือไม่
        if (arr.length === 0) return arr;

        // ใช้ฟังก์ชัน areObjectsEqual เพื่อเปรียบเทียบ object โดยไม่สนใจลำดับของฟิลด์
        const uniqueArray = arr.filter((obj, index, self) =>
          index === self.findIndex((t) => this.areObjectsEqual(t, obj))
        );

        return uniqueArray;
    }
}
