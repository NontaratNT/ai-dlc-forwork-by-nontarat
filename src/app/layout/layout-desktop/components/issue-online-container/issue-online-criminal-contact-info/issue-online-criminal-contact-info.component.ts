import { Component, DoCheck, OnInit, ViewChild } from '@angular/core';
import { BankInfoService } from 'src/app/services/bank-info.service';
import { DxFormComponent, DxSelectBoxComponent } from 'devextreme-angular';
import Swal from 'sweetalert2';
import { FormValidatorService } from 'src/app/services/form-validator.service';
import { IssueOnlineFileUploadService } from 'src/app/services/issue-online-file-upload.service';
import { IssueOnlineContainerComponent } from '../issue-online-container.component';
import { DatePipe } from '@angular/common';
import { IssueOnlineService } from 'src/app/services/issue-online.service';
import { ValidateUrl } from 'src/app/common/helper';

@Component({
    selector: 'app-issue-online-criminal-contact-info',
    templateUrl: './issue-online-criminal-contact-info.component.html',
    styleUrls: ['./issue-online-criminal-contact-info.component.scss']
})
export class IssueOnlineCriminalContatInfoComponent implements OnInit, DoCheck {

    public mainConponent: IssueOnlineContainerComponent;
    @ViewChild("selectCaseType", { static: false }) selectCaseType: DxSelectBoxComponent;
    @ViewChild("formEvent1", { static: false }) formEvent1: DxFormComponent;
    @ViewChild("formPhone", { static: false }) formPhone: DxFormComponent;
    @ViewChild("formSms", { static: false }) formSms: DxFormComponent;
    @ViewChild("formOther", { static: false }) formOther: DxFormComponent;

    formReadOnly: false;
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
        { ID: 5, TEXT: "อื่น ๆ" }
    ];

    destinationType = [
        {ID: 1, TEXT: "หมายเลขโทรศัพท์"},
        {ID: 2, TEXT: "ชื่อผู้ส่ง"}
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

    listAttachment:any = [];
    
    today = new Date();
    minDateValue: Date = new Date(this.today.getFullYear() - 2, this.today.getMonth(), this.today.getDate());

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
        { ID: "website", TEXT: "เว็บไซต์หางาน" }
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
        { ID: 1, TEXT: "ใช่" },
        { ID: 2, TEXT: "ไม่ใช่" }
    ];

    controlDeviceSubOption = [
        { ID: 1, TEXT: "แอปการไฟฟ้า (PEA), การประปา" },
        { ID: 2, TEXT: "แอปการไฟฟ้า (PEA), การประปา" },
        { ID: 3, TEXT: "แอป DSI, ตำรวจ, หน่วยงานรัฐ" },
        { ID: 4, TEXT: "แอปให้กู้เงิน" },
        { ID: 5, TEXT: "แอปขนส่ง (Flash, ไปรษณีย์ไทย)" },
        { ID: 6, TEXT: "อื่นๆ (เช่น แอปดูดวง, แอปหาคู่)" },
    ];

    transfersPlatformSubOption = [
        { ID: 1, TEXT: "แพลตฟอร์ม \"ลงทุน/เทรด\" (เช่น หลอกเทรดหุ้น, ทอง, Crypto โดยเห็นกำไรปลอมในพอร์ต)" },
        { ID: 2, TEXT: "แพลตฟอร์ม \"ทำงาน/ภารกิจ\" (เช่น หลอกให้กดไลก์, กดรับออเดอร์ Shopee, รีวิวสินค้า โดยต้อง 'สำรองเงิน' โอนเข้าไปก่อน)" },
        { ID: 3, TEXT: "แพลตฟอร์ม \"แชร์ลูกโซ่\" (เข้า พ.ร.ก. กู้ยืมเงินฯ เช่น ออมเงิน/ออมทอง ชวนคนมาลงทุนต่อ)" },
    ];

    hackPasswordOption = [
        { ID: 1, TEXT: "หลอกให้กรอก Username/Password ใน 'เว็บปลอม' (Phishing) (เช่น หน้าเว็บธนาคารปลอม) แล้วคนร้ายนำรหัสไปโอนเงินเอง" },
        { ID: 2, TEXT: "ถูก 'แฮ็ก' บัญชีโซเชียล (Facebook, Line) หรืออีเมล โดยที่ท่านไม่ได้บอกรหัสผ่าน" },
    ];

    trickTransferMoneySubOption = [
        { ID: 1, TEXT: "ซื้อสินค้า/บริการ (แต่ไม่ได้ของ, จองที่พักปลอม ฯลฯ)" },
        { ID: 2, TEXT: "Call Center อ้างเป็นเจ้าหน้าที่รัฐ (ตำรวจ, DSI, ไปรษณีย์) ข่มขู่ (และท่าน \"กดโอนเอง\" เพื่อตรวจสอบ)" },
        { ID: 3, TEXT: "สร้างความสัมพันธ์ (หลอกให้รัก (Romance Scam) หรือ ปลอมเป็นเพื่อน/ญาติ ยืมเงิน)" },
        { ID: 4, TEXT: "เสนอผลประโยชน์ (หลอกให้กู้เงิน (ขอค่าธรรมเนียม) หรือ หลอกให้รับรางวัล)" },
        { ID: 5, TEXT: "หลอกว่าจะช่วยเหลือ (อ้างเป็นทนาย/ตำรวจไซเบอร์ ช่วยคดีเก่า แต่ขอค่าดำเนินการ)" },
    ];

    configFormOption1 = [
        { 
            id: 'SMS', 
            name: 'SMS' , 
            formOption : [
                { templateName: 'SMS_TEMP_1', caption: 'ชื่อผู้ส่ง หรือ เบอร์ที่ส่งมา', value : 'หมายเลขโทรศัพท์' , fieldType: 'textbox' , maxLength: 15 , validate: true},
                { templateName: 'SMS_TEMP_2', caption: 'คัดลอกข้อความใน SMS มาวาง', value : 'ชื่อผู้ส่ง' , fieldType: 'textarea' , maxLength: 100 },
                { templateName: 'SMS_TEMP_3', caption: 'ลิงก์ที่แนบมาใน SMS (ถ้ามี)', value : 'ชื่อผู้ส่ง' , fieldType: 'textbox' , maxLength: 100 },
            ]
        },
        { 
            id: 'PHONE', 
            name: 'สายโทรศัพท์' ,
            formOption : [
                { templateName: 'PHONE_TEMP_1', caption: 'เบอร์โทรศัพท์ของคนร้าย', value : 'หมายเลขโทรศัพท์' , fieldType: 'textbox' , maxLength: 15 , validate: true, pattern: '^([0+][0-9+]{10,15})$' },
                { templateName: 'PHONE_TEMP_2', caption: 'เครือข่าย (ถ้าทราบ)', value : 'ชื่อผู้ส่ง' , fieldType: 'selectbox' , maxLength: 100 ,option : this.serviceLabelID },
                { templateName: 'PHONE_TEMP_3', caption: 'อ้างว่าเป็นเบอร์จากหน่วยงานใด (ถ้ามี)', value : 'ชื่อผู้ส่ง' , fieldType: 'textbox' , maxLength: 100 },
            ]
        },
        { 
            id: 'TIKTOK', 
            name: 'TikTok' ,
            formOption : [
                { templateName: 'TIKTOK_TEMP_1', caption: 'ชื่อบัญชี / ลิงก์ (URL) ของบัญชี', value : 'หมายเลขโทรศัพท์' , fieldType: 'textbox' , maxLength: 15 , validate: true},
            ]
        },
        { 
            id: 'FACEBOOK', 
            name: 'Facebook/Massenger' ,
            formOption : [
                { templateName: 'FACEBOOK_TEMP_1', caption: 'ชื่อโปรไฟล์ / ชื่อเพจ', value : 'หมายเลขโทรศัพท์' , fieldType: 'textbox' , maxLength: 15 , pattern : '^([0][0-9]{9})$' , validate: true},
                { templateName: 'FACEBOOK_TEMP_2', caption: 'ลิงก์ (URL) ของโปรไฟล์ / เพจ', value : 'ชื่อผู้ส่ง' , fieldType: 'textbox' , maxLength: 100},
                { templateName: 'FACEBOOK_TEMP_3', caption: 'คุณเห็นคนร้ายจากที่ใด?', value : 'ชื่อผู้ส่ง' , fieldType: 'selectbox' , maxLength: 100 , option : this.facebookList},
            ]
        },
        { 
            id: 'INSTAGRAM', 
            name: 'Instagram' ,
            formOption : [
                { templateName: 'INSTAGRAM_TEMP_1', caption: 'ชื่อบัญชี (Username)', value : 'หมายเลขโทรศัพท์' , fieldType: 'textbox' , maxLength: 15 , pattern : '^([0][0-9]{9})$' , validate: true},
                { templateName: 'INSTAGRAM_TEMP_2', caption: 'ชื่อบัญชี (Username)', value : 'ชื่อผู้ส่ง' , fieldType: 'textbox' , maxLength: 100}
            ]
        },
        {
            id: 'DATING_APP', 
            name: 'แอปพลิเคชันหาคู่' ,
            formOption : [
                { templateName: 'DATING_APP_TEMP_1', caption: 'คุณใช้แอปพลิเคชันใด?', value : 'หมายเลขโทรศัพท์' , fieldType: 'selectbox' , validate: true , option : this.datingAppList},
                { templateName: 'DATING_APP_TEMP_2', caption: 'ชื่อโปรไฟล์ของคนร้ายในแอปฯ', value : 'ชื่อผู้ส่ง' , fieldType: 'textbox' , maxLength: 100},
            ]
        },
        {
            id: 'LINE', 
            name: 'LINE' ,
            formOption : [
                { templateName: 'LINE_TEMP_1', caption: 'ชื่อบัญชี (Username)', value : 'หมายเลขโทรศัพท์' , fieldType: 'textbox' , maxLength: 15 , pattern : '^([0][0-9]{9})$' , validate: true},
                { templateName: 'LINE_TEMP_2', caption: 'ชื่อบัญชี (Username)', value : 'ชื่อผู้ส่ง' , fieldType: 'textbox' , maxLength: 100},
                { templateName: 'LINE_TEMP_3', caption: 'เบอร์โทรศัพท์ที่ใช้เพิ่มเพื่อน (ถ้ามี)', value : 'ชื่อผู้ส่ง' , fieldType: 'textbox' , maxLength: 100},
                { templateName: 'LINE_TEMP_4', caption: 'อัปโหลด QR Code สำหรับเพิ่มเพื่อน (ถ้ามี)', value : '' , fieldType: 'file'},
            ]
        },
        {
            id: 'TELEGRAM', 
            name: 'Telegram' ,
            formOption : [
                 { templateName: 'TELEGRAM_TEMP_1', caption: 'ชื่อบัญชี / ลิงก์ (URL) ของบัญชี', value : 'หมายเลขโทรศัพท์' , fieldType: 'textbox' , maxLength: 15 , pattern : '^([0][0-9]{9})$' , validate: true},
            ]
        },
        {
            id: 'OTHER', 
            name: 'ช่องทางอื่นๆ' ,
            formOption : [
                { templateName: 'OTHER_TEMP_1', caption: 'ช่องทาง', value : 'หมายเลขโทรศัพท์' , fieldType: 'selectbox' , validate: true , option : this.otherList },
                { templateName: 'OTHER_TEMP_2', caption: 'อีเมลแอดเดรสของผู้ส่ง', value : 'ชื่อผู้ส่ง' , fieldType: 'textbox' , maxLength: 100 , type: 'email' , validate: true , subForm: true},
                { templateName: 'OTHER_TEMP_3', caption: 'หัวข้ออีเมล', value : 'ชื่อผู้ส่ง' , fieldType: 'textbox' , maxLength: 100 , type: 'email' , validate: true , subForm: true},
                { templateName: 'OTHER_TEMP_4', caption: 'ชื่อเว็บไซต์', value : 'ชื่อผู้ส่ง' , fieldType: 'textbox' , maxLength: 100 , type: 'website' , validate: true , subForm: true},
                { templateName: 'OTHER_TEMP_5', caption: 'ลิงก์ (URL) ของประกาศงาน', value : 'ชื่อผู้ส่ง' , fieldType: 'textbox' , maxLength: 100 , type: 'website' , validate: true , subForm: true},
            ]
        },
    ];
    configFormOption2 = [
        { 
            id: 'WEBSITE', 
            name: 'เว็บไซต์ (Website)' , 
            formOption : [
                { templateName: 'WEBSITE_TEMP_1', caption: 'เว็บไซต์นั้นมีลักษณะเป็นอย่างไร?', value : 'หมายเลขโทรศัพท์' , fieldType: 'selectbox' ,validate: true , option : this.websiteCharacter},
                { templateName: 'WEBSITE_TEMP_2', caption: 'โปรดระบุที่อยู่ของเว็บไซต์ (URL) ให้ถูกต้องที่สุด', value : 'ชื่อผู้ส่ง' , fieldType: 'textbox' , maxLength: 100 , type: 'website' , validate: true },
            ]
        },
        { 
            id: 'MOBILE_APPLICATION', 
            name: 'แอปพลิเคชันบนมือถือ (Mobile Application)' ,
            formOption : [
                { templateName: 'MOBILE_APPLICATION_TEMP_1', caption: 'คุณได้ติดตั้งแอปพลิเคชันนั้นอย่างไร?', value : 'หมายเลขโทรศัพท์' , fieldType: 'radiobox' ,validate: true, option : this.installAppMethod},
                { templateName: 'MOBILE_APPLICATION_TEMP_2', caption: 'หลังจากติดตั้งแล้ว เกิดอะไรขึ้นกับโทรศัพท์ของคุณ?', value : 'หมายเลขโทรศัพท์' , fieldType: 'checkbox' ,validate: true, option : this.installAppAfterMethod},
                { templateName: 'MOBILE_APPLICATION_TEMP_3', caption: 'คนร้ายใช้เรื่องอะไรหลอกให้คุณติดตั้งแอปฯ?', value : 'ชื่อผู้ส่ง' , fieldType: 'selectbox' , validate: true , option : this.installAppSubMethod, type: 'subForm' },
            ]
        },
        { 
            id: 'SOCIAL_MEDIA', 
            name: 'โซเชียลมีเดีย / แอปฯ แชท (Social Media / Messaging App)' ,
            formOption : [
                { templateName: 'SOCIAL_MEDIA_TEMP_1', caption: 'การพูดคุยส่วนใหญ่เกิดขึ้นในแพลตฟอร์มใด?', value : 'หมายเลขโทรศัพท์' , fieldType: 'selectbox' , validate: true , option : this.socialPlatformOption},
                { templateName: 'SOCIAL_MEDIA_TEMP_2', caption: 'โปรดระบุชื่อกลุ่ม/เพจ หรือลิงก์ (URL) ถ้ามี', value : 'หมายเลขโทรศัพท์' , fieldType: 'selectbox'},
            ]
        },
        { 
            id: 'TELEPHONE_CALL', 
            name: 'การสนทนาทางโทรศัพท์ (Telephone Call)' ,
            formOption : [
                { templateName: 'TELEPHONE_CALL_TEMP_1', caption: 'นอกจากการพูดคุยแล้ว คนร้ายได้สั่งให้คุณทำสิ่งเหล่านี้หรือไม่?', value : 'หมายเลขโทรศัพท์' , fieldType: 'checkbox' , validate: true , option : this.telephoneCallOption},
                { templateName: 'TELEPHONE_CALL_TEMP_2', caption: 'คนร้ายมีการใช้ "หลักฐานปลอม" เพื่อเพิ่มความน่าเชื่อถือหรือไม่?', value : 'ชื่อผู้ส่ง' , fieldType: 'checkbox' , option: this.telephoneCall2Option},
            ]
        }
    ];
    configFormOption3 = [
        { 
            id: 'CONTROL_DEVICE', 
            name: 'การควบคุมอุปกรณ์ / ติดตั้งแอป' , 
            formOption : [
                { templateName: 'CONTROL_DEVICE_TEMP_1', caption: 'คนร้ายได้หลอกให้ท่าน ติดตั้งแอปพลิเคชัน ที่อยู่นอก App Store/Play Store (เช่น ไฟล์ .apk) หรือไม่? หรือมีการกดลิงก์แล้ว หน้าจอค้าง, จอดำ, หรือโทรศัพท์ถูกควบคุมระยะไกล หรือไม่?', value : 'หมายเลขโทรศัพท์' , fieldType: 'radiobox' , validate: true, option : this.controlDeviceOption},
                { templateName: 'CONTROL_DEVICE_TEMP_2', caption: '', value : 'หมายเลขโทรศัพท์' , fieldType: 'selectbox' , validate: true, option : this.controlDeviceSubOption},

            ]
        },
        { 
            id: 'TRANSFER_PLATFORM', 
            name: 'การโอนเข้าแพลตฟอร์ม' ,
            formOption : [
                { templateName: 'TRANSFER_PLATFORM_TEMP_1', caption: 'ท่านได้ โอนเงินเข้าไปใน \'ระบบ\' หรือ \'แพลตฟอร์ม\' (แอป/เว็บไซต์) เพื่อทำงานหรือลงทุน โดยเห็นตัวเลขกำไร/ผลตอบแทนในระบบนั้นหรือไม่?', value : 'หมายเลขโทรศัพท์' , fieldType: 'radiobox' , validate: true, option : this.controlDeviceOption},
                { templateName: 'TRANSFER_PLATFORM_TEMP_2',  caption: '', value : 'หมายเลขโทรศัพท์' , fieldType: 'selectbox' , validate: true, option : this.transfersPlatformSubOption},
            ]
        },
        { 
            id: 'HACK_PASSWORD', 
            name: 'การ "แฮ็ก" หรือ "ขโมยรหัสผ่าน"' ,
            formOption : [
                { templateName: 'HACK_PASSWORD_TEMP_1', caption: 'ท่าน ไม่ได้ติดตั้งแอป และ ไม่ได้โอนเงินเข้าแพลตฟอร์ม แต่ท่านถูก...', value : 'หมายเลขโทรศัพท์'  , validate: true, option: this.hackPasswordOption},
            ]
        },
        { 
            id: 'TRICK_TRANSFER_MONEY', 
            name: 'การหลอกให้ "โอนเงินเอง" โดยตรง' ,
            formOption : [
               { templateName: 'TRICK_TRANSFER_MONEY_TEMP_1', caption: 'ท่าน \'สมัครใจกดโอนเงิน\' ไปยังบัญชีคนร้าย (บัญชีม้า) ด้วยตัวท่านเอง ใช่หรือไม่?', value : 'หมายเลขโทรศัพท์' , fieldType: 'radiobox' , validate: true, option : this.controlDeviceOption},
                { templateName: 'TRICK_TRANSFER_MONEY_TEMP_2',  caption: '', value : 'หมายเลขโทรศัพท์' , fieldType: 'selectbox' , validate: true, option : this.trickTransferMoneySubOption},
            ]
        }
    ];
    //  End Zone new Code

    constructor(
        private servBankInfo: BankInfoService,
        private _formValidate: FormValidatorService,
        private _issueFile: IssueOnlineFileUploadService,
        private datePipe: DatePipe,
        private issueOnlineService: IssueOnlineService
    ) { }

    ngOnInit(): void {
        // ปรับ maxDateValue +1 ชั่วโมง แบบชัดเจน (ไม่พึ่ง timezone API พิเศษ)
        this.maxDateValue = new Date((this.maxDateValue ?? new Date()).getTime() + 60 * 60 * 1000);

        // ค่า default: ตั้งเฉพาะตอนยังไม่ถูกกำหนด (ไม่ไปทับค่าที่โหลดมา)
        this.formData.CRIMINAL_TEL ??= false;
        this.formData.CRIMINAL_SMS ??= false;
        this.formData.CRIMINAL_OTHER ??= false;
        this.formData.CASE_TYPE_ID ??= null;
        this.formData.CRIMINAL_SMS_DESTINATION_TYPE ??= 'หมายเลขโทรศัพท์';

        // อ่าน flag OCPB
        const blessing = this.safeGet<{ IsOCPB?: boolean }>('form-blessing');
        this.isOCPB = !!blessing?.IsOCPB;

        // โหลดรายงานจาก localStorage แล้ว merge ทับเฉพาะฟิลด์ที่มีใน report
        const contact = this.safeGet<{ CASE_REPORT?: any[] }>('form-criminal-contact');
        const report = contact?.CASE_REPORT?.[0];
        if (report && typeof report === 'object') {
            this.formData = { ...this.formData, ...report };
        }

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
        // Update `checkOtherTel` based on `CRIMINAL_TEL_PROVIDER` and clear details if not 'อื่น ๆ'
        this.appState.checkOtherTel = this.formData.CRIMINAL_TEL_PROVIDER === 'อื่น ๆ';
        if (!this.appState.checkOtherTel) {
            this.formData.CRIMINAL_TEL_PROVIDER_DETAIL = '';
        }
    
        // Update `checkOtherSms` based on `CRIMINAL_SMS_PROVIDER` and clear details if not 'อื่น ๆ'
        this.appState.checkOtherSms = this.formData.CRIMINAL_SMS_PROVIDER === 'อื่น ๆ';
        if (!this.appState.checkOtherSms) {
            this.formData.CRIMINAL_SMS_PROVIDER_DETAIL = '';
        }
    
        // Update `checkOtherSocial` based on `CRIMINAL_TYPE_SOCIAL`
        this.appState.checkOtherSocial = this.formData.CRIMINAL_TYPE_SOCIAL === 'อื่นๆ';
    
        // Update `fileTypeSelected` based on `fileTypeSelectedValue`
        this.fileTypeSelected = this.fileTypeSelectedValue !== '';
    
        // Process SMS date and time if `CRIMINAL_SMS_DATE_FULL` exists
        if (this.formData.CRIMINAL_SMS_DATE_FULL) {
            this.formData.CRIMINAL_SMS_DATE = this.datePipe.transform(
                this.formData.CRIMINAL_SMS_DATE_FULL,
                'yyyy-MM-dd'
            );
            this.formData.CRIMINAL_SMS_TIME = this.datePipe.transform(
                this.formData.CRIMINAL_SMS_DATE_FULL,
                'HH:mm:ss'
            );
        }
    
        // Process TEL date and time if `CRIMINAL_TEL_DATE_FULL` exists
        if (this.formData.CRIMINAL_TEL_DATE_FULL) {
            this.formData.CRIMINAL_TEL_DATE = this.datePipe.transform(
                this.formData.CRIMINAL_TEL_DATE_FULL,
                'yyyy-MM-dd'
            );
            this.formData.CRIMINAL_TEL_TIME = this.datePipe.transform(
                this.formData.CRIMINAL_TEL_DATE_FULL,
                'HH:mm:ss'
            );
        }
    }

    async OnSelectCaseType(e) {
        if (e.value) {
            const data = this.selectCaseType.instance.option("selectedItem");
            if (data) {
                this.formData.CASE_TYPE_ID = data.CASE_TYPE_ID;
                this.formData.CASE_TYPE_NAME = data.CASE_TYPE_NAME;
                this.caseType = data.CASE_TYPE_DESC;
                this.caseOpen = true;
            } else {
                this.formData.CASE_TYPE_ID = e.value;
            }
        }
    }

    SelectTypeChanel() {
        this.formChannelValidate = [this.formData.CHANEL_PHONE, this.formData.CHANEL_SMS,
            this.formData.CHANEL_LINE,].some((value) => value === true) ? false : true;
    }

    SubmitForm(e) {
        if (!this.formEvent1.instance.validate().isValid) {
            this._formValidate.ValidateForm(
                this.formEvent1.instance.validate().brokenRules
            );
            return;
        }
        if (this.formData.CRIMINAL_TEL) {
            if (!this.formPhone.instance.validate().isValid) {
                this._formValidate.ValidateForm(
                    this.formPhone.instance.validate().brokenRules
                );
                return;
            }
            if (this.formData.CRIMINAL_TEL_PROVIDER === 'อื่น ๆ') {
                if (this.formData.CRIMINAL_TEL_PROVIDER_DETAIL === null ||
                    this.formData.CRIMINAL_TEL_PROVIDER_DETAIL === undefined ||
                    this.formData.CRIMINAL_TEL_PROVIDER_DETAIL === "") {
                    Swal.fire({
                        icon: 'error',
                        title: 'กรอกข้อมูลไม่ครบ',
                        html: 'กรุณากรอกชื่อค่ายโทรศัพท์ผู้เสียหายอื่นๆ'
                    });
                    return;
                }
            }
        } else {
            this.formData.CRIMINAL_TEL_ORIGIN = null;
            this.formData.CRIMINAL_TEL_PROVIDER = null;
            this.formData.CRIMINAL_TEL_DESTINATION = null;
            this.formData.CRIMINAL_TEL_DATE = null;
            this.formData.CRIMINAL_TEL_TIME = null;
        }
        if (this.formData.CRIMINAL_SMS) {
            if (!this.formSms.instance.validate().isValid) {
                this._formValidate.ValidateForm(
                    this.formSms.instance.validate().brokenRules
                );
                return;
            }
            if (this.formData.CRIMINAL_SMS_PROVIDER === 'อื่น ๆ') {
                if (this.formData.CRIMINAL_SMS_PROVIDER_DETAIL === null &&
                    this.formData.CRIMINAL_SMS_PROVIDER_DETAIL === undefined &&
                    this.formData.CRIMINAL_SMS_PROVIDER_DETAIL === "") {
                    Swal.fire({
                        icon: 'error',
                        title: 'กรอกข้อมูลไม่ครบ',
                        html: 'กรุณากรอกชื่อค่าย SMS โทรศัพท์ผู้เสียหาย'
                    });
                    return;
                }
            }
        } else {
            this.formData.CRIMINAL_SMS_ORIGIN = null;
            this.formData.CRIMINAL_SMS_PROVIDER = null;
            this.formData.CRIMINAL_SMS_DESTINATION = null;
            this.formData.CRIMINAL_SMS_DATE_FULL = null;
            this.formData.CRIMINAL_SMS_DATE = null;
            this.formData.CRIMINAL_SMS_TIME = null;
        }
        if (this.formData.CRIMINAL_OTHER) {
            if (!this.formOther.instance.validate().isValid) {
                this._formValidate.ValidateForm(
                    this.formOther.instance.validate().brokenRules
                );
                return;
            }
        } else {
            this.formData.CRIMINAL_TYPE_SOCIAL = null;
            this.formData.CRIMINAL_SOCIAL_TYPE_DETAIL = null;
            this.formData.CRIMINAL_SOCIAL_DETAIL = null;
        }
        if( this.formData.CRIMINAL_SOCIAL_DETAIL){
            if(ValidateUrl(this.formData.CRIMINAL_SOCIAL_DETAIL)){
                Swal.fire({
                    title: "แจ้งเตือน!",
                    html: `ท่านกรอกข้อมูล URL ไม่ถูกต้อง 
                    <br>เนื่องจาก URL ของท่านไม่สามารถนำไปตรวจสอบได้
                    <br>กรุณาตรวจสอบอีกครั้ง`,
                    icon: "warning",
                    confirmButtonText: "Ok",
                }).then(() => {
                    this.formData.CRIMINAL_SOCIAL_DETAIL = null;
                });
                return;
            }
        }
        // formatDate
        this.formData.ATTACHMENT = this.dataAttachment ?? [];
        const setData = {};
        const d = this.formData;
        for (const key in d) {
            if (d[key] !== null && d[key] !== undefined) {
                setData[key] = d[key];
            }
        }
        let formCaseChannel = this.issueOnlineService.craeteCaseChanel(this.formData);
        formCaseChannel = this.formatFormSubmitFile(formCaseChannel);
        this.mainConponent.formDataAll.formCriminalContact = {};
        this.mainConponent.formDataAll.formCaseChannelCriminalContact = {};
        this.mainConponent.formDataAll.formCriminalContact = this.formData;
        this.mainConponent.formDataAll.formCaseChannelCriminalContact = formCaseChannel;
        if(localStorage.getItem("form-villain")){
            const villain = JSON.parse(localStorage.getItem("form-villain"));
            if(!this.formData.CRIMINAL_TEL && !this.formData.CRIMINAL_SMS && !this.formData.CRIMINAL_OTHER){
                localStorage.setItem("form-villain",JSON.stringify(Object.assign(villain,{CASE_CHANNEL:[]})));
            }else{
                localStorage.setItem("form-villain",JSON.stringify(Object.assign(villain,{CASE_CHANNEL:[formCaseChannel]})));
            }
        }else{
            // console.log("work!");
            // if(formCaseChannel?.ATTACHMENT_DOC.length > 0){
            //     console.log(formCaseChannel?.ATTACHMENT_DOC);
            //     const setData = {
            //         CASE_ATTACHMENT:formCaseChannel?.ATTACHMENT_DOC ?? []
            //     };
            //     this.mainConponent.formDataAll.formAttachment = {};
            //     this.mainConponent.formDataAll.formAttachment = setData;
            //     localStorage.setItem("form-attachment",JSON.stringify(setData));
            //     formCaseChannel.ATTACHMENT_DOC = []; // clear attachment in case channel
            // }
            if(!this.formData.CRIMINAL_TEL && !this.formData.CRIMINAL_SMS && !this.formData.CRIMINAL_OTHER){
                localStorage.setItem("form-villain",JSON.stringify(Object.assign({},{CASE_CHANNEL:[]})));
            }else{
                localStorage.setItem("form-villain",JSON.stringify(Object.assign({},{CASE_CHANNEL:[formCaseChannel]})));
            }
        }
        localStorage.setItem("form-criminal-contact",JSON.stringify(Object.assign({CASE_REPORT:[this.formData]})));
        this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
    }

    Back(e) {
        this.mainConponent.NextIndex(this.mainConponent.indexTab - 1);
    }

    selectChannel(type) {
        if (type === 'phone' && this.formData.CRIMINAL_TEL) {
            this.formData.CRIMINAL_TEL_PROVIDER = 'N/A';
        }
        if (type === 'sms' && this.formData.CRIMINAL_SMS) {
            this.formData.CRIMINAL_SMS_PROVIDER = 'N/A';
        }
    }

    OpenFileDialog() {
        // this.typeSelected = ['เอกสารหลักฐานอื่นๆ'];
        this.typeSelected = [];
        if(this.formData.CRIMINAL_TEL){
            this.typeSelected.push('เบอร์โทรศัพท์');
        }
        if(this.formData.CRIMINAL_SMS){
            this.typeSelected.push('SMS');
        }
        if(this.formData.CRIMINAL_TYPE_SOCIAL){
            this.typeSelected.push(this.formData.CRIMINAL_TYPE_SOCIAL);
        }
        this.popupAttachment = true;
        this.popupFormUploaded = false;
    }

    DeleteFileDocItemUpload(index = null) {
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
                this.maxSizeBuffer -= this.dataAttachment[index].size ?? 0;
                this.dataAttachment.splice(index, 1);
            }
        });
    }

    async openPdfInNewTabAdd(e): Promise<void> {
        const something = e.Url.split(',')[1] || e.Url;
        const fileData = atob(something);
        const blob = new Blob([new Uint8Array([...fileData].map(item => item.charCodeAt(0)))], { type: e.Type });
        const fileUrl = URL.createObjectURL(blob);
        window.open(fileUrl, '_blank');
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

    OpenFileDialogAttachment(uploadTag) {
        uploadTag.click();
    }

    async FilesDroppedAttachment(e) {
        const files = e;
        if (files.length > 0) {
            const fileCheck = await this._issueFile.CheckFileUploadAllowListSizeDrop(this.maxSizeBuffer, files);
            console.log(fileCheck);
            if (fileCheck.status) {
                let fileItem = {} as any;
                this.maxSizeBuffer = fileCheck.uploadSizeAll ?? 0;
                for (const item of fileCheck.filebase64Array) {
                    const extention = this.textAfterLastDot(item.originalName);
                    const fileName = this._fileName ? this._fileName + extention : item.originalName;
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

    textAfterLastDot(name) {
        const lastDotIndex = name.lastIndexOf('.');
        return lastDotIndex !== -1 ? name.substring(lastDotIndex) : '';
    }

    ClearDocBufferAttachment() {
        this._fileForm = undefined;
        this.popupFormUploaded = false;
    }

    PopupUploadClose() {
        this._fileForm = {};
        this.fileTypeSelected = false;
        this.fileTypeSelectedValue = '';
        this.popupFormUploaded = false;
        this.popupAttachment = false;
    }

    PopupUploadSave() {
        if (this.popupFormUploaded) {
            this.dataAttachment.push({
                OriginalName: this._fileForm.originalName,
                Url: this._fileForm.url,
                Type: this._fileForm.type,
                Size: this._fileForm.size,
                sizeDetail: this._fileForm.sizeDetail,
                formType: this.fileTypeSelectedValue
            });
            this.PopupUploadClose();
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'แจ้งเตือน!',
                text: "ท่านยังไม่ได้แนบไฟล์",
                confirmButtonText: 'ตกลง'
            }).then(() => {
            });
        }
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

    formatFormSubmitFile(formCaseChannel: FormCaseChannel): FormCaseChannel {
        // Map "formType" -> property name on formCaseChannel
        const channelMap: Record<string, keyof FormCaseChannel> = {
            EMAIL: 'CHANNEL_EMAIL_DOC',
            FACEBOOK: 'CHANNEL_FACEBOOK_DOC',
            INSTAGRAM: 'CHANNEL_INSTARGRAM_DOC',
            LINE: 'CHANNEL_LINE_DOC',
            MESSENGER: 'CHANNEL_MESSENGER_DOC',
            'อื่นๆ': 'CHANNEL_OTHERS_DOC',
            'เบอร์โทรศัพท์': 'CHANNEL_PHONE_DOC',
            SMS: 'CHANNEL_SMS_DOC',
            TELEGRAM: 'CHANNEL_TELEGRAM_DOC',
            TWITTER: 'CHANNEL_TWITTER_DOC',
            WEBSITE: 'CHANNEL_WEBSITE_DOC',
            WHATSAPP: 'CHANNEL_WHATSAPP_DOC',
            TIKTOK: 'CHANNEL_TIKTOK_DOC',
            // 'เอกสารหลักฐานอื่นๆ': 'ATTACHMENT_DOC',
        };

        const items: any[] = this.formData?.ATTACHMENT ?? [];
        if (items.length === 0) return formCaseChannel;

        for (const el of items) {
            const key = channelMap[el?.formType ?? ''];
            if (key) {
            (formCaseChannel[key] ??= []).push(el);
            } else {
            // keep unknowns (optional)
            (formCaseChannel.ATTACHMENT_DOC ??= []).push(el);
            }
        }

        return formCaseChannel;
    }

    selectTypeSender(){
        if(this.formData.CRIMINAL_SMS_DESTINATION_TYPE){
            this.formData.CRIMINAL_SMS_DESTINATION = null;
        }
    }
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