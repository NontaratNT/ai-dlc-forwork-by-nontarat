import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DxDrawerComponent, DxFormComponent, DxTreeViewComponent } from "devextreme-angular";
import { FormConfigService, FormSubmitService, IFormConfig } from "eform-share";
import { BpmProcinstService } from "src/app/services/bpm-procinst.service";
import { GroupStatusService } from "src/app/services/group-status.service";
import { OnlineCaseService } from "src/app/services/online-case.service";
import { formatDate } from 'devextreme/localization';
import * as moment from "moment";
import Swal from "sweetalert2";
import { BpmDataShareService } from "./bpm-data-share.service";
import { FileService } from "src/app/services/file.service";

@Component({
    selector: "app-issue-online-edit",
    templateUrl: "./issue-online-edit.component.html",
    styleUrls: ["./issue-online-edit.component.scss"],
})
export class IssueOnlineEditComponent implements OnInit {
    @ViewChild(DxTreeViewComponent) selectMenuList: DxTreeViewComponent;
    @ViewChild(DxDrawerComponent, { static: false }) drawer: DxDrawerComponent;
    @ViewChild("formRequest", { static: false }) formRequest: DxFormComponent;
    listMneu = [
        { id: 1, text: 'ดูข้อมูล', icon: 'fas fa-edit',link:"/main/task-list",index:0 },
        { id: 2, text: 'แนบไฟล์หลักฐาน', icon: 'fas fa-paperclip',link:"/main/issue",index:1 },
        { id: 3, text: 'สนทนา', icon: 'fas fa-comments',link:"/main/issue",index:2 },
        { id: 4, text: 'ข้อมูลนัดหมาย', icon: 'fas fa-calendar',link:"/main/issue",index:3 },

        /* { id: 5 ถอนแจ้งความ }[OS] เงื่อนไข: ถ้าสถานะ = 'C01' สามารถถอนแจ้งความได้ */
    ];
    tabIndex = 0;
    _instId: number;
    _isLoading = false;
    _formDataConfig: IFormConfig;
    _formioId: string;
    _documentId: string;
    _wfinsId: string;
    isLoading = true;
    dataForm: any = {};
    loadTab = false;
    listGroupStatus: any = [];

    navigation: any = [];
    showSubmenuModes: string[] = ['slide', 'expand'];
    positionModes: string[] = ['left', 'right'];
    showModes: string[] = ['push', 'shrink', 'overlap'];
    text: string;
    selectedOpenMode = 'shrink';
    selectedPosition = 'left';
    selectedRevealMode = 'slide';
    isDrawerOpen = true;
    formOverview: any = {};
    requestTextByUser = "";
    requestOpenSendSerice = false;
    dataId = 0;
    statusWidth = 1500;
    fragment ="";
    bpmData: any = {};
    caseReject = false;
    fileChannel : any;
    fileMoney : any;
    constructor(
        private _formConfigServ: FormConfigService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private bpmProcinstServ: BpmProcinstService,
        private _onlineCaseServ: OnlineCaseService,
        private _formSubmitService: FormSubmitService,
        private _formConfigService: FormConfigService,
        private groupStatusServ: GroupStatusService,
        private shareBpmData: BpmDataShareService,
        private _fileService :FileService
    ) {}

    ngOnInit(): void {
        setTimeout(()=>{
            this._instId = Number(localStorage.getItem('inst_id'));
            this.loadTab = false;
            this.caseReject = false;
            this.loaddata(this._instId);
            this.LoadStatus(this._instId);
        }, 1000);
    }
    statusText(stauscode) {
        if (stauscode) {
            return stauscode;
        }
        else {
            return 'ยื่นคำขอ';
        }
    }
    CheckEmptyText(text){
        if (text !== undefined && text !== null){
            return text;
        }
        return "";
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
    LoadStatus(id){
        this.bpmProcinstServ.getByInstId(id).subscribe(res => {
            this.bpmData = res;
            this.shareBpmData.SetData(res);
            // OS เพิ่มหน้าถอนแจ้งความ
            if(res.GROUP_STATUS_CODE === 'C01') {
                this.listMneu.push({ id: 5, text: 'ถอนแจ้งความ', icon: 'fas fa-rotate-right',link:"/main/issue",index:4 })
            }
            if (res.REJECT_FLAG === 'Y'){
                this.caseReject = true;
                this.LoadStepDataReject();

            }else{
                this.LoadStepData(res.GROUP_STATUS_CODE);

            }
            // this.formOverview.TRACKING_CODE = res.TRACKING_CODE;
            // this.formOverview.CATEGORY_NAME = res.CATEGORY_NAME + " จาก " + res.PERSONAL_FULL_NAME;
            // this.formOverview.STATUS_NAME = this.statusText(res.STATUS_NAME);
            // this.formOverview.GROUP_STATUS_NAME = res.GROUP_STATUS_NAME;
            // this.formOverview.CREATE_DATE = this.FormatDate(res.CREATE_DATE);
            // this.formOverview.FLOW_SLA = res.FLOW_SLA;
            // this.formOverview.FLOW_UNIT = res.FLOW_UNIT;
            // this.formOverview.OFFICER_FULL_NAME = res.OFFICER_FULL_NAME;
            // this.formOverview.PERSONAL_TEL_NO = res.PERSONAL_TEL_NO;
            // if (res.UPDATE_DATE) {
            //     this.formOverview.UPDATE_DATE = this.FormatDate(res.UPDATE_DATE);
            // }
            // else {
            //     this.formOverview.UPDATE_DATE = this.FormatDate(res.CREATE_DATE);
            // }
        });
    }
    predicateBy(prop) {
        return (a, b) => {
            if (a[prop] > b[prop]) {
                return 1;
            } else if (a[prop] < b[prop]) {
                return -1;
            }
            return 0;
        };
    }
    CheckArray(data: any = []){
        const countArray = data.length ?? 0;
        if (countArray > 0){
            return true;
        }
        return false;

    }
    LoadStepData(marker){

        this.groupStatusServ.get().subscribe((_) => {
            this.listGroupStatus = [];
            const listGroupStatus = _.sort(this.predicateBy("GROUP_SEQ"));
            const checkMarker = listGroupStatus.filter(r => r.GROUP_STATUS_CODE === marker);
            const countItem = listGroupStatus.length ?? 0;
            this.statusWidth = countItem * 200 ;
            let isMark = true;
            let isActiveClass = true;
            if (!this.CheckArray(checkMarker)){
                isMark = false;
                isActiveClass = false;
            }

            for (const [key,i] of listGroupStatus.entries()) {
                if(isMark){
                    console.log(i)
                    isActiveClass = true;
                }
                this.listGroupStatus.push({
                    GROUP_STATUS_ID: i.GROUP_STATUS_ID,
                    GROUP_SEQ: i.GROUP_SEQ,
                    GROUP_STATUS_CODE: i.GROUP_STATUS_CODE,
                    GROUP_STATUS_NAME: i.GROUP_STATUS_NAME,
                    GROUP_ICON: i.GROUP_ICON,
                    GROUP_STATUS_CLASS: (isActiveClass)?"btn btn-circle btn-step-now" : "btn btn-circle btn-default",
                    GROUP_STATUS_CLASS_DETAIL: (isActiveClass)?"btn btn-circles btn-step-detail-now" : "btn btn-circles btn-deatil-default",
                    GROUP_STATUS_CLASS_TXT:(isActiveClass)? "btn-step-txt-now" : "btn-step-txt-default",
                    // GROUP_CLASS_MARK: (isMark)?"color-marked":"color-not-mark",
                    // GROUP_STATUS_CLASS: "btn  btn-default btn-circle",
                    // GROUP_STATUS_CLASS_DETAIL: "btn btn-circles btn-deatil-default",
                });

                if (i.GROUP_STATUS_CODE === marker) {
                    isMark = false;
                    isActiveClass = false;
                }
            }
        });
    }
    LoadStepDataReject(){
        this.groupStatusServ.get().subscribe((_) => {
            this.listGroupStatus = [];
            const listGroupStatus = _.sort(this.predicateBy("GROUP_SEQ"));
            const countItem = listGroupStatus.length ?? 0;
            this.statusWidth = countItem * 200 ;
            for (const [key,i] of listGroupStatus.entries()) {

                this.listGroupStatus.push({
                    GROUP_STATUS_ID: i.GROUP_STATUS_ID,
                    GROUP_SEQ: i.GROUP_SEQ,
                    GROUP_STATUS_CODE: i.GROUP_STATUS_CODE,
                    GROUP_STATUS_NAME: i.GROUP_STATUS_NAME,
                    GROUP_ICON: i.GROUP_ICON,
                    GROUP_STATUS_CLASS: "btn btn-circle btn-step-now",
                    GROUP_STATUS_CLASS_DETAIL: "btn btn-circles btn-step-detail-now",
                    GROUP_STATUS_CLASS_TXT:"btn-step-txt-now",
                });

            }
        });
    }
    loaddata(id){
        if (id) {
            this.bpmProcinstServ.getByInstId(id).subscribe(res=>{
                this._wfinsId = res.WF_INSTANCE_ID;
                this._formioId = res.FORM_IO_ID;
                this._documentId =res.DOCUMENT_ID;
                this.isLoading = false;
                this.loadTab = true;
                this.dataForm = {
                    InstId:this._instId,
                    ProcessInstanceId:this._wfinsId,
                    Submission:res,
                };
                // this._formConfigService.get(res.FORM_IO_ID).subscribe((resdata)=>{
                //     this._formDataConfig = resdata;
                //     this.loadSubmission();
                // });

            });
        }
    }
    async loadSubmission() {

        if (!this._formDataConfig.apiLoad) {
            this._formSubmitService.getSubmission(this._formDataConfig.formType).get(this._formioId, this._documentId)
                .subscribe(async res => {
                    if(this._instId){
                        this.fileMoney = await this._fileService.getCaseMoneyFile(this._instId).toPromise();
                    }
                    if(this.bpmData.DATA_ID){
                        this.fileChannel = await this._fileService.getChannelFile(this.bpmData.DATA_ID).toPromise();
                    }
                    this.dataForm = {
                        InstId:this._instId,
                        ProcessInstanceId:this._wfinsId,
                        Submission:res,
                    };
                    console.log("data",this.dataForm);

                    this.loadTab = true;

                    this.activeRoute.fragment.subscribe(async fragment => {
                        this.tabIndex = (fragment === 'task-chat')? 2:0;
                        const itemSelectId = this.listMneu[this.tabIndex].id;
                        await this.sleep(1000);
                        if(this.selectMenuList){
                            this.selectMenuList.instance.selectItem(itemSelectId);
                        }
                        this.isLoading = false;
                    });
                    // const fragment = await this.activeRoute.fragment.toPromise();
                    // console.log('fragment',fragment);
                    // this.tabIndex = (fragment === 'task-chat')? 2:0;
                    // console.log('this.tabIndex',this.tabIndex);
                    // const itemSelectId = this.listMneu[this.tabIndex].id;
                    // console.log('this.listMneu[this.tabIndex]',this.listMneu[this.tabIndex]);
                    // await this.sleep(1000);
                    // this.selectMenuList.instance.selectItem(itemSelectId);

                    // this.isLoading = false;
                    // this.loadTab = true;
                    // if (res){
                    //     this.requestOpenSendSerice = (res.backendId)?true:false;
                    // }
                    // this._onlineCaseServ.GetOnlineRequest(res.backendId).subscribe((_)=>{
                    //     if(_){
                    //         this.requestTextByUser = _.REQUEST_DETAIL ?? "";
                    //     }
                    // });
                    // this.activeRoute.fragment.subscribe(_ => {
                    //     this.fragment = _;
                    // });



                });
        }
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    SelectMenu(e){
        const d = e.itemData ?? null;
        const newIndex = d.index ?? 0;
        this.tabIndex = newIndex;
        this.selectMenuList.instance.selectItem(d.id);

    }
    SelectMenuInit(e){
        // this.activeRoute.fragment.subscribe(fragment => {
        //     if (fragment === 'task-chat'){
        //         this.tabIndex = 2;
        //         const d = this.listMneu[2];
        //         this.selectMenuList.instance.selectItem(d.id);

        //     }
        // });
        // console.log('this.listMneu[0].id',this.listMneu[0]);
    }
    ShowInvalidDialog(displayText = 'กรุณากรอกข้อมูลให้ครบ'){
        Swal.fire({
            title: "ผิดพลาด!",
            text: displayText,
            icon: "warning",
            confirmButtonText: "Ok",
        }).then(() => {});
    }
    ShowSuccessDialog(displayText = 'ส่งเรื่องที่ต้องการแก้ไขสำเร็จ'){
        Swal.fire({
            title: "สำเร็จ!",
            text: displayText,
            icon: "success",
            confirmButtonText: "Ok",
        }).then(() => {});
    }

    SubmitRequestTextCase(){
        if(!this.formRequest.instance.validate().isValid){
            this.ShowInvalidDialog("กรุณากรอกเรื่องที่ต้องการแก้ไข");
            return;
        }
        if (this.requestOpenSendSerice) {
            const SendData = {
                CASE_ID:this.dataForm.Submission.backendId ?? null,
                REQUEST_DETAIL:this.requestTextByUser,
            };

            if(SendData.CASE_ID){
                this._onlineCaseServ.CreateOnlineRequest(SendData).subscribe(()=>{
                    this.ShowSuccessDialog();
                });
            }
        }else{
            this.ShowInvalidDialog("ผิดพลาดไม่สามารถส่งเรื่องที่ต้องการแก้ไขได้");
            return;
        }

    }
    // // eslint-disable-next-line @typescript-eslint/member-ordering
    // toolbarContent = [{
    //     widget: 'dxButton',
    //     location: 'before',
    //     options: {
    //         icon: 'menu',
    //         onClick: () => {
    //             this.isDrawerOpen = !this.isDrawerOpen;
    //             // console.log('this.isDrawerOpen',this.isDrawerOpen);
    //         },
    //     },
    // }];
}
