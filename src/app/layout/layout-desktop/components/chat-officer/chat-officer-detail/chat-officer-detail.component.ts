import { Component, OnInit } from '@angular/core';
import { BpmDataShareService } from '../../issue-online-edit/bpm-data-share.service';
import { ChatOfficerComponent } from '../chat-officer.component';
import { loadMessages } from 'devextreme/localization';

@Component({
  selector: 'app-chat-officer-detail',
  templateUrl: './chat-officer-detail.component.html',
  styleUrls: ['./chat-officer-detail.component.scss']
})
export class ChatOfficerDetailComponent implements OnInit {

  public mainForm: ChatOfficerComponent;
  public inst_id: number = 0
  public formData: any;
  loadData: boolean = false;
  constructor(private shareBpmData: BpmDataShareService,) { }

  ngOnInit(): void {
    this.loadChatData();
  }

  public loadChatData(){
    if(this.inst_id != 0 && this.inst_id != null) {
       const data = {
        INST_ID: this.formData?.INST_ID || this.inst_id,
        GROUP_STATUS_CODE: this.formData?.GROUP_STATUS_CODE,
        REJECT_FLAG: this.formData?.REJECT_FLAG,
      }
      this.shareBpmData.SetData(data);
      this.loadData = true;
    }
  }

  goBack() {
    this.loadData = false;
    this.inst_id = 0;
    this.mainForm.multiView.selectedIndex = 0;
    this.mainForm.loadChatList();
  }

}
