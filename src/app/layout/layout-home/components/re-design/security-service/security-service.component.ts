import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-security-service',
  templateUrl: './security-service.component.html',
  styleUrls: ['./security-service.component.scss']
})
export class SecurityServiceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  detailSecurity = [
    {
      id: 1,
      title: 'เช็กก่อน',
      description: 'เว็บไซต์ที่ใช้สำหรับช่วยเหลือ ตรวจสอบและเช็กรายชื่อคนโกง',
      image: 'assets/image/img/security/checkgon.png'
    },
    {
      id: 2,
      title: 'ฉลาดโอน',
      description: 'เช็กก่อนเชื่อบริการช่วยตรวจสอบ บัญชีปลายทางก่อนโอนเงิน',
      image: 'assets/image/img/security/check.png'
    },
    {
      id: 3,
      title: 'ไซเบอร์วัคซีน',
      description: 'ช่วยสร้างภูมิคุ้มกันภัยทางเทคโนโลยี เพื่อเตือนและรู้ทันกลโกง',
      image: 'assets/image/img/security/vacc.png'
    },
    {
      id: 4,
      title: 'Line Chat',
      description: '@police1441 ให้ คำปรึกษาทางด้าคดี',
      image: 'assets/image/img/security/line.png'
    },
    {
      id: 5,
      title: 'Chat Bot',
      description: 'ให้คำปรึกษาความรุนแรง ในครอบครัว',
      image: 'assets/image/img/security/chat.png'
    },
  ]

}
