import { Component, Input, OnInit } from '@angular/core';
import { DxFormComponent, DxSelectBoxComponent, DxSelectBoxModule } from 'devextreme-angular';
import { dxDateBoxOptions } from 'devextreme/ui/date_box';
import { dxNumberBoxOptions } from 'devextreme/ui/number_box';
import { dxSelectBoxOptions } from 'devextreme/ui/select_box';
import dxTextBox, { dxTextBoxOptions } from 'devextreme/ui/text_box';
import { BankInfoService } from 'src/app/services/bank-info.service';
import th from 'src/assets/i18n/th';
import Swal from 'sweetalert2';
import { IssueOnlineContainerComponent } from '../issue-online-container.component';
import { read } from 'fs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-issue-online-damage-new',
  templateUrl: './issue-online-damage-new.component.html',
  styleUrls: ['./issue-online-damage-new.component.scss']
})
export class IssueOnlineDamageNewComponent implements OnInit {

  @Input() dataForm: any;
  @Input() BankRefData: any;
  readOnlyForm = false;
  @Input() mainComponent: IssueOnlineContainerComponent;
  @Input() formType: 'add' | 'edit' | 'view' = 'add';
  @Input() payloadForm: any = {};
  // formboxDamageType1: DxFormComponent;
  listDamageType: any[] = [
    { id: 1, name: 'โอนเงินผ่านบัญชีธนาคาร', selected: false },
    { id: 2, name: 'โอน/ซื้อสินทรัพย์ดิจิทัล (คริปโทฯ)', selected: false },
    { id: 3, name: 'โอนเงินผ่านบัญชีเงินอิเล็กทรอนิกส์ (e-Wallet)', selected: false },
    { id: 4, name: 'ซื้อบัตรเงินสด/บัตรของขวัญ', selected: false },
    { id: 5, name: 'ข้อมูลบัตรเครดิต/เดบิตของฉันถูกนำไปใช้', selected: false },
    { id: 6, name: 'ทรัพย์สินอื่นๆ', selected: false },
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
  readonly ewalletServices = ['ทรูมันนี่ วอลเล็ท (TrueMoney Wallet)', 'ช้อปปี้เพย์ (ShopeePay)', 'แรบบิท ไลน์ เพย์ (Rabbit LINE Pay)', 'Paypal', 'Max Card', 'เป๋าตังค์', 'อื่นๆ'];
  readonly giftCardTypes = ['บัตรของขวัญ Apple / iTunes', 'Razer Gold PIN', 'อื่นๆ'];
  readonly cardTypes = ['VISA', 'Mastercard'];
  readonly bankTypes = [
    { type_bank_id: 1, type_main: 'T', type_id: 'T', type_name: 'ธนาคาร' },
    { type_bank_id: 2, type_main: 'T', type_id: 'P', type_name: 'พร้อมเพย์' },
    { type_bank_id: 4, type_main: 'P', type_id: 'C', type_name: 'เงินดิจิทัล (Cryptocurrency)' },
    { type_bank_id: 8, type_main: 'P', type_id: 'P', type_name: 'QR Code' },
    { type_bank_id: 3, type_main: 'P', type_id: 'P', type_name: 'ทรูมันนี่ วอลเล็ท (TrueMoney Wallet)' },
    { type_bank_id: 5, type_main: 'P', type_id: 'P', type_name: 'Paypal' },
    { type_bank_id: 9, type_main: 'P', type_id: 'P', type_name: 'Max Card' },
    { type_bank_id: 10, type_main: 'P', type_id: 'P', type_name: 'เป๋าตังค์' },
    { type_bank_id: 11, type_main: 'P', type_id: 'P', type_name: 'ช้อปปี้เพย์ (ShopeePay)' },
    { type_bank_id: 12, type_main: 'P', type_id: 'P', type_name: 'แรบบิท ไลน์ เพย์ (Rabbit LINE Pay)' },
    { type_bank_id: 6, type_main: 'P', type_id: 'O', type_name: 'อื่นๆ' },
  ];
  WayOtherList: any[] = [];

  bankInfoList: any[] = [];
  listDamageValueType1: any[] = [];
  listDamageValueType2: any[] = [];
  listDamageValueType3: any[] = [];
  listDamageValueType4: any[] = [];
  listDamageValueType5: any[] = [];
  listDamageValueType6: any[] = [];
  formDamageType1: any = {};
  formDamageType2: any = {};
  formDamageType3: any = {};
  formDamageType4: any = {};
  formDamageType5: any = {};
  formDamageType6: any = {};
  onEditType1: boolean = false;
  onEditType2: boolean = false;
  onEditType3: boolean = false;
  onEditType4: boolean = false;
  onEditType5: boolean = false;
  onEditType6: boolean = false;
  onEditIndexType1: number = -1;
  onEditIndexType2: number = -1;
  onEditIndexType3: number = -1;
  onEditIndexType4: number = -1;
  onEditIndexType5: number = -1;
  onEditIndexType6: number = -1;


  // ZONE : Bank SelectBox Editor Options
  bankOriginLabel = { text: 'ชื่อธนาคารต้นทาง' };
  bankDestLabel = { text: 'ชื่อธนาคารปลายทาง' };
  bankAccountOriginLabel = { text: 'เลขบัญชีต้นทาง' };
  bankAccountNameOriginLabel = { text: 'ชื่อบัญชีต้นทาง' };
  bankAccountDestLabel = { text: 'เลขบัญชีปลายทาง/เอกลักษณ์บัญชีปลายทาง' };
  bankAccountNameDestLabel = { text: 'ชื่อบัญชีปลายทาง' };
  damageBankBathLabel = { text: 'จำนวนเงินที่โอน' };
  dateTransferLabel = { text: 'วันที่โอนเงิน' };
  transferMethodLabel = { text: 'วิธีการโอนเงิน' };
  bankDestTypeLabel = { text: 'ประเภทบัญชีปลายทาง' };
  bankDestTypeEditorOptions: dxSelectBoxOptions;
  bankOriginEditorOptions: dxSelectBoxOptions;
  bankDestEditorOptions: dxSelectBoxOptions;
  bankAccountOriginEditorOptions: dxTextBoxOptions;
  bankAccountDestEditorOptions: dxTextBoxOptions;
  damageBankBathEditorOptions: dxNumberBoxOptions;
  dateTransferEditorOptions: dxDateBoxOptions;
  transferMethodEditorOptions: dxSelectBoxOptions;
  bankAccountNameOriginEditorOptions: dxTextBoxOptions;
  bankAccountNameDestEditorOptions: dxTextBoxOptions;
  // END ZONE

  //  ZONE : Crypto SelectBox Editor Options
  CryptoExchangeLabel = { text: 'คุณโอนจาก Exchange ใด (ถ้ามี)?' };
  CryptoUnitLabel = { text: 'สกุลเงินดิจิทัลที่โอน' };
  CryptoNetworkLabel = { text: 'เครือข่าย (Blockchain Network) ที่ใช้โอน' };
  CryptoDestAddressLabel = { text: 'ที่อยู่ Wallet ปลายทาง (Destination Address)' };
  CryptoAmountLabel = { text: 'จำนวนเหรียญที่โอน' };
  CryptoTransactionIdLabel = { text: 'Transaction ID (TxID / Hash) (ถ้ามี)' };
  CryptoNetworkOtherLabel = { text: 'โปรดระบุเครือข่าย (Blockchain Network) ที่ใช้โอน' };
  CryptoOriginAddressLabel = { text: 'ที่อยู่ Wallet ต้นทาง (Origin Address)' };

  CryptoExchangeEditorOptions: dxTextBoxOptions;
  CryptoUnitEditorOptions: dxSelectBoxOptions;
  CryptoNetworkEditorOptions: dxSelectBoxOptions;
  CryptoOriginAddressEditorOptions: dxTextBoxOptions;
  CryptoDestAddressEditorOptions: dxTextBoxOptions;
  CryptoAmountEditorOptions: dxNumberBoxOptions;
  CryptoAmountBathEditorOptions: dxNumberBoxOptions;
  CryptoTransactionIdEditorOptions: dxTextBoxOptions;
  CryptoNetworkOtherEditorOptions: dxTextBoxOptions;
  // END ZONE

  // ZONE : E-Wallet SelectBox Editor Options
  EwalletServiceOriginLabel = { text: 'ผู้ให้บริการ e-Wallet ต้นทาง' };
  EwalletAccountOriginLabel = { text: 'เบอร์โทรศัพท์หรือ ID ของบัญชีต้นทาง' };
  EwalletNameOriginLabel = { text: 'ชื่อบัญชีต้นทาง' };
  EwalletServiceLabel = { text: 'ผู้ให้บริการ e-Wallet ปลายทาง' };
  EwalletAccountLabel = { text: 'เบอร์โทรศัพท์หรือ ID ของบัญชีปลายทาง' };
  EwalletAccountDestLabel = { text: 'เลขบัญชีปลายทาง/เอกลักษณ์บัญชีปลายทาง' };
  EwalletNameLabel = { text: 'ชื่อบัญชีปลายทาง (ถ้าทราบ)' };
  EwalletAmountLabel = { text: 'จำนวนเงิน (บาท)' };
  EwalletDateTransferLabel = { text: 'วันที่/เวลาที่โอน' };
  EwalletServiceOriginOtherLabel = { text: 'โปรดระบุประเภทอื่นๆ' };
  EwalletServiceOtherLabel = { text: 'โปรดระบุประเภทอื่นๆ' };
  EwalletDestTypeLabel = { text: 'ประเภทบัญชีปลายทาง' };
  EwalletDestEditorLabel = { text: 'ชื่อธนาคารปลายทาง' };

  EwalletServiceDestTypeEditorOptions: dxSelectBoxOptions;
  EwalletServiceOriginOtherEditorOptions: dxTextBoxOptions;
  EwalletServiceOriginEditorOptions: dxSelectBoxOptions;
  EwalletAccountOriginEditorOptions: dxTextBoxOptions;
  EwalletNameOriginEditorOptions: dxTextBoxOptions;
  EwalletServiceOtherEditorOptions: dxTextBoxOptions;
  EwalletServiceEditorOptions: dxSelectBoxOptions;
  EwalletAccountEditorOptions: dxTextBoxOptions;
  EwalletNameEditorOptions: dxTextBoxOptions;
  EwalletAmountEditorOptions: dxNumberBoxOptions;
  EwalletDateTransferEditorOptions: dxDateBoxOptions;

  EwalletDestEditorOptions: dxSelectBoxOptions;
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

  // ZONE : Bank Reference
  OtherBankIdLabel = { text: 'ประเภททรัพย์สิน' };
  OtherBankIdEditorOptions: dxSelectBoxOptions;
  OtherDetailLabel = { text: 'รายละเอียดทรัพย์สินอื่นๆ' };
  OtherDetailEditorOptions: dxTextBoxOptions;
  OtherAmountLabel = { text: 'จำนวนเงิน (บาท)' };
  OtherAmountEditorOptions: dxNumberBoxOptions;

  submission: any = {};
  BankRef: any = [];
  bankRefEditIndex: number = -1;
  dateBankRef: any = null;
  bankIdPattern: any = /^[A-Za-z0-9]+$/;
  blockSave: boolean = true;

  private readonly BANK_MIN_LENGTH = 15;
  private readonly BANK_DATE_MIN = new Date(2023, 0, 1); // 1 ม.ค. 2023
  private readonly BANK_CASE_PATTERN = /^\d{8}[A-Z]{3,}/; // 8 ตัวเลข + 3 ตัวอักษรขึ้นไป

  form1Added: boolean = false;
  form2Added: boolean = false;
  form3Added: boolean = false;
  form4Added: boolean = false;
  form5Added: boolean = false;
  form6Added: boolean = false;
  formBankRefAdded: boolean = false;
  // END ZONE

  today = new Date();
  minDateValue: Date = new Date(this.today.getFullYear() - 2, this.today.getMonth(), this.today.getDate());
  maxDateValue: Date = this.today;

  isLoading: boolean = true;



  constructor(private servBankInfo: BankInfoService,
    private datePipe: DatePipe) { }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    console.log(this.formType);
    this.maxDateValue.setHours(this.maxDateValue.getHours() + 1);
    await this.getBankInfoList();
    this.onloadEditorOption();
    if (this.dataForm) {
      if (this.formType === 'view') {
        this.listDamageValueType1 = this.dataForm?.listDamageValueType1 || [];
        this.listDamageValueType2 = this.dataForm?.listDamageValueType2 || [];
        this.listDamageValueType3 = this.dataForm?.listDamageValueType3 || [];
        this.listDamageValueType4 = this.dataForm?.listDamageValueType4 || [];
        this.listDamageValueType5 = this.dataForm?.listDamageValueType5 || [];
        this.listDamageValueType6 = this.dataForm?.listDamageValueType6 || [];
        this.BankRef = this.BankRefData?.BankRef?.length > 0 ? this.BankRefData?.BankRef : this.BankRefData?.length > 0 ? this.BankRefData : [];
        this.readOnlyForm = true;
      } else if (this.formType === 'edit') {
        const form = this.dataForm?.DamageDetail || {};
        const formBank = this.dataForm?.BankRef || {};
        this.listDamageValueType1 = form?.listDamageValueType1 || [];
        this.listDamageValueType2 = form?.listDamageValueType2 || [];
        this.listDamageValueType3 = form?.listDamageValueType3 || [];
        this.listDamageValueType4 = form?.listDamageValueType4 || [];
        this.listDamageValueType5 = form?.listDamageValueType5 || [];
        this.listDamageValueType6 = form?.listDamageValueType6 || [];
        this.BankRef = formBank.length > 0 ? formBank : [];
      }

      this.listDamageType.forEach(damageType => {
        switch (damageType.id) {
          case 1:
            damageType.selected = this.listDamageValueType1.length > 0;
            break;
          case 2:
            damageType.selected = this.listDamageValueType2.length > 0;
            break;
          case 3:
            damageType.selected = this.listDamageValueType3.length > 0;
            break;
          case 4:
            damageType.selected = this.listDamageValueType4.length > 0;
            break;
          case 5:
            damageType.selected = this.listDamageValueType5.length > 0;
            break;
          case 6:
            damageType.selected = this.listDamageValueType6.length > 0;
            break;
        }
      });
      console.log('dataForm in damage new', this.dataForm);
    }
    this.isLoading = false;
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

    this.bankDestTypeEditorOptions = this.createSelectBox(this.bankTypes, 'เลือกประเภทบัญชีปลายทาง', { displayExpr: 'type_name', valueExpr: 'type_name' });

    this.bankAccountOriginEditorOptions = this.createAccountEditor('กรุณากรอกเลขที่บัญชีต้นทาง');
    this.bankAccountDestEditorOptions = this.createAccountEditor('กรุณากรอกเลขที่บัญชีปลายทาง');
    this.bankAccountNameOriginEditorOptions = this.createTextEditor('กรุณากรอกชื่อบัญชีต้นทาง');
    this.bankAccountNameDestEditorOptions = this.createTextEditor('กรุณากรอกชื่อบัญชีปลายทาง');
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
    this.CryptoOriginAddressEditorOptions = this.createTextEditor('กรุณากรอกที่อยู่ Wallet ต้นทาง (Origin Address)');
    this.CryptoDestAddressEditorOptions = this.createTextEditor('กรุณากรอกที่อยู่ Wallet ปลายทาง (Destination Address)');
    this.CryptoAmountEditorOptions = this.createMoneyEditor('กรุณากรอกจำนวนเหรียญที่โอน', '#,##0.00000000');
    this.CryptoAmountBathEditorOptions = this.createMoneyEditor('กรุณากรอกจำนวนเงินที่โอน', '#,##0.00');
    this.CryptoTransactionIdEditorOptions = this.createTextEditor('กรุณากรอก Transaction ID (TxID / Hash) (ถ้ามี)');
    this.CryptoNetworkOtherEditorOptions = this.createTextEditor('กรุณาระบุเครือข่าย (Blockchain Network) ที่ใช้โอน');

    // E-WALLET
    this.EwalletServiceOriginEditorOptions = this.createSelectBox(this.ewalletServices, 'เลือกผู้ให้บริการ e-Wallet ต้นทาง');
    this.EwalletAccountOriginEditorOptions = this.createTextEditor('กรุณากรอกเบอร์โทรศัพท์หรือ ID ของบัญชีต้นทาง');
    this.EwalletNameOriginEditorOptions = this.createTextEditor('กรุณากรอกชื่อบัญชีต้นทาง');
    this.EwalletServiceEditorOptions = this.createSelectBox(this.ewalletServices, 'เลือกผู้ให้บริการ e-Wallet ปลายทาง');
    this.EwalletAccountEditorOptions = this.createTextEditor('กรุณากรอกเบอร์โทรศัพท์หรือ ID ของบัญชีปลายทาง');
    this.EwalletNameEditorOptions = this.createTextEditor('กรุณากรอกชื่อบัญชีปลายทาง (ถ้าทราบ)');
    this.EwalletAmountEditorOptions = this.createMoneyEditor('กรุณากรอกจำนวนเงิน (บาท)');
    this.EwalletDateTransferEditorOptions = this.createDateTimeEditor('กรุณาเลือกวันที่/เวลาที่โอน');
    this.EwalletServiceDestTypeEditorOptions = this.createSelectBox(this.bankTypes, 'เลือกประเภทบัญชีปลายทาง', { displayExpr: 'type_name', valueExpr: 'type_name' });
    this.EwalletDestEditorOptions = this.createBankSelectBox(
      'เลือกชื่อธนาคารปลายทาง',
      e => this.onBankNameChanged2(e, 'dest')
    );

    // GIFT CARD
    this.GiftCardTypeEditorOptions = this.createSelectBox(this.giftCardTypes, 'เลือกประเภทของบัตร');
    this.GiftCardAmountEditorOptions = this.createMoneyEditor('กรุณากรอกมูลค่าบัตร (บาท)');
    this.GiftCardCodeEditorOptions = this.createTextEditor('กรุณากรอกหมายเลขบัตร/รหัสที่ส่งให้คนร้าย (ถ้ามี)');

    // CARD
    this.CardBankEditorOptions = this.createBankSelectBox('เลือกธนาคารผู้ออกบัตร');
    this.CardTypeEditorOptions = this.createSelectBox(this.cardTypes, 'เลือกประเภทบัตร');
    this.CardNumberEditorOptions = this.createTextEditor('กรุณากรอกเลขบัตร 4 ตัวท้าย (เพื่ออ้างอิง)', 4);
    this.CardHolderNameEditorOptions = this.createTextEditor('กรุณากรอกชื่อร้านค้า/เว็บไซต์ที่เกิดรายการ');
    this.CardTransactionAmountEditorOptions = this.createMoneyEditor('กรุณากรอกจำนวนเงิน (บาท)');
    this.CardTransactionDateEditorOptions = this.createDateTimeEditor('กรุณาเลือกวันที่/เวลาที่เกิดรายการ');

    // OTHER
    this.OtherBankIdEditorOptions = this.createSelectBox(this.WayOtherList, 'เลือกประเภททรัพย์สิน', { displayExpr: 'BANK_OTHER_NAME', valueExpr: 'BANK_OTHER_ID' });
  }

  onBankNameChanged2(event: any, formDamageType: 'origin' | 'dest'): void {
    const selectedBank = this.bankInfoList.find(bank => bank.BANK_ID === event.value);

    const propBankName = formDamageType === 'origin'
      ? 'BANK_NAME_ORIGIN'
      : 'BANK_NAME';

    const propBankId = formDamageType === 'origin'
      ? 'BANK_ID_ORIGIN'
      : 'BANK_ID';

    this.formDamageType3 = {
      ...this.formDamageType3,
      [propBankId]: selectedBank?.BANK_ID ?? null,
      [propBankName]: selectedBank?.BANK_NAME ?? null
    };
  }

  async getBankInfoList(): Promise<void> {
    try {
      const res: any = await this.servBankInfo.GetBankInfo().toPromise();
      if (res) {
        this.bankInfoList = res;
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
            this.listDamageValueType1 = [];
            break;
          case 2:
            this.listDamageValueType2 = [];
            break;
          case 3:
            this.listDamageValueType3 = [];
            break;
          case 4:
            this.listDamageValueType4 = [];
            break;
          case 5:
            this.listDamageValueType5 = [];
            break;
          case 6:
            this.listDamageValueType6 = [];
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

  mapBankToBankId(service: string): number {
    if (!service) return null;

    const s = service.trim();

    const mapping: Record<string, number> = {
      'ธนาคาร': 1,
      'พร้อมเพย์': 2,
      'เงินดิจิทัล (Cryptocurrency)': 4,
      'QR Code': 8,
      'Paypal': 5,
      'Max Card': 9,
      'เป๋าตังค์': 10,
      'ทรูมันนี่ วอลเล็ท (TrueMoney Wallet)': 3,
      'ช้อปปี้เพย์ (ShopeePay)': 11,
      'แรบบิท ไลน์ เพย์ (Rabbit LINE Pay)': 12,
      'อื่นๆ': 13
    };

    return mapping[s] ?? null;
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
      if (!this.formDamageType1?.BANK_DAMAGE_VALUE_BAHT || this.formDamageType1?.BANK_DAMAGE_VALUE_BAHT <= 0) {
        Swal.fire({
          icon: 'error',
          title: 'แจ้งเตือน',
          text: 'กรุณากรอกจำนวนเงินที่โอนให้ถูกต้อง',
        });
        return;
      }
      console.log('Form Damage Type 1 Submitted:', this.formDamageType1);
      this.formDamageType1.TYPE_BANK_ID = 1;
      this.formDamageType1.TYPE_DESTINATION_BANK_ID = this.mapBankToBankId(this.formDamageType1.BANK_TYPE);
      this.listDamageValueType1.push(this.formDamageType1);
      this.formDamageType1 = {};
      this.form1Added = false;
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
      if (!this.formDamageType2?.CRYPTO_AMOUNT_BATH || this.formDamageType2?.CRYPTO_AMOUNT_BATH <= 0) {
        Swal.fire({
          icon: 'error',
          title: 'แจ้งเตือน',
          text: 'กรุณากรอกจำนวนเงินที่โอนให้ถูกต้อง',
        });
        return;
      }
      console.log('Form Damage Type 2 Submitted:', this.formDamageType2);
      this.formDamageType2.TYPE_BANK_ID = 4;
      this.formDamageType2.TYPE_DESTINATION_BANK_ID = 4;
      this.listDamageValueType2.push(this.formDamageType2);
      this.formDamageType2 = {};
      this.form2Added = false;
    }
  }

  mapEwalletToBankId(service: string): number {
    if (!service) return null;

    const s = service.trim();

    const mapping: Record<string, number> = {
      'ธนาคาร': 1,
      'พร้อมเพย์': 2,
      'เงินดิจิทัล (Cryptocurrency)': 4,
      'QR Code': 8,
      'Paypal': 5,
      'Max Card': 9,
      'เป๋าตังค์': 10,
      'ทรูมันนี่ วอลเล็ท (TrueMoney Wallet)': 3,
      'ช้อปปี้เพย์ (ShopeePay)': 11,
      'แรบบิท ไลน์ เพย์ (Rabbit LINE Pay)': 12,
      'อื่นๆ': 13
    };

    return mapping[s] ?? null;
  }

  mapGiftCardToBankId(service: string): number {
    if (!service) return null;

    const s = service.trim();

    const mapping: Record<string, number> = {
      'บัตรของขวัญ Apple / iTunes': 14,
      'Razer Gold PIN': 15,
      'อื่นๆ': 16
    };

    return mapping[s] ?? null;
  }

  mapCreditCardToBankId(service: string): number {
    if (!service) return null;

    const s = service.trim();

    const mapping: Record<string, number> = {
      'VISA': 17,
      'Mastercard': 18,
    };

    return mapping[s] ?? null;
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
      console.log(this.formDamageType3?.EWALLET_AMOUNT);
      if (!this.formDamageType3?.EWALLET_AMOUNT || this.formDamageType3?.EWALLET_AMOUNT <= 0) {
        Swal.fire({
          icon: 'error',
          title: 'แจ้งเตือน',
          text: 'กรุณากรอกจำนวนเงินที่โอนให้ถูกต้อง',
        });
        return;
      }
      console.log('Form Damage Type 3 Submitted:', this.formDamageType3);
      this.formDamageType3.TYPE_BANK_ID = this.mapEwalletToBankId(this.formDamageType3.EWALLET_SERVICE_ORIGIN);
      this.formDamageType3.TYPE_DESTINATION_BANK_ID = this.mapEwalletToBankId(this.formDamageType3.EWALLET_SERVICE);
      this.listDamageValueType3.push(this.formDamageType3);
      this.formDamageType3 = {};
      this.form3Added = false;
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
      if (!this.formDamageType4?.GIFT_CARD_AMOUNT || this.formDamageType4?.GIFT_CARD_AMOUNT <= 0) {
        Swal.fire({
          icon: 'error',
          title: 'แจ้งเตือน',
          text: 'กรุณากรอกมูลค่าบัตรให้ถูกต้อง',
        });
        return;
      }
      console.log('Form Damage Type 4 Submitted:', this.formDamageType4);
      this.formDamageType4.TYPE_BANK_ID = this.mapGiftCardToBankId(this.formDamageType4.GIFT_CARD_TYPE);
      this.listDamageValueType4.push(this.formDamageType4);
      this.formDamageType4 = {};
      this.form4Added = false;
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
      if (!this.formDamageType5?.CARD_TRANSACTION_AMOUNT || this.formDamageType5?.CARD_TRANSACTION_AMOUNT <= 0) {
        Swal.fire({
          icon: 'error',
          title: 'แจ้งเตือน',
          text: 'กรุณากรอกจำนวนเงินที่เกิดรายการให้ถูกต้อง',
        });
        return;
      }
      console.log('Form Damage Type 5 Submitted:', this.formDamageType5);
      this.formDamageType5.TYPE_BANK_ID = this.mapCreditCardToBankId(this.formDamageType5.CARD_TYPE);
      this.listDamageValueType5.push(this.formDamageType5);
      this.formDamageType5 = {};
      this.form5Added = false;
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
      this.formDamageType1.TYPE_BANK_ID = 1;
      this.formDamageType1.TYPE_DESTINATION_BANK_ID = this.mapBankToBankId(this.formDamageType1.BANK_TYPE);
      this.listDamageValueType1[this.onEditIndexType1] = this.formDamageType1;
      this.onEditType1 = false;
      this.formDamageType1 = {};
      this.form1Added = false;
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
      this.listDamageValueType2[this.onEditIndexType2] = this.formDamageType2;
      this.onEditType2 = false;
      this.formDamageType2 = {};
      this.form2Added = false;
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
      this.formDamageType3.TYPE_BANK_ID = this.mapEwalletToBankId(this.formDamageType3.EWALLET_SERVICE_ORIGIN);
      this.formDamageType3.TYPE_DESTINATION_BANK_ID = this.mapEwalletToBankId(this.formDamageType3.EWALLET_SERVICE);
      this.listDamageValueType3[this.onEditIndexType3] = this.formDamageType3;
      this.onEditType3 = false;
      this.formDamageType3 = {};
      this.form3Added = false;
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
      this.formDamageType4.TYPE_BANK_ID = this.mapGiftCardToBankId(this.formDamageType4.GIFT_CARD_TYPE);
      this.listDamageValueType4[this.onEditIndexType4] = this.formDamageType4;
      this.onEditType4 = false;
      this.formDamageType4 = {};
      this.form4Added = false;
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
      this.formDamageType5.TYPE_BANK_ID = this.mapCreditCardToBankId(this.formDamageType5.CARD_BANK);
      this.listDamageValueType5[this.onEditIndexType5] = this.formDamageType5;
      this.onEditType5 = false;
      this.formDamageType5 = {};
      this.form5Added = false;
    }
  }

  onEditType1Clicked(index: number): void {
    console.log(index);
    this.onEditType1 = true;
    this.form1Added = true;
    this.onEditIndexType1 = index;
    this.formDamageType1 = { ...this.listDamageValueType1[index] };
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
        this.listDamageValueType1.splice(index, 1);
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
    this.form2Added = true;
    this.onEditIndexType2 = index;
    this.formDamageType2 = { ...this.listDamageValueType2[index] };
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
        this.listDamageValueType2.splice(index, 1);
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
    this.form3Added = true;
    this.onEditIndexType3 = index;
    this.formDamageType3 = { ...this.listDamageValueType3[index] };
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
        this.listDamageValueType3.splice(index, 1);
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
    this.form4Added = true;
    this.onEditIndexType4 = index;
    this.formDamageType4 = { ...this.listDamageValueType4[index] };
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
        this.listDamageValueType4.splice(index, 1);
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
    this.form5Added = true;
    this.onEditIndexType5 = index;
    this.formDamageType5 = { ...this.listDamageValueType5[index] };
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
        this.listDamageValueType5.splice(index, 1);
        Swal.fire({
          title: 'ลบข้อมูลเรียบร้อย',
          text: 'ข้อมูลถูกลบเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง'
        });
      }
    });
  }

  private createTextEditor(placeholder: string, maxLength?: number): any {
    return {
      placeholder,
      mode: 'text',
      readOnly: this.formType === 'view',
      maxLength: maxLength || null,
    };
  }

  private createMoneyEditor(placeholder: string, format = '#,##0.00'): any {
    return {
      placeholder,
      focusStateEnabled: false,
      format,
      showClearButton: true,
      readOnly: this.formType === 'view'
    };
  }

  private createDateTimeEditor(placeholder: string): any {
    console.log(this.maxDateValue);
    return {
      placeholder,
      displayFormat: 'yyyy-MM-dd HH:mm:ss',
      dateSerializationFormat: 'yyyy-MM-dd HH:mm:ss',
      type: 'datetime',
      max: this.maxDateValue,
      min: this.minDateValue,
      openOnFieldClick: true,
      acceptCustomValue: false,
      readOnly: this.formType === 'view',
      useMaskBehavior: true
    };
  }

  private createSelectBox(items: any[], placeholder: string, extra: any = {}): any {
    return {
      items,
      searchEnabled: true,
      showClearButton: true,
      readOnly: this.formType === 'view',
      placeholder,
      ...extra
    };
  }

  private createBankSelectBox(placeholder: string, onValueChanged?: (e: any) => void): any {
    return this.createSelectBox(this.bankInfoList, placeholder, {
      displayExpr: 'BANK_NAME',
      valueExpr: 'BANK_ID',
      readOnly: this.formType === 'view',
      onValueChanged
    });
  }

  private createAccountEditor(placeholder: string): any {
    return {
      placeholder,
      mode: 'text',
      mask: '00000000009999999999', // 10 ตัวบังคับ + 10 ตัวเลือก
      maskInvalidMessage: 'กรุณากรอกเฉพาะตัวเลข (10-20 หลัก)',
      showClearButton: true,
      readOnly: this.formType === 'view',
    };
  }

  sumTotolalDamageValue(): number {
    let total = 0;
    const sumType1 = this.listDamageValueType1.reduce((acc, curr) => acc + (Number(curr.BANK_DAMAGE_VALUE_BAHT) || 0), 0);
    const sumType2 = this.listDamageValueType2.reduce((acc, curr) => acc + (Number(curr.CRYPTO_AMOUNT_BATH) || 0), 0);
    const sumType3 = this.listDamageValueType3.reduce((acc, curr) => acc + (Number(curr.EWALLET_AMOUNT) || 0), 0);
    const sumType4 = this.listDamageValueType4.reduce((acc, curr) => acc + (Number(curr.GIFT_CARD_AMOUNT) || 0), 0);
    const sumType5 = this.listDamageValueType5.reduce((acc, curr) => acc + (Number(curr.CARD_TRANSACTION_AMOUNT) || 0), 0);
    const sumType6 = this.listDamageValueType6.reduce((acc, curr) => acc + (Number(curr.CASE_MONEY_BANK_OTHER_AMOUNT) || 0), 0);

    total = sumType1 + sumType2 + sumType3 + sumType4 + sumType5 + sumType6;
    return total;
  }

  get totalDamageValue(): number {
    return this.sumTotolalDamageValue();
  }

  get isCryptoNetworkOtherRequired(): boolean {
    return this.formDamageType2?.CRYPTO_NETWORK === 'อื่นๆ';
  }

  get isEwalletServiceOriginOtherRequired(): boolean {
    return this.formDamageType3?.EWALLET_SERVICE_ORIGIN === 'อื่นๆ';
  }

  get isEwalletServiceOtherRequired(): boolean {
    return this.formDamageType3?.EWALLET_SERVICE === 'อื่นๆ';
  }

  Back(e) {
    this.mainComponent.NextIndex(this.mainComponent.indexTab - 1);
  }

  SubmitForm(e) {
    if (this.totalDamageValue <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'แจ้งเตือน',
        text: 'กรุณากรอกข้อมูลความเสียหายอย่างน้อยหนึ่งรายการ',
      });
      return;
    }
    if (this.listDamageValueType1.length > 0 && this.BankRef.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'แจ้งเตือน',
        text: 'กรุณากรอกข้อมูลอ้างอิงเลขที่ธนาคาร',
      });
      return;
    }
    const setData = {
      listDamageValueType1: this.listDamageValueType1,
      listDamageValueType2: this.listDamageValueType2,
      listDamageValueType3: this.listDamageValueType3,
      listDamageValueType4: this.listDamageValueType4,
      listDamageValueType5: this.listDamageValueType5,
      listDamageValueType6: this.listDamageValueType6,
      TotalDamageValue: this.totalDamageValue,
    };
    const bankRefData = this.BankRef.length > 0 ? { BankRef: this.BankRef } : {};
    Object.assign(setData, bankRefData);
    this.mainComponent.formDataAll.formDamage = setData;
    localStorage.setItem("form-damage", JSON.stringify(setData));
    localStorage.setItem("form-damage-bank-ref", JSON.stringify(bankRefData));
    console.log(e);
    if (e != 'tab') {
      this.mainComponent.NextIndex(this.mainComponent.indexTab + 1);
    }
  }

  onsave(e) {
    if (
      !this.submission.FREEZE_ACT_DATE &&
      !this.submission.FREEZE_ACT_TIME
    ) {
      Swal.fire({
        title: 'ผิดพลาด!',
        text: 'กรุณาเลือกกรอกวันและเวลา',
        icon: 'warning',
        confirmButtonText: 'Ok',
      }).then(() => { });
      return;
    }
    if (!this.isBankID(this.submission.FREEZE_ACT_BANK_TRACK_NO)) {
      Swal.fire({
        title: 'ผิดพลาด!',
        html: 'กรุณาเลขอ้างอิงให้ถูกต้อง<br><b>ตัวอย่าง</b> 25550115KTB06111',
        icon: 'warning',
        confirmButtonText: 'Ok',
      }).then(() => { });
      return;
    }
    this.submission.FREEZE_ACT_BANK_TRACK_NO =
      this.submission.FREEZE_ACT_BANK_TRACK_NO.toUpperCase();
    if (this.bankRefEditIndex === -1) {
      this.BankRef.push(this.submission);
    } else {
      this.BankRef[this.bankRefEditIndex] = this.submission;
      this.bankRefEditIndex = -1;
    }
    this.submission = {};
    this.dateBankRef = null;
    this.formBankRefAdded = false;
    this.blockSave = true;
  }

  isBankID(bankid): boolean {
    const pattern = /^[A-Za-z0-9]+$/;
    return pattern.test(bankid);
  }

  async checkBank(e: any) {
    // ทำงานเฉพาะตอน event ไม่มี หรือเป็น change (กัน keypress / input จุกจิก)
    if (e?.event && e.event.type !== 'change') {
      return;
    }

    const value: string = (e?.value || '').toString().trim();
    if (!value) {
      return;
    }

    // 1) เช็คความยาวขั้นต่ำ
    if (value.length < this.BANK_MIN_LENGTH) {
      await this.showError(
        'ผิดพลาด!',
        'กรอกเลขอ้างอิงอย่างน้อย 15 หลัก',
        true
      );
      return;
    }

    // 2) เช็ค pattern ต้นสาย (ต้องขึ้นต้นด้วย 8 ตัวเลข)
    const dateMatch = value.match(/^\d{8}/);
    if (!dateMatch) {
      await this.showError(
        'ไม่ถูกต้อง',
        'เลข BANK CASE ID ไม่ถูกต้อง',
        true
      );
      return;
    }

    // 3) แปลงและเช็ควันที่ใน BANK CASE ID
    const dateString = dateMatch[0]; // YYYYMMDD
    const year = Number(dateString.substring(0, 4));
    const month = Number(dateString.substring(4, 6));
    const day = Number(dateString.substring(6, 8));

    if (month <= 0 || month > 12 || day <= 0 || day > 31) {
      await this.showError(
        'ไม่ถูกต้อง',
        'เลข BANK CASE ID ไม่ถูกต้อง',
        true
      );
      return;
    }

    const date =
      year > 2500
        ? new Date(year - 543, month - 1, day) // แปลง พ.ศ. เป็น ค.ศ.
        : new Date(year, month - 1, day);

    const today = new Date();
    if (date > today) {
      await this.showError(
        'ไม่ถูกต้อง',
        'เลข BANK CASE ID ไม่ถูกต้อง เนื่องจากวันที่ใน BANK CASE ID เกินกว่าวันปัจจุบัน',
        true
      );
      return;
    }

    if (date < this.BANK_DATE_MIN) {
      await this.showError(
        'ไม่ถูกต้อง',
        'เลข BANK CASE ID ไม่ถูกต้อง เนื่องจากปีใน BANK CASE ID น้อยกว่าปีกำหนด (พ.ศ.2566)',
        true
      );
      return;
    }

    // 4) เช็คว่าหลัง 8 หลัก มี BANK CODE (ตัวอักษร A-Z อย่างน้อย 3 ตัว)
    if (!this.BANK_CASE_PATTERN.test(value.toUpperCase())) {
      await this.showError(
        'ผิดพลาด!',
        'กรอกเลขอ้างอิงไม่ถูกต้อง',
        true
      );
      return;
    }

    // 5) ดึง bank code จากค่า เช่น 25681114SCB00033 => SCB
    const upperValue = value.toUpperCase();
    const bankCode = upperValue.replace(/\d+/g, ''); // ตัดเลขออก เหลือแต่ตัวอักษร

    // 6) map BANK_NAME
    if (bankCode === 'TMN') {
      this.submission.FREEZE_ACT_BANK_NAME = 'TrueMoney Wallet';
      this.blockSave = false;
    } else {
      try {
        const bankInfo = await this.servBankInfo
          .GetBankInfoByName(bankCode)
          .toPromise();

        if (bankInfo && bankInfo.length > 0) {
          this.submission.FREEZE_ACT_BANK_NAME = bankInfo[0].BANK_NAME;
          this.blockSave = false;
        } else {
          await this.showError(
            'ผิดพลาด!',
            'กรอกเลขอ้างอิงไม่ถูกต้อง',
            true
          );
          return;
        }
      } catch (err) {
        await this.showError(
          'ผิดพลาด!',
          'ไม่สามารถตรวจสอบข้อมูลธนาคารได้ กรุณาลองใหม่อีกครั้ง',
          true
        );
        return;
      }
    }

    // 7) เช็คว่ามีเลขอ้างอิงนี้ในระบบแล้วหรือยัง
    try {
      const haveBank = await this.servBankInfo
        .GetBankTrackNo(upperValue)
        .toPromise(); // ถ้าอนาคตอยากเปลี่ยน: firstValueFrom(...) ก็ได้

      if (haveBank.Value) {
        await this.showError(
          'ผิดพลาด!',
          'เลขอ้างอิงนี้มีการแจ้งแล้ว</br>รบกวนตรวจสอบคดีที่เคยบันทึกมาแล้ว',
          true,
          true // ใช้ html
        );
        return;
      }
    } catch (err) {
      await this.showError(
        'ผิดพลาด!',
        'ไม่สามารถตรวจสอบเลขอ้างอิงซ้ำได้ กรุณาลองใหม่อีกครั้ง',
        true
      );
      return;
    }
  }

  // helper สำหรับ Swal (ลด code ซ้ำ ๆ)
  private async showError(
    title: string,
    textOrHtml: string,
    resetBankName: boolean = false,
    useHtml: boolean = false
  ): Promise<void> {
    await Swal.fire({
      title,
      ...(useHtml ? { html: textOrHtml } : { text: textOrHtml }),
      icon: 'error',
      confirmButtonText: 'Ok',
    });

    if (resetBankName) {
      this.submission.FREEZE_ACT_BANK_NAME = '';
      this.blockSave = true;
    }
  }

  OnSelectDate(e) {
    if (e.value) {
      const mydate = this.datePipe.transform(e.value, 'yyyy-MM-dd');
      const mytime = this.datePipe.transform(e.value, 'HH:mm:ss');
      this.submission.FREEZE_ACT_TIME = mytime;
      this.submission.FREEZE_ACT_DATE = mydate;
    }
  }

  CheckBankID(event) {
    // const seperator  = '^[ก-๏\\s]+$';
    const seperator = '^[A-Za-z0-9]';
    const maskSeperator = new RegExp(seperator, 'g');
    const result = maskSeperator.test(event.key);
    return result;
  }
  PasteCheckBankID(event) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    // const seperator  = '^[ก-๏\\s]+$';
    const seperator = '^[A-Za-z0-9]';
    const maskSeperator = new RegExp(seperator, 'g');
    const result = maskSeperator.test(pastedText);
    return result;
  }

  onDeleteBankRef(index: number) {
    Swal.fire({
      title: 'ยืนยันการลบข้อมูล',
      text: 'คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.BankRef.splice(index, 1);
        Swal.fire({
          title: 'ลบข้อมูลเรียบร้อย',
          text: 'ข้อมูลถูกลบเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง'
        });
      }
    });
  }

  addShowForm(formId: string) {
    if (formId === '1') {
      this.form1Added = true;
    } else if (formId === '2') {
      this.form2Added = true;
    } else if (formId === '3') {
      this.form3Added = true;
    } else if (formId === '4') {
      this.form4Added = true;
    } else if (formId === '5') {
      this.form5Added = true;
    } else if (formId === 'BankRef') {
      this.formBankRefAdded = true;
    } else if (formId === '6') {
      this.form6Added = true;
    }
  }

  cancelShowForm(formId: string) {
    if (formId === '1') {
      this.form1Added = false;
      this.formDamageType1 = {};
    } else if (formId === '2') {
      this.form2Added = false;
      this.formDamageType2 = {};
    } else if (formId === '3') {
      this.form3Added = false;
      this.formDamageType3 = {};
    } else if (formId === '4') {
      this.form4Added = false;
      this.formDamageType4 = {};
    } else if (formId === '5') {
      this.form5Added = false;
      this.formDamageType5 = {};
    } else if (formId === 'BankRef') {
      this.formBankRefAdded = false;
      this.submission = {};
    } else if (formId === '6') {
      this.form6Added = false;
      this.formDamageType6 = {};
    }
  }

  onDamageType6Submit(form: DxFormComponent): void {
    if (!form.instance.validate().isValid) {
      Swal.fire({
        icon: 'error',
        title: 'แจ้งเตือน',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วนตามที่กำหนด',
      });
      return;
    } else {
      // 1. ค้นหาข้อมูลจาก WayOtherList เพียงครั้งเดียว (Correct Syntax)
      const selectedBank = this.WayOtherList.find(item => item.BANK_OTHER_ID == this.formDamageType6.CASE_MONEY_BANK_OTHER_ID);

      // 2. ตรวจสอบว่าเจอข้อมูลไหม เพื่อป้องกัน Error
      if (selectedBank) {
        // กำหนดค่า ID ซ้ำ (เผื่อกรณี Type ไม่ตรงกัน เช่น string vs number)
        this.formDamageType6.CASE_MONEY_BANK_OTHER_ID = selectedBank.BANK_OTHER_ID;
        this.formDamageType6.CASE_MONEY_BANK_OTHER_NAME = selectedBank.BANK_OTHER_NAME;
        this.formDamageType6.CASE_MONEY_BANK_OTHER_CODE = selectedBank.BANK_OTHER_CODE;
      }

      this.formDamageType6.CASE_MONEY_CHANNEL_TYPE = 'O';
      this.formDamageType6.TYPE_BANK_ID = 19;
      this.formDamageType6.BANK_DAMAGE_VALUE = this.formDamageType6.CASE_MONEY_BANK_OTHER_AMOUNT;
      this.formDamageType6.CASE_MONEY_BANK_OTHER_DETAIL_NAME = this.formDamageType6.CASE_MONEY_BANK_OTHER_DETAIL;

      // 3. Push ข้อมูลลง List (แนะนำให้ Clone Object เพื่อตัดการเชื่อมโยงข้อมูลเดิม)
      this.listDamageValueType6.push({ ...this.formDamageType6 });

      // 4. รีเซ็ตค่า
      this.formDamageType6 = {};
      this.form6Added = false;
    }
  }

  onDamageType6Update(form: DxFormComponent): void {
    // Logic to update existing entry
    if (!form.instance.validate().isValid) {
      Swal.fire({
        icon: 'error',
        title: 'แจ้งเตือน',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วนตามที่กำหนด',
      });
      return;
    } else {
      // 1. ค้นหาข้อมูลจาก WayOtherList เพียงครั้งเดียว (Correct Syntax)
      // 1. ค้นหาข้อมูลจาก WayOtherList เพียงครั้งเดียว (Correct Syntax)
      const selectedBank = this.WayOtherList.find(item => item.BANK_OTHER_ID == this.formDamageType6.CASE_MONEY_BANK_OTHER_ID);

      // 2. ตรวจสอบว่าเจอข้อมูลไหม เพื่อป้องกัน Error
      if (selectedBank) {
        // กำหนดค่า ID ซ้ำ (เผื่อกรณี Type ไม่ตรงกัน เช่น string vs number)
        this.formDamageType6.CASE_MONEY_BANK_OTHER_ID = selectedBank.BANK_OTHER_ID;
        this.formDamageType6.CASE_MONEY_BANK_OTHER_NAME = selectedBank.BANK_OTHER_NAME;
        this.formDamageType6.CASE_MONEY_BANK_OTHER_CODE = selectedBank.BANK_OTHER_CODE;
      }

      this.formDamageType6.CASE_MONEY_CHANNEL_TYPE = 'O';
      this.formDamageType6.TYPE_BANK_ID = 19;
      this.formDamageType6.BANK_DAMAGE_VALUE = this.formDamageType6.CASE_MONEY_BANK_OTHER_AMOUNT;
      this.formDamageType6.CASE_MONEY_BANK_OTHER_DETAIL_NAME = this.formDamageType6.CASE_MONEY_BANK_OTHER_DETAIL;

      this.listDamageValueType6[this.onEditIndexType6] = this.formDamageType6;
      this.onEditType6 = false;
      this.formDamageType6 = {};
      this.form6Added = false;
    }
  }

  onEditType6Clicked(index: number): void {
    this.onEditType6 = true;
    this.form6Added = true;
    this.onEditIndexType6 = index;
    this.formDamageType6 = { ...this.listDamageValueType6[index] };
  }

  onDeleteType6Clicked(index: number): void {
    Swal.fire({
      title: 'ยืนยันการลบข้อมูล',
      text: 'คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.listDamageValueType6.splice(index, 1);
        Swal.fire({
          title: 'ลบข้อมูลเรียบร้อย',
          text: 'ข้อมูลถูกลบเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง'
        });
      }
    });
  }

  get isBankAccountVisible(): boolean {
    const validTypes = [1, 2, 3, 10];
    // ตรวจสอบว่าค่า BANK_TYPE ปัจจุบัน อยู่ใน list ที่กำหนดหรือไม่
    return validTypes.includes(this.formDamageType1?.BANK_TYPE);
  }


}
