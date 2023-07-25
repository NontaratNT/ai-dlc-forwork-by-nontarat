import { Inject, Injectable } from '@angular/core';
import { EformRequestFactory, EFORM_REQUEST } from 'eform-share';
import { Observable } from 'rxjs';
import { req } from 'share-ui';
import { IFlowInfo } from '../common/bpm';


@Injectable({
    providedIn: 'root'
})
export class BpmMdmFlowService {

    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory) { }
    public gets(): Observable<IFlowInfo[]> {
        return this._req<IFlowInfo[]>('BpmFlow/1/group')
            .disableCriticalDialogError().get();
    }
}
