import { Injectable } from "@angular/core";
import * as CryptoJS from "crypto-js";
import { JSEncrypt } from "jsencrypt";

@Injectable({
    providedIn: "root",
})
export class HybridCryptoService {
    private readonly SERVER_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu71x6H43I/3X8+PDPHtn
3XtyJFRCYowA4XLpwmhpFWygbliiCfYqqcdHieNlwy/yhrhmwbqojIn7Cq8mcHYa
EJouD8MfcOV3Y4angBZVs2B9suexUk+A10BCHl1vGnAL6L1jonXfjs4FCbkpBWZP
XINbBqBjinVi9iAlYLn+W9g16TDzEA3SZjepWUOOrwLoi+7eTVUnbGLWjvOvrEDt
NEj3O/b0dMZuL31xEJ1Du4keMyIQeiNPnDkQ7EuZ0yHFRImPQuOV3axCXkrmTnnk
JH2LLw4LNGqroQWp40VPe69djhdxbvC0EzmlasLXGHvh/Nv4BkG1Lzh9vvFnenDf
BwIDAQAB
-----END PUBLIC KEY-----`;

    private currentAesKey: CryptoJS.WordArray | null = null;
    private currentIv: CryptoJS.WordArray | null = null;

    private generateRandomAesKey(): string {
        return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Base64);
    }

    private generateRandomIv(): CryptoJS.WordArray {
        return CryptoJS.lib.WordArray.random(16);
    }

    // 🔐 Encrypt payload (AES-CBC + RSA AES key)
    public encryptPayload(payload: any): {
        key: string;
        data: string;
        iv: string;
    } {
        const plainText = JSON.stringify(payload);

        const aesKeyStr = this.generateRandomAesKey();
        const aesKey = CryptoJS.enc.Base64.parse(aesKeyStr);
        const iv = this.generateRandomIv();

        this.currentAesKey = aesKey;
        this.currentIv = iv;

        const encryptedData = CryptoJS.AES.encrypt(plainText, aesKey, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        }).toString(); // Base64

        const rsa = new JSEncrypt();
        rsa.setPublicKey(this.SERVER_PUBLIC_KEY);
        const encryptedAesKey = rsa.encrypt(aesKeyStr);

        if (!encryptedAesKey) {
            this.currentAesKey = null;
            this.currentIv = null;
            throw new Error("RSA Encryption Failed");
        }

        return {
            key: encryptedAesKey,
            data: encryptedData,
            iv: iv.toString(CryptoJS.enc.Base64),
        };
    }

    // 🔑 Decrypt AES-CBC payload (ต้องใช้ IV จาก server)
    public decryptAESPayload(
        cipherText: string,
        ivBase64: string
    ): string | null {
        if (!this.currentAesKey) {
            console.error("AES Key not available for decryption.");
            return null;
        }
        try {
console.log("cipherText sample:", cipherText.slice(0, 50));
console.log("ivBase64:", ivBase64);

            const iv = CryptoJS.enc.Base64.parse(ivBase64);
            const bytes = CryptoJS.AES.decrypt(cipherText, this.currentAesKey, {
                iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            });
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

            console.log("decryptedData sample:", decryptedData);   
            this.currentAesKey = null;
            this.currentIv = null;

            return decryptedData;
        } catch (e) {
            console.error("AES Decryption failed:", e);
            this.currentAesKey = null;
            this.currentIv = null;
            return null;
        }
    }

        // 🔑 ตั้ง AES key/IV
    public setAesKeyAndIv(key: CryptoJS.lib.WordArray, iv: CryptoJS.lib.WordArray) {
        this.currentAesKey = key;
        this.currentIv = iv;
    }

    // 🔑 ดึง AES key/IV สำหรับ decrypt
    public getAesKey(): CryptoJS.lib.WordArray | null {
        return this.currentAesKey;
    }

    public getIv(): CryptoJS.lib.WordArray | null {
        return this.currentIv;
    }

    // 🔑 ล้าง AES key/IV
    public clearAesKeyAndIv() {
        this.currentAesKey = null;
        this.currentIv = null;
    }
}
