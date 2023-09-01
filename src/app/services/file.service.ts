
import { Inject, Injectable } from '@angular/core';
import { EformRequestFactory, EFORM_REQUEST } from 'eform-share';
import { Observable} from 'rxjs';
import { req } from 'share-ui';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory) { }

    public getChannelFile(id: number): Observable<FileChannelBase64> {
        return req<FileChannelBase64>(`CmsOnlineCaseInfo/getfile/channeldoc/${id}`)
            .disableCriticalDialogError().get();
    }
    public getCaseMoneyFile(id: number): Observable<FileChannelBase64> {
        return this._req<any>(`BpmProcInstAttachment/getfile/moneydoc/${id}`)
            .disableCriticalDialogError().get();
    }
}

export interface FileChannel {
    CHANNEL_DOC_ID?: number
    CASE_CHANNEL_ID?: number
    CHANNEL_DOC_PHYSICAL_NAME?: string
    CHANNEL_DOC_PHYSICAL_DES?: any
    CHANNEL_DOC_IMPORT_DATE?: string
    CHANNEL_DOC_PATH?: string
    RECORD_STATUS?: string
    CREATE_USER_ID?: number
    CREATE_DATE?: string
    UPDATE_USER_ID?: number
    UPDATE_DATE?: string
    DEL_FLAG?: string
    CHANNEL_DOC_PHYSICAL_EXTENSION?: string
}


export interface FileChannelBase64 {
    Name ?: string
	OriginalName ?: string
	Storage ?: string
	Type ?: string
	Url ?: string
    DateNow ?: string
    Size ?: number
    SizeDetail ?: string
    TypeChannel ?: string
    noFile ?: string
}

