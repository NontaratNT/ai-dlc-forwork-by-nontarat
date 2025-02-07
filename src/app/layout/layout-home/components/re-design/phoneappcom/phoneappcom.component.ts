import { Component, OnInit,Input } from '@angular/core';
import { NewsService } from "src/app/services/re-design/news/news.service";
@Component({
  selector: 'app-phoneappcom',
  templateUrl: './phoneappcom.component.html',
  styleUrls: ['./phoneappcom.component.scss']
})
export class PhoneappcomComponent implements OnInit {
    @Input() bgColor: string = 'white';
  appInfo: Record<string, { AppDescription: string; Apps: any[] }> = {};
  constructor(private service: NewsService,) { }

  ngOnInit(): void {
    this.service.getApplication().subscribe((res: any) => {
      this.groupByAppName(res.Value);
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

}
