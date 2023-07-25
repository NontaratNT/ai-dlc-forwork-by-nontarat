/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { Inject, Injectable } from '@angular/core';
import { EformRequestFactory, EFORM_REQUEST } from 'eform-share';
import { Observable } from 'rxjs';
import { req } from 'share-ui';

@Injectable({
    providedIn: 'root'
})
export class TitleService {

    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory) { }

    public GetTitle(includeStatus = true): Observable<ITitleInfo[]> {
        return this._req<ITitleInfo[]>('CmsTitle')
            .queryString({ RecordStatus: <any>includeStatus })
            .disableCriticalDialogError().get();
    }

    public GetTitleInfomer(includeStatus = true): Observable<ITitleInfo[]> {
        return this._req<ITitleInfo[]>('CmsTitle/informer')
            .queryString({ RecordStatus: <any>includeStatus })
            .disableCriticalDialogError().get();
    }

    public putTakeBack(id: number, param: any): Observable<IReject> {
        return this._req<IReject>('BpmProcInst/' + id)
            .body(param)
            .disableCriticalDialogError().put();
    }
}

export interface ITitleInfo {
    TITLE_ID?: number;
    TITLE_CODE?: string;
    TITLE_NAME?: string;
    RECORD_STATUS?: string;
}


export interface IReject {
    REJECT_FLAG?: string;
    REJECT_REMARK?: string;
}


