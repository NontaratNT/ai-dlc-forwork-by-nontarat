import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DxDrawerComponent, DxFormComponent, DxMultiViewComponent } from "devextreme-angular";
import { FormConfigService, FormSubmitService, IFormConfig } from "eform-share";
import { BpmProcinstService } from "src/app/services/bpm-procinst.service";
import { GroupStatusService } from "src/app/services/group-status.service";
import { OnlineCaseService } from "src/app/services/online-case.service";
import { formatDate } from 'devextreme/localization';
import * as moment from "moment";
import Swal from "sweetalert2";
import { ChatService } from "src/app/services/chat.service";
import { ChatComponent } from "../chat/chat.component";
import { UserSettingService } from "src/app/services/user-setting.service";

@Component({
    selector: "app-issue-online-edit",
    templateUrl: "./issue-online-edit.component.html",
    styleUrls: ["./issue-online-edit.component.scss"],
})
export class IssueOnlineEditComponent implements OnInit {
    @ViewChild(DxDrawerComponent, { static: false }) drawer: DxDrawerComponent;
    @ViewChild(DxMultiViewComponent, { static: false }) multi: DxMultiViewComponent;
    @ViewChild("formRequest", { static: false }) formRequest: DxFormComponent;
    @ViewChild(ChatComponent) set content10(content10: ChatComponent) {
        if (content10) {
            this.chatConponent = content10;
            this.chatConponent.mainConponent = this;

        }
    }
    public chatConponent: ChatComponent;
    listMneu = [
        { id: 1, text: 'ดูข้อมูล', icon: 'product', link: "/main/task-list", index: 0 },
        { id: 2, text: 'แนบไฟล์หลักฐาน', icon: 'product', link: "/main/issue", index: 1 },
        { id: 3, text: 'สนทนา', icon: 'product', link: "/main/issue", index: 2 },
        { id: 4, text: 'ข้อมูลนัดหมาย', icon: 'product', link: "/main/issue", index: 3 },
    ];
    numCounttt = 0;
    tabIndex = 0;
    _instId: number;
    _isLoading = false;
    _formDataConfig: IFormConfig;
    _formioId: string;
    _documentId: string;
    _wfinsId: string;
    isLoading = true;
    dataForm: any = {};
    loadTab = false;
    listGroupStatus: any = [];
    popupChat = false;
    navigation: any = [];
    showSubmenuModes: string[] = ['slide', 'expand'];
    positionModes: string[] = ['left', 'right'];
    showModes: string[] = ['push', 'shrink', 'overlap'];
    text: string;
    selectedOpenMode = 'shrink';
    selectedPosition = 'left';
    selectedRevealMode = 'slide';
    isDrawerOpen = true;
    formOverview: any = {};
    requestTextByUser = "";
    requestOpenSendSerice = false;
    dataId = 0;
    numCount = 0;
    visible_chat = false;
    constructor(
        private _formConfigServ: FormConfigService,
        private router: Router,
        private servChat: ChatService,
        private activeRoute: ActivatedRoute,
        private bpmProcinstServ: BpmProcinstService,
        private _onlineCaseServ: OnlineCaseService,
        private _formSubmitService: FormSubmitService,
        private _formConfigService: FormConfigService,
        private groupStatusServ: GroupStatusService,
        private userSetting: UserSettingService,

    ) { }

    ngOnInit(): void {
        this.visible_chat = this.userSetting.userSetting.iconVisible;
        // $("button").on("touchmove", function(evt) {
        //     const touch = evt.originalEvent.touches[0];
        //     const width = $(this).width() / 2;
        //     const height = $(this).height() / 2;
        //     const x = touch.clientX - width;
        //     const y = touch.clientY - height;

        //     $(this).css({
        //         "-webkit-transform": "translate3d(" + x + "px," + y + "px,0)"
        //     });
        // });
        // $(function() {
        //     $("#addClass").on(function() {
        //         $('#qnimate').addClass('popup-box-on');
        //     });

        //     $("#removeClass").click(function () {
        //         $('#qnimate').removeClass('popup-box-on');
        //     });
        // })
        this._instId = this.activeRoute.snapshot.params.instId;
        this.loaddata(this._instId);
        this.LoadStatus(this._instId);


    }
    statusText(stauscode) {
        if (stauscode) {
            return stauscode;
        }
        else {
            return 'ยื่นคำขอ';
        }
    }
    FormatDate(date) {
        if (date) {
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            return formatDate(<Date>moment(date).toDate(), "dateShortTimeThai");
        }
        else {
            return '';
        }
    }
    LoadStatus(id) {
        this.bpmProcinstServ.getByInstId(id).subscribe(res => {
            this.LoadStepData(res.GROUP_STATUS_CODE);
            this.formOverview.TRACKING_CODE = res.TRACKING_CODE;
            // this.formOverview.CATEGORY_NAME = res.CATEGORY_NAME + " จาก " + res.PERSONAL_FULL_NAME;
            this.formOverview.STATUS_NAME = this.statusText(res.STATUS_NAME);
            // this.formOverview.GROUP_STATUS_NAME = res.GROUP_STATUS_NAME;
            // this.formOverview.CREATE_DATE = this.FormatDate(res.CREATE_DATE);
            // this.formOverview.FLOW_SLA = res.FLOW_SLA;
            // this.formOverview.FLOW_UNIT = res.FLOW_UNIT;
            // this.formOverview.OFFICER_FULL_NAME = res.OFFICER_FULL_NAME;
            // this.formOverview.PERSONAL_TEL_NO = res.PERSONAL_TEL_NO;
            // if (res.UPDATE_DATE) {
            //     this.formOverview.UPDATE_DATE = this.FormatDate(res.UPDATE_DATE);
            // }
            // else {
            //     this.formOverview.UPDATE_DATE = this.FormatDate(res.CREATE_DATE);
            // }
        });
    }
    predicateBy(prop) {
        return (a, b) => {
            if (a[prop] > b[prop]) {
                return 1;
            } else if (a[prop] < b[prop]) {
                return -1;
            }
            return 0;
        };
    }
    CheckArray(data: any = []) {
        const countArray = data.length ?? 0;
        if (countArray > 0) {
            return true;
        }
        return false;

    }
    LoadStepData(marker) {
        this.groupStatusServ.get().subscribe((_) => {
            const listGroupStatus = _.sort(this.predicateBy("GROUP_SEQ"));
            const checkMarker = listGroupStatus.filter(r => r.GROUP_STATUS_CODE === marker);
            let isMark = true;
            let isActiveClass = true;
            if (!this.CheckArray(checkMarker)) {
                isMark = false;
                isActiveClass = false;
            }

            for (const [key, i] of listGroupStatus.entries()) {
                if (isMark) {
                    isActiveClass = true;
                }
                this.listGroupStatus.push({
                    GROUP_STATUS_ID: i.GROUP_STATUS_ID,
                    GROUP_SEQ: i.GROUP_SEQ,
                    GROUP_STATUS_CODE: i.GROUP_STATUS_CODE,
                    GROUP_STATUS_NAME: i.GROUP_STATUS_NAME,
                    GROUP_ICON: i.GROUP_ICON,
                    GROUP_STATUS_CLASS: (isActiveClass) ? "btn btn-circle btn-step-now" : "btn btn-circle btn-default",
                    GROUP_STATUS_CLASS_DETAIL: (isActiveClass) ? "btn btn-circles btn-step-detail-now" :
                        "btn btn-circles btn-deatil-default",
                    GROUP_STATUS_CLASS_TXT: (isActiveClass) ? "btn-step-txt-now" : "btn-step-txt-default",
                    // GROUP_CLASS_MARK: (isMark)?"color-marked":"color-not-mark",
                    // GROUP_STATUS_CLASS: "btn  btn-default btn-circle",
                    // GROUP_STATUS_CLASS_DETAIL: "btn btn-circles btn-deatil-default",
                });
                if (i.GROUP_STATUS_CODE === marker) {
                    isMark = false;
                    isActiveClass = false;
                }
            }
        });
    }
    loaddata(id) {
        if (id) {
            this.servChat.getCountNoChat(id).subscribe(_ => {
                this.numCount = _;
            });
            this.bpmProcinstServ.getByInstId(id).subscribe(res => {
                this._wfinsId = res.WF_INSTANCE_ID;
                this._formioId = res.FORM_IO_ID;
                this._documentId = res.DOCUMENT_ID;

                this._formConfigService.get(res.FORM_IO_ID).subscribe((resdata) => {
                    this._formDataConfig = resdata;
                    this.loadSubmission();
                });

            });
        }
    }
    async loadSubmission() {
        if (!this._formDataConfig.apiLoad) {
            this._formSubmitService.getSubmission(this._formDataConfig.formType).get(this._formioId, this._documentId)
                .subscribe(res => {
                    this.dataForm = {
                        InstId: this._instId,
                        ProcessInstanceId: this._wfinsId,
                        Submission: res,
                        Status_name: this.formOverview.STATUS_NAME,
                        Track_code: this.formOverview.TRACKING_CODE

                    };
                    this.isLoading = false;
                    this.loadTab = true;
                    if (res) {
                        this.requestOpenSendSerice = (res.backendId) ? true : false;
                    }
                    this._onlineCaseServ.GetOnlineRequest(res.backendId).subscribe((_) => {
                        if (_) {
                            this.requestTextByUser = _.REQUEST_DETAIL ?? "";
                        }
                    });

                });
        }
    }

    SelectMenu(e) {
        const d = e.itemData ?? null;
        const newIndex = d.index ?? 0;
        this.tabIndex = newIndex;
    }
    openChat(e) {
        this.tabIndex = e;
        this.servChat.getCountReadChat(this._instId).subscribe(_ => {
            this.numCount = _;
        });
        this.userSetting.userSetting.iconVisible = true;
        this.visible_chat = true;
        document.body.scrollTop = document.documentElement.scrollTop = 600;
    }
    ShowInvalidDialog(displayText = 'กรุณากรอกข้อมูลให้ครบ') {
        Swal.fire({
            title: "ผิดพลาด!",
            text: displayText,
            icon: "warning",
            confirmButtonText: "Ok",
        }).then(() => { });
    }
    ShowSuccessDialog(displayText = 'ส่งเรื่องที่ต้องการแก้ไขสำเร็จ') {
        Swal.fire({
            title: "สำเร็จ!",
            text: displayText,
            icon: "success",
            confirmButtonText: "Ok",
        }).then(() => { });
    }

    SubmitRequestTextCase() {
        if (!this.formRequest.instance.validate().isValid) {
            this.ShowInvalidDialog("กรุณากรอกเรื่องที่ต้องการแก้ไข");
            return;
        }
        if (this.requestOpenSendSerice) {
            const SendData = {
                CASE_ID: this.dataForm.Submission.backendId ?? null,
                REQUEST_DETAIL: this.requestTextByUser,
            };

            if (SendData.CASE_ID) {
                this._onlineCaseServ.CreateOnlineRequest(SendData).subscribe(() => {
                    this.ShowSuccessDialog();
                });
            }
        } else {
            this.ShowInvalidDialog("ผิดพลาดไม่สามารถส่งเรื่องที่ต้องการแก้ไขได้");
            return;
        }

    }
    // // eslint-disable-next-line @typescript-eslint/member-ordering
    // toolbarContent = [{
    //     widget: 'dxButton',
    //     location: 'before',
    //     options: {
    //         icon: 'menu',
    //         onClick: () => {
    //             this.isDrawerOpen = !this.isDrawerOpen;
    //             // console.log('this.isDrawerOpen',this.isDrawerOpen);
    //         },
    //     },
    // }];
    popup_open() {
        this.popupChat = true;
    }
    popup_hiding() {
        this.popupChat = false;
    }
}
