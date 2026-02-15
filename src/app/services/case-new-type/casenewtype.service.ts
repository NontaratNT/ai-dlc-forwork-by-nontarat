import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { userInfo } from 'os';
import { Observable } from 'rxjs';
import { req } from 'share-ui';
import { CookieStorage } from 'src/app/common/cookie';
import { environment } from 'src/environments/environment';
import { User } from '../user';
import { Article } from 'src/app/layout/layout-desktop/components/issue-online-container/search-new-case-type/search-new-case-type.component';

@Injectable({
    providedIn: 'root'
})
export class CaseNewTypeService {

    constructor(private http: HttpClient) { }
    public GetCaseNewTypeList(): Observable<ICaseNewTypeInfo[]>{
        return req<ICaseNewTypeInfo[]>('Officer/NewCase/getbyuser')
        // .host(environment.config.baseConfig.urlgdcc)
        .disableCriticalDialogError().get();
    }

     public GetCaseTypeNew(): Observable<Article[]>{
        return req<Article[]>('CmsMasterNew/CmsNewCaseType')
        // .host(environment.config.baseConfig.urlgdcc)
        .disableCriticalDialogError().get();
    }

    
}
export interface ICaseNewTypeInfo {
     CASE_ID_PRE: number;
  CASE_CODE_PRE: string;
  PERSONAL_FULL_NAME: string;
  CASE_TYPE_ID: number;
  CASE_TYPE_SUB_ID: number;
  FRAUD_NAME_TH: string;
  FRAUD_SUB_NAME_TH: string;
  OFIICER_FULL_NAME: string | null;
  ORGANIZE_NAME_THA: string;
  CASE_PRE_STATUS: string;
  CASE_PRE_STATUS_NAME: string;
  RECORD_STATUS: string;
  DEL_FLAG: string;
  CREATE_DATE: Date; // หรือ Date ถ้าจะแปลงตอนใช้งาน
  CREATE_USER_ID: number;
  PERSONAL_ID: number;
  USER_ID: number;
}
