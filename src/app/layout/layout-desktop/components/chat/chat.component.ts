import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { formatDate } from 'devextreme/localization';
import { finalize } from 'rxjs/operators';
import { ChatService, IChat } from 'src/app/services/chat.service';
import { User } from 'src/app/services/user';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { Dialog } from 'share-ui';
import Swal from 'sweetalert2';
import { ConvertDateService } from 'src/app/services/convert-date.service';
import { DxScrollViewComponent } from 'devextreme-angular';
import { BpmDataShareService } from '../issue-online-edit/bpm-data-share.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    // @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild('chatScrollView', { static: false }) chatScrollView: DxScrollViewComponent;

    formData: any = [];
    formChat: IChat;
    _isLoading = false;
    checkUser: boolean;
    disableScrollDown = false;
    _instId: number;
    userId: number;
    userImagePath: string | ArrayBuffer;
    bpmData: any = {};
    caseWorking = false;
    constructor(private serviceChat: ChatService,
                private router: Router,
                private activeRoute: ActivatedRoute,
                private _date: ConvertDateService,
                private shareBpmData: BpmDataShareService) {
        this.formData = [];
        this.formChat = {} as any;
    }

    ngOnInit(): void {
        this.userId = User.Current.PersonalId;
        // this._instId = this.activeRoute.snapshot.params.instId;
        this.bpmData = this.shareBpmData.GetData();
        this._instId = this.bpmData.INST_ID;
        this.caseWorking = this.shareBpmData.GetDataCaseWorking();
        this.SetChat();

    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async SetChat(){
        this._isLoading = true;

        const chatlist = await this.serviceChat.getChat(this._instId).toPromise();
        const setChatList = [];
        let dateLastChat;
        for (const item of chatlist) {
            // dateCheck = this._date.ConvertToDateFormat(item.CREATE_DATE);
            item.CREATE_SDATE = this.ConvertDateToMomentTime(item.CREATE_DATE);
            item.PERSONAL_PICTURE = this.image(item.PERSONAL_PICTURE);
            const dateChat = this._date.ConvertToDateFormat(item.CREATE_DATE);
            if(dateChat !== dateLastChat){
                setChatList.push({dateTimeChat:this._date.ConvertStringShortDate(dateChat)});
                dateLastChat = this._date.ConvertToDateFormat(item.CREATE_DATE);
            }
            setChatList.push(item);

        }
        this.formData = setChatList;
        await this.sleep(500);
        // const hightScroll = this.chatScrollView.instance.scrollHeight() ?? 0;
        // console.log('hightScroll',hightScroll);
        this.chatScrollView.instance.scrollBy(999999);
        this._isLoading = false;

    }
    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    CheckEmptyText(text){
        return (text)?true:false;
    }
    async sendMessage() {

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
            }).subscribe(async () => {
                // this.serviceChat.getChat(this._instId).subscribe( x => {
                //     this.formData = x;
                // });
                await this.SetChat();
                this.formChat.INST_CHAT_MASSAGE = undefined;
            });
            // this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        }

    }

    image(image: string) {
        if(image) {
            return  environment.config.baseConfig.resourceUrl.replace("/ccib", "/bpm") + image;
        } else {
            return "assets/icon/user.png";
        }

    }
    ConvertDateToMomentTime(date) {
        if (date === null) {
            return '00:00 น.';
        }
        return moment(date, "YYYY-MM-DD HH:mm:ss").format('HH:mm')+ " น.";
    }
    DisplayFormatDate(data: string) {
        const dateValue = moment(data[(this as any).dataField]).toDate();
        return formatDate(dateValue, "dateShortTimeThai") + " น.";
    }

    onScroll() {
        // const element = this.myScrollContainer.nativeElement;
        // const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
        // if (this.disableScrollDown && atBottom) {
        //     this.disableScrollDown = false;
        // } else {
        //     this.disableScrollDown = true;
        // }
    }


    scrollToBottom() {
        if (this.disableScrollDown) {
            return;
        }
        try {
            // this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }
    }


}
