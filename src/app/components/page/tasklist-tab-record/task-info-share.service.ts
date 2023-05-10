import { Injectable } from '@angular/core';
import { ProcessInstanceInfo, TaskInfo } from 'eform-share';
import { BusinessKey } from 'src/app/common/business-key';

@Injectable({
    providedIn: 'root'
})
export class TaskInfoShareService {
    businessKey: BusinessKey;
    task: TaskInfo;
    processInstance: ProcessInstanceInfo;
    constructor() { }

}
