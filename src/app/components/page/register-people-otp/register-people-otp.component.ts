import { Dialog } from 'share-ui';
import { IActive, RegisterService } from './../../../services/register.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IReSend } from 'src/app/services/register.service';
import { RegisterPeopleComponent } from '../register-people/register-people.component';
import { custom } from 'devextreme/ui/dialog';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { RecaptchaService } from 'src/app/services/recaptcha.service';

@Component({
    selector: 'app-register-people-otp',
    templateUrl: './register-people-otp.component.html',
    styleUrls: ['./register-people-otp.component.scss']
})
export class RegisterPeopleOtpComponent implements OnInit {
    public mainForm: RegisterPeopleComponent;
    _isLoading = false;
    otpnumber: string;
    constructor(
        private ServiceRegister: RegisterService,
        private recaptchaV3Service: ReCaptchaV3Service,
        private responsre: RecaptchaService,
        private router: Router,
        private _dialog: Dialog) {
    }

    ngOnInit(): void {
    }
    Back() {
        this.mainForm.multiView.selectedIndex = 0;
    }
    SaveRegister() {
        this._isLoading = true;
        if (!this.otpnumber) {
            // this._dialog.info("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบถ้วน").then(() => this._isLoading =false);
            Swal.fire({
                title: 'แจ้งเตือน!',
                text: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                this._isLoading = false;
            });
            this._isLoading = false;
            return;
        }
        this.recaptchaV3Service.execute('registerSubmit')
            .subscribe((token) => {
                if(token){
                    this.ServiceRegister.postActiveMQ(this.mainForm.formRegister.PERSONAL_EMAIL, this.otpnumber)
                        .pipe(finalize(() => { this._isLoading = false; }))
                        .subscribe(_ => {
                            if (!_.IsSuccess) {
                                Swal.fire({
                                    title: 'ผิดพลาด!',
                                    text: `${_.Message}`,
                                    icon: 'warning',
                                    confirmButtonText: 'ตกลง'
                                }).then(() => { });
                                return;
                            } else {
                                Swal.fire({
                                    title: 'สำเร็จ!',
                                    text: 'ลงทะเบียนเรียบร้อย',
                                    icon: 'success',
                                    confirmButtonText: 'ตกลง'
                                }).then(() => {
                                    this.router.navigate(["login"]);
                                });
                            }
                        });
                }
            });
    }
    sendAgain() {
        this._isLoading = true;
        this.ServiceRegister.postReSend(this.mainForm.formRegister.PERSONAL_EMAIL)
            .pipe(finalize(() => this._isLoading = false))
            .subscribe(_ => {
                if (!_.IsSuccess) {
                    // this._dialog.error("ผิดพลาด", _.Message);
                    Swal.fire({
                        title: 'ผิดพลาด!',
                        text: `${_.Message}`,
                        icon: 'warning',
                        confirmButtonText: 'ตกลง'
                    }).then(() => { });
                    return;
                } else {
                    // this._dialog.info("แจ้งเตือน", "ระบบส่งรหัส OTP ไปที่อีเมลแล้ว");
                    Swal.fire({
                        title: 'เเจ้งเตือน!',
                        text: 'ระบบส่งรหัส OTP ไปที่อีเมลแล้ว',
                        icon: 'warning',
                        confirmButtonText: 'ตกลง'
                    }).then(() => { });
                }
            });
    }

    login() {
        this.router.navigate(["login"]);
    }
}
