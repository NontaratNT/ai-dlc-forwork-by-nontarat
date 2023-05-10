import { RegisterService } from "./../../../services/register.service";
import { User } from "./../../../services/user";
import { PersonalService, IVerifyID } from "src/app/services/personal.service";
import { IPersonal, IOTP } from "./../../../services/personal.service";
import { ITitleInfo, TitleService } from "./../../../services/title.service";
import { PostcodeService } from "../../../services/postcode.service";
import { SubdistrictService } from "../../../services/subdistrict.service";
import { DistrictService } from "../../../services/district.service";
import { ProvinceService } from "../../../services/province.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
    DxFormComponent,
    DxMultiViewComponent,
    DxTextBoxModule,
} from "devextreme-angular";
import { IDistrictInfo } from "src/app/services/district.service";
import { IPostcodeInfo } from "src/app/services/postcode.service";
import { IProvinceinfo } from "src/app/services/province.service";
import { ISubDistrictInfo } from "src/app/services/subdistrict.service";
import { ActivatedRoute, Router } from "@angular/router";
import { custom } from "devextreme/ui/dialog";
import { finalize } from "rxjs/operators";
import Swal from "sweetalert2";

@Component({
    selector: "app-journal",
    templateUrl: "./register-journal.component.html",
    styleUrls: ["./register-journal.component.scss"],
})
export class RegisterJournalComponent implements OnInit {
    @ViewChild(DxMultiViewComponent, { static: true })
    mutiView: DxMultiViewComponent;
    @ViewChild(DxFormComponent, { static: true }) form: DxFormComponent;
    @ViewChild("form2", { static: false }) form2: DxFormComponent;
    imageFile: File;
    imageFile1: File;
    ppidImagePath: string | ArrayBuffer;
    ppidImagePath1: string | ArrayBuffer;
    ppidImagePath3: string | ArrayBuffer;
    checkButton = false;
    province: IProvinceinfo[];
    district: IDistrictInfo[];
    subdistrict: ISubDistrictInfo[];
    postcode: IPostcodeInfo[];
    province1: IProvinceinfo[];
    district1: IDistrictInfo[];
    subdistrict1: ISubDistrictInfo[];
    postcode1: IPostcodeInfo[];
    personal: IPersonal;
    title: ITitleInfo[];
    disablepostcode1 = true;
    disableProvice = true;
    disableDistrict = true;
    disableSubDistrict = true;
    disablepostcode = true;
    disableProvice1 = true;
    disableDistrict1 = true;
    disableSubDistrict1 = true;
    allDisable = false;
    _isLoading = false;
    checkbox = false;
    formData: IPersonal;
    formOtp: IOTP;
    pic: string;
    pic2: string;
    validatePpidMessage: string;
    reject: string;
    FormUploadIDCard: IVerifyID;
    _getotp = false;
    _fragment: string;
    data = [
        {
            id: 1,
            class: "marker",
            icon: "fa fa-clipboard",
            classend: "one",
            idclass: "m1",
            color: "#0aab1c",
            text: "ข้อตกลงการใช้บริการ",
        },
        {
            id: 2,
            class: "marker",
            icon: "fa fa-address-card",
            classend: "two",
            idclass: "m2",
            color: "text-light",
            text: "ตรวจสอบเลขบัตรประชาชน",
        },
        {
            id: 4,
            class: "marker",
            icon: "fa fa-user",
            classend: "three",
            idclass: "m3",
            color: "text-light",
            text: "ข้อมูลส่วนตัว",
        },
        {
            id: 5,
            class: "marker",
            icon: "fa fa-edit",
            classend: "four",
            idclass: "m4",
            color: "text-light",
            text: "ยืนยันตัวตน",
        },
        {
            id: 6,
            class: "marker",
            icon: "fa fa-check",
            classend: "fire",
            idclass: "m5",
            color: "text-light",
            text: "เสร็จสิ้น",
        },
    ];
    gender: any = [
        { id: 1, text: "ชาย" },
        { id: 0, text: "หญิง" },
    ];
    constructor(
        private serviceProvince: ProvinceService,
        private serviceDistrict: DistrictService,
        private serviceSubDistrict: SubdistrictService,
        private serviceTitle: TitleService,
        private servicePersonal: PersonalService,
        private serviceRegister: RegisterService,
        private router: Router,
        private activeRoute: ActivatedRoute
    ) {
        this.formData = {} as any;
        this.formOtp = {} as any;
    }

    ngOnInit(): void {
        // this.activeRoute.fragment.subscribe(_ => {
        //     this._fragment = _;
        //     // console.log('_fragment',this._fragment);
        // });
        // this.serviceProvince
        //     .GetProvince()
        //     .subscribe((_) => (this.province = _));
        // this.serviceTitle.GetTitle().subscribe((_) => (this.title = _));
        // this.serviceRegister
        //     .getUserRegister(User.Current.UserName, 1.3)
        //     .subscribe((_) => {
        //         if (_[0].REGISTER_STATUS === "AO") {
        //             this.mutiView.selectedIndex = 5;
        //         } else if (_[0].REGISTER_STATUS === "AP") {
        //             if (this._fragment) {
        //                 this.router.navigate(["/main/cyber/journal"], { fragment: "tasklist" });
        //             }
        //             else {
        //                 this.router.navigate(["/main/cyber/journal"]);
        //             }
        //         } else if (_[0].REGISTER_STATUS === "RJ") {
        //             this.mutiView.selectedIndex = 6;
        //             if (_[0].REGISTER_REJECT_FLAG === "I") {
        //                 this.reject = "กรอกข้อมูลไม่ถูกต้อง";
        //             } else if (_[0].REGISTER_REJECT_FLAG === "D") {
        //                 this.reject = "แนบหลักฐานประกอบไม่ถูกต้องตามที่กำหนด";
        //             } else {
        //                 this.reject = _[0].REGISTER_REJECT_REMARK;
        //             }
        //         } else {
        //             this.mutiView.selectedIndex = 0;
        //         }
        //     });
        // this.servicePersonal
        //     .GetPersonalById(User.Current.PersonalId)
        //     .subscribe((_) => {
        //         this.formData = _;
        //     });
    }

    FormatData(): FormData {
        const formData = new FormData();
        for (const key in this.formData) {
            if (this.formData[key] === "" || this.formData[key] === "") {
                formData.append(key, "");
            } else if (
                this.formData[key] !== null &&
                this.formData[key] !== undefined
            ) {
                formData.append(key, this.formData[key]);
            }
        }

        if (this.imageFile) {
            formData.append("FRONT_PPD_PICTURE", this.imageFile);
        }

        if (this.imageFile1) {
            formData.append("BACK_PPD_PICTURE", this.imageFile1);
        }
        return formData;
    }

    oncheckButton() {
        this.checkButton = !this.checkButton;
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

    onSerectProvice(e) {
        this.district = [];
        this.subdistrict = [];
        this.postcode = [];
        if (e.value) {
            this.formData.PROVINCE_ID = e.value;
            this.disableDistrict = false;
            this.serviceProvince
                .GetDistrictofProvince(e.value)
                .subscribe((_) => (this.district = _));
        }
    }

    onSerectDistrict(e) {
        this.subdistrict = [];
        this.postcode = [];
        if (e.value) {
            this.formData.DISTICT_ID = e.value;
            this.disableSubDistrict = false;
            this.serviceDistrict
                .GetSubDistrictOfDistrict(e.value)
                .subscribe((_) => (this.subdistrict = _));
        }
    }

    onSerectSubDistrict(e) {
        this.postcode = [];

        if (e.value) {
            this.formData.SUB_DISTICT_ID = e.value;
            this.disablepostcode = false;
            this.serviceSubDistrict
                .GetPostCode(e.value)
                .subscribe((_) => (this.postcode = _));
        }
    }

    onSerectPostCode(e) {
        this.formData.POST_CODE = e.value;
    }

    onSerectProviceHome(e) {
        this.district1 = [];
        this.subdistrict1 = [];
        this.postcode1 = [];

        if (e.value) {
            this.formData.HOME_REGISTER_PROVINCE_ID = e.value;
            this.disableDistrict1 = false;
            this.serviceProvince
                .GetDistrictofProvince(e.value)
                .subscribe((_) => (this.district1 = _));
        }
    }

    onSerectDistrictHome(e) {
        this.subdistrict1 = [];
        this.postcode1 = [];
        if (e.value) {
            this.formData.HOME_REGISTER_DISTICT_ID = e.value;
            this.disableSubDistrict1 = false;
            this.serviceDistrict
                .GetSubDistrictOfDistrict(e.value)
                .subscribe((_) => (this.subdistrict1 = _));
        }
    }

    onSerectSubDistrictHome(e) {
        this.postcode1 = [];
        if (e.value) {
            this.formData.HOME_REGISTER_SUB_DISTICT_ID = e.value;
            this.disablepostcode1 = false;
            this.serviceSubDistrict
                .GetPostCode(e.value)
                .subscribe((_) => (this.postcode1 = _));
        }
    }

    OnSerectPostCodeHome(e) {
        this.formData.HOME_REGISTER_POST_CODE = e.value;
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

    openFileDialogPicture(e, uploadTag) {
        e.event.stopPropagation();
        uploadTag.click();
    }

    onImageAddPicture(uploadTag, imageTag) {
        const files: FileList = uploadTag.files;
        let fileReader: FileReader;
        if (files.length > 0) {
            this.imageFile1 = files.item(0);
            fileReader = new FileReader();
            fileReader.readAsDataURL(this.imageFile1);
            fileReader.onloadend = () =>
                (this.ppidImagePath1 = fileReader.result);
        }
    }

    sendOtp() {
        this._getotp = true;
        this._isLoading = true;
        this.servicePersonal
            .RegisterJournalSendOtp()
            .pipe(
                finalize(() => {
                    this._isLoading = false;
                    this._getotp = false;
                })
            )
            .subscribe((_) => {
                // custom({
                //     messageHtml: "เช็ค E-mail ของท่านเพื่อรับรหัส OTP อีกครั้ง",
                //     title: "ส่งสำเร็จ",
                //     buttons: [{ text: "ปิด" }],
                // }).show();
                Swal.fire({
                    title: 'ส่งสำเร็จ!',
                    text: 'เช็ค E-mail ของท่านเพื่อรับรหัส OTP อีกครั้ง',
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                }).then(() => { });
            });
    }

    activateOtp() {
        // console.log(this.formOtp.Otp);
        if (!this.formOtp.Otp) {
            // custom({
            //     messageHtml: "กรุณากรอกรหัส OTP",
            //     title: "ผิดพลาด",
            //     buttons: [{ text: "ปิด" }],
            // }).show();
            Swal.fire({
                title: 'ผิดพลาด!',
                text: 'กรุณากรอกรหัส OTP',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => { });
            return;
        } else {
            this._isLoading = true;
            this.servicePersonal
                .RegisterJournalActivateOtp({
                    Otp: this.formOtp.Otp,
                })
                .pipe(finalize(() => (this._isLoading = false)))
                .subscribe((_) => {
                    this.data[3].color = "#999999";
                    this.data[4].color = "#0aab1c";
                    this.mutiView.selectedIndex = 4;
                });
        }
    }

    oncheckClone(e) {
        if (e.value) {
            this.formData.HOME_REGISTER_ADDRESS =
                this.formData.PERSONAL_ADDRESS;
            this.formData.HOME_REGISTER_MOO = this.formData.PERSONAL_MOO;
            this.formData.HOME_REGISTER_SOI = this.formData.PERSONAL_SOI;
            this.formData.HOME_REGISTER_STREET = this.formData.PERSONAL_STREET;
            this.formData.HOME_REGISTER_PROVINCE_ID = this.formData.PROVINCE_ID;
            this.formData.HOME_REGISTER_DISTICT_ID = this.formData.DISTICT_ID;
            this.formData.HOME_REGISTER_SUB_DISTICT_ID =
                this.formData.SUB_DISTICT_ID;
            this.formData.HOME_REGISTER_POST_CODE = this.formData.POST_CODE;
            // this.allDisable = true;
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        } else {
            this.allDisable = false;
            this.formData.HOME_REGISTER_ADDRESS = undefined;
            this.formData.HOME_REGISTER_MOO = undefined;
            this.formData.HOME_REGISTER_SOI = undefined;
            this.formData.HOME_REGISTER_STREET = undefined;
            this.formData.HOME_REGISTER_PROVINCE_ID = undefined;
            this.formData.HOME_REGISTER_DISTICT_ID = undefined;
            this.formData.HOME_REGISTER_SUB_DISTICT_ID = undefined;
            this.formData.HOME_REGISTER_POST_CODE = undefined;
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
    }

    onCheck() {
        this.mutiView.selectedIndex = 1;
        this.data[0].color = "#999999";
        this.data[1].color = "#0aab1c";
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    cancelMutiTwo() {
        this.mutiView.selectedIndex = 0;
        this.data[0].color = "#0aab1c";
        this.data[1].color = "#999999";
    }

    nextMutiTwo() {
        if (!this.imageFile) {
            // custom({
            //     messageHtml: "กรุณาอัพโหลดรูปหน้าบัตรประชาชน",
            //     title: "ผิดพลาด",
            //     buttons: [{ text: "ปิด" }],
            // }).show();
            Swal.fire({
                title: 'ผิดพลาด!',
                text: 'กรุณาอัพโหลดรูปหน้าบัตรประชาชน',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => { });
            return;
        }
        // else if (!this.imageFile1) {
        //     // custom({
        //     //     messageHtml: "กรุณาอัพโหลดรูปหลังบัตรประชาชน",
        //     //     title: "ผิดพลาด",
        //     //     buttons: [{ text: "ปิด" }],
        //     // }).show();
        //     Swal.fire({
        //         title: 'ผิดพลาด!',
        //         text: 'กรุณาอัพโหลดรูปหลังบัตรประชาชน',
        //         icon: 'warning',
        //         confirmButtonText: 'ตกลง'
        //     }).then(() => { });
        //     return;
        // }
        else if (!this.form.instance.validate().isValid) {
            // custom({
            //     messageHtml: "กรุณากรอกข้อมูลให้ครบถ้วน",
            //     title: "ผิดพลาด",
            //     buttons: [{ text: "ปิด" }],
            // }).show();
            Swal.fire({
                title: 'ผิดพลาด!',
                text: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => { });
            return;
        } else if (!this.formData.PERSONAL_CITIZEN_NUMBER) {
            // custom({
            //     messageHtml: "กรุณากรอกรหัสบัตรประชาชน",
            //     title: "ผิดพลาด",
            //     buttons: [{ text: "ปิด" }],
            // }).show();
            Swal.fire({
                title: 'ผิดพลาด!',
                text: 'กรุณากรอกรหัสบัตรประชาชน',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => { });
            return;
        }
        // else if (!this.formData.PERSONAL_LASER_NUMBER) {
        //     // custom({
        //     //     messageHtml: "กรุณากรอกเลขหลังบัตรประชาชน",
        //     //     title: "ผิดพลาด",
        //     //     buttons: [{ text: "ปิด" }],
        //     // }).show();
        //     Swal.fire({
        //         title: 'ผิดพลาด!',
        //         text: 'กรุณากรอกเลขหลังบัตรประชาชน',
        //         icon: 'warning',
        //         confirmButtonText: 'ตกลง'
        //     }).then(() => { });
        //     return;
        // }
        else if (this.validatePpidMessage) {
            // custom({
            //     messageHtml: "เลขบัตรประชาชนไม่ถูกต้อง",
            //     title: "ผิดพลาด",
            //     buttons: [{ text: "ปิด" }],
            // }).show();
            Swal.fire({
                title: 'ผิดพลาด!',
                text: 'เลขบัตรประชาชนไม่ถูกต้อง',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => { });
            return;
        } else {
            // alert("test");
            // this._isLoading = true;
            // this.servicePersonal
            //     .RegisterVerifyID(this.UploadIDCard())
            //     .pipe(finalize(() => (this._isLoading = false)))
            //     .subscribe((_) => {
            //         if (_.MATCHING && _.DATA) {
                        this.mutiView.selectedIndex = 2;
                        this.data[1].color = "#999999";
                        this.data[2].color = "#0aab1c";
            //         } else {
            //             // custom({
            //             //     messageHtml: "รูปหน้าบัตรประชาชนกับรูปคู่บัตรประชาชน ไม่ตรงกัน!",
            //             //     title: "ผิดพลาด",
            //             //     buttons: [{ text: "ปิด" }],
            //             // }).show();
            //             Swal.fire({
            //                 title: 'ผิดพลาด!',
            //                 text: 'รูปหน้าบัตรประชาชนกับรูปคู่บัตรประชาชน ไม่ตรงกัน',
            //                 icon: 'warning',
            //                 confirmButtonText: 'ตกลง'
            //             }).then(() => { });
            //             return;
            //         }
            //     });
        }
    }

    UploadIDCard(): FormData {
        const formData = new FormData();
        // for (const key in this.FormUploadIDCard) {
        //     if (this.formData[key] === "" || this.formData[key] === "") {
        //         formData.append(key, "");
        //     } else if (
        //         this.formData[key] !== null &&
        //         this.formData[key] !== undefined
        //     ) {
        //         formData.append(key, this.formData[key]);
        //     }
        // }

        if (this.imageFile) {
            formData.append("PERSONAL_IMAGE", this.imageFile);
        }

        if (this.imageFile1) {
            formData.append("PERSONAL_ID_CARD_IMAGE", this.imageFile1);
        }
        return formData;
    }
    cancelMutiThree() {
        this.data[1].color = "#0aab1c";
        this.data[2].color = "#999999";
        this.mutiView.selectedIndex = 1;
    }
    nextMutiThree() {
        // console.log(this.formData.PERSONAL_GENDER);
        if (!this.form2.instance.validate().isValid) {
            // custom({
            //     messageHtml: "กรุณากรอกที่อยู่",
            //     title: "ผิดพลาด",
            //     buttons: [{ text: "ปิด" }],
            // }).show();
            Swal.fire({
                title: 'ผิดพลาด!',
                text: 'กรุณากรอกที่อยู่',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => { });
            return;
        } else {
            this._isLoading = true;
            this.servicePersonal
                .RegisterJournal(this.FormatData())
                .pipe(finalize(() => (this._isLoading = false)))
                .subscribe((_) => {
                    this.mutiView.selectedIndex = 3;
                    this.data[2].color = "#999999";
                    this.data[3].color = "#0aab1c";
                });
        }
    }
    cancelMutiFour() {
        this.mutiView.selectedIndex = 2;
        this.data[2].color = "#0aab1c";
        this.data[3].color = "#999999";
    }

    backHome() {
        this.router.navigate(["home"]);
    }

    // #0aab1c
    setDefaultPic() {
        this.ppidImagePath = "assets/image/idcard01.jpg";
    }

    setDefaultPicTwo() {
        // this.ppidImagePath1 = "assets/image/idcard02.jpg";
    }
    setDefaultPicThree() {
        this.ppidImagePath3 = "assets/image/id-card.jpg";
    }

    backToEdit() {
        this.mutiView.selectedIndex = 0;
    }
    checkNumber(event) {
        const seperator = "^([0-9])";
        const maskSeperator = new RegExp(seperator, "g");
        const result = maskSeperator.test(event.key);
        return result;
    }
    checkThaiLang(event) {
        const seperator = "^[ก-๏\\s]+$";
        const maskSeperator = new RegExp(seperator, "g");
        const result = maskSeperator.test(event.key);
        return result;
    }

    pasteCheckThaiLang(event) {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData.getData("text");
        const seperator = "^[ก-๏\\s]+$";
        const maskSeperator = new RegExp(seperator, "g");
        const result = maskSeperator.test(pastedText);
        return result;
    }
}
