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
import { BankInfoService } from "src/app/services/bank-info.service";
import { User } from "src/app/services/user";
import { IssueOnlineContainerComponent } from "../issue-online-container.component";
import { IssueOnlineFileUploadService } from "src/app/services/issue-online-file-upload.service";
import { UserSettingService } from "src/app/services/user-setting.service";
import { FormValidatorService } from "src/app/services/form-validator.service";
import { DatePipe } from '@angular/common';
import { ConvertDateService } from "src/app/services/convert-date.service";
import { FileService } from "src/app/services/file.service";
import { OnlineCaseService } from "src/app/services/online-case.service";

@Component({
    selector: "app-issue-online-villain",
    templateUrl: "./issue-online-villain.component.html",
    styleUrls: ["./issue-online-villain.component.scss"],
})
export class IssueOnlineVillainComponent implements OnInit {
    @ViewChild("formVillain1", { static: false }) formVillain1: DxFormComponent;
    @ViewChild("formVillain2", { static: false }) formVillain2: DxFormComponent;
    @ViewChild("formVillainAbout", { static: false }) formVillainAbout: DxFormComponent;
    @ViewChild("selectPresentProvice", { static: false }) selectPresentProvice: DxSelectBoxComponent;
    @ViewChild("selectPresentDistrict", { static: false }) selectPresentDistrict: DxSelectBoxComponent;
    @ViewChild("selectPresentSubDistrict", { static: false }) selectPresentSubDistrict: DxSelectBoxComponent;
    @ViewChild("selectPresentPostcode", { static: false }) selectPresentPostcode: DxSelectBoxComponent;
    @ViewChild("selectCaseChannel", { static: false }) selectCaseChannel: DxSelectBoxComponent;
    @ViewChild("formCaseChannel", { static: false }) formCaseChannel: DxFormComponent;
    @ViewChild("formMeetVillain", { static: false }) formMeetVillain: DxFormComponent;
    @ViewChild("formMeetVillain2", { static: false }) formMeetVillain2: DxFormComponent;

    public mainConponent: IssueOnlineContainerComponent;
    tablePaging = [10, 20, 50,'all'];
    criminalType = [
        {ID:1,TEXT:"เคยพบเจอคนร้าย"},
        {ID:2,TEXT:"ไม่เคยพบเจอคนร้าย"},
    ];
    caseLabelName = {
        text0:"ชื่อช่องทางติดต่อคนร้าย",
        text1:"ชื่อ Line คนร้าย",
        text2:"ชื่อ Facebook คนร้าย",
        text3:"ชื่อ INSTARGRAM คนร้าย",
        text4:"ชื่อ Website คนร้าย",
        text5:"ชื่อ E-mail คนร้าย",
        text6:"ชื่อ SMS คนร้าย",
        text8:"ชื่อช่องทางติดต่อคนร้าย",
    };
    caseLabelID = {
        text0:"ID ช่องทางติดต่อคนร้าย",
        text1:"Line ID",
        text2:"Facebook ID",
        text3:"INSTARGRAM URL",
        text4:"Website URL",
        text5:"E-mail",
        text6:"หมายเลข SMS คนร้าย",
        text8:"ID ช่องทางติดต่อคนร้าย",
    };
    serviceLabelID = [
        {ID:1,TEXT:"AIS"},
        {ID:2,TEXT:"TRUE"},
        {ID:3,TEXT:"DTAC"},
        {ID:4,TEXT:"NT (CAT TOT)"},
        {ID:5,TEXT:"อื่น ๆ"},
    ];
    typeLanguage = [
        {ID:1,TEXT:"ท่านเชื่อว่าสำนวนที่คนร้ายใช้ มาจากเครื่องมือแปลภาษาเช่น Google Translate"},
        {ID:2,TEXT:"ภาษาที่ใช้ในการสื่อสารกับคนร้าย (เลือกได้หลายข้อ)"},
    ];

    isLoading = false;
    personalInfo: any = {};
    formData: any = {};
    formCriminal: any = {};
    formMeetCriminal: any = {};
    defaultCriminalType = 1;
    presentAddress: any = {};
    province = [];
    listCaseChannel = [];
    uploadFileBufferStatus = true;
    uploadFileBuffer: any = {};
    uploadFileBufferList: any = [];
    uploadFileRefresh = true;
    formPopup: any = {};
    popupCriminal: any = {};
    formPopupvillain: any = {};
    testShow = false;
    popupCriminalData = false;
    popupCaseChannel = false;
    popupType = 'add';
    popupIndex = 0;
    listDocFile: any = [];
    listDocFilePhone: any = [];
    listDocFileSMS: any = [];
    listDocFileLINE: any = [];
    listDocFileFACEBOOK: any = [];
    listDocFileINSTARGRAM: any = [];
    listDocFileWEBSITE: any = [];
    listDocFileEMAIL: any = [];
    listDocFileTELEGRAM: any = [];
    listDocFileWHATAPP: any = [];
    listDocFileOTHERS: any = [];
    formDataUploadDoc: any = {};
    formChannelLanguage: any = {};
    listDocFileTWITTER: any = [];
    listDocFileMESSENGER: any = [];
    formType = "add";
    formReadOnly = false;
    formAddData = true;
    formValidate = true;
    showCaseLabelName ="";
    showcaseLabelID ="";
    showcaseCode ="";
    showcaseOption ="";
    popupViewFile = false;
    popupViewFileData: any = {};
    limitUploadFileSize = 0;
    limitCaseChanelSize = 0;
    formMeetVillainvalidate = true;
    formChannelValidate = true;
    validateLanguagePHONE = true;
    validateLanguageSMS = true;
    validateLanguageLINE = true;
    validateLanguageFACEBOOK = true;
    validateLanguageINSTARGRAM = true;
    validateLanguageWEBSITE = true;
    validateLanguageEMAIL = true;
    validateLanguageTELEGRAM = true;
    validateLanguageWHATAPP = true;
    validateLanguageTWITTER = true;
    validateLanguageMESSENGER = true;
    validateLanguageOTHERS = true;
    maxSizeBuffer = 0;
    showtext = '';
    showlanguage = '';
    maxDateValue:Date = new Date();

    dateLineStart: Date;
    dateFacebookStart: Date;
    dateInstargramStart: Date;
    dateTelegramStart: Date;
    dateWhatappStart: Date;
    dateTwitterStart: Date;
    dateMessengerStart: Date;

    dateLineEnd: Date;
    dateFacebookEnd: Date;
    dateInstargramEnd: Date;
    dateTelegramEnd: Date;
    dateWhatappEnd: Date;
    dateTwitterEnd: Date;
    dateMessengerEnd: Date;

    datePhone: Date;
    dateSMS: Date;
    dateWebsite: Date;
    dateEmail: Date;
    dateOther: Date;
    minBirthDate: Date;
    maxBirthDate: Date;
    languageChannel : any;

    defaultLanguagePhoneType = 2;
    defaultLanguageSmsType = 2;
    defaultLanguageLineType = 2;
    defaultLanguageFacebookType = 2;
    defaultLanguageMessengerType = 2;
    defaultLanguageInstargramType = 2;
    defaultLanguageTelegramType = 2;
    defaultLanguageWhatsappType = 2;
    defaultLanguageTwitterType = 2;
    defaultLanguageWebsiteType = 2;
    defaultLanguageEmailType = 2;
    defaultLanguageOtherType = 2;

    formChannelPhone: any = {};
    formChannelSMS: any = {};
    formChannelLINE: any = {};
    formChannelFACEBOOK: any = {};
    formChannelINSTARGRAM: any = {};
    formChannelWEBSITE: any = {};
    formChannelEMAIL: any = {};
    formChannelTELEGRAM: any = {};
    formChannelWHATAPP: any = {};
    formChannelOTHERS: any = {};
    formChannelTWITTER: any = {};
    formChannelMESSENGER: any = {};
    fileChannel : any;

    constructor(
        private servicePersonal: PersonalService,
        private serviceProvince: ProvinceService,
        private serviceDistrict: DistrictService,
        private serviceSubDistrict: SubdistrictService,
        private servBankInfo: BankInfoService,
        private _issueFile: IssueOnlineFileUploadService,
        private _formValidate: FormValidatorService,
        private _date: ConvertDateService,
        private datePipe: DatePipe,
        private _fileService :FileService,
        private _OnlineCaseService: OnlineCaseService,
    ) {
        this.onReorder = this.onReorder.bind(this);
    }

    ngOnInit(): void {
        this.maxDateValue.setHours(this.maxDateValue.getHours() + 1);
        const userId = User.Current.PersonalId;
        this.isLoading = true;
        this.uploadFileBufferList = [];
        // this.servicePersonal
        //     .GetPersonalById(userId)
        //     .subscribe((_) => {
        //         this.personalInfo = _;
        //         this.SetDefault();
        //     });
        setTimeout(async () => {
            this.SetDefault();
        }, 1000);

    }
    async SetDefault(){
        try{
            this.uploadFileBufferStatus = false;
            this.province = this.mainConponent.province;
            // this.listCaseChannel  = await this.servBankInfo.GetCaseChannel().toPromise();
            this.minBirthDate = this._date.SetDateDefault(80, true, true, true);
            this.maxBirthDate = this._date.SetDateDefault(0);
            // this.servBankInfo.GetCaseChannel().subscribe((_) => (this.listCaseChannel = _));
            if (this.mainConponent.formType === 'add') {
                localStorage.setItem("form-index","5");
                if(localStorage.getItem("form-villain")){
                    this.formData = JSON.parse(localStorage.getItem("form-villain"));
                    this.formMeetCriminal = this.formData.CASE_CRIMINAL_MEET[0] ?? [];
                    this.formCriminal = this.formData.CASE_CRIMINAL ?? [];
                    this.formPopupvillain = this.formData.CASE_CHANNEL ?? [];
                    this.defaultCriminalType = this.formData.CRIMINAL === 'Y'? 1 : 2;
                    // console.log(this.formData);
                }else{
                    this.formMeetCriminal.CASE_CRIMINAL_MEET_INPERSON = false;
                    this.formMeetCriminal.CASE_CRIMINAL_MEET_VDOCALL = false;
                    this.formMeetCriminal.CASE_CRIMINAL_MEET_WITHNESSEDPERSON = false;
                    this.formMeetCriminal.CASE_CRIMINAL_MEET_WITHNESSEDVDOCALL = false;
                    this.formMeetCriminal.CASE_CRIMINAL_MEET_SOCAIL = false;
                    this.formMeetCriminal.CASE_CRIMINAL_NOT_MEET = false;
                    this.formMeetCriminal.CASE_CRIMINAL_MEET_OTHER = false;

                    this.uploadFileBufferList = [];
                    this.formCriminal = {};
                    this.formData = {};
                    this.formData.CRIMINAL= 'Y';
                    this.formData.CASE_CRIMINAL = [];
                    this.formData.CASE_CRIMINAL_MEET = [];
                    this.formData.CASE_CHANNEL = [];
                    this.formPopupvillain.CASE_CHANNEL_LANGUAGE = [];
                }
                this.presentAddress.disableDistrict = true;
                this.presentAddress.disableSubDistrict = true;
                this.presentAddress.disablepostcode = true;

                this.formType = "add";
                this.formReadOnly = false;
                this.formAddData = true;
                this.formValidate = true;
            }else{
                this.formType = "edit";
                this.defaultCriminalType = 2;
                this.formReadOnly = true;
                this.formAddData = false;
                this.formValidate = false;

                const _case_id = Number(sessionStorage.getItem("case_id"));
                const _CASE_CHANNEL = await this._OnlineCaseService.Getcasechannel(_case_id).toPromise();
                this.uploadFileBufferList = [];
                this.formCriminal = {};
                this.formData = {};
                if(_CASE_CHANNEL){
                    this.formData = _CASE_CHANNEL;
                    if(_CASE_CHANNEL.CASE_CRIMINAL_MEET){
                        this.formMeetCriminal = _CASE_CHANNEL.CASE_CRIMINAL_MEET[0];
                        this.defaultCriminalType = 1;
                    }
                }
                if(this.formData.CASE_CHANNEL){
                    for(let i=0; i<this.formData.CASE_CHANNEL.length;i++){
                        const channelItem = this.formData.CASE_CHANNEL[i];
                        for (const prop in channelItem) {
                            if (channelItem[prop] === "0001-01-01T00:00:00") {
                              channelItem[prop] = null;
                            }
                            if (channelItem[prop] === null || channelItem[prop] === undefined) {
                              delete channelItem[prop];
                            }
                            if (typeof channelItem[prop] === "string") {
                              channelItem[prop] = channelItem[prop].includes("T00:00:00")
                                ? this.datePipe.transform(channelItem[prop], "yyyy-MM-dd")
                                : channelItem[prop];
                            }
                          }
                        let text = this.setDefaultShowTextChannel(channelItem);
                        channelItem.SHOW_TEXT = text.showtext_channel;
                        channelItem.CHANNEL_NAME = text.channel_name;
                        channelItem.CHANNEL_EMAIL_DOC = [];
                        channelItem.CHANNEL_FACEBOOK_DOC = [];
                        channelItem.CHANNEL_INSTARGRAM_DOC = [];
                        channelItem.CHANNEL_LINE_DOC = [];
                        channelItem.CHANNEL_MESSENGER_DOC = [];
                        channelItem.CHANNEL_OTHERS_DOC = [];
                        channelItem.CHANNEL_PHONE_DOC = [];
                        channelItem.CHANNEL_SMS_DOC = [];
                        channelItem.CHANNEL_TELEGRAM_DOC = [];
                        channelItem.CHANNEL_TWITTER_DOC = [];
                        channelItem.CHANNEL_WEBSITE_DOC = [];
                        channelItem.CHANNEL_WHATAPP_DOC = [];
                        channelItem.CASE_CHANNEL_LANGUAGE = [];
                        if(this.formData.CASE_CHANNEL_LANGUAGE){
                            this.formData.CASE_CHANNEL_LANGUAGE.forEach(element => {
                                if(element.CASE_CHANNEL_ID == channelItem.CASE_CHANNEL_ID){
                                    channelItem.CASE_CHANNEL_LANGUAGE.push(element);
                                }
                            });
                            channelItem.CASE_CHANNEL_LANGUAGE = channelItem.CASE_CHANNEL_LANGUAGE.map(obj => {
                                const newObj = { ...obj };
                                delete newObj.CASE_CHANNEL_ID;
                                delete newObj.CHANNEL_LANGUAGE_ID;
                                delete newObj.CREATE_DATE;
                                delete newObj.CREATE_USER_ID;
                                delete newObj.DEL_FLAG;
                                delete newObj.RECORD_STATUS;
                                delete newObj.UPDATE_USER_ID;
                                delete newObj.UPDATE_DATE;
                                return newObj;
                              });
                            if(channelItem.CASE_CHANNEL_LANGUAGE){
                                channelItem.SHOW_LANGUAGE = this.setDefaultShowTextLanguage(channelItem.CASE_CHANNEL_LANGUAGE[0]);
                            }
                        }
                        this.fileChannel = await this._fileService.getChannelFile(channelItem.CASE_CHANNEL_ID).toPromise();
                        if(this.fileChannel){
                            this.fileChannel.forEach(element => {
                                switch (element.typeChannel){
                                    case "email" : channelItem.CHANNEL_EMAIL_DOC.push(element); break;
                                    case "facebook" : channelItem.CHANNEL_FACEBOOK_DOC.push(element); break;
                                    case "instargram" : channelItem.CHANNEL_INSTARGRAM_DOC.push(element); break;
                                    case "line" : channelItem.CHANNEL_LINE_DOC.push(element); break;
                                    case "messenger" : channelItem.CHANNEL_MESSENGER_DOC.push(element); break;
                                    case "others" : channelItem.CHANNEL_OTHERS_DOC.push(element); break;
                                    case "phone" : channelItem.CHANNEL_PHONE_DOC.push(element); break;
                                    case "sms" : channelItem.CHANNEL_SMS_DOC.push(element); break;
                                    case "telegram" : channelItem.CHANNEL_TELEGRAM_DOC.push(element); break;
                                    case "twitter" : channelItem.CHANNEL_TWITTER_DOC.push(element); break;
                                    case "website" : channelItem.CHANNEL_WEBSITE_DOC.push(element); break;
                                    case "whatsapp" : channelItem.CHANNEL_WHATAPP_DOC.push(element); break;
                                }
                            });
                        }
                        delete channelItem.CREATE_DATE;
                        delete channelItem.CREATE_USER_ID;
                        delete channelItem.CASE_CHANNEL_ID;
                        delete channelItem.CASE_ID;
                        delete channelItem.DEL_FLAG;
                        delete channelItem.RECORD_STATUS;
                        delete channelItem.UPDATE_USER_ID;
                    }
                }


            }

            this.isLoading = false;
        }catch (error){
            console.log(error);
            this.SetDefault();
        }
    }
    ChangeCriminal(e){
        if (e.value) {
            this.defaultCriminalType = e.value;
            this.formCriminal = {};
            this.uploadFileBufferList = [];
            this.formData.CRIMINAL = e.value === 1 ?'Y':'N';
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
    // LoadData(type = null){
    //     this.uploadFileBufferStatus = false;
    //     this.serviceProvince.GetProvince().subscribe((_) => (this.province = _));
    //     this.servBankInfo.GetCaseChannel().subscribe((_) => (this.listCaseChannel = _));
    //     if (this.mainConponent.formType === 'add') {
    //         this.uploadFileBufferList = [];
    //         if (type === 'OnInit'){
    //             this.formData.CRIMINAL = 'Y';
    //         }else{
    //             this.formData = {};
    //         }
    //     }else{
    //         this.formData = this.mainConponent.formDataInsert;
    //     }
    // }
    OnSelectProvicePresent(e) {
        this.presentAddress.district = [];
        this.presentAddress.subDistrict = [];
        this.presentAddress.postcode = [];
        this.presentAddress.disableDistrict = true;
        this.presentAddress.disablepostcode = true;
        this.presentAddress.disableSubDistrict = true;

        if (e.value) {
            const data = this.selectPresentProvice.instance.option("selectedItem");
            if (data) {
                this.formCriminal.CASE_CRIMINAL_PROVINCE_ID = data.PROVINCE_ID;
                this.formCriminal.CASE_CRIMINAL_PROVINCE_NAME_THA = data.PROVINCE_NAME_THA;
            }else{
                this.formCriminal.CASE_CRIMINAL_PROVINCE_ID = e.value;
            }


            this.serviceProvince
                .GetDistrictofProvince(e.value)
                .subscribe((_) => {
                    this.presentAddress.district = _;
                    this.presentAddress.disableDistrict = false;

                });
        }
    }
    OnSelectDistrictPresent(e) {
        this.presentAddress.subDistrict = [];
        this.presentAddress.postcode = [];
        this.presentAddress.disableSubDistrict = true;
        this.presentAddress.disablepostcode = true;
        if (e.value) {
            const data = this.selectPresentDistrict.instance.option("selectedItem");
            if (data) {
                this.formCriminal.CASE_CRIMINAL_DISTRICT_ID = data.DISTRICT_ID;
                this.formCriminal.CASE_CRIMINAL_DISTRICT_NAME_THA = data.DISTRICT_NAME_THA;
            }else{
                this.formCriminal.CASE_CRIMINAL_DISTRICT_ID = e.value;
            }



            this.serviceDistrict
                .GetSubDistrictOfDistrict(e.value)
                .subscribe((_) =>{
                    this.presentAddress.subDistrict = _;
                    this.presentAddress.disableSubDistrict = false;
                });
        }
    }

    OnSelectSubDistrictPresent(e) {
        this.presentAddress.postcode = [];
        if (e.value) {
            const data = this.selectPresentSubDistrict.instance.option("selectedItem");
            if (data) {
                this.formCriminal.CASE_CRIMINAL_SUB_DISTRICT_ID = data.SUB_DISTRICT_ID;
                this.formCriminal.CASE_CRIMINAL_SUB_DISTRICT_NAME_THA = data.SUB_DISTRICT_NAME_THA;
            }else{
                this.formCriminal.CASE_CRIMINAL_SUB_DISTRICT_ID = e.value;
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
                this.formCriminal.CASE_CRIMINAL_POSTCODE_ID = data.POSTCODE_ID;
                this.formCriminal.CASE_CRIMINAL_POSTCODE_CODE = data.POSTCODE_CODE;
            }else{
                this.formCriminal.CASE_CRIMINAL_POSTCODE_ID = e.value;
            }

        }
    }
    // UPLOAD ZONE
    BytesToSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) {
            return '0 Byte';
        }
        const data: any = Math.floor(Math.log(bytes) / Math.log(1024));
        const i = parseInt(data, 10);
        return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
    }
    // async uploadFile(uploadTag) {
    //     const files: FileList = uploadTag.files;
    //     if (files.length > 0) {
    //         const checkAllow = this._issueFile.CheckFileUploadClick(files);
    //         if (checkAllow){
    //             this.uploadFileRefresh = false;
    //             this.isLoading = true;
    //             // eslint-disable-next-line @typescript-eslint/prefer-for-of
    //             for (let index = 0; index < files.length; index++) {
    //                 const item = files[index];
    //                 await this.uploadFileConvertBase64(item);
    //             }
    //             this.isLoading = false;
    //             this.uploadFileRefresh = true;
    //             // console.log('files',files);
    //         }


    //     }
    // }
    // async filesDropped(e) {
    //     this.uploadFileRefresh = false;
    //     const files = e;
    //     if (files.length > 0) {
    //         // this.ConvertBase64(files[0].file);
    //         const checkAllow = this._issueFile.CheckFileUploadDrop(files);
    //         if (checkAllow){
    //             this.isLoading = true;
    //             // eslint-disable-next-line @typescript-eslint/prefer-for-of
    //             for (let index = 0; index < files.length; index++) {
    //                 const item = files[index].file;
    //                 await this.uploadFileConvertBase64(item);
    //             }
    //             this.isLoading = false;
    //             this.uploadFileRefresh = true;
    //         }



    //     }
    // }

    async uploadFile(uploadTag) {
        const files: any = uploadTag.files;
        if (files.length > 0) {
            this.isLoading = true;
            const fileCheck = await this._issueFile.CheckFileUploadAllowListSizeDialog(this.limitUploadFileSize,files);

            if (fileCheck.status){
                this.limitUploadFileSize = fileCheck.uploadSizeAll ?? 0;
                for (const item of fileCheck.filebase64Array) {
                    this.uploadFileBufferList.push(item);
                }
            }
            this.isLoading = false;

        }
    }
    async filesDropped(e) {
        const files = e;
        if (files.length > 0) {
            this.isLoading = true;
            const fileCheck = await this._issueFile.CheckFileUploadAllowListSizeDrop(this.limitUploadFileSize,files);

            if (fileCheck.status){
                this.limitUploadFileSize = fileCheck.uploadSizeAll ?? 0;
                for (const item of fileCheck.filebase64Array) {
                    this.uploadFileBufferList.push(item);
                }
            }
            this.isLoading = false;
        }
    }
    async uploadFileConvertBase64(file){
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            let base64File = {} as any;
            base64File = reader.result;
            const item = {
                storage:"base64",
                name:"file",
                url:base64File,
                size:file.size,
                sizeDetail:this.BytesToSize(file.size),
                type:file.type,
                originalName:file.name,
            };
            this.uploadFileBufferList.push(item);
            return ;

        };
        return ;
    }

    async ConvertBase64(file){
        // console.log('file',file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            let base64File = {} as any;
            base64File = reader.result;
            this.uploadFileBuffer = {
                storage:"base64",
                name:"file",
                url:base64File,
                size:file.size,
                sizeDetail:this.BytesToSize(file.size),
                type:file.type,
                originalName:file.name,
            };
            this.uploadFileBufferStatus = true;
            // this.formData.BANK_DETAIL.push(uploadFileBuffer);
            // console.log('datafile',{
            //     storage:"base64",
            //     name:"file",
            //     url:base64File,
            //     size:file.size,
            //     sizeDetail:this.BytesToSize(file.size),
            //     type:file.type,
            //     originalName:file.name,
            // });
        };
    }
    OpenFileDialog(uploadTag) {
        // e.event.stopPropagation();
        uploadTag.value = "";
        uploadTag.click();
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
    CheckHasFile(){
        const countItem = this.uploadFileBufferList.length ?? 0;
        if (countItem > 0){
            return true;
        }
        return false;
    }
    DeleteFileDocItemUpload(index = null){
        Swal.fire({
            title: 'ยืนยันการลบข้อมูล?',
            text: " ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#7d7d7d',
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'ตกลง'
        }).then((result) => {
            if (result.isConfirmed) {
                this.limitUploadFileSize -=  this.uploadFileBufferList[index].size ?? 0;
                this.uploadFileBufferList.splice(index, 1);
            }
        });
    }
    onReorder(e) {
        const visibleRows = e.component.getVisibleRows();
        const toIndex = this.uploadFileBufferList.indexOf(visibleRows[e.toIndex].data);
        const fromIndex = this.uploadFileBufferList.indexOf(e.itemData);
        this.uploadFileBufferList.splice(fromIndex, 1);
        this.uploadFileBufferList.splice(toIndex, 0, e.itemData);
        // console.log('new list ->>>',this.uploadFileBufferList);
    }
    // UPLOAD ZONE END

    // POPUP VILLANIN START
    CriminalAddData(){
        this.popupType = 'add';
        this.popupCriminalData = true;
        this.formCriminal = {};
    }

    // POPUP CASE CHANNEL START
    CaseChannelAddData(){
        this.popupType = 'add';
        this.popupCaseChannel = true;
        this.formPopupvillain = {};
        this.formPopupvillain = {};
        this.formChannelPhone = {};
        this.formChannelSMS = {};
        this.formChannelLINE = {};
        this.formChannelFACEBOOK = {};
        this.formChannelINSTARGRAM = {};
        this.formChannelWEBSITE = {};
        this.formChannelEMAIL = {};
        this.formChannelTELEGRAM = {};
        this.formChannelWHATAPP = {};
        this.formChannelOTHERS = {};
        this.formChannelTWITTER = {};
        this.formChannelMESSENGER = {};
        this.formPopupvillain.CHANEL_PHONE = false;
        this.formPopupvillain.CHANEL_SMS = false;
        this.formPopupvillain.CHANEL_LINE = false;
        this.formPopupvillain.CHANEL_FACEBOOK = false;
        this.formPopupvillain.CHANEL_INSTARGRAM = false;
        this.formPopupvillain.CHANEL_WEBSITE = false;
        this.formPopupvillain.CHANEL_EMAIL = false;
        this.formPopupvillain.CHANEL_TELEGRAM = false;
        this.formPopupvillain.CHANEL_WHATAPP = false;
        this.formPopupvillain.CHANEL_TWITTER = false;
        this.formPopupvillain.CHANEL_MESSENGER = false;
        this.formPopupvillain.CHANEL_OTHERS = false;
        this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_THAI = false;
        this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_ENG = false;
        this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_CHINESS = false;
        this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_JAPAN = false;
        this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_KOREAN = false;
        this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_OTHER = false;
        this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
        this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_THAI = false;
        this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_ENG = false;
        this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_CHINESS = false;
        this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_JAPAN = false;
        this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_KOREAN = false;
        this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_OTHER = false;
        this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
        this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_THAI = false;
        this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_ENG = false;
        this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_CHINESS = false;
        this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_JAPAN = false;
        this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_KOREAN = false;
        this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_OTHER = false;
        this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
        this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_THAI = false;
        this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_ENG = false;
        this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_CHINESS = false;
        this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_JAPAN = false;
        this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_KOREAN = false;
        this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_OTHER = false;
        this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
        this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_THAI = false;
        this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_ENG = false;
        this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_CHINESS = false;
        this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_JAPAN = false;
        this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_KOREAN = false;
        this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_OTHER = false;
        this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
        this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_THAI = false;
        this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_ENG = false;
        this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_CHINESS = false;
        this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_JAPAN = false;
        this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_KOREAN = false;
        this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_OTHER = false;
        this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
        this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_THAI = false;
        this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_ENG = false;
        this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_CHINESS = false;
        this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_JAPAN = false;
        this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_KOREAN = false;
        this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_OTHER = false;
        this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
        this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_THAI = false;
        this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_ENG = false;
        this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_CHINESS = false;
        this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_JAPAN = false;
        this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_KOREAN = false;
        this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_OTHER = false;
        this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
        this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_THAI = false;
        this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_ENG = false;
        this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_CHINESS = false;
        this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_JAPAN = false;
        this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_KOREAN = false;
        this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_OTHER = false;
        this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
        this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_THAI = false;
        this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_ENG = false;
        this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_CHINESS = false;
        this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_JAPAN = false;
        this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_KOREAN = false;
        this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_OTHER = false;
        this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
        this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_THAI = false;
        this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_ENG = false;
        this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_CHINESS = false;
        this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_JAPAN = false;
        this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_KOREAN = false;
        this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_OTHER = false;
        this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
        this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_THAI = false;
        this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_ENG = false;
        this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_CHINESS = false;
        this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_JAPAN = false;
        this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_KOREAN = false;
        this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_OTHER = false;
        this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
        this.formPopupvillain.CASE_CHANNEL_LANGUAGE = [];
        this.listDocFilePhone = [];
        this.listDocFileSMS = [];
        this.listDocFileLINE = [];
        this.listDocFileFACEBOOK = [];
        this.listDocFileINSTARGRAM = [];
        this.listDocFileWEBSITE = [];
        this.listDocFileEMAIL = [];
        this.listDocFileTELEGRAM = [];
        this.listDocFileWHATAPP = [];
        this.listDocFileTWITTER = [];
        this.listDocFileMESSENGER = [];
        this.listDocFileOTHERS = [];
        this.defaultLanguagePhoneType = 2;
        this.defaultLanguageSmsType = 2;
        this.defaultLanguageLineType = 2;
        this.defaultLanguageFacebookType = 2;
        this.defaultLanguageMessengerType = 2;
        this.defaultLanguageInstargramType = 2;
        this.defaultLanguageTelegramType = 2;
        this.defaultLanguageWhatsappType = 2;
        this.defaultLanguageTwitterType = 2;
        this.defaultLanguageWebsiteType = 2;
        this.defaultLanguageEmailType = 2;
        this.defaultLanguageOtherType = 2;
        this.maxSizeBuffer = this.limitCaseChanelSize ?? 0;
        this.SelectTypeChanel();
    }
    async CaseChannelSetDoc(data: any = [] , type){
        this.listDocFilePhone = type == "phone" ? data.CHANNEL_PHONE_DOC ?? []:this.listDocFilePhone;
        this.listDocFileSMS = type == "sms" ? data.CHANNEL_SMS_DOC ?? []:this.listDocFileSMS;
        this.listDocFileLINE = type == "line" ? data.CHANNEL_LINE_DOC ?? []:this.listDocFileLINE;
        this.listDocFileFACEBOOK = type == "facebook" ? data.CHANNEL_FACEBOOK_DOC ?? []:this.listDocFileFACEBOOK;
        this.listDocFileINSTARGRAM = type == "instargram" ? data.CHANNEL_INSTARGRAM_DOC ?? []:this.listDocFileINSTARGRAM;
        this.listDocFileWEBSITE = type == "website" ? data.CHANNEL_WEBSITE_DOC ?? []:this.listDocFileWEBSITE;
        this.listDocFileEMAIL = type == "email" ? data.CHANNEL_EMAIL_DOC ?? []:this.listDocFileEMAIL;
        this.listDocFileTELEGRAM = type == "telegram" ? data.CHANNEL_TELEGRAM_DOC ?? []:this.listDocFileTELEGRAM;
        this.listDocFileWHATAPP = type == "whatsapp" ? data.CHANNEL_WHATAPP_DOC ?? []:this.listDocFileWHATAPP;
        this.listDocFileOTHERS = type == "twitter" ? data.CHANNEL_TWITTER_DOC ?? []:this.listDocFileOTHERS;
        this.listDocFileTWITTER = type == "messenger" ? data.CHANNEL_MESSENGER_DOC ?? []:this.listDocFileTWITTER;
        this.listDocFileMESSENGER = type == "others" ? data.CHANNEL_OTHERS_DOC ?? []:this.listDocFileMESSENGER;
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            switch (type){
                case 'phone':
                        this.listDocFilePhone.push(item);
                        break;
                case 'sms':
                        this.listDocFileSMS.push(item);
                        break;
                case 'line':
                        this.listDocFileLINE.push(item);
                        break;
                case 'facebook':
                        this.listDocFileFACEBOOK.push(item);
                        break;
                case 'instargram':
                        this.listDocFileINSTARGRAM.push(item);
                        break;
                case 'website':
                        this.listDocFileWEBSITE.push(item);
                        break;
                case 'email':
                        this.listDocFileEMAIL.push(item);
                        break;
                case 'telegram':
                        this.listDocFileTELEGRAM.push(item);
                        break;
                case 'whatsapp':
                        this.listDocFileWHATAPP.push(item);
                        break;
                case 'twitter':
                        this.listDocFileOTHERS.push(item);
                        break;
                case 'messenger':
                        this.listDocFileTWITTER.push(item);
                        break;
                case 'others':
                        this.listDocFileMESSENGER.push(item);
                        break;
            }
        }
        return ;
    }
    async CaseChannelEditData(type, data = {} as any, index = null){
        this.isLoading = true;
        this.popupType = 'edit';
        this.popupCaseChannel = true;
        this.popupIndex = index;
        this.formPopupvillain = {};
        this.formChannelLanguage = {};
        const setData = {};
        const d = data;
        for (const key in d) {
            if (d[key] !== null && d[key] !== undefined) {
                if (key === 'CHANNEL_PHONE_DOC'){
                    await this.CaseChannelSetDoc(d[key],'phone');
                }if (key === 'CHANNEL_SMS_DOC'){
                    await this.CaseChannelSetDoc(d[key],'sms');
                }if (key === 'CHANNEL_LINE_DOC'){
                    await this.CaseChannelSetDoc(d[key],'line');
                }if (key === 'CHANNEL_FACEBOOK_DOC'){
                    await this.CaseChannelSetDoc(d[key],'facebook');
                }if (key === 'CHANNEL_INSTARGRAM_DOC'){
                    await this.CaseChannelSetDoc(d[key],'instargram');
                }if (key === 'CHANNEL_WEBSITE_DOC'){
                    await this.CaseChannelSetDoc(d[key],'website');
                }if (key === 'CHANNEL_EMAIL_DOC'){
                    await this.CaseChannelSetDoc(d[key],'email');
                }if (key === 'CHANNEL_TELEGRAM_DOC'){
                    await this.CaseChannelSetDoc(d[key],'telegram');
                }if (key === 'CHANNEL_WHATAPP_DOC'){
                    await this.CaseChannelSetDoc(d[key],'whatsapp');
                }if (key === 'CHANNEL_TWITTER_DOC'){
                    await this.CaseChannelSetDoc(d[key],'twitter');
                }if (key === 'CHANNEL_MESSENGER_DOC'){
                    await this.CaseChannelSetDoc(d[key],'messenger');
                }if (key === 'CHANNEL_OTHERS_DOC'){
                    await this.CaseChannelSetDoc(d[key],'others');
                }else{
                    if(key === 'CASE_CHANNEL_LANGUAGE'){
                        this.formChannelLanguage = d[key][0];
                    }
                    setData[key] = d[key];
                }
            }
        }
        this.formPopupvillain = setData;
        for (const prop in this.formPopupvillain) {
            if (this.formPopupvillain[prop] === "0001-01-01T00:00:00") {
               this.formPopupvillain[prop] = null;
            }
            if(typeof(this.formPopupvillain[prop]) == "string"){
                this.formPopupvillain[prop] = this.formPopupvillain[prop][10] == 'T' && this.formPopupvillain[prop][11] == '0' ? this.formPopupvillain[prop].substring(0, this.formPopupvillain[prop].indexOf('T')) : this.formPopupvillain[prop];
            }
        }
        if(this.formPopupvillain.CHANEL_LINE && this.formPopupvillain.CASE_CHANNEL_LINE_DATE_START != null){
            const dateStart = this.convertDate(this.formPopupvillain.CASE_CHANNEL_LINE_DATE_START,this.formPopupvillain.CASE_CHANNEL_LINE_TIME_START);
            this.dateLineStart = new Date(dateStart[0],dateStart[1],dateStart[2],dateStart[3],dateStart[4],dateStart[5]);
            const dateEnd = this.convertDate(this.formPopupvillain.CASE_CHANNEL_LINE_DATE_END,this.formPopupvillain.CASE_CHANNEL_LINE_TIME_END);
            this.dateLineEnd = new Date(dateEnd[0],dateEnd[1],dateEnd[2],dateEnd[3],dateEnd[4],dateEnd[5]);
        }
        if(this.formPopupvillain.CHANEL_FACEBOOK && this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DATE_START != null){
            const dateStart = this.convertDate(this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DATE_START,this.formPopupvillain.CASE_CHANNEL_FACEBOOK_TIME_START);
            this.dateFacebookStart = new Date(dateStart[0],dateStart[1],dateStart[2],dateStart[3],dateStart[4],dateStart[5]);
            const dateEnd = this.convertDate(this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DATE_END,this.formPopupvillain.CASE_CHANNEL_FACEBOOK_TIME_END);
            this.dateFacebookEnd = new Date(dateEnd[0],dateEnd[1],dateEnd[2],dateEnd[3],dateEnd[4],dateEnd[5]);
        }
        if(this.formPopupvillain.CHANEL_MESSENGER && this.formPopupvillain.CASE_CHANNEL_MESSENGER_DATE_START != null){
            const dateStart = this.convertDate(this.formPopupvillain.CASE_CHANNEL_MESSENGER_DATE_START,this.formPopupvillain.CASE_CHANNEL_MESSENGER_TIME_START);
            this.dateMessengerStart = new Date(dateStart[0],dateStart[1],dateStart[2],dateStart[3],dateStart[4],dateStart[5]);
            const dateEnd = this.convertDate(this.formPopupvillain.CASE_CHANNEL_MESSENGER_DATE_END,this.formPopupvillain.CASE_CHANNEL_MESSENGER_TIME_END);
            this.dateMessengerEnd = new Date(dateEnd[0],dateEnd[1],dateEnd[2],dateEnd[3],dateEnd[4],dateEnd[5]);
        }
        if(this.formPopupvillain.CHANEL_INSTARGRAM && this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DATE_START != null){
            const dateStart = this.convertDate(this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DATE_START,this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_TIME_START);
            this.dateInstargramStart = new Date(dateStart[0],dateStart[1],dateStart[2],dateStart[3],dateStart[4],dateStart[5]);
            const dateEnd = this.convertDate(this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DATE_END,this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_TIME_END);
            this.dateInstargramEnd = new Date(dateEnd[0],dateEnd[1],dateEnd[2],dateEnd[3],dateEnd[4],dateEnd[5]);
        }
        if(this.formPopupvillain.CHANEL_TELEGRAM && this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DATE_START != null){
            const dateStart = this.convertDate(this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DATE_START,this.formPopupvillain.CASE_CHANNEL_TELEGRAM_TIME_START);
            this.dateTelegramStart = new Date(dateStart[0],dateStart[1],dateStart[2],dateStart[3],dateStart[4],dateStart[5]);
            const dateEnd = this.convertDate(this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DATE_END,this.formPopupvillain.CASE_CHANNEL_TELEGRAM_TIME_END);
            this.dateTelegramEnd = new Date(dateEnd[0],dateEnd[1],dateEnd[2],dateEnd[3],dateEnd[4],dateEnd[5]);
        }
        if(this.formPopupvillain.CHANEL_WHATAPP && this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DATE_START != null){
            const dateStart = this.convertDate(this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DATE_START,this.formPopupvillain.CASE_CHANNEL_WHATSAPP_TIME_START);
            this.dateWhatappStart = new Date(dateStart[0],dateStart[1],dateStart[2],dateStart[3],dateStart[4],dateStart[5]);
            const dateEnd = this.convertDate(this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DATE_END,this.formPopupvillain.CASE_CHANNEL_WHATSAPP_TIME_END);
            this.dateWhatappEnd = new Date(dateEnd[0],dateEnd[1],dateEnd[2],dateEnd[3],dateEnd[4],dateEnd[5]);
        }
        if(this.formPopupvillain.CHANEL_TWITTER && this.formPopupvillain.CASE_CHANNEL_TWITTER_DATE_START != null){
            const dateStart = this.convertDate(this.formPopupvillain.CASE_CHANNEL_TWITTER_DATE_START,this.formPopupvillain.CASE_CHANNEL_TWITTER_TIME_START);
            this.dateTwitterStart = new Date(dateStart[0],dateStart[1],dateStart[2],dateStart[3],dateStart[4],dateStart[5]);
            const dateEnd = this.convertDate(this.formPopupvillain.CASE_CHANNEL_TWITTER_DATE_END,this.formPopupvillain.CASE_CHANNEL_TWITTER_TIME_END);
            this.dateTwitterEnd = new Date(dateEnd[0],dateEnd[1],dateEnd[2],dateEnd[3],dateEnd[4],dateEnd[5]);
        }
        if(this.formPopupvillain.CHANEL_WEBSITE && this.formPopupvillain.CASE_CHANNEL_WEBSITE_DATE != null){
        const dateStart = this.convertDate(this.formPopupvillain.CASE_CHANNEL_WEBSITE_DATE,this.formPopupvillain.CASE_CHANNEL_WEBSITE_TIME);
        this.dateWebsite = new Date(dateStart[0],dateStart[1],dateStart[2],dateStart[3],dateStart[4],dateStart[5]);
        }
        if(this.formPopupvillain.CHANEL_EMAIL && this.formPopupvillain.CASE_CHANNEL_EMAIL_DATE != null){
        const dateStart = this.convertDate(this.formPopupvillain.CASE_CHANNEL_EMAIL_DATE,this.formPopupvillain.CASE_CHANNEL_EMAIL_TIME);
        this.dateEmail = new Date(dateStart[0],dateStart[1],dateStart[2],dateStart[3],dateStart[4],dateStart[5]);
        }
        if(this.formPopupvillain.CHANEL_OTHERS && this.formPopupvillain.CASE_CHANNEL_OCHANEL_OTHERS_DATE != null){
        const dateStart = this.convertDate(this.formPopupvillain.CASE_CHANNEL_OCHANEL_OTHERS_DATE,this.formPopupvillain.CASE_CHANNEL_OCHANEL_OTHERS_TIME);
        this.dateOther = new Date(dateStart[0],dateStart[1],dateStart[2],dateStart[3],dateStart[4],dateStart[5]);
        }
        if(this.formPopupvillain.CHANEL_PHONE && this.formPopupvillain.CASE_CHANNEL_PHONE_DATE != null){
            const dateStart = this.convertDate(this.formPopupvillain.CASE_CHANNEL_PHONE_DATE,this.formPopupvillain.CASE_CHANNEL_PHONE_TIME);
            this.datePhone = new Date(dateStart[0],dateStart[1],dateStart[2],dateStart[3],dateStart[4],dateStart[5]);
        }
        if(this.formPopupvillain.CHANEL_SMS && this.formPopupvillain.CASE_CHANNEL_SMS_DATE != null){
            const dateStart = this.convertDate(this.formPopupvillain.CASE_CHANNEL_SMS_DATE,this.formPopupvillain.CASE_CHANNEL_SMS_TIME);
            this.dateSMS = new Date(dateStart[0],dateStart[1],dateStart[2],dateStart[3],dateStart[4],dateStart[5]);
        }

        this.defaultLanguagePhoneType = this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_FROMTRANSLATE ? 1 : 2;
        this.defaultLanguageSmsType = this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_FROMTRANSLATE ? 1 : 2;
        this.defaultLanguageLineType = this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_FROMTRANSLATE ? 1 : 2;
        this.defaultLanguageFacebookType = this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_FROMTRANSLATE ? 1 : 2;
        this.defaultLanguageMessengerType = this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_FROMTRANSLATE ? 1 : 2;
        this.defaultLanguageInstargramType = this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_FROMTRANSLATE ? 1 : 2;
        this.defaultLanguageTelegramType = this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_FROMTRANSLATE ? 1 : 2;
        this.defaultLanguageWhatsappType = this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_FROMTRANSLATE ? 1 : 2;
        this.defaultLanguageTwitterType = this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_FROMTRANSLATE ? 1 : 2;
        this.defaultLanguageWebsiteType = this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_FROMTRANSLATE ? 1 : 2;
        this.defaultLanguageEmailType = this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_FROMTRANSLATE ? 1 : 2;
        this.defaultLanguageOtherType = this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_FROMTRANSLATE ? 1 : 2;
        this.maxSizeBuffer = this.limitCaseChanelSize ?? 0;

        this.SelectTypeChanel();
        this.SelectTypeLanguage();

        this.isLoading = false;
    }
    convertDate(date,time){
        const dateIN = String(date+" "+time);
        const [datePart, timePart] = dateIN.split(" ");
        const [year, month, day] = datePart.split("-");
        const [hours, minutes, seconds] = timePart.split(":");
        return [Number(year),Number(month)-1,Number(day),Number(hours),Number(minutes),Number(seconds)]
    }
    CaseChannelSaveData(){
        this.SelectTypeChanel();
        this.SelectTypeLanguage();
        if (this.formChannelValidate) {
            this.ShowInvalidDialog("กรุณาเลือกช่องทางการติดต่อคนร้าย");
            return;
        };
        if(!this.formCaseChannel.instance.validate().isValid){
            this.ShowInvalidDialog("กรุณากรอกข้อมูลการติดต่อคนร้าย");
            return;
        }
        if (this.popupType === 'add') {
            var arr = new Array();

            if(this.formPopupvillain.CHANEL_PHONE){
                if(this.validateLanguagePHONE){
                    this.ShowInvalidDialog("กรุณาเลือกภาษาที่ใช้ในการติดต่อ");
                    return;
                }
                this.formPopupvillain.CHANEL_PHONE_NAME = 'เบอร์โทรศัพท​์';
                arr.push('เบอร์โทรศัพท​์');
                this.formPopupvillain.CHANNEL_PHONE_DOC = this.listDocFilePhone ?? [];
                this.formPopupvillain.CASE_CHANNEL_PHONE_DATE = this.formChannelPhone.CASE_CHANNEL_PHONE_DATE;
                this.formPopupvillain.CASE_CHANNEL_PHONE_TIME = this.formChannelPhone.CASE_CHANNEL_PHONE_TIME;
            }else{
                this.formPopupvillain.CASE_CHANNEL_PHONE_ORIGINAL = null;
                this.formPopupvillain.CASE_CHANNEL_PHONE_SERVICE = null;
                this.formPopupvillain.CASE_CHANNEL_PHONE_DESTINATION = null;
                this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
                this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.PHONE_CHANEL_CHANNEL_LANGUAGE_OTHER_DETAIL = null;
            }
            if(this.formPopupvillain.CHANEL_SMS){
                if(this.validateLanguageSMS){
                    this.ShowInvalidDialog("กรุณาเลือกภาษาที่ใช้ในการติดต่อ");
                    return;
                }
                this.formPopupvillain.CHANEL_SMS_NAME = 'SMS';
                arr.push('SMS');
                this.formPopupvillain.CHANNEL_SMS_DOC = this.listDocFileSMS ?? [];
                this.formPopupvillain.CASE_CHANNEL_SMS_DATE = this.formChannelSMS.CASE_CHANNEL_SMS_DATE;
                this.formPopupvillain.CASE_CHANNEL_SMS_TIME = this.formChannelSMS.CASE_CHANNEL_SMS_TIME;
            }else{
                this.formPopupvillain.CASE_CHANNEL_SMS_ORIGINAL = null;
                this.formPopupvillain.CASE_CHANNEL_SMS_SERVICE = null;
                this.formPopupvillain.CASE_CHANNEL_SMS_DESTINATION = null;
                this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
                this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.SMS_CHANEL_CHANNEL_LANGUAGE_OTHER_DETAIL = null;
                this.listDocFileSMS = [];
            }
            if(this.formPopupvillain.CHANEL_LINE){
                if(this.validateLanguageLINE){
                    this.ShowInvalidDialog("กรุณาเลือกภาษาที่ใช้ในการติดต่อ");
                    return;
                }
                this.formPopupvillain.CHANEL_LINE_NAME = 'LINE';
                arr.push('LINE');
                this.formPopupvillain.CHANNEL_LINE_DOC = this.listDocFileLINE ?? [];
                this.showtext = this.formPopupvillain.CASE_CHANNEL_LINE_DETAIL_NAME == undefined ? this.showtext : this.showtext += '<b>'+'ชื่อ LINE: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_LINE_DETAIL_NAME+'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_LINE_DETAIL_ID == undefined ? this.showtext : this.showtext += '<b>'+'LINE ID: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_LINE_DETAIL_ID+'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_LINE_DETAIL_URL == undefined ? this.showtext : this.showtext += '<b>'+'LINE URL: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_LINE_DETAIL_URL+'<br>';
                if(this.formChannelLINE.CASE_CHANNEL_LINE_TIME_START)
                    this.formPopupvillain.CASE_CHANNEL_LINE_TIME_START = this.formChannelLINE.CASE_CHANNEL_LINE_TIME_START;
                if(this.formChannelLINE.CASE_CHANNEL_LINE_DATE_START)
                    this.formPopupvillain.CASE_CHANNEL_LINE_DATE_START = this.formChannelLINE.CASE_CHANNEL_LINE_DATE_START;
                if(this.formChannelLINE.CASE_CHANNEL_LINE_TIME_END)
                    this.formPopupvillain.CASE_CHANNEL_LINE_TIME_END = this.formChannelLINE.CASE_CHANNEL_LINE_TIME_END;
                if(this.formChannelLINE.CASE_CHANNEL_LINE_DATE_END)
                    this.formPopupvillain.CASE_CHANNEL_LINE_DATE_END = this.formChannelLINE.CASE_CHANNEL_LINE_DATE_END;
            }else{
                this.formPopupvillain.CASE_CHANNEL_LINE_DETAIL_URL = null;
                this.formPopupvillain.CASE_CHANNEL_LINE_DETAIL_ID = null;
                this.formPopupvillain.CASE_CHANNEL_LINE_DETAIL_NAME = null;
                this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
                this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.LINE_CHANEL_CHANNEL_LANGUAGE_OTHER_DETAIL = null;
                this.listDocFileLINE = [];
            }
            if(this.formPopupvillain.CHANEL_FACEBOOK){
                if(this.validateLanguageFACEBOOK){
                    this.ShowInvalidDialog("กรุณาเลือกภาษาที่ใช้ในการติดต่อ");
                    return;
                }
                this.formPopupvillain.CHANEL_FACEBOOK_NAME = 'FACEBOOK';
                arr.push('FACEBOOK');
                this.showtext = this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DETAIL_NAME == undefined ? this.showtext : this.showtext += '<b>'+'ชื่อ FACEBOOK: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DETAIL_NAME +'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DETAIL_ID == undefined ? this.showtext : this.showtext += '<b>'+'FACEBOOK ID: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DETAIL_ID+'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DETAIL_URL == undefined ? this.showtext : this.showtext += '<b>'+'FACEBOOK URL: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DETAIL_URL+'<br>';
                this.formPopupvillain.CHANNEL_FACEBOOK_DOC = this.listDocFileFACEBOOK ?? [];
                if(this.formChannelFACEBOOK.CASE_CHANNEL_FACEBOOK_TIME_START)
                    this.formPopupvillain.CASE_CHANNEL_FACEBOOK_TIME_START = this.formChannelFACEBOOK.CASE_CHANNEL_FACEBOOK_TIME_START ;
                if(this.formChannelFACEBOOK.CASE_CHANNEL_FACEBOOK_DATE_START)
                    this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DATE_START = this.formChannelFACEBOOK.CASE_CHANNEL_FACEBOOK_DATE_START ;
                if(this.formChannelFACEBOOK.CASE_CHANNEL_FACEBOOK_TIME_END)
                    this.formPopupvillain.CASE_CHANNEL_FACEBOOK_TIME_END = this.formChannelFACEBOOK.CASE_CHANNEL_FACEBOOK_TIME_END ;
                if(this.formChannelFACEBOOK.CASE_CHANNEL_FACEBOOK_DATE_END)
                    this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DATE_END = this.formChannelFACEBOOK.CASE_CHANNEL_FACEBOOK_DATE_END;
            }else{
                this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DETAIL_URL = null;
                this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DETAIL_ID = null;
                this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DETAIL_NAME = null;
                this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
                this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.FACEBOOK_CHANEL_CHANNEL_LANGUAGE_OTHER_DETAIL = null;
                this.listDocFileFACEBOOK = [];
            }
            if(this.formPopupvillain.CHANEL_MESSENGER){
                if(this.validateLanguageMESSENGER){
                    this.ShowInvalidDialog("กรุณาเลือกภาษาที่ใช้ในการติดต่อ");
                    return;
                }
                this.formPopupvillain.CHANEL_MESSENGER_NAME = 'MESSENGER';
                arr.push('MESSENGER');
                this.formPopupvillain.CHANNEL_MESSENGER_DOC = this.listDocFileMESSENGER ?? [];
                this.showtext = this.formPopupvillain.CASE_CHANNEL_MESSENGER_DETAIL_NAME == undefined ? this.showtext : this.showtext += '<b>'+'ชื่อ MESSENGER: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_MESSENGER_DETAIL_NAME +'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_MESSENGER_DETAIL_ID == undefined ? this.showtext : this.showtext += '<b>'+'MESSENGER ID: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_MESSENGER_DETAIL_ID+'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_MESSENGER_DETAIL_URL == undefined ? this.showtext : this.showtext += '<b>'+'MESSENGER URL: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_MESSENGER_DETAIL_URL+'<br>';
                if(this.formChannelMESSENGER.CASE_CHANNEL_MESSENGER_TIME_START)
                    this.formPopupvillain.CASE_CHANNEL_MESSENGER_TIME_START = this.formChannelMESSENGER.CASE_CHANNEL_MESSENGER_TIME_START;
                if(this.formChannelMESSENGER.CASE_CHANNEL_MESSENGER_DATE_START)
                    this.formPopupvillain.CASE_CHANNEL_MESSENGER_DATE_START = this.formChannelMESSENGER.CASE_CHANNEL_MESSENGER_DATE_START;
                if(this.formChannelMESSENGER.CASE_CHANNEL_MESSENGER_TIME_END)
                    this.formPopupvillain.CASE_CHANNEL_MESSENGER_TIME_END = this.formChannelMESSENGER.CASE_CHANNEL_MESSENGER_TIME_END;
                if(this.formChannelMESSENGER.CASE_CHANNEL_MESSENGER_DATE_END)
                    this.formPopupvillain.CASE_CHANNEL_MESSENGER_DATE_END = this.formChannelMESSENGER.CASE_CHANNEL_MESSENGER_DATE_END;
            }else{
                this.formPopupvillain.CASE_CHANNEL_MESSENGER_DETAIL_URL = null;
                this.formPopupvillain.CASE_CHANNEL_MESSENGER_DETAIL_ID = null;
                this.formPopupvillain.CASE_CHANNEL_MESSENGER_DETAIL_NAME = null;
                this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
                this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.MESSENGER_CHANEL_CHANNEL_LANGUAGE_OTHER_DETAIL = null;
                this.listDocFileMESSENGER = [];
            }
            if(this.formPopupvillain.CHANEL_INSTARGRAM){
                if(this.validateLanguageINSTARGRAM){
                    this.ShowInvalidDialog("กรุณาเลือกภาษาที่ใช้ในการติดต่อ");
                    return;
                }
                this.formPopupvillain.CHANEL_INSTARGRAM_NAME = 'INSTAGRAM';
                arr.push('INSTAGRAM');
                this.formPopupvillain.CHANNEL_INSTARGRAM_DOC = this.listDocFileINSTARGRAM ?? [];
                this.showtext = this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DETAIL_NAME == undefined ? this.showtext : this.showtext += '<b>'+'ชื่อ INSTAGRAM: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DETAIL_NAME+'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DETAIL_ID == undefined ? this.showtext : this.showtext += '<b>'+'INSTAGRAM ID: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DETAIL_ID+'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DETAIL_URL == undefined ? this.showtext : this.showtext += '<b>'+'INSTAGRAM URL: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DETAIL_URL+'<br>';
                if(this.formChannelINSTARGRAM.CASE_CHANNEL_INSTARGRAM_TIME_START)
                    this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_TIME_START = this.formChannelINSTARGRAM.CASE_CHANNEL_INSTARGRAM_TIME_START;
                if(this.formChannelINSTARGRAM.CASE_CHANNEL_INSTARGRAM_DATE_START)
                    this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DATE_START = this.formChannelINSTARGRAM.CASE_CHANNEL_INSTARGRAM_DATE_START;
                if(this.formChannelINSTARGRAM.CASE_CHANNEL_INSTARGRAM_TIME_END)
                    this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_TIME_END = this.formChannelINSTARGRAM.CASE_CHANNEL_INSTARGRAM_TIME_END;
                if(this.formChannelINSTARGRAM.CASE_CHANNEL_INSTARGRAM_DATE_END)
                    this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DATE_END = this.formChannelINSTARGRAM.CASE_CHANNEL_INSTARGRAM_DATE_END;
            }else{
                this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DETAIL_URL = null;
                this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DETAIL_ID = null;
                this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DETAIL_NAME = null;
                this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
                this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.INSTARGRAM_CHANEL_CHANNEL_LANGUAGE_OTHER_DETAIL = null;
                this.listDocFileINSTARGRAM = [];
            }
            if(this.formPopupvillain.CHANEL_WEBSITE){
                if(this.validateLanguageWEBSITE){
                    this.ShowInvalidDialog("กรุณาเลือกภาษาที่ใช้ในการติดต่อ");
                    return;
                }
                this.formPopupvillain.CHANEL_WEBSITE_NAME = 'WEBSITE';
                arr.push('WEBSITE');
                this.formPopupvillain.CHANNEL_WEBSITE_DOC = this.listDocFileWEBSITE ?? [];
                this.showtext += '<b>'+'WEBSITE URL: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_WEBSITE_DETAIL+'<br>';
                if(this.formChannelWEBSITE.CASE_CHANNEL_WEBSITE_TIME)
                    this.formPopupvillain.CASE_CHANNEL_WEBSITE_TIME = this.formChannelWEBSITE.CASE_CHANNEL_WEBSITE_TIME;
                if(this.formChannelWEBSITE.CASE_CHANNEL_WEBSITE_DATE)
                    this.formPopupvillain.CASE_CHANNEL_WEBSITE_DATE = this.formChannelWEBSITE.CASE_CHANNEL_WEBSITE_DATE;
            }else{
                this.formPopupvillain.CASE_CHANNEL_WEBSITE_DETAIL = null;
                this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
                this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.WEBSITE_CHANEL_CHANNEL_LANGUAGE_OTHER_DETAIL = null;
                this.listDocFileWEBSITE = [];
            }
            if(this.formPopupvillain.CHANEL_EMAIL){
                if(this.validateLanguageEMAIL){
                    this.ShowInvalidDialog("กรุณาเลือกภาษาที่ใช้ในการติดต่อ");
                    return;
                }
                this.formPopupvillain.CHANEL_EMAIL_NAME = 'EMAIL';
                arr.push('EMAIL');
                this.formPopupvillain.CHANNEL_EMAIL_DOC = this.listDocFileEMAIL ?? [];
                this.showtext += '<b>'+'EMAIL: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_EMAIL_DETAIL+'<br>';
                if(this.formChannelEMAIL.CASE_CHANNEL_EMAIL_TIME)
                    this.formPopupvillain.CASE_CHANNEL_EMAIL_TIME = this.formChannelEMAIL.CASE_CHANNEL_EMAIL_TIME;
                if(this.formChannelEMAIL.CASE_CHANNEL_EMAIL_DATE)
                    this.formPopupvillain.CASE_CHANNEL_EMAIL_DATE = this.formChannelEMAIL.CASE_CHANNEL_EMAIL_DATE;
            }else{
                this.formPopupvillain.CASE_CHANNEL_EMAIL_DETAIL = null;
                this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
                this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.EMAIL_CHANEL_CHANNEL_LANGUAGE_OTHER_DETAIL = null;
                this.listDocFileEMAIL = [];
            }
            if(this.formPopupvillain.CHANEL_TELEGRAM){
                if(this.validateLanguageTELEGRAM){
                    this.ShowInvalidDialog("กรุณาเลือกภาษาที่ใช้ในการติดต่อ");
                    return;
                }
                this.formPopupvillain.CHANEL_TELEGRAM_NAME = 'TELEGRAM';
                arr.push('TELEGRAM');
                this.formPopupvillain.CHANNEL_TELEGRAM_DOC = this.listDocFileTELEGRAM ?? [];
                this.showtext = this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DETAIL_NAME == undefined ? this.showtext : this.showtext += '<b>'+'ชื่อ TELEGRAM: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DETAIL_NAME+'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DETAIL_ID == undefined ? this.showtext : this.showtext += '<b>'+'TELEGRAM ID: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DETAIL_ID+'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DETAIL_URL == undefined ? this.showtext : this.showtext += '<b>'+'TELEGRAM URL: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DETAIL_URL+'<br>';
                if(this.formChannelTELEGRAM.CASE_CHANNEL_TELEGRAM_TIME_START)
                    this.formPopupvillain.CASE_CHANNEL_TELEGRAM_TIME_START = this.formChannelTELEGRAM.CASE_CHANNEL_TELEGRAM_TIME_START;
                if(this.formChannelTELEGRAM.CASE_CHANNEL_TELEGRAM_DATE_START)
                    this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DATE_START = this.formChannelTELEGRAM.CASE_CHANNEL_TELEGRAM_DATE_START;
                if(this.formChannelTELEGRAM.CASE_CHANNEL_TELEGRAM_TIME_END)
                    this.formPopupvillain.CASE_CHANNEL_TELEGRAM_TIME_END = this.formChannelTELEGRAM.CASE_CHANNEL_TELEGRAM_TIME_END;
                if(this.formChannelTELEGRAM.CASE_CHANNEL_TELEGRAM_DATE_END)
                    this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DATE_END = this.formChannelTELEGRAM.CASE_CHANNEL_TELEGRAM_DATE_END;
            }else{
                this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DETAIL_URL = null;
                this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DETAIL_ID = null;
                this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DETAIL_NAME = null;
                this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
                this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.TELEGRAM_CHANEL_CHANNEL_LANGUAGE_OTHER_DETAIL = null;
                this.listDocFileTELEGRAM = [];
            }
            if(this.formPopupvillain.CHANEL_WHATAPP){
                if(this.validateLanguageWHATAPP){
                    this.ShowInvalidDialog("กรุณาเลือกภาษาที่ใช้ในการติดต่อ");
                    return;
                }
                this.formPopupvillain.CHANEL_WHATAPP_NAME = 'WHATSAPP';
                arr.push('WHATSAPP');
                this.formPopupvillain.CHANNEL_WHATAPP_DOC = this.listDocFileWHATAPP ?? [];
                this.showtext = this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DETAIL_NAME == undefined ? this.showtext : this.showtext += '<b>'+'ชื่อ WHATSAPP: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DETAIL_NAME+'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DETAIL_ID == undefined ? this.showtext : this.showtext += '<b>'+'WHATSAPP ID: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DETAIL_ID+'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DETAIL_URL == undefined ? this.showtext : this.showtext += '<b>'+'WHATSAPP URL: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DETAIL_URL+'<br>';
                if(this.formChannelWHATAPP.CASE_CHANNEL_WHATSAPP_TIME_START)
                    this.formPopupvillain.CASE_CHANNEL_WHATSAPP_TIME_START = this.formChannelWHATAPP.CASE_CHANNEL_WHATSAPP_TIME_START;
                if(this.formChannelWHATAPP.CASE_CHANNEL_WHATSAPP_DATE_START)
                    this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DATE_START = this.formChannelWHATAPP.CASE_CHANNEL_WHATSAPP_DATE_START;
                if(this.formChannelWHATAPP.CASE_CHANNEL_WHATSAPP_TIME_END)
                    this.formPopupvillain.CASE_CHANNEL_WHATSAPP_TIME_END = this.formChannelWHATAPP.CASE_CHANNEL_WHATSAPP_TIME_END;
                if(this.formChannelWHATAPP.CASE_CHANNEL_WHATSAPP_DATE_END)
                    this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DATE_END = this.formChannelWHATAPP.CASE_CHANNEL_WHATSAPP_DATE_END;
            }else{
                this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DETAIL_URL = null;
                this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DETAIL_ID = null;
                this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DETAIL_NAME = null;
                this.formChannelLanguage.WHATSAPP_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
                this.formChannelLanguage.WHATSAPP_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.WHATSAPP_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.WHATSAPP_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.WHATSAPP_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.WHATSAPP_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.WHATSAPP_CHANEL_CHANNEL_LANGUAGE_OTHER_DETAIL = null;
                this.listDocFileWHATAPP = [];
            }
            if(this.formPopupvillain.CHANEL_TWITTER){
                if(this.validateLanguageTWITTER){
                    this.ShowInvalidDialog("กรุณาเลือกภาษาที่ใช้ในการติดต่อ");
                    return;
                }
                this.formPopupvillain.CHANEL_TWITTER_NAME = 'TWITTER';
                arr.push('TWITTER');
                this.formPopupvillain.CHANNEL_TWITTER_DOC = this.listDocFileTWITTER ?? [];
                this.showtext = this.formPopupvillain.CASE_CHANNEL_TWITTER_DETAIL_NAME == undefined ? this.showtext : this.showtext += '<b>'+'ชื่อ TWITTER: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_TWITTER_DETAIL_NAME +'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_TWITTER_DETAIL_ID == undefined ? this.showtext : this.showtext += '<b>'+'TWITTER ID: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_TWITTER_DETAIL_ID+'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_TWITTER_DETAIL_URL == undefined ? this.showtext : this.showtext += '<b>'+'TWITTER URL: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_TWITTER_DETAIL_URL+'<br>';
                if(this.formChannelTWITTER.CASE_CHANNEL_TWITTER_TIME_START)
                    this.formPopupvillain.CASE_CHANNEL_TWITTER_TIME_START = this.formChannelTWITTER.CASE_CHANNEL_TWITTER_TIME_START;
                if(this.formChannelTWITTER.CASE_CHANNEL_TWITTER_DATE_START)
                    this.formPopupvillain.CASE_CHANNEL_TWITTER_DATE_START = this.formChannelTWITTER.CASE_CHANNEL_TWITTER_DATE_START;
                if(this.formChannelTWITTER.CASE_CHANNEL_TWITTER_TIME_END)
                    this.formPopupvillain.CASE_CHANNEL_TWITTER_TIME_END = this.formChannelTWITTER.CASE_CHANNEL_TWITTER_TIME_END;
                if(this.formChannelTWITTER.CASE_CHANNEL_TWITTER_DATE_END)
                    this.formPopupvillain.CASE_CHANNEL_TWITTER_DATE_END = this.formChannelTWITTER.CASE_CHANNEL_TWITTER_DATE_END;
            }else{
                this.formPopupvillain.CASE_CHANNEL_TWITTER_DETAIL_URL = null;
                this.formPopupvillain.CASE_CHANNEL_TWITTER_DETAIL_ID = null;
                this.formPopupvillain.CASE_CHANNEL_TWITTER_DETAIL_NAME = null;
                this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
                this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.TWITTER_CHANEL_CHANNEL_LANGUAGE_OTHER_DETAIL = null;
                this.listDocFileTWITTER = [];
            }
            if(this.formPopupvillain.CHANEL_OTHERS){
                if(this.validateLanguageOTHERS){
                    this.ShowInvalidDialog("กรุณาเลือกภาษาที่ใช้ในการติดต่อ");
                    return;
                }
                this.formPopupvillain.CHANEL_OTHERS_NAME = 'อื่นๆ';
                arr.push('อื่นๆ');
                this.formPopupvillain.CHANNEL_OTHERS_DOC = this.listDocFileOTHERS ?? [];
                this.showtext = this.formPopupvillain.CASE_CHANNEL_OTHER_TYPE == undefined ? this.showtext : this.showtext += '<b>'+'ประเภทช่องทาง: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_OTHER_TYPE+'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_OTHER_DETAIL == undefined ? this.showtext : this.showtext += '<b>'+'URL/ID: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_OTHER_DETAIL;
                if(this.formChannelOTHERS.CASE_CHANNEL_OTHER_TIME)
                    this.formPopupvillain.CASE_CHANNEL_OTHER_TIME = this.formChannelOTHERS.CASE_CHANNEL_OTHER_TIME;
                if(this.formChannelOTHERS.CASE_CHANNEL_OTHER_DATE)
                    this.formPopupvillain.CASE_CHANNEL_OTHER_DATE = this.formChannelOTHERS.CASE_CHANNEL_OTHER_DATE;
            }else{
                this.formPopupvillain.CASE_CHANNEL_OTHER_TYPE = null;
                this.formPopupvillain.CASE_CHANNEL_OTHER_DETAIL = null;
                this.formChannelLanguage.OTHER_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
                this.formChannelLanguage.OTHER_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.OTHER_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.OTHER_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.OTHER_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.OTHER_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.OTHER_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.OTHER_CHANEL_CHANNEL_LANGUAGE_OTHER_DETAIL = null;
                this.listDocFileOTHERS = [];
            }
            for (const prop in this.formPopupvillain) {
                if (this.formPopupvillain[prop] === null ||this.formPopupvillain[prop] === undefined) {
                  delete this.formPopupvillain[prop];
                }
            }
            this.showLanguage();
            this.formPopupvillain.CHANNEL_NAME = arr.join(',').toString();
            if(this.formChannelLanguage){
                this.formPopupvillain.CASE_CHANNEL_LANGUAGE.push(this.formChannelLanguage);
            }

            this.formPopupvillain.SHOW_TEXT = this.showtext;
            this.formPopupvillain.SHOW_LANGUAGE = this.showlanguage;
            this.formData.CASE_CHANNEL.push(this.formPopupvillain);
        }else{
            var arr = new Array();
            if(this.formPopupvillain.CHANEL_PHONE){
                if(this.validateLanguagePHONE){
                    this.ShowInvalidDialog("กรุณาเลือกภาษาที่ใช้ในการติดต่อ");
                    return;
                }
                this.formPopupvillain.CHANEL_PHONE_NAME = 'เบอร์โทรศัพท​์';
                arr.push('เบอร์โทรศัพท​์');
                this.formPopupvillain.CHANNEL_PHONE_DOC = this.listDocFilePhone ?? [];
                this.formPopupvillain.CASE_CHANNEL_PHONE_DATE = this.formChannelPhone.CASE_CHANNEL_PHONE_DATE;
                this.formPopupvillain.CASE_CHANNEL_PHONE_TIME = this.formChannelPhone.CASE_CHANNEL_PHONE_TIME;
            }else{
                this.formPopupvillain.CASE_CHANNEL_PHONE_ORIGINAL = null;
                this.formPopupvillain.CASE_CHANNEL_PHONE_SERVICE = null;
                this.formPopupvillain.CASE_CHANNEL_PHONE_DESTINATION = null;
                this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
                this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.PHONE_CHANEL_CHANNEL_LANGUAGE_OTHER_DETAIL = null;
            }
            if(this.formPopupvillain.CHANEL_SMS){
                if(this.validateLanguageSMS){
                    this.ShowInvalidDialog("กรุณาเลือกภาษาที่ใช้ในการติดต่อ");
                    return;
                }
                this.formPopupvillain.CHANEL_SMS_NAME = 'SMS';
                arr.push('SMS');
                this.formPopupvillain.CHANNEL_SMS_DOC = this.listDocFileSMS ?? [];
                this.formPopupvillain.CASE_CHANNEL_SMS_DATE = this.formChannelSMS.CASE_CHANNEL_SMS_DATE;
                this.formPopupvillain.CASE_CHANNEL_SMS_TIME = this.formChannelSMS.CASE_CHANNEL_SMS_TIME;
            }else{
                this.formPopupvillain.CASE_CHANNEL_SMS_ORIGINAL = null;
                this.formPopupvillain.CASE_CHANNEL_SMS_SERVICE = null;
                this.formPopupvillain.CASE_CHANNEL_SMS_DESTINATION = null;
                this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
                this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.SMS_CHANEL_CHANNEL_LANGUAGE_OTHER_DETAIL = null;
                this.listDocFileSMS = [];
            }
            if(this.formPopupvillain.CHANEL_LINE){
                if(this.validateLanguageLINE){
                    this.ShowInvalidDialog("กรุณาเลือกภาษาที่ใช้ในการติดต่อ");
                    return;
                }
                this.formPopupvillain.CHANEL_LINE_NAME = 'LINE';
                arr.push('LINE');
                this.formPopupvillain.CHANNEL_LINE_DOC = this.listDocFileLINE ?? [];
                this.showtext = this.formPopupvillain.CASE_CHANNEL_LINE_DETAIL_NAME == undefined ? this.showtext : this.showtext += '<b>'+'ชื่อ LINE: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_LINE_DETAIL_NAME+'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_LINE_DETAIL_ID == undefined ? this.showtext : this.showtext += '<b>'+'LINE ID: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_LINE_DETAIL_ID+'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_LINE_DETAIL_URL == undefined ? this.showtext : this.showtext += '<b>'+'LINE URL: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_LINE_DETAIL_URL+'<br>';
                if(this.formChannelLINE.CASE_CHANNEL_LINE_TIME_START)
                    this.formPopupvillain.CASE_CHANNEL_LINE_TIME_START = this.formChannelLINE.CASE_CHANNEL_LINE_TIME_START;
                if(this.formChannelLINE.CASE_CHANNEL_LINE_DATE_START)
                    this.formPopupvillain.CASE_CHANNEL_LINE_DATE_START = this.formChannelLINE.CASE_CHANNEL_LINE_DATE_START;
                if(this.formChannelLINE.CASE_CHANNEL_LINE_TIME_END)
                    this.formPopupvillain.CASE_CHANNEL_LINE_TIME_END = this.formChannelLINE.CASE_CHANNEL_LINE_TIME_END;
                if(this.formChannelLINE.CASE_CHANNEL_LINE_DATE_END)
                    this.formPopupvillain.CASE_CHANNEL_LINE_DATE_END = this.formChannelLINE.CASE_CHANNEL_LINE_DATE_END;
            }else{
                this.formPopupvillain.CASE_CHANNEL_LINE_DETAIL_URL = null;
                this.formPopupvillain.CASE_CHANNEL_LINE_DETAIL_ID = null;
                this.formPopupvillain.CASE_CHANNEL_LINE_DETAIL_NAME = null;
                this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
                this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.LINE_CHANEL_CHANNEL_LANGUAGE_OTHER_DETAIL = null;
                this.listDocFileLINE = [];
            }
            if(this.formPopupvillain.CHANEL_FACEBOOK){
                if(this.validateLanguageFACEBOOK){
                    this.ShowInvalidDialog("กรุณาเลือกภาษาที่ใช้ในการติดต่อ");
                    return;
                }
                this.formPopupvillain.CHANEL_FACEBOOK_NAME = 'FACEBOOK';
                arr.push('FACEBOOK');
                this.showtext = this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DETAIL_NAME == undefined ? this.showtext : this.showtext += '<b>'+'ชื่อ FACEBOOK: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DETAIL_NAME +'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DETAIL_ID == undefined ? this.showtext : this.showtext += '<b>'+'FACEBOOK ID: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DETAIL_ID+'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DETAIL_URL == undefined ? this.showtext : this.showtext += '<b>'+'FACEBOOK URL: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DETAIL_URL+'<br>';
                this.formPopupvillain.CHANNEL_FACEBOOK_DOC = this.listDocFileFACEBOOK ?? [];
                if(this.formChannelFACEBOOK.CASE_CHANNEL_FACEBOOK_TIME_START)
                    this.formPopupvillain.CASE_CHANNEL_FACEBOOK_TIME_START = this.formChannelFACEBOOK.CASE_CHANNEL_FACEBOOK_TIME_START ;
                if(this.formChannelFACEBOOK.CASE_CHANNEL_FACEBOOK_DATE_START)
                    this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DATE_START = this.formChannelFACEBOOK.CASE_CHANNEL_FACEBOOK_DATE_START ;
                if(this.formChannelFACEBOOK.CASE_CHANNEL_FACEBOOK_TIME_END)
                    this.formPopupvillain.CASE_CHANNEL_FACEBOOK_TIME_END = this.formChannelFACEBOOK.CASE_CHANNEL_FACEBOOK_TIME_END ;
                if(this.formChannelFACEBOOK.CASE_CHANNEL_FACEBOOK_DATE_END)
                    this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DATE_END = this.formChannelFACEBOOK.CASE_CHANNEL_FACEBOOK_DATE_END;
            }else{
                this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DETAIL_URL = null;
                this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DETAIL_ID = null;
                this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DETAIL_NAME = null;
                this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
                this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.FACEBOOK_CHANEL_CHANNEL_LANGUAGE_OTHER_DETAIL = null;
                this.listDocFileFACEBOOK = [];
            }
            if(this.formPopupvillain.CHANEL_MESSENGER){
                if(this.validateLanguageMESSENGER){
                    this.ShowInvalidDialog("กรุณาเลือกภาษาที่ใช้ในการติดต่อ");
                    return;
                }
                this.formPopupvillain.CHANEL_MESSENGER_NAME = 'MESSENGER';
                arr.push('MESSENGER');
                this.formPopupvillain.CHANNEL_MESSENGER_DOC = this.listDocFileMESSENGER ?? [];
                this.showtext = this.formPopupvillain.CASE_CHANNEL_MESSENGER_DETAIL_NAME == undefined ? this.showtext : this.showtext += '<b>'+'ชื่อ MESSENGER: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_MESSENGER_DETAIL_NAME +'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_MESSENGER_DETAIL_ID == undefined ? this.showtext : this.showtext += '<b>'+'MESSENGER ID: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_MESSENGER_DETAIL_ID+'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_MESSENGER_DETAIL_URL == undefined ? this.showtext : this.showtext += '<b>'+'MESSENGER URL: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_MESSENGER_DETAIL_URL+'<br>';
                if(this.formChannelMESSENGER.CASE_CHANNEL_MESSENGER_TIME_START)
                    this.formPopupvillain.CASE_CHANNEL_MESSENGER_TIME_START = this.formChannelMESSENGER.CASE_CHANNEL_MESSENGER_TIME_START;
                if(this.formChannelMESSENGER.CASE_CHANNEL_MESSENGER_DATE_START)
                    this.formPopupvillain.CASE_CHANNEL_MESSENGER_DATE_START = this.formChannelMESSENGER.CASE_CHANNEL_MESSENGER_DATE_START;
                if(this.formChannelMESSENGER.CASE_CHANNEL_MESSENGER_TIME_END)
                    this.formPopupvillain.CASE_CHANNEL_MESSENGER_TIME_END = this.formChannelMESSENGER.CASE_CHANNEL_MESSENGER_TIME_END;
                if(this.formChannelMESSENGER.CASE_CHANNEL_MESSENGER_DATE_END)
                    this.formPopupvillain.CASE_CHANNEL_MESSENGER_DATE_END = this.formChannelMESSENGER.CASE_CHANNEL_MESSENGER_DATE_END;
            }else{
                this.formPopupvillain.CASE_CHANNEL_MESSENGER_DETAIL_URL = null;
                this.formPopupvillain.CASE_CHANNEL_MESSENGER_DETAIL_ID = null;
                this.formPopupvillain.CASE_CHANNEL_MESSENGER_DETAIL_NAME = null;
                this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
                this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.MESSENGER_CHANEL_CHANNEL_LANGUAGE_OTHER_DETAIL = null;
                this.listDocFileMESSENGER = [];
            }
            if(this.formPopupvillain.CHANEL_INSTARGRAM){
                if(this.validateLanguageINSTARGRAM){
                    this.ShowInvalidDialog("กรุณาเลือกภาษาที่ใช้ในการติดต่อ");
                    return;
                }
                this.formPopupvillain.CHANEL_INSTARGRAM_NAME = 'INSTAGRAM';
                arr.push('INSTAGRAM');
                this.formPopupvillain.CHANNEL_INSTARGRAM_DOC = this.listDocFileINSTARGRAM ?? [];
                this.showtext = this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DETAIL_NAME == undefined ? this.showtext : this.showtext += '<b>'+'ชื่อ INSTAGRAM: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DETAIL_NAME+'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DETAIL_ID == undefined ? this.showtext : this.showtext += '<b>'+'INSTAGRAM ID: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DETAIL_ID+'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DETAIL_URL == undefined ? this.showtext : this.showtext += '<b>'+'INSTAGRAM URL: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DETAIL_URL+'<br>';
                if(this.formChannelINSTARGRAM.CASE_CHANNEL_INSTARGRAM_TIME_START)
                    this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_TIME_START = this.formChannelINSTARGRAM.CASE_CHANNEL_INSTARGRAM_TIME_START;
                if(this.formChannelINSTARGRAM.CASE_CHANNEL_INSTARGRAM_DATE_START)
                    this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DATE_START = this.formChannelINSTARGRAM.CASE_CHANNEL_INSTARGRAM_DATE_START;
                if(this.formChannelINSTARGRAM.CASE_CHANNEL_INSTARGRAM_TIME_END)
                    this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_TIME_END = this.formChannelINSTARGRAM.CASE_CHANNEL_INSTARGRAM_TIME_END;
                if(this.formChannelINSTARGRAM.CASE_CHANNEL_INSTARGRAM_DATE_END)
                    this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DATE_END = this.formChannelINSTARGRAM.CASE_CHANNEL_INSTARGRAM_DATE_END;
            }else{
                this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DETAIL_URL = null;
                this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DETAIL_ID = null;
                this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DETAIL_NAME = null;
                this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
                this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.INSTARGRAM_CHANEL_CHANNEL_LANGUAGE_OTHER_DETAIL = null;
                this.listDocFileINSTARGRAM = [];
            }
            if(this.formPopupvillain.CHANEL_WEBSITE){
                if(this.validateLanguageWEBSITE){
                    this.ShowInvalidDialog("กรุณาเลือกภาษาที่ใช้ในการติดต่อ");
                    return;
                }
                this.formPopupvillain.CHANEL_WEBSITE_NAME = 'WEBSITE';
                arr.push('WEBSITE');
                this.formPopupvillain.CHANNEL_WEBSITE_DOC = this.listDocFileWEBSITE ?? [];
                this.showtext += '<b>'+'WEBSITE URL: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_WEBSITE_DETAIL+'<br>';
                if(this.formChannelWEBSITE.CASE_CHANNEL_WEBSITE_TIME)
                    this.formPopupvillain.CASE_CHANNEL_WEBSITE_TIME = this.formChannelWEBSITE.CASE_CHANNEL_WEBSITE_TIME;
                if(this.formChannelWEBSITE.CASE_CHANNEL_WEBSITE_DATE)
                    this.formPopupvillain.CASE_CHANNEL_WEBSITE_DATE = this.formChannelWEBSITE.CASE_CHANNEL_WEBSITE_DATE;
            }else{
                this.formPopupvillain.CASE_CHANNEL_WEBSITE_DETAIL = null;
                this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
                this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.WEBSITE_CHANEL_CHANNEL_LANGUAGE_OTHER_DETAIL = null;
                this.listDocFileWEBSITE = [];
            }
            if(this.formPopupvillain.CHANEL_EMAIL){
                if(this.validateLanguageEMAIL){
                    this.ShowInvalidDialog("กรุณาเลือกภาษาที่ใช้ในการติดต่อ");
                    return;
                }
                this.formPopupvillain.CHANEL_EMAIL_NAME = 'EMAIL';
                arr.push('EMAIL');
                this.formPopupvillain.CHANNEL_EMAIL_DOC = this.listDocFileEMAIL ?? [];
                this.showtext += '<b>'+'EMAIL: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_EMAIL_DETAIL+'<br>';
                if(this.formChannelEMAIL.CASE_CHANNEL_EMAIL_TIME)
                    this.formPopupvillain.CASE_CHANNEL_EMAIL_TIME = this.formChannelEMAIL.CASE_CHANNEL_EMAIL_TIME;
                if(this.formChannelEMAIL.CASE_CHANNEL_EMAIL_DATE)
                    this.formPopupvillain.CASE_CHANNEL_EMAIL_DATE = this.formChannelEMAIL.CASE_CHANNEL_EMAIL_DATE;
            }else{
                this.formPopupvillain.CASE_CHANNEL_EMAIL_DETAIL = null;
                this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
                this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.EMAIL_CHANEL_CHANNEL_LANGUAGE_OTHER_DETAIL = null;
                this.listDocFileEMAIL = [];
            }
            if(this.formPopupvillain.CHANEL_TELEGRAM){
                if(this.validateLanguageTELEGRAM){
                    this.ShowInvalidDialog("กรุณาเลือกภาษาที่ใช้ในการติดต่อ");
                    return;
                }
                this.formPopupvillain.CHANEL_TELEGRAM_NAME = 'TELEGRAM';
                arr.push('TELEGRAM');
                this.formPopupvillain.CHANNEL_TELEGRAM_DOC = this.listDocFileTELEGRAM ?? [];
                this.showtext = this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DETAIL_NAME == undefined ? this.showtext : this.showtext += '<b>'+'ชื่อ TELEGRAM: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DETAIL_NAME+'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DETAIL_ID == undefined ? this.showtext : this.showtext += '<b>'+'TELEGRAM ID: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DETAIL_ID+'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DETAIL_URL == undefined ? this.showtext : this.showtext += '<b>'+'TELEGRAM URL: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DETAIL_URL+'<br>';
                if(this.formChannelTELEGRAM.CASE_CHANNEL_TELEGRAM_TIME_START)
                    this.formPopupvillain.CASE_CHANNEL_TELEGRAM_TIME_START = this.formChannelTELEGRAM.CASE_CHANNEL_TELEGRAM_TIME_START;
                if(this.formChannelTELEGRAM.CASE_CHANNEL_TELEGRAM_DATE_START)
                    this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DATE_START = this.formChannelTELEGRAM.CASE_CHANNEL_TELEGRAM_DATE_START;
                if(this.formChannelTELEGRAM.CASE_CHANNEL_TELEGRAM_TIME_END)
                    this.formPopupvillain.CASE_CHANNEL_TELEGRAM_TIME_END = this.formChannelTELEGRAM.CASE_CHANNEL_TELEGRAM_TIME_END;
                if(this.formChannelTELEGRAM.CASE_CHANNEL_TELEGRAM_DATE_END)
                    this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DATE_END = this.formChannelTELEGRAM.CASE_CHANNEL_TELEGRAM_DATE_END;
            }else{
                this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DETAIL_URL = null;
                this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DETAIL_ID = null;
                this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DETAIL_NAME = null;
                this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
                this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.TELEGRAM_CHANEL_CHANNEL_LANGUAGE_OTHER_DETAIL = null;
                this.listDocFileTELEGRAM = [];
            }
            if(this.formPopupvillain.CHANEL_WHATAPP){
                if(this.validateLanguageWHATAPP){
                    this.ShowInvalidDialog("กรุณาเลือกภาษาที่ใช้ในการติดต่อ");
                    return;
                }
                this.formPopupvillain.CHANEL_WHATAPP_NAME = 'WHATSAPP';
                arr.push('WHATSAPP');
                this.formPopupvillain.CHANNEL_WHATAPP_DOC = this.listDocFileWHATAPP ?? [];
                this.showtext = this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DETAIL_NAME == undefined ? this.showtext : this.showtext += '<b>'+'ชื่อ WHATSAPP: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DETAIL_NAME+'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DETAIL_ID == undefined ? this.showtext : this.showtext += '<b>'+'WHATSAPP ID: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DETAIL_ID+'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DETAIL_URL == undefined ? this.showtext : this.showtext += '<b>'+'WHATSAPP URL: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DETAIL_URL+'<br>';
                if(this.formChannelWHATAPP.CASE_CHANNEL_WHATSAPP_TIME_START)
                    this.formPopupvillain.CASE_CHANNEL_WHATSAPP_TIME_START = this.formChannelWHATAPP.CASE_CHANNEL_WHATSAPP_TIME_START;
                if(this.formChannelWHATAPP.CASE_CHANNEL_WHATSAPP_DATE_START)
                    this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DATE_START = this.formChannelWHATAPP.CASE_CHANNEL_WHATSAPP_DATE_START;
                if(this.formChannelWHATAPP.CASE_CHANNEL_WHATSAPP_TIME_END)
                    this.formPopupvillain.CASE_CHANNEL_WHATSAPP_TIME_END = this.formChannelWHATAPP.CASE_CHANNEL_WHATSAPP_TIME_END;
                if(this.formChannelWHATAPP.CASE_CHANNEL_WHATSAPP_DATE_END)
                    this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DATE_END = this.formChannelWHATAPP.CASE_CHANNEL_WHATSAPP_DATE_END;
            }else{
                this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DETAIL_URL = null;
                this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DETAIL_ID = null;
                this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DETAIL_NAME = null;
                this.formChannelLanguage.WHATSAPP_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
                this.formChannelLanguage.WHATSAPP_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.WHATSAPP_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.WHATSAPP_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.WHATSAPP_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.WHATSAPP_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.WHATSAPP_CHANEL_CHANNEL_LANGUAGE_OTHER_DETAIL = null;
                this.listDocFileWHATAPP = [];
            }
            if(this.formPopupvillain.CHANEL_TWITTER){
                if(this.validateLanguageTWITTER){
                    this.ShowInvalidDialog("กรุณาเลือกภาษาที่ใช้ในการติดต่อ");
                    return;
                }
                this.formPopupvillain.CHANEL_TWITTER_NAME = 'TWITTER';
                arr.push('TWITTER');
                this.formPopupvillain.CHANNEL_TWITTER_DOC = this.listDocFileTWITTER ?? [];
                this.showtext = this.formPopupvillain.CASE_CHANNEL_TWITTER_DETAIL_NAME == undefined ? this.showtext : this.showtext += '<b>'+'ชื่อ TWITTER: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_TWITTER_DETAIL_NAME +'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_TWITTER_DETAIL_ID == undefined ? this.showtext : this.showtext += '<b>'+'TWITTER ID: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_TWITTER_DETAIL_ID+'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_TWITTER_DETAIL_URL == undefined ? this.showtext : this.showtext += '<b>'+'TWITTER URL: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_TWITTER_DETAIL_URL+'<br>';
                if(this.formChannelTWITTER.CASE_CHANNEL_TWITTER_TIME_START)
                    this.formPopupvillain.CASE_CHANNEL_TWITTER_TIME_START = this.formChannelTWITTER.CASE_CHANNEL_TWITTER_TIME_START;
                if(this.formChannelTWITTER.CASE_CHANNEL_TWITTER_DATE_START)
                    this.formPopupvillain.CASE_CHANNEL_TWITTER_DATE_START = this.formChannelTWITTER.CASE_CHANNEL_TWITTER_DATE_START;
                if(this.formChannelTWITTER.CASE_CHANNEL_TWITTER_TIME_END)
                    this.formPopupvillain.CASE_CHANNEL_TWITTER_TIME_END = this.formChannelTWITTER.CASE_CHANNEL_TWITTER_TIME_END;
                if(this.formChannelTWITTER.CASE_CHANNEL_TWITTER_DATE_END)
                    this.formPopupvillain.CASE_CHANNEL_TWITTER_DATE_END = this.formChannelTWITTER.CASE_CHANNEL_TWITTER_DATE_END;
            }else{
                this.formPopupvillain.CASE_CHANNEL_TWITTER_DETAIL_URL = null;
                this.formPopupvillain.CASE_CHANNEL_TWITTER_DETAIL_ID = null;
                this.formPopupvillain.CASE_CHANNEL_TWITTER_DETAIL_NAME = null;
                this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
                this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.TWITTER_CHANEL_CHANNEL_LANGUAGE_OTHER_DETAIL = null;
                this.listDocFileTWITTER = [];
            }
            if(this.formPopupvillain.CHANEL_OTHERS){
                if(this.validateLanguageOTHERS){
                    this.ShowInvalidDialog("กรุณาเลือกภาษาที่ใช้ในการติดต่อ");
                    return;
                }
                this.formPopupvillain.CHANEL_OTHERS_NAME = 'อื่นๆ';
                arr.push('อื่นๆ');
                this.formPopupvillain.CHANNEL_OTHERS_DOC = this.listDocFileOTHERS ?? [];
                this.showtext = this.formPopupvillain.CASE_CHANNEL_OTHER_TYPE == undefined ? this.showtext : this.showtext += '<b>'+'ประเภทช่องทาง: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_OTHER_TYPE+'<br>';
                this.showtext = this.formPopupvillain.CASE_CHANNEL_OTHER_DETAIL == undefined ? this.showtext : this.showtext += '<b>'+'URL/ID: '+'</b>'+this.formPopupvillain.CASE_CHANNEL_OTHER_DETAIL;
                if(this.formChannelOTHERS.CASE_CHANNEL_OTHER_TIME)
                    this.formPopupvillain.CASE_CHANNEL_OTHER_TIME = this.formChannelOTHERS.CASE_CHANNEL_OTHER_TIME;
                if(this.formChannelOTHERS.CASE_CHANNEL_OTHER_DATE)
                    this.formPopupvillain.CASE_CHANNEL_OTHER_DATE = this.formChannelOTHERS.CASE_CHANNEL_OTHER_DATE;
            }else{
                this.formPopupvillain.CASE_CHANNEL_OTHER_TYPE = null;
                this.formPopupvillain.CASE_CHANNEL_OTHER_DETAIL = null;
                this.formChannelLanguage.OTHER_CHANNEL_LANGUAGE_FROMTRANSLATE = false;
                this.formChannelLanguage.OTHER_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.OTHER_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.OTHER_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.OTHER_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.OTHER_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.OTHER_CHANNEL_LANGUAGE_OTHER = false;
                this.formChannelLanguage.OTHER_CHANEL_CHANNEL_LANGUAGE_OTHER_DETAIL = null;
                this.listDocFileOTHERS = [];
            }
            for (const prop in this.formPopupvillain) {
                if (this.formPopupvillain[prop] === null ||this.formPopupvillain[prop] === undefined) {
                  delete this.formPopupvillain[prop];
                }
            }
            this.showLanguage();
            this.formPopupvillain.CHANNEL_NAME = arr.join(',').toString();
            if(this.formChannelLanguage){
                this.formPopupvillain.CASE_CHANNEL_LANGUAGE[0] = this.formChannelLanguage ?? [];

            }
            this.formPopupvillain.CHANNEL_PHONE_DOC = this.listDocFilePhone ?? [];
            this.formPopupvillain.CHANNEL_SMS_DOC = this.listDocFileSMS ?? [];
            this.formPopupvillain.CHANNEL_LINE_DOC = this.listDocFileLINE ?? [];
            this.formPopupvillain.CHANNEL_FACEBOOK_DOC = this.listDocFileFACEBOOK ?? [];
            this.formPopupvillain.CHANNEL_INSTARGRAM_DOC = this.listDocFileINSTARGRAM ?? [];
            this.formPopupvillain.CHANNEL_WEBSITE_DOC = this.listDocFileWEBSITE ?? [];
            this.formPopupvillain.CHANNEL_EMAIL_DOC = this.listDocFileEMAIL ?? [];
            this.formPopupvillain.CHANNEL_TELEGRAM_DOC = this.listDocFileTELEGRAM ?? [];
            this.formPopupvillain.CHANNEL_WHATAPP_DOC = this.listDocFileWHATAPP ?? [];
            this.formPopupvillain.CHANNEL_MESSENGER_DOC = this.listDocFileMESSENGER ?? [];
            this.formPopupvillain.CHANNEL_TWITTER_DOC = this.listDocFileTWITTER ?? [];
            this.formPopupvillain.CHANNEL_OTHERS_DOC = this.listDocFileOTHERS ?? [];
            this.formPopupvillain.SHOW_TEXT = this.showtext;
            this.formPopupvillain.SHOW_LANGUAGE = this.showlanguage;
            this.formData.CASE_CHANNEL[this.popupIndex] = this.formPopupvillain;
        }
        this.limitCaseChanelSize = this.maxSizeBuffer ?? 0;
        this.showtext = '';
        this.showlanguage = '';
        this.CaseChannelclose();
    }

    async CriminalEditData(type, data = {} as any, index = null){
        this.isLoading = true;
        this.popupType = 'edit';
        this.popupCriminalData = true;
        this.popupIndex = index;
        this.formCriminal = {};
        const setData = {};
        const d = data;
        for (const key in d) {
            if (d[key] !== null && d[key] !== undefined) {
                setData[key] = d[key];
            }
        }
        this.formCriminal = setData;

        this.maxSizeBuffer = this.limitCaseChanelSize ?? 0;

        this.isLoading = false;
    }
    CriminalSaveData(){
        if (!this.formVillain1.instance.validate().isValid || !this.formVillain2.instance.validate().isValid) {
            this.ShowInvalidDialog("กรุณากรอกข้อมูลคนร้าย");
            return;
        }
        const d = this.formPopup;
        if(this.formCriminal.CASE_CRIMINAL_PROVINCE_ID == null || this.formCriminal.CASE_CRIMINAL_PROVINCE_ID == undefined){
            this.formCriminal.CASE_CRIMINAL_DISTRICT_ID = null;
            this.formCriminal.CASE_CRIMINAL_SUB_DISTRICT_ID = null;
            this.formCriminal.CASE_CRIMINAL_PROVINCE_NAME_THA = null;
            this.formCriminal.CASE_CRIMINAL_DISTRICT_NAME_THA = null;
            this.formCriminal.CASE_CRIMINAL_SUB_DISTRICT_NAME_THA = null;
        }
        for (const prop in this.formCriminal) {
            if (this.formCriminal[prop] === null ||this.formCriminal[prop] === undefined) {
              delete this.formCriminal[prop];
            }
        }
        if (this.popupType === 'add') {
            this.formData.CASE_CRIMINAL.push(this.formCriminal);
        }else{
            this.formData.CASE_CRIMINAL[this.popupIndex] = this.formCriminal;
        }
        this.limitCaseChanelSize = this.maxSizeBuffer ?? 0;
        this.CriminalDataclose();
    }
    CriminalDeleteData(index = null) {
        Swal.fire({
            title: 'ยืนยันการลบข้อมูล?',
            text: " ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#7d7d7d',
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'ตกลง'
        }).then((result) => {
            if (result.isConfirmed) {
                this.formData.CASE_CRIMINAL.splice(index, 1);
            }
        });
    }
    CaseChannelDeleteData(index = null) {
        Swal.fire({
            title: 'ยืนยันการลบข้อมูล?',
            text: " ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#7d7d7d',
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'ตกลง'
        }).then((result) => {
            if (result.isConfirmed) {
                if (this.formData.CASE_CHANNEL[index].CHANNEL_DOC){
                    const fileSize = this.CaseChannelDeleteDataSumFileSize(this.formData.CASE_CHANNEL[index].CHANNEL_DOC);
                    this.limitCaseChanelSize -= fileSize ?? 0;
                }
                this.formData.CASE_CHANNEL.splice(index, 1);
            }
        });
    }
    CaseChannelDeleteDataSumFileSize(listDoc){
        let sumSize = 0;
        for (const item of listDoc) {
            sumSize += item.size;
        }
        return sumSize;
    }
    CaseChannelDeleteDataDocFile(index = null ,type){
        Swal.fire({
            title: 'ยืนยันการลบข้อมูล?',
            text: " ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#7d7d7d',
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'ตกลง'
        }).then((result) => {
            if (result.isConfirmed) {
                switch (type){
                    case 'PHONE':
                        this.maxSizeBuffer -= this.listDocFilePhone[index].size ?? 0;
                        this.listDocFilePhone.splice(index, 1);
                        break;
                    case 'SMS':
                        this.maxSizeBuffer -= this.listDocFileSMS[index].size ?? 0;
                        this.listDocFileSMS.splice(index, 1);
                        break;
                    case 'LINE':
                        this.maxSizeBuffer -= this.listDocFileLINE[index].size ?? 0;
                        this.listDocFileLINE.splice(index, 1);
                        break;
                    case 'FACEBOOK':
                        this.maxSizeBuffer -= this.listDocFileFACEBOOK[index].size ?? 0;
                        this.listDocFileFACEBOOK.splice(index, 1);
                        break;
                    case 'INSTARGRAM':
                        this.maxSizeBuffer -= this.listDocFileINSTARGRAM[index].size ?? 0;
                        this.listDocFileINSTARGRAM.splice(index, 1);
                        break;
                    case 'WEBSITE':
                        this.maxSizeBuffer -= this.listDocFileWEBSITE[index].size ?? 0;
                        this.listDocFileWEBSITE.splice(index, 1);
                        break;
                    case 'EMAIL':
                        this.maxSizeBuffer -= this.listDocFileEMAIL[index].size ?? 0;
                        this.listDocFileEMAIL.splice(index, 1);
                        break;
                    case 'TELEGRAM':
                        this.maxSizeBuffer -= this.listDocFileTELEGRAM[index].size ?? 0;
                        this.listDocFileTELEGRAM.splice(index, 1);
                        break;
                    case 'WHATAPP':
                        this.maxSizeBuffer -= this.listDocFileWHATAPP[index].size ?? 0;
                        this.listDocFileWHATAPP.splice(index, 1);
                        break;
                    case 'OTHERS':
                        this.maxSizeBuffer -= this.listDocFileOTHERS[index].size ?? 0;
                        this.listDocFileOTHERS.splice(index, 1);
                        break;
                }
            }
        });
    }

    OnSelectCaseChannel(e) {
        if (e.value) {

            const data: any = this.listCaseChannel.filter(r => r.CHANNEL_ID === e.value);
            // console.log("tesss",data);
            // const data = this.selectCaseChannel.instance.option('selectedItem');
            if (data) {
                this.formPopup.CHANNEL_ID = data[0].CHANNEL_ID;
                this.formPopup.CHANNEL_NAME = data[0].CHANNEL_NAME;

                this.showCaseLabelName = data[0].CHANNEL_DETAIL1;
                this.showcaseLabelID = data[0].CHANNEL_DETAIL2;
                this.showcaseCode = data[0].CHANNEL_CODE;

                this.showcaseOption = data[0].CHANNEL_OPTION_FLAG;
            } else {
                this.formPopup.CHANNEL_ID = e.value;
            }
        }
    }
    OpenFileDialogCaseChannel(uploadTag) {
        uploadTag.value = "";
        uploadTag.click();
    }

    async UploadFileCaseChannel(uploadTag,type) {
        const files: any = uploadTag.files;
        if (files.length > 0) {
            this.isLoading = true;
            const fileCheck = await this._issueFile.CheckFileUploadAllowListSizeDialog(this.maxSizeBuffer,files);

            if (fileCheck.status){
                this.maxSizeBuffer = fileCheck.uploadSizeAll ?? 0;
                for (const item of fileCheck.filebase64Array) {
                    switch (type){
                        case 'PHONE':
                            this.listDocFilePhone.push(item)
                            break;
                        case 'SMS':
                            this.listDocFileSMS.push(item);
                            break;
                        case 'LINE':
                            this.listDocFileLINE.push(item);
                            break;
                        case 'FACEBOOK':
                            this.listDocFileFACEBOOK.push(item);
                            break;
                        case 'INSTARGRAM':
                            this.listDocFileINSTARGRAM.push(item);
                            break;
                        case 'WEBSITE':
                            this.listDocFileWEBSITE.push(item);
                            break;
                        case 'EMAIL':
                            this.listDocFileEMAIL.push(item);
                            break;
                        case 'TELEGRAM':
                            this.listDocFileTELEGRAM.push(item);
                            break;
                        case 'WHATAPP':
                            this.listDocFileWHATAPP.push(item);
                            break;
                        case 'OTHERS':
                            this.listDocFileOTHERS.push(item);
                            break;
                        case 'TWITTER':
                            this.listDocFileTWITTER.push(item);
                            break;
                        case 'MESSENGER':
                            this.listDocFileMESSENGER.push(item);
                            break;
                    }
                }
            }
            this.isLoading = false;

        }
    }
    async FilesDroppedCaseChannel(e,type) {
        const files = e;
        if (files.length > 0) {
            this.isLoading = true;
            const fileCheck = await this._issueFile.CheckFileUploadAllowListSizeDrop(this.maxSizeBuffer,files);

            if (fileCheck.status){
                this.maxSizeBuffer = fileCheck.uploadSizeAll ?? 0;
                for (const item of fileCheck.filebase64Array) {
                    switch (type){
                        case 'PHONE':
                            this.listDocFilePhone.push(item)
                            break;
                        case 'SMS':
                            this.listDocFileSMS.push(item);
                            break;
                        case 'LINE':
                            this.listDocFileLINE.push(item);
                            break;
                        case 'FACEBOOK':
                            this.listDocFileFACEBOOK.push(item);
                            break;
                        case 'INSTARGRAM':
                            this.listDocFileINSTARGRAM.push(item);
                            break;
                        case 'WEBSITE':
                            this.listDocFileWEBSITE.push(item);
                            break;
                        case 'EMAIL':
                            this.listDocFileEMAIL.push(item);
                            break;
                        case 'TELEGRAM':
                            this.listDocFileTELEGRAM.push(item);
                            break;
                        case 'WHATAPP':
                            this.listDocFileWHATAPP.push(item);
                            break;
                        case 'OTHERS':
                            this.listDocFileOTHERS.push(item);
                            break;
                        case 'TWITTER':
                            this.listDocFileTWITTER.push(item);
                            break;
                        case 'MESSENGER':
                            this.listDocFileMESSENGER.push(item);
                            break;
                    }
                }
            }
            this.isLoading = false;
        }
    }
    async uploadFileConvertBase64CaseChannel(file){
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            let base64File = {} as any;
            base64File = reader.result;
            const item = {
                storage:"base64",
                name:"file",
                url:base64File,
                size:file.size,
                sizeDetail:this.BytesToSize(file.size),
                type:file.type,
                originalName:file.name,
            };
            this.listDocFile.push(item);
        };
    }
    CaseChannelclose(){
        this.popupCaseChannel = false;
        this.formPopupvillain = {};
        this.formChannelLanguage = {};
        this.dateLineStart  = undefined;
        this.dateFacebookStart = undefined;
        this.dateInstargramStart = undefined;
        this.dateTelegramStart = undefined;
        this.dateWhatappStart = undefined;
        this.dateTwitterStart = undefined;
        this.dateMessengerStart = undefined;
        this.dateLineEnd  = undefined;
        this.dateFacebookEnd = undefined;
        this.dateInstargramEnd = undefined;
        this.dateTelegramEnd = undefined;
        this.dateWhatappEnd = undefined;
        this.dateTwitterEnd = undefined;
        this.dateMessengerEnd = undefined;
        this.dateWebsite = undefined;
        this.dateEmail = undefined;
        this.dateOther = undefined;
        this.datePhone = undefined;
        this.dateSMS = undefined;
        this.listDocFilePhone = [];
        this.listDocFileSMS = [];
        this.listDocFileLINE = [];
        this.listDocFileFACEBOOK = [];
        this.listDocFileINSTARGRAM = [];
        this.listDocFileWEBSITE = [];
        this.listDocFileEMAIL = [];
        this.listDocFileTELEGRAM = [];
        this.listDocFileWHATAPP = [];
        this.listDocFileTWITTER = [];
        this.listDocFileMESSENGER = [];
        this.listDocFileOTHERS = [];
    }
    CriminalDataclose(){
        this.popupCriminalData = false;
        this.formPopup = {};
        // this.formpopupVillainData.instance._refresh();
    }

    ShowInvalidDialog(text){
        Swal.fire({
            title: "ผิดพลาด!",
            text: text,
            icon: "warning",
            confirmButtonText: "Ok",
        }).then(() => {});
    }

    CheckArray(data: any = []){
        const countArray = data.length ?? 0;
        if (countArray > 0){
            return true;
        }
        return false;

    }
    CheckNumberSlash(event) {
        const seperator  = '^[0-9\/]+$';
        const maskSeperator =  new RegExp(seperator , 'g');
        const result =maskSeperator.test(event.key);
        return result;
    }
    PasteCheckNumberSlash(event) {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData.getData('text');
        const seperator  = '^[0-9\/]+$';
        const maskSeperator =  new RegExp(seperator , 'g');
        const result =maskSeperator.test(pastedText);
        return result;
    }
    Back(e){
        this.mainConponent.NextIndex(this.mainConponent.indexTab -1);
    }
    SetFormSubmit(data: any = {}){
        const setData = {};
        for (const key in data) {
            if (data[key] !== null && data[key] !== undefined) {
                setData[key] = data[key];
            }
        }
        return setData;
    }
    SubmitForm(e) {
        if (this.mainConponent.formType === 'add') {
            let formData = {};
            formData = Object.assign({},this.formData);
            if (this.formData.CRIMINAL === 'Y'){
                this.SelectTypeMeet();
                if (!this.formMeetVillain2.instance.validate().isValid) {
                    this.ShowInvalidDialog("กรุณากรอกรูปแบบการพบเจอคนร้ายแบบอื่นๆ");
                    return;
                }
                if(this.formMeetVillainvalidate){
                    Swal.fire({
                        title: "ผิดพลาด!",
                        text: "กรุณาเลือกรูปแบบการพบเจอคนร้าย",
                        icon: "warning",
                        confirmButtonText: "Ok",
                    }).then(() => {});
                    return;
                }
                if(this.formData.CASE_CRIMINAL_MEET.length == 0){
                    this.formData.CASE_CRIMINAL_MEET.push(this.formMeetCriminal);
                }else{
                    this.formData.CASE_CRIMINAL_MEET[0] = this.formMeetCriminal;
                }
            }else if(this.formData.CRIMINAL === 'N'){
                if(this.formMeetCriminal.CASE_CRIMINAL_CLUE_IN != ''){
                    this.formMeetCriminal.CASE_CRIMINAL_MEET_INPERSON = false;
                    this.formMeetCriminal.CASE_CRIMINAL_MEET_VDOCALL = false;
                    this.formMeetCriminal.CASE_CRIMINAL_MEET_WITHNESSEDPERSON = false;
                    this.formMeetCriminal.CASE_CRIMINAL_MEET_WITHNESSEDVDOCALL = false;
                    this.formMeetCriminal.CASE_CRIMINAL_MEET_SOCAIL = false;
                    this.formMeetCriminal.CASE_CRIMINAL_NOT_MEET = false;
                    this.formMeetCriminal.CASE_CRIMINAL_MEET_OTHER = false;
                    if(this.formData.CASE_CRIMINAL_MEET.length == 0){
                        this.formData.CASE_CRIMINAL_MEET.push(this.formMeetCriminal);
                    }else{
                        this.formData.CASE_CRIMINAL_MEET[0] = this.formMeetCriminal;
                    }
                }else{
                    this.formData.CASE_CRIMINAL_MEET.splice(0);
                }
            }
            if (this.formData.CRIMINAL === 'Y'){
                if(this.formData.CASE_CRIMINAL.length <= 0){
                    Swal.fire({
                        title: "ผิดพลาด!",
                        text: "กรุณากรอกข้อมูลคนร้าย",
                        icon: "warning",
                        confirmButtonText: "Ok",
                    }).then(() => {});
                    return;
                }
                if(this.formData.CASE_CHANNEL.length <= 0){
                    Swal.fire({
                        title: "ผิดพลาด!",
                        text: "กรุณากรอกช่องทางการติดต่อคนร้าย",
                        icon: "warning",
                        confirmButtonText: "Ok",
                    }).then(() => {});
                    return;
                }
            }
            const formUpload = {
                // CASE_CRIMINAL_ATTACHMENT:this.uploadFileBufferList ?? [],
            };
            formData = Object.assign({},formUpload,formData);
            this.mainConponent.formDataAll.formVaillain = {};
            this.mainConponent.formDataAll.formVaillain = formData;
            localStorage.setItem("form-villain",JSON.stringify(formData));
            if(e != 'tab'){
                this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
            }

        }else{
            this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
        }

    }

    NameUnknownPattern(params) {
        const seperator = new RegExp('^(ไม่ทราบ|ไม่|ไม่รู้|-|ขีด|ขีด -)', 'g');
        const matched = params.value.match(seperator);
        return !matched;
    }
    IdentificationPattern(params) {

        // console.log(params.value);
        if(params.value != undefined && params.value != null && params.value != ''){
            // console.log(false);
            return params.value.length === 13;
        }else{
            // console.log(true);
            return true;
        }

    }

    CheckString(event) {
        const seperator  = '^[A-Za-zก-๏]+$';
        const maskSeperator =  new RegExp(seperator , 'g');
        const result = maskSeperator.test(event.key);
        return result;
    }

    PhoneNumberPattern(params) {
        const makeScope = new RegExp('^[0](?=[0-9]{9,9}$)', 'g');
        return makeScope.test(params.value);
    }

    EmailValidator(event) {
        const keyAllow = new RegExp('^[a-zA-Z0-9@._-]', 'g');
        const resultAllow = keyAllow.test(event.key);
        return resultAllow;
    }
    EmailPatternCharacters(params) {
        // อีเมลสามารถมีตัวอักษร (a-z), ตัวเลข (0-9) และจุด (.) ได้ แต่ต้องไม่มีเครื่องหมาย &, =, ', +, (,), <, >, * ฯลฯ
        const makeScope = new RegExp('[^a-zA-Z0-9._@-]', 'g');
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
        const makeScope = new RegExp('^[A-Za-z]', 'g');
        const result = params.value.match(makeScope);
        // ชื่อผู้ใช้ให้มีความยาว 6–30 ตัว
        const strLeng = params.value.split('@');
        const checkLength = (strLeng[0].length >= 6 && strLeng[0].length < 35);
        return result && checkLength;
    }
    EmailPatternAtSign(params) {
        // กรุณาใส่เครื่องหมาย @
        const makeScope = new RegExp('@+@?', 'g');
        return makeScope.test(params.value);
    }

    CheckInvalidListDamage() {
        return true;
    }
    SelectTypeChanel(){
        this.formChannelValidate = [this.formPopupvillain.CHANEL_EMAIL, this.formPopupvillain.CHANEL_FACEBOOK ,
            this.formPopupvillain.CHANEL_INSTARGRAM,this.formPopupvillain.CHANEL_LINE,
            this.formPopupvillain.CHANEL_OTHERS,this.formPopupvillain.CHANEL_PHONE,
            this.formPopupvillain.CHANEL_SMS,this.formPopupvillain.CHANEL_TELEGRAM,
            this.formPopupvillain.CHANEL_TWITTER,this.formPopupvillain.CHANEL_MESSENGER,
            this.formPopupvillain.CHANEL_WEBSITE,this.formPopupvillain.CHANEL_WHATAPP].some((value) => value === true) ? false :true;
    }
    SelectTypeMeet(){
        this.formMeetVillainvalidate = [this.formMeetCriminal.CASE_CRIMINAL_MEET_INPERSON,
            this.formMeetCriminal.CASE_CRIMINAL_MEET_VDOCALL,
            this.formMeetCriminal.CASE_CRIMINAL_MEET_WITHNESSEDPERSON,
            this.formMeetCriminal.CASE_CRIMINAL_MEET_WITHNESSEDVDOCALL,
            this.formMeetCriminal.CASE_CRIMINAL_MEET_SOCAIL,
            this.formMeetCriminal.CASE_CRIMINAL_NOT_MEET,
            this.formMeetCriminal.CASE_CRIMINAL_MEET_OTHER].some((value) => value === true) ? false :true;
            if(this.formMeetCriminal.CASE_CRIMINAL_MEET_OTHER){
                if(!this.formMeetCriminal.CASE_CRIMINAL_MEETOTHER_DETAIL){
                    this.formMeetVillainvalidate = true;
                }
            }
    }
    SelectTypeLanguage(){
        // อธิบาย if(this.formPopupvillain.CHANEL == true) { allfalse == true {this.validateLanguage = false}  else {this.validateLanguage = true} else {this.validateLanguage = false}
        // phone
        this.validateLanguagePHONE = this.formPopupvillain.CHANEL_PHONE ?
            [this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_THAI,this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_ENG,
            this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_CHINESS,this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_JAPAN,
            this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_KOREAN,this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_OTHER,
            this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_FROMTRANSLATE].some((value) => value === true) ? false : true
        : false;
        // sms
        this.validateLanguageSMS = this.formPopupvillain.CHANEL_SMS ?
            [this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_THAI,this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_ENG,
            this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_CHINESS,this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_JAPAN,
            this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_KOREAN,this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_OTHER,
            this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_FROMTRANSLATE].some((value) => value === true) ? false : true
        : false;
        // line
        this.validateLanguageLINE = this.formPopupvillain.CHANEL_LINE ?
            [this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_THAI,this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_ENG,
            this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_CHINESS,this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_JAPAN,
            this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_KOREAN,this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_OTHER,
            this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_FROMTRANSLATE].some((value) => value === true) ? false : true
        : false;
        // facebook
        this.validateLanguageFACEBOOK = this.formPopupvillain.CHANEL_FACEBOOK ?
            [this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_THAI,this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_ENG,
            this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_CHINESS,this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_JAPAN,
            this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_KOREAN,this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_OTHER,
            this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_FROMTRANSLATE].some((value) => value === true) ? false : true
        : false;
        // instargram
        this.validateLanguageINSTARGRAM = this.formPopupvillain.CHANEL_INSTARGRAM ?
            [this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_THAI,this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_ENG,
            this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_CHINESS,this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_JAPAN,
            this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_KOREAN,this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_OTHER,
            this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_FROMTRANSLATE].some((value) => value === true) ? false : true
        : false;
        // website
        this.validateLanguageWEBSITE = this.formPopupvillain.CHANEL_WEBSITE ?
            [this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_THAI,this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_ENG,
            this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_CHINESS,this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_JAPAN,
            this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_KOREAN,this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_OTHER,
            this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_FROMTRANSLATE].some((value) => value === true) ? false : true
        : false;
        // email
        this.validateLanguageEMAIL = this.formPopupvillain.CHANEL_EMAIL ?
            [this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_THAI,this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_ENG,
            this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_CHINESS,this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_JAPAN,
            this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_KOREAN,this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_OTHER,
            this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_FROMTRANSLATE].some((value) => value === true) ? false : true
        : false;
        // telegram
        this.validateLanguageTELEGRAM = this.formPopupvillain.CHANEL_TELEGRAM ?
            [this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_THAI,this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_ENG,
            this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_CHINESS,this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_JAPAN,
            this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_KOREAN,this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_OTHER,
            this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_FROMTRANSLATE].some((value) => value === true) ? false : true
        : false;
        // whatapp
        this.validateLanguageWHATAPP = this.formPopupvillain.CHANEL_WHATAPP ?
            [this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_THAI,this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_ENG,
            this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_CHINESS,this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_JAPAN,
            this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_KOREAN,this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_OTHER,
            this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_FROMTRANSLATE].some((value) => value === true) ? false : true
        : false;
        // TWITTER
        this.validateLanguageTWITTER = this.formPopupvillain.CHANEL_TWITTER ?
            [this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_THAI,this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_ENG,
            this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_CHINESS,this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_JAPAN,
            this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_KOREAN,this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_OTHER,
            this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_FROMTRANSLATE].some((value) => value === true) ? false : true
        : false;
        // MESSENGER
        this.validateLanguageMESSENGER = this.formPopupvillain.CHANEL_MESSENGER ?
            [this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_THAI,this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_ENG,
            this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_CHINESS,this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_JAPAN,
            this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_KOREAN,this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_OTHER,
            this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_FROMTRANSLATE].some((value) => value === true) ? false : true
        : false;
        // other
        this.validateLanguageOTHERS = this.formPopupvillain.CHANEL_OTHERS ?
            [this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_THAI,this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_ENG,
            this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_CHINESS,this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_JAPAN,
            this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_KOREAN,this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_OTHER,
            this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_FROMTRANSLATE].some((value) => value === true) ? false : true
        : false;
    }
    FacebookPattern(params) {
        const makeScope = new RegExp('(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/');
        return makeScope.test(params.value);
    }
    setDate(text,when = null){
        if(when == 'start'){
            this.dateLineStart = text == 'line' && this.formPopupvillain.CHANEL_LINE && this.dateLineStart == undefined ? new Date() : this.dateLineStart;
            this.dateFacebookStart = text == 'facebook' && this.formPopupvillain.CHANEL_FACEBOOK && this.dateFacebookStart == undefined? new Date() : this.dateFacebookStart ;
            this.dateInstargramStart = text == 'instargram' && this.formPopupvillain.CHANEL_INSTARGRAM && this.dateInstargramStart == undefined? new Date() : this.dateInstargramStart;
            this.dateTelegramStart = text == 'telegram' && this.formPopupvillain.CHANEL_TELEGRAM && this.dateTelegramStart == undefined? new Date() : this.dateTelegramStart;
            this.dateWhatappStart = text == 'whatsapp' && this.formPopupvillain.CHANEL_WHATAPP && this.dateWhatappStart == undefined? new Date() : this.dateWhatappStart;
            this.dateTwitterStart = text == 'twitter' && this.formPopupvillain.CHANEL_TWITTER && this.dateTwitterStart == undefined? new Date() : this.dateTwitterStart;
            this.dateMessengerStart = text == 'messenger' && this.formPopupvillain.CHANEL_MESSENGER && this.dateMessengerStart == undefined? new Date() : this.dateMessengerStart;
        }else{
            this.dateLineEnd = text == 'line' && this.formPopupvillain.CHANEL_LINE && this.dateLineEnd == undefined ? new Date() : this.dateLineEnd;
            this.dateFacebookEnd = text == 'facebook' && this.formPopupvillain.CHANEL_FACEBOOK && this.dateFacebookEnd == undefined? new Date() : this.dateFacebookEnd ;
            this.dateInstargramEnd = text == 'instargram' && this.formPopupvillain.CHANEL_INSTARGRAM && this.dateInstargramEnd == undefined? new Date() : this.dateInstargramEnd;
            this.dateTelegramEnd = text == 'telegram' && this.formPopupvillain.CHANEL_TELEGRAM && this.dateTelegramEnd == undefined? new Date() : this.dateTelegramEnd;
            this.dateWhatappEnd = text == 'whatsapp' && this.formPopupvillain.CHANEL_WHATAPP && this.dateWhatappEnd == undefined? new Date() : this.dateWhatappEnd;
            this.dateTwitterEnd = text == 'twitter' && this.formPopupvillain.CHANEL_TWITTER && this.dateTwitterEnd == undefined? new Date() : this.dateTwitterEnd;
            this.dateMessengerEnd = text == 'messenger' && this.formPopupvillain.CHANEL_MESSENGER && this.dateMessengerEnd == undefined? new Date() : this.dateMessengerEnd;
            this.dateWebsite = text == 'website' && this.formPopupvillain.CHANEL_WEBSITE && this.dateWebsite == undefined? new Date() : this.dateWebsite;
            this.dateEmail = text == 'email' && this.formPopupvillain.CHANEL_EMAIL && this.dateEmail == undefined?  new Date() :  this.dateEmail;
            this.dateOther = text == 'other' && this.formPopupvillain.CHANEL_OTHERS && this.dateOther == undefined? new Date() : this.dateOther;
        }
    }
    OnSelectDate(e,type,when = null){
        if(e.value){
            const mydate = this.datePipe.transform(e.value, 'yyyy-MM-dd');
            const mytime = this.datePipe.transform(e.value, 'HH:mm:ss');
            if(this.formPopupvillain.CHANEL_LINE && type == "line"){
                if(when=='start'){
                    this.formPopupvillain.CASE_CHANNEL_LINE_TIME_START = mytime;
                    this.formPopupvillain.CASE_CHANNEL_LINE_DATE_START = mydate;
                }else{
                    this.formPopupvillain.CASE_CHANNEL_LINE_TIME_END = mytime;
                    this.formPopupvillain.CASE_CHANNEL_LINE_DATE_END = mydate;
                }
            }
            if(this.formPopupvillain.CHANEL_FACEBOOK && type == "facebook"){
                if(when=='start'){
                    this.formPopupvillain.CASE_CHANNEL_FACEBOOK_TIME_START = mytime;
                    this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DATE_START = mydate;
                }else{
                    this.formPopupvillain.CASE_CHANNEL_FACEBOOK_TIME_END = mytime;
                    this.formPopupvillain.CASE_CHANNEL_FACEBOOK_DATE_END = mydate;
                }
            }
            if(this.formPopupvillain.CHANEL_INSTARGRAM && type == "instargram"){
                if(when=='start'){
                    this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_TIME_START = mytime;
                    this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DATE_START = mydate;
                }else{
                    this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_TIME_END = mytime;
                    this.formPopupvillain.CASE_CHANNEL_INSTARGRAM_DATE_END = mydate;
                }
            }
            if(this.formPopupvillain.CHANEL_TELEGRAM && type == "telegram"){
                if(when=='start'){
                    this.formPopupvillain.CASE_CHANNEL_TELEGRAM_TIME_START = mytime;
                    this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DATE_START = mydate;
                }else{
                    this.formPopupvillain.CASE_CHANNEL_TELEGRAM_TIME_END = mytime;
                    this.formPopupvillain.CASE_CHANNEL_TELEGRAM_DATE_END = mydate;
                }
            }
            if(this.formPopupvillain.CHANEL_WHATAPP && type == "whatsapp"){
                if(when=='start'){
                    this.formPopupvillain.CASE_CHANNEL_WHATSAPP_TIME_START = mytime;
                    this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DATE_START = mydate;
                }else{
                    this.formPopupvillain.CASE_CHANNEL_WHATSAPP_TIME_END = mytime;
                    this.formPopupvillain.CASE_CHANNEL_WHATSAPP_DATE_END = mydate;
                }
            }
            if(this.formPopupvillain.CHANEL_TWITTER && type == "twitter"){
                if(when=='start'){
                    this.formPopupvillain.CASE_CHANNEL_TWITTER_TIME_START = mytime;
                    this.formPopupvillain.CASE_CHANNEL_TWITTER_DATE_START = mydate;
                }else{
                    this.formPopupvillain.CASE_CHANNEL_TWITTER_TIME_END = mytime;
                    this.formPopupvillain.CASE_CHANNEL_TWITTER_DATE_END = mydate;
                }
            }
            if(this.formPopupvillain.CHANEL_MESSENGER && type == "messenger"){
                if(when=='start'){
                    this.formPopupvillain.CASE_CHANNEL_MESSENGER_TIME_START = mytime;
                    this.formPopupvillain.CASE_CHANNEL_MESSENGER_DATE_START = mydate;
                }else{
                    this.formPopupvillain.CASE_CHANNEL_MESSENGER_TIME_END = mytime;
                    this.formPopupvillain.CASE_CHANNEL_MESSENGER_DATE_END = mydate;
                }
            }
            if(this.formPopupvillain.CHANEL_WEBSITE && type == "website"){
                this.formPopupvillain.CASE_CHANNEL_WEBSITE_TIME = mytime;
                this.formPopupvillain.CASE_CHANNEL_WEBSITE_DATE = mydate;
            }
            if(this.formPopupvillain.CHANEL_EMAIL && type == "email"){
                this.formPopupvillain.CASE_CHANNEL_EMAIL_TIME = mytime;
                this.formPopupvillain.CASE_CHANNEL_EMAIL_DATE = mydate;
            }
            if(this.formPopupvillain.CHANEL_OTHERS && type == "other"){
                this.formPopupvillain.CASE_CHANNEL_OTHERS_TIME = mytime;
                this.formPopupvillain.CASE_CHANNEL_OTHERS_DATE = mydate;
            }
            if(this.formPopupvillain.CHANEL_PHONE && type == "phone"){
                this.formChannelPhone.CASE_CHANNEL_PHONE_TIME = mytime;
                this.formChannelPhone.CASE_CHANNEL_PHONE_DATE = mydate;
            }
            if(this.formPopupvillain.CHANEL_SMS && type == "sms"){
                this.formChannelSMS.CASE_CHANNEL_SMS_TIME = mytime;
                this.formChannelSMS.CASE_CHANNEL_SMS_DATE = mydate;
            }
        }
    }
    convertTimezone(time){
        const timeZoneOffset = 7 * 60;
        const timeZoneOffsetMs = 7 * 60 * 60 * 1000;
        const dateWithTimeZone = new Date(time.getTime() + timeZoneOffsetMs);
        const formattedString = dateWithTimeZone.toISOString().replace("Z", `+${timeZoneOffset.toString().padStart(2, "0")}:00`);
        return formattedString;
    }
    ChangeTypelanguage(e,type){
        if (e.value) {
            this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_FROMTRANSLATE = e.value==1 && type=='PHONE' ? true :false;
            this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_FROMTRANSLATE = e.value==1 && type=='SMS' ? true :false;
            this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_FROMTRANSLATE = e.value==1 && type=='LINE' ? true :false;
            this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_FROMTRANSLATE = e.value==1 && type=='FACEBOOK' ? true :false;
            this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_FROMTRANSLATE = e.value==1 && type=='INSTARGRAM' ? true :false;
            this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_FROMTRANSLATE = e.value==1 && type=='WEBSITE' ? true :false;
            this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_FROMTRANSLATE = e.value==1 && type=='EMAIL' ? true :false;
            this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_FROMTRANSLATE = e.value==1 && type=='TELEGRAM' ? true :false;
            this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_FROMTRANSLATE = e.value==1 && type=='WHATAPP' ? true :false;
            this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_FROMTRANSLATE = e.value==1 && type=='TWITTER' ? true :false;
            this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_FROMTRANSLATE = e.value==1 && type=='MESSENGER' ? true :false;
            this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_FROMTRANSLATE = e.value==1 && type=='OTHERS' ? true :false;
            if(this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_FROMTRANSLATE){
                this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_KOREAN = false;
                this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_OTHER = false;
            }else if(this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_FROMTRANSLATE){
                this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_KOREAN = false;
                this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_OTHER = false;
            }else if(this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_FROMTRANSLATE){
                this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_KOREAN = false;
                this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_OTHER = false;
            }else if(this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_FROMTRANSLATE){
                this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_KOREAN = false;
                this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_OTHER = false;
            }else if(this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_FROMTRANSLATE){
                this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_KOREAN = false;
                this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_OTHER = false;
            }else if(this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_FROMTRANSLATE){
                this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_KOREAN = false;
                this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_OTHER = false;
            }else if(this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_FROMTRANSLATE){
                this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_KOREAN = false;
                this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_OTHER = false;
            }else if(this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_FROMTRANSLATE){
                this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_KOREAN = false;
                this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_OTHER = false;
            }else if(this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_FROMTRANSLATE){
                this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_KOREAN = false;
                this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_OTHER = false;
            }else if(this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_FROMTRANSLATE){
                this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_KOREAN = false;
                this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_OTHER = false;
            }else if(this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_FROMTRANSLATE){
                this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_KOREAN = false;
                this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_OTHER = false;
            }else if(this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_FROMTRANSLATE){
                this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_THAI = false;
                this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_ENG = false;
                this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_CHINESS = false;
                this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_JAPAN = false;
                this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_KOREAN = false;
                this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_OTHER = false;
            }
        }
    }

    showLanguage(){
        const thai = [this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_THAI,
            this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_THAI,
            this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_THAI,
            this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_THAI,
            this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_THAI,
            this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_THAI,
            this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_THAI,
            this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_THAI,
            this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_THAI,
            this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_THAI,
            this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_THAI,
            this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_THAI].some((value) => value === true) ? this.showlanguage += "ภาษาไทย"+"<br>" : "";
        const eng = [this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_ENG,
            this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_ENG,
            this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_ENG,
            this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_ENG,
            this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_ENG,
            this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_ENG,
            this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_ENG,
            this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_ENG,
            this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_ENG,
            this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_ENG,
            this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_ENG,
            this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_ENG].some((value) => value === true) ? this.showlanguage += "ภาษาอังกฤษ"+"<br>" : "";
        const chiness = [this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_CHINESS,
            this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_CHINESS,
            this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_CHINESS,
            this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_CHINESS,
            this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_CHINESS,
            this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_CHINESS,
            this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_CHINESS,
            this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_CHINESS,
            this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_CHINESS,
            this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_CHINESS,
            this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_CHINESS,
            this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_CHINESS].some((value) => value === true) ? this.showlanguage += "ภาษาจีน"+"<br>" : "";
        const japan = [this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_JAPAN,
            this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_JAPAN,
            this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_JAPAN,
            this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_JAPAN,
            this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_JAPAN,
            this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_JAPAN,
            this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_JAPAN,
            this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_JAPAN,
            this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_JAPAN,
            this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_JAPAN,
            this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_JAPAN,
            this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_JAPAN].some((value) => value === true) ? this.showlanguage += "ภาษาญี่ปุ่น"+"<br>" : "";
        const korean = [this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_KOREAN,
            this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_KOREAN,
            this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_KOREAN,
            this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_KOREAN,
            this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_KOREAN,
            this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_KOREAN,
            this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_KOREAN,
            this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_KOREAN,
            this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_KOREAN,
            this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_KOREAN,
            this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_KOREAN,
            this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_KOREAN].some((value) => value === true) ? this.showlanguage += "ภาษาเกาหลี"+"<br>" : "";
        const other = [this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_OTHER,
            this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_OTHER,
            this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_OTHER,
            this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_OTHER,
            this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_OTHER,
            this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_OTHER,
            this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_OTHER,
            this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_OTHER,
            this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_OTHER,
            this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_OTHER,
            this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_OTHER,
            this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_OTHER].some((value) => value === true) ? this.showlanguage += "ภาษาอื่น"+"<br>" : "";
        const tramslate = [this.formChannelLanguage.PHONE_CHANNEL_LANGUAGE_FROMTRANSLATE,
            this.formChannelLanguage.SMS_CHANNEL_LANGUAGE_FROMTRANSLATE,
            this.formChannelLanguage.LINE_CHANNEL_LANGUAGE_FROMTRANSLATE,
            this.formChannelLanguage.FACEBOOK_CHANNEL_LANGUAGE_FROMTRANSLATE,
            this.formChannelLanguage.INSTARGRAM_CHANNEL_LANGUAGE_FROMTRANSLATE,
            this.formChannelLanguage.WEBSITE_CHANNEL_LANGUAGE_FROMTRANSLATE,
            this.formChannelLanguage.EMAIL_CHANNEL_LANGUAGE_FROMTRANSLATE,
            this.formChannelLanguage.TELEGRAM_CHANNEL_LANGUAGE_FROMTRANSLATE,
            this.formChannelLanguage.WHATAPP_CHANNEL_LANGUAGE_FROMTRANSLATE,
            this.formChannelLanguage.TWITTER_CHANNEL_LANGUAGE_FROMTRANSLATE,
            this.formChannelLanguage.MESSENGER_CHANNEL_LANGUAGE_FROMTRANSLATE,
            this.formChannelLanguage.OTHERS_CHANNEL_LANGUAGE_FROMTRANSLATE].some((value) => value === true) ? this.showlanguage += "มาจากเครื่องมือแปลภาษา"+"<br>" : "";
        this.languageChannel = this.showlanguage;
    }

    setDefaultShowTextChannel(data) {
        const channelDetails = [];
        const channelNames = [];

        function appendChannelDetail(type, name, id, url) {
            if (name !== null) {
              channelDetails.push(`<b>${type}:</b> ${name}<br>`);
            }
            if (id !== null) {
              channelDetails.push(`<b>${type} ID:</b> ${id}<br>`);
            }
            if (url !== null) {
              channelDetails.push(`<b>${type} URL:</b> ${url}<br>`);
            }
        }

        if (data.CHANEL_LINE) {
          appendChannelDetail('LINE', data.CASE_CHANNEL_LINE_DETAIL_NAME, data.CASE_CHANNEL_LINE_DETAIL_ID, data.CASE_CHANNEL_LINE_DETAIL_URL);
          channelNames.push('LINE');
        }
        if (data.CHANEL_FACEBOOK) {
          appendChannelDetail('FACEBOOK', data.CASE_CHANNEL_FACEBOOK_DETAIL_NAME, data.CASE_CHANNEL_FACEBOOK_DETAIL_ID, data.CASE_CHANNEL_FACEBOOK_DETAIL_URL);
          channelNames.push('FACEBOOK');
        }
        if(data.CHANEL_MESSENGER){
            appendChannelDetail('MESSENGER', data.CASE_CHANNEL_MESSENGER_DETAIL_NAME, data.CASE_CHANNEL_MESSENGER_DETAIL_ID, data.CASE_CHANNEL_MESSENGER_DETAIL_URL);
            channelNames.push('MESSENGER');
        }
        if(data.CHANEL_INSTARGRAM){
            appendChannelDetail('INSTAGRAM', data.CASE_CHANNEL_INSTARGRAM_DETAIL_NAME, data.CASE_CHANNEL_INSTARGRAM_DETAIL_ID, data.CASE_CHANNEL_INSTARGRAM_DETAIL_URL);
            channelNames.push('INSTAGRAM');
        }
        if(data.CHANEL_WEBSITE){
            channelDetails.push(`<b>WEBSITE URL:</b> ${data.CASE_CHANNEL_WEBSITE_DETAIL}<br>`);
            channelNames.push('WEBSITE');
        }
        if(data.CHANEL_EMAIL){
            channelDetails.push(`<b></b>EMAIL:</b> ${data.CASE_CHANNEL_EMAIL_DETAIL}<br>`);
            channelNames.push('EMAIL');
        }
        if(data.CHANEL_TELEGRAM){
            appendChannelDetail('TELEGRAM', data.CASE_CHANNEL_TELEGRAM_DETAIL_NAME, data.CASE_CHANNEL_TELEGRAM_DETAIL_ID, data.CASE_CHANNEL_TELEGRAM_DETAIL_URL);
            channelNames.push('TELEGRAM');
        }
        if(data.CHANEL_WHATAPP){
            appendChannelDetail('WHATSAPP', data.CASE_CHANNEL_WHATSAPP_DETAIL_NAME, data.CASE_CHANNEL_WHATSAPP_DETAIL_ID, data.CASE_CHANNEL_WHATSAPP_DETAIL_URL);
            channelNames.push('WHATSAPP');
        }
        if(data.CHANEL_TWITTER){
            appendChannelDetail('TWITTER', data.CASE_CHANNEL_TWITTER_DETAIL_NAME, data.CASE_CHANNEL_TWITTER_DETAIL_ID, data.CASE_CHANNEL_TWITTER_DETAIL_URL);
            channelNames.push('TWITTER');
        }
        if (data.CHANEL_OTHERS) {
          if (data.CASE_CHANNEL_OTHER_TYPE !== null) {
            channelDetails.push(`<b>ประเภทช่องทาง:</b> ${data.CASE_CHANNEL_OTHER_TYPE}<br>`);
          }
          if (data.CASE_CHANNEL_OTHER_DETAIL !== null) {
            channelDetails.push(`<b>URL/ID:</b> ${data.CASE_CHANNEL_OTHER_DETAIL}`);
          }
          channelNames.push('อื่นๆ');
        }

        const showtext_channel = channelDetails.join('');
        const channel_name = channelNames.join(', ');

        return { showtext_channel, channel_name };
    }

    setDefaultShowTextLanguage(data){
        let showlanguage_channel = ""
        showlanguage_channel +=  this.generateLanguageString('ภาษาไทย',[data.PHONE_CHANNEL_LANGUAGE_THAI,
            data.SMS_CHANNEL_LANGUAGE_THAI,
            data.LINE_CHANNEL_LANGUAGE_THAI,
            data.FACEBOOK_CHANNEL_LANGUAGE_THAI,
            data.INSTARGRAM_CHANNEL_LANGUAGE_THAI,
            data.WEBSITE_CHANNEL_LANGUAGE_THAI,
            data.EMAIL_CHANNEL_LANGUAGE_THAI,
            data.TELEGRAM_CHANNEL_LANGUAGE_THAI,
            data.WHATAPP_CHANNEL_LANGUAGE_THAI,
            data.TWITTER_CHANNEL_LANGUAGE_THAI,
            data.MESSENGER_CHANNEL_LANGUAGE_THAI,
            data.OTHERS_CHANNEL_LANGUAGE_THAI]);
        showlanguage_channel +=  this.generateLanguageString('ภาษาอังกฤษ',[data.PHONE_CHANNEL_LANGUAGE_ENG,
            data.SMS_CHANNEL_LANGUAGE_ENG,
            data.LINE_CHANNEL_LANGUAGE_ENG,
            data.FACEBOOK_CHANNEL_LANGUAGE_ENG,
            data.INSTARGRAM_CHANNEL_LANGUAGE_ENG,
            data.WEBSITE_CHANNEL_LANGUAGE_ENG,
            data.EMAIL_CHANNEL_LANGUAGE_ENG,
            data.TELEGRAM_CHANNEL_LANGUAGE_ENG,
            data.WHATAPP_CHANNEL_LANGUAGE_ENG,
            data.TWITTER_CHANNEL_LANGUAGE_ENG,
            data.MESSENGER_CHANNEL_LANGUAGE_ENG,
            data.OTHERS_CHANNEL_LANGUAGE_ENG]);
        showlanguage_channel +=  this.generateLanguageString('ภาษาจีน',[data.PHONE_CHANNEL_LANGUAGE_CHINESS,
            data.SMS_CHANNEL_LANGUAGE_CHINESS,
            data.LINE_CHANNEL_LANGUAGE_CHINESS,
            data.FACEBOOK_CHANNEL_LANGUAGE_CHINESS,
            data.INSTARGRAM_CHANNEL_LANGUAGE_CHINESS,
            data.WEBSITE_CHANNEL_LANGUAGE_CHINESS,
            data.EMAIL_CHANNEL_LANGUAGE_CHINESS,
            data.TELEGRAM_CHANNEL_LANGUAGE_CHINESS,
            data.WHATAPP_CHANNEL_LANGUAGE_CHINESS,
            data.TWITTER_CHANNEL_LANGUAGE_CHINESS,
            data.MESSENGER_CHANNEL_LANGUAGE_CHINESS,
            data.OTHERS_CHANNEL_LANGUAGE_CHINESS]);
        showlanguage_channel +=  this.generateLanguageString('ภาษาญี่ปุ่น',[data.PHONE_CHANNEL_LANGUAGE_JAPAN,
            data.SMS_CHANNEL_LANGUAGE_JAPAN,
            data.LINE_CHANNEL_LANGUAGE_JAPAN,
            data.FACEBOOK_CHANNEL_LANGUAGE_JAPAN,
            data.INSTARGRAM_CHANNEL_LANGUAGE_JAPAN,
            data.WEBSITE_CHANNEL_LANGUAGE_JAPAN,
            data.EMAIL_CHANNEL_LANGUAGE_JAPAN,
            data.TELEGRAM_CHANNEL_LANGUAGE_JAPAN,
            data.WHATAPP_CHANNEL_LANGUAGE_JAPAN,
            data.TWITTER_CHANNEL_LANGUAGE_JAPAN,
            data.MESSENGER_CHANNEL_LANGUAGE_JAPAN,
            data.OTHERS_CHANNEL_LANGUAGE_JAPAN]);
        showlanguage_channel += this.generateLanguageString('ภาษาเกาหลี',[data.PHONE_CHANNEL_LANGUAGE_KOREAN,
            data.SMS_CHANNEL_LANGUAGE_KOREAN,
            data.LINE_CHANNEL_LANGUAGE_KOREAN,
            data.FACEBOOK_CHANNEL_LANGUAGE_KOREAN,
            data.INSTARGRAM_CHANNEL_LANGUAGE_KOREAN,
            data.WEBSITE_CHANNEL_LANGUAGE_KOREAN,
            data.EMAIL_CHANNEL_LANGUAGE_KOREAN,
            data.TELEGRAM_CHANNEL_LANGUAGE_KOREAN,
            data.WHATAPP_CHANNEL_LANGUAGE_KOREAN,
            data.TWITTER_CHANNEL_LANGUAGE_KOREAN,
            data.MESSENGER_CHANNEL_LANGUAGE_KOREAN,
            data.OTHERS_CHANNEL_LANGUAGE_KOREAN]);
        showlanguage_channel += this.generateLanguageString('ภาษาอื่น',[data.PHONE_CHANNEL_LANGUAGE_OTHER,
            data.SMS_CHANNEL_LANGUAGE_OTHER,
            data.LINE_CHANNEL_LANGUAGE_OTHER,
            data.FACEBOOK_CHANNEL_LANGUAGE_OTHER,
            data.INSTARGRAM_CHANNEL_LANGUAGE_OTHER,
            data.WEBSITE_CHANNEL_LANGUAGE_OTHER,
            data.EMAIL_CHANNEL_LANGUAGE_OTHER,
            data.TELEGRAM_CHANNEL_LANGUAGE_OTHER,
            data.WHATAPP_CHANNEL_LANGUAGE_OTHER,
            data.TWITTER_CHANNEL_LANGUAGE_OTHER,
            data.MESSENGER_CHANNEL_LANGUAGE_OTHER,
            data.OTHERS_CHANNEL_LANGUAGE_OTHER]);
        showlanguage_channel += this.generateLanguageString('มาจากเครื่องมือแปลภาษา',[data.PHONE_CHANNEL_LANGUAGE_FROMTRANSLATE,
            data.SMS_CHANNEL_LANGUAGE_FROMTRANSLATE,
            data.LINE_CHANNEL_LANGUAGE_FROMTRANSLATE,
            data.FACEBOOK_CHANNEL_LANGUAGE_FROMTRANSLATE,
            data.INSTARGRAM_CHANNEL_LANGUAGE_FROMTRANSLATE,
            data.WEBSITE_CHANNEL_LANGUAGE_FROMTRANSLATE,
            data.EMAIL_CHANNEL_LANGUAGE_FROMTRANSLATE,
            data.TELEGRAM_CHANNEL_LANGUAGE_FROMTRANSLATE,
            data.WHATAPP_CHANNEL_LANGUAGE_FROMTRANSLATE,
            data.TWITTER_CHANNEL_LANGUAGE_FROMTRANSLATE,
            data.MESSENGER_CHANNEL_LANGUAGE_FROMTRANSLATE,
            data.OTHERS_CHANNEL_LANGUAGE_FROMTRANSLATE]);
        return showlanguage_channel;
    }

    generateLanguageString(languageName: string, languageProperties: boolean[]): string {
        if (languageProperties.some(value => value === true)) {
          return `${languageName}<br>`;
        }
        return '';
    }

}

