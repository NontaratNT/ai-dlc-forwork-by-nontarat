import { PersonalService } from 'src/app/services/personal.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FormioRenderComponent, FormioRenderOptions, FormSubmitService, SubmissionResult } from 'eform-share';
import { finalize } from 'rxjs/operators';
import { Dialog } from 'share-ui';
import { OnlineCaseParam } from 'src/app/common/@type/online-case';
import { SubmissionMongo } from 'src/app/common/commontype';
import { OnlineCaseService } from 'src/app/services/online-case.service';
import { User } from 'src/app/services/user';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { BpmProcinstService } from 'src/app/services/bpm-procinst.service';
import { BpmMdmFlowService } from 'src/app/services/bpm-mdm-flow.service';
import { GroupStatusService } from 'src/app/services/group-status.service';

@Component({
    selector: 'app-cyber-journal',
    templateUrl: './cyber-journal.component.html',
    styleUrls: ['./cyber-journal.component.scss']
})
export class CyberJournalComponent implements OnInit {
    @ViewChild(FormioRenderComponent, { static: true }) _formRender: FormioRenderComponent;
    _documentId: string;
    _caseId: number;
    visibleBack = false;
    _readOnly = false;
    _countFlow = 0;
    _num;
    _fragment: string;
    popupVisible = false;
    _renderOptions: FormioRenderOptions = { breadcrumbSettings: { clickable: false } };
    constructor(
        private router: Router, private activeRoute: ActivatedRoute,
        private _onlineCaseServ: OnlineCaseService,
        private _personalServ: PersonalService,
        private bpmProcinstServ: BpmProcinstService,
        private _flowServ: BpmMdmFlowService,
        private groupStatusServ: GroupStatusService,
        private _dialog: Dialog, private _formSubmitService: FormSubmitService,
    ) {
        this.beforeSubmit = this.beforeSubmit.bind(this);
    }

    ngOnInit(): void {
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

        this._flowServ.gets()
            .subscribe(_s => {
                // console.log('loop _s= ', _s);
                this.groupStatusServ.get().subscribe(res => {
                    // console.log('loop _res= ', res);
                    for (const i of res) {
                        // console.log('loop _i= ', i);
                        this.bpmProcinstServ.getByFlowCode(i.GROUP_STATUS_CODE, _s[1].FLOW_CODE).subscribe(_ => {
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
            this._formSubmitService.getSubmission("D").get(e.formId, this._documentId).subscribe((_: OnlineCaseParam) => {
                this._caseId = (_ as unknown as SubmissionMongo).backendId;
                e.setDataSubmission(_);
            });
        } else {
            this._personalServ.GetPersonalById(User.Current.PersonalId).subscribe(data => {
                const formData = e.formio.formio.data;
                formData.env = environment.config.baseConfig;
                formData.CASE_INFORMER_FIRSTNAME = data.PERSONAL_FNAME_THA;
                formData.CASE_INFORMER_LASTNAME = data.PERSONAL_LNAME_THA;
                formData.CASE_INFORMER_DATE = data.PERSONAL_BIRTH_DATE;
                formData.CASE_INFORMER_ADDRESS_NO = data.PERSONAL_ADDRESS;
                formData.CASE_INFORMER_ADDRESS_MOO = data.PERSONAL_MOO;
                formData.INFORMER_ADDRESS_SOI = data.PERSONAL_SOI;
                formData.INFORMER_ADDRESS_STREET = data.PERSONAL_STREET;
                formData.INFORMER_PROVINCE = data.PROVINCE_ID;
                formData.INFORMER_DISTRICT_ID = data.DISTICT_ID;
                formData.INFORMER_SUB_DISTRICT_ID = data.SUB_DISTICT_ID;
                formData.INFORMER_POSTCODE_ID = data.POST_CODE;
                formData.INFORMER_EMAIL = data.PERSONAL_EMAIL;
                formData.INFORMER_TEL = data.PERSONAL_TEL_NO;
                formData.CASE_TYPE_ID = "1";
                e.setDataSubmission(formData);
                // e.setDataSubmission({
                //     CASE_INFORMER_FIRSTNAME: data.PERSONAL_FNAME_THA,
                //     CASE_INFORMER_LASTNAME: data.PERSONAL_LNAME_THA,
                //     CASE_INFORMER_DATE: data.PERSONAL_BIRTH_DATE,
                //     CASE_INFORMER_ADDRESS_NO: data.PERSONAL_ADDRESS,
                //     CASE_INFORMER_ADDRESS_MOO: data.PERSONAL_MOO,
                //     INFORMER_ADDRESS_SOI: data.PERSONAL_SOI,
                //     INFORMER_ADDRESS_STREET: data.PERSONAL_STREET,
                //     INFORMER_PROVINCE: data.PROVINCE_ID,
                //     INFORMER_DISTRICT_ID: data.DISTICT_ID,
                //     INFORMER_SUB_DISTRICT_ID: data.SUB_DISTICT_ID,
                //     INFORMER_POSTCODE_ID: data.POST_CODE,
                //     INFORMER_EMAIL: data.PERSONAL_EMAIL,
                //     INFORMER_TEL: data.PERSONAL_TEL_NO,
                //     CASE_TYPE_ID: "1"
                // });
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

        // INFO: ต้อง set FORM_CODE ทุกครั้ง
        data.FORM_CODE = this._formRender._formConfig.formCode + "@" + this._formRender._formConfig.formVersion;
        data.FORM_DOCUMENT_ID = this._documentId;

        const request = this._caseId ?
            this._onlineCaseServ.update(this._caseId, data) :
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
                        }).then(() => { });
                    } else {
                        // this._dialog.info("สำเร็จ", "ลงบันทึกประจำวันสำเร็จ").then(() => {
                        //     this.router.navigate(['/main/tasklist']);
                        // });
                        Swal.fire({
                            title: 'สำเร็จ!',
                            text: 'บันทึกข้อมูลสำเร็จ',
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

    Back() {
        if(this._fragment){
            this.router.navigateByUrl('/main/tasklist');
        }else{
            this.router.navigate(["/home"]);
        }
    }

    closeButtonOptions() {
        this.popupVisible = false;
    }
}
