import { Component, OnInit, ViewChild } from "@angular/core";
import { DxFormComponent, DxSelectBoxComponent } from "devextreme-angular";
import { BankInfoService } from "src/app/services/bank-info.service";
import Swal from "sweetalert2";
import * as moment from 'moment';
import { IssueOnlineTabComponent } from "../issue-online-tab/issue-online-tab.component";
import { ProvinceService } from "src/app/services/province.service";
import { DistrictService } from "src/app/services/district.service";
import { SubdistrictService } from "src/app/services/subdistrict.service";
import DataSource from "devextreme/data/data_source";
@Component({
    selector: "app-issue-online-villain",
    templateUrl: "./issue-online-villain.component.html",
    styleUrls: ["./issue-online-villain.component.scss"],
})
export class IssueOnlineVillainComponent implements OnInit {
    @ViewChild("formKnowVillain", { static: false }) formKnowVillain: DxFormComponent;
    @ViewChild("formCaseChannel", { static: false }) formCaseChannel: DxFormComponent;
    @ViewChild("popup_form_bank", { static: false }) formBank: DxFormComponent;
    @ViewChild("formlocation", { static: false }) formLocation: DxFormComponent;
    @ViewChild("selectLanguage", { static: false }) selectLanguage: DxSelectBoxComponent;
    @ViewChild("selectCaseChannel", { static: false }) selectCaseChannel: DxSelectBoxComponent;
    @ViewChild("selectMoneyType", { static: false }) selectMoneyType: DxSelectBoxComponent;
    @ViewChild("selectBankInfo", { static: false }) selectBankInfo: DxSelectBoxComponent;
    @ViewChild("selectBankOrgList", { static: false }) selectBankOrgList: DxSelectBoxComponent;
    @ViewChild("selectBankLocation", { static: false }) selectBankLocation: DxSelectBoxComponent;
    @ViewChild("selectCoinCurrency", { static: false }) selectCoinCurrency: DxSelectBoxComponent;
    @ViewChild("selectLocationProvince", { static: false }) selectLocationProvince: DxSelectBoxComponent;
    @ViewChild("selectLocaltionDistrict", { static: false }) selectLocaltionDistrict: DxSelectBoxComponent;
    @ViewChild("selectLocationSubDistrict", { static: false }) selectLocationSubDistrict: DxSelectBoxComponent;
    @ViewChild("selectNearStation", { static: false }) selectNearStation: DxSelectBoxComponent;
    public mainConponent: IssueOnlineTabComponent;
    listBankAccount = [
        {MONEY_CHANNEL_TYPE:"T",MONEY_CHANNEL_TYPE_THA:"ธนาคาร"},{MONEY_CHANNEL_TYPE:"P",MONEY_CHANNEL_TYPE_THA:"พร้อมเพย์"},
        {MONEY_CHANNEL_TYPE:"C",MONEY_CHANNEL_TYPE_THA:"Cryptocurrency"},{MONEY_CHANNEL_TYPE:"O",MONEY_CHANNEL_TYPE_THA:"อื่น ๆ"}
    ];
    caseLabelName = {
        text0:"ชื่อช่องทางติดต่อคนร้าย",
        text1:"ชื่อ Line คนร้าย",
        text2:"ชื่อ Facebook คนร้าย",
        text3:"ชื่อ Instragram คนร้าย",
        text4:"ชื่อ Website คนร้าย",
        text5:"ชื่อ E-mail คนร้าย",
        text6:"ชื่อ SMS คนร้าย",
        text8:"ชื่อช่องทางติดต่อคนร้าย",
    };
    caseLabelID = {
        text0:"ID ช่องทางติดต่อคนร้าย",
        text1:"Line ID",
        text2:"Facebook ID",
        text3:"Instragram URL",
        text4:"Website URL",
        text5:"E-mail",
        text6:"หมายเลข SMS คนร้าย",
        text8:"ID ช่องทางติดต่อคนร้าย",
    };
    maskRules = {
        N: /[0-9]/,
        D: '.',
    };
    bankOrgList = [];
    bankInfoList = [];
    bankOrgStationList = [];
    listNearStation: DataSource;
    isLoading = false;
    listDocFile = [];
    listCaseChannel = [];
    listLanguage = [];
    knowVillain = false;
    popupknowVillain = false;
    popupCaseChannel = false;
    popupGetUrlFB = false;
    popupCaseDoc = false;
    popupCaseDocReload = false;
    popupType = "add";
    popupIndex = 0;
    popupUploadDocType = "add";
    popupUploadDocIndex = 0;
    popupCaseMoney = false;
    popupCaseMoneyDamageBuffer = 0;
    popupLocationType = 1;
    formPopup: any = {};
    formData: any = {};
    formDataUploadDoc: any = {};
    LabelCaseChanelName = "";
    LabelCaseChanelId = "";
    popupLocation = false;
    listCoinCurrency =[
        {MONEY_CHENNEL_COIN_CURRENCY:"B",MONEY_CHENNEL_COIN_CURRENCY_THA:"Bitcoin"},
        {MONEY_CHENNEL_COIN_CURRENCY:"E",MONEY_CHENNEL_COIN_CURRENCY_THA:"Ethereum"},
        {MONEY_CHENNEL_COIN_CURRENCY:"T",MONEY_CHENNEL_COIN_CURRENCY_THA:"Tether"},
        {MONEY_CHENNEL_COIN_CURRENCY:"BC",MONEY_CHENNEL_COIN_CURRENCY_THA:"Binance Coin"},
        {MONEY_CHENNEL_COIN_CURRENCY:"C",MONEY_CHENNEL_COIN_CURRENCY_THA:"Cardano"},
        {MONEY_CHENNEL_COIN_CURRENCY:"X",MONEY_CHENNEL_COIN_CURRENCY_THA:"XRP"},
        {MONEY_CHENNEL_COIN_CURRENCY:"D",MONEY_CHENNEL_COIN_CURRENCY_THA:"Dogecoin"},
        {MONEY_CHENNEL_COIN_CURRENCY:"O",MONEY_CHENNEL_COIN_CURRENCY_THA:"อื่นๆ"},
    ];
    locationProvince = [];
    locationDistrict = [];
    locationSubDistrict = [];
    formPopupOther: any = {};
    constructor(
        private servBankInfo: BankInfoService,
        private serviceProvince: ProvinceService,
        private serviceDistrict: DistrictService,
        private serviceSubDistrict: SubdistrictService,
    ) {}

    ngOnInit(): void {
        this.servBankInfo
            .GetLanguage()
            .subscribe((_) => {
                this.listLanguage = _;
                this.setDefaultData();
            });
        this.servBankInfo
            .GetCaseChannel()
            .subscribe((_) => (this.listCaseChannel = _));

        this.servBankInfo
            .GetBankInfo()
            .subscribe((_) => (this.bankInfoList = _));
        this.serviceProvince
            .GetProvince()
            .subscribe((_) => (this.locationProvince = _));
        this.loadDataNearStation();
    }
    loadDataNearStation() {
        this.listNearStation = new DataSource({
            pageSize: 10,
            byKey: (_) => undefined,
            load: (opt) => {
                const conditon: any = {};
                conditon.ORGANIZE_NAME_THA = opt.searchValue;
                return this.servBankInfo.SearchNearStation(conditon, opt.skip, opt.take)
                    .toPromise()
                    .then(_ => {
                    // console.log(_);
                        if (!_.Data) {
                            _.Data = [];
                        }
                        return { data: _.Data, totalCount: _.TotalCount };
                    });
            }

        });
    }
    setDefaultData(){
        if (this.mainConponent.formType === 'add') {
            this.formData = {
                LANGUAGE_ID: 1,
                criminal: false,
                editGrid: [],
                CASE_CHANNEL: [],
                CASE_MONEY: [],
                LOCATION_1: [],
                LOCATION_2: [],
                DAMAGE_VALUE_TOTAL1:0,
                CASE_BEHAVIOR:"",
            };

        }else{
            this.formData = this.mainConponent.formDataInsert;
        }

    }
    OnLangChange(e){
        const data = this.selectLanguage.instance.option("selectedItem");
        this.formData.LANGUAGE_ID = data.LANGUAGE_ID;
        this.formData.LANGUAGE_NAME = data.LANGUAGE_NAME;

    }
    OnCriminalChange(e){
        if (!e.value) {
            this.formData.editGrid = [];
        }
    }
    BankAccountText(){
        const key  = `key${this.formPopup.MONEY_CHANNEL_TYPE}`;
        const accountText = {
            keyT:"บัญชีปลายทางที่โอน/Promptpay",
            keyP:"บัญชีปลายทางที่โอน/Promptpay",
            keyC:"Cryptocurrency Address",
            keyO:"หมายเลข/บัญชี ปลายทางที่โอน",
            key:"หมายเลข/บัญชี ปลายทางที่โอน",
        };
        return accountText[key];
    }
    CheckTotal(e) {
        if (e) {
            return e;
        } else {
            return 0;
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

    ShowInvalidDialog(){
        Swal.fire({
            title: "ผิดพลาด!",
            text: "กรุณากรอกข้อมูลให้ครบ",
            icon: "warning",
            confirmButtonText: "Ok",
        }).then(() => {});
    }
    // PopupknowVillain Start
    KnowVillainAddData(){
        this.popupType = 'add';
        this.popupknowVillain = true;
        this.formPopup = {};
    }
    KnowVillainEditData(type, data = {} as any, index = null){
        this.popupType = 'edit';
        this.popupknowVillain = true;
        this.formPopup = data;
        this.popupIndex = index;

    }
    KnowVillainSaveData(){
        // console.log(this.formBank);
        if (!this.formKnowVillain.instance.validate().isValid) {
            this.ShowInvalidDialog();
            return;
        }

        const d = this.formPopup;
        if (this.popupType === 'add') {
            this.formData.editGrid.push({
                CRIMINAL_ID_CARD:d.CRIMINAL_ID_CARD,
                CRIMINAL_NAME:d.CRIMINAL_NAME,
                CRIMINAL_LASTNAME:d.CRIMINAL_LASTNAME,
            });
        }else{
            this.formData.editGrid[this.popupIndex] = {
                CRIMINAL_ID_CARD:d.CRIMINAL_ID_CARD,
                CRIMINAL_NAME:d.CRIMINAL_NAME,
                CRIMINAL_LASTNAME:d.CRIMINAL_LASTNAME,
            };

        }

        this.closeKnowVillainData();

    }
    KnowVillainDeleteData(index = null) {
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
                this.formData.editGrid.splice(index, 1);
            }
        });
    }

    closeKnowVillainData(){
        this.popupknowVillain = false;
        this.formPopup = {};
        this.formKnowVillain.instance._refresh();


    }
    // PopupknowVillain End


    // popupCaseChannel Start
    CaseChannelAddData(){
        this.popupType = 'add';
        this.popupCaseChannel = true;
        const d = this.listCaseChannel[0] ?? null;
        this.formPopup = {
            CHANNEL_ID:d.CHANNEL_ID,
            CHANNEL_NAME:d.CHANNEL_NAME,
            CASE_CHANNEL_DATETIME_MATCH:false
        };
        this.listDocFile = [];
        this.ChangeLabelCaseChanelId(1);

    }
    CaseChannelEditData(type, data = {} as any, index = null){
        this.isLoading = true;
        this.popupType = 'edit';
        this.popupCaseChannel = true;
        this.popupIndex = index;
        setTimeout(()=>{
            this.formCaseChannel.instance._refresh();
            this.formPopup = data;
            this.formPopup.CASE_CHANNEL_DATETIME_MATCH = (data.CASE_CHANNEL_DATETIME_MATCH)?true:false;
            this.listDocFile = data.CHANNEL_DOC ?? [];
            this.isLoading = false;
        }, 1000);

    }
    CaseChannelSaveData(){
        // console.log(this.formBank);
        if (!this.formCaseChannel.instance.validate().isValid) {
            this.ShowInvalidDialog();
            return;
        }

        const d = this.formPopup;
        if (this.popupType === 'add') {
            this.formData.CASE_CHANNEL.push({
                CHANNEL_ID:d.CHANNEL_ID ?? 0,
                CHANNEL_NAME:d.CHANNEL_NAME,
                CASE_CHANNEL_NAME:d.CASE_CHANNEL_NAME,
                CHANNEL_OTHER:d.CHANNEL_OTHER,
                CASE_CHANNEL_REFER_ID:d.CASE_CHANNEL_REFER_ID,
                CASE_CHANNEL_REFER_URL:d.CASE_CHANNEL_REFER_URL,
                CASE_CHANNEL_MESSAGE:d.CASE_CHANNEL_MESSAGE,
                CASE_CHANNEL_DATETIME_MATCH:d.CASE_CHANNEL_DATETIME_MATCH,
                CASE_CHANNEL_DATETIME:d.CASE_CHANNEL_DATETIME,
                CASE_CHANNEL_TIME:d.CASE_CHANNEL_TIME,
                CASE_CHANNEL_DATETIME_LAST:d.CASE_CHANNEL_DATETIME_LAST,
                CASE_CHANNEL_TIME_LAST:d.CASE_CHANNEL_TIME_LAST,
                CHANNEL_DOC:this.listDocFile
            });
        }else{
            this.formData.CASE_CHANNEL[this.popupIndex] = {
                CHANNEL_ID:d.CHANNEL_ID ?? 0,
                CHANNEL_NAME:d.CHANNEL_NAME,
                CASE_CHANNEL_NAME:d.CASE_CHANNEL_NAME,
                CHANNEL_OTHER:d.CHANNEL_OTHER,
                CASE_CHANNEL_REFER_ID:d.CASE_CHANNEL_REFER_ID,
                CASE_CHANNEL_REFER_URL:d.CASE_CHANNEL_REFER_URL,
                CASE_CHANNEL_MESSAGE:d.CASE_CHANNEL_MESSAGE,
                CASE_CHANNEL_DATETIME_MATCH:d.CASE_CHANNEL_DATETIME_MATCH,
                CASE_CHANNEL_DATETIME:d.CASE_CHANNEL_DATETIME,
                CASE_CHANNEL_TIME:d.CASE_CHANNEL_TIME,
                CASE_CHANNEL_DATETIME_LAST:d.CASE_CHANNEL_DATETIME_LAST,
                CASE_CHANNEL_TIME_LAST:d.CASE_CHANNEL_TIME_LAST,
                CHANNEL_DOC:this.listDocFile
            };

        }
        this.CaseChannelclose();

    }
    CaseChannelDeleteData(index = null) {
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
                this.formData.CASE_CHANNEL.splice(index, 1);
            }
        });
    }
    ChangeLabelCaseChanelId(_number: number = 0){
        const labelKey ="text"+ _number;
        this.LabelCaseChanelName = this.caseLabelName[labelKey];
        this.LabelCaseChanelId = this.caseLabelID[labelKey];
    }

    OnSelectCaseChannel(e) {
        if (e.value) {
            const data = this.selectCaseChannel.instance.option("selectedItem");
            if (data) {
                this.formPopup.CHANNEL_ID = data.CHANNEL_ID;
                this.formPopup.CHANNEL_NAME = data.CHANNEL_NAME;
            }else{
                this.formData.CHANNEL_ID = e.value;
            }
            this.ChangeLabelCaseChanelId(e.value);
        }
    }
    OpenGetUrlFB(){
        this.popupGetUrlFB = true;
    }
    closeGetUrlFB(){
        this.popupGetUrlFB = false;
    }
    OpenCaseDoc(){
        this.popupCaseDoc = true;
        this.popupCaseDocReload = true;
        this.formDataUploadDoc = {};
        this.popupUploadDocIndex = 0;
        this.popupUploadDocType = 'add';

    }
    FileCaseDocUpload(event) {
        const file = event.value[0];
        // console.log('event',event);
        const size = `${file.size / 1024 / 1024}`;
        if (parseFloat(size) > 10) {
            this.popupCaseDocReload = false;
            Swal.fire({
                title: 'ผิดพลาด !',
                text: 'ไฟล์มีขนาดเกิน 10 Mb',
                icon: 'error',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                this.popupCaseDocReload = true;
            });
            return ;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            let base64File = {} as any;
            base64File = reader.result;
            this.formDataUploadDoc = {
                storage:"base64",
                name:"file",
                url:base64File,
                size:file.size,
                sizeDetail:this.BytesToSize(file.size),
                type:file.type,
                originalName:file.name,
            };

        };
    }
    DownloadFileCaseDoc(data) {
        const linkSource = data.url;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = data.originalName;
        downloadLink.click();
    }
    SaveCaseDoc() {
        if (this.formDataUploadDoc) {
            if (!this.formDataUploadDoc.originalName){
                Swal.fire({
                    title: 'ผิดพลาด !',
                    text: 'กรูณาเลือกไฟล์',
                    icon: 'warning',
                    confirmButtonText: 'ตกลง'
                }).then(() => {});
                return;
            }

        }
        if (this.popupUploadDocIndex || this.popupUploadDocType === 'edit') {
            this.listDocFile[this.popupUploadDocIndex] = this.formDataUploadDoc;
        } else {
            this.listDocFile.push(this.formDataUploadDoc);
        }
        // console.log('this.formDataUploadDoc->>>>',this.formDataUploadDoc);
        this.closeCaseDoc();
    }
    DeleteCaseDoc(index = null) {
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
                this.listDocFile.splice(index, 1);
            }
        });
    }
    closeCaseDoc(){
        this.popupCaseDoc = false;
        this.popupCaseDocReload = false;
    }
    CaseChannelclose(){
        this.popupCaseChannel = false;
        this.formPopup = {};
        this.formCaseChannel.instance._refresh();


    }
    BytesToSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) {
            return '0 Byte';
        }
        const data: any = Math.floor(Math.log(bytes) / Math.log(1024));
        const i = parseInt(data, 10);
        return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
    }
    // popupCaseChannel End
    // bankFormPopup Start
    CaseMoneyAddData(){
        this.popupType = 'add';
        this.popupCaseMoney = true;
        const d = this.listBankAccount[0] ?? null;

        this.formPopup = {
            MONEY_CHANNEL_TYPE:d.MONEY_CHANNEL_TYPE,
            MONEY_CHANNEL_TYPE_THA:d.MONEY_CHANNEL_TYPE_THA,
        };
        this.formPopupOther = {
            disableBankOrgList:true,
            disableBankOrgStationList:true,
        };

    }
    async CaseMoneyEditData(type, data = {} as any, index = null){
        this.isLoading = true;
        if (data.MONEY_CHANNEL_TYPE === "T") {
            await this.SetdataCaseMoney(data);
        }
        this.popupType = 'edit';
        this.popupCaseMoney = true;
        this.popupIndex = index;
        this.formPopup = {};
        this.formPopup = data;
        this.formPopupOther = {};
        this.popupCaseMoneyDamageBuffer = data.DAMAGE_VALUE ?? 0;
        this.isLoading = false;
        // setTimeout(()=>{
        //     this.formBank.instance._refresh();
        //     this.formPopup = {};
        //     this.formPopup = data;
        //     this.popupCaseMoneyDamageBuffer = data.DAMAGE_VALUE ?? 0;
        //     this.isLoading = false;
        // }, 1000);

    }
    async SetdataCaseMoney(data){
        if (data.BANK_ID) {
            this.bankOrgList = await this.servBankInfo.GetBankOrg(data.BANK_ID).toPromise();
        }
        if (data.BRANCH_BANK_ID) {
            this.bankOrgStationList = await this.servBankInfo.GetBankOrgStation(data.BRANCH_BANK_ID).toPromise();
        }
        // this.servBankInfo
        // .GetBankOrg(data.BRANCH_BANK_ID)
        // .subscribe((_) => {
        //     this.bankOrgList = _;
        // });
        // console.log('this.formPopup.BANK_LOCATION_RESPONSIBILITY_2',data.BANK_LOCATION_RESPONSIBILITY_2);
        // if (data.BANK_LOCATION_RESPONSIBILITY_2) {
        //     this.formPopup.BRANCH_BANK_ID = null;
        //     this.servBankInfo
        //         .GetBankOrgStation(data.BANK_LOCATION_RESPONSIBILITY_2)
        //         .subscribe((_) => {
        //             this.bankOrgStationList = _;
        //             this.formPopup.BRANCH_BANK_ID = data.BANK_LOCATION_RESPONSIBILITY_2;
        //         });
        // }

    }
    CaseMoneyDeleteData(index = null) {
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
                this.SumDamageValue(this.formData.CASE_MONEY[index].DAMAGE_VALUE,'remove');
                this.formData.CASE_MONEY.splice(index, 1);
                this.CaseMoneyClose();
            }
        });
    }
    CaseMoneyClose(){
        this.isLoading = true;
        this.popupCaseMoney = false;

        this.formBank.instance._refresh();
        this.formPopup = {};
        this.popupCaseMoneyDamageBuffer = 0;
        this.isLoading = false;

    }

    CaseMoneySave(){
        if (!this.formBank.instance.validate().isValid) {
            this.ShowInvalidDialog();
            return;
        }

        const d = this.formPopup;
        const searchBankInfo = this.listBankAccount.filter(r => r.MONEY_CHANNEL_TYPE === d.MONEY_CHANNEL_TYPE);
        const bankInfo = searchBankInfo[0] ?? this.listBankAccount[0];

        // if (this.popupType === 'add') {
        //     this.formData.CASE_MONEY.push({
        //         MONEY_CHANNEL_TYPE: d.MONEY_CHANNEL_TYPE,
        //         MONEY_CHANNEL_TYPE_THA: bankInfo.MONEY_CHANNEL_TYPE_THA,
        //         BANK_ACCOUNT_LABEL: this.BankAccountText(),
        //         BANK_ACCOUNT: d.BANK_ACCOUNT,
        //         BANK_ID: d.BANK_ID,
        //         DATE_TRANSFER: d.DATE_TRANSFER,
        //         DAMAGE_VALUE: d.DAMAGE_VALUE,
        //         TRANSFER_DISTRICT_ID: d.TRANSFER_DISTRICT_ID,
        //         BRANCH_BANK_ID: d.BRANCH_BANK_ID,
        //         BANK_LOCATION_RESPONSIBILITY_2: d.BANK_LOCATION_RESPONSIBILITY_2,
        //         BANK_NAME_FULL: this.ConcatText([d.BANK_FIRSTNAME?? "",d.BANK_LASTNAME?? ""]),
        //         BANK_FIRSTNAME: d.BANK_FIRSTNAME,
        //         BANK_LASTNAME: d.BANK_LASTNAME
        //     });
        //     this.SumDamageValue(d.DAMAGE_VALUE,'sum');

        // }else{
        //     this.formData.CASE_MONEY[this.popupIndex] = {
        //         MONEY_CHANNEL_TYPE: d.MONEY_CHANNEL_TYPE,
        //         MONEY_CHANNEL_TYPE_THA: bankInfo.MONEY_CHANNEL_TYPE_THA,
        //         BANK_ACCOUNT_LABEL: this.BankAccountText(),
        //         BANK_ACCOUNT: d.BANK_ACCOUNT,
        //         BANK_ID: d.BANK_ID,
        //         DATE_TRANSFER: d.DATE_TRANSFER,
        //         DAMAGE_VALUE: d.DAMAGE_VALUE,
        //         TRANSFER_DISTRICT_ID: d.TRANSFER_DISTRICT_ID,
        //         BRANCH_BANK_ID: d.BRANCH_BANK_ID,
        //         BANK_LOCATION_RESPONSIBILITY_2: d.BANK_LOCATION_RESPONSIBILITY_2,
        //         BANK_NAME_FULL: this.ConcatText([d.BANK_FIRSTNAME ?? "",d.BANK_LASTNAME ?? ""]),
        //         BANK_FIRSTNAME: d.BANK_FIRSTNAME,
        //         BANK_LASTNAME: d.BANK_LASTNAME
        //     };

        //     this.SumDamageValue(this.popupCaseMoneyDamageBuffer,'remove');
        //     this.SumDamageValue(d.DAMAGE_VALUE,'sum');
        // }

        const data = this.formPopup;
        data.MONEY_CHANNEL_TYPE_THA = bankInfo.MONEY_CHANNEL_TYPE_THA;
        data.BANK_ACCOUNT_LABEL = this.BankAccountText();
        data.BANK_NAME_FULL = this.ConcatText([d.BANK_FIRSTNAME ?? "",d.BANK_LASTNAME ?? ""]);

        const setData = {};
        for (const key in data) {
            if (data[key] !== null && data[key] !== undefined) {
                setData[key] = data[key];
            }
        }
        if (this.popupType === 'add') {
            this.formData.CASE_MONEY.push(setData);
            this.SumDamageValue(d.DAMAGE_VALUE,'sum');

        }else{
            this.formData.CASE_MONEY[this.popupIndex] = setData;
            this.SumDamageValue(this.popupCaseMoneyDamageBuffer,'remove');
            this.SumDamageValue(d.DAMAGE_VALUE,'sum');
        }

        // console.log('setData',setData);
        this.CaseMoneyClose();

    }

    SumDamageValue(num,type = 'sum'){
        const numfloat = parseFloat(num);
        if (num > 0) {
            const SumAll = parseFloat(this.formData.DAMAGE_VALUE_TOTAL1);
            if (type === 'sum') {
                this.formData.DAMAGE_VALUE_TOTAL1 = SumAll + numfloat;
            } else if (type === 'remove') {
                this.formData.DAMAGE_VALUE_TOTAL1 = SumAll - numfloat;
            }
            this.formData.DAMAGE_VALUE_TOTAL1 = parseFloat(this.formData.DAMAGE_VALUE_TOTAL1).toFixed(2);
        }
    }
    ConcatText(_texts = []){
        let concatText = "";
        for (let index = 0; index < _texts.length; index++) {
            const spaceInput = index>0?" ":"";
            concatText+=spaceInput+_texts[index];
        }
        return concatText;
    }
    OnSelectMoneyType(e) {

        if (e.value) {
            // this.formPopup.MONEY_CHANNEL_TYPE = `${e.value}`;
            const data = this.selectMoneyType.instance.option("selectedItem");
            if (data) {
                this.formPopup.MONEY_CHANNEL_TYPE = data.MONEY_CHANNEL_TYPE;
                this.formPopup.MONEY_CHANNEL_TYPE_THA = data.MONEY_CHANNEL_TYPE_THA;
            }else{
                this.formPopup.MONEY_CHANNEL_TYPE = e.value;
            }
            this.formPopup.BANK_ACCOUNT = null;
        }
    }
    OnSelectBankAccount(e) {
        this.bankOrgList = [];
        this.formPopupOther.disableBankOrgList = true;
        this.bankOrgStationList = [];
        this.formPopupOther.disableBankOrgStationList = true;
        // delete this.formPopup.BRANCH_BANK_ID;
        // delete this.formPopup.BANK_LOCATION_RESPONSIBILITY_2;
        if (e.value) {
            if (this.formPopup.MONEY_CHANNEL_TYPE === "T") {
                const data = this.selectBankInfo.instance.option("selectedItem");
                if (data) {
                    this.formPopup.BANK_ID = data.BANK_ID;
                    this.formPopup.BANK_NAME = data.BANK_NAME;
                }else{
                    this.formPopup.BANK_ID = e.value;
                }
                this.formPopupOther.disableBankOrgList = false;
                this.servBankInfo
                    .GetBankOrg(e.value)
                    .subscribe((_) => (this.bankOrgList = _));
            }

        }
    }
    OnSelectBankOrg(e) {
        this.bankOrgStationList = [];
        this.formPopupOther.disableBankOrgStationList = true;
        if (e.value) {
            if (this.formPopup.MONEY_CHANNEL_TYPE === "T") {
                const data = this.selectBankOrgList.instance.option("selectedItem");
                if (data) {
                    this.formPopup.BRANCH_BANK_ID = data.ORGANIZE_BANK_ID;
                    this.formPopup.BRANCH_BANK_NAME = data.ASORGANIZE_BANK_BRANCH_NAME_FULL;
                }else{
                    this.formPopup.BRANCH_BANK_ID = e.value;
                }

                this.formPopupOther.disableBankOrgStationList = false;
                this.servBankInfo
                    .GetBankOrgStation(e.value)
                    .subscribe((_) => this.bankOrgStationList = _);
            }


        }
    }
    OnSelectBankLocation(e) {
        if (e.value && this.formPopup.MONEY_CHANNEL_TYPE === "T") {
            const data = this.selectBankLocation.instance.option("selectedItem");
            if (data) {
                this.formPopup.BANK_LOCATION_RESPONSIBILITY_2 = data.ORGANIZE_ID;
                this.formPopup.BANK_LOCATION_RESPONSIBILITY_2_NAME = data.ORGANIZE_NAME_THA;
            }else{
                this.formPopup.BANK_LOCATION_RESPONSIBILITY_2 = e.value;
            }

        }
    }
    OnSelectCoinCurrency(e) {
        if (e.value) {
            const data = this.selectCoinCurrency.instance.option("selectedItem");
            if (data) {
                this.formPopup.MONEY_CHENNEL_COIN_CURRENCY = data.MONEY_CHENNEL_COIN_CURRENCY;
                this.formPopup.MONEY_CHENNEL_COIN_CURRENCY_THA = data.MONEY_CHENNEL_COIN_CURRENCY_THA;
            }else{
                this.formPopup.MONEY_CHENNEL_COIN_CURRENCY = e.value;
            }

        }
    }
    // Location Start
    LocaltionProvince(e) {
        this.locationDistrict = [];
        this.locationSubDistrict = [];
        if (e.value) {
            const data = this.selectLocationProvince.instance.option("selectedItem");
            if (data) {
                this.formPopup.PROVINCE_LOCATION = data.PROVINCE_ID;
                this.formPopup.PROVINCE_LOCATION_NAME = data.PROVINCE_NAME_THA;
            }else{
                this.formPopup.PROVINCE_LOCATION = e.value;
            }
            this.serviceProvince
                .GetDistrictofProvince(e.value)
                .subscribe((_) => (this.locationDistrict = _));
        }
    }
    LocaltionDistrict(e) {
        this.locationSubDistrict = [];
        if (e.value) {
            const data = this.selectLocaltionDistrict.instance.option("selectedItem");
            if (data) {
                this.formPopup.DISTRICT_LOCATION = data.DISTRICT_ID;
                this.formPopup.DISTRICT_LOCATION_NAME = data.DISTRICT_NAME_THA;
            }else{
                this.formPopup.DISTRICT_LOCATION = e.value;
            }
            this.serviceDistrict
                .GetSubDistrictOfDistrict(e.value)
                .subscribe((_) => (this.locationSubDistrict = _));
        }
    }
    LocaltionSubDistrict(e) {
        if (e.value) {
            const data = this.selectLocationSubDistrict.instance.option("selectedItem");
            if (data) {
                this.formPopup.SUB_DISTRICE_LOCATION = data.SUB_DISTRICT_ID;
                this.formPopup.SUB_DISTRICE_LOCATION_NAME = data.SUB_DISTRICT_NAME_THA;
            }else{
                this.formPopup.SUB_DISTRICE_LOCATION = e.value;
            }

        }
    }
    OnSelectNearStation(e) {
        if (e.value) {
            const data = this.selectNearStation.instance.option("selectedItem");
            if (data) {
                this.formPopup.LOCATION_RESPONSIBILITY = data.ORGANIZE_ID;
                this.formPopup.LOCATION_RESPONSIBILITY_NAME = data.ORGANIZE_NAME_THA;
            }else{
                this.formPopup.LOCATION_RESPONSIBILITY = e.value;
            }

        }
    }
    LocationAddData(type = 1){
        this.popupType = 'add';
        this.popupLocation = true;
        this.formPopup = {};
        this.popupLocationType = type;
    }
    LocationEditData(type = 1, data = {} as any, index = null){
        const setData =  {};
        const keyType = `_${type}`;
        for (const key in data) {
            if (data[key] !== null && data[key] !== undefined) {
                const newKey = key.replace(keyType, '');
                setData[newKey] = data[key];

            }
        }
        // console.log('data',setData);
        this.popupType = 'edit';
        this.popupLocation = true;
        this.formPopup = setData;
        this.popupIndex = index;
        this.popupLocationType = type;
        if (this.formPopup.LOCATION_RESPONSIBILITY) {

            this.listNearStation.items().push({
                ORGANIZE_ID: this.formPopup.LOCATION_RESPONSIBILITY,
                ORGANIZE_NAME_THA: this.formPopup.LOCATION_RESPONSIBILITY_NAME,
            });
        }


    }
    LocationDeleteData(type = 1,index = null) {
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
                const keyType = `_${type}`;
                // this.formData[`LOCATION${keyType}`].push(setData);
                this.formData[`LOCATION${keyType}`].splice(index, 1);
                // this.formData.CASE_MONEY.splice(index, 1);
            }
        });
    }
    LocationSave(){
        if (!this.formLocation.instance.validate().isValid) {
            this.ShowInvalidDialog();
            return;
        }
        const keyType = `_${this.popupLocationType}`;
        const data = this.formPopup;
        const setData = {};
        for (const key in this.formPopup) {
            if (data[key] !== null && data[key] !== undefined) {
                setData[`${key}${keyType}`] = data[key];
            }
        }
        if (this.popupType === 'add') {
            this.formData[`LOCATION${keyType}`].push(setData);
        }else{
            this.formData[`LOCATION${keyType}`][this.popupIndex] = setData;
        }

        this.LocationClose();

    }
    LocationClose(){
        this.popupLocation = false;
        this.formPopup = {};
        this.formLocation.instance._refresh();
    }
    // Location End
    onToolbar(e) {
        e.toolbarOptions.items.unshift(
            {
                template: "addButton",
                location: "before"
            }
        );
    }
    Back(e){
        this.mainConponent.NextIndex(this.mainConponent.indexTab - 1);
    }
    SubmitForm(e) {
        this.mainConponent.MergeObj(this.formData);
        this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
    }
}
