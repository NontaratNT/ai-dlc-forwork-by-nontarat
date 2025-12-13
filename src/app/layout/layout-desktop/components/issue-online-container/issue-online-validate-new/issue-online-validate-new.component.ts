import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IssueOnlineContainerComponent } from '../issue-online-container.component';
import { DxFileUploaderComponent, DxFormComponent, DxRadioGroupComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { ProvinceService } from 'src/app/services/province.service';
import { DistrictService } from 'src/app/services/district.service';
import { SubdistrictService } from 'src/app/services/subdistrict.service';
import { IOrganizeInfo, OrgService } from 'src/app/services/org.service';
import { ConvertDateService } from 'src/app/services/convert-date.service';
import { User } from 'src/app/services/user';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
import { OnlineCaseService } from 'src/app/services/online-case.service';
import { PersonalService } from 'src/app/services/personal.service';
import { IssueOnlineFileUploadService } from 'src/app/services/issue-online-file-upload.service';
import { FormConfigService } from 'src/app/services/form-service/form-config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-issue-online-validate-new',
  templateUrl: './issue-online-validate-new.component.html',
  styleUrls: ['./issue-online-validate-new.component.scss']
})
export class IssueOnlineValidateNewComponent implements OnInit {
  private readonly MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10 MB
  @ViewChild('formInformer1', { static: false }) formInformer1: DxFormComponent;
  @ViewChild('formInformer2', { static: false }) formInformer2: DxFormComponent;
  @ViewChild('formInformer2address', { static: false }) formInformer2address: DxFormComponent;

  @Input() formType: 'add' | 'edit' | 'view' = 'add';
  @Input() province: any[] = [];
  @Input() dataForm: any;
  public mainComponent: IssueOnlineContainerComponent;
  @ViewChild("form_popup_attachment", { static: false }) formAttachment: DxFormComponent;

  formReadOnly: boolean = false;
  formValidate: boolean = true;
  confirmSubmit: boolean = false;
  dswalkinstatuspolice: IOrganizeInfo[];
  cmstitle = [
    { TITLE_ID: "นาย", TITLE_NAME: "นาย" },
    { TITLE_ID: "นาง", TITLE_NAME: "นาง" },
    { TITLE_ID: "นางสาว", TITLE_NAME: "นางสาว" },
    { TITLE_ID: "อื่นๆ", TITLE_NAME: "อื่นๆ" },
  ];
  gender = [
    { GENDER_TYPE: "M", GENDER_DETAIL: "ชาย" },
    { GENDER_TYPE: "F", GENDER_DETAIL: "หญิง" },
    { GENDER_TYPE: "O", GENDER_DETAIL: "อื่น ๆ" },
  ];
  serviceLabelID = [
    { ID: 1, TEXT: "AIS" },
    { ID: 2, TEXT: "TRUE" },
    { ID: 3, TEXT: "DTAC" },
    { ID: 4, TEXT: "NT (CAT TOT)" },
    { ID: 5, TEXT: "อื่น ๆ" }
  ];
  radiocheckorganize = [
    { ID: 1, TEXT: "สถานีตำรวจ" },
    { ID: 2, TEXT: "กองบัญชาการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี" },
    { ID: 3, TEXT: "กองบัญชาการตำรวจสอบสวนกลาง (ลาดพร้าว)" }
  ];
  orgUnits = [
    {
      org_id: 3536,
      org_name: "บก.สอท.1",
      org_locations: ["ศูนย์ราชการแจ้งวัฒนะ จ.กรุงเทพฯ"],
      location_detail: "รับผิดชอบพื้นที่ของ กองบัญชาการตำรวจนครบาล (บช.น.)<br>• พื้นที่: กรุงเทพมหานคร"
    },
    {
      org_id: 3548,
      org_name: "บก.สอท.2",
      org_locations: ["เมืองทองธานี จ.นนทบุรี"],
      location_detail: "รับผิดชอบพื้นที่ของ ตำรวจภูธรภาค 1, ภาค 2 และ ภาค 7 <br> "
        + "• <b>ตำรวจภูธรภาค 1:</b> นนทบุรี, ปทุมธานี, สมุทรปราการ, พระนครศรีอยุธยา, อ่างทอง, สิงห์บุรี, ลพบุรี, ชัยนาท, สระบุรี <br> "
        + "• <b>ตำรวจภูธรภาค 2:</b> ชลบุรี, ระยอง, จันทบุรี, ตราด, ฉะเชิงเทรา, ปราจีนบุรี, สระแก้ว, นครนายก <br> "
        + "• <b>ตำรวจภูธรภาค 7:</b> นครปฐม, ราชบุรี, สุพรรณบุรี, กาญจนบุรี, สมุทรสาคร, สมุทรสงคราม, เพชรบุรี, ประจวบคีรีขันธ์"
    },
    {
      org_id: 3559,
      org_name: "บก.สอท.3",
      org_locations: ["1.ศูนย์ราชการแจ้งวัฒนะ จ.กรุงเทพฯ", "2.ถ.มิตรภาพ ต.ในเมือง อ.เมือง จ.ขอนแก่น"],
      location_detail: "รับผิดชอบพื้นที่ของ ตำรวจภูธรภาค 3 และ ภาค 4 <br> "
        + "• <b>ตำรวจภูธรภาค 3:</b> นครราชสีมา, บุรีรัมย์, สุรินทร์, ศรีสะเกษ, ชัยภูมิ <br> "
        + "• <b>ตำรวจภูธรภาค 4:</b> ขอนแก่น, มหาสารคาม, กาฬสินธุ์, ร้อยเอ็ด, อุดรธานี, หนองบัวลำภู, หนองคาย, เลย, สกลนคร, นครพนม, บึงกาฬ, มุกดาหาร"
    },
    {
      org_id: 3567,
      org_name: "บก.สอท.4",
      org_locations: ["1.ศูนย์ราชการแจ้งวัฒนะ จ.กรุงเทพฯ", "2.ต.ป่าแดด อ.เมืองเชียงใหม่ จ.เชียงใหม่"],
      location_detail: "รับผิดชอบพื้นที่ของ ตำรวจภูธรภาค 5 และ ภาค 6 <br> "
        + "• <b>ตำรวจภูธรภาค 5:</b> เชียงใหม่, เชียงราย, ลำพูน, ลำปาง, แม่ฮ่องสอน, พะเยา, แพร่, น่าน <br> "
        + "• <b>ตำรวจภูธรภาค 6:</b> พิษณุโลก, เพชรบูรณ์, พิจิตร, อุตรดิตถ์, กำแพงเพชร, สุโขทัย, ตาก, นครสวรรค์, อุทัยธานี"
    },
    {
      org_id: 3578,
      org_name: "บก.สอท.5",
      org_locations: ["1.ศูนย์ราชการแจ้งวัฒนะ จ.กรุงเทพฯ", "2.ต.บางกุ้ง อ.เมืองสุราษฎร์ธานี จ.สุราษฎร์ธานี"],
      location_detail: "รับผิดชอบพื้นที่ของ ตำรวจภูธรภาค 8 และ ภาค 9 <br> "
        + "• <b>ตำรวจภูธรภาค 8:</b> ชุมพร, สุราษฎร์ธานี, นครศรีธรรมราช, พังงา, ภูเก็ต, ระนอง, กระบี่ <br> "
        + "• <b>ตำรวจภูธรภาค 9:</b> ตรัง, พัทลุง, สงขลา, สตูล, ปัตตานี, ยะลา, นราธิวาส"
    }
  ];
  provinceResponsibility = [
    { province: "กรุงเทพมหานคร", org_name: "บก.สอท.1", org_id: 3536, province_id: 10 },
    { province: "นนทบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 12 },
    { province: "ปทุมธานี", org_name: "บก.สอท.2", org_id: 3548, province_id: 13 },
    { province: "สมุทรปราการ", org_name: "บก.สอท.2", org_id: 3548, province_id: 11 },
    { province: "พระนครศรีอยุธยา", org_name: "บก.สอท.2", org_id: 3548, province_id: 14 },
    { province: "อ่างทอง", org_name: "บก.สอท.2", org_id: 3548, province_id: 15 },
    { province: "สิงห์บุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 17 },
    { province: "ลพบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 16 },
    { province: "ชัยนาท", org_name: "บก.สอท.2", org_id: 3548, province_id: 18 },
    { province: "สระบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 19 },
    { province: "ชลบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 20 },
    { province: "ระยอง", org_name: "บก.สอท.2", org_id: 3548, province_id: 21 },
    { province: "จันทบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 22 },
    { province: "ตราด", org_name: "บก.สอท.2", org_id: 3548, province_id: 23 },
    { province: "ฉะเชิงเทรา", org_name: "บก.สอท.2", org_id: 3548, province_id: 24 },
    { province: "ปราจีนบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 25 },
    { province: "สระแก้ว", org_name: "บก.สอท.2", org_id: 3548, province_id: 27 },
    { province: "นครนายก", org_name: "บก.สอท.2", org_id: 3548, province_id: 26 },
    { province: "นครปฐม", org_name: "บก.สอท.2", org_id: 3548, province_id: 73 },
    { province: "ราชบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 70 },
    { province: "สุพรรณบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 72 },
    { province: "กาญจนบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 71 },
    { province: "สมุทรสาคร", org_name: "บก.สอท.2", org_id: 3548, province_id: 74 },
    { province: "สมุทรสงคราม", org_name: "บก.สอท.2", org_id: 3548, province_id: 75 },
    { province: "เพชรบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 76 },
    { province: "ประจวบคีรีขันธ์", org_name: "บก.สอท.2", org_id: 3548, province_id: 77 },
    { province: "นครราชสีมา", org_name: "บก.สอท.3", org_id: 3559, province_id: 30 },
    { province: "บุรีรัมย์", org_name: "บก.สอท.3", org_id: 3559, province_id: 31 },
    { province: "สุรินทร์", org_name: "บก.สอท.3", org_id: 3559, province_id: 32 },
    { province: "ศรีสะเกษ", org_name: "บก.สอท.3", org_id: 3559, province_id: 33 },
    { province: "ชัยภูมิ", org_name: "บก.สอท.3", org_id: 3559, province_id: 36 },
    { province: "ขอนแก่น", org_name: "บก.สอท.3", org_id: 3559, province_id: 40 },
    { province: "มหาสารคาม", org_name: "บก.สอท.3", org_id: 3559, province_id: 44 },
    { province: "กาฬสินธุ์", org_name: "บก.สอท.3", org_id: 3559, province_id: 46 },
    { province: "ร้อยเอ็ด", org_name: "บก.สอท.3", org_id: 3559, province_id: 45 },
    { province: "อุดรธานี", org_name: "บก.สอท.3", org_id: 3559, province_id: 41 },
    { province: "หนองบัวลำภู", org_name: "บก.สอท.3", org_id: 3559, province_id: 39 },
    { province: "หนองคาย", org_name: "บก.สอท.3", org_id: 3559, province_id: 43 },
    { province: "เลย", org_name: "บก.สอท.3", org_id: 3559, province_id: 42 },
    { province: "สกลนคร", org_name: "บก.สอท.3", org_id: 3559, province_id: 47 },
    { province: "นครพนม", org_name: "บก.สอท.3", org_id: 3559, province_id: 48 },
    { province: "บึงกาฬ", org_name: "บก.สอท.3", org_id: 3559, province_id: 38 },
    { province: "มุกดาหาร", org_name: "บก.สอท.3", org_id: 3559, province_id: 49 },
    { province: "อุบลราชธานี", org_name: "บก.สอท.3", org_id: 3559, province_id: 34 },
    { province: "ยโสธร", org_name: "บก.สอท.3", org_id: 3559, province_id: 35 },
    { province: "อำนาจเจริญ", org_name: "บก.สอท.3", org_id: 3559, province_id: 37 },
    { province: "เชียงใหม่", org_name: "บก.สอท.4", org_id: 3567, province_id: 50 },
    { province: "เชียงราย", org_name: "บก.สอท.4", org_id: 3567, province_id: 57 },
    { province: "ลำพูน", org_name: "บก.สอท.4", org_id: 3567, province_id: 51 },
    { province: "ลำปาง", org_name: "บก.สอท.4", org_id: 3567, province_id: 52 },
    { province: "แม่ฮ่องสอน", org_name: "บก.สอท.4", org_id: 3567, province_id: 58 },
    { province: "พะเยา", org_name: "บก.สอท.4", org_id: 3567, province_id: 56 },
    { province: "แพร่", org_name: "บก.สอท.4", org_id: 3567, province_id: 54 },
    { province: "น่าน", org_name: "บก.สอท.4", org_id: 3567, province_id: 55 },
    { province: "พิษณุโลก", org_name: "บก.สอท.4", org_id: 3567, province_id: 65 },
    { province: "เพชรบูรณ์", org_name: "บก.สอท.4", org_id: 3567, province_id: 67 },
    { province: "พิจิตร", org_name: "บก.สอท.4", org_id: 3567, province_id: 66 },
    { province: "อุตรดิตถ์", org_name: "บก.สอท.4", org_id: 3567, province_id: 53 },
    { province: "กำแพงเพชร", org_name: "บก.สอท.4", org_id: 3567, province_id: 62 },
    { province: "สุโขทัย", org_name: "บก.สอท.4", org_id: 3567, province_id: 64 },
    { province: "ตาก", org_name: "บก.สอท.4", org_id: 3567, province_id: 63 },
    { province: "นครสวรรค์", org_name: "บก.สอท.4", org_id: 3567, province_id: 60 },
    { province: "อุทัยธานี", org_name: "บก.สอท.4", org_id: 3567, province_id: 61 },
    { province: "ชุมพร", org_name: "บก.สอท.5", org_id: 3578, province_id: 86 },
    { province: "สุราษฎร์ธานี", org_name: "บก.สอท.5", org_id: 3578, province_id: 84 },
    { province: "นครศรีธรรมราช", org_name: "บก.สอท.5", org_id: 3578, province_id: 80 },
    { province: "พังงา", org_name: "บก.สอท.5", org_id: 3578, province_id: 82 },
    { province: "ภูเก็ต", org_name: "บก.สอท.5", org_id: 3578, province_id: 83 },
    { province: "ระนอง", org_name: "บก.สอท.5", org_id: 3578, province_id: 85 },
    { province: "กระบี่", org_name: "บก.สอท.5", org_id: 3578, province_id: 81 },
    { province: "ตรัง", org_name: "บก.สอท.5", org_id: 3578, province_id: 92 },
    { province: "พัทลุง", org_name: "บก.สอท.5", org_id: 3578, province_id: 93 },
    { province: "สงขลา", org_name: "บก.สอท.5", org_id: 3578, province_id: 90 },
    { province: "สตูล", org_name: "บก.สอท.5", org_id: 3578, province_id: 91 },
    { province: "ปัตตานี", org_name: "บก.สอท.5", org_id: 3578, province_id: 94 },
    { province: "ยะลา", org_name: "บก.สอท.5", org_id: 3578, province_id: 95 },
    { province: "นราธิวาส", org_name: "บก.สอท.5", org_id: 3578, province_id: 96 }
  ];
  evidenceTypes: EvidenceType[] = [
    {
      id: 'chat',
      label: 'ภาพหน้าจอการสนทนา (ตั้งแต่เริ่มต้นจนจบ)',
      description: 'ภาพหน้าจอการสนทนา (ตั้งแต่เริ่มต้นจนจบ)'
    },
    {
      id: 'transfer',
      label: 'สลิป/หลักฐานการโอนเงิน ทุกรายการ',
      description: 'สลิป/หลักฐานการโอนเงิน ทุกรายการ'
    },
    {
      id: 'profile',
      label: 'โปรไฟล์ของคนร้าย (เช่น หน้าโปรไฟล์ LINE, Facebook)',
      description: 'โปรไฟล์ของคนร้าย เช่น LINE, Facebook'
    },
    {
      id: 'url',
      label: 'ลิงก์ (URL) ของเว็บไซต์หรือแอปพลิเคชันที่เกี่ยวข้อง',
      description: 'ลิงก์ (URL) ของเว็บไซต์/แอปที่เกี่ยวข้อง'
    },
    {
      id: 'other',
      label: 'เอกสารอื่นๆ ที่เกี่ยวข้อง (เช่น หมายจับ, ใบโอน, ใบแจ้งหนี้)',
      description: 'เอกสารอื่นๆ ที่เกี่ยวข้อง'
    }
  ];

  selectedEvidenceType: string = 'chat';

  files: any[] = [];
  loadDateBox = false;
  minBirthDate: Date;
  maxBirthDate: Date;

  listAttachment: any = [];
  popupAttachment = false;
  popupForm: any = {};
  popupFormUploaded = false;
  popupViewFile = false;
  popupViewFileData: any = {};
  limitAttachmentSize = 0;
  maxSizeBuffer = 0;


  formData: any = {};
  Attachment: any[] = [];
  formCaseTypeNew: any = {};
  formChannelContac: any = {};
  formDamageDetail: any = {};
  formdataOrgsendcasewalkin: any = {};
  formDamageBankRef: any = {};
  cardAddress: any = {
    district: [],
    subDistrict: [],
    postcode: [],
    disableDistrict: true,
    disableSubDistrict: true,
    disablepostcode: true,
  };
  presentAddress: any = {
    district: [],
    subDistrict: [],
    postcode: [],
    disableDistrict: true,
    disableSubDistrict: true,
    disablepostcode: true,
  };
  orgUnitsNewWalkin: any;
  isLoading: boolean = false;

  checkboxaddresscard = false;

  _formBuilded: any = {};
  _formAttachment: any = {};
  _formConfig: any = {};
  isResettingUploader = false;


  fraudData: FraudRule[] = [
    { fraud_id: 1, fraud_sub_id: 1, fraud_tatic: 1, case_type_id: 71 },
    { fraud_id: 1, fraud_sub_id: 1, fraud_tatic: 2, case_type_id: 70 },
    { fraud_id: 1, fraud_sub_id: 1, fraud_tatic: 3, case_type_id: 73 },
    { fraud_id: 1, fraud_sub_id: 1, fraud_tatic: 4, case_type_id: 73 },
    { fraud_id: 1, fraud_sub_id: 1, fraud_tatic: 5, case_type_id: 70 },
    { fraud_id: 1, fraud_sub_id: 1, fraud_tatic: 6, case_type_id: null }, // ว่าง
    { fraud_id: 2, fraud_sub_id: 1, fraud_tatic: 1, case_type_id: 60 },
    { fraud_id: 2, fraud_sub_id: 1, fraud_tatic: 2, case_type_id: 60 },
    { fraud_id: 2, fraud_sub_id: 1, fraud_tatic: 3, case_type_id: 72 },
    { fraud_id: 2, fraud_sub_id: 1, fraud_tatic: 4, case_type_id: 60 },
    { fraud_id: 2, fraud_sub_id: 1, fraud_tatic: 5, case_type_id: null }, // ว่าง
    { fraud_id: 2, fraud_sub_id: 2, fraud_tatic: 1, case_type_id: null }, // ว่าง
    { fraud_id: 2, fraud_sub_id: 2, fraud_tatic: 2, case_type_id: null }, // ว่าง
    { fraud_id: 2, fraud_sub_id: 2, fraud_tatic: 3, case_type_id: null }, // ว่าง
    { fraud_id: 2, fraud_sub_id: 3, fraud_tatic: 1, case_type_id: null }, // ว่าง
    { fraud_id: 2, fraud_sub_id: 3, fraud_tatic: 2, case_type_id: 66 },
    { fraud_id: 2, fraud_sub_id: 3, fraud_tatic: 3, case_type_id: 67 },
    { fraud_id: 2, fraud_sub_id: 3, fraud_tatic: 4, case_type_id: 67 },
    { fraud_id: 2, fraud_sub_id: 3, fraud_tatic: 5, case_type_id: null }, // ว่าง
    { fraud_id: 3, fraud_sub_id: 1, fraud_tatic: 1, case_type_id: null }, // ว่าง
    { fraud_id: 3, fraud_sub_id: 1, fraud_tatic: 2, case_type_id: null }, // ว่าง
    { fraud_id: 3, fraud_sub_id: 1, fraud_tatic: 3, case_type_id: 62 },
    { fraud_id: 3, fraud_sub_id: 2, fraud_tatic: 1, case_type_id: 61 },
    { fraud_id: 3, fraud_sub_id: 2, fraud_tatic: 2, case_type_id: null }, // ว่าง
    { fraud_id: 3, fraud_sub_id: 2, fraud_tatic: 3, case_type_id: null }, // ว่าง
    { fraud_id: 3, fraud_sub_id: 3, fraud_tatic: 1, case_type_id: 66 },
    { fraud_id: 3, fraud_sub_id: 3, fraud_tatic: 2, case_type_id: null }, // ว่าง
    { fraud_id: 4, fraud_sub_id: 1, fraud_tatic: 1, case_type_id: 65 },
    { fraud_id: 4, fraud_sub_id: 1, fraud_tatic: 2, case_type_id: null }, // ว่าง
    { fraud_id: 4, fraud_sub_id: 1, fraud_tatic: 3, case_type_id: null }, // ว่าง
    { fraud_id: 4, fraud_sub_id: 1, fraud_tatic: 4, case_type_id: null }, // ว่าง
    { fraud_id: 4, fraud_sub_id: 1, fraud_tatic: 5, case_type_id: null }, // ว่าง
    { fraud_id: 4, fraud_sub_id: 2, fraud_tatic: 1, case_type_id: 63 },
    { fraud_id: 4, fraud_sub_id: 2, fraud_tatic: 2, case_type_id: 63 },
    { fraud_id: 4, fraud_sub_id: 2, fraud_tatic: 3, case_type_id: 67 },
    { fraud_id: 4, fraud_sub_id: 2, fraud_tatic: 4, case_type_id: null }, // ว่าง
    { fraud_id: 4, fraud_sub_id: 3, fraud_tatic: 1, case_type_id: 64 },
    { fraud_id: 4, fraud_sub_id: 3, fraud_tatic: 2, case_type_id: 64 },
    { fraud_id: 5, fraud_sub_id: 1, fraud_tatic: 1, case_type_id: null }, // ว่าง
    { fraud_id: 5, fraud_sub_id: 1, fraud_tatic: 2, case_type_id: null }, // ว่าง
    { fraud_id: 5, fraud_sub_id: 2, fraud_tatic: 1, case_type_id: null }, // ว่าง
    { fraud_id: 5, fraud_sub_id: 2, fraud_tatic: 2, case_type_id: null }, // ว่าง
    { fraud_id: 5, fraud_sub_id: 2, fraud_tatic: 3, case_type_id: null }, // ว่าง
    { fraud_id: 5, fraud_sub_id: 3, fraud_tatic: 1, case_type_id: null }, // ว่าง
    { fraud_id: 5, fraud_sub_id: 3, fraud_tatic: 2, case_type_id: null }, // ว่าง
    { fraud_id: 5, fraud_sub_id: 4, fraud_tatic: 1, case_type_id: null }, // ว่าง
    { fraud_id: 5, fraud_sub_id: 4, fraud_tatic: 2, case_type_id: null }, // ว่าง
  ];

  resultCaseTypeId: number | null = null;

  constructor(private serviceProvince: ProvinceService,
    private serviceDistrict: DistrictService,
    private serviceSubDistrict: SubdistrictService,
    private _OrgService: OrgService,
    private _date: ConvertDateService,
    private _onlineCaseServ: OnlineCaseService,
    private servicePersonal: PersonalService,
    private _issueFile: IssueOnlineFileUploadService,
    private _formConfigService: FormConfigService,
    private _router: Router,
  ) { }

  async ngOnInit(): Promise<void> {
    this.loadDataForm();
    this.loadPersonalData();
    this._OrgService.getorgwalkinall().
      subscribe(dsorgbyarialocation => {
        this.dswalkinstatuspolice = dsorgbyarialocation;
      }, error => {
        // if (error.status === 500 || error.status === 524) {
        //     this.mainConponent.checkReload(2);
        // }
      });

  }

  loadDataForm() {
    this.formCaseTypeNew = Object.assign({}, JSON.parse(localStorage.getItem("form-case-type-new"))) || {};
    this.formChannelContac = Object.assign({}, JSON.parse(localStorage.getItem("form-vaillain"))) || {};
    this.formDamageDetail = Object.assign({}, JSON.parse(localStorage.getItem("form-damage"))) || {};
    this.formDamageBankRef = Object.assign({}, JSON.parse(localStorage.getItem("form-damage-bank-ref"))) || {};
    this.minBirthDate = this._date.SetDateDefault(100, true, true, true);
    this.maxBirthDate = this._date.SetDateDefault(0);
    this.loadDateBox = true;
    this.checkFraudCase(this.formCaseTypeNew?.fraud_code, this.formCaseTypeNew?.fraud_sub_code, this.formCaseTypeNew?.fraud_tactic_id);
  }

  loadPersonalData() {
    const userId = User.Current.PersonalId;
    this.servicePersonal.GetPersonalById(userId)
      .subscribe(
        async personalInfo => {
          if (!personalInfo) {
            return;
          }

          // ---------- ก้อนข้อมูลพื้นฐาน ----------
          const {
            PERSONAL_FNAME_THA,
            PERSONAL_LNAME_THA,
            PERSONAL_EMAIL,
            PERSONAL_TEL_NO,
            PERSONAL_GENDER,
            PERSONAL_CITIZEN_NUMBER,
            TITLE_NAME,
            PERSONAL_BIRTH_DATE,
            HOME_REGISTER_ADDRESS,
            HOME_REGISTER_PROVINCE_ID,
            HOME_REGISTER_DISTICT_ID,
            HOME_REGISTER_SUB_DISTICT_ID,
            HOME_REGISTER_POST_CODE
          } = personalInfo;

          // เพศ: 1 = M, 2 = F, อื่น ๆ = null
          let gender: 'M' | 'F' | null = null;
          if (PERSONAL_GENDER === 1) {
            gender = 'M';
          } else if (PERSONAL_GENDER === 2) {
            gender = 'F';
          }

          // คำนำหน้า
          const normalTitles = ['นาย', 'นาง', 'นางสาว'];
          if (TITLE_NAME && normalTitles.includes(TITLE_NAME)) {
            this.formData.TITLE_ID = TITLE_NAME;
            this.formData.TITLE_NAME = null;        // กันค่าค้าง
          } else if (TITLE_NAME) {
            this.formData.TITLE_ID = 'อื่นๆ';
            this.formData.TITLE_NAME = TITLE_NAME;
          } else {
            this.formData.TITLE_ID = null;
            this.formData.TITLE_NAME = null;
          }

          // patch ฟิลด์หลัก ๆ ในก้อนเดียว
          this.formData = {
            ...this.formData, // กันเผื่อมีค่าอื่นอยู่แล้ว
            CASE_INFORMER_FIRSTNAME: PERSONAL_FNAME_THA ?? null,
            CASE_INFORMER_LASTNAME: PERSONAL_LNAME_THA ?? null,
            INFORMER_EMAIL: PERSONAL_EMAIL ?? null,
            INFORMER_TEL: PERSONAL_TEL_NO ?? null,
            CASE_INFORMER_GENDER: gender,
            INFORMER_GENDER_DETAIL: null,
            CASE_INFORMER_CITIZEN_NUMBER: PERSONAL_CITIZEN_NUMBER ?? null,
            CASE_INFORMER_DATE: this._date.ConvertToDate(PERSONAL_BIRTH_DATE),
            CASE_INFORMER_CARD_ADDRESS_NO: HOME_REGISTER_ADDRESS ?? null,
            INFORMER_CARD_PROVINCE: HOME_REGISTER_PROVINCE_ID ?? null,
            INFORMER_CARD_DISTRICT_ID: HOME_REGISTER_DISTICT_ID ?? null,
            INFORMER_CARD_SUB_DISTRICT_ID: HOME_REGISTER_SUB_DISTICT_ID ?? null,
            INFORMER_CARD_POSTCODE_ID: HOME_REGISTER_POST_CODE ?? null
          };

          // ---------- จัดการ address dropdown แบบ async ----------
          // (province/district/sub-district ไม่ได้ต้องพึ่งกันโดยตรง → fetch พร้อมกันได้)
          const tasks: Promise<void>[] = [];

          if (HOME_REGISTER_PROVINCE_ID) {
            tasks.push(
              this.serviceProvince
                .GetDistrictofProvince(HOME_REGISTER_PROVINCE_ID)
                .toPromise()
                .then(districts => {
                  this.cardAddress.district = districts;
                  this.cardAddress.disableDistrict = false;
                })
            );
          }

          if (HOME_REGISTER_DISTICT_ID) {
            tasks.push(
              this.serviceDistrict
                .GetSubDistrictOfDistrict(HOME_REGISTER_DISTICT_ID)
                .toPromise()
                .then(subDistricts => {
                  this.cardAddress.subDistrict = subDistricts;
                  this.cardAddress.disableSubDistrict = false;
                })
            );
          }

          await Promise.all(tasks);

          // sub-district + postcode ให้ formData ไปแล้วด้านบน
        },
        error => {
          if (error.status === 500 || error.status === 524) {
            // this.mainConponent.checkReload(2);
          }
        }
      );
  }

  ChangeRadioTitle(e: any) {
    //console.log(e.value);
  }

  citizenPattern(params) {
    const makeScope = new RegExp(
      '^[0-9]{1}[0-9]{4}[0-9]{5}[0-9]{2}[0-9]{1}$'
    );
    return makeScope.test(params.value);
  }

  CheckNumber(event) {
    // const seperator  = '^[ก-๏\\s]+$';
    const seperator = "^([0-9])";
    const maskSeperator = new RegExp(seperator, "g");
    const result = maskSeperator.test(event.key);
    return result;
  }
  PasteCheckNumber(event) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData("text");
    // const seperator  = '^[ก-๏\\s]+$';
    const seperator = "^([0-9])";
    const maskSeperator = new RegExp(seperator, "g");
    const result = maskSeperator.test(pastedText);
    return result;
  }

  NamePattern(params) {
    const seperator = new RegExp("^(นาย |นางสาว |นาง )", "g");
    const matched = params.value.match(seperator);
    return !matched;
  }

  NameValidator(event) {
    const makeScope = new RegExp("^[ก-๏]", "g");
    const result = makeScope.test(event.key);
    return result;
  }

  PhoneNumberPattern(params) {
    const makeScope = new RegExp("^[0](?=[0-9]{9,9}$)", "g");
    return makeScope.test(params.value);
  }

  EmailPatternCharacters(params) {
    // อีเมลสามารถมีตัวอักษร (a-z), ตัวเลข (0-9) และจุด (.) ได้ แต่ต้องไม่มีเครื่องหมาย &, =, ', +, (,), <, >, * ฯลฯ
    const makeScope = new RegExp("[^a-zA-Z0-9._@-]", "g");
    const result = params.value.match(makeScope);
    return !result;
  }

  EmailPatternDot(params) {
    // จุด (.) ห้ามติดกันมากกว่า 1 จุด
    const regex = /(\.\.)/g;
    const result = params.value.match(regex);
    return !result;
  }

  EmailPatternNameLength(params) {
    // ขึ้นต้นด้วยตัวอักษร
    const makeScope = new RegExp("^[A-Za-z]", "g");
    const result = params.value.match(makeScope);
    // ชื่อผู้ใช้ให้มีความยาว 6–30 ตัว
    const strLeng = params.value.split("@");
    const checkLength = strLeng[0].length >= 6 && strLeng[0].length < 35;
    return result && checkLength;
  }

  EmailPatternAtSign(params) {
    // กรุณาใส่เครื่องหมาย @
    const makeScope = new RegExp("@+@?", "g");
    return makeScope.test(params.value);
  }

  ChangeRadioGender(e: any) {
    //console.log(e.value);
  }

  OnSelectcardProvicePresent(e, tag: DxSelectBoxComponent) {
    this.cardAddress.district = [];
    this.cardAddress.subDistrict = [];
    this.cardAddress.postcode = [];
    this.cardAddress.disableDistrict = true;
    this.cardAddress.disablepostcode = true;
    this.cardAddress.disableSubDistrict = true;
    this.formData.INFORMER_CARD_DISTRICT_ID = undefined;
    this.formData.INFORMER_CARD_DISTRICT_NAME_THA = undefined;
    if (e.value) {
      const data = tag.instance.option("selectedItem");
      if (data) {
        this.formData.INFORMER_CARD_PROVINCE = data.PROVINCE_ID;
        this.formData.INFORMER_CARD_PROVINCE_NAME_THA =
          data.PROVINCE_NAME_THA;
      } else {
        this.formData.INFORMER_CARD_PROVINCE = e.value;
      }

      this.serviceProvince
        .GetDistrictofProvince(e.value)
        .subscribe((_) => {
          this.cardAddress.district = _;
          this.cardAddress.disableDistrict = false;
        });
    }
  }
  OnSelectDistrictCard(e, tag: DxSelectBoxComponent) {
    this.cardAddress.subDistrict = [];
    this.cardAddress.postcode = [];
    this.cardAddress.disableSubDistrict = true;
    this.cardAddress.disablepostcode = true;
    this.formData.INFORMER_CARD_SUB_DISTRICT_ID = undefined;
    this.formData.INFORMER_CARD_SUB_DISTRICT_NAME_THA = undefined;
    if (e.value) {
      const data = tag.instance.option("selectedItem");
      if (data) {
        this.formData.INFORMER_CARD_DISTRICT_ID = data.DISTRICT_ID;
        this.formData.INFORMER_CARD_DISTRICT_NAME_THA =
          data.DISTRICT_NAME_THA;
      } else {
        this.formData.INFORMER_CARD_DISTRICT_ID = e.value;
      }

      this.serviceDistrict
        .GetSubDistrictOfDistrict(e.value)
        .subscribe((_) => {
          this.cardAddress.subDistrict = _;
          this.cardAddress.disableSubDistrict = false;
        });
    }

  }
  OnSelectSubDistrictCard(e, tag: DxSelectBoxComponent) {
    this.cardAddress.postcode = [];
    this.cardAddress.disablepostcode = true;
    this.formData.INFORMER_CARD_POSTCODE = undefined;
    if (e.value) {
      const data = tag.instance.option("selectedItem");
      if (data) {
        this.formData.INFORMER_CARD_SUB_DISTRICT_ID = data.SUB_DISTRICT_ID;
        this.formData.INFORMER_CARD_SUB_DISTRICT_NAME_THA =
          data.SUB_DISTRICT_NAME_THA;
        this.formData.INFORMER_CARD_POSTCODE = data.POSTCODE;
      } else {
        this.formData.INFORMER_CARD_SUB_DISTRICT_ID = e.value;
      }

      this.serviceSubDistrict.GetPostCode(e.value)
        .subscribe((_) => {
          this.cardAddress.postcode = _;
          this.cardAddress.disablepostcode = false;
        });
    }
  }

  OnSelectPoliceMain(e: any, tag: DxRadioGroupComponent) {
    this.formdataOrgsendcasewalkin = {};
    if (e.value === 1) {
      this.formData.WALKIN_POLICE_STATION_ID = null;
      this.formData.ORG_LOCATION_WALKIN_TYPE = 1;
    } else if (e.value === 2) {
      this.formData.ORG_PROVINCE_OFFICER_ID = undefined;
      this.formData.WALKIN_POLICE_STATION = undefined;
      if (e.value === 2) {
        this.formData.WALKIN_POLICE_STATION_ID = null;
        this.formData.ORG_LOCATION_WALKIN_TYPE = 2;
      }
    } else if (e.value === 3) {
      this.formData.ORG_PROVINCE_OFFICER_ID = undefined;
      this.formData.WALKIN_POLICE_STATION = undefined;
      if (e.value === 3) {
        this.formData.ORG_LOCATION_WALKIN_TYPE = 3;
        this.formData.WALKIN_POLICE_STATION_ID = 2375;
        this.formData.ORG_LOCATION_ID = 2375;
        this.formData.WALKIN_POLICE_STATION = "กองบัญชาการตำรวจสอบสวนกลาง";
      }
    }
  }

  OnSelectProvicePresentlocationWalkin(e, tag: DxSelectBoxComponent) {
    if (e.value) {
      const data =
        tag.instance.option(
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

  Onorglocationwalkin(e: any, tag: DxSelectBoxComponent) {
    const data = tag.instance.option("selectedItem");
    if (data) {
      this.formData.ORG_LOCATION_WALKIN_TYPE = 1;
      this.formData.WALKIN_POLICE_STATION = data.ORGANIZE_NAME_THA;
      this.formData.ORG_PROVINCE_OFFICER_ID = Number(data.ORGANIZE_ARIA_CODE);
      this.formData.ORG_LOCATION_ID = data.ORGANIZE_ID;
    } else {
      this.formData.WALKIN_POLICE_STATION = e.value;
    }
  }

  OnSelectProviceCCIBWalkin(e, tag: DxSelectBoxComponent) {
    if (e.value) {
      const data = tag.instance.option("selectedItem");
      if (data) {
        this.formData.ORG_PROVINCE_ID_CCIB_WALKIN_ID = data.PROVINCE_ID;
        this.formData.ORG_PROVINCE_CCIB_WALKIN_NAME = data.PROVINCE_NAME_THA;
        const orgValue = this.provinceResponsibility.filter((r) => r.province_id === data.PROVINCE_ID);
        this.orgUnitsNewWalkin = this.orgUnits.filter((r) => r.org_id === orgValue[0]?.org_id);
        this.formdataOrgsendcasewalkin.ORG_LOCATION_MAIN_WALKIN_ID = orgValue[0]?.org_id;
        this.formData.ORG_LOCATION_WALKIN_TYPE = 2;
        this.formData.WALKIN_POLICE_STATION_ID = orgValue[0]?.org_id;
        this.formData.WALKIN_POLICE_STATION = orgValue[0]?.org_name;
      } else {
        this.formData.ORG_PROVINCE_ID_CCIB_WALKIN_ID = e.value;
      }
    }
  }

  onvaluechangeorgmainwalkin(e) {
    this.formData.ORG_PROVINCE_MAP_AREA_ID = null;
    this.formData.ORG_PROVINCE_MAP_AREA_NAME = null;

    if (!e.value) return;

    // Reset all ORG_LOCATION_MAIN_WALKIN_ID fields
    this.formdataOrgsendcasewalkin[`ORG_LOCATION_MAIN_WALKIN_ID`] = null;
    this.formdataOrgsendcasewalkin[`ORG_LOCATION_MAIN_WALKIN_NAME`] = null;

    // Filter the selected organization
    const selectedData = this.orgUnits.find((r) => r.org_id === e.value);
    if (!selectedData) return;

    // Set selected values
    this.formdataOrgsendcasewalkin.ORG_LOCATION_WALKIN_TYPE = 2;
    this.formdataOrgsendcasewalkin[`ORG_LOCATION_MAIN_WALKIN_ID`] = selectedData.org_id;
    this.formdataOrgsendcasewalkin[`ORG_LOCATION_MAIN_WALKIN_NAME`] = selectedData.org_name;

    // Assign values to formData for insertion
    this.formData.ORG_LOCATION_WALKIN_TYPE = 2;
    this.formData.WALKIN_POLICE_STATION_ID = selectedData.org_id;
    this.formData.ORG_LOCATION_ID = selectedData.org_id;
    this.formData.WALKIN_POLICE_STATION = selectedData.org_name;
  }
  PopupUploadAdd() {
    this.popupAttachment = true;
    this.popupForm = {};
    this.popupFormUploaded = false;
    this.maxSizeBuffer = this.limitAttachmentSize ?? 0;
  }
  PopupUploadDelete(index = null) {
    Swal.fire({
      title: 'ยืนยันการลบข้อมูล?',
      text: " ",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#7d7d7d',
      cancelButtonText: 'ยกเลิก',
      confirmButtonText: 'ตกลง'
    }).then((result) => {
      if (result.isConfirmed) {
        this.limitAttachmentSize -= this.listAttachment[index].size ?? 0;
        this.listAttachment.splice(index, 1);
      }
    });
  }

  async FilesDroppedAttachment(e) {
    const files = e;
    if (files.length === 1) {
      this.isLoading = true;
      const fileCheck = await this._issueFile.CheckFileUploadAllowMaxSize(this.maxSizeBuffer, files[0].file);

      if (fileCheck.status) {
        this.maxSizeBuffer = fileCheck.uploadSizeAll ?? 0;
        const fileName = (this.popupForm.originalName) ? this.popupForm.originalName : fileCheck.filebase64.originalName;
        fileCheck.filebase64.originalName = fileName;
        this.popupForm = fileCheck.filebase64;
        this.popupFormUploaded = true;
      }
      this.isLoading = false;

    }
  }

  CheckArray(data: any = []) {
    const countArray = data.length ?? 0;
    if (countArray > 0) {
      return true;
    }
    return false;

  }

  OpenFileDialogAttachment(uploadTag) {
    uploadTag.value = "";
    uploadTag.click();
  }

  async UploadFileAttachment(uploadTag) {
    const files: any = uploadTag.files;
    if (files.length === 1) {
      this.isLoading = true;
      const fileCheck = await this._issueFile.CheckFileUploadAllowMaxSize(this.maxSizeBuffer, files[0]);

      if (fileCheck.status) {
        this.maxSizeBuffer = fileCheck.uploadSizeAll ?? 0;
        const fileName = (this.popupForm.originalName) ? this.popupForm.originalName : fileCheck.filebase64.originalName;
        fileCheck.filebase64.originalName = fileName;
        this.popupForm = fileCheck.filebase64;
        this.popupFormUploaded = true;
      }
      this.isLoading = false;

    }
  }

  ClearDocBufferAttachment() {
    this.popupFormUploaded = false;
    this.maxSizeBuffer -= this.popupForm.size ?? 0;
    this.popupForm = {};
    this.formAttachment.instance._refresh();

  }

  PopupUploadSave() {
    const form = this.popupForm ?? undefined;
    const fileBase64 = form.url ?? undefined;
    if (!fileBase64) {
      return this.ShowInvalidDialog();
    }
    this.listAttachment.push(this.popupForm);
    this.limitAttachmentSize = this.maxSizeBuffer ?? 0;
    this.PopupUploadClose();
  }

  PopupUploadClose() {
    this.popupForm = {};
    // this.formAttachment.instance._refresh();
    this.popupFormUploaded = false;
    this.popupAttachment = false;
  }

  ShowInvalidDialog() {
    Swal.fire({
      title: "ผิดพลาด!",
      text: "กรุณากรอกข้อมูลให้ครบ",
      icon: "warning",
      confirmButtonText: "Ok",
    }).then(() => { });
  }

  OnSelectProvicePresent(e, tag: DxSelectBoxComponent) {
    this.presentAddress.district = [];
    this.presentAddress.subDistrict = [];
    this.presentAddress.postcode = [];
    this.presentAddress.disableDistrict = true;
    this.presentAddress.disablepostcode = true;
    this.presentAddress.disableSubDistrict = true;
    this.formData.INFORMER_DISTRICT_ID = undefined;
    this.formData.INFORMER_DISTRICT_NAME_THA = undefined;
    if (e.value) {
      const data =
        tag.instance.option("selectedItem");
      if (data) {
        this.formData.INFORMER_PROVINCE = data.PROVINCE_ID;
        this.formData.INFORMER_PROVINCE_NAME_THA =
          data.PROVINCE_NAME_THA;
      } else {
        this.formData.INFORMER_PROVINCE = e.value;
      }

      this.serviceProvince
        .GetDistrictofProvince(e.value)
        .subscribe((_) => {
          this.presentAddress.district = _;
          this.presentAddress.disableDistrict = false;
        });
    }
  }

  OnSelectDistrictPresent(e, tag: DxSelectBoxComponent) {
    this.presentAddress.subDistrict = [];
    this.presentAddress.postcode = [];
    this.presentAddress.disableSubDistrict = true;
    this.presentAddress.disablepostcode = true;
    this.formData.INFORMER_SUB_DISTRICT_ID = undefined;
    this.formData.INFORMER_SUB_DISTRICT_NAME_THA = undefined;
    if (e.value) {
      const data =
        tag.instance.option("selectedItem");
      if (data) {
        this.formData.INFORMER_DISTRICT_ID = data.DISTRICT_ID;
        this.formData.INFORMER_DISTRICT_NAME_THA =
          data.DISTRICT_NAME_THA;
      } else {
        this.formData.INFORMER_DISTRICT_ID = e.value;
      }

      this.serviceDistrict
        .GetSubDistrictOfDistrict(e.value)
        .subscribe((_) => {
          this.presentAddress.subDistrict = _;
          this.presentAddress.disableSubDistrict = false;
        });
    }
  }

  OnSelectSubDistrictPresent(e, tag: DxSelectBoxComponent) {
    this.presentAddress.postcode = [];
    this.presentAddress.disablepostcode = true;

    if (e.value) {
      const data =
        tag.instance.option("selectedItem");
      if (data) {
        this.formData.INFORMER_SUB_DISTRICT_ID = data.SUB_DISTRICT_ID;
        this.formData.INFORMER_SUB_DISTRICT_NAME_THA =
          data.SUB_DISTRICT_NAME_THA;
      } else {
        this.formData.INFORMER_SUB_DISTRICT_ID = e.value;
      }

      this.serviceSubDistrict.GetPostCode(e.value).subscribe((_) => {
        this.presentAddress.postcode = _;
        this.presentAddress.disablepostcode = false;
        this.formData.INFORMER_POSTCODE_CODE = _[0].POSTCODE_CODE;
      });
    }
  }

  onvaluecheckaddresscard(e) {
    if (e.value) {
      this.formData.CASE_INFORMER_ADDRESS_NO =
        this.formData.CASE_INFORMER_CARD_ADDRESS_NO;
      this.formData.INFORMER_PROVINCE =
        this.formData.INFORMER_CARD_PROVINCE;
      this.serviceProvince
        .GetDistrictofProvince(this.formData.INFORMER_CARD_PROVINCE)
        .subscribe((_) => {
          this.presentAddress.district = _;
          this.presentAddress.disableDistrict = false;

          this.formData.INFORMER_DISTRICT_ID =
            this.formData.INFORMER_CARD_DISTRICT_ID;
        });

      setTimeout(() => {
        this.serviceDistrict
          .GetSubDistrictOfDistrict(
            this.formData.INFORMER_CARD_DISTRICT_ID
          )
          .subscribe((_) => {
            this.presentAddress.subDistrict = _;
            this.presentAddress.disableSubDistrict = false;
            this.formData.INFORMER_SUB_DISTRICT_ID =
              this.formData.INFORMER_CARD_SUB_DISTRICT_ID;
          });
      }, 500);
    }
  }

  Back(e) {
    // this.mainConponent.IssueOnlineStep = 2;
  }

  get hasCaseTypeNew(): boolean {
    return !!this.formCaseTypeNew && Object.keys(this.formCaseTypeNew).length > 0;
  }

  get hasChannelContact(): boolean {
    return !!this.formChannelContac && Object.keys(this.formChannelContac).length > 0;
  }

  get hasDamageDetail(): boolean {
    return !!this.formDamageDetail && Object.keys(this.formDamageDetail).length > 0;
  }

  getEvidenceDescription(id: string): string {
    const found = this.evidenceTypes.find(x => x.id === id);
    return found?.description ?? '';
  }

  async onFilesSelected(e: any): Promise<void> {
    if (this.isResettingUploader) {
      this.isResettingUploader = false;
      return;
    }

    const fileList: File[] = e.value || [];
    if (!fileList.length) {
      return;
    }

    // 1) ขนาดรวมปัจจุบัน
    const currentTotalSize = this.files.reduce((sum: number, f: any) => {
      return sum + (f.size || 0);
    }, 0);

    // 2) ขนาดรวมไฟล์ใหม่
    const newFilesTotalSize = fileList.reduce((sum, f) => sum + f.size, 0);
    const totalAfterAdd = currentTotalSize + newFilesTotalSize;

    // 3) เกิน 10MB -> ไม่อนุญาต
    if (totalAfterAdd > this.MAX_TOTAL_SIZE) {
      Swal.fire({
        title: 'ขนาดไฟล์รวมต้องไม่เกิน 10MB',
        icon: 'warning',
        confirmButtonText: 'ตกลง'
      });

      this.isResettingUploader = true;
      e.component.option('value', []);
      return;
    }

    // 4) ไม่เกิน 10MB -> แปลงทุกไฟล์เป็น base64 แล้ว push
    for (const f of fileList) {
      const dataUrl = await this.readFileAsBase64(f);   // data:xxx;base64,AAAA...

      // ถ้าอยากได้เฉพาะตัว base64
      // const base64 = dataUrl.split(',')[1];

      this.files.push({
        storage: 'base64',
        name: 'file',
        url: dataUrl,
        file: f,                  // << ตอนนี้เป็น base64 แล้ว
        originalName: f.name,
        size: f.size,
        sizeDetail: this.formatSize(f.size),
        type: f.type,
        fileType: this.selectedEvidenceType,
        dateNow: new Date(),
      });
    }
  }

  private readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);          // ได้เป็น data:...;base64,AAAA...
      };

      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }


  removeFile(row: EvidenceFile): void {
    const idx = this.files.indexOf(row);
    if (idx > -1) {
      this.files.splice(idx, 1);
    }
  }

  previewFile(row: EvidenceFile): void {
    // ตัวอย่างง่าย ๆ: เปิดไฟล์ใน tab ใหม่ (เฉพาะกรณียังอยู่ใน memory ฝั่ง browser)
    const url = URL.createObjectURL(row.file);
    window.open(url, '_blank');
  }

  onBrowseClick(uploader: DxFileUploaderComponent): void {
    const element = uploader.instance?.element() as HTMLElement;
    const input = element.querySelector('input[type="file"]') as HTMLInputElement;
    input?.click();
  }

  private formatSize(size: number): string {
    if (size === 0 || !size) { return '0 B'; }
    const units = ['B', 'kB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(1024));
    const value = size / Math.pow(1024, i);
    return `${value.toFixed(2)} ${units[i]}`;
  }

  getFileTypeName(fileType: string): string {
    const found = this.evidenceTypes.find(x => x.id === fileType);
    return found?.label ?? '';
  }

  SubmitForm() {
    if (!this.formInformer1.instance.validate().isValid) {
      const vform1 = this.formInformer1.instance.validate().brokenRules;
      Swal.fire({
        title: "ผิดพลาด!",
        text: "กรุณากรอกข้อมูล {} ให้ครบ".replace("{}", vform1[0]?.message ?? ""),
        icon: "warning",
        confirmButtonText: "ตกลง"
      });
      return;
    }
    if (!this.formInformer2.instance.validate().isValid) {
      const vform2 = this.formInformer2.instance.validate().brokenRules;
      Swal.fire({
        title: "ผิดพลาด!",
        text: "กรุณากรอกข้อมูล {} ให้ครบ".replace("{}", vform2[0]?.message ?? ""),
        icon: "warning",
        confirmButtonText: "ตกลง"
      });
      return;
    }
    if (!this.formInformer2address.instance.validate().isValid) {
      const vform2address = this.formInformer2address.instance.validate().brokenRules;
      Swal.fire({
        title: "ผิดพลาด!",
        text: "กรุณากรอกข้อมูล {} ให้ครบ".replace("{}", vform2address[0]?.message ?? ""),
        icon: "warning",
        confirmButtonText: "ตกลง"
      });
      return;
    }
    this.checkFraudCase(this.formCaseTypeNew?.fraud_code, this.formCaseTypeNew?.fraud_sub_code, this.formCaseTypeNew?.fraud_tactic_id);
    this.formData.CASE_INFORMER_DATE_STR = this.formData?.CASE_INFORMER_DATE ? this._date.ConvertToDateFormat(this.formData.CASE_INFORMER_DATE) : null;
    this.formData.CASE_TYPE_ID = this.resultCaseTypeId || 74; // ประเภทคดี Fraud
    const payload = {
      PersonalId: User.Current.PersonalId,
      CaseTypeId: this.resultCaseTypeId || 74,
      FraudChanelId: this.formCaseTypeNew?.fraud_channel || 0,
      FraudCodeId: this.formCaseTypeNew?.fraud_code || 0,
      CaseTypeSubId: this.formCaseTypeNew?.fraud_sub_code || 0,
      FraudTacticId: this.formCaseTypeNew?.fraud_tactic_id || 0,
      OrganizeId: this.formData.ORG_LOCATION_ID,
      Body: {
        formData: this.formData,
        DamageDetail: this.formDamageDetail,
        formCaseTypeNew: this.formCaseTypeNew,
        formChannelContac: this.formChannelContac,
        Attachment: this.files || [],
        BankRef: this.formDamageBankRef?.BankRef || [],
      },
    };
    console.log(payload);
    // return;
    Swal.fire({
      title: "ยืนยันการแจ้งเรื่องเข้าสู่ระบบ!!",
      text:
        "การแจ้งความออนไลน์เป็นการอำนวยความสะดวกแก่ท่านในการร้องทุกข์และแจ้งความประสงค์" +
        "ให้อายัดเงินที่โอนเข้าไปในบัญชีคนร้ายและผู้เกี่ยวข้องโดยเร็ว " +
        "ทันสถานการณ์ และท่านต้องไปให้ปากคำต่อพนักงานสอบสวนตามที่นัดหมาย เพื่อให้เป็นไปตามกฏหมายกำหนด" +
        "ระบบจะส่งเรื่องไปที่หน่วยงานที่เกี่ยวข้อง กรุณาตรวจสอบข้อมูลก่อนกดยืนยัน",
      icon: "warning",
      confirmButtonText: "ยืนยัน",
      showCancelButton: true,
      cancelButtonText: "กลับไปแก้ไข",
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this._onlineCaseServ
          .InsertPreCase(payload)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((_) => {
            Swal.fire({
              title: "ระบบได้รับเรื่องของท่านเรียบร้อยแล้ว!",
              html: `เลขรับแจ้งความ (Case Reference Number):<br><b>${(_)} </b><br>
                        คำแนะนำขั้นตอนต่อไป (Immediate Next Steps): <br>
                        สิ่งที่ต้องทำทันที:<br>
                        1️⃣ อายัดบัญชี: หากท่านยังไม่ได้ทำ โปรดติดต่อธนาคารของท่านทันทีเพื่อแจ้งอายัดธุรกรรมไปยังบัญชีปลายทาง<br>
                        2️⃣ รักษาหลักฐาน: โปรดรวบรวมหลักฐานทั้งหมดเก็บไว้ในที่ปลอดภัย<br>
                        สิ่งที่คาดว่าจะเกิดขึ้น:<br>
                        ท่านจะได้รับการติดต่อจากเจ้าหน้าที่ตำรวจภายใน 24 ชั่วโมงเพื่อสอบถามข้อมูลเพิ่มเติม`,
              icon: "success",
              confirmButtonText: "ตกลง",
            }).then(() => {
              this.handleSuccessNavigation();
            });
          });
      } else {
        this.isLoading = false;
        // console.log();
      }
    });
  }

    private handleSuccessNavigation(): void {
    const itemsToRemove = [
      'form-case-type-new',
      'form-informer',
      'form-damage-bank-ref',
      'form-damage',
      'form-vaillain',
      'form-index',
    ];

    itemsToRemove.forEach((item) => {
      localStorage.removeItem(item);
    });

   this._router.navigate(["/main/task-list"]);
  }



  getCaseTypeId(fId: number | null, fSubId: number | null, fTatic: number | null): number {

    // Logic เดิมทำงานได้เลย ไม่ต้องแก้ไส้ใน
    const foundRule = this.fraudData.find(rule =>
      rule.fraud_id === fId &&
      rule.fraud_sub_id === fSubId &&
      rule.fraud_tatic === fTatic
    );

    // ถ้า input เป็น null -> หาไม่เจอ -> foundRule เป็น undefined -> เข้าเงื่อนไข ?? 74
    return foundRule?.case_type_id ?? 74;
  }

  // ฟังก์ชัน Helper สำหรับเรียกใช้และเก็บค่า (Optional)
  checkFraudCase(fId: number, fSubId: number, fTatic: number): void {
    this.resultCaseTypeId = this.getCaseTypeId(fId, fSubId, fTatic);
    console.log(`Input: ${fId}, ${fSubId}, ${fTatic} => Result Case Type: ${this.resultCaseTypeId}`);
  }



}


interface EvidenceFile {
  file: File;
  name: string;
  size: number;
  sizeText: string;
  type: string;
}

interface EvidenceType {
  id: string;
  label: string;
  description: string;
}

export interface FraudRule {
  fraud_id: number;
  fraud_sub_id: number;
  fraud_tatic: number;
  case_type_id?: number | null; // ใส่ ? หรือ | null เพราะบางบรรทัดในตารางไม่มีค่า
}