import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPagingResult, req } from 'share-ui';
import { EformRequestFactory, EFORM_REQUEST } from "eform-share";
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class OrgService {

    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory) { }

    public GetOrganize(includeStatus = true): Observable<IOrganizeInfo[]> {
        return req<IOrganizeInfo[]>('CmsOrganize')
            .queryString({RecordStatus: <any>includeStatus })
            .disableCriticalDialogError().get();
    }

    public GetByOrganizeId(id: number): Observable<IOrganizeInfo> {
        return req<IOrganizeInfo>(`CmsOrganize/${id}`)
            .cache()
            .disableCriticalDialogError().get();
    }

    public getorgProvince(provinceid:any): Observable<IOrganizeInfo[]> {
        return this._req<IOrganizeInfo[]>('CmsOrganize/orgProvince').host(environment.config.eFormHost)
            .queryString({provinceId: <any>provinceid })
            .disableCriticalDialogError().get();
    }

    public getorgwalkin(): Observable<IOrganizeInfo[]> {
        return this._req<IOrganizeInfo[]>('CmsOrganize/getorgwalkin').host(environment.config.eFormHost)
            .disableCriticalDialogError().get();
    }
    public getorgwalkinall(): Observable<IOrganizeInfo[]> {
        return this._req<IOrganizeInfo[]>('CmsOrganize/getorgall').host(environment.config.eFormHost)
            .disableCriticalDialogError().get();
    }
    // public GetApps(roleId: number): Observable<IAppInfo[]> {
    //     return req<IAppInfo[]>('CmsOrganize/app')
    //         .queryString({ roleId: <any>roleId })
    //         .get();
    // }
    public getorgmpaarea(pvid:any): Observable<IOrgmaparea[]> {
        return this._req<IOrgmaparea[]>('cmsorganize/getorgaria/'+pvid)
            .disableCriticalDialogError().get();
    }
    public getorgariaall(): Observable<IOrgmaparea[]> {
        return this._req<IOrgmaparea[]>('cmsorganize/getorgariaall').host(environment.config.eFormHost)
            .disableCriticalDialogError().get();
    }
    public InsertOrganizeInfo(param: FormData): Observable<any> {
        return req("CmsOrganize")
            .body(param)
            .disableCriticalDialogError().post();

    }

    public GetsOrganizePki(id: number): Observable<IOrganizeInfo[]> {
        return req<IOrganizeInfo[]>(`CmsOrganize/${id}/pki`)
            .disableCriticalDialogError().get();
    }

    public UpdateOrganizeInfo(id: number, param: FormData): Observable<IOrganizeInfo> {
        return req<IOrganizeInfo>(`CmsOrganize/${id}`)
            .body(param)
            .disableCriticalDialogError().put();
    }

    // public SearchOrganizeName(name: string, offset: number, length: number): Observable<IPagingResult<IOrganizeInfo>> {
    //     return req<IPagingResult<IOrganizeInfo>>("CmsOrganize/search")
    //         .body({
    //             Condition: {
    //                 ORGANIZE_NAME_THA: name
    //             }, Offset: offset, Length: length
    //         })
    //         .post();
    // }

    public SearchOrganize(searchObj: any, offset: number, length: number): Observable<IPagingResult<IOrganizeInfo>> {
        return req<IPagingResult<IOrganizeInfo>>("CmsOrganize/search")
            .body({ Condition: searchObj, Offset: offset, Length: length })
            // .queryString({ roleId: User.Current.Role.RoleId })
            .disableCriticalDialogError().post();
    }
}
export interface IOrganizeInfo {
    ORGANIZE_ID?: number;
    ORGANIZE_ECMS_ID?: string;
    ORGANIZE_CODE_LEV1: number;
    ORGANIZE_CODE_LEV2: number;
    ORGANIZE_CODE_LEV3: number;
    ORGANIZE_CODE_LEV4: number;
    ORGANIZE_CODE_LEV5: number;
    ORGANIZE_ROOT_ID?: number;
    ORGANIZE_LEVEL_ID?: number;
    ORGANIZE_ARIA_CODE?: string;
    ORGANIZE_NAME_DETAIL?: string;
    ORGANIZE_NAME_THA?: string;
    ORGANIZE_NAME_ENG?: string;
    ORGANIZE_ABBR_THA?: string;
    ORGANIZE_ABBR_ENG?: string;
    ORGANIZE_TELEPHONE?: string;
    ORGANIZE_FAX?: string;
    ORGANIZE_CONTACT?: string;
    ORGANIZE_EMAIL?: string;
    ORGANIZE_ADDRESS_NO?: string;
    ORGANIZE_ADDRESS_MOO?: string;
    ORGANIZE_ADDRESS_BUILDING?: string;
    ORGANIZE_ADDRESS_SOI?: string;
    ORGANIZE_ADDRESS_STREET?: string;
    ORGANIZE_ADDRESS_PROVINCE?: number;
    ORGANIZE_ADDRESS_DISRICT?: number;
    ORGANIZE_ADDRESS_SUB_DISTRICT?: number;
    ORGANIZE_ADDRESS_POSTCODE?: number;
    ORGANIZE_IMAGE_PATH?: string;
    ORGANIZE_LOGO_PATH?: string;
    ORGANIZE_FILE_PATH?: string;
    ORGANIZE_URL_INTERNET?: string;
    ORGANIZE_URL_INTRANET?: string;
    ORGANIZE_URL_DM?: string;
    ORGANIZE_FORMAL_FLAG?: string;
    ORGANIZE_TYPE_ID?: number;
    ORGANIZE_SEQ?: number;
    GOVERNMENT_ID?: number;
    GOVERNMENT_TYPE_ID?: number;
    MANAGER_ID?: number;
    MANAGER2_ID?: number;
    RECORD_STATUS?: string;
    DEL_FLAG?: string;
    ORGANIZE_LEVEL?: number;
    ORGANIZE_LEVEL_PARENT?: number;
    MANAGER_FULL_NAME?: string;
    MANAGER2_FULL_NAME?: string;
    MANAGER_POSITION?: string;
    ORGANIZE_PARENT_ID?: string;
    ROOT_ORGANIZE_NAME_THA?: string;
}

export interface IOrganizeInfoSend {
    ORGANIZE_ID?: number;
    ORGANIZE_CODE_LEV1: number;
    ORGANIZE_CODE_LEV2: number;
    ORGANIZE_CODE_LEV3: number;
    ORGANIZE_CODE_LEV4: number;
    ORGANIZE_CODE_LEV5: number;
    ORGANIZE_ROOT_ID?: number;
    ORGANIZE_LEVEL_ID?: number;
    ORGANIZE_ARIA_CODE?: string;
    ORGANIZE_NAME_DETAIL?: string;
    ORGANIZE_NAME_THA?: string;
    ORGANIZE_NAME_ENG?: string;
    ORGANIZE_ABBR_THA?: string;
    ORGANIZE_ABBR_ENG?: string;
    ORGANIZE_TELEPHONE?: string;
    ORGANIZE_FAX?: string;
    ORGANIZE_CONTACT?: string;
    ORGANIZE_EMAIL?: string;
    ORGANIZE_ADDRESS_NO?: string;
    ORGANIZE_ADDRESS_MOO?: string;
    ORGANIZE_ADDRESS_BUILDING?: string;
    ORGANIZE_ADDRESS_SOI?: string;
    ORGANIZE_ADDRESS_STREET?: string;
    ORGANIZE_ADDRESS_PROVINCE?: number;
    ORGANIZE_ADDRESS_DISRICT?: number;
    ORGANIZE_ADDRESS_SUB_DISTRICT?: number;
    ORGANIZE_ADDRESS_POSTCODE?: number;
    ORGANIZE_URL_INTERNET?: string;
    ORGANIZE_URL_INTRANET?: string;
    ORGANIZE_URL_DM?: string;
    ORGANIZE_TYPE_ID?: number;
    ORGANIZE_SEQ?: number;
    GOVERNMENT_ID?: number;
    GOVERNMENT_TYPE_ID?: number;
    MANAGER_ID?: number;
    MANAGER2_ID?: number;
    RECORD_STATUS?: string;
    DEL_FLAG?: string;
}


export interface IOrgmaparea {
    ORG_ID:             number;
    ORG_NAME_THA:       string;
    PROVINCE_ID:        number;
    PROVINCE_NAME_THA:  string;
    ORGANIZE_FULL_NAME: string;
}
