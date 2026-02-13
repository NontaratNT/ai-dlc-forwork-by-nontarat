import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { trimObject } from 'src/app/common/helper';
import { IPagingResult, OffsetFilterParam } from 'src/app/common/commontype';
import { EFORM_REQUEST, EformRequestFactory } from 'eform-share';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class FormConfigService {
    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory) { }
    public Get(): Observable<any[]> {
        return this._req<any[]>('form-config').get();
    }

    public GetPaging(filter: FormConfigFilterParam): Observable<IPagingResult<any>> {
        trimObject(filter);
        return this._req<IPagingResult<any>>('form-config/paging').queryString(filter as any).get();
    }

    public GetId(id: string): Observable<any> {
        return this._req<any>(`form-config/${id}`).get();
    }
    public GetCode(code: any): Observable<any> {
        return this._req<any>(`Officer/form-config/GetByFormCode/${code}`).get();
    }
    public Savenewversion(id: number): Observable<any> {
        return this._req<any>(`form-config/${id}/save-version`).body({}).post();
    }
    public Create(param): Observable<any> {
        return this._req<any>('form-config').body(param).post();
    }
    public Update(id: number, param): Observable<any[]> {
        return this._req<any>(`form-config/${id}`).body(param).put();
    }
    public Delete(id: number): Observable<any[]> {
        return this._req<any>(`form-config/${id}`).delete();
    }
    public UploadTempleteWordCC(param: FormData): Observable<any> {
        return this._req<any>(`form-config/upload-template-wordcc`)
            .body(param)
            .post();
    }
    public UpdateTempleteWordCC(id: number, param: FormData): Observable<any> {
        return this._req<any>(`form-config/${id}/upload-template-wordcc`)
            .body(param)
            .post();
    }

    public GetPreview(id: number): Observable<any> {
        return this._req<any>(`form-config/${id}/download-template-wordcc`).get();
    }
}

export interface FormConfigFilterParam extends OffsetFilterParam {
    formNameDescLike?: string;
}
