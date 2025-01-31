import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'responsive-helper',
  templateUrl: './responsive-helper.component.html',
  styleUrls: ['./responsive-helper.component.scss']
})
export class ResponsiveHelperComponent implements OnInit {

  deviceInfo = null;

  constructor(
    private router: Router,
    private deviceService: DeviceDetectorService) { }

  ngOnInit(): void {
  }

  TelLink(href) {
    const downloadLink = document.createElement("a");
    downloadLink.href = href;
    downloadLink.click();
  }

  CheckDeviceMode() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    if (isMobile) {
      this.router.navigate(["/mobile/track-status?openExternalBrowser=1"]);
    } else {
      this.router.navigate(["/main/issue-online/1"]);
    }
  }

  OnIssueOnline() {
    console.log("OnIssueOnline");
    // this.popupVisible = true;
    this.CheckDeviceMode();
  }



}
