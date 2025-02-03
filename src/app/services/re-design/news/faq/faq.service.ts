import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FaqService {

  private _baseUrl = environment.config.apieCCib;
  constructor(private http: HttpClient) { }


  getFaqAll(): Observable<any> {
    return this.http.get<any>(`${this._baseUrl}/CCPFaqs`);
  }
}
