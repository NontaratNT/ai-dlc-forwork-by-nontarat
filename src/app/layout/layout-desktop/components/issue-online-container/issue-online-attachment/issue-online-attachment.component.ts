import { Component, OnInit, ViewChild } from "@angular/core";
import { DxFormComponent, DxScrollViewComponent } from "devextreme-angular";
import { PersonalService } from "src/app/services/personal.service";
import { User } from "src/app/services/user";
import { IssueOnlineContainerComponent } from "../issue-online-container.component";
import Swal from "sweetalert2";
import { IssueOnlineFileUploadService } from "src/app/services/issue-online-file-upload.service";
import { FileService } from "src/app/services/file.service";

@Component({
    selector: "app-issue-online-attachment",
    templateUrl: "./issue-online-attachment.component.html",
    styleUrls: ["./issue-online-attachment.component.scss"],
})
export class IssueOnlineAttachmentComponent implements OnInit {
    @ViewChild("form_popup_attachment", { static: false }) formAttachment: DxFormComponent;
    public mainConponent: IssueOnlineContainerComponent;
    isLoading = false;
    formData: any = {};
    personalInfo = {};
    listAttachment: any = [];
    popupAttachment = false;
    popupForm: any = {};
    popupFormUploaded = false;
    popupViewFile = false;
    popupViewFileData: any = {};
    limitAttachmentSize = 0;
    maxSizeBuffer = 0;
    formType = 'add';
    file:any;
    constructor(
        private servicePersonal: PersonalService,
        private _issueFile: IssueOnlineFileUploadService,
        private _fileService :FileService
    ) {}

    ngOnInit(): void {
        this.isLoading = true;
        setTimeout(async () => {
            this.setDefaultData();
        }, 100);
        // if(this.mainConponent.formType === "add"){
        //     localStorage.setItem("form-index","6");
        //     if(localStorage.getItem("form-attachment")){
        //         this.listAttachment = JSON.parse(localStorage.getItem("form-attachment")).CASE_ATTACHMENT ?? [];
        //     }
        // }
        // const userId = User.Current.PersonalId;
        // this.servicePersonal
        //     .GetPersonalById(userId)
        //     .subscribe((_) => {
        //         this.personalInfo = _;
        //     });

    }
    async setDefaultData(){
        // this.checkBlessing = this.mainConponent.formDataInsert.CHECK_BLESSING;
        if (this.mainConponent.formType === 'add') {
            this.formType = 'add';
            localStorage.setItem("form-index","6");
            if(localStorage.getItem("form-attachment")){
                this.listAttachment = JSON.parse(localStorage.getItem("form-attachment")).CASE_ATTACHMENT ?? [];
            }
        }else{
            this.formType = 'edit';
            this.listAttachment = await this._fileService.getCaseMoneyFile(Number(this.mainConponent.InstId)).toPromise();
        }
    }
    ShowInvalidDialog(){
        Swal.fire({
            title: "ผิดพลาด!",
            text: "กรุณากรอกข้อมูลให้ครบ",
            icon: "warning",
            confirmButtonText: "Ok",
        }).then(() => {});
    }
    PopupUploadAdd(){
        this.popupAttachment = true;
        this.popupForm = {};
        this.popupFormUploaded = false;
        this.maxSizeBuffer = this.limitAttachmentSize ?? 0;
    }
    PopupUploadSave(){
        const form = this.popupForm ?? undefined;
        const fileBase64 = form.url ?? undefined;
        if (!fileBase64) {
            return this.ShowInvalidDialog();
        }
        this.listAttachment.push(this.popupForm);
        this.limitAttachmentSize = this.maxSizeBuffer ?? 0;
        this.PopupUploadClose();
    }
    PopupUploadDelete(index = null){
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
                this.limitAttachmentSize -= this.listAttachment[index].size ?? 0;
                this.listAttachment.splice(index, 1);
            }
        });
    }
    PopupUploadClose(){
        this.popupForm = {};
        this.formAttachment.instance._refresh();
        this.popupFormUploaded = false;
        this.popupAttachment = false;
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
    OpenFileDialogAttachment(uploadTag) {
        uploadTag.value = "";
        uploadTag.click();
    }
    // async UploadFileAttachment(uploadTag) {
    //     const files: FileList = uploadTag.files;
    //     if (files.length === 1) {
    //         const checkAllow = this._issueFile.CheckFileUploadClick(files);
    //         if (checkAllow){
    //             this.isLoading = true;
    //             // eslint-disable-next-line @typescript-eslint/prefer-for-of
    //             for (let index = 0; index < files.length; index++) {
    //                 const item = files[index];
    //                 await this.uploadFileConvertBase64Attachment(item);
    //             }
    //             this.isLoading = false;
    //             // console.log('files',files);
    //         }


    //     }
    // }
    // async FilesDroppedAttachment(e) {
    //     const files = e;
    //     if (files.length === 1) {
    //         const checkAllow = this._issueFile.CheckFileUploadDrop(files);
    //         if (checkAllow){
    //             // this.ConvertBase64(files[0].file);
    //             this.isLoading = true;
    //             // eslint-disable-next-line @typescript-eslint/prefer-for-of
    //             for (let index = 0; index < files.length; index++) {
    //                 const item = files[index].file;
    //                 await this.uploadFileConvertBase64Attachment(item);
    //             }
    //             this.isLoading = false;
    //         }


    //     }
    // }
    // async uploadFileConvertBase64Attachment(file){
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onload = () => {
    //         let base64File = {} as any;
    //         base64File = reader.result;
    //         const fileName = (this.popupForm.originalName)? this.popupForm.originalName : file.name;

    //         const item = {
    //             storage:"base64",
    //             name:"file",
    //             url:base64File,
    //             size:file.size,
    //             sizeDetail:this.BytesToSize(file.size),
    //             type:file.type,
    //             originalName:fileName,
    //         };
    //         this.popupFormUploaded = true;
    //         this.popupForm = item;
    //     };
    // }
    async UploadFileAttachment(uploadTag) {
        const files: any = uploadTag.files;
        if (files.length === 1) {
            this.isLoading = true;
            const fileCheck = await this._issueFile.CheckFileUploadAllowMaxSize(this.maxSizeBuffer,files[0]);

            if (fileCheck.status){
                this.maxSizeBuffer = fileCheck.uploadSizeAll ?? 0;
                const fileName = (this.popupForm.originalName)? this.popupForm.originalName : fileCheck.filebase64.originalName;
                fileCheck.filebase64.originalName = fileName;
                this.popupForm = fileCheck.filebase64;
                this.popupFormUploaded = true;
            }
            this.isLoading = false;

        }
    }

    async FilesDroppedAttachment(e) {
        const files = e;
        if (files.length === 1) {
            this.isLoading = true;
            const fileCheck = await this._issueFile.CheckFileUploadAllowMaxSize(this.maxSizeBuffer,files[0].file);

            if (fileCheck.status){
                this.maxSizeBuffer = fileCheck.uploadSizeAll ?? 0;
                const fileName = (this.popupForm.originalName)? this.popupForm.originalName : fileCheck.filebase64.originalName;
                fileCheck.filebase64.originalName = fileName;
                this.popupForm = fileCheck.filebase64;
                this.popupFormUploaded = true;
            }
            this.isLoading = false;

        }
    }

    ClearDocBufferAttachment(){
        this.popupFormUploaded = false;
        this.maxSizeBuffer -= this.popupForm.size ?? 0;
        this.popupForm = {};
        this.formAttachment.instance._refresh();

    }
    CheckArray(data: any = []){
        const countArray = data.length ?? 0;
        if (countArray > 0){
            return true;
        }
        return false;

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
    Back(e){
        this.mainConponent.NextIndex(this.mainConponent.indexTab -1);
    }
    SubmitForm(e) {
        if(this.mainConponent.formType === "add"){
            const setData = {
                CASE_ATTACHMENT:this.listAttachment ?? []
            };
            // console.log('formSubmit->>>>',setData);
            // this.mainConponent.MergeObj(setData);
            // console.log('formData->>>>',isData);
            this.mainConponent.formDataAll.formAttachment = {};
            this.mainConponent.formDataAll.formAttachment = setData;
            localStorage.setItem("form-attachment",JSON.stringify(setData));
        }
        if(e != 'tab'){
            this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
        }
    }
}
