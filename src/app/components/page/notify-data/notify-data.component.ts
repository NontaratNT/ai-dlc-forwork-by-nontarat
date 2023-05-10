import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxMultiViewComponent } from 'devextreme-angular';
import { INotification, NotificationService } from 'src/app/services/notification.service';
import { NotificationListComponent } from '../notification-list/notification-list.component';

@Component({
    selector: 'app-notify-data',
    templateUrl: './notify-data.component.html',
    styleUrls: ['./notify-data.component.scss']
})
export class NotifyDataComponent implements OnInit {

    @ViewChild(DxMultiViewComponent, { static: true }) multiView: DxMultiViewComponent;
    public notifyData: INotification;
    instId: number;
    public mainForm: NotificationListComponent;
    constructor(private _activeRoute: ActivatedRoute,
                private _notifyDataService: NotificationService,
                private _router: Router) {
    }

    ngOnInit(): void {
        const notifyId = this._activeRoute.snapshot.paramMap.get("id");
        this.loadformNav(+notifyId);
    }

    loadformNav(e: number){
        if (e) {
            this._notifyDataService.getฺById(e).subscribe(_ => {
                this.notifyData = _;
            });
        }
    }

    load(){
        this.notifyData = Object.assign({}, this.mainForm.formNotification);
    }


    view(){
        this.multiView.selectedIndex = 1;
        this.instId = this.notifyData.INST_ID;
    }
    back(){
        this.multiView.selectedIndex = 0;
        this.instId = undefined;
    }

    Backtofistpage(){
        if(!this.mainForm) {
            this._router.navigate(['main/notification-list']);
        }else {
            this.mainForm.multiView.selectedIndex = 0;
        }

    }


}
