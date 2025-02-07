import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class NewsService {
    private _baseUrl = environment.config.apieCCib;
    // private _baseUrl = "https://officeruat.thaipoliceonline.go.th/api/ccib/v1.0"
    constructor(private http: HttpClient) {}

    getNewsAll(): Observable<any> {
        return this.http.get(
            `${this._baseUrl}/CCPNews/Newslist?page=1&pagesize=10`
        );
    }

    getNewsType(): Observable<any> {
        return this.http.get(`${this._baseUrl}/CCPNews/NewsType`);
    }

    getNewsByType(id: any): Observable<any> {
        return this.http.get(
            `${this._baseUrl}/CCPNews/Newslistbycategory/${id}?page=1&pagesize=10`
        );
    }

    getNewsTop5(): Observable<any> {
        return this.http.get(`${this._baseUrl}/CCPNews/Newslisttop5`);
    }

    getBanner(): Observable<any> {
        return this.http.get(
            `${this._baseUrl}/CCPSecurityServices/SecurityServiceslist`
        );
    }

    getBankList(): Observable<any> {
        return this.http.get(
            `${this._baseUrl}/CCPContactBanks/ContactBanklist`
        );
    }

    getCyber(): Observable<any> {
        return this.http.get(
            `${this._baseUrl}/CCPCyberCrimePrevention/Preventionslist`
        );
    }

    getApplication(): Observable<any> {
        return this.http.get(
            `${this._baseUrl}/CCPApplications/Applicationlist`
        );
    }

    getStatic(): Observable<any> {
        return this.http.get(`${this._baseUrl}/CCPCaseStat`);
    }

    getNewsById(newsId: number): Observable<any> {
        const url = `${this._baseUrl}/CCPNews/${newsId}`;
        return this.http.get<any>(url);
    }
}
