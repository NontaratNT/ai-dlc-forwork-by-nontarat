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
import { DataService } from 'src/app/services/HybridCrypto/Data.service';

@Component({
    selector: 'app-forget-password',
    templateUrl: './forget-password.component.html',
    styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
    public mainForm: LoginComponent;
    _isLoading = false;

    constructor(private userServ: UserService,
                private recaptchaV3Service: ReCaptchaV3Service,
                private responsre: RecaptchaService,
                private route: Router,
            private dataService: DataService) { }

                

    ngOnInit(): void {
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
                    Swal.fire({
                        title: 'สำเร็จ!',
                        text: 'ระบบส่งอีเมลเพื่อให้ตั้งรหัสผ่านใหม่เรียบร้อย',
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
        this.route.navigate(["login"]);
    }
}
