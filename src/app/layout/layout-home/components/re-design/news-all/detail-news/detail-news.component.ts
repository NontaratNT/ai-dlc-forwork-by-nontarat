import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ServicesecService } from "src/app/services/re-design/news/securityservice/servicesec.service";
@Component({
    selector: "app-detail-news",
    templateUrl: "./detail-news.component.html",
    styleUrls: ["./detail-news.component.scss"],
})
export class DetailNewsComponent implements OnInit {

    seclist: any[] = [];
    constructor(private router: Router,
        private servicesec : ServicesecService,
    ) {}

    ngOnInit(): void {

        this.servicesec.getSecAll().subscribe((res:any)=>{
            this.seclist = res.Value.Data;
            console.log(res);
        });
    }

    goBack() {
        this.router.navigate(["/news"]);
    }
}
