import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { PersonalService } from "src/app/services/personal.service";
import { User } from "src/app/services/user";
import { environment } from "src/environments/environment";
import Swal from 'sweetalert2';
import { LoginService } from "src/app/services/login.service";
import { formatDate } from 'devextreme/localization';

import { INotification, NotificationFilter, NotificationService } from 'src/app/services/notification.service';
import { ApplicationNotificationService } from 'src/app/services/application-notification.service';
import { NotifierService } from 'angular-notifier';
import { NotificationHubService } from 'src/app/services/hubs/notification-hub.service';
import { Subscription } from "rxjs-compat";
import DataSource from "devextreme/data/data_source";
import * as moment from "moment";

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"],
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        "(window:click)": "CloseBoxMsg($event)"
    }
})
export class NavbarComponent implements OnInit, OnDestroy {
    @ViewChild('customNotification') customNotificationTmpl;
    @Input() isDrawerOpen = true;
    isLoading = false;
    userImagePath: string | ArrayBuffer;
    check = false;
    collapse = false;
    userData = "";

    countNoti: number;
    notifyData: DataSource;
    notifier: NotifierService;
    notificatFirstClass = "Menu_NOtification_Wrap_First";
    notificatFirstShow: boolean;
    $notificationReady: Subscription;
    $notificationCountChange: Subscription;

    notifyIdSelector = 0;
    notifyClassOpen = false;
    notifyClass = "close";
    // textList = [1,2,3,4,5,6,7,8,9,10];
    constructor(
        private servicePersonal: PersonalService,
        private router: Router,
        private _loginServ: LoginService,
        private _notifactionSerice: NotificationService,
        private _notifierService: NotifierService,
        private _appNotification: ApplicationNotificationService,
        private _nhs: NotificationHubService,
    ) {
        this.notifier = _notifierService;
    }

    ngOnInit(): void {
        // ปิดแจ้งเตือนไปก่อน
        // this._nhs.start();
        this.userImagePath = "assets/icon/user.png";

        this.SetDefaultValue();
    }
    ngOnDestroy(): void {
        this._nhs.stop();
        this._appNotification.clear();
        this.$notificationCountChange?.unsubscribe();
        this.$notificationReady?.unsubscribe();
    }
    async SetDefaultValue() {
        // try{
            this.countNoti = 0;
            if (User.Current) {
                // this.LoadNotify();
                const userInfo = await this.servicePersonal.GetPersonalById(User.Current.PersonalId).toPromise();
                this.userData = User.Current.FullNameTH;
                this.userImagePath = environment.config.baseConfig.resourceUrlAzure + "/bpm/" +
                userInfo.USER_PICTURE + "?" + Date.now().toString();

                //ปิด แจ้งเตือนไว้ก่อน ถ้าเปิด เลือกที่ comment ทั้งหมดแล้วเปิด
                // // this.notifyData = await this._notifactionSerice
                // //     .gets({ personalId: User.Current.PersonalId, unRead: true }, 0, 10).toPromise();
                // this.countNoti = await this._notifactionSerice.getUnReadCount(User.Current.PersonalId).toPromise();
                // this.$notificationReady = this._appNotification.notificationReady.subscribe(_ => {
                //     this.showNotification(_);
                //     this._appNotification.notificationCountChange.next();
                // });

                // this.$notificationCountChange = this._appNotification.notificationCountChange.subscribe(async () => {
                //     // this.notifyData = await this._notifactionSerice
                //     //     .gets({ personalId: User.Current.PersonalId, unRead: true }, 0, 10).toPromise();
                //     this.countNoti = await this._notifactionSerice
                //         .getUnReadCount(User.Current.PersonalId).toPromise();
                //     this.LoadNotify();
                //     // this._notifactionSerice.gets({ personalId: User.Current.PersonalId, unRead: true }, 0, 10).subscribe(notiData => {
                //     //     this.notifyData = notiData;
                //     // });
                // });
            }
        // }catch (error){
        //     this.SetDefaultValue();
        // }
    }
    LoadNotify(){
        this.notifyData = new DataSource({
            pageSize: 10,
            byKey: (_) => undefined,
            load: (opt) => {
                let filtersearch = "";
                if (opt.filter){
                    filtersearch = opt.filter.filterValue;
                }
                const param: NotificationFilter = {
                    personalId: User.Current.PersonalId,
                    filtersearch,
                    unRead: true
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
    // ShowCountNitify(num){
    //     // console.log('num',num);
    //     if (num) {
    //         return (num > 100) ? '99+':`${num}`;
    //     }
    //     return '0';
    // }
    onProfile() {
        this.router.navigate(["main/personal"]);
    }
    setDefaultPic() {
        this.userImagePath = "assets/icon/user.png";
    }
    NavbarSize(){
        return this.isDrawerOpen?"size-full":"size-mini";
    }
    logout() {
        Swal.fire({
            title: 'คุณต้องการออกจากระบบ หรือไม่?',
            text: " ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2778c4',
            cancelButtonColor: '#ce312c',
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'ตกลง'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'สำเร็จ!',
                    text: 'คุณได้ออกจากระบบเรียบร้อย',
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                }).then(() => {
                    this._loginServ.logout();
                });

            }
        });
    }
    // แจ้งเตือน Start
    testNoti(){
        this._nhs.sendTestNotification().then(
            (success)=>{
                // console.log('success',success);
            },(error)=>{
                // console.log('error',error);
            }
        );
    }
    showNotification(detail: string) {
        const notyfyId = ++this.notifyIdSelector;
        this.notifier.show({
            id: `notyfy_${notyfyId}`,
            message: detail,
            type: 'info',
            template: this.customNotificationTmpl
        });
        // console.log('detail',detail);

    }
    closeNotification(notyfyId) {
        this.notifier.hide(notyfyId);
    }
    displayFormatDate(rowData) {
        return formatDate(new Date(rowData), "dateShortTimeThai") + ' น.';
    }
    OpenBoxMsg(e){
        e.stopPropagation();
        this.notifyClassOpen = true;
        this.notifyClass = "open";
    }
    CloseBoxMsg(e){

        this.notifyClassOpen = false;
        this.notifyClass = "close";

    }
    ViewNotifyAll(){
        this.router.navigate(['/main/task-notification']);
    }
    // async ViewWorkDetailList(index, data){
    //     this.isLoading = true;
    //     if (data.INST_ID){
    //         // this.router.navigate([`/main/issue-online-view/${instId}#task-chat`]);
    //         // location.href = `/main/issue-online-view/${instId}#task-chat`;
    //         // location.href = `/main/issue-online-view/${instId}#task-chat`;
    //         await this._notifactionSerice.read(data.NOTIFICATION_TO_ID).toPromise();
    //         // this.notifyData = await this._notifactionSerice
    //         //     .gets({ personalId: User.Current.PersonalId, unRead: true }, 0, 10).toPromise();
    //         this.countNoti = await this._notifactionSerice
    //             .getUnReadCount(User.Current.PersonalId).toPromise();
    //         this.router.navigate([`/main/issue-online-view/${data.INST_ID}`], { fragment: "task-chat" });


    //     }
    //     this.notifyClassOpen = false;
    //     this.notifyClass = "close";
    //     this.isLoading = false;

    // }
    async ViewWorkDetailList(e){
        const data = e.itemData;
        this.isLoading = true;
        this.notifyClassOpen = false;
        this.notifyClass = "close";
        if (data.INST_ID){
            // this.LoadNotify();
            // location.href = `/main/issue-online-view/${data.INST_ID}#task-chat`;
            await this._notifactionSerice.read(data.NOTIFICATION_TO_ID).toPromise();
            this.router.navigate([`/main/issue-online-view/${data.INST_ID}`], { fragment: "task-chat" }).then(()=> location.reload() );
            // const oldUrl = `${this.router.url}`;
            // const newUrl = `/main/issue-online-view/${data.INST_ID}#task-chat`;
            // if(oldUrl === newUrl){
            //     location.reload();
            // }else{
            //     this.countNoti = await this._notifactionSerice
            //         .getUnReadCount(User.Current.PersonalId).toPromise();
            //     this.LoadNotify();
            //     this.router.navigate([`/main/issue-online-view/${data.INST_ID}`], { fragment: "task-chat" });

            // }

            // console.log('oldUrl',oldUrl);
            // console.log('newUrl',newUrl);
            // console.log('===',oldUrl === newUrl);
        }

        // this.isLoading = false;

    }

    // แจ้งเตือน End
}
