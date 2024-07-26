import { FormGroup, FormControl } from '@angular/forms';
import { BaseValidatorComponent } from '../../../core/includes/base.validator.component';

export class ChangeOrderValidator extends BaseValidatorComponent {

    /**
     * @description Get the validation rules that apply to the request.
     * @return {FormGroup} daily report form
     */
    public createRules(): FormGroup {
        return new FormGroup({
            subject: new FormControl<string | null>(null, []),
            change_item: new FormControl<string | null>(null, []),
            before_change: new FormControl<string | null>(null, []),
            content_change: new FormControl<string | null>(null, []),
            scope: new FormControl<string | null>(null, []),
            start_date_application: new FormControl<string | null>(null, []),
            end_date_application: new FormControl<string | null>(null, []),
            additional_explanation: new FormControl<string | null>(null, []),
            closing_comment: new FormControl<string | null>(null, []),
            is_end: new FormControl<string | null>(null, []),
            is_permanent: new FormControl<string | null>(null, []),
        });
    }

    /**
     * @description Get the error message for the defined validation rules.
     * @return {object} error messages
     */
    public createErrorMessages(): { [key: string]: any } {
        return {
        };
    }
}

