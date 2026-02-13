import { EFORM_REQUEST, EformRequestFactory } from 'eform-share';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieStorage } from '../common/cookie';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BpmAppointmentHistoryService {
    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory,private http: HttpClient) { }


    public gets(filter: any): Observable<any> {

        const newHeader = new HttpHeaders({Authorization: "Bearer " + CookieStorage.accessToken});

        return this.http.get<any>(`${environment.config.baseConfig.urlgdcceform}/Officer/BpmProcInstAppointment/history`, {
            headers: newHeader,
            params: filter
          });

       
    }
    public getsbackup(filter: any): Observable<any[]> {
        return this._req<any[]>().api('BpmProcInstAppointment/history')
            .queryString(filter as any)
            .disableCriticalDialogError().get();
    }
}

export interface IAppointmentHistory {

}
