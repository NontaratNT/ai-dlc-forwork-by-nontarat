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
}
