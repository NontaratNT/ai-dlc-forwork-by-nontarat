import { Component, ElementRef, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-protect-cyber',
  templateUrl: './protect-cyber.component.html',
  styleUrls: ['./protect-cyber.component.scss']
})
export class ProtectCyberComponent implements OnInit {

  // @HostListener('wheel', ['$event'])
  // onScroll(event: WheelEvent): void {
  //   const container = document.querySelector('.scroll-container') as HTMLElement;
  //   if (container) {
  //     container.scrollLeft += event.deltaY; // เลื่อนแนวนอนเมื่อเลื่อนเมาส์
  //     event.preventDefault(); // ป้องกันการเลื่อนแนวตั้ง
  //   }
  // }

  isDragging = false; // ตรวจสอบว่ากำลังลากอยู่หรือไม่
  startX = 0; // ตำแหน่งเริ่มต้นของการลาก (X-axis)
  scrollLeft = 0; // ตำแหน่ง scroll ดั้งเดิม

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    const container = this.el.nativeElement.querySelector('.scroll-container');
    if (container) {
      // เพิ่ม event listener สำหรับการลาก
      container.addEventListener('mousedown', this.onMouseDown.bind(this));
      container.addEventListener('mousemove', this.onMouseMove.bind(this));
      container.addEventListener('mouseup', this.onMouseUp.bind(this));
      container.addEventListener('mouseleave', this.onMouseUp.bind(this)); // หยุดลากเมื่อเมาส์ออกจากคอนเทนเนอร์
    }
  }

  // เริ่มการลาก
  onMouseDown(event: MouseEvent): void {
    const container = this.el.nativeElement.querySelector('.scroll-container');
    this.isDragging = true;
    this.startX = event.pageX - container.offsetLeft; // คำนวณตำแหน่ง X เริ่มต้น
    this.scrollLeft = container.scrollLeft; // เก็บตำแหน่ง scroll ปัจจุบัน
    container.classList.add('active'); // เพิ่มคลาสเพื่อแสดงไอคอนลาก
  }

  // การลากระหว่างที่กดค้าง
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) {
      return;
    }
    event.preventDefault(); // ป้องกันการทำงานเริ่มต้น
    const container = this.el.nativeElement.querySelector('.scroll-container');
    const x = event.pageX - container.offsetLeft;
    const walk = (x - this.startX) * 4; // คำนวณระยะการลาก

    // ใช้ requestAnimationFrame เพื่อให้การเลื่อนสมูทมากขึ้น
    requestAnimationFrame(() => {
      container.scrollTo({
        left: this.scrollLeft - walk,
        behavior: 'smooth'
      });
    });
  }

  // หยุดการลาก
  onMouseUp(): void {
    const container = this.el.nativeElement.querySelector('.scroll-container');
    this.isDragging = false;
    container.classList.remove('active'); // ลบคลาสเมื่อหยุดลาก
  }

  slides = [
    {
      id: 1,
      images: 'assets/image/img/protect-cyber.png'
    },
    // เพิ่ม slide อื่น ๆ ได้ที่นี่
  ];

  protectedCyber = [
    {
      id: 1,
      title: 'เช็กก่อน',
      description: 'เว็บไซต์ที่ใช้สำหรับช่วยเหลือตรวจสอบและเช็กรายชื่อมิจฉาชีพหรือคนโกง',
      image: 'assets/image/img/protact-bg/bg-1.png'
    },
    {
      id: 2,
      title: 'ฉลาดโอน',
      description: 'มีสติก่อนโอน ฉลาดโอนบริการช่วยตรวจสอบบัญชี ปลายทางก่อนโอนเงิน เพื่อไม่ให้ตกเป็นเหยื่อ',
      image: 'assets/image/img/protact-bg/bg-2.png'
    },
    {
      id: 3,
      title: 'สายด่วน 1441',
      description: 'เพื่ออายัดบัญชี ขอความช่วยเหลือ และขอคำปรึกษา แจ้งความออนไลน์ได้ตลอด 24 ชั่วโมง',
      image: 'assets/image/img/protact-bg/bg-3.png'
    },
    {
      id: 4,
      title: 'Cyber Check',
      description: 'แอปพลิเคชันปกป้องข้อมูลและเตือนภัยให้ประชาชน ปลอดภัยจากอาชญากรไซเบอร์',
      image: 'assets/image/img/protact-bg/bg-4.png'
    },
    {
      id: 5,
      title: 'แจ้งความออนไลน์',
      description: 'กรณีตกเป็นเหยื่อเกี่ยวกับการหลอกลวงทางออนไลน์ ทางโทรศัพท์ อาชญากรไซเบอร์',
      image: 'assets/image/img/protact-bg/bg-5.png'
    },
    {
      id: 6,
      title: 'แจ้งอายัดบัญชี',
      description: 'รีบติดต่อธนาคารที่มีบัญชีอยู่ แจ้งอายัดบัญชีธนาคาร ปลายทางให้เร็วที่สุด เพื่อลดมูลค่าความเสียหาย',
      image: 'assets/image/img/protact-bg/bg-6.png'
    },
  ]
}
