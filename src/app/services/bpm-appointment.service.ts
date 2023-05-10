/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { Inject, Injectable } from '@angular/core';
import { EformRequestFactory, EFORM_REQUEST } from 'eform-share';
import { Observable } from 'rxjs';
import { req } from 'share-ui';

@Injectable({
    providedIn: 'root'
})
export class BpmAppointmentService {

    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory) { }

    public Appointment(instId: number, statusId: number): Observable<IAppointment[]> {
        return this._req<IAppointment[]>('BpmProcInstAppointment')
            .queryString({ InstId: instId, StatusId: statusId})
            .get();
    }
    public GetAppointment(PersonId: number): Observable<any> {
        return this._req<any>('BpmProcInstAppointment')
            .queryString({PersonId})
            .get();
    }
    public GetAppointmentList(filter: any): Observable<any> {
        return this._req<any>('BpmProcInstAppointment')
            .queryString(filter)
            .get();
    }
    public GetAppointmentInsId(InstId: number): Observable<any> {
        return this._req<any>(`BpmProcInstAppointment`)
            .queryString({InstId})
            .get();
    }
}

export interface IAppointment {
    INST_ID?: number;
    APP_PERSONAL_FULLNAME?: string;
    APPOINTMENT_PERSONAL_TEL_NO?: string;
}
