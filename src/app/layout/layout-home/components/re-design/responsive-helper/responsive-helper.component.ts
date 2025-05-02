import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { User } from 'src/app/services/user';

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
      2: isMobile ? "/mobile/issue-online-report" : "/main/issue-online-report"
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
    if(!User?.Current){
      this.router.navigate(['/login', { queryParams: { icli: "cyber-eye" }}]);
      return;
    }
    this.CheckDeviceMode(2);
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



}
