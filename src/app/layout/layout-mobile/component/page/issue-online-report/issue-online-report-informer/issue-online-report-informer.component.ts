import { Component, OnInit, ViewChild } from "@angular/core";
import { IssueOnlineReportComponent } from "../issue-online-report.component";
import { PersonalService } from "src/app/services/personal.service";
import { User } from "src/app/services/user";
import { DxFormComponent } from "devextreme-angular";
import Swal from "sweetalert2";

@Component({
    selector: "app-issue-online-report-informer",
    templateUrl: "./issue-online-report-informer.component.html",
    styleUrls: ["./issue-online-report-informer.component.scss"],
})
export class IssueOnlineReportInformerComponent implements OnInit {
    @ViewChild("formInformer") formInformer: DxFormComponent;
    public mainConponent: IssueOnlineReportComponent;

    formReadOnly: false;
    checkothertitle = false;
    formData: any = {};
    personalInfo: any = {};
    isLoading = false;
    cmstitle = [
        { TITLE_ID: "นาย", TITLE_NAME: "นาย" },
        { TITLE_ID: "นาง", TITLE_NAME: "นาง" },
        { TITLE_ID: "นางสาว", TITLE_NAME: "นางสาว" },
        { TITLE_ID: "อื่นๆ", TITLE_NAME: "อื่นๆ" },
    ];

    constructor(private servicePersonal: PersonalService) {}

    ngOnInit(): void {
        setTimeout(() => {
            const userId = User.Current.PersonalId;
            this.isLoading = true;
            this.servicePersonal.GetPersonalById(userId).subscribe(
                (personalInfo) => {
                    this.personalInfo = personalInfo;
                    this.setPersonalData();
                },
                (error) => {
                    if (error.status === 500 || error.status === 524) {
                        this.mainConponent.checkReload(1);
                    }
                }
            );
        }, 200);
    }

    setPersonalData() {
        this.formData = {
            TITLE_NAME: this.personalInfo.TITLE_NAME,
            TITLE_ID: this.personalInfo.TITLE_NAME,
            PERSONAL_FIRST_NAME: this.personalInfo.PERSONAL_FNAME_THA,
            PERSONAL_LAST_NAME: this.personalInfo.PERSONAL_LNAME_THA,
            PERSONAL_TEL_NO: this.personalInfo.PERSONAL_TEL_NO,
        };
    }

    NameValidator(event) {
        const makeScope = new RegExp("^[ก-๏]", "g");
        const result = makeScope.test(event.key);
        return result;
    }

    NamePattern(params) {
        const seperator = new RegExp("^(นาย |นางสาว |นาง )", "g");
        const matched = params.value.match(seperator);
        return !matched;
    }

    ChangeRadioTitle(e) {
        if (e.value) {
            setTimeout(() => {
                if (e.value == "อื่นๆ") {
                    this.checkothertitle = true;
                    if (!this.formData.TITLE_NAME) {
                        this.formData.TITLE_NAME = "";
                    }
                } else {
                    this.checkothertitle = false;
                    this.formData.TITLE_NAME = e.value;
                }
            }, 500);
        }
    }

    PhoneNumberPattern(params) {
        const makeScope = new RegExp("^[0](?=[0-9]{9,9}$)", "g");
        return makeScope.test(params.value);
    }

    CheckNumber(event) {
        const seperator = "^([0-9])";
        const maskSeperator = new RegExp(seperator, "g");
        const result = maskSeperator.test(event.key);
        return result;
    }

    PasteCheckNumber(event) {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData.getData("text");
        const seperator = "^([0-9])";
        const maskSeperator = new RegExp(seperator, "g");
        const result = maskSeperator.test(pastedText);
        return result;
    }

    SubmitForm(e) {
        if (!this.formInformer.instance.validate().isValid) {
            const errorMessage =
                this.formInformer.instance.validate().brokenRules[0];
            Swal.fire({
                icon: "warning",
                title: "กรอกข้อมูลไม่ครบ",
                html: `${errorMessage.message}`,
            }).then((result) => {
                if (result.isConfirmed) {
                    return;
                }
            });
            return;
        }
        this.mainConponent.formInsert.formInformer = Object.assign(
            {},
            this.formData
        );
        this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
    }
}
