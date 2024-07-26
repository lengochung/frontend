import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BaseValidatorComponent } from '../../../core/includes/base.validator.component';
export class GroupValidator extends BaseValidatorComponent {
    public readonly GROUP_NAME_ML = 255;
    public readonly DESCRIPTION_ML = 255;

    /**
     * @description Get the validation rules that apply to the request.
     * @return {FormGroup} group form
     */
    public createRules(): FormGroup {
        return new FormGroup({
            group_name: new FormControl<string | null>(null, [
                Validators.required,
                Validators.maxLength(this.GROUP_NAME_ML)
            ]),
            description: new FormControl<string | null>(null, [
                Validators.required,
                Validators.maxLength(this.DESCRIPTION_ML)
            ])
        });
    }

    /**
     * @description Get the error message for the defined validation rules.
     * @return {object} error messages
     */
    public createErrorMessages(): { [key: string]: any } {
        const group_name = this.translate.instant('label.group_name') as string;
        const description = this.translate.instant('label.description') as string;

        return {
            group_name: {
                required: this.translate.instant('validation.required', {
                    field: group_name
                }) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: group_name,
                    number: this.GROUP_NAME_ML
                }) as string
            },
            description: {
                required: this.translate.instant('validation.required', {
                    field: description
                }) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: description,
                    number: this.DESCRIPTION_ML
                }) as string
            },
        };
    }
}
