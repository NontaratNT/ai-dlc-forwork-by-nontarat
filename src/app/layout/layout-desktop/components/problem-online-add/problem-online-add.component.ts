import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxFormComponent, DxMultiViewComponent } from 'devextreme-angular';
import { IProblemInfo, ProblemService } from 'src/app/services/problem.service';
import Swal from 'sweetalert2';
import { ProblemOnlineComponent } from '../problem-online/problem-online.component';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-problem-online-add',
    templateUrl: './problem-online-add.component.html',
    styleUrls: ['./problem-online-add.component.scss']
})
export class ProblemOnlineAddComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: true }) form: DxFormComponent;
    @Input() check: boolean;
    @Input() formProblem: IProblemInfo;
    public mainForm: ProblemOnlineComponent;
    // public formProblem: IProblemInfo;
    id: number;

    problem = [
        {ID:1,TEXT:"ไม่สามารถติดต่อเจ้าหน้าที่ได้"},
        {ID:2,TEXT:"ยังไม่ได้รับการนัดหมายเพื่อไปสอบปากคำ"},
        {ID:3,TEXT:"ความคืบหน้าทางคดีล่าช้าเกิน 1 เดือน"},
        {ID:4,TEXT:"อื่นๆ"}
    ];
    checkproblem = true;
    _isLoading = false;
    caseIdPattern: any = /^(W|L|C)\d+$/;

    constructor(
        private problemService: ProblemService,
    ) {
        this.formProblem = {} as any;
    }

    ngOnInit(): void {
    }

    public Load() {
        if (this.check) {
            this.formProblem = Object.assign({}, this.mainForm.formProblem);
        }
    }

    checkCasstatus(event: any){
        if (event.value === 4) {
            this.checkproblem = true;
        }else{
            this.checkproblem = false;
        }
    }
    back() {
        this.mainForm.multiView.selectedIndex = 0;
    }
    Save(e){
        if (!this.form.instance.validate().isValid) {
            Swal.fire({
                title: 'ผิดพลาด!',
                text: "กรุณากรอกข้อมูลให้ครบถ้วน",
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => { });
            return;
        }
        // console.log("this.formProblem", this.formProblem);
        if (this.check) {
            this.id = this.formProblem.FEEDBACK_ID;
            // e.startWait();
            this.problemService.Put(this.id, {
                FEEDBACK_ID: this.formProblem.FEEDBACK_ID,
                FEEDBACK_NAME: this.formProblem.FEEDBACK_NAME,
                FEEDBACK_TYPE_CODE: this.formProblem.FEEDBACK_TYPE_CODE,
                FEEDBACK_REMARK: this.formProblem.FEEDBACK_REMARK,
                PERSONAL_FULL_NAME: this.formProblem.PERSONAL_FULL_NAME,
                CASE_ID: this.formProblem.CASE_ID,
                DEL_FLAG: this.formProblem.DEL_FLAG,
                RECORD_STATUS: this.formProblem.RECORD_STATUS,
                CREATE_USER_ID: this.formProblem.CREATE_USER_ID,
            })
                .pipe(finalize(() => e.stopWait()))
                .subscribe(_ => {
                    // this.dialog.info("สำเร็จ", "บันทึกเรียบร้อย");
                    Swal.fire({
                        title: 'สำเร็จ!',
                        text: "บันทึกเรียบร้อย",
                        icon: 'success',
                        confirmButtonText: 'ตกลง'
                    }).then(() => {});
                    this.mainForm.multiView.selectedIndex = 0;
                    this.mainForm._dataSource.reload();
                });
        } else {
            // e.startWait();
            this.problemService.Post({
                FEEDBACK_TYPE_CODE: this.formProblem.FEEDBACK_TYPE_CODE,
                FEEDBACK_NAME: this.formProblem.FEEDBACK_NAME,
                FEEDBACK_REMARK: this.formProblem.FEEDBACK_REMARK,
                PERSONAL_FULL_NAME: this.formProblem.PERSONAL_FULL_NAME,
                CASE_ID: this.formProblem.CASE_ID,
                DEL_FLAG: this.formProblem.DEL_FLAG,
                RECORD_STATUS: this.formProblem.RECORD_STATUS,
                CREATE_USER_ID: this.formProblem.CREATE_USER_ID,
            })
                .pipe(finalize(() => e.stopWait()))
                .subscribe(_ => {
                    // this.dialog.info("สำเร็จ", "บันทึกเรียบร้อย");
                    Swal.fire({
                        title: 'สำเร็จ!',
                        text: "บันทึกเรียบร้อย",
                        icon: 'success',
                        confirmButtonText: 'ตกลง'
                    }).then(() => {});
                    this.mainForm.multiView.selectedIndex = 0;
                    this.mainForm._dataSource.reload();
                });
        }
        // this.ClearForm();
    }
    public ClearForm() {
        this.form.instance.resetValues();
    }
    CheckCaseIDpress(event) {
        const seperator = '^[WLCwcl0-9]+$';
        const maskSeperator = new RegExp(seperator, 'g');
        const result = maskSeperator.test(event.key);
        return result;
    }

    PasteCheckCaseIDpress(event) {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData.getData('text');
        const seperator = '^[WLCwcl0-9]+$';
        const maskSeperator = new RegExp(seperator, 'g');
        const result = maskSeperator.test(pastedText);
        return result;
    }

    CheckCaseID(e){
        if(e.value){
            e.value = e.value.toUpperCase();
            if(e.value[0] == 'W' || e.value[0] == 'L' || e.value[0] == 'C'){
                this.formProblem.CASE_ID = e.value;
            }else{
                Swal.fire({
                    title: 'ผิดพลาด!',
                    html: 'กรุณากรอกเลขเคสไอดีให้ถูกต้อง'+'<br><b>'+'ตัวอย่าง '+'</b>'+'W665210 , L665210 , C665210',
                    icon: 'warning',
                    confirmButtonText: 'Ok',
                }).then(() => {});
            }
        }
    }
}
