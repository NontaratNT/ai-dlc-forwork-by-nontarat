import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IssueOnlineService {

  private _issueOnline: BehaviorSubject<any> = new BehaviorSubject<any>({});

  set issueOnline(value: any)
  {
    console.log(value);
    this._issueOnline.next(value);
  }

  get issueOnline$(): Observable<any>
  {
    return this._issueOnline.asObservable();
  }

  constructor() { }
}
