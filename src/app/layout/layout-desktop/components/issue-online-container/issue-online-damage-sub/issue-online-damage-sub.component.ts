import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DxFormComponent, DxScrollViewComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { BankInfoService } from 'src/app/services/bank-info.service';
import Swal from "sweetalert2";
import { IssueOnlineDamageComponent } from '../issue-online-damage/issue-online-damage.component';

@Component({
    selector: 'app-issue-online-damage-sub',
    templateUrl: './issue-online-damage-sub.component.html',
    styleUrls: ['./issue-online-damage-sub.component.scss']
})
export class IssueOnlineDamageSubComponent implements OnInit {
    @ViewChild("selectBankInfoOrigin", { static: false })
    selectBankInfoOrigin: DxSelectBoxComponent;
    @ViewChild("selectBankInfovillian", { static: false })
    selectBankInfovillian: DxSelectBoxComponent;
    @ViewChild("formbanknewpopup", { static: false }) formbanknewpopup: DxFormComponent;
    @ViewChild("formbanknewpopupvillain", { static: false }) formbanknewpopupvillain: DxFormComponent;
    @ViewChild("selectBanktype", { static: false })
    selectBanktype: DxSelectBoxComponent;
    @ViewChild("selectBanktypevalian", { static: false })
    selectBanktypevalian: DxSelectBoxComponent;
    @ViewChild("selecttruemoneytype", { static: false })
    selecttruemoneytype: DxSelectBoxComponent;
    @ViewChild("selecttruemoneytypevalian", { static: false })
    selecttruemoneytypevalian: DxSelectBoxComponent;

    @ViewChild("view_form", { static: false })
    scrollViewForm: DxScrollViewComponent;
    @Input() popupbanklist;
    @Input() popupbanklistvillain;
    @Output() checkpopupbanklist = new EventEmitter<boolean>();
    @Output() checkpopupbanklistvillian = new EventEmitter<boolean>();
    @Output() setvaluebank = new EventEmitter<any>();
    @Output() setvaluebankvillian = new EventEmitter<any>();

    public damagemain: IssueOnlineDamageComponent;
    popupFormData: any = {};
    popupFormDatavillain: any = {};

    bankInfoListOrigin: any = [];
    ways = [{ id: 2, text: 'ผู้เสียหาย' }, { id: 1, text: 'ผู้ร้าย' }];

    formchecktype: any = {};
    formchecktypevalian: any = {};
    bankdatatypeselect: any = [
        { type_bank_id: 1, type_main: 'T', type_id: 'T', type_name: 'ธนาคาร' },
        { type_bank_id: 2, type_main: 'T', type_id: 'P', type_name: 'พร้อมเพย์' },
        { type_bank_id: 3, type_main: 'P', type_id: 'P', type_name: 'True Money' },
        { type_bank_id: 4, type_main: 'P', type_id: 'C', type_name: 'เงินดิจิทัล (Cryptocurrency)' },
        { type_bank_id: 5, type_main: 'P', type_id: 'P', type_name: 'Paypal' },
        { type_bank_id: 6, type_main: 'P', type_id: 'O', type_name: 'อื่นๆ' },
    ]
    selectNumberBankType = [
        { ID: "P", TEXT: "หมายเลขโทรศัพท์" },
        { ID: "W", TEXT: "Wallet ID" },
        { ID: "B", TEXT: "หมายเลขบัญชี" },
    ];
    BankOriginNumberPattern = /^([0-9]{10,15})/;
    BankNumberPattern = /^([0-9Xx]{10,15})/;
    emailOrNumber = "N";
    checktype = false;
    constructor(
        private servBankInfo: BankInfoService,
    ) {

        this.popupFormData = {} as any;
        this.popupFormDatavillain = {} as any;
    }

    ngOnInit(): void {
        this.SetDefaultData();
    }
    async SetDefaultData(type="bank") {
        this.bankdatatypeselect = [
            { type_bank_id: 1, type_main: 'T', type_id: 'T', type_name: 'ธนาคาร' },
            { type_bank_id: 2, type_main: 'T', type_id: 'P', type_name: 'พร้อมเพย์' },
            { type_bank_id: 3, type_main: 'P', type_id: 'P', type_name: 'True Money' },
            { type_bank_id: 4, type_main: 'P', type_id: 'C', type_name: 'เงินดิจิทัล (Cryptocurrency)' },
            { type_bank_id: 5, type_main: 'P', type_id: 'P', type_name: 'Paypal' },
            { type_bank_id: 6, type_main: 'P', type_id: 'O', type_name: 'อื่นๆ' },
        ];
        this.popupFormData.ways = 2;
        this.popupFormDatavillain.ways = 1;
        const bankData = await this.servBankInfo.GetBankInfo().toPromise();
        this.bankInfoListOrigin = bankData;
        console.log(type);
        if(type == "crypto"){
            this.checktype = true;
            this.popupFormData.BANK_TYPE = 4;
            this.popupFormDatavillain.type = "crypto";
        }else{
            this.checktype = false;
            this.bankdatatypeselect = this.popupbanklist ? this.bankdatatypeselect.filter(item => item.type_bank_id !== 4):this.bankdatatypeselect;
        }
    }

    OnSelectBankAccountOrigin(e) {
        if (e.value) {
            const data =
                this.selectBankInfoOrigin.instance.option("selectedItem");
            if (data) {
                this.popupFormData.BANK_ORIGIN_ID = data.BANK_ID;
                this.popupFormData.BANK_ORIGIN_NAME = data.BANK_NAME;
            } else {
                this.popupFormData.BANK_ORIGIN_ID = e.value;
            }
        }
    }


    OnSelectBankAccount(e) {
        if (e.value) {
            const data =
                this.selectBankInfovillian.instance.option("selectedItem");
            if (data) {
                this.popupFormDatavillain.BANK_ID = data.BANK_ID;
                this.popupFormDatavillain.BANK_NAME = data.BANK_NAME;
            } else {
                this.popupFormDatavillain.BANK_ID = e.value;
            }
        }
    }


    OnSelectBankType(e) {
        if (e.value) {
            const data =
                this.selectBanktype.instance.option("selectedItem");
            if (data) {
                this.formchecktype.type_main = data.type_main;
                this.formchecktype.type_id = data.type_id;
                this.formchecktype.type_bank_id = data.type_bank_id;
                this.formchecktype.type_name = data.type_name;
                this.popupFormData.TYPE_MAIN = data.type_main;
                this.popupFormData.TYPE_ID = data.type_id;
                this.popupFormData.TYPE_NAME = data.type_name;
                this.popupFormData.TYPE_BANK_ID = data.type_bank_id;
            } else {
            }
        }
    }

    OnSelectBankTypevalian(e) {
        if (e.value) {
            const data =
                this.selectBanktypevalian.instance.option("selectedItem");
            if (data) {
                this.formchecktypevalian.type_main = data.type_main;
                this.formchecktypevalian.type_id = data.type_id;
                this.formchecktypevalian.type_bank_id = data.type_bank_id;
                this.formchecktypevalian.type_name = data.type_name;
                this.popupFormDatavillain.TYPE_MAIN = data.type_main;
                this.popupFormDatavillain.TYPE_ID = data.type_id;
                this.popupFormDatavillain.TYPE_NAME = data.type_name;
                this.popupFormData.TYPE_BANK_ID = data.type_bank_id;
            } else {
            }
        }
    }

    OnSelecttruemoneyType(e) {
        if (e.value) {
            const data =
                this.selecttruemoneytype.instance.option("selectedItem");
            if (data) {
                this.popupFormData.TRUEMONEY_TYPE = data.ID;
                this.popupFormData.TRUEMONEY_TYPE_NAME = data.TEXT;
            } else {
            }
        }
    }
    OnSelecttruemoneyTypevalian(e) {
        if (e.value) {
            const data =
                this.selecttruemoneytypevalian.instance.option("selectedItem");
            if (data) {
                this.popupFormDatavillain.TRUEMONEY_TYPE = data.ID;
                this.popupFormDatavillain.TRUEMONEY_TYPE_NAME = data.TEXT;
            } else {
            }
        }
    }
    saveitemtoparentstart(e) {
        if (!this.formbanknewpopup.instance.validate().isValid) {
            Swal.fire({
                title: "ผิดพลาด!",
                text: "กรุณากรอกข้อมูลให้ถูกต้อง",
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => { });
            return;
        }
        this.setvaluebank.emit(this.popupFormData);
        this.checkpopupbanklist.emit(false);
        this.popupFormData = {};

    }
    saveitemtoparentsvillain(e) {
        if (!this.formbanknewpopupvillain.instance.validate().isValid) {
            Swal.fire({
                title: "ผิดพลาด!",
                text: "กรุณากรอกข้อมูลให้ถูกต้อง",
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => { });
            return;
        }
        this.setvaluebankvillian.emit(this.popupFormDatavillain);
        this.checkpopupbanklistvillian.emit(false);
        this.popupFormDatavillain = {};

    }



    closepopup(e) {

        this.popupFormData = {};
        this.popupbanklist = false;

    }
    closepopupvillian(e) {
        this.popupFormData = {};
        this.popupbanklistvillain = false;

    }
    CheckString(event) {
        const seperator = "^[A-Za-zก-๏\\s]+$";
        // const seperator = '^([0-9])';
        const maskSeperator = new RegExp(seperator, "g");
        const result = maskSeperator.test(event.key);
        return result;
    }
    CheckNumber(event) {
        // const seperator  = '^[ก-๏\\s]+$';
        if (this.popupFormData.ways == 1) {
            const seperator = "[0-9xX]";
            const maskSeperator = new RegExp(seperator, "g");
            const result = maskSeperator.test(event.key);
            return result;
        } else {
            const seperator = "^([0-9])";
            const maskSeperator = new RegExp(seperator, "g");
            const result = maskSeperator.test(event.key);
            return result;
        }
    }
    PasteCheckNumber(event) {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData.getData("text");
        // const seperator  = '^[ก-๏\\s]+$';
        if (this.popupFormData.ways == 1) {
            const seperator = "^[0-9xX]+$";
            const maskSeperator = new RegExp(seperator, "g");
            const result = maskSeperator.test(pastedText);
            return result;
        } else {
            const seperator = "^[0-9]+$";
            const maskSeperator = new RegExp(seperator, "g");
            const result = maskSeperator.test(pastedText);
            return result;
        }
    }

    AccountNamePattern(params) {
        const makeScope = new RegExp("[A-Za-zก-๏ ]", "g");
        const result = makeScope.test(params.value);
        return result;
    }
    AccountNameValidator(event) {
        const makeScope = new RegExp("^[A-Za-zก-๏. ]", "g");
        const result = makeScope.test(event.key);
        return result;
    }
    TrueMoneyValidator(event) {
        if (event.value === "P") {
            return this.PhoneNumberValidator(event);
        } else if (event.value === "W") {
            return this.WalletIdValidator(event);
        } else {
            return this.BankAccountValidator(event);
        }
    }
    InputConidtions(event) {
        let d = this.popupFormData.BANK_MONEY_OTHER_ID;
        if (d === "T") {
            return this.TrueMoneyValidator(event);
        } else if (d === "C") {
            return this.CyrptoValidator(event);
        } else if (d === "P") {
            return this.EmailOrNumberValidator(event);
        } else {
            return true;
        }
    }
    CyrptoPattern(params) {
        const makeScope = new RegExp("[^A-Za-z0-9]", "g");
        return !makeScope.test(params.value);
    }
    CyrptoValidator(event) {
        const makeScope = new RegExp("^[A-Za-z0-9]", "g");
        return makeScope.test(event.key);
    }

    EmailOrNumberValidator(event) {
        const makeScope = new RegExp("^[0-9]", "g");
        const result = makeScope.test(event.key);
        if (result) {
            this.emailOrNumber = "N";
            return this.PhoneNumberValidator(event);
        } else {
            this.emailOrNumber = "E";
            return this.EmailValidator(event);
        }
    }

    PhoneNumberValidator(event) {
        let value = event.target.value + event.key;
        const makeScope = new RegExp("^[0-9](?=[0-9]{0,9}$)", "g");
        return makeScope.test(value);
    }
    PhoneNumberSanitize(_value) {
        if (!_value) {
            return _value;
        }
        return _value.replace(/[^0-9]/g, "");
    }

    EmailValidator(event) {
        const keyAllow = new RegExp("^[a-zA-Z0-9@._-]", "g");
        const resultAllow = keyAllow.test(event.key);
        return resultAllow;
    }

    WalletIdValidator(event) {
        let value = event.target.value + event.key;
        const makeScope = new RegExp(
            "^[a-zA-Z](?=[a-zA-Z0-9ก-๙!@#$%^&*()_+]{0,31}$)",
            "g"
        );
        return makeScope.test(value);
    }

    BankAccountValidator(event) {
        let value = event.target.value + event.key;
        const makeScope = new RegExp("^(?=[0-9]{0,15}$)", "g");
        return makeScope.test(value);
    }
}
