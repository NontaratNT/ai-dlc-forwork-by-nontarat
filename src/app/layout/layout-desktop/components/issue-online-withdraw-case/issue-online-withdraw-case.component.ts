import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxFormComponent } from 'devextreme-angular';
import { BpmProcinstService } from "src/app/services/bpm-procinst.service";
import { PersonalService } from "src/app/services/personal.service";
import { User } from "src/app/services/user";
import Swal from "sweetalert2";
import { BpmDataShareService } from "../issue-online-edit/bpm-data-share.service";

@Component({
  selector: 'app-issue-online-withdraw-case',
  templateUrl: './issue-online-withdraw-case.component.html',
  styleUrls: ['./issue-online-withdraw-case.component.scss']
})
export class IssueOnlineWithdrawCaseComponent implements OnInit {
  @ViewChild('formWithdrawCase', { static: false }) formWithdrawCase: DxFormComponent;

  
  formValidate = true;
  formReadOnly = false;
  reasonWithdraw = [
    {ID:1, TEXT:"ได้รับการชดใช้แล้วจำนวน", UNIT: "บาท"},
    {ID:2, TEXT:"ไม่ประสงค์ดำเนินคดี", UNIT: null},
    {ID:3, TEXT:"อื่น ๆ โปรดระบุ", UNIT: null},
  ];
  _isLoading = false;
  formData: any = {
    CASE_ID: "",
    CITIZEN_CARD_NUMBER: "",
    WITHDRAW_CASE: this.reasonWithdraw[0],
    TOTAL_PRICE: 0,
    OTHER_REMARK_CASE: "",
    REMARK: ""
  };
  bpmData: any = {};
  _instId: number;

  constructor(
    private router: Router,
    private servicePersonal: PersonalService,
    private bpmProcinstServ: BpmProcinstService,
    private shareBpmData: BpmDataShareService
  ) { }

  ngOnInit(): void {
    this._isLoading = true;
    this.bpmData = this.shareBpmData.GetData();
    this.formData.CASE_ID = this.bpmData.INST_ID;
    const userId = User.Current.PersonalId;
    this.servicePersonal
        .GetPersonalById(userId)
        .subscribe((_) => {
          this.formData.CITIZEN_CARD_NUMBER = _.PERSONAL_CITIZEN_NUMBER;
        });
  }


  RadioHandler(e) {
    if (e.value) {
      this.formData.reason_withdraw = e.value;
    }
  }

  OnChangeWithdrawReason(e) {
    if (e.value) {
      this.formData.reason_withdraw = e.value;
    }
  }

  PasteCheckNumber(event) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    const seperator = '^([0-9])';
    const maskSeperator = new RegExp(seperator, 'g');
    const result = maskSeperator.test(pastedText);
    return result;
  }
  CheckNumber(event) {
    // const seperator  = '^[ก-๏\\s]+$';
    const seperator = '^([0-9])';
    const maskSeperator = new RegExp(seperator, 'g');
    const result = maskSeperator.test(event.key);
    return result;
  }

  IdentificationPattern(params) {
    return params.value.length === 13
  }
  NumberValidator(event) {
    let value = event.target.value + event.key
    const makeScope = new RegExp('^[0-9](?=[0-9]{1,10}$)', 'g');
    return makeScope.test(value);
  }
  NumberSanitize(_value) {
    if(_value) {
      return _value.replace(/[^0-9]/g, '');
    }
  }

  
  TextValidator(event) { 
    const makeScope = new RegExp('^[A-Za-zก-๙0-9 ]', 'g');
    const result = makeScope.test(event.key);
    return result
  }
  TextSanitize(_value) {
    return _value.replace(/[^A-Za-zก-๙0-9 ]/g, '');
  }
  PasteCheckText(event) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    const seperator = '^([A-Za-zก-๙0-9 ])';
    const maskSeperator = new RegExp(seperator, 'g');
    const result = maskSeperator.test(pastedText);
    return result;
  }

  WithdrawCaseHandler(data: any) {
    if(data.ID === 1){
      return [`${data.TEXT} ${this.formData.TOTAL_PRICE} ${data.UNIT}`, this.formData.TOTAL_PRICE];
    }else if(data.ID === 3){
      return [this.formData.OTHER_CASE, 0];
    } else {
      return [data.TEXT, 0];
    }
  }


  submitWithdraw() {
    let cateId =  this.formData.CASE_ID;
    let [remark, price] = this.WithdrawCaseHandler(this.formData.WITHDRAW_CASE);
     if(this.formData.CITIZEN_CARD_NUMBER.length !== 13) {
        Swal.fire({
          title: 'ผิดพลาด!',
          text: 'กรุณาระบุหมายประจำตัวประชาชน 13 หลัก',
          icon: 'warning',
          confirmButtonText: 'ตกลง'
        }).then(() => {});
        return;
     }
    if(this.formData.WITHDRAW_CASE.ID === 1 && price <= 0) {
      Swal.fire({
        title: 'ผิดพลาด!',
        text: 'กรุณาระบุจำนวนเงินที่ได้รับการชดใช้',
        icon: 'warning',
        confirmButtonText: 'ตกลง'
      }).then(() => {});
      return;
    } else if(this.formData.WITHDRAW_CASE.ID === 3 && (!remark || remark.length < 3)) {
      Swal.fire({
        title: 'ผิดพลาด!',
        text: 'กรุณาระบุเหตุผลที่ต้องการถอนแจ้งความคดี',
        icon: 'warning',
        confirmButtonText: 'ตกลง'
      }).then(() => {});
      return;
    }

    Swal.fire({
      title: 'ยืนยัน!',
      text: 'ท่านต้องการถอนแจ้งความ ใช่หรือไม่?',
      icon: 'info',
      confirmButtonText: 'ใช่',
      cancelButtonText:'ยกเลิก',
      showConfirmButton: true,
      showCancelButton: true,
    }).then((result) => { 
      if(result.isConfirmed) {

        this.bpmProcinstServ.userWithDrawCase(cateId, {
          cateid: cateId,
          citizencardnumber: this.NumberSanitize(this.formData.CITIZEN_CARD_NUMBER) ,
          remark: this.TextSanitize(remark),
          totalprice: price,
        }).subscribe(_ => {
          console.log(_)
            Swal.fire({
              title: 'สำเร็จ!',
              text: 'ถอนแจ้งความเรียบร้อย',
              icon: 'success',
              confirmButtonText: 'ตกลง'
          }).then(() => {
            this.router.navigate(["/main/task-list"]);
          });
        })
      }
    });
  }
}
