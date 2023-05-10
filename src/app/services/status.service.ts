import { EFORM_REQUEST, EformRequestFactory } from 'eform-share';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { req } from 'share-ui';
import { User } from './user';

@Injectable({
    providedIn: 'root'
})
export class StatusService {

    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory) { }


    public getStatus(): Observable<ICmsStatus[]> {
        return this._req<ICmsStatus[]>().api('CmsStatus')
            .get();
    }

    public getStatusCode(statuscode: string): Observable<ICmsStatus[]> {
        return this._req<ICmsStatus[]>().api('CmsStatus')
            .queryString({ StatusCode: statuscode})
            .get();
    }
    public getStatusCount(statusCode: string): Observable<IBpmCountStatus[]> {
        return this._req<IBpmCountStatus[]>().api('BpmCountStatus')
            .queryString({  personalId: User.Current.PersonalId, StatusCode: statusCode})
            .get();
    }
}
export interface ICmsStatus {
    STATUS_ID?: number;
    STATUS_NAME?: string;
    GROUP_STATUS_ID?: number;
    RECORD_STATUS?: string;
    CREATE_USER_ID?: number;
    CREATE_DATE?: any;
    UPDATE_USER_ID?: number;
    UPDATE_DATE?: any;
    DEL_FLAG?: string;
    STATUS_SEQ?: number;
    STATUS_ICON?: string;
    STATUS_CODE?: string;
    GROUP_STATUS_CODE?: string;
}
export interface IBpmCountStatus {
    ROW_NUMBER?: number;
    STATUS_CODE?: string;
    RECORD_STATUS?: string;
    DEL_FLAG?: string;
    COUNTSTATUS_CODE?: number;
}
