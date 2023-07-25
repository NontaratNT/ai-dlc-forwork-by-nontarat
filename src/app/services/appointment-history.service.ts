import { EFORM_REQUEST, EformRequestFactory } from 'eform-share';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BpmAppointmentHistoryService {
    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory) { }

    public gets(filter: any): Observable<any[]> {
        return this._req<any[]>().api('BpmProcInstAppointment/history')
            .queryString(filter as any)
            .disableCriticalDialogError().get();
    }
}

export interface IAppointmentHistory {

}
