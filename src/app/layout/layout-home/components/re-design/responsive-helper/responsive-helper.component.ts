import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { User } from 'src/app/services/user';
import * as Cookies from 'js-cookie';
import { environment } from 'src/environments/environment';
import { createSessionCookie } from 'src/app/common/helper';

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

  CheckDeviceMode(type = 1) {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const routes = {
      1: isMobile ? "/mobile/issue-online/1" : "/main/issue-online/1",
      2: isMobile ? "/mobile/issue-online-report" : "/main/issue-online-report",
      3: isMobile ? "/mobile/chat-list" : "/main/chat-list",
      4: isMobile ? "/mobile/track-status?openExternalBrowser=1" : "/main/task-list",
    };

    const targetRoute = routes[type];
    if (targetRoute) {
      this.router.navigate([targetRoute]);
    }
  }

  OnIssueOnline() {
    this.CheckDeviceMode(1);
  }

  OnIssueReport() {
    if (!User?.Current) {
      this.router.navigate(['/login']);
      return;
    }
    this.CheckDeviceMode(2);
  }

  OnClickButton(number) {
    if (!User?.Current) {
      this.router.navigate(['/login']);
      return;
    }
    this.CheckDeviceMode(number);
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  ngAfterViewInit(): void {
    window.addEventListener("scroll", () => {
      const button = document.querySelector(".to-top-btn");
      if (button) {
        if (window.scrollY > 150) {
          button.classList.add("show");
        } else {
          button.classList.remove("show");
        }
      }
    });
  }

  openThaiD() {
    this.router.navigate(["page-suspention"]);
  }



}
