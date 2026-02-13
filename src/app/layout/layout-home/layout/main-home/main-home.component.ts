import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LoginService } from 'src/app/services/login.service';
import { User } from 'src/app/services/user';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-main-home',
    templateUrl: './main-home.component.html',
    styleUrls: ['./main-home.component.scss']
})
export class MainHomeComponent implements OnInit {

    isMobile = false;
    isTablet = false;
    isDesktop = false;
    deviceInfo: any = null;

    constructor(private router: Router, private breakpointObserver: BreakpointObserver,
        private _loginServ: LoginService,
        private deviceService: DeviceDetectorService) {
        this.breakpointObserver.observe([
            '(max-width: 599.98px)',  // Mobile
            '(min-width: 600px) and (max-width: 959.98px)', // Tablet (Custom)
            '(min-width: 960px)'  // Desktop
        ]).subscribe(result => {
            this.isMobile = result.breakpoints['(max-width: 599.98px)'];
            this.isTablet = result.breakpoints['(min-width: 600px) and (max-width: 959.98px)'];
            this.isDesktop = result.breakpoints['(min-width: 960px)'];

            if (this.isMobile) {
                console.log("📱 ตอนนี้คุณอยู่ในโหมด Mobile");
            } else if (this.isTablet) {
                console.log("📟 ตอนนี้ใช้งานอยู่ในโหมด Tablet");
            } else if (this.isDesktop) {
                console.log("🖥️ ตอนนี้ใช้งานอยู่ในโหมด Window");
            }
        });
    }

    async ngOnInit(): Promise<void> {
        console.log(window.location);
        if (User?.Current) {
            let needChange = false;

            if (User.Current.LatestUpdatePassword) {
                const currentDate = new Date();
                const latestUpdate = new Date(User.Current.LatestUpdatePassword);

                // วันที่ 1 เดือนก่อนหน้า
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(currentDate.getMonth() - 1);

                if (latestUpdate < oneMonthAgo) {
                    needChange = true;
                }
            } else {
                // ถ้าไม่มีค่า LatestUpdatePassword
                needChange = true;
            }

            if (needChange) {
                const check_password = await Swal.fire({
                    title: 'แจ้งเตือน',
                    html: 'กรุณาอัปเดตรหัสผ่านของท่านใหม่ <br> เพื่อความปลอดภัยของบัญชีผู้ใช้',
                    icon: 'warning',
                    confirmButtonText: 'ตกลง',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCancelButton: true,
                    cancelButtonText: 'ออกจากระบบ',
                    cancelButtonColor: '#d33'
                });

                if (check_password.isConfirmed) {
                    console.log('ต้องเปลี่ยนรหัสผ่าน');
                    this.router.navigate(['/reset-password-force']);
                } else {
                    this._loginServ.logout();
                    this.router.navigate(['/login']);
                }
                return;
            }
        }

    }

    LinkCyberEye() {
        if (!User?.Current) {
            Swal.fire({
                title: 'Cyber Eye',
                text: 'คุณต้องการเข้าใช้งาน Cyber Eye หรือไม่?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ตกลง',
                cancelButtonText: 'ยกเลิก',
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-secondary'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    this.router.navigate(['/login'], { queryParams: { icli: 'cyber-eye' } });
                }
            }
            );
        } else {
            this.CheckDeviceMode(2);
        }
    }

    LinkCyberCat() {
        if (!User?.Current) {
            Swal.fire({
                title: 'Cyber Eye',
                html: 'คุณต้องการเข้าใช้งาน Cyber Cat หรือไม่? <br> <span class="text-danger">*หมายเหตุ: ท่านต้องอายุ ไม่เกิน 18 ปีเท่านั้น</span>',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ตกลง',
                cancelButtonText: 'ยกเลิก',
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-secondary'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    this.router.navigate(['/login'], { queryParams: { icli: 'cyber-cat' } });
                }
            }
            );
        } else {
            if (User?.Current?.CyberCatStatus === "Y") {
                this.CheckDeviceMode(2);
            } else {
                Swal.fire({
                    title: 'Cyber Cat',
                    html: 'คุณต้องการเข้าใช้งาน Cyber Cat หรือไม่? <br> <span class="text-danger">*หมายเหตุ: ท่านต้องอายุ ไม่เกิน 18 ปีเท่านั้น</span>',
                    icon: 'info',
                    confirmButtonText: 'ตกลง',
                    cancelButtonText: 'ยกเลิก',
                    showCancelButton: true,
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-secondary'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        if (User?.Current?.Age <= 18) {
                            this.CheckDeviceMode(2);
                        } else {
                            Swal.fire({
                                title: 'อายุของท่านไม่ตรงเกณฑ์ที่กำหนด',
                                text: 'ท่านต้องมีอายุไม่เกิน 18 ปี เพื่อเข้าใช้งาน Cyber Cat',
                                icon: 'error',
                                confirmButtonText: 'ตกลง'
                            });
                            return;
                        }
                    }
                });
            }
        }
    }

    CheckDeviceMode(type = 1) {
        this.deviceInfo = this.deviceService.getDeviceInfo();
        const isMobile = this.deviceService.isMobile();
        const routes = {
            1: isMobile ? "/mobile/issue-online?openExternalBrowser=1" : "/main/issue-online/1",
            2: isMobile ? "/mobile/issue-online-report" : "/main/issue-online-report"
        };

        const targetRoute = routes[type];
        if (targetRoute) {
            this.router.navigate([targetRoute]);
        }
    }

    openLink(link: string) {
        this.router.navigate([link], { queryParams: { icli: 'landing' } });
    }

}
