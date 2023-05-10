import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApplicationNotificationService {
    private _eventBag: Map<string, Subject<any>> = new Map();
    constructor() { }

    public get notificationReady(): Subject<any> {
        let event = this._eventBag.get("notification-ready");
        if (!event) {
            event = new Subject<any>();
            this._eventBag.set("notification-ready", event);
        }
        return event;
    }

    public get notificationCountChange(): Subject<any> {
        let event = this._eventBag.get("notification-count-change");
        if (!event) {
            event = new Subject<any>();
            this._eventBag.set("notification-count-change", event);
        }
        return event;
    }

    public get languageChange(): Subject<any> {
        let event = this._eventBag.get("language-change");
        if (!event) {
            event = new Subject<any>();
            this._eventBag.set("language-change", event);
        }
        return event;
    }

    public clear(): void {
        this._eventBag.forEach(_ => _.unsubscribe());
        this._eventBag.clear();
    }
}
