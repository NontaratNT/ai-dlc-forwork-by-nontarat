import { EFORM_REQUEST, EformRequestFactory } from 'eform-share';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { req } from 'share-ui';
import { User } from './user';
import { AnyRecord } from 'dns';
import { environment } from 'src/environments/environment';
import { CookieStorage } from '../common/cookie';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { trimObject } from '../common/helper';

@Injectable({
    providedIn: 'root'
})
export class BpmProcinstService {
    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory,private http: HttpClient) { }

    public getByPersonalId(groupStatusCode: string): Observable<any> {
        return this._req<any>().api('BpmProcInst')
            .queryString({ personalId: User.Current.PersonalId, GroupStatusCode: groupStatusCode})
            .disableCriticalDialogError().get();
    }
    public getTaskList(groupStatusCode: string): Observable<IBpmProcInst[]> {
        return this._req<IBpmProcInst[]>().api('BpmProcInst')
            .queryString({ personalId: User.Current.PersonalId, GroupStatusCode: groupStatusCode})
            .disableCriticalDialogError().get();
    }
    public getTaskListAndReject(filter: any): Observable<IBpmProcInst[]> {
        trimObject(filter);
        return this._req<IBpmProcInst[]>().api('BpmProcInst')
            .queryString(filter)
            .disableCriticalDialogError().get();
    }

    public getTaskListAndRejectMobile(filter: any): Observable<any> {
        return this._req<any>().api('BpmProcInst')
            .queryString(filter)
            .disableCriticalDialogError().get();
    }

    public getByFlowCode(groupStatusCode: string, flowcode: string): Observable<IBpmProcInst[]> {
        return this._req<IBpmProcInst[]>().api('BpmProcInst')
            .queryString({ personalId: User.Current.PersonalId, GroupStatusCode: groupStatusCode, flowCode: flowcode})
            .disableCriticalDialogError().get();
    }
    // public getByPersonalId(param: IBpmProcInst): Observable<IBpmProcInst> {
    //     return req<IBpmProcInst>('BpmProcInst')
    //         .queryString({ personalId: User.Current.PersonalId })
    //         .body(param)
    //         .get();
    // }
    public getByInstId(instid: number): Observable<any> {
        // return this._req<any>().api('BpmProcInst/'+instid)
        //     .disableCriticalDialogError().get();
        const newHeader = new HttpHeaders({Authorization: "Bearer " + CookieStorage.accessToken});
        return this.http.get<any>(`${environment.config.eFormHost}/Officer/BpmProcInst/${instid}`, {
            headers: newHeader
          });
    }


    // OS
    public userWithDrawCase(id: number, param: IWithdrawCase): Observable<any> {
        return this._req<IWithdrawCase>().api(`BpmProcInst/revoke/${id}`)
            .body(param)
            .disableCriticalDialogError().put();
    }

    // ถอนแจ้งความที่ gdcc
    public userWithDrawCasegdcc(id: number, param: IWithdrawCase): Observable<any> {
        // return this._req<IWithdrawCase>().api(`BpmProcInst/revoke/${id}`)
        //     .body(param)
        //     .disableCriticalDialogError().put();
        const newHeader = new HttpHeaders({Authorization: "Bearer " + CookieStorage.accessToken});
        return  this.http.put<IWithdrawCase>(`${environment.config.eFormHost}/Officer/BpmProcInst/revoke/${id}`, param);

    }

    // ถอนแจ้งความที่ gdcc
    public userSelectOrgGdcc( param: ISelectOrg): Observable<any> {
        const newHeader = new HttpHeaders({Authorization: "Bearer " + CookieStorage.accessToken});
        return  this.http.put<ISelectOrg>(`${environment.config.eFormHost}/Officer/BpmProcInst/Updateorgpersonal`, {
            headers: newHeader,
            params: param
          });
    }

    public userSelectOrg( param: ISelectOrg): Observable<any> {
        return this._req<IWithdrawCase>().api(`BpmProcInst/Updateorgpersonal`)
            .body(param)
            .disableCriticalDialogError().put();
    }

}

export interface ISelectOrg{
    organize_id?: number;
    inst_id?: number;
    personal_id?: number;
}

export interface IWithdrawCase{
    cateid?: number;
    citizencardnumber?: string;
    remark?: string;
    totalprice?: number;
}

export interface IBpmProcInst {
    INST_ID?: number;
    FLOW_ID?: number;
    CATEGORY_ID?: number;
    PERSONAL_ID?: number;
    ORG_ID?: number;
    GROUP_STATUS_ID?: number;
    TRACKING_CODE?: string;
    STATUS_CODE?: string;
    GROUP_STATUS_CODE?: string;
    DATA_ID?: number;
    SYSTEM_CODE?: string;
    DOCUMENT_ID?: string;
    WF_INSTANCE_ID?: string;
    WF_DEFINITION_ID?: string;
    REMARK?: string;
    RECORD_STATUS?: string;
    DEL_FLAG?: string;
    CREATE_USER_ID?: number;
    CREATE_DATE?: string;
    CREATE_DATE_TEXT?: string;
    UPDATE_USER_ID?: number;
    UPDATE_DATE?: string;
    FORM_NAME?: string;
    FLOW_NAME?: string;
    PERSONAL_FULL_NAME?: string;
    ORGANIZE_NAME_THA?: string;
    ORGANIZE_LEVEL?: number;
    CATEGORY_NAME?: string;
    STATUS_NAME?: string;
    FORM_IO_ID?: string;
    FLOW_SLA?: string;
    FLOW_UNIT?: string;
    GROUP_STATUS_NAME?: string;
    OFFICER_FULL_NAME?: string;
    PERSONAL_TEL_NO?: string;
    REJECT_FLAG?: string;
    REJECT_REMARK?: string;
    APP_PERSONAL_FULLNAME?: string;
    APPOINTMENT_PERSONAL_TEL_NO?: string;
    OPTIONAL_DATA?: string;
    OPTIONAL_DATA_REPLACE?: string;
}


export interface IBpmProcInstFilter {
    personalId: number;
    GroupStatusCode: string;
    StatusRejectFlag?: boolean;
    GeStatusOrRejectFlag?: boolean;
    StatusCode ?: string;
}
