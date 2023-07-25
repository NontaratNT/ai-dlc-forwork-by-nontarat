import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { BpmMdmFlowService } from "src/app/services/bpm-mdm-flow.service";
import { BpmProcinstService } from "src/app/services/bpm-procinst.service";
import { GroupStatusService } from "src/app/services/group-status.service";

import { environment } from "src/environments/environment";
import { IssueOnlineAgreeComponent } from "./issue-online-agree/issue-online-agree.component";
import { IssueOnlineContactComponent } from "./issue-online-contact/issue-online-contact.component";
import { IssueOnlineDamageComponent } from "./issue-online-damage/issue-online-damage.component";
import { IssueOnlineInformerComponent } from "./issue-online-informer/issue-online-informer.component";
import { IssueOnlineValidateComponent } from "./issue-online-validate/issue-online-validate.component";
import { IssueOnlineVillainComponent } from "./issue-online-villain/issue-online-villain.component";

@Component({
    selector: "app-issue-online-container",
    templateUrl: "./issue-online-container.component.html",
    styleUrls: ["./issue-online-container.component.scss"],
})
export class IssueOnlineContainerComponent implements OnInit {
    // @ViewChild(IssueOnlineAgreeComponent, { static: true }) agreeComponent: IssueOnlineAgreeComponent;
    @ViewChild(IssueOnlineAgreeComponent) set content(
        content: IssueOnlineAgreeComponent
    ) {
        if (content) {
            this.agreeComponent = content;
            this.agreeComponent.mainConponent = this;
            this.indexLocker.agreeComponent = true;
        }
    }
    @ViewChild(IssueOnlineInformerComponent) set content1(
        content1: IssueOnlineInformerComponent
    ) {
        if (content1) {
            this.informerConponent = content1;
            this.informerConponent.mainConponent = this;
            this.indexLocker.informerConponent = true;
        }
    }
    @ViewChild(IssueOnlineVillainComponent) set content2(
        content2: IssueOnlineVillainComponent
    ) {
        if (content2) {
            this.villainConponent = content2;
            this.villainConponent.mainConponent = this;
            this.indexLocker.villainConponent = true;
        }
    }
    @ViewChild(IssueOnlineContactComponent) set content3(
        content3: IssueOnlineContactComponent
    ) {
        if (content3) {
            this.contactConponent = content3;
            this.contactConponent.mainConponent = this;
            this.indexLocker.contactConponent = true;
        }
    }
    @ViewChild(IssueOnlineDamageComponent) set content4(
        content4: IssueOnlineDamageComponent
    ) {
        if (content4) {
            this.damageConponent = content4;
            this.damageConponent.mainConponent = this;
            this.indexLocker.damageConponent = true;
        }
    }
    // @ViewChild(IssueOnlineValidateComponent) set content4(content4: IssueOnlineValidateComponent) {
    //     if(content4) {
    //         this.ValidateConponent = content4;
    //         this.ValidateConponent.mainConponent = this;
    //         this.indexLocker.ValidateConponent = true;

    //     }
    // }
    @Input() dataForm: any;
    // public indexTab = 0;
    public indexTab = 4;
    public formDataInsert: any = {};
    public formType = "add";
    public agreeComponent: IssueOnlineAgreeComponent;
    public informerConponent: IssueOnlineInformerComponent;
    public villainConponent: IssueOnlineVillainComponent;
    public contactConponent: IssueOnlineContactComponent;
    public damageConponent: IssueOnlineDamageComponent;
    // public ValidateConponent: IssueOnlineValidateComponent;
    public caseId: number;
    public InstId: string;
    public ProcessInstanceId: string;
    loadPageSuccess = false;
    isLoading = true;
    countFlow = 0;
    indexLocker: any = {};
    stepNavigation = [
        { text: "ข้อความยินยอม", textClass: "arrow-div arrow-first" },
        { text: "Questionare พรก.", textClass: "arrow-div arrow-first" },
        { text: "ข้อมูลผู้เสียหาย", textClass: "arrow-div arrow-center" },
        { text: "เรื่องที่เกิดขึ้น", textClass: "arrow-div arrow-center" },
        { text: "ความเสียหาย", textClass: "arrow-div arrow-center" },
        { text: "ข้อมูลคนร้าย", textClass: "arrow-div arrow-center" },
        { text: "แนบเอกสารเพิ่มเติม", textClass: "arrow-div arrow-center" },
        { text: "ยืนยันความถูกต้อง", textClass: "arrow-div arrow-end" },
    ];
    stepNavigationZindex = 100;
    constructor(
        private _router: Router,
        private _flowServ: BpmMdmFlowService,
        private _groupStatusServ: GroupStatusService,
        private _bpmProcinstServ: BpmProcinstService
    ) {}

    ngOnInit(): void {
        if (this.dataForm) {
            this.formType = "edit";
            this.isLoading = false;
            const d = this.dataForm;
            this.formDataInsert = d.Submission;
            this.InstId = d.InstId;
            this.ProcessInstanceId = d.ProcessInstanceId;
            this.caseId = d.Submission.backendId;
        } else {
            this.setFormInit();
        }
    }
    GetzIndexTab(index: number = 0) {
        return this.stepNavigationZindex - index;
    }
    setFormInit() {
        this.formDataInsert.FORM_CODE = "CCIB_NOTIFY_PEOPLE@0.1";
        this.formDataInsert.env = environment.config.baseConfig;
        this.formDataInsert.CASE_TYPE_ID = 1;
        this.formDataInsert.CASE_FLAG = "O";
    }
    goUrl(url = "main/tasklist") {
        this._router.navigate([url]);
    }
    SelectorTab(index) {
        return this.indexTab >= index ? "arrow-selected" : "arrow-default";
    }
    public NextIndex(index: number = 0) {
        this.indexTab = index;
        // if (index === 4) {
        //     this.ValidateConponent.reloadData();
        // }
    }
    CheckNextIndex(index: number = 0) {
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
        if (index === 4 && this.indexLocker.ValidateConponent) {
            // this.ValidateConponent.reloadData();
        }
    }
    testCheckNextIndex(index: number = 0) {
        this.indexTab = index;
    }
    public MergeObj(formData) {
        this.formDataInsert = Object.assign({}, this.formDataInsert, formData);
        return this.formDataInsert;
    }
}
