/* eslint-disable max-len */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import DataSource from 'devextreme/data/data_source';
import { formatDate } from 'devextreme/localization';
import { BpmProcinstService, IBpmProcInst, IBpmProcInstFilter } from 'src/app/services/bpm-procinst.service';
import { Observable } from 'rxjs';
import { IFlowInfo } from 'src/app/common/bpm';
import { BpmMdmFlowService } from 'src/app/services/bpm-mdm-flow.service';
import { StatusService } from 'src/app/services/status.service';
import { finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GroupStatusService } from 'src/app/services/group-status.service';
import { LoginService } from 'src/app/services/login.service';
import { PersonalService } from 'src/app/services/personal.service';
import { User } from 'src/app/services/user';
import Swal from "sweetalert2";
import { BpmAppointmentService } from 'src/app/services/bpm-appointment.service';
import * as moment from 'moment';
import { SurveyService } from "../../../../services/survey.service";
import { BpmAppointmentHistoryService } from 'src/app/services/appointment-history.service';

import { enc, MD5 } from 'crypto-js';

@Component({
  selector: 'app-appointment-history',
  templateUrl: './appointment-history.component.html',
  styleUrls: ['./appointment-history.component.scss']
})
export class AppointmentHistoryComponent implements OnInit {
  monthShortTh = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];
  monthFulltTh = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
    'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
    'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  _dataSource: any;
  datastatus = [];
  data = [];
  dataFlowcode;
  datacount = [];
  alertdata = [];
  currentStatusMobile = "";
  currentfilter = "";
  userData = User.Current.FullNameTH;
  cityzenNumber = User.Current.CitizenNumber;
  userImagePath: string | ArrayBuffer;
  _searchParam: any;
  _flowInfo: IFlowInfo[];
  _isLoading = false;
  personalInfo: any = {};
  // listAppointment: any = [];
  countAppointmentHistoryList = 0;

  constructor(private _appointHistoryService: BpmAppointmentHistoryService) { }

  ngOnInit(): void {
    this._isLoading = true;

    this.personalInfo = User.Current;
    const filterAppointment = {
      PersonId: this.personalInfo.PersonalId,
      StatusRejectFlag: true,
      keyword: "",
    };

    this._appointHistoryService.gets(filterAppointment).subscribe((listItem) => {
      // if (listItem) {
      //   this.countAppointmentHistoryList = listItem.length;
      //   this.listAppointment = listItem;
      // }
      this._dataSource = listItem;
      this._isLoading = false;
    });
  }

  ConvertDateToMomentTime(date) {
    if (date === null) {
      return '00:00';
    }
    return moment(date, "YYYY-MM-DD HH:mm:ss").format('HH:mm');
  }
  ConvertDateTitle(date) {
    const d = new Date(date);
    const month = d.getMonth();
    const ddate = ` ${d.getDate()} `;
    const textMonthNow = ` ${this.monthShortTh[month]}`;
    const year = (d.getFullYear() + 543);
    return [ddate, ' ', textMonthNow].join("");
  }
  ConvertDateFullMonth(date) {
    const d = new Date(date);
    const month = d.getMonth();
    const ddate = ` ${d.getDate()} `;
    const textMonthNow = ` ${this.monthFulltTh[month]}`;
    const year = (d.getFullYear() + 543);
    return [ddate, ' ', textMonthNow, ' ', year].join("");
  }
  report(cellValue){
    const data = cellValue.data;
    if(data){
      const datahash = 'Pw!@'+data.DATA_ID.toString();
      const hash = MD5(datahash).toString(enc.Hex);

        window.open("https://www.thaipoliceonline.com/web-report/report?ReportName=report_print_inform_report&caseId=" + hash, "_blank");
    }
}
displayFormatDateTime(date) {
  return formatDate(new Date(date), 'dateShortTimeThai');
}
}
