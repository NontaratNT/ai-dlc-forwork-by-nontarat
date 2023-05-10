import { req } from 'share-ui';
import { EFORM_REQUEST, EformRequestFactory } from 'eform-share';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class CheckDocumentService {
    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory) { }

    public getDocument(code: string): Observable<any> {
        return req<any>().api('CmsOnlineCaseInfo/case/search')
            .queryString({ recodeRefNo: code})
            .get();
    }
}
