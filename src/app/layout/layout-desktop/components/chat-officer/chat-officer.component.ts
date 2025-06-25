import { Component, OnInit, ViewChild } from '@angular/core';
import { DxMultiViewComponent } from 'devextreme-angular';
import { ChatOfficerDetailComponent } from './chat-officer-detail/chat-officer-detail.component';
import { ChatService } from 'src/app/services/chat.service';
import { User } from 'src/app/services/user';
import { formatDate } from 'devextreme/localization';

@Component({
  selector: 'app-chat-officer',
  templateUrl: './chat-officer.component.html',
  styleUrls: ['./chat-officer.component.scss']
})
export class ChatOfficerComponent implements OnInit {

  @ViewChild(DxMultiViewComponent, { static: true }) multiView: DxMultiViewComponent;
  @ViewChild(ChatOfficerDetailComponent, { static: true }) formNew: ChatOfficerDetailComponent;
  _dataSource: any;
  _isLoading: boolean = false;
  selectedIndex: number = 0;
  constructor(private _chatService: ChatService) { }

  ngOnInit(): void {
    this.formNew.mainForm = this;
    this._isLoading = true;
    this.loadChatList();
  }

  loadChatList(){
    this._chatService.getChatList(User.Current.PersonalId).subscribe((data) => {
      this._dataSource = data || [];
      this._isLoading = false;
    }, (error) => {
      console.error('Error fetching chat list:', error);
      this._isLoading = false;
    });
  }

  view(data) {
    this.formNew.inst_id = data.INST_ID;
    this.formNew.formData = data;
    this.multiView.selectedIndex = 1;
    this.formNew.loadChatData();
  }

  displayFormatDateTime(date: any): string {
    if (!date || date === '0001-01-01T00:00:00') {
      return '';
    }

    try {
      return formatDate(new Date(date), 'dateShortTimeThai');
    } catch (e) {
      console.error('Invalid date:', date);
      return '';
    }
  }

}
