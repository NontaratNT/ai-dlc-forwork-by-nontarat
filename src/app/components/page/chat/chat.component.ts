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

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    formData: IChat[];
    formChat: IChat;
    _isLoading = false;
    checkUser: boolean;
    disableScrollDown = false;
    _instId: number;
    userId: number;
    userImagePath: string | ArrayBuffer;
    constructor(private serviceChat: ChatService,
                private _taskInfoShard: TaskInfoShareService,
                private router: Router,
                private activeRoute: ActivatedRoute,
                private dialog: Dialog) {
        this.formData = [];
        this.formChat = {} as any;
    }

    ngOnInit(): void {
        this.userId = User.Current.PersonalId;
        this._instId = this.activeRoute.snapshot.params.instId;
        this.serviceChat.getChat(this._instId).subscribe( x => {
            this.formData = x;
        });
        this.scrollToBottom();

    }

    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngAfterViewChecked() {
        this.scrollToBottom();
    }


    sendMessage() {

        if (!this.formChat.INST_CHAT_MASSAGE) {
            // this.dialog.error("ผิดพลาด", "กรุณากรอกข้อมูลให้ครบถ้วน");
            Swal.fire({
                title: 'ผิดพลาด!',
                text: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => { });
            return;
        }else {
            this._isLoading = true;
            this.formChat.INST_ID = this._instId;
            this.serviceChat.postChatPerson({
                INST_ID : this.formChat.INST_ID,
                INST_CHAT_MASSAGE : this.formChat.INST_CHAT_MASSAGE
            })
                .pipe(finalize(() => this._isLoading = false)).subscribe(_ => {
                    this.serviceChat.getChat(this._instId).subscribe( x => {
                        this.formData = x;
                    });
                    this.formChat.INST_CHAT_MASSAGE = undefined;
                });
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        }

    }

    image(image: string) {
        if(image) {
            return  environment.config.baseConfig.resourceUrl.replace("/ccib", "/bpm") + image;
        } else {
            return "assets/icon/user.png";
        }

    }

    DisplayFormatDate(data: string) {
        const dateValue = moment(data[(this as any).dataField]).toDate();
        return formatDate(dateValue, "dateShortTimeThai") + " น.";
    }

    onScroll() {
        const element = this.myScrollContainer.nativeElement;
        const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
        if (this.disableScrollDown && atBottom) {
            this.disableScrollDown = false;
        } else {
            this.disableScrollDown = true;
        }
    }


    scrollToBottom() {
        if (this.disableScrollDown) {
            return;
        }
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }
    }


}
