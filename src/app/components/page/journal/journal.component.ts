import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import DataSource from 'devextreme/data/data_source';
import { formatDate } from 'devextreme/localization';
import { FormioRenderComponent, FormSubmitService } from 'eform-share';
import { Dialog } from 'share-ui';
import { OnlineCaseParam } from 'src/app/common/@type/online-case';
import { pathCombine } from 'src/app/common/helper';
import { OnlineRecordService } from 'src/app/services/online-record.service';
import { User } from 'src/app/services/user';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-journal',
    templateUrl: './journal.component.html',
    styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {
    _dataSource: DataSource;
    constructor(private router: Router, private _onlineRecordServ: OnlineRecordService) { }

    ngOnInit(): void {
        this._dataSource = new DataSource(
            {
                byKey: () => undefined,
                load: () => this._onlineRecordServ.gets().toPromise()
            }
        );
    }


    add() {
        this.router.navigate(["/main/cyber/journal"]);
    }


    view(cellValue) {
        const data = cellValue.data;
        this.router.navigate(["/main/cyber/journal/" + data.DOCUMENT_ID]);
    }

    formatStatus(e) {
        return {
            D: "ฉบับร่าง",
            W: "รอประชาชนตรวจสอบ",
            F: "เจ้าหน้าที่ตรวจสอบ",
            P: "ฉบับจริง",
            CP: "เสร็จสิ้น",
            WV: "รอตรวจสอบ",
            RA: "ปฎิเสธ",
            WA: "รออนุมัติ",
        }[e.RECORD_ID_STATUS];
    }
    viewFile(x) {
        this.router.navigate(["/main/cyber/journal/edit/20"]);
    }
    imgAttFile(x) {
        return "assets/icon/[edit].png";
    }

    viewPdf(x) {
        // window.open('http//203.151.56.161/web-report/report?ReportName=Report_daily_journal&id='+ x.key.RECORD_ID);
        const report = `Report?ReportName=Report_daily_journal&id=${x.key.RECORD_ID}`;
        window.open(pathCombine(environment.config.baseConfig.reportUrl, report));
    }

    imgAttPdf(x) {
        return "assets/icon/pdf.png";
    }


    formatDate(e) {
        return formatDate(new Date(e.CREATE_DATE), "dateShortTimeThai");
    }

}
