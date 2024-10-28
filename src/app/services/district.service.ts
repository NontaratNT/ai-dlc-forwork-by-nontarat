import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { req } from 'share-ui';
import { ISubDistrictInfo } from './subdistrict.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DistrictService {

    constructor() { }

    public GetDistrict(includeStatus = true): Observable<IDistrictInfo[]> {
        return req<IDistrictInfo[]>('CmsDistrict')
            .queryString({ RecordStatus: <any>includeStatus })
            .disableCriticalDialogError().get();
    }

    public GetSubDistrictOfDistrict(district: number): Observable<ISubDistrictInfo[]> {
        return req<ISubDistrictInfo[]>('CmsDistrict/' + district + '/sub-district').host(environment.config.baseConfig.urlgdcc).disableCriticalDialogError().get();
    }

}

export interface IDistrictInfo {

    DISTRICT_ID?: number;
    DISTRICT_NAME_THA?: string;
    DISTRICT_NAME_ENG?: string;
    PROVINCE_ID?: number;
    RECORD_STATUS?: string;
}
