import { IssueOnlineContainerComponent } from './../issue-online-container.component';
import { Component, DoCheck, OnInit, ViewChild } from '@angular/core';
import { BankInfoService } from 'src/app/services/bank-info.service';
import { DxFormComponent, DxSelectBoxComponent, DxTextBoxComponent } from 'devextreme-angular';
import Swal from 'sweetalert2';
import { FormValidatorService } from 'src/app/services/form-validator.service';
import { DatePipe } from '@angular/common';
import { IssueOnlineService } from 'src/app/services/issue-online.service';
import { IssueOnlineFileUploadService } from 'src/app/services/issue-online-file-upload.service';
import { OnlineCaseService } from 'src/app/services/online-case.service';
import { User } from 'src/app/services/user';
import { finalize, switchMap } from 'rxjs/operators';
import { ValidateUrl } from 'src/app/common/helper';

@Component({
    selector: 'app-issue-online-criminal-contact-info-event',
    templateUrl: './issue-online-criminal-contact-info.component.html',
    styleUrls: ['./issue-online-criminal-contact-info.component.scss']
})
export class IssueOnlineCriminalContatInfoComponent implements OnInit, DoCheck {

    public mainConponent: IssueOnlineContainerComponent;
    @ViewChild("selectCaseType", { static: false }) selectCaseType: DxSelectBoxComponent;
    @ViewChild("formEvent1", { static: false }) formEvent1: DxFormComponent;
    @ViewChild("formPhone", { static: false }) formPhone: DxFormComponent;
    @ViewChild("formSms", { static: false }) formSms: DxFormComponent;
    @ViewChild("formOther", { static: false }) formOther: DxFormComponent;

    formReadOnly: false;
    formData: any = {};
    listCaseType = [];
    caseType = "";
    caseOpen = false;
    isLoading = false;
    formChannelValidate = true;
    dataAttachment: any = [];
    maxDateValue: Date = new Date();
    maxSizeBuffer = 0;
    _fileName: string;
    popupFormUploaded = false;
    _fileSize: number;
    _fileForm: any = {};
    popupAttachment = false;

    serviceLabelID = [
        { ID: 1, TEXT: "AIS" },
        { ID: 2, TEXT: "TRUE" },
        { ID: 3, TEXT: "DTAC" },
        { ID: 4, TEXT: "NT (CAT TOT)" },
        { ID: 5, TEXT: "อื่น ๆ" }
    ];

    destinationType = [
        {ID: 1, TEXT: "หมายเลขโทรศัพท์"},
        {ID: 2, TEXT: "ชื่อผู้ส่ง"}
    ];

    socialType = [
        'LINE',
        'FACEBOOK',
        // 'MESSENGER',
        'INSTAGRAM',
        'WEBSITE',
        // 'EMAIL',
        // 'TELEGRAM',
        // 'WHATSAPP',
        'TWITTER',
        'อื่นๆ',
    ];

    fileType = [
        'เบอร์โทรศัพท์',
        'SMS',
        'LINE',
        'FACEBOOK',
        // 'MESSENGER',
        'INSTAGRAM',
        'WEBSITE',
        // 'EMAIL',
        // 'TELEGRAM',
        // 'WHATSAPP',
        'TWITTER',
        'อื่นๆ'
    ];
    typeSelected = [];
    fileTypeSelectedValue = '';
    fileTypeSelected = false;

    appState: {
        checkOtherTel: boolean;
        checkOtherSms: boolean;
        checkOtherSocial: boolean;
    } = {
        checkOtherTel: false,
        checkOtherSms: false,
        checkOtherSocial: false
    };

    isOCPB = false;

    constructor(
        private servBankInfo: BankInfoService,
        private _formValidate: FormValidatorService,
        private _issueFile: IssueOnlineFileUploadService,
        private datePipe: DatePipe,
        private issueOnlineService: IssueOnlineService,
        private _OnlineCaseService: OnlineCaseService,
    ) { }

    ngOnInit(): void {
        // this.isLoading = true;
        this.maxDateValue.setHours(this.maxDateValue.getHours() + 1);
        this.formData.CRIMINAL_TEL = false;
        this.formData.CRIMINAL_SMS = false;
        this.formData.CRIMINAL_OTHER = false;
        this.formData.CASE_TYPE_ID = null;
        if (localStorage.getItem("form-blessing")) {
            const dataCheck = JSON.parse(localStorage.getItem("form-blessing"));
            console.log(dataCheck);
            if (dataCheck?.IsOCPB) {
                this.isOCPB = true;
            }
        }
        // this.formData.CRIMINAL_SMS_DESTINATION_TYPE = "หมายเลขโทรศัพท์";
        // this.servBankInfo.GetCaseType().subscribe((_) => {
        // this.listCaseType = _;
        // this.isLoading = false;
        //   }, error => {
        //     if (error.status === 500 || error.status === 524) {
        //       this.mainConponent.checkReload(2);
        //     }
        //   });
    }

    ngDoCheck(): void {
        // Update `checkOtherTel` based on `CRIMINAL_TEL_PROVIDER` and clear details if not 'อื่น ๆ'
        this.appState.checkOtherTel = this.formData.CRIMINAL_TEL_PROVIDER === 'อื่น ๆ';
        if (!this.appState.checkOtherTel) {
            this.formData.CRIMINAL_TEL_PROVIDER_DETAIL = '';
        }
    
        // Update `checkOtherSms` based on `CRIMINAL_SMS_PROVIDER` and clear details if not 'อื่น ๆ'
        this.appState.checkOtherSms = this.formData.CRIMINAL_SMS_PROVIDER === 'อื่น ๆ';
        if (!this.appState.checkOtherSms) {
            this.formData.CRIMINAL_SMS_PROVIDER_DETAIL = '';
        }
    
        // Update `checkOtherSocial` based on `CRIMINAL_TYPE_SOCIAL`
        this.appState.checkOtherSocial = this.formData.CRIMINAL_TYPE_SOCIAL === 'อื่นๆ';
    
        // Update `fileTypeSelected` based on `fileTypeSelectedValue`
        this.fileTypeSelected = this.fileTypeSelectedValue !== '';
    
        // Process SMS date and time if `CRIMINAL_SMS_DATE_FULL` exists
        if (this.formData.CRIMINAL_SMS_DATE_FULL) {
            this.formData.CRIMINAL_SMS_DATE = this.datePipe.transform(
                this.formData.CRIMINAL_SMS_DATE_FULL,
                'yyyy-MM-dd'
            );
            this.formData.CRIMINAL_SMS_TIME = this.datePipe.transform(
                this.formData.CRIMINAL_SMS_DATE_FULL,
                'HH:mm:ss'
            );
        }
    
        // Process TEL date and time if `CRIMINAL_TEL_DATE_FULL` exists
        if (this.formData.CRIMINAL_TEL_DATE_FULL) {
            this.formData.CRIMINAL_TEL_DATE = this.datePipe.transform(
                this.formData.CRIMINAL_TEL_DATE_FULL,
                'yyyy-MM-dd'
            );
            this.formData.CRIMINAL_TEL_TIME = this.datePipe.transform(
                this.formData.CRIMINAL_TEL_DATE_FULL,
                'HH:mm:ss'
            );
        }
    }

    async OnSelectCaseType(e) {
        if (e.value) {
            const data = this.selectCaseType.instance.option("selectedItem");
            if (data) {
                this.formData.CASE_TYPE_ID = data.CASE_TYPE_ID;
                this.formData.CASE_TYPE_NAME = data.CASE_TYPE_NAME;
                this.caseType = data.CASE_TYPE_DESC;
                this.caseOpen = true;
            } else {
                this.formData.CASE_TYPE_ID = e.value;
            }
        }
    }

    SelectTypeChanel() {
        this.formChannelValidate = [this.formData.CHANEL_PHONE, this.formData.CHANEL_SMS,
            this.formData.CHANEL_LINE,].some((value) => value === true) ? false : true;
    }

    SubmitForm(e) {
        if (!this.formEvent1.instance.validate().isValid) {
            this._formValidate.ValidateForm(
                this.formEvent1.instance.validate().brokenRules
            );
            return;
        }
        if (this.formData.CRIMINAL_TEL) {
            if (!this.formPhone.instance.validate().isValid) {
                this._formValidate.ValidateForm(
                    this.formPhone.instance.validate().brokenRules
                );
                return;
            }
            if (this.formData.CRIMINAL_TEL_PROVIDER === 'อื่น ๆ') {
                if (this.formData.CRIMINAL_TEL_PROVIDER_DETAIL === null ||
                    this.formData.CRIMINAL_TEL_PROVIDER_DETAIL === undefined ||
                    this.formData.CRIMINAL_TEL_PROVIDER_DETAIL === "") {
                    Swal.fire({
                        icon: 'error',
                        title: 'กรอกข้อมูลไม่ครบ',
                        html: 'กรุณากรอกชื่อค่ายโทรศัพท์ผู้เสียหายอื่นๆ'
                    });
                    return;
                }
            }
            // else{
            //     this.formData.CRIMINAL_TEL_PROVIDER_DETAIL = this.formData.CRIMINAL_TEL_PROVIDER;
            // }
        } else {
            this.formData.CRIMINAL_TEL_ORIGIN = null;
            this.formData.CRIMINAL_TEL_PROVIDER = null;
            this.formData.CRIMINAL_TEL_DESTINATION = null;
            this.formData.CRIMINAL_TEL_DATE = null;
            this.formData.CRIMINAL_TEL_TIME = null;
        }
        if (this.formData.CRIMINAL_SMS) {
            if (!this.formSms.instance.validate().isValid) {
                this._formValidate.ValidateForm(
                    this.formSms.instance.validate().brokenRules
                );
                return;
            }
            if (this.formData.CRIMINAL_SMS_PROVIDER === 'อื่น ๆ') {
                if (this.formData.CRIMINAL_SMS_PROVIDER_DETAIL === null &&
                    this.formData.CRIMINAL_SMS_PROVIDER_DETAIL === undefined &&
                    this.formData.CRIMINAL_SMS_PROVIDER_DETAIL === "") {
                    Swal.fire({
                        icon: 'error',
                        title: 'กรอกข้อมูลไม่ครบ',
                        html: 'กรุณากรอกชื่อค่าย SMS โทรศัพท์ผู้เสียหาย'
                    });
                    return;
                }
            }
            // else{
            //     this.formData.CRIMINAL_SMS_PROVIDER_DETAIL = this.formData.CRIMINAL_SMS_PROVIDER;
            // }
        } else {
            this.formData.CRIMINAL_SMS_ORIGIN = null;
            this.formData.CRIMINAL_SMS_PROVIDER = null;
            this.formData.CRIMINAL_SMS_DESTINATION = null;
            this.formData.CRIMINAL_SMS_DATE_FULL = null;
            this.formData.CRIMINAL_SMS_DATE = null;
            this.formData.CRIMINAL_SMS_TIME = null;
        }
        if (this.formData.CRIMINAL_OTHER) {
            if (!this.formOther.instance.validate().isValid) {
                this._formValidate.ValidateForm(
                    this.formOther.instance.validate().brokenRules
                );
                return;
            }
        } else {
            this.formData.CRIMINAL_TYPE_SOCIAL = null;
            this.formData.CRIMINAL_SOCIAL_TYPE_DETAIL = null;
            this.formData.CRIMINAL_SOCIAL_DETAIL = null;
        }
        if( this.formData.CRIMINAL_SOCIAL_DETAIL){
            if(ValidateUrl(this.formData.CRIMINAL_SOCIAL_DETAIL)){
                Swal.fire({
                    title: "แจ้งเตือน!",
                    html: `ท่านกรอกข้อมูล URL ไม่ถูกต้อง 
                    <br>เนื่องจาก URL ของท่านไม่สามารถนำไปตรวจสอบได้
                    <br>กรุณาตรวจสอบอีกครั้ง`,
                    icon: "warning",
                    confirmButtonText: "Ok",
                }).then(() => {
                    this.formData.CRIMINAL_SOCIAL_DETAIL = null;
                });
                return;
            }
        }
        // formatDate
        this.formData.ATTACHMENT = this.dataAttachment ?? [];
        const setData = {};
        const d = this.formData;
        for (const key in d) {
            if (d[key] !== null && d[key] !== undefined) {
                setData[key] = d[key];
            }
        }
        let formCaseChannel = this.issueOnlineService.craeteCaseChanel(this.formData);
        // pack file's form
        formCaseChannel = this.formatFormSubmitFile(formCaseChannel);
        this.mainConponent.formDataAll.formCriminalContact = {};
        this.mainConponent.formDataAll.formCaseChannelCriminalContact = {};
        this.mainConponent.formDataAll.formCriminalContact = this.formData;
        this.mainConponent.formDataAll.formCaseChannelCriminalContact = formCaseChannel;

        const storedVillain = localStorage.getItem("form-villain");
        const villain = storedVillain ? JSON.parse(storedVillain) : {};

        const CASE_CHANNEL = (!this.formData.CRIMINAL_TEL && !this.formData.CRIMINAL_SMS && !this.formData.CRIMINAL_OTHER) 
            ? [] 
            : [formCaseChannel];

        localStorage.setItem("form-villain", JSON.stringify({ ...villain, CASE_CHANNEL }));
        localStorage.setItem("form-criminal-contact", JSON.stringify({ CASE_REPORT: [this.formData] }) );

        this.isLoading = true;
        this._OnlineCaseService.SessionVillain({ ...villain, CASE_CHANNEL }, 
            User.Current.PersonalId, 
            "create"
        ).pipe(
            switchMap(() => 
                this._OnlineCaseService.SessionCriminal({CASE_REPORT: [this.formData] }, 
                    User.Current.PersonalId, 
                    "create"
                )
            ),
            finalize(() => { this.isLoading = false; }) // ลดการซ้ำซ้อนของ this.isLoading = false;
        ).subscribe(() => {
            if (e !== 'tab') {
                this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
            }
        });
        
        
        
        // this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
    }

    Back(e) {
        this.mainConponent.NextIndex(this.mainConponent.indexTab - 1);
    }

    selectChannel(type) {
        if (type === 'phone' && this.formData.CRIMINAL_TEL) {
            this.formData.CRIMINAL_TEL_PROVIDER = 'N/A';
        }
        if (type === 'sms' && this.formData.CRIMINAL_SMS) {
            this.formData.CRIMINAL_SMS_PROVIDER = 'N/A';
        }
    }

    OpenFileDialog() {
        this.typeSelected = [];
        if(this.formData.CRIMINAL_TEL){
            this.typeSelected.push('เบอร์โทรศัพท์');
        }
        if(this.formData.CRIMINAL_SMS){
            this.typeSelected.push('SMS');
        }
        if(this.formData.CRIMINAL_TYPE_SOCIAL){
            this.typeSelected.push(this.formData.CRIMINAL_TYPE_SOCIAL);
        }
        this.popupAttachment = true;
        this.popupFormUploaded = false;
    }

    DeleteFileDocItemUpload(index = null) {
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
                this.maxSizeBuffer -= this.dataAttachment[index].size ?? 0;
                this.dataAttachment.splice(index, 1);
            }
        });
    }

    async openPdfInNewTabAdd(e): Promise<void> {
        const something = e.Url.split(',')[1] || e.Url;
        const fileData = atob(something);
        const blob = new Blob([new Uint8Array([...fileData].map(item => item.charCodeAt(0)))], { type: e.Type });
        const fileUrl = URL.createObjectURL(blob);
        window.open(fileUrl, '_blank');
    }

    async UploadFileAttachment(uploadTag) {
        const files: any = uploadTag.files;
        if (files.length > 0) {
            const fileCheck = await this._issueFile.CheckFileUploadAllowListSizeDialog(this.maxSizeBuffer, files);
            if (fileCheck.status) {
                let fileItem = {} as any;
                this.maxSizeBuffer = fileCheck.uploadSizeAll ?? 0;
                for (const item of fileCheck.filebase64Array) {
                    this._fileName = item.originalName;
                    const fileName = item.originalName;
                    this._fileSize = item.sizeDetail;
                    fileItem = {
                        name: fileName,
                        size: item.size,
                        sizeDetail: this.BytesToSize(item.size),
                        type: item.type,
                        originalName: fileName,
                        url: item.url,
                    };
                }
                this._fileForm = fileItem;
                this.popupFormUploaded = true;
            }
        }
    }

    OpenFileDialogAttachment(uploadTag) {
        uploadTag.click();
    }

    async FilesDroppedAttachment(e) {
        const files = e;
        if (files.length > 0) {
            const fileCheck = await this._issueFile.CheckFileUploadAllowListSizeDrop(this.maxSizeBuffer, files);
            console.log(fileCheck);
            if (fileCheck.status) {
                let fileItem = {} as any;
                this.maxSizeBuffer = fileCheck.uploadSizeAll ?? 0;
                for (const item of fileCheck.filebase64Array) {
                    const extention = this.textAfterLastDot(item.originalName);
                    const fileName = this._fileName ? this._fileName + extention : item.originalName;
                    this._fileSize = item.sizeDetail;
                    fileItem = {
                        name: fileName,
                        size: item.size,
                        sizeDetail: this.BytesToSize(item.size),
                        type: item.type,
                        originalName: fileName,
                        url: item.url,
                    };
                }
                this._fileForm = fileItem;
                this.popupFormUploaded = true;
            }
        }
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

    textAfterLastDot(name) {
        const lastDotIndex = name.lastIndexOf('.');
        return lastDotIndex !== -1 ? name.substring(lastDotIndex) : '';
    }

    ClearDocBufferAttachment() {
        this._fileForm = undefined;
        this.popupFormUploaded = false;
    }

    PopupUploadClose() {
        this._fileForm = {};
        this.fileTypeSelected = false;
        this.fileTypeSelectedValue = '';
        this.popupFormUploaded = false;
        this.popupAttachment = false;
    }

    PopupUploadSave() {
        if (this.popupFormUploaded) {
            this.dataAttachment.push({
                OriginalName: this._fileForm.originalName,
                Url: this._fileForm.url,
                Type: this._fileForm.type,
                Size: this._fileForm.size,
                sizeDetail: this._fileForm.sizeDetail,
                formType: this.fileTypeSelectedValue
            });
            this.PopupUploadClose();
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'แจ้งเตือน!',
                text: "ท่านยังไม่ได้แนบไฟล์",
                confirmButtonText: 'ตกลง'
            }).then(() => {
            });
        }
    }

    CheckNumberBandit(event) {
        const seperator = '^([0-9+])+$';
        const maskSeperator = new RegExp(seperator, 'g');
        const result = maskSeperator.test(event.key);
        return result;
    }
    PasteCheckNumberBandit(event) {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData.getData('text');
        const seperator = '^([0-9+])+$';
        const maskSeperator = new RegExp(seperator, 'g');
        const result = maskSeperator.test(pastedText);
        return result;
    }
    CheckNumber(event) {
        // const seperator  = '^[ก-๏\\s]+$';
        const seperator = '^([0-9])';
        const maskSeperator = new RegExp(seperator, 'g');
        const result = maskSeperator.test(event.key);
        console.log(result);
        return result;
    }
    PasteCheckNumber(event) {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData.getData('text');
        // const seperator  = '^[ก-๏\\s]+$';
        const seperator = '^([0-9])';
        const maskSeperator = new RegExp(seperator, 'g');
        const result = maskSeperator.test(pastedText);
        console.log(result);
        return result;
    }

    PhoneNumberPattern(params) {
        const makeScope = new RegExp('^[0](?=[0-9]{9,9}$)', 'g');
        return makeScope.test(params.value);
    }

    checkPhoneNumberChanged(event, component: DxTextBoxComponent){
        if(event.value !== "" && event.value !== undefined && event.value !== null){
            const seperator = '^([0-9]){10}';
            const maskSeperator = new RegExp(seperator, 'g');
            const result = maskSeperator.test(event.value);
            if(!result){
                component.value = null;
                Swal.fire({
                    icon: 'warning',
                    title: 'กรอกข้อมูลผิดพลาด',
                    html: 'กรุณากรอกข้อมูลใหม่อีกครั้ง'
                });
            }else{
                if(event.value.length > 2){
                    const newseperator = "^(.)\\1*$";
                    const newmaskSeperator = new RegExp(newseperator, "gm");
                    const newresult = newmaskSeperator.test(event.value);
                    if(newresult){
                        component.value = null;
                        Swal.fire({
                            title: "ผิดพลาด!",
                            html: `คุณกรอกไม่ถูกต้อง เนื่องจากกรอกตัวอักษรซ้ำทั้งหมด`,
                            icon: "warning",
                            confirmButtonText: "Ok",
                        });
                        return;
                    }
                    component.isValid = true;
                }
            }
        }
    }

    formatFormSubmitFile(formCaseChannel: any): any {
        if (this.formData.ATTACHMENT.length !== 0) {
            this.formData.ATTACHMENT.forEach(element => {
                switch (element.formType) {
                case "EMAIL":
                    formCaseChannel.CHANNEL_EMAIL_DOC = [];
                    formCaseChannel.CHANNEL_EMAIL_DOC.push(element);
                    break;
                case "FACEBOOK":
                    formCaseChannel.CHANNEL_FACEBOOK_DOC = [];
                    formCaseChannel.CHANNEL_FACEBOOK_DOC.push(element);
                    break;
                case "INSTAGRAM":
                    formCaseChannel.CHANNEL_INSTARGRAM_DOC = [];
                    formCaseChannel.CHANNEL_INSTARGRAM_DOC.push(element);
                    break;
                case "LINE":
                    formCaseChannel.CHANNEL_LINE_DOC = [];
                    formCaseChannel.CHANNEL_LINE_DOC.push(element);
                    break;
                case "MESSENGER":
                    formCaseChannel.CHANNEL_MESSENGER_DOC = [];
                    formCaseChannel.CHANNEL_MESSENGER_DOC.push(element);
                    break;
                case "อื่นๆ":
                    formCaseChannel.CHANNEL_OTHERS_DOC = [];
                    formCaseChannel.CHANNEL_OTHERS_DOC.push(element);
                    break;
                case "เบอร์โทรศัพท์":
                    formCaseChannel.CHANNEL_PHONE_DOC = [];
                    formCaseChannel.CHANNEL_PHONE_DOC.push(element);
                    break;
                case "SMS":
                    formCaseChannel.CHANNEL_SMS_DOC = [];
                    formCaseChannel.CHANNEL_SMS_DOC.push(element);
                    break;
                case "TELEGRAM":
                    formCaseChannel.CHANNEL_TELEGRAM_DOC = [];
                    formCaseChannel.CHANNEL_TELEGRAM_DOC.push(element);
                    break;
                case "TWITTER":
                    formCaseChannel.CHANNEL_TWITTER_DOC = [];
                    formCaseChannel.CHANNEL_TWITTER_DOC.push(element);
                    break;
                case "WEBSITE":
                    formCaseChannel.CHANNEL_WEBSITE_DOC = [];
                    formCaseChannel.CHANNEL_WEBSITE_DOC.push(element);
                    break;
                case "WHATSAPP":
                    formCaseChannel.CHANNEL_WHATAPP_DOC = [];
                    formCaseChannel.CHANNEL_WHATAPP_DOC.push(element);
                    break;
                }
            });
        }
        return formCaseChannel;
    }

    selectTypeSender(){
        if(this.formData.CRIMINAL_SMS_DESTINATION_TYPE){
            this.formData.CRIMINAL_SMS_DESTINATION = null;
        }
    }
}
