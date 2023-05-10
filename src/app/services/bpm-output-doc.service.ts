import { EFORM_REQUEST, EformRequestFactory } from 'eform-share';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
    providedIn: 'root'
})
export class BpmOutputDocService {

    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory) { }
    public get(): Observable<IBPMOutPutDoc> {
        return this._req<IBPMOutPutDoc>().api('BpmOutputDoc')
            .queryString({ personalId: User.Current.PersonalId})
            .get();
    }
}
export interface IBPMOutPutDoc {
    OUTPUT_DOC_ID?: number;
    INST_ID?: number;
    OUTPUT_DOC_NAME?: string;
    OUTPUT_DOC_DATE?: string;
    OUTPUT_DOC_PATH?: string;
    WF_INSTANCE_ID?: string;
    RECORD_STATUS? : string;
    DEL_FLAG?: string;
    OUTPUT_DOC_TYPE_ID?: number;
    PERSONAL_ID?: number;
}
