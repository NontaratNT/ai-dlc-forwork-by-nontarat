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
import { AttachFileComponent } from "../attach-file/attach-file.component";
import { TrackAppointmentComponent } from "./track-appointment/track-appointment.component";
import { DxMultiViewComponent, DxSelectBoxComponent } from "devextreme-angular";
import { ChatComponent } from "../chat/chat.component";
import { ChatService } from "src/app/services/chat.service";
import { UserSettingService } from "src/app/services/user-setting.service";
import { IssueOnlineBlessingComponent } from "./issue-online-blessing/issue-online-blessing.component";
import { IssueOnlineQuestionareComponent } from "./issue-online-questionare/issue-online-questionare.component";
import { ProvinceService } from "src/app/services/province.service";
import Swal from "sweetalert2";
import { IssueOnlineCheckComponent } from "./issue-online-check/issue-online-check.component";
import { IOrganizeInfo } from "share-ui/lib/models/organize-info.service";
import { OrgService } from "src/app/services/org.service";
import { User } from "src/app/services/user";
import { IssueOnlineCriminalContatInfoComponent } from "./issue-online-criminal-contact-info/issue-online-criminal-contact-info.component";
@Component({
    selector: "app-issue-online-container",
    templateUrl: "./issue-online-container.component.html",
    styleUrls: ["./issue-online-container.component.scss"],
})
export class IssueOnlineContainerComponent implements OnInit {
    // @ViewChild(IssueOnlineAgreeComponent, { static: true }) agreeComponent: IssueOnlineAgreeComponent;
    @ViewChild(IssueOnlineAgreeComponent) set content(content1: IssueOnlineAgreeComponent) {
        if (content1) {
            this.agreeComponent = content1;
            this.agreeComponent.mainConponent = this;
            this.indexLocker.agreeComponent = true;

        }
    }
    @ViewChild(IssueOnlineBlessingComponent) set content8(content8: IssueOnlineBlessingComponent) {
        if (content8) {
            this.blessingComponent = content8;
            this.blessingComponent.mainConponent = this;
            this.indexLocker.blessingComponent = true;

        }
    }

    @ViewChild(IssueOnlineQuestionareComponent) set content9(content9: IssueOnlineQuestionareComponent) {
        if (content9) {
            this.questionareComponent = content9;
            this.questionareComponent.mainConponent = this;
            this.indexLocker.questionareComponent = true;

        }
    }
    @ViewChild(IssueOnlineInformerComponent) set content2(content2: IssueOnlineInformerComponent) {
        if (content2) {
            this.informerConponent = content2;
            this.informerConponent.mainConponent = this;
            this.indexLocker.informerConponent = true;

        }
    }
    @ViewChild(IssueOnlineEventComponent) set content3(content3: IssueOnlineEventComponent) {
        if (content3) {

            this.eventConponent = content3;
            this.eventConponent.mainConponent = this;
            this.indexLocker.eventConponent = true;

        }
    }
    @ViewChild(IssueOnlineDamageComponent) set content4(content4: IssueOnlineDamageComponent) {
        if (content4) {
            this.damageConponent = content4;
            this.damageConponent.mainConponent = this;
            this.indexLocker.damageConponent = true;

        }
    }
    @ViewChild(IssueOnlineVillainComponent) set content5(content5: IssueOnlineVillainComponent) {
        if (content5) {
            this.vaillainConponent = content5;
            this.vaillainConponent.mainConponent = this;
            this.indexLocker.vaillainConponent = true;

        }
    }
    @ViewChild(IssueOnlineAttachmentComponent) set content6(content6: IssueOnlineAttachmentComponent) {
        if (content6) {
            this.attachmentConponent = content6;
            this.attachmentConponent.mainConponent = this;
            this.indexLocker.attachmentConponent = true;

        }
    }
    @ViewChild(IssueOnlineValidateComponent) set content7(content7: IssueOnlineValidateComponent) {
        if (content7) {
            this.validateConponent = content7;
            this.validateConponent.mainConponent = this;
            this.indexLocker.validateConponent = true;

        }
    }
    @ViewChild(TrackAppointmentComponent) set content10(content10: TrackAppointmentComponent) {
        if (content10) {
            this.trackAppointmentConponent = content10;
            this.trackAppointmentConponent.mainConponent = this;
            this.indexLocker.trackAppointmentConponent = true;

        }
    }
    @ViewChild(AttachFileComponent) set content11(content11: AttachFileComponent) {
        if (content11) {
            this.attachmentFileConponent = content11;
            this.attachmentFileConponent.mainConponent = this;
            this.indexLocker.attachmentFileConponent = true;

        }
    }
    @ViewChild(IssueOnlineCheckComponent) set content0(content0: IssueOnlineCheckComponent) {
        if (content0) {
            this.pagefirstConponent = content0;
            this.pagefirstConponent.mainConponent = this;
            this.indexLocker.pagefirstConponent = true;

        }
    }
    @ViewChild(IssueOnlineCriminalContatInfoComponent) set content12(content12: IssueOnlineCriminalContatInfoComponent){
        if (content12) {
            this.inssueOnlineCriminalContact = content12;
            this.inssueOnlineCriminalContact.mainConponent = this;
            this.indexLocker.inssueOnlineCriminalContact = true;

        }
    }

    @ViewChild("selectPresentProvicelocation", { static: false }) selectPresentProvicelocation: DxSelectBoxComponent;
    @ViewChild("selectorg", { static: false }) selectorg: DxSelectBoxComponent;
    @Input() dataForm: any;
    @Input() public edit;
    @Input() public userType = "mySelf";
    @Input() insId: number;
    @Input() indexCount: number;
    public indexTab = 0;
    public formDataInsert: any = {};
    public formquestionnare1: any = {};

    public formType = 'add';
    public blessingComponent: IssueOnlineBlessingComponent;

    public agreeComponent: IssueOnlineAgreeComponent;
    public informerConponent: IssueOnlineInformerComponent;
    public eventConponent: IssueOnlineEventComponent;
    public damageConponent: IssueOnlineDamageComponent;
    public vaillainConponent: IssueOnlineVillainComponent;
    public attachmentConponent: IssueOnlineAttachmentComponent;
    public validateConponent: IssueOnlineValidateComponent;
    public attachmentFileConponent: AttachFileComponent;
    public questionareComponent: IssueOnlineQuestionareComponent;
    public chatConponent: ChatComponent;
    public trackAppointmentConponent: TrackAppointmentComponent;
    public pagefirstConponent: IssueOnlineCheckComponent;
    public inssueOnlineCriminalContact: IssueOnlineCriminalContatInfoComponent;
    public caseId: number;
    public InstId: string;
    public ProcessInstanceId: string;
    public province = [];
    loadPageSuccess = false;
    isLoading = true;
    countFlow = 0;
    numCount = 0;
    indexLocker: any = {};
    bpmData = [];
    stepNavigation = [
        { text: "ข้อความยินยอม", textClass: "arrow-div arrow-first" },
        { text: "ข้อมูลผู้เสียหาย", textClass: "arrow-div arrow-center" },
        { text: "เรื่องที่เกิดขึ้น", textClass: "arrow-div arrow-center" },
        { text: "ความเสียหาย", textClass: "arrow-div arrow-center" },
        { text: "ช่องทางติดต่อคนร้าย", textClass: "arrow-div arrow-center"},
        { text: "ช่องทางติดต่อคนร้าย", textClass: "arrow-div arrow-center"},
        { text: "ยืนยันความถูกต้อง", textClass: "arrow-div arrow-end" }
    ];
    stepNavigationZindex = 100;
    public formDataAll: any = {};
    formDataBankref: any = {};

    dsorgbyarialocation: IOrganizeInfo[];
    formData: any = {};
    orgShow = false;

    checkboxLocation: any = {};
    radiocheckorganize1 = [{ id: 1, text: "สถานีตำรวจ" }];
    radiocheckorganize2 = [{ id: 2, text: "กองบัญชาการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี" }];
    radiocheckorganize3 = [{ id: 3, text: "กองบัญชาการตำรวจสอบสวนกลาง (ลาดพร้าว)" }];
    orgtype2_1 = [{ org_id: 3536, org_name: "บก.สอท.1", org_location1: "ศูนย์ราชการแจ้งวัฒนะ จ.กรุงเทพฯ" }];
    orgtype2_2 = [{ org_id: 3548, org_name: "บก.สอท.2", org_location1: "เมืองทองธานี จ.นนทบุรี" }];
    orgtype2_3 = [{ org_id: 3559, org_name: "บก.สอท.3", org_location1: "1.ศูนย์ราชการแจ้งวัฒนะ จ.กรุงเทพฯ", org_location2: "2.ถ.มิตรภาพ ต.ในเมือง อ.เมือง จ.ขอนแก่น" }];
    orgtype2_4 = [{ org_id: 3567, org_name: "บก.สอท.4", org_location1: "1.ศูนย์ราชการแจ้งวัฒนะ จ.กรุงเทพฯ", org_location2: "2.ต.ป่าแดด อ.เมืองเชียงใหม่ จ.เชียงใหม่" }];
    orgtype2_5 = [{ org_id: 3578, org_name: "บก.สอท.5", org_location1: "1.ศูนย์ราชการแจ้งวัฒนะ จ.กรุงเทพฯ", org_location2: "2.ต.บางกุ้ง อ.เมืองสุราษฎร์ธานี จ.สุราษฏร์ธานี" }];
    formdataOrgsendcase: any = {
        ORG_LOCATION_TYPE: null,
        ORGANIZE_ID: null,
        ORG_LOCATION_NAME: "",
        ORG_PROVINCE_ID: null,
        ORG_PROVICE_NAME: "",
        ORG_LOCATION_MAIN_ID1: null,
        ORG_LOCATION_MAIN_NAME1: "",
        ORG_LOCATION_MAIN_ID2: null,
        ORG_LOCATION_MAIN_NAME2: "",
        ORG_LOCATION_MAIN_ID3: null,
        ORG_LOCATION_MAIN_NAME3: "",
        ORG_LOCATION_MAIN_ID4: null,
        ORG_LOCATION_MAIN_NAME4: "",
        ORG_LOCATION_MAIN_ID5: null,
        ORG_LOCATION_MAIN_NAME5: "",
        ORG_LOCATION_CENTER_ID: null,
        ORG_LOCATION_CENTER_NAME: "",
    };

    constructor(
        private _router: Router,
        private _flowServ: BpmMdmFlowService,
        private _groupStatusServ: GroupStatusService,
        private _bpmProcinstServ: BpmProcinstService,
        private _activeRoute: ActivatedRoute,
        private servChat: ChatService,
        private userSetting: UserSettingService,
        private serviceProvince: ProvinceService,
        private _OrgService: OrgService,
    ) { }

    ngOnInit(): void {
        console.log(this.dataForm);
        console.log(this.edit);
        setTimeout(async () => {
            if (this.dataForm) {
                this.userSetting.userSetting.iconVisible = false;
                this.formType = 'edit';
                const d = this.dataForm;
                this.formDataInsert = d.Submission;
                this.formDataInsert.Track_code = d.Track_code;
                this.formDataInsert.Status_name = d.Status_name;
                this.InstId = d.InstId;
                this.ProcessInstanceId = d.ProcessInstanceId;
                this.caseId = d.Submission.backendId;
                this.LoadStatus(this.InstId);
                this.getProvince();
                if (this.dataForm.ORG_ID === null || this.dataForm.ORG_ID === 0) {
                    this.indexTab = 4;
                }
            } else {
                this.SetFormInit();
                this.getProvince();
            }
        }, 1000);

    }
    async getProvince() {
        try {
            this.province = await this.serviceProvince.GetProvince().toPromise();
        } catch (error) {
            this.getProvince();
        }
        this.isLoading = false;
    }
    LoadStatus(id) {
        this._bpmProcinstServ.getByInstId(id).subscribe(res => {
            this.bpmData = res;
        });
    }
    GetzIndexTab(index: number = 0) {
        return this.stepNavigationZindex - index;
    }
    CheckEmptyText(text) {
        if (text !== undefined && text !== null) {
            return text;
        }
        return "";
    }
    SetFormInit() {
        if (localStorage.getItem("form-index")) {
            Swal.fire({
                title: 'แจ้งเตือน!!',
                html: "คุณมีข้อมูลแจ้งความที่ยังกรอกไม่เสร็จ<br>ต้องการไปกรอกข้อมูลต่อหรือไม่",
                icon: 'warning',
                confirmButtonText: 'ยืนยัน',
                showCancelButton: true,
                cancelButtonText: 'ยกเลิก'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.indexTab = Number(localStorage.getItem("form-index"));
                } else {
                    localStorage.removeItem("form-blessing");
                    localStorage.removeItem("form-informer");
                    localStorage.removeItem("form-event");
                    localStorage.removeItem("form-damage");
                    localStorage.removeItem("form-index");
                }
            });
        }
        this.formDataInsert.FORM_CODE = "CCIB_NOTIFY_PEOPLE@0.1";
        this.formDataInsert.env = environment.config.baseConfig;
        this.formDataInsert.CASE_TYPE_ID = 1;
        this.formDataInsert.CASE_FLAG = "O";
        this.formDataInsert.CASE_SELF_TYPE = (this.userType === "mySelf") ? "Y" : "N";
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
            formConfigs: {
                FORM_CODE: "CCIB_NOTIFY_PEOPLE@0.1",
                env: environment.config.baseConfig,
                CASE_FLAG: "O",
                CASE_SELF_TYPE: (this.userType === "mySelf") ? "Y" : "N",
            },
        };
    }
    goUrl(url = 'main/tasklist') {
        this._router.navigate([url]);
    }
    SelectorTab(index) {
        return this.indexTab >= index ? 'arrow-selected' : 'arrow-default';
    }
    public NextIndex(index: number = 0) {
        this.indexTab = index;
        const countItem = this.stepNavigation.length;
        if (index === (countItem - 1) && this.indexLocker.validateConponent) {
            this.validateConponent.ReloadData();
        }
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
        const countItem = this.stepNavigation.length;
        if (index === (countItem - 1) && this.indexLocker.validateConponent) {
            this.validateConponent.ReloadData();
        }
    }
    testCheckNextIndex(index: number = 0) {
        this.indexTab = index;
    }
    SelectTabIndex(index: number = 0) {
        if (this.formType === 'edit') {
            this.indexTab = index;
        }
    }
    public MergeObj(formData) {
        this.formDataInsert = Object.assign({}, this.formDataInsert, formData);
        return this.formDataInsert;
    }
    CheckDataForm() {
        // console.log('this.formDataInsert->>>>', this.formDataInsert);
        // console.log('this.formDataInsert->>>>', JSON.stringify(this.formDataInsert));

    }
    openAppoi() {
        this.indexTab = 2;
        // console.log(this.indexTab);
    }
    openChat(e) {
        this.indexTab = 7;
        this.servChat.getCountReadChat(this.insId).subscribe(_ => {
            this.numCount = _;
        });
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
    public checkReload(page) {
        // console.log("เรียกข้อมูลไม่สำเร็จกำลังเรียกข้อมูลใหม่ที่หน้า ",page);
        switch (page) {
            case 0: this.pagefirstConponent.ngOnInit(); break;
            case 2: this.informerConponent.ngOnInit(); break;
            case 3: this.eventConponent.ngOnInit(); break;
            case 4: this.damageConponent.ngOnInit(); break;
        }
    }

    async addorg(cellValue) {
        this.province = await this.serviceProvince.GetProvince().toPromise();
        this.dsorgbyarialocation = await this._OrgService.getorgwalkinall().toPromise();
        const data = cellValue.data;
        this.formData.INST_ID = data.INST_ID;
        if (data) {
            this.orgShow = true;
        }
    }

    onClose() {
        this.formData.ORG_PROVINCE_ID = undefined;
        this.formData.ORG_PROVINCE_LOCATION_ID = undefined;
        this._router.navigate([`/mobile/issue`]);
    }

    OnSelectProvicePresentlocation(e) {
        if (e.value) {
            const data =
                this.selectPresentProvicelocation.instance.option(
                    "selectedItem"
                );
            if (data) {
                this.formData.ORG_PROVINCE_OFFICER_ID = data.PROVINCE_ID;
                this.formData.ORG_PROVINCE_OFFICER_NAME = data.PROVINCE_NAME_THA;
            } else {
                this.formData.ORG_PROVINCE_OFFICER_ID = e.value;
            }
            this._OrgService.getorgProvince(e.value).subscribe((_) => {
                this.dsorgbyarialocation = _;
            });
        }
    }

    Onorglocation(e) {
        const data = this.selectorg.instance.option("selectedItem");
        if (data) {
            this.formData.ORGANIZE_ID = data.ORGANIZE_ID;
            this.formData.ORGANIZE_NAME = data.ORGANIZE_NAME_THA;
            this.formData.ORG_PROVINCE_OFFICER_ID = Number(data.ORGANIZE_ARIA_CODE);
        } else {
            this.formData.ORGANIZE_ID = e.value;
        }
    }

    onSave(e) {
        if (!this.formData.ORGANIZE_ID) {
            Swal.fire({
                title: 'ผิดพลาด!',
                text: 'กรุณาเลือกสถานีที่ท่าจะไปพบ',
                icon: 'warning',
                confirmButtonText: 'Ok',
            }).then(() => {
            });
            return;
        }
        const setData = {
            organize_id: Number(this.formData.ORGANIZE_ID),
            inst_id: Number(this.formData.INST_ID),
            personal_id: Number(User.Current.PersonalId)
        }
        this.isLoading = true;
        this._bpmProcinstServ.userSelectOrgGdcc(setData)
            .subscribe(() => {
                this._bpmProcinstServ.userSelectOrg(setData)
                    .subscribe(() => {
                        Swal.fire({
                            title: 'แจ้งเตือน!',
                            text: 'เลือกหน่วยงานสำเร็จ!!!',
                            icon: 'success',
                            confirmButtonText: 'ตกลง'
                        }).then(() => {
                            this.isLoading = false;
                            this.onClose();
                            location.reload();
                        });
                    });
            });
    }

    onvaluecheckboxlocationchange(e, type_location) {
        this.formdataOrgsendcase = {
            ORG_LOCATION_TYPE: null,
            ORGANIZE_ID: null,
            ORG_LOCATION_NAME: "",
            ORG_PROVINCE_ID: null,
            ORG_PROVICE_NAME: "",
            ORG_LOCATION_MAIN_ID: null,
            ORG_LOCATION_MAIN_NAME: "",
            ORG_LOCATION_CENTER_ID: null,
            ORG_LOCATION_CENTER_NAME: "",
        };
        if (type_location == 1) {
            this.checkboxLocation.location_type1 = e.value;
            this.checkboxLocation.location_type2 = 0;
            if (e.value == 1) {
                this.formData.ORGANIZE_ID = null;
                this.formData.location_type1 = 1;
                this.formData.ORG_LOCATION_TYPE = 1;
            }
        } else if (type_location == 2) {

            this.checkboxLocation.location_type2 = e.value;
            this.checkboxLocation.location_type1 = e.value;
            this.formData.ORG_PROVINCE_ID = undefined;
            this.formData.ORG_PROVINCE_LOCATION_ID = undefined;
            if (e.value == 2) {
                this.formData.ORGANIZE_ID = null;
                this.formData.location_type1 = 2;
                this.formData.ORG_LOCATION_TYPE = 2;
            }
        } else if (type_location == 3) {
            this.formData.ORG_PROVINCE_ID = undefined;
            this.formData.ORG_PROVINCE_LOCATION_ID = undefined;
            this.checkboxLocation.location_type3 = e.value;
            if (e.value == 3) {
                this.formData.location_type1 = 3;
                this.formData.ORG_LOCATION_TYPE = 3;
                this.formData.ORGANIZE_ID = 2375;
                this.formData.ORG_LOCATION_NAME = "กองบัญชาการตำรวจสอบสวนกลาง";
            }
        }
    }

    onvaluechangeorgmain(e, type) {
        this.formData.ORG_PROVINCE_MAP_AREA_ID = null;
        this.formData.ORG_PROVINCE_MAP_AREA_NAME = null;

        if (e.value) {
            if (type == 1) {
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = null;
                const data: any = this.orgtype2_1.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = data[0].org_id;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_NAME1 =
                    data[0].org_name;

                //parame insert
                this.formData.ORG_LOCATION_TYPE = 2;
                this.formData.ORGANIZE_ID = data[0].org_id;
                this.formData.ORG_LOCATION_NAME = data[0].org_name;
            }
            if (type == 2) {
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = null;
                const data: any = this.orgtype2_2.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = data[0].org_id;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_NAME2 =
                    data[0].org_name;

                //parame insert
                this.formData.ORG_LOCATION_TYPE = 2;
                this.formData.ORGANIZE_ID = data[0].org_id;
                this.formData.ORG_LOCATION_NAME = data[0].org_name;
            } else if (type == 3) {
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = null;
                const data: any = this.orgtype2_3.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = data[0].org_id;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_NAME3 =
                    data[0].org_name;

                //parame insert
                this.formData.ORG_LOCATION_TYPE = 2;
                this.formData.ORGANIZE_ID = data[0].org_id;
                this.formData.ORG_LOCATION_NAME = data[0].org_name;
            } else if (type == 4) {
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = null;
                const data: any = this.orgtype2_4.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = data[0].org_id;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_NAME4 =
                    data[0].org_name;

                //parame insert
                this.formData.ORG_LOCATION_TYPE = 2;
                this.formData.ORGANIZE_ID = data[0].org_id;
                this.formData.ORG_LOCATION_NAME = data[0].org_name;
            } else if (type == 5) {
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = null;
                const data: any = this.orgtype2_5.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = data[0].org_id;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_NAME5 =
                    data[0].org_name;

                //parame insert
                this.formData.ORG_LOCATION_TYPE = 2;
                this.formData.ORGANIZE_ID = data[0].org_id;
                this.formData.ORG_LOCATION_NAME = data[0].org_name;
            }
        }
    }
}
