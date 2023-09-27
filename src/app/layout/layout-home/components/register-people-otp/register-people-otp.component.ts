import { Dialog } from 'share-ui';

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IReSend, RegisterService } from 'src/app/services/register.service';
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
    hiddensend = "";
    timeData = "60";
    config: any;
    formData: any = {};
    choiceOTP = [
        { id: 1, txt: "เบอร์โทรศัพท์ : " },
        { id: 2, txt: "อีเมล : " }
    ];
    choiceSelect: number;
    _sendOTP: boolean;
    constructor(
        private ServiceRegister: RegisterService,
        private recaptchaV3Service: ReCaptchaV3Service,
        private responsre: RecaptchaService,
        private router: Router,
        private _dialog: Dialog) {
        this._sendOTP = false;
    }

    ngOnInit(): void {
    }

    setDetault(e: any) {
        e.component.option("value", 1);
    }

    censorTel(str) {
        return str.substring(0, str.length - 4) + "****";
    }

    censorEmail(email) {
        const arr = email.split("@");
        return this.censorWord(arr[0]) + "@" + this.censorWord(arr[1]);
    }

    censorWord(str) {
        return str[0] + "*".repeat(str.length - 2) + str.slice(-1);
    }

    Back() {
        this.mainForm.indexTab = 'page1';
        this.mainForm.indexViewTab = 0;
    }
    public LoadDataMainConponent() {
        this.formData = this.mainForm.formRegister;
        // this.choiceOTP = [
        //     { id: 1, txt: "เบอร์โทรศัพท์ : " + this.censorTel(this.formData.PERSONAL_TEL_NO) },
        //     { id: 2, txt: "อีเมล : " + this.censorEmail(this.formData.PERSONAL_EMAIL) }
        // ];
        if (!this.formData.PERSONAL_EMAIL) {
            this.choiceOTP = [
                { id: 1, txt: "เบอร์โทรศัพท์ : " + this.formData.PERSONAL_TEL_NO }
            ];
        } else {
            this.choiceOTP = [
                { id: 1, txt: "เบอร์โทรศัพท์ : " + this.formData.PERSONAL_TEL_NO },
                { id: 2, txt: "อีเมล : " + this.formData.PERSONAL_EMAIL }
            ];
        }
        this._sendOTP = false;
    }

    sendOTP() {
        this._sendOTP = true;
        this.sendAgain();
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
                if (token) {
                    this.ServiceRegister.postActiveMQgdcc(this.mainForm.formRegister.REGISTER_USER_NAME, this.otpnumber)
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
        this.hiddensend = "hidden";
        setTimeout(() => {
            this.hiddensend = "";
        }, 60000);
        this.config = { leftTime: this.timeData, formatDate: ({ date }) => `${date / 1000}`, demand: false };
        if (this.choiceSelect === 1) {
            this.ServiceRegister.sendSMSgdcc(this.mainForm.formRegister.REGISTER_USER_NAME, this.mainForm.formRegister.PERSONAL_TEL_NO)
                .pipe(finalize(() => this._isLoading = false))
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
                            title: 'เเจ้งเตือน!',
                            text: 'ระบบส่งรหัส OTP ไปที่เบอร์โทรศัพท์แล้ว',
                            icon: 'warning',
                            confirmButtonText: 'ตกลง'
                        }).then(() => { });
                    }
                });
        } else if (this.choiceSelect === 2) {
            this.ServiceRegister.postReSendgdcc(this.mainForm.formRegister.REGISTER_USER_NAME, this.mainForm.formRegister.PERSONAL_EMAIL)
                .pipe(finalize(() => this._isLoading = false))
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
                            title: 'เเจ้งเตือน!',
                            text: 'ระบบส่งรหัส OTP ไปที่อีเมลแล้ว',
                            icon: 'warning',
                            confirmButtonText: 'ตกลง'
                        }).then(() => { });
                    }
                });
        }
    }

    login() {
        this.router.navigate(["login"]);
    }
}
