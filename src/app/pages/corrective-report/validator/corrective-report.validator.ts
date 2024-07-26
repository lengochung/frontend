import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BaseValidatorComponent } from '../../../core/includes/base.validator.component';
export class CorrectiveReportValidator extends BaseValidatorComponent {
    public readonly SUBJECT_ML = 255;
    public readonly FACILITY_DETAIL_ML = 255;
    public readonly FIND_USER_ML = 255;

    /**
     * @description Get the validation rules that apply to the request.
     * @return {FormGroup} corrective report form
     */
    public createRules(): FormGroup {
        return new FormGroup({
            subject: new FormControl<string | null>(null, [
                Validators.required,
                Validators.maxLength(this.SUBJECT_ML)
            ]),
            incident_datetime: new FormControl<string | null>(null, []),
            is_from_report: new FormControl<number | null>(null, []),
            malfunction_no: new FormControl<number | null>(null, []),
            building_id: new FormControl<number | null>(null, []),
            fuel_type: new FormControl<number | null>(null, []),
            facility_id: new FormControl<number | null>(null, []),
            facility_detail1: new FormControl<string | null>(null, []),
            facility_detail2: new FormControl<string | null>(null, []),
            event_id: new FormControl<number | null>(null, []),
            find_user: new FormControl<string | null>(null, []),
            detail: new FormControl<string | null>(null, []),
            provisional_text: new FormControl<string | null>(null, []),
            analysis_text: new FormControl<string | null>(null, []),
            correction_detail: new FormControl<string | null>(null, []),
            is_correction: new FormControl<number | null>(null, []),

            plan_detail: new FormControl<string | null>(null, []),
            plan_user_id: new FormControl<number | null>(null, []),
            plan_deadline: new FormControl<string | null>(null, []),

            result_detail: new FormControl<string | null>(null, []),
            is_result_judgment: new FormControl<number | null>(null, []),
        });
    }

    /**
     * @description Get the error message for the defined validation rules.
     * @return {object} error messages
     */
    public createErrorMessages(): { [key: string]: any } {
        const subject = this.translate.instant('label.subject') as string;
        const facilityDetail1 = this.translate.instant('label.facility_detail1') as string;
        const facilityDetail2 = this.translate.instant('label.facility_detail2') as string;
        const findUser = this.translate.instant('label.discoverer_source') as string;

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
            facility_detail1: {
                maxlength: this.translate.instant('validation.maxlength', {
                    field: facilityDetail1,
                    number: this.FACILITY_DETAIL_ML
                }) as string
            },
            facility_detail2: {
                maxlength: this.translate.instant('validation.maxlength', {
                    field: facilityDetail2,
                    number: this.FACILITY_DETAIL_ML
                }) as string
            },
            find_user: {
                maxlength: this.translate.instant('validation.maxlength', {
                    field: findUser,
                    number: this.FIND_USER_ML
                }) as string
            },
        };
    }
}
