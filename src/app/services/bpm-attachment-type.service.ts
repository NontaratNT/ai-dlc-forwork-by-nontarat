import { EFORM_REQUEST, EformRequestFactory } from 'eform-share';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBPMAttachmentType } from '../common/@type/bpm-attachment';

@Injectable({
    providedIn: 'root'
})
export class BpmAttachmentTypeService {
    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory) { }

    public get(): Observable<IBPMAttachmentType[]> {
        return this._req<IBPMAttachmentType[]>().api('BpmProcInstAttachmentType')
            .get();
    }

    public gets(filter: IBPMAttachmentTypeParam): Observable<IBPMAttachmentType[]> {
        return this._req<IBPMAttachmentType[]>().api('BpmProcInstAttachmentType')
            .queryString(filter as any)
            .get();
    }
}
export interface IBPMAttachmentTypeParam {
    OfficerAttachmentFlag: string;
}
