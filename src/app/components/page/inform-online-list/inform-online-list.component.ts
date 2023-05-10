import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import DataSource from 'devextreme/data/data_source';
import { formatDate } from 'devextreme/localization';
import { OnlineCaseService } from 'src/app/services/online-case.service';

@Component({
    selector: 'app-inform-online-list',
    templateUrl: './inform-online-list.component.html',
    styleUrls: ['./inform-online-list.component.scss']
})
export class InformOnlineListComponent implements OnInit {
    _dataSource: DataSource;
    constructor(private router: Router, private onlineCaseServ: OnlineCaseService) { }

    ngOnInit(): void {
        this._dataSource = new DataSource(
            {
                byKey: () => undefined,
                load: () => this.onlineCaseServ.get().toPromise()
            }
        );
    }

    edit(cellValue){
        const data = cellValue.data;
        this.router.navigate(["/main/cyber/issue-online/" + data.DOCUMENT_ID]);
    }

    Add(){
        this.router.navigate(["/main/cyber/issue-online"]);
    }
    gourltracking(cellValue){
        const data = cellValue.data;
        this.router.navigate(["/main/tracking/" + data.CASE_ID]);
    }
    calculateStatus(e) {

        switch (e.data.CASE_STATUS) {
        case "C01":
            return "อยู่ระหว่างดำเนินการ";
        case "C02":
            return "อยู่ระหว่างสืบสวน/สอบสวน";
        case "C03":
            return "มอบหมายให้สภ. หรือสน.";
        case "C04":
            return "ส่งฟ้อง";
        case "C05":
            return "สิ้นสุด";
        case "C08":
            return "หยุดชั่วคราว";
        case "C09":
            return "ยกเลิก";
        }
        return "-";
    }

    formatDate(e) {
        return formatDate(new Date(e.CREATE_DATE), "dateShortTimeThai");
    }

}
