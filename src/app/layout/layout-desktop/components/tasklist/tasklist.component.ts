/* eslint-disable max-len */

import { Component, OnInit } from "@angular/core";
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
import { FreezeAccountService } from "src/app/services/bpm-freeze-account.service";

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
    ans1;
    ans2;
    ans3;
    ans4;
    caseId;
    submission = {} as any;

    ways = [{ id: 1, text: 'ดำเนินการแล้ว' }, { id: 2, text: 'ยังไม่ได้ดำเนินการ' }];
    scopeWays1: boolean;
    scopeWays2: boolean;
    _isShow: boolean = false;
    _isShow2: boolean = false;
    popupConsentVisible: boolean = false;

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
        private freezeAccountService: FreezeAccountService

    ) {
        this._searchParam = {} as any;
        this._searchParam.GROUP_STATUS_CODE = "OR";
        this._searchParam.FLOW_ID = 3;
    }

    ngOnInit(): void {
        this._isLoading = true;

        // this.surveyService.getSurveyByCaseId(123456).subscribe(res => {
        //     console.log(res);
        //     // if (res.) {
        //     //
        //     // }
        // });

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
                    this.onDoSurvey1(item.DATA_ID);
                    // return;
                }
                if (
                    item.GROUP_STATUS_CODE &&
                    (item.GROUP_STATUS_CODE === "C05" ||
                        item.GROUP_STATUS_CODE === "C06")
                ) {
                    this.caseId = item.DATA_ID;
                    this.onDoSurvey2(item.DATA_ID);
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
        this.router.navigate(["/main/issue-online-view/" + data.INST_ID]);
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
            this.router.navigate(["/main/issue-online-view/" + data.INST_ID]);
        }
    }
    report(cellValue){
        const data = cellValue.data;
        if(data){
            window.open("https://www.thaipoliceonline.com/web-report/report?ReportName=report_print_inform_report&caseId=" + data.INST_ID, "_blank");
        }
    }
    onPersonal() {
        this.router.navigate(["/main/personal"]);
    }

    Add() {
        // this.router.navigate(["/main/issue-online/1"]);
        this.popupConsentVisible = true;
        // this._isLoading = true;
        // location.href = "/main/issue-online/1";
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
                item.CREATE_DATE_TEXT = this.displayFormatDate(
                    item.CREATE_DATE
                );
                item.OPTIONAL_DATA_REPLACE = this.CountStr(item.OPTIONAL_DATA);
                if (item.REJECT_FLAG === "Y") {
                    item.GROUP_STATUS_NAME = "สิ้นสุด (จำหน่าย)";
                }
                // console.log(item.GROUP_STATUS_CODE);
                // if (item.GROUP_STATUS_CODE !== 'C01' && item.GROUP_STATUS_CODE !== 'C02') {
                //     this.onLoadSurvey(item.DATA_ID);
                // }
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

    onSkip(event: any) {
        this.router.navigate(["/main/issue-online/1"]);
        this.popupConsentVisible = false;
    }

    
    onRegister(event: any) {

      
        this._isLoading = true;
        if (this._isShow2) {
            Swal.fire({
                title: 'แจ้งเตือน!',
                text: 'ระบบจะนำท่านไปสู่ขั้นตอนลงทะเบียนยืนยันตัวตน!!!',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                this._isLoading = false;
                this.popupConsentVisible = false;
                this.router.navigate(["/main/issue-online/1"]);

            });
        }
        else {
            try {
                this.freezeAccountService.post(this.submission).subscribe((_) => {
                    Swal.fire({
                        title: 'แจ้งเตือน!',
                        text: 'ดำเนินการบันทึกข้อมูลเรียบร้อย ระบบจะนำท่านไปสู่ขั้นตอนลงทะเบียนยืนยันตัวตน!!!',
                        icon: 'success',
                        confirmButtonText: 'ตกลง'
                    }).then(() => {
                        this._isLoading = false;
                        this.popupConsentVisible = false;
                        this.router.navigate(["/main/issue-online/1"]);

                    });
                })
            } catch (error) {

            } finally {
                setTimeout(() => {
                    this._isLoading = false;
                }, 2000);
            }
        }
    }

    onWaysValueChanged(event: any) {
        let val = event.value;
        switch (val) {
            case 1:
                this._isShow = true;
                this._isShow2 = false;
                break;
            case 2:
                this._isShow = false;
                this._isShow2 = true;
                break;
        }
    }
}
