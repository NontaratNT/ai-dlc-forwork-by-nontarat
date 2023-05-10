import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/services/user';
import Swal from 'sweetalert2';
import { UserSettingService } from 'src/app/services/user-setting.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
    selector: 'app-header-new',
    templateUrl: './header-new.component.html',
    styleUrls: ['./header-new.component.scss']
})
export class HeaderNewComponent implements OnInit {
    _isLoading = false;
    hasSession = false;
    constructor(
        private _router: Router,
        private userSetting: UserSettingService,
        private _loginServ: LoginService,

    ) { }

    ngOnInit(): void {
        const user = User.Current ?? undefined;
        if (user){
            this.hasSession = true;
        }
    }
    RedirectUrl(url){
        this._router.navigate([url]);
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
}
