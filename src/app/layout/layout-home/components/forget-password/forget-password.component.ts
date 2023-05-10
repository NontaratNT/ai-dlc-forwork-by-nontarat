/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { custom } from 'devextreme/ui/dialog';
import { finalize } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { LoginComponent } from '../login/login.component';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { RecaptchaService } from 'src/app/services/recaptcha.service';
import { RegisterService } from 'src/app/services/register.service';

@Component({
    selector: 'app-forget-password',
    templateUrl: './forget-password.component.html',
    styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
    public mainForm: LoginComponent;
    _isLoading = false;
    choiceOTP = [
        { id: 1, txt: "อีเมล" },
        { id: 2, txt: "เบอร์โทรศัพท์" },
    ];
    choiceSelect: number;
    timeData = "60";
    config: any;
    hiddensend: false;
    btnSend: boolean;
    otpnumber: string;
    telnumber: string;
    constructor(
        private userServ: UserService,
        private ServiceRegister: RegisterService,
        private recaptchaV3Service: ReCaptchaV3Service,
        private responsre: RecaptchaService,
        private route: Router) { }

    ngOnInit(): void {
        this.btnSend = false;
        this.choiceSelect = 1;
        // Swal.fire({
        //     title: 'แจ้งเตือน!',
        //     text: 'กำลังพัฒนาระบบกู้รหัสผ่านด้วยเบอร์โทรศัพท์และอีเมล ขออภัยในความไม่สะดวก',
        //     icon: 'warning',
        //     confirmButtonText: 'ตกลง'
        // }).then(() => {
        //     this.login();
        // });
    }

    setDetault(e: any) {
        e.component.option("value", 1);
    }

    sendSMS(tel) {
        if (!tel) {
            Swal.fire({
                title: 'แจ้งเตือน!',
                text: 'กรุณากรอกเบอร์โทรศัพท์',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            });
            return;
        }
        if (tel.length !== 10) {
            Swal.fire({
                title: 'แจ้งเตือน!',
                text: 'กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            });
            return;
        }
        this._isLoading = true;
        this.ServiceRegister.forgetSMS(tel)
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
                    }).then(() => {
                        this.telnumber = tel;
                        this.btnSend = true;
                        setTimeout(() => {
                            this.btnSend = false;
                        }, 60000);
                        this.config = { leftTime: this.timeData, formatDate: ({ date }) => `${date / 1000}`, demand: false };
                    });
                }
            });
    }

    confirmOTP() {
        if (!this.otpnumber) {
            Swal.fire({
                title: 'แจ้งเตือน!',
                text: 'กรุณากรอก รหัส OTP',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                this._isLoading = false;
            });
            this._isLoading = false;
            return;
        }

        this._isLoading = true;
        this.ServiceRegister.forgetSMSConfirm(this.telnumber, this.otpnumber)
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
                    this.route.navigate(["/reset-password"], { queryParams: { token: _.Value } });
                }
            });
    }

    onForget(email) {

        this._isLoading = true;
        const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        // this.recaptchaV3Service.execute('forgetpasswordSubmit')
        //     .subscribe((token) => {
        //         if(token){
        if (email.match(pattern)) {
            this.userServ.postForgetPassword(email)
                .pipe(finalize(() => this._isLoading = false))
                .subscribe(_ => {
                    let textAlert = "<div>ระบบส่งอีเมลเพื่อให้ตั้งรหัสผ่านใหม่เรียบร้อย</div>";
                    textAlert += "<div>หากไม่พบใน inbox กรุณาตรวจสอบใน Junk Mail</div>";
                    Swal.fire({
                        title: 'สำเร็จ!',
                        html: `<div>${textAlert}</div>`,
                        icon: 'success',
                        confirmButtonText: 'ตกลง'
                    }).then(() => {
                        this.route.navigate(["login"]);
                    });
                });

        } else {
            this._isLoading = false;
            Swal.fire({
                title: 'แจ้งเตือน!',
                text: 'กรุณากรอกอีเมลให้ถูกต้อง',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => { });
        }


        // }
        // console.log(token);
        // this.responsre.postCheckRecapcha(token)
        //     .subscribe(_ => {
        //         // console.log('data', _);
        //     });

        // });

    }

    login() {
        this.route.navigate(["/login"]);
    }
}
