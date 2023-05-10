import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TrackingService } from 'src/app/services/tracking.service';
import { formatDate } from 'devextreme/localization';

@Component({
    selector: 'app-tracking-detail',
    templateUrl: './tracking-detail.component.html',
    styleUrls: ['./tracking-detail.component.scss']
})
export class TrackingDetailComponent implements OnInit {
    // data = [
    // { id: 1, text: 'ยื่นเรื่อง', date: '10-10-2020 06:00', icon: 'fa-paper-plane' },
    // { id: 2, text: 'นัดหมาย', date: '10-10-2020 06:00', icon: 'fa-calendar' },
    // { id: 3, text: 'กำลังดำเนินการ', date: '10-10-2020 06:00', icon: 'fa-hourglass' }];

    listdata: any;
    case_id? = this._activatedRoute.snapshot.params.case_id;
    pagelimit = 5;
    constructor(
        public _router: Router,
        public trackingService: TrackingService,
        public _activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {

        this.trackingService.getData(this.case_id,false).subscribe(res=>{
            this.listdata = res;
        });
    }
    Back(){
        this._router.navigate(["main/inform-online-list"]);
    }
    calculateIcon(e) {
        // console.log(e);
        switch (e) {
        case "C01":
            return "fa fa-paper-plane";
        case "C02":
            return "fa fa-edit";
        case "C03":
            return "fa fa-share-square";
        case "C04":
            return "fa fa-chart-line";
        case "C05":
            return "fa fa-calendar";
        case "C08":
            return "fas fa-pause";
        case "C09":
            return "fa fa-hourglass";
        }
        return "fa fa-exclamation";
    }

    calculateStatus(e) {
        switch (e) {
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


    formatDate(date) {
        return formatDate(new Date(date), "dateShortTimeThai");
    }

}
