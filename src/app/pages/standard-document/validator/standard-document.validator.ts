import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { BaseValidatorComponent } from '../../../core/includes/base.validator.component';
export class StandardDocumentValidator extends BaseValidatorComponent {

    /**
     * @description Get the validation rules that apply to the request.
     * @return {FormGroup} standard document form
     */
    public createRules(): FormGroup {
        return new FormGroup({
            standard_document_number: new FormControl('', []),
            standard_classification: new FormControl('', []),
            standard_document_name: new FormControl('', []),
            target_business_establishment: new FormControl('', []),
            root_cause_type: new FormControl('', []),
            new_summary: new FormControl('', []),
            comment_list: new FormArray([]),
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

    /**
     * @return {FormGroup} form
     */
    public createCommentRules(): FormGroup {
        return new FormGroup({
            comment: new FormControl('', [])
        });
    }
}

