import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
    DxFormComponent,
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
import * as $ from "jquery";
// import { NgxImageCompressService } from "ngx-image-compress";
import { async } from "rxjs/internal/scheduler/async";
import { AnyRecord } from "dns";
import { DatePipe } from '@angular/common';
import { OnlineCaseService } from "src/app/services/online-case.service";
import { FileService } from "src/app/services/file.service";
import { IssueOnlineDamageSubComponent } from "../issue-online-damage-sub/issue-online-damage-sub.component";
import { DxiItemComponent } from "devextreme-angular/ui/nested";

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
    @ViewChild("formbanknewpopup", { static: false }) formbanknewpopup: DxFormComponent;
    @ViewChild("formbanknewpopupvillain", { static: false }) formbanknewpopupvillain: DxFormComponent;
    @ViewChild("formCryptoDeatail", { static: false }) formCryptoDeatail: DxFormComponent;
    @ViewChild("formOriginCrypto", { static: false }) formOriginCrypto: DxFormComponent;
    @ViewChild("formDestinyCrypto", { static: false }) formDestinyCrypto: DxFormComponent;
    @ViewChild("view_form", { static: false })
    scrollViewForm: DxScrollViewComponent;
    @ViewChild("selectWayOther", { static: false })
    selectWayOther: DxSelectBoxComponent;
    @ViewChild("UploadFileDamageList") tagsUploadFileDamageList;
    @ViewChild('selectBanktype', { static: false })
    selectBanktype: DxSelectBoxComponent;
    @ViewChild('selectBanktypevalian', { static: false })
    selectBanktypevalian: DxSelectBoxComponent;
    @ViewChild('selecttruemoneytype', { static: false })
    selecttruemoneytype: DxSelectBoxComponent;
    @ViewChild('selecttruemoneytypevalian', { static: false })
    selecttruemoneytypevalian: DxSelectBoxComponent;
    @ViewChild('selectBankInfovillian', { static: false })
    selectBankInfovillian: DxSelectBoxComponent;

    @ViewChild("selectBankInfoOriginlist", { static: false }) selectBankInfoOriginlist: DxSelectBoxComponent;
    @ViewChild("selectdirection", { static: false }) selectdirection: DxSelectBoxComponent;

    @ViewChild("selectBankInfolist", { static: false }) selectBankInfolist: DxSelectBoxComponent;
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
    listDamageCrypto: any = [];
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
        onClick: (e) => this.onaddbanklist(e, "crypto")
    };
    _buttonaddblankvillainCrypto = {
        icon: "plus",
        type: "primary",
        disabled: false,
        onClick: (e) => this.onaddbanklistvilain(e, "crypto")
    };
    bankListstart: any = [
        // {
        //     BANK_ORIGIN_ACCOUNT: "1111111",
        //     BANK_ORIGIN_ACCOUNT_NAME: "aaaaaaaaaa",
        //     BANK_ORIGIN_ID: 5,
        //     BANK_ORIGIN_NAME: "ธนาคารออมสิน",
        //     SHOW_NAME: "ธนาคารออมสิน: 1111111(aaaaaaaaaa)"
        // }
    ];
    dsdirection: any = [{ id: 1, text: 'รับเงิน' }, { id: 2, text: 'โอนเงิน' }]
    bankListend: any = [
        // {
        //     BANK_ACCOUNT: "55555555555",
        //     BANK_ACCOUNT_NAME: "zzzzzzzzzzzzzz",
        //     BANK_ID: 3,
        //     BANK_NAME: "ธนาคารแห่งประเทศจีน (ไทย) จำกัด (มหาชน)",
        //     SHOW_NAME: "ธนาคารแห่งประเทศจีน (ไทย) จำกัด (มหาชน): 55555555555(zzzzzzzzzzzzzz)",
        // }
    ];
    bankCrytroListstart: any = [];
    bankCrytroListend: any = [];
    wayStart: number;
    wayEnd: number;
    formmoney: any = {};
    formCrypto: any = {}
    formmoneySub: any = {};
    listDamageBankmoey: any = [];
    fileMoney: any;
    fileType1: any = [];
    fileType2: any = [];

    type1: boolean = false;
    type2: boolean = false;
    type3: boolean = false;
    type4: boolean = false;

    isAdding = true;
    isCryptoAdding = true;
    editTransferData: any = {};
    selectItemCryptoIndex : number

    listUploadFileformmoney: any = [];
    listUploadFileformcrypto: any = [];
    now:any;
    nowCrypto:any;
    sumvillan: any = 0.0;
    sumpersonal: any = 0.0;
    sumothermoney: any = 0.0;

    // new version needed
    ways = [
        { id: 2, text: 'ผู้เสียหาย' },
        { id: 1, text: 'ผู้ร้าย' },
    ];
    bankdatatypeselect: any = [
        { type_bank_id: 1, type_main: 'T', type_id: 'T', type_name: 'ธนาคาร' },
        {
            type_bank_id: 2,
            type_main: 'T',
            type_id: 'P',
            type_name: 'พร้อมเพย์',
        },
        {
            type_bank_id: 7,
            type_main: 'P',
            type_id: 'P',
            type_name: 'Wallet',
        },
        {
            type_bank_id: 4,
            type_main: 'P',
            type_id: 'C',
            type_name: 'เงินดิจิทัล (Cryptocurrency)',
        },
        {
            type_bank_id: 8,
            type_main: 'P',
            type_id: 'P',
            type_name: 'QR Code',
        },
        { type_bank_id: 6, type_main: 'P', type_id: 'O', type_name: 'อื่นๆ' },
    ];

    bankdatatypeselectsub: any = [
        {
            type_bank_id: 3,
            type_main: 'P',
            type_id: 'P',
            type_name: 'True Money',
        },
        { type_bank_id: 5, type_main: 'P', type_id: 'P', type_name: 'Paypal' },
        { type_bank_id: 9, type_main: 'P', type_id: 'P', type_name: 'Max Card' }
    ];

    bankdatatypeselectCrypto: any = [
        {
            type_bank_id: 4,
            type_main: 'P',
            type_id: 'C',
            type_name: 'เงินดิจิทัล (Cryptocurrency)',
        }
    ];

    _prompayNumberPattern = /^([0-9]{10,13})/;

    FormDataOrigin: any = {};
    FormDataDestination: any = {};
    FormDataOriginCrypto: any = {};
    FormDataDestinationCrypto: any = {};
    formCryptoDetail: any = {}

    firstLoadEditOrigin: boolean = false;
    firstLoadEditDestination: boolean = false;

    formchecktype: any = {};
    formchecktypevalian: any = {};

    BankOriginNumberPattern = /^([0-9]{10,15})/;
    _BankNumberPattern = /^([0-9Xx]{10,15})/;

    constructor(
        private servBankInfo: BankInfoService,
        private _date: ConvertDateService,
        private _issueFile: IssueOnlineFileUploadService,
        private datePipe: DatePipe,
        private _OnlineCaseService: OnlineCaseService,
        private _fileService: FileService,

    ) { }

    ngOnInit(): void {
        this.maxDateValue.setHours(this.maxDateValue.getHours() + 1);
        this.isLoading = true;
        setTimeout(async () => {
            this.SetDefaultData();
        }, 1000);
    }
    ConvertDateFullMonth(date) {
        if (date) {
            const d = new Date(date);
            const month = d.getMonth();
            const ddate = ` ${d.getDate()} `;
            const textMonthNow = ` ${this.monthFulltTh[month]}`;
            const year = d.getFullYear() + 543;
            return [ddate, " ", textMonthNow, " ", year].join("");
        } else {
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
                localStorage.setItem("form-index", "4");
                this.formType = "add";
                this.formReadOnly = false;
                this.formAddData = true;
                if(localStorage.getItem("form-blessing")){
                    let formCheck = JSON.parse(localStorage.getItem("form-blessing"));
                    if (formCheck.MoneyWAY == 1) {
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
                        this.FormDataOrigin.WAYS = 2;
                        this.FormDataDestination.WAYS = 1;
                        this.checkboxDamage = {
                            case_type1: true,
                            case_type2: false,
                            case_type3: false,
                            case_type4: false,
                            case_type5: false,
                        };
                    }
                    else if (formCheck.MoneyWAY == 2) {
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
                    else if (formCheck.MoneyWAY == 3) {
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
                    else if (formCheck.MoneyWAY == 4) {
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
                        this.FormDataOriginCrypto.WAYS = 2;
                        this.FormDataDestinationCrypto.WAYS = 1;
                        this.checkboxDamage = {
                            case_type1: false,
                            case_type2: false,
                            case_type3: false,
                            case_type4: true,
                            case_type5: false,
                        };
                    } else {
                        this.mainConponent.NextIndex(this.mainConponent.indexTab = 0);
                    }
                }else{
                    this.mainConponent.NextIndex(this.mainConponent.indexTab = 0);
                }
                const sessionData = await this._OnlineCaseService.SessionDamage({}, User.Current.PersonalId, "get").toPromise();
                if (sessionData) {
                    this.formData = sessionData;
                    console.log(this.formData);
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
                const _case_id = Number(sessionStorage.getItem("case_id"))
                const _CASE_MONEY = await this._OnlineCaseService.Getcasemoney(_case_id).toPromise();
                var dataForm = await this._OnlineCaseService.getbycaseId(_case_id).toPromise();
                this.checkTypemoney = true;
                setTimeout(async () => {
                    if (dataForm) {
                        if (dataForm.REPUTATION !== undefined && dataForm.REPUTATION !== null) {
                            this.formData.CASE_MONEY_TYPE5 = 'Y';
                            this.checkboxDamage.case_type3 = true;
                            this.formData.REPUTATION = dataForm.REPUTATION;
                        }
                        // console.log(dataForm.REPUTATION);
                    }
                    if (this.CheckArray(_CASE_MONEY)) {
                        if (this.mainConponent.InstId) {
                            this.fileMoney = await this._fileService.getCaseMoneyFile(Number(this.mainConponent.InstId)).toPromise();
                            if (this.fileMoney) {
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
                    } else {
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
                if (item.BANK_MONEY_OTHER_NAME === "เงินดิจิทัล (Cryptocurrency)") {
                    this.formData.CASE_MONEY_TYPE4 = "Y"
                    this.checkboxDamage.case_type4 = true;
                    this.listDamageCrypto.push(item);

                } else {
                    this.formData.CASE_MONEY_TYPE1 = "Y"
                    this.checkboxDamage.case_type1 = true;
                    this.listDamageBank.push(item);
                }
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
                            this.FormDataOrigin.WAYS = 2;
                            this.FormDataDestination.WAYS = 1;
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
                            if (this.listDamageOther.length > 0) {
                                for (let i = 0; i < this.listDamageOther.length; i++) {
                                    this.formData.CASE_MONEY_DAMAGE_VALUE -= this.listDamageOther[i].BANK_DAMAGE_VALUE;
                                }
                            }
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
                this.setDefualtCryptoForm();
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
                            this.listDamageCrypto = [];
                            this.listUploadFileformcrypto = [];
                            this.calulatemoney([...this.listDamageCrypto, ...this.listDamageBank]);
                            this.setDefualtCryptoForm();
                        } else {
                            this.checkboxDamage.case_type4 = true;
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
        this.FormDataOrigin = {}
        this.FormDataDestination = {}

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
    }

    async OS_ItemDamageSubEdit(index = null, data = {} as any) {
        // console.log(data);
        this.now = null;
        this.firstLoadEditOrigin = true;
        this.firstLoadEditDestination = true;

        this.isAdding = false;
        this.editTransferData = { ...data, index };

        this.setDataEdit(data);
        this.formmoney.BANK_TRANSFER_DATE = data.BANK_TRANSFER_DATE;
        this.formmoney.BANK_TRANSFER_TIME = data.BANK_TRANSFER_TIME;
        this.formmoney.BANK_DAMAGE_VALUE = data.BANK_DAMAGE_VALUE;
        this.formmoney.DIRECTION = data.DIRECTION;
        this.formmoney.BANK_REMARK = data.BANK_REMARK;
        this.formmoney.BANK_DAMAGE_VALUE_UNIT = data.BANK_DAMAGE_VALUE_UNIT;
        this.formmoney.BANK_DAMAGE_VALUE_BAHT = data.BANK_DAMAGE_VALUE_BAHT ?? 0;
        this.formmoney.MONNEY_DOC = data.MONNEY_DOC;
        if(data.MONNEY_DOC){
            if (data.MONNEY_DOC.length > 0) {
                this.listUploadFileformmoney.push(data.MONNEY_DOC[0]);
            }
        }
        const date = this.convertDate(this.formmoney.BANK_TRANSFER_DATE, this.formmoney.BANK_TRANSFER_TIME);
        this.now = new Date(date[0], date[1], date[2], date[3], date[4], date[5]);
    }

    setDataEdit(data: any) {
        this.FormDataOrigin.WAYS = data.WAYS_ORIGIN;
        this.FormDataDestination.WAYS = data.WAYS_DESTINATION;
        if (data.TYPE_BANK_ID == 1) {
            this.FormDataOrigin.TYPE_BANK_ID = data.TYPE_BANK_ID;
            this.FormDataOrigin.BANK_ORIGIN_ACCOUNT = data.BANK_ORIGIN_ACCOUNT;
            this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_NAME = data.BANK_ORIGIN_ACCOUNT_NAME;
            this.FormDataOrigin.BANK_ORIGIN_ID = data.BANK_ORIGIN_ID;
            this.FormDataOrigin.BANK_ORIGIN_NAME = data.BANK_ORIGIN_NAME;
            this.FormDataOrigin.SHOW_NAME = data.SHOW_NAME;
            this.FormDataOrigin.BANK_ORIGIN_MONEY_REMARK = data.BANK_ORIGIN_MONEY_REMARK;
        } else if (data.TYPE_BANK_ID == 2) {
            this.FormDataOrigin.TYPE_BANK_ID = data.TYPE_BANK_ID;
            this.FormDataOrigin.BANK_ORIGIN_ACCOUNT = data.BANK_ORIGIN_ACCOUNT;
            this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_NAME_PROMPAY = data.BANK_ORIGIN_ACCOUNT_NAME;
            this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_PROMPAY = data.BANK_ORIGIN_ACCOUNT;
            this.FormDataOrigin.SHOW_NAME = data.SHOW_NAME;
            this.FormDataOrigin.WAYS = data.WAYS_ORIGIN;
        } else {
            this.FormDataOrigin.TYPE_BANK_SUB_NAME = data.TYPE_BANK_ID == 3 ? "True Money" : data.TYPE_BANK_ID == 5 ? "Paypal" : data.TYPE_BANK_ID == 9 ? "Max Card" : null;
            this.FormDataOrigin.TYPE_BANK_ID = data.TYPE_BANK_ID == 5 || data.TYPE_BANK_ID == 3 || data.TYPE_BANK_ID == 9 ? 7 : data.TYPE_BANK_ID;
            this.FormDataOrigin.BANK_MONEY_OTHER_ACCOUNT = data.BANK_ORIGIN_ACCOUNT;
            this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_NAME = data.BANK_ORIGIN_ACCOUNT_NAME;
            this.FormDataOrigin.SHOW_NAME = data.SHOW_NAME;
            this.FormDataOrigin.TRUEMONEY_TYPE = data.TRUEMONEY_OG_TYPE;
            this.FormDataOrigin.TYPE_BANK_SUB_ID = data.TYPE_BANK_ID == 5 || data.TYPE_BANK_ID == 3 || data.TYPE_BANK_ID == 9 ? data.TYPE_BANK_ID : null;
            
        }

        if (data.TYPE_DESTINATION_BANK_ID == 1) {
            this.FormDataDestination.TYPE_BANK_ID = data.TYPE_DESTINATION_BANK_ID;
            this.FormDataDestination.BANK_ID = data.BANK_ID;
            this.FormDataDestination.BANK_ACCOUNT = data.BANK_ACCOUNT;
            this.FormDataDestination.BANK_ACCOUNT_NAME = data.BANK_ACCOUNT_NAME;
            this.FormDataDestination.BANK_NAME = data.BANK_NAME;
            this.FormDataDestination.SHOW_NAME = data.SHOW_NAME_END;
            this.FormDataDestination.WAYS = data.WAYS_DESTINATION;
            this.FormDataDestination.BANK_MONEY_REMARK = data.BANK_MONEY_REMARK;
        } else if (data.TYPE_DESTINATION_BANK_ID == 2) {
            this.FormDataDestination.TYPE_BANK_ID = data.TYPE_DESTINATION_BANK_ID;
            this.FormDataDestination.BANK_ID = data.TYPE_BANK_ID;
            this.FormDataDestination.BANK_ORIGIN_ACCOUNT = data.BANK_ACCOUNT;
            this.FormDataDestination.BANK_ORIGIN_ACCOUNT_NAME_PROMPAY = data.BANK_ACCOUNT_NAME;
            this.FormDataDestination.BANK_ORIGIN_ACCOUNT_PROMPAY = data.BANK_ACCOUNT;
            this.FormDataDestination.SHOW_NAME = data.SHOW_NAME_END;
            this.FormDataDestination.WAYS = data.WAYS_DESTINATION;
        } else {
            this.FormDataDestination.TYPE_BANK_SUB_NAME = data.TYPE_DESTINATION_BANK_ID == 3 ? "True Money" : data.TYPE_DESTINATION_BANK_ID == 5 ? "Paypal" : data.TYPE_DESTINATION_BANK_ID == 9 ? "Max Card" : null;
            this.FormDataDestination.TYPE_BANK_ID = data.TYPE_DESTINATION_BANK_ID == 5 || data.TYPE_DESTINATION_BANK_ID == 3 || data.TYPE_DESTINATION_BANK_ID == 9 ? 7 : data.TYPE_DESTINATION_BANK_ID;
            this.FormDataDestination.BANK_MONEY_OTHER_ACCOUNT = data.BANK_ACCOUNT;
            this.FormDataDestination.SHOW_NAME = data.SHOW_NAME_END;
            this.FormDataDestination.TRUEMONEY_TYPE = data.TRUEMONEY_DES_TYPE;
            this.FormDataDestination.BANK_MONEY_OTHER_ACCOUNT = data.BANK_ACCOUNT;
            this.FormDataDestination.BANK_ACCOUNT_NAME = data.BANK_ACCOUNT_NAME;
            this.FormDataDestination.TYPE_BANK_SUB_ID = data.TYPE_DESTINATION_BANK_ID == 5 || data.TYPE_DESTINATION_BANK_ID == 3 || data.TYPE_DESTINATION_BANK_ID == 9 ? data.TYPE_DESTINATION_BANK_ID : null;
        }

        console.log(this.FormDataOrigin);
        console.log(this.FormDataDestination);

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
        if (data) {
            const countArray = data.length ?? 0;
            if (countArray > 0) {
                return true;
            }
        }
        return false;
    }
    CheckSammaryValue(num) : number{
        if (num) {
            return parseFloat(num).toFixed(2) as unknown as number;
        }
        return 0;
    }
    SumAllDamageValue(num, type = "sum") {
        this.calulatemoney([...this.listDamageCrypto, ...this.listDamageBank]);
    }
    SumSubDamageValue(num, type = "sum") {
        this.calulatemoney([...this.listDamageCrypto, ...this.listDamageBank]);
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
    OnSelectBankAccount(e,tag:DxSelectBoxComponent) {
        if (e.value) {
            const data = tag.instance.option("selectedItem");
            if (data) {
                this.FormDataDestination.BANK_ID = data.BANK_ID;
                this.FormDataDestination.BANK_NAME = data.BANK_NAME;
            } else {
                this.FormDataDestination.BANK_ID = e.value;
            }
        }
    }
    OnSelectSubBankTypevalian(e,tag:DxSelectBoxComponent) {
        console.log("ประเภท Wallet ปลายทาง",e);
        if (e.value) {
            const data = tag.instance.option('selectedItem');
            if (data) {
                this.FormDataDestination.TYPE_BANK_SUB_NAME = data.type_name;
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
                // const dmValueAll = this.formData.CASE_MONEY[index].BANK_DAMAGE_VALUE ?? 0;
                // this.formData.CASE_MONEY.splice(index, 1);
                // this.formData.CASE_MONEY[index].BANK_DETAIL = e;
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
    ItemDamageSubDelete(index, subIndex, type, typeSub = "") {
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
                    if (typeSub === 'crytro') {
                        const dmValueItem = this.listDamageCrypto[index].BANK_DAMAGE_VALUE ?? 0;
                        const numfloat = parseFloat(dmValueItem);
                        if (dmValueItem > 0) {
                            const SumAll = parseFloat(this.listDamageCrypto[index].BANK_DAMAGE_VALUE);
                            const samary: any = SumAll - numfloat;
                            this.listDamageCrypto[index].BANK_DAMAGE_VALUE = parseFloat(samary).toFixed(2);
                        }
                        if (this.listDamageCrypto[index].BANK_DOC) {
                            this.limitSizeBank -= this.listDamageCrypto[index].BANK_DOC.size ?? 0;
                        }
                        this.listDamageCrypto.splice(index, 1);
                    } else {
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

                this.calulatemoney([...this.listDamageCrypto, ...this.listDamageBank]);
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
            this.calulatemoney([...this.listDamageCrypto, ...this.listDamageBank]);
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
            this.calulatemoney([...this.listDamageCrypto, ...this.listDamageBank]);
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
            !this.CheckArray(this.listDamageCrypto)
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
        // console.log(this.mainConponent.formType);
        // console.log(this.formData.CASE_MONEY_DAMAGE_VALUE);
        if (this.mainConponent.formType === "add") {
            const dmValue = this.formData.CASE_MONEY_DAMAGE_VALUE ?? 0;
            if (this.defaultDamageType === 1 && this.CheckInvalidListDamage()) {
                return;
            } else if (this.defaultDamageType === 1 && dmValue <= 0) {
                if (this.formData.CASE_MONEY_TYPE1 === 'Y' || this.formData.CASE_MONEY_TYPE2 === 'Y') {
                    this.ShowInvalidDialog("กรุณาเพิ่มรายละเอียดความเสียหาย");
                    this.mainConponent.checkValidate = true;
                    return;
                } else if (this.formData.CASE_MONEY_TYPE5 === 'Y') {
                    if (this.formData.REPUTATION == '' || this.formData.REPUTATION == null) {
                        this.ShowInvalidDialog("กรุณาเพิ่มรายละเอียดชื่อเสียงที่เสียหาย");
                        this.mainConponent.checkValidate = true;
                        return;
                    }
                } else if (this.formData.CASE_MONEY_TYPE4 === 'Y') {
                    this.ShowInvalidDialog("กรุณาเพิ่มรายละเอียดความเสียหาย");
                    this.mainConponent.checkValidate = true;
                    return;
                }
            }
            this.mainConponent.checkValidate = false;
            this.mainConponent.formDataAll.DataDamageShow = {};
            const listMoney = this.MergeArray(
                [...this.listDamageCrypto, ...this.listDamageBank],
                this.listDamageBankOther,
                this.listDamageOther
            );
            this.mainConponent.formDataAll.formDamage = {};
            this.mainConponent.formDataAll.formDamage = this.formData;
            this.mainConponent.formDataAll.formDamage.CASE_MONEY = listMoney;
            this.mainConponent.formDataAll.formDamage.listDamageBank = this.listDamageBank;
            this.mainConponent.formDataAll.formDamage.listDamageBankOther = this.listDamageBankOther;
            this.mainConponent.formDataAll.formDamage.listDamageOther = this.listDamageOther;
            this.mainConponent.formDataAll.formDamage.listDamageCrypto = this.listDamageCrypto;
            // localStorage.setItem("form-damage", JSON.stringify(this.formData));
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
        } else if (this.FormDataOrigin.TYPE_NAME === "Wallet" || this.FormDataDestination.TYPE_NAME === "Wallet") {
            return this.WalletValidator(event);
        } else if (this.FormDataOrigin.TYPE_NAME === "QR Code" || this.FormDataDestination.TYPE_NAME === "QR Code") {
            return this.QRCodeValidator(event);
        } else {
            return true;
        }
    }

    WalletValidator(event) {
        let value = event.target.value + event.key;
        const makeScope = new RegExp("^[0-9]+$", "g");
        return makeScope.test(value);
    }

    QRCodeValidator(event) {
        let value = event.target.value + event.key;
        const makeScope = new RegExp("^[0-9A-Za-z]+$", "g");
        return makeScope.test(value);
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
        const makeScope = new RegExp("^[A-Za-z0-9]$", "g");
        return makeScope.test(event.key);
    }
    PasteCyrpto(event) {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData.getData('text');
        // const seperator  = '^[ก-๏\\s]+$';
        const seperator = '^[A-Za-z0-9]$';
        const maskSeperator =  new RegExp(seperator , 'g');
        const result =maskSeperator.test(pastedText);
        return result;
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
    OnSelectBankAccountOrigin(e,tag:DxSelectBoxComponent) {
        if (e.value) {
            const data = tag.instance.option("selectedItem");
            if (data) {
                this.FormDataOrigin.BANK_ORIGIN_ID = data.BANK_ID;
                this.FormDataOrigin.BANK_ORIGIN_NAME = data.BANK_NAME;
            } else {
                this.FormDataOrigin.BANK_ORIGIN_ID = e.value;
            }
        }
    }

    checkDuplicateString(event,type,input) {
        const seperator = "^(.)\\1*$";
        const maskSeperator = new RegExp(seperator, "gm");
        const result = maskSeperator.test(event.value);
        if(result){
            Swal.fire({
                title: "ผิดพลาด!",
                html: `คุณกรอกเลขบัญชีไม่ถูกต้อง`,
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => {
                if(type == "origin"){
                    if(this.FormDataOrigin[input] != ""){
                        this.FormDataOrigin[input] ="" ;
                    }
                }else if(type == "destination"){
                    if(this.FormDataDestination[input] != ""){
                        this.FormDataDestination[input] = "";
                    }
                }
            });
        }
    }

    onaddbanklist(e, type = "bank") {
        this.popupbanklist = e;
        this.damagesubConponent.SetDefaultData(type);
    }

    onaddbanklistvilain(e, type = "bank") {
        this.popupbanklistvillain = e;
        this.damagesubConponent.SetDefaultData(type);
    }

    bindDataBank() {
        this.FormDataOrigin.TYPE_NAME =  this.FormDataOrigin.TYPE_BANK_ID === 7 ? this.FormDataOrigin.TYPE_BANK_SUB_NAME : this.FormDataOrigin.TYPE_NAME;
        this.FormDataDestination.TYPE_NAME =  this.FormDataDestination.TYPE_BANK_ID === 7 ? this.FormDataDestination.TYPE_BANK_SUB_NAME : this.FormDataDestination.TYPE_NAME;

        this.outputdatabank(this.FormDataOrigin);
        this.outputdatabankvillain(this.FormDataDestination);
        
        this.formmoney.TYPE_BANK_ID = this.FormDataOrigin.TYPE_BANK_ID === 7 ?  this.FormDataOrigin.TYPE_BANK_SUB_ID :  this.FormDataOrigin.TYPE_BANK_ID;
        this.formmoney.BANK_ORIGIN_ACCOUNT = this.FormDataOrigin.BANK_ACCOUNT ? this.FormDataOrigin.BANK_ACCOUNT : this.FormDataOrigin.BANK_ORIGIN_ACCOUNT ? this.FormDataOrigin.BANK_ORIGIN_ACCOUNT : this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_PROMPAY ? this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_PROMPAY : this.FormDataOrigin.BANK_MONEY_OTHER_ACCOUNT;
        this.formmoney.BANK_ORIGIN_ACCOUNT_NAME = this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_NAME ? this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_NAME : this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_NAME_PROMPAY ? this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_NAME_PROMPAY : null
        this.formmoney.BANK_ORIGIN_ID = this.FormDataOrigin.BANK_ORIGIN_ID;
        this.formmoney.BANK_ORIGIN_NAME = this.FormDataOrigin.BANK_ORIGIN_NAME;
        this.formmoney.SHOW_NAME = this.FormDataOrigin.SHOW_NAME
        this.formmoney.WAYS_ORIGIN = this.FormDataOrigin.WAYS
        this.formmoney.BANK_ORIGIN_MONEY_REMARK = this.FormDataOrigin.BANK_ORIGIN_MONEY_REMARK;
        this.formmoney.TRUEMONEY_OG_TYPE = this.FormDataOrigin.TRUEMONEY_TYPE ?? null;
  
        this.formmoney.TYPE_DESTINATION_BANK_ID = this.FormDataDestination.TYPE_BANK_ID  === 7 ?  this.FormDataDestination.TYPE_BANK_SUB_ID :  this.FormDataDestination.TYPE_BANK_ID;
        this.formmoney.BANK_ACCOUNT = this.FormDataDestination.BANK_ACCOUNT ? this.FormDataDestination.BANK_ACCOUNT : this.FormDataDestination.BANK_ORIGIN_ACCOUNT ? this.FormDataDestination.BANK_ORIGIN_ACCOUNT : this.FormDataDestination.BANK_ORIGIN_ACCOUNT_PROMPAY ? this.FormDataDestination.BANK_ORIGIN_ACCOUNT_PROMPAY : this.FormDataDestination.BANK_MONEY_OTHER_ACCOUNT
        this.formmoney.BANK_ACCOUNT_NAME = this.FormDataDestination.BANK_ACCOUNT_NAME ? this.FormDataDestination.BANK_ACCOUNT_NAME : this.FormDataDestination.BANK_ORIGIN_ACCOUNT_NAME_PROMPAY ? this.FormDataDestination.BANK_ORIGIN_ACCOUNT_NAME_PROMPAY : null
        this.formmoney.BANK_ID = this.FormDataDestination.BANK_ID;
        this.formmoney.BANK_NAME = this.FormDataDestination.BANK_NAME;
        this.formmoney.SHOW_NAME_END = this.FormDataDestination.SHOW_NAME;
        this.formmoney.WAYS_DESTINATION = this.FormDataDestination.WAYS;
        this.formmoney.BANK_MONEY_REMARK = this.FormDataDestination.BANK_MONEY_REMARK;
        this.formmoney.TRUEMONEY_DES_TYPE = this.FormDataDestination.TRUEMONEY_TYPE ?? null;

        this.formmoney.CASE_MONEY_CHANNEL_TYPE = this.FormDataOrigin.TYPE_MAIN;
        this.formmoney.CASE_MONEY_BANK_TRANFER = this.FormDataOrigin.TYPE_ID;
        this.formmoney.CASE_MONEY_BANK_TRANFER_NAME = this.FormDataOrigin.TYPE_NAME;

        if(this.FormDataOrigin.TYPE_ID !== 'T'){
            this.formmoney.BANK_MONEY_OTHER_ID = this.FormDataOrigin.TYPE_ID;
            this.formmoney.BANK_MONEY_OTHER_NAME = this.FormDataOrigin.TYPE_NAME;
        }

        this.formmoney.MONNEY_DOC = [];
        if (this.listUploadFileformmoney.length > 0) {
            this.formmoney.MONNEY_DOC.push(this.listUploadFileformmoney[0]);
        }
    }

    outputdatabank(value) {
        console.log('submit sufferer', value);
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
        const prefix = typeNameMapping[value.TYPE_NAME]?.[value.WAYS] || '';
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


        this.FormDataOrigin.SHOW_NAME = value["SHOW_NAME"];
        this.FormDataOrigin.BANK_ORIGIN_ACCOUNT = value["BANK_ORIGIN_ACCOUNT"];
    }
    outputdatabankvillain(value) {
        console.log('submit origin', value);
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
        const prefix = typeNameMapping[value.TYPE_NAME]?.[value.WAYS] || '';
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
        this.FormDataDestination.SHOW_NAME = value["SHOW_NAME"];
        this.FormDataDestination.BANK_ACCOUNT = value["BANK_ACCOUNT"];

        this.bankListend.push(this.FormDataDestination);
    }

    onsavelistbanklist(e) {
        if (this.FormDataDestination.WAYS == this.FormDataOrigin.WAYS) {
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
        if (!this.formbanknewpopup.instance.validate().isValid) {
            Swal.fire({
                title: "ผิดพลาด!",
                html: "กรุณากรอกข้อมูลบัญชีต้นทางให้ครบ",
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => { });
            return
        }
        if (!this.formbanknewpopupvillain.instance.validate().isValid) {
            Swal.fire({
                title: "ผิดพลาด!",
                html: "กรุณากรอกข้อมูลบัญชีปลายทางให้ครบ",
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => { });
            return
        }
        if (!this.formbanknew.instance.validate().isValid) {
            Swal.fire({
                title: "ผิดพลาด!",
                html: "กรุณากรอกข้อมูลความเสียหายให้ครบ",
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => { });
            return
        }
        if (this.checkEntryOrNull(this.formmoney.BANK_TRANSFER_DATE) || this.checkEntryOrNull(this.formmoney.BANK_TRANSFER_TIME)) {
            this.now = null;
            Swal.fire({
                title: "ผิดพลาด!",
                html: "กรุณากรอกเลือกวันที่เกิดความเสียหายให้ถูกต้อง",
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => { });
            return
        }

        this.bindDataBank();

        this.listDamageBank.push(this.formmoney);
        this.calulatemoney([...this.listDamageCrypto, ...this.listDamageBank]);
        this.onresetbanklist();
    }

    reduceObjectValues(obj) {
        const uniqueShowNames = new Set<string>();
        const result = obj.filter((item) => {
            const showName = item.SHOW_NAME;
            if (!uniqueShowNames.has(showName)) {
                uniqueShowNames.add(showName);
                return true;
            }
            return false;
        });
        return result;
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
    onEditlistbanklist(e) {
        if (this.FormDataDestination.WAYS == this.FormDataOrigin.WAYS) {
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
        if (!this.formbanknewpopup.instance.validate().isValid) {
            Swal.fire({
                title: "ผิดพลาด!",
                html: "กรุณากรอกข้อมูลบัญชีต้นทางให้ครบ",
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => { });
            return
        }
        if (!this.formbanknewpopupvillain.instance.validate().isValid) {
            Swal.fire({
                title: "ผิดพลาด!",
                html: "กรุณากรอกข้อมูลบัญชีปลายทางให้ครบ",
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => { });
            return
        }
        if (!this.formbanknew.instance.validate().isValid) {
            Swal.fire({
                title: "ผิดพลาด!",
                html: "กรุณากรอกข้อมูลความเสียหายให้ครบ",
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => { });
            return
        }
        if (this.checkEntryOrNull(this.formmoney.BANK_TRANSFER_DATE) || this.checkEntryOrNull(this.formmoney.BANK_TRANSFER_TIME)) {
            this.now = null;
            Swal.fire({
                title: "ผิดพลาด!",
                html: "กรุณากรอกเลือกวันที่เกิดความเสียหายให้ถูกต้อง",
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => { });
            return
        }

        this.bindDataBank();

        this.listDamageBank[this.editTransferData.index] = this.formmoney;
        this.calulatemoney([...this.listDamageCrypto, ...this.listDamageBank]);

        this.onresetbanklist()
    }
    onbankoriginlistchange(e) {

        if (e.value) {
            const data = this.selectBankInfoOriginlist.instance.option("selectedItem");
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
                    this.formmoney.BANK_DAMAGE_VALUE_UNIT = "";
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

                // console.log('formmoney', this.formmoney);

            } else {

            }

        }
    }
    onbanklistchange(e) {

        if (e.value) {
            const data = this.selectBankInfolist.instance.option("selectedItem");
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

                const dataorigin = this.selectBankInfoOriginlist.instance.option("selectedItem");

                if (data) {


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
            } else {

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

    async formmoneyUploadFile(uploadTag, type = "") {

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
                        if (type === 'crytro') {
                            this.listUploadFileformcrypto.push(item);
                        } else {
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
                        if (type === 'crytro') {
                            this.listUploadFileformcrypto.push(item);
                            this.formmoney.MONNEY_DOC = [];
                            this.formmoney.MONNEY_DOC.push(this.listUploadFileformcrypto[0]);
                        } else {
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

    ItemDamageformmoneyPopupDelete(index = null, type = "") {
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
                if (type === 'crytro') {
                    const file = this.listUploadFileformcrypto[index];
                    this.maxSizeBuffer -= file.size ?? 0;
                    this.listUploadFileformcrypto.splice(index, 1);
                } else {
                    const file = this.listUploadFileformmoney[index];
                    this.maxSizeBuffer -= file.size ?? 0;
                    this.listUploadFileformmoney.splice(index, 1);
                }

            }
        });
    }
    OnSelectDate(e, type) {
        if (type == "money") {
            if (e.value) {
                const mydate = this.datePipe.transform(e.value, 'yyyy-MM-dd');
                const mytime = this.datePipe.transform(e.value, 'HH:mm:ss');
                this.formmoney.BANK_TRANSFER_TIME = mytime;
                this.formmoney.BANK_TRANSFER_DATE = mydate;
            }
        } else if (type == "crypto") {
            if (e.value) {
                const mydate = this.datePipe.transform(e.value, 'yyyy-MM-dd');
                const mytime = this.datePipe.transform(e.value, 'HH:mm:ss');
                this.formCrypto.BANK_TRANSFER_TIME = mytime;
                this.formCrypto.BANK_TRANSFER_DATE = mydate;
            }
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

    OnSelectBankType(e,tag:DxSelectBoxComponent) {
        if (e.value) {
            const data = tag.instance.option('selectedItem');
            if (data) {
                this.FormDataOrigin = {
                    ...this.FormDataOrigin, // เก็บค่าฟิลด์เดิม
                    TYPE_MAIN: data.type_main,
                    TYPE_ID: data.type_id,
                    TYPE_NAME: data.type_name,
                    TYPE_BANK_SUB_ID: this.firstLoadEditOrigin ? this.FormDataOrigin.TYPE_BANK_SUB_ID : null,
                    TRUEMONEY_TYPE: this.firstLoadEditOrigin ? this.FormDataOrigin.TRUEMONEY_TYPE : null,
                    BANK_ORIGIN_ACCOUNT_NAME: this.firstLoadEditOrigin ? this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_NAME : null,
                    BANK_MONEY_OTHER_ACCOUNT: this.firstLoadEditOrigin ? this.FormDataOrigin.BANK_MONEY_OTHER_ACCOUNT : null,
                    BANK_ORIGIN_ACCOUNT_NAME_PROMPAY: this.firstLoadEditOrigin ? this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_NAME_PROMPAY : null,
                    BANK_ORIGIN_ACCOUNT_PROMPAY: this.firstLoadEditOrigin ? this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_PROMPAY : null,
                };
                this.formmoney.BANK_DAMAGE_VALUE_UNIT = this.FormDataOrigin.TYPE_BANK_ID == 1 || this.FormDataOrigin.TYPE_BANK_ID == 2 ?  "บาท" : this.formmoney.BANK_DAMAGE_VALUE_UNIT;
                this.show_value =
                  [4].includes(this.FormDataDestination?.TYPE_BANK_ID) ||
                  [4].includes(this.FormDataOrigin?.TYPE_BANK_ID);
                this.firstLoadEditOrigin = false;
            }
        }
    }

    OnSelectBankTypevalian(e,tag:DxSelectBoxComponent) {
        if (e.value) {
            const data = tag.instance.option('selectedItem');
            if (data) {
                this.FormDataDestination = {
                    ...this.FormDataDestination, // เก็บค่าฟิลด์เดิม
                    TYPE_MAIN: data.type_main,
                    TYPE_ID: data.type_id,
                    TYPE_NAME: data.type_name,
                    TYPE_BANK_SUB_ID: this.firstLoadEditDestination ? this.FormDataDestination.TYPE_BANK_SUB_ID : null,
                    TRUEMONEY_TYPE: this.firstLoadEditDestination ? this.FormDataDestination.TRUEMONEY_TYPE : null,
                    BANK_ORIGIN_ACCOUNT_NAME: this.firstLoadEditDestination ? this.FormDataDestination.BANK_ORIGIN_ACCOUNT_NAME : null,
                    BANK_MONEY_OTHER_ACCOUNT: this.firstLoadEditDestination ? this.FormDataDestination.BANK_MONEY_OTHER_ACCOUNT : null,
                    BANK_ORIGIN_ACCOUNT_NAME_PROMPAY: this.firstLoadEditDestination ? this.FormDataDestination.BANK_ORIGIN_ACCOUNT_NAME_PROMPAY : null,
                    BANK_ORIGIN_ACCOUNT_PROMPAY: this.firstLoadEditDestination ? this.FormDataDestination.BANK_ORIGIN_ACCOUNT_PROMPAY : null,
                    BANK_ACCOUNT_NAME: this.firstLoadEditDestination ? this.FormDataDestination.BANK_ACCOUNT_NAME : null,
                };
                console.log(this.FormDataDestination);
                this.show_value =
                  [4].includes(this.FormDataDestination?.TYPE_BANK_ID) ||
                  [4].includes(this.FormDataOrigin?.TYPE_BANK_ID);
                this.firstLoadEditDestination = false;
            }
        }
    }

    onCheckWays(e: any, from: string) {
        const getValue = e.value
        const diffValue = this.ways.find((item) => item.id != getValue).id
        if (from == 'Crypfirst') {
            if (this.FormDataOriginCrypto.WAYS == getValue) {
                this.FormDataDestinationCrypto.WAYS = diffValue
            }
        } else if (from === 'Cryptseccond') {
            if (this.FormDataDestinationCrypto.WAYS == getValue) {
                this.FormDataOriginCrypto.WAYS = diffValue
            }
        }
        if (from == 'Bankfirst') {
            if (this.FormDataOrigin.WAYS == getValue) {
                this.FormDataDestination.WAYS = diffValue
            }
        } else if (from ==='Bankseccond') {
            if (this.FormDataDestination.WAYS == getValue) {
                this.FormDataOrigin.WAYS = diffValue
            }
        }
    }


    checkEntryOrNull(input){
        if(input == null || input == undefined){
            return true;
        }
        return false;
    }

    OnSelecttruemoneyType(e,tag:DxSelectBoxComponent) {
        if (e.value) {
            const data = tag.instance.option('selectedItem');
            if (data) {
                this.FormDataOrigin.TRUEMONEY_TYPE = data.ID;
                this.FormDataOrigin.TRUEMONEY_TYPE_NAME = data.TEXT;
            } else {
            }
        }
    }
    OnSelecttruemoneyTypevalian(e,tag:DxSelectBoxComponent) {
        if (e.value) {
            const data = tag.instance.option('selectedItem');
            if (data) {
                this.FormDataDestination.TRUEMONEY_TYPE = data.ID;
                this.FormDataDestination.TRUEMONEY_TYPE_NAME = data.TEXT;
            } else {
            }
        }
    }

    async formcryptoFilesDropped(e) {
        this.listUploadFileformcrypto = [];
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
                    this.listUploadFileformcrypto.push(item);
                }
            }
            this.isLoading = false;
        }
    }

    async formcryptoUploadFile(uploadTag) {

        this.listUploadFileformcrypto = [];
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
                        this.listUploadFileformcrypto.push(item);
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
                        this.listUploadFileformcrypto.push(item);
                        this.formCrypto.MONNEY_DOC = [];
                        this.formCrypto.MONNEY_DOC.push(this.listUploadFileformcrypto[0]);
                    }
                }
                this.isLoading = false;
            }
        }

    }

    onResetCryptoForm() {
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
                this.setDefualtCryptoForm()
                this.isCryptoAdding = true;
            }
        })
    }

    setDefualtCryptoForm() {
        console.log(this.FormDataOriginCrypto.WAYS);
        const ogway = this.FormDataOriginCrypto.WAYS ?? 2 ;
        const ogtype = this.FormDataOriginCrypto.BANK_TYPE;
        const destiway = this.FormDataDestinationCrypto.WAYS ?? 1;
        const destitype = this.FormDataDestinationCrypto.BANK_TYPE;
        this.FormDataOriginCrypto = {}
        this.FormDataDestinationCrypto = {}
        this.listUploadFileformcrypto = [];
       
        this.FormDataOriginCrypto.WAYS = ogway;
        this.FormDataOriginCrypto.BANK_TYPE = ogtype;
        this.FormDataOriginCrypto.TYPE_MAIN = "P";
        this.FormDataOriginCrypto.TYPE_ID = "C";
        this.FormDataOriginCrypto.TYPE_NAME = "เงินดิจิทัล (Cryptocurrency)";
        this.FormDataOriginCrypto.TYPE_BANK_ID = 4;

        
        this.FormDataDestinationCrypto.WAYS = destiway;
        this.FormDataDestinationCrypto.BANK_TYPE = destitype;
        this.FormDataDestinationCrypto.TYPE_MAIN = "P";
        this.FormDataDestinationCrypto.TYPE_ID = "C";
        this.FormDataDestinationCrypto.TYPE_NAME = "เงินดิจิทัล (Cryptocurrency)";
        this.FormDataDestinationCrypto.TYPE_BANK_ID = 4;

        this.nowCrypto = null;
        this.formCrypto = {}
    }

    onSaveCryptoForm(e) {
        if (this.FormDataOriginCrypto.WAYS == this.FormDataDestinationCrypto.WAYS) {
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
        if (!this.formOriginCrypto.instance.validate().isValid) {
            Swal.fire({
                title: "ผิดพลาด!",
                html: "กรุณากรอกข้อมูลบัญชีต้นทางให้ครบ",
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => { });
            return
        }
        if (!this.formDestinyCrypto.instance.validate().isValid) {
            Swal.fire({
                title: "ผิดพลาด!",
                html: "กรุณากรอกข้อมูลบัญชีปลายทางให้ครบ",
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => { });
            return
        }
        if (!this.formCryptoDeatail.instance.validate().isValid) {
            Swal.fire({
                title: "ผิดพลาด!",
                html: "กรุณากรอกข้อมูลความเสียหายให้ครบ",
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => { });
            return
        }
        // ผู้เสียหาย ต้นทาง
        this.formCrypto.TYPE_BANK_ID = this.FormDataOriginCrypto.TYPE_BANK_ID
        this.formCrypto.BANK_ORIGIN_ACCOUNT = this.FormDataOriginCrypto.BANK_MONEY_OTHER_ACCOUNT
        this.formCrypto.BANK_ORIGIN_ACCOUNT_NAME = this.FormDataOriginCrypto.BANK_ORIGIN_ACCOUNT_NAME ?? null
        this.formCrypto.BANK_ORIGIN_NAME = this.FormDataOriginCrypto.BANK_ORIGIN_NAME?? null
        if(this.FormDataOriginCrypto.BANK_MONEY_OTHER_ACCOUNT){
            if(this.FormDataOriginCrypto.WAYS === 1){
                this.formCrypto.SHOW_NAME = '(Cryptocurrency ผู้ร้าย)' +  this.FormDataOriginCrypto.BANK_MONEY_OTHER_ACCOUNT;
            }else{
                this.formCrypto.SHOW_NAME = '(Cryptocurrency ผู้เสียหาย)' +  this.FormDataOriginCrypto.BANK_MONEY_OTHER_ACCOUNT;
            }
        }else{
            this.formCrypto.SHOW_NAME = 'ผู้แจ้งไม่ระบุ';
        }
        this.formCrypto.WAYS_ORIGIN = this.FormDataOriginCrypto.WAYS
        this.formCrypto.BANK_ORIGIN_MONEY_REMARK = this.FormDataOriginCrypto.BANK_ORIGIN_MONEY_REMARK ?? null;

        this.formCrypto.TYPE_DESTINATION_BANK_ID = this.FormDataDestinationCrypto.TYPE_BANK_ID
        this.formCrypto.BANK_ACCOUNT = this.FormDataDestinationCrypto.BANK_MONEY_OTHER_ACCOUNT
        this.formCrypto.BANK_ACCOUNT_NAME = this.FormDataDestinationCrypto.BANK_ACCOUNT_NAME ?? null
        this.formCrypto.BANK_NAME = this.formCrypto.BANK_NAME ?? null
        if(this.FormDataDestinationCrypto.WAYS === 1){
            this.formCrypto.SHOW_NAME_END = '(Cryptocurrency ผู้ร้าย)' +  this.FormDataDestinationCrypto.BANK_MONEY_OTHER_ACCOUNT;
        }else{
            this.formCrypto.SHOW_NAME_END = '(Cryptocurrency ผู้เสียหาย)' +  this.FormDataDestinationCrypto.BANK_MONEY_OTHER_ACCOUNT;
        }
        this.formCrypto.WAYS_DESTINATION = this.FormDataDestinationCrypto.WAYS
        this.formCrypto.BANK_MONEY_REMARK = this.FormDataDestinationCrypto.BANK_MONEY_REMARK ?? null;
        this.formCrypto.TRUEMONEY_DES_TYPE = this.FormDataDestinationCrypto.TRUEMONEY_DES_TYPE ?? null;

        this.formCrypto.BANK_ORIGIN_LIST_ID = this.formCrypto.SHOW_NAME;
        this.formCrypto.BANK_LIST_ID = this.formCrypto.SHOW_NAME;

        this.formCrypto.CASE_MONEY_CHANNEL_TYPE = 'T';
        this.formCrypto.CASE_MONEY_BANK_TRANFER = 'C';
        this.formCrypto.CASE_MONEY_BANK_TRANFER_NAME = this.FormDataDestinationCrypto.TYPE_NAME;

        this.formCrypto.BANK_MONEY_OTHER_ID = 'C';
        this.formCrypto.BANK_MONEY_OTHER_NAME = this.FormDataDestinationCrypto.TYPE_NAME;

        this.formCrypto.MONNEY_DOC = [];
        if (this.listUploadFileformcrypto.length > 0) {
            this.formCrypto.MONNEY_DOC.push(this.listUploadFileformcrypto[0]);
        }

        this.listDamageCrypto.push(this.formCrypto);
        this.listUploadFileformcrypto.splice(0, 1);
        this.calulatemoney([...this.listDamageCrypto, ...this.listDamageBank]);
        this.setDefualtCryptoForm();
    }

    onSaveCryptoItem(data : any){
        if (this.FormDataOriginCrypto.WAYS == this.FormDataDestinationCrypto.WAYS) {
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
        if (!this.formDestinyCrypto.instance.validate().isValid) {
            Swal.fire({
                title: "ผิดพลาด!",
                html: "กรุณากรอกข้อมูลบัญชีปลายทางให้ครบ",
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => { });
            return
        }
        // console.log(this.formCryptoDeatail.instance.validate().isValid);
        // console.log(this.formCryptoDeatail);
        if (!this.formCryptoDeatail.instance.validate().isValid) {
            Swal.fire({
                title: "ผิดพลาด!",
                html: "กรุณากรอกข้อมูลความเสียหายให้ครบ",
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => { });
            return
        }
        this.formCrypto.TYPE_BANK_ID = this.FormDataOriginCrypto.TYPE_BANK_ID
        this.formCrypto.BANK_ORIGIN_ACCOUNT = this.FormDataOriginCrypto.BANK_MONEY_OTHER_ACCOUNT
        this.formCrypto.BANK_ORIGIN_ACCOUNT_NAME = this.FormDataOriginCrypto.BANK_ORIGIN_ACCOUNT_NAME ?? null
        this.formCrypto.BANK_ORIGIN_NAME = this.FormDataOriginCrypto.BANK_ORIGIN_NAME?? null
        if(this.FormDataOriginCrypto.BANK_MONEY_OTHER_ACCOUNT){
            if(this.FormDataOriginCrypto.WAYS === 1){
                this.formCrypto.SHOW_NAME = '(Cryptocurrency ผู้ร้าย)' +  this.FormDataOriginCrypto.BANK_MONEY_OTHER_ACCOUNT;
            }else{
                this.formCrypto.SHOW_NAME = '(Cryptocurrency ผู้เสียหาย)' +  this.FormDataOriginCrypto.BANK_MONEY_OTHER_ACCOUNT;
            }
        }else{
            this.formCrypto.SHOW_NAME = 'ผู้แจ้งไม่ระบุ';
        }
        this.formCrypto.WAYS_ORIGIN = this.FormDataOriginCrypto.WAYS
        this.formCrypto.BANK_ORIGIN_MONEY_REMARK = this.FormDataOriginCrypto.BANK_ORIGIN_MONEY_REMARK ?? null;

        this.formCrypto.TYPE_DESTINATION_BANK_ID = this.FormDataDestinationCrypto.TYPE_BANK_ID
        this.formCrypto.BANK_ACCOUNT = this.FormDataDestinationCrypto.BANK_MONEY_OTHER_ACCOUNT
        this.formCrypto.BANK_ACCOUNT_NAME = this.FormDataDestinationCrypto.BANK_ACCOUNT_NAME ?? null
        this.formCrypto.BANK_NAME = this.FormDataDestinationCrypto.BANK_NAME ?? null
        if(this.FormDataDestinationCrypto.WAYS === 1){
            this.formCrypto.SHOW_NAME_END = '(Cryptocurrency ผู้ร้าย)' +  this.FormDataDestinationCrypto.BANK_MONEY_OTHER_ACCOUNT;
        }else{
            this.formCrypto.SHOW_NAME_END = '(Cryptocurrency ผู้เสียหาย)' +  this.FormDataDestinationCrypto.BANK_MONEY_OTHER_ACCOUNT;
        }
        this.formCrypto.WAYS_DESTINATION = this.FormDataDestinationCrypto.WAYS
        this.formCrypto.BANK_MONEY_REMARK = this.FormDataDestinationCrypto.BANK_MONEY_REMARK ?? null;
        this.formCrypto.TRUEMONEY_DES_TYPE = this.FormDataDestinationCrypto.TRUEMONEY_DES_TYPE ?? null;

        this.formCrypto.CASE_MONEY_CHANNEL_TYPE = 'T';
        this.formCrypto.CASE_MONEY_BANK_TRANFER = 'C';
        this.formCrypto.CASE_MONEY_BANK_TRANFER_NAME = this.FormDataDestinationCrypto.TYPE_NAME;

        this.formCrypto.BANK_MONEY_OTHER_ID = 'C';
        this.formCrypto.BANK_MONEY_OTHER_NAME = this.FormDataDestinationCrypto.TYPE_NAME ?? "เงินดิจิทัล (Cryptocurrency)";

        this.formCrypto.MONNEY_DOC = [];
        if (this.listUploadFileformcrypto.length > 0) {
            this.formCrypto.MONNEY_DOC.push(this.listUploadFileformcrypto[0]);
        }

        this.listDamageCrypto[this.selectItemCryptoIndex] = this.formCrypto;
        this.listUploadFileformcrypto.splice(0, 1);
        this.selectItemCryptoIndex = undefined;
        this.calulatemoney([...this.listDamageCrypto, ...this.listDamageBank]);
        this.setDefualtCryptoForm()
        this.isCryptoAdding = true;
    }
    onSelectCryptoItem(index : any){
        const data = this.listDamageCrypto[index];
        this.selectItemCryptoIndex = index;
        this.FormDataOriginCrypto = {};
        this.FormDataDestinationCrypto = {};
        this.formCrypto = {};
        this.formCryptoDetail = {};
        this.FormDataOriginCrypto.WAYS = data.WAYS_ORIGIN;
        this.FormDataOriginCrypto.TYPE_BANK_ID = data.TYPE_BANK_ID;
        this.FormDataOriginCrypto.BANK_MONEY_OTHER_ACCOUNT = data.BANK_ORIGIN_ACCOUNT;
        this.FormDataOriginCrypto.BANK_MONEY_OTHER_ACCOUNT = data.BANK_ORIGIN_ACCOUNT;
        this.FormDataOriginCrypto.TYPE_NAME = data.CASE_MONEY_CHANNEL_TYPE;

        this.FormDataDestinationCrypto.WAYS = data.WAYS_DESTINATION;
        this.FormDataDestinationCrypto.TYPE_BANK_ID = data.TYPE_DESTINATION_BANK_ID;
        this.FormDataDestinationCrypto.BANK_MONEY_OTHER_ACCOUNT = data.BANK_ACCOUNT;
        this.FormDataDestinationCrypto.TYPE_NAME = data.CASE_MONEY_CHANNEL_TYPE;

        this.formCrypto.TYPE_NAME = data.CASE_MONEY_CHANNEL_TYPE
        this.formCrypto.BANK_DAMAGE_VALUE = data.BANK_DAMAGE_VALUE
        this.formCrypto.BANK_DAMAGE_VALUE_BAHT = data.BANK_DAMAGE_VALUE_BAHT
        this.formCrypto.BANK_DAMAGE_VALUE_UNIT = data.BANK_DAMAGE_VALUE_UNIT
        const date = this.convertDate(data.BANK_TRANSFER_DATE, data.BANK_TRANSFER_TIME);
        this.nowCrypto = new Date(date[0], date[1], date[2], date[3], date[4], date[5]);
        if(data.MONNEY_DOC){
            if (data.MONNEY_DOC.length > 0) {
                this.listUploadFileformcrypto.push(data.MONNEY_DOC[0]);
            }
        }
        this.isCryptoAdding = false;
    }

    onDeleteCryptoItem(index : any){
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
                this.listDamageCrypto.splice(index, 1);
                this.calulatemoney([...this.listDamageCrypto, ...this.listDamageBank]);
            }
        });

    }

    OnSelectSubBankType(e,tag:DxSelectBoxComponent) {
        console.log("ประเภท Wallet",e);
        if (e.value) {
            const data = tag.instance.option('selectedItem');
            if (data) {
                this.FormDataOrigin.TYPE_BANK_SUB_NAME = data.type_name;
            }
        }
    }
}
