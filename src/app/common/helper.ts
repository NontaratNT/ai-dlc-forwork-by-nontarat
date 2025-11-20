import * as CryptoJS from 'crypto-js';
import { User } from '../services/user';
import { environment } from 'src/environments/environment';
import Swal from "sweetalert2";

/* eslint-disable @typescript-eslint/restrict-plus-operands */
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