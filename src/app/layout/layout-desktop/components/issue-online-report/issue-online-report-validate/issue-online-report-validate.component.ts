import { Component, OnInit } from '@angular/core';
import { IssueOnlineReportComponent } from '../issue-online-report.component';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { OnlineIssueReportService } from 'src/app/services/online-issue-report';

@Component({
    selector: 'app-issue-online-report-validate',
    templateUrl: './issue-online-report-validate.component.html',
    styleUrls: ['./issue-online-report-validate.component.scss']
})
export class IssueOnlineReportValidateComponent implements OnInit {

    public mainConponent: IssueOnlineReportComponent;

    formReadOnly = true;
    checkothertitle = false;
    formData: any = {};
    listCaseType = [];
    caseType = "";
    caseOpen = false;
    isLoading = false;
    cmstitle = [
        { TITLE_ID: "นาย", TITLE_NAME: "นาย" },
        { TITLE_ID: "นาง", TITLE_NAME: "นาง" },
        { TITLE_ID: "นางสาว", TITLE_NAME: "นางสาว" },
        { TITLE_ID: "อื่นๆ", TITLE_NAME: "อื่นๆ" },
    ];

    serviceLabelID = [
        {ID:1,TEXT:"AIS"},
        {ID:2,TEXT:"TRUE"},
        {ID:3,TEXT:"DTAC"},
        {ID:4,TEXT:"NT (CAT TOT)"},
        {ID:5,TEXT:"อื่น ๆ"},
    ];

    monthFulltTh = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
        'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
        'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    dataAttachment = [];

    constructor(private _router: Router,private _serviceCase:OnlineIssueReportService) { }

    ngOnInit(): void {
        setTimeout(() => {
            this.loadData();
        },100);
    }

    public async loadData(){
        setTimeout(() => {
            const mergedFrom = Object.assign({},
                this.mainConponent.formInsert.formInformer,
                this.mainConponent.formInsert.formEvent);
            this.formData = mergedFrom;
            this.dataAttachment = mergedFrom.ATTACHMENT ?? [];
        }, 200);
    }

    Submit(){
        const setData = {};
        const data = this.formData;
        for (const key in data) {
            if (data[key] !== null
                && data[key] !== undefined
                && key !== 'listDamageBank'
                && key !== 'listDamageBankOther'
                && key !== 'listDamageOther'
                && key !== 'listDamageCrypto'
            ) {
                setData[key] = data[key];
            }
        }
        Swal.fire({
            title: 'ยืนยันการแจ้งเบาะแสเข้าสู่ระบบ!!',
            text: "",
            icon: 'warning',
            confirmButtonText: 'ยืนยัน',
            showCancelButton: true,
            cancelButtonText: 'กลับไปแก้ไข'
        }).then((result) => {
            if (result.isConfirmed) {
                this.isLoading = true;
                this._serviceCase.InsertData(setData)
                    .pipe(finalize(() => this.isLoading = false))
                    .subscribe(() => {
                        Swal.fire({
                            title: 'แจ้งเรื่องสำเร็จ!',
                            text: '',
                            icon: 'success',
                            confirmButtonText: 'ตกลง'
                        }).then(() => {
                            this._router.navigate(['/main/task-list']);
                        });
                    });
            } else {
                this.isLoading = false;
            }
        });
    }

    Back(e){
        this.mainConponent.NextIndex(this.mainConponent.indexTab - 1);
    }

    async openPdfInNewTabAdd(e): Promise<void> {
        const something = e.Url.split(',')[1] || e.Url
        const fileData = atob(something)
        const blob = new Blob([new Uint8Array([...fileData].map(item => item.charCodeAt(0)))], { type: e.Type })
        const fileUrl = URL.createObjectURL(blob)
        window.open(fileUrl, '_blank')
    }

    ConvertDateFullMonth(date) {
        const d = new Date(date);
        const month = d.getMonth();
        const ddate = ` ${d.getDate()} `;
        const textMonthNow = ` ${this.monthFulltTh[month]}`;
        const year = (d.getFullYear() + 543);
        return [ddate, ' ', textMonthNow, ' ', year].join("");
    }

}
