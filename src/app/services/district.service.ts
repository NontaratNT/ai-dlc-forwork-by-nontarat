import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { req } from 'share-ui';
import { ISubDistrictInfo } from './subdistrict.service';

@Injectable({
    providedIn: 'root'
})
export class DistrictService {

    constructor() { }

    public GetDistrict(includeStatus = true): Observable<IDistrictInfo[]> {
        return req<IDistrictInfo[]>('CmsDistrict')
            .queryString({ RecordStatus: <any>includeStatus })
            .get();
    }

    public GetSubDistrictOfDistrict(district: number): Observable<ISubDistrictInfo[]> {
        return req<ISubDistrictInfo[]>('CmsDistrict/' + district + '/sub-district').get();
    }

}

export interface IDistrictInfo {

    DISTRICT_ID?: number;
    DISTRICT_NAME_THA?: string;
    DISTRICT_NAME_ENG?: string;
    PROVINCE_ID?: number;
    RECORD_STATUS?: string;
}
