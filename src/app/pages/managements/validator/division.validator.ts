import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BaseValidatorComponent } from '../../../core/includes/base.validator.component';

export class DivisionValidator extends BaseValidatorComponent {

    public readonly CANDIDATE_ML = 255;
    /**
     * @description Get the validation rules that apply to the request.
     * @return {FormGroup} notice form
     */
    public createRules(): FormGroup {
        return new FormGroup({
            function_id: new FormControl<string | null>(null, [
                Validators.required,
            ]),
            page_id: new FormControl<string | null>(null, [
                Validators.required
            ]),
            item_id: new FormControl<number | null>(null, [
                Validators.required
            ]),
            candidate: new FormControl<string | null>(null, [
                Validators.required,
                Validators.maxLength(this.CANDIDATE_ML)
            ])
        });
    }

    /**
     * @description Get the error message for the defined validation rules.
     * @return {object} error messages
     */
    public createErrorMessages(): { [key: string]: any } {
        const function_id = this.translate.instant('label.function_id') as string;
        const page_id = this.translate.instant('label.page_id') as string;
        const item_id = this.translate.instant('label.item_id') as string;
        const candidate = this.translate.instant('label.candidate') as string;

        return {
            function_id: {
                required: this.translate.instant('validation.required', {
                    field: function_id
                }) as string
            },
            page_id: {
                required: this.translate.instant('validation.required', {
                    field: page_id
                }) as string
            },
            item_id: {
                required: this.translate.instant('validation.required', {
                    field: item_id
                }) as string
            },
            candidate: {
                required: this.translate.instant('validation.required', {
                    field: candidate
                }) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: candidate,
                    number: this.CANDIDATE_ML
                }) as string
            }
        };
    }
}

