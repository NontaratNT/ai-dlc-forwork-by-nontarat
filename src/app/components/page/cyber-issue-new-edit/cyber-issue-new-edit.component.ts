import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormConfigService, FormSubmitService, IFormConfig, IFormSubmitInfo } from "eform-share";
import { finalize } from "rxjs/operators";
import { req } from "share-ui";
import { BpmProcinstService } from "src/app/services/bpm-procinst.service";
import { OnlineCaseService } from "src/app/services/online-case.service";
@Component({
    selector: "app-cyber-issue-new-edit",
    templateUrl: "./cyber-issue-new-edit.component.html",
    styleUrls: ["./cyber-issue-new-edit.component.scss"],
})
export class CyberIssueNewEditComponent implements OnInit {
    _instId: number;
    _isLoading = false;
    _formDataConfig: IFormConfig;
    _formioId: string;
    _documentId: string;
    _wfinsId: string;
    isLoading = true;
    dataForm: any = {};
    loadTab = false;
    constructor(
        private _formConfigServ: FormConfigService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private bpmProcinstServ: BpmProcinstService,
        private _onlineCaseServ: OnlineCaseService,
        private _formSubmitService: FormSubmitService,
        private _formConfigService: FormConfigService
    ) {}

    ngOnInit(): void {
        this._instId = this.activeRoute.snapshot.params.instId;
        this.loaddata(this._instId);
    }
    loaddata(id){
        if (id) {
            this.bpmProcinstServ.getByInstId(id).subscribe(res=>{
                this._wfinsId = res.WF_INSTANCE_ID;
                this._formioId = res.FORM_IO_ID;
                this._documentId =res.DOCUMENT_ID;

                this._formConfigService.get(res.FORM_IO_ID).subscribe((resdata)=>{
                    this._formDataConfig = resdata;
                    this.loadSubmission();
                });

            });
        }
    }
    loadSubmission() {
        if (!this._formDataConfig.apiLoad) {
            this._formSubmitService.getSubmission(this._formDataConfig.formType).get(this._formioId, this._documentId)
                .subscribe(res => {
                    this.dataForm = {
                        InstId:this._instId,
                        ProcessInstanceId:this._wfinsId,
                        Submission:res,
                    };
                    // console.log('this.dataForm',this.dataForm);
                    this.isLoading = false;
                    this.loadTab = true;
                });
        }
    }
}
