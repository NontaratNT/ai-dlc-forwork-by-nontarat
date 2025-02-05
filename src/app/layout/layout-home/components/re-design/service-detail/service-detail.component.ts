import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NewsService } from "src/app/services/re-design/news/news.service";
import { Location } from "@angular/common";
@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {

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
        
        const newsId = this.route.snapshot.paramMap.get("newsId");

        if (newsId) {
            
            const numericNewId = Number(newsId);

            if (!isNaN(numericNewId)) {
                this.loadNewsDetails(numericNewId); 
            } else {
                this.handleError("Invalid newsId: Not a number");
            }
        } else {
            this.handleError("No newsId found in URL");
        }
    }

    loadNewsDetails(newsId: number): void {
        this.isLoading = true;
        this.isError = false;

        this.newsservice.getNewsById(newsId).subscribe(
            (response) => {
                this.newsDetail = response.Value; 
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
            this.location.back();
        }
    }
    

}
