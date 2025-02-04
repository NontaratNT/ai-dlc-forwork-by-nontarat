import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NewsService } from "src/app/services/re-design/news/news.service";

@Component({
    selector: "app-security-box",
    templateUrl: "./security-box.component.html",
    styleUrls: ["./security-box.component.scss"],
})
export class SecurityBoxComponent implements OnInit {
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
