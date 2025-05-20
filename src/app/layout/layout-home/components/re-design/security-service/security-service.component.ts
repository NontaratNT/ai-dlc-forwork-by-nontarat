import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NewsService } from 'src/app/services/re-design/news/news.service';
import { User } from 'src/app/services/user';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-security-service',
  templateUrl: './security-service.component.html',
  styleUrls: ['./security-service.component.scss']
})
export class SecurityServiceComponent implements OnInit {
  @Input() types: 'main' | 'witget' = 'main';

  detailSecurity: any[] = [];
  isDragging = false;
  startX = 0;
  scrollLeft = 0;

  deviceInfo: any = null;

  @ViewChild('contentSecurity', { static: false }) contentSecurity!: ElementRef;
  scrollProgress: number = 0; // ✅ ค่า Progress ของ Scroll

  constructor(
    private service: NewsService,
    private router: Router,
    private deviceService: DeviceDetectorService,
    private userServ: UserService,
  ) { }

  ngOnInit(): void {
    this.service.getBanner().subscribe((res: any) => {
      this.detailSecurity = res.Value;
    });
  }

  // ✅ คำนวณ Progress Bar
  onScroll(event: any): void {
    const target = event.target;
    const scrollLeft = target.scrollLeft;
    const scrollWidth = target.scrollWidth - target.clientWidth;
    this.scrollProgress = (scrollLeft / scrollWidth) * 100;
  }

  // ✅ เลื่อนซ้าย
  scrollLeftSmoothly(): void {
    this.contentSecurity.nativeElement.scrollBy({
      left: -200, // ปรับค่าความเร็วในการเลื่อน
      behavior: 'smooth'
    });
  }

  // ✅ เลื่อนขวา
  scrollRight(): void {
    this.contentSecurity.nativeElement.scrollBy({
      left: 200, // ปรับค่าความเร็วในการเลื่อน
      behavior: 'smooth'
    });
  }

  // ✅ กดแช่เพื่อเลื่อน
  onMouseDown(event: MouseEvent, direction: 'left' | 'right'): void {
    this.isDragging = true;
    this.startX = event.clientX;
    this.scrollLeft = this.contentSecurity.nativeElement.scrollLeft;

    // ใช้การเคลื่อนไหวของเมาส์
    const moveHandler = (e: MouseEvent) => this.onMouseMove(e, direction);
    const stopHandler = () => {
      this.isDragging = false;
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', stopHandler);
    };

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', stopHandler);
  }

  // ✅ เลื่อนขณะกดแช่
  onMouseMove(event: MouseEvent, direction: 'left' | 'right'): void {
    if (!this.isDragging) return;

    const moveDistance = event.clientX - this.startX;
    if (direction === 'left') {
      // ปรับตำแหน่งการเลื่อนให้มากขึ้นตามระยะทางที่เคลื่อนไหว
      this.contentSecurity.nativeElement.scrollLeft = this.scrollLeft - moveDistance;
    } else if (direction === 'right') {
      // ปรับตำแหน่งการเลื่อนให้มากขึ้นตามระยะทางที่เคลื่อนไหว
      this.contentSecurity.nativeElement.scrollLeft = this.scrollLeft + moveDistance;
    }
  }

  onSwitchService(id: number): void {
    const serviceActions: { [key: number]: () => void } = {
      1: () => window.location.href = 'https://www.checkgon.com/',
      2: () => window.location.href = 'https://www.chaladohn.com/',
      3: () => this.router.navigate(['/login'], { queryParams: { icli: 'al' } }),
      4: () => {
        const downloadLink = document.createElement("a");
        downloadLink.href = 'tel:081-866-3000';
        downloadLink.click();
      },
      5: () => window.location.href = 'https://m.me/mysisbot',
      6: () => this.router.navigate(['/login'], { queryParams: { icli: 'landing' } }),
      7: () => this.LinkCyberEye(),
    };
    // ตรวจสอบว่า id มีอยู่ใน object หรือไม่ ถ้ามีให้เรียกฟังก์ชันนั้น
    serviceActions[id]?.();
  }

  LinkCyberEye() {
          if (!User?.Current) {
              Swal.fire({
                  title: 'Cyber Eye',
                  text: 'คุณต้องการเข้าใช้งาน Cyber Eye หรือไม่?',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'ตกลง',
                  cancelButtonText: 'ยกเลิก',
                  customClass: {
                      confirmButton: 'btn btn-success',
                      cancelButton: 'btn btn-secondary'
                  }
              }).then((result) => {
                  if (result.isConfirmed) {
                          this.router.navigate(['/login'], { queryParams: { icli: 'cyber-eye' } });
                      }
                  } 
              );
          }else{
            if (User.Current.CyberEyeStatus !== "Y") {
              this.userServ.UpdateSeniorFlag(User.Current.UserId,"Cyber").subscribe(() => {
                  this.userServ.UpdateSeniorFlagAzure(User.Current.UserId,"Cyber").subscribe(() => {
                      User.Current.CyberEyeStatus = "Y";
                      this.CheckDeviceMode(2);
                      return;
                  });
              });
            }
            this.CheckDeviceMode(2);
          }
      }


      CheckDeviceMode(type = 1) {
        this.deviceInfo = this.deviceService.getDeviceInfo();
        const isMobile = this.deviceService.isMobile();
        const routes = {
          1: isMobile ? "/mobile/issue-online?openExternalBrowser=1" : "/main/issue-online/1",
          2: isMobile ? "/mobile/issue-online-report" : "/main/issue-online-report"
        };
        
        const targetRoute = routes[type];
        if (targetRoute) {
          this.router.navigate([targetRoute]);
        }
      }
}
