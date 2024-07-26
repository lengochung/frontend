import BaseEntity from './base.entity';
import { CheckboxEntity, FilterTableEntity, SortEntity } from './filter-table.entity';
export class DemandEntity extends BaseEntity {
    id?: number;
    form_type?: number;
    date_actual?: string;
    demand_prediction_curve_confirmation_results?: string;
    maximum_demand?: string;
    maximum_demand_time?: string;
    contract_power_surplus?: string;
    target_demand_surplus?: string;
    results_control_measures?: string;
    prediction_difference_control_measures?: string;
    number_times_target_demand_is_exceeded?: string;
    status?: number;
    office_id?: number;
    office_name?: string;

    contract_power?: string;
    target_demand?: string;

    base_list?: DemandMeasureEntity[];
    demand_response_list?: DemandMeasureEntity[];
    emergency_response_list?: DemandMeasureEntity[];

    forward_user?: string;
    forward_date?: string;
    approval_user1?: string;
    approval_datetime1?: string;
    approval_comment1?: string;
    approval_user2?: string;
    approval_datetime2?: string;
    approval_comment2?: string;
}

export class DemandSearchEntity extends BaseEntity {
    keyword?: string;
    sort?: SortEntity;
    filter?: {
        [key: string]: CheckboxEntity[];
    };
}

export class DemandFilterEntity extends BaseEntity {
    data_source?: DemandEntity[];
    filter_table?: FilterTableEntity;
}

export class DemandMeasureEntity extends BaseEntity {
    measures_details?: string;
    reduced_power?: number;
}
