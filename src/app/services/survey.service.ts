
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpStatusResultValue, req} from 'share-ui';
import {OnlineCaseInfo} from "../common/@type/online-case";

@Injectable({
    providedIn: 'root'
})
export class SurveyService {

    constructor() { }

    getSurveyByCaseId(caseId: number): Observable<any> {
        return req(`CmsSurvey?caseId=${caseId}`)
            .disableCriticalDialogError().get();
    }

    getSurveyByCaseIdAndCategoryId(caseId: number, categoryId: number): Observable<any> {
        return req(`CmsSurvey?caseId=${caseId}&categoryId=${categoryId}`)
            .disableCriticalDialogError().get();
    }

    getSurveyByCaseIdAndCategoryCode(caseId: number, categoryCode: string): Observable<any> {
        return req(`CmsSurvey?caseId=${caseId}&categoryCode=${categoryCode}`)
            .disableCriticalDialogError().get();
    }

    public postSurvey(param: any): Observable<HttpStatusResultValue<number>> {
        return req('CmsSurvey')
            .useSystemResult<HttpStatusResultValue<number>>()
            .disableCriticalDialogError()
            .body(param)
            .disableCriticalDialogError().post();
    }

}
