import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxMultiViewComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { INotification, NotificationService } from 'src/app/services/notification.service';
import { User } from 'src/app/services/user';
import { NotifyDataComponent } from '../notify-data/notify-data.component';
import { formatDate } from 'devextreme/localization';
import { ApplicationNotificationService } from 'src/app/services/application-notification.service';

@Component({
    selector: 'app-notification-list',
    templateUrl: './notification-list.component.html',
    styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
    @ViewChild(DxMultiViewComponent, { static: true }) multiView: DxMultiViewComponent;
    @ViewChild(NotifyDataComponent, { static: true }) form: NotifyDataComponent;
    notification: DataSource;
    formNotification: INotification;
    constructor(private notificationService: NotificationService,
                private router: Router,
                private _appNotification: ApplicationNotificationService) {
        this.formNotification = {} as any;
    }

    ngOnInit(): void {
        this.form.mainForm = this;
        this.notification = new DataSource({
            load: () => this.notificationService.gets({personalId: User.Current.PersonalId} , 0 , 1000).toPromise()
                .then(_ => {
                    if (!_) {
                        _ = [];
                    }
                    return { data: _ };
                })
        });
    }

    displayFormatDate(rowData) {
        return formatDate(new Date(rowData), "dateShortTimeThai");
    }



    view(e) {
        this.formNotification = Object.assign({}, e.data);
        this.form.load();
        this.notificationService.read(this.formNotification.NOTIFICATION_TO_ID).subscribe(() => {
            this._appNotification.notificationCountChange.next();
        });
        this.multiView.selectedIndex = 1;

    }

}
