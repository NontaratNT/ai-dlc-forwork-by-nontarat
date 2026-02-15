/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { Injectable } from '@angular/core';
import { req } from 'share-ui';
import { Observable } from 'rxjs';
import { IDistrictInfo } from './district.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProvinceService {

    constructor() { }

    public GetProvince(includeStatus = true): Observable<IProvinceinfo[]> {
        return req<IProvinceinfo[]>('CmsProvince')
        // .host(environment.config.baseConfig.urlgdcc)
            .queryString({ RecordStatus: <any>includeStatus })
            .disableCriticalDialogError().get();
    }

    public GetDistrictofProvince(provice: number): Observable<IDistrictInfo[]> {
        return req<IDistrictInfo[]>('CmsProvince/' + provice + '/district')
        // .host(environment.config.baseConfig.urlgdcc)
        .disableCriticalDialogError().get();
    }

}


export interface IProvinceinfo {

    PROVINCE_ID?: number;
    PROVINCE_NAME_THA?: string;
    PROVINCE_NAME_ENG?: string;
    REGION_ID?: number;
    RECORD_STATUS?: string;
}
