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
    DxGalleryModule,
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
import { MainReDesignComponent } from './components/re-design/main-re-design/main-re-design.component';
import { BoxFrameComponent } from './components/re-design/main-re-design/box-frame/box-frame.component';
import { BoxFrameSecondComponent } from './components/re-design/main-re-design/box-frame-second/box-frame-second.component';
import { ResponsiveHelperComponent } from './components/re-design/responsive-helper/responsive-helper.component';
import { RequestfreezeComponent } from './components/re-design/requestfreeze/requestfreeze.component';
import { ProtectCyberComponent } from './components/re-design/protect-cyber/protect-cyber.component';
import { SecurityServiceComponent } from './components/re-design/security-service/security-service.component';
import { NewsCyberComponent } from './components/re-design/news-cyber/news-cyber.component';
import { DetailNewsComponent } from './components/re-design/news-all/detail-news/detail-news.component';
import { PageNewsComponent } from './components/re-design/news-all/page-news/page-news.component';
import { QapageComponent } from './components/re-design/qapage/qapage.component';
import { ThaiDatePipe } from 'src/app/components/pipe/thaiDate.pipe';
import { BoxFrameThridComponent } from './components/re-design/main-re-design/box-frame-thrid/box-frame-thrid.component';
import { BoxSeniorCyberComponent } from './components/re-design/main-re-design/box-senior-cyber/box-senior-cyber.component';
import { SecurityBoxComponent } from './components/re-design/components/security-box/security-box.component';
import { NewsBoxComponent } from './components/re-design/components/news-box/news-box.component';
import { ServiceDetailComponent } from './components/re-design/service-detail/service-detail.component';
import { TotopbtnComponent } from './components/re-design/components/totopbtn/totopbtn.component';
import { ProtectCyberMobileComponent } from './components/re-design/protect-cyber/protect-cyber-mobile/protect-cyber-mobile.component';
import { ProtectCyberTabletComponent } from './components/re-design/protect-cyber/protect-cyber-tablet/protect-cyber-tablet.component';

import { PhoneappcomComponent } from './components/re-design/phoneappcom/phoneappcom.component';
import { NewsCyberMobileComponent } from './components/re-design/news-cyber/news-cyber-mobile/news-cyber-mobile.component';
import { NewsCyberTabletComponent } from './components/re-design/news-cyber/news-cyber-tablet/news-cyber-tablet.component';
import { SecurityServiceMobileComponent } from './components/re-design/security-service/security-service-mobile/security-service-mobile.component';
import { SecurityServiceTabletComponent } from './components/re-design/security-service/security-service-tablet/security-service-tablet.component';
import { BoxFrameSecondMobileComponent } from './components/re-design/main-re-design/box-frame-second/box-frame-second-mobile/box-frame-second-mobile.component';
import { BoxFrameSecondTabletComponent } from './components/re-design/main-re-design/box-frame-second/box-frame-second-tablet/box-frame-second-tablet.component';
import { BoxFrameThridMobileComponent } from './components/re-design/main-re-design/box-frame-thrid/box-frame-thrid-mobile/box-frame-thrid-mobile.component';
import { BoxFrameThridTabletComponent } from './components/re-design/main-re-design/box-frame-thrid/box-frame-thrid-tablet/box-frame-thrid-tablet.component';
import { BoxFrameMobileComponent } from './components/re-design/main-re-design/box-frame/box-frame-mobile/box-frame-mobile.component';
import { BoxFrameTabletComponent } from './components/re-design/main-re-design/box-frame/box-frame-tablet/box-frame-tablet.component';
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
        RequestfreezeComponent,
        MainReDesignComponent,
        FaqComponent,
        BoxFrameComponent,
        BoxFrameTabletComponent,
        BoxFrameMobileComponent,
        BoxFrameSecondComponent,
        BoxFrameSecondMobileComponent,
        BoxFrameSecondTabletComponent,
        BoxFrameThridComponent,
        BoxFrameThridMobileComponent,
        BoxFrameThridTabletComponent,
        BoxSeniorCyberComponent,
        ResponsiveHelperComponent,
        ProtectCyberComponent,
        ProtectCyberMobileComponent,
        ProtectCyberTabletComponent,
        SecurityServiceComponent,
        SecurityServiceTabletComponent,
        SecurityServiceMobileComponent,
        PageNewsComponent,
        DetailNewsComponent,
        NewsCyberComponent,
        NewsCyberMobileComponent,
        NewsCyberTabletComponent,
        QapageComponent,
        ThaiDatePipe,
        SecurityBoxComponent,
        NewsBoxComponent,
        ServiceDetailComponent,
        TotopbtnComponent,
        PhoneappcomComponent
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
        DxGalleryModule,
        DxTemplateModule,
        FormsModule,
        NotifierModule.withConfig(customNotifierOptions),
        NgxPaginationModule,
        LayoutDesktopModule,
        CountdownModule,


    ], schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports: [ThaiDatePipe]
})
export class LayoutHomeModule { }
