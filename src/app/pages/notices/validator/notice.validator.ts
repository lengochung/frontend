import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BaseValidatorComponent } from '../../../core/includes/base.validator.component';

export class NoticeValidator extends BaseValidatorComponent {

    public readonly SUBJECT_ML = 255;
    public readonly FACILITY_ML = 255;
    public readonly MANAGER_NAME_ML = 30;
    public readonly DETAIL_ML = 500;

    /**
     * @description Get the validation rules that apply to the request.
     * @return {FormGroup} notice form
     */
    public createRules(): FormGroup {
        return new FormGroup({
            subject: new FormControl<string | null>(null, [
                Validators.required,
                Validators.maxLength(this.SUBJECT_ML)
            ]),
            event_date: new FormControl<string | null>(null, [
                Validators.required
            ]),
            building_id: new FormControl<number | null>(null, [
                Validators.required
            ]),
            fuel_type: new FormControl<number | null>(null, [
                Validators.required
            ]),
            facility_id: new FormControl<number | null>(null),
            facility_detail1: new FormControl<string | null>(null, [
                Validators.maxLength(this.FACILITY_ML)
            ]),
            facility_detail2: new FormControl<string | null>(null, [
                Validators.maxLength(this.FACILITY_ML)
            ]),
            user_id: new FormControl<number | null>(null),
            detail: new FormControl<string | null>(null, [
                Validators.required,
                Validators.maxLength(this.DETAIL_ML)
            ]),
            recipient_ids: new FormControl<number[] | null>(null),
            attached_file: new FormControl<string | null>(null)
        });
    }

    /**
     * @description Get the error message for the defined validation rules.
     * @return {object} error messages
     */
    public createErrorMessages(): { [key: string]: any } {
        const subject = this.translate.instant('label.subject') as string;
        const event_date = this.translate.instant('label.occurrence_date') as string;
        const building_id = this.translate.instant('label.target_building') as string;
        const fuel_type = this.translate.instant('label.root_cause_type') as string;
        // const facility_id = this.translate.instant('label.facility') as string;
        const facility_detail1 = this.translate.instant('label.facility_detail1') as string;
        const facility_detail2 = this.translate.instant('label.facility_detail2') as string;
        const detail = this.translate.instant('label.phenomenon') as string;

        return {
            subject: {
                required: this.translate.instant('validation.required', {
                    field: subject
                }) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: subject,
                    number: this.SUBJECT_ML
                }) as string
            },
            event_date: {
                required: this.translate.instant('validation.required', {
                    field: event_date
                }) as string
            },
            building_id: {
                required: this.translate.instant('validation.required', {
                    field: building_id
                }) as string
            },
            fuel_type: {
                required: this.translate.instant('validation.required', {
                    field: fuel_type
                }) as string
            },
            // facility_id: {
            //     required: this.translate.instant('validation.required', {
            //         field: facility_id
            //     }) as string
            // },
            facility_detail1: {
                maxlength: this.translate.instant('validation.maxlength', {
                    field: facility_detail1,
                    number: this.FACILITY_ML
                }) as string
            },
            facility_detail2: {
                maxlength: this.translate.instant('validation.maxlength', {
                    field: facility_detail2,
                    number: this.FACILITY_ML
                }) as string
            },
            detail: {
                required: this.translate.instant('validation.required', {
                    field: detail
                }) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: detail,
                    number: this.DETAIL_ML
                }) as string
            }
        };
    }
    /**
     * @description Get the validation rules that apply to the request.
     * @return {FormGroup} notice form
     */
    public createTopicRules(): FormGroup {
        return new FormGroup({
            subject: new FormControl<string | null>(null, [
                Validators.required,
                Validators.maxLength(this.SUBJECT_ML)
            ]),
            event_date: new FormControl<string | null>(null, [
                Validators.required
            ]),
            building_id: new FormControl<number | null>(null, [
                Validators.required
            ]),
            fuel_type: new FormControl<number | null>(null, [
                Validators.required
            ]),
            facility_id: new FormControl<number | null>(null, [
                Validators.required
            ]),
            facility_detail1: new FormControl<string | null>(null, [
                Validators.maxLength(this.FACILITY_ML)
            ]),
            facility_detail2: new FormControl<string | null>(null, [
                Validators.maxLength(this.FACILITY_ML)
            ]),
            detail: new FormControl<string | null>(null, [
                Validators.required,
                Validators.maxLength(this.DETAIL_ML)
            ]),
            attached_file: new FormControl<string | null>(null, [
                Validators.required,
            ]),
        });
    }

    /**
     * @description Get the error message for the defined validation rules.
     * @return {object} error messages
     */
    public createTopicErrorMessages(): { [key: string]: any } {
        const subject = this.translate.instant('label.subject') as string;
        const event_date = this.translate.instant('label.occurrence_date') as string;
        const building_id = this.translate.instant('label.target_building') as string;
        const fuel_type = this.translate.instant('label.root_cause_type') as string;
        const facility_id = this.translate.instant('label.facility') as string;
        const facility_detail1 = this.translate.instant('label.facility_detail1') as string;
        const facility_detail2 = this.translate.instant('label.facility_detail2') as string;
        const detail = this.translate.instant('label.phenomenon') as string;
        const attached_file = this.translate.instant('label.attached_file') as string;

        return {
            subject: {
                required: this.translate.instant('validation.required', {
                    field: subject
                }) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: subject,
                    number: this.SUBJECT_ML
                }) as string
            },
            event_date: {
                required: this.translate.instant('validation.required', {
                    field: event_date
                }) as string
            },
            building_id: {
                required: this.translate.instant('validation.required', {
                    field: building_id
                }) as string
            },
            fuel_type: {
                required: this.translate.instant('validation.required', {
                    field: fuel_type
                }) as string
            },
            facility_id: {
                required: this.translate.instant('validation.required', {
                    field: facility_id
                }) as string
            },
            facility_detail1: {
                maxlength: this.translate.instant('validation.maxlength', {
                    field: facility_detail1,
                    number: this.FACILITY_ML
                }) as string
            },
            facility_detail2: {
                maxlength: this.translate.instant('validation.maxlength', {
                    field: facility_detail2,
                    number: this.FACILITY_ML
                }) as string
            },
            detail: {
                required: this.translate.instant('validation.required', {
                    field: detail
                }) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: detail,
                    number: this.DETAIL_ML
                }) as string
            },
            attached_file: {
                required: this.translate.instant('validation.required', {
                    field: attached_file
                }) as string
            },
        };
    }
}

