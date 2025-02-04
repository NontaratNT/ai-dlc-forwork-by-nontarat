import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LoginService } from 'src/app/services/login.service';
import { User } from 'src/app/services/user';
import { UserSettingService } from 'src/app/services/user-setting.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'header-re-design',
  templateUrl: './header-re-design.component.html',
  styleUrls: ['./header-re-design.component.scss']
})
export class HeaderReDesignComponent implements OnInit {

  _isLoading = false;
  hasSession = false;
  popupVisible = false;
  deviceInfo = null;
  menuOpen: boolean = false;  // ควบคุมการเปิด/ปิดเมนู

  constructor(
    private _router: Router,
    private userSetting: UserSettingService,
    private _loginServ: LoginService,
    private deviceService: DeviceDetectorService
  ) { }

  ngOnInit(): void {
    const user = User.Current ?? undefined;
    if (user) {
      this.hasSession = true;
    }
  }

  RedirectUrl(url) {
    this._router.navigate([url]);
  }

  OnIssueOnline() {
    this.CheckDeviceMode();
    // this.popupVisible = true;
  }

  logout() {
    Swal.fire({
      title: 'คุณต้องการออกจากระบบ หรือไม่?',
      text: " ",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2778c4',
      cancelButtonColor: '#ce312c',
      cancelButtonText: 'ยกเลิก',
      confirmButtonText: 'ตกลง'
    }).then((result) => {
      if (result.isConfirmed) {
        this._isLoading = true;

        Swal.fire({
          title: 'สำเร็จ!',
          text: 'คุณได้ออกจากระบบเรียบร้อย',
          icon: 'success',
          confirmButtonText: 'ตกลง'
        }).then(() => {
          this.userSetting.userSetting.location_name = undefined;
          this.userSetting.Save();
          this._loginServ.logout();
          location.reload();
        });
      }
    });
  }

  closePopupWarning() {
    this.popupVisible = false;
    this.CheckDeviceMode();
  }

  CheckDeviceMode() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    if (isMobile) {
      this._router.navigate(["/mobile/track-status?openExternalBrowser=1"]);
    } else {
      this._router.navigate(["/main/issue-online/1"]);
    }
  }

  // ฟังก์ชันเปิด/ปิดเมนู
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
