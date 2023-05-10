import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { custom } from 'devextreme/ui/dialog';
import { finalize } from 'rxjs/operators';
import { Dialog } from 'share-ui';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    _isLoading = false;
    myToken: string;
    constructor(private _dialog: Dialog,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private user: UserService) { }

    ngOnInit(): void {

        this.activatedRoute.queryParams.subscribe(Token => {
            // eslint-disable-next-line @typescript-eslint/dot-notation
            this.myToken = Token['token'];
        });
    }



    onSubmit(password, password_again) {
        if (!password || !password_again){
            Swal.fire({
                title: 'ผิดพลาด!',
                text: 'กรุณากรอกรหัสผ่านใหม่',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => {});
            return;
        }
        this._isLoading = true;

        if (password !== password_again) {
            this._isLoading = false;
            // this._dialog.error("ผิดพลาด", "รหัสผ่านไม่ตรงกัน");
            Swal.fire({
                title: 'ผิดพลาด!',
                text: 'รหัสผ่านไม่ตรงกัน',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => {});
            return;
        }

        const letterNumber = /^[ก-๏\s]+$/;
        if(password.match(letterNumber))
        {
            // this._dialog.info("แจ้งเตือน", "กรุณากรอกรหัสผ่านเป็นภาษาอังกฤษหรือตัวเลข").then(() =>   this._isLoading = false);
            Swal.fire({
                title: 'แจ้งเตือน!',
                text: 'กรุณากรอกรหัสผ่านเป็นภาษาอังกฤษหรือตัวเลข',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                this._isLoading = false;
            });
            this._isLoading = false;
            return;
        }


        this.user.postResetPassword(this.myToken, password)
            .pipe(finalize(() => this._isLoading = false))
            .subscribe(_ => {
                // custom({
                //     messageHtml: "เปลี่ยนรหัสผ่านเรียบร้อย",
                //     title: "สำเร็จ",
                //     buttons: [
                //         { text: "ปิด" }
                //     ]
                // }).show().then(() => {
                //     this.router.navigate(["login"]);
                // });
                Swal.fire({
                    title: 'สำเร็จ!',
                    text: 'เปลี่ยนรหัสผ่านเรียบร้อย',
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                }).then(() => {
                    this.router.navigate(["login"]);
                });
            });
    }

    btnBack() {
        this.router.navigate(["login"]);
    }
}
