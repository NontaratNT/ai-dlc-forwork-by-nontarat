
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import DataSource from 'devextreme/data/data_source';
import { formatDate } from 'devextreme/localization';
import { BpmProcinstService, IBpmProcInst } from 'src/app/services/bpm-procinst.service';
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
import * as moment from 'moment';
import { BpmAppointmentService } from 'src/app/services/bpm-appointment.service';
import { ChatService } from 'src/app/services/chat.service';
import { UserSettingService } from 'src/app/services/user-setting.service';
@Component({
    selector: 'app-track-status',
    templateUrl: './track-status.component.html',
    styleUrls: ['./track-status.component.scss']
})
export class TrackStatusComponent implements OnInit {
    align: any;
    _dataSource: any;
    clr: any;
    default = undefined;
    _searchParam: any;
    personalInfo: any;
    // data: any = [{APP_ICON: 'fa-home', content_name: 'AAA', APP_NAME: 'VVVV'}];
    botton = [{ value: 0, text: 'การนัดหมายที่กำลังมาถึง', alignment: "left" }, { value: 1, text: ' เรื่องที่แจ้ง', alignment: "right", }];
    check = false;
    // listAppointment = [
    //     {id:1,title:"การหลอกลวงออนไลน์ทางด้านการเงิน",date:"3 มกราคม 2564",station:"สน.บางนา"},
    //     {id:2,title:"Romance Scam",date:"4 มกราคม 2564",station:"สน.ทองหล่อ"},
    // ];
    monthShortTh = [
        "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
        "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];
    monthFulltTh = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
        'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
        'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    group_status = [];
    _flowCode = [];
    datastatus = [];
    data = [];
    dataFlowcode;
    isLoading = false;
    datacount = [];
    alertdata = [];
    currentStatusMobile = "";
    currentfilter = "";
    userData = User.Current.FullNameTH;
    cityzenNumber = User.Current.CitizenNumber;
    userImagePath: string | ArrayBuffer;
    _flowInfo: IFlowInfo[];
    _isLoading = false;
    taskPath;
    statusname: any;
    listAppointment: any = [];
    showAppointmentList = false;
    countAppointmentList = 0;

    constructor(private router: Router,
                private servChat: ChatService,
                private servicePersonal: PersonalService,
                private bpmProcinstServ: BpmProcinstService,
                private statusServ: StatusService,
                private userSetting: UserSettingService,
                private _flowServ: BpmMdmFlowService,
                private groupStatusServ: GroupStatusService,
                private _bpmAppointmentService: BpmAppointmentService,
                private _loginServ: LoginService) {
        this._searchParam = {} as any;
        this._searchParam.GROUP_STATUS_CODE = "OR";
        this._searchParam.FLOW_ID = 3;

    }

    ngOnInit(): void {
        this._isLoading = true;
        if (User.Current) {
            this.personalInfo = User.Current;
            this.userImagePath = environment.config.baseConfig.resourceUrl.replace("/ccib", "/bpm") + User.Current.ImageUrl;
            this.check = true;

            this._bpmAppointmentService.GetAppointment(this.personalInfo.PersonalId).subscribe((listItem) => {
                if (listItem) {
                    this.countAppointmentList = listItem.length;
                    this.listAppointment = listItem;
                }
                this.showAppointmentList = true;
                this._isLoading = false;

            });
            let d = [];
            this.groupStatusServ.get().subscribe(_ => {
                d = _;
                d.push({
                    GROUP_STATUS_CODE: "",
                    GROUP_STATUS_NAME: "ทั้งหมด"
                });
                this.group_status = d.reverse();
                this.default = "";
            });


        } else {
            this.check = false;
        }
        this.align = ['left'];
        this.clr = 'left';
        this.servicePersonal.GetPersonalById(User.Current.PersonalId).subscribe(_ => {
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
                        this.router.navigate(["/mobile/personal"]);
                    }
                });
            }
            if (!(_.PERSONAL_TEL_NO)) {
                Swal.fire({
                    title: "การติดตามสถานะ",
                    text: "ท่านต้องเพิ่มหมายเลขโทรศัพท์หรือไม่?",
                    html: "<p>กรุณาเพิ่มข้อมูลหมายเลขโทรศัพท์ของท่าน</p>",
                    icon: "info",
                    confirmButtonText: "ตกลง",
                    // showCancelButton: true,
                    // cancelButtonText: "ไม่",
                }).then((r) => {
                    if (r.isConfirmed) {
                        this.router.navigate(["/mobile/personal"]);
                    }
                });
            }
            if (_.USER_PICTURE) {
                this.userImagePath = environment.config.baseConfig.resourceUrl.replace("/ccib", "/bpm") + _.USER_PICTURE;
            }
        });

        // mainDataList
        const statusGroup = this._searchParam.GROUP_STATUS_CODE = '';
        this.bpmProcinstServ.getByPersonalId(statusGroup).subscribe( _ => {

            for (const a of _) {
                if (a.REJECT_FLAG === 'Y') {
                    a.GROUP_STATUS_NAME = "สิ้นสุด (จำหน่าย)";
                }
                this.servChat.getCountNoChat(a.INST_ID).subscribe(s => {
                    if (s) {
                        a.count = s;
                    } else {
                        a.count = 0;
                    }
                });
            }

            this._dataSource = _;
            // console.log(this._dataSource);
            this.statusname = 'สถานะ' + 'ทั้งหมด';
        });

        this.alertTaskList();
        this.groupStatusStep(this._searchParam.GROUP_STATUS_CODE);
        this._flowServ.gets()
            .subscribe(_ => {
                this._flowCode = _;
                this._flowCode.push({ FLOW_CODE: 10, FLOW_NAME: "แสดงรายการทั้งหมด" });
            });

        // this._isLoading = false;
    }

    async onSelectStatusCode(e) {
        this._dataSource.length = 0;
        this._isLoading = true;
        for (const c of this.group_status) {
            if (e.value === c.GROUP_STATUS_CODE) {
                this.statusname = 'สถานะ' + c.GROUP_STATUS_NAME;
            }
        }
        // console.log(this.statusname);

        this._dataSource = [];
        const param: any = {
            personalId: User.Current.PersonalId,
            GroupStatusCode: e.value,
        };
        if (e.value === 'C07') {
            param.GeStatusOrRejectFlag = true;
        } else {
            param.StatusRejectFlag = false;
        }
        console.log(param);
        const listTask = await this.bpmProcinstServ.getTaskListAndRejectMobile(param).toPromise();
        if (listTask) {
            for (const item of listTask) {
                item.CREATE_DATE_TEXT = this.displayFormatDate(item.CREATE_DATE);
                item.OPTIONAL_DATA_REPLACE = this.CountStr(item.OPTIONAL_DATA);
                if (item.REJECT_FLAG === 'Y') {
                    item.GROUP_STATUS_NAME = "สิ้นสุด (จำหน่าย)";
                }
                this.servChat.getCountNoChat(item.INST_ID).subscribe(s => {
                    if (s) {
                        item.count = s;
                    } else {
                        item.count = 0;
                    }
                });
            }
            this._dataSource = listTask;

        }




        // this.bpmProcinstServ.getByPersonalId(e.value).subscribe(_ => {
        //     for (const a of _) {
        //         this.servChat.getCountChat(a.INST_ID).subscribe(s => {
        //             if (s) {
        //                 a.count = s;
        //             } else {
        //                 a.count = 0;
        //             }

        //         });
        //     }
        //     this._dataSource = _;
        // });
    }

    CountStr(str) {
        if (str) {
            const countStr = str.length;
            if (countStr >= 200) {
                const result = str.substring(0, 199);
                return result + '...';
            } else {
                return str;
            }

        }
        return "";
    }

    validateEmail(email) {
        // eslint-disable-next-line max-len
        const re =
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    StdAndOffer(e) {
        if (e.itemData.value === 0) {
            this.clr = 'left';
        } else if (e.itemData.value === 1) {
            this.clr = 'right';
        }
    }
    PhoneNumberFormat(phoneNumber) {
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return match[1] + '-' + match[2] + '-' + match[3];
        }
        return null;
    }
    GotoUrlTaskList(cellValue) {
        const data = cellValue.data;
        this.userSetting.userSetting.issue_status = false;
        this.userSetting.userSetting.tabIndex = undefined;
        this.router.navigate(["/mobile/issue-online/" + data.INST_ID + "/" + data.DOCUMENT_ID]);
        this.userSetting.userSetting.location_name = data.INST_ID + "/" + data.DOCUMENT_ID;
        this.userSetting.userSetting.iconVisible = false;
    }
    AppointmentColorClass(index) {
        return (index % 2 === 0) ? "bc-img1" : "bc-img2";
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
    ConvertDateFullYear(date) {
        const d = new Date(date);
        const ddate = ` ${d.getDate()} `;

        return [d.getFullYear() + 543].join("");
    }
    ViewTaskAppointmentId(cellValue) {
        Swal.fire({
            title: '',
            text: 'ระบบกำลังปรับปรุง',
            icon: 'warning',
            confirmButtonText: 'ตกลง'
        }).then(() => { });
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
            this.userSetting.userSetting.issue_status = false;
            this.router.navigate(["/mobile/issue-online/" + data.INST_ID + "/" + data.DOCUMENT_ID]);
            this.userSetting.userSetting.tabIndex = undefined;
        }
        this.userSetting.userSetting.location_name = data.INST_ID + "/" + data.DOCUMENT_ID;
        this.userSetting.userSetting.iconVisible = false;
        // this.userSetting.Save();

    }

    onPersonal() {
        this.router.navigate(["/mobile/personal"]);
    }

    Add() {
        this.router.navigate(["/mobile/issue"]);
    }
    gourltracking(cellValue) {
        const data = cellValue.data;
        this.router.navigate(["/mainside/tracking/" + data.CASE_ID]);
    }
    calculateStatus(e) {
        if (e.data.STATUS_NAME) {
            return e.data.STATUS_NAME;
        }
        else {
            return "ยื่นคำขอ";
        }
    }

    formatDate(e) {
        return formatDate(new Date(e.CREATE_DATE), "dateShortTimeThai");
    }

    DisplayFormatDate(data: string) {
        const dateValue = moment(data[(this as any).dataField]).toDate();
        return formatDate(dateValue, "dateShortTimeThai") + " น.";
    }

    bindTaskList(groupStatusCode) {
        this._searchParam.GROUP_STATUS_CODE = groupStatusCode;
        if (this._searchParam.flowCode) {
            this._dataSource = new DataSource({
                byKey: () => undefined,
                load: () => this.bpmProcinstServ.getByFlowCode(this._searchParam.GROUP_STATUS_CODE, this._searchParam.flowCode).toPromise()
            });
        } else {
            this._dataSource = new DataSource({
                byKey: () => undefined,
                load: () => this.bpmProcinstServ.getByPersonalId(this._searchParam.GROUP_STATUS_CODE).toPromise()
            });
        }
        this.groupStatusStep(groupStatusCode);
    }
    onFilterChanged(e) {
        // console.log(this._searchParam.flowCode);
        if (e.value) {
            this._searchParam.flowCode = e.value;
            this.dataFlowcode = e.value;
            if (this.dataFlowcode !== 10) {
                this._searchParam.GROUP_STATUS_CODE = '';
                this._dataSource = new DataSource({
                    byKey: () => undefined,
                    load: () => this.bpmProcinstServ.getByFlowCode(this._searchParam.GROUP_STATUS_CODE, this.dataFlowcode).toPromise()
                });
            }
            else if (this.dataFlowcode === 10) {
                this._searchParam.GROUP_STATUS_CODE = '';
                this._dataSource = new DataSource({
                    byKey: () => undefined,
                    load: () => this.bpmProcinstServ.getByPersonalId(this._searchParam.GROUP_STATUS_CODE).toPromise()

                });
            }
        }
    }
    getDefinitionName(definition: string): string {
        return this._flowInfo.find(_ => _.WF_DEFINITION_ID === definition)?.FLOW_NAME;
    }
    displayFormatDate(date) {
        return formatDate(new Date(date), "dateShortTimeThai") + " น.";
    }
    groupStatusStep(groupstatuscode) {
        this.groupStatusServ.get().subscribe(res => {
            this.datastatus = res.sort(this.predicateBy("GROUP_SEQ"));
            this.data = [];
            // let loop = 0;
            for (const i of this.datastatus) {
                if (groupstatuscode === i.GROUP_STATUS_CODE) {
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
    setDefaultPic() {
        this.userImagePath = "assets/icon/user.png";
    }
    loadDataAll() {
        // console.log(this.dataFlowcode);
        if (this.dataFlowcode !== 10) {
            this._searchParam.GROUP_STATUS_CODE = '';
            this._dataSource = new DataSource({
                byKey: () => undefined,
                load: () => this.bpmProcinstServ.getByFlowCode(this._searchParam.GROUP_STATUS_CODE, this.dataFlowcode).toPromise()
            });
        }
        else if (this.dataFlowcode === 10) {
            this._searchParam.GROUP_STATUS_CODE = '';
            this._dataSource = new DataSource({
                byKey: () => undefined,
                load: () => this.bpmProcinstServ.getByPersonalId(this._searchParam.GROUP_STATUS_CODE).toPromise()

            });
        }
        this.alertTaskList();
        this.groupStatusStep('');
    }

    onIssue() {

        if (User.Current) {
            this.router.navigate(['main/cyber/issue-online'], { fragment: "tasklist" });
        } else {
            this._loginServ.login("main/cyber/issue-online");
        }

    }
    onJurnal() {
        if (User.Current) {
            this.router.navigate(['main/register-journal'], { fragment: "tasklist" });
        } else {
            this._loginServ.login('main/register-journal');
        }
    }

    alertTaskList() {

        this.alertdata = [];
        this.groupStatusServ.get().subscribe(res => {
            const group_staus = res;
            for (let i = 0; i < group_staus.length; i++) {
                const element = group_staus[i];
                this.bpmProcinstServ.getByPersonalId(element.GROUP_STATUS_CODE).toPromise().then(data => {
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
                        TOTAL_VALUE: total_value
                    });

                    // ตั้งค่าให้กับปุ่ม filter บน mobile หลังกดปุ่ม filter
                    if (this.currentfilter === element.GROUP_STATUS_CODE) {
                        this.currentStatusMobile = element.GROUP_STATUS_NAME + " (" + total_value + ")";
                    } else {
                        // ตั้งค่าแรกให้กับปุ่ม filter บน mobile
                        if (i === 0) {
                            this.currentStatusMobile = element.GROUP_STATUS_NAME + " (" + total_value + ")";
                        }
                    }
                });
            }
        });
    }
}
