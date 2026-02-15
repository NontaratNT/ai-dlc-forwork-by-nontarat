import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { EformRequestFactory, EFORM_REQUEST } from "eform-share";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class SuspensionService {
    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory,private http: HttpClient) { }

    public GetMule(): Observable<any> {
        const your_ip_address = sessionStorage.getItem('ip_address') ?? ''; // ดึงค่าที่เก็บไว้ใน sessionStorage;

        const url = `${environment.config.baseConfig.apiUrl}/Officer/CmsReqAccountFreeeze/v_account`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-IP': your_ip_address,
        });
        return this.http.get<any>(url, { headers });
    }
}