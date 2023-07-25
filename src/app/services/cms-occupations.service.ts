import { Inject, Injectable } from '@angular/core';
import { EformRequestFactory, EFORM_REQUEST } from 'eform-share';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CmsOccupationsService {

    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory) { }

    public getOccupations(): Observable<IOcupationsInfo[]> {
        return this._req<IOcupationsInfo[]>('CmsOccupations')
            .disableCriticalDialogError().get();
    }
    public getOccupationsById(id: number): Observable<IOcupationsInfo> {
        return this._req<IOcupationsInfo>('CmsOccupations/' + id)
            .disableCriticalDialogError().get();
    }

    public putOccupations(id: number, param: any): Observable<IOcupationsInfo> {
        return this._req<IOcupationsInfo>('CmsOccupations/' + id)
            .body(param)
            .disableCriticalDialogError().put();
    }


    public postOccupations(param: any): Observable<IOcupationsInfo> {
        return this._req<IOcupationsInfo>('CmsOccupations')
            .body(param)
            .disableCriticalDialogError().post();
    }
}

export interface IOcupationsInfo {
    OCCUPATIONS_ID?: number;
    OCCUPATIONS_CODE?: string;
    OCCUPATIONS_NAME?: string;
    RECORD_STATUS?: string;
    DEL_FLAG?: string;
    CREATE_USER_ID?: number;
    CREATE_DATE?: string;
    UPDATE_USER_ID?: number;
    UPDATE_DATE?: string;
}
