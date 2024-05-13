/* eslint-disable max-len */

import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import DataSource from "devextreme/data/data_source";
import { formatDate } from "devextreme/localization";
import {
    BpmProcinstService,
    IBpmProcInst,
    IBpmProcInstFilter,
} from "src/app/services/bpm-procinst.service";
import { Observable } from "rxjs";
import { IFlowInfo } from "src/app/common/bpm";
import { BpmMdmFlowService } from "src/app/services/bpm-mdm-flow.service";
import { StatusService } from "src/app/services/status.service";
import { finalize } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { GroupStatusService } from "src/app/services/group-status.service";
import { LoginService } from "src/app/services/login.service";
import { PersonalService } from "src/app/services/personal.service";
import { User } from "src/app/services/user";
import Swal from "sweetalert2";
import { BpmAppointmentService } from "src/app/services/bpm-appointment.service";
import * as moment from "moment";
import { SurveyService } from "../../../../services/survey.service";
import { FreezeAccountService } from 'src/app/services/bpm-freeze-account.service';
import { IssueOnlineService } from "src/app/services/issue-online.service";
import { DxDataGridComponent, DxSelectBoxComponent } from "devextreme-angular";
import { BankInfoService } from "src/app/services/bank-info.service";
import { DatePipe } from '@angular/common';
import { enc, MD5 } from 'crypto-js';
import { LogExportService } from "src/app/services/log-export.service";
import { IOrganizeInfo } from "share-ui/lib/models/organize-info.service";
import { ProvinceService } from "src/app/services/province.service";
import { OrgService } from "src/app/services/org.service";
// import { IssueOnlineService } from "src/app/services/issue-online.service";


@Component({
    selector: "app-tasklist",
    templateUrl: "./tasklist.component.html",
    styleUrls: ["./tasklist.component.scss"],
})
export class TasklistComponent implements OnInit {
    // listAppointment = [
    //     {id:1,title:"การหลอกลวงออนไลน์ทางด้านการเงิน",date:"3 มกราคม 2564",station:"สน.บางนา"},
    //     {id:2,title:"Romance Scam",date:"4 มกราคม 2564",station:"สน.ทองหล่อ"},

    // ];

    @ViewChild('gridlist', { static: false }) gridlist: DxDataGridComponent;
    @ViewChild("selectPresentProvicelocation", { static: false }) selectPresentProvicelocation: DxSelectBoxComponent;
    @ViewChild("selectorg", { static: false })  selectorg: DxSelectBoxComponent;

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
    check = false;
    _dataSource: any;
    _flowCode = [];
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
    taskPath;
    personalInfo: any = {};
    listAppointment: any = [];
    showAppointmentList = false;
    countAppointmentList = 0;
    statusWidth = 1000;
    popupHeight = 400;
    ans1;
    ans2;
    ans3;
    ans4;
    caseId;
    now: Date;
    maxDateValue:Date = new Date();
    blockSave = true;
    orgShow =false;

    popupConsentVisible: boolean = false;
    submission = {} as any;
    _isShow: boolean = false;
    _isShow2: boolean = false;
    ways = [{ id: 1, text: 'ดำเนินการแล้ว' }, { id: 2, text: 'ยังไม่ได้ดำเนินการ' }];
    selectcaseID: any;

    dsorgbyarialocation: IOrganizeInfo[];
    province = [];
    formData: any = {};
    checkboxLocation: any = {};
    radiocheckorganize1 = [{ id: 1, text: "สถานีตำรวจ" }];
    radiocheckorganize2 = [{ id: 2, text: "กองบัญชาการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี" }];
    radiocheckorganize3 = [{ id: 3, text: "กองบัญชาการตำรวจสอบสวนกลาง (ลาดพร้าว)" }];
    orgtype2_1 = [ { org_id: 3536, org_name: "บก.สอท.1",org_location1:"ศูนย์ราชการแจ้งวัฒนะ จ.กรุงเทพฯ"}];
    orgtype2_2 = [{ org_id: 3548, org_name: "บก.สอท.2",org_location1:"เมืองทองธานี จ.นนทบุรี"}];
    orgtype2_3 = [{ org_id: 3559, org_name: "บก.สอท.3",org_location1:"1.ศูนย์ราชการแจ้งวัฒนะ จ.กรุงเทพฯ",org_location2:"2.ถ.มิตรภาพ ต.ในเมือง อ.เมือง จ.ขอนแก่น"}];
    orgtype2_4 = [{ org_id: 3567, org_name: "บก.สอท.4",org_location1:"1.ศูนย์ราชการแจ้งวัฒนะ จ.กรุงเทพฯ",org_location2:"2.ต.ป่าแดด อ.เมืองเชียงใหม่ จ.เชียงใหม่"}];
    orgtype2_5 = [{ org_id: 3578, org_name: "บก.สอท.5",org_location1:"1.ศูนย์ราชการแจ้งวัฒนะ จ.กรุงเทพฯ",org_location2:"2.ต.บางกุ้ง อ.เมืองสุราษฎร์ธานี จ.สุราษฏร์ธานี"}];
    formdataOrgsendcase: any = {
        ORG_LOCATION_TYPE: null,
        ORGANIZE_ID: null,
        ORG_LOCATION_NAME: "",
        ORG_PROVINCE_ID: null,
        ORG_PROVICE_NAME: "",
        ORG_LOCATION_MAIN_ID1: null,
        ORG_LOCATION_MAIN_NAME1: "",
        ORG_LOCATION_MAIN_ID2: null,
        ORG_LOCATION_MAIN_NAME2: "",
        ORG_LOCATION_MAIN_ID3: null,
        ORG_LOCATION_MAIN_NAME3: "",
        ORG_LOCATION_MAIN_ID4: null,
        ORG_LOCATION_MAIN_NAME4: "",
        ORG_LOCATION_MAIN_ID5: null,
        ORG_LOCATION_MAIN_NAME5: "",
        ORG_LOCATION_CENTER_ID: null,
        ORG_LOCATION_CENTER_NAME: "",
    };


    constructor(
        private router: Router,
        private servicePersonal: PersonalService,
        private bpmProcinstServ: BpmProcinstService,
        private statusServ: StatusService,
        private _flowServ: BpmMdmFlowService,
        private groupStatusServ: GroupStatusService,
        private _bpmAppointmentService: BpmAppointmentService,
        private surveyService: SurveyService,
        private _loginServ: LoginService,
        private freezeAccountService: FreezeAccountService,
        private _issueOnlineService: IssueOnlineService,
        private _bankInfoService: BankInfoService,
        private datePipe: DatePipe,
        private _logService : LogExportService,
        private serviceProvince: ProvinceService,
        private _OrgService: OrgService,

    ) {
        this._searchParam = {} as any;
        this._searchParam.GROUP_STATUS_CODE = "OR";
        this._searchParam.FLOW_ID = 3;
        this.submission = {} as any;
    }
;
    ngOnInit(): void {
        this.maxDateValue.setHours(this.maxDateValue.getHours() + 1);
        this._isLoading = true;
        // this.popupConsentVisible = true;
    //     this._dataSource = [
    //         {
    //         TRACKING_CODE: '1254658975',
    //         OPTIONAL_DATA: 'testsss',
    //         OPTIONAL_DATA_REPLACE: 'testsss',
    //         ORGANIZE_NAME_THA: 'testss',
    //         OFFICER_FULL_NAME:'05151515',
    //         PERSONAL_TEL_NO: '02515151515',
    //         CREATE_DATE_TEXT: Date.now(),
    //         GROUP_STATUS_NAME: 'test',
    //         DATA_ID: 123

    //     },
    //     {
    //         TRACKING_CODE: '5555555555',
    //         OPTIONAL_DATA: 'testsss',
    //         OPTIONAL_DATA_REPLACE: 'testsss',
    //         ORGANIZE_NAME_THA: 'testss',
    //         OFFICER_FULL_NAME:'05151515',
    //         PERSONAL_TEL_NO: '02515151515',
    //         CREATE_DATE_TEXT: Date.now(),
    //         GROUP_STATUS_NAME: 'test',
    //         DATA_ID: 12345

    //     }
    // ]
        // this.surveyService.getSurveyByCaseId(123456).subscribe(res => {
        //     console.log(res);
        //     // if (res.) {
        //     //
        //     // }
        // });

        // this.popupConsentVisible = true;
        this.servicePersonal
            .GetPersonalById(User.Current.PersonalId)
            .subscribe((_) => {
                if (!this.validateEmail(_.PERSONAL_EMAIL)) {
                    Swal.fire({
                        title: "การติดตามสถานะ",
                        text: "ท่านต้องการติดตามสถานะผ่านอีเมลหรือไม่?",
                        html: "<p>กรุณาเพิ่มข้อมูลอีเมลของท่านเพื่อติดตามสถานะ</p>",
                        icon: "info",
                        confirmButtonText: "ใช่ ฉันต้องการ",
                        showCancelButton: true,
                        cancelButtonText: "ไม่",
                    }).then((r) => {
                        if (r.isConfirmed) {
                            this.router.navigate(["main/personal"]);
                        }
                    });
                }
                if (_.USER_PICTURE) {
                    this.userImagePath =
                        environment.config.baseConfig.resourceUrl.replace(
                            "/ccib",
                            "/bpm"
                        ) + _.USER_PICTURE;
                }

            });
        // mainDataList
        const statusGroup = (this._searchParam.GROUP_STATUS_CODE = "");
        // this.bpmProcinstServ.getByPersonalId(statusGroup).subscribe(_ => {
        //     this._dataSource = _;
        //     this._isLoading = false;
        // });

        // this.alertTaskList();
        // this._flowServ.gets()
        //     .subscribe(_ => {
        //         this._flowCode = _;
        //         this._flowCode.push({ FLOW_CODE: 10, FLOW_NAME: "แสดงรายการทั้งหมด" });
        //     });
        if (User.Current) {
            this.personalInfo = User.Current;
            this.userImagePath =
                environment.config.baseConfig.resourceUrl.replace(
                    "/ccib",
                    "/bpm"
                ) + User.Current.ImageUrl;
            this.check = true;
        } else {
            this.check = false;
        }
        this.personalInfo = User.Current;
        const filterAppointment = {
            PersonId: this.personalInfo.PersonalId,
            StatusRejectFlag: true,
        };
        this._bpmAppointmentService
            .GetAppointmentList(filterAppointment)
            .subscribe((listItem) => {
                if (listItem) {
                    this.countAppointmentList = listItem.length;
                    this.listAppointment = listItem;
                }
                this.showAppointmentList = true;
            });
        // this.alertTaskList();

        this.groupStatusStep(1);

        this.onLoadSurvey();

        this._isLoading = false;
    }

    async onLoadSurvey() {
        const param: any = {
            personalId: User.Current.PersonalId,
        };
        const listTask = await this.bpmProcinstServ
            .getTaskListAndReject(param)
            .toPromise();
        if (listTask) {
            for (const item of listTask) {
                if (
                    item.GROUP_STATUS_CODE &&
                    item.GROUP_STATUS_CODE !== "C01" &&
                    item.GROUP_STATUS_CODE !== "C02"
                ) {
                    this.caseId = item.DATA_ID;
                    // this.onDoSurvey1(item.DATA_ID);
                    // return;
                }
                if (
                    item.GROUP_STATUS_CODE &&
                    (item.GROUP_STATUS_CODE === "C05" ||
                        item.GROUP_STATUS_CODE === "C06")
                ) {
                    this.caseId = item.DATA_ID;
                    // this.onDoSurvey2(item.DATA_ID);
                    // return;
                }
            }
        }
    }
    onDoSurvey1(caseId) {
        this.surveyService
            .getSurveyByCaseIdAndCategoryId(caseId, 1)
            .subscribe((res) => {
                if (!res || (res && res.length === 0)) {
                    Swal.fire({
                        title: "แบบประเมินความพึงพอใจ",
                        html: `<div class="text-center">เมื่อท่านได้พบพนักงานสอบสวนแล้ว กรุณาให้คะแนนประเมินความพึงพอใจ เพื่อนำไปปรับปรุงการให้บริการประชาชนต่อไป</div>
                    <div class="text-danger"><small>( 1=น้อยที่สุด | 2=น้อย | 3=ปานกลาง | 4=มาก | 5=มากที่สุด )</small></div>
                    <form id="survey-form" class="text-left">
                        <div>1.พนักงานสอบสวนตรงต่อเวลานัดหมาย</div>
                        <div class="checkbox-group">
                            <input type="radio" name="ans1" value="1" class="very-sad">
                            <label for="ans1">1</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="radio" name="ans1" value="2" class="sad">
                            <label for="ans1">2</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="radio" name="ans1" value="3" class="neutral">
                            <label for="ans1">3</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="radio" name="ans1" value="4" class="happy">
                            <label for="ans1">4</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="radio" name="ans1" value="5" class="very-happy">
                            <label for="ans1">5</label>
                        </div>
                        <div>2.พนักงานสอบสวนให้บริการ คำแนะนำ ข้อกฎหมาย ด้วยความสุภาพ เรียบร้อย</div>
                        <div class="checkbox-group">
                            <input type="radio" name="ans2" value="1" class="very-sad">
                            <label for="ans2">1</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="radio" name="ans2" value="2" class="sad">
                            <label for="ans2">2</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="radio" name="ans2" value="3" class="neutral">
                            <label for="ans2">3</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="radio" name="ans2" value="4" class="happy">
                            <label for="ans2">4</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="radio" name="ans2" value="5" class="very-happy">
                            <label for="ans2">5</label>
                        </div>
                        <div>3.ความพึงพอใจต่อการใช้งานระบบรับแจ้งความออนไลน์</div>
                        <div class="checkbox-group">
                            <input type="radio" name="ans3" value="1" class="very-sad">
                            <label for="ans3">1</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="radio" name="ans3" value="2" class="sad">
                            <label for="ans3">2</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="radio" name="ans3" value="3" class="neutral">
                            <label for="ans3">3</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="radio" name="ans3" value="4" class="happy">
                            <label for="ans3">4</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="radio" name="ans3" value="5" class="very-happy">
                            <label for="ans3">5</label>
                        </div>
                        <div>4.ข้อเสนอแนะ/ความเห็น</div>
                        <div class="form-group">
                            <textarea class="form-control" id="ans4" rows="3"></textarea>
                        </div>
                    </form>`,
                        // width: '70%',
                        confirmButtonText: "บันทึก",
                        cancelButtonText: "ยกเลิก",
                        allowOutsideClick: false,
                        // showCancelButton: true,
                        // showCloseButton: true,
                        focusConfirm: true,
                        preConfirm: () => {
                            this.ans1 = (Swal.getPopup().querySelector(
                                "input[name='ans1']:checked"
                            ) as HTMLInputElement)
                                ? (
                                      Swal.getPopup().querySelector(
                                          "input[name='ans1']:checked"
                                      ) as HTMLInputElement
                                  ).value
                                : null;
                            this.ans2 = (Swal.getPopup().querySelector(
                                "input[name='ans2']:checked"
                            ) as HTMLInputElement)
                                ? (
                                      Swal.getPopup().querySelector(
                                          "input[name='ans2']:checked"
                                      ) as HTMLInputElement
                                  ).value
                                : null;
                            this.ans3 = (Swal.getPopup().querySelector(
                                "input[name='ans3']:checked"
                            ) as HTMLInputElement)
                                ? (
                                      Swal.getPopup().querySelector(
                                          "input[name='ans3']:checked"
                                      ) as HTMLInputElement
                                  ).value
                                : null;
                            this.ans4 = (
                                Swal.getPopup().querySelector(
                                    "#ans4"
                                ) as HTMLInputElement
                            ).value;
                        },
                    }).then((result) => {
                        if (
                            result.isConfirmed &&
                            this.ans1 &&
                            this.ans2 &&
                            this.ans3
                        ) {
                            this.surveyService
                                .postSurvey({
                                    caseId,
                                    answers: [
                                        {
                                            answerValue: this.ans1,
                                            questionId: 1,
                                        },
                                        {
                                            answerValue: this.ans2,
                                            questionId: 2,
                                        },
                                        {
                                            answerValue: this.ans3,
                                            questionId: 3,
                                        },
                                        {
                                            answerValue: this.ans4,
                                            questionId: 4,
                                        },
                                    ],
                                })
                                .subscribe((response) => {
                                    if (response.IsSuccess) {
                                        Swal.fire({
                                            title: "บันทึกสำเร็จ!",
                                            // text: 'บันทึก',
                                            icon: "success",
                                            confirmButtonText: "ตกลง",
                                        });
                                    }
                                });

                                //start ส่งไปที่ gdcc
                                this.surveyService
                                .postSurveygdcc({
                                    caseId,
                                    answers: [
                                        {
                                            answerValue: this.ans1,
                                            questionId: 1,
                                        },
                                        {
                                            answerValue: this.ans2,
                                            questionId: 2,
                                        },
                                        {
                                            answerValue: this.ans3,
                                            questionId: 3,
                                        },
                                        {
                                            answerValue: this.ans4,
                                            questionId: 4,
                                        },
                                    ],
                                })
                                .subscribe();
                                //end  ส่งไปที่ gdcc
                        } else if (result.isConfirmed) {
                            Swal.fire({
                                title: "กรุณาระบุคะแนนความพึงพอใจ",
                                icon: "error",
                                confirmButtonText: "ตกลง",
                            }).then((result2) => {
                                if (result2.isConfirmed) {
                                    this.onDoSurvey1(this.caseId);
                                }
                            });
                        }
                    });
                }
            });
    }
    onDoSurvey2(caseId) {
        this.surveyService
            .getSurveyByCaseIdAndCategoryId(caseId, 2)
            .subscribe((res) => {
                if (!res || (res && res.length === 0)) {
                    Swal.fire({
                        title: "แบบประเมินความพึงพอใจ",
                        html: `<div class="text-center">กรุณาให้คะแนนประเมินความพึงพอใจ เพื่อนำไปปรับปรุงการให้บริการประชาชนต่อไป</div>
                    <div class="text-danger"><small>( 1=น้อยที่สุด | 2=น้อย | 3=ปานกลาง | 4=มาก | 5=มากที่สุด )</small></div>
                    <form id="survey-form" class="text-left">
                        <div>1.ความพึงพอใจต่อการแจ้งความคืบหน้าทางคดีของพนักงานสอบสวนเป็นระยะ</div>
                        <div class="checkbox-group">
                            <input type="radio" name="ans1" value="1" class="very-sad">
                            <label for="ans1">1</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="radio" name="ans1" value="2" class="sad">
                            <label for="ans1">2</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="radio" name="ans1" value="3" class="neutral">
                            <label for="ans1">3</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="radio" name="ans1" value="4" class="happy">
                            <label for="ans1">4</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="radio" name="ans1" value="5" class="very-happy">
                            <label for="ans1">5</label>
                        </div>
                        <div>2.ความพึงพอใจต่อการใช้งานระบบรับแจ้งความออนไลน์</div>
                        <div class="checkbox-group">
                            <input type="radio" name="ans2" value="1" class="very-sad">
                            <label for="ans2">1</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="radio" name="ans2" value="2" class="sad">
                            <label for="ans2">2</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="radio" name="ans2" value="3" class="neutral">
                            <label for="ans2">3</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="radio" name="ans2" value="4" class="happy">
                            <label for="ans2">4</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="radio" name="ans2" value="5" class="very-happy">
                            <label for="ans2">5</label>
                        </div>
                        <div>4.ข้อเสนอแนะ/ความเห็น</div>
                        <div class="form-group">
                            <textarea class="form-control" id="ans3" rows="3"></textarea>
                        </div>
                    </form>`,
                        // width: '70%',
                        confirmButtonText: "บันทึก",
                        cancelButtonText: "ยกเลิก",
                        showCancelButton: true,
                        showCloseButton: true,
                        allowOutsideClick: false,
                        focusConfirm: true,
                        preConfirm: () => {
                            this.ans1 = (Swal.getPopup().querySelector(
                                "input[name='ans1']:checked"
                            ) as HTMLInputElement)
                                ? (
                                      Swal.getPopup().querySelector(
                                          "input[name='ans1']:checked"
                                      ) as HTMLInputElement
                                  ).value
                                : null;
                            this.ans2 = (Swal.getPopup().querySelector(
                                "input[name='ans2']:checked"
                            ) as HTMLInputElement)
                                ? (
                                      Swal.getPopup().querySelector(
                                          "input[name='ans2']:checked"
                                      ) as HTMLInputElement
                                  ).value
                                : null;
                            this.ans3 = (
                                Swal.getPopup().querySelector(
                                    "#ans3"
                                ) as HTMLInputElement
                            ).value;
                        },
                    }).then((result) => {
                        if (result.isConfirmed && this.ans1 && this.ans2) {
                            this.surveyService
                                .postSurvey({
                                    caseId,
                                    answers: [
                                        {
                                            answerValue: this.ans1,
                                            questionId: 5,
                                        },
                                        {
                                            answerValue: this.ans2,
                                            questionId: 6,
                                        },
                                        {
                                            answerValue: this.ans3,
                                            questionId: 7,
                                        },
                                    ],
                                })
                                .subscribe((response) => {
                                    if (response.IsSuccess) {
                                        Swal.fire({
                                            title: "บันทึกสำเร็จ!",
                                            // text: 'บันทึก',
                                            icon: "success",
                                            confirmButtonText: "ตกลง",
                                        });
                                    }
                                });

                                //start ส่งไปที่ gdcc
                                this.surveyService
                                .postSurveygdcc({
                                    caseId,
                                    answers: [
                                        {
                                            answerValue: this.ans1,
                                            questionId: 5,
                                        },
                                        {
                                            answerValue: this.ans2,
                                            questionId: 6,
                                        },
                                        {
                                            answerValue: this.ans3,
                                            questionId: 7,
                                        },
                                    ],
                                })
                                .subscribe();
                                //end  ส่งไปที่ gdcc
                        } else if (result.isConfirmed) {
                            Swal.fire({
                                title: "กรุณาระบุคะแนนความพึงพอใจ",
                                icon: "error",
                                confirmButtonText: "ตกลง",
                            }).then((result2) => {
                                if (result2.isConfirmed) {
                                    this.onDoSurvey2(this.caseId);
                                }
                            });
                        }
                    });
                }
            });
    }
    PhoneNumberFormat(phoneNumber) {
        const cleaned = ("" + phoneNumber).replace(/\D/g, "");
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return match[1] + "-" + match[2] + "-" + match[3];
        }
        return phoneNumber;
    }
    GotoUrlTaskList(data) {
        // console.log('data',data);
        // this.router.navigate(["/main/issue-online/" + data.INST_ID + "/" + data.DOCUMENT_ID]);
        localStorage.removeItem('inst_id');
        localStorage.setItem('inst_id',data.INST_ID);
        this.router.navigate(["/main/issue-online-view"]);
        // this.router.navigate([`/main/issue-online/5833/61e7e47aa74b8625a24f97a2${d.id}`]);
    }
    AppointmentColorClass(index) {
        return index % 2 === 0 ? "color1" : "color2";
    }
    ConvertDateToMomentTime(date) {
        if (date === null) {
            return "00:00";
        }
        return moment(date, "YYYY-MM-DD HH:mm:ss").format("HH:mm");
    }
    ConvertDateTitle(date) {
        const d = new Date(date);
        const month = d.getMonth();
        const ddate = ` ${d.getDate()} `;
        const textMonthNow = ` ${this.monthShortTh[month]}`;
        const year = d.getFullYear() + 543;
        return [ddate, " ", textMonthNow].join("");
    }
    ConvertDateFullMonth(date) {
        const d = new Date(date);
        const month = d.getMonth();
        const ddate = ` ${d.getDate()} `;
        const textMonthNow = ` ${this.monthFulltTh[month]}`;
        const year = d.getFullYear() + 543;
        return [ddate, " ", textMonthNow, " ", year].join("");
    }
    ConvertDateFullYear(date) {
        const d = new Date(date);
        const ddate = ` ${d.getDate()} `;

        return [d.getFullYear() + 543].join("");
    }
    ViewTaskAppointmentId(cellValue) {
        Swal.fire({
            title: "",
            text: "ระบบกำลังปรับปรุง",
            icon: "warning",
            confirmButtonText: "ตกลง",
        }).then(() => {});
        // const d = cellValue.data || undefined;
        // if (d) {
        //     this.router.navigate([`/main/task-appointment/${d.id}`]);
        // }
    }
    // onToolbar(e) {
    //     e.toolbarOptions.items.unshift(
    //         {
    //             template: "addButton",
    //             location: "before"
    //         }
    //     );
    // }

    edit(cellValue) {
        // Swal.fire({
        //     title: '',
        //     text: 'ระบบกำลังปรับปรุง',
        //     icon: 'warning',
        //     confirmButtonText: 'ตกลง'
        // }).then(() => {  });
        const data = cellValue.data;
        if (data) {
            localStorage.removeItem('inst_id');
            localStorage.setItem('inst_id',data.INST_ID);
            this.router.navigate(["/main/issue-online-view"]);
        }
    }
    report(cellValue){
        const data = cellValue.data;
        if(data){
            const datahash = 'Pw!@'+data.DATA_ID.toString();
            const hash = MD5(datahash).toString(enc.Hex);
            const log = {
                INST_ID : data.INST_ID,
                LOG_NAME : "print รายงาน",
            };
            this._logService.logExport(log).subscribe(() => {
                window.open("https://officer.thaipoliceonline.com/web-report/report?ReportName=report_print_inform_report&caseId=" + hash, "_blank");
            });
        }
    }

    onPersonal() {
        this.router.navigate(["/main/personal"]);
    }

    Add() {

        this.popupConsentVisible = true;
        // this.router.navigate(["/main/issue-online/1"]);

        // this._isLoading = true;
        // location.href = "/main/issue-online/1";

        // this.popupConsentVisible = true;


    }
    gourltracking(cellValue) {
        const data = cellValue.data;
        this.router.navigate(["/mainside/tracking/" + data.CASE_ID]);
    }
    calculateStatus(e) {
        // if (e.data.STATUS_NAME) {
        //     return e.data.STATUS_NAME;
        // }
        // else {
        //     return "ยื่นคำขอ";
        // }
    }

    formatDate(e) {
        return formatDate(new Date(e.CREATE_DATE), "dateShortTimeThai");
    }
    async bindTaskList(groupStatusCode) {
        // this._searchParam.GROUP_STATUS_CODE = groupStatusCode;
        // if (this._searchParam.flowCode) {
        //     this._dataSource = new DataSource({
        //         byKey: () => undefined,
        //         load: () => this.bpmProcinstServ.getByFlowCode(groupStatusCode, this._searchParam.flowCode).toPromise()
        //     });
        // } else {
        //     this._dataSource = new DataSource({
        //         byKey: () => undefined,
        //         load: () => this.bpmProcinstServ.getByPersonalId(groupStatusCode).toPromise()
        //     });
        // }
        // this._dataSource = new DataSource({
        //     byKey: () => undefined,
        //     load: () => this.bpmProcinstServ.getByPersonalId(groupStatusCode).toPromise()
        // });
        this._isLoading = true;
        this._dataSource = [];
        const param: IBpmProcInstFilter = {
            personalId: User.Current.PersonalId,
            GroupStatusCode: groupStatusCode,
        };
        if (groupStatusCode === "C07") {
            param.GeStatusOrRejectFlag = true;
        } else {
            param.StatusRejectFlag = false;
        }
        const listTask = await this.bpmProcinstServ
            .getTaskListAndReject(param)
            .toPromise();
        if (listTask) {
            for (const item of listTask) {
                // item.CREATE_DATE_TEXT = this.displayFormatDate(
                //     item.CREATE_DATE
                // );
                item.CREATE_DATE_TEXT =  item.CREATE_DATE;

                item.OPTIONAL_DATA_REPLACE = this.CountStr(item.OPTIONAL_DATA);
                if (item.REJECT_FLAG === "Y") {
                    item.GROUP_STATUS_NAME = "สิ้นสุด (จำหน่าย)";
                }
                // console.log(item.GROUP_STATUS_CODE);
                // if (item.GROUP_STATUS_CODE !== 'C01' && item.GROUP_STATUS_CODE !== 'C02') {
                //     this.onLoadSurvey(item.DATA_ID);
                // }
            }

            if(listTask.length>0){
                // this.popupConsentVisible = true;
            }
            this._dataSource = listTask;
        }
        this.groupStatusStep(0, groupStatusCode);
        this._isLoading = false;
    }
    CountStr(str) {
        if (str) {
            const countStr = str.length;
            if (countStr >= 200) {
                const result = str.substring(0, 199);
                return result + "...";
            } else {
                return str;
            }
        }
        return "";
    }
    onFilterChanged(e) {
        // console.log(this._searchParam.flowCode);
        // if (e.value) {
        //     this._searchParam.flowCode = e.value;
        //     this.dataFlowcode = e.value;
        //     if (this.dataFlowcode !== 10) {
        //         this._searchParam.GROUP_STATUS_CODE = '';
        //         this._dataSource = new DataSource({
        //             byKey: () => undefined,
        //             load: () => this.bpmProcinstServ.getByFlowCode(this._searchParam.GROUP_STATUS_CODE, this.dataFlowcode).toPromise()
        //         });
        //     }
        //     else if (this.dataFlowcode === 10) {
        //         this._searchParam.GROUP_STATUS_CODE = '';
        //         this._dataSource = new DataSource({
        //             byKey: () => undefined,
        //             load: () => this.bpmProcinstServ.getByPersonalId(this._searchParam.GROUP_STATUS_CODE).toPromise()
        //         });
        //     }
        // }
    }
    getDefinitionName(definition: string): string {
        return this._flowInfo.find((_) => _.WF_DEFINITION_ID === definition)
            ?.FLOW_NAME;
    }
    displayFormatDate(date) {
        return formatDate(new Date(date), "dateShortTimeThai") + " น.";
    }
    groupStatusStep(defaultItem: number, statusCode = "") {
        this.groupStatusServ
            .getStatusAllAndReject(this.personalInfo.PersonalId)
            .subscribe((_) => {
                // console.log(_);
                const countItem = _.length ?? 0;
                this.statusWidth = countItem * 200;
                this.data = [];
                const setData = [];
                for (const [key, i] of _.entries()) {
                    setData.push({
                        INDEX: key + 1,
                        GROUP_STATUS_CODE: i.GroupStatusCode,
                        GROUP_STATUS_NAME: i.GroupStatusName,
                        GROUP_ICON: i.GroupStatusIcon,
                        GROUP_COUNT: i.Count,
                        GROUP_STATUS_CLASS: "btn btn-circle btn-default",
                        GROUP_STATUS_CLASS_DETAIL:
                            "btn btn-circles btn-deatil-default",
                        GROUP_STATUS_CLASS_TXT: "btn-step-txt-default",
                    });

                    if (statusCode && statusCode === i.GroupStatusCode) {
                        setData[key].GROUP_STATUS_CLASS =
                            "btn btn-step-now btn-circle";
                        setData[key].GROUP_STATUS_CLASS_DETAIL =
                            "btn btn-step-detail-now btn-circles";
                        setData[key].GROUP_STATUS_CLASS_TXT =
                            "btn-step-txt-now";
                    }
                    if (
                        i.GroupStatusCode !== "C01" &&
                        i.GroupStatusCode !== "C02" &&
                        i.Count > 0
                    ) {
                        // this.onLoadSurvey(i.DATA_ID);
                    }
                }
                if (defaultItem > 0) {
                    const isIndex = defaultItem - 1;
                    setData[isIndex].GROUP_STATUS_CLASS =
                        "btn btn-step-now btn-circle";
                    setData[isIndex].GROUP_STATUS_CLASS_DETAIL =
                        "btn btn-step-detail-now btn-circles";
                    setData[isIndex].GROUP_STATUS_CLASS_TXT =
                        "btn-step-txt-now";
                    this.bindTaskList(setData[isIndex].GROUP_STATUS_CODE);
                }
                this.data = setData;

                // bindTaskList
            });
    }

    // GROUP_STATUS_CLASS: (isActiveClass)?"btn btn-circle btn-step-now" : "btn btn-circle btn-default",
    // GROUP_STATUS_CLASS_DETAIL: (isActiveClass)?"btn btn-circles btn-step-detail-now" : "btn btn-circles btn-deatil-default",
    // GROUP_STATUS_CLASS_TXT:(isActiveClass)? "btn-step-txt-now" : "btn-step-txt-default",
    checkValue(num: number) {
        const _number = num ?? 0;
        if (_number > 0) {
            return true;
        }
        return false;
    }
    predicateBy(prop) {
        // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
        return function (a, b) {
            if (a[prop] > b[prop]) {
                return 1;
            } else if (a[prop] < b[prop]) {
                return -1;
            }
            return 0;
        };
    }
    setDefaultPic() {
        this.userImagePath = "assets/icon/user.png";
    }
    loadDataAll() {
        // console.log(this.dataFlowcode);
        if (this.dataFlowcode !== 10) {
            this._searchParam.GROUP_STATUS_CODE = "";
            this._dataSource = new DataSource({
                byKey: () => undefined,
                load: () =>
                    this.bpmProcinstServ
                        .getByFlowCode(
                            this._searchParam.GROUP_STATUS_CODE,
                            this.dataFlowcode
                        )
                        .toPromise(),
            });
        } else if (this.dataFlowcode === 10) {
            this._searchParam.GROUP_STATUS_CODE = "";
            this._dataSource = new DataSource({
                byKey: () => undefined,
                load: () =>
                    this.bpmProcinstServ
                        .getByPersonalId(this._searchParam.GROUP_STATUS_CODE)
                        .toPromise(),
            });
        }
        this.alertTaskList();
        // this.groupStatusStep();
    }

    onIssue() {
        if (User.Current) {
            this.router.navigate(["main/cyber/issue-online"], {
                fragment: "tasklist",
            });
        } else {
            this._loginServ.login("main/cyber/issue-online");
        }
    }
    onJurnal() {
        if (User.Current) {
            this.router.navigate(["main/register-journal"], {
                fragment: "tasklist",
            });
        } else {
            this._loginServ.login("main/register-journal");
        }
    }

    alertTaskList() {
        this.alertdata = [];
        this.groupStatusServ.get().subscribe((res) => {
            const group_staus = res;
            for (let i = 0; i < group_staus.length; i++) {
                const element = group_staus[i];
                this.bpmProcinstServ
                    .getByPersonalId(element.GROUP_STATUS_CODE)
                    .toPromise()
                    .then((data) => {
                        let total_value = 0;
                        if (data != null) {
                            total_value = data.length;
                        }
                        this.alertdata.push({
                            GROUP_STATUS_ID: element.GROUP_STATUS_ID,
                            GROUP_SEQ: element.GROUP_SEQ,
                            GROUP_STATUS_CODE: element.GROUP_STATUS_CODE,
                            GROUP_STATUS_NAME: element.GROUP_STATUS_NAME,
                            GROUP_ICON: element.GROUP_ICON,
                            TOTAL_VALUE: total_value,
                        });

                        // ตั้งค่าให้กับปุ่ม filter บน mobile หลังกดปุ่ม filter
                        if (this.currentfilter === element.GROUP_STATUS_CODE) {
                            this.currentStatusMobile =
                                element.GROUP_STATUS_NAME +
                                " (" +
                                total_value +
                                ")";
                        } else {
                            // ตั้งค่าแรกให้กับปุ่ม filter บน mobile
                            if (i === 0) {
                                this.currentStatusMobile =
                                    element.GROUP_STATUS_NAME +
                                    " (" +
                                    total_value +
                                    ")";
                            }
                        }
                    });
            }
        });
    }

    validateEmail(email) {
        // eslint-disable-next-line max-len
        const re =
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }


    onWaysValueChanged(event: any) {
        console.log(event);
        let val = event;
        switch (val) {
            case 1:
                this._isShow = true;
                this._isShow2 = false;
                this.popupHeight = 600;
                break;
            case 2:
                this._isShow = false;
                this._isShow2 = true;
                this.popupHeight = 600;
                break;
        }
    }

    isBankID(bankid): boolean {
        const pattern = /^[A-Za-z0-9]+$/;
        return pattern.test(bankid);
    }
    onRegister(event: any) {
        if(!this.submission.FREEZE_ACT_DATE && !this.submission.FREEZE_ACT_TIME){
            Swal.fire({
                title: 'ผิดพลาด!',
                text: 'กรุณาเลือกกรอกวันและเวลา',
                icon: 'warning',
                confirmButtonText: 'Ok',
            }).then(() => {
            });
            return;
        }
        if(!this.isBankID(this.submission.FREEZE_ACT_BANK_TRACK_NO)){
            Swal.fire({
                title: 'ผิดพลาด!',
                html: 'กรุณาเลขอ้างอิงให้ถูกต้อง<br><b>ตัวอย่าง</b> 25550115KTB06111',
                icon: 'warning',
                confirmButtonText: 'Ok',
            }).then(() => {});
            return;
        }
        this._isLoading = true;
        if (this._isShow2) {
            Swal.fire({
                title: 'แจ้งเตือน!',
                text: 'ระบบจะนำท่านไปสู่ขั้นตอนแจ้งเรื่องใหม่!!!',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                this._isLoading = true;
                location.href = "/main/issue-online/1";
            });
        }
        else {
            try {
                this.submission.CREATE_USER_ID = User.Current.PersonalId;
                this.submission.PERSONAL_ID = User.Current.PersonalId;



                this.submission.CASE_ID = this.selectcaseID;

                console.log(this.selectcaseID);
                this.freezeAccountService.post(this.submission)
                .subscribe(() => {
                        this.popupConsentVisible = false;
                });
                try{
                    this.freezeAccountService.postgdcc(this.submission)
                    .subscribe(() => {
                            this.popupConsentVisible = false;
                    });
                } catch (error) {

                }

                    Swal.fire({
                        title: 'แจ้งเตือน!',
                        text: 'ดำเนินการบันทึกข้อมูลเรียบร้อย!!!',
                        icon: 'success',
                        confirmButtonText: 'ตกลง'
                    }).then(() => {
                        location.reload();
                        // this._isLoading = true;
                        // this.router.navigate(["/main/issue-online/1"]);
                    });
            } catch (error) {

            } finally {
                setTimeout(() => {
                    this._isLoading = false;
                }, 2000);
            }
        }
    }

    onSkip(event: any) {
        // setTimeout(() => {
        //         // this._isLoading = true;
        //         location.href = "/main/issue-online/1";
        // }, 2000);
        // this.router.navigate(["/main/issue-online/1"]);
        this.submission = {};
        this.now = undefined;
        this.popupConsentVisible = false;
    }
    TelLink(href) {
        const downloadLink = document.createElement("a");
        downloadLink.href = href;
        downloadLink.click();
    }
    setDate(){
        this.now = this.now == undefined ? new Date() : this.now;
    }
    OnSelectDate(e) {
        if(e.value){
            const mydate = this.datePipe.transform(e.value, 'yyyy-MM-dd');
            const mytime = this.datePipe.transform(e.value, 'HH:mm:ss');
            this.submission.FREEZE_ACT_TIME = mytime;
            this.submission.FREEZE_ACT_DATE = mydate;
        }
    }
    convertDate(date,time){
        const dateIN = String(date+" "+time);
        const [datePart, timePart] = dateIN.split(" ");
        const [year, month, day] = datePart.split("-");
        const [hours, minutes, seconds] = timePart.split(":");
        return [Number(year),Number(month)-1,Number(day),Number(hours),Number(minutes),Number(seconds)]
    }
    convertTimezone(time){
        const timeZoneOffset = 7 * 60;
        const timeZoneOffsetMs = 7 * 60 * 60 * 1000;
        const dateWithTimeZone = new Date(time.getTime() + timeZoneOffsetMs);
        const formattedString = dateWithTimeZone.toISOString().replace("Z", `+${timeZoneOffset.toString().padStart(2, "0")}:00`);
        return formattedString;
    }
    async checkBank(e){
        if (!e.event || e.event.type === "change") {
            if(e.value){
                if(e.value.length >= 15){
                    const value = e.value;
                    const bank_name = value.replace(/\d+/g, '');
                    const upperString = bank_name.toUpperCase();
                    var haveBank = await this._bankInfoService.GetBankTrackNo(value.toUpperCase()).toPromise();
                    if(haveBank.Value){
                        Swal.fire({
                            title: 'ผิดพลาด!',
                            html: 'เลขอ้างอิงนี้มีการแจ้งแล้ว</br>รบกวนตรวจสอบคดีที่เคยบันทึกมาแล้ว',
                            icon: 'warning',
                            confirmButtonText: 'Ok',
                        }).then(() => {this.submission.FREEZE_ACT_BANK_NAME = "";this.blockSave=true;});
                        return;
                    }
                    await this._bankInfoService.GetBankInfoByName(upperString).subscribe((_) =>{
                        if(_ != null){
                            this.submission.FREEZE_ACT_BANK_NAME = _[0].BANK_NAME;
                            this.blockSave=false;
                        }else{
                            Swal.fire({
                                title: "ผิดพลาด!",
                                text: "กรอกเลขอ้างอิงไม่ถูกต้อง",
                                icon: "warning",
                                confirmButtonText: "Ok",
                            }).then(() => {this.submission.FREEZE_ACT_BANK_NAME = "";this.blockSave=true;});
                        }
                    });
                }else{
                    Swal.fire({
                        title: "ผิดพลาด!",
                        text: "กรอกเลขอ้างอิงอย่างน้อย 15 หลัก",
                        icon: "warning",
                        confirmButtonText: "Ok",
                    }).then(() => {this.blockSave=true;});
                    return
                }
            }
        }
    }

    addbankcaseid(cellValue){
        const data = cellValue.data;
        if(data){
            this.popupConsentVisible = true;
            this.selectcaseID = data.DATA_ID;

            let val = 1;
            switch (val) {
                case 1:
                    this._isShow = true;
                    this._isShow2 = false;
                    this.popupHeight = 600;
                    break;
                case 2:
                    this._isShow = false;
                    this._isShow2 = true;
                    this.popupHeight = 600;
                    break;
            }
        }
    }

    CheckBankID(event) {
        // const seperator  = '^[ก-๏\\s]+$';
        const seperator = '^[A-Za-z0-9]';
        const maskSeperator = new RegExp(seperator, 'g');
        const result = maskSeperator.test(event.key);
        return result;
    }
    PasteCheckBankID(event) {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData.getData('text');
        // const seperator  = '^[ก-๏\\s]+$';
        const seperator = '^[A-Za-z0-9]';
        const maskSeperator = new RegExp(seperator, 'g');
        const result = maskSeperator.test(pastedText);
        return result;
    }

    displayFormatDateTime(date) {
        return formatDate(new Date(date), 'dateShortTimeThai');
    }

    async addorg(cellValue){
        this.province = await this.serviceProvince.GetProvince().toPromise();
        this.dsorgbyarialocation = await this._OrgService.getorgwalkinall().toPromise();
        const data = cellValue.data;
        this.formData.INST_ID = data.INST_ID;
        if(data){
            this.orgShow = true;
        }
    }

    onClose(){
        this.formData.ORG_PROVINCE_OFFICER_ID = undefined;
        this.formData.ORGANIZE_ID = undefined;
        this.orgShow = false;
    }

    check1440(data) {
        // return true;
        if (data) {
            if (data.TRACKING_CODE.includes("T")) {
                if (data.ORG_ID === undefined || data.ORG_ID === null) {
                    return true;
                } else if (data.ORG_ID === 1) {
                    return true;
                }
            }
        }
        return false;
    }

    OnSelectProvicePresentlocation(e){
        if (e.value) {
            const data =
                this.selectPresentProvicelocation.instance.option(
                    "selectedItem"
                );
            if (data) {
                this.formData.ORG_PROVINCE_OFFICER_ID = data.PROVINCE_ID;
                this.formData.ORG_PROVINCE_OFFICER_NAME = data.PROVINCE_NAME_THA;
            } else {
                this.formData.ORG_PROVINCE_OFFICER_ID = e.value;
            }
            this._OrgService.getorgProvince(e.value).subscribe((_) => {
                this.dsorgbyarialocation = _;
            });
        }
    }

    Onorglocation(e){
        const data = this.selectorg.instance.option("selectedItem");
        if (data) {
            this.formData.ORGANIZE_ID =  data.ORGANIZE_ID;
            this.formData.ORGANIZE_NAME = data.ORGANIZE_NAME_THA;
            this.formData.ORG_PROVINCE_OFFICER_ID = Number(data.ORGANIZE_ARIA_CODE);
        } else {
            this.formData.ORGANIZE_ID = e.value;
        }
    }

    onvaluecheckboxlocationchange(e, type_location) {
        this.formdataOrgsendcase = {
            ORG_LOCATION_TYPE: null,
            ORGANIZE_ID: null,
            ORG_LOCATION_NAME: "",
            ORG_PROVINCE_ID: null,
            ORG_PROVICE_NAME: "",
            ORG_LOCATION_MAIN_ID: null,
            ORG_LOCATION_MAIN_NAME: "",
            ORG_LOCATION_CENTER_ID: null,
            ORG_LOCATION_CENTER_NAME: "",
        };
        if (type_location == 1) {
            this.checkboxLocation.location_type1 = e.value;
            this.checkboxLocation.location_type2 = 0;
            if (e.value == 1) {
                this.formData.ORGANIZE_ID = null;
                this.formData.location_type1 = 1;
                this.formData.ORG_LOCATION_TYPE = 1;
            }
        } else if (type_location == 2) {

            this.checkboxLocation.location_type2 = e.value;
            this.checkboxLocation.location_type1 = e.value;
            this.formData.ORG_PROVINCE_ID = undefined;
            this.formData.ORG_PROVINCE_LOCATION_ID = undefined;
            if (e.value == 2) {
                this.formData.ORGANIZE_ID = null;
                this.formData.location_type1 = 2;
                this.formData.ORG_LOCATION_TYPE = 2;
            }
        } else if (type_location == 3) {
            this.formData.ORG_PROVINCE_ID = undefined;
            this.formData.ORG_PROVINCE_LOCATION_ID = undefined;
            this.checkboxLocation.location_type3 = e.value;
            if (e.value == 3) {
                this.formData.location_type1 = 3;
                this.formData.ORG_LOCATION_TYPE = 3;
                this.formData.ORGANIZE_ID = 2375;
                this.formData.ORG_LOCATION_NAME = "กองบัญชาการตำรวจสอบสวนกลาง";
            }
        }
    }

    onvaluechangeorgmain(e, type) {
        this.formData.ORG_PROVINCE_MAP_AREA_ID = null;
        this.formData.ORG_PROVINCE_MAP_AREA_NAME = null;

        if (e.value) {
            if (type == 1) {
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = null;
                const data: any = this.orgtype2_1.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = data[0].org_id;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_NAME1 =
                    data[0].org_name;

                //parame insert
                this.formData.ORG_LOCATION_TYPE = 2;
                this.formData.ORGANIZE_ID = data[0].org_id;
                this.formData.ORG_LOCATION_NAME = data[0].org_name;
            }
            if (type == 2) {
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = null;
                const data: any = this.orgtype2_2.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = data[0].org_id;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_NAME2 =
                    data[0].org_name;

                //parame insert
                this.formData.ORG_LOCATION_TYPE = 2;
                this.formData.ORGANIZE_ID = data[0].org_id;
                this.formData.ORG_LOCATION_NAME = data[0].org_name;
            } else if (type == 3) {
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = null;
                const data: any = this.orgtype2_3.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = data[0].org_id;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_NAME3 =
                    data[0].org_name;

                //parame insert
                this.formData.ORG_LOCATION_TYPE = 2;
                this.formData.ORGANIZE_ID = data[0].org_id;
                this.formData.ORG_LOCATION_NAME = data[0].org_name;
            } else if (type == 4) {
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = null;
                const data: any = this.orgtype2_4.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = data[0].org_id;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_NAME4 =
                    data[0].org_name;

                //parame insert
                this.formData.ORG_LOCATION_TYPE = 2;
                this.formData.ORGANIZE_ID = data[0].org_id;
                this.formData.ORG_LOCATION_NAME = data[0].org_name;
            } else if (type == 5) {
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = null;
                const data: any = this.orgtype2_5.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = data[0].org_id;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_NAME5 =
                    data[0].org_name;

                //parame insert
                this.formData.ORG_LOCATION_TYPE = 2;
                this.formData.ORGANIZE_ID = data[0].org_id;
                this.formData.ORG_LOCATION_NAME = data[0].org_name;
            }
        }
    }

    onSave(e){
        if(!this.formData.ORGANIZE_ID){
            Swal.fire({
                title: 'ผิดพลาด!',
                text: 'กรุณาเลือกสถานีที่ท่าจะไปพบ',
                icon: 'warning',
                confirmButtonText: 'Ok',
            }).then(() => {
            });
            return;
        }
        const setData = {
            organize_id : Number(this.formData.ORGANIZE_ID),
            inst_id : Number(this.formData.INST_ID),
            personal_id : Number(User.Current.PersonalId)
        }
        this._isLoading = true;
        this.bpmProcinstServ.userSelectOrgGdcc(setData)
        .subscribe(() => {
            this.bpmProcinstServ.userSelectOrg(setData)
            .subscribe(() => {
                Swal.fire({
                    title: 'แจ้งเตือน!',
                    text: 'เลือกหน่วยงานสำเร็จ!!!',
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                }).then(() => {
                    this._isLoading = false;
                    this.onClose();
                    location.reload();
                });
            });
        });
    }

}
