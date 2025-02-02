import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsService } from 'src/app/services/re-design/news/news.service';

@Component({
  selector: 'app-security-service',
  templateUrl: './security-service.component.html',
  styleUrls: ['./security-service.component.scss']
})
export class SecurityServiceComponent implements OnInit {

  isDragging = false;
  startX = 0;
  scrollLeft = 0;

  detailSecurity: any[] = [];

  constructor(
    private el: ElementRef,
    private service: NewsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const container = this.el.nativeElement.querySelector('.boxSecurity');
    if (container) {
      container.addEventListener('mousedown', this.onMouseDown.bind(this));
      container.addEventListener('mousemove', this.onMouseMove.bind(this));
      container.addEventListener('mouseup', this.onMouseUp.bind(this));
      container.addEventListener('mouseleave', this.onMouseUp.bind(this));
      container.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
      container.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: true });
      container.addEventListener('touchend', this.onTouchEnd.bind(this));
    }

    this.service.getBanner().subscribe((res: any) => {
      console.log(res.Value);
      this.detailSecurity = res.Value;
      console.log(this.detailSecurity);
      
    });
  }

  onMouseDown(event: MouseEvent): void {
    this.startDragging(event.pageX);
  }

  onMouseMove(event: MouseEvent): void {
    this.drag(event.pageX);
  }

  onMouseUp(): void {
    this.stopDragging();
  }

  onTouchStart(event: TouchEvent): void {
    this.startDragging(event.touches[0].pageX);
  }

  onTouchMove(event: TouchEvent): void {
    this.drag(event.touches[0].pageX);
  }

  onTouchEnd(): void {
    this.stopDragging();
  }

  private startDragging(positionX: number): void {
    const container = this.el.nativeElement.querySelector('.boxSecurity');
    if (!container) return;
    this.isDragging = true;
    this.startX = positionX - container.offsetLeft;
    this.scrollLeft = container.scrollLeft;
    container.classList.add('active');
  }

  private drag(positionX: number): void {
    if (!this.isDragging) return;
    const container = this.el.nativeElement.querySelector('.boxSecurity');
    if (!container) return;
    const walk = (positionX - this.startX) * 1.5;
    container.scrollLeft = this.scrollLeft - walk;
  }

  private stopDragging(): void {
    const container = this.el.nativeElement.querySelector('.boxSecurity');
    if (!container) return;
    this.isDragging = false;
    container.classList.remove('active');
  }

  onSwitchService(id: number): void {
    switch (id) {
      case 1:
        window.location.href = 'https://www.checkgon.com/';
        break;
      case 2:
        window.location.href = 'https://www.chaladohn.com/';
        break;

      case 3:
        this.router.navigate(['/login'], { queryParams: { icli: 'al' } });
        break;
        
      case 4:
        const downloadLink = document.createElement("a");
        downloadLink.href = 'tel:081-866-3000';
        downloadLink.click();
        break;
        
      case 5:
        window.location.href = 'https://m.me/mysisbot';
        break;
      default:
        break;
    }
  }

  // detailSecurity = [
  //   { id: 1, title: 'เช็กก่อน', description: 'เว็บไซต์ที่ใช้สำหรับช่วยเหลือ ตรวจสอบและเช็กรายชื่อคนโกง', image: 'assets/image/img/security/checkgon.png' },
  //   { id: 2, title: 'ฉลาดโอน', description: 'เช็กก่อนเชื่อบริการช่วยตรวจสอบ บัญชีปลายทางก่อนโอนเงิน', image: 'assets/image/img/security/check.png' },
  //   { id: 3, title: 'ไซเบอร์วัคซีน', description: 'ช่วยสร้างภูมิคุ้มกันภัยทางเทคโนโลยี เพื่อเตือนและรู้ทันกลโกง', image: 'assets/image/img/security/vacc.png' },
  //   { id: 4, title: 'Line Chat', description: '@police1441 ให้คำปรึกษาทางด้าคดี', image: 'assets/image/img/security/line.png' },
  //   { id: 5, title: 'Chat Bot', description: 'ให้คำปรึกษาความรุนแรง ในครอบครัว', image: 'assets/image/img/security/chat.png' },
  // ];
}