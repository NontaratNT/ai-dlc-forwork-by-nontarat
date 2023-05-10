import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from "jquery";
import { LoginService } from 'src/app/services/login.service';
import { UserSettingService } from 'src/app/services/user-setting.service';
import Swal from 'sweetalert2';
@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    isLoading = false;
    constructor(private _loginServ: LoginService, private router: Router, private userSetting: UserSettingService,) { }

    ngOnInit(): void {
        this.isLoading = true;
        this.setDefault();
    }
    setDefault() {
        $('.nav li').on("click", function () {
            $(this).addClass('is-active').siblings().removeClass('is-active');
        });
        setTimeout(_ => {
            this.isLoading = false;
        }, 3000);
        // this.isLoading = false;
    }
    onSelectReport() {
        if (this.userSetting.userSetting.issue_status === false) {
            this.router.navigate(["/mobile/issue-online/1"]);
            this.userSetting.userSetting.location_name = undefined;
            this.userSetting.userSetting.iconVisible = false;
        }
        //  else {
        //     Swal.fire({
        //         title: 'ท่านยังไม่ได้ทำการบันทึกข้อมูลแจ้งเรื่อง',
        //         text: 'ต้องการออกจากหน้าแจ้งเรื่อง หรือไม่?',
        //         icon: 'error',
        //         allowOutsideClick: false,
        //         showCancelButton: true,
        //         confirmButtonText: 'ตกลง'
        //     }).then((result) => {
        //         if (result.isConfirmed) {
        //             this.userSetting.userSetting.issue_status = false;
        //             this.router.navigate(["/mobile/issue-online/1"]);
        //             this.userSetting.userSetting.location_name = undefined;
        //         }
        //     });
        // }


        // this.userSetting.Save();
    }
    onSelectStatus() {
        if (this.userSetting.userSetting.issue_status === false) {
            this.router.navigate(["/mobile/track-status?openExternalBrowser=1"]);
            this.userSetting.userSetting.location_name = undefined;
            this.userSetting.userSetting.iconVisible = false;
            // this.userSetting.Save();
        } else {
            Swal.fire({
                title: 'คุณยังไม่ได้บันทึกข้อมูล',
                text: 'ต้องการออกจากหน้านี้ หรือไม่?',
                icon: 'error',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonText: 'ตกลง'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.userSetting.userSetting.issue_status = false;
                    this.router.navigate(["/mobile/track-status?openExternalBrowser=1"]);
                    this.userSetting.userSetting.location_name = undefined;
                    this.userSetting.userSetting.tabIndex = undefined;
                    this.userSetting.userSetting.iconVisible = false;
                }
            });
        }
    }
    onSelectProfile() {
        if (this.userSetting.userSetting.issue_status === false) {
            this.router.navigate(["/mobile/personal"]);
            this.userSetting.userSetting.location_name = undefined;
            this.userSetting.userSetting.iconVisible = false;
            // this.userSetting.Save();
        } else {
            Swal.fire({
                title: 'คุณยังไม่ได้บันทึกข้อมูล',
                text: 'ต้องการออกจากหน้านี้ หรือไม่?',
                icon: 'error',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonText: 'ตกลง'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.userSetting.userSetting.issue_status = false;
                    this.router.navigate(["/mobile/personal"]);
                    this.userSetting.userSetting.location_name = undefined;
                    this.userSetting.userSetting.tabIndex = undefined;
                    this.userSetting.userSetting.iconVisible = false;
                }
            });
        }
    }

    async logout() {
        // const confirm = await Dialogue.Confirm("ยืนยัน", `คุณต้องการออกจากระบบ หรือไม่?`);
        // if (!confirm) {
        //     this.check = true;
        //     return;
        // }
        // else {
        //     // this._dialog.info("สำเร็จ", "คุณได้ออกจากระบบเรียบร้อย").then(() => {
        //     //     this._loginServ.logout();
        //     // });
        //     Swal.fire({
        //         title: 'สำเร็จ!',
        //         text: 'คุณได้ออกจากระบบเรียบร้อย',
        //         icon: 'success',
        //         confirmButtonText: 'ตกลง'
        //     }).then(() => {
        //         this._loginServ.logout();
        //     });
        // }

        Swal.fire({
            title: 'ยืนยัน',
            text: 'คุณต้องการออกจากระบบ',
            icon: 'error',
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'สำเร็จ!',
                    text: 'คุณได้ออกจากระบบเรียบร้อย',
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                }).then(() => {
                    this._loginServ.logout();
                });
                // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                //     this.router.navigate(['main/register-history']);
                // });
            }
        });
    }

}
