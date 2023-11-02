import { EFORM_REQUEST, EformRequestFactory } from 'eform-share';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { req } from 'share-ui';
import { CookieStorage } from '../common/cookie';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BpmAttachmentService {

    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory,private http: HttpClient) { }

    public get(id: number): Observable<Filebase64[]> {
        return this._req<Filebase64[]>().api('BpmProcInstAttachment/Attachment')
            .queryString({ BpmInstanceId: id })
            .disableCriticalDialogError().get();
    }

    public create(param: FormData): Observable<IBPMAttachment> {
        return this._req<IBPMAttachment>().api('BpmProcInstAttachment')
            .body(param)
            .disableCriticalDialogError().post();
    }

    public creategdcc(param: FormData): Observable<IBPMAttachment> {
        const newHeader = new HttpHeaders({Authorization: "Bearer " + CookieStorage.accessToken});
        return  this.http.post<IBPMAttachment>(`${environment.config.baseConfig.urlgdcceform}/BpmProcInstAttachment`, param);

    }
    public update(param: FormData , id: number): Observable<IBPMAttachment> {
        return this._req<IBPMAttachment>().api(`BpmProcInstAttachment/${id}`)
            .body(param)
            .disableCriticalDialogError().put();
    }
    public delete(id: number): Observable<IBPMAttachment> {
        return this._req<IBPMAttachment>().api(`BpmProcInstAttachment/${id}`)
            .disableCriticalDialogError().delete();
    }
}

export interface IBPMAttachment {
    INST_ATTACHMENT_ID?: number;
    INST_ID?: number;
    INST_ATTACHMENT_NAME?: string;
    INST_ATTACHMENT_DATE?: string;
    INST_ATTACHMENT_PATH?: string;
    INST_ATTACHMENT_SIZE?: number;
    INST_ATTACHMENT_TYPE_ID: number;
    INST_ATTACHMENT_ACTION_FLAG?: string;
    WF_INSTANCE_ID?: string;
    RECORD_STATUS?: string;
}


export interface Filebase64 {
    DateNow?: string
    name?: string
    originalName?: string
    Size?: number
    SizeDetail?: string
    Storage?: string
    type?: string
    url?: string
  }
