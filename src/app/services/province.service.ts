/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { Injectable } from '@angular/core';
import { req } from 'share-ui';
import { Observable } from 'rxjs';
import { IDistrictInfo } from './district.service';

@Injectable({
    providedIn: 'root'
})
export class ProvinceService {

    constructor() { }

    public GetProvince(includeStatus = true): Observable<IProvinceinfo[]> {
        return req<IProvinceinfo[]>('CmsProvince')
            .queryString({ RecordStatus: <any>includeStatus })
            .get();
    }

    public GetDistrictofProvince(provice: number): Observable<IDistrictInfo[]> {
        return req<IDistrictInfo[]>('CmsProvince/' + provice + '/district').get();
    }

}


export interface IProvinceinfo {

    PROVINCE_ID?: number;
    PROVINCE_NAME_THA?: string;
    PROVINCE_NAME_ENG?: string;
    REGION_ID?: number;
    RECORD_STATUS?: string;
}
