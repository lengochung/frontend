import { FormGroup, FormControl } from '@angular/forms';
import { BaseValidatorComponent } from '../../../core/includes/base.validator.component';
export class DemandManagerValidator extends BaseValidatorComponent {

    /**
     * @description Get the validation rules that apply to the request.
     * @return {FormGroup} construction form
     */
    public createRules(): FormGroup {
        return new FormGroup({
            contract_power: new FormControl<string | null>(null, [
            ]),
            target_demand: new FormControl<number | null>(null, [])
        });
    }

    /**
     * @description Get the error message for the defined validation rules.
     * @return {object} error messages
     */
    public createErrorMessages(): { [key: string]: any } {
        const contract_power = this.translate.instant('label.contract_power') as string;
        const target_demand = this.translate.instant('label.target_demand') as string;

        return {
            contract_power: {
                required: this.translate.instant('validation.required', {
                    field: contract_power
                }) as string
            },
            target_demand: {
                required: this.translate.instant('validation.required', {
                    field: target_demand
                }) as string
            }
        };
    }


}

