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
    seclist: any[] = [];
    isLoading: boolean = true;

    constructor(
        private router: Router,
        private newsservice: NewsService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        const newid = this.route.snapshot.paramMap.get('newid');

        if (newid) {
          this.loadNewsDetails(newid);
        } else {
          console.error('No newid found in URL');
        }
    }

    goBack() {
        this.router.navigate(["/news"]);
    }

    loadNewsDetails(newid: any): void {
        this.newsservice.getNewsById(newid).subscribe(
          (response) => {
            this.newsDetail = response.Value; 
          },
          (error) => {
            console.error('Error fetching news details:', error);
          }
        );
      }
      

}

