import { Inject, Injectable } from '@angular/core';
import { EFORM_REQUEST, EformRequestFactory } from 'eform-share';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class FormSystemConfigService {
    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory) 
     { }
    public GetId(id: number): Observable<any> {
        return this._req<any>(`FormSystemConfig/${id}`).get();
    }
    public Update(param): Observable<any[]> {
        return this._req<any>(`FormSystemConfig`).body(param).post();
    }


}

