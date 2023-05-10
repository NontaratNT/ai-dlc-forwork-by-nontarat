import { User } from './../../../services/user';
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




@Component({
    selector: 'app-tasklist',
    templateUrl: './tasklist.component.html',
    styleUrls: ['./tasklist.component.scss']
})
export class TasklistComponent implements OnInit {
    check = false;
    _dataSource: any;
    _flowCode = [];
    datastatus = [];
    data = [];
    dataFlowcode;
    myCityzen = '';
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

    constructor(private router: Router,
                private servicePersonal: PersonalService,
                private bpmProcinstServ: BpmProcinstService,
                private statusServ: StatusService,
                private _flowServ: BpmMdmFlowService,
                private groupStatusServ: GroupStatusService,
                private _loginServ: LoginService) {
        this._searchParam = {} as any;
        this._searchParam.GROUP_STATUS_CODE = "OR";
        this._searchParam.FLOW_ID = 3;
    }

    ngOnInit(): void {
        this._isLoading = true;
        const str = this.cityzenNumber;
        if (str) {
            this.myCityzen = "x-xxxx-xxxx" + str.substring(10, 9) + "-" + str.substring(10, 12) + "-" + str.substring(12);
        }
        else {
            this.myCityzen = "";
        }
        this.servicePersonal.GetPersonalById(User.Current.PersonalId).subscribe(_ => {
            if (_.USER_PICTURE) {
                this.userImagePath = environment.config.baseConfig.resourceUrl.replace("/ccib", "/bpm") + _.USER_PICTURE;
            }
        });
        // mainDataList
        const statusGroup = this._searchParam.GROUP_STATUS_CODE = '';
        this.bpmProcinstServ.getByPersonalId(statusGroup).subscribe(_ => {
            this._dataSource = _;
            this._isLoading = false;
        });

        this.alertTaskList();
        this.groupStatusStep(this._searchParam.GROUP_STATUS_CODE);
        this._flowServ.gets()
            .subscribe(_ => {
                this._flowCode = _;
                this._flowCode.push({ FLOW_CODE: 10, FLOW_NAME: "แสดงรายการทั้งหมด" });
            });
        if (User.Current) {
            this.userImagePath = environment.config.baseConfig.resourceUrl.replace("/ccib", "/bpm") + User.Current.ImageUrl;
            this.check = true;
        } else {
            this.check = false;
        }

    }

    edit(cellValue) {
        const data = cellValue.data;
        if (data) {
            this.router.navigate(["/main/cyber/tasklist-tab/" + data.INST_ID + "/" + data.DOCUMENT_ID]);
        }
    }

    onPersonal() {
        this.router.navigate(["/main/personal"]);
    }

    Add() {
        this.router.navigate(["/mainside/cyber/issue-online"]);
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
