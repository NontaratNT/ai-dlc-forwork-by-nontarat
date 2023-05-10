import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { log } from 'console';
import { Key } from 'protractor';
import { INewInfo, NewsService } from 'src/app/services/news.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
    news: any;
    myNews: INewInfo;
    img: any;
    paginate?: [];
    config: number;
    _isLoading = false;
    userImagePath: string | ArrayBuffer;

    constructor(private router: Router, private newsService: NewsService) {
        this.myNews = {} as any;
    }

    ngOnInit(): void {
        this.Loadnews();
    }
    Loadnews() {
        this._isLoading = true;
        this.newsService.GetNewInfo().subscribe(x => {
            this.news = x;
            this.userImagePath = environment.config.baseConfig.resourceUrl;
            this._isLoading = false;
        });
    }
    Read(e) {
        this.router.navigate(['/news/detail/' + e.ANNOUNCEMENT_ID]);
        document.body.scrollTop = document.documentElement.scrollTop = 0;

    }
    NewsImage(image: string) {
        return environment.config.baseConfig.resourceUrl + image;
    }
    pageChanged(event) {
        this.config = event;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

}
