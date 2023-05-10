import { EFORM_REQUEST, EformRequestFactory } from 'eform-share';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { req } from 'share-ui';
import { User } from './user';

@Injectable({
    providedIn: 'root'
})
export class GroupStatusService {

    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory) { }

    public get(): Observable<any> {
        return this._req<any>().api('CmsGroupStatus')
            .get();
    }
    public getStatusAll(PersonalId: number): Observable<any[]> {
        return this._req<any[]>().api('BpmProcInst/workflow/task/group-status/count')
            .queryString({PersonalId})
            .get();
    }
    public getStatusAllAndReject(PersonalId: number): Observable<any[]> {
        return this._req<any[]>().api('BpmProcInst/workflow/task/group-status-infomer/count')
            .queryString({PersonalId})
            .get();
    }

}
export interface ICmsGroupStatus {
    GROUP_STATUS_ID: number;
    GROUP_SEQ: number;
    GROUP_STATUS_CODE: string;
    GROUP_STATUS_NAME: string;
    GROUP_ICON: string;
    RECORD_STATUS: string;
    DEL_FLAG: string;
    CREATE_USER_ID: number;
    CREATE_DATE: any;
    UPDATE_USER_ID: number;
    UPDATE_DATE: any;
}
