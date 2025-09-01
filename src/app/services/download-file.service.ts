import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { EFORM_REQUEST, EformRequestFactory } from 'eform-share';

@Injectable({
    providedIn: 'root'
})
export class DownloadFileService {

    constructor(private http: HttpClient,@Inject(EFORM_REQUEST) private _req: EformRequestFactory) { }
    downloadFile(url: string): Observable<Blob> {
        return this.http.get(url, { responseType: 'blob' });
    }

    public checkImageFile(file: File) {
        const fileSplited = file?.type?.split('/')
        if (fileSplited[0] === "image") {
            if (fileSplited[1] === 'png' || fileSplited[1] === 'jpg' || fileSplited[1] === 'jpeg') {
                return { isPass: true, message: "Pass" }
            }
        }
        return { isPass: false, message: "กรุณาอัปโหลดไฟล์รูปภาพที่มีนามสกุล png หรือ jpg" }
    }

    public downloadFileAzure(url) {
        return this._req<any>(`BpmProcInstAttachment/download-image-base64?filePath=bpm/${url}`).disableCriticalDialogError().get();
    }

    public downloadFileAzureNew(url) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.get(
            `https://api.thaipoliceonline.go.th/eformazure/api/BpmProcInstAttachmentOfficer/downloadfile?filePath=bpm/${url}`,
            { headers: headers, responseType: 'blob' });
    }
}
