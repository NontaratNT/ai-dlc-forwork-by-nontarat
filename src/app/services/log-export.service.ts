import { EFORM_REQUEST, EformRequestFactory } from 'eform-share';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { req } from 'share-ui';
import { User } from './user';

@Injectable({
    providedIn: 'root'
})
export class LogExportService {

    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory) { }


    public logExport(param: any): Observable<any> {
        return this._req<any>('BpmProcInstLog/LogExport')
            .body(param)
            .disableCriticalDialogError().post();
    }
}
