/* eslint-disable @typescript-eslint/ban-types */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { getMaxDate, parseDate, parseIntStrict } from 'src/app/common/helper';

@Component({
    selector: 'app-date-combo-register',
    templateUrl: './date-combo-register.component.html',
    styleUrls: ['./date-combo-register.component.scss']
})
export class DateComboRegisterComponent implements OnInit, OnChanges {
    @Input() date;
    @Input() minDate;
    @Input() maxDate;
    @Input() months;
    @Input() order;
    @Input() attrsDate: object = {};
    @Input() attrsMonth: object = {};
    @Input() attrsYear: object = {};
    @Input() yearOrder;
    @Input() timezone;
    @Input() placeholder;
    @Input() ngRequired;
    @Input() disabled: any;
    @Input() visible: any = [ true, true, true ];
    @Output() dateChange = new EventEmitter<any>();

    ngModel;
    selects: Selects = {
        d: { visible: true },
        m: { visible: true },
        y: { visible: true }
    };

    monthNames = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม',
        'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

    _minDate: Date;
    _maxDate: Date;
    placeHolders: any;
    ngOnInit() {
        // console.log('date',this.date);
        const now = new Date();
        // Initialize model.
        this.ngModel = parseDate(this.ngModel, this.timezone);

        // Initialize attributes variables.
        this.selects.d.attrs = this.attrsDate;
        this.selects.m.attrs = this.attrsMonth;
        this.selects.y.attrs = this.attrsYear;

        if (typeof this.disabled === 'boolean') {
            this.selects.d.disabled = this.disabled;
            this.selects.m.disabled = this.disabled;
            this.selects.y.disabled = this.disabled;
        } else if (this.disabled instanceof Array && this.disabled.length === 3) {
            this.selects.d.disabled = this.disabled[0];
            this.selects.m.disabled = this.disabled[1];
            this.selects.y.disabled = this.disabled[2];
        }

        if (typeof this.visible === 'boolean') {
            this.selects.d.visible = this.visible;
            this.selects.m.visible = this.visible;
            this.selects.y.visible = this.visible;
        } else if (this.visible instanceof Array && this.visible.length === 3) {
            this.selects.d.visible = this.visible[0];
            this.selects.m.visible = this.visible[1];
            this.selects.y.visible = this.visible[2];
        }

        // Verify if initial date was defined.
        const initDate = parseDate(this.date, this.timezone);
        if (initDate != null) {
            this.ngModel = initDate;
        }

        // Initialize order.
        if (typeof this.order !== 'string') {
            this.order = 'dmy'.split('');
        } else {
            this.order = this.order.toLowerCase().split('');
        }
        // Initialize minimal and maximum values.
        this._minDate = parseDate(this.minDate, this.timezone);
        if (this.minDate == null) {
            this._minDate = new Date(now.getFullYear() - 50, now.getMonth(), now.getDate(),
                now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
        }
        this._maxDate = parseDate(this.maxDate, this.timezone);
        if (this._maxDate == null) {
            this._maxDate = new Date(now.getFullYear() + 50, now.getMonth(), now.getDate(),
                now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
        }

        // Verify if selected date is in the valid range.
        if (this.ngModel && this.ngModel < this._minDate) {
            this.ngModel = this._minDate;
        }
        if (this.ngModel && this.ngModel > this._maxDate) {
            this.ngModel = this._maxDate;
        }

        if (this.months !== undefined && this.months !== null) {
            if (typeof this.months === 'string') {
                const months = this.months.split(',');
                if (months.length === 12) {
                    this.monthNames = months;
                }
            }
            if (Array.isArray(this.months) && this.months.length === 12) {
                this.monthNames = this.months;
            }
        }

        this.updatePlaceholders();
        this.updateMonthList('');
        this.updateYearList('');
        this.updateDateList('', '');
        this.writeValue(this.ngModel);
    }

    onChange() {
        // console.log('this.selects.y.value',this.selects.y.value);
        // console.log('this.selects.m.value',this.selects.m.value);
        // console.log('this.selects.d.value',this.selects.d.value);
        // let res = null;

        if (this.selects.y.value && this.selects.m.value === 999 && this.selects.d.value === 999){
            const dateString = `${this.selects.y.value}-Nan-Nan`;
            this.dateChange.emit(dateString);
        }else if (this.selects.y.value &&
            (this.selects.m.value >= 0 && this.selects.m.value <= 11) &&
            this.selects.d.value === 999)
        {
            const dateString = `${this.selects.y.value}-${this.selects.m.value+1}-Nan`;
            this.dateChange.emit(dateString);

        }else if (this.selects.y.value && this.selects.m.value === 999 &&
            (this.selects.d.value >= 1 && this.selects.d.value !== 999))
        {
            const dateString = `${this.selects.y.value}-Nan-${this.selects.d.value}`;
            this.dateChange.emit(dateString);

        }else{
            // Check that the three combo boxes have values.
            let dateString = '0000-00-00';
            if (this.selects.d.value && !isNaN(this.selects.m.value) &&
            this.selects.y.value != null && this.selects.y.value) {
                const maxDay = getMaxDate(this.selects.m.value + 1, this.selects.y.value);

                let hours = 0;
                let minutes = 0;
                let seconds = 0;
                let milliseconds = 0;
                if (this.ngModel != null) {
                    hours = this.ngModel.getHours();
                    minutes = this.ngModel.getMinutes();
                    seconds = this.ngModel.getSeconds();
                    milliseconds = this.ngModel.getMilliseconds();
                }
                // Remove already selected day & date if day is  greater than maxday then form invalid value also resets
                if (this.selects.d.value > maxDay) {
                    this.selects.d.value = null;
                } else {
                    // const dateNew = new Date(this.selects.y.value, this.selects.m.value,
                    //     this.selects.d.value > maxDay ? maxDay : this.selects.d.value, hours, minutes, seconds, milliseconds);
                    const dd = this.selects.d.value > maxDay ? maxDay : this.selects.d.value;
                    dateString = `${this.selects.y.value}-${this.selects.m.value+1}-${dd}`;
                }
            }

            // Disable placeholders after selecting a value.
            if (this.placeHolders) {
                if (this.selects.y.value) {
                    this.placeHolders[0].disabled = true;
                }
                if (this.selects.m.value) {
                    this.placeHolders[1].disabled = true;
                }
                if (this.selects.d.value) {
                    this.placeHolders[2].disabled = true;
                }
            }
            // const dateString = `${this.selects.y.value}-${this.selects.m.value}-00`;
            this.dateChange.emit(dateString);
            // this.dateChange.emit(res);

        }
        // Hide or show days and months according to the min and max dates.
        this.updateMonthList(this.selects.y.value);
        this.updateYearList(this.selects.m.value);
        this.updateDateList(this.selects.m.value, this.selects.y.value);

        // this.propagateChange(res);
    }

    propagateChange: any = () => {};

    writeValue(value: any): void {
        if (value) {
            this.selects.d.value = value.getDate();
            this.selects.m.value = value.getMonth();
            this.selects.y.value = value.getFullYear();
        } else {
            if (typeof this.visible === 'boolean') {
                this.selects.d.value = this.visible ? null : 1;
                this.selects.m.value = this.visible ? null : 0;
                this.selects.y.value = this.visible ? null : new Date().getFullYear();
            } else if (this.visible instanceof Array && this.visible.length === 3) {
                this.selects.d.value = this.visible[0] ? null : 1;
                this.selects.m.value = this.visible[1] ? null : 0;
                this.selects.y.value = this.visible[2] ? null : new Date().getFullYear();
            }

            if (this.placeHolders) {
                this.placeHolders[0].disabled = false;
                this.placeHolders[1].disabled = false;
                this.placeHolders[2].disabled = false;
            }
        }

        this.updateMonthList(this.selects.y.value);
        this.updateYearList(this.selects.m.value);
        this.updateDateList(this.selects.m.value, this.selects.y.value);
    }

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
    }

    validate(c: AbstractControl): ValidationErrors | any {
        return this.selects.d.value && this.selects.d.value && this.selects.y.value ?
            null : { required: true };
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.placeholder && !changes.placeholder.isFirstChange()) {
            this.updatePlaceholders();
            this.updateMonthList(this.selects.y.value);
            this.updateYearList(this.selects.m.value);
            this.updateDateList(this.selects.m.value, this.selects.y.value);
        }
    }

    // Update list of months.
    updateMonthList(year) {
        // Parse parameter.
        year = parseIntStrict(year);

        // Some months can not be chosen if the year matches with the year of the minimum or maximum dates.
        const start = year !== null && year === this._minDate.getFullYear() ? this._minDate.getMonth() : 0;
        const end = year !== null && year === this._maxDate.getFullYear() ? this._maxDate.getMonth() : 11;

        // Generate list.
        this.selects.m.options = [];
        if (this.placeHolders) {
            this.selects.m.options.push(this.placeHolders[1]);
        }
        this.selects.m.options.push({value: 999, name: "------------"});
        for (let i = start; i <= end; i++) {
            this.selects.m.options.push({value: i, name: this.monthNames[i]});
        }
    }

    // Update list of years.
    updateYearList(month?) {
        // Parse parameter.
        month = parseIntStrict(month);

        this.selects.y.options = [];
        const isReverse = typeof this.yearOrder === 'string' && this.yearOrder.indexOf('des') === 0;
        for (let i = this._minDate.getFullYear(); i <= this._maxDate.getFullYear(); i++) {
            const now = new Date();
            if (month + 1 < this._minDate.getMonth() && now.getFullYear() === i && month !== null &&
          (isReverse && month > now.getMonth() || !isReverse && month < now.getMonth())) {
                continue;
            }

            this.selects.y.options.push({value: i, name: i + 543});
        }

        // Verify if the order of the years must be reversed.
        if (isReverse) {
            this.selects.y.options.reverse();
        }

        // Prepend the years placeholder
        if (this.placeHolders) {
            this.selects.y.options.unshift(this.placeHolders[0]);
        }
    }

    // Initialize list of days.
    updateDateList(month, year) {
        // Parse parameters.
        month = parseIntStrict(month);
        year = parseIntStrict(year);

        // Start date is 1, unless the selected month and year matches the minimum date.
        let start = 1;
        if (month !== null && month === this._minDate.getMonth() &&
        year !== null && year === this._minDate.getFullYear()) {
            start = this._minDate.getDate();
        }

        // End date is 30 or 31 (28 or 29 in February), unless the selected month and year matches the maximum date.
        let end = getMaxDate(month !== null ? (month + 1) : null, year);
        if (month !== null && month === this._maxDate.getMonth() &&
        year !== null && year === this._maxDate.getFullYear()) {
            end = this._maxDate.getDate();
        }

        // Generate list.
        this.selects.d.options = [];
        if (this.placeHolders) {
            this.selects.d.options.push(this.placeHolders[2]);
        }
        this.selects.d.options.push({value: 999, name: "---"});
        for (let i = start; i <= end; i++) {
            this.selects.d.options.push({
                value: i,
                name: i
            });
        }
    }

    // Initialize place holders.
    updatePlaceholders() {
        this.placeHolders = null;
        if (this.placeholder !== undefined && this.placeholder !== null &&
        (typeof this.placeholder === 'string' || Array.isArray(this.placeholder))) {

            const holders = typeof this.placeholder === 'string' ?
                this.placeholder.split(',') : this.placeholder;
            if (holders.length === 3) {
                this.placeHolders = [];
                for (const h of holders) {
                    this.placeHolders.push({value: null, name: h, disabled: false});
                }
            }
        }
    }
}

export interface Option {
    value: any;
    name: any;
    disabled?: boolean;
}

export interface Select {
    value?: any;
    options?: Option[];
    visible?: boolean;
    attrs?: object;
    disabled?: boolean;
}

export interface Selects {
    d: Select;
    m: Select;
    y: Select;
}
