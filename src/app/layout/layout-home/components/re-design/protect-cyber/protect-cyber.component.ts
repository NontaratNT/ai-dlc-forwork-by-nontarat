import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { NewsService } from 'src/app/services/re-design/news/news.service';

@Component({
  selector: 'app-protect-cyber',
  templateUrl: './protect-cyber.component.html',
  styleUrls: ['./protect-cyber.component.scss']
})
export class ProtectCyberComponent implements OnInit {

  // @HostListener('wheel', ['$event'])
  // onScroll(event: WheelEvent): void {
  //   const container = document.querySelector('.scrollContainer') as HTMLElement;
  //   if (container) {
  //     container.scrollLeft += event.deltaY; // เลื่อนแนวนอนเมื่อเลื่อนเมาส์
  //     event.preventDefault(); // ป้องกันการเลื่อนแนวตั้ง
  //   }
  // }

  isDragging = false; // ตรวจสอบว่ากำลังลากหรือสัมผัสอยู่หรือไม่
  startX = 0; // ตำแหน่งเริ่มต้นของการลาก/สัมผัส (X-axis)
  scrollLeft = 0; // ตำแหน่ง scroll ดั้งเดิม
  protectedCyber: any[] = [];
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
    }

    this.service.getCyber().subscribe((res: any) => {
      this.protectedCyber = res.Value;
    });
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

  // เริ่มการลากหรือสัมผัส
  private startDragging(positionX: number): void {
    const container = this.el.nativeElement.querySelector('.scrollContainer');
    this.isDragging = true;
    this.startX = positionX - container.offsetLeft; // คำนวณตำแหน่ง X เริ่มต้น
    this.scrollLeft = container.scrollLeft; // เก็บตำแหน่ง scroll ปัจจุบัน
    container.classList.add('active'); // เพิ่มคลาสเพื่อแสดงไอคอนลาก
  }

  // ระหว่างการลากหรือสัมผัส
  private drag(positionX: number): void {
    if (!this.isDragging) {
      return;
    }
    const container = this.el.nativeElement.querySelector('.scrollContainer');
    const walk = (positionX - this.startX) * 4; // คำนวณระยะการเลื่อน
    container.scrollLeft = this.scrollLeft - walk; // ปรับตำแหน่ง scroll
  }

  // หยุดการลากหรือสัมผัส
  private stopDragging(): void {
    const container = this.el.nativeElement.querySelector('.scrollContainer');
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
}
