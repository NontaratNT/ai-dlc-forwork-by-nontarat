import { Component, OnInit, ViewChild } from "@angular/core";
import { DxFormComponent, DxSelectBoxComponent } from "devextreme-angular";
import { BankInfoService } from "src/app/services/bank-info.service";
import Swal from "sweetalert2";

import * as moment from 'moment';
import DataSource from 'devextreme/data/data_source';
import { IssueOnlineContainerComponent } from "../issue-online-container.component";

@Component({
    selector: "app-issue-online-contact",
    templateUrl: "./issue-online-contact.component.html",
    styleUrls: ["./issue-online-contact.component.scss"],
})
export class IssueOnlineContactComponent implements OnInit {
    @ViewChild("formContact1", { static: false }) formContact1: DxFormComponent;
    @ViewChild("formContact2", { static: false }) formContact2: DxFormComponent;
    @ViewChild("selectNearStation", { static: false }) selectNearStation: DxSelectBoxComponent;

    public mainConponent: IssueOnlineContainerComponent;
    CurrentDate: Date;
    listbankFormInfo = [{
        dataDate:"2560-10-10",
        dataTime:"12:12",
        BankType:"ธนาคาร",
        BankAccount:"ธนาคารกสิกรไทย",
        BankOrg:"ธ.กสิกรไทย สาขาบิ๊กซี นางเลิ้ง",
        OrgStation:"สถานีตำรวจนครบาลนางเลิ้ง",
        BankAddress:"123132123",
    }];
    knowVillain = false;
    listNearStation: DataSource;
    isLang = [];
    formData: any = {};
    nearStationCondition = "";
    constructor(private servBankInfo: BankInfoService) {}

    ngOnInit(): void {
        this.servBankInfo.GetLanguage().subscribe((_) => {
            this.isLang = _;
            this.setDefaultData();
        });
        this.CurrentDate = moment().toDate();
        this.loadData();
    }
    setDefaultData(){
        if (this.mainConponent.formType === 'add') {
            this.formData = {
                stationId: null,
                APPOINTMENT_DATE: null,
                APPOINTMENT_TIME: null,
                APPOINTMENT_NO: null,
            };
        }else{
            this.formData = this.mainConponent.formDataInsert;
            if (this.formData.stationId) {
                this.listNearStation.items().push({
                    ORGANIZE_ID: this.formData.stationId,
                    ORGANIZE_NAME_THA: this.formData.STATION_NAME_THA,
                });
                this.nearStationCondition = `ORGANIZE_ID <> ${this.formData.stationId}`;
            }
        }

    }
    OnSelectNearStation(e) {
        if (e.value) {
            const data = this.selectNearStation.instance.option("selectedItem");
            this.formData.stationId = data.ORGANIZE_ID;
            this.formData.STATION_NAME_THA = data.ORGANIZE_NAME_THA;
        }
    }
    CheckNumber(event) {
        const seperator = '^([0-9])';
        const maskSeperator =  new RegExp(seperator , 'g');
        const result =maskSeperator.test(event.key);
        return result;
    }
    PasteCheckNumber(event) {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData.getData('text');
        const seperator = '^([0-9])';
        const maskSeperator =  new RegExp(seperator , 'g');
        const result =maskSeperator.test(pastedText);
        return result;
    }
    loadData() {
        this.listNearStation = new DataSource({
            pageSize: 10,
            byKey: (_) => undefined,
            load: (opt) => {
                const conditon: any = {};
                conditon.ORGANIZE_NAME_THA = opt.searchValue;
                if (this.mainConponent.formType === 'edit') {
                    conditon._custom = this.nearStationCondition;
                }
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
    Back(e){
        this.mainConponent.NextIndex(this.mainConponent.indexTab - 1);
    }
    SubmitForm(e) {
        if (!this.formContact1.instance.validate().isValid || !this.formContact2.instance.validate().isValid) {
            Swal.fire({
                title: "ผิดพลาด!",
                text: "กรุณากรอกข้อมูลให้ครบ",
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => {});
            return;
        }
        this.mainConponent.MergeObj(this.formData);
        this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
    }
}
