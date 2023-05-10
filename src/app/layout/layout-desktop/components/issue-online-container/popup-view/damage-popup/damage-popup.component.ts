import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from "@angular/core";
import { DxFormComponent, DxSelectBoxComponent } from "devextreme-angular";
import { BankInfoService } from "src/app/services/bank-info.service";
import { FileHandle } from "./dragDrop.directive";
import Swal from 'sweetalert2';

@Component({
    selector: "app-damage-popup",
    templateUrl: "./damage-popup.component.html",
    styleUrls: ["./damage-popup.component.scss"],
})
export class DamagePopupComponent implements OnInit,OnChanges {
    @ViewChild("selectBankInfo", { static: false }) selectBankInfo: DxSelectBoxComponent;
    @ViewChild('form', { static: false }) form: DxFormComponent;
    @ViewChild('formAddData', { static: false }) subForm: DxFormComponent;

    @Input() displayPopup = true;
    @Input() saveData = false;
    @Input() editData: any;
    @Output() sendDataForm = new EventEmitter<any>();
    bankInfoList = [];
    formData: any = {};
    uploadFileBufferStatus = false;
    uploadFileBuffer: any = {};
    openAddData = false;
    formSubData: any = {};
    damageValueBuffer = 0;
    constructor(
        private servBankInfo: BankInfoService,
    ) {}

    ngOnInit(): void {
        this.servBankInfo
            .GetBankInfo()
            .subscribe((_) => (this.bankInfoList = _));
        // console.log('initial->>>',this.editData);
        this.formData = {
            BANK_DETAIL:[],
        };
        if (this.editData.type === 'add') {
            this.formData = {
                BANK_DETAIL:[],
                BANK_DAMAGE_VALUE:0
            };
        }else if (this.editData.type === 'edit'){
            this.formData = {
                BANK_DETAIL:[]
            };
        }else if (this.editData.type === 'addSub'){
            this.formData = this.editData.formData;
        }else if (this.editData.type === 'editSub'){
            this.formData = this.editData.formData;
        }
        // this.formData = {
        //     BANK_NAME:"กรุงไทย",
        //     BANK_ACCOUNT_NAME:"สมชาย หญิงแท้",
        //     BANK_ACCOUNT:"5444445555",
        //     BANK_DETAIL:[
        //         {
        //             BANK_TRANSFER_DATETIME:null,
        //             BANK_DAMAGE_VALUE:0,
        //             BANK_DOC:{
        //                 storage:"base64",
        //                 name:"file",
        //                 url:"base64File",
        //                 size:"file.size",
        //                 sizeDetail:"this.BytesToSize(file.size)",
        //                 type:"file.type",
        //                 originalName:"file.name",
        //             }
        //         }
        //     ]
        // };
    }
    OnSelectBankAccount(e) {
        if (e.value) {
            const data = this.selectBankInfo.instance.option("selectedItem");
            if (data) {
                this.formData.BANK_ID = data.BANK_ID;
                this.formData.BANK_NAME = data.BANK_NAME;
            }else{
                this.formData.BANK_ID = e.value;
            }
        }
    }
    ngOnChanges(): void {
        // console.log('test',this.saveData);
        if (this.saveData) {
            this.SaveMainData();
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
    DownloadFile(data) {
        const linkSource = data.url;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = data.originalName;
        downloadLink.click();
    }
    ClearDocBuffer(){
        this.uploadFileBufferStatus = false;
        this.uploadFileBuffer = {};
    }
    OpenFileDialog(uploadTag) {
        // e.event.stopPropagation();
        uploadTag.click();
    }

    sizeShow(sizeupload){
        return (Math.round((sizeupload/1024) * 100) / 100);
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
    uploadFile(uploadTag) {
        // console.log('uploadTag',uploadTag);
        const files: FileList = uploadTag.files;
        if (files.length === 1) {
            this.ConvertBase64(files[0]);
            // console.log('files[0]',files[0]);
            // const reader = new FileReader();
            // reader.readAsDataURL(files[0]);
            // reader.onload = () => {
            //     let base64File = {} as any;
            //     base64File = reader.result;
            //     // console.log('datafile',{
            //         storage:"base64",
            //         name:"file",
            //         url:base64File,
            //         size:files[0].size,
            //         sizeDetail:this.BytesToSize(files[0].size),
            //         type:files[0].type,
            //         originalName:files[0].name,
            //     });
            // };
        }
    }
    filesDropped(e): void {
        // console.log('filesDroppedXml',e);
        const files = e;
        if (files.length === 1) {
            this.ConvertBase64(files[0].file);
            // console.log('fileDrag',{
            //     name: files[0].file.name,
            //     type: files[0].file.type,
            //     size: files[0].file.size,
            //     sizeshow: this.sizeShow(files[0].file.size),
            //     data: files[0].file
            // });

        }else{
            alert('ไม่สามารถอัพโหลดไฟล์มากกว่า 1 ไฟล์ได้');
        }
    }
    ConvertBase64(file){
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
    AddSubData(){
        this.openAddData = true;
        this.formSubData = {};
    }
    ShowInvalidDialog(){
        Swal.fire({
            title: "ผิดพลาด!",
            text: "กรุณากรอกข้อมูลให้ครบ",
            icon: "warning",
            confirmButtonText: "Ok",
        }).then(() => {});
    }
    SaveSubData(){
        if (!this.subForm.instance.validate().isValid) {
            this.ShowInvalidDialog();
            return;
        }
        this.formData.BANK_DETAIL.push({
            BANK_TRANSFER_DATETIME:this.formSubData.BANK_TRANSFER_DATETIME,
            BANK_DAMAGE_VALUE:this.formSubData.BANK_DAMAGE_VALUE,
            BANK_DOC:this.uploadFileBuffer,
        });
        this.SumDamageValue(this.formSubData.BANK_DAMAGE_VALUE,'sum');
        this.CloseSubData();
        // console.log('this.formData',this.formData);

    }
    SumDamageValue(num,type = 'sum'){
        const numfloat = parseFloat(num);
        if (num > 0) {
            const SumAll = parseFloat(this.formData.BANK_DAMAGE_VALUE);
            if (type === 'sum') {
                this.formData.BANK_DAMAGE_VALUE = SumAll + numfloat;
            } else if (type === 'remove') {
                this.formData.BANK_DAMAGE_VALUE = SumAll - numfloat;
            }
            this.formData.BANK_DAMAGE_VALUE = parseFloat(this.formData.BANK_DAMAGE_VALUE).toFixed(2);
        }
    }
    DeleteFileDoc(index = null){
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
                const damageValue = this.formData.BANK_DETAIL[index].BANK_DAMAGE_VALUE || 0;
                this.SumDamageValue(damageValue,'remove');
                this.formData.BANK_DETAIL.splice(index, 1);
            }
        });
    }
    CloseSubData(){
        this.uploadFileBuffer = {};
        this.uploadFileBufferStatus = false;
        this.formSubData = {};
        this.openAddData = false;

    }
    SaveMainData() {
        if (!this.form.instance.validate().isValid) {
            this.ShowInvalidDialog();
            return;
        }
        this.sendDataForm.emit(this.formData);
    }
    Close(){
        // this.closePopup.emit(true);
    }

}
