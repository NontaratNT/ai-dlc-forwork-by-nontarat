import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DxButtonComponent } from 'devextreme-angular';
import { formatDate } from 'devextreme/localization';
import { IBPMAttachmentType } from 'src/app/common/@type/bpm-attachment';
import { BpmAttachmentOfficerService, IBPMAttachmentOfficer } from 'src/app/services/bpm-attachment-officer.service';
import { BpmAttachmentTypeService } from 'src/app/services/bpm-attachment-type.service';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-attach-file-officer',
    templateUrl: './attach-file-officer.component.html',
    styleUrls: ['./attach-file-officer.component.scss']
})
export class AttachFileOfficerComponent implements OnInit {


    @ViewChild("uploadBtn", { static: true }) dxUploadButton: DxButtonComponent;
    fileToUpload: File;
    fileData: FileList;
    formAttach: IBPMAttachmentOfficer[];
    formAttachData: IBPMAttachmentOfficer;
    _isLoading = false;
    fileView: string;
    _instId: number;
    typeAttachment: IBPMAttachmentType[];

    constructor(private serviceAttachment: BpmAttachmentOfficerService,
                private activeRoute: ActivatedRoute,
                private acttachmentType: BpmAttachmentTypeService) {
        this.formAttachData = {} as any;
    }

    ngOnInit(): void {
        this._instId = this.activeRoute.snapshot.params.instId;
        this.serviceAttachment.gets({ BpmInstanceId: this._instId, publishFlag: 'Y' }).subscribe(_ => {
            this.formAttach = _;
        });
    }


    previewButtonClicked(cellInfo) {
        this.fileView =  environment.config.baseConfig.resourceUrl.replace("/ccib", "/bpm") + cellInfo.row.data.INST_ATTACHMENT_OFFICER_PATH;
        window.open(this.fileView);

    }

    OpenFileDialog(e, uploadTag) {
        e.event.stopPropagation();
        uploadTag.click();
    }


    formatDate(e) {
        // return formatDate(new Date(e.CREATE_DATE), "dateShortTimeThai");
        const date = formatDate(new Date(e.CREATE_DATE), "dateShortTimeThai");
        const date_new = date.split(" ");
        const date_new2 = date_new[0] + " " + date_new[1] + " " + date_new[2];
        return date_new2;
    }

}
