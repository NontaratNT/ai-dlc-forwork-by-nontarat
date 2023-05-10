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
import { FormValidatorService } from "src/app/services/form-validator.service";

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

    public mainConponent: IssueOnlineContainerComponent;
    tablePaging = [10, 20, 50,'all'];
    criminalType = [
        {ID:1,TEXT:"ทราบ"},
        {ID:2,TEXT:"ไม่ทราบ"},
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
    isLoading = false;
    personalInfo: any = {};
    formData: any = {};
    formCriminal: any = {};
    defaultCriminalType = 1;
    presentAddress: any = {};
    province = [];
    listCaseChannel = [];
    uploadFileBufferStatus = true;
    uploadFileBuffer: any = {};
    uploadFileBufferList: any = [];
    uploadFileRefresh = true;
    formPopup: any = {};
    socialPopup = false;
    popupCaseChannel = false;
    popupType = 'add';
    popupIndex = 0;
    listDocFile: any = [];
    formDataUploadDoc: any = {};
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

    maxSizeBuffer = 0;

    constructor(
        private servicePersonal: PersonalService,
        private serviceProvince: ProvinceService,
        private serviceDistrict: DistrictService,
        private serviceSubDistrict: SubdistrictService,
        private servBankInfo: BankInfoService,
        private _issueFile: IssueOnlineFileUploadService,
        private _formValidate: FormValidatorService,

    ) {
        this.onReorder = this.onReorder.bind(this);
    }

    ngOnInit(): void {
        const userId = User.Current.PersonalId;
        this.isLoading = true;
        this.uploadFileBufferList = [];
        this.servicePersonal
            .GetPersonalById(userId)
            .subscribe((_) => {
                this.personalInfo = _;
                this.SetDefault();
            });

    }
    async SetDefault(){
        this.uploadFileBufferStatus = false;
        this.province  = await this.serviceProvince.GetProvince().toPromise();
        this.listCaseChannel  = await this.servBankInfo.GetCaseChannel().toPromise();
        // this.servBankInfo.GetCaseChannel().subscribe((_) => (this.listCaseChannel = _));
        if (this.mainConponent.formType === 'add') {
            this.presentAddress.disableDistrict = true;
            this.presentAddress.disableSubDistrict = true;
            this.presentAddress.disablepostcode = true;

            this.formType = "add";
            this.formReadOnly = false;
            this.formAddData = true;
            this.formValidate = true;

            this.uploadFileBufferList = [];
            this.formCriminal = {};
            this.formData = {};
            this.formData.CRIMINAL= 'Y';
            this.formData.CASE_CHANNEL= [];

        }else{
            this.formType = "edit";
            this.formReadOnly = true;
            this.formAddData = false;
            this.formValidate = false;

            this.uploadFileBufferList = [];
            this.formCriminal = {};
            this.formData = {};
            const dataForm = this.mainConponent.formDataInsert;
            this.defaultCriminalType = dataForm.CRIMINAL === 'Y'? 1 : 2;

            if (dataForm.CASE_CRIMINAL_PROVINCE) {
                this.presentAddress.district = await this.serviceProvince
                    .GetDistrictofProvince(dataForm.CASE_CRIMINAL_PROVINCE)
                    .toPromise();
                this.presentAddress.disableDistrict = false;

            }
            if (dataForm.CASE_CRIMINAL_DISTRICT_ID) {
                this.presentAddress.subDistrict = await this.serviceDistrict
                    .GetSubDistrictOfDistrict(dataForm.CASE_CRIMINAL_DISTRICT_ID)
                    .toPromise();
                this.presentAddress.disableSubDistrict = false;

            }
            if (dataForm.CASE_CRIMINAL_SUB_DISTRICT_ID) {
                this.presentAddress.postcode = await this.serviceSubDistrict
                    .GetPostCode(dataForm.CASE_CRIMINAL_SUB_DISTRICT_ID)
                    .toPromise();
                this.presentAddress.disablepostcode = false;

            }

            this.formData = dataForm;
            this.formCriminal = dataForm;
            this.uploadFileBufferList = dataForm.CASE_CRIMINAL_ATTACHMENT ?? [];

        }
        this.isLoading = false;
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
                this.formCriminal.CASE_CRIMINAL_PROVINCE = data.PROVINCE_ID;
                this.formCriminal.CASE_CRIMINAL_PROVINCE_NAME_THA = data.PROVINCE_NAME_THA;
            }else{
                this.formCriminal.CASE_CRIMINAL_PROVINCE = e.value;
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

    // POPUP CASE CHANNEL START
    CaseChannelAddData(){
        this.popupType = 'add';
        this.popupCaseChannel = true;
        const d = this.listCaseChannel[0] ?? null;
        this.formPopup = {
            CHANNEL_ID:d.CHANNEL_ID,
            CHANNEL_NAME:d.CHANNEL_NAME,
            CASE_CHANNEL_DATETIME_MATCH:false
        };
        this.showcaseCode = d.CHANNEL_CODE;
        this.showcaseOption = d.CHANNEL_OPTION_FLAG;
        this.showCaseLabelName = d.CHANNEL_DETAIL1;
        this.showcaseLabelID = d.CHANNEL_DETAIL2;
        this.listDocFile = [];
        this.maxSizeBuffer = this.limitCaseChanelSize ?? 0;

    }
    async CaseChannelSetDoc(data: any = []){
        this.listDocFile = data.CHANNEL_DOC ?? [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            this.listDocFile.push(item);
        }
        return ;
    }
    async CaseChannelEditData(type, data = {} as any, index = null){
        this.isLoading = true;
        this.popupType = 'edit';
        this.popupCaseChannel = true;
        this.popupIndex = index;
        this.formPopup = {};
        // RELOAD AFTER
        // this.formCaseChannel.instance._refresh();
        const setData = {};
        const d = data;
        for (const key in d) {
            if (d[key] !== null && d[key] !== undefined) {
                if (key === 'CHANNEL_DOC'){
                    await this.CaseChannelSetDoc(d[key]);
                }else{
                    setData[key] = d[key];
                }
            }
        }
        this.formPopup = setData;
        const optionCaseChannel = this.listCaseChannel.filter(r => r.CHANNEL_ID === this.formPopup.CHANNEL_ID) ?? null;
        const caseOption = optionCaseChannel[0] ?? null;
        this.showCaseLabelName = caseOption.CHANNEL_DETAIL1;
        this.showcaseLabelID = caseOption.CHANNEL_DETAIL2;
        this.showcaseCode = caseOption.CHANNEL_CODE;
        this.showcaseOption = caseOption.CHANNEL_OPTION_FLAG;

        this.maxSizeBuffer = this.limitCaseChanelSize ?? 0;

        this.isLoading = false;
        // setTimeout(async ()=>{

        // }, 1000);

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
                CASE_CHANNEL_REFER_URL:d.CASE_CHANNEL_REFER_URL ?? "",
                CHANNEL_DOC:this.listDocFile ?? []
            });
        }else{
            this.formData.CASE_CHANNEL[this.popupIndex] = {
                CHANNEL_ID:d.CHANNEL_ID ?? 0,
                CHANNEL_NAME:d.CHANNEL_NAME,
                CASE_CHANNEL_NAME:d.CASE_CHANNEL_NAME,
                CHANNEL_OTHER:d.CHANNEL_OTHER,
                CASE_CHANNEL_REFER_ID:d.CASE_CHANNEL_REFER_ID,
                CASE_CHANNEL_REFER_URL:d.CASE_CHANNEL_REFER_URL ?? "",
                CHANNEL_DOC:this.listDocFile ?? []
            };

        }
        this.limitCaseChanelSize = this.maxSizeBuffer ?? 0;
        this.CaseChannelclose();

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
    CaseChannelDeleteDataDocFile(index = null){
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
                this.maxSizeBuffer -= this.listDocFile[index].size ?? 0;
                this.listDocFile.splice(index, 1);
            }
        });
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

            }else{
                this.formPopup.CHANNEL_ID = e.value;
            }

        }
    }
    OpenFileDialogCaseChannel(uploadTag) {
        uploadTag.value = "";
        uploadTag.click();
    }
    // async UploadFileCaseChannel(uploadTag) {
    //     const files: FileList = uploadTag.files;
    //     if (files.length > 0) {
    //         const checkAllow = this._issueFile.CheckFileUploadClick(files);
    //         if (checkAllow){
    //             this.isLoading = true;
    //             // eslint-disable-next-line @typescript-eslint/prefer-for-of
    //             for (let index = 0; index < files.length; index++) {
    //                 const item = files[index];
    //                 await this.uploadFileConvertBase64CaseChannel(item);
    //             }
    //             this.isLoading = false;
    //             // console.log('files',files);
    //         }


    //     }
    // }
    // async FilesDroppedCaseChannel(e) {
    //     const files = e;
    //     if (files.length > 0) {
    //         const checkAllow = this._issueFile.CheckFileUploadDrop(files);
    //         if (checkAllow){
    //             // this.ConvertBase64(files[0].file);
    //             this.isLoading = true;
    //             // eslint-disable-next-line @typescript-eslint/prefer-for-of
    //             for (let index = 0; index < files.length; index++) {
    //                 const item = files[index].file;
    //                 await this.uploadFileConvertBase64CaseChannel(item);
    //             }
    //             this.isLoading = false;
    //         }


    //     }
    // }
    // async uploadFileConvertBase64CaseChannel(file){
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onload = () => {
    //         let base64File = {} as any;
    //         base64File = reader.result;
    //         const item = {
    //             storage:"base64",
    //             name:"file",
    //             url:base64File,
    //             size:file.size,
    //             sizeDetail:this.BytesToSize(file.size),
    //             type:file.type,
    //             originalName:file.name,
    //         };
    //         this.listDocFile.push(item);
    //     };
    // }

    async UploadFileCaseChannel(uploadTag) {
        const files: any = uploadTag.files;
        if (files.length > 0) {
            this.isLoading = true;
            const fileCheck = await this._issueFile.CheckFileUploadAllowListSizeDialog(this.maxSizeBuffer,files);

            if (fileCheck.status){
                this.maxSizeBuffer = fileCheck.uploadSizeAll ?? 0;
                for (const item of fileCheck.filebase64Array) {
                    this.listDocFile.push(item);
                }
            }
            this.isLoading = false;

        }
    }
    async FilesDroppedCaseChannel(e) {
        const files = e;
        if (files.length > 0) {
            this.isLoading = true;
            const fileCheck = await this._issueFile.CheckFileUploadAllowListSizeDrop(this.maxSizeBuffer,files);

            if (fileCheck.status){
                this.maxSizeBuffer = fileCheck.uploadSizeAll ?? 0;
                for (const item of fileCheck.filebase64Array) {
                    this.listDocFile.push(item);
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
        this.formPopup = {};
        this.formCaseChannel.instance._refresh();
    }
    // POPUP CASE CHANNEL END
    ShowInvalidDialog(){
        Swal.fire({
            title: "ผิดพลาด!",
            text: "กรุณากรอกข้อมูลให้ครบ",
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
    // SubmitForm(e) {
    //     if (this.mainConponent.formType === 'add') {
    //         let formData = {};
    //         formData = Object.assign({},this.formData);
    //         if (this.formData.CRIMINAL === 'Y'){
    //             if (!this.formVillain1.instance.validate().isValid) {
    //                 this.ShowInvalidDialog();
    //                 return;
    //             }

    //             // console.log('this.formCriminal->>>>',this.formCriminal);
    //             // console.log('this.formUpload->>>>',formUpload);
    //             // console.log('this.formData->>>>',formData);
    //         }
    //         // const setData = this.SetFormSubmit(formData);
    //         // this.mainConponent.MergeObj(setData);
    //         const formUpload = {
    //             CASE_CRIMINAL_ATTACHMENT:this.uploadFileBufferList ?? [],
    //         };
    //         formData = Object.assign({},this.formCriminal,formUpload,formData);
    //         this.mainConponent.formDataAll.formVaillain = {};
    //         this.mainConponent.formDataAll.formVaillain = formData;
    //         this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);

    //     }

    // }
    SubmitForm(e) {
        if (this.mainConponent.formType === 'add') {
            let formData = {};
            formData = Object.assign({},this.formData);
            if (this.formData.CRIMINAL === 'Y'){
                this.formVillain1.instance.validate();
                if (!this.formVillain1.instance.validate().isValid){
                    this._formValidate.ValidateForm(this.formVillain1.instance.validate().brokenRules);
                    return;
                }

                // console.log('this.formCriminal->>>>',this.formCriminal);
                // console.log('this.formUpload->>>>',formUpload);
                // console.log('this.formData->>>>',formData);
            }
            // const setData = this.SetFormSubmit(formData);
            // this.mainConponent.MergeObj(setData);
            const formUpload = {
                CASE_CRIMINAL_ATTACHMENT:this.uploadFileBufferList ?? [],
            };
            formData = Object.assign({},this.formCriminal,formUpload,formData);
            this.mainConponent.formDataAll.formVaillain = {};
            this.mainConponent.formDataAll.formVaillain = formData;
            this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);

        }

    }

    NameUnknownPattern(params) {
        const seperator = new RegExp('^(ไม่ทราบ|ไม่|ไม่รู้|-|ขีด|ขีด -)', 'g');
        const matched = params.value.match(seperator) 
        return !matched
    }
    IdentificationPattern(params) {

        // console.log(params.value);
        if(params.value != undefined && params.value != null && params.value != ''){
            // console.log(false);
            return params.value.length === 13
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

}
