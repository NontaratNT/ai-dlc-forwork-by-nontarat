import { EFORM_REQUEST, EformRequestFactory } from 'eform-share';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { req } from 'share-ui';

@Injectable({
    providedIn: 'root'
})
export class BpmAttachmentService {

    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory) { }

    public get(id: number): Observable<IBPMAttachment[]> {
        return this._req<IBPMAttachment[]>().api('BpmProcInstAttachment')
            .queryString({ BpmInstanceId: id })
            .disableCriticalDialogError().get();
    }

    public create(param: FormData): Observable<IBPMAttachment> {
        return this._req<IBPMAttachment>().api('BpmProcInstAttachment')
            .body(param)
            .disableCriticalDialogError().post();
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
