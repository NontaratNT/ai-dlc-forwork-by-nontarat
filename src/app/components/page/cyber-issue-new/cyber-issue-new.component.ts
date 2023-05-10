import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BpmMdmFlowService } from "src/app/services/bpm-mdm-flow.service";
import { BpmProcinstService } from "src/app/services/bpm-procinst.service";
import { GroupStatusService } from "src/app/services/group-status.service";

@Component({
    selector: "app-cyber-issue-new",
    templateUrl: "./cyber-issue-new.component.html",
    styleUrls: ["./cyber-issue-new.component.scss"],
})
export class CyberIssueNewComponent implements OnInit {
    loadPageSuccess = false;
    isLoading = true;
    countFlow = 0;
    constructor(
        private _router: Router,
        private _flowServ: BpmMdmFlowService,
        private _groupStatusServ: GroupStatusService,
        private _bpmProcinstServ: BpmProcinstService
    ) {}

    ngOnInit(): void {
        this.getCountFlow();
    }
    goUrl(url = 'main/tasklist'){
        this._router.navigate([url]);
    }
    getCountFlow() {
        this._flowServ.gets().subscribe((_s) => {
            this._groupStatusServ.get().subscribe((res) => {
                // eslint-disable-next-line @typescript-eslint/prefer-for-of
                for (let index = 0; index < res.length; index++) {
                    const element = res[index];
                    this._bpmProcinstServ
                        .getByFlowCode(element.GROUP_STATUS_CODE, _s[0].FLOW_CODE)
                        .subscribe((_) => {
                            if (_ !== null) {
                                for (const y of _) {
                                    if (y) {
                                        this.countFlow++;
                                    }
                                    if(index === (res.length-1)) {
                                        this.isLoading = false;
                                        this.loadPageSuccess = true;
                                    }
                                }
                            }
                        });

                }
            });
        });
    }
}
