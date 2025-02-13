import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { NewsService } from 'src/app/services/re-design/news/news.service';

@Component({
  selector: 'app-protect-cyber',
  templateUrl: './protect-cyber.component.html',
  styleUrls: ['./protect-cyber.component.scss']
})
export class ProtectCyberComponent implements OnInit {

  isDragging = false; // ตรวจสอบว่ากำลังกดหรือไม่
  startX = 0; // ตำแหน่งเริ่มต้นของการลาก
  scrollLeft = 0; // ตำแหน่ง scroll ดั้งเดิม
  protectedCyber: any[] = [];
  scrollProgress: number = 0; // ค่าความก้าวหน้าของการเลื่อน

  constructor(
    private el: ElementRef,
    private service: NewsService
  ) { }

  ngOnInit(): void {
    const container = this.el.nativeElement.querySelector('.scrollContainer');
    if (container) {
      // รองรับการลากด้วยเมาส์
      container.addEventListener('mousedown', this.onMouseDown.bind(this));
      container.addEventListener('mousemove', this.onMouseMove.bind(this));
      container.addEventListener('mouseup', this.onMouseUp.bind(this));
      container.addEventListener('mouseleave', this.onMouseUp.bind(this));

      // รองรับการสัมผัสในโทรศัพท์
      container.addEventListener('touchstart', this.onTouchStart.bind(this));
      container.addEventListener('touchmove', this.onTouchMove.bind(this));
      container.addEventListener('touchend', this.onTouchEnd.bind(this));

      // ฟังก์ชันคำนวณการเลื่อน
      container.addEventListener('scroll', this.onScroll.bind(this));
    }

    this.service.getCyber().subscribe((res: any) => {
      this.protectedCyber = res.Value;
    });
  }

  // ฟังก์ชันสำหรับการคำนวณการเลื่อนและอัปเดต progress bar
  onScroll(): void {
    const container = this.el.nativeElement.querySelector('.scrollContainer');
    const scrollWidth = container.scrollWidth - container.clientWidth; // ความยาวทั้งหมดที่สามารถเลื่อน
    const scrollLeft = container.scrollLeft; // ตำแหน่งที่เลื่อน
    this.scrollProgress = (scrollLeft / scrollWidth) * 100; // คำนวณเปอร์เซ็นต์
  }

  // ฟังก์ชันสำหรับเมาส์
  onMouseDown(event: MouseEvent): void {
    this.startDragging(event.pageX);
  }

  onMouseMove(event: MouseEvent): void {
    this.drag(event.pageX);
  }

  onMouseUp(): void {
    this.stopDragging();
  }

  // ฟังก์ชันสำหรับสัมผัส
  onTouchStart(event: TouchEvent): void {
    this.startDragging(event.touches[0].pageX);
  }

  onTouchMove(event: TouchEvent): void {
    this.drag(event.touches[0].pageX);
  }

  onTouchEnd(): void {
    this.stopDragging();
  }

  onClick(id: any): void {
    switch (id) {
      case 1:
        window.location.href = 'https://www.checkgon.com/';
        break;
      case 3:
        window.location.href = 'https://www.chaladohn.com/';
        break;
      default:
        break;
    }
  }


  // เริ่มการลาก
  private startDragging(positionX: number): void {
    const container = this.el.nativeElement.querySelector('.scrollContainer');
    this.isDragging = true;
    this.startX = positionX - container.offsetLeft;
    this.scrollLeft = container.scrollLeft;
    container.classList.add('active');
  }

  // ระหว่างการลาก
  private drag(positionX: number): void {
    if (!this.isDragging) {
      return;
    }
    const container = this.el.nativeElement.querySelector('.scrollContainer');
    const walk = (positionX - this.startX) * 4;
    container.scrollLeft = this.scrollLeft - walk;
  }

  // หยุดการลาก
  private stopDragging(): void {
    const container = this.el.nativeElement.querySelector('.scrollContainer');
    this.isDragging = false;
    container.classList.remove('active');
  }

  slides = [
    {
      id: 1,
      images: 'assets/image/img/protect-cyber.png'
    },
    // เพิ่ม slide อื่น ๆ ได้ที่นี่
  ];
}
