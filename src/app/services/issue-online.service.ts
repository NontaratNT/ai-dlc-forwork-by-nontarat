/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class IssueOnlineService {

    private _issueOnline: BehaviorSubject<any> = new BehaviorSubject<any>({});

    set issueOnline(value: any) {
        console.log(value);
        this._issueOnline.next(value);
    }

    get issueOnline$(): Observable<any> {
        return this._issueOnline.asObservable();
    }

    constructor() { }

    public craeteCaseChanel(data: any): any {
        // craete form data
        const formCaseChannel = {
            CHANEL_PHONE: data.CRIMINAL_TEL ?? false,
            CHANEL_SMS: data.CRIMINAL_SMS ?? false,
            CASE_CHANNEL_PHONE_ORIGINAL: data.CRIMINAL_TEL_ORIGIN,
            CASE_CHANNEL_PHONE_SERVICE: data.CRIMINAL_TEL_PROVIDER,
            CASE_CHANNEL_PHONE_DESTINATION: data.CRIMINAL_TEL_DESTINATION,
            CASE_CHANNEL_PHONE_DATE: data.CRIMINAL_TEL_DATE,
            CASE_CHANNEL_PHONE_TIME: data.CRIMINAL_TEL_TIME,
            CASE_CHANNEL_SMS_ORIGINAL: data.CRIMINAL_SMS_ORIGIN,
            CASE_CHANNEL_SMS_SERVICE: data.CRIMINAL_SMS_PROVIDER,
            CASE_CHANNEL_SMS_DESTINATION: data.CRIMINAL_SMS_DESTINATION,
            CASE_CHANNEL_SMS_DATE: data.CRIMINAL_SMS_DATE,
            CASE_CHANNEL_SMS_TIME: data.CRIMINAL_SMS_TIME,
            CASE_CHANNEL_SMS_DETAIL : data.CRIMINAL_SMS_DETAIL,
            CHANEL_LINE : data.CRIMINAL_TYPE_SOCIAL === 'LINE' ? true : false,
            CASE_CHANNEL_LINE_DETAIL_NAME : data.CRIMINAL_TYPE_SOCIAL === 'LINE' ? `${data.CRIMINAL_SOCIAL_DETAIL}` : '',
            CHANEL_FACEBOOK: data.CRIMINAL_TYPE_SOCIAL === 'FACEBOOK' ? true : false,
            CASE_CHANNEL_FACEBOOK_DETAIL_NAME: data.CRIMINAL_TYPE_SOCIAL === 'FACEBOOK' ? `${data.CRIMINAL_SOCIAL_DETAIL}` : '',
            CHANEL_MESSENGER: data.CRIMINAL_TYPE_SOCIAL === 'MESSENGER' ? true : false,
            CASE_CHANNEL_MESSENGER_DETAIL_NAME: data.CRIMINAL_TYPE_SOCIAL === 'MESSENGER' ? `${data.CRIMINAL_SOCIAL_DETAIL}` : '',
            CHANEL_INSTARGRAM: data.CRIMINAL_TYPE_SOCIAL === 'INSTAGRAM' ? true : false,
            CASE_CHANNEL_INSTARGRAM_DETAIL_NAME: data.CRIMINAL_TYPE_SOCIAL === 'INSTAGRAM' ? `${data.CRIMINAL_SOCIAL_DETAIL}` : '',
            CHANEL_WEBSITE: data.CRIMINAL_TYPE_SOCIAL === 'WEBSITE' ? true : false,
            CASE_CHANNEL_WEBSITE_DETAIL: data.CRIMINAL_TYPE_SOCIAL === 'WEBSITE' ? `${data.CRIMINAL_SOCIAL_DETAIL}` : '',
            CHANEL_EMAIL: data.CRIMINAL_TYPE_SOCIAL === 'EMAIL' ? true : false,
            CASE_CHANNEL_EMAIL_DETAIL: data.CRIMINAL_TYPE_SOCIAL === 'EMAIL' ? `${data.CRIMINAL_SOCIAL_DETAIL}` : '',
            CHANEL_TELEGRAM: data.CRIMINAL_TYPE_SOCIAL === 'TELEGRAM' ? true : false,
            CASE_CHANNEL_TELEGRAM_DETAIL_NAME: data.CRIMINAL_TYPE_SOCIAL === 'TELEGRAM' ? `${data.CRIMINAL_SOCIAL_DETAIL}` : '',
            CHANEL_WHATAPP: data.CRIMINAL_TYPE_SOCIAL === 'WHATSAPP' ? true : false,
            CASE_CHANNEL_WHATSAPP_DETAIL_NAME: data.CRIMINAL_TYPE_SOCIAL === 'WHATSAPP' ? `${data.CRIMINAL_SOCIAL_DETAIL}` : '',
            CHANEL_TWITTER: data.CRIMINAL_TYPE_SOCIAL === 'TWITTER' ? true : false,
            CASE_CHANNEL_TWITTER_DETAIL_NAME: data.CRIMINAL_TYPE_SOCIAL === 'TWITTER' ? `${data.CRIMINAL_SOCIAL_DETAIL}` : '',
            CHANEL_TIKTOK: data.CRIMINAL_TYPE_SOCIAL === 'TIKTOK'  && data.CRIMINAL_OTHER  ? true : false,
            CASE_CHANNEL_TIKTOK_DETAIL_NAME: data.CRIMINAL_TYPE_SOCIAL === 'TIKTOK'  && data.CRIMINAL_OTHER  ? `${data.CRIMINAL_SOCIAL_DETAIL}` : '',
            CHANEL_OTHER: data.CRIMINAL_TYPE_SOCIAL === 'อื่นๆ' ? true : false,
            CASE_CHANNEL_OTHER_TYPE: data.CRIMINAL_TYPE_SOCIAL === 'อื่นๆ' ? `${data.CRIMINAL_SOCIAL_TYPE_DETAIL}` : '',
            CASE_CHANNEL_OTHER_DETAIL: data.CRIMINAL_TYPE_SOCIAL === 'อื่นๆ' ? `${data.CRIMINAL_SOCIAL_DETAIL}` : '',
        };
        // checking form data
        if (formCaseChannel.CASE_CHANNEL_PHONE_SERVICE === "อื่น ๆ") {
            formCaseChannel.CASE_CHANNEL_PHONE_SERVICE = `${data.CRIMINAL_TEL_PROVIDER} ${data.CRIMINAL_TEL_PROVIDER_DETAIL}`;
        }
        if (formCaseChannel.CASE_CHANNEL_SMS_SERVICE === "อื่น ๆ") {
            formCaseChannel.CASE_CHANNEL_SMS_SERVICE = `${data.CRIMINAL_SMS_PROVIDER} ${data.CRIMINAL_SMS_PROVIDER_DETAIL}`;
        }
        // clear form data
        const setData = {};
        for (const key in formCaseChannel) {
            if (formCaseChannel[key] !== null && formCaseChannel[key] !== undefined && formCaseChannel[key] !== "") {
                setData[key] = formCaseChannel[key];
            }
        }
        return setData;
    }
}
