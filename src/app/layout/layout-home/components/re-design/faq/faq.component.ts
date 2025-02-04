import { Component, OnInit } from "@angular/core";
import { NewsService } from "src/app/services/re-design/news/news.service";
import { FaqService } from "src/app/services/re-design/news/faq/faq.service";
import { Router } from "@angular/router";
@Component({
    selector: "app-faq",
    templateUrl: "./faq.component.html",
    styleUrls: ["./faq.component.scss"],
})
export class FaqComponent implements OnInit {
    appInfo: Record<string, { AppDescription: string; Apps: any[] }> = {};
    faq: any[] = [];
    constructor(private service: NewsService, private faqService: FaqService, private router:Router) {}

    ngOnInit(): void {
        this.service.getApplication().subscribe((res: any) => {
            this.groupByAppName(res.Value);
        });

        this.faqService.getFaqAll().subscribe((res: any) => {
            if (res && res.IsSuccess && res.Value) {
                this.faq = res.Value.map((item: any) => ({
                    FAQ_ID: item.FAQ_ID,
                    FAQ_QUESTION: item.FAQ_QUESTION,
                    FAQ_ANSWER: item.FAQ_ANSWER,
                }));
            } else {
                console.error("Error fetching FAQs:", res);
            }
        });
    }

    groupByAppName(data) {
        this.appInfo = data.reduce((acc, app) => {
            if (!acc[app.AppName]) {
                acc[app.AppName] = {
                    AppDescription: app.AppDescription,
                    Apps: [],
                };
            }
            acc[app.AppName].Apps.push({
                AppId: app.AppId,
                AppType: app.AppType,
                AppImage: app.AppImage,
                AppLink: app.AppLink,
                ImageUrl: app.ImageUrl,
            });
            return acc;
        }, {});
    }

    trackByGroup(index: number, group: any): string {
        return group.key; // or any unique identifier for the group
    }

    trackByApp(index: number, app: any): string {
        return app.AppType; // or any unique identifier for the app
    }

    openApp(appName: string): void {
        window.open(appName, "_blank");
    }


    navigateToFaq(faqId: number): void {
        this.router.navigate(['/qa'], { queryParams: { id: faqId } });
    }
    
}
