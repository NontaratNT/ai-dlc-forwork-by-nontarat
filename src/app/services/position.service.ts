import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { req } from 'share-ui';


@Injectable({
    providedIn: 'root'
})
export class PositionService {

    constructor() { }

    public getPosition(includeStatus = true): Observable<IPositionInfo[]> {
        return req<IPositionInfo[]>('CmsPosition')
            .queryString({ RecordStatus: includeStatus as any })
            .disableCriticalDialogError().get();
    }
}



export interface IPositionInfo {
    POSITION_ID?: number;
    POSITION_CODE?: string;
    POSITION_NAME?: string;
    RECORD_STATUS?: string;
}

