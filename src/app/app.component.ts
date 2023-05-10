import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { EFormDefaulti18n } from 'eform-share';
import thLng from '../assets/i18n/th';
import enLng from '../assets/i18n/en';
import Popup from "devextreme/ui/popup";
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
declare const NodesJs: any;
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'ccib-oss-ext-ui';
    deviceInfo = null;
    constructor(
        public _appServ: AppService,
        private deviceService: DeviceDetectorService,
        private router: Router,
    ) {
        EFormDefaulti18n.language = localStorage.getItem("langMode") || "th";
        EFormDefaulti18n.i18n = {
            th: thLng,
            en: enLng
        };
        Popup.defaultOptions({
            device: { deviceType: "phone" },
            options: {
                fullScreen:true
            }
        });
    }
    CheckDeviceMode() {
        this.deviceInfo = this.deviceService.getDeviceInfo();
        const isMobile = this.deviceService.isMobile();
        const isTablet = this.deviceService.isTablet();
        const isDesktopDevice = this.deviceService.isDesktop();
        // console.log(this.deviceInfo);
        // console.log('isMobile',isMobile);
        // console.log('isTablet',isTablet);
        // console.log('isDesktopDevice',isDesktopDevice);
        if (isMobile) {
            this.router.navigate(["/mobile/track-status?openExternalBrowser=1"]);
        }else{
            this.router.navigate(["/main/page1"]);
        }
    }
    ngOnInit(): void {
        // const nodesjs = new NodesJs({
        //     id: 'nodes',
        //     width: window.innerWidth,
        //     height: window.innerHeight,
        //     particleSize: 2,
        //     lineSize: 1,
        //     particleColor: [255, 255, 255, 0.3],
        //     lineColor: [255, 255, 255],
        //     backgroundFrom: [10, 25, 100],
        //     backgroundTo: [10, 25, 100],
        //     backgroundDuration: 3000,
        //     nobg: false,
        //     // eslint-disable-next-line id-blacklist
        //     number: window.hasOwnProperty('orientation') ? 40 : 30,
        //     speed: 20,
        //     pointerCircleRadius: 100
        // });

    }

    nodeJsCop() {
        const nodesjs = new NodesJs({
            id: 'nodes',
            width: window.innerWidth,
            height: window.innerHeight,
            particleSize: 2,
            lineSize: 1,
            particleColor: [255, 255, 255, 0.3],
            lineColor: [255, 255, 255],
            backgroundFrom: [10, 25, 100],
            backgroundTo: [10, 25, 100],
            backgroundDuration: 3000,
            nobg: false,
            // eslint-disable-next-line id-blacklist
            number: window.hasOwnProperty('orientation') ? 30 : 30,
            speed: 20,
            pointerCircleRadius: 100
        });
    }

}
