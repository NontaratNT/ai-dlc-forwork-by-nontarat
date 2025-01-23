import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
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
    DxTooltipModule,
} from "devextreme-angular";
import { NotifierModule, NotifierOptions } from 'angular-notifier';

import { LayoutHomeRoutingModule } from "./layout-home-routing.module";
import { MainComponent } from "./layout/main/main.component";
import { HeaderComponent } from "./layout/header/header.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { Page1Component } from "./components/page1/page1.component";
import { HomeComponent } from "./components/home/home.component";
import { AboutComponent } from "./components/about/about.component";
import { ContactComponent } from "./components/contact/contact.component";
import { NewsComponent } from "./components/news/news.component";
import { NewsDetailComponent } from "./components/news-detail/news-detail.component";
import { ServiceComponent } from "./components/service/service.component";
import { NgxPaginationModule } from "ngx-pagination";
import { LoginComponent } from "./components/login/login.component";
import { ForgetPasswordComponent } from "./components/forget-password/forget-password.component";
import { RegisterPeopleComponent } from "./components/register-people/register-people.component";
import { RegisterPeopleOtpComponent } from "./components/register-people-otp/register-people-otp.component";
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";
import { LayoutDesktopModule } from "../layout-desktop/layout-desktop.module";
// import { DateComboPickerComponent } from "./controls/date-combo-picker/date-combo-picker.component";
// import { AttributesDirective } from "./directive/attributes-directive";
import { DxiItemModule } from 'devextreme-angular/ui/nested';
import { AngularResizedEventModule } from 'angular-resize-event';
import { CountdownModule } from 'ngx-countdown';
import { FooterNewComponent } from './layout/footer-new/footer-new.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { MainHomeComponent } from './layout/main-home/main-home.component';
import { HeaderNewComponent } from './layout/header-new/header-new.component';
import { HomeNewComponent } from './components/home-new/home-new.component';
import { HeaderMainComponent } from './layout/header-main/header-main.component';
import { MainRegisterComponent } from './layout/main-register/main-register.component';
import { HeaderRegisterComponent } from './layout/header-register/header-register.component';
import { ViewCaseComponent } from 'src/app/components/page/view-case/view-case.component';
import { HomeVisibleComponent } from './components/home-visible/home-visible.component';
import { HeaderReDesignComponent } from './layout/re-design/header-re-design/header-re-design.component';
import { FooterReDesignComponent } from './layout/re-design/footer-re-design/footer-re-design.component';
import { FaqComponent } from './components/re-design/faq/faq.component';

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
        HeaderComponent,
        FooterComponent,
        Page1Component,
        HomeComponent,
        HeaderComponent,
        NewsComponent,
        NewsDetailComponent,
        AboutComponent,
        ContactComponent,
        ServiceComponent,
        LoginComponent,
        ForgetPasswordComponent,
        RegisterPeopleComponent,
        RegisterPeopleOtpComponent,
        ResetPasswordComponent,
        FooterNewComponent,
        FooterReDesignComponent,
        PagenotfoundComponent,
        MainHomeComponent,
        HeaderNewComponent,
        HomeNewComponent,   
        HeaderMainComponent,
        HeaderReDesignComponent,
        MainRegisterComponent,
        HeaderRegisterComponent,
        ViewCaseComponent,
        HomeVisibleComponent,


        FaqComponent,
    ],
    imports: [
        DxiItemModule,
        DxTooltipModule,
        AngularResizedEventModule,
        FormsModule,
        CommonModule,
        LayoutHomeRoutingModule,
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
        FormsModule,
        NotifierModule.withConfig(customNotifierOptions),
        NgxPaginationModule,
        LayoutDesktopModule,
        CountdownModule,


    ], schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LayoutHomeModule { }
