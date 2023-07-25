import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { parseDate } from 'src/app/common/helper';

@Component({
    selector: 'app-date-time-input',
    templateUrl: './date-time-input.component.html',
    styleUrls: ['./date-time-input.component.scss']
})
export class DateTimeInputComponent implements OnInit {

    @Input() date;
    @Input() type = "add";
    @Input() reset = false;
    hours: number;
    minutes: number;
    seconds: number;
    ngModel;
    @Input() timezone;
    @Input() order;
    hour = Array.from({ length: 24 }, (_, index) => index);
    minute = Array.from({ length: 60 }, (_, index) => index);
    second = Array.from({ length: 60 }, (_, index) => index);
    @Input() disabled: any;

    selects : Selects = {
        h: { visible: true},
        m: { visible: true},
        s: { visible: true}
    };

    @Output() datetimeChange = new EventEmitter<Date>();

    ngOnInit() {

        this.ngModel = parseDate(this.ngModel, this.timezone);

        if (typeof this.order !== 'string') {
            this.order = 'hms'.split('');
        } else {
            this.order = this.order.toLowerCase().split('');
        }
        if (this.type == "add"){
            this.selects.h.disabled = false;
            this.selects.m.disabled = false;
            this.selects.s.disabled = false;
        }else{
            this.selects.h.disabled = true;
            this.selects.m.disabled = true;
            this.selects.s.disabled = true;
        }
        this.setHMS();
        this.updateDateTime();
        if(this.reset == true){
            this.selects.h.value == null;
            this.selects.m.value == null;
            this.selects.s.value == null;
        }
        const initDate = parseDate(this.date, this.timezone);
        if (initDate != null) {
            this.ngModel = initDate;
        }
    }

    updateDateTime() {
        const datetime = new Date();
        datetime.setHours(this.selects.h.value);
        datetime.setMinutes(this.selects.m.value);
        datetime.setSeconds(this.selects.s.value);
        this.datetimeChange.emit(datetime);
    }

    setHMS(){
        this.selects.h.options = [];
        this.selects.m.options = [];
        this.selects.s.options = [];
        for (let i = 0; i <= 23; i++) {
            this.selects.h.options.push({value: i, name:String(i)});
        }
        for (let i = 0; i <= 59; i++) {
            this.selects.m.options.push({value: i, name:String(i)});
            this.selects.s.options.push({value: i, name:String(i)});
        }
    }
}

export interface Option {
    value: number;
    name: any;
}


export interface Select {
    value?: any;
    options?: Option[];
    visible?: boolean;
    attrs?: object;
    disabled?: boolean;
}

export interface Selects {
    h: Select;
    m: Select;
    s: Select;
}
