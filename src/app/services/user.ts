import * as Cookies from 'js-cookie';
import { IUserProfile } from './user.service';

export class User {
    private static _userInfo: IUserProfile;

    public static get Current(): IUserProfile
    {
        if (!User._userInfo) {
            const profile = Cookies.getJSON("profile");
            User._userInfo = profile || undefined;
        }
        return User._userInfo;
    }

    public static SetUser(userinfo: IUserProfile)
    {
        User._userInfo = userinfo;
        Cookies.set("profile", JSON.stringify(userinfo));
    }

    public static Clear(): void {
        Cookies.remove("profile");
        User._userInfo = undefined;
    }
}
