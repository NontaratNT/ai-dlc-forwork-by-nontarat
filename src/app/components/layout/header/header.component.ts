import { User } from 'src/app/services/user';
import { PersonalService } from 'src/app/services/personal.service';
import { Component, OnInit, Output, Input, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { INotification, NotificationService } from 'src/app/services/notification.service';
import { formatDate, formatMessage, loadMessages, locale } from 'devextreme/localization';
import { ApplicationNotificationService } from 'src/app/services/application-notification.service';
import { NotifierService } from 'angular-notifier';
import { LoginService } from 'src/app/services/login.service';
import { Subscription } from 'rxjs';
import { Dialogue } from 'src/app/services/dialogue';
import * as enLanguage from "src/assets/dictionary/en.json";
import * as thLanguage from "src/assets/dictionary/th.json";
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { GlobalVariables } from 'src/app/common/global-variables';



@Component({
    selector: 'app-header-sub',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
    @ViewChild('customNotification') customNotificationTmpl;
    @Output() menuOpened = new EventEmitter<boolean>();
    @Output() languageMode = new EventEmitter<string>();
    @Input() menuSlideOpen;
    check = false;
    userData = {} as any;
    emailData = {} as any;
    location: Location;
    countNoti: number;
    mobile_menu_visible: any = 0;
    userImagePath: string | ArrayBuffer;
    collapse = false;
    notifyData: INotification[];
    notifier: NotifierService;
    currentLangMode = "TH";
    langMode = "";
    notificatFirstClass = "Menu_NOtification_Wrap_First";
    notificatFirstShow: boolean;
    $notificationReady: Subscription;
    $notificationCountChange: Subscription;
    checktranslate: boolean;
    itemTran: any = [{ id: 1, text: 'TH' }, { id: 2, text: 'EN' }];
    formatMessage = formatMessage;
    constructor(location: Location, private servicePersonal: PersonalService, private router: Router,
                private _notifactionSerice: NotificationService,
                private _appNotification: ApplicationNotificationService,
                private _loginServ: LoginService,
                private translateService: TranslateService,
                private globalVal: GlobalVariables,
    ) {
        this.location = location;
        // this.notifier = _notifierService;
        loadMessages(enLanguage); // English
        loadMessages(thLanguage); // Thai
    }

    ngOnInit() {
        this.langMode = this.globalVal.getLangMode();
        // Set Language by DevExtreme
        locale(this.langMode);
        // ตรวจสอบและตั้งค่า เพื่อแสดงสถานะภาษาที่เลือกตามปัจจุบัน
        this.currentLangMode = this.langMode === "en" ? "EN" : "TH";
        if(this.langMode === "en") {
            this.checktranslate = false;
        } else {
            this.checktranslate = true;
        }

        if (User.Current) {
            this.servicePersonal.GetPersonalById(User.Current.PersonalId).subscribe(_ => {
                this.userImagePath = environment.config.baseConfig.resourceUrl.replace("/ccib", "/bpm") +
                    _.USER_PICTURE + "?" + Date.now().toString();
            });
            this._notifactionSerice.gets({ personalId: User.Current.PersonalId, unRead: true }, 0, 9).subscribe(_ => {
                this.notifyData = _;
            });

            this._notifactionSerice.getUnReadCount(User.Current.PersonalId).subscribe(count => {
                this.countNoti = count;
            });

            this.userData = User.Current.FullNameTH;
            this.emailData = User.Current.UserName;
            this.check = true;

            this.$notificationReady = this._appNotification.notificationReady.subscribe(_ => {
                this.showNotification(_);
                this._appNotification.notificationCountChange.next();
            });

            this.$notificationCountChange = this._appNotification.notificationCountChange.subscribe(() => {
                this._notifactionSerice.getUnReadCount(User.Current.PersonalId).subscribe(count => {
                    this.countNoti = count;
                });
                this._notifactionSerice.gets({ personalId: User.Current.PersonalId, unRead: true }, 0, 9).subscribe(notiData => {
                    this.notifyData = notiData;
                });
            });

        } else {
            this.check = false;
        }

    }

    ngOnDestroy(): void {
        this.$notificationCountChange?.unsubscribe();
        this.$notificationReady?.unsubscribe();
    }

    showNotification(detail: string) {
        this.notifier.show({
            message: detail,
            type: 'info',
            template: this.customNotificationTmpl
        });
    }

    closeNotification() {
        this.notifier.hideAll();
    }

    onshownoticationfirst() {
        if (User.Current) {
            this.notificatFirstShow = !this.notificatFirstShow;
            if (this.notificatFirstShow) {
                this.notificatFirstClass = "Menu_NOtification_Wrap_First active";
            } else {
                this.notificatFirstClass = "Menu_NOtification_Wrap_First";
            }
        }

    }

    routerNotify(e) {
        this._notifactionSerice.read(e.NOTIFICATION_TO_ID).subscribe(_ => {
            this._notifactionSerice.getUnReadCount(User.Current.PersonalId).subscribe(x => {
                this.countNoti = x;
                // console.log(x);
            });
            this.router.navigate([`main/notify-data/${e.NOTIFICATION_TO_ID}`]);
            this.notificatFirstClass = "Menu_NOtification_Wrap_First";

            this._notifactionSerice.gets({ personalId: User.Current.PersonalId, unRead: true }, 0, 9).subscribe(a => {
                this.notifyData = a;
            });
        });
    }

    selectTranslate(e) {
        // console.log(e);
        if (e.value === true) {
            this.changeLanguage('');
        }else {
            this.changeLanguage('en');
        }
    }


    routerNotifymail() {
        if (User.Current) {
            this.router.navigate(['main/notification-list']);
        }
    }

    notifyAll() {
        this.router.navigate(['main/notification-list']);
    }

    displayFormatDate(rowData) {
        return formatDate(new Date(rowData), "dateShortTimeThai") + 'น.';
    }

    setDefaultPic() {
        this.userImagePath = "assets/icon/user.png";
    }

    changeLanguage(mode) {
        this.langMode = mode;
        localStorage.setItem('langMode', mode);

        // ตั้งค่า i18n ดึงข้อมูลภาษาตามที่เปลี่ยน
        const staticLang = mode === "en" ? "en" : "th";
        // this.translateService.use(staticLang);
        // ตั้งค่า locale set ภาษาตามที่เปลี่ยน
        locale(staticLang);

        // ตั้งค่าสำหรับใช้กับ child.
        // this.languageMode.emit(this.langMode);

        // ตั้งค่าสำหรับใช้กับ child ที่อยู่ใน route.
        // this.globalVal.statusLangMode.next({ langMode: this.langMode });

        // ตั้งค่าเพื่อแสดงสถานะภาษาที่เลือกตามปัจจุบัน
        this.currentLangMode = mode === "en" ? "EN" : "TH";
        this._appNotification.languageChange.next(staticLang);
    }


    async logout() {
        this.check = false;
        this.collapse = !this.collapse;
        const confirm = await Dialogue.Confirm("ยืนยัน", `คุณต้องการออกจากระบบ หรือไม่?`);
        if (!confirm) {
            this.check = true;
            return;
        }
        else {
            // this._dialog.info("สำเร็จ", "คุณได้ออกจากระบบเรียบร้อย").then(() => {
            //     this._loginServ.logout();
            // });
            Swal.fire({
                title: 'สำเร็จ!',
                text: 'คุณได้ออกจากระบบเรียบร้อย',
                icon: 'success',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                this._loginServ.logout();
            });
        }
    }
    logIn() {
        this.router.navigate(["login"]);
    }
    onHome() {
        this.router.navigate(["home"]);
    }

    onAbout() {
        this.router.navigate(["about"]);
    }

    onContact() {
        this.router.navigate(["contact"]);
    }

    onService() {
        this.router.navigate(["service"]);
    }

    onNews() {
        this.router.navigate(["news"]);
    }
    OnLogin() {
        this.router.navigate(["login"]);
    }
    onStatus() {
        if (User.Current) {
            this.router.navigate(['/main/tasklist']);
        } else {
            this.OnLogin();
        }
    }
    onDoc() {
        if (User.Current) {
            this.router.navigate(['/main/doc']);
        } else {
            this.OnLogin();
        }
    }
    onProfile() {
        this.router.navigate(["main/personal"]);
    }
    onCheckDocument() {
        this.router.navigate(["check-document"]);
    }

}

