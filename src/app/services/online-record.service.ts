import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpStatusResult, HttpStatusResultValue, req } from 'share-ui';
import { OnlineRecordInfo, OnlineRecordParam } from '../common/@type/online-record';
import { User } from './user';

@Injectable({
    providedIn: 'root'
})
export class OnlineRecordService {

    constructor() { }

    gets() {
        return req<OnlineRecordInfo[]>("CmsOnlineRecordInfo").queryString({personalId: User.Current.PersonalId})
            .disableCriticalDialogError().get();
    }

    create(param: Partial<OnlineRecordParam>): Observable<HttpStatusResultValue<number>> {
        return req("CmsOnlineRecordInfo")
            .useSystemResult<HttpStatusResultValue<number>>()
            .disableCriticalDialogError()
            .body(param)
            .disableCriticalDialogError().post();
    }

    update(caseId: number, param: Partial<OnlineRecordParam>): Observable<HttpStatusResult> {
        return req(`CmsOnlineRecordInfo/${caseId}`)
            .useSystemResult<HttpStatusResult>()
            .disableCriticalDialogError()
            .body(param)
            .disableCriticalDialogError().put();
    }

}
