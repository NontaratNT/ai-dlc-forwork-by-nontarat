/* eslint-disable max-len */
import { formatDate } from 'devextreme/localization';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from 'src/app/services/news.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-new-detail',
    templateUrl: './news-detail.component.html',
    styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit {
    _isLoading = false;
    new_id: number;
    detailNew = {} as any;
    news: any;
    data = [];
    dataNews = [];
    hrefcurrent: string;
    userImagePath: string | ArrayBuffer;

    constructor(private router: Router,
                private News: NewsService,
                private activeRoute: ActivatedRoute,
                private _domSanutuzer: DomSanitizer) {
    }

    ngOnInit(): void {
        this._isLoading = true;
        this.new_id = +this.activeRoute.snapshot.paramMap.get("id");
        this.News.GetNewInfo().subscribe(x => {
            for (const i of x) {
                if (this.new_id === i.ANNOUNCEMENT_ID) {
                    this.detailNew = i;
                    this.userImagePath = environment.config.baseConfig.resourceUrl + i.ANNOUNCEMENT_IMAGE;
                }
            }
            this._isLoading = false;
            document.querySelectorAll('o-embed[url]').forEach(element => {
                const anchor = document.createElement('a');

                anchor.setAttribute('href', element.getAttribute('url'));
                anchor.className = 'embedly-card';

                element.appendChild(anchor);
            });
        });
        this.News.GetNewInfo().subscribe(x => {
            this.news = x;
            this.news.reverse();
            this.data = [];
            let n = 0;
            for (const i of this.news) {
                if (n < 6) {
                    this.data.push(this.news[n]);
                    n++;
                }
            }
            this.dataNews = this.data.reverse();
            this._isLoading = false;
        });
        this.hrefcurrent = window.location.href;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
    sanitize(data: string) {
        // console.log('objectData',data);
        if (data) {
            const str = data.replace(new RegExp('</o-embed>', 'g'), '</iframe>');
            const newstr = str.replace(new RegExp('<o-embed', 'g'), '<iframe width="560" height="315" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen');
            const value = newstr.replace(new RegExp('url=', 'g'), 'src=');
            return this._domSanutuzer.bypassSecurityTrustHtml(value);
        }else{
            return "";
        }
    }
    Read(e) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['news/detail/' + e.ANNOUNCEMENT_ID]);
        });
    }
    FormatDate(date) {
        return formatDate(moment(date).toDate(), "dateThai");
    }
    NewsImage(image: string) {
        return environment.config.baseConfig.resourceUrl + image;
    }
    backnews(): void {
        this.router.navigate(['news/']);
    }

}
