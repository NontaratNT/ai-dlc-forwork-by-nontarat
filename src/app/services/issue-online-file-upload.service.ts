import { Injectable } from "@angular/core";
import * as moment from "moment";
import { NgxImageCompressService } from "ngx-image-compress";
import Swal from "sweetalert2";

@Injectable({
    providedIn: "root",
})
export class IssueOnlineFileUploadService {
    SumUploadfileSize = 0;
    constructor(private _imageCompress: NgxImageCompressService) {}
    ShowInvalidDialog(myText = "กรุณาแนบไฟล์นามสกุล .pdf, .jpg, .png เท่านั้น") {
        Swal.fire({
            title: "ผิดพลาด!",
            text: myText,
            icon: "error",
            confirmButtonText: "Ok",
        }).then(() => {});
    }
    CheckFileUploadClick(file: any) {
        for (const item of file) {
            const checkAllow = this.CheckFileUploadAllow(item);
            if (!checkAllow) {
                return false;
            }
        }
        return true;
    }
    CheckFileUploadDrop(file: any) {
        for (const item of file) {
            const checkAllow = this.CheckFileUploadAllow(item.file);
            if (!checkAllow) {
                return false;
            }
        }
        return true;
    }
    CheckTypeFileImage(type) {
        return type.split("/")[0] === "image";
    }
    FileImageAllow(type) {
        return type === "image/jpeg" || type === "image/png" || type === "application/pdf";
    }
    CheckFileUploadAllow(file: any) {
        const typeFile = file.type.toString();

        if (
            !this.CheckTypeFileImage(typeFile) &&
            typeFile !== "application/pdf"
        ) {
            this.ShowInvalidDialog();
            return false;
        }
        if (file.size / 1024 / 1024 > 10) {
            this.ShowInvalidDialog("ไม่สามารถอัพโหลดไฟล์ขนาดมากกว่า 10 MB ได้");
            return false;
        }

        return true;
    }
    ReadFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            reader.onerror = () => {
                reject (new Error ('ผิดพลาด'));
            };
            reader.readAsDataURL(file);
        });
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

    async ConvertBase64File(fileUpload) {
        // const typeFile = fileUpload.type.toString();
        // const type = typeFile === "application/pdf" ? "pdf" : "image";
        const uploadfilebase64: any = await this.ReadFile(fileUpload);
        let base64File = uploadfilebase64;
        if (fileUpload.type === "image/jpeg") {
            const orientation = await this._imageCompress.getOrientation(fileUpload);
            const fileResize = await this._imageCompress.compressFile(uploadfilebase64, orientation , 100, 50);
            // const filesizeResize = await this._imageCompress.byteCount(fileResize);
            base64File = fileResize;

        }
        const base64FileSize = this._imageCompress.byteCount(base64File);
        // console.log('ConvertBase64File');
        // console.log('base64FileSize',base64FileSize);
        // console.log('BytesToSize',this.BytesToSize(base64FileSize));
        const setItemFileBase64 = {
            storage: "base64",
            name: "file",
            url: base64File,
            size: base64FileSize,
            sizeDetail: this.BytesToSize(base64FileSize),
            type: fileUpload.type,
            originalName: fileUpload.name,
            dateNow: moment().format('YYYY-MM-DD'),
        };
        return setItemFileBase64;
    }
    async CheckFileUploadAllowSize(file: any) {
        const typeFile = file.type.toString();
        if (!this.FileImageAllow(typeFile)) {
            this.ShowInvalidDialog();
            return { status: false };
        }
        if (file.size  / 1024 / 1024 > 5) {
            this.ShowInvalidDialog('ไม่สามารถอัพโหลดไฟล์มากกว่า 5 MB ได้');
            return { status: false };
        }

        if (file.size <= 0) {
            this.ShowInvalidDialog('ไม่สามารถอัพโหลดไฟล์ขนาด 0 MB ได้');
            return { status: false };
        }

        const filebase64 = await this.ConvertBase64File(file);

        return { status: true, filebase64 };
    }
    async CheckFileUploadAllowMaxSize(uploadSizeAll, file: any) {
        const res = await this.CheckFileUploadAllowSize(file);
        if (!res.status){
            return { status: false };
        }
        uploadSizeAll += res.filebase64.size;
        // console.log('uploadSizeAll',uploadSizeAll);
        // console.log('BytesToSize',this.BytesToSize(uploadSizeAll));
        if (uploadSizeAll / 1024 / 1024 > 5){
            this.ShowInvalidDialog("ไม่สามารถอัพโหลดไฟล์มากกว่า 5 MB ได้");
            return { status: false };
        }
        return { status: true, filebase64: res.filebase64,uploadSizeAll };
    }
    async CheckFileUploadAllowListSizeDialog(uploadSizeAll,file: any) {
        const filebase64Array: any = [];
        for (const item of file) {
            const check = await this.CheckFileUploadAllowSize(item);
            if (!check.status) {
                return { status: false };
            }
            uploadSizeAll += check.filebase64.size;
            if (uploadSizeAll / 1024 / 1024 > 5){
                this.ShowInvalidDialog("ไม่สามารถอัพโหลดไฟล์มากกว่า 5 MB ได้");
                return { status: false };
            }
            filebase64Array.push(check.filebase64);
        }
        return { status: true, filebase64Array, uploadSizeAll };
    }
    async CheckFileUploadAllowListSizeDrop(uploadSizeAll,file: any) {
        const filebase64Array: any = [];
        for (const item of file) {
            const check = await this.CheckFileUploadAllowSize(item.file);
            if (!check.status) {
                return { status: false };
            }
            uploadSizeAll += check.filebase64.size;
            if (uploadSizeAll / 1024 / 1024 > 5){
                this.ShowInvalidDialog("ไม่สามารถอัพโหลดไฟล์มากกว่า 5 MB ได้");
                return { status: false };
            }
            filebase64Array.push(check.filebase64);
        }
        return { status: true, filebase64Array, uploadSizeAll };
    }
}
