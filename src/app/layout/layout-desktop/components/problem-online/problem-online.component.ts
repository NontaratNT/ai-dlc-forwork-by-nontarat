import { User } from './../../../../services/user';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DxMultiViewComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { Dialogue } from 'src/app/services/dialogue';
import { IProblemInfo, ProblemService } from 'src/app/services/problem.service';
import th from 'src/assets/i18n/th';
import Swal from 'sweetalert2';
import { ProblemOnlineAddComponent } from '../problem-online-add/problem-online-add.component';

@Component({
    selector: 'app-problem-online',
    templateUrl: './problem-online.component.html',
    styleUrls: ['./problem-online.component.scss']
})
export class ProblemOnlineComponent implements OnInit {
    @ViewChild(DxMultiViewComponent, { static: true }) multiView: DxMultiViewComponent;
    @ViewChild(ProblemOnlineAddComponent, { static: true }) form: ProblemOnlineAddComponent;

    public formProblem: IProblemInfo;
    _dataSource: DataSource;
    _isLoading = false;
    userId = {};

    // problem: IProblemInfo[] = [];
    constructor(
        private problemService: ProblemService,
    ) {
        this.formProblem = {} as any;
    }

    ngOnInit(): void {
        this.form.mainForm = this;
        this.load();
    }

    load(){
        const userId = User.Current.UserId;
        this._dataSource = new DataSource({
            load: () => this.problemService.GetProblembyUser(userId).toPromise()
                .then(_ => {
                    if (!_) {
                        _ = [];
                    }
                    return { data: _ };
                })
        });
    }
    Add() {
        this.multiView.selectedIndex = 1;
        this.form.formProblem.RECORD_STATUS = "A";
        this.form.formProblem.CASE_ID = undefined;
        this.form.formProblem.FEEDBACK_NAME = undefined;
        this.form.formProblem.FEEDBACK_TYPE_CODE = undefined;
        this.form.formProblem.FEEDBACK_REMARK = undefined;
        this.form.ClearForm();
    }
    Edit(e){
        this.form.check = true;
        this.formProblem = Object.assign({}, e.data);
        this.multiView.selectedIndex = 1;
        // this.form.Load();
    }

    async Delete(e, d){
        const confirm = await Dialogue.Confirm("ยืนยัน",
            `คุณต้องการลบข้อมูลนี้หรือไม่?`);
        if (!confirm) {
            return;
        }
        this.problemService.delete(d.data.FEEDBACK_ID)
            .subscribe(_ => {
                // custom({
                //     messageHtml: "ลบข้อมูลเรียบร้อย",
                //     title: "สำเร็จ",
                //     buttons: [
                //         { text: "ปิด" }
                //     ]
                // }).show().then(() => {
                //     this.appOrgInfo.reload();
                // });
                Swal.fire({
                    title: 'สำเร็จ!',
                    text: "ลบข้อมูลเรียบร้อย",
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                }).then(() => {
                    this._dataSource.reload();
                });
            });
    }

}
