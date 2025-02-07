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

  navigateToDetail(newsId: number): void {
    this._router.navigate([`news/detail/${newsId}`]);
  }

}

