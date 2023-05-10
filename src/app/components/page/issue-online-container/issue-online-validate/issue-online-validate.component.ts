import { Component, OnInit, ViewChild } from "@angular/core";
import { DxFormComponent } from "devextreme-angular";
import { BankInfoService } from "src/app/services/bank-info.service";
import Swal from "sweetalert2";

import * as moment from 'moment';
import DataSource from 'devextreme/data/data_source';
import { OnlineCaseService } from "src/app/services/online-case.service";
import { finalize } from "rxjs/operators";
import { Router } from "@angular/router";
import { IssueOnlineContainerComponent } from "../issue-online-container.component";

@Component({
    selector: "app-issue-online-validate",
    templateUrl: "./issue-online-validate.component.html",
    styleUrls: ["./issue-online-validate.component.scss"],
})
export class IssueOnlineValidateComponent implements OnInit {
    @ViewChild("formContact1", { static: false }) formContact1: DxFormComponent;
    @ViewChild("formContact2", { static: false }) formContact2: DxFormComponent;
    public mainConponent: IssueOnlineContainerComponent;
    CurrentDate: Date;
    caseLabelName = {
        text0:"ชื่อช่องทางติดต่อคนร้าย",
        text1:"ชื่อ Line คนร้าย",
        text2:"ชื่อ Facebook คนร้าย",
        text3:"ชื่อ Instragram คนร้าย",
        text4:"ชื่อ Website คนร้าย",
        text5:"ชื่อ E-mail คนร้าย",
        text6:"ชื่อ SMS คนร้าย",
        text8:"ชื่อช่องทางติดต่อคนร้าย",
    };
    caseLabelID = {
        text0:"ID ช่องทางติดต่อคนร้าย",
        text1:"Line ID",
        text2:"Facebook ID",
        text3:"Instragram URL",
        text4:"Website URL",
        text5:"E-mail",
        text6:"หมายเลข SMS คนร้าย",
        text8:"ID ช่องทางติดต่อคนร้าย",
    };
    knowVillain = true;
    listNearStation: DataSource;
    isLang = [];
    public formData: any = {};
    isLoading = false;
    popupknowVillain = false;
    popupCaseChannel = false;
    popupLocation = false;
    socialPopup = false;
    formPopup: any = {};
    listDocFile = [];
    LabelCaseChanelName = "";
    LabelCaseChanelId = "";
    bankFormPopup = false;
    popupCaseMoney = false;
    constructor(
        private servBankInfo: BankInfoService,
        private _onlineCaseServ: OnlineCaseService,
        private _router: Router,
    ) {}

    ngOnInit(): void {
        this.servBankInfo.GetLanguage().subscribe((_) => {
            this.isLang = _;
            this.reloadData();
        });
        this.CurrentDate = moment().toDate();
        this.loadData();
    }
    public reloadData(){
        this.formData = {};
        this.formData = this.mainConponent.formDataInsert;
    }

    loadData() {
        this.listNearStation = new DataSource({
            pageSize: 10,
            byKey: (_) => undefined,
            load: (opt) => {
                const conditon: any = {};
                conditon.ORGANIZE_NAME_THA = opt.searchValue;
                return this.servBankInfo.SearchNearStation(conditon, opt.skip, opt.take)
                    .toPromise()
                    .then(_ => {
                    // console.log(_);
                        if (!_.Data) {
                            _.Data = [];
                        }
                        return { data: _.Data, totalCount: _.TotalCount };
                    });
            }

        });
    }
    CheckTotal(e) {
        if (e) {
            return e;
        } else {
            return 0;
        }

    }
    KnowVillainAddData(){}
    KnowVillainEditData(type, data = {} as any, index = null){
        this.popupknowVillain = true;
        this.formPopup = data;
    }
    CaseChannelAddData(){}
    CaseChannelEditData(type, data = {} as any, index = null){
        this.popupCaseChannel = true;
        this.formPopup = data;
        this.formPopup.CASE_CHANNEL_DATETIME_MATCH = (data.CASE_CHANNEL_DATETIME_MATCH)?true:false;
        this.listDocFile = data.CHANNEL_DOC ?? [];
        this.ChangeLabelCaseChanelId(data.CHANNEL_ID);
    }
    ChangeLabelCaseChanelId(_number: number = 0){
        const labelKey ="text"+ _number;
        this.LabelCaseChanelName = this.caseLabelName[labelKey];
        this.LabelCaseChanelId = this.caseLabelID[labelKey];
    }
    DownloadFileCaseDoc(data) {
        const linkSource = data.url;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = data.originalName;
        downloadLink.click();
    }
    LocationEditData(type = 1, data = {} as any, index = null){
        const setData =  {};
        const keyType = `_${type}`;
        for (const key in data) {
            if (data[key] !== null && data[key] !== undefined) {
                const newKey = key.replace(keyType, '');
                setData[newKey] = data[key];

            }
        }
        this.popupLocation = true;
        this.formPopup = setData;

    }
    BankEditData(type, data = {} as any, index = null){
        this.bankFormPopup = true;
        this.formPopup = data;

    }
    SocialEditData(type, data = {} as any, index = null){
        this.socialPopup = true;
        this.formPopup = data;


    }
    closePupup(){
        this.popupknowVillain = false;
        this.popupCaseChannel = false;
        this.popupLocation = false;
        this.bankFormPopup = false;
        this.socialPopup = false;
        this.formPopup = {};
    }
    CaseMoneyEditData(type, data = {} as any, index = null){
        this.popupCaseMoney = true;
        this.formPopup = data;
    }

    CaseMoneyClose(){
        this.popupCaseMoney = false;
        this.formPopup = {};

    }

    Back(e){
        this.mainConponent.NextIndex(this.mainConponent.indexTab - 1);
    }
    SubmitForm(e) {
        this.formData = this.mainConponent.formDataInsert;
        const formdataAll = this.mainConponent.MergeObj(this.formData);
        if (this.mainConponent.formType === 'add') {
            this.InsertForm(formdataAll);
        }else{
            delete formdataAll._id;
            delete formdataAll.backendId;
            this.UpdateForm({
                InstId:this.mainConponent.InstId,
                ProcessInstanceId:this.mainConponent.ProcessInstanceId,
                Submission:formdataAll,
            });
        }


    }
    InsertForm(data){
        this.isLoading = true;
        this._onlineCaseServ.InsertDataMQ(data)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe(_ => {
                Swal.fire({
                    title: 'สำเร็จ!',
                    text: 'บันทึกข้อมูลสำเร็จ',
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                }).then(() => {
                    this._router.navigate(['main/tasklist']);
                });
            });
    }
    UpdateForm(data){
        this.isLoading = true;
        this._onlineCaseServ.UpdateData(this.mainConponent.caseId,data)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe(_ => {
                alert('success');
            });
    }


}


