import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpStatusResult, HttpStatusResultValue, req } from 'share-ui';
import { OnlineCaseInfo, OnlineCaseParam } from '../common/@type/online-case';
import { User } from './user';

@Injectable({
    providedIn: 'root'
})
export class OnlineCaseService {

    constructor() { }

    get() {
        return req<OnlineCaseInfo[]>("CmsOnlineCaseInfo").queryString({personalId: User.Current.PersonalId})
            .get();
    }

    getbyId(caseid: number): Observable<OnlineCaseInfo> {
        return req<OnlineCaseInfo>(`CmsOnlineCaseInfo/${caseid}`)
            .get();
    }


    create(param: Partial<OnlineCaseParam>): Observable<HttpStatusResultValue<number>> {
        return req("CmsOnlineCaseInfo")
            .useSystemResult<HttpStatusResultValue<number>>()
            .disableCriticalDialogError()
            .body(param)
            .post();
    }

    update(caseId: number, param: Partial<OnlineCaseParam>): Observable<HttpStatusResult> {
        return req(`CmsOnlineCaseInfo/${caseId}`)
            .useSystemResult<HttpStatusResult>()
            .disableCriticalDialogError()
            .body(param)
            .put();
    }
    // ส่งฟอร์มแบบ Angular
    public InsertData(param: any): Observable<any> {
        return req("CmsOnlineCaseInfo")
            .body(param)
            .post();
    }

    public InsertDataMQ(param: any): Observable<any> {
        return req("CmsOnlineCaseInfo/submit")
            .body(param)
            .post();
    }

    public UpdateData(caseId: number,param: any): Observable<any> {
        return req(`CmsOnlineCaseInfo/${caseId}`)
            .body(param)
            .put();
    }
    public GetOnlineRequest(caseId: number,): Observable<any> {
        return req(`CmsOnlineCaseInfoRequest/${caseId}`).get();

    }
    public CreateOnlineRequest(param: any): Observable<any> {
        return req('CmsOnlineCaseInfoRequest')
            .body(param)
            .post();
    }
}
