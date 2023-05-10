import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth-guard';
import { PersonalComponent } from '../layout-desktop/components/personal/personal.component';
import { NewReportComponent } from './component/page/new-report/new-report.component';
import { ProfileComponent } from './component/page/profile/profile.component';
import { CreateReportComponent } from './component/page/RequestReport/create-report/create-report.component';
import { DetailAppoveComponent } from './component/page/RequestReport/detail-appove/detail-appove.component';
import { IssueOnlineContainerComponent } from './component/page/RequestReport/issue-online-container/issue-online-container.component';
import { IssueOnlineEditComponent } from './component/page/RequestReport/issue-online-edit/issue-online-edit.component';
import { TrackStatusComponent } from './component/page/track-status/track-status.component';
import { Page2mComponent } from './component/page2m/page2m.component';
import { MainComponent } from './layout/main/main.component';

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'issue',
                component: NewReportComponent,
            }, {
                path: 'track-status?openExternalBrowser=1',
                component: TrackStatusComponent,
            },
            {
                path: 'page2',
                component: Page2mComponent,
            },

            {
                path: 'appove-1',
                component: IssueOnlineContainerComponent,
            },
            {
                path: 'issue-online/:userType',
                component: CreateReportComponent,
            },
            {
                path: 'issue-online/:instId/:documentId',
                component: IssueOnlineEditComponent,
            }, {
                path: 'personal',
                component: ProfileComponent,
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutMobileRoutingModule { }
