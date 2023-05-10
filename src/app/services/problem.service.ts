import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { req } from 'share-ui';

@Injectable({
    providedIn: 'root'
})
export class ProblemService {

    constructor() { }
    public GetProblem(): Observable<IProblemInfo[]>{
        return req<IProblemInfo[]>('cmsonlinefeedback').get();
    }
    public GetProblembyId(id: string): Observable<IProblemInfo[]> {
        return req<IProblemInfo[]>('cmsonlinefeedback/' + id)
            .get();
    }
    public GetProblembyUser(createuserid: number): Observable<IProblemInfo[]> {
        return req<IProblemInfo[]>('cmsonlinefeedback/getbyuser/' + createuserid)
            .get();
    }
    public Put(id: number, param: IProblemInfo): Observable<IProblemInfo> {
        return req<IProblemInfo>(`cmsonlinefeedback/${id}`)
            .body(param)
            .put();
    }

    public Post(param: IProblemInfo): Observable<IProblemInfo> {
        return req<IProblemInfo>('cmsonlinefeedback')
            .body(param)
            .post();
    }
    public delete(id: number): Observable<IProblemInfo> {
        return req<IProblemInfo>(`cmsonlinefeedback/${id}`)
            .delete();
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
