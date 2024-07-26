import BaseEntity from './base.entity';
import { CheckboxEntity, FilterTableEntity, SortEntity } from './filter-table.entity';
export class ConstructionEntity extends BaseEntity {
    id?: number;
    subject?: string;
    office_id?: number;
    close_datetime?: string;
    close_user?: string;

    status?: number;
    construction_date?: string;
    control_number?: string;
    construction_plan_name?: string;
    plan_classification?: string;
    individual_construction_case_name?: string;
    construction_type?: string;
    target_building?: string;
    location_details?: string;
    dynamic_influence?: string;
    sensor_false_alarm_response?: string;
    admission_procedure?: string;
    traffic_work_area_regulations?: string;
    risk_response?: string;
    number_of_people?: string;
    completed_notification?: string;
    date_of_issuance?: string;
    close_date?: string;

    office_name?: string;

    create_user?: string;
    disseminate_forward_user?: string;
    disseminate_forward_date?: string;
    disseminate_approval_user1?: string;
    disseminate_approval_datetime1?: string;
    disseminate_approval_comment1?: string;
    disseminate_approval_user2?: string;
    disseminate_approval_datetime2?: string;
    disseminate_approval_comment2?: string;
    complete_forward_user?: string;
    complete_forward_date?: string;
    complete_approval_user1?: string;
    complete_approval_datetime1?: string;
    complete_approval_comment1?: string;
    complete_approval_user2?: string;
    complete_approval_datetime2?: string;
    complete_approval_comment2?: string;
    individual_construction_list?: IndividualConstructionEntity[];
}

export class IndividualConstructionEntity {
    individual_construction_case_name?: string;
    construction_type?: number;
    internal_person_id?: number;
    internal_person_name?: string;
    construction_company?: string;
    construction_company_representative?: string;
    construction_start_date?: string;
    construction_end_date?: string;
    construction_plan?: string;
    schedule_list?: ScheduleConstructionEntity[];
}

export class ScheduleConstructionEntity {
    scheduled_date?: string;
    target_building_type?: number;
    location_details?: string;
    dynamic_influence?: string;
    sensor_false_alarm_response?: string;
    admission_procedure?: string;
    traffic_work_area_regulations?: string;
    risk_prediction_response?: string;
    number_of_people?: number;
    complete?: number;
}

export class ConstructionSearchEntity extends BaseEntity {
    keyword?: string;
    sort?: SortEntity;
    filter?: {
        [key: string]: CheckboxEntity[];
    };
}

export class ConstructionFilterEntity extends BaseEntity {
    data_source?: ConstructionEntity[];
    filter_table?: FilterTableEntity;
}
