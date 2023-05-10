import { Injectable } from '@angular/core';
import * as SignalR from "@microsoft/signalr";
import { CookieStorage } from 'src/app/common/cookie';
import { environment } from 'src/environments/environment';
import { ApplicationNotificationService } from '../application-notification.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationHubService {
    private _conn: SignalR.HubConnection;
    constructor(
        private _appNotification: ApplicationNotificationService
    ) { }

    public start(): Promise<any> {
        return this.internalInit();
    }

    public stop(): Promise<any> {
        return this.endConnection();
    }

    public async sendTestNotification() {
        try {
            await this._conn.invoke("Send", 42651, {
                FromName: "ระบบ Police Online",
                SendDate: new Date(),
                Subject: "มีงานเข้าใหม่",
                Body: "มีงานเข้าใหม่ กรุณาตรวจสอบ",
                BpmId: 1877
            });
        } catch (err) {
            // console.log(err);
        }
    }


    private async internalInit() {
        await this.endConnection();
        const baseUrl = environment.config.baseConfig.hubUrl;
        const hubUrl = (baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl) + "/notification-hub";
        this._conn = new SignalR.HubConnectionBuilder()
            .withUrl(hubUrl,{
                accessTokenFactory: ()=> CookieStorage.accessToken?.Token })
            .withAutomaticReconnect()
            .build();

        try {
            await this._conn.start();

            this._conn.on("Receive", eventData => {
                this._appNotification.notificationReady.next(eventData);
            });
        } catch (err) {
        }
    }

    private async endConnection() {
        try {
            if (this._conn && this._conn.state === SignalR.HubConnectionState.Connected) {
                await this._conn.stop();
            }
        } catch (err) {
        }
    }
}
