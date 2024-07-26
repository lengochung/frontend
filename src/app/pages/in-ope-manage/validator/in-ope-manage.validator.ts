import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BaseValidatorComponent } from '../../../core/includes/base.validator.component';
export class InOpeManageValidator extends BaseValidatorComponent {

    public readonly SUBJECT_ML = 100;
    public readonly FACILITY_ML = 50;
    public readonly WORK_DETAIL_ML = 500;
    public readonly PURPOSE_ML = 500;

    /**
     * @description Get the validation rules that apply to the request.
     * @return {FormGroup} in-ope manage form
     */
    public createRules(): FormGroup {
        return new FormGroup({
            subject: new FormControl<string | null>(null, [
                Validators.required,
                Validators.maxLength(this.SUBJECT_ML)
            ]),
            target_building_type: new FormControl<number | null>(null, [
                Validators.required
            ]),
            driving_type: new FormControl<number | null>(null, [
                Validators.required
            ]),
            facility_name: new FormControl<string | null>(null, [
                Validators.required,
                Validators.maxLength(this.FACILITY_ML)
            ]),
            facility_detail1: new FormControl<string | null>(null, [
                Validators.maxLength(this.FACILITY_ML)
            ]),
            facility_detail2: new FormControl<string | null>(null, [
                Validators.maxLength(this.FACILITY_ML)
            ]),
            work_detail: new FormControl<string | null>(null, [
                Validators.required,
                Validators.maxLength(this.WORK_DETAIL_ML)
            ]),
            purpose: new FormControl<string | null>(null, [
                Validators.required,
                Validators.maxLength(this.PURPOSE_ML)
            ]),
            plan_treatment_user: new FormControl<string | null>(null, []),
            plan_schedule_date: new FormControl<string | null>(null, []),
        });
    }

    /**
     * @description Get the error message for the defined validation rules.
     * @return {object} error messages
     */
    public createErrorMessages(): { [key: string]: any } {
        const subject = this.translate.instant('label.subject') as string;
        const target_building_type = this.translate.instant('label.target_building') as string;
        const driving_type = this.translate.instant('label.root_cause_type') as string;
        const facility_name = this.translate.instant('label.facility') as string;
        const facility_detail1 = this.translate.instant('label.facility_detail1') as string;
        const facility_detail2 = this.translate.instant('label.facility_detail2') as string;
        const work_detail = this.translate.instant('label.work_detail') as string;
        const purpose = this.translate.instant('label.purpose') as string;

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
            target_building_type: {
                required: this.translate.instant('validation.required', {
                    field: target_building_type
                }) as string
            },
            driving_type: {
                required: this.translate.instant('validation.required', {
                    field: driving_type
                }) as string
            },
            facility_name: {
                required: this.translate.instant('validation.required', {
                    field: facility_name
                }) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: facility_name,
                    number: this.FACILITY_ML
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
            work_detail: {
                required: this.translate.instant('validation.required', {
                    field: work_detail
                }) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: work_detail,
                    number: this.WORK_DETAIL_ML
                }) as string
            },
            purpose: {
                required: this.translate.instant('validation.required', {
                    field: purpose
                }) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: purpose,
                    number: this.PURPOSE_ML
                }) as string
            }
        };
    }
}

