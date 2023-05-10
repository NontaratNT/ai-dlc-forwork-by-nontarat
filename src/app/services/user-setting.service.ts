import { Injectable } from '@angular/core';
import { IUserSetting } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class UserSettingService {

    public userSetting: IUserSetting = {
        location_name: undefined,
        issue_status: false,
        tabIndex: undefined,
        iconVisible: false

    };

    constructor() {
        const localUserSetting = localStorage.getItem("usersetting");
        this.userSetting = localUserSetting ? JSON.parse(localUserSetting) : this.userSetting;
    }

    public Save() {
        localStorage.setItem("usersetting", JSON.stringify(this.userSetting));
    }
}
