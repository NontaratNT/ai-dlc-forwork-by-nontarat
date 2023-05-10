import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
    providedIn: 'root'
})
export class TranslateConfigService {
    constructor(private translateService: TranslateService) {
        // ตั้งค่าภาษาเริ่มต้นให้กับ static content = en|th.
        const getLocalLang = localStorage.getItem('langMode');
        // console.log("langMode: ", getLocalLang);

        if (getLocalLang) {
            this.translateService.use(getLocalLang);
        } else {
            this.translateService.use('th'); // default is Thai Language.
        }
    }
}
