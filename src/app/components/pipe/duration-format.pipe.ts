import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment";
import 'moment-duration-format';

@Pipe({
    name: 'durationFormat'
})
export class DurationFormatPipe implements PipeTransform {

    transform(duration: number, unit: moment.unitOfTime.DurationConstructor = "millisecond"): any {
        const momentDuration: any = moment.duration(duration, unit);
        return momentDuration.format(this.customFormat);
    }

    customFormat() {
        const self: any = this;
        if (self.duration.asYears() >= 1 && self.duration.months() < 1) {
            return "y [ปี] d [วัน]";
        }

        if (self.duration.asYears() >= 1 && self.duration.days() < 1) {
            return "y [ปี] M [เดือน]";
        }

        return self.duration.asDays() >= 1 ? "y [ปี] M [เดือน] d [วัน]" : "h [ชั่วโมง] m [นาที]";
    }
}
