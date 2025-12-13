import { CheckDocumentService } from "../../../../../services/check-document.service";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
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

    @Input() dataForm: any;

    _formConfig: any = {};
    _formBuilded: any = {};
    _formData: any = {};
    _formRenderType: string = "IO"; // IO | BUILDER
    formType: "add" | "edit" = "add";
    formData: any = {};

    showMessage: boolean = false;
    alertMessage: string = "";
    isFormValid: boolean = false;
    @ViewChild('formioPreview') formioPreview: any;

    constructor(
        private _formConfigService: FormConfigService,
        private router: Router
    ) {}

    async ngOnInit(): Promise<void> {
        console.log("maincomponent", this.mainConponent);
        this._formConfig = await this._formConfigService
            .GetCode("FORM_FRADULENT_PATTERN")
            .toPromise()
            .then((_) => _ ?? {});
        this._formBuilded = JSON.parse(this._formConfig.formJson);
        this._formBuilded = JSON.parse(this._formConfig.formJson);
        //       if (this._formRenderType === "IO") {
        //     this._formData = {
        //         data: this.submitionData ?? {},
        //     };
        // }

        console.log("formbuilded", this._formBuilded);
        this._formData = {
            data: {},
        };
        if (this.dataForm) {
            console.log(this.dataForm);
            this.formType = "edit";
            this._formData = this.dataForm;
            this._formBuilded?.components.forEach((component) => {
                component.disabled = true;
            });
        }
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

    async SubmitForm(e) {

        console.log("isFormValidsubmit", this.isFormValid);
        if (!this.isFormValid) {
            Swal.fire({
                title: "แจ้งเตือน!",
                text: "กรุณากรอกข้อมูลให้ครบถ้วน",
                icon: "warning",
                confirmButtonText: "ตกลง",
            }).then(() => {});
            return;
        }
        if (this.formData.data?.CASE_BEHAVIOR) {
            Swal.fire({
                title: "แจ้งเตือน!",
                text: "กรุณากรอกข้อมูลให้ครบถ้วน",
                icon: "warning",
                confirmButtonText: "ตกลง",
            }).then(() => {});
            return;
        }
        await this.processFraudData();
        console.log(this._formBuilded);
        console.log(this._formData);
        this.mainConponent.formDataAll.formCaseTypeNew = this._formData;
        localStorage.setItem(
            "form-case-type-new",
            JSON.stringify(this._formData)
        );
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
        }).then(() => {});
        this.mainConponent.checkValidate = true;
        return;
    }

    onFormChange(event: any): void {

        if (!event) return;

        if (!event.hasOwnProperty("isValid")) return;

        const formio = this.formioPreview?.formio;
        
        
        if (!formio) return;

        //check replace label employment_type_other
          const code = Number(event.data?.employment_and_benefits?.employment_type_code || 0);
  // ฟิลด์ที่ต้องเปลี่ยน label → ใส่ key ของ component นั้น
                const comp = formio.getComponent('employment_type_other');
                if (comp) {
                    if (code === 4) {
                    comp.component.label = 'โปรดระบุค่าธรรมเนียมที่แอบอ้าง';
                    } else {
                    comp.component.label = 'โปรดระบุชนิดของงาน';
                    }
                    // สำคัญมาก! ไม่งั้น label จะไม่เปลี่ยน
                    comp.redraw();
                }
                 //end check replace label employment_type_other
        const currentData = event.data ?? {};
        this.isFormValid = Boolean(event.isValid);

        // ตัวอย่าง logic เฉพาะ field
        // switch (currentData.fraud_chanel) {
        //     case 1:
        //         this.showMessage = false;
        //         this.alertMessage = "";
        //         break;

        //     case 2:
        //         this.showMessage = true;
        //         this.alertMessage =
        //             "ให้เปลี่ยนรหัสผ่านและติดต่อผู้ให้บริการแพลตฟอร์ม เพื่อความปลอดภัย";
        //         break;

        //     case 3:
        //         this.showMessage = true;
        //         this.alertMessage =
        //             "แสดงคำแนะนำและอาจนำทางไปยังแบบฟอร์มที่เกี่ยวข้องกับ พ.ร.บ. คอมพิวเตอร์ฯ โดยตรง";
        //         break;

        //     case 4:
        //         // logic
        //         break;
        // }
    }

    async processFraudData(): Promise<void> {
        // 1. ดึง data ออกมาใส่ตัวแปรเพื่อให้เรียกใช่ง่าย
        const data = this._formData?.data;

        // 2. Guard Clause: เช็คความถูกต้องของข้อมูล
        if (!data || data.fraud_chanel !== 1) {
            return;
        }

        // 3. กำหนดค่าเริ่มต้น (ใช้ตัวแปร data ที่ประกาศไว้)
        // สังเกตว่า fraud_chanel (ต้นทาง) map ไป fraud_channel (ปลายทาง)
        this._formData.fraud_channel = data.fraud_chanel;
        this._formData.fraud_code = data.fraud_code;
        this._formData.fraud_sub_code = data.fraud_sub_code;

        // 4. ใช้ Switch Case แยก Logic ตาม Code
        switch (data.fraud_code) {
            case 1:
                // บรรทัดนี้ลบออกได้เลย เพราะกำหนดไปแล้วด้านบนครับ
                // this._formData.fraud_sub_code = data.fraud_sub_code;

                this._formData.fraud_tactic_id =
                    data.fraud_sub_code1?.fraud_tactic_code;
                break;

            case 2:
                // ในฟังก์ชันนี้ต้องมั่นใจว่ามีการ overwrite fraud_sub_code ใหม่ถ้าจำเป็น
                await this.handleFraudCode2(data);
                break;

            case 3:
                await this.handleFraudCode3(data);
                break;

            case 4:
                await this.handleFraudCode4(data);
                break;
        }
    }

    // แยก Logic ของ Code 2 ออกมาเป็นฟังก์ชัน (Private Method)
    private async handleFraudCode2(data: any): Promise<void> {
        const subCode2 = data.fraud_sub_code2;

        if (subCode2.goods_and_service_flag == 1) {
            // กรณี Goods & Service Flag == 1
            this._formData.fraud_sub_code = subCode2?.is_buyer;

            if (subCode2?.is_buyer == 1) {
                // Logic การหา Tactic ID สำหรับ Buyer (ลดรูป If-Else)
                if (subCode2.is_buyer_paid_for_unsolicited_parcel == 1) {
                    this._formData.fraud_tactic_id = 5;
                } else if (subCode2.is_buyer_parcel_received == 1) {
                    this._formData.fraud_tactic_id = 4;
                } else if (subCode2.is_buyer_primary_purchase_channel == 1) {
                    this._formData.fraud_tactic_id = 3;
                } else if (subCode2.is_buyer_social_media_product_type == 1) {
                    this._formData.fraud_tactic_id = 1;
                } else if (subCode2.is_buyer_social_media_product_type == 2) {
                    this._formData.fraud_tactic_id = 2;
                }
            } else if (subCode2?.is_buyer == 2) {
                // กรณี Seller
                this._formData.fraud_tactic_id = subCode2.fraud_method;
            }
        } else if (subCode2.goods_and_service_flag == 2) {
            // กรณี Goods & Service Flag == 2
            this._formData.fraud_sub_code = 3;
            this._formData.fraud_tactic_id =
                subCode2?.payment_for_fake_service_code;
        }

        console.log(this._formData);
    }

    // แยก Logic ของ Code 3
    private async handleFraudCode3(data: any): Promise<void> {
        const romanceCode = data.romance_scam_type_code;
        this._formData.fraud_sub_code = romanceCode?.romance_scam_type_code;

        switch (romanceCode?.romance_scam_type_code) {
            case 1:
                // this._formData.fraud_tactic_id = data.fraud_sub_code3?.phishing_type; // Un-comment if needed
                break;
            case 2:
                this._formData.fraud_tactic_id =
                    romanceCode.impersonation_method_code?.impersonation_method_code;
                break;
            case 3:
                this._formData.fraud_tactic_id =
                    romanceCode.impersonated_organization_code?.impersonated_organization_code;
                break;
            case 4:
                // this._formData.fraud_tactic_id = romanceCode.other_method_code?.other_method_code; // Un-comment if needed
                break;
        }
    }

    // แยก Logic ของ Code 4
    private async handleFraudCode4(data: any): Promise<void> {
        const employment = data.employment_and_benefits;
        this._formData.fraud_sub_code =
            employment?.employment_and_benefits_code;

        switch (employment?.employment_and_benefits_code) {
            case 1:
                this._formData.fraud_tactic_id =
                    employment.employment_type_code;
                break;
            case 2:
                this._formData.fraud_tactic_id =
                    employment.fake_award_inheritance_claim_code;
                break;
            case 3:
                this._formData.fraud_tactic_id =
                    employment.loan_offer_scam_code;
                break;
        }
    }
}
