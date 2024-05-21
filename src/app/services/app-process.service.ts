import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppProcessService {

    constructor() { }

    public isNull(params: any): boolean{
        const checkNull = !params || params === null || params === '';
        if(checkNull){
            return true;
        }
        if(Array.isArray(params)){
            if(params.length === 0){
                return true;
            }
        }
        if(typeof params === 'object'){
            let count = 0;
            for(const key in params){
                if(key){
                    count += 1;
                }
            }
            if(count !== 0){
                return true;
            }
        }
        return false;
    }

}
