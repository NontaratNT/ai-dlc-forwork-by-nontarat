import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/guard/auth-guard";
import { AppointmentHistoryComponent } from "./components/appointment-history/appointment-history.component";
import { IssueOnlineEditComponent } from "./components/issue-online-edit/issue-online-edit.component";
import { IssueOnlineWithdrawCaseComponent } from "./components/issue-online-withdraw-case/issue-online-withdraw-case.component";
import { IssueOnlineComponent } from "./components/issue-online/issue-online.component";
import { NotificationListComponent } from "./components/notification-list/notification-list.component";
import { PersonalComponent } from "./components/personal/personal.component";
import { ProblemOnlineComponent } from "./components/problem-online/problem-online.component";
import { TaskAppointmentComponent } from "./components/task-appointment/task-appointment.component";
import { TasklistComponent } from "./components/tasklist/tasklist.component";
import { MainComponent } from "./layout/main/main.component";
import { LoginThaiIDComponent } from "./components/login-thai-id/login-thai-id.component";


const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        canActivate: [ AuthGuard ],
        children: [
            {
                path: 'personal',
                component: PersonalComponent,
            },
            {
                path: 'task-list',
                component: TasklistComponent,
            },

            {
                path: 'task-notification',
                component: NotificationListComponent,
            },
            {
                path: 'task-appointment/:appointmentId',
                component: TaskAppointmentComponent,
            },
            // {
            //     path: 'issue',
            //     component: DashboardCaseComponent,
            // },
            {
                // path: 'issue-online/:userType',
                path: 'issue-online/1',
                component: IssueOnlineComponent,
            },
            {
                path: 'issue-online-view',
                component: IssueOnlineEditComponent,
            },
            {
                path: 'appointment-history',
                component: AppointmentHistoryComponent,
            },
            {
                path: 'problem-online',
                component: ProblemOnlineComponent,
            },
            
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LayoutDesktopRoutingModule {}
