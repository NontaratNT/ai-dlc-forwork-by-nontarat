import { Injectable } from '@angular/core';
import { IBpmProcInst } from 'src/app/services/bpm-procinst.service';

@Injectable({
    providedIn: 'root'
})
export class BpmDataShareService {
    public bpmData = {} as IBpmProcInst;
    public caseWorking = false;
    constructor() { }
    public GetData(){
        return this.bpmData || undefined;
    }
    public GetDataCaseWorking(){
        return this.caseWorking || false;
    }
    public SetData(data: any){
        this.bpmData = data;
        this.caseWorking = (this.bpmData.GROUP_STATUS_CODE === 'C07' || this.bpmData.REJECT_FLAG === 'Y') ? false : true ;
    }
}
