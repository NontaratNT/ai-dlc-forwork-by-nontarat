import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    ViewChild,
} from "@angular/core";
import { DxFormComponent, DxSelectBoxComponent } from "devextreme-angular";
import { BankInfoService } from "src/app/services/bank-info.service";
import { DistrictService } from "src/app/services/district.service";
import { FormValidatorService } from "src/app/services/form-validator.service";
import { IssueOnlineService } from "src/app/services/issue-online.service";
import { ProvinceService } from "src/app/services/province.service";
import { SubdistrictService } from "src/app/services/subdistrict.service";

@Component({
    selector: "app-view-address",
    templateUrl: "./view-address.component.html",
    styleUrls: ["./view-address.component.scss"],
})
export class ViewAddressComponent implements OnInit, OnChanges {
    @ViewChild("selectPresentProvice", { static: false })
    selectPresentProvice: DxSelectBoxComponent;
    @ViewChild("selectPresentDistrict", { static: false })
    selectPresentDistrict: DxSelectBoxComponent;
    @ViewChild("selectPresentSubDistrict", { static: false })
    selectPresentSubDistrict: DxSelectBoxComponent;
    @ViewChild("selectPresentPostcode", { static: false })
    selectPresentPostcode: DxSelectBoxComponent;
    @ViewChild("selectBankInfo", { static: false })
    selectBankInfo: DxSelectBoxComponent;
    @ViewChild("selectBankBranch", { static: false })
    selectBankBranch: DxSelectBoxComponent;
    @ViewChild("formAddressValidate", { static: false })
    formAddressValidate: DxFormComponent;

    @Input() dataForm: any;
    @Input() type = "add";
    @Input() renderView = "view1";
    @Input() replaceKey = "";
    @Output() dataFormChange = new EventEmitter<any>();
    province: any = [];
    bankBranch: any = [];
    bankInfoList: any = [];
    presentAddress: any = {};
    formData: any = {};
    formReadOnly = false;
    formValidate = false || this.renderView === "view1";
    isLoadForm = false;
    isLoading = false;
    issueOnline: any;
    checkboxaddresscard = false;
    checkboxaddressnow = false;
    checkRequirement  = false;
    constructor(
        private serviceProvince: ProvinceService,
        private serviceDistrict: DistrictService,
        private serviceSubDistrict: SubdistrictService,
        private servBankInfo: BankInfoService,
        private _formValidate: FormValidatorService,
        private _issueOnlineService: IssueOnlineService,

    ) {}

    ngOnInit(): void {
        this._issueOnlineService.issueOnline$.subscribe(value => {
            this.checkRequirement = !value.CHECK_BLESSING;
            this.SetDefault(this.dataForm);

        });
    }
    async ReplaceKeyLocation(data) {
        const setData = {};
        const d = data;
        for (const key in d) {
            if (d[key] !== null && d[key] !== undefined) {
                setData[key] = d[key];
            }
        }
        return setData;
    }
    CheckRequired() {
        if (this.formAddressValidate) {
            this.formAddressValidate.instance.validate();
            if (!this.formAddressValidate.instance.validate().isValid) {
                this._formValidate.ValidateForm(
                    this.formAddressValidate.instance.validate().brokenRules
                );
                return false;
            }
        }
        return true;
    }

    ReplaceText(replaceText, key) {
        return key.replace(`${replaceText}_`, "");
    }
    async SetDefault(dataFormAll: any = {}) {
        this.isLoading = true;
        this.isLoadForm = false;
        this.presentAddress.disableDistrict = true;
        this.presentAddress.disableSubDistrict = true;
        this.presentAddress.disablepostcode = true;
        this.province = await this.serviceProvince.GetProvince().toPromise();
        this.bankInfoList = await this.servBankInfo.GetBankInfo().toPromise();
        if (this.type === "add") {
            this.formReadOnly = false;
            this.formValidate = false || this.renderView === "view1";
        } else if (this.type === "edit") {
        } else if (this.type === "view") {
            this.formReadOnly = true;
            const reKey = this.replaceKey;
            const d = dataFormAll;
            console.log(d);
            // console.log(d);
            const data = {
                ADDRESS: d[`${reKey}_ADDRESS`] ?? undefined,
                PROVINCE_ID: d[`${reKey}_PROVINCE_ID`] ?? undefined,
                PROVINCE_NAME_THA: d[`${reKey}_PROVINCE_NAME_THA`] ?? undefined,
                DISTRICT_ID: d[`${reKey}_DISTRICT_ID`] ?? undefined,
                DISTRICT_NAME_THA: d[`${reKey}_DISTRICT_NAME_THA`] ?? undefined,
                SUB_DISTRICT_ID: d[`${reKey}_SUB_DISTRICT_ID`] ?? undefined,
                SUB_DISTRICT_NAME_THA:
                    d[`${reKey}_SUB_DISTRICT_NAME_THA`] ?? undefined,
                BANK_ID: d[`${reKey}_BANK_ID`] ?? undefined,
                BRANCH_BANK_NAME: d[`${reKey}_BRANCH_BANK_NAME`] ?? undefined,
                BANK_BRANCH_ID: d[`${reKey}_BANK_BRANCH_ID`] ?? undefined,
                BANK_BRANCH_NAME: d[`${reKey}_BANK_BRANCH_NAME`] ?? undefined,
                INFORMER_ADDRESS_STREET:
                    d[`${reKey}_INFORMER_ADDRESS_STREET`] ?? undefined,
                INFORMER_ADDRESS_SOI:
                    d[`${reKey}_INFORMER_ADDRESS_SOI`] ?? undefined,
                CASE_INFORMER_ADDRESS_MOO:
                    d[`${reKey}_CASE_INFORMER_ADDRESS_MOO`] ?? undefined,
            };
            if (data.PROVINCE_ID) {
                this.presentAddress.district = await this.serviceProvince
                    .GetDistrictofProvince(data.PROVINCE_ID)
                    .toPromise();
                this.presentAddress.disableDistrict = false;
            }
            if (data.DISTRICT_ID) {
                this.presentAddress.subDistrict = await this.serviceDistrict
                    .GetSubDistrictOfDistrict(data.DISTRICT_ID)
                    .toPromise();
                this.presentAddress.disableSubDistrict = false;
            }
            if (data.SUB_DISTRICT_ID) {
                this.presentAddress.postcode = await this.serviceSubDistrict
                    .GetPostCode(data.SUB_DISTRICT_ID)
                    .toPromise();
                this.presentAddress.disablepostcode = false;
            }

            if (data.BANK_ID) {
                this.bankBranch = await this.servBankInfo
                    .GetBankBranch(data.BANK_ID)
                    .toPromise();
            }

            this.formData = {};
            const setData = {};
            for (const key in data) {
                if (data[key] !== null && data[key] !== undefined) {
                    setData[key] = data[key];
                }
            }
            this.formData = setData;
        }
        this.isLoadForm = true;
        this.isLoading = false;
    }
    ngOnChanges(): void {
        this.dataFormChange.emit(this.formData);
    }
    SetClearChange(type) {
        // if (type === 'province' || type === 'district' || type === 'subDistrict' ){
        //     this.presentAddress.postcode = [];
        //     this.presentAddress.disablepostcode = true;
        //     delete this.formData.POSTCODE_ID;
        //     delete this.formData.POSTCODE_CODE;
        // }
        if (type === "province" || type === "district") {
            this.presentAddress.subDistrict = [];
            this.presentAddress.disableSubDistrict = true;
            delete this.formData.SUB_DISTRICT_ID;
            delete this.formData.SUB_DISTRICT_NAME_THA;
        }
        if (type === "province") {
            this.presentAddress.district = [];
            this.presentAddress.disableDistrict = true;
            delete this.formData.DISTRICT_ID;
            delete this.formData.DISTRICT_NAME_THA;
        }
        // const setData = {};
        // const d = this.formData;
        // console.log('this.formData',this.formData);
        // for (const key in d) {
        //     if (d[key] !== null && d[key] !== undefined) {
        //         setData[key] = d[key];
        //     }
        // }
        // console.log('setData',setData);
        // this.formData = setData;
    }
    OnSelectProvicePresent(e) {
        this.SetClearChange("province");
        if (e.value) {
            const data =
                this.selectPresentProvice.instance.option("selectedItem");
            if (data) {
                this.formData.PROVINCE_ID = data.PROVINCE_ID;
                this.formData.PROVINCE_NAME_THA = data.PROVINCE_NAME_THA;
            } else {
                this.formData.PROVINCE_ID = e.value;
            }

            this.presentAddress.disableDistrict = false;
            this.presentAddress.disableSubDistrict = true;
            this.presentAddress.disablepostcode = true;
            this.serviceProvince
                .GetDistrictofProvince(e.value)
                .subscribe((_) => (this.presentAddress.district = _));
        }
    }
    OnSelectDistrictPresent(e) {
        this.SetClearChange("district");
        if (e.value) {
            const data =
                this.selectPresentDistrict.instance.option("selectedItem");
            if (data) {
                this.formData.DISTRICT_ID = data.DISTRICT_ID;
                this.formData.DISTRICT_NAME_THA = data.DISTRICT_NAME_THA;
            } else {
                this.formData.DISTRICT_ID = e.value;
            }

            this.presentAddress.disableSubDistrict = false;
            this.presentAddress.disablepostcode = true;
            this.serviceDistrict
                .GetSubDistrictOfDistrict(e.value)
                .subscribe((_) => (this.presentAddress.subDistrict = _));
        }
    }

    OnSelectSubDistrictPresent(e) {
        this.SetClearChange("subDistrict");
        if (e.value) {
            const data =
                this.selectPresentSubDistrict.instance.option("selectedItem");
            if (data) {
                this.formData.SUB_DISTRICT_ID = data.SUB_DISTRICT_ID;
                this.formData.SUB_DISTRICT_NAME_THA =
                    data.SUB_DISTRICT_NAME_THA;
            } else {
                this.formData.SUB_DISTRICT_ID = e.value;
            }

            this.presentAddress.disablepostcode = false;
            this.serviceSubDistrict
                .GetPostCode(e.value)
                .subscribe((_) => (this.presentAddress.postcode = _));
        }
    }

    OnSelectPostCodePresent(e) {
        if (e.value) {
            const data =
                this.selectPresentPostcode.instance.option("selectedItem");
            if (data) {
                this.formData.POSTCODE_ID = data.POSTCODE_ID;
                this.formData.POSTCODE_CODE = data.POSTCODE_CODE;
            } else {
                this.formData.POSTCODE_ID = e.value;
            }
        }
    }
    OnSelectBankAccount(e) {
        if (e.value) {
            const data = this.selectBankInfo.instance.option("selectedItem");
            if (data) {
                this.formData.BANK_ID = data.BANK_ID;
                this.formData.BANK_NAME = data.BANK_NAME;

                this.servBankInfo.GetBankBranch(data.BANK_ID).subscribe((_) => {
                    this.bankBranch = _;
                });
            } else {
                this.formData.BANK_ID = e.value;
            }
        }
    }

    OnSelectBankBranch(e) {
        if (e.value) {
            const data = this.selectBankBranch.instance.option("selectedItem");
            if (data) {
                this.formData.BANK_BRANCH_ID = data.BANK_BRANCH_ID;
                this.formData.BANK_BRANCH_NAME = data.BANK_BRANCH_NAME;
            } else {
                this.formData.BANK_BRANCH_ID = e.value;
            }
        }
        // console.log(this.formData);
    }
    onvaluecheckaddressnow(e){
        setTimeout(() => {
            if (e.value) {
                this.checkboxaddresscard = false;
                this._issueOnlineService.issueOnline$.subscribe(value => {
                    // console.log("IssueOnlineView", value);
                    this.issueOnline = value;
                });
                setTimeout(() => {
                    this.formData.PROVINCE_ID = this.issueOnline.INFORMER_PROVINCE;
                    this.formData.CASE_INFORMER_ADDRESS = this.issueOnline.CASE_INFORMER_ADDRESS_NO;
                    this.serviceProvince
                        .GetDistrictofProvince(this.formData.PROVINCE_ID)
                        .subscribe((_) => {
                            this.presentAddress.district = _;
                            this.presentAddress.disableDistrict = false;
                            this.formData.DISTRICT_ID = this.issueOnline.INFORMER_DISTRICT_ID;
                            this.serviceDistrict
                                .GetSubDistrictOfDistrict(this.formData.DISTRICT_ID)
                                .subscribe((res) => {
                                    this.presentAddress.subDistrict = res;
                                    this.presentAddress.disableSubDistrict = false;
                                    this.formData.SUB_DISTRICT_ID = this.issueOnline.INFORMER_SUB_DISTRICT_ID;
                                    return;
                                });
                        });
                },500);
            } else {
                this.formData.CASE_INFORMER_ADDRESS = "";
                this.formData.SUB_DISTRICT_ID = null;
                this.formData.DISTRICT_ID = null;
                this.formData.PROVINCE_ID = null;
                return;
            }
        }, 0);

    }

    onvaluecheckaddresscard(e) {
        setTimeout(() => {
            if (e.value) {
                this.checkboxaddressnow = false;
                this._issueOnlineService.issueOnline$.subscribe(value => {
                    // console.log("IssueOnlineView", value);
                    this.issueOnline = value;
                });

                setTimeout(() => {
                    this.formData.PROVINCE_ID = this.issueOnline.INFORMER_CARD_PROVINCE;
                    this.formData.CASE_INFORMER_ADDRESS = this.issueOnline.CASE_INFORMER_CARD_ADDRESS_NO;
                    this.serviceProvince
                        .GetDistrictofProvince(this.formData.PROVINCE_ID)
                        .subscribe((_) => {
                            this.presentAddress.district = _;
                            this.presentAddress.disableDistrict = false;

                            this.formData.DISTRICT_ID = this.issueOnline.INFORMER_CARD_DISTRICT_ID;

                            this.serviceDistrict
                                .GetSubDistrictOfDistrict(this.formData.DISTRICT_ID)
                                .subscribe((res) => {
                                    this.presentAddress.subDistrict = res;
                                    this.presentAddress.disableSubDistrict = false;

                                    this.formData.SUB_DISTRICT_ID = this.issueOnline.INFORMER_CARD_SUB_DISTRICT_ID;
                                    return;

                                });
                        });

                },500);


            } else {
                this.formData.CASE_INFORMER_ADDRESS = "";
                this.formData.SUB_DISTRICT_ID = null;
                this.formData.DISTRICT_ID = null;
                this.formData.PROVINCE_ID = null;
                return;
            }
        }, 500);

    }

}
