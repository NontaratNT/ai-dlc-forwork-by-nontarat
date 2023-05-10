import { Component, Input, OnInit } from "@angular/core";
import { ResizedEvent } from "angular-resize-event";
import * as moment from "moment";
import { BpmDataShareService } from "src/app/layout/layout-desktop/components/issue-online-edit/bpm-data-share.service";
import { BpmAppointmentService } from "src/app/services/bpm-appointment.service";
import { PersonalService } from "src/app/services/personal.service";
import { User } from "src/app/services/user";
import { IssueOnlineContainerComponent } from "../issue-online-container.component";

@Component({
    selector: "app-track-appointment",
    templateUrl: "./track-appointment.component.html",
    styleUrls: ["./track-appointment.component.scss"],
})
export class TrackAppointmentComponent implements OnInit {
    //     @Input() dataForm: any;
    //     public mainConponent: IssueOnlineContainerComponent;
    //     monthShortTh = [
    //         "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    //         "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    //     ];
    //     monthFulltTh = [
    //         'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
    //         'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
    //         'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    //     ];
    //     isLoading = true;
    //     personalInfo: any = {};
    //     formData: any = {};
    //     appointmentOpen = false;
    //     appointmentList: any = [];
    //     constructor(
    //         private servicePersonal: PersonalService,
    //         private _bpmAppointmentService: BpmAppointmentService,

    //     ) { }

    //     ngOnInit(): void {
    //         this.isLoading = true;
    //         this.appointmentOpen = false;
    //         const data = this.dataForm || null;
    //         const instId = data.InstId || null;
    //         this._bpmAppointmentService.GetAppointmentInsId(instId).subscribe((listItem) => {
    //             if (listItem) {
    //                 this.appointmentList = listItem;
    //                 this.appointmentOpen = true;
    //             }
    //             this.isLoading = false;
    //             console.log(this.appointmentList);
    //         });
    //     }
    //     ConvertDateFullMonth(date) {
    //         const d = new Date(date);
    //         const month = d.getMonth();
    //         const ddate = ` ${d.getDate()} `;
    //         const textMonthNow = ` ${this.monthFulltTh[month]}`;
    //         const year = (d.getFullYear() + 543);
    //         return [ddate, ' ', textMonthNow, ' ', year].join("");
    //     }

    //     ConvertDateToMomentTime(date) {
    //         if (date === null) {
    //             return '00:00';
    //         }
    //         return moment(date, "YYYY-MM-DD HH:mm:ss").format('HH:mm');
    //     }
    //     PhoneNumberFormat(phoneNumber) {
    //         const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    //         const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    //         if (match) {
    //             return match[1] + '-' + match[2] + '-' + match[3];
    //         }
    //         return null;
    //     }

    // }
    @Input() dataForm: any;
    public mainConponent: IssueOnlineContainerComponent;
    monthShortTh = [
        "ม.ค.",
        "ก.พ.",
        "มี.ค.",
        "เม.ย.",
        "พ.ค.",
        "มิ.ย.",
        "ก.ค.",
        "ส.ค.",
        "ก.ย.",
        "ต.ค.",
        "พ.ย.",
        "ธ.ค.",
    ];
    monthFulltTh = [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
    ];
    isLoading = true;
    personalInfo: any = {};
    formData: any = {};
    appointmentOpen = false;
    appointmentList: any = [];
    blockClass = "col-8";
    blockTitleCardRight = "right";
    caseWorking = false;
    appointmentHasData = false;
    constructor(
        private servicePersonal: PersonalService,
        private _bpmAppointmentService: BpmAppointmentService,
        private shareBpmData: BpmDataShareService
    ) { }

    ngOnInit(): void {
        this.isLoading = true;
        // this.appointmentOpen = false;
        this.appointmentHasData = true;
        const data = this.dataForm || null;
        const instId = data.InstId || null;
        this.caseWorking = this.shareBpmData.GetDataCaseWorking();
        this._bpmAppointmentService
            .GetAppointmentInsId(instId)
            .subscribe((listItem) => {
                if (listItem) {
                    this.appointmentList = listItem;
                    this.appointmentHasData = true;
                    // this.appointmentOpen = true;

                }
                this.isLoading = false;
            });


    }
    Back(e) {
        if (this.mainConponent.numCount > 0) {
            this.mainConponent.NextIndex(this.mainConponent.numCount - 1);
        } else {
            this.mainConponent.NextIndex(0);

        }
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
    ConvertDateFullMonth(date) {
        const d = new Date(date);
        const month = d.getMonth();
        const ddate = ` ${d.getDate()} `;
        const textMonthNow = ` ${this.monthFulltTh[month]}`;
        const year = d.getFullYear() + 543;
        return [ddate, " ", textMonthNow, " ", year].join("");
    }
    ConvertDateToMomentTime(date) {
        if (date === null) {
            return '00:00';
        }
        return moment(date, "YYYY-MM-DD HH:mm:ss").format('HH:mm');
    }
    PhoneNumberFormat(phoneNumber) {
        const cleaned = ("" + phoneNumber).replace(/\D/g, "");
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return match[1] + "-" + match[2] + "-" + match[3];
        }
        return phoneNumber;
    }
    onResized(event: ResizedEvent): void {
        // if (event.newWidth < 990 && event.newWidth > 0) {
        //     this.blockClass = "col-12";
        // } else {
        //     this.blockClass = "col-8";
        // }
        // console.log('event.newWidth',event.newWidth);
        this.blockClass = (event.newWidth < 990 && event.newWidth > 0) ? "col-12" : "col-8";
        this.blockTitleCardRight = (event.newWidth < 598 && event.newWidth > 0) ? "left" : "right";
    }
}
