import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from "@angular/core";
import { DxSelectBoxComponent } from "devextreme-angular";
import { BankInfoService } from "src/app/services/bank-info.service";
import { FileHandle } from "./dragDrop.directive";

@Component({
    selector: "app-damage-popup",
    templateUrl: "./damage-popup.component.html",
    styleUrls: ["./damage-popup.component.scss"],
})
export class DamagePopupComponent implements OnInit,OnChanges {
    @ViewChild("selectBankInfo", { static: false }) selectBankInfo: DxSelectBoxComponent;
    @Input() displayPopup = true;
    @Input() saveData = false;
    @Input() dataForm: any;
    @Output() sendDataForm = new EventEmitter<any>();
    bankInfoList = [];
    formData: any = {};
    _docType = ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    _xmlType = ["text/xml"];
    _xmlFile: any = {};
    formFile: any = {};
    _docFile: any = {};
    files: FileHandle[] = [];
    constructor(
        private servBankInfo: BankInfoService,
    ) {}

    ngOnInit(): void {
        // console.log('dataForm',!this.dataForm);
        // console.log('dataForm',this.dataForm);

        this.servBankInfo
            .GetBankInfo()
            .subscribe((_) => (this.bankInfoList = _));
    }
    OnSelectBankAccount(e) {
        if (e.value) {
            if (this.formData.MONEY_CHANNEL_TYPE === "T") {
                const data = this.selectBankInfo.instance.option("selectedItem");
                if (data) {
                    this.formData.BANK_ID = data.BANK_ID;
                    this.formData.BANK_NAME = data.BANK_NAME;
                }else{
                    this.formData.BANK_ID = e.value;
                }
            }

        }
    }
    ngOnChanges(): void {
        // console.log('displayPopup',this.displayPopup);
        // console.log('test');
        if (this.displayPopup && this.saveData) {
            this.addNewItem();
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
    OpenFileDialog(e, uploadTag) {
        e.event.stopPropagation();
        uploadTag.click();
    }
    sizeShow(sizeupload){
        return (Math.round((sizeupload/1024) * 100) / 100);
        // return (sizeupload / (1024 * 1024));
    }
    uploadFileXml(uploadTag) {
        // console.log('uploadTag',uploadTag);
        // const files: FileList = uploadTag.files;
        // console.log(files);
        // // let fileReader: FileReader;
        // if (files.length > 0) {
        //     const fileUpload = [];
        //     // eslint-disable-next-line @typescript-eslint/prefer-for-of
        //     for (let index = 0; index < files.length; index++) {
        //         const element: any = files[index];
        //         // console.log(element);
        //         fileUpload.push({
        //             name: element.name,
        //             type: element.type,
        //             size: element.size,
        //             sizeshow: this.sizeShow(element.size),
        //             data: element
        //         });
        //     }
        //     this._xmlFile = {} as any;
        //     this._xmlFile = {
        //         filestatus: true,
        //         item:fileUpload
        //     };
        // }
    }
    resetFileXml(index){
        // console.log(this._xmlFile.item);
        // console.log(index);
        this._xmlFile.item.splice(index, 1);
        // console.log(this._xmlFile.item);

        // this._xmlFile = {} as any;
    }
    filesDroppedXml(e): void {
        // console.log('filesDroppedXml',e);

        // if (files.length > 0) {
        //     const fileUpload = [];
        //     for(const item of files){
        //         // this._xmlFile
        //         // console.log(item.file);
        //         fileUpload.push({
        //             name: item.file.name,
        //             type: item.file.type,
        //             size: item.file.size,
        //             sizeshow: this.sizeShow(item.file.size),
        //             data: item.file
        //         });
        //     }
        //     this._xmlFile = {} as any;
        //     this._xmlFile = {
        //         filestatus: true,
        //         item:fileUpload
        //     };
        // console.log(this._xmlFile);
        // alert('ไม่สามารถอัพโหลดไฟล์มากกว่า 1 ไฟล์ได้');
        // }
    }
    addNewItem() {
        this.sendDataForm.emit({
            text1:"1",
            text2:"2",
            text3:"3",
            text4:"4",
            text5:"5",
        });
    }
    Close(){
        // this.closePopup.emit(true);
    }
}
