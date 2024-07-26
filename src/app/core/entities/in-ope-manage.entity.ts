import BaseEntity from './base.entity';
import { CheckboxEntity, FilterTableEntity, SortEntity } from './filter-table.entity';
export class InOpeManageEntity extends BaseEntity {
    id?: number;
    subject?: string;
    office_id?: number;
    status?: number;
    schedule_datetime?: string;
    close_datetime?: string;
    close_user?: string;
    latest_version?: number;

    target_building_type?: number;
    driving_type?: number;
    facility_name?: string;
    facility_detail1?: string;
    facility_detail2?: string;
    work_detail?: string;
    purpose?: string;

    plan_treatment_user?: string;
    plan_schedule_date?: string;
    plan_forward_user?: string;
    plan_forward_date?: string;
    plan_approval_user1?: string;
    plan_approval_datetime1?: string;
    plan_approval_comment1?: string;
    plan_approval_user2?: string;
    plan_approval_datetime2?: string;
    plan_approval_comment2?: string;

    office_name?: string;
}

export class InOpeManageSearchEntity extends BaseEntity {
    keyword?: string;
    sort?: SortEntity;
    filter?: {
        [key: string]: CheckboxEntity[];
    };
}

export class InOpeManageFilterEntity extends BaseEntity {
    data_source?: InOpeManageEntity[];
    filter_table?: FilterTableEntity;
}
