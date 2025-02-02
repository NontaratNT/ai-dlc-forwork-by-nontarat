import "flatpickr/dist/l10n/th";
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { EformShareModule } from 'eform-share';
import { BetimesHttpInterceptor, ShareUiModule } from 'share-ui';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { locale } from "moment";
import { RecaptchaModule, RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from "ng-recaptcha";
import {
    DxButtonModule, DxDataGridModule, DxSelectBoxModule, DxDateBoxModule,
    DxDrawerModule, DxCheckBoxModule, DxFormModule, DxLoadPanelModule, DxRadioGroupModule,
    DxMultiViewModule, DxNumberBoxModule, DxTextBoxModule, DxTreeViewModule, DxTreeListModule,
    DxPopupModule, DxTextAreaModule, DxTabPanelModule, DxSwitchModule, DxScrollViewModule, DxFileUploaderModule,
    DxTemplateModule,
    DxToolbarModule, DxValidatorModule
} from "devextreme-angular";
import { RouterModule } from '@angular/router';
import { DxiItemModule } from 'devextreme-angular/ui/nested';
import { FormioModule } from '@formio/angular';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
    GoogleLoginProvider,
    FacebookLoginProvider
} from 'angularx-social-login';
import { NgxPaginationModule } from 'ngx-pagination';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { RefreshTokenInterceptor } from './interceptor/refresh-token-interceptor';
import { CookieStorage } from './common/cookie';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CommonModule, DatePipe } from '@angular/common';
import { LayoutDesktopModule } from './layout/layout-desktop/layout-desktop.module';
import { LayoutMobileModule } from './layout/layout-mobile/layout-mobile.module';
import { LayoutHomeModule } from './layout/layout-home/layout-home.module';
import { CountdownModule } from "ngx-countdown";
import { NgxImageCompressService } from "ngx-image-compress";
// eslint-disable-next-line prefer-arrow/./layout/layout-home/components/re-design/main-re-design/box-senior-cyber/box-senior-cyber.component
export function rootLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

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
        AppComponent,

    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ShareUiModule,
        CommonModule,
        FormioModule,
        DxFormModule,
        DxTextBoxModule,
        DxButtonModule,
        DxTreeViewModule,
        DxMultiViewModule,
        DxDataGridModule,
        DxCheckBoxModule,
        DxSelectBoxModule,
        DxDateBoxModule,
        DxSwitchModule,
        DxDrawerModule,
        RouterModule,
        DxLoadPanelModule,
        DxTemplateModule,
        DxiItemModule,
        DxNumberBoxModule,
        DxTextAreaModule,
        SocialLoginModule,
        DxRadioGroupModule,
        DxTabPanelModule,
        RecaptchaModule,
        RecaptchaV3Module,
        CKEditorModule,
        DxScrollViewModule,
        DxToolbarModule,
        DxFileUploaderModule,
        NotifierModule.withConfig(customNotifierOptions),
        JwtModule.forRoot({
            jwtOptionsProvider: {
                provide: JWT_OPTIONS,
                useFactory: JwtOptionsFactory
            }
        }),
        ShareUiModule,
        EformShareModule.forRoot(environment.config as any),
        NgxPaginationModule,
        DxTreeListModule,
        DxPopupModule,
        CountdownModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: rootLoaderFactory,
                deps: [HttpClient]
            }
        }),
        LayoutDesktopModule,
        LayoutMobileModule,
        LayoutHomeModule,
        DxValidatorModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: BetimesHttpInterceptor, multi: true, },
        { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true },
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider(
                            '485627165592-dbc9u83ooj4477b789k0gi306ps85g22.apps.googleusercontent.com'
                        )
                    },
                    {
                        id: FacebookLoginProvider.PROVIDER_ID,
                        provider: new FacebookLoginProvider('2777914499189417')
                    }
                ]
            } as SocialAuthServiceConfig,
        },
        { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.config.recaptcha.siteKey },
        NgxImageCompressService,
        DatePipe,
    ],
    bootstrap: [AppComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
})
export class AppModule {
    constructor() {
        // Set locale
        locale('th-TH');
    }
}
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function JwtOptionsFactory() {
    const whitelist = [/.+/];
    return {
        tokenGetter: () => CookieStorage.accessToken?.Token,
        allowedDomains: whitelist,
        disallowedRoutes: [/user\/(auth|renew)$/]
    };
}
