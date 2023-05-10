import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  FormConfigService, FormioRenderComponent, FormSubmitService, IFormConfig, IFormSubmitInfo, SubmissionResult } from 'eform-share';
import { zip } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Dialog, req } from 'share-ui';
import { OnlineCaseParam } from 'src/app/common/@type/online-case';
import { BpmProcinstService } from 'src/app/services/bpm-procinst.service';
import { OnlineCaseService } from 'src/app/services/online-case.service';
import { TaskInfoShare } from 'src/app/services/task-info-share.service';
import { BusinessKey } from 'src/app/common/business-key';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-submission-view',
    templateUrl: './submission-view.component.html',
    styleUrls: ['./submission-view.component.scss'],
    providers: [TaskInfoShare]
})
export class SubmissionViewComponent implements OnInit {
    @ViewChild("formData") _formData: FormioRenderComponent;
    @ViewChild(FormioRenderComponent, { static: true }) _formRender: FormioRenderComponent;
    _formDataConfig: IFormConfig;
    _instId: number;
    _wfinsId: string;
    _documentId: string;
    _caseId: number;
    _formioId: string;
    _formName: string;
    _dataId: number;
    constructor(
        private _formConfigServ: FormConfigService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private bpmProcinstServ: BpmProcinstService,
        private _onlineCaseServ: OnlineCaseService,
        private _dialog: Dialog,
        private _formSubmitService: FormSubmitService,
        private _taskInfoShard: TaskInfoShare,
        private _formConfigService: FormConfigService) {
        this.beforeSubmit = this.beforeSubmit.bind(this);
    }

    ngOnInit(): void {
        this._instId = this.activeRoute.snapshot.params.instId;
        this.loaddata(this._instId);
    }
    loaddata(id){
        if (id) {
            this.bpmProcinstServ.getByInstId(id).subscribe(res=>{
                this._wfinsId = res.WF_INSTANCE_ID;
                this._documentId =res.DOCUMENT_ID;
                this._formioId = res.FORM_IO_ID;
                this._formName = res.FORM_NAME;
                this._dataId = res.DATA_ID;
                // this._taskInfoShard.businessKey = new BusinessKey(res.DATA_ID, res.INST_ID, res.DOCUMENT_ID, res.FORM_IO_ID);
                this._formConfigService.get(res.FORM_IO_ID).subscribe((resdata)=>{
                    this._formDataConfig = resdata;
                    this.loadSubmission();
                    // const formConfigRequest = zip(
                    //     this._formConfigServ.find({ formCode: resdata.formCode, formVersion: resdata.formVersion })
                    // );
                    // formConfigRequest.subscribe(([formData]) => {
                    //     this._formDataConfig = formData[0];
                    //     this.f();
                    // });
                });

            });
        }
    }
    loadSubmission() {
        if (this._formDataConfig.apiLoad) {
            req<IFormSubmitInfo>(this._formDataConfig.apiLoad)
                .queryString({ backendId: this._dataId })
                .get().subscribe(_ => {
                    this._formData.setFormConfig(this._formDataConfig, _);
                });
        }
        else {
            this._formSubmitService.getSubmission(this._formDataConfig.formType).get(this._formioId,
                this._documentId)
                .subscribe(_ => {
                    _.isEdit = true;
                    _.isRead = false;
                    _.isCloseTabAgree = true;
                    _.env = environment.config.baseConfig;
                    this._formData.setFormConfig(this._formDataConfig, _).then(() => this._formRender.formio.formio.redraw());
                });

        }
    }

    onDataFormReady() {
        // INFO: isEdit เป็นการบอก formio ว่าจะเป็ฯการแก้ไขเพื่อเอาไว้ซ่อน หน้า consent กับ ปุ่มยืนยัน;
    }

    hiddenComponentIfNeed() {
        if (!this._formData.formio.form?.components) {
            return;
        }

        const components = this._formData.formio.form?.components;
        for (const c of components) {
            if (c.key === "pageConsent") {
                c.hidden = true;
                break;
            }
        }
    }
    beforeSubmit(e) {
        let resolver: (value: SubmissionResult) => void;
        const p = new Promise<SubmissionResult>(_ => resolver = _);
        const data = Object.assign({}, e.data);
        // INFO: ต้อง set FORM_CODE ทุกครั้ง
        data.FORM_CODE = this._formRender._formConfig.formCode + "@" + this._formRender._formConfig.formVersion;
        data.FORM_DOCUMENT_ID = this._documentId;
        // INFO: เราจะไม่ส่งค่า isEditว
        data.isEdit = undefined;
        data.isRead = undefined;
        data.backendId = undefined;
        data._id = undefined;
        // Set เพื่อใช้ในการ Update
        const submission = {} as any;
        if(this._dataId){
            submission.Submission = data;
            submission.InstId = this._instId;
            submission.ProcessInstanceId = this._wfinsId;
        }
        const request = this._dataId ?
            this._onlineCaseServ.update(this._dataId, submission) :
            this._onlineCaseServ.create(data);

        this._formRender.loadingVisible = true;
        request
            .pipe(finalize(() => this._formRender.loadingVisible = false))
            .subscribe(_ => {
                if (_.IsSuccess) {
                    if (this._documentId) {
                        // this._dialog.info("สำเร็จ", "บักทึกข้อมูลสำเร็จ");
                        Swal.fire({
                            title: 'สำเร็จ!',
                            text: 'บันทึกข้อมูลสำเร็จ',
                            icon: 'success',
                            confirmButtonText: 'ตกลง'
                        }).then(() => {});
                    } else {
                        // this._dialog.info("สำเร็จ", "แจ้งเรื่องสำเร็จ").then(() => {
                        //     this.router.navigate(['/main/tasklist']);
                        // });
                        Swal.fire({
                            title: 'สำเร็จ!',
                            text: 'แจ้งเรื่องสำเร็จ',
                            icon: 'success',
                            confirmButtonText: 'ตกลง'
                        }).then(() => {
                            this.router.navigate(['/main/tasklist']);
                        });
                    }
                    resolver({ isSuccess: _.IsSuccess, message: undefined });
                } else {
                    resolver({ isSuccess: _.IsSuccess, message: _.Message });
                }
            }, () => resolver({ isSuccess: false, message: "เกิดปัญหาจากทาง Server กรุณาลองใหม่อีกครั้ง" }));
        // if(this._formName === "CCIB_NOTIFY_PEOPLE")
        // {
        //     const newData: Partial<OnlineCaseParam> = {};
        //     if (data.CASE_CHANNEL.length > 0) {
        //         newData.CASE_CHANNEL = data.CASE_CHANNEL.filter(p => !!p);
        //     }

        //     if (data.CASE_INFORMER_SOCIAL.length > 0) {
        //         newData.CASE_INFORMER_SOCIAL = data.CASE_INFORMER_SOCIAL.filter(p => !!p);
        //     }

        //     if (data.CASE_MONEY.length > 0) {
        //         newData.CASE_MONEY = data.CASE_MONEY.filter(p => !!p);
        //     }


        //     for (const key in data) {
        //         if (key !== "CASE_CHANNEL" && key !== "CASE_MONEY" && key !== "CASE_INFORMER_SOCIAL" && data[key]) {
        //             newData[key] = data[key];
        //         }
        //     }

        //     // INFO: ต้อง set FORM_CODE ทุกครั้ง
        //     newData.FORM_CODE = this._formRender._formConfig.formCode + "@" + this._formRender._formConfig.formVersion;
        //     newData.FORM_DOCUMENT_ID = this._documentId;

        //     const request = this._dataId ?
        //         this._onlineCaseServ.update(this._dataId, newData):
        //         this._onlineCaseServ.create(newData) ;

        //     this._formRender.loadingVisible = true;
        //     request
        //         .pipe(finalize(() => this._formRender.loadingVisible = false))
        //         .subscribe(_ => {
        //             if (_.IsSuccess) {
        //                 if (this._documentId) {
        //                     this._dialog.info("สำเร็จ", "บักทึกข้อมูลสำเร็จ");
        //                 } else {
        //                     this._dialog.info("สำเร็จ", "แจ้งเรื่องสำเร็จ").then(() => {
        //                     // this.router.navigate(['/mainside/inform-online-list']);
        //                         this.router.navigate(['/mainside/tasklist']);
        //                     });
        //                 }
        //                 resolver({isSuccess: _.IsSuccess, message: undefined});
        //             } else {
        //                 resolver({isSuccess: _.IsSuccess, message: _.Message});
        //             }
        //         }, () => resolver({isSuccess: false, message: "เกิดปัญหาจากทาง Server กรุณาลองใหม่อีกครั้ง"}));
        // }
        // else
        // {
        //     // INFO: ต้อง set FORM_CODE ทุกครั้ง
        //     data.FORM_CODE = this._formRender._formConfig.formCode + "@" + this._formRender._formConfig.formVersion;
        //     data.FORM_DOCUMENT_ID = this._documentId;

        //     const request = this._dataId ?
        //         this._onlineCaseServ.update(this._dataId, data) :
        //         this._onlineCaseServ.create(data);

        //     this._formRender.loadingVisible = true;
        //     request
        //         .pipe(finalize(() => this._formRender.loadingVisible = false))
        //         .subscribe(_ => {
        //             if (_.IsSuccess) {
        //                 if (this._documentId) {
        //                     this._dialog.info("สำเร็จ", "บักทึกข้อมูลสำเร็จ");
        //                 } else {
        //                     this._dialog.info("สำเร็จ", "ลงบันทึกประจำวันสำเร็จ").then(() => {
        //                     // this.router.navigate(['/mainside/inform-online-list']);
        //                         this.router.navigate(['/mainside/tasklist']);
        //                     });
        //                 }
        //                 resolver({ isSuccess: _.IsSuccess, message: undefined });
        //             } else {
        //                 resolver({ isSuccess: _.IsSuccess, message: _.Message });
        //             }
        //         }, () => resolver({ isSuccess: false, message: "เกิดปัญหาจากทาง Server กรุณาลองใหม่อีกครั้ง" }));
        // }


        return p;
    }
}
