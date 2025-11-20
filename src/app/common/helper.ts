import Swal from "sweetalert2";

/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { environment } from "src/environments/environment";
import * as CryptoJS from 'crypto-js';
import { User } from "../services/user";
import * as Cookies from 'js-cookie';

/* eslint-disable prefer-arrow/prefer-arrow-functions */
export function pathCombine(...args: string[]) {
    return args.map((part, i) => {
        if (!part) {
            return "";
        }

        if (i === 0) {
            return part.trim().replace(/[\/]*$/g, '');
        } else {
            return part.trim().replace(/(^[\/]*|[\/]*$)/g, '');
        }
    }).filter(x => x.length).join('/');
}

export function adjustTimezone(myDate, myTimezone) {
    const offset = isNaN(myTimezone) ? new Date().getTimezoneOffset() : parseFloat(myTimezone) * 60;
    return new Date(myDate.getTime() + offset * 60 * 1000);
}

export function parseIntStrict(num) {
    return (num !== null && num !== '' && !isNaN(parseInt(num, 10))) ? parseInt(num, 10) : null;
}

export function getMaxDate(month, year) {
    let res = 31;
    if (month != null) {
        if (month === 4 || month === 6 || month === 9 || month === 11) {
            res = 30;
        }
        if (year !== null && month === 2) {
            res = ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0) ? 29 : 28;
        }
    }
    return res;
}

export function parseDate(myDate, myTimezone) {
    let res = null;
    if (myDate !== undefined && myDate !== null) {
        if (myDate instanceof Date) {
            res = myDate;
        } else {
            if (typeof myDate === 'number' || typeof myDate === 'string') {
                // Parse date.
                if (typeof myDate === 'number') {
                    res = new Date(parseInt(myDate.toString(), 10));
                } else {
                    res = new Date(myDate);
                }
                // Adjust timezone.
                res = adjustTimezone(res, myTimezone);
            }
        }
    }
    return res;
}

export function trimObject(obj: Record<string, any>): void {
    if (!obj) return;
    
    Object.keys(obj).forEach((key) => {
        if (!obj[key] && obj[key] !== 0) delete obj[key]; // ลบค่าที่เป็น falsy (ยกเว้น 0)
    });
}

export function isTablet(): boolean {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      // ตรวจสอบว่าเป็นอุปกรณ์ Tablet (ครอบคลุม iPad และ Android Tablet)
      return /iPad|Android|Tablet|PlayBook|Silk/.test(userAgent) 
        && !/Mobile/.test(userAgent); // ต้องไม่ใช่โทรศัพท์มือถือ
}


export function rotateImageBase64(base64Image: string, angle: number): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64Image;
        img.crossOrigin = 'Anonymous'; // ป้องกัน CORS

        img.onload = () => {
            if (angle % 360 === 0) {
                resolve(base64Image); // ถ้า angle = 0° หรือ 360° ให้คืนค่าเดิม
                return;
            }

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject('Canvas context is not supported');
                return;
            }

            

            const radians = (angle % 360) * (Math.PI / 180);
            const is90or270 = angle % 180 !== 0;

            // สลับขนาดของ canvas เฉพาะเมื่อเป็น 90° หรือ 270°
            canvas.width = is90or270 ? img.height : img.width;
            canvas.height = is90or270 ? img.width : img.height;

            // ย้ายจุดเริ่มต้นไปที่กึ่งกลาง canvas และหมุน
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(radians);

            // จัดการการพลิกกลับของภาพเมื่อเป็น 180°
            if (angle % 360 === 180) {
                ctx.scale(-1, -1);
            }

            // วาดภาพกลับไปที่ตำแหน่งที่ถูกต้อง
            ctx.drawImage(img, -img.width / 2, -img.height / 2);

            resolve(canvas.toDataURL('image/png'));
        };

        img.onerror = (err) => reject(err);
    });
}

export function isValidUrl(url: string): boolean {
    const urlRegex = new RegExp(
        /\b((https?:\/\/)?(www\.)?[\w\-]+(\.[a-z]{2,})+([\/\w\-._~:?#[\]@!$&'()*+,;=]*)?)\b/,
        'gm'
      )
    return urlRegex.test(url);
}

export function isNullOrEmptyObject(obj: any): boolean {
    return obj == null || Object.keys(obj).length === 0;
}

export function convertEmbeddedBankCode(input: string): string {
  const regex = /(\d{8})([A-Za-z]{3,})(\d+)/g;

  return input.replace(regex, (_, datePart, bankCode, refNumber) => {
    return `${datePart}${bankCode.toUpperCase()}${refNumber}`;
  });
}


export function ValidateUrl(url: string): boolean {
    const popularUrlRegex = /^(https?:\/\/)?(www\.)?(facebook\.com|google\.com|instagram\.com|youtube\.com|twitter\.com|x\.com|tiktok\.com|linkedin\.com|pantip\.com|lazada\.co\.th|shopee\.co\.th)\/?$/;
    return popularUrlRegex.test(url);
}

export function DialogSuccess(title = "สำเร็จ", text = "") {
    return new Promise(r => {
        Swal.fire({
            title: `${title}!`,
            text: `${text}!`,
            icon: "success",
            confirmButtonText: "Ok",
        }).then(() => {
            r(true);
        });
    });

}


export function delayTimer(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function dialogWarning(title = "ผิดพลาด", text = "") {
    Swal.fire({
        title: `${title}!`,
        text: `${text}!`,
        icon: "warning",
        confirmButtonText: "Ok",
    }).then(() => { });
}

export function ConfirmDelete(): Promise<boolean> {
    return new Promise(r => {
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
                r(true);
            } else {
                r(false);
            }
        });
    });
}
export function encrypt(text: string): string {
    const keyString = environment.config.generateKey;

    // ตรวจสอบว่าคีย์มีความยาว 16, 24, หรือ 32 ไบต์ (AES เท่านั้น)
    const key = CryptoJS.enc.Utf8.parse(keyString);

    // สร้าง IV แบบสุ่ม 16 ไบต์
    const iv = CryptoJS.lib.WordArray.random(16);

    const localTime = new Date();
    const expiryTime = new Date(localTime.getTime() + 10 * 60000); // +10 นาที
    const rawData = `${User.Current.PersonalId}|${text}|${expiryTime.toISOString()}`;

    // เข้ารหัส
    const encrypted = CryptoJS.AES.encrypt(rawData, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    // นำ IV + Ciphertext มาต่อกัน แล้วแปลงเป็น Base64 เพื่อให้ .NET ถอดรหัสได้
    const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
    const cipherBase64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);

    // รวมเป็น Buffer เหมือน .NET ทำ
    const ivBytes = CryptoJS.enc.Base64.parse(ivBase64);
    const cipherBytes = CryptoJS.enc.Base64.parse(cipherBase64);
    const fullBytes = ivBytes.concat(cipherBytes);

    const fullBase64 = CryptoJS.enc.Base64.stringify(fullBytes);

    return fullBase64;
}

type DecodedCookie = {
    raw: string;            // ตรงๆ หลัง atob เช่น "MySecretKey_2025-10-15T11:28:00.000Z"
    keyPart: string;        // ส่วน key (ก่อน underscore)
    dateTimePart: string;   // ส่วน datetime (หลัง underscore)
};

/**
 * อ่านและถอดรหัส session cookie ตาม key ที่ระบุ
 * - คืนค่า DecodedCookie ถ้าพบและถอดรหัสได้
 * - คืนค่า null ถ้าไม่พบหรือถอดรหัสไม่สำเร็จ
 */
export function getSessionCookie(): DecodedCookie | null {
    try {
        const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
        const cookieName = btoa(`session_check_suspention_${environment.config.generateKey}_${today}`);

        const encoded = Cookies.get(cookieName);
        if (!encoded) return null;

        // ถอด base64
        const decoded = atob(encoded); // เช่น "MySecretKey_2025-10-15T11:28:00.000Z"

        // แยกเป็น key กับ datetime (แยกด้วย '_' ตัวแรก)
        const sepIndex = decoded.indexOf('_');
        if (sepIndex === -1) {
            // รูปแบบไม่ตรงตามที่คาด
            return { raw: decoded, keyPart: decoded, dateTimePart: '' };
        }

        const keyPart = decoded.substring(0, sepIndex);
        const dateTimePart = decoded.substring(sepIndex + 1);

        return { raw: decoded, keyPart, dateTimePart };
    } catch (err) {
        // ถอดรหัสล้มเหลว (เช่น atob ข้อมูลไม่ถูกต้อง)
        console.error('getSessionCookie error:', err);
        return null;
    }
}

/**
 * ลบ cookie ที่สร้างตาม key สำหรับวันนี้ (ใช้กับ js-cookie)
 */
export function removeSessionCookie(): void {
    const today = new Date().toISOString().split('T')[0];
    const cookieName = btoa(`session_check_suspention_${environment.config.generateKey}_${today}`);
    Cookies.remove(cookieName, { path: '/' });
}


export function createSessionCookie(): void {
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // เช่น 2025-10-15
    const dateTime = now.toISOString(); // เช่น 2025-10-15T11:28:00.000Z

    // 🔐 เข้ารหัสชื่อและค่า
    const cookieName = btoa(`session_check_suspention_${environment.config.generateKey}_${today}`);
    const cookieValue = btoa(`${environment.config.generateKey}_${dateTime}`);

    // 🍪 ไม่ใส่ expires -> เป็น session cookie
    // document.cookie = `${cookieName}=${cookieValue}; path=/; Secure; SameSite=Strict`;
    Cookies.set(cookieName, cookieValue, {
        path: '/',
        secure: true,
        sameSite: 'Strict'
    });
}
