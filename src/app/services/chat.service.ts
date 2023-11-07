import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { EformRequestFactory, EFORM_REQUEST } from "eform-share";
import { Observable } from "rxjs";
import { req } from 'share-ui';
import { environment } from "src/environments/environment";
import { CookieStorage } from "../common/cookie";

@Injectable({
    providedIn: "root",
})
export class ChatService {
    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory,private http: HttpClient) { }

    public getChat(id: number): Observable<IChat[]> {
        return this._req<IChat[]>()
            .api("BpmProcInstChat")
            .queryString({ BpmInstanceId: id })
            .disableCriticalDialogError().get();
    }

    public postChat(param: IChat): Observable<IChat> {
        return this._req<IChat>().api("BpmProcInstChat").body(param).disableCriticalDialogError().post();
    }

    public postChatPerson(param: IChat): Observable<IChat> {
        return req<IChat>().api("BpmProcInstChat/person-chat").body(param).disableCriticalDialogError().post();
    }

    public postChatPersongdcc(param: IChat): Observable<IChat> {
        const newHeader = new HttpHeaders({Authorization: "Bearer " + CookieStorage.accessToken});
        return  this.http.post<IChat>(`${environment.config.baseConfig.urlgdcc}/BpmProcInstChat/person-chat`, param);

    }

    public getCountChat(id: number): Observable<any> {
        return this._req<any>()
            .api("BpmProcInstChat/count")
            .queryString({ BpmInstanceId: id })
            .disableCriticalDialogError().get();
    }

    public getCountNoChat(id: number): Observable<any> {
        return this._req<any>()
            .api("BpmProcInstChat/count/un-read")
            .queryString({ BpmInstanceId: id })
            .disableCriticalDialogError().get();
    }

    public getCountReadChat(id: number): Observable<any> {
        return this._req<any>()
            .api("BpmProcInstChat/read")
            .queryString({ BpmInstanceId: id })
            .disableCriticalDialogError().get();
    }
}

export interface IChat {
    INST_CHAT_ID?: number;
    INST_CHAT_MASSAGE?: string;
    INST_ID?: number;
    SENDER_ID?: number;
    PERSONAL_FNAME_THA?: string;
    PERSONAL_FULL_NAME?: string;
    USER_NAME?: string;
    PERSONAL_PICTURE?: string;
    RECORD_STATUS?: string;
    CREATE_DATE?: string;
    CREATE_SDATE?: string;
}
