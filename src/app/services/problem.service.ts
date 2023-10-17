import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { req } from 'share-ui';
import { environment } from 'src/environments/environment';
import { CookieStorage } from '../common/cookie';

@Injectable({
    providedIn: 'root'
})
export class ProblemService {

    constructor(private http: HttpClient) { }
    public GetProblem(): Observable<IProblemInfo[]>{
        return req<IProblemInfo[]>('cmsonlinefeedback').disableCriticalDialogError().get();
    }
    public GetProblembyId(id: string): Observable<IProblemInfo[]> {
        return req<IProblemInfo[]>('cmsonlinefeedback/' + id)
            .disableCriticalDialogError().get();
    }
    public GetProblembyUser(createuserid: number): Observable<IProblemInfo[]> {
        return req<IProblemInfo[]>('cmsonlinefeedback/getbyuser/' + createuserid)
            .disableCriticalDialogError().get();
    }
    public Put(id: number, param: IProblemInfo): Observable<IProblemInfo> {
        return req<IProblemInfo>(`cmsonlinefeedback/${id}`)
            .body(param)
            .disableCriticalDialogError().put();
    }

    public Post(param: IProblemInfo): Observable<IProblemInfo> {
        return req<IProblemInfo>('cmsonlinefeedback')
            .body(param)
            .disableCriticalDialogError().post();
    }

    public Postgdcc(param: IProblemInfo): Observable<IProblemInfo> {

        const newHeader = new HttpHeaders({Authorization: "Bearer " + CookieStorage.accessToken});
        return  this.http.post<IProblemInfo>(`${environment.config.baseConfig.urlgdcc}/cmsonlinefeedback`, param);

    }
    public delete(id: number): Observable<IProblemInfo> {
        return req<IProblemInfo>(`cmsonlinefeedback/${id}`)
            .disableCriticalDialogError().delete();
    }
}
export interface IProblemInfo {
    FEEDBACK_ID?:        number;
    FEEDBACK_NAME?:      string;
    FEEDBACK_REMARK?:    string;
    RECORD_STATUS?:      string;
    DEL_FLAG?:           string;
    CREATE_USER_ID?:     number;
    CREATE_DATE?:        Date;
    UPDATE_USER_ID?:     number;
    UPDATE_DATE?:        Date;
    CASE_ID?:            null;
    PERSONAL_FULL_NAME?: string;
    FEEDBACK_TYPE_CODE?: number;
}
