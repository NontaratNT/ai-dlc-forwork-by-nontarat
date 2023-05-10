import { Injectable } from "@angular/core";
import * as moment from "moment";

@Injectable({
    providedIn: "root",
})
export class ConvertDateService {
    monthShortTh = [
        "ม.ค.",
        "ก.พ.",
        "มี.ค.",
        "เม.ย.",
        "พ.ค.",
        "มิ.ย.",
        "ก.ค.",
        "ส.ค.",
        "ก.ย.",
        "ต.ค.",
        "พ.ย.",
        "ธ.ค.",
    ];
    constructor() {}
    ConvertToDate(dateCheck = null) {
        if (dateCheck) {
            const date = moment(dateCheck, "YYYY-MM-DD").toDate();
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            if (day > 0 && month > 0 && year > 0) {
                return date;
            }
        }
        return this.SetDateDefault();
    }
    SetDateDefault(minusYear = 30, yy = false, mm = false, dd = false) {
        const obj = moment().subtract(minusYear, "years");
        if (yy) {
            obj.startOf("year");
        }
        if (mm) {
            obj.startOf("month");
        }
        if (dd) {
            obj.startOf("day");
        }
        return obj.toDate();
    }
    ConvertToDateFormat(dateCheck = null) {
        return moment(dateCheck).format("YYYY-MM-DD");
    }
    ConvertToTimeFormat() {
        return moment().format("HH:mm");
    }
    ConvertStringShortDate(date) {
        const d = new Date(date);
        const month = d.getMonth();
        const ddate = ` ${d.getDate()} `;
        const textMonthNow = ` ${this.monthShortTh[month]}`;
        const year = (d.getFullYear() + 543);
        return [ddate,' ' , textMonthNow,' ',year].join("");
    }

}
