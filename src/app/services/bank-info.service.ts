import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { EformRequestFactory, EFORM_REQUEST } from 'eform-share';
import { Observable } from 'rxjs';
import { IPagingResult, req } from 'share-ui';
import { environment } from 'src/environments/environment.az-prod';

@Injectable({
    providedIn: 'root'
})
export class BankInfoService {

    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory,private http: HttpClient) { }

    public GetBankInfo(): Observable<any[]> {
        return req<any[]>('CmsBankInfo').host(environment.config.baseConfig.urlgdcc)
            .disableCriticalDialogError().get();
    }
    public GetBankWayOtherInfo(): Observable<any[]> {
        return req<any[]>('CmsTrasferType').host(environment.config.baseConfig.urlgdcc)
            .disableCriticalDialogError().get();
    }
    public GetBankOtherInfo(): Observable<any[]> {
        return req<any[]>('CmsBankOther').host(environment.config.baseConfig.urlgdcc)
            .disableCriticalDialogError().get();
    }
    public GetBankOrg(BankId: number): Observable<any[]> {
        return this._req<any[]>('CmsOrganizeBank')
            .queryString({BankId})
            .disableCriticalDialogError().get();
    }
    public GetBankOrgStation(StationId: number): Observable<any[]> {
        return this._req<any[]>('CmsOrganize/station')
            .queryString({StationId})
            .disableCriticalDialogError().get();
    }
    public GetSocialInfo(): Observable<any[]> {
        return req<any[]>('CmsSocialInfo')
            .disableCriticalDialogError().get();
    }
    public GetNearStation(): Observable<any[]> {
        return this._req<any[]>('CmsOrganize/orgProvince').host(environment.config.baseConfig.urlgdcceform)
            .disableCriticalDialogError().get();
    }

    public SearchNearStation(searchObj: any, offset: number = 0, length: number = 10): Observable<IPagingResult<any>> {
        return this._req<IPagingResult<any>>("CmsOrganize/search")
            .body({ Condition: searchObj, Offset: offset, Length: length })
            .disableCriticalDialogError().post();
    }

    public GetLanguage(): Observable<any[]> {
        return req<any[]>('CmsCaseLanguage').host(environment.config.baseConfig.urlgdcc)
            .disableCriticalDialogError().get();
    }
    public GetCaseChannel(): Observable<any[]> {
        return req<any[]>('CmsChannel').host(environment.config.baseConfig.urlgdcc)
            .disableCriticalDialogError().get();
    }
    public GetCaseType(): Observable<any[]> {
        return req<any[]>('CmsCaseType').host(environment.config.baseConfig.urlgdcc)
            .disableCriticalDialogError().get();
    }


    public GetBankBranch(id: number): Observable<IBankBranch[]> {
        return req<IBankBranch[]>(`CmsBankBranch/${id}/bankId`).host(environment.config.baseConfig.urlgdcc)
            .disableCriticalDialogError().get();
    }
    public GetBankInfoByName(Name:string): Observable<any[]> {
        return req<any[]>(`CmsBankInfo/${Name}`).host(environment.config.baseConfig.urlgdcc)
            .disableCriticalDialogError().get();
    }
    public GetBankTrackNo(no:string): Observable<any> {
        // return req<any[]>(`CmsBankInfo/bank-trackno/${no}`)
        //     .disableCriticalDialogError().get();
        return this.http.get<any>(`${environment.config.baseConfig.urlgdcc}/CmsBankInfo/bank-trackno/${no}`);
    }
}

export interface IBankBranch{
    BANK_BRANCH_ID: number;
    BANK_BRANCH_NAME: string;
}

