import { Component, OnInit } from '@angular/core';
import { BankInfoService } from 'src/app/services/bank-info.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { IssueOnlineContainerComponent } from '../issue-online-container.component';

@Component({
    selector: 'app-issue-online-check',
    templateUrl: './issue-online-check.component.html',
    styleUrls: ['./issue-online-check.component.scss']
})
export class IssueOnlineCheckComponent implements OnInit {
    public mainConponent: IssueOnlineContainerComponent;
    _isShow: boolean = false;
    _isShow2: boolean = false;
    showBank: boolean = false;
    blockSave = true;
    checkcase : boolean = false;
    popupConsentVisible: boolean = false;
    popupType = 'add';
    popupIndex = 0;
    maxSizeBuffer = 0;
    limitCaseChanelSize = 0;
    maxDateValue:Date = new Date();
    now: any;
    _dataSourcebankref: any = [];
    submission = {} as any;
    formData: any = {};
    waysMoney = [
        { id: 1, text: "เงิน" },
        { id: 2, text: "ทรัพย์สินอื่น ๆ" },
        { id: 3, text: "ชื่อเสียง" },
        { id: 4, text: "Cryptocurrency" },
    ];
    ways = [
        { id: 2, text: "ยังไม่ได้ติดต่อธนาคาร" },
        { id: 1, text: "ติดต่อธนาคาร และได้รับเลขอ้างอิง (Bank Case ID) แล้ว" },
    ];

    constructor(
        private _bankInfoService: BankInfoService,
        private datePipe: DatePipe,
        ) { }

    ngOnInit(): void {
        this.maxDateValue.setHours(this.maxDateValue.getHours() + 1);
        this.setDefaultData();
    }

    async setDefaultData() {
            localStorage.setItem("form-index","1");
            this.formData = {};
            if(localStorage.getItem("form-blessing")){
                this.formData = JSON.parse(localStorage.getItem("form-blessing"));
                this.submission.ways = this.formData.WAY ?? '';
                this.submission.moneyWay = this.formData.MoneyWAY ?? '';
                this._dataSourcebankref = this.formData.BANK_REF ?? [];
                if(this._dataSourcebankref){
                    if(this._dataSourcebankref.length > 0){
                        this._isShow = true;
                    }
                }
            }else{
            }
    }
    onWaysValueChangedMoney(event: any) {
        console.log(this._dataSourcebankref);
        let val = event.value;
        this.submission.moneyWay = val;
        if(val){
            if(val==1){
                this.showBank = true
                    if(this.submission.ways == 1 && this._dataSourcebankref.lenght > 0){
                        this.checkcase = true;
                    }else{
                        this.checkcase = false;
                    }
            }else{
                this.showBank = false;
                this.checkcase = true;
            }
        }
    }

    onWaysValueChanged(event: any) {
        let val = event.value;
        switch (val) {
            case 1:
                this.checkcase = true;
                this._isShow = true;
                this.popupConsentVisible = true
                this._isShow2 = false;
                this.popupType = "add"
                break;
            case 2:
                this.checkcase = false;
                this._isShow = false;
                this._isShow2 = true;
                this._dataSourcebankref = [];
                break;
        }
    }

    Addbankref() {
        this.now = null;
        this.popupConsentVisible = true;
        this.popupType = "add";
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

    TelLink(href) {
        const downloadLink = document.createElement("a");
        downloadLink.href = href;
        downloadLink.click();
    }

    onclosepopundepending(e) {
        this._isShow2 = false;
    }

    OnSelectDate(e) {
        if(e.value){
            const mydate = this.datePipe.transform(e.value, 'yyyy-MM-dd');
            const mytime = this.datePipe.transform(e.value, 'HH:mm:ss');
            this.submission.FREEZE_ACT_TIME = mytime;
            this.submission.FREEZE_ACT_DATE = mydate;
        }
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
        this.submission.FREEZE_ACT_BANK_TRACK_NO = this.submission.FREEZE_ACT_BANK_TRACK_NO.toUpperCase();
        if (this.popupType === 'add') {
            this._dataSourcebankref.push(this.submission);
        }else{
            this._dataSourcebankref[this.popupIndex] = this.submission;
        }
        this.submission = {};
        this.submission.ways = 1;
        this.submission.moneyWay = 1;
        this.now = null;
        this.blockSave=true;
        this.popupConsentVisible = false;
    }

    onSkip(e) {
        this.submission = {};
        this.submission.ways = 1;
        this.now = null;
        this.popupConsentVisible = false;
    }

    async checkBank(e){
        if (!e.event || e.event.type === "change") {
            if(e.value){
                if(e.value.length >= 15){
                    const value = e.value;
                    const bank_name = value.replace(/\d+/g, '');
                    const upperString = bank_name.toUpperCase();
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

    SubmitForm(e) {
        if(this._dataSourcebankref.length <= 0 && this._isShow){
            Swal.fire({
                title: "ผิดพลาด!",
                text: "กรุณาเพิ่มเลขอ้างอิงธนาคาร",
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => {});
            return;
        } else {
            this.formData.MoneyWAY = this.submission.moneyWay;
            this.formData.BLESSING_STATUS = "Y";
            this.formData.CHECK_BLESSING = true;
            this.formData.WAY = this.submission.ways;
            this.formData.BANK_REF = this._dataSourcebankref;
            console.log(this.formData);
            localStorage.setItem("form-blessing",JSON.stringify(this.formData));
            if(e != 'tab'){
                this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
            }
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

    convertDate(date,time){
        const dateIN = String(date+" "+time);
        const [datePart, timePart] = dateIN.split(" ");
        const [year, month, day] = datePart.split("-");
        const [hours, minutes, seconds] = timePart.split(":");
        return [Number(year),Number(month)-1,Number(day),Number(hours),Number(minutes),Number(seconds)]
    }

}
