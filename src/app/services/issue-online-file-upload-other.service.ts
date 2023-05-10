import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class IssueOnlineFileUploadOtherService {

    constructor() { }
    ShowInvalidDialog(myText = "กรุณาแนบไฟล์นามสกุล pdf jpg png doc เท่านั้น"){
        Swal.fire({
            title: "ผิดพลาด!",
            text: myText,
            icon: "error",
            confirmButtonText: "Ok",
        }).then(() => {});
    }
    CheckFileUploadClick(file: any){
        for (const item of file) {
            const checkAllow = this.CheckFileUploadAllow(item);
            if (!checkAllow){
                return false;
            }
        }
        return true;
    }
    CheckFileUploadDrop(file: any){
        for (const item of file) {
            const checkAllow = this.CheckFileUploadAllow(item.file);
            if (!checkAllow){
                return false;
            }
        }
        return true;
    }
    CheckTypeFileImage(type) {
        return type.split('/')[0] === 'image';
    }
    CheckFileUploadAllow(file: any){
        const typeFile = file.type.toString();
        const listCheck: string[] = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];
        if (file.size / 1024 / 1024 > 10) {
            this.ShowInvalidDialog('ไม่สามารถอัพโหลดไฟล์ขนาดมากกว่า 10 MB ได้');
            return false;

        }
        if (this.CheckTypeFileImage(typeFile) || listCheck.indexOf(typeFile) > -1) {
            return true;
        }
        this.ShowInvalidDialog();
        return false;

    }
}
