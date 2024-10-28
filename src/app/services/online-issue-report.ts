import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpStatusResult, HttpStatusResultValue, req } from 'share-ui';
import { OnlineCaseInfo, OnlineCaseParam } from '../common/@type/online-case';
import { User } from './user';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
// import { environment } from 'src/environments/environment.az-prod';

@Injectable({
    providedIn: 'root'
})
export class OnlineIssueReportService {

    constructor(private http: HttpClient) { }
    public InsertData(param: any): Observable<any> {
        return  this.http.post<HttpStatusResult>(`${environment.config.baseConfig.urlgdcc}/CmsOnlineCaseReportClue`, param);
        // return  this.http.post<HttpStatusResult>(`http://localhost:14121/api/CmsOnlineCaseReportClue`, param);
    }


}
