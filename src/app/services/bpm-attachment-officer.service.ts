import { Inject, Injectable } from '@angular/core';
import { EformRequestFactory, EFORM_REQUEST } from 'eform-share';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BpmAttachmentOfficerService {


    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory) { }

    public gets(filter: IBPMAttachmentofficerParam ): Observable<IBPMAttachmentOfficer[]> {
        return this._req<IBPMAttachmentOfficer[]>().api('BpmProcInstAttachmentOfficer')
            .queryString(filter as any)
            .get();
    }

    public getPDF(filter: IBPMAttachmentofficerParamAll): Observable<IBPMAttachmentOfficerAll[]> {
        return this._req<IBPMAttachmentOfficerAll[]>().api('BpmProcInstAttachmentOfficer')
            .queryString(filter as any)
            .get();
    }

    public create(param: FormData): Observable<IBPMAttachmentOfficer> {
        return this._req<IBPMAttachmentOfficer>().api('BpmProcInstAttachmentOfficer')
            .body(param)
            .post();
    }
    public update(param: FormData , id: number): Observable<IBPMAttachmentOfficer> {
        return this._req<IBPMAttachmentOfficer>().api(`BpmProcInstAttachmentOfficer/${id}`)
            .body(param)
            .put();
    }

    public delete(id: number): Observable<IBPMAttachmentOfficer> {
        return this._req<IBPMAttachmentOfficer>().api(`BpmProcInstAttachmentOfficer/${id}`)
            .delete();
    }

    public updatePublish(param: IBPMAttachmentOfficer , id: number): Observable<IBPMAttachmentOfficer> {
        return this._req<IBPMAttachmentOfficer>().api(`BpmProcInstAttachmentOfficer/${id}/update/publish-flag`)
            .body(param)
            .post();
    }
}
export interface IBPMAttachmentOfficer {
    INST_ATTACHMENT_OFFICER_ID?: number;
    INST_ID?: number;
    INST_ATTACHMENT_OFFICER_NAME?: string;
    INST_ATTACHMENT_OFFICER_DATE?: string;
    INST_ATTACHMENT_OFFICER_PATH?: string;
    INST_ATTACHMENT_OFFICER_SIZE?: number;
    INST_ATTACHMENT_TYPE_ID?: number;
    WF_INSTANCE_ID?: string;
    PUBLISH_FLAG?: string;
    RECORD_STATUS?: string;
    PublishFlag?: string;
}

export interface IBPMAttachmentofficerParam {
    BpmInstanceId?: number;
    publishFlag?: string;
}
export interface IBPMAttachmentofficerParamAll {
    PersonalId?: number;
}
export interface IBPMAttachmentOfficerAll {
    INST_ID?: number;
    TRACKING_CODE?: string;
    INST_ATTACHMENT_TYPE_NAME?: string;
    EXT1?: string;
    CREATE_DATE?: Date;
    INST_ATTACHMENT_OFFICER_NAME?: string;
}
