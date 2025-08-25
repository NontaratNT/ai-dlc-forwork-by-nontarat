import { Component, Input, OnInit } from '@angular/core';
import { IssueOnlineContainerComponent } from '../issue-online-container.component';
import { data } from 'jquery';
import Swal from 'sweetalert2';
import { OnlineCaseService } from 'src/app/services/online-case.service';
import { finalize } from 'rxjs/operators';
import { User } from 'src/app/services/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ocpb-online-complain-validate',
  templateUrl: './ocpb-online-complain-validate.component.html',
  styleUrls: ['./ocpb-online-complain-validate.component.scss']
})
export class OcpbOnlineComplainValidateComponent implements OnInit {

  public mainConponent: IssueOnlineContainerComponent;
  isLoading = false;
  @Input() province: any = [];
  dataOCPB: any = {};
  dataTPO: any = {};
  dataDetail: any = {};
  dataDamage: any = {};
  dataInformer: any = {};
  dataToOCPB: any = {};

  constructor(private _onlineCaseServ: OnlineCaseService,private _router: Router,) { }

  ngOnInit(): void {
    this.ReloadData();
  }

  Back(e) {
    this.mainConponent.NextIndex(this.mainConponent.indexTab - 1);
  }

  SubmitForm(e) {
    const payload = {
      ...this.dataTPO,
      OCPB_DATA: this.dataToOCPB
    }
    this.isLoading = true;
    
    // this._onlineCaseServ
    //   .createOfficer(payload)
    //   .pipe(finalize(() => (this.isLoading = false)))
    //   .subscribe((response) => {
    //     if (response.IsSuccess) {
    //       // On success
    //       const successMessage = `
    //           บันทึกข้อมูลสำเร็จ<br/>
    //           เรื่องรับแจ้งเลขที่ ${response.Value}<br/>
    //           (เรื่องจะถูกส่งไปที่ ตร. เพื่อส่งข้อมูลไปยัง สคบ.)
    //           `;
    //       Swal.fire({
    //         title: 'สำเร็จ!',
    //         html: successMessage,
    //         icon: 'success',
    //         confirmButtonText: 'ตกลง',
    //       }).then(() => {
    //         this.handleSuccessNavigation();
    //       });
    //     } else {
    //       // On error
    //       Swal.fire({
    //         title: 'ผิดพลาด!',
    //         text: response.Message,
    //         icon: 'warning',
    //         confirmButtonText: 'ตกลง',
    //       }).then(() => { });
    //     }
    //   });
  }

  private handleSuccessNavigation(): void {
      const itemsToRemove = [
        'ocpb-informer',
        'ocpb-detail',
        'ocpb-damage'
      ];

      itemsToRemove.forEach((item) => {
        localStorage.removeItem(item);
      });

      this._router.navigate(['/officer/task-admin']);
  }

  ReloadData() {
    this.dataDetail = JSON.parse(localStorage.getItem('ocpb-detail'));
    this.dataDamage = JSON.parse(localStorage.getItem('ocpb-damage'));
    this.dataInformer = JSON.parse(localStorage.getItem('ocpb-informer'));
    this.dataOCPB = Object.assign(
      {},
      this.dataDetail,
      this.dataDamage,
      this.dataInformer
    );
    this.dataTPO = this.convertDataToTpo(this.dataOCPB);
    this.dataToOCPB = this.convertDataToOCPB(this.dataOCPB);
    console.log(this.dataTPO);
  }

  convertDataToTpo(data: any): any {
    const {
      ISOVERSEA,
      IDENTITYID,
      TITLE,
      TITLE_ID,
      FNAME,
      MNAME,
      LNAME,
      SEX,
      BIRTHDATE,
      TEL,
      ADDRESS1,
      PROVINCE_CODE,
      PROVINCE,
      AMPHER_CODE,
      AMPHER,
      TUMBON_CODE,
      TUMBON,
      ZIPCODE,
      CARDADDRESS1,
      CARDPROVINCE_CODE,
      CARDPROVINCE,
      CARDAMPHER_CODE,
      CARDAMPHER,
      CARDTUMBON_CODE,
      CARDTUMBON,
      COMPLAINTDETAIL,
      CASE_MONEY,
      COMPANYNAME,
      COMPANYADDRESS,
      COMPANYPROVINCE_CODE,
      COMPANYAMPHUR_CODE,
      COMPANYTUMBON_CODE
    } = data;

    // สร้างตัวแปรสำหรับข้อมูลที่ต้องมีการแปลง
    const isOversea = !!ISOVERSEA;

    let birthdateString = null;
    if (BIRTHDATE) {
      // ตรวจสอบว่า BIRTHDATE เป็น Date Object หรือไม่
      // หรือทำการแปลงจาก String ให้เป็น Date Object
      const dateObject = typeof BIRTHDATE === 'string' ? new Date(BIRTHDATE) : BIRTHDATE;

      // ตรวจสอบความถูกต้องของ Date Object ก่อนเรียกใช้ toISOString()
      if (!isNaN(dateObject.getTime())) {
        birthdateString = dateObject.toISOString().split('T')[0];
      }
    }

    // รวมข้อมูลทั้งหมดในออบเจกต์เดียวเพื่อลดความซ้ำซ้อน
    const convertedData = {
      TYPE_PERSONAL_ID: isOversea ? 1 : 2,
      CASE_INFORMER_CITIZEN_NUMBER: !isOversea ? IDENTITYID : null,
      CASE_INFORMER_PASSPORT_NUMBER: isOversea ? IDENTITYID : null,
      TITLE_NAME: TITLE,
      TITLE_ID: TITLE_ID,
      CASE_INFORMER_FIRSTNAME: FNAME,
      CASE_INFORMER_MIDDLENAME: MNAME,
      CASE_INFORMER_LASTNAME: LNAME,
      INFORMER_GENDER: SEX === 'm' ? 'M' : 'F',
      CASE_INFORMER_DATE: birthdateString,
      INFORMER_TEL: TEL,
      CASE_INFORMER_ADDRESS_NO: ADDRESS1,
      INFORMER_PROVINCE: PROVINCE_CODE,
      INFORMER_PROVINCE_NAME_THA: PROVINCE,
      INFORMER_DISTRICT_ID: AMPHER_CODE,
      INFORMER_DISTRICT_NAME_THA: AMPHER,
      INFORMER_SUB_DISTRICT_ID: TUMBON_CODE,
      INFORMER_SUB_DISTRICT_NAME_THA: TUMBON,
      INFORMER_ZIPCODE: ZIPCODE,
      INFORMER_CARD_ADDRESS_NO: CARDADDRESS1,
      INFORMER_CARD_PROVINCE: CARDPROVINCE_CODE,
      INFORMER_CARD_PROVINCE_NAME_THA: CARDPROVINCE,
      INFORMER_CARD_DISTRICT_ID: CARDAMPHER_CODE,
      INFORMER_CARD_DISTRICT_NAME_THA: CARDAMPHER,
      INFORMER_CARD_SUB_DISTRICT_ID: CARDTUMBON_CODE,
      INFORMER_CARD_SUB_DISTRICT_NAME_THA: CARDTUMBON,
      CASE_BEHAVIOR: COMPLAINTDETAIL,
      CASE_MONEY: CASE_MONEY,
      CASE_CRIMINAL_ALIASNAME: COMPANYNAME,
      CASE_CRIMINAL_ADDRESS_NO: COMPANYADDRESS,
      CASE_CRIMINAL_PROVINCE_ID: COMPANYPROVINCE_CODE,
      CASE_CRIMINAL_DISTRICT_ID: COMPANYAMPHUR_CODE,
      CASE_CRIMINAL_SUB_DISTRICT_ID: COMPANYTUMBON_CODE,
      ORG_LOCATION_ID: 1
    };

    return convertedData;
  }

  convertDataToOCPB(data) {
    data.TITLEDESC =
      data.TITLE !== 'อื่นๆ'
        ? data.TITLE
        : data.TITLEDESC;
    let birthdateString = null;
    if (data.BIRTHDATE) {
      // ตรวจสอบว่า BIRTHDATE เป็น Date Object หรือไม่
      // หรือทำการแปลงจาก String ให้เป็น Date Object
      const dateObject = typeof data.BIRTHDATE === 'string' ? new Date(data.BIRTHDATE) : data.BIRTHDATE;

      // ตรวจสอบความถูกต้องของ Date Object ก่อนเรียกใช้ toISOString()
      if (!isNaN(dateObject.getTime())) {
        birthdateString = dateObject.toISOString().split('T')[0];
      }
    }
    const payload = {
      complaintDetail: data.COMPLAINTDETAIL ?? '',
      companyName: data.COMPANYNAME ?? '',
      companyDetail: data.COMPANYDETAIL ?? '',
      companyLatitude: '',
      companyLongitude: '',
      companyAddress: data.COMPANYADDRESS ?? '',
      companyTumbonCode: data.COMPANYTUMBON_CODE ?? '',
      companyTumbon: data.COMPANYTUMBON ?? '',
      companyAmpherCode: data.COMPANYAMPHUR_CODE ?? '',
      companyAmpher: data.COMPANYAMPHUR ?? '',
      companyProvinceCode: data.COMPANYPROVINCE_CODE ?? '',
      companyProvince: data.COMPANYPROVINCE ?? '',
      companyZipcode: data.COMPANYZIPCODE ?? '',
      companyMapAddress: '',
      personal: {
        identityId: data.IDENTITYID ?? '',
        titleDesc: data.TITLEDESC ?? '',
        fName: data.FNAME ?? '',
        mName: data.MNAME ?? '',
        lName: data.LNAME ?? '',
        sex: data.SEX ?? '',
        birthDate: birthdateString ?? '',
        isOversea: data.ISOVERSEA ?? '',
        email: data.EMAIL ?? '',
        tel: data.TEL ?? '',
        address1: data.ADDRESS1 ?? '',
        tumbonCode: data.TUMBON_CODE ?? '',
        tumbon: data.TUMBON ?? '',
        ampherCode: data.AMPHER_CODE,
        ampher: data.AMPHER ?? '',
        provinceCode: data.PROVINCE_CODE ?? '',
        province: data.PROVINCE ?? '',
        zipcode: data.ZIPCODE ?? '',
        cardAddress1: data.CARDADDRESS1 ?? '',
        cardTumbonCode: data.CARDTUMBON_CODE ?? '',
        cardTumbon: data.CARDTUMBON ?? '',
        cardAmpherCode: data.CARDAMPHER_CODE ?? '',
        cardAmpher: data.CARDAMPHER ?? '',
        cardProvinceCode: data.CARDPROVINCE_CODE ?? '',
        cardProvince: data.CARDPROVINCE ?? '',
        cardZipcode: data.CARDZIPCODE ?? '',
        contactList: [],
        birthDateStr: '',
      },
      companyContacts: [],
      paymentMethod: '',
      placePurchase: '',
      purpose: '',
      fileAttachList: [],
      complaintCode: '',
      departmentToID: null,
      provinceCode: null,
      case_no: data.case_no ?? '',
      case_id: data.case_id ?? 0,
    };
    return payload;
  }
}
