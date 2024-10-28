import {
    NgModule,
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import { CommonModule } from "@angular/common";

import { LayoutMobileRoutingModule } from "./layout-mobile-routing.module";
import { MainComponent } from "./layout/main/main.component";
import { SidebarComponent } from "./layout/sidebar/sidebar.component";
import { NavbarComponent } from "./layout/navbar/navbar.component";
import { Page1mComponent } from "./component/page1m/page1m.component";
import { Page2mComponent } from "./component/page2m/page2m.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { TrackStatusComponent } from "./component/page/track-status/track-status.component";
import {
    DxButtonGroupModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxDataGridModule,
    DxDateBoxModule,
    DxDrawerModule,
    DxFileUploaderModule,
    DxFormModule,
    DxListModule,
    DxLoadPanelModule,
    DxMultiViewModule,
    DxNumberBoxModule,
    DxPopupModule,
    DxRadioGroupModule,
    DxScrollViewModule,
    DxSelectBoxModule,
    DxSwitchModule,
    DxTabPanelModule,
    DxTemplateModule,
    DxTextAreaModule,
    DxTextBoxModule,
    DxToolbarModule,
    DxTreeListModule,
    DxTreeViewModule,
    DxTooltipModule,
} from "devextreme-angular";
import { NewReportComponent } from "./component/page/new-report/new-report.component";
import { DetailAppoveComponent } from "./component/page/RequestReport/detail-appove/detail-appove.component";
import { RequestOneComponent } from "./component/page/RequestReport/request-one/request-one.component";
import { DragDirective } from "./component/page/RequestReport/issue-online-container/dragDrop.directive";
import { AngularResizedEventModule } from "angular-resize-event";
import { IssueOnlineAgreeComponent } from "./component/page/RequestReport/issue-online-container/issue-online-agree/issue-online-agree.component";
import { IssueOnlineAttachmentComponent } from "./component/page/RequestReport/issue-online-container/issue-online-attachment/issue-online-attachment.component";
import { IssueOnlineContainerComponent } from "./component/page/RequestReport/issue-online-container/issue-online-container.component";
import { IssueOnlineEventComponent } from "./component/page/RequestReport/issue-online-container/issue-online-event/issue-online-event.component";
import { IssueOnlineDamageComponent } from "./component/page/RequestReport/issue-online-container/issue-online-damage/issue-online-damage.component";
import { IssueOnlineInformerComponent } from "./component/page/RequestReport/issue-online-container/issue-online-informer/issue-online-informer.component";
import { IssueOnlineVillainComponent } from "./component/page/RequestReport/issue-online-container/issue-online-villain/issue-online-villain.component";
import { IssueOnlineValidateComponent } from "./component/page/RequestReport/issue-online-container/issue-online-validate/issue-online-validate.component";
import { CreateReportComponent } from "./component/page/RequestReport/create-report/create-report.component";
import { IssueOnlineEditComponent } from "./component/page/RequestReport/issue-online-edit/issue-online-edit.component";
import { ChatComponent } from "./component/page/RequestReport/chat/chat.component";
import { AttachFileComponent } from "./component/page/RequestReport/attach-file/attach-file.component";
import { DxiItemModule } from "devextreme-angular/ui/nested";
import { LayoutDesktopRoutingModule } from "../layout-desktop/layout-desktop-routing.module";
import { ProfileComponent } from "./component/page/profile/profile.component";
// eslint-disable-next-line max-len
import { TrackAppointmentComponent } from "./component/page/RequestReport/issue-online-container/track-appointment/track-appointment.component";
import { LayoutDesktopModule } from "../layout-desktop/layout-desktop.module";
import { ViewAddressComponent } from "./component/page/RequestReport/view-address/view-address.component";
import { ViewFileUploadComponent } from "./component/page/RequestReport/view-file-upload/view-file-upload.component";
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
import { FormsModule } from "@angular/forms";
import { IssueOnlineDamageSubComponent } from "./component/page/RequestReport/issue-online-container/issue-online-damage-sub/issue-online-damage-sub.component";
import { IssueOnlineBlessingComponent } from "./component/page/RequestReport/issue-online-container/issue-online-blessing/issue-online-blessing.component";
import { IssueOnlineQuestionareComponent } from "./component/page/RequestReport/issue-online-container/issue-online-questionare/issue-online-questionare.component";
import { IssueOnlineCheckComponent } from "./component/page/RequestReport/issue-online-container/issue-online-check/issue-online-check.component";
import { IssueOnlineReportComponent } from "./component/page/issue-online-report/issue-online-report.component";
import { IssueOnlineReportInformerComponent } from "./component/page/issue-online-report/issue-online-report-informer/issue-online-report-informer.component";
import { IssueOnlineReportEventComponent } from "./component/page/issue-online-report/issue-online-report-event/issue-online-report-event.component";
import { IssueOnlineReportValidateComponent } from "./component/page/issue-online-report/issue-online-report-validate/issue-online-report-validate.component";
import { SelectIssueComponent } from "./component/page/select-issue/select-issue.component";
import { IssueOnlineCriminalContatInfoComponent } from "./component/page/RequestReport/issue-online-container/issue-online-criminal-contact-info/issue-online-criminal-contact-info.component";

@NgModule({
    declarations: [
        MainComponent,
        SidebarComponent,
        NavbarComponent,
        Page1mComponent,
        Page2mComponent,
        FooterComponent,
        TrackStatusComponent,
        NewReportComponent,
        DetailAppoveComponent,
        RequestOneComponent,
        DragDirective,
        IssueOnlineContainerComponent,
        IssueOnlineAgreeComponent,
        IssueOnlineInformerComponent,
        IssueOnlineVillainComponent,
        IssueOnlineDamageComponent,
        IssueOnlineEventComponent,
        IssueOnlineAttachmentComponent,
        IssueOnlineValidateComponent,
        CreateReportComponent,
        IssueOnlineEditComponent,
        ChatComponent,
        AttachFileComponent,
        ProfileComponent,
        ViewFileUploadComponent,
        ViewAddressComponent,
        TrackAppointmentComponent,
        IssueOnlineDamageSubComponent,
        IssueOnlineBlessingComponent,
        IssueOnlineQuestionareComponent,
        IssueOnlineCheckComponent,
        IssueOnlineReportComponent,
        IssueOnlineReportInformerComponent,
        IssueOnlineReportEventComponent,
        IssueOnlineReportValidateComponent,
        SelectIssueComponent,
        IssueOnlineCriminalContatInfoComponent
    ],
    imports: [
        CommonModule,
        LayoutMobileRoutingModule,
        DxDrawerModule,
        DxListModule,
        DxRadioGroupModule,
        DxToolbarModule,
        DxTooltipModule,
        DxTreeListModule,
        DxTreeViewModule,
        DxTextBoxModule,
        DxButtonModule,
        DxDataGridModule,
        DxSelectBoxModule,
        DxDateBoxModule,
        DxCheckBoxModule,
        DxFormModule,
        DxLoadPanelModule,
        DxMultiViewModule,
        DxNumberBoxModule,
        DxPopupModule,
        DxTextAreaModule,
        DxTabPanelModule,
        DxSwitchModule,
        DxScrollViewModule,
        DxFileUploaderModule,
        DxTemplateModule,
        DxiItemModule,
        AngularResizedEventModule,
        DxButtonGroupModule,
        LayoutDesktopModule,
        NgxExtendedPdfViewerModule,
        FormsModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class LayoutMobileModule {}
