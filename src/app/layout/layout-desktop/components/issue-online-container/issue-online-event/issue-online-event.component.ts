import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxFormComponent, DxSelectBoxComponent } from "devextreme-angular";
import Swal from "sweetalert2";
import {  CmsOccupationsService } from "src/app/services/cms-occupations.service";
import { PersonalService } from "src/app/services/personal.service";
import { ProvinceService } from "src/app/services/province.service";
import { DistrictService } from "src/app/services/district.service";
import { SubdistrictService } from "src/app/services/subdistrict.service";
import { TitleService } from "src/app/services/title.service";
import { BankInfoService } from "src/app/services/bank-info.service";
import * as moment from 'moment';
import { User } from "src/app/services/user";
import { IssueOnlineContainerComponent } from "../issue-online-container.component";
import { ConvertDateService } from "src/app/services/convert-date.service";
import { CmsCaseTypeSubService, ICaseTypeSub } from "src/app/services/cms-case-type-sub.service";
import { FormValidatorService } from "src/app/services/form-validator.service";
import { ViewAddressComponent } from "../../view-address/view-address.component";
import { IssueOnlineService } from "src/app/services/issue-online.service";
import { OnlineCaseService } from "src/app/services/online-case.service";
import { IOrganizeInfo } from "share-ui/lib/models/organize-info.service";
import { OrgService } from "src/app/services/org.service";
import { switchMap } from "rxjs/operators";
import { DatePipe } from "@angular/common";
import { formatDate } from "devextreme/localization";

@Component({
    selector: "app-issue-online-event",
    templateUrl: "./issue-online-event.component.html",
    styleUrls: ["./issue-online-event.component.scss"]
})
export class IssueOnlineEventComponent implements OnInit {

    @ViewChild('formEvent1', { static: false }) formEvent1: DxFormComponent;
    @ViewChild('formChannel', { static: false }) formChannel: DxFormComponent;
    @ViewChild("selectCaseType", { static: false }) selectCaseType: DxSelectBoxComponent;
    @ViewChild("selectPresentProvicelocationwalkin", { static: false }) selectPresentProvicelocationWalkin: DxSelectBoxComponent;;
    @ViewChild("selectorgwalkin", { static: false })  selectorgwalkin: DxSelectBoxComponent;
    @ViewChild("selectPresentProvicelocation", { static: false }) selectPresentProvicelocation: DxSelectBoxComponent;
    @ViewChild("selectorg", { static: false }) selectorg: DxSelectBoxComponent;
    @ViewChild("formInformer3", { static: false }) formInformer3: DxFormComponent;
    @ViewChild("formInformertype1", { static: false }) formInformertype1: DxFormComponent;
    @ViewChild("formInformertype2", { static: false }) formInformertype2: DxFormComponent;
    @ViewChild("formInformertype3", { static: false }) formInformertype3: DxFormComponent;
    public mainConponent: IssueOnlineContainerComponent;
    personalInfo: any = {};
    isLoading = false;
    occupationList = [];
    formData: any = {};
    formDataChannel: any = {};
    dataLocation: any = {};
    presentAddress: any = {};
    province = [];
    bankInfoList: any = [];
    socialInfo = [];
    listCaseType = [];
    formReadOnly = false;
    formValidate = true;
    formType = "add";
    loadDateBox = false;
    minBirthDate: Date;
    maxBirthDate: Date;
    datePhone: Date;

    checkboxaddresscard = false;

    locationRender = '';
    userType = "mySelf";
    caseOpen = false;
    caseType = "";
    issueOnline: any;
    checkblessing = false;
    recovery = false;
    edit = false;

    maxDateValue:Date = new Date();

    checkboxLocationwalkin: any = {};
    formdataOrgsendcasewalkin: any = {};
    dswalkinstatuspolice: IOrganizeInfo[];
    dsorgbyarialocation: IOrganizeInfo[];
    checkboxLocation: any = {};

    channel_tel = false;
    indexEdit = 0;
    channel_data : any = [];

    walkInType = [
        { ID: 1, TEXT: "ยังไม่เคยพบ" },
        { ID: 2, TEXT: "เคยพบแล้ว" },
    ];
    radiocheckorganize1 = [{ id: 1, text: "สถานีตำรวจ" }];
    radiocheckorganize2 = [{ id: 2, text: "กองบัญชาการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี" }];
    radiocheckorganize3 = [{ id: 3, text: "กองบัญชาการตำรวจสอบสวนกลาง (ลาดพร้าว)" }];
    orgtype2_1 = [ { org_id: 3536, org_name: "บก.สอท.1",org_location1:"ศูนย์ราชการแจ้งวัฒนะ จ.กรุงเทพฯ"}];
    orgtype2_2 = [{ org_id: 3548, org_name: "บก.สอท.2",org_location1:"เมืองทองธานี จ.นนทบุรี"}];
    orgtype2_3 = [{ org_id: 3559, org_name: "บก.สอท.3",org_location1:"1.ศูนย์ราชการแจ้งวัฒนะ จ.กรุงเทพฯ",org_location2:"2.ถ.มิตรภาพ ต.ในเมือง อ.เมือง จ.ขอนแก่น"}];
    orgtype2_4 = [{ org_id: 3567, org_name: "บก.สอท.4",org_location1:"1.ศูนย์ราชการแจ้งวัฒนะ จ.กรุงเทพฯ",org_location2:"2.ต.ป่าแดด อ.เมืองเชียงใหม่ จ.เชียงใหม่"}];
    orgtype2_5 = [{ org_id: 3578, org_name: "บก.สอท.5",org_location1:"1.ศูนย์ราชการแจ้งวัฒนะ จ.กรุงเทพฯ",org_location2:"2.ต.บางกุ้ง อ.เมืองสุราษฎร์ธานี จ.สุราษฏร์ธานี"}];
    orgtype3 = [
        { org_id: 2541, org_name: "กองบังคับการปราบปรามการกระทำความผิดเกี่ยวกับอาชญากรรมทางเศรษฐกิจ                          (บก.ปอศ.)" },
        { org_id: 2397, org_name: "กองบังคับการปราบปรามการกระทำความผิดเกี่ยวกับการคุ้มครองผู้บริโภค                              (บก.ปคบ.)" },
        { org_id: 2614, org_name: "กองบังคับการปราบปรามการกระทำผิดเกี่ยวกับอาชญากรรมทางเทคโนโลยี กองบัญชาการตำรวจสอบสวนกลาง  (บก.ปอท.)" },
        { org_id: 2605, org_name: "กองบังคับการปราบปรามการกระทำความเกี่ยวกับการค้ามนุษย์                                      (บก.ปคม.)" },
        { org_id: 2387, org_name: 'กองบังคับการปราบปราม                                                                 (บก.ป.)'}
    ];
    formdataOrgsendcase: any = {
        ORG_LOCATION_TYPE: null,
        ORG_LOCATION_ID: null,
        ORG_LOCATION_NAME: "",
        ORG_PROVINCE_ID: null,
        ORG_PROVICE_NAME: "",
        ORG_LOCATION_MAIN_ID1: null,
        ORG_LOCATION_MAIN_NAME1: "",
        ORG_LOCATION_MAIN_ID2: null,
        ORG_LOCATION_MAIN_NAME2: "",
        ORG_LOCATION_MAIN_ID3: null,
        ORG_LOCATION_MAIN_NAME3: "",
        ORG_LOCATION_MAIN_ID4: null,
        ORG_LOCATION_MAIN_NAME4: "",
        ORG_LOCATION_MAIN_ID5: null,
        ORG_LOCATION_MAIN_NAME5: "",
        ORG_LOCATION_CENTER_ID: null,
        ORG_LOCATION_CENTER_NAME: "",
    };
    showSelectORG = false;

    constructor(
        private servBankInfo: BankInfoService,
        private _caseTypeSub: CmsCaseTypeSubService,
        private _formValidate: FormValidatorService,
        private _OnlineCaseService: OnlineCaseService,
        private _OrgService: OrgService,
        private datePipe: DatePipe,
    ) {

    }

    ngOnInit(): void {
        this.maxDateValue.setHours(this.maxDateValue.getHours() + 1);
        this.isLoading = true;
        this.caseOpen = false;

        this.servBankInfo.GetCaseType().pipe(
            switchMap(_ => {
                this.formData.CASE_TYPE_ID = null;
                this.listCaseType = _;
                return this._OrgService.getorgwalkinall();
            })
          ).subscribe(dsorgbyarialocation => {
            this.dsorgbyarialocation = dsorgbyarialocation;
            this.dswalkinstatuspolice = dsorgbyarialocation;
            this.SetDefaultData();
          }, error => {
            if (error.status === 500 || error.status === 524) {
              this.mainConponent.checkReload(2);
            }
          });
        this.presentAddress.disableDistrict = true;
        this.presentAddress.disableSubDistrict = true;
        this.presentAddress.disablepostcode = true;
    }
    async OnSelectCaseType(e) {
        if (e.value) {
            const data = this.selectCaseType.instance.option("selectedItem");
            if (data) {
                this.formData.CASE_TYPE_ID = data.CASE_TYPE_ID;
                this.formData.CASE_TYPE_NAME = data.CASE_TYPE_NAME;
                this.caseType = data.CASE_TYPE_DESC;
                this.caseOpen = true;
                this.channel_tel = data.CASE_TYPE_ID == 66 || data.CASE_TYPE_ID == 67 ? true : false;
            } else {
                this.formData.CASE_TYPE_ID = e.value;
            }
        }
    }
    ShowInvalidDialog(){
        Swal.fire({
            title: "ผิดพลาด!",
            text: "กรุณากรอกข้อมูลให้ครบ",
            icon: "warning",
            confirmButtonText: "Ok",
        }).then(() => {});
    }
    async SetDefaultData(){
        try{
            this.userType = this.mainConponent.userType;
            this.province = this.mainConponent.province;
            this.formData.CASE_TYPE_SUB_ID = undefined;
            if (this.mainConponent.formType === 'add') {
                localStorage.setItem("form-index","3");
                this.locationRender = 'add';
                this.formType = "add";
                this.showSelectORG = true;
                this.formReadOnly = false;
                this.formValidate = true;
                if(localStorage.getItem("form-event")){
                    this.formData = JSON.parse(localStorage.getItem("form-event"));
                    this.recovery = true;
                    this.channel_tel = this.formData.CASE_TYPE_ID == 66 || this.formData.CASE_TYPE_ID == 67 ? true : false;
                    if(this.channel_tel){
                        if(localStorage.getItem("form-villain")){
                            this.channel_data = JSON.parse(localStorage.getItem("form-villain")).CASE_CHANNEL;
                        }
                    }
                }

            }else{
                const _case_id = Number(sessionStorage.getItem("case_id"));
                const dataForm = await this._OnlineCaseService.getbycaseId(_case_id).toPromise();
                var _gettype  =   this.listCaseType.find(x=>x.CASE_TYPE_ID == dataForm.CASE_TYPE_ID);
                this.showSelectORG = false;
                this.formType = "edit";
                this.formReadOnly = true;
                this.formValidate = false;
                this.formData = dataForm;
                this.formData.CASE_TYPE_ID = dataForm.CASE_TYPE_ID;
                this.formData.CASE_TYPE_NAME = _gettype.CASE_TYPE_NAME;
            }
            this.isLoading = false;
        }catch (error){
            console.log(error);
            this.SetDefaultData();
        }


    }

    Back(e){
        this.mainConponent.NextIndex(this.mainConponent.indexTab -1);
    }

    async SubmitForm(e) {
        if (this.mainConponent.formType === 'add') {
            this.formEvent1.instance.validate();
            if (!this.formEvent1.instance.validate().isValid){
                this._formValidate.ValidateForm(this.formEvent1.instance.validate().brokenRules);
                this.mainConponent.checkValidate = true;
                return;
            }
            console.log(this.formData.ORG_LOCATION_TYPE , " ", this.formData.ORG_LOCATION_ID);
            if (this.formData.ORG_LOCATION_TYPE == 1) {
                if (!this.formData.ORG_LOCATION_ID) {
                    this.alertmessagecustom("กรุณาเลือกสถานี");
                    return;
                }
            } else if (this.formData.ORG_LOCATION_TYPE == 2) {
                if (!this.formData.ORG_LOCATION_ID) {
                    this.alertmessagecustom("กรุณาเลือกสถานี");
                    return;
                }
            } else if (this.formData.ORG_LOCATION_TYPE == 3) {
                if (!this.formData.ORG_LOCATION_ID) {
                    this.alertmessagecustom("กรุณาเลือกสถานี");
                    return;
                }
            } else if(!this.formData.ORG_LOCATION_TYPE){
                this.alertmessagecustom("กรุณาเลือกสถานี");
                return;
            } else {
                if (!this.formData.ORG_LOCATION_ID) {
                    this.alertmessagecustom("กรุณาเลือกสถานี");
                    return;
                }
            }
            console.log(this.formData);
            if(this.formData.CASE_TYPE_ID === null || this.formData.CASE_TYPE_ID === 7){
                Swal.fire({
                    title: "ผิดพลาด!",
                    text: "กรุณาเลือกประเภทคดี",
                    icon: "warning",
                    confirmButtonText: "Ok",
                }).then(() => { });
                this.mainConponent.checkValidate = true;
                return;
            }
            this.mainConponent.checkValidate = false;
            this.mainConponent.formDataAll.formEvent = {};
            const setData = {};
            for (const key in this.formData) {
                if (this.formData[key] !== null && this.formData[key] !== undefined) {
                    setData[key] = this.formData[key];
                }
            }

            this.mainConponent.formDataAll.formVaillain = Object.assign({},{CASE_CHANNEL:this.channel_data});
            localStorage.setItem("form-villain",JSON.stringify(Object.assign({},{CASE_CHANNEL:this.channel_data})));

            const setDataFormAll = Object.assign({},setData);
            this.mainConponent.formDataAll.formEvent = setDataFormAll;
            console.log(setDataFormAll);
            localStorage.setItem("form-event",JSON.stringify(setDataFormAll));

        }
        if(e != 'tab'){
            this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
        }
    }

    OnWalkInChange(e) {
        if (e.value) {
            this.formData.IS_WALKIN_RADIO = e.value;
            this.formData.IS_WALKIN = e.value === 1 ? false : true;
        }
    }

    onvaluecheckboxlocationchangewalkin(e,type_location){
        this.formdataOrgsendcasewalkin = {};
        if (type_location === 1) {
            this.checkboxLocationwalkin.location_type1 = e.value;
            this.checkboxLocationwalkin.location_type2 = 0;
            if (e.value === 1) {
                this.formData.WALKIN_POLICE_STATION_ID = null;
                this.formData.location_type1 = 1;
                this.formData.ORG_LOCATION_WALKIN_TYPE = 1;
            }
        } else if (type_location === 2) {
            this.checkboxLocationwalkin.location_type2 = e.value;
            this.checkboxLocationwalkin.location_type1 = e.value;
            this.formData.ORG_PROVINCE_OFFICER_ID = undefined;
            this.formData.WALKIN_POLICE_STATION = undefined;
            if (e.value === 2) {
                this.formData.WALKIN_POLICE_STATION_ID = null;
                this.formData.location_type1 = 2;
                this.formData.ORG_LOCATION_WALKIN_TYPE = 2;
            }
        } else if (type_location === 3) {
            this.formData.ORG_PROVINCE_OFFICER_ID = undefined;
            this.formData.WALKIN_POLICE_STATION = undefined;
            this.checkboxLocationwalkin.location_type3 = e.value;
            if (e.value === 3) {
                this.formData.location_type1 = 3;
                this.formData.ORG_LOCATION_WALKIN_TYPE = 3;
                this.formData.WALKIN_POLICE_STATION_ID = 2375;
                this.formData.WALKIN_POLICE_STATION = "กองบัญชาการตำรวจสอบสวนกลาง";
            }
        }
    }

    OnSelectProvicePresentlocationWalkin(e){
        if (e.value) {
            const data =
                this.selectPresentProvicelocationWalkin.instance.option(
                    "selectedItem"
                );
            if (data) {
                this.formData.ORG_PROVINCE_OFFICER_ID = data.PROVINCE_ID;
                this.formData.ORG_PROVINCE_OFFICER_NAME = data.PROVINCE_NAME_THA;
            } else {
                this.formData.ORG_PROVINCE_OFFICER_ID = e.value;
            }
            this._OrgService.getorgProvince(e.value).subscribe((_) => {
                this.dswalkinstatuspolice = _;
            });
        }
    }

    Onorglocationwalkin(e){
        const data = this.selectorgwalkin.instance.option("selectedItem");
        if (data) {
            this.formData.ORG_LOCATION_WALKIN_TYPE = 1;
            this.formData.WALKIN_POLICE_STATION = data.ORGANIZE_NAME_THA;
            this.formData.ORG_PROVINCE_OFFICER_ID = Number(data.ORGANIZE_ARIA_CODE);
        } else {
            this.formData.WALKIN_POLICE_STATION = e.value;
        }
    }

    onvaluechangeorgmainwalkin(e, type) {
        this.formData.ORG_PROVINCE_MAP_AREA_ID = null;
        this.formData.ORG_PROVINCE_MAP_AREA_NAME = null;

        if (e.value) {
            if (type === 1) {
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID2 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID3 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID4 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID5 = null;
                const data: any = this.orgtype2_1.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcasewalkin.ORG_LOCATION_WALKIN_TYPE = 2;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID1 = data[0].org_id;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_NAME1 =
                    data[0].org_name;

                // * parame insert
                this.formData.ORG_LOCATION_WALKIN_TYPE = 2;
                this.formData.WALKIN_POLICE_STATION_ID = data[0].org_id;
                this.formData.WALKIN_POLICE_STATION = data[0].org_name;
            }
            if (type === 2) {
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID1 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID3 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID4 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID5 = null;
                const data: any = this.orgtype2_2.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcasewalkin.ORG_LOCATION_WALKIN_TYPE = 2;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID2 = data[0].org_id;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_NAME2 =
                    data[0].org_name;

                // * parame insert
                this.formData.ORG_LOCATION_WALKIN_TYPE = 2;
                this.formData.WALKIN_POLICE_STATION_ID = data[0].org_id;
                this.formData.WALKIN_POLICE_STATION = data[0].org_name;
            } else if (type === 3) {
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID1 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID2 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID4 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID5 = null;
                const data: any = this.orgtype2_3.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcasewalkin.ORG_LOCATION_WALKIN_TYPE = 2;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID3 = data[0].org_id;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_NAME3 =
                    data[0].org_name;

                // * parame insert
                this.formData.ORG_LOCATION_WALKIN_TYPE = 2;
                this.formData.WALKIN_POLICE_STATION_ID = data[0].org_id;
                this.formData.WALKIN_POLICE_STATION = data[0].org_name;
            } else if (type === 4) {
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID1 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID2 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID3 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID5 = null;
                const data: any = this.orgtype2_4.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcasewalkin.ORG_LOCATION_WALKIN_TYPE = 2;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID4 = data[0].org_id;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_NAME4 =
                    data[0].org_name;

                // * parame insert
                this.formData.ORG_LOCATION_WALKIN_TYPE = 2;
                this.formData.WALKIN_POLICE_STATION_ID = data[0].org_id;
                this.formData.WALKIN_POLICE_STATION = data[0].org_name;
            } else if (type === 5) {
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID1 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID2 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID3 = null;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID4 = null;
                const data: any = this.orgtype2_5.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcasewalkin.ORG_LOCATION_WALKIN_TYPE = 2;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID5 = data[0].org_id;
                this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_NAME5 =
                    data[0].org_name;

                // * parame insert
                this.formData.ORG_LOCATION_WALKIN_TYPE = 2;
                this.formData.WALKIN_POLICE_STATION_ID = data[0].org_id;
                this.formData.WALKIN_POLICE_STATION = data[0].org_name;
            }
        }
    }

    onvaluechangeorgcenterwalkin(e) {
        if (e.value) {
            const data: any = this.orgtype3.filter((r) => r.org_id === e.value);
            this.formdataOrgsendcasewalkin.WALKIN_POLICE_STATION =
                data[0].org_name;
            this.formData.ORG_LOCATION_WALKIN_TYPE = 3;
            this.formData.WALKIN_POLICE_STATION_ID = 2375;
            this.formData.WALKIN_POLICE_STATION = "กองบัญชาการตำรวจสอบสวนกลาง";
        } else {
            this.formdataOrgsendcasewalkin.ORG_LOCATION_CENTER_ID = e.value;
        }
    }

    onvaluecheckboxlocationchange(e, type_location) {
        this.formdataOrgsendcase = {
            ORG_LOCATION_TYPE: null,
            ORG_LOCATION_ID: null,
            ORG_LOCATION_NAME: "",
            ORG_PROVINCE_ID: null,
            ORG_PROVICE_NAME: "",
            ORG_LOCATION_MAIN_ID: null,
            ORG_LOCATION_MAIN_NAME: "",
            ORG_LOCATION_CENTER_ID: null,
            ORG_LOCATION_CENTER_NAME: "",
        };
        if (type_location == 1) {
            this.checkboxLocation.location_type1 = e.value;
            this.checkboxLocation.location_type2 = 0;
            if (e.value == 1) {
                this.formData.ORG_LOCATION_ID = null;
                this.formData.location_type1 = 1;
                this.formData.ORG_LOCATION_TYPE = 1;
            }
        } else if (type_location == 2) {

            this.checkboxLocation.location_type2 = e.value;
            this.checkboxLocation.location_type1 = e.value;
            this.formData.ORG_PROVINCE_ID = undefined;
            this.formData.ORG_PROVINCE_LOCATION_ID = undefined;
            this.formData.ORG_PROVINCE_NAME = undefined;
            if (e.value == 2) {
                this.formData.ORG_LOCATION_ID = null;
                this.formData.location_type1 = 2;
                this.formData.ORG_LOCATION_TYPE = 2;
            }
        } else if (type_location == 3) {
            this.formData.ORG_PROVINCE_ID = undefined;
            this.formData.ORG_PROVINCE_NAME = undefined;
            this.formData.ORG_PROVINCE_LOCATION_ID = undefined;
            this.checkboxLocation.location_type3 = e.value;
            if (e.value == 3) {
                this.formData.location_type1 = 3;
                this.formData.ORG_LOCATION_TYPE = 3;
                this.formData.ORG_LOCATION_ID = 2375;
                this.formData.ORG_LOCATION_NAME = "กองบัญชาการตำรวจสอบสวนกลาง";
            }
        }
    }

    OnSelectProvicePresentlocation(e) {
        if (e.value) {
            const data =
                this.selectPresentProvicelocation.instance.option(
                    "selectedItem"
                );
            if (data) {
                this.formData.ORG_PROVINCE_ID = data.PROVINCE_ID;
                this.formData.ORG_PROVINCE_NAME = data.PROVINCE_NAME_THA;
            } else {
                this.formData.ORG_PROVINCE_ID = e.value;
            }
            this._OrgService.getorgProvince(e.value).subscribe((_) => {
                this.dsorgbyarialocation = _;
            });
        }
    }

    Onorglocation(e) {
        if (e.value) {
            const data = this.selectorg.instance.option("selectedItem");
            if (data) {
                this.formData.ORG_LOCATION_TYPE = 1;
                this.formData.ORG_LOCATION_ID = data.ORGANIZE_ID;
                this.formData.ORG_LOCATION_NAME = data.ORGANIZE_NAME_THA;
                this.formData.ORG_PROVINCE_LOCATION_ID = data.ORGANIZE_ID;
                this.formData.ORG_PROVINCE_ID = Number(data.ORGANIZE_ARIA_CODE);
            } else {
                this.formData.ORG_LOCATION_ID = e.value;
            }
        }
    }

    onvaluechangeorgmain(e, type) {
        this.formData.ORG_PROVINCE_MAP_AREA_ID = null;
        this.formData.ORG_PROVINCE_MAP_AREA_NAME = null;

        if (e.value) {
            if (type == 1) {
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = null;
                const data: any = this.orgtype2_1.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = data[0].org_id;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_NAME1 =
                    data[0].org_name;

                //parame insert
                this.formData.ORG_LOCATION_TYPE = 2;
                this.formData.ORG_LOCATION_ID = data[0].org_id;
                this.formData.ORG_LOCATION_NAME = data[0].org_name;
            }
            if (type == 2) {
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = null;
                const data: any = this.orgtype2_2.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = data[0].org_id;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_NAME2 =
                    data[0].org_name;

                //parame insert
                this.formData.ORG_LOCATION_TYPE = 2;
                this.formData.ORG_LOCATION_ID = data[0].org_id;
                this.formData.ORG_LOCATION_NAME = data[0].org_name;
            } else if (type == 3) {
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = null;
                const data: any = this.orgtype2_3.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = data[0].org_id;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_NAME3 =
                    data[0].org_name;

                //parame insert
                this.formData.ORG_LOCATION_TYPE = 2;
                this.formData.ORG_LOCATION_ID = data[0].org_id;
                this.formData.ORG_LOCATION_NAME = data[0].org_name;
            } else if (type == 4) {
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = null;
                const data: any = this.orgtype2_4.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = data[0].org_id;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_NAME4 =
                    data[0].org_name;

                //parame insert
                this.formData.ORG_LOCATION_TYPE = 2;
                this.formData.ORG_LOCATION_ID = data[0].org_id;
                this.formData.ORG_LOCATION_NAME = data[0].org_name;
            } else if (type == 5) {
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID1 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID2 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID3 = null;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID4 = null;
                const data: any = this.orgtype2_5.filter(
                    (r) => r.org_id === e.value
                );
                this.formdataOrgsendcase.ORG_LOCATION_TYPE = 2;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_ID5 = data[0].org_id;
                this.formdataOrgsendcase.ORG_LOCATION_MAIN_NAME5 =
                    data[0].org_name;

                //parame insert
                this.formData.ORG_LOCATION_TYPE = 2;
                this.formData.ORG_LOCATION_ID = data[0].org_id;
                this.formData.ORG_LOCATION_NAME = data[0].org_name;
            }
        }
    }

    onvaluechangeorgcenter(e) {
        if (e.value) {
            const data: any = this.orgtype3.filter((r) => r.org_id === e.value);
            this.formdataOrgsendcase.ORG_LOCATION_TYPE = 3;
            this.formdataOrgsendcase.ORG_LOCATION_CENTER_ID = data[0].org_id;
            this.formdataOrgsendcase.ORG_LOCATION_CENTER_NAME =
                data[0].org_name;

            //parame insert
            this.formData.ORG_LOCATION_TYPE = 3;
            this.formData.ORG_LOCATION_ID = 2375;
            this.formData.ORG_LOCATION_NAME = "กองบัญชาการตำรวจสอบสวนกลาง";
        } else {
            this.formdataOrgsendcase.ORG_LOCATION_CENTER_ID = e.value;
        }
    }

    alertmessagecustom(msg) {
        Swal.fire({
            title: "ผิดพลาด!",
            text: msg ?? "กรุณากรอกข้อมูล",
            icon: "warning",
            confirmButtonText: "Ok",
        }).then(() => { });
        this.mainConponent.checkValidate = true;
        return;
    }

    PhoneNumberPattern(params) {
        const makeScope = new RegExp('^[0](?=[0-9]{9,9}$)', 'g');
        return makeScope.test(params.value);
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

    OnSelectDate(e){
        if(e.value){
            const mydate = this.datePipe.transform(e.value, 'yyyy-MM-dd');
            const mytime = this.datePipe.transform(e.value, 'HH:mm:ss');
            this.formDataChannel.CASE_CHANNEL_PHONE_TIME = mytime;
            this.formDataChannel.CASE_CHANNEL_PHONE_DATE = mydate;
        }
    }

    cancel(){
        this.formDataChannel = {};
        this.datePhone = null;
        this.indexEdit = 0;
        this.edit = false;
    }

    addDataChannel() {
        if (!this.formChannel.instance.validate().isValid){
            this._formValidate.ValidateForm(this.formChannel.instance.validate().brokenRules);
            return;
        }else{
            if(!this.edit){
                if(this.formDataChannel.CASE_CHANNEL_PHONE_DATE != null){
                    const dateStart = this.convertDate(this.formDataChannel.CASE_CHANNEL_PHONE_DATE,this.formDataChannel.CASE_CHANNEL_PHONE_TIME);
                    this.datePhone = new Date(dateStart[0],dateStart[1],dateStart[2],dateStart[3],dateStart[4],dateStart[5]);
                }
                this.channel_data.push(
                    {
                        CASE_CHANNEL_PHONE_DESTINATION : this.formDataChannel.CASE_CHANNEL_PHONE_DESTINATION,
                        CASE_CHANNEL_PHONE_DATE : this.formDataChannel.CASE_CHANNEL_PHONE_DATE,
                        CASE_CHANNEL_PHONE_TIME: this.formDataChannel.CASE_CHANNEL_PHONE_TIME,
                        CHANEL_PHONE : true,
                        DATE_PHONE : this.datePhone,
                        CHANNEL_PHONE_DOC : []
                    }
                );
            }else{
                if(this.formDataChannel.CASE_CHANNEL_PHONE_DATE != null){
                    const dateStart = this.convertDate(this.formDataChannel.CASE_CHANNEL_PHONE_DATE,this.formDataChannel.CASE_CHANNEL_PHONE_TIME);
                    this.datePhone = new Date(dateStart[0],dateStart[1],dateStart[2],dateStart[3],dateStart[4],dateStart[5]);
                }
                this.channel_data[this.indexEdit] = {
                    CASE_CHANNEL_PHONE_DESTINATION : this.formDataChannel.CASE_CHANNEL_PHONE_DESTINATION,
                    CASE_CHANNEL_PHONE_DATE : this.formDataChannel.CASE_CHANNEL_PHONE_DATE,
                    CASE_CHANNEL_PHONE_TIME: this.formDataChannel.CASE_CHANNEL_PHONE_TIME,
                    CHANEL_PHONE : true,
                    DATE_PHONE : this.datePhone,
                    CHANNEL_PHONE_DOC : []
                }
            }
            this.formDataChannel = {};
            this.datePhone = null;
            this.edit = false;
            console.log(this.channel_data);
            console.log(this.channel_data[0].DATE_PHONE);
        }

    }

    convertDate(date,time){
        const dateIN = String(date+" "+time);
        const [datePart, timePart] = dateIN.split(" ");
        const [year, month, day] = datePart.split("-");
        const [hours, minutes, seconds] = timePart.split(":");
        return [Number(year),Number(month)-1,Number(day),Number(hours),Number(minutes),Number(seconds)]
    }

    onEditItem(event: any, index = null) {
        this.indexEdit = index;
        const data = event.data;
        this.edit = true;
        setTimeout(() => {
            this.formDataChannel = {
                CASE_CHANNEL_PHONE_DESTINATION: data.CASE_CHANNEL_PHONE_DESTINATION,
                CASE_CHANNEL_PHONE_DATE: data.CASE_CHANNEL_PHONE_DATE,
                CASE_CHANNEL_PHONE_TIME: data.CASE_CHANNEL_PHONE_TIME,
                CHANEL_PHONE: data.CHANEL_PHONE,
                DATE_PHONE: data.DATE_PHONE,
                CHANNEL_PHONE_DOC: data.CHANNEL_PHONE_DOC
            }
            if(this.formDataChannel.CHANEL_PHONE && this.formDataChannel.CASE_CHANNEL_PHONE_DATE != null){
                const dateStart = this.convertDate(this.formDataChannel.CASE_CHANNEL_PHONE_DATE,this.formDataChannel.CASE_CHANNEL_PHONE_TIME);
                this.datePhone = new Date(dateStart[0],dateStart[1],dateStart[2],dateStart[3],dateStart[4],dateStart[5]);
            }
        }, 200)
    }

    onDeleteItem(event: any) {
        Swal.fire({
            icon: 'warning',
            title: 'ท่านต้องการลบข้อมูลหรือไม่?',
            confirmButtonText: 'ตกลง',
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                this.channel_data.splice(event.rowIndex, 1)
            }
            return
        })
    }

    displayFormatDateTime(date) {
        return formatDate(date, 'dateShortTimeThai');
    }
}
