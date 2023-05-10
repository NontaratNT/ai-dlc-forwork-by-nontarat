import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkflowService } from 'eform-share';
import { Dialog } from 'share-ui';
import { BusinessKey } from 'src/app/common/business-key';
import { TaskInfoShareService } from './task-info-share.service';

@Component({
    selector: 'app-tasklist-tab-record',
    templateUrl: './tasklist-tab-record.component.html',
    styleUrls: ['./tasklist-tab-record.component.scss']
})
export class TasklistTabRecordComponent implements OnInit {
    _isInit = false;
    constructor(private router: Router, private activeRoute: ActivatedRoute,
                private _dialog: Dialog, private _workflowServ: WorkflowService,
                private _taskInfoShard: TaskInfoShareService) { }

    ngOnInit(): void {

    }

    Back() {
        this.router.navigate(["/main/tasklist"]);
    }
}
