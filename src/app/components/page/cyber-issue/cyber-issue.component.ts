import { PersonalService } from './../../../services/personal.service';
import { User } from './../../../services/user';
import { Dialog } from 'share-ui';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormioRenderComponent, FormSubmitService, SubmissionResult, FormioRenderOptions } from 'eform-share';
import { OnlineCaseParam } from 'src/app/common/@type/online-case';
import { OnlineCaseService } from 'src/app/services/online-case.service';
import { count, finalize } from 'rxjs/operators';
import { SubmissionMongo } from 'src/app/common/commontype';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { BpmProcinstService } from 'src/app/services/bpm-procinst.service';
import { GroupStatusService } from 'src/app/services/group-status.service';
import { BpmMdmFlowService } from 'src/app/services/bpm-mdm-flow.service';
import { ApplicationNotificationService } from 'src/app/services/application-notification.service';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-cyber-issue',
    templateUrl: './cyber-issue.component.html',
    styleUrls: ['./cyber-issue.component.scss']
})
export class CyberIssueComponent implements OnInit, OnDestroy {
    @ViewChild(FormioRenderComponent, { static: true }) _formRender: FormioRenderComponent;
    // visible = false;
    visibleBack = false;
    // visibleStart = false;
    popupVisible = false;
    _documentId: string;
    _caseId: number;
    _readOnly = false;
    _countFlow = 0;
    dataFlowcode: any;
    _fragment: string;
    _renderOptions: FormioRenderOptions = { breadcrumbSettings: { clickable: false } };
    _langSubscribe: Subscription;
    constructor(
        private router: Router, private activeRoute: ActivatedRoute,
        private _formSubmitService: FormSubmitService,
        private _onlineCaseServ: OnlineCaseService,
        private _personalServ: PersonalService,
        private bpmProcinstServ: BpmProcinstService,
        private _flowServ: BpmMdmFlowService,
        private groupStatusServ: GroupStatusService,
        private _appNotification: ApplicationNotificationService,
        private _dialog: Dialog) {
        this.beforeSubmit = this.beforeSubmit.bind(this);
    }


    ngOnDestroy(): void {
        this._langSubscribe?.unsubscribe();
    }
    // onGuideFacebookClicked
    ngOnInit(): void {

        this._langSubscribe = this._appNotification.languageChange.subscribe(lng => {
            this._formRender.language = lng;
        });

        this.activeRoute.fragment.subscribe(_ => {
            this._fragment = _;
            // console.log('_fragment',this._fragment);
        });
        this._documentId = this.activeRoute.snapshot.params.documentId;
        if (this._documentId) {
            this.visibleBack = false;
        }
        else {
            this.visibleBack = true;
        }
        // this._instId = User.Current.PersonalId;
        // console.log('userCurentId',this._instId);
        // console.log('userCurent',User.Current);
        this._flowServ.gets()
            .subscribe(_s => {
                // console.log('loop _s= ', _s);
                this.groupStatusServ.get().subscribe(res => {
                    // console.log('loop _res= ', res);
                    for (const i of res) {
                        // console.log('loop _i= ', i);
                        this.bpmProcinstServ.getByFlowCode(i.GROUP_STATUS_CODE, _s[0].FLOW_CODE).subscribe(_ => {
                            if (_ !== null) {
                                for (const y of _) {
                                    // console.log('loop __= ', y);
                                    if (y) {
                                        this._countFlow++;
                                        // console.log('this._countFlow', this._countFlow);
                                    }
                                }
                            }
                        });
                    }
                });
            });
    }



    onFormReady(e: FormioRenderComponent) {
        if (this._documentId) {
            this.hiddenComponentIfNeed();
            this._formSubmitService.getSubmission("D").get(e.formId, this._documentId).subscribe((_: OnlineCaseParam) => {
                this._caseId = (_ as unknown as SubmissionMongo).backendId;
                e.setDataSubmission(_);
            });

        } else {
            this._personalServ.GetPersonalById(User.Current.PersonalId).subscribe(data => {
                const formData = e.formio.formio.data;
                // console.log('formioData',data);
                formData.env = environment.config.baseConfig;
                formData.CASE_INFORMER_FIRSTNAME = data.PERSONAL_FNAME_THA;
                formData.CASE_INFORMER_LASTNAME = data.PERSONAL_LNAME_THA;
                formData.CASE_INFORMER_DATE = data.PERSONAL_BIRTH_DATE;
                formData.OCCUPATIONS_ID = data.OCCUPATION_ID;
                formData.CASE_INFORMER_ADDRESS_NO = data.PERSONAL_ADDRESS;
                formData.CASE_INFORMER_ADDRESS_MOO = data.PERSONAL_MOO;
                formData.INFORMER_ADDRESS_SOI = data.PERSONAL_SOI;
                formData.INFORMER_ADDRESS_STREET = data.PERSONAL_STREET;
                formData.INFORMER_PROVINCE = data.PROVINCE_ID;
                formData.INFORMER_DISTRICT_ID = data.DISTICT_ID;
                formData.INFORMER_SUB_DISTRICT_ID = data.SUB_DISTICT_ID;
                formData.INFORMER_POSTCODE_ID = data.POST_CODE;
                formData.WORK_ADDRESS_NO = data.WORK_ADDRESS_NO;
                formData.WORK_ADDRESS_MOO = data.WORK_ADDRESS_MOO;
                formData.WORK_ADDRESS_BUILDING = data.WORK_ADDRESS_BUILDING;
                formData.WORK_ADDRESS_SOI = data.WORK_ADDRESS_SOI;
                formData.WORK_ADDRESS_STREET = data.WORK_ADDRESS_STREET;
                formData.WORK_PROVINCE = data.WORK_PROVINCE;
                formData.WORK_DISTRICT_ID = data.WORK_DISTRICT_ID;
                formData.WORK_SUB_DISTRICT_ID = data.WORK_SUB_DISTRICT_ID;
                formData.WORK_POSTCODE_ID = data.WORK_POSTCODE_ID;
                formData.INFORMER_EMAIL = data.PERSONAL_EMAIL;
                formData.INFORMER_TEL = data.PERSONAL_TEL_NO;
                formData.CASE_TYPE_ID = "1";
                e.setDataSubmission(formData);
            });

        }
        this._formRender.formio.formio.on("nextPage", (info) => {
            if (info.page === 4) {
                this._formRender.setDataSubmission(this._formRender.formio.formio.data);
            } else if (info.page === 3) {
                this._dialog.info("ข้อพึงระวัง", "ระบบบริหารจัดการคดีอาชญากรรมทางเทคโนโลยี ไม่มีนโยบายสอบถามข้อมูลส่วนตัว เช่น " + '<br/>' +
                    "การเข้าใช้งานข้อมูลบัญชี" + '<br/>' +
                    "username และ password และ SMS OTP เป็นต้น" + '<br/>' +
                    "ไม่ว่าช่องทางโทรศัพท์, จดหมายอิเล็กทรอนิกส์ (E-mail), หรือช่องทางอื่นใด" + '<br/>' +
                    "*ดังนั้นกรุณาเก็บรักษาข้อมูลส่วนตัวของท่านไว้เป็นความลับ", "ดำเนินการต่อ");
            }
        });

        this._formRender.formio.formio.on("onGuideFacebookClicked", () => {
            this.popupVisible = true;
        });
    }

    beforeSubmit(e) {
        let resolver: (value: SubmissionResult) => void;
        const p = new Promise<SubmissionResult>(_ => resolver = _);
        const data = e.data;
        const newData: Partial<OnlineCaseParam> = {};
        if (data.CASE_CHANNEL.length > 0) {
            newData.CASE_CHANNEL = data.CASE_CHANNEL.filter(_ => !!_);
        }

        if (data.CASE_INFORMER_SOCIAL.length > 0) {
            newData.CASE_INFORMER_SOCIAL = data.CASE_INFORMER_SOCIAL.filter(_ => !!_);
        }

        if (data.CASE_MONEY.length > 0) {
            newData.CASE_MONEY = data.CASE_MONEY.filter(_ => !!_);
        }


        for (const key in data) {
            if (key !== "CASE_CHANNEL" && key !== "CASE_MONEY" && key !== "CASE_INFORMER_SOCIAL" && data[key]) {
                newData[key] = data[key];
            }
        }

        // INFO: ต้อง set FORM_CODE ทุกครั้ง
        newData.FORM_CODE = this._formRender._formConfig.formCode + "@" + this._formRender._formConfig.formVersion;
        newData.FORM_DOCUMENT_ID = this._documentId;

        const request = this._caseId ?
            this._onlineCaseServ.update(this._caseId, newData) :
            this._onlineCaseServ.create(newData);

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
                        }).then(() => { });
                    } else {
                        // this._dialog.info("สำเร็จ", "แจ้งเรื่องสำเร็จ").then(() => {
                        //     this.router.navigate(['/main/tasklist']);
                        // });
                        Swal.fire({
                            title: 'สำเร็จ!',
                            text: 'แจ้งเรื่องสำเร็จ เจ้าหน้าที่จะติดต่อกลับภายใน 24 ชม.',
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

        return p;
    }

    cancel() {
        this.router.navigate(["/main/tasklist"]);
    }

    closeButtonOptions() {
        this.popupVisible = false;
        // console.log(this.popupVisible);
    }

    hiddenComponentIfNeed() {
        if (!this._formRender.formio.form?.components) {
            return;
        }

        const components = this._formRender.formio.form?.components;
        for (const c of components) {
            if (c.key === "pageConsent") {
                c.hidden = true;
                break;
            }
        }
    }

    Back() {
        if(this._fragment){
            this.router.navigateByUrl('/main/tasklist');
        }else{
            this.router.navigate(["/home"]);
        }
    }
}
