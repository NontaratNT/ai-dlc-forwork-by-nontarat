import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { BpmProcinstService } from 'src/app/services/bpm-procinst.service';

@Component({
    selector: 'app-tasklist-tab',
    templateUrl: './tasklist-tab.component.html',
    styleUrls: ['./tasklist-tab.component.scss']
})
export class TasklistTabComponent implements OnInit {
    _instId: number;
    _isLoading = false;
    checkStatus = false;
    constructor(private bpmProcinstServ: BpmProcinstService, private router: Router, private activeRoute: ActivatedRoute,) { }

    ngOnInit(): void {
        this._isLoading = true;
        this._instId = this.activeRoute.snapshot.params.instId;
        this.bpmProcinstServ.getByInstId(this._instId)
            .pipe(finalize(() => this._isLoading = false)).subscribe(res => {
                if (res.STATUS_CODE !== 'C01') {
                    this.checkStatus = true;
                } else {
                    this.checkStatus = false;
                }
                // console.log(res);
            });
    }

    Back() {
        this.router.navigate(["/main/tasklist"]);
    }
}
