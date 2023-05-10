import { Dialog } from 'share-ui';
import { IRegister, RegisterService } from './../../../services/register.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SocialAuthService } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { RegisterPeopleOtpComponent } from '../register-people-otp/register-people-otp.component';
import { DxFormComponent, DxMultiViewComponent } from 'devextreme-angular';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ITitleInfo, TitleService } from 'src/app/services/title.service';
@Component({
    selector: 'app-register-people',
    templateUrl: './register-people.component.html',
    styleUrls: ['./register-people.component.scss']
})
export class RegisterPeopleComponent implements OnInit {
    @ViewChild(DxMultiViewComponent, { static: true }) multiView: DxMultiViewComponent;
    @ViewChild(DxFormComponent, { static: true }) form: DxFormComponent;
    @ViewChild(RegisterPeopleOtpComponent, { static: true }) formRegisterPeopleOtp: RegisterPeopleOtpComponent;
    @Input() formRegister: IRegister;
    usersocial: SocialUser;
    loggedIn: boolean;
    email: string;
    fname: string;
    _maxLength = 10;
    lname: string;
    tel: string;
    password: string;
    cfpassword: string;
    _isLoading = false;
    type_register = "";
    ppidImagePath: string | ArrayBuffer;
    ppidImagePath3: string | ArrayBuffer;
    imageFile: File;
    title: ITitleInfo[];
    validatePpidMessage: string;
    constructor(
        private ServiceRegister: RegisterService,
        private router: Router,
        private serviceTitle: TitleService) {
        this.formRegister = {} as any;
    }

    ngOnInit(): void {
        this.formRegisterPeopleOtp.mainForm = this;
        this.serviceTitle.GetTitle().subscribe((_) => (this.title = _));
    }
    Back() {
        this.router.navigate(["login"]);
    }
    sendAgain() {

    }
    setDefaultPic() {
        this.ppidImagePath = "assets/image/images.png";
    }
    openFileDialog(e, uploadTag) {
        e.event.stopPropagation();
        uploadTag.click();
    }

    onImageAdd(uploadTag, imageTag) {
        const files: FileList = uploadTag.files;
        let fileReader: FileReader;
        if (files.length > 0) {
            this.imageFile = files.item(0);
            fileReader = new FileReader();
            fileReader.readAsDataURL(this.imageFile);
            fileReader.onloadend = () =>
                (this.ppidImagePath = fileReader.result);
        }
    }
    SaveRegister() {
        this._isLoading = true;
        if (
            !this.imageFile ||
            !this.formRegister.TITLE_ID
            || !this.formRegister.PERSONAL_FNAME_THA
            || !this.formRegister.PERSONAL_LNAME_THA
            || !this.formRegister.PERSONAL_TEL_NO
            || !this.formRegister.PERSONAL_BIRTH_DATE
            || !this.formRegister.PERSONAL_CITIZEN_NUMBER
            || !this.formRegister.PERSONAL_LASER_NUMBER
            || !this.formRegister.PERSONAL_EMAIL
            || !this.password || !this.formRegister.NEW_PASSWORD) {
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
        if (!this.validateEmail(this.formRegister.PERSONAL_EMAIL)) {
            Swal.fire({
                title: 'แจ้งเตือน!',
                text: 'กรุณากรอกอีเมลให้ถูกต้อง !!!',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                this._isLoading = false;
            });
            this._isLoading = false;
            return;
        }

        if (this.password !== this.formRegister.NEW_PASSWORD) {
            Swal.fire({
                title: 'แจ้งเตือน!',
                text: 'รหัสผ่านไม่ตรงกันกรุณาตรวจสอบรหัสผ่าน !!!',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                this._isLoading = false;
            });
            this._isLoading = false;
            return;
        }

        const letterNumber = /^[ก-๏\s]+$/;
        if (this.password.match(letterNumber)) {
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
        if (this.formRegister.PERSONAL_TEL_NO.length !== this._maxLength) {
            Swal.fire({
                title: 'แจ้งเตือน!',
                text: 'กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                this._isLoading = false;
            });
            this._isLoading = false;
            return;
        }
        this.ServiceRegister.postRegisterMQ(this.FormatData())
            .pipe(finalize(() => { this._isLoading = false; }))
            .subscribe(_ => {
                if (!_.IsSuccess) {
                    Swal.fire({
                        title: 'ผิดพลาด!',
                        text: `${_.Message}`,
                        // text: 'ไม่พบข้อมูลของท่านในระบบกรมการปกครอง',
                        icon: 'warning',
                        confirmButtonText: 'ตกลง'
                    }).then(() => { });
                    return;
                } else {
                    this.multiView.selectedIndex = 1;
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                }
            });
    }
    // signInWithGoogle() {
    //     this.type_register = "GM";
    //     this._isLoading = true;
    //     this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    //     this.authService.authState.subscribe((user) => {
    //         this.usersocial = user;
    //         this.loggedIn = (user != null);
    //         if (this.usersocial) {
    //             this._isLoading = false;
    //         }
    //         else {
    //             Swal.fire({
    //                 title: 'แจ้งเตือน!',
    //                 text: 'อีเมล หรือ รหัสผ่านไม่ถูกต้อง กรุณาใส่ใหม่อีกครั้งหรือกดลืมรหัสผ่าน !!!',
    //                 icon: 'warning',
    //                 confirmButtonText: 'ตกลง'
    //             }).then(() => {
    //                 this._isLoading = false;
    //             });
    //             this._isLoading = false;
    //         }
    //     });
    // }
    // signInWithFB(): void {
    //     this.type_register = "FB";
    //     this._isLoading = true;
    //     this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    //     this.authService.authState.subscribe((user) => {
    //         this.usersocial = user;
    //         this.loggedIn = (user != null);
    //         if (this.usersocial) {


    //             this._isLoading = false;
    //         }
    //         else {
    //             Swal.fire({
    //                 title: 'แจ้งเตือน!',
    //                 text: 'อีเมล หรือ รหัสผ่านไม่ถูกต้อง กรุณาใส่ใหม่อีกครั้งหรือกดลืมรหัสผ่าน !!!',
    //                 icon: 'warning',
    //                 confirmButtonText: 'ตกลง'
    //             }).then(() => {
    //                 this._isLoading = false;
    //             });
    //             this._isLoading = false;
    //         }
    //     });
    // }
    FormatData(): FormData {
        const formData = new FormData();
        this.formRegister.REGISTER_USER_NAME = this.formRegister.PERSONAL_EMAIL;

        for (const key in this.formRegister) {
            if (this.formRegister[key] === "" || this.formRegister[key] === '') {
                formData.append(key, "");
            } else if (this.formRegister[key] !== null && this.formRegister[key] !== undefined) {
                formData.append(key, this.formRegister[key]);
            }
        }
        if (this.imageFile) {
            formData.append("FACE_PICTURE", this.imageFile);
        }
        return formData;
    }

    validateEmail(email) {
        // eslint-disable-next-line max-len
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    checkNumber(event) {
        const seperator = '^([0-9])';
        const maskSeperator = new RegExp(seperator, 'g');
        const result = maskSeperator.test(event.key);
        return result;
    }
    checkThaiLang(event) {
        const seperator = '^[ก-๏\\s]+$';
        const maskSeperator = new RegExp(seperator, 'g');
        const result = maskSeperator.test(event.key);
        return result;
    }
    pasteCheckThaiLang(event) {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData.getData('text');
        const seperator = '^[ก-๏\\s]+$';
        const maskSeperator = new RegExp(seperator, 'g');
        const result = maskSeperator.test(pastedText);
        return result;
    }
    onlyNumberKeyPress(e) {
        if (!e.value) {
            return false;
        }
        if (e.value.length === 13) {
            const value = e.value;
            let total = 0;
            const iPID = value.replace(/-/g, "");
            let chk;
            const validchk = +iPID.substr(12, 1);
            let j = 0;
            let pidcut;
            for (let n = 0; n < 12; n++) {
                pidcut = +iPID.substr(j, 1);
                total = total + pidcut * (13 - n);
                j++;
            }

            chk = 11 - (total % 11);

            if (chk === 10) {
                chk = 0;
            } else if (chk === 11) {
                chk = 1;
            }
            if (chk !== validchk) {
                this.validatePpidMessage =
                    "ระบุหมายเลขประจำตัวประชาชนไม่ถูกต้อง";
                return false;
            } else {
                this.validatePpidMessage = undefined;
                return true;
            }
        }
        return false;
    }
    setDefaultPicThree() {
        this.ppidImagePath3 = "assets/image/id-card.jpg";
    }
}
