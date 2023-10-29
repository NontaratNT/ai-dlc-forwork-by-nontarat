import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LayoutDesktopRoutingModule } from "./layout-desktop-routing.module";
import { Page1Component } from "./components/page1/page1.component";
import { SidebarComponent } from "./layout/sidebar/sidebar.component";
import { MainComponent } from "./layout/main/main.component";
import { NavbarComponent } from "./layout/navbar/navbar.component";
import { Page2Component } from "./components/page2/page2.component";
import {
    DxButtonModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DxDrawerModule,
    DxCheckBoxModule,
    DxFormModule,
    DxLoadPanelModule,
    DxRadioGroupModule,
    DxMultiViewModule,
    DxNumberBoxModule,
    DxTextBoxModule,
    DxTreeViewModule,
    DxTreeListModule,
    DxPopupModule,
    DxTextAreaModule,
    DxTabPanelModule,
    DxSwitchModule,
    DxScrollViewModule,
    DxFileUploaderModule,
    DxTemplateModule,
    DxListModule,
    DxToolbarModule,
    DxTooltipModule,
} from "devextreme-angular";
import { PersonalComponent } from "./components/personal/personal.component";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TasklistComponent } from "./components/tasklist/tasklist.component";
import { DashboardCaseComponent } from './components/dashboard-case/dashboard-case.component';
import { DragDirective } from "./components/issue-online-container/popup-view/damage-popup/dragDrop.directive";
import { IssueOnlineContainerComponent } from "./components/issue-online-container/issue-online-container.component";
import { DxiItemModule } from 'devextreme-angular/ui/nested';
import { IssueOnlineAgreeComponent } from "./components/issue-online-container/issue-online-agree/issue-online-agree.component";
import { IssueOnlineInformerComponent } from "./components/issue-online-container/issue-online-informer/issue-online-informer.component";
import { IssueOnlineDamageComponent } from "./components/issue-online-container/issue-online-damage/issue-online-damage.component";
import { IssueOnlineVillainComponent } from "./components/issue-online-container/issue-online-villain/issue-online-villain.component";
import { IssueOnlineComponent } from './components/issue-online/issue-online.component';
import { DamagePopupComponent } from "./components/issue-online-container/popup-view/damage-popup/damage-popup.component";
import { AngularResizedEventModule } from "angular-resize-event";
import { TaskAppointmentComponent } from './components/task-appointment/task-appointment.component';
import { IssueOnlineEventComponent } from './components/issue-online-container/issue-online-event/issue-online-event.component';
import {
    IssueOnlineAttachmentComponent
} from './components/issue-online-container/issue-online-attachment/issue-online-attachment.component';
import { IssueOnlineValidateComponent } from "./components/issue-online-container/issue-online-validate/issue-online-validate.component";
import { IssueOnlineEditComponent } from "./components/issue-online-edit/issue-online-edit.component";
import { AttachFileComponent } from "./components/attach-file/attach-file.component";
import { ChatComponent } from "./components/chat/chat.component";
import { TrackAppointmentComponent } from './components/track-appointment/track-appointment.component';
import { FormsModule } from "@angular/forms";
import { AttributesDirective } from "src/app/directive/attributes-directive";
import { DateComboPickerComponent } from "src/app/components/controls/date-combo-picker/date-combo-picker.component";
import { ViewAddressComponent } from './components/view-address/view-address.component';
import { ViewFileUploadComponent } from './components/view-file-upload/view-file-upload.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { DateComboRegisterComponent } from "src/app/components/controls/date-combo-register/date-combo-register.component";
import { AppointmentHistoryComponent } from './components/appointment-history/appointment-history.component';
import { IssueOnlineWithdrawCaseComponent } from './components/issue-online-withdraw-case/issue-online-withdraw-case.component';
import { ProblemOnlineComponent } from './components/problem-online/problem-online.component';
import { ProblemOnlineAddComponent } from './components/problem-online-add/problem-online-add.component';
import { IssueOnlineService } from "src/app/services/issue-online.service";
import { IssueOnlineDamageSubComponent } from './components/issue-online-container/issue-online-damage-sub/issue-online-damage-sub.component';
import { IssueOnlineBlessingComponent } from './components/issue-online-container/issue-online-blessing/issue-online-blessing.component';
import { IssueOnlineQuestionareComponent } from './components/issue-online-container/issue-online-questionare/issue-online-questionare.component';
import { DateTimeInputComponent } from "src/app/components/controls/date-time-input/date-time-input.component";
import { IssueOnlineCheckComponent } from './components/issue-online-container/issue-online-check/issue-online-check.component';


const customNotifierOptions: NotifierOptions = {
    position: {
        horizontal: {
            position: 'left',
            distance: 12
        },
        vertical: {
            position: 'bottom',
            distance: 12,
            gap: 10
        }
    },
    theme: 'material',
    behaviour: {
        autoHide: 5000,
        onClick: 'hide',
        onMouseover: 'pauseAutoHide',
        showDismissButton: true,
        stacking: 4
    },
    animations: {
        enabled: true,
        show: {
            preset: 'slide',
            speed: 300,
            easing: 'ease'
        },
        hide: {
            preset: 'fade',
            speed: 300,
            easing: 'ease',
            offset: 50
        },
        shift: {
            speed: 300,
            easing: 'ease'
        },
        overlap: 150
    }
};

@NgModule({
    declarations: [
        MainComponent,
        Page1Component,
        SidebarComponent,
        NavbarComponent,
        Page2Component,
        PersonalComponent,
        DashboardComponent,
        TasklistComponent,
        DashboardCaseComponent,
        IssueOnlineContainerComponent,
        DragDirective,
        IssueOnlineAgreeComponent,
        IssueOnlineInformerComponent,
        IssueOnlineVillainComponent,
        IssueOnlineDamageComponent,
        IssueOnlineComponent,
        IssueOnlineEditComponent,
        DamagePopupComponent,
        TaskAppointmentComponent,
        IssueOnlineEventComponent,
        IssueOnlineAttachmentComponent,
        IssueOnlineValidateComponent,
        AttachFileComponent,
        ChatComponent,
        TrackAppointmentComponent,
        AttributesDirective,
        DateComboPickerComponent,
        ViewAddressComponent,
        ViewFileUploadComponent,
        NotificationListComponent,
        DateComboRegisterComponent,
        AppointmentHistoryComponent,
        IssueOnlineWithdrawCaseComponent,
        ProblemOnlineComponent,
        ProblemOnlineAddComponent,
        IssueOnlineDamageSubComponent,
        IssueOnlineBlessingComponent,
        IssueOnlineQuestionareComponent,
        DateTimeInputComponent,
        IssueOnlineCheckComponent
    ],
    exports: [DateComboPickerComponent, DateComboRegisterComponent],
    imports: [
        CommonModule,
        LayoutDesktopRoutingModule,
        DxDrawerModule,
        DxListModule,
        DxRadioGroupModule,
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
        DxTooltipModule,
        DxToolbarModule,
        AngularResizedEventModule,
        FormsModule,
        NgxExtendedPdfViewerModule,
        NotifierModule.withConfig(customNotifierOptions),

    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LayoutDesktopModule { }
