import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { EformRequestFactory, EFORM_REQUEST } from "eform-share";
import { Observable } from "rxjs";
import { req } from 'share-ui';
import { environment } from "src/environments/environment";
import { CookieStorage } from "../common/cookie";

@Injectable({
    providedIn: "root",
})
export class AIService {
    constructor(@Inject(EFORM_REQUEST) private _req: EformRequestFactory,private http: HttpClient) { }

    public ScanOcr(param: any): Observable<any> {
        return this._req<any>().api("ChatGpt/ocr-document")
        .host(environment.config.baseConfig.urlgdcc)
        .body(param)
        .disableCriticalDialogError().
        post();
    }
}