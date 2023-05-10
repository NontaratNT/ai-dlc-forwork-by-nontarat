import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { req } from 'share-ui';

@Injectable({
    providedIn: 'root'
})
export class PositionMngService {

    constructor() { }

    public getPositionMng(includeStatus = true): Observable<IPositionMngInfo[]> {
        return req<IPositionMngInfo[]>('CmsPositionMng')
            .queryString({ RecordStatus: includeStatus as any })
            .get();
    }
}


export interface IPositionMngInfo {
    POSITION_MNG_ID?: number;
    POSITION_MNG_CODE?: string;
    POSITION_MNG_NAME?: string;
    RECORD_STATUS?: string;
}
