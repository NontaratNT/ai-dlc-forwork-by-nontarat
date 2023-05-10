import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class FormValidatorService {

    constructor() { }
    ValidateForm(brokenRulesData){
        // const isBrokenRulesFrom1 = this.formInformer1.instance.validate().brokenRules;
        for (const item of brokenRulesData) {
            Swal.fire({
                title: "ผิดพลาด!",
                text: item.message ?? "กรุณากรอกข้อมูล",
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => {});
            return;
        }
    }
}
