import BaseEntity from './base.entity';
import { FilterEntity } from './filter-table.entity';

export class CorrectivesEntity extends BaseEntity {
    corrective_no?: number;
    edition_no?: number;
    office_id?: number;
    status?: number;
    notice_no?: number;
    close_date?: string;
    subject?: string;
    malfunction_no?: number;
    malfunction_subject?: string;
    incident_datetime?: string;
    building_id?: number;
    fuel_type?: number;
    fuel_type_name?: string;
    facility_id?: number;
    facility_detail1?: string;
    failicty_detail2?: string;
    event_id?: number;
    find_user?: string;
    detail?: string;
    attached_file?: string;
    provisional_text?: string;
    provisional_attached_file?: string;
    analysis_text?: string;
    analysis_attached_file?: string;
    correction_detail?: string;
    is_correction?: number;
    request_user_id?: number;
    request_user_name?: string;
    request_date?: string;
    approval1_user_id?: number;
    approval1_user_name?: string;
    approval1_datetime?: string;
    approval1_comment?: string;
    approval2_user_id?: number;
    approval2_user_name?: string;
    approval2_datetime?: string;
    approval2_comment?: string;

    plan_detail?: string;
    plan_attached_file?: string;
    plan_user_id?: number;
    plan_user_name?: string;
    plan_deadline?: string;
    plan_request_user_id?: number;
    plan_request_user_name?: string;
    plan_request_date?: string;
    plan_approval1_user_id?: number;
    plan_approval1_user_name?: string;
    plan_approval1_datetime?: string;
    plan_approval1_comment?: string;
    plan_approval2_user_id?: number;
    plan_approval2_user_name?: string;
    plan_approval2_datetime?: string;
    plan_approval2_comment?: string;
    result_detail?: string;
    is_result_judgment?: number;
    result_attached_file?: string;
    result_request_user_id?: number;
    result_request_user_name?: string;
    result_request_date?: string;
    result_approval1_user_id?: number;
    result_approval1_user_name?: string;
    result_approval1_datetime?: string;
    result_approval1_comment?: string;
    result_approval2_user_id?: number;
    result_approval2_user_name?: string;
    result_approval2_datetime?: string;
    result_approval2_comment?: string;

    office?: string;
    status_name?: string;
}

export class CorrectivesSearchEntity extends FilterEntity {
    keyword?: string;
}
