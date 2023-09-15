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
            .disableCriticalDialogError().get();
    }

    getbyId(caseid: number): Observable<OnlineCaseInfo> {
        return req<OnlineCaseInfo>(`CmsOnlineCaseInfo/${caseid}`)
            .disableCriticalDialogError().get();
    }

    getbycaseId(caseid: number): Observable<any> {
        return req<any>(`CmsOnlineCaseInfo/getbycaseid/${caseid}`)
            .disableCriticalDialogError().get();
    }
    create(param: Partial<OnlineCaseParam>): Observable<HttpStatusResultValue<number>> {
        return req("CmsOnlineCaseInfo")
            .useSystemResult<HttpStatusResultValue<number>>()
            .disableCriticalDialogError()
            .body(param)
            .disableCriticalDialogError().post();
    }

    update(caseId: number, param: Partial<OnlineCaseParam>): Observable<HttpStatusResult> {
        return req(`CmsOnlineCaseInfo/${caseId}`)
            .useSystemResult<HttpStatusResult>()
            .disableCriticalDialogError()
            .body(param)
            .disableCriticalDialogError().put();
    }
    // ส่งฟอร์มแบบ Angular
    public InsertData(param: any): Observable<any> {
        return req("CmsOnlineCaseInfo")
            .body(param)
            .disableCriticalDialogError().post();
    }

    public InsertDataMQ(param: any): Observable<any> {
        return req("CmsOnlineCaseInfo/submit")
            .body(param)
            .disableCriticalDialogError().post();
    }



    public UpdateData(caseId: number,param: any): Observable<any> {
        return req(`CmsOnlineCaseInfo/${caseId}`)
            .body(param)
            .disableCriticalDialogError().put();
    }


    public GetOnlineRequest(caseId: number,): Observable<any> {
        return req(`CmsOnlineCaseInfoRequest/${caseId}`).disableCriticalDialogError().get();

    }
    public CreateOnlineRequest(param: any): Observable<any> {
        return req('CmsOnlineCaseInfoRequest')
            .body(param)
            .disableCriticalDialogError().post();
    }

    public Getcasemoney(caseId: number,): Observable<any> {
        return req(`CmsOnlineCaseInfo/casemoney/${caseId}`).disableCriticalDialogError().get();

    }
    public Getcasechannel(caseId: number,): Observable<any> {
        return req(`CmsOnlineCaseInfo/casechannel/${caseId}`).disableCriticalDialogError().get();
    }
    public GetcaseQuestionare(caseId: number,): Observable<any> {
        return req(`CmsOnlineCaseInfo/casequestionate/${caseId}`).disableCriticalDialogError().get();
    }
    public getLocation(caseid: number): Observable<LocationInfo> {
        return req<LocationInfo>(`CmsOnlineCaseInfo/caselocation/${caseid}`)
            .disableCriticalDialogError().get();
    }
    public getBankRef(caseid: number): Observable<any> {
        return req<any>(`CmsOnlineCaseInfo/bankref/${caseid}`)
            .disableCriticalDialogError().get();
    }
}

export interface LocationInfo {
    CASE_LOCATION_PROVINCE_ID ?: number;
    CASE_LOCATION_CASE_INFORMER_ADDRESS ?: string;
    CASE_LOCATION_PROVINCE_NAME_THA ?: string;
    CASE_LOCATION_DISTRICT_ID ?: number;
    CASE_LOCATION_DISTRICT_NAME_THA ?: string;
    CASE_LOCATION_SUB_DISTRICT_ID ?: number;
    CASE_LOCATION_SUB_DISTRICT_NAME_THA ?: string;
    CASE_LOCATION_ADDRESS ?: string;
    CASE_LOCATION_TRANSFER_PROVINCE_ID?: number;
    CASE_LOCATION_TRANSFER_CASE_INFORMER_ADDRESS ?: string;
    CASE_LOCATION_TRANSFER_PROVINCE_NAME_THA ?: string;
    CASE_LOCATION_TRANSFER_DISTRICT_ID ?: number;
    CASE_LOCATION_TRANSFER_DISTRICT_NAME_THA ?: string;
    CASE_LOCATION_TRANSFER_SUB_DISTRICT_ID ?: number;
    CASE_LOCATION_TRANSFER_SUB_DISTRICT_NAME_THA ?: string;
    CASE_LOCATION_TRANSFER_ADDRESS ?: string;
}
