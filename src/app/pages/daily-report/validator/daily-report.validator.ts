import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BaseValidatorComponent } from '../../../core/includes/base.validator.component';
import { TopicsEntity } from '../../../core/entities';

export class DailyReportValidator extends BaseValidatorComponent {
    public readonly CONTENT_ML = 500;
    public readonly HOLIDAY_WORKER_ML = 500;
    public readonly LEAVE_TAKER_ML = 500;
    public readonly NOTICE_ML = 500;

    /**
     * @description Get the validation rules that apply to the request.
     * @return {FormGroup} daily report form
     */
    public createRules(): FormGroup {
        return new FormGroup({
            target_date: new FormControl<string | null>(null, [
                Validators.required,
            ]),
            content: new FormControl<string | null>(null, [
                Validators.required,
                Validators.maxLength(this.CONTENT_ML),
            ]),
            holiday_worker: new FormControl<string | null>(null, [
                Validators.maxLength(this.HOLIDAY_WORKER_ML),
            ]),
            leave_taker: new FormControl<string | null>(null, [
                Validators.maxLength(this.LEAVE_TAKER_ML),
            ]),
            notice: new FormControl<string | null>(null, [
                Validators.maxLength(this.NOTICE_ML),
            ]),
            topic_list: new FormArray([]),
        });
    }

    /**
     * @description Get the error message for the defined validation rules.
     * @return {object} error messages
     */
    public createErrorMessages(): { [key: string]: any } {
        const target_date = this.translate.instant(
            'label.daily_report_target_date'
        ) as string;
        const content = this.translate.instant(
            'label.working_status'
        ) as string;
        const holiday_worker = this.translate.instant(
            'label.holiday_workers'
        ) as string;
        const leave_taker = this.translate.instant(
            'label.leave_taker'
        ) as string;
        const notice = this.translate.instant('label.notice') as string;

        return {
            target_date: {
                required: this.translate.instant('validation.required', {
                    field: target_date,
                }) as string,
            },
            content: {
                required: this.translate.instant('validation.required', {
                    field: content,
                }) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: content,
                    number: this.CONTENT_ML,
                }) as string,
            },
            holiday_worker: {
                maxlength: this.translate.instant('validation.maxlength', {
                    field: holiday_worker,
                    number: this.HOLIDAY_WORKER_ML,
                }) as string,
            },
            leave_taker: {
                maxlength: this.translate.instant('validation.maxlength', {
                    field: leave_taker,
                    number: this.LEAVE_TAKER_ML,
                }) as string,
            },
            notice: {
                maxlength: this.translate.instant('validation.maxlength', {
                    field: notice,
                    number: this.NOTICE_ML,
                }) as string,
            },
        };
    }

    /**
     * create topic formGroup
     * @author DuyPham
     *
     * @param {TopicEntity} topic topic daily report
     * @returns {FormGroup} topic form group
     */
    public createTopicRules(topic: TopicsEntity): FormGroup {
        const isDisableDeadline = topic.is_deadline ? false : true;
        return new FormGroup({
            id: new FormControl(topic.topic_no),
            topic_type: new FormControl(topic.topic_type),
            subject: new FormControl(topic.subject),
            occurrence_datetime: new FormControl(topic.event_date),
            target_building_type: new FormControl(topic.building_id),
            driving_type: new FormControl(topic.fuel_type),
            facility_name: new FormControl(topic.facility_id),
            facility_detail1: new FormControl(topic.facility_detail1),
            facility_detail2: new FormControl(topic.facility_detail2),
            detail: new FormControl(topic.detail),
            user_charge_previous: new FormControl(topic.previous_user_id),
            user_charge_today: new FormControl(topic.today_user_id),
            is_deadline: new FormControl(topic.is_deadline),
            deadline: new FormControl({
                value: topic.is_deadline,
                disabled: isDisableDeadline,
            }),
            complete_date: new FormControl({
                value: topic.completion_date,
                disabled: isDisableDeadline,
            }),
        });
    }
}

