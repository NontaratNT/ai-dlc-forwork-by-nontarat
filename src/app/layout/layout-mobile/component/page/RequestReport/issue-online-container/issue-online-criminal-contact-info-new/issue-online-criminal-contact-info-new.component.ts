import { Component, DoCheck, Input, OnInit, ViewChild } from '@angular/core';
import { BankInfoService } from 'src/app/services/bank-info.service';
import { DxFormComponent, DxSelectBoxComponent } from 'devextreme-angular';
import Swal from 'sweetalert2';
import { FormValidatorService } from 'src/app/services/form-validator.service';
import { IssueOnlineFileUploadService } from 'src/app/services/issue-online-file-upload.service';
import { IssueOnlineContainerComponent } from '../issue-online-container.component';
import { DatePipe } from '@angular/common';
import { IssueOnlineService } from 'src/app/services/issue-online.service';
import { ValidateUrl } from 'src/app/common/helper';
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
            id: 'SMS',
            name: 'SMS',
            formOption: [
                {
                    templateName: 'SMS_TEMP_1',
                    dataField: 'SMS_SENDER',
                    caption: 'ชื่อผู้ส่ง หรือ เบอร์ที่ส่งมา',
                    placeholder: 'หมายเลขโทรศัพท์',
                    fieldType: 'textbox',
                    maxLength: 15,
                    required: true,
                    type: 'phone'
                },
                {
                    templateName: 'SMS_TEMP_2',
                    dataField: 'SMS_MESSAGE',
                    caption: 'คัดลอกข้อความใน SMS มาวาง',
                    placeholder: 'ข้อความใน SMS',
                    fieldType: 'textarea',
                    maxLength: 100
                },
                {
                    templateName: 'SMS_TEMP_3',
                    dataField: 'SMS_LINK',
                    caption: 'ลิงก์ที่แนบมาใน SMS (ถ้ามี)',
                    placeholder: 'ลิงก์ (URL)',
                    fieldType: 'textbox',
                    maxLength: 100,
                    type: 'url'
                },
                {
                    templateName: 'SMS_TEMP_4',
                    dataField: 'SMS_DATE_TIME',
                    caption: 'วัน/เวลา ที่ได้รับข้อความ',
                    placeholder: 'วัน/เวลา ที่ได้รับข้อความ',
                    fieldType: 'datebox',
                    type: 'datetime',
                    required: true,
                },

            ]
        },

        {
            id: 'PHONE',
            name: 'โทรศัพท์',
            formOption: [
                {
                    templateName: 'PHONE_TEMP_1',
                    dataField: 'PHONE_NUMBER',
                    caption: 'เบอร์โทรศัพท์ของคนร้าย',
                    placeholder: 'หมายเลขโทรศัพท์',
                    fieldType: 'textbox',
                    maxLength: 15,
                    required: true,
                    pattern: '^([0+][0-9+]{10,15})$',
                    type: 'phone'
                },
                {
                    templateName: 'PHONE_TEMP_2',
                    dataField: 'PHONE_CARRIER',
                    caption: 'เครือข่าย (ถ้าทราบ)',
                    placeholder: 'เลือกเครือข่าย',
                    fieldType: 'selectbox',
                    options: this.serviceLabelID,
                    displayExpr: 'TEXT',
                    valueExpr: 'TEXT',
                },
                {
                    templateName: 'PHONE_OTHER_TEMP',
                    dataField: '',
                    caption: 'รายละเอียดอื่นๆ',
                    fieldType: 'group',
                    visibleWhen: {
                        dataField: 'PHONE_CARRIER',
                        values: ['อื่นๆ']
                    },
                    children: [
                        {
                            templateName: 'PHONE_OTHER_TEMP_1',
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
                    templateName: 'PHONE_TEMP_3',
                    dataField: 'PHONE_ORG',
                    caption: 'อ้างว่าเป็นเบอร์จากหน่วยงานใด (ถ้ามี)',
                    fieldType: 'textbox',
                    maxLength: 100
                },
                {
                    templateName: 'PHONE_TEMP_4',
                    dataField: 'PHONE_DATE_TIME',
                    caption: 'วัน/เวลา ที่ได้รับสาย',
                    placeholder: 'วัน/เวลา ที่ได้รับสาย',
                    fieldType: 'datebox',
                    type: 'datetime',
                    required: true,
                },
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
    selectedChannel1: ChannelFormConfig | null = null;
    selectedChannel2: ChannelFormConfig | null = null;
    selectedChannel3: ChannelFormConfig | null = null;

    formData1: any = {};
    formData2: any = {};
    formData3: any = {};

    //  End Zone new Code

    constructor(
        private servBankInfo: BankInfoService,
        private _formValidate: FormValidatorService,
        private _issueFile: IssueOnlineFileUploadService,
        private datePipe: DatePipe,
        private issueOnlineService: IssueOnlineService
    ) { }

    ngOnInit(): void {
        if (this.dataForm) {
            if (this.formType === 'view') {
                this.formReadOnly = true;
                this.loadDataForm();
            } else if (this.formType === 'edit') {
                this.loadDataFormEdit();
            }
        }
        // ปรับ maxDateValue +1 ชั่วโมง แบบชัดเจน (ไม่พึ่ง timezone API พิเศษ)
        this.maxDateValue = new Date((this.maxDateValue ?? new Date()).getTime() + 60 * 60 * 1000);

        // debug เฉพาะตอน dev
        console.log('formData:', this.formData);
    }

    safeGet<T = any>(key: string): T | undefined {
        const raw = localStorage.getItem(key);
        if (!raw) return undefined;
        try { return JSON.parse(raw) as T; }
        catch (e) {
            console.error(`Invalid JSON in localStorage for ${key}:`, e);
            return undefined;
        }
    }

    ngDoCheck(): void {
    }

    Back(e) {
        this.mainConponent.NextIndex(this.mainConponent.indexTab - 1);
    }

    CheckNumberBandit(event) {
        const seperator = '^([0-9+])+$';
        const maskSeperator = new RegExp(seperator, 'g');
        const result = maskSeperator.test(event.key);
        return result;
    }
    PasteCheckNumberBandit(event) {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData.getData('text');
        const seperator = '^([0-9+])+$';
        const maskSeperator = new RegExp(seperator, 'g');
        const result = maskSeperator.test(pastedText);
        return result;
    }
    CheckNumber(event) {
        // const seperator  = '^[ก-๏\\s]+$';
        const seperator = '^([0-9])';
        const maskSeperator = new RegExp(seperator, 'g');
        const result = maskSeperator.test(event.key);
        return result;
    }
    PasteCheckNumber(event) {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData.getData('text');
        // const seperator  = '^[ก-๏\\s]+$';
        const seperator = '^([0-9])';
        const maskSeperator = new RegExp(seperator, 'g');
        const result = maskSeperator.test(pastedText);
        return result;
    }

    PhoneNumberPattern(params) {
        const makeScope = new RegExp('^[0](?=[0-9]{9,9}$)', 'g');
        return makeScope.test(params.value);
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

        this.onSelectChannel(this.selectedChannel1, 1);
        this.onSelectChannel(this.selectedChannel2, 2);
        this.onSelectChannel(this.selectedChannel3, 3);

        this.formData1 = { ...(this.dataForm.formData1 || {}) };
        this.formData2 = { ...(this.dataForm.formData2 || {}) };
        this.formData3 = { ...(this.dataForm.formData3 || {}) };
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

        this.onSelectChannel(this.selectedChannel1, 1);
        this.onSelectChannel(this.selectedChannel2, 2);
        this.onSelectChannel(this.selectedChannel3, 3);

        this.formData1 = { ...(form?.formData1 || {}) };
        this.formData2 = { ...(form?.formData2 || {}) };
        this.formData3 = { ...(form?.formData3 || {}) };
    }
    //  Zone new Code
    onSelectChannel(cfg: ChannelFormConfig, section: 1 | 2 | 3): void {
        if (section === 1) {
            this.selectedChannel1 = cfg;
            this.formData1 = {};  // เคลียร์ข้อมูลเดิมเมื่อเปลี่ยนช่องทาง
        }
        if (section === 2) {
            this.selectedChannel2 = cfg;
            this.formData2 = {};  // เคลียร์ข้อมูลเดิมเมื่อเปลี่ยนช่องทาง
        }
        if (section === 3) {
            this.selectedChannel3 = cfg;
            this.formData3 = {};  // เคลียร์ข้อมูลเดิมเมื่อเปลี่ยนช่องทาง
        }

        cfg.formOption.forEach(f => {
            this.initFieldValue(f);        // ของเดิมที่คุณมี
            this.initEditorOptions(f);     // 👈 เพิ่มอันนี้
        });
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
                selectButtonText: 'เลือกไฟล์',
                labelText: '',
                accept: '*',
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
        return base;
    }

    private initFieldValue(field: FieldConfig): void {
        if (field.fieldType === 'group') {
            field.children?.forEach(c => this.initFieldValue(c));
            return;
        }

        // ถ้ายังไม่เคยมี key นี้ใน formData → set default
        if (this.formData[field.dataField] === undefined) {
            if (field.fieldType === 'checkbox') {
                this.formData[field.dataField] = [];       // checkbox list → array
            } else {
                this.formData[field.dataField] = null;     // selectbox / radiobox / textbox
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

    // private getCheckboxValue(field: FieldConfig): any[] {
    //     const current = this.formData[field.dataField];
    //     return Array.isArray(current) ? current : [];
    // }

    isChecked(section: 1 | 2 | 3, field: FieldConfig, opt: any): boolean {
        const list = this.getCheckboxValue(section, field);
        const valueKey = field.valueExpr || 'id';
        const id = typeof opt === 'object' ? opt[valueKey] : opt;
        return list.includes(id);
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

    isFieldVisible(field: FieldConfig, formIndex: Number): boolean {
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
        console.log(this.formData1);
        console.log(this.formData2);
        console.log(this.formData3);
        if (this.formData1 == null || Object.keys(this.formData1).length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                html: 'กรุณากรอกข้อมูลให้ครบถ้วน'
            });
            return;
        }
        if (this.formData2 == null || Object.keys(this.formData2).length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                html: 'กรุณากรอกข้อมูลให้ครบถ้วน'
            });
            return;
        }
        if (this.formData3 == null || Object.keys(this.formData3).length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                html: 'กรุณากรอกข้อมูลให้ครบถ้วน'
            });
            return;
        }
        if (!this.form1.instance.validate().isValid ||
            !this.form2.instance.validate().isValid ||
            !this.form3.instance.validate().isValid) {
            Swal.fire({
                icon: 'error',
                title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                html: 'กรุณากรอกข้อมูลให้ครบถ้วน'
            });
            return;
        }
        let setData = {
            formData1: this.formData1,
            formData2: this.formData2,
            formData3: this.formData3,
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
    //   end Zone new Code
}

interface FormCaseChannel {
    CHANNEL_EMAIL_DOC?: any[];
    CHANNEL_FACEBOOK_DOC?: any[];
    CHANNEL_INSTARGRAM_DOC?: any[];
    CHANNEL_LINE_DOC?: any[];
    CHANNEL_MESSENGER_DOC?: any[];
    CHANNEL_OTHERS_DOC?: any[];
    CHANNEL_PHONE_DOC?: any[];
    CHANNEL_SMS_DOC?: any[];
    CHANNEL_TELEGRAM_DOC?: any[];
    CHANNEL_TWITTER_DOC?: any[];
    CHANNEL_WEBSITE_DOC?: any[];
    CHANNEL_WHATSAPP_DOC?: any[];
    CHANNEL_TIKTOK_DOC?: any[];
    ATTACHMENT_DOC?: any[];
    // Optional bucket for unexpected types
    UNMAPPED_DOC?: any[];
}

export type FieldType =
    | 'textbox'
    | 'textarea'
    | 'selectbox'
    | 'file'
    | 'radiobox'
    | 'checkbox'
    | 'group'
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
//   end Zone new Code