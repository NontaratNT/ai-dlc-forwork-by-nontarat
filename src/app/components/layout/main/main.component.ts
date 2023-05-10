import { ViewportScroller } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ApplicationNotificationService } from 'src/app/services/application-notification.service';
import { NotificationHubService } from 'src/app/services/hubs/notification-hub.service';
declare let $: any;

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

    constructor(private _nhs: NotificationHubService,
                public scroll: ViewportScroller,
                private _appNotification: ApplicationNotificationService) { }

    ngOnInit(): void {
        this._nhs.start();
    }

    ngOnDestroy(): void {
        this._nhs.stop();
        this._appNotification.clear();
    }
    /**
     * เช็ค event ตอนที่ click กรณีนี้เอามาใช้กับปุ่ม "ถัดไป" เพื่อ scroll top.
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @HostListener('document:click', ['$event.target'])
    eventClick(event) {
        const getTarget = event;
        // console.log(getTarget);
        if($(getTarget).hasClass('btn-wizard-nav-next') || $(getTarget).hasClass('btn-wizard-nav-previous')){
            this.scroll.scrollToPosition([0,0]);
            // this.scroll.scrollToAnchor('layoutContent');
        }
    }

}
