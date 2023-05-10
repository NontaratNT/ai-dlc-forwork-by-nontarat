import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { OnlineCaseService } from "src/app/services/online-case.service";
import { PersonalService } from "src/app/services/personal.service";
import { User } from "src/app/services/user";
import { IssueOnlineContainerComponent } from "../issue-online-container.component";
import Swal from "sweetalert2";
import { ConvertDateService } from "src/app/services/convert-date.service";
import { BankInfoService } from "src/app/services/bank-info.service";
import { DxSelectBoxComponent } from "devextreme-angular";

@Component({
    selector: "app-issue-online-validate",
    templateUrl: "./issue-online-validate.component.html",
    styleUrls: ["./issue-online-validate.component.scss"],
})
export class IssueOnlineValidateComponent implements OnInit {
    @ViewChild("selectCaseChannel", { static: false }) selectCaseChannel: DxSelectBoxComponent;
    public mainConponent: IssueOnlineContainerComponent;
    monthFulltTh = [
        'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน',
        'พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม',
        'กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'
    ];
    personalInfo = {};
    formData: any = {};
    isLoading = false;
    reload = true;
    userType = 'mySelf';
    listDamageBank: any = [];
    listDamageBankOther: any = [];
    listDamageOther: any = [];
    loadDateBox = false;
    formLocation: any = {};
    formLocationLoad = false;
    formLocationTranfer: any = {};
    formLocationTranferLoad = false;
    formLocationBankVictim: any = {};
    formLocationBankVictimLoad = false;
    formLocationBankVillain: any = {};
    formLocationBankVillainLoad = false;
    popupCaseChannel = false;
    popupIndex = 0;
    formPopup: any = {};
    listDocFile: any = [];
    listCaseChannel: any = [];
    showCaseLabelName ="";
    showcaseLabelID ="";
    showcaseCode ="";
    showcaseOption ="";
    popupViewFile = false;
    popupViewFileData: any = {};
    minBirthDate: Date;
    maxBirthDate: Date;
    popupFormData: any = {};
    promote = [
        {ID:"ใช่",TEXT:"ใช่"},
        {ID:"ไม่ใช่",TEXT:"ไม่ใช่"},
    ];
    constructor(
        private servicePersonal: PersonalService,
        private _onlineCaseServ: OnlineCaseService,
        private _router: Router,
        private _date: ConvertDateService,
        private servBankInfo: BankInfoService,

    ) {}

    ngOnInit(): void {
        const userId = User.Current.PersonalId;
        this.servicePersonal
            .GetPersonalById(userId)
            .subscribe((_) => {

                this.minBirthDate = this._date.SetDateDefault(80,true,true,true);
                this.maxBirthDate = this._date.SetDateDefault(0);
                this.personalInfo = _;
                this.ReloadData();
            });

    }
    setDataLocation(){
        const d = this.mainConponent.formDataAll.formEvent;
        this.formLocation = d;
        this.formLocationTranfer = d;
        this.formLocationBankVictim = d;
        this.formLocationBankVillain = d;

        this.formLocationLoad = true;
        this.formLocationTranferLoad = true;
        this.formLocationBankVictimLoad = true;
        this.formLocationBankVillainLoad = true;
    }
    async ReloadData(){
        this.isLoading = true;
        this.listCaseChannel  = await this.servBankInfo.GetCaseChannel().toPromise();

        this.loadDateBox = false;
        this.reload = false;
        this.formLocationLoad = false;
        this.formData = {};
        setTimeout(()=>{
            this.userType = this.mainConponent.userType;
            const d = this.mainConponent.formDataAll;
            const formSubmit = Object.assign({},
                d.formInformer,d.formEvent,
                d.formDamage,d.formVaillain,
                d.formAttachment,d.formConfigs
            );
            this.formData = formSubmit;

            this.listDamageBank = d.formDamage.listDamageBank ?? [];
            this.listDamageBankOther = d.formDamage.listDamageBankOther ?? [];
            this.listDamageOther = d.formDamage.listDamageOther ?? [];
            this.reload = true;
            this.loadDateBox = true;
            this.isLoading = false;
            this.popupFormData = this.formData.Bank_personal_list;
            this.setDataLocation();

        }, 500);


        // this.formData.CASE_INFORMER_DATE = this._date.ConvertToDateFormat(this.formData.CASE_INFORMER_DATE);

    }
    CheckStatusDamage(){
        if (this.formData.CASE_MONEY_TYPE1 === 'Y'
            || this.formData.CASE_MONEY_TYPE2 === 'Y'
            || this.formData.CASE_MONEY_TYPE3 === 'Y'
            || this.formData.CASE_MONEY_TYPE4 === 'Y'){
            return true;
        }
        return false;

    }
    CheckStatusLeft(){
        if (this.formData.CASE_MONEY_TYPE1 ==='Y' && this.formData.CASE_MONEY_TYPE2 ==='Y'){
            return "เงิน,ทรัพย์สินอื่นๆ";
        }else if (this.formData.CASE_MONEY_TYPE1 ==='Y'){
            return "เงิน";
        }else if (this.formData.CASE_MONEY_TYPE2 ==='Y'){
            return "เงิน";
        }
        return "";
    }
    CheckStatusRight(){
        if (this.formData.CASE_MONEY_TYPE3 ==='Y' && this.formData.CASE_MONEY_TYPE4 ==='Y'){
            return "โอนเงินผ่านธนาคาร, โอนเงินด้วยวิธีอื่น";
        }else if (this.formData.CASE_MONEY_TYPE3 ==='Y'){
            return "โอนเงินผ่านธนาคาร";
        }else if (this.formData.CASE_MONEY_TYPE4 ==='Y'){
            return "โอนเงินด้วยวิธีอื่น";
        }
        return "";
    }
    CheckSammaryValue(num){
        if (num){
            return parseFloat(num).toFixed(2);
        }
        return 0;
    }
    ConvertDateFullMonth(date) {
        const d = new Date(date);
        const month = d.getMonth();
        const ddate = ` ${d.getDate()} `;
        const textMonthNow = ` ${this.monthFulltTh[month]}`;
        const year = (d.getFullYear() + 543);
        return [ddate,' ' , textMonthNow , ' ', year].join("");
    }
    DownloadFile(data) {
        const linkSource = data.url;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = data.originalName;
        downloadLink.click();
    }
    CheckArray(data: any = []){
        const countArray = data.length ?? 0;
        if (countArray > 0){
            return true;
        }
        return false;

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
    async CaseChannelEditData(data = {} as any, index = null){
        this.isLoading = true;
        this.popupCaseChannel = true;
        this.popupIndex = index;
        this.formPopup = {};

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

        this.isLoading = false;
    }
    CaseChannelclose(){
        this.popupCaseChannel = false;
        this.formPopup = {};
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
    PopupViewFile(data) {
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
    Back(e){
        this.mainConponent.NextIndex(this.mainConponent.indexTab -1);
    }
    SubmitForm(e) {
        if (this.mainConponent.formType === 'add') {
            this.InsertForm(e,this.formData);
        }else{
            // delete formdataAll._id;
            // delete formdataAll.backendId;
            // this.UpdateForm({
            //     InstId:this.mainConponent.InstId,
            //     ProcessInstanceId:this.mainConponent.ProcessInstanceId,
            //     Submission:formdataAll,
            // });
        }


    }
    InsertForm(e,data){
        this.isLoading = true;
        const setData = {};
        for (const key in data) {
            if (data[key] !== null
                && data[key] !== undefined
                && key !== 'listDamageBank'
                && key !== 'listDamageBankOther'
                && key !== 'listDamageOther'
            ) {
                setData[key] = data[key];
            }
        }
        Swal.fire({
            title: 'ยืนยันการแจ้งเรื่องเข้าสู่ระบบ!!',
            text: "การแจ้งความออนไลน์เป็นการอำนวยความสะดวกแก่ท่านในการร้องทุกข์และแจ้งความประสงค์" +
                "ให้อายัดเงินที่โอนเข้าไปในบัญชีคนร้ายและผู้เกี่ยวข้องโดยเร็ว " +
                "ทันสถานการณ์ และท่านต้องไปให้ปากคำต่อพนักงานสอบสวนตามที่นัดหมาย เพื่อให้เป็นไปตามกฏหมายกำหนด"+
                "ระบบจะส่งเรื่องไปที่หน่วยงาน "+this.formData.ORG_LOCATION_NAME+" กรุณาตรวจสอบข้อมูลก่อนกดยืนยัน",
            icon: 'warning',
            confirmButtonText: 'ตกลง',
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                this._onlineCaseServ.InsertDataMQ(setData)
                    .pipe(finalize(() => this.isLoading = false))
                    .subscribe(() => {
                        Swal.fire({
                            title: 'แจ้งเรื่องสำเร็จ!',
                            text: 'กรุณารอเรื่องเข้าสู่ระบบ 1-3 นาที',
                            icon: 'success',
                            confirmButtonText: 'ตกลง'
                        }).then(() => {
                            this._router.navigate(['/main/task-list']);
                        });
                    });
            } else {
                this.isLoading = false;
                console.log();
            }
        });
    }
    // UpdateForm(data){
    //     this.isLoading = true;
    //     this._onlineCaseServ.UpdateData(this.mainConponent.caseId,data)
    //         .pipe(finalize(() => this.isLoading = false))
    //         .subscribe(_ => {
    //             alert('success');
    //         });
    // }
}
