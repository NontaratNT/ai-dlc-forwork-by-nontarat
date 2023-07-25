import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPagingResult, req } from 'share-ui';

@Injectable({
    providedIn: 'root'
})
export class PostcodeService {

    constructor() { }

    public GetPostcode(includeStatus = true): Observable<IPostcodeInfo[]> {
        return req<IPostcodeInfo[]>('CmsPostCode')
            .queryString({ RecordStatus: includeStatus as any })
            .disableCriticalDialogError().get();
    }
}


export interface IPostcodeInfo {

    POSTCODE_ID?: number;
    POSTCODE_CODE?: string;
    PROVINCE_ID?: number;
    DISTRICT_ID?: number;
    SUB_DISTRICT_ID?: number;
    SUB_DISTRICT_NAME_THA?: string;
    RECORD_STATUS?: string;
}
