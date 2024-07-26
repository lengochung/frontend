import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BaseValidatorComponent } from '../../../core/includes/base.validator.component';
import { DemandMeasureEntity } from '../../../core/entities';
export class DemandInitialValidator extends BaseValidatorComponent {

    public readonly CONTRACT_POWER_ML = 10;

    /**
     * @description Get the validation rules that apply to the request.
     * @return {FormGroup} construction form
     */
    public createRules(): FormGroup {
        return new FormGroup({
            contract_power: new FormControl<string | null>(null, [
                Validators.required,
                Validators.maxLength(this.CONTRACT_POWER_ML)
            ]),
            target_demand: new FormControl<number | null>(null, [
                Validators.required
            ]),
            base_list: new FormArray([]),
            demand_response_list: new FormArray([]),
            emergency_response_list: new FormArray([]),
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
                }) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: contract_power,
                    number: this.CONTRACT_POWER_ML
                }) as string
            },
            target_demand: {
                required: this.translate.instant('validation.required', {
                    field: target_demand
                }) as string
            }
        };
    }

    /**
     * @param {DemandMeasureEntity} item item
     * @return {FormGroup} form
     */
    public createMeasureRules(item?: DemandMeasureEntity): FormGroup {
        return new FormGroup({
            measures_details: new FormControl(item?.measures_details, []),
            reduced_power: new FormControl(item?.reduced_power, [])
        });
    }

}

