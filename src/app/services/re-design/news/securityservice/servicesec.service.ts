import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicesecService {

  private _baseUrl = environment.config.apieCCib;
  constructor(private http: HttpClient) { }

  getSecAll():Observable<any>{
    return this.http.get(`${this._baseUrl}/CCPSecurityServices/SecurityServiceslist`)
  }
}
