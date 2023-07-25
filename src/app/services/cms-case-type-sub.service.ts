import { Inject, Injectable } from '@angular/core';
import { EformRequestFactory, EFORM_REQUEST } from 'eform-share';
import { Observable } from 'rxjs';
import { req } from 'share-ui';

@Injectable({
    providedIn: 'root'
})
export class CmsCaseTypeSubService {

    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory) { }

    public Get(caseTypeId = 0): Observable<ICaseTypeSub[]> {
        return req<ICaseTypeSub[]>(`CmsCaseTypeSub/${caseTypeId}`)
            .disableCriticalDialogError().get();
    }

}

export interface ICaseTypeSub {
    CASE_TYPE_ID: number;
    CASE_TYPE_SUB_ABBR: string;
    CASE_TYPE_SUB_CODE: string;
    CASE_TYPE_SUB_DESC: string;
    CASE_TYPE_SUB_ID: number;
    CASE_TYPE_SUB_NAME: string;
}

