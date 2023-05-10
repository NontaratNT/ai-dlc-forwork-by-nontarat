import { CheckDocumentService } from './../../../services/check-document.service';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RecaptchaErrorParameters } from 'ng-recaptcha';
import { SubmissionResult } from 'eform-share';

@Component({
    selector: 'app-check-document',
    templateUrl: './check-document.component.html',
    styleUrls: ['./check-document.component.scss']
})
export class CheckDocumentComponent implements OnInit {

    recapcha: string;
    codeData: ICodeData;
    _isLoading= false;
    constructor( private _checkDucument: CheckDocumentService,
                 private _router: Router,) {
        this.beforeSubmit = this.beforeSubmit.bind(this);
        this.codeData = {} as any;
    }

    ngOnInit(): void {
    }


    save(e){
    }

    beforeSubmit(e) {
        let resolver: (value: SubmissionResult) => void;
        const p = new Promise<SubmissionResult>(_ => resolver = _);

        if(this.codeData.Code) {
            this._checkDucument.getDocument(this.codeData.Code).subscribe( _ => {
                if(_){
                    // console.log(_);
                    this._router.navigate(["/view-case/" + _.CASE_RECORD_REF_NO]);
                    resolver({ isSuccess: true, message: undefined });
                    // });
                }else {
                    resolver({ isSuccess: false, message: 'ตรวจสอบไม่พบรหัสอ้างอิงนี้' });
                }
            });
        }else {
            resolver({ isSuccess: false, message: 'ตรวจสอบไม่สำเร็จ กรุณากรอกรหัสอ้างอิง' });
        }
        return p;
    }
}


export interface ICodeData {
    Code: string;
}
