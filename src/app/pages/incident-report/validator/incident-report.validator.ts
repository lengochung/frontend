import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BaseValidatorComponent } from '../../../core/includes/base.validator.component';
export class IncidentReportValidator extends BaseValidatorComponent {
    public readonly SUBJECT_ML = 100;

    /**
     * @description Get the validation rules that apply to the request.
     * @return {FormGroup} incident report form
     */
    public createRules(): FormGroup {
        return new FormGroup({
            subject: new FormControl<string | null>(null, [
                Validators.required,
                Validators.maxLength(this.SUBJECT_ML)
            ]),
            occurrence_datetime: new FormControl<string | null>(null, [
                Validators.required,
            ]),
            target_building_type: new FormControl<string | null>(null, []),
            driving_type: new FormControl<string | null>(null, []),
            facility_name: new FormControl<string | null>(null, []),
            facility_detail1: new FormControl<string | null>(null, []),
            facility_detail2: new FormControl<string | null>(null, []),
            failure_rank: new FormControl<string | null>(null, []),
            discoverer: new FormControl<string | null>(null, []),
            description: new FormControl<string | null>(null, []),
            impact: new FormControl<string | null>(null, []),
            implementation_datetime: new FormControl<string | null>(null, []),
            report_detail: new FormControl<string | null>(null, []),
            treatment_detail: new FormControl<string | null>(null, []),
            possible_causes: new FormControl<string | null>(null, []),
            permanent_fix_proposal: new FormControl<string | null>(null, []),
            judgment_necessity: new FormControl<string | null>(null, []),
        });
    }

    /**
     * @description Get the error message for the defined validation rules.
     * @return {object} error messages
     */
    public createErrorMessages(): { [key: string]: any } {
        const subject = this.translate.instant('label.subject') as string;
        const occurrence_date = this.translate.instant('label.occurrence_date') as string;

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
            occurrence_datetime: {
                required: this.translate.instant('validation.required', {
                    field: occurrence_date
                }) as string
            },
        };
    }
}
