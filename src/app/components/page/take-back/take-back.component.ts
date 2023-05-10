import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { formatDate } from 'devextreme/localization';
import { finalize } from 'rxjs/operators';
import { ChatService, IChat } from 'src/app/services/chat.service';
import { User } from 'src/app/services/user';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { TaskInfoShareService } from '../tasklist-tab-record/task-info-share.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Dialog } from 'share-ui';
import Swal from 'sweetalert2';
import { IReject, TitleService } from 'src/app/services/title.service';
import { BpmProcinstService } from 'src/app/services/bpm-procinst.service';

@Component({
    selector: 'app-take-back',
    templateUrl: './take-back.component.html',
    styleUrls: ['./take-back.component.scss']
})
export class TakeBackComponent implements OnInit {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    _isLoading = false;
    visable = false;
    _instId: number;
    userId: number;
    checkbox = false;
    detail: string;
    formData: IReject;
    constructor(private activeRoute: ActivatedRoute,
                private rejectService: TitleService,
                private bpmProcinstServ: BpmProcinstService,) {
        this.formData = {} as any;
    }

    ngOnInit(): void {
        this.userId = User.Current.PersonalId;
        this._instId = this.activeRoute.snapshot.params.instId;
        this.loadData(this._instId);

    }

    loadData(id) {
        if (id) {
            this.bpmProcinstServ.getByInstId(id).subscribe(_ => {
                this.formData.REJECT_FLAG = _.REJECT_FLAG;
                this.formData.REJECT_REMARK = _.REJECT_REMARK;
                if (_.REJECT_FLAG === "Y") {
                    this.checkbox = true;
                    this.visable = true;
                } else {
                    this.checkbox = false;
                    this.visable = false;
                }
            });
        }

    }

    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    oncheck(e) {
        // console.log(e);
        if (e.value === true) {
            this.formData.REJECT_FLAG = "Y";
            this.visable = true;
        } else {
            this.formData.REJECT_FLAG = "N";
            this.formData.REJECT_REMARK = "";
            this.visable = false;
        }
    }


    sendMessage() {
        // console.log(this._instId);
        // console.log(this.formData);
        this.rejectService.putTakeBack(this._instId, this.formData)
            .pipe(finalize(() => this._isLoading = false))
            .subscribe(_ => {
                Swal.fire({
                    title: 'สำเร็จ!',
                    text: 'บันทึกเรียบร้อย',
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                });
            });

    }
}
