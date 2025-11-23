import { Component, OnInit } from '@angular/core';
import { DxFormComponent, DxSelectBoxComponent, DxSelectBoxModule } from 'devextreme-angular';
import { dxDateBoxOptions } from 'devextreme/ui/date_box';
import { dxNumberBoxOptions } from 'devextreme/ui/number_box';
import { dxSelectBoxOptions } from 'devextreme/ui/select_box';
import dxTextBox, { dxTextBoxOptions } from 'devextreme/ui/text_box';
import { BankInfoService } from 'src/app/services/bank-info.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-issue-online-damage-new',
  templateUrl: './issue-online-damage-new.component.html',
  styleUrls: ['./issue-online-damage-new.component.scss']
})
export class IssueOnlineDamageNewComponent implements OnInit {

  // formboxDamageType1: DxFormComponent;
  listDamageType: any[] = [
    { id: 1, name: 'โอนเงินผ่านบัญชีธนาคาร', selected: false },
    { id: 2, name: 'โอน/ซื้อสินทรัพย์ดิจิทัล (คริปโทฯ)', selected: false },
    { id: 3, name: 'โอนเงินผ่านบัญชีเงินอิเล็กทรอนิกส์ (e-Wallet)', selected: false },
    { id: 4, name: 'ซื้อบัตรเงินสด/บัตรของขวัญ', selected: false },
    { id: 5, name: 'ข้อมูลบัตรเครดิต/เดบิตของฉันถูกนำไปใช้', selected: false }
  ];
  listTransferMethod : any[] = [
    { id: 1, name: 'ATM', value: 'ATM' },
    { id: 2, name: 'Internet Banking', value: 'Internet Banking' },
    { id: 3, name: 'Mobile Banking', value: 'Mobile Banking' },
    { id: 4, name: 'Counter Service', value: 'Counter Service' },
    { id: 5, name: 'อื่นๆ', value: 'อื่นๆ' },
  ];
  bankInfoList: any[] = [];
  listDamgeValueType1: any[] = [];
  listDamgeValueType2: any[] = [];
  listDamgeValueType3: any[] = [];
  listDamgeValueType4: any[] = [];
  listDamgeValueType5: any[] = [];
  formDamageType1: any = {};
  formDamageType2: any = {};
  formDamageType3: any = {};
  formDamageType4: any = {};
  formDamageType5: any = {};

  // ZONE : Bank SelectBox Editor Options
  bankOriginLabel = { text: 'ชื่อธนาคารต้นทาง' };
  bankDestLabel = { text: 'ชื่อธนาคารปลายทาง' };
  bankAccountLabel = { text: 'เลขบัญชีต้นทาง' };
  bankAccountDestLabel = { text: 'เลขบัญชีปลายทาง' };
  damageBankBathLabel = { text: 'จำนวนเงินที่โอน' };
  dateTransferLabel = { text: 'วันที่โอนเงิน' };
  transferMethodLabel = { text: 'วิธีการโอนเงิน' };
  bankOriginEditorOptions: dxSelectBoxOptions;
  bankDestEditorOptions: dxSelectBoxOptions;
  bankAccountOriginEditorOptions: dxTextBoxOptions;
  bankAccountDestEditorOptions: dxTextBoxOptions;
  damageBankBathEditorOptions: dxNumberBoxOptions;
  dateTransferEditorOptions: dxDateBoxOptions;
  transferMethodEditorOptions: dxSelectBoxOptions;
  // END ZONE

  //  ZONE : Crypto SelectBox Editor Options
  CryptoExchangeLabel = { text: 'คุณโอนจาก Exchange ใด (ถ้ามี)?' };
  CryptoUnitLabel = { text: 'สกุลเงินดิจิทัลที่โอน' };
  CryptoNetworkLabel = { text: 'เครือข่าย (Blockchain Network) ที่ใช้โอน' };
  CryptoDestAddressLabel = { text: 'ที่อยู่ Wallet ปลายทาง (Destination Address)' };
  CryptoAmountLabel = { text: 'จำนวนเหรียญที่โอน' };
  CryptoTransactionIdLabel = { text: 'Transaction ID (TxID / Hash) (ถ้ามี)' };
  // END ZONE
  
  // ZONE : E-Wallet SelectBox Editor Options
  EwalletServiceLabel = { text: 'ผู้ให้บริการ e-Wallet ปลายทาง' };
  EwalletAccountLabel = { text: 'เบอร์โทรศัพท์หรือ ID ของบัญชีปลายทาง' };
  EwalletNameLabel = { text: 'ชื่อบัญชีปลายทาง (ถ้าทราบ)' };
  EwalletAmountLabel = { text: 'จำนวนเงิน (บาท)' };
  EwalletDateTransferLabel = { text: 'วันที่/เวลาที่โอน' };
  // END ZONE

  // ZONE : Gift Card SelectBox Editor Options
  GiftCardTypeLabel = { text: 'ประเภทของบัตร' };
  GiftCardAmountLabel = { text: 'มูลค่าบัตร (บาท)' };
  GiftCardCodeLabel = { text: 'หมายเลขบัตร/รหัสที่ส่งให้คนร้าย (ถ้ามี)' };
  // END ZONE

  //  ZONE : Credit/Debit Card SelectBox Editor Options
  CardBankLabel = { text: 'ธนาคารผู้ออกบัตร' };
  CardTypeLabel = { text: 'ประเภทบัตร' };
  CardNumberLabel = { text: 'เลขบัตร 4 ตัวท้าย (เพื่ออ้างอิง)' };
  CardHolderNameLabel = { text: 'ชื่อร้านค้า/เว็บไซต์ที่เกิดรายการ' };
  CardTransactionAmountLabel = { text: 'จำนวนเงิน (บาท)' };
  CardTransactionDateLabel = { text: 'วันที่/เวลาที่เกิดรายการ' };
  // END ZONE

  today = new Date();
  minDateValue: Date = new Date(this.today.getFullYear() - 2, this.today.getMonth(), this.today.getDate());
  maxDateValue: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());


  constructor(private servBankInfo: BankInfoService,) { }

  async ngOnInit(): Promise<void> {
    this.maxDateValue.setHours(this.maxDateValue.getHours() + 1);
    await this.getBankInfoList();
    this.onloadEditorOption();
  }

  onloadEditorOption() {
    this.bankOriginEditorOptions = {
      items: this.bankInfoList,
      displayExpr: 'BANK_NAME',
      valueExpr: 'BANK_ID',
      searchEnabled: true,
      placeholder: 'เลือกชื่อธนาคารต้นทาง',
      showClearButton: true,
      value: this.formDamageType1.BANK_ID_ORIGIN,
      onValueChanged: (e) => this.onBankNameChanged(e, 'origin')
    };
    this.bankDestEditorOptions = {
      items: this.bankInfoList,
      displayExpr: 'BANK_NAME',
      valueExpr: 'BANK_ID',
      searchEnabled: true,
      placeholder: 'เลือกชื่อธนาคารปลายทาง',
      showClearButton: true,
      value: this.formDamageType1.BANK_ID,
      onValueChanged: (e) => this.onBankNameChanged(e, 'dest')
    };
    this.bankAccountOriginEditorOptions = {
      placeholder: 'กรุณากรอกเลขที่บัญชีต้นทาง',
      mode: 'text',
      value: this.formDamageType1.BANK_ACCOUNT_ORIGIN
    };
    this.bankAccountDestEditorOptions = {
      placeholder: 'กรุณากรอกเลขที่บัญชีปลายทาง',
      mode: 'text',
      value: this.formDamageType1.BANK_ACCOUNT
    };
    this.damageBankBathEditorOptions = {
      placeholder: 'กรุณากรอกจำนวนเงินที่โอน',
      focusStateEnabled:false,
      format: '#,##0.00',
      showClearButton: true,
      value: this.formDamageType1.BANK_DAMAGE_VALUE_BAHT
    };
    this.dateTransferEditorOptions = {
      placeholder: 'กรุณาเลือกวันที่โอน',
      displayFormat: "yyyy-MM-dd HH:mm:ss",
      dateSerializationFormat: "yyyy-MM-dd HH:mm:ss",
      type: "datetime",
      max: this.maxDateValue,
      openOnFieldClick: false,
      useMaskBehavior: true,
      min: this.minDateValue,
      value: this.formDamageType1.BANK_TRANSFER_DATETIME
    };
    this.transferMethodEditorOptions = {
      items: this.listTransferMethod,
      displayExpr: 'name',
      valueExpr: 'value',
      searchEnabled: true,
      placeholder: 'เลือกวิธีการโอนเงิน',
      showClearButton: true,
      value: this.formDamageType1.BANK_TRANSFER_METHOD
    };
  }

  async getBankInfoList(): Promise<void> {
    try {
      const res: any = await this.servBankInfo.GetBankInfo().toPromise();
      console.log(res);
      if (res) {
        this.bankInfoList = res;
        console.log(this.bankInfoList);
      }
    } catch (error) {
      console.error('Error fetching bank info list:', error);
    }
  }

  onDamageTypeChange(damageType: any, event: any): void {
    damageType.selected = event.value;
    if (!event.value) {
      this.alertChageDamageType(damageType, event);
    }
  }

  async alertChageDamageType(damageType: any, event: any): Promise<void> {
    if (!event.value) {
      const confirmChangeSwalAlert = await Swal.fire({
        title: 'ยืนยันการเปลี่ยนแปลง',
        text: 'หากยกเลิกประเภทความเสียหาย ข้อมูลที่กรอกในประเภทความเสียหายนี้จะถูกลบทั้งหมด คุณต้องการเปลี่ยนแปลงหรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ใช่, ยืนยัน',
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {
        return result.isConfirmed;
      });
      console.log(confirmChangeSwalAlert);
      if (confirmChangeSwalAlert === true) {
        switch (damageType.id) {
          case 1:
            this.listDamgeValueType1 = [];
            break;
          case 2:
            this.listDamgeValueType2 = [];
            break;
          case 3:
            this.listDamgeValueType3 = [];
            break;
          case 4:
            this.listDamgeValueType4 = [];
            break;
          case 5:
            this.listDamgeValueType5 = [];
            break;
        }
      } else {
        // revert checkbox to true
        event.component.option('value', true);
      }
    }
  }

  onBankNameChanged(event: any, formDamageType: 'origin' | 'dest'): void {
    const selectedBank = this.bankInfoList.find(bank => bank.BANK_ID === event.value);

    const propBankName = formDamageType === 'origin'
      ? 'BANK_NAME_ORIGIN'
      : 'BANK_NAME';

    const propBankId = formDamageType === 'origin'
      ? 'BANK_ID_ORIGIN'
      : 'BANK_ID';

    this.formDamageType1 = {
      ...this.formDamageType1,
      [propBankId]: selectedBank?.BANK_ID ?? null,
      [propBankName]: selectedBank?.BANK_NAME ?? null
    };
  }

  onDamageType1Submit(form:DxFormComponent): void {
    if (!form.instance.validate().isValid) {
      Swal.fire({
        icon: 'error',
        title: 'แจ้งเตือน',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วนตามที่กำหนด',
      });
      return;
    } else {
      console.log('Form Damage Type 1 Submitted:', this.formDamageType1);
    }
  }

  onDamageType2Submit(form:DxFormComponent): void {
    if (!form.instance.validate().isValid) {
      Swal.fire({
        icon: 'error',
        title: 'แจ้งเตือน',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วนตามที่กำหนด',
      });
      return;
    } else {
      console.log('Form Damage Type 2 Submitted:', this.formDamageType2);
    }
  }

  onDamageType3Submit(form:DxFormComponent): void {
    if (!form.instance.validate().isValid) {
      Swal.fire({
        icon: 'error',
        title: 'แจ้งเตือน',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วนตามที่กำหนด',
      });
      return;
    } else {
      console.log('Form Damage Type 3 Submitted:', this.formDamageType3);
    }
  }

  onDamageType4Submit(form:DxFormComponent): void {
    if (!form.instance.validate().isValid) {
      Swal.fire({
        icon: 'error',
        title: 'แจ้งเตือน',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วนตามที่กำหนด',
      });
      return;
    } else {
      console.log('Form Damage Type 4 Submitted:', this.formDamageType4);
    }
  }

  onDamageType5Submit(form:DxFormComponent): void {
    if (!form.instance.validate().isValid) {
      Swal.fire({
        icon: 'error',
        title: 'แจ้งเตือน',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วนตามที่กำหนด',
      });
      return;
    } else {
      console.log('Form Damage Type 5 Submitted:', this.formDamageType5);
    }
  }

}
