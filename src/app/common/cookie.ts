import * as Cookies from 'js-cookie';
import { Setting } from 'share-ui';
import { IAccessToken } from '../services/user.service';
export class CookieStorage {
    public static set accessToken(value: IAccessToken) {
        Cookies.set("access_token", value, { expires: 7 });
    }

    public static get accessToken(): IAccessToken {
        return Cookies.getJSON("access_token");
    }

    public static get setting(): Setting {
        return Cookies.getJSON("setting") || {};
    }

    public static removeAccessToken() {
        Cookies.remove("access_token");
    }

    public static clearAll() {
        CookieStorage.removeAccessToken();
        Cookies.remove("setting");
    }

    public static assignSetting(setting: Partial<Setting>) {
        const s = CookieStorage.setting;
        Cookies.set("setting", Object.assign(setting, s), { expires: 365 });
    }
}
