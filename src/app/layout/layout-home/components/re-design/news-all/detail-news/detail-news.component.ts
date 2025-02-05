import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NewsService } from "src/app/services/re-design/news/news.service";
import { Location } from "@angular/common";
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
        private route: ActivatedRoute,
        private location: Location
    ) {}

    ngOnInit(): void {
        // สังเกตการเปลี่ยนแปลงพารามิเตอร์ newsId
        this.route.params.subscribe((params) => {
            const newsId = params['newsId'];
            if (newsId) {
                const numericNewsId = Number(newsId);

                if (!isNaN(numericNewsId)) {
                    this.loadNewsDetails(numericNewsId); // โหลดเนื้อหาใหม่ตาม newsId
                } else {
                    this.handleError("Invalid newsId: Not a number");
                }
            } else {
                this.handleError("No newsId found in URL");
            }
        });
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
                console.error("Error fetching news details:", error);
                this.handleError("Error fetching news details");
            }
        );
    }

    handleError(message: string): void {
        this.isError = true;
        this.isLoading = false;
        console.error(message);
    }

    goBack(): void {
        const previousUrl = this.router
            .getCurrentNavigation()
            ?.previousNavigation?.finalUrl?.toString();

        if (previousUrl === "/news") {
            this.router.navigate(["/news"]);
        } else if (previousUrl === "/") {
            this.router.navigate(["/"]);
        } else {
            this.location.back(); // ใช้ Location service เพื่อนำทางกลับ
        }
    }
}

