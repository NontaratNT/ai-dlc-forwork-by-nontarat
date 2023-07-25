
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { req } from 'share-ui';

@Injectable({
    providedIn: 'root'
})
export class NewsService {

    constructor() { }

    public GetNewInfo(): Observable<INewInfo[]> {
        return req<INewInfo[]>("CmdAnnouncement").disableCriticalDialogError().get();
    }

    public getNewInfo(): Observable<INewInfo> {
        return req<INewInfo>("CmdAnnouncement").disableCriticalDialogError().get();
    }

    public GetNewInfoById(ANNOUNCEMENT_ID: number): Observable<INewInfo> {
        return req<INewInfo>("CmdAnnouncement/" + ANNOUNCEMENT_ID).disableCriticalDialogError().get();
    }

}

export interface INewInfo {
    ANNOUNCEMENT_ID: number;
    ORG_ROOT_ID: number;
    ANNOUNCEMENT_TITLE: string;
    ANNOUNCEMENT_DETAIL: string;
    ANNOUNCEMENT_START_DATE: any;
    ANNOUNCEMENT_END_DATE: any;
    ANNOUNCEMENT_IMAGE: string;
    RECORD_STATUS: string;
    DEL_FLAG: string;
    CREATE_USER_ID: number;
    CREATE_DATE: any;
    UPDATE_USER_ID: number;
    UPDATE_DATE: any;
    ORGANIZE_NAME_THA: string;
}
