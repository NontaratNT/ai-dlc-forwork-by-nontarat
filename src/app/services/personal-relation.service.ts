import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EformRequestFactory, EFORM_REQUEST } from "eform-share";

@Injectable({
    providedIn: "root",
})
export class PersonalRelationService {
    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory) {}
    public GetRelation(): Observable<any> {
        return this._req<any>("CmsRelation")
            .disableCriticalDialogError().get();
    }
}
