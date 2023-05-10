import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';

@Component({
    selector: 'app-view-file-upload-m',
    templateUrl: './view-file-upload.component.html',
    styleUrls: ['./view-file-upload.component.scss']
})
export class ViewFileUploadComponent implements OnInit {
    @Input() fileData: any = {};
    @Output() popupChange = new EventEmitter<any>();
    popup = false;
    pdfBase64: string;
    fileName: string;
    typeShow: string;
    constructor() { }

    ngOnInit(): void {
        this.pdfBase64 = this.fileData.url;
        this.fileName = this.fileData.originalName;
        this.typeShow = this.CheckTypeShow();
        this.popup = true;
    }
    ClosePopup(){
        this.popupChange.emit(false);
    }
    DownloadFile() {
        const data = this.fileData;
        const linkSource = data.url;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = data.originalName;
        downloadLink.click();
    }
    CheckTypeFileImage(type) {
        return type.split('/')[0] === 'image';
    }
    CheckTypeShow(){
        const typeFile = this.fileData.type.toString();
        let typeShow = '';
        if (typeFile === 'application/pdf') {
            typeShow = 'pdf';
        }else if(this.CheckTypeFileImage(typeFile)){
            typeShow = 'image';
        }else{
            typeShow = 'other';
        }
        return typeShow;
    }
}
