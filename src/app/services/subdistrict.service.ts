/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { Injectable } from '@angular/core';
import { IPagingResult, req } from 'share-ui';
import { Observable } from 'rxjs';
import { IPostcodeInfo } from './postcode.service';

@Injectable({
    providedIn: 'root'
})
export class SubdistrictService {

    constructor() { }

    public GetSubDistrict(includeStatus = true): Observable<ISubDistrictInfo[]> {
        return req<ISubDistrictInfo[]>('CmsSubDistrict')
            .queryString({ RecordStatus: <any>includeStatus })
            .get();
    }

    public GetPostCode(subdistrictId: number): Observable<IPostcodeInfo[]> {
        return req<IPostcodeInfo[]>('CmsSubDistrict/' + subdistrictId + '/post-code')
            .get();
    }

}


export interface ISubDistrictInfo {

    SUB_DISTRICT_ID?: number;
    SUB_DISTRICT_NAME_THA?: string;
    SUB_DISTRICT_NAME_ENG?: string;
    PROVINCE_ID?: number;
    DISTRICT_ID?: number;
    LAT?: number;
    LONG?: number;
    RECORD_STATUS?: string;
}

