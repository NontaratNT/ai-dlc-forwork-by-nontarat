import { Dialog } from 'share-ui';

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SocialAuthService } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";

import { DxFormComponent, DxMultiViewComponent } from 'devextreme-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ITitleInfo, TitleService } from 'src/app/services/title.service';
import { IRegister, RegisterService } from 'src/app/services/register.service';
import { RegisterPeopleOtpComponent } from '../register-people-otp/register-people-otp.component';
import { ConvertDateService } from 'src/app/services/convert-date.service';
import { DatePipe } from '@angular/common';
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
    loadDateBox = false;
    minBirthDate: Date;
    maxBirthDate: Date;
    loadDateBoxOther = false;
    minBirthDateOther: Date;
    maxBirthDateOther: Date;
    birthDateValue: string;
    public indexViewTab = 0;
    public indexTab = 'page1';
    choiceUsername = [
        { id: 1, txt: "เบอร์โทรศัพท์" },
        { id: 2, txt: "อีเมล" }
    ];
    choiceSelect: number;
    regissenior = false;
    regiscybereye = false;
    constructor(
        private ServiceRegister: RegisterService,
        private _date: ConvertDateService,
        private router: Router,
        private _datepipe: DatePipe,
        private serviceTitle: TitleService,
        private routerAc: ActivatedRoute) {
        this.formRegister = {} as any;
    }

    ngOnInit(): void {





        this.loadDateBox = false;
        this.formRegisterPeopleOtp.mainForm = this;
        this.serviceTitle.GetTitleInfomer().subscribe((_) => (this.title = _));
        this.minBirthDate = this._date.SetDateDefault(100, true, true, true);
        this.maxBirthDate = this._date.SetDateDefault(0);
        this.formRegister.TYPE_CYBER = false;
        this.formRegister.CYBER_STATUS = "N";
        this.formRegister.TYPE_SENIOR = false;
        this.formRegister.SENIOR_STATUS = "N";
        this.formRegister.TYPE_CYBER_EYE = false;
        this.formRegister.CYBER_EYE_STATUS = "N";
        this.routerAc.queryParams.subscribe((params) => {
            this.regissenior = params.icli === "landing";
            this.formRegister.TYPE_CYBER_EYE = params.icli === "cyber-eye";
            this.formRegister.CYBER_EYE_STATUS = params.icli === "cyber-eye" ? "Y" : "N";
            this.formRegister.TYPE_CYBER_CAT = params.icli === "cyber-cat";
            this.formRegister.CYBER_CAT_STATUS = params.icli === "cyber-cat" ? "Y" : "N";
        });
        // this.formRegister.PERSONAL_BIRTH_DATE = this._date.SetDateDefault(0);
        this.loadDateBox = true;

        // this.serviceTitle.GetTitle().subscribe((_) => {
        //     (this.title = _);
        //     this.formRegister.PERSONAL_BIRTH_DATE = this._date.SetDateDefault(0);
        //     this.minBirthDateOther = this._date.SetDateDefault(10, true);
        //     this.maxBirthDateOther = this._date.SetDateDefault(0);
        //     this.loadDateBoxOther = true;

        // });

        // this.formRegister.PERSONAL_EMAIL = "donge2800@hotmail.com";
        // this.formRegister.PERSONAL_TEL_NO = "0908399395";
        // this.formRegisterPeopleOtp.LoadDataMainConponent();
        // this.indexTab = 'page2';
        // this.indexViewTab = 1;
        // document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
    onInitialized(e: any) {
        this.choiceSelect = 0;
    }
    onValueChanged(e: any) {
        if (e.value) {
            if (e.value === 1) {
                if (!this.formRegister.PERSONAL_TEL_NO) {
                    Swal.fire({
                        title: 'แจ้งเตือน!',
                        text: 'กรุณากรอกเบอร์โทรศัพท์',
                        icon: 'warning',
                        confirmButtonText: 'ตกลง'
                    });
                    this.formRegister.REGISTER_USER_NAME = null;
                    this.choiceSelect = 0;
                    return;
                }
                this.formRegister.REGISTER_USER_NAME = this.formRegister.PERSONAL_TEL_NO;
            } else if (e.value === 2) {
                if (!this.formRegister.PERSONAL_EMAIL) {
                    Swal.fire({
                        title: 'แจ้งเตือน!',
                        text: 'กรุณากรอกเบอร์อีเมล',
                        icon: 'warning',
                        confirmButtonText: 'ตกลง'
                    });
                    this.choiceSelect = 0;
                    this.formRegister.REGISTER_USER_NAME = null;
                    return;
                }
                this.formRegister.REGISTER_USER_NAME = this.formRegister.PERSONAL_EMAIL;
            }
        }
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
    ValidateDate(testdate) {
        const dateRegex = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
        return dateRegex.test(testdate);
    }
    ConvertBirthDate(date) {
        // const date = this.formRegister.PERSONAL_BIRTH_DATE;
        if (date) {
            // console.log('date',date);
            const check = date.split("-");
            const count = check.length;
            if (count === 3) {
                let setStrDate = "0001-01-01";
                let checkApi = "";
                const year = this.AddStringDate(`${parseInt(check[0], 10) + 543}`);
                if (year <= 543) {
                    return null;
                }

                if (check[0] && check[1] !== "Nan" && check[2] !== "Nan") { // กรณี ปีเดือนวัน ครบ
                    const mm = this.AddStringDate(`${parseInt(check[1], 10)}`);
                    const dd = this.AddStringDate(check[2]);
                    setStrDate = `${check[0]}-${check[1]}-${check[2]}`;
                    checkApi = `${year}${mm}${dd}`;
                } else if (check[0] && check[1] === "Nan" && check[2] !== "Nan") { // กรณี ไม่มีเดือนเกิด
                    setStrDate = `${check[0]}-01-${check[2]}`;
                    checkApi = `${year}00${check[2]}`;
                } else if (check[0] && check[1] !== "Nan" && check[2] === "Nan") { // กรณี ไม่มีวันเกิด
                    const mm = this.AddStringDate(`${parseInt(check[1], 10)}`);
                    setStrDate = `${check[0]}-${mm}-01`;
                    checkApi = `${year}${mm}00`;
                } else if (check[0] && check[1] === "Nan" && check[2] === "Nan") { // กรณี ไม่มีวันและเดือนเกิด
                    setStrDate = `${check[0]}-01-01`;
                    checkApi = `${year}0000`;
                }

                const checkCompleteDate = this._date.ConvertToDateFormat(this._datepipe.transform(setStrDate, 'yyyy-MM-dd'));
                const completeDate = this.ValidateDate(checkCompleteDate) ? checkCompleteDate : null;

                return { checkApi, completeDate };
            }
        }

        return null;

    }
    AddStringDate(text) {
        return text.length > 1 ? text : `0${text}`;
    }
    calculateAgeFromCompleteDate(date): number {
        const completeDateStr = date; // เช่น "2000-06-19"
        const birthDate = new Date(completeDateStr);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();

        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }
        return age;
    }
    SaveRegister() {
        const dateConverts = this.ConvertBirthDate(this.birthDateValue);
        this._isLoading = true;
        if (dateConverts) {
            this.formRegister.PERSONAL_BIRTH_DATE = dateConverts.completeDate;
            this.formRegister.PERSONAL_BIRTH_DATE_CHECK_API = dateConverts.checkApi;
        } else {
            this.formRegister.PERSONAL_BIRTH_DATE = undefined;
            this.formRegister.PERSONAL_BIRTH_DATE_CHECK_API = undefined;
        }
        if(this.calculateAgeFromCompleteDate(dateConverts?.completeDate) > 18 && this.formRegister.TYPE_CYBER_CAT){
            Swal.fire({
                title: 'อายุของท่านไม่ตรงเกณฑ์ที่กำหนด',
                text: 'ท่านต้องมีอายุไม่เกิน 18 ปี เพื่อเข้าใช้งาน Cyber Cat',
                icon: 'error',
                confirmButtonText: 'ตกลง'
            });
            this._isLoading = false;
            return;
        }
        if (
            !this.formRegister.TITLE_ID
            && !this.formRegister.PERSONAL_FNAME_THA
            && !this.formRegister.PERSONAL_LNAME_THA
            && !this.formRegister.PERSONAL_TEL_NO
            && !this.formRegister.PERSONAL_BIRTH_DATE
            && !this.formRegister.PERSONAL_BIRTH_DATE_CHECK_API
            && !this.formRegister.PERSONAL_CITIZEN_NUMBER
            && !this.formRegister.PERSONAL_LASER_NUMBER
            && !this.formRegister.PERSONAL_EMAIL
            && !this.password && !this.formRegister.NEW_PASSWORD) {
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
        } else if (!this.formRegister.TITLE_ID) {
            Swal.fire({
                title: 'แจ้งเตือน!',
                text: 'กรุณากรอกคำนำหน้าชื่อ',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                this._isLoading = false;
            });
            this._isLoading = false;
            return;
        } else if (!this.formRegister.PERSONAL_FNAME_THA) {
            Swal.fire({
                title: 'แจ้งเตือน!',
                text: 'กรุณากรอกชื่อ',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                this._isLoading = false;
            });
            this._isLoading = false;
            return;
        } else if (!this.formRegister.PERSONAL_LNAME_THA) {
            Swal.fire({
                title: 'แจ้งเตือน!',
                text: 'กรุณากรอกนามสกุล',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                this._isLoading = false;
            });
            this._isLoading = false;
            return;
        } else if (!this.formRegister.PERSONAL_TEL_NO) {
            Swal.fire({
                title: 'แจ้งเตือน!',
                text: 'กรุณากรอกเบอร์โทรศัพท์',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                this._isLoading = false;
            });
            this._isLoading = false;
            return;
        } else if (!this.formRegister.PERSONAL_BIRTH_DATE) {
            Swal.fire({
                title: 'แจ้งเตือน!',
                text: 'กรุณากรอกวัน/เดือน/ปีเกิด',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                this._isLoading = false;
            });
            this._isLoading = false;
            return;
        } else if (!this.formRegister.PERSONAL_CITIZEN_NUMBER) {
            Swal.fire({
                title: 'แจ้งเตือน!',
                text: 'กรุณากรอกเลขประจำตัวประชาชน',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                this._isLoading = false;
            });
            this._isLoading = false;
            return;
        } else if (!this.formRegister.PERSONAL_LASER_NUMBER) {
            Swal.fire({
                title: 'แจ้งเตือน!',
                text: 'กรุณากรอกเลขหลังบัตรประจำตัวประชาชน',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                this._isLoading = false;
            });
            this._isLoading = false;
            return;
        }
        else if (!this.password) {
            Swal.fire({
                title: 'แจ้งเตือน!',
                text: 'กรุณากรอกรหัสผ่าน',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                this._isLoading = false;
            });
            this._isLoading = false;
            return;
        } else if (!this.formRegister.NEW_PASSWORD) {
            Swal.fire({
                title: 'แจ้งเตือน!',
                text: 'กรุณากรอกยืนยันรหัสผ่าน',
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

        // console.log('this.formRegister',this.formRegister);
        this.ServiceRegister.registerBeforegdcc(this.FormatData())
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
                    this._isLoading = false;
                    return;
                } else {
                    this._isLoading = false;
                    this.formRegisterPeopleOtp.LoadDataMainConponent();
                    this.indexTab = 'page2';
                    this.indexViewTab = 1;
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                }
            }, error => {
                if (error.status !== 500 || error.status === 524 || error.status === 524) {
                    Swal.fire({
                        title: 'ผิดพลาด!',
                        html: "ไม่สามารถลงทะเบียนได้"+"<br>"+"เนื่องจากระบบของกรมการปกครองขัดข้อง"+"<br>"+"หากท่านสะดวกสามารถติดต่อแจ้งความ"+"<br>"+"ได้ที่สถานีตำรวจที่ท่านสะดวก",
                        icon: 'warning',
                        confirmButtonText: 'ตกลง'
                    }).then(() => { });
                    this._isLoading = false;
                    return;
                }
            });
        this._isLoading = false;
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
    testSaveRegister() {
        this.formRegisterPeopleOtp.LoadDataMainConponent();
        this.indexTab = 'page2';
        this.indexViewTab = 1;
    }
    FormatData(): FormData {
        const formData = new FormData();
        // this.formRegister.REGISTER_USER_NAME = this.formRegister.PERSONAL_EMAIL;

        for (const key in this.formRegister) {
            if (this.formRegister[key] === "" || this.formRegister[key] === '') {
                formData.append(key, "");
            } else if (this.formRegister[key] !== null && this.formRegister[key] !== undefined) {
                formData.append(key, this.formRegister[key]);
            }
        }
        // if (this.imageFile) {
        //     formData.append("FACE_PICTURE", this.imageFile);
        // }
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

    checkTypeCyber(event) {
        this.formRegister.CYBER_STATUS = event.value ? "Y" : "N";
    }

    checkTypeSenior(event) {
        this.formRegister.SENIOR_STATUS = event.value ? "Y" : "N";
    }

    checkTypeCyberEye(event) {
        this.formRegister.CYBER_EYE_STATUS = event.value ? "Y" : "N";
    }

}
