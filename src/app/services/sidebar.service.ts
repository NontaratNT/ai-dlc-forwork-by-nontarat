import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { WorkflowService } from 'eform-share';
import { SidebarComponent } from '../components/layout/sidebar/sidebar.component';

export abstract class SidebarInterface {
    abstract updateTaskNotification(username: string, groupName: string): Promise<void>;
    abstract refreshTaskNotification(): Promise<void>;
}


@Injectable()
export class SidebarService extends SidebarInterface {
    _sidebarComponent: SidebarComponent;
    private _userInfo;
    constructor(private _workflowServ: WorkflowService, private _jwtServ: JwtHelperService) {
        super();
        this._userInfo = this._jwtServ.decodeToken(sessionStorage.getItem("token"));
    }

    async updateTaskNotification(username: string, groupName: string): Promise<void> {
        const c = await this._workflowServ.getTaskUserCount(username, groupName).toPromise();
        this._sidebarComponent.updateNotiCount("my-task", c.MyTask ? c.MyTask : undefined);
        this._sidebarComponent.updateNotiCount("my-group-task", c.GroupTask ? c.GroupTask : undefined);
    }

    refreshTaskNotification(): Promise<void> {
        return this.updateTaskNotification(this._userInfo.UserName, "off01");
    }

}
