import { Component, OnInit } from '@angular/core';
import { DxFormComponent, DxSelectBoxComponent, DxSelectBoxModule } from 'devextreme-angular';
import { dxDateBoxOptions } from 'devextreme/ui/date_box';
import { dxNumberBoxOptions } from 'devextreme/ui/number_box';
import { dxSelectBoxOptions } from 'devextreme/ui/select_box';
import dxTextBox, { dxTextBoxOptions } from 'devextreme/ui/text_box';
import { BankInfoService } from 'src/app/services/bank-info.service';
import th from 'src/assets/i18n/th';
import Swal from 'sweetalert2';
import { IssueOnlineContainerComponent } from '../issue-online-container.component';

@Component({
  selector: 'app-issue-online-damage-new',
  templateUrl: './issue-online-damage-new.component.html',
  styleUrls: ['./issue-online-damage-new.component.scss']
})
export class IssueOnlineDamageNewComponent implements OnInit {

  public mainConponent: IssueOnlineContainerComponent;
  formType: 'add' | 'edit' = 'add';
  // formboxDamageType1: DxFormComponent;
  listDamageType: any[] = [
    { id: 1, name: 'โอนเงินผ่านบัญชีธนาคาร', selected: false },
    { id: 2, name: 'โอน/ซื้อสินทรัพย์ดิจิทัล (คริปโทฯ)', selected: false },
    { id: 3, name: 'โอนเงินผ่านบัญชีเงินอิเล็กทรอนิกส์ (e-Wallet)', selected: false },
    { id: 4, name: 'ซื้อบัตรเงินสด/บัตรของขวัญ', selected: false },
    { id: 5, name: 'ข้อมูลบัตรเครดิต/เดบิตของฉันถูกนำไปใช้', selected: false }
  ];
  listTransferMethod: any[] = [
    { id: 1, name: 'ATM', value: 'ATM' },
    { id: 2, name: 'Internet Banking', value: 'Internet Banking' },
    { id: 3, name: 'Mobile Banking', value: 'Mobile Banking' },
    { id: 4, name: 'Counter Service', value: 'Counter Service' },
    { id: 5, name: 'อื่นๆ', value: 'อื่นๆ' },
  ];
  readonly cryptoUnits = ['USDT (Tether)', 'BTC (Bitcoin)', 'ETH (Ethereum)', 'อื่นๆ'];
  readonly cryptoNetworks = ['TRON (TRC-20)', 'Ethereum (ERC-20)', 'BNB Smart Chain (BEP-20)', 'อื่นๆ'];
  readonly ewalletServices = ['ทรูมันนี่ วอลเล็ท (TrueMoney Wallet)', 'ช้อปปี้เพย์ (ShopeePay)', 'แรบบิท ไลน์ เพย์ (Rabbit LINE Pay)', 'อื่นๆ'];
  readonly giftCardTypes = ['บัตรของขวัญ Apple / iTunes', 'Razer Gold PIN', 'Razer Gold PIN', 'อื่นๆ'];
  readonly cardTypes = ['VISA', 'Mastercard'];

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
  onEditType1: boolean = false;
  onEditType2: boolean = false;
  onEditType3: boolean = false;
  onEditType4: boolean = false;
  onEditType5: boolean = false;
  onEditIndexType1: number = -1;
  onEditIndexType2: number = -1;
  onEditIndexType3: number = -1;
  onEditIndexType4: number = -1;
  onEditIndexType5: number = -1;

  // ZONE : Bank SelectBox Editor Options
  bankOriginLabel = { text: 'ชื่อธนาคารต้นทาง' };
  bankDestLabel = { text: 'ชื่อธนาคารปลายทาง' };
  bankAccountOriginLabel = { text: 'เลขบัญชีต้นทาง' };
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

  CryptoExchangeEditorOptions: dxTextBoxOptions;
  CryptoUnitEditorOptions: dxSelectBoxOptions;
  CryptoNetworkEditorOptions: dxSelectBoxOptions;
  CryptoDestAddressEditorOptions: dxTextBoxOptions;
  CryptoAmountEditorOptions: dxNumberBoxOptions;
  CryptoTransactionIdEditorOptions: dxTextBoxOptions;
  // END ZONE

  // ZONE : E-Wallet SelectBox Editor Options
  EwalletServiceLabel = { text: 'ผู้ให้บริการ e-Wallet ปลายทาง' };
  EwalletAccountLabel = { text: 'เบอร์โทรศัพท์หรือ ID ของบัญชีปลายทาง' };
  EwalletNameLabel = { text: 'ชื่อบัญชีปลายทาง (ถ้าทราบ)' };
  EwalletAmountLabel = { text: 'จำนวนเงิน (บาท)' };
  EwalletDateTransferLabel = { text: 'วันที่/เวลาที่โอน' };

  EwalletServiceEditorOptions: dxSelectBoxOptions;
  EwalletAccountEditorOptions: dxTextBoxOptions;
  EwalletNameEditorOptions: dxTextBoxOptions;
  EwalletAmountEditorOptions: dxNumberBoxOptions;
  EwalletDateTransferEditorOptions: dxDateBoxOptions;
  // END ZONE

  // ZONE : Gift Card SelectBox Editor Options
  GiftCardTypeLabel = { text: 'ประเภทของบัตร' };
  GiftCardAmountLabel = { text: 'มูลค่าบัตร (บาท)' };
  GiftCardCodeLabel = { text: 'หมายเลขบัตร/รหัสที่ส่งให้คนร้าย (ถ้ามี)' };

  GiftCardTypeEditorOptions: dxSelectBoxOptions;
  GiftCardAmountEditorOptions: dxNumberBoxOptions;
  GiftCardCodeEditorOptions: dxTextBoxOptions;
  // END ZONE

  //  ZONE : Credit/Debit Card SelectBox Editor Options
  CardBankLabel = { text: 'ธนาคารผู้ออกบัตร' };
  CardTypeLabel = { text: 'ประเภทบัตร' };
  CardNumberLabel = { text: 'เลขบัตร 4 ตัวท้าย (เพื่ออ้างอิง)' };
  CardHolderNameLabel = { text: 'ชื่อร้านค้า/เว็บไซต์ที่เกิดรายการ' };
  CardTransactionAmountLabel = { text: 'จำนวนเงิน (บาท)' };
  CardTransactionDateLabel = { text: 'วันที่/เวลาที่เกิดรายการ' };

  CardBankEditorOptions: dxSelectBoxOptions;
  CardTypeEditorOptions: dxSelectBoxOptions;
  CardNumberEditorOptions: dxTextBoxOptions;
  CardHolderNameEditorOptions: dxTextBoxOptions;
  CardTransactionAmountEditorOptions: dxNumberBoxOptions;
  CardTransactionDateEditorOptions: dxDateBoxOptions;
  // END ZONE

  today = new Date();
  minDateValue: Date = new Date(this.today.getFullYear() - 2, this.today.getMonth(), this.today.getDate());
  maxDateValue: Date = this.today;


  constructor(private servBankInfo: BankInfoService,) { }

  async ngOnInit(): Promise<void> {
    this.maxDateValue.setHours(this.maxDateValue.getHours() + 1);
    await this.getBankInfoList();
    this.onloadEditorOption();
  }

  onloadEditorOption() {
    // BANK
    this.bankOriginEditorOptions = this.createBankSelectBox(
      'เลือกชื่อธนาคารต้นทาง',
      e => this.onBankNameChanged(e, 'origin')
    );

    this.bankDestEditorOptions = this.createBankSelectBox(
      'เลือกชื่อธนาคารปลายทาง',
      e => this.onBankNameChanged(e, 'dest')
    );

    this.bankAccountOriginEditorOptions = this.createAccountEditor('กรุณากรอกเลขที่บัญชีต้นทาง');
    this.bankAccountDestEditorOptions = this.createAccountEditor('กรุณากรอกเลขที่บัญชีปลายทาง');
    this.damageBankBathEditorOptions = this.createMoneyEditor('กรุณากรอกจำนวนเงินที่โอน');
    this.dateTransferEditorOptions = this.createDateTimeEditor('กรุณาเลือกวันที่โอน');

    this.transferMethodEditorOptions = this.createSelectBox(
      this.listTransferMethod,
      'เลือกวิธีการโอนเงิน',
      { displayExpr: 'name', valueExpr: 'value' }
    );

    // CRYPTO
    this.CryptoExchangeEditorOptions = this.createTextEditor('กรุณากรอกชื่อ Exchange ที่โอน (ถ้ามี)');
    this.CryptoUnitEditorOptions = this.createSelectBox(this.cryptoUnits, 'เลือกสกุลเงินดิจิทัลที่โอน');
    this.CryptoNetworkEditorOptions = this.createSelectBox(this.cryptoNetworks, 'เลือกเครือข่าย (Blockchain Network) ที่ใช้โอน');
    this.CryptoDestAddressEditorOptions = this.createTextEditor('กรุณากรอกที่อยู่ Wallet ปลายทาง (Destination Address)');
    this.CryptoAmountEditorOptions = this.createMoneyEditor('กรุณากรอกจำนวนเหรียญที่โอน', '#,##0.00000000');
    this.CryptoTransactionIdEditorOptions = this.createTextEditor('กรุณากรอก Transaction ID (TxID / Hash) (ถ้ามี)');

    // E-WALLET
    this.EwalletServiceEditorOptions = this.createSelectBox(this.ewalletServices, 'เลือกผู้ให้บริการ e-Wallet ปลายทาง');
    this.EwalletAccountEditorOptions = this.createTextEditor('กรุณากรอกเบอร์โทรศัพท์หรือ ID ของบัญชีปลายทาง');
    this.EwalletNameEditorOptions = this.createTextEditor('กรุณากรอกชื่อบัญชีปลายทาง (ถ้าทราบ)');
    this.EwalletAmountEditorOptions = this.createMoneyEditor('กรุณากรอกจำนวนเงิน (บาท)');
    this.EwalletDateTransferEditorOptions = this.createDateTimeEditor('กรุณาเลือกวันที่/เวลาที่โอน');

    // GIFT CARD
    this.GiftCardTypeEditorOptions = this.createSelectBox(this.giftCardTypes, 'เลือกประเภทของบัตร');
    this.GiftCardAmountEditorOptions = this.createMoneyEditor('กรุณากรอกมูลค่าบัตร (บาท)');
    this.GiftCardCodeEditorOptions = this.createTextEditor('กรุณากรอกหมายเลขบัตร/รหัสที่ส่งให้คนร้าย (ถ้ามี)');

    // CARD
    this.CardBankEditorOptions = this.createBankSelectBox('เลือกธนาคารผู้ออกบัตร');
    this.CardTypeEditorOptions = this.createSelectBox(this.cardTypes, 'เลือกประเภทบัตร');
    this.CardNumberEditorOptions = this.createTextEditor('กรุณากรอกเลขบัตร 4 ตัวท้าย (เพื่ออ้างอิง)');
    this.CardHolderNameEditorOptions = this.createTextEditor('กรุณากรอกชื่อร้านค้า/เว็บไซต์ที่เกิดรายการ');
    this.CardTransactionAmountEditorOptions = this.createMoneyEditor('กรุณากรอกจำนวนเงิน (บาท)');
    this.CardTransactionDateEditorOptions = this.createDateTimeEditor('กรุณาเลือกวันที่/เวลาที่เกิดรายการ');
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
    damageType.selected = event;
    if (!event) {
      this.alertChageDamageType(damageType, event);
    }
  }

  trackByDamageType(index: number, item: any) {
    return item.id; // หรือ damageTypeId จริงของคุณ
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

  onDamageType1Submit(form: DxFormComponent): void {
    if (!form.instance.validate().isValid) {
      Swal.fire({
        icon: 'error',
        title: 'แจ้งเตือน',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วนตามที่กำหนด',
      });
      return;
    } else {
      console.log('Form Damage Type 1 Submitted:', this.formDamageType1);
      this.listDamgeValueType1.push(this.formDamageType1);
      this.formDamageType1 = { };
    }
  }

  onDamageType2Submit(form: DxFormComponent): void {
    if (!form.instance.validate().isValid) {
      Swal.fire({
        icon: 'error',
        title: 'แจ้งเตือน',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วนตามที่กำหนด',
      });
      return;
    } else {
      console.log('Form Damage Type 2 Submitted:', this.formDamageType2);
      this.listDamgeValueType2.push(this.formDamageType2);
      this.formDamageType2 = { };
    }
  }

  onDamageType3Submit(form: DxFormComponent): void {
    if (!form.instance.validate().isValid) {
      Swal.fire({
        icon: 'error',
        title: 'แจ้งเตือน',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วนตามที่กำหนด',
      });
      return;
    } else {
      console.log('Form Damage Type 3 Submitted:', this.formDamageType3);
      this.listDamgeValueType3.push(this.formDamageType3);
      this.formDamageType3 = { };
    }
  }

  onDamageType4Submit(form: DxFormComponent): void {
    if (!form.instance.validate().isValid) {
      Swal.fire({
        icon: 'error',
        title: 'แจ้งเตือน',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วนตามที่กำหนด',
      });
      return;
    } else {
      console.log('Form Damage Type 4 Submitted:', this.formDamageType4);
      this.listDamgeValueType4.push(this.formDamageType4);
      this.formDamageType4 = { };
    }
  }

  onDamageType5Submit(form: DxFormComponent): void {
    if (!form.instance.validate().isValid) {
      Swal.fire({
        icon: 'error',
        title: 'แจ้งเตือน',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วนตามที่กำหนด',
      });
      return;
    } else {
      console.log('Form Damage Type 5 Submitted:', this.formDamageType5);
      this.listDamgeValueType5.push(this.formDamageType5);
      this.formDamageType5 = { };
    }
  }

  onDamageType1Update(form: DxFormComponent): void {
    // create fuction to update existing entry
    if (!form.instance.validate().isValid) {
      Swal.fire({
        icon: 'error',
        title: 'แจ้งเตือน',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วนตามที่กำหนด',
      });
      return;
    } else {
      console.log('Form Damage Type 1 Updated:', this.formDamageType1);
      this.listDamgeValueType1[this.onEditIndexType1] = this.formDamageType1;
      this.onEditType1 = false;
      this.formDamageType1 = { };
    }

  }

  onDamageType2Update(form: DxFormComponent): void {
    // Logic to update existing entry
    if (!form.instance.validate().isValid) {
      Swal.fire({
        icon: 'error',
        title: 'แจ้งเตือน',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วนตามที่กำหนด',
      });
      return;
    } else {
      console.log('Form Damage Type 2 Updated:', this.formDamageType2);
      this.listDamgeValueType2[this.onEditIndexType2] = this.formDamageType2;
      this.onEditType2 = false;
      this.formDamageType2 = { };
    } 
  }

  onDamageType3Update(form: DxFormComponent): void {
    // Logic to update existing entry
    if (!form.instance.validate().isValid) {  
      Swal.fire({
        icon: 'error',
        title: 'แจ้งเตือน',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วนตามที่กำหนด',
      });
      return;
    } else {
      console.log('Form Damage Type 3 Updated:', this.formDamageType3);
      this.listDamgeValueType3[this.onEditIndexType3] = this.formDamageType3;
      this.onEditType3 = false;
      this.formDamageType3 = { };
    }
  }

  onDamageType4Update(form: DxFormComponent): void {
    // Logic to update existing entry
    if (!form.instance.validate().isValid) {
      Swal.fire({
        icon: 'error',
        title: 'แจ้งเตือน',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วนตามที่กำหนด',
      });
      return;
    } else {
      console.log('Form Damage Type 4 Updated:', this.formDamageType4);
      this.listDamgeValueType4[this.onEditIndexType4] = this.formDamageType4;
      this.onEditType4 = false;
      this.formDamageType4 = { };
    }
  }

  onDamageType5Update(form: DxFormComponent): void {
    // Logic to update existing entry
    if (!form.instance.validate().isValid) {
      Swal.fire({
        icon: 'error',
        title: 'แจ้งเตือน',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วนตามที่กำหนด',
      });
      return;
    } else {
      console.log('Form Damage Type 5 Updated:', this.formDamageType5);
      this.listDamgeValueType5[this.onEditIndexType5] = this.formDamageType5;
      this.onEditType5 = false;
      this.formDamageType5 = { };
    }
  }
  
  onEditType1Clicked(index: number): void {
    console.log(index);
    this.onEditType1 = true;
    this.onEditIndexType1 = index;
    this.formDamageType1 = { ...this.listDamgeValueType1[index] };
  }

  onDeleteType1Clicked(index: number): void {
    Swal.fire({
      title: 'ยืนยันการลบข้อมูล',
      text: 'คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.listDamgeValueType1.splice(index, 1);
        Swal.fire({
          title: 'ลบข้อมูลเรียบร้อย',
          text: 'ข้อมูลถูกลบเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง'
        });
      }
    });
  }

  onEditType2Clicked(index: number): void {
    this.onEditType2 = true;
    this.onEditIndexType2 = index;
    this.formDamageType2 = { ...this.listDamgeValueType2[index] };
  }

  onDeleteType2Clicked(index: number): void {
    Swal.fire({
      title: 'ยืนยันการลบข้อมูล',
      text: 'คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.listDamgeValueType2.splice(index, 1);
        Swal.fire({
          title: 'ลบข้อมูลเรียบร้อย',
          text: 'ข้อมูลถูกลบเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง'
        });
      }
    });
  }

  onEditType3Clicked(index: number): void {
    this.onEditType3 = true;
    this.onEditIndexType3 = index;
    this.formDamageType3 = { ...this.listDamgeValueType3[index] };
  }
  onDeleteType3Clicked(index: number): void {
    Swal.fire({
      title: 'ยืนยันการลบข้อมูล',
      text: 'คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.listDamgeValueType3.splice(index, 1);
        Swal.fire({
          title: 'ลบข้อมูลเรียบร้อย',
          text: 'ข้อมูลถูกลบเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง'
        });
      }
    });
  }

  onEditType4Clicked(index: number): void {
    this.onEditType4 = true;
    this.onEditIndexType4 = index;
    this.formDamageType4 = { ...this.listDamgeValueType4[index] };
  }

  onDeleteType4Clicked(index: number): void {
    Swal.fire({
      title: 'ยืนยันการลบข้อมูล',
      text: 'คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.listDamgeValueType4.splice(index, 1);
        Swal.fire({
          title: 'ลบข้อมูลเรียบร้อย',
          text: 'ข้อมูลถูกลบเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง'
        });
      }
    });
  }

  onEditType5Clicked(index: number): void {
    this.onEditType5 = true;
    this.onEditIndexType5 = index;
    this.formDamageType5 = { ...this.listDamgeValueType5[index] };
  }

  onDeleteType5Clicked(index: number): void {
    Swal.fire({
      title: 'ยืนยันการลบข้อมูล',
      text: 'คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.listDamgeValueType5.splice(index, 1);
        Swal.fire({
          title: 'ลบข้อมูลเรียบร้อย',
          text: 'ข้อมูลถูกลบเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง'
        });
      }
    });
  }

  private createTextEditor(placeholder: string): any {
    return {
      placeholder,
      mode: 'text'
    };
  }

  private createMoneyEditor(placeholder: string, format = '#,##0.00'): any {
    return {
      placeholder,
      focusStateEnabled: false,
      format,
      showClearButton: true
    };
  }

  private createDateTimeEditor(placeholder: string): any {
    console.log( this.maxDateValue);
    return {
      placeholder,
      displayFormat: 'yyyy-MM-dd HH:mm:ss',
      dateSerializationFormat: 'yyyy-MM-dd HH:mm:ss',
      type: 'datetime',
      max: this.maxDateValue,
      min: this.minDateValue,
      openOnFieldClick: false,
      useMaskBehavior: true
    };
  }

  private createSelectBox(items: any[], placeholder: string, extra: any = {}): any {
    return {
      items,
      searchEnabled: true,
      showClearButton: true,
      placeholder,
      ...extra
    };
  }

  private createBankSelectBox(placeholder: string, onValueChanged?: (e: any) => void): any {
    return this.createSelectBox(this.bankInfoList, placeholder, {
      displayExpr: 'BANK_NAME',
      valueExpr: 'BANK_ID',
      onValueChanged
    });
  }

  private createAccountEditor(placeholder: string): any {
    return {
      placeholder,
      mode: 'text',
      mask: '00000000009999999999', // 10 ตัวบังคับ + 10 ตัวเลือก
      maskInvalidMessage: 'กรุณากรอกเฉพาะตัวเลข (10-20 หลัก)',
      showClearButton: true
    };
  }

  sumTotolalDamageValue(): number {
    let total = 0;
    const sumType1 = this.listDamgeValueType1.reduce((acc, curr) => acc + (Number(curr.BANK_DAMAGE_VALUE_BAHT) || 0), 0);
    const sumType2 = this.listDamgeValueType2.reduce((acc, curr) => acc + (Number(curr.CRYPTO_AMOUNT_BATH) || 0), 0);
    const sumType3 = this.listDamgeValueType3.reduce((acc, curr) => acc + (Number(curr.EWALLET_AMOUNT) || 0), 0);
    const sumType4 = this.listDamgeValueType4.reduce((acc, curr) => acc + (Number(curr.GIFT_CARD_AMOUNT) || 0), 0);
    const sumType5 = this.listDamgeValueType5.reduce((acc, curr) => acc + (Number(curr.CARD_TRANSACTION_AMOUNT) || 0), 0);

    total = sumType1 + sumType2 + sumType3 + sumType4 + sumType5;
    return total;
  }

  get totalDamageValue(): number {
    return this.sumTotolalDamageValue();
  }

  Back(e){
    this.mainConponent.NextIndex(this.mainConponent.indexTab - 1);
  }

  SubmitForm(e){
    if (this.totalDamageValue <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'แจ้งเตือน',
        text: 'กรุณากรอกข้อมูลความเสียหายอย่างน้อยหนึ่งรายการ',
      });
      return;
    }
    const setData = {
      DamageType1: this.listDamgeValueType1,
      DamageType2: this.listDamgeValueType2,
      DamageType3: this.listDamgeValueType3,
      DamageType4: this.listDamgeValueType4,
      DamageType5: this.listDamgeValueType5,
      TotalDamageValue: this.totalDamageValue
    };
    this.mainConponent.formDataAll.formDamage = setData;
    localStorage.setItem("form-damage", JSON.stringify(setData));
    if (e != 'tab') {
      this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
    }
  }

}
