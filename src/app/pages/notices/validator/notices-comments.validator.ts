import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BaseValidatorComponent } from '../../../core/includes/base.validator.component';
export class NoticesCommentsValidator extends BaseValidatorComponent {

    public readonly SUBJECT_ML = 255;
    public readonly FACILITY_ML = 255;
    public readonly MANAGER_NAME_ML = 30;
    public readonly DESCRIPTION_ML = 500;

    /**
     * @description Get the validation rules that apply to the request.
     * @return {FormGroup} notice form
     */
    public createRules(): FormGroup {
        return new FormGroup({
            post_message: new FormControl<string | null>(null, [
                Validators.required,
            ]),
            attached_file: new FormControl<string | null>(null),
        });
    }

    /**
     * @description Get the error message for the defined validation rules.
     * @return {object} error messages
     */
    public createErrorMessages(): { [key: string]: any } {
        const post_message = this.translate.instant('label.post_message') as string;

        return {
            post_message: {
                required: this.translate.instant('validation.required', {
                    field: post_message
                }) as string
            }
        };
    }
}

