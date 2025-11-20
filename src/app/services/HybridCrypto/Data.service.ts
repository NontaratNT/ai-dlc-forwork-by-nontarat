import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HybridCryptoService } from "./hybridcrypto.service";
import { environment } from "src/environments/environment";

// Interface สำหรับ Request ที่เข้ารหัส AES-CBC + RSA key + IV
export interface EncryptedRequest {
    key: string;
    data: string;
    iv: string;
}
export interface UserData {
    username: string;
    email: string;
}
// Interface สำหรับ Response
export interface ProcessResponse {
    IsSuccess: boolean;
    StatusCode: number;
    Message: string;
    StatusDateTime: string;
    Value?: any[];
}

@Injectable({
    providedIn: "root",
})
export class DataService {
    constructor(
        private http: HttpClient,
        private cryptoService: HybridCryptoService
    ) {}

    /**
     * ส่งข้อมูลเข้ารหัส AES-CBC + RSA key + IV
     * และถอดรหัส Response ที่เข้ารหัส AES-CBC
     */
    public sendEncryptedData(payload: any): Observable<any> {
        return this.http.post<any>(
            environment.config.baseConfig.apiUrl + "/SecureApi/data",
            payload
        );
    }

    public sendEncryptedDataform(payload: FormData): Observable<any> {
        return this.http.post<any>(
            environment.config.baseConfig.apiUrl + "/SecureApi/data",
            payload
        );
    }

    public getKey(username: string): Observable<any> {
        return this.http.post<any>(
            environment.config.eFormHost + "/user/challenge",
            { UserName: username }
        );
    }
}
