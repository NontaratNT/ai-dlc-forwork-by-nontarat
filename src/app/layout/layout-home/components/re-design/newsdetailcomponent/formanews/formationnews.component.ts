import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-formationnews',
  templateUrl: './formationnews.component.html',
  styleUrls: ['./formationnews.component.scss']
})
export class FormaNewsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  activeTab: string = 'all'; // ค่าเริ่มต้นของแท็บที่เลือก

  formationNews = [
    {
        category: "ข่าวประชาสัมพันธ์",
        title: "ถูกแฮกข้อมูลส่วนตัว ภัยเงียบที่เติบโตในปี 2024",
        des: "การโจมตีไซเบอร์ที่ใหญ่ที่สุดในไทยส่งผลให้ข้อมูลผู้ใช้งานกว่า 5 ล้านคนรั่วไหล",
        date: "มกราคม 2567",
        image: "assets/image/news/news1.png",
    },
    {
        category: "เตือนภัยไซเบอร์",
        title: "ระบาดหนักอีเมลหลอกลวงพุ่งสูงสุดในรอบปี",
        des: "การแพร่ระบาดของอีเมลปลอมในชื่อธนาคารดัง หลอกขโมยเงินจากบัญชีผู้ใช้ไปกว่า 100 ล้านบาท",
        date: "พฤษภาคม 2567",
        image: "assets/image/news/news2.png",
    },
    {
        category: "กลโกงออนไลน์",
        title: "ผู้เสียหายจากกลโกงช้อปปิ้งพุ่งสูงในปี 2024",
        des: "เหตุการณ์มิจฉาชีพหลอกขายสินค้าออนไลน์กว่า 50,000 รายการ โดยไม่มีสินค้าส่งจริง",
        date: "ตุลาคม 2567",
        image: "assets/image/news/news3.png",
    },
    {
        category: "เตือนภัยไซเบอร์",
        title: "เตือนภัย! อีเมลปลอมแอบอ้างหน่วยงานรัฐ",
        des: "รายงานพบการระบาดของอีเมลปลอมที่แอบอ้างเป็นหน่วยงานรัฐ เพื่อหลอกให้ประชาชนกรอกข้อมูลส่วนตัว เช่น...",
        date: "มกราคม 2567",
        image: "assets/image/news/news4.png",
    },
    {
        category: "กลโกงออนไลน์",
        title: "ระวัง! มิจฉาชีพใช้ QR Code ปลอมดูดเงินในบัญชี",
        des: "ธนาคารและหน่วยงานด้านความปลอดภัยเตือนภัยการใช้ QR Code ปลอมที่มิจฉาชีพนำไปติดตามสถานที่ต่างๆ...",
        date: "พฤษภาคม 2567",
        image: "assets/image/news/news5.png",
    },
    {
        category: "ข่าวประชาสัมพันธ์",
        title: "เพิ่มความปลอดภัย! หน่วยงานรัฐแนะประชาชนใช้...",
        des: "หน่วยงานความปลอดภัยทางไซเบอร์ได้แนะนำให้ประชาชน ใช้ระบบยืนยันตัวตนแบบสองชั้นในการเข้าถึงบัญชี",
        date: "ตุลาคม 2567",
        image: "assets/image/news/news6.png",
    },
];
  // ฟังก์ชันสำหรับเปลี่ยนแท็บ
  selectTab(tab: string) {
    this.activeTab = tab;
  }

}
