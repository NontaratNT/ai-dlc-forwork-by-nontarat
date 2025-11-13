
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
import { BpmAttachmentService, Filebase64, IBPMAttachment } from 'src/app/services/bpm-attachment.service';
import { BpmProcinstService } from 'src/app/services/bpm-procinst.service';
import { BpmAttachmentTypeService } from 'src/app/services/bpm-attachment-type.service';
import { IBPMAttachmentType } from 'src/app/common/@type/bpm-attachment';
import Swal from 'sweetalert2';
import { BusinessKey } from 'src/app/common/business-key';
import { BpmDataShareService } from '../issue-online-edit/bpm-data-share.service';
import { IssueOnlineFileUploadService } from 'src/app/services/issue-online-file-upload.service';

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
    formAttach: Filebase64[];
    formAttachData: IBPMAttachment;
    // taskInfo: TaskInfo;
    _isLoading = false;
    fileView: string;
    _instId: number;
    wfinsId: string;
    _hidden: string;
    typeAttachment: IBPMAttachmentType[];
    bpmData: any = {};
    caseWorking = false;

    popupViewFileData: any = {};
    popupViewFile = false;


    constructor(private serviceAttachment: BpmAttachmentService,
                private workflowServ: WorkflowService,
                private router: Router,
                private activeRoute: ActivatedRoute,
                private dailog: Dialog,
                private bpmProcinstServ: BpmProcinstService,
                private acttachmentType: BpmAttachmentTypeService,
                private _issueFile: IssueOnlineFileUploadService,
                private shareBpmData: BpmDataShareService) {
        this.formAttach = [];
        this.formAttachData = {} as any;
    }
    ngOnInit(): void {
        this._isLoading = true;
        this.bpmData = this.shareBpmData.GetData();
        this._instId = this.bpmData.INST_ID;
        this.caseWorking = this.shareBpmData.GetDataCaseWorking();
        // this._instId = this.activeRoute.snapshot.params.instId;
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
    ShowInvalidDialog(myText = "กรุณาแนบไฟล์นามสกุล .pdf, .jpg, .png เท่านั้น") {
        Swal.fire({
            title: "ผิดพลาด!",
            text: myText,
            icon: "error",
            confirmButtonText: "Ok",
        }).then(() => {});
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
                await this.serviceAttachment.creategdcc(this.formatData()).toPromise();
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
                this.formAttach = await this.serviceAttachment.get(this._instId).toPromise();
                this._isLoading = false;

                Swal.fire({
                    title: 'สำเร็จ!',
                    text: 'ลบเรียบร้อย',
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                }).then(() => {});

            }
        });

    }

    previewButtonClicked(cellInfo) {
        // this.fileView = environment.config.baseConfig.resourceUrl + cellInfo.row.data.INST_ATTACHMENT_PATH;

        this.fileView = environment.config.baseConfig.resourceUrl.replace("/ccib", "/bpm") + cellInfo.row.data.INST_ATTACHMENT_PATH;
        // console.log(this.fileView);
        window.open(this.fileView);



    }

    ClosePopupViewFile(e) {
        this.popupViewFile = false;
        this.popupViewFileData = {};
    }

    PopupViewFile(data) {
        // if(data.Type.toString() == 'application/pdf'){
        //     const linkSource = data.Url;
        //     const downloadLink = document.createElement("a");
        //     downloadLink.href = linkSource;
        //     downloadLink.download = data.OriginalName;
        //     downloadLink.click();
        // }else{
            this.popupViewFile = true;
            const setData = {};
            const d = data;
            for (const key in d) {
                if (d[key] !== null && d[key] !== undefined) {
                    setData[key] = d[key];
                }
            }
            this.popupViewFileData = setData;
        // }
    }

    OpenFileDialog(e, uploadTag) {
        if (!this.CheckLimitFile(this.formAttach ?? [])){
            this.ShowInvalidDialog('ไม่สามารถอัพโหลดเกิน 20 ไฟล์');
            return ;
        }
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
        return formatDate(new Date(e.DateNow), "dateShortTimeThai");
    }

}
