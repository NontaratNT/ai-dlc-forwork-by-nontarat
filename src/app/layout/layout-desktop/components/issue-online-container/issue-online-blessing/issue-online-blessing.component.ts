import { Select } from './../../../../../components/controls/date-combo-register/date-combo-register.component';
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxFormComponent } from "devextreme-angular";
import { PersonalService } from "src/app/services/personal.service";
import { User } from "src/app/services/user";
import Swal from "sweetalert2";
import { IssueOnlineContainerComponent } from "../issue-online-container.component";
import * as moment from "moment";
import { IssueOnlineService } from "src/app/services/issue-online.service";
import { BankInfoService } from "src/app/services/bank-info.service";
import { ConvertDateService } from 'src/app/services/convert-date.service';
import { DatePipe } from '@angular/common';
import { BpmProcinstService } from 'src/app/services/bpm-procinst.service';
import { OnlineCaseService } from 'src/app/services/online-case.service';
@Component({
    selector: "app-issue-online-blessing",
    templateUrl: "./issue-online-blessing.component.html",
    styleUrls: ["./issue-online-blessing.component.scss"],
})
export class IssueOnlineBlessingComponent implements OnInit {
    @ViewChild("formblessing", { static: false }) formblessing: DxFormComponent;
    public mainConponent: IssueOnlineContainerComponent;
    formData: any = {};
    issueOnline: any;
    formBankref: any = {};
    _dataSourcebankref: any = [];
    popupIndex = 0;
    popupConsentVisible: boolean = false;
    formType = "add"
    blockSave = true;
    formReadOnly = false;
    submission = {} as any;
    _isShow: boolean = false;
    _isShow2: boolean = false;
    _isShow3: boolean = false;
    _isShowNOT: boolean = false;
    checkcase : boolean = true;
    now: any;
    maxSizeBuffer = 0;
    limitCaseChanelSize = 0;
    popupType = 'add';
    maxDateValue:Date = new Date();
    formblessingdata: any = {};
    ways = [
        { id: 2, text: "ยังไม่ได้ติดต่อธนาคาร" },
        { id: 1, text: "ใช่ ติดต่อธนาคาร (เจ้าของบัญชีผู้เสียหาย) แล้ว และได้รับรหัสอ้างอิง (ฺBank Case ID) จากธนาคารแล้ว" },
    ];
    group1 = [
        { id: "1.1", txt: "1.1 แจ้งความเป็นหลักฐาน" },
        { id: "1.2", txt: "1.2 แจ้งความเอกสารหาย" },
        { id: "1.3", txt: "1.3 แจ้งความร้องทุกข์ ดำเนินคดี" },
    ];
    group2 = [
        { id: "2.1", txt: "2.1 ชีวิต ร่างกาย" },
        { id: "2.2", txt: "2.2 ชื่อเสียง" },
        { id: "2.3", txt: "2.3 ทรัพย์สิน" },
    ];
    group2_3 = [
        {
            id: "2.3.1",
            txt: "2.3.1 ทรัพย์สินคงรูป/กรรมสิทธิ์ในทรัพย์สิน/เงินสด",
        },
        { id: "2.3.2", txt: "2.3.2 เงินในบัญชี" },
        { id: "2.3.3", txt: "2.3.3 สกุลเงินดิจิทัล" },
    ];

    group3 = [
        { id: "3.1", txt: "3.1 ช่องทางออนไลน์/โทรศัพท์" },
        { id: "3.2", txt: "3.2 ได้พบเจอ/ทำผิดต่อหน้า" },
    ];
    group4 = [
        { id: 1, txt: "รู้จัก" },
        { id: 2, txt: "ไม่เคย" },
    ];
    group5 = [
        { id: 1, txt: "สื่อสังคมออนไลน์(Social)" },
        { id: 2, txt: "เคยรู้จักกันมาก่อน" },
    ];
    constructor(
        private router: Router,
        private _issueOnlineService: IssueOnlineService,
        private _bankInfoService: BankInfoService,
        private servicePersonal: PersonalService,
        private datePipe: DatePipe,
        private _BpmProcinstService: BpmProcinstService,
        private _OnlineCaseService: OnlineCaseService
    ) {}
    ngOnInit(): void {
        this.maxDateValue.setHours(this.maxDateValue.getHours() + 1);
        setTimeout(async () => {
            this.setDefaultData();
        }, 1000);
    }
    async setDefaultData() {
        if (this.mainConponent.formType === "add") {
            localStorage.setItem("form-index","1");
            this.formData = {};
            if(localStorage.getItem("form-blessing")){
                this.formData = JSON.parse(localStorage.getItem("form-blessing"));
                this.formblessingdata.BLESSINGNO1   = this.formData.BLESSINGNO1 ?? '';
                this.formblessingdata.BLESSINGNO2   = this.formData.BLESSINGNO2 ?? '';
                this.formblessingdata.BLESSINGNO2_3   = this.formData.BLESSINGNO2_3 ?? '';
                this.formblessingdata.BLESSINGNO3   = this.formData.BLESSINGNO3 ?? '';
                this.submission.ways = this.formData.WAY ?? '';
                this._dataSourcebankref = this.formData.BANK_REF ?? [];
                if(this._dataSourcebankref){
                    if(this._dataSourcebankref.length > 0){
                        this._isShow = true;
                    }
                }
            }else{
                //เก็บค่าที่ส่งมาจากแจ้งเตือนใหม่ไว้ในนี้นะครับ
                this._issueOnlineService.issueOnline$.subscribe((value) => {
                    this.issueOnline = value;
                    this.formBankref = value;
                    this.formData = value;
                });
            }
        }else{

            const _inst_id = Number(localStorage.getItem("inst_id"));
            // const dataForm = await this.mainConponent.formDataInsert;
            const procinstdata = await this._BpmProcinstService.getByInstId(_inst_id).toPromise();
            sessionStorage.setItem("case_id",procinstdata.DATA_ID);

            this.formReadOnly = true;
            this.formType ="edit"
            if(procinstdata.DATA_ID){
                const dataForm = await this._OnlineCaseService.getbycaseId(procinstdata.DATA_ID).toPromise();
                const bankRef = await this._OnlineCaseService.getBankRef(procinstdata.DATA_ID).toPromise();
                this.formblessingdata.BLESSINGNO1   = dataForm.BLESSINGNO1 ?? '';
                this.formblessingdata.BLESSINGNO2   = dataForm.BLESSINGNO2 ?? '';
                this.formblessingdata.BLESSINGNO2_3   = dataForm.BLESSINGNO2_3 ?? '';
                this.formblessingdata.BLESSINGNO3   = dataForm.BLESSINGNO3 ?? '';
                this.submission.ways = Number(dataForm.WAY) ?? '';

                if(dataForm.WAY == '2'){
                    this._isShow3 = true;
                }
                this._dataSourcebankref =   bankRef ?? [];
            }
        }
    }
    Back(e) {
        if(this.mainConponent.formType === "add"){
            this.mainConponent.NextIndex(this.mainConponent.indexTab - 1);
        }else{
            this.router.navigate([`/`]);
        }

    }
    SubmitForm(e) {
        if(this.mainConponent.formType === "add"){
            if (!this.formblessing.instance.validate().isValid) {
                Swal.fire({
                    title: "ผิดพลาด!",
                    text: "กรุณาเลือกตอบคำถามให้ครบทุกข้อ",
                    icon: "warning",
                    confirmButtonText: "Ok",
                }).then(() => {});
                this.mainConponent.checkValidate = true;
                return;
            }
            if(this._dataSourcebankref.length <= 0 && this._isShow){
                Swal.fire({
                    title: "ผิดพลาด!",
                    text: "กรุณาเพิ่มเลขอ้างอิงธนาคาร",
                    icon: "warning",
                    confirmButtonText: "Ok",
                }).then(() => {});
                this.mainConponent.checkValidate = true;
                return;
            } else {
                this.mainConponent.checkValidate = false;
                // this.formData.FORMQUESTIONARE = this.formblessingdata;
                this.formData.BLESSINGNO1   = this.formblessingdata.BLESSINGNO1 ;
                this.formData.BLESSINGNO2   = this.formblessingdata.BLESSINGNO2 ;
                this.formData.BLESSINGNO2_3   = this.formblessingdata.BLESSINGNO2_3 ;
                this.formData.BLESSINGNO3   = this.formblessingdata.BLESSINGNO3 ;
                this.formData.CHECK_BLESSING == false ? this.formData.BLESSING_STATUS = 'N' : this.formData.BLESSING_STATUS = 'Y';
                this.formData.BLESSINGNO1    ? this.formData.BLESSINGTXT1    = this.group1.filter(res => res.id == this.formData.BLESSINGNO1).map(_ => _.txt)[0]     : this.formData.BLESSINGTXT1    = null;
                this.formData.BLESSINGNO2    ? this.formData.BLESSINGTXT2    = this.group2.filter(res => res.id == this.formData.BLESSINGNO2).map(_ => _.txt)[0]     : this.formData.BLESSINGTXT2    = null;
                this.formData.BLESSINGNO2_3  ? this.formData.BLESSINGTXT2_3  = this.group2_3.filter(res => res.id == this.formData.BLESSINGNO2_3).map(_ => _.txt)[0] : this.formData.BLESSINGTXT2_3  = null;
                this.formData.BLESSINGNO3    ? this.formData.BLESSINGTXT3    = this.group3.filter(res => res.id == this.formData.BLESSINGNO3).map(_ => _.txt)[0]     : this.formData.BLESSINGTXT3    = null;
                this.formData.WAY = this.submission.ways;
                this.formData.BANK_REF = this._dataSourcebankref;
                this.mainConponent.formDataInsert = this.formData;
                this._issueOnlineService.issueOnline = this.formData;
                this.mainConponent.formDataAll.formBlessing = this.formData;
                localStorage.setItem("form-blessing",JSON.stringify(this.formData));
                //   this.mainConponent.formquestionnare1 = this.formblessingdata;
                // console.log("this.formData",this.formData);
            }
        }
        if(e != 'tab'){
            if(this.mainConponent.formType === "add"){
                this.mainConponent.NextIndex(this.mainConponent.indexTab = 2);
            }else{
                this.mainConponent.NextIndex(this.mainConponent.indexTab + 1 );
            }
        }
        //   this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);

        // this.mainConponent.MergeObj(this.formData);
    }

    Addbankref() {
        this.now = null;
        this.popupConsentVisible = true;
        this.popupType = "add";
    }
    onSkip(e) {
        this.submission = {};
        this.submission.ways = 1;
        this.now = null;
        this.popupConsentVisible = false;
    }

    onsave(e) {
        if(!this.submission.FREEZE_ACT_DATE && !this.submission.FREEZE_ACT_TIME){
            Swal.fire({
                title: 'ผิดพลาด!',
                text: 'กรุณาเลือกกรอกวันและเวลา',
                icon: 'warning',
                confirmButtonText: 'Ok',
            }).then(() => {});
            return;
        }
        if(!this.isBankID(this.submission.FREEZE_ACT_BANK_TRACK_NO)){
            Swal.fire({
                title: 'ผิดพลาด!',
                html: 'กรุณาเลขอ้างอิงให้ถูกต้อง<br><b>ตัวอย่าง</b> 25550115KTB06111',
                icon: 'warning',
                confirmButtonText: 'Ok',
            }).then(() => {});
            return;
        }
        this.submission.ways = 1;
        this.submission.FREEZE_ACT_BANK_TRACK_NO = this.submission.FREEZE_ACT_BANK_TRACK_NO.toUpperCase();
        if (this.popupType === 'add') {
            this._dataSourcebankref.push(this.submission);
        }else{
            this._dataSourcebankref[this.popupIndex] = this.submission;
        }
        this.submission = {};
        this.submission.ways = 1;
        this.now = null;
        this.blockSave=true;
        this.popupConsentVisible = false;
    }
    onDelete(index = null) {
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
                this._dataSourcebankref.splice(index, 1);
            }
        });
    }
    async onEdit(type, data = {} as any, index = null){
        this.popupConsentVisible = true
        this.popupType = 'edit';
        this.submission = {};
        const setData = {};
        this.popupIndex = index;
        // const setData = {};
        const d = data;
        for (const key in d) {
            if (d[key] !== null && d[key] !== undefined) {
                    setData[key] = d[key];
            }
        }
        this.submission = setData;
        const date = this.convertDate(this.submission.FREEZE_ACT_DATE,this.submission.FREEZE_ACT_TIME);
        this.now = new Date(date[0],date[1],date[2],date[3],date[4],date[5]);
        this.maxSizeBuffer = this.limitCaseChanelSize ?? 0;
    }

    onWaysValueChanged(event: any) {
        let val = event.value;
        switch (val) {
            case 1:
                this._isShow = true;
                this.popupConsentVisible = true
                this._isShow2 = false;
                this.popupType = "add"
                break;
            case 2:
                this._isShow = false;
                this._isShow2 = true;
                this._dataSourcebankref = [];
                break;
        }
    }

    onclosepopundepending(e) {
        this._isShow2 = false;
    }

    onclosepopShownot(e) {
        this._isShowNOT = false;
    }


    onchanecheckblessing(e) {
        const value = e.value;
        const formData = this.formData;
        const formblessingdata = this.formblessingdata;
        if (value) {
            formData.CHECK_BLESSING =
                value === "1.3" ||
                value === "2.2" ||
                value === "2.3.2" ||
                value === "2.3.3" ||
                value === "3.1";

            if (value === "1.1" || value === "1.2") {
                formblessingdata.BLESSINGNO2 = undefined;
                formblessingdata.BLESSINGNO2_3 = undefined;
                formblessingdata.BLESSINGNO3 = undefined;
                if(this.mainConponent.formType === "add"){
                    this._isShowNOT = true;
                    this.checkcase = false;
                }
            }else{
                this.checkcase = true;
            }
            if (value === "2.1" || value === "2.2") {
                formblessingdata.BLESSINGNO2_3 = undefined;
            }

            this._isShow3 = !(
                formblessingdata.BLESSINGNO1 === "1.1" ||
                formblessingdata.BLESSINGNO1 === "1.2" ||
                formblessingdata.BLESSINGNO2 === "2.1" ||
                formblessingdata.BLESSINGNO2_3 === "2.3.1" ||
                formblessingdata.BLESSINGNO3 === "3.2");
            if(!this._isShow3){
                this.submission.ways = null;
                this._isShow = false;
                this._dataSourcebankref = [];
            }
            // this._isShow3 = (formblessingdata.BLESSINGNO1 === "1.3" &&
            // (formblessingdata.BLESSINGNO2 === "2.2" || formblessingdata.BLESSINGNO2 === "2.3") &&
            // (formblessingdata.BLESSINGNO2_3 === "2.3.2" ||formblessingdata.BLESSINGNO2_3 === "2.3.3") &&
            // formblessingdata.BLESSINGNO3 === "3.1");

        }
    }
    TelLink(href) {
        const downloadLink = document.createElement("a");
        downloadLink.href = href;
        downloadLink.click();
    }
    async checkBank(e){
        if (!e.event || e.event.type === "change") {
            if(e.value){
                if(e.value.length >= 15){
                    const value = e.value;
                    const bank_name = value.replace(/\d+/g, '');
                    const upperString = bank_name.toUpperCase();
                    // var haveBank = await this._bankInfoService.GetBankTrackNo(upperString).toPromise();
                    // if(haveBank){
                    //     Swal.fire({
                    //         title: 'ผิดพลาด!',
                    //         html: 'เลขอ้างอิงนี้มีการแจ้งแล้ว',
                    //         icon: 'warning',
                    //         confirmButtonText: 'Ok',
                    //     }).then(() => {this.submission.FREEZE_ACT_BANK_NAME = "";this.blockSave=true;});
                    //     return;
                    // }
                    await this._bankInfoService.GetBankInfoByName(upperString).subscribe((_) =>{
                        if(_ != null){
                            this.submission.FREEZE_ACT_BANK_NAME = _[0].BANK_NAME;
                            this.blockSave=false;
                        }else{
                            Swal.fire({
                                title: "ผิดพลาด!",
                                text: "กรอกเลขอ้างอิงไม่ถูกต้อง",
                                icon: "warning",
                                confirmButtonText: "Ok",
                                }).then(() => {this.submission.FREEZE_ACT_BANK_NAME = "";this.blockSave=true;});
                            }
                    });
                }else{
                    Swal.fire({
                        title: "ผิดพลาด!",
                        text: "กรอกเลขอ้างอิงอย่างน้อย 15 หลัก",
                        icon: "warning",
                        confirmButtonText: "Ok",
                    }).then(() => {this.blockSave=true;});
                }
            }
        }
    }
    convertDate(date,time){
        const dateIN = String(date+" "+time);
        const [datePart, timePart] = dateIN.split(" ");
        const [year, month, day] = datePart.split("-");
        const [hours, minutes, seconds] = timePart.split(":");
        return [Number(year),Number(month)-1,Number(day),Number(hours),Number(minutes),Number(seconds)]
    }
    convertTimezone(time){
        const timeZoneOffset = 7 * 60;
        const timeZoneOffsetMs = 7 * 60 * 60 * 1000;
        const dateWithTimeZone = new Date(time.getTime() + timeZoneOffsetMs);
        const formattedString = dateWithTimeZone.toISOString().replace("Z", `+${timeZoneOffset.toString().padStart(2, "0")}:00`);
        return formattedString;
    }

    OnSelectDate(e) {
        if(e.value){
            const mydate = this.datePipe.transform(e.value, 'yyyy-MM-dd');
            const mytime = this.datePipe.transform(e.value, 'HH:mm:ss');
            this.submission.FREEZE_ACT_TIME = mytime;
            this.submission.FREEZE_ACT_DATE = mydate;
        }
    }

    CheckBankID(event) {
        // const seperator  = '^[ก-๏\\s]+$';
        const seperator = '^[A-Za-z0-9]';
        const maskSeperator = new RegExp(seperator, 'g');
        const result = maskSeperator.test(event.key);
        return result;
    }
    PasteCheckBankID(event) {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData.getData('text');
        // const seperator  = '^[ก-๏\\s]+$';
        const seperator = '^[A-Za-z0-9]';
        const maskSeperator = new RegExp(seperator, 'g');
        const result = maskSeperator.test(pastedText);
        return result;
    }
    isBankID(bankid): boolean {
        const pattern = /^[A-Za-z0-9]+$/;
        return pattern.test(bankid);
    }
}
