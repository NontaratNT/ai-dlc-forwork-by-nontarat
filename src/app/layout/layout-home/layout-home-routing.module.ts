import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewCaseComponent } from 'src/app/components/page/view-case/view-case.component';
import { LoginGuard } from 'src/app/guard/login.guard';
// import { NewReportComponent } from '../layout-mobile/component/page/new-report/new-report.component';
// import { AboutComponent } from './components/about/about.component';
// import { ContactComponent } from './components/contact/contact.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { HomeNewComponent } from './components/home-new/home-new.component';
import { HomeVisibleComponent } from './components/home-visible/home-visible.component';
// import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NewsDetailComponent } from './components/news-detail/news-detail.component';
import { NewsComponent } from './components/news/news.component';
// import { NewsDetailComponent } from './components/news-detail/news-detail.component';
// import { NewsComponent } from './components/news/news.component';
// import { Page1Component } from './components/page1/page1.component';
import { RegisterPeopleComponent } from './components/register-people/register-people.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { MainHomeComponent } from './layout/main-home/main-home.component';
import { MainRegisterComponent } from './layout/main-register/main-register.component';
// import { ServiceComponent } from './components/service/service.component';
import { MainComponent } from './layout/main/main.component';
import { LoginThaiIDComponent } from '../layout-desktop/components/login-thai-id/login-thai-id.component';
import { DetailNewsComponent } from './components/re-design/news-all/detail-news/detail-news.component';
import { PageNewsComponent } from './components/re-design/news-all/page-news/page-news.component';

const routes: Routes = [
    {
        path: '',
        component: MainHomeComponent,
        children: [
            { path: '', component: HomeNewComponent },//ปิดไว้กรณีปรับปรุงเว็บ วันที่ 17 มีนาคม 2566
            // { path: '', component: HomeVisibleComponent },//ใช้กรณีปิดเว็บเท่านั้นถ้าเปิดใช้งานต้องปิด tag นี้ไป
            // { path: '', component: HomeComponent },
            // { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
            // { path: 'register', component: RegisterPeopleComponent, canActivate: [LoginGuard] },
            // { path: 'reset-password', component: ResetPasswordComponent, canActivate: [LoginGuard] },
            // { path: 'news', component: NewsComponent },
            // { path: 'news/detail/:id', component: NewsDetailComponent },
            // { path: 'about', component: AboutComponent },
            // { path: 'contact', component: ContactComponent },
            // { path: 'service', component: ServiceComponent },

        ],


    },
    { path: 'dtn', component: DetailNewsComponent },
    { path: 'news', component: PageNewsComponent },

    // { path: 'news', component: NewsComponent },
    { path: 'news/detail/:id', component: NewsDetailComponent },
    {
        //path login thai id    
        path: 'login/thaiD',
        component: LoginThaiIDComponent,
    },
    {
        path: '',
        component: MainComponent,
        canActivate: [LoginGuard],
        children: [
            { path: 'forget-password', component: ForgetPasswordComponent, },
            { path: 'login', component: LoginComponent },//ปิดไว้กรณีปรับปรุงเว็บ วันที่ 17 มีนาคม 2566
            { path: 'login-admin', component: LoginComponent },//เปิดไว้กรณีปรับปรุงเว็บ วันที่ 17 มีนาคม 2566
            // { path: 'login', component: HomeVisibleComponent },//ใช้กรณีปิดเว็บเท่านั้นถ้าเปิดใช้งานต้องปิด tag นี้ไป
            { path: 'reset-password', component: ResetPasswordComponent },
            { path: 'view-case', component: ViewCaseComponent },
        ]
    },
    {
        path: '',
        component: MainRegisterComponent,
        canActivate: [LoginGuard],
        children: [
            { path: 'register', component: RegisterPeopleComponent },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutHomeRoutingModule { }
