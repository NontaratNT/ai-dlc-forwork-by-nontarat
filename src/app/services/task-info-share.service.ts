import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ProcessInstanceInfo, TaskInfo } from 'eform-share';
import { BusinessKey } from 'src/app/common/business-key';

@Injectable()
export class TaskInfoShare {
    businessKey: BusinessKey;
    task: TaskInfo;
    processInstance: ProcessInstanceInfo;
    formKey: string;
    onDataLoaded: Subject<void>;
    container: ITaskContainer;
    constructor() { }
}

export interface ITaskContainer {
    showCaseView(instId: number, parentInstId: number): void;
    showTaskTabView(): void;
}
