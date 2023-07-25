import { Inject, Injectable } from '@angular/core';
import { IPagingResult } from 'share-ui';
import { Observable } from 'rxjs';
import { req } from 'share-ui';
import { IOrganizeInfo } from './org.service';
import { EformRequestFactory, EFORM_REQUEST } from 'eform-share';

@Injectable({
    providedIn: 'root'
})
export class PersonalService {

    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory) { }

    public Search(searchObj: any, offset: number, length: number): Observable<IPagingResult<IPersonal>> {
        return this._req<IPagingResult<IPersonal>>("CmsPersonal/search")
            .body({ Condition: searchObj, Offset: offset, Length: length })
            .disableCriticalDialogError().post();
    }

    public SearchByName(name: string, offset: number, length: number): Observable<IPagingResult<IPersonal>> {
        return this.Search({ PERSONAL_FULL_NAME: name }, offset, length);

    }

    public GetPersonal(includeStatus = true): Observable<IPersonal[]> {
        return this._req<IPersonal[]>('CmsPersonal')
            .queryString({ RecordStatus: includeStatus as any })
            .disableCriticalDialogError().get();
    }
    public GetPersonalById(id: number): Observable<IPersonal> {
        return this._req<IPersonal>('CmsPersonal/' + id)
            .disableCriticalDialogError().get();
    }

    public GetPersonalManager(id: number): Observable<IOrganizeInfo[]> {
        return this._req<IOrganizeInfo[]>('CmsPersonal/' + id + '/organize/manager')
            .disableCriticalDialogError().get();
    }

    public PutPersonal(id: number, param: FormData): Observable<IPersonal> {
        return this._req<IPersonal>('CmsPersonal/' + id)
            .body(param)
            .disableCriticalDialogError().put();
    }


    public PostPersonal(param: FormData): Observable<IPersonal> {
        return this._req<IPersonal>('CmsPersonal')
            .body(param)
            .disableCriticalDialogError().post();
    }

    public RegisterJournal(param: FormData): Observable<IPersonal> {
        return req<IPersonal>('user/register-1.3')
            .body(param)
            .disableCriticalDialogError().post();
    }

    public RegisterJournalSendOtp(): Observable<any> {
        return req<any>('user/register-1.3/send-activate')
            .disableCriticalDialogError().post();
    }

    public RegisterJournalActivateOtp(OPT: IOTP): Observable<IOTP> {
        return req<IOTP>('user/register-1.3/activate')
            .body(OPT)
            .disableCriticalDialogError().post();
    }
    public RegisterVerifyID(param: FormData): Observable<any> {
        return req<any>('user/verify/persolnalimage')
            .body(param)
            .disableCriticalDialogError().post();
    }

}
export interface IPersonal {
    PERSONAL_ID?: number;
    OCCUPATION_ID?: number;
    PERSONAL_CODE?: string;
    TITLE_ID?: number;
    PERSONAL_FULL_NAME: string;
    TITLE_NAME: string;
    // PERSONAL_LASER_NUMBER?: string;
    PERSONAL_CITIZEN_PICTURE?: string;
    // PERSONAL_LASER_PICTURE?: string;
    PERSONAL_MOO: string;
    PERSONAL_STREET: string;
    PERSONAL_SOI: string;
    HOME_REGISTER_MOO: string;
    HOME_REGISTER_STREET: string;
    HOME_REGISTER_SOI: string;
    ORGANIZE_ROOT_ID: number;
    PERSONAL_FNAME_THA?: string;
    PERSONAL_LNAME_THA?: string;
    PERSONAL_START_DATE?: Date;
    PERSONAL_BIRTH_DATE?: any;
    PERSONAL_LEAVE_DATE?: Date;
    PERSONAL_TYPE_ID?: number;
    POSITION_ID?: number;
    POSITION_NAME?: string;
    POSITION_MNG_ID?: number;
    POSITION_MNG_NAME?: string;
    POSITION_MNG_LEVEL?: number;
    ORG_ID?: number;
    ORG_NAME?: string;
    PERSONAL_TEL_NO?: string;
    PERSONAL_NATIONALITY?: string;
    PERSONAL_RACE?: string;
    PERSONAL_TEL_HOME?: string;
    PERSONAL_TEL_POSITION?: string;
    PERSONAL_ADDRESS_HOME_REGISTER?: string;
    PERSONAL_ACCIDENCE_TEL?: string;
    PERSONAL_STATUS?: string;
    PERSONAL_CITIZEN_NUMBER?: string;
    PERSONAL_ADDRESS?: string;
    PROVINCE_ID?: number;
    DISTICT_ID?: number;
    SUB_DISTICT_ID?: number;
    POST_CODE?: number;
    HOME_REGISTER_PROVINCE_ID?: number;
    HOME_REGISTER_DISTICT_ID?: number;
    HOME_REGISTER_SUB_DISTICT_ID?: number;
    HOME_REGISTER_POST_CODE?: number;
    WORK_ADDRESS_NO?: string;
    WORK_ADDRESS_MOO?: string;
    WORK_ADDRESS_BUILDING?: string;
    WORK_ADDRESS_SOI?: string;
    WORK_ADDRESS_STREET?: string;
    WORK_PROVINCE?: number;
    WORK_DISTRICT_ID?: number;
    WORK_SUB_DISTRICT_ID?: number;
    WORK_POSTCODE_ID?: number;
    ACCIDENCE_TEL?: string;
    ACCIDENCE_ADDRESS?: string;
    ACCIDENCE_PROVINCE?: number;
    ACCIDENCE_DISTICT?: number;
    ACCIDENCE_SUB_DISTICT?: number;
    ACCIDENCE_POST_CODE?: number;
    PERSONAL_RELIGION?: string;
    PERSONAL_GENDER?: any;
    PERSONAL_EMAIL?: string;
    PERSONAL_SALARY?: number;
    PERSONAL_WORK_ADDRESS?: string;
    PERSONAL_PICTURE?: string;
    ACCIDENCE_PERSON?: string;
    ACCIDENCE_RELATION?: string;
    RECORD_STATUS?: string;
    USER_NAME?: string;
    HOME_REGISTER_ADDRESS?: string;
    NEW_PASSWORD?: string;
    UPLOAD_PICTURE?: string;
    USER_PICTURE?: string;
    OLD_PASSWORD?: string;
    USER_ID?: number;
    PERSONAL_SIGNATURE_PICTURE?: string;
    ORGANIZE_NAME_THA?: string;
    UPDATE_DATE?: any;
    UPDATE_USER_ID?: number;
    CREATE_DATE?: Date;
    CREATE_USER_ID?: number;
    USER_APPROVE_FLAG: string;
    USER_REJECT_FLAG: string;
    USER_REJECT_REMARK: string;
    CONFIRM_PASSWORD?: string;
    FACEBOOK_URL?: string;
    LINE_ID?: string;
}

export interface IOTP {
    Otp?: string;
}
export interface IVerifyID {
    PERSONAL_IMAGE?: string;
    PERSONAL_ID_CARD_IMAGE?: string;
}

