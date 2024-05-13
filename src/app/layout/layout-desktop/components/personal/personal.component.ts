
import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent, DxSelectBoxComponent, DxTextBoxModule } from 'devextreme-angular';
import { ITitleInfo, TitleService } from 'src/app/services/title.service';
import { IProvinceinfo, ProvinceService } from 'src/app/services/province.service';
import { DistrictService, IDistrictInfo } from 'src/app/services/district.service';
import { ISubDistrictInfo, SubdistrictService } from 'src/app/services/subdistrict.service';
import { IPostcodeInfo } from 'src/app/services/postcode.service';
import { custom } from 'devextreme/ui/dialog';
import { finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ProcessInstanceInfo } from 'eform-share';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CmsOccupationsService, IOcupationsInfo } from 'src/app/services/cms-occupations.service';
import { User } from 'src/app/services/user';
import { PersonalService,IPersonal } from 'src/app/services/personal.service';
import { ConvertDateService } from 'src/app/services/convert-date.service';

@Component({
    selector: 'app-personal',
    templateUrl: './personal.component.html',
    styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
    @ViewChild("selectOccupation", { static: false })
    selectOccupation: DxSelectBoxComponent;

    @ViewChild(DxFormComponent, { static: true }) form: DxFormComponent;
    id: number;
    radioActive: any = [{ id: "A", text: "ใช้งาน" }, { id: "I", text: "ไม่ใช้งาน" }];
    gender: any = [{ id: 1, text: "ชาย" }, { id: 2, text: "หญิง" }];
    popupVisible = false;
    province: IProvinceinfo[];
    district: IDistrictInfo[];
    subdistrict: ISubDistrictInfo[];
    postcode: IPostcodeInfo[];
    formData: IPersonal;
    title: ITitleInfo[];
    province1: IProvinceinfo[];
    district1: IDistrictInfo[];
    subdistrict1: ISubDistrictInfo[];
    postcode1: IPostcodeInfo[];
    province2: IProvinceinfo[];
    district2: IDistrictInfo[];
    subdistrict2: ISubDistrictInfo[];
    postcode2: IPostcodeInfo[];
    occupations: IOcupationsInfo[];
    userImagePath: string | ArrayBuffer;
    disableProvice = true;
    disableDistrict = true;
    disableSubDistrict = true;
    disablepostcode = true;
    disableProvice1 = true;
    disableDistrict1 = true;
    disableSubDistrict1 = true;
    disablepostcode1 = true;
    disableProvice2 = true;
    disableDistrict2 = true;
    disableSubDistrict2 = true;
    disablepostcode2 = true;
    occupationOther = false;
    imageFile: File;
    _isLoading = false;
    displayText = '';
    phonePattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    loadDateBox = false;
    minBirthDate: Date;
    maxBirthDate: Date;
    _open: boolean;
    _oldPass: string;
    _readOnly = true;
    _checkEdit = false;
    constructor(
        private servicePersonal: PersonalService,
        private serviceProvince: ProvinceService,
        private serviceDistrict: DistrictService,
        private router: Router,
        private serviceSubDistrict: SubdistrictService,
        private serviceTitle: TitleService,
        private _date: ConvertDateService,
        private servOccupations: CmsOccupationsService) {
        this.formData = {} as any;
        this.formData.PERSONAL_GENDER = 1;

    }

    ngOnInit(): void {
        this.serviceProvince.GetProvince().subscribe(_ => this.province = _);
        this.serviceTitle.GetTitleInfomer().subscribe(_ => this.title = _);
        this.servicePersonal.GetPersonalById(User.Current.PersonalId).subscribe(_ => {
            this.formData = _;
            console.log(this.formData);
            if (this.formData.USER_PICTURE) {
                this.userImagePath = environment.config.baseConfig.resourceUrl.replace("/ccib", "/bpm") +
                 this.formData.USER_PICTURE + "?" + Date.now().toString();
            }
            this.minBirthDate = this._date.SetDateDefault(80,true,true,true);
            this.maxBirthDate = this._date.SetDateDefault(0);
            if(this.formData.PERSONAL_BIRTH_DATE){
                this.formData.PERSONAL_BIRTH_DATE = this._date.ConvertToDateFormat(this.formData.PERSONAL_BIRTH_DATE);
            }
            this.loadDateBox = true;
        });
        this.servOccupations.getOccupations().subscribe(_ => {
            this.occupations = _;
        });
    }

    FormatData(): FormData {
        const formData = new FormData();
        if (this.formData.RECORD_STATUS === 'A') {
            this.formData.PERSONAL_STATUS = 'A';
        } else {
            this.formData.PERSONAL_STATUS = 'I';
        }
        console.log(this.formData.PERSONAL_BIRTH_DATE);
        this.formData.PERSONAL_BIRTH_DATE = this._date.ConvertToDateFormat(this.formData.PERSONAL_BIRTH_DATE);

        this.formData.UPDATE_DATE = null;
        this.formData.UPDATE_USER_ID = null;
        this.formData.CREATE_DATE = null;
        this.formData.CREATE_USER_ID = null;

        for (const key in this.formData) {
            if (this.formData[key] === "" || this.formData[key] === '') {
                formData.append(key, "");
            } else if (this.formData[key] !== null && this.formData[key] !== undefined) {
                formData.append(key, this.formData[key]);
            }
        }

        if (this.imageFile) {
            formData.append("UPLOAD_PICTURE", this.imageFile);
        }

        return formData;
    }

    save() {
        this._isLoading = true;
        this.id = this.formData.PERSONAL_ID;
        const confirmPass = this.formData.CONFIRM_PASSWORD;
        if (confirmPass !== this.formData.NEW_PASSWORD) {
            Swal.fire({
                title: 'ผิดพลาด!',
                text: "รหัสผ่านไม่ตรงกัน",
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                this._isLoading = false;
            });
            return;
        } else if(this.formData.PERSONAL_BIRTH_DATE == null || this.formData.PERSONAL_BIRTH_DATE == undefined) {
            Swal.fire({
                title: 'ผิดพลาด!',
                text: "กรุณาเลือกวันเกิดของท่าน",
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                this._isLoading = false;
            });
            return;
        } else {
            this.servicePersonal.PutPersonalGDCC(this.id, this.FormatData())
                .pipe(finalize(() => this._isLoading = false))
                .subscribe(_ => {
                    Swal.fire({
                        title: 'สำเร็จ!',
                        text: 'บันทึกเรียบร้อย',
                        icon: 'success',
                        confirmButtonText: 'ตกลง'
                    }).then(() => {
                        window.location.reload();
                    });
                });
        }
    }

    OnSelectOccupation(e) {
        if (e.value) {
            if(this.formData.OCCUPATIONS_OTHER_NAME && e.value != 10){
                this.formData.OCCUPATIONS_OTHER_NAME = "";
            }
            setTimeout(() => {
                this.occupationOther = e.value == 10 ? true : false;
            }, 200);
        }
    }

    checkNumber(event) {
        const seperator = '^([0-9])';
        const maskSeperator = new RegExp(seperator, 'g');
        const result = maskSeperator.test(event.key);
        return result;
    }
    OpenFileDialog(e, uploadTag) {
        e.event.stopPropagation();
        uploadTag.click();
    }
    OnImageAdd(uploadTag, imageTag) {
        const files: FileList = uploadTag.files;
        let fileReader: FileReader;
        if (files.length > 0) {
            this.imageFile = files.item(0);
            fileReader = new FileReader();
            fileReader.readAsDataURL(this.imageFile);
            fileReader.onloadend = () => this.userImagePath = fileReader.result;
        }
    }

    OnSerectProvice(e) {
        this.district = [];
        this.subdistrict = [];
        this.postcode = [];
        if (e.value) {
            this.formData.PROVINCE_ID = e.value;
            this.disableDistrict = false;
            this.serviceProvince.GetDistrictofProvince(e.value).subscribe(_ => this.district = _);
        }
    }

    OnSerectDistrict(e) {
        this.subdistrict = [];
        this.postcode = [];
        if (e.value) {
            this.formData.DISTICT_ID = e.value;
            this.disableSubDistrict = false;
            this.serviceDistrict.GetSubDistrictOfDistrict(e.value).subscribe(_ => this.subdistrict = _);
        }
    }

    OnSerectSubDistrict(e) {
        this.postcode = [];

        if (e.value) {
            this.formData.SUB_DISTICT_ID = e.value;
            this.disablepostcode = false;
            this.serviceSubDistrict.GetPostCode(e.value).subscribe(_ => this.postcode = _);
        }
    }
    OnSerectPostCode(e) {
        this.formData.POST_CODE = e.value;
    }

    OnSerectProviceHome(e) {
        this.district1 = [];
        this.subdistrict1 = [];
        this.postcode1 = [];

        if (e.value) {
            this.formData.HOME_REGISTER_PROVINCE_ID = e.value;
            this.disableDistrict1 = false;
            this.serviceProvince.GetDistrictofProvince(e.value).subscribe(_ => this.district1 = _);
        }

    }

    OnSerectDistrictHome(e) {
        this.subdistrict1 = [];
        this.postcode1 = [];
        if (e.value) {
            this.formData.HOME_REGISTER_DISTICT_ID = e.value;
            this.disableSubDistrict1 = false;
            this.serviceDistrict.GetSubDistrictOfDistrict(e.value).subscribe(_ => this.subdistrict1 = _);
        }
    }

    OnSerectSubDistrictHome(e) {
        this.postcode1 = [];
        if (e.value) {
            this.formData.HOME_REGISTER_SUB_DISTICT_ID = e.value;
            this.disablepostcode1 = false;
            this.serviceSubDistrict.GetPostCode(e.value).subscribe(_ => this.postcode1 = _);
        }
    }

    OnSerectPostCodeHome(e) {
        this.formData.HOME_REGISTER_POST_CODE = e.value;
    }



    OnSelectProviceWork(e) {
        this.district2 = [];
        this.subdistrict2 = [];
        this.postcode2 = [];
        if (e.value) {
            this.formData.WORK_PROVINCE = e.value;
            this.disableDistrict2 = false;
            this.serviceProvince.GetDistrictofProvince(e.value).subscribe(_ => this.district2 = _);
        }

    }

    OnSelectDistrictWork(e) {
        this.subdistrict2 = [];
        this.postcode2 = [];
        if (e.value) {
            this.formData.WORK_DISTRICT_ID = e.value;
            this.disableSubDistrict2 = false;
            this.serviceDistrict.GetSubDistrictOfDistrict(e.value).subscribe(_ => this.subdistrict2 = _);
        }
    }

    OnSelectSubDistrictWork(e) {
        this.postcode2 = [];
        if (e.value) {
            this.formData.WORK_SUB_DISTRICT_ID = e.value;
            this.disablepostcode2 = false;
            this.serviceSubDistrict.GetPostCode(e.value).subscribe(_ => this.postcode2 = _);
        }
    }

    OnSelectPostCodeWork(e) {
        this.formData.WORK_POSTCODE_ID = e.value;
    }

    setDefaultPic() {
        this.userImagePath = "assets/icon/user.png";
    }


    public ClearForm() {
        this.form.instance.resetValues();
    }

    CheckNumber(event) {
        // const seperator  = '^[ก-๏\\s]+$';
        const seperator = '^([0-9])';
        const maskSeperator =  new RegExp(seperator , 'g');
        const result =maskSeperator.test(event.key);
        return result;
    }
    PasteCheckNumber(event) {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData.getData('text');
        // const seperator  = '^[ก-๏\\s]+$';
        const seperator = '^([0-9])';
        const maskSeperator =  new RegExp(seperator , 'g');
        const result =maskSeperator.test(pastedText);
        return result;
    }
    CheckNumberSlash(event) {
        const seperator  = '^[0-9\/]+$';
        const maskSeperator =  new RegExp(seperator , 'g');
        const result =maskSeperator.test(event.key);
        return result;
    }
    PasteCheckNumberSlash(event) {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData.getData('text');
        const seperator  = '^[0-9\/]+$';
        const maskSeperator =  new RegExp(seperator , 'g');
        const result =maskSeperator.test(pastedText);
        return result;
    }
    Back() {
        this.ClearForm();
        this.router.navigate(["/main/task-list"]);
        // history.back();
    }
    changePassOpen() {
        this._open = true;
        this._readOnly = false;
        this._checkEdit = true;
    }
    changePassClose() {
        this._open = false;
        this._readOnly = true;
        this._checkEdit = false;
    }
}

