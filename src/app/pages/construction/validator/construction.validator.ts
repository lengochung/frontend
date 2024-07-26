import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BaseValidatorComponent } from '../../../core/includes/base.validator.component';
import { IndividualConstructionEntity, ScheduleConstructionEntity } from '../../../core/entities';
export class ConstructionValidator extends BaseValidatorComponent {

    public readonly PLAN_NAME_ML = 100;

    /**
     * @description Get the validation rules that apply to the request.
     * @return {FormGroup} construction form
     */
    public createRules(): FormGroup {
        return new FormGroup({
            construction_plan_name: new FormControl<string | null>(null, [
                Validators.required,
                Validators.maxLength(this.PLAN_NAME_ML)
            ]),
            plan_classification: new FormControl<number | null>(null, [
                Validators.required
            ]),
            plan_start_date: new FormControl<number | null>(null, [
            ]),
            plan_end_date: new FormControl<string | null>(null, [
            ]),
            target_building_type: new FormControl<string | null>(null, [
            ]),
            location_details: new FormControl<string | null>(null, [
            ]),
            plan_summary: new FormControl<string | null>(null, []),
            individual_construction_list: new FormArray([]),
        });
    }

    /**
     * @description Get the error message for the defined validation rules.
     * @return {object} error messages
     */
    public createErrorMessages(): { [key: string]: any } {
        const construction_plan_name = this.translate.instant('label.construction_plan_name') as string;
        const plan_classification = this.translate.instant('label.plan_classification') as string;

        return {
            construction_plan_name: {
                required: this.translate.instant('validation.required', {
                    field: construction_plan_name
                }) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: construction_plan_name,
                    number: this.PLAN_NAME_ML
                }) as string
            },
            plan_classification: {
                required: this.translate.instant('validation.required', {
                    field: plan_classification
                }) as string
            }
        };
    }

    /**
     * @param {IndividualConstructionEntity} item item
     * @return {FormGroup} form
     */
    public createConstructionIndividualRules(item?: IndividualConstructionEntity): FormGroup {
        return new FormGroup({
            individual_construction_case_name: new FormControl<string | null>(item?.individual_construction_case_name ?? null, []),
            construction_type: new FormControl<number | null>(item?.construction_type ?? null, []),
            internal_person_id: new FormControl<number | null>(item?.internal_person_id ?? null, []),
            internal_person_name: new FormControl<string | null>(item?.internal_person_name ?? null, []),
            construction_company: new FormControl<string | null>(item?.construction_company ?? null, []),
            construction_company_representative: new FormControl<string | null>(item?.construction_company_representative ?? null, []),
            construction_start_date: new FormControl<string | null>(item?.construction_start_date ?? null, []),
            construction_end_date: new FormControl<string | null>(item?.construction_end_date ?? null, []),
            construction_plan: new FormControl<string | null>(item?.construction_plan ?? null, []),
            schedule_list: new FormArray([]),
        });
    }

    /**
     * @param {ScheduleConstructionEntity} item item
     * @return {FormGroup} form
     */
    public createScheduleConstructionRules(item?: ScheduleConstructionEntity): FormGroup {
        return new FormGroup({
            scheduled_date: new FormControl<string | null>(item?.scheduled_date ?? null, []),
            target_building_type: new FormControl<number | null>(item?.target_building_type ?? null, []),
            location_details: new FormControl<string | null>(item?.location_details ?? null, []),
            dynamic_influence: new FormControl<string | null>(item?.dynamic_influence ?? null, []),
            sensor_false_alarm_response: new FormControl<string | null>(item?.sensor_false_alarm_response ?? null, []),
            admission_procedure: new FormControl<string | null>(item?.admission_procedure ?? null, []),
            traffic_work_area_regulations: new FormControl<string | null>(item?.traffic_work_area_regulations ?? null, []),
            risk_prediction_response: new FormControl<string | null>(item?.risk_prediction_response ?? null, []),
            number_of_people: new FormControl<number | null>(item?.number_of_people ?? null, []),
            complete: new FormControl<number | null>(item?.complete ?? null, []),
        });
    }
}

