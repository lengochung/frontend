/* eslint-disable require-jsdoc */
import { Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import Constants from '../../../utils/constants';

@Injectable()

export class SSDatepickerI18n extends NgbDatepickerI18n {
    getWeekdayLabel(weekday: number): string {
        return Constants.DATEPICKER_I18N.vn.weekdays[weekday - 1];
    }
    getMonthShortName(month: number): string {
        return Constants.DATEPICKER_I18N.vn.months[month - 1];
    }
    getMonthFullName(month: number): string {
        return this.getMonthShortName(month);
    }
    getDayAriaLabel(date: NgbDateStruct): string {
        return `${date.day}/${date.month}/${date.year}`;
    }
    format(date: NgbDateStruct): string {
        return date ? `${date.day}/${date.month}/${date.year}` : '';
    }
}
