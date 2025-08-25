import { Component, Input, OnInit } from '@angular/core';
import { IssueOnlineContainerComponent } from '../issue-online-container.component';
import { IssueOnlineFileUploadService } from 'src/app/services/issue-online-file-upload.service';
import Swal from 'sweetalert2';
import { DxFormComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { BankInfoService } from 'src/app/services/bank-info.service';
import { locale } from 'devextreme/localization';
import { DatePipe } from '@angular/common';
import { ValidatorService } from 'src/app/services/validator-service.service';

@Component({
  selector: 'app-ocpb-online-complain-damage',
  templateUrl: './ocpb-online-complain-damage.component.html',
  styleUrls: ['./ocpb-online-complain-damage.component.scss']
})
export class OcpbOnlineComplainDamageComponent implements OnInit {

  public mainConponent: IssueOnlineContainerComponent;
  @Input() isView: boolean = false;
  @Input() ShowData: any = {};
  isLoading = false;
  listUploadFileformmoney = [];
  now: any;
  maxDateValue: Date = new Date();
  formmoney: any = {};
  maxSizeBuffer: number = 0;
  isAdding = true;
  ways = [
    { id: 2, text: 'ผู้เสียหาย' },
    { id: 1, text: 'ผู้ร้าย' },
  ];
  bankdatatypeselect: any = [
    { type_bank_id: 1, type_main: 'T', type_id: 'T', type_name: 'ธนาคาร' },
    {
      type_bank_id: 2,
      type_main: 'T',
      type_id: 'P',
      type_name: 'พร้อมเพย์',
    },
    {
      type_bank_id: 7,
      type_main: 'P',
      type_id: 'P',
      type_name: 'Wallet',
    },
    {
      type_bank_id: 4,
      type_main: 'P',
      type_id: 'C',
      type_name: 'เงินดิจิทัล (Cryptocurrency)',
    },
    {
      type_bank_id: 8,
      type_main: 'P',
      type_id: 'P',
      type_name: 'QR Code',
    },
    { type_bank_id: 6, type_main: 'P', type_id: 'O', type_name: 'อื่นๆ' },
  ];
  bankdatatypeselectsub: any = [
    {
      type_bank_id: 3,
      type_main: 'P',
      type_id: 'P',
      type_name: 'True Money',
    },
    { type_bank_id: 5, type_main: 'P', type_id: 'P', type_name: 'Paypal' },
    { type_bank_id: 9, type_main: 'P', type_id: 'P', type_name: 'Max Card' }
  ];
  selectNumberBankType = [
    { ID: "P", TEXT: "หมายเลขโทรศัพท์" },
    { ID: "W", TEXT: "Wallet ID" },
    { ID: "B", TEXT: "หมายเลขบัญชี" },
  ];
  emailOrNumber = "N";
  FormDataOrigin: any = {};
  bankTypeSelected: any = {};
  FormDataDestination: any = {};
  popupFormData: any = {};
  listDamageBank: any = [];
  editTransferData: any = {};

  _BankNumberPattern = /^([0-9Xx]{10,15})/;
  _prompayNumberPattern = /^([0-9]{10,13})/;

  bankInfoList: any = [];

  formData: any = {};

  popupViewFile = false;
  popupViewFileData: any = {};



  constructor(private _issueFile: IssueOnlineFileUploadService,
    private validatorService: ValidatorService,
    private servBankInfo: BankInfoService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.maxDateValue.setHours(this.maxDateValue.getHours() + 1);
    this.loadData();
    if (this.isView) {
      this.listDamageBank = this.ShowData?.CASE_MONEY;
    }
  }


  async loadData() {
    const bankData = await this.servBankInfo.GetBankInfo().toPromise();
    this.bankInfoList = bankData;
    this.FormDataOrigin.WAYS = 2;
    this.FormDataDestination.WAYS = 1;
  }

  Back(e) {
    this.mainConponent.NextIndex(this.mainConponent.indexTab - 1);
  }

  SubmitForm(e) {
    if (this.listDamageBank.length == 0) {
      Swal.fire({
        title: 'กรอกข้อมูลไม่ครบ!',
        text: `กรุณากรอกข้อมูลความเสียหาย`,
        icon: 'error',
        confirmButtonText: 'ตกลง'
      }).then(() => { });
      return;
    }
    const data = {
      CASE_MONEY: this.listDamageBank
    }
    localStorage.setItem('ocpb-damage', JSON.stringify(data));
    if (e != 'tab') {
      this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
    }
  }

  ConvertDateFullMonth(date) {
    const d = new Date(date);
    const month = d.getMonth();
    const ddate = ` ${d.getDate()} `;
    const monthFulltTh = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];
    const textMonthNow = ` ${monthFulltTh[month]}`;
    const year = d.getFullYear() + 543;
    return [ddate, " ", textMonthNow, " ", year].join("");
  }

  CheckArray(data: any = []) {
    const countArray = data.length ?? 0;
    if (countArray > 0) {
      return true;
    }
    return false;
  }

  OnSelectDate(e: any) {
    if (e.value) {
      const mydate = this.datePipe.transform(e.value, 'yyyy-MM-dd');
      const mytime = this.datePipe.transform(e.value, 'HH:mm:ss');
      this.formmoney.BANK_TRANSFER_TIME = mytime;
      this.formmoney.BANK_TRANSFER_DATE = mydate;
    }
  }

  PopupViewFile(data: any) {
    this.popupViewFile = true;
    const setData = {};
    const d = data;
    for (const key in d) {
      if (d[key] !== null && d[key] !== undefined) {
        setData[key] = d[key];
      }
    }
    this.popupViewFileData = data;
  }

  ClosePopupViewFile(e) {
    this.popupViewFile = false;
    this.popupViewFileData = {};
  }

  DownloadFile(data) {
    const linkSource = data.url;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = data.originalName;
    downloadLink.click();
  }

  async formmoneyFilesDropped(e) {
    this.listUploadFileformmoney = [];
    const files = e;
    if (files.length > 0) {
      this.isLoading = true;
      const fileCheck =
        await this._issueFile.CheckFileUploadAllowListSizeDrop(
          this.maxSizeBuffer,
          files
        );

      if (fileCheck.status) {
        this.maxSizeBuffer = fileCheck.uploadSizeAll ?? 0;
        for (const item of fileCheck.filebase64Array) {
          this.listUploadFileformmoney.push(item);
        }
      }
      this.isLoading = false;
    }
  }

  formmoneyOpenFileDialog(fileInput: HTMLInputElement) {
    fileInput.value = "";
    fileInput.click();
  }

  async formmoneyUploadFile(uploadTag) {

    this.listUploadFileformmoney = [];
    const files: any = uploadTag.files;

    if (this.isAdding) {
      if (files.length > 0) {
        this.isLoading = true;
        const fileCheck =
          await this._issueFile.CheckFileUploadAllowListSizeDialog(
            this.maxSizeBuffer,
            files
          );

        if (fileCheck.status) {
          this.maxSizeBuffer = fileCheck.uploadSizeAll ?? 0;
          for (const item of fileCheck.filebase64Array) {
            this.listUploadFileformmoney.push(item);
          }
        }

        console.log('fileupload', this.listUploadFileformmoney);
        this.isLoading = false;
      }
    } else {
      if (files.length > 0) {
        this.isLoading = true;
        const fileCheck =
          await this._issueFile.CheckFileUploadAllowListSizeDialog(
            this.maxSizeBuffer,
            files
          );

        if (fileCheck.status) {
          this.maxSizeBuffer = fileCheck.uploadSizeAll ?? 0;
          for (const item of fileCheck.filebase64Array) {
            this.listUploadFileformmoney.push(item);
            this.formmoney.MONNEY_DOC = [];
            this.formmoney.MONNEY_DOC.push(this.listUploadFileformmoney[0]);
            console.log(this.formmoney.MONNEY_DOC);
          }
        }

        console.log('fileupload', this.listUploadFileformmoney);
        this.isLoading = false;
      }
    }

  }

  ItemDamageformmoneyPopupDelete(index = null) {
    Swal.fire({
      title: "ยืนยันการลบข้อมูล?",
      text: " ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#7d7d7d",
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ตกลง",
    }).then((result) => {
      if (result.isConfirmed) {
        const file = this.listUploadFileformmoney[index];
        this.maxSizeBuffer -= file.size ?? 0;
        this.listUploadFileformmoney.splice(index, 1);
      }
    });
  }

  onCheckWays(e: any, from: string) {
    const getValue = e.value
    const diffValue = this.ways.find((item) => item.id != getValue).id
    if (from == 'Bankfirst') {
      if (this.FormDataOrigin.WAYS == getValue) {
        this.FormDataDestination.WAYS = diffValue
      }
    } else if (from == 'Bankseccond') {
      if (this.FormDataDestination.WAYS == getValue) {
        this.FormDataOrigin.WAYS = diffValue
      }
    }
  }

  OnSelectBankType(e, tag: DxSelectBoxComponent) {
    if (e.value) {
      const data = tag.instance.option('selectedItem');
      if (data) {
        this.FormDataOrigin = {
          ...this.FormDataOrigin, // เก็บค่าฟิลด์เดิม
          TYPE_MAIN: data.type_main,
          TYPE_ID: data.type_id,
          TYPE_NAME: data.type_name,
          TYPE_BANK_SUB_ID: this.FormDataOrigin.TYPE_BANK_SUB_ID,
          TRUEMONEY_TYPE: this.FormDataOrigin.TRUEMONEY_TYPE,
          BANK_ORIGIN_ACCOUNT_NAME: this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_NAME,
          BANK_MONEY_OTHER_ACCOUNT: this.FormDataOrigin.BANK_MONEY_OTHER_ACCOUNT,
          BANK_ORIGIN_ACCOUNT_NAME_PROMPAY: this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_NAME_PROMPAY,
          BANK_ORIGIN_ACCOUNT_PROMPAY: this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_PROMPAY,
        };
        this.formmoney.BANK_DAMAGE_VALUE_UNIT = this.FormDataOrigin.TYPE_BANK_ID == 1 || this.FormDataOrigin.TYPE_BANK_ID == 2 ? "บาท" : this.formmoney.BANK_DAMAGE_VALUE_UNIT;
      }
    }
  }

  AccountNameValidator(event) {
    const makeScope = new RegExp("^[A-Za-zก-๏. ]", "g");
    const result = makeScope.test(event.key);
    return result;
  }

  async checkDuplicateString(event, type: 'origin' | 'destination', input: string) {
    const seperator = /^(.)\1*$/;
    const result = seperator.test(event.value);

    if (result) {
      await Swal.fire({
        title: "ผิดพลาด!",
        html: `คุณกรอกเลขบัญชีไม่ถูกต้อง`,
        icon: "warning",
        confirmButtonText: "Ok",
      });

      const formData = type === 'origin' ? this.FormDataOrigin : this.FormDataDestination;

      if (formData[input] !== "") {
        formData[input] = "";
      }
    }
  }

  checkNumber(event) {
    const isKey = !!event.key; // ตรวจสอบว่าเป็นเหตุการณ์กดปุ่มหรือไม่
    const valueToCheck = isKey ? event.key : event.clipboardData?.getData("text") || '';

    if (!valueToCheck) {
      return false;
    }

    const regex = /^[0-9]+$/;
    return regex.test(valueToCheck);
  }



  OnSelectSubBankType(e, tag: DxSelectBoxComponent, type) {
    console.log("ประเภท Wallet", e);
    if (e.value) {
      const data = tag.instance.option('selectedItem');
      if (data) {
        if (type === 'origin') {
          this.FormDataOrigin.TYPE_BANK_SUB_NAME = data.type_name;
        } else {
          this.FormDataDestination.TYPE_BANK_SUB_NAME = data.type_name;
        }
      }
    }
  }

  OnSelecttruemoneyType(e, tag: DxSelectBoxComponent, type) {
    console.log("ประเภทการโอน", e);
    if (e.value) {
      const data = tag.instance.option('selectedItem');
      if (data) {
        if (type === 'origin') {
          this.FormDataOrigin.TRUEMONEY_TYPE = data.ID;
          this.FormDataOrigin.TRUEMONEY_TYPE_NAME = data.TEXT;
        } else {
          this.FormDataDestination.TRUEMONEY_TYPE = data.ID;
          this.FormDataDestination.TRUEMONEY_TYPE_NAME = data.TEXT;
        }
      } else {
      }
    }
  }

  InputConidtions(event: any): boolean {
    let d = this.popupFormData.BANK_MONEY_OTHER_ID;

    switch (d) {
      case 'T':
        return this.validatorService.validateTrueMoney(event, this.bankTypeSelected);
      case 'C':
        return this.validatorService.validateCrypto(event);
      case 'P':
        return this.validatorService.validateEmailOrNumber(event);
      default:
        // Fallback for Wallet and QR Code
        if (this.FormDataOrigin?.TYPE_NAME === 'Wallet' || this.FormDataDestination?.TYPE_NAME === 'Wallet') {
          return this.validatorService.validateWallet(event);
        } else if (this.FormDataOrigin?.TYPE_NAME === 'QR Code' || this.FormDataDestination?.TYPE_NAME === 'QR Code') {
          return this.validatorService.validateQRCode(event);
        }
        return true;
    }
  }

  OnSelectBankTypevalian(e, tag: DxSelectBoxComponent) {
    if (e.value) {
      const data = tag.instance.option('selectedItem');
      if (data) {
        this.FormDataDestination = {
          ...this.FormDataDestination, // เก็บค่าฟิลด์เดิม
          TYPE_MAIN: data.type_main,
          TYPE_ID: data.type_id,
          TYPE_NAME: data.type_name,
          TYPE_BANK_SUB_ID: this.FormDataDestination.TYPE_BANK_SUB_ID,
          TRUEMONEY_TYPE: this.FormDataDestination.TRUEMONEY_TYPE,
          BANK_ORIGIN_ACCOUNT_NAME: this.FormDataDestination.BANK_ORIGIN_ACCOUNT_NAME,
          BANK_MONEY_OTHER_ACCOUNT: this.FormDataDestination.BANK_MONEY_OTHER_ACCOUNT,
          BANK_ORIGIN_ACCOUNT_NAME_PROMPAY: this.FormDataDestination.BANK_ORIGIN_ACCOUNT_NAME_PROMPAY,
          BANK_ORIGIN_ACCOUNT_PROMPAY: this.FormDataDestination.BANK_ORIGIN_ACCOUNT_PROMPAY,
          BANK_ACCOUNT_NAME: this.FormDataDestination.BANK_ACCOUNT_NAME,
        };
      }
    }
  }

  OnSelectBankAccount(e, tag: DxSelectBoxComponent, type: 'origin' | 'destination') {
    if (!e.value) {
      return;
    }

    const destination = type === 'origin' ? this.FormDataOrigin : this.FormDataDestination;
    const data = tag.instance.option('selectedItem');

    if (data) {
      destination.BANK_ID = data.BANK_ID;
      destination.BANK_NAME = data.BANK_NAME;
    } else {
      destination.BANK_ID = e.value;
    }
  }

  async formmoneyUploadFileDataGrid(uploadTag, index) {
    console.log(index);
    this.listUploadFileformmoney = [];
    const files: any = uploadTag.files;
    if (files.length > 0) {
      this.isLoading = true;
      const fileCheck =
        await this._issueFile.CheckFileUploadAllowListSizeDialog(
          this.maxSizeBuffer,
          files
        );

      if (fileCheck.status) {
        this.maxSizeBuffer = fileCheck.uploadSizeAll ?? 0;
        for (const item of fileCheck.filebase64Array) {
          this.listDamageBank[index].MONNEY_DOC = [];
          this.listDamageBank[index].MONNEY_DOC.push(item);
        }
      }
      this.isLoading = false;
    }
  }

  CheckSammaryValue(num: any): any {
    if (num) {
      const number = parseFloat(num).toFixed(2);
      return number
    }
    return 0;
  }

  async OS_ItemDamageSubEdit(index = null, data = {} as any) {
    this.now = null;
    this.isAdding = false;
    this.editTransferData = { ...data, index };

    await this.setDataEdit(data);
    this.formmoney.BANK_TRANSFER_DATE = data.BANK_TRANSFER_DATE;
    this.formmoney.BANK_TRANSFER_TIME = data.BANK_TRANSFER_TIME;
    this.formmoney.BANK_DAMAGE_VALUE = data.BANK_DAMAGE_VALUE;
    this.formmoney.DIRECTION = data.DIRECTION;
    this.formmoney.BANK_REMARK = data.BANK_REMARK;
    this.formmoney.BANK_DAMAGE_VALUE_UNIT = data.BANK_DAMAGE_VALUE_UNIT;
    this.formmoney.BANK_DAMAGE_VALUE_BAHT = data.BANK_DAMAGE_VALUE_BAHT ?? 0;
    this.formmoney.MONNEY_DOC = data.MONNEY_DOC;
    if (data.MONNEY_DOC) {
      if (data.MONNEY_DOC.length > 0) {
        this.listUploadFileformmoney.push(data.MONNEY_DOC[0]);
      }
    }
    const date = this.convertDate(this.formmoney.BANK_TRANSFER_DATE, this.formmoney.BANK_TRANSFER_TIME);
    this.now = new Date(date[0], date[1], date[2], date[3], date[4], date[5]);
  }

  setDataEdit(data: any) {
    this.FormDataOrigin.WAYS = data.WAYS_ORIGIN;
    this.FormDataDestination.WAYS = data.WAYS_DESTINATION;
    if (data.TYPE_BANK_ID == 1) {
      this.FormDataOrigin.TYPE_BANK_ID = data.TYPE_BANK_ID;
      this.FormDataOrigin.BANK_ORIGIN_ACCOUNT = data.BANK_ORIGIN_ACCOUNT;
      this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_NAME = data.BANK_ORIGIN_ACCOUNT_NAME;
      this.FormDataOrigin.BANK_ORIGIN_ID = data.BANK_ORIGIN_ID;
      this.FormDataOrigin.BANK_NAME = data.BANK_NAME;
      this.FormDataOrigin.SHOW_NAME = data.SHOW_NAME;
      this.FormDataOrigin.BANK_ORIGIN_MONEY_REMARK = data.BANK_ORIGIN_MONEY_REMARK;
    } else if (data.TYPE_BANK_ID == 2) {
      this.FormDataOrigin.TYPE_BANK_ID = data.TYPE_BANK_ID;
      this.FormDataOrigin.BANK_ORIGIN_ACCOUNT = data.BANK_ORIGIN_ACCOUNT;
      this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_NAME_PROMPAY = data.BANK_ORIGIN_ACCOUNT_NAME;
      this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_PROMPAY = data.BANK_ORIGIN_ACCOUNT;
      this.FormDataOrigin.SHOW_NAME = data.SHOW_NAME;
      this.FormDataOrigin.WAYS = data.WAYS_ORIGIN;
    } else {
      this.FormDataOrigin.TYPE_BANK_SUB_NAME = data.TYPE_BANK_ID == 3 ? "True Money" : data.TYPE_BANK_ID == 5 ? "Paypal" : data.TYPE_BANK_ID == 9 ? "Max Card" : null;
      this.FormDataOrigin.TYPE_BANK_ID = data.TYPE_BANK_ID == 5 || data.TYPE_BANK_ID == 3 || data.TYPE_BANK_ID == 9 ? 7 : data.TYPE_BANK_ID;
      this.FormDataOrigin.BANK_MONEY_OTHER_ACCOUNT = data.BANK_ORIGIN_ACCOUNT;
      this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_NAME = data.BANK_ORIGIN_ACCOUNT_NAME;
      this.FormDataOrigin.SHOW_NAME = data.SHOW_NAME;
      this.FormDataOrigin.TRUEMONEY_TYPE = data.TRUEMONEY_OG_TYPE;
      this.FormDataOrigin.TYPE_BANK_SUB_ID = data.TYPE_BANK_ID == 5 || data.TYPE_BANK_ID == 3 || data.TYPE_BANK_ID == 9 ? data.TYPE_BANK_ID : null;

    }

    if (data.TYPE_DESTINATION_BANK_ID == 1) {
      this.FormDataDestination.TYPE_BANK_ID = data.TYPE_DESTINATION_BANK_ID;
      this.FormDataDestination.BANK_ID = data.BANK_ID;
      this.FormDataDestination.BANK_ACCOUNT = data.BANK_ACCOUNT;
      this.FormDataDestination.BANK_ACCOUNT_NAME = data.BANK_ACCOUNT_NAME;
      this.FormDataDestination.BANK_NAME = data.BANK_NAME;
      this.FormDataDestination.SHOW_NAME = data.SHOW_NAME_END;
      this.FormDataDestination.WAYS = data.WAYS_DESTINATION;
      this.FormDataDestination.BANK_MONEY_REMARK = data.BANK_MONEY_REMARK;
    } else if (data.TYPE_DESTINATION_BANK_ID == 2) {
      this.FormDataDestination.TYPE_BANK_ID = data.TYPE_DESTINATION_BANK_ID;
      this.FormDataDestination.BANK_ID = data.TYPE_BANK_ID;
      this.FormDataDestination.BANK_ORIGIN_ACCOUNT = data.BANK_ACCOUNT;
      this.FormDataDestination.BANK_ORIGIN_ACCOUNT_NAME_PROMPAY = data.BANK_ACCOUNT_NAME;
      this.FormDataDestination.BANK_ORIGIN_ACCOUNT_PROMPAY = data.BANK_ACCOUNT;
      this.FormDataDestination.SHOW_NAME = data.SHOW_NAME_END;
      this.FormDataDestination.WAYS = data.WAYS_DESTINATION;
    } else {
      this.FormDataDestination.TYPE_BANK_SUB_NAME = data.TYPE_DESTINATION_BANK_ID == 3 ? "True Money" : data.TYPE_DESTINATION_BANK_ID == 5 ? "Paypal" : data.TYPE_DESTINATION_BANK_ID == 9 ? "Max Card" : null;
      this.FormDataDestination.TYPE_BANK_ID = data.TYPE_DESTINATION_BANK_ID == 5 || data.TYPE_DESTINATION_BANK_ID == 3 || data.TYPE_DESTINATION_BANK_ID == 9 ? 7 : data.TYPE_DESTINATION_BANK_ID;
      this.FormDataDestination.BANK_MONEY_OTHER_ACCOUNT = data.BANK_ACCOUNT;
      this.FormDataDestination.SHOW_NAME = data.SHOW_NAME_END;
      this.FormDataDestination.TRUEMONEY_TYPE = data.TRUEMONEY_DES_TYPE;
      this.FormDataDestination.BANK_MONEY_OTHER_ACCOUNT = data.BANK_ACCOUNT;
      this.FormDataDestination.BANK_ACCOUNT_NAME = data.BANK_ACCOUNT_NAME;
      this.FormDataDestination.TYPE_BANK_SUB_ID = data.TYPE_DESTINATION_BANK_ID == 5 || data.TYPE_DESTINATION_BANK_ID == 3 || data.TYPE_DESTINATION_BANK_ID == 9 ? data.TYPE_DESTINATION_BANK_ID : null;
    }

    console.log(this.FormDataOrigin);
    console.log(this.FormDataDestination);

  }

  convertDate(date, time) {
    const dateIN = String(date + " " + time);
    const [datePart, timePart] = dateIN.split(" ");
    const [year, month, day] = datePart.split("-");
    const [hours, minutes, seconds] = timePart.split(":");
    return [Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds)]
  }

  ItemDamageSubDelete(index, subIndex, type) {
    console.log(this.listDamageBank[index])
    Swal.fire({
      title: "ยืนยันการลบไฟล์?",
      text: " ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#7d7d7d",
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ตกลง",
    }).then((result) => {
      if (result.isConfirmed) {
        if (type === "T") {
          const dmValueItem = this.listDamageBank[index].BANK_DAMAGE_VALUE ?? 0;
          const numfloat = parseFloat(dmValueItem);

          if (dmValueItem > 0) {
            const SumAll = parseFloat(this.listDamageBank[index].BANK_DAMAGE_VALUE);
            const samary: any = SumAll - numfloat;
            this.listDamageBank[index].BANK_DAMAGE_VALUE = parseFloat(samary).toFixed(2);
          }
          this.listDamageBank.splice(index, 1);

        }

        this.calulatemoney([...this.listDamageBank]);
      }
    });
  }

  calulatemoney(data) {
    //calculate money
    const cehckorigin1 = data.filter(x => x.WAYS_ORIGIN == 1);
    const cehckorigin2 = data.filter(x => x.WAYS_ORIGIN == 2);
    let sumvillan = 0.0;
    let sumpersonal = 0.0;
    if (cehckorigin1) {
      cehckorigin1.forEach(element => {
        sumvillan = Number(sumvillan) + Number(element.BANK_DAMAGE_VALUE);
      });
    }
    if (cehckorigin2) {
      cehckorigin2.forEach(element => {
        sumpersonal = Number(sumpersonal) + Number(element.BANK_DAMAGE_VALUE);
      });
    }
    const summoney = sumpersonal - sumvillan;
    if (summoney < 0) {
      this.formData.CASE_MONEY_DAMAGE_VALUE = 0;
    }
    else {
      this.formData.CASE_MONEY_DAMAGE_VALUE = summoney;

    }
    if (summoney < 0) {
      this.formData.CASE_MONEY_DAMAGE_VALUE = 0;
    }
    else {
      this.formData.CASE_MONEY_DAMAGE_VALUE = summoney;
    }
    if (this.formData.CASE_MONEY_DAMAGE_VALUE < 0) {
      this.formData.CASE_MONEY_DAMAGE_VALUE = 0;
    }
  }

  onresetbanklist() {
    this.isAdding = true;
    this.editTransferData = {}
    this.formmoney = {};
    this.FormDataOrigin = {};
    this.FormDataDestination = {};
    this.now = null;
    this.listUploadFileformmoney = [];
    this.FormDataOrigin.WAYS = 2
    this.FormDataDestination.WAYS = 1
  }

  onsavelistbanklist(tag: DxFormComponent, tag2: DxFormComponent, tag3: DxFormComponent) {
    console.log(this.FormDataOrigin);
    console.log(this.FormDataDestination);
    if (this.FormDataDestination.WAYS == this.FormDataOrigin.WAYS) {
      Swal.fire({
        title: "ผิดพลาด!",
        html: "บัญชีต้นทางและปลายทางไม่ถูกต้อง" + '<br>' + "กรุณาตรวจสอบเส้นทางการทำธุรกรรมให้ถูกต้อง",
        icon: "warning",
        confirmButtonText: "Ok",
      }).then(() => {
        this.formmoney.BANK_LIST_ID = null;
        this.formmoney.BANK_ORIGIN_LIST_ID = null;
      });
      return
    }
    if (!tag.instance.validate().isValid) {
      Swal.fire({
        title: "ผิดพลาด!",
        html: "กรุณากรอกข้อมูลบัญชีต้นทางให้ครบ",
        icon: "warning",
        confirmButtonText: "Ok",
      }).then(() => { });
      return
    }
    if (!tag2.instance.validate().isValid) {
      Swal.fire({
        title: "ผิดพลาด!",
        html: "กรุณากรอกข้อมูลบัญชีปลายทางให้ครบ",
        icon: "warning",
        confirmButtonText: "Ok",
      }).then(() => { });
      return
    }
    if (!tag3.instance.validate().isValid) {
      Swal.fire({
        title: "ผิดพลาด!",
        html: "กรุณากรอกข้อมูลความเสียหายให้ครบ",
        icon: "warning",
        confirmButtonText: "Ok",
      }).then(() => { });
      return
    }
    if (this.checkEntryOrNull(this.formmoney.BANK_TRANSFER_DATE) || this.checkEntryOrNull(this.formmoney.BANK_TRANSFER_TIME)) {
      this.now = null;
      Swal.fire({
        title: "ผิดพลาด!",
        html: "กรุณากรอกเลือกวันที่เกิดความเสียหายให้ถูกต้อง",
        icon: "warning",
        confirmButtonText: "Ok",
      }).then(() => { });
      return
    }

    this.bindDataBank();

    this.listDamageBank.push(this.formmoney);
    this.calulatemoney([...this.listDamageBank]);
    this.onresetbanklist();
  }

  checkEntryOrNull(input) {
    if (input == null || input == undefined) {
      return true;
    }
    return false;
  }

  onEditlistbanklist(tag: DxFormComponent, tag2: DxFormComponent, tag3: DxFormComponent) {
    if (this.FormDataDestination.WAYS == this.FormDataOrigin.WAYS) {
      Swal.fire({
        title: "ผิดพลาด!",
        html: "บัญชีต้นทางและปลายทางไม่ถูกต้อง" + '<br>' + "กรุณาตรวจสอบเส้นทางการทำธุรกรรมให้ถูกต้อง",
        icon: "warning",
        confirmButtonText: "Ok",
      }).then(() => {
        this.formmoney.BANK_LIST_ID = null;
        this.formmoney.BANK_ORIGIN_LIST_ID = null;
      });
      return
    }
    if (!tag.instance.validate().isValid) {
      Swal.fire({
        title: "ผิดพลาด!",
        html: "กรุณากรอกข้อมูลบัญชีต้นทางให้ครบ",
        icon: "warning",
        confirmButtonText: "Ok",
      }).then(() => { });
      return
    }
    if (!tag2.instance.validate().isValid) {
      Swal.fire({
        title: "ผิดพลาด!",
        html: "กรุณากรอกข้อมูลบัญชีปลายทางให้ครบ",
        icon: "warning",
        confirmButtonText: "Ok",
      }).then(() => { });
      return
    }
    if (!tag3.instance.validate().isValid) {
      Swal.fire({
        title: "ผิดพลาด!",
        html: "กรุณากรอกข้อมูลความเสียหายให้ครบ",
        icon: "warning",
        confirmButtonText: "Ok",
      }).then(() => { });
      return
    }
    if (this.checkEntryOrNull(this.formmoney.BANK_TRANSFER_DATE) || this.checkEntryOrNull(this.formmoney.BANK_TRANSFER_TIME)) {
      this.now = null;
      Swal.fire({
        title: "ผิดพลาด!",
        html: "กรุณากรอกเลือกวันที่เกิดความเสียหายให้ถูกต้อง",
        icon: "warning",
        confirmButtonText: "Ok",
      }).then(() => { });
      return
    }

    this.bindDataBank();

    this.listDamageBank[this.editTransferData.index] = this.formmoney;
    this.calulatemoney([...this.listDamageBank]);

    this.onresetbanklist()
  }

  bindDataBank() {
    this.FormDataOrigin.TYPE_NAME = this.FormDataOrigin.TYPE_BANK_ID === 7 ? this.FormDataOrigin.TYPE_BANK_SUB_NAME : this.FormDataOrigin.TYPE_NAME;
    this.FormDataDestination.TYPE_NAME = this.FormDataDestination.TYPE_BANK_ID === 7 ? this.FormDataDestination.TYPE_BANK_SUB_NAME : this.FormDataDestination.TYPE_NAME;

    this.outputdatabank(this.FormDataOrigin);
    this.outputdatabankvillain(this.FormDataDestination);

    this.formmoney.TYPE_BANK_ID = this.FormDataOrigin.TYPE_BANK_ID === 7 ? this.FormDataOrigin.TYPE_BANK_SUB_ID : this.FormDataOrigin.TYPE_BANK_ID;
    this.formmoney.BANK_ORIGIN_ACCOUNT = this.FormDataOrigin.BANK_ACCOUNT ? this.FormDataOrigin.BANK_ACCOUNT : this.FormDataOrigin.BANK_ORIGIN_ACCOUNT ? this.FormDataOrigin.BANK_ORIGIN_ACCOUNT : this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_PROMPAY ? this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_PROMPAY : this.FormDataOrigin.BANK_MONEY_OTHER_ACCOUNT;
    this.formmoney.BANK_ORIGIN_ACCOUNT_NAME = this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_NAME ? this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_NAME : this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_NAME_PROMPAY ? this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_NAME_PROMPAY : null
    this.formmoney.BANK_ORIGIN_ID = this.FormDataOrigin.BANK_ID;
    this.formmoney.BANK_ORIGIN_NAME = this.FormDataOrigin.BANK_NAME;
    this.formmoney.SHOW_NAME = this.FormDataOrigin.SHOW_NAME
    this.formmoney.WAYS_ORIGIN = this.FormDataOrigin.WAYS
    this.formmoney.BANK_ORIGIN_MONEY_REMARK = this.FormDataOrigin.BANK_ORIGIN_MONEY_REMARK;
    this.formmoney.TRUEMONEY_OG_TYPE = this.FormDataOrigin.TRUEMONEY_TYPE ?? null;

    this.formmoney.TYPE_DESTINATION_BANK_ID = this.FormDataDestination.TYPE_BANK_ID === 7 ? this.FormDataDestination.TYPE_BANK_SUB_ID : this.FormDataDestination.TYPE_BANK_ID;
    this.formmoney.BANK_ACCOUNT = this.FormDataDestination.BANK_ACCOUNT ? this.FormDataDestination.BANK_ACCOUNT : this.FormDataDestination.BANK_ORIGIN_ACCOUNT ? this.FormDataDestination.BANK_ORIGIN_ACCOUNT : this.FormDataDestination.BANK_ORIGIN_ACCOUNT_PROMPAY ? this.FormDataDestination.BANK_ORIGIN_ACCOUNT_PROMPAY : this.FormDataDestination.BANK_MONEY_OTHER_ACCOUNT
    this.formmoney.BANK_ACCOUNT_NAME = this.FormDataDestination.BANK_ACCOUNT_NAME ? this.FormDataDestination.BANK_ACCOUNT_NAME : this.FormDataDestination.BANK_ORIGIN_ACCOUNT_NAME_PROMPAY ? this.FormDataDestination.BANK_ORIGIN_ACCOUNT_NAME_PROMPAY : null
    this.formmoney.BANK_ID = this.FormDataDestination.BANK_ID;
    this.formmoney.BANK_NAME = this.FormDataDestination.BANK_NAME;
    this.formmoney.SHOW_NAME_END = this.FormDataDestination.SHOW_NAME;
    this.formmoney.WAYS_DESTINATION = this.FormDataDestination.WAYS;
    this.formmoney.BANK_MONEY_REMARK = this.FormDataDestination.BANK_MONEY_REMARK;
    this.formmoney.TRUEMONEY_DES_TYPE = this.FormDataDestination.TRUEMONEY_TYPE ?? null;

    this.formmoney.CASE_MONEY_CHANNEL_TYPE = this.FormDataOrigin.TYPE_MAIN;
    this.formmoney.CASE_MONEY_BANK_TRANFER = this.FormDataOrigin.TYPE_ID;
    this.formmoney.CASE_MONEY_BANK_TRANFER_NAME = this.FormDataOrigin.TYPE_NAME;

    if (this.FormDataOrigin.TYPE_ID !== 'T') {
      this.formmoney.BANK_MONEY_OTHER_ID = this.FormDataOrigin.TYPE_ID;
      this.formmoney.BANK_MONEY_OTHER_NAME = this.FormDataOrigin.TYPE_NAME;
    }

    this.formmoney.MONNEY_DOC = [];
    if (this.listUploadFileformmoney.length > 0) {
      this.formmoney.MONNEY_DOC.push(this.listUploadFileformmoney[0]);
    }
  }


  outputdatabank(value) {
    console.log('submit sufferer', value);
    const typeNameMapping: Record<string, Record<number, string>> = {
      'ธนาคาร': {
        1: '(ธนาคาร ผู้ร้าย)',
        2: '(ธนาคาร ผู้เสียหาย)',
      },
      'พร้อมเพย์': {
        1: '(พร้อมเพย์ ผู้ร้าย)',
        2: '(พร้อมเพย์ ผู้เสียหาย)',
      },
      'True Money': {
        1: '(True Money ผู้ร้าย)',
        2: '(True Money ผู้เสียหาย)',
      },
      'เงินดิจิทัล (Cryptocurrency)': {
        1: '(Cryptocurrency ผู้ร้าย)',
        2: '(Cryptocurrency ผู้เสียหาย)',
      },
      'อื่นๆ': {
        1: '(อื่นๆ ผู้ร้าย)',
        2: '(อื่นๆ ผู้เสียหาย)',
      },
      'QR Code': {
        1: '(QR Code ผู้ร้าย)',
        2: '(QR Code ผู้เสียหาย)',
      },
      'Max Card': {
        1: '(Max Card ผู้ร้าย)',
        2: '(Max Card ผู้เสียหาย)',
      },
      'Paypal': {
        1: '(Paypal ผู้ร้าย)',
        2: '(Paypal ผู้เสียหาย)',
      },
    };
    const prefix = typeNameMapping[value.TYPE_NAME]?.[value.WAYS] || '';
    if (value.TYPE_NAME == "True Money") {
      value.TRUEMONEY_TYPE_NAME = !value.TRUEMONEY_TYPE_NAME ? value.TRUEMONEY_TYPE == "P" ? "หมายเลขโทรศัพท์" : value.TRUEMONEY_TYPE == "W" ? "Wallet ID" : value.TRUEMONEY_TYPE == "B" ? "หมายเลขบัญชี" : "" : value.TRUEMONEY_TYPE_NAME;
    }
    if (prefix) {
      switch (value.TYPE_NAME) {
        case 'ธนาคาร':
          value.SHOW_NAME = `${prefix}${value.BANK_NAME}: ${value.BANK_ORIGIN_ACCOUNT} ${value.BANK_ORIGIN_ACCOUNT_NAME}`;
          break;

        case 'พร้อมเพย์':
          value.SHOW_NAME = `${prefix}${value.BANK_ORIGIN_ACCOUNT_PROMPAY} ${value.BANK_ORIGIN_ACCOUNT_NAME_PROMPAY}`;
          value.BANK_ORIGIN_ACCOUNT = value.BANK_ORIGIN_ACCOUNT_PROMPAY;
          break;

        case 'True Money':
          value.SHOW_NAME = `${prefix}${value.BANK_MONEY_OTHER_ACCOUNT} ${value.BANK_ORIGIN_ACCOUNT_NAME || ''} (${value.TRUEMONEY_TYPE_NAME || ''})`;
          value.BANK_ORIGIN_ACCOUNT = value.BANK_MONEY_OTHER_ACCOUNT;
          break;

        case 'เงินดิจิทัล (Cryptocurrency)':
        case 'อื่นๆ':
        case 'QR Code':
        case 'Max Card':
        case 'Paypal':
          value.SHOW_NAME = `${prefix}${value.BANK_MONEY_OTHER_ACCOUNT} ${value.BANK_ORIGIN_ACCOUNT_NAME || ''}`;
          value.BANK_ORIGIN_ACCOUNT = value.BANK_MONEY_OTHER_ACCOUNT;
          break;

        default:
          break;
      }
    }

    this.FormDataOrigin.SHOW_NAME = value["SHOW_NAME"];
    this.FormDataOrigin.BANK_ORIGIN_ACCOUNT = value["BANK_ORIGIN_ACCOUNT"];
  }
  outputdatabankvillain(value) {
    console.log('submit origin', value);
    const typeNameMapping: Record<string, Record<number, string>> = {
      'ธนาคาร': {
        1: '(ธนาคาร ผู้ร้าย)',
        2: '(ธนาคาร ผู้เสียหาย)',
      },
      'พร้อมเพย์': {
        1: '(พร้อมเพย์ ผู้ร้าย)',
        2: '(พร้อมเพย์ ผู้เสียหาย)',
      },
      'True Money': {
        1: '(True Money ผู้ร้าย)',
        2: '(True Money ผู้เสียหาย)',
      },
      'เงินดิจิทัล (Cryptocurrency)': {
        1: '(Cryptocurrency ผู้ร้าย)',
        2: '(Cryptocurrency ผู้เสียหาย)',
      },
      'อื่นๆ': {
        1: '(อื่นๆ ผู้ร้าย)',
        2: '(อื่นๆ ผู้เสียหาย)',
      },
      'QR Code': {
        1: '(QR Code ผู้ร้าย)',
        2: '(QR Code ผู้เสียหาย)',
      },
      'Max Card': {
        1: '(Max Card ผู้ร้าย)',
        2: '(Max Card ผู้เสียหาย)',
      },
      'Paypal': {
        1: '(Paypal ผู้ร้าย)',
        2: '(Paypal ผู้เสียหาย)',
      },
    };
    const prefix = typeNameMapping[value.TYPE_NAME]?.[value.WAYS] || '';
    if (value.TYPE_NAME == "True Money") {
      value.TRUEMONEY_TYPE_NAME = !value.TRUEMONEY_TYPE_NAME ? value.TRUEMONEY_TYPE == "P" ? "หมายเลขโทรศัพท์" : value.TRUEMONEY_TYPE == "W" ? "Wallet ID" : value.TRUEMONEY_TYPE == "B" ? "หมายเลขบัญชี" : "" : value.TRUEMONEY_TYPE_NAME;
    }
    if (prefix) {
      switch (value.TYPE_NAME) {
        case 'ธนาคาร':
          value.SHOW_NAME = `${prefix}${value.BANK_NAME}: ${value.BANK_ACCOUNT} ${value.BANK_ACCOUNT_NAME}`;
          value.BANK_ACCOUNT = value.BANK_ACCOUNT;
          break;

        case 'พร้อมเพย์':
          value.SHOW_NAME = `${prefix}${value.BANK_ORIGIN_ACCOUNT_PROMPAY} ${value.BANK_ORIGIN_ACCOUNT_NAME_PROMPAY}`;
          value.BANK_ACCOUNT = value.BANK_ORIGIN_ACCOUNT_PROMPAY;
          break;

        case 'True Money':
          value.SHOW_NAME = `${prefix}${value.BANK_MONEY_OTHER_ACCOUNT} ${value.BANK_ACCOUNT_NAME || ''} (${value.TRUEMONEY_TYPE_NAME || ''})`;
          value.BANK_ACCOUNT = value.BANK_MONEY_OTHER_ACCOUNT;
          break;

        case 'เงินดิจิทัล (Cryptocurrency)':
        case 'อื่นๆ':
        case 'QR Code':
        case 'Max Card':
        case 'Paypal':
          value.SHOW_NAME = `${prefix}${value.BANK_MONEY_OTHER_ACCOUNT} ${value.BANK_ACCOUNT_NAME || ''}`;
          value.BANK_ACCOUNT = value.BANK_MONEY_OTHER_ACCOUNT;
          break;

        default:
          break;
      }
    }
    this.FormDataDestination.SHOW_NAME = value["SHOW_NAME"];
    this.FormDataDestination.BANK_ACCOUNT = value["BANK_ACCOUNT"];
  }


  // OnSelectBankType(e, tag: DxSelectBoxComponent) {
  //   if (e.value) {
  //     const data = tag.instance.option('selectedItem');
  //     if (data) {
  //       this.FormDataOrigin = {
  //         ...this.FormDataOrigin, // เก็บค่าฟิลด์เดิม
  //         TYPE_MAIN: data.type_main,
  //         TYPE_ID: data.type_id,
  //         TYPE_NAME: data.type_name,
  //         TYPE_BANK_SUB_ID: this.firstLoadEditOrigin ? this.FormDataOrigin.TYPE_BANK_SUB_ID : null,
  //         TRUEMONEY_TYPE: this.firstLoadEditOrigin ? this.FormDataOrigin.TRUEMONEY_TYPE : null,
  //         BANK_ORIGIN_ACCOUNT_NAME: this.firstLoadEditOrigin ? this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_NAME : null,
  //         BANK_MONEY_OTHER_ACCOUNT: this.firstLoadEditOrigin ? this.FormDataOrigin.BANK_MONEY_OTHER_ACCOUNT : null,
  //         BANK_ORIGIN_ACCOUNT_NAME_PROMPAY: this.firstLoadEditOrigin ? this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_NAME_PROMPAY : null,
  //         BANK_ORIGIN_ACCOUNT_PROMPAY: this.firstLoadEditOrigin ? this.FormDataOrigin.BANK_ORIGIN_ACCOUNT_PROMPAY : null,
  //       };
  //       this.formmoney.BANK_DAMAGE_VALUE_UNIT = this.FormDataOrigin.TYPE_BANK_ID == 1 || this.FormDataOrigin.TYPE_BANK_ID == 2 ? "บาท" : this.formmoney.BANK_DAMAGE_VALUE_UNIT;
  //       if (this.FormDataDestination.TYPE_BANK_ID == 4 || this.FormDataOrigin.TYPE_BANK_ID == 4) {
  //         this.show_value = true;
  //         this.isOtherRequired = false;
  //       } else {
  //         this.show_value = false;
  //         this.isOtherRequired = true;
  //       }
  //       this.show_value =
  //         [4].includes(this.FormDataDestination?.TYPE_BANK_ID) ||
  //         [4].includes(this.FormDataOrigin?.TYPE_BANK_ID);
  //       this.firstLoadEditOrigin = false;
  //     }
  //   }
  // }

}