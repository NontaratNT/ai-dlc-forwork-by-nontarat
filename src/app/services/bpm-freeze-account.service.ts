/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { Inject, Injectable } from '@angular/core';
import { EformRequestFactory, EFORM_REQUEST } from 'eform-share';
import { Observable } from 'rxjs';
import { req } from 'share-ui';

@Injectable({
    providedIn: 'root'
})
export class FreezeAccountService {

    // constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory) { }

    public post(param: any): Observable<any> {
        return req<any>("BpmFreezeAccount")
            .body(param)
            .disableCriticalDialogError().post();
    }
}



