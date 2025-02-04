import { Component, OnInit } from '@angular/core';
import { NewsService } from 'src/app/services/re-design/news/news.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-news-box',
  templateUrl: './news-box.component.html',
  styleUrls: ['./news-box.component.scss']
})
export class NewsBoxComponent implements OnInit {

detailSecurity: any[] = [];
    constructor(private newsserrvice: NewsService, private router: Router) {}

    ngOnInit(): void {
      this.newsserrvice.getBanner().subscribe((res: any) => {
        console.log(res.Value);
        this.detailSecurity = res.Value;
        console.log(this.detailSecurity);
      });
    }
}
