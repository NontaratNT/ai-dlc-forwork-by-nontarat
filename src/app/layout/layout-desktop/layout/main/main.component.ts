import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxDrawerComponent } from "devextreme-angular";
import { DeviceDetectorService } from "ngx-device-detector";

@Component({
    selector: "app-main",
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
    @ViewChild(DxDrawerComponent, { static: false }) drawer: DxDrawerComponent;
    deviceInfo = null;

    isDrawerOpen = true;
    elementAttr: any;
    constructor(
        private _deviceService: DeviceDetectorService,
        private _router: Router,
    ) {}

    ngOnInit(): void {
        this.CheckDeviceMode();
    }
    DrawerMenu(){
        this.isDrawerOpen = !this.isDrawerOpen;
        const elementMenu = document.getElementsByClassName('dx-drawer-panel-content');
        const elementMenuHtml = elementMenu[0] as HTMLElement;
        elementMenuHtml.style.width = this.isDrawerOpen ? "260px !important":"0px !important" ;
    }
    ContentSize(){
        return this.isDrawerOpen?"size-full":"size-mini";
    }
    ContentSizeWidth(){
        return this.isDrawerOpen?260:65;
    }
    MenuChange(e){
        const d = e || undefined;
        const link = d.link || undefined;
        if (link) {
            this._router.navigate([link]);
        }
    }
    CheckDeviceMode() {
        this.deviceInfo = this._deviceService.getDeviceInfo();
        const isMobile = this._deviceService.isMobile();
        const isTablet = this._deviceService.isTablet();
        const isDesktopDevice = this._deviceService.isDesktop();
        // console.log(this.deviceInfo);
        // console.log('isMobile',isMobile);
        // console.log('isTablet',isTablet);
        // console.log('isDesktopDevice',isDesktopDevice);

    }

}
