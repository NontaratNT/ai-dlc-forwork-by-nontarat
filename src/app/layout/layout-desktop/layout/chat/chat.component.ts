import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DxMultiViewComponent } from 'devextreme-angular';
import { ChatService } from 'src/app/services/chat.service';
import { User } from 'src/app/services/user';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { ConvertDateService } from 'src/app/services/convert-date.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatBoxComponent implements AfterViewChecked {
  @ViewChild('textarea') textMessageEl: ElementRef;
  @ViewChild('chatboxContentWrapper', { static: false }) chatboxContentWrapper: ElementRef;
  @ViewChild('multiView') multiView: DxMultiViewComponent;
  selectedIndex = 0;


  numCount = 0;
  chatName = "ติดต่อเจ้าหน้าที่";
  chatStatusName = "online";
  isChatOpen = false;
  messages: { content: string, type: 'sent' | 'received', time: string, preview: string | null ,date: string | null}[] = [];
  imagePreview: any;
  _dataSource: any = [];
  _isLoading = false;
  _isGetMessage = false;
  inst_id: number;
  displaymessage: any =[];

  quickMessages = [
    {message: "ค้นหาชื่อ", messageType: "sent"},
    {message: "ติดต่อเจ้าพนักงานสืบสวน", messageType: "sent"},
    {message: "แจ้งความด่วน", messageType: "sent"}
  ]
  constructor(private _chatService: ChatService,
    private _date: ConvertDateService,
    private router: Router,) {

  }
  ngOnInit() {
    this._chatService.getCountAllUnread(User.Current.PersonalId).subscribe((data) => {
        this.numCount = data  || 0;
    });
  }

  ngAfterViewChecked() {
    // this.scrollToBottom();
  }

  toggleChat(e, _action = undefined) {
    
    if(_action) {
      this.isChatOpen = _action;
    } else {
      this.isChatOpen = !this.isChatOpen;
    }
    if (this.isChatOpen) {
      this.loadChat();
    } else {
      this._dataSource = [];
    }
  }

  loadChat(){
    this._isLoading = true;
    this._chatService.getChatList(User.Current.PersonalId).subscribe((data) => {
      this._dataSource = data || [];
      this._isLoading = false;
    }, (error) => {
      console.error('Error fetching chat list:', error);
      this._isLoading = false;
    });
  }

  addZero(num: number): string {
    return num < 10 ? '0' + num : '' + num;
  }

  sendDisplayMessage(value: string, _messageType, _preview = null,date: string = null) {
    if (this.isValid(value)) {
      const today = new Date();
      const formattedTime = this.ConvertDateToMomentTime(date);
      this.messages.push({
        content: value,
        type: _messageType,
        preview: _preview,
        time: formattedTime === '00:00 น.' 
        ? `${this.addZero(today.getHours())}:${this.addZero(today.getMinutes())}` 
        : formattedTime,
      date: this._date.ConvertToDateFormat(date) || this._date.ConvertToDateFormat(today),
      });
    }
  }

  ConvertDateToMomentTime(date) {
      if (date === null) {
          return '00:00 น.';
      }
      return moment(date, "YYYY-MM-DD HH:mm:ss").format('HH:mm')+ " น.";
  }


  convertToBase64(payload: any): Promise<string> {
    const file = payload;
    return new Promise((resolve, reject) => {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64Result = e.target.result.split(',')[1];
          resolve(base64Result);
        };

        reader.onerror = (error) => {
          reject(error);
        };

        reader.readAsDataURL(file);
      } else {
        reject('No file selected');
      }
    });
  }
  async FormatData(data){
    this._isLoading = true;
    this.inst_id = data.INST_ID;
    setTimeout(() => {
      this._chatService.getChat(data.INST_ID).subscribe(res => {
        this._isGetMessage = data.REJECT_FLAG === "Y" || data.GROUP_STATUS_CODE == "C07"  ? false : true;
        this.selectedIndex = 1;
        this._chatService.getCountReadChat(data.INST_ID).subscribe(_ => {});
        res.forEach((element) => {
          this.sendDisplayMessage(
            element.INST_CHAT_MASSAGE, 
            element.SENDER_ID === User.Current.PersonalId ? "sent" : "received",
            null,
            element.CREATE_DATE);
        });
        const setChatList = [];
        let dateLastChat;
        for (const item of this.messages) {
            const dateChat = this._date.ConvertToDateFormat(item.date);
            console.log(dateChat);
            console.log(dateLastChat);
            if(dateChat !== dateLastChat){
                setChatList.push({dateTimeChat:this._date.ConvertStringShortDate(dateChat),type: "date"});
                dateLastChat = item.date
            }
            setChatList.push(item);
        }
        this.displaymessage = setChatList;
        this._isLoading = false;
      });
    }, 500)
    setTimeout(() => {
      this.scrollToBottom();
    }, 600)
  }

  scrollToBottom() {
    const element = this.chatboxContentWrapper.nativeElement;
    this.chatboxContentWrapper.nativeElement.scrollTo(0, element.scrollHeight);
  }

  isValid(value: string = ""): boolean {
    const text = value?.replace(/\n/g, '')?.replace(/\s/g, '');
    return text.length > 0;
  }


  submitMessage(form: NgForm){
    const _form = form.value;
    if(this.isValid(_form.message)) {
      this._isLoading = true;
      const message = {
        INST_ID: this.inst_id,
        INST_CHAT_MASSAGE: _form.message
      };
      this._chatService.postChatPerson(message).subscribe(async () => {
          this.FormatData({INST_ID: this.inst_id});
      });

      try{
          this._chatService.postChatPersongdcc(message).subscribe();
          this._chatService.getCountAllUnread(User.Current.PersonalId).subscribe((data) => {
            this.numCount = data  || 0;
        });
        }
        catch (error)  {

        }
      form.reset();
    }
  }

  openNewCase(link) {
    this.isChatOpen = false;
    this.router.navigate([link]);
  }

  backToList() {
    this._isGetMessage = false;
    this.selectedIndex = 0;
    this.messages = [];
  }

}
