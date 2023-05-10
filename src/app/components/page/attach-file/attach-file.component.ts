import { BusinessKey } from './../../../common/business-key';
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

@Component({
    selector: 'app-attach-file',
    templateUrl: './attach-file.component.html',
    styleUrls: ['./attach-file.component.scss']
})
export class AttachFileComponent implements OnInit {
    @ViewChild("uploadBtn", { static: true }) dxUploadButton: DxButtonComponent;
    fileToUpload: File;
    fileData: FileList;
    // formAttach: DataSource;
    formAttach: IBPMAttachment[];
    formAttachData: IBPMAttachment;
    // taskInfo: TaskInfo;
    _isLoading = false;
    fileView: string;
    _instId: number;
    wfinsId: string;
    _hidden: string;
    typeAttachment: IBPMAttachmentType[];
    constructor(private serviceAttachment: BpmAttachmentService,
                private workflowServ: WorkflowService,
                private router: Router,
                private activeRoute: ActivatedRoute,
                private dailog: Dialog,
                private bpmProcinstServ: BpmProcinstService,
                private acttachmentType: BpmAttachmentTypeService) {
        this.formAttach = [];
        this.formAttachData = {} as any;
    }
    ngOnInit(): void {
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



    uploadFileInput(files) {
        this.fileData = files.target.files;
        this.fileToUpload = this.fileData.item(0);
        this._isLoading = true;
        if (this.fileToUpload !== null) {
            this.serviceAttachment.create(this.formatData())
                .pipe(finalize(() => this._isLoading = false))
                .subscribe(_ => {
                    // custom({
                    //     messageHtml: "บันทึกเรียบร้อย",
                    //     title: "สำเร็จ",
                    //     buttons: [
                    //         { text: "ปิด" }
                    //     ]
                    // }).show().then(() => {
                    //     // this.formAttach.reload();
                    //     this.serviceAttachment.get(this._instId).subscribe(_s => {
                    //         this.formAttach = _s;
                    //     });
                    // });
                    Swal.fire({
                        title: 'สำเร็จ!',
                        text: 'บันทึกเรียบร้อย',
                        icon: 'success',
                        confirmButtonText: 'ตกลง'
                    }).then(() => {
                        this.serviceAttachment.get(this._instId).subscribe(_s => {
                            this.formAttach = _s;
                        });
                    });
                });
        }
        this._isLoading = false;
    }

    formatData(): FormData {
        const formData = new FormData();

        this.formAttachData.WF_INSTANCE_ID = this.wfinsId;
        this.formAttachData.INST_ID = this._instId;
        this.formAttachData.INST_ATTACHMENT_ACTION_FLAG = 'A';

        for (const key in this.formAttachData) {
            if (this.formAttachData[key] === "" || this.formAttachData[key] === '') {
                formData.append(key, "");
            } else if (this.formAttachData[key] !== null && this.formAttachData[key] !== undefined) {
                formData.append(key, this.formAttachData[key]);
            }
        }

        if (this.fileToUpload) {
            formData.append("File", this.fileToUpload);
        }

        return formData;
    }

    delete(d) {
        this._isLoading = true;
        this.serviceAttachment.delete(d.data.INST_ATTACHMENT_ID)
            .pipe(finalize(() => this._isLoading = false))
            .subscribe(_ => {
                // custom({
                //     messageHtml: "ลบเรียบร้อย",
                //     title: "สำเร็จ",
                //     buttons: [
                //         { text: "ปิด" }
                //     ]
                // }).show().then(() => {
                //     // this.formAttach.reload();
                //     this.serviceAttachment.get(this._instId).subscribe(_d => {
                //         this.formAttach = _d;
                //     });
                // });
                Swal.fire({
                    title: 'สำเร็จ!',
                    text: 'ลบเรียบร้อย',
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                }).then(() => {
                    this.serviceAttachment.get(this._instId).subscribe(_d => {
                        this.formAttach = _d;
                    });
                });
            });
    }

    previewButtonClicked(cellInfo) {
        // this.fileView = environment.config.baseConfig.resourceUrl + cellInfo.row.data.INST_ATTACHMENT_PATH;

        this.fileView = environment.config.baseConfig.resourceUrl.replace("/ccib", "/bpm") + cellInfo.row.data.INST_ATTACHMENT_PATH;
        // console.log(this.fileView);
        window.open(this.fileView);



    }

    OpenFileDialog(e, uploadTag) {
        e.event.stopPropagation();
        uploadTag.click();
    }

    typeSelected(e, cell) {

        // this.formAttachData.WF_INSTANCE_ID = this.taskInfo.Id;
        // this.formAttachData.INST_ID = this._taskInfoShard.businessKey.bpmId;
        this.formAttachData.WF_INSTANCE_ID = undefined;
        this.formAttachData.INST_ID = undefined;
        this.formAttachData.INST_ATTACHMENT_ID = cell.row.data.INST_ATTACHMENT_ID;
        this.formAttachData.INST_ATTACHMENT_TYPE_ID = e.value;
        this.serviceAttachment.update(this.formatData(), this.formAttachData.INST_ATTACHMENT_ID)
            .pipe(finalize(() => this._isLoading = false))
            .subscribe(_ => {
                // custom({
                //     messageHtml: "เพิ่มประเภทเรียบร้อยแล้ว",
                //     title: "สำเร็จ",
                //     buttons: [
                //         { text: "ปิด" }
                //     ]
                // }).show().then(() => {
                //     // this.formAttach.reload();
                //     this.serviceAttachment.get(this._instId).subscribe(_a => {
                //         this.formAttach = _a;
                //     });
                // });
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

}
