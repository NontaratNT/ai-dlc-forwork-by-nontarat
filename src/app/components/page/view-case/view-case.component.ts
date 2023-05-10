import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OnlineCaseInfo } from 'src/app/common/@type/online-case';
import { OnlineCaseService } from 'src/app/services/online-case.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CheckDocumentService } from 'src/app/services/check-document.service';
import { pathCombine } from 'src/app/common/helper';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-view-case',
    templateUrl: './view-case.component.html',
    styleUrls: ['./view-case.component.scss']
})

export class ViewCaseComponent implements OnInit  {
    case_id: number;
    caseRecordRefNo: string;
    formdata: OnlineCaseInfo;
    url: string;
    safeUrl: any;
    constructor(private onlineCaseService: OnlineCaseService,
                private activeRoute: ActivatedRoute,
                private _checkDucument: CheckDocumentService,
                private sanitizer: DomSanitizer) {
        this.formdata = {} as any;
    }

    ngOnInit(): void {

        this.caseRecordRefNo = this.activeRoute.snapshot.params.caseId;
        // this.onlineCaseService.getbyId(this.caseRecordRefNo).subscribe( data =>  {
        //     this.formdata = data;
        //     this.url = pathCombine(environment.config.baseConfig.reportUrl, "Report?ReportName=Report_daily_journal&id=" + data.CASE_ID);
        //     this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
        // });
        this._checkDucument.getDocument(this.caseRecordRefNo).subscribe( data => {
            this.formdata = data;
            this.url = pathCombine(environment.config.baseConfig.reportUrl, "Report?ReportName=Report_daily_journal&id=" + data.CASE_ID);
            this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
            // console.log('this.safeUrl->>>>>');
            // console.log(this.safeUrl);
        });
    }

}
