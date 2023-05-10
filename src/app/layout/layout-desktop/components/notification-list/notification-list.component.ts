import { Component, OnInit } from '@angular/core';
import { NotificationService, NotificationFilter } from 'src/app/services/notification.service';
import { User } from 'src/app/services/user';
import { formatDate } from 'devextreme/localization';
import { Router } from '@angular/router';
import DataSource from 'devextreme/data/data_source';

@Component({
    selector: 'app-notification-list',
    templateUrl: './notification-list.component.html',
    styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
    isLoading = false;
    notifyData: DataSource;
    constructor(
        private _router: Router,
        private _notifactionSerice: NotificationService,
    ) { }

    ngOnInit(): void {
        const user = User.Current;
        // this._notifactionSerice.gets({ personalId: user.PersonalId }, 0, 999).subscribe(_ =>{
        //     this.notifyData = [];
        //     if (_){
        //         for (const item of _) {
        //             item.NOTIFICATION_DATE_STR = this.displayFormatDate(item.NOTIFICATION_DATE);
        //         }
        //         this.notifyData = _ ;
        //     }

        // });
        this.notifyData = new DataSource({
            pageSize: 10,
            byKey: (_) => undefined,
            load: (opt) => {
                let filtersearch = "";
                if (opt.filter){
                    filtersearch = opt.filter.filterValue;
                }
                const param: NotificationFilter = {
                    personalId: user.PersonalId,
                    filtersearch,
                    unRead: false
                };
                return this._notifactionSerice.getsPaging(param , opt.skip, opt.take)
                    .toPromise()
                    .then(_ => {
                        if (!_.Data) {
                            _.Data = [];
                        }else{
                            for (const item of _.Data) {
                                item.NOTIFICATION_DATE_STR = this.displayFormatDate(item.NOTIFICATION_DATE);
                            }
                        }

                        return { data: _.Data, totalCount: _.TotalCount };
                    });
            }

        });

    }
    displayFormatDate(rowData) {
        return formatDate(new Date(rowData), "dateShortTimeThai") + ' น.';
    }
    async ViewWorkDetailList(data){
        this.isLoading = true;
        if (data.INST_ID){
            await this._notifactionSerice.read(data.NOTIFICATION_TO_ID).toPromise();
            this._router.navigate([`/main/issue-online-view/${data.INST_ID}`], { fragment: "task-chat" });

        }
        this.isLoading = false;

    }
}
