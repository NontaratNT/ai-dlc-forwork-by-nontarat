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


export function trimObject(obj: any): void {
    if (obj) {
        Object.keys(obj).forEach((k) => (obj[k] == null || obj[k] === undefined) && delete obj[k]);
    }
}

export function ValidateUrl(url: string): boolean {
    url = url?.trim()?.toLocaleLowerCase();
    const popularUrlRegex = /^(https?:\/\/)?(www\.)?(facebook\.com|google\.com|instagram\.com|youtube\.com|twitter\.com|messenger\.com|x\.com|tiktok\.com|linkedin\.com|pantip\.com|lazada\.co\.th|shopee\.co\.th|line\.com|line\.me|line\.me\/th|www|facebook|line|messenger|x|instagram)\/?$/;
    return popularUrlRegex.test(url);
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
