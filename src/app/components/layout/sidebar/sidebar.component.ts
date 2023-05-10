import { PersonalService } from './../../../services/personal.service';
import { User } from './../../../services/user';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxTreeViewComponent } from 'devextreme-angular';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/services/login.service';
// import { SidebarInterface, SidebarService } from 'src/app/services/sidebar.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    @ViewChild(DxTreeViewComponent) menu: DxTreeViewComponent;
    @Output() selectedItemChanged = new EventEmitter<string>();
    @Output() onInitialized = new EventEmitter<SidebarComponent>();
    FullNameTH: string;
    PositionNameTH: string;
    userImagePath: string | ArrayBuffer;
    _userInfo;
    _menuList = [
        {
            id: 1,
            text: "ติดตามสถานะ",
            icon: "fas fa-file-alt",
            link: "/main/tasklist",
        },
        {
            id: 1002,
            text: "ข้อมูลส่วนตัว",
            icon: "fa fa-user",
            link: "/main/personal",
        },
    ];

    constructor(private _route: Router, private servicePersonal: PersonalService,
        private _loginServ: LoginService) { }

    ngOnInit() {
        setTimeout(() => {
            // this.selectedItem = this._selectedItem;
            this.onInitialized.emit(this);
        });
        if (User.Current) {
            this._userInfo = User.Current;
            this.FullNameTH = this._userInfo.FullNameTH;
            this.PositionNameTH = this._userInfo.PositionNameTH;
            this.userImagePath = environment.config.baseConfig.resourceUrl.replace("/ccib", "/bpm") + User.Current.ImageUrl;
        }
    }

    onItemClick(event) {
        this.selectedItemChanged.emit(event);
    }

    setDefaultPic() {
        this.userImagePath = "assets/icon/user.png";
    }


    logout() {
        this._loginServ.logout();
    }
}
