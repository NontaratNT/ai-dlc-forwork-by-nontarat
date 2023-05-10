
import { Component, OnInit, ViewChild } from '@angular/core';
import { DxButtonComponent } from 'devextreme-angular';
import { TaskInfo, WorkflowService } from 'eform-share';
import { ActivatedRoute, Router } from '@angular/router';
import { Dialog, FileSizePipe } from 'share-ui';
import { custom } from 'devextreme/ui/dialog';
import { finalize } from 'rxjs/operators';
import DataSource from 'devextreme/data/data_source';
import { environment } from 'src/environments/environment';
import { formatDate } from 'devextreme/localization';
import { BpmAttachmentService, IBPMAttachment } from 'src/app/services/bpm-attachment.service';
import { BpmProcinstService } from 'src/app/services/bpm-procinst.service';
import { BpmAttachmentTypeService } from 'src/app/services/bpm-attachment-type.service';
import { IBPMAttachmentType } from 'src/app/common/@type/bpm-attachment';
import Swal from 'sweetalert2';
import { BusinessKey } from 'src/app/common/business-key';
import { IssueOnlineContainerComponent } from '../issue-online-container/issue-online-container.component';
import * as moment from 'moment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IssueOnlineFileUploadService } from 'src/app/services/issue-online-file-upload.service';

@Component({
    selector: 'app-attach-file',
    templateUrl: './attach-file.component.html',
    styleUrls: ['./attach-file.component.scss']
})
export class AttachFileComponent implements OnInit {
    @ViewChild("uploadBtn", { static: true }) dxUploadButton: DxButtonComponent;
    public mainConponent: IssueOnlineContainerComponent;
    monthFulltTh = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
        'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
        'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    popup = false;
    fileToUpload: File;
    fileData: FileList;
    data_ = {} as any;
    // formAttach: DataSource;
    formAttach = [];
    formAttachData: IBPMAttachment;
    // taskInfo: TaskInfo;
    popupViewFile = false;
    popupViewFileData: any = {};
    _isLoading = false;
    fileView: string;
    _instId: number;
    wfinsId: string;
    _hidden: string;
    urlSafe: SafeResourceUrl;
    type: number;
    typeAttachment: IBPMAttachmentType[];
    constructor(private serviceAttachment: BpmAttachmentService,
        private workflowServ: WorkflowService,
        private router: Router,
        private _issueFile: IssueOnlineFileUploadService,
        public sanitizer: DomSanitizer,
        private activeRoute: ActivatedRoute,
        private dailog: Dialog,
        private bpmProcinstServ: BpmProcinstService,
        private acttachmentType: BpmAttachmentTypeService) {
        this.formAttach = [];
        this.formAttachData = {} as any;
    }
    ngOnInit(): void {
        this._isLoading = true;

        this._instId = this.activeRoute.snapshot.params.instId;
        // this.loaddata(this._instId);
        // this.formAttach = new DataSource({
        //     load: () => this.serviceAttachment.get(this._instId).toPromise()
        //         .then(_ => {
        //             if (!_) {
        //                 _ = null;
        //             }
        //             return { data: _ };
        //         })
        // });

        this.loaddata(this._instId);
        this.serviceAttachment.get(this._instId).subscribe(_ => {
            this.formAttach = _;
            // this.formAttach.forEach(data => {
            //     // console.log(data);
            //     if (data.INST_ATTACHMENT_ACTION_FLAG === 'V') {
            //         this._hidden = 'hidden';
            //     }
            // });
            this._isLoading = false;

        });


        this.acttachmentType.gets({
            OfficerAttachmentFlag: 'N',
        }).subscribe(_ => {
            this.typeAttachment = _;
        });
    }
    loaddata(id) {
        if (id) {
            this.bpmProcinstServ.getByInstId(id).subscribe(res => {
                this.wfinsId = res.WF_INSTANCE_ID;
            });
        }
    }
    CheckLimitFile(data: any = []){
        const countArray = data.length ?? 0;
        if (countArray >= 20){
            return false;
        }
        return true;

    }
    ShowInvalidDialog(myText = "กรุณาแนบไฟล์นามสกุล .pdf, .jpg, .png เท่านั้น") {
        Swal.fire({
            title: "ผิดพลาด!",
            text: myText,
            icon: "error",
            confirmButtonText: "Ok",
        }).then(() => {});
    }

    async uploadFileInput(files) {
        if(!this.CheckLimitFile(this.formAttach ?? [])){
            this.ShowInvalidDialog('ไม่สามารถอัพโหลดเกิน 20 ไฟล์');
            return ;
        }
        this.fileData = files.target.files;
        this.fileToUpload = this.fileData.item(0);
        this._isLoading = true;
        if (this.fileToUpload !== null) {
            const check = await this._issueFile.CheckFileUploadAllowSize(this.fileToUpload);
            if (check.status){
                await this.serviceAttachment.create(this.formatData()).toPromise();
                this.formAttach = await  this.serviceAttachment.get(this._instId).toPromise();
                Swal.fire({
                    title: 'สำเร็จ!',
                    text: 'บันทึกเรียบร้อย',
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                }).then(() => {});
            }

        }
        this._isLoading = false;
    }

    formatData(): FormData {
        const formData = new FormData();
        // this.formAttachData = {};
        // this.formAttachData.WF_INSTANCE_ID = this.wfinsId;
        // this.formAttachData.INST_ID = this._instId;
        // this.formAttachData.INST_ATTACHMENT_ACTION_FLAG = 'A';
        const formAttachData = {
            WF_INSTANCE_ID: this.wfinsId,
            INST_ID: this._instId,
            INST_ATTACHMENT_ACTION_FLAG: 'A',
        };
        for (const key in formAttachData) {
            if (formAttachData[key] !== null && formAttachData[key] !== undefined) {
                formData.append(key, formAttachData[key]);
            }
        }

        if (this.fileToUpload) {
            formData.append("File", this.fileToUpload);
        }

        return formData;
    }

    delete(d) {
        Swal.fire({
            title: 'ยืนยันการลบไฟล์?',
            text: " ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#7d7d7d',
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'ตกลง'
        }).then(async (result) => {
            if (result.isConfirmed) {
                this._isLoading = true;
                await this.serviceAttachment.delete(d.data.INST_ATTACHMENT_ID).toPromise();
                Swal.fire({
                    title: 'สำเร็จ!',
                    text: 'ลบเรียบร้อย',
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                }).then(() => {
                    this.formAttach.length = 0;
                    this.serviceAttachment.get(this._instId).subscribe(_a => {
                        this.formAttach = _a;
                        this._isLoading = false;
                    }); this.loaddata(this._instId);
                    this.serviceAttachment.get(this._instId).subscribe(_ => {
                        this.formAttach = _;
                        // this.formAttach.forEach(data => {
                        //     // console.log(data);
                        //     if (data.INST_ATTACHMENT_ACTION_FLAG === 'V') {
                        //         this._hidden = 'hidden';
                        //     }
                        // });
                        this._isLoading = false;

                    });
                });

            }
        });

    }

    previewButtonClicked(cellInfo) {
        // this.fileView = environment.config.baseConfig.resourceUrl + cellInfo.row.data.INST_ATTACHMENT_PATH;
        this.fileView = environment.config.baseConfig.resourceUrl.replace("/ccib", "/bpm") + cellInfo.data.INST_ATTACHMENT_PATH;
        this.data_ = cellInfo.data;
        // this.type.INST_ATTACHMENT_NAME.index
        this.type = this.data_.INST_ATTACHMENT_NAME.lastIndexOf('.pdf');
        window.open(this.fileView);
        // this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileView.toString());
        // console.log(this.type );
        // this.popup = true;
    }

    onClose() {
        this.popup = false;
    }

    OpenFileDialog(e, uploadTag) {
        e.event.stopPropagation();
        uploadTag.value = "";
        uploadTag.click();
    }

    typeSelected(e, cell) {
        this._isLoading = true;
        // this.formAttachData.WF_INSTANCE_ID = this.taskInfo.Id;
        // this.formAttachData.INST_ID = this._taskInfoShard.businessKey.bpmId;
        // console.log('cell',cell);
        // this.formAttachData.WF_INSTANCE_ID = undefined;
        // this.formAttachData.INST_ID = undefined;
        // this.formAttachData.INST_ATTACHMENT_ID = cell.row.data.INST_ATTACHMENT_ID;
        // this.formAttachData.INST_ATTACHMENT_TYPE_ID = e.value;
        const d = cell.row.data;
        const id = d.INST_ATTACHMENT_ID;
        const data = {
            WF_INSTANCE_ID: this.wfinsId,
            INST_ID: this._instId,
            INST_ATTACHMENT_ID: d.INST_ATTACHMENT_ID,
            INST_ATTACHMENT_TYPE_ID: d.INST_ATTACHMENT_TYPE_ID,
            INST_ATTACHMENT_ACTION_FLAG: 'A',
        };
        const formData = new FormData();
        for (const key in data) {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        }

        this.serviceAttachment.update(formData, id)
            .pipe(finalize(() => this._isLoading = false))
            .subscribe(_ => {
                Swal.fire({
                    title: 'สำเร็จ!',
                    text: 'เพิ่มประเภทเรียบร้อยแล้ว',
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                }).then(() => {
                    this.serviceAttachment.get(this._instId).subscribe(_a => {
                        this.formAttach = _a;
                    });
                });
            });
    }

    formatDate(e) {
        return formatDate(new Date(e.CREATE_DATE), "dateShortTimeThai");
    }

    ConvertDateFullMonth(date) {
        const d = new Date(date);
        const month = d.getMonth();
        const ddate = ` ${d.getDate()} `;
        const textMonthNow = ` ${this.monthFulltTh[month]}`;
        const year = (d.getFullYear() + 543);
        return [ddate, ' ', textMonthNow, ' ', year].join("");
    }

    ConvertDateToMomentTime(date) {
        if (date === null) {
            return '00:00';
        }
        return moment(date, "YYYY-MM-DD HH:mm:ss").format('HH:mm');
    }

    Back(e) {
        this.mainConponent.NextIndex(this.mainConponent.indexTab - 1);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        // console.log(this.mainConponent.numCount);
    }

    ClosePopupViewFile(e) {
        this.popupViewFile = false;
        this.popupViewFileData = {};
    }

    DownloadFile() {
        const data = this.data_;
        const linkSource = data.INST_ATTACHMENT_PATH;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = data.INST_ATTACHMENT_NAME;
        downloadLink.click();
    }

}
