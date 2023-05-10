import { Component, OnInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { formatDate } from 'devextreme/localization';
import { IBPMAttachmentType } from 'src/app/common/@type/bpm-attachment';
import { BpmAttachmentTypeService } from 'src/app/services/bpm-attachment-type.service';
import { BpmOutputDocService } from 'src/app/services/bpm-output-doc.service';
import { User } from 'src/app/services/user';
import { environment } from 'src/environments/environment';
import { Dialog, FileSizePipe } from 'share-ui';

@Component({
    selector: 'app-output-doc',
    templateUrl: './output-doc.component.html',
    styleUrls: ['./output-doc.component.scss']
})
export class OutputDocComponent implements OnInit {
    _isLoading = false;
    typeAttachment: IBPMAttachmentType[];
    formDoc: DataSource;
    check = false;
    myCityzen = '';
    userData = User.Current.FullNameTH;
    cityzenNumber = User.Current.CitizenNumber;
    userImagePath: string | ArrayBuffer;
    fileView: string;
    constructor(private bpmOutputDocServ: BpmOutputDocService,private acttachmentType: BpmAttachmentTypeService) { }

    ngOnInit(): void {
        if (User.Current) {
            this.userImagePath = environment.config.baseConfig.resourceUrl + User.Current.ImageUrl;
            this.check = true;
        } else {
            this.check = false;
        }
        const str = this.cityzenNumber;
        if(str){
            this.myCityzen = "x-xxxx-xxxx"+str.substring(10,9)+"-"+str.substring(10,12)+"-"+str.substring(12);
        }
        else
        {
            this.myCityzen = "";
        }
        this.formDoc = new DataSource({
            load: () => this.bpmOutputDocServ.get().toPromise()
                .then(_ => {
                    if (!_) {
                        _ = null;
                    }
                    return { data: _ };
                })
        });
        this.acttachmentType.get().subscribe( _ => {
            this.typeAttachment = _;
        });
    }

    previewButtonClicked(cellInfo) {
        this.fileView = environment.config.baseConfig.resourceUrl + cellInfo.row.data.OUTPUT_DOC_PATH;
        window.open(this.fileView);

    }
    formatDate(e) {
        return formatDate(new Date(e.CREATE_DATE), "dateShortTimeThai");
    }
    setDefaultPic() {
        this.userImagePath = "assets/icon/user.png";
    }
}
