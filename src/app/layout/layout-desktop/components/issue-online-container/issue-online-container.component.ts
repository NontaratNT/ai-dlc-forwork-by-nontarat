import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BpmMdmFlowService } from "src/app/services/bpm-mdm-flow.service";
import { BpmProcinstService } from "src/app/services/bpm-procinst.service";
import { GroupStatusService } from "src/app/services/group-status.service";

import { environment } from "src/environments/environment";
import { IssueOnlineAgreeComponent } from "./issue-online-agree/issue-online-agree.component";
import { IssueOnlineAttachmentComponent } from "./issue-online-attachment/issue-online-attachment.component";
import { IssueOnlineDamageComponent } from "./issue-online-damage/issue-online-damage.component";
import { IssueOnlineEventComponent } from "./issue-online-event/issue-online-event.component";
import { IssueOnlineInformerComponent } from "./issue-online-informer/issue-online-informer.component";
import { IssueOnlineVillainComponent } from "./issue-online-villain/issue-online-villain.component";
import { IssueOnlineValidateComponent } from "./issue-online-validate/issue-online-validate.component";
@Component({
    selector: "app-issue-online-container",
    templateUrl: "./issue-online-container.component.html",
    styleUrls: ["./issue-online-container.component.scss"],
})
export class IssueOnlineContainerComponent implements OnInit {
    // @ViewChild(IssueOnlineAgreeComponent, { static: true }) agreeComponent: IssueOnlineAgreeComponent;
    @ViewChild(IssueOnlineAgreeComponent) set content(content1: IssueOnlineAgreeComponent) {
        if(content1) {
            this.agreeComponent = content1;
            this.agreeComponent.mainConponent = this;
            this.indexLocker.agreeComponent = true;

        }
    }
    @ViewChild(IssueOnlineInformerComponent) set content2(content2: IssueOnlineInformerComponent) {
        if(content2) {
            this.informerConponent = content2;
            this.informerConponent.mainConponent = this;
            this.indexLocker.informerConponent = true;

        }
    }
    @ViewChild(IssueOnlineEventComponent) set content3(content3: IssueOnlineEventComponent) {
        if(content3) {

            this.eventConponent = content3;
            this.eventConponent.mainConponent = this;
            this.indexLocker.eventConponent = true;

        }
    }
    @ViewChild(IssueOnlineDamageComponent) set content4(content4: IssueOnlineDamageComponent) {
        if(content4) {
            this.damageConponent = content4;
            this.damageConponent.mainConponent = this;
            this.indexLocker.damageConponent = true;

        }
    }
    @ViewChild(IssueOnlineVillainComponent) set content5(content5: IssueOnlineVillainComponent) {
        if(content5) {
            this.vaillainConponent = content5;
            this.vaillainConponent.mainConponent = this;
            this.indexLocker.vaillainConponent = true;

        }
    }
    @ViewChild(IssueOnlineAttachmentComponent) set content6(content6: IssueOnlineAttachmentComponent) {
        if(content6) {
            this.attachmentConponent = content6;
            this.attachmentConponent.mainConponent = this;
            this.indexLocker.attachmentConponent = true;

        }
    }
    @ViewChild(IssueOnlineValidateComponent) set content7(content7: IssueOnlineValidateComponent) {
        if(content7) {
            this.validateConponent = content7;
            this.validateConponent.mainConponent = this;
            this.indexLocker.validateConponent = true;

        }
    }
    @Input() dataForm: any;
    @Input() public userType = "mySelf";

    public indexTab = 0;
    public formDataInsert: any = {};
    public formType = 'add';
    public agreeComponent: IssueOnlineAgreeComponent;
    public informerConponent: IssueOnlineInformerComponent;
    public eventConponent: IssueOnlineEventComponent;
    public damageConponent: IssueOnlineDamageComponent;
    public vaillainConponent: IssueOnlineVillainComponent;
    public attachmentConponent: IssueOnlineAttachmentComponent;
    public validateConponent: IssueOnlineValidateComponent;
    public caseId: number;
    public InstId: string;
    public ProcessInstanceId: string;
    loadPageSuccess = false;
    isLoading = true;
    countFlow = 0;
    indexLocker: any = {};
    dataTest: any = {};
    stepNavigation = [
        {text:"ข้อความยินยอม",textClass:"arrow-div arrow-first"},
        {text:"ข้อมูลผู้เสียหาย",textClass:"arrow-div arrow-center"},
        {text:"เรื่องที่เกิดขึ้น",textClass:"arrow-div arrow-center"},
        {text:"ความเสียหาย",textClass:"arrow-div arrow-center"},
        {text:"ข้อมูลคนร้าย",textClass:"arrow-div arrow-center"},
        {text:"แนบไฟล์เพิ่มเติม",textClass:"arrow-div arrow-center"},
        {text:"ยืนยันความถูกต้อง",textClass:"arrow-div arrow-end"}
    ];
    stepNavigationZindex = 100;
    stepNavigationWidth = 1330;
    public formDataAll: any = {};

    constructor(
        private _router: Router,
        private _flowServ: BpmMdmFlowService,
        private _groupStatusServ: GroupStatusService,
        private _bpmProcinstServ: BpmProcinstService,
        private _activeRoute: ActivatedRoute,

    ) {}

    ngOnInit(): void {

        if (this.dataForm) {

            this.formType = 'edit';
            this.isLoading = false;
            const d = this.dataForm;
            this.formDataInsert = d.Submission;
            this.InstId = d.InstId;
            this.ProcessInstanceId = d.ProcessInstanceId;
            this.caseId = d.Submission.backendId;
            this.stepNavigation = [
                {text:"ข้อมูลผู้เสียหาย",textClass:"arrow-div arrow-first"},
                {text:"เรื่องที่เกิดขึ้น",textClass:"arrow-div arrow-center"},
                {text:"ความเสียหาย",textClass:"arrow-div arrow-center"},
                {text:"เกี่ยวกับคนร้าย",textClass:"arrow-div arrow-end"}
            ];
            this.stepNavigationWidth = 850;
        }else{
            this.SetFormInit();
        }

    }
    GetzIndexTab(index: number = 0){
        return this.stepNavigationZindex-index;
    }
    SetFormInit(){
        this.formDataInsert.FORM_CODE = "CCIB_NOTIFY_PEOPLE@0.1";
        this.formDataInsert.env = environment.config.baseConfig;
        this.formDataInsert.CASE_TYPE_ID = 1;
        this.formDataInsert.CASE_FLAG = "O";
        this.formDataInsert.CASE_SELF_TYPE = (this.userType === "mySelf")?"Y":"N";
        // public agreeComponent: IssueOnlineAgreeComponent;
        // public informerConponent: IssueOnlineInformerComponent;
        // public eventConponent: IssueOnlineEventComponent;
        // public damageConponent: IssueOnlineDamageComponent;
        // public vaillainConponent: IssueOnlineVillainComponent;
        // public attachmentConponent: IssueOnlineAttachmentComponent;
        // public validateConponent: IssueOnlineValidateComponent;
        this.formDataAll = {
            DataDamageShow:{},
            formInformer:{},
            formEvent:{},
            formDamage:{},
            formVaillain:{},
            formAttachment:{},
            formConfigs:{
                FORM_CODE: "CCIB_NOTIFY_PEOPLE@0.1",
                env: environment.config.baseConfig,
                CASE_FLAG: "O",
                CASE_SELF_TYPE: (this.userType === "mySelf")?"Y":"N",
            },
        };
    }
    goUrl(url = 'main/tasklist'){
        this._router.navigate([url]);
    }
    SelectorTab(index){
        return this.indexTab >= index ? 'arrow-selected':'arrow-default';
    }
    public NextIndex(index: number = 0){
        this.indexTab = index;
        const countItem = this.stepNavigation.length;
        if (index === (countItem-1) && this.indexLocker.validateConponent) {
            this.validateConponent.ReloadData();
        }
    }
    CheckNextIndex(index: number = 0){

        // if (index === 1 && !this.indexLocker.informerConponent) {
        //     return;
        // }else if (index === 2 && !this.indexLocker.villainConponent) {
        //     return;
        // }else if (index === 3 && !this.indexLocker.contactConponent) {
        //     return;
        // }else if (index === 4 && !this.indexLocker.ValidateConponent) {
        //     return;
        // }
        this.indexTab = index;
        const countItem = this.stepNavigation.length;
        if (index === (countItem-1) && this.indexLocker.validateConponent) {
            this.validateConponent.ReloadData();
        }
    }
    testCheckNextIndex(index: number = 0){
        this.indexTab = index;
    }
    SelectTabIndex(index: number = 0){
        if (this.formType === 'edit') {
            this.indexTab = index;
        }
    }
    public MergeObj(formData){
        this.formDataInsert = Object.assign({},this.formDataInsert,formData);
        return this.formDataInsert;
    }
    CheckDataForm(){
        // console.log('this.formDataInsert->>>>',this.formDataInsert);
        // console.log('this.formDataInsert->>>>', JSON.stringify(this.formDataInsert));

    }
    tetData(){
        // console.log('this.dataTest',this.dataTest);
    }
}
