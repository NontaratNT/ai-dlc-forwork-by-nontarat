import { Injectable } from "@angular/core";
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpResponse,
    HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError, of } from "rxjs";
import { switchMap, catchError } from "rxjs/operators";
import { HybridCryptoService } from "../services/HybridCrypto/hybridcrypto.service";
import { EncryptedRequest } from "../services/HybridCrypto/Data.service";

@Injectable()
export class EncryptInterceptor implements HttpInterceptor {
    constructor(private crypto: HybridCryptoService) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        let clonedReq = req;
        let encrypted: EncryptedRequest | null = null;

        if (req.method === "POST" || req.method === "PUT") {
            let payload: any = req.body;

            // สำหรับ FormData: แยก text field ออกมา encrypt, ส่งไฟล์ปกติ
            if (payload instanceof FormData) {
                const obj: any = {};
                payload.forEach((value, key) => {
                    if (value instanceof File) {
                        // ส่งไฟล์ปกติ
                        obj[key] = value;
                    } else {
                        // text field จะเข้ารหัส
                        obj[key] = value;
                    }
                });

                // Encrypt เฉพาะ text fields
                const textFields: any = {};
                Object.keys(obj).forEach((k) => {
                    if (!(obj[k] instanceof File)) textFields[k] = obj[k];
                });

                encrypted = this.crypto.encryptPayload(textFields);

                // แทนที่ text field ด้วย encrypted.data, encrypted.key, encrypted.iv
                const formData = new FormData();
                Object.keys(obj).forEach((k) => {
                    if (obj[k] instanceof File) {
                        formData.append(k, obj[k]);
                    }
                });
                // ใส่ field เข้ารหัสรวมใน formData
                formData.append("data", encrypted.data);
                formData.append("key", encrypted.key);
                formData.append("iv", encrypted.iv);

                clonedReq = req.clone({ body: formData });
            } else {
                // สำหรับ JSON ธรรมดา
                encrypted = this.crypto.encryptPayload(payload);
                clonedReq = req.clone({
                    body: encrypted,
                    responseType: "text" as "json",
                });
            }
        }

        return next.handle(clonedReq).pipe(
            switchMap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    let  resBody: any = event.body;

                    if (typeof resBody === "string") {
                        try {
                            resBody = JSON.parse(resBody);
                        } catch (err) {
                            console.warn(
                                "Response is not JSON, pass through:",
                                resBody
                            );
                            return of(event); // ถ้า parse ไม่ได้ → ส่งผ่าน response ดั้งเดิม
                        }
                    }

                    // 🧩 response จาก server ควรมีรูปแบบ:
                    // { data: "...", iv: "...", key?: optional }
                    if (resBody?.data && resBody?.iv) {
                        // ✅ ใช้ AES key เดิมที่ client generate ไว้ตอน encrypt request
                        const aesKey = this.crypto.getAesKey();
                        if (!aesKey) {
                            console.warn(
                                "No AES key found for response decryption"
                            );
                            return of(event);
                        }

                        // ✅ ใช้ IV จาก response (ไม่ใช่ของ request)
                        const decrypted = this.crypto.decryptAESPayload(
                            resBody.data,
                            resBody.iv
                        );

                        if (decrypted) {
                            try {
                                let parsed = JSON.parse(decrypted);
                                if (typeof parsed === "string")
                                    parsed = JSON.parse(parsed);
                                return of(event.clone({ body: parsed }));
                            } catch {
                                return of(event.clone({ body: decrypted }));
                            }
                        }
                    } else {
                        const aesKey1 = this.crypto.getAesKey();
                        if (!aesKey1) {
                            console.warn(
                                "No AES key found for response decryption"
                            );
                            return of(event);
                        }
                        const jsontest = JSON.parse(resBody || "{}");

                        const decrypres = this.crypto.decryptAESPayload(
                            jsontest.data,
                            jsontest.iv
                        );

                        console.log(
                            "Non-encrypted response (pass through):",
                            decrypres
                        );
                    }

                    // ⚙️ ถ้าไม่มี field data/iv (เช่น binary file) → ข้ามการ decrypt
                    return of(event);
                }
                return of(event);
            }),
            catchError((error: HttpErrorResponse) => {
                let bodyText =
                    typeof error.error === "string"
                        ? error.error
                        : JSON.stringify(error.error);
                if (encrypted && bodyText) {
                    const decrypted =
                        this.crypto.decryptAESPayload(bodyText, encrypted.iv) ||
                        bodyText;
                    try {
                        let parsed = JSON.parse(decrypted);
                        if (typeof parsed === "string")
                            parsed = JSON.parse(parsed);
                        return throwError(() => parsed);
                    } catch {
                        return throwError(() => ({
                            IsSuccess: false,
                            Message: decrypted,
                        }));
                    }
                }
                return throwError(() => error);
            })
        );
    }
}
