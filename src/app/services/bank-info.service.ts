import { Inject, Injectable } from '@angular/core';
import { EformRequestFactory, EFORM_REQUEST } from 'eform-share';
import { Observable } from 'rxjs';
import { IPagingResult, req } from 'share-ui';

@Injectable({
    providedIn: 'root'
})
export class BankInfoService {

    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory) { }

    public GetBankInfo(): Observable<any[]> {
        return req<any[]>('CmsBankInfo')
            .get();
    }
    public GetBankWayOtherInfo(): Observable<any[]> {
        return req<any[]>('CmsTrasferType')
            .get();
    }
    public GetBankOtherInfo(): Observable<any[]> {
        return req<any[]>('CmsBankOther')
            .get();
    }
    public GetBankOrg(BankId: number): Observable<any[]> {
        return this._req<any[]>('CmsOrganizeBank')
            .queryString({BankId})
            .get();
    }
    public GetBankOrgStation(StationId: number): Observable<any[]> {
        return this._req<any[]>('CmsOrganize/station')
            .queryString({StationId})
            .get();
    }
    public GetSocialInfo(): Observable<any[]> {
        return req<any[]>('CmsSocialInfo')
            .get();
    }
    public GetNearStation(): Observable<any[]> {
        return this._req<any[]>('CmsOrganize/orgProvince')
            .get();
    }

    public SearchNearStation(searchObj: any, offset: number = 0, length: number = 10): Observable<IPagingResult<any>> {
        return this._req<IPagingResult<any>>("CmsOrganize/search")
            .body({ Condition: searchObj, Offset: offset, Length: length })
            .post();
    }

    public GetLanguage(): Observable<any[]> {
        return req<any[]>('CmsCaseLanguage')
            .get();
    }
    public GetCaseChannel(): Observable<any[]> {
        return req<any[]>('CmsChannel')
            .get();
    }
    public GetCaseType(): Observable<any[]> {
        return req<any[]>('CmsCaseType')
            .get();
    }


    public GetBankBranch(id: number): Observable<IBankBranch[]> {
        return req<IBankBranch[]>(`CmsBankBranch/${id}/bankId`)
            .get();
    }
}

export interface IBankBranch{
    BANK_BRANCH_ID: number;
    BANK_BRANCH_NAME: string;
}

