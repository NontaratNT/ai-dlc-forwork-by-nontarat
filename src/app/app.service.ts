import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    hideHeader = false;
    hideFooter = false;
    constructor() { }
}
