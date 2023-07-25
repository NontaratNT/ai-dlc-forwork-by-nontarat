import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { req } from 'share-ui';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

    constructor() { }
    // public getData(case_id: number,includeStatus = true){
    //     // console.log()
    //     // return req(`CmsOnlineCaseInfo//track`)
    //     //     .queryString({ RecordStatus: <any>includeStatus })
    //     //     .get();
    // }
    public getData(case_id: number,includeStatus = true){
        // console.log(case_id);
        return req<any>('CmsOnlineCaseInfo/'+case_id+'/track')
            .queryString({ RecordStatus: <any>includeStatus })
            .disableCriticalDialogError().get();
    }
}
