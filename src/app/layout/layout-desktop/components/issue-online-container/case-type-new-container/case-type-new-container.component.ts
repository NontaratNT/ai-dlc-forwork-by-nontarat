import { CheckDocumentService } from "../../../../../services/check-document.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { finalize } from "rxjs/operators";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { RecaptchaErrorParameters } from "ng-recaptcha";
import { SubmissionResult } from "eform-share";
import { FormConfigService } from "src/app/services/form-service/form-config.service";
import { DxFormComponent } from "devextreme-angular";
import { FormValidatorService } from "src/app/services/form-validator.service";
import { ConvertDateService } from "src/app/services/convert-date.service";
import { IssueOnlineContainerComponent } from "../issue-online-container.component";

@Component({
    selector: "app-case-type-new-container",
    templateUrl: "./case-type-new-container.component.html",
    styleUrls: ["./case-type-new-container.component.scss"],
})
export class CaseTypeNewContainerComponent implements OnInit {
    public mainConponent: IssueOnlineContainerComponent;
    @ViewChild("formInformer1", { static: false })
    formInformer1: DxFormComponent;
    @ViewChild("formInformer2", { static: false })
    formInformer2: DxFormComponent;
    @ViewChild("formInformer3", { static: false })
    formInformer3: DxFormComponent;
    @ViewChild("formInformer4", { static: false })
    formInformer4: DxFormComponent;
    @ViewChild("formInformer5", { static: false })
    formInformer5: DxFormComponent;
    @ViewChild("formInformerOther", { static: false })
    formInformerOther: DxFormComponent;
    @ViewChild("formInformeraddresspolice", { static: false })
    formInformeraddresspolice: DxFormComponent;
    @ViewChild("formInformertype2", { static: false })
    formInformertype2: DxFormComponent;
    @ViewChild("formInformertype3", { static: false })
    formInformertype3: DxFormComponent;

    @ViewChild("formInformertype1", { static: false })
    formInformertype1: DxFormComponent;
    @ViewChild("formInformer2address", { static: false })
    formInformer2address: DxFormComponent;

    _formConfig: any = {};
    _formBuilded: any = {};
    _formData: any = {};
    _formRenderType: string = "IO"; // IO | BUILDER
    formType = "add";
    formData: any = {};

    constructor(
        private _formConfigService: FormConfigService,
        private _formValidate: FormValidatorService,
        private router: Router,
        private _date: ConvertDateService
    ) {}

    async ngOnInit(): Promise<void> {

        console.log('maincomponent', this.mainConponent);
        this._formConfig = await this._formConfigService
            .GetId("691d6f6a26109f6b7c05aae2")
            .toPromise()
            .then((_) => _ ?? {});
        this._formBuilded = JSON.parse(this._formConfig.formJson);
        //       if (this._formRenderType === "IO") {
        //     this._formData = {
        //         data: this.submitionData ?? {},
        //     };
        // }

        console.log("formbuilded", this._formBuilded);
        this._formData = {
            data: {
                containerpage2: {
                    sumaryContainer: {
                        personal_fullname: "สมชาย ใจดี",
                        personal_citizennumber2: "1234567890123",
                        personal_phone_number: "0812345678",
                    },
                },
            },
        };
    }

    async onSave(e) {
        // const isConfirm = await ConfirmSave();
        // if (!isConfirm) {
        //     return;
        // }

        if (this._formRenderType === "IO") {
            this._formData = e.data;
        }
        Swal.fire({
            title: "",
            text: `ระบบได้รับเรื่องของท่านเรียบร้อยแล้ว`,
            icon: "success",
            confirmButtonText: "ตกลง",
        }).then(() => {});
        return;
    }

    SubmitForm(e) {
        console.log(this._formBuilded);
        console.log(this._formData);
        return;
        if (this.mainConponent.formType === "add") {
            this.formInformer1.instance.validate();
            if (!this.formInformer1.instance.validate().isValid) {
                this._formValidate.ValidateForm(
                    this.formInformer1.instance.validate().brokenRules
                );
                this.mainConponent.checkValidate = true;
                return;
            }
            if (!this.formInformer2.instance.validate().isValid) {
                this._formValidate.ValidateForm(
                    this.formInformer2.instance.validate().brokenRules
                );
                this.mainConponent.checkValidate = true;
                return;
            }
            if (!this.formInformer2address.instance.validate().isValid) {
                this._formValidate.ValidateForm(
                    this.formInformer2address.instance.validate().brokenRules
                );
                this.mainConponent.checkValidate = true;
                return;
            }

            this.formData.CASE_INFORMER_FIRSTNAME = this.NameSanitize(
                this.formData.CASE_INFORMER_FIRSTNAME
            );
            this.formData.CASE_INFORMER_LASTNAME = this.NameSanitize(
                this.formData.CASE_INFORMER_LASTNAME
            );
            this.formData.INFORMER_EMAIL = this.EmailSanitize(
                this.formData.INFORMER_EMAIL
            );
            this.formData.INFORMER_TEL = this.PhoneNumberSanitize(
                this.formData.INFORMER_TEL
            );
            this.mainConponent.checkValidate = false;
            this.mainConponent.formDataAll.formInformer = {};
            this.formData.CASE_INFORMER_DATE = this._date.ConvertToDateFormat(
                this.formData.CASE_INFORMER_DATE
            );
            if (
                this.formData.CASE_INFORMER_DATE == "Invalid date" ||
                undefined ||
                null
            ) {
                this.alertmessagecustom("กรุณาเลือกวันเดือนปีเกิด");
                return;
            }
            if (this.formData.INFORMER_TEL_PROVIDER === "อื่น ๆ") {
                this.formData.INFORMER_TEL_PROVIDER =
                    this.formData.INFORMER_TEL_PROVIDER_DETAIL;
            }
            this.formData.NEXT = true;
            const setData = {};
            for (const key in this.formData) {
                if (
                    this.formData[key] !== null &&
                    this.formData[key] !== undefined
                ) {
                    setData[key] = this.formData[key];
                }
            }
            this.mainConponent.formDataAll.formInformer = setData;
            localStorage.setItem("form-informer", JSON.stringify(setData));
        }
        if (e != "tab") {
            this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
        }
    }

    /* SANITIZE */
    NameSanitize(_value) {
        return _value.replace(/([^A-Za-zก-๏]|^(นาย |นางสาว |นาง ))/g, "");
    }
    EmailSanitize(_value) {
        if (_value) {
            return _value.replace(/[^a-zA-Z0-9@._-]/g, "");
        } else {
        }
    }
    PhoneNumberSanitize(_value) {
        return _value.replace(/[^0-9]/g, "");
    }

    Back(e) {
            this.mainConponent.NextIndex(this.mainConponent.indexTab - 1);
    }
    BackToList(e) {
        this.router.navigate(["/main/task-list"]);
    }

     alertmessagecustom(msg) {
            Swal.fire({
                title: "ผิดพลาด!",
                text: msg ?? "กรุณากรอกข้อมูล",
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => { });
            this.mainConponent.checkValidate = true;
            return;
        }
}
