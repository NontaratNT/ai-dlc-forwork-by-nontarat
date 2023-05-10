import { EFORM_REQUEST, EformRequestFactory } from 'eform-share';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPagingResult } from 'share-ui';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory) { }

    public gets(filter: Partial<NotificationFilter> , offset: number , length: number): Observable<INotification[]> {
        const param: any = filter;
        param.Offset = offset;
        param.Length = length;

        return this._req<INotification[]>('BpmNotification')
            .queryString(param)
            .get();
    }

    public getsPaging(filter: Partial<NotificationFilter> , offset: number , length: number): Observable<IPagingResult<INotification>> {
        const param: any = filter;
        param.Offset = offset;
        param.Length = length;

        return this._req<IPagingResult<INotification>>('BpmNotification/paging')
            .body(param)
            .post();
    }

    public getฺById(id: number): Observable<INotification> {
        return this._req<INotification>(`BpmNotification/${id}`)
            .get();
    }

    public getUnReadCount(id: number): Observable<number> {
        return this._req<number>('BpmNotification/unread/count')
            .queryString({PersonalId : id  })
            .get();
    }

    public read(notificationToId: number): Observable<any> {
        return this._req<any>('BpmNotification/read')
            .body({NotificationToId : notificationToId })
            .post();
    }

}


export interface INotification {
    NOTIFICATION_TO_ID?: number;
    NOTIFICATION_ID?:  number;
    PERSONAL_ID?:  number;
    FLAG_READ?: string;
    READ_DATE?: any;
    RECORD_STATUS?: string;
    DEL_FLAG?: string;
    NOTIFICATION_FROM?: string;
    NOTIFICATION_FROM_PERSONAL_ID?: number;
    NOTIFICATION_SUBJECT?: string;
    NOTIFICATION_BODY?: string;
    NOTIFICATION_DATE?: any;
    INST_ID?: number;
    NOTIFICATION_DATE_STR?: string;
}

export interface NotificationFilter {
    filtersearch?: string;
    personalId: number;
    unRead: boolean;
}
