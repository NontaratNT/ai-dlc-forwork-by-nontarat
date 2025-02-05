import { Component, OnInit } from "@angular/core";
import { NewsService } from "src/app/services/re-design/news/news.service";
import { Router } from "@angular/router";
@Component({
    selector: "app-news-box",
    templateUrl: "./news-box.component.html",
    styleUrls: ["./news-box.component.scss"],
})
export class NewsBoxComponent implements OnInit {
    topnews: any[] = [];
    constructor(private newsserrvice: NewsService, private router: Router) {}

    ngOnInit(): void {
        this.newsserrvice.getNewsTop5().subscribe((res: any) => {
            if (res && res.Value && Array.isArray(res.Value.Data)) {
                this.topnews = res.Value.Data; // ใช้ Data เป็น Array
            } else {
                console.error("Invalid response format:", res);
                this.topnews = []; // กรณีข้อมูลผิดพลาด
            }
        });
    }

    navigateToDetail(newsId: number | null | undefined): void {
        if (!newsId) {
            console.error('Invalid newsId:', newsId);
            return;
        }
    
        this.router.navigate([`news/detail/${newsId}`]).catch((error) => {
            console.error('Navigation error:', error);
        });
    }
}
