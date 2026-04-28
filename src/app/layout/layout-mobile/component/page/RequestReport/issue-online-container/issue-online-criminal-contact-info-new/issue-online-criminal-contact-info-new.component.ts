import { Component, DoCheck, Input, OnInit, ViewChild } from '@angular/core';
import { BankInfoService } from 'src/app/services/bank-info.service';
import { DxFormComponent, DxSelectBoxComponent } from 'devextreme-angular';
import Swal from 'sweetalert2';
import { FormValidatorService } from 'src/app/services/form-validator.service';
import { IssueOnlineFileUploadService } from 'src/app/services/issue-online-file-upload.service';
import { IssueOnlineContainerComponent } from '../issue-online-container.component';
import { DatePipe } from '@angular/common';
import { IssueOnlineService } from 'src/app/services/issue-online.service';
import { formatSize, ValidateUrl } from 'src/app/common/helper';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-issue-online-criminal-contact-info-new',
    templateUrl: './issue-online-criminal-contact-info-new.component.html',
    styleUrls: ['./issue-online-criminal-contact-info-new.component.scss']
})

export class IssueOnlineCriminalContactInfoNewComponent implements OnInit, DoCheck {

    public mainConponent: IssueOnlineContainerComponent;
    @ViewChild("selectCaseType", { static: false }) selectCaseType: DxSelectBoxComponent;
    @ViewChild("formEvent1", { static: false }) formEvent1: DxFormComponent;
    @ViewChild("formPhone", { static: false }) formPhone: DxFormComponent;
    @ViewChild("formSms", { static: false }) formSms: DxFormComponent;
    @ViewChild("formOther", { static: false }) formOther: DxFormComponent;

    @Input() dataForm: any;

    @Input() formType: string = "add"; // add , edit , view

    formReadOnly = false;
    formData: any = {};
    listCaseType = [];
    caseType = "";
    caseOpen = false;
    isLoading = false;
    formChannelValidate = true;
    dataAttachment: any = [];
    maxDateValue: Date = new Date();
    maxSizeBuffer = 0;
    _fileName: string;
    popupFormUploaded = false;
    _fileSize: number;
    _fileForm: any = {};
    popupAttachment = false;

    serviceLabelID = [
        { ID: 1, TEXT: "AIS" },
        { ID: 2, TEXT: "TRUE" },
        { ID: 3, TEXT: "DTAC" },
        { ID: 4, TEXT: "NT (CAT TOT)" },
        { ID: 5, TEXT: "อื่นๆ" }
    ];

    destinationType = [
        { ID: 1, TEXT: "หมายเลขโทรศัพท์" },
        { ID: 2, TEXT: "ชื่อผู้ส่ง" }
    ]

    socialType = [
        'LINE',
        'FACEBOOK',
        // 'MESSENGER',
        'INSTAGRAM',
        'WEBSITE',
        // 'EMAIL',
        // 'TELEGRAM',
        // 'WHATSAPP',
        'TWITTER',
        'TIKTOK',
        'อื่นๆ',
    ];

    fileType = [
        'เบอร์โทรศัพท์',
        'SMS',
        'LINE',
        'FACEBOOK',
        // 'MESSENGER',
        'INSTAGRAM',
        'WEBSITE',
        // 'EMAIL',
        // 'TELEGRAM',
        // 'WHATSAPP',
        'TWITTER',
        'TIKTOK',
        'อื่นๆ'
    ];
    typeSelected = [];
    fileTypeSelectedValue = '';
    fileTypeSelected = false;

    appState: {
        checkOtherTel: boolean;
        checkOtherSms: boolean;
        checkOtherSocial: boolean;
    } = {
            checkOtherTel: false,
            checkOtherSms: false,
            checkOtherSocial: false
        };
    isOCPB = false;

    popupForm: any = {};
    limitAttachmentSize = 5 * 1024 * 1024; // 5 MB

    listAttachment: any = [];

    today = new Date();
    minDateValue: Date = new Date(this.today.getFullYear() - 2, this.today.getMonth(), this.today.getDate());

    //  Zone new Code
    @ViewChild('form1', { static: false }) form1: DxFormComponent;
    @ViewChild('form2', { static: false }) form2: DxFormComponent;
    @ViewChild('form3', { static: false }) form3: DxFormComponent;

    // Requirement 1.2: Popular Prefixes
    popularPrefixes = [
        { ID: '08', TEXT: '08 (มือถือ)', length: 8 },
        { ID: '09', TEXT: '09 (มือถือ)', length: 8 },
        { ID: '06', TEXT: '06 (มือถือ)', length: 8 },
        { ID: '02', TEXT: '02 (เบอร์บ้าน/กทม.)', length: 7 },
        { ID: '03', TEXT: '03 (เบอร์ภาคกลาง)', length: 7 },
        { ID: '04', TEXT: '04 (เบอร์ภาคอีสาน)', length: 7 },
        { ID: '05', TEXT: '05 (เบอร์ภาคเหนือ)', length: 7 },
        { ID: '07', TEXT: '07 (เบอร์ภาคใต้)', length: 7 },
        { ID: '+66', TEXT: '+66 (สากล)', length: 9 },
        { ID: 'อื่นๆ', TEXT: 'อื่นๆ (กรอกเอง)', length: -1 }
    ];

    //  Zone new Code
    facebookList = [
        { ID: 1, TEXT: "โฆษณา (Sponsored Ad)" },
        { ID: 2, TEXT: "โพสต์ใน Marketplace" },
        { ID: 3, TEXT: "โพสต์ในกลุ่ม (Group)" },
        { ID: 4, TEXT: "เขาส่งข้อความหาฉันทาง Messenger ก่อน" },
        { ID: 5, TEXT: "อื่นๆ" }
    ];
    datingAppList = [
        { ID: 1, TEXT: "Tinder" },
        { ID: 2, TEXT: "Bumble" },
        { ID: 3, TEXT: "Omi" },
        { ID: 4, TEXT: "Coffee Meets Bagel" },
        { ID: 5, TEXT: "อื่นๆ" }
    ];
    otherList = [
        { ID: "email", TEXT: "อีเมล" },
        { ID: "website", TEXT: "เว็บไซต์หางาน" },
        { ID: "other", TEXT: "อื่นๆ" },
    ];
    websiteCharacter = [
        { ID: 1, TEXT: "เว็บไซต์ลงทุนปลอม (แสดงกราฟ, ตัวเลขกำไร)" },
        { ID: 2, TEXT: "เว็บไซต์ร้านค้าออนไลน์ปลอม (หลอกขายของ)" },
        { ID: 3, TEXT: "เว็บไซต์ปลอมที่เลียนแบบหน้าล็อกอิน (เช่น ธนาคาร, Facebook)" },
        { ID: 4, TEXT: "เว็บไซต์หน่วยงานราชการปลอม (เช่น กรมสรรพากร, กรมที่ดิน)" },
        { ID: 5, TEXT: "อื่นๆ" }
    ];
    installAppMethod = [
        { ID: 1, TEXT: "ติดตั้งผ่านลิงก์ที่คนร้ายส่งให้ (เป็นไฟล์ .apk นอก App Store/Play Store)" },
        { ID: 2, TEXT: "ฉันดาวน์โหลดเองจาก \nApp Store หรือ Google Play Store" }
    ];

    installAppSubMethod = [
        { ID: 1, TEXT: "อ้างว่าเป็นแอปฯ กรมสรรพากร (เพื่อรับเงินคืนภาษี)" },
        { ID: 2, TEXT: "อ้างว่าเป็นแอปฯ การไฟฟ้า/การประปา (เพื่อรับเงินคืนค่าไฟ)" },
        { ID: 3, TEXT: "อ้างว่าเป็นแอปฯ ของหน่วยงานจัดส่งพัสดุ" },
        { ID: 4, TEXT: "อ้างว่าเป็นแอปฯ สำหรับทำงานออนไลน์" },
        { ID: 5, TEXT: "อื่นๆ" },
    ];

    installAppAfterMethod = [
        { ID: 1, TEXT: "หน้าจอดับไปเอง หรือค้าง" },
        { ID: 2, TEXT: "มีการแจ้งเตือนแปลกๆ เด้งขึ้นมา" },
        { ID: 3, TEXT: "โทรศัพท์ทำงานช้าลงอย่างเห็นได้ชัด" },
        { ID: 4, TEXT: "ไม่สามารถควบคุมโทรศัพท์ได้" },
        { ID: 5, TEXT: "เงินถูกโอนออกจากบัญชีโดยไม่รู้ตัว" },
    ];

    socialPlatformOption = [
        { ID: 1, TEXT: "กลุ่ม LINE / LINE OA" },
        { ID: 2, TEXT: "กลุ่ม Facebook (Private Group)" },
        { ID: 3, TEXT: "เพจ Facebook (Facebook Page)" },
        { ID: 4, TEXT: "กลุ่ม Telegram" },
        { ID: 5, TEXT: "อื่นๆ" },
    ];

    telephoneCallOption = [
        { ID: 1, TEXT: "สั่งให้ไปที่ตู้ ATM/CDM" },
        { ID: 2, TEXT: "สั่งให้เปิดคอมพิวเตอร์และทำตาม" },
        { ID: 3, TEXT: "ส่งลิงก์มาให้ทาง SMS หรือ LINE เพื่อให้กดเข้าไป" },
        { ID: 4, TEXT: "ขอรีโมทหน้าจอ หรือขอให้แชร์หน้าจอผ่านแอปฯ" },
        { ID: 5, TEXT: "ไม่ได้สั่งให้ทำอะไรเป็นพิเศษ แค่พูดคุยและข่มขู่เท่านั้น" },

    ];

    telephoneCall2Option = [
        { ID: 1, TEXT: "มีการส่งภาพหมายจับ/เอกสารราชการปลอมมาให้" },
        { ID: 2, TEXT: "มีการใช้เสียงประกอบที่เหมือนอยู่ในสถานีตำรวจ" },
        { ID: 3, TEXT: "มีการโอนสายให้คุยกับคนที่อ้างว่าเป็นเจ้าหน้าที่หลายคน" },
        { ID: 4, TEXT: "ไม่มีการใช้หลักฐานปลอม" },
    ];

    controlDeviceOption = [
        { ID: 'Y', TEXT: "ใช่" },
        { ID: 'N', TEXT: "ไม่ใช่" }
    ];

    controlDevice2Option = [
        { ID: 'Y', TEXT: "ทราบ" },
        { ID: 'N', TEXT: "ไม่ทราบ" }
    ];

    phoneScamTypeList = [
        { ID: 'SMS', TEXT: "ส่งข้อความมาหลอก" },
        { ID: 'PHONE', TEXT: "โทรศัพท์มาหลอก" }
    ];

    smsSenderTypeList = [
        { ID: 'NAME', TEXT: "ทราบชื่อที่ส่งข้อความ" },
        { ID: 'NUMBER', TEXT: "ทราบเบอร์ที่ส่งข้อความ" }
    ];

    // controlDeviceSubOption = [
    //     { ID: 1, TEXT: "แอปการไฟฟ้า (PEA), การประปา" },
    //     { ID: 2, TEXT: "แอปการไฟฟ้า (PEA), การประปา" },
    //     { ID: 3, TEXT: "แอป DSI, ตำรวจ, หน่วยงานรัฐ" },
    //     { ID: 4, TEXT: "แอปให้กู้เงิน" },
    //     { ID: 5, TEXT: "แอปขนส่ง (Flash, ไปรษณีย์ไทย)" },
    //     { ID: 6, TEXT: "อื่นๆ (เช่น แอปดูดวง, แอปหาคู่)" },
    // ];
    controlDeviceSubOption = [
        { ID: 1, TEXT: "แอบอ้างการไฟฟ้า / การประปา (PEA / MEA / การประปา)" },
        { ID: 2, TEXT: "แอบอ้างหน่วยงานรัฐ (ตำรวจ / DSI / ศาล / ปปง. / สรรพากร)" },
        { ID: 3, TEXT: "แอปกู้เงิน / เงินด่วน, แอปลงทุน / เทรด / คริปโต" },
        { ID: 4, TEXT: "แอบอ้างแอปขนส่ง / พัสดุ (Flash, ไปรษณีย์ไทย, ขนส่งเอกชน)" },
        { ID: 5, TEXT: "อื่น ๆ (เช่น แอปดูดวง, แอปหาคู่, แอปงานออนไลน์)" },
    ];

    // transfersPlatformSubOption = [
    //     { ID: 1, TEXT: "แพลตฟอร์ม \"ลงทุน/เทรด\" (เช่น หลอกเทรดหุ้น, ทอง, Crypto โดยเห็นกำไรปลอมในพอร์ต)" },
    //     { ID: 2, TEXT: "แพลตฟอร์ม \"ทำงาน/ภารกิจ\" (เช่น หลอกให้กดไลก์, กดรับออเดอร์ Shopee, รีวิวสินค้า โดยต้อง 'สำรองเงิน' โอนเข้าไปก่อน)" },
    //     { ID: 3, TEXT: "แพลตฟอร์ม \"แชร์ลูกโซ่\" (เข้า พ.ร.ก. กู้ยืมเงินฯ เช่น ออมเงิน/ออมทอง ชวนคนมาลงทุนต่อ)" },
    // ];
    transfersPlatformSubOption = [
        { ID: 1, TEXT: "แพลตฟอร์ม \"ลงทุน/เทรด\" (เช่น หุ้น ทองคำ คริปโต มีหน้าแสดงกำไร/ขาดทุนในระบบ)" },
        { ID: 2, TEXT: "แพลตฟอร์ม \"ทำงาน/ภารกิจ\" (เช่น กดไลก์ กดออเดอร์ รีวิวสินค้า ต้องโอนเงินก่อนเริ่มงาน)" },
        { ID: 3, TEXT: "แพลตฟอร์ม \"แชร์ลูกโซ่\" (เช่น ออมเงิน ออมทอง ฝากยอด แล้วมีการชักชวนให้นำเงินไปต่อยอด)" },
    ];

    hackPasswordOption = [
        { ID: 1, TEXT: "หลอกให้กรอก Username/Password ใน 'เว็บปลอม' (Phishing) (เช่น หน้าเว็บธนาคารปลอม) แล้วคนร้ายนำรหัสไปโอนเงินเอง" },
        { ID: 2, TEXT: "ถูก 'แฮ็ก' บัญชีโซเชียล (Facebook, Line) หรืออีเมล โดยที่ท่านไม่ได้บอกรหัสผ่าน" },
    ];

    // trickTransferMoneySubOption = [
    //     { ID: 1, TEXT: "ซื้อสินค้า/บริการ (แต่ไม่ได้ของ, จองที่พักปลอม ฯลฯ)" },
    //     { ID: 2, TEXT: "Call Center อ้างเป็นเจ้าหน้าที่รัฐ (ตำรวจ, DSI, ไปรษณีย์) ข่มขู่ (และท่าน \"กดโอนเอง\" เพื่อตรวจสอบ)" },
    //     { ID: 3, TEXT: "สร้างความสัมพันธ์ (หลอกให้รัก (Romance Scam) หรือ ปลอมเป็นเพื่อน/ญาติ ยืมเงิน)" },
    //     { ID: 4, TEXT: "เสนอผลประโยชน์ (หลอกให้กู้เงิน (ขอค่าธรรมเนียม) หรือ หลอกให้รับรางวัล)" },
    //     { ID: 5, TEXT: "หลอกว่าจะช่วยเหลือ (อ้างเป็นทนาย/ตำรวจไซเบอร์ ช่วยคดีเก่า แต่ขอค่าดำเนินการ)" },
    // ];
    trickTransferMoneySubOption = [
        { ID: 1, TEXT: "การซื้อขายสินค้า/บริการ(เช่น สั่งซื้อสินค้าไม่ได้ของ จองที่พัก มัดจำ ค่าดำเนินการ)" },
        { ID: 2, TEXT: "อ้างเป็นเจ้าหน้าที่หรือหน่วยงาน (เช่น ตำรวจ DSI ศาล ไปรษณีย์ ธนาคาร ข่มขู่ หรือโอนเพื่อตรวจสอบ)" },
        { ID: 3, TEXT: "อ้างความสัมพันธ์ (เช่น คนรู้จักเพื่อน ญาติ คนรัก ขอให้ช่วยโอนเงิน ยืมเงิน)" },
        { ID: 4, TEXT: "อ้างผลประโยชน์ (เช่น ถูกรางวัล สิทธิพิเศษ คืนเงินค่าธรรมเนียม)" },
        { ID: 5, TEXT: "อ้างว่าจะช่วยเหลือ (เช่น ช่วยติดตามเงิน คืนเงิน แก้คดี)" },
    ];

    configFormOption1: ChannelFormConfig[] = [
        {
            id: 'PHONE',
            name: 'โทรศัพท์',
            formOption: [
                {
                    templateName: 'PHONE_SCAM_TYPE',
                    dataField: 'PHONE_SCAM_TYPE',
                    caption: 'ลักษณะการหลอกโทรศัพท์',
                    fieldType: 'radiobox',
                    required: true,
                    options: this.phoneScamTypeList,
                    displayExpr: 'TEXT',
                    valueExpr: 'ID'
                },
                
                // --- ส่วนข้อมูล SMS (กรณีเลือก 'ส่งข้อความมาหลอก') ---
                {
                    templateName: 'SMS_SENDER_TYPE',
                    dataField: 'SMS_SENDER_TYPE',
                    caption: 'ข้อมูลผู้ส่ง',
                    fieldType: 'radiobox',
                    required: true,
                    options: this.smsSenderTypeList,
                    displayExpr: 'TEXT',
                    valueExpr: 'ID',
                    visibleWhen: {
                        dataField: 'PHONE_SCAM_TYPE',
                        values: ['SMS']
                    }
                },
                {
                    templateName: 'SMS_SENDER_NAME',
                    dataField: 'SMS_SENDER',
                    caption: 'ชื่อผู้ส่ง (Sender Name)',
                    placeholder: 'เช่น ชื่อบริษัท, LINE, DSI (ระบุเป็นตัวอักษรได้)',
                    fieldType: 'textbox',
                    maxLength: 50,
                    required: true,
                    visibleWhen: {
                        dataField: 'SMS_SENDER_TYPE',
                        values: ['NAME']
                    }
                },
                {
                    templateName: 'CRIMINAL_PHONE_LIST',
                    dataField: 'CRIMINAL_PHONE_LIST',
                    caption: 'เบอร์โทรศัพท์ของคนร้ายที่ส่ง SMS',
                    fieldType: 'multiPhoneWithPrefix',
                    required: true,
                    visibleWhen: {
                        dataField: 'SMS_SENDER_TYPE',
                        values: ['NUMBER']
                    }
                },
                {
                    templateName: 'VICTIM_PHONE_LIST_SMS',
                    dataField: 'VICTIM_PHONE',
                    caption: 'เบอร์โทรศัพท์ของคุณที่ได้รับ SMS',
                    fieldType: 'phoneWithPrefix',
                    required: true,
                    visibleWhen: {
                        dataField: 'PHONE_SCAM_TYPE',
                        values: ['SMS']
                    }
                },
                {
                    templateName: 'SMS_MESSAGE_TEMP',
                    dataField: 'SMS_MESSAGE',
                    caption: 'คัดลอกข้อความใน SMS มาวาง',
                    placeholder: 'ข้อความใน SMS',
                    fieldType: 'textarea',
                    maxLength: 100,
                    visibleWhen: {
                        dataField: 'PHONE_SCAM_TYPE',
                        values: ['SMS']
                    }
                },
                {
                    templateName: 'SMS_LINK_TEMP',
                    dataField: 'SMS_LINK',
                    caption: 'ลิงก์ที่แนบมาใน SMS (ถ้ามี)',
                    placeholder: 'ลิงก์ (URL)',
                    fieldType: 'textbox',
                    maxLength: 100,
                    type: 'url',
                    visibleWhen: {
                        dataField: 'PHONE_SCAM_TYPE',
                        values: ['SMS']
                    }
                },
                {
                    templateName: 'SMS_DATE_TIME_TEMP',
                    dataField: 'SMS_DATE_TIME',
                    caption: 'วัน/เวลา ที่ได้รับข้อความ',
                    placeholder: 'วัน/เวลา ที่ได้รับข้อความ',
                    fieldType: 'datebox',
                    type: 'datetime',
                    required: true,
                    visibleWhen: {
                        dataField: 'PHONE_SCAM_TYPE',
                        values: ['SMS']
                    }
                },
                {
                    templateName: 'EVIDENCE_SMS_FILE',
                    dataField: 'EVIDENCE_ATTACHMENT',
                    caption: 'แนบรูปภาพหน้าจอข้อความ SMS (สำคัญต่อการดำเนินคดี)',
                    fieldType: 'file',
                    required: true,
                    visibleWhen: {
                        dataField: 'PHONE_SCAM_TYPE',
                        values: ['SMS']
                    }
                },

                // --- ส่วนข้อมูลโทรศัพท์ (กรณีเลือก 'โทรศัพท์มาหลอก') ---
                {
                    templateName: 'PHONE_NUMBER_LIST',
                    dataField: 'PHONE_NUMBER_LIST',
                    caption: 'เบอร์โทรศัพท์ของคนร้ายที่โทรเข้ามา',
                    fieldType: 'multiPhoneWithPrefix',
                    required: true,
                    visibleWhen: {
                        dataField: 'PHONE_SCAM_TYPE',
                        values: ['PHONE']
                    }
                },
                {
                    templateName: 'VICTIM_PHONE_LIST_CALL',
                    dataField: 'VICTIM_PHONE',
                    caption: 'เบอร์โทรศัพท์ของคุณที่ใช้ติดต่อ/รับสาย',
                    fieldType: 'phoneWithPrefix',
                    required: true,
                    visibleWhen: {
                        dataField: 'PHONE_SCAM_TYPE',
                        values: ['PHONE']
                    }
                },
                {
                    templateName: 'PHONE_CARRIER_TEMP',
                    dataField: 'PHONE_CARRIER',
                    caption: 'เครือข่าย (ถ้าทราบ)',
                    placeholder: 'เลือกเครือข่าย',
                    fieldType: 'selectbox',
                    options: this.serviceLabelID,
                    displayExpr: 'TEXT',
                    valueExpr: 'TEXT',
                    visibleWhen: {
                        dataField: 'PHONE_SCAM_TYPE',
                        values: ['PHONE']
                    }
                },
                {
                    templateName: 'PHONE_OTHER_GROUP',
                    dataField: '',
                    caption: 'รายละเอียดอื่นๆ',
                    fieldType: 'group',
                    visibleWhen: {
                        dataField: 'PHONE_CARRIER',
                        values: ['อื่นๆ']
                    },
                    children: [
                        {
                            templateName: 'PHONE_OTHER_DETAIL',
                            dataField: 'PHONE_CARRIER_OTHER',
                            caption: 'รายละเอียดอื่นๆ',
                            placeholder: 'ระบุรายละเอียดอื่นๆ',
                            fieldType: 'textbox',
                            maxLength: 100,
                            required: true
                        },
                    ]
                },
                {
                    templateName: 'PHONE_ORG_TEMP',
                    dataField: 'PHONE_ORG',
                    caption: 'อ้างว่าเป็นเบอร์จากหน่วยงานใด (ถ้ามี)',
                    fieldType: 'textbox',
                    maxLength: 100,
                    visibleWhen: {
                        dataField: 'PHONE_SCAM_TYPE',
                        values: ['PHONE']
                    }
                },
                {
                    templateName: 'PHONE_DATE_TIME_TEMP',
                    dataField: 'PHONE_DATE_TIME',
                    caption: 'วัน/เวลา ที่ได้รับสาย',
                    placeholder: 'วัน/เวลา ที่ได้รับสาย',
                    fieldType: 'datebox',
                    type: 'datetime',
                    required: true,
                    visibleWhen: {
                        dataField: 'PHONE_SCAM_TYPE',
                        values: ['PHONE']
                    }
                },
                {
                    templateName: 'EVIDENCE_PHONE_FILE',
                    dataField: 'EVIDENCE_ATTACHMENT',
                    caption: 'แนบรูปภาพประวัติการโทร (สำคัญต่อการดำเนินคดี)',
                    fieldType: 'file',
                    required: true,
                    visibleWhen: {
                        dataField: 'PHONE_SCAM_TYPE',
                        values: ['PHONE']
                    }
                }
            ]
        },

        {
            id: 'FACEBOOK',
            name: 'Facebook/Messenger',
            formOption: [
                {
                    templateName: 'FACEBOOK_TEMP_1',
                    dataField: 'FACEBOOK_PROFILE_NAME',
                    caption: 'ชื่อโปรไฟล์ / ชื่อเพจ',
                    placeholder: 'ชื่อโปรไฟล์ / ชื่อเพจ',
                    fieldType: 'textbox',
                    maxLength: 100,
                    required: true
                },
                {
                    templateName: 'FACEBOOK_TEMP_2',
                    dataField: 'FACEBOOK_KNOW_URL',
                    caption: 'ทราบลิงค์ (URL) ของโปรไฟล์/เพจ หรือไม่',
                    placeholder: 'ทราบลิงค์ (URL) ของโปรไฟล์/เพจ หรือไม่',
                    fieldType: 'radiobox',            // จะ map ไป dxRadioGroup
                    required: true,
                    options: this.controlDevice2Option,
                    displayExpr: 'TEXT',
                    valueExpr: 'ID'
                },
                {
                    templateName: 'FACEBOOK_TEMP_3',
                    dataField: 'FACEBOOK_PROFILE_URL',
                    caption: 'ลิงก์ (URL) ของโปรไฟล์ / เพจ',
                    placeholder: 'ลิงก์ (URL)',
                    fieldType: 'textbox',
                    maxLength: 100,
                    required: true,
                    type: 'url',
                    visibleWhen: {
                        dataField: 'FACEBOOK_KNOW_URL',
                        values: ['Y']
                    }
                },
                {
                    templateName: 'FACEBOOK_TEMP_4',
                    dataField: 'FACEBOOK_SEEN_FROM',
                    caption: 'คุณเห็นคนร้ายจากที่ใด?',
                    placeholder: 'เลือกคุณเห็นคนร้ายจากที่ใด',
                    fieldType: 'selectbox',
                    options: this.facebookList,
                    displayExpr: 'TEXT',
                    valueExpr: 'TEXT'
                },
                {
                    templateName: 'FACEBOOK_TEMP_5',
                    dataField: 'FACEBOOK_SEEN_FROM_DETAIL', // new field 9-12-68
                    caption: 'ระบุ อื่นๆ',
                    placeholder: 'คุณเห็นคนร้ายจากที่ใด',
                    fieldType: 'textbox',
                    // maxLength: 100,
                    required: true,
                    // type: 'url',
                    visibleWhen: {
                        dataField: 'FACEBOOK_SEEN_FROM',
                        values: ['อื่นๆ']
                    }
                },
            ]
        },
        {
            id: 'TIKTOK',
            name: 'TikTok',
            formOption: [
                {
                    templateName: 'TIKTOK_TEMP_3',
                    dataField: 'TIKTOK_PROFILE_NAME',
                    caption: 'ชื่อโปรไฟล์ / ชื่อบัญชี',
                    placeholder: 'ชื่อโปรไฟล์ / ชื่อบัญชี',
                    fieldType: 'textbox',
                    maxLength: 100,
                    required: true
                },
                {
                    templateName: 'TIKTOK_TEMP_2',
                    dataField: 'TIKTOK_KNOW_URL',
                    caption: 'ทราบลิงค์ (URL) ของชื่อบัญชี / ลิงก์ (URL) หรือไม่',
                    placeholder: 'ทราบลิงค์ (URL) ของชื่อบัญชี / ลิงก์ (URL) หรือไม่',
                    fieldType: 'radiobox',            // จะ map ไป dxRadioGroup
                    required: true,
                    options: this.controlDevice2Option,
                    displayExpr: 'TEXT',
                    valueExpr: 'ID'
                },
                {
                    templateName: 'TIKTOK_TEMP_1',
                    dataField: 'TIKTOK_ACCOUNT',
                    caption: 'ชื่อบัญชี / ลิงก์ (URL) ของบัญชี',
                    placeholder: 'ชื่อบัญชี หรือ URL',
                    fieldType: 'textbox',
                    maxLength: 100,
                    required: true,
                    visibleWhen: {
                        dataField: 'TIKTOK_KNOW_URL',
                        values: ['Y']
                    }
                }
            ]
        },
        {
            id: 'LINE',
            name: 'LINE',
            formOption: [
                {
                    templateName: 'LINE_TEMP_1',
                    dataField: 'LINE_USERNAME',
                    caption: 'ชื่อบัญชี (Line ID)',
                    placeholder: 'ชื่อบัญชี (Line ID)',
                    fieldType: 'textbox',
                    maxLength: 50,
                    pattern: '^([0][0-9]{9})$', // ตามเดิม
                    required: true
                },
                {
                    templateName: 'LINE_TEMP_2',
                    dataField: 'LINE_DISPLAY_NAME',
                    caption: 'ชื่อบัญชี (Display Name)',
                    placeholder: 'ชื่อบัญชี',
                    fieldType: 'textbox',
                    maxLength: 100
                },
                {
                    templateName: 'LINE_TEMP_3',
                    dataField: 'LINE_PHONE',
                    caption: 'เบอร์โทรศัพท์ที่ใช้เพิ่มเพื่อน (ถ้ามี)',
                    placeholder: 'หมายเลขโทรศัพท์',
                    fieldType: 'textbox',
                    type: 'phone',
                    pattern: '^([0+][0-9+]{9,15})$',
                    maxLength: 20,
                },
                {
                    templateName: 'LINE_TEMP_4',
                    dataField: 'LINE_QR_CODE',
                    caption: 'อัปโหลด QR Code สำหรับเพิ่มเพื่อน (ถ้ามี)',
                    fieldType: 'file'
                }
            ]
        },
        {
            id: 'INSTAGRAM',
            name: 'Instagram',
            formOption: [
                {
                    templateName: 'INSTAGRAM_TEMP_1',
                    dataField: 'INSTAGRAM_USERNAME',
                    caption: 'ชื่อบัญชี (Username)',
                    placeholder: 'ชื่อบัญชี (Username)',
                    fieldType: 'textbox',
                    maxLength: 50,
                    pattern: '^([0][0-9]{9})$', // ตามเดิม (แนะนำปรับทีหลัง)
                    required: true
                },
                {
                    templateName: 'INSTAGRAM_TEMP_2',
                    dataField: 'INSTAGRAM_PROFILE_NAME',
                    caption: 'ชื่อบัญชี (Username) (เพิ่มเติม)',
                    placeholder: 'ชื่อบัญชี',
                    fieldType: 'textbox',
                    maxLength: 100
                },
                {
                    templateName: 'INSTAGRAM_TEMP_3',
                    dataField: 'INSTAGRAM_KNOW_URL',
                    caption: 'ทราบลิงค์ (URL) ของโปรไฟล์/เพจ หรือไม่',
                    placeholder: 'ทราบลิงค์ (URL) ของโปรไฟล์/เพจ หรือไม่',
                    fieldType: 'radiobox',            // จะ map ไป dxRadioGroup
                    required: true,
                    options: this.controlDevice2Option,
                    displayExpr: 'TEXT',
                    valueExpr: 'ID'
                },
                {
                    templateName: 'INSTAGRAM_TEMP_4',
                    dataField: 'INSTAGRAM_PROFILE_URL',
                    caption: 'ลิงก์ (URL) ของโปรไฟล์ / เพจ',
                    placeholder: 'ลิงก์ (URL)',
                    fieldType: 'textbox',
                    maxLength: 100,
                    required: true,
                    type: 'url',
                    visibleWhen: {
                        dataField: 'INSTAGRAM_KNOW_URL',
                        values: ['Y']
                    }
                },
            ]
        },
        {
            id: 'TELEGRAM',
            name: 'Telegram',
            formOption: [
                {
                    templateName: 'TELEGRAM_TEMP_3',
                    dataField: 'TELEGRAM_PROFILE_NAME',
                    caption: 'ชื่อโปรไฟล์ / ชื่อบัญชี',
                    placeholder: 'ชื่อโปรไฟล์ / ชื่อบัญชี',
                    fieldType: 'textbox',
                    maxLength: 100,
                    required: true
                },
                {
                    templateName: 'TELEGRAM_TEMP_2',
                    dataField: 'TELEGRAM_KNOW_URL',
                    caption: 'ทราบลิงค์ (URL) ของชื่อกลุ่ม/เพจ หรือลิงก์ หรือไม่',
                    placeholder: 'ทราบลิงค์ (URL) ของชื่อกลุ่ม/เพจ หรือลิงก์ หรือไม่',
                    fieldType: 'radiobox',            // จะ map ไป dxRadioGroup
                    required: true,
                    options: this.controlDevice2Option,
                    displayExpr: 'TEXT',
                    valueExpr: 'ID'
                },
                {
                    templateName: 'TELEGRAM_TEMP_1',
                    dataField: 'TELEGRAM_ACCOUNT',
                    caption: 'ชื่อบัญชี / ลิงก์ (URL) ของบัญชี',
                    placeholder: 'ชื่อบัญชี หรือ URL',
                    fieldType: 'textbox',
                    maxLength: 100,
                    pattern: '^([0][0-9]{9})$', // ตามเดิม
                    required: true,
                    visibleWhen: {
                        dataField: 'TELEGRAM_KNOW_URL',
                        values: ['Y']
                    }
                }
            ]
        },
        {
            id: 'DATING_APP',
            name: 'แอปพลิเคชันหาคู่',
            formOption: [
                {
                    templateName: 'DATING_APP_TEMP_1',
                    dataField: 'DATING_APP_NAME',
                    fieldType: 'selectbox',
                    caption: 'คุณใช้แอปพลิเคชันใด?',
                    required: true,
                    options: this.datingAppList,
                    placeholder: 'เลือกคุณใช้แอปพลิเคชันใด',
                    displayExpr: 'TEXT',
                    valueExpr: 'TEXT'
                },
                {
                    templateName: 'DATING_APP_TEMP_3',
                    dataField: 'DATING_APP_NAME_DETAIL', // new field 9-12-68
                    caption: 'ระบุชื่อแอปพลิเคชัน',
                    placeholder: 'ชื่อแอปพลิเคชัน',
                    fieldType: 'textbox',
                    // maxLength: 100,
                    required: true,
                    // type: 'url',
                    visibleWhen: {
                        dataField: 'DATING_APP_NAME',
                        values: ['อื่นๆ']
                    }
                },
                {
                    templateName: 'DATING_APP_TEMP_2',
                    dataField: 'DATING_APP_PROFILE_NAME',
                    caption: 'ชื่อโปรไฟล์ของคนร้ายในแอปฯ',
                    placeholder: 'ชื่อโปรไฟล์',
                    fieldType: 'textbox',
                    maxLength: 100
                },
                {
                    templateName: 'DATING_APP_TEMP_4',
                    dataField: 'DATING_APP_KNOW_URL',
                    caption: 'ทราบลิงค์ (URL) ของชื่อกลุ่ม หรือลิงก์ หรือไม่',
                    placeholder: 'ทราบลิงค์ (URL) ของชื่อกลุ่ม หรือลิงก์ หรือไม่',
                    fieldType: 'radiobox',            // จะ map ไป dxRadioGroup
                    required: true,
                    options: this.controlDevice2Option,
                    displayExpr: 'TEXT',
                    valueExpr: 'ID'
                },
                {
                    templateName: 'DATING_APP_TEMP_5',
                    dataField: 'DATING_APP_ACCOUNT',
                    caption: 'ชื่อบัญชี / ลิงก์ (URL) ของบัญชี',
                    placeholder: 'ชื่อบัญชี หรือ URL',
                    fieldType: 'textbox',
                    maxLength: 100,
                    pattern: '^([0][0-9]{9})$', // ตามเดิม
                    required: true,
                    visibleWhen: {
                        dataField: 'DATING_APP_KNOW_URL',
                        values: ['Y']
                    }
                }
            ]
        },
        {
            id: 'OTHER',
            name: 'ช่องทางอื่นๆ',
            formOption: [
                {
                    templateName: 'OTHER_TEMP_1',
                    dataField: 'OTHER_CHANNEL',
                    caption: 'ช่องทาง',
                    fieldType: 'selectbox',
                    required: true,
                    options: this.otherList,
                    placeholder: 'เลือกช่องทาง',
                    displayExpr: 'TEXT',
                    valueExpr: 'TEXT'
                },

                // กลุ่มข้อมูลอีเมล (แทน subForm: true + type: 'email')
                {
                    templateName: 'OTHER_EMAIL_GROUP',
                    dataField: 'OTHER_EMAIL_GROUP',
                    caption: 'ข้อมูลอีเมล',
                    fieldType: 'group',
                    visibleWhen: {
                        dataField: 'OTHER_CHANNEL',
                        values: ['อีเมล']
                    },
                    children: [
                        {
                            templateName: 'OTHER_TEMP_2',
                            dataField: 'EMAIL_ADDRESS',
                            caption: 'อีเมลแอดเดรสของผู้ส่ง',
                            placeholder: 'example@mail.com',
                            fieldType: 'textbox',
                            maxLength: 100,
                            type: 'email',
                            required: true
                        },
                        {
                            templateName: 'OTHER_TEMP_3',
                            dataField: 'EMAIL_SUBJECT',
                            caption: 'หัวข้ออีเมล',
                            placeholder: 'หัวข้ออีเมล',
                            fieldType: 'textbox',
                            maxLength: 100,
                            required: true
                        }
                    ]
                },

                // กลุ่มข้อมูลเว็บไซต์ (แทน subForm: true + type: 'website')
                {
                    templateName: 'OTHER_WEBSITE_GROUP',
                    dataField: 'OTHER_WEBSITE_GROUP',
                    caption: 'ข้อมูลเว็บไซต์',
                    fieldType: 'group',
                    visibleWhen: {
                        dataField: 'OTHER_CHANNEL',
                        values: ['เว็บไซต์หางาน']
                    },
                    children: [
                        {
                            templateName: 'OTHER_TEMP_4',
                            dataField: 'WEBSITE_NAME',
                            caption: 'ชื่อเว็บไซต์',
                            placeholder: 'ชื่อเว็บไซต์',
                            fieldType: 'textbox',
                            maxLength: 100,
                            required: true
                        },
                        {
                            templateName: 'OTHER_TEMP_5',
                            dataField: 'OTHER_KNOW_URL',
                            caption: 'ทราบลิงค์ (URL) ของลิงก์ (URL) ของประกาศงาน หรือไม่',
                            placeholder: 'ทราบลิงค์ (URL) ของลิงก์ (URL) ของประกาศงาน หรือไม่',
                            fieldType: 'radiobox',            // จะ map ไป dxRadioGroup
                            required: true,
                            options: this.controlDevice2Option,
                            displayExpr: 'TEXT',
                            valueExpr: 'ID'
                        },
                        {
                            templateName: 'OTHER_TEMP_6',
                            dataField: 'WEBSITE_URL',
                            caption: 'ลิงก์ (URL) ของประกาศงาน',
                            placeholder: 'ลิงก์ (URL)',
                            fieldType: 'textbox',
                            maxLength: 100,
                            type: 'url',
                            required: true,
                            visibleWhen: {
                                dataField: 'OTHER_KNOW_URL',
                                values: ['Y']
                            }
                        }
                    ]
                },

                {
                    templateName: 'OTHER_OTHER_GROUP',
                    dataField: 'OTHER_OTHER_GROUP',
                    caption: 'ข้อมูลอื่นๆ',
                    fieldType: 'group',
                    visibleWhen: {
                        dataField: 'OTHER_CHANNEL',
                        values: ['อื่นๆ']
                    },
                    children: [
                        {
                            templateName: 'OTHER_TEMP_7',
                            dataField: 'OTHER_NAME',
                            caption: 'ชื่อช่องทางอื่นๆ',
                            placeholder: 'ชื่อช่องทางอื่นๆ',
                            fieldType: 'textbox',
                            maxLength: 100,
                            required: true
                        },
                        {
                            templateName: 'OTHER_TEMP_8',
                            dataField: 'OTHER_DETAIL',
                            caption: 'รายละเอียดช่องทางอื่นๆ',
                            placeholder: 'รายละเอียดช่องทางอื่นๆ',
                            fieldType: 'textbox',
                            maxLength: 100,
                            required: true
                        },

                    ]
                }
            ]
        }
    ];
    configFormOption2: ChannelFormConfig[] = [
        {
            id: 'WEBSITE',
            name: 'เว็บไซต์ (Website)',
            formOption: [
                {
                    templateName: 'WEBSITE_TEMP_1',
                    dataField: 'WEBSITE_CHARACTER',
                    caption: 'เว็บไซต์นั้นมีลักษณะเป็นอย่างไร?',
                    placeholder: 'เลือกลักษณะของเว็บไซต์',
                    fieldType: 'selectbox',
                    required: true,
                    options: this.websiteCharacter,
                    displayExpr: 'TEXT',   // ปรับตามโครงจริงของ websiteCharacter
                    valueExpr: 'TEXT'
                },
                {
                    templateName: 'WEBSITE_TEMP_4',
                    dataField: 'WEBSITE_NAME',
                    caption: 'ชื่อเว็บไซต์',
                    placeholder: 'ชื่อเว็บไซต์',
                    fieldType: 'textbox',
                    maxLength: 100,
                    required: true,
                },
                {
                    templateName: 'WEBSITE_OTHER_TEMP',
                    dataField: '',
                    caption: 'รายละเอียดอื่นๆ',
                    fieldType: 'group',
                    visibleWhen: {
                        dataField: 'WEBSITE_CHARACTER',
                        values: ['อื่นๆ']
                    },
                    children: [
                        {
                            templateName: 'WEBSITE_OTHER_TEMP_1',
                            dataField: 'WEBSITE_CHARACTER_OTHER',
                            caption: 'รายละเอียดอื่นๆ',
                            placeholder: 'ระบุรายละเอียดอื่นๆ',
                            fieldType: 'textbox',
                            maxLength: 100,
                            required: true
                        },
                    ]
                },
                {
                    templateName: 'WEBSITE_TEMP_2',
                    dataField: 'WEBSITE_KNOW_URL',
                    caption: 'ทราบลิงค์ (URL) ของที่อยู่ของเว็บไซต์ หรือไม่',
                    placeholder: 'ทราบลิงค์ (URL) ของที่อยู่ของเว็บไซต์ หรือไม่',
                    fieldType: 'radiobox',            // จะ map ไป dxRadioGroup
                    required: true,
                    options: this.controlDevice2Option,
                    displayExpr: 'TEXT',
                    valueExpr: 'ID'
                },
                {
                    templateName: 'WEBSITE_TEMP_3',
                    dataField: 'WEBSITE_URL',
                    caption: 'โปรดระบุที่อยู่ของเว็บไซต์ (URL) ให้ถูกต้องที่สุด',
                    placeholder: 'ระบุ URL ของเว็บไซต์',
                    fieldType: 'textbox',
                    maxLength: 100,
                    required: true,
                    type: 'url',
                    visibleWhen: {
                        dataField: 'WEBSITE_KNOW_URL',
                        values: ['Y']
                    }
                }
            ]
        },

        {
            id: 'MOBILE_APPLICATION',
            name: 'แอปพลิเคชันบนมือถือ (Mobile Application)',
            formOption: [
                {
                    templateName: 'MOBILE_APPLICATION_TEMP_1',
                    dataField: 'MOBILE_APP_INSTALL_METHOD',
                    caption: 'คุณได้ติดตั้งแอปพลิเคชันนั้นอย่างไร?',
                    placeholder: 'เลือกรูปแบบการติดตั้ง',
                    fieldType: 'radiobox',            // จะ map ไป dxRadioGroup
                    required: true,
                    options: this.installAppMethod,
                    displayExpr: 'TEXT',
                    valueExpr: 'TEXT'
                },
                {
                    templateName: 'MOBILE_APPLICATION_TEMP_2',
                    dataField: 'MOBILE_APP_AFTER_EFFECT',
                    caption: 'หลังจากติดตั้งแล้ว เกิดอะไรขึ้นกับโทรศัพท์ของคุณ?',
                    placeholder: 'เลือกเหตุการณ์ที่เกิดขึ้น',
                    fieldType: 'checkbox',            // จะ map ไป dxTagBox / checklist ก็ได้
                    required: true,
                    options: this.installAppAfterMethod,
                    displayExpr: 'TEXT',
                    valueExpr: 'TEXT'
                },
                {
                    templateName: 'MOBILE_APPLICATION_TEMP_3',
                    dataField: 'MOBILE_APP_TRICK_TOPIC',
                    caption: 'คนร้ายใช้เรื่องอะไรหลอกให้คุณติดตั้งแอปฯ?',
                    placeholder: 'เลือกหัวข้อการหลอกลวง',
                    fieldType: 'selectbox',
                    required: true,
                    options: this.installAppSubMethod,
                    displayExpr: 'TEXT',
                    valueExpr: 'TEXT',
                    // ใช้ type เพื่อบอก logic ว่าอันนี้เปิด subForm ต่อได้
                    type: 'subForm'
                },
                {
                    templateName: 'MOBILE_APPLICATION_OTHER_TEMP',
                    dataField: '',
                    caption: 'รายละเอียดอื่นๆ',
                    fieldType: 'group',
                    visibleWhen: {
                        dataField: 'MOBILE_APP_TRICK_TOPIC',
                        values: ['อื่น ๆ']
                    },
                    children: [
                        {
                            templateName: 'MOBILE_APPLICATION_OTHER_TEMP_1',
                            dataField: 'MOBILE_APP_TRICK_TOPIC_OTHER',
                            caption: 'รายละเอียดอื่นๆ',
                            placeholder: 'ระบุรายละเอียดอื่นๆ',
                            fieldType: 'textbox',
                            maxLength: 100,
                            required: true
                        },
                    ]
                },
            ]
        },

        {
            id: 'SOCIAL_MEDIA',
            name: 'โซเชียลมีเดีย / แอปฯ แชท (Social Media / Messaging App)',
            formOption: [
                {
                    templateName: 'SOCIAL_MEDIA_TEMP_1',
                    dataField: 'SOCIAL_PRIMARY_PLATFORM',
                    caption: 'การพูดคุยส่วนใหญ่เกิดขึ้นในแพลตฟอร์มใด?',
                    placeholder: 'เลือกแพลตฟอร์มหลัก',
                    fieldType: 'selectbox',
                    required: true,
                    options: this.socialPlatformOption,
                    displayExpr: 'TEXT',
                    valueExpr: 'TEXT'
                },
                {
                    templateName: 'SOCIAL_MEDIA_TEMP',
                    dataField: '',
                    caption: 'รายละเอียดอื่นๆ',
                    fieldType: 'group',
                    visibleWhen: {
                        dataField: 'SOCIAL_PRIMARY_PLATFORM',
                        values: ['อื่นๆ']
                    },
                    children: [
                        {
                            templateName: 'SOCIAL_MEDIA_TEMP_1',
                            dataField: 'SOCIAL_PRIMARY_PLATFORM_OTHER',
                            caption: 'รายละเอียดอื่นๆ',
                            placeholder: 'ระบุรายละเอียดอื่นๆ',
                            fieldType: 'textbox',
                            maxLength: 100,
                            required: true
                        },
                    ]
                },
                {
                    templateName: 'SOCIAL_MEDIA_TEMP_4',
                    dataField: 'SOCIAL_PROFILE_NAME',
                    caption: 'ชื่อโปรไฟล์/เพจ',
                    placeholder: 'ชื่อโปรไฟล์/เพจ',
                    fieldType: 'textbox',
                    maxLength: 100,
                    required: true,
                },
                {
                    templateName: 'SOCIAL_MEDIA_KNOW_TEMP_2',
                    dataField: 'SOCIAL_MEDIA_KNOW_URL',
                    caption: 'ทราบลิงค์ (URL) ของชื่อกลุ่ม/เพจ หรือลิงก์ หรือไม่',
                    placeholder: 'ทราบลิงค์ (URL) ของชื่อกลุ่ม/เพจ หรือลิงก์ หรือไม่',
                    fieldType: 'radiobox',            // จะ map ไป dxRadioGroup
                    required: true,
                    options: this.controlDevice2Option,
                    displayExpr: 'TEXT',
                    valueExpr: 'ID'
                },
                {
                    templateName: 'SOCIAL_MEDIA_TEMP_2',
                    dataField: 'SOCIAL_GROUP_OR_URL',
                    caption: 'โปรดระบุชื่อกลุ่ม/เพจ หรือลิงก์ (URL)',
                    placeholder: 'ชื่อกลุ่ม/เพจ หรือ URL',
                    // เดิมคุณกำหนดเป็น selectbox แต่ลักษณะคำถามเหมือน textbox มากกว่า
                    // ถ้าอยากคงของเดิมไว้ก็เปลี่ยน fieldType กลับเป็น 'selectbox'
                    fieldType: 'textbox',
                    maxLength: 200,
                    required: true,
                    visibleWhen: {
                        dataField: 'SOCIAL_MEDIA_KNOW_URL',
                        values: ['Y']
                    }
                }
            ]
        },

        {
            id: 'TELEPHONE_CALL',
            name: 'การสนทนาทางโทรศัพท์ (Telephone Call)',
            formOption: [
                {
                    templateName: 'TELEPHONE_CALL_TEMP_1',
                    dataField: 'CALL_ACTIONS',
                    caption: 'นอกจากการพูดคุยแล้ว คนร้ายได้สั่งให้คุณทำสิ่งเหล่านี้หรือไม่?',
                    placeholder: 'เลือกรายการที่ตรงกับเหตุการณ์',
                    fieldType: 'checkbox',
                    required: true,
                    options: this.telephoneCallOption,
                    displayExpr: 'TEXT',
                    valueExpr: 'TEXT'
                },
                {
                    templateName: 'TELEPHONE_CALL_TEMP_2',
                    dataField: 'CALL_FAKE_EVIDENCE',
                    caption: 'คนร้ายมีการใช้ "หลักฐานปลอม" เพื่อเพิ่มความน่าเชื่อถือหรือไม่?',
                    placeholder: 'เลือกรูปแบบหลักฐานปลอม (ถ้ามี)',
                    fieldType: 'checkbox',
                    options: this.telephoneCall2Option,
                    displayExpr: 'TEXT',
                    valueExpr: 'TEXT'
                }
            ]
        }
    ];
    configFormOption3: ChannelFormConfig[] = [
        {
            id: 'CONTROL_DEVICE',
            name: 'การควบคุมอุปกรณ์ / ติดตั้งแอป',
            formOption: [
                {
                    templateName: 'CONTROL_DEVICE_TEMP_1',
                    dataField: 'CONTROL_DEVICE_MAIN',
                    caption:
                        'คนร้ายได้หลอกให้ท่าน ติดตั้งแอปพลิเคชัน ที่อยู่นอก App Store/Play Store (เช่น ไฟล์ .apk) หรือไม่? หรือมีการกดลิงก์แล้ว หน้าจอค้าง, จอดำ, หรือโทรศัพท์ถูกควบคุมระยะไกล หรือไม่?',
                    placeholder: 'โปรดเลือกคำตอบ',
                    fieldType: 'radiobox',                 // map เป็น dxRadioGroup
                    required: true,
                    options: this.controlDeviceOption,
                    displayExpr: 'TEXT',                   // ปรับตามโครงจริงของ option
                    valueExpr: 'ID'
                },
                {
                    templateName: 'CONTROL_DEVICE_TEMP_2',
                    dataField: 'CONTROL_DEVICE_DETAIL',
                    caption: 'โปรดเลือกตัวเลือกที่ตรงกับเหตุการณ์ของท่านมากที่สุด',
                    placeholder: 'โปรดเลือกตัวเลือก',
                    fieldType: 'selectbox',
                    required: true,
                    options: this.controlDeviceSubOption,
                    displayExpr: 'TEXT',
                    valueExpr: 'TEXT'
                }
            ]
        },

        {
            id: 'TRANSFER_PLATFORM',
            name: 'การโอนเข้าแพลตฟอร์ม',
            formOption: [
                {
                    templateName: 'TRANSFER_PLATFORM_TEMP_1',
                    dataField: 'TRANSFER_PLATFORM_MAIN',
                    caption:
                        'ท่านได้โอนเงินเข้าไปในแอปหรือเว็บไซต์ของคนร้าย เพื่อทำงาน ลงทุน หรือรับผลตอบแทนหรือไม่?',
                    placeholder: 'โปรดเลือกคำตอบ',
                    fieldType: 'radiobox',
                    required: true,
                    options: this.controlDeviceOption,
                    displayExpr: 'TEXT',
                    valueExpr: 'ID'
                },
                {
                    templateName: 'TRANSFER_PLATFORM_TEMP_2',
                    dataField: 'TRANSFER_PLATFORM_DETAIL',
                    caption: 'โปรดเลือกตัวเลือกที่ตรงกับเหตุการณ์ของท่านมากที่สุด',
                    placeholder: 'โปรดเลือกตัวเลือก',
                    fieldType: 'selectbox',
                    required: true,
                    options: this.transfersPlatformSubOption,
                    displayExpr: 'TEXT',
                    valueExpr: 'TEXT'
                }
            ]
        },

        {
            id: 'HACK_PASSWORD',
            name: 'การ "แฮ็ก" หรือ "ขโมยรหัสผ่าน"',
            formOption: [
                {
                    templateName: 'HACK_PASSWORD_TEMP_1',
                    dataField: 'HACK_PASSWORD_MAIN',
                    caption: 'ท่าน ไม่ได้ติดตั้งแอป และ ไม่ได้โอนเงินเข้าแพลตฟอร์ม แต่ท่านถูก...',
                    placeholder: 'โปรดเลือกเหตุการณ์ที่ตรงกับท่าน',
                    // เดิมไม่ระบุ fieldType: ผมตีความว่าเป็น single-choice → radiobox
                    // ถ้าอยากให้เลือกได้หลายข้อ เปลี่ยน fieldType เป็น 'checkbox' ได้
                    fieldType: 'radiobox',
                    required: true,
                    options: this.hackPasswordOption,
                    displayExpr: 'TEXT',
                    valueExpr: 'TEXT'
                }
            ]
        },

        {
            id: 'TRICK_TRANSFER_MONEY',
            name: 'การหลอกให้ "โอนเงินเอง" โดยตรง',
            formOption: [
                {
                    templateName: 'TRICK_TRANSFER_MONEY_TEMP_1',
                    dataField: 'TRICK_TRANSFER_MAIN',
                    caption:
                        'ท่าน "สมัครใจกดโอนเงิน" ไปยังบัญชีคนร้าย (บัญชีม้า) ด้วยตัวท่านเอง ใช่หรือไม่?',
                    placeholder: 'โปรดเลือกคำตอบ',
                    fieldType: 'radiobox',
                    required: true,
                    options: this.controlDeviceOption,
                    displayExpr: 'TEXT',
                    valueExpr: 'ID'
                },
                {
                    templateName: 'TRICK_TRANSFER_MONEY_TEMP_2',
                    dataField: 'TRICK_TRANSFER_DETAIL',
                    caption: 'โปรดเลือกสาเหตุ/รูปแบบการหลอกลวงที่ตรงกับเหตุการณ์ของท่าน',
                    placeholder: 'โปรดเลือกตัวเลือก',
                    fieldType: 'selectbox',
                    required: true,
                    options: this.trickTransferMoneySubOption,
                    displayExpr: 'TEXT',
                    valueExpr: 'TEXT'
                }
            ]
        }
    ];

    selectedChannel1: ChannelFormConfig;
    selectedChannel2: ChannelFormConfig;
    selectedChannel3: ChannelFormConfig;

    formData1: any = {};
    formData2: any = {};
    formData3: any = {};

    attachments: { [group: number]: { [field: string]: any[] } } = {
        1: {},
        2: {},
        3: {}
    };

    videoData: any = [
        {
            title: "ตัวอย่างการกรอกข้อมูล Facebook",
            url: "https://drive.google.com/file/d/1nR9AAYsdqGvwGyKQq7NyL6kBhSbfnLon/view?usp=drive_link",
            category: "Facebook/Messenger"
        },
        {
            title: "ตัวอย่างการกรอกข้อมูล Instagram",
            url: "https://drive.google.com/file/d/16K7sbH8CqbQ7L9_KLg8DpmcBWnrHSxcc/view?usp=drive_link",
            category: "Instagram"
        },
        {
            title: "ตัวอย่างการกรอกข้อมูล Line",
            url: "https://drive.google.com/file/d/1hOBhCpWXFMpNDfVC-5kAey2iM3PRjZAY/view?usp=drive_link",
            category: "Line"
        },
        {
            title: "ตัวอย่างการกรอกข้อมูล SMS",
            url: "https://drive.google.com/file/d/1SACA8E7zShPgcQBnHgAlyAeA__NMZWiW/view?usp=drive_link",
            category: "SMS"
        },
        {
            title: "ตัวอย่างการกรอกข้อมูล TikTok",
            url: "https://drive.google.com/file/d/1zwn35jMGpsoMjdDB2GQVwX0gVExhQOrl/view?usp=drive_link",
            category: "TikTok"
        }
    ];

    currentFilter: string = 'All';
    categories: string[] = [];
    filteredVideos: any[] = [];

    constructor(
        private servBankInfo: BankInfoService,
        private _formValidate: FormValidatorService,
        private _issueFile: IssueOnlineFileUploadService,
        private datePipe: DatePipe,
        private issueOnlineService: IssueOnlineService
    ) { }

    ngOnInit(): void {
        this.categories = Array.from(new Set(this.videoData.map(v => v.category)));
        this.updateFilteredVideos();
        if (this.dataForm) {
            if (this.formType === 'view') {
                this.formReadOnly = true;
                this.loadDataForm();
            } else if (this.formType === 'edit') {
                this.loadDataFormEdit();
            }
        }
        this.maxDateValue = new Date((this.maxDateValue ?? new Date()).getTime() + 60 * 60 * 1000);
        console.log('formData:', this.formData);
    }

    ngDoCheck(): void {
        if (this.fileTypeSelectedValue != '') {
            this.fileTypeSelected = true;
        } else {
            this.fileTypeSelected = false;
        }
    }

    initData() {
        if (this.dataForm) {
            // Mapping load logic (Simplify if needed)
            this.prepareFormDataOnLoad();
        }
    }

    setFilter(category: string): void {
        this.currentFilter = category;
        this.updateFilteredVideos();
    }

    private updateFilteredVideos(): void {
        if (this.currentFilter === 'All') {
            this.filteredVideos = [...this.videoData];
        } else {
            this.filteredVideos = this.videoData.filter(v => v.category === this.currentFilter);
        }
    }

    //  Zone new Code
    loadDataForm() {
        if (!this.dataForm) {
            return;
        }

        const id1 = this.dataForm.selectedChannel1?.id;
        const id2 = this.dataForm.selectedChannel2?.id;
        const id3 = this.dataForm.selectedChannel3?.id;

        // 👇 รีแมปให้มาใช้ object จาก config จริง ๆ เสมอ
        this.selectedChannel1 = id1
            ? this.configFormOption1.find(x => x.id === id1) ?? null
            : null;

        this.selectedChannel2 = id2
            ? this.configFormOption2.find(x => x.id === id2) ?? null
            : null;

        this.selectedChannel3 = id3
            ? this.configFormOption3.find(x => x.id === id3) ?? null
            : null;

        this.formData1 = this.prepareDataForLoad(this.dataForm.formData1 || {}, 1);
        this.formData2 = this.prepareDataForLoad(this.dataForm.formData2 || {}, 2);
        this.formData3 = this.prepareDataForLoad(this.dataForm.formData3 || {}, 3);

        if (this.selectedChannel1) this.onSelectChannel(this.selectedChannel1, 1, false);
        if (this.selectedChannel2) this.onSelectChannel(this.selectedChannel2, 2, false);
        if (this.selectedChannel3) this.onSelectChannel(this.selectedChannel3, 3, false);
    }

    loadDataFormEdit() {
        if (!this.dataForm) {
            return;
        }

        const form = this.dataForm?.formChannelContac || {};
        const id1 = form?.selectedChannel1?.id;
        const id2 = form?.selectedChannel2?.id;
        const id3 = form?.selectedChannel3?.id;

        // 👇 รีแมปให้มาใช้ object จาก config จริง ๆ เสมอ
        this.selectedChannel1 = id1
            ? this.configFormOption1.find(x => x.id === id1) ?? null
            : null;

        this.selectedChannel2 = id2
            ? this.configFormOption2.find(x => x.id === id2) ?? null
            : null;

        this.selectedChannel3 = id3
            ? this.configFormOption3.find(x => x.id === id3) ?? null
            : null;

        this.formData1 = this.prepareDataForLoad(form?.formData1 || {}, 1);
        this.formData2 = this.prepareDataForLoad(form?.formData2 || {}, 2);
        this.formData3 = this.prepareDataForLoad(form?.formData3 || {}, 3);

        if (this.selectedChannel1) this.onSelectChannel(this.selectedChannel1, 1, false);
        if (this.selectedChannel2) this.onSelectChannel(this.selectedChannel2, 2, false);
        if (this.selectedChannel3) this.onSelectChannel(this.selectedChannel3, 3, false);
    }
    //  Zone new Code
    onSelectChannel(cfg: ChannelFormConfig, section: 1 | 2 | 3, clear: boolean = true): void {
        const target = this.getFormBySection(section);
        // เคลียร์ข้อมูลเดิมเมื่อเปลี่ยนช่องทาง
        if (clear) {
            for (const key in target) {
                delete target[key];
            }
        }

        if (section === 1) this.selectedChannel1 = cfg;
        if (section === 2) this.selectedChannel2 = cfg;
        if (section === 3) this.selectedChannel3 = cfg;

        if (cfg) {
            cfg.formOption.forEach(f => {
                this.initFieldValue(f, target);
                this.initEditorOptions(f);
            });
        }
    }

    private initEditorOptions(field: FieldConfig): void {
        if (field.fieldType === 'group') {
            field.children?.forEach(c => this.initEditorOptions(c));
            return;
        }

        if (!field.editorOptions) {
            field.editorOptions = this.buildEditorOptions(field);
        }
    }

    private buildEditorOptions(field: FieldConfig): any {
        const base: any = {
            placeholder: field.placeholder,
            maxLength: field.maxLength,
            readOnly: this.formReadOnly
        };

        // SELECTBOX
        if (field.fieldType === 'selectbox') {
            return {
                ...base,
                items: field.options ?? [],
                displayExpr: field.displayExpr,
                valueExpr: field.valueExpr,
                searchEnabled: true,
                showClearButton: true
            };
        }

        // RADIOBOX
        if (field.fieldType === 'radiobox') {
            return {
                ...base,
                items: field.options ?? [],
                displayExpr: field.displayExpr,
                valueExpr: field.valueExpr,
                layout: 'vertical'
            };
        }

        // TEXTAREA
        if (field.fieldType === 'textarea') {
            return {
                ...base,
                height: 90,
                autoResizeEnabled: true
            };
        }

        // FILE
        if (field.fieldType === 'file') {
            return {
                ...base,
                selectButtonText: 'เลือกไฟล์ภาพหลักฐาน',
                labelText: 'การแนบรูปภาพหลักฐานสำคัญต่อการดำเนินคดี',
                accept: 'image/*',
                uploadMode: 'useButtons',
                multiple: false
            };
        }

        if (field.fieldType === 'datebox') {
            return {
                ...base,
                showClearButton: true,
                max: this.maxDateValue,
                displayFormat: 'dd/MM/yyyy HH:mm',
                type: 'datetime',
                min: this.minDateValue,
                openOnFieldClick: true,
                useMaskBehavior: true
            };
        }

        // TEXTBOX หรืออื่น ๆ
        if (field.type === 'phone_only') {
            base.mode = 'tel';
            base.onKeyPress = (e) => {
                const event = e.event;
                if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                }
            };
        }

        return base;
    }

    private initFieldValue(field: FieldConfig, target: any): void {
        if (field.fieldType === 'group') {
            field.children?.forEach(c => this.initFieldValue(c, target));
            return;
        }

        const currentValue = target[field.dataField];

        if (field.fieldType === 'checkbox' || field.fieldType === 'file') {
            if (!Array.isArray(currentValue)) {
                target[field.dataField] = [];       // checkbox and file → array
            }
        } else if (field.fieldType === 'phoneWithPrefix') {
            if (!currentValue || typeof currentValue !== 'object' || Array.isArray(currentValue)) {
                target[field.dataField] = { prefix: '', number: '' };
            }
        } else if (field.fieldType === 'multiPhoneWithPrefix') {
            if (!Array.isArray(currentValue)) {
                target[field.dataField] = [{ prefix: '', number: '' }];
            }
        } else {
            if (currentValue === undefined) {
                target[field.dataField] = null;     // selectbox / radiobox / textbox
            }
        }
    }

    getEditorType(field: FieldConfig): string {
        switch (field.fieldType) {
            case 'textbox': return 'dxTextBox';
            case 'textarea': return 'dxTextArea';
            case 'selectbox': return 'dxSelectBox';
            case 'file': return 'dxFileUploader';
            case 'radiobox': return 'dxRadioGroup';   // ✅ ให้ dxForm สร้างเอง
            case 'datebox': return 'dxDateBox';
            default: return 'dxTextBox';
        }
    }

    private isObjectArray(arr: any): boolean {
        return Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'object';
    }


    onSubmit(channel: ChannelFormConfig): void {
        console.log('Submit channel:', channel.id, this.formData);
        // TODO: ยิง API หรือ map เป็น payload ตามต้องการ
    }

    isChecked(section: 1 | 2 | 3, field: FieldConfig, opt: any): boolean {
        const list = this.getCheckboxValue(section, field);
        const valueKey = field.valueExpr || 'id';
        const id = typeof opt === 'object' ? opt[valueKey] : opt;
        return list.includes(id);
    }

    onPhoneKeyPress(e: any, prefix?: string): void {
        const event = e.event;
        const allowedRegex = prefix === 'อื่นๆ' ? /[0-9+]/ : /[0-9]/;
        if (!allowedRegex.test(event.key)) {
            event.preventDefault();
        }
    }

    async onFileValueChanged(e: any, section: 1 | 2 | 3, dataField: string) {
        const files = e.value;
        const target = this.getFormBySection(section);
        const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB limit for localStorage safety

        if (!files || files.length === 0) {
            target[dataField] = [];
            return;
        }

        const base64Files = [];
        for (const file of files) {
            // Check file size limit
            if (file.size > MAX_FILE_SIZE) {
                Swal.fire({
                    icon: 'warning',
                    title: 'ไฟล์มีขนาดใหญ่เกินกำหนด (1MB)',
                    html: `ไฟล์ <b>${file.name}</b> มีขนาดเกิน 1MB เพื่อป้องกันปัญหาความล่าช้าในการส่งข้อมูล<br><br>` +
                        `กรุณาอัปโหลดไฟล์ที่มีขนาดไม่เกิน 1MB หรือ <b>ไปอัปโหลดไฟล์ขนาดใหญ่ได้ที่ช่อง "เอกสารเพิ่มเติม" ในหน้าสรุปและส่งหลักฐาน</b>`,
                    confirmButtonText: 'ตกลง'
                });
                continue; // Skip this file
            }

            try {
                const base64 = await this.fileToBase64(file);
                base64Files.push({
                    storage: 'base64',
                    name: file.name,
                    url: base64,
                    file: file,
                    originalName: file.name,
                    size: file.size,
                    sizeDetail: formatSize(file.size),
                    type: file.type,
                    dateNow: new Date(),
                });
            } catch (err) {
                console.error("Error converting file to base64", err);
            }
        }
        target[dataField] = base64Files;
    }

    getFiles(section: 1 | 2 | 3, dataField: string): any[] {
        const form = this.getFormBySection(section);
        const files = form[dataField];
        return Array.isArray(files) ? files : [];
    }

    removeFile(section: 1 | 2 | 3, dataField: string, file: any): void {
        const form = this.getFormBySection(section);
        form[dataField] = form[dataField].filter((f: any) => f !== file);
    }

    private fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    }

    private getFormBySection(section: 1 | 2 | 3): any {
        switch (section) {
            case 1: return this.formData1;
            case 2: return this.formData2;
            case 3: return this.formData3;
            default: return this.formData1;
        }
    }
    getCheckboxValue(section: 1 | 2 | 3, field: FieldConfig): any[] {
        const form = this.getFormBySection(section);
        const raw = form[field.dataField];

        if (Array.isArray(raw)) {
            return raw;
        }
        if (raw === null || raw === undefined) {
            return [];
        }
        return [raw];
    }

    onCheckboxChange(section: 1 | 2 | 3, field: FieldConfig, opt: any, e: any): void {
        const valueKey = field.valueExpr || 'id';
        const id = typeof opt === 'object' ? opt[valueKey] : opt;

        let list = this.getCheckboxValue(section, field);

        if (e.value) {
            if (!list.includes(id)) {
                list = [...list, id];
            }
        } else {
            list = list.filter(x => x !== id);
        }

        const form = this.getFormBySection(section);
        form[field.dataField] = list;       // << เขียนกลับลงฟอร์มที่ถูกต้อง
    }

    isFieldVisible(field: FieldConfig, formIndex: number): boolean {
        if (!field.visibleWhen) {
            return true;
        }

        const cond = field.visibleWhen;
        if (formIndex == 1) {
            return this.evaluateCondition(cond, this.formData1);
        }
        if (formIndex == 2) {
            return this.evaluateCondition(cond, this.formData2);
        }
        if (formIndex == 3) {
            return this.evaluateCondition(cond, this.formData3);
        } else {
            return true;
        }
    }
    private evaluateCondition(cond: FieldVisibleWhen, data: any): boolean {
        const currentValue = data[cond.dataField];
        if (Array.isArray(currentValue)) {
            return currentValue.some(v => cond.values.includes(v));
        }
        return cond.values.includes(currentValue);
    }

    SubmitFormChannelNew(e) {
        if (this.formData1 == null || Object.keys(this.formData1).length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                html: 'กรุณากรอกข้อมูลส่วนที่ 1 ให้ครบถ้วน'
            });
            return;
        }
        if (this.formData2 == null || Object.keys(this.formData2).length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                html: 'กรุณากรอกข้อมูลส่วนที่ 2 ให้ครบถ้วน'
            });
            return;
        }
        if (this.formData3 == null || Object.keys(this.formData3).length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                html: 'กรุณากรอกข้อมูลส่วนที่ 3 ให้ครบถ้วน'
            });
            return;
        }

        // Initial validation for non-empty sections
        if (!this.validatePhoneRequired(this.formData1, this.selectedChannel1, 1)) return;
        if (!this.validatePhoneRequired(this.formData2, this.selectedChannel2, 2)) return;
        if (!this.validatePhoneRequired(this.formData3, this.selectedChannel3, 3)) return;

        if (!this.form1.instance.validate().isValid ||
            !this.form2.instance.validate().isValid ||
            !this.form3.instance.validate().isValid) {
            Swal.fire({
                icon: 'error',
                title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                html: 'กรุณากรอกข้อมูลให้ครบถ้วน และตรวจสอบรูปแบบข้อมูล'
            });
            return;
        }

        // Requirement 1.4: Warning to check sender number not self (Only for SMS and Phone)
        const isPhoneOrSms = this.selectedChannel1?.id === 'PHONE';

        if (isPhoneOrSms) {
            Swal.fire({
                title: 'โปรดตรวจสอบอีกครั้ง',
                html: 'กรุณาตรวจสอบให้แน่ใจว่าเบอร์โทรศัพท์ที่ระบุเป็น <b>"เบอร์โทรศัพท์ของคนร้าย"</b> ไม่ใช่เบอร์โทรศัพท์ของ <b>ท่านเอง</b> หากระบุผิดจะส่งผลต่อการดำเนินคดี',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ยืนยัน ข้อมูลถูกต้อง',
                cancelButtonText: 'กลับไปแก้ไข',
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.finishSubmitNew(e);
                }
            });
        } else {
            this.finishSubmitNew(e);
        }
    }

    prepareFormDataOnLoad() {
        // Implementation if needed
    }

    // --- Old Attachment methods (kept for compatibility if needed in popup) ---
    FilesDroppedAttachment(files: any) {
        if (files && files.length > 0) {
            this.UploadFileAttachment({ files: files });
        }
    }

    OpenFileDialogAttachment(input: any) {
        input.click();
    }

    async UploadFileAttachment(uploadTag) {
        const files: any = uploadTag.files;
        if (files.length > 0) {
            const fileCheck = await this._issueFile.CheckFileUploadAllowListSizeDialog(this.maxSizeBuffer, files);
            if (fileCheck.status) {
                let fileItem = {} as any;
                this.maxSizeBuffer = fileCheck.uploadSizeAll ?? 0;
                for (const item of fileCheck.filebase64Array) {
                    this._fileName = item.originalName;
                    const fileName = item.originalName;
                    this._fileSize = item.sizeDetail;
                    fileItem = {
                        name: fileName,
                        size: item.size,
                        sizeDetail: this.BytesToSize(item.size),
                        type: item.type,
                        originalName: fileName,
                        url: item.url,
                    };
                }
                this._fileForm = fileItem;
                this.popupFormUploaded = true;
            }
        }
    }

    BytesToSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) {
            return '0 Byte';
        }
        const data: any = Math.floor(Math.log(bytes) / Math.log(1024));
        const i = parseInt(data, 10);
        return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
    }

    ClearDocBufferAttachment() {
        this._fileForm = {};
        this.popupFormUploaded = false;
    }

    PopupUploadClose() {
        this.popupAttachment = false;
        this.ClearDocBufferAttachment();
        this.fileTypeSelectedValue = '';
    }

    PopupUploadSave() {
        if (this._fileForm.originalName) {
            this.dataAttachment.push({
                OriginalName: this._fileForm.originalName,
                Url: this._fileForm.url,
                Type: this._fileForm.type,
                Size: this._fileForm.size,
                sizeDetail: this._fileForm.sizeDetail,
                formType: this.fileTypeSelectedValue
            });
            this.PopupUploadClose();
        }
    }

    private validatePhoneRequired(formData: any, channel: ChannelFormConfig, sectionIndex: number): boolean {
        if (!channel) return true;

        // Validate single phone fields
        const phoneFields = channel.formOption
            .filter(f => f.fieldType === 'phoneWithPrefix' && f.required && this.isFieldVisible(f, sectionIndex))
            .map(f => f.dataField);

        for (const df of phoneFields) {
            const val = formData[df];
            if (!val || !val.prefix || !val.number) {
                Swal.fire({
                    icon: 'error',
                    title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                    text: `กรุณากรอกเบอร์โทรศัพท์ให้ครบถ้วน`
                });
                return false;
            }
            if (!this.checkPrefixLength(val)) return false;
        }

        // Validate multi phone fields
        const multiPhoneFields = channel.formOption
            .filter(f => f.fieldType === 'multiPhoneWithPrefix' && f.required && this.isFieldVisible(f, sectionIndex))
            .map(f => f.dataField);

        for (const df of multiPhoneFields) {
            const list = formData[df];
            if (!Array.isArray(list) || list.length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                    text: `กรุณาระบุอย่างน้อย 1 เบอร์โทรศัพท์`
                });
                return false;
            }
            for (const val of list) {
                if (!val || !val.prefix || !val.number) {
                    Swal.fire({
                        icon: 'error',
                        title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                        text: `กรุณากรอกเบอร์โทรศัพท์ให้ครบถ้วนทุกช่อง`
                    });
                    return false;
                }
                if (!this.checkPrefixLength(val)) return false;
            }
        }

        return true;
    }

    private checkPrefixLength(val: any): boolean {
        const prefixConfig = this.popularPrefixes.find(p => p.ID === val.prefix);
        if (prefixConfig && prefixConfig.length !== -1) {
            if (val.number.length !== prefixConfig.length) {
                Swal.fire({
                    icon: 'error',
                    title: 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง',
                    text: `เบอร์โทรศัพท์สำหรับ Prefix ${val.prefix} ต้องมีตัวเลขอีก ${prefixConfig.length} หลัก`
                });
                return false;
            }
        }
        return true;
    }

    private prepareDataForLoad(data: any, section: number): any {
        const result = { ...data };
        const configs = section === 1 ? this.configFormOption1 : (section === 2 ? this.configFormOption2 : this.configFormOption3);

        // Find all phoneWithPrefix fields across all channels in this section
        const phoneFields: string[] = [];
        const multiPhoneFields: string[] = [];
        configs.forEach(c => {
            c.formOption.forEach(f => {
                if (f.fieldType === 'phoneWithPrefix') phoneFields.push(f.dataField);
                if (f.fieldType === 'multiPhoneWithPrefix') multiPhoneFields.push(f.dataField);
                if (f.fieldType === 'group') f.children?.forEach(cc => {
                    if (cc.fieldType === 'phoneWithPrefix') phoneFields.push(cc.dataField);
                    if (cc.fieldType === 'multiPhoneWithPrefix') multiPhoneFields.push(cc.dataField);
                });
            });
        });

        // Split string into { prefix, number }
        phoneFields.forEach(df => {
            if (result[df] && typeof result[df] === 'string') {
                result[df] = this.splitPhoneNumber(result[df]);
            }
        });

        // Split array of strings into array of { prefix, number }
        multiPhoneFields.forEach(df => {
            if (Array.isArray(result[df])) {
                result[df] = result[df].map(val => {
                    if (typeof val === 'string') return this.splitPhoneNumber(val);
                    return val;
                });
            }
        });

        return result;
    }

    private splitPhoneNumber(full: string): { prefix: string, number: string } {
        if (!full) return { prefix: '', number: '' };
        // match longest prefixes first (+66 before 0)
        const sorted = [...this.popularPrefixes].filter(p => p.ID !== 'อื่นๆ').sort((a, b) => b.ID.length - a.ID.length);
        for (const p of sorted) {
            if (full.startsWith(p.ID)) {
                return { prefix: p.ID, number: full.substring(p.ID.length) };
            }
        }
        return { prefix: 'อื่นๆ', number: full };
    }

    getPhoneMaxLength(prefix: string): number {
        const config = this.popularPrefixes.find(p => p.ID === prefix);
        if (config && config.length !== -1) return config.length;
        return 20; // Default or 'อื่นๆ'
    }

    private finishSubmitNew(e) {
        // Prepare data for saving by merging prefix and number
        const mergePhone = (data: any, section: number) => {
            const res = { ...data };
            const configs = section === 1 ? this.configFormOption1 : (section === 2 ? this.configFormOption2 : this.configFormOption3);
            const phoneFields: string[] = [];
            const multiPhoneFields: string[] = [];
            configs.forEach(c => {
                c.formOption.forEach(f => {
                    if (f.fieldType === 'phoneWithPrefix') phoneFields.push(f.dataField);
                    if (f.fieldType === 'multiPhoneWithPrefix') multiPhoneFields.push(f.dataField);
                    if (f.fieldType === 'group') f.children?.forEach(cc => {
                        if (cc.fieldType === 'phoneWithPrefix') phoneFields.push(cc.dataField);
                        if (cc.fieldType === 'multiPhoneWithPrefix') multiPhoneFields.push(cc.dataField);
                    });
                });
            });

            phoneFields.forEach(df => {
                const val = res[df];
                if (val && typeof val === 'object' && val.prefix && val.number) {
                    res[df] = val.prefix === 'อื่นๆ' ? val.number : val.prefix + val.number;
                }
            });

            // Merge multi-phone fields
            multiPhoneFields.forEach(df => {
                const list = res[df];
                if (Array.isArray(list)) {
                    res[df] = list.map(val => {
                        if (val && typeof val === 'object' && val.prefix && val.number) {
                            return val.prefix === 'อื่นๆ' ? val.number : val.prefix + val.number;
                        }
                        return val;
                    });
                }
            });

            return res;
        };

        const finalData1 = mergePhone(this.formData1, 1);

        // --- เพิ่ม Logic เคลียร์ข้อมูลข้ามประเภท (Data Cleaning) ---
        if (this.selectedChannel1?.id === 'PHONE') {
            const scamType = finalData1.PHONE_SCAM_TYPE;
            if (scamType === 'SMS') {
                // ถ้าเป็น SMS ให้ล้างข้อมูลของฝั่ง โทรศัพท์ (Call) ออก
                delete finalData1.PHONE_NUMBER_LIST;
                delete finalData1.PHONE_CARRIER;
                delete finalData1.PHONE_CARRIER_OTHER;
                delete finalData1.PHONE_ORG;
                delete finalData1.PHONE_DATE_TIME;
            } else if (scamType === 'PHONE') {
                // ถ้าเป็น โทรศัพท์ (Call) ให้ล้างข้อมูลของฝั่ง SMS ออก
                delete finalData1.SMS_SENDER_TYPE;
                delete finalData1.SMS_SENDER;
                delete finalData1.CRIMINAL_PHONE_LIST;
                delete finalData1.SMS_MESSAGE;
                delete finalData1.SMS_LINK;
                delete finalData1.SMS_DATE_TIME;
            }
        }
        // --------------------------------------------------

        const finalData2 = mergePhone(this.formData2, 2);
        const finalData3 = mergePhone(this.formData3, 3);

        let setData = {
            formData1: finalData1,
            formData2: finalData2,
            formData3: finalData3,
            selectedChannel1: this.selectedChannel1
                ? { id: this.selectedChannel1.id, name: this.selectedChannel1.name }
                : null,
            selectedChannel2: this.selectedChannel2
                ? { id: this.selectedChannel2.id, name: this.selectedChannel2.name }
                : null,
            selectedChannel3: this.selectedChannel3
                ? { id: this.selectedChannel3.id, name: this.selectedChannel3.name }
                : null,
        };
        // clear empty value
        for (const key in setData) {
            if (setData[key] === null || setData[key] === undefined || setData[key] === '') {
                delete setData[key];
            }
        }
        this.mainConponent.formDataAll.formVaillain = setData;
        localStorage.setItem("form-vaillain", JSON.stringify(setData));
        if (e != 'tab') {
            this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
        }
    }

    addPhoneField(section: 1 | 2 | 3, dataField: string): void {
        const form = this.getFormBySection(section);
        if (!Array.isArray(form[dataField])) {
            form[dataField] = [];
        }
        form[dataField].push({ prefix: '', number: '' });
    }

    removePhoneField(section: 1 | 2 | 3, dataField: string, index: number): void {
        const form = this.getFormBySection(section);
        if (Array.isArray(form[dataField])) {
            form[dataField].splice(index, 1);
            if (form[dataField].length === 0) {
                form[dataField].push({ prefix: '', number: '' });
            }
        }
    }

    Back(e) {
        this.mainConponent.NextIndex(this.mainConponent.indexTab - 1);
    }
}
//   end Zone new Code

export type FieldType =
    | 'textbox'
    | 'textarea'
    | 'selectbox'
    | 'file'
    | 'radiobox'
    | 'checkbox'
    | 'group'
    | 'phoneWithPrefix'
    | 'multiPhoneWithPrefix'
    | 'datebox';

export interface FieldConfig {
    templateName: string;
    dataField: string;
    caption: string;
    placeholder?: string;
    fieldType: FieldType;
    conditionalShow?: string;
    maxLength?: number;

    required?: boolean;
    pattern?: string;
    type?: 'email' | 'phone' | 'url' | 'subForm' | string;

    options?: any[];
    displayExpr?: string;
    valueExpr?: string;

    children?: FieldConfig[];
    editorOptions?: any;
    visibleWhen?: FieldVisibleWhen;
}

export interface ChannelFormConfig {
    id: string;
    name: string;
    formOption: FieldConfig[];
}

export interface FieldVisibleWhen {
    dataField: string;   // ฟิลด์ที่ใช้เป็นตัวกำหนด เช่น 'CONTROL_DEVICE_MAIN'
    values: any[];       // ค่าใดบ้างที่ทำให้ฟิลด์นี้มองเห็น เช่น ['YES', 'HAS_APK']
}

export interface VideoItem {
    title: string;
    description: string;
    url: string;
    category: string;
}
//   end Zone new Code