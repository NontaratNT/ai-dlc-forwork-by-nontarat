import { BpmAppointmentService, IAppointment } from './../../../services/bpm-appointment.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import DataSource from 'devextreme/data/data_source';
import { formatDate } from 'devextreme/localization';
import { BpmProcinstService, IBpmProcInst } from 'src/app/services/bpm-procinst.service';
import * as moment from 'moment';
import { StatusService } from 'src/app/services/status.service';
import { GroupStatusService } from 'src/app/services/group-status.service';
@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
    @Input() formOverview: IBpmProcInst;
    statusclass = "btn btn-default btn-circle";
    iconstatus: string;
    namestatus: string;
    _instId: number;
    datastatus = [];
    datagroupstatus = [];
    data = [];
    processTimeWork: any;
    constructor(private router: Router,
                private activeRoute: ActivatedRoute,
                private bpmProcinstServ: BpmProcinstService,
                private statusServ: StatusService,
                private groupStatusServ: GroupStatusService,
                private appointmentServ: BpmAppointmentService) {
        this.formOverview = {} as any;
    }

    ngOnInit(): void {
        this._instId = this.activeRoute.snapshot.params.instId;
        this.loaddata(this._instId);
    }
    loaddata(id) {
        if (id) {
            this.bpmProcinstServ.getByInstId(id).subscribe(res => {
                // console.log('bpmProcinstServ', res);
                this.formOverview.TRACKING_CODE = res.TRACKING_CODE;
                this.formOverview.CATEGORY_NAME = res.CATEGORY_NAME + " จาก " + res.PERSONAL_FULL_NAME;
                this.formOverview.STATUS_NAME = this.statusText(res.STATUS_NAME);
                this.formOverview.GROUP_STATUS_NAME = res.GROUP_STATUS_NAME;
                this.formOverview.CREATE_DATE = this.FormatDate(res.CREATE_DATE);
                this.formOverview.FLOW_SLA = res.FLOW_SLA;
                this.formOverview.FLOW_UNIT = res.FLOW_UNIT;
                this.formOverview.OFFICER_FULL_NAME = res.OFFICER_FULL_NAME;
                this.formOverview.PERSONAL_TEL_NO = res.PERSONAL_TEL_NO;
                if (res.UPDATE_DATE) {
                    this.formOverview.UPDATE_DATE = this.FormatDate(res.UPDATE_DATE);
                }
                else {
                    this.formOverview.UPDATE_DATE = this.FormatDate(res.CREATE_DATE);
                }

                // this.statusStep(res.STATUS_CODE,res.GROUP_STATUS_CODE.trim());
                this.groupStatusStep(res.GROUP_STATUS_CODE);

                this.processTimeWork = this.processTime(res.CREATE_DATE);
            });

            this.appointmentServ.Appointment(id,2).subscribe(_ => {
                if(_.length > 0){
                    this.formOverview.APP_PERSONAL_FULLNAME = _[0].APP_PERSONAL_FULLNAME;
                    this.formOverview.APPOINTMENT_PERSONAL_TEL_NO = _[0].APPOINTMENT_PERSONAL_TEL_NO;
                }
            });
        }
    }
    processTime(startDate) {
        const SetStartDate = new Date(startDate);
        const endDate = new Date();
        const startTime = moment(SetStartDate, 'YYYY/MM/DD HH:mm');
        const endTime = moment(endDate, 'YYYY/MM/DD HH:mm');
        const duration = endTime.diff(startTime, 'millisecond', true);
        return duration;
    }
    FormatDate(date) {
        if (date) {
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            return formatDate(<Date>moment(date).toDate(), "dateShortTimeThai");
        }
        else {
            return '';
        }
    }
    statusText(stauscode) {
        if (stauscode) {
            return stauscode;
        }
        else {
            return 'ยื่นคำขอ';
        }
    }

    groupStatusStep(statuscode) {
        // if (statuscode) {
        //     this.statusServ.getStatus().subscribe(res => {
        //         this.datastatus = res.sort(this.predicateBy("STATUS_SEQ"));
        //         this.data = [];
        //         let srtclass = "btn btn-step-pass btn-circle";
        //         let detailclass = "btn btn-step-detail-pass btn-circles";
        //         let txtclass = "btn-step-txt-pass";
        //         for (const i of this.datastatus) {
        //             if (statuscode === i.STATUS_CODE) {
        //                 this.data.push({
        //                     STATUS_ID: i.STATUS_ID,
        //                     STATUS_SEQ: i.STATUS_SEQ,
        //                     STATUS_CODE: i.STATUS_CODE,
        //                     STATUS_NAME: i.STATUS_NAME,
        //                     STATUS_ICON: i.STATUS_ICON,
        //                     STATUS_CLASS: "btn btn-step-now btn-circle",
        //                     STATUS_CLASS_DETAIL: "btn btn-step-detail-now btn-circles",
        //                     STATUS_CLASS_TXT: "btn-step-txt-now"
        //                 });
        //                 srtclass = "btn btn-default btn-circle";
        //                 detailclass = "btn btn-detail-default btn-circles";
        //                 txtclass = "btn-step-txt-default";
        //             }
        //             else {
        //                 this.data.push({
        //                     STATUS_ID: i.STATUS_ID,
        //                     STATUS_SEQ: i.STATUS_SEQ,
        //                     STATUS_CODE: i.STATUS_CODE,
        //                     STATUS_NAME: i.STATUS_NAME,
        //                     STATUS_ICON: i.STATUS_ICON,
        //                     STATUS_CLASS: srtclass,
        //                     STATUS_CLASS_DETAIL: detailclass,
        //                     STATUS_CLASS_TXT: txtclass
        //                 });
        //             }
        //         }
        //     });
        // }
        // else {
        //     this.statusServ.getStatus().subscribe(resdata => {
        //         this.datastatus = resdata.sort(this.predicateBy("STATUS_SEQ"));
        //         this.data = [];
        //         for (const i of this.datastatus) {
        //             this.data.push({
        //                 STATUS_ID: i.STATUS_ID,
        //                 STATUS_SEQ: i.STATUS_SEQ,
        //                 STATUS_CODE: i.STATUS_CODE,
        //                 STATUS_NAME: i.STATUS_NAME,
        //                 STATUS_ICON: i.STATUS_ICON,
        //                 STATUS_CLASS: "btn btn-default btn-circle",
        //                 STATUS_CLASS_DETAIL: "btn btn-detail-default btn-circles",
        //                 STATUS_CLASS_TXT: "btn-step-txt-default"
        //             });
        //         }
        //     });
        // }
        this.groupStatusServ.get().subscribe(res => {
            this.datastatus = res.sort(this.predicateBy("GROUP_SEQ"));
            this.data = [];
            // let loop = 0;
            for (const i of this.datastatus) {
                if (statuscode === i.GROUP_STATUS_CODE) {
                    this.data.push({
                        GROUP_STATUS_ID: i.GROUP_STATUS_ID,
                        GROUP_SEQ: i.GROUP_SEQ,
                        GROUP_STATUS_CODE: i.GROUP_STATUS_CODE,
                        GROUP_STATUS_NAME: i.GROUP_STATUS_NAME,
                        GROUP_ICON: i.GROUP_ICON,
                        GROUP_STATUS_CLASS: "btn btn-step-now btn-circle",
                        GROUP_STATUS_CLASS_DETAIL: "btn btn-step-detail-now btn-circles",
                        GROUP_STATUS_CLASS_TXT: "btn-step-txt-now"
                    });

                }
                else {
                    this.data.push({
                        GROUP_STATUS_ID: i.GROUP_STATUS_ID,
                        GROUP_SEQ: i.GROUP_SEQ,
                        GROUP_STATUS_CODE: i.GROUP_STATUS_CODE,
                        GROUP_STATUS_NAME: i.GROUP_STATUS_NAME,
                        GROUP_ICON: i.GROUP_ICON,
                        GROUP_STATUS_CLASS: "btn  btn-default btn-circle",
                        GROUP_STATUS_CLASS_DETAIL: "btn btn-deatil-default btn-circles",
                        GROUP_STATUS_CLASS_TXT: "btn-step-txt-default"
                    });
                }
            }
        });
    }
    predicateBy(prop) {
        // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
        return function(a, b) {
            if (a[prop] > b[prop]) {
                return 1;
            } else if (a[prop] < b[prop]) {
                return -1;
            }
            return 0;
        };
    }
}
