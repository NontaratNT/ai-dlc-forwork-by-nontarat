import { Component, OnInit } from "@angular/core";
import { Router,ActivatedRoute} from "@angular/router";
import { NewsService } from "src/app/services/re-design/news/news.service";
@Component({
    selector: "app-detail-news",
    templateUrl: "./detail-news.component.html",
    styleUrls: ["./detail-news.component.scss"],
})
export class DetailNewsComponent implements OnInit {
  newsDetail: any = {};
  isLoading: boolean = true;
  isError: boolean = false;

  constructor(
    private router: Router,
    private newsservice: NewsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // รับค่าพารามิเตอร์ newsId จาก URL
    const newsId = this.route.snapshot.paramMap.get('newsId');

    if (newsId) {
      // แปลง newsId จาก string เป็น number ก่อนเรียกใช้งาน
      const numericNewId = Number(newsId);

      if (!isNaN(numericNewId)) {
        this.loadNewsDetails(numericNewId); // ส่ง newsId ที่เป็นตัวเลขไปยังฟังก์ชัน
      } else {
        this.handleError('Invalid newsId: Not a number');
      }
    } else {
      this.handleError('No newsId found in URL');
    }
  }

  loadNewsDetails(newsId: number): void {
    this.isLoading = true;
    this.isError = false;

    this.newsservice.getNewsById(newsId).subscribe(
      (response) => {
        this.newsDetail = response.Value; // เก็บข้อมูลข่าวที่ได้จาก API
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching news details:', error);
        this.handleError('Error fetching news details');
      }
    );
  }

  handleError(message: string): void {
    this.isError = true;
    this.isLoading = false;
    console.error(message);
  }

  goBack(): void {
    this.router.navigate(['/news']); // นำทางกลับไปยังหน้าหลัก
  }
}



