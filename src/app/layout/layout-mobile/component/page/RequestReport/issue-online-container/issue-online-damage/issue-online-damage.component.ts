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

    @ViewChild("form", { static: false }) form: DxFormComponent;
    @ViewChild("form2", { static: false }) form2: DxFormComponent;
    @ViewChild("formDamage1", { static: false }) formDamage1: DxFormComponent;
    @ViewChild("formDamage2", { static: false }) formDamage2: DxFormComponent;
    @ViewChild("formDamage3", { static: false }) formDamage3: DxFormComponent;
    @ViewChild("formAddData", { static: false }) subForm: DxFormComponent;
    @ViewChild("view_form", { static: false })
    scrollViewForm: DxScrollViewComponent;
    @ViewChild("selectWayOther", { static: false })
    selectWayOther: DxSelectBoxComponent;
    @ViewChild("UploadFileDamageList") tagsUploadFileDamageList;
    public mainConponent: IssueOnlineContainerComponent;
    personalInfo: any = {};
    isLoading = false;
    occupationList = [];
    formData: any = {};
    presentAddress: any = {};
    province = [];
    bankInfoList: any = [];
    // bankOtherList = [
    //     {  ID:"T",TEXT:"True Money" },
    //     {  ID:"P",TEXT:"Paypal" },
    //     {  ID:"O",TEXT:"อื่นๆ" },
    // ];
    bankOtherList: any = [];
    WayOtherList: any = [];
    socialInfo = [];
    popup = false;
    reloadDataPopup = false;
    damageType = [
        { ID: 1, TEXT: "เกิดความเสียหาย" },
        { ID: 2, TEXT: "ยังไม่เกิดความเสียหาย" },
    ];
    bankTransferType = [
        { ID: "T", TEXT: "ธนาคาร" },
        { ID: "P", TEXT: "พร้อมเพย์" },
    ];
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
    listDamageBankOther: any = [];
    listDamageOther: any = [];
    titlePopup = "";
    popupConfigs: any = {};
    listUploadFileWayOther: any = [];
    loadDateBox = false;
    minBirthDate: Date;
    maxBirthDate: Date;

    loadDateBoxOther = false;
    minBirthDateOther: Date;
    maxBirthDateOther: Date;
    bankOtherListTypeOther = false;
    indexUploadFileDamageListAttachment = 0;
    fileView: string;
    popupViewFile = false;
    popupViewFileData: any = {};

    limitSizeBank = 0;
    limitSizeBankOther = 0;
    limitSizeOther = 0;

    maxSizeBuffer = 0;
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
        private userSetting: UserSettingService
    ) {}

    ngOnInit(): void {
        this.isLoading = true;
        const userId = User.Current.PersonalId;
        this.servicePersonal.GetPersonalById(userId).subscribe((_) => {
            this.personalInfo = _;
            this.SetDefaultData();
        });
        const coll = document.getElementsByClassName("collapsible");
        let i = 0;
        for (i = 0; i < coll.length; ) {
            coll[i].addEventListener("click", function () {
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
        // this.popupFormData.BANK_TRANSFER_DATE = this._date.SetDateDefault(0);
        // this.minBirthDateOther = this._date.SetDateDefault(10, true);
        // this.maxBirthDateOther = this._date.SetDateDefault(0);
        // this.loadDateBoxOther = true;
    }
    onColla() {
        // const coll = document.getElementsByClassName("collapsible");
        // let i = 0;
        // for ( i = 0; i < coll.length;) {
        //     coll[i].addEventListener("click", function() {
        //         this.classList.toggle("active");
        //         const content = this.nextElementSibling;
        //         if (content.style.display === "block") {
        //             content.style.display = "none";
        //         } else {
        //             content.style.display = "block";
        //         }
        //     });
        //     i++;
        // }
    }
    ConvertDateFullMonth(date) {
        const d = new Date(date);
        const month = d.getMonth();
        const ddate = ` ${d.getDate()} `;
        const textMonthNow = ` ${this.monthFulltTh[month]}`;
        const year = d.getFullYear() + 543;
        return [ddate, " ", textMonthNow, " ", year].join("");
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
        }).then(() => {});
    }
    async SetDefaultData() {
        this.bankInfoList = await this.servBankInfo.GetBankInfo().toPromise();
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
            this.formType = "edit";
            this.formReadOnly = false;
            this.formAddData = true;
            this.ChangeHasDamage({ value: 1 });
        } else {
            this.formType = "edit";
            this.formReadOnly = true;
            this.formAddData = false;

            this.DefaultCheckbox();
            this.defaultDamageType = null;
            this.formData = this.mainConponent.formDataInsert;
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
            };
        }
        this.isLoading = false;
    }
    async SetDataToListBank(data) {
        for (const item of data) {
            if (item.CASE_MONEY_CHANNEL_TYPE === "T") {
                this.listDamageBank.push(item);
            } else if (item.CASE_MONEY_CHANNEL_TYPE === "P") {
                this.listDamageBankOther.push(item);
            } else if (item.CASE_MONEY_CHANNEL_TYPE === "O") {
                this.listDamageOther.push(item);
            }
        }
        return true;
    }

    // async OtheWayUploadFile(uploadTag) {
    //     const files: FileList = uploadTag.files;
    //     if (files.length > 0) {
    //         const checkAllow = this._issueFile.CheckFileUploadClick(files);
    //         if (checkAllow){
    //             // this.uploadFileRefresh = false;
    //             this.isLoading = true;
    //             // eslint-disable-next-line @typescript-eslint/prefer-for-of
    //             for (let index = 0; index < files.length; index++) {
    //                 const item = files[index];
    //                 await this.OtheWayUploadFileConvertBase64(item);
    //             }
    //             this.isLoading = false;
    //             // this.uploadFileRefresh = true;

    //             // console.log('files',files);

    //         }

    //     }
    // }
    // async OtheWayFilesDropped(e) {
    //     // this.uploadFileRefresh = false;
    //     const files = e;
    //     if (files.length > 0) {
    //         const checkAllow = this._issueFile.CheckFileUploadDrop(files);
    //         if (checkAllow){
    //             // this.ConvertBase64(files[0].file);
    //             this.isLoading = true;
    //             // eslint-disable-next-line @typescript-eslint/prefer-for-of
    //             for (let index = 0; index < files.length; index++) {
    //                 const item = files[index].file;
    //                 await this.OtheWayUploadFileConvertBase64(item);
    //             }
    //             this.isLoading = false;
    //             // this.uploadFileRefresh = true;
    //         }

    //     }
    // }

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
            CASE_MONEY_TYPE2: "N",
            CASE_MONEY_TYPE3: "N",
            CASE_MONEY_TYPE4: "N",
            CASE_MONEY_DAMAGE_VALUE: 0,
            CASE_MONEY: [],
        };
        this.checkboxDamage = {
            case_type1: false,
            case_type2: false,
            case_type3: false,
            case_type4: false,
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
                        CASE_MONEY_DAMAGE_VALUE: 0,
                        // CASE_MONEY: [
                        //     {
                        //         CASE_MONEY_CHANNEL_TYPE: "T", // 'T','P','O',
                        //         BANK_DAMAGE_VALUE: 0,
                        //         BANK_ID: bankInfoList.BANK_ID,
                        //         BANK_NAME: bankInfoList.BANK_NAME,
                        //         BANK_ACCOUNT_NAME: "XXXXXXX XXXXXXX",
                        //         BANK_ACCOUNT: undefined,
                        //         BANK_DETAIL: []
                        //     },{
                        //         CASE_MONEY_CHANNEL_TYPE: "T", // 'T','P','O',
                        //         BANK_DAMAGE_VALUE: 0,
                        //         BANK_ID: bankInfoList.BANK_ID,
                        //         BANK_NAME: bankInfoList.BANK_NAME,
                        //         BANK_ACCOUNT_NAME: "XXXXXXX XXXXXXX",
                        //         BANK_ACCOUNT: undefined,
                        //         BANK_DETAIL: []
                        //     }
                        // ]
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
                this.limitSizeBank = 0;
                this.limitSizeBankOther = 0;
                this.listDamageBank = [];
                this.listDamageBankOther = [];
                this.formData.CASE_MONEY_TYPE3 = "N";
                this.formData.CASE_MONEY_TYPE4 = "N";
            } else if (type === "CASE_MONEY_TYPE2") {
                this.limitSizeOther = 0;
                this.listDamageOther = [];
            } else if (type === "CASE_MONEY_TYPE3") {
                this.limitSizeBank = 0;
                this.listDamageBank = [];
            } else if (type === "CASE_MONEY_TYPE4") {
                this.limitSizeBankOther = 0;
                this.listDamageBankOther = [];
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
            this.popupFormData.BANK_TRANSFER_DATE =
                this._date.SetDateDefault(0);
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
        // console.log('uploadTag',uploadTag);
        if (files.length === 1) {
            // console.log('files[0],index',files[0]);
            // this.ConvertBase64AddTable(files[0],index); // แบบเก่า
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
                // this.ConvertBase64AddTable(files[0],this.indexUploadFileDamageListAttachment);
            }
            this.isLoading = false;
        }
    }
    // ConvertBase64AddTable(file,index){
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onload = () => {
    //         let base64File = {} as any;
    //         base64File = reader.result;
    //         this.popupSubFormList[index].BANK_DOC = {
    //             storage:"base64",
    //             name:"file",
    //             url:base64File,
    //             size:file.size,
    //             sizeDetail:this.BytesToSize(file.size),
    //             type:file.type,
    //             originalName:file.name,
    //         };
    //     };
    // }
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
        this.popupSubFormData.BANK_TRANSFER_DATE = this._date.SetDateDefault(0);
        this.minBirthDate = this._date.SetDateDefault(10, true);
        this.maxBirthDate = this._date.SetDateDefault(0);
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
                // const type = this.popupFormData.CASE_MONEY_CHANNEL_TYPE;
                this.maxSizeBuffer -=
                    this.popupSubFormList[index].BANK_DOC.size ?? 0;
                this.popupSubFormList[index].BANK_DOC = null;
            }
        });
    }
    async SetDataSubFormList(data: any = []) {
        this.popupSubFormList = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            this.popupSubFormList.push(item);
        }
        return;
    }
    async SetDataSubFormListOther(data: any = []) {
        this.listUploadFileWayOther = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            this.listUploadFileWayOther.push(item);
        }
        return;
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
        const countArray = data.length ?? 0;
        if (countArray > 0) {
            return true;
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
        const numfloat = parseFloat(num);
        if (num > 0) {
            const SumAll = parseFloat(this.formData.CASE_MONEY_DAMAGE_VALUE);
            if (type === "sum") {
                this.formData.CASE_MONEY_DAMAGE_VALUE = SumAll + numfloat;
            } else if (type === "remove") {
                this.formData.CASE_MONEY_DAMAGE_VALUE = SumAll - numfloat;
            }
            this.formData.CASE_MONEY_DAMAGE_VALUE = parseFloat(
                this.formData.CASE_MONEY_DAMAGE_VALUE
            ).toFixed(2);
        }
    }
    SumSubDamageValue(num, type = "sum") {
        const numfloat = parseFloat(num);
        if (num > 0) {
            const SumAll = parseFloat(this.popupFormData.BANK_DAMAGE_VALUE);
            if (type === "sum") {
                this.popupFormData.BANK_DAMAGE_VALUE = SumAll + numfloat;
            } else if (type === "remove") {
                this.popupFormData.BANK_DAMAGE_VALUE = SumAll - numfloat;
            }
            this.popupFormData.BANK_DAMAGE_VALUE = parseFloat(
                this.popupFormData.BANK_DAMAGE_VALUE
            ).toFixed(2);
        }
    }

    // ItemDamageSubSave(){
    //     if (!this.subForm.instance.validate().isValid) {
    //         this.ShowInvalidDialog();
    //         return;
    //     }
    //     const DmValue = this.popupForm.formSubData.POPUP_BANK_DAMAGE_VALUE ?? 0;
    //     const saveData = {
    //         POPUP_BANK_TRANSFER_DATETIME:this.popupForm.formSubData.POPUP_BANK_TRANSFER_DATETIME,
    //         POPUP_BANK_DAMAGE_VALUE:DmValue,
    //         POPUP_BANK_BANK_DOC:this.popupForm.uploadFileBuffer,
    //     };
    //     this.popupForm.formData.ITEM_DETAIL.push(saveData);
    //     this.SumSubDamageValue(DmValue,'sum');
    //     this.ItemDamageSubClose();
    // }

    ItemDamageSubSave() {
        if (!this.subForm.instance.validate().isValid) {
            this.ShowInvalidDialog();
            return;
        }
        const DmValue = this.popupSubFormData.BANK_DAMAGE_VALUE ?? 0;
        const saveData = {
            BANK_TRANSFER_DATE: this._date.ConvertToDateFormat(
                this.popupSubFormData.BANK_TRANSFER_DATE
            ),
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
        // if (type === 'close'){
        //     this.popupSubFormList = [];
        // }
    }
    // ItemDamageSubAdd(data,index){
    //     this.reloadDataPopup = true;
    //     this.popup = true;
    //     this.popupsaveData = false;
    //     this.popupForm.index = index;
    //     this.popupForm.formData = data;
    //     this.popupForm.type = 'addSub';
    // }
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
    OnSelectBankAccountOrigin(e) {
        if (e.value) {
            const data =
                this.selectBankInfoOrigin.instance.option("selectedItem");
            console.log(data, this.selectBankInfoOrigin);
            if (data) {
                this.popupFormData.BANK_ORIGIN_ID = data.BANK_ID;
                this.popupFormData.BANK_ORIGIN_NAME = data.BANK_NAME;
            } else {
                this.popupFormData.BANK_ORIGIN_ID = e.value;
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
    ItemDamageSubDelete(index, subIndex, type) {
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
                    const dmValueItem =
                        this.listDamageBank[index].BANK_DETAIL[subIndex]
                            .BANK_DAMAGE_VALUE ?? 0;
                    const numfloat = parseFloat(dmValueItem);
                    if (dmValueItem > 0) {
                        const SumAll = parseFloat(
                            this.listDamageBank[index].BANK_DAMAGE_VALUE
                        );
                        const samary: any = SumAll - numfloat;
                        this.listDamageBank[index].BANK_DAMAGE_VALUE =
                            parseFloat(samary).toFixed(2);
                        this.SumAllDamageValue(dmValueItem, "remove");
                    }
                    if (
                        this.listDamageBank[index].BANK_DETAIL[subIndex]
                            .BANK_DOC
                    ) {
                        this.limitSizeBank -=
                            this.listDamageBank[index].BANK_DETAIL[subIndex]
                                .BANK_DOC.size ?? 0;
                    }
                    this.listDamageBank[index].BANK_DETAIL.splice(subIndex, 1);

                    // const dmValueAll = this.listDamageBank[index].BANK_DAMAGE_VALUE ?? 0;
                    // console.log('dmValueAll',dmValueAll);
                    // this.SumAllDamageValue(dmValueAll,'remove');
                    // this.listDamageBank.splice(index, 1);
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
                    // const dmValueAll = this.listDamageBankOther[index].BANK_DAMAGE_VALUE ?? 0;
                    // console.log('dmValueAll',dmValueAll);
                    // this.SumAllDamageValue(dmValueAll,'remove');
                    // this.listDamageBankOther.splice(index, 1);
                }
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
        this.formDamage1.instance._refresh();
        this.formDamage2.instance._refresh();
        this.formDamage3.instance._refresh();
    }
    ReplaceText(key) {
        return key.replace("POPUP_", "");
    }
    ReplaceTextEdit(key) {
        return `POPUP_${key}`;
    }
    async ItemDamageSave() {
        console.log("= this.popupFormData->>>", this.popupFormData);
        // console.log('= this.popupFormData->>>',this.popupSubFormList);

        // if (!this.form.instance.validate().isValid) {
        //     this.ShowInvalidDialog();
        //     return;
        // }
        let checkForm = true;
        if (this.popupFormData.CASE_MONEY_CHANNEL_TYPE === "T") {
            checkForm = !this.formDamage1.instance.validate().isValid;
        } else if (this.popupFormData.CASE_MONEY_CHANNEL_TYPE === "P") {
            checkForm = !this.formDamage2.instance.validate().isValid;
        } else if (this.popupFormData.CASE_MONEY_CHANNEL_TYPE === "O") {
            checkForm = !this.formDamage3.instance.validate().isValid;
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
        console.log(data);
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
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.mainConponent.numCount = this.mainConponent.indexTab - 1;
        this.userSetting.userSetting.tabIndex = this.mainConponent.numCount;
    }
    SetTextErrorInvalidListDamage(textArray) {
        let textError = "";
        const checkMoreOneItem = textArray.length > 1 ? true : false;
        for (const [key, item] of textArray.entries()) {
            if (key === 0) {
                const comma = checkMoreOneItem ? "," : "";
                textError += `<span>กรุณาเพิ่มรายละเอียด ${
                    item + comma
                }</span><br>`;
            } else {
                const comma = key !== textArray.length - 1 ? "," : "";
                textError += `<span style="padding-left: 5px;">${
                    item + comma
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
            form.CASE_MONEY_TYPE3 === "Y" &&
            !this.CheckArray(this.listDamageBank)
        ) {
            textError.push("การโอนเงินผ่านธนาคาร");
            status = true;
        }

        if (
            form.CASE_MONEY_TYPE1 === "Y" &&
            form.CASE_MONEY_TYPE4 === "Y" &&
            !this.CheckArray(this.listDamageBankOther)
        ) {
            textError.push("การโอนเงินด้วยวิธีอื่น");
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
            }).then(() => {});
        }

        return status;
    }

    SubmitForm(e) {
        if (this.mainConponent.formType === "add") {
            const dmValue = this.formData.CASE_MONEY_DAMAGE_VALUE ?? 0;
            if (this.defaultDamageType === 1 && this.CheckInvalidListDamage()) {
                return;
            } else if (this.defaultDamageType === 1 && dmValue <= 0) {
                this.ShowInvalidDialog("กรุณาเพิ่มรายละเอียดความเสียหาย");
                return;
            }
            this.mainConponent.formDataAll.DataDamageShow = {};
            // this.mainConponent.formDataAll.DataDamageShow = this.formData;
            const listMoney = this.MergeArray(
                this.listDamageBank,
                this.listDamageBankOther,
                this.listDamageOther
            );
            this.mainConponent.formDataAll.formDamage = {};
            this.mainConponent.formDataAll.formDamage = this.formData;
            this.mainConponent.formDataAll.formDamage.CASE_MONEY = listMoney;
            this.mainConponent.formDataAll.formDamage.listDamageBank =
                this.listDamageBank;
            this.mainConponent.formDataAll.formDamage.listDamageBankOther =
                this.listDamageBankOther;
            this.mainConponent.formDataAll.formDamage.listDamageOther =
                this.listDamageOther;
        }
        this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
        this.mainConponent.numCount = this.mainConponent.indexTab + 1;
        this.userSetting.userSetting.tabIndex = this.mainConponent.numCount;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    chkNum(ele) {
        return Intl.NumberFormat("th-TH", {
            currency: "THB",
        }).format(ele);
        // const num = parseFloat(ele.value);
        //  num.toFixed(2);
    }
}
