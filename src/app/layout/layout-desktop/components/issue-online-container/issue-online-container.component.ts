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
import { IssueOnlineBlessingComponent } from "./issue-online-blessing/issue-online-blessing.component";
import { IssueOnlineQuestionareComponent } from "./issue-online-questionare/issue-online-questionare.component";
import { ProvinceService } from "src/app/services/province.service";
import Swal from "sweetalert2";
import { IssueOnlineCheckComponent } from "./issue-online-check/issue-online-check.component";
import { Platform } from "@angular/cdk/platform";
import { browser } from "protractor";
import { Observable } from "rxjs";
import { IssueOnlineCriminalContatInfoComponent } from "./issue-online-criminal-contact-info/issue-online-criminal-contact-info.component";
import { OnlineCaseService } from "src/app/services/online-case.service";
import { User } from "src/app/services/user";
import { CaseTypeNewContainerComponent } from "./case-type-new-container/case-type-new-container.component";
import { IssueOnlineDamageNewComponent } from "./issue-online-damage-new/issue-online-damage-new.component";
import { IssueOnlineValidateNewComponent } from "./issue-online-validate-new/issue-online-validate-new.component";
@Component({
    selector: "app-issue-online-container",
    templateUrl: "./issue-online-container.component.html",
    styleUrls: ["./issue-online-container.component.scss"],
})
export class IssueOnlineContainerComponent implements OnInit {
    // @ViewChild(IssueOnlineAgreeComponent, { static: true }) agreeComponent: IssueOnlineAgreeComponent;
    @ViewChild(IssueOnlineAgreeComponent) set content(
        content1: IssueOnlineAgreeComponent
    ) {
        if (content1) {
            this.agreeComponent = content1;
            this.agreeComponent.mainConponent = this;
            this.indexLocker.agreeComponent = true;
        }
    }
    @ViewChild(IssueOnlineBlessingComponent) set content8(
        content8: IssueOnlineBlessingComponent
    ) {
        if (content8) {
            this.blessingComponent = content8;
            this.blessingComponent.mainConponent = this;
            this.indexLocker.blessingComponent = true;
        }
    }

    @ViewChild(IssueOnlineQuestionareComponent) set content9(
        content9: IssueOnlineQuestionareComponent
    ) {
        if (content9) {
            this.questionareComponent = content9;
            this.questionareComponent.mainConponent = this;
            this.indexLocker.questionareComponent = true;
        }
    }
    @ViewChild(IssueOnlineInformerComponent) set content2(
        content2: IssueOnlineInformerComponent
    ) {
        if (content2) {
            this.informerConponent = content2;
            this.informerConponent.mainConponent = this;
            this.indexLocker.informerConponent = true;
        }
    }
    @ViewChild(IssueOnlineEventComponent) set content3(
        content3: IssueOnlineEventComponent
    ) {
        if (content3) {
            this.eventConponent = content3;
            this.eventConponent.mainConponent = this;
            this.indexLocker.eventConponent = true;
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
    @ViewChild(IssueOnlineVillainComponent) set content5(
        content5: IssueOnlineVillainComponent
    ) {
        if (content5) {
            this.vaillainConponent = content5;
            this.vaillainConponent.mainConponent = this;
            this.indexLocker.vaillainConponent = true;
        }
    }
    @ViewChild(IssueOnlineAttachmentComponent) set content6(
        content6: IssueOnlineAttachmentComponent
    ) {
        if (content6) {
            this.attachmentConponent = content6;
            this.attachmentConponent.mainConponent = this;
            this.indexLocker.attachmentConponent = true;
        }
    }
    @ViewChild(IssueOnlineValidateComponent) set content7(
        content7: IssueOnlineValidateComponent
    ) {
        if (content7) {
            this.validateConponent = content7;
            this.validateConponent.mainConponent = this;
            this.indexLocker.validateConponent = true;
        }
    }
    @ViewChild(IssueOnlineCriminalContatInfoComponent) set content10(
        content10: IssueOnlineCriminalContatInfoComponent
    ) {
        if (content10) {
            this.criminalContactInfo = content10;
            this.criminalContactInfo.mainConponent = this;
            this.indexLocker.criminalContactInfo = true;
        }
    }
    @ViewChild(IssueOnlineCheckComponent) set content0(
        content0: IssueOnlineCheckComponent
    ) {
        if (content0) {
            this.pagefirstConponent = content0;
            this.pagefirstConponent.mainConponent = this;
            this.indexLocker.pagefirstConponent = true;
        }
    }

     @ViewChild(CaseTypeNewContainerComponent) set contentcasetypenew(
        contentcasetypenew: CaseTypeNewContainerComponent
    ) {
        if (contentcasetypenew) {
             this.casetypenewConponent = contentcasetypenew;
            this.casetypenewConponent.mainConponent = this;
            this.indexLocker.casetypenewConponent = true;
        }
    }
    @ViewChild(IssueOnlineDamageNewComponent) set contentdamagenew(
        contentdamagenew: IssueOnlineDamageNewComponent
    ) {
        if (contentdamagenew) {
             this.damagenewConponent = contentdamagenew;
            this.damagenewConponent.mainComponent = this;
            this.indexLocker.damagenewConponent = true;
        }
    }
    @ViewChild(IssueOnlineValidateNewComponent) set contentvalidatenew(
        contentvalidatenew: IssueOnlineValidateNewComponent
    ) {
        if (contentvalidatenew) {
             this.validatenewConponent = contentvalidatenew;
            this.validatenewConponent.mainComponent = this;
            this.indexLocker.validatenewConponent = true;
        }
    }
    @Input() dataForm: any;
    @Input() public userType = "mySelf";

    public max = Number.MIN_VALUE;
    public indexTab = 0;
    public indexTabMain = 0;
    public formDataInsert: any = {};
    public formDataBankref: any = {};
    public formquestionnare1: any = {};
    public formType = "add";
    public agreeComponent: IssueOnlineAgreeComponent;
    public blessingComponent: IssueOnlineBlessingComponent;
    public questionareComponent: IssueOnlineQuestionareComponent;

    public informerConponent: IssueOnlineInformerComponent;
    public eventConponent: IssueOnlineEventComponent;
    public damageConponent: IssueOnlineDamageComponent;
    public vaillainConponent: IssueOnlineVillainComponent;
    public attachmentConponent: IssueOnlineAttachmentComponent;
    public validateConponent: IssueOnlineValidateComponent;
    public criminalContactInfo: IssueOnlineCriminalContatInfoComponent;
    public pagefirstConponent: IssueOnlineCheckComponent;
    public casetypenewConponent: CaseTypeNewContainerComponent;
    public damagenewConponent: IssueOnlineDamageNewComponent;
    public validatenewConponent: IssueOnlineValidateNewComponent;
    public caseId: number;
    public InstId: string;
    public ProcessInstanceId: string;
    public checkValidate: boolean;
    public province = [];
    loadPageSuccess = false;
    isLoading = true;
    countFlow = 0;
    indexLocker: any = {};
    dataTest: any = {};
    _ip: any;
    stepNavigation = [
        { text: "ข้อความยินยอม", textClass: "arrow-div arrow-first" },
        { text: "เกิดอะไรขึ้นกับคุณ", textClass: "arrow-div arrow-center" },
        { text: "ช่องทางและเครื่องมือของคนร้าย", textClass: "arrow-div arrow-center" },
        { text: "รายละเอียดความเสียหาย", textClass: "arrow-div arrow-center" },
        // { text: "เรื่องที่เกิดขึ้น", textClass: "arrow-div arrow-center" },
        // { text: "ความเสียหาย", textClass: "arrow-div arrow-center" },
        { text: "สรุปและส่งหลักฐาน", textClass: "arrow-div arrow-end"},
        // { text: "การรับแจ้งเหตุสำเร็จ", textClass: "arrow-div arrow-end" }
    ];
    stepNavigationOcpb = [
        {text:"ข้อความยินยอม",textClass:"arrow-div arrow-first"},
        {text:"ข้อมูลเรื่องร้องทุกข์",textClass:"arrow-div arrow-center"},
        {text:"ข้อมูลความเสียหาย",textClass:"arrow-div arrow-center"},
        {text:"ข้อมูลผู้ร้องทุกข์",textClass:"arrow-div arrow-center"},
        {text:"ยืนยันความถูกต้อง",textClass:"arrow-div arrow-end"}
    ];
    stepNavigationZindex = 100;
    stepNavigationWidth = 1985;
    public formDataAll: any = {};
    public nextPage = false;
    public isOCPB = false;
    

    constructor(
        private _router: Router,
        private _flowServ: BpmMdmFlowService,
        private _groupStatusServ: GroupStatusService,
        private _bpmProcinstServ: BpmProcinstService,
        private _activeRoute: ActivatedRoute,
        private serviceProvince: ProvinceService,
        private _onlineCaseServ: OnlineCaseService,
        private platform: Platform
    ) {}

    ngOnInit(): void {
        if (this.dataForm) {
            this.formType = "edit";
            this.isLoading = false;
            const d = this.dataForm;
            this.formDataInsert = d.Submission;
            this.InstId = d.InstId;
            this.ProcessInstanceId = d.ProcessInstanceId;
            this.stepNavigation = [
                {
                    text: "เลขอ้างอิงธนาคาร",
                    textClass: "arrow-div arrow-first",
                },
                {
                    text: "ข้อมูลผู้เสียหาย",
                    textClass: "arrow-div arrow-center",
                },
                {
                    text: "เรื่องที่เกิดขึ้น",
                    textClass: "arrow-div arrow-center",
                },
                { text: "ความเสียหาย", textClass: "arrow-div arrow-end" },
            ];
            this.stepNavigationWidth = 355 * this.stepNavigation.length;
            this.getProvince();
        } else {
            Swal.fire({
                icon: "warning",
                title: "คำแนะนำ",
                html: `หากท่านถูกหลอกให้โอนเงิน หรือพบความเสียหายทางการเงิน <b>ขอให้รีบ โทรสายด่วน 1441 ทันที</b> เพื่อดำเนินการ <b>อายัดบัญชีปลายทาง</b> ก่อนที่เงินจะถูกโอนต่อไปยังปลายทางอื่น<br>
                การแจ้งอย่างรวดเร็วจะช่วยเพิ่มโอกาสในการป้องกันความเสียหายและติดตามเงินคืนได้มากขึ้น`,
                allowOutsideClick: false,
                confirmButtonText: "รับทราบ",
            }).then(() => {
                Swal.fire({
                    icon: "info",
                    title: "แจ้งเตือน",
                    html: `ระบบได้ปรับปรุงคำถามเพื่อ <b>ความครบถ้วนของข้อมูล</b><br>
                    อาจมีการใช้เวลากรอกมากขึ้นเล็กน้อย <br>
                    ขอความร่วมมือกรอกข้อมูลอย่าง ถูกต้องและครบถ้วน <br>
                    ข้อมูลของท่านช่วยให้เจ้าหน้าที่ดำเนินงานได้ รวดเร็วและแม่นยำขึ้น <br>
                     <br>
                    <b>ขอบคุณทุกท่านสำหรับความร่วมมือ</b>`,
                    allowOutsideClick: false,
                    confirmButtonText: "รับทราบ",
                });
            });
            this.stepNavigationWidth = 400 * this.stepNavigation.length;
            this.SetFormInit();
            this.getProvince();
        }
    }
    async getProvince() {
        const maxRetries = 2;
        for (let retry = 0; retry < maxRetries; retry++) {
            try {
                this.province = await this.serviceProvince
                    .GetProvince()
                    .toPromise();
                break;
            } catch (error) {
                console.error("Error occurred:", error);
            }
        }
        if (!this.province) {
            setTimeout(() => {
                location.reload();
            }, 5000);
        }
        this.isLoading = false;
    }
    GetzIndexTab(index: number = 0) {
        return this.stepNavigationZindex - index;
    }
    async SetFormInit() {
        // if (localStorage.getItem("form-index")) {
        //     Swal.fire({
        //         title: "แจ้งเตือน!!",
        //         html: "คุณมีข้อมูลแจ้งความที่ยังกรอกไม่เสร็จ<br>ต้องการไปกรอกข้อมูลต่อหรือไม่",
        //         icon: "warning",
        //         confirmButtonText: "ยืนยัน",
        //         showCancelButton: true,
        //         cancelButtonText: "ยกเลิก",
        //     }).then((result) => {
        //         if (result.isConfirmed) {
        //             this.indexTab = Number(localStorage.getItem("form-index"));
        //         } else {
        //             this.handleSuccessNavigation();
        //         }
        //     });
        // }
        // try {
        //     this._ip = await this.getIPAddress();
        // } catch (error) {
        // }

        // this.getLocation().subscribe(
        //     (position) => {
        //         console.log(position);
        //         console.log(position.coords);
        //         console.log(position.coords.latitude);
        //         console.log(position.coords.longitude);
        //     },
        //     (error) => {
        //         console.log(error);
        //     }
        // );
        this.formDataInsert.FORM_CODE = "CCIB_NOTIFY_PEOPLE@0.1";
        this.formDataInsert.env = environment.config.baseConfig;
        this.formDataInsert.CASE_TYPE_ID = 1;
        this.formDataInsert.CASE_FLAG = "O";
        this.formDataInsert.CASE_SELF_TYPE =
            this.userType === "mySelf" ? "Y" : "N";
        this.formDataInsert.DEVICE = "DESKTOP";

        // this.formDataInsert.env.browser = this.getBrowserInfo();
        // this.formDataInsert.env.device = this.getDeviceInfo();
        // this.formDataInsert.env.ip = this._ip;

        this.formDataAll = {
            DataDamageShow: {},
            formInformer: {},
            formEvent: {},
            formDamage: {},
            formVaillain: {},
            formAttachment: {},
            formAgree: {},
            formQuestionnare: {},
            formBlessing: {},
            formConfigs: this.formDataInsert,
        };
        localStorage.setItem(
            "form-config",
            JSON.stringify(this.formDataAll.formConfigs)
        );
    }

    private handleSuccessNavigation(): void {
        this._onlineCaseServ.SessionClear(User.Current.PersonalId).subscribe(() => {
            localStorage.removeItem("form-blessing");
            localStorage.removeItem("form-informer");
            localStorage.removeItem("form-event");
            localStorage.removeItem("form-damage");
            localStorage.removeItem("form-villain");
            localStorage.removeItem("form-attachment");
            localStorage.removeItem("form-questionare");
            localStorage.removeItem("form-index");
            localStorage.removeItem("form-criminal-contact");
        });
    }
    goUrl(url = "main/tasklist") {
        this._router.navigate([url]);
    }
    SelectorTab(index) {
        // return this.indexTab >= index ? 'arrow-selected':'arrow-default';
        const numbers = []; // Array to store the generated numbers
        for (let i = index; i <= this.max; i++) {
            numbers.push(i);
        }
        if (this.indexTab >= index) {
            return "arrow-selected"; // indexTab is greater than or equal to index
        } else if (numbers.some((number) => number <= this.max)) {
            return "arrow-selected-back"; // Some numbers are less than max
        } else {
            return "arrow-default"; // Default case
        }
    }
    public NextIndex(index: number = 0) {
        this.indexTab = index;
        const countItem = this.stepNavigation.length;
        if (index === countItem - 1 && this.indexLocker.validateConponent) {
            this.validateConponent.ReloadData();
        }
    }
    testCheckNextIndex(index: number = 0) {
        this.indexTab = index;
    }
    SelectTabIndex(index: number = 0) {
        if (this.formType === "edit") {
            this.indexTab = index;
        } else {
            this.max = Math.max(this.max, this.indexTab);
            if (this.indexTab != 0 && this.indexTab != 1) {
                if (this.max >= index) {
                    switch (this.indexTab) {
                        case 2:
                            this.informerConponent.SubmitForm("tab");
                            break;
                        case 3:
                            this.eventConponent.SubmitForm("tab");
                            break;
                        case 4:
                            this.damageConponent.SubmitForm("tab");
                            break;
                    }
                    if (this.checkValidate == false) {
                        this.indexTab = index;
                        this.selectabReload(this.indexTab);
                    } else {
                        this.indexTab = this.indexTab;
                    }
                }
            }
        }
        const countItem = this.stepNavigation.length;
        if (index === countItem - 1 && this.indexLocker.validateConponent) {
            this.validateConponent.ReloadData();
        }
    }
    public MergeObj(formData) {
        this.formDataInsert = Object.assign({}, this.formDataInsert, formData);
        return this.formDataInsert;
    }
    CheckDataForm() {
        // console.log('this.formDataInsert->>>>',this.formDataInsert);
        // console.log('this.formDataInsert->>>>', JSON.stringify(this.formDataInsert));
    }
    tetData() {
        // console.log('this.dataTest',this.dataTest);
    }

    public checkReload(page) {
        // console.log("เรียกข้อมูลไม่สำเร็จกำลังเรียกข้อมูลใหม่ที่หน้า ",page);
        switch (page) {
            case 1:
                this.blessingComponent.ngOnInit();
                break;
            case 2:
                this.informerConponent.ngOnInit();
                break;
            case 3:
                this.eventConponent.ngOnInit();
                break;
            case 4:
                this.damageConponent.ngOnInit();
                break;
            // case 5 : this.vaillainConponent.ngOnInit(); break;
            // case 6 : this.attachmentConponent.ngOnInit(); break;
            // case 7 : this.questionareComponent.ngOnInit(); break;
        }
    }

    public selectabReload(page) {
        // console.log("เรียกข้อมูลไม่สำเร็จกำลังเรียกข้อมูลใหม่ที่หน้า ",page);
        switch (page) {
            case 0:
                this.pagefirstConponent === undefined
                    ? (this.indexTab = 1)
                    : this.pagefirstConponent.setDefaultData();
                break;
            // case 1 : this.blessingComponent === undefined ? this.indexTab = 1 : this.blessingComponent.setDefaultData(); break;
            case 2:
                this.informerConponent === undefined
                    ? (this.indexTab = 2)
                    : this.informerConponent.setPersonalData();
                break;
            case 3:
                this.eventConponent === undefined
                    ? (this.indexTab = 3)
                    : this.eventConponent.SetDefaultData();
                break;
            case 4:
                this.damageConponent === undefined
                    ? (this.indexTab = 4)
                    : this.damageConponent.SetDefaultData();
                break;
            // case 5 : this.vaillainConponent === undefined ? this.indexTab = 5 : this.vaillainConponent.SetDefault(); break;
            // case 6 : this.attachmentConponent === undefined ? this.indexTab = 6 : this.attachmentConponent.setDefaultData(); break;
            // case 7 : this.questionareComponent === undefined ? this.indexTab = 7 : this.questionareComponent.setDefaultData(); break;
        }
    }

    public CheckNextIndex(index: number = 0) {
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
        if (index === countItem - 1 && this.indexLocker.validatenewConponent) {
            this.validatenewConponent.loadDataForm();
        }
    }

    getBrowserInfo(): string {
        if (this.platform.isBrowser) {
            const userAgent = window.navigator.userAgent;
            const browsers = {
                Chrome: /chrome/i,
                Safari: /safari/i,
                Firefox: /firefox/i,
                Edge: /edge/i,
                MicrosoftEdge: /Edg/i,
                Opera: /opera/i,
                IE: /internet explorer/i,
            };

            for (const key in browsers) {
                if (browsers[key].test(userAgent)) {
                    return key;
                }
            }
            return "Unknown Browser";
        } else {
            return "Not in a browser environment";
        }
    }

    getDeviceInfo(): string {
        if (this.platform.isBrowser) {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(
                navigator.userAgent
            );
            const isTablet = /iPad/i.test(navigator.userAgent);

            if (isMobile) {
                return "Mobile Device";
            } else if (isTablet) {
                return "Tablet Device";
            } else {
                return "Desktop Device";
            }
        } else {
            return "Not in a browser environment";
        }
    }

    getIPAddress(): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                $.getJSON("https://api.ipify.org?format=json", (data) => {
                    const ipAddress = data.ip;
                    resolve(ipAddress);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    getLocation(): Observable<any> {
        return new Observable((observer) => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        observer.next(position);
                        observer.complete();
                    },
                    (error) => observer.error(error)
                );
            } else {
                observer.error("Geolocation is not supported by your browser.");
            }
        });
    }
}
