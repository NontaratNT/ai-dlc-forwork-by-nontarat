import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NewsService } from 'src/app/services/re-design/news/news.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news-cyber',
  templateUrl: './news-cyber.component.html',
  styleUrls: ['./news-cyber.component.scss']
})
export class NewsCyberComponent implements OnInit, AfterViewInit {

  @ViewChild('boxNews') boxNews!: ElementRef;
  @ViewChild('titleNews') titleNews!: ElementRef;
  @ViewChild('buttonNews') buttonNews!: ElementRef;

  isVisible = false;
  paginatedNews: any[] = [];
  formationNews: any[] = [];
  currentPage = 0;
  itemsPerPage = 3;

  constructor(
     private _router: Router,
    private service: NewsService
  ) { }

  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.2 });

    if (this.boxNews && this.boxNews.nativeElement) {
      observer.observe(this.boxNews.nativeElement);
    }

    if (this.titleNews && this.titleNews.nativeElement) {
      observer.observe(this.titleNews.nativeElement);
    }

    if (this.buttonNews && this.buttonNews.nativeElement) {
      observer.observe(this.buttonNews.nativeElement);
    }
  }

  ngOnInit(): void {
    this.service.getNewsTop5().subscribe((res: any) => {
      this.formationNews = res.Value.Data;
      // console.log(this.formationNews); // ตรวจสอบว่าได้รับข้อมูลจาก API หรือไม่
      this.setupPagination(); // เรียก setupPagination() หลังจากได้รับข้อมูล
    });
  }

  setupPagination(): void {
    // ตรวจสอบว่า formationNews มีข้อมูลแล้วหรือไม่ก่อนแบ่งหน้า
    if (this.formationNews && this.formationNews.length > 0) {
      for (let i = 0; i < this.formationNews.length; i += this.itemsPerPage) {
        this.paginatedNews.push(this.formationNews.slice(i, i + this.itemsPerPage));
      }
    }
  }

  nextPage(): void {
    if (this.currentPage < this.paginatedNews.length - 1) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  navigateToPage(pageIndex: number): void {
    if (pageIndex >= 0 && pageIndex < this.paginatedNews.length) {
      this.currentPage = pageIndex;
    }
  }

  RedirectUrl(url) {
    this._router.navigate([url]);
  }

  // formationNews = [
  //   {
  //     category: "ข่าวประชาสัมพันธ์",
  //     title: "ถูกแฮกข้อมูลส่วนตัว ภัยเงียบที่เติบโตในปี 2024",
  //     des: "การโจมตีไซเบอร์ที่ใหญ่ที่สุดในไทยส่งผลให้ข้อมูลผู้ใช้งานกว่า 5 ล้านคนรั่วไหล",
  //     date: "มกราคม 2567",
  //     image: "assets/image/news/news1.png",
  //   },
  //   {
  //     category: "เตือนภัยไซเบอร์",
  //     title: "ระบาดหนักอีเมลหลอกลวงพุ่งสูงสุดในรอบปี",
  //     des: "การแพร่ระบาดของอีเมลปลอมในชื่อธนาคารดัง หลอกขโมยเงินจากบัญชีผู้ใช้ไปกว่า 100 ล้านบาท",
  //     date: "พฤษภาคม 2567",
  //     image: "assets/image/news/check.png",
  //   },
  //   {
  //     category: "กลโกงออนไลน์",
  //     title: "ผู้เสียหายจากกลโกงช้อปปิ้งพุ่งสูงในปี 2024",
  //     des: "เหตุการณ์มิจฉาชีพหลอกขายสินค้าออนไลน์กว่า 50,000 รายการ โดยไม่มีสินค้าส่งจริง",
  //     date: "ตุลาคม 2567",
  //     image: "assets/image/news/news3.png",
  //   },
  //   {
  //     category: "เตือนภัยไซเบอร์",
  //     title: "เตือนภัย! อีเมลปลอมแอบอ้างหน่วยงานรัฐ",
  //     des: "รายงานพบการระบาดของอีเมลปลอมที่แอบอ้างเป็นหน่วยงานรัฐ เพื่อหลอกให้ประชาชนกรอกข้อมูลส่วนตัว เช่น...",
  //     date: "มกราคม 2567",
  //     image: "assets/image/news/news4.png",
  //   },
  //   {
  //     category: "กลโกงออนไลน์",
  //     title: "ระวัง! มิจฉาชีพใช้ QR Code ปลอมดูดเงินในบัญชี",
  //     des: "ธนาคารและหน่วยงานด้านความปลอดภัยเตือนภัยการใช้ QR Code ปลอมที่มิจฉาชีพนำไปติดตามสถานที่ต่างๆ...",
  //     date: "พฤษภาคม 2567",
  //     image: "assets/image/news/news5.png",
  //   },
  //   {
  //     category: "ข่าวประชาสัมพันธ์",
  //     title: "เพิ่มความปลอดภัย! หน่วยงานรัฐแนะประชาชนใช้...",
  //     des: "หน่วยงานความปลอดภัยทางไซเบอร์ได้แนะนำให้ประชาชน ใช้ระบบยืนยันตัวตนแบบสองชั้นในการเข้าถึงบัญชี",
  //     date: "ตุลาคม 2567",
  //     image: "assets/image/news/news6.png",
  //   },
  // ];
}

